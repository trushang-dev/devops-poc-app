FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

ENV PORT=3003
EXPOSE 3003

CMD ["npm", "start"]
