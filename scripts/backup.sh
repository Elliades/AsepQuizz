#!/bin/bash

# ASEP Quiz App Backup Script
# This script creates a backup of the ASEP Quiz application data

# Exit on error
set -e

# Set backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/asep_quiz_backup_$TIMESTAMP.tar.gz"

echo "Starting ASEP Quiz App backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup of source code
echo "Backing up source code..."
tar -czf $BACKUP_FILE --exclude="node_modules" --exclude=".git" --exclude="dist" --exclude="backups" .

# Create backup manifest
echo "Creating backup manifest..."
echo "ASEP Quiz Backup" > $BACKUP_DIR/backup_$TIMESTAMP.manifest
echo "Date: $(date)" >> $BACKUP_DIR/backup_$TIMESTAMP.manifest
echo "Version: $(git describe --tags --abbrev=0 2>/dev/null || echo 'Unknown')" >> $BACKUP_DIR/backup_$TIMESTAMP.manifest
echo "Commit: $(git rev-parse HEAD 2>/dev/null || echo 'Unknown')" >> $BACKUP_DIR/backup_$TIMESTAMP.manifest
echo "Contains: Source code, configuration files" >> $BACKUP_DIR/backup_$TIMESTAMP.manifest

# When database is implemented, add database backup here
# echo "Backing up database..."
# docker-compose exec database pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_DIR/database_$TIMESTAMP.sql
# tar -rf $BACKUP_FILE $BACKUP_DIR/database_$TIMESTAMP.sql
# rm $BACKUP_DIR/database_$TIMESTAMP.sql
# echo "Contains: Source code, configuration files, database" > $BACKUP_DIR/backup_$TIMESTAMP.manifest

# Add manifest to backup
tar -rf $BACKUP_FILE $BACKUP_DIR/backup_$TIMESTAMP.manifest
rm $BACKUP_DIR/backup_$TIMESTAMP.manifest

echo "Backup created successfully: $BACKUP_FILE"
echo "Size: $(du -h $BACKUP_FILE | cut -f1)"
echo "To restore from this backup, use: ./scripts/restore.sh $BACKUP_FILE" 