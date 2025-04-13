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
também pode acessá-lo em Components usando a referência do controlador. Algumas das
tarefas que o ``ServerRequest`` executa incluem:

* Processar as matrizes GET, POST e FILES nas estruturas de dados que você conhece.
* Fornecer introspecção do ambiente referente à solicitação. Informações como os
  cabeçalhos enviados, o endereço IP do cliente e os nomes de subdomínio/domínio
  no servidor em que seu aplicativo está sendo executado.
* Fornecendo acesso a parâmetros de solicitação, como índices de matriz e propriedades de objetos.

O objeto de solicitação do CakePHP implementa a `PSR-7
ServerRequestInterface <https://www.php-fig.org/psr/psr-7/>`_
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

.. php:method:: getQuery($name, $default = null)

Os parâmetros em URL podem ser lidos usando o método ``getQuery()``::

    // A URL é /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

Você pode acessar diretamente a propriedade query, ou pode usar o método ``getQuery()``
para ler a matriz de consultas de URL de maneira livre de erros. Quaisquer chaves que
não existirem retornarão ``null``::

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

Quaisquer chaves que não existem retornarão ``null``::

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

Variáveis de Ambiente ($_SERVER e $_ENV)
----------------------------------------

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
como o parâmetro 'as array' em ``json_decode``. Se você desejar que o XML seja
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
* ``is('json')`` Verifique se a solicitação possui extensão 'json' e aceite
  mimetype 'application/json'.
* ``is('xml')`` Verifique se a solicitação possui extensão 'xml' e aceite
  mimetype 'application/xml' ou 'text/xml'.

Dados da Sessão
---------------

Para acessar a sessão para uma determinada solicitação, use o método ``getSession()`` ou use o atributo ``session``::

    $session = $this->request->getSession();
    $session = $this->request->getAttribute('session');

    $userName = $session->read('Auth.User.name');

Para obter mais informações, consulte a documentação :doc:`/development/sessions`
para saber como usar o objeto de sessão.

Host e Nome de Domínio
----------------------

.. php:method:: domain($tldLength = 1)

Retorna o nome de domínio em que seu aplicativo está sendo executado::

    // Prints 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Retorna os subdomínios em que seu aplicativo está sendo executado como uma matriz::

    // Retorna ['my', 'dev'] para 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Retorna o host em que seu aplicativo está::

    // Exibe 'my.dev.example.org'
    echo $request->host();

Lendo o método HTTP
-------------------

.. php:method:: getMethod()

Retorna o método HTTP com o qual a solicitação foi feita::

    // Saída POST
    echo $request->getMethod();

Restringindo Qual Método HTTP Uma Ação Aceita
---------------------------------------------

.. php:method:: allowMethod($methods)

Defina métodos HTTP permitidos. Se não corresponder, lançará ``MethodNotAllowedException``.
A resposta 405 incluirá o cabeçalho ``Allow`` necessário com os métodos passados::

    public function delete()
    {
        // Aceite apenas solicitações POST e DELETE
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Lendo Cabeçalhos HTTP
---------------------

Permite acessar qualquer um dos cabeçalhos ``HTTP_*``
que foram usados para a solicitação. Por exemplo::

    // Obter o cabeçalho como uma string
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Obtenha uma matriz de todos os valores.
    $acceptHeader = $this->request->getHeader('Accept');

    // Verifique se existe um cabeçalho
    $hasAcceptHeader = $this->request->hasHeader('Accept');

Enquanto algumas instalações do apache não tornam o cabeçalho ``Authorization``
acessível, o CakePHP o torna disponível através de métodos específicos do apache,
conforme necessário.

.. php:method:: referer($local = true)

Retorna o endereço de referência para a solicitação.

.. php:method:: clientIp()

Retorna o endereço IP do visitante atual.

Confiando em Cabeçalhos de Proxy
--------------------------------

Se o seu aplicativo estiver atrás de um balanceador de carga ou em execução em
um serviço de nuvem, geralmente você receberá o host, a porta e o esquema do
balanceador de carga em suas solicitações. Freqüentemente, os balanceadores de
carga também enviam cabeçalhos ``HTTP-X-Forwarded-*`` com os valores originais.
Os cabeçalhos encaminhados não serão usados pelo CakePHP imediatamente. Para
que o objeto de solicitação use esses cabeçalhos, defina a propriedade ``trustProxy``
como ``true``::

    $this->request->trustProxy = true;

    // Esses métodos agora usarão os cabeçalhos com proxy.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Uma vez que os proxies são confiáveis, o método ``clientIp()`` usará o *último*
endereço IP no cabeçalho ``X-Forwarded-For``. Se o seu aplicativo estiver protegido
por vários proxies, você poderá usar ``setTrustedProxies()`` para definir os
endereços IP dos proxies em seu controle::

    $request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);

