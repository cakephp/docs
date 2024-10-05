Guide de migration vers la version 4.4
######################################

CakePHP 4.4 est une mise à jour de l'API compatible à partir de la version 4.0.
Cette page présente les dépréciations et fonctionnalités ajoutées dans la
version 4.4.

Mettre à jour vers la version 4.4.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.4.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.4"

.. note::
    CakePHP 4.4 nécessite PHP 7.4 ou supérieur.

Dépréciations
=============

4.4 introduit quelques dépréciations. Toutes ces fonctionnalités continueront
d'exister dans les versions 4.x mais seront supprimées dans la version 5.0.

Vous pouvez utiliser l':ref:`outil de mise à niveau <upgrade-tool-use>` pour
automatiser la mise à jour des fonctionnalités obsolètes::

    bin/cake upgrade rector --rules cakephp44 <path/to/app/src>

.. note::
    Cela ne met à jour que les changements de CakePHP 4.4. Assurez-vous
    d'appliquer d'abord les modifications de CakePHP 4.3.


Une nouvelle option de configuration a été ajoutée pour désactiver les
dépréciations chemin par chemin. Cf. :ref:`deprecation-warnings` pour plus
d'informations.

Controller
----------

- L'option ``paginator`` pour ``Controller::paginate()`` est dépréciée. Utilisez
  l'option ``className`` à la place.
- L'option ``paginator`` pour ``PaginatorComponent`` est dépréciée. Utilisez
  l'option ``className`` à la place.

Datasource
----------

- ``FactoryLocator::add()`` n'accepte plus de fonction de génération de
  closures. À la place, vous devez passer une instance de ``LocatorInterface``.
- ``Cake\Datasource\Paging\Paginator`` a été renommé en
  ``Cake\Datasource\Paging\NumericPaginator``.

ErrorHandler & ConsoleErrorHandler
----------------------------------

Les classes ``ErrorHandler`` et ``ConsoleErrorHandler`` sont maintenant
dépréciées. Elles ont été remplacées par les nouvelles classes ``ExceptionTrap``
et ``ErrorTrap``. Les classes *trap* fournissent des outils plus extensibles et
cohérents pour gérer les erreurs et exceptions. Pour mettre à niveau vers le
nouveau système, vous pouvez remplacer l'utilisation de ``ErrorHandler`` et
``ConsoleErrorHandler`` (notamment dans votre ``config/bootstrap.php``) par::

    use Cake\Error\ErrorTrap;
    use Cake\Error\ExceptionTrap;

    (new ErrorTrap(Configure::read('Error')))->register();
    (new ExceptionTrap(Configure::read('Error')))->register();

Si vous avez défini la valeur de configuration de ``Error.errorLogger``, vous
devrez le modifier en ``Error.logger``.

Consultez la page :doc:`/development/errors` pour une documentation plus
détaillée (Ndt : sa traduction française n'est pas à jour. Appel aux bonnes
volontés !).
De plus, les méthodes suivantes liées au système déprécié de gestion des erreurs
sont elles-mêmes dépréciées:

* ``Debugger::outputError()``
* ``Debugger::getOutputFormat()``
* ``Debugger::setOutputFormat()``
* ``Debugger::addFormat()``
* ``Debugger::addRenderer()``
* ``ErrorLoggerInterface::log()``. Implémentez ``logException()`` à la place.
* ``ErrorLoggerInterface::logMessage()``. Implémentez ``logError()`` à la place.


RequestHandlerComponent
------------------------

Le RequestHandlerComponent est déprécié "soft". Comme pour ``AuthComponent``,
l'usage de ``RequestHandler`` ne déclenchera pas d'avertissements à l'exécution
mais il **sera** supprimé dans 5.0.

- Remplacez ``accepts()`` par ``$this->request->accepts()``.
- Remplacez ``requestedWith()`` par un détecteur personnalisé de requête (par
  exemple, ``$this->request->is('json')``).
- Remplacez ``prefers()`` par ``ContentTypeNegotiation``. Consultez
  :ref:`controller-viewclasses`.
- Remplacez ``renderAs()`` par des fonctionnalitées de négociation de contenu
  dans ``Controller``.
- Remplacez l'option ``checkHttpCache`` par
  :doc:`/controllers/components/check-http-cache`.
- Utilisez les :ref:`controller-viewclasses` au lieu de définir des mappings de
  classes de vues dans ``RequestHandlerComponent``.


PaginatorComponent
------------------

Le ``PaginatorComponent`` est déprécié et sera supprimé dans 5.0. Utilisez la
propriété ``Controller::$paginate`` ou le paramètre ``$settings`` de la méthode
``Controller::paginate()`` pour spécifier les réglages de pagination
nécessaires.

ORM
---

- ``SaveOptionsBuilder`` a été déprécié. Utilisez un tableau pour les options à
  la place.

Plugins
-------

- Les noms de classes de plugin correspondent désormais au nom du plugin avec le
  suffixe "Plugin". Par exemple, la classe de plugin pour "ADmad/I18n" serait
  ``ADmad\I18n\I18nPlugin`` au lieu de ``ADmad\I18n\Plugin``, comme c'était le
  cas pour CakePHP 4.3 et antérieurs.
  L'ancien style de noms sera toujours supporté pour des raisons de
  compatibilité descendante.

Routing
-------

- Les fichiers de route mis en cache ont été dépréciés. Cela soulevait de
  nombreux cas de figure impossibles à résoudre avec des routes en cache. Comme
  la fonctionnalité des routes en cache n'est pas fonctionnelles dans de nombeux
  cas d'utilisation, elle sera supprimée dans 5.x

