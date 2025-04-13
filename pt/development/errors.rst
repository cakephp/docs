Erros & Exceções
##########################

Os aplicativos CakePHP vêm com a configuração de tratamento de erros e exceções para você. Os erros do PHP
são capturados e exibidos ou registrados. Exceções não capturadas são renderizadas em páginas de erro automaticamente.

.. _error-configuration:

Configurações de Erro & Exceções
================================

A configuração do erro é feita no arquivo **config/app.php** do seu aplicativo. Por padrão, o CakePHP usa
``Cake\Error\ErrorHandler`` para lidar com erros e exceções do PHP por padrão. A configuração de erro permite
personalizar o tratamento de erros para o seu aplicativo. As seguintes opções são suportadas:

* ``errorLevel`` - int - O nível de erros que você está interessado em capturar. Use as constantes de erro embutidas no PHP e máscaras de bits para selecionar o nível de erro no qual você precisa. Você pode configurá-lo como ``E_ALL ^ E_USER_DEPRECATED`` para desativar os avisos de depreciação.
* ``trace`` - bool - Inclua rastreamentos de pilha para erros nos arquivos de log. Rastreamentos de pilha serão incluídos no log após cada erro. Isso é útil para descobrir onde/quando os erros estão sendo gerados
* ``exceptionRenderer`` - string - A classe responsável por renderizar exceções não capturadas. Se você escolher uma classe personalizada, coloque o arquivo dessa classe em **src/Error**. Esta classe precisa implementar o método ``render()``.
* ``log`` - bool - Quando ``true``, as exceções + seus rastreamentos de pilha serão registrados em :php:class:`Cake\\Log\\Log`
* ``skipLog`` - array - Uma matriz de nomes de classes de exceção que não devem ser registrados. Isso é útil para remover NotFoundExceptions ou outras mensagens de log comuns, mas desinteressantes.
* ``extraFatalErrorMemory`` - int - Defina como o número de megabytes para aumentar o limite de memória quando um erro fatal for encontrado. Isso permite que o espaço sobrando complete o registro ou o tratamento de erros.


Por padrão, os erros do PHP são exibidos quando ``debug`` é ``true`` e registrados quando o
debug é ``false``. O manipulador de erro fatal será chamado independente da configuração do
nível ``debug`` ou ``errorLevel``, mas o resultado será diferente com base no nível de ``debug``.
O comportamento padrão para erros fatais é mostrar uma página para o erro interno do servidor
(``debug`` desativado) ou uma página com a mensagem, arquivo e linha (``debug`` ativada).

.. note::

    Se você usar um manipulador de erros personalizado, as opções suportadas dependerão do seu manipulador.

.. php:class:: ExceptionRenderer(Exception $exception)

Alterando o tratamento de exceções
==================================

O tratamento de exceções oferece várias maneiras de personalizar como as exceções são tratadas. Cada
abordagem fornece diferentes quantidades de controle sobre o processo de tratamento de exceções.

#. *Customize o template de error* Isso permite alterar os modelos de exibição renderizados como faria com qualquer outro modelo em seu aplicativo.
#. *Customize o ErrorController* Isso permite que você controle como as páginas de exceção são renderizadas.
#. *Customize o ExceptionRenderer* Isso permite que você controle como as páginas de exceção e o log são executados.
#. *Crie e registre seu próprio manipulador de erros* Isso fornece controle total sobre como os erros e exceções são tratados, registrados e renderizados.

.. _error-views:

Customizando Templates de Erro
==============================

O manipulador de erros padrão renderiza todas as exceções não capturadas que seu aplicativo gera com a
ajuda de ``Cake\Error\ExceptionRenderer`` e o ``ErrorController`` do seu aplicativo.

