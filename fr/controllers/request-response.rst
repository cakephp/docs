Les Objets Request et Response
##############################

Les objets request et response sont nouveaux depuis CakePHP 2.0. Dans les 
versions précédentes, ces objets étaient représentés à travers des array, 
et les méthodes liées étaient utilisées à travers 
:php:class:`RequestHandlerComponent`, :php:class:`Router`, 
:php:class:`Dispatcher` et :php:class:`Controller`. Il n'y avait pas d'objet 
global qui reprenait les informations de la requête. Pour CakePHP 2.0, 
:php:class:`CakeRequest` et :php:class:`CakeResponse` sont utilisés pour cela.

.. index:: $this->request
.. _cake-request:

CakeRequest
###########

:php:class:`CakeRequest` est l'objet requête utilisé par défaut dans CakePHP. 
Il centralise un certain nombre de fonctionnalités pour interroger et intéragir 
avec les données demandées. Pour chaque requête, une CakeRequest est créée et 
passée en référence aux différentes couches de l'application que la requête de 
données utilise. Par défaut ``CakeRequest`` est assignée à ``$this->request``, 
et est disponible dans les Controllers, Vues et Helpers. Vous pouvez aussi y 
accéder dans les Components en utilisant la référence du controller. Certaines 
des tâches incluses que ``CakeRequest`` permet :

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

CakeRequest propose plusieurs interfaces pour accéder aux paramètres de la 
requête. La première est des tableaux indexés, la seconde est à travers 
``$this->request->params``, et la troisième est des propriétés d'objets::

    $this->request['controller'];
    $this->request->controller;
    $this->request->params['controller']

Tout ce qui est au-dessus retournera la même valeur. Plusieurs façons d'accéder
aux paramètres a été fait pour faciliter la migration des applications 
existantes. Tous les éléments de route :ref:`route-elements` sont accessibles 
à travers cette interface.

En plus des éléments de routes :ref:`route-elements`, vous avez souvent besoin 
d'accéder aux arguments passés :ref:`passed-arguments` et aux paramètres nommés 
:ref:`named-parameters`. Ceux-ci sont aussi tous les deux disponibles dans 
l'objet request::

    // Arguments passés
    $this->request['pass'];
    $this->request->pass;
    $this->request->params['pass'];

    // Paramètres nommés
    $this->request['named'];
    $this->request->named;
    $this->request->params['named'];

Il vous fournira un accès aux arguments passés et ax paramètres nommés.
Il y a de nombreux paramètres importants et utiles que CakePHP utilise en
interne, il sont aussi trouvables dans les paramètres de la requête:

* ``plugin`` Le plugin gèrant la requête, va être nul pour les non-plugins.
* ``controller`` Le controller gère la requête courante.
* ``action`` L'action gère la requête courante.
* ``prefix`` Le prefixe pour l'action courante. Voir :ref:`prefix-routing` pour 
  plus d'informations.
* ``bare`` Présent quand la requête vient de requestAction() et inclut l'option 
  bare. Les requêtes vides n'ont pas de layout de rendu.
* ``requested`` Présent et mis à true quand l'action vient de requestAction.

Accéder aux paramètres Querystring
==================================

Les paramètres Querystring peuvent être lus en utilisant 
:php:attr:`CakeRequest::$query`::

    // url est /posts/index?page=1&sort=title
    $this->request->query['page'];

    //  Vous pouvez aussi y accéder par un tableau d'accès
    $this->request['url']['page'];

Accéder aux données POST
========================

Toutes les données POST peuvent être atteintes à travers 
:php:attr:`CakeRequest::$data`. N'importe quelle forme de tableau qui contient 
un prefixe ``data``, va avoir sa donnée prefixée retirée. Par exemple::

    // Un input avec un nom attribute égal à 'data[Post][title]' est accessible 
    à $this->request->data['Post']['title'];

Vous pouvez soit accéder directement à la propriété des données, soit vous 
pouvez utiliser :php:meth:`CakeRequest::data()` pour lire le tableau de données 
sans erreurs. N'importe quelle clé qui n'existe pas va retourner ``null``::

    $foo = $this->request->data('Value.that.does.not.exist');
    // $foo == null

