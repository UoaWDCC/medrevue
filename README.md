# Med Revue Hub

A modern web platform to support Med Revue – an annual theater show put together by medical students, with all proceeds going to charity.

## 🎭 Overview

Med Revue Hub is designed to:

- 📅 Promote upcoming show details and events
- 🎟️ Allow users to order tickets online
- 🖼️ Display galleries from past performances
- 💖 Highlight the supported charity
- 🎉 Showcase sponsors and supporters

## 🔧 Getting Started

- npm install
- npm run dev:frontend
- npm run dev:backend

## Alternative: Use Docker for Development/Production

Simple introduction on how to use and build Dockerfiles locally.

### Installing Docker

You must [install and run Docker](https://docs.docker.com/engine/install/) in the background before creating any Docker containers.

### Starting Docker Container

To start a Docker container, run:

```bash
docker compose -f <PATH TO DOCKER-COMPOSE.YML> --profile <PROFILE NAME> up --build
```

This will (re)build the Docker image and create a new container on watch mode. Watch automatically updates and previews your running Compose services as you edit and save your code.

There are four profiles:

- `test:backend`
- `prod`,which auto-compiles the frontend dist folder for the backend to serve
- `dev:frontend`
- `dev:backend` (TODO)

If you wish to activate Nodemon while running the container, type `w` in the Docker terminal where your container is being run. This will enable watch mode, and will sync changes in the src directory.

NOTE: There is no watch mode for the production build. Meaning you cannot hot-reload Vite nor run Nodemon in Express in the production build.

### Activating shells

If you want to run test suites directly in the running container(s), you can activate a shell on the running container using:

```bash
docker exec -it <CONTAINER NAME> bash
```

Container names can be found in the docker-compose.yml file.

Alternatively you can also manually build the image without cache using:

```bash
docker build --no-cache -t <TAG NAME> -f <PATH TO DOCKERFILE>
```

And run the shell using:

```bash
docker run --rm -it --entrypoint bash <TAG NAME OR ID>
```

### Env Files

Depending on the profile, you might need to reconfigure different .env files, otherwise Docker will not be able to access/link your env variables.

Place the .env files in the same location you would put the .env file. Use `.env.development.local` for development and test profiles, and `.env.production.local` for the production profile.

### Stopping and Removing Docker Container

To stop and remove a Docker container, run:

```bash
docker compose -f <PATH TO DOCKER-COMPOSE.YML> --profile <PROFILE NAME> down
```

### Other notes:

By default, only changes in the src directory are watched. Changes to .env files are not synced, hence you will need to stop the running container and start it up again for these to sync.

There are some benefits to using the Dockerfile. For one, using the dev/test Dockerfile for the backend allows you to use Redis without having to install Redis on your local machine.

Using the `test:backend` profile also allows the Redis server to restart on every test run, meaning that you will always have a clean Redis server to use.

On the other hand, `dev:backend` and `prod` profiles uses two (different!) Redis volumes to persist data even after your container is destroyed. This is different from `test:backend`, which doesn't persist Redis cache. NOTE: Redis data is stored only when docker-compose down is run.
