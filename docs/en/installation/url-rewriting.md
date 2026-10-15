# Web Server Configuration

This page shows how to configure Apache, nginx and other web servers for a
CakePHP application: the document root, URL rewriting, and the settings that
keep the files of the application private.

## Document Root {#document-root}

Set the web server's document root to the application's `webroot/` directory
(`app/webroot/` in the legacy layout), as described in
[Installation](../installation#configuring-the-web-server), in development as
well as in production. Every request for a file that does not exist in
`webroot/` is passed to `webroot/index.php`.

> [!WARNING]
> Never point the document root, an `Alias` or a `location` to the project
> directory or to any other directory above `webroot/`. The configuration in
> `config/`, the source code, `vendor/`, the cache and session files in
> `tmp/`, the log files in `logs/`, `.env` files and the `.git/` directory
> could then be downloaded, and PHP files in `vendor/` could be run directly.

## Apache and mod_rewrite (and .htaccess)

The application skeleton contains a `webroot/.htaccess` file that sends every
request to `index.php`. It needs mod_rewrite and a virtual host that allows
`.htaccess` files. The examples use the access control directives of Apache
2.4; for Apache 2.2, see [Apache 2.2 (legacy)](#apache-2-2).

1.  Configure the virtual host. The location of the configuration files varies
    between distributions; on Debian and Ubuntu, virtual hosts are configured in
    `/etc/apache2/sites-available/`. A virtual host for the application looks
    like this:

    ```apache
    <VirtualHost *:443>
        ServerName example.com
        DocumentRoot /var/www/my_app/webroot

        SSLEngine on
        SSLCertificateFile /etc/ssl/certs/example.com.pem
        SSLCertificateKeyFile /etc/ssl/private/example.com.key

        <Directory /var/www/my_app/webroot>
            Options -Indexes -MultiViews +FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

        # Deny hidden files and directories, such as .htaccess and .git,
        # except .well-known/
        <FilesMatch "^\.">
            Require all denied
        </FilesMatch>
        <DirectoryMatch "/\.(?!well-known/)">
            Require all denied
        </DirectoryMatch>
    </VirtualHost>

    <VirtualHost *:80>
        ServerName example.com
        Redirect permanent / https://example.com/
    </VirtualHost>
    ```

    - `AllowOverride All` lets the `.htaccess` file use mod_rewrite.
      `AllowOverride` defaults to `None` since Apache 2.3.9, and many
      distributions set it to `None` for `/var/www`, in which case only the
      home page works and every other URL returns 404. The skeleton's
      `.htaccess` file only needs `AllowOverride FileInfo` if you prefer to
      allow less.
    - `-Indexes` turns off directory listings, which some distributions enable
      for `/var/www`. Never use `+Indexes` for the document root.
      `-MultiViews` turns off content negotiation, which could otherwise
      answer `/posts` with a file such as `posts.html`.
    - mod_rewrite in `.htaccess` files needs `FollowSymLinks` or
      `SymLinksIfOwnerMatch`. `+SymLinksIfOwnerMatch` is the safer choice on a
      server where other users can create files in `webroot/`; it only
      follows a symbolic link when the link and its target have the same
      owner, so check that plugin asset symlinks are owned by the same user
      as their targets.
    - In one `Options` line, either prefix every option with `+` or `-`, or
      none of them. Apache 2.4 refuses to start when they are mixed, as in
      `Options -Indexes FollowSymLinks`.
    - The `FilesMatch` and `DirectoryMatch` sections deny hidden files, but
      allow `.well-known/` for certificate validation.
    - The second virtual host redirects HTTP to HTTPS. Use the certificate of
      your site, for example one from Let's Encrypt; mod_ssl must be enabled.

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

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On

        # Pass the Authorization header to PHP when it runs as CGI or FastCGI
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

        # Send every request that is not for an existing file to index.php,
        # including requests for directories, so that Apache never lists the
        # contents of a directory such as files/ or css/.
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    The first rule passes the HTTP `Authorization` header on to PHP, which
    is needed for HTTP Basic and Digest authentication and for API tokens
    when PHP runs as FastCGI (PHP-FPM). With Apache 2.4.13 or later and
    mod_proxy_fcgi, `CGIPassAuth On` in the `<Directory>` section does the
    same.

    The last rule sends every request that is not for an existing file to
    `index.php`, which reads the requested URL from `REQUEST_URI`. Older
    versions of the skeleton also had a `RewriteCond %{REQUEST_FILENAME} !-d`
    line. With it, requests for directories such as `/files/` are served by
    Apache, which lists their contents unless `-Indexes` is set; remove the
    line, as the current skeleton and the CakePHP 4 and 5 application
    skeletons do.

    If you are installing CakePHP into a user directory
    (<https://example.com/~username/my_app/>), or any other URL structure
    that already utilizes mod_rewrite, you'll need to add a `RewriteBase`
    statement to the `.htaccess` file in `webroot/`. This can be added to the
    same section with the RewriteEngine directive, so for example, your webroot
    .htaccess file would look like:

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /~username/my_app
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    The details of those changes will depend on your setup, and can
    include additional things that are not related to CakePHP. Please refer
    to [Apache's documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
    for more information.

    If you cannot change the virtual host, you can redirect HTTP to HTTPS in
    `.htaccess` instead, before the other rules. Behind a load balancer that
    terminates TLS, check the `X-Forwarded-Proto` header instead of
    `%{HTTPS}`:

    ```apache
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    ```

4.  (Optional) To improve production setup, you should prevent invalid assets
    from being parsed by CakePHP. Modify your webroot .htaccess to something like:

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
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

5.  If the application stores uploaded files in `webroot/`, for example in
    `webroot/files/`, make sure that Apache never runs PHP files there. Add
    this to the virtual host:

    ```apache
    <Directory /var/www/my_app/webroot/files>
        <FilesMatch "\.(php|phar|phtml)(\.|$)">
            Require all denied
        </FilesMatch>
    </Directory>
    ```

    The pattern also matches names such as `evil.php.jpg`, which some PHP
    handler configurations run as PHP. It is safer still to store uploads
    outside of `webroot/` and send them with a controller after checking that
    the user may see them.

### The Legacy Root .htaccess Files {#legacy-root-htaccess}

The original CakePHP 2 application has an `.htaccess` file in the project
root and in `app/` that forward requests to `app/webroot/`, so that the
application also works when the document root is the project directory.

> [!WARNING]
> Do not rely on these files. They only work while mod_rewrite is loaded and
> `AllowOverride` allows them. Otherwise Apache ignores the rewrite rules and
> serves the whole project directory, so that, for example, these files can
> be downloaded or run:
>
> - `.env` files and the `.git/` directory, including `.git/config` and the
>   whole history of the source code
> - `composer.json`, `composer.lock` and the files in `vendor/`; PHP files in
>   `vendor/` can be run directly
> - the configuration in `app/Config/`, such as `database.php.default`,
>   `email.php.default` and any other non-PHP files
> - the templates (`.ctp`), which are shown as source code
> - the log files in `app/tmp/logs/` and the cache and session files in
>   `app/tmp/`, which can contain personal data and session IDs
> - directory listings of all these directories, if `Indexes` is enabled
>
> Always set the document root to `app/webroot/` (`webroot/` in the modern
> layout) and delete the root and `app/` `.htaccess` files, so that a
> misconfiguration shows up as an error instead of exposing the files.

### Apache 2.2 (legacy) {#apache-2-2}

Apache 2.2 reached its end of life in 2017 and no longer receives security
fixes; upgrade to Apache 2.4. If you still have to configure it, replace the
`Require` directives with `Order`, `Allow` and `Deny`. The `.htaccess` file of
the skeleton works with both versions. These examples are not tested by this
project:

```apache
<Directory /var/www/my_app/webroot>
    Options -Indexes -MultiViews +FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
</Directory>

<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

<Directory /var/www/my_app/webroot/files>
    <FilesMatch "\.(php|phar|phtml)(\.|$)">
        Order allow,deny
        Deny from all
    </FilesMatch>
</Directory>
```

On Apache 2.4, `Order`, `Allow` and `Deny` only work with mod_access_compat,
and mixing them with `Require` in one section gives unexpected results.
Configuration that must work on both versions can check for mod_authz_core,
which only Apache 2.4 has. This was tested on Apache 2.4 only:

```apache
<Directory /var/www/my_app/webroot>
    Options -Indexes -MultiViews +FollowSymLinks
    AllowOverride All
    <IfModule mod_authz_core.c>
        Require all granted
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Allow from all
    </IfModule>
</Directory>
```

## Pretty URLs on nginx

nginx does not make use of .htaccess files like Apache, so it is necessary to
create those rewritten URLs in the site configuration. Depending upon
your setup, you will have to modify this, but at the very least,
you will need PHP running with PHP-FPM.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # root directive should be global
    root /var/www/my_app/webroot;
    index index.php;

    access_log /var/log/nginx/my_app.access.log;
    error_log /var/log/nginx/my_app.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Run only the front controller, webroot/index.php. Other .php files,
    # such as files uploaded into webroot/files/, are never executed.
    location ~ ^/index\.php(/|$) {
        fastcgi_split_path_info ^(/index\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    location ~ \.php$ {
        return 404;
    }

    # Deny hidden files, such as .htaccess and .git, except .well-known/
    location ~ /\.(?!well-known/) {
        deny all;
    }
}
```

For the legacy layout, set `root` to the `app/webroot` directory instead.

This configuration:

- Redirects HTTP to HTTPS. Use the certificate of your site, for example one
  from Let's Encrypt.
- Sends every request that is not for an existing file to `index.php`, with
  the query string. nginx does not list directories unless `autoindex` is
  on, so a request for a directory such as `/files/` returns 403.
- Passes only `index.php` to PHP-FPM. Requests for other `.php` files,
  including `webroot/test.php`, return 404, so a PHP file uploaded into
  `webroot/` is never run, whatever the `cgi.fix_pathinfo` setting of PHP.
  A file such as `evil.php.jpg` is sent as a static file and not run either.
  `fastcgi_split_path_info` sets `PATH_INFO` for URLs such as
  `/index.php/posts/view/1`, which CakePHP uses when
  [App.baseUrl](../development/configuration#core-configuration-baseurl) is
  set.
- Denies hidden files such as `.htaccess` and `.git/`, but allows
  `.well-known/` for certificate validation.

Do not use a generic `location ~ \.php$` block that passes every existing
`.php` file to PHP-FPM: it runs any PHP file that is uploaded into
`webroot/`. Do not use `if` blocks to test whether a file exists; `try_files`
does this. Add `server_tokens off;` to the `http` block if you prefer not to
show the nginx version.

> [!NOTE]
> The path of the PHP-FPM socket depends on your distribution and PHP
> version, for example `/run/php/php8.3-fpm.sock`. If PHP-FPM listens on a TCP
> port instead, use `fastcgi_pass 127.0.0.1:9000;`. A 502 Bad Gateway error
> usually means that `fastcgi_pass` does not match the PHP-FPM configuration.

## URL Rewrites on IIS (Windows hosts)

::: warning
This section is kept from the original book for reference and is not tested
by this project. For PHP applications, nginx or Apache is recommended. If you
use IIS, apply the same rules as for nginx and Apache: point the site to
`webroot/` only, and do not let IIS run PHP files in upload directories.
:::

IIS does not natively support .htaccess files. Instead, you can use the
[URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite) to
get the same rewrites. To do this, follow these steps:

1.  Install the [URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite).
2.  Point the site's physical path to the application's `webroot/` directory
    and create a new file called web.config in it.
3.  Using any XML-safe editor, copy the following code into your new
    web.config file:

```xml
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

::: warning
This section is kept for reference only and is not tested by this project.
For PHP applications, nginx or Apache is recommended.
:::

Lighttpd does not support .htaccess functions, so you can remove all .htaccess
files. In the lighttpd configuration, set `server.document-root` to the
`webroot/` directory, enable mod_access, mod_rewrite and mod_fastcgi, and pass
only `index.php` to PHP. With lighttpd 1.4.50 or later:

```text
server.document-root = "/var/www/my_app/webroot"
index-file.names = ("index.php")

fastcgi.server = (
    "/index.php" => ((
        "socket" => "/run/php/php-fpm.sock",
        "check-local" => "disable"
    ))
)

# Deny hidden files, except .well-known/, and PHP files other than index.php
$HTTP["url"] =~ "/\.(?!well-known/)" {
    url.access-deny = ("")
}
$HTTP["url"] =~ "\.php$" {
    $HTTP["url"] !~ "^/index\.php$" {
        url.access-deny = ("")
    }
}

url.rewrite-if-not-file = ("" => "/index.php${qsa}")
```

Older examples rewrote to `/index.php?url=$1`. CakePHP 2 reads the URL from
`REQUEST_URI`, so the `url` parameter is not needed and only shows up in
`$this->request->query`.

## I don't / can't use URL rewriting

If you don't want to or can't use URL rewriting on your webserver,
refer to the [core configuration](../development/configuration#core-configuration-baseurl).
Keep the document root set to `webroot/` in that case as well.
