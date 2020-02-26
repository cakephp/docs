Objetos de Requisição e Resposta
################################

.. php:namespace:: Cake\Http

Os objetos de solicitação e resposta fornecem uma abstração em torno de solicitações e 
respostas HTTP. O objeto de solicitação no CakePHP permite que você examine uma solicitação 
de entrada, enquanto o objeto de resposta permite criar respostas HTTP sem esforço do seus 
controladores.

.. index:: $this->request
.. _cake-request:

Requisição
==========

.. php:class:: ServerRequest

``ServerRequest`` é o objeto de solicitação padrão usado no CakePHP. Ele centraliza 
vários recursos para interrogar e interagir com os dados da solicitação. Em cada 
solicitação, uma requisição é criada e depois passada por referência às várias camadas 
de um aplicativo que usam dados da solicitação. Por padrão, a solicitação é atribuída 
a ``$this->request`` e está disponível em Controllers, Cells, Views e Helpers. Você 
também pode acessá-lo em Components usando a referência do controlador. 
Algumas das tarefas que o ``ServerRequest`` executa incluem:

* Processar as matrizes GET, POST e FILES nas estruturas de dados que você conhece.
* Fornecer introspecção do ambiente referente à solicitação. Informações como os 
  cabeçalhos enviados, o endereço IP do cliente e os nomes de subdomínio/domínio 
  no servidor em que seu aplicativo está sendo executado.
* Fornecendo acesso a parâmetros de solicitação, como índices de matriz e propriedades de objetos.

O objeto de solicitação do CakePHP implementa a `PSR-7 ServerRequestInterface <http://www.php-fig.org/psr/psr-7/> `_ 
facilitando o uso de bibliotecas de fora do CakePHP.

Parâmetros de Requsição
-----------------------

A solicitação expõe parâmetros de roteamento através do método ``getParam()``::

    $controllerName = $this->request->getParam('controller');

Para obter todos os parâmetros de roteamento como uma matriz, use ``getAttribute()``::

    $parameters = $this->request->getAttribute('params');

Todos :ref:`route-elements` são acessados através desta interface.

Além de :ref:`route-elements`, você também precisa frequentemente acessar :ref:`passed-arguments`. 
Ambos estão disponíveis no objeto de solicitação também::

    // Argumentos passados
    $passedArgs = $this->request->getParam('pass');

Todos fornecerão acesso aos argumentos passados. Existem vários parâmetros importantes/úteis 
que o CakePHP usa internamente, todos eles também são encontrados nos parâmetros de roteamento:

* ``plugin`` O plug-in que manipula a solicitação. Será nulo quando não houver plug-in.
* ``controller`` O controlador que manipula a solicitação atual.
* ``action`` A ação que manipula a solicitação atual.
* ``prefix`` O prefixo da ação atual. Veja :ref:`prefix-routing` para mais informações.

Parâmetros em URL
-----------------

.. php:method:: getQuery($name)

Os parâmetros em URL podem ser lidos usando o método ``getQuery()``::

    // A URL é /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

Você pode acessar diretamente a propriedade query, ou pode usar o método ``getQuery()`` 
para ler a matriz de consultas de URL de maneira livre de erros. Quaisquer chaves que 
não existem retornarão ``null``::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // Você também pode fornecer valores padrão
    $foo = $this->request->getQuery('does_not_exist', 'default val');

Se você deseja acessar todos os parâmetros da consulta, pode usar
``getQueryParams()``::

    $query = $this->request->getQueryParams();

Dados do Corpo da Requisição
----------------------------

.. php:method:: getData($name, $default = null)

Todos os dados do POST podem ser acessados usando :php:meth:`Cake\\Http\\ServerRequest::getData()`. 
Qualquer dado de formulário que contenha um prefixo ``data`` terá esse prefixo de dados removido. 
Por exemplo::

    // Uma entrada com um atributo de nome igual a 'MyModel [title]' está acessível em
    $title = $this->request->getData('MyModel.title');

Quaisquer chaves que não existem retornarão ``null``:

    $foo = $this->request->getData('Value.that.does.not.exist');
    // $foo == null

Dados PUT, PATCH ou DELETE
--------------------------

