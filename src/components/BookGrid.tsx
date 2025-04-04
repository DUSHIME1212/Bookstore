
import React from 'react';
import BookCard from './BookCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { BookOpen } from 'lucide-react';
import type { Book } from '@/service/bookService';

interface BookGridProps {
  books: Book[];
  loading: boolean;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ITEMS_PER_PAGE = 8;

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  loading, 
  totalItems,
  currentPage = 1,
  onPageChange
}) => {
  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 
                    Math.ceil((books?.length || 0) / ITEMS_PER_PAGE);

  console.log('Books in BookGrid:', books, 'Total pages:', totalPages);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse apple-card">
            <Skeleton className="h-48 rounded-lg mb-3" />
            <Skeleton className="h-5 rounded-lg w-3/4 mb-2" />
            <Skeleton className="h-4 rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-apple-blue" size={24} />
        </div>
        <p className="text-apple-dark text-lg font-medium">No books found</p>
        <p className="text-apple-gray mt-2">Try another search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-32 gap-6 mt-8">
        {books.map((book, index) => (
          <div key={`${book.id}-${index}`} className="animate-fade-in animate-slide-up">
            <BookCard book={book} index={index} />
          </div>
        ))}
      </div>
      
      {totalPages > 1 && onPageChange && (
        <Pagination className="my-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)} 
                  className="bg-white hover:bg-[#F5F5F7] transition-colors border border-[#E5E5EA] rounded-md"
                />
              </PaginationItem>
            )}
            
            {[...Array(Math.min(totalPages, 10))].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 || 
                page === Math.min(totalPages, 10) || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => onPageChange(page)}
                      className={`${currentPage === page ? 'bg-apple-blue text-white' : 'bg-white hover:bg-[#F5F5F7]'} border border-[#E5E5EA] rounded-md`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (page === 2 && currentPage > 3) || 
                (page === Math.min(totalPages, 10) - 1 && currentPage < Math.min(totalPages, 10) - 2)
              ) {
                return <PaginationItem key={page}>...</PaginationItem>;
              }
              return null;
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)} 
                  className="bg-white hover:bg-[#F5F5F7] transition-colors border border-[#E5E5EA] rounded-md"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BookGrid;
