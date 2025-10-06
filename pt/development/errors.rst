Tratamento de Erros & Exceções
###############################

Os aplicativos CakePHP vêm com a configuração de tratamento de erros e exceções para você. Os erros do PHP
são capturados e exibidos ou registrados. Exceções não capturadas são renderizadas em páginas de erro automaticamente.

.. _error-configuration:

Configuração
============

A configuração de erro é feita no arquivo **config/app.php** do seu aplicativo. Por padrão, o CakePHP usa
``Cake\Error\ErrorTrap`` e ``Cake\Error\ExceptionTrap`` para lidar com erros e exceções do PHP, respectivamente.
A configuração de erro permite personalizar o tratamento de erros para o seu aplicativo. As seguintes opções são suportadas:

* ``errorLevel`` - int - O nível de erros que você está interessado em capturar. Use as constantes de erro embutidas no PHP e máscaras de bits para selecionar o nível de erro no qual você precisa. Veja :ref:`deprecation-warnings` para desabilitar avisos de depreciação.
* ``trace`` - bool - Inclua rastreamentos de pilha para erros nos arquivos de log. Rastreamentos de pilha serão incluídos no log após cada erro. Isso é útil para descobrir onde/quando os erros estão sendo gerados.
* ``exceptionRenderer`` - string - A classe responsável por renderizar exceções não capturadas. Se você escolher uma classe personalizada, coloque o arquivo dessa classe em **src/Error**. Esta classe precisa implementar o método ``render()``.
* ``log`` - bool - Quando ``true``, as exceções + seus rastreamentos de pilha serão registrados em :php:class:`Cake\\Log\\Log`.
* ``skipLog`` - array - Uma matriz de nomes de classes de exceção que não devem ser registrados. Isso é útil para remover NotFoundExceptions ou outras mensagens de log comuns, mas desinteressantes.
* ``extraFatalErrorMemory`` - int - Defina como o número de megabytes para aumentar o limite de memória quando um erro fatal for encontrado. Isso permite espaço sobrando para completar o registro ou o tratamento de erros.
* ``logger`` (antes da versão 4.4.0 use ``errorLogger``) -
  ``Cake\Error\ErrorLoggerInterface`` - A classe responsável por registrar
  erros e exceções não tratadas. Padrão é ``Cake\Error\ErrorLogger``.
* ``errorRenderer`` - ``Cake\Error\ErrorRendererInterface`` - A classe responsável
  por renderizar erros. O padrão é escolhido com base no PHP SAPI.
* ``ignoredDeprecationPaths`` - array - Uma lista de caminhos compatíveis com glob que
  erros de depreciação devem ser ignorados. Adicionado na versão 4.2.0

Por padrão, os erros do PHP são exibidos quando ``debug`` é ``true`` e registrados quando o
debug é ``false``. O manipulador de erro fatal será chamado independente da configuração do
nível ``debug`` ou ``errorLevel``, mas o resultado será diferente com base no nível de ``debug``.
O comportamento padrão para erros fatais é mostrar uma página de erro interno do servidor
(``debug`` desativado) ou uma página com a mensagem, arquivo e linha (``debug`` ativado).

.. note::

    Se você usar um manipulador de erros personalizado, as opções suportadas dependerão do seu manipulador.


.. _deprecation-warnings:

Avisos de Depreciação
=====================

O CakePHP usa avisos de depreciação para indicar quando recursos foram
descontinuados. Também recomendamos este sistema para uso em seus plugins e
código de aplicativo quando útil. Você pode acionar avisos de depreciação com
``deprecationWarning()``::

    deprecationWarning('5.0', 'O método example() está obsoleto. Use getExample() em vez disso.');

Ao atualizar o CakePHP ou plugins, você pode encontrar novos avisos de depreciação.
Você pode desabilitar temporariamente os avisos de depreciação de algumas maneiras:

#. Usando a configuração ``Error.errorLevel`` como ``E_ALL ^ E_USER_DEPRECATED`` para
   ignorar *todos* os avisos de depreciação.
