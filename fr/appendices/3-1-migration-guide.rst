3.1 Guide de migration
###################

CakePHP 3.1 est une mise à jour de CakePHP 3.0 dont la compatibilité
API est complète. Cette page souligne les changements et améliorations
faits dans 3.1.

Routing
=======

La classe de route par défaut a été changée en ``DashedRoute`` dans le dépôt
``cakephp/app``. Votre base de code actuelle n'est pas affectée par ceci mais
il est recommandé d'utiliser cette classe de route à partir de maintenant.

Console
=======

- ``Shell::dispatchShell()`` n'affiche plus le message d'accueil à partir du
  shell dispatché.

Controller
==========

FlashComponent
--------------

- ``FlashComponent`` empile maintenant les messages enregistrés avec les
  méthodes ``set()`` et ``__call()``. Cela signifie que la structure des
  données stockées dans la Session pour les messages Flash a changé.

View
====

- Vous pouvez maintenant définir ``_serialized`` à ``true`` pour ``JsonView``
  et ``XmlView`` pour sérialiser toutes les variables de vue au lieu de les
  spécifier explicitement.

Helper
======

SessionHelper
-------------

- ``SessionHelper`` a été dépréciée. Vous pouvez directement utiliser
``$this->request->session()``.

FlashHelper
-----------

- ``FlashHelper`` peut maintenant rendre plusieurs messages si plusieurs
  messages ont été enregistrés avec le ``FlashComponent``. Chaque message
  sera rendu dans son propre élément. Les messages seront rendus dans l'ordre
  dans lequel ils ont été enregistrés.
