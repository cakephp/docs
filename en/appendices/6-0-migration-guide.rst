6.0 Migration Guide
###################

CakePHP 6.0 contains breaking changes, and is not backwards compatible with 5.x.
Before attempting to upgrade to 6.0 first upgrade to 5.2+ and resolve all
deprecation warnings.

Behavior Changes
================

- The ``ORM.mapJsonTypeForSqlite`` configuration option has been removed. The
  SQLite adapter will map all columns with ``json`` in their names to the
  ``JsonType`` by default.
