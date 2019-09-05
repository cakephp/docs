Roteamento
##########

.. php:namespace:: Cake\Routing

.. php:class:: Router

O roteamento fornece ferramentas que mapeiam URLs para ações do controlador. Ao definir rotas, você pode separar como o aplicativo é implementado e como os URLs são estruturadas.

O roteamento no CakePHP também abrange a idéia de roteamento reverso, onde uma matriz de parâmetros pode ser transformada em uma string de URL. Ao usar o roteamento reverso, você pode redimensionar a estrutura de URL do seu aplicativo sem precisar atualizar todo o seu código.

.. index:: routes.php

Tour Rápido
===========

Esta seção ensinará a você, como exemplo, os usos mais comuns do CakePHP Router. Normalmente, você deseja exibir algo como uma página de destino e adicionar isso ao seu arquivo **routes.php**::

    use Cake\Routing\Router;

    // Usando o construtor de rota com escopo.
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // Usando o método estático.
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

O ``Router`` fornece duas interfaces para conectar rotas. O método estático é uma interface compatível com versões anteriores, enquanto os construtores com escopo oferecem uma sintaxe mais concisa ao criar várias rotas e melhor desempenho.

Isso executará o método de índice no ``ArticlesController`` quando a página inicial do seu site for visitada. Às vezes, você precisa de rotas dinâmicas que aceitem vários parâmetros; esse seria o caso, por exemplo, de uma rota para visualizar o conteúdo de um artigo::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

A rota acima aceitará qualquer URL semelhante a ``/articles/15`` e invocará o método ``view (15)`` no ``ArticlesController``. Porém, isso não impedirá que as pessoas tentem acessar URLs semelhantes a ``/articles/foobar``. Se desejar, você pode restringir alguns parâmetros para estar em conformidade com uma expressão regular::

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

O exemplo anterior alterou o marcador de estrelas por um novo espaço reservado para ``:id``. O uso de espaços reservados nos permite validar partes da URL; nesse caso, usamos a expressão regular ``\d+`` para que apenas os dígitos correspondam. Finalmente, pedimos ao roteador para tratar o espaço reservado ``id`` como um argumento de função para o método ``view()`` especificando a opção ``pass``. Mais sobre o uso dessa opção posteriormente.

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

.. versionadded:: 3.5.0
    Os métodos auxiliares do verbo HTTP foram adicionados em 3.5.0

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
* ``_ssl`` Defina como ``true`` para converter o URL gerado em https ou ``false`` para forçar http.
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

.. versionadded:: 3.5.0
    Métodos construtores fluentes foram adicionados em 3.5.0

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

    // view.ctp
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

Se o seu modelo de rota contiver elementos de rota como ``:controller``, você precisará fornecê-los como parte das opções para ``Router::url()``.

.. note::

    Os nomes das rotas devem ser exclusivos em todo o aplicativo. O mesmo 
    ``_name`` não pode ser usado duas vezes, mesmo que os nomes ocorram dentro de um 
    escopo de roteamento diferente.

Ao criar rotas nomeadas, você provavelmente desejará seguir algumas convenções para os nomes das rotas. O CakePHP facilita a criação de nomes de rotas, permitindo definir prefixos de nomes em cada escopo:

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

Você também pode usar a opção ``_namePrefix`` dentro de escopos aninhados e funciona conforme o esperado:

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // O nome desta rota será `contacts:api:ping` 
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // Gere uma URL para a rota de ping
    Router::url(['_name' => 'contacts:api:ping']);


As rotas conectadas nos escopos nomeados somente terão nomes adicionados se a rota também for nomeada. As rotas sem nome não terão o ``_namePrefix`` aplicado a elas.


.. versionadded:: 3.1
    A opção ``_namePrefix`` foi adicionada na versão 3.1

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix Routing
--------------

.. php:staticmethod:: prefix($name, $callback)

