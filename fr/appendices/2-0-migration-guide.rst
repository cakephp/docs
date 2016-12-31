Guide de Migration 2.0
######################

Cette page résume les changements par rapport à CakePHP 1.3 qui aidera pour les
projets de migration vers la version 2.0, ainsi qu'une référence pour se mettre
à jour sur les changements faits dans le coeur depuis la branche CakePHP 1.3.
Assurez vous de lire les autres pages de ce guide pour toutes les nouvelles
fonctionnalités et les changements de l'API.

.. tip::

    Faites bien un checkout :ref:`upgrade-shell` inclu dans le coeur de la 2.0
    pour vous aider à migrer du code de la 1.3 à la 2.0.

Support des Versions de PHP
===========================

CakePHP 2.x supporte la Version de PHP 5.2.8 et supérieur. Le support de PHP4 a
été supprimé. Pour les développeurs qui travaillent avec un environnement de
production PHP4, les versions de CakePHP 1.x continuent le support de PHP4 pour
la durée de vie de leur développement.

Le passage à PHP5 siginifie que toutes les méthodes et propriétés ont été mises
à jour avec les mots-clés correspondants. Si votre code tente d'accéder à des
méthodes privées ou protégées avec une étendue public, vous rencontrerez des
erreurs.

Bien que cela ne constitue pas un changement énormer du framework, cela
signifie qu'un accès aux méthodes et variables à la visibilité serrée
n'est maintenant plus possible.

Le nommage des Fichiers et Dossiers
===================================

Dans CakePHP 2.0, nous avons repensé la façon de structurer nos fichiers
et dossiers. Etant donné que PHP 5.3 supporte les espaces de nom (namespaces),
nous avons décidé de préparer notre base de code pour l'adoption dans un futur
proche de cette version de PHP, donc nous avons adopté
https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md.
Tout d'abord, nous avons regardé la structure interne de CakePHP 1.3 et avons
réalisé qu'après toutes ces années, il n'y avait ni organisation claire des
fichiers, ni une structure de dossiers vraiment logique où chaque fichier se
trouve où il devrait. Avec ce changement, nous serions autorisés à
expérimenter un peu le chargement (presque) automatique des classes pour
augmenter les performances globales du framework.

Le plus grand obstacle pour réussir cela, était de maintenir une sorte de
compatiblité rétro-active avec la façon dont les classes sont chargées en ce
moment, et nous ne voulions définitivement pas devenir un framework avec des
énormes préfixes de classe, des noms de classe du type
``Mon_Enorme_Classe_Dans_Le_Progiciel``. Nous avons décidé d'adopter une
stratégie de garder des noms de classe simples, tout en offrant une façon très
intuitive de déclaration des emplacements de classe et des chemins de migration
clairs pour la future version PHP 5.3 de CakePHP. Tout d'abord, mettons en
évidence les principaux changements dans la standardisation du nommage des
fichiers que nous avons adoptée:

Noms des Fichiers
-----------------

Tous les fichiers contenant les classes doivent être nommés selon la classe
qu'il contiennent. Aucun fichier ne doit contenir plus d'une classe. Donc,
plus de minuscules ou de soulignements dans les noms de fichier. Voici quelques
exemples:

* ``mes_trucs_controller.php`` devient ``MesTrucsController.php``
* ``form.php`` (un Helper) devient ``FormHelper.php``
* ``session.php`` (un Component) devient ``SessionComponent.php``

Cela rend le nommage des fichiers beaucoup plus clair et cohérent à travers
les applications, et aussi évite quelques cas où le chargement des fichiers
aurait pu été géné dans le passé et aurait pu entrainé un chargement non
souhaité de fichiers.

Les Noms des Dossiers
---------------------

La plupart des dossiers devront être en CamelCase, spécialement ceux contenant
des classes. En songeant aux espaces de noms, chaque dossier représente un
niveau dans la hiérachie des espaces de noms, les dossiers qui ne contiennent
pas de classes, ou ne constituent pas un espace de noms sur eux-mêmes,
devraient être en LowerCase.

Dossiers en CamelCase:

* Config
* Console
* Controller
* Controller/Component
* Lib
* Locale
* Model
* Model/Behavior
* Plugin
* Test
* Vendor
* View
* View/Helper

Dossiers en LowerCase:

* tmp
* webroot

htaccess (URL Rewriting)
========================
Dans votre fichier ``app/webroot/.htaccess`` remplacez le
``RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]`` avec
``RewriteRule ^(.*)$ index.php?/$1 [QSA,L]``


AppController / AppModel / AppHelper / AppShell
===============================================

Les fichiers ``app/app_controller.php``, ``app/app_model.php``,
``app/app_helper.php`` sont situés et nommés respectivement comme ceci
``app/Controller/AppController.php``, ``app/Model/AppModel.php`` et
``app/View/Helper/AppHelper.php``.

Aussi, les shell/task sont étendus (extend) Appshell. Vous pouvez avoir votre
propre AppShell.php dans ``app/Console/Command/AppShell.php``.

Internationalization / Localization
===================================

:php:func:`__()` (La fonction raccourci de Double underscore) retourne toujours
la traduction (plus de echo).

Si vous voulez changer les résultats de la traduction, utilisez::

    echo __('Mon Message');

Cela remplace toutes les méthodes de traduction raccourcies::

    __()
    __n()
    __d()
    __dn()
    __dc()
    __dcn()
    __c()

A côté de cela, si vous passez des paramètres supplémentaires, la traduction
appelera `sprintf <https://secure.php.net/manual/en/function.sprintf.php>`_  avec
ces paramètres retournés précédemment avant de retourner. Par exemple::

    // Retournera quelque chose comme "Appelé: MaClasse:maMethode"
    echo __('Appelé: %s:%s', $nomdelaclasse, $nomdelamethode);

Elle est valide pour toutes les méthodes raccourcies de traduction.

Plus d'informations sur les spécificités de la fonction:
`sprintf <https://secure.php.net/manual/en/function.sprintf.php>`_.


Emplacement de la Classe et constantes changées
===============================================

Les constantes ``APP`` et ``CORE_PATH`` ont des valeur cohérentes entre le web
et les environnement de la console. Dans les précedentes versions de CakePHP,
ces valeurs changeaient selon l'environnement.

Basics.php
==========

-  ``getMicrotime()`` a été retirée. Utilisez la fonction native
   ``microtime(true)`` à la place.
-  ``e()`` a été retirée. Utilisez ``echo``.
-  ``r()`` a été retirée. Utilisez ``str_replace``.
-  ``a()`` a été retirée. Utilisez ``array()``
-  ``aa()`` a été retirée. Utilisez ``array()``
-  ``up()`` a été retirée. Utilisez ``strtoupper()``
-  ``low()`` a été retirée. Utilisez ``strtolower()``
-  ``params()`` a été retirée. Il n'était utilisé nul part dans CakePHP
-  ``ife()`` a été retirée. Utilisez un opérateur ternaire.
-  ``uses()`` a été retirée. Utilisez ``App::import()`` à la place.
-  La compatibilité des fonctions de PHP4 a été retirée.
-  La constante PHP5 a été retirée.
-  La variable Globale appelée ``$TIME_START`` a été retirée. Utilisez la
   constante ``TIME_START`` ou ``$_SERVER['REQUEST_TIME']`` à la place.

