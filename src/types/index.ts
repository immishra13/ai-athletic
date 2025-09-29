// Core data models for Sports Talent Assessment

export type AgeBand = "U14" | "U16" | "U18" | "Open";
export type Gender = "M" | "F";
export type TestType = "height" | "weight" | "sit_and_reach" | "vertical_jump" | "broad_jump" | "medicine_ball_throw" | "30m_sprint" | "shuttle_4x10" | "situps" | "endurance_run";

export interface Athlete {
  id: string;
  fullName: string;
  ageBand: AgeBand;
  gender: Gender;
  location: string;
  deviceId: string;
  consent: boolean;
  createdAt: number;
}

export interface Attempt {
  id: string;
  athleteId: string;
  test: TestType;
  date: number;
  raw: {
    durationSec: number;
    fps: number;
    cutsDetected: boolean;
  };
  score: number;
  unit: "cm" | "kg" | "reps" | "sec" | "min" | "m";
  flags: {
    lowLight?: boolean;
    lowFps?: boolean;
    tooShort?: boolean;
    cuts?: boolean;
  };
  benchmarkLabel: "Below" | "Meets" | "Exceeds";
  submitToSAI: boolean;
}

export interface OfficialRecord {
  id: string;
  athleteId: string;
  test: TestType;
  score: number;
  composite: number;
  benchmarkLabel: "Below" | "Meets" | "Exceeds";
  flagsSummary: string[];
  shortlisted?: boolean;
  receivedAt: number;
}

export interface BenchmarkStandard {
  meet: number;
  exceed: number;
}

export type BenchmarkTable = Record<TestType, Record<AgeBand, Record<Gender, BenchmarkStandard>>>;

export interface TestInfo {
  id: TestType;
  name: string;
  description: string;
  duration: string;
  icon: string;
  unit: "cm" | "kg" | "reps" | "sec" | "min" | "m";
  minDuration: number; // seconds
  instructions: string[];
}

export interface SubmissionConfig {
  mode: "manual" | "auto_best" | "random_eligible";
  autoSubmit: boolean;
}