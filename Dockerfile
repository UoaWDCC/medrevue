# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV="production"

FROM base AS build

COPY package-lock.json package.json ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/backend/package.json packages/backend/
COPY packages/types/package.json packages/types/

RUN npm ci --include=dev

COPY packages/ packages/

RUN npm run build
RUN npm prune --omit=dev

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "start"]
