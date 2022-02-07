RSS
###

O helper RSS torna a geração de XML para feeds RSS uma moleza.

Criando um feed RSS com o RssHelper
===================================

Este exemplo assume que você tem um Posts Controller e um Post Model já
criados e quer criar uma visão alternativa com RSS.

Criar uma versão xml/rss de posts/index com o CakePHP 1.2 é moleza.
Depois de uns poucos (e simples) passos, você pode apenas anexar a
extensão .rss à URL posts/index, chamando-a como posts/index.rss. Mas
antes de dar esse grande passo à frente, vamos tentar ter nosso
webservice no ar e funcionando. Primeiro, o parseExtensions precisa ser
ativado, isto é feito no arquivo app/config/routes.php

::

          Router::parseExtensions('rss');

Na chamada acima, ativamos a extensão .rss. Ao usar
Router::parseExtensions(), você pode passar tantos argumentos ou
extensões quantos você quiser. Isto vai ativar cada uma das
extensões/content-type para uso em sua aplicação. Agora quanto o
endereço posts/index.rss for requisitado, você obterá uma versão xml de
sua view posts/index. No entanto, primeiro precisamos editar o
controller para adicionar o código específico para rss.

Código do Controller
--------------------

É uma boa ideia adicionar o RequestHandler ao array $components de seu
PostsController. Isto permite que uma porção de coisas automágicas
aconteçam.

::

        var $components = array('RequestHandler');

Antes de podermos fazer uma versão RSS de nosso posts/index, precisamos
deixar algumas coisas em ordem. Pode ser tentador colocar o canal de
metadados na action do controller e passá-lo para sua view usando o
método Controller::set(), mas isto é inapropriado. Esta informação
também pode ir na view. Falaremos sobre isto depois, mas por agora, se
você tiver um conjunto diferente de lógica sobre os dados para fazer com
que o feed RSS e os dados para a view HTML, você pode usar o método
RequestHandler::isRss(), do contrário seu controller pode continuar do
mesmo jeito.

::

    // Modificar a action do PostsController que corresponda
    // à action que despacha o feed RSS, que é a ação index
    // neste nosso exemplo

    public function index(){
        if( $this->RequestHandler->isRss() ){
            $posts = $this->Post->find('all', array('limit' => 20, 'order' => 'Post.created DESC'));
            $this->set(compact('posts'));
        } else {
            // esta não é uma requisição rss, então despache
            // os dados usados pela interface do website
            $this->paginate['Post'] = array('order' => 'Post.created DESC', 'limit' => 10);
            
            $posts = $this->paginate();
            $this->set(compact('posts'));
        }
    }

Com todas as variáveis da View definidas, precisamos criar um layout
rss.

Layout
~~~~~~

Um layout Rss é muito simples. Ponha o seguinte conteúdo em
app/views/layouts/rss/default.ctp:

::

    echo $rss->header();
    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $title_for_layout;
    } 
    $channel = $rss->channel(array(), $channelData, $content_for_layout);
    echo $rss->document($documentData,$channel);

Não parece, mas graças ao poder do RssHelper, ele está fazendo a maior
parte do trabalho pesado pra nós. Não definimos $documentData ou
$channelData no controller, entretanto, no CakePHP 1.2 as suas views
podem passar variáveis de volta para o layout. É aqui que nosso array
$channelData virá configurar todos os metadados para nosso feed.

A seguir está o arquivo de view para nosso posts/index. Muito parecido
com o arquivo de layout que criamos, precisamos criar um diretório
views/posts/rss/ e criar um novo arquivo index.ctp dentro dele. O
conteúdo deste arquivo é mostrado abaixo.

View
~~~~

Nossa view, presente em ``app/views/posts/rss/index.ctp``, começa
definindo as variáveis $documentData e $channelData para o layout, que
contém todos os metadados para nosso feed RSS. Isto é feito usando-se o
método View::set(), que é análogo ao método Controller::set(). Aqui
estamos passando os metadados do canal de volta para o layout.

::

        $this->set('documentData', array(
            'xmlns:dc' => 'http://purl.org/dc/elements/1.1/'));

        $this->set('channelData', array(
            'title' => __("Most Recent Posts", true),
            'link' => $html->url('/', true),
            'description' => __("Most recent posts.", true),
            'language' => 'en-us'));

A segunda parte da view gera os elementos para os registros atuais do
feed. Isto é feito varrendo-se os dados que forem passados para a view
($items) e usando-se o método RssHelper::item(). O outro método que você
pode usar é o RssHelper::items(), que leva um callback e um array de
itens para o feed. (Eu costumo sempre chamar o método de callback que
utilizo de transformRss(). Mas há um ponto negativo neste método, que é
o fato de você não poder usar quaisquer outras classes de helpers para
preparar seus dados dentro do método de callback porque o escopo de
dentro do método de callback não inclui nada que não seja passado para
ele, não lhe dando, assim, acesso, p.ex., ao TimeHelper ou a qualquer
outro helper de que você precise. O método RssHelper::item() transforma
o array associativo em um elemento para cada par de chave/valor.

::

        foreach ($posts as $post) {
            $postTime = strtotime($post['Post']['created']);
     
            $postLink = array(
                'controller' => 'entries',
                'action' => 'view',
                'year' => date('Y', $postTime),
                'month' => date('m', $postTime),
                'day' => date('d', $postTime),
                $post['Post']['slug']);
            // você deve importar Sanitize
            App::import('Sanitize');
            // esta é a parte em que limpamos o corpo do texto como a descrição
            // do item rss, que precisa ter apenas texto para garantir que o feed valide
            $bodyText = preg_replace('=\(.*?\)=is', '', $post['Post']['body']);
            $bodyText = $text->stripLinks($bodyText);
            $bodyText = Sanitize::stripAll($bodyText);
            $bodyText = $text->truncate($bodyText, 400, '...', true, true);
     
            echo  $rss->item(array(), array(
                'title' => $post['Post']['title'],
                'link' => $postLink,
                'guid' => array('url' => $postLink, 'isPermaLink' => 'true'),
                'description' =>  $bodyText,
                'dc:creator' => $post['Post']['author'],
                'pubDate' => $post['Post']['created']));
        }

Você pode ver acima que podemos usar o laço para preparar os dados a
serem transformados em elementos XML. É importante filtrar quaisquer
caracteres que não sejam de texto plano da descrição, especialmente se
você estiver usando um editor de texto rico para preencher o texto do
corpo dos posts de seu blog. No código acima usamos o método
TextHelper::stripLinks() e uns poucos métodos da classe Sanitize, mas
recomendados que você escreva um compreensivo helper de limpeza de texto
para realmente manter seu texto limpo. Uma vez que tenhamos configurado
os dados para o feed, nós podemos usar o método RssHelper::item() para
criar o XML no formato RSS. Uma vez que você tenha feito toda esta
configuração, você pode testar seu feed RSS acessando o endereço
/posts/index.rss em seu site. É sempre importante que você valide seu
feed RSS antes de disponibilizá-lo pra valer. Isto pode ser feito
visitando-se sites que validem conteúdos XML como o Feed Validator ou o
site do W3C em https://validator.w3.org/feed/.

Você pode precisar definir o valor de 'debug' de sua configuração no
core.php para 1 ou para 0 para obter um feed válido, porque as
informações de depuração adicionadas automaticamente nos níveis mais
altos de debug quebram a sintaxe XML ou as regras de validação dos
feeds.
