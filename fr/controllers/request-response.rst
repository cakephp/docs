Les Objets Request et Response
##############################

.. php:namespace:: Cake\Network

The request and response objects provide an abstraction around HTTP request and
responses. The request object in CakePHP allows you to easily introspect an
incoming request, while the response object allows you to effortlessly create
HTTP responses from your controllers.

.. index:: $this->request
.. _cake-request:

Request
#######

:php:class:`Cake\\Network\\Request` est l'objet requête utilisé par défaut dans
CakePHP. Il centralise un certain nombre de fonctionnalités pour interroger et
interagir avec les données demandées. Pour chaque requête, une Request est
créée et passée en référence aux différentes couches de l'application que la
requête de données utilise. Par défaut ``Request`` est assignée à
``$this->request``, et est disponible dans les Controllers, Vues et Helpers.
Vous pouvez aussi y accéder dans les Components en utilisant la référence du
controller. Certaines des tâches incluses que ``Request`` permet :

* Transformer les tableaux GET, POST, et FILES en structures de données avec
  lesquelles vous êtes familiers.
* Fournir une introspection de l'environnement se rapportant à la demande.
  Des choses comme les envois d'en-têtes (headers), l'adresse IP du client et
  les informations des sous-domaines/domaines sur lesquels le serveur de
  l'application tourne.
* Fournit un accès aux paramètres de la requête à la fois en tableaux indicés
  et en propriétés d'un objet.

Accéder aux paramètres de la requête
====================================

Request propose plusieurs interfaces pour accéder aux paramètres de la
requête. La première est par des tableaux indexés, la seconde est à travers
``$this->request->params``, et la troisième est par des propriétés d'objets::

    $this->request['controller'];
    $this->request->controller;
    $this->request->params['controller']

Tout ce qui est au-dessus retournera la même valeur. Plusieurs façons d'accéder
aux paramètres ont été faites pour faciliter la migration des applications
existantes. Tous les éléments de route :ref:`route-elements` sont accessibles
à travers cette interface.

En plus des éléments de routes :ref:`route-elements`, vous avez souvent besoin
d'accéder aux arguments passés :ref:`passed-arguments`. Ceux-ci sont aussi tous
les deux disponibles dans l'objet request::

    // Arguments passés
    $this->request['pass'];
    $this->request->pass;
    $this->request->params['pass'];

Il vous fournira un accès aux arguments passés et aux paramètres nommés.
Il y a de nombreux paramètres importants et utiles que CakePHP utilise en
interne, on peut auusi les trouver dans les paramètres de la requête:

* ``plugin`` Le plugin gérant la requête, va être nul pour les non-plugins.
* ``controller`` Le controller gère la requête courante.
* ``action`` L'action gère la requête courante.
* ``prefix`` Le prefixe pour l'action courante. Voir :ref:`prefix-routing` pour
  plus d'informations.
* ``bare`` Présent quand la requête vient de
  :php:meth:`~Controller::requestAction()` et inclut l'option bare. Les requêtes
  vides n'ont pas de layout de rendu.
* ``requested`` Présent et mis à true quand l'action vient de
  :php:meth:`~Controller::requestAction()`.

Accéder aux paramètres Querystring
==================================

Les paramètres Querystring peuvent être lus en utilisant
:php:attr:`~Cake\\Network\\Request::$query`::

    // l'URL est /posts/index?page=1&sort=title
    $this->request->query['page'];

    //  Vous pouvez aussi y accéder par un tableau
    // accesseur BC, va être déprécié dans les versions futures
    $this->request['url']['page'];

Vous pouvez soit directement accéder à la prorpiété requêtée, soit vous pouvez
utiliser php:meth:`~Cake\\Network\\Request::query()` pour lire l'URL requêtée
d'une manière sans erreur. Toute clé qui n'existe pas va retourner ``null``::

    $foo = $this->request->query('value_that_does_not_exist');
    // $foo === null

Accéder aux données POST
========================

Toutes les données POST peuvent être atteintes à travers
:php:meth:`Cake\\Network\\Request::data()`. N'importe quelle forme de tableau
qui contient un prefixe ``data``, va avoir sa donnée prefixée retirée. Par
exemple::

    // Un input avec un nom attribute égal à 'MyModel[title]' est accessible
    $this->request->data('MyModel.title');

Toute clé qui n'existe pas va retourner ``null``::

    $foo = $this->request->data('Value.that.does.not.exist');
    // $foo == null

