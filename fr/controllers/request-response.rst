Les Objets Request & Response
#############################

.. php:namespace:: Cake\Http

Les objets ``ServerRequest`` et ``Response`` fournissent une abstraction autour de la
requête et des réponses HTTP. L'objet ``ServerRequest`` dans CakePHP vous permet de
faire une introspection de la requête entrante, tandis que l'objet ``Response``
vous permet de créer sans effort des réponses HTTP à partir de vos controllers.

.. index:: $this->request
.. _cake-request:

ServerRequest
=============

.. php:class:: ServerRequest

``ServerRequest`` est l'objet requête utilisé par défaut dans CakePHP. Il
centralise un certain nombre de fonctionnalités pour interroger et interagir
avec les données demandées. Pour chaque requête, une ``ServerRequest`` est
créée et passée en référence aux différentes couches de l'application que la
requête de données utilise. Par défaut la requête est assignée à
``$this->request``, et est disponible dans les Controllers, Cells, Vues et
Helpers. Vous pouvez aussi y accéder dans les Components en utilisant la
référence du controller. Certaines des tâches incluses que ``ServerRequest``
permet sont les suivantes :

* Transformer les tableaux GET, POST, et FILES en structures de données avec
  lesquelles vous êtes familiers.
* Fournir une introspection de l'environnement se rapportant à la demande.
  Des informations comme les envois d'en-têtes (headers), l'adresse IP du client
  et les informations des sous-domaines/domaines sur lesquels le serveur de
  l'application tourne.
* Fournit un accès aux paramètres de la requête à la fois en tableaux indicés
  et en propriétés d'un objet.

Depuis la version 3.4.0, l'objet ServerRequest de CakePHP implémente `l'interface
PSR-7 ServerServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_ facilitant
l'utilisation des librairies en-dehors de CakePHP.

Paramètres de la Requête
------------------------

``ServerRequest`` propose les paramètres de routing avec la méthode ``getParam()``::

    $controllerName = $this->request->getParam('controller');

Tous les éléments de route :ref:`route-elements` sont accessibles à travers
cette interface.

En plus des éléments de routes :ref:`route-elements`, vous avez souvent besoin
d'accéder aux arguments passés :ref:`passed-arguments`. Ceux-ci sont aussi tous
les deux disponibles dans l'objet ``request``::

    // Arguments passés
    $passedArgs = $this->request->getParam('pass');

Tous vous fournissent un accès aux arguments passés. Il y a de nombreux
paramètres importants et utiles que CakePHP utilise en interne qu'on peut aussi
trouver dans les paramètres de routing:

* ``plugin`` Le plugin gérant la requête aura une valeur nulle quand il n'y a
  pas de plugins.
* ``controller`` Le controller gérant la requête courante.
* ``action`` L'action gérant la requête courante.
* ``prefix`` Le préfixe pour l'action courante. Voir :ref:`prefix-routing` pour
  plus d'informations.

Accéder aux Paramètres Querystring
----------------------------------

.. php:method:: getQuery($name)

Les paramètres Querystring peuvent être lus en utilisant la méthode ``getQuery()``

    // l'URL est /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

    // Avant 3.4.0
    $page = $this->request->query('page');

Vous pouvez soit directement accéder à la propriété demandée, soit vous pouvez
utiliser ``query()`` pour lire l'URL requêtée sans erreur. Toute clé qui
n'existe pas va retourner ``null``::

    $foo = $this->request->getQuery('valeur_qui_n_existe_pas');
    // $foo === null

    // Vous pouvez également définir des valeurs par défaut
    $foo = $this->request->getQuery('n_existe_pas', 'valeur par défaut');

Si vous souhaitez accéder à tous les paramètres de requête, vous pouvez utiliser
``getQueryParams()``::

    $query = $this->request->getQueryParams();

.. versionadded:: 3.4.0
    ``getQueryParams()`` et ``getQuery()`` ont été ajoutées dans la version 3.4.0

Données du Corps de la Requête
------------------------------

.. php:method:: getData($name, $default = null)

