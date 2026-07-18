#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

MIGRATIONS_DIR="integrations/supabase/migrations"
CONTAINER_NAME="supabase-db"

echo "🚀 Starting Supabase self-hosted migrations..."

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "❌ Error: Directory $MIGRATIONS_DIR does not exist."
  exit 1
fi

# Check if the docker container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "❌ Error: Docker container '$CONTAINER_NAME' is not running."
  exit 1
fi

# Find, sort, and apply all .sql files sequentially
find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.sql" | sort | while read -r file; do
  echo "📄 Applying $(basename "$file")..."
  docker exec -i "$CONTAINER_NAME" psql -U postgres -d postgres < "$file"
done

echo "✅ All migrations applied successfully!"
