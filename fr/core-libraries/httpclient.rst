Client Http
###########

.. php:namespace:: Cake\Http

.. php:class:: Client(mixed $config = [])

CakePHP intègre un client HTTP basique mais puissant qui peut être utilisé pour
faire des requêtes. C'est un bon moyen de communiquer avec des services webs et
des APIs distantes.

.. versionchanged:: 3.3.0
    Avant 3.3.0, vous devez utiliser ``Cake\Network\Http\Client``.

Faire des Requêtes
==================

Faire des requêtes est simple et direct. Faire une requête GET ressemble à
ceci::

    use Cake\Network\Http\Client;

    $http = new Client();

    // Simple GET
    $response = $http->get('http://example.com/test.html');

    // Simple GET avec querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // Simple GET avec querystring & headers supplémentaires
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest']
    ]);

Faire des requêtes POST et PUT est également simple::

    // Envoi d'une requête POST avec des données encodées application/x-www-form-urlencoded
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Envoi d'une requête PUT avec des données encodées application/x-www-form-urlencoded
    $response = $http->put('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Autres méthodes.
    $http->delete(...);
    $http->head(...);
    $http->patch(...);

Créer des Requêtes Multipart avec des Fichiers
==============================================

Vous pouvez inclure des fichiers dans des corps de requête en incluant un
gestionnaire de fichier dans le tableau de données::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => fopen('/path/to/a/file', 'r'),
    ]);

Le gestionnaire de fichiers sera lu jusqu'à sa fin, il ne sera pas rembobiné
avant d'être lu.

.. warning::

    Pour des raisons de compatibilité, les chaînes commençant par ``@`` seront
    considérées comme locales ou des chemins de fichier d'un dépôt.

Cette fonctionnalité est dépréciée depuis CakePHP 3.0.5 et sera retirée dans une
version future. Avant que cela n'arrive, les données d'utilisateur passées
au Client Http devront être nettoyées comme suit::

    $response = $http->post('http://example.com/api', [
        'search' => ltrim($this->request->getData('search'), '@'),
    ]);

S'il est nécessaire de garder les caractères du début ``@`` dans les chaînes
de la requête, vous pouvez passer une chaîne de requête pré-encodée avec
``http_build_query()``::

    $response = $http->post('http://example.com/api', http_build_query([
        'search' => $this->request->getData('search'),
    ]));

Construire des Corps de Requête Multipart à la Main
---------------------------------------------------

Il peut arriver que vous souhaitiez construire un corps de requête d'une
façon très spécifique. Dans ces situations, vous pouvez utiliser
``Cake\Network\Http\FormData`` pour fabriquer la requête HTTP multipart
spécifique que vous souhaitez::

    use Cake\Network\Http\FormData;

    $data = new FormData();

    // Création d'une partie XML
    $xml = $data->newPart('xml', $xmlString);
    // Définit le type de contenu.
    $xml->type('application/xml');
    $data->add($xml);

    // Création d'un fichier upload avec addFile()
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

Lorsque vous utilisez des REST API, vous avez souvent besoin d'envoyer des corps
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
chaîne de caractères. Si vous faîtes une requête GET qui a besoin des deux
paramètres querystring et d'un corps de requête, vous pouvez faire comme ce
qui suit::

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
  pour déléguer à une stratégie d'authentification. Par défaut l'Auth Basic est
  utilisée.
- ``ssl_verify_peer`` - par défaut à ``true``. Définie à ``false`` pour
  désactiver la certification SSL (non recommandé)
- ``ssl_verify_peer_name`` - par défaut à ``true``. Définie à ``false`` pour
  désactiver la vérification du nom d'hôte quand lors des vérifications des
  certificats  SSL (non recommandé).
- ``ssl_verify_depth`` - par défaut à 5. Depth to traverse in the CA chain.
- ``ssl_verify_host`` - par défaut à ``true``. Valide le certificat SSL pour un
  nom d'hôte.
- ``ssl_cafile`` - par défaut pour construire dans cafile. Ecrasez-le pour
  utiliser des bundles CA personnalisés.
