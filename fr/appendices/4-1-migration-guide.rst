Guide de migration vers la version 4.1
######################################

CakePHP 4.1 est une mise à jour de l'API compatible à partir de la version 4.0. Cette page présente les
dépréciations et fonctionnalités ajoutées dans la version 4.1.

Mettre à jour vers la version 4.1.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.1.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.1.x"

Dépréciations
=============

4.1 introduit quelques dépréciations. Toutes ces fonctionnalités continueront d'exister dans les versions 4.x
mais seront supprimées dans la version 5.0. Vous pouvez utiliser l'
:ref:`outil de mise à niveau <upgrade-tool-use>` pour automatiser la mise à jour des fonctionnalités obsolètes::

    bin/cake upgrade rector --rules cakephp41 <path/to/app/src>

.. note::
    Cela ne met à jour que les changements de CakePHP 4.1. Assurez-vous d'appliquer d'abord les modifications
    de CakePHP 4.0.

Controller
----------

* L'option ``sortWhitelist`` du composant ``PaginatorComponent`` a été dépréciée.
  Utilisez ``sortableFields`` à sa place.
* L'option ``whitelist`` du composant  ``PaginatorComponent`` a été dépréciée.
  Utilisez ``allowedParameters`` à sa place.

Database
--------

* ``TableSchema::getPrimary()`` a été dépréciée. Utilisez ``getPrimaryKey()`` à sa place.
* ``Cake\Database\Schema\BaseSchema`` a été renommée en
  ``Cake\Database\Schema\SchemaDialect``.
* ``Cake\Database\Schema\MysqlSchema`` a été renommée en
  ``Cake\Database\Schema\MysqlSchemaDialect`` et marquée comme interne.
* ``Cake\Database\Schema\SqliteSchema`` a été renommée en
  ``Cake\Database\Schema\SqliteSchemaDialect`` et marquée comme interne.
* ``Cake\Database\Schema\SqlserverSchema`` a été renommée en
  ``Cake\Database\Schema\SqlserverSchemaDialect`` et marquée comme interne.
* ``Cake\Database\Schema\PostgresSchema`` a été renommé en
  ``Cake\Database\Schema\PostgresSchemaDialect`` et marquée comme interne.
* ``DateTimeType::setTimezone()`` a été dépréciée. Utilisez ``setDatabaseTimezone()`` à sa place.
* La signature la méthode magique pour ``FunctionBuilder::cast([...])`` est dépréciée.
  Utilisez ``FunctionBuilder::cast('field', 'type')`` à sa place.
* ``Cake\Database\Expression\Comparison`` a été renommé en ``Cake\Database\Expression\ComparisonExpression``.

Datasource
----------

* L'option ``sortWhitelist`` de la classe ``Paginator`` a été dépréciée.
  Utilisez ``sortableFields`` à sa place.
* L'option ``whitelist`` de la classe ``Paginator`` a été dépréciée.
  Utilisez ``allowedParameters`` à sa place.


Form
----

* ``Form::schema()`` a été déprécié. Utilisez ``Form::getSchema()`` or
  ``Form::setSchema()`` à sa place.

Http
----

* ``CsrfProtectionMiddleware::whitelistCallback()`` a été dépréciée. Utilisez
  ``skipCheckCallback()`` à sa place.
* ``ServerRequest::input()`` est dépréciée. Utilisez ``(string)$request->getBody()``
  pour obtenir les données d'entrées brutes venant de PHP sous forme de chaîne de caractères;
  utilisez ``BodyParserMiddleware`` pour décoder le corps de la requête et ainsi le rendre
  disponible sous la forme d'un array/object au travers de la méthode ``$request->getParsedBody()``
* L'option ``httpOnly`` pour le middleware ``CsrfProtectionMiddleware`` se nomme à présent ``httponly``
  afin d'améliorer la cohérence avec la création des cookie que l'on trouve par ailleurs dans le framework.

ORM
---

* ``QueryExpression::or_()`` et ``QueryExpression::and_()`` ont été dépréciées.
  Utilisez ``or()`` and ``and()`` à leur place.

Routing
-------

* ``Cake\Routing\Exception\RedirectException`` est dépréciée. Utilisez
  ``Cake\Http\Exception\RedirectException`` à sa place.

View
----

* ``Form/ContextInterface::primaryKey()`` a été dépréciée. Utilisez ``getPrimaryKey()``
  à sa place.


Changement pour les Behavior
============================

Bien que les modifications suivantes ne modifient pas la signature des méthodes, elles changent la sémantique ou
le comportement de certaines méthodes.

Database
--------

* MySQL: Les largeurs d'affichage des entiers sont désormais ignorées sauf pour ``TINYINT(1)`` qui
  correspond toujours au type booléen. Les largeurs d'affichage sont obsolètes dans MySQL 8.

