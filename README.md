# TicketApp

A small Event Ticket Platform (backend). This repository contains a Spring Boot 3.x application written for Java 21.

Quick start (backend)

1. Build the project (uses the included Maven wrapper):

```
./mvnw -DskipTests package

# or

./mvnw -U -e clean package -DskipTests
```

2. Run the backend:

```
./mvnw spring-boot:run
```

3. Run tests:

```
./mvnw test
```

Useful endpoints (when running locally):

- OpenAPI JSON/YAML: http://localhost:8080/api/v1/docs
- Swagger UI: http://localhost:8080/api/v1/docs/ui

Notes

- The app expects a PostgreSQL database by default (configured in `src/main/resources/application.properties`). For development you can point to a local Postgres instance or change the properties to use an in-memory H2 profile.
- Use Java 21 to compile and run (see `pom.xml`).

Recommended next steps

- Add a short CONTRIBUTING.md with how to run local DB, migrations, and test data.
- Add CI (GitHub Actions) to run `./mvnw -DskipTests package` and tests on push/PR.