Constantes Retirées
-------------------

Un nombre de constantes ont été retirées, puisqu'elles n'ataient plus exactes
ou bien étaient dupliquées.

* APP_PATH
* BEHAVIORS
* COMPONENTS
* CONFIGS
* CONSOLE_LIBS
* CONTROLLERS
* CONTROLLER_TESTS
* ELEMENTS
* HELPERS
* HELPER_TESTS
* LAYOUTS
* LIB_TESTS
* LIBS
* MODELS
* MODEL_TESTS
* SCRIPTS
* VIEWS

CakeRequest
===========

Cette nouvelle classe encapsule les paramètres et fonctions liées aux requêtes
entrantes. Elle remplace plusieurs fonctionnalités de ``Dispatcher``,
``RequestHandlerComponent`` et Controller. Elle remplace aussi le tableau
``$this->params`` à tout endroit. ``CakeRequest`` implémente ``ArrayAccess``
donc la plupart des interactions avec les anciens tableaux params n'ont pas
besoin de changement. Voir les nouvelles fonctionnalités de CakeRequest pour
plus d'informations.

Gestion des Requêtes, $_GET['url'] et fichiers .htaccess
========================================================

CakePHP n'utilise plus ``$_GET['url']`` pour la gestion des chemins des
requêtes de l'application. A la place il utilise ``$_SERVER['PATH_INFO']``.
Cela fournit une façon plus uniforme de gestion des requêtes entre les serveurs
avec URL rewriting et ceux sans. Du fait de ces changements, vous aurez besoin
de mettre à jour vos fichiers .htaccess et ``app/webroot/index.php``, puisque
ces fichiers ont été changés pour accueillir les changements. De plus,
``$this->params['url']['url']`` n'existe plus. A la place, vous devrez utiliser
$this->request->url pour accéder à la même valeur.
Cet attribut contient maintenant l'url sans slash ``/`` au début.

Note: Pour la page d'accueil elle-même (``http://domain/``) $this->request->url
retourne maintenant le boléen ``false`` au lieu de ``/``. Assurez-vous de
vérifier cela de cette façon::

    if (!$this->request->url) {} // au lieu de $this->request->url === '/'

Components (Composants)
=======================

Component est maintenant la classe de base requise pour tous les components
(components). Vous devrez mettre à jour vos components et leurs constructeurs,
puisque tous deux ont changé::

    class PrgComponent extends Component {
        public function __construct(ComponentCollection $collection, $settings = array()) {
            parent::__construct($collection, $settings);
        }
    }

Tout comme les helpers il est important d'appeler ``parent::__construct()``
dans les components avec les constructeurs surchargés. Les paramètres pour un
component sont aussi maintenant passés à travers le constructeur, et non plus
via le callback ``initialize()``. Cela aide à avoir de bons objets construits,
et autorise la classe de base à gérer les propriétés supérieures.

Depuis que les paramètres ont été déplacés au constructeur du component, le
callback ``initialize()`` ne reçoit plus ``$settings`` en 2ème paramètre. Vous
devrez mettre à jour vos components pour utiliser la signature méthode
suivante::

    public function initialize($controller) { }

De plus, la méthode initialize() est seulement appelée sur les components qui
sont permis. Cela signifie en général que les components qui sont directement
attachés à l'objet controller.

Callbacks dépréciés supprimés
-----------------------------

Tous les callbacks dépréciés dans Component ont été transférés à
ComponentCollection. A la place, vous devriez utiliser la méthode `trigger()`
pour intéragir avec les callbacks. Si vous avez besoin de déclencher un
callback, vous pouvez le faire en appelant::

    $this->Components->trigger('someCallback', array(&$this));

Changement dans la désactivation des components
-----------------------------------------------

Dans le passé, vous étiez capable de désactiver les components via
`$this->Auth->enabled = false;` par exemple. Dans CakePHP 2.0 vous devriez
utiliser la méthode de désactivation des ComponentCollection's,
`$this->Components->disable('Auth');`. Utiliser les propriétés actives ne va
pas fonctionner.

AclComponent
------------

-  Les implémentations ``AclComponent`` sont maintenant requises pour
   implémenter ``AclInterface``.
-  ``AclComponent::adapter()`` a été ajouté pour permettre l'éxecution de la
   modification de l'utilisation de l'implémentation du component ``ACL``.
-  ``AclComponent::grant()`` a été déprécié, il sera supprimé dans une version
   future. Utilisez ``AclComponent::allow()`` à la place.
-  ``AclComponent::revoke()`` a été déprécié, il sera supprimé dans une version
   future. Utilisez AclComponent::deny() à la place.

RequestHandlerComponent
-----------------------

Beaucoup de méthodes de RequestHandlerComponent sont justes des proxies pour
les méthodes de ``CakeRequest``. Le méthodes suivantes ont été dépréciées et
seront retirées dans les versions futures:

-  ``isSsl()``
-  ``isAjax()``
-  ``isPost()``
-  ``isPut()``
-  ``isFlash()``
-  ``isDelete()``
-  ``getReferer()``
-  ``getClientIp()``
-  ``accepts()``, ``prefers()``, ``requestedWith()`` Tous sont maintenant gérés
    dans les types de contenu. Ils ne fonctionnent plus avec les mime-types.
    Vous pouvez utiliser ``RequestHandler::setContent()`` pour créer des
    nouveaux types de contenu.
-  ``RequestHandler::setContent()`` n'accepte plus de tableau en tant
    qu'argument unique, vous devez fournir les deux arguments.

SecurityComponent
-----------------

SecurityComponent ne gère plus l'Authentification Basic et Sommaire (Digest).
Elles sont toutes deux gérées par le nouveau AuthComponent. Les méthodes
suivantes ont été retirées de SecurityComponent:

-  requireLogin()
-  generateDigestResponseHash()
-  loginCredentials()
-  loginRequest()
-  parseDigestAuthData()

De plus les propriétés suivantes ont été retirées:

-  $loginUsers
-  $requireLogin

Le déplacement des fonctionalités verss Authcomponent a été faite pour fournir
un endroit unique pour tous les types d'authentification et pour rationaliser
les rôles de chaque component.

AuthComponent
-------------

AuthComponent a été entièrement refait dans 2.0, ça a été fait pour réduire
les confusions et frustrations des développeurs. De plus, AuthComponent a
été construit plus flexible et extensible. Vous pouvez trouver plus
d'informations dans le guide :doc:`/core-libraries/components/authentication`.

EmailComponent
--------------

EmailComponent a été déprecié et a été crée une nouvelle classe de librairie
pour envoyer les emails. Voir les changements pour Email
:doc:`/core-utility-libraries/email` pour plus de détails.

SessionComponent
----------------

SessionComponent a perdu les méthodes suivantes.

* activate()
* active()
* __start()

Retrait de cakeError
====================

La méthode ``cakeError()`` a été retirée. Il est recommandé que vous changiez
toutes les utilisations de ``cakeError`` pour utiliser les exceptions.
``cakeError`` a été retirée car elle simulait les exceptions. Plutôt que la
simulation, de réelles exceptions sont utilisées dans CakePHP 2.0.

