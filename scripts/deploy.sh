#!/bin/bash

# ASEP Quiz App Deployment Script
# This script deploys the ASEP Quiz application using Docker Compose

# Exit on error
set -e

echo "Starting ASEP Quiz App deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your environment variables."
    read -p "Press Enter to continue after editing the .env file..."
fi

# Create necessary directories if they don't exist
mkdir -p docker/nginx
mkdir -p backups

# Check if nginx.conf exists, create if not
if [ ! -f docker/nginx/nginx.conf ]; then
    echo "Creating nginx configuration..."
    cat > docker/nginx/nginx.conf << 'EOL'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Future API proxy configuration
    # location /api/ {
    #     proxy_pass http://backend:3000/;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_cache_bypass $http_upgrade;
    # }
}
EOL
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "ASEP Quiz App deployed successfully!"
echo "The application is now available at http://localhost"
echo "To view logs, run: docker-compose logs -f" 