import { BenchmarkTable } from "@/types";

export const BENCHMARKS: BenchmarkTable = {
  height: {
    U14: { M: { meet: 150, exceed: 165 }, F: { meet: 148, exceed: 160 } },
    U16: { M: { meet: 160, exceed: 175 }, F: { meet: 155, exceed: 168 } },
    U18: { M: { meet: 168, exceed: 180 }, F: { meet: 160, exceed: 172 } },
    Open: { M: { meet: 170, exceed: 185 }, F: { meet: 162, exceed: 175 } },
  },
  weight: {
    U14: { M: { meet: 40, exceed: 55 }, F: { meet: 38, exceed: 50 } },
    U16: { M: { meet: 50, exceed: 65 }, F: { meet: 45, exceed: 58 } },
    U18: { M: { meet: 60, exceed: 75 }, F: { meet: 52, exceed: 65 } },
    Open: { M: { meet: 65, exceed: 80 }, F: { meet: 55, exceed: 70 } },
  },
  sit_and_reach: {
    U14: { M: { meet: 20, exceed: 30 }, F: { meet: 25, exceed: 35 } },
    U16: { M: { meet: 22, exceed: 32 }, F: { meet: 28, exceed: 38 } },
    U18: { M: { meet: 25, exceed: 35 }, F: { meet: 30, exceed: 40 } },
    Open: { M: { meet: 28, exceed: 38 }, F: { meet: 32, exceed: 42 } },
  },
  vertical_jump: {
    U14: { M: { meet: 30, exceed: 40 }, F: { meet: 24, exceed: 34 } },
    U16: { M: { meet: 35, exceed: 45 }, F: { meet: 28, exceed: 38 } },
    U18: { M: { meet: 40, exceed: 50 }, F: { meet: 32, exceed: 42 } },
    Open: { M: { meet: 42, exceed: 52 }, F: { meet: 34, exceed: 44 } },
  },
  broad_jump: {
    U14: { M: { meet: 1.8, exceed: 2.2 }, F: { meet: 1.6, exceed: 2.0 } },
    U16: { M: { meet: 2.0, exceed: 2.4 }, F: { meet: 1.8, exceed: 2.2 } },
    U18: { M: { meet: 2.2, exceed: 2.6 }, F: { meet: 1.9, exceed: 2.3 } },
    Open: { M: { meet: 2.4, exceed: 2.8 }, F: { meet: 2.0, exceed: 2.4 } },
  },
  medicine_ball_throw: {
    U14: { M: { meet: 6, exceed: 8 }, F: { meet: 4.5, exceed: 6.5 } },
    U16: { M: { meet: 7, exceed: 9 }, F: { meet: 5.5, exceed: 7.5 } },
    U18: { M: { meet: 8, exceed: 10 }, F: { meet: 6, exceed: 8 } },
    Open: { M: { meet: 9, exceed: 11 }, F: { meet: 6.5, exceed: 8.5 } },
  },
  "30m_sprint": {
    U14: { M: { meet: 5.5, exceed: 4.8 }, F: { meet: 6.0, exceed: 5.3 } },
    U16: { M: { meet: 5.0, exceed: 4.3 }, F: { meet: 5.5, exceed: 4.8 } },
    U18: { M: { meet: 4.7, exceed: 4.0 }, F: { meet: 5.2, exceed: 4.5 } },
    Open: { M: { meet: 4.5, exceed: 3.8 }, F: { meet: 5.0, exceed: 4.3 } },
  },
  shuttle_4x10: {
    U14: { M: { meet: 14.0, exceed: 12.5 }, F: { meet: 15.0, exceed: 13.5 } },
    U16: { M: { meet: 13.0, exceed: 11.5 }, F: { meet: 14.0, exceed: 12.5 } },
    U18: { M: { meet: 12.5, exceed: 11.0 }, F: { meet: 13.5, exceed: 12.0 } },
    Open: { M: { meet: 12.0, exceed: 10.5 }, F: { meet: 13.0, exceed: 11.5 } },
  },
  situps: {
    U14: { M: { meet: 28, exceed: 40 }, F: { meet: 24, exceed: 36 } },
    U16: { M: { meet: 35, exceed: 50 }, F: { meet: 30, exceed: 45 } },
    U18: { M: { meet: 40, exceed: 55 }, F: { meet: 32, exceed: 48 } },
    Open: { M: { meet: 42, exceed: 58 }, F: { meet: 34, exceed: 50 } },
  },
  endurance_run: {
    U14: { M: { meet: 4.5, exceed: 3.8 }, F: { meet: 5.0, exceed: 4.2 } },
    U16: { M: { meet: 8.5, exceed: 7.2 }, F: { meet: 9.3, exceed: 8.0 } },
    U18: { M: { meet: 8.2, exceed: 7.0 }, F: { meet: 9.0, exceed: 7.8 } },
    Open: { M: { meet: 8.0, exceed: 6.8 }, F: { meet: 8.8, exceed: 7.6 } },
  },
};