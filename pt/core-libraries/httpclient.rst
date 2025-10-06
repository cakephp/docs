Cliente HTTP
############

.. php:namespace:: Cake\Http

.. php:class:: Client(mixed $config = [])

O CakePHP inclui um cliente HTTP compatível com PSR-18 que pode ser usado para
fazer requisições. É uma ótima maneira de se comunicar com webservices e
APIs remotas.

Fazendo Requisições
===================

Fazer requisições é simples e direto. Fazer uma requisição GET é assim::

    use Cake\Http\Client;

    $http = new Client();

    // GET simples
    $response = $http->get('http://example.com/test.html');

    // GET simples com querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // GET simples com querystring e cabeçalhos adicionais
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest'],
    ]);

Fazer requisições POST e PUT é igualmente simples::

    // Enviar uma requisição POST com dados codificados em application/x-www-form-urlencoded
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post',
    ]);

    // Enviar uma requisição PUT com dados codificados em application/x-www-form-urlencoded
    $response = $http->put('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post',
    ]);

    // Outros métodos também.
    $http->delete(/* ... */);
    $http->head(/* ... */);
    $http->patch(/* ... */);

Se você criou um objeto de requisição PSR-7, pode enviá-lo usando
``sendRequest()``::

    use Cake\Http\Client;
    use Cake\Http\Client\Request as ClientRequest;

    $request = new ClientRequest(
        'http://example.com/search',
        ClientRequest::METHOD_GET
    );
    $http = new Client();
    $response = $http->sendRequest($request);

Criando Requisições Multipart com Arquivos
===========================================

Você pode incluir arquivos nos corpos das requisições incluindo um filehandle no array::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => fopen('/path/to/a/file', 'r'),
    ]);

O filehandle será lido até o final; ele não será rebobinado antes de ser lido.

Construindo Corpos de Requisição Multipart
-------------------------------------------

Pode haver momentos em que você precise construir um corpo de requisição de uma maneira muito específica.
Nessas situações, você pode frequentemente usar ``Cake\Http\Client\FormData`` para criar
a requisição HTTP multipart específica que você deseja::

    use Cake\Http\Client\FormData;

    $data = new FormData();

    // Criar uma parte XML
    $xml = $data->newPart('xml', $xmlString);
    // Definir o tipo de conteúdo.
    $xml->type('application/xml');
    $data->add($xml);

    // Criar um upload de arquivo com addFile()
    // Isso também adicionará o arquivo aos dados do formulário.
    $file = $data->addFile('upload', fopen('/some/file.txt', 'r'));
    $file->contentId('abc123');
    $file->disposition('attachment');

    // Enviar a requisição.
    $response = $http->post(
        'http://example.com/api',
        (string)$data,
        ['headers' => ['Content-Type' => $data->contentType()]]
    );

Enviando Corpos de Requisição
==============================

Ao lidar com APIs REST, você frequentemente precisa enviar corpos de requisição que não são
codificados como formulário. Http\\Client expõe isso através da opção type::

    // Enviar um corpo de requisição JSON.
    $http = new Client();
    $response = $http->post(
      'http://example.com/tasks',
      json_encode($data),
      ['type' => 'json']
    );

A chave ``type`` pode ser 'json', 'xml' ou um tipo MIME completo.
Ao usar a opção ``type``, você deve fornecer os dados como uma string. Se você estiver
fazendo uma requisição GET que precisa de parâmetros de querystring e de um corpo de requisição,
você pode fazer o seguinte::

    // Enviar um corpo JSON em uma requisição GET com parâmetros de query string.
    $http = new Client();
    $response = $http->get(
      'http://example.com/tasks',
      ['q' => 'test', '_content' => json_encode($data)],
      ['type' => 'json']
    );

.. _http_client_request_options:

Opções de Método de Requisição
===============================

Cada método HTTP recebe um parâmetro ``$options`` que é usado para fornecer
informações adicionais de requisição. As seguintes chaves podem ser usadas em ``$options``:

- ``headers`` - Array de cabeçalhos adicionais
- ``cookie`` - Array de cookies a usar.
- ``proxy`` - Array de informações de proxy.
- ``auth`` - Array de dados de autenticação, a chave ``type`` é usada para delegar a
  uma estratégia de autenticação. Por padrão, a autenticação básica é usada.
- ``ssl_verify_peer`` - padrão é ``true``. Defina como ``false`` para desabilitar a verificação de
  certificação SSL (não recomendado).
- ``ssl_verify_peer_name`` - padrão é ``true``. Defina como ``false`` para desabilitar
  a verificação do nome do host ao verificar certificados SSL (não recomendado).