.. php:method:: input($callback, [$options])

Ao criar serviços REST, você geralmente aceita dados de solicitação em 
solicitações ``PUT`` e ``DELETE``. Qualquer dado do corpo da solicitação 
``application/x-www-form-urlencoded`` será automaticamente analisado e 
definido como ``$this->data`` para as solicitações ``PUT`` e ``DELETE``. 
Se você estiver aceitando dados JSON ou XML, veja abaixo como acessar 
esses corpos de solicitação.

Ao acessar os dados de entrada, você pode decodificá-los com uma função opcional. 
Isso é útil ao interagir com o conteúdo do corpo da solicitação XML ou JSON. 
Parâmetros adicionais para a função de decodificação podem ser passados como 
argumentos para ``input()``::

    $jsonData = $this->request->input('json_decode');

Variáveis de Ambiente (De $_SERVER e $_ENV)
-------------------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` é um wrapper para a função global ``env()`` e 
atua como um getter/setter para variáveis de ambiente sem precisar modificar 
as globais ``$_SERVER`` e ``$_ENV``::

    // Obter o host
    $host = $this->request->env('HTTP_HOST');

    // Defina um valor, geralmente útil nos testes.
    $this->request->env('REQUEST_METHOD', 'POST');

Para acessar todas as variáveis de ambiente em uma solicitação, use ``getServerParams()``::

    $env = $this->request->getServerParams();

Dados XML ou JSON
-----------------

Os aplicativos que empregam :doc:`/development/rest` geralmente trocam dados em 
corpos de postagem não codificados em URL. Você pode ler dados de entrada em 
qualquer formato usando :php:meth:`~Cake\\Http\\ServerRequest::input()`. Ao 
fornecer uma função de decodificação, você pode receber o conteúdo em um 
formato desserializado::

    // Obter dados codificados em JSON enviados para uma ação PUT/POST
    $jsonData = $this->request->input('json_decode');

Alguns métodos de desserialização requerem parâmetros adicionais quando chamados, 
como o parâmetro 'as array' em ``json_decode``. Se você deseja que o XML seja 
convertido em um objeto DOMDocument, :php:meth:`~Cake\\Http\\ServerRequest::input()` 
também suporta a passagem de parâmetros adicionais::

    // Obter dados codificados em XML enviados para uma ação PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Informações de Caminho
----------------------

O objeto de solicitação também fornece informações úteis sobre os caminhos 
em seu aplicativo. Os atributos ``base`` e ``webroot`` são úteis para 
gerar URLs e determinar se seu aplicativo está ou não em um subdiretório. 
Os atributos que você pode usar são::

    // Suponha que o URL da solicitação atual seja /subdir/articles/edit/1?page=1

    // Possui /subdir/articles/edit/1?page=1
    $here = $request->getRequestTarget();

    // Possui /subdir
    $base = $request->getAttribute('base');

    // Possui /subdir/
    $base = $request->getAttribute('webroot');

.. _check-the-request:

Verificando as Condições da Solicitação
---------------------------------------

.. php:method:: is($type, $args...)

O objeto de solicitação fornece uma maneira fácil de inspecionar determinadas 
condições em uma determinada solicitação. Usando o método ``is()``, você 
pode verificar várias condições comuns, bem como inspecionar outros critérios 
de solicitação específicos do aplicativo::

    $isPost = $this->request->is('post');

Você também pode estender os detectores de solicitação disponíveis, usando 
:php:meth:`Cake\\Http\\ServerRequest::addDetector()` para criar 
novos tipos de detectores. Existem quatro tipos diferentes de detectores 
que você pode criar:

* Comparação de valores do ambiente - Compara um valor obtido de :php:func:`env()` 
  para igualdade com o valor fornecido.
* Comparação de valores padrão - A comparação de valores padrão permite comparar 
  um valor obtido de :php:func:`env()` com uma expressão regular.
* Comparação baseada em opção - Comparações baseadas em opção usam uma lista de 
  opções para criar uma expressão regular. As chamadas subseqüentes para adicionar 
  um detector de opções já definido mesclarão as opções.
* Detectores de retorno de chamada - Os detectores de retorno de chamada permitem 
  que você forneça um tipo de 'callback' para lidar com a verificação. 
  O retorno de chamada receberá o objeto de solicitação como seu único parâmetro.

.. php:method:: addDetector($name, $options)

Alguns exemplos seriam::

    // Adicione um detector de ambiente.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Adicione um detector de valor padrão.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Adicione um detector de opção
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // Adicione um detector de callback. Deve ser uma chamada válida.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Adicione um detector que use argumentos adicionais.
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->getParam('controller') === $name;
        }
    );

``Request`` também inclui métodos como
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` e
:php:meth:`Cake\\Http\\ServerRequest::host()` para ajudar aplicativos com subdomínios,
tenha uma vida um pouco mais fácil.

