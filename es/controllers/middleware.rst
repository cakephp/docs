Middleware
##########

Los objetos del middleware le dan la posibilidad de "envolver" su aplicación en
capas compuestas y reutilizables de la lógica de manejo de la solicitud
o respuesta. Visualmente, su aplicación termina en el centro y el middleware se
envuelve en la aplicación como una cebolla. Aquí podemos ver una aplicación con
enrutamiento, activos, manejo de excepciones y middleware de encabezado CORS.

.. image:: /_static/img/middleware-setup.png


Cuando una solicitud es manejada por su aplicación, ésta ingresa desde el
extremo del middleware. Cada middleware puede delegar la solicitud / respuesta
a la siguiente capa, o devolver una respuesta. Devolver una respuesta evita que
las capas inferiores siempre vean la solicitud. Un ejemplo de eso es el
AssetMiddleware que maneja una solicitud de una imagen de un plugin durante el
desarrollo.

.. image:: /_static/img/middleware-request.png

Si ningún middleware toma medidas para manejar la solicitud, se ubicará un
controlador y se invocará su acción, o se generará una excepción generando una
página de error.

El middleware es parte de la nueva pila HTTP en CakePHP que aprovecha las
interfaces de solicitud y respuesta del PSR-7.  Debido a que CakePHP está
aprovechando el estándar PSR-7, puede usar cualquier middleware compatible con
PSR-7 disponible en The `Packagist <https://packagist.org>`__.

Middleware en CakePHP
=====================

