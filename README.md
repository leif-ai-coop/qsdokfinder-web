qsdokfinder-web
================

Lokale Entwicklung (Windows)
----------------------------

Voraussetzungen:
- Node.js 18+
- Python 3.11+ (für das Backend)

Schritte:
1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Komplettes Dev-Setup (Frontend + Backend) starten:
   ```bash
   npm run dev:all
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

Hinweise:
- API-Calls gehen an `/api/...` und werden im Dev über `src/setupProxy.js` an `http://localhost:3001` weitergeleitet.
- Stelle sicher, dass im Backend eine gültige SQLite-DB unter `qsdokfinder-backend/local_data/qsdokumente.db` liegt.

Produktion / Docker
-------------------
- Siehe `Dockerfile` und `nginx.conf` für das Container-Setup.
- Nginx leitet `/api/` im Container auf den Backend-Container `qsdokfinder-backend:3001` weiter.


