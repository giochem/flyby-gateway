# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN mkdir -p /usr/src/app
    
WORKDIR /usr/src/app

COPY ["package.json", "./"]

RUN npm install --force

COPY . .

EXPOSE 4000


CMD [ "npm", "run", "start" ]   