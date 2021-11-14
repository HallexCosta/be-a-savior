FROM node:16-alpine

ARG EXPRESS_LISTEN_APP_PORT
ARG ELEPHANT_API_KEY
ARG STRIPE_SECRET_API_KEY

ENV ELEPHANT_API_KEY=$ELEPHANT_API_KEY
ENV STRIPE_SECRET_API_KEY=$STRIPE_SECRET_API_KEY
ENV EXPRESS_LISTEN_APP_PORT=$EXPRESS_LISTEN_APP_PORT

WORKDIR /usr/be-a-savior/server

ADD *.json ./
ADD *.lock ./

RUN yarn install:ci

ADD . .

RUN yarn build

RUN rm -rf /usr/be-a-savior/server/node_modules

RUN yarn install:ci --production

RUN apk add --no-cache bash

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN bash echo "Hello Bash on Container!!!"

CMD ["yarn", "start"]
