# AI Smart Opportunity Matcher 🎯🚀

> **A Production-Quality, Full-Stack Career & Opportunity Recommendation Platform for College Students.**
> Powered by FastAPI, React 19, TypeScript, Tailwind CSS, and Scikit-Learn NLP (TF-IDF + Cosine Similarity + Multi-Criteria Weighted Scoring).

---

## 1. Project Overview

### 1.1 Problem Statement
Undergraduate engineering students frequently miss out on career-defining internships, hackathons, workshops, competitions, and verified certifications. Opportunities are scattered across disparate portals, eligibility criteria are hard to parse manually, and students often lack clarity on how well their current technical skills match opportunity requirements.

### 1.2 Solution
The **AI Smart Opportunity Matcher** solves this by:
1. Building a rich student talent profile (skills, branch, academic year, proficiency level, past projects, interests, and preferred formats).
2. Maintaining a verified catalog of opportunities (internships, hackathons, workshops, competitions, certifications).
3. Analyzing compatibility through a **hybrid AI recommendation engine** that pairs rule-based multi-criteria scoring with **TF-IDF NLP cosine similarity**.
4. Providing **100% transparent, explainable recommendations** ("Why This Matches You" + verified checklist of matched vs. missing skills).
5. Offering **Skill Gap Analysis** that pinpoints exact in-demand technologies to learn next to maximize eligibility.
6. Enabling complete application lifecycle management through an interactive **Kanban Application Pipeline** (`Interested` → `Applied` → `Shortlisted` → `Selected` / `Rejected`).

---

## 2. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          STUDENT & ADMIN CLIENT                        │
│             React 19 + TypeScript + Tailwind CSS + Lucide Icons        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (JWT Bearer Auth)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            FASTAPI BACKEND                             │
│  ├── Auth Routes (/api/auth)          ├── Opportunities (/api/opps)    │
│  ├── Profile Routes (/api/profile)    ├── Recommendations (/api/recs)  │
│  ├── Application Pipeline (/api/apps) ├── Admin Analytics (/api/admin) │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        AI RECOMMENDATION ENGINE      │  │      DATABASE PERSISTENCE     │
│  ├── similarity.py (TF-IDF + Cosine) │  │  ├── SQLite (zero-config def) │
│  ├── scoring.py (5 Weighted Criteria)│  │  ├── PostgreSQL (supported)  │
│  ├── matcher.py (Orchestrator & Gaps)│  │  └── SQLAlchemy ORM Models   │
│  └── explanation.py (Data-Grounded)  │  │      Users, Profiles, Opps,  │
└──────────────────────────────────────┘  │      Saved, Apps, Recs       │
                                          └──────────────────────────────┘
