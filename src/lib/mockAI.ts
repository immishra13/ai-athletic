import { TestType, Attempt, AgeBand, Gender } from "@/types";
import { BENCHMARKS } from "@/data/benchmarks";

// Seeded random number generator for consistent "AI" results
export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647;
}

export interface MockAnalysisResult {
  score: number;
  unit: "cm" | "kg" | "reps" | "sec" | "min" | "m";
  flags: {
    lowLight?: boolean;
    lowFps?: boolean;
    tooShort?: boolean;
    cuts?: boolean;
  };
  confidence: number;
  processingTime: number;
}

export async function analyzeVideo(
  testType: TestType,
  videoData: { duration: number; filename?: string },
  athleteId: string
): Promise<MockAnalysisResult> {
  // Simulate AI processing time
  const processingTime = 2000 + Math.random() * 3000;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  const seed = `${athleteId}-${testType}-${videoData.duration}`;
  const randomValue = seededRandom(seed);

  // Generate flags based on video characteristics
  const flags: MockAnalysisResult['flags'] = {};
  
  // Check video duration
  const minDuration = getMinDuration(testType);
  if (videoData.duration < minDuration) {
    flags.tooShort = true;
  }

  // Random flags based on seeded randomness
  if (seededRandom(seed + "light") < 0.15) flags.lowLight = true;
  if (seededRandom(seed + "fps") < 0.12) flags.lowFps = true;
  if (videoData.filename?.includes("_cut")) flags.cuts = true;

  // Generate realistic score based on test type and video duration
  const score = generateRealisticScore(testType, videoData.duration, randomValue);
  
  // Calculate confidence (lower if flags present)
  const flagCount = Object.keys(flags).length;
  const confidence = Math.max(0.6, 0.95 - (flagCount * 0.1));

  return {
    score,
    unit: getTestUnit(testType),
    flags,
    confidence,
    processingTime: Math.round(processingTime)
  };
}

function getMinDuration(testType: TestType): number {
  const durations = {
    height: 5,
    weight: 5,
    sit_and_reach: 15,
    vertical_jump: 15,
    broad_jump: 15,
    medicine_ball_throw: 15,
    "30m_sprint": 8,
    shuttle_4x10: 12,
    situps: 55,
    endurance_run: 180
  };
  return durations[testType];
}

function getTestUnit(testType: TestType): "cm" | "kg" | "reps" | "sec" | "min" | "m" {
  const units = {
    height: "cm" as const,
    weight: "kg" as const,
    sit_and_reach: "cm" as const,
    vertical_jump: "cm" as const,
    broad_jump: "m" as const,
    medicine_ball_throw: "m" as const,
    "30m_sprint": "sec" as const,
    shuttle_4x10: "sec" as const,
    situps: "reps" as const,
    endurance_run: "min" as const
  };
  return units[testType];
}

function generateRealisticScore(testType: TestType, duration: number, randomValue: number): number {
  // Base scores that feel realistic for each test
  const baseRanges = {
    height: { min: 140, max: 190 }, // cm
    weight: { min: 35, max: 90 }, // kg
    sit_and_reach: { min: 15, max: 45 }, // cm
    vertical_jump: { min: 20, max: 60 }, // cm
    broad_jump: { min: 1.2, max: 3.0 }, // meters
    medicine_ball_throw: { min: 3, max: 12 }, // meters
    "30m_sprint": { min: 3.5, max: 6.5 }, // seconds
    shuttle_4x10: { min: 10, max: 16 }, // seconds
    situps: { min: 15, max: 65 }, // reps
    endurance_run: { min: 3.0, max: 12 } // minutes
  };

  const range = baseRanges[testType];
  let score = range.min + (randomValue * (range.max - range.min));

  // Adjust score based on video duration (longer videos might indicate better performance)
  const minDuration = getMinDuration(testType);
  const durationFactor = Math.min(1.2, duration / minDuration);
  
  if (testType === "height" || testType === "weight" || testType === "sit_and_reach" || 
      testType === "vertical_jump" || testType === "broad_jump" || 
      testType === "medicine_ball_throw" || testType === "situps") {
    // Higher is better
    score = score * (0.8 + (durationFactor * 0.2));
  } else {
    // Lower is better (time-based)
    score = score * (1.2 - (durationFactor * 0.2));
  }

  // Round appropriately
  if (testType === "endurance_run" || testType === "broad_jump" || testType === "medicine_ball_throw") {
    return Math.round(score * 10) / 10; // 1 decimal place
  } else {
    return Math.round(score);
  }
}

export function calculateBenchmarkLabel(
  score: number,
  testType: TestType,
  ageBand: AgeBand,
  gender: Gender
): "Below" | "Meets" | "Exceeds" {
  const benchmark = BENCHMARKS[testType][ageBand][gender];
  
  if (testType === "30m_sprint" || testType === "shuttle_4x10" || testType === "endurance_run") {
    // Lower is better for time-based tests
    if (score <= benchmark.exceed) return "Exceeds";
    if (score <= benchmark.meet) return "Meets";
    return "Below";
  } else {
    // Higher is better for height/reps/distance
    if (score >= benchmark.exceed) return "Exceeds";
    if (score >= benchmark.meet) return "Meets";
    return "Below";
  }
}

export function calculateCompositeScore(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;
  
  const scoreMap = { "Exceeds": 3, "Meets": 2, "Below": 1 };
  const totalScore = attempts.reduce((sum, attempt) => sum + scoreMap[attempt.benchmarkLabel], 0);
  
  return Math.round((totalScore / attempts.length) * 100) / 100;
}