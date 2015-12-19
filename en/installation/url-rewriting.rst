URL Rewriting
#############

Apache and mod\_rewrite (and .htaccess)
=======================================

While CakePHP is built to work with mod\_rewrite out of the box–and
usually does–we've noticed that a few users struggle with getting
everything to play nicely on their systems.

Here are a few things you might try to get it running correctly.
First look at your httpd.conf. (Make sure you are editing the system
httpd.conf rather than a user- or site-specific httpd.conf.)

These files can vary between different distributions and Apache versions.
You may also take a look at http://wiki.apache.org/httpd/DistrosDefaultLayout for further information.


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

   For users having apache 2.4 and above, you need to modify the configuration
   file for your ``httpd.conf`` or virtual host configuration to look like the
   following::

       <Directory /var/www/>
            Options FollowSymLinks
            AllowOverride All
            Require all granted
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

   CakePHP root directory (must be copied to your document;
   redirects everything to your CakePHP app)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

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
           RewriteRule ^(.*)$ index.php [QSA,L]
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
   statements to the .htaccess files CakePHP uses (/.htaccess,
   /app/.htaccess, /app/webroot/.htaccess).

   This can be added to the same section with the RewriteEngine
   directive, so for example, your webroot .htaccess file would look
   like::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   The details of those changes will depend on your setup, and can
   include additional things that are not related to CakePHP. Please refer
   to Apache's online documentation for more information.

#. (Optional) To improve production setup, you should prevent invalid assets
   from being parsed by CakePHP. Modify your webroot .htaccess to something like::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(app/webroot/)?(img|css|js)/(.*)$
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   The above will simply prevent incorrect assets from being sent to index.php
   and instead display your webserver's 404 page.

   Additionally you can create a matching HTML 404 page, or use the default
   built-in CakePHP 404 by adding an ``ErrorDocument`` directive::

       ErrorDocument 404 /404-not-found

Pretty URLs on nginx
====================

nginx does not make use of .htaccess files like Apache, so it is necessary to
create those rewritten URLs in the site-available configuration. Depending upon
your setup, you will have to modify this, but at the very least,
you will need PHP running as a FastCGI instance.

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/app/webroot/;
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

If for some exotic reason you cannot change your root directory and need to run
your project from a subfolder like example.com/subfolder/, you will have to
inject "/webroot" in each request.

::

   location ~ ^/(subfolder)/(.*)? {
      index  index.php;

      set $new_uri /$1/webroot/$2;
      try_files $new_uri $new_uri/ /$1/index.php?$args;

      ... php handling ...
   }
   
.. note::
   Recent configuration of PHP-FPM is set to listen to php-fpm socket instead of TCP port 9000 on address 127.0.0.1. If you get 502 bad gateway error from above configuration, try replacing fastcgi_pass from TCP port to socket path (eg: fastcgi_pass unix:/var/run/php5-fpm.sock;).

URL Rewrites on IIS7 (Windows hosts)
====================================

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:

#. Use `Microsoft's Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_ to install the URL
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ or download it directly (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Create a new file called web.config in your CakePHP root folder.
#. Using Notepad or any XML-safe editor, copy the following
   code into your new web.config file...

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Rewrite requests to test.php"
                      stopProcessing="true">
                        <match url="^test.php(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="app/webroot/test.php{R:1}" />
                    </rule>
                    <rule name="Exclude direct access to app/webroot/*"
                      stopProcessing="true">
                        <match url="^app/webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="app/webroot/{R:1}{R:2}"
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

URL-Rewriting on lighttpd
=========================

Lighttpd does not support .htaccess functions, so you can remove all .htaccess files.
In the lighttpd configuration, make sure you've activated "mod_rewrite". Add a line:

::

    url.rewrite-if-not-file =(
        "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
    )

URL rewrite rules for Hiawatha
==============================

The required UrlToolkit rule (for URL rewriting) to use CakePHP with Hiawatha is:

::

    UrlToolkit {
       ToolkitID = cakephp
       RequestURI exists Return
       Match .* Rewrite /index.php
    }

I don't / can't use URL rewriting
=================================

If you don't want to or can't use URL rewriting on your webserver,
refer to the :ref:`core configuration<core-configuration-baseurl>`.


.. meta::
    :title lang=en: URL Rewriting
    :keywords lang=en: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
