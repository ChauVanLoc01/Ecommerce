FROM node:18-alpine

EXPOSE 3004

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

CMD [ "yarn", "pro:order" ]