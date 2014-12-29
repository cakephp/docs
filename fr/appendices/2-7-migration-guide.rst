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