```

---

## 3. AI Matching Methodology

### 3.1 5-Criteria Weighted Scoring Formula
Every student profile is evaluated against active opportunities using the following initial weighting:

$$\text{Rule Score} = 0.40 \times \text{Skill Match} + 0.25 \times \text{Interest Match} + 0.15 \times \text{Branch Match} + 0.10 \times \text{Experience Match} + 0.10 \times \text{Eligibility Match}$$

| Dimension | Weight | Evaluation Logic |
| :--- | :---: | :--- |
| **Skill Match** | **40%** | Overlap between student skills and opportunity requirements. Required skills carry 85% of score weight, preferred skills carry 15% bonus. |
| **Interest Match** | **25%** | Semantic correlation between student interest tags (e.g. AI, Web Dev) and opportunity domain / preferred types. |
| **Branch Match** | **15%** | 100% for direct match or "All". 60% partial credit for related disciplines (e.g., CSE ↔ IT ↔ AIML). |
| **Experience Match** | **10%** | Evaluates student proficiency (Beginner, Intermediate, Advanced) against role demands. |
| **Eligibility Match** | **10%** | Validates student academic year against minimum and maximum year thresholds. |

### 3.2 Natural Language Processing (TF-IDF + Cosine Similarity)
Beyond keyword matching, student project descriptions, past experience, and skills are aggregated into a student document. The opportunity description, requirements, and tags form the target document. A **Scikit-Learn `TfidfVectorizer`** with n-grams (1, 2) and sublinear term frequency scaling computes semantic cosine similarity:

$$\text{Final Composite Score} = 0.85 \times \text{Rule Score} + 0.15 \times (\text{Cosine Similarity} \times 100)$$

The final result is clamped between $0.0$ and $100.0$ and presented as a clean percentage (e.g., **94% Match**).

---

## 4. Key Pages & Features

### 4.1 Public Pages
1. **Landing Page**: Modern hero section ("Find Opportunities Made for You"), architecture flow diagram, feature cards, live showcase cards.
2. **About Page**: Mission, mathematical breakdown of matching algorithms, technical architecture.
3. **Login Page**: Clean JWT authentication with **1-Click Demo Fill Buttons** for evaluators.
4. **Register Page**: Student account creation with Branch (CSE, IT, AIML, etc.) and Academic Year selection.

### 4.2 Student Experience
5. **Student Dashboard**: Welcome banner, 4 telemetry summary cards, top matches ranked feed, skill gap alerts.
6. **Student Profile**: Complete profile management (multi-skill chip selector, interests, experience, project portfolio manager).
7. **Recommended Opportunities**: High-to-low ranked feed with filter by minimum match score (90%+, 80%+, 70%+), format, and mode.
8. **All Opportunities**: Multi-facet search by keyword, organization, branch, mode, and deadline sorting.
9. **Opportunity Details**: Full modal with personalized match score, score breakdown progress bars, **"Why This Matches You"** reasons, and **"Your Skill Match"** checklist (`✓` / `✗`).
10. **Saved Opportunities**: Bookmarked opportunities with countdown timer and quick apply.
11. **Application Tracker (Kanban)**: Interactive pipeline across `Interested` → `Applied` → `Shortlisted` → `Selected` / `Rejected` with personal notes.
12. **Skill Gap Analysis**: Compares student's skills against current market demand across top recommendations, providing impact statements (e.g., *"Learning TensorFlow may increase your eligibility for 4 AI/ML opportunities"*).
13. **Settings**: Account overview, notification thresholds, and AI engine specifications.

### 4.3 Administrator Experience
14. **Admin Dashboard**: Real-time metrics, popular skills bar chart, opportunities by format, recent applications table.
15. **Manage Opportunities**: Full CRUD table (Add with validation, Edit, Delete, Search, Filter).
16. **Student Management**: Directory of registered students, branch, year, college, verified skills count, and application counts.
17. **Admin Analytics**: Deep matching score distribution curve, skill demand vs. supply coverage matrix, conversion rates.

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons, Axios
- **Backend**: Python 3.12, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2
- **AI / NLP**: Scikit-Learn (TF-IDF Vectorizer, Cosine Similarity), NumPy
- **Authentication**: JWT (JSON Web Tokens) with HS256, Bcrypt password hashing
- **Database**: SQLite (default zero-configuration out-of-the-box) or PostgreSQL (configured via `DATABASE_URL`)
- **Testing**: Pytest automated test suite (13/13 passing tests)

---

## 6. Demo Credentials

For demonstration and evaluation purposes, two pre-configured accounts are seeded automatically on startup:

| Role | Email | Password | Pre-seeded Context |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@demo.com` | `Student@123` | Pre-filled CSE 3rd Year profile, skills in Python, SQL, React, ML, Git, past projects, active recommendations & applications |
| **Demo Admin** | `admin@demo.com` | `Admin@123` | Full access to Admin Dashboard, Opportunity Management, Student Directory, and Analytics |

> *Note: 1-Click quick fill buttons are available directly on the Login page.*

---

## 7. How to Run Locally

### 7.1 Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ (Node.js 20+ recommended)

### 7.2 Running the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

- Backend API: `http://localhost:8000`
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- ReDoc API Documentation: `http://localhost:8000/redoc`

### 7.3 Running the Frontend

```bash
# Navigate to frontend directory in another terminal
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```

- Frontend Web Application: `http://localhost:5173`

---

## 8. Automated Testing

The backend includes a comprehensive automated test suite verifying AI scoring weights, NLP cosine similarity, explanation generation, skill gap analysis, and REST API endpoints.

```bash
cd backend
python -m pytest -v
```

**Results:**
- `test_skill_match_perfect`: PASSED
- `test_skill_match_partial`: PASSED
- `test_branch_match`: PASSED
- `test_experience_and_eligibility`: PASSED
- `test_nlp_similarity`: PASSED
- `test_weighted_scoring_range`: PASSED
- `test_opportunity_matcher_full`: PASSED
- `test_skill_gap_analysis`: PASSED
- `test_health`: PASSED
- `test_demo_student_login`: PASSED
- `test_demo_admin_login`: PASSED
- `test_get_opportunities_public`: PASSED
- `test_student_recommendations_and_gap`: PASSED
- **Total: 13 / 13 passed**

---

## 9. Future Enhancements

1. **Large Language Model (LLM) Integration**: Connecting LangChain or Google Gemini API for natural language conversational career coaching.
2. **Verified Opportunity Web Crawler**: Scheduled ingestion pipelines from approved campus placement feeds and official hackathon APIs.
3. **Automated Resume Parsing**: Extracting student skills, coursework, and projects directly from uploaded PDF resumes.
4. **Push & WhatsApp Notification Webhooks**: Instant alerts when a 95%+ opportunity is published.

---

## 10. License & Credits

Built for academic demonstration and career opportunity enhancement.
Presented as a B.Tech IT Major / IEEE Project.
All rights reserved © 2026.
