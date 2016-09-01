3.4 Migration Guide
###################

CakePHP 3.4 is an API compatible upgrade from 3.3. This page outlines the
changes and improvements made in 3.4.

Deprecations
============

* The public properties on ``Cake\Event\Event`` are deprecated, new methods have
  been added to read/write the relevant properties.

Event
=====

* ``Event::data()`` was added.
* ``Event::setData()`` was added.
* ``Event::result()`` was added.
* ``Event::setResult()`` was added.


I18n
====

* You can now customize the behavior of the fallback message loader. See
  :ref:`creating-generic-translators` for more information.

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` now uses an HTML elipsis instead of '...' in
  the default templates.

FormHelper
==========

* You can now configure the sources which FormHelper reads from. This makes
  creating GET forms simpler. See :ref:`form-values-from-query-string` for more
  information.