As visualizações da página de erro estão localizadas em **templates/Error/**. Por padrão,
todos os erros 4xx usam o modelo **error400.php** e todos os erros 5xx usam o **error500.php**.
Seus modelos de erro terão as seguintes variáveis disponíveis:

* ``message`` A mensagem da exceção.
* ``code`` O código da exceção.
* ``url`` A URL requisitada.
* ``error`` O objeto da exceção.

No modo de depuração, se o erro estender ``Cake\Core\Exception\Exception``, os dados retornados
por ``getAttributes()`` serão expostos como variáveis de exibição também.

.. note::

    Você precisará definir ``debug`` para false, para ver seus modelos **error404** e **error500**.
    No modo de depuração, você verá a página de erro de desenvolvimento do CakePHP.

Personalizar o layout da página de erro
---------------------------------------

By default error templates use **templates/layout/error.php** for a layout.
You can use the ``layout`` property to pick a different layout::

    // inside templates/Error/error400.php
    $this->layout = 'my_error';

The above would use  **templates/layout/my_error.php** as the layout for your
error pages.

Many exceptions raised by CakePHP will render specific view templates in debug
mode. With debug turned off all exceptions raised by CakePHP will use either
**error400.php** or **error500.php** based on their status code.

Customize the ErrorController
=============================

The ``App\Controller\ErrorController`` class is used by CakePHP's exception
rendering to render the error page view and receives all the standard request
life-cycle events. By modifying this class you can control which components are
used and which templates are rendered.

If your application uses `routing-prefixes` you can create custom error
controllers for each routing prefix. For example, if you had an ``admin``
prefix. You could create the following class::

    namespace App\Controller\Admin;

    use App\Controller\AppController;

    class ErrorController extends AppController
    {
        /**
         * Initialization hook method.
         *
         * @return void
         */
        public function initialize()
        {
            $this->loadComponent('RequestHandler');
        }

        /**
         * beforeRender callback.
         *
         * @param \Cake\Event\Event $event Event.
         * @return void
         */
        public function beforeRender(Event $event)
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

This controller would only be used when an error is encountered in a prefixed
controller, and allows you to define prefix specific logic/templates as needed.

Change the ExceptionRenderer
============================

If you want to control the entire exception rendering and logging process you
can use the ``Error.exceptionRenderer`` option in **config/app.php** to choose
a class that will render exception pages. Changing the ExceptionRenderer is
useful when you want to provide custom error pages for application specific
exception classes.

Your custom exception renderer class should be placed in **src/Error**. Let's
assume our application uses ``App\Exception\MissingWidgetException`` to indicate
a missing widget. We could create an exception renderer that renders specific
error pages when this error is handled::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->response;

            return $response->withStringBody('Oops that widget is missing.');
        }
    }

    // In config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

The above would handle our ``MissingWidgetException``,
and allow us to provide custom display/handling logic for those application
exceptions.

Exception rendering methods receive the handled exception as an argument, and
should return a ``Response`` object. You can also implement methods to add
additional logic when handling CakePHP errors::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function notFound($error)
        {
            // Do something with NotFoundException objects.
        }
    }

Changing the ErrorController Class
----------------------------------

The exception renderer dictates which controller is used for exception
rendering. If you want to change which controller is used to render exceptions,
override the ``_getController()`` method in your exception renderer::

    // in src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController()
        {
            return new SuperCustomErrorController();
        }
    }

    // in config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...


Creating your Own Error Handler
===============================

By replacing the error handler you can customize the entire error & exception
handling process. By extending ``Cake\Error\BaseErrorHandler`` you can customize
display logic more simply. As an example, we could build a class called
``AppError`` to handle our errors::

    // In config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        public function _displayError($error, $debug)
        {
            echo 'There has been an error!';
        }

        public function _displayException($exception)
        {
            echo 'There has been an exception!';
        }
    }

The ``BaseErrorHandler`` defines two abstract methods. ``_displayError()`` is
used when errors are triggered. The ``_displayException()`` method is called
when there is an uncaught exception.

Changing Fatal Error Behavior
-----------------------------

Error handlers convert fatal errors into exceptions and re-use the
exception handling logic to render an error page. If you do not want to show the
standard error page, you can override it::

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Other methods.

        public function handleFatalError($code, $description, $file, $line)
        {
            echo 'A fatal error has happened';
        }
    }

.. index:: application exceptions

Creating your own Application Exceptions
========================================

