Html
####

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

O papel do HtmlHelper no CakePHP é tornar as opções relacionadas ao HTML
mais fáceis, rápidas e resilientes a mudanças. Usar este
helper permitirá que sua aplicação seja mais leve,
e mais flexível em relação à localização na raiz de
um domínio.

Muitos métodos do HtmlHelper incluem um parâmetro ``$attributes``,
que permite adicionar atributos extras em suas tags. Aqui estão
alguns exemplos de como usar o parâmetro ``$attributes``:

.. code-block:: html

    Atributos desejados: <tag class="someClass" />
    Parâmetro array: ['class' => 'someClass']

    Atributos desejados: <tag name="foo" value="bar" />
    Parâmetro array:  ['name' => 'foo', 'value' => 'bar']

Inserindo Elementos Bem-Formatados
===================================

A tarefa mais importante que o HtmlHelper realiza é criar
marcação bem formada. Esta seção cobrirá alguns dos
métodos do HtmlHelper e como usá-los.

Criando Tags Charset
---------------------

.. php:method:: charset($charset=null)

Usado para criar uma meta tag especificando o conjunto de caracteres do documento. O valor padrão
é UTF-8. Um exemplo de uso::

    echo $this->Html->charset();

Vai produzir:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Alternativamente, ::

    echo $this->Html->charset('ISO-8859-1');

Vai produzir:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

Linkando a Arquivos CSS
------------------------

.. php:method:: css(mixed $path, array $options = [])

Cria um link(s) para uma folha de estilo CSS. Se a opção ``block`` estiver definida como
``true``, as tags de link são adicionadas ao bloco ``css`` que você pode imprimir
dentro da tag head do documento.

Você pode usar a opção ``block`` para controlar em qual bloco o elemento link
será anexado. Por padrão, ele será anexado ao bloco ``css``.

Se a chave 'rel' no array ``$options`` estiver definida como 'import', a folha de estilo será importada.

Este método de inclusão de CSS assume que o arquivo CSS especificado
reside dentro do diretório **webroot/css** se o caminho não começar com '/'. ::

    echo $this->Html->css('forms');

Vai produzir:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />

O primeiro parâmetro pode ser um array para incluir múltiplos arquivos. ::

    echo $this->Html->css(['forms', 'tables', 'menu']);

Vai produzir:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />
    <link rel="stylesheet" href="/css/tables.css" />
    <link rel="stylesheet" href="/css/menu.css" />

Você pode incluir arquivos CSS de qualquer plugin carregado usando
:term:`sintaxe de plugin`. Para incluir **plugins/DebugKit/webroot/css/toolbar.css**
você poderia usar o seguinte::

    echo $this->Html->css('DebugKit.toolbar.css');

Se você quiser incluir um arquivo CSS que compartilha um nome com um plugin carregado,
você pode fazer o seguinte. Por exemplo, se você tivesse um plugin ``Blog``,
e também quisesse incluir **webroot/css/Blog.common.css**, você faria::

    echo $this->Html->css('Blog.common.css', ['plugin' => false]);

Criando CSS Programaticamente
------------------------------

.. php:method:: style(array $data, boolean $oneline = true)

Constrói definições de estilo CSS com base nas chaves e valores do
array passado para o método. Especialmente útil se seu arquivo CSS é
dinâmico. ::

    echo $this->Html->style([
        'background' => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    ]);

Vai produzir::

    background:#633; border-bottom:1px solid #000; padding:10px;

Criando Tags Meta
------------------

.. php:method:: meta(string|array $type, string $url = null, array $options = [])

Este método é útil para vincular a recursos externos como feeds RSS/Atom
e favicons. Como css(), você pode especificar se deseja ou não que esta tag
apareça inline ou anexada ao bloco ``meta`` definindo a chave 'block'
no parâmetro $attributes como ``true``, ou seja - ``['block' => true]``.

Se você definir o atributo "type" usando o parâmetro $attributes,
o CakePHP contém alguns atalhos:

=========  ======================
 type       valor traduzido
=========  ======================
html       text/html
rss        application/rss+xml
atom       application/atom+xml
icon       image/x-icon
csrfToken  O token CSRF atual
=========  ======================

.. code-block:: php

    echo $this->Html->meta(
        'favicon.ico',
        '/favicon.ico',
        ['type' => 'icon']
    );
    // Saída (quebras de linha adicionadas)
    // Nota: O código do helper cria duas meta tags para garantir que
    // o ícone seja baixado por navegadores mais novos e mais antigos
    // que requerem diferentes valores de atributo rel.
    <link
        href="/subdir/favicon.ico"
        type="image/x-icon"
        rel="icon"
    />
    <link
        href="/subdir/favicon.ico"
        type="image/x-icon"
        rel="shortcut icon"
    />

    echo $this->Html->meta(
        'Comments',
        '/comments/index.rss',
        ['type' => 'rss']
    );
    // Saída (quebras de linha adicionadas)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