- ``timeout`` - Durée d'attente avant le timing out en secondes.
- ``type`` - Envoi un corps de requête dans un type de contenu personnalisé.
  Nécessite que ``$data`` soit une chaîne ou que l'option ``_content`` soit
  définie quand vous faîtes des requêtes GET.
- ``redirect`` - Nombre de redirections à suivre. ``false`` par défaut.

Le paramètre options est toujours le 3ème paramètre dans chaque méthode HTTP.
Elles peuvent aussi être utilisées en construisant ``Client`` pour créer des
:ref:`clients scoped <http_client_scoped_client>`.

Authentification
================

``Cake\Http\Client`` intègre plusieurs systèmes d'authentification. Les
différentes stratégies d'authentification peuvent être ajoutées par les
développeurs. Les stratégies d'Authentification sont appelées avant que la
requête ne soit envoyée, et permettent aux headers d'être ajoutés au contexte de
la requête.

Utiliser l'Authentication Basic
-------------------------------

Un exemple simple d'authentification::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'mark', 'password' => 'secret']
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
        'username' => 'mark',
        'password' => 'secret',
        'realm' => 'myrealm',
        'nonce' => 'onetimevalue',
        'qop' => 1,
        'opaque' => 'someval'
      ]
    ]);

En configurant la clé 'type' à 'digest', vous dîtes au sous-système
d'authentification d'utiliser l'authentification digest.

Authentification OAuth 1
------------------------

Plusieurs services web modernes nécessitent une authentication OAuth pour
accéder à leur API. L'authentification OAuth inclue suppose que vous ayez
déjà votre clé de consommateur et un secret de consommateur::

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

Authentification OAuth 2
------------------------

Il n'y a pas d'adapteur d'authentification spécialisé car OAuth2 est souvent
un simple entête. A la place, vous pouvez créer un client avec le token
d'accès::

    $http = new Client([
        'headers' => ['Authorization' => 'Bearer ' . $accessToken]
    ]);
    $response = $http->get('https://example.com/api/profile/1');

Authentification Proxy
----------------------

Certains proxies ont besoin d'une authentification pour les utiliser.
Généralement cette authentification est Basic, mais elle peut être implémentée
par un adaptateur d'authentification. Par défaut, Http\\Client va supposer
une authentification Basic, à moins que la clé type ne soit définie::

    $http = new Client();
    $response = $http->get('http://example.com/test.php', [], [
      'proxy' => [
        'username' => 'mark',
        'password' => 'testing',
        'proxy' => '127.0.0.1:8080',
      ]
    ]);

Le deuxième paramètre du proxy doit être une chaîne avec une IP ou un domaine
sans protocole. Le nom d'utilisateur et le mot de passe seront passés dans
les en-têtes de la requête, alors que la chaîne du proxy sera passée dans
`stream_context_create()
<http://php.net/manual/en/function.stream-context-create.php>`_.

.. _http_client_scoped_client:

Créer des Scoped Clients
========================

Devoir retaper le nom de domaine, les paramètres d'authentification et de proxy
peut devenir fastidieux et source d'erreurs. Pour réduire ce risque d'erreur et
être moins pénible, vous pouvez créer des clients scoped::

    // Création d'un client scoped.
    $http = new Client([
      'host' => 'api.example.com',
      'scheme' => 'https',
      'auth' => ['username' => 'mark', 'password' => 'testing']
    ]);

    // Faire une requête vers api.example.com
    $response = $http->get('/test.php');

Les informations suivantes peuvent être utilisées lors de la création d'un
client scoped:

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

Chacune de ces options peut être remplacées en les spécifiant quand vous
faîtes des requêtes.
host, scheme, proxy, port sont remplacées dans l'URL de la requête::

    // Utilisation du client scoped que nous avons créé précédemment.
    $response = $http->get('http://foo.com/test.php');

Ce qui est au-dessus va remplacer le domaine, le scheme, et le port. Cependant,
cette requête va continuer à utiliser toutes les autres options définies quand
le client scoped a été créé. Consultez :ref:`http_client_request_options`
pour plus d'informations sur les options intégrées.

Configurer et Gérer les Cookies
===============================