Existem vários detectores embutidos que você pode usar:

* ``is('get')`` Verifique se a solicitação atual é um GET.
* ``is('put')`` Verifique se a solicitação atual é um PUT.
* ``is('patch')`` Verifique se a solicitação atual é um PATCH.
* ``is('post')`` Verifique se a solicitação atual é um POST.
* ``is('delete')`` Verifique se a solicitação atual é um DELETE.
* ``is('head')`` Verifique se a solicitação atual é HEAD.
* ``is('options')`` Verifique se a solicitação atual é OPTIONS.
* ``is('ajax')`` Verifique se a solicitação atual veio com
  X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Verifique se a solicitação é via SSL.
* ``is('flash')`` Verifique se a solicitação possui um User-Agent de Flash.
* ``is('requested')`` Verifique se a solicitação possui um parâmetro de consulta
   'solicitado' com o valor 1.
* ``is('json')`` Verifique se a solicitação possui extensão 'json' e
   aceite mimetype 'application/json'.
* ``is('xml')`` Verifique se a solicitação possui extensão 'xml' e aceite
   mimetype 'application/xml' ou 'text/xml'.

Session Data
------------

To access the session for a given request use the ``getSession()`` method or use the ``session`` attribute::

    $session = $this->request->getSession();
    $session = $this->request->getAttribute('session');

    $userName = $session->read('Auth.User.name');

For more information, see the :doc:`/development/sessions` documentation for how
to use the session object.

Host and Domain Name
--------------------

.. php:method:: domain($tldLength = 1)

Returns the domain name your application is running on::

    // Prints 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Returns the subdomains your application is running on as an array::

    // Returns ['my', 'dev'] for 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Returns the host your application is on::

    // Prints 'my.dev.example.org'
    echo $request->host();

Reading the HTTP Method
-----------------------

.. php:method:: getMethod()

Returns the HTTP method the request was made with::

    // Output POST
    echo $request->getMethod();

Restricting Which HTTP method an Action Accepts
-----------------------------------------------

.. php:method:: allowMethod($methods)

Set allowed HTTP methods. If not matched, will throw
``MethodNotAllowedException``. The 405 response will include the required
``Allow`` header with the passed methods::

    public function delete()
    {
        // Only accept POST and DELETE requests
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Reading HTTP Headers
--------------------

Allows you to access any of the ``HTTP_*`` headers that were used
for the request. For example::

    // Get the header as a string
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Get an array of all values.
    $acceptHeader = $this->request->getHeader('Accept');

    // Check if a header exists
    $hasAcceptHeader = $this->request->hasHeader('Accept');

While some apache installs don't make the ``Authorization`` header accessible,
CakePHP will make it available through apache specific methods as required.

.. php:method:: referer($local = true)

Returns the referring address for the request.

.. php:method:: clientIp()

Returns the current visitor's IP address.

Trusting Proxy Headers
----------------------

If your application is behind a load balancer or running on a cloud service, you
will often get the load balancer host, port and scheme in your requests. Often
load balancers will also send ``HTTP-X-Forwarded-*`` headers with the original
values. The forwarded headers will not be used by CakePHP out of the box. To
have the request object use these headers set the ``trustProxy`` property to
``true``::

    $this->request->trustProxy = true;

    // These methods will now use the proxied headers.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Once proxies are trusted the ``clientIp()`` method will use the *last* IP
address in the ``X-Forwarded-For`` header. If your application is behind
multiple proxies, you can use ``setTrustedProxies()`` to define the IP addresses
of proxies in your control::

    $request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);

