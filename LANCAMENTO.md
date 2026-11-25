# Checklist de lançamento — PegaLink

**Auditoria de segurança (25/11/2026):** nenhum crítico encontrado. Corrigido: rate limit passou a usar `CF-Connecting-IP` (com `trust proxy` e `Retry-After`) em vez do IP compartilhado do proxy; CSP adicionada com allowlist de anúncios e `frame-ancestors 'self'`; `dotfiles: 'deny'` no estático; erros 500 sem mensagem/stack e erros de download sem `detail` (URLs/proxy/caminhos ficam só no log); certificados TLS do yt-dlp validados por padrão (exceção explícita via `ALLOW_INVALID_CERTIFICATES=1`); IDs de qualidade restritos à lista do vídeo/IDs fixos, com regex que não aceita ID começando por hífen; processos yt-dlp/ffmpeg mortos em grupo para não deixar filhos órfãos; Dockerfile com hashes SHA256 dos binários baixados, usuário não-root e remoção do binário/chave temporária do WARP após gerar a config. `npm audit --omit=dev`: 0 vulnerabilidades. Nenhum segredo, token ou e-mail real no repositório (o IndexNow e os IDs de anúncio são públicos por design).

**Conteúdo e descoberta (25/11/2026):** todos os 24 guias passaram a ter seção exclusiva (`lib/seo-extra.js`), com textos únicos por intenção de busca e 142–195 palavras por página; JSON-LD e H1 continuam válidos e únicos. `llms.txt` dinâmico publicado para descoberta por assistentes. README passou a linkar os guias principais (menção pública no repositório, sem dados pessoais). `lastmod` usa o fuso de Brasília. IndexNow reenviado com HTTP 200 para as 25 URLs. O painel do GSC insiste em “Não foi possível buscar o sitemap”, mas o teste em tempo real do próprio `/sitemap.xml` responde “O URL está disponível para o Google”; a descoberta está garantida pelas solicitações diretas de indexação e pelo IndexNow. Deploys `a138123` / `dep-dc354mom7kps73d70pgg`, cache purgado.

**Texto dos botões e revisão SEO (25/11/2026):** removidos os complementos “com arquivo moderado” (HD 720p) e “bom equilíbrio entre qualidade e tamanho” (SD 480p). No ar: `Alta definição (720×1280 · HD 720p)` e `Definição padrão (480×854 · SD 480p)`. Auditoria SEO corrigiu o canonical `localhost` servido cru em `/index.html` (agora 301 → `/`), fixou a base canônica em `https://pegalink.xyz` mesmo se a requisição vier de `onrender.com`/`www`, trocou o link antigo do Render no FAQ do `/mapa-do-site`, eliminou H1 duplicado entre `/instagram` e `/instagram-video`, ampliou descrições curtas de `/shorts` e `/reels`, tornou `lastmod`/`dateModified` dinâmicos por deploy e completou `twitter:image:alt`, `article:modified_time` e preload do CSS. 24 páginas com H1/títulos/slugs únicos e JSON-LD válido. Deploy `78d24d6` / `dep-dc34kp7lot8c739264dg`. Submissão gratuita via IndexNow (`b829bd7` / `dep-dc34p0qfngtc73ctl5sg`): chave pública em `/980e1c2e32a94409977757210e377460.txt`, 25 URLs aceitas com HTTP 202. GSC: URL inicial indexada, `/youtube` liberado para indexação no teste em tempo real; sitemap enviado (o painel ainda exibe “Não foi possível buscar o sitemap”, sem afetar as páginas), indexação solicitada para `/`, `/youtube`, `/tiktok`, `/instagram`, `/mp3` e `/shorts`. Nenhum dado pessoal publicado; DNS e domínio intactos.

**Trava final da ordem dos botões (25/11/2026):** persistência do relato de que 720p saía maior que o principal levou a duas mudanças. (1) O tamanho estimado agora prefere `filesize`/`filesize_approx` conhecidos e desconta 45% da largura de banda anunciada por playlists m3u8 (no teste, 5718 kb/s anunciados viraram ~3080 kb/s reais), evitando que um 1080p inflado ganhe a disputa e depois entregue menos bytes. (2) HD 720p e SD 480p passaram a escolher a **menor opção real** da resolução que ainda fica acima da faixa inferior e abaixo do principal, em vez da maior — o que eliminou a inversão. O `/api/download` também reutiliza a lista de formatos do `/api/info` para usar sempre o ID exato vigente. Deploy `1c4d623` / `dep-dc34777lot8c7390oang` e `898c8ee` / `dep-dc34a0m8bjmc73eh2ejg`, cache purgado. Validação final no Short `rgTKDJnZVSM`: principal **18.493.777 bytes / 1080×1920**, HD 720p **5.511.909 bytes / 720×1280**, SD 480p **3.288.908 bytes / 480×854** e MP3 com cabeçalho `ID3` (1.146.044 bytes). `verify-quality.js` aprovado.

