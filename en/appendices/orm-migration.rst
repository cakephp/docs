New ORM upgrade guide
#####################

CakePHP 3.0 features a new ORM that has been re-written from the ground up.
While the ORM used in 1.x and 2.x has served us well for a long time it had
a few issues that we wanted to fix.

* List of things.

Design of the new ORM
=====================

* Two layers database + ORM
* Entities & Tables
* Behaviors
* Query builder instead of query arrays

Updating model classes
======================

* Updating find calls -> new finder methods
* Recursive & contain -> contain()
* afterFind callbacks -> mapReduce/entity constructor/mutators
* Validation rules
* Associations

Updating behaviors
==================


Updating datasources
====================

