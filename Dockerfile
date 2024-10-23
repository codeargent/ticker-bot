# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the TypeScript project
RUN npm run build

# Remove devDependencies to reduce the image size
RUN npm prune --production

# Expose the application port
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
