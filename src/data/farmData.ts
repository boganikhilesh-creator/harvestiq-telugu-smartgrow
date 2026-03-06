// Weather data and market data for Telangana
export interface WeatherData {
  city: string;
  cityTe: string;
  temp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  condition: string;
  conditionTe: string;
  icon: string;
  suggestedCrops: string[];
  lat: number;
  lon: number;
}

export const telanganaWeather: WeatherData[] = [
  {
    city: 'Hyderabad', cityTe: 'హైదరాబాద్',
    temp: 32, humidity: 62, rainProb: 25, windSpeed: 14,
    condition: 'Partly Cloudy', conditionTe: 'పాక్షికంగా మేఘావృతం',
    icon: '⛅', suggestedCrops: ['Vegetables', 'Maize', 'Sunflower'],
    lat: 17.385, lon: 78.4867,
  },
  {
    city: 'Warangal', cityTe: 'వరంగల్',
    temp: 34, humidity: 68, rainProb: 45, windSpeed: 12,
    condition: 'Humid & Warm', conditionTe: 'తేమ & వేడి',
    icon: '🌤️', suggestedCrops: ['Cotton', 'Rice', 'Maize'],
    lat: 17.9689, lon: 79.5941,
  },
  {
    city: 'Karimnagar', cityTe: 'కరీంనగర్',
    temp: 33, humidity: 70, rainProb: 55, windSpeed: 10,
    condition: 'Cloudy', conditionTe: 'మేఘావృతం',
    icon: '🌥️', suggestedCrops: ['Rice', 'Cotton', 'Red Gram'],
    lat: 18.4386, lon: 79.1288,
  },
  {
    city: 'Khammam', cityTe: 'ఖమ్మం',
    temp: 35, humidity: 72, rainProb: 60, windSpeed: 8,
    condition: 'Hot & Humid', conditionTe: 'వేడి & తేమ',
    icon: '☀️', suggestedCrops: ['Cotton', 'Maize', 'Chili'],
    lat: 17.2473, lon: 80.1514,
  },
  {
    city: 'Nizamabad', cityTe: 'నిజామాబాద్',
    temp: 31, humidity: 65, rainProb: 35, windSpeed: 16,
    condition: 'Breezy', conditionTe: 'గాలి వీస్తోంది',
    icon: '🌬️', suggestedCrops: ['Turmeric', 'Rice', 'Soybean'],
    lat: 18.6725, lon: 78.094,
  },
  {
    city: 'Adilabad', cityTe: 'ఆదిలాబాద్',
    temp: 29, humidity: 78, rainProb: 70, windSpeed: 9,
    condition: 'Rainy', conditionTe: 'వర్షకారకం',
    icon: '🌧️', suggestedCrops: ['Rice', 'Cotton', 'Red Gram'],
    lat: 19.6641, lon: 78.5320,
  },
];

export interface MarketPrice {
  crop: string;
  cropTe: string;
  emoji: string;
  price: number;
  change: number;
  market: string;
  unit: string;
  high52w: number;
  low52w: number;
}

export const marketPrices: MarketPrice[] = [
  { crop: 'Rice', cropTe: 'వరి', emoji: '🌾', price: 1980, change: 2.3, market: 'Hyderabad', unit: 'quintal', high52w: 2200, low52w: 1750 },
  { crop: 'Cotton', cropTe: 'పత్తి', emoji: '🌸', price: 6250, change: -1.2, market: 'Warangal', unit: 'quintal', high52w: 7200, low52w: 5500 },
  { crop: 'Maize', cropTe: 'మొక్కజొన్న', emoji: '🌽', price: 1680, change: 3.5, market: 'Karimnagar', unit: 'quintal', high52w: 1900, low52w: 1400 },
  { crop: 'Tomato', cropTe: 'టమాటా', emoji: '🍅', price: 1200, change: -8.5, market: 'Hyderabad', unit: 'quintal', high52w: 3500, low52w: 400 },
  { crop: 'Chili', cropTe: 'మిరప', emoji: '🌶️', price: 11500, change: 5.2, market: 'Khammam', unit: 'quintal', high52w: 14000, low52w: 8000 },
  { crop: 'Turmeric', cropTe: 'పసుపు', emoji: '🟡', price: 7800, change: 4.1, market: 'Nizamabad', unit: 'quintal', high52w: 9500, low52w: 6000 },
  { crop: 'Red Gram', cropTe: 'కందిపప్పు', emoji: '🫘', price: 6100, change: 1.8, market: 'Adilabad', unit: 'quintal', high52w: 7000, low52w: 5000 },
  { crop: 'Groundnut', cropTe: 'వేరుశనగ', emoji: '🥜', price: 5200, change: -0.9, market: 'Mahabubnagar', unit: 'quintal', high52w: 5800, low52w: 4200 },
  { crop: 'Sunflower', cropTe: 'సూర్యకాంతి', emoji: '🌻', price: 4900, change: 2.8, market: 'Nalgonda', unit: 'quintal', high52w: 5500, low52w: 4000 },
  { crop: 'Wheat', cropTe: 'గోధుమ', emoji: '🌿', price: 2150, change: 0.5, market: 'Hyderabad', unit: 'quintal', high52w: 2300, low52w: 1950 },
];

