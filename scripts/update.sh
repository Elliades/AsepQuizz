#!/bin/bash

# ASEP Quiz App Update Script
# This script updates the ASEP Quiz application

# Exit on error
set -e

echo "Starting ASEP Quiz App update..."

# Check for git repository
if [ -d .git ]; then
    echo "Git repository detected. Pulling latest changes..."
    git pull
    echo "Latest changes pulled successfully."
else
    echo "No git repository detected. Assuming files were transferred manually."
    echo "Make sure you've updated all necessary files before continuing."
    read -p "Press Enter to continue..."
fi

# Check if .env needs updating
if [ -f .env.example ]; then
    echo "Checking for new environment variables..."
    # Extract variables from example file
    example_vars=$(grep -o "^[A-Za-z0-9_]*=" .env.example | sort)
    # Extract variables from current .env
    current_vars=$(grep -o "^[A-Za-z0-9_]*=" .env | sort)
    # Find missing variables
    missing_vars=$(comm -23 <(echo "$example_vars") <(echo "$current_vars"))
    
    if [ ! -z "$missing_vars" ]; then
        echo "New environment variables detected. Updating .env file..."
        for var in $missing_vars; do
            # Get the default value from .env.example
            value=$(grep "^$var" .env.example | cut -d= -f2-)
            # Append to .env
            echo "$var$value" >> .env
            echo "Added: $var"
        done
        echo ".env file updated. Please check the values of the new variables."
        read -p "Press Enter to continue..."
    else
        echo "No new environment variables found."
    fi
fi

# Rebuild and restart containers
echo "Rebuilding and restarting containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "ASEP Quiz App updated successfully!"
echo "The application is now available at http://localhost"
echo "To view logs, run: docker-compose logs -f" 