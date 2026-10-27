# Open Decisions & Architecture Log

The following decisions have been agreed upon or are slated for resolution during upcoming team meetings:

### 1. Business Category Focus in V1
- **Status**: Open
- **Options**:
  - Focus primarily on Grocery Stores for V1 with customized units (kg, packet, litre).
  - Support all general categories (Clothing, Electronics, Pharmacy, Other) from Day 1.
- **Recommendation**: Ensure database schema is generic while initial onboarding forms feature grocery store presets.

### 2. Primary Billing Report File Format
- **Status**: Agreed
- **Decision**: Standard CSV format will be prioritized first. Excel (.xlsx) support will follow once the core CSV ingestion pipeline is verified.

### 3. Sales Entry vs. Billing Report Priority
- **Status**: Agreed
- **Decision**: Manual sales entry will be supported for test runs and shops without existing billing systems. The billing-report CSV importer is the primary path for established shops.

### 4. Owner Approval Workflow Scope
- **Status**: Postponed for initial foundation phase
- **Decision**: Phase 1 implements basic role-based access control. Approval workflows for high-value stock adjustments will be introduced in Phase 5.

### 5. Purchase and Expense Tracking
- **Status**: Phase 2 priority
- **Decision**: Basic stock purchases and unit costs will be tracked. Full-scale operational expense accounting is deferred.
