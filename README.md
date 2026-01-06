# Church Admin Dashboard

A comprehensive, production-ready admin dashboard for church management built with Next.js 14+, TanStack Query, Zustand, and modern UI components.

## Features

- 🔐 **Authentication** - Secure JWT-based authentication with auto token refresh
- 📊 **Dashboard** - Real-time statistics and analytics overview
- 👥 **User Management** - Complete user CRUD operations with role management
- 📱 **Responsive Design** - Mobile-first approach with collapsible sidebar
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🔄 **State Management** - Zustand for client state, TanStack Query for server state
- ⚡ **Performance** - Optimized with code splitting and lazy loading
- 🛡️ **Type Safety** - Full TypeScript support with Zod validation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Charts**: Recharts (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000/api/v1`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Church Admin Dashboard
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
admin/
├── app/
│   ├── (auth)/          # Authentication routes
│   │   └── login/
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── layout.tsx    # Dashboard layout with sidebar
│   │   ├── page.tsx     # Dashboard home
│   │   ├── users/        # User management
│   │   ├── analytics/   # Analytics page
│   │   └── settings/     # Settings page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── dashboard/       # Dashboard-specific components
│   └── providers/       # Context providers
├── lib/
│   ├── api/             # API client and services
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   └── utils/           # Utility functions
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Authentication

The dashboard uses JWT-based authentication. Tokens are stored in localStorage and automatically refreshed when expired.

### Login

Navigate to `/login` and enter your admin credentials.

### Protected Routes

All routes under `(dashboard)` are protected and require authentication. Unauthenticated users are automatically redirected to the login page.

## API Integration

The dashboard integrates with the NestJS backend API. All API calls are made through the centralized API client in `lib/api/client.ts` which handles:

- Automatic token injection
- Token refresh on 401 errors
- Error handling
- Request/response interceptors

## Features Overview

### Dashboard
- Overview statistics cards
- Recent activity feed
- Quick access to key metrics

### User Management
- List all users with pagination
- Search and filter users
- View user details
- Update user roles
- Toggle user active/inactive status

### Analytics
- User analytics with date range filtering
- Revenue analytics
- Content analytics
- Community analytics

## Development

### Adding New Pages

1. Create a new page in `app/(dashboard)/your-page/page.tsx`
2. Add a menu item in `components/layout/Sidebar.tsx`
3. Create API service functions in `lib/api/services/`
4. Add TypeScript types in `types/api/`

### Adding New Components

1. Create component in appropriate folder under `components/`
2. Use shadcn/ui components from `components/ui/`
3. Follow existing patterns for styling and structure

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_APP_NAME` - Application name

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Follow React best practices
4. Write clean, maintainable code
5. Add proper error handling

## License

Private - Church Management System
