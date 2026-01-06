# Admin Dashboard Enterprise Structure

## Module Structure Pattern

Each module follows this standardized structure:

```
module-name/
├── page.tsx              # Main page (orchestration only, ~50-100 lines)
├── constants.ts          # Constants, enums, configuration
├── schemas.ts            # Zod validation schemas
├── hooks/
│   └── useModule.ts      # Data fetching & mutations
└── components/
    ├── ModuleTable.tsx   # Data table component
    ├── ModuleFilters.tsx # Filter/search component
    ├── ModuleFormDialog.tsx # Create/Edit form
    └── ModuleStats.tsx   # Statistics cards (if applicable)
```

## Shared Components

Located in `components/shared/`:
- `Pagination.tsx` - Reusable pagination
- `EmptyState.tsx` - Empty state with icon
- `LoadingState.tsx` - Loading spinner
- `PageHeader.tsx` - Page header with title, description, actions
- `StatsCard.tsx` - Statistics card component

## Completed Modules

✅ Books
✅ Book Categories
✅ Announcements
✅ Events
✅ Prayer Requests

## Remaining Modules

- Sermons
- Devotionals
- Testimonies
- Groups
- Users
- Media (already has structure)
- Financial modules (already have structure)

