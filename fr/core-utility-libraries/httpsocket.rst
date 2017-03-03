HttpSocket
##########

.. php:class:: HttpSocket(mixed $config = array())

CakePHP inclut une classe HttpSocket qui peut être utilisée pour faire des
requêtes. C'est un bon moyen pour communiquer avec des services web externes
ou des apis distantes.

Faire une requête
=================

Vous pouvez utiliser HttpSocket pour créer la plupart des requêtes HTTP avec
les différentes méthodes HTTP.

.. php:method:: get($uri, $query, $request)

    Le paramètre ``$query`` peut soit être une chaîne de caractères, soit un
    tableau de clés et de valeurs. La méthode get fait une simple requête
    HTTP GET retournant les résultats::

        App::uses('HttpSocket', 'Network/Http');

        $HttpSocket = new HttpSocket();

        // requête chaîne
        $results = $HttpSocket->get('https://www.google.com/search', 'q=cakephp');

        // requête tableau
        $results = $HttpSocket->get('https://www.google.com/search', array('q' => 'cakephp'));

.. php:method:: post($uri, $data, $request)

    La méthode post fait une simple requête HTTP POST retournant les résultats.

    Les paramètres pour la méthode ``post`` sont presque les mêmes que pour la
    méthode get, ``$uri`` est l'adresse web où la requête a été faite;
    ``$query`` est la donnée à poster, que ce soit en chaîne, ou en un
    tableau de clés et de valeurs::

        App::uses('HttpSocket', 'Network/Http');

        $HttpSocket = new HttpSocket();

        // donnée en chaîne
        $results = $HttpSocket->post(
            'http://example.com/add',
            'name=test&type=user'
        );

        // donnée en tableau
        $data = array('name' => 'test', 'type' => 'user');
        $results = $HttpSocket->post('http://example.com/add', $data);

.. php:method:: put($uri, $data, $request)

    La méthode put fait une simple requête HTTP PUT retournant les résultats.

    Les paramètres pour la méthode ``put`` est la même que pour la méthode
    :php:meth:`~HttpSocket::post()`.

.. php:method:: delete($uri, $query, $request)

    La méthode delete fait une requête simple HTTP DELETE retournant les
    résultats.

    Les paramètres pour la méthode ``delete`` sont les mêmes que pour la
    méthode :php:meth:`~HttpSocket::get()`. Le paramètre ``$query`` peut soit
    être une chaîne, soit un tableau d'arguments d'une recherche sous forme de
    chaîne pour la requête.

.. php:method:: patch($uri, $data, $request)

    La méthode patch fait une simple requête HTTP PATCH retournant les
    résultats.

    Les paramètres pour la méthode ``patch`` sont les mêmes que pour la
    méthode :php:meth:`~HttpSocket::post()`.

    .. versionadded:: 2.4

.. php:method:: request($request)

    La méthode request de base qui est appelée à partir de tous les wrappers
    (get, post, put, delete). Retourne les résultats de la requête.

    $request est un tableau à clé avec des options diverses. Voici le format
    et les configurations par défaut::

        public $request = array(
            'method' => 'GET',
            'uri' => array(
                'scheme' => 'http',
                'host' => null,
                'port' => 80,
                'user' => null,
                'pass' => null,
                'path' => null,
                'query' => null,
                'fragment' => null
            ),
            'auth' => array(
                'method' => 'Basic',
                'user' => null,
                'pass' => null
            ),
            'version' => '1.1',
            'body' => '',
            'line' => null,
            'header' => array(
                'Connection' => 'close',
                'User-Agent' => 'CakePHP'
            ),
            'raw' => null,
            'redirect' => false,
            'cookies' => array()
        );

Gérer la réponse
================

Les réponses des requêtes faîtes avec ``HttpSocket`` sont des instances de
``HttpResponse``. L'objet vous donne quelques méthodes accessor pour accéder
au contenu de la réponse HTTP. Cette classe intègre le
`ArrayAccess <https://secure.php.net/manual/en/class.arrayaccess.php>`_ et
`__toString() <https://secure.php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring>`_,
donc vous pouvez continuer en utilisant ``$http->response`` en tableau et le
retour des méthodes de requête en chaîne::

    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $response = $http->get('https://cakephp.org');

    // Check the body for the presence of a title tag.
    $titlePos = strpos($response->body, '<title>');

    // Récupère le code de statut pour la réponse.
    $code = $response->code;

