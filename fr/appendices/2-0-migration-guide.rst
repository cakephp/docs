Guide de Migration 2.0
######################

Cette page résume les changements par rapport à CakePHP 1.3 qui aidera pour les
projets de migration vers la version 2.0, ainsi qu'une référence pour se mettre
à jour sur les changements faits dans le coeur depuis la branche CakePHP 1.3.
Soyez sur de lire les autres pages de ce guide pour toutes les nouvelles 
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
méthodes privées ou protégées avec une étendue public, vous rencontrerez des erreurs

Bien que cela ne constitue pas un changement énormer du framework, cela signifie qu'un
accès aux méthodes et variables à la visibilité serrée n'est maintenant plus possible.

Le nommage des Fichiers et Dossiers
===================================

Dans CakePHP 2.0, nous avons repensé la façon de structurer nos fichiers et dossiers.
Etant donné que PHP 5.3 supporte les espaces de nom (namespaces), nous avons décidé
de préparer notre base de code pour l'adoption dans un futur proche de cette version 
de PHP, donc nous avons adopté 
https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md.
Tout d'abord, nous avons regardé la structure interne de CakePHP 1.3 et avons réalisé 
qu'après toutes ces années, il n'y avait ni organisation claire des fichiers, ni une 
structure de dossiers vraiment logique où chaque fichier se trouve où il devrait. Avec 
ce changement, nous serions autorisés à exmpérimenter un peu le chargement (presque)
automatique des classes pour augmenter les performances globales du framework.

Le plus grand obstacle pour réussir cela, était de maintenir une sorte de compatiblité
rétro-active avec la façon dont les classes sont chargés en ce moment, et nous ne 
voulions définitivement pas devenir un framework avec des énormes préfixes de classe, 
des noms de classe du type ``Mon_Enorme_Classe_Dans_Le_Progiciel``. Nous avons décidé
d'adopter une stratégie de garder des noms de classe simples, tout en offrant une façon
très intuitive de déclaration des emplacements de classe et des chemins de migration
clairs pour la future version PHP 5.3 de CakePHP. Tout d'abord, mettons en évidence les
principaux changements dans la standardisation du nommage des fichiers que nous avons
adoptée:

Noms des Fichiers
-----------------

Tous les fichiers contenant les classes doivent être nommées selon la classe qu'il contient.
Aucun fichier ne doit contenir plus d'une classe. Donc, plus de minuscules ou de 
soulignements dans les noms de fichier. Voici quelques exemples:

* ``mes_trucs_controller.php`` devient ``MesTrucsController.php``
* ``form.php`` (a Helper) devient ``FormHelper.php``
* ``session.php`` (a Component) devient ``SessionComponent.php``

Cela rend le nommage des fichiers beaucoup plus clair et cohérent à travers les applications,
et aussi évite quelques cas où le chargement des fichiers aurait pu été géné dans le passé et
aurait pu entrainé un chargement non souhaité de fichiers.

Les Noms des Dossiers
---------------------

La plupart des dossiers devront être en CamelCase, spécialement ceux conteant des classes.
En songeant aux espaces de noms, chaque dossier représente un niveau dans la hiérachie des
espaces de noms, les dossiers qui ne contiennent pas de classes, ou ne constituent pas un 
espace de noms sur eux-mêmes, devraient être en LowerCase.

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
===============================================
Dans votre fichier ``app/webroot/.htaccess`` remplacez le  ``RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]`` avec ``RewriteRule ^(.*)$ index.php?/$1 [QSA,L]``

AppController / AppModel / AppHelper / AppShell
===============================================

Les fichiers ``app/app_controller.php``, ``app/app_model.php``, ``app/app_helper.php`` sont situés et nommés respectivement
comme ceci ``app/Controller/AppController.php``, ``app/Model/AppModel.php`` et ``app/Helper/AppHelper.php``.

Aussi, les shell/task sont étendus (extend) Appshell. Vous pouvez avoir votre propre AppShell.php dans ``app/Console/Command/AppShell.php``

Internationalization / Localization
===================================

:php:func:`__()` (La fonction raccourci de Double underscore) retourne toujours la traduction
(plus de echo).

Si vous voulez changer les résultats de la traduction, utilisez::

    <?php
    echo __('My Message');
    
Cela rempalce toutes les méthodes de translation raccourcies::

    __()
    __n()
    __d()
    __dn()
    __dc()
    __dcn()
    __c()

A côté de cela, si vous passez des paramètres supplémentaires, la traduction appelera 
`sprintf <http://php.net/manual/en/function.sprintf.php>`_  avec ces
paramètres retournés précédemment
parameters avant de retourner. Par exemple::

    <?php
    // Retournera quelque chose comme "Appelé: MaClasse:maMethode"
    echo __('Appelé: %s:%s', $nomdelaclasse, $nomdelamethode);

Elle est valide pour toutes les méthodes raccourcies de traduction.

Plus d'informations sur les spécificités de la fonction: 
`sprintf <http://php.net/manual/en/function.sprintf.php>`_.


Emplacement de la Classe et constantes changées
===============================================

Les constantes ``APP`` et ``CORE_PATH``
ont des valeur cohérentes entre le web et les environnement de la console. Dans les précedentes
versions de CakePHP, ces valeurs changeaient selon l'environnement.

Basics.php
==========

-  ``getMicrotime()`` a été retirée. Utilisez la fonction native ``microtime(true)``
   à la place.
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
-  La variable Globale appelée ``$TIME_START`` a été retirée. Utilisez la constante
   ``TIME_START`` ou ``$_SERVER['REQUEST_TIME']`` à la place.

