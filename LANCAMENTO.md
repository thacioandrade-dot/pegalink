# Checklist de lançamento — PegaLink

**Privacidade reforçada (24/11/2026):** WHOIS do registrante oculto no RDAP (só aparece o registrador), transferência bloqueada, DNS autoritativo da Cloudflare devolvendo apenas IPs `172.67.222.14` / `104.21.25.28` (origem Render escondida), `X-Powered-By` desligado e headers `Referrer-Policy: no-referrer`, `X-Frame-Options`, `Permissions-Policy` e `COOP`. Dados pessoais removidos dos arquivos publicados e do histórico do Git (commit reescrito e enviado). O repositório ainda aparece com o nome da conta no GitHub; para escondê-lo completamente seria preciso torná-lo privado ou transferi-lo, o que exige login no GitHub — não feito aqui para não correr risco de quebrar o deploy do Render.

**Qualidade verificada (24/11/2026):** `node scripts/verify-quality.js` aprovou YouTube, TikTok e Instagram. No YouTube real, `1080p` baixou `1920x1080` com áudio (80,5 MB), `360p` baixou `640x360` com áudio (11,9 MB) e MP3 baixou a 264 kb/s. O seletor corrigido usa altura para paisagem e largura para retrato — antes, `1080p` podia entregar 480p. “Melhor qualidade” também foi corrigido: antes preferia AVC/MP4 e parava em 1080p mesmo quando havia 4K; agora começa por `bestvideo+bestaudio` e entregou 3840x2160 no teste. TikTok/Instagram não puderam ser testados ao vivo daqui porque a plataforma bloqueia o IP local; no Render a API mobile do TikTok (`tiktok:app_info`) passou a funcionar e o teste ao vivo em `https://pegalink.xyz` confirmou download real (1080×1920, HEVC, 15,2 MB). O TikTok agora mostra apenas três botões — **Full HD 1080p** (arquivo original sem marca d'água), **HD 720p** (arquivo menor real da plataforma) e **Áudio MP3**. O botão duplicado "Melhor qualidade" foi removido porque entregava exatamente o mesmo arquivo do Full HD. A recompressão no servidor também foi descartada: estourava a memória do Render Free e passava do limite de 100 s da Cloudflare. Espelhos CDN do mesmo formato (IDs `-0`, `-1`) não são mais tratados como qualidade diferente, e o seletor prefere H.264 quando disponível.

**Status atual (24/11/2026):** site no ar em **`https://pegalink.xyz`** (e `www.pegalink.xyz`), **sem Adsterra**. Domínio comprado via Hostinger com Pix (R$ 8,08), registrado e ativo até 24/11/2027; WHOIS privado e bloqueio de transferência ativos. Verificação de contato da ICANN pendente no e-mail até 08/12/2026. Cloudflare na conta do proprietário: zona `pegalink.xyz` no plano Free, CNAMEs `@` e `www` para `pegalink.onrender.com` com proxy laranja, Always Use HTTPS, HSTS 12 meses com `includeSubDomains` e `nosniff`, TLS mínimo 1.2, Bot Fight Mode e WAF gerenciado ativos, modo SSL **Full (Strict)**. Nameservers da Hostinger trocados para `aria.ns.cloudflare.com` / `sevki.ns.cloudflare.com`; a propagação terminou: resolvedores públicos (8.8.8.8, 1.1.1.1, 9.9.9.9) já devolvem os nameservers e os IPs da Cloudflare. `https://pegalink.xyz/api/health` responde JSON com `ok: true`, canonical/og:url/sitemap/robots usam `pegalink.xyz`, e o arquivo de verificação do Google responde corretamente. O `onrender.com` aparece apenas como destino interno do DNS — o endereço público é `pegalink.xyz`. Propriedade `https://pegalink.xyz/` criada e verificada no GSC, sitemap `sitemap.xml` enviado. O pedido de indexação da homepage foi feito; o Google ainda não a indexou e a cota pode limitar novas solicitações. O lembrete automático continua ativo para acompanhar.

## Regras até o lançamento com domínio próprio

- Não colar anúncios da Adsterra no site.
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

Cloudflare (configurada em 24/11/2026): `server.js` envia `Cache-Control` com `s-maxage=86400` e `CDN-Cache-Control` em páginas, sitemap, robots **e arquivos estáticos**; `/api/health` fica `no-store`; HSTS é enviado quando a requisição chega por HTTPS. O keep-alive `aut_20bdd78f6001sKl9a70Od5sp2F` dá ping a cada 5 minutos para o Render não dormir. Deploy `bfd8610` publicou: cache de `/api/info` por 10 minutos (`X-Cache: HIT/MISS`), opções HD 1080p/720p e SD 480p/360p, `preload` do CSS e `defer` no JS. Na Cloudflare: DNS com proxy laranja, SSL Full (Strict), Always Use HTTPS, HSTS 12 meses, TLS 1.2+, Bot Fight Mode, WAF gerenciado e DDoS sempre ativos. Velocidade: Always Online, Crawler Hints, Early Hints, Speed Brain, HTTP/2, HTTP/2 para origem e HTTP/3 ativos; Rocket Loader e 0-RTT desligados de propósito. **Não** ativar “I’m Under Attack Mode” — quebra downloads/API. Propagação concluída, HTTPS/canonical testados no domínio final, propriedade `https://pegalink.xyz/` criada e verificada no GSC e sitemap enviado.

## 2. Adsterra

Conta Adsterra: **criada pelo proprietário**.

Ao solicitar aprovação, usar a URL final `https://pegalink.xyz/` (não o link de teste).

Aprovação não significa ativar anúncios automaticamente: o código de anúncio só entra depois da confirmação do proprietário.

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
- Adicionar anúncios apenas se o proprietário autorizar.
