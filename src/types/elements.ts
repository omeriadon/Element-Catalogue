export interface Element {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  group: number;
  period: number;
  block: string;
  cpkColor: string;
  electronConfiguration: string;
  electronegativity: number | null;
  atomicRadius: number | null;
  ionizationEnergy: number | null;
  electronAffinity: number | null;
  oxidationStates: string[];
  standardState: string | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  discoveredBy: string | null;
  yearDiscovered: number | null;
  description: string | null;
}

export interface ElementJSON {
  name: string;
  symbol: string;
  number: number;
  atomic_mass: number;
  category: string;
  xpos: number; // group
  ypos: number; // period
  block: string;
  "cpk-hex"?: string; // Optional to handle missing values
  electron_configuration: string;
  electronegativity_pauling: number | null;
  atomic_radius?: number | null;
  ionization_energies?: number[];
  electron_affinity?: number | null;
  oxidation_states?: string;
  phase: string | null; // standardState
  melt: number | null; // meltingPoint
  boil: number | null; // boilingPoint
  density: number | null;
  discovered_by: string | null;
  year?: string | null; // yearDiscovered
  summary: string | null; // description
}

export interface ElementsData {
  elements: ElementJSON[];
}

export type ElementFilters = {
  category: string[];
  group: number[];
  period: number[];
  block: string[];
  standardState: string[];
};

export type SortOption = {
  field: keyof Element;
  direction: 'asc' | 'desc';
};

/**
 * Maps the raw JSON element data to our application's Element interface
 */
export function mapJsonToElement(element: ElementJSON): Element {
  return {
    name: element.name,
    symbol: element.symbol,
    atomicNumber: element.number,
    atomicMass: element.atomic_mass,
    category: element.category,
    group: element.xpos,
    period: element.ypos,
    block: element.block || '',
    cpkColor: element["cpk-hex"] ? `#${element["cpk-hex"]}` : '#CCCCCC',
    electronConfiguration: element.electron_configuration,
    electronegativity: element.electronegativity_pauling,
    atomicRadius: element.atomic_radius || null,
    ionizationEnergy: element.ionization_energies?.[0] || null,
    electronAffinity: element.electron_affinity || null,
    oxidationStates: element.oxidation_states ? 
      element.oxidation_states.split(',').map(s => s.trim()) : [],
    standardState: element.phase,
    meltingPoint: element.melt,
    boilingPoint: element.boil,
    density: element.density,
    discoveredBy: element.discovered_by,
    yearDiscovered: element.year ? parseInt(element.year) : null,
    description: element.summary
  };
}

/**
 * Maps all elements from the JSON data
 */
export function mapAllElements(data: ElementsData): Element[] {
  return data.elements.map(mapJsonToElement);
}
