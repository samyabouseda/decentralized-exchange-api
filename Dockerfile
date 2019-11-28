FROM node:12-alpine

# Create app directory
WORKDIR /app/src

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 80

# Start application
CMD [ "npm", "start" ]