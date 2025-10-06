Url
###

.. php:namespace:: Cake\View\Helper

.. php:class:: UrlHelper(View $view, array $config = [])

O UrlHelper ajuda você a gerar URLs de seus outros helpers.
Ele também oferece um único lugar para personalizar como as URLs são geradas
sobrescrevendo o helper principal com um da aplicação. Veja a
seção :ref:`aliasing-helpers` para saber como fazer isso.

Gerando URLs
============

.. php:method:: build($url = null, array $options = [])

Retorna uma URL apontando para uma combinação de controller e action.
Se ``$url`` estiver vazia, retorna o ``REQUEST_URI``, caso contrário
gera a URL para a combinação de controller e action. Se ``fullBase`` for
``true``, a URL base completa será anexada ao resultado::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'view',
        'bar',
    ]);

    // Saída
    /posts/view/bar

Aqui estão mais alguns exemplos de uso:

URL com extensão::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'list',
        '_ext' => 'rss',
    ]);

    // Saída
    /posts/list.rss

URL com prefixo::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'list',
        'prefix' => 'Admin',
    ]);

    // Saída
    /admin/posts/list

URL (começando com '/') com a URL base completa anexada::

    echo $this->Url->build('/posts', ['fullBase' => true]);

    // Saída
    http://somedomain.com/posts

URL com parâmetros GET e âncora de fragmento::

    echo $this->Url->build([
        'controller' => 'Posts',
        'action' => 'search',
        '?' => ['foo' => 'bar'],
        '#' => 'first',
    ]);

    // Saída
    /posts/search?foo=bar#first

O exemplo acima usa a chave especial ``?`` para especificar parâmetros de query string
e a chave ``#`` para fragmento de URL.

URL para rota nomeada::

    // Assumindo que uma rota está configurada como rota nomeada:
    // $router->connect(
    //     '/products/{slug}',
    //     [
    //         'controller' => 'Products',
    //         'action' => 'view',
    //     ],
    //     [
    //         '_name' => 'product-page',
    //     ]
    // );

    echo $this->Url->build(['_name' => 'product-page', 'slug' => 'i-m-slug']);
    // Resultará em:
    /products/i-m-slug

O 2º parâmetro permite que você defina opções controlando o escape de HTML e
se o caminho base deve ser adicionado ou não::

    $this->Url->build('/posts', [
        'escape' => false,
        'fullBase' => true,
    ]);

.. php:method:: buildFromPath(string $path, array $params = [], array $options = [])

Se você quiser usar strings de caminho de rota, pode fazer isso usando este método::

    echo $this->Url->buildFromPath('Articles::index');
    // saída: /articles

    echo $this->Url->buildFromPath('MyBackend.Admin/Articles::view', [3]);
    // saída: /admin/my-backend/articles/view/3

URL com timestamp de asset envolvida por ``<link rel="preload"/>``, aqui pré-carregando
uma fonte. Nota: O arquivo deve existir e ``Configure::read('Asset.timestamp')``
deve retornar ``true`` ou ``'force'`` para que o timestamp seja anexado::

    echo $this->Html->meta([
        'rel' => 'preload',
        'href' => $this->Url->assetUrl(
            '/assets/fonts/your-font-pack/your-font-name.woff2'
        ),
        'as' => 'font',
    ]);

Se você está gerando URLs para arquivos CSS, Javascript ou de imagem, existem métodos
helper para cada um desses tipos de assets::

    // Saída /img/icon.png
    $this->Url->image('icon.png');

    // Saída /js/app.js
    $this->Url->script('app.js');

    // Saída /css/app.css
    $this->Url->css('app.css');

    // Força timestamps para uma chamada de método.
    $this->Url->css('app.css', ['timestamp' => 'force']);

    // Ou desabilita timestamps para uma chamada de método.
    $this->Url->css('app.css', ['timestamp' => false]);

Personalizando a Geração de URL de Assets
==========================================

Se você precisar personalizar como as URLs de assets são geradas, ou deseja usar parâmetros
personalizados de cache busting de assets, pode usar a opção ``assetUrlClassName``::

    // Em view initialize
    $this->loadHelper('Url', ['assetUrlClassName' => AppAsset::class]);

Ao usar ``assetUrlClassName`` você deve implementar os mesmos métodos que
``Cake\Routing\Asset`` implementa.

Para mais informações, consulte
`Router::url <https://api.cakephp.org/5.x/class-Cake.Routing.Router.html#_url>`_
na API.

.. meta::
    :title lang=pt: UrlHelper
    :description lang=pt: O papel do UrlHelper no CakePHP é ajudar a construir urls.
    :keywords lang=pt: url helper,url
