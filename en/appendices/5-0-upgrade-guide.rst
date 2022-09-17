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
    The ``file_rename`` command and rector rules for cakephp40, and phpunit80
    are intended to be run **before** you update your application's dependencies
    to 5.0. The ``cakephp50`` rector rules will not run correctly if your
    application already has its dependencies updated to 5.x or PHPUnit9.

.. code-block:: bash

    # Install the upgrade tool
    git clone git://github.com/cakephp/upgrade
    cd upgrade
    git checkout master
    composer install --no-dev

Applying Rector Refactorings
----------------------------

Next use the ``rector`` command to automatically fix many deprecated CakePHP and
PHPUnit method calls. It is important to apply rector **before** you upgrade
your dependencies::

    bin/cake upgrade rector --rules cakephp50 <path/to/app/src>

Update CakePHP Dependency
=========================

After applying rector refactorings, upgrade CakePHP and PHPUnit with the following
composer commands:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:5.0.*"