Accéder aux données PUT, PATCH ou DELETE
========================================

Quand vous construisez des services REST, vous acceptez souvent des données
requêtées sur des requêtes ``PUT`` et ``DELETE``. Depuis 2.2, toute donnée
de corps de requête ``application/x-www-form-urlencoded``
va automatiquement être parsée et définie dans ``$this->data`` pour les
requêtes ``PUT`` et ``DELETE``. Si vous acceptez les données JSON ou XML,
regardez ci-dessous comment vous pouvez accéder aux corps de ces requêtes.

Accéder / Configurer les Variables d'Environment (à partir de $_SERVER et $_ENV)
================================================================================

.. versionadded:: 3.0

:php:meth:`Cake\\Network\\Request::env()` est un wrapper pour la fonction
globale ``env()`` et agit comme un getter/setter pour les variables
d'environnement sans avoir à modifier les variables globales
``$_SERVER`` et ``$_ENV``::

    //Obtenir une valeur
    $value = $this->request->env('HTTP_HOST');

    //Définir une valeur. Généralement utile pour les tests.
    $this->request->env('REQUEST_METHOD', 'POST');

Accéder aux données XML ou JSON
===============================

Les applications employant :doc:`/development/rest` échangent souvent des
données dans des organes post non encodées en URL. Vous pouvez lire les données
entrantes dans n'importe quel format en utilisant
:php:meth:`~Cake\\Network\\Request::input()`. En fournissant une fonction de
décodage, vous pouvez recevoir le contenu dans un format déserializé::

    // Obtenir les données encodées JSON soumises par une action PUT/POST
    $data = $this->request->input('json_decode');

Puisque certaines méthodes de desérialization ont besoin de paramètres
supplémentaires quand elles sont appelées, comme le paramètre
de type tableau pour ``json_decode`` ou si vous voulez
convertir les XML en objet DOMDocument,
:php:meth:`~Cake\\Network\\Request::input()` supporte aussi le passement dans
des paramètres supplémentaires::

    // Obtenir les données encodées en Xml soumises avec une action PUT/POST
    $data = $this->request->input('Xml::build', array('return' => 'domdocument'));

Accéder aux informations du chemin
==================================

L'objet request fournit aussi des informations utiles sur les chemins dans votre
application. :php:attr:`Cake\\Network\\Request::$base` et
:php:attr:`Cake\\Network\\Request::$webroot` sont utiles pour générer des URLs,
et déterminer si votre application est ou n'est pas dans un sous-dossier.

.. _check-the-request:

Inspecter la requête
====================

L'objet request fournit une façon d'inspecter différentes conditions de la
requête utilisée. En utilisant la méthode ``is()``, vous pouvez vérifier un
certain nombre de conditions, ainsi qu'inspecter d'autres critères de
la requête spécifique à l'application::


    $this->request->is('post');

Vous pouvez aussi facilement étendre les detecteurs de la requête qui sont
disponibles, en utilisant :php:meth:`Cake\\Network\\Request::addDetector()`
pour créer de nouveaux types de detecteurs. Il y a quatre différents types
de detecteurs que vous pouvez créer:

* Comparaison avec valeur d'environnement - Une comparaison de la valeur
  d'environnement, compare une valeur attrapée à partir de :php:func:`env()`
  pour une valeur connue, la valeur d'environnement est vérifiée équitablement
  avec la valeur fournie.
* La comparaison de la valeur model - La comparaison de la valeur model vous
  autorise à comparer une valeur attrapée à partir de :php:func:`env()` avec
  une expression régulière.
* Comparaison basée sur les options -  La comparaison basée sur les options
  utilise une liste d'options pour créer une expression régulière. De tels
  appels pour ajouter un détecteur d'options déjà défini, va fusionner les
  options.
* Les détecteurs de Callback - Les détecteurs de Callback vous permettront de
  fournir un type 'callback' pour gérer une vérification. Le callback va
  recevoir l'objet requête comme seul paramètre.