export const farmingTips = [
  {
    tip: 'Apply organic matter like compost or farm yard manure before sowing to improve soil fertility.',
    tipTe: 'నేల సారాన్ని మెరుగుపరచడానికి విత్తనాలు వేయడానికి ముందు కంపోస్ట్ లేదా పొలం ఎరువు వంటి సేంద్రియ పదార్థాన్ని వేయండి.',
    icon: '🌱',
    category: 'Soil Health',
  },
  {
    tip: 'Drip irrigation can save up to 50% water compared to flood irrigation while improving yields.',
    tipTe: 'డ్రిప్ నీటిపారుదల వరద నీటిపారుదలతో పోలిస్తే 50% నీటిని ఆదా చేయగలదు మరియు దిగుబడిని మెరుగుపరచగలదు.',
    icon: '💧',
    category: 'Irrigation',
  },
  {
    tip: 'Crop rotation helps break pest and disease cycles and improves soil structure naturally.',
    tipTe: 'పంట మార్పిడి కీట మరియు వ్యాధి చక్రాలను విచ్ఛిన్నం చేయడంలో మరియు నేల నిర్మాణాన్ని సహజంగా మెరుగుపరచడంలో సహాయపడుతుంది.',
    icon: '🔄',
    category: 'Crop Management',
  },
  {
    tip: 'Apply neem-based pesticides for eco-friendly pest control that does not harm beneficial insects.',
    tipTe: 'ప్రయోజనకారక కీటకాలకు హాని చేయకుండా పర్యావరణ అనుకూల కీట నియంత్రణ కోసం వేప ఆధారిత పురుగుమందులు వేయండి.',
    icon: '🍃',
    category: 'Pest Control',
  },
  {
    tip: 'Monitor weather forecasts daily during critical crop stages like flowering and grain filling.',
    tipTe: 'పుష్పించడం మరియు ధాన్యం నింపడం వంటి క్రిటికల్ పంట దశలలో రోజువారీ వాతావరణ సూచనలను పర్యవేక్షించండి.',
    icon: '🌤️',
    category: 'Weather Watch',
  },
  {
    tip: 'Soil testing every 2–3 years helps maintain optimal nutrient levels for maximum productivity.',
    tipTe: 'ప్రతి 2–3 సంవత్సరాలకు నేల పరీక్ష గరిష్ట ఉత్పాదకత కోసం సరైన పోషక స్థాయిలను నిర్వహించడంలో సహాయపడుతుంది.',
    icon: '🧪',
    category: 'Soil Testing',
  },
];

export const smartAlerts = [
  {
    type: 'rain',
    title: 'Heavy Rain Warning',
    titleTe: 'భారీ వర్షం హెచ్చరిక',
    desc: 'Heavy to very heavy rainfall expected in Adilabad, Karimnagar and Nizamabad districts for the next 48 hours. Avoid spraying pesticides.',
    descTe: 'తదుపరి 48 గంటలలో ఆదిలాబాద్, కరీంనగర్ మరియు నిజామాబాద్ జిల్లాల్లో భారీ నుండి అత్యంత భారీ వర్షపాతం అంచనా. పురుగుమందులు పిచికారి చేయకండి.',
    severity: 'high',
    icon: '⛈️',
    districts: ['Adilabad', 'Karimnagar', 'Nizamabad'],
  },
  {
    type: 'drought',
    title: 'Drought Advisory',
    titleTe: 'కరువు సలహా',
    desc: 'Mahabubnagar and Nalgonda districts facing dry spell. Irrigate critical crops and harvest mature crops early.',
    descTe: 'మహబూబ్‌నగర్ మరియు నల్గొండ జిల్లాలు పొడి వాతావరణాన్ని ఎదుర్కొంటున్నాయి. క్రిటికల్ పంటలకు నీరు పెట్టండి మరియు పండిన పంటలు ముందుగా కోయండి.',
    severity: 'medium',
    icon: '☀️',
    districts: ['Mahabubnagar', 'Nalgonda'],
  },
  {
    type: 'pest',
    title: 'Fall Armyworm Alert',
    titleTe: 'ఫాల్ ఆర్మీవర్మ్ హెచ్చరిక',
    desc: 'Fall Armyworm outbreak reported in maize crops across Warangal and Khammam. Immediate treatment recommended.',
    descTe: 'వరంగల్ మరియు ఖమ్మంలో మొక్కజొన్న పంటలలో ఫాల్ ఆర్మీవర్మ్ వ్యాప్తి నివేదించబడింది. తక్షణ చికిత్స సిఫారసు చేయబడింది.',
    severity: 'high',
    icon: '🐛',
    districts: ['Warangal', 'Khammam'],
  },
];

export const cropCalendar: Record<string, { months: number[]; color: string; emoji: string }> = {
  Rice: { months: [6, 7, 8], color: 'bg-green-500', emoji: '🌾' },
  Cotton: { months: [6, 7], color: 'bg-pink-400', emoji: '🌸' },
  Maize: { months: [6, 7, 10, 11], color: 'bg-yellow-400', emoji: '🌽' },
  Wheat: { months: [11, 12], color: 'bg-lime-500', emoji: '🌿' },
  Turmeric: { months: [6, 7, 8], color: 'bg-yellow-500', emoji: '🟡' },
  'Red Gram': { months: [6, 7, 10], color: 'bg-orange-500', emoji: '🫘' },
  Groundnut: { months: [6, 7, 10, 11, 3, 4], color: 'bg-amber-500', emoji: '🥜' },
  Sunflower: { months: [10, 11, 3, 4], color: 'bg-yellow-400', emoji: '🌻' },
  Tomato: { months: [9, 10, 11, 2, 3], color: 'bg-red-500', emoji: '🍅' },
  Chili: { months: [6, 7, 10, 11], color: 'bg-red-600', emoji: '🌶️' },
};
