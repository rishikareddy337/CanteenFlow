# Multi-stage build for Spring Boot on Render
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx384m", "-Xms128m", "-Dsun.net.inetaddr.ttl=60", "-jar", "app.jar"]
