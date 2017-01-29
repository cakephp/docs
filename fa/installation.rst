Installation
############

CakePHP is fast and easy to install. The minimum requirements are a
webserver and a copy of Cake, that's it! While this manual focuses
primarily on setting up with Apache (because it's the most common),
you can configure Cake to run on a variety of web servers such as
LightHTTPD or Microsoft IIS.

Requirements
============

-  HTTP Server. For example: Apache. mod\_rewrite is preferred, but
   by no means required.
-  PHP 5.2.6 or greater.

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

There are two main ways to get a fresh copy of CakePHP. You can
either download an archive copy (zip/tar.gz/tar.bz2) from the main
website, or check out the code from the git repository.

To download the latest major release of CakePHP. Visit the main
website `http://www.cakephp.org <http://www.cakephp.org>`_ and
follow the "Download Now" link.

All current releases of CakePHP are hosted on
`Github <http://github.com/cakephp/cakephp>`_. Github houses both CakePHP
itself as well as many other plugins for CakePHP. The CakePHP
releases are available at
`Github downloads <http://github.com/cakephp/cakephp/downloads>`_.

Alternatively you can get fresh off the press code, with all the
bug-fixes and up to the minute enhancements.
These can be accessed from github by cloning the 
`Github`_ repository::

    git clone git://github.com/cakephp/cakephp.git


Permissions
===========

CakePHP uses the ``app/tmp`` directory for a number of different
operations. Model descriptions, cached views, and session
information are just a few examples.

As such, make sure the directory ``app/tmp`` and all its subdirectories in your cake installation
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
it available at http://www.example.com/cake\_2\_0/. We assume for
the purposes of this example that your document root is set to
``/var/www/html``.

Unpack the contents of the Cake archive into ``/var/www/html``. You now
have a folder in your document root named after the release you've
downloaded (e.g. cake\_2.0.0). Rename this folder to cake\_2\_0.
Your development setup will look like this on the file system:


-  /var/www/html

  -  /cake\_2\_0

     -  /app
     -  /lib
     -  /vendors
     -  /plugins
     -  /.htaccess
     -  /index.php
     -  /README


If your web server is configured correctly, you should now find
your Cake application accessible at
http://www.example.com/cake\_2\_0/.

Using one CakePHP checkout for multiple applications
----------------------------------------------------

If you are developing a number of applications it often makes sense
to have the share the same CakePHP core checkout. There are a few ways you can
accomplish this.  Often the easiest is to use PHP's ``include_path``. To start
off, clone CakePHP into a directory.  For this example we'll use
``~/projects``::

    git clone git://github.com/cakephp/cakephp.git ~/projects/cakephp

This will clone CakePHP into your ``~/projects`` directory.  If you don't want
to use git, you can download a zipball and the remaining steps will be the
same.  Next you'll have to locate and modify your ``php.ini``.  On \*nix systems
this is often in ``/etc/php.ini``, but using ``php -i`` and looking for 'Loaded
Configuration File'.  Once you've found the correct ini file, modify the
``include_path`` configuration to include ``~/projects/cakephp/lib``.  An
example would look like::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

After restarting your webserver, you should see the changes reflected in
``phpinfo()``.

.. note::

    If you are on windows separate include paths with ; instead of :

Once you have setup your ``include_path`` your applications should be able to
find CakePHP automatically.

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
like this on the filesystem:


-  /cake\_install/
   
   -  /app
      
      -  /webroot (this directory is set as the ``DocumentRoot``
         directive)

   -  /lib
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README


Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/app/webroot

If your web server is configured correctly, you should now find
your Cake application accessible at http://www.example.com.

Advanced Installation and server specific configuration
=======================================================

.. toctree::

   installation/advanced-installation

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
uncomment one line in ``app/Config/core.php``::

   <?php
   /**
    * Uncomment this line and correct your server timezone to fix 
    * any date & time related errors.
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=en: Installation
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