Gestion des Erreurs
===================

L'implémentation de la gestion des erreurs a changé de façon spectaculaire dans
2.0. Les exceptions ont été introduites partout dans le framework, et la
gestion des erreurs a été mise à jour pour offrir plus de contrôle et de
flexibilité. Vous pouvez en lire plus dans les sections
:doc:`/development/exceptions` et :doc:`/development/errors`.

Classes Lib
===========

App
---

L'API pour ``App::build()`` a changé pour ``App::build($paths, $mode)``. Elle
vous autorise maintenant à soit ajouter, soit faire précéder ou bien
réinitialiser / remplacer les chemins existants. Le paramètre $mode peut
prendre n'importe lesquelles des 3 valeurs suivantes: App::APPEND,
App::PREPEND, ``App::RESET``. Le behavior par défaut de la fonction reste le
même (ex. Faire précéder des nouveaux chemins par une liste existante).

App::path()
~~~~~~~~~~~

* Supporte maintenant les plugins, App::path('Controller', 'Users') va
  retourner la localisation du dossier des controllers dans le plugin des
  users.
* Ne fusionnera plus les chemins du coeur, il retournera seulement les chemins
  définies dans App::build() et ceux par défaut dans app (ou correspondant au
  plugin).

App::build()
~~~~~~~~~~~~

* Ne fusionnera plus le chemin de app avec les chemins du coeur.

App::objects()
~~~~~~~~~~~~~~

* Supporte maintenant les plugins, App::objects('Users.Model') va
  retourner les models dans le plugin Users.
* Retourne array() au lieu de false pour les résultats vides ou les types
  invalides.
* Ne retourne plus les objets du coeur, App::objects('core') retournera array().
* Retourne le nom complet de la classe.

La classe App perd les propriétés suivantes, utilisez la méthode App::path()
pour accéder à leur valeur

* App::$models
* App::$behaviors
* App::$controllers
* App::$components
* App::$datasources
* App::$libs
* App::$views
* App::$helpers
* App::$plugins
* App::$vendors
* App::$locales
* App::$shells

App::import()
~~~~~~~~~~~~~

* Ne recherche plus les classes de façon récursive, il utilise strictement les
  valeurs pour les chemins définis dans App::build().
* Ne sera plus capable de charger App::import('Component', 'Component'),
  utilisez App::uses('Component', 'Controller');
* Utiliser App::import('Lib', 'CoreClass') pour charger les classes du coeur
  n'est plus possible.
* Importer un fichier non-existant, fournir un mauvais type ou un mauvais nom
  de package, ou des valeurs nulles pour les paramètres $name et $file va
  donner une fausse valeur de retour.
* App::import('Core', 'CoreClass') n'est plus supporté, utilisez App::uses()
  à la place et laisser la classe autoloading faire le reste.
* Charger des fichiers Vendor ne recherchera pas de façon récursive dans les
  dossiers Vendors, cela ne convertira plus le fichier en underscore comme cela
  se faisant dans le passé.

App::core()
~~~~~~~~~~~

* Le premier paramètres n'est plus optionnel, il retournera toujours un chemin.
* Il ne peut plus être utilisé pour obtenir les chemins des vendors.
* Il acceptera seulement le nouveau style des noms de package.

Chargement des Classes avec App::uses()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bien qu'il y ait eu une re-construction énorme dans la façon de charger les
classes, pour quelques occasions, vous aurez besoin de changer le code de votre
application pour respecter la façon que vous aviez l'habitude de faire. Le plus
grand changement est l'introduction d'une nouvelle méthode::

    App::uses('AuthComponent', 'Controller/Component');

Nous avons décidé que le nom de la fonction devait imiter le mot-clé ``use``
de PHP 5.3, juste pour la façon de déclarer où un nom de classe devait se
trouver. Le premier paramètre de :php:meth:`App::uses()` est le nom complet de
la classe que vous avez l'intention de charger, et le second paramètre, le nom
du package (ou espace de noms) auquel il appartient. La principale différence
avec le :php:meth:`App::import()` de CakePHP 1.3 est que l'actuelle n'importera
pas la classe, elle configurera juste le système pour qu'à la première
utilisation de la classe, elle soit localisée.

Quelques exemples de l'utilisation de :php:meth:`App::uses()` quand on migre de
:php:meth:`App::import()`::

    App::import('Controller', 'Pages');
    // devient
    App::uses('PagesController', 'Controller');

    App::import('Component', 'Auth');
    // devient
    App::uses('AuthComponent', 'Controller/Component');

    App::import('View', 'Media');
    // devient
    App::uses('MediaView', 'View');

    App::import('Core', 'Xml');
    // devient
    App::uses('Xml', 'Utility');

    App::import('Datasource', 'MongoDb.MongoDbSource')
    // devient
    App::uses('MongoDbSource', 'MongoDb.Model/Datasource')

Toutes les classes qui ont été chargées dans le passé utilisant
``App::import('Core', $class);`` auront besoin d'être chargées en utlisant
``App::uses()`` en référence au bon package. Voir l'API pour localiser les
classes dans leurs nouveaux dossiers. Quelques exemples::

    App::import('Core', 'CakeRoute');
    // devient
    App::uses('CakeRoute', 'Routing/Route');

    App::import('Core', 'Sanitize');
    // devient
    App::uses('Sanitize', 'Utility');

    App::import('Core', 'HttpSocket');
    // devient
    App::uses('HttpSocket', 'Network/Http');

Au contraire de la façon dont fonctionnait :php:meth:`App::import()`, la
nouvelle classe de chargement ne va pas localiser les classes de façon
récursive. Cela entraîne un gain de performance impressionnant même en mode
développement, au prix de certaines fonctionnalités rarement utilisées qui ont
toujours provoquées des effets secondaires. Pour être encore plus clair, la
classe de chargement va seulement attraper la classe dans le package exact dans
lequel vous lui avez dit de la trouver.

App::build() et les chemins du coeur
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:php:meth:`App::build()` ne va plus fusionner les chemins de app avec les
chemins du coeur.

Exemples::

    App::build(array('controllers' => array('/chemin/complet/vers/controllers')))
    //devient
    App::build(array('Controller' => array('/chemin/complet/vers/controllers')))

    App::build(array('helpers' => array('/chemin/complet/vers/controllers')))
    //devient
    App::build(array('View/Helper' => array('/chemin/complet/vers/Vues/Helpers')))

CakeLog
-------

- La connexion aux flux a maintenant besoin de mettre en œuvre:
  php: class: `CakeLogInterface`. Des exceptions seront soulevées si un
  enregistreur n'est pas configuré.

Cache
-----

-  :php:class:`Cache` est maintenant une classe statique, elle n'a plus de
   méthode getInstance().
-  CacheEngine est maintenant une classe abstraite. Vous ne pouvez plus
   directement créer d'instances de celle-ci.
-  Les implémentations de CacheEngine doivent étendre CacheEngine, des
   exceptions seront soulevées si une classe de configuration ne l'est pas.
-  FileCache nécessite maintenant l'ajout de barres obliques au chemin de
   configuration lorsque vous modifiez une configuration du cache.
