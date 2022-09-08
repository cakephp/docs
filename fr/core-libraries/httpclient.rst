Client Http
###########

.. php:namespace:: Cake\Http

.. php:class:: Client(mixed $config = [])

CakePHP intègre un client HTTP basique respectant le standard PSR-18, que vous
pouvez utiliser pour faire des requêtes. C'est un bon moyen de communiquer avec
des services webs et des APIs distantes.

Faire des Requêtes
==================

Faire des requêtes est simple et direct. Faire une requête GET ressemble à
ceci::

    use Cake\Http\Client;

    $http = new Client();

    // Simple GET
    $response = $http->get('http://example.com/test.html');

    // Simple GET avec querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // Simple GET avec querystring & headers supplémentaires
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest']
    ]);

Faire des requêtes POST et PUT est tout aussi simple::

    // Envoi d'une requête POST avec des données encodées en application/x-www-form-urlencoded
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Envoi d'une requête PUT avec des données encodées en application/x-www-form-urlencoded
    $response = $http->put('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Autres méthodes.
    $http->delete(...);
    $http->head(...);
    $http->patch(...);

Si vous avez créé un objet de requêtes PSR-7, vous pouvez l'envoyer avec
``sendRequest()``::

    use Cake\Http\Client;
    use Cake\Http\Client\Request as ClientRequest;

    $request = new ClientRequest(
        'http://example.com/search',
        ClientRequest::METHOD_GET
    );
    $client = new Client();
    $response = $client->sendRequest($request);

Créer des Requêtes Multipart avec des Fichiers
==============================================

Vous pouvez inclure des fichiers dans des corps de requête en incluant un
gestionnaire de fichier dans le tableau de données::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => fopen('/path/to/a/file', 'r'),
    ]);

Le gestionnaire de fichiers sera lu jusqu'à sa fin; il ne sera pas rembobiné
avant d'être lu.

Construire des Corps de Requête Multipart
-----------------------------------------

Il peut arriver que vous souhaitiez construire un corps de requête d'une
façon très spécifique. Dans ces situations, vous pouvez utiliser
``Cake\Http\Client\FormData`` pour fabriquer la requête HTTP multipart
spécifique que vous souhaitez::

    use Cake\Http\Client\FormData;

    $data = new FormData();

    // Création d'une partie XML
    $xml = $data->newPart('xml', $xmlString);
    // Définit le type de contenu.
    $xml->type('application/xml');
    $data->add($xml);

    // Création d'un upload de fichier avec addFile()
    // Ceci va aussi ajouter le fichier aux données du formulaire.
    $file = $data->addFile('upload', fopen('/some/file.txt', 'r'));
    $file->contentId('abc123');
    $file->disposition('attachment');

    // Envoi de la requête.
    $response = $http->post(
        'http://example.com/api',
        (string)$data,
        ['headers' => ['Content-Type' => $data->contentType()]]
    );

Envoyer des Corps de Requête
============================

Lorsque vous utilisez des API REST, vous avez souvent besoin d'envoyer des corps
de requête qui ne sont pas encodés. Http\\Client le permet grâce à l'option
type::

    // Envoi d'un body JSON.
    $http = new Client();
    $response = $http->post(
      'http://example.com/tasks',
      json_encode($data),
      ['type' => 'json']
    );

La clé ``type`` peut être soit 'json', soit 'xml' ou bien un mime type complet.
Quand vous utilisez l'option ``type``, vous devrez fournir les données en
chaîne de caractères. Si vous faites une requête GET qui a besoin à la fois de
paramètres querystring et d'un corps de requête, vous pouvez faire ceci::

    // Envoi d'un body JSON dans une requête GET avec des paramètres query string.
    $http = new Client();
    $response = $http->get(
      'http://example.com/tasks',
      ['q' => 'test', '_content' => json_encode($data)],
      ['type' => 'json']
    );

.. _http_client_request_options:

Options de la Méthode Request
=============================

Chaque méthode HTTP prend un paramètre ``$options`` qui est utilisé pour fournir
des informations de requête supplémentaires. les clés suivantes peuvent être
utilisées dans ``$options``:

