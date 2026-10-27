# Database Schema Notes

This directory houses the sequential migration files for PostgreSQL.
Table definitions must be agreed with Member 3 before final implementation.

Migration Sequence:
- 001_users: User accounts and authentication credentials
- 002_businesses: Business profiles and operating modes
- 003_business_members: User-business associations and role assignments
- 004_products: Product master catalog
- 005_sales: Sales transaction headers
- 006_sale_items: Sale line items
- 007_stock_movements: Inventory audit and movements
- 008_imports: Billing and product import logs
- 009_activity_log: Activity logs for audit and supervised mode
