#!/bin/bash

# ==============================================================================
# CakePHP vitepress docs dev server orchestration script
# ------------------------------------------------------------------------------
# This script orchestrates the VitePress development environment by:
# 1. Cleaning and setting up .temp directory
# 2. Cloning the cakephp-docs-skeleton repository
# 3. Syncing docs folder and symlinking config files
# 4. Installing dependencies
# 5. Starting the VitePress dev server with live sync
# ------------------------------------------------------------------------------
# Usage: ./dev-server.sh [OPTIONS]
#   --port PORT            Specify the port (default: 5173)
#   --sync-interval N      Rsync interval in seconds (default: 1)
#   --skeleton-path PATH   Use local skeleton repo instead of cloning
#   --help                 Show this help message
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="${PROJECT_ROOT}/.temp"
SKELETON_REPO="https://github.com/cakephp/docs-skeleton.git"
SKELETON_PATH=""
DEV_PORT=5173
SYNC_INTERVAL=1
RSYNC_PID=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port)
      DEV_PORT="$2"
      shift 2
      ;;
    --sync-interval)
      SYNC_INTERVAL="$2"
      shift 2
      ;;
    --skeleton-path)
      SKELETON_PATH="$2"
      shift 2
      ;;
    -h|--help)
      head -n 17 "$0" | tail -n 14 | sed 's/^# //'
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
  echo -e "${GREEN}✓ ${1}${NC}"
}

log_warn() {
  echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
  echo -e "${RED}✗ ${1}${NC}"
}

