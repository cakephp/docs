2.4 Migration Guide
###################

CakePHP 2.4 is a fully API compatible upgrade from 2.3.  This page outlines
the changes and improvements made in 2.4.

Model
=====

Models
------

- php:meth::`Model::save()`, php:meth::`Model::saveField()`, php:meth::`Model::saveAll()`,
  php:meth::`Model::saveAssociated()`, php:meth::`Model::saveMany()`
  now take a new ``counterCache`` option. You can set it to false to avoid
  updating counter cache values for the particular save operation.
