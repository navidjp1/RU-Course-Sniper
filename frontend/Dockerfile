
FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /app/react-app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS PRODUCTION_IMAGE

WORKDIR /app/react-app

COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/

EXPOSE 4173

COPY package*.json .
COPY vite.config.js .

RUN npm install

CMD ["npm", "run", "preview"]