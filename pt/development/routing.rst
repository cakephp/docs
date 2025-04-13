Roteamento
##########

.. php:namespace:: Cake\Routing

.. php:class:: Router

O roteamento fornece ferramentas que mapeiam URLs para ações do controlador. Ao definir rotas, você pode separar como o aplicativo
é implementado e como os URLs são estruturadas.

O roteamento no CakePHP também abrange a idéia de roteamento reverso, onde uma matriz de parâmetros pode ser transformada em uma
string de URL. Ao usar o roteamento reverso, você pode redimensionar a estrutura de URL do seu aplicativo sem precisar atualizar
todo o seu código.

.. index:: routes.php

Tour Rápido
===========

Esta seção ensinará a você, como exemplo, os usos mais comuns do CakePHP Router. Normalmente, você deseja exibir algo como uma
página de destino e adicionar isso ao seu arquivo **routes.php**::

    use Cake\Routing\Router;

    // Usando o construtor de rota com escopo.
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // Usando o método estático.
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

O ``Router`` fornece duas interfaces para conectar rotas. O método estático é uma interface compatível com versões anteriores,
enquanto os construtores com escopo oferecem uma sintaxe mais concisa ao criar várias rotas e melhor desempenho.

Isso executará o método de índice no ``ArticlesController`` quando a página inicial do seu site for visitada. Às vezes, você
precisa de rotas dinâmicas que aceitem vários parâmetros; esse seria o caso, por exemplo, de uma rota para visualizar o conteúdo
de um artigo::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

A rota acima aceitará qualquer URL semelhante a ``/articles/15`` e invocará o método ``view (15)`` no ``ArticlesController``.
Porém, isso não impedirá que as pessoas tentem acessar URLs semelhantes a ``/articles/foobar``. Se desejar, você pode restringir
alguns parâmetros para estar em conformidade com uma expressão regular::

    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // Antes de 3.5, use o array de opções
    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    )

O exemplo anterior alterou o marcador de estrelas por um novo espaço reservado para ``:id``. O uso de espaços reservados nos
permite validar partes da URL; nesse caso, usamos a expressão regular ``\d+`` para que apenas os dígitos correspondam.
Finalmente, pedimos ao roteador para tratar o espaço reservado ``id`` como um argumento de função para o método ``view()``
especificando a opção ``pass``. Mais sobre o uso dessa opção posteriormente.

O roteador do CakePHP também pode reverter as rotas de correspondência. Isso significa que, a partir de uma matriz que contém parâmetros correspondentes, é capaz de gerar uma string de URL::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Saída
    /articles/15

As rotas também podem ser rotuladas com um nome exclusivo, isso permite que você as referencie rapidamente ao criar links, em vez de especificar cada um dos parâmetros de roteamento::

    // Em routes.php
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'login']);
    // Saída
    /login

Para ajudar a manter seu código de roteamento DRY, o roteador tem o conceito de 'escopos'. Um escopo define um segmento de caminho comum e, opcionalmente, rotea os padrões. Todas as rotas conectadas dentro de um escopo herdarão o caminho/padrão de seus escopos de encapsulamento::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

A rota acima combinaria com ``/blog/`` e enviaria para ``Blog\Controller\ArticlesController::index()``.

O esqueleto do aplicativo vem com algumas rotas para você começar. Depois de adicionar suas próprias rotas, você poderá remover as rotas padrão se não precisar delas.

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

Conectando Rotas
================

.. php:method:: connect($route, $defaults = [], $options = [])

Para manter seu código :term:`DRY` você deve usar 'escopos de roteamento'. Os escopos de roteamento não apenas permitem que você mantenha seu código DRY, eles também ajudam o Router a otimizar sua operação. O método padrão é o escopo ``/``. Para criar um escopo e conectar algumas rotas, usaremos o método ``scope()``::

    // Em config/routes.php
    use Cake\Routing\Route\DashedRoute;

    Router::scope('/', function ($routes) {
        // Conecte as rotas de fallback genéricas.
        $routes->fallbacks(DashedRoute::class);
    });

O método ``connect()`` leva até três parâmetros: o modelo de URL que você deseja corresponder, os valores padrão para seus elementos de rota e as opções para a rota. As opções freqüentemente incluem regras de expressões regulares para ajudar o roteador a combinar elementos na URL.

