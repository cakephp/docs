3.5 Guide de Migration
######################

CakePHP 3.5 est une mise à jour de CakePHP 3.4 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.5.

Pour mettre à jour vers 3.5.x, lancez la commande suivante :

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.5.*"

Dépréciations
=============

La liste qui suit regroupe les méthodes, les propriétés et les comportements
dépréciés. Ces différents éléments continueront de fonctionner jusqu'à la
version 4.0.0, à partir de laquelle ils seront supprimés.

* ``Cake\Http\Client\CookieCollection`` est dépréciée. Utilisez
  ``Cake\Http\Cookie\CookieCollection`` à la place.
* ``Cake\View\Helper\RssHelper`` est dépréciée. Vu son peu d'utilisation, le
  RssHelper est déprécié.
* ``Cake\Controller\Component\CsrfComponent`` est dépréciée. Utilisez
  le middleware CSRF à la place.
* ``Cake\Datasource\TableSchemaInterface`` est dépréciée. Utilisez
  ``Cake\Database\TableSchemaAwareInterface`` à la place.
* ``Cake\Console\ShellDispatcher`` est dépréciée. Vous devez mettre à jour vos
  Applications pour qu'elles utilisent ``Cake\Console\CommandRunner`` à la place.

Dépréciation des Méthodes Get / Set combinées
---------------------------------------------

Dans le passé, CakePHP a utilisé des méthodes 'modal' qui proposait à la fois
un mode get et un mode set. Ces méthodes compliquent l'auto-complétion des IDE
et notre capacité à ajouter des *return type* stricts dans le futur. Pour ces
raisons, ces méthodes get / set combinés sont scindées en méthodes get et set
séparées.

La liste suivante regroupe les méthodes dépréciées et qu'il faudra remplacer
par des méthodes ``getX()`` et ``setX()`` :

``Cake\Cache\Cache``
    * ``config()``
    * ``registry()``
``Cake\Console\Shell``
    * ``io()``
``Cake\Console\ConsoleIo``
    * ``outputAs()``
``Cake\Console\ConsoleOutput``
    * ``outputAs()``
``Cake\Database\Connection``
    * ``logger()``
``Cake\Datasource\TypedResultTrait``
    * ``returnType()``
``Cake\Database\Log\LoggingStatement``
    * ``logger()``
``Cake\Datasource\ModelAwareTrait``
    * ``modelType()``
``Cake\Database\Query``
    * ``valueBinder()`` est maintenant ``getValueBinder()``
``Cake\Datasource\QueryTrait``
    * ``eagerLoaded()`` (maintenant ``isEagerLoaded()``)
``Cake\Event\EventDispatcherTrait``
    * ``eventManager()``
``Cake\Error\Debugger``
    * ``outputAs()`` (maintenant ``getOutputFormat()`` / ``setOutputFormat()``)
``Cake\Http\ServerRequest``
    * ``env()`` (maintenant ``getEnv()`` / ``withEnv()``)
``Cake\I18n\I18n``
    * ``locale()``
    * ``translator()``
``Cake\ORM\LocatorAwareTrait``
    * ``tableLocator()``
``Cake\ORM\EntityTrait``
    * ``invalid()`` (maintenant ``getInvalid()``, ``setInvalid()``,
      ``setInvalidField()``, maintenant ``getInvalidField()``)
``Cake\ORM\Table``
    * ``validator()``
``Cake\Routing\RouteCollection``
    * ``extensions()``
``Cake\TestSuite\TestFixture``
    * ``schema()``
``Cake\Utility\Security``
    * ``salt()``
``Cake\View\View``
    * ``template()``
    * ``layout()``
    * ``theme()``
    * ``templatePath()``
    * ``layoutPath()``
    * ``autoLayout()`` (maintenant ``isAutoLayoutEnabled()`` / ``enableAutoLayout()``)

Changement de Comportements
===========================

Bien que ces changements garde la compatibilité API, ce sont tout de même des
variations mineures qui pourraient avoir un impact sur votre application.