**Ordem por tamanho real (25/11/2026):** o proprietário relatou que o botão HD 720p baixava um arquivo mais pesado que o “Melhor qualidade”. A causa era dupla: o botão principal escolhia pelo maior lado da imagem (uma resolução maior comprimida pode ser menor em bytes) e os IDs antigos `best`/`fast` e `720p` ainda tinham fallback para `best`. Agora o botão principal escolhe o formato com o **maior tamanho estimado** (`tbr × duração`), e 720p/480p escolhem o maior arquivo **abaixo** dele, com fallbacks limitados por itag/resolução, sem `best` genérico. IDs em cache (`best`/`fast`) são convertidos no servidor para o ID exato do maior arquivo. A marca “PegaLink” no topo agora recarrega a página (`location.reload()`) na home e nas páginas SEO; os assets passaram para `?v=20261125g`. Deploy `b285d9a` / `dep-dc33v2jrjlhs73elrcu0`, cache purgado. Validação no ar no Short `rgTKDJnZVSM`: Melhor qualidade **18.493.777 bytes / 1080×1920**, HD 720p **5.511.909 bytes / 720×1280**, SD 480p **3.288.908 bytes / 480×854**, ID legado `best` **17.849.654 bytes / 1080×1920**. Recarga pela marca conferida na home (geração 3 → 4) e em `/youtube` (2 → 3). `node scripts/verify-quality.js` aprovado, inclusive com um vídeo fictício onde 720p tem bitrate maior que 1080p.

**Painel final (25/11/2026):** a pedido do proprietário, YouTube e Instagram agora mostram **exatamente quatro botões**, nesta ordem: **Melhor qualidade**, **HD 720p**, **SD 480p** e **Áudio MP3**. O botão “Download rápido” foi retirado da interface e a opção SD 360p foi substituída por SD 480p. “Melhor qualidade” continua no teto superior (`bestvideo+bestaudio`, sem fallback para arquivo menor) e agora exibe a resolução real no texto do botão — importante para Shorts, que são verticais e parecem estreitos mesmo em Full HD. Teste ao vivo com o Short `rgTKDJnZVSM`: “Melhor qualidade” entregou **1080×1920**, MP4 fragmentado, 17.849.654 bytes, com `x-transfer: stream`. O seletor genérico por altura entregava 240×426 no botão 480p de Shorts, então 720p/480p passaram a apontar para o **ID exato do formato** (`vid-<id>` + `bestaudio`), com fallback horizontal/vertical; validado no ar: **720×1280** (5.511.909 bytes) e **480×854** (3.288.908 bytes). Os textos de SEO e o README foram atualizados para as mesmas quatro opções. O ID antigo `fast`, enviado por páginas em cache, foi remapeado para o teto real (`bestvideo+bestaudio`) e, no teste ao vivo, entregou 1080×1920 em vez do arquivo pequeno anterior. “Melhor qualidade” também passou a usar o ID exato do maior formato (`top-<id>` + `bestaudio`, com fallback no teto), validado com 1080×1920 e 18.493.777 bytes no ar. A interface ao vivo confirmou exatamente quatro botões: `top-616`, `vid-136`, `vid-135` e `audio`. Depois o proprietário relatou que o botão 720p estava entregando qualidade maior que a do “Melhor qualidade”: a causa era a cadeia de fallback de `vid-`/`vida-`, que terminava em `bestaudio/best` e podia cair para `best` (teto) quando o formato exato falhava. Os fallbacks passaram a ser limitados por itag (136 = 720p, 135 = 480p etc.), com seletores `height<=`/`width<=` correspondentes, sem `best` genérico. Validação no ar após a correção: 720p entregou **720×1280** (5.511.909 bytes) e “Melhor qualidade” **1080×1920** (17.849.654 bytes).

