# Deterministic build for Railpack/Railway-style Node hosts.
# Providing this Dockerfile makes the platform build from it and skip Railpack's
# mise toolchain auto-install (the step that was failing with "gzip: invalid
# header" during `railpack prepare`).
FROM node:20-bookworm-slim

WORKDIR /app

# Install ALL dependencies (incl. devDependencies) - Tailwind/PostCSS/sharp are
# devDependencies required at build time. NODE_ENV is intentionally NOT set to
# production yet, so `npm ci` keeps devDependencies.
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js server build (prebuild runs the image/og/clients scripts).
COPY . .
RUN npm run build

# Runtime: production mode. next.config no longer imports any devDependency, so
# the server boots cleanly.
ENV NODE_ENV=production
EXPOSE 3000

# `start` = next start -H 0.0.0.0 -p ${PORT:-3000}; the host injects PORT.
CMD ["npm", "run", "start"]
