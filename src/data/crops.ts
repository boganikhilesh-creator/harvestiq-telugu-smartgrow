// Crop database for Telangana
export interface CropInfo {
  name: string;
  nameTe: string;
  emoji: string;
  idealSoil: string[];
  idealTemp: string;
  season: string[];
  water: string;
  fertilizer: string;
  pests: string[];
  yield: string;
  marketValue: string;
  tips: string[];
  color: string;
  image?: string;
}

export const cropDatabase: Record<string, CropInfo> = {
  rice: {
    name: 'Rice',
    nameTe: 'వరి',
    emoji: '🌾',
    idealSoil: ['clay', 'loamy'],
    idealTemp: '22–32°C',
    season: ['kharif'],
    water: 'High (1200–2000mm)',
    fertilizer: 'N:P:K = 120:60:60 kg/ha',
    pests: ['Brown Plant Hopper', 'Stem Borer', 'Leaf Blast'],
    yield: '4–6 tons/acre',
    marketValue: '₹1,800–2,100/quintal',
    tips: ['Transplant 25-day seedlings', 'Maintain 5cm standing water', 'Apply zinc sulfate at basal'],
    color: 'from-green-400 to-emerald-500',
  },
  cotton: {
    name: 'Cotton',
    nameTe: 'పత్తి',
    emoji: '🌸',
    idealSoil: ['black', 'loamy'],
    idealTemp: '21–35°C',
    season: ['kharif'],
    water: 'Medium (700–1200mm)',
    fertilizer: 'N:P:K = 180:80:80 kg/ha',
    pests: ['Bollworm', 'Aphids', 'Whitefly'],
    yield: '15–20 quintals/acre',
    marketValue: '₹5,500–7,000/quintal',
    tips: ['Use BT cotton varieties', 'Apply IPM practices', 'Drip irrigation preferred'],
    color: 'from-pink-400 to-rose-500',
  },
  maize: {
    name: 'Maize',
    nameTe: 'మొక్కజొన్న',
    emoji: '🌽',
    idealSoil: ['loamy', 'sandy'],
    idealTemp: '18–27°C',
    season: ['kharif', 'rabi'],
    water: 'Medium (500–800mm)',
    fertilizer: 'N:P:K = 150:75:75 kg/ha',
    pests: ['Fall Armyworm', 'Stem Borer'],
    yield: '6–8 tons/acre',
    marketValue: '₹1,500–1,800/quintal',
    tips: ['Maintain 60cm × 25cm spacing', 'Apply urea in splits', 'Weed at 25–30 days'],
    color: 'from-yellow-400 to-amber-500',
  },
  turmeric: {
    name: 'Turmeric',
    nameTe: 'పసుపు',
    emoji: '🟡',
    idealSoil: ['loamy', 'clay'],
    idealTemp: '20–30°C',
    season: ['kharif'],
    water: 'High (1500–2000mm)',
    fertilizer: 'N:P:K = 120:60:120 kg/ha + 40t FYM',
    pests: ['Rhizome Rot', 'Leaf Blotch'],
    yield: '20–25 tons/acre',
    marketValue: '₹6,000–9,000/quintal',
    tips: ['Use disease-free rhizomes', 'Mulch with paddy straw', 'Harvest at 8–9 months'],
    color: 'from-yellow-500 to-orange-500',
  },
  redgram: {
    name: 'Red Gram (Tur Dal)',
    nameTe: 'కందిపప్పు',
    emoji: '🫘',
    idealSoil: ['loamy', 'black', 'sandy'],
    idealTemp: '26–30°C',
    season: ['kharif', 'rabi'],
    water: 'Low (650–1000mm)',
    fertilizer: 'N:P:K = 20:50:50 kg/ha',
    pests: ['Pod Borer', 'Fusarium Wilt'],
    yield: '5–8 quintals/acre',
    marketValue: '₹5,000–7,000/quintal',
    tips: ['Drought tolerant variety', 'Intercrop with cotton/maize', 'Rhizobium seed treatment'],
    color: 'from-orange-400 to-red-500',
  },
  groundnut: {
    name: 'Groundnut',
    nameTe: 'వేరుశనగ',
    emoji: '🥜',
    idealSoil: ['sandy', 'loamy'],
    idealTemp: '25–30°C',
    season: ['kharif', 'rabi', 'summer'],
    water: 'Medium (500–700mm)',
    fertilizer: 'N:P:K = 25:50:50 kg/ha',
    pests: ['Tikka Leaf Spot', 'Collar Rot'],
    yield: '8–12 quintals/acre',
    marketValue: '₹4,500–5,500/quintal',
    tips: ['Sandy loam ideal', 'Gypsumapplication at flowering', 'Harvest before rains'],
    color: 'from-amber-400 to-yellow-500',
  },
  wheat: {
    name: 'Wheat',
    nameTe: 'గోధుమ',
    emoji: '🌿',
    idealSoil: ['loamy', 'clay'],
    idealTemp: '15–25°C',
    season: ['rabi'],
    water: 'Medium (450–650mm)',
    fertilizer: 'N:P:K = 120:60:40 kg/ha',
    pests: ['Rust', 'Powdery Mildew'],
    yield: '10–15 quintals/acre',
    marketValue: '₹2,000–2,200/quintal',
    tips: ['Sow by late November', '4–5 irrigations needed', 'Use improved varieties'],
    color: 'from-lime-400 to-green-500',
  },
  sunflower: {
    name: 'Sunflower',
    nameTe: 'సూర్యకాంతి',
    emoji: '🌻',
    idealSoil: ['loamy', 'sandy'],
    idealTemp: '20–30°C',
    season: ['rabi', 'summer'],
    water: 'Low to Medium (300–500mm)',
    fertilizer: 'N:P:K = 60:80:60 kg/ha',
    pests: ['Head Borer', 'Aphids'],
    yield: '4–6 quintals/acre',
    marketValue: '₹4,500–5,500/quintal',
    tips: ['60×30cm spacing', '6 irrigations at critical stages', 'Cross-pollination improves yield'],
    color: 'from-yellow-400 to-amber-400',
  },
  tomato: {
    name: 'Tomato',
    nameTe: 'టమాటా',
    emoji: '🍅',
    idealSoil: ['loamy', 'sandy'],
    idealTemp: '20–27°C',
    season: ['rabi', 'summer'],
    water: 'Medium (600–800mm)',
    fertilizer: 'N:P:K = 200:150:150 kg/ha',
    pests: ['Fruit Borer', 'Early Blight', 'TYLCV'],
    yield: '15–20 tons/acre',
    marketValue: '₹800–2,000/quintal',
    tips: ['Transplant 30-day seedlings', 'Staking required', 'Drip with mulch preferred'],
    color: 'from-red-400 to-orange-500',
  },
  chili: {
    name: 'Chili',
    nameTe: 'మిరప',
    emoji: '🌶️',
    idealSoil: ['loamy', 'black'],
    idealTemp: '20–30°C',
    season: ['kharif', 'rabi'],
    water: 'Medium (600–1200mm)',
    fertilizer: 'N:P:K = 180:100:100 kg/ha',
    pests: ['Thrips', 'Mites', 'Die Back'],
    yield: '8–12 quintals/acre (dry)',
    marketValue: '₹8,000–15,000/quintal',
    tips: ['Transplant at 30–35 days', 'Mulching with black plastic', 'Spray micronutrients'],
    color: 'from-red-500 to-rose-600',
  },
};

