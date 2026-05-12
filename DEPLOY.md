# Deployment auf Hostinger VPS

Dieses Dokument führt durch das komplette Setup von Null bis fertig.
Voraussetzung: Hostinger VPS mit Ubuntu 22.04 oder 24.04.

---

## 1. VPS vorbereiten (einmalig)

SSH einloggen — IP und Passwort findest du im Hostinger hPanel:

```bash
ssh root@DEINE-VPS-IP
```

System updaten und Basis-Tools installieren:

```bash
apt update && apt upgrade -y
apt install -y git curl nginx certbot python3-certbot-nginx ufw
```

Firewall konfigurieren:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 2. Node.js 22 via NVM installieren

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

nvm install 22
nvm use 22
nvm alias default 22

node -v   # sollte v22.x.x zeigen
npm -v
```

PM2 (Prozess-Manager, hält die App am Laufen) installieren:

```bash
npm install -g pm2
```

---

## 3. Projekt klonen und einrichten

```bash
cd /var/www
git clone https://github.com/ramisschiegg/abstimmung-juni-2026.git abstimmung
cd abstimmung
```

Abhängigkeiten installieren:

```bash
npm install
```

Umgebungsvariablen einrichten:

```bash
cp .env.example .env
nano .env
```

In `nano` diese Werte eintragen:

```bash
DATABASE_URL="file:./prisma/abstimmung.db"
ANTHROPIC_API_KEY="sk-ant-api03-DEIN-KEY-HIER"
IP_SALT="ein-langer-zufaelliger-string-hier"
```

Speichern: `Ctrl+O` → Enter → `Ctrl+X`

---

## 4. Datenbank einrichten und befüllen

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

Erwartete Ausgabe:
```
✓ 2 Vorlagen erstellt
✓ 20 offizielle Argumente aus dem Abstimmungsbüchlein importiert
```

---

## 5. App bauen und starten

```bash
npm run build
```

Mit PM2 starten (läuft auch nach SSH-Logout weiter):

```bash
pm2 start npm --name "abstimmung" -- start
pm2 save
pm2 startup   # zeigt einen Befehl — diesen kopieren und ausführen!
```

Den von `pm2 startup` angezeigten Befehl ausführen, z.B.:
```bash
sudo env PATH=$PATH:/root/.nvm/versions/node/v22.x.x/bin pm2 startup systemd -u root --hp /root
```

Status prüfen:

```bash
pm2 status
pm2 logs abstimmung --lines 20
```

Die App läuft jetzt auf Port **3000**. Test:

```bash
curl http://localhost:3000/api/votes
```

---

## 6. Nginx als Reverse Proxy einrichten

Nginx-Konfiguration erstellen:

```bash
nano /etc/nginx/sites-available/abstimmung
```

Folgenden Inhalt einfügen — `DEINE-DOMAIN.tld` durch deine Domain ersetzen (z.B. `swissvote.tech`):

```nginx
server {
    listen 80;
    server_name DEINE-DOMAIN.tld www.DEINE-DOMAIN.tld;

    # Static files direkt aus dem Build servieren (schneller)
    location /_next/static/ {
        alias /var/www/abstimmung/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Speichern und aktivieren:

```bash
ln -s /etc/nginx/sites-available/abstimmung /etc/nginx/sites-enabled/
nginx -t          # Konfiguration testen
systemctl reload nginx
```

---

## 7. SSL-Zertifikat (HTTPS) via Let's Encrypt

```bash
certbot --nginx -d DEINE-DOMAIN.tld -d www.DEINE-DOMAIN.tld
```

Certbot fragt nach einer E-Mail-Adresse und passt nginx automatisch für HTTPS an.
Automatische Erneuerung ist bereits aktiv (läuft via systemd-Timer).

Test: https://DEINE-DOMAIN.tld → Website sollte mit grünem Schloss erscheinen.

---

## 8. DNS bei deiner Domain einrichten

Bei deinem Domain-Registrar (z.B. Hostinger, Infomaniak) einen A-Record setzen:

| Typ | Name | Wert |
|-----|------|------|
| A | @ | DEINE-VPS-IP |
| A | www | DEINE-VPS-IP |

DNS-Propagation dauert 5–60 Minuten.

---

## Updates deployen (nach Code-Änderungen)

```bash
cd /var/www/abstimmung
git pull
npm install
npm run build
npx prisma migrate deploy   # nur wenn Schema geändert wurde
pm2 restart abstimmung
```

Oder als einzeiliges Script:

```bash
cd /var/www/abstimmung && git pull && npm install && npm run build && pm2 restart abstimmung
```

---

## Datenbank-Backup (empfohlen)

Tägliches Backup via Cron einrichten:

```bash
crontab -e
```

Diese Zeile hinzufügen (täglich um 02:00 Uhr):

```
0 2 * * * cp /var/www/abstimmung/prisma/abstimmung.db /var/www/abstimmung/prisma/backups/abstimmung-$(date +\%F).db
```

Backup-Ordner erstellen:

```bash
mkdir -p /var/www/abstimmung/prisma/backups
```

---

## Nützliche Befehle

```bash
pm2 status                        # Status der App
pm2 logs abstimmung               # Live-Logs
pm2 restart abstimmung            # App neu starten
pm2 stop abstimmung               # App stoppen

systemctl status nginx            # Nginx-Status
nginx -t                          # Nginx-Config testen
systemctl reload nginx            # Nginx neu laden

# SQLite direkt abfragen
sqlite3 /var/www/abstimmung/prisma/abstimmung.db "SELECT COUNT(*) FROM Argument;"
```

---

## Troubleshooting

| Problem | Lösung |
|---|---|
| 502 Bad Gateway | `pm2 status` prüfen — App läuft? `pm2 restart abstimmung` |
| App startet nicht | `pm2 logs abstimmung` — Fehler lesen |
| `.env` nicht gefunden | Datei liegt in `/var/www/abstimmung/.env`? |
| Datenbank-Fehler | `npx prisma migrate deploy` nochmals ausführen |
| Prisma-Fehler "Unknown field" | `npx prisma generate` dann `npm run build` |
| HTTPS funktioniert nicht | `certbot renew --dry-run` testen |
