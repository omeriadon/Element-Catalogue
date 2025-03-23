import React from 'react';
import { Element } from '../types/elements';

interface ElementCardProps {
  element: Element;
  onClick: (element: Element) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const cardBgColor = element.cpkColor ? 
    `rgba(${hexToRgb(element.cpkColor)}, 0.15)` : 
    'rgba(200, 220, 255, 0.15)';
  
  const borderColor = element.cpkColor ? 
    `rgba(${hexToRgb(element.cpkColor)}, 0.6)` : 
    'rgba(200, 220, 255, 0.6)';
  
  return (
    <div 
      className="rounded-xl backdrop-blur-sm p-4 transition-all hover:scale-105 cursor-pointer"
      style={{ 
        backgroundColor: cardBgColor,
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: `0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 1px ${borderColor}`
      }}
      onClick={() => onClick(element)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-blue-600">{element.atomicNumber}</span>
        <span className="text-sm text-blue-600">{element.atomicMass.toFixed(2)}</span>
      </div>
      
      <div className="text-center mb-2">
        <h2 className="text-4xl font-bold" style={{ color: element.cpkColor || '#3B82F6' }}>
          {element.symbol}
        </h2>
        <p className="text-lg text-white">{element.name}</p>
      </div>
      
      <div className="mt-4 text-sm opacity-80">
        <p>Category: {element.category}</p>
        <p className="flex items-center">
          <i className="bi bi-columns-gap me-1"></i>
          Group: {element.group}, 
          <i className="bi bi-bar-chart-steps ms-2 me-1"></i>
          Period: {element.period}
        </p>
      </div>
    </div>
  );
};

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

export default ElementCard;
