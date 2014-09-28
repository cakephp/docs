Installation
############

CakePHP is simple and easy to install. The minimum requirements are a
web server and a copy of CakePHP, that's it! While this chapter focuses
primarily on setting up on Apache (because it's simple to install and setup),
CakePHP will run on a variety of web servers such as nginx, LightHTTPD, or
Microsoft IIS.

Requirements
============

- HTTP Server. For example: Apache. Having mod\_rewrite is preferred, but
  by no means required.
- PHP 5.4.16 or greater.
- mbstring extension
- mcrypt extension
- intl extension

While a database engine isn't required, we imagine that most applications will
utilize one. CakePHP supports a variety of database storage engines:

-  MySQL (5.1.10 or greater)
-  PostgreSQL
-  Microsoft SQL Server (2008 or higher)
-  SQLite 3

.. note::

    All built-in drivers require PDO. You should make sure you have the
    correct PDO extensions installed.

Installing CakePHP
===================

CakePHP uses `Composer <http://getcomposer.org>`_, a dependency management tool
for PHP 5.3+, as the officially supported method for installation.

First, you'll need to download and install Composer if you haven't
done so already. If you have cURL installed, it's as easy as running the
following::

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

For Windows systems, you can download Composer's Windows installer
`here <https://github.com/composer/windows-setup/releases/>`__.  Further
instructions for Composer's Windows installer can be found within the README
`here <https://github.com/composer/windows-setup>`_.

Now that you've downloaded and installed Composer, you can get a new CakePHP
application by running::

    php composer.phar create-project --prefer-dist -s dev cakephp/app [app_name]

Or if Composer is installed globally::

    composer create-project --prefer-dist -s dev cakephp/app [app_name]

Once Composer finishes downloading the application skeleton and the core
CakePHP library, you should have a functioning CakePHP application
installed via Composer. Be sure to keep the composer.json and composer.lock
files with the rest of your source code.

You can now visit the path to where you installed your CakePHP application and
see the setup traffic lights.

Keeping Up To Date with the Latest CakePHP Changes
--------------------------------------------------

If you want to keep current with the latest changes in CakePHP you can
add the following to your application's ``composer.json``::

    "require": {
        "cakephp/cakephp": "3.0.*-dev"
    }

Where ``<branch>`` is the branch name you want to follow. Each time you run
``php composer.phar update`` you will receive the latest changes in the chosen
branch.

Permissions
===========

CakePHP uses the ``tmp`` directory for a number of different operations.
Model descriptions, cached views, and session information are just a few examples.
The ``logs`` directory is used to write log files by the default ``FileLog`` engine.

As such, make sure the directories ``logs``, ``tmp`` and all its subdirectories
in your CakePHP installation are writable by the web server user. Composer's
installation process makes ``tmp`` and it's subfolders globally writeable to get
things up and running quickly but you can update the permissions for better
security and keep them writable only for the webserver user.

One common issue is that ``logs`` and ``tmp`` directories and subdirectories must be
writable both by the web server and the command line user. On a UNIX system, if
your web server user is different from your command line user, you can run the
following commands from your application directory just once in your project to
ensure that permissions will be setup properly::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Development Server
==================

A development installation is the fastest method to setup CakePHP.  In this
example, we will be using CakePHP's console to run PHP's built-in web server
which will make your application available at ``http://host:port``. From the app
directory, execute::

    bin/cake server

By default, without any arguments provided, this will serve your application at
``http://localhost:8765/``.

If you have something conflicting with ``localhost`` or port ``8765``, you can
tell the CakePHP console to run the web server on a specific host and/or port
utilizing the following arguments::

    bin/cake server -H 192.168.13.37 -p 5673

This will serve your application at ``http://192.168.13.37:5673/``.

That's it! Your CakePHP application is up and running without having to
configure a web server.

.. warning::

    The development server should *never* be used in a production environment.
    It is only intended as a basic development server.

If you'd prefer to use a real webserver, you should be able to move your CakePHP
install (including the hidden files) inside your webserver's document root. You
should then be able to point your web-browser at the directory you moved the
files into and see your application in action.

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
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (this directory is set as DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/webroot

If your web server is configured correctly, you should now find
your CakePHP application accessible at http://www.example.com.


Fire It Up
==========

Alright, let's see CakePHP in action. Depending on which setup you
used, you should point your browser to http://example.com/ or
http://localhost:8765/. At this point, you'll be
presented with CakePHP's default home, and a message that tells you
the status of your current database connection.

Congratulations! You are ready to :doc:`create your first CakePHP
application </quickstart>`.

.. _url-rewriting:

URL Rewriting
=============

Apache
------

While CakePHP is built to work with mod\_rewrite out of the box–and
usually does–we've noticed that a few users struggle with getting
everything to play nicely on their systems.

Here are a few things you might try to get it running correctly.
First look at your httpd.conf. (Make sure you are editing the system
httpd.conf rather than a user- or site-specific httpd.conf.)

These files can vary between different distributions and Apache versions.  You
may also take a look at http://wiki.apache.org/httpd/DistrosDefaultLayout for
further information.

#. Make sure that an .htaccess override is allowed and that
   AllowOverride is set to All for the correct DocumentRoot. You
   should see something similar to::

       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories).
       #
       # First, we configure the "default" to be a very restrictive set of
       # features.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Make sure you are loading mod\_rewrite correctly. You should
   see something like::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   In many systems these will be commented out by default, so you may
   just need to remove the leading # symbols.

   After you make changes, restart Apache to make sure the settings
   are active.

   Verify that your .htaccess files are actually in the right
   directories. Some operating systems treat files that start
   with '.' as hidden and therefore won't copy them.

#. Make sure your copy of CakePHP comes from the downloads section of
   the site or our Git repository, and has been unpacked correctly, by
   checking for .htaccess files.

   CakePHP app directory (will be copied to the top directory of your
   application by bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   CakePHP webroot directory (will be copied to your application's web
   root by bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   If your CakePHP site still has problems with mod\_rewrite, you might
   want to try modifying settings for Virtual Hosts. On Ubuntu,
   edit the file /etc/apache2/sites-available/default (location is
   distribution-dependent). In this file, ensure that
   ``AllowOverride None`` is changed to ``AllowOverride All``, so you have::

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options Indexes FollowSymLinks MultiViews
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   On Mac OSX, another solution is to use the tool
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_
   to make a Virtual Host to point to your folder.

   For many hosting services (GoDaddy, 1and1), your web server is
   actually being served from a user directory that already uses
   mod\_rewrite. If you are installing CakePHP into a user directory
   (http://example.com/~username/cakephp/), or any other URL structure
   that already utilizes mod\_rewrite, you'll need to add RewriteBase
   statements to the .htaccess files CakePHP uses (.htaccess,
   webroot/.htaccess).

   This can be added to the same section with the RewriteEngine
   directive, so for example, your webroot .htaccess file would look
   like::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   The details of those changes will depend on your setup, and can
   include additional things that are not related to CakePHP. Please refer
   to Apache's online documentation for more information.

#. (Optional) To improve production setup, you should prevent invalid assets
   from being parsed by CakePHP. Modify your webroot .htaccess to something
   like::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   The above will simply prevent incorrect assets from being sent to index.php
   and instead display your webserver's 404 page.

   Additionally you can create a matching HTML 404 page, or use the default
   built-in CakePHP 404 by adding an ``ErrorDocument`` directive::

       ErrorDocument 404 /404-not-found

nginx
-----

nginx does not make use of .htaccess files like Apache, so it is necessary to
create those rewritten URLs in the site-available configuration. Depending upon
your setup, you will have to modify this, but at the very least,
you will need PHP running as a FastCGI instance::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

IIS7 (Windows hosts)
--------------------

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:


#. Use `Microsoft's Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_ to install the URL
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ or download it directly (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Create a new file called web.config in your CakePHP root folder.
#. Using Notepad or any XML-safe editor, copy the following
   code into your new web.config file::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Exclude direct access to webroot/*"
                      stopProcessing="true">
                        <match url="^webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="webroot/{R:1}{R:2}"
                          appendQueryString="false" />
                    </rule>
                    <rule name="Rewrite requested file/folder to index.php"
                      stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="index.php"
                          appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, CSS, JavaScipt, and rerouting should work
correctly.

I Can't Use URL Rewriting
-------------------------

If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use CakePHP's built in pretty URLs. In ``config/app.php``,
uncomment the line that looks like::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Also remove these .htaccess files::

    /.htaccess
    webroot/.htaccess

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=en: Installation
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
