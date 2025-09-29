import { Attempt, OfficialRecord, Athlete } from "@/types";
import { calculateCompositeScore } from "./mockAI";

// Simulate network delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for official records (simulating SAI database)
let SAI_DATABASE: OfficialRecord[] = [];

// Convert attempt to official record
function attemptToOfficialRecord(attempt: Attempt, athlete: Athlete): OfficialRecord {
  const flagsSummary = Object.entries(attempt.flags)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);

  return {
    id: `official_${attempt.id}`,
    athleteId: attempt.athleteId,
    test: attempt.test,
    score: attempt.score,
    composite: 0, // Will be calculated after submission
    benchmarkLabel: attempt.benchmarkLabel,
    flagsSummary,
    shortlisted: false,
    receivedAt: Date.now()
  };
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface DashboardFilters {
  region?: string;
  ageBand?: string;
  gender?: string;
  testType?: string;
}

export const api = {
  // Submit attempt to SAI system
  async submitAttempt(attempt: Attempt, athlete: Athlete): Promise<ApiResponse> {
    await sleep(500 + Math.random() * 500);
    
    try {
      const officialRecord = attemptToOfficialRecord(attempt, athlete);
      SAI_DATABASE.push(officialRecord);
      
      // Update composite scores for this athlete
      const athleteRecords = SAI_DATABASE.filter(r => r.athleteId === athlete.id);
      const compositeScore = calculateCompositeScore(
        athleteRecords.map(r => ({
          ...attempt,
          benchmarkLabel: r.benchmarkLabel
        }))
      );
      
      // Update all records for this athlete with new composite
      SAI_DATABASE.forEach(record => {
        if (record.athleteId === athlete.id) {
          record.composite = compositeScore;
        }
      });
      
      return { ok: true, data: { recordId: officialRecord.id } };
    } catch (error) {
      return { ok: false, error: "Failed to submit attempt" };
    }
  },

  // Get official records with filters
  async getOfficialRecords(filters: DashboardFilters = {}): Promise<ApiResponse<OfficialRecord[]>> {
    await sleep(300 + Math.random() * 200);
    
    try {
      let filtered = [...SAI_DATABASE];
      
      // Apply filters (would normally be done server-side)
      if (filters.testType) {
        filtered = filtered.filter(r => r.test === filters.testType);
      }
      
      // Sort by composite score descending
      filtered.sort((a, b) => b.composite - a.composite);
      
      return { ok: true, data: filtered };
    } catch (error) {
      return { ok: false, error: "Failed to fetch records" };
    }
  },

  // Shortlist an athlete
  async shortlistAthlete(recordId: string): Promise<ApiResponse> {
    await sleep(200);
    
    try {
      const record = SAI_DATABASE.find(r => r.id === recordId);
      if (record) {
        record.shortlisted = true;
        return { ok: true };
      }
      return { ok: false, error: "Record not found" };
    } catch (error) {
      return { ok: false, error: "Failed to shortlist athlete" };
    }
  },

  // Get dashboard statistics
  async getDashboardStats(filters: DashboardFilters = {}): Promise<ApiResponse<{
    totalAthletes: number;
    flaggedPercentage: number;
    avgComposite: number;
    submissionsToday: number;
  }>> {
    await sleep(250);
    
    try {
      const records = SAI_DATABASE;
      const uniqueAthletes = new Set(records.map(r => r.athleteId)).size;
      const flaggedRecords = records.filter(r => r.flagsSummary.length > 0);
      const flaggedPercentage = records.length > 0 ? (flaggedRecords.length / records.length) * 100 : 0;
      const avgComposite = records.length > 0 
        ? records.reduce((sum, r) => sum + r.composite, 0) / records.length 
        : 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const submissionsToday = records.filter(r => r.receivedAt >= today.getTime()).length;
      
      return {
        ok: true,
        data: {
          totalAthletes: uniqueAthletes,
          flaggedPercentage: Math.round(flaggedPercentage),
          avgComposite: Math.round(avgComposite * 100) / 100,
          submissionsToday
        }
      };
    } catch (error) {
      return { ok: false, error: "Failed to fetch stats" };
    }
  },

  // Get current SAI database state (for debugging)
  getSAIDatabase(): OfficialRecord[] {
    return [...SAI_DATABASE];
  },

  // Clear SAI database (for demo purposes)
  clearSAIDatabase(): void {
    SAI_DATABASE = [];
  },

  // Seed demo data
  seedDemoData(): void {
    // This will be called to populate initial demo data
    const demoRecords: OfficialRecord[] = [
      {
        id: "demo_1",
        athleteId: "athlete_mumbai_1",
        test: "vertical_jump",
        score: 45,
        composite: 2.8,
        benchmarkLabel: "Exceeds",
        flagsSummary: [],
        shortlisted: false,
        receivedAt: Date.now() - 86400000 // 1 day ago
      },
      {
        id: "demo_2", 
        athleteId: "athlete_mumbai_2",
        test: "situps",
        score: 52,
        composite: 2.2,
        benchmarkLabel: "Meets",
        flagsSummary: ["lowLight"],
        shortlisted: true,
        receivedAt: Date.now() - 43200000 // 12 hours ago
      },
      {
        id: "demo_3",
        athleteId: "athlete_mumbai_3",
        test: "shuttle_4x10",
        score: 19.8,
        composite: 2.7,
        benchmarkLabel: "Exceeds",
        flagsSummary: [],
        shortlisted: false,
        receivedAt: Date.now() - 21600000 // 6 hours ago
      },
      {
        id: "demo_4",
        athleteId: "athlete_mumbai_1",
        test: "endurance_run",
        score: 7.1,
        composite: 2.8,
        benchmarkLabel: "Exceeds",
        flagsSummary: ["lowFps"],
        shortlisted: false,
        receivedAt: Date.now() - 10800000 // 3 hours ago
      },
      {
        id: "demo_5",
        athleteId: "athlete_mumbai_4",
        test: "vertical_jump",
        score: 32,
        composite: 1.8,
        benchmarkLabel: "Below",
        flagsSummary: ["cuts", "tooShort"],
        shortlisted: false,
        receivedAt: Date.now() - 7200000 // 2 hours ago
      },
      {
        id: "demo_6",
        athleteId: "athlete_mumbai_5",
        test: "situps",
        score: 38,
        composite: 2.1,
        benchmarkLabel: "Meets",
        flagsSummary: [],
        shortlisted: true,
        receivedAt: Date.now() - 3600000 // 1 hour ago
      }
    ];
    
    SAI_DATABASE.push(...demoRecords);
  }
};