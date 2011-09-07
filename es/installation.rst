Installation
############

CakePHP is fast and easy to install. The minimum requirements are a
webserver and a copy of Cake, that's it! While this manual focuses
primarily on setting up with Apache (because it's the most common),
you can configure Cake to run on a variety of web servers such as
LightHTTPD or Microsoft IIS.

Installation preparation consists of the following steps:

-  Downloading a copy of CakePHP
-  Configuring your web server to handle php if necessary
-  Checking file permissions

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
bug-fixes and up to the minute(well, to the day) enhancements.
These can be accessed from github by cloning the repository.
`Github`_.


Permissions
===========

CakePHP uses the ``/app/tmp`` directory for a number of different
operations. Model descriptions, cached views, and session
information are just a few examples.

As such, make sure the ``/app/tmp`` directory in your cake installation
is writable by the web server user.

Setup
============

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

Congratulations! You are ready to create your first CakePHP
application.

Not working? If you're getting timezone related error from PHP
uncomment one line in app/Config/core.php::

   <?php
   /**
    * If you are on PHP 5.3 uncomment this line and correct your server timezone
    * to fix the date & time related errors.
    */
       date_default_timezone_set('UTC');
