FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Set environment variables from nodemon.json values
ENV NODE_ENV=development \
    PORT=3000 \
    MONGODB_CONN_STR=mongodb://host.docker.internal:27017/mean_demo \
    JWT_KEY=secret_passspharse

EXPOSE 3000

CMD ["npm", "start"]