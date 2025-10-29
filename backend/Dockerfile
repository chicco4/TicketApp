FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Pre-fetch dependencies to speed up subsequent builds
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package && mv target/backend-*.jar app.jar

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
