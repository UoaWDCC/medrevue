# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY yarn.lock package.json ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/backend/package.json packages/backend/
# Install dev dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY packages/ packages/

# Build application
RUN yarn build

# Prune dev dependencies to reduce final image size
RUN yarn install --frozen-lockfile --production=true


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# # Print the final image file structure
# RUN apt-get update -qq && \
#     apt-get install tree
# RUN tree -I "node_modules"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
