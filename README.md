# 🚀 FundTracker - Advanced Mutual Funds Tracker

A modern, full-stack SaaS application for tracking mutual funds with real-time NAV data from AMFI India featuring advanced analytics, export capabilities, and professional-grade UX.

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - NextAuth.js v5 with email/password and session management
- 🔍 **Smart Autocomplete Search** - Amazon-style search with real-time suggestions
- ⭐ **Favorites Management** - Save and manage your favorite mutual funds
- 📜 **Search History Tracking** - Automatic tracking and quick re-search functionality
- 📊 **Real-time Data** - Always up-to-date NAV data from AMFI India

### Advanced Features
- 📈 **Dashboard Statistics** - Live metrics showing favorites count, searches today, and available funds
- 🔬 **Fund Details Modal** - Comprehensive fund information with NAV, ISIN codes, and quick actions
- 💾 **CSV Export** - Download favorites, search history, and search results to Excel/CSV
- ⌨️ **Keyboard Shortcuts** - Power user features (`Ctrl+K` to focus search, `ESC` to clear)
- 🎨 **Loading Skeletons** - Professional loading states for better UX
- ❌ **Custom Error Pages** - Beautiful 404 and error boundary pages
- 🔔 **Toast Notifications** - Real-time feedback on all user actions

### Design & UX
- 🌙 **Dark Mode Support** - Seamless light and dark mode experience
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎯 **Quick Actions** - One-click access to favorites, history, and exports
- ⚡ **Fast Performance** - Server components, edge runtime, and optimized queries

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Server Components
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety throughout
- **Tailwind CSS v4** - Modern utility-first CSS
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide Icons** - Modern icon library

### Backend & Database
- **PostgreSQL** - Neon serverless database
- **Drizzle ORM** - Type-safe database queries with migrations
- **NextAuth.js v5** - Authentication and session management with proxy pattern
- **bcrypt** - Secure password hashing

### Data & Export
- **PapaParser** - CSV generation and export
- **AMFI India API** - Real-time mutual funds data

### Deployment
- **Vercel** - Serverless deployment with Edge Runtime
- **Bun** - Fast JavaScript runtime for development

## 📋 Prerequisites

- Bun >= 1.0 (or Node.js >= 18)
- PostgreSQL database (Neon recommended)
- Modern browser with JavaScript enabled

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/testing-archit/mutual-funds-nav.git
cd mutual-funds-nav
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Auth (generate a random secret)
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional
NODE_ENV="development"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Run database migrations

```bash
bun run drizzle-kit generate
bun run drizzle-kit push
```

