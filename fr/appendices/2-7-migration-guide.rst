2.7 Guide de Migration
######################

CakePHP 2.7 est une mise à jour complète à partir de l'API de 2.6. Cette page
souligne les changements et améliorations faits dans 2.7.

Console
=======

- Les shells de Plugin qui ont le même nom que leur plugin peuvent maintenant
  être appelés sans le préfixe de plugin. Par exemple
  ``Console/cake MyPlugin.my_plugin`` peut maintenant être appelé avec
  ``Console/cake my_plugin``.

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
- La nouvelle méthode ``TreeBehavior::getLevel()`` a été ajoutée qui attrape
le niveau de profondeur d'un noeud.

Utility
=======

CakeText
--------
La classe ``String`` a été renommée en ``CakeText``. Ceci résoud
certains conflits de compatibilité avec HHVM et aussi avec PHP7+. Il y a aussi
une classe ``String`` fournie pour des raisons de compatibilité.


Controller
==========

SessionComponent
----------------

- :php:meth:`SessionComponent::consume()` a été ajoutée pour lire et supprimer
  dans Session en une seule étape.
- :php:meth:`SessionComponent::setFlash()` has been deprecated. You should use
  :php:class:`FlashComponent` instead.

View
====

SessionHelper
-------------
- :php:meth:`SessionHelper::consume()` a été ajoutée pour lire et supprimer
  dans Session en une seule étape.
- :php:meth:`SessionHelper::flash()` has been deprecated. You should use
  :php:class:`FlashHelper` instead.

TestSuite
=========

ControllerTestCase
------------------
- :php:meth:`ControllerTestCase::testAction()` supporte maintenant un tableau
  pour une URL.
