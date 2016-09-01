Backwards Compatibility Guide
#############################

Ensuring that you can upgrade your applications easily and smoothly is important
to us. That's why we only break compatibility at major release milestones.
You might be familiar with `semantic versioning <http://semver.org/>`_, which is
the general guideline we use on all CakePHP projects. In short, semantic
versioning means that only major releases (such as 2.0, 3.0, 4.0) can break
backwards compatibility. Minor releases (such as 2.1, 3.1, 3.2) may introduce
new features, but are not allowed to break compatibility. Bug fix releases
(such as 2.1.2, 3.0.1) do not add new features, but fix bugs or enhance
performance only.

.. note::

    CakePHP started following semantic versioning in 2.0.0. These rules do not
    apply to 1.x.

To clarify what changes you can expect in each release tier we have more
detailed information for developers using CakePHP, and for developers working on
CakePHP that helps set expectations of what can be done in minor releases. Major
releases can have as many breaking changes as required.

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
existing methods changed and new methods will **not** be added to any existing
interfaces.

Classes
-------

Classes provided by CakePHP can be constructed and have their public methods and
properties used by application code and outside of major releases backwards
compatibility is ensured.

.. note::

    Some classes in CakePHP are marked with the ``@internal`` API doc tag. These
    classes are **not** stable and do not have any backwards compatibility
    promises.

In minor releases (3.x.0), new methods may be added to classes, and existing
methods may have new arguments added. Any new arguments will have default
values, but if you've overidden methods with a differing signature you may see
errors. Methods that have new arguments added will be documented in the
migration guide for that release.

The following table outlines several use cases and what compatibility you can
expect from CakePHP:

+-------------------------------+--------------------------+
| If you...                     | Backwards compatibility? |
+===============================+==========================+
| Typehint against the class    | Yes                      |
+-------------------------------+--------------------------+
| Create a new instance         | Yes                      |
+-------------------------------+--------------------------+
| Extend the class              | Yes                      |
+-------------------------------+--------------------------+
| Access a public property      | Yes                      |
+-------------------------------+--------------------------+
| Call a public method          | Yes                      |
+-------------------------------+--------------------------+
| **Extend a class and...**                                |
+-------------------------------+--------------------------+
| Call a protected method       | No [1]_                  |
+-------------------------------+--------------------------+
| Override a protected property | No [1]_                  |
+-------------------------------+--------------------------+
| Override a protected method   | No [1]_                  |
+-------------------------------+--------------------------+
| Access a protected property   | No [1]_                  |
+-------------------------------+--------------------------+
| Call a public method          | Yes                      |
+-------------------------------+--------------------------+
| Override a public method      | Yes [1]_                 |
+-------------------------------+--------------------------+
| Override a public property    | Yes                      |
+-------------------------------+--------------------------+
| Add a public property         | No                       |
+-------------------------------+--------------------------+
| Add a public method           | No                       |
+-------------------------------+--------------------------+
| Add an argument               | No [1]_                  |
| to an overridden method       |                          |
+-------------------------------+--------------------------+
| Add a default argument        | Yes                      |
| to an existing method         |                          |
+-------------------------------+--------------------------+

Working on CakePHP
==================

If you are helping make CakePHP even better please keep the following guidelines
in mind when adding/changing functionality:

In a minor release you can:

+-------------------------------+--------------------------+
| In a minor release can you...                            |
+===============================+==========================+
| **Classes**                                              |
+-------------------------------+--------------------------+
| Remove a class                | No                       |
+-------------------------------+--------------------------+
| Remove an interface           | No                       |
+-------------------------------+--------------------------+
| Remove a trait                | No                       |
+-------------------------------+--------------------------+
| Make final                    | No                       |
+-------------------------------+--------------------------+
| Make abstract                 | No                       |
+-------------------------------+--------------------------+
| Change name                   | Yes [2]_                 |
+-------------------------------+--------------------------+
| **Properties**                                           |
+-------------------------------+--------------------------+
| Add a public property         | Yes                      |
+-------------------------------+--------------------------+
| Remove a public property      | No                       |
+-------------------------------+--------------------------+
| Add a protected property      | Yes                      |
+-------------------------------+--------------------------+
| Remove a protected property   | Yes [3]_                 |
+-------------------------------+--------------------------+
| **Methods**                                              |
+-------------------------------+--------------------------+
| Add a public method           | Yes                      |
+-------------------------------+--------------------------+
| Remove a public method        | No                       |
+-------------------------------+--------------------------+
| Add a protected method        | Yes                      |
+-------------------------------+--------------------------+
| Move member to parent class   | Yes                      |
+-------------------------------+--------------------------+
| Remove a protected method     | Yes [3]_                 |
+-------------------------------+--------------------------+
| Reduce visibility             | No                       |
+-------------------------------+--------------------------+
| Change method name            | Yes [2]_                 |
+-------------------------------+--------------------------+
| Add default value to          | No                       |
| existing argument             |                          |
+-------------------------------+--------------------------+
| Add argument with             | Yes                      |
| default value                 |                          |
+-------------------------------+--------------------------+
| Add required argument         | No                       |
+-------------------------------+--------------------------+


.. [1] Your code *may* be broken by minor releases. Check the migration guide
       for details.
.. [2] You can change a class/method name as long as the old name remains available.
       This is generally avoided unless renaming has significant benefit.
.. [3] Avoid whenever possible. Any removals need to be documented in
       the migration guide.
