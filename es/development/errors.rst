Manejo de Errores y Excepciones
################################

Las aplicaciones de CakePHP vienen con la configuración predeterminada de manejo de errores y excepciones.
Los errores de PHP son capturados y mostrados o registrados. Las excepciones no capturadas se representan
automáticamente en páginas de error.

.. _error-configuration:

Configuración
=============

La configuración de errores se realiza en el archivo **config/app.php** de tu aplicación. Por defecto, CakePHP
utiliza ``Cake\Error\ErrorTrap`` y ``Cake\Error\ExceptionTrap`` para manejar tanto errores de PHP como excepciones,
respectivamente. La configuración de errores te permite personalizar el manejo de errores para tu aplicación.
Las siguientes opciones son compatibles:

* ``errorLevel`` - int - El nivel de errores que te interesa capturar. Usa las constantes de error de PHP integradas
  y las máscaras de bits para seleccionar el nivel de error que te interesa. Consulta :ref:`deprecation-warnings`
  para deshabilitar advertencias de obsolescencia.
* ``trace`` - bool - Incluir trazas para errores en los archivos de registro. Las trazas se incluirán en el
  registro después de cada error. Esto es útil para encontrar dónde/cuándo se están generando los errores.
* ``exceptionRenderer`` - string - La clase responsable de representar excepciones no capturadas. Si eliges
  una clase personalizada, debes colocar el archivo para esa clase en **src/Error**. Esta clase debe implementar
  un método ``render()``.
* ``log`` - bool - Cuando es ``true``, las excepciones y sus trazas se registrarán en :php:class:`Cake\\Log\\Log`.
* ``skipLog`` - array - Un array de nombres de clases de excepción que no deben ser registrados. Esto es útil para
  eliminar mensajes de registro comunes pero poco interesantes, como NotFoundExceptions.
* ``extraFatalErrorMemory`` - int - Establece el número de megabytes para aumentar el límite de memoria cuando
  se encuentra un error fatal. Esto permite espacio para completar el registro o el manejo de errores.
* ``logger`` (antes de la versión 4.4.0, usa ``errorLogger``) - ``Cake\Error\ErrorLoggerInterface`` - La clase
  responsable de registrar errores y excepciones no controladas. Por defecto, es ``Cake\Error\ErrorLogger``.
* ``errorRenderer`` - ``Cake\Error\ErrorRendererInterface`` - La clase responsable de representar errores. Se
  elige automáticamente en función del SAPI de PHP.
* ``ignoredDeprecationPaths`` - array - Una lista de rutas compatibles con la sintaxis Glob que deben ignorar errores de
  obsolescencia. Añadido en la versión 4.2.0

Por defecto, los errores de PHP se muestran cuando ``debug`` es ``true``, y se registran cuando debug es ``false``.
El manejador de errores fatal se llamará independientemente del nivel de ``debug`` o la configuración de ``errorLevel``,
pero el resultado será diferente según el nivel de ``debug``. El comportamiento predeterminado para errores fatales es
mostrar una página de error interno del servidor (``debug`` deshabilitado) o una página con el mensaje, archivo y línea (``debug`` habilitado).

.. note::

    Si utilizas un manejador de errores personalizado, las opciones compatibles dependerán de tu manejador.

.. _deprecation-warnings:

Advertencias de Obsolescencia
==============================

CakePHP utiliza advertencias de obsolescencia para indicar cuándo se ha marcado como obsoleta alguna característica. También
recomendamos este sistema para su uso en tus plugins y código de aplicación cuando sea útil. Puedes activar advertencias de
obsolescencia con ``deprecationWarning()``::

    deprecationWarning('5.0', 'El método example() está obsoleto. Usa getExample() en su lugar.');

Al actualizar CakePHP o plugins, es posible que te encuentres con nuevas advertencias de obsolescencia. Puedes desactivar
temporalmente las advertencias de obsolescencia de varias formas:

#. Usar la configuración ``Error.errorLevel`` con ``E_ALL ^ E_USER_DEPRECATED`` para ignorar *todas* las advertencias de
   obsolescencia.
#. Usar la opción de configuración ``Error.ignoredDeprecationPaths`` para ignorar advertencias con expresiones compatibles
   con la sintaxis Glob. Por ejemplo::

        'Error' => [
            'ignoredDeprecationPaths' => [
                'vendors/company/contacts/*',
                'src/Models/*',
            ],
        ],

   Ignoraría todas las advertencias de obsolescencia de tu directorio ``Models`` y el plugin ``Contacts`` en tu aplicación.

