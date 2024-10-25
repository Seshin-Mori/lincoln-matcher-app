import { useState } from "react";
import { submitAnswer } from "../utils/firebase";

interface Props {
  topicId: string;
  onSubmitSuccess?: () => void;
}

export const AnswerSubmissionForm: React.FC<Props> = ({
  topicId,
  onSubmitSuccess,
}) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitAnswer(topicId, content.trim());
      setContent("");
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("回答の投稿に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white rounded-lg shadow p-6 mb-8'
    >
      <div className='mb-4'>
        <label htmlFor='answer' className='block text-gray-700 font-bold mb-2'>
          回答を投稿
        </label>
        <textarea
          id='answer'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
          placeholder='あなたの回答を入力してください'
          disabled={submitting}
        />
      </div>
      <button
        type='submit'
        disabled={submitting || !content.trim()}
        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {submitting ? "投稿中..." : "回答を投稿"}
      </button>
    </form>
  );
};
