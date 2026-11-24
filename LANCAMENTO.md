# Checklist de lançamento — PegaLink

**Status atual (24/11/2026):** site publicado em `https://pegalink.onrender.com` **sem Adsterra**, com domínio próprio ainda pendente. Propriedade do Google Search Console verificada e sitemap enviado e processado (25 URLs).

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

Site ainda não indexado em 24/11/2026: GSC mostra “O URL não está no Google”, mas o teste em tempo real confirmou “O URL está disponível para o Google” e “É possível indexar a página”. A cota de “Solicitar indexação” continua excedida. Lembrete automático criado para 25/11 às 10h (America/Sao_Paulo).

## 1. Domínio

Domínio escolhido: **.xyz**, registrador **Spaceship** (cupom `XYZ52`), com renovação de US$ 13,97/ano e **WHOIS privado grátis para sempre** (confirmado em 24/11/2026; o serviço é o Withheld for Privacy e é aplicado automaticamente em domínios elegíveis, incluindo .xyz).

Nome esperado: `pegalink.xyz`.

No checkout, a taxa ICANN de US$ 0,20 pode ser adicionada, e o WHOIS privado deve aparecer como US$ 0,00.

Opções pesquisadas em 23/11/2026:

| Registrador | 1º ano | Renovação | Observação |
|---|---:|---:|---|
| Spaceship | US$ 0,95 com cupom `XYZ52` | US$ 13,97/ano | **Escolhido — menor primeiro ano** |
| Porkbun | US$ 1,29 | US$ 14,21/ano | WHOIS privado gratuito |
| PublicDomainRegistry | US$ 8,00 | US$ 8,00/ano | Melhor custo fixo a longo prazo |
| Cloudflare | US$ 13,50 | US$ 13,50/ano | Exige usar DNS da Cloudflare |

Depois de comprar, configurar DNS/Render para o domínio final.

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
