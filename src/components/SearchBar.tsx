
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      navigate.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, and more..."
            className="w-full py-3 px-6 pl-12 bg-white/90 backdrop-blur-sm rounded-full border border-[#E5E5EA] shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
        </div>
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-apple-blue hover:bg-apple-blue/90 text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