Muitos aplicativos requerem uma seção de administração na qual usuários privilegiados podem fazer alterações. Isso geralmente é feito por meio de uma URL especial, como ``/admin/users/edit/5``. No CakePHP, o roteamento de prefixo pode ser ativado usando o método de escopo ``prefix``:

    use Cake\Routing\Route\DashedRoute;

    Router::prefix('admin', function ($routes) {
        // Todas as rotas aqui serão prefixadas com `/ admin` 
        // e terão o elemento de rota prefix => admin adicionado.
        $routes->fallbacks(DashedRoute::class);
    });

Os prefixos são mapeados para sub-namespaces no namespace ``Controller`` do seu aplicativo. Por ter prefixos como controladores separados, você pode criar controladores menores e mais simples. O comportamento comum aos controladores prefixados e não prefixados pode ser encapsulado usando herança, :doc:`/controllers/components` ou traits. Usando o exemplo de nossos usuários, acessar a URL ``/admin/users/edit/5`` chamaria o método ``edit()`` do nosso
**src/Controller/Admin/UsersController.php** passando 5 como o primeiro parâmetro. O arquivo de visualização usado seria **src/Template/Admin/Users/edit.ctp**

Você pode mapear a URL /admin para sua ação ``index()`` do controlador de páginas usando a seguinte rota::

    Router::prefix('admin', function ($routes) {
        // Como você está no escopo do administrador, 
        // não é necessário incluir o prefixo /admin 
        // ou o elemento de rota do administrador.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

Ao criar rotas de prefixo, você pode definir parâmetros de rota adicionais usando o argumento ``$options``::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/admin' e 
        // têm a chave de roteamento 'param' definida.
        $routes->connect('/:controller');
    });

Você também pode definir prefixos dentro dos escopos de plugins:

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

O exemplo acima criaria um modelo de rota como ``/debug_kit/admin/:controller``. A rota conectada teria os elementos de rota ``plugin`` e ``prefix`` definidos.

Ao definir prefixos, você pode aninhar vários prefixos, se necessário:

    Router::prefix('manager', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

O exemplo acima, criaria um modelo de rota como ``/manager/admin/:controller``. A rota conectada teria o elemento de rota ``prefix`` configurado como ``manager/admin``.

O prefixo atual estará disponível nos métodos do controlador através de ``$this->request->getParam('prefix')``

Ao usar rotas de prefixo, é importante definir a opção de prefixo. Veja como criar esse link usando o HTML Helper::

    // Entre em uma rota prefixada.
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'manager', 'controller' => 'Articles', 'action' => 'add']
    );

    // Deixe um prefixo
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. note::

    Você deve conectar rotas de prefixo *antes* de conectar rotas de fallback.

.. index:: plugin routing

Roteamento de Plugins
---------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

As rotas para :doc:`/plugins` devem ser criadas usando o método ``plugin()``. Este método cria um novo escopo de roteamento para as rotas do plugin::

    Router::plugin('DebugKit', function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/debug_kit' e 
        // têm o elemento de rota do plug-in definido como 'DebugKit'.
        $routes->connect('/:controller');
    });

Ao criar escopos de plug-in, você pode personalizar o caminho usando a opção ``path``:

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // As rotas conectadas aqui são prefixadas com '/debug_kit' e 
        // têm o elemento de rota do plug-in definido como 'DebugKit'.
        $routes->connect('/:controller');
    });