``HttpResponse`` a les attributs suivants:

* ``body`` retourne le corps de la réponse HTTP (normalement le HTML).
* ``headers`` retourne un tableau avec les headers.
* ``cookies`` retourne un tableau avec les nouveaux cookies (les cookies
  des autres requêtes ne sont pas stockés ici).
* ``httpVersion`` retourne une chaîne avec la version de HTTP (à partir
  de la première ligne dans la réponse).
* ``code`` retourne l'integer avec le code HTTP.
* ``reasonPhrase`` retourne la chaîne avec la réponse du code HTTP.
* ``raw`` retourne la réponse non changée du serveur.

``HttpResponse`` expose aussi les méthodes suivantes:

* ``body()`` retourne le corps.
* ``isOk()`` retourne si le code est 200;
* ``isRedirect()`` retourne si le code est 301, 302, 303 or 307 et la
  *localisation* du header est définie.
* ``getHeader()`` vous permet de récupérer les headers, voir la prochaine
  section.

Obtenir des headers à partir d'une réponse
------------------------------------------

Suivant les autres places dans le coeur, HttpSocket ne change pas le cas des
headers. :rfc:`2616` indique que les headers sont insensibles à la casse, et
HttpSocket préserve les valeurs que l'hôte distant envoie::

    HTTP/1.1 200 OK
    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

Votre ``$response->headers`` (ou ``$response['header']``) va contenir les
bonnes clés envoyés. Afin d'accéder de manière sécurisé aux champs du
header, il est mieux d'utiliser ``getHeader()``. Si vos headers
ressemblent à ceci::

    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

Vous pouvez récupérer les headers ci-dessus en appelant::

    // $response est une instance de HttpResponse
    // récupère le header Content-Type.
    $response->getHeader('Content-Type');

    // Récupère la date
    $response->getHeader('date');

Les headers peuvent être récupérés case-insensitively.

Gérer automatiquement une réponse de redirection
------------------------------------------------

Quand la réponse a un code de statut de redirection valide (voir
``HttpResponse::isRedirect``), une requête supplémentaire peut être
automatiquement faîte selon le header *Location* reçu::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    $HttpSocket = new HttpSocket();
    $response = $HttpSocket->get('http://example.com/redirecting_url', array(), array('redirect' => true));


L'option *redirect* peut prendre les valeurs suivantes.

* **true** : toutes les réponses de redirection vont entraîner une nouvelle
  requête conséquente.
* **integer** : La valeur définie est le nombre maximum de redirections
  autorisées (après l'avoir atteint, la valeur de *redirect* est considerée
  comme **false**)
* **false** (par défaut) : aucune requête conséquente ne sera fired.

La ``$response`` retournée sera la dernière, selon les paramètres.

.. _http-socket-ssl-options:

Gérer les certificats SSL
-------------------------

Quand vous faites des requêtes vers des services en SSL, HttpSocket va
s'attendre à valider le certificat SSL en utilisant la validation peer. Si le
certificat échoue la validation peer ou ne correspond pas au nom d'hôte
qu'on souhaite accéder, la connexion va échouer, et une exception va être
lancée. Par défaut HttpSocket va utiliser le fichier d'autorité du certificat
mozilla pour vérifier les certificats SSL. Vous pouvez utiliser les options
suivantes pour configurer la façon dont les certificats sont gérés:

- ``ssl_verify_peer`` Défini à false pour désactiver la vérification SSL.
   Ce n'est **pas recommandé**.
- ``ssl_verify_host`` Défini à false si vous souhaitez ignorer les erreurs
  de correspondance du nom d'hôte.
- ``ssl_allow_self_signed`` Défini à true pour activer les certificats que l'on
  accepte soi-même. Cela nécessite que ``ssl_verify_peer`` soit activé.
- ``ssl_cafile`` Défini au chemin absolu du fichier de l'Autorité de
  Certification que vous souhaitez utiliser pour vérifier les certificats SSL.

Ces options sont fournies dans les arguments du constructeur::

    $socket = new HttpSocket(array(
        'ssl_allow_self_signed' => true
    ));

Autoriserait les certificats signés soi-même pour toutes les requêtes faîtes
avec le socket créé.

.. versionadded:: 2.3
    La validation de certificats SSL a été ajoutée dans 2.3.

