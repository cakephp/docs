.. _upgrade-shell:

Upgrade Shell
#############

The upgrade shell will do most of the work to upgrade your CakePHP application
from 2.x to 3.x.

<<<<<<< HEAD
It is provided by a standalone
`Upgrade plugin <https://github.com/cakephp/upgrade>`_. Please read the README
file to get all information on how to upgrade your application.
=======
To run all upgrade steps::

    ./Console/cake upgrade all

If you would like to see what the shell will do without modifying files perform
a dry run first with --dry-run::

    ./Console/cake upgrade all --dry-run

To upgrade your plugin run the command::

    ./Console/cake upgrade all --plugin YourPluginName

You are able to run each upgrade step individually. To see all the steps
available run the command::

    ./Console/cake upgrade --help

Or visit the `API docs <https://api.cakephp.org/2.x/class-UpgradeShell.html>`_ for more info.

Upgrade Your App
----------------

Here is a guide to help you upgrade your CakePHP 1.3 app to 2.x using the
upgrade shell. Your 1.3 app structure will likely look like this::

    mywebsite/
        app/             <- Your App
        cake/            <- 1.3 Version of CakePHP
        plugins/
        vendors/
        .htaccess
        index.php

The first step is to download or ``git clone`` the new version of CakePHP into
another folder outside of your ``mywebsite`` folder, we'll call it ``cakephp``.
We don't want the downloaded ``app`` folder to overwrite your app folder. Now is
a good time to make a backup of your app folder, eg.: ``cp -R app app-backup``.

Copy the ``cakephp/lib`` folder to your ``mywebsite/lib`` to setup the new
CakePHP version in your app, eg.: ``cp -R ../cakephp/lib .``. Symlinking is a
good alternative to copy as well, eg.: ``ln -s /var/www/cakephp/lib``.

Before we can run the upgrade shell we need the new console scripts as well.
Copy the ``cakephp/app/Console`` folder into your ``mywebsite/app``, eg.:
``cp -R ../cakephp/app/Console ./app``.

Your folder structure should look like this now::

    mywebsite/
        app/              <- Your App
            Console/      <- Copied app/Console Folder
        app-backup/       <- Backup Copy of Your App
        cake/             <- 1.3 Version of CakePHP
        lib/              <- 2.x Version of CakePHP
            Cake/
        plugins/
        vendors/
        .htaccess
        index.php

Now we can run the upgrade shell by ``cd``'ing into your ``app`` folder and
running the command::

    ./Console/cake upgrade all

This will do **most** of the work to upgrade your app to 2.x. Check things over
in your upgraded ``app`` folder. If everything looks good then congratulate
yourself and delete your ``mywebsite/cake`` folder. Welcome to 2.x!
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d


.. meta::
    :title lang=en: Upgrade Shell
    :keywords lang=en: api docs,shell,upgrade
