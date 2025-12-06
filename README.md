# SCI DIALALI - Real Estate Management Platform

## Overview

As a software engineer, I built this full-stack web application to deepen my understanding of modern authentication systems, API integration, and state management in Next.js. The project focuses on implementing secure user authentication with Firebase, integrating a FastAPI backend, and creating a seamless user experience with server-side rendering and client-side interactivity.

SCI DIALALI is a real estate management platform that allows users to manage properties, users, and related data through a secure dashboard. The application features role-based access control, JWT authentication, and real-time data synchronization with a FastAPI backend.

### Getting Started

**Prerequisites:**

- Node.js 18+ and pnpm installed
- Firebase project configured
- FastAPI backend running (optional for full functionality)

**Installation & Setup:**

1. Clone the repository

```bash
git clone <your-repo-url>
cd scidialali-web
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment variables
   Create a `.env.local` file at the root:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server

```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Purpose

This project was developed to:

- Master Next.js 14+ App Router architecture and server components
- Implement secure authentication patterns with NextAuth.js and Firebase
- Practice API integration between a Next.js frontend and FastAPI backend
- Explore advanced TypeScript type systems and module augmentation
- Build reusable components following modern React patterns
- Understand JWT token management and session handling
- Implement middleware-based route protection

[Software Demo Video](https://youtu.be/BmVMEuQ4QXg)

## Web Pages

### 1. Login Page (`/login`)

The entry point of the application featuring a clean authentication form. Users enter their email and password credentials which are validated through Firebase Authentication. On successful login, users receive a JWT token and are redirected to the dashboard. The page includes:

- Real-time form validation
- Error messaging for invalid credentials
- Loading states during authentication
- Automatic redirection for already-authenticated users

### 2. Dashboard Home (`/dashboard`)

The main landing page after authentication, displaying an overview of the user's account and quick access to key features. This page dynamically loads:

- User profile information from the session
- Welcome message with personalized greeting
- Navigation links to all major sections
- Role-based content (admin users see additional options)

### 3. Users Management (`/dashboard/users`)

A comprehensive user management interface accessible to administrators. Features include:

- Dynamic table displaying all registered users
- Real-time data fetching from the FastAPI backend
- User role indicators (admin, user, etc.)
- Delete functionality with confirmation dialogs
- Edit user capabilities (future enhancement)
- Server-side pagination for large datasets

### 4. Estates/Properties Management (`/dashboard/estates`)

Property listing and management page where users can:

- View all properties in the database
- Add new property listings
- Edit existing property details
- Delete properties with proper authorization
- Filter and search through properties
- View property details including images, descriptions, and pricing

### Navigation Flow

The application uses Next.js App Router with client-side navigation for smooth transitions:

- Unauthenticated users accessing protected routes → Redirected to `/login`
- Successful login → Redirected to `/dashboard` (or `callbackUrl` if specified)
- Authenticated users accessing `/login` → Automatically redirected to `/dashboard`
- Sidebar navigation provides instant transitions between dashboard sections
- Logout action → Clears session and redirects to `/login`

All pages implement dynamic content loading using:

- Server Components for initial data fetching (SEO-friendly)
- Client Components for interactive elements (forms, buttons, modals)
- Server Actions for data mutations (create, update, delete)
- Optimistic UI updates for better user experience

## Development Environment

### Tools & Technologies

**Frontend Framework:**

- Next.js 16.0.3 (App Router)
- React 19
- TypeScript 5.x

**Authentication & Authorization:**

- NextAuth.js 4.x
- Firebase Authentication 10.x
- Firebase Admin SDK (for backend token verification)

**Styling:**

- Tailwind CSS 3.x
- Heroicons for icons
- Custom Tailwind configuration with theme extensions

**Development Tools:**

- pnpm (package manager)
- ESLint (code linting)
- VS Code (IDE)
- Git for version control

**Backend Integration:**

- FastAPI (Python)
- Firebase Admin SDK (Python)

### Programming Languages & Libraries

**TypeScript/JavaScript:**

- **Next.js** - React framework with server-side rendering and App Router
- **NextAuth.js** - Authentication solution with JWT strategy
- **Firebase** (`firebase@10.x`) - Client SDK for authentication
- **React Hooks** - useState, useEffect, useSession for state management
- **next/navigation** - useRouter, useSearchParams for routing

**Key Libraries:**

- `@heroicons/react` - Icon components
- `tailwindcss` - Utility-first CSS framework
- `typescript` - Type safety and developer experience

**Python (Backend):**

- `fastapi` - Modern API framework
- `firebase-admin` - Server-side Firebase integration
- `uvicorn` - ASGI server

**Architecture Patterns:**

- Server Components for data fetching
- Client Components for interactivity
- Server Actions for mutations
- Middleware for route protection
- Module augmentation for type extensions
- Separation of concerns (lib/actions.ts, lib/auth.ts)

## Useful Websites

- [Next.js Documentation](https://nextjs.org/docs) - Comprehensive guide for Next.js 14+ App Router
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication implementation patterns
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth) - Firebase Auth setup and usage
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styling utilities and components
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript best practices
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Backend API development
- [React Documentation](https://react.dev/) - React 18+ features and hooks
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards and JavaScript references
- [Stack Overflow](https://stackoverflow.com/) - Community support and troubleshooting

## Future Work

**Authentication & Security:**

- Implement refresh token mechanism for automatic token renewal
- Add OAuth providers (Google, GitHub) for social login
- Implement two-factor authentication (2FA)
- Add password reset functionality via email
- Implement rate limiting to prevent brute-force attacks

**User Management:**

- Add user profile editing capabilities
- Implement user avatar upload and management
- Create role management system for granular permissions
- Add user activity logs and audit trails
- Implement user invitation system via email

**Property/Estate Features:**

- Add image upload functionality for properties
- Implement advanced search and filtering (price range, location, type)
- Create property detail pages with galleries
- Add favorites/bookmarks functionality
- Implement property comparison feature
- Add map integration for property locations

**UI/UX Improvements:**

- Implement dark mode toggle
- Add loading skeletons for better perceived performance
- Create responsive mobile navigation
- Add toast notifications for user actions
- Implement drag-and-drop for file uploads
- Add data export functionality (CSV, PDF)

**Performance & Optimization:**

- Implement image optimization with Next.js Image component
- Add caching strategies for API responses
- Implement infinite scroll for large datasets
- Add service worker for offline capabilities
- Optimize bundle size with code splitting

**Testing & Quality:**

- Add unit tests with Jest and React Testing Library
- Implement E2E tests with Playwright
- Add API integration tests
- Set up CI/CD pipeline with GitHub Actions
- Implement error tracking with Sentry

**Backend Integration:**

- Add real-time updates with WebSockets
- Implement file storage with Firebase Storage
- Add email notifications for important events
- Create comprehensive API documentation
- Implement data backup and recovery system