Quelques exemples seraient::

    // Ajouter un détecteur d'environment.
    $this->request->addDetector(
        'post',
        array('env' => 'REQUEST_METHOD', 'value' => 'POST')
    );
    
    // Ajouter un détecteur de valeur model.
    $this->request->addDetector(
        'iphone',
        array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i')
    );
    
    // Ajouter un détecteur d'options
    $this->request->addDetector('internalIp', array(
        'env' => 'CLIENT_IP', 
        'options' => array('192.168.0.101', '192.168.0.100')
    ));
    
    // Ajouter un détecteur de callback. Peut soit être une fonction anonyme ou un callback régulier.
    $this->request->addDetector('awesome', array('callback' => function ($request) {
        return isset($request->awesome);
    }));

``Request`` inclut aussi des méthodes comme
:php:meth:`Cake\\Network\\Request::domain()`,
:php:meth:`Cake\\Network\\Request::subdomains()`
et :php:meth:`Cake\\Network\\Request::host()` qui facilitent la vie des
applications avec sous-domaines.

Vous pouvez utiliser plusieurs détecteurs intégrés:

* ``is('get')`` Vérifie si la requête courante est un GET.
* ``is('put')`` Vérifie si la requête courante est un PUT.
* ``is('post')`` Vérifie si la requête courante est un POST.
* ``is('delete')`` Vérifie si la requête courante est un DELETE.
* ``is('head')`` Vérifie si la requête courante est un HEAD.
* ``is('options')`` Vérifie si la requête courante est OPTIONS.
* ``is('ajax')`` Vérifie si la requête courante vient d'un
  X-Requested-with = XmlHttpRequest.
* ``is('ssl')`` Vérifie si la requête courante est via SSL.
* ``is('flash')`` Vérifie si la requête courante a un User-Agent
  de Flash.
* ``is('mobile')`` Vérifie si la requête courante vient d'une liste
  courante de mobiles.

Interagir avec les autres aspects de la requête
===============================================

Vous pouvez utiliser `Request` pour voir une quantité de choses sur la
requête. Au-delà des détecteurs, vous pouvez également trouver d'autres
informations sur les diverses propriétés et méthodes.

* ``$this->request->webroot`` contient le répertoire webroot.
* ``$this->request->base`` contient le chemin de base.
* ``$this->request->here`` contient l'adresse complète de la requête courante.
* ``$this->request->query`` contient les paramètres de la chaîne de requête.


API de Request
==============

.. php:class:: Request

    Request encapsule la gestion des paramètres de la requête, et son
    introspection.

.. php:method:: env($key, $value = null)

    Getter / setter pour les variables d'environnement.

.. php:method:: domain($tldLength = 1)

    Retourne le nom de domaine sur lequel votre application tourne.

.. php:method:: subdomains($tldLength = 1)

    Retourne un tableau avec le sous-domaine sur lequel votre application
    tourne.

.. php:method:: host()

    Retourne l'hôte où votre application tourne.

.. php:method:: method()

    Retourne la méthode HTTP où la requête a été faite.

.. php:method:: onlyAllow($methods)

    Définit les méthodes HTTP autorisées, si elles ne correspondent pas, elle
    va lancer une MethodNotAllowedException.
    La réponse 405 va inclure l'en-tête ``Allow`` nécessaire avec les méthodes
    passées.

.. php:method:: referer($local = false)

    Retourne l'adresse de référence de la requête.

.. php:method:: clientIp($safe = true)

    Retourne l'adresse IP du visiteur courant.

.. php:method:: header($name)

    Vous permet d'accéder à tout en-tête ``HTTP_*`` utilisé pour la requête::

        $this->request->header('User-Agent');

    Retournerait le user agent utilisé pour la requête.

.. php:method:: input($callback, [$options])

    Récupère les données d'entrée pour une requête, et les passe
    optionnellement à travers une fonction qui décode. Utile lors des
    interactions avec une requête de contenu de corps XML ou JSON. Les
    paramètres supplémentaires pour la fonction décodant peuvent être passés
    comme des arguments de input()::

        $this->request->input('json_decode');

.. php:method:: data($name)

    Fournit une notation en point pour accéder aux données requêtées. Permet
    la lecture et la modification des données requêtées, les appels peuvent
    aussi être chaînés ensemble::

        // Modifier une donnée requêtée, ainsi vous pouvez pré-enregistrer certains champs.
        $this->request->data('Post.title', 'New post')
            ->data('Comment.1.author', 'Mark');
            
        // Vous pouvez aussi lire des données.
        $value = $this->request->data('Post.title');

.. php:method:: query($name)

    Fournit un accès aux données requêtées de l'URL avec notation en point::

        // l\'URL est /posts/index?page=1&sort=title
        $value = $this->request->query('page');

