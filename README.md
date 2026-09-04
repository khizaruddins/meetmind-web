# MeetMind Web Platform (`meeting-recorder-web`)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.25-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

The official web application and SaaS portal for **MeetMind** — the next-generation, privacy-first meeting and desktop recording platform. Built with **Next.js 14 App Router**, **React 18**, **Tailwind CSS**, and **Three.js**, this application unifies the public marketing experience, the self-service Customer Portal, and the enterprise Admin Operations Command Center.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
  - [Cinematic 3D Marketing Experience](#1-cinematic-3d-marketing-experience)
  - [Self-Service Customer Portal (`/app/*`)](#2-self-service-customer-portal-app)
  - [Admin Operations Command Center (`/admin/*`)](#3-admin-operations-command-center-admin)
- [Directory Structure](#-directory-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
  - [Installation](#1-installation)
  - [Development Server](#2-development-server)
  - [Production Build & Run](#3-production-build--run)
- [Route Architecture](#-route-architecture)
- [Authentication & Security Flow](#-authentication--security-flow)
- [Verification & Linting](#-verification--linting)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 🏛 Architectural Overview

```
                          ┌──────────────────────────┐
                          │   MeetMind Web Client    │
                          │   (Next.js 14 App Router)│
                          └─────────────┬────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌─────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│ Public Marketing│           │ Customer Portal  │           │ Admin Operations │
│   & Docs Hub    │           │    (`/app/*`)    │           │   (`/admin/*`)   │
│                 │           │                  │           │                  │
│ • Three.js 3D   │           │ • Dashboard      │           │ • Executive KPIs │
│ • Interactive   │           │ • Recordings     │           │ • User Inspector │
│   AEC Toggle    │           │ • Subscription   │           │ • Trial Board    │
│ • Pricing Matrix│           │ • Billing/Invoices│          │ • Plan Manager   │
│ • OS Downloads  │           │ • Device Manager │           │ • Audit Logs     │
│ • OS Doc Guides │           │ • Session Revoke │           │ • Health Monitor │
└────────┬────────┘           └────────┬─────────┘           └────────┬─────────┘
         │                             │                              │
         └─────────────────────────────┼──────────────────────────────┘
                                       │ REST / JSON (Bearer JWT)
                                       ▼
                     ┌───────────────────────────────────┐
                     │   MeetMind API (NestJS + Prisma)  │
                     │       http://localhost:3001/v1    │
                     └───────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Cinematic 3D Marketing Experience
- **Interactive Three.js Recorder Mockup**: GPU-accelerated WebGL viewport with dynamic lighting, orbiting audio wave particle mesh, and responsive camera tilt.
- **Acoustic Echo Cancellation (AEC) Interactive Toggle**: Live side-by-side simulation demonstrating raw audio feed versus WebRTC-processed clean speech.
- **Dynamic Tier Comparison**: Monthly/Annual pricing switcher calculating 20% annual savings across **Trial**, **Silver** ($19/mo), and **Gold** ($39/mo) plans.
- **OS-Aware Smart Downloads**: Automatically detects Linux, macOS (Intel/Apple Silicon), and Windows with platform-tailored installation guides.
- **Comprehensive Docs Hub**: Dedicated technical guides for [Linux](src/app/docs/linux), [Windows](src/app/docs/windows), [macOS](src/app/docs/macos), and the [Chrome Extension](src/app/docs/chrome-extension).

### 2. Self-Service Customer Portal (`/app/*`)
- **Executive Dashboard**: Recording volume telemetry, 30-day trial countdown progress bar, daily quota tracker (30 mins/day on Trial, unlimited on Silver/Gold), and recent session logs.
- **Subscription Management**: Instant plan upgrade/downgrade preview modal displaying prorated amounts, billing interval switches, and self-service cancellation.
- **Billing & Invoices**: Tokenized payment methods display (Visa, Mastercard, Amex), invoice ledger with status badges (`PAID`, `OPEN`), and instant PDF invoice download triggers.
- **Device Management**: View registered desktop installations (Linux, macOS, Windows) with installation IDs and last-seen timestamps, with individual device revocation.
- **Security & Session Management**:
  - View all active browser and desktop sessions with device model, IP address, user agent, and last active timestamp.
  - Revoke individual suspicious sessions or trigger **"Revoke all other sessions"**.
  - Account verification status with **"Resend Verification Email"** flow.

### 3. Admin Operations Command Center (`/admin/*`)
- **Dedicated Admin Authentication**: Isolated `/admin/login` portal requiring administrative privileges (`SUPER_ADMIN`, `SUPPORT_ADMIN`, `BILLING_ADMIN`, etc.).
- **Platform KPI Overview**: Real-time business metrics including Total Users, Active Trials, Paid Subscriptions, Monthly Recurring Revenue (MRR), and Past Due alerts.
- **Deep User Inspector (`/admin/users/[id]`)**:
  - Comprehensive customer detail view (profile, subscription status, trial timeline).
  - One-click operational actions: **Extend Trial (7 Days or Custom)**, **Reset Daily Quota**, **Change Plan**, and **Revoke All Active Sessions**.
  - Administrative notes ledger with real-time staff note authoring.
- **Trial Conversion Board**: Dedicated pipeline view to track expiring trials, days remaining, and conversion probability.
- **System Health Monitor**: Live latency gauges and operational status for PostgreSQL, Billing Providers, Notification Queue, and System Memory.
- **Audit Logs Explorer**: Immutable audit trail logging actor ID, action key, entity target, metadata payload, IP address, and timestamps.

---

## 📂 Directory Structure

```
meeting-recorder-web/
├── public/                     # Static assets, branding, icons, OS badges
├── src/
│   ├── app/                    # Next.js 14 App Router routes (48 routes)
│   │   ├── (auth)/             # Authentication route group
│   │   │   ├── login/          # Customer login page
│   │   │   ├── register/       # Self-service registration
│   │   │   ├── verify-email/   # Email token verification & resend trigger
│   │   │   ├── forgot-password/# Password recovery request
│   │   │   └── reset-password/ # Secure password reset submission
│   │   ├── admin/              # Admin Operations Command Center
│   │   │   ├── analytics/      # Business intelligence & retention funnels
│   │   │   ├── audit-logs/     # Immutable administrative audit logs
│   │   │   ├── dashboard/      # Executive KPIs & high-level platform stats
│   │   │   ├── invoices/       # Ledger of customer invoices across system
│   │   │   ├── login/          # Isolated administrative login
│   │   │   ├── payments/       # Transaction logs & payment events
│   │   │   ├── plans/          # Dynamic plan catalog manager
│   │   │   ├── recordings/     # Platform-wide recording telemetry inspector
│   │   │   ├── settings/       # Global system configuration & toggles
│   │   │   ├── subscriptions/  # Subscriptions ledger across all tiers
│   │   │   ├── system-health/  # Real-time infrastructure latency & health
│   │   │   ├── trials/         # Trial conversion board
│   │   │   ├── usage/          # Aggregated daily recording volume
│   │   │   └── users/          # Searchable user directory & deep inspector
│   │   │       └── [id]/       # Individual customer profile & operations
│   │   ├── app/                # Customer Portal (Requires Customer Auth)
│   │   │   ├── account/        # Profile editing, password change, activity
│   │   │   ├── billing/        # Billing overview & payment settings
│   │   │   ├── dashboard/      # Customer telemetry & quick actions
│   │   │   ├── devices/        # Registered desktop devices & revoke
│   │   │   ├── downloads/      # Native desktop client & extension binaries
│   │   │   ├── invoices/       # Invoices list with PDF download triggers
│   │   │   ├── payment-methods/# Tokenized cards & payment sources
│   │   │   ├── recordings/     # Local recording metadata catalog
│   │   │   ├── security/       # Active sessions list & email verification
│   │   │   └── subscription/   # Plan switch, proration preview, cancel
│   │   ├── docs/               # Technical documentation hub (Linux/Mac/Win)
│   │   ├── download/           # Public OS-aware binary download page
│   │   ├── features/           # Deep-dive architecture & capability tours
│   │   ├── pricing/            # Interactive plan & feature matrix
│   │   ├── privacy/            # Privacy policy & local-first disclosure
│   │   ├── releases/           # Version changelog & binary release notes
│   │   ├── security/           # Whitepaper on local recording encryption
│   │   ├── terms/              # Terms of service
│   │   ├── layout.tsx          # Root HTML layout with Google Font & Theme
│   │   └── page.tsx            # Cinematic 3D landing page
│   ├── components/             # Reusable UI components
│   │   ├── 3d/                 # Three.js WebGL canvas & particle shaders
│   │   ├── admin/              # Admin navigation, stat cards, data tables
│   │   ├── app/                # Customer portal navigation, session cards
│   │   ├── common/             # Modals, buttons, inputs, badge components
│   │   └── landing/            # Landing hero, feature grids, pricing cards
│   ├── lib/                    # Shared utilities, API client, auth helpers
│   │   ├── api.ts              # Fetch wrapper with JWT injection & error handling
│   │   ├── auth.ts             # Client-side session and cookie management
│   │   └── utils.ts            # Formatting, time calculation, class merging
│   └── types/                  # TypeScript definitions for entities & API
├── .env.example                # Sample environment configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Project dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS design system tokens
└── tsconfig.json               # TypeScript compiler configuration
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.17.0` or higher (tested on `v20.x` and `v22.x`)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), or `yarn` (v1.22+)
- **Backend API**: Running instance of `meeting-recorder-api` (defaults to `http://localhost:3001/v1`)

---

## 🔧 Environment Configuration

Create a `.env.local` file in the root of `meeting-recorder-web` by copying `.env.example`:

```bash
cp .env.example .env.local
```

### Configuration Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `string` (URL) | `http://localhost:3001/v1` | Fully qualified base URL of the backend REST API. |

> [!NOTE]
> The web application does **not** store administrative secrets, database passwords, or payment gateway private keys. All sensitive mutations are handled via authenticated HTTP-only/Bearer token requests to `meeting-recorder-api`.

---

## 🚀 Getting Started

### 1. Installation

Install all project dependencies:

```bash
npm install
```

### 2. Development Server

Start the local development server with Turbopack / Fast Refresh on port `3000`:

```bash
npm run dev
```

Visit the application in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Customer Sign In**: [http://localhost:3000/login](http://localhost:3000/login)
- **Customer Portal**: [http://localhost:3000/app/dashboard](http://localhost:3000/app/dashboard)
- **Admin Operations**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 3. Production Build & Run

Validate TypeScript types, compile CSS, and build all 48 static/dynamic App Router pages:

```bash
# Build production bundle
npm run build

# Start production server on port 3000
npm run start
```

---

## 🗺 Route Architecture

| Route Path | Category | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | Marketing | Public | Cinematic 3D landing page with Three.js HUD and AEC demo. |
| `/pricing` | Marketing | Public | Interactive tier matrix (Trial, Silver, Gold) with annual toggle. |
| `/features` | Marketing | Public | Architectural breakdown of AEC, hardware codecs, and privacy. |
| `/download` | Marketing | Public | OS-aware download selector for Linux, macOS, and Windows. |
| `/docs/*` | Marketing | Public | OS-specific setup guides and Chrome Extension instructions. |
| `/login` | Auth | Public | Unified customer sign-in supporting credentials authentication. |
| `/register` | Auth | Public | New account registration with automatic 30-day Free Trial assignment. |
| `/verify-email` | Auth | Public | Token verification landing with "Resend Verification" trigger. |
| `/app/dashboard` | Customer | Authenticated | Customer telemetry, trial timer, daily quota bar, recent recordings. |
| `/app/recordings` | Customer | Authenticated | Synchronized recording metadata list with duration and platform tags. |
| `/app/subscription`| Customer | Authenticated | Plan switcher, proration calculation preview, cancellation workflow. |
| `/app/billing` | Customer | Authenticated | Billing summary, payment sources, and invoice access. |
| `/app/invoices` | Customer | Authenticated | Invoice ledger with instant PDF generation/download triggers. |
| `/app/devices` | Customer | Authenticated | Device installation ID registry with individual revocation. |
| `/app/security` | Customer | Authenticated | Active session inspector with "Revoke All Other Sessions" action. |
| `/admin/login` | Admin | Public | Isolated administrator authentication gateway. |
| `/admin/dashboard`| Admin | Admin Role | Platform KPI metrics: MRR, active trials, paying counts, system alerts. |
| `/admin/users` | Admin | Admin Role | Full user directory with status filters and quick search. |
| `/admin/users/[id]`| Admin | Admin Role | Customer deep-dive: extend trial, reset quota, revoke sessions, notes. |
| `/admin/trials` | Admin | Admin Role | Trial conversion pipeline and expiration tracking board. |
| `/admin/system-health`| Admin | Admin Role | Live database, billing, queue latency, and infrastructure status. |
| `/admin/audit-logs`| Admin | Admin Role | Immutable administrative audit log with payload inspection. |

---

## 🔒 Authentication & Security Flow

```
User (Browser)               Next.js App Router             NestJS API (Port 3001)
     │                               │                                │
     ├────── Submit Credentials ────►│                                │
     │       (Email + Password)      ├────── POST /v1/auth/login ────►│
     │                               │                                │ (Argon2id verify)
     │                               │◄───── Return Access + Refresh ─┤
     │◄───── Set JWT in Storage ─────┤       (15m Access, 30d Refresh)│
     │                               │                                │
     ├────── Navigate to /app/* ────►│                                │
     │                               ├────── GET /v1/auth/me ────────►│ (Verify Bearer)
     │                               │◄───── Return User Profile ─────┤
     │◄───── Render Customer Portal ─┤                                │
```

### Security Highlights
- **Zero Raw Media Access**: The web platform never uploads, stores, or handles video or audio recording files. All media stays on the local disk.
- **Strict Role-Based Separation**: Customer sessions cannot access `/admin/*` endpoints. Admin endpoints enforce distinct API permissions (`users.read`, `trial.extend`, `subscriptions.write`).
- **Session Revocation**: When a session is revoked via `/app/security` or `/admin/users/[id]`, the refresh token hash is invalidated immediately in PostgreSQL.
- **Cross-Site Scripting (XSS) Prevention**: All dynamic values in audit logs, user notes, and device names are strictly escaped in React JSX.

---

## 🧪 Verification & Linting

Run static code analysis and Next.js route validation:

```bash
# Check TypeScript compilation and lint rules
npm run lint

# Validate production build (checks all 48 routes)
npm run build
```

Expected build output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    ... kB          ... kB
├ ○ /admin/dashboard                     ... kB          ... kB
├ ○ /admin/users/[id]                    ... kB          ... kB
├ ○ /app/dashboard                       ... kB          ... kB
├ ○ /app/security                        ... kB          ... kB
└ ○ /pricing                             ... kB          ... kB
+ First Load JS shared by all            ... kB
```

---

## ❓ Troubleshooting & FAQ

### 1. Web client cannot connect to API (`Failed to fetch`)
- Ensure `meeting-recorder-api` is running on port `3001`:
  ```bash
  curl -i http://localhost:3001/v1/health
  ```
- Check `.env.local` to verify `NEXT_PUBLIC_API_URL=http://localhost:3001/v1`.
- Verify CORS is enabled in the backend API for `http://localhost:3000`.

### 2. 3D Canvas displays black or performance is sluggish
- Three.js requires WebGL support. Verify hardware acceleration is enabled in your browser settings (`chrome://gpu` or `edge://gpu`).
- The landing page includes graceful fallback states if WebGL is unavailable or fails to initialize.

### 3. Admin login fails with 403 Forbidden
- Verify that your user has administrative roles in the database. Ensure the backend was seeded with `ADMIN_SEED_ENABLED=true`.
- Remember that standard customer accounts registered via `/register` do **not** have access to the Admin Portal.

---

## 📄 License

Proprietary Software. All rights reserved © 2026 MeetMind Inc.
