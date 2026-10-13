# Backwards Compatibility Guide

Ensuring that you can upgrade your applications easily and smoothly is
important. The Piece of Cake 2 fork keeps the public API of CakePHP 2 and does
not add new features. Its changes are limited to PHP compatibility, bug fixes,
security fixes and support for the migration path to CakePHP 5.

Keeping CakePHP 2 running on PHP 8 still required some changes that affect
applications, so this page explains what you can expect from releases, and
what contributors should keep in mind.

## What to Expect from Releases

Most releases contain only bug fixes and compatibility fixes that need no
changes in your application. Some releases, however, contained changes that do.
Examples are:

- the removal of the Xcache and Wincache cache engines (2.10.24.3),
- the requirement to install CakePHP with Composer, and the extraction of Bake
  and the 1.3 to 2.0 upgrade shell into separate plugins,
- the new framework directory layout (2.11.0),
- Composer classmap autoloading for the framework and applications (2.12.0).

These changes are not limited to a particular kind of version number: a
release such as 2.10.24.3 also contained some. Before you update, read the
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
entries of every release between your current version and the new one, then run
your application's test suite.

## Migration Guides

Changes that require you to change your application are described, with
migration steps, in the
[UPGRADE guide](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
of the framework and in
[Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10). They
also explain how to move an application from the original CakePHP
2.10.24 to the fork.

The migration guides for the original CakePHP releases, up to 2.10, can be
found in the [Appendices](../appendices) section of this book.

## Using CakePHP

If you are building your application with CakePHP, the public API is the part
you can rely on most: creating instances of framework classes, calling their
public methods, reading and writing their public properties, and extending them
while overriding public methods with the same signature.

Code that depends on the internals of the framework is more likely to be
affected by fixes. This includes code that calls or overrides protected
methods, or reads or overrides protected properties, of framework classes.
Classes marked with the `@internal` API doc tag have no backwards compatibility
promises at all.

If your application overrides framework methods, keep their signatures
unchanged. In particular, adding native type declarations to an overriding
method can cause fatal errors when the framework's method has none.

## Working on CakePHP

If you are contributing to the fork, keep the following guidelines in mind:

- Do not remove or rename public classes, interfaces, methods or properties.
- Do not add required arguments to existing methods. If you need a new
  argument, add it with a default value at the end of the argument list.
- Do not reduce the visibility of methods or properties, and do not make
  classes or methods `final` or `abstract`.
- Do not add native return types to methods that applications may override,
  since overriding methods without them would then cause fatal errors.
- Avoid removing or renaming protected methods and properties. Applications
  extend framework classes often.

If a change that affects applications cannot be avoided, for example because a
newer PHP version or a security fix requires it, describe it in `CHANGELOG.md`
and the migration steps in `UPGRADE.md`, as earlier releases did.
