```markdown
# מזון האושר (mazonhaosher.co.il)

A modern, RTL-first, Hebrew-language bakery website for "מזון האושר" (Mazon HaOsher), specializing in handmade crumble cookies. The site is a fast, mobile-friendly, installable Progressive Web App (PWA) built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

---

## What This Project Does

- **Landing page** for a bakery business, optimized for Hebrew and right-to-left (RTL) layout.
- **PWA**: Installable on mobile/desktop, with offline support and custom icons.
- **Responsive design**: Looks and works well on all device sizes.
- **Animated, interactive UI**: Includes parallax hero, floating call-to-action, scroll progress, and more.
- **Accessibility**: Skip links, semantic HTML, and keyboard navigation.
- **Multi-language support**: Uses a language context (currently focused on Hebrew).
- **Theming**: Light/dark mode support.
- **Web Vitals reporting**: Sends performance metrics to Google Analytics if configured.
- **OAuth-aware 404 handling**: Special logic for handling authentication callback routes.

---

## Stack & Architecture

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **UI**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **State/Data**: [@tanstack/react-query](https://tanstack.com/query/latest), [react-hook-form](https://react-hook-form.com/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Auth**: [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/auth-signin)
- **Other**: Framer Motion, Embla Carousel, Lucide Icons, date-fns, etc.

**Routing**: Client-side routing via [react-router-dom](https://reactrouter.com/).

**Project structure**: All source code is under `src/`, with components, pages, hooks, and utilities organized by feature.

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shalev-osher/mazonhaosher.co.il.git
cd mazonhaosher.co.il

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# The app will be available at http://localhost:8080
```

---

## Build & Deploy

### Build for Production

```bash
npm run build
```
- Output is generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```
- Serves the built app locally for testing.

### Deployment

- The output in `dist/` is a static site and can be deployed to any static hosting (e.g., Vercel, Netlify, Firebase Hosting, traditional web servers).
- The PWA manifest and service worker are automatically generated via `vite-plugin-pwa`.

---

## PWA Features

- **Manifest**: Configured for RTL, Hebrew, custom icons, and theme colors.
- **Service Worker**: Caches assets and Google Fonts for offline use.
- **Auto-update**: Service worker updates automatically when new versions are deployed.
- **Installable**: Users can add the app to their home screen.

---

## Important Folders & Files

- `src/`
  - `main.tsx` — App entry point, mounts React and initializes web vitals.
  - `App.tsx` — Main app component, sets up providers and routing.
  - `pages/`
    - `Index.tsx` — The homepage, composed of animated and interactive sections.
    - `NotFound.tsx` — Custom 404 page with OAuth callback handling.
  - `components/` — UI and feature components (e.g., Hero, Footer, CookieCrumbs, FloatingCTA).
  - `contexts/` — React contexts for theme and language.
  - `lib/` — Utility functions (e.g., haptic feedback, performance mode, web vitals).
  - `hooks/` — Custom React hooks.
- `index.html` — HTML template, sets up meta tags, fonts, PWA manifest, and RTL direction.
- `vite.config.ts` — Vite configuration, including PWA and path aliases.
- `tailwind.config.ts` — Tailwind CSS configuration (not shown, but referenced).
- `postcss.config.js` — PostCSS setup for Tailwind.

---

## Environment Variables

- **Supabase**: The code references Supabase for authentication. You will need to configure Supabase credentials (URL, anon key) for full auth functionality.
  - These are typically set via Vite's environment variables (e.g., `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`), but the exact variable names are not shown in the provided code.
- **Google Analytics**: If `window.gtag` is present, web vitals will be sent to GA.

---

## Main Pages & Components

### `/` (Homepage)

- **Hero**: Animated, parallax hero section with bakery branding and interactive effects.
- **TopToolbar**: Navigation and quick actions.
- **CookieCrumbs**: Decorative/branding element.
- **CinematicPreloader**: Animated loading screen.
- **ScrollProgressBar**: Visual indicator of scroll position.
- **FloatingCTA**: Floating call-to-action button.
- **LuxuryFooter**: Footer with contact and social links.
- **Accessibility**: Includes skip-to-content link.

### `*` (Not Found)

- **NotFound**: Custom 404 page. If the route looks like an OAuth callback, attempts to handle authentication and redirect home.

---

## Development Notes

- **RTL & Hebrew**: The app is designed for right-to-left languages and Hebrew content.
- **Theming**: Light/dark mode is supported and can be toggled.
- **Performance**: Animations and effects are reduced on low-power devices or when "prefers-reduced-motion" is set.
- **Accessibility**: Focus management, skip links, and semantic markup are included.

---

## Linting

```bash
npm run lint
```
- Uses ESLint with TypeScript and React rules.

---

## Docker

No Dockerfile or Docker configuration is present in this repository.

---

## License

No explicit license file is present. Please contact the repository owner for usage terms.

---
```
