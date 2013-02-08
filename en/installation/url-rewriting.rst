URL Rewriting
#############

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
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   Cake app directory (will be copied to the top directory of your
   application by bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
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
   /app/.htaccess, /app/webroot/.htaccess).

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


#. Use `Microsoft's Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_ to install the URL
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ or download it directly (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Create a new file in your CakePHP root folder, called web.config.
#. Using Notepad or any XML-safe editor and copy the following
   code into your new web.config file...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <clear/>
                    <rule name="Imported Rule 0" stopProcessing="true">
                        <match url="^(img|css|files|js)(.*)$"></match>
                        <action type="Rewrite" url="app/webroot/{R:1}{R:2}" appendQueryString="false"></action>
                    </rule>
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
                        <action type="Rewrite" url="app/webroot/" />
                    </rule>
                    <rule name="Imported Rule 3" stopProcessing="true">
                        <match url="(.*)" ignoreCase="false" />
                        <action type="Rewrite" url="app/webroot/{R:1}" />
                    </rule>
                    <rule name="Imported Rule 4" stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        </conditions>
                        <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

It is also possible to use the Import functionality in IIS's URL
Rewrite module to import rules directly from CakePHP's .htaccess
files in root, /app/, and /app/webroot/ - although some editing
within IIS may be necessary to get these to work. When Importing
the rules this way, IIS will automatically create your web.config
file for you (in the currently selected folder within IIS).

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.

I don't / can't use URL rewriting
=================================

If you don't want to or can't use URL rewriting on your webserver,
refer to the :ref:`core configuration<core-configuration-baseurl>`.



.. meta::
    :title lang=en: URL Rewriting
    :keywords lang=en: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