- ``headers`` - Tableau de headers supplémentaires
- ``cookie`` - Tableau de cookies à utiliser.
- ``proxy`` - Tableau d'informations proxy.
- ``auth`` - Tableau de données d'authentification, la clé ``type`` est utilisée
  pour déléguer à une stratégie d'authentification. Par défaut c'est
  l'authentification Basic qui est utilisée.
- ``ssl_verify_peer`` - par défaut à ``true``. Définie à ``false`` pour
  désactiver la certification SSL (non recommandé)
- ``ssl_verify_peer_name`` - par défaut à ``true``. Définie à ``false`` pour
  désactiver la vérification du nom d'hôte lors des vérifications des
  certificats  SSL (non recommandé).
- ``ssl_verify_depth`` - par défaut à 5. Profondeur de recherche dans la chaîne
  des autorités de certification (CA).
- ``ssl_verify_host`` - par défaut à ``true``. Valide le certificat SSL au
  regard du nom d'hôte.
- ``ssl_cafile`` - par défaut le fichier d'autorités de certification intégré.
  Définissez cette option manuellement pour utiliser des autorités de
  certification personnalisées.
- ``timeout`` - Durée d'attente maximale en secondes.
- ``type`` - Envoie un corps de requête dans un type de contenu personnalisé.
  Nécessite que ``$data`` soit une chaîne ou que l'option ``_content`` soit
  définie quand vous faites des requêtes GET.
- ``redirect`` - Nombre de redirections à suivre. ``false`` par défaut.
- ``curl`` - Un tableau d'option supplémentaires pour curl (si l'adaptateur curl
  est utilisé). Par exemple ``[CURLOPT_SSLKEY => 'key.pem']``.

Le paramètre options est toujours le 3ème paramètre dans chaque méthode HTTP.
Elles peuvent aussi être utilisées en construisant ``Client`` pour créer des
:ref:`clients scoped <http_client_scoped_client>`.

Authentification
================

``Cake\Http\Client`` supporte quelques systèmes d'authentification différents.
Des stratégies d'authentification différentes peuvent être ajoutées par les
développeurs. Les stratégies d'authentification sont appelées avant que la
requête ne soit envoyée, et d'ajouter les headers au contexte de la requête.

Utiliser l'Authentication Basic
-------------------------------

Un exemple simple d'authentification::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'marc', 'password' => 'secret']
    ]);

Par défaut ``Cake\Http\Client`` va utiliser l'authentification basic s'il n'y a
pas de clé ``'type'`` dans l'option auth.

Utiliser l'Authentification Digest
----------------------------------

Un exemple simple d'authentification::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'digest',
        'username' => 'marc',
        'password' => 'secret',
        'realm' => 'myrealm',
        'nonce' => 'valeurunique',
        'qop' => 1,
        'opaque' => 'unevaleur'
      ]
    ]);

En configurant la clé 'type' à 'digest', vous dites au sous-système
d'authentification d'utiliser l'authentification digest.

Authentification OAuth 1
------------------------

Plusieurs services web modernes nécessitent une authentication OAuth pour
accéder à leur API. L'authentification OAuth incluse suppose que vous ayez
déjà votre clé de consommateur et un secret de consommateur::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'oauth',
        'consumerKey' => 'grandeclé',
        'consumerSecret' => 'secret',
        'token' => '...',
        'tokenSecret' => '...',
        'realm' => 'tickets',
      ]
    ]);

Authentification OAuth 2
------------------------

Il n'y a pas d'adapteur d'authentification spécialisé car OAuth2 est souvent
un simple en-tête. À la place, vous pouvez créer un client avec le token
d'accès::

    $http = new Client([
        'headers' => ['Authorization' => 'Bearer ' . $accessToken]
    ]);
    $response = $http->get('https://example.com/api/profile/1');

Authentification Proxy
----------------------

Certains proxies ont besoin d'une authentification pour les utiliser.
Généralement cette authentification est Basic, mais elle peut être implémentée
par n'importe quel adaptateur d'authentification. Par défaut, Http\\Client va supposer
une authentification Basic, à moins que la clé type ne soit définie::

    $http = new Client();
    $response = $http->get('http://example.com/test.php', [], [
      'proxy' => [
        'username' => 'marc',
        'password' => 'testing',
        'proxy' => '127.0.0.1:8080',
      ]
    ]);