.. php:method:: is($type)

    Vérifie si la requête remplit certains critères ou non. Utilisez
    les règles de détection déjà construites ainsi que toute règle
    supplémentaire définie dans
    :php:meth:`Cake\\Network\\Request::addDetector()`.

.. php:method:: addDetector($name, $options)

    Ajoute un détecteur pour être utilisé avec :php:meth:`CakeRequest::is()`.
    Voir :ref:`check-the-request` pour plus d'informations.

.. php:method:: accepts($type = null)

    Trouve quels types de contenu le client accepte ou vérifie si ils acceptent
    un type particulier de contenu.

    Récupère tous les types::

        $this->request->accepts();

    Vérifie pour un unique type::

        $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language = null)

    Obtenir toutes les langues acceptées par le client,
    ou alors vérifier si une langue spécifique est acceptée.

    Obtenir la liste des langues acceptées::

        $this->request->acceptLanguage();

    Vérifier si une langue spécifique est acceptée::

        $this->request->acceptLanguage('es-es');

.. php:method:: param($name)

    Lit les valeurs en toute sécurité dans ``$request->params``. Celle-ci
    enlève la nécessité d'appeler ``isset()`` ou ``empty()`` avant
    l'utilisation des valeurs de param.

.. php:attr:: data

    Un tableau de données POST. Vous pouvez utiliser
    :php:meth:`Cake\\Network\\Request::data()` pour lire cette propriété
    d'une manière qui supprime les erreurs notice.

.. php:attr:: query

    Un tableau des paramètres de chaîne requêtés.

.. php:attr:: params

    Un tableau des éléments de route et des paramètres requêtés.

.. php:attr:: here

    Retourne l'URL requêtée courante.

.. php:attr:: base

    Le chemin de base de l'application, normalement ``/``, à moins que votre
    application soit dans un sous-répertoire.

.. php:attr:: webroot

    Le webroot courant.

.. index:: $this->response

Response
########

:php:class:`Cake\\Network\\Response` est la classe de réponse par défaut dans
CakePHP. Elle encapsule un nombre de fonctionnalités et de caractéristiques
pour la génération de réponses HTTP dans votre application. Elle aide aussi à
tester puisqu'elle peut être mocked/stubbed, vous permettant d'inspecter les
en-têtes qui vont être envoyés.
Comme :php:class:`Cake\\Network\\Request`, :php:class:`Cake\\Network\\Response`
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
==========================

CakePHP utilise ``Response`` par défaut. ``Response`` est flexible et
transparente pour l'utilisation de la classe. Si vous avez besoin de la
remplacer avec une classe spécifique de l'application, vous pouvez l'écraser
et remplacer ``Response`` avec votre propre classe en remplaçant la
classe Response utilisée dans index.php.

Cela fera que tous les controllers dans votre application utiliseront
``VotreResponse`` au lieu de :php:class:`Cake\\Network\\Response`. Vous pouvez
aussi remplacer l'instance de réponse de la configuration
``$this->response`` dans vos controllers. Ecraser l'objet réponse
est à portée de main pour les tests car il vous permet d'écraser les
méthodes qui interragissent avec :php:meth:`~CakeResponse::header()`. Voir la
section sur :ref:`cakeresponse-testing` pour plus d'informations.

Gérer les types de contenu
==========================

Vous pouvez contrôler le Content-Type des réponses de votre application
en utilisant :php:meth:`Cake\\Network\\Response::type()`. Si votre application
a besoin de gérer les types de contenu qui ne sont pas construits dans Response,
vous pouvez faire correspondre ces types avec ``type()`` comme ceci::

    // Ajouter un type vCard
    $this->response->type(['vcf' => 'text/v-card']);

    // Configurer la réponse de Type de Contenu pour vcard.
    $this->response->type('vcf');

Habituellement, vous voudrez faire correspondre des types de contenu
supplémentaires dans le callback :php:meth:`~Controller::beforeFilter()` de
votre controller, afin que vous puissiez tirer parti de la fonctionnalité de
vue de commutation automatique de :php:class:`RequestHandlerComponent`, si vous
l'utilisez.

.. _cake-response-file:

Envoyer des fichiers
====================