Cambiar el Manejo de Excepciones
=================================

El manejo de excepciones en CakePHP ofrece varias formas de personalizar cómo se manejan las excepciones. Cada enfoque te brinda
diferentes niveles de control sobre el proceso de manejo de excepciones.

#. *Escucha eventos* Esto te permite recibir notificaciones a través de eventos de CakePHP cuando se han manejado errores y excepciones.
#. *Plantillas personalizadas* Esto te permite cambiar las plantillas de vista renderizadas como lo harías con cualquier otra
   plantilla en tu aplicación.
#. *Controlador personalizado* Esto te permite controlar cómo se renderizan las páginas de excepción.
#. *ExceptionRenderer personalizado* Esto te permite controlar cómo se realizan las páginas de excepción y el registro.
#. *Crea y registra tus propios manejadores* Esto te brinda control total sobre cómo se manejan, registran y representan los errores y
   excepciones. Utiliza ``Cake\Error\ExceptionTrap`` y ``Cake\Error\ErrorTrap`` como referencia cuando implementes tus manejadores.

Escuchar Eventos
================

Los manejadores ``ErrorTrap`` y ``ExceptionTrap`` activarán eventos de CakePHP cuando manejan errores. Puedes escuchar el evento ``Error.beforeRender`` para ser notificado de los errores de PHP. El evento ``Exception.beforeRender`` se desencadena cuando se maneja una excepción::

    $errorTrap = new ErrorTrap(Configure::read('Error'));
    $errorTrap->getEventManager()->on(
        'Error.beforeRender',
        function (EventInterface $event, PhpError $error) {
            // haz lo que necesites
        }
    );

Dentro de un manejador ``Error.beforeRender``, tienes algunas opciones:

* Detener el evento para evitar la representación.
* Devolver una cadena para omitir la representación y usar la cadena proporcionada en su lugar.

Dentro de un manejador ``Exception.beforeRender``, también tienes algunas opciones:

* Detener el evento para evitar la representación.
* Establecer el atributo de datos ``exception`` con ``setData('exception', $err)``
  para reemplazar la excepción que se está representando.
* Devolver una respuesta desde el evento para omitir la representación y usar
  la respuesta proporcionada en su lugar.

.. _error-views:

Plantillas Personalizadas
==========================

El atrapador de excepciones predeterminado representa todas las excepciones no capturadas que tu aplicación genera con la ayuda de ``Cake\Error\WebExceptionRenderer`` y tu ``ErrorController`` de la aplicación.

Las vistas de página de error están ubicadas en **templates/Error/**. Todos los errores 4xx usan la plantilla **error400.php**, y los errores 5xx usan la plantilla **error500.php**. Tus plantillas de error tendrán las siguientes variables disponibles:

* ``message`` El mensaje de la excepción.
* ``code`` El código de la excepción.
* ``url`` La URL de la solicitud.
* ``error`` El objeto de la excepción.

En modo de depuración, si tu error se extiende de ``Cake\Core\Exception\CakeException``, los datos devueltos por ``getAttributes()`` se expondrán también como variables de vista.

.. note::
    Necesitarás establecer ``debug`` en falso para ver tus plantillas **error404** y **error500**. En modo de depuración, verás la página de error de desarrollo de CakePHP.

Diseño Personalizado para la Página de Error
--------------------------------------------

Por defecto, las plantillas de error usan **templates/layout/error.php** para un diseño. Puedes usar la propiedad ``layout`` para elegir un diseño diferente::

    // dentro de templates/Error/error400.php
    $this->layout = 'mi_error';

Lo anterior usaría **templates/layout/mi_error.php** como el diseño para tus páginas de error.

Muchas excepciones generadas por CakePHP representarán plantillas de vista específicas en modo de depuración. Con la depuración desactivada, todas las excepciones generadas por CakePHP usarán **error400.php** o **error500.php** según su código de estado.

Controlador Personalizado
=========================

La clase ``App\Controller\ErrorController`` se utiliza para la representación de excepciones de CakePHP para renderizar la vista de la página de error y recibe todos los eventos estándar del ciclo de vida de la solicitud. Al modificar esta clase, puedes controlar qué componentes se utilizan y qué plantillas se representan.

Si tu aplicación utiliza :ref:`rutas con prefijo <prefix-routing>`, puedes crear controladores de error personalizados para cada prefijo de enrutamiento. Por ejemplo, si tienes un prefijo ``Admin``, podrías crear la siguiente clase::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        /**
         * Callback beforeRender.
         *
         * @param \Cake\Event\EventInterface $event Evento.
         * @return void
         */
        public function beforeRender(EventInterface $event)
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