O formato básico para uma definição de rota é::

    $routes->connect(
        '/url/template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

O primeiro parâmetro é usado para informar ao roteador que tipo de URL você está tentando controlar. A URL é uma string delimitada por uma barra normal, mas também pode conter um curinga (\*) ou :ref:`route-elements`. O uso de um curinga informa ao roteador que você deseja aceitar quaisquer argumentos adicionais fornecidos. As rotas sem um \* correspondem apenas ao padrão de modelo exato fornecido.

Depois de especificar uma URL, use os dois últimos parâmetros de ``connect()`` para dizer ao CakePHP o que fazer com uma solicitação, uma vez que ela corresponda. O segundo parâmetro é uma matriz associativa. As chaves da matriz devem ser nomeadas após os elementos de rota que o modelo de URL representa. Os valores na matriz são os valores padrão para essas chaves. Vejamos alguns exemplos básicos antes de começarmos a usar o terceiro parâmetro de ``connect()``::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

Esta rota é encontrada no arquivo routes.php distribuído com o CakePHP. Ele corresponde a qualquer URL que comece com ``/pages/`` e passa para a ação ``display()`` do ``PagesController``. Um pedido para ``/pages/products`` seria mapeado para ``PagesController->display('products')``.

Além da estrela gananciosa ``/*`` existe também a sintaxe da estrela ``/**``. Usando uma estrela dupla à direita, capturaremos o restante de uma URL como um único argumento transmitido. Isto é útil quando você quer usar um argumento que inclua um ``/`` nele::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

A URL de entrada de ``/pages/the-example-/-e-proof`` resultaria em um único argumento passado de ``the-example-/-e-proof``.

Você pode usar o segundo parâmetro de ``connect()`` para fornecer quaisquer parâmetros de roteamento que sejam compostos dos valores padrão da rota ::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );


Este exemplo mostra como você pode usar o segundo parâmetro de ``connect()`` para definir parâmetros padrão. Se você criou um site que apresenta produtos para diferentes categorias de clientes, considere a possibilidade de criar uma rota. Isso permite que você crie um link para ``/government`` em vez de ``/pages/display/5``.

Um uso comum para o roteamento é criar segmentos de URL que não correspondam aos seus nomes de controlador ou modelo. Digamos que em vez de acessar nosso URL regular em `/users/some_action/5``, gostaríamos de poder acessá-lo por ``/cooks/some_action/5``. A rota seguinte cuida disso::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

Isto está dizendo ao Roteador que qualquer URL que comece com ``/cooks/`` deve ser enviado para o ``UsersController``. A ação chamada dependerá do valor do parâmetro ``:action``. Usando :ref:`route-elements`, você pode criar rotas variáveis, que aceitam entrada ou variáveis do usuário. A rota acima também usa a estrela gananciosa. A estrela gananciosa indica que esta rota deve aceitar qualquer argumento de posição adicional dado. Estes argumentos serão disponibilizados no array :ref:`passed-arguments`.

Ao gerar URLs, as rotas são usadas também. Usando ``['controller' => 'Users', 'action' => 'some_action', 5]`` como uma URL irá gerar ``/cooks/some_action/5`` se a rota acima for a primeira encontrada.

As rotas que conectamos até agora corresponderão a qualquer verbo HTTP. Se você estiver criando uma API REST, geralmente desejará mapear ações HTTP para diferentes métodos de controlador. O ``RouteBuilder`` fornece métodos auxiliares que tornam mais simples a definição de rotas para verbos HTTP específicos::

    // Crie uma rota que responda apenas a solicitações GET.
    $routes->get(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // Criar uma rota que responda apenas a solicitações PUT
    $routes->put(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

As rotas acima mapeiam a mesma URL para diferentes ações do controlador com base no verbo HTTP usado. As solicitações GET irão para a ação 'ver', enquanto as solicitações PUT irão para a ação 'atualizar'. Existem métodos auxiliares HTTP para:

* GET
* POST
* PUT
* PATCH
* DELETE
* OPTIONS
* HEAD

Todos esses métodos retornam a instância da rota, permitindo que você aproveite os :ref:`fluent setters <route-fluent-methods>` para configurar ainda mais sua rota.

.. _route-elements:

Elementos de Rota
-----------------

Você pode especificar seus próprios elementos de rota e isso permite que você defina locais na URL onde os parâmetros das ações do controlador devem estar. Quando um pedido é feito, os valores para estes elementos de rota são encontrados em ``$this->request->getParam()`` no controlador. Quando você define um elemento de rota personalizado, você pode, opcionalmente, especificar uma expressão regular - isso diz ao CakePHP como saber se a URL está formada corretamente ou não. Se você optar por não fornecer uma expressão regular, qualquer caractere que não seja ``/`` será tratado como parte do parâmetro::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    // Antes de 3.5, use o array de opções
    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

O exemplo acima ilustra como criar uma maneira rápida de visualizar modelos de qualquer controlador criando uma URL que se parece com ``/controllerername/:id``. A URL fornecida para ``connect()`` especifica dois elementos de rota: ``:controller`` e ``:id``. O elemento ``:controller`` é um elemento de rota padrão do CakePHP, portanto o roteador sabe como combinar e identificar os nomes dos controladores nas URLs. O elemento ``:id`` é um elemento de rota personalizado e deve ser esclarecido ainda mais especificando uma expressão regular correspondente no terceiro parâmetro de ``connect()``.

O CakePHP não produz automaticamente URLs em minúsculas e tracejadas ao usar o parâmetro ``:controller``. Se você precisar disso, o exemplo acima pode ser reescrito da seguinte maneira::

    use Cake\Routing\Route\DashedRoute;

    // Crie um construtor com uma classe de rota diferente.
    $routes->scope('/', function ($routes) {
        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/:controller/:id', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        // Antes de 3.5 usar matriz de opções
        $routes->connect(
            '/:controller/:id',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

A classe ``DashedRoute`` garantirá que os parâmetros ``:controller`` e ``:plugin`` estejam corretamente em minúsculas e tracejados.

Se você precisar de URLs minúsculas e sublinhadas durante a migração de um aplicativo CakePHP 2.x, poderá usar a classe ``InflectedRoute``.

.. note::

    Padrões usados para elementos de rota não devem conter nenhum
    grupo de captura. Em caso afirmativo, o roteador não funcionará corretamente.

Uma vez definida essa rota, solicitar ``/apples/5`` chamaria o método ``view()`` de ApplesController. Dentro do método ``view()``, você precisaria acessar o ID passado em ``$this->request->getParam('id')``.

Se você possui um único controlador no seu aplicativo e não deseja que o nome do controlador apareça na URL, é possível mapear todos os URLs para ações no seu controlador. Por exemplo, para mapear todos os URLs para ações do controlador ``home``, por exemplo, ter URLs como ``/demo`` em vez de ``/home/demo``, você pode fazer o seguinte::


    $routes->connect('/:action', ['controller' => 'Home']);

Se você deseja fornecer um URL que não diferencia maiúsculas de minúsculas, pode usar modificadores embutidos de expressão regular::

    // Antes da 3.5, use a matriz de opções em vez de setPatterns()
    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

Mais um exemplo e você será um profissional de roteamento::

    // Antes da 3.5, use a matriz de opções em vez de setPatterns()
    $routes->connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index']
    )->setPatterns([
        'year' => '[12][0-9]{3}',
        'month' => '0[1-9]|1[012]',
        'day' => '0[1-9]|[12][0-9]|3[01]'
    ]);

Isso está bastante envolvido, mas mostra como as rotas podem ser poderosas. O URL fornecido possui quatro elementos de rota. O primeiro é familiar para nós: é um elemento de rota padrão que diz ao CakePHP para esperar um nome de controlador.

Em seguida, especificamos alguns valores padrão. Independentemente do controlador, queremos que a ação ``index()`` seja chamada.

Por fim, especificamos algumas expressões regulares que corresponderão a anos, meses e dias na forma numérica. Observe que parênteses (agrupamento) não são suportados nas expressões regulares. Você ainda pode especificar alternativas, como acima, mas não agrupadas entre parênteses.

Uma vez definida, essa rota corresponderá a ``/articles/2007/02/01``, ``/articles/2004/11/16``, entregando as solicitações às ações ``index()`` de seus respectivos controladores , com os parâmetros de data em ``$this->request->getParam()``.

Existem vários elementos de rota que têm um significado especial no CakePHP e não devem ser usados, a menos que você queira o significado especial

* ``controller`` Usado para nomear o controlador para uma rota.
* ``action`` Usado para nomear a ação do controlador para uma rota.
* ``plugin`` Usado para nomear o plug-in em que um controlador está localizado.
* ``prefix`` Usado para :ref:`prefix-routing`
* ``_ext`` Usado para :ref:`File extentions routing <file-extensions>`.
* ``_base`` Defina como ``false`` para remover o caminho base da URL gerada. Se o seu aplicativo não estiver no diretório raiz, isso poderá ser usado para gerar URLs que são 'relativos ao cake'
* ``_scheme`` Configure para criar links em diferentes esquemas, como `webcal` ou `ftp`. O padrão é o esquema atual.
* ``_host`` Defina o host a ser usado para o link. O padrão é o host atual.
* ``_port`` Defina a porta se precisar criar links em portas não padrão.
* ``_full`` Se ``true``, a constante `FULL_BASE_URL` será anexada aos URLs gerados
* ``#`` Permite definir fragmentos de hash de URL.
* ``_https`` Defina como ``true`` para converter o URL gerado em https ou ``false`` para forçar http.
* ``_method`` Defina o verbo/método HTTP a ser usado. Útil ao trabalhar com :ref:`resource-routes`.
* ``_name`` Nome da rota. Se você configurou rotas nomeadas, poderá usar esta chave para especificá-la.

.. _route-fluent-methods:

Configurando opções de rota
---------------------------

Há várias opções de rotas que podem ser definidas individualmente. Após conectar uma rota, você pode usar seus métodos fluentes do construtor para configurar ainda mais a rota. Esses métodos substituem muitas das chaves no parâmetro ``$options`` de ``connect()``::

    $routes->connect(
        '/:lang/articles/:slug',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    // Permite requisiçes GET e POSTS.
    ->setMethods(['GET', 'POST'])

    // Corresponder apenas no subdomínio do blog.
    ->setHost('blog.example.com')

    // Defina os elementos da rota que devem ser convertidos em argumentos passados
    ->setPass(['slug'])

    // Definir os padrões correspondentes para elementos de rota
    ->setPatterns([
        'slug' => '[a-z0-9-_]+',
        'lang' => 'en|fr|es',
    ])

    // Permitir também extensões de arquivo JSON
    ->setExtenions(['json'])

    // Defina lang como um parâmetro persistente
    ->setPersist(['lang']);

Passando parâmetros para ação
-----------------------------

Ao conectar rotas usando :ref:`route-elements`, você pode querer que elementos roteados sejam passados por argumentos. A opção ``pass`` lista as permissões que elementos de rota também devem ser disponibilizados como argumentos passados para as funções do controlador::


    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // Algum código aqui...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view']
        )
        // Define os elementos da rota no modelo de rota
        // para passar como argumentos de função. O pedido é importante,
        // pois isso simplesmente mapeie ":id" para $articleId em sua ação
        ->setPass(['id', 'slug'])
        // Define um padrão que o `id` deve corresponder.
        ->setPatterns([
            'id' => '[0-9]+',
        ]);
    });

Agora, graças aos recursos de roteamento reverso, você pode passar a matriz de URLs como abaixo e o CakePHP saberá como formar a URL conforme definido nas rotas::

    // view.php
    // Isso retornará um link para /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

    // Você também pode usar parâmetros indexados numericamente.
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _named-routes:

Usando Rotas Nomeadas
---------------------

Às vezes, você encontrará a digitação de todos os parâmetros de URL de uma rota muito detalhados ou gostaria de aproveitar as melhorias de desempenho que as rotas nomeadas possuem. Ao conectar rotas, você pode especificar uma opção ``_name``, essa opção pode ser usada no roteamento reverso para identificar a rota que você deseja usar::

    // Conecte uma rota com um nome.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Nomear uma rota específica do verbo (3.5.0+)
    $routes->post(
        '/logout',
        ['controller' => 'Users', 'action' => 'logout'],
        'logout'
    );

    // Gere um URL usando uma rota nomeada.
    $url = Router::url(['_name' => 'logout']);

    // Gere um URL usando uma rota nomeada,
    // com algumas cadeias de caracteres de consulta args.
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

Se o seu modelo de rota contiver elementos de rota como ``:controller``, você precisará
fornecê-los como parte das opções para ``Router::url()``.

.. note::

    Os nomes das rotas devem ser exclusivos em todo o aplicativo. O mesmo
    ``_name`` não pode ser usado duas vezes, mesmo que os nomes ocorram dentro de um
    escopo de roteamento diferente.

Ao criar rotas nomeadas, você provavelmente desejará seguir algumas convenções para
os nomes das rotas. O CakePHP facilita a criação de nomes de rotas, permitindo definir
prefixos de nomes em cada escopo::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // O nome desta rota será `api:ping`
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });

    // Gere uma URL para a rota de ping
    Router::url(['_name' => 'api:ping']);

    // Use namePrefix com plugin()
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // Conecta rotas.
    });

    // Ou com prefix()
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // Conecta rotas.
    });

Você também pode usar a opção ``_namePrefix`` dentro de escopos aninhados e funciona
conforme o esperado::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // O nome desta rota será `contacts:api:ping`
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // Gere uma URL para a rota de ping
    Router::url(['_name' => 'contacts:api:ping']);


As rotas conectadas nos escopos nomeados somente terão nomes adicionados se a rota também
for nomeada. As rotas sem nome não terão o ``_namePrefix`` aplicado a elas.

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix Routing
--------------

.. php:staticmethod:: prefix($name, $callback)

Muitos aplicativos requerem uma seção de administração na qual usuários privilegiados
podem fazer alterações. Isso geralmente é feito por meio de uma URL especial, como
``/admin/users/edit/5``. No CakePHP, o roteamento de prefixo pode ser ativado usando
o método de escopo ``prefix``::

    use Cake\Routing\Route\DashedRoute;

    Router::prefix('Admin', function ($routes) {
        // Todas as rotas aqui serão prefixadas com `/admin`. Também
        // será adicionado o elemento de rota `'prefix' => 'Admin'`,
        // que será necessário ao gerar URLs para essas rotas
        $routes->fallbacks(DashedRoute::class);
    });

Os prefixos são mapeados para sub-namespaces no namespace ``Controller`` do seu aplicativo.
Por ter prefixos como controladores separados, você pode criar controladores menores e
mais simples. O comportamento comum aos controladores prefixados e não prefixados pode
ser encapsulado usando herança, :doc:`/controllers/components` ou traits. Usando o exemplo
de nossos usuários, acessar a URL ``/admin/users/edit/5`` chamaria o método ``edit()`` do nosso
**src/Controller/Admin/UsersController.php** passando 5 como o primeiro parâmetro. O arquivo
de visualização usado seria **templates/Admin/Users/edit.php**.

Você pode mapear a URL /admin para sua ação ``index()`` do controlador de páginas usando a seguinte rota::

    Router::prefix('Admin', function ($routes) {
        // Como você está no escopo do administrador,
        // não é necessário incluir o prefixo /admin
        // ou o elemento de rota do administrador.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

Ao criar rotas de prefixo, você pode definir parâmetros de rota adicionais usando o argumento ``$options``::

    Router::prefix('Admin', ['param' => 'value'], function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/admin' e
        // têm a chave de roteamento 'param' definida.
        $routes->connect('/:controller');
    });

Os prefixos de várias palavras são convertidos por padrão usando inflexão dasherize,
ou seja, ``MyPrefix`` seria mapeado para ``my-prefix`` na URL. Certifique-se de definir
um caminho para esses prefixos se você quiser usar um formato diferente, como por
exemplo, sublinhado::

    Router::prefix('MyPrefix', ['path' => '/my_prefix'], function (RouteBuilder $routes) {
        // As rotas conectadas aqui são prefixadas com '/my_prefix'
        $routes->connect('/:controller');
    });

Você também pode definir prefixos dentro dos escopos de plugins::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('Admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

O exemplo acima criaria um modelo de rota como ``/debug_kit/admin/:controller``. A rota
conectada teria os elementos de rota ``plugin`` e ``prefix`` definidos.

Ao definir prefixos, você pode aninhar vários prefixos, se necessário::

    Router::prefix('Manager', function ($routes) {
        $routes->prefix('Admin', function ($routes) {
            $routes->connect('/:controller/:action');
        });
    });

O exemplo acima, criaria um modelo de rota como ``/manager/admin/:controller/:action``.
A rota conectada teria o elemento de rota ``prefix`` configurado como ``Manager/Admin``.

O prefixo atual estará disponível nos métodos do controlador através de
``$this->request->getParam('prefix')``.

Ao usar rotas de prefixo, é importante definir a opção ``prefix`` e usar o mesmo
formato de camelo que é usado no método ``prefix()``. Veja como criar esse link
usando o HTML Helper::

    // Entre em uma rota prefixada.
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'Manager/Admin', 'controller' => 'Articles', 'action' => 'add']
    );

    // Deixe um prefixo
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. note::

    Você deve conectar rotas de prefixo *antes* de conectar rotas de fallback.

.. index:: plugin routing

Criando links para rotas de prefixo
-----------------------------------

Você pode criar links que apontam para um prefixo, adicionando a chave de prefixo
à sua matriz de URL::

    echo $this->Html->link(
        'New admin todo',
        ['prefix' => 'Admin', 'controller' => 'TodoItems', 'action' => 'create']
    );

Ao usar o aninhamento, você precisa encadeá-los::

    echo $this->Html->link(
        'New todo',
        ['prefix' => 'Admin/MyPrefix', 'controller' => 'TodoItems', 'action' => 'create']
    );

Isso vincularia a um controlador com o namespace ``App\Controller\Admin\MyPrefix``
e o caminho do arquivo ``src/Controller/Admin/MyPrefix/TodoItemsController.php``.

.. note::

    O prefixo é sempre camel case aqui, mesmo que o resultado do roteamento seja
    tracejado. A própria rota fará a inflexão, se necessário.

Roteamento de Plugins
---------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

As rotas para :doc:`/plugins` devem ser criadas usando o método ``plugin()``. Este
método cria um novo escopo de roteamento para as rotas do plugin::

    Router::plugin('DebugKit', function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/debug_kit' e
        // têm o elemento de rota do plug-in definido como 'DebugKit'.
        $routes->connect('/:controller');
    });

Ao criar escopos de plug-in, você pode personalizar o caminho usando a opção ``path``::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/debug_kit' e
        // têm o elemento de rota do plug-in definido como 'DebugKit'.
        $routes->connect('/:controller');
    });

Ao usar escopos, você pode aninhar escopos de plug-ins dentro de escopos de prefixo::

    Router::prefix('Admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

O exemplo acima criaria uma rota parecida com ``/admin/debug_kit/:controller``. Teria o
conjunto de elementos de rota ``prefix`` e ``plugin``. A seção :ref:`plugin-routes`
possui mais informações sobre a construção de rotas para plugins.

Criando links para rotas de plugins
-----------------------------------

Você pode criar links que apontam para um plug-in, adicionando a chave do plug-in a seu array de URL::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

Por outro lado, se a solicitação ativa for uma solicitação de plug-in e você desejar
criar um link que não possua plug-in, faça o seguinte::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

Ao definir ``'plugin' => null``, você diz ao roteador que deseja criar um link que não faça parte de um plug-in.

Roteamento otimizado para SEO
-----------------------------

Alguns desenvolvedores preferem usar hífens nos URLs, pois é percebido que eles fornecem
melhores classificações nos mecanismos de pesquisa. A classe ``DashedRoute`` pode ser
usada em seu aplicativo com a capacidade de rotear nomes de plugins, controladores e
ações "camelizadas" para uma URL tracejada.

Por exemplo, se tivéssemos um plugin ``ToDo``, com um controlador ``TodoItems`` e uma
ação ``showItems()``, ele poderia ser acessado em ``/to-do/todo-items/show-items``
com a seguinte conexão do roteador::

    use Cake\Routing\Route\DashedRoute;

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Correspondendo a métodos HTTP específicos
-----------------------------------------

As rotas podem corresponder a métodos HTTP específicos usando os métodos auxiliares de verbo HTTP::

    Router::scope('/', function($routes) {
        // Esta rota corresponde apenas às solicitações POST.
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // Corresponder vários verbos
        // Antes do 3.5, use $options['_method'] para definir o método
        $routes->connect(
            '/reviews/start',
            [
                'controller' => 'Reviews',
                'action' => 'start',
            ]
        )->setMethods(['POST', 'PUT']);
    });

Você pode combinar vários métodos HTTP usando uma matriz. Como o parâmetro ``_method`` é
uma chave de roteamento, ele participa da análise e geração de URLs. Para gerar URLs para
rotas específicas de métodos, você precisará incluir a chave ``_method`` ao gerar a URL::

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

Nomes de host específicos correspondentes
-----------------------------------------

As rotas podem usar a opção ``_host`` para corresponder apenas a hosts específicos. Você
pode usar o curinga ``*.`` para corresponder a qualquer subdomínio::

    Router::scope('/', function($routes) {
        // Esta rota corresponde apenas a http://images.example.com
        // Antes da versão 3.5, use a opção _host
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // Esta rota corresponde apenas a http://*.example.com
        $routes->connect(
            '/images/old-logo.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('*.example.com');
    });

A opção ``_host`` também é usada na geração de URL. Se a opção ``_host`` especificar um
domínio exato, esse domínio será incluído no URL gerado. No entanto, se você usar um
curinga, precisará fornecer o parâmetro ``_host`` ao gerar URLs::

    // Se você tem esta rota
    $routes->connect(
        '/images/old-logo.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // Você precisa disso para gerar um URL
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. index:: file extensions
.. _file-extensions:

Extensões de arquivo de roteamento
----------------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

Para lidar com diferentes extensões de arquivo com suas rotas, você pode definir extensões
em nível global e de escopo. A definição de extensões globais
pode ser obtida através do método estático :php:meth:`Router::extensions()` dos roteadores::

    Router::extensions(['json', 'xml']);
    // ...

Isso afetará **todas** as rotas que serão conectadas **posteriormente**, independentemente do seu escopo.

Para restringir extensões a escopos específicos, você pode defini-las usando o método
:php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()`::

    Router::scope('/', function ($routes) {
        // Prior to 3.5.0 use `extensions()`
        $routes->setExtensions(['json', 'xml']);
    });


Isso habilitará as extensões nomeadas para todas as rotas que estão sendo conectadas esse escopo
**após** a chamada de ``setExtensions()``, incluindo aqueles que estão sendo conectado em escopos
aninhados. Semelhante ao método global :php:meth:`Router::extensions()`,
quaisquer rotas conectadas antes da chamada não herdarão as extensões.

.. note::

    A configuração das extensões deve ser a primeira coisa que você faz em um escopo, pois as extensões
    serão aplicadas apenas às rotas conectadas **depois** que as extensões forem definidas.

    Lembre-se também de que escopos reabertos **não** herdarão extensões definidas em escopos abertos anteriormente.

Ao usar extensões, você diz ao roteador para remover as extensões de arquivo correspondentes e analisar o que resta.
Se você deseja criar uma URL como /page/title-of-page.html, crie sua rota usando::

    Router::scope('/page', function ($routes) {
        // Antes de 3.5.0 use `extensions()`
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

Para criar links que mapeiam de volta para as rotas, basta usar::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

As extensões de arquivo são usadas por :doc:`/controllers/components/request-handling` para fazer a troca
automática de exibição com base nos tipos de conteúdo.

.. _connecting-scoped-middleware:

Conectando Middleware com Escopo
--------------------------------

Embora o Middleware possa ser aplicado a todo o aplicativo, a aplicação do middleware a escopos de roteamento
específicos oferece mais flexibilidade, pois você pode aplicar o middleware apenas onde for necessário, permitindo
que o middleware não se preocupe com como/onde está sendo aplicado.

Antes que o middleware possa ser aplicado a um escopo, ele precisa ser registrado na coleção de rotas::

    // Em config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    Router::scope('/', function ($routes) {
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
        $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());
    });

Uma vez registrado, o middleware com escopo definido pode ser aplicado a escopos específicos::

    $routes->scope('/cms', function ($routes) {
        // Habilita os middlewares de CSRF & cookies
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/:action/*', ['controller' => 'Articles']);
    });

Nas situações em que você tem escopos aninhados, os escopos internos herdarão o middleware aplicado no escopo que o contém::

    $routes->scope('/api', function ($routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function ($routes) {
            $routes->applyMiddleware('v1compat');
            // Define routes here.
        });
    });

No exemplo acima, as rotas definidas em ``/v1`` terão os middlewares 'ratelimit', 'auth.api' e 'v1compat' aplicados.
Se você reabrir um escopo, o middleware aplicado às rotas em cada escopo será isolado::

    $routes->scope('/blog', function ($routes) {
        $routes->applyMiddleware('auth');
        // Conecte as ações autenticadas para o blog aqui.
    });
    $routes->scope('/blog', function ($routes) {
        // Conecte as ações públicas para o blog aqui.
    });

No exemplo acima, os dois usos do escopo ``/blog`` não compartilham middleware. No entanto, esses dois escopos
herdarão o middleware definido em seus escopos anexos.

Agrupando Middlewares
---------------------

Para ajudar a manter o seu código de rota :abbr:`DRY (Do not Repeat Yourself)` o middleware pode ser combinado em grupos.
Uma vez que grupos combinados podem ser aplicados, como o middleware::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // Aplica o grupo
    $routes->applyMiddleware('web');

.. _resource-routes:

Criando rotas RESTful
=====================

O controle de rotas facilita a geração de rotas RESTful para seus controllers. Repousante as rotas são úteis quando você
está criando pontos finais da API para sua aplicação. E se queríamos permitir acesso REST a um controlador de receita,
faríamos algo como esta::

    // no arquivo config/routes.php...

    Router::scope('/', function ($routes) {
        // anterior a versao 3.5.0 usar `extensions()`
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

A primeira linha configura uma série de rotas padrão para REST, de fácil acesso onde o método especifica o formato de resultado
desejado (por exemplo, xml, json, rss). Essas rotas são sensíveis ao método de solicitação HTTP.

=========== ===================== ==============================
HTTP format URL.format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PATCH       /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

A classe CakePHP Router usa uma série de indicadores diferentes para detectar o método HTTP que está sendo usado.
Aqui estão em ordem de preferência:

#. A váriavel ``_method`` POST
#. O ``X_HTTP_METHOD_OVERRIDE``
#. O cabeçalho ``REQUEST_METHOD``

A váriavel ``_method`` POST é útil na quando há um navegador como cliente REST (ou qualquer outra coisa que possa fazer POST).
Basta definir o valor do ``\_method`` para o nome do método de solicitação HTTP que você deseja emular.

Criando rotas de recursos aninhados
-----------------------------------

Depois de conectar recursos em um escopo, você também pode conectar rotas para sub-recursos. As rotas de sub-recursos serão
precedidas pelo nome do recurso original e um parâmetro ``id``. Por exemplo::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

Irá gerar rotas de recursos para ``articles`` e ``comments``. As rotas de comentários terão a aparência de::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

Você pode obter o ``article_id`` em ``CommentsController`` por::

    $this->request->getParam('article_id');

Por padrão, as rotas de recursos são mapeadas para o mesmo prefixo que o escopo que contém. Se você tiver controladores
de recursos aninhados e não aninhados, poderá usar um controlador diferente em cada contexto usando prefixos::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments', ['prefix' => 'Articles']);
        });
    });

A descrição acima mapeia o recurso 'Comments' para ``App\Controller\Articles\CommentsController``. Ter controladores
separados permite manter a lógica do controlador mais simples. Os prefixos criados dessa maneira são compatíveis com
:ref:`prefix-routing`.

.. note::

    Embora você possa aninhar recursos tão profundamente quanto necessário, não é recomendável
    aninhar mais de 2 recursos juntos.

Limitando as rotas criadas
--------------------------

Por padrão, o CakePHP conectará seis rotas para cada recurso. Se você deseja conectar apenas rotas de recursos
específicos, use a opção ``only``::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Criaria rotas de recurso somente leitura. Os nomes das rotas são ``create``,
``update``, ``view``, ``index`` e ``delete``

Alterando as ações usadas no controlador
----------------------------------------

Pode ser necessário alterar os nomes de ação do controlador usados ao conectar rotas. Por exemplo,
se sua ação ``edit()`` é chamada ``put()``, você pode usar a chave ``actions`` para renomear as ações usadas::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

O exemplo acima usaria ``put()`` para a ação ``edit()`` e ``add()``
em vez de ``create()``.

Mapeando rotas de recursos adicionais
-------------------------------------

Você pode mapear métodos de recursos adicionais usando a opção ``map``::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // Isso conectaria a /articles/deleteAll

Além das rotas padrão, isso também conectaria uma rota para `/articles/delete_all`. Por padrão, o
segmento do caminho corresponderá ao nome da chave. Você pode usar a chave 'path' dentro da definição
de recurso para personalizar o nome do caminho::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // Isso conectaria a /articles/update_many

Se você definir 'only' e 'map', verifique se seus métodos mapeados também estão na lista 'only'.

.. _custom-rest-routing:

Classes de rota personalizadas para rotas de recursos
-----------------------------------------------------

Você pode fornecer a chave ``connectOptions`` na matriz ``$options`` para ``resources()`` para
fornecer configurações personalizadas usadas por ``connect()``::

    Router::scope('/', function ($routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

Inflexão de URL para rotas de recursos
--------------------------------------

Por padrão, os fragmentos de URL dos controladores com várias palavras são a forma sublinhada do nome do
controlador. Por exemplo, fragmento de URL do ``BlogPostsController`` seria **/blog_posts**.

Você pode especificar um tipo de inflexão alternativo usando a opção ``inflect``::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // Will use ``Inflector::dasherize()``
        ]);
    });

