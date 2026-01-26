# ----------------------
# 1. Build stage
# ----------------------
FROM node:22-alpine AS builder

# Install git and rsync
RUN apk add --no-cache git rsync

WORKDIR /app

# Bust cache by fetching latest commit info
ADD https://api.github.com/repos/cakephp/docs-skeleton/git/refs/heads/main /tmp/cache-bust.json

# Clone cakephp-docs-skeleton into vitepress directory
RUN git clone --depth 1 https://github.com/cakephp/docs-skeleton.git vitepress

# Copy documentation and config files into the skeleton
# Use rsync to merge docs instead of replacing to preserve shared public assets
RUN --mount=type=bind,source=docs,target=/tmp/docs \
    rsync -av /tmp/docs/ vitepress/docs/

COPY config.js vitepress/config.js
COPY toc_en.json vitepress/toc_en.json
COPY toc_ja.json vitepress/toc_ja.json

# Install vitepress deps
WORKDIR /app/vitepress
RUN npm install

# Increase max-old-space-size to avoid memory issues during build
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Build VitePress site
RUN npm run docs:build

# ----------------------
# 2. Runtime stage (nginx)
# ----------------------
FROM nginx:1.27-alpine AS runner

# Copy built files
COPY --from=builder /app/vitepress/.vitepress/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check (optional)
HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