Toutes les données POST sont accessibles en utilisant
:php:meth:`Cake\\Http\\ServerRequest::getData()`. Toute donnée de formulaire qui
contient un préfix ``data`` aura ce préfixe supprimé. Par exemple::

    // Un input avec un attribut de nom égal à 'MyModel[title]' est accessible via
    $title = $this->request->getData('MyModel.title');

Toute clé qui n'existe pas va retourner ``null``::

    $foo = $this->request->getData('Valeur.qui.n.existe.pas');
    // $foo == null

Accéder aux Données PUT, PATCH ou DELETE
----------------------------------------

.. php:method:: input($callback, [$options])

Quand vous construisez des services REST, vous acceptez souvent des données
requêtées sur des requêtes ``PUT`` et ``DELETE``. Toute donnée de corps de
requête ``application/x-www-form-urlencoded`` va automatiquement être parsée et
définie dans ``$this->data`` pour les requêtes ``PUT`` et ``DELETE``. Si vous
acceptez les données JSON ou XML, regardez la section ci-dessous pour voir
comment vous pouvez accéder aux corps de ces requêtes.

Lorsque vous accédez aux données d'entrée, vous pouvez les décoder avec une
fonction optionnelle. Cela peut être utile quand vous devez interagir avec du
contenu de requête XML ou JSON. Les paramètres supplémentaires pour la fonction
de décodage peuvent être passés comme arguments à ``input()``::

    $jsonData = $this->request->input('json_decode');

Variables d'Environnement (à partir de $_SERVER et $_ENV)
---------------------------------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` est un wrapper pour la fonction globale ``env()`` et agit
comme un getter/setter pour les variables d'environnement sans avoir à modifier
les variables globales ``$_SERVER`` et ``$_ENV``::

    // Obtenir l'host
    $host = $this->request->env('HTTP_HOST');

    // Définir une valeur, généralement utile pour les tests.
    $this->request->env('REQUEST_METHOD', 'POST');

Pour accéder à toutes les variables d'environnement dans une requête, utilisez
``getServerParams()``::

    $env = $this->request->getServerParams();

.. versionadded:: 3.4.0
    ``getServerParams()`` a été ajoutée dans la version 3.4.0

Données XML ou JSON
-------------------

Les applications employant :doc:`/development/rest` échangent souvent des
données dans des organes post non encodées en URL. Vous pouvez lire les données
entrantes dans n'importe quel format en utilisant
:php:meth:`~Cake\\Http\\ServerRequest::input()`. En fournissant une fonction de
décodage, vous pouvez recevoir le contenu dans un format déserializé::

    // Obtenir les données encodées JSON soumises par une action PUT/POST
    $jsonData = $this->request->input('json_decode');

Quelques méthodes de desérialization requièrent des paramètres supplémentaires
quand elles sont appelées, comme le paramètre de type tableau de
``json_decode``. Si vous voulez convertir du XML en objet DOMDocument,
:php:meth:`~Cake\\Http\\ServerRequest::input()` supporte aussi le passage de
paramètres supplémentaires::

    // Obtenir les données encodées en XML soumises avec une action PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Informations du Chemin
----------------------

L'objet ``ServerRequest`` fournit aussi des informations utiles sur les chemins dans
votre application. Les attributs ``base`` et ``webroot`` sont utiles pour
générer des URLs et déterminer si votre application est ou n'est pas dans un
sous-dossier. Les attributs que vous pouvez utiliser sont::

    // Suppose que la requête URL courante est /subdir/articles/edit/1?page=1

    // Contient /subdir/articles/edit/1?page=1
    $here = $request->here();

    // Contient /subdir
    $base = $request->getAttribute('base');

    // Contient /subdir/
    $base = $request->getAttribute('base');

    // Avant la version 3.4.0
    $webroot = $request->webroot;
    $base = $request->base;

.. _check-the-request:

Vérifier les Conditions de la Requête
-------------------------------------

.. php:method:: is($type, $args...)

L'objet ``ServerRequest`` fournit une façon d'inspecter différentes conditions de la
requête utilisée. En utilisant la méthode ``is()``, vous pouvez vérifier un
certain nombre de conditions, ainsi qu'inspecter d'autres critères de la requête
spécifique à l'application::

    $isPost = $this->request->is('post');

Vous pouvez aussi étendre les détecteurs de la requête qui sont disponibles, en
utilisant :php:meth:`Cake\\Http\\ServerRequest::addDetector()` pour créer de
nouveaux types de détecteurs. Il y a quatre différents types de détecteurs que
vous pouvez créer:

* Comparaison avec valeur d'environnement - Compare l'égalité de la valeur
  extraite à partir de :php:func:`env()` avec la valeur fournie.
* Comparaison de valeur avec motif - Vous permet de comparer la valeur
  extraite de :php:func:`env()` avec une expression régulière.
* Comparaison basée sur les options -  Utilise une liste d'options pour créer
  une expression régulière. Les appels suivants pour ajouter un détecteur
  d'option déjà défini, vont fusionner les options.
* Les détecteurs de Callback - Vous permettent de fournir un type 'callback'
  pour gérer la vérification. Le callback va recevoir l'objet ``ServerRequest`` comme
  seul paramètre.

.. php:method:: addDetector($name, $options)

Quelques exemples seraient::

    // Ajouter un détecteur d'environnement.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Ajouter un détecteur de valeur avec motif.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Ajouter un détecteur d'options
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // Ajouter un détecteur de callback. Doit être un callable valide.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Ajouter un détecteur qui utilise des arguments supplémentaires. Depuis la version 3.3.0
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->getParam('controller') === $name;
        }
    );

``ServerRequest`` inclut aussi des méthodes comme
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()`
et :php:meth:`Cake\\Http\\ServerRequest::host()` qui facilitent la vie des
applications avec sous-domaines.

