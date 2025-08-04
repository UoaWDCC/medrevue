Simple introduction on how to use and build Dockerfiles locally.

## Starting Docker Container

To start a Docker container, run:

```bash
docker compose -f <PATH TO DOCKER-COMPOSE.YML> --profile <PROFILE NAME> up --build -w
```

This will (re)build the Docker image and create a new container on watch mode. Watch automatically updates and previews your running Compose services as you edit and save your code.

There is currently only one profile: test, which is for the backend. You can see all profile names in docker-compose.yml.

## Activating shells

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

## Env Files

If using the test profile, you need to configure a .env.development.local file in the backend directory, otherwise the program will not

## Stopping Docker Container

To stop a Docker container, run:

```bash
docker compose -f <PATH TO DOCKER-COMPOSE.YML> --profile <PROFILE NAME> down
```

## Other notes:

By default, only changes in the src directory are watched. Changes to .env files are not synced, hence you will need to stop the running container and start it up again for these to sync.

There are some benefits to using the Dockerfile. For one, using the dev/test Dockerfile for the backend allows you to use Redis without having to install Redis. Using the test Dockerfile also allows the Redis server to restart on every test run, meaning that you will always have a clean Redis server to use. (?)
