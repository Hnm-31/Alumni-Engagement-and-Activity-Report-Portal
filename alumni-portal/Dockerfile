# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
# (Optional) You can run 'mvn dependency:go-offline' here to cache dependencies in a Docker layer

# Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render passes a PORT variable to containers, Spring Boot automatically listens on that port
# if we inject it as a command line argument (it defaults to 8080 if not set)
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
