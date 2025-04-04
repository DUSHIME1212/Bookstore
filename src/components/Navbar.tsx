import { BookOpen, Home, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className="sticky px-8 md:px-16 lg:px-32 top-0 z-10 backdrop-blur-xl bg-white/75 border-b border-[#E5E5EA]">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl transition-colors duration-200">
              <BookOpen className="text-white" size={18} />
            </div>
            <span className="text-xl font-semibold text-apple-dark">BookStore</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-apple-dark hover:text-apple-blue transition-colors flex items-center gap-1">
              <Home size={16} />
              <span className='max-md:hidden'>Home</span>
            </Link>
            <Link href="/search" className="text-apple-dark hover:text-apple-blue transition-colors flex items-center gap-1">
              <Search size={16} />
              <span className='max-md:hidden'>Browse</span>
            </Link>
          </div>
        </div>
      </header>
  )
}

export default Navbar