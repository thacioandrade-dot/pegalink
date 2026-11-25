'use strict';

// Seções exclusivas para os guias que antes tinham apenas passos e FAQ.
// Cada texto fala da intenção real daquela busca — nada de parágrafo genérico
// repetido entre páginas, que não ajuda o leitor nem o posicionamento.
module.exports = {
  'youtube-mp3': {
    heading: 'Por que extrair só o áudio do YouTube',
    text: 'Nem sempre você precisa do vídeo: podcasts, entrevistas, aulas e músicas ficam melhores como arquivo de som. O PegaLink lê a faixa original de um vídeo público e entrega um MP3 pronto para ouvir offline, sem instalar conversor. A qualidade acompanha o que o autor publicou — um vídeo com áudio comprimido não ganha detalhes extras na conversão.',
    points: [
      'Funciona com links públicos de vídeos e Shorts.',
      'O MP3 é gerado no servidor e enviado direto para o seu dispositivo.',
      'Não é preciso baixar o vídeo inteiro antes de converter.'
    ]
  },
  reels: {
    heading: 'O que saber antes de salvar um Reel',
    text: 'Reels são publicações públicas do Instagram que normalmente têm link de compartilhamento. Quando esse link abre sem exigir login, o PegaLink consegue ler o arquivo e oferecer MP4 para manter imagem e som ou MP3 para guardar apenas o áudio. Publicações de contas privadas, apagadas ou sem link compartilhável não podem ser processadas.',
    points: [
      'Use o link do Reel, não o link do perfil.',
      'No celular, o arquivo costuma cair na pasta Download.',
      'Respeite os direitos de quem publicou o conteúdo.'
    ]
  },
  'como-baixar-video': {
    heading: 'Como reconhecer um bom link de compartilhamento',
    text: 'Um link útil aponta para um único vídeo público e abre no navegador sem exigir login. No YouTube, use o botão Compartilhar; no TikTok, toque em Compartilhar e Copiar link; no Instagram, escolha Copiar link na publicação. Links de playlist, perfil ou feed inteiro não são aceitos, porque o serviço trabalha com um arquivo por vez.',
    points: [
      'Copie a URL completa, incluindo o domínio.',
      'Confira se o vídeo abre antes de colar no campo.',
      'Se a busca falhar, tente gerar um link novo pela plataforma.'
    ]
  },
  'video-gratis': {
    heading: 'Grátis de verdade, sem cadastro',
    text: 'O PegaLink não pede e-mail, conta ou cartão. Você cola um link público, recebe as opções disponíveis e escolhe o formato. O serviço é mantido por anúncios, então a página pode mostrar banners — eles não liberam download pago nem liberam arquivo superior mediante pagamento.',
    points: [
      'Sem limite diário de buscas para uso normal.',
      'Sem histórico salvo no servidor.',
      'Use apenas conteúdo próprio ou autorizado.'
    ]
  },
  'tiktok-sem-marca-dagua': {
    heading: 'Sobre a marca d’água do TikTok',
    text: 'O PegaLink entrega o arquivo que a plataforma disponibiliza para aquele link. Se a marca d’água faz parte do arquivo original publicado pelo autor, ela permanece no download: nenhum serviço consegue remover uma marca incorporada ao vídeo sem reeditá-lo. O que o site faz é oferecer a versão original em MP4, sem recompressão, na maior resolução disponível.',
    points: [
      'A opção Full HD 1080p usa o arquivo original quando existe.',
      'HD 720p é uma versão comprimida, com arquivo menor.',
      'Vídeos privados ou excluídos não podem ser lidos.'
    ]
  },
  'tiktok-mp3': {
    heading: 'Quando vale mais ficar só com o áudio',
    text: 'Muitos TikToks são apenas uma música, um podcast ou uma narração. Nesses casos, o MP3 ocupa muito menos espaço e abre em qualquer player. O PegaLink separa a faixa de áudio do vídeo original e entrega um arquivo com cabeçalho MP3, sem precisar instalar aplicativo de conversão.',
    points: [
      'Escolha “Áudio MP3” depois que a busca terminar.',
      'A qualidade segue a faixa original do TikTok.',
      'O download começa logo após o clique, em streaming.'
    ]
  },
  'tiktok-stories': {
    heading: 'Stories e formatos temporários',
    text: 'Stories e apresentações curtas do TikTok só podem ser lidos enquanto estiverem públicos e com link compartilhável. Depois que o autor remove a publicação ou muda a privacidade, o link deixa de funcionar. O PegaLink tenta o arquivo disponível no momento da busca e mostra as opções reais daquela publicação.',
    points: [
      'Copie o link antes que a publicação expire.',
      'Abra o link em outra aba para confirmar que ele ainda existe.',
      'Conteúdo de conta privada não é acessível.'
    ]
  },
  'tiktok-hd': {
    heading: 'O que significam Full HD e HD aqui',
    text: 'Full HD 1080p é o arquivo original de maior resolução que o TikTok oferece para aquele link, sem recompressão. HD 720p é uma versão reduzida pela própria plataforma: a imagem continua nítida, mas o arquivo é bem menor. Essa diferença importa em celular com pouco espaço ou conexão lenta.',
    points: [
      'Full HD costuma ser o arquivo mais pesado.',
      'HD 720p é indicado para compartilhar ou arquivar com economia.',
      'A lista de opções depende do que o autor publicou.'
    ]
  },
  'tiktok-video-download': {
    heading: 'Download de TikTok pelo navegador',
    text: 'Não é preciso instalar aplicativo para salvar um TikTok público: o processo todo acontece no navegador. Copie a URL de compartilhamento, cole no PegaLink e aguarde a leitura das opções. O servidor procura os formatos reais daquele arquivo e devolve somente os que existem — nunca uma resolução inventada.',
    points: [
      'Funciona em Android, iPhone e computador.',
      'Escolha MP4 para vídeo ou MP3 para som.',
      'Nenhum cadastro é solicitado.'
    ]
  },
  'tiktok-slideshow': {
    heading: 'Slideshow vira arquivo de vídeo',
    text: 'Apresentações de slides do TikTok são montadas pela plataforma como um vídeo. Por isso, quando o link é público, o PegaLink consegue entregar um MP4 com a sequência completa de imagens e a trilha sonora. A resolução e a duração acompanham o que foi publicado.',
    points: [
      'Copie o link da apresentação, não da conta.',
      'O arquivo sai em MP4, reproduzível no celular.',
      'Se o slideshow tiver sido apagado, o link não funciona.'
    ]
  },
  'tiktok-celular': {
    heading: 'Baixando no celular sem aplicativo',
    text: 'Abra o PegaLink no navegador do celular, cole o link do TikTok e escolha o formato. No Android, o arquivo costuma aparecer na pasta Download. No iPhone, o navegador pode abrir a prévia e oferecer a opção de salvar em Arquivos. O processo não pede acesso à galeria nem instala extensão.',
    points: [
      'Use o navegador atualizado do seu sistema.',
      'Prefixo www ou link curto: ambos funcionam se o vídeo for público.',
      'Fique atento ao espaço livre antes de escolher Full HD.'
    ]
  },
  'tiktok-pc': {
    heading: 'No computador, direto pela barra de endereço',
    text: 'No desktop você pode copiar a URL da barra do navegador ou usar o botão Compartilhar do TikTok. Cole no campo do PegaLink, confirme o título exibido e escolha MP4 ou MP3. O download começa no mesmo clique e o navegador salva o arquivo na pasta padrão.',
    points: [
      'Confira se o título corresponde ao vídeo esperado.',
      'Full HD gera arquivo maior que HD 720p.',
      'Não é necessário instalar programa no computador.'
    ]
  },
  'instagram-video': {
    heading: 'Limites reais dos posts do Instagram',
    text: 'O PegaLink lê somente conteúdo público que tenha link compartilhável. Posts de contas privadas, mídias apagadas e links que exigem login não podem ser processados — isso é uma limitação da plataforma, não do navegador. Quando o link funciona, você recebe MP4 para imagem e som ou MP3 para áudio.',
    points: [
      'Abra a publicação no navegador antes de colar a URL.',
      'Reels e posts em vídeo seguem o mesmo fluxo.',
      'O arquivo é enviado direto, sem passar por e-mail.'
    ]
  },
  'instagram-stories': {
    heading: 'Stories disponíveis enquanto estiverem no ar',
    text: 'Stories de contas públicas podem ter link de compartilhamento enquanto permanecem publicados. Assim que o período termina ou o autor remove o story, o endereço deixa de retornar o arquivo. O PegaLink mostra as opções disponíveis no momento da busca, sem prometer formatos que a plataforma não entrega.',
    points: [
      'Copie o link logo ao abrir o story.',
      'Se a busca falhar, confirme se o story ainda está visível.',
      'Conteúdo de perfil privado não é acessível.'
    ]
  },
  'youtube-mp4': {
    heading: 'Escolhendo a resolução MP4 certa',
    text: 'Depois da busca, o PegaLink mostra apenas resoluções que realmente existem para aquele vídeo. “Melhor qualidade” entrega o maior arquivo disponível, sem cair para uma versão menor. HD 720p e SD 480p são alternativas mais leves, indicadas quando espaço ou conexão são limitados.',
    points: [
      'MP4 mantém imagem e áudio no mesmo arquivo.',
      'A resolução exibida é a real do arquivo entregue.',
      'Áudio separado está disponível na opção MP3.'
    ]
  },
  'shorts-mp3': {
    heading: 'Extraindo o som de um Short',
    text: 'Shorts têm duração curta, mas podem conter justamente a parte de uma música ou fala que você quer guardar. O PegaLink usa a faixa original do vídeo e gera um MP3 pequeno, pronto para ouvir offline. Não há conversão manual nem necessidade de baixar o vídeo primeiro.',
    points: [
      'Cole o link de compartilhamento do Short.',
      'Escolha “Áudio MP3” na lista de formatos.',
      'O tamanho final depende da duração e da faixa original.'
    ]
  },
  'converter-video-mp3': {
    heading: 'Conversão online sem instalar nada',
    text: 'Converter vídeo para MP3 normalmente exige um programa pesado. Aqui a conversão acontece no servidor: você informa a URL pública, o sistema localiza a faixa de áudio e devolve um arquivo MP3. Nada é instalado no computador e nenhum dado seu fica salvo.',
    points: [
      'Aceita links de YouTube, TikTok e Instagram.',
      'A qualidade final acompanha o áudio original.',
      'Arquivos privados ou protegidos não são processados.'
    ]
  },
  'mapa-do-site': {
    heading: 'Como usar este mapa',
    text: 'Esta página reúne todos os guias do PegaLink em um só lugar. Ela serve para navegar pelo site e também para que mecanismos de busca encontrem cada assunto sem depender de JavaScript. Os links abaixo levam a páginas com passos, dicas e perguntas frequentes específicas para cada plataforma ou formato.',
    points: [
      'Comece pela plataforma: YouTube, TikTok ou Instagram.',
      'Para áudio, procure os guias de MP3.',
      'O sitemap XML para buscadores fica em /sitemap.xml.'
    ]
  }
};