O exemplo acima irá gerar URLs com estilo semelhantes a: **/blog-posts**.

.. note::

    A partir do CakePHP 3.1, o esqueleto oficial do aplicativo usa ``DashedRoute`` como sua classe de
    rota padrão. Recomenda-se o uso da opção ``'inflect' => 'dasherize'`` ao conectar rotas de recursos
    para garantir a consistência da URL

Alterando o elemento de caminho
-------------------------------

Por padrão, as rotas de recursos usam um formulário flexionado do nome do recurso para o segmento de URL.
Você pode definir um segmento de URL personalizado com a opção ``path``::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

.. index:: passed arguments
.. _passed-arguments:

Passando Argumentos
===================

Os argumentos passados são argumentos adicionais ou segmentos de caminho que são usados ao fazer uma solicitação. Eles são
frequentemente usados para passar parâmetros para os métodos do seu controlador::

    http://localhost/calendars/view/recent/mark

No exemplo acima, os argumentos ``recent`` e ``mark`` são passados para ``CalendarsController::view()``. Os argumentos passados
são fornecidos aos seus controladores de três maneiras. Primeiro, como argumentos para o método de ação chamado, segundo, eles
estão disponíveis em ``$this->request->getParam('pass')`` como uma matriz numerada indexada. Ao usar rotas personalizadas, você
pode forçar parâmetros específicos para entrar e os argumentos passados também.