- ``ssl_verify_depth`` - padrão é 5. Profundidade para percorrer na cadeia de CA.
- ``ssl_verify_host`` - padrão é ``true``. Validar o certificado SSL contra o nome do host.
- ``ssl_cafile`` - padrão é o cafile integrado. Sobrescrever para usar pacotes de CA personalizados.
- ``timeout`` - Duração a esperar antes de expirar em segundos.
- ``type`` - Enviar um corpo de requisição em um tipo de conteúdo personalizado. Requer que ``$data`` seja
  uma string, ou que a opção ``_content`` seja definida ao fazer requisições GET.
- ``redirect`` - Número de redirecionamentos a seguir. Padrão é ``false``.
- ``curl`` - Um array de opções adicionais do curl (se o adaptador curl for usado),
  por exemplo, ``[CURLOPT_SSLKEY => 'key.pem']``.

O parâmetro options é sempre o 3º parâmetro em cada um dos métodos HTTP.
Eles também podem ser usados ao construir ``Client`` para criar
:ref:`clientes com escopo <http_client_scoped_client>`.

Autenticação
============

``Cake\Http\Client`` suporta alguns sistemas de autenticação diferentes. Diferentes
estratégias de autenticação podem ser adicionadas por desenvolvedores. As estratégias de autenticação são chamadas
antes do envio da requisição e permitem que cabeçalhos sejam adicionados ao
contexto da requisição.

Usando Autenticação Básica
---------------------------

Um exemplo de autenticação básica::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'mark', 'password' => 'secret'],
    ]);

Por padrão, ``Cake\Http\Client`` usará autenticação básica se não houver
chave ``'type'`` na opção auth.

Usando Autenticação Digest
---------------------------

Um exemplo de autenticação digest::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
        'auth' => [
            'type' => 'digest',
            'username' => 'mark',
            'password' => 'secret',
            'realm' => 'myrealm',
            'nonce' => 'onetimevalue',
            'qop' => 1,
            'opaque' => 'someval',
        ],
    ]);

Ao definir a chave 'type' como 'digest', você informa ao subsistema de autenticação para
usar autenticação digest. A autenticação digest suporta os seguintes
algoritmos:

* MD5
* SHA-256
* SHA-512-256
* MD5-sess
* SHA-256-sess
* SHA-512-256-sess

O algoritmo será escolhido automaticamente com base no desafio do servidor.

Autenticação OAuth 1
---------------------

Muitos webservices modernos exigem autenticação OAuth para acessar suas APIs.
A autenticação OAuth incluída assume que você já tem sua chave de consumidor
e segredo de consumidor::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
        'auth' => [
            'type' => 'oauth',
            'consumerKey' => 'bigkey',
            'consumerSecret' => 'secret',
            'token' => '...',
            'tokenSecret' => '...',
            'realm' => 'tickets',
        ],
    ]);

Autenticação OAuth 2
---------------------

Como OAuth2 é frequentemente um único cabeçalho, não há um adaptador de
autenticação especializado. Em vez disso, você pode criar um cliente com o token de acesso::

    $http = new Client([
        'headers' => ['Authorization' => 'Bearer ' . $accessToken],
    ]);
    $response = $http->get('https://example.com/api/profile/1');

Autenticação de Proxy
----------------------

Alguns proxies exigem autenticação para usá-los. Geralmente, essa autenticação
é básica, mas pode ser implementada por qualquer adaptador de autenticação. Por padrão,
Http\\Client assumirá autenticação básica, a menos que a chave type seja definida::

    $http = new Client();
    $response = $http->get('http://example.com/test.php', [], [
        'proxy' => [
            'username' => 'mark',
            'password' => 'testing',
            'proxy' => '127.0.0.1:8080',
        ],
    ]);

O segundo parâmetro proxy deve ser uma string com um IP ou um domínio sem
protocolo. As informações de nome de usuário e senha serão passadas através dos
cabeçalhos da requisição, enquanto a string proxy será passada através de
`stream_context_create()
<https://php.net/manual/en/function.stream-context-create.php>`_.

.. _http_client_scoped_client:

Criando Clientes com Escopo
============================

Ter que redigitar o nome de domínio, autenticação e configurações de proxy pode se tornar
tedioso e propenso a erros. Para reduzir a chance de erro e aliviar parte do
tédio, você pode criar clientes com escopo::

    // Criar um cliente com escopo.
    $http = new Client([
        'host' => 'api.example.com',
        'scheme' => 'https',
        'auth' => ['username' => 'mark', 'password' => 'testing'],
    ]);

    // Fazer uma requisição para api.example.com
    $response = $http->get('/test.php');

