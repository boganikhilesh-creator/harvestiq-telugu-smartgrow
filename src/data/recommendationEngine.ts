import type { SoilType } from './soilData';
import { soilProfiles } from './soilData';
import { cropDatabase } from './crops';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface WeatherInput {
  temp: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  condition: string;
}

export interface RecommendationResult {
  cropKey: string;
  rank: number;
  score: number;
  reason: string;
  riskLevel: RiskLevel;
  confidence: number;
  matchFactors: string[];
  warnings: string[];
}

// Per-crop scoring rules: [soilTypes, tempRange, humidityRange, seasons, waterNeeds]
const cropRules: Record<string, {
  soilTypes: SoilType[];
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  seasons: string[];
  waterNeed: 'low' | 'medium' | 'high';
  rainMin: number;
}> = {
  rice:      { soilTypes: ['clay', 'alluvial', 'loamy'],           tempMin: 22, tempMax: 35, humidityMin: 60, humidityMax: 95, seasons: ['kharif'],          waterNeed: 'high',   rainMin: 60 },
  cotton:    { soilTypes: ['black', 'loamy'],                       tempMin: 21, tempMax: 37, humidityMin: 40, humidityMax: 75, seasons: ['kharif'],          waterNeed: 'medium', rainMin: 30 },
  maize:     { soilTypes: ['loamy', 'sandy', 'red', 'alluvial'],   tempMin: 18, tempMax: 32, humidityMin: 40, humidityMax: 80, seasons: ['kharif', 'rabi'],  waterNeed: 'medium', rainMin: 25 },
  turmeric:  { soilTypes: ['loamy', 'clay', 'alluvial'],            tempMin: 20, tempMax: 30, humidityMin: 65, humidityMax: 90, seasons: ['kharif'],          waterNeed: 'high',   rainMin: 55 },
  redgram:   { soilTypes: ['loamy', 'black', 'sandy', 'red'],      tempMin: 26, tempMax: 35, humidityMin: 30, humidityMax: 70, seasons: ['kharif', 'rabi'],  waterNeed: 'low',    rainMin: 15 },
  groundnut: { soilTypes: ['sandy', 'loamy', 'red'],               tempMin: 25, tempMax: 35, humidityMin: 35, humidityMax: 70, seasons: ['kharif', 'rabi', 'summer'], waterNeed: 'medium', rainMin: 20 },
  wheat:     { soilTypes: ['loamy', 'clay', 'alluvial'],            tempMin: 15, tempMax: 25, humidityMin: 35, humidityMax: 65, seasons: ['rabi'],            waterNeed: 'medium', rainMin: 20 },
  sunflower: { soilTypes: ['loamy', 'sandy', 'black', 'red'],      tempMin: 20, tempMax: 30, humidityMin: 30, humidityMax: 65, seasons: ['rabi', 'summer'],  waterNeed: 'low',    rainMin: 10 },
  tomato:    { soilTypes: ['loamy', 'sandy', 'alluvial'],           tempMin: 20, tempMax: 30, humidityMin: 40, humidityMax: 70, seasons: ['rabi', 'summer'],  waterNeed: 'medium', rainMin: 20 },
  chili:     { soilTypes: ['loamy', 'black', 'red'],                tempMin: 20, tempMax: 32, humidityMin: 40, humidityMax: 75, seasons: ['kharif', 'rabi'], waterNeed: 'medium', rainMin: 20 },
};

function scoreInRange(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 1.0;
  const gap = Math.min(Math.abs(value - min), Math.abs(value - max));
  return Math.max(0, 1 - gap / ((max - min) / 2 + 5));
}

function waterNeedMatches(cropNeed: 'low' | 'medium' | 'high', userAvailability: string): number {
  const map: Record<string, Record<string, number>> = {
    high:   { high: 1.0, medium: 0.5, low: 0.1 },
    medium: { high: 0.9, medium: 1.0, low: 0.6 },
    low:    { high: 0.8, medium: 0.9, low: 1.0  },
  };
  return map[cropNeed]?.[userAvailability] ?? 0.7;
}