Se você visitar o URL mencionado anteriormente, e teve uma ação de controlador que se parecia com::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

Você obteria a seguinte saída::

    Array
    (
        [0] => recent
        [1] => mark
    )

Esses mesmos dados também estão disponíveis em ``$this->request->getParam('pass')`` em seus controladores,
views e auxiliares. Os valores na matriz de ``pass`` são indexados numericamente com base na ordem em que
aparecem no URL chamado::

    debug($this->request->getParam('pass'));

Qualquer um dos itens acima produziria::

    Array
    (
        [0] => recent
        [1] => mark
    )

Ao gerar URLs, usando a :term: `routing array`, você adiciona argumentos
passados como valores sem chaves de string na matriz::

    ['controller' => 'Articles', 'action' => 'view', 5]

Como ``5`` tem uma chave numérica, ela é tratada como um argumento passado.

Gerando URLs
============

.. php:staticmethod:: url($url = null, $full = false)

Gerar URLs ou roteamento reverso é um recurso do CakePHP que é usado para permitir que você altere sua estrutura de
URLs sem precisar modificar todo o seu código. Usando :term:`routing arrays <routing array>` para definir seus URLs,
você poderá configurar rotas posteriormente e os URLs gerados serão atualizados automaticamente.

Se você criar URLs usando strings como::

    $this->Html->link('View', '/articles/view/' . $id);

