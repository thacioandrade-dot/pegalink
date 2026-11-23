/*
 * Configuração de anúncios.
 *
 * Deixe `enabled: false` até ter uma conta aprovada numa rede de anúncios.
 * Para AdSense: preencha `client` (ca-pub-...) e os slots de cada posição.
 * Para outra rede: use `customHtml` em cada slot.
 */
window.PEGAVIDEO_ADS = {
  enabled: false,

  // AdSense
  client: 'ca-pub-0000000000000000',
  slots: {
    top: '0000000000',
    result: '0000000001',
    footer: '0000000002'
  },

  // Exemplo de outra rede (opcional):
  // customHtml: {
  //   top: '<div>...</div>'
  // },

  // Mostrar um aviso discreto de "espaço reservado" em desenvolvimento.
  showPlaceholder: false
};
