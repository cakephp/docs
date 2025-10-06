Controllers
###########

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Controllers são o 'C' no MVC. Após o roteamento ser aplicado e o controller
correto ser encontrado, a action do seu controller é chamada. Seu controller
deve manipular a interpretação dos dados da requisição, garantindo que os models
corretos sejam chamados e a resposta ou view correta seja renderizada. Controllers podem ser
pensados como camada intermediária entre o Model e a View. Você deve manter seus
controllers magros e seus models gordos. Isso ajudará você a reutilizar
seu código e tornará seu código mais fácil de testar.

Comumente, um controller é usado para gerenciar a lógica em torno de um único model. Por
exemplo, se você estivesse construindo um site para uma padaria online, você pode ter um
RecipesController gerenciando suas receitas e um IngredientsController gerenciando seus
ingredientes. No entanto, também é possível ter controllers trabalhando com mais de
um model. No CakePHP, um controller é nomeado após o model primário que ele
manipula.

Os controllers da sua aplicação estendem a classe ``AppController``, que por sua vez
estende a classe :php:class:`Controller` do núcleo. A classe ``AppController``
pode ser definida em **src/Controller/AppController.php** e deve
conter métodos que são compartilhados entre todos os controllers da sua aplicação.

Controllers fornecem vários métodos que manipulam requisições. Estes são chamados
*actions*. Por padrão, cada método público em
um controller é uma action e está acessível a partir de uma URL. Uma action é responsável
por interpretar a requisição e criar a resposta. Normalmente as respostas estão
na forma de uma view renderizada, mas existem outras formas de criar respostas
também.

.. _app-controller:

O App Controller
================

Como mencionado na introdução, a classe ``AppController`` é a classe pai
de todos os controllers da sua aplicação. ``AppController`` por si só estende a
classe :php:class:`Cake\\Controller\\Controller` incluída no CakePHP.
``AppController`` é definida em **src/Controller/AppController.php** como
segue::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Atributos e métodos de controller criados no seu ``AppController`` estarão
disponíveis em todos os controllers que a estendem. Components (que você
aprenderá mais tarde) são melhor utilizados para código que é usado em muitos (mas não
necessariamente todos) controllers.

Você pode usar seu ``AppController`` para carregar components que serão usados em todos os
controllers da sua aplicação. CakePHP fornece um método ``initialize()`` que é
invocado no final do construtor de um Controller para este tipo de uso::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize(): void
        {
            // Sempre habilita o component FormProtection.
            $this->loadComponent('FormProtection');
        }
    }

Fluxo de Requisição
===================

Quando uma requisição é feita para uma aplicação CakePHP, as classes
:php:class:`Cake\\Routing\\Router` e :php:class:`Cake\\Routing\\Dispatcher`
do CakePHP usam :ref:`routes-configuration` para encontrar e criar a
instância correta do controller. Os dados da requisição são encapsulados em um objeto de requisição.
CakePHP coloca todas as informações importantes da requisição na propriedade ``$this->request``.
Veja a seção sobre :ref:`cake-request` para mais informações sobre o
objeto de requisição do CakePHP.

Controller Actions
==================

Actions de controller são responsáveis por converter os parâmetros da requisição em uma
resposta para o navegador/usuário fazendo a requisição. CakePHP usa convenções para
automatizar este processo e remover algum código boilerplate que você de outra forma precisaria
escrever.

Por convenção, CakePHP renderiza uma view com uma versão inflectada do nome da action.
Retornando ao nosso exemplo de padaria online, nosso RecipesController pode conter as
actions ``view()``, ``share()`` e ``search()``. O controller seria encontrado
em **src/Controller/RecipesController.php** e conteria::

    // src/Controller/RecipesController.php

    class RecipesController extends AppController
    {
        public function view($id)
        {
            // Lógica da action vai aqui.
        }

        public function share($customerId, $recipeId)
        {
            // Lógica da action vai aqui.
        }

        public function search($query)
        {
            // Lógica da action vai aqui.
        }
    }

Os arquivos de template para essas actions seriam **templates/Recipes/view.php**,
**templates/Recipes/share.php** e **templates/Recipes/search.php**. O
nome convencional do arquivo de view é a versão em minúsculas e sublinhadas do
nome da action.

Actions de controller geralmente usam
``Controller::set()`` para criar um contexto que
``View`` usa para renderizar a camada de view. Por causa das convenções que o
CakePHP usa, você não precisa criar e renderizar a view manualmente. Em vez disso,
uma vez que uma action de controller tenha sido concluída, CakePHP manipulará a renderização e
entrega da View.

Se por alguma razão você gostaria de pular o comportamento padrão, pode retornar um
objeto :php:class:`Cake\\Http\\Response` da action com a resposta totalmente
criada.

