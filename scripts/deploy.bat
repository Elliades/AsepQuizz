@echo off
echo Démarrage du déploiement de l'application ASEP Quiz...

REM Vérifier que Docker est installé
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker n'est pas installé. Veuillez installer Docker d'abord.
    exit /b 1
)

REM Vérifier que Docker Compose est installé
where docker-compose >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord.
    exit /b 1
)

REM Créer le fichier .env à partir de .env.example si inexistant
if not exist ".env" (
    echo Creation du fichier .env depuis .env.example...
    copy .env.example .env
    echo Veuillez mettre à jour le fichier .env avec vos variables d'environnement.
    pause
)

REM Création des dossiers nécessaires
if not exist "docker\nginx" mkdir docker\nginx
if not exist "backups" mkdir backups

REM Vérifier l'existence du fichier de configuration nginx, le créer s'il manque
if not exist "docker\nginx\nginx.conf" (
    echo Creation de la configuration nginx...
    (
        echo server {
        echo     listen 80;
        echo     server_name localhost;
        echo     root /usr/share/nginx/html;
        echo     index index.html;
        echo.
        echo     REM Activation de la compression gzip
        echo     gzip on;
        echo     gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        echo.
        echo     REM Gestion du routing de React
        echo     location / {
        echo         try_files %%uri %%uri/ /index.html;
        echo     }
        echo.
        echo     REM Configuration future du proxy API (commenté)
        echo     REM location /api/ {
        echo     REM     proxy_pass http://backend:3000/;
        echo     REM     proxy_http_version 1.1;
        echo     REM     proxy_set_header Upgrade %%http_upgrade;
        echo     REM     proxy_set_header Connection 'upgrade';
        echo     REM     proxy_set_header Host %%host;
        echo     REM     proxy_cache_bypass %%http_upgrade;
        echo     REM }
        echo }
    ) > docker\nginx\nginx.conf
)

REM Arrêt et nettoyage des containers existants
echo Arrêt des containers existants...
docker-compose down

REM Construction sans cache et lancement des containers
echo Construction et lancement des containers...
docker-compose build --no-cache
docker-compose up -d

echo L'application ASEP Quiz a ete deploiee avec succes!
echo Vous pouvez acceder a l'application sur http://localhost
echo Pour consulter les logs, executez : docker-compose logs -f
pause
