# Redeem Oneness — Full Next.js Web App

A complete faith-community job & mentorship platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

## 🔧 Backend Setup (Supabase)

This app uses **Supabase** as the backend for database, authentication, and real-time features.

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project.
- Note your project URL and anon key from the dashboard.

### 2. Configure Environment Variables
- Copy `.env.local` and update the placeholders:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  ```

### 3. Set up Database Schema
- Use the Supabase dashboard to create tables for users, jobs, applications, messages, etc.
- Enable Row Level Security (RLS) and create policies as needed.

---

## 📁 Project Structure

```
redeem-oneness/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── signup/page.tsx             # Member signup
│   ├── mentor-register/page.tsx    # Mentor registration
│   ├── business-register/page.tsx  # Business registration
│   ├── church-register/page.tsx    # Church branch registration
│   │
│   ├── member/                     # Member dashboard (10 screens)
│   │   ├── page.tsx                # Home feed
│   │   ├── jobs/page.tsx           # Job feed
│   │   ├── jobs/[id]/page.tsx      # Job details
│   │   ├── applications/page.tsx   # My applications
│   │   ├── mentorship/page.tsx     # Find mentors
│   │   ├── mentorship/[id]/page.tsx# Mentor profile
│   │   ├── messages/page.tsx       # Chat inbox
│   │   ├── notifications/page.tsx  # Notifications
│   │   ├── profile/page.tsx        # Profile
│   │   └── profile/edit/page.tsx   # Edit profile
│   │
│   ├── business/                   # Business dashboard (7 screens)
│   │   ├── page.tsx                # Dashboard home
│   │   ├── post-job/page.tsx       # Post a job
│   │   ├── search-members/         # Search + member profile view
│   │   ├── applications/page.tsx   # Manage applications
│   │   ├── messages/page.tsx       # Messages
│   │   └── profile/page.tsx        # Company profile
│   │
│   ├── mentor/                     # Mentor dashboard (5 screens)
│   │   ├── page.tsx                # Dashboard home
│   │   ├── requests/page.tsx       # Mentorship requests
│   │   ├── messages/page.tsx       # Messages
│   │   ├── announcements/page.tsx  # Post announcements
│   │   └── profile/page.tsx        # Edit profile
│   │
│   └── admin/                      # Branch admin dashboard (7 screens)
│       ├── page.tsx                # Dashboard home
│       ├── members/page.tsx        # Members list
│       ├── members/[id]/page.tsx   # Member details
│       ├── announcements/page.tsx  # Send announcements
│       ├── search/page.tsx         # Search across branches
│       ├── admins/page.tsx         # Admin management
│       └── settings/page.tsx       # Branch settings + QR
│
├── components/
│   ├── layout/DashLayout.tsx       # Shared sidebar layout
│   └── ui/index.tsx                # All shared UI components
│
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🎨 Design System

| Token       | Value       |
|-------------|-------------|
| `deep-brown`| `#1C1208`   |
| `amber`     | `#C4832A`   |
| `gold`      | `#E2A94B`   |
| `sage`      | `#6B7E5A`   |
| `terra`     | `#B85C38`   |
| `cream`     | `#F7F2EA`   |

**Fonts:** Cormorant Garamond (headings) + DM Sans (body)

---

## 📦 Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **Supabase** (Backend as a Service)
- **Lucide React** (icons)
- **clsx** (conditional classnames)

---

## 🔐 Portal Access (Dev)

All dashboards are currently open for prototyping. Navigate directly to:

| Portal       | URL              |
|--------------|------------------|
| Member       | `/member`        |
| Business     | `/business`      |
| Mentor       | `/mentor`        |
| Branch Admin | `/admin`         |

Or go through `/login` which has quick-access buttons for each role.

---

## 📝 Next Steps for Production

1. Implement authentication with Supabase Auth
2. Set up database tables and RLS policies in Supabase
3. Implement real **job application** and **messaging** logic
4. Add **QR code generation** (e.g. `qrcode` npm package)
5. Set up **file uploads** for profile photos and portfolios
6. Add **push notifications** via service workers or a provider like **OneSignal**
