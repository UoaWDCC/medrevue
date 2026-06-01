# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

# Install the workspace dependencies needed to build the Vite frontend.
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/types/package.json packages/types/
RUN npm ci --include=dev

COPY packages/frontend packages/frontend
COPY packages/types packages/types
RUN npm run build --workspace @medrevue/frontend

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 3000
