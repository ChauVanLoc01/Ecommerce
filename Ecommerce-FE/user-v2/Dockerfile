FROM node:22-alpine

EXPOSE 3000

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

COPY vite.config.ts .

CMD [ "yarn", "dev" ]