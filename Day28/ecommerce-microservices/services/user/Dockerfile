# Use Node.js as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

COPY Knexfile.js ./knexfile.js

# Expose the app port
EXPOSE 3000

RUN apk add --no-cache bash
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Run migrations before starting
CMD ["sh", "-c", "./wait-for-it.sh postgres:5432 -- npx knex migrate:latest --knexfile knexfile.js && npm run start"]
