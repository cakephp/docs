Guide de migration vers la version 4.3
######################################

CakePHP 4.3 est une mise à jour de l'API compatible à partir de la version 4.0.
Cette page présente les dépréciations et fonctionnalités ajoutées dans la
version 4.3.

Mettre à jour vers la version 4.3.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.3.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3"

Dépréciations
=============

4.3 introduit quelques dépréciations. Toutes ces fonctionnalités continueront
d'exister dans les versions 4.x mais seront supprimées dans la version 5.0. Vous
pouvez utiliser l':ref:`outil de mise à niveau <upgrade-tool-use>` pour
automatiser la mise à jour des fonctionnalités obsolètes::

    bin/cake upgrade rector --rules cakephp43 <path/to/app/src>

.. note::
    Cela ne met à jour que les changements de CakePHP 4.3. Assurez-vous
    d'appliquer d'abord les modifications de CakePHP 4.2.

Une nouvelle option de configuration a été ajoutée pour désactiver les
dépréciations chemin par chemin. Cf. :ref:`deprecation-warnings` pour plus
d'informations.

Connection
----------

- ``Connection::supportsDynamicConstraints()`` a été dépréciée car les fixtures
  ne tentent plus de supprimer ou créer des contraintes dynamiquement.

Controller
----------

- Le callback de l'événement ``Controller.shutdown`` des controllers a été
  renommé de ``shutdown`` à ``afterFilter`` pour correspondre à celui du
  controller. Cela rend les callbacks plus cohérents.

Base De Données
---------------

- L'utilisation de classes de date et heure mutables avec ``DateTimeType`` et
  les autres classes de types relatifs aux heures est déprécié.
  De ce fait, les méthodes ``DateTimeType::useMutable()``,
  ``DateTimeType::useImmutable()`` et les méthodes similaires dans d'autres
  classes de types sont dépréciées.
- ``DriverInterface::supportsQuoting()`` et
  ``DriverInterface::supportSavepoints()`` sont maintenant dépréciées au profit
  de ``DriverInterface::supports()`` qui accepte des constantes de feature
  définies dans ``DriverInterface``.
- ``DriverInterface::supportsDynamicConstraints()`` a été dépréciée dès lors que
  les fixtures ne tentent plus de supprimer ou créer des contraintes
  dynamiquement.

I18n
----
- Les classes de date et heure ``Time`` et ``Date`` sont dépréciées.
  À la place, utilisez leurs alternatives immutables ``FrozenTime`` et
  ``FrozenDate``.

Log
---

- Dans ``FileLog`` l'option de configuration ``dateFormat`` a été déplacée vers
  ``DefaultFormatter``.
- Dans ``ConsoleLog`` l'option de configuration ``dateFormat`` a été déplacée
  vers ``DefaultFormatter``.
- Dans ``SyslogLog`` l'option de configuration ``format`` a été déplacée vers
  ``LegacySyslogFormatter``.
  Par défaut, c'est maintenant ``DefaultFormatter`` qui est utilisé.

Middleware
----------

- Les middlewares "double pass", c'est-à-dire les classes avec une méthode
  ``__invoke($request, $response, $next)``, sont dépréciés. À la place, utilisez
  ``Closure`` avec la signature ``function($request, $handler)`` o des classes
  qui implémentent ``Psr\Http\Server\MiddlewareInterface``.

Network
-------

- ``Socket::$connected`` est déprécié. Utilisez ``isConnected()`` à la place.
- ``Socket::$description`` est déprécié.
- ``Socket::$encrypted`` est déprécié. Utilisez ``isEncrypted()`` à la place.
- ``Socket::$lastError`` est déprécié. Utilisez ``lastError()`` à la place.

ORM
---

- ``ModelAwareTrait::loadModel()`` est dépréciée. Utilisez la nouvelle méthode
  ``LocatorAwareTrait::fetchTable()`` à la place. Par exemple, dans les
  controllers vous pouvez faire ``$this->fetchTable()`` pour obtenir l'instance
  de la table par défaut, ou utiliser ``$this->fetchTable('Foos')`` pour une
  table autre que celle par défaut. Vous pouvez définir la propriété
  ``LocatorAwareTrait::$defaultTable`` pour spécifier l'alias de la table par
  défaut pour ``fetchTable()``.
