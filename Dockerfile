FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
ENV YOUTUBE_PROXY=socks5h://127.0.0.1:1080

RUN apt-get update && apt-get install -y --no-install-recommends python3 ca-certificates curl tar && rm -rf /var/lib/apt/lists/*

# Cloudflare WARP em modo userspace: troca o IP de datacenter do Render para um IP
# que o YouTube não costuma bloquear. Nenhum privilégio de rede é necessário.
RUN curl -fsSL -o /usr/local/bin/wgcf https://github.com/ViRb3/wgcf/releases/download/v2.3.1/wgcf_2.3.1_linux_amd64 \
 && chmod +x /usr/local/bin/wgcf \
 && (cd /opt && wgcf register --accept-tos && wgcf generate && printf '\n[Socks5]\nBindAddress = 127.0.0.1:1080\n' >> /opt/wgcf-profile.conf || echo 'WARP não configurado neste build' > /opt/warp-failed.txt) \
 && curl -fsSL -o /tmp/wireproxy.tar.gz https://github.com/windtf/wireproxy/releases/download/v1.1.3/wireproxy_linux_amd64.tar.gz \
 && tar -xzf /tmp/wireproxy.tar.gz -C /tmp wireproxy \
 && mv /tmp/wireproxy /usr/local/bin/wireproxy \
 && chmod +x /usr/local/bin/wireproxy \
 && rm -f /tmp/wireproxy.tar.gz

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 10000
CMD ["sh", "-c", "wireproxy -c /opt/wgcf-profile.conf >/tmp/wireproxy.log 2>&1 & sleep 2; node server.js"]
