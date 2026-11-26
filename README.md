# Sports Assessment Institute — AI-Powered Talent Testing

Record your athletic performance, get instant analysis, and connect with
scouts and academies. A front-end prototype: athletes run standardised
fitness tests, scores are compared against age-group benchmarks, and
results can be submitted to the Sports Assessment Institute (SAI) for
official evaluation.

> Demo note: this is a front-end prototype. The landing page says so
> plainly — "AI analysis is simulated" — and the app seeds demo data on
> load. There is no real AI model or backend yet.

## How it works

1. **Record** — Upload a video or use the live camera to record a test.
2. **AI Analysis** — On-device AI analyses technique, counts reps and
   measures performance. (Simulated in this demo.)
3. **Score** — Instant scores with benchmark comparisons and quality
   flags.
4. **Submit** — Submit results to the Sports Assessment Institute for
   official evaluation.

## The 10 tests

| Test | What it measures | Unit |
| --- | --- | --- |
| Height Measurement | Basic anthropometric measurement | cm |
| Weight Measurement | Basic anthropometric measurement | kg |
| Sit and Reach | Flexibility, hamstrings and lower back | cm |
| Standing Vertical Jump | Lower body explosive strength | cm |
| Standing Broad Jump | Lower body explosive strength | m |
| Medicine Ball Throw | Upper body strength | m |
| 30m Standing Start | Speed over a short distance | sec |
| 4 × 10m Shuttle Run | Agility and change of direction | sec |
| Sit-ups Test | Core endurance | reps |
| Endurance Run | Aerobic endurance | min |

Each test ships with step-by-step instructions (for example, vertical
jump is best of 3 attempts) and a minimum duration.

## Benchmarks

Every test is scored against age-group benchmarks — U14, U16, U18 and
Open — split by male and female, each with a "meet" and an "exceed"
threshold. For example, the U18 men's vertical jump benchmark is 40 cm
to meet, 50 cm to exceed; the Open women's 30m sprint is 5.0 sec to
meet, 4.3 sec to exceed.

## Pages

- `/` — Landing page: "Test. Verify. Get Discovered."
- `/tests` — Test catalog (all 10 tests)
- `/tests/:testId` — Test runner with instructions and recording
- `/profile` — Athlete profile and results
- `/officials` — SAI officials dashboard (demo)
- `/admin` — Admin view

## Tech stack

- React 18 + TypeScript + Vite
- shadcn/ui (Radix UI primitives) + Tailwind CSS
- Zustand for state (demo data seeded on load), React Query
- React Router for routing, Recharts for charts
- Deployed as a single-page app on Vercel (`vercel.json` rewrites all
  routes to `index.html`)

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # ESLint
```

## Status

Prototype, built September 2025. The honest next steps are a real
video-analysis model behind the "AI Analysis" step and a backend to
replace the seeded demo data.
