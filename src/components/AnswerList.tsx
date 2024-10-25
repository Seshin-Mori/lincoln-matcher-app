import React, { useState } from "react";
import { AnswerItem } from "./AnswerItem";
import type { Answer } from "../types/firebase";

interface Props {
  answers: Answer[];
  topicId: string;
}

export const AnswerList: React.FC<Props> = ({ answers, topicId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 10;

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  const totalPages = Math.ceil(answers.length / answersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className='space-y-4'>
        {currentAnswers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} topicId={topicId} />
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
