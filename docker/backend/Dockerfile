FROM node:24.4-slim AS backend-base

FROM backend-base AS backend-dev
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

# #specify the env variable for development 
ENV NODE_ENV=development
ENV PORT=3000

CMD ["npm", "run", "dev:backend"]
 


