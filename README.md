# Wasl (وصل) — RishtaOS Matrimonial Platform

> **Verified Matrimonial Marketplace + Structured Family Participation + Explainable AI Compatibility**

Wasl is a production-grade matrimonial platform engineered for Pakistani Muslim professionals aged 22–35.

---

## Architecture Overview

```
rishta-platform/
├── apps/
│   ├── web-public/         # Next.js 15 SSR/SSG Public SEO Surface (Port 3000)
│   ├── web-app/            # Next.js Authenticated Candidate & Family Dashboard (Port 3001)
│   └── web-admin/          # Next.js Internal Trust & Safety Moderation Console (Port 3002)
├── packages/
│   ├── shared-types/       # Enums, Zod Schemas, Proposal State Machine DTOs
│   ├── compatibility-engine/# Pure TypeScript 100-pt Deterministic Scoring & Hard Filters
│   └── database/           # Prisma PostgreSQL schema with pgvector (768-dim embeddings)
├── backend/                # Fastify Modular API Server with Swagger Docs (Port 4000)
└── docker/                 # PostgreSQL (pgvector), Redis, MinIO docker-compose.yml
```

---

## Key Differentiators Built

1. **Deterministic 100-Point Matching Engine** (`@wasl/compatibility-engine`):
   - Location (20 pts), Family Structure (20 pts), Career Expectations (20 pts), Religious Values (15 pts), Education (15 pts), Lifestyle (10 pts).
   - Zero LLM dependency in the scoring loop for complete auditability.
2. **Discrete Verification Badges** (`PHONE`, `EMAIL`, `CNIC_IDENTITY`, `EDUCATION`, `EMPLOYMENT`, `WALI_VERIFIED`):
   - No single opaque trust score.
   - KMS-encrypted document storage for CNIC and degree scans.
3. **Structured Family Mode**:
   - Candidate invites parents or siblings with granular, instantly revokable permissions (`view_profile`, `view_family_info`, `suggest_matches`, `review_proposals`, `chaperone_chat`).
4. **8-Stage Proposal State Machine**:
   - `DISCOVERED` $\to$ `INTERESTED` $\to$ `FAMILY_INTERESTED` $\to$ `INTRODUCTION_REQUESTED` $\to$ `SUPERVISED_CHAT` $\to$ `VOICE_VIDEO` $\to$ `FAMILY_MEETING` $\to$ `ENGAGED` / `WITHDRAWN`.
5. **Supervised Chat & Auto-Moderation**:
   - Chaperoned message threads with real-time regex/NLP filters guarding against unauthorized contact detail leaks.
6. **Programmatic Localized SEO**:
   - Next.js 15 App Router with pre-rendered landing pages (`/city/lahore`, `/city/islamabad`, `/city/karachi`, `/city/faisalabad`) and Schema.org JSON-LD structured data.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **Docker**: (Optional, for local PostgreSQL + pgvector)

### 2. Install & Build
```bash
# Install all dependencies across workspaces
npm install

# Build all packages, Next.js apps, and backend
npm run build

# Run full test suite (15/15 tests)
npm run test
```

### 3. Local Development Port Map
| Application / Service | Path | Port | Description |
|---|---|---|---|
| **Public SEO Web** | `apps/web-public` | `http://localhost:3000` | Landing pages, `/city/*`, pricing, how-it-works |
| **Candidate Web App** | `apps/web-app` | `http://localhost:3001` | Candidate & Family dashboard, chat, proposals |
| **Admin Console** | `apps/web-admin` | `http://localhost:3002` | KYC queue review & automod triage |
| **Backend API** | `backend` | `http://localhost:4000` | Fastify REST API & Swagger Docs (`/docs`) |

### 4. Running the Dev Servers
```bash
# Start backend API
npm --workspace=backend run dev

# Start Public SEO site
npm --workspace=apps/web-public run dev

# Start Candidate App
npm --workspace=apps/web-app run dev

# Start Admin Console
npm --workspace=apps/web-admin run dev
```

### 5. Running with Docker Compose
```bash
docker compose -f docker/docker-compose.yml up -d
```
