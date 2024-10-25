import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "../../../components/Navbar";
import { getTopic, getAnswers } from "../../../utils/firebase";
import type { Topic, Answer } from "../../../types/firebase";

const ClosedTopicDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [topicData, answersData] = await Promise.all([
          getTopic(id as string),
          getAnswers(id as string),
        ]);
        setTopic(topicData);
        setAnswers(answersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers
    .filter((answer) => answer.id !== topic?.correctAnswerId)
    .slice(indexOfFirstAnswer, indexOfLastAnswer);

  const totalPages = Math.ceil((answers.length - 1) / answersPerPage);

  const correctAnswer = answers.find(
    (answer) => answer.id === topic?.correctAnswerId
  );

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

  if (!topic || !correctAnswer) {
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
          <div className='bg-green-100 p-6 rounded-lg mt-4'>
            <h2 className='text-xl font-bold mb-2'>正解</h2>
            <p className='text-gray-800 text-lg'>{correctAnswer.content}</p>
          </div>
        </div>

        <h3 className='text-xl font-bold mb-4'>他の回答</h3>
        <div className='space-y-4 mb-8'>
          {currentAnswers.map((answer) => (
            <div key={answer.id} className='bg-gray-100 p-4 rounded-lg shadow'>
              <p className='text-gray-800'>{answer.content}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className='flex justify-center space-x-2'>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClosedTopicDetail;