Para que você use um controller efetivamente na sua própria aplicação, cobriremos
alguns dos atributos e métodos principais fornecidos pelos controllers do CakePHP.

Interagindo com Views
=====================

Controllers interagem com views de várias maneiras. Primeiro, eles
são capazes de passar dados para as views, usando ``Controller::set()``. Você também pode
decidir qual classe de view usar e qual arquivo de view deve ser
renderizado a partir do controller.

.. _setting-view_variables:

Definindo Variáveis de View
---------------------------

.. php:method:: set(string $var, mixed $value)

O método ``Controller::set()`` é a principal maneira de enviar dados do seu
controller para sua view. Uma vez que você tenha usado ``Controller::set()``, a variável
pode ser acessada na sua view::

    // Primeiro você passa dados do controller:

    $this->set('color', 'pink');

    // Então, na view, você pode utilizar os dados:
    ?>

    You have selected <?= h($color) ?> icing for the cake.

O método ``Controller::set()`` também aceita um
array associativo como seu primeiro parâmetro. Isso pode frequentemente ser uma maneira rápida de
atribuir um conjunto de informações para a view::

    $data = [
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95,
    ];

    // Torna $color, $type e $base_price
    // disponíveis para a view:

    $this->set($data);

Tenha em mente que variáveis de view são compartilhadas entre todas as partes renderizadas pela sua view.
Elas estarão disponíveis em todas as partes da view: o template, o layout e
todos os elementos dentro dos dois primeiros.

Definindo Opções de View
------------------------

Se você quiser customizar a classe de view, caminhos de layout/template, helpers ou o
tema que será usado ao renderizar a view, você pode usar o
método ``viewBuilder()`` para obter um builder. Este builder pode ser usado para definir
propriedades da view antes de ser criada::

    $this->viewBuilder()
        ->addHelper('MyCustom')
        ->setTheme('Modern')
        ->setClassName('Modern.Admin');

O exemplo acima mostra como você pode carregar helpers customizados, definir o tema e usar uma
classe de view customizada.

Renderizando uma View
---------------------

.. php:method:: render(string $view, string $layout)

O método ``Controller::render()`` é automaticamente chamado no final de cada action de
controller requisitada. Este método executa toda a lógica de view (usando os dados
que você submeteu usando o método ``Controller::set()``), coloca a view dentro do seu
``View::$layout`` e a serve de volta para o usuário final.

O arquivo de view padrão usado pelo render é determinado por convenção.
Se a action ``search()`` do RecipesController for requisitada,
o arquivo de view em **templates/Recipes/search.php** será renderizado::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Renderiza a view em templates/Recipes/search.php
            return $this->render();
        }
    // ...
    }

Embora o CakePHP vá chamá-lo automaticamente após a lógica de cada action
(a menos que você tenha chamado ``$this->disableAutoRender()``), você pode usá-lo para especificar
um arquivo de view alternativo especificando um nome de arquivo de view como primeiro argumento do
método ``Controller::render()``.

Se ``$view`` começa com '/', assume-se que é um arquivo de view ou
elemento relativo à pasta **templates**. Isso permite
renderização direta de elementos, muito útil em chamadas AJAX::

    // Renderiza o elemento em templates/element/ajaxreturn.php
    $this->render('/element/ajaxreturn');

O segundo parâmetro ``$layout`` de ``Controller::render()`` permite que você especifique o layout
com o qual a view é renderizada.

Renderizando um Template Específico
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

No seu controller, você pode querer renderizar uma view diferente da
convencional. Você pode fazer isso chamando ``Controller::render()`` diretamente. Uma vez que você
tenha chamado ``Controller::render()``, CakePHP não tentará re-renderizar a view::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('custom_file');
        }
    }

Isso renderizaria **templates/Posts/custom_file.php** em vez de
**templates/Posts/my_action.php**.

Você também pode renderizar views dentro de plugins usando a seguinte sintaxe:
``$this->render('PluginName.PluginController/custom_file')``.
Por exemplo::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function myAction()
        {
            $this->render('Users.UserDetails/custom_file');
        }
    }

Isso renderizaria **plugins/Users/templates/UserDetails/custom_file.php**

.. _controller-viewclasses:

Negociação de Tipo de Conteúdo
==============================

.. php:method:: addViewClasses()

Controllers podem definir uma lista de classes de view que eles suportam. Após a
action do controller estar completa, CakePHP usará a lista de view para executar
negociação de tipo de conteúdo com :ref:`file-extensions` ou cabeçalhos ``Accept``.
Isso permite que sua aplicação reutilize a mesma action de controller para
renderizar uma view HTML ou renderizar uma resposta JSON ou XML. Para definir a lista de
classes de view suportadas por um controller, use o método ``addViewClasses()``::

    namespace App\Controller;

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();

            $this->addViewClasses([JsonView::class, XmlView::class]);
        }
    }

