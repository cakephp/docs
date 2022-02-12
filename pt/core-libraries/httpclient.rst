Cliente Http
############

.. php:namespace:: Cake\Http

.. php:class:: Client(mixed $config = [])

O CakePHP inclui um cliente HTTP compatível com a PSR-18 que pode ser usado
para fazer solicitações. É uma ótima maneira de se comunicar com serviços da web e
APIs remotas.

Fazendo Solicitações
====================

Fazer solicitações é simples e direto. Fazer uma solicitação GET parece::

    use Cake\Http\Client;

    $http = new Client();

    // GET simples
    $response = $http->get('http://example.com/test.html');

    // GET simples com querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // GET simples com querystring & cabeçalhos adicionais
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest']
    ]);

Fazer solicitações POST e PUT é igualmente simples::

    // Envie uma solicitação POST com dados codificados em application/x-www-form-urlencoded
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Envie uma solicitação PUT com dados codificados application/x-www-form-urlencoded
    $response = $http->put('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Outros métodos também.
    $http->delete(...);
    $http->head(...);
    $http->patch(...);

Se você criou um objeto de solicitação PSR-7, pode enviá-lo usando
``sendRequest()``::

    use Cake\Http\Client;
    use Cake\Http\Client\Request as ClientRequest;

    $request = new ClientRequest(
        'http://example.com/search',
        ClientRequest::METHOD_GET
    );
    $client = new Client();
    $response = $client->sendRequest($request);

Criação de Solicitações Multipart com Arquivos
==============================================

Você pode incluir arquivos em corpos de solicitação::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => fopen('/path/to/a/file', 'r'),
    ]);

O arquivo será lido até o fim; não será rebobinado antes de ser lido.

Criação de Corpos de Solicitação de Várias Partes Manualmente
-------------------------------------------------------------

Pode haver momentos em que você precise criar um corpo de solicitação de
uma maneira muito específica. Nessas situações, você pode frequentemente usar
``Cake\Http\Client\FormData`` para criar a solicitação HTTP multipart que você deseja::

    use Cake\Http\Client\FormData;

    $data = new FormData();

    // Crie uma parte XML
    $xml = $data->newPart('xml', $xmlString);
    // Defina o tipo de conteúdo.
    $xml->type('application/xml');
    $data->add($xml);

    // Crie um upload de arquivo com addFile()
    // Isso irá anexar o arquivo aos dados do formulário também.
    $file = $data->addFile('upload', fopen('/some/file.txt', 'r'));
    $file->contentId('abc123');
    $file->disposition('attachment');

    // Envie a solicitação.
    $response = $http->post(
        'http://example.com/api',
        (string)$data,
        ['headers' => ['Content-Type' => $data->contentType()]]
    );

Enviando o Corpo da Solicitação
===============================

Ao lidar com APIs REST, você geralmente precisa enviar corpos de solicitação que
não são codificados por formulário. Http\\Cliente expõe isso através da opção de tipo::

    // Envie um corpo de solicitação JSON.
    $http = new Client();
    $response = $http->post(
      'http://example.com/tasks',
      json_encode($data),
      ['type' => 'json']
    );

A chave ``type`` pode ser 'json', 'xml' ou um tipo MIME completo.
Ao usar a opção ``type``, você deve fornecer os dados como uma string.
Se você estiver fazendo uma solicitação GET que precisa de parâmetros de
string de consulta e um corpo de solicitação, você pode fazer o seguinte::

    // Envie um corpo JSON em uma solicitação GET com parâmetros de string de consulta.
    $http = new Client();
    $response = $http->get(
      'http://example.com/tasks',
      ['q' => 'test', '_content' => json_encode($data)],
      ['type' => 'json']
    );

.. _http_client_request_options:

Opções de Método para Solicitação
=================================

Cada método HTTP leva um parâmetro ``$options`` que é usado para fornecer informações
adicionais de solicitação. As seguintes chaves podem ser usadas em ``$options``:

- ``headers`` - Matriz de cabeçalhos adicionais
- ``cookie`` - Matriz de cookies para usar.
- ``proxy`` - Matriz de informações do proxy.
- ``auth`` - Matriz de dados de autenticação, a chave ``type`` é usada para delegar a uma estratégia
  de autenticação. Por padrão, a autenticação básica é usada.
- ``ssl_verify_peer`` - o padrão é ``true``. Defina como ``false`` para desativar a
  verificação de certificação SSL (não recomendado).
- ``ssl_verify_peer_name`` - o padrão é ``true``. Defina como ``false`` para desabilitar a verificação do nome
  do host ao verificar os certificados SSL (não recomendado).
