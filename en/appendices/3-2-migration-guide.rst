3.2 Migration Guide
###################

CakePHP 3.2 is an API compatible upgrade from 3.1. This page outlines
the changes and improvements made in 3.2.

Minimum PHP 5.5 Required
========================

CakePHP 3.2 requires at least PHP 5.5. By adopting PHP 5.5 we can provide better
Date and Time libraries and remove dependencies on password compatiblity
librarires.

Helpers
=======

Helpers can now have an ``initialize(array $config)`` hook method like other
class types.
