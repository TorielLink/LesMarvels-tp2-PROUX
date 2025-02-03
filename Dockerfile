FROM node:lts-bullseye-slim AS build
LABEL authors="toris"

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

FROM node:lts-bullseye-slim

WORKDIR /home/node/app

COPY --from=build /home/node/app/node_modules ./node_modules
COPY src/ ./src

USER node  # Sécurisation en exécutant avec un utilisateur non-root

CMD ["node", "src/server.js"]