-  Cache ne retient plus le nom du dernier moteur de cache configuré. Cela
   signifie que les opérations que vous souhaitez produire sur un moteur
   spécifique doivent avoir le paramètre $config égale au nom de config
   que vous souhaitez.

::

    Cache::config('quelquechose');
    Cache::write('key', $valeur);

    // deviendrait
    Cache::write('key', $valeur, 'quelquechose');

Router
------

- Vous ne pouvez plus modifier les paramètres de configuration avec
  ``Router::setRequestInfo()``. Vous devriez utiliser
  ``Router::connectNamed()`` pour configurer la façon dont les paramètres
  nommés sont gérés.
- Le Router n'a plus de méthode ``getInstance()``. C'est une classe statique,
  appelle ses méthodes et propriétés de façon statique.
- ``Router::getNamedExpressions()`` est deprécié. Utilisez les nouvelles
  constantes du routeur. ``Router::ACTION``, ``Router::YEAR``,
  ``Router::MONTH``, ``Router::DAY``, ``Router::ID``, et ``Router::UUID`` à la
  place.
- ``Router::defaults()`` a été retiré. Supprimer l'inclusion de fichier des
  routes du coeur de votre fichier routes.php de vos applications pour
  désactiver le routing par défaut. Inversement, si vous voulez le routing par
  défaut, vous devrez ajouter une inclusion dans votre fichier de routes
  ``Cake/Config/routes.php``.
- Quand vous utilisez Router::parseExtensions() le paramètre d'extension n'est
  plus sous ``$this->params['url']['ext']``. A la place, il est disponible avec
  ``$this->request->params['ext']``.
- Les routes des plugins par défaut ont changé. Les routes courtes de Plugin
  ne sont plus construites que dans les actions index. Précédemment `/users``
  et ``/users/add`` mappaient le UsersController dans le plugin
  Users. Dans 2.0, seule l'action ``index`` est donné par une route
  courte. Si vous souhaitez continuer à utiliser les routes courtes, vous
  pouvez ajouter une route comme::

    Router::connect('/users/:action', array('controller' => 'users', 'plugin' => 'users'));

  Pour votre fichier de routes pour chaque plugin, vous avez besoin de routes
  courtes actives.

Votre fichier app/Config/routes.php doit être mis à jour en ajoutant cette
ligne en bas du fichier::

    require CAKE . 'Config' . DS . 'routes.php';

Cela est nécessaire afin de générer les routes par défaut pour votre
application. Si vous ne souhaitez pas avoir de telles routes, ou si vous voulez
implémenter votre propre standard, vous pouvez inclure votre propre fichier
avec vos propres règles de routeur.

Dispatcher
----------

- Le Dispatcher a été déplacé dans cake/libs, vous devrez mettre à jour votre
  fichier ``app/webroot/index.php``.
- Le ``Dispatcher::dispatch()`` prend maintenant deux paramètres. Les objets
  request et response. Ceux-ci devraient être des instances de ``CakeRequest`` &
  ``CakeResponse`` ou une sous-classe de ceux-ci.
- ``Dispatcher::parseParams()`` n'accepte que l'objet ``CakeRequest``.
- ``Dispatcher::baseUrl()`` a été retiré.
- ``Dispatcher::getUrl()`` a été retiré.
- ``Dispatcher::uri()`` a été retiré.
- ``Dispatcher::$here`` a été retiré.

Configure
---------

-  ``Configure::read()`` avec aucun paramètre ne retourne plus la valeur de
   'debug', à la place elle retourne toutes les valeurs dans Configure.
   Utilisez ``Configure::read('debug');`` si vous voulez la valeur de debug.
-  ``Configure::load()`` requiert maintenant un ConfigReader pour être
   configuré. Lisez :ref:`loading-configuration-files` pour plus d'informations.
-  ``Configure::store()`` écrit maintenant les valeurs à une configuration du
   Cache donnée. Lisez :ref:`loading-configuration-files` pour plus
   d'informations.

Scaffold
--------

-  Les vues Scaffold 'edit' devront être renommées par 'form'. Cela a été fait
   pour rendre les templates scaffold et bake cohérents.

   -  ``views/scaffolds/edit.ctp`` -> ``View/Scaffolds/form.ctp``
   -  ``views/posts/scaffold.edit.ctp`` -> ``View/Posts/scaffold.form.ctp``

Xml
---

-  La classe Xml a été complètement reconstruite. Maintenant cette classe ne
   manipule plus de données, et elle est un enrouleur (wrapper) pour les
   SimpleXMLElement. Vous pouvez utiliser les méthodes suivantes:

   -  ``Xml::build()``: Méthode statique dans laquelle vous pouvez passer une
      chaîne de caractère xml, un tableau, un chemin vers un fichier ou une
      url. Le résultat va être une instance SimpleXMLElement ou une exception
      va être envoyée en cas d'erreurs.
   -  ``Xml::fromArray():`` Méthode statique qui retourne un SimpleXMLElement
      à partir d'un tableau.
   -  ``Xml::toArray()``: Méthode statique qui retourne un tableau à partir de
      SimpleXMLElement.

Vous devez utiliser la documentation :php:class:`Xml` pour plus d'informations
sur les changements faits sur la classe Xml.

Inflector
---------

-  L'Inflecteur n'a plus de méthode ``getInstance()``.
-  ``Inflector::slug()`` ne supporte plus l'argument $map. Utilisez
   ``Inflector::rules()`` pour définir les règles de translitération.

CakeSession
-----------

CakeSession est maintenant une classe complètement statique, les deux
``SessionHelper`` et ``SessionComponent`` sont des wrappers et du sucre pour
celui-ci. Il peut facilement être utilisé dans les models ou dans d'autres
contextes. Toutes ses méthodes sont appelées de façon statique.

La configuration de Session a aussi changé
:doc:`Voir la section session pour plus d'informations </development/sessions>`

HttpSocket
----------

- HttpSocket ne change pas les clés d'en-tête. Suivant les autres endroits dans
  le coeur, le HttpSocket ne change pas les headers. :rfc:`2616` dit que les
  en-têtes sont insensibles à la casse, et HttpSocket préserve les valeurs
  envois de l'hôte distant.
- HttpSocket retourne maintenant les réponses en objets. Au lieu des tableaux,
  HttpSocket retourne les instances de HttpResponse. Voir la documentation de
  :php:class:`HttpSocket` pour plus d'informations.
- Les cookies sont stockés en interne par l'hôte, pas par instance. Cela
  signifie que, si vous faîtes deux requêtes à différents serveurs, les cookies
  du domaine1 ne seront pas envoyés au domaine2. Cela a été fait pour éviter
  d'éventuels problèmes de sécurité.


Helpers
=======

Changement du constructeur
--------------------------

Afin de prendre en considération le fait que View a été retiré de la
ClassRegistry, la signature du Helper::__construct() a été changée. Vous devez
mettre à jour toutes les sous-classes pour utiliser ce qui suit::

    public function __construct(View $View, $settings = array())

Quand vous écrasez le constructeur, vous devez toujours aussi appeler
`parent::__construct`. `Helper::__construct` stocke l'instance de vue dans
`$this->_View` pour une référence future. Les configurations ne sont pas gérées
par le constructeur parent.

