import React, { useEffect, useRef, useState } from 'react';
import { Element } from '../types/elements';
import SpectralVisualizer from './SpectralVisualizer';

interface ElementDetailPopupProps {
  element: Element | null;
  onClose: () => void;
}

interface ElementImages {
  bohr: string | null;
  element: string | null;
}

const ElementDetailPopup: React.FC<ElementDetailPopupProps> = ({ element, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ElementImages>({
    bohr: null,
    element: null
  });
  const [loading, setLoading] = useState(true);
  const [showSpectral, setShowSpectral] = useState(false);
  
  // Fetch element images from the JSON data when element changes
  useEffect(() => {
    if (!element) return;
    
    const fetchElementImages = async () => {
      setLoading(true);
      
      try {
        // Get element data from elementData.json
        const response = await fetch('/elementData.json');
        const data = await response.json();
        
        // Find the element in the JSON data
        const jsonElement = data.elements.find((e: any) => e.number === element.atomicNumber);
        
        if (jsonElement) {
          // Try to generate an element image URL based on element name
          const formattedName = element.name.toLowerCase().replace(/\s+/g, '-');
          const elementImageUrl = `https://images-of-elements.com/${formattedName}.jpg`;
          
          setImages({
            bohr: jsonElement.bohr_model_image || null,
            element: elementImageUrl
          });
        }
      } catch (error) {
        console.error('Error fetching element images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchElementImages();
  }, [element]);
  
  // Handle ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Close if clicking outside the popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  if (!element) return null;
  
  const themeColor = element.cpkColor || '#FFFFFF';
  const rgbColor = hexToRgb(themeColor);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-500/30 backdrop-blur-md">
      <div 
        ref={popupRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ 
          backgroundColor: `rgba(25, 25, 35, 0.95)`,
          borderLeft: `6px solid rgba(${rgbColor}, 0.8)`,
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(${rgbColor}, 0.3)`
        }}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-200 hover:bg-gray-600 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="p-8">
          <header className="mb-8 border-b border-gray-700 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-5xl font-bold mb-2" style={{ color: themeColor }}>
                  {element.symbol} <span className="text-3xl font-normal text-gray-300">· {element.name}</span>
                </h2>
                <p className="text-xl text-gray-300">Atomic Number: {element.atomicNumber} | Atomic Mass: {element.atomicMass.toFixed(4)}</p>
              </div>
              <div className="text-right">
                <div 
                  className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl font-bold"
                  style={{ backgroundColor: `rgba(${rgbColor}, 0.3)`, color: themeColor }}
                >
                  {element.atomicNumber}
                </div>
              </div>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Basic Information</h3>
              <div className="space-y-2 text-gray-300">
                <InfoRow label="Category" value={element.category} />
                <InfoRow label="Group" value={element.group.toString()} />
                <InfoRow label="Period" value={element.period.toString()} />
                <InfoRow label="Block" value={element.block} />
                <InfoRow label="Standard State" value={element.standardState || 'Unknown'} />
                <InfoRow label="Discovered By" value={element.discoveredBy || 'Unknown'} />
                <InfoRow label="Year Discovered" value={element.yearDiscovered?.toString() || 'Unknown'} />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 mt-8" style={{ color: themeColor }}>Physical Properties</h3>
              <div className="space-y-2 text-gray-300">
                <InfoRow label="Density" value={element.density ? `${element.density} g/cm³` : 'Unknown'} />
                <InfoRow label="Melting Point" value={element.meltingPoint ? `${element.meltingPoint} K` : 'Unknown'} />
                <InfoRow label="Boiling Point" value={element.boilingPoint ? `${element.boilingPoint} K` : 'Unknown'} />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Electronic Properties</h3>
              <div className="space-y-2 text-gray-300">
                <InfoRow label="Electron Configuration" value={element.electronConfiguration} />
                <InfoRow label="Electronegativity" value={element.electronegativity?.toString() || 'Unknown'} />
                <InfoRow label="Atomic Radius" value={element.atomicRadius ? `${element.atomicRadius} pm` : 'Unknown'} />
                <InfoRow label="Ionization Energy" value={element.ionizationEnergy ? `${element.ionizationEnergy} eV` : 'Unknown'} />
                <InfoRow label="Electron Affinity" value={element.electronAffinity ? `${element.electronAffinity} eV` : 'Unknown'} />
                <InfoRow label="Oxidation States" value={element.oxidationStates?.join(', ') || 'Unknown'} />
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Description</h3>
            <p className="text-gray-300 leading-relaxed">{element.description || 'No description available.'}</p>
          </div>
          
          {/* Tabs for Images/Spectral View */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="flex border-b border-gray-700 mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium ${!showSpectral ? `border-b-2 border-[${themeColor}] text-gray-200` : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setShowSpectral(false)}
              >
                <i className="bi bi-image me-2"></i>Images
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${showSpectral ? `border-b-2 border-[${themeColor}] text-gray-200` : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setShowSpectral(true)}
              >
                <i className="bi bi-rainbow me-2"></i>Spectral View
              </button>
            </div>
            
            {showSpectral ? (
              <SpectralVisualizer element={element} />
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Element Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Element Image */}
                  <div className="aspect-square rounded-lg bg-gray-800 p-4 flex flex-col items-center justify-center">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <i className="bi bi-hourglass-split text-3xl text-blue-500"></i>
                      </div>
                    ) : images.element ? (
                      <div className="h-full flex flex-col">
                        <img 
                          src={images.element}
                          alt={`${element.name} image`}
                          className="max-h-full object-contain flex-grow rounded" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                          }}
                        />
                        <span className="mt-2 text-blue-300 text-sm text-center">
                          {element.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <i className="bi bi-image text-3xl text-gray-500 mb-2"></i>
                        <span className="text-gray-400 text-sm text-center">No element image available</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bohr Model Image */}
                  <div className="aspect-square rounded-lg bg-gray-800 p-4 flex flex-col items-center justify-center">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <i className="bi bi-hourglass-split text-3xl text-blue-500"></i>
                      </div>
                    ) : images.bohr ? (
                      <div className="h-full flex flex-col">
                        <img 
                          src={images.bohr}
                          alt={`${element.name} Bohr model`}
                          className="max-h-full object-contain flex-grow rounded" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                          }}
                        />
                        <span className="mt-2 text-blue-300 text-sm text-center">Bohr Model</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <i className="bi bi-image text-3xl text-gray-500 mb-2"></i>
                        <span className="text-gray-400 text-sm text-center">No Bohr model available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for displaying information rows
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-400">{label}:</span>
    <span className="text-gray-200">{value}</span>
  </div>
);

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

export default ElementDetailPopup;
