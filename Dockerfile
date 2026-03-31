# ----------------------
# 1. Build stage
# ----------------------
FROM node:22-alpine AS builder

# Install git and rsync
RUN apk add --no-cache git rsync

WORKDIR /app

# Copy everything to the container
COPY . .
RUN npm ci

# Increase max-old-space-size to avoid memory issues during build
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Build VitePress site
RUN npm run docs:build

# ----------------------
# 2. Runtime stage (nginx)
# ----------------------
FROM nginx:1.27-alpine AS runner

# Copy built files
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check (optional)
HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