Depois que os proxies forem confiáveis, o ``clientIp()`` usará o primeiro endereço
IP no cabeçalho ``X-Forwarded-For``, desde que seja o único valor que não seja de um
proxy confiável.

Verificando Aceitar Cabeçalhos
------------------------------

.. php:method:: accepts($type = null)

Descubra quais tipos de conteúdo o cliente aceita ou verifique se
ele aceita um tipo específico de conteúdo.

Obter todos os tipos::

    $accepts = $this->request->accepts();

Verifique se há um único tipo::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Obtenha todos os idiomas aceitos pelo cliente,
ou verifique se um idioma específico é aceito.

Obter a lista de idiomas aceitos::

    $acceptsLanguages = $this->request->acceptLanguage();

Verifique se um idioma específico é aceito::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. _request-cookies:

Lendo Cookies
-------------

Os cookies de solicitação podem ser lidos através de vários métodos::

    // Obtem o valor de um cookie, ou nulo se o cookie não existir.
    $rememberMe = $this->request->getCookie('remember_me');

    // Leia o valor ou obtenha o padrão 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Obter todos os cookies como um hash
    $cookies = $this->request->getCookieParams();

    // Obter uma instância CookieCollection
    $cookies = $this->request->getCookieCollection()

Consulte a documentação :php:class:`Cake\\Http\\Cookie\\CookieCollection`
para saber como trabalhar com a coleção de cookies.

Arquivos Enviados
-----------------

Solicitações expõem os dados do arquivo carregado em ``getData()``
como matrizes e como objetos ``UploadedFileInterface`` por ``getUploadedFiles()``::

    // Obter uma lista de objetos UploadedFile
    $files = $request->getUploadedFiles();

    // Leia os dados do arquivo.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Move o arquivo.
    $files[0]->moveTo($targetPath);

Manipulando URIs
----------------

Requisições contêm um objeto URI, que tem métodos para interagir com o URI solicitado::

    // Obtem o URI
    $uri = $request->getUri();

    // Leia dados fora do URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();


.. index:: $this->response

