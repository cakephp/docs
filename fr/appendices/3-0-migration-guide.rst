3.0 Guide de Migration
######################

Cette page résume les changements de CakePHP 2.x qui aidera à la migration d'un
projet vers la version 3.0, ainsi qu'une référence pour être à jour des
changements faits dans le cœur depuis la branche CakePHP 2.x. Assurez-vous de
bien lire les autres pages de ce guide pour toutes les nouvelles
fonctionnalités et les changements de l'API.

Prérequis
=========

- CakePHP 3.x a besoin de la Version 5.4.16 ou supérieur de PHP.
- CakePHP 3.x a besoin de l'extension mbstring.
- CakePHP 3.x a besoin de l'extension intl.

.. warning::

    CakePHP 3.0 ne fonctionnera pas si vous n'avez pas les prérequis ci-dessus.

Outil d'Upgrade
===============

Alors que ce document couvre tous les changements non rétro-compatibles et les
évolutions faites dans CakePHP 3.0, nous avons également créé une application
de console pour vous aider à réaliser quelques changements qui consomment du
temps. Vous pouvez `Récupérer l'outil d'upgrade depuis Github
<https://github.com/cakephp/upgrade>`_.

Organisation des Répertoires de l'Application
=============================================

L'organisation des répertoires de l'application a changé et suit maintenant
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Vous devez utiliser le projet de
`squelette d'application <https://github.com/cakephp/app>`_ comme
point de référence lors de la mise à jour de votre application.

CakePHP doit être installé avec Composer
========================================

Puisque CakePHP ne peut plus être installé via PEAR, ou dans un répertoire
partagé, ces options ne sont plus supportées. A la place, vous devez utiliser
`Composer <http://getcomposer.org>`_ pour installer CakePHP dans votre
application.

Namespaces (Espaces de Noms)
============================

Toutes les classes du cœur de CakePHP sont maintenant dans des namespaces et
suivent les spécifications du chargement PSR-4. Par exemple
**src/Cache/Cache.php** est dans le namespace ``Cake\Cache\Cache``. Les
constantes globales et les méthodes de helper comme :php:meth:`__()` et
:php:meth:`debug()` ne sont pas mis dans un namespace pour des raisons de
commodité.

Constantes retirées
===================

Les constantes dépréciées suivantes ont été retirées:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

Configuration
=============

La configuration dans CakePHP 3.0 est significativement différente des
versions précédentes. Vous devriez lire la documentation
:doc:`/development/configuration` sur la façon dont la configuration est faite
dans la version 3.0.

Vous ne pouvez plus utiliser ``App::build()`` pour configurer les chemins de
classe supplémentaires. A la place, vous devez mapper les chemins
supplémentaires en utilisant l'autoloader de votre application. Regardez la
section sur :ref:`additional-class-paths` pour plus d'informations.

Trois nouvelles variables de configuration fournissent la configuration
de chemin pour les plugins, les views et les fichiers de locales. Vous pouvez
ajouter plusieurs chemins à ``App.paths.templates``, ``App.paths.plugins`` et
``App.paths.locales`` pour configurer des chemins multiples pour respectivement
les templates, les plugins et les fichiers de locales.

La clé de configuration ``www_root`` a été renommée ``wwwRoot`` par cohérence.
Merci d'ajuster votre fichier de configuration **app.php** ainsi que chaque
utilisation de``Configure::read('App.wwwRoot')``.

Nouvel ORM
==========

CakePHP 3.0 dispose d'un nouvel ORM qui a été reconstruit de zéro. Le nouvel ORM
est significativement différent et incompatible avec la version précédente.
Mettre à jour vers le nouvel ORM nécessite des changements importants dans toute
application qui souhaite être mise à jour. Regardez la nouvelle documentation
:doc:`/orm` pour des informations sur la façon d'utiliser le nouvel ORM.

Notions de base
===============

* ``LogError()`` a été retirée, elle ne fournissait aucun bénéfice
  et n'était rarement/jamais utilisée.
* Les fonctions globales suivantes ont été retirées: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Debugging
=========

* ``Configure::write('debug', $bool)`` n'accepte plus 0/1/2. Un simple
  booléen est utilisé à la place pour changer entre le mode debug on et off.

Paramétrage/Configuration des Objets
====================================

* Les Objets utilisés dans CakePHP ont maintenant un système
  d'instance-configuration de stockage/récupération cohérent. Le code qui était
  auparavant accessible par exemple comme ceci: ``$object->settings`` devra être
  mis à jour en utilisant à la place ``$object->config()``.

Cache
=====

* Le moteur ``Memcache`` a été retiré, utilisez
  :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` à la place.
* Les moteurs de Cache sont maintenant chargés automatiquement à la première
  utilisation.
* :php:meth:`Cake\\Cache\\Cache::engine()` a été ajoutée.
* :php:meth:`Cake\\Cache\\Cache::enabled()` a été ajoutée. celle-ci remplace
  l'option de configuration ``Cache.disable``.
* :php:meth:`Cake\\Cache\\Cache::enable()` a été ajoutée.
* :php:meth:`Cake\\Cache\\Cache::disable()` a été ajoutée.
* Les configurations de Cache sont maintenant immutables. Si vous avez besoin de
  changer la configuration, vous devez d'abord retirer la configuration et la
  recréer. Cela évite les problèmes de synchronisation avec les options de
  configuration.
* ``Cache::set()`` a été retirée. Il est recommandé que vous créiez des
  configurations de cache multiples pour remplacer les réglages de configuration
  d'exécution, ce qui était auparavant possible avec ``Cache::set()``.
* Toutes les sous-classes ``CacheEngine`` intègrent maintenant une méthode
  ``config()``.
* :php:meth:`Cake\\Cache\\Cache::readMany()`,
  :php:meth:`Cake\\Cache\\Cache::deleteMany()`, et
  :php:meth:`Cake\\Cache\\Cache::writeMany()` ont été ajoutées.

Toutes les méthodes de :php:class:`Cake\\Cache\\Cache\\CacheEngine` sont
maintenant responsables de la gestion du préfix de clé configuré.
:php:meth:`Cake\\Cache\\CacheEngine::write()` ne permet plus de définir la
durée d'écriture - la durée est prise par la configuration d'exécution du
moteur de cache. Appeler une méthode de cache avec une clé vide va maintenant
lancer :php:class:`InvalidArgumentException`, au lieu de retourner ``false``.


Core
====

App
---

- ``App::pluginPath()`` a été retirée. Utilisez ``CakePlugin::path()`` à la place.
- ``App::build()`` a été retirée.
- ``App::location()`` a été retirée.
- ``App::paths()`` a été retirée.
- ``App::load()`` a été retirée.
- ``App::objects()`` a été retirée.
- ``App::RESET`` a été retirée.
- ``App::APPEND`` a été retirée.
- ``App::PREPEND`` a été retirée.
- ``App::REGISTER`` a été retirée.

Plugin
------

- :php:meth:`Cake\\Core\\Plugin::load()` ne configure pas d'autoloader à moins
  que vous définissiez l'option ``autoload`` à ``true``.
- Lors du chargement des plugins, vous ne pouvez plus fournir de callable.
- Lors du chargement des plugins, vous ne pouvez plus fournir un tableau de
  fichiers de configuration à charger.

Configure
---------

- ``Cake\Configure\PhpReader`` renommé en
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig`
- ``Cake\Configure\IniReader`` renommé en
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig`
- ``Cake\Configure\ConfigReaderInterface`` renommé en
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface`
- :php:meth:`Cake\\Core\\Configure::consume()` a été ajoutée.
- :php:meth:`Cake\\Core\\Configure::load()` attend maintenant un suffixe du nom
  du fichier sans extension puisque celui-ci peut venir d'un moteur. Par
  exemple, l'utilisation de PhpConfig utilise ``app`` pour charger **app.php**.
- Définir une variable ``$config`` dans un fichier PHP de config est déprécié.
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` attend maintenant le
  fichier de config pour retourner un tableau.
- Un nouveau moteur de config
  :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig` a été ajouté.

Object
------