# Check prerequisites
check_prerequisites() {
  log_info "Checking prerequisites..."

  local missing_tools=()

  if ! command -v git &> /dev/null; then
    missing_tools+=("git")
  fi

  if ! command -v node &> /dev/null; then
    missing_tools+=("node")
  fi

  if ! command -v npm &> /dev/null; then
    missing_tools+=("npm")
  fi

  if ! command -v rsync &> /dev/null; then
    missing_tools+=("rsync")
  fi

  if [ ${#missing_tools[@]} -gt 0 ]; then
    log_error "Missing required tools: ${missing_tools[*]}"
    exit 1
  fi

  log_success "All prerequisites installed"
  echo "  - node: $(node --version)"
  echo "  - npm: $(npm --version)"
  echo "  - rsync: $(rsync --version | head -1 | awk '{print $3}')"
}

# Setup .temp directory
setup_temp_dir() {
  if [ -d "$TEMP_DIR" ]; then
    log_info "Removing existing .temp directory..."
    rm -rf "$TEMP_DIR"
  fi

  log_info "Creating .temp directory..."
  mkdir -p "$TEMP_DIR"
  log_success ".temp directory ready"
}

# Clone or copy skeleton repository
clone_skeleton() {
  if [ -n "$SKELETON_PATH" ]; then
    # Convert to absolute path
    local abs_skeleton_path
    abs_skeleton_path="$(cd "$SKELETON_PATH" && pwd)"
    
    log_info "Copying local skeleton from: $abs_skeleton_path"
    
    if [ ! -d "$abs_skeleton_path" ]; then
      log_error "Skeleton path not found: $abs_skeleton_path"
      exit 1
    fi
    
    # Copy all files and directories from skeleton to .temp (excluding docs, node_modules, .git)
    rsync -a \
      --exclude='docs/' \
      --exclude='node_modules/' \
      --exclude='.git/' \
      --exclude='package-lock.json' \
      "$abs_skeleton_path/" "$TEMP_DIR/"
    
    log_success "Local skeleton copied"
  else
    log_info "Cloning docs-skeleton repository..."
    git clone --depth 1 "$SKELETON_REPO" "$TEMP_DIR" 2>&1 | grep -E "(Cloning|Resolving|Receiving)" || true
    log_success "Skeleton repository cloned"
  fi
}

# Initial sync of docs folder
sync_docs_initial() {
  log_info "Syncing docs folder..."

  local src="${PROJECT_ROOT}/docs/"
  local dest="${TEMP_DIR}/docs/"

  if [ ! -d "$src" ]; then
    log_error "Source docs directory not found: $src"
    exit 1
  fi

  # Ensure destination directory exists
  mkdir -p "$dest"

  # Initial sync
  rsync -az "$src" "$dest"
  log_success "Docs folder synced"
}

# Start background rsync watcher
start_rsync_watcher() {
  log_info "Starting docs sync watcher..."

  local src="${PROJECT_ROOT}/docs/"
  local dest="${TEMP_DIR}/docs/"

  # Start rsync in background loop
  (
    while true; do
      rsync -az "$src" "$dest" 2>/dev/null
      sleep "$SYNC_INTERVAL"
    done
  ) &

  RSYNC_PID=$!
  log_success "Docs sync watcher started (PID: $RSYNC_PID)"
}

# Create symlinks for config files
create_symlinks() {
  log_info "Creating symlinks for config files..."

  # List of files to symlink (not docs, which is synced)
  local items=(
    "config.js"
    "toc_en.json"
    "toc_ja.json"
  )

  for item in "${items[@]}"; do
    local src="${PROJECT_ROOT}/${item}"
    local dest="${TEMP_DIR}/${item}"

    if [ ! -e "$src" ]; then
      log_warn "Source not found: $src (skipping)"
      continue
    fi

    # Remove existing file/symlink if it exists
    if [ -e "$dest" ] || [ -L "$dest" ]; then
      rm -rf "$dest"
    fi

    ln -s "$src" "$dest"
    log_success "Symlinked: $item"
  done
}

# Install dependencies
install_dependencies() {
  log_info "Installing VitePress dependencies..."

  cd "$TEMP_DIR"
  npm install --quiet
  log_success "Dependencies installed"
}

# Display start information
show_startup_info() {
  echo ""
  echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  VitePress Dev Server Ready${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "  📂 Project Root:    ${PROJECT_ROOT}"
  echo "  📂 Temp Directory:  ${TEMP_DIR}"
  if [ -n "$SKELETON_PATH" ]; then
    echo "  📦 Skeleton Source: ${SKELETON_PATH} (local)"
  else
    echo "  📦 Skeleton Source: ${SKELETON_REPO} (remote)"
  fi
  echo "  🔗 Port:            ${DEV_PORT}"
  echo "  🔄 Docs Sync:       Active (rsync every ${SYNC_INTERVAL}s)"
  echo ""
  echo "  📚 Documentation:   http://localhost:${DEV_PORT}"
  echo ""
  echo "  ℹ️  Docs folder syncs every ${SYNC_INTERVAL}s via rsync"
  echo "  ℹ️  Config files (config.js, toc_*.json) are symlinked"
  echo ""
  echo "  To stop the server: Press Ctrl+C"
  echo ""
  echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
  echo ""
}

# Start dev server
start_dev_server() {
  log_info "Starting VitePress dev server on port ${DEV_PORT}..."
  log_warn "Please wait, VitePress server may take a moment to start up..."
  cd "$TEMP_DIR"
  npm run docs:dev -- --port "$DEV_PORT"
}

# Cleanup on exit
cleanup_on_exit() {
  echo ""
  log_info "Shutting down..."

  # Kill rsync watcher if running
  if [ -n "$RSYNC_PID" ] && kill -0 "$RSYNC_PID" 2>/dev/null; then
    log_info "Stopping docs sync watcher (PID: $RSYNC_PID)..."
    kill "$RSYNC_PID" 2>/dev/null || true
  fi

  log_success "Dev server stopped"
}

trap cleanup_on_exit EXIT INT TERM

# Main execution
main() {
  echo ""
  log_info "VitePress Dev Server Setup"
  log_info "================================"
  echo ""

  check_prerequisites
  echo ""

  setup_temp_dir
  echo ""

  clone_skeleton
  echo ""

  sync_docs_initial
  echo ""

  create_symlinks
  echo ""

  install_dependencies
  echo ""

  start_rsync_watcher
  echo ""

  show_startup_info

  start_dev_server
}

main "$@"
