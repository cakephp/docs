Data Sanitization
#################

The ``Sanitize`` class is deprecated as of 2.4, and will be removed in CakePHP
3.0. Instead of using the Sanitize class you can accomplish the same tasks using
other parts of CakePHP, native PHP functions, or other libraries.

Input filtering
===============

Instead of using the destructive input filtering features of Sanitize class you
should instead apply more thorough :doc:`/models/data-validation` to the user
data your application accepts. By rejecting invalid input you can often remove the
need to destructively modify user data. You might also want to look at
`PHP's filter extension <http://php.net/filter>`_ in situations you need to
modify user input.

Accepting user submitted HTML
=============================

Often input filtering is used when accepting user-submitted HTML. In these
situations it is best to use a dedicated library like `HTML Purifier
<http://htmlpurifier.org/>`_.

SQL Escaping
============

CakePHP handles SQL escaping on all parameters to :php:meth:`Model::find()` and
:php:meth:`Model::save()`. In the rare case you need to construct SQL by hand
using user input you should using :ref:`prepared-statements`.
