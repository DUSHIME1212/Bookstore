
import React, { type ReactNode } from 'react';
import { BookOpen, Search, Home } from 'lucide-react';
import Link from 'next/link';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/75 border-b border-[#E5E5EA]">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-apple-blue rounded-xl transition-colors duration-200">
              <BookOpen className="text-white" size={18} />
            </div>
            <span className="text-xl font-semibold text-apple-dark">BookStore</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-apple-dark hover:text-apple-blue transition-colors flex items-center gap-1">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link href="/search" className="text-apple-dark hover:text-apple-blue transition-colors flex items-center gap-1">
              <Search size={16} />
              <span>Browse</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-semibold text-apple-dark mb-6">Welcome to BookStore</h1>
        <p className="text-lg text-apple-gray mb-6">Discover a world of books at your fingertips.</p>
        {children}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-[#E5E5EA]">
        <div className="container mx-auto px-4 md:px-6 text-center text-apple-gray">
          <p>BookStore &copy; {new Date().getFullYear()} - Designed with Apple aesthetics</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