E depois decida que ``/articles`` deve realmente ser chamado de 'posts', você precisará passar por
todo o aplicativo renomeando URLs. No entanto, se você definiu seu link como::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

Então, quando você decidiu alterar seus URLs, pode fazê-lo definindo uma rota. Isso alteraria o mapeamento de URLs
recebidos, bem como os URLs gerados.

Ao usar URLs de matriz, você pode definir parâmetros de sequência de consulta e fragmentos de documento usando chaves especiais::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Irá gerar uma URL como.
    /articles/index?page=1#top

O roteador também converterá quaisquer parâmetros desconhecidos em uma matriz de roteamento em parâmetros de querystring.
O ``?`` É oferecido para compatibilidade com versões anteriores do CakePHP.

Você também pode usar qualquer um dos elementos de rota especiais ao gerar URLs:

* ``_ext`` Usado para :ref:`file-extensions` roteamento.
* ``_base`` define como ``false`` para remover o caminho base da URL gerada.
  Se seu aplicativo não estiver no diretório raiz, isso poderá ser usado para
  gerar URLs que são 'relativos ao cake'.
* ``_scheme`` Configure para criar links em diferentes esquemas, como ``webcal`` ou ``ftp``. O padrão é o esquema atual.
* ``_host`` Defina o host a ser usado para o link. O padrão é o host atual.
* ``_port`` Defina a porta se precisar criar links em portas não padrão.
* ``_method`` Defina o verbo HTTP para o qual a URL é.
* ``_full`` Se ``true``, a constante ``FULL_BASE_URL`` será anexada aos URLs gerados.
* ``_https`` Defina como ``true`` para converter o URL gerado em https ou ``false`` para forçar http.
* ``_name`` Nome da rota. Se você configurou rotas nomeadas, poderá usar esta chave para especificá-la.