A classe ``View`` da aplicação é automaticamente usada como fallback quando nenhuma
outra view pode ser selecionada com base no cabeçalho ``Accept`` da requisição ou extensão de roteamento.
Se sua aplicação suporta apenas tipos de conteúdo para actions específicas,
você pode chamar ``addClasses()`` dentro da sua action também::

    public function export(): void
    {
        // Use uma view CSV customizada para exportação de dados.
        $this->addViewClasses([CsvView::class]);

        // Resto do código da action
    }

Se dentro das actions do seu controller você precisar processar a requisição ou carregar dados
de forma diferente com base no tipo de conteúdo, você pode usar
:ref:`check-the-request`::

    // Em uma action de controller

    // Carrega dados adicionais ao preparar respostas JSON
    if ($this->request->is('json')) {
        $query->contain('Authors');
    }

Caso sua aplicação precise de lógica mais complexa para decidir quais classes de view usar,
então você pode sobrescrever o método ``Controller::viewClasses()`` e retornar
um array de classes de view conforme necessário.

.. note::
    Classes de view devem implementar o método hook estático ``contentType()`` para
    participar da negociação de tipo de conteúdo.

Fallbacks de Negociação de Tipo de Conteúdo
===========================================

Se nenhuma View puder ser correspondida com as preferências de tipo de conteúdo da requisição, CakePHP
usará a classe ``View`` base. Se você quiser exigir negociação de tipo de conteúdo,
pode usar a ``NegotiationRequiredView`` que define um código de status ``406``::

    public function initialize(): void
    {
        parent::initialize();

        // Exige negociação de cabeçalho Accept ou retorna uma resposta 406.
        $this->addViewClasses([JsonView::class, NegotiationRequiredView::class]);
    }

Você pode usar o valor de tipo de conteúdo ``TYPE_MATCH_ALL`` para construir sua própria lógica de fallback
de view::

    namespace App\View;

    use Cake\View\View;

    class CustomFallbackView extends View
    {
        public static function contentType(): string
        {
            return static::TYPE_MATCH_ALL;
        }

    }

É importante lembrar que views match-all são aplicadas apenas *após*
a negociação de tipo de conteúdo ser tentada.

Usando AjaxView
===============

Em aplicações que usam clientes hypermedia ou AJAX, você frequentemente precisa renderizar
conteúdos de view sem o layout envolvente. Você pode usar a ``AjaxView`` que é
fornecida com o esqueleto da aplicação::

    // Em uma action de controller, ou em beforeRender.
    if ($this->request->is('ajax')) {
        $this->viewBuilder()->setClassName('Ajax');
    }

``AjaxView`` responderá como ``text/html`` e usará o layout ``ajax``.
Geralmente este layout é mínimo ou contém marcação específica do cliente. Isso
substitui o uso de ``RequestHandlerComponent`` automaticamente usando a
``AjaxView`` no 4.x.

Redirecionando para Outras Páginas
==================================

.. php:method:: redirect(string|array $url, integer $status)

O método ``redirect()`` adiciona um cabeçalho ``Location`` e define o código de status de
uma resposta e a retorna. Você deve retornar a resposta criada por
``redirect()`` para que o CakePHP envie o redirecionamento em vez de completar a
action do controller e renderizar uma view.

Você pode redirecionar usando valores de :term:`routing array`::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        $order->id,
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

Ou usando uma URL relativa ou absoluta::

    return $this->redirect('/orders/confirm');

    return $this->redirect('http://www.example.com');

Ou para a página referenciadora::

    return $this->redirect($this->referer());

Usando o segundo parâmetro você pode definir um código de status para seu redirecionamento::

    // Faz um 301 (movido permanentemente)
    return $this->redirect('/order/confirm', 301);

    // Faz um 303 (veja outro)
    return $this->redirect('/order/confirm', 303);

Veja a seção :ref:`redirect-component-events` para como redirecionar a partir de
um manipulador de ciclo de vida.

Carregando Tables/Models Adicionais
===================================

.. php:method:: fetchTable(string $alias, array $config = [])

O método ``fetchTable()`` é útil quando você precisa usar uma table ORM que não é
a padrão do controller::

    // Em um método de controller.
    $recentArticles = $this->fetchTable('Articles')->find('all',
            limit: 5,
            order: 'Articles.created DESC'
        )
        ->all();

.. php:method:: fetchModel(string|null $modelClass = null, string|null $modelType = null)