- ``ssl_verify_depth`` - o padrão é 5. Profundidade a ser percorrida na cadeia de CA.
- ``ssl_verify_host`` - o padrão é ``true``. Valide o certificado SSL em relação ao nome do host.
- ``ssl_cafile`` - o padrão é construído em cafile. Substitua para usar pacotes CA personalizados.
- ``timeout`` - Duração de espera antes de expirar em segundos.
- ``type`` - Envie um corpo de solicitação em um tipo de conteúdo personalizado. Requer que ``$data``
  seja uma string ou que a opção ``_content`` seja definida ao fazer solicitações GET.
- ``redirect`` - Número de redirecionamentos a seguir. O padrão é ``false``.

O parâmetro options é sempre o terceiro parâmetro em cada um dos métodos HTTP.
Eles também podem ser usados ao construir ``Client`` para criar :ref:`scoped clients <http_client_scoped_client>`.

Autenticação
============

``Cake\Http\Client`` suporta alguns sistemas de autenticação. Diferentes
estratégias de autenticação podem ser adicionadas pelos desenvolvedores.
As estratégias de autenticação são chamadas antes do envio da solicitação
e permitem que cabeçalhos sejam adicionados ao contexto da solicitação.

Usando Autenticação Básica
--------------------------

Um exemplo de autenticação básica::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'mark', 'password' => 'secret']
    ]);

Por padrão, o ``Cake\Http\Client`` usará a autenticação básica se não
houver uma chave ``'type'`` na opção auth.

Usando a Autenticação Digest
----------------------------

Um exemplo de autenticação básica::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'digest',
        'username' => 'mark',
        'password' => 'secret',
        'realm' => 'myrealm',
        'nonce' => 'onetimevalue',
        'qop' => 1,
        'opaque' => 'someval'
      ]
    ]);

Ao definir a chave 'type' como 'digest', você informa ao subsistema de autenticação
para usar a autenticação digest.

Autenticação OAuth 1
--------------------

Muitos serviços da web moderna exigem autenticação OAuth para acessar suas APIs.
A autenticação OAuth incluída pressupõe que você já tenha sua chave e segredo do
consumidor::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'oauth',
        'consumerKey' => 'bigkey',
        'consumerSecret' => 'secret',
        'token' => '...',
        'tokenSecret' => '...',
        'realm' => 'tickets',
      ]
    ]);

Autenticação OAuth 2
--------------------

Como OAuth2 geralmente é um único cabeçalho, não há um adaptador de
autenticação especializado. Em vez disso, você pode criar um cliente
com o token de acesso::

    $http = new Client([
        'headers' => ['Authorization' => 'Bearer ' . $accessToken]
    ]);
    $response = $http->get('https://example.com/api/profile/1');

Autenticação no Proxy
---------------------

Alguns proxies requerem autenticação para serem usados. Geralmente, essa
autenticação é Básica, mas pode ser implementada por qualquer adaptador
de autenticação. Por padrão, o Http\\Client assumirá a autenticação Básica,
a menos que a chave de tipo seja definida::

    $http = new Client();
    $response = $http->get('http://example.com/test.php', [], [
      'proxy' => [
        'username' => 'mark',
        'password' => 'testing',
        'proxy' => '127.0.0.1:8080',
      ]
    ]);

O segundo parâmetro de proxy deve ser uma string com um IP ou um domínio
sem protocolo. As informações de nome de usuário e senha serão passadas
pelos cabeçalhos da solicitação, enquanto a string do proxy será passada
por `stream_context_create()
<https://php.net/manual/en/function.stream-context-create.php>`_.

.. _http_client_scoped_client:

Criação de Clientes com Escopo
==============================

Ter que redigitar o nome de domínio, as configurações de autenticação e
proxy pode se tornar tedioso e sujeito a erros. Para reduzir a chance de
erro e aliviar um pouco do tédio, você pode criar clientes com escopo::

    // Crie um cliente com escopo definido.
    $http = new Client([
      'host' => 'api.example.com',
      'scheme' => 'https',
      'auth' => ['username' => 'mark', 'password' => 'testing']
    ]);

    // Faça uma solicitação para api.example.com
    $response = $http->get('/test.php');

As seguintes informações podem ser usadas ao criar um cliente com escopo:

* host
* scheme
* proxy
* auth
* port
* cookies
* timeout
* ssl_verify_peer
* ssl_verify_depth
* ssl_verify_host

Qualquer uma dessas opções pode ser substituída, especificando-as ao fazer
solicitações. host, scheme, proxy, port são substituídos no URL do pedido::

    // Usando o cliente com escopo criado anteriormente.
    $response = $http->get('http://foo.com/test.php');

O exemplo acima irá substituir o domínio, esquema e porta. No entanto, essa solicitação
continuará usando todas as outras opções definidas quando o cliente com escopo foi criado.
Veja :ref:`http_client_request_options` para mais informações sobre as opções suportadas.

