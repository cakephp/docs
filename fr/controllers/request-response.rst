Les Objets Request & Response
#############################

.. php:namespace:: Cake\Network

Les objets ``Request`` et ``Response`` fournissent une abstraction autour de la
requête et des réponses HTTP. L'objet ``Request`` dans CakePHP vous permet de
faire une introspection de la requête entrante, tandis que l'objet ``Response``
vous permet de créer sans effort des réponses HTTP à partir de vos controllers.

.. index:: $this->request
.. _cake-request:

Request
=======

.. php:class:: Request

``Request`` est l'objet requête utilisé par défaut dans CakePHP. Il centralise
un certain nombre de fonctionnalités pour interroger et interagir avec les
données demandées. Pour chaque requête, une ``Request`` est créée et passée en
référence aux différentes couches de l'application que la requête de données
utilise. Par défaut la requête est assignée à ``$this->request``, et est
disponible dans les Controllers, Cells, Vues et Helpers. Vous pouvez aussi y
accéder dans les Components en utilisant la référence du controller. Certaines
des tâches incluses que ``Request`` permet sont les suivantes :

* Transformer les tableaux GET, POST, et FILES en structures de données avec
  lesquelles vous êtes familiers.
* Fournir une introspection de l'environnement se rapportant à la demande.
  Des informations comme les envois d'en-têtes (headers), l'adresse IP du client
  et les informations des sous-domaines/domaines sur lesquels le serveur de
  l'application tourne.
* Fournit un accès aux paramètres de la requête à la fois en tableaux indicés
  et en propriétés d'un objet.

Depuis la version 3.4.0, l'objet Request de CakePHP implémente `l'interface
PSR-7 ServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_ facilitant
l'utilisation des librairies en-dehors de CakePHP.

Paramètres de la Requête
------------------------

``Request`` propose les paramètres de routing avec la méthode ``getParam()``::

    $this->request->getParam('controller');

Tous les éléments de route :ref:`route-elements` sont accessibles à travers
cette interface.

En plus des éléments de routes :ref:`route-elements`, vous avez souvent besoin
d'accéder aux arguments passés :ref:`passed-arguments`. Ceux-ci sont aussi tous
les deux disponibles dans l'objet ``request``::

    // Arguments passés
    $this->request->getParam('pass');

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

.. php:method:: query($name)

Les paramètres Querystring peuvent être lus en utilisant
:php:attr:`~Cake\\Network\\Request::$query`::

    // l'URL est /posts/index?page=1&sort=title
    $this->request->getQuery('page');

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
    ``getQueryParams()`` a été ajoutée dans la version 3.4.0

Données du Corps de la Requête
------------------------------

.. php:method:: data($name)

Toutes les données POST sont accessibles en utilisant
:php:meth:`Cake\\Network\\Request::data()`. Toute donnée de formulaire qui
contient un préfix ``data`` aura ce préfixe supprimé. Par exemple::

    // Un input avec un attribut de nom égal à 'MyModel[title]' est accessible
    dans $this->request->getData('MyModel.title');

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

    $this->request->input('json_decode');

Variables d'Environnement (à partir de $_SERVER et $_ENV)
---------------------------------------------------------

.. php:method:: env($key, $value = null)

``Request::env()`` est un wrapper pour la fonction globale ``env()`` et agit
comme un getter/setter pour les variables d'environnement sans avoir à modifier
les variables globales ``$_SERVER`` et ``$_ENV``::

    // Obtenir une valeur
    $value = $this->request->env('HTTP_HOST');

    // Définir une valeur. Généralement utile pour les tests.
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
:php:meth:`~Cake\\Network\\Request::input()`. En fournissant une fonction de
décodage, vous pouvez recevoir le contenu dans un format déserializé::

    // Obtenir les données encodées JSON soumises par une action PUT/POST
    $data = $this->request->input('json_decode');

Quelques méthodes de desérialization requièrent des paramètres supplémentaires
quand elles sont appelées, comme le paramètre de type tableau de
``json_decode``. Si vous voulez convertir du XML en objet DOMDocument,
:php:meth:`~Cake\\Network\\Request::input()` supporte aussi le passage de
paramètres supplémentaires::

    // Obtenir les données encodées en Xml soumises avec une action PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Informations du Chemin
----------------------

