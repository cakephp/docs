4.0 Upgrade Guide
#################

Before attempting to upgrade to 4.0 first ensure you have upgraded to 3.8. Then
enable deprecation warnings::

    // in config/app.php
    'Error' => [
        'errorLevel' => E_ALL ^ E_USER_DEPRECATED,
    ]

Then, incrementally fix the deprecation warnings your application and its
plugins emit.

Use the Upgrade Tool
====================

Because CakePHP 4 adopts strict mode and uses more typehinting, there are many
backwards incompatible changes concerning method signatures and file renames.
To help expedite fixing these tedious changes there is an upgrade CLI tool:

.. code-block:: bash

    # Install the upgrade tool
    git clone git://github.com/cakephp/upgrade
    cd upgrade
    git checkout 4.x
    composer install --no-dev

With the upgrade tool installed you can now run it on your application or
plugin:

.. code-block:: bash

    cd ~/code/upgrade

    # Rename locale files
    bin/cake upgrade file_rename locales <path/to/app>

    # Rename template files
    bin/cake upgrade file_rename templates <path/to/app>

Once you've renamed your template and locale files, make sure you update
``App.paths.locales`` and ``App.paths.templates`` paths to be correct.

Applying Rector Refactorings
----------------------------

Next use the ``rector`` command to automatically fix many deprecated CakePHP and
PHPUnit method calls. It is important to apply rector **before** you upgrade
your dependencies::

    bin/cake rector --rules phpunit80 <path/to/app>
    bin/cake rector --rules cakephp40 <path/to/app>

Update CakePHP Dependency
=========================

After applying rector refactorings, upgrade CakePHP and PHPUnit with the following
composer commands:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "phpunit/phpunit:^8.0"
    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"