Il y a plusieurs détecteurs intégrés que vous pouvez utiliser :

* ``is('get')`` Vérifie si la requête courante est un GET.
* ``is('put')`` Vérifie si la requête courante est un PUT.
* ``is('patch')`` Vérifie si la requête courante est un PATCH.
* ``is('post')`` Vérifie si la requête courante est un POST.
* ``is('delete')`` Vérifie si la requête courante est un DELETE.
* ``is('head')`` Vérifie si la requête courante est un HEAD.
* ``is('options')`` Vérifie si la requête courante est OPTIONS.
* ``is('ajax')`` Vérifie si la requête courante vient d'un
  X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Vérifie si la requête courante est via SSL.
* ``is('flash')`` Vérifie si la requête courante a un User-Agent de Flash.
* ``is('requested')`` Vérifie si la requête a un paramètre de requête
  'requested' avec la valeur 1.
* ``is('json')`` Vérifie si la requête a l'extension 'json' ajoutée et si elle
  accepte le mimetype 'application/json'.
* ``is('xml')`` Vérifie si la requête a l'extension 'xml' ajoutée et si elle
  accepte le mimetype 'application/xml' ou 'text/xml'.

.. versionadded:: 3.3.0
    Les détecteurs peuvent prendre des paramètres supplémentaires depuis la
    version 3.3.0.

Données de Session
------------------

Pour accéder à la session pour une requête donnée, utilisez la méthode
``session()``::

    $userName = $this->request->session()->read('Auth.User.name');

Pour plus d'informations, consultez la documentation
:doc:`/development/sessions` sur la façon d'utiliser l'objet ``Session``.

Hôte et Nom de Domaine
----------------------

.. php:method:: domain($tldLength = 1)

Retourne le nom de domaine sur lequel votre application tourne::

    // Affiche 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Retourne un tableau avec les sous-domaines sur lequel votre application tourne::

    // Retourne ['my', 'dev'] pour 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Retourne l'hôte sur lequel votre application tourne::

    // Affiche 'my.dev.example.org'
    echo $request->host();

Lire la Méthode HTTP
--------------------

.. php:method:: getMethod()

Retourne la méthode HTTP où la requête a été faite::

    // Affiche POST
    echo $request->getMethod();

    // Avant la version 3.4.0
    echo $request->method();

Restreindre les Méthodes HTTP qu'une Action Accepte
---------------------------------------------------

