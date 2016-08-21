3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.


I18n
====

* Vous pouvez maintenant personnaliser le comportement du loader de messages
  de fallback. Reportez-vous à :ref:`creating-generic-translators` pour plus
  d'information.

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` utilise maintenant une ellipse HTML au lieu de
  '...' dans les templates par défaut.