L'objet ``Request`` fournit aussi des informations utiles sur les chemins dans
votre application. Les attributs ``base`` et ``webroot`` sont utiles pour
générer des URLs et déterminer si votre application est ou n'est pas dans un
sous-dossier. Les attributs que vous pouvez utiliser sont::

    // Suppose que la requête URL courante est /subdir/articles/edit/1?page=1

    // Contient /subdir/articles/edit/1?page=1
    $request->here();

    // Contient /subdir
    $request->getAttribute('base');

    // Contient /subdir/
    $request->getAttribute('base');

    // Avant la version 3.4.0
    $request->webroot;
    $request->base;

.. _check-the-request:

Vérifier les Conditions de la Requête
-------------------------------------

.. php:method:: is($type, $args...)

L'objet ``Request`` fournit une façon d'inspecter différentes conditions de la
requête utilisée. En utilisant la méthode ``is()``, vous pouvez vérifier un
certain nombre de conditions, ainsi qu'inspecter d'autres critères de la requête
spécifique à l'application::

    $this->request->is('post');

Vous pouvez aussi étendre les détecteurs de la requête qui sont disponibles, en
utilisant :php:meth:`Cake\\Network\\Request::addDetector()` pour créer de
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
  pour gérer la vérification. Le callback va recevoir l'objet ``Request`` comme
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

``Request`` inclut aussi des méthodes comme
:php:meth:`Cake\\Network\\Request::domain()`,
:php:meth:`Cake\\Network\\Request::subdomains()`
et :php:meth:`Cake\\Network\\Request::host()` qui facilitent la vie des
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

    $this->request->session()->read('User.name');

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
    $request->subdomains();

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

Lire les Headers HTTP
---------------------

.. php:method:: header($name)

Vous permet d'accéder à tout en-tête ``HTTP_*`` utilisé pour la requête::

    // Récupère l'en-tête en chaîne de caractères.
    $this->request->getHeaderLine('User-Agent');

    // Récupère un tableau de toutes les valeurs.
    $this->request->getHeader('Accept');

    // Vérifie si un en-tête existe
    $this->request->hasHeader('Accept');

    // Avant la version 3.4.0
    $this->request->header('User-Agent');

Alors que certaines installations d'apache ne rendent pas accessible l'en-tête
``Authorization``, CakePHP va le rendre accessible avec les méthodes spécifiques
d'apache comme c'est requis.

.. php:method:: referer($local = false)

Retourne l'adresse de référence de la requête.

.. php:method:: clientIp($safe = true)

Retourne l'adresse IP du visiteur courant.

Faire Confiance aux Header de Proxy
-----------------------------------

Si votre application est derrière un load balancer ou exécutée sur un service
cloud, vous voudrez souvent obtenir l'hôte de load balancer, le port et le
schéma dans vos requêtes. Souvent les load balancers vont aussi envoyer
des en-têtes ``HTTP-X-Forwarded-*`` avec les valeurs originales. Les en-têtes
forwarded ne seront pas utilisés par CakePHP directement. Pour que l'objet
request utilise les en-têtes, définissez la propriété ``trustProxy`` à
``true``::

    $this->request->trustProxy = true;

    // Ces méthodes utiliseront maintenant les en-têtes du proxy.
    $this->request->port();
    $this->request->host();
    $this->request->scheme();
    $this->request->clientIp();

Vérifier les En-têtes Acceptés
------------------------------

.. php:method:: accepts($type = null)

Trouve les types de contenu que le client accepte ou vérifie s'il accepte un
type particulier de contenu.

Récupère tous les types::

    $this->request->accepts();

Vérifie pour un unique type::

    $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language = null)

Obtenir toutes les langues acceptées par le client, ou alors vérifier si une
langue spécifique est acceptée.

Obtenir la liste des langues acceptées::

    $this->request->acceptLanguage();

