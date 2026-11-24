'use strict';

// Páginas de conteúdo otimizadas para busca. Cada página tem texto, passos e
// perguntas próprias para evitar conteúdo duplicado entre as URLs.
const pages = [
  {
    slug: 'youtube',
    title: 'Baixar vídeos do YouTube pelo link — PegaLink',
    description: 'Baixe vídeos do YouTube pelo link em MP4 ou MP3, sem cadastro e sem instalar programas. Escolha a qualidade e salve no celular ou computador.',
    keywords: 'baixar vídeo do youtube, download youtube, youtube mp4, youtube mp3, baixar youtube pelo link, salvar vídeo do youtube, downloader youtube, youtube para mp4',
    h1: 'Como baixar vídeos do YouTube pelo link',
    lead: 'Cole a URL de um vídeo público do YouTube, escolha MP4 ou MP3 e salve o arquivo direto no seu dispositivo. O PegaLink funciona no navegador, sem cadastro e sem instalar nenhum aplicativo.',
    steps: [
      'Abra o YouTube e copie a URL do vídeo que deseja salvar.',
      'Volte ao PegaLink e cole o link no campo “Cole a URL do vídeo”.',
      'Clique em “Buscar vídeo” e aguarde a leitura das opções disponíveis.',
      'Escolha a resolução em MP4 ou a opção “Áudio MP3” e clique para baixar.'
    ],
    tips: [
      'Vídeos públicos e com link compartilhável funcionam melhor.',
      'Se o vídeo tiver restrição de idade ou exigir login, o download pode falhar.',
      'No celular, o arquivo vai para a pasta de downloads ou para o app Arquivos.'
    ],
    faq: [
      ['Preciso instalar algum programa para baixar do YouTube?', 'Não. O PegaLink roda inteiro no navegador: você só precisa do link do vídeo.'],
      ['Posso escolher a qualidade do vídeo?', 'Sim. Depois da busca, mostramos as resoluções MP4 disponíveis para aquele vídeo.'],
      ['Dá para salvar só o áudio?', 'Sim. Selecione “Áudio MP3” para extrair o som do vídeo.'],
      ['Por que meu link do YouTube não funcionou?', 'Links privados, apagados ou com restrição de idade podem não ser acessíveis. Confira se o vídeo abre normalmente antes de colar.'],
      ['O PegaLink é oficial do YouTube?', 'Não. É um projeto independente e não é afiliado ao YouTube.']
    ]
  },
  {
    slug: 'tiktok',
    title: 'Baixar vídeos do TikTok pelo link — PegaLink',
    description: 'Salve vídeos do TikTok pelo link em MP4 ou MP3. Sem cadastro, sem aplicativo e sem complicação: cole a URL e baixe no celular ou PC.',
    keywords: 'baixar tiktok, download tiktok, salvar vídeo do tiktok, tiktok mp4, tiktok mp3, baixar video tiktok pelo link, downloader tiktok',
    h1: 'Como baixar vídeos do TikTok pelo link',
    lead: 'Recebeu um TikTok engraçado e quer guardar? Copie o link de compartilhamento, cole no PegaLink e escolha o formato. O arquivo é salvo direto no seu dispositivo.',
    steps: [
      'No TikTok, toque em “Compartilhar” e depois em “Copiar link”.',
      'Cole o link copiado no campo do PegaLink.',
      'Clique em “Buscar vídeo” para carregar as opções.',
      'Escolha MP4 para manter o vídeo ou MP3 para salvar apenas o áudio.'
    ],
    tips: [
      'Links de vídeos públicos são os mais confiáveis.',
      'Alguns vídeos podem ser bloqueados pelo próprio TikTok conforme a região ou o IP.',
      'Em redes instáveis, tente novamente em instantes se a busca falhar.'
    ],
    faq: [
      ['Como copio o link de um vídeo do TikTok?', 'Abra o vídeo, toque no botão de compartilhar e escolha “Copiar link”.'],
      ['Dá para baixar o áudio do TikTok?', 'Sim. Depois de buscar o vídeo, selecione a opção “Áudio MP3”.'],
      ['Por que apareceu mensagem de IP bloqueado?', 'O TikTok pode limitar o acesso de alguns IPs. Nesse caso, tente outra rede ou aguarde alguns minutos.'],
      ['Funciona no iPhone?', 'Sim. No iOS, o arquivo costuma ser salvo no app Arquivos.'],
      ['O PegaLink é afiliado ao TikTok?', 'Não. Somos um serviço independente.']
    ]
  },
  {
    slug: 'instagram',
    title: 'Baixar vídeos e Reels do Instagram pelo link — PegaLink',
    description: 'Baixe vídeos e Reels do Instagram pelo link em MP4 ou MP3, sem login e sem cadastro. Cole a URL e salve o arquivo no seu celular ou computador.',
    keywords: 'baixar instagram, download instagram, salvar reels, baixar vídeo do instagram, instagram mp4, instagram mp3, downloader instagram, baixar reels',
    h1: 'Como baixar vídeos do Instagram pelo link',
    lead: 'Salve posts, vídeos e Reels públicos do Instagram em poucos passos. Cole a URL no PegaLink, escolha MP4 ou MP3 e faça o download sem precisar entrar na sua conta.',
    steps: [
      'No Instagram, toque nos três pontos do post e escolha “Copiar link”.',
      'Cole a URL no campo do PegaLink.',
      'Clique em “Buscar vídeo” e aguarde as opções.',
      'Selecione o formato desejado e clique para salvar o arquivo.'
    ],
    tips: [
      'Conteúdos de contas públicas são os que funcionam melhor.',
      'Stories e mídias que exigem login podem não ser baixáveis.',
      'Para áudio de um Reel, escolha a opção MP3 após a busca.'
    ],
    faq: [
      ['Preciso estar logado no Instagram?', 'Não. Para vídeos públicos, basta o link.'],
      ['Posso baixar Reels?', 'Sim. Copie o link do Reel e cole no PegaLink.'],
      ['Consigo salvar somente o áudio?', 'Sim, escolhendo “Áudio MP3” entre as opções.'],
      ['Por que um post privado não aparece?', 'O serviço só acessa conteúdo público; posts privados exigem permissão do dono da conta.'],
      ['O PegaLink é oficial do Instagram?', 'Não. É um projeto independente e não afiliado ao Instagram.']
    ]
  },
  {
    slug: 'mp3',
    title: 'Baixar áudio em MP3 de vídeos pelo link — PegaLink',
    description: 'Extraia o áudio de vídeos de YouTube, TikTok e Instagram em MP3 pelo link. Gratuito, sem cadastro e direto no navegador.',
    keywords: 'baixar mp3, extrair áudio de vídeo, converter vídeo para mp3, download mp3 grátis, mp3 pelo link, salvar áudio de vídeo, youtube mp3',
    h1: 'Como baixar áudio em MP3 pelo link',
    lead: 'Quer guardar só o som de um vídeo? O PegaLink lê o link, extrai o áudio e oferece o arquivo em MP3 para você salvar no celular ou computador.',
    steps: [
      'Copie a URL do vídeo na plataforma de origem.',
      'Cole o link no campo do PegaLink e clique em “Buscar vídeo”.',
      'Escolha a opção “Áudio MP3” na lista de formatos.',
      'Clique para baixar e salvar o arquivo no seu dispositivo.'
    ],
    tips: [
      'O MP3 é útil para músicas, podcasts e vídeos que você quer ouvir sem imagem.',
      'A disponibilidade depende do áudio original do vídeo.',
      'Respeite direitos autorais: baixe apenas conteúdo seu ou autorizado.'
    ],
    faq: [
      ['O MP3 é gratuito?', 'Sim. Não há cadastro nem cobrança para extrair o áudio.'],
      ['Qual a qualidade do áudio?', 'A qualidade acompanha o áudio disponível no vídeo original.'],
      ['Funciona para TikTok e Instagram?', 'Sim, além do YouTube.'],
      ['Preciso converter depois?', 'Não. O arquivo já vem pronto em MP3.'],
      ['Posso usar o áudio comercialmente?', 'Somente se você tiver direitos sobre o conteúdo.']
    ]
  },
  {
    slug: 'mp4',
    title: 'Baixar vídeos em MP4 pelo link — PegaLink',
    description: 'Baixe vídeos em MP4 pelo link com a melhor resolução disponível. YouTube, TikTok e Instagram direto no navegador, sem cadastro.',
    keywords: 'baixar mp4, download vídeo mp4, salvar vídeo em mp4, baixar vídeo hd, mp4 pelo link, downloader de vídeo mp4',
    h1: 'Como baixar vídeos em MP4 pelo link',
    lead: 'O MP4 é o formato mais compatível com celulares, computadores e TVs. Cole a URL do vídeo, escolha a resolução e salve o arquivo já pronto para reproduzir.',
    steps: [
      'Copie o link do vídeo que deseja manter com imagem e som.',
      'Cole a URL no PegaLink e clique em “Buscar vídeo”.',
      'Escolha a resolução MP4 desejada entre as opções listadas.',
      'Clique para baixar; o arquivo vai para a pasta de downloads.'
    ],
    tips: [
      'Resoluções maiores geram arquivos maiores.',
      'MP4 funciona em praticamente todos os players atuais.',
      'Se uma resolução falhar, tente a seguinte na lista.'
    ],
    faq: [
      ['Qual resolução devo escolher?', '720p costuma equilibrar qualidade e tamanho; 360p é mais leve para celular.'],
      ['O vídeo sai com áudio?', 'Sim, as opções MP4 mantêm o som quando ele está disponível na fonte.'],
      ['Posso baixar em HD?', 'Sim, quando o vídeo original oferece essa resolução.'],
      ['Funciona em qualquer plataforma?', 'Funciona para links públicos de YouTube, TikTok e Instagram.'],
      ['Preciso instalar um player?', 'Não. O MP4 abre no player padrão do seu dispositivo.']
    ]
  },
  {
    slug: 'youtube-mp3',
    title: 'Converter YouTube para MP3 pelo link — PegaLink',
    description: 'Converta vídeos do YouTube para MP3 pelo link, sem cadastro e sem instalar nada. Escolha o vídeo, extraia o áudio e salve no dispositivo.',
    keywords: 'youtube mp3, converter youtube para mp3, baixar áudio do youtube, youtube para mp3 online, extrair mp3 do youtube, download mp3 youtube',
    h1: 'Como converter YouTube para MP3 pelo link',
    lead: 'Transforme um vídeo do YouTube em arquivo de áudio MP3 em poucos passos. Basta o link público do vídeo e o PegaLink faz a extração no navegador.',
    steps: [
      'Copie a URL do vídeo do YouTube.',
      'Cole no PegaLink e clique em “Buscar vídeo”.',
      'Escolha “Áudio MP3” na lista de formatos.',
      'Clique para baixar o arquivo de áudio.'
    ],
    tips: [
      'Use apenas vídeos que você tem permissão para salvar.',
      'A extração depende do áudio original estar disponível.',
      'Para ouvir offline, salve o MP3 na pasta de músicas do seu celular.'
    ],
    faq: [
      ['A conversão é online?', 'Sim, você não precisa instalar nenhum conversor.'],
      ['Preciso criar conta?', 'Não. O serviço é gratuito e sem cadastro.'],
      ['Posso converter playlists inteiras?', 'Não. O PegaLink trabalha com um link de vídeo por vez.'],
      ['O áudio sai em boa qualidade?', 'A qualidade segue a faixa de áudio original do vídeo.'],
      ['É permitido?', 'Use apenas com conteúdo próprio ou autorizado e respeite os termos da plataforma.']
    ]
  },
  {
    slug: 'shorts',
    title: 'Baixar YouTube Shorts pelo link — PegaLink',
    description: 'Salve vídeos curtos do YouTube Shorts pelo link em MP4 ou MP3. Rápido, gratuito e sem cadastro.',
    keywords: 'baixar youtube shorts, download shorts, salvar shorts, youtube shorts mp4, shorts mp3, baixar vídeo curto do youtube',
    h1: 'Como baixar YouTube Shorts pelo link',
    lead: 'Os vídeos curtos do YouTube também podem ser salvos. Copie o link do Short, cole no PegaLink e escolha MP4 para manter o vídeo ou MP3 para guardar só o áudio.',
    steps: [
      'Abra o Short no YouTube e use “Compartilhar” para copiar o link.',
      'Cole a URL no campo do PegaLink.',
      'Clique em “Buscar vídeo”.',
      'Escolha MP4 ou MP3 e salve o arquivo.'
    ],
    tips: [
      'Funciona da mesma forma que um vídeo comum do YouTube.',
      'Links de Shorts públicos são lidos normalmente pela ferramenta.',
      'Se o Short tiver sido apagado, o link não retornará o arquivo.'
    ],
    faq: [
      ['Shorts são tratados como vídeos normais?', 'Sim, basta o link de compartilhamento.'],
      ['Dá para salvar só o som?', 'Sim, escolhendo MP3.'],
      ['Preciso de cadastro?', 'Não, o PegaLink é gratuito e aberto.'],
      ['Funciona no celular?', 'Sim, em Android e iPhone pelo navegador.'],
      ['Por que falhou?', 'Verifique se o link abre e se o vídeo é público.']
    ]
  },
  {
    slug: 'reels',
    title: 'Baixar Reels do Instagram pelo link — PegaLink',
    description: 'Baixe Reels do Instagram pelo link em MP4 ou MP3, sem login e sem cadastro. Salve o arquivo direto no seu dispositivo.',
    keywords: 'baixar reels, download reels instagram, salvar reels, reels mp4, reels mp3, baixar vídeo de reels pelo link',
    h1: 'Como baixar Reels do Instagram pelo link',
    lead: 'Gostou de um Reel e quer guardar? Copie o link da publicação, cole no PegaLink e escolha o formato. Não é preciso entrar na sua conta do Instagram.',
    steps: [
      'No Reel, toque nos três pontos e escolha “Copiar link”.',
      'Cole o link no PegaLink.',
      'Clique em “Buscar vídeo” e aguarde as opções.',
      'Selecione MP4 ou MP3 e faça o download.'
    ],
    tips: [
      'Reels de contas públicas são acessíveis pelo link.',
      'Conteúdos com restrição de idade podem não funcionar.',
      'No celular, o arquivo pode ir para a galeria ou app Arquivos.'
    ],
    faq: [
      ['Preciso de login para baixar Reels?', 'Não, para Reels públicos basta o link.'],
      ['Posso salvar o áudio do Reel?', 'Sim, escolha a opção MP3 após a busca.'],
      ['Funciona para qualquer Reel?', 'Funciona para conteúdo público; reels privados não são acessíveis.'],
      ['O arquivo sai sem marca d’água?', 'O arquivo segue o que a plataforma disponibiliza publicamente.'],
      ['É gratuito?', 'Sim, sem cadastro e sem cobrança.']
    ]
  },
  {
    slug: 'como-baixar-video',
    title: 'Como baixar vídeo pelo link: guia completo — PegaLink',
    description: 'Aprenda a baixar vídeo pelo link em MP4 ou MP3 do YouTube, TikTok e Instagram. Guia passo a passo para celular e computador.',
    keywords: 'como baixar vídeo, baixar vídeo pelo link, tutorial baixar vídeo, salvar vídeo do celular, baixar vídeo online, guia download de vídeo',
    h1: 'Como baixar vídeo pelo link: guia passo a passo',
    lead: 'Baixar um vídeo pelo link é simples quando você tem a ferramenta certa. Neste guia você vê como copiar a URL, escolher o formato e salvar o arquivo no celular ou no computador.',
    steps: [
      'Abra o aplicativo ou site onde o vídeo está publicado.',
      'Use o botão de compartilhar e escolha “Copiar link”.',
      'No PegaLink, cole o link e clique em “Buscar vídeo”.',
      'Escolha MP4 para vídeo ou MP3 para áudio e clique para salvar.'
    ],
    tips: [
      'Sempre confira se o link copiado começa com https://.',
      'Vídeos privados ou apagados não podem ser recuperados.',
      'Use apenas conteúdo próprio ou com autorização dos direitos autorais.'
    ],
    faq: [
      ['Quais plataformas são aceitas?', 'YouTube, TikTok e Instagram.'],
      ['Funciona sem instalar aplicativo?', 'Sim, tudo acontece no navegador.'],
      ['Posso escolher a qualidade?', 'Sim, quando a plataforma oferece mais de uma resolução.'],
      ['O que fazer se der erro?', 'Confira o link, tente outra rede e verifique se o vídeo é público.'],
      ['É legal baixar qualquer vídeo?', 'Não. Respeite direitos autorais e os termos de uso das plataformas.']
    ]
  },
  {
    slug: 'video-gratis',
    title: 'Baixar vídeos grátis pelo link — PegaLink',
    description: 'Baixe vídeos grátis pelo link em MP4 ou MP3, sem cadastro, sem assinatura e sem instalar programas. YouTube, TikTok e Instagram.',
    keywords: 'baixar vídeo grátis, download grátis, downloader gratuito, salvar vídeo sem pagar, baixar mp4 grátis, baixar mp3 grátis',
    h1: 'Como baixar vídeos grátis pelo link',
    lead: 'Não precisa pagar nem criar conta para salvar um vídeo público. O PegaLink oferece download gratuito em MP4 e MP3 direto pelo navegador.',
    steps: [
      'Copie o link do vídeo que você quer guardar.',
      'Cole o link no campo do PegaLink.',
      'Clique em “Buscar vídeo”.',
      'Escolha MP4 ou MP3 e salve gratuitamente no seu dispositivo.'
    ],
    tips: [
      'Sem assinatura: a ferramenta é livre para uso pessoal.',
      'Sem instalação: funciona em qualquer navegador moderno.',
      'Use com responsabilidade e respeite os direitos dos criadores.'
    ],
    faq: [
      ['O download é realmente grátis?', 'Sim, não cobramos pelo uso básico da ferramenta.'],
      ['Preciso de cartão ou cadastro?', 'Não.'],
      ['Tem limite de downloads?', 'Pode haver limite temporário para evitar sobrecarga do servidor.'],
      ['Quais formatos são gratuitos?', 'MP4 e MP3.'],
      ['Posso usar em vídeos de terceiros?', 'Apenas com autorização ou para conteúdo público permitido.']
    ]
  },
  {
    slug: 'tiktok-sem-marca-dagua',
    title: "Baixar TikTok sem marca d'água pelo link — PegaLink",
    description: "Salve vídeos do TikTok pelo link em MP4. Quando a plataforma disponibiliza uma versão pública sem marca d'água, é ela que tentamos baixar. Sem cadastro.",
    keywords: "tiktok sem marca d'agua, baixar tiktok sem marca d'agua, download tiktok sem logo, salvar video tiktok sem marca d'agua, tiktok hd sem marca d'agua",
    h1: "Como baixar TikTok sem marca d'água pelo link",
    lead: "Copie o link de compartilhamento do TikTok, cole no PegaLink e escolha MP4. O arquivo acompanha a versão pública disponibilizada pela plataforma; quando existe uma versão limpa, tentamos salvar exatamente essa.",
    steps: [
      "No TikTok, toque em “Compartilhar” e escolha “Copiar link”.",
      "Cole o link no campo do PegaLink e clique em “Buscar vídeo”.",
      "Escolha uma opção MP4 na lista de formatos.",
      "Clique para baixar e salve o arquivo no seu dispositivo."
    ],
    tips: [
      "Não prometemos remover marcas d'água: o arquivo segue o que o TikTok oferece publicamente.",
      "Vídeos públicos costumam ter mais formatos disponíveis do que links de contas privadas.",
      "Se aparecer aviso de IP bloqueado, tente outra rede ou aguarde alguns minutos."
    ],
    faq: [
      ["O PegaLink remove a marca d'água do TikTok?", "Não editamos o vídeo. Salvamos a versão pública disponível; se ela já vier sem marca d'água, é essa que você recebe."],
      ["Preciso instalar um aplicativo?", "Não. O download acontece pelo navegador."],
      ["Posso salvar o áudio desse vídeo?", "Sim. Escolha “Áudio MP3” depois da busca."],
      ["Por que o arquivo ainda tem marca d'água?", "Algumas publicações só são disponibilizadas com marca d'água pela própria plataforma."],
      ["É afiliado ao TikTok?", "Não. O PegaLink é um projeto independente."]
    ]
  },
  {
    slug: 'tiktok-mp3',
    title: 'Baixar áudio do TikTok em MP3 pelo link — PegaLink',
    description: 'Extraia o áudio de vídeos do TikTok em MP3 pelo link. Gratuito, sem cadastro e sem instalar aplicativos. Cole a URL e salve o som no seu dispositivo.',
    keywords: 'tiktok mp3, baixar áudio do tiktok, tiktok para mp3, extrair mp3 do tiktok, salvar som do tiktok, download mp3 tiktok',
    h1: 'Como baixar áudio do TikTok em MP3 pelo link',
    lead: 'Quer guardar apenas a música ou o som de um TikTok? Copie o link, cole no PegaLink e selecione “Áudio MP3” para salvar o arquivo de som no celular ou computador.',
    steps: [
      'Abra o vídeo no TikTok e toque em “Compartilhar”.',
      'Escolha “Copiar link” e cole a URL no PegaLink.',
      'Clique em “Buscar vídeo” e aguarde aparecerem as opções.',
      'Selecione “Áudio MP3” e clique para baixar o som.'
    ],
    tips: [
      'A qualidade do MP3 depende da faixa de áudio original do vídeo.',
      'Use apenas áudio que você tenha permissão para salvar.',
      'No celular, o arquivo pode aparecer no app Arquivos ou na pasta de downloads.'
    ],
    faq: [
      ['O MP3 do TikTok é gratuito?', 'Sim, sem cadastro e sem assinatura.'],
      ['Dá para escolher a qualidade do áudio?', 'A ferramenta usa a melhor faixa de áudio disponibilizada no vídeo.'],
      ['Funciona para qualquer TikTok?', 'Funciona para vídeos públicos acessíveis pelo link.'],
      ['Preciso converter o arquivo depois?', 'Não. O download já chega em formato MP3.'],
      ['Posso usar o áudio em um vídeo meu?', 'Somente com autorização de quem detém os direitos.']
    ]
  },
  {
    slug: 'tiktok-stories',
    title: 'Baixar stories e slideshows do TikTok pelo link — PegaLink',
    description: 'Tente salvar stories e slideshows públicos do TikTok pelo link em MP4. Basta colar a URL no navegador, sem cadastro e sem instalar programas.',
    keywords: 'baixar story tiktok, download stories tiktok, salvar slideshow tiktok, baixar apresentação de slides tiktok, story viewer tiktok, salvar story tiktok sem login',
    h1: 'Como baixar stories e slideshows do TikTok pelo link',
    lead: 'Links de stories e apresentações de slides públicos podem ser lidos pelo PegaLink como qualquer outro vídeo. Cole a URL, clique em buscar e escolha o formato disponível.',
    steps: [
      'Copie o link de compartilhamento do story ou slideshow no TikTok.',
      'Cole a URL no campo do PegaLink.',
      'Clique em “Buscar vídeo” para verificar se há mídia pública disponível.',
      'Selecione MP4 ou MP3 e salve o arquivo.'
    ],
    tips: [
      'Stories que exigem login ou seguem apenas uma lista restrita podem não ser acessíveis.',
      'Se o link apontar para várias imagens, o resultado depende do que a plataforma disponibiliza.',
      'Use o botão “Nova busca” para testar outro link sem recarregar a página.'
    ],
    faq: [
      ['Consigo baixar stories sem entrar na minha conta?', 'Para stories públicos, basta o link. Conteúdo que exige login não é acessível.'],
      ['Slideshows viram um único arquivo?', 'O resultado depende de como o TikTok publica a mídia; quando há um arquivo de vídeo, ele aparece na lista de formatos.'],
      ['Posso salvar só o áudio?', 'Sim, quando há faixa de áudio disponível, escolha “Áudio MP3”.'],
      ['Por que a busca falhou?', 'O link pode ter expirado, ser privado ou estar bloqueado para o IP do servidor.'],
      ['O PegaLink é oficial do TikTok?', 'Não. É um serviço independente.']
    ]
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPages() {
  return pages;
}

function findPage(slug) {
  return pages.find((page) => page.slug === slug);
}

function renderPage(page, base) {
  const url = `${base}/${page.slug}`;
  const keywords = escapeHtml(page.keywords);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);

  const steps = page.steps
    .map((step, index) => `<li><strong>${index + 1}.</strong> ${escapeHtml(step)}</li>`)
    .join('\n');
  const tips = page.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('\n');
  const faqHtml = page.faq
    .map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`)
    .join('\n');
  const related = pages
    .filter((item) => item.slug !== page.slug)
    .slice(0, 6)
    .map((item) => `<a href="/${item.slug}">${escapeHtml(item.h1)}</a>`)
    .join('\n');

  const links = pages
    .map((item) => `<a href="/${item.slug}">${escapeHtml(item.h1)}</a>`)
    .join('\n');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: 'PegaLink',
        url: `${base}/`,
        inLanguage: 'pt-BR'
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${base}/#website` },
        inLanguage: 'pt-BR'
      },
      {
        '@type': 'HowTo',
        name: page.h1,
        description: page.lead,
        step: page.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: `Passo ${index + 1}`,
          text: step
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: url }
        ]
      }
    ]
  };

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1020">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="googlebot" content="index, follow">
  <meta name="language" content="pt-BR">
  <meta http-equiv="content-language" content="pt-BR">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="pt-BR" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="PegaLink">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body>
  <div class="aurora" aria-hidden="true"></div>
  <header class="site-header">
    <a class="brand" href="/" aria-label="PegaLink, início">
      <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5L8 5.5z"/></svg></span>
      <span class="brand-name">Pega<span>Link</span></span>
    </a>
    <nav class="header-nav" aria-label="Navegação principal">
      <a href="/">Início</a>
      <a href="/youtube">YouTube</a>
      <a href="/tiktok">TikTok</a>
      <a href="/instagram">Instagram</a>
    </nav>
  </header>

  <main id="topo">
    <article class="section seo-page">
      <nav class="breadcrumb" aria-label="Trilha de navegação"><a href="/">Início</a> › <span>${escapeHtml(page.h1)}</span></nav>
      <div class="section-head">
        <span class="section-kicker">Guia PegaLink</span>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="lead">${escapeHtml(page.lead)}</p>
        <p><a class="primary-btn" href="/#topo">Baixar um vídeo agora</a></p>
      </div>

      <div class="ad-slot ad-leaderboard" data-ad-slot="top" hidden></div>

      <section>
        <h2>Passo a passo</h2>
        <ol class="steps-ol">${steps}</ol>
      </section>

      <section>
        <h2>Dicas importantes</h2>
        <ul>${tips}</ul>
      </section>

      <section id="faq">
        <h2>Perguntas frequentes</h2>
        <div class="faq-list">${faqHtml}</div>
      </section>

      <section>
        <h2>Explore outros guias</h2>
        <div class="feature-grid">${related}</div>
      </section>
      <div class="ad-slot ad-footer" data-ad-slot="footer" hidden></div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span class="footer-brand">Pega<span>Link</span></span>
      <nav class="footer-links" aria-label="Links de SEO">${links}</nav>
      <p>Use apenas para conteúdo próprio ou autorizado. Respeite direitos autorais e os termos das plataformas.</p>
      <span class="footer-note">Projeto independente · Não afiliado a YouTube, TikTok ou Instagram.</span>
    </div>
  </footer>

  <script src="/ads-config.js"></script>
  <script src="/ads.js"></script>
</body>
</html>`;
}

module.exports = { getPages, findPage, renderPage, escapeHtml };
