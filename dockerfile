FROM node:20
WORKDIR /usr/workspace/node-api-ts
RUN npm install --omit=dev
