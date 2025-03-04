#!/bin/bash

# Zip name
ZIP_NAME="deploy_package.zip"

# Delete old zip if it exists
if [ -f "$ZIP_NAME" ]; then
    rm "$ZIP_NAME"
fi

echo "Creating deployment package..."

# Create a temporary directory for organizing files
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/asep-quiz"

# Copy relevant files to temp directory
rsync -av --progress ./ "$TEMP_DIR/asep-quiz/" \
    --exclude node_modules \
    --exclude backups \
    --exclude .git \
    --exclude .idea \
    --exclude test-reports \
    --exclude test-results.txt \
    --exclude "*.log" \
    --exclude "*.zip" \
    --exclude .env

# Create the zip archive
cd "$TEMP_DIR" || exit
zip -r "../$ZIP_NAME" asep-quiz

# Clean up
cd - > /dev/null || exit
rm -rf "$TEMP_DIR"

if [ -f "$ZIP_NAME" ]; then
    echo -e "\e[32m✅ Archive created successfully: $ZIP_NAME\e[0m"
    echo
    echo -e "\e[34mDeployment package is ready for transfer to the server.\e[0m"
    echo -e "\e[34mUse SCP or similar to transfer the package:\e[0m"
    echo -e "\e[33mscp $ZIP_NAME user@your-server:/path/to/destination/\e[0m"
else
    echo -e "\e[31m❌ Error creating archive\e[0m"
    exit 1
fi
