FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 10000
ENV NODE_ENV=production
CMD ["node","dist/server.js"] 