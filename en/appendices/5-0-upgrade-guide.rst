5.0 Upgrade Guide
#################

First, check that your application is running on latest CakePHP 4.x version.

Fix Deprecation Warnings
========================

Once your application is running on latest CakePHP 4.x, enable deprecation warnings in **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL,
    ]

Now that you can see all the warnings, make sure these are fixed before proceeding with the upgrade.

Some potentially impactful deprecations you should make sure you have addressed
are:

- ``Table::query()`` was deprecated in 4.5.0. Use ``selectQuery()``,
  ``updateQuery()``, ``insertQuery()`` and ``deleteQuery()`` instead.

Upgrade to PHP 8.1
==================

If you are not running on **PHP 8.1 or higher**, you will need to upgrade PHP before updating CakePHP.

.. note::
    CakePHP 5.0 requires **a minimum of PHP 8.1**.

.. _upgrade-tool-use:

Use the Upgrade Tool
====================

.. note::
    The upgrade tool only works on applications running on latest CakePHP 4.x. You cannot run the upgrade tool after updating to CakePHP 5.0.

Because CakePHP 5 leverages union types and ``mixed``, there are many
backwards incompatible changes concerning method signatures and file renames.
To help expedite fixing these tedious changes there is an upgrade CLI tool:

.. code-block:: console

    # Install the upgrade tool
    git clone https://github.com/cakephp/upgrade
    cd upgrade
    git checkout 5.x
    composer install --no-dev

With the upgrade tool installed you can now run it on your application or
plugin::

    bin/cake upgrade rector --rules cakephp50 <path/to/app/src>
    bin/cake upgrade rector --rules chronos3 <path/to/app/src>

Update CakePHP Dependency
=========================

After applying rector refactorings, upgrade CakePHP and PHPUnit with the following
composer commands:

.. code-block:: bash

    php composer.phar require --dev --update-with-dependencies "phpunit/phpunit:^10.1"
    php composer.phar require --update-with-dependencies "cakephp/cakephp:5.0.*"

Update app files based upon latest app template
===============================================

Next, ensure your application has been updated to be based upon the
latest version of `cakephp/app
<https://github.com/cakephp/app/blob/5.x/>`__.