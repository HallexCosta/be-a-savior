FROM node:16-alpine

ENV ELEPHANT_API_KEY=${{ secrets.ELEPHANT_API_KEY_TEST }}
ENV STRIPE_SECRET_API_KEY=${{ secrets.STRIPE_SECRET_API_KEY }}

WORKDIR /usr/be-a-savior/server

COPY *.json ./
COPY *.lock ./

RUN yarn install:ci

COPY . .

RUN yarn test:unit

RUN yarn prepare:test:integration && yarn test:integration -g 'ongs'
