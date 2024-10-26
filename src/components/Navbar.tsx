import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='bg-white shadow'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex'>
            <Link href='/' className='flex items-center'>
              <span className='text-lg font-bold'>大喜利 それ、正解！</span>
            </Link>
          </div>
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-gray-700 focus:outline-none'
            >
              {isOpen ? "✖️" : "☰"}
            </button>
          </div>
          <div
            className={`flex-col md:flex md:flex-row md:items-center ${
              isOpen ? "flex" : "hidden"
            } md:flex`}
          >
            <div className='flex md:flex-row'>
              <Link
                href='/submit-topic'
                className='text-gray-700 hover:text-gray-900 md:mr-4'
                onClick={() => setIsOpen(false)}
              >
                お題を投稿
              </Link>
              <div className='mx-2 md:mx-0' />
              <Link
                href='/topics'
                className='text-gray-700 hover:text-gray-900'
                onClick={() => setIsOpen(false)}
              >
                正解済み一覧
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
