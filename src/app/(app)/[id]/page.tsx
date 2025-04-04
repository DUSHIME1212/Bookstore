"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, List, MessageSquare, BookCopy, Info, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    previewLink?: string;
  };
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`https://openlibrary.org/works/${id}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        
        const workData = await response.json();
        
        const formattedBook: Book = {
          id,
          volumeInfo: {
            title: workData.title || '',
            description: typeof workData.description === 'object' 
              ? workData.description.value 
              : workData.description || '',
            authors: workData.authors?.map((author: any) => author.author?.name || 'Unknown').filter(Boolean),
            publishedDate: workData.first_publish_date || '',
            categories: [
              ...(workData.subjects || []),
              ...(workData.subject_places || []),
              ...(workData.subject_times || [])
            ],
            imageLinks: workData.covers?.[0] ? {
              thumbnail: `https://covers.openlibrary.org/b/id/${workData.covers[0]}-M.jpg`
            } : undefined,
            pageCount: workData.number_of_pages,
            previewLink: `https://openlibrary.org${workData.key}`,
            language: workData.language?.[0]?.key?.replace('/languages/', ''),
            averageRating: workData.ratings_average,
            ratingsCount: workData.ratings_count,
            publisher: workData.publishers?.[0] || ''
          }
        };
        
        setBook(formattedBook);
      } catch (err) {
        setError('Failed to load book details');
        console.error('Error fetching book details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const renderStarRating = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="fill-apple-blue text-apple-blue" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="text-apple-blue fill-apple-blue/50" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-apple-gray/40" size={16} />);
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-1 text-sm text-apple-dark">
          {rating.toFixed(1)}
          {book?.volumeInfo.ratingsCount && <span className="text-apple-gray"> ({book.volumeInfo.ratingsCount})</span>}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F5F5F7] rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-[#F5F5F7] rounded-md w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-[#F5F5F7] rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-[#F5F5F7] rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-32 bg-[#F5F5F7] rounded w-full max-w-2xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-apple-dark  mb-4">Error loading book details</h2>
        <Link href="/" className="apple-button inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const {
    volumeInfo: {
      title,
      authors,
      description,
      imageLinks,
      publishedDate,
      publisher,
      pageCount,
      categories,
      averageRating,
      language,
      previewLink
    }
  } = book;

  const thumbnail = imageLinks?.thumbnail || '/placeholder.svg';

  return (
    <div className="max-w-4xl mx-auto pt-20 animate-fade-in">
      <Link href="/" className="flex items-center text-apple-blue hover:text-apple-blue/80 mb-6 transition-colors">
        <ChevronLeft size={20} />
        <span>Back to search</span>
      </Link>
      
      <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-6 md:p-8">
        <div className="md:flex gap-8">
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <div className="relative mb-4 rounded-md overflow-hidden bg-[#F5F5F7] w-full max-w-[200px] aspect-[2/3] flex items-center justify-center">
              <img
                src={thumbnail}
                alt={title}
                className="h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {averageRating && (
              <div className="my-3 w-full max-w-[200px]">
                {renderStarRating(averageRating)}
              </div>
            )}
            
            {previewLink && (
              <a
                href={previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button mt-4 text-center w-full max-w-[200px]"
              >
                Preview Book
              </a>
            )}
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-medium text-apple-dark mb-2">{title}</h1>
            
            {authors && (
              <p className="text-apple-blue text-lg mb-4">by {authors.join(', ')}</p>
            )}
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="bg-[#F5F5F7] p-0.5 rounded-lg mb-4 w-full grid grid-cols-6 max-w-2xl">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <BookOpen size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="editions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <BookCopy size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Editions</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Info size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <MessageSquare size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Reviews</span>
                </TabsTrigger>
                <TabsTrigger value="lists" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <List size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Lists</span>
                </TabsTrigger>
                <TabsTrigger value="related" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <BookOpen size={16} className="mr-1 md:mr-2" />
                  <span className="hidden md:inline">Related</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm">
                  {publisher && (
                    <div>
                      <span className="font-medium text-apple-dark">Publisher:</span> {publisher}
                    </div>
                  )}
                  
                  {publishedDate && (
                    <div>
                      <span className="font-medium text-apple-dark">Published:</span> {publishedDate}
                    </div>
                  )}
                  
                  {pageCount && (
                    <div>
                      <span className="font-medium text-apple-dark">Pages:</span> {pageCount}
                    </div>
                  )}
                  
                  {language && (
                    <div>
                      <span className="font-medium text-apple-dark">Language:</span> {language.toUpperCase()}
                    </div>
                  )}
                </div>
                
                {categories && categories.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {categories.slice(0, 10).map((category, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-[#F5F5F7] text-apple-dark rounded-full text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                
                {description && (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-medium text-apple-dark mb-2">Description</h3>
                    <div 
                      dangerouslySetInnerHTML={{ __html: description }} 
                      className="text-apple-dark leading-relaxed"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="editions" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-[#F5F5F7]/50 rounded-md p-6 text-center">
                  <BookCopy size={24} className="text-apple-blue mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-apple-dark mb-2">Editions</h3>
                  <p className="text-apple-gray text-sm">
                    Different editions of "{title}" will be displayed here when available.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {publisher && (
                      <div>
                        <h4 className="text-sm font-medium text-apple-dark">Publisher</h4>
                        <p className="text-apple-gray">{publisher}</p>
                      </div>
                    )}
                    
                    {publishedDate && (
                      <div>
                        <h4 className="text-sm font-medium text-apple-dark">Published Date</h4>
                        <p className="text-apple-gray">{publishedDate}</p>
                      </div>
                    )}
                    
                    {pageCount && (
                      <div>
                        <h4 className="text-sm font-medium text-apple-dark">Page Count</h4>
                        <p className="text-apple-gray">{pageCount}</p>
                      </div>
                    )}
                    
                    {language && (
                      <div>
                        <h4 className="text-sm font-medium text-apple-dark">Language</h4>
                        <p className="text-apple-gray">{language.toUpperCase()}</p>
                      </div>
                    )}
                    
                    {categories && categories.length > 0 && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-apple-dark">Categories</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {categories.map((category, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-[#F5F5F7] text-apple-dark rounded-full text-xs"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-[#F5F5F7]/50 rounded-md p-6 text-center">
                  <MessageSquare size={24} className="text-apple-blue mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-apple-dark mb-2">Reviews</h3>
                  <p className="text-apple-gray text-sm">
                    Reader reviews will be displayed here when available.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="lists" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-[#F5F5F7]/50 rounded-md p-6 text-center">
                  <List size={24} className="text-apple-blue mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-apple-dark mb-2">Lists</h3>
                  <p className="text-apple-gray text-sm">
                    "{title}" appears on these lists. Coming soon!
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-[#F5F5F7]/50 rounded-md p-6 text-center">
                  <BookOpen size={24} className="text-apple-blue mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-apple-dark mb-2">Related Books</h3>
                  <p className="text-apple-gray text-sm">
                    Books similar to "{title}" will be displayed here. Coming soon!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;