Resposta
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` é a classe de resposta padrão no CakePHP.
Ele encapsula vários recursos e funcionalidades para gerar respostas HTTP em
seu aplicativo. Também auxilia nos testes, pois pode ser simulado/esboçado,
permitindo que você inspecione os cabeçalhos que serão enviados. Como
:php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolida uma série de métodos encontrados anteriormente em :php:class:`Controller`,
:php:class:`RequestHandlerComponent` e :php:class:`Dispatcher`. Os métodos
antigos são preteridos no uso de :php:class:`Cake\\Http\\Response`.

``Response`` fornece uma interface para agrupar tarefas comuns
relacionadas à resposta, como:

* Enviar cabeçalhos para redirecionamentos.
* Enviar cabeçalhos de tipo de conteúdo.
* Enviar qualquer cabeçalho.
* Enviar o corpo da resposta.

Lidando com Tipos de Conteúdo
-----------------------------

.. php:method:: withType($contentType = null)

Você pode controlar o tipo de conteúdo das respostas do seu aplicativo com
:php:meth:`Cake\\Http\\Response::withType()`. Se seu aplicativo precisar
lidar com tipos de conteúdo que não estão embutidos no Response, você pode
mapeá-los com ``type()`` também::

    // Adiciona um tipo de vCard
    $this->response->type(['vcf' => 'text/v-card']);

    // Defina a resposta Content-Type como vcard
    $this->response = $this->response->withType('vcf');

Normalmente, você deseja mapear tipos de conteúdo adicionais no retorno de
chamada do seu controlador :php:meth:`~Controller::beforeFilter()`,
para poder aproveitar os recursos de troca automática de exibição de
:php:class:`RequestHandlerComponent` se você está usando.

.. _cake-response-file:

Enviando Arquivos
-----------------

.. php:method:: withFile($path, $options = [])

Há momentos em que você deseja enviar arquivos como respostas para suas
solicitações. Você pode fazer isso usando :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Retorna a resposta para impedir que o controlador tente renderizar
        // uma view.
        return $response;
    }

Como mostrado no exemplo acima, você deve passar o caminho do arquivo para o
método. O CakePHP enviará um cabeçalho de tipo de conteúdo adequado se for um
tipo de arquivo conhecido listado em `Cake\\Http\\Response::$_mimeTypes`.
Você pode adicionar novos tipos antes de chamar :php:meth:`Cake\\Http\\Response::withFile()`
usando o método :php:meth:`Cake\\Http\\Response::withType()`.

Se desejar, você também pode forçar o download de um arquivo em vez de ser
exibido no navegador, especificando as opções::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

As opções suportadas são:

name
    O nome permite especificar um nome de arquivo alternativo a ser enviado
    ao usuário.
download
    Um valor booleano indicando se os cabeçalhos devem ser definidos para forçar o
    download.

Enviando uma String como Arquivo
--------------------------------

Você pode responder com um arquivo que não existe no disco, como um pdf ou um ics
gerado on-line a partir de uma string::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;

        // Injetar conteúdo da string no corpo da resposta
        $response = $response->withStringBody($icsString);

        $response = $response->withType('ics');

        // Opcionalmente, obriga o download do arquivo
        $response = $response->withDownload('filename_for_download.ics');

        // Retorne o objeto de resposta para impedir que o controlador tente renderizar
        // uma view.
        return $response;
    }

Os retornos de chamada também podem retornar o corpo como uma sequência::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Definindo Cabeçalhos
--------------------

.. php:method:: withHeader($header, $value)

A configuração dos cabeçalhos é feita com o método :php:meth:`Cake\\Http\\Response::withHeader()`.
Como todos os métodos de interface PSR-7, esse método retorna uma instância *new* com o novo cabeçalho::

    // Adicionar/substituir um cabeçalho
    $response = $response->withHeader('X-Extra', 'My header');

    // Define vários cabeçalhos
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Anexa um valor a um cabeçalho existente
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

Os cabeçalhos não são enviados quando definidos. Em vez disso, eles são mantidos
até que a resposta seja emitida por ``Cake\Http\Server``.

Agora você pode usar o método conveniente :php:meth:`Cake\\Http\\Response::withLocation()`
para definir diretamente ou obter o cabeçalho do local de redirecionamento.

Definindo o Corpo
-----------------

.. php:method:: withStringBody($string)

Para definir uma sequência como o corpo da resposta, faça o seguinte::

    // Define uma string no corpo da resposta
    $response = $response->withStringBody('My Body');

    // Se você deseja enviar uma resposta em JSON
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. php:method:: withBody($body)

Para definir o corpo da resposta, use o método ``withBody()``, fornecido pelo
:php:class:`Zend\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

Certifique-se de que ``$stream`` seja um objeto :php:class:`Psr\\Http\\Message\\StreamInterface`.
Veja abaixo como criar um novo fluxo.

Você também pode transmitir respostas de arquivos usando :php:class:`Zend\\Diactoros\\Stream` streams::

    // Para transmitir a partir de um arquivo
    use Zend\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