La classe ``Object`` a été retirée. Elle contenait au début un tas de méthodes
qui étaient utilisées dans plusieurs endroits à travers le framework. Les
méthodes les plus utiles qui étaient utilisées ont été extraites dans des
traits. Vous pouvez utiliser :php:trait:`Cake\\Log\\LogTrait` pour accéder à la
méthode ``log()``. :php:trait:`Cake\\Routing\\RequestActionTrait` fournit
``requestAction()``.

Console
=======

L'exécutable ``cake`` a été déplacé du répertoire ``app/Console`` vers le
répertoire ``bin`` dans le squelette de l'application. Vous pouvez maintenant
lancer la console de CakePHP avec ``bin/cake``.

TaskCollection Remplacée
------------------------

Cette classe a été renommée en :php:class:`Cake\\Console\\TaskRegistry`.
Regardez la section sur :doc:`/core-libraries/registry-objects` pour plus
d'informations sur les fonctionnalités fournies par la nouvelle classe. Vous
pouvez utiliser ``cake upgrade rename_collections`` pour vous aider à mettre
à niveau votre code. Les Tasks n'ont plus accès aux callbacks, puisqu'il
n'y avait jamais de callbacks à utiliser.

Shell
-----

- ``Shell::__construct()`` a changé. Il prend maintenant une instance de
  :php:class:`Cake\\Console\\ConsoleIo`.
- ``Shell::param()`` a été ajoutée pour un accès pratique aux paramètre.

De plus, toutes les méthodes du shell vont être transformées en camel case lors
de leur appel. Par exemple, si vous avez une méthode ``hello_world()`` dans un
shell et que vous l'appelez avec ``bin/cake my_shell hello_world``, vous devez
renommer la méthode en ``helloWorld``. Il n'y a pas de changements nécessaires
dans la façon d'appeler les commandes.

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::merge()`` a été ajoutée pour fusionner les parsers.

ConsoleInputArgument
--------------------

- ``ConsoleInputArgument::isEqualTo()`` a été ajoutée pour comparer deux
  arguments.

Shell / Task
============

Shells et Tasks ont été déplacés de ``Console/Command`` et
``Console/Command/Task`` vers ``Shell`` et ``Shell/Task``.

ApiShell Retiré
---------------

ApiShell a été retiré puisqu'il ne fournit aucun bénéfice sur le fichier
source lui-même et sur la documentation/`l'API <https://api.cakephp.org/>`_
en-ligne.

SchemaShell Removed
-------------------

SchemaShell a été retiré puisqu'il n'a jamais été une implémentation
de migrations de base de données complète et de meilleurs outils comme
`Phinx <https://phinx.org/>`_ ont émergé. Il a été remplacé par
le `Plugin de Migrations pour CakePHP <https://github.com/cakephp/migrations>`_
qui permet l'utilisation de `Phinx <https://phinx.org/>`_ avec CakePHP.

ExtractTask
-----------

- ``bin/cake i18n extract`` n'inclut plus les messages de validation non
  traduits. Si vous voulez traduire les messages de validation, vous devez
  entourer ces messages dans des appels `__()` comme tout autre contenu.

BakeShell / TemplateTask
------------------------

- Bake ne fait plus partie du code source du core et est remplacé par le
  `Plugin CakePHP Bake <https://github.com/cakephp/bake>`_
- Les templates de bake ont été déplacés vers **src/Template/Bake**.
- La syntaxe des templates Bake utilise maintenant des balises de type erb
  (``<% %>``) pour désigner le templating.
- La commande ``bake view`` a été renommée ``bake template``.

Event
=====

La méthode ``getEventManager()`` a été retirée pour tous les objets qui
l'avaient. Une méthode ``eventManager()`` est maintenant fournie par
``EventManagerTrait``. ``EventManagerTrait`` contient la logique pour instancier
et garder une référence d'un gestionnaire d'évènement local.

Le sous-système d'Event s'est vu retiré un certain nombre de fonctionnalités
Lors du dispatching des événements, vous ne pouvez plus utiliser les options
suivantes:

* ``passParams`` Cette option est maintenant toujours activée implicitement.
  Vous ne pouvez pas l'arrêter.
* ``break`` Cette option a été retirée. Vous devez maintenant arrêter les
  events.
* ``breakOn`` Cette option a été retirée. Vous devez maintenant arrêter les
  events.

Log
===

* Les configurations des logs sont maintenant immutables. Si vous devez changer
  la configuration, vous devez d'abord supprimer la configuration et la récréer.
  Cela évite les problèmes de synchronisation avec les options de configuration.
* Les moteurs de Log se chargent maintenant automatiquement à la première
  écriture dans les logs.
* :php:meth:`Cake\\Log\\Log::engine()` a été ajoutée.
* Les méthodes suivantes ont été retirées de :php:class:`Cake\\Log\\Log`::
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()``.
* Vous ne pouvez plus créer de niveaux personnalisés en utilisant
  ``Log::levels()``.
* Lors de la configuration des loggers, vous devez utiliser ``'levels'`` au
  lieu de ``'types'``.
* Vous ne pouvez plus spécifier de niveaux de log personnalisé. Vous devez
  utiliser les niveaux de log définis par défaut. Pour créer des fichiers de
  log personnalisés ou spécifiques à la gestion de différentes sections de
  votre application, vous devez utiliser les logging scopes. L'utilisation
  d'un niveau de log non-standard lancera maintenant une exception.
* :php:trait:`Cake\\Log\\LogTrait` a été ajoutée. Vous pouvez utiliser ce trait
  dans vos classes pour ajouter la méthode ``log()``.
* Le logging scope passé à :php:meth:`Cake\\Log\\Log::write()` est maintenant
  transmis à la méthode ``write()`` du moteur de log afin de fournir un meilleur
  contexte aux moteurs.
* Les moteurs de Log sont maintenant nécessaires pour intégrer
  ``Psr\Log\LogInterface`` plutôt que la propre ``LogInterface`` de CakePHP. En
  général, si vous étendez :php:class:`Cake\\Log\\Engine\\BaseEngine`
  vous devez juste renommer la méthode ``write()`` en ``log()``.
* :php:meth:`Cake\\Log\\Engine\\FileLog` écrit maintenant les fichiers dans
  ``ROOT/logs`` au lieu de ``ROOT/tmp/logs``.


Routing
=======

Paramètres Nommés
-----------------

Les paramètres nommés ont été retirés dans 3.0. Les paramètres nommés ont été
ajoutés dans 1.2.0 comme un 'belle' version des paramètres query strings. Alors
que le bénéfice visuel est discutable, les problèmes engendrés par les
paramètres nommés ne le sont pas.

Les paramètres nommés nécessitaient une gestion spéciale dans CakePHP ainsi
que toute librairie PHP ou JavaScript qui avaient besoin d'interagir avec eux,
puisque les paramètres nommés ne sont implémentés ou compris par aucune
librairie *exceptée* CakePHP. La complexité supplémentaire et le code nécessaire
pour supporter les paramètres nommés ne justifiaient pas leur existence, et
elles ont été retirées. A la place, vous devrez utiliser les paramètres
standards de query string, ou les arguments passés. Par défaut ``Router``
traitera tous les paramètres supplémentaires de ``Router::url()`` comme des
arguments de query string.

Puisque beaucoup d'applications auront toujours besoin de parser des URLs
entrantes contenant des paramètres nommés,
:php:meth:`Cake\\Routing\\Router::parseNamedParams()` a été ajoutée
pour permettre une rétrocompatibilité avec les URLs existantes.


RequestActionTrait
------------------

