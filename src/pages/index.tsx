import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { getCurrentTopic } from "../utils/firebase";
import type { Topic } from "../types/firebase";

const Home: NextPage = () => {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTopic = async () => {
      try {
        const topic = await getCurrentTopic();
        setCurrentTopic(topic);
      } catch (error) {
        console.error("Error fetching current topic:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTopic();
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>現在募集中のお題</h1>
        {loading ? (
          <div className='text-center'>読み込み中...</div>
        ) : currentTopic ? (
          <div className='bg-white rounded-lg shadow p-6'>
            <Link href={`/topic/${currentTopic.id}`} className='block'>
              <h2 className='text-xl font-bold text-blue-600 hover:text-blue-800'>
                {currentTopic.title}
              </h2>
            </Link>
            <p className='mt-2 text-gray-600'>
              現在の回答募集中のお題です。クリックして回答を投稿してください。
            </p>
          </div>
        ) : (
          <div className='text-center text-gray-600'>
            現在募集中のお題はありません。
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
