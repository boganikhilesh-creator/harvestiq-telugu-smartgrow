export type SoilType = 'black' | 'red' | 'alluvial' | 'loamy' | 'sandy' | 'clay' | 'laterite';

export interface SoilProfile {
  type: SoilType;
  label: string;
  labelTe: string;
  icon: string;
  phRange: [number, number];
  moisture: 'low' | 'medium' | 'high';
  fertility: 'low' | 'medium' | 'high';
  texture: 'coarse' | 'medium' | 'fine';
  waterRetention: 'low' | 'medium' | 'high';
  description: string;
  color: string;
}

export const soilProfiles: Record<SoilType, SoilProfile> = {
  black: {
    type: 'black',
    label: 'Black Soil (Regur)',
    labelTe: 'నల్ల నేల (రెగూర్)',
    icon: '⚫',
    phRange: [7.5, 8.5],
    moisture: 'high',
    fertility: 'high',
    texture: 'fine',
    waterRetention: 'high',
    description: 'Rich in clay minerals, excellent water retention. Ideal for cotton, soybean, and wheat.',
    color: 'from-gray-700 to-gray-900',
  },
  red: {
    type: 'red',
    label: 'Red Soil',
    labelTe: 'ఎర్ర నేల',
    icon: '🟥',
    phRange: [6.0, 7.5],
    moisture: 'low',
    fertility: 'medium',
    texture: 'medium',
    waterRetention: 'low',
    description: 'Rich in iron oxides, good drainage. Suitable for groundnut, millets, and pulses.',
    color: 'from-red-700 to-red-900',
  },
  alluvial: {
    type: 'alluvial',
    label: 'Alluvial Soil',
    labelTe: 'జలోఢ నేల',
    icon: '🟤',
    phRange: [6.5, 8.0],
    moisture: 'medium',
    fertility: 'high',
    texture: 'medium',
    waterRetention: 'medium',
    description: 'Deposited by rivers, highly fertile. Excellent for wheat, rice, sugarcane, and vegetables.',
    color: 'from-amber-700 to-amber-900',
  },
  loamy: {
    type: 'loamy',
    label: 'Loamy Soil',
    labelTe: 'లోమి నేల',
    icon: '🌿',
    phRange: [6.0, 7.0],
    moisture: 'medium',
    fertility: 'high',
    texture: 'medium',
    waterRetention: 'medium',
    description: 'Best all-purpose soil, good nutrient and water balance. Suitable for almost all crops.',
    color: 'from-green-700 to-green-900',
  },
  sandy: {
    type: 'sandy',
    label: 'Sandy Soil',
    labelTe: 'ఇసుక నేల',
    icon: '🏖️',
    phRange: [5.5, 7.0],
    moisture: 'low',
    fertility: 'low',
    texture: 'coarse',
    waterRetention: 'low',
    description: 'Well-drained and warm, low nutrient retention. Best for groundnut, millets, and vegetables.',
    color: 'from-yellow-600 to-amber-700',
  },
  clay: {
    type: 'clay',
    label: 'Clay Soil',
    labelTe: 'బంకమట్టి నేల',
    icon: '🧱',
    phRange: [6.0, 7.5],
    moisture: 'high',
    fertility: 'medium',
    texture: 'fine',
    waterRetention: 'high',
    description: 'Dense and heavy, holds moisture well. Suitable for rice and flood-tolerant crops.',
    color: 'from-orange-700 to-orange-900',
  },
  laterite: {
    type: 'laterite',
    label: 'Laterite Soil',
    labelTe: 'లేటరైట్ నేల',
    icon: '🪨',
    phRange: [5.0, 6.5],
    moisture: 'low',
    fertility: 'low',
    texture: 'coarse',
    waterRetention: 'low',
    description: 'Acidic, iron-rich soil. Suitable for cashew, tea, rubber, and tapioca.',
    color: 'from-red-800 to-red-950',
  },
};

// Telangana district → primary soil type mapping
export const districtSoilMap: Record<string, SoilType> = {
  hyderabad: 'red',
  warangal: 'black',
  karimnagar: 'red',
  nizamabad: 'alluvial',
  khammam: 'black',
  adilabad: 'red',
  mahabubnagar: 'black',
  nalgonda: 'black',
  medak: 'black',
  rangareddy: 'red',
};

// Legacy key mapping for UI (maps old crop keys to soilData soil types)
export const legacyToSoilType: Record<string, SoilType> = {
  black: 'black',
  clay: 'clay',
  loamy: 'loamy',
  sandy: 'sandy',
};

export function inferSoilFromDistrict(district: string): SoilType {
  return districtSoilMap[district.toLowerCase()] ?? 'red';
}
