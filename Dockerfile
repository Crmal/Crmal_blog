# Build stage
FROM node:18.17.0 AS builder

WORKDIR /usr/src/app

# Install Nest.js CLI globally
RUN yarn global add @nestjs/cli

COPY package*.json yarn.lock ./
RUN yarn install # Install both production and development dependencies

COPY . .

RUN yarn build

# Production image
FROM node:18.17.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/dist ./dist

ARG DB_HOST 
ARG DB_PORT 
ARG DB_USERNAME 
ARG DB_PASSWORD 
ARG DB_DATABASE 

# Prune development dependencies
RUN yarn install --production

CMD ["node", "dist/main"]