FROM node:18.17.0-alpine AS INSTALLER

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn global add @nestjs/cli

COPY . .
RUN yarn --prod
RUN yarn add @types/node -D
RUN yarn build

FROM node:18.17.0-alpine

WORKDIR /usr/src/app

COPY --from=INSTALLER /usr/src/app .

ARG DB_HOST 
ARG DB_PORT 
ARG DB_USERNAME 
ARG DB_PASSWORD 
ARG DB_DATABASE 

CMD ["node", "dist/main.js"]
EXPOSE ${CONTAINER_PORT}