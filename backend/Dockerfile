# FROM node:18-alpine

# WORKDIR /usr/src/app

# COPY package*.json .

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]

FROM ghcr.io/puppeteer/puppeteer:22.12.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["sh", "-c", "npm", "start"]