.. php:method:: allowMethod($methods)

Définit les méthodes HTTP autorisées. Si elles ne correspondent pas, elle
va lancer une ``MethodNotAllowedException``. La réponse 405 va inclure
l'en-tête ``Allow`` nécessaire avec les méthodes passées::

    public function delete()
    {
        // Only accept POST and DELETE requests
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Lire les En-têtes HTTP
----------------------

Ces méthodes vous permettent d'accéder à n'importe quel en-tête ``HTTP_*`` qui
ont été utilisés dans la requête. Par exemple::

    // Récupère le header dans une chaîne
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Récupère un tableau de toutes les valeurs
    $acceptHeader = $this->request->getHeader('Accept');

    // Vérifie l'existence d'un header
    $hasAcceptHeader = $this->request->hasHeader('Accept');

    // Avant to 3.4.0
    $userAgent = $this->request->header('User-Agent');

Du fait que certaines installations d'Apache ne rendent pas le header
``Authorization`` accessible, CakePHP le rend disponible via des méthodes
spécifiques.

.. php:method:: referer($local = false)

Retourne l'adresse référente de la requête.

.. php:method:: clientIp()

Retourne l'adresse IP du visiteur.

Faire Confiance aux Headers de Proxy
------------------------------------

Si votre application est derrière un load balancer ou exécutée sur un service
cloud, vous voudrez souvent obtenir l'hôte de load balancer, le port et le
schéma dans vos requêtes. Souvent les load balancers vont aussi envoyer
des en-têtes ``HTTP-X-Forwarded-*`` avec les valeurs originales. Les en-têtes
forwarded ne seront pas utilisés par CakePHP directement. Pour que l'objet
request utilise les en-têtes, définissez la propriété ``trustProxy`` à
``true``::

    $this->request->trustProxy = true;

    // Ces méthodes utiliseront maintenant les en-têtes du proxy.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Vérifier les En-têtes Acceptés
------------------------------

.. php:method:: accepts($type = null)

Trouve les types de contenu que le client accepte ou vérifie s'il accepte un
type particulier de contenu.

Récupère tous les types::

    $accepts = $this->request->accepts();

Vérifie pour un unique type::

    $acceptsJson = $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language = null)

Obtenir toutes les langues acceptées par le client, ou alors vérifier si une
langue spécifique est acceptée.

Obtenir la liste des langues acceptées::

    $acceptsLanguages = $this->request->acceptLanguage();

