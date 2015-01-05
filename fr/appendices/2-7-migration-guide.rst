2.7 Guide de Migration
######################

CakePHP 2.7 est une mise à jour complète à partir de l'API de 2.6. Cette page
souligne les changements et améliorations faits dans 2.7.

Core
====

Configure
---------

- :php:meth:`Configure::consume()` a été ajoutée pour lire et supprimer dans
  Configure en une seule étape.


Datasource
==========

CakeSession
-----------
- :php:meth:`CakeSession::consume()` a été ajoutée pour lire et supprimer dans
  Session en une seule étape.
- L'argument `$renew` a été ajouté à :php:meth:`CakeSession::clear()` pour
  permettre de vider la session sans forcer un nouvel id et renouveler la
  session. Il est par défaut à ``true``.


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


View
====

SessionHelper
-------------
- :php:meth:`SessionHelper::consume()` a été ajoutée pour lire et supprimer
  dans Session en une seule étape.


TestSuite
=========

ControllerTestCase
------------------
- :php:meth:`ControllerTestCase::testAction()` supporte maintenant un tableau
  pour une URL.