- L'usage de requêtes pour intercepter toutes les méthodes de
  ``ResultSetInterface`` (y compris ```CollectionInterface```), forcer la
  récupération des résultats et appeler la méthode sous-jacente sur ces
  résultats est maintenant déprécié. Un exemple de cet usage est
  ``$query->combine('id', 'title');``. Ceci doit être remplacé par
  ``$query->all()->combine('id', 'title');``.
- Passer un object validator à ``Table::save()`` via l'option ``validate`` est
  déprécié. Définissez le validator dans la classe de table ou utilisez
  ``setValidator()`` à la place.
- ``Association::setName()`` est dépréciée. Les noms d'associations doivent être
  définis en même temps que l'association.
- ``QueryExpression::addCase()`` est dépréciée. Utilisez ``case()`` à la place.
  Les syntaxes ``['value' => 'literal']`` et ``['column' => 'identifier']`` ne
  sont pas supportées dans le nouveau case builder. L'insertion de SQL brut ou
  d'identifiants nécessite d'utiliser des expressions explicitement. Vous pouvez
  définir la propriété ``LocatorAwareTrait::$defaultTable`` pour spécifier
  l'alias de la table par défaut.

Routing
-------

- Les placeholders de routes préfixés par des doubles points tels que
  ``:controller`` sont dépréciés. Remplacez-les par des placeholders entre
  accolades tels que ``{controller}``.

TestSuite
---------

- ``TestFixture::$fields`` et ``TestFixture::$import`` sont dépréciés. Il est
  conseillé de convertir votre application vers le
  :doc:`nouveau système de fixture <./fixture-upgrade>`.
- ``TestCase::$dropTables`` est déprécié. La suppression de tables pendant
  l'exécution d'un test est incompatible avec les nouvelles fixtures basées sur
  le dump d'une migration/schéma. La fonctionnalité sera supprimée dans 5.0.

View
----

- Les options non associatives des méthodes de FormHelper (par exemple
  ``['disabled']``) sont maintenant dépréciées.
- Le second argument ``$merge`` de ``ViewBuilder::setHelpers()`` a été déprécié
  au profit de la méthode dédiée ``ViewBuilder::addHelpers()`` qui sépare
  proprement l'ajout et le remplacement de helpers.

Changements de comportements
============================

Bien que les changements qui suivent ne changent la signature d'aucune méthode,
ils en changent la sémantique ou le comportement.

Collection
----------

- Le paramètre ``$preserveKeys`` a été renommé en ``$keepKeys`` avec la même
  implémentation.

Command
-------

- ``cake i18n extract`` n'a plus d'option ``--relative-paths``. Cette option est
  maintenant activée par défaut.

Core
----

- ``Configure::load()`` soulèvera désormais une exception en cas d'utilisation
  d'un moteur de configuration invalide.

Database
--------

- ``ComparisonExpression `` n'entoure plus le SQL de ``IdentifierExpression``
  entre des parenthèses. Cela affecte ``Query::where()`` et tous les autres
  endroits où une ``ComparisonExpression`` est générée.
- L'implémentation SQLite de ``listTables()`` renvoie maintenant les tables
  **et** les vues. Ce changement aligne SQLite avec les autres dialectes de
  bases de données.

Datasource
----------

- Les noms des paramètres ``$alias`` et ``$source`` de
  ``ConnectionManager::alias()`` ont été modifiés pour correspondre à ce qu'ils
  sont. Cela affecte uniquement la documentation et les paramètres nommés.

Http
----

- ``Http\Client`` utilise maintenant ``ini_get('user_agent')`` avec 'CakePHP' en
  tant que valeur de repli pour son user-agent.

ORM
---

- ``Entity::isEmpty()`` et ``Entity::hasValue()`` ont été alignées pour traiter
  '0' comme une valeur non-empty.
  Cela aligne le behavior avec la documentation et l'intention originelle.
