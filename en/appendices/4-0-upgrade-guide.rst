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

Because CakePHP 4 adopts strict mode and uses more typehinting there are many
backwards incompatible changes concerning method signatures, and file renames.
To help expedite fixing these tedious changes there is an upgrade CLI tool::

    # Install the upgrade tool
    git clone git://github.com/cakephp/upgrade
    cd upgrade
    git checkout 4.x
    composer install --no-dev

With the upgrade tool installed you can now run it on your application or
plugin::

    cd ~/code/upgrade

    # Rename locale files
    bin/cake upgrade file_rename locales <path/to/app>

    # Rename template files
    bin/cake upgrade file_rename locales <path/to/app>

Once you've renamed your template and locale files, make sure you update
``App.paths.locales`` and ``App.paths.templates`` paths to be correct.

Next use the ``rector`` command to automatically fix several deprecated
& removed APIs::

    bin/cake rector --rules phpunit80 <path/to/app>
    bin/cake rector --rules cakephp40 <path/to/app>


.. note::
    It is important to apply rector **before** you upgrade your dependencies.

Update CakePHP Dependency
=========================

To upgrade CakePHP run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"


