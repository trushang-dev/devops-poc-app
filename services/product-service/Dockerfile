FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

ENV PORT=3002
EXPOSE 3002

CMD ["npm", "start"]
