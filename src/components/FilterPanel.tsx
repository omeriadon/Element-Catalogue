import React, { useState } from 'react';
import { ElementFilters, SortOption, Element } from '@/types/elements';

interface FilterPanelProps {
  filters: ElementFilters;
  setFilters: React.Dispatch<React.SetStateAction<ElementFilters>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  elementData: Element[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  setFilters, 
  sortOption, 
  setSortOption,
  elementData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract unique values for filter categories
  const categories = [...new Set(elementData.map(e => e.category))];
  const groups = [...new Set(elementData.map(e => e.group))].filter(Boolean).sort((a, b) => a - b);
  const periods = [...new Set(elementData.map(e => e.period))].filter(Boolean).sort((a, b) => a - b);
  const blocks = [...new Set(elementData.map(e => e.block))];
  const states = [...new Set(elementData.map(e => e.standardState))].filter(Boolean);
  
  // Count active filters
  const activeFilterCount = 
    filters.category.length + 
    filters.group.length + 
    filters.period.length + 
    filters.block.length + 
    filters.standardState.length;
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof ElementFilters, value: string | number) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      
      // If value is already in the array, remove it, otherwise add it
      const newValues = currentValues.includes(value as never) 
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as never];
        
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };
  
  // Handle sort changes
  const handleSortChange = (field: keyof Element) => {
    setSortOption(prev => {
      if (prev.field === field) {
        // Toggle direction if same field
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // New field, default to ascending
      return {
        field,
        direction: 'asc'
      };
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      category: [],
      group: [],
      period: [],
      block: [],
      standardState: []
    });
  };
  
  return (
    <div className="mb-6 relative">
      {/* Filter Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-auto px-5 py-3 bg-blue-300/60 hover:bg-blue-300/80 text-blue-800 rounded-lg transition-colors shadow-sm"
      >
        <div className="flex items-center">
          <i className="bi bi-funnel me-2"></i>
          <span className="font-medium">Filter & Sort</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-3`}></i>
      </button>
      
      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-blue-300/50 text-blue-900 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-800">Filter & Sort Elements</h2>
            <button 
              onClick={clearAllFilters}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors flex items-center"
            >
              <i className="bi bi-trash me-1"></i> Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                <i className="bi bi-tags me-2"></i>Category
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={filters.category.includes(category)}
                      onChange={() => handleFilterChange('category', category)}
                      className="w-4 h-4 rounded bg-blue-100 border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-blue-800">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Group Filter */}
            <div>
              <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                <i className="bi bi-columns-gap me-2"></i>Group
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {groups.map(group => (
                  <div key={group} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`group-${group}`}
                      checked={filters.group.includes(group)}
                      onChange={() => handleFilterChange('group', group)}
                      className="w-4 h-4 rounded bg-blue-100 border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`group-${group}`} className="ml-2 text-sm text-blue-800">
                      {group}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Period Filter */}
            <div>
              <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                <i className="bi bi-bar-chart-steps me-2"></i>Period
              </h3>
              <div className="space-y-1">
                {periods.map(period => (
                  <div key={period} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`period-${period}`}
                      checked={filters.period.includes(period)}
                      onChange={() => handleFilterChange('period', period)}
                      className="w-4 h-4 rounded bg-blue-100 border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`period-${period}`} className="ml-2 text-sm text-blue-800">
                      {period}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Block Filter */}
            <div>
              <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                <i className="bi bi-grid-3x3 me-2"></i>Block
              </h3>
              <div className="space-y-1">
                {blocks.map(block => (
                  <div key={block} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`block-${block}`}
                      checked={filters.block.includes(block)}
                      onChange={() => handleFilterChange('block', block)}
                      className="w-4 h-4 rounded bg-blue-100 border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`block-${block}`} className="ml-2 text-sm text-blue-800">
                      {block}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Standard State Filter */}
            <div>
              <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                <i className="bi bi-thermometer-half me-2"></i>State
              </h3>
              <div className="space-y-1">
                {states.map(state => (
                  <div key={state} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`state-${state}`}
                      checked={filters.standardState.includes(state as string)}
                      onChange={() => handleFilterChange('standardState', state as string)}
                      className="w-4 h-4 rounded bg-blue-100 border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`state-${state}`} className="ml-2 text-sm text-blue-800">
                      {state}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sorting Options */}
          <div className="mt-6 border-t border-blue-200 pt-4">
            <h3 className="font-medium mb-2 text-blue-700 flex items-center">
              <i className="bi bi-sort-alpha-down me-2"></i>Sort By
            </h3>
            <div className="flex flex-wrap gap-2">
              {['atomicNumber', 'name', 'atomicMass', 'electronegativity', 'yearDiscovered'].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field as keyof Element)}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                    sortOption.field === field 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  {sortOption.field === field && (
                    <i className={`bi ${sortOption.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'} ms-1`}></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
