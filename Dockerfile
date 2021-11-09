FROM node:16-alpine

WORKDIR /usr/be-a-savior/server

COPY *.json ./
COPY *.lock ./

RUN yarn install:ci

COPY . .

RUN yarn test:unit

RUN yarn prepare:test:integration && yarn test:integration -g 'ongs'
