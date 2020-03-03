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
`The Packagist <https://packagist.org>`__.

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

    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Vincule o manipulador de erros à fila do middleware.
            $middlwareQueue->add(new ErrorHandlerMiddleware());
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

Plugins can use their ``middleware`` hook method to apply any middleware they
have to the application's middleware queue::

    // in plugins/ContactManager/src/Plugin.php
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

Creating Middleware
===================

Middleware can either be implemented as anonymous functions (Closures), or classes
which extend ``Psr\Http\Server\MiddlewareInterface``. While Closures are suitable
for smaller tasks they make testing harder, and can create a complicated
``Application`` class. Middleware classes in CakePHP have a few conventions:

* Middleware class files should be put in **src/Middleware**. For example:
  **src/Middleware/CorsMiddleware.php**
* Middleware classes should be suffixed with ``Middleware``. For example:
  ``LinkMiddleware``.
* Middleware must implement ``Psr\Http\Server\MiddlewareInterface``.

Middleware can return a response either by calling ``$handler->handle()`` or by
creating their own response. We can see both options in our simple middleware::

    // In src/Middleware/TrackingCookieMiddleware.php
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
            // Calling $handler->handle() delegates control to the *next* middleware
            // In your application's queue.
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

Now that we've made a very simple middleware, let's attach it to our
application::

    // In src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Add your simple middleware onto the queue
            $middlwareQueue->add(new TrackingCookieMiddleware());

            // Add some more middleware onto the queue

            return $middlwareQueue;
        }
    }


.. _routing-middleware:

Routing Middleware
==================

Routing middleware is responsible for applying your application's routes and
resolving the plugin, controller, and action a request is going to. It can cache
the route collection used in your application to increase startup time. To
enable cached routes, provide the desired :ref:`cache configuration
<cache-configuration>` as a parameter::

    // In Application.php
    public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
    {
        // ...
        $middlwareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

The above would use the ``routing`` cache engine to store the generated route
collection.

.. _security-header-middleware:

Security Header Middleware
==========================

The ``SecurityHeaderMiddleware`` layer makes it easy to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack::

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

Content Security Policy Header Middleware
=========================================

The ``CspMiddleware`` makes it simpler to add Content-Security-Policy headers in
your application. Before using it you should install ``paragonie/csp-builder``:

.. code-block::bash

    composer require paragonie/csp-builder

You can then configure the middleware using an array, or passing in a built
``CSPBuilder`` object::

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

Encrypted Cookie Middleware
===========================

If your application has cookies that contain data you want to obfuscate and
protect against user tampering, you can use CakePHP's encrypted cookie
middleware to transparently encrypt and decrypt cookie data via middleware.
Cookie data is encrypted with via OpenSSL using AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Names of cookies to protect
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlwareQueue->add($cookies);

.. note::
    It is recommended that the encryption key you use for cookie data, is used
    *exclusively* for cookie data.

The encryption algorithms and padding style used by the cookie middleware are
backwards compatible with ``CookieComponent`` from earlier versions of CakePHP.

.. _csrf-middleware:

Cross Site Request Forgery (CSRF) Middleware
============================================

CSRF protection can be applied to your entire application, or to specific routing scopes.

.. note::

    You cannot use both of the following approaches together, you must choose
    only one.  If you use both approaches together, a CSRF token mismatch error
    will occur on every `PUT` and `POST` request

By applying the ``CsrfProtectionMiddleware`` to your Application middleware
stack you protect all the actions in application::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware($middlwareQueue) {
        $options = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($options);

        $middlwareQueue->add($csrf);
        return $middlwareQueue;
    }

By applying the ``CsrfProtectionMiddleware`` to routing scopes, you can include
or exclude specific route groups::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes($routes) {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // in config/routes.php
    Router::scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });


Options can be passed into the middleware's constructor.
The available configuration options are:

- ``cookieName`` The name of the cookie to send. Defaults to ``csrfToken``.
- ``expiry`` How long the CSRF token should last. Defaults to browser session.
- ``secure`` Whether or not the cookie will be set with the Secure flag. That is,
  the cookie will only be set on a HTTPS connection and any attempt over normal HTTP
  will fail. Defaults to ``false``.
- ``httpOnly`` Whether or not the cookie will be set with the HttpOnly flag. Defaults to ``false``.
- ``field`` The form field to check. Defaults to ``_csrfToken``. Changing this
  will also require configuring FormHelper.

When enabled, you can access the current CSRF token on the request object::

    $token = $this->request->getParam('_csrfToken');

.. note::

    You should apply the CSRF protection middleware only for URLs which handle stateful
    requests using cookies/session. Stateless requests, for e.g. when developing an API,
    are not affected by CSRF so the middleware does not need to be applied for those URLs.

Integration with FormHelper
---------------------------

The ``CsrfProtectionMiddleware`` integrates seamlessly with ``FormHelper``. Each
time you create a form with ``FormHelper``, it will insert a hidden field containing
the CSRF token.

.. note::

    When using CSRF protection you should always start your forms with the
    ``FormHelper``. If you do not, you will need to manually create hidden inputs in
    each of your forms.

CSRF Protection and AJAX Requests
---------------------------------

In addition to request data parameters, CSRF tokens can be submitted through
a special ``X-CSRF-Token`` header. Using a header often makes it easier to
integrate a CSRF token with JavaScript heavy applications, or XML/JSON based API
endpoints.

The CSRF Token can be obtained via the Cookie ``csrfToken``.


.. _body-parser-middleware:

Body Parser Middleware
======================

If your application accepts JSON, XML or other encoded request bodies, the
``BodyParserMiddleware`` will let you decode those requests into an array that
is available via ``$request->getParsedData()`` and ``$request->getData()``. By
default only ``json`` bodies will be parsed, but XML parsing can be enabled with
an option. You can also define your own parsers::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // only JSON will be parsed.
    $bodies = new BodyParserMiddleware();

    // Enable XML parsing
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Disable JSON parsing
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Add your own parser matching content-type header values
    // to the callable that can parse them.
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use a CSV parsing library.
        return Csv::parse($body);
    });

.. meta::
    :title lang=en: Http Middleware
    :keywords lang=en: http, middleware, psr-7, request, response, wsgi, application, baseapplication