#. Usando a opção de configuração ``Error.ignoredDeprecationPaths`` para ignorar
   depreciações com expressões compatíveis com glob. Por exemplo::

        'Error' => [
            'ignoredDeprecationPaths' => [
                'vendors/company/contacts/*',
                'src/Models/*',
            ],
        ],

   Isso ignoraria todas as depreciações do seu diretório ``Models`` e do
   plugin ``Contacts`` em sua aplicação.

Alterando o Tratamento de Exceções
===================================

O tratamento de exceções no CakePHP oferece várias maneiras de personalizar como as exceções são tratadas.
Cada abordagem fornece diferentes quantidades de controle sobre o processo de tratamento de exceções.

#. *Escutar eventos* Isso permite que você seja notificado através de eventos do CakePHP quando
   erros e exceções foram tratados.
#. *Templates personalizados* Isso permite alterar os templates de visualização renderizados
   como faria com qualquer outro template em seu aplicativo.
#. *Controller personalizado* Isso permite que você controle como as páginas de exceção
   são renderizadas.
#. *ExceptionRenderer personalizado* Isso permite que você controle como as páginas de exceção
   e o log são executados.
#. *Criar e registrar suas próprias traps* Isso fornece controle total sobre como os erros
   e exceções são tratados, registrados e renderizados. Use ``Cake\Error\ExceptionTrap`` e
   ``Cake\Error\ErrorTrap`` como referência ao implementar suas traps.

Escutar Eventos
===============

Os manipuladores ``ErrorTrap`` e ``ExceptionTrap`` irão acionar eventos do CakePHP
quando tratarem erros. Você pode escutar o evento ``Error.beforeRender`` para ser
notificado de erros PHP. O evento ``Exception.beforeRender`` é despachado quando uma
exceção é tratada::

    $errorTrap = new ErrorTrap(Configure::read('Error'));
    $errorTrap->getEventManager()->on(
        'Error.beforeRender',
        function (EventInterface $event, PhpError $error) {
            // faça sua coisa
        }
    );

Dentro de um manipulador ``Error.beforeRender`` você tem algumas opções:

* Pare o evento para evitar a renderização.
* Retorne uma string para pular a renderização e usar a string fornecida em vez disso.

Dentro de um manipulador ``Exception.beforeRender`` você tem algumas opções:

* Pare o evento para evitar a renderização.
* Defina o atributo de dados ``exception`` com ``setData('exception', $err)``
  para substituir a exceção que está sendo renderizada.
* Retorne uma resposta do ouvinte de evento para pular a renderização e usar
  a resposta fornecida em vez disso.

.. _error-views:

Templates Personalizados
========================

A trap de exceção padrão renderiza todas as exceções não capturadas que seu aplicativo gera com a
ajuda de ``Cake\Error\Renderer\WebExceptionRenderer`` e o ``ErrorController`` do seu aplicativo.

As visualizações da página de erro estão localizadas em **templates/Error/**. Todos os erros 4xx usam
o template **error400.php**, e os erros 5xx usam o **error500.php**. Seus templates de erro terão
as seguintes variáveis disponíveis:

* ``message`` A mensagem da exceção.
* ``code`` O código da exceção.
* ``url`` A URL requisitada.
* ``error`` O objeto da exceção.

No modo de depuração, se seu erro estender ``Cake\Core\Exception\CakeException``, os dados retornados
por ``getAttributes()`` serão expostos como variáveis de visualização também.

.. note::

    Você precisará definir ``debug`` para false, para ver seus modelos **error404** e **error500**.
    No modo de depuração, você verá a página de erro de desenvolvimento do CakePHP.

Personalizar o layout da página de erro
---------------------------------------

Por padrão, os templates de erro usam **templates/layout/error.php** como layout.
Você pode usar a propriedade ``layout`` para escolher um layout diferente::

    // dentro de templates/Error/error400.php
    $this->layout = 'my_error';

O acima usaria **templates/layout/my_error.php** como layout para suas
páginas de erro.

Muitas exceções geradas pelo CakePHP renderizarão templates de visualização específicos no modo de
depuração. Com debug desativado, todas as exceções geradas pelo CakePHP usarão
**error400.php** ou **error500.php** baseado em seu código de status.

Controller Personalizado
=========================

A classe ``App\Controller\ErrorController`` é usada pela renderização de exceção do CakePHP
para renderizar a visualização da página de erro e recebe todos os eventos padrão do
ciclo de vida da requisição. Ao modificar esta classe você pode controlar quais components são
usados e quais templates são renderizados.

Se sua aplicação usa :ref:`prefix-routing` você pode criar controladores de erro
personalizados para cada prefixo de roteamento. Por exemplo, se você tivesse um prefixo ``Admin``,
você poderia criar a seguinte classe::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        /**
         * beforeRender callback.
         *
         * @param \Cake\Event\EventInterface $event Event.
         * @return void
         */
        public function beforeRender(EventInterface $event): void
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

