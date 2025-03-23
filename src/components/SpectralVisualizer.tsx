import React, { useRef, useEffect, useState } from 'react';
import { Element } from '@/types/elements';

interface SpectralVisualizerProps {
  element: Element;
  width?: number;
  height?: number;
}

interface SpectralLine {
  wavelength: number;
  intensity: number;
  color: string;
}

// Real spectral line data for common elements (wavelengths in nm)
const SPECTRAL_DATA: Record<string, SpectralLine[]> = {
  // Hydrogen Balmer series (visible spectrum)
  'H': [
    { wavelength: 656.3, intensity: 1.0, color: 'red' },      // H-alpha
    { wavelength: 486.1, intensity: 0.8, color: 'blue-green' }, // H-beta
    { wavelength: 434.0, intensity: 0.6, color: 'blue' },    // H-gamma
    { wavelength: 410.2, intensity: 0.4, color: 'violet' }   // H-delta
  ],
  // Helium
  'He': [
    { wavelength: 667.8, intensity: 0.7, color: 'red' },
    { wavelength: 587.6, intensity: 1.0, color: 'yellow' },
    { wavelength: 501.6, intensity: 0.5, color: 'green' },
    { wavelength: 447.1, intensity: 0.8, color: 'blue' }
  ],
  // Neon (common in neon signs)
  'Ne': [
    { wavelength: 640.2, intensity: 0.9, color: 'red-orange' },
    { wavelength: 633.4, intensity: 1.0, color: 'red' },
    { wavelength: 616.4, intensity: 0.7, color: 'orange' },
    { wavelength: 603.0, intensity: 0.4, color: 'orange' },
    { wavelength: 585.2, intensity: 0.8, color: 'yellow' },
    { wavelength: 540.1, intensity: 0.5, color: 'green' }
  ],
  // Mercury
  'Hg': [
    { wavelength: 579.0, intensity: 0.8, color: 'yellow' },
    { wavelength: 577.0, intensity: 0.7, color: 'yellow' },
    { wavelength: 546.1, intensity: 1.0, color: 'green' },
    { wavelength: 435.8, intensity: 0.9, color: 'blue' },
    { wavelength: 404.7, intensity: 0.7, color: 'violet' }
  ],
  // Sodium (street lights)
  'Na': [
    { wavelength: 589.0, intensity: 1.0, color: 'yellow' }, // D lines (589.0 and 589.6 combined)
    { wavelength: 568.8, intensity: 0.3, color: 'yellow-green' },
    { wavelength: 616.1, intensity: 0.2, color: 'orange' }
  ]
};

