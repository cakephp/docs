Guide de migration vers la version 4.4
######################################

CakePHP 4.4 est une mise à jour de l'API compatible à partir de la version 4.0.
Cette page présente les dépréciations et fonctionnalités ajoutées dans la
version 4.4.

Mettre à jour vers la version 4.3.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.4.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.4@RC"

.. note::
    CakePHP 4.4 nécessite PHP 7.4 ou une version supérieure.

Dépréciations
=============

4.4 introduit quelques dépréciations. Toutes ces fonctionnalités continueront
d'exister dans les versions 4.x mais seront supprimées dans la version 5.0. Vous
pouvez utiliser l':ref:`outil de mise à niveau <upgrade-tool-use>` pour
automatiser la mise à jour des fonctionnalités obsolètes::

    bin/cake upgrade rector --rules cakephp44 <path/to/app/src>

.. note::
    Cela ne met à jour que les changements de CakePHP 4.4. Assurez-vous
    d'appliquer d'abord les modifications de CakePHP 4.3.

Une nouvelle option de configuration a été ajoutée pour désactiver les
dépéréciations chemin par chemin. Cf. :ref:`deprecation-warnings` pour plus
d'informations.

Changements de comportements
============================

Bien que les changements qui suivent ne changent la signature d'aucune méthode,
ils en changent la sémantique ou le comportement.
 
* ``Router::parseRequest()`` lève à présent une ``BadRequestException`` au lieu
  d'une ``InvalidArgumentException`` lorsque le client utilise une méthode HTTP
  invalide.

Changements entraînant une rupture
==================================

Derrière l'API, certains changements sont nécessaires pour avancer. Ils
n'affectent généralement pas les tests.

Global
------

* La version minimum requise est montée à PHP 7.4.

Nouvelles fonctionnalités
=========================

Database
--------

* Le pilote ``SQLite`` supporte maintenant les base de données partagées en
  mémoire dans PHP8.1+.
* ``Query::expr()`` a été ajoutée comme alternative à ``Query::newExpr()``.
* Le builder ``QueryExpression::case()`` supporte maintenant la détection de
  type à partir d'expressions passées à ``then()`` et ``else()`` qui
  implémentent ``\Cake\Database\TypedResultInterface``.

Http
----

* ``BaseApplication::handle()`` ajoute désormais tout le temps la ``$request``
  dans le conteneur de service.
* ``HttpsEnforcerMiddleware`` a désormais une option ``hsts`` qui permet de
  configure le header ``Strict-Transport-Security``.
