Controllers (Controladores)
###########################

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Os controllers (controladores) correspondem ao 'C' no padrão MVC. Após o roteamento ter sido
aplicado e o controller correto encontrado, a ação do controller é chamada. Seu
controller deve lidar com a interpretação dos dados de uma requisição,
certificando-se que os models corretos são chamados e a resposta ou view
esperada seja exibida. Os controllers podem ser vistos como intermediários entre
a camada Model e View. Você vai querer manter seus controllers magros e seus
Models gordos. Isso lhe ajudará a reutilizar seu código e testá-los mais
facilmente.

Mais comumente, controllers são usados para gerenciar a lógica de um único
model. Por exemplo, se você está construindo um site para uma padaria online,
você pode ter um ``RecipesController`` e um ``IngredientsController``
gerenciando suas receitas e seus ingredientes. No CakePHP, controllers são
nomeados de acordo com o model que manipulam. É também absolutamente possível
ter controllers que usam mais de um model.

Os controllers da sua aplicação são classes que estendem a classe
``AppController``, a qual por sua vez estende a classe do core
:php:class:`Controller`. A classe ``AppController`` pode ser definida em
**src/Controller/AppController.php** e deve conter métodos que são
compartilhados entre todos os controllers de sua aplicação.

Os controllers fornecem uma série de métodos que lidam com requisições. Estas
são chamados de *actions*. Por padrão, todos os métodos públicos em
um controller são uma action e acessíveis por uma URL. Uma action é responsável
por interpretar a requisição e criar a resposta. Normalmente as respostas são
na forma de uma view renderizada, mas também existem outras formas de criar
respostas.

.. _app-controller:

O App Controller
================

Como mencionado anteriormente, a classe ``AppController`` é a mãe de todos os
outros controllers da sua aplicação. A própria ``AppController`` é estendida da
classe :php:class:`Cake\\Controller\\Controller` incluída no CakePHP.
Assim sendo, ``AppController`` é definida em
**src/Controller/AppController.php** como a seguir::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Os atributos e métodos criados em seu ``AppController`` vão estar disponíveis
para todos os controllers que a extendam. Components (sobre os quais você irá
aprender mais tarde) são a melhor alternativa para códigos usados por
muitos (mas não necessariamente em todos) controllers.

Você pode usar seu ``AppController`` para carregar components que serão usados
em cada controller de sua aplicação. O CakePHP oferece um método
``initialize()`` que é invocado ao final do construtor do controller para esse
tipo de uso::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {

        public function initialize()
        {
            // Sempre habilite o CSRF component.
            $this->loadComponent('Csrf');
        }

    }

Em adição ao método ``initialize()``, a antiga propriedade ``$components``
também vai permitir você declarar quais components devem ser carregados.
Enquanto heranças objeto-orientadas normais são enquadradas, os components e
helpers usados por um controller são especialmente tratados. Nestes casos, os
valores de propriedade do ``AppController`` são mesclados com arrays de classes
controller filhas. Os valores na classe filha irão sempre sobre-escrever aqueles
na ``AppController``.

Fluxo de requisições
====================

Quando uma requisição é feita para uma aplicação CakePHP, a classe
:php:class:`Cake\\Routing\\Router` e a classe
:php:class:`Cake\\Routing\\Dispatcher` usam :ref:`routes-configuration` para
encontrar e criar a instância correta do controller. Os dados da requisição são
encapsulados em um objeto de requisição. O CakePHP coloca todas as informações
importantes de uma requisição na propriedade ``$this->request``. Veja a seção
:ref:`cake-request` para mais informações sobre o objeto de requisição do
CakePHP.

Métodos (actions) de controllers
================================

Actions de controllers são responsáveis por converter os parâmetros de
requisição em uma resposta para o navegador/usuário que fez a requisição. O
CakePHP usa convenções para automatizar este processo e remove alguns códigos
clichês que você teria que escrever de qualquer forma.

Por convenção, o CakePHP renderiza uma view com uma versão flexionada do nome
da action. Retornando ao nosso exemplo da padaria online, nosso
``RecipesController`` poderia abrigar as actions ``view()``, ``share()`` e
``search()``. O controller seria encontrado em
**src/Controller/RecipesController.php** contendo::

    // src/Controller/RecipesController.php

    class RecipesController extends AppController
    {
        function view($id)
        {
            // A lógica da action vai aqui.
        }

        function share($customerId, $recipeId)
        {
            // A lógica da action vai aqui.
        }

        function search($query)
        {
            // A lógica da action vai aqui.
        }
    }

Os arquivos de template para estas actions seriam
**src/Template/Recipes/view.ctp**, **src/Template/Recipes/share.ctp** e
**src/Template/Recipes/search.ctp**. A nomenclatura convencional para arquivos
view é a versão lowercased (minúscula) e underscored (sem sublinhado) do nome
da action.

Actions dos controllers geralmente usam ``Controller::set()`` para criar um
contexto que a ``View`` usa para renderizar a camada view. Devido às convenções
que o CakePHP usa, você não precisa criar e renderizar as views manualmente. Ao
invés, uma vez que uma action de controller é completada, o CakePHP irá
manipular a renderização e devolver a view.