O método ``fetchModel()`` é útil para carregar models não-ORM ou tables ORM que
não são as padrões do controller::

    // ModelAwareTrait precisa ser explicitamente adicionado ao seu controller primeiro para fetchModel() funcionar.
    use ModelAwareTrait;

    // Obtém um model ElasticSearch
    $articles = $this->fetchModel('Articles', 'Elastic');

    // Obtém um model webservices
    $github = $this->fetchModel('GitHub', 'Webservice');

    // Se você pular o 2º argumento, por padrão tentará carregar uma table ORM.
    $authors = $this->fetchModel('Authors');

.. versionadded:: 4.5.0

Paginando um Model
==================

.. php:method:: paginate()

Este método é usado para paginar resultados obtidos pelos seus models.
Você pode especificar tamanhos de página, condições de busca do model e mais. Veja a
seção de :doc:`pagination <controllers/pagination>` para mais detalhes sobre
como usar ``paginate()``.

O atributo ``$paginate`` oferece uma maneira de customizar como ``paginate()``
se comporta::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'Articles' => [
                'conditions' => ['published' => 1],
            ],
        ];
    }

Configurando Components para Carregar
=====================================

.. php:method:: loadComponent($name, $config = [])

No método ``initialize()`` do seu Controller você pode definir quaisquer components que
deseja carregar e quaisquer dados de configuração para eles::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. _controller-life-cycle:

Callbacks do Ciclo de Vida da Requisição
========================================

Controllers do CakePHP disparam vários eventos/callbacks que você pode usar para inserir
lógica em torno do ciclo de vida da requisição:

Lista de Eventos
----------------

* ``Controller.initialize``
* ``Controller.startup``
* ``Controller.beforeRedirect``
* ``Controller.beforeRender``
* ``Controller.shutdown``

Métodos Callback de Controller
------------------------------

Por padrão, os seguintes métodos callback são conectados aos eventos relacionados se os
métodos forem implementados pelos seus controllers

.. php:method:: beforeFilter(EventInterface $event)

    Chamado durante o evento ``Controller.initialize`` que ocorre antes de toda
    action no controller. É um lugar útil para verificar uma sessão ativa
    ou inspecionar permissões de usuário.

    .. note::

        O método beforeFilter() será chamado para actions inexistentes.

    Retornar uma resposta de um método ``beforeFilter`` não impedirá outros
    ouvintes do mesmo evento de serem chamados. Você deve explicitamente
    :ref:`parar o evento <stopping-events>`.

.. php:method:: beforeRender(EventInterface $event)

    Chamado durante o evento ``Controller.beforeRender`` que ocorre após
    a lógica da action do controller, mas antes da view ser renderizada. Este callback não é
    usado frequentemente, mas pode ser necessário se você estiver chamando
    :php:meth:`Cake\\Controller\\Controller::render()` manualmente antes do fim
    de uma action específica.

.. php:method:: afterFilter(EventInterface $event)

    Chamado durante o evento ``Controller.shutdown`` que é disparado após
    toda action de controller e após a renderização estar completa. Este é o último
    método de controller a ser executado.

Além dos callbacks de ciclo de vida de controller, :doc:`/controllers/components`
também fornecem um conjunto similar de callbacks.

Lembre-se de chamar os callbacks do ``AppController`` dentro dos callbacks de controllers filhos
para melhores resultados::

    //use Cake\Event\EventInterface;
    public function beforeFilter(EventInterface $event): void
    {
        parent::beforeFilter($event);
    }

.. _controller-middleware:

Usando Redirecionamentos em Eventos de Controller
=================================================

Para redirecionar a partir de um método callback de controller você pode usar o seguinte::

    public function beforeFilter(EventInterface $event): void
    {
        if (...) {
            $event->setResult($this->redirect('/'));

            return;
        }

        ...
    }

Ao definir um redirecionamento como resultado de evento, você permite que o CakePHP saiba que você não quer que nenhum outro
callback de component seja executado e que o controller não deve manipular a action
mais adiante.

A partir da versão 4.1.0 você também pode lançar uma ``RedirectException`` para sinalizar um redirecionamento.

Controller Middleware
=====================

.. php:method:: middleware($middleware, array $options = [])

:doc:`Middleware </controllers/middleware>` pode ser definido globalmente, em
um escopo de roteamento ou dentro de um controller. Para definir middleware para um controller específico,
use o método ``middleware()`` do método ``initialize()``
do seu controller::

    public function initialize(): void
    {
        parent::initialize();

        $this->middleware(function ($request, $handler) {
            // Lógica do middleware.

            // Certifique-se de retornar uma resposta ou chamar handle()
            return $handler->handle($request);
        });
    }

Middleware definido por um controller será chamado **antes** dos métodos ``beforeFilter()`` e de action serem chamados.

Mais sobre Controllers
======================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=pt: Controllers
    :keywords lang=pt: models corretos,controller class,controller controller,core library,um model,model único,request data,mvc,attributes,variables,logic,callback,controller callback,app controller,appcontroller