Http\\Client peut aussi accepter les cookies quand on fait des requêtes. En plus
d'accepter les cookies, il va aussi automatiquement stocker les cookies valides
définis dans les responses. Toute response avec des cookies, les verra
stockés dans l'instance d'origine de Http\\Client. Les cookies stockés dans une
instance Client sont automatiquement inclus dans les futures requêtes vers
le domaine + combinaisons de chemin qui correspondent::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Création d'une requête qui définit des cookies
    $response = $http->get('/');

    // Cookies à partir de la première requête seront inclus par défaut.
    $response2 = $http->get('/changelogs');

Vous pouvez toujours remplacer les cookies auto-inclus en les définissant dans
les paramètres ``$options`` de la requête::

    // Personalisation d'un cookie existant.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc']
    ]);

.. _httpclient-response-objects:

Objets Response
===============

.. php:namespace:: Cake\Http\Client

.. php:class:: Response

Les objets Response ont un certain nombre de méthodes pour parcourir les données
de réponse.

.. versionchanged:: 3.3.0
    Depuis la version 3.3.0 ``Cake\Http\Client\Response`` implémente
    `PSR7 ResponseInterface
    <http://www.php-fig.org/psr/psr-7/#3-3-psr-http-message-responseinterface>`__.


Lire des Corps des Réponses
---------------------------

Vous pouvez lire le corps entier de la réponse en chaîne de caractères::

    // Lit le corps entier de la réponse en chaîne de caractères.
    $response->body();

    // En propriété
    $response->body;

Vous pouvez aussi accéder à l'objet stream de la réponse et utilisez ses
méthodes::

    // Récupère une Psr\Http\Message\StreamInterface contenant le corps de la réponse
    $stream = $response->getBody();

    // Lit un stream de 100 bytes en une fois.
    while (!$stream->eof()) {
        echo $stream->read(100);
    }

.. _http-client-xml-json:

Lire des Corps de Réponse JSON et XML
-------------------------------------

Puisque les réponses JSON et XML sont souvent utilisées, les objets response
fournissent une utilisation facile d'accéder à la lecture des données décodées.
Les données JSON dans un tableau, alors que les données XML sont décodées dans
un arbre ``SimpleXMLElement``::

    // Récupération du XML.
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->xml;

    // Récupération du JSON.
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->json;

Les données de réponse décodées sont stockées dans l'objet response, donc y
accéder de nombreuses fois n'augmente pas la charge.

Accéder aux En-têtes de la Réponse
----------------------------------

Vous pouvez accéder aux en-têtes de différentes manières. Les noms de l'en-tête
sont toujours traités avec des valeurs sensibles à la casse quand vous y accédez
avec les méthodes::

    // Récupère les en-têtes sous la forme d'un tableau associatif array.
    $response->getHeaders();

    // Récupère un en-tête unique sous la forme d'un tableau.
    $response->getHeader('content-type');

    // Récupère un en-tête sous la forme d'une chaîne de caractères
    $response->getHeaderLine('content-type');

    // Récupère la réponse encodée
    $response->getEncoding();

    // Récupère un tableau de key=>value pour tous les en-têtes
    $response->headers;

Accéder aux données de Cookie
-----------------------------

Vous pouvez lire les cookies avec différentes méthodes selon le nombre de
données que vous souhaitez sur les cookies::

    // Récupère tous les cookies (toutes les données)
    $response->getCookies();

    // Récupère une valeur d'une unique cookie.
    $response->getCookie('session_id');

    // Récupère les données complètes pour un unique cookie
    // includes value, expires, path, httponly, secure keys.
    $response->getCookieData('session_id');

    // Accède aux données complètes pour tous les cookies.
    $response->cookies;

Vérifier le Code de statut
--------------------------

Les objets Response fournissent quelques méthodes pour vérifier les codes de
statuts::

    // La réponse était-elle 20x
    $response->isOk();

    // La réponse était-elle 30x
    $response->isRedirect();

    // Récupère le code de statut
    $response->getStatusCode();

    // helper __get()
    $response->code;

.. meta::
    :title lang=fr: HttpClient
    :keywords lang=fr: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results