HelperCollection ajouté
-----------------------

Après un examen des responsabilités de chaque classe impliquée dans la couche
Vue, il nous est clairement apparu que la Vue gérait bien plus qu'une unique
tâche. La responsabilité de créer les helpers n'est pas centrale dans ce que la
Vue fait, et a été déplacée dans le HelperCollection. HelperCollection est
responsable du chargement et de la construction des helpers, ainsi que de
déclencher les callbacks sur les helpers. Par défaut, la Vue crée un
HelperCollection dans son constructeur, et l'utilise pour des opérations
ultérieures. L'HelperCollection pour une vue peut être trouvé dans
`$this->Helpers`.

Les motivations pour la reconstruction de cette fonctionnalité vient de
quelques soucis.

* La Vue qui était enregistrée dans ClassRegistry pouvait causer des problèmes
  empoisonnés d'enregistrement quand requestAction ou l'EmailComponent étaient
  utilisés.
* La Vue accessible comme un symbole global entraînait des abus.
* Les Helpers n'étaient pas contenus eux-mêmes. Après avoir construit un
  helper, vous deviez construire manuellement plusieurs autres objets afin
  d'obtenir un objet fonctionnant.

Vous pouvez en lire plus sur HelperCollection dans la documentation
:doc:`/core-libraries/collections`.

Propriétés dépréciées
---------------------

Les propriétés suivantes sur les helpers sont depréciées, vous devez utiliser
les propriétés de l'objet request ou les méthodes de l'Helper plutôt que
accéder directement à ces propriétés puisqu'elles seront supprimées dans une
version future.

-  ``Helper::$webroot`` est depréciée, utilisez la propriété webroot de l'objet
   request.
-  ``Helper::$base`` est depréciée, utilisez la propriété base de l'objet
   request.
-  ``Helper::$here`` est depréciée, utilisez la propriété here de l'objet
   request.
-  ``Helper::$data`` est depréciée, utilisez la propriété data de l'objet
   request.
-  ``Helper::$params`` est depréciée, utilisez ``$this->request`` à la place.

XmlHelper, AjaxHelper et JavascriptHelper retirés
-------------------------------------------------

Les Helpers AjaxHelper et JavascriptHelper ont été retirés puisqu'ils étaient
dépréciés dans la version 1.3. Le Helper XmlHelper a été retiré, puisqu'il
était obsolète et superflu avec les améliorations de :php:class:`Xml`. La
classe ``Xml`` doit être utilisée pour remplacer les utilisations anciennes de
XmlHelper.

Les Helpers AjaxHelper et JavascriptHelper sont remplacés par les Helpers
JsHelper et HtmlHelper.

JsHelper
--------

- ``JsBaseEngineHelper`` est maintenant abstrait, vous devrez implémenter
   toutes les méthodes qui généraient avant des erreurs.


PaginatorHelper
---------------

- ``PaginatorHelper::sort()`` prend maintenant les arguments title et key dans
   l'ordre inversé. $key sera maintenant toujours le premier. Cela a été fait
   pour prévenir les besoins d'échange des arguments lors de l'ajout d'un
   second argument.
-  PaginatorHelper avait un nombre de changements pour les paramètres de
   pagination utilisé en interne. Le key par défaut a été retiré.
-  PaginatorHelper supporte maintenant la génération des liens avec les
   paramètres de pagination dans querystring.

Il y a eu quelques améliorations dans pagination en général. Pour plus
d'informations sur cela, vous devriez lire la page des nouvelles
fonctionnalités de pagination.

FormHelper
----------

Le paramètre $selected retiré
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Le paramètre ``$selected`` a été retiré de plusieurs méthodes dans
``FormHelper``. Toutes les méthodes supportent maintenant une clé
``$attributes['value']`` qui doit être utilisée à la place de ``$selected``.
Ce changement simplifie les méthodes ``FormHelper``, réduit le nombre
d'arguments, et réduit les répétitions que ``$selected`` créait. Les méthodes
effectives sont:

-  FormHelper::select()
-  FormHelper::dateTime()
-  FormHelper::year()
-  FormHelper::month()
-  FormHelper::day()
-  FormHelper::hour()
-  FormHelper::minute()
-  FormHelper::meridian()

Les URLs par défaut dans les formulaires sont l'action courante
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

L'url par défaut pour tous les formulaires est maintenant l'url courante,
incluant les paramètres passés, nommés et querystring. Vous pouvez écraser ce
réglage par défaut en fournissant ``$options['url']`` dans le second paramètre
de ``$this->Form->create()``.

FormHelper::hidden()
~~~~~~~~~~~~~~~~~~~~

Les champs cachés n'enlèvent plus la classe attribut. Cela signifie que si il
y a des erreurs de validation sur des champs cachés, le nom de classe
``error-field`` sera appliqué.

CacheHelper
-----------

Le CacheHelper a été complètement découplé de la Vue, et des utilisations des
callbacks du Helper pour générer des caches. Vous devez retenir de placer
CacheHelper après les autres helpers qui modifient le contenu dans les
callbacks ``afterRender`` et ``afterLayout``. Si vous ne le faîtes pas,
certains changements ne feront pas parti du contenu récupéré.

CacheHelper n'utilise également plus ``<cake:nocache>`` pour indiquer les
régions non mises en cache. A la place, il utilise les commentaires spéciaux
HTML/XML. ``<!--nocache-->`` et ``<!--/nocache-->``. Cela aide CacheHelper à
générer des balises valides et continue à effectuer les mêmes fonctions
qu'avant. Vous pouvez en lire plus sur CacheHelper et les changements de Vue.

Les formats des attributs d'Helper plus flexibles
-------------------------------------------------

La classe Helper a 3 attributs protégés:

* ``Helper::_minimizedAttributes``: tableau avec des attributs minimums (ex:
  ``array('checked', 'selected', ...)``);
* ``Helper::_attributeFormat``: comment les attributs vont être générés (ex:
  ``%s="%s"``);
* ``Helper::_minimizedAttributeFormat``: comment les attributs minimums vont
  être générés: (ie ``%s="%s"``)

Par défaut, les valeurs utilisées dans CakePHP 1.3 n'ont pas été changées. Mais
vous pouvez maintenant utiliser les attributs boléens de HTML, comme
``<input type="checkbox" checked />``. Pour cela, changez juste
``$_minimizedAttributeFormat`` dans votre AppHelper en ``%s``.

Pour utiliser avec les helpers Html/Form et les autres, vous pouvez écrire::

    $this->Form->checkbox('field', array('checked' => true, 'value' => 'une_valeur'));

Une autre aptitude est que les attributs minimums peuvent être passés en item
et pas en clé. Par exemple::

    $this->Form->checkbox('field', array('checked', 'value' => 'une_valeur'));

Notez que ``checked`` a une clé numérique.

Controller (Contrôleur)
=======================

- Le constructeur du Controller prend maintenant deux paramètres. Les objets
  CakeRequest et CakeResponse. Ces objets sont utilisés pour remplir plusieurs
  propriétés dépreciées et seront mis dans $request et $response à l'intérieur
  du controller.
- ``Controller::$webroot`` est depréciée, utilisez la propriété webroot de
  l'objet request.