Vérifier si une langue spécifique est acceptée::

    $this->request->acceptLanguage('fr-fr');

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Network\\Response` est la classe de réponse par défaut dans
CakePHP. Elle encapsule un nombre de fonctionnalités et de caractéristiques
pour la génération de réponses HTTP dans votre application. Elle aide aussi à
tester des objets factices (mocks/stubs), vous permettant d'inspecter les
en-têtes qui vont être envoyés.
:php:class:`Cake\\Network\\Request`, :php:class:`Cake\\Network\\Response`
consolide un certain nombre de méthodes qu'on pouvait trouver avant dans
:php:class:`Controller`,
:php:class:`RequestHandlerComponent` et :php:class:`Dispatcher`. Les anciennes
méthodes sont dépréciées en faveur de l'utilisation de
:php:class:`Cake\\Network\\Response`.

``Response`` fournit une interface pour envelopper les tâches de réponse
communes liées, telles que:

* Envoyer des en-têtes pour les redirections.
* Envoyer des en-têtes de type de contenu.
* Envoyer tout en-tête.
* Envoyer le corps de la réponse.

Changer la Classe Response
--------------------------

CakePHP utilise ``Response`` par défaut. ``Response`` est une classe flexible et
transparente. Si vous avez besoin de la remplacer avec une classe spécifique de
l'application, vous pouvez remplacer ``Response`` dans **webroot/index.php**.

Cela fera que tous les controllers dans votre application utiliseront
``VotreResponse`` au lieu de :php:class:`Cake\\Network\\Response`. Vous pouvez
aussi remplacer l'instance de réponse de la configuration ``$this->response``
dans vos controllers. Ecraser l'objet ``Response`` est à portée de main pour les
tests car il vous permet d'écraser les méthodes qui interragissent avec
:php:meth:`Cake\\Network\\Response::header()`.

Gérer les Types de Contenu
--------------------------

Vous pouvez contrôler le Content-Type des réponses de votre application en
utilisant :php:meth:`Cake\\Network\\Response::type()`. Si votre application a
besoin de gérer les types de contenu qui ne sont pas construits dans Response,
vous pouvez faire correspondre ces types avec ``type()`` comme ceci::

    // Ajouter un type vCard
    $this->response->type(['vcf' => 'text/v-card']);

    // Configurer la réponse de Type de Contenu pour vcard.
    $this->response->type('vcf');

Habituellement, vous voudrez faire correspondre des types de contenu
supplémentaires dans le callback :php:meth:`~Controller::beforeFilter()` de
votre controller afin que vous puissiez tirer parti de la fonctionnalité de
vue de commutation automatique de :php:class:`RequestHandlerComponent`, si vous
l'utilisez.

Définir le Character Set
------------------------

.. php:method:: charset($charset = null)

Définit le charset qui sera utilisé dans response::

    $this->response->charset('UTF-8');

.. _cake-response-file:

Envoyer des fichiers
--------------------

.. php:method:: file($path, $options = [])

Il y a des fois où vous voulez envoyer des fichiers en réponses de vos requêtes.
Vous pouvez faire cela en utilisant
:php:meth:`Cake\\Network\\Response::file()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $this->response->file($file['path']);
        //Retourne un objet réponse pour éviter que le controller n'essaie de
        // rendre la vue
        return $this->response;
    }

Comme montré dans l'exemple ci-dessus, vous devez passer le
chemin du fichier à la méthode. CakePHP va envoyer le bon en-tête de type de
contenu si c'est un type de fichier connu listé dans
`Cake\\Network\\Reponse::$_mimeTypes`. Vous pouvez ajouter des nouveaux types
avant d'appeler :php:meth:`Cake\\Network\\Response::file()` en utilisant la
méthode :php:meth:`Cake\\Network\\Response::type()`.