After proxies are trusted ``clientIp()`` will use the first IP address in the
``X-Forwarded-For`` header providing it is the only value that isn't from a trusted
proxy.

Checking Accept Headers
-----------------------

.. php:method:: accepts($type = null)

Find out which content types the client accepts, or check whether it accepts a
particular type of content.

Get all types::

    $accepts = $this->request->accepts();

Check for a single type::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Get all the languages accepted by the client,
or check whether a specific language is accepted.

Get the list of accepted languages::

    $acceptsLanguages = $this->request->acceptLanguage();

Check whether a specific language is accepted::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. _request-cookies:

Cookies
-------

Request cookies can be read through a number of methods::

    // Get the cookie value, or null if the cookie is missing.
    $rememberMe = $this->request->getCookie('remember_me');

    // Read the value, or get the default of 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Get all cookies as an hash
    $cookies = $this->request->getCookieParams();

    // Get a CookieCollection instance
    $cookies = $this->request->getCookieCollection()

See the :php:class:`Cake\\Http\\Cookie\\CookieCollection` documentation for how
to work with cookie collection.


Uploaded Files
--------------

Requests expose the uploaded file data in ``getData()`` as
arrays, and as ``UploadedFileInterface`` objects by ``getUploadedFiles()``::

    // Get a list of UploadedFile objects
    $files = $request->getUploadedFiles();

    // Read the file data.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Move the file.
    $files[0]->moveTo($targetPath);

Manipulating URIs
-----------------

Requests contain a URI object, which contains methods for interacting with the
requested URI::

    // Get the URI
    $uri = $request->getUri();

    // Read data out of the URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();


.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like :php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolidates a number of methods previously found on :php:class:`Controller`,
:php:class:`RequestHandlerComponent` and :php:class:`Dispatcher`. The old
methods are deprecated in favour of using :php:class:`Cake\\Http\\Response`.

``Response`` provides an interface to wrap the common response-related
tasks such as:

* Sending headers for redirects.
* Sending content type headers.
* Sending any header.
* Sending the response body.

Dealing with Content Types
--------------------------

.. php:method:: withType($contentType = null)

You can control the Content-Type of your application's responses with
:php:meth:`Cake\\Http\\Response::withType()`. If your application needs to deal
with content types that are not built into Response, you can map them with
``type()`` as well::

    // Add a vCard type
    $this->response->type(['vcf' => 'text/v-card']);

    // Set the response Content-Type to vcard.
    $this->response = $this->response->withType('vcf');

Usually, you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can leverage the
automatic view switching features of :php:class:`RequestHandlerComponent` if you
are using it.

.. _cake-response-file:

Sending Files
-------------

.. php:method:: withFile($path, $options = [])

There are times when you want to send files as responses for your requests.
You can accomplish that by using :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Return the response to prevent controller from trying to render
        // a view.
        return $response;
    }

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed
in `Cake\\Http\\Response::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Http\\Response::withFile()` by using the
:php:meth:`Cake\\Http\\Response::withType()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

The supported options are:

name
    The name allows you to specify an alternate file name to be sent to
    the user.
download
    A boolean value indicating whether headers should be set to force
    download.

Sending a String as File
------------------------

You can respond with a file that does not exist on the disk, such as a pdf or an
ics generated on the fly from a string::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;

        // Inject string content into response body
        $response = $response->withStringBody($icsString);

        $response = $response->withType('ics');

        // Optionally force file download
        $response = $response->withDownload('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view.
        return $response;
    }

Callbacks can also return the body as a string::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Setting Headers
---------------

.. php:method:: withHeader($header, $value)

Setting headers is done with the :php:meth:`Cake\\Http\\Response::withHeader()`
method. Like all of the PSR-7 interface methods, this method returns a *new*
instance with the new header::

    // Add/replace a header
    $response = $response->withHeader('X-Extra', 'My header');

    // Set multiple headers
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Append a value to an existing header
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

Headers are not sent when set. Instead, they are held until the response is
emitted by ``Cake\Http\Server``.

You can now use the convenience method
:php:meth:`Cake\\Http\\Response::withLocation()` to directly set or get the
redirect location header.

Setting the Body
----------------

.. php:method:: withStringBody($string)

To set a string as the response body, do the following::

    // Set a string into the body
    $response = $response->withStringBody('My Body');

    // If you want a json response
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. php:method:: withBody($body)

To set the response body, use the ``withBody()`` method, which is provided by the
:php:class:`Zend\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