**Privacidade reforçada (24/11/2026):** WHOIS do registrante oculto no RDAP (só aparece o registrador), transferência bloqueada, DNS autoritativo da Cloudflare devolvendo apenas IPs `172.67.222.14` / `104.21.25.28` (origem Render escondida), `X-Powered-By` desligado e headers `Referrer-Policy: strict-origin-when-cross-origin` (envia só a origem aos anúncios), `X-Frame-Options`, `Permissions-Policy` e `COOP`. Dados pessoais removidos dos arquivos publicados e do histórico do Git (commit reescrito e enviado). O repositório ainda aparece com o nome da conta no GitHub; para escondê-lo completamente seria preciso torná-lo privado ou transferi-lo, o que exige login no GitHub — não feito aqui para não correr risco de quebrar o deploy do Render.

**Qualidade verificada (24/11/2026):** `node scripts/verify-quality.js` aprovou YouTube, TikTok e Instagram. No YouTube real, `1080p` baixou `1920x1080` com áudio (80,5 MB), `360p` baixou `640x360` com áudio (11,9 MB) e MP3 baixou a 264 kb/s. O seletor corrigido usa altura para paisagem e largura para retrato — antes, `1080p` podia entregar 480p. “Melhor qualidade” também foi corrigido: antes preferia AVC/MP4 e parava em 1080p mesmo quando havia 4K; agora começa por `bestvideo+bestaudio` e entregou 3840x2160 no teste. TikTok/Instagram não puderam ser testados ao vivo daqui porque a plataforma bloqueia o IP local; no Render a API mobile do TikTok (`tiktok:app_info`) passou a funcionar e o teste ao vivo em `https://pegalink.xyz` confirmou downloads reais e distintos: Full HD 1080×1920 (HEVC, 809 kb/s, 15,2 MB), HD 720p 720×1280 (HEVC, 504 kb/s, 9,5 MB) e MP3 128 kb/s (2,4 MB). O TikTok agora mostra apenas três botões — **Full HD 1080p** (arquivo original sem marca d'água), **HD 720p** (arquivo menor real da plataforma) e **Áudio MP3**. O botão duplicado "Melhor qualidade" foi removido porque entregava exatamente o mesmo arquivo do Full HD. A recompressão no servidor também foi descartada: estourava a memória do Render Free e passava do limite de 100 s da Cloudflare. Espelhos CDN do mesmo formato (IDs `-0`, `-1`) não são mais tratados como qualidade diferente, e o seletor prefere H.264 quando disponível.

**Status atual (24/11/2026):** site no ar em **`https://pegalink.xyz`** (e `www.pegalink.xyz`), com monetização via **Adsterra ativa** (site aprovado, categoria Downloads, três blocos `leaderboard`, `result` e `sidebar` com código público configurado em `public/ads-config.js`). Domínio comprado via Hostinger com Pix (R$ 8,08), registrado e ativo até 24/11/2027; WHOIS privado e bloqueio de transferência ativos. Verificação de contato da ICANN pendente no e-mail até 08/12/2026. Cloudflare na conta do proprietário: zona `pegalink.xyz` no plano Free, CNAMEs `@` e `www` para `pegalink.onrender.com` com proxy laranja, Always Use HTTPS, HSTS 12 meses com `includeSubDomains` e `nosniff`, TLS mínimo 1.2, Bot Fight Mode e WAF gerenciado ativos, modo SSL **Full (Strict)**. Nameservers da Hostinger trocados para `aria.ns.cloudflare.com` / `sevki.ns.cloudflare.com`; a propagação terminou: resolvedores públicos (8.8.8.8, 1.1.1.1, 9.9.9.9) já devolvem os nameservers e os IPs da Cloudflare. `https://pegalink.xyz/api/health` responde JSON com `ok: true`, canonical/og:url/sitemap/robots usam `pegalink.xyz`, e o arquivo de verificação do Google responde corretamente. O `onrender.com` aparece apenas como destino interno do DNS — o endereço público é `pegalink.xyz`. Propriedade `https://pegalink.xyz/` criada e verificada no GSC, sitemap `sitemap.xml` enviado. O pedido de indexação da homepage foi feito; o Google ainda não a indexou e a cota pode limitar novas solicitações. O lembrete automático continua ativo para acompanhar.

**Performance (24/11/2026):** deploy `56e575e` publicou os anúncios e o deploy `e552b3c` adiantou a conexão com o domínio dos anúncios (`preconnect`/`dns-prefetch` na homepage e nas páginas SEO). Na Cloudflare foi criada a Cache Rule ativa **“Cache HTML and SEO pages (edge 2h)”**: aplica a `GET` cujo caminho não começa com `/api`, marca a resposta como elegível, usa Edge TTL fixo de **2 horas**, respeita o TTL do navegador e ignora a query string na chave de cache. Isso faz o HTML e as páginas SEO saírem da borda (`cf-cache-status: HIT`, TTFB ~0,13 s com Brotli) em vez de acordar o Render Free a cada visita; `/api/health` continua `no-store` e `DYNAMIC`. O cache foi invalidado depois do último deploy para servir o HTML novo. Antes da regra o HTML era `DYNAMIC`.

**Download na máxima qualidade e velocidade (24/11/2026):** o botão superior do TikTok deixou de usar um seletor genérico que podia cair para `best` e passou a apontar para o **ID exato do arquivo original** devolvido pelo `/api/info` (`orig-<format_id>`), sem recompressão e sem marca d'água. Espelhos CDN (`-0`, `-1`) continuam apenas como fallback da mesma qualidade, nunca como botão separado. A pedido final do proprietário, o TikTok passou a ter **exatamente três botões**, nesta ordem: **Full HD 1080p** (`orig-*`, sempre o melhor arquivo real, sem recompressão), **HD 720p** (`fmt-*`, alta qualidade porém comprimida/arquivo menor real da plataforma) e **Áudio MP3** (`audio`). O MP3 voltou a existir em **todas** as redes (YouTube, TikTok e Instagram). O botão duplicado apontando para o mesmo arquivo 1080p foi eliminado. Espelhos CDN e fallbacks genéricos continuam fora desses botões. A pedido final, YouTube e Instagram foram reduzidos a exatamente **quatro botões**: **Melhor qualidade**, **HD 720p**, **SD 360p** e **Áudio MP3**. Depois o proprietário pediu a opção rápida de volta, ao lado da melhor: YouTube e Instagram passaram a ter **Melhor qualidade**, **Download rápido**, **HD 720p**, **SD 360p** e **Áudio MP3**. O “Download rápido” usa um MP4 progressivo com áudio junto e o arquivo começa a chegar antes. Crítico: o fallback genérico `best` do botão **Melhor qualidade** foi removido — antes, se a união das faixas falhasse, ele podia entregar um MP4 progressivo fraco sem avisar; agora ele só tenta `bestvideo+bestaudio` e, como alternativa, AVC/MP4 no teto, mantendo a resolução máxima real (confirmado ao vivo novamente após a correção: 3840×2160, 243.743.156 bytes; HD 720p em 1280×720 e SD 360p em 640×360). O navegador também guarda em memória o resultado da última busca (até 20 URLs), então repetir a mesma URL não espera uma nova chamada ao servidor. Nas tags de busca foram adicionadas as variações e erros de digitação pedidos (`download instagram video`, `downloat instagram video`, `instagram downoad`, `youtube downoad`, `youtube downlod`, `downloat tiktok video`, `tiktok downoad`, `dowload video`, `donwload video` etc.) na homepage, no JSON-LD e nas 24 páginas SEO. `node scripts/verify-quality.js` aprovou todas as plataformas após a mudança. Deploy `0ba8ff8` publicado com sucesso (`dep-dc2v2th5efls738upps0`) e cache da Cloudflare invalidado: no teste ao vivo em `https://pegalink.xyz`, o botão superior do TikTok (`orig-bytevc1_1080p_808907-0`) entregou **1080×1920** com 15.191.484 bytes e o botão HD entregou **720×1280** com 9.466.846 bytes; “Download rápido” do YouTube entregou um MP4 progressivo de 640×360 com 11.829.048 bytes. HTML e páginas SEO voltaram a `cf-cache-status: HIT` depois da invalidação, `/api/health` segue `DYNAMIC`/`no-store`, os 3 anúncios seguem carregando e o console não mostrou erros.

**Correção de indexação (24/11/2026):** o Google não estava encontrando `pegalink.xyz` porque a borda da Cloudflare ainda servia um `robots.txt` antigo de um deploy anterior, com `Disallow: /`, enquanto a origem já respondia `Allow: /`. O cache foi invalidado e o `robots.txt` ao vivo voltou a anunciar `Allow: /`, `Disallow: /api/` e `Sitemap: https://pegalink.xyz/sitemap.xml`. No GSC, o teste em tempo real confirmou “O URL está disponível para o Google” e “É possível indexar a página”, e a indexação da homepage foi solicitada novamente. O sitemap também foi reenviado para a propriedade `https://pegalink.xyz/` (o envio antigo estava no domínio `onrender.com` e o Google reportava “Não foi possível buscar o sitemap”). Deploy `925c9b6` publicado com sucesso (`dep-dc2vlrbm8hqs73ag9e40`) e cache invalidado depois dele: no ar, o TikTok mostra exatamente **Full HD 1080p**, **HD 720p** e **Áudio MP3**, o MP3 baixou 2.402.472 bytes com `Content-Type: audio/mpeg`, os três anúncios continuam carregando e o console não tem erros. O YouTube segue entregando 4K real no “Melhor qualidade” (teste anterior: 3840×2160).

## Regras até o lançamento com domínio próprio

- Anúncios da Adsterra ativados em 24/11/2026 com autorização do proprietário; para desligar, basta `enabled: false` em `public/ads-config.js`.
- Não divulgar o link de teste como endereço final.
- Ao fazer `git push origin main`, conferir se o Render iniciou o deploy: o auto-deploy não disparou no push de `03038c0`, foi necessário deploy manual pelo dashboard.

Todos os commits até `03038c0` foram enviados ao GitHub e estão no ar.

Validação local (Lighthouse em `http://localhost:3100/`): SEO 100, Acessibilidade 100, Boas Práticas 100, sem falhas.
Validação no ar após deploy manual: `/mapa-do-site` com `ItemList`, sitemap com 25 URLs e arquivo de verificação do Google OK.

Correção aplicada e publicada em 24/11/2026 (deploy `dcb8042`): a homepage estava com `canonical`, `og:url` e JSON-LD apontando para `http://localhost:3000` no HTML bruto. `server.js` agora substitui isso pela URL pública da requisição antes de servir o HTML. Verificado no ar: canonical `https://pegalink.onrender.com/`.

Reforço de conteúdo no mesmo deploy: seções exclusivas “Sobre” nas páginas YouTube, TikTok, Instagram, MP3, MP4 e Shorts.

Sitemap reenviado ao GSC após o deploy: processado, 25 páginas encontradas.

Monitoramento: lembrete para pedir indexação em 25/11 às 10h e verificação diária às 9h que só avisa quando o Google indexar.

Acessos: como o Render Free não oferece Request logs, `server.js` registra cada visita às páginas HTML em `[acesso] data hora caminho status` nos Application logs. Chamadas `/api/`, arquivos estáticos e a página de verificação do Google não são registrados. Verificado no ar no deploy `1819c41`: os acessos a `/` e `/mapa-do-site` apareceram nos logs.

Auditoria no ar (Lighthouse): SEO 100, Acessibilidade 100, Boas Práticas 100, sem falhas.
Qualidade das 24 páginas SEO: títulos únicos, nenhuma falha de renderização.

Site ainda não indexado em 24/11/2026: GSC mostra “O URL não está no Google”, mas o teste em tempo real confirmou “O URL está disponível para o Google” e “É possível indexar a página”. A cota de “Solicitar indexação” continua excedida. Lembrete automático criado para 25/11 às 10h (America/Sao_Paulo).

## 1. Domínio

Domínio registrado: **`pegalink.xyz`** na **Hostinger Brasil**, 1º ano por R$ 8,08 (R$ 6,99 + R$ 1,09 de ICANN), pago com Pix. **WHOIS privado grátis ativo** e **bloqueio de transferência ativo**. Renovação: R$ 103,99/ano + ICANN. A Spaceship foi descartada porque não aceita Pix e o cupom `XYZ52` foi bloqueado como falso positivo de VPN no navegador automatizado.

Nome esperado: `pegalink.xyz`.

No checkout, a taxa ICANN de US$ 0,20 pode ser adicionada, e o WHOIS privado deve aparecer como US$ 0,00.

Opções pesquisadas em 23/11/2026:

| Registrador | 1º ano | Renovação | Observação |
|---|---:|---:|---|
| Spaceship | US$ 0,95 com cupom `XYZ52` | US$ 13,97/ano | Descartada: não aceita Pix e cupom bloqueado |
| Porkbun | US$ 1,29 | US$ 14,21/ano | WHOIS privado gratuito |
| PublicDomainRegistry | US$ 8,00 | US$ 8,00/ano | Melhor custo fixo a longo prazo |
| Cloudflare | US$ 13,50 | US$ 13,50/ano | Exige usar DNS da Cloudflare |

DNS/Render para o domínio final concluídos: `pegalink.xyz` e `www.pegalink.xyz` cadastrados como domínios customizados no Render; `www` redireciona para o apex. A propagação terminou e o site responde no domínio final pela Cloudflare.

Cloudflare (configurada em 24/11/2026): `server.js` envia `Cache-Control` com `s-maxage=86400` e `CDN-Cache-Control` em páginas, sitemap, robots **e arquivos estáticos**; `/api/health` fica `no-store`; HSTS é enviado quando a requisição chega por HTTPS. A automação de keep-alive dá ping periodicamente para o Render não dormir (identificador interno omitido deste registro público). Deploy `bfd8610` publicou: cache de `/api/info` por 10 minutos (`X-Cache: HIT/MISS`), opções HD 1080p/720p e SD 480p/360p, `preload` do CSS e `defer` no JS. Na Cloudflare: DNS com proxy laranja, SSL Full (Strict), Always Use HTTPS, HSTS 12 meses, TLS 1.2+, Bot Fight Mode, WAF gerenciado e DDoS sempre ativos. Velocidade: Always Online, Crawler Hints, Early Hints, Speed Brain, HTTP/2, HTTP/2 para origem e HTTP/3 ativos; Rocket Loader e 0-RTT desligados de propósito. **Não** ativar “I’m Under Attack Mode” — quebra downloads/API. Propagação concluída, HTTPS/canonical testados no domínio final, propriedade `https://pegalink.xyz/` criada e verificada no GSC e sitemap enviado.

## 2. Adsterra

Conta Adsterra: **criada pelo proprietário**.

Ao solicitar aprovação, usar a URL final `https://pegalink.xyz/` (não o link de teste).

Site aprovado na categoria Downloads e três unidades ativas. O proprietário autorizou a ativação em 24/11/2026; apenas o código público dos blocos foi colado no site (sem dados da conta).

## 3. Google Search Console

Propriedade `https://pegalink.onrender.com/` **verificada** em 24/11/2026 pelo arquivo HTML `public/google1b603134014a71d3.html` (não remover).

Sitemap `https://pegalink.onrender.com/sitemap.xml` enviado e processado em 24/11/2026: **25 páginas encontradas**, incluindo `/mapa-do-site`.

A solicitação manual de indexação (`Inspeção de URL` → `Solicitar indexação`) falhou por **cota diária excedida** para a homepage e o mapa do site. Tentar novamente no dia seguinte; o sitemap já submetido basta para o Google descobrir as páginas.

Depois do domínio:

1. Criar propriedade `https://pegalink.xyz/`.
2. Verificar com arquivo HTML ou tag.
3. Enviar `https://pegalink.xyz/sitemap.xml`.
4. Pedir indexação das páginas principais em Inspeção de URL.

## 4. Publicação

Somente após domínio + Adsterra aprovado + GSC verificado:

1. Ajustar URLs canônicas/base para o domínio final, se necessário.
2. Fazer `git push origin main` (isso dispara o deploy no Render).
3. Conectar o domínio no Render e conferir HTTPS.
4. Validar `/`, `/sitemap.xml`, `/robots.txt`, `/api/health`, `/mapa-do-site`.
5. Testar downloads em MP4 e MP3.
6. Somente então divulgar o site.

## 5. Pós-lançamento

- Acompanhar Impressões e Consultas no Search Console.
- Enviar novamente o sitemap quando novas páginas entrarem.
- Pedir indexação de páginas novas e importantes.
- Conferir periodicamente se os blocos da Adsterra continuam servindo anúncios e se o console não reporta erros.

## 6. Download em streaming (25/11/2026)

O servidor não espera mais o arquivo inteiro terminar em disco antes de responder. O yt-dlp escreve o vídeo na saída padrão (ele já lida com proxy, cookies e clientes do YouTube) e o ffmpeg remuxa para MP4 fragmentado — ou converte o áudio para MP3 — direto na conexão (`x-transfer: stream`), com cabeçalho válido nos primeiros bytes. Isso eliminou a espera morta da etapa “Baixando…” e o progresso agora avança em tempo real. Teste local: primeiro byte em ~1 ms; “Download rápido” 640×360, HD 720p 1280×720, “Melhor qualidade” 3840×2160 e MP3 com cabeçalho ID3. Se o streaming falhar antes de qualquer byte, a rota tenta os fallbacks de seletor/cliente e só então cai para o método antigo.
