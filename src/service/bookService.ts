import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://openlibrary.org';

export interface OpenLibraryBook {
  key: string; 
  title: string;
  author_name?: string[];
  cover_i?: number; 
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  language?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  description?: string;
}

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  language?: string[];
  subject?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
}

export interface BookDetails {
  key: string;
  title: string;
  authors: { author: { key: string, name?: string } }[];
  description?: { value?: string } | string;
  covers?: number[];
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  publishers?: string[];
  publish_date?: string;
  revision?: number;
  latest_revision?: number;
  number_of_pages?: number;
  physical_format?: string;
  works?: { key: string }[];
  language?: { key: string }[];
}


// In bookService.ts, modify the convertToBook function:
export const convertToBook = (doc: OpenLibraryDoc): Book => {
  return {
    id: doc.key.replace('/works/', ''),
    volumeInfo: {
      title: doc.title || '',
      authors: doc.author_name || [],
      imageLinks: doc.cover_i ? {
        thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
        smallThumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
      } : undefined,
      publishedDate: doc.first_publish_year?.toString() || '',
      publisher: doc.publisher?.[0] || '',
      categories: doc.subject || [],
      language: doc.language?.[0] || '',
    }
  };
};


export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

export interface BookSearchResponse {
  items: Book[];
  totalItems: number;
  kind: string;
}

export const searchBooks = async (
  query: string, 
  startIndex: number = 0,
  maxResults: number = 10
): Promise<BookSearchResponse> => {
  try {
    console.log(`Fetching books for query: ${query}, startIndex: ${startIndex}, maxResults: ${maxResults}`);
    
    
    const response = await fetch(
      `${API_BASE_URL}/search.json?q=${encodeURIComponent(query || 'fantasy')}&page=${Math.floor(startIndex/maxResults) + 1}&limit=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data: OpenLibrarySearchResponse = await response.json();
    console.log('API response:', data);
    
    
    const items = data.docs.map(convertToBook);
    
    return {
      items,
      totalItems: data.numFound,
      kind: 'books#volumes'
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book> => {
  try {
    
    const workResponse = await fetch(`${API_BASE_URL}/works/${id}.json`);
    if (!workResponse.ok) {
      throw new Error('Failed to fetch book details');
    }
    
    const workData = await workResponse.json();
    console.log('Work data:', workData);
    
    
    const book: Book = {
      id,
      volumeInfo: {
        title: workData.title,
        description: typeof workData.description === 'object' 
          ? workData.description.value 
          : workData.description,
        authors: workData.authors?.map((author: any) => author.author?.name || 'Unknown').filter(Boolean),
        publishedDate: workData.first_publish_date,
        categories: [
          ...(workData.subjects || []),
          ...(workData.subject_places || []),
          ...(workData.subject_times || [])
        ],
        imageLinks: workData.covers?.[0] ? {
          thumbnail: `https://covers.openlibrary.org/b/id/${workData.covers[0]}-M.jpg`,
          smallThumbnail: `https://covers.openlibrary.org/b/id/${workData.covers[0]}-S.jpg`
        } : undefined,
        pageCount: workData.number_of_pages,
        previewLink: `https://openlibrary.org${workData.key}`,
        language: workData.language?.[0]?.key?.replace('/languages/', '')
      }
    };
    
    return book;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

export const useBookSearch = (query: string, startIndex: number = 0, maxResults: number = 10, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['books', query, startIndex, maxResults],
    queryFn: () => searchBooks(query, startIndex, maxResults),
    enabled: enabled && (query?.length > 0 || query === 'fantasy'),
    staleTime: 1000 * 60 * 5, 
  });
};

export const useBookDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, 
  });
};