Il y a des fois où vous voulez envoyer des fichiers en réponses de vos
requêtes. Vous pouvez faire cela en utilisant
:php:meth:`Cake\\Network\\Response::file()`::

    public function sendFile($id) {
        $file = $this->Attachment->getFile($id);
        $this->response->file($file['path']);
        //Retourne un objet reponse pour éviter que le controller n'essaie de
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
        array('download' => true, 'name' => 'foo')
    );

Envoyer une chaîne en fichier
=============================

Vous pouvez répondre avec un fichier qui n'existe pas sur le disque, par
exemple si vous voulez générer un pdf ou un ics à la volée et voulez servir la
chaîne générée en fichier, vous pouvez faire cela en utilisant::

    public function sendIcs() {
        $icsString = $this->Calendar->generateIcs();
        $this->response->body($icsString);
        $this->response->type('ics');

        //Force le téléchargement de fichier en option
        $this->response->download('filename_for_download.ics');

        //Retourne l'object pour éviter au controller d'essayer de rendre
        // une vue
        return $this->response;
    }

Définir les en-têtes
====================

Le réglage des en-têtes est fait avec la métode
:php:meth:`Cake\\Network\\Response::header()`. Elle peut être appelée avec
quelques paramètres de configurations::

    // Régler un unique en-tête
    $this->response->header('Location', 'http://example.com');

    // Régler plusieurs en-têtes
    $this->response->header(array(
        'Location' => 'http://example.com',
        'X-Extra' => 'My header'
    ));
    $this->response->header(array(
        'WWW-Authenticate: Negotiate',
        'Content-type: application/pdf'
    ));

Régler le même en-tête de multiples fois entraînera l'écrasement des
précédentes valeurs, un peu comme les appels réguliers d'en-tête. Les en-têtes
ne sont aussi pas envoyés quand :php:meth:`Cake\\Network\\Response::header()`
est appelé; à la place, ils sont simplement conservés jusqu'à ce que la réponse soit
effectivement envoyée.

Vous pouvez maintenant utiliser la méthode pratique
:php:meth:`Cake\\Network\\Response::location()` pour directement définir ou
récupérer l'en-tête de localisation du redirect.

Interagir avec le cache du navigateur
======================================

Vous avez parfois besoin de forcer les navigateurs à ne pas mettre en cache les
résultats de l'action d'un controller.
:php:meth:`Cake\\Network\\Response::disableCache()` est justement prévu pour
cela::

    public function index() {
        // faire quelque chose.
        $this->response->disableCache();
    }

.. warning::

    En utilisant disableCache() avec downloads à partir de domaines SSL pendant
    que vous essayez d'envoyer des fichiers à Internet Explorer peut entraîner
    des erreurs.

Vous pouvez aussi dire aux clients que vous voulez qu'ils mettent en cache
des réponses. En utilisant :php:meth:`Cake\\Network\\Response::cache()`::

    public function index() {
        //faire quelque chose
        $this->response->cache('-1 minute', '+5 days');
    }

Ce qui est au-dessus dira aux clients de mettre en cache la réponse résultante
pendant 5 jours, en espérant accélerer l'expérience de vos visiteurs.
:php:meth:`CakeResponse::cache()` définit valeur ``Last-Modified`` en
premier argument. Expires, et ``max-age`` sont définis en se basant sur le
second paramètre. Le Cache-Control est défini aussi à ``public``.


.. _cake-response-caching:

Réglage fin du Cache HTTP
=========================

Une des façons les meilleures et les plus simples de rendre votre application
plus rapide est d'utiliser le cache HTTP. Avec la mise en cache des models,
vous n'avez qu'à aider les clients à décider si ils doivent utiliser une
copie mise en cache de la réponse en configurant un peu les en-têtes comme les
temps modifiés, les balise d'entité de réponse et autres.

Opposé à l'idée d'avoir à coder la logique de mise en cache et de sa nullité
(rafraîchissement) une fois que les données ont changé, HTPP utilise deux
models, l'expiration et la validation qui habituellement sont beaucoup plus
simples que d'avoir à gérer le cache soi-même.

En dehors de l'utilisation de :php:meth:`Cake\\Network\\Response::cache()` vous
pouvez aussi utiliser plusieurs autres méthodes pour affiner le réglage des
en-têtes de cache HTTP pour tirer profit du navigateur ou à l'inverse du cache
du proxy.

L'en-tête de Cache Control
--------------------------

.. versionadded:: 2.1

