Protección CSRF
###############

Las Solicitudes CSRF son una clase de ataque donde se realizan comandos no autorizados en nombre de un usuario autenticado sin su conocimiento o consentimiento.

CakePHP ofrece dos formas de protección CSRF:

* ``SessionCsrfProtectionMiddleware`` almacena tokens CSRF en la sesión. Esto requiere que tu aplicación abra la sesión en cada solicitud. Los beneficios de los tokens CSRF basados en sesiones son que están vinculados a un usuario específico y sólo son válidos durante la duración de una sesión activa.
* ``CsrfProtectionMiddleware`` almacena tokens CSRF en una cookie. Usar una cookie permite realizar verificaciones CSRF sin ningún estado en el servidor. Los valores de las cookies se verifican en términos de autenticidad mediante una comprobación HMAC. Sin embargo, debido a su naturaleza sin estado, los tokens CSRF se pueden reutilizar entre usuarios y sesiones.

.. nota::

    No puedes usar ambos enfoques a la vez, debes elegir sólo uno. Si usas ambos, ocurrirá un error de incompatibilidad de tokens CSRF en cada solicitud `PUT` y `POST`.

.. _csrf-middleware:

Middleware CSRF
===============

La protección CSRF se puede aplicar a toda tu aplicación o a ámbitos de enrutamiento específicos. Al aplicar un middleware CSRF a tu cola de middlewares, proteges todas las acciones en la aplicación::

    // En src/Application.php
    // Para tokens CSRF basados en cookies.
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    // Para tokens CSRF basados en sesiones.
    use Cake\Http\Middleware\SessionCsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $opciones = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($opciones);
        // o
        $csrf = new SessionCsrfProtectionMiddleware($opciones);

        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

Al aplicar la protección CSRF a los ámbitos de enrutamiento, puedes aplicar condicionalmente CSRF a grupos específicos de rutas::

    // en src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes(RouteBuilder $routes) : void
    {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // en config/routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });

Opciones del middleware CSRF basado en cookies
-----------------------------------------------

Las opciones de configuración disponibles son:

- ``cookieName``: El nombre de la cookie que se enviará. Por defecto es ``csrfToken``.
- ``expiry``: Cuánto tiempo debe durar el token CSRF. Por defecto es por la sesión del navegador.
- ``secure``: Si la cookie se establecerá o no con la bandera Secure. Es decir, la cookie sólo se establecerá en una conexión HTTPS y cualquier intento sobre HTTP normal fallará. Por defecto es ``false``.
- ``httponly``: Si la cookie se establecerá o no con la bandera HttpOnly. Por defecto es ``false``. Antes de la versión 4.1.0, usa la opción ``httpOnly``.
- ``samesite``: Te permite declarar si tu cookie debe estar restringida a un contexto de primer partido o mismo sitio. Los valores posibles son ``Lax``, ``Strict`` y ``None``. Por defecto es ``null``.
- ``field``: El campo del formulario a comprobar. Por defecto es ``_csrfToken``. Cambiar esto también requerirá configurar FormHelper.

Opciones del middleware CSRF basado en sesiones
-----------------------------------------------

Las opciones de configuración disponibles son:

- ``key``: La clave de sesión a utilizar. Por defecto es `csrfToken`.
- ``field``: El campo del formulario a comprobar. Cambiar esto también requerirá configurar FormHelper.

Cuando está habilitado, puedes acceder al token CSRF actual en el objeto de Request::

    $token = $this->request->getAttribute('csrfToken');

Si necesitas rotar o reemplazar el token CSRF de la sesión, puedes hacerlo con::

    $this->request = SessionCsrfProtectionMiddleware::replaceToken($this->request);

.. versionadded:: 4.3.0
    Se añadió el método ``replaceToken``.

Omitir comprobaciones CSRF para acciones específicas
-----------------------------------------------------

Ambas implementaciones de middleware CSRF te permiten usar la función ``skip check`` para un control más preciso sobre las URL para las cuales se debe hacer la comprobación de tokens CSRF::

    // en src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $csrf = new CsrfProtectionMiddleware();

        // La comprobación del token se omitirá cuando el callback devuelva `true`.
        $csrf->skipCheckCallback(function ($request) {
            // Omitir la comprobación del token para las URL de la API.
            if ($request->getParam('prefix') === 'Api') {
                return true;
            }
        });

        // Asegúrate de que el middleware de enrutamiento se añada a la cola antes del middleware de protección CSRF.
        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

.. nota::

    Debes aplicar el middleware de protección CSRF solo para rutas que manejen
    solicitudes con estado que utilicen cookies/sesiones. Por ejemplo, al desarrollar una
    API, las solicitudes sin estado que no usan cookies para la autenticación no se ven
    afectadas por CSRF, por lo que el middleware no necesita aplicarse para esas rutas.

Integración con FormHelper
--------------------------

El ``CsrfProtectionMiddleware`` se integra perfectamente con ``FormHelper``. Cada vez
que creas un formulario con ``FormHelper``, se insertará un campo oculto que contiene
el token CSRF.

.. nota::

    Cuando uses protección CSRF, siempre debes empezar tus formularios con
    ``FormHelper``. Si no lo haces, deberás crear manualmente los campos ocultos en
    cada uno de tus formularios.

Protección CSRF y Solicitudes AJAX
-----------------------------------

Además de los parámetros de datos de la solicitud, los tokens CSRF se pueden enviar a través
de un encabezado especial ``X-CSRF-Token``. Usar un encabezado a menudo facilita la
integración de un token CSRF con aplicaciones JavaScript, o `endpoints` de API
basados en XML/JSON.

El Token CSRF se puede obtener en JavaScript a través de la Cookie ``csrfToken``, o en PHP
a través del atributo del objeto de Request llamado ``csrfToken``. Usar la cookie puede ser más fácil
cuando tu código JavaScript reside en archivos separados de las plantillas de vista de CakePHP,
y cuando ya tienes funcionalidad para analizar cookies mediante JavaScript.

Si tienes archivos JavaScript separados, pero no quieres ocuparte de manejar cookies;
podrías, por ejemplo, configurar el token en una variable global de JavaScript en tu diseño, mediante
la definición de un bloque de script como este::

    echo $this->Html->scriptBlock(sprintf(
        'var csrfToken = %s;',
        json_encode($this->request->getAttribute('csrfToken'))
    ));

Luego puedes acceder al token como ``csrfToken`` o ``window.csrfToken`` en cualquier archivo de script
que se cargue después de este bloque de script.

Otra alternativa sería poner el token en una metaetiqueta personalizada como esta::

    echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));

Que luego se podría acceder en tus scripts buscando el elemento ``meta`` con
el nombre ``csrfToken``, que podría ser tan simple como esto cuando se usa jQuery::

    var csrfToken = $('meta[name="csrfToken"]').attr('content');

.. meta::
    :title lang=es: Protección CSRF
    :keywords lang=es: seguridad, csrf, falsificación de solicitudes entre sitios, middleware, sesión
