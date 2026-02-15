# EU Jobs (eujobs.co)

A full-stack job board platform for European Union positions, government roles, and policy careers — primarily centered around Brussels and EU institutions.

## Overview

EU Jobs connects job seekers with opportunities in the EU policy space. The platform includes job posting and search, a lobbying entities directory, AI-generated career guides, a recruiter/headhunter marketplace, a salary calculator, and a blog with career advice.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) with React 18 and TypeScript |
| **Styling** | Tailwind CSS, Radix UI, FontAwesome |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | WorkOS AuthKit (OAuth) |
| **Payments** | Stripe (checkout sessions, tiered pricing) |
| **File Storage** | Google Cloud Storage, Firebase Admin SDK |
| **Email** | Brevo (newsletters), SendGrid, Resend (transactional) |
| **AI** | Azure OpenAI / OpenAI SDK (career guide generation) |
| **Analytics** | PostHog, Google Analytics, Ahrefs |
| **Package Manager** | pnpm |
| **Testing** | Jest (unit + component tests) |

## Project Structure

```
src/
├── app/
│   ├── api/                  # REST API routes
│   │   ├── search/           # Multi-type search endpoint
│   │   ├── jobs/             # Job CRUD operations
│   │   ├── auth/             # WorkOS OAuth callback
│   │   ├── email/            # Email delivery
│   │   ├── headhunter/       # Recruiter status updates
│   │   ├── career-guides/    # Career guide retrieval
│   │   ├── newsletter/       # Brevo newsletter signup
│   │   ├── upload-cv/        # CV file upload
│   │   ├── create-checkout-session/   # Stripe job posting checkout
│   │   ├── create-headhunter-checkout/ # Stripe recruiter checkout
│   │   ├── list-prices/      # Stripe pricing
│   │   └── verify-session/   # Auth session verification
│   │
│   ├── components/           # Reusable React components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Hero.tsx          # Landing hero section
│   │   ├── Jobs.tsx          # Job listing display
│   │   ├── JobRow.tsx        # Individual job card
│   │   ├── JobFilterBar.tsx  # Filter/search controls
│   │   ├── JobForm.tsx       # Job posting form
│   │   ├── SearchBar.tsx     # Search input
│   │   ├── SearchModal.tsx   # Modal search interface
│   │   ├── SearchResultCard.tsx
│   │   ├── CareerGuideSection.tsx
│   │   ├── FairPayCalculator.tsx
│   │   ├── NewsletterSignup.tsx
│   │   └── jobform/          # Job form sub-components
│   │
│   ├── actions/              # Next.js server actions
│   │   ├── jobActions.ts     # Job CRUD
│   │   └── userActions.ts    # User operations
│   │
│   ├── providers/            # React context providers
│   │
│   ├── search/               # Search page
│   ├── jobs/                 # Job detail & edit pages
│   ├── lobbying-entities/    # EU lobbying directory
│   ├── blog/                 # Blog listing & posts
│   ├── headhunter/           # Recruiter marketplace
│   ├── new-listing/          # Job posting flow
│   ├── all-jobs/             # Full job directory
│   ├── fairpay/              # Salary calculator
│   ├── dashboard/            # User dashboard
│   └── [filter]/             # Dynamic filter routes
│
├── models/                   # Mongoose schemas
│   ├── Job.ts                # Job postings
│   ├── User.ts               # Users (WorkOS integration)
│   ├── CareerGuide.ts        # AI-generated career guides
│   ├── HeadhunterRequest.ts  # Recruiter requests
│   └── LobbyingEntity.js    # EU lobbying organizations
│
├── lib/                      # Utility libraries
│   ├── dbConnect.js          # MongoDB connection singleton
│   ├── searchUtils.ts        # Search logic & scoring
│   ├── blogUtils.ts          # Blog utilities
│   ├── sendEmail.ts          # Email service wrapper
│   ├── pdfParser.ts          # PDF extraction
│   ├── interestAggregation.ts
│   └── firebase.tsx          # Firebase initialization
│
├── types/                    # TypeScript type definitions
├── emails/                   # Email templates
├── blog/                     # Markdown blog posts
└── tests/                    # Test & debug scripts
```

## Features

### Job Board
- **Job Posting** with tiered pricing (Basic $99.99 / Pro $299.99 / Recruiter $500) via Stripe
- **Advanced Filtering** by location (country/state/city), seniority level, job type, and salary
- **Full-Text Search** across jobs, lobbying entities, blog posts, and career guides with relevance scoring
- **Auto-generated Slugs** for SEO-friendly URLs
- **AI Application Blocking** — employers can opt to block automated/AI applications
- **Job Expiration** with automatic cleanup

