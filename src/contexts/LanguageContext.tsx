import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const translations = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.cropPlanner': 'Crop Planner',
    'nav.weather': 'Weather',
    'nav.plantHealth': 'Plant Health',
    'nav.cropLibrary': 'Crop Library',
    'nav.market': 'Market Prices',
    'nav.langToggle': '🌐 తెలుగు',

    // Hero
    'hero.badge': '🌾 Smart Agriculture Platform',
    'hero.headline': 'Smart Crop Planning for Telangana Farmers',
    'hero.subheading': 'Helping farmers choose the best crops using weather data, soil conditions, and farming insights.',
    'hero.cta1': 'Start Crop Planning',
    'hero.cta2': 'Check Plant Health',
    'hero.stat1': 'Districts Covered',
    'hero.stat2': 'Crops Analyzed',
    'hero.stat3': 'Farmers Helped',

    // Features
    'features.title': 'Everything You Need to Farm Smarter',
    'features.subtitle': 'Powerful tools built specifically for Telangana farmers',
    'features.f1.title': 'Weather-Based Recommendations',
    'features.f1.desc': 'Get crop suggestions based on real-time weather data for your district.',
    'features.f2.title': 'Smart Crop Planner',
    'features.f2.desc': 'Enter your farm details and get personalized crop recommendations instantly.',
    'features.f3.title': 'Plant Disease Detection',
    'features.f3.desc': 'Upload a photo to identify diseases and get treatment advice.',
    'features.f4.title': 'Crop Information Library',
    'features.f4.desc': 'Detailed guides for all major Telangana crops.',
    'features.f5.title': 'Market Crop Insights',
    'features.f5.desc': 'Live market prices for crops across Telangana markets.',
    'features.f6.title': 'Telugu & English Support',
    'features.f6.desc': 'Use the platform in your preferred language.',

    // How it works
    'hiw.title': 'How HarvestIQ Works',
    'hiw.subtitle': 'Three simple steps to smarter farming',
    'hiw.s1.title': 'Enter Farm Details',
    'hiw.s1.desc': 'Tell us your district, soil type, season, and water availability.',
    'hiw.s2.title': 'AI Analyzes Data',
    'hiw.s2.desc': 'Our system processes weather patterns, soil data, and seasonal factors.',
    'hiw.s3.title': 'Get Recommendations',
    'hiw.s3.desc': 'Receive instant, personalized crop recommendations with growing tips.',

    // Benefits
    'benefits.title': 'Why Farmers Trust HarvestIQ',
    'benefits.b1': 'Choose the right crop for your soil and climate',
    'benefits.b2': 'Improve farm productivity and yield',
    'benefits.b3': 'Reduce crop failure risk significantly',
    'benefits.b4': 'Support sustainable agricultural practices',
    'benefits.b5': 'Easy to use for local farmers',

    // Crop Planner
    'planner.title': 'Smart Crop Planner',
    'planner.subtitle': 'Get personalized crop recommendations for your farm',
    'planner.district': 'Select District',
    'planner.soil': 'Soil Type',
    'planner.season': 'Season',
    'planner.water': 'Water Availability',
    'planner.farmSize': 'Farm Size (acres)',
    'planner.submit': 'Get Recommendations',
    'planner.results': 'Recommended Crops',
    'planner.weather': 'Current Weather',
    'planner.yield': 'Expected Yield',
    'planner.waterReq': 'Water Required',
    'planner.market': 'Market Value',
    'planner.tips': 'Growing Tips',

    // Soil types
    'soil.clay': 'Clay Soil',
    'soil.sandy': 'Sandy Soil',
    'soil.loamy': 'Loamy Soil',
    'soil.black': 'Black Soil',

    // Seasons
    'season.kharif': 'Kharif (Jun–Oct)',
    'season.rabi': 'Rabi (Oct–Mar)',
    'season.summer': 'Summer (Mar–Jun)',

    // Water
    'water.high': 'High (Irrigation available)',
    'water.medium': 'Medium (Partial irrigation)',
    'water.low': 'Low (Rainfed only)',

    // Weather
    'weather.title': 'Weather Dashboard',
    'weather.subtitle': 'Live weather conditions across Telangana',
    'weather.temp': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.rain': 'Rain Probability',
    'weather.wind': 'Wind Speed',
    'weather.crops': 'Suggested Crops',

    // Plant health
    'plant.title': 'Plant Health Check',
    'plant.subtitle': 'Upload a plant photo for instant disease detection',
    'plant.selectCrop': 'Select Crop Type',
    'plant.upload': 'Upload Plant Image',
    'plant.analyze': 'Analyze Plant Health',
    'plant.disease': '🌿 Disease Detected',
    'plant.cause': '⚠️ Cause',
    'plant.treatment': '💊 Treatment',
    'plant.prevention': '🛡️ Prevention',
    'plant.healthy': '✅ Plant appears healthy!',
    'plant.uploadPrompt': 'Click or drag to upload a plant photo',

    // Market
    'market.title': 'Market Prices',
    'market.subtitle': 'Current crop prices in Telangana markets',
    'market.crop': 'Crop',
    'market.price': 'Price (₹/quintal)',
    'market.change': 'Change',
    'market.market': 'Market',
    'market.trend': 'Trend',

    // Alerts
    'alerts.title': 'Smart Farm Alerts',
    'alerts.rain': 'Heavy Rain Warning',
    'alerts.drought': 'Drought Alert',
    'alerts.pest': 'Pest Outbreak Alert',

    // Calendar
    'cal.title': 'Crop Calendar',
    'cal.subtitle': 'Best planting months for Telangana crops',

    // Tips
    'tips.title': 'Smart Farming Tips',
    'tips.subtitle': 'Daily insights to improve your farm',

    // Footer
    'footer.tagline': 'Empowering Telangana farmers with smart technology',
    'footer.rights': '© 2024 HarvestIQ. All rights reserved.',

    // Districts
    'district.hyderabad': 'Hyderabad',
    'district.warangal': 'Warangal',
    'district.karimnagar': 'Karimnagar',
    'district.nizamabad': 'Nizamabad',
    'district.khammam': 'Khammam',
    'district.adilabad': 'Adilabad',
    'district.mahabubnagar': 'Mahabubnagar',
    'district.nalgonda': 'Nalgonda',
  },
  te: {
    // Nav
    'nav.home': 'హోమ్',
    'nav.cropPlanner': 'పంట ప్లానర్',
    'nav.weather': 'వాతావరణం',
    'nav.plantHealth': 'మొక్క ఆరోగ్యం',
    'nav.cropLibrary': 'పంట లైబ్రరీ',
    'nav.market': 'మార్కెట్ ధరలు',
    'nav.langToggle': '🌐 English',

    // Hero
    'hero.badge': '🌾 స్మార్ట్ వ్యవసాయ వేదిక',
    'hero.headline': 'తెలంగాణ రైతులకు స్మార్ట్ పంట ప్రణాళిక',
    'hero.subheading': 'వాతావరణ డేటా, నేల పరిస్థితులు మరియు వ్యవసాయ సూచనల ఆధారంగా రైతులకు ఉత్తమ పంటలు ఎంచుకోవడంలో సహాయం.',
    'hero.cta1': 'పంట ప్రణాళిక ప్రారంభించండి',
    'hero.cta2': 'మొక్క ఆరోగ్యం తనిఖీ',
    'hero.stat1': 'జిల్లాలు',
    'hero.stat2': 'పంటలు',
    'hero.stat3': 'రైతులు',

    // Features
    'features.title': 'తెలివైన వ్యవసాయానికి అవసరమైన అన్ని సాధనాలు',
    'features.subtitle': 'తెలంగాణ రైతుల కోసం ప్రత్యేకంగా నిర్మించిన శక్తివంతమైన సాధనాలు',
    'features.f1.title': 'వాతావరణ ఆధారిత సూచనలు',
    'features.f1.desc': 'మీ జిల్లాకు నిజ-సమయ వాతావరణ డేటా ఆధారంగా పంట సూచనలు పొందండి.',
    'features.f2.title': 'స్మార్ట్ పంట ప్లానర్',
    'features.f2.desc': 'మీ పొలం వివరాలు నమోదు చేసి వ్యక్తిగతీకరించిన పంట సిఫారసులు పొందండి.',
    'features.f3.title': 'మొక్క వ్యాధి గుర్తింపు',
    'features.f3.desc': 'ఫోటో అప్‌లోడ్ చేసి వ్యాధులను గుర్తించి చికిత్స సలహా పొందండి.',
    'features.f4.title': 'పంట సమాచార లైబ్రరీ',
    'features.f4.desc': 'తెలంగాణ ప్రధాన పంటలన్నింటికీ వివరణాత్మక మార్గదర్శకాలు.',
    'features.f5.title': 'మార్కెట్ పంట సమాచారం',
    'features.f5.desc': 'తెలంగాణ మార్కెట్‌లలో పంటలకు లైవ్ మార్కెట్ ధరలు.',
    'features.f6.title': 'తెలుగు & ఇంగ్లీష్ మద్దతు',
    'features.f6.desc': 'మీకు ఇష్టమైన భాషలో వేదికను ఉపయోగించండి.',

    // How it works
    'hiw.title': 'HarvestIQ ఎలా పని చేస్తుంది',
    'hiw.subtitle': 'తెలివైన వ్యవసాయానికి మూడు సులభ దశలు',
    'hiw.s1.title': 'పొలం వివరాలు నమోదు చేయండి',
    'hiw.s1.desc': 'మీ జిల్లా, నేల రకం, సీజన్ మరియు నీటి లభ్యతను చెప్పండి.',
    'hiw.s2.title': 'AI డేటా విశ్లేషిస్తుంది',
    'hiw.s2.desc': 'మా వ్యవస్థ వాతావరణ నమూనాలు, నేల డేటా మరియు సీజనల్ అంశాలను ప్రాసెస్ చేస్తుంది.',
    'hiw.s3.title': 'సూచనలు పొందండి',
    'hiw.s3.desc': 'పెరుగుతున్న చిట్కాలతో తక్షణ, వ్యక్తిగతీకరించిన పంట సిఫారసులు అందుకోండి.',

    // Benefits
    'benefits.title': 'రైతులు HarvestIQ ని ఎందుకు నమ్ముతారు',
    'benefits.b1': 'మీ నేల మరియు వాతావరణానికి సరైన పంట ఎంచుకోండి',
    'benefits.b2': 'పొలం ఉత్పాదకత మరియు దిగుబడిని మెరుగుపరచండి',
    'benefits.b3': 'పంట వైఫల్యం ప్రమాదాన్ని గణనీయంగా తగ్గించండి',
    'benefits.b4': 'స్థిరమైన వ్యవసాయ పద్ధతులకు మద్దతు ఇవ్వండి',
    'benefits.b5': 'స్థానిక రైతులకు ఉపయోగించడం సులభం',

    // Crop Planner
    'planner.title': 'స్మార్ట్ పంట ప్లానర్',
    'planner.subtitle': 'మీ పొలానికి వ్యక్తిగతీకరించిన పంట సిఫారసులు పొందండి',
    'planner.district': 'జిల్లా ఎంచుకోండి',
    'planner.soil': 'నేల రకం',
    'planner.season': 'సీజన్',
    'planner.water': 'నీటి లభ్యత',
    'planner.farmSize': 'పొలం విస్తీర్ణం (ఎకరాలు)',
    'planner.submit': 'సూచనలు పొందండి',
    'planner.results': 'సిఫారసు చేయబడిన పంటలు',
    'planner.weather': 'ప్రస్తుత వాతావరణం',
    'planner.yield': 'అంచనా దిగుబడి',
    'planner.waterReq': 'నీటి అవసరం',
    'planner.market': 'మార్కెట్ విలువ',
    'planner.tips': 'పెరుగు చిట్కాలు',

    // Soil types
    'soil.clay': 'బంకమట్టి నేల',
    'soil.sandy': 'ఇసుక నేల',
    'soil.loamy': 'లోమి నేల',
    'soil.black': 'నల్ల నేల',

    // Seasons
    'season.kharif': 'ఖరీఫ్ (జూన్–అక్టో)',
    'season.rabi': 'రబీ (అక్టో–మార్చి)',
    'season.summer': 'వేసవి (మార్చి–జూన్)',

    // Water
    'water.high': 'అధిక (నీటిపారుదల అందుబాటులో)',
    'water.medium': 'మధ్యమ (పాక్షిక నీటిపారుదల)',
    'water.low': 'తక్కువ (వర్షాధారం మాత్రమే)',

    // Weather
    'weather.title': 'వాతావరణ డ్యాష్‌బోర్డ్',
    'weather.subtitle': 'తెలంగాణ అంతటా లైవ్ వాతావరణ పరిస్థితులు',
    'weather.temp': 'ఉష్ణోగ్రత',
    'weather.humidity': 'తేమ',
    'weather.rain': 'వర్షం సంభావ్యత',
    'weather.wind': 'గాలి వేగం',
    'weather.crops': 'సూచించిన పంటలు',

    // Plant health
    'plant.title': 'మొక్క ఆరోగ్య తనిఖీ',
    'plant.subtitle': 'తక్షణ వ్యాధి గుర్తింపు కోసం మొక్క ఫోటో అప్‌లోడ్ చేయండి',
    'plant.selectCrop': 'పంట రకం ఎంచుకోండి',
    'plant.upload': 'మొక్క చిత్రం అప్‌లోడ్ చేయండి',
    'plant.analyze': 'మొక్క ఆరోగ్యం విశ్లేషించండి',
    'plant.disease': '🌿 గుర్తించిన వ్యాధి',
    'plant.cause': '⚠️ కారణం',
    'plant.treatment': '💊 చికిత్స',
    'plant.prevention': '🛡️ నివారణ',
    'plant.healthy': '✅ మొక్క ఆరోగ్యంగా కనిపిస్తోంది!',
    'plant.uploadPrompt': 'మొక్క ఫోటో అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి లేదా లాగండి',

    // Market
    'market.title': 'మార్కెట్ ధరలు',
    'market.subtitle': 'తెలంగాణ మార్కెట్‌లలో ప్రస్తుత పంట ధరలు',
    'market.crop': 'పంట',
    'market.price': 'ధర (₹/క్వింటాల్)',
    'market.change': 'మార్పు',
    'market.market': 'మార్కెట్',
    'market.trend': 'ధోరణి',

    // Alerts
    'alerts.title': 'స్మార్ట్ ఫార్మ్ హెచ్చరికలు',
    'alerts.rain': 'భారీ వర్షం హెచ్చరిక',
    'alerts.drought': 'కరువు హెచ్చరిక',
    'alerts.pest': 'పురుగుల వ్యాప్తి హెచ్చరిక',

    // Calendar
    'cal.title': 'పంట క్యాలెండర్',
    'cal.subtitle': 'తెలంగాణ పంటలకు ఉత్తమ నాటే నెలలు',

    // Tips
    'tips.title': 'స్మార్ట్ వ్యవసాయ చిట్కాలు',
    'tips.subtitle': 'మీ పొలాన్ని మెరుగుపరచడానికి రోజువారీ సూచనలు',

    // Footer
    'footer.tagline': 'స్మార్ట్ టెక్నాలజీతో తెలంగాణ రైతులను శక్తివంతం చేయడం',
    'footer.rights': '© 2024 HarvestIQ. అన్ని హక్కులు రక్షించబడ్డాయి.',

    // Districts
    'district.hyderabad': 'హైదరాబాద్',
    'district.warangal': 'వరంగల్',
    'district.karimnagar': 'కరీంనగర్',
    'district.nizamabad': 'నిజామాబాద్',
    'district.khammam': 'ఖమ్మం',
    'district.adilabad': 'ఆదిలాబాద్',
    'district.mahabubnagar': 'మహబూబ్‌నగర్',
    'district.nalgonda': 'నల్గొండ',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('harvestiq-language');
    return (saved === 'te' ? 'te' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('harvestiq-language', lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] || (translations.en as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
