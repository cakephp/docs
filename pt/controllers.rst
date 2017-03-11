Controllers
###########

Os controllers correspondem ao 'C' no padrão MVC. Após o roteamento ter sido
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

Os controllers da sua aplicação são classes que estendem a classe CakePHP
``AppController``, a qual por sua vez estende a classe :php:class:`Controller`
do CakePHP. A classe ``AppController`` pode ser definida em
``/app/Controller/AppController.php`` e deve conter métodos que são
compartilhados entre todos os seus controllers.

Os controllers fornecem uma série de métodos que são chamados de ações. Ações
são métodos em um controller que manipulam requisições. Por padrão, todos os
métodos públicos em um controller são ações e acessíveis por urls.

.. _app-controller:

A Classe AppController
======================

Como mencionado anteriormente, a classe ``AppController`` é a mãe de todos os
outros controllers da sua aplicação. O próprio ``AppController`` é estendida da
classe ``Controller`` que faz parte da biblioteca do CakePHP. Assim sendo,
``AppController`` é definido em ``/app/Controller/AppController.php`` como::

    class AppController extends Controller {
    }

Os atributos e métodos criados em ``AppController`` vão estar disponíveis para
todos os controllers da sua aplicação. Este é o lugar ideal para criar códigos
que são comuns para todos os seus controllers. Componentes (que você vai
aprender mais tarde) são a melhor alternativa para códigos que são usados por
muitos (mas não obrigatoriamente em todos) controllers.

Enquanto regras normais de herança de classes orientadas à objetos são
aplicadas, o CakePHP também faz um pequeno trabalho extra quando se trata de
atributos especiais do controller. A lista de componentes (components)
e helpers usados no controller são tratados diferentemente. Nestes casos, as
cadeias de valores do ``AppController`` são mescladas com os valores de seus
controllers filhos. Os valores dos controllers filhos sempre sobrescreveram
os do ``AppController``.

.. note::

    O CakePHP mescla as seguintes variáveis do ``AppController`` em controllers
    da sua aplicação:

    -  $components
    -  $helpers
    -  $uses

Lembre-se de adicionar os helpers Html e Form padrões se você incluiu o atributo
``$helpers`` em seu ``AppController``.

Também lembre de fazer as chamadas de callbacks do ``AppController`` nos
controllers filhos para obter melhores resultados::

    function beforeFilter() {
        parent::beforeFilter();
    }

Parâmetros de Requisição
========================

Quando uma requisição é feita para uma aplicação CakePHP, a classe
:php:class:`Router` e a classe :php:class:`Dispatcher` do Cake usa a 
:ref:`routes-configuration` para encontrar e criar o controller correto. Os
dados da requisição são encapsulados em um objeto de requisição. O CakePHP
coloca todas as informações importantes de uma requisição na propriedade
``$this->request``. Veja a seção :doc:`/controllers/request-response` para mais
informações sobre o objeto de requisição do CakePHP.

Ações de Controllers
====================

Retornando ao nosso exemplo da padaria online, nosso controller
``RecipesController`` poderia conter as ações ``view()``, ``share()`` e
``search()`` e poderia ser encontrado em
``/app/Controller/RecipesController.php`` contendo o código a seguir::

        
        # /app/Controller/RecipesController.php
        
        class RecipesController extends AppController {
            function view($id) {
                // a lógica da ação vai aqui
            }
        
            function share($customer_id, $recipe_id) {
                // a lógica da ação vai aqui
            }
        
            function search($query) {
                // a lógica da ação vai aqui
            }
        }

Para que você use de forma eficaz os controllers em sua aplicação, nós iremos
cobrir alguns dos atributos e métodos inclusos no controller fornecido pelo
CakePHP.

.. _controller-life-cycle:

Ciclo de Vida dos Callbacks em uma Requisição
=============================================

.. php:class:: Controller

Os controllers do CakePHP vêm equipados com callbacks que você pode usar para
inserir lógicas em torno do ciclo de vida de uma requisição:

.. php:method:: beforeFilter()

    Este método é executado antes de cada ação dos controllers.
    É um ótimo lugar para verificar se há uma sessão ativa ou inspecionar as
    permissões de um usuário.

    .. note::

        O método beforeFilter() será chamado para ações não encontradas e
        ações criadas pelo scaffold do Cake.

.. php:method:: beforeRender()

    Chamada após a lógica da ação de um controller, mas antes da view ser
    renderizada. Este callback não é usado com frequência mas pode ser preciso
    se você chamar o método ``render()`` manualmente antes do término de uma
    ação.

