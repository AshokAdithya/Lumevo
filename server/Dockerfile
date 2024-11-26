FROM node:16
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install application dependencies
RUN npm install
# Copy application files to the container
COPY . .
# Expose the port on which the application will run
EXPOSE 8080
# Command to start the application
CMD ["npm", "run","start"]