.. _redirect-routing:

Rotas de redirecionamento
=========================

O roteamento de redirecionamento permite emitir redirecionamentos de status HTTP 30x para rotas de entrada e
apontá-los para URLs diferentes. Isso é útil quando você deseja informar aos aplicativos clientes que um recurso
foi movido e não deseja expor dois URLs para o mesmo conteúdo.

As rotas de redirecionamento são diferentes das rotas normais, pois executam um redirecionamento de cabeçalho real se
uma correspondência for encontrada. O redirecionamento pode ocorrer para um destino dentro do seu aplicativo ou para
um local externo::

    Router::scope('/', function ($routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // Ou ['persist' => ['id']] para roteamento padrão em que
            // a ação de exibição espera o $id como argumento.
        );
    })

Redireciona ``/home/*`` para ``/articles/view`` e passa os parâmetros para ``/articles/view``. O uso de uma
matriz como destino de redirecionamento permite usar outras rotas para definir para onde uma string de URL
deve ser redirecionada. Você pode redirecionar para locais externos usando URLs de string como destino::

    Router::scope('/', function ($routes) {
        $routes->redirect('/articles/*', 'https://google.com', ['status' => 302]);
    });

Isso redirecionaria ``/articles/*`` para ``https://google.com`` com um status HTTP 302.

.. _custom-route-classes:

Classes de rota personalizadas
==============================

As classes de rota personalizadas permitem estender e alterar como rotas individuais analisam solicitações e
manipulam o roteamento reverso. As classes de rota têm algumas convenções:

* As classes de rota devem ser encontradas no espaço de nome ``Routing\Route`` do seu aplicativo ou plugin.
* As classes de rota devem estender :php:class:`Cake\\Routing\\Route`.
* As classes de rota devem implementar os métodos ``match()`` e/ou ``parse()``.

O método ``parse()`` é usado para analisar uma URL recebida. Ele deve gerar uma matriz de parâmetros de solicitação
que podem ser resolvidos em um controlador e ação. Retorne ``false`` deste método para indicar uma falha na correspondência.

O método ``match()`` é usado para corresponder a uma matriz de parâmetros de URL e criar uma URL de string. Se os
parâmetros de URL não corresponderem à rota, ``false`` deve ser retornado.

Você pode usar uma classe de rota personalizada ao fazer uma rota usando a opção ``routeClass``::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

    // Ou configurando o routeClass no seu escopo.
    $routes->scope('/', function ($routes) {
        // Antes de 3.5.0 use `routeClass()`
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
             '/:slug',
             ['controller' => 'Articles', 'action' => 'view']
        );
    });

Esta rota criaria uma instância de ``SlugRoute`` e permitiria a você implementar a manipulação de parâmetros
personalizados. Você pode usar as classes de rota do plugin usando standard:term:`sintaxe plugin`.

Classe de rota padrão
---------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

Se você deseja usar uma classe de rota alternativa para todas as suas rotas além do padrão ``Route``,
pode fazê-lo chamando ``Router::defaultRouteClass()`` antes de configurar qualquer rota e evitar especificar
a opção ``routeClass`` para cada rota. Por exemplo, usando::

    use Cake\Routing\Route\InflectedRoute;

    Router::defaultRouteClass(InflectedRoute::class);

fará com que todas as rotas conectadas depois disso usem a classe de rota ``InflectedRoute``. Chamar o método
sem um argumento retornará a classe de rota padrão atual.

Método de fallbacks
-------------------

.. php:method:: fallbacks($routeClass = null)

The fallbacks method is a simple shortcut for defining default routes. The
method uses the passed routing class for the defined rules or if no class is
provided the class returned by ``Router::defaultRouteClass()`` is used.

Calling fallbacks like so

O método de fallbacks é um atalho simples para definir rotas padrão. O método usa a classe de roteamento
passada para as regras definidas ou, se nenhuma classe for fornecida, a classe retornada por
``Router::defaultRouteClass()`` será usada.

Chamando fallbacks assim::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

É equivalente às seguintes chamadas explícitas::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    O uso da classe de rota padrão (``Route``) com fallbacks ou qualquer rota
    com elementos de rota ``:plugin`` e/ou ``:controller`` resultará em uma URL inconsistente

Criando parâmetros de URL persistentes
======================================

Você pode se conectar ao processo de geração de URL usando as funções de filtro de URL. As funções de filtro são
chamadas *antes* dos URLs corresponderem às rotas, permitindo preparar os URLs antes do roteamento.

As funções de filtro de retorno de chamada devem esperar os seguintes parâmetros:

- ``$params`` Os parâmetros de URL que estão sendo processados.
- ``$request`` A solicitação atual.

A função de filtro de URL deve *sempre* retornar os parâmetros, mesmo que não seja modificada.

Os filtros de URL permitem implementar recursos como parâmetros persistentes::

    Router::addUrlFilter(function ($params, $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }

        return $params;
    });

As funções de filtro são aplicadas na ordem em que estão conectadas.

Outro caso de uso está mudando uma determinada rota no tempo de execução (rotas de plug-in, por exemplo)::

    Router::addUrlFilter(function ($params, $request) {
        if (empty($params['plugin']) || $params['plugin'] !== 'MyPlugin' || empty($params['controller'])) {
            return $params;
        }
        if ($params['controller'] === 'Languages' && $params['action'] === 'view') {
            $params['controller'] = 'Locations';
            $params['action'] = 'index';
            $params['language'] = $params[0];
            unset($params[0]);
        }

        return $params;
    });

Isso alterará a seguinte rota::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

nisso::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

Manipulando parâmetros nomeados em URLs
=======================================

Embora os parâmetros nomeados tenham sido removidos no CakePHP 3.0, os aplicativos podem ter URLs publicados que os
contêm. Você pode continuar aceitando URLs contendo parâmetros nomeados.

No método ``beforeFilter()`` do seu controlador, você pode chamar ``parseNamedParams()`` para extrair
qualquer parâmetro nomeado dos argumentos passados::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

Isso preencherá ``$this->request->getParam('named')`` com quaisquer parâmetros nomeados encontrados nos
argumentos passados. Qualquer argumento passado que foi interpretado como um parâmetro nomeado será removido da
lista de argumentos passados.

.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
