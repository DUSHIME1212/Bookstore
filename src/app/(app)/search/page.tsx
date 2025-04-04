"use client"

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BookGrid from '@/components/BookGrid';
import FilterPanel from '@/components/FilterPanel';
import type { Filters } from '@/components/FilterPanel';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
    categories?: string[];
    language?: string;
  };
}

interface BookSearchResponse {
  items: Book[];
  totalItems: number;
}

const SearchPage: React.FC = () => {
  const location = usePathname();
  const queryParams = new URLSearchParams(location);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    languages: [],
    subjects: [],
    yearRange: [null, null]
  });
  const itemsPerPage = 8;

  const searchBooks = async (query: string, startIndex: number, maxResults: number) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${Math.floor(startIndex/maxResults) + 1}&limit=${maxResults}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      
      const items = data.docs.map((doc: any) => ({
        id: doc.key.replace('/works/', ''),
        volumeInfo: {
          title: doc.title || '',
          authors: doc.author_name || [],
          imageLinks: doc.cover_i ? {
            thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          } : undefined,
          publishedDate: doc.first_publish_year?.toString() || '',
          publisher: doc.publisher?.[0] || '',
          categories: doc.subject || [],
          language: doc.language?.[0] || '',
        }
      }));
      
      return {
        items,
        totalItems: data.numFound
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchQuery) {
        setBooks([]);
        setTotalItems(0);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await searchBooks(
          searchQuery,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage
        );
        setBooks(result.items);
        setTotalItems(result.totalItems);
      } catch (err) {
        setError('Failed to load books');
        toast.error(
          <>
            <p>Sorry, an error occurred while fetching data.</p>
            <p>Please try again later.</p>
          </>,
          {
            duration: 5000,
            description: 'If the problem persists, please contact support.',
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, currentPage]);

  // Extract available filter options from the current results
  const availableLanguages = Array.from(
    new Set(books.map(book => book.volumeInfo.language).filter(Boolean))
  ) as string[];
  
  const availableSubjects = Array.from(
    new Set(books.flatMap(book => book.volumeInfo.categories || []).filter(Boolean))
  ) as string[];

  // Filter the books based on selected filters
  const filteredBooks = books.filter(book => {
    // Language filter
    if (filters.languages.length > 0 && book.volumeInfo.language) {
      if (!filters.languages.includes(book.volumeInfo.language)) {
        return false;
      }
    }
    
    // Subject/category filter
    if (filters.subjects.length > 0 && book.volumeInfo.categories) {
      const bookSubjects = book.volumeInfo.categories;
      if (!filters.subjects.some(subject => bookSubjects.includes(subject))) {
        return false;
      }
    }
    
    // Year filter
    if (filters.yearRange[0] || filters.yearRange[1]) {
      const publishYear = book.volumeInfo.publishedDate ? 
        parseInt(book.volumeInfo.publishedDate.substring(0, 4)) : null;
        
      if (publishYear) {
        if (filters.yearRange[0] && publishYear < filters.yearRange[0]) {
          return false;
        }
        if (filters.yearRange[1] && publishYear > filters.yearRange[1]) {
          return false;
        }
      }
    }
    
    return true;
  });

  useEffect(() => {
    // Update search query when URL changes
    const query = queryParams.get('q') || '';
    setSearchQuery(query);
    setCurrentPage(1);
  }, [location]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className='px-8 md:px-16 lg:px-32 pb-10'>
      <div className="flex items-center justify-center mt-32 mb-8">
        <div className="w-10 h-10 bg-apple-blue/10 rounded-full flex items-center justify-center mr-3">
          <Search className="text-apple-blue" size={18} />
        </div>
        <h1 className="text-3xl font-semibold text-apple-dark">
          {searchQuery ? `Results for "${searchQuery}"` : 'Browse Books'}
        </h1>
      </div>
      
      <div className="mb-10">
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      <FilterPanel 
        onFilterChange={handleFilterChange}
        availableLanguages={availableLanguages}
        availableSubjects={availableSubjects}
      />
      
      {error ? (
        <div className="text-center py-10">
          <p className="text-apple-red font-medium">Error loading books. Please try again later.</p>
        </div>
      ) : (
        <BookGrid 
          books={filteredBooks} 
          loading={isLoading} 
          totalItems={filteredBooks.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      
      {filteredBooks.length === 0 && !isLoading && searchQuery && (
        <div className="text-center py-8">
          <p className="text-lg text-apple-dark">No books match your filter criteria. Try adjusting your filters.</p>
        </div>
      )}
      
      {books.length === 0 && !isLoading && searchQuery && (
        <div className="text-center py-8">
          <p className="text-lg text-apple-dark">No books found. Try another search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;