Utilisé sous le model d'expiration, cet en-tête contient de multiples
indicateurs qui peuvent changer la façon dont les navigateurs ou les
proxies utilisent le contenu mis en cache. Un en-tête ``Cache-Control`` peut
ressembler à ceci::

    Cache-Control: private, max-age=3600, must-revalidate

La classe ``Response`` vous aide à configurer cet en-tête avec quelques
méthodes utiles qui vont produire un en-tête final valide ``Cache Control``.
Premièrement il y a la méthode :php:meth:`Cake\\Network\\Response::sharable()`,
qui indique si une réponse peut être considerée comme partageable pour
différents utilisateurs ou clients. Cette méthode contrôle généralement la
partie `public` ou `private` de cet en-tête. Définir une réponse en privé
indique que tout ou une partie de celle-ci est prévue pour un unique
utilisateur. Pour tirer profit des mises en cache partagées, il est nécessaire
de définir la directive de contrôle en publique.

Le deuxième paramètre de cette méthode est utilisé pour spécifier un ``max-age``
pour le cache, qui est le nombre de secondes après lesquelles la réponse n'est
plus considérée comme récente::

    public function view() {
        ...
        // Défini le Cache-Control en public pour 3600 secondes
        $this->response->sharable(true, 3600);
    }

    public function mes_donnees() {
        ...
        // Défini le Cache-Control en private pour 3600 secondes
        $this->response->sharable(false, 3600);
    }

``Response`` expose des méthodes séparées pour la définition de chaque
component dans l'en-tête de ``Cache-Control``.

L'en-tête d'Expiration
----------------------

Aussi sous le model d'expiration de cache, vous pouvez définir l'en-tête
``Expires``, qui selon la spécification HTTP est la date et le temps après que
la réponse ne soit plus considerée comme récente. Cet en-tête peut être défini
en utilisant la méthode :php:meth:`Cake\\Network\\Response::expires()`::

    public function view() {
        $this->response->expires('+5 days');
    }

Cette méthode accepte aussi une instance :php:class:`DateTime` ou toute chaîne
de caractère qui peut être parsée par la classe :php:class:`DateTime`.

L'en-tête Etag
--------------

Cache validation dans HTTP est souvent utilisé quand le contenu change
constamment et demande à l'application de générer seulement les contenus
réponse si le cache n'est plus récent. Sous ce model, le client continue
de stocker les pages dans le cache, mais au lieu de l'utiliser directement,
il demande à l'application à chaque fois si les ressources ont changé ou non.
C'est utilisé couramment avec des ressources statiques comme les images et
autres choses.