Se seu cliente com escopo precisa apenas de informações da URL, você pode usar
``createFromUrl()``::

    $http = Client::createFromUrl('https://api.example.com/v1/test');

O código acima criaria uma instância de cliente com as opções ``protocol``, ``host`` e
``basePath`` definidas.

As seguintes informações podem ser usadas ao criar um cliente com escopo:

* host
* basePath
* scheme
* proxy
* auth
* port
* cookies
* timeout
* ssl_verify_peer
* ssl_verify_depth
* ssl_verify_host

Qualquer uma dessas opções pode ser sobrescrita especificando-as ao fazer requisições.
host, scheme, proxy, port são sobrescritos na URL da requisição::

    // Usando o cliente com escopo que criamos anteriormente.
    $response = $http->get('http://foo.com/test.php');

O código acima substituirá o domínio, esquema e porta. No entanto, esta requisição continuará
usando todas as outras opções definidas quando o cliente com escopo foi criado.
Veja :ref:`http_client_request_options` para mais informações sobre as opções
suportadas.

Definindo e Gerenciando Cookies
================================

Http\\Client também pode aceitar cookies ao fazer requisições. Além de
aceitar cookies, ele também armazenará automaticamente cookies válidos definidos nas
respostas. Qualquer resposta com cookies os armazenará na instância
de origem do Http\\Client. Os cookies armazenados em uma instância de Client são
automaticamente incluídos em requisições futuras para combinações de domínio + caminho que
correspondam::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Fazer uma requisição que define alguns cookies
    $response = $http->get('/');

    // Os cookies da primeira requisição serão incluídos
    // por padrão.
    $response2 = $http->get('/changelogs');

Você sempre pode sobrescrever os cookies incluídos automaticamente definindo-os nos
parâmetros ``$options`` da requisição::

    // Substituir um cookie armazenado com um valor personalizado.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc'],
    ]);

Você pode adicionar objetos de cookie ao cliente após criá-lo usando o método ``addCookie()``::

    use Cake\Http\Cookie\Cookie;

    $http = new Client([
        'host' => 'cakephp.org'
    ]);
    $http->addCookie(new Cookie('session', 'abc123'));

Eventos do Cliente
==================

``Client`` emitirá eventos quando requisições forem enviadas. O evento
``HttpClient.beforeSend`` é disparado antes que uma requisição seja enviada, e
``HttpClient.afterSend`` é disparado após uma requisição ser enviada. Você pode modificar a
requisição ou definir uma resposta em um listener ``beforeSend``. O evento ``afterSend``
é disparado para todas as requisições, mesmo aquelas que tiveram suas respostas definidas por
um evento ``beforeSend``.


.. _httpclient-response-objects:

Objetos de Resposta
===================

.. php:namespace:: Cake\Http\Client

.. php:class:: Response

Os objetos de resposta têm vários métodos para inspecionar os dados da resposta.

Lendo Corpos de Resposta
-------------------------

Você lê todo o corpo da resposta como uma string::

    // Ler toda a resposta como uma string.
    $response->getStringBody();

Você também pode acessar o objeto stream da resposta e usar seus métodos::

    // Obter um Psr\Http\Message\StreamInterface contendo o corpo da resposta
    $stream = $response->getBody();

    // Ler um stream de 100 bytes por vez.
    while (!$stream->eof()) {
        echo $stream->read(100);
    }

.. _http-client-xml-json:

Lendo Corpos de Resposta JSON e XML
------------------------------------

Como respostas JSON e XML são comumente usadas, objetos de resposta fornecem uma maneira
de usar acessores para ler dados decodificados. Dados JSON são decodificados em um array, enquanto
dados XML são decodificados em uma árvore ``SimpleXMLElement``::

    // Obter algum XML
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->getXml();

    // Obter algum JSON
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->getJson();

Os dados de resposta decodificados são armazenados no objeto de resposta, então acessá-los
várias vezes não tem custo adicional.

Acessando Cabeçalhos de Resposta
---------------------------------

Você pode acessar cabeçalhos através de alguns métodos diferentes. Os nomes dos cabeçalhos são sempre
tratados como valores não sensíveis a maiúsculas/minúsculas ao acessá-los através de métodos::

    // Obter todos os cabeçalhos como um array associativo.
    $response->getHeaders();

    // Obter um único cabeçalho como um array.
    $response->getHeader('content-type');

    // Obter um cabeçalho como uma string
    $response->getHeaderLine('content-type');

    // Obter a codificação da resposta
    $response->getEncoding();

