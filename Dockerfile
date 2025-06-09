# base image for development
FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source for hot-reload
COPY . .

EXPOSE 3000
CMD ["npm", "start"]