
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Book } from '@/service/bookService';

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index }) => {
  const navigate = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    navigate.push(`/${book.id}`);
  };

  
  const thumbnail = imageError ? 
    '/placeholder.svg' : 
    book.volumeInfo.imageLinks?.thumbnail || 
    book.volumeInfo.imageLinks?.smallThumbnail || 
    '/placeholder.svg';
    
  const title = book.volumeInfo.title || 'Unknown Title';
  const authors = book.volumeInfo.authors?.join(', ') || 'Unknown Author';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="apple-card cursor-pointer h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-apple-hover hover:translate-y-[-2px]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="mb-3 relative overflow-hidden rounded-lg h-48 bg-[#F5F5F7] flex items-center justify-center">
        <div className={`absolute inset-0 bg-apple-blue/5 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
        <img
          src={thumbnail}
          alt={title}
          className={`h-full object-contain transition-all duration-300 ${isHovering ? 'scale-105' : 'scale-100'}`}
          onError={(e) => {
            console.log(`Image error loading: ${thumbnail}`);
            setImageError(true);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
          <div className="absolute bottom-0 left-0 right-0  fr to-transparent p-2 text-white text-xs text-center">
            View Details
          </div>
        
      </div>
      <h3 className="font-medium text-apple-dark line-clamp-2 text-shadow-2xs text-lg">{title}</h3>
      <p className="text-sm text-apple-gray mt-1">{authors}</p>
      
     
        <div className="mt-2 flex items-center gap-1 text-apple-blue text-sm">
          <BookOpen size={14} />
          <span>Read more</span>
        </div>
      
    </div>
  );
};

export default BookCard;
