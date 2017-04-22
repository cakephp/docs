Tutoriel de Gestion de Contenu
##############################

Ce tutoriel vous accompagnera pour créer une application :abbr:`CMS (Content
Management System, en français Système de Gestion de Contenu)` simple. Pour
commencer, nous allons installer CakePHP, créer notre base de données et
construire une gestion simple d'articles.

Voilà ce dont vous allez avoir besoin:

#. Un serveur de base de données. Nous allons utiliser un serveur MySQL dans ce
tutoriel.
   Vous devrez en savoir assez sur SQL pour créer une base de données et
   exécuter des portions de code SQL du tutoriel. CakePHP va gérer la
   construction de toutes les requêtes dont votre application aura besoin.
   Puisque nous utilisons MySQL, assurez-vous que vous avez ``pdo_mysql``
   activé dans PHP.
#. Des connaissances basiques de PHP.

Avant de commencer, vous devrez vous assurer que vous avez une version de PHP
à jour:

.. code-block:: bash

    php -v

Vous devrez avoir au moins la version |minphpversion| (CLI) de PHP. La version
de votre serveur web PHP devra aussi être au moins la version |minphpversion|,
et devra être la même version que celle de votre interface en ligne de commande
PHP (CLI).

Récpérer CakePHP
================

.. TODO::
    Should we use Oven instead?

The easiest way to install CakePHP is to use Composer. Composer is a simple way
of installing CakePHP from your terminal or command line prompt.  First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following:

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

Then simply type the following line in your terminal from your
installation directory to install the CakePHP application skeleton
in the **cms** directory:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app cms

If you downloaded and ran the `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_, then type the following line in
your terminal from your installation directory (ie.
C:\\wamp\\www\\dev\\cakephp3):

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app cms

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your **config/app.php** file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /cms
      /bin
      /config
      /logs
      /plugins
      /src
      /tests
      /tmp
      /vendor
      /webroot
      .editorconfig
      .gitignore
      .htaccess
      .travis.yml
      composer.json
      index.php
      phpunit.xml.dist
      README.md

Now might be a good time to learn a bit about how CakePHP's directory structure
works: check out the :doc:`/intro/cakephp-folder-structure` section.

Checking our Installation
=========================

We can quickly check that our installation is correct, by checking the default
home page. Before you can do that, you'll need to start the development server:

.. code-block:: bash

    bin/cake server

.. note::

    For Windows, the command needs to be ``bin\cake server`` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be checkmarks other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Next, we will build our :doc:`Database and create our first model <database>`.