export const cropRecommendations: Record<string, Record<string, string[]>> = {
  kharif: {
    clay: ['rice', 'cotton', 'maize', 'redgram'],
    black: ['cotton', 'soybean', 'redgram', 'maize'],
    loamy: ['rice', 'maize', 'cotton', 'turmeric'],
    sandy: ['groundnut', 'maize', 'redgram', 'sunflower'],
  },
  rabi: {
    clay: ['wheat', 'sunflower', 'tomato'],
    black: ['wheat', 'sunflower', 'chili'],
    loamy: ['wheat', 'tomato', 'sunflower', 'chili'],
    sandy: ['groundnut', 'sunflower', 'wheat'],
  },
  summer: {
    clay: ['tomato', 'maize'],
    black: ['sunflower', 'groundnut'],
    loamy: ['sunflower', 'groundnut', 'tomato'],
    sandy: ['groundnut', 'sunflower'],
  },
};

export const weatherCropMap: Record<string, string[]> = {
  rainy: ['rice', 'cotton', 'maize', 'redgram'],
  dry: ['millets', 'groundnut', 'redgram', 'sunflower'],
  moderate: ['tomato', 'wheat', 'sunflower', 'chili'],
  hot: ['cotton', 'groundnut', 'sunflower'],
  humid: ['rice', 'turmeric', 'chili'],
};

