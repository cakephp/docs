Installation
############

CakePHP is fast and easy to install. The minimum requirements are a
webserver and a copy of Cake, that's it! While this manual focuses
primarily on setting up with Apache (because it's the most common),
you can configure Cake to run on a variety of web servers such as
LightHTTPD or Microsoft IIS.

Requirements
============

- HTTP Server. For example: Apache. mod\_rewrite is preferred, but
  by no means required.
- PHP 5.4.3 or greater.
- mbstring extension

Technically a database engine isn't required, but we imagine that
most applications will utilize one. CakePHP supports a variety of
database storage engines:

-  MySQL (4 or greater)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    The built-in drivers all require PDO.  You should make sure you have the
    correct PDO extensions installed.

License
=======

CakePHP is licensed under the MIT license.  This means that you are free to
modify, distribute and republish the source code on the condition that the
copyright notices are left intact.  You are also free to incorporate CakePHP
into any Commercial or closed source application.

Downloading CakePHP
===================

There are a few ways to get a fresh copy of CakePHP. You can
either download an archive copy (zip/tar.gz/tar.bz2) from the
website, check out the code from the git repository, or use composer.

Downloading a zip file
----------------------

To download the latest major release of CakePHP. Visit the main
website `http://cakephp.org <http://cakephp.org>`_ and
follow the "Download Now" link.

All current releases of CakePHP are hosted on
`Github`_. Github houses both CakePHP
itself as well as many other plugins for CakePHP. The CakePHP
releases are available at
`Github tags <https://github.com/cakephp/cakephp/tags>`_.

Using git & github
------------------

If you want to contribute to CakePHP, or have access to bug-fixes and changes as
they happen, you can use git. The CakePHP git repository is hosted on github. Cloning the 
`Github`_ repository can be done by running::

    git clone git://github.com/cakephp/cakephp.git


Using composer
--------------

You can use `composer`_ to install CakePHP using the ``cakephp-app`` package.
First you'll need to download and install composer if you haven't done so
already::

    curl -s https://getcomposer.org/installer | php

Assuming you've downloaded and installed composer, you can get a new CakePHP
application by running::

    php composer.phar create-project cakephp/cakephp-app

This will download the CakePHP skeleton application and install CakePHP.

Permissions
===========

CakePHP uses the ``App/tmp`` directory for a number of different
operations. Model descriptions, cached views, and session
information are just a few examples.

As such, make sure the directory ``App/tmp`` and all its subdirectories in your cake installation
are writable by the web server user.

Setup
=====

Setting up CakePHP can be as simple as slapping it in your web
server’s document root, or as complex and flexible as you wish.
This section will cover the three main installation types for
CakePHP: development, production, and advanced.

-  Development: easy to get going, URLs for the application include
   the CakePHP installation directory name, and less secure.
-  Production: Requires the ability to configure the web server’s
   document root, clean URLs, very secure.
-  Advanced: With some configuration, allows you to place key
   CakePHP directories in different parts of the filesystem, possibly
   sharing a single CakePHP core library folder amongst many CakePHP
   applications.

Development
===========

A development installation is the fastest method to setup Cake.
This example will help you install a CakePHP application and make
it available at http://www.example.com/cake3/. We assume for
the purposes of this example that your document root is set to
``/var/www/html``.

Unpack the contents of the Cake archive into ``/var/www/html``. You now
have a folder in your document root named after the release you've
downloaded (e.g. cake3). Rename this folder to cake3.
Your development setup will look like this on the file system::

    /var/www/html/
        cake3/
            App/
            lib/
            .htaccess
            index.php
            README

If your web server is configured correctly, you should now find
your Cake application accessible at
http://www.example.com/cake3/.

Production
==========

A production installation is a more flexible way to setup Cake.
Using this method allows an entire domain to act as a single
CakePHP application. This example will help you install Cake
anywhere on your filesystem and make it available at
http://www.example.com. Note that this installation may require the
rights to change the ``DocumentRoot`` on Apache webservers.

Unpack the contents of the Cake archive into a directory of your
choosing. For the purposes of this example, we assume you choose to
install Cake into /cake\_install. Your production setup will look
like this on the filesystem::

    /cake_install/
        App/
            webroot/ (this directory is set as the `DocumentRoot`
             directive)
        lib/
        .htaccess
        index.php
        README

Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/App/webroot

If your web server is configured correctly, you should now find
your Cake application accessible at http://www.example.com.

Advanced Installation and URL Rewriting
=======================================

.. toctree::

    installation/advanced-installation
    installation/url-rewriting

Fire It Up
==========

Alright, let's see CakePHP in action. Depending on which setup you
used, you should point your browser to http://example.com/ or
http://example.com/cake\_install/. At this point, you'll be
presented with CakePHP's default home, and a message that tells you
the status of your current database connection.

Congratulations! You are ready to :doc:`create your first CakePHP
application </getting-started>`.

Not working? If you're getting timezone related error from PHP
uncomment one line in ``App/Config/app.php``::

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