Se por alguma razão você quiser pular o comportamento padrão, você pode retornar
um objeto :php:class:`Cake\\Network\\Response` a partir da action com a resposta
definida.

Para que você possa utilizar um controller de forma eficiente em sua própria
aplicação, nós iremos cobrir alguns dos atributos e métodos oferecidos pelo
controller do core do CakePHP.

Interagindo com views
---------------------

Os controllers interagem com as views de diversas maneiras. Primeiro eles
são capazes de passar dados para as views usando ``Controller::set()``. Você
também pode decidir no seu controller qual arquivo view deve ser renderizado
através do controller.

.. _setting-view_variables:

Definindo variáveis para a view
-------------------------------

.. php:method:: set(string $var, mixed $value)

O método ``Controller::set()`` é a principal maneira de enviar dados do seu
controller para a sua view. Após ter usado o método ``Controller::set()``, a
variável pode ser acessada em sua view::

    // Primeiro você passa os dados do controller:

    $this->set('color', 'pink');

    // Então, na view, você pode utilizar os dados:
    ?>

    Você selecionou a cobertura <?php echo $color; ?> para o bolo.

O método ``Controller::set()`` também aceita um array associativo como primeiro
parâmetro. Isto pode oferecer uma forma rápida para atribuir uma série de
informações para a view::

    $data = [
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95
    ];

    // Faça $color, $type, e $base_price
    // disponíveis na view:

    $this->set($data);

Renderizando uma view
---------------------

.. php:method:: render(string $view, string $layout)

O método ``Controller::render()`` é chamado automaticamente no fim de cada ação
requisitada de um controller. Este método executa toda a lógica da view
(usando os dados que você passou usando o método ``Controller::set()``), coloca
a view em ``View::$layout``, e serve de volta para o usuário final.

O arquivo view usado pelo método ``Controller::render()`` é determinado por
convenção. Se a action ``search()`` do controller ``RecipesController`` é
requisitada, o arquivo view encontrado em **src/Template/Recipes/search.ctp**
será renderizado::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Render the view in src/Template/Recipes/search.ctp
            $this->render();
        }
    // ...
    }

Embora o CakePHP irá chamar o método ``Controller::render()`` automaticamente
(ao menos que você altere o atributo ``$this->autoRender`` para ``false``) após
cada action, você pode usá-lo para especificar um arquivo view alternativo
especificando o nome do arquivo view como primeiro parâmetro do método
``Controller::render()``.

Se o parâmetro ``$view`` começar com '/', é assumido ser um arquivo view
ou elemento relativo ao diretório ``/src/Template``. Isto
permite a renderização direta de elementos, muito útil em chamadas AJAX::

    // Renderiza o elemento em src/Template/Element/ajaxreturn.ctp
    $this->render('/Element/ajaxreturn');

O segundo parâmetro ``$layout`` do ``Controller::render()`` permite que você
especifique o layout pelo qual a view é renderizada.

Renderizando uma view específica
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Em seu controller você pode querer renderizar uma view diferente do que a
convencional. Você pode fazer isso chamando o método
``Controller::render()`` diretamente. Uma vez chamado o método
``Controller::render()``, o CakePHP não tentará renderizar novamente a view::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('custom_file');
        }
    }

Isto renderizaria o arquivo **src/Template/Posts/custom_file.ctp** ao invés de
**src/Template/Posts/my_action.ctp**

Você também pode renderizar views de plugins utilizando a seguinte sintaxe:
``$this->render('PluginName.PluginController/custom_file')``.
Por exemplo::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('Users.UserDetails/custom_file');
        }
    }

Isto renderizaria **plugins/Users/src/Template/UserDetails/custom_file.ctp**

Redirecionando para outras páginas
==================================

.. php:method:: redirect(string|array $url, integer $status)

O método de controle de fluxo que você vai usar na majoritariamente é
``Controller::redirect()``. Este método recebe seu primeiro parâmetro na forma
de uma URL relativa do CakePHP. Quando um usuário executar um pedido com êxito,
você pode querer redirecioná-lo para uma tela de recepção. ::

    public function place_order()
    {
        // Logic for finalizing order goes here
        if ($success) {
            return $this->redirect(
                ['controller' => 'Orders', 'action' => 'thanks']
            );
        }
        return $this->redirect(
            ['controller' => 'Orders', 'action' => 'confirm']
        );
    }

Este método irá retornar a instância da resposta com cabeçalhos apropriados
definidos. Você deve retornar a instância da resposta da sua action para
prevenir renderização de view e deixar o dispatcher controlar o redirecionamento
corrente.

Você também pode usar uma URL relativa ou absoluta como o parâmetro $url::

    return $this->redirect('/orders/thanks');
    return $this->redirect('http://www.example.com');

Você também pode passar dados para a action::

    return $this->redirect(['action' => 'edit', $id]);

