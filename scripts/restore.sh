#!/bin/bash

# ASEP Quiz App Restore Script
# This script restores the ASEP Quiz application from a backup

# Exit on error
set -e

# Check if backup file was provided
if [ -z "$1" ]; then
    echo "Error: No backup file specified."
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Starting ASEP Quiz App restore from backup: $BACKUP_FILE"

# Stop current application
echo "Stopping current application..."
docker-compose down

# Create backup of current state
echo "Creating backup of current state before restore..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
PRE_RESTORE_BACKUP="$BACKUP_DIR/pre_restore_backup_$TIMESTAMP.tar.gz"
tar -czf $PRE_RESTORE_BACKUP --exclude="node_modules" --exclude=".git" --exclude="dist" --exclude="backups" .
echo "Pre-restore backup created: $PRE_RESTORE_BACKUP"

# Create temporary directory for restore
echo "Extracting backup to temporary directory..."
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Copy files to current directory
echo "Copying files from backup..."
rsync -a --exclude="node_modules" --exclude=".git" --exclude="dist" --exclude="backups" "$TEMP_DIR/" ./

# When database is implemented, add database restore here
# echo "Restoring database..."
# cat "$TEMP_DIR/backups/database_*.sql" | docker-compose exec -T database psql -U $DB_USER -d $DB_NAME

# Clean up temporary directory
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

# Restart application
echo "Starting restored application..."
docker-compose up -d --build

echo "ASEP Quiz App restored successfully from backup!"
echo "The application is now available at http://localhost"
echo "To view logs, run: docker-compose logs -f" 