Http
----

* La normalisation des fichiers téléchargés a été déplacée de ``ServerRequest`` vers
  ``ServerRequestFactory``. Cela pourrait avoir un impact sur vos tests si vous créez
  objets de requête qui utilisent des tableaux de téléchargement de fichiers imbriqués.
  Les tests utilisant ``IntegrationTestCaseTrait`` n'ont pas à être modifiés.

ORM
---

* ``Cake\ORM\TableRegistry`` a été dépréciée. Utilisez ``Cake\ORM\Locator\LocatorAwareTrait::getTableLocator()``
  ou ``Cake\Datasource\FactoryLocator::get('Table')`` afin d'obtenir une instance du 'table locator'.
  Les classes comme ``Controller``, ``Command``, ``TestCase`` utilisent déjà ``Cake\ORM\Locator\LocatorAwareTrait``
  ainsi dans ces classes vous pouvez simplement utiliser ``$this->getTableLocator()->get('ModelName')``.
* Les associations BelongsToMany respectent désormais le 'bindingKey' fourni dans la table de jointure de l'association
  BelongsTo.
  Auparavant, la clé primaire de la table cible était toujours utilisée à la place.
* Les noms d'association sont désormais correctement sensibles à la casse et doivent correspondre lorsqu'ils sont
  référencés dans des fonctions telles que ``Query::contain()``
  et ``Table::hasMany()``.
* ``Cake\ORM\AssociationCollection`` ne transfome désormais plus les noms des associations en minuscule quand il
  génère les clés pour les tableaux d'objets (map) qu'il maintien en interne.

TestSuite
---------

* ``TestCase::setAppNamespace()`` retourne maintenant l'espace de noms précédent de l'application afin
  de simplifier sa sauvegarde et sa restauration.
* GroupsFixture a été renommé en SectionsFixture à cause d'un changement des mots clés réservés de MySQL.

View
----

* Les sources de données par défaut du helper ``FormHelper``sont à présent ``data, context``
  au lieu de ``context``. Si vous utilisez ``setValueSources()`` pour changer les valeurs des
  sources, vous pourriez avoir besoin de mettre votre code à jour.
* Les classes de contexte ``FormHelper`` fournies par CakePHP ne prennent désormais plus
  un objet ``$request`` dans leur constructeur.


Nouvelles fonctions
===================

Datasource
----------

* ``EntityInterface::getAccessible()`` a été ajoutée.

Console
-------

* Lorsque la variable d'environnement ``NO_COLOR`` est définie toutes les sorties n'inclueront
  pas les codes d'échappement ANSII correspondant aux couleurs. Voyez `no-color.org <https://no-color.org/>`__
  pour plus d'informations.
* Les commandes ont désormais la même possibilité de désactiver le mode interactif que les shells possédaient
  en utilisant ``$io->setInteractivate(false)``.
  Ici les invites seront évitées le cas échéant et les valeur par défaut seront utilisées.
  L'utilisation de ``--quiet``/``-q`` permet également de réaliser cela pour toutes les commandes existantes.

Database
--------

* MySQL 8 est pris en charge et testé.
* ``AggregateExpression`` a été ajouté pour représenter les fonctions SQL d'agrégation.
  ``FunctionsBuilder::aggregate()`` peut être utilisé pour encapsuler de nouvelles fonctions SQL agrégées.
* La prise en charge des fonctions 'Window' a été ajoutée pour n'importe quelle expression agrégée.
  ``AggregateExpression`` enveloppe l'expression de fenêtrage (window expression)
  pour le chaînage des appels.
* Les fonctions d'agrégation prennent désormais en charge les clauses ``FILTER (WHERE ...)``.
* Postgres et SQLServer prennent désormais en charge les conditions ``HAVING`` sur les fonctions
  d'aggrégation avec alias.
* ``FunctionsBuilder::cast()`` a été ajoutée.
* Le support des Common Table Expression (CTE) a été ajouté. Les CTE peuvent être attachées
  en utilisant ``Query::with()``.
* ``Query::orderAsc()`` et ``Query::orderDesc()`` acceptent désormais des closures comme champs
  vous permettant ainsi de construire des expressions de tri (order) complexes utilisant l'objet
  ``QueryExpression``.

Error
-----

* ``debug()`` et ``Debugger::printVar()`` émettent maintenant du HTML dans les contextes Web,
  et des sories formattées selon le style ANSI dans le contexte de ligne de commande CLI.
  L'affichage de structures cycliques et des objets répétés est plus simple.
  Les objects cycliques ne sont affichés en entier qu'une fois et utilisent des id de référence pour
  pointer vers la valeur complète de l'objet.
* ``Debugger::addEditor()`` et ``Debugger::setEditor()`` ont été ajoutées. Ces méthodes vous permettent
  respectivement d'ajouter des formats supplémentaires à l'éditeur et de définir votre éditeur préféré.