function generateReason(
  cropKey: string,
  soil: SoilType,
  weather: WeatherInput,
  season: string,
  matchFactors: string[],
): string {
  const crop = cropDatabase[cropKey];
  const soilLabel = soilProfiles[soil].label;
  const factors = matchFactors.slice(0, 3).join(', ').toLowerCase();
  return `${crop.name} is well-suited for ${soilLabel} and current ${season} conditions. Key advantages: ${factors}. Expected ${weather.humidity > 65 ? 'good moisture support' : 'adequate drainage'} with ${weather.temp}°C temperature.`;
}

function computeRisk(score: number, weather: WeatherInput, season: string, cropKey: string): RiskLevel {
  const rule = cropRules[cropKey];
  if (!rule) return 'Medium';

  let riskPoints = 0;
  if (weather.temp < rule.tempMin - 3 || weather.temp > rule.tempMax + 3) riskPoints += 2;
  if (weather.humidity < rule.humidityMin - 10 || weather.humidity > rule.humidityMax + 10) riskPoints += 1;
  if (!rule.seasons.includes(season)) riskPoints += 2;
  if (score < 0.5) riskPoints += 2;

  if (riskPoints >= 3) return 'High';
  if (riskPoints >= 1) return 'Medium';
  return 'Low';
}

export function getRecommendations(
  soilType: SoilType,
  weather: WeatherInput,
  season: string,
  waterAvailability: string,
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  for (const [cropKey, rule] of Object.entries(cropRules)) {
    const crop = cropDatabase[cropKey];
    if (!crop) continue;

    const matchFactors: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Soil match (30 pts)
    const soilMatch = rule.soilTypes.includes(soilType);
    if (soilMatch) {
      score += 30;
      matchFactors.push(`Ideal for ${soilProfiles[soilType].label}`);
    } else {
      score += 10;
      warnings.push(`Soil type not ideal — consider soil amendment`);
    }

    // Season match (25 pts)
    const seasonMatch = rule.seasons.includes(season);
    if (seasonMatch) {
      score += 25;
      matchFactors.push(`${season.charAt(0).toUpperCase() + season.slice(1)} season crop`);
    } else {
      warnings.push(`Not optimal for ${season} season`);
    }

    // Temperature (20 pts)
    const tempScore = scoreInRange(weather.temp, rule.tempMin, rule.tempMax);
    score += tempScore * 20;
    if (tempScore > 0.8) matchFactors.push(`Temperature ${weather.temp}°C is within ideal range`);
    else if (tempScore < 0.4) warnings.push(`Temperature ${weather.temp}°C is outside ideal ${rule.tempMin}–${rule.tempMax}°C`);

    // Humidity (10 pts)
    const humScore = scoreInRange(weather.humidity, rule.humidityMin, rule.humidityMax);
    score += humScore * 10;
    if (humScore > 0.8) matchFactors.push(`Humidity ${weather.humidity}% suitable`);
    else if (humScore < 0.4) warnings.push(`Humidity ${weather.humidity}% outside ideal range`);

    // Rainfall/rain probability (10 pts)
    const rainScore = weather.rainProb >= rule.rainMin ? 1.0 : weather.rainProb / (rule.rainMin + 1);
    score += rainScore * 10;
    if (rainScore > 0.7) matchFactors.push(`Rain probability ${weather.rainProb}% supports growth`);

    // Water availability (5 pts)
    const waterScore = waterNeedMatches(rule.waterNeed, waterAvailability || 'medium');
    score += waterScore * 5;
    if (waterScore >= 0.9) matchFactors.push(`Water availability matches crop needs`);
    else if (waterScore < 0.5) warnings.push(`Limited water may restrict this crop`);

    const riskLevel = computeRisk(score / 100, weather, season, cropKey);
    const confidence = Math.min(95, Math.round(score));
    const reason = generateReason(cropKey, soilType, weather, season, matchFactors);

    results.push({ cropKey, rank: 0, score, reason, riskLevel, confidence, matchFactors, warnings });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Assign ranks and return top 3
  return results.slice(0, 3).map((r, i) => ({ ...r, rank: i + 1 }));
}