Configuração e Gerenciamento de Cookies
=======================================

Http\\Client também pode aceitar cookies ao fazer solicitações.
Além de aceitar cookies, ele também armazenará automaticamente
cookies válidos definidos nas respostas. Qualquer resposta com
cookies, os terá armazenados na instância de origem do Http\\Client.
Os cookies armazenados em uma instância do cliente são incluídos
automaticamente em solicitações futuras para combinações de
domínio + caminho que corresponderem::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Faça uma solicitação que defina alguns cookies
    $response = $http->get('/');

    // Os cookies da primeira solicitação serão incluídos
    // por padrão.
    $response2 = $http->get('/changelogs');

Você sempre pode substituir os cookies incluídos automaticamente,
definindo-os nos parâmetros ``$options`` da solicitação::

    // Substitua um cookie armazenado por um valor personalizado.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc']
    ]);

Você pode adicionar objetos de cookie ao cliente após criá-lo
usando o método ``addCookie()``::

    use Cake\Http\Cookie\Cookie;

    $http = new Client([
        'host' => 'cakephp.org'
    ]);
    $http->addCookie(new Cookie('session', 'abc123'));

.. _httpclient-response-objects:

Objetos de Resposta
===================

.. php:namespace:: Cake\Http\Client

.. php:class:: Response

Os objetos de resposta têm vários métodos para inspecionar os dados recebidos.

Leitura do Corpo da Resposta
----------------------------

Você lê todo o corpo da resposta como uma string::

    // Leia toda a resposta como uma string.
    $response->getStringBody();

Você também pode acessar o objeto stream para a resposta e usar seus métodos::

    // Obtêm um Psr\Http\Message\StreamInterface contendo o corpo da resposta
    $stream = $response->getBody();

    // Leia um fluxo de 100 bytes por vez.
    while (!$stream->eof()) {
        echo $stream->read(100);
    }

.. _http-client-xml-json:

Lendo Corpo de Respostas JSON e XML
-----------------------------------

Como as respostas JSON e XML são comumente usadas, os objetos de resposta
fornecem acessores fáceis de usar para ler dados decodificados. Os dados
JSON são decodificados em uma matriz, enquanto os dados XML são decodificados
em uma árvore ``SimpleXMLElement``::

    // Obtêm algum XML
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->getXml();

    // Obtêm algum JSON
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->getJson();

Os dados de resposta decodificados são armazenados no objeto de resposta,
portanto, acessá-lo várias vezes não tem custo adicional.

Acessando Cabeçalhos da Resposta
--------------------------------

Você pode acessar os cabeçalhos por meio de alguns métodos diferentes. Os nomes
dos cabeçalhos são sempre tratados como valores que não diferenciam maiúsculas
de minúsculas ao acessá-los por meio de métodos::

    // Obtenha todos os cabeçalhos como uma matriz associativa.
    $response->getHeaders();

    // Obtenha um único cabeçalho como uma matriz.
    $response->getHeader('content-type');

    // Obtenha um cabeçalho como uma string
    $response->getHeaderLine('content-type');

    // Obtenha a codificação da resposta
    $response->getEncoding();

Acessando Dados do Cookie
-------------------------

Você pode ler os cookies com alguns métodos diferentes,
dependendo de quantos dados você precisa sobre os cookies::

    // Obtenha todos os cookies (dados completos)
    $response->getCookies();

    // Obtenha o valor de um único cookie.
    $response->getCookie('session_id');

    // Obtenha os dados completos para um único cookie,
    // incluindo valor, expiração, caminho, httponly, chaves seguras.
    $response->getCookieData('session_id');

Verificando o Código de Status
------------------------------

Os objetos de resposta fornecem alguns métodos para verificar os códigos de status::

    // A resposta foi 20x
    $response->isOk();

    // A resposta foi 30x
    $response->isRedirect();

    // Obtenha o código de status
    $response->getStatusCode();

Alteração de Adaptadores de Transporte
======================================

Por padrão, o ``Http\Client`` irá preferir usar um adaptador de transporte
baseado em ``curl``. Se a extensão curl não estiver disponível, um adaptador
baseado em fluxo será usado. Você pode forçar a seleção de um adaptador de
transporte usando uma opção de construtor::

    use Cake\Http\Client\Adapter\Stream;

    $client = new Client(['adapter' => Stream::class]);

.. meta::
    :title lang=pt: Cliente Http
    :keywords lang=pt: nome de matriz,dados de matriz,parametros de consulta,string de consulta,classe php,teste de tipo,string de dado,google,consulta de resultados,webservices,apis,parametros,cakephp,metodos,pesquisando resultados