.. php:method:: afterFilter()

    Chamada após cada ação dos controllers, e após a completa renderização da
    view. Este é o último método executado do controller.

Em adição aos callbacks dos controllers, os :doc:`/controllers/components`
também fornecem um conjunto de callbacks similares.

.. _controller-methods:

Métodos dos Controllers
=======================

Para uma lista completa dos métodos e suas descrições, visite a API do CakePHP.
Siga para `https://api.cakephp.org
<https://api.cakephp.org/2.x/class-Controller.html>`__.

Interagindo Com as Views
------------------------

Os controllers interagem com as views de diversas maneiras. Primeiramente eles
são capazes de passar dados para as views usando o método ``set()``. Você também
pode no seu controller decidir qual classe de View usar e qual arquivo deve ser
renderizado.

.. php:method:: set(string $var, mixed $value)

    O método ``set()`` é a principal maneira de enviar dados do seu controller
    para a sua view. Após ter usado o método ``set()``, a variável pode ser
    acessada em sua view::


        // Primeiro você passa os dados do controller:

        $this->set('color', 'pink');

        //Então, na view, você pode utilizar os dados:
        ?>

        Você selecionou a cobertura <?php echo $color; ?> para o bolo.

    O método ``set()`` também aceita um array associativo como primeiro
    parâmetro, podendo oferecer uma forma rápida para atribuir uma série de
    informações para a view.

    .. versionchanged:: 1.3
        Chaves de arrays não serão mais flexionados antes de serem atribuídas à
        view ('underscored\_key' não se torna 'underscoredKey', etc.):

    ::


        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );
        
        // Torna $color, $type e $base_price 
        // disponível na view:
        
        $this->set($data);

    O atributo ``$pageTitle`` não existe mais, use o método ``set()`` para
    definir o título na view::

        $this->set('title_for_layout', 'This is the page title');
        ?>

.. php:method:: render(string $action, string $layout, string $file)

    O método ``render()`` é chamado automaticamente no fim de cada ação
    requisitada de um controller. Este método executa toda a lógica da view
    (usando os dados que você passou usando o método ``set()``), coloca a view
    dentro do seu layout e serve de volta para o usuário final.

    O arquivo view usado pelo método ``render()`` é determinado por convenção.
    Se a ação ``search()`` do controller ``RecipesController`` é requisitada, o
    arquivo view encontrado em ``/app/View/Recipes/search.ctp`` será
    renderizado::

        class RecipesController extends AppController {
        ...
            function search() {
                // Renderiza a view em /View/Recipes/search.ctp
                $this->render();
            }
        ...
        }

    Embora o CakePHP irá chamar o método ``render`` automaticamente (ao menos
    que você altere o atributo ``$this->autoRender`` para ``false``) após cada
    ação, você pode usá-lo para especificar um arquivo view alternativo
    alterando o nome de ação no controller usando o parâmetro ``$action``.

    Se o parâmetro ``$action`` começar com ``'/'`` é assumido que o arquivo view
    ou elemento que você queira usar é relativo ao diretório ``/app/View``. Isto
    permite a renderização direta de elementos, muito útil em chamadas Ajax.
    ::

        // Renderiza o elemento presente em /View/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

    Você também pode especificar uma arquivo view ou elemento usando o terceiro
    parâmetro chamado ``$file``. O parâmetro ``$layout`` permite você
    especificar o layout em que a view será inserido.

Renderizando Uma View Específica
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Em seu controller você pode querer renderizar uma view diferente do que a
convenção proporciona automaticamente. Você pode fazer isso chamando o método
``render()`` diretamente. Após ter chamado o método ``render()``, o CakePHP
não irá tentar renderizar novamente a view::

    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

Isto irá renderizar o arquivo ``app/View/Posts/custom_file.ctp`` ao invés de
``app/View/Posts/my_action.ctp``

