FROM node:24.4-slim AS base

FROM base AS frontend-deps
WORKDIR /app
#we need to copy root dir's package.json as it contains the package name medrevue (otherwise installing types will not work.) 
COPY package.json package-lock.json /app/
COPY .husky /app/.husky
COPY .github /app/.git
COPY ./packages/frontend /app/packages/frontend
COPY ./packages/types /app/packages/types
RUN npm ci

FROM base AS backend-deps
WORKDIR /app
#we need to copy root dir's package.json as it contains the package name medrevue (otherwise installing types will not work.) 
COPY package.json package-lock.json /app/
COPY .husky /app/.husky
COPY .github /app/.git
COPY ./packages/backend /app/packages/backend
COPY ./packages/types /app/packages/types
RUN npm ci
# #TODO: fix issue where running npm ci in root directory does not install in packages/backend 
#TODO: seemed to have fixed it now, but still requires some testing
# WORKDIR /app/packages/backend
# RUN npm install
#this installs into the root dir's node_modules

FROM backend-deps AS backend-dev
# #specify the env variable for development 
COPY --from=backend-deps . .
ENV NODE_ENV=development
ENV PORT=3000

CMD ["npm", "run", "dev:backend"]

FROM base AS fullstack-deps
WORKDIR /app
COPY package.json package-lock.json /app/
COPY .husky /app/.husky
COPY .github /app/.git
COPY ./packages /app/packages
RUN npm ci

FROM fullstack-deps AS frontend-build
COPY --from=fullstack-deps . . 
WORKDIR /app
COPY --from=fullstack-deps /app/packages/frontend/node_modules ./node_modules
COPY --from=fullstack-deps /app/packages/frontend .
RUN npm run build

FROM frontend-deps AS frontend-dev
COPY --from=frontend-build . .
ENV NODE_ENV=development
ENV PORT=5173

CMD ["npm", "run", "dev:frontend"]

FROM fullstack-deps AS backend-build
ENV NODE_ENV="production"
WORKDIR /app/packages/backend
RUN npm run build

FROM base AS fullstack-prod
COPY --from=backend-build /app/packages/backend/dist .
COPY --from=frontend-build /app/dist ./frontend-dist
COPY --from=backend-build /app/node_modules ./node_modules
ENV NODE_ENV="production"
ENV DOCKER_USE="true" 
CMD ["node", "index.js"]