Este controlador só seria usado quando um erro é encontrado em um controlador
prefixado, e permite que você defina lógica/templates específicos do prefixo conforme necessário.

Lógica Específica de Exceção
-----------------------------

Dentro do seu controller você pode definir métodos públicos para lidar com erros personalizados
da aplicação. Por exemplo, uma ``MissingWidgetException`` seria tratada por
um método controller ``missingWidget()``, e o CakePHP usaria
``templates/Error/missing_widget.php`` como template. Por exemplo::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        protected function missingWidget(MissingWidgetException $exception)
        {
            // Você pode preparar contexto adicional de template ou capturar erros.
        }
    }

.. versionadded:: 5.2.0
    Métodos e templates de controller específicos de exceção foram adicionados.

.. _custom-exceptionrenderer:

ExceptionRenderer Personalizado
================================

Se você quiser controlar todo o processo de renderização e registro de exceções, você
pode usar a opção ``Error.exceptionRenderer`` em **config/app.php** para escolher
uma classe que renderizará páginas de exceção. Alterar o ExceptionRenderer é
útil quando você quer alterar a lógica usada para criar um controller de erro,
escolher o template ou controlar o processo de renderização geral.

Sua classe personalizada de renderizador de exceção deve ser colocada em **src/Error**. Vamos
assumir que nossa aplicação usa ``App\Exception\MissingWidgetException`` para indicar
um widget faltando. Poderíamos criar um renderizador de exceção que usa um template
específico quando este erro é manipulado::

    // Em src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\Renderer\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->getResponse();

            return $response->withStringBody('Ops, esse widget está faltando.');
        }
    }

    // Em config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

O acima manipularia nossa ``MissingWidgetException``,
e nos permitiria fornecer lógica personalizada de exibição/manipulação para essas exceções
da aplicação.

Os métodos de renderização de exceção recebem a exceção manipulada como argumento, e
devem retornar um objeto ``Response``. Você também pode implementar métodos para adicionar
lógica adicional ao manipular erros do CakePHP::

    // Em src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function notFound($error)
        {
            // Faça algo com objetos NotFoundException.
        }
    }

Alterando a Classe ErrorController
-----------------------------------

O renderizador de exceção determina qual controlador é usado para renderização de exceção.
Se você quiser alterar qual controlador é usado para renderizar exceções,
sobrescreva o método ``_getController()`` no seu renderizador de exceção::

    // em src/Error/AppExceptionRenderer
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

    // em config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...


Criando seu Próprio Manipulador de Erros
=========================================

Ao substituir o manipulador de erros você pode personalizar todo o processo de manipulação de
erros e exceções. Ao estender ``Cake\Error\BaseErrorHandler`` você pode personalizar
a lógica de exibição de forma mais simples. Como exemplo, poderíamos construir uma classe chamada
``AppError`` para manipular nossos erros::

    // Em config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // Em src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        public function _displayError($error, $debug)
        {
            echo 'Houve um erro!';
        }

        public function _displayException($exception)
        {
            echo 'Houve uma exceção!';
        }
    }

O ``BaseErrorHandler`` define dois métodos abstratos. ``_displayError()`` é
usado quando erros são acionados. O método ``_displayException()`` é chamado
quando há uma exceção não capturada.

Alterando o Comportamento de Erros Fatais
------------------------------------------

Manipuladores de erro convertem erros fatais em exceções e reutilizam a
lógica de manipulação de exceção para renderizar uma página de erro. Se você não quiser mostrar a
página de erro padrão, você pode sobrescrevê-la::

    // Em src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Outros métodos.

        public function handleFatalError($code, $description, $file, $line)
        {
            echo 'Um erro fatal aconteceu';
        }
    }

