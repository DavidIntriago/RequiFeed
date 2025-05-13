FROM node:22.13-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . . 

EXPOSE 4000

CMD [ "npm", "start"]