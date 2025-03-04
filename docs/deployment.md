# Deployment Documentation

## Overview
This document describes the deployment process for the ASEP Quiz application, including export, transfer, and server deployment procedures.

## Prerequisites
- Windows or Linux/Unix system for development
- Docker and Docker Compose on the server
- SSH access to the deployment server

## Export Process

### Windows
Use the `scripts/export.bat` script to create a deployment package:
```batch
scripts/export.bat
```

### Linux/Unix
Use the `scripts/export.sh` script to create a deployment package:
```bash
./scripts/export.sh
```

## Deployment Process

1. Transfer the deployment package to the server:
```bash
scp deploy_package.zip user@your-server:/opt/asep-quiz/
```

2. On the server:
```bash
cd /opt/asep-quiz
unzip deploy_package.zip
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Update Process
To update an existing deployment:

1. Create a new deployment package
2. Transfer to server
3. Run the update script:
```bash
./scripts/update.sh
```

## Backup Process
Backups are automatically created before updates. To manually create a backup:
```bash
./scripts/backup.sh
```

## Troubleshooting
- Check Docker logs: `docker-compose logs`
- Verify container status: `docker-compose ps`
- Check application logs in the container 