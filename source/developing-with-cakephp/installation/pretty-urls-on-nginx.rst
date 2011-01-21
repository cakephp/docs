3.3.6 Pretty URLs on nginx
--------------------------

nginx is a popular server that, like Lighttpd, uses less system
resources. It's drawback is that it does not make use of .htaccess
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
            if (-f $request_filename) {
                break;
            }
            if (-d $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?q=$1 last;
        }
    
        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }


#. ``server {``
#. ``listen   80;``
#. ``server_name www.example.com;``
#. ``rewrite ^(.*) http://example.com$1 permanent;``
#. ``}``
#. ``server {``
#. ``listen   80;``
#. ``server_name example.com;``
#. ``access_log /var/www/example.com/log/access.log;``
#. ``error_log /var/www/example.com/log/error.log;``
#. ``location / {``
#. ``root   /var/www/example.com/public/app/webroot/;``
#. ``index  index.php index.html index.htm;``
#. ``if (-f $request_filename) {``
#. ``break;``
#. ``}``
#. ``if (-d $request_filename) {``
#. ``break;``
#. ``}``
#. ``rewrite ^(.+)$ /index.php?q=$1 last;``
#. ``}``
#. ``location ~ .*.php[345]?$ {``
#. ``include /etc/nginx/fcgi.conf;``
#. ``fastcgi_pass    127.0.0.1:10005;``
#. ``fastcgi_index   index.php;``
#. ``fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;``
#. ``}``
#. ``}``

3.3.6 Pretty URLs on nginx
--------------------------

nginx is a popular server that, like Lighttpd, uses less system
resources. It's drawback is that it does not make use of .htaccess
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
            if (-f $request_filename) {
                break;
            }
            if (-d $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?q=$1 last;
        }
    
        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }


#. ``server {``
#. ``listen   80;``
#. ``server_name www.example.com;``
#. ``rewrite ^(.*) http://example.com$1 permanent;``
#. ``}``
#. ``server {``
#. ``listen   80;``
#. ``server_name example.com;``
#. ``access_log /var/www/example.com/log/access.log;``
#. ``error_log /var/www/example.com/log/error.log;``
#. ``location / {``
#. ``root   /var/www/example.com/public/app/webroot/;``
#. ``index  index.php index.html index.htm;``
#. ``if (-f $request_filename) {``
#. ``break;``
#. ``}``
#. ``if (-d $request_filename) {``
#. ``break;``
#. ``}``
#. ``rewrite ^(.+)$ /index.php?q=$1 last;``
#. ``}``
#. ``location ~ .*.php[345]?$ {``
#. ``include /etc/nginx/fcgi.conf;``
#. ``fastcgi_pass    127.0.0.1:10005;``
#. ``fastcgi_index   index.php;``
#. ``fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;``
#. ``}``
#. ``}``