- ``Controller::$base`` est depréciée, utilisez la propriété base de l'objet
  request.
- ``Controller::$here`` est depréciée, utilisez la propriété here de l'objet
  request.
- ``Controller::$data`` est depréciée, utilisez la propriété data de l'objet
  request.
- ``Controller::$params`` est depréciée, utilisez ``$this->request`` à la place.
- ``Controller::$Component`` a été déplacée vers ``Controller::$Components``.
  Voir la documentation :doc:`/core-libraries/collections` pour plus
  d'informations.
- ``Controller::$view`` a été renommée en ``Controller::$viewClass``.
  ``Controller::$view`` est maintenant utilisée pour changer le fichier vue qui
  doit être rendu.
- ``Controller::render()`` retourne maintenant un objet CakeResponse.

Les propriétés depréciées dans Controller seront accessibles à travers la
méthode ``__get()``. Cette méthode va être retirée dans les versions futures,
donc il est recommandé que vous mettiez votre application à jour.

Le Controller définit maintenant une limite Max (maxLimit) pour la pagination.
Cette limite maximale est mise à 100, mais peut être écrasée dans les options
de $paginate.

Pagination
----------

La Pagination était traditionnellement une unique méthode dans le Controller,
cela créait pourtant un nombre de problèmes. La Pagination était difficile à
étendre, remplacer et modifier. Dans 2.0, la pagination a été extraite dans un
component. :php:meth:`Controller::paginate()` existe toujours, et sert en tant
que méthode commode pour le chargement et en utilisant le
:php:class:`PaginatorComponent`.

Pour plus d'informations sur les nouvelles fonctionnalités offertes par la
pagination dans 2.0, voir la documentation
:doc:`/core-libraries/components/pagination`.

Vue
===

La Vue n'est plus enregistrée dans ClassRegistry
------------------------------------------------

La vue enregistrée dans ClassRegistry entraînait des abus et créait
effectivement un symbole global. Dans 2.0 chaque Helper reçoit l'instance
`Vue` courante dans son constructeur. Cela autorise l'accès aux vues pour les
helpers de la même façon que dans le passé, sans créer de symboles globaux.
Vous pouvez accéder à l'instance de vue dans `$this->_View` dans n'importe quel
helper.

Propriétés dépréciées
---------------------

- ``View::$webroot`` est deprécié, utilisez la propriété webroot de l'objet
  request.
- ``View::$base`` est deprécié, utilisez la propriété base de l'objet request.
- ``View::$here`` est deprécié, utilisez la propriété here de l'objet request.
- ``View::$data`` est deprécié, utilisez la propriété data de l'objet request.
- ``View::$params`` est deprécié, utilisez ``$this->request`` à la place.
- ``View::$loaded`` a été retiré. Utilisez ``HelperCollection`` pour accéder
  aux helpers chargés.
- ``View::$model`` a été retiré. Ce behavior est maintenant dans
  :php:class:`Helper`
- ``View::$modelId`` a été retiré. Ce behavior est maintenant dans
  :php:class:`Helper`
- ``View::$association`` a été retiré. Ce behavior est maintenant dans
  :php:class:`Helper`
- ``View::$fieldSuffix`` a été retiré. Ce behavior est maintenant dans
  :php:class:`Helper`
- ``View::entity()`` a été retiré. Ce behavior est maintenant dans
  :php:class:`Helper`
- ``View::_loadHelpers()`` a été retiré, utilisez ``View::loadHelpers()``
  à la place.
- La façon dont ``View::element()`` utilise le cache a changé, voir en-dessous
  pour plus d'informations.
- Les callbacks de Vue ont été  transférés, voir en-dessous pour plus
  d'informations.
-  L'API pour ``View::element()`` a changé. Lire ici pour plus d'informations.

Les propriétés depréciées de Vue seront accessibles à travers une méthode
``__get()``. Cette méthode va être retirée dans les versions futures, ainsi il
est recommandé que vous mettiez à jour votre application.

Méthodes retirées
-----------------

* ``View::_triggerHelpers()`` Utilisez ``$this->Helpers->trigger()`` à la place.
* ``View::_loadHelpers()`` Utilisez ``$this->loadHelpers()`` à la place. Les
  Helpers chargent maintenant facilement leurs propres helpers.

Méthodes ajoutées
-----------------

* ``View::loadHelper($name, $settings = array());`` Charge un unique helper.
* ``View::loadHelpers()`` charge tous les helpers indiqués dans
  ``View::$helpers``.

View->Helpers
-------------

Par défaut, les objets Vue contiennent un :php:class:`HelperCollection` dans
``$this->Helpers``.

Thèmes
------

Pour utiliser les thèmes dans vos Controllers, vous n'avez plus à mettre
``var $view = 'Theme';``. Utilisez ``public $viewClass = 'Theme';`` à la place.

Changements de positionnement des callbacks
-------------------------------------------

beforeLayout utilisé pour se déclencher après scripts_for_layout et
content_for_layout a été préparé. Dans 2.0, beforeLayout est tiré avant
que toute variable spéciale soit préparée, vous autorisant à les manipuler
avant qu'elles soient passées au layout.
La même chose a été faite pour beforeRender. Il est maintenant tiré bien avant
que toute variable soit manipulée. En plus de ces changements, les callbacks
des helpers reçoivent toujours le nom du fichier qui est sur le point d'être
rendu. Ceci, combiné avec le fait que les helpers soient capables d'accéder à
la vue à travers ``$this->_View`` et la vue courante du contenu à travers
``$this->_View->output`` vous donne plus de puissance qu'avant.

La signature du callback Helper change
--------------------------------------

Les callbacks de Helper récupèrent maintenant toujours un argument passé à
l'intérieur. Pour BeforeRender et afterRender, c'est le fichier vue qui est
rendu. Pour beforeLayout et afterLayout, c'est le fichier layout qui est rendu.
Vos signatures de fonction des helpers doivent ressembler à cela::

    public function beforeRender($viewFile) {

    }

    public function afterRender($viewFile) {

    }

    public function beforeLayout($layoutFile) {

    }

    public function afterLayout($layoutFile) {

    }


L'élément attrapé, et les callbacks de vue ont été changés dans 2.0 pour vous
aider à vous fournir plus de flexibilité et de cohérence. :doc:`Lire plus sur
les changements </views>`.

CacheHelper decouplé
--------------------

Dans les versions precédentes, il y avait un couplage étroit entre
:php:class:`CacheHelper` et :php:class:`View`. Dans 2.0 ce couplage a été
retiré et CacheHelper utilise juste les callbacks comme les autres helpers
pour générer la page complète mise en cache.


CacheHelper ``<cake:nocache>`` tags changés
-------------------------------------------

Dans les versions précédentes, CacheHelper utilise un tag spécial
``<cake:nocache>`` comme marqueur pour la sortie qui ne devrait pas faire
partie de la page entièrement mise en cache. Ces tags ne faisaient parti
d'aucun schéma XML, et il n'était pas possible de valider dans les documents
HTML et XML. Dans 2.0, ces tags ont été remplacés avec des commentaires
HTML/XML::

    <cake:nocache> devient <!--nocache-->
    </cake:nocache> devient <!--/nocache-->