Constantes Retirées
-------------------

Un nombre de constantes ont été retirées, puisqu'elles n'ataient plus exactes ou bien étaient dupliquées.

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

Cette nouvelle classe encapsule les paramètres et fonctions liées aux requêtes entrantes. 
Elle remplace plusieurs fonctionnalités de ``Dispatcher``,
``RequestHandlerComponent`` et Controller. Elle remplace aussi le tableau
``$this->params`` à tout endroit. ``CakeRequest`` implémente
``ArrayAccess`` donc la plupart des interactions avec les anciens tableaux params n'ont pas besoin de changement.
Voir les nouvelles fonctionnalités de CakeRequest pour plus d'informations.

Gestion des Requêtes, $_GET['url'] et fichiers .htaccess
=======================================================

CakePHP n'utilise plus ``$_GET['url']`` pour la gestion des chemins des requêtes de l'application.
A la place il utilise ``$_SERVER['PATH_INFO']``. Cela fournit une façon plus uniforme de gestion 
des requêtes entre les serveurs avec URL rewriting et ceux sans. Du fait de ces changements, 
vous aurez besoin de mettre à jout vos fichiers .htaccess et ``app/webroot/index.php``,
puisque ces fichiers ont été changés pour accueillir les changements.
De plus, ``$this->params['url']['url']`` n'existe plus. A la place, vous devrez utiliser
$this->request->url pour accéder à la même valeur.

Components
==========

Component est maintenant la classe de base requise pour tous les components. Vous devrez mettre à jour
vos components et leurs constructeurs, puisque tous deux ont changé::

    <?php
    class PrgComponent extends Component {
        function __construct(ComponentCollection $collection, $settings = array()) {
            parent::__construct($collection, $settings);
        }
    }

Tout comme les helpers il est important d'appeler ``parent::__construct()`` dans les components avec les
constructeurs surchargés. Les paramètres pour un component sont aussi maintenant passés à travers le
constructeur, et non plus via le callback ``initialize()``. Cela aide à avoir de bons objets construits,
et autorise la classe de base à gérer les propriétés supérieures.

Depuis que les paramètres ont été déplacés au constructeur du component, le callback
``initialize()`` ne reçoit plus ``$settings`` en 2ème paramètre.
Vous devrez mettre à jour vos components pour utiliser la signature méthode suivante::

    function initialize($controller) { }

De plus, la méthode initialize() est seulement appelée sur les components qui sont permis.
Cela signifie en général que les components qui sont directement attachés à l'objet
controlleur.

Callbacks dépréciés supprimés
-----------------------------

Tous les callbacks dépréciés dans Component ont été transférés à 
ComponentCollection. A la place, vous devriez utiliser la méthode `trigger()` pour intéragir
avec les callbacks. Si vous avez besoin de déclencher un callback, vous pouvez le faire en appelant::

    <?php
    $this->Components->trigger('someCallback', array(&$this));

Changement dans la désactivation des components
-----------------------------------------------

Dans le passé, vous étiez capable de désativer les components via `$this->Auth->enabled =
false;` par exemple. Dans CakePHP 2.0 vous devriez utiliser la méthode de désactivation des
ComponentCollection's, `$this->Components->disable('Auth');`. Utiliser les propriétés actives
ne va pas fonctionner.

AclComponent
------------

-  Les implémentations ``AclComponent`` sont maintenant requises pour implémenter
   ``AclInterface``.
-  ``AclComponent::adapter()`` a été ajouté pour permettre l'éxecution de la modification de
   l'utilisation de implémentation du component ``ACL``.
-  ``AclComponent::grant()`` a été déprécié, il sera supprimé dans une version future
    Utilisez ``AclComponent::allow()`` à la place.
-  ``AclComponent::revoke()`` a été déprécié, il sera supprimé dans une version future
   Utilisez AclComponent::deny() à la place.

RequestHandlerComponent
-----------------------

Beaucoup de méthodes de RequestHandlerComponent sont justes des proxies pour les méthodes
de ``CakeRequest``. Le méthodes suivantes ont été dépréciées et seront retirées dans les
versions futures:

-  ``isSsl()``
-  ``isAjax()``
-  ``isPost()``
-  ``isPut()``
-  ``isFlash()``
-  ``isDelete()``
-  ``getReferer()``
-  ``getClientIp()``
-  ``accepts()``, ``prefers()``, ``requestedWith()`` Tous sont maintenant gérés dans
    les types de contenu. Ils ne fonctionnent plus avec les mime-types. Vous pouvez
    utiliser ``RequestHandler::setContent()`` pour créer des nouveaux types de contenu.
-  ``RequestHandler::setContent()`` n'accepte plus de tableau en tant qu'argument unique,
    vous devez fournir les deux arguments.

SecurityComponent
-----------------

SecurityComponent ne gère plus l'Authentification Basic et Sommaire (Digest). Elles sont
toutes deux gérées par le nouveau AuthComponent. Les méthodes suivantes ont été retirées de
SecurityComponent:

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
les rôles de chaque composant.

AuthComponent
-------------

AuthComponent a été entièrement refait dans 2.0, ça é été fait pour réduire
les confusions et frustrations des développeurs.
De plus, AuthComponent a été construite plus flexible et extensible.
Vous pouvez trouver plus d'informations dans le guide
:doc:`/core-libraries/components/authentication`.

EmailComponent
--------------

EmailComponent a été déprecié et a crée une nouvelle classe de librairie pour 
envoyer les emails. Voir les changements pour Email 
:doc:`/core-utility-libraries/email` pour plus de détails.

