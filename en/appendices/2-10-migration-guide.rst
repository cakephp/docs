2.10 Migration Guide
####################

CakePHP 2.10 is a fully API compatible upgrade from 2.9 This page outlines
the changes and improvements made in 2.10.

Core
====

* The ``CONFIG`` constant was added. This constant defaults to ``app/Config``,
  and is intended to increase forwards compatibility with 3.x

Model
=====

* New internal data types were added for ``smallinteger`` and ``tinyinteger``.
  Existing ``SMALLINT`` and ``TINYINT`` columns will now be reflected as these
  new internal data types. ``TINYINT(1)`` columns will continue to be treated as
  boolean columns in MySQL.
* ``Model::find()`` now supports ``having`` and ``lock`` options that enable you
  to add ``HAVING`` and ``FOR UPDATE`` locking clauses to your find operations.
* ``TranslateBehavior`` now supports loading translations with LEFT JOIN. Use
  the ``joinType`` option to use this feature.

Components
==========

* ``SecurityComponent`` now emits more verbose error messages when form
  tampering or CSRF protection fails in debug mode. This feature was backported
  from 3.x
* ``SecurityComponent`` will blackhole post requests that have no request data
  now. This change helps protect actions that create records using database
  defaults alone.
* ``FlashComponent`` now stacks messages of the same type. This is a feature
  backport from 3.x. To disable this behavior, add ``'clear' => true`` to the
  configuration for FlashComponent.
* ``PaginatorComponent`` now supports multiple paginators through the
  ``queryScope`` option. Using this option when paginating data will force
  PaginatorComponent to read from scoped query parameters instead of the root
  query string data.

Helpers
=======

* ``HtmlHelper::image()`` now supports the ``base64`` option. This option will
  read local image files and create base64 data URIs.
* ``HtmlHelper::addCrumb()`` had the ``prepend`` option added. This lets you
  prepend a breadcrumb instead of appending to the list.
* ``FormHelper`` creates 'numeric' inputs for ``smallinteger`` and
  ``tinyinteger`` types.

Routing
=======

* ``Router::reverseToArray()`` was added.