Le code interne pour la page vue complète mise en cache a aussi été changé,
alors assurez vous de nettoyer le cache de la vue quand vous mettez à jour.

Changements de MediaView
------------------------

:php:func:`MediaView::render()` force maintenant le téléchargement de types
de fichiers inconnus à la place de juste retourner false. Si vous le voulez,
vous pouvez fournir un fichier de téléchargement alternatif, vous spécifiez le
nom complet incluant l'extension en utilisant la clé 'name' dans le paramètre
tableau passé à la fonction.

PHPUnit plutôt que SimpleTest
=============================

Tous les cas de test du coeur et les infrastructures supportant ont été portés
pour utiliser PHPUnit 3.7. Bien sur, vous pouvez continuer à utiliser
SimpleTest dans votre application en remplaçant les fichiers liés. Pas plus de
support ne sera donné pour SimpleTest et il est recommandé que vous migriez
vers PHPUnit aussi. Pour plus d'informations sur la façon de migrer vos tests,
regardez les allusions sur la migration vers PHPUnit.

Plus de tests groupés
---------------------

PHPUnit ne fait pas la différence entre les cas de tests groupés et les cas de
tests uniques. A cause de cela, les options des tests groupés, et le support
pour les tests groupés à l'ancienne ont été retirés. Il est recommandé que les
TestGroupés soient portés vers les sous-classes de
``PHPUnit_Framework_Testsuite``. Vous pouvez trouver plusieurs exemples de ceci
dans la suite de test de CakePHP. Les méthodes liées aux tests groupés dans
``TestManager`` ont aussi été retirées.

Shell Testsuite
---------------

Le shell Testsuite a eu ses invocations simplifiées et étendues. Vous n'avez
plus besoin de faire la différenciation entre ``case`` et ``group``. On
suppose que tous les tests sont des cas. Dans le passé, vous vous auriez fait
``cake testsuite app case models/post``, vous pouvez maintenant faire
``cake testsuite app Model/Post``.

Le shell Testsuite a été reconstruit pour utiliser l'outils CLI de PHPUnit.
Cela supporte maintenant toutes les options de ligne de commande supportées
par PHPUnit. ``cake testsuite help`` vous montrera une liste de toutes les
modifications possibles.

Models
======

Les relations des Models sont maintenant facilement chargées. Vous pouvez être
dans une situation où l'assignation d'une valeur à une propriété non-existante
d'un model vous enverra les erreurs::

    $Post->inexistentProperty[] = 'value';

enverra à traver l'erreur "Notice: Indirect modification of overloaded property
$inexistentProperty has no effect"(Notice: La modification indirecte d'une
propriété $propriétéInexistente n'a aucun effet). Assigner une valeur initiale
à la propriété résoud le problème::

    $Post->nonexistentProperty = array();
    $Post->nonexistentProperty[] = 'value';

Ou déclare juste la propriété dans la classe model::

    class Post {
        public $nonexistentProperty = array();
    }

Chacune des ses approches résoudra les erreurs de notice.

La notation de ``find()`` dans CakePHP 1.2 n'est plus supportée. Les Finds
devront utiliser la notation ``$model->find('type', array(PARAMS))`` comme dans
CakePHP 1.3.

- ``Model::$_findMethods`` est maintenant ``Model::$findMethods``.  Cette
  propriété est maintenant publique et peut être modifiée par les behaviors.

Objets Database (Base de Données)
---------------------------------

CakePHP 2.0 introduit quelques changements dans les objets Database qui ne
devraient pas affecter grandement la compatibilité rétro-active. Le plus
grand changement est l'adoption de PDO pour la gestion des connexions aux
bases de données. Si vous utilisez une installation vanilla de PHP 5, vous
aurez déjà les extensions nécessaires installées, mais il se peut que vous
dussiez activer les extensions individuelles pour chaque driver que vous
souhaitez utiliser.

Utiliser PDO à travers toutes les BDD nous permet d'homogénéiser le code
pour chacune et fournit un comportement plus fiable et prévisible pour tous
les drivers. Il nous a également permis d'écrire des tests plus précis et
portables pour le code de la base de données liée.

La première chose qui va probablement manquer aux users, est les
statistiques "lignes affectées" et "total de lignes", comme elles ne sont
pas reportées à cause d'un design de PDO plus performant et paresseux, il
y a des façons de régler ce problème, mais qui sont très spécifiques à chaque
base de données. Ces statistiques ne sont pas parties cependant, mais
pourraient manquer ou même être inexactes pour certains drivers.

Une fonctionnalité sympa ajoutée après l'adoption de PDO est la possibilité
d'utiliser des requêtes préparées avec des placeholders de requêtes utilisant
le driver natif si il est disponible.

Liste des changements
~~~~~~~~~~~~~~~~~~~~~

* DboMysqli a été retirée, nous ferons seulement le support de DboMysql.
* API pour DboSource::execute a changé, elle prendra maintenant un tableau de
  valeurs requêtées en second paramètre::

    public function execute($sql, $params = array(), $options = array())

  devient::

    public function execute($sql, $options = array(), $params = array())

  le troisième paramètre est supposé recevoir les options pour se connecter,
  en ce moment, il ne comprend que l'option "log".

* DboSource::value() perd son troisième paramètre, il n'était pas utilisé de
  toute façon.
* DboSource::fetchAll() accepte maintenant un tableau en second paramètre,
  pour passer les valeurs devant être liées à la requête, le troisième
  paramètre a été abandonnée. Exemple::

    $db->fetchAll('SELECT * from users where nom_utilisateur = ? AND mot_de_passe = ?', array('jhon', '12345'));
    $db->fetchAll('SELECT * from users where nom_utilisateur = :nom_utilisateur AND mot_de_passe = :mot_de_passe', array('nom_utilisateur' => 'jhon', 'mot_de_passe' => '12345'));

Le driver PDO va automatiquement echapper ces valeurs pour vous.

* Les statistiques de Base de données sont collectées seulement si la propriété
  "fullDebug" de la BDD correspondante est mise à true.
* Nouvelle méthode DboSource::getConnection() va retourner l'objet PDO dans le
  cas où vous auriez besoin de parler directement au driver.
* Le traitement des valeurs boléennes a changé un peu pour pouvoir faciliter le
  croisement de base de données, vous devrez peut-être changer vos cas de test.
* Le support de PostgreSQL a été immensément amélioré, il crée maintenant
  correctement les schémas, vide les tables, et il est plus facile d'écrire des
  tests en l'utilisant.
* DboSource::insertMulti() n'acceptera plus les chaînes sql, passez juste un
  tableau de champs et un tableau imbriqué de valeurs pour les insérer tous en
  une fois.
* TranslateBehavior a été reconstruit pour utiliser les vituaFields des
  models, cela rend l'implémentation plus portable.
* Tous les cas de test avec les choses liées de MySQL ont été déplacés vers le
  cas de test du driver correspondant. Cela a laissé le fichier DboSourceTest
  un peu maigre.
* Support de l'imbrication des transactions. Maintenant il est possible de
  démarrer une transaction plusieurs fois. Il ne peut être engagé si la méthode
  de validation est appelé le même nombre de fois.