Este método também pode ser usado para adicionar as meta keywords e
descriptions. Exemplo::

    echo $this->Html->meta(
        'keywords',
        'digite qualquer meta keyword aqui'
    );
    // Saída
    <meta name="keywords" content="digite qualquer meta keyword aqui" />

    echo $this->Html->meta(
        'description',
        'digite qualquer meta description aqui'
    );
    // Saída
    <meta name="description" content="digite qualquer meta description aqui" />

    echo $this->Html->meta('csrfToken');
    // O middleware CsrfProtection deve estar carregado para sua aplicação
    <meta name="csrf-token" content="Token CSRF aqui" />

Além de criar meta tags predefinidas, você pode criar elementos link::

    <?= $this->Html->meta([
        'link' => 'http://example.com/manifest',
        'rel' => 'manifest'
    ]);
    ?>
    // Saída
    <link href="http://example.com/manifest" rel="manifest"/>

Quaisquer atributos fornecidos para meta() quando chamado desta forma serão adicionados à
tag link gerada.

.. versionchanged:: 5.1.0
   O tipo ``csrfToken`` foi adicionado.

Linkando a Imagens
------------------

.. php:method:: image(string $path, array $options = [])

Cria uma tag de imagem formatada. O caminho fornecido deve ser relativo
a **webroot/img/**. ::

    echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

Vai produzir:

.. code-block:: html

    <img src="/img/cake_logo.png" alt="CakePHP" />

Para criar um link de imagem, especifique o destino do link usando a
opção ``url`` em ``$attributes``. ::

    echo $this->Html->image("recipes/6.jpg", [
        "alt" => "Brownies",
        'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
    ]);

Vai produzir:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Se você estiver criando imagens em emails, ou quiser caminhos absolutos para imagens,
você pode usar a opção ``fullBase``::

    echo $this->Html->image("logo.png", ['fullBase' => true]);

Vai produzir:

.. code-block:: html

    <img src="http://example.com/img/logo.jpg" alt="" />

Você pode incluir arquivos de imagem de qualquer plugin carregado usando
:term:`sintaxe de plugin`. Para incluir **plugins/DebugKit/webroot/img/icon.png**
você poderia usar o seguinte::

    echo $this->Html->image('DebugKit.icon.png');

Se você quiser incluir um arquivo de imagem que compartilha um nome com um plugin carregado,
você pode fazer o seguinte. Por exemplo, se você tivesse um plugin ``Blog``,
e também quisesse incluir **webroot/img/Blog.icon.png**, você faria::

    echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

Se você quiser que o prefixo da URL não seja ``/img``, você pode sobrescrever esta configuração especificando o prefixo no array ``$options`` ::

    echo $this->Html->image("logo.png", ['pathPrefix' => '']);

Vai produzir:

.. code-block:: html

    <img src="logo.jpg" alt="" />


Criando Links
--------------

.. php:method:: link($title, $url = null, array $options = [])

Método de uso geral para criar links HTML. Use ``$options`` para
especificar atributos para o elemento e se o
``$title`` deve ser escapado. ::

    echo $this->Html->link(
        'Entrar',
        '/pages/home',
        ['class' => 'button', 'target' => '_blank']
    );

Vai produzir:

.. code-block:: html

    <a href="/pages/home" class="button" target="_blank">Entrar</a>

Use a opção ``'_full'=>true`` para URLs absolutas::

    echo $this->Html->link(
        'Dashboard',
        ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
    );

Vai produzir:

.. code-block:: html

    <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>

Especifique a chave ``confirm`` nas opções para exibir um diálogo JavaScript ``confirm()``::

    echo $this->Html->link(
        'Deletar',
        ['controller' => 'Recipes', 'action' => 'delete', 6],
        ['confirm' => 'Você tem certeza que deseja deletar esta receita?']
    );

Vai produzir:

.. code-block:: html

    <a href="/recipes/delete/6"
        onclick="return confirm(
            'Você tem certeza que deseja deletar esta receita?'
        );">
        Deletar
    </a>

Query strings também podem ser criadas com ``link()``. ::

    echo $this->Html->link('Ver imagem', [
        'controller' => 'Images',
        'action' => 'view',
        1,
        '?' => ['height' => 400, 'width' => 500]
    ]);

Vai produzir:

.. code-block:: html

    <a href="/images/view/1?height=400&width=500">Ver imagem</a>

Caracteres especiais HTML em ``$title`` serão convertidos para entidades HTML.
Para desabilitar esta conversão, defina a opção escape como
``false`` no array ``$options``. ::

    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
        "recipes/view/6",
        ['escape' => false]
    );

Vai produzir:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Definir ``escape`` como ``false`` também desabilitará o escape de atributos do
link. Você pode usar a opção ``escapeTitle`` para desabilitar apenas
o escape do título e não dos atributos. ::

    echo $this->Html->link(
        $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
        'recipes/view/6',
        ['escapeTitle' => false, 'title' => 'hi "howdy"']
    );

Vai produzir:

.. code-block:: html

    <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Veja também o método :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`
para mais exemplos de diferentes tipos de URLs.

.. php:method:: linkFromPath(string $title, string $path, array $params = [], array $options = [])

Se você quiser usar strings de caminho de rota, você pode fazer isso usando este método::

    echo $this->Html->linkFromPath('Index', 'Articles::index');
    // produz: <a href="/articles">Index</a>

    echo $this->Html->linkFromPath('View', 'MyBackend.Admin/Articles::view', [3]);
    // produz: <a href="/admin/my-backend/articles/view/3">View</a>

Linkando a Arquivos de Vídeo e Áudio
-------------------------------------

.. php:method:: media(string|array $path, array $options)

Opções:

- ``type`` Tipo de elemento de mídia a gerar, valores válidos são "audio"
  ou "video". Se o tipo não for fornecido, o tipo de mídia é adivinhado com base
  no tipo mime do arquivo.
- ``text`` Texto para incluir dentro da tag de vídeo
- ``pathPrefix`` Prefixo de caminho para usar em URLs relativas, padrão é
  'files/'
- ``fullBase`` Se fornecido, o atributo src receberá um endereço completo
  incluindo o nome do domínio

Retorna uma tag de áudio/vídeo formatada:

.. code-block:: php

    <?= $this->Html->media('audio.mp3') ?>

    // Saída
    <audio src="/files/audio.mp3"></audio>

    <?= $this->Html->media('video.mp4', [
        'fullBase' => true,
        'text' => 'Texto alternativo'
    ]) ?>

    // Saída
    <video src="http://www.somehost.com/files/video.mp4">Texto alternativo</video>

   <?= $this->Html->media(
        ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
        ['autoplay']
    ) ?>

    // Saída
    <video autoplay="autoplay">
        <source src="/files/video.mp4" type="video/mp4"/>
        <source src="/files/video.ogg" type="video/ogg;
            codecs='theora, vorbis'"/>
    </video>

Linkando a Arquivos Javascript
-------------------------------

.. php:method:: script(mixed $url, mixed $options)

Inclui um arquivo(s) de script, contido localmente ou como uma URL remota.

Por padrão, tags de script são adicionadas ao documento inline. Se você sobrescrever
isto definindo ``$options['block']`` como ``true``, as tags de script serão
adicionadas ao bloco ``script`` que você pode imprimir em outro lugar no documento.
Se você deseja sobrescrever qual nome de bloco é usado, você pode fazer isso definindo
``$options['block']``.

``$options['once']`` controla se você
deseja ou não incluir este script uma vez por requisição ou mais de
uma vez. Isto é definido como ``true`` por padrão.

Você pode usar $options para definir propriedades adicionais para a
tag de script gerada. Se um array de tags de script for usado, os
atributos serão aplicados a todas as tags de script geradas.

Este método de inclusão de arquivo JavaScript assume que o
arquivo JavaScript especificado reside dentro do diretório **webroot/js**::

    echo $this->Html->script('scripts');

Vai produzir:

.. code-block:: html

    <script src="/js/scripts.js"></script>

Você pode linkar arquivos com caminhos absolutos também para linkar arquivos
que não estão em **webroot/js**::

    echo $this->Html->script('/otherdir/script_file');

Você também pode linkar para uma URL remota::

    echo $this->Html->script('https://code.jquery.com/jquery.min.js');

Vai produzir:

.. code-block:: html

    <script src="https://code.jquery.com/jquery.min.js"></script>

O primeiro parâmetro pode ser um array para incluir múltiplos arquivos. ::

    echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

Vai produzir:

.. code-block:: html

    <script src="/js/jquery.js"></script>
    <script src="/js/wysiwyg.js"></script>
    <script src="/js/scripts.js"></script>

Você pode anexar a tag de script a um bloco específico usando a opção ``block``::

    $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

No seu layout, você pode produzir todas as tags de script adicionadas a 'scriptBottom'::

    echo $this->fetch('scriptBottom');

Você pode incluir arquivos de script de qualquer plugin carregado usando
:term:`sintaxe de plugin`. Para incluir **plugins/DebugKit/webroot/js/toolbar.js**
você poderia usar o seguinte::

    echo $this->Html->script('DebugKit.toolbar.js');

Se você quiser incluir um arquivo de script que compartilha um nome com um plugin carregado,
você pode fazer o seguinte. Por exemplo, se você tivesse um plugin ``Blog``,
e também quisesse incluir **webroot/js/Blog.plugins.js**, você faria::

    echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

Criando Blocos Javascript Inline
---------------------------------

.. php:method:: scriptBlock(string $code, array $options = [])

Para gerar blocos Javascript a partir do código de view PHP, você pode usar um dos métodos
de bloco de script. Scripts podem ser produzidos no lugar, ou armazenados em buffer em um bloco::

    // Define um bloco de script de uma vez, com o atributo defer.
    $this->Html->scriptBlock('alert("hi")', ['defer' => true]);

    // Armazena em buffer um bloco de script para ser produzido mais tarde.
    $this->Html->scriptBlock('alert("hi")', ['block' => true]);

.. php:method:: scriptStart(array $options = [])
.. php:method:: scriptEnd()

Você pode usar o método ``scriptStart()`` para criar um bloco de captura que será
produzido em uma tag ``<script>``. Snippets de script capturados podem ser produzidos inline,
ou armazenados em buffer em um bloco::

    // Anexar ao bloco 'script'.
    $this->Html->scriptStart(['block' => true]);
    echo "alert('Eu estou no JavaScript');";
    $this->Html->scriptEnd();

Uma vez que você tenha armazenado em buffer javascript, você pode produzi-lo como faria com qualquer outro
:ref:`Bloco de View <view-blocks>`::

    // No seu layout
    echo $this->fetch('script');

Criando Importmap Javascript
-----------------------------

.. php:method:: importmap(array $map, array $options = []): string

Cria uma tag de script `importmap` para seus arquivos JavaScript::

    // Na tag head do seu layout
    echo $this->Html->importmap([
        'jquery' => 'jquery.js',
        'wysiwyg' => '/editor/wysiwyg.js'
    ]);

Vai produzir:

.. code-block:: html

    <script type="importmap">{
        "imports": {
            "jquery": "/js/jquery.js",
            "wysiwyg": "/editor/wysiwyg.js"
        }
    }</script>

Gerando mapas com imports, scopes e integrity::

    echo $this->Html->importmap([
        'imports' => [
            'jquery' => 'jquery-3.7.1.min.js',
            'wysiwyg' => '/editor/wysiwyg.js'
        ],
        'scopes' => [
            'scoped/' => [
                'foo' => 'inner/foo',
            ],
        ],
        'integrity' => [
            'jquery' => 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
        ],
    ]);

Vai produzir:

.. code-block:: html

    <script type="importmap">{
        "imports": {
            "jquery": "/js/jquery-3.7.1.min.js",
            "wysiwyg": "/editor/wysiwyg.js"
        },
        "scopes": {
            "scoped/": {
                "foo": "/js/inner/foo.js"
            }
        },
        "integrity": {
            "/js/jquery-3.7.1.min.js": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        }
    }</script>

Criando Listas Aninhadas
-------------------------

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

Constrói uma lista aninhada (UL/OL) a partir de um array associativo::

    $list = [
        'Idiomas' => [
            'Inglês' => [
                'Americano',
                'Canadense',
                'Britânico',
            ],
            'Espanhol',
            'Alemão',
        ]
    ];
    echo $this->Html->nestedList($list);

Saída:

.. code-block:: html

    // Saída (menos os espaços em branco)
    <ul>
        <li>Idiomas
            <ul>
                <li>Inglês
                    <ul>
                        <li>Americano</li>
                        <li>Canadense</li>
                        <li>Britânico</li>
                    </ul>
                </li>
                <li>Espanhol</li>
                <li>Alemão</li>
            </ul>
        </li>
    </ul>

Criando Cabeçalhos de Tabela
-----------------------------

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

Cria uma linha de células de cabeçalho de tabela para ser colocada dentro de tags <table>. ::

    echo $this->Html->tableHeaders(['Data', 'Título', 'Ativo']);

Saída:

.. code-block:: html

    <tr>
        <th>Data</th>
        <th>Título</th>
        <th>Ativo</th>
    </tr>

::

    echo $this->Html->tableHeaders(
        ['Data', 'Título','Ativo'],
        ['class' => 'status'],
        ['class' => 'product_table']
    );

Saída:

.. code-block:: html

    <tr class="status">
         <th class="product_table">Data</th>
         <th class="product_table">Título</th>
         <th class="product_table">Ativo</th>
    </tr>

Você pode definir atributos por coluna, estes são usados em vez dos
padrões fornecidos no ``$thOptions``::

    echo $this->Html->tableHeaders([
        'id',
        ['Nome' => ['class' => 'highlight']],
        ['Data' => ['class' => 'sortable']]
    ]);

Saída:

.. code-block:: html

    <tr>
        <th>id</th>
        <th class="highlight">Nome</th>
        <th class="sortable">Data</th>
    </tr>

Criando Células de Tabela
--------------------------

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

Cria células de tabela, em linhas, atribuindo atributos <tr> de forma diferente
para linhas ímpares e pares. Envolva uma única célula de tabela dentro de um
[] para atributos <td> específicos. ::

    echo $this->Html->tableCells([
        ['7 de Jul, 2007', 'Melhores Brownies', 'Sim'],
        ['21 de Jun, 2007', 'Cookies Inteligentes', 'Sim'],
        ['1 de Ago, 2006', 'Bolo Anti-Java', 'Não'],
    ]);

Saída:

.. code-block:: html

    <tr><td>7 de Jul, 2007</td><td>Melhores Brownies</td><td>Sim</td></tr>
    <tr><td>21 de Jun, 2007</td><td>Cookies Inteligentes</td><td>Sim</td></tr>
    <tr><td>1 de Ago, 2006</td><td>Bolo Anti-Java</td><td>Não</td></tr>

::

    echo $this->Html->tableCells([
        ['7 de Jul, 2007', ['Melhores Brownies', ['class' => 'highlight']] , 'Sim'],
        ['21 de Jun, 2007', 'Cookies Inteligentes', 'Sim'],
        ['1 de Ago, 2006', 'Bolo Anti-Java', ['Não', ['id' => 'special']]],
    ]);

Saída:

.. code-block:: html

    <tr>
        <td>
            7 de Jul, 2007
        </td>
        <td class="highlight">
            Melhores Brownies
        </td>
        <td>
            Sim
        </td>
    </tr>
    <tr>
        <td>
            21 de Jun, 2007
        </td>
        <td>
            Cookies Inteligentes
        </td>
        <td>
            Sim
        </td>
    </tr>
    <tr>
        <td>
            1 de Ago, 2006
        </td>
        <td>
            Bolo Anti-Java
        </td>
        <td id="special">
            Não
        </td>
    </tr>

::

    echo $this->Html->tableCells(
        [
            ['Vermelho', 'Maçã'],
            ['Laranja', 'Laranja'],
            ['Amarelo', 'Banana'],
        ],
        ['class' => 'darker']
    );

Saída:

.. code-block:: html

    <tr class="darker"><td>Vermelho</td><td>Maçã</td></tr>
    <tr><td>Laranja</td><td>Laranja</td></tr>
    <tr class="darker"><td>Amarelo</td><td>Banana</td></tr>

Alterando as Tags Produzidas pelo HtmlHelper
=============================================

.. php:method:: setTemplates(array $templates)

Carrega um array de templates para adicionar/substituir templates::

    // Carrega templates específicos.
    $this->Html->setTemplates([
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ]);

Você pode carregar um arquivo de configuração contendo templates usando o templater
diretamente::

    // Carrega um arquivo de configuração com templates.
    $this->Html->templater()->load('my_tags');

Ao carregar arquivos de templates, seu arquivo deve se parecer com::

    <?php
    return [
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ];

.. warning::

    Strings de template contendo um sinal de porcentagem (``%``) precisam de atenção especial,
    você deve prefixar este caractere com outro sinal de porcentagem para que pareça
    ``%%``. A razão é que internamente os templates são compilados para serem usados com
    ``sprintf()``. Exemplo: ``<div style="width:{{size}}%%">{{content}}</div>``

.. meta::
    :title lang=pt: HtmlHelper
    :description lang=pt: O papel do HtmlHelper no CakePHP é tornar as opções relacionadas ao HTML mais fáceis, rápidas e resilientes a mudanças.
    :keywords lang=pt: html helper,cakephp css,cakephp script,tipo de conteúdo,imagem html,link html,tag html,bloco de script,início de script,url html,estilo cakephp,breadcrumbs cakephp