### Lobbying Entities Directory
- Browse EU lobbying organizations from the Transparency Register
- View associated job listings per entity
- AI-generated career guides for each organization
- Interest aggregation and analytics

### Headhunter Marketplace
- Tiered recruiter services with Stripe payments
- Candidate vetting and meeting scheduling
- Success-based payment options

### Additional Features
- **Fair Pay Calculator** — EU salary benchmarking tool
- **Blog** — Markdown-based articles on EU careers
- **Newsletter** — Brevo-powered email subscriptions
- **CV Upload** — Cloud storage via Google Cloud Storage

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- MongoDB instance
- Required service accounts (see Environment Variables)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd eujobs

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in the required values (see Environment Variables section)

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Jest tests |

## Environment Variables

The application requires the following environment variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `WORKOS_API_KEY` | WorkOS API key for authentication |
| `WORKOS_CLIENT_ID` | WorkOS client ID |
| `WORKOS_COOKIE_PASSWORD` | WorkOS session cookie encryption key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_BASIC_PRICE_ID` | Stripe price ID for basic plan |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for pro plan |
| `STRIPE_RECRUITER_PRICE_ID` | Stripe price ID for recruiter plan |
| `OPENAI_API_KEY` | OpenAI API key (career guide generation) |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key (optional fallback) |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Firebase service account (base64 encoded) |
| `GCS_BUCKET_NAME` | Google Cloud Storage bucket name |
| `BREVO_API_KEY` | Brevo API key for newsletters |
| `SENDGRID_API_KEY` | SendGrid API key |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |

## Database Models

### Job
Core job posting with fields for title, description, company, location (country/state/city), seniority (`intern`, `junior`, `mid-level`, `senior`), plan tier (`pending`, `basic`, `pro`, `recruiter`, `unlimited`), salary, apply link, and contact info. Auto-generates SEO slugs.

### User
User accounts linked to WorkOS, tracking email, name, and `isJobPoster` role flag.

### LobbyingEntity
EU Transparency Register organizations with flexible schema covering name, acronym, description, goals, interests, registration details, and web presence.

### CareerGuide
AI-generated career guides linked to lobbying entities by `entityId`, with word count and generation status tracking.

### HeadhunterRequest
Recruiter marketplace orders tracking tier, company, role, contact info, and status (`pending`, `paid`, `completed`, `cancelled`).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=&type=&limit=&offset=` | Multi-type search with relevance scoring |
| GET | `/api/jobs?limit=&skip=&filter=` | List jobs with filtering |
| DELETE | `/api/jobs?id=` | Delete a job |
| GET | `/api/jobs/[id]` | Get job by ID or slug |
| GET | `/api/career-guides/[entityId]` | Get career guide for an entity |
| POST | `/api/auth/callback` | WorkOS OAuth callback |
| POST | `/api/create-checkout-session` | Create Stripe checkout for job posting |
| POST | `/api/create-headhunter-checkout` | Create Stripe checkout for recruiter service |
| POST | `/api/email/send-job` | Email a job to a candidate |
| POST | `/api/headhunter/update-status` | Update recruiter request status |
| GET | `/api/list-prices` | Fetch Stripe pricing |
| POST | `/api/newsletter/signup` | Subscribe to newsletter via Brevo |
| POST | `/api/upload-cv` | Upload CV to Google Cloud Storage |
| GET | `/api/verify-session` | Verify authentication session |

## Deployment

### Vercel (Primary)

The project is configured for Vercel deployment via `vercel.json`:

```bash
# Deploy to Vercel
vercel --prod
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d --build

# Or build manually
docker build -t eujobs .
docker run -p 3000:3000 --env-file .env.production eujobs
```

The Docker setup uses a multi-stage Node 20 Alpine build with health checks and resource limits (4 CPUs, 4GB RAM).

### Auto-Deploy

A deployment script (`deploy.sh`) handles pulling latest code, building, restarting containers, and running health checks. See `AUTO_DEPLOY_SETUP.md` for webhook-based auto-deploy configuration.

## Architecture Notes

- **Rendering Strategy**: Uses Incremental Static Regeneration (ISR) — job pages revalidate every hour, entity pages every 24 hours
- **Search**: Regex-based search with a custom relevance scoring algorithm (title match > description match, with word boundary bonuses)
- **Authentication Flow**: WorkOS OAuth → session cookie → user model lookup
- **Payment Flow**: Plan selection → Stripe checkout → webhook confirmation → job activation
- **Email Stack**: Brevo for newsletter list management, SendGrid/Resend for transactional delivery
