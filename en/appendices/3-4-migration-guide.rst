3.4 Migration Guide
###################

CakePHP 3.4 is an API compatible upgrade from 3.3. This page outlines the
changes and improvements made in 3.4.


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