- :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` a connu
  quelques changements sur des options supplémentaires:

  - ``options[url]`` est maintenant ``options[query]``.
  - ``options[data]`` est maintenant ``options[post]``.
  - Les paramètres nommés ne sont plus supportés.

Router
------

* Les paramètres nommés ont été retirés, regardez ci-dessus pour plus
  d'informations.
* L'option ``full_base`` a été remplacée par l'options ``_full``.
* L'option ``ext`` a été remplacée par l'option ``_ext``.
* Les options ``_scheme``, ``_port``, ``_host``, ``_base``, ``_full`` et
  ``_ext`` ont été ajoutées.
* Les chaînes URLs ne sont plus modifiées en ajoutant les noms de
  plugin/controller/prefix.
* La gestion de route fallback par défaut a été retirée. Si aucune route ne
  correspond à un paramètre défini, ``/`` sera retourné.
* Les classes de route sont responsables pour *toutes* les générations d'URL
  incluant les paramètres de query string. Cela rend les routes bien plus
  puissantes et flexibles.
* Les paramètres persistants ont été retirés. Ils ont été remplacés par
  :php:meth:`Cake\\Routing\\Router::urlFilter()` qui est une meilleur façon
  plus flexible pour changer les URLs étant routées inversement.
* La signature de :php:meth:`Cake\\Routing\\Router::parseExtensions()` a changé
  en ``parseExtensions(string|array $extensions = null, $merge = true)``. Elle
  ne prend plus d'arguments variables pour la spécification des extensions.
  Aussi, vous ne pouvez plus l'appeler sans paramètre pour parser toutes les
  extensions (en faisant cela, cela va retourner des extensions existantes qui
  sont définies). Vous avez besoin de faire une liste blanche des extensions
  que votre application accepte.
* ``Router::parseExtensions()`` **doit** être appelée avant que les routes ne
  soient connectées. Il ne modifie plus les routes existantes lors de son appel.
* ``Router::setExtensions()`` a été retirée. Utilisez
  :php:meth:`Cake\\Routing\\Router::parseExtensions()` à la place.
* ``Router::resourceMap()`` a été retirée.
* L'option ``[method]`` a été renommée en ``_method``.
* La capacité pour faire correspondre les en-têtes arbitraires avec les
  paramètres de style ``[]`` a été retirée. Si vous avez besoin de parser/faire
  correspondre sur les conditions arbitraires, pensez à utiliser les classes de
  route personnalisées.
* ``Router::promote()`` a été retirée.
* ``Router::parse()`` va maintenant lancer une exception quand une URL ne peut
  pas être gérée par aucune route.
* ``Router::url()`` va maintenant lancer une exception quand aucune route ne
  matche un ensemble de paramètres.
* Les scopes de Routing ont été introduits. Les scopes de Routing vous
  permettent de garder votre fichier de routes DRY et donne au Router des
  indices sur la façon d'optimiser le parsing et le routing inversé des URLs.

Route
-----

* ``CakeRoute`` a été renommée en ``Route``.
* La signature de ``match()`` a changé en ``match($url, $context = [])``
  Consultez :php:meth:`Cake\\Routing\\Route::match()` pour plus d'informations
  sur la nouvelle signature.

La Configuration des Filtres de Dispatcher a Changé
---------------------------------------------------

Les filtres de Dispatcher ne sont plus ajoutés à votre application en utilisant
``Configure``. Vous les ajoutez maintenant avec
:php:class:`Cake\\Routing\\DispatcherFactory`. Cela signifie que si votre
application utilisait ``Dispatcher.filters``, vous devrez maintenant utiliser
:php:meth:`Cake\\Routing\\DispatcherFactory::add()`.

En plus des changements de configuration, les filtres du dispatcher ont vu
leurs conventions mises à jour, et des fonctionnalités ont été ajoutées.
Consultez la documentation :doc:`/development/dispatch-filters` pour plus
d'informations.

Filter\AssetFilter
------------------

* Les assets des Plugin & theme gérés par AssetFilter ne sont plus lus via
  ``include``, à la place ils sont traités comme de simples fichiers texte. Cela
  règle un certain nombre de problèmes avec les librairies JavaScript comme
  TinyMCE et les environnements avec short_tags activé.
* Le support pour la configuration de ``Asset.filter`` et les hooks ont été
  retirés. Cette fonctionnalité peut être remplacée par un plugin ou un filtre
  dispatcher.

Network
=======

Request
-------

* ``CakeRequest`` a été renommé en :php:class:`Cake\\Network\\Request`.
* :php:meth:`Cake\\Network\\Request::port()` a été ajoutée.
* :php:meth:`Cake\\Network\\Request::scheme()` a été ajoutée.
* :php:meth:`Cake\\Network\\Request::cookie()` a été ajoutée.
* :php:attr:`Cake\\Network\\Request::$trustProxy` a été ajoutée. Cela rend
  la chose plus facile pour mettre les applications CakePHP derrière les
  load balancers.
* :php:attr:`Cake\\Network\\Request::$data` n'est plus fusionnée avec la clé
  de données préfixés, puisque ce préfixe a été retiré.
* :php:meth:`Cake\\Network\\Request::env()` a été ajoutée.
* :php:meth:`Cake\\Network\\Request::acceptLanguage()` a été changée d'une
  méthode static en non static.
* Le détecteur de Request pour "mobile" a été retiré du cœur. A la place
  le template de app ajoute des détecteurs pour "mobile" et "tablet" en
  utilisant la lib ``MobileDetect``.
* La méthode ``onlyAllow()`` a été renommée en ``allowMethod()`` et n'accepte
  plus "var args". Tous les noms de méthode doivent être passés en premier
  argument, soit en chaîne de caractère, soit en tableau de chaînes.

Response
--------

* Le mapping du mimetype ``text/plain`` en extension ``csv`` a été retiré.
  En conséquence, :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  ne définit pas l'extension en ``csv`` si l'en-tête ``Accept`` contient le
  mimetype ``text/plain`` ce qui était une nuisance habituelle lors de la
  réception d'une requête jQuery XHR.

Sessions
========

La classe session n'est plus statique, à la place, la session est accessible
à travers l'objet request. Consultez la documentation
:doc:`/development/sessions` sur l'utilisation de l'objet session.

* :php:class:`Cake\\Network\\Session` et les classes de session liées ont été
  déplacées dans le namespace ``Cake\Network``.
* ``SessionHandlerInterface`` a été retirée en faveur de celui fourni par PHP.
* La propriété ``Session::$requestCountdown`` a été retirée.
* La fonctionnalité de session checkAgent a été retirée. Elle entrainait un
  certain nombre de bugs quand le chrome frame, et flash player sont impliqués.
* Le nom de la table de la base de données des sessions est maintenant
  ``sessions`` plutôt que ``cake_sessions``.
* Le timeout du cookie de session est automatiquement mis à jour en tandem avec
  le timeout dans les données de session.
* Le chemin pour le cookie de session est maintenant par défaut le chemin de
  l'application plutôt que "/".
  De plus, une nouvelle variable de configuration ``Session.cookiePath`` a été
  ajoutée pour personnaliser le chemin du cookie.
* Une nouvelle méthode :php:meth:`Cake\\Network\\Session::consume()` a été ajoutée
  pour permettre de lire et supprimer les données de session en une seule étape.

Network\\Http
=============

* ``HttpSocket`` est maintenant :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client a été réécrit de zéro. Il a une API plus simple/facile à utiliser,
  le support pour les nouveaux systèmes d'authentification comme OAuth, et les
  uploads de fichier.
  Il utilise les APIs de PHP en flux donc il n'est pas nécessaire d'avoir cURL.
  Regardez la documentation :doc:`/core-libraries/httpclient` pour plus
  d'informations.

Network\\Email
==============

* :php:meth:`Cake\\Network\\Email\\Email::config()` est utilisée maintenant pour
  définir les profiles de configuration. Ceci remplace les classes
  ``EmailConfig`` des précédentes versions.
  versions.
* :php:meth:`Cake\\Network\\Email\\Email::profile()` remplace ``config()`` comme
  façon de modifier les options de configuration par instance.
* :php:meth:`Cake\\Network\\Email\\Email::drop()` a été ajoutée pour permettre
  le retrait de la configuration d'email.
* :php:meth:`Cake\\Network\\Email\\Email::configTransport()` a été ajoutée pour
  permettre la définition de configurations de transport. Ce changement retire
  les options de transport des profiles de livraison et vous permet de
  réutiliser les transports à travers les profiles d'email.
* :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` a été ajoutée pour
  permettre le retrait de la configuration du transport.


