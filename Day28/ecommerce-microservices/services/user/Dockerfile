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

COPY Knexfile.js ./Knexfile.js

# Expose the app port
EXPOSE 3000

# Run migrations before starting
CMD ["sh", "-c", "npx knex migrate:latest --knexfile Knexfile.js && npm run start"]
