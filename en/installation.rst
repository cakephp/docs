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
- PHP 5.4.19 or greater.
- mbstring extension
- mcrypt extension
- intl extension

Technically a database engine isn't required, but we imagine that
most applications will utilize one. CakePHP supports a variety of
database storage engines:

-  MySQL (5.1.10 or greater)
-  PostgreSQL
-  Microsoft SQL Server (2008 or higher)
-  SQLite 3

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

CakePHP uses `Composer <http://getcomposer.org>`_, a dependency management tool for
PHP 5.3+, as the officially supported method for installation.

First, you'll need to download and install Composer if you haven't
done so already. If you have cURL installed, it's as easy as running the
following::

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

For Windows systems, you can download Composer's Windows installer
`here <https://github.com/composer/windows-setup/releases/>`_.  Further
instructions for Composer's Windows installer can be found within the README
`here <https://github.com/composer/windows-setup>`_.

Now that you've downloaded and installed Composer, you can get a new CakePHP
application by running::

    php composer.phar create-project -s dev cakephp/app

Once Composer finishes downloading the application skeleton and the core
CakePHP library, you should now have a functioning CakePHP application
installed via Composer. Be sure to keep the composer.json and composer.lock
files with the rest of your source code.

You should now be able to visit the path to where you installed your CakePHP
application and see the setup traffic lights.

Keeping Up To Date with the Latest CakePHP Changes
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
CakePHP installation are writable by the web server user. Composer's installation
process makes ``tmp`` and it's subfolders globally writeable to get things up
and running quickly but you can update the permissions for better security and
keep them writable only for the webserver user.

One common issue is that the app/tmp directories and subdirectories must be writable both by the web server and the command line user.
On a UNIX system, if your web server user is different from your command line user,
you can run the following commands just once in your project to ensure that
permissions will be setup properly::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

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
In this example, we will be using CakePHP's console to run PHP's built-in
web server which will make your application available at
``http://host:port``.  From the ``src`` directory, execute::

    Console/cake server

By default, without any arguments provided, this will serve your application
at ``http://localhost:8765/``.

If you have something conflicting with ``localhost`` or ``port 8765``, you can
tell the CakePHP console to run the web server on a specific host and/or port
utilizing the following arguments::

    Console/cake server -H 192.168.13.37 -p 5673

This will serve your application at ``http://192.168.13.37:5673/``.

That's it!  Your CakePHP application is up and running without having to
configure a web server.

.. warning::

    The development server should ever be used in a production environment. It
    is only intended as a minimal development server.

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
        config/
        src/
        plugins/
        tests/
        tmp/
        vendor/
        webroot/ (this directory is set as DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        README.md
        composer.json
        phpunit.xml.dist

Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/webroot

If your web server is configured correctly, you should now find
your CakePHP application accessible at http://www.example.com.

URL Rewriting
=============

.. toctree::
    :maxdepth: 1

    installation/url-rewriting

Fire It Up
==========

Alright, let's see CakePHP in action. Depending on which setup you
used, you should point your browser to http://example.com/ or
http://localhost:8765/. At this point, you'll be
presented with CakePHP's default home, and a message that tells you
the status of your current database connection.

Congratulations! You are ready to :doc:`create your first CakePHP
application </getting-started>`.


.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.com

.. meta::
    :title lang=en: Installation
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
