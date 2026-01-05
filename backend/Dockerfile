FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p uploads data

EXPOSE 15021

CMD ["node", "server.js"]