Este controlador solo se utilizaría cuando se encuentra un error en un controlador con prefijo y te permite definir lógica/plantillas específicas del prefijo según sea necesario.

.. _custom-exceptionrenderer:

ExceptionRenderer Personalizado
================================

Si deseas controlar todo el proceso de representación y registro de excepciones, puedes utilizar la opción ``Error.exceptionRenderer`` en **config/app.php** para elegir una clase que representará las páginas de excepciones. Cambiar el ExceptionRenderer es útil cuando quieres cambiar la lógica utilizada para crear un controlador de error, elegir la plantilla o controlar el proceso general de representación.

Tu clase personalizada de ExceptionRenderer debe colocarse en **src/Error**. Supongamos que nuestra aplicación usa ``App\Exception\MissingWidgetException`` para indicar un widget faltante. Podríamos crear un ExceptionRenderer que represente páginas de error específicas cuando se maneja este error::

    // En src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->getResponse();

            return $response->withStringBody('Oops, ese widget está perdido.');
        }
    }

    // En config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

Lo anterior manejaría nuestro ``MissingWidgetException``,
y nos permitiría proporcionar lógica de visualización/manejo personalizado para esas excepciones de aplicación.

Los métodos de representación de excepciones reciben la excepción manejada como argumento y deben devolver un objeto ``Response``. También puedes implementar métodos para agregar lógica adicional al manejar errores de CakePHP::

    // En src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
    {
        public function notFound($error)
        {
            // Haz algo con objetos NotFoundException.
        }
    }

Cambiar la Clase ErrorController
----------------------------------

El ExceptionRenderer dicta qué controlador se utiliza para la representación de excepciones. Si quieres cambiar qué controlador se utiliza para representar excepciones, puedes anular el método ``_getController()`` en tu ExceptionRenderer::

    // en src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Controller\Controller;
    use Cake\Error\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
    {
        protected function _getController(): Controller
        {
            return new SuperCustomErrorController();
        }
    }

    // en config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],


 // ...

.. index:: excepciones de aplicación

Crear tus Propias Excepciones de Aplicación
============================================

Puedes crear tus propias excepciones de aplicación utilizando cualquiera de las `excepciones SPL incorporadas <https://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
en sí, o :php:exc:`Cake\\Core\\Exception\\Exception`.
Si tu aplicación contiene la siguiente excepción::

    use Cake\Core\Exception\CakeException;

    class MissingWidgetException extends CakeException
    {
    }

Podrías proporcionar errores de desarrollo detallados, creando
**templates/Error/missing_widget.php**. Cuando estás en modo de producción, el error anterior se trataría como un error 500 y usaría la plantilla **error500**.

Las excepciones que son subclases de ``Cake\Http\Exception\HttpException``, usarán su código de error como código de estado HTTP si el código de error está entre ``400`` y ``506``.

El constructor para :php:exc:`Cake\\Core\\Exception\\CakeException` te permite pasar datos adicionales. Estos datos adicionales se interpolan en el ``_messageTemplate``. Esto te permite crear excepciones ricas en datos que proporcionen más contexto sobre tus errores::

    use Cake\Core\Exception\CakeException;

    class MissingWidgetException extends CakeException
    {
        // Los datos del contexto se interpolan en esta cadena de formato.
        protected $_messageTemplate = 'Parece que falta %s.';

        // También puedes establecer un código de excepción predeterminado.
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Puntiagudo']);

Cuando se representa, tu plantilla de vista tendría una variable ``$widget`` establecida. Si lanzas la excepción como una cadena o usas su método ``getMessage()``, obtendrás ``Parece que falta Puntiagudo.``.

.. note::

    Antes de CakePHP 4.2.0, usa la clase ``Cake\Core\Exception\Exception`` en lugar de ``Cake\Core\Exception\CakeException``

Registro de Excepciones
------------------------

Usando el manejo de excepciones incorporado, puedes registrar todas las excepciones que son tratadas por ErrorTrap configurando la opción ``log`` en ``true`` en tu **config/app.php**. Al habilitar esto, se registrarán todas las excepciones en :php:class:`Cake\\Log\\Log` y en los registradores configurados.

.. note::

    Si estás utilizando un manejador de excepciones personalizado, esta configuración no tendrá
    ningún efecto, a menos que la referencies dentro de tu implementación.

.. php:namespace:: Cake\Http\Exception

.. _built-in-exceptions:

Excepciones Incorporadas para CakePHP
======================================

Excepciones HTTP
-----------------

Hay varias excepciones incorporadas en CakePHP, además de las excepciones internas del framework, hay varias
excepciones para métodos HTTP.

.. php:exception:: BadRequestException
   :nocontentsentry:

    Usado para el error 400 Bad Request.

.. php:exception:: UnauthorizedException
   :nocontentsentry:

    Usado para el error 401 Unauthorized.

.. php:exception:: ForbiddenException
   :nocontentsentry:

    Usado para el error 403 Forbidden.

.. php:exception:: InvalidCsrfTokenException
   :nocontentsentry:

    Usado para el error 403 causado por un token CSRF inválido.

.. php:exception:: NotFoundException
   :nocontentsentry:

    Usado para el error 404 Not found.

.. php:exception:: MethodNotAllowedException
   :nocontentsentry:

    Usado para el error 405 Method Not Allowed.

.. php:exception:: NotAcceptableException
   :nocontentsentry:

    Usado para el error 406 Not Acceptable.

.. php:exception:: ConflictException
   :nocontentsentry:

    Usado para el error 409 Conflict.

.. php:exception:: GoneException
   :nocontentsentry:

    Usado para el error 410 Gone.

Para más detalles sobre los códigos de estado 4xx del protocolo HTTP, consulta :rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException
   :nocontentsentry:

    Usado para el error 500 Internal Server Error.

.. php:exception:: NotImplementedException
   :nocontentsentry:

    Usado para el error 501 Not Implemented Errors.

.. php:exception:: ServiceUnavailableException
   :nocontentsentry:

    Usado para el error 503 Service Unavailable.

Para más detalles sobre los códigos de estado 5xx del protocolo HTTP, consulta :rfc:`2616#section-10.5`.

