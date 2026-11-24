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
    about: {
      heading: 'O que o PegaLink faz com um link do YouTube',
      text: 'A ferramenta lê as informações públicas do vídeo a partir da URL e monta uma lista com os formatos realmente disponíveis. Você escolhe entre vídeo MP4 em diferentes resoluções ou áudio MP3, sem precisar copiar nada para um programa externo.',
      points: [
        'A busca começa automaticamente quando você cola o link.',
        'Resoluções verticais e horizontais aparecem quando o vídeo as oferece.',
        'O arquivo é salvo direto no seu dispositivo, sem etapas extras.'
      ]
    },
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
    about: {
      heading: 'Por que usar o PegaLink para salvar TikToks',
      text: 'Vídeos do TikTok podem ser salvos em MP4 com imagem e som, ou em MP3 quando você quer apenas o áudio. O PegaLink lê o link de compartilhamento e mostra as qualidades reais disponíveis para aquele post.',
      points: [
        'O link é lido diretamente do compartilhamento do app.',
        'Posts com mais de uma versão podem oferecer qualidades diferentes.',
        'Funciona no celular sem instalar nenhum aplicativo.'
      ]
    },
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
    about: {
      heading: 'Salvar posts e Reels públicos com praticidade',
      text: 'O PegaLink acessa somente conteúdo público do Instagram a partir da URL. Não é preciso entrar na sua conta: o link do post ou do Reel é suficiente para gerar o arquivo em MP4 ou MP3.',
      points: [
        'Sem login, sem cadastro e sem aplicativo.',
        'Compatível com posts e Reels de contas públicas.',
        'Escolha MP4 para assistir ou MP3 para ouvir offline.'
      ]
    },
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
    about: {
      heading: 'Como funciona a extração de MP3',
      text: 'A ferramenta identifica a faixa de áudio disponível no vídeo original e a entrega pronta em MP3. Não há conversão manual: o arquivo acompanha o melhor áudio oferecido pela fonte.',
      points: [
        'Útil para músicas, podcasts, aulas e entrevistas.',
        'Funciona para links de YouTube, TikTok e Instagram.',
        'Salve o MP3 na pasta de músicas do celular para ouvir offline.'
      ]
    },
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
    about: {
      heading: 'Por que escolher MP4 para salvar seus vídeos',
      text: 'MP4 é o formato mais aceito por celulares, computadores e televisões. No PegaLink você recebe o vídeo já com imagem e som, na resolução escolhida, sem precisar converter depois.',
      points: [
        'Abre no player padrão do seu dispositivo.',
        'Entrega a melhor qualidade quando o original oferece HD.',
        'Oferece versões mais leves para economizar dados no celular.'
      ]
    },
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
    about: {
      heading: 'Baixar Shorts em vídeo ou áudio',
      text: 'Links de YouTube Shorts são tratados como qualquer outro vídeo do YouTube. O PegaLink reconhece o formato vertical e oferece MP4 na maior resolução disponível ou MP3 para guardar apenas o som.',
      points: [
        'Funciona com links curtos de compartilhamento do YouTube.',
        'O MP4 sai em formato vertical, pronto para o celular.',
        'O MP3 permite reutilizar o áudio do Short.'
      ]
    },
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
  },
  {
    slug: 'tiktok-hd',
    title: 'Baixar TikTok em HD pelo link — PegaLink',
    description: 'Salve vídeos do TikTok na maior qualidade disponível em MP4. Cole o link, escolha a resolução HD e baixe no celular ou computador, sem cadastro.',
    keywords: 'baixar tiktok hd, tiktok hd, baixar video tiktok em hd, download tiktok hd, salvar tiktok em alta qualidade, tiktok full hd, baixar video tiktok qualidade original',
    h1: 'Como baixar TikTok em HD pelo link',
    lead: 'Quer guardar o vídeo com a melhor imagem que o TikTok oferece? Cole o link no PegaLink, escolha a opção de maior resolução listada e salve o MP4 no seu dispositivo.',
    steps: [
      'Abra o vídeo no TikTok e toque em “Compartilhar”.',
      'Escolha “Copiar link” e cole a URL no campo do PegaLink.',
      'A busca começa sozinha; aguarde aparecer a lista de formatos.',
      'Selecione a opção “Melhor qualidade” para baixar a maior resolução disponível.'
    ],
    tips: [
      'A resolução depende do arquivo original publicado no TikTok.',
      '“Qualidade leve” gera um arquivo menor quando você quer economizar espaço ou dados.',
      'O PegaLink não aumenta a resolução: ele entrega o que a plataforma disponibiliza.'
    ],
    faq: [
      ['O download sai em Full HD?', 'Quando o vídeo original tem essa resolução, a opção de melhor qualidade aparece na lista.'],
      ['Por que a qualidade foi menor do que eu esperava?', 'O TikTok pode publicar versões diferentes conforme o dispositivo de origem; o site mostra o que está disponível.'],
      ['Preciso pagar para baixar em HD?', 'Não. O PegaLink é gratuito e não exibe anúncios.'],
      ['Posso escolher um arquivo menor?', 'Sim. Use a opção “Qualidade leve” depois da busca.'],
      ['Funciona no iPhone?', 'Sim. O arquivo costuma aparecer na pasta Downloads do app Arquivos.']
    ]
  },
  {
    slug: 'tiktok-video-download',
    title: 'TikTok video download: salve vídeos pelo link — PegaLink',
    description: 'Faça seu TikTok video download em MP4 ou MP3 pelo navegador. Cole o link, escolha o formato e salve o arquivo sem cadastro, sem aplicativo e sem anúncios.',
    keywords: 'tiktok video download, video download tiktok, tiktok downloader online, baixar video tiktok pelo link, salvar video tiktok gratis, download video tiktok mp4',
    h1: 'TikTok video download: como salvar pelo link',
    lead: 'O jeito mais direto de fazer o download de um vídeo do TikTok é copiar a URL de compartilhamento e colá-la aqui. O PegaLink lê o link e já mostra as opções de MP4 e MP3.',
    steps: [
      'Copie o link do vídeo no aplicativo do TikTok.',
      'Cole a URL no campo do PegaLink; a busca inicia automaticamente.',
      'Confira o título e a miniatura para confirmar se é o vídeo certo.',
      'Clique em MP4 para manter a imagem ou em “Áudio MP3” para salvar só o som.'
    ],
    tips: [
      'Links curtos do tipo vm.tiktok.com também costumam funcionar.',
      'Vídeos de contas públicas são os mais acessíveis.',
      'Se o TikTok bloquear o IP do servidor, tente outra rede ou aguarde alguns minutos.'
    ],
    faq: [
      ['Quais links do TikTok funcionam?', 'Links de vídeos públicos com @usuario/video, links curtos e links de slideshow.'],
      ['O download é gratuito?', 'Sim, sem cadastro, sem assinatura e sem anúncios.'],
      ['O arquivo fica salvo no servidor?', 'Não mantemos cópias permanentes; o arquivo é entregue direto para o seu navegador.'],
      ['Dá para baixar o áudio separado?', 'Sim, escolhendo “Áudio MP3” na lista de formatos.'],
      ['É um site oficial?', 'Não. O PegaLink é independente e não é afiliado ao TikTok.']
    ]
  },
  {
    slug: 'tiktok-slideshow',
    title: 'Baixar slideshow do TikTok em MP4 — PegaLink',
    description: 'Salve apresentações de slides do TikTok como vídeo MP4 pelo link. As imagens e a trilha sonora são baixadas no arquivo disponibilizado pela plataforma.',
    keywords: 'baixar slideshow tiktok, salvar slideshow tiktok, tiktok slideshow mp4, apresentação de slides tiktok, baixar fotos do tiktok em video, slide tiktok download',
    h1: 'Como baixar slideshow do TikTok em MP4',
    lead: 'As apresentações de slides do TikTok também podem aparecer como um arquivo de vídeo. Copie o link da publicação, cole no PegaLink e veja se há um MP4 disponível.',
    steps: [
      'No TikTok, abra a publicação em slideshow e toque em “Compartilhar”.',
      'Escolha “Copiar link” e cole a URL no PegaLink.',
      'Clique em “Buscar vídeo” se a busca automática não iniciar.',
      'Se houver um arquivo de vídeo na lista, selecione MP4 e baixe.'
    ],
    tips: [
      'O resultado depende de como o TikTok publicou o slideshow.',
      'Quando há áudio, a opção “Áudio MP3” também aparece.',
      'Se o link trouxer apenas imagens soltas, o download em vídeo pode não estar disponível.'
    ],
    faq: [
      ['Slideshow sempre vira um MP4?', 'Nem sempre. Depende do formato em que o TikTok disponibiliza a publicação.'],
      ['A música vem junto?', 'Quando o arquivo de vídeo inclui a trilha, sim.'],
      ['Posso salvar as fotos separadamente?', 'O PegaLink trabalha com o arquivo de vídeo oferecido pelo link.'],
      ['Preciso entrar na minha conta?', 'Não, para conteúdo público basta o link.'],
      ['Por que não apareceu nenhum formato?', 'O conteúdo pode ser privado, ter expirado ou estar bloqueado para o servidor.']
    ]
  },
  {
    slug: 'tiktok-celular',
    title: 'Baixar TikTok no celular (Android e iPhone) — PegaLink',
    description: 'Baixe vídeos do TikTok no celular pelo navegador, sem instalar aplicativo. Funciona no Android com Chrome e no iPhone com Safari: cole o link e salve o MP4.',
    keywords: 'baixar tiktok no celular, download tiktok android, baixar tiktok iphone, salvar video tiktok no celular, tiktok downloader celular, baixar video tiktok no android',
    h1: 'Como baixar TikTok no celular',
    lead: 'Não precisa instalar um app para guardar um vídeo do TikTok. Abra o PegaLink no navegador do seu celular, cole o link copiado e salve o arquivo na pasta de downloads.',
    steps: [
      'No app do TikTok, toque em “Compartilhar” e em “Copiar link”.',
      'Abra o PegaLink no Chrome (Android) ou no Safari (iPhone).',
      'Cole a URL no campo; a busca começa sozinha.',
      'Escolha MP4 ou MP3 e toque para baixar.'
    ],
    tips: [
      'No Android, o arquivo costuma ir para a pasta Download.',
      'No iPhone, abra o app Arquivos para encontrar o download; toque em Compartilhar para enviar para Fotos.',
      'Use uma conexão estável para arquivos maiores em HD.'
    ],
    faq: [
      ['Funciona no Android?', 'Sim, com qualquer navegador moderno, sem app extra.'],
      ['Funciona no iPhone?', 'Sim. O Safari salva na pasta Downloads do app Arquivos.'],
      ['Preciso de permissão de acesso aos arquivos?', 'Apenas a permissão normal do navegador para salvar downloads.'],
      ['O vídeo aparece na galeria?', 'No Android costuma aparecer; no iPhone, salve pelo app Arquivos.'],
      ['É seguro?', 'O site não pede login nem senha e não mostra anúncios.']
    ]
  },
  {
    slug: 'tiktok-pc',
    title: 'Baixar TikTok no PC pelo link — PegaLink',
    description: 'Salve vídeos do TikTok no computador com Windows, macOS ou Linux. Copie o link no navegador, cole no PegaLink e baixe o MP4 ou MP3 sem instalar programa.',
    keywords: 'baixar tiktok no pc, download tiktok computador, salvar video tiktok no windows, tiktok downloader pc, baixar video tiktok no computador, tiktok mac download',
    h1: 'Como baixar TikTok no computador',
    lead: 'No computador é ainda mais simples: você pode copiar a URL direto da barra do navegador ou do botão de compartilhar do TikTok e colar no PegaLink.',
    steps: [
      'Abra o vídeo no TikTok pelo navegador e copie o endereço da página.',
      'Cole a URL no campo do PegaLink e aguarde a busca automática.',
      'Escolha a resolução em MP4 ou a opção “Áudio MP3”.',
      'Clique para baixar; o arquivo vai para a pasta Downloads do navegador.'
    ],
    tips: [
      'Funciona em Windows, macOS e Linux, sem instalar software.',
      'Resoluções maiores podem gerar arquivos maiores.',
      'Use o botão “Nova busca” para testar outro link sem recarregar a página.'
    ],
    faq: [
      ['Preciso instalar um programa no PC?', 'Não. O download é feito pelo navegador.'],
      ['Quais navegadores funcionam?', 'Chrome, Edge, Firefox e Safari, entre outros navegadores modernos.'],
      ['Onde o arquivo é salvo?', 'Na pasta definida como padrão de downloads do seu navegador.'],
      ['Consigo baixar só o áudio?', 'Sim, selecionando “Áudio MP3”.'],
      ['Por que a busca falhou?', 'O vídeo pode ser privado, ter sido apagado ou estar bloqueado para o IP do servidor.']
    ]
  },
  {
    slug: 'instagram-video',
    title: 'Baixar vídeos do Instagram pelo link — PegaLink',
    description: 'Salve posts em vídeo do Instagram pelo link em MP4 ou MP3. Sem login, sem cadastro e sem aplicativo: cole a URL e baixe direto no navegador.',
    keywords: 'baixar video do instagram, instagram video download, salvar video do instagram, download instagram mp4, baixar post do instagram, instagram video downloader sem login',
    h1: 'Como baixar vídeos do Instagram pelo link',
    lead: 'Posts em vídeo de contas públicas podem ser salvos pelo link. Copie a URL da publicação, cole no PegaLink e escolha entre MP4 para imagem e som ou MP3 para apenas áudio.',
    steps: [
      'No Instagram, toque nos três pontos do post e escolha “Copiar link”.',
      'Cole a URL no campo do PegaLink; a busca inicia sozinha.',
      'Confira se o título e a miniatura correspondem ao post desejado.',
      'Selecione MP4 ou MP3 e clique para baixar.'
    ],
    tips: [
      'Conteúdos de contas públicas são os que funcionam melhor.',
      'Publicações que exigem login podem não ser acessíveis.',
      'Respeite direitos autorais e baixe apenas conteúdo próprio ou permitido.'
    ],
    faq: [
      ['Preciso estar logado no Instagram?', 'Não. Para posts públicos, o link é suficiente.'],
      ['Funciona para fotos?', 'O foco do PegaLink é vídeo e áudio; o resultado depende do que o link disponibiliza.'],
      ['Posso salvar o áudio do post?', 'Sim, quando há faixa de áudio, escolha “Áudio MP3”.'],
      ['Por que nada apareceu?', 'O post pode ser privado, ter sido removido ou estar restrito.'],
      ['O PegaLink é oficial?', 'Não. Somos independentes e não afiliados ao Instagram.']
    ]
  },
  {
    slug: 'instagram-stories',
    title: 'Baixar stories do Instagram pelo link — PegaLink',
    description: 'Tente salvar stories públicos do Instagram pelo link em MP4. Basta colar a URL no navegador, sem login, sem cadastro e sem instalar programas.',
    keywords: 'baixar stories do instagram, download stories instagram, salvar story instagram, story downloader instagram, baixar story sem login, salvar story do instagram no celular',
    h1: 'Como baixar stories do Instagram pelo link',
    lead: 'Stories públicos que possuem um link de compartilhamento podem ser testados no PegaLink. Cole a URL, clique em buscar e veja se há um arquivo de mídia disponível.',
    steps: [
      'Copie o link de compartilhamento do story no Instagram.',
      'Cole a URL no campo do PegaLink.',
      'Aguarde a busca automática carregar as opções.',
      'Se aparecer um formato MP4, selecione-o e baixe o arquivo.'
    ],
    tips: [
      'Stories que exigem login ou seguem listas restritas podem falhar.',
      'Links de stories temporários podem expirar rapidamente.',
      'Conteúdo de contas privadas não é acessível sem autorização.'
    ],
    faq: [
      ['Consigo baixar story sem entrar na minha conta?', 'Para stories públicos com link, sim. Conteúdo restrito não é acessível.'],
      ['Por que o link expirou?', 'Stories desaparecem após o prazo da plataforma; links antigos deixam de funcionar.'],
      ['O story vira um vídeo?', 'Quando a mídia publicada é um vídeo, ela aparece como MP4 na lista.'],
      ['Dá para salvar o áudio?', 'Se o story tiver áudio, a opção MP3 também aparece.'],
      ['É gratuito?', 'Sim, sem cadastro e sem anúncios.']
    ]
  },
  {
    slug: 'youtube-mp4',
    title: 'Baixar YouTube em MP4 pelo link — PegaLink',
    description: 'Baixe vídeos do YouTube em MP4 com a resolução escolhida. Links de vídeo, Shorts e youtu.be, com áudio, direto no navegador e sem cadastro.',
    keywords: 'baixar youtube mp4, youtube mp4, baixar video do youtube em mp4, youtube video download mp4, salvar video youtube mp4, download youtube hd',
    h1: 'Como baixar vídeos do YouTube em MP4',
    lead: 'Cole a URL de um vídeo público do YouTube e escolha a resolução MP4 desejada. O PegaLink monta o arquivo com imagem e áudio e entrega o download no seu navegador.',
    steps: [
      'Copie o link do vídeo no app do YouTube ou na barra de endereços.',
      'Cole a URL no PegaLink; a busca começa automaticamente.',
      'Escolha “Melhor qualidade”, “Qualidade leve” ou uma resolução disponível.',
      'Clique para baixar o MP4 e salve no seu dispositivo.'
    ],
    tips: [
      'Links youtube.com, youtu.be, Shorts e vídeos de playlist funcionam, um por vez.',
      'Resoluções maiores, como 1080p e 4K, geram arquivos maiores.',
      'Vídeos privados, apagados ou com restrição de idade podem não ser acessíveis.'
    ],
    faq: [
      ['O MP4 vem com áudio?', 'Sim, quando a plataforma disponibiliza as faixas de vídeo e áudio.'],
      ['Posso baixar em 1080p ou 4K?', 'Se o vídeo original oferecer essas resoluções, elas aparecem na lista.'],
      ['Funciona com Shorts?', 'Sim. Um Short é tratado como um vídeo comum.'],
      ['Posso baixar uma playlist inteira?', 'Não. O PegaLink baixa um vídeo por vez.'],
      ['Por que apareceu aviso de bloqueio?', 'O YouTube pode limitar acessos de alguns IPs; tente novamente em instantes.']
    ]
  },
  {
    slug: 'shorts-mp3',
    title: 'Baixar áudio de YouTube Shorts em MP3 — PegaLink',
    description: 'Extraia o áudio de vídeos do YouTube Shorts em MP3 pelo link. Gratuito, sem cadastro, sem aplicativo e sem anúncios, direto no navegador.',
    keywords: 'shorts mp3, baixar audio de shorts, youtube shorts mp3, extrair mp3 do shorts, salvar som do shorts, download mp3 youtube shorts',
    h1: 'Como baixar áudio de YouTube Shorts em MP3',
    lead: 'Gostou da música ou do som de um Short? Copie o link de compartilhamento, cole no PegaLink e escolha “Áudio MP3” para salvar apenas o som.',
    steps: [
      'Abra o Short no YouTube e toque em “Compartilhar”.',
      'Escolha “Copiar link” e cole a URL no PegaLink.',
      'Aguarde a busca automática mostrar os formatos.',
      'Selecione “Áudio MP3” e clique para baixar.'
    ],
    tips: [
      'A qualidade segue a faixa de áudio original do Short.',
      'Use apenas áudio que você tenha permissão para salvar.',
      'No celular, o MP3 costuma ir para a pasta de downloads.'
    ],
    faq: [
      ['Shorts têm áudio extraível?', 'Sim, quando o vídeo original possui faixa de áudio.'],
      ['Preciso converter depois?', 'Não. O arquivo já chega em MP3.'],
      ['É gratuito?', 'Sim, sem cadastro e sem anúncios.'],
      ['Funciona no celular?', 'Sim, em Android e iPhone pelo navegador.'],
      ['Posso usar o áudio em outro vídeo?', 'Somente com autorização de quem detém os direitos.']
    ]
  },
  {
    slug: 'converter-video-mp3',
    title: 'Converter vídeo para MP3 online pelo link — PegaLink',
    description: 'Converta vídeos de YouTube, TikTok e Instagram para MP3 pelo link. Extração online, sem cadastro, sem instalar conversor e sem anúncios.',
    keywords: 'converter video para mp3, video para mp3 online, extrair audio de video, converter youtube para mp3, converter tiktok para mp3, download mp3 de video',
    h1: 'Como converter vídeo para MP3 online',
    lead: 'Você não precisa baixar o vídeo inteiro para ouvir o som. Cole a URL no PegaLink, escolha “Áudio MP3” e salve o arquivo convertido direto no seu dispositivo.',
    steps: [
      'Copie o link do vídeo na plataforma de origem.',
      'Cole a URL no campo do PegaLink e aguarde a busca automática.',
      'Selecione a opção “Áudio MP3” na lista de formatos.',
      'Clique para baixar e salve o MP3 no celular ou computador.'
    ],
    tips: [
      'A conversão acontece no servidor; você não instala nenhum programa.',
      'A qualidade depende do áudio original do vídeo.',
      'Respeite direitos autorais: converta apenas conteúdo próprio ou autorizado.'
    ],
    faq: [
      ['O conversor é gratuito?', 'Sim. Sem cadastro, sem assinatura e sem anúncios.'],
      ['Quais plataformas funcionam?', 'YouTube, TikTok e Instagram, por links públicos.'],
      ['O MP3 sai em alta qualidade?', 'A ferramenta usa a melhor faixa de áudio disponibilizada no vídeo.'],
      ['Preciso instalar algo?', 'Não. Tudo acontece no navegador.'],
      ['Posso converter vários vídeos de uma vez?', 'Não. O PegaLink processa um link por vez.']
    ]
  },
  {
    slug: 'mapa-do-site',
    title: 'Mapa do site PegaLink — todos os guias de download',
    description: 'Navegue por todos os guias do PegaLink: YouTube, TikTok, Instagram, MP4, MP3, Shorts, Reels e muito mais. Encontre rapidamente a página que você precisa.',
    keywords: 'mapa do site pegalink, todos os guias, navegar site, sitemap html, download de video guides',
    h1: 'Mapa do site PegaLink',
    lead: 'Aqui estão todos os guias e páginas do PegaLink em um só lugar. Escolha o assunto ou a plataforma desejada e comece a baixar seu vídeo em MP4 ou MP3.',
    steps: [
      'Escolha abaixo o guia da plataforma: YouTube, TikTok ou Instagram.',
      'Abra a página para ver o passo a passo específico e as perguntas frequentes.',
      'Volte ao início, cole o link do vídeo e escolha MP4 ou MP3.'
    ],
    tips: [
      'Prefira vídeos públicos, com link compartilhável.',
      'Todos os guias funcionam no celular e no computador, pelo navegador.',
      'O mapa em XML para mecanismos de busca está disponível em /sitemap.xml.'
    ],
    faq: [
      ['O que é o mapa do site?', 'É uma lista com links para todas as páginas do PegaLink, para facilitar a navegação de pessoas e buscadores.'],
      ['Onde está o sitemap XML?', 'Em https://pegalink.onrender.com/sitemap.xml, usado pelo Google e outros mecanismos de busca.'],
      ['Preciso criar conta para usar os guias?', 'Não. Todo o conteúdo é livre e o download não pede cadastro.'],
      ['Quais plataformas têm guia?', 'YouTube, TikTok e Instagram, incluindo Shorts, Reels, stories, MP4 e MP3.'],
      ['Posso sugerir um novo guia?', 'Sim. Use os canais de contato do projeto para enviar sua sugestão.']
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

// Termos de busca observados nos sites de referência do nicho, reescritos com a
// marca própria. A meta keywords tem peso baixo no Google, mas ajuda a alinhar
// título, descrição, conteúdo e intenção de busca em cada página.
const COMMON_SEARCH_TAGS = [
  'baixar vídeo pelo link',
  'download de vídeo online',
  'salvar vídeo no celular',
  'baixar vídeo no computador',
  'sem cadastro',
  'sem aplicativo',
  'sem anúncios',
  'grátis'
];

function keywordsFor(page) {
  const slug = page.slug;
  const extra = [];

  if (slug.includes('tiktok') || slug.includes('reels')) {
    extra.push(
      'tiktok video download',
      'baixar video tiktok sem marca d agua',
      'video tiktok sem marca',
      'baixar tiktok hd',
      'salvar video tiktok',
      'converter tiktok para mp4',
      'baixar slideshow tiktok',
      'download tiktok video gratis'
    );
  }
  if (slug.includes('youtube') || slug.includes('shorts')) {
    extra.push(
      'baixador de videos do youtube',
      'youtube video download',
      'baixar video do youtube',
      'youtube 1080p 2k 4k',
      'salvar video do youtube',
      'baixar youtube pelo celular',
      'youtube music',
      'link youtu.be'
    );
  }
  if (slug.includes('instagram')) {
    extra.push(
      'baixar video do instagram',
      'instagram video download',
      'reels video download',
      'salvar reels do instagram',
      'baixar stories do instagram',
      'download instagram sem login'
    );
  }
  if (slug.includes('mp3') || slug.includes('audio')) {
    extra.push('extrair audio de video', 'converter video para mp3', 'download mp3 gratis', 'salvar audio de video');
  }
  if (slug.includes('mp4') || slug.includes('hd')) {
    extra.push('video em mp4', 'baixar video hd', 'salvar video em mp4', 'video com audio');
  }

  return Array.from(
    new Set([
      ...page.keywords.split(',').map((tag) => tag.trim()),
      ...COMMON_SEARCH_TAGS,
      ...extra
    ].filter(Boolean))
  ).join(', ');
}

function getPages() {
  return pages;
}

function findPage(slug) {
  return pages.find((page) => page.slug === slug);
}

function renderPage(page, base) {
  const url = `${base}/${page.slug}`;
  const keywords = escapeHtml(keywordsFor(page));
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);

  const steps = page.steps
    .map((step, index) => `<li><strong>${index + 1}.</strong> ${escapeHtml(step)}</li>`)
    .join('\n');
  const tips = page.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('\n');
  const aboutHtml = page.about
    ? `<section id="sobre">
        <h2>${escapeHtml(page.about.heading)}</h2>
        <p>${escapeHtml(page.about.text)}</p>
        <ul>${page.about.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('\n')}</ul>
      </section>`
    : '';
  const faqHtml = page.faq
    .map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`)
    .join('\n');
  // Links internos contextuais: prioriza guias da mesma plataforma e do mesmo
  // formato. Isso ajuda o Google a entender o tema de cada página e distribui
  // autoridade para as páginas mais relacionadas.
  function platformOf(slug) {
    if (slug.includes('tiktok')) return 'tiktok';
    if (slug.includes('instagram') || slug.includes('reels') || slug.includes('stories')) return 'instagram';
    if (slug.includes('youtube') || slug.includes('shorts')) return 'youtube';
    return null;
  }

  const currentPlatform = platformOf(page.slug);
  const related = pages
    .map((item, index) => {
      let score = 0;
      if (item.slug === page.slug) score -= 100;
      if (currentPlatform && platformOf(item.slug) === currentPlatform) score += 10;
      if (page.slug.includes('mp3') && item.slug.includes('mp3')) score += 8;
      if (page.slug.includes('mp4') && item.slug.includes('mp4')) score += 6;
      if (page.slug.includes('hd') && item.slug.includes('hd')) score += 6;
      if (item.slug === 'mapa-do-site') score += 1;
      return { item, index, score };
    })
    .filter((entry) => entry.item.slug !== page.slug)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 6)
    .map((entry) => `<a href="/${entry.item.slug}">${escapeHtml(entry.item.h1)}</a>`)
    .join('\n');

  const links = pages
    .map((item) => `<a href="/${item.slug}">${escapeHtml(item.h1)}</a>`)
    .join('\n');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'PegaLink',
        url: `${base}/`,
        logo: `${base}/favicon.svg`,
        description: 'Ferramenta online para salvar vídeos públicos pelo link em MP4 e MP3.'
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: 'PegaLink',
        url: `${base}/`,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${base}/#organization` }
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        keywords: keywordsFor(page),
        isPartOf: { '@id': `${base}/#website` },
        inLanguage: 'pt-BR',
        dateModified: '2026-11-23',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${base}/og-image.png`,
          width: 1200,
          height: 630
        }
      },
      {
        '@type': 'WebApplication',
        name: 'PegaLink',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Windows, macOS, Linux, iOS, Android',
        inLanguage: 'pt-BR',
        featureList: ['Download em MP4', 'Áudio em MP3', 'Busca automática ao colar o link', 'Escolha de qualidade', 'Sem cadastro', 'Sem anúncios'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        publisher: { '@id': `${base}/#organization` }
      },
      page.slug === 'mapa-do-site'
        ? {
            '@type': 'ItemList',
            name: page.h1,
            description: page.lead,
            numberOfItems: pages.length,
            itemListElement: pages.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.h1,
              url: `${base}/${item.slug}`
            }))
          }
        : {
            '@type': 'HowTo',
            name: page.h1,
            description: page.lead,
            totalTime: 'PT1M',
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
  <meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1, max-snippet:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1">
  <meta name="author" content="PegaLink">
  <meta name="creator" content="PegaLink">
  <meta name="publisher" content="PegaLink">
  <meta name="category" content="technology">
  <meta name="google" content="notranslate">
  <meta name="language" content="pt-BR">
  <meta http-equiv="content-language" content="pt-BR">
  <meta name="format-detection" content="telephone=no">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="pt-BR" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <link rel="sitemap" type="application/xml" title="Mapa do site PegaLink" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="PegaLink">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${base}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="PegaLink — download de vídeos pelo link em MP4 e MP3">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${base}/og-image.png">
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
      <a href="/mapa-do-site">Mapa do site</a>
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

      ${aboutHtml}

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
        <h2>${page.slug === 'mapa-do-site' ? 'Todas as páginas do PegaLink' : 'Explore outros guias'}</h2>
        <div class="feature-grid">${page.slug === 'mapa-do-site' ? links : related}</div>
      </section>
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

</body>
</html>`;
}

module.exports = { getPages, findPage, renderPage, escapeHtml };