SessionComponent
----------------

Session component a perdu les méthodes suivantes.

* activate()
* active()
* __start()

Retrait de cakeError
====================

La méthode ``cakeError()`` a été retirée. Il est recommandé que vous changiez
toutes les utilisations de ``cakeError`` pour utiliser les exceptions. ``cakeError`` 
a été retiré car il simulait les exceptions. Plutôt que la simulation, de réelles
exceptions sont utilisées dans CakePHP 2.0.

Gestion des Erreurs
===================

L'implémentation de la gestion des erreurs a changé de façon spectaculaire dans 2.0.
Les exceptions ont été introduites partout dans le framework, et la gestion des erreurs
a été mise à jour pour offrir plus de contrôle et de flexibilité. Vous pouvez
en lire plus dans les sections
:doc:`/development/exceptions` et :doc:`/development/errors`.

Classes Lib
===========

App
---

L'API pour ``App::build()`` a changé pour ``App::build($paths, $mode).`` Elle
vous autorise maintenant à soit ajouter, soit faire précéder ou bien 
réinitialiser / remplacer les chemins existants. Le paramètre $mode peut prendre
n'importe lesquelles des 3 valeurs suivantes: App::APPEND,
App::PREPEND, ``App::RESET``. Le behavior par défaut de la fonction reste le même
(ex. Faire précéder des nouveaux chemins par une liste existante).

App::path()
~~~~~~~~~~~

* Supporte maintenant les plugins, App::path('Controller', 'Users') va retourner
  la location du dossier des contrôleurs dans le plugin des utilisateurs.
* Ne fusionnera plus les chemins du coeur, il retournera seulement les chemins
  définies dans App::build() et ceux par défaut dans app (ou correspondant au
  plugin).

App::build()
~~~~~~~~~~~~

* Ne fusionnera plus le chemin de app avec les chemins du coeur.

App::objects()
~~~~~~~~~~~~~~

* Supporte maintenant les plugins, App::objects('Utilisateurs.Model') va retourner les modèles dans
  le plugin Utilisateurs.
* Retourne array() au lieu de false pour les résultats vides ou les types invalides.
* Ne retourne plus les objets du coeur, App::objects('core') retournera array().
* Retourne le nom complet de la classe.

La classe App perd les propriétés suivantes, utilisez la méthode App::path() pour accéder à leur valeur

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
  valeurs pour les chemins définies dans App::build().
* Ne sera plus capable de charger App::import('Component', 'Component') utilisez
  App::uses('Component', 'Controller');
* Utiliser App::import('Lib', 'CoreClass') pour charger les classes du coeur n'est 
  plus possible.
* Importer un fichier non-existant, fournir un mauvais type ou un mauvais nom de package
  , ou des valeurs nulles pour les paramètres $name et $file va donner une fausse valeur de
  retour.
* App::import('Core', 'CoreClass') n'est plus supporté, utilisez App::uses()
  à la place et laisser la classe autoloading faire le reste.
* Charger des fichiers Vendor ne recherchera pas de façon récursive dans les dossiers
  Vendors, cela ne convertira plus le fichier en underscore comme cela se faisant dans
  le passé.

App::core()
~~~~~~~~~~~

* Le premier paramètres n'est plus optionnel, il retournera toujours un chemin
* Il ne peut plus être utilisé pour obtenir les chemins des vendors
* Il acceptera seulement le nouveau style des noms de package

Chargement des Classes avec App::uses()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bien qu'il y ait eu une re-construction énorme dans la façon de charger les classes,
dans quelques occasions, vous aurez besoin de changer le code de votre application pour
respecter la façon que vous aviez l'habitude de faire. Le plus grand changement est 
l'introduction d'une nouvelle méthode::

    <?php
    App::uses('AuthComponent', 'Controller/Component');

Nous avons décidé que le nom de la fonction devait imiter le mot-clé ``use`` de PHP 5.3, 
juste pour la façon de déclarer où un nom de classe devait se trouver. Le premier
paramètre de :php:meth:`App::uses()` est le nom complet de la classe que vous avez 
l'intention de charger, et le second paramètre, le nom du package (ou espace de noms)
auquel il appartient. La principale différence avec le :php:meth:`App::import()` de 
CakePHP 1.3 est que l'actuelle n'importera pas la classe, il configurera juste
le système pour qu'à la première utilisation de la classe, il sera localisé.

Quelques exemples de l'utilisation de :php:meth:`App::uses()` quand on migre de
:php:meth:`App::import()`::

    <?php
    App::import('Controller', 'Pages');
    // devient 
    App::uses('PagesController', 'Controller');

    App::import('Component', 'Email');
    // devient 
    App::uses('EmailComponent', 'Controller/Component');

    App::import('View', 'Media');
    // devient 
    App::uses('MediaView', 'View');

    App::import('Core', 'Xml');
    // devient 
    App::uses('Xml', 'Utility');

    App::import('Datasource', 'MongoDb.MongoDbSource')
    // devient 
    App::uses('MongoDbSource', 'MongoDb.Model/Datasource')

Toutes les classes qui ont été chargées dans le passé utilisant ``App::import('Core', $class);``
auront besoin d'être chargées en utlisant ``App::uses()`` en référence au bon package.
Voir l'api pour localiser les classes dans leurs nouveaux dossiers. Quelques exemples::

    <?php
    App::import('Core', 'CakeRoute');
    // devient 
    App::uses('CakeRoute', 'Routing/Route');

    App::import('Core', 'Sanitize');
    // devient
    App::uses('Sanitize', 'Utility');

    App::import('Core', 'HttpSocket');
    // devient 
    App::uses('HttpSocket', 'Network/Http');

