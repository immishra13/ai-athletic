import { TestInfo } from "@/types";

export const TEST_CATALOG: TestInfo[] = [
  {
    id: "height",
    name: "Height Measurement",
    description: "Basic anthropometric measurement",
    duration: "Single measurement",
    icon: "Ruler",
    unit: "cm",
    minDuration: 5,
    instructions: [
      "Stand straight against the wall",
      "Remove shoes and look straight ahead",
      "Measure at the highest point of the head",
      "Record measurement in centimeters"
    ]
  },
  {
    id: "weight",
    name: "Weight Measurement", 
    description: "Basic anthropometric measurement",
    duration: "Single measurement",
    icon: "Scale",
    unit: "kg",
    minDuration: 5,
    instructions: [
      "Remove shoes and heavy clothing",
      "Stand on scale with feet evenly distributed",
      "Stand still and look straight ahead",
      "Record measurement in kilograms"
    ]
  },
  {
    id: "sit_and_reach",
    name: "Sit and Reach",
    description: "Flexibility assessment for hamstrings and lower back",
    duration: "3 attempts",
    icon: "Move",
    unit: "cm",
    minDuration: 15,
    instructions: [
      "Sit with legs straight and feet against the box",
      "Keep knees straight throughout the test",
      "Slowly reach forward as far as possible",
      "Hold position for 2 seconds, best of 3 attempts"
    ]
  },
  {
    id: "vertical_jump",
    name: "Standing Vertical Jump",
    description: "Lower body explosive strength assessment",
    duration: "3 attempts",
    icon: "ArrowUp",
    unit: "cm",
    minDuration: 15,
    instructions: [
      "Stand with feet shoulder-width apart",
      "Jump as high as possible with arm swing",
      "Land safely on both feet",
      "Complete 3 attempts, best score counts"
    ]
  },
  {
    id: "broad_jump",
    name: "Standing Broad Jump",
    description: "Lower body explosive strength assessment",
    duration: "3 attempts", 
    icon: "ArrowRight",
    unit: "m",
    minDuration: 15,
    instructions: [
      "Stand at the take-off line with feet together",
      "Swing arms and jump forward as far as possible",
      "Land with both feet, measurement from heel",
      "Complete 3 attempts, best distance counts"
    ]
  },
  {
    id: "medicine_ball_throw",
    name: "Medicine Ball Throw",
    description: "Upper body strength assessment",
    duration: "3 attempts",
    icon: "Circle",
    unit: "m",
    minDuration: 15,
    instructions: [
      "Hold medicine ball with both hands at chest",
      "Throw ball forward as far as possible",
      "Keep feet planted during throw",
      "Complete 3 attempts, best distance counts"
    ]
  },
  {
    id: "30m_sprint",
    name: "30m Standing Start",
    description: "Speed assessment over short distance",
    duration: "Single run",
    icon: "Zap",
    unit: "sec",
    minDuration: 8,
    instructions: [
      "Start in standing position at the line",
      "Run as fast as possible for 30 meters",
      "Maintain maximum speed throughout",
      "Time recorded to nearest 0.1 second"
    ]
  },
  {
    id: "shuttle_4x10",
    name: "4 × 10m Shuttle Run",
    description: "Agility and change of direction assessment",
    duration: "Single run",
    icon: "RotateCcw",
    unit: "sec",
    minDuration: 12,
    instructions: [
      "Start at line A, sprint to line B (10m)",
      "Touch the line and return to start",
      "Complete 4 total sprints (40m total)",
      "Time recorded for complete sequence"
    ]
  },
  {
    id: "situps",
    name: "Sit-ups Test",
    description: "Core strength and muscular endurance",
    duration: "60 seconds",
    icon: "Activity",
    unit: "reps",
    minDuration: 55,
    instructions: [
      "Lie on back, knees bent at 90 degrees",
      "Hands crossed over chest or behind head",
      "Complete as many sit-ups as possible in 60s",
      "Full range of motion required"
    ]
  },
  {
    id: "endurance_run",
    name: "Endurance Run",
    description: "Cardiovascular fitness assessment (800m for U-12, 1.6km for 12+)",
    duration: "Continuous run",
    icon: "Timer",
    unit: "min",
    minDuration: 180,
    instructions: [
      "Run distance at maximum sustainable effort",
      "800m for Under-12, 1.6km for 12+ years",
      "Maintain consistent pace throughout",
      "Record total time to completion"
    ]
  }
];