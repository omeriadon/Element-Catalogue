import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search elements by name, symbol, atomic number...' 
}) => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the search input when pressing '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };
  
  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
    searchInputRef.current?.focus();
  };
  
  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 rounded-xl bg-gray-800/70 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
          <i className="bi bi-search"></i>
        </div>
        
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            aria-label="Clear search"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>
      
      <div className="absolute right-3 bottom-1 text-xs text-gray-500">
        Press "/" to focus
      </div>
    </div>
  );
};

export default SearchBar;