Au contraire de la façon dont fonctionnait :php:meth:`App::import()`, the new class
loader will not locate classes recursively. This led to an impressive
performance gain even on develop mode, at the cost of some seldom used features
that always caused side effects. To be clear again, the class loader will only
fetch the class in the exact package in which you told it to find it.

App::build() and core paths
~~~~~~~~~~~~~~~~~~~~~~~~~~~

:php:meth:`App::build()` will not merge app paths with core paths anymore.

Examples::

    <?php
    App::build(array('controllers' => array('/full/path/to/controllers'))) 
    //becomes 
    App::build(array('Controller' => array('/full/path/to/Controller')))

    App::build(array('helpers' => array('/full/path/to/controllers'))) 
    //becomes 
    App::build(array('View/Helper' => array('/full/path/to/View/Helper')))

CakeLog
-------

-  Log streams now need to implement :php:class:`CakeLogInterface`. Exceptions will be raised
   if a configured logger does not.

Cache
-----

-  :php:class:`Cache` is now a static class, it no longer has a getInstance() method.
-  CacheEngine is now an abstract class. You cannot directly create instances of 
   it anymore.
-  CacheEngine implementations must extend CacheEngine, exceptions will be
   raised if a configured class does not.
-  FileCache now requires trailing slashes to be added to the path setting when
   you are modifying a cache configuration.
-  Cache no longer retains the name of the last configured cache engine. This
   means that operations you want to occur on a specific engine need to have the
   $config parameter equal to the config name you want the operation to occur
   on.

::

    <?php
    Cache::config('something');
    Cache::write('key', $value);
    
    // would become
    Cache::write('key', $value, 'something');

Router
------

- You can no longer modify named parameter settings with
  ``Router::setRequestInfo()``. You should use ``Router::connectNamed()`` to
  configure how named parameters are handled.
- Router no longer has a ``getInstance()`` method. It is a static class, call
  its methods and properties statically.
- ``Router::getNamedExpressions()`` is deprecated. Use the new router
  constants. ``Router::ACTION``, ``Router::YEAR``, ``Router::MONTH``,
  ``Router::DAY``, ``Router::ID``, and ``Router::UUID`` instead.
- ``Router::defaults()`` has been removed.  Delete the core routes file
  inclusion from your applications routes.php file to disable default routing.
  Conversely if you want default routing, you will have to add an include to 
  ``Cake/Config/routes.php`` in your routes file.
- When using Router::parseExtensions() the extension parameter is no longer
  under ``$this->params['url']['ext']``. Instead it is available at
  ``$this->request->params['ext']``.
- Default plugin routes have changed. Plugin short routes are no longer built
  in for any actions other than index.  Previously ``/users`` and ``/users/add``
  would map to the UsersController in the Users plugin.  In 2.0, only the
  ``index`` action is given a short route.  If you wish to continue using short
  routes, you can add a route like::

    <?php
    Router::connect('/users/:action', array('controller' => 'users', 'plugin' => 'users'));
  
  To your routes file for each plugin you need short routes on.

Your app/Config/routes.php file needs to be updated adding this line at the bottom of the file::

    <?php
    require CAKE . 'Config' . DS . 'routes.php';

This is needed in order to generate the default routes for your application. If you do not wish to have such routes,
or want to implement your own standard you can include your own file with custom router rules.

Dispatcher
----------

- Dispatcher has been moved inside of cake/libs, you will have to update your
  ``app/webroot/index.php`` file.
- ``Dispatcher::dispatch()`` now takes two parameters.  The request and
  response objects.  These should be instances of ``CakeRequest`` &
  ``CakeResponse`` or a subclass thereof.
- ``Dispatcher::parseParams()`` now only accepts a ``CakeRequest`` object.
- ``Dispatcher::baseUrl()`` has been removed.
- ``Dispatcher::getUrl()`` has been removed.
- ``Dispatcher::uri()`` has been removed.
- ``Dispatcher::$here`` has been removed.

Configure
---------

-  ``Configure::read()`` with no parameter no longer returns the value of
   'debug' instead it returns all values in Configure. Use
   ``Configure::read('debug');`` if you want the value of debug.
-  ``Configure::load()`` now requires a ConfigReader to be setup. Read 
   :ref:`loading-configuration-files` for more information.
-  ``Configure::store()`` now writes values to a given Cache configuration. Read
   :ref:`loading-configuration-files` for more information.

Scaffold
--------

-  Scaffold 'edit' views should be renamed to 'form'. This was done to make
   scaffold and bake templates consistent.

   -  ``views/scaffolds/edit.ctp`` -> ``View/Scaffolds/form.ctp``
   -  ``views/posts/scaffold.edit.ctp`` -> ``View/Posts/scaffold.form.ctp``

Xml
---

-  The class Xml was completely re-factored. Now this class does not manipulate
   data anymore, and it is a wrapper to SimpleXMLElement. You can use the following
   methods:

   -  ``Xml::build()``: static method that you can pass an xml string, array, path
      to file or url. The result will be a SimpleXMLElement instance or an
      exception will be thrown in case of error.
   -  ``Xml::fromArray():`` static method that returns a SimpleXMLElement from an
      array.
   -  ``Xml::toArray()``: static method that returns an array from
      SimpleXMLElement.

You should see the :php:class:`Xml` documentation for more information on the changes made to
the Xml class.

Inflector
---------

-  Inflector no longer has a ``getInstance()`` method.
-  ``Inflector::slug()`` no longer supports the $map argument. Use
   ``Inflector::rules()`` to define transliteration rules.

