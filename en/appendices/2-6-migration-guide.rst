2.6 Migration Guide
###################

CakePHP 2.6 is a fully API compatible upgrade from 2.5.  This page outlines
the changes and improvements made in 2.6.

Console
=======

Shell
-----

- ``overwrite()`` has been added to allow generating progress bars or to avoid outputting
  too many lines by replacing text that has been already outputted to the screen.

Behavior
========

AclBehavior
-----------

- ``Model::parentNode()`` now gets the type (Aro, Aco) passed as first argument: ``$model->parentNode($type)``.

Model
=====

Model
-----

- ``Model::save()`` had the ``atomic`` option back-ported from 3.0.

Network
=======

CakeRequest
-----------

- ``CakeRequest::param()`` can now read values using :ref:`hash-path-syntax`
  like ``data()``.


Utility
=======

Validation
----------

- ``Validation::between`` has been deprecated, you should use
  :php:meth:`Validation::lengthBetween` instead.