Acessando Dados de Cookie
--------------------------

Você pode ler cookies com alguns métodos diferentes, dependendo de quanto
dado você precisa sobre os cookies::

    // Obter todos os cookies (dados completos)
    $response->getCookies();

    // Obter o valor de um único cookie.
    $response->getCookie('session_id');

    // Obter os dados completos de um único cookie
    // inclui as chaves value, expires, path, httponly, secure.
    $response->getCookieData('session_id');

Verificando o Código de Status
-------------------------------

Objetos de resposta fornecem alguns métodos para verificar códigos de status::

    // A resposta foi 20x
    $response->isOk();

    // A resposta foi 30x
    $response->isRedirect();

    // Obter o código de status
    $response->getStatusCode();

Alterando Adaptadores de Transporte
====================================

Por padrão, ``Http\Client`` preferirá usar um adaptador de transporte baseado em ``curl``.
Se a extensão curl não estiver disponível, um adaptador baseado em stream será usado
em vez disso. Você pode forçar a seleção de um adaptador de transporte usando uma opção de construtor::

    use Cake\Http\Client\Adapter\Stream;

    $http = new Client(['adapter' => Stream::class]);

Eventos
=======

O cliente HTTP dispara alguns eventos antes e depois de enviar uma requisição
que permitem modificar a requisição ou resposta ou fazer outras tarefas como
cache, registro, etc.

HttpClient.beforeSend
---------------------

::

    // Em algum lugar antes de chamar um dos métodos do cliente HTTP que faz uma requisição
    $http->getEventManager()->on(
        'HttpClient.beforeSend',
        function (
            \Cake\Http\Client\ClientEvent $event,
            \Cake\Http\Client\Request $request,
            array $adapterOptions,
            int $redirects
        ) {
            // Modificar a requisição
            $event->setRequest(....);
            // Modificar as opções do adaptador
            $event->setAdapterOptions(....);

            // Pular a requisição real retornando uma resposta.
            // Você pode usar $event->setResult($response) para obter o mesmo resultado.
            return new \Cake\Http\Client\Response(body: 'something');
        }
    );

HttpClient.afterSend
--------------------

::

    // Em algum lugar antes de chamar um dos métodos do cliente HTTP que faz uma requisição
    $http->getEventManager()->on(
        'HttpClient.afterSend',
        function (
            \Cake\Http\Client\ClientEvent $event,
            \Cake\Http\Client\Request $request,
            array $adapterOptions,
            int $redirects,
            bool $requestSent // Indica se a requisição foi realmente enviada
                              // ou resposta retornada do evento ``beforeSend``
        ) {
            // Obter a resposta
            $response = $event->getResponse();

            // Retornar uma nova/modificada resposta.
            // Você pode usar $event->setResult($response) para obter o mesmo resultado.
            return new \Cake\Http\Client\Response(body: 'something');
        }
    );

.. _httpclient-testing:

Testes
======

.. php:namespace:: Cake\Http\TestSuite

.. php:trait:: HttpClientTrait

Em testes, você frequentemente desejará criar respostas simuladas para APIs externas. Você pode
usar o ``HttpClientTrait`` para definir respostas para as requisições que sua aplicação
está fazendo::

    use Cake\Http\TestSuite\HttpClientTrait;
    use Cake\TestSuite\TestCase;

    class CartControllerTests extends TestCase
    {
        use HttpClientTrait;

        public function testCheckout()
        {
            // Simular uma requisição POST que será feita.
            $this->mockClientPost(
                'https://example.com/process-payment',
                $this->newClientResponse(200, [], json_encode(['ok' => true]))
            );
            $this->post("/cart/checkout");
            // Fazer asserções.
        }
    }

Existem métodos para simular os métodos HTTP mais comumente usados::

    $this->mockClientGet(/* ... */);
    $this->mockClientPatch(/* ... */);
    $this->mockClientPost(/* ... */);
    $this->mockClientPut(/* ... */);
    $this->mockClientDelete(/* ... */);

.. php:method:: newClientResponse(int $code = 200, array $headers = [], string $body = '')

Como visto acima, você pode usar o método ``newClientResponse()`` para criar respostas
para as requisições que sua aplicação fará. Os cabeçalhos precisam ser uma lista de
strings::

    $headers = [
        'Content-Type: application/json',
        'Connection: close',
    ];
    $response = $this->newClientResponse(200, $headers, $body)

.. meta::
    :title lang=pt: HttpClient
    :keywords lang=pt: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results
