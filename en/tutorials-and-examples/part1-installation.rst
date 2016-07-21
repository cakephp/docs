Part 1 - Installation
#####################

This tutorial will walk you through the creation of a simple blog application.
To start with, we'll be installing CakePHP, creating our database, and using the
tools CakePHP provides to get our application up fast.

Here's what you'll need:

#. A running web server. We're going to assume you're using Apache, though the
   instructions for using other servers should be very similar. We might have to
   play a little with the server configuration, but most folks can get CakePHP
   up and running without any configuration at all. Make sure you have PHP 5.5.9
   or greater, and that the ``mbstring`` and ``intl`` extensions are enabled in
   PHP.
#. A database server. We're going to be using MySQL server in this tutorial.
   You'll need to know enough about SQL in order to create a database: CakePHP
   will be taking the reins from there. Since we're using MySQL, also make sure
   that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge.

Before starting you should make sure that you have got an up to date PHP
version:

.. code-block:: bash

    php -v

You should at least have got installed PHP 5.5.9 (CLI) or higher.
Your webserver's PHP version must also be of 5.5.9 or higher, and should best be
the same version your command line interface (CLI) PHP version is of.
If you'd like to see the completed application, checkout `cakephp/blog
<https://github.com/cakephp/blog-tutorial>`__. Let's get started!

Let's get started!

Getting CakePHP
===============

The easiest way to install CakePHP is to use Composer. Composer is a simple way
of installing CakePHP from your terminal or command line prompt. First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following::

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

Then simply type the following line in your terminal from your installation
directory to install the CakePHP application skeleton in the **blog**
directory::

    php composer.phar create-project --prefer-dist cakephp/app blog

If you downloaded and ran the `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_, then type the following line in
your terminal from your installation directory (ie.
C:\\wamp\\www\\dev\\cakephp3)::

    composer self-update && composer create-project --prefer-dist cakephp/app blog

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your **config/app.php** file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /blog
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
home page. Before you can do that, you'll need to start the development server::

    bin/cake server

.. note::

    For Windows, the command needs to be ``bin\cake server`` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be checkmarks other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Directory Permissions on tmp and logs
=====================================

The ``tmp`` and ``logs`` directories need to have proper permissions to be
writable by your webserver. If you used Composer for the install, this should
have been done for you and confirmed with a "Permissions set on <folder>"
message. If you instead got an error message or want to do it manually, the best
way would be to find out what user your webserver runs as (``<?= `whoami`; ?>``)
and change the ownership of these two directories to that user. The final
command you run (in \*nix) might look something like this::

    chown -R www-data tmp
    chown -R www-data logs

If for some reason CakePHP can't write to these directories, you'll be
informed by a warning while not in production mode.

While not recommended, if you are unable to set the permissions to the same as
your webserver, you can simply set write permissions on the folder by running a
command such as::

    chmod 777 -R tmp
    chmod 777 -R logs

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes.

The security salt is used for generating hashes. If you used Composer this too is taken
care of for you during the install. Else you'd need to change the default salt value
by editing **config/app.php**. It doesn't matter much what the new value is, as long as
it's not guessable::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],

A Note on mod\_rewrite
======================

Occasionally new users will run into mod\_rewrite issues. For example
if the CakePHP welcome page looks a little funny (no images or CSS styles).
This probably means mod\_rewrite is not functioning on your system. Please refer
to the :ref:`url-rewriting` section to help resolve any issues you are having.


Now that our webserver is well configured and your application is created, you
can continue to :doc:`/tutorials-and-examples/part2-schema-and-manual-crud` to
create and configure your database.

.. meta::
    :title lang=en: Blog Tutorial Part 1 - Installation
    :keywords lang=en: tuto, blog, installation, start, part1
