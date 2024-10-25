import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "../../../components/Navbar";
import { AnswerSubmissionForm } from "../../../components/AnswerSubmissionForm";
import { AnswerList } from "../../../components/AnswerList";
import { getCurrentTopic, getAnswers } from "../../../utils/firebase";
import type { Topic, Answer } from "../../../types/firebase";

const TopicDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = async () => {
    if (!id) return;
    const answersData = await getAnswers(id as string);
    setAnswers(answersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const topicData = await getCurrentTopic();
        setTopic(topicData);
        await fetchAnswers(); // 最新の回答を取得
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <main className='container mx-auto px-4 py-8'>
          <div className='text-center'>読み込み中...</div>
        </main>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <main className='container mx-auto px-4 py-8'>
          <div className='text-center text-gray-600'>
            お題が見つかりませんでした。
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <h1 className='text-2xl font-bold mb-4'>{topic.title}</h1>
          <p className='text-gray-600'>
            面白い回答は「それ、正解！」面白かったら遠慮なく正解ボタンを押してください。
          </p>
        </div>

        <AnswerSubmissionForm
          topicId={id as string}
          onSubmitSuccess={fetchAnswers}
        />
        <AnswerList answers={answers} topicId={id as string} />
      </main>
    </div>
  );
};

export default TopicDetail;