Le deuxième paramètre du proxy doit être une chaîne avec une IP ou un domaine
sans protocole. Le nom d'utilisateur et le mot de passe seront passés dans
les en-têtes de la requête, alors que la chaîne du proxy sera passée dans
`stream_context_create()
<https://php.net/manual/en/function.stream-context-create.php>`_.

.. _http_client_scoped_client:

Créer des Clients Délimités (Scoped Clients)
============================================

Devoir retaper le nom de domaine, les paramètres d'authentification et de proxy
peut devenir fastidieux et source d'erreurs. Pour réduire ce risque d'erreur et
rendre l'exercice moins pénible, vous pouvez créer des clients délimités::

    // Création d'un client délimité.
    $http = new Client([
      'host' => 'api.example.com',
      'scheme' => 'https',
      'auth' => ['username' => 'marc', 'password' => 'testing']
    ]);

    // Faire une requête vers api.example.com
    $response = $http->get('/test.php');

Si votre client délimité a seulement besoin d'informations sur l'URL, vous
pouvez utiliser ``createFromUrl()``::

    $http = Client::createFromUrl('https://api.example.com/v1/test');

Le code ci-dessus crée une instance client avec les options ``protocol``,
``host``, et ``basePath`` déjà définies.

Les informations suivantes peuvent être utilisées lors de la création d'un
client délimité:

* host
* basepath
* scheme
* proxy
* auth
* port
* cookies
* timeout
* ssl_verify_peer
* ssl_verify_depth
* ssl_verify_host

Chacune de ces options peut être remplacée en les spécifiant quand vous faites
des requêtes.
host, scheme, proxy, port sont remplacées dans l'URL de la requête::

    // Utilisation du client délimité que nous avons créé précédemment.
    $response = $http->get('http://foo.com/test.php');

Le code ci-dessus va remplacer le domaine, le scheme, et le port. Cependant,
cette requête va continuer à utiliser toutes les autres options définies quand
le client délimité a été créé. Consultez :ref:`http_client_request_options`
pour plus d'informations sur les options intégrées.

.. versionadded:: 4.2.0
    ``Client::createFromUrl()`` a été ajoutée.

.. versionchanged:: 4.2.0
    L'option ``basePath`` a été ajoutée.

Configurer et Gérer les Cookies
===============================

Http\\Client peut aussi accepter les cookies quand on fait des requêtes. En plus
d'accepter les cookies, il va aussi automatiquement stocker les cookies valides
définis dans les réponses. À chaque réponse avec des cookies, ceux-ci seront
stockés dans l'instance d'origine de Http\\Client. Les cookies stockés dans une
instance Client sont automatiquement inclus dans les futures requêtes qui
correspondent au domaine + chemin::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Création d'une requête qui définit des cookies
    $response = $http->get('/');

    // Les cookies de la première requête seront inclus par défaut.
    $response2 = $http->get('/changelogs');

Vous pouvez toujours remplacer les cookies auto-inclus en les définissant dans
les paramètres ``$options`` de la requête::

    // Remplacement d'un cookie existant par une valeur personnalisée.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc']
    ]);

Vous pouvez ajouter des cookies au client après l'avoir créé en utilisant la méthode
``addCookie()``::

    use Cake\Http\Cookie\Cookie;

    $http = new Client([
        'host' => 'cakephp.org'
    ]);
    $http->addCookie(new Cookie('session', 'abc123'));

.. _httpclient-response-objects:

Objets Response
===============

.. php:namespace:: Cake\Http\Client

.. php:class:: Response

Les objets Response ont un certain nombre de méthodes pour parcourir les données
de réponse.

Lire les Corps des Réponses
---------------------------

Vous pouvez lire le corps entier de la réponse en chaîne de caractères::

    // Lit le corps entier de la réponse en chaîne de caractères.
    $response->getStringBody();

Vous pouvez aussi accéder à l'objet stream de la réponse et utiliser ses
méthodes::

    // Récupère une Psr\Http\Message\StreamInterface contenant le corps de la réponse
    $stream = $response->getBody();

    // Lit un stream par blocs de 100 bytes.
    while (!$stream->eof()) {
        echo $stream->read(100);
    }

