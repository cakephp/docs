2.7 Guide de Migration
######################

CakePHP 2.7 est une mise à jour complète à partir de l'API de 2.6. Cette page
souligne les changements et améliorations faits dans 2.7.

Requirements
============

La version de PHP requise pour CakePHP 2.7 est maintenant la version 5.3.0.

Console
=======

- Les shells de Plugin qui ont le même nom que leur plugin peuvent maintenant
  être appelés sans le préfixe de plugin. Par exemple
  ``Console/cake MyPlugin.my_plugin`` peut maintenant être appelé avec
  ``Console/cake my_plugin``.
- ``Shell::param()`` was backported from 3.0 into 2.7. This method provides
  a notice error free way to read CLI options.

Core
====

Configure
---------

- :php:meth:`Configure::consume()` a été ajoutée pour lire et supprimer dans
  Configure en une seule étape.

Datasource
==========

- Les sources de données SQL vont maintenant remplacer ``''`` et ``null`` en
  ``''`` quand les colonnes ne sont pas nulles et que les lignes sont en train
  d'être créées ou mises à jour.

CakeSession
-----------

- :php:meth:`CakeSession::consume()` a été ajoutée pour lire et supprimer dans
  Session en une seule étape.
- L'argument `$renew` a été ajouté à :php:meth:`CakeSession::clear()` pour
  permettre de vider la session sans forcer un nouvel id et renouveler la
  session. Il est par défaut à ``true``.

Model
=====

TreeBehavior
------------

- La nouvelle configuration `level` est maintenant disponible. Vous pouvez
  l'utiliser pour spécifier un nom de champ dans lequel la profondeur des
  noeuds de l'arbre sera stocké.
- La nouvelle méthode ``TreeBehavior::getLevel()`` a été ajoutée qui attrape
  le niveau de profondeur d'un noeud.
- Le formatage de ``TreeBehavior::generateTreeList()`` a été extrait dans une
  méthode à part entière ``TreeBehavior::formatTreeList()``.

Network
=======

CakeEmail
---------

- CakeEmail va maintenant utiliser la config 'default' lors de lacréation des
  instances qui ne spécifient pas une configuration à utiliser. Par exemple
  ``$email = new CakeEmail();`` va maintenant utiliser la config 'default'.

Utility
=======

CakeText
--------

La classe ``String`` a été renommée en ``CakeText``. Ceci résoud
certains conflits de compatibilité avec HHVM et aussi avec PHP7+. Il y a aussi
une classe ``String`` fournie pour des raisons de compatibilité.

Validation
----------

- ``Validation::notEmpty()`` a été renommée en ``Validation::notBlank()``.
  Ceci a pour objectif d'éviter la confusion autour de la fonction PHP
  `notEmpty()` et que la règle de validation accepte ``0`` en input valide.

Controller
==========

SessionComponent
----------------

- :php:meth:`SessionComponent::consume()` a été ajoutée pour lire et supprimer
  dans Session en une seule étape.
- :php:meth:`SessionComponent::setFlash()` a été dépréciée. Vous devez utiliser
  :php:class:`FlashComponent` à la place.

RequestHandlerComponent
-----------------------

- L'en-tête Accept ``text/plain`` n'est plus automatiquement relié à la
  response de type ``csv``. C'est un portage de la version 3.0.

View
====

SessionHelper
-------------

- :php:meth:`SessionHelper::consume()` a été ajoutée pour lire et supprimer
  dans Session en une seule étape.
- :php:meth:`SessionHelper::flash()` a été dépréciée. Vous devez utiliser
  :php:class:`FlashHelper` à la place.

TestSuite
=========

ControllerTestCase
------------------

- :php:meth:`ControllerTestCase::testAction()` supporte maintenant un tableau
  pour une URL.