Controle de Fluxo
-----------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    O método de controle de fluxo que você vai usar na maioria das vezes é
    o ``redirect()``. Este método recebe seu primeiro parâmetro na forma de uma
    URL relativa do CakePHP. Quando um usuário executou um pedido que altera
    dados no servidor, você pode querer redirecioná-lo para uma outra tela
    de recepção.::

        function place_order() {
            // Logic for finalizing order goes here
            if ($success) {
                $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
            } else {
                $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
            }
        }

    .. note::

        Você pode aprender mais sobre a importância de redirecionar o usuário após
        um formulário do tipo POST no artigo
        `Post/Redirect/Get (en) <https://en.wikipedia.org/wiki/Post/Redirect/Get>`_.

    Você também pode usar uma URL relativa ou absoluta como argumento::

        $this->redirect('/orders/thanks'));
        $this->redirect('http://www.example.com');

    Você também pode passar dados para a ação::

        // observe o parâmetro $id
        $this->redirect(array('action' => 'edit', $id));
    
    O segundo parâmetro passado no ``redirect()`` permite você definir um
    código de status HTTP para acompanhar o redirecionamento. Você pode querer
    usar o código 301 (movido permanentemente) ou 303 (siga outro), dependendo
    da natureza do redirecionamento.

    O método vai assumir um ``exit()`` após o redirecionamento ao menos que
    você passe o terceiro parâmetro como ``false``.

    Se você precisa redirecionar o usuário de volta para a página que fez a
    requisição, você pode usar::

        $this->redirect($this->referer());

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    Assim como o método ``redirect()``, o método ``flash()`` é usado para
    direcionar o usuário para uma nova página após uma operação. O método
    ``flash()`` é diferente na forma de transição, mostrando uma mensagem antes
    de transferir o usuário para a URL especificada.

    O primeiro parâmetro deve conter a mensagem que será exibida e o segundo
    parâmetro uma URL relativa do CakePHP. O Cake irá mostrar o conteúdo da
    variável ``$message`` pelos segundos especificados em ``$pause`` antes de
    encaminhar o usuário para a URL especificada em ``$url``.

    Se existir um template particular que você queira usar para mostrar a
    mensagem para o usuário, você deve especificar o nome deste layout passando
    o parâmetro ``$layout``.

    Para mensagens flash exibidas dentro de páginas, de uma olhada no método
    ``setFlash()`` do componente ``SessionComponent``.

Callbacks
---------

Em adição ao :ref:`controller-life-cycle`. O CakePHP também suporta callbacks
relacionados a scaffolding.

.. php:method:: beforeScaffold($method)

    ``$method`` é o nome do método chamado, por exemplo: index, edit, etc.

.. php:method:: scaffoldError($method)

    ``$method`` é o nome do método chamado, por exemplo: index, edit, etc.

.. php:method:: afterScaffoldSave($method)

    ``$method`` é o nome do método chamado, podendo ser: edit ou update.

.. php:method:: afterScaffoldSaveError($method)

    ``$method`` é o nome do método chamado, podendo ser: edit ou update.

Outros Métodos Úteis
--------------------

.. php:method:: constructClasses

    Este método carrega os models requeridos pelo controller. Este processo
    de carregamento é feito normalmente pelo CakePHP, mas pode ser útil quando
    for acessar controllers de outras perspectivas. Se você precisa de um
    controller num script de linha de comando ou para outros lugares,
    ``constructClasses()`` pode vir a calhar.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Retorna a URL de referência para a requisição atual. O parâmetro
    ``$default`` pode ser usado para fornecer uma URL padrão a ser usada caso o
    HTTP\_REFERER não puder ser lido do cabeçalho da requisição. Então, ao invés
    de fazer isto::

        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    $this->redirect($this->referer());
                } else {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }

    Você pode fazer isto::

        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    Se o parâmetro ``$default`` não for passado, o comportamento padrão é a raiz
    do seu domínio - ``'/'``.

    Se o parâmetro ``$local`` for passado como ``true``, o redirecionamento
    restringe a URL de referência apenas para o servidor local.

