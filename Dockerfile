FROM node:16-alpine

ARG EXPRESS_LISTEN_APP_PORT
ARG ELEPHANT_API_KEY
ARG STRIPE_SECRET_API_KEY
ARG ENABLE_DEBUG
ARG AUX_DEBUG

ENV ELEPHANT_API_KEY=$ELEPHANT_API_KEY
ENV STRIPE_SECRET_API_KEY=$STRIPE_SECRET_API_KEY
ENV EXPRESS_LISTEN_APP_PORT=$EXPRESS_LISTEN_APP_PORT
ENV ENABLE_DEBUG=$ENABLE_DEBUG
ENV AUX_DEBUG=$AUX_DEBUG

WORKDIR /usr/be-a-savior/server

ADD *.json ./
ADD *.lock ./

# RUN yarn install:ci

ADD . .

RUN rm -rf /usr/be-a-savior/server/node_modules

RUN yarn install:ci --production

RUN yarn build

# for heroku exec
RUN apk add --no-cache bash

# ADD ./.profile.d /usr/be-a-savior/server/.profile.d

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

EXPOSE 3333
EXPOSE 9229

#CMD bash heroku-exec.sh && yarn start
CMD ./start.sh
