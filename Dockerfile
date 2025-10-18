# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files (including nodemon.json)
COPY . .

# Set environment variables from nodemon.json values
ENV NODE_ENV=development \
    PORT=3000 \
    MONGODB_CONN_STR=mongodb://host.docker.internal:27017/mean_demo \
    JWT_KEY=secret_passspharse

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]