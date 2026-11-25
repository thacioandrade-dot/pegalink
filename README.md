# PegaLink

Clonador funcional de uma ferramenta de download por link: cole uma URL de **YouTube, TikTok ou Instagram**, escolha MP4 ou MP3 e baixe o arquivo.

Projeto independente: não usa o nome, o logo nem os textos do site de referência.

## Site publicado

- **URL pública:** https://pegalink.xyz
- **Hospedagem:** Render (plano Free), atrás do Cloudflare
- **Privacidade:** WHOIS do domínio privado, origem escondida pelo proxy da Cloudflare, sem cadastro e sem histórico salvo no servidor. O serviço é financiado por anúncios de terceiros; o site envia apenas a origem da página como referrer.

> O endereço `onrender.com` é apenas o destino interno do DNS; o link público é `pegalink.xyz`.

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

Para conferir se todas as plataformas continuam oferecendo melhor qualidade, qualidade inferior e MP3: `node scripts/verify-quality.js`.

Opções de download:

- **YouTube e Instagram:** exatamente quatro botões — **Melhor qualidade** (vídeo + áudio no teto real, superior, sem fallback para versão menor), **HD 720p**, **SD 480p** e **Áudio MP3**. O antigo “Download rápido” foi removido da interface; o ID `fast` continua aceito na API apenas para páginas em cache.
- **Velocidade:** o download é enviado em streaming — o yt-dlp busca o vídeo e escreve na saída padrão, o ffmpeg remuxa para MP4 fragmentado (ou converte para MP3) e o navegador recebe os primeiros bytes segundos após o clique, sem esperar o arquivo inteiro terminar no servidor. Se o streaming falhar antes de qualquer byte, o servidor cai automaticamente para o método antigo com todos os fallbacks de formato.
- **TikTok:** exatamente três botões — **Full HD 1080p** (sempre o melhor arquivo original, sem recompressão), **HD 720p** (versão de alta qualidade porém comprimida, arquivo menor real da plataforma) e **Áudio MP3** (presente em todas as redes). Espelhos CDN (`-0`, `-1`) não viram botões diferentes e os fallbacks nunca caem para `best` genérico.

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

## Segurança

- Nenhum cadastro, e-mail ou histórico salvo; WHOIS privado e origem protegida pela Cloudflare.
- Apenas URLs http(s) de YouTube, TikTok e Instagram, sem usuário/senha ou porta customizada.
- TLS validado nas consultas ao extrator; rate limit por IP real da Cloudflare; limites de corpo e concorrência; CSP, HSTS e headers de defesa.
- Erros não devolvem detalhes internos, e os binários baixados no build são conferidos por SHA256. O container roda como usuário não-root.

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
- `robots.txt`, `sitemap.xml` e `llms.txt` gerados dinamicamente pelo servidor com a base canônica fixa em `https://pegalink.xyz` (defina `SITE_BASE` para testar em túnel).
- 24 guias com conteúdo, passos e FAQ próprios, mais seções exclusivas em `lib/seo-extra.js`.
- Submissão gratuita ao IndexNow: `npm run seo:indexnow` (a chave pública fica em `public/`).
- `public/favicon.svg`.

## Guias publicados

[YouTube](https://pegalink.xyz/youtube) · [TikTok](https://pegalink.xyz/tiktok) · [Instagram](https://pegalink.xyz/instagram) · [MP3](https://pegalink.xyz/mp3) · [Shorts](https://pegalink.xyz/shorts) · [Reels](https://pegalink.xyz/reels) · [Mapa do site](https://pegalink.xyz/mapa-do-site)

## Anúncios

Os espaços estão no HTML (`leaderboard`, `result` e `sidebar`) e são preenchidos por `public/ads.js`.

A configuração ativa fica em `public/ads-config.js`:

- `enabled: true` liga os anúncios; `false` desliga sem precisar mexer no HTML.
- `customHtml` guarda apenas o código público de cada bloco (chave, formato e largura/altura).
- `showPlaceholder` controla se um espaço vazio aparece quando não há anúncio configurado.

Os scripts são inseridos um por um porque a rede usa uma variável global (`atOptions`) para escolher o banner. Não há dados de conta nem informações pessoais nesses arquivos.

Para trocar de rede, substitua o `customHtml` ou preencha `client`/`slots` com os dados da nova rede. Sites de download podem ser rejeitados por política de direitos autorais — verifique os termos da rede antes de solicitar.

## Aviso

Use apenas para conteúdo próprio ou autorizado. Respeite direitos autorais e os termos de uso das plataformas. Este projeto não é afiliado a YouTube, TikTok ou Instagram.
