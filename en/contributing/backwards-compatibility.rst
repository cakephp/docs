Backwards Compatibility Guide
#############################

Ensuring that you can upgrade your applications easily and smoothly is important
to us. That's why we only break compatibility at major release milestones.
You might be familiar with `semantic versioning <http://semver.org/>`_, which is
the general guideline we use on all CakePHP projects. In short, semantic
versioning means that only major releases (such as 2.0, 3.0, 4.0) can break
backwards compatibility. Minor releases (such as 2.1, 3.1, 3.2) may introduce new
features, but are not allowed to break compatibility. Bug fix releases (such as 2.1.2,
3.0.1) do not add new features, and only fix bugs or enhance performance.

.. note::

    CakePHP started following semantic versioning ideas in 2.0.0, and these
    rules do not apply to 1.x.

Because backwards compatibility is complicated, and different changes have
different impacts on your application. Some changes just require method renames,
and others require significant overhauls of application code.

To clarify what changes you can expect in each release tier we have more detailed guides for 
developers using CakePHP, and for developers working on CakePHP.

Migration Guides
================

For each major and minor release, the CakePHP team will provide a migration
guide. These guides explain the new features and any breaking changes that are
in each release. They can be found in the :doc:`/appendices` section of the
cookbook.

Using CakePHP
=============

If you are building your application with CakePHP, the following guidelines
explain the stability you can expect.

Interfaces
----------

Outside of major releases, interfaces provided by CakePHP will **not** have any
existing methods changed. New methods may be added, but no existing methods will
be changed.

Classes
-------

Classes provided by CakePHP can be constructed and have their public methods and
properties used by application code and outside of major releases backwards
compatibility is ensured.

.. note::

    Some classes in CakePHP are marked with the ``@internal`` API doc tag. These
    classes are **not** stable and do not have any backwards compatibility
    promises.

In minor releases, new methods may be added to classes, and existing methods may
have new arguments added. Any new arguments will have default values, but if
you've overidden methods with a differing signature you may see fatal errors.
Methods that have new arguments added will be documented in the migration guide
for that release.

The following table outlines several use cases and what compatibility you can
expect from CakePHP:

+===============================+==========================+
| If you...                     | Backwards compatibility? |
+===============================+==========================+
| Typehint against the class    |  Yes                     |
+-------------------------------+--------------------------+
| Create a new instance         | Yes                      |
+-------------------------------+--------------------------+
| Extend the class              | Yes                      |
+-------------------------------+--------------------------+
| Access a public property      | Yes                      |
+-------------------------------+--------------------------+
| Call a public method          | Yes                      |
+===============================+===========================
| Extend a class and...         | Backwards compatibility? |
+===============================+==========================+
| Override a public property    |  Yes                     |
+-------------------------------+--------------------------+
| Access a protected property   |  No [1]_                 |
+-------------------------------+--------------------------+
| Override a protected property |  No [1]_                 |
+-------------------------------+--------------------------+
| Override a protected method   |  No [1]_                 |
+-------------------------------+--------------------------+
| Call a protected method       |  No [1]_                 |
+-------------------------------+--------------------------+
| Add a public property         |  No                      |
+-------------------------------+--------------------------+


.. rubric:: Footnotes

.. [1] Your code *may* be broken by minor releases. Check the migration guide
       for details.