O segundo parâmetro passado no ``Controller::redirect()`` permite a você definir
um código de status HTTP para acompanhar o redirecionamento. Você pode querer
usar o código 301 (movido permanentemente) ou 303 (veja outro), dependendo
da natureza do redirecionamento.

Se você precisa redirecionar o usuário de volta para a página que fez a
requisição, você pode usar::

    $this->redirect($this->referer());

Um exemplo usando seqüências de consulta e hash pareceria com::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

A URL gerada seria::

    http://www.example.com/orders/confirm?product=pizza&quantity=5#top

Redirecionando para outra action no mesmo Controller
----------------------------------------------------

.. php:method:: setAction($action, $args...)

Se você precisar redirecionar a atual action para uma diferente no *mesmo*
controller, você pode usar ``Controller::setAction()`` para atualizar o objeto
da requisição, modificar o template da view que será renderizado e redirecionar
a execução para a action especificada::

    // De uma action delete, você pode renderizar uma página
    // de índice atualizada.
    $this->setAction('index');

Carregando models adicionais
============================

.. php:method:: loadModel(string $modelClass, string $type)

O método ``loadModel`` vem a calhar quando você precisa usar um model que
não é padrão do controller ou o seu model não está associado com
este.::

    // Em um método do controller.
    $this->loadModel('Articles');
    $recentArticles = $this->Articles->find('all', [
        'limit' => 5,
        'order' => 'Articles.created DESC'
    ]);

Se você está usando um provedor de tabelas que não os da ORM nativa você pode
ligar este sistema de tabelas aos controllers do CakePHP conectando seus
métodos de factory::

    // Em um método do controller.
    $this->modelFactory(
        'ElasticIndex',
        ['ElasticIndexes', 'factory']
    );

Depois de registrar uma tabela factory, você pode usar o ``loadModel`` para
carregar instâncias::

    // Em um método do controller
    $this->loadModel('Locations', 'ElasticIndex');

.. note::

    O TableRegistry da ORM nativa é conectado por padrão como o provedor de
    'Tabelas'.

Paginando um model
==================

.. php:method:: paginate()

Este método é usado para fazer a paginação dos resultados retornados por
seus models. Você pode especificar o tamanho da página (quantos resultados
serão retornados), as condições de busca e outros parâmetros. Veja a seção
:doc:`pagination <controllers/components/pagination>` para mais detalhes
sobre como usar o método ``paginate()``

O atributo paginate lhe oferece uma forma fácil de customizar como
``paginate()`` se comporta::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [
                'conditions' => ['published' => 1]
            ]
        ];
    }

Configurando components para carregar
=====================================

.. php:method:: loadComponent($name, $config = [])

Em seu método ``initialize()`` do controller você pode definir qualquer
component que quiser carregado, e qualquer configuração de dados para eles::

    public function intialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. php:attr:: components

A propriedade ``$components`` em seus controllers permitem a você configurar
components. Components configurados e suas dependências serão criados pelo
CakePHP para você. Leia a seção :ref:`configuring-components` para mais
informações. Como mencionado anteriormente, a propriedade ``$components`` será
mesclada com a propriedade definida em cada classe parente do seu controller.

Configurando helpers para carregar
==================================

.. php:attr:: helpers

Vamos observar como dizer ao controller do CakePHP que você planeja usar
classes MVC adicionais::

    class RecipesController extends AppController
    {
        public $helpers = ['Form'];
    }

Cada uma dessas variáveis são mescladas com seus valores herdados,
portanto não é necessário (por exemplo) redeclarar o ``FormHelper``,
ou qualquer coisa declarada em seu ``AppController``.

.. _controller-life-cycle:

Ciclo de vida de callbacks em uma requisição
============================================

Os controllers do CakePHP vêm equipados com callbacks que você pode usar para
inserir lógicas em torno do ciclo de vida de uma requisição:

.. php:method:: beforeFilter(Event $event)

    Este método é executado antes de cada ação dos controllers.
    É um ótimo lugar para verificar se há uma sessão ativa ou inspecionar as
    permissões de um usuário.

    .. note::

        O método beforeFilter() será chamado para ações perdidas.

.. php:method:: beforeRender(Event $event)

    Chamada após a lógica da action de um controller, mas antes da view ser
    renderizada. Esse callback não é usado frequentemente, mas pode ser
    necessário se você estiver chamando
    :php:meth:`~Cake\\Controller\\Controller::render()` manualmente antes do
    final de uma determinada action.

.. php:method:: afterFilter()

    Chamada após cada ação dos controllers, e após a completa renderização da
    view. Este é o último método executado do controller.

Em adição ao ciclo de vida dos callbacks do controller,
:doc:`/controllers/components` também oferece um conjunto de callbacks
similares.

Lembre de chamar os callbacks do ``AppController`` em conjunto com os callbacks
dos controllers para melhores resultados::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
    }

Mais sobre controllers
======================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=pt: Controllers
    :keywords lang=pt: models corretos,controller class,controller controller,core library,um model,model único,request data,mvc,attributes,variables,logic,callback,controller callback,app controller,appcontroller