Suite de Test
-------------

- ``ConsoleIntegrationTestTrait`` a été déplacé dans le package de la console,
  au même endroit que les autres dépendances, pour permettre de tester les
  applications en console sans avoir besoin de tout le package cakephp/cakephp.

  - ``Cake\TestSuite\ConsoleIntegrationTestTrait`` a été déplacé vers ``Cake\Console\TestSuite\ConsoleIntegrationTestTrait``
  - ``Cake\TestSuite\Constraint\Console\*`` a été déplacé vers ``Cake\Console\TestSuite\Constraint\*``
  - ``Cake\TestSuite\Stub\ConsoleInput`` a été déplacé vers ``Cake\Console\TestSuite\StubConsoleInput``
  - ``Cake\TestSuite\Stub\ConsoleOutput`` a été déplacé vers ``Cake\Console\TestSuite\StubConsoleOutput``
  - ``Cake\TestSuite\Stub\MissingConsoleInputException`` a été déplacé ``Cake\Console\TestSuite\MissingConsoleInputException``

- ``ContainerStubTrait`` a été déplacé vers le package du cœur pour permettre le
  test des applications en console sans avoir besoin de tout le package
  cakephp/cakephp.

  - ``Cake\TestSuite\ContainerStubTrait`` a été déplacé vers ``Cake\Core\TestSuite\ContainerStubTrait``

- ``HttpClientTrait`` a été déplacé vers le package http pour permettre de
  tester les applications http sans avoir besoin de tout le package
  cakephp/cakephp.

  - ``Cake\TestSuite\HttpClientTrait`` a été déplacé vers ``Cake\Http\TestSuite\HttpClientTrait``

Changements de comportement
===========================

Bien que les changements suivants ne changent pas la signature des méthodes, ils
changent la sémantique ou le comportement de certaines d'entre elles.

ORM
---

* ``Table::saveMany()`` now triggers the ``Model.afterSaveCommit`` event with
  entities that are still 'dirty' and contain the original field values. This
  aligns the event payload for ``Model.afterSaveCommit`` with ``Table::save()``.

Routing
-------

* ``Router::parseRequest()`` soulève maintenant une ``BadRequestException`` au
  lieu d'une ``InvalidArgumentException`` lorsque le client utilise une méthode
  HTTP invalide.

Nouvelles Fonctionnalités
=========================

Cache
-----

* ``RedisEngine`` supporte désormais les méthodes ``deleteAsync()`` et
  ``clearBlocking()``. Ces méthodes utilisent l'opération ``UNLINK`` dans redis
  pour marquer les données en vue d'une suppression ultérieure par Redis.

Command
-------

* ``bin/cake routes`` met maintenant en valeurs les collisions dans les
  templates de routes.
* ``Command::getDescription()`` vous permet de définir une description
  personnalisée.Cf. :ref:`console-command-description`

Controller
----------

* ``Controller::viewClasses()`` a été ajoutée. Cette méthode devraient être
  implémentée par les contrôleurs qui ont besoin d'effectuer des négociations
  sur le content-type. Les classes de vue auront besoin d'implémenter la méthode
  statique ``contentType()`` pour participer à la négociation du content-type.

Database
--------

* Le pilote ``SQLite`` supporte à présent les base de données partagées en
  mémoire sous PHP8.1+.
* ``Query::expr()`` a été ajoutée comme alternative à ``Query::newExpr()``.
* Le builder ``QueryExpression::case()`` supporte maintenant l'inférence de
  types à partir d'expressions passées à ``then()`` et à ``else()`` qui
  implémentent ``\Cake\Database\TypedResultInterface``.

Error
-----

* ``ErrorTrap`` et ``ExceptionTrap`` ont été ajoutées. Ces classes forment la
  fondation d'un système de gestion d'erreur mis à jour pour les applications.
  Pour en savoir plus, rendez-vous sur :doc:`/development/errors`.

Http
----

* ``Response::checkNotModified()`` a été dépréciée.
  Utilisez ``Response::isNotModified()`` à la place.
* ``BaseApplication::handle()`` ajoute désormais systématiquement ``$request``
  dans le conteneur de service.
* ``HttpsEnforcerMiddleware`` a maintenant une option ``hsts`` qu vous permet de
  configurer le header ``Strict-Transport-Security``.

Mailer
------

* ``Mailer`` accepte désormais une clé de configuration ``autoLayout`` qui
  qui désactive le layout automatique dans le ``ViewBuilder`` si elle est
  définie à ``false``.

ORM
---

* L'option ``cascadeCallbacks`` a été ajoutée ``TreeBehavior``. Lorsqu'elle est
  activée, ``TreeBehavior`` itérera un résultat de ``find()`` et effacera les
  enregistrements individuellement. Cela permet d'utiliser les callbacks de
  l'ORM lors de l'effacement de nœuds.

Routing
-------

* ``RoutingMiddleware`` définit désormais l'attribut "route" de la requête avec
  l'instance ``Route`` qui correspond.


View
----

* ``View::contentType()`` a été ajoutée. Les vues peuvent implémenter cette
  méthode pour participer à une négociation du content-type.
* ``View::TYPE_MATCH_ALL`` a été ajoutée. Ce content-type spécial vous permet de
  construire des vues de repli pour les cas où la négociation du content-type
  ne fournit aucune correspondance.
