FROM node:20
WORKDIR /usr/workspace/node-api-ts
COPY ./package.json .
RUN npm install --omit=dev
