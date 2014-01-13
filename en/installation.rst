Installation
############

CakePHP is fast and easy to install. The minimum requirements are a
web server and a copy of CakePHP, that's it! While this manual focuses
primarily on setting up on Apache (because it's the most commonly used),
you can configure CakePHP to run on a variety of web servers such as
nginx, LightHTTPD, or Microsoft IIS.

Requirements
============

- HTTP Server. For example: Apache. mod\_rewrite is preferred, but
  by no means required.
- PHP 5.4.3 or greater.
- mbstring extension
- mcrypt extension

Technically a database engine isn't required, but we imagine that
most applications will utilize one. CakePHP supports a variety of
database storage engines:

-  MySQL (4 or greater)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    All built-in drivers require PDO. You should make sure you have the
    correct PDO extensions installed.

License
=======

CakePHP is licensed under the
`MIT license <http://www.opensource.org/licenses/mit-license.php>`_. This means
that you are free to modify, distribute and republish the source code on the
condition that the copyright notices are left intact. You are also free to
incorporate CakePHP into any commercial or closed source application.

Installing CakePHP
===================

There are a few ways to get a fresh copy of CakePHP. You can
either download an archived copy (zip/tar.gz/tar.bz2) from a GitHub release,
use Composer, or clone the application skeleton from the GitHub repository.

Downloading a Zip File
----------------------

To download a pre-built release of CakePHP, visit the main
website `http://cakephp.org <http://cakephp.org>`_ and
follow the "Download Now" link.

All current releases of CakePHP are hosted on `GitHub`_. GitHub houses both
CakePHP itself as well as many other plugins for CakePHP. The CakePHP releases
are available as `GitHub tags <https://github.com/cakephp/cakephp/releases>`_.

Installing with Composer
------------------------

`Composer <http://getcomposer.org>`_ is a dependency management tool for
PHP 5.3+. It solves many of the problems the PEAR installer has, and
simplifies managing multiple versions of libraries. Since CakePHP publishes
a PEAR package you can install CakePHP via Composer using the ``cakephp/app``
package.

First, you'll need to download and install Composer if you haven't
done so already. If you have cURL installed, it's as easy as running the
following::

    curl -s https://getcomposer.org/installer | php

Now that you've downloaded and installed Composer, you can get a new CakePHP
application by running::

    php composer.phar create-project -s dev cakephp/app

Once Composer finishes downloading the application skeleton and the core
CakePHP library, you should now have a functioning CakePHP application
installed via Composer. Be sure to keep the composer.json and composer.lock
files with the rest of your source code.


Installing with Git & GitHub
----------------------------

In CakePHP 3.0, the `application skeleton <https://github.com/cakephp/app>`_
and the `core CakePHP library <https://github.com/cakephp/cakephp>`_ has been
split into two seperate repositories. You can fork and/or clone the application
skeleton project using Git + GitHub. This will also allow you to easily
contribute changes back to the application skeleton.

Once you've cloned the application skeleton, you will need to clone the core
CakePHP library into ``vendor/cakephp/cakephp``. After cloning the core
CakePHP library, uncomment the section using ``Cake\Core\ClassLoader`` in
``App/Config/bootstrap.php``, and copy ``App/Config/app.default.php`` to
``App/Config/app.php``.

You should now be able to visit the path to where you installed your CakePHP
application and see the setup traffic lights.

Keeping up to date with the latest CakePHP changes
--------------------------------------------------

If you want to keep current with the latest changes in CakePHP you can
add the following to your application's ``composer.json``::

    "require": {
        "cakephp/cakephp": "dev-<branch>"
    }

Where ``<branch>`` is the branch name you want to follow. Each time you run
``php composer.phar update`` you will receive the latest changes in the chosen
branch.

Permissions
===========

CakePHP uses the ``tmp`` directory for a number of different
operations. Model descriptions, cached views, and session
information are just a few examples.

As such, make sure the directory ``tmp`` and all its subdirectories in your
CakePHP installation are writable by the web server user.

Setup
=====

Setting up CakePHP can be as simple as slapping it in your web
server's document root, or as complex and flexible as you wish.
This section will cover the three main installation types for
CakePHP: development, production, and advanced.

-  Development: easy to get going, URLs for the application include
   the CakePHP installation directory name, and less secure.
-  Production: Requires the ability to configure the web server's
   document root, clean URLs, very secure.

Development
===========

A development installation is the fastest method to setup CakePHP.
This example will help you install a CakePHP application and make
it available at http://www.example.com/cake3/. We assume for
the purposes of this example that your document root is set to
``/var/www/html``.

After installing your application using one of the methods above into
``/var/www/html``. You now have a folder in your document root named after the
release you've downloaded (e.g. cake3). Rename this folder to cake3.
Your development setup will look like this on the file system::

    /var/www/html/
        cake3/
            App/
            Plugin/
            tmp/
            vendor/
            webroot/
            .htaccess
            index.php
            README.md

If your web server is configured correctly, you should now find
your CakePHP application accessible at
http://www.example.com/cake3/.

Production
==========

A production installation is a more flexible way to setup CakePHP.  Using this
method allows an entire domain to act as a single CakePHP application. This
example will help you install CakePHP anywhere on your filesystem and make it
available at http://www.example.com. Note that this installation may require the
rights to change the ``DocumentRoot`` on Apache webservers.

After installing your application using one of the methods above into the
directory of your choosing - we'll assume you chose /cake_install - your
production setup will look like this on the file system::

    /cake_install/
        App/
        Plugin/
        tmp/
        vendor/
        webroot/ (this directory is set as DocumentRoot)
        .htaccess
        index.php
        README.md

Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/webroot

If your web server is configured correctly, you should now find
your CakePHP application accessible at http://www.example.com.

Advanced Installation and URL Rewriting
=======================================

.. toctree::

    installation/advanced-installation
    installation/url-rewriting

Fire It Up
==========

Alright, let's see CakePHP in action. Depending on which setup you
used, you should point your browser to http://example.com/ or
http://example.com/cake3/. At this point, you'll be
presented with CakePHP's default home, and a message that tells you
the status of your current database connection.

Congratulations! You are ready to :doc:`create your first CakePHP
application </getting-started>`.

Not working? If you're getting timezone related error from PHP
uncomment the related line in ``App/Config/bootstrap.php``::

   /**
    * Uncomment this line and correct your server timezone to fix 
    * any date & time related errors.
    */
       date_default_timezone_set('UTC');


.. _Github: http://github.com/cakephp/cakephp
.. _composer: http://getcomposer.com

.. meta::
    :title lang=en: Installation
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