* Le support SQLite a été grandement amélioré. La différence majeure avec cake
  1.3 est qu'il ne supportera que SQLite 3.x. C'est une bonne alternative pour
  le développement des apps, et rapidement en lançant les cas de test.
* Les valeurs des colonnes boléennes vont être lancées automatiquement vers le
  type booléen natif de php, donc assurez vous de mettre à jour vos cas de test
  et code si vous attendiez une valeur retournée de type chaîne de caractère ou
  un entier: Si vous aviez une colonne "published" dans le passé en utilisant
  MySQL, toutes les valeurs retournées d'un find auraient été numériques dans
  le passé, maintenant elles sont strictement des valeurs boléennes.

Behaviors
=========

BehaviorCollection
------------------

- ``BehaviorCollection`` ne met plus en minuscule ``strtolower()`` les
  mappedMethods. Les mappedMethods des Behaviors sont maintenant sensible à la
  casse.

AclBehavior et TreeBehavior
---------------------------

- Ne supporte plus les chaînes de caractère pour la configuration. Exemple::

    public $actsAs = array(
        'Acl' => 'Controlled',
        'Tree' => 'nested'
    );

  devient::

    public $actsAs = array(
        'Acl' => array('type' => 'Controlled'),
        'Tree' => array('type' => 'nested')
    );


Plugins
=======

Les plugins n'ajoutent plus de façon magique leur prefix plugin aux components,
helpers et models utilisés à travers eux. Vous devez être explicites avec les
components, models et helpers que vous souhaitez utiliser. Dans le passé::

    var $components = array('Session', 'Comments');

Aurait regardé dans le plugin du controller avant de vérifier les components
app/core. Il va maintenant seulement regarder dans les components app/core.
Si vous souhaitez utiliser les objets à partir d'un plugin, vous devez mettre
le nom du plugin::

    public $components = array('Session', 'Comment.Commentaires');

Cela a été fait pour réduire la difficulté des problèmes de debug causés par
les ratés de la magie. Cela améliore aussi la cohérence dans votre application,
puisque les objets ont une façon autoritaire de les référencer.

Plugin App Controller et Plugin App Model
------------------------------------------

Les plugins AppController et AppModel ne sont plus directement localisés dans
le dossier plugin. Ils sont maintenant placés dans les dossiers des plugins des
Controllers et des Models comme ceci::

    /app
        /Plugin
            /Comment
                /Controller
                    CommentAppController.php
                /Model
                    CommentAppModel.php

Console
=======

La plupart de la console du framework a été reconstruite pour 2.0 pour traiter
un grand nombre de questions suivantes:

-  Etroitement couplé.
-  Il était difficile de faire un texte d'aide pour les shells.
-  Les paramètres pour les shells étaient fastidieux à valider.
-  Les tâches des Plugins n'étaient pas joignables.
-  Objets avec trop de responsabilités.

Changements Rétro-incompatibles de l'API du Shell
-------------------------------------------------

-  ``Shell`` n'a plus d'instance ``AppModel``. Cette instance ``AppModel``
   n'était pas correctement construite et était problématique.
-  ``Shell::_loadDbConfig()`` a été retiré. Il n'était pas assez générique pour
   rester dans le Shell. Vous pouvez utiliser ``DbConfigTask`` si vous avez
   besoin de demander à l'utilisateur de créer une config db.
-  Shells n'utilise plus ``$this->Dispatcher`` pour accéder à stdin, stdout, et
   stderr. Ils ont maintenant les objets ``ConsoleOutput`` et ``ConsoleInput``
   pour gérer cela.
-  Shells chargent les tâches facilement, et utilisent ``TaskCollection`` pour
   fournir une interface similaire à celle utilisée pour les Helpers,
   Components, et Behaviors pour le chargement à la volée des tâches.
-  ``Shell::$shell`` a été retiré.
-  ``Shell::_checkArgs()`` a été retiré. Configurer un ``ConsoleOptionParser``
-  Shells n'ont plus d'accès direct à ``ShellDispatcher``. Vous devez utiliser
   les objets ``ConsoleInput`` et ``ConsoleOutput`` à la place. Si vous avez
   besoin de dispatcher d'autres shells, regardez la section sur 'invoquer
   d'autres shells à partir de votre shell'.

Changements Rétro-incompatibles de l'API du ShellDispatcher
-----------------------------------------------------------

-  ``ShellDispatcher`` n'a plus de fichiers de gestion stdout, stdin, stderr.
-  ``ShellDispatcher::$shell`` a été retirée.
-  ``ShellDispatcher::$shellClass`` a été retirée.
-  ``ShellDispatcher::$shellName`` a été retirée.
-  ``ShellDispatcher::$shellCommand`` a été retirée.
-  ``ShellDispatcher::$shellPaths`` a été retirée, utilisez
   ``App::path('shells');`` à la place.
-  ``ShellDispatcher`` n'utilise plus 'help' comme méthode magique qui a un
   statut spécial. A la place, utilisez les options ``--help/-h``, et un
   parseur d'option.

Changements Rétro-incompatibles du Shell
----------------------------------------

- Bake's ControllerTask ne prend plus ``public`` et ``admin`` comme arguments
  passés. Ce sont maintenant des options, indiquées par ``--admin`` et
  ``--public``.

Il est recommandé que vous utilisiez le help sur les shells que vous utilisiez
pour voir si tous les paramètres ont changé. il est aussi recommandé que vous
lisiez les nouvelles fonctionnalités de la console, pour plus d'informations
sur les nouvelles APIs qui sont disponibles.

Debugger
========

La fonction ``debug()`` va sortir par défaut les chaînes sans danger de HTML.
C'est désactivé si c'est utilisé dans la console. L'option ``$showHtml`` pour
``debug()`` peut être mis sur false pour désactiver la sortie sans danger de
HTML du debug.

ConnectionManager
=================

``ConnectionManager::enumConnectionObjects()`` va maintenant retourner la
configuration courante pour chaque connexion créée, au lieu d'un tableau avec un
nom de fichier, d'un nom de classe et d'un plugin, qui n'était pas réellement
utiles.

Quand vous définirez les connexions à la base de données, vous aurez besoin de
faire quelques changements dans la façon dont les configs ont été définies dans
le passé. Basiquement dans classe de configuration de la base de données, la clé
"driver" n'est plus acceptée, seulement "datasource", afin de la rendre plus
cohérente. Aussi, comme les sources de données ont été déplacées vers les
packages, vous aurez besoin de passer le package dans lequel ils sont localisés.
Exemple::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'root',
        'password' => 'root',
        'database' => 'cake',
    );


.. meta::
    :title lang=fr: 2.0 Guide de Migration
    :description lang=fr: Cette page résume les changements à partir de CakePHP 1.3 qui vous aideront dans votre projet de    migration vers 2.0, ainsi qu'une référence pour un développeur pour se mettre au courant des changements faits dans le coeur depuis la branche CakePHP 1.3.
    :keywords lang=fr: cakephp mise à jour,cakephp migration,guide de migration,1.3 vers 2.0,mise à jour cakephp,compatibilité rétro-active,changements de l'api,x versions,structure de répertoire,nouvelles fonctionnalités
