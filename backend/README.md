# SprintDesk API

Run with Maven 3.9+ and Java 21+:

```bash
mvn spring-boot:run
```

Or build the Docker image:

```bash
docker build -t sprintdesk-api .
docker run --env-file .env -p 8080:8080 sprintdesk-api
```
