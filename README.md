# 🚀 FundTracker - Mutual Funds Tracker

A modern, full-stack SaaS application for tracking mutual funds with real-time NAV data from AMFI India.

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with NextAuth.js v5
- 🔍 **Smart Search** - Amazon-style autocomplete search with real-time suggestions
- ⭐ **Favorites** - Save and manage your favorite mutual funds
- 📊 **Real-time Data** - Always up-to-date NAV data from AMFI India
- 📜 **Search History** - Track and revisit your previous searches
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and shadcn/ui
- 🌙 **Dark Mode Support** - Seamless light and dark mode experience
- 🔔 **Toast Notifications** - Real-time feedback on user actions

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Server Components and Server Actions
- **TypeScript** - Type safety throughout
- **Tailwind CSS v4** - Modern utility-first CSS
- **shadcn/ui** - Beautiful, accessible components
- **Lucide Icons** - Modern icon library

### Backend
- **PostgreSQL** - Neon serverless database
- **Drizzle ORM** - Type-safe database queries
- **NextAuth.js v5** - Authentication and session management
- **bcrypt** - Secure password hashing

### Deployment
- **Vercel** - Serverless deployment with Edge Runtime
- **Bun** - Fast JavaScript runtime

## 📋 Prerequisites

- Bun >= 1.0
- PostgreSQL database (Neon recommended)
- Node.js >= 18 (for compatibility)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
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
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── autocomplete/  # Search autocomplete
│   │   │   ├── favorites/     # Favorites management
│   │   │   ├── history/       # Search history
│   │   │   └── search/        # Fund search
│   │   ├── dashboard/         # Dashboard page
│   │   ├── favorites/         # Favorites page
│   │   ├── history/           # Search history page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── login-form.tsx    # Login form with validation
│   │   ├── signup-form.tsx   # Signup form with validation
│   │   ├── search-with-autocomplete.tsx
│   │   └── toast-provider.tsx
│   └── lib/                   # Utility functions
│       ├── db/               # Database configuration
│       │   ├── index.ts      # Database client
│       │   └── schema.ts     # Drizzle schema
│       ├── actions.ts        # Server actions
│       ├── amfi.ts          # AMFI data fetching
│       ├── auth.ts          # NextAuth configuration
│       └── utils.ts         # Helper functions
├── drizzle/                  # Database migrations
├── public/                   # Static assets
├── .env.local               # Environment variables
├── drizzle.config.ts        # Drizzle configuration
├── next.config.ts           # Next.js configuration
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

### Smart Autocomplete
Type at least 2 characters to see real-time suggestions from thousands of mutual funds. Searches across fund names and AMC names.

### Favorites Management
Save your favorite funds with one click. Access them quickly from the favorites page.

### Search History
Automatically tracks all your searches. Revisit previous searches with a single click.

### Password Visibility Toggle
Enhanced UX with password visibility toggle on login and signup forms.

### Toast Notifications
Get instant feedback when adding/removing favorites or encountering errors.

## 📊 API Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /login` - Login page
- `GET /signup` - Signup page

### Protected Routes (Requires Authentication)
- `GET /dashboard` - Main dashboard with search
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
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_SECRET` - Random secret for JWT
- `NEXTAUTH_URL` - Your production URL (e.g., https://yourapp.vercel.app)

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
- Advanced charts and analytics
- Email notifications for NAV updates
- Portfolio tracking
- Comparison tools
- Export to Excel/PDF

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

---

Built with ❤️ using Next.js and Bun
