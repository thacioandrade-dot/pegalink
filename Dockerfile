FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 10000
CMD ["node", "server.js"]
