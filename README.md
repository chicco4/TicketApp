# TicketApp

TicketApp is a full-stack event ticketing platform with a Spring Boot 3 (Java 21) backend, an Angular 20 frontend, and Keycloak-secured authentication. The project is designed for local development with Dockerised infrastructure services.

## Repository Layout
- `backend/` – Spring Boot REST API, Maven wrapper, and OpenAPI documentation.
- `frontend/` – Angular application that consumes the backend APIs through a local proxy.
- `scripts/` – Utility scripts such as `seed-events.js` for populating sample data.
- `docker-compose.yml` – Local infrastructure (PostgreSQL, Adminer, Keycloak).

## Prerequisites
- Java 21 (Preferred vendor: Temurin/OpenJDK).
- Node.js 20.x and npm (required for the Angular frontend and utility scripts).
- Docker Desktop or Docker Engine with Docker Compose v2.
- Optional: `curl` or similar tool for manual API testing.

## Getting Started

1. **Start infrastructure services**  
   ```bash
   docker compose up -d
   ```  
   This launches PostgreSQL, Adminer, and Keycloak with preconfigured realms and credentials.

2. **Run the backend**  
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```  
   The API is available at `http://localhost:8080`. Swagger UI lives at `/api/v1/docs/ui`.

3. **Run the frontend**  
   ```bash
   cd frontend
   npm install
   npm run start
   ```  
   The dev server listens on `http://localhost:4200` and proxies API calls to the backend. The default Angular configuration uses Keycloak for login.

4. **(Optional) Seed sample events**  
   With the backend and Keycloak running, execute:  
   ```bash
   node scripts/seed-events.js
   ```  
   The script obtains an OAuth2 token via the organizer test user and creates a curated set of events.

## Useful Commands
- Backend build (skip tests):  
  ```bash
  cd backend
  ./mvnw -DskipTests package
  ```
- Backend tests:  
  ```bash
  cd backend
  ./mvnw test
  ```
- Frontend production build:  
  ```bash
  cd frontend
  npm run build
  ```
- Frontend unit tests (Karma):  
  ```bash
  cd frontend
  npm test
  ```

## Authentication and Services
- **Keycloak admin** – username `admin`, password `admin`, console at `http://localhost:9090/admin`.  
- **Keycloak realm** – `event-ticket-platform`, client `event-ticket-platform-app`.  
- **Test users** – `organizer1/password`, `attendee1/password`, `staff1/password`.  
- **Token endpoint** – `http://localhost:9090/realms/event-ticket-platform/protocol/openid-connect/token`.
- **Adminer (DB viewer)** – `http://localhost:8888` with DB credentials `user/password`.

## API Documentation
- OpenAPI JSON/YAML: `http://localhost:8080/api/v1/docs`
- Swagger UI: `http://localhost:8080/api/v1/docs/ui`

## Troubleshooting Tips
- Ensure Docker containers are healthy (`docker compose ps`) before starting the backend.
- Keycloak runs in dev-file mode; the realm is auto-imported from `event-ticket-platform-realm.json`. Restart containers if you change the realm.
- If Angular login loops, verify the backend is reachable at `http://localhost:8080` and that CORS origins include `http://localhost:4200` (configurable via `backend/src/main/resources/application.properties`).