* ``BehaviorRegistry``, ``HelperRegistry`` et ``ComponentRegistry`` lanceront
  maintenant une exception quand ``unload()`` est appelé avec un nom d'objet
  inconnu. Ce changement devrait aider à trouver plus rapidement les erreurs.
* Les associations ``HasMany`` gèrent maintenant mieux les valeurs 'vides' pour
  les propriétés d'associations, de la même manière que ``BelongsToMany`` :
  elles traitent maintenant ``false``, ``null`` et les chaînes vides comme des
  tableaux vides. Pour les associations ``HasMany``, cela veut dire que les résultats
  des enregistrements associés sont maintenant supprimés / déliés quand la stratégie
  de sauvegarde ``replace`` est utilisée.
  Ce qui veut dire vous pouvez maintenant supprimer / déliés des enregistrements
  associés en passant une chaîne vide : vous auriez dû utiliser une logique spécifique
  de marshalling pour faire cela auparavant.
* ``ORM\Table::newEntity()`` marque maintenant *dirty* les propriétés correspondant
  à des associations si les enregistrements de l'association *marshallé* sont *dirty*.
  Dans les cas où une entity d'association est créée et qu'elle ne contient aucune
  propriété, elle ne sera pas marquée pour être persistée.
* ``Http\Client`` n'utilise plus le résultat de la méthode ``cookie()`` lors de la
  construction de requêtes. A la place, le header ``Cookie`` et la ``CookieCollection``
  interne sont utilisés. Cela ne devrait affecter que les applications qui ont des
  adapter HTTP personnalisés dans leurs clients.
* Les sous-commandes composées de plusieurs mots devaient impérativement être
  appelées avec leur nom camelBacked pour être utilisées. Les sous-commandes
  peuvent maintenant être appelées via leur nom au format *underscored_names*.
  Par exemple : ``cake tool initMyDb`` peut maintenant être appelée via
  ``cake tool init_my_db``. Si vos Shells liaient 2 sous-commandes avec le même
  nom mais 2 inflections différentes, seule la dernière commande liée fonctionnera.
* ``SecurityComponent`` bloquera les requête POST qui ne passent pas de données
  dans la requête (pas de *request data*). Cela aide à la protection des actions
  qui créent des enregistrement en base en utilisant seulement les *defaults* de
  la base de données.
* ``Cake\ORM\Table::addBehavior()`` et ``removeBehavior()`` retournent maintenant
  ``$this`` pour faciliter la définition d'objets Table avec une interface fluide.
* Les moteurs de Cache ne lancent maintenant plus d'exception quand ils échouent ou
  qu'ils sont mals configurés. Ils se rabattent, à la place, sur le moteur *noop*
  ``NullEngine``. Les *fallbacks* peuvent aussi être configurés par moteur.

Nouvelles Fonctionnalités
=========================

Cache
-----

* Les moteurs de cache peuvent maintenant être configurés avec une clé ``fallback``
  qui permet de définir une configuration de cache sur laquelle se rabattre si
  le moteur était mal configuré ou indisponible. Référez-vous à la section
  :ref:`cache-configuration-fallback` pour plus d'informations sur la configuration
  des *fallbacks*.

Core
----

* ``Cake\Core\ObjectRegistry`` implémente maintenant les interfaces ``Countable`` et
  ``IteratorAggregate``.

Console
-------

* ``Cake\Console\ConsoleOptionParser::setHelpAlias()`` a été ajoutée. Cette méthode
  permet de définir le nom de la commande à utiliser lors de l'affichage des aides.
  Par défaut, la valeur est ``cake``
* ``Cake\Console\CommandRunnner`` a été ajoutée en remplacement de
  ``Cake\Console\ShellDispatcher``.
* ``Cake\Console\CommandCollection`` a été ajouté afin de fournir une interface pour
  que les applications puissent définir les outils en ligne de commande qu'elles
  offrent.

Datasource
----------