Puedes lanzar estas excepciones desde tus controladores para indicar estados de error o errores HTTP. Un ejemplo de uso de las excepciones HTTP podría ser renderizar páginas 404 para los elementos que no se han encontrado::

    use Cake\Http\Exception\NotFoundException;

    public function ver($id = null)
    {
        $articulo = $this->Articulos->findById($id)->first();
        if (empty($articulo)) {
            throw new NotFoundException(__('Artículo no encontrado'));
        }
        $this->set('articulo', $articulo);
        $this->viewBuilder()->setOption('serialize', ['

articulo']);
    }

Usar excepciones para errores HTTP te permite mantener tu código limpio y dar respuestas RESTful a aplicaciones de clientes y usuarios.

Uso de Excepciones HTTP en tus Controladores
--------------------------------------------

Puedes lanzar cualquiera de las excepciones relacionadas con HTTP desde las acciones de tu controlador para indicar estados de error. Por ejemplo::

    use Cake\Network\Exception\NotFoundException;

    public function ver($id = null)
    {
        $articulo = $this->Articulos->findById($id)->first();
        if (empty($articulo)) {
            throw new NotFoundException(__('Artículo no encontrado'));
        }
        $this->set('articulo', 'articulo');
        $this->viewBuilder()->setOption('serialize', ['articulo']);
    }

Lo anterior causaría que el manejador de excepciones configurado capture y
procese la :php:exc:`NotFoundException`. Por defecto, esto creará una página de error
y registrará la excepción.

Otras Excepciones Incorporadas
------------------------------

Además, CakePHP utiliza las siguientes excepciones:

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException
   :nocontentsentry:

    No se pudo encontrar la clase de vista elegida.

.. php:exception:: MissingTemplateException
   :nocontentsentry:

    No se pudo encontrar el archivo de plantilla elegido.

.. php:exception:: MissingLayoutException
   :nocontentsentry:

    No se pudo encontrar el diseño elegido.

.. php:exception:: MissingHelperException
   :nocontentsentry:

    No se pudo encontrar el ayudante elegido.

.. php:exception:: MissingElementException
   :nocontentsentry:

    No se pudo encontrar el archivo de elemento elegido.

.. php:exception:: MissingCellException
   :nocontentsentry:

    No se pudo encontrar la clase de celda elegida.

.. php:exception:: MissingCellViewException
   :nocontentsentry:

    No se pudo encontrar el archivo de vista de celda elegido.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException
   :nocontentsentry:

    No se pudo encontrar el componente configurado.

.. php:exception:: MissingActionException
   :nocontentsentry:

    No se pudo encontrar la acción del controlador solicitada.

.. php:exception:: PrivateActionException
   :nocontentsentry:

    Acceder a acciones con prefijos privados/protegidos/_.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException
   :nocontentsentry:

    Una clase de biblioteca de consola encontró un error.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException
   :nocontentsentry:

    Falta una conexión de modelo.

.. php:exception:: MissingDriverException
   :nocontentsentry:

    No se pudo encontrar un controlador de base de datos.

.. php:exception:: MissingExtensionException
   :nocontentsentry:

    Falta una extensión de PHP para el controlador de base de datos.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException
   :nocontentsentry:

    No se pudo encontrar la tabla de un modelo.

.. php:exception:: MissingEntityException
   :nocontentsentry:

    No se pudo encontrar la entidad de un modelo.

.. php:exception:: MissingBehaviorException
   :nocontentsentry:

    No se pudo encontrar el comportamiento de un modelo.

.. php:exception:: PersistenceFailedException
   :nocontentsentry:

    No se pudo guardar/eliminar una entidad al usar :php:meth:`Cake\\ORM\\Table::saveOrFail()` o
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()`.

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException
   :nocontentsentry:

   No se pudo encontrar el registro solicitado. Esto también establecerá las cabeceras de respuesta HTTP en 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException
   :nocontentsentry:

    No se pudo encontrar el controlador solicitado.

.. php:exception:: MissingRouteException
   :nocontentsentry:

    No se pudo hacer coincidir la URL solicitada o no se pudo analizar.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception
   :nocontentsentry:

    Clase base de excepción en CakePHP. Todas las excepciones de capa de framework lanzadas por
    CakePHP extenderán esta clase.

Estas clases de excepción se extienden de :php:exc:`Exception`.
Al extender Exception, puedes crear tus propios errores de 'framework'.

.. php:method:: responseHeader($header = null, $value = null)
   :nocontentsentry:

    Consulta :php:func:`Cake\\Network\\Request::header()`

Todas las excepciones Http y Cake extienden la clase Exception, que tiene un método
para agregar encabezados a la respuesta. Por ejemplo, al lanzar un 405
MethodNotAllowedException, el rfc2616 dice::

    "La respuesta DEBE incluir un encabezado Allow que contenga una lista de métodos válidos
    para el recurso solicitado."

Manejo Personalizado de Errores de PHP
======================================

Por defecto, los errores de PHP se representan en la consola o en la salida HTML, y también se registran.
Si es necesario, puedes cambiar la lógica de manejo de errores de CakePHP con la tuya propia.

Registro de Errores Personalizado
---------------------------------

Los manejadores de errores utilizan instancias de ``Cake\Error\ErrorLoggingInterface`` para crear
mensajes de registro y registrarlos en el lugar apropiado. Puedes reemplazar el
registrador de errores utilizando el valor de configuración ``Error.errorLogger``. Un ejemplo de registrador de errores::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Cake\Error\PhpError;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Registra errores y excepciones no manejadas en `Cake\Log\Log`
     */
    class ErrorLogger implements ErrorLoggerInterface
    {
        /**
         * @inheritDoc
         */
        public function logError(
            PhpError $error,
            ?ServerRequestInterface $request,
            bool $includeTrace = false
        ): void {
            // Registra errores de PHP
        }

        /**
         * @inheritDoc
         */
        public function logException(
            ?ServerRequestInterface $request,
            bool $includeTrace = false
        ): void {
            // Registra excepciones.
        }
    }

**Renderizado Personalizado de Errores**

CakePHP incluye renderizadores de errores tanto para entornos web como de consola. Sin embargo, si deseas reemplazar la lógica que renderiza los errores, puedes crear una clase personalizada::

    // src/Error/CustomErrorRenderer.php
    namespace App\Error;

    use Cake\Error\ErrorRendererInterface;
    use Cake\Error\PhpError;

    class CustomErrorRenderer implements ErrorRendererInterface
    {
        public function write(string $out): void
        {
            // enviar el error renderizado al flujo de salida apropiado
        }

        public function render(PhpError $error, bool $debug): string
        {
            // Convertir el error en una cadena de salida.
        }
    }

El constructor de tu renderizador recibirá un array con la configuración almacenada en `Error`. Conecta tu renderizador de errores personalizado a CakePHP a través del valor de configuración `Error.errorRenderer`. Al reemplazar el manejo de errores, deberás tener en cuenta tanto los entornos web como los de línea de comandos.

.. meta::
    :title lang=es: Manejo de Errores y Excepciones
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
