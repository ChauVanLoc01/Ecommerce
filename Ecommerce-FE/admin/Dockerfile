FROM node:18-alpine

EXPOSE 4001

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

CMD [ "yarn", "dev" ]