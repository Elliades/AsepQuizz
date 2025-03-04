# ASEP Quiz Deployment Steps

This document provides step-by-step instructions for deploying the ASEP Quiz application to a physical server.

## Initial Deployment

### 1. Prepare the Server

1. **Install Required Software:**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Add current user to docker group (optional, for convenience)
   sudo usermod -aG docker $USER
   # Log out and back in for this to take effect
   ```

2. **Configure Firewall (if applicable):**
   ```bash
   # Allow HTTP/HTTPS traffic
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   
   # Enable firewall
   sudo ufw enable
   ```

### 2. Deploy the Application

1. **Create Application Directory:**
   ```bash
   sudo mkdir -p /opt/asep-quiz
   sudo chown $USER:$USER /opt/asep-quiz
   cd /opt/asep-quiz
   ```

2. **Get Application Files:**
   ```bash
   # Option 1: Clone from repository
   git clone https://github.com/Elliades/AsepQuizz.git .
   
   # Option 2: Transfer files from development machine
   # On development machine:
   # tar -czf asep-quiz.tar.gz /path/to/asep-quiz
   # scp asep-quiz.tar.gz user@server:/opt/asep-quiz/
   # 
   # On server:
   # tar -xzf asep-quiz.tar.gz
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit variables as needed
   ```

4. **Run Deployment Script:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

5. **Verify Deployment:**
   ```bash
   docker-compose ps
   # Check if containers are running
   
   # Test accessing the application
   curl http://localhost
   ```

### 3. Set Up Domain and SSL (Optional)

1. **Configure Domain DNS:**
   - Add A record pointing to your server IP

2. **Install Certbot for SSL:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Update Nginx Configuration:**
   Edit `docker/nginx/nginx.conf` to include SSL settings and reload:
   ```bash
   docker-compose restart frontend
   ```

## Update Process

### 1. Pull Latest Changes

```bash
cd /opt/asep-quiz
git pull
# OR
# Transfer updated files to server
```

### 2. Run Update Script

```bash
chmod +x scripts/update.sh
./scripts/update.sh
```

### 3. Verify Update

```bash
docker-compose ps
# Check application in browser
```

## Backup Process

### 1. Create Backup

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### 2. Transfer Backup (Optional)

```bash
# Copy backup to a secure location
scp backups/asep_quiz_backup_*.tar.gz user@backup-server:/path/to/backups/
```

## Restore Process

### 1. Get Backup File

```bash
# If backup is on another server
scp user@backup-server:/path/to/backups/asep_quiz_backup_YYYYMMDD_HHMMSS.tar.gz backups/
```

### 2. Restore from Backup

```bash
chmod +x scripts/restore.sh
./scripts/restore.sh backups/asep_quiz_backup_YYYYMMDD_HHMMSS.tar.gz
```

## Maintenance Tasks

### Check Disk Space

```bash
df -h
# Ensure enough free space
```

### View Logs

```bash
docker-compose logs -f
```

### Update Docker

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Reboot Server

```bash
# Stop containers before reboot
docker-compose down
sudo reboot

# After reboot
cd /opt/asep-quiz
docker-compose up -d
``` 