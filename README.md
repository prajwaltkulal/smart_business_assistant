# Smart Business Assistant

> Solving Sales, Inventory and Decision-Making Problems for Small Businesses

## Project Overview
Smart Business Assistant is a full-stack web application designed to help small business owners manage inventory, understand sales trends, monitor their shop operations remotely, and make explainable, budget-aware purchasing and restocking decisions. It accommodates two shop operating modes (**Owner-Managed** and **Owner-Supervised**) within a single codebase using robust role-based access control.

---

## Tech Stack
- **Frontend**: React (Vite / React 18+), React Router DOM, Context API, Vanilla CSS / Component Styles
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Version Control & Collaboration**: Git & GitHub

---

## 4-Member Team Ownership

| Team Member | Area of Ownership | Assigned Folders & Responsibilities |
|---|---|---|
| **Member 1** | Frontend Core & Onboarding | `frontend/src/pages/business-setup`, `inventory-onboarding`, `products`, `dashboard` |
| **Member 2** | Backend Core & Management | `backend/src/modules/auth`, `business`, `sales`, `team`, `middleware/` |
| **Member 3** | Database & Inventory Services | `database/`, `backend/src/modules/products`, `inventory`, `dashboard` |
| **Member 4** | Imports, Recommendations & QA | `backend/src/modules/imports`, `insights`, `recommendations`, `onboarding`, frontend imports/insights/recommendations, `backend/src/tests/` |

---

## Project Structure Overview

```
MINI_PROJECT/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection and environment loading
│   │   ├── middleware/         # Auth, role check, business access, error handling
│   │   ├── modules/            # Feature-based domain modules (routes, controller, service, repo, validation)
│   │   ├── routes/index.js     # Single router registry mounting all modules
│   │   ├── utils/              # Parsers, helpers, logger
│   │   └── tests/              # Test suites mirroring modules
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Module API clients
│   │   ├── components/         # Common components, layout (Sidebar, Topbar), charts
│   │   ├── context/            # AuthContext, BusinessContext
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Dedicated section pages with components/ subfolder
│   │   ├── routes/AppRoutes.jsx# Central route definitions & route protection
│   │   └── styles/             # Application styles
│   ├── index.html
│   └── package.json
├── database/
│   ├── migrations/             # Numbered SQL migration files (001_users to 009_activity_log)
│   ├── seeds/                  # Dev sample data seeds
│   └── schema-notes.md         # Schema relationships and notes
├── docs/
│   ├── api-contracts.md        # Endpoint specs agreed before implementation
│   ├── database-design.md      # PostgreSQL table schemas and relationships
│   ├── decisions.md            # Architecture and product decisions log
│   └── csv-templates/          # Downloadable CSV import templates
├── CODEOWNERS                  # GitHub code ownership definition
├── CONTRIBUTING.md             # Git workflow & conflict prevention rules
└── README.md                   # This documentation
```

---

## How to Run the Project

### 1. Database (PostgreSQL)
1. Ensure PostgreSQL is installed and running locally.
2. Create a database:
   ```sql
   CREATE DATABASE smart_business_db;
   ```
3. Apply migrations in sequential order from `database/migrations/`.

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend runs by default at `http://localhost:5000`.

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs by default at `http://localhost:5173`.
