# 🚀 Setup Guide - Dental Clinic Manager SaaS

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Cloudinary account

## Installation

### 1. Clone and Install
```bash
git clone <repo-url>
cd dental-clinic-manager
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

Fill in your credentials:
- Supabase URL & Keys
- Stripe Keys
- Cloudinary Keys

### 3. Setup Supabase

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the migration: `supabase/migrations/001_initial_schema.sql`
4. Enable Auth providers (Email, Google)

### 4. Start Development
```bash
npm run dev
```

Open http://localhost:3000

## Database

### Tables
- `clinics` - Clinic information
- `patients` - Patient records
- `sessions` - Treatment sessions
- `cases` - Before/After cases
- `photos` - Case photos
- `design_templates` - Design templates
- `subscriptions` - Subscription info
- `payments` - Payment records

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Next Steps
See Phase 2 for Authentication & Dashboard implementation.
