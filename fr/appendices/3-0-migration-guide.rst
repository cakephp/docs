3.0 Guide de Migration
######################

Cette page résume les changements de CakePHP 2.x qui aidera à la migration d'un
projet vers la version 3.0, ainsi qu'une référence pour être à jour des
changements faits dans le coeur depuis la branche CakePHP 2.x. Assurez-vous de
bien lire les autres pages de ce guide pour toutes les nouvelles
fonctionnalités et les changements de l'API.


Pré-requis
==========

- CakePHP 3.x a besoin de la Version 5.4.19 ou supérieur de PHP.
- CakePHP 3.x a besoin de l'extension mbstring.
- CakePHP 3.x a besoin de l'extension mcrypt.

.. warning::

    CakePHP 3.0 ne fonctionnera pas si vous n'avez pas les pré-requis ci-dessus.

Organisation des Répertoires de l'Application
=============================================

L'organisation des répertoires de l'application a changé et suit maintenant
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Vous devrez utiliser le
`squelette d'application <https://github.com/cakephp/app>`_ de projet comme
point de référence lors de la mise à jour de votre application.

CakePHP doit être installé avec composer
========================================

Puisque CakePHP ne peut plus être facilement installé via PEAR, ou dans
un répertoire partagé, ces options ne sont plus supportées. A la place, vous
devez utiliser `composer <http://getcomposer.org>`_ pour installer CakePHP dans
votre application.

Namespaces (Espaces de Noms)
============================

Toutes les classes du coeur de CakePHP sont maintenant en namespaces et
suivent les spécifications du chargement PSR-4. Par exemple
``src/Cache/Cache.php`` a un namespace ``Cake\Cache\Cache``. Les constantes
globales et les méthodes de helper comme :php:meth:`__()` et :php:meth:`debug()`
ne sont pas mis en namespace pour des raisons de commodité.

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

La configuration dans CakePHP 3.0 est différente de façon significative par
rapport aux versions précédentes. Vous devriez lire la documentation
:doc:`/development/configuration` sur la façon dont la configuration est faite
dans la version 3.0.

Vous ne pouvez plus utiliser ``App::build()`` pour configurer les chemins de
classe supplémentaires. A la place, vous devez mapper les chemins
supplémentaires en utilisant l'autoloader de votre application. Regardez la
section sur :ref:`additional-class-paths` pour plus d'informations.

Deux nouvelles variables de configuration fournissent la configuration
de chemin pour les plugins, et les views. Vous pouvez ajouter plusieurs chemins
à ``App.paths.views`` et ``App.paths.plugins`` pour configurer les chemins
multiples pour les fichiers de plugins & de view.

Nouvel ORM
==========

CakePHP 3.0 dispose d'un nouvel ORM qui a été reconstruit à zéro. Le nouvel ORM
est significativement différent et incompatible avec la version précédente.
Mettre à jour vers le nouvel ORM nécessite des changements étendus dans toute
application qui souhaite être mise à jour. Regardez la nouvelle documentation
:doc:`/orm` pour des informations sur la façon d'utiliser le nouvel ORM.

Notions de base
===============

* ``LogError()`` a été retirée, elle ne fournissait aucun bénéfice
  et n'était rarement/jamais utilisée.

Debugging
=========

