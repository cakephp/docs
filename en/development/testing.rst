Testing
#######

CakePHP comes with comprehensive testing support built-in.  CakePHP comes with
integration for `PHPUnit <http://phpunit.de>`_.  In addition to the features
offered by PHPUnit, CakePHP offers some additional features to make testing
easier. This section will cover installing PHPUnit, and getting started with
Unit Testing, and how you can use the extensions that CakePHP offers.

Installing PHPUnit
==================

CakePHP uses PHPUnit as its underlying test framework.  PHPUnit is the de-facto
standard for unit testing in PHP.  It offers a deep and powerful set of features
for making sure your code does what you think it does.  PHPUnit can be installed
through the `pear installer <http://pear.php.net>`_.  To install PHPUnit run the
following::

    pear upgrade PEAR
    pear config-set auto_discover 1
    pear install pear.phpunit.de/PHPUnit-3.5.15

.. note::

    Depending on your system's configuration, you make need to run the previous
    commands with ``sudo``

.. note::

    At this time CakePHP does not work with PHPUnit 3.6