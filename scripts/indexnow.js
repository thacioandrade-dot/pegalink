'use strict';

// Submissão gratuita ao IndexNow (Bing, Yandex e outros). Não pede login,
// não mexe em DNS e não expõe nenhum dado do proprietário: a chave abaixo é
// pública por design e precisa estar disponível em /<chave>.txt no site.
const { getPages } = require('../lib/seo');

const HOST = 'pegalink.xyz';
const KEY = '980e1c2e32a94409977757210e377460';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const urls = [
  `https://${HOST}/`,
  ...getPages().map((page) => `https://${HOST}/${page.slug}`)
];

async function main() {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls })
  });
  const text = await response.text();
  console.log(`IndexNow HTTP ${response.status} — ${urls.length} URLs`);
  if (text) console.log(text.slice(0, 500));
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error('Falha ao submeter ao IndexNow:', error.message);
  process.exitCode = 1;
});