### 5. Start the development server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
mutual-funds-nav/
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── autocomplete/      # Search autocomplete
│   │   │   ├── favorites/         # Favorites management
│   │   │   ├── history/           # Search history
│   │   │   └── search/            # Fund search
│   │   ├── dashboard/             # Dashboard page
│   │   ├── favorites/             # Favorites page
│   │   ├── history/               # Search history page
│   │   ├── login/                 # Login page
│   │   ├── signup/                # Signup page
│   │   ├── error.tsx              # Global error boundary
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── dashboard-stats.tsx    # Dashboard statistics
│   │   ├── fund-details-modal.tsx # Fund details modal
│   │   ├── favorites-list.tsx     # Favorites with export
│   │   ├── search-history-list.tsx # History with export
│   │   ├── loading-skeletons.tsx  # Loading states
│   │   ├── keyboard-shortcuts.tsx # Keyboard handler
│   │   ├── login-form.tsx         # Login form with validation
│   │   ├── signup-form.tsx        # Signup form with validation
│   │   ├── search-with-autocomplete.tsx
│   │   └── toast-provider.tsx     # Toast notifications
│   ├── lib/                       # Utility functions
│   │   ├── db/                    # Database configuration
│   │   │   ├── index.ts           # Database client
│   │   │   └── schema.ts          # Drizzle schema
│   │   ├── actions.ts             # Server actions
│   │   ├── amfi.ts                # AMFI data fetching & caching
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── export.ts              # CSV export utilities
│   │   └── utils.ts               # Helper functions
│   └── proxy.ts                   # Next.js 16 proxy (auth middleware)
├── drizzle/                       # Database migrations
├── public/                        # Static assets
├── .env.local                     # Environment variables
├── drizzle.config.ts              # Drizzle configuration
├── next.config.ts                 # Next.js configuration
├── package.json
└── tsconfig.json
```

## 🗄️ Database Schema

### Tables

#### users
- `id` - UUID (Primary Key)
- `email` - Unique email address
- `password_hash` - Hashed password
- `name` - User's name
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### favorites
- `id` - UUID (Primary Key)
- `user_id` - Foreign Key to users
- `fund_serial_number` - Fund identifier
- `fund_name` - Fund scheme name
- `fund_house` - AMC name
- `added_at` - Timestamp

#### search_history
- `id` - UUID (Primary Key)
- `user_id` - Foreign Key to users
- `search_term` - Search query
- `searched_at` - Timestamp

## 🎯 Key Features Explained

### Dashboard Statistics
Real-time metrics displayed at the top of your dashboard:
- Total favorites count
- Searches performed today
- Total available funds from AMFI
- Market status indicator

### Fund Details Modal
Click "View Details" on any fund to see:
- Current NAV with date
- Full fund information
- ISIN codes (Payout & Reinvestment)
- One-click favorite toggle
- Copy scheme code to clipboard
- Search online functionality

### CSV Export
Export your data for external analysis:
- **Search Results**: Export current search results
- **Favorites**: Download all saved funds
- **Search History**: Export your search queries

All exports include timestamps and are formatted for Excel/Numbers.

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Focus search input
- `ESC` - Clear search or close modals

### Loading States
Professional skeleton loaders on:
- Dashboard stats
- Search results
- Page transitions

## 📊 API Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /login` - Login page
- `GET /signup` - Signup page

### Protected Routes (Requires Authentication)
- `GET /dashboard` - Main dashboard with stats
- `GET /favorites` - User's saved funds
- `GET /history` - Search history
- `GET /api/search?q={query}` - Search funds
- `GET /api/autocomplete?q={query}` - Get suggestions
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites?serial={number}` - Remove from favorites
- `GET /api/history` - Get search history
- `POST /api/history` - Track search

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your production database URL
   - `NEXTAUTH_SECRET` - Random secret for JWT
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://yourapp.vercel.app`)
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🔧 Development Commands

```bash
# Development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint code
bun run lint

# Generate Drizzle migrations
bun run drizzle-kit generate

# Push migrations to database
bun run drizzle-kit push

# Open Drizzle Studio (database GUI)
bun run drizzle-kit studio
```

## 🎨 Customization

### Changing Colors
Edit `src/app/globals.css` to customize the color scheme using CSS variables.

### Adding More Features
Potential enhancements:
- Advanced charts and NAV trends
- Email notifications for updates
- Portfolio tracking with investment amounts
- Fund comparison tools
- SIP calculator
- Export to PDF

## 📈 Performance

- **Build Time**: ~3-4 seconds
- **Page Load**: Instant with Server Components
- **AMFI Data Cache**: 5 minutes TTL
- **Database Queries**: Optimized with proper indexes
- **Production Build**: Passes with no errors

## 📝 Version History

### v2.0.1 - Proxy Migration (Latest)
- 🔄 Migrated from `middleware.ts` to `proxy.ts` for Next.js 16 compatibility
- ✅ Resolved deprecation warnings
- 🎯 No functional changes, all features remain the same

### v2.0.0 - Major Feature Update
- ✨ Dashboard statistics with live metrics
- 🔬 Fund details modal with comprehensive information
- 💾 CSV export for all data (search, favorites, history)
- ⌨️ Keyboard shortcuts for power users
- 🎨 Loading skeletons for better UX
- ❌ Custom 404 and error pages
- 🚀 Enhanced dashboard with quick actions
- 📊 Improved search results with view details
- 🎯 One-click export functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, open an issue on [GitHub](https://github.com/testing-archit/mutual-funds-nav/issues).

## 📄 License

MIT

---

**Built with ❤️ using Next.js 16, TypeScript, and Bun**

**Production Ready** ✅ | **Build Status** ✅ Passing | **TypeScript** ✅ No Errors
