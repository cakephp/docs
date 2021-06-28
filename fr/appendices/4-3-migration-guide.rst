Guide de migration vers la version 4.3
######################################

CakePHP 4.3 est une mise à jour de l'API compatible à partir de la version 4.0.
Cette page présente les dépréciations et fonctionnalités ajoutées dans la
version 4.3.

Mettre à jour vers la version 4.3.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.3.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3@beta"

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
dépéréciations chemin par chemin. Cf. :ref:`deprecation-warnings` pour plus
d'informations.

Log
---

- Dans ``FileLog`` l'option de configuration ``dateFormat`` a été déplacée vers
  ``DefaultFormatter``.
- Dans ``ConsoleLog`` l'option de configuration ``dateFormat`` a été déplacée
  vers ``DefaultFormatter``.
- Dans ``SyslogLog`` l'option de configuration ``format`` a été déplacée vers
  ``LegacySyslogFormatter``.
  Par défaut, c'est maintenant ``DefaultFormatter`` qui est utilisé.

TestSuite
---------

- ``TestFixture::$fields`` et ``TestFixture::$import`` sont dépréciés. Il est
  conseillé de convertir votre application vers le `nouveau système de fixture <./fixture-upgrade>`.

Changements dans les Behaviors
==============================

Bien que les changements qui suivent ne changent la signature d'aucune méthode,
ils en changent la sémantique ou le comportement.

Command
-------

- ``cake i18n extract`` n'a plus d'option ``--relative-paths``. Cette option est
  maintenant activée par défaut.

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

Routing
-------

- ``RouteBuilder::resources()`` génère maintenant des routes qui utilisent des
  placeholders entre accolades.

Validation
----------

- ``Validator::setProvider()`` lève maintenant une exception quand un nom de
  provider fourni n'est ni un objet ni une chaîne de caractères. Auparavant cela
  n'était pas une erreur, mais le provider ne fonctionnait pas.

Changements entraînant une rupture
==================================

Derrière l'API, certains changements sont nécessaires pour avancer. Ils
n'affectent généralement pas les tests.

Log
---

- Les configurations de ``BaseLog::_getFormattedDate()`` et ``dateFormat`` ont
  été supprimées puisque la logique de formatage du message a été déplacée vers
  les formatters de logs.

Nouvelles fonctionnalités
=========================

Controller
----------

- ``Controller::middleware()`` a été ajoutée. Elle vous permet de définir un
  middleware pour un seul contrôleur. Reportez-vous à :ref:`controller-middleware`
  pour plus d'informations.

Database
--------

- Les types de mappage de bases de données peuvent maintenant implémenter
  ``Cake\Database\Type\ColumnSchemaAwareInterface`` pour spécifier la génération
  de colonne SQL et la réflexivité du schéma de colonne. Cela permet au types
  personnalisés de prendre en charge des colonnes non standard.
- Les queries loguées utilisent maintenant ``TRUE`` et ``FALSE`` pour les
  pilotes postgres, sqlite et mysql. Cela facilite la copie de queries et leur
  exécution dans un prompt interactif.
- Le ``DatetimeType`` peut maintenant convertir les données de la requête du
  fuseau horaire de l'utilisateur vers le fuseau horaire de l'application.
  Reportez-vous à :ref:`converting-request-data-from-user-timezone` pour plus
  d'informations.

Http
----

- Le ``CspMiddleware`` définit maintenant les attributs de la requête
  ``cspScriptNonce`` et ``cspStyleNonce`` qui rationalise l'adoption de
  content-security-policy strict.

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

TestSuite
---------

- ``IntegrationTestTrait::enableCsrfToken()`` permet maintenant l'utilisation de
  noms de clés personnalisés pour les cookies/sessions CSRF.
- Un nouveau système de fixture a été introduit. Ce système de fixture sépare le
  schéma et les données, ce qui vous permet de réutiliser vos migrations
  existantes pour définir un schéma de test. Le guide `./fixture-upgrade`
  explique comment mettre à niveau.

View
----

- ``HtmlHelper::script()`` et ``HtmlHelper::css()`` ajoutent maintenant
  l'attribut ``nonce`` pour générer des balises quand les attributs de requête
  ``cspScriptNonce`` et ``cspStyleNonce`` sont présents.