Controller
==========

Controller
----------

- Les propriétés ``$helpers``, ``$components`` sont maintenant
  fusionnées avec **toutes** les classes parentes, pas seulement
  ``AppController`` et le app controller du plugin. Les propriétés sont
  fusionnées de manière différente par rapport à aujourd'hui. Plutôt que
  d'avoir comme actuellement les configurations de toutes les classes
  fusionnées, la configuration définie dans la classe enfante sera utilisée.
  Cela signifie que si vous avez une configuration définie dans votre
  AppController, et quelques configurations définies dans une sous-classe,
  seule la configuration de la sous-classe sera utilisée.
- ``Controller::httpCodes()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::httpCodes()` à la place.
- ``Controller::disableCache()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::disableCache()` à la place.
- ``Controller::flash()`` a été retirée. Cette méthode était rarement utilisée
  dans les vraies applications et ne n'avait plus aucun intérêt.
- ``Controller::validate()`` et ``Controller::validationErrors()`` ont été
  retirées. Il y avait d'autres méthodes laissées depuis l'époque de 1.x,
  où les préoccupations des models + controllers étaient bien plus étroitement
  liées.
- ``Controller::loadModel()`` charge maintenant les objets table.
- La propriété ``Controller::$scaffold`` a été retirée. Le scaffolding dynamique
  a été retiré du cœur de CakePHP. Un plugin de scaffolding appelé CRUD se
  trouve ici: https://github.com/FriendsOfCake/crud
- La propriété ``Controller::$ext`` a été retirée. Vous devez maintenant étendre
  et surcharger la propriété ``View::$_ext`` si vous voulez utiliser une
  extension de fichier de view autre que celle par défaut.
- La propriété ``Controller::$Components`` a été retirée et remplacée par
  ``_components``. Si vous avez besoin de charger les components à la volée,
  vous devez utiliser ``$this->loadComponent()`` dans votre controller.
- La signature de :php:meth:`Cake\\Controller\\Controller::redirect()` a été
  changée en ``Controller::redirect(string|array $url, int $status = null)``.
  Le 3ème argument ``$exit`` a été retiré. La méthode ne peut plus envoyer
  la réponse et sortir du script, à la place elle retourne une instance de
  ``Response`` avec les en-têtes appropriés définis.
- Les propriétés magiques ``base``, ``webroot``, ``here``, ``data``,
  ``action`` et ``params`` ont été retirées. Vous pouvez accéder à toutes ces
  propriétés dans ``$this->request`` à la place.
- Les méthodes préfixées avec underscore des controllers comme ``_someMethod()``
  ne sont plus considérées comme des méthodes privées. Utilisez les bons mots
  clés de visibilité à la place. Seules les méthodes publiques peuvent être
  utilisées comme action de controller.

Scaffold retiré
---------------

Le scaffolding dynamique dans CakePHP a été retiré du cœur de CakePHP. Il
était peu fréquemment utilisé, et n'avait jamais pour intention d'être
utilisé en mode production. Un plugin de scaffolding appelé CRUD se trouve ici:
https://github.com/FriendsOfCake/crud

ComponentCollection remplacée
-----------------------------

Cette classe a été remplacée en :php:class:`Cake\\Controller\\ComponentRegistry`.
Regardez la section sur :doc:`/core-libraries/registry-objects` pour plus
d'informations sur les fonctionnalités fournies par cette nouvelle classe. Vous
pouvez utiliser ``cake upgrade rename_collections`` pour vous aider à mettre
à niveau votre code.

Component
---------

* La propriété ``_Collection`` est maintenant ``_registry``. Elle contient
  maintenant une instance de :php:class:`Cake\\Controller\\ComponentRegistry`.
* Tous les components doivent maintenant utiliser la méthode ``config()`` pour
  récupérer/définir la configuration.
* La configuration par défaut pour les components doit être définie dans la
  propriété ``$_defaultConfig``. Cette propriété est automatiquement fusionnée
  avec toute configuration fournie au constructeur.
* Les options de configuration ne sont plus définies en propriété public.
* La méthode ``Component::initialize()`` n'est plus un listener d'event.
  A la place, c'est un hook post-constructeur comme ``Table::initialize()`` et
  ``Controller::initialize()``. La nouvelle méthode
  ``Component::beforeFilter()`` est liée au même évènement que
  ``Component::initialize()``. La méthode initialize devrait avoir la signature
  suivante ``initialize(array $config)``.

Controller\\Components
======================

CookieComponent
---------------

- Utilise :php:meth:`Cake\\Network\\Request::cookie()` pour lire les données de
  cookie, ceci facilite les tests, et permet de définir les cookies pour
  ControllerTestCase.
- Les Cookies chiffrés dans les versions précédentes de CakePHP utilisant la
  méthode ``cipher()`` sont maintenant illisible parce que ``Security::cipher()``
  a été retirée. Vous aurez besoin de re-chiffrer les cookies avec la méthode
  ``rijndael()`` ou ``aes()`` avant mise à jour.
- ``CookieComponent::type()`` a été retirée et remplacée par la donnée de
  configuration accessible avec ``config()``.
- ``write()`` ne prend plus de paramètres ``encryption`` ou ``expires``. Ces
  deux-là sont maintenant gérés avec des données de config. Consultez
  :doc:`/controllers/components/cookie` pour plus d'informations.
- Le chemin pour les cookies sont maintenant par défaut le chemin de l'app
  plutôt que "/".

AuthComponent
-------------

- ``Default`` est maintenant le hasher de mot de passe par défaut utilisé par
  les classes d'authentification.
  Si vous voulez continuer à utiliser le hashage SHA1 utilisé dans 2.x utilisez
  ``'passwordHasher' => 'Weak'`` dans votre configuration d'authenticator.
- Un nouveau ``FallbackPasswordHasher`` a été ajouté pour aider les utilisateurs
  à migrer des vieux mots de passe d'un algorithm à un autre. Consultez la
  documentation d'AuthComponent pour plus d'informations.
- La classe ``BlowfishAuthenticate`` a été retirée. Utilisez juste
  ``FormAuthenticate``.
- La classe ``BlowfishPasswordHasher`` a été retirée. Utilisez
  ``DefaultPasswordHasher`` à la place.
- La méthode ``loggedIn()`` a été retirée. Utilisez ``user()`` à la place.
- Les options de configuration ne sont plus définies en propriété public.
- Les méthodes ``allow()`` et ``deny()`` n'acceptent plus "var args". Tous les
  noms de méthode ont besoin d'être passés en premier argument, soit en chaîne,
  soit en tableau de chaînes.
- La méthode ``login()`` a été retirée et remplacée par ``setUser()``.
  Pour connecter un utilisateur, vous devez maintenant appeler ``identify()``
  qui retourne les informations d'utilisateur en cas de succès d'identification
  et utilise ensuite ``setUser()`` pour sauvegarder les informations de session
  pour la persistance au cours des différentes requêtes.

- ``BaseAuthenticate::_password()`` a été retirée. Utilisez ``PasswordHasher``
  à la place.
- ``BaseAuthenticate::logout()`` a été retirée.
- ``AuthComponent`` lance maintenant deux événements``Auth.afterIdentify`` et
  ``Auth.logout`` respectivement après qu'un utilisateur a été identifié et
  avant qu'un utilisateur ne soit déconnecté. Vous pouvez définir une fonction
  de callback pour ces événements en retournant un tableau de mapping depuis la
  méthode ``implementedEvents()`` de votre classe d'authentification.

Les classes liées à ACL ont été déplacées dans un plugin séparé. Les hashers
de mot de passe, l'Authentification et les fournisseurs d'Authorisation ont
été déplacés vers le namespace ``\Cake\Auth``. Vous devez aussi déplacer vos
providers et les hashers dans le namespace ``App\Auth``.

RequestHandlerComponent
-----------------------

- Les méthodes suivantes ont été retirées du component RequestHandler::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``,
  ``isGet()``, ``isDelete()``. Utilisez la méthode
  :php:meth:`Cake\\Network\\Request::is()` à la place avec l'argument pertinent.
