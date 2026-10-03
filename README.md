# 🛡️ IMPACTOS v2.0 — Verifiable Impact Evidence & Greenwashing Prevention Platform

> **Verifiable Impact Evidence & Anti-Greenwashing Engine**  
> *"Others show impact. We prove it."*

[![Cloudinary Engine](https://img.shields.io/badge/Cloudinary-v2_Verified_Pipeline-0070F3?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 📌 Executive Summary

Modern sustainability claims, corporate social responsibility (CSR) reports, and carbon offset projects suffer from a critical trust gap: **claims are published before ground evidence is verified**. Uploader-supplied EXIF data can be easily spoofed, photos can be reused across different projects, and AI-generated synthetic images can fabricate non-existent progress.

**IMPACTOS** solves this by establishing an end-to-end evidence verification graph powered by **Cloudinary v2**. It connects field media to project, change, claim, and proof through a **7-Signal Verification Scorecard**, strict **Assurance Tier Caps (T0 to T3)**, an **Adversarial AI Claim Trial Courtroom**, and an automated **Greenwashing Report Card (A to E Audit)**.

---

## 🎯 Key Differentiators: IMPACTOS vs Traditional Platforms

| Dimension | Traditional CSR & DAM Platforms | IMPACTOS Engine v2.0 |
| :--- | :--- | :--- |
| **Media Storage** | Stores media & tags categories | Connects media to immutable proof & claims |
| **Metadata Trust** | Trusts uploader EXIF implicitly | **Capped at T0 (Max 55)** without cryptographic proof |
| **Anti-Spoofing** | None | Live camera token (`/capture/:token`) with server nonce |
| **Duplicate Reuse** | Manual file checks | Automated **Perceptual Hashing (pHash)** cross-library check |
| **AI Claim Testing** | Human review or basic keyword search | **3-Role Adversarial AI Courtroom** (Prosecutor vs Defender vs Judge) |
| **CSR Report Audit** | Unverified PDF downloads | **A-E Grade Audit** checking 5 Specificity Rules (*What, Quantity, Place, Period, Baseline*) |
| **Public Transparency** | Exposes raw unredacted photos | **Cloudinary Privacy Shield** (`e_blur_faces:1000` + coarse GPS) |

---

## 🏗️ End-to-End Verification Pipeline

```mermaid
flowchart TD
    A["1. Field Media Capture / Upload"] --> B["2. Cloudinary Signed Preset & Ingestion"]
    B --> C["3. Signal Extraction Engine (EXIF, pHash, Vision AI)"]
    C --> D["4. 7-Signal Scorecard & Assurance Tier Cap (T0-T3)"]
    D -->|High Risk / Low Score| E["5. Risk-Ordered Review Queue (Human-in-the-Loop)"]
    D -->|Verified Media| F["6. Adversarial AI Claim Trial Courtroom"]
    F --> G["7. Greenwashing Report Card Audit (A to E)"]
    G --> H["8. Public Transparency Showcase (Privacy Shield e_blur_faces)"]
```

---

## ⚡ Core Platform Capabilities

### 1️⃣ The 7-Signal Scoring Engine (100 Points Total)
Every field asset ingested into IMPACTOS is evaluated across 7 independent dimensions:
1. **EXIF GPS Geofence Match (20 pts)**: Verifies if photo coordinates fall strictly within the registered geofenced site radius.
2. **Server Upload Latency Gap (15 pts)**: Measures the time delta between camera shutter capture and server upload.
3. **Perceptual Hash Uniqueness (15 pts)**: Computes image fingerprint hashes (`pHash`) to detect image reuse across projects.
4. **Visual AI Activity Match (15 pts)**: Runs Cloudinary Vision LLM to verify that photo content matches claimed activity (e.g. mangrove sapling vs solar array).
5. **Assurance Tier Cap (15 pts)**: Enforces hard upper bounds on total score based on capture method trust.
6. **Mobile Tamper Nonce (10 pts)**: Cryptographically verifies single-use web capture tokens.
7. **Human Review Queue Bonus (10 pts)**: Awarded once reviewed by an auditor.

---

### 2️⃣ Assurance Tier Caps (T0 to T3)
To prevent uploader fraud and fake metadata injection:
* **Tier T0 (Self-Reported)**: Uploaded via standard forms without cryptographic nonces. **Hard-capped at Max 55/100 points**.
* **Tier T1 (Cross-Checked)**: EXIF GPS & timestamp present, matched against satellite/weather data. **Max 75/100 points**.
* **Tier T1+ (Trusted Web Capture)**: Captured live via `/capture/:token` with single-use server nonce & camera sensor binding. **Max 80/100 points**.
* **Tier T2 (Attested Native)**: Native mobile app capture with device hardware enclave signature. **Max 90/100 points**.
* **Tier T3 (Auditor Confirmed)**: Third-party accredited auditor physical verification. **Max 100/100 points**.

---

### 3️⃣ Adversarial AI Claim Trial Courtroom
When a project submits an impact claim (e.g., *"Restored 15 hectares of degraded farmland in Cauvery Delta with 750+ saplings"*), IMPACTOS triggers a **three-role courtroom exchange**:
* 🔴 **AI Prosecutor**: Aggressively interrogates flaws (e.g., missing baseline photos, duplicate pHash flags, GPS drift).
* 🟢 **AI Defender**: Submits matching ground evidence, EXIF metadata, and camera comparability ratings.
* ⚖️ **AI Judge**: Reviews arguments, cites specific asset IDs, and renders a binding verdict (*Verified*, *Weak*, or *Rejected*).

---

### 4️⃣ Greenwashing Report Card Audit (A to E)
Auditors can upload published sustainability reports (PDFs). The engine:
1. Extracts text claims using NLP.
2. Evaluates each claim against **5 Specificity Rules**:
   - **What**: Is the concrete action named?
   - **How Much**: Is a quantitative unit specified?
   - **Where**: Is an exact location/site declared?
   - **When**: Is a clear timeframe stated?
   - **Baseline**: Is a comparison baseline provided?
3. Cross-references claims against ground-truth field assets in the database.
4. Outputs an overall **A to E Greenwashing Audit Grade**.

---

### 5️⃣ Cloudinary Face Privacy Shield
For public transparency dashboards and donor reports, IMPACTOS applies dynamic Cloudinary URL transformations:
- **`e_blur_faces:1000`**: Automatically redacts faces of field workers and local community members.
- **Coarse GPS Rounding**: Obfuscates precise coordinates to protect field site security while preserving regional verification.

---

## ☁️ Cloudinary API Feature Mapping

| Requirement | Cloudinary API Capability | Application Usage in IMPACTOS |
| :--- | :--- | :--- |
| **Ingestion** | Signed Upload Presets | Secures client uploads; binds EXIF & nonces |
| **Automation** | Notification Webhooks | Enqueues background pHash & AI vision jobs |
| **Metadata** | Resource Metadata & EXIF Flags | Extracts camera specs, lat/long, capture time |
| **Duplicate Detection** | Perceptual Hashing (`phash`) | Blocks cross-library asset reuse |
| **AI Tagging** | Cloudinary Vision LLM & Auto-Tagging | Tags terrain, sapling counts, solar panels |
| **Privacy Shield** | Face Detection (`e_blur_faces:1000`) | Auto-blurs faces for public read-only views |
| **Social Exports** | Smart Crop (`c_fill,g_auto`) | Generates 1:1 social cards for impact campaigns |
| **Video Timelapses** | Image Slideshow Generation | Stitches site photos chronologically into MP4s |

---

## 💻 Tech Stack

- **Frontend Framework**: React 18 (TypeScript) + Vite 5
- **Styling & UI**: Vanilla CSS + Tailwind CSS v4 (`@tailwindcss/postcss`) + Outfit / Inter Typography
- **Icons & Animation**: Lucide Icons + Canvas Confetti
- **Mapping & Geofencing**: Leaflet Maps + OpenStreetMap API
- **Media Optimization & AI**: Cloudinary API v2 (Signed Presets, pHash, Vision LLM, `e_blur_faces`)

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/kartikthhakur07/Impactos.git
cd Impactos

# 2. Start Frontend Dev Server (React 19 + Vite)
npm run dev:frontend
# Launches on http://localhost:5173/

# 3. Start Backend Express Server (Node.js + TS)
npm run dev:backend
# Launches on http://localhost:5000/
```

### TypeScript Type Checks
```bash
# Frontend type check
npm run build:frontend

# Backend type check
npm run build:backend
```

---

## 📁 Repository Directory Structure

```
impactos/
├── frontend/                               # React 19 + TypeScript + Vite 5 Frontend Application
│   ├── src/
│   │   ├── components/                     # Component modules (LandingView, Dashboard, ProjectsView, etc.)
│   │   ├── data/                           # 5 Seeded projects & 30+ real Unsplash field assets
│   │   ├── types/                          # TypeScript interface contracts
│   │   ├── App.tsx                         # Primary router & decluttered header navigation
│   │   └── main.tsx                        # DOM mount entry point
│   ├── public/                             # Public static assets
│   ├── package.json                        # Frontend dependencies (React, Leaflet, Recharts, Tailwind v4)
│   └── vite.config.ts                      # Vite build configuration
├── backend/                                # Node.js + Express + TypeScript Backend Server (Port 5000)
│   ├── routes/                             # API Routers (projects, assets, claims, reports, capture, cloudinary)
│   ├── services/                           # Business logic (7-Signal engine, AI Courtroom, CSR audit)
│   ├── data/                               # In-memory mock database & persistence
│   ├── index.ts                            # Express application entry point
│   ├── package.json                        # Backend dependencies (Express, CORS, dotenv, tsx)
│   └── tsconfig.json                       # Backend TypeScript configuration
├── package.json                            # Workspace root script runner
└── README.md
```

---

## 📜 License & Citation

Distributed under the MIT License.