* ``Configure::write('debug'`, $bool)`` ne supporte plus 0/1/2. Un simple
  boléen est utilisé à la place pour changer entre le mode debug on et off.

Object settings/configuration
=============================

* Les Objets utilisés dans CakePHP ont maintenant un système
  d'instance-configuration de stockage/récupération cohérent. Le code qui était
  auparavant accessible par exemple comme ceci: `$object->settings` devra être
  mis à jour en utilisant à la place `$object->config()`.

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
* Les configurations de Cache sont maintenant immutable. Si vous avez besoin de
  changer la configuration, vous devez d'abord retirer la configuration et la
  recréer. Cela évite les problèmes de synchronization avec les options de
  configuration.
* ``Cache::set()`` a été retirée. Il est recommandé que vous créiez des
  configurations de cache multiples pour remplacer les réglages de configuration
  d'exécution, ce qui était auparavant possible avec ``Cache::set()``.
* Toutes les sous-classes ``CacheEngine`` integrent maintenant une méthode
  ``config()``.

Toutes les méthodes de :php:class:`Cake\\Cache\\Cache\\CacheEngine` sont
maintenant responsables de la gestion du préfix de clé configuré.
:php:meth:`Cake\\Cache\\CacheEngine::write()` ne permet plus de définir la
durée d'écriture - la durée est prise par la configuration d'éxecution du
moteur de cache. Appeler une méthode de cache avec une clé vide va maintenant
lancer :php:class:`InvalidArgumentException`, au lieu de retourner false.


Core
====

App
---

- ``App::build()`` a été retirée.
- ``App::location()`` a été retirée.
- ``App::paths()`` a été retirée.
- ``App::load()`` a été retirée.
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

Les classes de lecteur de configuration ont été renomées:

- ``Cake\Configure\PhpReader`` renommé en
  :php:class:`Cake\\Configure\\Engine\PhpConfig`
- ``Cake\Configure\IniReader`` renommé en
  :php:class:`Cake\\Configure\\Engine\IniConfig`
- ``Cake\Configure\ConfigReaderInterface`` renommé en
  :php:class:`Cake\\Configure\\ConfigEngineInterface`
- :php:meth:`Cake\\Core\\Configure::consume()` a été ajoutée.

Object
------

- ``Object::log()`` a été retirée de Object et ajoutée à
  la classe :php:trait:`Cake\\Log\\LogTrait`.
- ``Object::requestAction()`` a été retirée de Object et ajoutée à
  :php:trait:`Cake\\Routing\\RequestActionTrait`.

Console
=======

TaskCollection remplacée
------------------------

Cette classe a été renommée en :php:class:`Cake\\Console\\TaskRegistry`.
Regardez la section sur :doc:`/core-libraries/registry-objects` pour plus
d'informations sur les fonctionnalités fournies par la nouvelle classe. Vous
pouvez utiliser ``cake upgrade rename_collections`` pour vous aider à mettre
à niveau votre code. Les Tasks n'ont plus accès aux callbacks, puiqu'il
n'y avait jamais de callbacks à utiliser.

ApiShell retirée
----------------

ApiShell a été retirée puisqu'il ne fournit aucun bénéfice sur le fichier
source lui-même et sur la documentation/`l'API <http://api.cakephp.org/>`_
en-ligne.

Event
=====

* Le sous-système d'Event a eu un certain nombre d'options retirées. Lors
  du dispatching des events, vous ne pouvez plus utiliser les options suivantes:

  * ``passParams`` Cette option est maintenant toujours activée implicitement.
    Vous ne pouvez pas l'arrêter.
  * ``break`` Cette option a été retirée. Vous devez maintenant arrêter les
    events.
  * ``breakOn`` Cette option a été retirée. Vous devez maintenant arrêter les
    events.

Log
===

* Les configurations des logs sont maintenant immutable. Si vous devez changer
  la configuration, vous devez d'abord supprimer la configuration et la récréer.
  Cela évite les problèmes de synchronization avec les options de configuration.
* Les moteurs de Log se chargent maintenant automatiquement à la première
  écriture dans les logs.
* :php:meth:`Cake\\Log\\Log::engine()` a été ajoutée.
* Les méthodes suivantes ont été retirées de :php:class:`Cake\\Log\\Log` ::
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()``.
* Vous ne pouvez plus créer de niveaux personnalisés en utilisant
  ``Log::levels()``.
* Lors de la configuration des loggers, vous devriez utiliser ``'levels'`` au
  lieu de ``'types'``.
* Vous ne pouvez plus spécifier de niveaux de log personnalisé. Vous devez
  utiliser les niveaux de log définis par défaut. Vous devez utiliser les
  logging scopes pour créer des fichiers de log personnalisés ou spécifiques à
  la gestion de différentes sections de votre application. L'utilisation d'un
  niveau de log non-standard ne lancera pas d'exception.
* :php:trait:`Cake\\Log\\LogTrait` a été ajoutée. Vous pouvez utiliser ce trait
  dans vos classes pour ajouter la méthode ``log()``.
* Le logging scope passé à :php:meth:`Cake\\Log\\Log::write()` est maintenant
  transmis à la méthode ``write()`` du moteur de log afin de fournir un meilleur
  contexte aux moteurs.

Routing
=======

Paramètres nommés
-----------------

Les paramètres nommés ont été retirés dans 3.0. Les paramètres nommés ont été
ajoutés dans 1.2.0 comme un 'belle' version des paramètres query strings. Alors
que le bénéfice visuel est discutable, les problèmes des paramètres nommés
ne le sont pas.

Les paramètres nommés nécessitaient une gestion spéciale dans CakePHP ainsi
que toute librairie PHP ou JavaScript qui avaient besoin d'intéragir avec eux,
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
* Les options `_scheme`, `_port`, `_host`, `_base`, `_full`, `_ext` ont été
  ajoutées.
* Les chaînes URLs ne sont plus modifiées en ajoutant les noms de
  plugin/controller/prefix.
* La gestion de route fallback par défaut a été retirée. Si aucune route ne
  correspond à un paramètre défini, `/` sera retourné.
* Les classes de route sont responsables pour *toutes* les générations d'URL
  incluant les paramètres de query string. Cela rend les routes bien plus
  puissantes et flexibles.
* Les paramètres persistents ont été retirés. Ils ont été remplacés par
  :php:meth:`Cake\\Routing\\Router::urlFilter()` qui est une meilleur façon
  plus flexible pour changer les urls étant routées inversement.
* Appeler :php:meth:`Cake\\Routing\\Router::parseExtensions()` avec aucun
  paramètre ne parse plus toutes les extensions. Vous devez faire une
  liste des extensions que votre application supporte.

Route
-----

* ``CakeRoute`` a été renommée en ``Route``.
* La signature de ``match()`` a changé en ``match($url, $context = array())``
  Regardez :php:meth:`Cake\\Routing\\Route::match()` pour plus d'informations
  sur la nouvelle signature.

Filter\AssetFilter
------------------

* Les assets des Plugin & theme gérés par AssetFilter ne sont plus lus via
  ``include``, à la place ils sont traités comme de simples fichiers text. Cela
  règle un certain nombre de problèmes avec les librairies JavaScript comme
  TinyMCE et les environments avec short_tags activé.
* Le support pour la configuration de ``Asset.filter`` et les hooks ont été
  retirés. Cette fonctionnalité peut être facilement remplacée par un plugin
  ou un filtre dispatcher.

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
  de données préfixés, puisque ce prefix a été retiré.
* :php:meth:`Cake\\Network\\Request::env()` a été ajoutée.
* :php:meth:`Cake\\Network\\Request::acceptLanguage()` a été changée d'une
  méthode static en non static.
* Le detecteur de Request pour "mobile" a été retiré du coeur. A la place
  le template de app ajoute des detecteurs pour "mobile" et "tablet" en
  utilisant la lib `MobileDetect`.

Response
--------

* Le mapping du mimetype ``text/plain`` en extension ``csv`` a été retiré.
  En conséquence, :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  ne définit pas l'extension en ``csv`` si l'en-tête ``Accept`` contient le
  mimetype ``text/plain`` ce qui était une nuisance habituelle lors de la
  réception d'une requête jQuery XHR.

Network\\Session
================

* :php:class:`Cake\\Network\\Session` et les classes de session liées ont été
  déplacées dans le namespace ``Cake\Network``.

* ``SessionHandlerInterface`` a été retirée en faveur de celle fournie par PHP
  lui-même.

* La propriété ``Session::$requestCountdown`` a été changée en protected.
  Pour spécifier le valeur countdown de la requête, vous pouvez maintenant
  utiliser la variable de configuration ``Session.requestCountdown``.

Network\\Http
=============

* ``HttpSocket`` est maintenant :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client a été réécrit de zéro. Il a une API plus simple/facile à utiliser,
  le support pour les nouveaux systèmes d'authentification comme OAuth, et les
  uploads de fichier.
  Il utilise les APIs de PHP en flux donc il n'est pas nécessaire d'avoir cURL.
  Regardez la documentation :doc:`/core-utility-libraries/httpclient` pour plus
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
  facilement ré-utiliser les transports à travers les profiles d'email.
* :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` a été ajoutée pour
  permettre le retrait de la configuration du transport.


Controller
==========

Controller
----------

- Les propriétés ``$helpers``, ``$components`` sont maintenant
  fusionnées avec **toutes** les classes parentes, pas seulement
  ``AppController`` et le app controller du plugin.
- ``Controller::httpCodes()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::httpCodes()` à la place.
- ``Controller::disableCache()`` a été retirée, utilisez
  :php:meth:`Cake\\Network\\Response::disableCache()` à la place.
- ``Controller::flash()`` a été retirée. Cette méthode était rarement utilisée
  dans les vraies applications et ne n'avait plus aucun intérêt.
- ``Controller::validate()`` et ``Controller::validationErrors()`` ont été
  retirées. Il y avait d'autres méthodes laissées depuis les jours de 1.x days,
  où les préoccupations des models + controllers étaient bien plus étroitement
  liées.
- La propriété ``Controller::$scaffold`` a été retirée. Le scaffolding dynamique
  a été retiré du coeur de CakePHP, et sera fourni en tant que plugin autonome.
- La propriété ``Controller::$ext`` a été retirée. Vous devez maintenant étendre
  et surcharger la propriété ``View::$_ext`` si vous voulez utiliser une
  extension de fichier de view autre que celle par défaut.

Scaffold retiré
---------------

Le scaffolding dynamique dans CakePHP a été retiré du coeur de CakePHP. Il
était peu fréquemment utilisé, et n'avait jamais pour intention d'être
utilisé en mode production. Il sera remplacé par un plugin autonome que les
gens désireux d'avoir cette fonctionnalité pourront utiliser.

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
* Les options de configuration ne sont plus définie en propriété public.

Controller\\Components
======================

CookieComponent
---------------

- Utilise :php:meth:`Cake\\Network\\Request::cookie()` pour lire les données de
  cookie, ceci facilite les tests, et permet de définir les cookies pour
  ControllerTestCase.
- Les Cookies cryptés dans les versions précédentes de CakePHP utilisant la
  méthode ``cipher`` sont maintenant illisible parce que ``Security::cipher()``
  a été retirée. Vous aurez besoin de re-crypter les cookies avec la méthode
  ``rijndael`` avant mise à jour.
- ``CookieComponent::type()`` a été renommée en
  :php:meth:`Cake\\Controller\\Component\CookieComponent::encryption()` qui est
  plus intuitive.
- Les options de configuration ne sont plus définie en propriété public.

AuthComponent
-------------

- ``Blowfish`` est maintenant le hasher de mot de passe par défaut utilisé par
  les classes d'authentification.
  Si vous voulez continuer à utiliser le hashage SHA1 utilisé dans 2.x utilisez
  ``'passwordHasher' => 'Simple'`` dans votre configuration d'authenticator.
- ``BaseAuthenticate::_password()`` a été retirée. Utilisez une classe
  ``PasswordHasher`` à la place.
- La classe ``BlowfishAuthenticate`` a été retirée. Utilisez juste
  ``FormAuthenticate`` avec ``hashType`` défini à ``Blowfish``.
- La méthode ``loggedIn()`` a été retirée. Utilisez ``user()`` à la place.
- Les options de configuration ne sont plus définie en propriété public.

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
- Les options de configuration ne sont plus définie en propriété public.

SecurityComponent
-----------------

- Les méthodes suivantes et leurs propriétés liées ont été retirées du
  component Security:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Utilisez :php:meth:`Cake\\Network\\Request::onlyAllow()` à la place.
- ``SecurityComponent::$disabledFields()`` a été retirée, utilisez
  ``SecurityComponent::$unlockedFields()``.
- Les fonctionnalités liées au CSRF dans SecurityComponent ont été extraites et
  déplacées dans un CsrfComponent séparé. Ceci vous permet de plus facilement
  utiliser une protection CSRF sans avoir à utiliser de form
  tampering prevention.

Model
=====

La couche Model de 2.x a été entièrement réécrite et remplacée. Vous devriez
regarder :doc:`/appendices/orm-migration` pour plus d'informations sur la façon
d'utiliser le nouvel ORM.

- La classe ``Model`` a été retirée.
- La classe ``BehaviorCollection`` a été retirée.
- La classe ``DboSource`` a été retirée.
- La classe ``Datasource`` a été retirée.
- Les différentes sources de données des classes ont été retirées.

ConnectionManager
-----------------

- ConnectionManager a été déplacée dans le namespace ``Cake\\Database``.
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

TestSuite
=========

TestCase
--------

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

Notez que certaines méthodes ont été changées d'ordre, par ex:
``assertEqual($is, $expected)`` devra maintenant être
``assertEquals($expected, $is)``.
Il existe une commande de shell de mise à niveau ``cake upgrade tests``
pour vous aider à mettre à niveau votre code.

ControllerTestCase
------------------

- Vous pouvez maintenant simuler un query string, une post data et les valeurs
  de cookie lors de l'utilisation ``testAction()``. La méthode par défaut pour
  ``testAction()`` est maintenant ``GET``.

View
====

Les dossiers de View renommés
-----------------------------

Les dossiers de View suivants ont été renommées pour éviter les collisions de
avec les noms de controller:

- ``Layouts`` est mantenant ``Layout``
- ``Elements`` est maintenant ``Element``
- ``Scaffolds`` est maintenant ``Scaffold``
- ``Errors`` est maintenant ``Error``
- ``Emails`` est maintenant ``Email`` (idem pour ``Email`` dans ``Layout``)

HelperCollection remplacée
--------------------------

Cette classe a été renommée en :php:class:`Cake\\View\\HelperRegistry`.
Regardez la section sur :doc:`/core-libraries/registry-objects` pour plus
d'informations sur les fonctionnalités fournies par la nouvelle classe.
Vous pouvez utiliser ``cake upgrade rename_collections`` pour vous aider
à mettre à niveau votre code.

View class
----------

- La clé ``plugin`` a été retirée de l'argument ``$options`` de
  :php:meth:`Cake\\View\\View::element()`. Spécifiez le nom de l'element
  comme ``SomePlugin.element_name`` à la place.
- ``View::getVar()`` a été retirée, utilisez :php:meth:`Cake\\View\\View::get()`
  à la place.
- ``View::$ext`` a été retirée et à la place une propriété protected
  ``View::$_ext`` a été ajoutée.

ViewBlock
---------

- ``ViewBlock::append()`` a été retirée, utilisez
  :php:meth:`Cake\\View\ViewBlock::concat()` à la place.

JsonView
--------

- Par défaut les données JSON vont maintenant avoir des entités HTML encodées.
  Ceci empêche les problèmes possible de XSS quand le contenu de la view
  JSON est intégrée dans les fichiers HTML.
- :php:class:`Cake\\View\\JsonView` supporte maintenant la variable de view
  ``_jsonOptions``. Ceci vous permet de configurer les options bit-mask
  utilisées lors de la génération de JSON.


View\\Helper
============

- La propriété ``$settings`` est maintenant appelée ``$_config`` et peut être
  accesible via la méthode ``config()``.
- Les options de configuration ne sont plus définies en propriété public.
- :php:meth:`Cake\\View\\Helper::clean()` a été retirée. Il n'était jamais assez
  robuste pour complètement empêcher XSS. A la place, vous devriez echapper
  le contenu avec :php:func:`h` ou utiliser une librairie dédiée comme
  HTMLPurifier.
- :php:meth:`Cake\\View\\Helper::output()` a été retirée. Cette méthode a été
  dépréciée dans 2.x.
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

* Helper::setEntity()
* Helper::entity()
* Helper::model()
* Helper::field()
* Helper::value()
* Helper::_name()
* Helper::_initInputField()
* Helper::_selectedArray()

Ces méthodes étaient des parties uniquement utilisées par FormHelper, et
faisaient parti des continuelles fonctionnalités des champs qui devenaient
problématiques au fil du temps. FormHelper ne s'appuie plus sur ces méthodes
et leur complexité n'est plus nécessaire.

Les méthodes suivantes ont été retirées:

* Helper::_parseAttributes()
* Helper::_formatAttribute()

Ces méthodes se trouvent dans la classe ``StringTemplate`` que les helpers
utilisent fréquemment. Regardez ``StringTemplateTrait`` pour intégrer facilement
les templates de chaîne dans vos propres helpers.

FormHelper
----------

FormHelper a été entièrement réécrite pour 3.0. Il amène quelques grands
changements:

* FormHelper fonctionne avec le nouvel ORM. Mais il a un système extensible pour
  être intégré avec d'autres ORMs ou sources de données.
* FormHelper dispose d'une fonctionnalité de système de widget extensible qui
  vous permet de créer de nouveaux input widgets personnalisés et de facilement
  améliorer ceux intégrés.
* Les templates de chaîne sont un élément fondateur du helper. Au lieu de
  tableaux imbriqués ensemble partout, la plupart du HTML que FormHelper génère
  peut être personnalisé dans un endroit central en utilisant les ensembles de
  template.

En plus de ces grands changements, quelques plus petits changements finaux
ont été aussi faits. Ces changements devraient aider le streamline HTML que le
FormHelper génère et réduire les problèmes que les gens ont eu dans le passé:

- Le prefix ``data[`` a été retiré de tous les inputs générés. Le prefix n'a
  plus de réel utilité.
- Les diverses méthodes d'input autonomes comme ``text()``, ``select()`` et
  autres ne genèrent plus d'attributs id.
- L'option ``inputDefaults`` a été retirée de ``create()``.
- Les options ``default`` et ``onsubmit`` de ``create()`` ont été retirées. A la
  place, vous devriez utiliser le binding d'event javascript ou définir tout le
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
  mettre à jour le HTML qui l'entoure. L'option ``templates`` vous permet de surcharger
  les templates chargés pour un input.
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
- ``submit()`` a eu les options ``div``, ``before`` and ``after`` retirées. Vous
  pouvez personnaliser le template ``submitContainer`` pour modifier ce contenu.
- La méthode ``inputs`` n'accepte plus ``legend`` et ``fieldset`` dans le
  paramètre ``$fields``, vous devez utiliser le paramètre ``$options``.
- Le paramètre ``inline`` a été retiré de la méthode postLink().
  Vous devriez utiliser l'option ``block`` à la place. Définir ``block => true``
  va émuler le comportement précédent.

Il est recommandé que vous regardiez la documentation
:doc:`/core-libraries/helpers/form` pour plus de détails sur la façon d'utiliser
le FormHelper dans 3.0.

HtmlHelper
----------

- ``HtmlHelper::useTag()`` a été retirée, utilisez ``tag()`` à la place.
- ``HtmlHelper::loadConfig()`` a été retirée. La personnalisation des tags peut
  être faîte en utilisant ``templates()`` ou la configuration ``templates``.
- Le paramètre ``inline`` a été retiré des méthodes meta(), css(), script(),
  scriptBlock(). Vous devrez utiliser l'option ``block`` à la place. Définir
  ``block => true`` va émuler le comportement précédent.

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
  accessibles à travers des templates.
- Les placeholders de style ``%page%`` ont été retirés de
  :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Utilisez les placeholders de style ``{{page}}`` à la place.

Par défaut, tous les liens et le text inactifsont entourés d'elements ``<li>``.
Ceci aide à écrire plus facilement du CSS, et améliore la compatibilité avec
des frameworks populaires.

A la place de ces diverses options dans chaque méthode, vous devriez utiliser
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

I18n
====

- Le constructeur de :php:class:`Cake\\I18n\\I18n` prend maintenant une instance
  de :php:class:`Cake\\Network\\Request` en argument.

- Les méthodes ci-dessous ont été déplacées:

  - De ``Cake\I18n\Multibyte::utf8()`` vers ``Cake\Utility\String::utf8()``
  - De ``Cake\I18n\Multibyte::ascii()`` vers ``Cake\Utility\String::ascii()``
  - De ``Cake\I18n\Multibyte::checkMultibyte()`` vers
    ``Cake\Utility\String::isMultibyte()``

- Puisque l'extension mbstring est maintenant nécessaire, la classe
  ``Multibyte``a été retirée.
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
  nouvellement créés utilisent tous ``phpunit`` pour executer les tests.
- L'executeur via le navigateur (webroot/test.php) a été retiré. L'adoption
  de CLI a beaucoup amélioré depuis les premières versions de 2.x. De plus,
  les executeurs CLI ont une intégration meilleur avec les outils des IDE et
  autres outils automatisés.

  Si vous cherchez un moyen de lancer les tests à partir d'un navigateur, vous
  devriez allez voir
  `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_. Il dispose de
  plusieurs fonctionnalités supplémentaires par rapport au vieil executeur via
  le navigateur.

Utility
=======

Inflector
---------

Les Transliterations pour :php:meth:`Cake\\Utility\\Inflector::slug()` ont
changé. Si vous utilisez des transliterations personnalisées, vous devrez mettre
à jour votre code. A la place des expressions réglières, les transliterations
utilisent le remplacement par chaîne simple. Cela a donné des améliorations de
performances significatives::

    // Au lieu de
    Inflector::rules('transliteration', array(
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ));

    // Vous devrez utiliser
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);


Sanitize
--------

- La classe ``Sanitize`` a été retirée.

Security
--------

- ``Security::cipher()`` a été retirée. Elle est peu sûre et favorise de
  mauvaises pratiques en cryptographie. Vous devrez utiliser
  :php:meth:`Security::rijndael()` à la place.
- La valeur de configuration ``Security.cipherSeed`` n'est plus nécessaire.
  Avec le retrait de ``Security::cipher()`` elle n'est plus utilisée.
- La rétrocompatibilité de :php:meth:`Cake\\Utility\\Security::rijndael()` pour
  les valeurs cryptées avant CakePHP 2.3.1 a été retirée. Vous devrez re-crypter
  les valeurs en utilisant une version plus récente de CakePHP 2.x avant
  migration.

Time
----

- ``CakeTime`` a été renommée en :php:class:`Cake\\Utility\\Time`.
- ``Time::__set()`` et - ``Time::__get()`` ont été retirées. Celles-ci étaient
  des méthodes magiques setter/getter pour une rétrocompatibilité.
- ``CakeTime::serverOffset()`` a été retirée. Il incitait à des pratiques de
  correspondance de time incorrects.
- ``CakeTime::niceShort()`` a été retirée.
