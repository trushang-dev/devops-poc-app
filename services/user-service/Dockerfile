FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install production dependencies first (cache package.json)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Use non-root user provided by the base image
USER node

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