CakeSession
-----------

CakeSession is now a fully static class, both ``SessionHelper`` and
``SessionComponent`` are wrappers and sugar for it.  It can now easily be used
in models or other contexts.  All of its methods are called statically.

Session configuration has also changed :doc:`see the session section for more
information </development/sessions>`

HttpSocket
----------

- HttpSocket doesn't change the header keys. Following other places in core,
  the HttpSocket does not change the headers. :rfc:`2616` says that headers are case
  insensitive, and HttpSocket preserves the values the remote host sends.
- HttpSocket returns responses as objects now. Instead of arrays, HttpSocket
  returns instances of HttpResponse.  See the :php:class:`HttpSocket`
  documentation for more information.
- Cookies are stored internally by host, not per instance. This means that, if
  you make two requests to different servers, cookies from domain1 won't be sent
  to domain2.  This was done to avoid possible security problems.


Helpers
=======

Constructor changed
-------------------

In order to accommodate View being removed from the ClassRegistry, the signature
of Helper::__construct() was changed.  You should update any subclasses to use
the following::

    <?php
    function __construct(View $View, $settings = array())

When overriding the constructor you should always call `parent::__construct` as
well.  `Helper::__construct` stores the view instance at `$this->_View` for
later reference.  The settings are not handled by the parent constructor.

HelperCollection added
----------------------

After examining the responsibilities of each class involved in the View layer,
it became clear that View was handling much more than a single task. The
responsibility of creating helpers is not central to what View does, and was
moved into HelperCollection. HelperCollection is responsible for loading and
constructing helpers, as well as triggering callbacks on helpers.  By default,
View creates a HelperCollection in its constructor, and uses it for subsequent
operations.  The HelperCollection for a view can be found at `$this->Helpers`

The motivations for refactoring this functionality came from a few issues.

* View being registered in ClassRegistry could cause registry poisoning issues
  when requestAction or the EmailComponent were used.
* View being accessible as a global symbol invited abuse.
* Helpers were not self contained.  After constructing a helper, you had to
  manually construct several other objects in order to get a functioning object.

You can read more about HelperCollection in the
:doc:`/core-libraries/collections` documentation.

Deprecated properties
---------------------

The following properties on helpers are deprecated, you should use the request
object properties or Helper methods instead of directly accessing these
properties as they will be removed in a future release.

-  ``Helper::$webroot`` is deprecated, use the request object's webroot
   property.
-  ``Helper::$base`` is deprecated, use the request object's base property.
-  ``Helper::$here`` is deprecated, use the request object's here property.
-  ``Helper::$data`` is deprecated, use the request object's data property.
-  ``Helper::$params`` is deprecated, use the ``$this->request`` instead.

XmlHelper, AjaxHelper and JavascriptHelper removed
--------------------------------------------------

The AjaxHelper and JavascriptHelper have been removed as they were deprecated in
version 1.3. The XmlHelper was removed, as it was made obsolete and redundant
with the improvements to :php:class:`Xml`.  The ``Xml`` class should be used to
replace previous usage of XmlHelper.

The AjaxHelper, and JavascriptHelper are replaced with the JsHelper and HtmlHelper.

JsHelper
--------

-  ``JsBaseEngineHelper`` is now abstract, you will need to implement all the
   methods that previously generated errors.

PaginatorHelper
---------------

-  ``PaginatorHelper::sort()`` now takes the title and key arguments in the
   reverse order. $key will always be first now. This was done to prevent
   needing to swap arguments when adding a second one.
-  PaginatorHelper had a number of changes to the paging params used internally.
   The default key has been removed.
-  PaginatorHelper now supports generating links with paging parameters in the
   querystring.

There have been a few improvements to pagination in general. For more
information on that you should read the new pagination features page.

FormHelper
----------

$selected parameter removed
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``$selected`` parameter was removed from several methods in ``FormHelper``.
All methods now support a ``$attributes['value']`` key now which should be used
in place of ``$selected``. This change simplifies the ``FormHelper`` methods,
reducing the number of arguments, and reduces the duplication that ``$selected``
created. The effected methods are:

-  FormHelper::select()
-  FormHelper::dateTime()
-  FormHelper::year()
-  FormHelper::month()
-  FormHelper::day()
-  FormHelper::hour()
-  FormHelper::minute()
-  FormHelper::meridian()

Default urls on forms is the current action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The default url for all forms, is now the current url including passed, named,
and querystring parameters. You can override this default by supplying
``$options['url']`` in the second parameter of ``$this->Form->create()``.

FormHelper::hidden()
~~~~~~~~~~~~~~~~~~~~

Hidden fields no longer remove the class attribute. This means that if there are
validation errors on hidden fields, the ``error-field`` classname will be
applied.

CacheHelper
-----------

CacheHelper has been fully decoupled from View, and uses helper callbacks to
generate caches. You should remember to place CacheHelper after other helpers
that modify content in their ``afterRender`` and ``afterLayout`` callbacks. If
you don't some changes will not be part of the cached content.

CacheHelper also no longer uses ``<cake:nocache>`` to indicate un-cached
regions. Instead it uses special HTML/XML comments. ``<!--nocache-->`` and
``<!--/nocache-->``. This helps CacheHelper generate valid markup and still
perform the same functions as before. You can read more CacheHelper and View
changes.

Helper Attribute format more flexible
-------------------------------------

The Helper class has more 3 protected attributes:

* ``Helper::_minimizedAttributes``: array with minimized attributes (ie:
  ``array('checked', 'selected', ...)``);
