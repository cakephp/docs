5.0 Upgrade Guide
#################

.. warning::
    The upgrade guide for 5.0 is not complete.

First, check that your application is running on latest CakePHP 4.x version.

.. note::
    The upgrade tool only works on applications running on latest CakePHP 4.x. You cannot run the upgrade tool after updating to CakePHP 5.0.

Fix Deprecation Warnings
========================

Once your application is running on latest CakePHP 4.x, enable deprecation warnings in **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL,
    ]

Now that you can see all the warnings, make sure these are fixed before proceding with the upgrade.

Upgrade to PHP 8.1
==================

If you are not running on **PHP 8.1 or higher**, you will need to upgrade PHP before updating CakePHP.

.. note::
    CakePHP 5.0 requires **a minimum of PHP 8.1**.

.. _upgrade-tool-use:

Use the Upgrade Tool
====================

Because CakePHP 5 leverages union types and ``mixed``, there are many
backwards incompatible changes concerning method signatures and file renames.
To help expedite fixing these tedious changes there is an upgrade CLI tool:

.. warning::
    The upgrade tool for 5.x is not complete yet.

Update CakePHP Dependency
=========================

After applying rector refactorings, upgrade CakePHP and PHPUnit with the following
composer commands:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:5.0.*"
