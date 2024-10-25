import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { getClosedTopics } from "../../utils/firebase";
import type { Topic } from "../../types/firebase";

const TopicArchive = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 10;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const closedTopics = await getClosedTopics();
        setTopics(closedTopics);
      } catch (error) {
        console.error("Error fetching closed topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = topics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(topics.length / topicsPerPage);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>正解決定済みのお題一覧</h1>

        {loading ? (
          <div className='text-center'>読み込み中...</div>
        ) : topics.length > 0 ? (
          <>
            <div className='space-y-4'>
              {currentTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topic/${topic.id}/closed`}
                  className='block bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'
                >
                  <h2 className='text-xl font-bold text-blue-600 hover:text-blue-800'>
                    {topic.title}
                  </h2>
                  <p className='mt-2 text-gray-600'>
                    正解: {topic.correctAnswer}
                  </p>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className='flex justify-center mt-8 space-x-2'>
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
          </>
        ) : (
          <div className='text-center text-gray-600'>
            正解決定済みのお題はありません。
          </div>
        )}
      </main>
    </div>
  );
};

export default TopicArchive;