L'en-tête :php:meth:`~CakeResponse::etag()` (appelé balise d'entité) est une
chaîne de caractère qui identifie de façon unique les ressources requêtées. Il
est très semblable à la somme de contrôle d'un fichier; la mise en cache
permettra de comparer les sommes de contrôle pour savoir si elles correspondent
ou non.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez
soit appeler manuellement la méthode
:php:meth:`Cake\\Network\\Response::checkNotModified()`, soit avoir le
:php:class:`RequestHandlerComponent` inclu dans votre controller::

    public function index() {
        $articles = $this->Article->find('all');
        $this->response->etag($this->Article->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

L'en-tête Last-Modified
-----------------------

Toujours dans le cadre du model de validation du cache HTTP, vous pouvez
définir l'en-tête ``Last-Modified`` pour indiquer la date et le temps pendant
lequel la ressource a été modifiée pour la dernière fois. Définir cet en-tête
aide la réponse de CakePHP pour mettre en cache les clients si la réponse a été
modifiée ou n'est pas basée sur leur cache.

Pour réellement tirer profit de l'utilisation de cet en-tête, vous devez
soit appeler manuellement la méthode
:php:meth:`Cake\\Network\\Response::checkNotModified()`, soit avoir le
:php:class:`RequestHandlerComponent` inclu dans votre controller::

    public function view() {
        $article = $this->Article->find('first');
        $this->response->modified($article['Article']['modified']);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

L'en-tête Vary
--------------

Dans certains cas, vous voudrez offrir différents contenus en utilisant la
même URL. C'est souvent le cas quand vous avez une page multilingue ou que
vous répondez avec différents HTMLs selon le navigateur qui requête la
ressource. Dans ces circonstances, vous pouvez utiliser l'en-tête ``Vary``::

        $this->response->vary('User-Agent');
        $this->response->vary('Accept-Encoding', 'User-Agent');
        $this->response->vary('Accept-Language');

.. _cakeresponse-testing:

Response et les tests
=====================

Probablement l'une des plus grandes victoires de ``Response`` vient de
la façon dont il facilite les tests des controllers et des components. Au lieu
d'avoir des méthodes répandues à travers plusieurs objets, vous avez un seul
objet pour mocker pendant que les controllers et les components déleguent à
``Response``. Cela vous aide à rester plus près d'un test 'unit' et
facilite les tests des controllers::

    public function testSomething() {
        $this->controller->response = $this->getMock('Cake\Network\Response');
        $this->controller->response->expects($this->once())->method('header');
        // ...
    }

De plus, vous pouvez faciliter encore plus l'exécution des tests à partir d'une
ligne de commande, pendant que vous pouvez mocker pour éviter les erreurs
'd'envois d'en-têtes' qui peuvent arriver en essayant de configurer les
en-têtes dans CLI.

API de Response
===============

.. php:class:: Response

    Response fournit un nombre de méthodes utiles pour interagir avec la
    réponse que vous envoyez à un client.

.. php:method:: header($header = null, $value = null)

    Vous permet de configurer directement un ou plusieurs en-têtes à
    envoyer avec la réponse.

.. php:method:: location($url = null)

    Vous permet de définir directement l'en-tête de localisation du redirect
    à envoyer avec la réponse::

        // Définit la localisation du redirect
        $this->response->location('http://example.com');

        // Récupère l'en-tête de localisation du redirect actuel
        $location = $this->response->location();

.. php:method:: charset($charset = null)

    Configure le charset qui sera utilisé dans la réponse.

.. php:method:: type($contentType = null)

    Configure le type de contenu pour la réponse. Vous pouvez soit utiliser un
    alias de type de contenu connu, soit le nom du type de contenu complet.

.. php:method:: cache($since, $time = '+1 day')

    Vous permet de configurer les en-têtes de mise en cache dans la réponse.

.. php:method:: disableCache()

    Configure les en-têtes pour désactiver la mise en cache des clients pour la
    réponse.

.. php:method:: sharable($public = null, $time = null)

    Configure l'en-tête ``Cache-Control`` pour être soit ``public`` soit
    ``private`` et configure optionnellement une directive de la ressource à un
    ``max-age``.

.. php:method:: expires($time = null)

    Permet de configurer l'en-tête ``Expires`` à une date spécifique.

.. php:method:: etag($tag = null, $weak = false)

    Configure l'en-tête ``Etag`` pour identifier de manière unique une ressource
    de réponse.

.. php:method:: modified($time = null)

    Configure l'en-tête ``Last-modified`` à une date et un temps donné dans
    le format correct.

.. php:method:: checkNotModified(Request $request)

    Compare les en-têtes mis en cache pour l'objet request avec l'en-tête mis
    en cache de la réponse et détermine si il peut toujours être considéré
    comme récent. Dans ce cas, il supprime tout contenu de réponse et envoie
    l'en-tête `304 Not Modified`.

.. php:method:: compress()

    Démarre la compression gzip pour la requête.

.. php:method:: download($filename) 

    Vous permet d'envoyer la réponse en pièce jointe et de configurer
    le nom de fichier.

.. php:method:: statusCode($code = null)

    Vous permet de configurer le code de statut pour la réponse.

.. php:method:: body($content = null)

    Configurer le contenu du body pour la réponse.

.. php:method:: send()

    Une fois que vous avez fini de créer une réponse, appeler send() enverra
    tous les en-têtes configurés ainsi que le body. Ceci est fait
    automatiquement à la fin de chaque requête par :php:class:`Dispatcher`.

.. php:method:: file($path, $options = [])

    Vous permet de définir le header ``Content-Disposition`` d'un fichier
    soit à afficher, soit à télécharger.

    ``name``
        Le name vous permet de spécifier un nom de fichier alternatif à envoyer
        à l'utilisateur.

    ``download``
        Une valeur boléenne indiquant si les headers doivent être définis pour
        forcer le téléchargement.


.. meta::
    :title lang=fr: Objets Request et Response
    :keywords lang=fr: requête controller,paramètres de requête,tableaux indicés,purpose index,objets réponse,information domaine,Objet requête,donnée requêtée,interrogation,params,précédentes versions,introspection,dispatcher,rout,structures de données,tableaux,adresse ip,migration,indexes,cakephp
