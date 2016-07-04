3.3 Guide de Migration
######################

CakePHP 3.3 est une mise à jour de CakePHP 3.2 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.3.

Deprecations
============

* ``Router::mapResources()`` est dépréciée. Utilisez les scopes de routing et
  ``$routes->resources()`` à la place.
* ``Router::redirect()`` est dépréciée. Utilisez les scopes de routing et
  ``$routes->redirect()`` à la place.
* ``Router::parseNamedParams()`` est dépréciée. La rétro-compatibilité des
  paramètres nommés sera retirée dans la version 4.0.0.
* ``Cake\Http\Response`` a vu ses méthodes suivantes dépréciées car elles se
  chevauchent avec les méthodes de l'interface PSR7:

  * ``statusCode()`` utilisez ``getStatusCode()`` à la place.
  * ``encoding()`` utilisez ``getEncoding()`` à la place.
  * ``header()`` utilisez ``getHeaderLine()`` à la place.
  * ``cookie()`` utilisez ``getCookie()`` à la place.
  * ``version()`` utilisez ``getProtocolVersion()`` à la place.
* Les Filtres de Dispatcher sont maintenant dépréciés. Utilisez
  :doc:`/controllers/middleware` à la place.

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

PSR7 Middleware Support Added
=============================

In tandem with the deprecation of Dispatcher Filters, support for PSR7
middleware has been added. Middleware is part of the new HTTP stack that is an
opt-in component of CakePHP 3.3.0. By using the new HTTP stack, you can take
advantage of features like:

* Using middleware from plugins, and libraries outside of CakePHP.
* Leverage the same response object methods in both the responses you get from
  ``Http\Client`` and the responses your application generates.
* Be able to augment the response objects emitted by error handling and asset
  delivery.

See the :doc:`/controllers/middleware` chapter and :ref:`adding-http-stack`
sections for more information and how to add the new HTTP stack to an existing
application.

Http Client est maintenant compatible avec PSR7
===============================================

``Cake\Network\Http\Client`` a été dpélacée vers ``Cake\Http\Client``. Ses
objet request et response implémentent maintenant les
`interfaces PSR7 <http://www.php-fig.org/psr/psr-7/>`__. Plusieurs méthodes de
``Cake\Http\Client\Response`` sont maintenant dépréciées, regardez plus haut
pour plus d'informations.

Améliorations de l'ORM
======================

* Le support supplémentaire a été ajouté pour mapper des types de données
  complexes. Cela facilite le travail pour des types geo-spatiaux et les données
  qui ne peuvent pas être représentées par des chaînes dans des requêtes SQL.
  Consultez :ref:`mapping-custom-datatypes-to-sql-expressions` pour plus
  d'informations.
* Un nouveau ``JsonType`` a été ajouté. Ce nouveau type vous permet d'utiliser
  les types natifs JSON disponibles avec MySQL et Postgres. Dans les autres
  providers de bases de données, le type ``json`` mappera vers des colonnes
  ``TEXT``.
* ``Association::unique()`` a été ajoutée. Cette méthode est un proxy pour la
  méthode ``unique()`` de la table, mais permet de s'assurer que les conditions
  des associations soient appliquées.
* Les règles ``isUnique`` s'appliquent maintenant pour les conditions des
  associations.
* Quand les entities sont converties en JSON, les objets associés ne sont plus
  d'abord convertis en tableau avec ``toArray()``. A la place, la méthode
  ``jsonSerialize()`` sera appelée sur toutes les entities associées. Ceci vous
  donne plus de flexibilité et de contrôle sur les propriétés à exposer dans les
  représentations JSON de vos entities.
* ``Table::newEntity()`` et ``Table::patchEntity()`` vont maintenant lever une
  exception quand une association inconnue est dans la clé 'associated'.
* ``RulesChecker::validCount()`` a été ajoutée. Cette nouvelle méthode permet
  d'ajouter des règles qui vérifient le nombre d'enregistrements associés d'une
  entity.
* L'option ``partialNullsPass`` a été ajoutée à la règle ``existsIn``. Cette
  option permet aux règles de passer quand des colonnes sont nulles.

FormHelper
==========

* FormHelper va maintenant automatiquement définir la valeur par défaut des
  champs avec la valeur par défaut définie dans vos colonnes de base de données.
  Vous pouvez désactiver ce comportement en définissant l'option
  ``schemaDefault`` à false.

Validation
==========

* ``Validator::requirePresence()`` accepte maintenant une liste de champs. Cela
  vous permet de définir de façon plus concise les champs qui sont nécessaires.
* ``Validator::requirePresence()``, ``Validator::allowEmpty()`` et
  ``Validator::notEmpty()`` acceptent maintenant une liste de champs. Ceci vous
  permet de définir de façon plus concise les champs qui sont requis.

Autres Améliorations
====================

* ``Collection::transpose()`` a été ajoutée. Cette méthode vous permet de
  transposer les lignes et colonnes d'une matrice avec des colonnes de longueurs
  égales.

Routing
-------

* ``Router::parse()``, ``RouteCollection::parse()`` et ``Route::parse()`` ont
  un nouvel argument ``$method``. Il est par défaut à 'GET'. Ce nouveau
  paramètre réduit le recours à l'état global, et est nécessaire pour le travail
  d'intégration de la norme PSR7.
* Quand vous construisez vos resource routes, vous pouvez maintenant définir un
  préfixe. C'est utile quand vous définissez des ressources imbriquées car vous
  pouvez créer des controllers spécialisés pour les ressources imbriquées.
* Les Filtres de Dispatcher sont maintenant dépréciés. Utilisez
  :doc:`/controllers/middleware` à la place.

Console
-------

* Les Shell tasks qui sont appelées directement à partir du CLI n'appellent plus
  la méthode ``_welcome``. Ils vont maintenant aussi avoir le paramètre
  ``requested`` défini.
* ``Shell::err()`` va maintenant appliquer le style 'error' au texte. Le style
  par défaut est le texte rouge.

Request
-------

* ``Request::is()`` et ``Request::addDetector()`` supportent maintenant des
  arguments supplémentaires dans les détecteurs. Cela permet aux détecteurs
  callables d'opérer sur des paramètres supplémentaires.

Debugging Functions
-------------------

* Les fonctions ``pr()``, ``debug()`` et ``pj()`` retournent maintenant la
  valeur résultante. Cela facilite leur utilisation quand des valeurs sont
  retournées.

Cache Shell Ajouté
==================

Pour vous aider à mieux gérer les données mises en cache dans un environnement
CLI, une commande shell a été ajoutée qui montre les méthodes pour effacer
les données mises en cache::

    // Efface une config mise en cache
    bin/cake cache clear <configname>

    // Efface toutes les configs mises en cache
    bin/cake cache clear_all