.. _http-client-xml-json:

Lire des Corps de Réponse JSON et XML
-------------------------------------

Puisque les réponses JSON et XML sont souvent utilisées, les objets response
fournissent des accesseurs pour lire les données décodées.
Les données JSON décodées sont fournies sous forme de tableau, tandis que les
données XML sont décodées en un arbre ``SimpleXMLElement``::

    // Récupération du XML.
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->getXml();

    // Récupération du JSON.
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->getJson();

Les données de réponse décodées sont stockées dans l'objet response, donc y
accéder plusieurs fois n'augmente pas la charge.

Accéder aux En-têtes de la Réponse
----------------------------------

Vous pouvez accéder aux en-têtes de différentes manières. Les noms de l'en-tête
sont toujours traités comme des valeurs sensibles à la casse quand vous y
accédez par une méthode::

    // Récupère les en-têtes sous la forme d'un tableau associatif.
    $response->getHeaders();

    // Récupère un en-tête unique sous la forme d'un tableau.
    $response->getHeader('content-type');

    // Récupère un en-tête sous la forme d'une chaîne de caractères
    $response->getHeaderLine('content-type');

    // Récupère l'encodage de la réponse
    $response->getEncoding();

Accéder aux Données des Cookies
-------------------------------

Vous pouvez lire les cookies avec différentes méthodes selon la quantité de
données que vous souhaitez sur les cookies::

    // Récupère tous les cookies (toutes les données)
    $response->getCookies();

    // Récupère une valeur d'un cookie unique.
    $response->getCookie('session_id');

    // Récupère les données complètes pour un unique cookie
    // includes value, expires, path, httponly, secure keys.
    $response->getCookieData('session_id');

Vérifier le Code de Statut
--------------------------

Les objets Response fournissent quelques méthodes pour vérifier les codes de
statuts::

    // La réponse était-elle 20x
    $response->isOk();

    // La réponse était-elle 30x
    $response->isRedirect();

    // Récupère le code de statut
    $response->getStatusCode();

Changer les Adaptateurs de Transport
====================================

Par défaut, ``Http\Client`` préférera utiliser un adaptateur de transport basé
sur ``curl``.
Si l'extension curl n'est pas disponible, il utilisera à la place un adaptateur
basé sur le stream.
Vous pouvez forcer la sélection d'un adaptateur de transport en utilisant une
option du constructeur::

    use Cake\Http\Client\Adapter\Stream;

    $client = new Client(['adapter' => Stream::class]);

.. _httpclient-testing:

Tests
=====

.. php:namespace:: Cake\Http\TestSuite

.. php:trait:: HttpClientTrait

Dans les tests, vous voudrez souvent créer des réponses de mocks vers des API
externes. Vous pouvez utiliser ``HttpClientTrait`` pour définir des réponses aux
requêtes faites par votre application::

    use Cake\Http\TestSuite\HttpClientTrait;
    use Cake\TestSuite\TestCase;

    class CartControllerTests extends TestCase
    {
        use HttpClientTrait;

        public function testCheckout()
        {
            // Mocker une requête POST qui sera faite.
            $this->mockClientPost(
                'https://example.com/process-payment',
                $this->newClientResponse(200, [], json_encode(['ok' => true]))
            );
            $this->post("/cart/checkout");
            // Faire des assertions.
        }
    }

Il existe des méthodes pour mocker les méthodes HTTP les plus courantes::

    $this->mockClientGet(...);
    $this->mockClientPatch(...);
    $this->mockClientPost(...);
    $this->mockClientPut(...);
    $this->mockClientDelete(...);

.. php:method:: newClientResponse(int $code = 200, array $headers = [], string $body = '')

Comme vu précédemment, vous pouvez utiliser la méthode ``newClientResponse()``
pour créer des réponses pour les requêtes que fera votre application. Les
en-têtes doivent être une liste de chaînes de caractères::

    $headers = [
        'Content-Type: application/json',
        'Connection: close',
    ];
    $response = $this->newClientResponse(200, $headers, $body)


.. versionadded:: 4.3.0

.. meta::
    :title lang=fr: HttpClient
    :keywords lang=fr: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results
