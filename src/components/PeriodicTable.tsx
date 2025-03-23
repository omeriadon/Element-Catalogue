import React from 'react';
import { Element } from '../types/elements';

interface PeriodicTableProps {
  elements: Element[];
  onElementClick: (element: Element) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, onElementClick }) => {
  // Create a map of elements by atomic number for easier lookup
  const elementsMap = elements.reduce((acc, element) => {
    acc[element.atomicNumber] = element;
    return acc;
  }, {} as Record<number, Element>);
  
  // Define the periodic table layout
  // The table has 18 columns and 7 rows (plus lanthanides and actinides)
  // Each cell contains an atomic number or 0 for empty cells
  const tableLayout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, '*', 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [87, 88, '**', 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, '*', 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    [0, 0, '**', 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103]
  ];
  
  // Helper function to get element category class (using softer colors)
  const getCategoryClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alkali metal': return 'bg-red-300/60 hover:bg-red-300/80';
      case 'alkaline earth metal': return 'bg-orange-300/60 hover:bg-orange-300/80';
      case 'transition metal': return 'bg-yellow-300/60 hover:bg-yellow-300/80';
      case 'post-transition metal': return 'bg-green-300/60 hover:bg-green-300/80';
      case 'metalloid': return 'bg-teal-300/60 hover:bg-teal-300/80';
      case 'polyatomic nonmetal': 
      case 'diatomic nonmetal': 
      case 'nonmetal': return 'bg-blue-300/60 hover:bg-blue-300/80';
      case 'halogen': return 'bg-indigo-300/60 hover:bg-indigo-300/80';
      case 'noble gas': return 'bg-purple-300/60 hover:bg-purple-300/80';
      case 'lanthanide': return 'bg-pink-300/60 hover:bg-pink-300/80';
      case 'actinide': return 'bg-rose-300/60 hover:bg-rose-300/80';
      default: return 'bg-gray-300/60 hover:bg-gray-300/80';
    }
  };
  
  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };
  
  return (
    <div className="overflow-auto max-w-full">
      <div className="min-w-[900px] w-full p-2">
        <table className="w-full border-separate border-spacing-[2px]">
          <thead>
            <tr>
              {/* Empty cell for the corner */}
              <th className="w-6 h-6"></th>
              
              {/* Group numbers (1-18) */}
              {Array.from({ length: 18 }).map((_, index) => (
                <th key={index} className="w-12 h-6 text-center text-gray-400 text-xs font-normal">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableLayout.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 7 ? 'h-4' : ''}>
                {/* Period numbers (1-7, plus gaps for lanthanides/actinides) */}
                {rowIndex < 7 ? (
                  <td className="w-6 text-center text-gray-400 align-middle text-xs">
                    {rowIndex + 1}
                  </td>
                ) : rowIndex === 8 ? (
                  <td className="w-6 text-center text-gray-400 align-middle text-xs">
                    6*
                  </td>
                ) : rowIndex === 9 ? (
                  <td className="w-6 text-center text-gray-400 align-middle text-xs">
                    7*
                  </td>
                ) : (
                  <td className="w-6"></td>
                )}
                
                {/* Element cells */}
                {row.map((atomicNumber, colIndex) => {
                  if (atomicNumber === 0) {
                    return <td key={colIndex} className="w-12 h-12"></td>;
                  }
                  
                  if (atomicNumber === '*' || atomicNumber === '**') {
                    return (
                      <td key={colIndex} className="w-12 h-12 text-center text-blue-600 text-xs">
                        {atomicNumber}
                      </td>
                    );
                  }
                  
                  const element = elementsMap[atomicNumber as number];
                  if (!element) return <td key={colIndex} className="w-12 h-12"></td>;
                  
                  return (
                    <td key={colIndex} className="p-0">
                      <button
                        onClick={() => onElementClick(element)}
                        className={`w-12 h-12 rounded-md ${getCategoryClass(element.category)} 
                                    backdrop-blur-sm border border-blue-400/30 transition-transform
                                    hover:scale-110 hover:z-10 relative text-blue-900`}
                        style={{ 
                          boxShadow: `0 0 5px rgba(${hexToRgb(element.cpkColor || '#FFFFFF')}, 0.3)` 
                        }}
                      >
                        <div className="absolute top-0.5 left-1 text-[8px]">{element.atomicNumber}</div>
                        <div className="text-sm font-bold">{element.symbol}</div>
                        <div className="text-[8px] truncate max-w-full px-0.5">{element.name}</div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Legend with softer colors */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
          {[
            {category: 'Alkali Metal', class: 'bg-red-300/60'},
            {category: 'Alkaline Earth Metal', class: 'bg-orange-300/60'},
            {category: 'Transition Metal', class: 'bg-yellow-300/60'},
            {category: 'Post-transition Metal', class: 'bg-green-300/60'},
            {category: 'Metalloid', class: 'bg-teal-300/60'},
            {category: 'Nonmetal', class: 'bg-blue-300/60'},
            {category: 'Halogen', class: 'bg-indigo-300/60'},
            {category: 'Noble Gas', class: 'bg-purple-300/60'},
            {category: 'Lanthanide', class: 'bg-pink-300/60'},
            {category: 'Actinide', class: 'bg-rose-300/60'}
          ].map(item => (
            <div key={item.category} className="flex items-center">
              <div className={`w-3 h-3 rounded ${item.class} mr-1 border border-blue-400/30`}></div>
              <span className="text-gray-300">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
