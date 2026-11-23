# Deploy gratuito (Render)

Tudo já está preparado: `Dockerfile`, `.npmrc` (libera os scripts do yt-dlp/ffmpeg), `render.yaml` e `.dockerignore`.

## O que você precisa fazer (2 a 3 minutos)

1. Crie uma conta no GitHub: https://github.com/signup
   - Confirme o código que chegará no seu e-mail.
2. Crie uma conta no Render: https://dashboard.render.com/register
   - Use o botão **Continue with GitHub** e autorize o acesso.
3. Me avise aqui no chat. Eu entro no navegador, crio o repositório, subo os arquivos e faço o deploy.

Depois disso a URL será algo como:

```
https://pegalink.onrender.com
```

## Por que Docker

O Render precisa rodar o `yt-dlp` e o `ffmpeg` como processos reais. O `Dockerfile` instala os dois binários no build e usa a imagem `node:20-slim` (Debian), compatível com o `ffmpeg-static`.

## Limitações do plano gratuito

- O serviço **adormece após ~15 minutos sem uso**. A primeira requisição depois disso pode demorar 1–2 minutos.
- O IP é de data center: o **TikTok pode bloquear** (YouTube costuma funcionar).
- Posts privados do Instagram exigem login/cookies e não funcionam.

## Atualizar o extrator depois

Se o YouTube ou TikTok mudarem e o download parar, edite no painel do Render o comando de build ou rode localmente:

```bash
npm run update:yt
```

Em Docker, a forma correta é reconstruir a imagem (o `npm ci` puxa a versão mais recente do `yt-dlp`).