Ao usar escopos, você pode aninhar escopos de plug-ins dentro de escopos de prefixo::

    Router::prefix('admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

O exemplo acima criaria uma rota parecida com ``/admin/debug_kit/:controller``. Teria o conjunto de elementos de rota ``prefix`` e ``plugin``. A seção :ref:`plugin-routes` possui mais informações sobre a construção de rotas para plugins.

Criando links para rotas de plugins
-----------------------------------

Você pode criar links que apontam para um plug-in, adicionando a chave do plug-in a seu array de URL::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

Por outro lado, se a solicitação ativa for uma solicitação de plug-in e você desejar criar um link que não possua plug-in, faça o seguinte:

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

Ao definir ``'plugin' => null``, você diz ao roteador que deseja criar um link que não faça parte de um plug-in.

Roteamento otimizado para SEO
-----------------------------

Alguns desenvolvedores preferem usar hífens nos URLs, pois é percebido que eles fornecem melhores classificações nos mecanismos de pesquisa. A classe ``DashedRoute`` pode ser usada em seu aplicativo com a capacidade de rotear nomes de plugins, controladores e ações "camelizadas" para uma URL tracejada.

Por exemplo, se tivéssemos um plugin ``ToDo``, com um controlador ``TodoItems`` e uma ação ``showItems()``, ele poderia ser acessado em ``/to-do/todo-items/show-items`` com a seguinte conexão do roteador::

    use Cake\Routing\Route\DashedRoute;

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Correspondendo a métodos HTTP específicos
-----------------------------------------

As rotas podem corresponder a métodos HTTP específicos usando os métodos auxiliares de verbo HTTP:

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

Você pode combinar vários métodos HTTP usando uma matriz. Como o parâmetro ``_method`` é uma chave de roteamento, ele participa da análise e geração de URLs. Para gerar URLs para rotas específicas de métodos, você precisará incluir a chave ``_method`` ao gerar a URL:

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

Nomes de host específicos correspondentes
-----------------------------------------

As rotas podem usar a opção ``_host`` para corresponder apenas a hosts específicos. Você pode usar o curinga ``*.`` para corresponder a qualquer subdomínio::

    Router::scope('/', function($routes) {
        // Esta rota corresponde apenas a http://images.example.com 
        // Antes da versão 3.5, use a opção _host
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // Esta rota corresponde apenas a http://*.example.com
        $routes->connect(
            '/images/old-log.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('images.example.com');
    });

A opção ``_host`` também é usada na geração de URL. Se a opção ``_host`` especificar um domínio exato, esse domínio será incluído no URL gerado. No entanto, se você usar um curinga, precisará fornecer o parâmetro ``_host`` ao gerar URLs:

    // Se você tem esta rota
    $routes->connect(
        '/images/old-log.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // Você precisa disso para gerar um URL
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. versionadded:: 3.4.0
    A opção `` _host`` foi adicionada na versão 3.4.0

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

Para restringir extensões a escopos específicos, você pode defini-las usando o método :php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()`::

    Router::scope('/', function ($routes) {
        // Prior to 3.5.0 use `extensions()`
        $routes->setExtensions(['json', 'xml']);
    });

This will enable the named extensions for all routes that are being connected in
that scope **after** the ``setExtensions()`` call, including those that are being
connected in nested scopes. Similar to the global :php:meth:`Router::extensions()`
method, any routes connected prior to the call will not inherit the extensions.

.. note::

    Setting the extensions should be the first thing you do in a scope, as the
    extensions will only be applied to routes connected **after** the extensions
    are set.

    Also be aware that re-opened scopes will **not** inherit extensions defined in
    previously opened scopes.

By using extensions, you tell the router to remove any matching file extensions,
and then parse what remains. If you want to create a URL such as
/page/title-of-page.html you would create your route using::

    Router::scope('/page', function ($routes) {
        // Prior to 3.5.0 use `extensions()`
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

Then to create links which map back to the routes simply use::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

File extensions are used by :doc:`/controllers/components/request-handling`
to do automatic view switching based on content types.

.. _connecting-scoped-middleware:

Connecting Scoped Middleware
----------------------------

While Middleware can be applied to your entire application, applying middleware
to specific routing scopes offers more flexibility, as you can apply middleware
only where it is needed allowing your middleware to not concern itself with
how/where it is being applied.

Before middleware can be applied to a scope, it needs to be
registered into the route collection::

    // in config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    Router::scope('/', function ($routes) {
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
        $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());
    });

Once registered, scoped middleware can be applied to specific
scopes::

    $routes->scope('/cms', function ($routes) {
        // Enable CSRF & cookies middleware
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/:action/*', ['controller' => 'Articles'])
    });

In situations where you have nested scopes, inner scopes will inherit the
middleware applied in the containing scope::

    $routes->scope('/api', function ($routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function ($routes) {
            $routes->applyMiddleware('v1compat');
            // Define routes here.
        });
    });

In the above example, the routes defined in ``/v1`` will have 'ratelimit',
'auth.api', and 'v1compat' middleware applied. If you re-open a scope, the
middleware applied to routes in each scope will be isolated::

    $routes->scope('/blog', function ($routes) {
        $routes->applyMiddleware('auth');
        // Connect the authenticated actions for the blog here.
    });
    $routes->scope('/blog', function ($routes) {
        // Connect the public actions for the blog here.
    });

In the above example, the two uses of the ``/blog`` scope do not share
middleware. However, both of these scopes will inherit middleware defined in
their enclosing scopes.

Grouping Middleware
-------------------

To help keep your route code :abbr:`DRY (Do not Repeat Yourself)` middleware can
be combined into groups. Once combined groups can be applied like middleware
can::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // Apply the group
    $routes->applyMiddleware('web');

.. versionadded:: 3.5.0
    Scoped middleware & middleware groups were added in 3.5.0

.. _resource-routes:

Criando rotas RESTful
=====================

O controle de rotas facilita a geração de rotas RESTful para seus controllers. Repousante as rotas são úteis quando você está criando pontos finais da API para sua aplicação. E se queríamos permitir acesso REST a um controlador de receita, faríamos algo como esta::

    // no arquivo config/routes.php...

    Router::scope('/', function ($routes) {
        // anteriora versao 3.5.0 usar `extensions()`
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

A primeira linha configura uma série de rotas padrão para REST fácil acesso onde o método especifica o formato de resultado desejado (por exemplo, xml,json, rss). Essas rotas são sensíveis ao método de solicitação HTTP.

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

A classe CakePHP Router usa uma série de indicadores diferentes para detectar o método HTTP que está sendo usado. Aqui estão em ordem de preferência:

#. O \_method POST variable
#. O X\_HTTP\_METHOD\_OVERRIDE
#. O REQUEST\_METHOD header

O \_method POST variável é útil na utilização de um navegador como um cliente REST (ou qualquer outra coisa que possa fazer POST). Basta definir o valor do \_method para o nome do método de solicitação HTTP que você deseja emular.

Creating Nested Resource Routes
-------------------------------

Once you have connected resources in a scope, you can connect routes for
sub-resources as well. Sub-resource routes will be prepended by the original
resource name and a id parameter. For example::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

Will generate resource routes for both ``articles`` and ``comments``. The
comments routes will look like::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

You can get the ``article_id`` in ``CommentsController`` by::

    $this->request->getParam('article_id');

By default resource routes map to the same prefix as the containing scope. If
you have both nested and non-nested resource controllers you can use a different
controller in each context by using prefixes::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments', ['prefix' => 'articles']);
        });
    });

The above would map the 'Comments' resource to the
``App\Controller\Articles\CommentsController``. Having separate controllers lets
you keep your controller logic simpler. The prefixes created this way are
compatible with :ref:`prefix-routing`.

.. note::

    While you can nest resources as deeply as you require, it is not recommended
    to nest more than 2 resources together.

.. versionadded:: 3.3
    The ``prefix`` option was added to ``resources()`` in 3.3.

Limiting the Routes Created
---------------------------

By default CakePHP will connect 6 routes for each resource. If you'd like to
only connect specific resource routes you can use the ``only`` option::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Would create read only resource routes. The route names are ``create``,
``update``, ``view``, ``index``, and ``delete``.

Changing the Controller Actions Used
------------------------------------

You may need to change the controller action names that are used when connecting
routes. For example, if your ``edit()`` action is called ``put()`` you can
use the ``actions`` key to rename the actions used::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

The above would use ``put()`` for the ``edit()`` action, and ``add()``
instead of ``create()``.

Mapping Additional Resource Routes
----------------------------------

You can map additional resource methods using the ``map`` option::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // This would connect /articles/deleteAll

In addition to the default routes, this would also connect a route for
`/articles/delete_all`. By default the path segment will match the key name. You
can use the 'path' key inside the resource definition to customize the path
name::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // This would connect /articles/update_many

If you define 'only' and 'map', make sure that your mapped methods are also in
the 'only' list.

.. _custom-rest-routing:

Custom Route Classes for Resource Routes
----------------------------------------

You can provide ``connectOptions`` key in the ``$options`` array for
``resources()`` to provide custom setting used by ``connect()``::

    Router::scope('/', function ($routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

URL Inflection for Resource Routes
----------------------------------

By default, multi-worded controllers' URL fragments are the underscored
form of the controller's name. E.g., ``BlogPostsController``'s URL fragment
would be **/blog_posts**.

You can specify an alternative inflection type using the ``inflect`` option::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // Will use ``Inflector::dasherize()``
        ]);
    });

The above will generate URLs styled like: **/blog-posts**.

.. note::

    As of CakePHP 3.1 the official app skeleton uses ``DashedRoute`` as its
    default route class. Using the ``'inflect' => 'dasherize'`` option when
    connecting resource routes is recommended for URL consistency.

Changing the Path Element
-------------------------

By default resource routes use an inflected form of the resource name for the
URL segment. You can set a custom URL segment with the ``path`` option::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

.. versionadded:: 3.5.0
    The ``path`` option was added in 3.5.0

.. index:: passed arguments
.. _passed-arguments:

Passed Arguments
================

Passed arguments are additional arguments or path segments that are
used when making a request. They are often used to pass parameters
to your controller methods. ::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed arguments to
``CalendarsController::view()``. Passed arguments are given to your controllers
in three ways. First as arguments to the action method called, and secondly they
are available in ``$this->request->getParam('pass')`` as a numerically indexed
array. When using custom routes you can force particular parameters to go into
the passed arguments as well.

If you were to visit the previously mentioned URL, and you
had a controller action that looked like::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

You would get the following output::

    Array
    (
        [0] => recent
        [1] => mark
    )

This same data is also available at ``$this->request->getParam('pass')`` in your
controllers, views, and helpers.  The values in the pass array are numerically
indexed based on the order they appear in the called URL::

    debug($this->request->getParam('pass'));

Either of the above would output::

    Array
    (
        [0] => recent
        [1] => mark
    )

When generating URLs, using a :term:`routing array` you add passed
arguments as values without string keys in the array::

    ['controller' => 'Articles', 'action' => 'view', 5]

Since ``5`` has a numeric key, it is treated as a passed argument.

Generating URLs
===============

.. php:staticmethod:: url($url = null, $full = false)

Generating URLs or Reverse routing is a feature in CakePHP that is used to
allow you to change your URL structure without having to modify all your
code. By using :term:`routing arrays <routing array>` to define your URLs, you
can later configure routes and the generated URLs will automatically update.

If you create URLs using strings like::

    $this->Html->link('View', '/articles/view/' . $id);

And then later decide that ``/articles`` should really be called
'posts' instead, you would have to go through your entire
application renaming URLs. However, if you defined your link like::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

Then when you decided to change your URLs, you could do so by defining a
route. This would change both the incoming URL mapping, as well as the
generated URLs.

When using array URLs, you can define both query string parameters and
document fragments using special keys::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Will generate a URL like.
    /articles/index?page=1#top

Router will also convert any unknown parameters in a routing array to
querystring parameters.  The ``?`` is offered for backwards compatibility with
older versions of CakePHP.

You can also use any of the special route elements when generating URLs:

* ``_ext`` Used for :ref:`file-extensions` routing.
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'.
* ``_scheme``  Set to create links on different schemes like ``webcal`` or
  ``ftp``. Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_method`` Define the HTTP verb the URL is for.
* ``_full``  If ``true`` the ``FULL_BASE_URL`` constant will be prepended to
  generated URLs.
* ``_ssl`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

.. _redirect-routing:

Redirect Routing
================

Redirect routing allows you to issue HTTP status 30x redirects for
incoming routes, and point them at different URLs. This is useful
when you want to inform client applications that a resource has moved
and you don't want to expose two URLs for the same content.

Redirection routes are different from normal routes as they perform an actual
header redirection if a match is found. The redirection can occur to
a destination within your application or an outside location::

    Router::scope('/', function ($routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // Or ['persist'=>['id']] for default routing where the
            // view action expects $id as an argument.
        );
    })

Redirects ``/home/*`` to ``/articles/view`` and passes the parameters to
``/articles/view``. Using an array as the redirect destination allows
you to use other routes to define where a URL string should be
redirected to. You can redirect to external locations using
string URLs as the destination::

    Router::scope('/', function ($routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

This would redirect ``/articles/*`` to ``http://google.com`` with a
HTTP status of 302.

.. _custom-route-classes:

Custom Route Classes
====================

Custom route classes allow you to extend and change how individual routes parse
requests and handle reverse routing. Route classes have a few conventions:

* Route classes are expected to be found in the ``Routing\\Route`` namespace of
  your application or plugin.
* Route classes should extend :php:class:`Cake\\Routing\\Route`.
* Route classes should implement one or both of ``match()`` and/or ``parse()``.

The ``parse()`` method is used to parse an incoming URL. It should generate an
array of request parameters that can be resolved into a controller & action.
Return ``false`` from this method to indicate a match failure.

The ``match()`` method is used to match an array of URL parameters and create a
string URL. If the URL parameters do not match the route ``false`` should be
returned.

You can use a custom route class when making a route by using the ``routeClass``
option::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

    // Or by setting the routeClass in your scope.
    $routes->scope('/', function ($routes) {
        //Prior to 3.5.0 use `routeClass()`
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
             '/:slug',
             ['controller' => 'Articles', 'action' => 'view']
        );
    });

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling. You can use plugin route classes using
standard :term:`sintaxe plugin`.

Default Route Class
-------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

If you want to use an alternate route class for all your routes besides the
default ``Route``, you can do so by calling ``Router::defaultRouteClass()``
before setting up any routes and avoid having to specify the ``routeClass``
option for each route. For example using::

    use Cake\Routing\Route\InflectedRoute;

    Router::defaultRouteClass(InflectedRoute::class);

will cause all routes connected after this to use the ``InflectedRoute`` route class.
Calling the method without an argument will return current default route class.

Fallbacks Method
----------------

.. php:method:: fallbacks($routeClass = null)

The fallbacks method is a simple shortcut for defining default routes. The
method uses the passed routing class for the defined rules or if no class is
provided the class returned by ``Router::defaultRouteClass()`` is used.

Calling fallbacks like so::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Is equivalent to the following explicit calls::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    Using the default route class (``Route``) with fallbacks, or any route
    with ``:plugin`` and/or ``:controller`` route elements will result in
    inconsistent URL case.

Creating Persistent URL Parameters
==================================

You can hook into the URL generation process using URL filter functions. Filter
functions are called *before* the URLs are matched against the routes, this
allows you to prepare URLs before routing.

Callback filter functions should expect the following parameters:

- ``$params`` The URL parameters being processed.
- ``$request`` The current request.

The URL filter function should *always* return the parameters even if unmodified.

URL filters allow you to implement features like persistent parameters::

    Router::addUrlFilter(function ($params, $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }
        return $params;
    });

Filter functions are applied in the order they are connected.

Another use case is changing a certain route on runtime (plugin routes for
example)::

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

This will alter the following route::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

into this::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

Handling Named Parameters in URLs
=================================

Although named parameters were removed in CakePHP 3.0, applications may have
published URLs containing them.  You can continue to accept URLs containing
named parameters.

In your controller's ``beforeFilter()`` method you can call
``parseNamedParams()`` to extract any named parameters from the passed
arguments::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

This will populate ``$this->request->getParam('named')`` with any named parameters
found in the passed arguments.  Any passed argument that was interpreted as a
named parameter, will be removed from the list of passed arguments.

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters
