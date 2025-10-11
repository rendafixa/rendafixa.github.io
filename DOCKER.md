## Docker Setup

To run the Renda Fixa application using Docker, follow these steps:

### Prerequisites

- Docker Engine (v20 or higher)
- Docker Compose (v2 or higher)

### Building and Running

1. **Build and start the application:**

```bash
docker-compose up --build
```

2. **Access the application:**
   - The application will be available at `http://localhost:3000`
   - Or via nginx proxy at `http://localhost` (port 80)

3. **Run in detached mode:**

```bash
docker-compose up --build -d
```

### Alternative: Building and running the container manually

1. **Build the Docker image:**

```bash
docker build -t rendafixa-app .
```

2. **Run the container:**

```bash
docker run -p 3000:3000 rendafixa-app
```

### Stopping the application

- To stop the application: `Ctrl+C` if running in foreground
- Or run: `docker-compose down`

### Troubleshooting

- If you encounter issues with the build, check that all files are properly copied
- Make sure no other application is using port 3000 or port 80
- View container logs with `docker-compose logs -f`