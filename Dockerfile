FROM node:16-alpine

ARG ELEPHANT_API_KEY
ARG STRIPE_SECRET_API_KEY

ENV ELEPHANT_API_KEY=$ELEPHANT_API_KEY
ENV STRIPE_SECRET_API_KEY=$STRIPE_SECRET_API_KEY

WORKDIR /usr/be-a-savior/server

COPY *.json ./
COPY *.lock ./

RUN yarn install:ci

COPY . .

RUN yarn test:unit

RUN yarn prepare:test:integration && yarn test:integration -g 'ongs'
