FROM node:16-alpine

ARG ELEPHANT_API_KEY
ARG STRIPE_SECRET_API_KEY
ARG IN_REMOTE
ARG DOCKER_CONTAINER=true

ENV ELEPHANT_API_KEY=$ELEPHANT_API_KEY
ENV STRIPE_SECRET_API_KEY=$STRIPE_SECRET_API_KEY
ENV DOCKER_CONTAINER=$DOCKER_CONTAINER
ENV IN_REMOTE=$IN_REMOTE

WORKDIR /usr/be-a-savior/server

COPY *.json ./
COPY *.lock ./

RUN yarn install:ci

COPY . .

RUN yarn test:unit

RUN yarn prepare:test:integration && yarn test:integration -g 'ongs'