Vérifier si une langue spécifique est acceptée::

    $acceptsFrench = $this->request->acceptLanguage('fr-fr');

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` est la classe de réponse par défaut dans
CakePHP. Elle encapsule un nombre de fonctionnalités et de caractéristiques
pour la génération de réponses HTTP dans votre application. Elle aide aussi à
tester des objets factices (mocks/stubs), vous permettant d'inspecter les
en-têtes qui vont être envoyés.
:php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolide un certain nombre de méthodes qu'on pouvait trouver avant dans
:php:class:`Controller`,
:php:class:`ServerRequestHandlerComponent` et :php:class:`Dispatcher`. Les anciennes
méthodes sont dépréciées en faveur de l'utilisation de
:php:class:`Cake\\Http\\Response`.

``Response`` fournit une interface pour envelopper les tâches de réponse
communes liées, telles que:

* Envoyer des en-têtes pour les redirections.
* Envoyer des en-têtes de type de contenu.
* Envoyer tout en-tête.
* Envoyer le corps de la réponse.

Gérer les Types de Contenu
--------------------------

.. php:method:: withType($contentType = null)

Vous pouvez contrôler le Content-Type des réponses de votre application en
utilisant :php:meth:`Cake\\Http\\Response::withType()`. Si votre application a
besoin de gérer les types de contenu qui ne sont pas construits dans Response,
vous pouvez faire correspondre ces types avec ``withType()`` comme ceci::

    // Ajouter un type vCard
    $this->response->withType(['vcf' => 'text/v-card']);

    // Configurer la réponse de Type de Contenu pour vcard.
    $this->response->withType('vcf');

    // Avant 3.4.0
    $this->response->type('vcf');

Habituellement, vous voudrez faire correspondre des types de contenu
supplémentaires dans le callback :php:meth:`~Controller::beforeFilter()` de
votre controller afin que vous puissiez tirer parti de la fonctionnalité de
vue de commutation automatique de :php:class:`RequestHandlerComponent`, si vous
l'utilisez.

.. _cake-response-file:

Envoyer des fichiers
--------------------

.. php:method:: withFile($path, $options = [])

Il y a des fois où vous voulez envoyer des fichiers en réponses de vos requêtes.
Vous pouvez le faire en utilisant
:php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Retourne la réponse pour éviter que le controller n'essaie de
        // rendre la vue
        return $response;
    }

Comme montré dans l'exemple ci-dessus, vous devez passer le
chemin du fichier à la méthode. CakePHP va envoyer le bon en-tête de type de
contenu si c'est un type de fichier connu listé dans
`Cake\\Http\\Reponse::$_mimeTypes`. Vous pouvez ajouter des nouveaux types
avant d'appeler :php:meth:`Cake\\Http\\Response::withFile()` en utilisant la
méthode :php:meth:`Cake\\Http\\Response::withType()`.

Si vous voulez, vous pouvez aussi forcer un fichier à être téléchargé au lieu
d'être affiché dans le navigateur en spécifiant les options::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

les options possibles sont:

name
    Le nom vous permet de spécifier un nom de fichier alternatif à envoyer à
    l'utilisateur.
download
    Une valeur booléenne indiquant si les en-têtes doivent être définis pour
    forcer le téléchargement.

Envoyer une Chaîne de Caractères en Fichier
-------------------------------------------

Vous pouvez répondre avec un fichier qui n'existe pas sur le disque, par
exemple si vous voulez générer un pdf ou un ics à la volée à partir d'une
chaine::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $reponse = $this->response;
        $response->body($icsString);

        $this->response->withType('ics');

        // Force le téléchargement de fichier en option
        $response = $this->response->withDownload('filename_for_download.ics');

        // Retourne l'object pour éviter au controller d'essayer de rendre
        // une vue
        return $response;
    }

Streaming Resources
-------------------

Vous pouvez utiliser une fonction de rappel avec ``body()`` pour convertir des
flux de ressources en réponses::

    $file = fopen('/some/file.png', 'r');
    $this->response->body(function () use ($file) {
        rewind($file);
        fpassthru($file);
        fclose($file);
    });

Les fonctions de rappel peuvent également renvoyer le corps en tant que chaîne
de caractères::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Définir les En-têtes
--------------------

.. php:method:: withHeader($header, $value)

Les définitions de headers se font avec la méthode :php:meth:`Cake\\Http\\Response::withHeader()`.
Comme toutes les méthodes de l'interface PSR-7, cette méthode retourne une
nouvelle instance avec le nouvel header::

    // Ajoute / remplace un header
    $response = $response->withHeader('X-Extra', 'My header');

    // Définit plusieurs headers
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Ajoute une valeur à un header existant
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

    // Avant to 3.4.0 - Définit a header
    $this->response->header('Location', 'http://example.com');

Les headers ne sont pas envoyés dès que vous les définissez. Ils sont stockés
jusqu'à ce que la réponse soit émise par ``Cake\Http\Server``.

Vous pouvez maintenant utiliser la méthode :php:meth:`Cake\\Http\\Response::withLocation()`
pour définir ou obtenir directement le header "redirect location".

Définir le Character Set
------------------------

.. php:method:: withCharset($charset)

Cette méthode permet de définir le charset qui sera utilisé dans la réponse::

    $this->response = $this->response->withCharset('UTF-8');

    // Avant to 3.4.0
    $this->response->charset('UTF-8');

Interagir avec le Cache du Navigateur
-------------------------------------

.. php:method:: withDisabledCache()

Parfois, vous avez besoin de forcer les navigateurs à ne pas mettre en cache les
résultats de l'action d'un controller.
:php:meth:`Cake\\Http\\Response::withDisabledCache()` est justement prévue pour
cela::

    public function index()
    {
        // Désactive le cache
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Désactiver le cache à partir de domaines SSL pendant
    que vous essayez d'envoyer des fichiers à Internet Explorer peut entraîner
    des erreurs.

.. php:method:: withCache($since, $time = '+1 day')

Vous pouvez aussi dire aux clients que vous voulez qu'ils mettent en cache
des réponses. En utilisant :php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

Ce qui est au-dessus indiquera aux clients de mettre en cache la réponse résultante
pendant 5 jours, en espérant accélérer l'expérience de vos visiteurs.
La méthode ``withCache()`` définit valeur ``Last-Modified`` en
premier argument. L'entête ``Expires`` et ``max-age`` sont définis en se basant
sur le second paramètre. Le Cache-Control est défini aussi à ``public``.

.. _cake-response-caching:

Réglage fin du Cache HTTP
-------------------------

L'une des plus meilleures et plus simples méthodes pour rendre votre application
plus rapide est d'utiliser le cache HTTP. Selon ce modèle de mise en cache,
vous êtes seulement tenu d'aider les clients à décider s'ils doivent utiliser
une copie de la réponse mise en cache en définissant quelques propriétés
d'en-têtes comme la date de mise à jour et la balise entity de réponse.

Plutôt que d'avoir à coder la logique de mise en cache et de sa désactivation
(rafraîchissement) une fois que les données ont changé, HTTP utilise deux
modèles, l'expiration et la validation qui habituellement sont beaucoup plus
simples que d'avoir à gérer le cache soi-même.

En dehors de l'utilisation de :php:meth:`Cake\\Http\\Response::withCache()`, vous
pouvez également utiliser d'autres méthodes pour affiner le réglage des
en-têtes de cache HTTP pour tirer profit du navigateur ou à l'inverse du cache
du proxy.

L'En-tête de Contrôle du Cache
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public = null, $time = null)

Utilisé sous le modèle d'expiration, cet en-tête contient de multiples
indicateurs qui peuvent changer la façon dont les navigateurs ou les proxies
utilisent le contenu mis en cache. Un en-tête ``Cache-Control`` peut ressembler
à ceci::

    Cache-Control: private, max-age=3600, must-revalidate

La classe ``Response`` vous aide à configurer cet en-tête avec quelques
méthodes utiles qui vont produire un en-tête final ``Cache Control`` valide.
La première est la méthode ``withSharable()``, qui indique si une réponse peut
être considérée comme partageable pour différents utilisateurs ou clients.
Cette méthode contrôle en fait la partie `public` ou `private` de cet en-tête.
Définir une réponse en `private` indique que tout ou partie de celle-ci est
prévue pour un unique utilisateur.
Pour tirer profit des mises en cache partagées, il est nécessaire de définir la
directive de contrôle en `public`.

Le deuxième paramètre de cette méthode est utilisé pour spécifier un ``max-age``
pour le cache qui est le nombre de secondes après lesquelles la réponse n'est
plus considérée comme récente::

    public function view()
    {
        ...
        // Définit le Cache-Control en public pour 3600 secondes
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function mes_donnees()
    {
        ...
        // Définit le Cache-Control en private pour 3600 secondes
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` expose des méthodes séparées pour la définition de chaque component
dans l'en-tête de ``Cache-Control``.

