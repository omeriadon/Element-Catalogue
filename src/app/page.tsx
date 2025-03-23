'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ElementCard from '@/components/ElementCard';
import ElementDetailPopup from '@/components/ElementDetailPopup';
import { Element, ElementFilters, SortOption, ElementsData, mapAllElements } from '@/types/elements';
import elementData from '../../public/elementData.json';

// Transform the JSON data to match our Element interface
const elements: Element[] = mapAllElements(elementData as ElementsData);

export default function ListViewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ElementFilters>({
    category: [],
    group: [],
    period: [],
    block: [],
    standardState: []
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'atomicNumber',
    direction: 'asc'
  });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  
  const filteredElements = useMemo(() => {
    let result = [...elements];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(element => 
        element.name.toLowerCase().includes(query) ||
        element.symbol.toLowerCase().includes(query) ||
        element.atomicNumber.toString().includes(query)
      );
    }
    
    // Apply filters
    if (filters.category.length) {
      result = result.filter(element => filters.category.includes(element.category));
    }
    if (filters.group.length) {
      result = result.filter(element => filters.group.includes(element.group));
    }
    if (filters.period.length) {
      result = result.filter(element => filters.period.includes(element.period));
    }
    if (filters.block.length) {
      result = result.filter(element => filters.block.includes(element.block));
    }
    if (filters.standardState.length) {
      result = result.filter(element => element.standardState !== null && filters.standardState.includes(element.standardState));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue as string)
        : (aValue as number) - (bValue as number);
      return sortOption.direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [elements, searchQuery, filters, sortOption]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">
        <i className="bi bi-flask me-2"></i>
        Explore Chemical Elements
      </h1>
      
      <SearchBar onSearch={setSearchQuery} />
      
      <FilterPanel 
        filters={filters}
        setFilters={setFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        elementData={elements}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredElements.map(element => (
          <ElementCard 
            key={element.atomicNumber}
            element={element}
            onClick={setSelectedElement}
          />
        ))}
        
        {filteredElements.length === 0 && (
          <div className="col-span-full p-12 text-center text-blue-600">
            <i className="bi bi-emoji-frown text-4xl mb-3 block"></i>
            <p className="text-xl">No elements found with the current filters and search criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: [],
                  group: [],
                  period: [],
                  block: [],
                  standardState: []
                });
              }}
              className="mt-4 px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-lg inline-flex items-center"
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {selectedElement && (
        <ElementDetailPopup 
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
}