* ``Helper::_attributeFormat``: how attributes will be generated (ie:
  ``%s="%s"``);
* ``Helper::_minimizedAttributeFormat``: how minimized attributes will be
  generated: (ie ``%s="%s"``)

By default the values used in CakePHP 1.3 were not changed. But now you can
use boolean attributes from HTML, like ``<input type="checkbox" checked />``. To
this, just change ``$_minimizedAttributeFormat`` in your AppHelper to ``%s``.

To use with Html/Form helpers and others, you can write::

    $this->Form->checkbox('field', array('checked' => true, 'value' => 'some_value'));

Other facility is that minimized attributes can be passed as item and not as
key. For example::

    $this->Form->checkbox('field', array('checked', 'value' => 'some_value'));

Note that ``checked`` have a numeric key.

Controller
==========

- Controller's constructor now takes two parameters. A CakeRequest, and 
  CakeResponse objects. These objects are used to populate several deprecated 
  properties and will be set to $request and $response inside the controller.
- ``Controller::$webroot`` is deprecated, use the request object's webroot
  property.
- ``Controller::$base`` is deprecated, use the request object's base property.
- ``Controller::$here`` is deprecated, use the request object's here property.
- ``Controller::$data`` is deprecated, use the request object's data property.
- ``Controller::$params`` is deprecated, use the ``$this->request`` instead.
- ``Controller::$Component`` has been moved to ``Controller::$Components``.  See
  the :doc:`/core-libraries/collections` documentation for more information.
- ``Controller::$view`` has been renamed to ``Controller::$viewClass``.
  ``Controller::$view`` is now used to change which view file is rendered.
- ``Controller::render()`` now returns a CakeResponse object.

The deprecated properties on Controller will be accessible through a ``__get()``
method. This method will be removed in future versions, so it's recommended that
you update your application.

Controller now defines a maxLimit for pagination. This maximum limit is set to
100, but can be overridden in the $paginate options.


Pagination
----------

Pagination has traditionally been a single method in Controller, this created a
number of problems though. Pagination was hard to extend, replace, or modify. For
2.0 pagination has been extracted into a component. :php:meth:`Controller::paginate()` still
exists, and serves as a convenience method for loading and using the
:php:class:`PaginatorComponent`.

For more information on the new features offered by pagination in 2.0, see the
:doc:`/core-libraries/components/pagination` documentation.

View
====

View no longer registered in ClassRegistry
------------------------------------------

The view being registered ClassRegistry invited abuse and affectively created a
global symbol.  In 2.0 each Helper receives the current `View` instance in its
constructor.  This allows helpers access to the view in a similar fashion as in
the past, without creating global symbols.  You can access the view instance at
`$this->_View` in any helper.

Deprecated properties
---------------------

-  ``View::$webroot`` is deprecated, use the request object's webroot property.
-  ``View::$base`` is deprecated, use the request object's base property.
-  ``View::$here`` is deprecated, use the request object's here property.
-  ``View::$data`` is deprecated, use the request object's data property.
-  ``View::$params`` is deprecated, use the ``$this->request`` instead.
-  ``View::$loaded`` has been removed. Use the ``HelperCollection`` to access
   loaded helpers.
