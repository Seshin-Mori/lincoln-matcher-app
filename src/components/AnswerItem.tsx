import React from "react";
import { approveAnswer } from "../utils/firebase";
import type { Answer } from "../types/firebase";

interface Props {
  answer: Answer;
  topicId: string;
}

import { useRouter } from "next/router";

export const AnswerItem: React.FC<Props> = ({ answer, topicId }) => {
  const router = useRouter();

  const handleApprove = async () => {
    try {
      await approveAnswer(topicId, answer.id, "user-id-placeholder", router);
      alert("回答が承認されました！");
    } catch (error) {
      console.error("Error approving answer:", error);
      alert(
        error instanceof Error ? error.message : "回答の承認に失敗しました。"
      );
    }
  };

  return (
    <div className='bg-gray-100 p-4 rounded-lg shadow'>
      <p className='text-gray-800'>{answer.content}</p>
      <button
        onClick={handleApprove}
        className='mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
      >
        正解ボタン
      </button>
    </div>
  );
};
