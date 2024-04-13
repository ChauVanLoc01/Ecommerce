FROM node:18-alpine

EXPOSE 3001

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn prisma generate

CMD [ "yarn", "user" ]