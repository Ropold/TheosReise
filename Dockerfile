FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/theosreise.jar theosreise.jar
ENTRYPOINT ["java", "-jar", "theosreise.jar"]