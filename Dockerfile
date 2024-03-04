# Use Node.js LTS version as base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the NestJS application will run on
EXPOSE 3000

# Command to run the NestJS application
# CMD ["npm", "run", "start"]
CMD npm run migration:run && npm run start

