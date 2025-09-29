import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Athlete, Attempt, SubmissionConfig, AgeBand, Gender } from '@/types';
import { BENCHMARKS } from '@/data/benchmarks';

interface AppState {
  // Current athlete
  athlete: Athlete | null;
  setAthlete: (athlete: Athlete) => void;
  
  // Attempts history
  attempts: Attempt[];
  addAttempt: (attempt: Attempt) => void;
  updateAttempt: (id: string, updates: Partial<Attempt>) => void;
  getAttemptsByTest: (testType: string) => Attempt[];
  
  // Submission configuration
  submissionConfig: SubmissionConfig;
  updateSubmissionConfig: (config: Partial<SubmissionConfig>) => void;
  
  // Benchmarks (editable in admin)
  benchmarks: typeof BENCHMARKS;
  updateBenchmarks: (benchmarks: typeof BENCHMARKS) => void;
  
  // UI state
  flaggedCount: number;
  updateFlaggedCount: () => void;
  
  // Utility methods
  getBestAttemptForTest: (testType: string) => Attempt | null;
  getEligibleAttemptsForSubmission: () => Attempt[];
  
  // Demo data management
  initializeDemoData: () => void;
  clearAllData: () => void;
}

// Generate demo athlete data
const generateDemoAthlete = (): Athlete => ({
  id: `athlete_${Date.now()}`,
  fullName: "Demo Athlete",
  ageBand: "U18" as AgeBand,
  gender: "M" as Gender,
  location: "Mumbai",
  deviceId: `device_${Math.random().toString(36).substring(7)}`,
  consent: true,
  createdAt: Date.now()
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      athlete: null,
      attempts: [],
      submissionConfig: {
        mode: "auto_best",
        autoSubmit: true
      },
      benchmarks: BENCHMARKS,
      flaggedCount: 0,

      setAthlete: (athlete) => set({ athlete }),

      addAttempt: (attempt) => {
        set((state) => ({
          attempts: [attempt, ...state.attempts]
        }));
        get().updateFlaggedCount();
      },

      updateAttempt: (id, updates) => {
        set((state) => ({
          attempts: state.attempts.map(attempt =>
            attempt.id === id ? { ...attempt, ...updates } : attempt
          )
        }));
        get().updateFlaggedCount();
      },

      getAttemptsByTest: (testType) => {
        return get().attempts.filter(attempt => attempt.test === testType);
      },

      updateSubmissionConfig: (config) => {
        set((state) => ({
          submissionConfig: { ...state.submissionConfig, ...config }
        }));
      },

      updateBenchmarks: (benchmarks) => set({ benchmarks }),

      updateFlaggedCount: () => {
        const attempts = get().attempts;
        const flaggedCount = attempts.filter(attempt => 
          Object.values(attempt.flags).some(flag => flag)
        ).length;
        set({ flaggedCount });
      },

      getBestAttemptForTest: (testType) => {
        const attempts = get().getAttemptsByTest(testType);
        if (attempts.length === 0) return null;

        // Find best attempt based on benchmark label and lowest flags
        const sortedAttempts = attempts.sort((a, b) => {
          // First, sort by benchmark label (Exceeds > Meets > Below)
          const benchmarkOrder = { "Exceeds": 3, "Meets": 2, "Below": 1 };
          const benchmarkDiff = benchmarkOrder[b.benchmarkLabel] - benchmarkOrder[a.benchmarkLabel];
          if (benchmarkDiff !== 0) return benchmarkDiff;

          // If same benchmark label, prefer fewer flags
          const aFlagCount = Object.values(a.flags).filter(f => f).length;
          const bFlagCount = Object.values(b.flags).filter(f => f).length;
          if (aFlagCount !== bFlagCount) return aFlagCount - bFlagCount;

          // If same flags, prefer newer attempt
          return b.date - a.date;
        });

        return sortedAttempts[0];
      },

      getEligibleAttemptsForSubmission: () => {
        const attempts = get().attempts;
        const config = get().submissionConfig;

        switch (config.mode) {
          case "manual":
            return attempts.filter(attempt => attempt.submitToSAI);
          
          case "auto_best":
            // Get best attempt for each test type without critical flags
            const testTypes = Array.from(new Set(attempts.map(a => a.test)));
            return testTypes.map(testType => {
              const testAttempts = attempts
                .filter(a => a.test === testType)
                .filter(a => !a.flags.cuts && !a.flags.tooShort); // No critical flags
              
              if (testAttempts.length === 0) return null;
              
              return testAttempts.sort((a, b) => {
                const benchmarkOrder = { "Exceeds": 3, "Meets": 2, "Below": 1 };
                const benchmarkDiff = benchmarkOrder[b.benchmarkLabel] - benchmarkOrder[a.benchmarkLabel];
                if (benchmarkDiff !== 0) return benchmarkDiff;
                
                const aFlagCount = Object.values(a.flags).filter(f => f).length;
                const bFlagCount = Object.values(b.flags).filter(f => f).length;
                return aFlagCount - bFlagCount;
              })[0];
            }).filter(Boolean) as Attempt[];
          
          case "random_eligible":
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const recentAttempts = attempts
              .filter(a => a.date >= weekAgo)
              .filter(a => !a.flags.cuts && !a.flags.tooShort);
            
            return recentAttempts.length > 0 
              ? [recentAttempts[Math.floor(Math.random() * recentAttempts.length)]]
              : [];
          
          default:
            return [];
        }
      },

      initializeDemoData: () => {
        const state = get();
        if (!state.athlete) {
          const demoAthlete = generateDemoAthlete();
          set({ athlete: demoAthlete });
        }
        
        // Initialize SAI demo data if empty
        import('../lib/api').then(({ api }) => {
          if (api.getSAIDatabase().length === 0) {
            api.seedDemoData();
          }
        });
      },

      clearAllData: () => {
        set({
          athlete: null,
          attempts: [],
          flaggedCount: 0
        });
      }
    }),
    {
      name: 'sports-assessment-storage',
      partialize: (state) => ({
        athlete: state.athlete,
        attempts: state.attempts,
        submissionConfig: state.submissionConfig,
        benchmarks: state.benchmarks
      })
    }
  )
);