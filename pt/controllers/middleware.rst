Middleware
##########

Os objetos de middleware permitem que você 'embrulhe' seu aplicativo em camadas
reutilizáveis e composíveis de manipulação de solicitações ou lógica de criação
de respostas. Visualmente, seu aplicativo termina no centro e o middleware é envolvido
em volta do aplicativo como uma cebola. Aqui, podemos ver um aplicativo agrupado com os
middlewares Routes, Assets, Exception Handling e CORS.

.. image:: /_static/img/middleware-setup.png

Quando um pedido é tratado pelo seu aplicativo, ele entra no middleware mais externo.
Cada middleware pode delegar a solicitação/resposta para a próxima camada ou retornar
uma resposta. O retorno de uma resposta impede que as camadas inferiores vejam a solicitação.
Um exemplo disso é o plugin AssetMiddleware manipulando uma solicitação de uma imagem de
durante o desenvolvimento.

.. image:: /_static/img/middleware-request.png

Se nenhum middleware executar uma ação para manipular a solicitação, um controlador
será localizado e terá sua ação invocada ou uma exceção será gerada gerando uma página de erro.

O middleware faz parte da nova pilha HTTP no CakePHP que aproveita as interfaces de solicitação e
resposta PSR-7. O CakePHP também suporta o padrão PSR-15 para manipuladores de solicitações de
servidor, para que você possa usar qualquer middleware compatível com PSR-15 disponível em
`The Packagist <https://packagist.org>`_.

Middleware em CakePHP
=====================