* La valeur de configuration ``Debugger.editor`` a été ajoutée. Cette valeur est utilisée pour définir
  le format des liens préféré pour l'éditeur.
* ``ErrorHandlerMiddleware`` supporte à présent
  ``Http\Exception\RedirectException`` et convertit ces exceptions en redirection HTTP.
* ``BaseErrorHandler`` utilise maintenant le logger configuré pour les erreurs afin d'enregistrer les
  avertissement de PHP ainsi que les erreurs.
* ``ErrorLoggerInterface`` a été ajouté pour formaliser l'interface requise pour les loggers d'erreurs
  personnalisés.


Form
----

* ``Form::set()`` a été ajoutée. Cette méthode vous permet d'ajouter des données supplémentaires au
  objets de formulaires de la même façon que ``View::set()`` ou ``Controller::set()``.

Http
----

* ``BaseApplication::addOptionalPlugin()`` a été ajoutée. Cette méthode gère
  chargement des plugins et gestion des erreurs pour les plugins qui peuvent ne pas exister car
  ce sont des dépendances de développement.
* ``Cake\Http\Exception\RedirectException`` a été ajoutée. Cette exception remplace
  ``RedirectException`` dans le package de routage et peut être déclenchée n'importe où dans
  votre application pour signaler au middleware de gestion des erreurs de créer
  une réponse de redirection.
* ``CsrfProtectionMiddleware`` peut désormais créer des cookies avec l'attribut ``samesite``.
* Le second paramètre de ``Session::read()`` permet maintenant de définir des valeurs par défaut.
* ``Session::readOrFail()`` a été ajouté comme wrapper permettant le déclenchement d'exceptions
  pour les opérations ``read()`` pour lesquelles la clé manque.

I18n
----

* La méthode ``setJsonEncodeFormat`` pour les classes  ``Time``, ``FrozenTime``, ``Date`` et
  ``FrozenDate`` accepte désormais une fonction de rappel (callable) qui peut être utilisée
  pour retourner une chaîne de caractères personnalisée.
* Le parsing indulgent (Lenient) pour ``parseDateTime()`` et ``parseDate()`` peut être désactivé
  en utilisant ``disableLenientParsing()``. Par défaut il est activé - idem pour IntlDateFormatter.

Log
---

* Les messages de Log peuvent désormais contenir des placeholders du type ``{foo}``. Ces placeholders
  seront remplacés par les valeurs du paramètre ``$context`` le cas échant.

ORM
---

* L'ORM déclenche maintenant un événement ``Model.afterMarshal`` après
  que chaque entité ait été marshalée à partir des données de la requête.
* Vous pouvez utiliser l'option ``locale`` du finder option pour modifier la locale
  d'une recherche pour une table qui a le comportement ``TranslateBehavior``.
* ``Query::clearResult()`` a été ajoutée. Cette méthode vous permet de supprimer le résultat
  d'une requête afin que vous puissiez la réexécuter.
* ``Table::delete()`` abandonnera désormais une opération de suppression et retournera false si une
  association dépendante ne parvient pas à être supprimée pendant les opérations de cascadeCallback.
* ``Table::saveMany()`` déclenchera maintenant l'événement ``Model.afterSaveCommit`` sur les entités qui
  sont enregistrées.

Routing
-------
* Une fonction pratique  ``urlArray()`` a été introduite pour générer rapidement des tableaux d'URL
  à partir d'une chaîne de chemin de route..

TestSuite
---------

* ``FixtureManager::unload()`` ne tronque plus les tables à la *fin* d'un test
  tandis que les fixtures sont déchargés. Les tables seront toujours tronquées pendant le chargement
  des fixturage. Vous devriez voir une suite de tests plus rapide car moins d'opérations de troncature
  seront réalisées.
* Les assertions concernant le corps des email incluent désormais le contenu de l'email rendant les tests plus
  faciles à déboguer.
* ``TestCase::addFixture()`` a été ajouté pour permettre la configuration en chaîne des fixtures, ceci est
  également auto-completable dans les IDEs.

View
----

* La méthode ``TextHelper::slug()`` a été ajoutée. Elle délègue le travail à
  ``Cake\Utility\Text::slug()``.
* La nouvelle méthode ``ViewBuilder::addHelper()`` permet de créer des helpers en chaîne.
* Les nouvelles méthodes ``HtmlHelper::linkFromPath()`` et ``UrlHelper::urlFromPath()`` permettent
  de créer des liens et des URLs à partir des chemins de routes et offrent le support de l'IDE
  dans les fichiers de vue.

Utility
-------

* ``Hash::combine()`` accepte maintenant ``null`` pour le paramètre ``$keyPath``.
  Fournir la valeur null produira un tableau de sortie indexé numériquement.