- Les erreurs de validation d'entity de ``TranslateBehavior`` sont maintenant
  définies dans le chemin ``_translations.{lang}`` au lieu de ``{lang}``. Cela
  normalise le chemin des erruers d'entities pour les données de la requête. Si
  vous avez des formulaires qui modifient plusieurs tranductions à la fois, vous
  aurez vraisemblablement besoin de mettre à jour la façon dont sont rendues les
  erreurs de validation.
- Les types spécifiés dans des expressions de fonctions ont maintenant la
  préséance sur les ensembles de types par défaut pour les colonnes, quand des
  colonnes sont sélectionnées. Par exemple, pour utiliser
  ``$query->select(['id' => $query->func()->min('id')])`` la valeur pour `id`
  dans l'entity récupérée sera un `float` au lieu d'un `integer`.

Routing
-------

- ``Router::connect()``, ``Router::prefix()``, ``Router::plugin()`` et
  ``Router::scope()`` sont dépréciées. Utilisez les méthodes non statiques
  correspondantes de ``RouteBuilder`` à la place.
- ``RouteBuilder::resources()`` génère maintenant des routes qui utilisent des
  placeholders entre accolades.

TestSuite
---------

- ``TestCase::deprecated()`` vérifie (*asserts*) maintenant qu'au moins un
  avertissement de dépréciation ait été déclenché par le callback.

Validation
----------

- ``Validator::setProvider()`` lève maintenant une exception quand un nom de
  provider fourni n'est ni un objet ni une chaîne de caractères. Auparavant cela
  n'était pas une erreur, mais le provider ne fonctionnait pas.

View
----

- Le paramètre ``$vars`` de ``ViewBuilder::build()`` est déprécié. Utilisez
  ``setVar()`` à la place.
- ``HtmlHelper::script()`` et ``HtmlHelper::css()`` échappent désormais les URLs
  absolues qui incluent un scheme.

Changements entraînant une rupture
==================================

Derrière l'API, certains changements sont nécessaires pour avancer. Ils
n'affectent généralement pas les tests.

Log
---

- Les configurations de ``BaseLog::_getFormattedDate()`` et ``dateFormat`` ont
  été supprimées puisque la logique de formatage du message a été déplacée vers
  les formatters de logs.

View
----
- ``TimeHelper::fromString()`` renvoie maintenant une instance de ``FrozenTime``
  au lieu de ``Time``.

Nouvelles fonctionnalités
=========================

Controller
----------

- ``Controller::middleware()`` a été ajoutée. Elle vous permet de définir un
  middleware pour un seul contrôleur. Reportez-vous à :ref:`controller-middleware`
  pour plus d'informations.
- Les controllers supportent maintenant des paramètres d'actions avec des types
  déclarés ``float``, ``int``, ``bool`` ou ``array``. Les booléens passés
  doivent être soit ``0`` soit ``1``.

Core
----

- ``deprecationWarning()`` n'émet plus de notices en doublon. Au lieu de cela,
  seule la permière instance de dépréciation sera affichée. Cela améliore la
  lisibilité de la sortie de test, et le bruit visuel dans un contexte HTML.
  Vous pouvez restaurer la sortie de notices en doublon en définissant
  ``Error.allowDuplicateDeprecations`` à ``true`` dans votre ``app_local.php``.
- La dépendance de CakePHP envers ``league/container`` a été mise à niveau à
  ``^4.1.1``. Le conteneur DI étant marqué comme expérimental, cette mise à
  niveau peut nécessiter que vous mettiez à niveau les définitions de vos
  service providers.

Database
--------

- Les types de mappage de bases de données peuvent maintenant implémenter
  ``Cake\Database\Type\ColumnSchemaAwareInterface`` pour spécifier la génération
  de colonne SQL et la réflexivité du schéma de colonne. Cela permet au types
  personnalisés de prendre en charge des colonnes non standard.
- Les queries loguées utilisent maintenant ``TRUE`` et ``FALSE`` pour les
  pilotes postgres, sqlite et mysql. Cela facilite la copie de queries et leur
  exécution dans un prompt interactif.
- Le ``DateTimeType`` peut maintenant convertir les données de la requête du
  fuseau horaire de l'utilisateur vers le fuseau horaire de l'application.
  Reportez-vous à :ref:`converting-request-data-from-user-timezone` pour plus
  d'informations.
