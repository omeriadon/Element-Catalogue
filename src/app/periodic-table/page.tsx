'use client';

import React, { useState } from 'react';
import PeriodicTable from '@/components/PeriodicTable';
import ElementDetailPopup from '@/components/ElementDetailPopup';
import { Element, ElementsData, mapAllElements } from '@/types/elements';
import elementData from '../../../public/elementData.json';

// Transform the JSON data to match our Element interface
const elements = mapAllElements(elementData as ElementsData);

export default function PeriodicTablePage() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-blue-300">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Interactive Periodic Table
      </h1>
      
      <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 p-2 overflow-x-auto">
        <PeriodicTable 
          elements={elements}
          onElementClick={setSelectedElement}
        />
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
