import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className='bg-white shadow'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <Link href='/' className='flex items-center'>
              <span className='text-xl font-bold'>
                大喜利バトル それ、正解！
              </span>
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              href='/submit-topic'
              className='text-gray-700 hover:text-gray-900'
            >
              お題を投稿
            </Link>
            <Link href='/topics' className='text-gray-700 hover:text-gray-900'>
              正解済み一覧
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
