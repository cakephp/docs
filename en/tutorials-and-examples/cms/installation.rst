Content Management Tutorial
###########################

This tutorial will walk you through the creation of a simple :abbr:`CMS (Content
Management System)` application. To start with, we'll be installing CakePHP,
creating our database, and building simple article management.

Here's what you'll need:

#. A database server. We're going to be using MySQL server in this tutorial.
   You'll need to know enough about SQL in order to create a database, and run
   SQL snippets from the tutorial. CakePHP will handle building all the queries
   your application needs. Since we're using MySQL, also make sure that you have
   ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge.

Before starting you should make sure that you have got an up to date PHP
version:

.. code-block:: bash

    php -v

You should at least have got installed PHP |minphpversion| (CLI) or higher.
Your webserver's PHP version must also be of |minphpversion| or higher, and
should be the same version your command line interface (CLI) PHP is.

Getting CakePHP
===============

.. TODO::
    Should we use Oven instead?

The easiest way to install CakePHP is to use Composer. Composer is a simple way
of installing CakePHP from your terminal or command line prompt. First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following:

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

Then simply type the following line in your terminal from your
installation directory to install the CakePHP application skeleton
in the **cms** directory of the current working directory:

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

    cd /path/to/our/app

    bin/cake server

.. note::

    For Windows, the command needs to be ``bin\cake server`` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be checkmarks other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Next, we will build our :doc:`Database and create our first model <database>`.