Si vous voulez, vous pouvez aussi forcer un fichier à être téléchargé au lieu
d'être affiché dans le navigateur en spécifiant les options::

    $this->response->file(
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
        $this->response->body($icsString);
        $this->response->type('ics');

        // Force le téléchargement de fichier en option
        $this->response->download('filename_for_download.ics');

        // Retourne l'object pour éviter au controller d'essayer de rendre
        // une vue
        return $this->response;
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

.. php:method:: header($header = null, $value = null)

Le paramétrage des en-têtes est fait avec la méthode
:php:meth:`Cake\\Network\\Response::header()`. Elle peut être appelée avec
quelques paramètres de configurations::

    // Définir un unique en-tête
    $this->response->header('Location', 'http://example.com');

    // Définir plusieurs en-têtes
    $this->response->header([
        'Location' => 'http://example.com',
        'X-Extra' => 'My header'
    ]);
    $this->response->header([
        'WWW-Authenticate: Negotiate',
        'Content-type: application/pdf'
    ]);

Définir le même :php:meth:`~CakeResponse::header()` de multiples fois entraînera
l'écrasement des précédentes valeurs, un peu comme les appels réguliers
d'en-tête. Les en-têtes ne sont pas envoyés quand
:php:meth:`Cake\\Network\\Response::header()` est appelé; A la place, ils sont
simplement conservés jusqu'à ce que la réponse soit effectivement envoyée.

Vous pouvez maintenant utiliser la méthode
:php:meth:`Cake\\Network\\Response::location()` pour directement définir où
récupérer l'en-tête de localisation du redirect.

Interagir avec le Cache du Navigateur
-------------------------------------

.. php:method:: disableCache()

Parfois, vous avez besoin de forcer les navigateurs à ne pas mettre en cache les
résultats de l'action d'un controller.
:php:meth:`Cake\\Network\\Response::disableCache()` est justement prévue pour
cela::

    public function index()
    {
        // faire quelque chose.
        $this->response->disableCache();
    }

.. warning::

    Utiliser disableCache() avec downloads à partir de domaines SSL pendant
    que vous essayez d'envoyer des fichiers à Internet Explorer peut entraîner
    des erreurs.

.. php:method:: cache($since, $time = '+1 day')

Vous pouvez aussi dire aux clients que vous voulez qu'ils mettent en cache
des réponses. En utilisant :php:meth:`Cake\\Network\\Response::cache()`::

    public function index()
    {
        //faire quelque chose
        $this->response->cache('-1 minute', '+5 days');
    }

Ce qui est au-dessus dira aux clients de mettre en cache la réponse résultante
pendant 5 jours, en espérant accélérer l'expérience de vos visiteurs.
:php:meth:`CakeResponse::cache()` définit valeur ``Last-Modified`` en
premier argument. L'entête ``Expires`` et ``max-age`` sont définis en se basant
sur le second paramètre. Le Cache-Control est défini aussi à ``public``.

.. _cake-response-caching:

Réglage fin du Cache HTTP
-------------------------

Une des façons les meilleures et les plus simples de rendre votre application
plus rapide est d'utiliser le cache HTTP. Selon ce modèle de mise en cache,
vous êtes tenu seulement d'aider les clients à décider s'ils doivent utiliser
une copie de la réponse mise en cache en définissant quelques propriétés
d'en-têtes comme la date de mise à jour et la balise entity de réponse.

Plutôt que d'avoir à coder la logique de mise en cache et de sa désactivation
(rafraîchissement) une fois que les données ont changé, HTTP utilise deux
modèles, l'expiration et la validation qui habituellement sont beaucoup plus
simples que d'avoir à gérer le cache soi-même.

En dehors de l'utilisation de :php:meth:`Cake\\Network\\Response::cache()`, vous
pouvez aussi utiliser plusieurs autres méthodes pour affiner le réglage des
en-têtes de cache HTTP pour tirer profit du navigateur ou à l'inverse du cache
du proxy.

L'En-tête de Contrôle du Cache
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: sharable($public = null, $time = null)

Utilisé sous le modèle d'expiration, cet en-tête contient de multiples
indicateurs qui peuvent changer la façon dont les navigateurs ou les proxies
utilisent le contenu mis en cache. Un en-tête ``Cache-Control`` peut ressembler
à ceci::

    Cache-Control: private, max-age=3600, must-revalidate

La classe ``Response`` vous aide à configurer cet en-tête avec quelques
méthodes utiles qui vont produire un en-tête final ``Cache Control`` valide.
La première est la méthode :php:meth:`Cake\\Network\\Response::sharable()`,
qui indique si une réponse peut être considérée comme partageable pour
différents utilisateurs ou clients. Cette méthode contrôle en fait la
partie `public` ou `private` de cet en-tête. Définir une réponse en `private`
indique que tout ou partie de celle-ci est prévue pour un unique utilisateur.
Pour tirer profit des mises en cache partagées, il est nécessaire de définir la
directive de contrôle en `public`.

Le deuxième paramètre de cette méthode est utilisé pour spécifier un ``max-age``
pour le cache qui est le nombre de secondes après lesquelles la réponse n'est
plus considérée comme récente::

    public function view()
    {
        ...
        // Définit le Cache-Control en public pour 3600 secondes
        $this->response->sharable(true, 3600);
    }

    public function mes_donnees()
    {
        ...
        // Définit le Cache-Control en private pour 3600 secondes
        $this->response->sharable(false, 3600);
    }

``Response`` expose des méthodes séparées pour la définition de chaque component
dans l'en-tête de ``Cache-Control``.

L'En-tête d'Expiration
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: expires($time = null)

Vous pouvez définir l'en-tête ``Expires`` avec une date et un temps après
lesquels la réponse n'est plus considérée comme récente. Cet en-tête peut être
défini en utilisant la méthode :php:meth:`Cake\\Network\\Response::expires()`::

    public function view()
    {
        $this->response->expires('+5 days');
    }

Cette méthode accepte aussi une instance :php:class:`DateTime` ou toute chaîne
de caractère qui peut être parsée par la classe :php:class:`DateTime`.

L'En-tête Etag
~~~~~~~~~~~~~~

.. php:method:: etag($tag = null, $weak = false)

La validation du Cache dans HTTP est souvent utilisée quand le contenu change
constamment et demande à l'application de générer seulement les contenus de la
réponse si le cache n'est plus récent. Sous ce modèle, le client continue
de stocker les pages dans le cache, mais au lieu de l'utiliser directement,
il demande à l'application à chaque fois si les ressources ont changé ou non.
C'est utilisé couramment avec des ressources statiques comme les images et
autres choses.

La méthode :php:meth:`~CakeResponse::etag()` (appelée balise d'entité) est une
chaîne de caractère qui identifie de façon unique les ressources requêtées
comme le fait un checksum pour un fichier, afin de déterminer si elle
correspond à une ressource du cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez
soit appeler manuellement la méthode
:php:meth:`Cake\\Network\\Response::checkNotModified()` ou inclure
:php:class:`RequestHandlerComponent` dans votre controller::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $this->response->etag($this->Articles->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

.. note::

    La plupart des utilisateurs proxy devront probablement penser à utiliser
    l'en-tête Last Modified plutôt que Etags pour des raisons de performance et
    de compatibilité.

L'En-tête Last-Modified
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: modified($time = null)

De même, avec le modèle de validation du cache HTTP, vous pouvez définir
l'en-tête ``Last-Modified`` pour indiquer la date et l'heure à laquelle la
ressource a été modifiée pour la dernière fois. Définir cet en-tête aide CakePHP
à indiquer à ces clients si la réponse a été modifiée ou n'est pas basée sur
leur cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez soit
appeler manuellement la méthode
:php:meth:`Cake\\Network\\Response::checkNotModified()` ou inclure
:php:class:`RequestHandlerComponent` dans votre controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $this->response->modified($article->modified);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

L'En-tête Vary
~~~~~~~~~~~~~~

.. php:method:: vary($header)

Dans certains cas, vous voudrez offrir différents contenus en utilisant la même
URL. C'est souvent le cas quand vous avez une page multilingue ou que vous
répondez avec différentes pages HTML selon le navigateur qui requête la
ressource. Dans ces circonstances, vous pouvez utiliser l'en-tête ``Vary``::

        $this->response->vary('User-Agent');
        $this->response->vary('Accept-Encoding', 'User-Agent');
        $this->response->vary('Accept-Language');

Envoyer des Réponses Non-Modifiées
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

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

1. La requête a un en-tête ``Origin``.
2. La valeur ``Origin`` de la requête correspond à une des valeurs autorisées de
   Origin.

.. versionadded:: 3.2
    ``CorsBuilder`` a été ajouté dans 3.2

Envoyer la Réponse
------------------

.. php:method:: send()

Une fois que vous avez fini de créer une réponse, appeler ``send()`` va envoyer
tous les en-têtes définis ainsi que le corps. Ceci est fait automatiquement à la
fin de chaque requête par le ``Dispatcher``.

.. meta::
    :title lang=fr: Objets Request et Response
    :keywords lang=fr: requête controller,paramètres de requête,tableaux indicés,purpose index,objets réponse,information domaine,Objet requête,donnée requêtée,interrogation,params,précédentes versions,introspection,dispatcher,rout,structures de données,tableaux,adresse ip,migration,indexes,cakephp