Accéder aux données XML ou JSON
===============================

Les applications employant :doc:`/development/rest` échangent souvent des 
données dans des organes post non encodées en URL. Vous pouvez lire les données 
entrantes dans n'importe quel format en utilisant 
:php:meth:`CakeRequest::input()`. En fournissant une fonction de décodage, vous 
pouvez recevoir le contenu dans un format déserializé::

    // Obtenir les données encodées JSON soumises par une action PUT/POST
    $data = $this->request->input('json_decode');

Depuis que certaines méthodes de desérialization ont besoin de paramètres 
additionnels quand elles sont appelées, comme le paramètre 
'en tant que tableau' ('as array') pour ``json_decode`` ou si vous voulez 
convertir les XML en objet DOMDocument, :php:meth:`CakeRequest::input()` 
supporte aussi le passement dans des paramètres supplémentaires::

    // Obtenir les données encodées en Xml soumises avec une action PUT/POST
    $data = $this->request->input('Xml::build', array('return' => 'domdocument'));

Accéder aux informations du chemin
==================================

CakeRequest fournit aussi des informations utiles sur les chemins dans votre 
application. :php:attr:`CakeRequest::$base` et 
:php:attr:`CakeRequest::$webroot` sont utiles pour générer des urls, et 
déterminer si votre application est ou n'est pas dans un sous-dossier.

.. _check-the-request:

Inspecter la requête
====================

Détecter les différentes conditions de la requête utilisée en utilisant 
:php:class:`RequestHandlerComponent`. Ces méthodes ont été déplacées dans 
``CakeRequest``, et offrent une nouvelle interface compatible avec les 
utilisations anciennes::

    $this->request->is('post');
    $this->request->isPost();

Les deux méthodes appelées vont retourner la même valeur. Pour l'instant, 
les méthodes sont toujours disponibles dans RequestHandler, mais sont 
depréciées et pourraient être retirées avant la version finale. Vous pouvez 
aussi facilement étendre les détecteurs de la requête qui sont disponibles, 
en utilisant :php:meth:`CakeRequest::addDetector()` pour créer de nouveaux 
types de détecteurs. Il y a quatre différents types de détecteurs que vous 
pouvez créer:

* Comparaison avec valeur d'environnement - Une comparaison de la valeur 
  d'environnement, compare une valeur attrapée à partir de :php:func:`env()` 
  pour une valeur connue, la valeur d'environnement est vérifiée équitablement 
  avec la valeur fournie.
* La comparaison de la valeur model - La comparaison de la valeur model vous 
  autorise à comparer une valeur attrapée à partir de :php:func:`env()` à une 
  expression régulière.
* Comparaison basée sur les options -  La comparaison basée sur les options 
  utilise une liste d'options pour créer une expression régulière. De tels 
  appels pour ajouter un détecteur d'options déjà défini, va fusionner les 
  options.
* Les détecteurs de Callback - Les détecteurs de Callback vous permettront de 
  fournir un type 'callback' pour gérer une vérification. Le callback va 
  recevoir l'objet requête comme seul paramètre.