Be sure that ``$stream`` is a :php:class:`Psr\\Http\\Message\\StreamInterface` object.
See below on how to create a new stream.

You can also stream responses from files using :php:class:`Zend\\Diactoros\\Stream` streams::

    // To stream from a file
    use Zend\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

You can also stream responses from a callback using the ``CallbackStream``. This
is useful when you have resources like images, CSV files or PDFs you need to
stream to the client::

    // Streaming from a callback
    use Cake\Http\CallbackStream;

    // Create an image.
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

Setting the Character Set
-------------------------

.. php:method:: withCharset($charset)

Sets the charset that will be used in the response::

    $this->response = $this->response->withCharset('UTF-8');

Interacting with Browser Caching
--------------------------------

.. php:method:: withDisabledCache()

You sometimes need to force browsers not to cache the results of a controller
action. :php:meth:`Cake\\Http\\Response::withDisabledCache()` is intended for just
that::

    public function index()
    {
        // Disable caching
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Disabling caching from SSL domains while trying to send
    files to Internet Explorer can result in errors.

.. php:method:: withCache($since, $time = '+1 day')

You can also tell clients that you want them to cache responses. By using
:php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Enable caching
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience.
The ``withCache()`` method sets the ``Last-Modified`` value to the first
argument. ``Expires`` header and the ``max-age`` directive are set based on the
second parameter. Cache-Control's ``public`` directive is set as well.

.. _cake-response-caching:

Fine Tuning HTTP Cache
----------------------

One of the best and easiest ways of speeding up your application is to use HTTP
cache. Under this caching model, you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time and response entity tag.

Rather than forcing you to code the logic for caching and for invalidating
(refreshing) it once the data has changed, HTTP uses two models, expiration and
validation, which usually are much simpler to use.

Apart from using :php:meth:`Cake\\Http\\Response::withCache()`, you can also use
many other methods to fine-tune HTTP cache headers to take advantage of browser
or reverse proxy caching.

The Cache Control Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Used under the expiration model, this header contains multiple indicators that
can change the way browsers or proxies use the cached content. A
``Cache-Control`` header can look like this::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` class helps you set this header with some utility methods that will
produce a final valid ``Cache-Control`` header. The first is the
``withSharable()`` method, which indicates whether a response is to be
considered sharable across different users or clients. This method actually
controls the ``public`` or ``private`` part of this header.  Setting a response
as private indicates that all or part of it is intended for a single user. To
take advantage of shared caches, the control directive must be set as public.

The second parameter of this method is used to specify a ``max-age`` for the
cache, which is the number of seconds after which the response is no longer
considered fresh::

    public function view()
    {
        // ...
        // Set the Cache-Control as public for 3600 seconds
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Set the Cache-Control as private for 3600 seconds
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` exposes separate methods for setting each of the directives in
the ``Cache-Control`` header.

The Expiration Header
~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

You can set the ``Expires`` header to a date and time after which the response
is no longer considered fresh. This header can be set using the
``withExpires()`` method::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

This method also accepts a :php:class:`DateTime` instance or any string that can
be parsed by the :php:class:`DateTime` class.

The Etag Header
~~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The ``withEtag()`` method (called entity tag) is a string
that uniquely identifies the requested resource, as a checksum does for a file,
in order to determine whether it matches a cached resource.

To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::

    Most proxy users should probably consider using the Last Modified Header
    instead of Etags for performance and compatibility reasons.

The Last Modified Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

Also, under the HTTP cache validation model, you can set the ``Last-Modified``
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether the
response was modified or not based on their cache.

To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

The Vary Header
~~~~~~~~~~~~~~~

.. php:method:: withVary($header)

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the ``Vary``
header::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Sending Not-Modified Responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the `304 Not Modified` header::

    // In a controller action.
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Setting Cookies
===============

Cookies can be added to response using either an array or a :php:class:`Cake\\Http\\Cookie\\Cookie`
object::

    use Cake\Http\Cookie\Cookie;
    use DateTime;

    // Add a cookie
    $this->response = $this->response->withCookie(new Cookie(
        'remember_me',
        'yes',
        new DateTime('+1 year'), // expiration time
        '/', // path
        '', // domain
        false, // secure
        true // httponly
    ]);

See the :ref:`creating-cookies` section for how to use the cookie object. You
can use ``withExpiredCookie()`` to send an expired cookie in the response. This
will make the browser remove its local cookie::

    $this->response = $this->response->withExpiredCookie('remember_me');

.. _cors-headers:

Setting Cross Origin Request Headers (CORS)
===========================================

The ``cors()`` method is used to define `HTTP Access Control
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__
related headers with a fluent interface::

    $this->response = $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

CORS related headers will only be applied to the response if the following
criteria are met:

#. The request has an ``Origin`` header.
#. The request's ``Origin`` value matches one of the allowed Origin values.

Common Mistakes with Immutable Responses
========================================

Response objects offer a number of methods that treat
responses as immutable objects. Immutable objects help prevent difficult to
track accidental side-effects, and reduce mistakes caused by method calls caused
by refactoring that change ordering. While they offer a number of benefits,
immutable objects can take some getting used to. Any method that starts with
``with`` operates on the response in an immutable fashion, and will **always**
return a **new** instance. Forgetting to retain the modified instance is the most
frequent mistake people make when working with immutable objects::

    $this->response->withHeader('X-CakePHP', 'yes!');

In the above code, the response will be lacking the ``X-CakePHP`` header, as the
return value of the ``withHeader()`` method was not retained. To correct the
above code you would write::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

Cookie Collections
==================

.. php:class:: CookieCollection

``CookieCollection`` objects are accessible from the request and response objects.
They let you interact with groups of cookies using immutable patterns, which
allow the immutability of the request and response to be preserved.

.. _creating-cookies:

Creating Cookies
----------------

.. php:class:: Cookie

``Cookie`` objects can be defined through constructor objects, or by using the
fluent interface that follows immutable patterns::

    use Cake\Http\Cookie\Cookie;

    // All arguments in the constructor
    $cookie = new Cookie(
        'remember_me', // name
        1, // value
        new DateTime('+1 year'), // expiration time, if applicable
        '/', // path, if applicable
        'example.com', // domain, if applicable
        false, // secure only?
        true // http only ?
    );

    // Using the builder methods
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Once you have created a cookie, you can add it to a new or existing
``CookieCollection``::

    use Cake\Http\Cookie\CookieCollection;

    // Create a new collection
    $cookies = new CookieCollection([$cookie]);

    // Add to an existing collection
    $cookies = $cookies->add($cookie);

    // Remove a cookie by name
    $cookies = $cookies->remove('remember_me');

.. note::
    Remember that collections are immutable and adding cookies into, or removing
    cookies from a collection, creates a *new* collection object.

Cookie objects can be added to responses::

    // Add one cookie
    $response = $this->response->withCookie($cookie);

    // Replace the entire cookie collection
    $response = $this->response->withCookieCollection($cookies);

Cookies set to responses can be encrypted using the
:ref:`encrypted-cookie-middleware`.

Reading Cookies
---------------

Once you have a ``CookieCollection`` instance, you can access the cookies it
contains::

    // Check if a cookie exists
    $cookies->has('remember_me');

    // Get the number of cookies in the collection
    count($cookies);

    // Get a cookie instance
    $cookie = $cookies->get('remember_me');

Once you have a ``Cookie`` object you can interact with it's state and modify
it. Keep in mind that cookies are immutable, so you'll need to update the
collection if you modify a cookie::

    // Get the value
    $value = $cookie->getValue()

    // Access data inside a JSON value
    $id = $cookie->read('User.id');

    // Check state
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. meta::
    :title lang=en: Request and Response objects
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,parameters,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
