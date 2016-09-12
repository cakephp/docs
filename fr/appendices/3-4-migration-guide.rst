3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.

Deprecations
============

* The public properties on ``Cake\Event\Event`` are deprecated, new methods have
  been added to read/write the relevant properties.

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may effect your application:

* ORM\Query results will not typecast aliased columns based on the original
  columns type. For example if you alias ``created`` to ``created_time`` you
  will now get a ``Time`` object back instead of a string.

Event
=====

* ``Event::data()`` a été ajoutée.
* ``Event::setData()`` a été ajoutée.
* ``Event::result()`` a été ajoutée.
* ``Event::setResult()`` a été ajoutée.

I18n
====

* Vous pouvez maintenant personnaliser le comportement du loader de messages
  de fallback. Reportez-vous à :ref:`creating-generic-translators` pour plus
  d'information.

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` utilise maintenant une ellipse HTML au lieu de
  '...' dans les templates par défaut.

FormHelper
==========

* Vous pouvez maintenant configurer les sources à partir desquelles FormHelper
  lit. Ceci simplifie la création des formulaires GET. Consultez :ref:`form-values-from-query-string` pour plus d'informations.
