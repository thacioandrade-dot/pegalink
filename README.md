# PegaLink

Clonador funcional de uma ferramenta de download por link: cole uma URL de **YouTube, TikTok ou Instagram**, escolha MP4 ou MP3 e baixe o arquivo.

Projeto independente: não usa o nome, o logo nem os textos do site de referência.

## Site publicado

- **URL:** https://pegalink.onrender.com
- **Hospedagem:** Render (plano Free)

> No plano Free o serviço dorme após inatividade; a primeira requisição pode demorar ~50 s para acordar.

## Requisitos

- Node.js 18 ou superior (testado no Node 26)
- Nada mais: os binários do `yt-dlp` e do `ffmpeg` são instalados pelo próprio `npm`

## Como rodar

```bash
cd video-downloader
npm install
npm run dev
```

Abra **http://localhost:3000**.

Para rodar sem recarregar ao editar, use `npm start`.

## Como funciona

| Camada | Tecnologia |
| --- | --- |
| Interface | HTML, CSS e JavaScript puro (sem framework) |
| Servidor | Express |
| Extração de links | `yt-dlp` via `youtube-dl-exec` |
| Conversão/união de faixas | `ffmpeg` via `ffmpeg-static` |

Endpoints:

- `GET /api/health` — status do serviço
- `POST /api/info` — recebe `{ url }` e devolve título, miniatura, duração e formatos
- `POST /api/download` — recebe `{ url, quality, name }` e transmite o arquivo em stream

## Limitações reais

- Funciona melhor com **vídeos públicos**. Vídeos privados, apagados, com restrição de idade ou que exigem login podem falhar.
- O Instagram costuma exigir cookies para conteúdos de contas privadas; conteúdo público costuma funcionar.
- Algumas plataformas (principalmente TikTok) bloqueiam IPs de data center/VPN. Se rodar em casa, na sua internet residencial, costuma funcionar; em servidores na nuvem, pode falhar.
- YouTube e TikTok mudam seus sistemas com frequência. Se parar de funcionar, atualize o extrator:

```bash
npm run update:yt
```

- Downloads muito grandes ficam em memória no navegador antes de serem salvos.
- Limite atual: 25 requisições por minuto por IP e no máximo 2 downloads simultâneos.

## Segurança

- Apenas domínios de YouTube, TikTok e Instagram são aceitos (proteção contra SSRF).
- Selectores de formato são fixos no servidor — o cliente não pode enviar comandos livres.
- Nomes de arquivo são sanitizados e os temporários são apagados após o download.
- Sem persistência de dados: nada é salvo em banco.

## Publicar sem conta (túnel Cloudflare)

Quando você só quer testar na internet sem criar conta:

```powershell
$url = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
Invoke-WebRequest $url -OutFile "$env:TEMP\cloudflared.exe"
& "$env:TEMP\cloudflared.exe" tunnel --url http://localhost:3000
```

O terminal mostra uma URL `https://algo.trycloudflare.com`. Ela só funciona enquanto o PC e o `node server.js` estiverem rodando.

## SEO

- Meta tags, Open Graph, Twitter Card e JSON-LD (WebSite + SoftwareApplication + FAQPage) em `public/index.html`.
- `robots.txt` e `sitemap.xml` gerados dinamicamente pelo servidor, usando o host da requisição (funciona atrás do túnel).
- `public/favicon.svg`.

## Anúncios

Os espaços já estão no HTML (`top`, `result` e `footer`), mas **nenhum script é carregado** até você configurar.

Para ativar:

1. Abra `public/ads-config.js`.
2. Mude `enabled` para `true`.
3. Preencha `client` com seu ID do AdSense (`ca-pub-...`) e os três slots.
4. Se usar outra rede, preencha `customHtml` no lugar dos slots.

Redes de anúncios costumam exigir site publicado, conteúdo original e tráfego. Sites de download podem ser rejeitados por política de direitos autorais — verifique os termos da rede antes de solicitar.

## Aviso

Use apenas para conteúdo próprio ou autorizado. Respeite direitos autorais e os termos de uso das plataformas. Este projeto não é afiliado a YouTube, TikTok ou Instagram.