.. php:method:: disableCache

    Usado para dizer ao **browser** do usuário não fazer cache do resultado
    exibido. Isto é diferente do cache de views, abordado em um capítulo
    posterior.

    O cabeçalho enviado para este efeito são::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [data e hora atual] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    Use este método para transformar um conjunto de dados POSTados de um model
    (vindos de inputs compatíveis com o FormHelper) em um conjunto de condições
    de busca. Este método oferece um atalho rápido no momento de construir
    operações de busca. Por exemplo, um usuário administrativo pode querer
    pesquisar pedidos para saber quais itens precisarão ser enviados. Você
    pode usar o :php:class:`FormHelper` do CakePHP para criar um formulário
    de busca para o model Order. Assim, uma ação de um controller pode usar
    os dados enviados deste formulário e criar as condições de busca
    necessárias para completar a tarefa::

        function index() {
            $conditions = $this->postConditions($this->request->data);
            $orders = $this->Order->find('all', compact('conditions'));
            $this->set('orders', $orders);
        }

    Se ``$this->request->data['Order']['destination']`` for igual a
    "Old Towne Bakery", o método ``postConditions()`` converte esta condição em
    um array compatível para o uso em um método Model->find(). Neste caso,
    ``array('Order.destination' => 'Old Towne Bakery')``.

    Se você quiser usar um operador diferente entre os termos, informe-os usando
    o segundo parâmetro::

        /*
        Conteúdo do atributo $this->request->data
        array(
            'Order' => array(
                'num_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // Vamos pegar os pedidos que possuem no mínimo 4 itens e que contém 'Ye Olde'
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=', 
                'referrer' => 'LIKE'
            )
        );
        $orders = $this->Order->find('all', compact('conditions'));

    O terceiro parâmetro permite você dizer ao CakePHP qual operador SQL
    booleano usar entre as condições de busca. Strings como 'AND', 'OR' e 'XOR'
    são todos valores válidos.

    Finalmente, se o último parâmetro for passado como ``true``, e a variável
    ``$op`` for um array, os campos não inclusos em ``$op`` não serão
    retornados entre as condições.

.. php:method:: paginate()

    Este método é usado para fazer a paginação dos resultados retornados por
    seus models. Você pode especificar o tamanho da página (quantos resultados
    serão retornados), as condições de busca e outros parâmetros. Veja a seção
    :doc:`pagination <core-libraries/components/pagination>` para mais detalhes
    sobre como usar o método ``paginate()``

.. php:method:: requestAction(string $url, array $options)

    Este método chama uma ação de um controller de qualquer lugar e retorna
    os dados da ação requisitada. A ``$url`` passada é uma URL relativa do Cake
    (/controller_name/action_name/params). Para passar dados extras para serem
    recebidos pela ação do controller, adicione-os no parâmetro ``options`` em
    um formato de array.

    .. note::

        Você pode usar o ``requestAction()`` para recuperar uma view totalmente
        renderizada passando ``'return'`` no array de opções:
        ``requestAction($url, array('return'));``. É importante notar que
        fazendo uma requisição usando 'return' em um controller podem fazer com
        que tags javascripts e css não funcionem corretamente.

    .. warning::

        Se o método ``requestAction()`` for usado sem fazer cache apropriado do
        resultado obtido, a performance da ação pode ser bem ruim.
        É raro o uso apropriado deste método em um controller ou model.

    O uso do ``requestAction`` é melhor usado em conjunto com elementos
    (cacheados) como uma maneira de recuperar dados para um elemento antes de
    renderizá-los. Vamos usar o exemplo de por o elemento "últimos comentários"
    no layout. Primeiro nós precisamos criar um método no controller que irá
    retornar os dados::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            function latest() {
                return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            }
        }

    Se agora nós criarmos um elemento simples para chamar este método::

        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    Nós podemos por este elemento em qualquer lugar para ter a saída usando::

        echo $this->element('latest_comments');

    Fazendo desta maneira, sempre que o elemento for renderizado, uma requisição
    será feita para nosso controller para pegar os dados, processá-los e
    retorná-los. Porém, de acordo com o aviso acima, é melhor fazer uso de
    caching do elemento para evitar um processamento desnecessário. Modificando
    a chamada do elemento para se parecer com isto::

        echo $this->element('latest_comments', array('cache' => '+1 hour'));

    A chamada para o ``requestAction`` não será feita enquanto o arquivo de
    cache do elemento existir e for válido.

    Além disso, o ``requestAction`` pode receber uma URL no formato de
    array do Cake::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    Isto permite o ``requestAction`` contornar o uso do método ``Router::url()``
    para descobrir o controller e a ação, aumentando a performance. As URLs
    baseadas em arrays são as mesmas usadas pelo método
    :php:meth:`HtmlHelper::link()` com uma diferença, se você está usando
    parâmetros nomeados ou passados, você deve colocá-los em um segundo array
    envolvendo elas com a chave correta.
    Isto deve ser feito porque o ``requestAction`` mescla o array de parâmetros
    nomeados (no segundo parâmetro do requestAction) com o array
    ``Controller::params`` e não coloca explicitamente o array de parâmetros
    nomeados na chave 'named'. Além disso, membros do array ``$options`` serão
    disponibilizados no array ``Controller::params`` da ação que for chamada.::

            echo $this->requestAction('/articles/featured/limit:3');
            echo $this->requestAction('/articles/view/5');

    Um array no ``requestAction`` poderia ser::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        Diferente de outros lugares onde URLs no formato de arrays são análogas
        as URLs no formato de string, o ``requestAction`` tratam elas
        diferentemente.

    Quando for usar URLs no formato de arrays em conjunto com o
    ``requestAction()`` você deve especificar **todos** os parâmetros que você
    vai precisar na requisição da ação. Isto inclui parâmetros como
    ``$this->request->data``. Além disso, todos os parâmetros
    requeridos, parâmetros nomeados e "passados" devem ser feitos no segundo
    array como visto acima.

.. php:method:: loadModel(string $modelClass, mixed $id)

    O método ``loadModel`` vem a calhar quando você precisa usar um model que
    não é padrão do controller ou o seu model não está associado com
    este.
    ::

        $this->loadModel('Article');
        $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

        $this->loadModel('User', 2);
        $user = $this->User->read();

Atributos do Controller
=======================

Para uma completa lista dos atributos dos controllers e suas descrições, visite
a API do CakePHP. Siga para `https://api.cakephp.org/2.x/class-Controller.html
<https://api.cakephp.org/2.x/class-Controller.html>`_.

.. php:attr:: name

    O atributo ``$name`` deve ser definido com o nome do controller. Normalmente
    é apenas a forma plural do nome do model principal que o controller usa.
    Esta propriedade não é requerida mas salva o CakePHP de ter que flexionar
    o nome do model para chegar no valor correto::

        
        # Exemplo de uso do atributo $name do controller
        
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }

$components, $helpers e $uses
-----------------------------

Os seguintes atributos do controller usados com mais frequência dizem ao CakePHP
quais helpers, componentes e models você irá usar em conjunto com o controller
corrente. Usar estes atributos faz com que as classes MVC dadas por
``$components`` e ``$uses`` sejam disponibilizadas como atributos no controller
(por exemplo, ``$this->ModelName``) e os dados por ``$helpers`` disponibilizados
como referências para objetos apropriados (``$this->{$helpername}``) na view.

.. note::

    Cada controller possui algumas destas classes disponibilizadas por padrão,
    então você pode nem ao menos precisar de configurar estes atributos.

.. php:attr:: uses

    Os controllers possuem acesso ao seu model principal por padrão. Nosso
    controller Recipes terá a classe model Recipe disposta em ``$this->Recipe``
    e nosso controller Products também apresenta o model Product em
    ``$this->Product``. Porém, quando for permitir um controller acessar models
    adicionais pela configuração do atributo ``$uses``, o nome do model do
    controller atual deve também estar incluso. Este caso é ilustrado no exemplo
    logo abaixo.

    Se você não quiser usar um model em seu controller, defina o atributo como
    um array vazio (``public $uses = array()``). Isto lhe permitirá usar um
    controller sem a necessidade de um arquivo model correspondente.

.. php:attr:: helpers

    Os helpers `Html`, `Form` e `Session` são disponibilizados por padrão como é
    feito o ``SessionComponent``. Mas se você escolher definir seu próprio
    array de ``$helpers`` no ``AppController``, tenha certeza de incluir o
    ``Html`` e o ``Form`` se quiser que eles continuem a estar disponíveis nos
    seus controllers. Você também pode passar configurações na declaração de
    seus helpers. Para aprender mais sobre estas classes, visite suas
    respectivas seções mais tarde neste manual.

    Vamos ver como dizer para um controller do Cake que você planeja usar
    classes MVC adicionais::

        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Cada uma destas variáveis são mescladas com seus valores herdados, portanto,
    não é necessário (por exemplo) redeclarar o ``FormHelper`` ou qualquer uma
    das classes que já foram declaradas no seu ``AppController``.

.. php:attr:: components

    O array de componentes permite que você diga ao CakePHP quais
    :doc:`/controllers/components` um controller irá usar. Como o ``$helpers``
    e o ``$uses``, ``$components`` são mesclados com os definidos no
    ``AppController``. E assim como nos ``$helpers``, você pode passar
    configurações para os componentes. Veja :ref:`configuring-components`
    para mais informações.

Outros Atributos
----------------

Enquanto você pode conferir todos os detalhes de todos os atributos dos
controllers na API, existem outros atributos dos controllers que merecem suas
próprias seções neste manual.

.. php:attr:: cacheAction

    O atributo ``$cacheAction`` é usado para definir a duração e outras
    informações sobre o cache completo de páginas. Você pode ler mais sobre
    o `caching` completo de páginas na documentação do :php:class:`CacheHelper`.

.. php:attr:: paginate

    O atributo ``$paginate`` é uma propriedade de compatibilidade obsoleta.
    Usando este atributo, o componente :php:class:`PaginatorComponent` será
    carregado e configurado, no entanto, é recomendado atualizar seu código para
    usar as configurações normais de componentes::

        class ArticlesController extends AppController {
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
        }

.. todo::

    This chapter should be less about the controller api and more about
    examples, the controller attributes section is overwhelming and difficult to
    understand at first. The chapter should start with some example controllers
    and what they do.

Mais sobre Controllers
======================

.. toctree::
    :maxdepth: 1

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components