- ``View::$model`` has been removed. This behavior is now on :php:class:`Helper`
- ``View::$modelId`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::$association`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::$fieldSuffix`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::entity()`` has been removed. This behavior is now on
  :php:class:`Helper`
-  ``View::_loadHelpers()`` has been removed, used ``View::loadHelpers()``
   instead.
-  How ``View::element()`` uses caching has changed, see below for more
   information.
-  View callbacks have been shifted around, see below for more information
-  API for ``View::element()`` has changed. Read here for more info.

The deprecated properties on View will be accessible through a ``__get()``
method. This method will be removed in future versions, so it's recommended that
you update your application.

Removed methods
---------------

* ``View::_triggerHelpers()`` Use ``$this->Helpers->trigger()`` instead.  
* ``View::_loadHelpers()`` Use ``$this->loadHelpers()`` instead.  Helpers now lazy
  load their own helpers.

Added methods
-------------

* ``View::loadHelper($name, $settings = array());`` Load a single helper.
* ``View::loadHelpers()`` Loads all the helpers indicated in ``View::$helpers``.

View->Helpers
-------------

By default View objects contain a :php:class:`HelperCollection` at ``$this->Helpers``.

Themes
------

To use themes in your Controller you no longer set ``var $view = 'Theme';``. 
Use ``public $viewClass = 'Theme';`` instead.

Callback positioning changes
----------------------------

beforeLayout used to fire after scripts_for_layout and content_for_layout were
prepared. In 2.0, beforeLayout is fired before any of the special variables are
prepared, allowing you to manipulate them before they are passed to the layout.
The same was done for beforeRender. It is now fired well before any view
variables are manipulated. In addition to these changes, helper callbacks always
receive the name of the file about to be rendered. This combined with helpers
being able to access the view through ``$this->_View`` and the current view
content through ``$this->_View->output`` gives you more power than ever before.

Helper callback signature changes
---------------------------------

Helper callbacks now always get one argument passed in. For beforeRender and
afterRender it is the view file being rendered. For beforeLayout and afterLayout
it is the layout file being rendered. Your helpers function signatures should
look like::

    <?php
    function beforeRender($viewFile) {

    }

    function afterRender($viewFile) {

    }

    function beforeLayout($layoutFile) {

    }

    function afterLayout($layoutFile) {

    }


Element caching, and view callbacks have been changed in 2.0 to help provide you
with more flexibility and consistency. :doc:`Read more about those
changes </views>`.

CacheHelper decoupled
---------------------

In previous versions there was a tight coupling between :php:class:`CacheHelper`
and :php:class:`View`. For 2.0 this coupling has been removed and CacheHelper
just uses callbacks like other helpers to generate full page caches.


CacheHelper ``<cake:nocache>`` tags changed
-------------------------------------------

In previous versions, CacheHelper used a special ``<cake:nocache>`` tag as
markers for output that should not be part of the full page cache. These tags
were not part of any XML schema, and were not possible to validate in HTML or
XML documents. For 2.0, these tags have been replaced with HTML/XML comments::

    <cake:nocache> becomes <!--nocache-->
    </cake:nocache> becomes <!--/nocache-->

The internal code for full page view caches has also changed, so be sure to
clear out view cache files when updating.

MediaView changes
-----------------

:php:func:`MediaView::render()` now forces download of unknown file types
instead of just returning false. If you want you provide an alternate download
filename you now specify the full name including extension using key 'name' in
the array parameter passed to the function.


PHPUnit instead of SimpleTest
=============================

All of the core test cases and supporting infrastructure have been ported to use
PHPUnit 3.5. Of course you can continue to use SimpleTest in your application by
replacing the related files. No further support will be given for SimpleTest and
it is recommended that you migrate to PHPUnit as well. For some additional
information on how to migrate your tests see PHPUnit migration hints.

No more group tests
-------------------

PHPUnit does not differentiate between group tests and single test cases in the
runner. Because of this, the group test options, and support for old style group
tests has been removed. It is recommended that GroupTests be ported to
``PHPUnit_Framework_Testsuite`` subclasses. You can find several examples of this
in CakePHP's test suite. Group test related methods on ``TestManager`` have also
been removed.

Testsuite shell
---------------

The testsuite shell has had its invocation simplified and expanded. You no
longer need to differentiate between ``case`` and ``group``. It is assumed that
all tests are cases. In the past you would have done
``cake testsuite app case models/post`` you can now do ``cake testsuite app
Model/Post``.


The testsuite shell has been refactored to use the PHPUnit cli tool. It now
supports all the command line options supported by PHPUnit.
``cake testsuite help`` will show you a list of all possible modifiers.

Models
======

Model relationships are now lazy loaded. You can run into a situation where
assigning a value to a nonexistent model property will throw errors::

    <?php
    $Post->inexistentProperty[] = 'value';

will throw the error "Notice: Indirect modification of overloaded property
$inexistentProperty has no effect". Assigning an initial value to the property
solves the issue::

    <?php
    $Post->nonexistentProperty = array();
    $Post->nonexistentProperty[] = 'value';

Or just declare the property in the model class::

    <?php
    class Post {
        public $nonexistentProperty = array();
    }

Either of these approaches will solve the notice errors.

The notation of ``find()`` in Cake 1.2 is no longer supported. Finds should use
notation ``$model->find('type', array(PARAMS))`` as in Cake 1.3.

- ``Model::$_findMethods`` is now ``Model::$findMethods``.  This property is now
  public and can be modified by behaviors.



Database objects
----------------

Cake 2.0 introduces some changes to Database objects that should not greatly
affect backwards compatibility. The biggest one is the adoption of PDO for
handling database connections. If you are using a vanilla installation of PHP 5
you will already have installed the needed extensions, but you may need to
activate individual extensions for each driver you wish to use.

Using PDO across all DBOs let us homogenize the code for each one and provide
more reliable and predictable behavior for all drivers. It also allowed us to
write more portable and accurate tests for database related code.

The first thing users will probably miss is the "affected rows" and "total rows"
statistics, as they are not reported due to the more performant and lazy design
of PDO, there are ways to overcome this issue but very specific to each
database. Those statistics are not gone, though, but could be missing or even
inaccurate for some drivers. 

A nice feature added after the PDO adoption is the ability to use prepared
statements with query placeholders using the native driver if available.

List of Changes
~~~~~~~~~~~~~~~

* DboMysqli was removed, we will support DboMysql only.
* API for DboSource::execute has changed, it will now take an array of query
  values as second parameter::

    <?php
    public function execute($sql, $params = array(), $options = array())

  became::

    <?php
    public function execute($sql, $options = array(), $params = array())

  third parameter is meant to receive options for logging, currently it only
  understands the "log" option.

* DboSource::value() looses its third parameter, it was not used anyways
* DboSource::fetchAll() now accepts an array as second parameter, to pass values
  to be bound to the query, third parameter was dropped. Example::

    <?php
    $db->fetchAll('SELECT * from users where username = ? AND password = ?', array('jhon', '12345'));
    $db->fetchAll('SELECT * from users where username = :username AND password = :password', array('username' => 'jhon', 'password' => '12345'));

The PDO driver will automatically escape those values for you.

* Database statistics are collected only if the "fullDebug" property of the
  corresponding DBO is set to true.
* New method DboSource::getConnection() will return the PDO object in case you
  need to talk to the driver directly.
* Treatment of boolean values changed a bit to make it more cross-database
  friendly, you may need to change your test cases.
* Postgresql support was immensely improved, it now correctly creates schemas,
  truncate tables, and is easier to write tests using it.
* DboSource::insertMulti() will no longer accept sql string, just pass an array
  of fields and a nested array of values to insert them all at once
* TranslateBehavior was refactored to use model virtualFields, this makes the
  implementation more portable.
* All tests cases with Mysql related stuff were moved to the corresponding
  driver test case. This left the DboSourceTest file a bit skinny.
* Transaction nesting support. Now it is possible to start a transaction several
  times. It will only be committed if the commit method is called the same
  amount of times.
* Sqlite support was greatly improved. The major difference with cake 1.3 is
  that it will only support Sqlite 3.x . It is a great alternative for
  development apps, and quick at running test cases.
* Boolean column values will be casted to php native boolean type automatically,
  so make sure you update your test cases and code if you were expecting the
  returned value to be a string or an integer: If you had a "published" column in
  the past using mysql all values returned from a find would be numeric in the
  past, now they are strict boolean values.

BehaviorCollection
------------------

-  ``BehaviorCollection`` no longer ``strtolower()'s`` mappedMethods. Behavior
   mappedMethods are now case sensitive.

AclBehavior and TreeBehavior
----------------------------

- No longer supports strings as configuration. Example::

    <?php
    public $actsAs = array(
        'Acl' => 'Controlled',
        'Tree' => 'nested'
    );

  became::

    <?php
    public $actsAs = array(
        'Acl' => array('type' => 'Controlled'),
        'Tree' => array('type' => 'nested')
    );


Plugins
=======

Plugins no longer magically append their plugin prefix to components, helpers
and models used within them. You must be explicit with the components, models,
and helpers you wish to use. In the past::

    <?php
    var $components = array('Session', 'Comments');

Would look in the controller's plugin before checking app/core components. It
will now only look in the app/core components. If you wish to use objects from a
plugin you must put the plugin name::

    <?php
    public $components = array('Session', 'Comment.Comments');

This was done to reduce hard to debug issues caused by magic misfiring. It also
improves consistency in an application, as objects have one authoritative way to
reference them.

Plugin App Controller and Plugin App Model
------------------------------------------

The plugin AppController and AppModel are no longer located directly in the 
plugin folder. They are now placed into the plugin's Controller and Model 
folders as such::

    /app
        /Plugin
            /Comment
                /Controller
                    CommentAppController.php
                /Model
                    CommentAppModel.php

Console
=======

Much of the console framework was rebuilt for 2.0 to address many of the
following issues:

-  Tightly coupled.
-  It was difficult to make help text for shells.
-  Parameters for shells were tedious to validate.
-  Plugin tasks were not reachable.
-  Objects with too many responsibilities.

Backwards incompatible Shell API changes
----------------------------------------

-  ``Shell`` no longer has an ``AppModel`` instance. This ``AppModel`` instance
   was not correctly built and was problematic.
-  ``Shell::_loadDbConfig()`` has been removed. It was not generic enough to
   stay in Shell. You can use the ``DbConfigTask`` if you need to ask the user
   to create a db config.
-  Shells no longer use ``$this->Dispatcher`` to access stdin, stdout, and
   stderr. They have ``ConsoleOutput`` and ``ConsoleInput`` objects to handle
   that now.
-  Shells lazy load tasks, and use ``TaskCollection`` to provide an interface
   similar to that used for Helpers, Components, and Behaviors for on the fly
   loading of tasks.
-  ``Shell::$shell`` has been removed.
-  ``Shell::_checkArgs()`` has been removed. Configure a ``ConsoleOptionParser``
-  Shells no longer have direct access to ``ShellDispatcher``. You should use
   the ``ConsoleInput``, and ``ConsoleOutput`` objects instead. If you need to
   dispatch other shells, see the section on 'Invoking other shells from your
   shell'.

Backwards incompatible ShellDispatcher API changes
--------------------------------------------------

-  ``ShellDispatcher`` no longer has stdout, stdin, stderr file handles.
-  ``ShellDispatcher::$shell`` has been removed.
-  ``ShellDispatcher::$shellClass`` has been removed.
-  ``ShellDispatcher::$shellName`` has been removed.
-  ``ShellDispatcher::$shellCommand`` has been removed.
-  ``ShellDispatcher::$shellPaths`` has been removed, use
   ``App::path('shells');`` instead.
-  ``ShellDispatcher`` no longer uses 'help' as a magic method that has special
   status. Instead use the ``--help/-h`` options, and an option parser.

Backwards incompatible Shell Changes
------------------------------------

-  Bake's ControllerTask no longer takes ``public`` and ``admin`` as passed
   arguments. They are now options, indicated like ``--admin`` and ``--public``.

It's recommended that you use the help on shells you use to see what if any
parameters have changed. It's also recommended that you read the console new
features for more information on new APIs that are available.

Debugging
=========

The ``debug()`` function now defaults to outputting html safe strings. This is
disabled if being used in the console. The ``$showHtml`` option for ``debug()``
can be set to false to disable html-safe output from debug.

ConnectionManager
=================

``ConnectionManager::enumConnectionObjects()`` will now return the current
configuration for each connection created, instead of an array with filename,
classname and plugin, which wasn't really useful.

When defining database connections you will need to make some changes to the way
configs were defined in the past. Basically in the database configuration class,
the key "driver" is not accepted anymore, only "datasource", in order to make it
more consistent. Also, as the datasources have been moved to packages you will
need to pass the package they are located in. Example::

    <?php
    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'root',
        'password' => 'root',
        'database' => 'cake',
    );


.. meta::
    :title lang=en: 2.0 Migration Guide
    :description lang=en: This page summarizes the changes from CakePHP 1.3 that will assist in a project migration to 2.0, as well as for a developer reference to get up to date with the changes made to the core since the CakePHP 1.3 branch.
    :keywords lang=en: cakephp upgrade,cakephp migration,migration guide,1.3 to 2.0,update cakephp,backwards compatibility,api changes,x versions,directory structure,new features