Você também pode transmitir respostas de um retorno de chamada usando o
``CallbackStream``. Isso é útil quando você possui recursos como imagens,
arquivos CSV ou PDFs que precisam ser transmitidos para o cliente::

    // Streaming a partir de um retorno de chamada
    use Cake\Http\CallbackStream;

    // Cria uma imagem
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

Definindo o Conjunto de Caracteres
----------------------------------

.. php:method:: withCharset($charset)

Define o conjunto de caracteres que será usado na resposta::

    $this->response = $this->response->withCharset('UTF-8');

Interagindo com o Cache do Navegador
------------------------------------

.. php:method:: withDisabledCache()

Às vezes, você precisa forçar os navegadores a não armazenar em cache os resultados
de uma ação do controlador. :php:meth:`Cake\\Http\\Response::withDisabledCache()`
é destinado apenas para isso::

    public function index()
    {
        // Desabilita o caching
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Desativando o armazenamento em cache de domínios SSL
    ao tentar enviar arquivos no Internet Explorer podem resultar em erros.

.. php:method:: withCache($since, $time = '+1 day')

Você também pode dizer aos clientes que deseja que eles armazenem respostas em cache.
Usando :php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Habilita o caching
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

O exposto acima informava aos clientes para armazenar em cache a resposta
resultante por 5 dias, acelerando a experiência dos visitantes. O método ``withCache()``
define o valor ``Last-Modified`` para o primeiro argumento. O cabeçalho ``Expires`` e
a diretiva ``max-age`` são configurados com base no segundo parâmetro. A diretiva
``public`` do Cache-Control também é definida.

.. _cake-response-caching:

Ajuste Fino de Cache HTTP
-------------------------

Uma das melhores e mais fáceis maneiras de acelerar seu aplicativo é usar o cache HTTP.
Sob esse modelo de armazenamento em cache, você só precisa ajudar os clientes a decidir
se devem usar uma cópia em cache da resposta, definindo alguns cabeçalhos, como tempo
modificado e tag da entidade de resposta.

Em vez de forçar você a codificar a lógica para armazenar em cache e invalidá-la
(atualizando) depois que os dados forem alterados, o HTTP usa dois modelos, expiração
e validação, que geralmente são muito mais simples de usar.

Além de usar :php:meth:`Cake\\Http\\Response::withCache()`, você também pode usar
muitos outros métodos para ajustar os cabeçalhos de cache HTTP para tirar proveito
do cache do navegador ou do proxy reverso.

O cabeçalho para Controle de Cache
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Usado como modelo de expiração, esse cabeçalho contém vários indicadores que podem
alterar a maneira como navegadores ou proxies usam o conteúdo em cache. Um
cabeçalho ``Cache-Control`` pode ser assim::

    Cache-Control: private, max-age=3600, must-revalidate

A classe ``Response`` ajuda a definir esse cabeçalho com alguns métodos utilitários
que produzirão um cabeçalho final ``Cache-Control`` válido. O primeiro é o método
``withSharable()``, que indica se uma resposta deve ser considerada compartilhável
entre diferentes usuários ou clientes. Este método realmente controla a parte ``public``
ou ``private`` deste cabeçalho. Definir uma resposta como privada indica que a totalidade
ou parte dela é destinada a um único usuário. Para tirar proveito dos caches compartilhados,
a diretiva de controle deve ser definida como pública.

O segundo parâmetro desse método é usado para especificar uma ``idade máxima`` para o cache,
que é o número de segundos após os quais a resposta não é mais considerada nova::

    public function view()
    {
        // ...
        // Define o controle de cache como público por 3600 segundos
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Define o Cache-Control como privado por 3600 segundos
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` expõe métodos separados para definir cada uma das diretivas no
cabeçalho ``Cache-Control``.

O Cabeçalho de Expiração
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

Você pode definir o cabeçalho ``Expires`` para uma data e hora após a qual a
resposta não é mais considerada nova. Esse cabeçalho pode ser definido usando
o método ``withExpires()``::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

Este método também aceita uma instância :php:class:`DateTime` ou qualquer string
que possa ser analisada pela classe :php:class:`DateTime`.

O Cabeçalho Etag
~~~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

A validação de cache no HTTP é frequentemente usada quando o conteúdo está em
constante mudança e solicita ao aplicativo que gere apenas o conteúdo da resposta
se o cache não estiver mais atualizado. Sob esse modelo, o cliente continua a armazenar
páginas no cache, mas pergunta sempre ao aplicativo se o recurso foi alterado, em vez de
usá-lo diretamente. Isso é comumente usado com recursos estáticos, como imagens e outros assets.

O método ``withEtag()`` (chamado tag de entidade) é uma string que identifica exclusivamente
o recurso solicitado, como a soma de verificação de um arquivo, para determinar se ele
corresponde a um recurso em cache.

Para tirar proveito desse cabeçalho, você deve chamar o método ``isNotModified()``
manualmente ou incluir o seguinte :doc:`/controllers/components/request-handling` no seu controlador::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->isNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::

    A maioria dos usuários proxy provavelmente deve considerar o uso do Último
    Cabeçalho Modificado em vez de Etags por motivos de desempenho e compatibilidade.

O Último Cabeçalho Modificado
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

Além disso, no modelo de validação de cache HTTP, você pode definir o cabeçalho
``Last-Modified`` para indicar a data e a hora em que o recurso foi modificado
pela última vez. Definir este cabeçalho ajuda o CakePHP a informar aos clientes
de armazenamento em cache se a resposta foi modificada ou não com base em seu cache.

Para tirar proveito desse cabeçalho, você deve chamar o método ``isNotModified()``
manualmente ou incluir o seguinte :doc:`/controllers/components/request-handling`
no seu controlador::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->isNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

O Cabeçalho Vary
~~~~~~~~~~~~~~~~

.. php:method:: withVary($header)

Em alguns casos, convém veicular conteúdo diferente usando o mesmo URL. Geralmente,
esse é o caso se você tiver uma página multilíngue ou responder com HTML diferente,
dependendo do navegador. Nessas circunstâncias, você pode usar o cabeçalho ``Vary``::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Enviando Respostas Não Modificadas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: isNotModified(Request $request)

Compara os cabeçalhos de cache do objeto de solicitação com o cabeçalho de cache
da resposta e determina se ele ainda pode ser considerado novo. Nesse caso, exclui
o conteúdo da resposta e envia o cabeçalho `304 Not Modified`::

    // Em um método do controlador.
    if ($this->response->isNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Configurando Cookies
--------------------

Os cookies podem ser adicionados à resposta usando um array ou um objeto :php:class:`Cake\\Http\\Cookie\\Cookie`::

    use Cake\Http\Cookie\Cookie;
    use DateTime;

    // Adiciona um cookie
    $this->response = $this->response->withCookie(new Cookie(
        'remember_me',
        'yes',
        new DateTime('+1 year'), // expiration time
        '/', // path
        '', // domain
        false, // secure
        true // httponly
    ]);

Veja a seção `created-cookies` para saber como usar o objeto cookie.
Você pode usar ``withExpiredCookie()`` para enviar um cookie expirado na
resposta. Isso fará com que o navegador remova seu cookie local::

    $this->response = $this->response->withExpiredCookie('remember_me');

.. _cors-headers:

Definindo Cabeçalho de Solicitação de Origem Cruzada (CORS)
===========================================================

O método ``cors()`` é usado para definir o `HTTP Access Control
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__,
são cabeçalhos relacionados com uma interface fluente::

    $this->response = $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

Os cabeçalhos relacionados ao CORS somente serão aplicados à resposta se os seguintes
critérios forem atendidos:

#. A solicitação possui um cabeçalho ``Origin``.
#. O valor ``Origem`` da solicitação corresponde a um dos valores de Origin permitidos.

Erros Comuns com Respostas Imutáveis
====================================

Os objetos de resposta oferecem vários métodos que tratam as respostas como objetos
imutáveis. Objetos imutáveis ajudam a evitar efeitos colaterais acidentais difíceis
de controlar e reduzem os erros causados por chamadas de método causadas pela refatoração
dessa ordem de alteração. Embora ofereçam vários benefícios, objetos imutáveis podem levar
algum tempo para se acostumar. Qualquer método que comece com ``with`` opera a resposta de
maneira imutável e **sempre** retorna uma **nova** instância. Esquecer de manter a instância
modificada é o erro mais frequente que as pessoas cometem ao trabalhar com objetos imutáveis::

    $this->response->withHeader('X-CakePHP', 'yes!');

No código acima, a resposta não terá o cabeçalho ``X-CakePHP``, pois o valor de
retorno do método ``withHeader()`` não foi mantido. Para corrigir o código acima,
você escreveria::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

Cookie Collections
==================

.. php:class:: CookieCollection

Os objetos ``CookieCollection`` são acessíveis a partir dos objetos de solicitação
e resposta. Eles permitem que você interaja com grupos de cookies usando padrões
imutáveis, que permitem preservar a imutabilidade da solicitação e resposta.

.. _creating-cookies:

Criando Cookies
---------------

.. php:class:: Cookie

Os objetos ``Cookie`` podem ser definidos por meio de objetos construtores ou usando
a interface fluente que segue padrões imutáveis::

    use Cake\Http\Cookie\Cookie;

    // Todos os argumentos no construtor
    $cookie = new Cookie(
        'remember_me', // nome
        1, // value
        new DateTime('+1 year'), // prazo de validade, se aplicável
        '/', // caminho, se aplicável
        'example.com', // doomínio, se aplicável
        false, // somente seguro?
        true // somente HTTP?
    );

    // Usando os métodos do construtor
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Depois de criar um cookie, você pode adicioná-lo a um ``CookieCollection``
novo ou existente::

    use Cake\Http\Cookie\CookieCollection;

    // Crie uma nova coleção
    $cookies = new CookieCollection([$cookie]);

    // Adicionar a uma coleção existente
    $cookies = $cookies->add($cookie);

    // Remover um cookie pelo nome
    $cookies = $cookies->remove('remember_me');

.. note::
    Lembre-se de que as coleções são imutáveis e a adição de cookies ou a remoção
    de cookies de uma coleção cria um *novo* objeto de coleção.

Objetos de cookie podem ser adicionados às respostas::

    // Adiciona um cookie
    $response = $this->response->withCookie($cookie);

    // Substitui inteiramente uma coleção de cookie
    $response = $this->response->withCookieCollection($cookies);

Os cookies definidos como respostas podem ser criptografados usando o
:ref:`encrypted-cookie-middleware`.

Lendo Cookies
-------------

Depois de ter uma instância ``CookieCollection``, você pode acessar os cookies que ela contém::

    // Verifica se o cookie existe
    $cookies->has('remember_me');

    // Obter o número de cookies na coleção
    count($cookies);

    // Obter uma instância de cookie
    $cookie = $cookies->get('remember_me');

Depois de ter um objeto ``Cookie``, você pode interagir com seu estado e modificá-lo.
Lembre-se de que os cookies são imutáveis, portanto, você precisará atualizar a coleção
se modificar um cookie::

    // Obtenha o valor
    $value = $cookie->getValue()

    // Acessar dados dentro de um valor JSON
    $id = $cookie->read('User.id');

    // Verifica o estado
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. meta::
    :title lang=pt: Objectos de requisição e resposta
    :keywords lang=pt: controlador de solicitação, parâmetros de solicitação, índices de arrays, índice de finalidade, objetos de resposta, informações de domínio, objeto de solicitação, dados de solicitação, interrogação, parâmetros, versões anteriores, introspecção, dispatcher, rota, estruturas de dados, matrizes, endereço IP, migração, índices, cakephp, PSR-7, imutável