You can create your own application exceptions using any of the built in `SPL
exceptions <https://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
itself, or :php:exc:`Cake\\Core\\Exception\\Exception`.
If your application contained the following exception::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
    }

You could provide nice development errors, by creating
**templates/Error/missing_widget.php**. When in production mode, the above
error would be treated as a 500 error and use the **error500** template.

If your exceptions have a code between ``400`` and ``506`` the exception code
will be used as the HTTP response code.

The constructor for :php:exc:`Cake\\Core\\Exception\\Exception` allows you to
pass in additional data. This additional data is interpolated into the the
``_messageTemplate``. This allows you to create data rich exceptions, that
provide more context around your errors::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        // Context data is interpolated into this format string.
        protected $_messageTemplate = 'Seems that %s is missing.';

        // You can set a default exception code as well.
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

When rendered, this your view template would have a ``$widget`` variable set. If
you cast the exception as a string or use its ``getMessage()`` method you will
get ``Seems that Pointy is missing.``.

Logging Exceptions
------------------

Using the built-in exception handling, you can log all the exceptions that are
dealt with by ErrorHandler by setting the ``log`` option to ``true`` in your
**config/app.php**. Enabling this will log every exception to
:php:class:`Cake\\Log\\Log` and the configured loggers.

.. note::

    If you are using a custom exception handler this setting will have
    no effect. Unless you reference it inside your implementation.


.. php:namespace:: Cake\Http\Exception

.. _built-in-exceptions:

Built in Exceptions for CakePHP
===============================

HTTP Exceptions
---------------

There are several built-in exceptions inside CakePHP, outside of the
internal framework exceptions, there are several
exceptions for HTTP methods

.. php:exception:: BadRequestException

    Used for doing 400 Bad Request error.

.. php:exception:: UnauthorizedException

    Used for doing a 401 Unauthorized error.

.. php:exception:: ForbiddenException

    Used for doing a 403 Forbidden error.

.. php:exception:: InvalidCsrfTokenException

    Used for doing a 403 error caused by an invalid CSRF token.

.. php:exception:: NotFoundException

    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    Used for doing a 405 Method Not Allowed error.

.. php:exception:: NotAcceptableException

    Used for doing a 406 Not Acceptable error.

.. php:exception:: ConflictException

    Used for doing a 409 Conflict error.

.. php:exception:: GoneException

    Used for doing a 410 Gone error.

For more details on HTTP 4xx error status codes see :rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException

    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    Used for doing a 501 Not Implemented Errors.

.. php:exception:: ServiceUnavailableException

    Used for doing a 503 Service Unavailable error.

For more details on HTTP 5xx error status codes see :rfc:`2616#section-10.5`.

You can throw these exceptions from your controllers to indicate failure states,
or HTTP errors. An example use of the HTTP exceptions could be rendering 404
pages for items that have not been found::

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

By using exceptions for HTTP errors, you can keep your code both clean, and give
RESTful responses to client applications and users.

Using HTTP Exceptions in your Controllers
-----------------------------------------

You can throw any of the HTTP related exceptions from your controller actions
to indicate failure states. For example::

    use Cake\Network\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', 'article');
        $this->set('_serialize', ['article']);
    }

The above would cause the configured exception handler to catch and
process the :php:exc:`NotFoundException`. By default this will create an error
page, and log the exception.

Other Built In Exceptions
-------------------------

In addition, CakePHP uses the following exceptions:

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException

    The chosen view class could not be found.

.. php:exception:: MissingTemplateException

    The chosen template file could not be found.

.. php:exception:: MissingLayoutException

    The chosen layout could not be found.

.. php:exception:: MissingHelperException

    The chosen helper could not be found.

.. php:exception:: MissingElementException

    The chosen element file could not be found.

.. php:exception:: MissingCellException

    The chosen cell class could not be found.

.. php:exception:: MissingCellViewException

    The chosen cell view file could not be found.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    A configured component could not be found.

.. php:exception:: MissingActionException

    The requested controller action could not be found.

.. php:exception:: PrivateActionException

    Accessing private/protected/_ prefixed actions.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    A console library class encounter an error.

.. php:exception:: MissingTaskException

    A configured task could not found.

.. php:exception:: MissingShellException

    The shell class could not be found.

.. php:exception:: MissingShellMethodException

    The chosen shell class has no method of that name.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException

    A model's connection is missing.

.. php:exception:: MissingDriverException

    A database driver could not be found.

.. php:exception:: MissingExtensionException

    A PHP extension is missing for the database driver.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    A model's table could not be found.

.. php:exception:: MissingEntityException

    A model's entity could not be found.

.. php:exception:: MissingBehaviorException

    A model's behavior could not be found.

.. php:exception:: PersistenceFailedException

    An entity couldn't be saved/deleted while using :php:meth:`Cake\\ORM\\Table::saveOrFail()` or
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()`.

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

   The requested record could not be found. This will also set HTTP response
   headers to 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    The requested controller could not be found.

.. php:exception:: MissingRouteException

    The requested URL cannot be reverse routed or cannot be parsed.

.. php:exception:: MissingDispatcherFilterException

    The dispatcher filter could not be found.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    Base exception class in CakePHP. All framework layer exceptions thrown by
    CakePHP will extend this class.

These exception classes all extend :php:exc:`Exception`.
By extending Exception, you can create your own 'framework' errors.

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."

.. meta::
    :title lang=en: Error & Exception Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
