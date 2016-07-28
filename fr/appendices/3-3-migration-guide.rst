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
* ``RequestActionTrait`` a été dépréciée. Refactorez votre code pour utiliser
  :doc:`/views/cells` à la place.
* Le moteur ``Cake\\Utility\\Crypto\\Mcrypt`` a été déprécié puisque l'extension
  ``mcrypt`` est dépréciée dans PHP 7.1. Utilisez ``openssl`` et
  :php:class:`Cake\\Utility\\Crypto\\Openssl` à la place.

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
* Le ``ErrorController`` par défaut ne désactive plus les components ``Auth`` et
  ``Security``, puisqu'il n'étend plus ``AppController``. Si vous activez ces
  components avec des events, vous devrez mettre à jour votre code.

Support du Middleware PSR7 Ajouté
=================================

En même temps qu'avec la dépréciation des Filters du Dispatcher, le support pour
le middleware PSR7 a été ajouté. Middleware est une partie de la nouvelle stack
HTTP qui est un component au choix de CakePHP 3.3.0. En utilisant la nouvelle
stack HTTP, vous pouvez tirer profit des fonctionnalités comme:

* Utilisation du middleware à partir des plugins, et des libraries en-dehors de
  CakePHP.
* Amène les mêmes méthodes pour l'objet response à la fois pour les réponses que
  vous obtenez à partir de ``Http\Client`` et les réponses que votre application
  génère.
* Être capable d'augmenter les objets response émis par la gestion des erreurs
  et la délivrance des assets.

Consultez le chapitre :doc:`/controllers/middleware` et les sections
:ref:`adding-http-stack` pour plus d'informations sur la façon d'ajouter la
nouvelle stack HTTP à une application existante.

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
* L'option ``allowNullableNulls`` a été ajoutée à la règle ``existsIn``. Cette
  option permet aux règles de passer quand des colonnes sont nulles.

Support pour la Pagination Multiple Ajouté
==========================================

Vous pouvez maintenant paginer plusieurs requêtes dans une action de
controller/template de vue. Consultez la section
:ref:`paginating-multiple-queries` pour plus de détails.

Shell Cache Ajouté
==================

Pour vous aider à mieux gérer les données mises en cache dans un environnement
CLI, une commande shell a été ajoutée qui montre les méthodes pour effacer les
données mises en cache::

    // Efface une config mise en cache
    bin/cake cache clear <configname>

    // Efface toutes les configs mises en cache
    bin/cake cache clear_all

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

StringTemplate
==============

``StringTemplate::format()`` lève maintenant une exception au lieu de retourner
``null`` quand un template demandé n'est pas trouvé.

Autres Améliorations
====================

* ``Collection::transpose()`` a été ajoutée. Cette méthode vous permet de
  transposer les lignes et colonnes d'une matrice avec des colonnes de longueurs
  égales.
* Le ``ErrorController`` par défaut charge maintenant
  ``RequestHandlerComponent`` pour activer l'en-tête ``Accept`` selon le type de
  contenu pour les pages d'erreur.

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
