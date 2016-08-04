网址重写(*URL Rewriting*)
#########################

Apache 和 mod\_rewrite (以及 .htaccess)
=======================================

虽然 CakePHP 编写的就是要自动和 mod\_rewrite 一起使用——而且通常可以——但是我们
的确注意到一些用户在他们的系统中很难使所有东西在一起顺利地运行。

这里有一些办法你可以尝试，来让它正确地运行。首先，查看 httpd.conf。(确保你是在修
改系统级的 httpd.conf，而不是用户级或者站点级的 httpd.conf。)

这些文件随(Linux)发行版本的不同和 Apache 版本的不同而有所变化。你也可以查看
http://wiki.apache.org/httpd/DistrosDefaultLayout 以获取更多的信息。


#. 确保允许 .htaccess 优先(*override*)，并且正确的 DocumentRoot 的 AllowOverride
   设置为 All。你应当看到类似于::

       # Apache 可以访问的每个目录可以设置该目录(及其子目录)允许及/或不允许何种服
       # 务和特性。
       #
       # 首先，我们配置 "default" 为很有限的一组特性。
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

   对于 apache 2.4 及更高版本的用户，你需要象下面这样修改 ``httpd.conf`` 的配置
   文件或者 虚拟主机（*Virtual Host*）的配置::

       <Directory /var/www/>
            Options FollowSymLinks
            AllowOverride All
            Require all granted
       </Directory>

#. 确保正确加载了 mod\_rewrite。你应当看到类似于::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   在很多系统中缺省情况下这是被注释掉的，这样你就只需去掉开头的#符号。

   做完修改后，重启 Apache，确保设置起作用。

   核实你的 .htaccess 文件的确在正确的目录中。某些操作系统认为以'.'开头的文件是隐
   藏的，因此不会拷贝这些文件。

#. 确保你的 CakePHP 拷贝来自官网的下载部分或者我们的 Git 库，并且查看各个
   .htaccess 文件以确保解压正确。

   CakePHP 根目录(需要拷贝到你的文档目录; 会把所有的输入转向到你的 CakePHP 应用
   程序)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   CakePHP app 目录(bake 会把它拷贝到你的应用程序的最高一级目录)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   CakePHP 的 webroot 目录(bake 会把它拷贝到你的应用程序的 webroot 目录)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   如果你的 CakePHP 网站仍然有 mod\_rewrite 的问题，你也许可以尝试修改虚拟主机
   的设置。在 Ubuntu 系统中，编辑文件 /etc/apache2/sites-available/default (其
   位置取决于发行版本)。在该文件中，确保 ``AllowOverride None`` 改为
   ``AllowOverride All`` ，所以就是::

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

   在 Mac OSX 中，另一个方法是使用
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_ 工具来创建一个虚拟主机
   ，指向你的目录。

   对于很多托管服务(GoDaddy, 1and1)，你的 web 服务器实际上是从一个已经使用
   mod\_rewrite 的用户目录提供的。如果你把 CakePHP 安装到一个用户目录(
   http://example.com/~username/cakephp/)，或者任何已经使用 mod\_rewrite 的网址结
   构，你需要在 CakePHP 使用的 .htaccess 文件(/.htaccess、/app/.htaccess、
   /app/webroot/.htaccess)中添加 RewriteBase 语句。

   这可以加在 RewriteEngine 指令所在的同一个小节中，例如，你的 webroot 的
   .htaccess 文件可以象这样::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   这些改动的细节取决于你的设置，而且可能包含与 CakePHP 无关的其它东西。更多信息
   请参考 Apache 的在线文档。

#. (可选) 要改善生产环境的设置，你应当让 CakePHP 避免解析非法的资源。可以把
   webroot 的 .htaccess 文件修改成象下面这样::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(app/webroot/)?(img|css|js)/(.*)$
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   上面的设置就会简单地避免错误的资源被送往 index.php，而显示你的 web 服务器的
   404页面。

   另外，你可以创建一个匹配的 HTML 404 页面，或者添加 ``ErrorDocument`` 指令来使
   用 CakePHP 内置的 404 页面::

       ErrorDocument 404 /404-not-found

nginx 的友好网址
================

nginx 不像 Apache 那样使用 .htaccess 文件，所以必须在站点的配置中创建这些重写网址。
根据你的设置，你要修改这个(配置)，不过至少你要让 PHP 作为 FastCGI 实例来运行。

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

如果因为某种奇怪的原因，你不能改变你的根目录，而需要从一个象
example.com/subfolder/这样的子目录来运行你的项目，你就不得不在每个请求中加入
"/webroot"。

::

   location ~ ^/(subfolder)/(.*)? {
      index  index.php;

      set $new_uri /$1/webroot/$2;
      try_files $new_uri $new_uri/ /$1/index.php?$args;

      ... php handling ...
   }

.. note::
   较新的 PHP-FPM 配置设置为监听 php-fpm 套接字（*socket*），而不是 127.0.0.1
   地址的 9000 TCP 端口。如果你使用上面的配置，遇到 502 bad gateway 的错误，尝试
   把 fastcgi_pass 从 TCP 端口改为套接字路径（例如：
   fastcgi_pass unix:/var/run/php5-fpm.sock;）。

IIS7 的网址重写 (Windows 主机)
==============================

IIS7 本身不支持 .htaccess 文件。虽然有插件(*add-on*)可增加这种支持，但是也可以把
htaccess 规则导入 IIS，来使用 CakePHP 的原生重写。为此，按照如下步骤进行:


#. 使用 `Microsoft 的 Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_
   来安装网址 `重写模块 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   或者直接下载(`32位 <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_
   / `64位 <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_)。
#. 在 CakePHP 根目录创建一个文件 web.config。
#. 使用记事本(*Notepad*)或任何对 XML 安全的编辑器，拷贝下面的代码到新建的
   web.config 文件中……

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

一旦创建了含有正确的 IIS 方式的重写规则的 web.config 文件，CakePHP 的链接、CSS、
JavaScript和路由就应该可以正常工作了。

lighttpd 的网址重写
===================

Lighttpd 不支持 .htaccess 功能，故而可以删除所有 .htaccess 文件。在 lighttpd 的配
置中，确保启用了 "mod_rewrite"。增加一行:

::

    url.rewrite-if-not-file =(
        "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
    )

Hiawatha 的网址重写
===================

在 Hiawatha 中使用 CakePHP 所要求的 UrlToolkit 规则是:

::

    UrlToolkit {
       ToolkitID = cakephp
       RequestURI exists Return
       Match .* Rewrite /index.php
    }

我不/无法使用网址重写
=====================

如果在你的 web 服务器上不想或者不能使用网址重写，请参考
:ref:`核心配置<core-configuration-baseurl>`。



.. meta::
    :title lang=zh: URL Rewriting
    :keywords lang=zh: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
