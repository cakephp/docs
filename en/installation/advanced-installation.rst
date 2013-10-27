Advanced Installation
#####################

Installing CakePHP with PEAR installer
======================================

CakePHP publishes a PEAR package that you can install using the pear installer.
Installing with the pear installer can simplify sharing CakePHP libraries
across multiple applications. To install CakePHP with pear you'll need to do the
following::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    On some systems installing libraries with pear will require ``sudo``.

After installing CakePHP with pear, if pear is configured correctly you should
be able to use the ``cake`` command to create a new application. Since CakePHP
will be located on PHP's ``include_path`` you won't need to make any other
changes.


Installing CakePHP with composer
================================

Composer is a dependency management tool for PHP 5.3+. It solves many of the
problems the PEAR installer has, and simplifies managing multiple versions of
libraries. Since CakePHP publishes a PEAR package you can install CakePHP using
`composer <http://getcomposer.org>`_. Before installing CakePHP you'll need to
setup a ``composer.json`` file. A composer.json file for a CakePHP applications
would look like the following::

    {
        "name": "example-app",
        "repositories": [
            {
                "type": "pear",
                "url": "http://pear.cakephp.org"
            }
        ],
        "require": {
            "pear-cakephp/cakephp": ">=2.4.0"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

Save this JSON into ``composer.json`` in the root directory of your project.
Next download the composer.phar file into your project. After you've downloaded
composer, install CakePHP. In the same directory as your ``composer.json`` run
the following::

    $ php composer.phar install

Once composer has finished running you should have a directory structure that looks like::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            pear-pear.cakephp.org/

You are now ready to generate the rest of your application skeleton::

    $ Vendor/bin/cake bake project <path to project>

By default ``bake`` will hard-code :php:const:`CAKE_CORE_INCLUDE_PATH`. To
make your application more portable you should modify ``webroot/index.php``,
changing ``CAKE_CORE_INCLUDE_PATH`` to be a relative path::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . DS . APP_DIR . '/Vendor/pear-pear.cakephp.org/CakePHP'
    );

If you're installing any other libraries with composer, you'll need to setup
the autoloader, and work around an issue in composer's autoloader. In your
``Config/bootstrap.php`` file add the following::

    // Load composer autoload.
    require APP . '/Vendor/autoload.php';

    // Remove and re-prepend CakePHP's autoloader as composer thinks it is the most important.
    // See https://github.com/composer/composer/commit/c80cb76b9b5082ecc3e5b53b1050f76bb27b127b
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

You should now have a functioning CakePHP application with CakePHP installed via
composer. Be sure to keep the composer.json and composer.lock file with the
rest of your source code.


Sharing CakePHP libraries with multiple applications
====================================================

There may be some situations where you wish to place CakePHP's
directories on different places on the filesystem. This may be due
to a shared host restriction. This section describes how
to spread your CakePHP directories across a filesystem.

First, realize that there are three main parts to a Cake
application:

#. The core CakePHP libraries, in /lib/Cake.
#. Your application code, in /App.
#. The application's webroot, usually in /App/webroot.

Each of these directories can be located anywhere on your file
system, with the exception of the webroot, which needs to be
accessible by your web server. You can even move the webroot folder
out of the app folder as long as you tell CakePHP where you've put
it.

To configure your CakePHP installation, you'll need to make some
changes to the following files.


-  /App/webroot/index.php
-  /App/webroot/test.php (if you use the
   :doc:`Testing </development/testing>` feature.)

There are three constants that you'll need to edit: ``ROOT``,
``APP_DIR``, and ``CAKE_CORE_INCLUDE_PATH``.


- ``ROOT`` should be set to the path of the directory that contains your
  app folder.
- ``APP_DIR`` should be set to the (base)name of your app folder.
- ``CAKE_CORE_INCLUDE_PATH`` should be set to the path of your CakePHP
  libraries folder. Generally you will not need to change this if you use any of
  the :doc:`suggested installation </installation>` methods.

Let's run through an example so you can see what an advanced
installation might look like in practice. Imagine that I wanted to
set up CakePHP to work as follows:

- My application's webroot directory will be /var/www/mysite/.
- My application's app directory will be /home/me/myapp.
- CakePHP is installed via composer.

Given this type of setup, I would need to edit my webroot/index.php
file (which will end up at /var/www/mysite/index.php, in this
example) to look like the following::

    // App/Config/paths.php (partial, comments removed)
    define('ROOT', '/home/me');
    define ('APP_DIR', 'myapp');
    define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');

Apache and mod\_rewrite (and .htaccess)
=======================================

While CakePHP is built to work with mod\_rewrite out of the box–and
usually does–we've noticed that a few users struggle with getting
everything to play nicely on their systems.

Here are a few things you might try to get it running correctly.
First look at your httpd.conf (Make sure you are editing the system
httpd.conf rather than a user- or site-specific httpd.conf).

#. Make sure that an .htaccess override is allowed and that
   AllowOverride is set to All for the correct DocumentRoot. You
   should see something similar to::

       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories). 
       #
       # First, we configure the "default" to be a very restrictive set of 
       # features.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Make sure you are loading up mod\_rewrite correctly. You should
   see something like::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   In many systems these will be commented out (by being prepended
   with a #) by default, so you may just need to remove those leading
   # symbols.

   After you make changes, restart Apache to make sure the settings
   are active.

   Verify that you your .htaccess files are actually in the right
   directories.

   This can happen during copying because some operating systems treat
   files that start with '.' as hidden and therefore won't see them to
   copy.

#. Make sure your copy of CakePHP is from the downloads section of
   the site or our GIT repository, and has been unpacked correctly by
   checking for .htaccess files.

   Cake root directory (needs to be copied to your document, this
   redirects everything to your Cake app)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule ^$ App/webroot/ [L]
          RewriteRule (.*) App/webroot/$1 [L]
       </IfModule>

   Cake app directory (will be copied to the top directory of your
   application by bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule ^$ webroot/ [L]
          RewriteRule (.*) webroot/$1 [L]
       </IfModule>

   Cake webroot directory (will be copied to your application's web
   root by bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   If your CakePHP site still has problems with mod\_rewrite you might 
   want to try and modify settings for virtualhosts. If on ubuntu, 
   edit the file /etc/apache2/sites-available/default (location is 
   distribution dependent). In this file, ensure that 
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

   If on Mac OSX, another solution is to use the tool virtualhostx to
   make a virtual host to point to your folder.

   For many hosting services (GoDaddy, 1and1), your web server is
   actually being served from a user directory that already uses
   mod\_rewrite. If you are installing CakePHP into a user directory
   (http://example.com/~username/cakephp/), or any other URL structure
   that already utilizes mod\_rewrite, you'll need to add RewriteBase
   statements to the .htaccess files CakePHP uses (/.htaccess,
   /App/.htaccess, /App/webroot/.htaccess).

   This can be added to the same section with the RewriteEngine
   directive, so for example your webroot .htaccess file would look
   like::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   The details of those changes will depend on your setup, and can
   include additional things that are not Cake related. Please refer
   to Apache's online documentation for more information.

Pretty URLs on nginx
====================

nginx is a popular server that uses less system
resources than Apache. Its drawback is that it does not make use of .htaccess
files like Apache, so it is necessary to create those
rewritten URLs in the site-available configuration. Depending upon
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
        root   /var/www/example.com/public/App/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

URL Rewrites on IIS7 (Windows hosts)
====================================

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:


#. Use Microsoft's Web Platform Installer to install the URL
   Rewrite Module 2.0.
#. Create a new file in your CakePHP folder, called web.config.
#. Using Notepad or another XML-safe editor, copy the following
   code into your new web.config file.::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
    
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
    
                </rule>
    
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php/{R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

It is also possible to use the Import functionality in IIS's URL
Rewrite module to import rules directly from CakePHP's .htaccess
files in root, /App/, and /App/webroot/ - although some editing
within IIS may be necessary to get these to work. When Importing
the rules this way, IIS will automatically create your web.config
file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.


.. meta::
    :title lang=en: Advanced Installation
    :keywords lang=en: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
