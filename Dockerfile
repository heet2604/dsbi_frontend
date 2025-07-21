# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