CakePHP proporciona varios middleware para manejar tareas comunes en aplicaciones web:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` atrapa las excepciones del middleware envuelto
    y presenta una página de error usando el controlador de
    :doc:`/development/errors` excepciones de manejo de errores y excepciones.
* ``Cake\Routing\AssetMiddleware`` comprueba si la solicitud se refiere a un archivo
    de tema o complemento, como un archivo CSS, JavaScript o de imagen almacenado en
    la carpeta webroot de un complemento o la correspondiente para un Tema.
* ``Cake\Routing\Middleware\RoutingMiddleware`` utiliza ``Router`` para analizar la URL entrante
    y asignar parámetros de enrutamiento a la solicitud.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` permite el cambio automático de idioma desde
    el ``Accept-Languageencabezado`` enviado por el navegador.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` facilita la adición de encabezados relacionados
    con la seguridad ``X-Frame-Options`` a las respuestas.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` le brinda la capacidad de manipular cookies
    encriptadas en caso de que necesite manipular las cookies con datos confusos.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` agrega protección CSRF a su aplicación.
* ``Cake\Http\Middleware\BodyParserMiddleware`` le permite decodificar JSON, XML y otros cuerpos
    de solicitud codificados basados en ``Content-Type`` del encabezado.

.. _using-middleware:

Usando Middlewares
==================

Los Middlewares pueden ser agregados a tu aplicación globalmente, a rutas específicas o incluso controladores.

Para agregar un middleware a todos los requests, usa el método ``middleware`` de tu
clase ``App\Application``. Este método se llama al inicio del procesamiento del request.
Puedes usar el objeto ``MiddlewareQueue`` para agregar el middleware::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Agregar el manejador de errores en la cola de middlewares.
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            // Agregar middleware por clase.
            // Desde la versión 4.5.0 el nombre de la clase del middleware es
            // resuelto opcionalmente usando el contener DI. Si la clase no es encontrada
            // en el contenedor, entonces una instancia es creada por la cola de middlewares
            $middlewareQueue->add(UserRateLimiting::class);

            return $middlewareQueue;
        }
    }

Adicionalmente, aparte de agregarlo al final de la ``MiddlewareQueue``, puedes realizar distintas
operaciones::

        $layer = new \App\Middleware\CustomMiddleware;

        // El middleware agregado será el último de la cola.
        $middlewareQueue->add($layer);

        // El middleware agregado será el primero de la cola.
        $middlewareQueue->prepend($layer);

        // Inserta el middleware en un lugar especifico. Si el lugar no existe,
        // será agregado al final
        $middlewareQueue->insertAt(2, $layer);

        // Inserta el middleware antes de otro.
        // Si el middleware especificado no existe,
        // se lanzará una excepción
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Inserta después que otro middleware
        // Si el middleware especificado no existe,
        // el middleware will added to the end.
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );


Si tu middleware solo es aplicable a un subconjunto de rutas o controladores especificos puedes usar
:ref:`Middleware por Rutas <route-scoped-middleware>`, o :ref:`Middleware por Controlador <controller-middleware>`.

Agregando Middleware desde un Plugin
-------------------------------------

Los Plugins pueden usar su propio método ``middleware`` para agregar cualquier middleware que
implementen a la cola de middlewares de la aplicación::

    // en plugins/ContactManager/src/Plugin.php
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;

    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            $middlewareQueue->add(new ContactManagerContextMiddleware());

            return $middlewareQueue;
        }
    }

Creaando un Middleware
======================

Un Middleware puede ser implementado mediante funciones anónimas (Closures), o clases que extiendan
a ``Psr\Http\Server\MiddlewareInterface``. Mientras que los Closures son apropiados para
tareas pequeñas, las pruebas se vuelven complicadas y puedes complicar aún más la clase
``Application``. Las clases middleware en CakePHP tienen algunasconvenciones:

* Los archivos deben ubicarse en **src/Middleware**. Por ejemplo:
  **src/Middleware/CorsMiddleware.php**
* Deben tener ``Middleware`` como sufijo. Por ejemplo:
  ``LinkMiddleware``.
* Deben implementar la interfaz ``Psr\Http\Server\MiddlewareInterface``.

Un Middleware puede devolver la respuesta llamando a ``$handler->handle()`` o
creando su propia respuesta. Podemos ver ambas opciones en el siguiente ejemplo::

    // En src/Middleware/TrackingCookieMiddleware.php
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
            // Llamando $handler->handle() delega el control al siguiente middleware
            // en la cola de tu aplicación.
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

Ahora que hemos hecho un middleware bastante simple, agreguémoslo a nuestra aplicación::

    // En src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Agrega tu middleware a la cola
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // Agrega más middlewares a la cola si lo deseas

            return $middlewareQueue;
        }
    }


.. _routing-middleware:

Middleware Routing
==================

El middleware de enrutamiento es responsable de procesar las rutas de tu aplicación e
identificar el plugin, controlador, y acción hacia la cual va un request::

    // En Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this));
    }

.. _encrypted-cookie-middleware:

Middleware EncryptedCookie
===========================

Si tu aplicación tiene cookies que contienen información que
quieres ofuscar y proteger, puedes usar el middleware de Cookies encriptadas
de CakePHP para encriptar y desencriptar de manera transparente la información
vía middleware. La información del Cookie es encriptada vía OpenSSL using AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Names of cookies to protect
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlewareQueue->add($cookies);

.. note::
    Se recomienda que la clave de encriptación que se utiliza para la información
    del Cookie sea **exclusivamente** para esto.

Los algoritmos de encriptación y el estilo de relleno usado por el middleware son retrocompatibles
con el ``CookieComponent`` de versiones anteriores de CakePHP.

.. _body-parser-middleware:

Middleware BodyParser
======================

Si tu aplicación acepta JSON, XML o algún `request` de este tipo, el
``BodyParserMiddleware`` te permitirá decodificar esos `requests` en un arreglo que
estará disponible via ``$request->getParsedData()`` y ``$request->getData()``. Por defecto sólo
``json`` será procesado, pero el procesamiento XML puede ser activado como opción.
También puedes definir tus propios procesadores::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // solo JSON será procesado
    $bodies = new BodyParserMiddleware();

    // Activar procesamiento XML
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Desactivar procesamiento JSON
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Agregar tu propio procesador aplicándolo a un content-type
    // específico y asignandole una funcion de procesamiento
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use a CSV parsing library.
        return Csv::parse($body);
    });

.. meta::
    :title lang=es: Http Middleware
    :keywords lang=es: http, middleware, psr-7, request, response, wsgi, application, baseapplication



