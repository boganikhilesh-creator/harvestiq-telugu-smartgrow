# HarvestIQ

A smart farming assistant web application built for Indian farmers, providing crop planning, weather monitoring, plant health analysis, market prices, and a crop library.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Routing**: React Router DOM v6
- **State/Data**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Auth & Database**: Supabase (hosted PostgreSQL with Row Level Security)
- **Animations**: Framer Motion
- **Charts**: Recharts

## Project Structure

```
src/
  App.tsx              # Root app with providers and routes
  pages/               # Page components (Index, Login, Signup, Profile, CropPlanner, etc.)
  components/          # Shared UI components (Navbar, Footer, shadcn/ui components)
  contexts/            # React contexts (AuthContext, LanguageContext)
  integrations/supabase/ # Supabase client + type definitions
  data/                # Static data (crops, farm data)
  hooks/               # Custom hooks
supabase/
  migrations/          # SQL migration files for Supabase
```

## Environment Variables

Stored in Replit environment variables (not .env file):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` — Supabase project ID

## Running the App

```
npm run dev
```

Starts Vite dev server on port 5000.

## Key Features

- **Authentication**: Sign up / login via Supabase Auth with farmer profile creation
- **Crop Planner**: Plan crops based on season, soil, and location
- **Weather Dashboard**: Real-time weather data for the farm's district
- **Plant Health**: Diagnose plant diseases
- **Crop Library**: Browse crop information
- **Market Prices**: View current market prices
- **Profile**: Manage farmer details (name, district, soil type, farm size, language)
- **Multi-language**: English and Telugu support

## Architecture Notes

This is a pure frontend SPA. All data access goes through Supabase's client SDK directly from the browser, secured by Row Level Security (RLS) policies on the database.