- Ajout de ``DriverInterface::supports()`` qui consolide toutes les
  vérifications de feature en une seule fonction. Les pilotes peuvent supporter
  les nommages personnalisés de feature ou n'importe quelle constante de
  feature:

  * ``FEATURE_CTE``
  * ``FEATURE_JSON``
  * ``FEATURE_QUOTE``
  * ``FEATURE_SAVEPOINT``
  * ``FEATURE_WINDOW``

- Ajout de ``DriverInterface::inTransaction()`` qui reflète le statut renvoyé
  par ``PDO::inTranaction()``.
- Ajout d'un builder fluide pour les instructions ``CASE, WHEN, THEN``.
- La méthode ``listTablesWithoutViews()`` a été ajoutée à ``SchemaCollection``
  et aux dialectes des pilotes. Elle renvoie la liste des tables en excluant les
  vues. Ceci est principalement utilisé pour tronquer les tables dans les tests.

Form
----

* ``Form::execute()`` now accepts an ``$options`` parameter. This parameter can
  be used to choose which validator is applied or disable validation.
* ``Form::validate()`` now accepts a ``$validator`` parameter which chooses the
  validation set to be applied.

Http
----

- Le ``CspMiddleware`` définit maintenant les attributs de la requête
  ``cspScriptNonce`` et ``cspStyleNonce`` qui rationalise l'adoption de
  content-security-policy strict.
- ``Client::addMockResponse()`` et ``clearMockResponses()`` ont été ajoutées.

Log
---

- Les moteurs de log utilisent maintenant des formatters pour formater le texte
  du message avant de l'écrire.
  Cela peut être configuré avec l'option de configuration ``formatter``.
  Consultez la section `logging-formatters` pour plus de détails.
- ``JsonFormatter`` a été ajouté et peut être défini comme option ``formatter``
  pour n'importe quel moteur de log.

ORM
---

- Les queries qui font appel à des associations HasMany et BelongsToMany par
  ``contain()`` propagent le statut de cast du résultat. Cela assure que les
  résultats de toutes les associations sont soit castés avec des objets de types
  de mappage, soit pas du tout.
- ``Table`` inclut maintenant ``label`` dans la liste des champs qui peuvent
  candidater comme champs par défaut dans ``displayField``.
- ``Query::whereNotInListOrNull()`` et ``QueryExpression::notInOrNull()`` ont
  été ajoutés pour les colonnes nullable puisque ``null != value`` est toujours
  false et le test ``NOT IN`` échoue toujours quand la colonne est null.
- ``LocatorAwareTrait::fetchTable()`` a été ajoutée. Elle vous permet d'utiliser
  ``$this->fetchTable()`` pour obtenir une instance de table depuis les classes
  qui utilisent ce trait, telles que les controllers, les commands, mailers et
  cells.

TestSuite
---------

- ``IntegrationTestTrait::enableCsrfToken()`` permet maintenant l'utilisation de
  noms de clés personnalisés pour les cookies/sessions CSRF.
- ``HttpClientTrait`` a été ajouté pour faciliter l'écriture de mocks HTTP.
  Cf. :ref:`httpclient-testing` pour plus d'information.
- Un nouveau système de fixture a été introduit. Ce système de fixture sépare le
  schéma et les données, ce qui vous permet de réutiliser vos migrations
  existantes pour définir un schéma de test. Le guide :doc:`./fixture-upgrade`
  explique comment mettre à niveau.

View
----

- ``HtmlHelper::script()`` et ``HtmlHelper::css()`` ajoutent maintenant
  l'attribut ``nonce`` pour générer des balises quand les attributs de requête
  ``cspScriptNonce`` et ``cspStyleNonce`` sont présents.
- ``FormHelper::control()`` complète maintenant les attributs ``aria-invalid``,
  ``aria-required`` et ``aria-describedby``  à partir des métadonnées depuis le
  validator. L'attribut ``aria-label`` sera défini si vous désactivez l'élement
  automatique label et fournissez un placeholder.
- ``ViewBuilder::addHelpers()`` a été ajoutée pour séparer proprement les
  opérations d'ajout et de redéfinition de helpers.
