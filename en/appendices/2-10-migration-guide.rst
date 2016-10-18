2.10 Migration Guide
####################

CakePHP 2.10 is a fully API compatible upgrade from 2.9 This page outlines
the changes and improvements made in 2.10.

Components
==========

* ``SecurityComponent`` now emits more verbose error messages when form
  tampering or CSRF protection fails in debug mode. This feature was backported
  from 3.x

Helpers
=======

* ``HtmlHelper::image()`` now supports the ``base64`` option. This option will
  read local image files and create base64 data URIs.