- ``RequestHandler::setContent()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::type()` à la place.
- ``RequestHandler::getReferer()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Request::referer()` à la place.
- ``RequestHandler::getClientIP()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Request::clientIp()` à la place.
- ``RequestHandler::mapType()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::mapType()` à la place.
- Les options de configuration ne sont plus définies en propriété public.

SecurityComponent
-----------------

- Les méthodes suivantes et leurs propriétés liées ont été retirées du
  component Security:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Utilisez :php:meth:`Cake\\Network\\Request::onlyAllow()` à la place.
- ``SecurityComponent::$disabledFields()`` a été retirée, utilisez
  ``SecurityComponent::$unlockedFields()``.
- Les fonctionnalités liées au CSRF dans SecurityComponent ont été extraites et
  déplacées dans un CsrfComponent séparé. Ceci vous permet d'utiliser une
  protection CSRF sans avoir à utiliser la prévention de falsification de
  formulaire.
- Les options de Configuration ne sont plus définies comme des propriétés
  publiques.
- Les méthodes ``requireAuth()`` et ``requireSecure()`` n'acceptent plus
  "var args". Tous les noms de méthode ont besoin d'être passés en premier
  argument, soit en chaîne, soit en tableau de chaînes.

SessionComponent
----------------

- ``SessionComponent::setFlash()`` est déprécié. Vous devez utiliser
  :doc:`/controllers/components/flash` à la place.

Error
-----

Les ExceptionRenderers personnalisées doivent maintenant soit retourner un objet
``Cake\\Network\\Response``, soit une chaîne de caractère lors du rendu des
erreurs. Cela signifie que toutes les méthodes gérant des exceptions spécifiques
doivent retourner une réponse ou une valeur.

Model
=====

La couche Model de 2.x a été entièrement réécrite et remplacée. Vous devriez
regarder le :doc:`Guide de Migration du Nouvel ORM </appendices/orm-migration>`
pour plus d'informations sur la façon d'utiliser le nouvel ORM.

- La classe ``Model`` a été retirée.
- La classe ``BehaviorCollection`` a été retirée.
- La classe ``DboSource`` a été retirée.
- La classe ``Datasource`` a été retirée.
- Les différentes sources de données des classes ont été retirées.

ConnectionManager
-----------------

- ConnectionManager a été déplacée dans le namespace ``Cake\\Datasource``.
- ConnectionManager a eu les méthodes suivantes retirées:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- :php:meth:`~Cake\\Database\\ConnectionManager::config()` a été ajoutée et est
  maintenant la seule façon de configurer les connections.
- :php:meth:`~Cake\\Database\\ConnectionManager::get()` a été ajoutée. Elle
  remplace ``getDataSource()``.
- :php:meth:`~Cake\\Database\\ConnectionManager::configured()` a été ajoutée.
  Celle-ci avec ``config()`` remplace ``sourceList()`` &
  ``enumConnectionObjects()`` avec une API plus standard et cohérente.
- ``ConnectionManager::create()`` a été retirée.
  Il peut être remplacé par ``config($name, $config)`` et ``get($name)``.

Behaviors
---------
- Les méthodes préfixées avec underscore des behaviors comme ``_someMethod()``
  ne sont plus considérées comme des méthodes privées. Utilisez les bons mots
  clés à la place.

TreeBehavior
------------

TreeBehavior a été complètement réécrit pour utiliser le nouvel ORM. Bien qu'il
fonctionne de la même manière que dans 2.x, certaines méthodes ont été renommées
ou retirées:

- ``TreeBehavior::children()`` est maintenant un finder personnalisé ``find('children')``.
- ``TreeBehavior::generateTreeList()`` est maintenant un finder personnalisé ``find('treeList')``.
- ``TreeBehavior::getParentNode()`` a été retirée.
- ``TreeBehavior::getPath()`` est maintenant un finder personnalisé ``find('path')``.
- ``TreeBehavior::reorder()`` a été retirée.
- ``TreeBehavior::verify()`` a été retirée.

TestSuite
=========

TestCase
--------

- ``_normalizePath()`` a été ajoutée pour permettre aux tests de comparaison
  de chemin de se lancer pour tous les systèmes d'exploitation selon la
  configuration de leur DS (``\`` dans Windows vs ``/`` dans UNIX, par exemple).

Les méthodes d'assertion suivantes ont été retirées puisque cela faisait
longtemps qu'elles étaient dépréciées et remplacées par leurs nouvelles
homologues de PHPUnit:

- ``assertEqual()`` en faveur de ``assertEquals()``
- ``assertNotEqual()`` en faveur de ``assertNotEquals()``
- ``assertIdentical()`` en faveur de ``assertSame()``
- ``assertNotIdentical()`` en faveur de ``assertNotSame()``
- ``assertPattern()`` en faveur de ``assertRegExp()``
- ``assertNoPattern()`` en faveur de ``assertNotRegExp()``
- ``assertReference()`` if favor of ``assertSame()``
- ``assertIsA()`` en faveur de ``assertInstanceOf()``

Notez que l'ordre des paramètres de certaines méthodes a été changé, par ex:
``assertEqual($is, $expected)`` devra maintenant être
``assertEquals($expected, $is)``.

Les méthodes d'assertion suivantes ont été dépréciées et seront retirées dans
le futur:

- ``assertWithinMargin()`` en faveur de ``assertWithinRange()``
- ``assertTags()`` en faveur de ``assertHtml()``

Les deux méthodes de remplacement changent aussi l'ordre des arguments pour
avoir une méthode d'API assert cohérente avec ``$expected`` en premier argument.

Les méthodes d'assertion suivantes ont été ajoutées:

- ``assertNotWithinRange()`` comme contrepartie de ``assertWithinRange()``

View
====

Les Themes sont maintenant purement des Plugins
-----------------------------------------------

Avoir des themes et des plugins comme façon de créer des composants
d'applications modulaires nous semblait limité et cela apportait de la
confusion. Dans CakePHP 3.0, les themes ne se trouvent plus **dans**
l'application. A la place, ce sont des plugins autonomes. Cela résout certains
problèmes liés aux themes:

- Vous ne pouviez pas mettre les themes *dans* les plugins.
- Les Themes ne pouvaient pas fournir de helpers, ou de classes de vue
  personnalisée.

Ces deux problèmes sont résolus en convertissant les themes en plugins.

Les Dossiers de View Renommés
-----------------------------

Les dossiers contenant les fichiers de vue vont maintenant dans **src/Template**
à la place de **src/View**.
Ceci a été fait pour séparer les fichiers de vue des fichiers contenant des
classes php (par ex les classes Helpers et View).

Les dossiers de View suivants ont été renommés pour éviter les collisions
avec les noms de controller:

- ``Layouts`` est maintenant ``Layout``
- ``Elements`` est maintenant ``Element``
- ``Errors`` est maintenant ``Error``
- ``Emails`` est maintenant ``Email`` (idem pour ``Email`` dans ``Layout``)

HelperCollection remplacée
--------------------------

Cette classe a été renommée en :php:class:`Cake\\View\\HelperRegistry`.
Regardez la section sur :doc:`/core-libraries/registry-objects` pour plus
d'informations sur les fonctionnalités fournies par la nouvelle classe.
Vous pouvez utiliser ``cake upgrade rename_collections`` pour vous aider
à mettre à niveau votre code.

View Class
----------

- La clé ``plugin`` a été retirée de l'argument ``$options`` de
  :php:meth:`Cake\\View\\View::element()`. Spécifiez le nom de l'element
  comme ``SomePlugin.element_name`` à la place.
- ``View::getVar()`` a été retirée, utilisez :php:meth:`Cake\\View\\View::get()`
  à la place.
- ``View::$ext`` a été retirée et à la place une propriété protected
  ``View::$_ext`` a été ajoutée.
- ``View::addScript()`` a été retirée. Utilisez :ref:`view-blocks` à la place.
- Les propriétés magiques ``base``, ``webroot``, ``here``, ``data``,
  ``action`` et ``params`` ont été retirées. Vous pouvez accéder à toutes ces
  propriétés dans ``$this->request`` à la place.