Quelques exemples seraient::

    // Ajouter un détecteur d'environment.
    $this->request->addDetector('post', array('env' => 'REQUEST_METHOD', 'value' => 'POST'));
    
    // Ajouter un détecteur de valeur model.
    $this->request->addDetector('iphone', array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i'));
    
    // Ajouter un détecteur d'options
    $this->request->addDetector('internalIp', array(
        'env' => 'CLIENT_IP', 
        'options' => array('192.168.0.101', '192.168.0.100')
    ));
    
    // Ajouter un détecteur de callback. Peut soit être une fonction anonyme
    ou un callback régulier.
    $this->request->addDetector('awesome', array('callback' => function ($request) {
        return isset($request->awesome);
    }));

``CakeRequest`` inclut aussi des méthodes comme 
:php:meth:`CakeRequest::domain()`, :php:meth:`CakeRequest::subdomains()` 
et :php:meth:`CakeRequest::host()` aident les applications avec 
sous-domaines à avoir une vie un peu plus facile.

Il y a des plusieurs détecteurs intégrés que vous pouvez utiliser:

* ``is('get')`` Vérifier pour voir si la requête courante est un GET.
* ``is('put')`` Vérifier pour voir si la requête courante est un PUT.
* ``is('post')`` Vérifier pour voir si la requête courante est un POST.
* ``is('delete')`` Vérifier pour voir si la requête courante est un DELETE.
* ``is('head')`` Vérifier pour voir si la requête courante est un HEAD.
* ``is('options')`` Vérifier pour voir si la requête courante est OPTIONS.
* ``is('ajax')`` Vérifier pour voir si la requête courante vient d'un
  X-Requested-with = XmlHttpRequest.
* ``is('ssl')`` Vérifier pour voir si la requête courante est via SSL.
* ``is('flash')`` Vérifier pour voir si la requête courante a un User-Agent 
  de Flash.
* ``is('mobile')`` Vérifier pour voir si la requête courante vient d'une liste 
  courante de mobiles.


CakeRequest et RequestHandlerComponent
=======================================

Puisque plusieurs des fonctionnalités offertes par ``CakeRequest`` étaient 
l'apanage de :php:class:`RequestHandlerComponent` une reflexion était 
nécessaire pour savoir si il était toujours nécessaire. Dans 2.0, 
:php:class:`RequestHandlerComponent` agit comme un sugar daddy. En fournissant 
une couche de facilité en haut de l'offre utilitaire de `CakeRequest`. Facilité 
comme changer les layouts et vues basés sur les types de contenu ou ajax est le 
domaine de :php:class:`RequestHandlerComponent`.  
Cette séparation des utilitaires entre les deux classes vous laisse un choix 
plus facile de prendre ce dont vous avez besoin.

Interagir avec les autres aspects de la requête
===============================================

Vous pouvez utiliser `CakeRequest` pour introspecter une variété de choses au 
sujet de la requête. Au-delà des détecteurs, vous pouvez également trouver 
d'autres informations aux propriétés et méthodes diverses.

* ``$this->request->webroot`` contient le répertoire webroot.
* ``$this->request->base`` contient le chemin de base.
* ``$this->request->here`` contient l'addresse complète de la requête courante.
* ``$this->request->query`` contient les paramètres de la chaîne de requête.


API CakeRequest
===============

.. php:class:: CakeRequest

    CakeRequest encapsule la gestion des paramètres de la requête, et son 
    introspection.

.. php:method:: domain()

    Retourne le nom de domaine sur lequel votre application tourne.

.. php:method:: subdomains() 

    Retourne le sous-domaine sur lequel votre application tourne en tableau.

.. php:method:: host() 

    Retourne l'hôte où votre application tourne.

.. php:method:: method() 

    Retourne la méthode HTTP où la requête a été faite.

.. php:method:: referer() 

    Retourne l'adresse de référence de la requête.

.. php:method:: clientIp() 

    Retourne l'adresse IP du visiteur courant.

.. php:method:: header()

    Vous permet d'accéder à tout en-tête ``HTTP_*`` utilisé pour la requête::

        $this->request->header('User-Agent');

    Retournerait le user agent utilisé pour la requête.

.. php:method:: input($callback, [$options])

    Récupère les données d'entrée pour une requête, et les passe optionnellement
    à travers une fonction qui décode. Les paramètres supplémentaires pour la 
    fonction décondant peuvent être passés comme des arguments de input().
    
.. php:method:: data($key) 

    Fournit une notation avec point pour accéder aux données requêtées. Permet 
    la lecture et la modification des données requêtées, les appels peuvent 
    aussi être chaînés ensemble::

        // Modifier une donnée requêtée, ainsi vous pouvez pré-enregistrer 
        certains champs.
        $this->request->data('Post.titre', 'Nouveau post')
            ->data('Commentaire.1.auteur', 'Mark');
            
        // Vous pouvez aussi lire des données.
        $valeur = $this->request->data('Post.titre');

.. php:method:: is($check)

    Vérifier si la requête remplit certains critères ou non. Utilisez 
    les règles de détection déjà construites ainsi que toute règle 
    supplémentaire définie dans :php:meth:`CakeRequest::addDetector()`.

.. php:method:: addDetector($name, $callback)

    Ajoute un détecteur pour être utilisé avec is().  Voir 
    :ref:`check-the-request` pour plus d'informations.

.. php:method:: accepts($type)

    Trouve quels types de contenu le client accepte ou vérifie si ils acceptent 
    un type particulier de contenu.
    
    Obtenir tous les types::

        <?php 
        $this->request->accepts();
 
    Vérifier pour un simple type::

        $this->request->accepts('json');

.. php:staticmethod:: acceptLanguage($language)

    Obtenir soit toutes les langues acceptées par le client,
    ou vérifier si une langue spécifique est acceptée.

    Obtenir la liste des langues acceptées::

        CakeRequest::acceptLanguage(); 

    Vérifier si une langue spécifique est acceptée::

        CakeRequest::acceptLanguage('es-es'); 

.. php:attr:: data

    Un tableau de données POST. Vous pouvez utiliser 
    :php:meth:`CakeRequest::data()` pour lire cette propriété d'une manière qui
    supprime les erreurs notice.

.. php:attr:: query

    Un tableau des paramètres de chaîne requêtés.

.. php:attr:: params

    Un tableau des éléments de route et des paramètres requêtés.

.. php:attr:: here

    Retourne la requête uri courante.

.. php:attr:: base

    Le chemin de base de l'application, normalement ``/`` à moins que votre 
    application soit dans un sous-répertoire.

.. php:attr:: webroot

    Le webroot courant.

.. index:: $this->response

CakeResponse
############

:php:class:`CakeResponse` est la classe de réponse par défaut dans CakePHP. 
Elle encapsule un nombre de fonctionnalités et de caractéristiques pour la 
génération de réponses HTTP dans votre application. Elle aide aussi à tester 
puisqu'elle peut être mocked/stubbed, vous permettant d'inspecter les en-têtes 
qui vont être envoyés.
Comme :php:class:`CakeRequest`, :php:class:`CakeResponse` consolide un nombre
de méthodes qu'on pouvait trouver avant dans :php:class:`Controller`,
:php:class:`RequestHandlerComponent` et :php:class:`Dispatcher`.  Les anciennes 
méthodes sont dépréciés en faveur de l'utilisation de :php:class:`CakeResponse`.

``CakeResponse`` fournit une interface pour envelopper les tâches de réponse 
communes liées, telles que:

* Envoyer des en-têtes pour les redirections.
* Envoyer des en-têtes de type de contenu.
* Envoyer tout en-tête.
* Envoyer le corps de la réponse.

Changer la classe de réponse
============================

CakePHP utilise ``CakeResponse`` par défaut. ``CakeResponse`` est flexible et 
transparente pour l'utilisation de la classe. Mais si vous avez besoin de la 
remplacer avec une classe spécifique de l'application, vous pouvez l'écraser 
et remplacer ``CakeResponse`` avec votre propre classe. En remplaçant la
CakeResponse utilisé dans index.php.

Cela fera que tous les controllers dans votre application utiliseront 
``VotreResponse`` au lieu de :php:class:`CakeResponse`. Vous pouvez aussi 
remplacer l'instance de réponse utilisé par la configuration 
``$this->response`` dans bos controllers. Ecraser l'objet réponse
est à portée de main pour les tests car il vous permet d'écraser les 
méthodes qui interragissent avec ``header()``. Voir la section sur 
:ref:`cakeresponse-testing` pour plus d'informations.

Gérer les types de contenu
==========================

Vous pouvez contrôler le Type de contenu des réponses de votre application 
en utilisant :php:meth:`CakeResponse::type()`. Si votre application a besoin 
de gérer les types de contenu qui ne sont pas construits dans CakeResponse, 
vous pouvez mapper ces types avec ``type()`` comme ceci::

    // Ajouter un type vCard
    $this->response->type(array('vcf' => 'text/v-card'));

    // Configurer la réponse de Type de Contenu pour vcard.
    $this->response->type('vcf');

Habituellement, vous voudrez mapper des types de contenu supplémentaires 
dans votre callback ``beforeFilter`` dans votre controller, afin que vous 
puissiez tirer parti de la fonctionnalité de vue de commutation automatique 
de :php:class:`RequestHandlerComponent` si vous l'utilisez.

Envoyer des pièces jointes
==========================

Il y a des fois où vous voulez envoyer des réponses du Controller en fichier
à télécharger. Vous pouvez accomplir ceci soit en utilisant 
:doc:`/views/media-view`, soit en utilisant les fonctionnalités de 
``CakeResponse``. :php:meth:`CakeResponse::download()` vous permet d'envoyer 
la réponse en fichier pour download::

    public function envoyerFichier($id) {
        $this->autoRender = false;

        $file = $this->Attachment->recupererFichier($id);
        $this->response->type($file['type']);
        $this->response->download($file['name']);
        $this->response->body($file['content']);
    }

Ce qui est au-dessus montre comment vous pouvez utiliser CakeResponse pour 
générer une réponse de téléchargement de fichier sans utiliser 
:php:class:`MediaView`. En général, vous souhaiterez utilisez MediaView 
puisqu'il fournit quelques fonctionnalités supplémentaires par rapport 
à ce que CakeResponse fait.

Régler les en-têtes
===================

Le réglage des en-têtes est fait avec la métode 
:php:meth:`CakeResponse::header()`. Elle peut être appelée avec quelques 
paramètres de configurations::

    // Régler un unique en-tête
    $this->response->header('Location', 'http://example.com');

    // Régler plusieurs en-têtes
    $this->response->header(array('Location' => 'http://example.com', 'X-Extra' => 'My header'));
    $this->response->header(array('WWW-Authenticate: Negotiate', 'Content-type: application/pdf'));

Régler le même en-tête de multiples fois entraînera l'écrasement des 
précédentes valeurs, un peu comme les appels réguliers d'en-tête. Les en-têtes 
ne sont aussi pas envoyés quand :php:meth:`CakeResponse::header()` est appelé. 
Ils sont simplement conservés jusqu'à ce que la réponse soit effectivement 
envoyé.

Interragir avec le cache du navigateur
======================================

Vous avez parfois besoin de forcer les navigateurs à ne pas mettre en cache les 
résultats de l'action d'un controller. 
:php:meth:`CakeResponse::disableCache()` est justement prévu pour cela::

    public function index() {
        // faire quelque chose.
        $this->response->disableCache();
    }

.. warning::

    En utilisant disableCache() avec downloads à partir de domaines SSL pendant 
    que vous essayez d'envoyer des fichiers à Internet Explorer peut entraîner 
    des erreurs.

Vous pouvez aussi dire à vos clients que vous voulez qu'ils mettent en cache 
des réponses. En utilisant :php:meth:`CakeResponse::cache()`::

    public function index() {
        //faire quelque chose
        $this->response->cache(time(), '+5 days');
    }

Ce qui est au-dessus dira aux clients de mettre en cache la réponse résultante 
pedant 5 jours, en espérant accélerer l'expérience de vos visiteurs.


.. _cake-response-caching:

Réglage fin du Cache HTTP
=========================

Une des façons les meilleures et les plus simples de rendre votre application 
plus rapide est d'utiliser le cache HTTP. Avec la mise en cache des models,
vous n'avez qu'à aider les clients à décider si ils devraient utiliser une 
copie mise en cache de la réponse en configurant un peu les en-têtes comme les
temps modifiés, les balise d'entité de réponse et autres.

Opposé à l'idée d'avoir à coder la logique de mise en cache et de sa nullité 
(rafraîchissement) une fois que les données ont changé, HTPP utilise deux 
models, l'expiration et la validation qui habituellement sont beaucoup plus
simples que d'avoir à gérer le cache soi-même.

En dehors de l'utilisation de :php:meth:`CakeResponse::cache()` vous pouvez 
aussi utiliser plusieurs autres méthodes pour affiner le réglage des 
en-têtes de cache HTTP pour tirer profit du navigateur ou à l'inverse du cache
du proxy.

L'en-tête de Cache Control
--------------------------

.. versionadded:: 2.1

Utilisé sous le model d'expiration, cet en-tête contient de multiples 
indicateurs qui peuvent changer la façon dont les navigateurs ou les
proxies utilisent le contenu mis en cache. Un en-tête Cache-Control peut
ressembler à ceci::

    Cache-Control: private, max-age=3600, must-revalidate

La classe ``CakeResponse`` vous aide à configurer cet en-tête avec quelques 
méthodes utiles qui vont produire un en-tête final valide Cache Control. 
Premièrement il y a la méthode :php:meth:`CakeResponse::sharable()`, qui 
indique si une réponse peut être considerée comme partageable pour différents
utilisateurs ou clients. Cette méthode contrôle généralement la partie `public`
ou `private` de cet en-tête. Définir une réponse en privé indique que tout ou
une partie de celle-ci est prévue pour un unique utilisateur. Pour tirer profit 
des mises en cache partagées, il est nécessaire de définir la directive de 
contrôle en publique.

Le deuxième paramètre de cette méthode est utilisé pour spécifier un `max-age` 
pour le cache, qui est le nombre de secondes après lesquelles la réponse n'est 
plus considérée comme récente.::

    public function view() {
        ...
        // Définir le Cache-Control en public pour 3600 secondes
        $this->response->sharable(true, 3600);
    }

    public function mes_donnees() {
        ...
        // Définir le Cache-Control en private pour 3600 secondes
        $this->response->sharable(false, 3600);
    }

``CakeResponse`` expose des méthodes séparées pour la définition de chaque 
component dans l'en-tête de Cache-Control.

L'en-tête d'Expiration
----------------------

.. versionadded:: 2.1

Aussi sous le model d'expiration de cache, vous pouvez définir l'en-tête 
`Expires`, qui selon la spécification HTTP est la date/le temps après que 
la réponse ne soit plus considerée comme récent. Cet en-tête peut être défini
en utilisant la méthode :php:meth:`CakeResponse::expires()`::

    public function view() {
        $this->response->expires('+5 days');
    }

Cette méthode accepte aussi un DateTime ou toute chaîne de caractère qui peut 
être parsée par la classe DateTime.

L'en-tête Etag
--------------

.. versionadded:: 2.1

Cache validation dans HTTP est souvent utilisé quand le contenu change 
constamment et demande à l'application de générer seulement les contenus
réponse si le cache n'est plus récent. Sous ce model, le client continue
de stocker les pages dans le cache, mais au lieu de l'utiliser directement, 
il demande à l'application à chaque fois si les ressources ont changé ou non.
C'est utilisé couramment avec des ressources statiques comme les images et 
autres choses.

L'en-tête Etag (appelé balise d'entité) est une chaîne de caractère qui 
identifie de façon unique les ressource requêtées. Il est très semblable 
à la somme de contrôle d'un fichier, la mise en cache permettra de comparer 
les sommes de contrôle pour savoir si elles correspondent ou non.

