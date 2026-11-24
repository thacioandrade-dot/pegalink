# Checklist de lançamento — PegaLink

**Status atual:** projeto pronto para testes em `https://pegalink.onrender.com`, mas **NÃO lançado** com domínio próprio.

## Regras até o lançamento

- Não fazer `git push` para `main`: o Render tem auto-deploy e publicaria o site.
- Não verificar a propriedade no Google Search Console.
- Não enviar sitemap ao Google.
- Não colar anúncios da Adsterra no site.
- Não divulgar o link de teste.

Os commits locais `34f06f8` e `7ed7c5a` ainda não foram enviados ao GitHub.

## 1. Domínio

Domínio escolhido: **.xyz** (ex.: `pegalink.xyz`).

Opções pesquisadas em 23/11/2026:

| Registrador | 1º ano | Renovação | Observação |
|---|---:|---:|---|
| Spaceship | US$ 0,95 com cupom `XYZ52` | US$ 13,97/ano | Menor primeiro ano |
| Porkbun | US$ 1,29 | US$ 14,21/ano | WHOIS privado gratuito |
| PublicDomainRegistry | US$ 8,00 | US$ 8,00/ano | Melhor custo fixo a longo prazo |
| Cloudflare | US$ 13,50 | US$ 13,50/ano | Exige usar DNS da Cloudflare |

Depois de comprar, configurar DNS/Render para o domínio final.

## 2. Adsterra

Conta Adsterra: **criada pelo proprietário**.

Ao solicitar aprovação, usar a URL final `https://pegalink.xyz/` (não o link de teste).

Aprovação não significa ativar anúncios automaticamente: o código de anúncio só entra depois da confirmação do proprietário.

## 3. Google Search Console

Propriedade `https://pegalink.onrender.com/` foi criada, mas **ainda não verificada**.

Arquivo de verificação já preparado: `public/google1b603134014a71d3.html`.

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
