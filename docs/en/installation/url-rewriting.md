# URL Rewriting

In all of the examples on this page, the web server's document root points to
the application's `webroot/` directory (`app/webroot/` in the legacy layout),
as described in [Installation](../installation#configuring-the-web-server).
Every request for a file that does not exist in `webroot/` is passed to
`webroot/index.php`.

## Apache and mod_rewrite (and .htaccess)

While CakePHP is built to work with mod_rewrite out of the box–and
usually does–we've noticed that a few users struggle with getting
everything to play nicely on their systems.

Here are a few things you might try to get it running correctly.
First look at your Apache configuration. The location of these files varies
between distributions; make sure you are editing the configuration that
belongs to your site, for example the virtual host file.

1.  Make sure that an .htaccess override is allowed and that
    AllowOverride is set to All for the correct DocumentRoot. You
    should see something similar to:

    ``` text
    <Directory /var/www/my_app/webroot>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ```

    On Debian and Ubuntu, virtual hosts are configured in
    `/etc/apache2/sites-available/`. Make sure that `AllowOverride None` is
    changed to `AllowOverride All` for your document root.

2.  Make sure you are loading mod_rewrite correctly. You should
    see something like:

        LoadModule rewrite_module libexec/apache2/mod_rewrite.so

    In many systems these will be commented out by default, so you may
    just need to remove the leading \# symbols. On Debian and Ubuntu, run
    `a2enmod rewrite` instead.

    After you make changes, restart Apache to make sure the settings
    are active.

3.  Verify that the `.htaccess` file is actually in `webroot/`. Some
    operating systems and tools treat files that start with '.' as hidden
    and therefore won't copy them. The `.htaccess` file of the application
    skeleton looks like this:

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    The second line passes the HTTP `Authorization` header on to PHP, which is
    needed for HTTP Basic and Digest authentication when PHP runs as FastCGI.

    Legacy `app/` applications also have an `.htaccess` file in the project
    root and in `app/` that forward requests to `app/webroot/`. They are only
    used when the document root is not set to `app/webroot/`.

    If you are installing CakePHP into a user directory
    (<https://example.com/~username/my_app/>), or any other URL structure
    that already utilizes mod_rewrite, you'll need to add a `RewriteBase`
    statement to the `.htaccess` file in `webroot/`. This can be added to the
    same section with the RewriteEngine directive, so for example, your webroot
    .htaccess file would look like:

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /~username/my_app
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    The details of those changes will depend on your setup, and can
    include additional things that are not related to CakePHP. Please refer
    to [Apache's documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
    for more information.

4.  (Optional) To improve production setup, you should prevent invalid assets
    from being parsed by CakePHP. Modify your webroot .htaccess to something like:

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_URI} !^/(img|css|js)/(.*)$
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    The above will simply prevent incorrect assets from being sent to index.php
    and instead display your webserver's 404 page.

    Additionally you can create a matching HTML 404 page, or use the default
    built-in CakePHP 404 by adding an `ErrorDocument` directive:

        ErrorDocument 404 /404-not-found

## Pretty URLs on nginx

nginx does not make use of .htaccess files like Apache, so it is necessary to
create those rewritten URLs in the site configuration. Depending upon
your setup, you will have to modify this, but at the very least,
you will need PHP running with PHP-FPM.

``` text
server {
    listen 80;
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 80;
    server_name example.com;

    # root directive should be global
    root /var/www/my_app/webroot;
    index index.php;

    access_log /var/log/nginx/my_app.access.log;
    error_log /var/log/nginx/my_app.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

For the legacy layout, set `root` to the `app/webroot` directory instead.

> [!NOTE]
> The path of the PHP-FPM socket depends on your distribution and PHP
> version, for example `/run/php/php8.3-fpm.sock`. If PHP-FPM listens on a TCP
> port instead, use `fastcgi_pass 127.0.0.1:9000;`. A 502 Bad Gateway error
> usually means that `fastcgi_pass` does not match the PHP-FPM configuration.

## URL Rewrites on IIS (Windows hosts)

IIS does not natively support .htaccess files. Instead, you can use the
[URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite) to
get the same rewrites. To do this, follow these steps:

1.  Install the [URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite).
2.  Point the site's physical path to the application's `webroot/` directory
    and create a new file called web.config in it.
3.  Using any XML-safe editor, copy the following code into your new
    web.config file:

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Rewrite requested file/folder to index.php"
                  stopProcessing="true">
                    <match url="^(.*)$" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="index.php"
                      appendQueryString="true" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, CSS, JavaScript, and rerouting should work
correctly.

## URL-Rewriting on lighttpd

Lighttpd does not support .htaccess functions, so you can remove all .htaccess files.
In the lighttpd configuration, set `server.document-root` to the `webroot/`
directory and make sure you've activated "mod_rewrite". Add a line:

``` text
url.rewrite-if-not-file =(
    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
)
```

## URL rewrite rules for Hiawatha

The required UrlToolkit rule (for URL rewriting) to use CakePHP with Hiawatha is:

``` text
UrlToolkit {
   ToolkitID = cakephp
   RequestURI exists Return
   Match .* Rewrite /index.php
}
```

## I don't / can't use URL rewriting

If you don't want to or can't use URL rewriting on your webserver,
refer to the [core configuration](../development/configuration#core-configuration-baseurl).