L'En-tête d'Expiration
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time = null)

Vous pouvez définir l'en-tête ``Expires`` avec une date et un temps après
lesquels la réponse n'est plus considérée comme récente. Cet en-tête peut être
défini en utilisant la méthode ``withExpires()``::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

Cette méthode accepte aussi une instance :php:class:`DateTime` ou toute chaîne
de caractère qui peut être parsée par la classe :php:class:`DateTime`.

L'En-tête Etag
~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

La validation du Cache dans HTTP est souvent utilisée quand le contenu change
constamment et demande à l'application de générer seulement les contenus de la
réponse si le cache n'est plus récent. Sous ce modèle, le client continue
de stocker les pages dans le cache, mais au lieu de l'utiliser directement,
il demande à l'application à chaque fois si les ressources ont changé ou non.
C'est utilisé couramment avec des ressources statiques comme les images et
autres choses.

La méthode ``withEtag()`` (appelée balise d'entité) est une
chaîne de caractère qui identifie de façon unique les ressources requêtées
comme le fait un checksum pour un fichier, afin de déterminer si elle
correspond à une ressource du cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez
soit appeler manuellement la méthode
``checkNotModified()`` ou inclure le
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

    La plupart des utilisateurs proxy devront probablement penser à utiliser
    l'en-tête Last Modified plutôt que Etags pour des raisons de performance et
    de compatibilité.

L'En-tête Last-Modified
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time = null)