- ``View::start()`` n'ajoute plus à un block existant. A la place, il va
  écraser le contenu du block quand end est appelé. Si vous avez besoin de
  combiner les contenus de block, vous devrez récupérer le contenu du block lors
  de l'appel de start une deuxième fois ou utiliser le mode de capture
  ``append()``.
- ``View::prepend()`` n'a plus de mode de capture.
- ``View::startIfEmpty()`` a été retirée. maintenant que start() écrase toujours
  startIfEmpty n'a plus d'utilité.
- La propriété ``View::$Helpers`` a été retirée et remplacée par
  ``_helpers``. Si vous avez besoin de charger les helpers à la volée, vous
  devrez utiliser ``$this->addHelper()`` dans vos fichiers de view.
- ``View`` lancera des ``Cake\View\Exception\MissingTemplateException`` lorsque
  des templates sont au lieu de ``MissingViewException``.

ViewBlock
---------

- ``ViewBlock::append()`` a été retirée, utilisez
  :php:meth:`Cake\\View\ViewBlock::concat()` à la place. Cependant,
  ``View::append()`` existe encore.

JsonView
--------

- Par défaut les données JSON vont maintenant avoir des entités HTML encodées.
  Ceci empêche les problèmes possible de XSS quand le contenu de la view
  JSON est intégrée dans les fichiers HTML.
- :php:class:`Cake\\View\\JsonView` supporte maintenant la variable de view
  ``_jsonOptions``. Ceci vous permet de configurer le masque utilisé lors de la
  génération de JSON.

XmlView
-------

- :php:class:`Cake\\View\\XmlView` supporte maintenant la variable de view
  ``_xmlOptions``. Ceci vous permet de configurer les options utilisées lors de
  la génération de XML.

View\\Helper
============

- La propriété ``$settings`` est maintenant appelée ``$_config`` et peut être
  accessible via la méthode ``config()``.
- Les options de configuration ne sont plus définies en propriété public.
- ``Helper::clean()`` a été retirée. Il n'était jamais assez
  robuste pour complètement empêcher XSS. A la place, vous devez échapper
  le contenu avec :php:func:`h` ou utiliser une librairie dédiée comme
  HTMLPurifier.
- ``Helper::output()`` a été retirée. Cette méthode a été
  dépréciée dans 2.x.
- Les méthodes ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` ont été déplacées  vers le nouveau
  helper :php:class:`Cake\\View\\Helper\\UrlHelper`. ``Helper::url()`` est
  maintenant disponible dans :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`.
- Les accesseurs magiques pour les propriétés dépréciées ont été retirés. Les
  propriétés suivantes ont maintenant besoin d'être accédées à partir de l'objet
  request:

  - base
  - here
  - webroot
  - data
  - action
  - params


Helper
------

Les méthodes suivantes de Helper ont été retirées:

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

Ces méthodes étaient des parties uniquement utilisées par FormHelper, et
faisaient partie des continuelles fonctionnalités des champs qui devenaient
problématiques au fil du temps. FormHelper ne s'appuie plus sur ces méthodes
et leur complexité n'est plus nécessaire.

Les méthodes suivantes ont été retirées:

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

Ces méthodes se trouvent dans la classe ``StringTemplate`` que les helpers
utilisent fréquemment. Regardez ``StringTemplateTrait`` pour intégrer les
templates de chaîne dans vos propres helpers.

FormHelper
----------

FormHelper a été entièrement réécrite pour 3.0. Il amène quelques grands
changements:

* FormHelper fonctionne avec le nouvel ORM. Mais il a un système extensible pour
  être intégré avec d'autres ORMs ou sources de données.
* FormHelper dispose d'une fonctionnalité de système de widget extensible qui
  vous permet de créer de nouveaux widgets d'input personnalisés et d'améliorer
  ceux intégrés.
* Les templates de chaîne sont un élément fondateur du helper. Au lieu de
  tableaux imbriqués ensemble partout, la plupart du HTML que FormHelper génère
  peut être personnalisé dans un endroit central en utilisant les ensembles de
  template.

En plus de ces grands changements, quelques plus petits changements finaux
ont été aussi faits. Ces changements devraient aider le streamline HTML que le
FormHelper génère et réduire les problèmes que les gens ont eu dans le passé:

- Le prefix ``data[`` a été retiré de tous les inputs générés. Le prefix n'a
  plus de réelle utilité.
- Les diverses méthodes d'input autonomes comme ``text()``, ``select()`` et
  autres ne génèrent plus d'attributs id.
- L'option ``inputDefaults`` a été retirée de ``create()``.
- Les options ``default`` et ``onsubmit`` de ``create()`` ont été retirées. A la
  place, vous devez utiliser le binding d'event Javascript ou définir tout le
  code js nécessaire pour ``onsubmit``.
- ``end()`` ne peut plus faire des boutons. Vous devez créer des buttons avec
  ``button()`` ou ``submit()``.
- ``FormHelper::tagIsInvalid()`` a été retirée. Utilisez ``isFieldError()`` à la
  place.
- ``FormHelper::inputDefaults()`` a été retirée. Vous pouvez utiliser
  ``templates()`` pour définir/améliorer les templates que FormHelper utilise.
- Les options ``wrap`` et ``class`` ont été retirées de la méthode ``error()``.
- L'option ``showParents`` a été retirée de select().
- Les options ``div``, ``before``, ``after``, ``between`` et ``errorMessage``
  ont été retirées de ``input()``. Vous pouvez utiliser les templates pour
  mettre à jour le HTML qui l'entoure. L'option ``templates`` vous permet de
  surcharger les templates chargés pour un input.
- Les options ``separator``, ``between``, et ``legend`` ont été retirées de
  ``radio()``. Vous pouvez maintenant utiliser les templates pour changer le
  HTML qui l'entoure.
- Le paramètre ``format24Hours`` a été retiré de ``hour()``.
  Il a été remplacé par l'option ``format``.
- Les paramètres ``minYear`` et ``maxYear`` ont été retirés de ``year()``.
  Ces deux paramètres peuvent maintenant être fournis en options.
- Les paramètres ``dateFormat`` et ``timeFormat`` ont été retirés de
  ``datetime()``. Vous pouvez maintenant utiliser les templates pour définir
  l'ordre dans lequel les inputs doivent être affichés.
- ``submit()`` a eu les options ``div``, ``before`` et ``after`` retirées. Vous
  pouvez personnaliser le template ``submitContainer`` pour modifier ce contenu.
- La méthode ``inputs()`` n'accepte plus ``legend`` et ``fieldset`` dans le
  paramètre ``$fields``, vous devez utiliser le paramètre ``$options``.
  Elle nécessite aussi que le paramètre ``$fields`` soit un tableau. Le
  paramètre ``$blacklist`` a été retiré, la fonctionnalité a été remplacée en
  spécifiant ``'field' => false`` dans le paramètre ``$fields``.
- Le paramètre ``inline`` a été retiré de la méthode postLink().
  Vous devez utiliser l'option ``block`` à la place. Définir ``block => true``
  va émuler le comportement précédent.
- Le paramètre ``timeFormat`` pour ``hour()``, ``time()`` et ``dateTime()`` est
  par maintenant par défaut à 24, en accord avec l'ISO 8601.
- L'argument ``$confirmMessage`` de
  :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()` a été retiré. Vous
  devez maintenant utiliser la clé ``confirm`` dans ``$options`` pour spécifier
  le message.
- Les inputs de type checkbox et boutons radios types sont maintenant générées
  *à l'intérieur* de balises label par défaut. Ceci aide à accroître la
  compatibilité avec les librairies CSS populaires telles que
  `Bootstrap <http://getbootstrap.com/>`_ et
  `Foundation <http://foundation.zurb.com/>`_.
- Les tags de templates sont maintenant tous écrits en *camelBack*. Les tags
  pre-3.0 ``formstart``, ``formend``, ``hiddenblock`` et ``inputsubmit`` sont
  maintenant ``formStart``, ``formEnd``, ``hiddenBlock`` et ``inputSubmit``.
  Pensez à bien les changer s'ils sont personnalisés dans votre application.

Il est recommandé que vous regardiez la documentation
:doc:`/views/helpers/form` pour plus de détails sur la façon d'utiliser
le FormHelper dans 3.0.

HtmlHelper
----------

- ``HtmlHelper::useTag()`` a été retirée, utilisez ``tag()`` à la place.
- ``HtmlHelper::loadConfig()`` a été retirée. La personnalisation des tags peut
  être faîte en utilisant ``templates()`` ou la configuration ``templates``.
- Le deuxième paramètre ``$options`` pour ``HtmlHelper::css()`` doit maintenant
  toujours être un tableau comme c'est écrit dans la documentation.
- Le premier paramètre ``$data`` pour ``HtmlHelper::style()`` doit maintenant
  toujours être un tableau comme c'est écrit dans la documentation.
- Le paramètre ``inline`` a été retiré des méthodes meta(), css(), script(),
  scriptBlock(). Vous devrez utiliser l'option ``block`` à la place. Définir
  ``block => true`` va émuler le comportement précédent.
- ``HtmlHelper::meta()`` nécessite maintenant que ``$type`` soit une chaîne de
  caractère. Les options supplémentaires peuvent en outre être passées dans
  ``$options``.
- ``HtmlHelper::nestedList()`` nécessite maintenant que ``$options`` soit un
  tableau. Le quatrième argument pour le niveau de tag a été retiré et il a été
  inclus dans le tableau ``$options``.
- L'argument ``$confirmMessage`` de
  :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()` a été retiré. Vous devez
  maintenant utiliser la clé ``confirm`` dans ``$options`` pour spécifier
  le message.

PaginatorHelper
---------------

- ``link()`` a été retirée. Il n'était plus utilisé par le helper en interne.
  Il était peu utilisé dans le monde des utilisateurs de code, et ne
  correspondait plus aux objectifs du helper.
- ``next()`` n'a plus les options 'class', ou 'tag'. Il n'a plus d'arguments
  désactivés. A la place, les templates sont utilisés.
- ``prev()`` n'a plus les options 'class', ou 'tag'. Il n'a plus d'arguments
  désactivés. A la place, les templates sont utilisés.
- ``first()`` n'a plus les options 'after', 'ellipsis', 'separator', 'class',
  ou 'tag'.
- ``last()`` n'a plus les options 'after', 'ellipsis', 'separator', 'class', ou
  'tag'.
- ``numbers()`` n'a plus les options 'separator', 'tag', 'currentTag',
  'currentClass', 'class', 'tag', 'ellipsis'. Ces options sont maintenant
  accessibles à travers des templates. Le paramètre ``$options`` doit maintenant
  être un tableau.
- Les placeholders de style ``%page%`` ont été retirés de
  :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Utilisez les placeholders de style ``{{page}}`` à la place.
- ``url()`` a été renommée en ``generateUrl()`` pour éviter des clashes de
  déclaration de méthode avec ``Helper::url()``.

Par défaut, tous les liens et le texte inactif sont entourés d'elements ``<li>``.
Ceci aide à écrire plus facilement du CSS, et améliore la compatibilité avec
des frameworks populaires.

A la place de ces diverses options dans chaque méthode, vous devez utiliser
la fonctionnalité des templates. Regardez les informations de la
documentation :ref:`paginator-templates` sur la façon d'utiliser les templates.

TimeHelper
----------

- ``TimeHelper::__set()``, ``TimeHelper::__get()``, et
  ``TimeHelper::__isset()`` ont été retirées. Celles-ci étaient des
  méthodes magiques pour des attributs dépréciés.
- ``TimeHelper::serverOffset()`` a été retirée. Elle entraînait de mauvaises
  utilisations mathématiques de time.
- ``TimeHelper::niceShort()`` a été retirée.

NumberHelper
------------

- :php:meth:`NumberHelper::format()` nécessite maintenant que ``$options`` soit
  un tableau.

SessionHelper
-------------

- ``SessionHelper`` est déprécié. Vous pouvez utiliser
  ``$this->request->session()`` directement, et la fonctionnalité de message
  flash a été déplacée dans :doc:`/views/helpers/flash` à la place.

JsHelper
--------

- ``JsHelper`` et tous les moteurs associés ont été retirés. il pouvait
  seulement générer un tout petit nombre de code Javascript pour la librairie
  sélectionnée et essayer de générer tout le code Javascript en utilisant
  le helper devenait souvent difficile. Il est maintenant recommandé d'utiliser
  directement la librairie Javascript de votre choix.

CacheHelper Retiré
------------------

CacheHelper a été retiré. La fonctionnalité de cache  quelle fournissait n'était
pas standard, limitée et incompatible avec les mises en page non-HTML et les
vues de données. Ces limitations signifiaient qu'une réécriture complète était
nécessaire. Edge Side Includes est devenu un moyen standard d'implémenter les
fonctionnalités que CacheHelper fournissait. Cependant, implémenter `Edge Side
Includes <http://fr.wikipedia.org/wiki/Edge_Side_Includes>`_ en PHP présente un
grand nombre de limitations. Au lieu de construire une solution de qualité
inférieure, nous recommandons aux développeurs ayant besoin d'un cache global
d'utiliser `Varnish <http://varnish-cache.org>`_ ou
`Squid <http://squid-cache.org>`_ à la place.

I18n
====

Le sous-système I18n a été complètement réécrit. En général, vous pouvez vous
attendre au même comportement que dans les versions précédentes, spécialement
si vous utilisez la famille de fonctions ``__()``.

En interne, la classe ``I18n`` utilise ``Aura\Intl``, et les méthodes
appropriées sont exposées pour accéder aux fonctionnalités spécifiques de cette
librairie. Pour cette raison, la plupart des méthodes dans ``I18n`` a été
retirée ou renommée.

Grâce à l'utilisation de ``ext/intl``, la classe L10n a été complètement
retirée. Elle fournissait des données dépassées et incomplètes en comparaison
avec les données disponibles dans la classe ``Locale`` de PHP.

La langue de l'application par défaut ne sera plus changée automatiquement
par la langue du navigateur ou en ayant la valeur ``Config.language`` définie
dans la session du navigateur. Vous pouvez cependant utiliser un filtre
du dispatcher pour récupérer automatiquement la langue depuis l'en-tête
``Accept-Language`` envoyé dans par le navigateur::

    // Dans config/bootstrap.php
    DispatcherFactory::addFilter('LocaleSelector');

Il n'y a pas de remplacement intégré en ce qui concerne la sélection de la
langue en définissant une valeur dans la session de l'utilisateur.

La fonction de formatage par défaut pour les messages traduits n'est plus
``sprintf``, mais la classe ``MessageFormatter`` la plus avancée et aux
fonctionnalités riches.
En général, vous pouvez réécrire les placeholders dans les messages comme suit::

    // Avant:
    __('Today is a %s day in %s', 'Sunny', 'Spain');

    // Après:
    __('Today is a {0} day in {1}', 'Sunny', 'Spain');

Vous pouvez éviter la réécriture de vos messages en utilisant l'ancien
formateur ``sprintf``::

    I18n::defaultFormatter('sprintf');

De plus, la valeur ``Config.language`` a été retirée et elle ne peut plus être
utilisée pour contrôler la langue courante de l'application. A la place, vous
pouvez utiliser la classe ``I18n``::

    // Avant
    Configure::write('Config.language', 'fr_FR');

    // Maintenant
    I18n::setLocale('en_US');

- Les méthodes ci-dessous ont été déplacées:

  - De ``Cake\I18n\Multibyte::utf8()`` vers ``Cake\Utility\Text::utf8()``
  - De ``Cake\I18n\Multibyte::ascii()`` vers ``Cake\Utility\Text::ascii()``
  - De ``Cake\I18n\Multibyte::checkMultibyte()`` vers
    ``Cake\Utility\Text::isMultibyte()``

- Puisque l'extension mbstring est maintenant nécessaire, la classe
  ``Multibyte`` a été retirée.
- Les messages d'Error dans CakePHP ne passent plus à travers les fonctions de
  I18n. Ceci a été fait pour simplifier les entrailles de CakePHP et réduire
  la charge. Les messages auxquels font face les développeurs sont rarement,
  voire jamais traduits donc la charge supplémentaire n'apporte que peu de
  bénéfices.

L10n
====

- Le constructeur de :php:class:`Cake\\I18n\\L10n` prend maintenant une
  instance de :php:class:`Cake\\Network\\Request` en argument.

Testing
=======

- ``TestShell`` a été retiré. CakePHP, le squelette d'application et les plugins
  nouvellement créés utilisent tous ``phpunit`` pour exécuter les tests.
- L'exécuteur via le navigateur (webroot/test.php) a été retiré. L'adoption
  de CLI a beaucoup augmenté depuis les premières versions de 2.x. De plus,
  les exécuteurs CLI ont une meilleure intégration avec les outils des IDE et
  autres outils automatisés.

  Si vous cherchez un moyen de lancer les tests à partir d'un navigateur, vous
  devriez allez voir
  `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_. Il dispose de
  plusieurs fonctionnalités supplémentaires par rapport au vieil exécuteur via
  le navigateur.

- ``ControllerTestCase`` est dépréciée et sera supprimée de CAKEPHP 3.0.0.
  Vous devez utiliser les nouvelles fonctionnalités de
  :ref:`integration-testing` à la place.
- Les fixtures doivent maintenant être référencées sous leur forme plurielle::

    // Au lieu de
    $fixtures = ['app.article'];

    // Vous devrez utiliser
    $fixtures = ['app.articles'];

Utility
=======

Classe Set Retirée
------------------

La classe Set a été retirée, vous devriez maintenant utiliser la classe Hash
à la place.

Folder & File
-------------

Les classes folder et file ont été renommées:

- ``Cake\Utility\File`` renommée :php:class:`Cake\\Filesystem\\File`
- ``Cake\Utility\Folder`` renommée :php:class:`Cake\\Filesystem\\Folder`

Inflector
---------

- la valeur par défaut pour l'argument ``$replacement`` de la méthode
  :php:meth:`Cake\\Utility\\Inflector::slug()` a été modifiée de underscore
  (``_``) au tiret (``-``). utiliser des tirets pour séparer les mots dans les
  url est le choix le plus courant et également celui recommandé par Google.

- Les translitérations pour :php:meth:`Cake\\Utility\\Inflector::slug()` ont
  changé. Si vous utilisez des translitérations  personnalisées, vous devrez
  mettre à jour votre code. A la place des expressions régulières, les
  translitérations utilisent le remplacement par chaîne simple. Cela a donné
  des améliorations de performances significatives::

    // Au lieu de
    Inflector::rules('transliteration', [
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ]);

    // Vous devrez utiliser
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);

- Des ensembles de règles non inflectées et irrégulières séparés pour la
  pluralization et la singularization ont été retirés. Plutôt que d'avoir
  une liste commune pour chacun. Quand on utilise
  :php:meth:`Cake\\Utility\\Inflector::rules()` avec un type 'singular'
  et 'plural' vous ne pouvez plus utiliser les clés comme 'uninflected',
  'irregular' dans le tableau d'argument ``$rules``.

  Vous pouvez ajouter / écraser la liste de règles non inflectées et
  irrégulières en utilisant :php:meth:`Cake\\Utility\\Inflector::rules()` en
  utilisant les valeurs 'non inflectées' et 'irrégulières' pour un argument
  ``$type``.

Sanitize
--------

- La classe ``Sanitize`` a été retirée.

Security
--------

- ``Security::cipher()`` a été retirée. Elle est peu sûre et favorise de
  mauvaises pratiques en cryptographie. Vous devrez utiliser
  :php:meth:`Security::encrypt()` à la place.
- La valeur de configuration ``Security.cipherSeed`` n'est plus nécessaire.
  Avec le retrait de ``Security::cipher()`` elle n'est plus utilisée.
- La rétrocompatibilité de :php:meth:`Cake\\Utility\\Security::rijndael()` pour
  les valeurs cryptées avant CakePHP 2.3.1 a été retirée. Vous devrez rechiffrer
  les valeurs en utilisant ``Security::encrypt()`` et une version plus récente
  de CakePHP 2.x avant migration.
- La capacité de générer blowfish a été retirée. Vous ne pouvez plus utiliser le
  type "blowfish" pour ``Security::hash()``. Vous devrez utiliser uniquement
  le `password_hash()` de PHP et `password_verify()` pour générer et vérifier
  les hashs de blowfish. La librairie compatible
  `ircmaxell/password-compat <https://packagist.org/packages/ircmaxell/password-compat>`_
  qui est installée avec CakePHP fournit ces fonctions pour PHP < 5.5.
- OpenSSL est maintenant utilisé à la place de mcrypt pour le
  chiffrement/déchiffrement des données. Ce changement fournit de meilleurs
  performances et une avancée dans la supression du support de mcrypt.
- ``Security::rijndael()`` est dépréciée et elle est seulement disponible quand
  vous utilisez mcrypt.

.. warning::

    Les données chiffrées avec ``Security::encrypt()`` dans les versions
    précédentes sont compatibles avec l'implémentation de openssl. Vous devez
    :ref:`définir l'implémentation pour mcrypt <force-mcrypt>` lors de la mise
    à jour.

Time
----

- ``CakeTime`` a été renommée en :php:class:`Cake\\I18n\\Time`.
- ``Time::__set()`` et - ``Time::__get()`` ont été retirées. Celles-ci étaient
  des méthodes magiques setter/getter pour une rétrocompatibilité.
- ``CakeTime::serverOffset()`` a été retirée. Il incitait à des pratiques de
  correspondance de time incorrects.
- ``CakeTime::niceShort()`` a été retirée.
- ``CakeTime::convert()`` a été retirée.
- ``CakeTime::convertSpecifiers()`` a été retirée.
- ``CakeTime::dayAsSql()`` a été retirée.
- ``CakeTime::daysAsSql()`` a été retirée.
- ``CakeTime::fromString()`` a été retirée.
- ``CakeTime::gmt()`` a été retirée.
- ``CakeTime::toATOM()`` a été renommée en ``toAtomString``.
- ``CakeTime::toRSS()`` a été renommée en ``toRssString``.
- ``CakeTime::toUnix()`` a été renommée en ``toUnixString``.
- ``CakeTime::wasYesterday()`` a été renommée en ``isYesterday`` pour
  correspondre aux autres noms de méthode.
- ``CakeTime::format()`` N'utilise plus les chaînes de format ``sprintf`, vous
  pouvez utiliser ``i18nFormat`` à la place.
- :php:meth:`Time::timeAgoInWords()` a maintenant besoin que ``$options`` soit
  un tableau.

Time n'est plus une collection de méthodes statiques, il étend ``DateTime`` pour
hériter de ses méthodes et ajoute la localisation des fonctions de formatage
avec l'aide de l'extension ``intl``.

En général, les expressions ressemblent à ceci::

    CakeTime::aMethod($date);

Peut être migré en réécrivant ceci en::

    (new Time($date))->aMethod();

Number
------

Number a été réécrite pour utiliser en interne la classe ``NumberFormatter``.

- ``CakeNumber`` a été renommée en :php:class:`Cake\\I18n\\Number`.
- :php:meth:`Number::format()` nécessite maintenant que ``$options`` soit un
  tableau.
- :php:meth:`Number::addFormat()` a été retirée.
- ``Number::fromReadableSize()`` a été déplacée
  vers :php:meth:`Cake\\Utility\\Text:parseFileSize()`.

Validation
----------

- Le range pour :php:meth:`Validation::range()` maintenant inclusif si
  ``$lower`` et ``$upper`` sont fournies.
- ``Validation::ssn()`` a été retirée.

Xml
---

- :php:meth:`Xml::build()` a maintenant besoin que ``$options`` soit un
  tableau.
- ``Xml::build()`` n'accepte plus d'URL. Si vous avez besoin de créer un
  document XML à partir d'une URL, utilisez
  :ref:`Http\\Client <http-client-xml-json>`.
