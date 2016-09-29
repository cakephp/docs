3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
elements will continue to function until 4.0.0 after which they will be removed.

* The public properties on ``Cake\Event\Event`` are deprecated, new methods have
  been added to read/write the relevant properties.
* Several properties on ``Cake\Network\Request`` have been deprecated:

  * ``Request::$params`` is deprecated. Use ``Request::param()`` instead.
  * ``Request::$data`` is deprecated. Use ``Request::data()`` instead.
  * ``Request::$query`` is deprecated. Use ``Request::query()`` instead.
  * ``Request::$cookies`` is deprecated. Use ``Request::cookie()`` instead.
  * ``Request::$base`` is deprecated. Use ``Request::getAttribute('base')`` instead.
  * ``Request::$webroot`` is deprecated. Use ``Request::getAttribute('webroot')`` instead.
  * ``Request::$here`` is deprecated. Use ``Request::here()`` instead.
  * ``Request::$_session`` was renamed to ``Request::$session``.

* A number of methods on ``Cake\Network\Request`` have been deprecated:

  * The setter modes for ``query()``, ``data()`` and ``param()`` are deprecated.
  * ``__get()`` & ``__isset()`` methods are deprecated. Use ``param()`` instead.
  * ``method()`` is deprecated. Use ``getMethod()`` instead.
  * ``setInput()`` is deprecated. Use ``withBody()`` instead.
  * The ``ArrayAccess`` methods have all been deprecated.

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may effect your application:

* ORM\Query results will not typecast aliased columns based on the original
  columns type. For example if you alias ``created`` to ``created_time`` you
  will now get a ``Time`` object back instead of a string.

Collection
==========

* ``CollectionInterface::chunkWithKeys()`` a été ajoutée. Les implémentations
  de ``CollectionInterface`` des utilisateurs devront maintenant implémenter
  cette méthode.
* ``Collection::chunkWithKeys()`` a été ajoutée.

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