De même, avec le modèle de validation du cache HTTP, vous pouvez définir
l'en-tête ``Last-Modified`` pour indiquer la date et l'heure à laquelle la
ressource a été modifiée pour la dernière fois. Définir cet en-tête aide CakePHP
à indiquer à ces clients si la réponse a été modifiée ou n'est pas basée sur
leur cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez soit
appeler manuellement la méthode ``checkNotModified()`` ou inclure le
:doc:`/controllers/components/request-handling` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = this->response->withModified($article->modified);
        if ($this->response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

L'En-tête Vary
~~~~~~~~~~~~~~

.. php:method:: withVary($header)

Dans certains cas, vous voudrez offrir différents contenus en utilisant la même
URL. C'est souvent le cas quand vous avez une page multilingue ou que vous
répondez avec différentes pages HTML selon le navigateur qui requête la
ressource. Dans ces circonstances, vous pouvez utiliser l'en-tête ``Vary``::

    $this->response = $this->response->withVary('User-Agent');
    $this->response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $this->response = $this->response->withVary('Accept-Language');

Envoyer des Réponses Non-Modifiées
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(ServerRequest $request)

Compare les en-têtes de cache pour l'objet requêté avec l'en-tête du cache de
la réponse et determine s'il peut toujours être considéré comme récent. Si oui,
il supprime le contenu de la réponse et envoie l'en-tête `304 Not Modified`::

    // Dans une action de controller.
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _cors-headers:

Définir les En-têtes de Requête d'Origine Croisée (Cross Origin Request Headers = CORS)
=======================================================================================

Depuis 3.2, vous pouvez utiliser la méthode ``cors()`` pour définir `le Contrôle
d'Accès HTTP <https://developer.mozilla.org/fr/docs/HTTP/Access_control_CORS>`__
et ses en-têtes liés avec une interface simple::

    $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

Les en-têtes liés au CORS vont seulement être appliqués à la réponse si les
critères suivants sont vérifiés:

#. La requête a un en-tête ``Origin``.
#. La valeur ``Origin`` de la requête correspond à une des valeurs autorisées de
   Origin.

.. versionadded:: 3.2
    ``CorsBuilder`` a été ajouté dans 3.2

Erreurs Communes avec les Responses Immutables
==============================================

Depuis CakePHP 3.4.0, les objets responses offrent de nombreuses méthodes qui
traitent les responses comme des objets immutables. Les objets immutables
permettent de prévenir les effets de bord difficiles à repérer.
Malgré leurs nombreux avantages, s'habituer aux objets immutables peut prendre
un peu de temps. Toutes les méthodes qui commencent par ``with`` intéragiront
avec la réponse à la manière immutable et retourneront **toujours** une
**nouvelle** instance. L'erreur la plus fréquente quand les développeurs
travaillent avec les objets immutables est d'oublier de persister l'instance
modifiée::

    $this->response->withHeader('X-CakePHP', 'yes!');

Dans le code ci-dessus, la réponse ne contiendra pas le header ``X-CakePHP``
car la valeur retournée par ``withHeader()`` n'a pas été persistée. Pour avoir
un code fonctionnel, vous devrez écrire::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');


.. meta::
    :title lang=fr: Objets ServerRequest et Response
    :keywords lang=fr: requête controller,paramètres de requête,tableaux indicés,purpose index,objets réponse,information domaine,Objet requête,donnée requêtée,interrogation,params,précédentes versions,introspection,dispatcher,rout,structures de données,tableaux,adresse ip,migration,indexes,cakephp