const SpectralVisualizer: React.FC<SpectralVisualizerProps> = ({ 
  element, 
  width = 600, 
  height = 120
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spectralLines, setSpectralLines] = useState<SpectralLine[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Get real spectral data if available, or generate simulated data
    const fetchSpectralData = async () => {
      setLoading(true);
      
      // Check if we have real data for this element
      if (SPECTRAL_DATA[element.symbol]) {
        setSpectralLines(SPECTRAL_DATA[element.symbol]);
      } else {
        // Generate simulated data based on element properties
        const simulatedLines = generateSimulatedSpectralLines(element);
        setSpectralLines(simulatedLines);
      }
      
      setLoading(false);
    };
    
    fetchSpectralData();
  }, [element]);
  
  // Generate spectral lines based on element properties
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw rainbow gradient background (visible spectrum approximately 380-750nm)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#6A00F4'); // ~380nm (violet)
    gradient.addColorStop(0.15, '#3E00FF'); // ~420nm (indigo)
    gradient.addColorStop(0.3, '#0028FF');  // ~460nm (blue)
    gradient.addColorStop(0.45, '#00DDFF'); // ~500nm (cyan/green)
    gradient.addColorStop(0.6, '#00FF28');  // ~550nm (green/yellow)
    gradient.addColorStop(0.75, '#FFD500'); // ~600nm (yellow/orange)
    gradient.addColorStop(0.9, '#FF0000');  // ~650nm (red)
    gradient.addColorStop(1, '#960000');    // ~700nm+ (deep red)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 40, width, 40);
    
    // Draw wavelength scale
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 90, width, 20);
    
    // Draw wavelength markers
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < 8; i++) {
      const x = i * (width / 7);
      const wavelength = 380 + i * ((750 - 380) / 7);
      ctx.fillRect(x, 90, 1, 5);
      ctx.fillText(Math.round(wavelength) + 'nm', x, 108);
    }
    
    // Draw spectral lines
    spectralLines.forEach(line => {
      // Convert wavelength to position on canvas
      const position = (line.wavelength - 380) / (750 - 380) * width;
      
      // Only draw if within visible range
      if (position >= 0 && position <= width) {
        const intensity = line.intensity || 0.7;
        
        // Draw the spectral line
        ctx.beginPath();
        ctx.moveTo(position, 0);
        ctx.lineTo(position, 90);
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + intensity + ')';
        ctx.lineWidth = 2 + (intensity * 3); // Vary line width by intensity
        ctx.stroke();
      }
    });
    
  }, [spectralLines, element, width, height, loading]);
  
  // Function to generate simulated spectral lines
  const generateSimulatedSpectralLines = (element: Element): SpectralLine[] => {
    const baseWavelengths = [656.3, 589.0, 486.1, 434.0, 410.2];
    const result: SpectralLine[] = [];
    
    // Generate 3-7 lines depending on atomic number
    const lineCount = Math.min(5, Math.max(3, Math.floor(element.atomicNumber / 20)));
    
    for (let i = 0; i < lineCount; i++) {
      const seed = element.atomicNumber * (i + 1);
      const modifier = (Math.sin(seed) * 30) + 5;
      let wavelength = baseWavelengths[i % baseWavelengths.length] + modifier;
      
      // Ensure wavelength is in visible range
      wavelength = Math.max(380, Math.min(750, wavelength));
      
      let colorName = "unknown";
      if (wavelength < 450) colorName = "violet";
      else if (wavelength < 490) colorName = "blue";
      else if (wavelength < 520) colorName = "green";
      else if (wavelength < 580) colorName = "yellow";
      else if (wavelength < 620) colorName = "orange";
      else colorName = "red";
      
      result.push({
        wavelength,
        intensity: 0.5 + (Math.sin(seed * 0.1) * 0.5), // Random intensity
        color: colorName
      });
    }
    
    return result;
  };
  
  // Convert wavelength to color
  const wavelengthToColor = (wavelength: number): string => {
    if (wavelength < 380 || wavelength > 750) return '#CCCCCC';
    
    let r = 0, g = 0, b = 0;
    
    if (wavelength < 440) {
      r = -1 * (wavelength - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (wavelength < 490) {
      r = 0;
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength < 510) {
      r = 0;
      g = 1;
      b = -1 * (wavelength - 510) / (510 - 490);
    } else if (wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (wavelength < 645) {
      r = 1;
      g = -1 * (wavelength - 645) / (645 - 580);
      b = 0;
    } else {
      r = 1;
      g = 0;
      b = 0;
    }
    
    // Convert to RGB component values
    const intensity = 0.8;
    r = Math.floor(intensity * 255 * Math.max(0, Math.min(1, r)));
    g = Math.floor(intensity * 255 * Math.max(0, Math.min(1, g)));
    b = Math.floor(intensity * 255 * Math.max(0, Math.min(1, b)));
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const hasRealData = SPECTRAL_DATA[element.symbol] !== undefined;
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-3" style={{ color: element.cpkColor }}>
        Emission Spectrum {hasRealData ? '' : '(Simulated)'}
      </h3>
      
      {/* Spectral lines visualization */}
      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={120}
          className="rounded-lg w-full"
        />
      </div>
      
      {/* Spectral information */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2" style={{ color: element.cpkColor }}>
          {hasRealData ? 'Notable spectral lines:' : 'Simulated spectral lines:'}
        </h4>
        
        <div className="space-y-2 text-gray-300">
          {spectralLines.map((line, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: wavelengthToColor(line.wavelength) }}
              />
              <span>{line.wavelength.toFixed(1)} nm ({line.color})</span>
              <div className="ml-2 flex-grow bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${line.intensity * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          
          {!hasRealData && (
            <p className="text-xs text-gray-400 mt-2 italic">
              Note: This is simulated spectral data for educational purposes only.
            </p>
          )}
          
          {hasRealData && (
            <p className="text-xs text-gray-400 mt-2 italic">
              Based on known emission spectra for {element.name}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpectralVisualizer;
