# vite_react_shadcn_ts

## Overview

Production-ready React application scaffolded with Vite, TypeScript, and shadcn/ui. Implements modern UI/UX patterns, PWA support, RTL (Hebrew) layout, and integrates with Supabase and Lovable Auth. Designed for extensibility and performance.

## Tech Stack

- React 18 (with Suspense, StrictMode)
- Vite 5
- TypeScript
- Tailwind CSS (with custom design tokens)
- shadcn/ui (Radix UI primitives)
- Supabase (database & auth)
- @lovable.dev/cloud-auth-js (OAuth)
- React Router v6
- TanStack React Query
- Framer Motion
- PWA via vite-plugin-pwa
- Web Vitals reporting
- RTL support

## Key Features

- **PWA**: Offline support, installable, auto-updating service worker, custom manifest (RTL, Hebrew).
- **Auth**: Supabase and Lovable OAuth integration, with robust OAuth callback handling.
- **Theming**: Dynamic theme provider, dark/light modes, custom color system.
- **RTL**: Full right-to-left layout support; not limited to Hebrew.
- **Performance**: Web Vitals analytics, performance mode detection (reduced motion, save-data, low battery).
- **UI/UX**:
  - Accessible skip-to-content
  - Animated page transitions
  - Skeleton loading states
  - Floating CTA, scroll progress, back-to-top
  - Responsive, mobile-first design
  - Haptic feedback utilities
- **State/Data**:
  - React Query for async state
  - Supabase typed client for DB access
- **Error Handling**: Global error boundary
- **Dev Experience**:
  - ESLint, TypeScript strict mode
  - Component tagger for Lovable in dev
  - Hot reload, code splitting via React.lazy/Suspense

## Architecture

- **Entry**: `src/main.tsx` mounts `<App />` and initializes web vitals.
- **App Shell**: Providers for theme, language, query, error boundary, and routing.
- **Routing**: React Router, code-split routes (`/`, fallback 404 with OAuth handling).
- **State**: Contexts for theme and language; React Query for server state.
- **Integrations**: Supabase client (`src/integrations/supabase`), Lovable Auth.
- **UI Layer**: shadcn/ui, Radix primitives, Tailwind CSS, custom components.
- **PWA**: Service worker, manifest, runtime caching, navigation fallback denylist for OAuth.

## Development

- **Start Dev Server**:  
  ```sh
  npm run dev
  ```
- **Lint**:  
  ```sh
  npm run lint
  ```
- **Type Checking**:  
  TypeScript runs automatically; strict mode enforced.

- **Directory Aliases**:  
  Use `@/` for `src/` imports.

- **Component Tagging**:  
  Lovable component tagger enabled in development mode only.

## Build & Deployment

- **Build**:  
  ```sh
  npm run build
  ```
- **Preview**:  
  ```sh
  npm run preview
  ```
- **PWA**:  
  Service worker auto-registers in production.  
  In development, all service workers are unregistered to avoid conflicts.

- **Environment Variables**:  
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Notes

- **RTL**: Manifest and layout support RTL; not restricted to Hebrew.
- **OAuth**: 404 route detects OAuth callbacks and waits for session before redirecting.
- **Performance Mode**: Components can use `usePerformanceMode` to disable expensive effects for low-power users.
- **Web Vitals**: Metrics sent to Google Analytics if `gtag` is present; logs in dev.
- **Haptics**: Utility functions for triggering device vibration (no-op on unsupported devices).
- **Custom Design Tokens**: Extensive color and gradient system in Tailwind config.
- **No server-side rendering**: Pure SPA.

---

For further details, see code comments and individual module documentation.