* ``Cake\Datasource\SchemaInterface`` a été ajoutée.
* De nouveaux types abstraits ont été définis pour ``smallinteger`` et ``tinyinteger``.
  Les colonnes existantes en ``SMALLINT`` and ``TINYINT`` seront maintenant
  introspectées via ces nouveaux types abstraits. Les colonnes ``TINYINT(1)``
  continueront à être traitées comme des booléen dans MySQL.
* ``Cake\Datasource\PaginatorInterface`` a été ajoutée. Le ``PaginatorComponent``
  utilise maintenant cette interface pour intéragir avec les paginators. Cela
  permet à des implémentations *ORM-like* d'être paginées par le component.
* ``Cake\Datasource\Paginator`` a été ajouté pour paginer les instances des requêtes
  ORM/Database.

Event
-----

* Les méthodes ``Cake\Event\EventManager::on()`` et ``off()`` peuvent maintenant être
  chainées ce qui rend plus simple la définition de plusieurs événements à la fois.

Http
----

* Les classes ``Cookie`` & ``CookieCollection`` ont été ajoutées. Ces classes vous
  permettent de travailler avec les cookies de manière orientée objet et sont
  disponibles dans ``Cake\Http\ServerRequest``, ``Cake\Http\Response``, et
  ``Cake\Http\Client\Response``.
* Un nouveau middleware a été ajouté pour permettre d'appliquer des headers de
  sécurité plus facilement.
* Un nouveau middleware a été ajouté pour chiffrer de manière transparente les
  données de cookie.
* Un nouveau middleware a été ajouté pour permettre une protection CSRF plus simple.
* ``Cake\Http\Client::addCookie()`` a été ajoutée pour faciliter l'ajoute de cookies
  à une instance d'un client.

ORM
---

* ``Cake\ORM\Query::contain()`` vous permet de l'appeler sans le tableau quand vous
  faites un contain() sur une seule association.
  ``contain('Comments', function () { ... });`` fonctionnera maintenant. Cela
  rend ``contain()`` plus cohérent avec d'autres méthodes d'eagerloading comme
  ``leftJoinWith()`` et ``matching()``.

Routing
-------

* ``Cake\Routing\Router::reverseToArray()`` a été ajoutée. Cette méthode vous permet
  de convertir des objets de requête en tableau qui peuvent être utilisés pour
  générer des URL sous forme de chaîne.
* ``Cake\Routing\RouteBuilder::resources()`` s'est vue ajouter une option ``path``.
  Cette option vous permet de faire en sorte que le chemin de la ressource et le
  nom du controller ne correspondent pas.
* ``Cake\Routing\RouteBuilder`` a maintenant des méthodes pour créer des routes
  spécifiques à des méthodes HTTP comme ``get()`` et ``post()`` par exemple.
* ``Cake\Routing\RouteBuilder::loadPlugin()`` a été ajoutée.
* ``Cake\Routing\Route`` a maintenant des méthodes "fluide" (*fluent interface*)
  pour définir ses options.

TestSuite
---------

* ``IntegrationTestCase::head()`` a été ajoutée.
* ``IntegrationTestCase::options()`` a été ajoutée.
* ``IntegrationTestCase::disableErrorHandlerMiddleware()`` a été ajoutée pour
  faciliter le debugging des tests d'intégration.

Validation
----------
* ``Cake\Validation\Validator::regex()`` a été ajoutée afin de permettre de faire
  de la validation par regex plus facilement.
* ``Cake\Validation\Validator::addDefaultProvider()`` a été ajoutée. Cette méthode
  vous permet d'injecter des providers de validation dans tous les validators créés
  dans votre application.
* ``Cake\Validation\ValidatorAwareInterface`` a été ajouté pour définir les méthodes
  implémentées par ``Cake\Validation\ValidatorAwareTrait``.

View
----

* ``Cake\View\Helper\PaginatorHelper::limitControl()`` a été ajoutée. Cette méthode
  vous permet de créer un formulaire avec un select qui permet de mettre à jour
  la valeur "limite" d'un résultat paginé.
