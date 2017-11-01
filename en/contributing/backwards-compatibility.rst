Backwards Compatibility Guide
#############################

Ensuring that you can upgrade your applications easily and smoothly is important
to us. That's why we only break compatibility at major release milestones.
You might be familiar with `semantic versioning <http://semver.org/>`_, which is
the general guideline we use on all CakePHP projects. In short, semantic
versioning means that only major releases (such as 2.0, 3.0, 4.0) can break
backwards compatibility. Minor releases (such as 2.1, 3.1, 3.2) may introduce new
features, but are not allowed to break compatibility. Bug fix releases (such as 2.1.2,
3.0.1) do not add new features, but fix bugs or enhance performance only.

.. note::

    Deprecations are removed with the next major version of the framework.
    It is advised to early on adapt your code already each minor as outlined in
    the deprecation comments and the migration guides.

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
you've overridden methods with a differing signature you may see fatal errors.
Methods that have new arguments added will be documented in the migration guide
for that release.

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
| Override a public property    | Yes                      |
+-------------------------------+--------------------------+
| Access a protected property   | No [1]_                  |
+-------------------------------+--------------------------+
| Override a protected property | No [1]_                  |
+-------------------------------+--------------------------+
| Override a protected method   | No [1]_                  |
+-------------------------------+--------------------------+
| Call a protected method       | No [1]_                  |
+-------------------------------+--------------------------+
| Add a public property         | No                       |
+-------------------------------+--------------------------+
| Add a public method           | No                       |
+-------------------------------+--------------------------+
| Add an argument               | No [1]_                  |
| to an overridden method       |                          |
+-------------------------------+--------------------------+
| Add a default argument value  | Yes                      |
| to an existing method         |                          |
| argument                      |                          |
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
| Move to parent class          | Yes                      |
+-------------------------------+--------------------------+
| Remove a protected method     | Yes [3]_                 |
+-------------------------------+--------------------------+
| Reduce visibility             | No                       |
+-------------------------------+--------------------------+
| Change method name            | Yes [2]_                 |
+-------------------------------+--------------------------+
| Add a new argument with       | Yes                      |
| default value                 |                          |
+-------------------------------+--------------------------+
| Add a new required argument   | No                       |
| to an existing method.        |                          |
+-------------------------------+--------------------------+
| Remove a default value from   | No                       |
| an existing argument          |                          |
+-------------------------------+--------------------------+
| Change method type void       | Yes                      |
+-------------------------------+--------------------------+


.. [1] Your code *may* be broken by minor releases. Check the migration guide
       for details.
.. [2] You can change a class/method name as long as the old name remains
       available. This is generally avoided unless renaming has significant
       benefit.
.. [3] Avoid whenever possible. Any removals need to be documented in
       the migration guide.

Deprecations
============

In each minor release, features may be deprecated. If features are deprecated,
API documentation and runtime warnings will be added. Runtime errors help you
locate code that needs to be updated before it breaks. If you wish to disable
runtime warnings you can do so using the ``Error.errorLevel`` configuration
value::

    // in config/app.php
    'Error' => [
        'errorLevel' => E_ALL ^ E_USER_DEPRECATED
    ]

Will disable runtime deprecation warnings.

