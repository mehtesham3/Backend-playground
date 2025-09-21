# 1. Base image
FROM node:18

# 2. Set working directory inside container
WORKDIR /usr/src/app

# 3. Copy package files and install deps (leveraging cache)
COPY package*.json ./

# Install dependencies (all, since you’re in dev mode)
RUN npm install

# 4. Copy application source
COPY . .

# 5. Expose port
EXPOSE 5000

# 6. Run the app
CMD ["node", "index.js"]
