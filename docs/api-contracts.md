# API Contracts Specification

> Important: Frontend and backend members must align on these contracts before implementation.

| Module | Method | Endpoint Path | Description | Request Body / Params | Response Format | Owner | Status |
|---|---|---|---|---|---|---|---|
| Auth | POST | `/api/auth/login` | User login | `{ email, password }` | `{ user, token }` | Member 2 | Existing |
| Auth | POST | `/api/auth/register` | User signup | `{ name, email, password }` | `{ user, token }` | Member 2 | Draft |
| Business | POST | `/api/business` | Create business profile | `{ name, type, operatingMode, currency }` | `{ businessId, ... }` | Member 2 | Draft |
| Business | GET | `/api/business/:id` | Get business profile | URL param: `id` | `{ business }` | Member 2 | Draft |
| Onboarding | POST | `/api/onboarding/recommend` | Get upload recommendation | `{ productRange, hasBillingSoftware, ... }` | `{ recommendedMethod, reason }` | Member 4 | Draft |
| Products | GET | `/api/products` | List products | Query: `page, limit, search, category` | `{ products: [], total }` | Member 3 | Draft |
| Products | POST | `/api/products` | Add single product | Product fields | `{ product }` | Member 3 | Draft |
| Products | POST | `/api/products/bulk` | Bulk create products | `{ products: [] }` | `{ createdCount, errors: [] }` | Member 3 | Draft |
| Inventory | GET | `/api/inventory/stock` | Get current stock levels | Query: `status, category` | `{ stock: [] }` | Member 3 | Draft |
| Inventory | POST | `/api/inventory/adjust` | Stock adjustment | `{ productId, quantity, reason }` | `{ movementId, newStock }` | Member 3 | Draft |
| Sales | POST | `/api/sales` | Record manual sale | `{ items: [{ productId, quantity, price }], total }` | `{ saleId, timestamp }` | Member 2 | Draft |
| Imports | POST | `/api/imports/billing-report` | Upload & validate daily report | Multipart file / CSV payload | `{ importId, validRows, duplicates, errors }` | Member 4 | Draft |
| Imports | POST | `/api/imports/confirm/:id` | Confirm and commit import | URL param: `id` | `{ committedRows, status }` | Member 4 | Draft |
| Insights | GET | `/api/insights/sales-trends` | Sales trends by interval | Query: `period=day|week|month` | `{ dataPoints: [] }` | Member 4 | Draft |
| Insights | GET | `/api/insights/top-sellers` | Best selling products | Query: `limit, period` | `{ items: [] }` | Member 4 | Draft |
| Recommendations | POST | `/api/recommendations/restock` | Generate restock plan | `{ budget }` | `{ plan: [], totalEstimatedCost }` | Member 4 | Draft |
| Team | GET | `/api/team/members` | List business employees | Query: `businessId` | `{ members: [] }` | Member 2 | Draft |
| Team | POST | `/api/team/invite` | Invite employee | `{ email, role, permissions }` | `{ inviteId, status }` | Member 2 | Draft |
| Dashboard | GET | `/api/dashboard/summary` | Dashboard KPI summaries | Query: `businessId` | `{ todaySales, profit, lowStockCount, activeProducts }` | Member 3 | Draft |
| Settings | GET | `/api/settings` | Get business settings | Query: `businessId` | `{ settings: {} }` | Member 2 | Draft |
