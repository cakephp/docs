Http Client
###########

.. php:namespace:: Cake\Network\Http

.. php:class:: Client(mixed $config = [])

CakePHP intègre un client HTTP basique mais puissant qui peut facilement être
utilisé pour faire des requêtes. C'est un bon moyen de communiquer avec des
services webs et des APIs distantes.

Faire des Requêtes
==================

Faire des requêtes est simple et direct. Faire une requête get ressemble à ceci::

    use Cake\Network\Http\Client;

    $http = new Client();

    // Simple get
    $response = $http->get('http://example.com/test.html');

    // Simple get avec querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // Simple get avec querystring & headers supplémentaires
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest']
    ]);

Faire des requêtes post et put est également simple::

    // Envoie une requête POST avec des données encodées application/x-www-form-urlencoded
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Envoie une requête PUT avec des données encodées application/x-www-form-urlencoded
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

Vous pouvez inclure des fichiers dans des corps de requête en les incluant
dans le tableau de données::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => '@/path/to/a/file',
      'logo' => $fileHandle
    ]);

En préfixant les valeurs des données par ``@`` ou en inclluant un gestionnaire
de fichier dans les données. Si un gestionnaire de fichier est utilisé, le
gestionnaire de fichier sera lu jusqu'à sa fin, il ne sera pas rembobiné avant
d'être lu.

Envoyer des Corps de Requête
============================

Lorsque vous utilisez des REST API, vous avez souvent besoin d'envoyer des corps
de requête qui ne sont pas encodés. Http\\Client le permet grâce à l'option
type::

    // Send a JSON request body.
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

    // Envoi d'un corps JSON dans une requête GET avec des paramètres query string.
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
  pour déleguer à une stratégie d'authentification. Par défaut l'Auth Basic est
  utilisée.
- ``ssl_verify_peer`` - par défaut à true. Définie à false pour désactiver
  la certification SSL (non conseillé)
- ``ssl_verify_depth`` - par défaut à 5. Depth to traverse in the CA chain.
- ``ssl_verify_host`` - par défaut à true. Valide le certificat SSL pour un nom d'hôte.
- ``ssl_cafile`` - par défaut pour construire dans cafile. Overwrite to use custom CA bundles.
- ``timeout`` - Durée d'attente avant timing out.
- ``type`` - Envoi un corps de requête dans un type de contenu personnalisé.
  Nécessite que ``$data`` soit une chaîne ou que l'option ``_content`` soit
  définie quand vous faîtes des requêtes GET.

Le paramètre options est toujours le 3ème paramètre dans chaque méthode HTTP.
Elles peuvent aussi être utilisées en construisant ``Client`` pour créer des
:ref:`scoped clients <http_client_scoped_client>`.

Authentification
================

Http\\Client intègre plusieurs systèmes d'authentification. Les différentes
stratégies d'authentification peuvent être ajoutées par les développeurs.
Les stratégies d'Authentification sont appelées avant que la requête ne soit
envoyée, et permettent aux headers d'être ajoutés au contexte de la requête.

Utiliser l'Authentication Basic
-------------------------------

Un exemple simple d'authentification::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'mark', 'password' => 'secret']
    ]);

Par défaut Http\\Client va utiliser l'authentification basic si il n'y a pas
de clé ``'type'`` dans l'option auth.


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
        'port' => 12345,
      ]
    ]);

.. _http_client_scoped_client:

Créer des Scoped Clients
========================

Devoir retaper le nom de domaine, les paramètres d'authentification et de proxy
peut devenir fastidieux et source d'erreurs. Pour réduire ce risque d'erreur et
être moins pénible, vous pouvez créer des clients scoped::

    // Créé un client scoped.
    $http = new Client([
      'host' => 'api.example.com',
      'scheme' => 'https',
      'auth' => ['username' => 'mark', 'password' => 'testing']
    ]);

    // Fait une requête vers api.example.com
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

    // Utiliser le client scoped que nous avons créé précédemment.
    $response = $http->get('http://foo.com/test.php');

Ce qui est au-dessus va remplacer le domaine, le scheme, et le port. Cependant,
cette requête va continuer à utiliser toutes les autres options définies quand
le client scoped a été créé. Regardez :ref:`http_client_request_options`
pour plus d'informations sur les options intégrées.


Configurer et Gérer les Cookies
===============================

Http\\Client peut aussi accepter les cookies quand on fait des requêtes. En plus
d'accepter les cookies, il va aussi automatiquement stocker les cookies valides
définis dans les responses. Toute response avec des cookies, les verra
stockés dans l'instance d'origne de Http\\Client. Les cookies stockés dans une
instance Client sont automatiquement inclus dans les futures requêtes vers
le domaine + combinaisons de chemin qui correspondent::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Faire une requête qui définit des cookies
    $response = $http->get('/');

    // Cookies à partir de la première requête seront inclus par défaut.
    $response2 = $http->get('/changelogs');

Vous pouvez toujours remplacer les cookies auto-inclus en les définissant dans
les paramètres ``$options`` de la requête::

    // Remplace un cookie stocké avec une valeur personnalisée.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc']
    ]);


Objets Response
===============

.. php:class:: Response

Les objets Response ont un certain nombre de méthode pour parcourir les données
de réponse.

.. php:method:: body($parser = null)

    Récupère le corps de la réponse. Passé dans un parser en option pour décoder
    le corps de la réponse. Par exemple. `json_decode` peut être utilisé pour
    décoder les données de réponse.

.. php:method:: header($name)

    Récupère un header avec ``$name``. ``$name`` n'est pas sensible à la casse.

.. php:method:: headers()

    Récupère tous les headers.

.. php:method:: isOk()

    Vérifie si la réponse était ok. Tout code de réponse valide 20x sera traité
    comme OK.

.. php:method:: isRedirect()

    Vérifie si la réponse était une redirection.

.. php:method:: cookies()

    Récupère les cookies à partir de la réponse. Les Cookies seront retournés
    en tableau avec toutes les propriétés qui étaient définies dans le header
    de response. Pour accéder aux données brutes du cookie, vous pouvez utiliser
    :php:meth:`header()`

.. php:method:: cookie($name = null, $all = false)

    Récupère un cookie unique à partir de response. Par défaut, seule la valeur
    d'un cookie est retourné. Si vous définissez le deuxième paramètre à true,
    toutes les propriétés définies dans la response seront retournées.

.. php:method:: statusCode()

    Récupère le code de statut.

.. php:method:: encoding()

    Récupère l'encodage de response. Va retourner null si les headers de
    response ne contiennent pas d'encodage.

En plus des méthodes ci-dessus, vous pouvez aussi utiliser les accesseurs
d'objet pour lire les données à partir des propriétés suivantes:

* cookies
* body
* status
* headers

::

    $http = new Client(['host' => 'example.com']);
    $response = $http->get('/test');

    // Utilise les accesseurs d'object pour lire les données.
    debug($response->body);
    debug($response->status);
    debug($response->headers);

.. _http-client-xml-json:

Lire des Corps de Réponse JSON et XML
-------------------------------------

Puisque les réponses JSON et XML sont souvent utilisées, les objets response
fournissent une utilisation facile d'accéder à la lecture des données décodées.
Les données JSON dans un tableau, alors que les données XML sont décodées dans
un arbre ``SimpleXMLElement``::

    // Récupérer du XML
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->xml;

    // Récupérer du JSON
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->json;

Les données de réponse décodées sont stockées dans l'objet response, donc y
accéder de nombreuses fois n'augmente pas la charge.

.. meta::
    :title lang=fr: HttpClient
    :keywords lang=fr: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results