export const diseaseDatabase: Record<string, {
  disease: string;
  diseaseTe: string;
  cause: string;
  causeTe: string;
  treatment: string[];
  treatmentTe: string[];
  prevention: string[];
  preventionTe: string[];
  severity: 'low' | 'medium' | 'high';
}[]> = {
  rice: [
    {
      disease: 'Leaf Blast',
      diseaseTe: 'ఆకు బ్లాస్ట్',
      cause: 'Fungal infection by Magnaporthe oryzae due to excess humidity',
      causeTe: 'అధిక తేమ వల్ల Magnaporthe oryzae శిలీంధ్ర సంక్రమణ',
      treatment: ['Apply Tricyclazole 75% WP at 0.6g/L', 'Spray Propiconazole 25% EC', 'Remove infected crop residues'],
      treatmentTe: ['Tricyclazole 75% WP 0.6g/L వేయండి', 'Propiconazole 25% EC పిచికారి', 'సంక్రమిత పంట అవశేషాలు తొలగించండి'],
      prevention: ['Use resistant varieties', 'Balanced nitrogen application', 'Proper plant spacing'],
      preventionTe: ['నిరోధక రకాలు ఉపయోగించండి', 'సమతుల్య నత్రజని వినియోగం', 'సరైన మొక్కల అంతరం'],
      severity: 'high',
    },
    {
      disease: 'Brown Plant Hopper',
      diseaseTe: 'గోధుమ మొక్క హాపర్',
      cause: 'Insect infestation by Nilaparvata lugens in humid conditions',
      causeTe: 'తేమ పరిస్థితులలో Nilaparvata lugens కీటక సంక్రమణ',
      treatment: ['Apply Imidacloprid 200 SL', 'Spray Thiamethoxam 25 WG', 'Drain water to reduce humidity'],
      treatmentTe: ['Imidacloprid 200 SL వేయండి', 'Thiamethoxam 25 WG పిచికారి', 'తేమ తగ్గించడానికి నీరు తీసివేయండి'],
      prevention: ['Avoid excess nitrogen', 'Use BPH resistant varieties', 'Regular field monitoring'],
      preventionTe: ['అధిక నత్రజనిని నివారించండి', 'BPH నిరోధక రకాలు', 'క్రమ పొలం పర్యవేక్షణ'],
      severity: 'high',
    },
  ],
  cotton: [
    {
      disease: 'Bollworm Infestation',
      diseaseTe: 'బాల్‌వర్మ్ సంక్రమణ',
      cause: 'Helicoverpa armigera larvae feeding on bolls',
      causeTe: 'Helicoverpa armigera లార్వా కాయలను తింటోంది',
      treatment: ['Apply Chlorantraniliprole 18.5% SC', 'Use pheromone traps', 'Spray NPV at 250 LE/ha'],
      treatmentTe: ['Chlorantraniliprole 18.5% SC వేయండి', 'ఫెరోమోన్ ట్రాప్‌లు ఉపయోగించండి', 'NPV 250 LE/ha వద్ద పిచికారి'],
      prevention: ['Plant BT cotton varieties', 'Install bird perches', 'Interplant with sorghum'],
      preventionTe: ['BT కాటన్ రకాలు నాటండి', 'పక్షి మాన్యాలు ఏర్పాటు చేయండి', 'జొన్నతో అంతర పంట'],
      severity: 'high',
    },
  ],
  tomato: [
    {
      disease: 'Early Blight (Leaf Spot)',
      diseaseTe: 'ఆకు మచ్చ',
      cause: 'Fungal infection by Alternaria solani due to excess moisture',
      causeTe: 'అధిక తేమ వల్ల Alternaria solani శిలీంధ్ర సంక్రమణ',
      treatment: ['Apply fungicide Mancozeb 75% WP', 'Remove infected leaves', 'Improve air circulation'],
      treatmentTe: ['Mancozeb 75% WP శిలీంధ్రనాశిని వేయండి', 'సంక్రమిత ఆకులు తొలగించండి', 'గాలి ప్రసరణ మెరుగుపరచండి'],
      prevention: ['Maintain proper plant spacing', 'Avoid overwatering', 'Mulch around plants'],
      preventionTe: ['సరైన మొక్క అంతరం పాటించండి', 'అధికంగా నీరు పెట్టడం నివారించండి', 'మొక్కల చుట్టూ మల్చ్'],
      severity: 'medium',
    },
  ],
  maize: [
    {
      disease: 'Fall Armyworm',
      diseaseTe: 'ఫాల్ ఆర్మీవర్మ్',
      cause: 'Spodoptera frugiperda moth larvae damaging leaves and cobs',
      causeTe: 'Spodoptera frugiperda పురుగుల లార్వా ఆకులు మరియు కాళ్ళకు నష్టం',
      treatment: ['Apply Emamectin benzoate 5 SG', 'Spray Spinetoram 11.7 SC', 'Remove egg masses manually'],
      treatmentTe: ['Emamectin benzoate 5 SG వేయండి', 'Spinetoram 11.7 SC పిచికారి', 'గుడ్ల సముదాయాలు చేతితో తొలగించండి'],
      prevention: ['Early sowing', 'Monitor regularly at whorl stage', 'Maintain field hygiene'],
      preventionTe: ['ముందుగా విత్తనాలు వేయండి', 'వార్ల దశలో క్రమం తప్పకుండా పర్యవేక్షించండి', 'పొలం పరిశుభ్రత'],
      severity: 'high',
    },
  ],
  chili: [
    {
      disease: 'Anthracnose / Die Back',
      diseaseTe: 'ఆంత్రాక్నోజ్ / డై బ్యాక్',
      cause: 'Colletotrichum capsici fungal infection in warm humid weather',
      causeTe: 'వేడి తేమ వాతావరణంలో Colletotrichum capsici శిలీంధ్ర సంక్రమణ',
      treatment: ['Spray Carbendazim + Mancozeb', 'Apply copper based fungicide', 'Remove infected fruits'],
      treatmentTe: ['Carbendazim + Mancozeb పిచికారి', 'రాగి ఆధారిత శిలీంధ్రనాశిని వేయండి', 'సంక్రమిత పండ్లు తొలగించండి'],
      prevention: ['Use certified seeds', 'Crop rotation with non-solanaceous crops', 'Good drainage'],
      preventionTe: ['సర్టిఫైడ్ విత్తనాలు ఉపయోగించండి', 'సోలనేషియస్ కాని పంటలతో పంట మార్పిడి', 'మంచి నీటి తీసివేత'],
      severity: 'medium',
    },
  ],
};
