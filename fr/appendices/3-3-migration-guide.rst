3.3 Guide de Migration
######################

CakePHP 3.2 est une mise à jour de CakePHP 3.2 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.3.

Deprecations
============

* ``Router::mapResources()`` est dépréciée. Utilisez les scopes de routing et
  ``$routes->resources()`` à la place.
* ``Router::redirect()`` est dépréciée. Utilisez les scopes de routing et
  ``$routes->redirect()`` à la place.
* ``Router::parseNamedParams()`` est dépréciée. La rétro-compatibilité des
  paramètres nommés sera retirée dans la version 4.0.0.

Changements de Comportement
===========================

Bien que ces changements soient compatibles avec l'API, ils entraînent des
variations mineures qui peuvent avoir des effets sur votre application:

* L'encodage du format JSON par défaut pour les instances Date et DateTime est
  maintenant ISO-8601. Cela signifie que la valeur timezone contient un ``:``.
  Par exemple ``2015-11-06T00:00:00+03:00``
* ``Controller::referer()`` enlève maintenant le chemin de base de l'application
  de façon cohérente lors de la génération des URLs en local. Avant, les chaînes
  d'URLs étaient préfixées par le chemin de base alors que les tableaux d'URLs
  ne l'étaient pas.

Routing
=======

- ``Router::parse()``, ``RouteCollection::parse()`` et ``Route::parse()`` ont
  un nouvel argument ``$method``. Il est par défaut à 'GET'. Ce nouveau
  paramètre réduit le recours à l'état global, et est nécessaire pour le travail
  d'intégration de la norme PSR7.
- Quand vous construisez vos resource routes, vous pouvez maintenant définir un
  préfixe. C'est utile quand vous définissez des ressources imbriquées car vous
  pouvez créer des controllers spécialisés pour les ressources imbriquées.

Console
=======

- Les Shell tasks qui sont appelées directement à partir du CLI n'appellent plus
  la méthode ``_welcome``. Ils vont maintenant aussi avoir le paramètre
  ``requested`` défini.

Request
=======

- ``Request::is()`` et ``Request::addDetector()`` supportent maintenant des
  arguments supplémentaires dans les détecteurs. Cela permet aux détecteurs
  callables d'opérer sur des paramètres supplémentaires.

ORM
===

- Le support supplémentaire a été ajouté pour mapper des types de données
  complexes. Cela facilite le travail pour des types geo-spatiaux et les données
  qui ne peuvent pas être représentées par des chaînes dans des requêtes SQL.
  Consultez :ref:`mapping-custom-datatypes-to-sql-expressions` pour plus
  d'informations.
- Un nouveau ``JsonType`` a été ajouté. Ce nouveau type vous permet d'utiliser
  les types natifs JSON disponibles avec MySQL et Postgres. Dans les autres
  providers de bases de données, le type ``json`` mappera vers des colonnes
  ``TEXT``.
- ``Association::unique()`` a été ajoutée. Cette méthode est un proxy pour la
  méthode ``unique()`` de la table, mais permet de s'assurer que les conditions
  des associations soient appliquées.
- Les règles ``isUnique`` s'appliquent maintenant pour les conditions des
  associations.

Validation
==========

- ``Validator::requirePresence()`` accepte maintenant une liste de champs. Cela
  vous permet de définir de façon plus concise les champs qui sont nécessaires.

Debugging Functions
===================

- Les fonctions ``pr()``, ``debug()`` et ``pj()`` retournent maintenant la
  valeur résultante. Cela facilite leur utilisation quand des valeurs sont
  retournées.
