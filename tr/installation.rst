Kurulum
########

CakePHP basittir ve kurulum çok kolaydır. İhtiyacınız olan en basit şeyler
bir web sunucusu ve CakePHP'nin bir kopyasıdır, o kadar! Bu bölüm Apache
web sunucusu üzerinde kurulumu anlatsa da (çünkü kolay kuruluyor ve ayarlanıyor)
CakePHP nginx, LightHTTPD, or Microsoft IIS gibi birçok sunucu üzerinde
rahatlıkla çalışır.

Gereksinimler
=============

- HTTP sunucusu. Örneğin: Apache. mod\_rewrite özelliğinin açık
  olması tercih edilir ama zorunlu değildir.
- PHP |minphpversion| veya daha yüksek.
- mbstring eklentisi
- intl eklentisi

Bir veritabanı olması zorunlu olmasa dahi, birçok uygulamanın veritabanı kullandığını
düşünüyoruz. CakePHP bir çok veritabanını desteklemektedir.

-  MySQL (5.1.10 veya daha yüksek)
-  PostgreSQL
-  Microsoft SQL Server (2008 veya daha yüksek)
-  SQLite 3

.. note::

    Tüm gömülü sürücüler PDO'ya ihtiyaç duyarlar.
    All built-in drivers require PDO. PDO eklentisinin kurulu
    olduğundan emin olmalısınız.

CakePHP'yi kurmak
===================

CakePHP resmi olarak desteklenen kurulum aracı olarak PHP 5.3+
için bağımlılık yönetici aracı olan `Composer <http://getcomposer.org>`
kullanmaktadır.

İlk olarak eğer yapmadıysanız, Composer'i indirip kurmalısınız. Eğer
sisteminizde cURL yüklüyse, işlem, aşağıdaki komutu çağırmak kadar basittir::

    curl -s https://getcomposer.org/installer | php

Veya `Composer sitesinden <https://getcomposer.org/download/>` ``composer.phar``
dosyasını indirebilirsiniz.

Windows sistemler için, Composer'in Windows yükelyicisini
`buradan <https://github.com/composer/windows-setup/releases/>`__ indirebilirsiniz.
Ayrıca `Burada <https://github.com/composer/windows-setup>`_ README dosyasında ek
talimatlerı bulabilirsiniz.

Şimdi Composer'i indirip kurduğunuza göre, taze bir CakePHP uygulamasını şu
komutları çalıştırarak elde edebilirsiniz:

    php composer.phar create-project --prefer-dist cakephp/app [app_name]

Eğer composer tüm sistemde yüklü ise::

    composer create-project --prefer-dist cakephp/app [app_name]

Composer uygulama iskeletini ve çekirdek CakePHP kütüphanesini indirdiğinde,
elinizde Composer ile yüklenmiş çalışan bir CakePHP uygulaması olacaktır.
composer.json ve composer.lock dosyalarının kaynak kodunuzda olduğundan daima
emin olun.

Şimdi CakePHP'yi yüklediğinizi adresi tarayıcınızda açın ve kurulum için traifk
ışıklarını görün. (Tarayıcıyı açtığınızda anlayacaksınız.)

Son CakePHP Değişiklikleri ile Güncel Kalmak
--------------------------------------------------

Eğer son CakePHP değişiklikleri ile güncel kalmak istiyorsanız,
uygulamanızın ``composer.json`` aşağıdaki kodu ekleyebilirsiniz::

    "require": {
        "cakephp/cakephp": "3.0.*-dev"
    }

Burada ``<branch>`` güncel kalmasını sitediğiniz dalın ismidir.
``php composer.phar update`` komutunu her çalıştırdığınızda, seçilmiş
olan daldaki en son değişiklikleri alacaksınız.

İzinler
=======

CakePHP çeşitli işlemler için ``tmp`` dizinini kullanır. Bunlardan bazıları
model açıklamaları, önbelleğe alınmış görünümler ve oturum bilgileridir. ``logs``
dizini ise Log işlemleri için ``FileLog`` motoru tarafından kullanılmaktadır.

Bu nedenle, CakePHP kurulumunuzdaki ``logs``, ``tmp`` dizinleri ve altdizinlerinin
web sunucusu kullanıcısı tarafından yazılabilir olduklarından emin olmalısınız.
Composer'in kurulum işlemi, işleri hızlıca halletmek için ``tmp`` ve alt dizinlerini
heryerden yazılabilir yapar, ancak daha iyi güvenlik ve sadece web sunucusu kullanıcısı
tarafından yazılabilir olması için izinleri güncelleyebilirsiniz.

Üzerine düşünülmesi gereken bir diğer konu da, ``logs`` ve ``tmp`` dizinlerinin
hem web sunucusu hem de komut satırı kullanıcıları tarafından yazılabilir olmalarıdır.
Bir UNIX sisteminde, web sunucusu ve komut satırı kullanıcıları farklı ise, uygulama
dizininizdde bir seferliğinie izinlerinizin düzgün kurulduğundan emin olmak için
aşağıdaki komutları çalıştırabilirsiniz::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Geliştirme Sunucusu
===================

CakePHP'yi kurmanın en hızlı yolu geliştime kurulumudur. Bu örnekte uygulamanın
``http://host:port`` adresinden açılabilmesini sağlamak için PHP'nin
gömülü sunucusunu CakePHP konsolunu kullanarak çalıştıracağız. Şu komutu
ygulama dizininde çalıştırıalım::

    bin/cake server

Herhangi bir parametre kullanmadığınızda uygulama şu adreste çalışacaktır
``http://localhost:8765/``.

Eğer ``localhost`` sunucusunda veya  ``8765`` portları üstünde çakışma oluyorsa,
CakePHP konsoluna, web sunucusunu belirttiğiniz adres veya portta çalışrmasını
öyleyebilirsiniz::

    bin/cake server -H 192.168.13.37 -p 5673

Bu komut uygulamanızı ``http://192.168.13.37:5673/`` adresinde çalıştıracaktır.

That's it! Your CakePHP application is up and running without having to
configure a web server.

.. warning::

    Geliştirme sunucusu *asla* canlı sistemde kullanılmamalıdır. Bu sunucu sadece
    basit işler için kullanılmalıdır.

Eğer gerçek bir sunucu kullanmayı tercih ediyosanız, CakePHP kurulumunuzu (gizli
dosyalarıyla beraber) wen sunucunuzun kök dizinine koyabilmelisiniz. Böylelikle
web tarayıcınızı kullanarak uygulamanıza erişim sağlayabilirsiniz.

Canlı sistem
============

Calışan canlı bir sistemde CakePHP kurulumu daha esnek seçenekler sağlar.
Bu yolu kullanarak, bütün domainin tek bir CakePHP uygulaması olarak çalışmasını
sağlayabilirsiniz. Bu örnek size CakePHP'yi dosyas isteminde herhangi bir yere
kurmanıza ve uygulamanın http://www.example.com adresinden erişebilmenize yardım
edecektir. Bu kurulumun apache sunucularda ``DocumentRoot`` dizinine yazma
hakkı gerektirdiğine dikkat edin.

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
use CakePHP's built in pretty URLs. In **config/app.php**,
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
    :title lang=tr: Installation
    :keywords lang=tr: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
