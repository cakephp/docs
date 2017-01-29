Advanced Installation
#####################

There may be some situations where you wish to place CakePHP's
directories on different places on the filesystem. This may be due
to a shared host restriction, or maybe you just want a few of your
apps to share the same Cake libraries. This section describes how
to spread your CakePHP directories across a filesystem.

First, realize that there are three main parts to a Cake
application:


#. The core CakePHP libraries, in /lib/Cake.
#. Your application code, in /app.
#. The application’s webroot, usually in /app/webroot.

Each of these directories can be located anywhere on your file
system, with the exception of the webroot, which needs to be
accessible by your web server. You can even move the webroot folder
out of the app folder as long as you tell Cake where you've put
it.

To configure your Cake installation, you'll need to make some
changes to the following files.


-  /app/webroot/index.php
-  /app/webroot/test.php (if you use the
   `Testing <view/1196/Testing>`_ feature.)

There are three constants that you'll need to edit: ``ROOT``,
``APP_DIR``, and ``CAKE_CORE_INCLUDE_PATH``.


-  ``ROOT`` should be set to the path of the directory that
   contains your app folder.
-  ``APP_DIR`` should be set to the (base)name of your app folder.
-  ``CAKE_CORE_INCLUDE_PATH`` should be set to the path of your
   CakePHP libraries folder.

Let’s run through an example so you can see what an advanced
installation might look like in practice. Imagine that I wanted to
set up CakePHP to work as follows:


-  The CakePHP core libraries will be placed in /usr/lib/cake.
-  My application’s webroot directory will be /var/www/mysite/.
-  My application’s app directory will be /home/me/myapp.

Given this type of setup, I would need to edit my webroot/index.php
file (which will end up at /var/www/mysite/index.php, in this
example) to look like the following::

    <?php
    // /app/webroot/index.php (partial, comments removed) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

It is recommended to use the ``DS`` constant rather than slashes to
delimit file paths. This prevents any missing file errors you might
get as a result of using the wrong delimiter, and it makes your
code more portable.


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
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
       </IfModule>

   If your cakephp site still has problems with mod\_rewrite you might 
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
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
       </IfModule>

   The details of those changes will depend on your setup, and can
   include additional things that are not Cake related. Please refer
   to Apache's online documentation for more information.


Pretty URLs and Lighttpd
========================

While Lighttpd features a rewrite module, it is not an equivalent
of Apache's mod\_rewrite. To get 'pretty URLs' while using Lighty,
you have two options. Option one is using mod\_rewrite, the second
one is by using a LUA script and mod\_magnet.

**Using mod\_rewrite**
The easiest way to get pretty URLs is by adding this script to your
lighty config. Just edit the URL, and you should be okay. Please
note that this doesn't work on Cake installations in
subdirectories.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # if the request is for css|files etc, do not pass on to Cake
                    "^/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php/$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Using mod\_magnet**
To use pretty URLs with CakePHP and Lighttpd, place this lua script
in /etc/lighttpd/cake.

::

    -- little helper function
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end
    
    -- prefix without the trailing slash
    local prefix = ''
    
    -- the magic ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- file still missing. pass it to the fastcgi backend
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- fallthrough will put it back into the lighty request loop
    -- that means we get the 304 handling for free. ;)

.. note::

    If you run your CakePHP installation from a subdirectory, you must
    set prefix = 'subdirectory\_name' in the above script.

Then tell Lighttpd about your vhost::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # Think about getting vim tmp files out of the way too
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }


Pretty URLs on nginx
====================

nginx is a popular server that, like Lighttpd, uses less system
resources. Its drawback is that it does not make use of .htaccess
files like Apache and Lighttpd, so it is necessary to create those
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

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            root   /var/www/example.com/public/app/webroot/;
            index  index.php index.html index.htm;
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ .*\.php$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
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
   code into your new web.config file...

::

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
files in root, /app/, and /app/webroot/ - although some editing
within IIS may be necessary to get these to work. When Importing
the rules this way, IIS will automatically create your web.config
file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.


.. meta::
    :title lang=en: Advanced Installation
    :keywords lang=en: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
