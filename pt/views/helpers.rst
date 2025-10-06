Helpers
#######

Helpers são classes semelhantes a componentes para a camada de apresentação da sua
aplicação. Eles contêm lógica de apresentação que é compartilhada entre várias
views, elementos ou layouts. Este capítulo mostrará como configurar
helpers, como carregar helpers e usar esses helpers, e descreverá as etapas simples
para criar seus próprios helpers personalizados.

O CakePHP inclui vários helpers que auxiliam na criação de views. Eles ajudam na
criação de marcação bem formada (incluindo formulários), auxiliam na formatação de texto, horários e
números, e podem até acelerar a funcionalidade AJAX. Para mais informações sobre os
helpers incluídos no CakePHP, confira o capítulo para cada helper:

.. toctree::
    :maxdepth: 1

    /views/helpers/breadcrumbs
    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

Configurando Helpers
====================

Você configura helpers no CakePHP declarando-os em uma classe view. Uma classe ``AppView``
vem com cada aplicação CakePHP e é o lugar ideal para adicionar
helpers para uso global::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->addHelper('Html');
            $this->addHelper('Form');
            $this->addHelper('Flash');
        }
    }

Para adicionar helpers de plugins, use a :term:`sintaxe de plugin` usada em outros lugares no
CakePHP::

    $this->addHelper('Blog.Comment');

Você não precisa adicionar explicitamente Helpers que vêm do CakePHP ou da sua
aplicação. Esses helpers podem ser carregados de forma preguiçosa no primeiro uso. Por exemplo::

    // Carrega o FormHelper se ele ainda não foi adicionado/carregado explicitamente.
    $this->Form->create($article);

De dentro das views de um plugin, os helpers do plugin também podem ser carregados de forma preguiçosa. Por
exemplo, templates de view no plugin 'Blog' podem carregar helpers do
mesmo plugin de forma preguiçosa.

Carregando Helpers Condicionalmente
------------------------------------

Você pode usar o nome da action atual para carregar helpers condicionalmente::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            if ($this->request->getParam('action') === 'index') {
                $this->addHelper('ListPage');
            }
        }
    }

Você também pode usar o método ``beforeRender`` do seu controller para adicionar helpers::

    class ArticlesController extends AppController
    {
        public function beforeRender(EventInterface $event): void
        {
            parent::beforeRender($event);
            $this->viewBuilder()->addHelper('MyHelper');
        }
    }

Opções de Configuração
-----------------------

Você pode passar opções de configuração para helpers. Essas opções podem ser usadas para definir
valores de atributos ou modificar o comportamento de um helper::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {
        public function initialize(array $config): void
        {
            debug($config);
        }
    }

Por padrão, todas as opções de configuração serão mescladas com a propriedade ``$_defaultConfig``.
Esta propriedade deve definir os valores padrão de qualquer configuração que
seu helper requer. Por exemplo::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {
        use StringTemplateTrait;

        /**
         * @var array<string, mixed>
         */
        protected array $_defaultConfig = [
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
    }

Qualquer configuração fornecida ao construtor do seu helper será mesclada com os
valores padrão durante a construção e os dados mesclados serão definidos em
``_config``. Você pode usar o método ``getConfig()`` para ler a configuração em tempo de execução::

    // Lê a opção de configuração autoSetCustomValidity.
    $class = $this->Awesome->getConfig('autoSetCustomValidity');

Usar configuração de helper permite que você configure seus helpers de forma declarativa e
mantenha a lógica de configuração fora das suas actions do controller. Se você tiver
opções de configuração que não podem ser incluídas como parte de uma declaração de classe,
você pode defini-las no callback beforeRender do seu controller::

    class PostsController extends AppController
    {
        public function beforeRender(EventInterface $event): void
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig(),
            ]);
        }
    }

.. _aliasing-helpers:

Criando Aliases para Helpers
-----------------------------

