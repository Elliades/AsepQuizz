# ASEP Quiz App Deployment Guide

This guide provides comprehensive instructions for deploying the ASEP Quiz application on a physical server.

## Deployment Architecture

The ASEP Quiz app uses a containerized architecture with Docker:

- **Frontend Container**: React application served through Nginx
- **Backend Container** (future): Express.js API
- **Database Container** (future): PostgreSQL or MongoDB

## Prerequisites

- A physical server with:
  - Linux OS (Ubuntu 20.04+ recommended)
  - Docker Engine (20.10+)
  - Docker Compose (2.0+)
  - At least 2GB RAM
  - At least 10GB disk space
  - Internet connectivity for updates

## Installation Steps

### 1. Set Up the Server

1. Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. Install Docker Compose:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. Create a dedicated directory for the application:
```bash
mkdir -p /opt/asep-quiz
cd /opt/asep-quiz
```

### 2. Deploy the Application

1. Clone the repository or transfer the application files:
```bash
git clone https://github.com/Elliades/AsepQuizz.git .
# OR
# Transfer files via SCP, SFTP, etc.
```

2. Create environment variables file:
```bash
cp .env.example .env
# Edit the .env file with appropriate values
nano .env
```

3. Run the deployment script:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Configuration

### Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| VITE_API_URL | Backend API URL | http://localhost/api |
| SERVER_PORT | Application port | 80 |
| DB_USER | Database username | postgres |
| DB_PASSWORD | Database password | secure_password |
| DB_NAME | Database name | asep_quiz |
| DB_HOST | Database host | database |
| DB_PORT | Database port | 5432 |

### Nginx Configuration

The Nginx configuration is located at `docker/nginx/nginx.conf`. Key settings:

- Static file serving
- React Router support
- Gzip compression
- API proxying (commented out, ready for backend)

## Monitoring and Management

### Viewing Logs

```bash
# View all container logs
docker-compose logs

# View specific container logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Container Management

```bash
# Stop the application
docker-compose down

# Start the application
docker-compose up -d

# Restart the application
docker-compose restart
```

## Backup and Restore

Use the provided scripts for automated backup and restore:

```bash
# Create a backup
./scripts/backup.sh

# Restore from a backup
./scripts/restore.sh backup_filename.tar.gz
```

## Troubleshooting

### Common Issues

1. **Application fails to start:**
   - Check Docker logs: `docker-compose logs`
   - Verify Docker is running: `docker info`
   - Check disk space: `df -h`

2. **Unable to access the application:**
   - Check firewall settings: `sudo ufw status`
   - Verify container is running: `docker-compose ps`
   - Check Nginx configuration

3. **Database connection issues (future):**
   - Verify database container is running
   - Check environment variables
   - Validate network connectivity between containers

### Getting Help

For additional assistance, consult:
- GitHub repository issues
- Project documentation
- System logs: `journalctl -u docker.service`

## Database Integration

See the separate [database.md](../docs/database.md) guide for instructions on integrating a database with the application.

## Security Considerations

- Use strong passwords for database credentials
- Implement HTTPS (SSL/TLS) for production
- Keep Docker and host system updated
- Consider using Docker Secrets for sensitive data
- Implement proper firewall rules

# ASEP Quiz App Database Integration Guide

This guide provides instructions for integrating a database with the ASEP Quiz application.

## Supported Databases

The application is designed to work with:
- PostgreSQL (recommended)
- MongoDB (alternative)

## PostgreSQL Integration

### 1. Enable the Database Service

Edit `docker-compose.yml` and uncomment the database service and volumes sections.

### 2. Configure Environment Variables

Update the `.env` file with your database credentials:
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=asep_quiz
DB_HOST=database
DB_PORT=5432


### 3. Configure the Backend

Create or update the backend service to connect to the database:

1. Install the necessary packages:
   ```bash
   npm install pg prisma @prisma/client
   ```

2. Initialize Prisma:
   ```bash
   npx prisma init
   ```

3. Configure the database connection in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. Set the DATABASE_URL in `.env`:
   ```
   DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
   ```

### 4. Create Database Schema

Define your database schema in `prisma/schema.prisma`:
prisma
model User {
id String @id @default(uuid())
createdAt DateTime @default(now())
email String @unique
name String?
results Result[]
}
model Quiz {
id String @id @default(uuid())
createdAt DateTime @default(now())
title String
subject String
questions Question[]
results Result[]
}
model Question {
id String @id @default(uuid())
createdAt DateTime @default(now())
text String
type String
options Json
correctAnswer Json
quizId String
quiz Quiz @relation(fields: [quizId], references: [id])
comments Comment[]
tags Tag[]
}
model Result {
id String @id @default(uuid())
createdAt DateTime @default(now())
score Float
userId String
user User @relation(fields: [userId], references: [id])
quizId String
quiz Quiz @relation(fields: [quizId], references: [id])
}
model Comment {
id String @id @default(uuid())
createdAt DateTime @default(now())
text String
userId String
questionId String
question Question @relation(fields: [questionId], references: [id])
parentId String?
parent Comment? @relation("CommentReplies", fields: [parentId], references: [id])
replies Comment[] @relation("CommentReplies")
upvotes Int @default(0)
downvotes Int @default(0)
}
model Tag {
id String @id @default(uuid())
createdAt DateTime @default(now())
name String
questionId String
question Question @relation(fields: [questionId], references: [id])
}


### 5. Generate the Prisma Client
bash
npx prisma generate


### 6. Create Database Migrations
bash
npx prisma migrate dev --name init


### 7. Update Backend Code

Implement the database logic in your Express.js API.

### 8. Restart the Application
bash
./scripts/deploy.sh


```

## Implementation Plan

1. **Immediate Implementation**:
   - Add Docker configuration
   - Create deployment scripts
   - Update project structure
   - Add deployment documentation

2. **Short-term (When backend is needed)**:
   - Implement Express.js backend in container
   - Configure Nginx to proxy API requests
   - Set up environment variables

3. **Medium-term (Database integration)**:
   - Add database container
   - Configure database connection
   - Implement data persistence
   - Add backup/restore functionality

## Recommendation Summary

Based on your requirements for easy deployment, future updates, and eventual database integration, I recommend:

1. **Use Docker + Docker Compose**: Provides isolated, consistent environments that are easy to update
2. **Add Nginx as web server**: Efficiently serves static content and can proxy API requests
3. **Implement structured deployment scripts**: Makes deployment a simple one-command process
4. **Prepare for database integration**: Structure is ready to add a database when needed

Would you like me to implement any specific part of this deployment plan first? Or would you like more details on any aspect of the recommendation?