Créer une classe de réponse personnalisée
-----------------------------------------

Vous pouvez créer votre propre classe de réponse pour utiliser HttpSocket. Vous
pourriez créer le fichier ``app/Lib/Network/Http/YourResponse.php`` avec le
contenu::

    App::uses('HttpResponse', 'Network/Http');

    class YourResponse extends HttpResponse {

        public function parseResponse($message) {
            parent::parseResponse($message);
            // Make what you want
        }
    }


Avant votre requête, vous devrez changer la propriété responseClass::

    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $http->responseClass = 'YourResponse';

.. versionchanged:: 2.3
    Depuis 2.3.0, vous devriez étendre ``HttpSocketResponse`` à la place. Cela
    évite un problème commun avec l'extension HTTP PECL.

Télécharger les résultats
-------------------------

HttpSocket a une nouvelle méthode appelée `setContentResource()`. En
configurant une ressource avec cette méthode, le contenu sera écrit
dans la ressource, en utilisant `fwrite()`. Pour télécharger un fichier,
vous pouvez faire::

    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $f = fopen(TMP . 'bakery.xml', 'w');
    $http->setContentResource($f);
    $http->get('https://bakery.cakephp.org/comments.rss');
    fclose($f);

.. note::

    Les headers ne sont pas inclus dans le fichier, vous récupèrerez seulement
    le contenu du corps écrit dans votre ressource. Pour désactiver la
    sauvegarde dans la ressource, utilisez ``$http->setContentResource(false)``.

Utiliser l'authentification
===========================

HttpSocket supporte des méthodes d'authentification HTTP Basic et Digest. Vous
pouvez maintenant créer des objets d'authentification personnalisés pour
supporter des protocoles comme OAuth. Pour utiliser un système
d'authentification, vous devez configurer l'instance ``HttpSocket``::

    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $http->configAuth('Basic', 'user', 'password');

Ce qui est au-dessus configurerait l'instance ``HttpSocket`` pour utiliser
l'authentification Basic en utilisant ``user`` et ``password`` en credentials.

Créer un objet d'authentification personnalisé
----------------------------------------------

Vous pouvez maintenant créer votre propre méthode d'authentification à
utiliser avec HttpSocket. Vous pouvez créer le fichier
``app/Lib/Network/Http/YourMethodAuthentication.php`` avec le contenu::


    class YourMethodAuthentication {

    /**
     * Authentication
     *
     * @param HttpSocket $http
     * @param array $authInfo
     * @return void
     */
        public static function authentication(HttpSocket $http, &$authInfo) {
            // Faire quelque chose, par exemple définir la valeur $http->request['header']['Authentication']
        }

    }

Pour configurer HttpSocket afin d'utiliser votre configuration auth, vous
pouvez utiliser la nouvelle méthode ``configAuth()``::

    $http->configAuth('YourMethod', array('config1' => 'value1', 'config2' => 'value2'));
    $http->get('http://secure.your-site.com');

La méthode ``authentication()`` va être appelée pour ajouter aux headers de la
requête.

Utiliser un HttpSocket avec un proxy
------------------------------------

En tant que configuration de auth, vous pouvez configurer une authentification
de proxy. Vous pouvez créer votre méthode personnalisée pour authentifier
le proxy dans la même classe d'authentification. Par exemple::


    class YourMethodAuthentication {

    /**
     * Authentication
     *
     * @param HttpSocket $http
     * @param array $authInfo
     * @return void
     */
        public static function authentication(HttpSocket $http, &$authInfo) {
            // Faire quelque chose, par exemple définir ma valeur $http->request['header']['Authentication']
        }

    /**
     * Proxy Authentication
     *
     * @param HttpSocket $http
     * @param array $proxyInfo
     * @return void
     */
        public static function proxyAuthentication(HttpSocket $http, &$proxyInfo) {
            // Faire quelque chose, par exemple définir la valeur $http->request['header']['Proxy-Authentication']
        }

    }

.. note::

    Pour utiliser un proxy, vous devez appeler ``HttpSocket::configProxy()``
    semblable à ``HttpSocket::configAuth()``.



.. meta::
    :title lang=fr: HttpSocket
    :keywords lang=fr: tableau nommé,tableau donnée,paramètre query,query string,php class,string query,test type,string data,google,query results,webservices,apis,paramètres,cakephp,meth,résultats de recherche
