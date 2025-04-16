6.0 Migration Guide
###################

CakePHP 6.0 contains breaking changes, and is not backwards compatible with 5.x.
Before attempting to upgrade to 6.0 first upgrade to 5.2+ and resolve all
deprecation warnings.

Behavior Changes
================

- All datasource connections require the ``username``, ``password`` and
  ``database`` keys as default values have been removed to prevent accidental
  privileged user usage.
- The ``ORM.mapJsonTypeForSqlite`` configuration option has been removed. The
  SQLite adapter will map all columns with ``json`` in their names to the
  ``JsonType`` by default.
- ``Cake\View\Widget\FileWidget`` was removed as it was redundant. The standard
  input widget will be used for file inputs in 6.x.
- ``Text::uuid()`` now generates UUID v7 complaint strings instead of UUID v4.

Breaking Changes
================

Datasource
----------

- ``Datasource/Paging/PaginatedInterface`` now extends ``IteratorAggregate``
  instead of ``Traversable``.

ORM
---

- The ``_accessible`` property inside Entities has been renamed to ``patchable``
  to better reflect its purpose.
- ``setAccess`` method has been renamed to ``setPatchable``.
- ``getAccessible`` method has been renamed to ``getPatchable``.
- ``isAccessible`` method has been renamed to ``isPatchable``.
- The ``accessibleFields`` option used in e.g. ORM Queries has been
  renamed to ``patchableFields``.

Utility
-------

- The default placeholder format for ``Text::insert()`` has been changed.
  They now use ``{foo}`` instead of ``:foo``. You can get the old
  behavior by using the ``before`` and ``after`` keys of ``$options``.

View
----

- ``'escape'``/``'escapeTitle'`` keys have now been separated cleanly into ``escape`` for escaping content/labels, and
  ``'escapeAttributes'`` for HTML attributes respectively. They also don't overlap anymore, so if you need to prevent escaping
  on content and attributes, make sure to set them both to false.
- ``title`` has been renamed to ``content`` in scopes where this is not an attribute, but content or label element, specifically:
  ``'item'``/``itemWithoutLink`` breadcrumb templates.
- ``multicheckboxTitle`` template of FormHelper is now ``multicheckboxLabel``.