Pour tirer réellement avantage pour l'utilisation de cet en-tête, vous devez 
soit appeler manuellement la méthode 
:php:meth:`CakeResponse::checkNotModified()`, soit avoir le 
:php:class:`RequestHandlerComponent` inclu dans votre controller::

    public function index() {
        $articles = $this->Article->find('all');
        $this->response->etag($this->Article->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        ...
    }

L'en-tête Dernier Modifié
-------------------------

.. versionadded:: 2.1

Toujours dans le cadre du model de validation du cache HTTP, vous pouvez 
définir l'en-tête `Dernier-Modifié` pour indiquer la date et le temps pendant 
lequel la ressource a été modifiée pour la dernière fois. Définir cet en-tête 
aide la réponse de CakePHP pour mettre en cache les clients si la réponse a été 
modifiée ou n'est pas basée sur le cache du client. 

Pour tirer réellement avantage pour l'utilisation de cet en-tête, vous devez 
soit appeler manuellement la méthode 
:php:meth:`CakeResponse::checkNotModified()`, soit avoir le 
:php:class:`RequestHandlerComponent` inclu dans votre controller::

    public function view() {
        $article = $this->Article->find('first');
        $this->response->modified($article['Article']['modified']);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        ...
    }

L'en-tête Vary
--------------

Dans certains cas, vous voudrez offrir différents contenus en utilisant la 
même url. C'est souvent le cas quand vous avez une page multilingue ou que
vous répondez avec du HTML différent selon le navigateur qui requête la 
ressource. Pour ces circonstances, vous pouvez utiliser l'en-tête Vary::

        $this->response->vary('User-Agent');
        $this->response->vary('Accept-Encoding', 'User-Agent');
        $this->response->vary('Accept-Language');

.. _cakeresponse-testing:

CakeResponse et les tests
=========================

Probablement l'une des plus grandes victoires de ``CakeResponse`` vient de 
comment il facilite les tests des controllers et des components. Au lieu de 
méthodes répandues à travers plusieurs objets, vous avez un seul objet pour 
mocker pendant que les controllers et les components déleguent à 
``CakeResponse``. Cela vous aide à rester plus près d'un test 'unit' et 
facilite les tests des controllers::

    public function testerQuelqueChose() {
        $this->controller->response = $this->getMock('CakeResponse');
        $this->controller->response->expects($this->once())->method('header');
        // ...
    }

De plus, vous pouvez faciliter encore plus l'exécution des tests à partir d'une
ligne de commande, pendant que vous pouvez mocker pour éviter les erreurs 
'd'envois d'en-têtes' qui peuvent arriver en essayant de configurer les 
en-têtes dans CLI.

API de CakeResponse
===================

.. php:class:: CakeResponse

    CakeResponse fournit un nombre de méthodes utiles pour interagir avec la 
    réponse que vous envoyez à un client.

.. php:method:: header() 

    Vois permet de configurer directement un ou plusieurs en-têtes à être 
    envoyés avec la réponse.    

.. php:method:: charset() 

    Configure le charset qui sera utilisé dans la réponse.

.. php:method:: type($type) 

    Configure le type de contenu pour la réponse. Vous pouvez soit utiliser un 
    alias de type de contenu connu, soit le nom du type de contenu complet.

.. php:method:: cache()

    Vous permet de configurer les en-têtes de mise en cache dans la réponse.

.. php:method:: disableCache()

    Configure les en-têtes pour désactiver la mise en cache des client pour la 
    réponse.

.. php:method:: sharable($isPublic, $time)

    Configure l'en-tête de Cache-Control pour être soit `public` soit `private` 
    et configure optionnellement une directive de la ressource à un `max-age`.

    .. versionadded:: 2.1

.. php:method:: expires($date)

    Permet de configurer l'en-tête `Expires` à une date spécifique.

    .. versionadded:: 2.1

.. php:method:: etag($tag, $weak)

    Configure l'en-tête `Etag` pour identifier de manière unique une ressource de réponse.

    .. versionadded:: 2.1

.. php:method:: modified($time)

    Configure l'en-tête `Le-dernier-modifié` à une date et un temps donné dans 
    le format correct.

    .. versionadded:: 2.1

.. php:method:: checkNotModified(CakeRequest $request)

    Compare les en-têtes mis en cache pour l'objet request avec l'en-tête mis 
    en cache de la response et détermine si il peut toujours être considéré 
    comme récent. Dans ce cas, il supprime tout contenu de réponse et envoie 
    l'en-tête `304 Not Modified`.

    .. versionadded:: 2.1

.. php:method:: compress()

    Démarre la compression gzip pour la requête.

.. php:method:: download() 

    Vous permet d'envoyer la réponse en pièce jointe et de configurer
    le nom de fichier.

.. php:method:: statusCode() 

    Vous permet de configurer le code de statut pour la réponse.

.. php:method:: body()

    Configurer le contenu du body pour la réponse.

.. php:method:: send()

    Une fois que vous avez fini de créer une réponse, appelez send() enverra 
    tous les en-têtes configurés ainsi que le body. Ceci est fait 
    automatiquement à la fin de chaque requête par :php:class:`Dispatcher`


.. meta::
    :title lang=fr: Objets Request et Response
    :keywords lang=fr: requête controller,paramètres de requête,tableaux indicés,purpose index,objets réponse,information domaine,Objet requête,donnée requêtée,interrogation,params,précédentes versions,introspection,dispatcher,rout,structures de données,tableaux,adresse ip,migration,indexes,cakephp
