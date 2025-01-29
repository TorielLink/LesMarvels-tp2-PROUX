FROM node:lts-bullseye-slim
LABEL authors="toris"

RUN mkdir -p /home/node/app/node_modules
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY src/ ./
CMD node src/server.js

ENTRYPOINT ["top", "-b"]