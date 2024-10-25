import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { submitTopicPhrase } from "../utils/firebase";

const SubmitTopic = () => {
  const [phrase, setPhrase] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phrase.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitTopicPhrase(phrase.trim());
      setPhrase("");
      setMessage({
        type: "success",
        text: "お題フレーズが登録されました。",
      });
    } catch (error) {
      console.error("Error submitting topic phrase:", error);
      setMessage({
        type: "error",
        text: "お題フレーズの登録に失敗しました。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>新しいお題フレーズを投稿</h1>

        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <p className='text-gray-600 mb-4'>
            投稿されたお題フレーズは、「ひらがな一文字 +
            フレーズ」の形式で使用されます。
            <br />
            例：「おいしいものは？」→「あ」からはじまるおいしいものは？」
          </p>

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='phrase'
                className='block text-gray-700 font-bold mb-2'
              >
                お題フレーズ
              </label>
              <input
                type='text'
                id='phrase'
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='例：おいしいものは？'
                disabled={submitting}
              />
            </div>
            <button
              type='submit'
              disabled={submitting || !phrase.trim()}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {submitting ? "投稿中..." : "お題フレーズを投稿"}
            </button>
          </form>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmitTopic;