O CakePHP fornece vários middlewares para lidar com tarefas comuns em aplicativos da web:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` intercepta exceções do middleware
  empacotado e renderiza uma página de erro usando o manipulador de
  exceção :doc:`/development/errors`.
* ``Cake\Routing\AssetMiddleware`` verifica se a solicitação está se referindo a um tema ou
  arquivo estático do plug-in, como CSS, JavaScript ou arquivo de imagem armazenado na pasta
  raiz da web de um plug-in ou na pasta correspondente a um Tema.
* ``Cake\Routing\Middleware\RoutingMiddleware`` usa o ``Router`` para analisar a URL
  recebida e atribuir parâmetros de roteamento à solicitação.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` habilita a troca automática de idioma no
  cabeçalho ``Accept-Language`` enviado pelo navegador.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` facilita adicionar cabeçalhos relacionados
  à segurança como ``X-Frame-Options`` às respostas.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` oferece a capacidade de manipular cookies
  criptografados, caso você precise manipular cookies com dados ofuscados.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` adiciona proteção CSRF ao seu aplicativo.
* ``Cake\Http\Middleware\BodyParserMiddleware`` permite decodificar JSON, XML e outros corpos
  de solicitação codificados com base no cabeçalho ``Content-Type``.
* ``Cake\Http\Middleware\CspMiddleware`` simplifica a adição de cabeçalhos de política de
  segurança de conteúdo ao seu aplicativo.

.. _using-middleware:

Usando Middleware
=================

O middleware pode ser aplicado ao seu aplicativo globalmente ou individualmente a
escopos de roteamento.

Para aplicar o middleware a todas as solicitações, use o método ``middleware`` da sua classe
``App\Application``. O método de gancho ``middleware`` do seu aplicativo será chamado no
início do processo de solicitação; você pode usar o objeto ``MiddlewareQueue`` para anexar o
middleware::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Vincule o manipulador de erros à fila do middleware.
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            return $middlwareQueue;
        }
    }

Além de adicionar ao final do ``MiddlewareQueue``, você pode executar várias operações::

        $layer = new \App\Middleware\CustomMiddleware;

        // O middleware adicionado será o último da fila.
        $middlwareQueue->add($layer);

        // O middleware precedido será o primeiro da fila.
        $middlwareQueue->prepend($layer);

        // Insira em um slot específico. Se o slot estiver
        // fora dos limites, ele será adicionado ao final.
        $middlwareQueue->insertAt(2, $layer);

        // Insira antes de outro middleware.
        // Se a classe nomeada não puder ser encontrada,
        // uma exceção será gerada.
        $middlwareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insira depois de outro middleware.
        // Se a classe nomeada não puder ser encontrada, o
        // o middleware será adicionado ao final.
        $middlwareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Além de aplicar o middleware a todo o aplicativo, você pode aplicar o
middleware a conjuntos específicos de rotas usando
:ref:`Scope Middleware <connecting-scoped-middleware>`.

Adicionando Middleware a partir de Plugins
------------------------------------------

Os plug-ins podem usar seu método de gancho ``middleware`` para aplicar qualquer
middleware que eles tenham à fila de middleware do aplicativo::

    // Em plugins/ContactManager/src/Plugin.php
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;

    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            $middlwareQueue->add(new ContactManagerContextMiddleware());

            return $middlwareQueue;
        }
    }

Criando um Middleware
=====================

O middleware pode ser implementado como funções anônimas (Closures) ou classes que
estendem ``Psr\Http\Server\MiddlewareInterface``. Embora os Closures sejam
adequados para tarefas menores, eles tornam os testes mais difíceis e podem criar
uma classe ``Application`` complicada. As classes de middleware no CakePHP têm
algumas convenções:

* Os arquivos de classe Middleware devem ser colocados em ** src/Middleware**. Por exemplo:
  **src/Middleware/CorsMiddleware.php**
* As classes de middleware devem ter o sufixo ``Middleware``. Por exemplo:
  ``LinkMiddleware``.
* O Middleware deve implementar ``Psr\Http\Server\MiddlewareInterface``.

O middleware pode retornar uma resposta chamando ``$handler->handle()``
ou criando sua própria resposta. Podemos ver as duas opções em nosso middleware simples::

    // Em src/Middleware/TrackingCookieMiddleware.php
    namespace App\Middleware;

    use Cake\Http\Cookie\Cookie;
    use Cake\I18n\Time;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\RequestHandlerInterface;
    use Psr\Http\Server\MiddlewareInterface;

    class TrackingCookieMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface
        {
            // Chamar $handler->handle() delega o controle para
            // o *próximo* middleware na fila do seu aplicativo.
            $response = $handler->handle($request);

            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie(new Cookie(
                    'landing_page',
                    $request->getRequestTarget(),
                    $expiry
                ));
            }

            return $response;
        }
    }

Agora que criamos um middleware muito simples, vamos anexá-lo ao nosso
aplicativo::

    // Em src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Adicione seu middleware simples à fila
            $middlwareQueue->add(new TrackingCookieMiddleware());

            // Adicione um pouco mais de middleware à fila

            return $middlwareQueue;
        }
    }


.. _routing-middleware:

Roteamento de Middleware
========================

O middleware de roteamento é responsável por aplicar as rotas no seu aplicativo e
resolver o: plug-in, o controlador e a ação que uma solicitação está pedindo.
Ele pode armazenar em cache a coleção de rotas usada no seu aplicativo para aumentar o
tempo de inicialização. Para habilitar o cache de rotas em, forneça o
:ref:`cache configuration <cache-configuration>` desejado como um parâmetro::

    // Em Application.php
    public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
    {
        // ...
        $middlwareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

O exemplo acima usaria o mecanismo de cache ``routing`` para armazenar a coleção
de rotas gerada.

.. _security-header-middleware:

Middleware de Cabeçalho de Segurança
====================================

A camada ``Security Headers Middleware`` facilita a aplicação de cabeçalhos
relacionados à segurança em seu aplicativo. Depois de configurado, o middleware
pode aplicar os seguintes cabeçalhos às respostas:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

Esse middleware é configurado usando uma interface simples antes de ser aplicado à
pilha de middleware do seu aplicativo::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $securityHeaders = new SecurityHeadersMiddleware();
    $securityHeaders
        ->setCrossDomainPolicy()
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->setXssProtection()
        ->noOpen()
        ->noSniff();

    $middlwareQueue->add($securityHeaders);

Middleware do Cabeçalho da Política de Segurança de Conteúdo
============================================================

O ``CspMiddleware`` facilita a adição de cabeçalhos referente a política de segurança de
conteúdo em seu aplicativo. Antes de usá-lo, você deve instalar o ``paragonie/csp-builder``:

.. code-block::bash

    composer require paragonie/csp-builder

Você pode configurar o middleware usando uma matriz ou passando um
objeto ``CSPBuilder`` integrado::

    use Cake\Http\Middleware\CspMiddleware;

    $csp = new CspMiddleware([
        'script-src' => [
            'allow' => [
                'https://www.google-analytics.com',
            ],
            'self' => true,
            'unsafe-inline' => false,
            'unsafe-eval' => false,
        ],
    ]);

    $middlewareQueue->add($csp);

.. _encrypted-cookie-middleware:

Middleware de Cookie Criptografado
==================================

Se o seu aplicativo possui cookies que contêm dados que você deseja ofuscar e
proteger contra adulterações do usuário, você pode usar o middleware de cookies
criptografado do CakePHP para criptografar e descriptografar de forma transparente
os dados de cookies via middleware. Os dados dos cookies são criptografados via
OpenSSL usando AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Nomes de cookies para proteção
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlwareQueue->add($cookies);

.. note::
   É recomendável que a chave de criptografia usada para os dados do
   cookie seja usada *exclusivamente* para os dados do cookie.

Os algoritmos de criptografia e o estilo de preenchimento usados pelo middleware
do cookie são compatíveis com o ``CookieComponent`` de versões anteriores do CakePHP.

.. _csrf-middleware:

Falsificação de Solicitação entre Sites (CSRF) Middleware
=========================================================

A proteção CSRF pode ser aplicada a todo o aplicativo ou a escopos de roteamento específicos.

.. note::

    Você não pode usar as duas abordagens a seguir juntas; deve escolher apenas uma.
    Se você usar as duas abordagens juntas, ocorrerá um erro de incompatibilidade de
    token CSRF em cada solicitação `PUT` e` POST`

Ao aplicar o ``CsrfProtectionMiddleware`` à pilha de middleware do Aplicativo,
você protege todas as ações no aplicativo::

    // Em src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware($middlwareQueue) {
        $options = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($options);

        $middlwareQueue->add($csrf);

        return $middlwareQueue;
    }

Ao aplicar o ``CsrfProtectionMiddleware`` aos escopos de roteamento, você pode
incluir ou excluir grupos de rotas específicos::

    // Em src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes($routes) {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // Em config/routes.php
    Router::scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });


As opções podem ser passadas para o construtor do middleware.
As opções de configuração disponíveis são:

- ``cookieName`` O nome do cookie a ser enviado. O padrão é `` csrfToken``.
- ``expiry`` Quanto tempo o token CSRF deve durar. O padrão é a sessão do navegador.
- ``secure`` Se o cookie será ou não definido com o sinalizador Secure. Isso é,
    o cookie será definido apenas em uma conexão HTTPS e qualquer tentativa no
  HTTP normal falhará. O padrão é ``false``.
- ``httpOnly`` Se o cookie será ou não definido com o sinalizador HttpOnly. O padrão é ``false``.
- ``field`` O campo do formulário a ser verificado. O padrão é ``_csrfToken``.
  Alterar isso também exigirá a configuração do FormHelper.

Quando ativado, você pode acessar o token CSRF atual no objeto de solicitação::

    $token = $this->request->getParam('_csrfToken');

.. note::

    Você deve aplicar o middleware de proteção CSRF apenas para URLs que manipulam solicitações
    com estado usando cookies/sessão. Solicitações sem estado, por ex. ao desenvolver uma API,
    não são afetados pelo CSRF; portanto, o middleware não precisa ser aplicado a essas URLs.

Integração com FormHelper
-------------------------

O ``CsrfProtectionMiddleware`` se integra perfeitamente ao ``FormHelper``. Cada vez
que você cria um formulário com ``FormHelper``, ele insere um campo oculto que contém o token CSRF.

.. note::

    Ao usar a proteção CSRF, você sempre deve iniciar seus formulários com o ``FormHelper``.
    Caso contrário, será necessário criar manualmente entradas ocultas em cada um dos seus formulários.

Solicitações de Proteção CSRF e AJAX
------------------------------------

Além de solicitar parâmetros de dados, os tokens CSRF podem ser enviados por meio
de um cabeçalho especial ``X-CSRF-Token``. O uso de um cabeçalho geralmente facilita
a integração de um token CSRF com aplicativos pesados de JavaScript ou endpoints de API
baseados em XML/JSON.

O token CSRF pode ser obtido através do cookie ``csrfToken``.


.. _body-parser-middleware:

Body Parser Middleware
======================

Se seu aplicativo aceitar JSON, XML ou outros corpos de solicitação codificados,
o ``BodyParserMiddleware`` permitirá que você decodifique essas solicitações em
uma matriz que esteja disponível em ``$request->getParsedData()`` e
``$request->getData()``. Por padrão, apenas os corpos ``json`` serão analisados,
mas a análise XML pode ser ativada com uma opção. Você também pode definir seus
próprios analisadores::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // somente JSON será analisado.
    $bodies = new BodyParserMiddleware();

    // Ativar análise XML
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Desativar a análise JSON
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Adicione seu próprio analisador que corresponda aos
    // valores do cabeçalho do tipo de conteúdo à chamada que pode analisá-los.
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use uma biblioteca de análise CSV.
        return Csv::parse($body);
    });

.. meta::
    :title lang=pt: Http Middleware
    :keywords lang=pt: http, middleware, psr-7, requisicao, resposta, wsgi, aplicataivo, baseapplication