Uma configuração comum a usar é a opção ``className``, que permite criar
helpers com aliases em suas views. Este recurso é útil quando você deseja
substituir ``$this->Html`` ou outra referência de Helper comum por uma
implementação personalizada::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize(): void
        {
            $this->addHelper('Html', [
                'className' => 'MyHtml',
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
        // Adicione seu código para sobrescrever o HtmlHelper principal
    }

O código acima criaria um *alias* ``MyHtmlHelper`` para ``$this->Html`` em suas views.

.. note::

    Criar um alias para um helper substitui essa instância em qualquer lugar que o helper seja usado,
    incluindo dentro de outros Helpers.

Usando Helpers
==============

Depois de configurar quais helpers você deseja usar em seu controller,
cada helper é exposto como uma propriedade pública na view. Por exemplo, se você
estivesse usando o :php:class:`HtmlHelper`, você seria capaz de acessá-lo
fazendo o seguinte::

    echo $this->Html->css('styles');

O código acima chamaria o método ``css()`` no HtmlHelper. Você pode
acessar qualquer helper carregado usando ``$this->{$helperName}``.

Carregando Helpers Em Tempo de Execução
----------------------------------------

Pode haver situações em que você precise carregar dinamicamente um helper de dentro
de uma view. Você pode usar o :php:class:`Cake\\View\\HelperRegistry` da view para
fazer isso::

    // Qualquer um funciona.
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

O HelperRegistry é um :doc:`registry </core-libraries/registry-objects>` e
suporta a API de registry usada em outros lugares no CakePHP.

Métodos de Callback
===================

Helpers possuem vários callbacks que permitem aumentar o processo de renderização
da view. Consulte a :ref:`helper-api` e a
documentação de :doc:`/core-libraries/events` para mais informações.

Criando Helpers
===============

Você pode criar classes helper personalizadas para uso em sua aplicação ou plugins.
Como a maioria dos componentes do CakePHP, as classes helper têm algumas convenções:

* Arquivos de classe helper devem ser colocados em **src/View/Helper**. Por exemplo:
  **src/View/Helper/LinkHelper.php**
* Classes helper devem ter o sufixo ``Helper``. Por exemplo: ``LinkHelper``.
* Ao referenciar nomes de helper, você deve omitir o sufixo ``Helper``. Por
  exemplo: ``$this->addHelper('Link');`` ou ``$this->loadHelper('Link');``.

Você também vai querer estender ``Helper`` para garantir que as coisas funcionem corretamente::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // Lógica para criar link especialmente formatado vai aqui...
        }
    }

Incluindo Outros Helpers
-------------------------

Você pode desejar usar alguma funcionalidade já existente em outro helper. Para fazer
isso, você pode especificar helpers que deseja usar com um array ``$helpers``, formatado
da mesma forma que você faria em um controller::

    /* src/View/Helper/LinkHelper.php (usando outros helpers) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        protected array $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // Use o helper HTML para gerar
            // dados formatados:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }

.. _using-helpers:

Usando Seu Helper
-----------------

Depois de criar seu helper e colocá-lo em **src/View/Helper/**, você pode
carregá-lo em suas views::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->addHelper('Link');
        }
    }

Uma vez que seu helper foi carregado, você pode usá-lo em suas views acessando a
propriedade de view correspondente::

    <!-- criar um link usando o novo helper -->
    <?= $this->Link->makeEdit('Mudar esta Receita', '/recipes/edit/5') ?>

.. note::

    O ``HelperRegistry`` tentará carregar de forma preguiçosa quaisquer helpers não
    especificamente identificados em seu ``Controller``.

Acessando Variáveis de View Dentro do Seu Helper
-------------------------------------------------

Se você quiser acessar uma variável de View dentro de um helper, você pode usar
``$this->getView()->get()`` assim::

    class AwesomeHelper extends Helper
    {
        public array $helpers = ['Html'];

        public function someMethod()
        {
            // definir meta descrição
            return $this->Html->meta(
                'description', $this->getView()->get('metaDescription'), ['block' => 'meta']
            );
        }
    }

Renderizando um Elemento de View Dentro do Seu Helper
------------------------------------------------------

Se você quiser renderizar um Element dentro do seu Helper, você pode usar
``$this->getView()->element()`` assim::

    class AwesomeHelper extends Helper
    {
        public function someFunction()
        {
            return $this->getView()->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );
        }
    }

.. _helper-api:

Classe Helper
=============

.. php:class:: Helper

Callbacks
---------

Ao implementar um método de callback em um helper, o CakePHP irá automaticamente
inscrever seu helper no evento relevante. Ao contrário de versões anteriores do CakePHP
você *não* deve chamar ``parent`` em seus callbacks, pois a classe Helper
base não implementa nenhum dos métodos de callback.

.. php:method:: beforeRenderFile(EventInterface $event, $viewFile)

    É chamado antes de cada arquivo de view ser renderizado. Isso inclui elementos,
    views, views pai e layouts.

.. php:method:: afterRenderFile(EventInterface $event, $viewFile, $content)

    É chamado após cada arquivo de view ser renderizado. Isso inclui elementos, views,
    views pai e layouts. Um callback pode modificar e retornar ``$content`` para
    alterar como o conteúdo renderizado será exibido no navegador.

.. php:method:: beforeRender(EventInterface $event, $viewFile)

    O método beforeRender é chamado após o método beforeRender do controller
    mas antes do controller renderizar a view e o layout. Recebe o arquivo sendo
    renderizado como argumento.

.. php:method:: afterRender(EventInterface $event, $viewFile)

    É chamado após a view ter sido renderizada, mas antes que a renderização do layout tenha
    começado.

.. php:method:: beforeLayout(EventInterface $event, $layoutFile)

    É chamado antes que a renderização do layout comece. Recebe o nome do arquivo de layout como
    argumento.

.. php:method:: afterLayout(EventInterface $event, $layoutFile)

    É chamado após a renderização do layout estar completa. Recebe o nome do arquivo de layout
    como argumento.

.. meta::
    :title lang=pt: Helpers
    :keywords lang=pt: classe php,função de tempo,camada de apresentação,poder de processamento,ajax,marcação,array,funcionalidade,lógica,sintaxe,elementos,cakephp,plugins
