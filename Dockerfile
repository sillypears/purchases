FROM node:24-alpine

# Install Python3 and build dependencies for sharp and other native modules
RUN apk add --no-cache python3 py3-pip build-base

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3003

# Start the application
CMD ["npm", "start"]