.. index:: application exceptions

Criando suas Próprias Exceções de Aplicação
============================================

Você pode criar suas próprias exceções de aplicação usando qualquer uma das `exceções SPL
embutidas <https://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
em si, ou :php:exc:`Cake\\Core\\Exception\\Exception`.
Se sua aplicação contivesse a seguinte exceção::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
    }

Você poderia fornecer bons erros de desenvolvimento, criando
**templates/Error/missing_widget.php**. Quando em modo de produção, o erro acima
seria tratado como um erro 500 e usaria o template **error500**.

Se suas exceções tiverem um código entre ``400`` e ``506``, o código da exceção
será usado como código de resposta HTTP.

O construtor para :php:exc:`Cake\\Core\\Exception\\Exception` permite que você
passe dados adicionais. Esses dados adicionais são interpolados no
``_messageTemplate``. Isso permite que você crie exceções ricas em dados, que
fornecem mais contexto sobre seus erros::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        // Os dados de contexto são interpolados nesta string de formato.
        protected $_messageTemplate = 'Parece que %s está faltando.';

        // Você também pode definir um código de exceção padrão.
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

Quando renderizado, seu template de visualização teria uma variável ``$widget`` definida. Se
você converter a exceção como string ou usar seu método ``getMessage()`` você receberá
``Parece que Pointy está faltando.``.

Registrando Exceções
--------------------

Usando a manipulação de exceção embutida, você pode registrar todas as exceções que são
tratadas pelo ErrorHandler definindo a opção ``log`` como ``true`` no seu
**config/app.php**. Habilitar isso registrará cada exceção em
:php:class:`Cake\\Log\\Log` e nos loggers configurados.

.. note::

    Se você está usando um manipulador de exceção personalizado, esta configuração não terá
    efeito. A menos que você a referencie dentro da sua implementação.


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
   :nocontentsentry:

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."


Personalizando o Tratamento de Erros PHP
=========================================

Por padrão, os erros PHP são renderizados para saída de console ou HTML, e também registrados.
Se necessário, você pode trocar a lógica de tratamento de erros do CakePHP pela sua própria.

Log de Erros Personalizado
---------------------------

Os manipuladores de erro usam instâncias de ``Cake\Error\ErrorLoggingInterface`` para criar
mensagens de log e registrá-las no local apropriado. Você pode substituir o logger de erros
usando o valor de configuração ``Error.errorLogger``. Um exemplo de logger de erro::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Cake\Error\PhpError;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Registra erros e exceções não tratadas em `Cake\Log\Log`
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
            // Registrar erros PHP
        }

        /**
         * @inheritDoc
         */
        public function logException(
            ?ServerRequestInterface $request,
            bool $includeTrace = false
        ): void {
            // Registrar exceções.
        }
    }

Renderização de Erros Personalizada
------------------------------------

O CakePHP inclui renderizadores de erro para ambientes web e console. No entanto,
se você quiser substituir a lógica que renderiza erros, você pode criar
uma classe::

    // src/Error/CustomErrorRenderer.php
    namespace App\Error;

    use Cake\Error\ErrorRendererInterface;
    use Cake\Error\PhpError;

    class CustomErrorRenderer implements ErrorRendererInterface
    {
        public function write(string $out): void
        {
            // enviar o erro renderizado para o fluxo de saída apropriado
        }

        public function render(PhpError $error, bool $debug): string
        {
            // Converter o erro na string de saída.
        }
    }

O construtor do seu renderizador receberá um array de toda a configuração de Erro.
Você conecta seu renderizador de erro personalizado ao CakePHP através do
valor de configuração ``Error.errorRenderer``. Ao substituir o tratamento de erros, você
precisará levar em conta tanto ambientes web quanto de linha de comando.

.. meta::
    :title lang=pt: Tratamento de Erros & Exceções
    :keywords lang=pt: stack traces,constantes de erro,array de erros,exibições padrão,funções anônimas,manipuladores de erro,erro padrão,nível de erro,manipulador de exceção,erro php,manipulador de erro,escrever erro,classes core,tratamento de exceção,erro de configuração,código de aplicação,callback,erro personalizado,exceções,bitmasks,erro fatal,códigos de status http
