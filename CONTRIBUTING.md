# Git Workflow & Collaboration Guidelines

To avoid merge conflicts and keep our 4-person team working smoothly, follow these strict rules:

## 1. Branching Strategy
- **Never commit directly to `main`.**
- Always create a feature branch off the latest `main`:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/<module>-<short-description>
  ```
- Examples:
  - `feature/business-setup-screen1`
  - `feature/csv-billing-parser`
  - `feature/inventory-reconciliation-api`

## 2. Respect Folder Ownership
- Work strictly inside your assigned folders (check `CODEOWNERS` or `README.md`).
- If you need changes in another teammate's module, communicate first. Do not edit another member's files directly without alignment.

## 3. Central Integration Points (Shared Files)
Shared files exist to wire up modules into one place:
- **Backend Router**: `backend/src/routes/index.js`
- **Frontend Routes**: `frontend/src/routes/AppRoutes.jsx`
- **Frontend Navigation**: `frontend/src/components/layout/Sidebar.jsx`

**Rule**: Shared files must only be edited to add a single line connecting your module/page. Keep those commits minimal and merge PRs quickly.

## 4. API Contracts First
- Before writing frontend and backend endpoints, agree on the endpoint specification in `docs/api-contracts.md`.
- Both frontend and backend team members must adhere strictly to the agreed request and response contracts.

## 5. Sequential Database Migrations
- **Never edit an existing migration file** once it has been pushed or merged.
- Always add a new numbered migration file in `database/migrations/` (e.g., `010_add_lead_time_to_products.sql`).

## 6. Daily Pull & Rebase
- Run `git pull --rebase origin main` before starting work each day and before opening a pull request.
- Keep PRs small, focused, and reviewable by at least one teammate.
