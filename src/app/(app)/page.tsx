"use client"

import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import BookGrid from '../../components/BookGrid';
import FilterPanel from '../../components/FilterPanel';
import type { Filters } from '../../components/FilterPanel';
import { BookOpen } from 'lucide-react';
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

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('fantasy');
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

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${itemsPerPage}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      
      const formattedBooks = data.docs.map((doc: any) => ({
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
      
      setBooks(formattedBooks);
      setTotalItems(data.numFound);
    } catch (err) {
      setError('Failed to load books');
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, currentPage]);

  
  const availableLanguages = Array.from(
    new Set(books.map(book => book.volumeInfo.language).filter(Boolean) as string[])
  );
  
  const availableSubjects = Array.from(
    new Set(books.flatMap(book => book.volumeInfo.categories || []).filter(Boolean))
  );

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
    <div className="pb-10 px-8 md:px-16 lg:px-32">
      <div className="text-center mb-12 pt-8">
        <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-apple-blue" size={24} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold text-apple-dark mb-4">
          BookStore
        </h1>
        <p className="text-lg text-apple-gray max-w-2xl mx-auto">
          Discover books with a beautiful, minimalist interface
        </p>
      </div>
      
      <div className="mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      <FilterPanel 
        onFilterChange={handleFilterChange}
        availableLanguages={availableLanguages}
        availableSubjects={availableSubjects}
      />
      
      <div className=''>
        <h2 className="text-2xl font-medium text-apple-dark mb-6 border-b border-[#E5E5EA] pb-2">Featured Books</h2>
        <BookGrid 
          books={filteredBooks} 
          loading={isLoading} 
          totalItems={filteredBooks.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        {filteredBooks.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-lg text-apple-dark">No books found. Try another search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;