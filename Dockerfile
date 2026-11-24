FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends python3 ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 10000
CMD ["node", "server.js"]
