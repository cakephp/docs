Installation
############

CakePHP is simple and easy to install. The minimum requirements are a web server
and a copy of CakePHP, that's it! While this chapter focuses primarily on
setting up on Apache (because it's simple to install and setup), CakePHP will
run on a variety of web servers such as nginx, LightHTTPD, or Microsoft IIS.

Requirements
============

- HTTP Server. For example: Apache. Having mod\_rewrite is preferred, but
  by no means required.
- PHP |minphpversion| or greater (including PHP 7.1).
- mbstring PHP extension
- intl PHP extension

.. note::

    In both XAMPP and WAMP, the mbstring extension is working by default.

    In XAMPP, intl extension is included but you have to uncomment
    ``extension=php_intl.dll`` in **php.ini** and restart the server through
    the XAMPP Control Panel.

    In WAMP, the intl extension is "activated" by default but not working.
    To make it work you have to go to php folder (by default)
    **C:\\wamp\\bin\\php\\php{version}**, copy all the files that looks like
    **icu*.dll** and paste them into the apache bin directory
    **C:\\wamp\\bin\\apache\\apache{version}\\bin**. Then restart all services
    and it should be OK.

While a database engine isn't required, we imagine that most applications will
utilize one. CakePHP supports a variety of database storage engines:

-  MySQL (5.1.10 or greater)
-  PostgreSQL
-  Microsoft SQL Server (2008 or higher)
-  SQLite 3

.. note::

    All built-in drivers require PDO. You should make sure you have the correct
    PDO extensions installed.

Installing CakePHP
==================

Before starting you should make sure that your PHP version is up to date:

.. code-block:: bash

    php -v

You should have PHP |minphpversion| (CLI) or higher.
Your webserver's PHP version must also be of |minphpversion| or higher, and should be
the same version your command line interface (CLI) uses.

Installing Composer
-------------------

CakePHP uses `Composer <http://getcomposer.org>`_, a dependency management tool,
as the officially supported method for installation.

- Installing Composer on Linux and macOS

  #. Run the installer script as described in the
     `official Composer documentation <https://getcomposer.org/download/>`_
     and follow the instructions to install Composer.
  #. Execute the following command to move the composer.phar to a directory
     that is in your path::

         mv composer.phar /usr/local/bin/composer

- Installing Composer on Windows

  For Windows systems, you can download Composer's Windows installer
  `here <https://github.com/composer/windows-setup/releases/>`__.  Further
  instructions for Composer's Windows installer can be found within the
  README `here <https://github.com/composer/windows-setup>`__.

Create a CakePHP Project
------------------------

Now that you've downloaded and installed Composer, create a new
CakePHP application into my_app_name folder. For this just run the
following composer command:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app my_app_name

Or if Composer is installed globally:

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app my_app_name

Once Composer finishes downloading the application skeleton and the core CakePHP
library, you should have a functioning CakePHP application installed via
Composer. Be sure to keep the composer.json and composer.lock files with the
rest of your source code.

You can now visit the path to where you installed your CakePHP application and
see the default home page. To change the content of this page, edit
**src/Template/Pages/home.ctp**.

Although composer is the recommended installation method, there are
pre-installed downloads available on
`Github <https://github.com/cakephp/cakephp/tags>`__.
Those downloads contain the app skeleton with all vendor packages installed.
Also it includes the ``composer.phar`` so you have everything you need for
further use.

Keeping Up To Date with the Latest CakePHP Changes
--------------------------------------------------

By default this is what your application **composer.json** looks like::

    "require": {
        "cakephp/cakephp": "3.5.*"
    }

Each time you run ``php composer.phar update`` you will receive bugfix
releases for this minor version. You can instead change this to ``^3.5`` to
also receive the latest stable minor releases of the ``3.x`` branch.

If you want to stay up to date with the latest unreleased changes in CakePHP,
designate **dev-master** as the package version in your application's
**composer.json**::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

Be aware that this is not recommended, as your application can break when the next major
version is released. Additionally, composer does not cache development
branches, so it slows down consecutive composer installs/updates.

Installation using Oven
-----------------------

Another quick way to install CakePHP is `Oven <https://github.com/CakeDC/oven>`_.
It is a simple PHP script which checks the necessary system requirements,
installs the CakePHP application skeleton, and sets up the development environment.

After the installation completes, your CakePHP application is ready to go!

.. note::

    IMPORTANT: This is not a deployment script. It is aimed to help developers install
    CakePHP for the first time and set up a development environment quickly. Production
    environments should consider several other factors, like file permissions,
    virtualhost configuration, etc.

Permissions
===========

CakePHP uses the **tmp** directory for a number of different operations.
Model descriptions, cached views, and session information are a few
examples. The **logs** directory is used to write log files by the default
``FileLog`` engine.

As such, make sure the directories **logs**, **tmp** and all its subdirectories
in your CakePHP installation are writable by the web server user. Composer's
installation process makes **tmp** and its subfolders globally writeable to get
things up and running quickly but you can update the permissions for better
security and keep them writable only for the web server user.

One common issue is that **logs** and **tmp** directories and subdirectories
must be writable both by the web server and the command line user. On a UNIX
system, if your web server user is different from your command line user, you
can run the following commands from your application directory just once in your
project to ensure that permissions will be setup properly:

.. code-block:: bash

    HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
    setfacl -R -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -m u:${HTTPDUSER}:rwx logs
    setfacl -R -d -m u:${HTTPDUSER}:rwx logs

In order to use the CakePHP console tools, you need to ensure that
``bin/cake`` file is executable. On \*nix or macOS, you can
execute:

.. code-block:: bash

    chmod +x bin/cake

On Windows, the **.bat** file should be executable already. If you are using
a Vagrant, or any other virtualized environment, any shared directories need to
be shared with execute permissions (Please refer to your virtualized
environment's documentation on how to do this).

If, for whatever reason, you cannot change the permissions of the ``bin/cake``
file, you can run the CakePHP console with:

.. code-block:: bash

    php bin/cake.php

Development Server
==================

A development installation is the fastest way to setup CakePHP. In this
example, we use CakePHP's console to run PHP's built-in web server which
will make your application available at **http://host:port**. From the app
directory, execute:

.. code-block:: bash

    bin/cake server

By default, without any arguments provided, this will serve your application at
**http://localhost:8765/**.

If there is conflict with **localhost** or port 8765, you can tell
the CakePHP console to run the web server on a specific host and/or port
utilizing the following arguments:

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

This will serve your application at **http://192.168.13.37:5673/**.

That's it! Your CakePHP application is up and running without having to
configure a web server.

.. warning::

    The development server should *never* be used in a production environment.
    It is only intended as a basic development server.

If you'd prefer to use a real web server, you should be able to move your CakePHP
install (including the hidden files) inside your web server's document root. You
should then be able to point your web-browser at the directory you moved the
files into and see your application in action.

Production
==========

A production installation is a more flexible way to setup CakePHP. Using this
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

Developers using Apache should set the ``DocumentRoot`` directive for the domain
to:

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

If your web server is configured correctly, you should now find your CakePHP
application accessible at http://www.example.com.

Fire It Up
==========

Alright, let's see CakePHP in action. Depending on which setup you used, you
should point your browser to http://example.com/ or http://localhost:8765/. At
this point, you'll be presented with CakePHP's default home, and a message that
tells you the status of your current database connection.

Congratulations! You are ready to :doc:`create your first CakePHP application
</quickstart>`.

.. _url-rewriting:

URL Rewriting
=============

Apache
------

While CakePHP is built to work with mod\_rewrite out of the box–and usually
does–we've noticed that a few users struggle with getting everything to play
nicely on their systems.

Here are a few things you might try to get it running correctly. First look at
your httpd.conf. (Make sure you are editing the system httpd.conf rather than a
user- or site-specific httpd.conf.)

These files can vary between different distributions and Apache versions. You
may also take a look at http://wiki.apache.org/httpd/DistrosDefaultLayout for
further information.

#. Make sure that an .htaccess override is allowed and that AllowOverride is set
   to All for the correct DocumentRoot. You should see something similar to:

   .. code-block:: apacheconf

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

#. Make sure you are loading mod\_rewrite correctly. You should see something
   like:

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   In many systems these will be commented out by default, so you may just need
   to remove the leading # symbols.

   After you make changes, restart Apache to make sure the settings are active.

   Verify that your .htaccess files are actually in the right directories. Some
   operating systems treat files that start with '.' as hidden and therefore
   won't copy them.

#. Make sure your copy of CakePHP comes from the downloads section of the site
   or our Git repository, and has been unpacked correctly, by checking for
   .htaccess files.

   CakePHP app directory (will be copied to the top directory of your
   application by bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   CakePHP webroot directory (will be copied to your application's web root by
   bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   If your CakePHP site still has problems with mod\_rewrite, you might want to
   try modifying settings for Virtual Hosts. On Ubuntu, edit the file
   **/etc/apache2/sites-available/default** (location is
   distribution-dependent). In this file, ensure that ``AllowOverride None`` is
   changed to ``AllowOverride All``, so you have:

   .. code-block:: apacheconf

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

   On macOS, another solution is to use the tool
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_ to make a Virtual
   Host to point to your folder.

   For many hosting services (GoDaddy, 1and1), your web server is being
   served from a user directory that already uses mod\_rewrite. If you are
   installing CakePHP into a user directory
   (http://example.com/~username/cakephp/), or any other URL structure that
   already utilizes mod\_rewrite, you'll need to add RewriteBase statements to
   the .htaccess files CakePHP uses (.htaccess, webroot/.htaccess).

   This can be added to the same section with the RewriteEngine directive, so
   for example, your webroot .htaccess file would look like:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   The details of those changes will depend on your setup, and can include
   additional things that are not related to CakePHP. Please refer to Apache's
   online documentation for more information.

#. (Optional) To improve production setup, you should prevent invalid assets
   from being parsed by CakePHP. Modify your webroot .htaccess to something
   like:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   The above will prevent incorrect assets from being sent to index.php
   and instead display your web server's 404 page.

   Additionally you can create a matching HTML 404 page, or use the default
   built-in CakePHP 404 by adding an ``ErrorDocument`` directive:

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found

nginx
-----

nginx does not make use of .htaccess files like Apache, so it is necessary to
create those rewritten URLs in the site-available configuration. This is usually
found in ``/etc/nginx/sites-available/your_virtual_host_conf_file``. Depending
on your setup, you will have to modify this, but at the very least, you will
need PHP running as a FastCGI instance.
The following configuration redirects the request to ``webroot/index.php``:

.. code-block:: nginx

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

A sample of the server directive is as follows:

.. code-block:: nginx

    server {
        listen   80;
        listen   [::]:80;
        server_name www.example.com;
        return 301 http://example.com$request_uri;
    }

    server {
        listen   80;
        listen   [::]:80;
        server_name example.com;

        root   /var/www/example.com/public/webroot;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include fastcgi_params;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_intercept_errors on;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

.. note::
    Recent configurations of PHP-FPM are set to listen to the unix php-fpm
    socket instead of TCP port 9000 on address 127.0.0.1. If you get 502 bad
    gateway errors from the above configuration, try update ``fastcgi_pass`` to
    use the unix socket path (eg: fastcgi_pass
    unix:/var/run/php/php7.1-fpm.sock;) instead of the TCP port.

IIS7 (Windows hosts)
--------------------

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:


#. Use `Microsoft's Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_
   to install the URL `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   or download it directly (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Create a new file called web.config in your CakePHP root folder.
#. Using Notepad or any XML-safe editor, copy the following
   code into your new web.config file:

.. code-block:: xml

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

Once the web.config file is created with the correct IIS-friendly rewrite rules,
CakePHP's links, CSS, JavaScript, and rerouting should work correctly.

I Can't Use URL Rewriting
-------------------------

If you don't want or can't get mod\_rewrite (or some other compatible module)
running on your server, you will need to use CakePHP's built in pretty URLs.
In **config/app.php**, uncomment the line that looks like::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Also remove these .htaccess files::

    /.htaccess
    webroot/.htaccess

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather than
www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=en: Installation
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
