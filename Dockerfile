# syntax=docker/dockerfile:1.6

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (use bun lockfile if present, otherwise npm)
COPY package.json package-lock.json* bun.lock* ./
RUN if [ -f bun.lock ]; then \
      npm install -g bun && bun install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy source
COPY . .

# Build-time public env vars (Vite inlines these at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
FROM nginx:1.27-alpine AS runner

# Replace default nginx config with our SPA-aware config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
