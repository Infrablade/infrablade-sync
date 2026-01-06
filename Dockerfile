# Use lightweight Node image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (for caching)
COPY package.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose the port
EXPOSE 3000

# Start the engine
CMD [ "node", "src/index.js" ]