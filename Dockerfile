FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
ENV YOUTUBE_PROXY=socks5h://127.0.0.1:1080

RUN apt-get update && apt-get install -y --no-install-recommends python3 ca-certificates curl tar && rm -rf /var/lib/apt/lists/*

# Cloudflare WARP em modo userspace: troca o IP de datacenter do Render para um IP
# que o YouTube não costuma bloquear. Nenhum privilégio de rede é necessário.
# Os hashes vêm dos assets oficiais das releases e impedem troca dos binários.
RUN curl -fsSL -o /usr/local/bin/wgcf https://github.com/ViRb3/wgcf/releases/download/v2.3.1/wgcf_2.3.1_linux_amd64 \
  && echo '4fb7a136aa470ece11d17949c7db07b040ec9c604742dc8680bcf1889f85d0c8  /usr/local/bin/wgcf' | sha256sum -c - \
  && chmod +x /usr/local/bin/wgcf \
  && (cd /opt && wgcf register --accept-tos >/dev/null && wgcf generate >/dev/null && printf '\n[Socks5]\nBindAddress = 127.0.0.1:1080\n' >> /opt/wgcf-profile.conf || echo 'WARP não configurado neste build' > /opt/warp-failed.txt) \
  && chmod 600 /opt/wgcf-profile.conf 2>/dev/null || true \
  && rm -f /opt/wgcf-account.toml /usr/local/bin/wgcf \
  && curl -fsSL -o /tmp/wireproxy.tar.gz https://github.com/windtf/wireproxy/releases/download/v1.1.3/wireproxy_linux_amd64.tar.gz \
  && echo 'e88c1d090740373fc606c1bafd81d9a5eadc642cce5667616e20e9d7a444f51c  /tmp/wireproxy.tar.gz' | sha256sum -c - \
  && tar -xzf /tmp/wireproxy.tar.gz -C /tmp wireproxy \
  && mv /tmp/wireproxy /usr/local/bin/wireproxy \
  && chmod +x /usr/local/bin/wireproxy \
  && rm -f /tmp/wireproxy.tar.gz

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

# O serviço não precisa de root: downloads usam /tmp e a porta é alta.
RUN useradd --create-home --shell /bin/sh appuser \
  && chown -R appuser:appuser /app /opt
USER appuser

EXPOSE 10000
CMD ["sh", "-c", "wireproxy -c /opt/wgcf-profile.conf >/tmp/wireproxy.log 2>&1 & sleep 2; node server.js"]
