Установка
#########

CakePHP довольно прост и легок в установке. Минимальные требования - веб-сервер и копия CakePHP, это все что Вам нужно! Этот раздел сосредоточен на установке CakePHP на Apache (поскольку он прост в установке и настройке), но CakePHP может также работать и с другими веб-серверами, как Nginx, LightHTTP или Microsoft IIS.

Требования к установке
======================

- HTTP сервер. Например: Apache. Предпочтительно с mod\_rewrite, но необязательно.
- PHP 5.6.0 или выше (включая PHP 7.1).
- Расширение mbstring для PHP 
- Расширение intl для PHP 

.. note::

    В XAMPP и WAMP, расширение mbstring работает по умолчанию.

    В XAMPP, расширение intl установлено, но не включено, чтобы включить intl Вам необходимо раскомментировать
    ``extension=php_intl.dll`` в файле **php.ini** и перезапустить сервер, используя
    XAMPP панель.

    В WAMP, расширение intl установлено, но не включено.
    Чтобы включить intl Вам необходимо перейти в директорию в которой расположен php
    **C:\\wamp\\bin\\php\\php{version}**, скопируйте все файлы, которые выглядят как
    **icu*.dll** и вставьте а директорию apache\bin
    **C:\\wamp\\bin\\apache\\apache{version}\\bin**. После этого перезапустите сервер.

Поскольку ядро базы данных не требуется, мы предполагаем что большинсво приложений будут использовать одно ядро. CakePHP поддерживает различные движки базы данных:

-  MySQL (5.1.10 или выше)
-  PostgreSQL
-  Microsoft SQL Server (2008 или выше)
-  SQLite 3

.. note::

    Все встроенные драйвера баз данных требуют PDO. Вы должны убедиться, что у Вас установлены корректные расширения PDO.

Установка CakePHP
=================

Прежде чем вы начнете установку убедитесь что у Вас установлена необходимая
минимальная версия PHP (5.6.0):

.. code-block:: bash

    php -v

У Вас, по крайней мере, должен быть установлен PHP 5.6.0 (CLI) или выше.
Ваш веб-сервер так же должен иметь версию PHP 5.6.0 или выше, и 
версия интерфейса командной строки PHP (CLI) 5.6.0 или выше.

Установка Composer
-------------------

CakePHP использует мендежер зависимостей PHP `Composer <http://getcomposer.org>`_,
как официально поддерживаемый метод установки.

- Установка Composer на Linux и macOS

  #. Запустите скрипт установки, как описано в
     `официальной документации Composer <https://getcomposer.org/download/>`_
     и следуйте инструкциям по установке, чтобы установить Composer.
  #. Выполните следующую команду, чтобы переместить composer.phar в директорию
     по адресу::

         mv composer.phar /usr/local/bin/composer

- Установка Composer на Windows

  Для  установки Composer на Windows, вы можете скачать установщик Composer для
  Windows `здесь <https://github.com/composer/windows-setup/releases/>`__.  Более
  подробные инструкции по установке Composer на Windows можно найти в README
  `здесь <https://github.com/composer/windows-setup>`__.

Создание проекта CakePHP
------------------------

Теперь, когда вы скачали и установили Composer, предположим вы хотите создать
новое приложение CakePHP в папке my_app_name. Для этого просто выполните
следующую команду composer:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app my_app_name

Или если Composer установлен глобально:

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app my_app_name
    
Как только Composer закончит скачивание каркаса приложения и библиотеки ядра
CakePHP, у вас должно появиться полностью работоспособное приложение CakePHP.
Убедитесь в том, чтобы в папке вашего приложения всегда были файлы
composer.json и composer.lock.

Вы можете перейти по тому пути, куда установлено ваше приложение CakePHP и
вы увидите стандартную домашнюю страницу. Чтобы изменить ее содержимое, вы
можете отредактировать файл **src/Template/Pages/home.ctp**.

Несмотря на то, что composer является рекомендуемым методом установки,
имеются также готовые сборки доступные для скачивания на
`Github <https://github.com/cakephp/cakephp/tags>`__. Эти сборки содержат
каркас приложения со всеми установленными пакетами. Также они содержат
файл ``composer.phar``, таким образом вы получаете все необходимое для
дальнейшей работы.

Обновление CakePHP до актуальной версии
---------------------------------------

По умолчанию в файле **composer.json** вашего приложения присутствуют
следующие настройки::

    "require": {
        "cakephp/cakephp": "3.4.*"
    }
    
Каждый раз при запуске команды ``php composer.phar update`` вы будете получать
патчи для данной минорной версии. Вы все же можете изменить это значение на
``~3.4`` для получения последней стабильной версии ветки ``3.x``.

Если вы хотите получать позднейшие изменения в CakePHP, еще не вошедшие в релиз,
установите значение версии **dev-master** в файле **composer.json**::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

Учтите, что устанавливать данное значение не рекомендуется, так как это может
нарушить работоспособность вашего приложения при установке следующей релизной
версии. В дополнение к этому composer не кеширует промежуточные ветки
разработки, и это может привести к замедлению последующих обновлений через
composer.

Установка с помощью Oven
------------------------

Еще один быстрый способ установки CakePHP это
`Oven <https://github.com/CakeDC/oven>`_. Это простой PHP-скрипт, который
определяет, что требуется скачать, уcтанавливает каркас приложения CakePHP
и выполняет все необходимые предварительные настройки.

После завершения установки вы также получите работоспособное приложение
CakePHP.

.. note::

    ВАЖНО: Этот скрипт не предназначен для внедрения, его целью является лишь
    помощь тем разработчикам, которые прежде не сталкивались с установкой CakePHP
    и которым нужно быстро получить готовое окружение за считанные секунды.
    Для продакшена необходимо учитывать также некоторые другие факторы, такие как
    права доступа для файлов, конфигугация виртуального хоста и др.
    
Права доступа
=============

CakePHP использует папку **tmp** для ряда различных операций. Описания
модели, кешированные виды, сессионные данные - это лишь некоторые примеры.
Папка **logs** используется для записи лог-файлов стандартным движком
``FileLog``.

Поэтому убедитесь, что в вашем приложении CakePHP для папок **logs**, **tmp**
и всех их подпапок установлены разрешения для записи данных пользователями.
Composer при установке автоматически устанавливает правана запись для папки
**tmp** и ее подпапок для большего удобства, но вы всегда можете
перенастроить эти параметры в случае необходимости.

Проблема в том, что папки **logs** и **tmp**, а также их подпапки должны быть
доступны для записи как со стороны веб-сервера, так для пользователей
командной строки. В системе UNIX, если учетная запись пользователя веб-сервера
не совпадает с учетной записью пользователя командной строки, вы можете
выполнить следующие команды из папки вашего приложения всего лишь один раз,
чтобы быть уверенным в том, что разрешения будут настроены корректно:

.. code-block:: bash

    HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
    setfacl -R -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -m u:${HTTPDUSER}:rwx logs
    setfacl -R -d -m u:${HTTPDUSER}:rwx logs
    
Чтобы воспользоваться инструментами консоли CakePHP, вы должны убедиться, что
файл ``bin/cake`` работоспособен. На \*nix или macOS вы можете выполнить
команду:

.. code-block:: bash

    chmod +x bin/cake

В Windows, файл **.bat** должен быть сразу готов к работе. Если вы используете
Vagrant, либо какую-то еще оболочку виртуальной среды, то любые общие папки
должны обладать разрешениями на исполнение (Пожалуйста обратитесь к документации
вашей виртуальной среды для решения этой задачи).

Если же по какой-либо причине вы не можете изменить разрешения для файла 
``bin/cake``, можете  запустить консоль CakePHP командой:

.. code-block:: bash

    php bin/cake.php
    
Встроенный веб-сервер PHP
=========================

Встроенный веб-сервер PHP - это самый быстрый способ настройки  CakePHP. В
данном примере мы будем использовать консоль CakePHP для запуска встроенного
веб-сервера PHP, который сделает ваше приложение доступным по адресу следующего
вида - **http://host:port**. Из папки приложения выполните:

.. code-block:: bash

    bin/cake server

Без передачи дополнительных параметров эта команда сделает ваше приложение
доступным по адресу **http://localhost:8765/**.

Если у вас имеется что-нибудь конфликтующее с именем **localhost** или портом
8765, вы можете указать в консоли CakePHP запустить веб-сервер на определенном
хосте и/или номере порта используя следующие параметры:

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

Это сделает ваше приложение досупным по адресу **http://192.168.13.37:5673/**.

Вот и все - ваше приложение работает, и нет необходимости в настройке
веб-сервера.

.. warning::

    Встроенный веб-сервер *никогда* не следует использовать в продакшене.
    Он предназначается только для тестирования приложения в процессе разработки.
    
Если вы предпочтете использовать полноценный веб-сервер, у вас должна быть
возможность переместить вашу установку CakePHP (включая скрытые файлы) в
корневую папку вашего веб-сервера. В таком случае вы должны иметь возможность
направить ваш браузер в ту папку, в которую вы поместили файлы, и вы увидите
ваше приложение в действии.

Полноценная установка
=====================

Полноценная установка - это более гибкий способ настройки CakePHP. Его 
использование позволяет всему домену действовать как единому приложению
CakePHP. Данный пример поможет вам установить CakePHP в вашей файловой системе,
и сделать его доступным по адресу http://www.example.com. Учтите, что вам
могут понадобиться права для изменения ``DocumentRoot`` на веб-серверах
Apache.

После установки вашего приложения одним из вышеперечисленных способов в
выбранную вами папку - мы предположим, что это будет /cake_install -
структура вашего приложения будет следующей::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (папка, соответствующая опции DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Разработчики, использующие Apache, должны установить директиву ``DocumentRoot``
для домена в следующее значение:

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

Если ваш веб-сервер настроен корректно, вы должны теперь иметь доступ к вашему
приложению по адресу http://www.example.com.

Запускайте
==========

Хорошо, давайте посмотрим на CakePHP в действии. В зависимости от
использованного способа настройки, вы должны указать в браузере либо адрес
http://example.com/, либо http://localhost:8765/. На данный момент вам должна
выводиться домашняя страница по умолчанию, и сообщение о состоянии подключения
к БД.

Поздравляем! Вы можете приступать к
:doc:`созданию вашего первого приложения CakePHP </quickstart>`.

.. _url-rewriting:

Переопределение URL
===================

Apache
------

Хотя CakePHP создан для работы с mod\_rewrite "из коробки" - и обычно
это так и есть - мы заметили, что некоторые пользователи пытаются получить
все для хорошей работы в их системах.

Вот несколько вещей, которые вы можете попробовать сделать, чтобы он работал
правильно. Первый взгляд на ваш httpd.conf. (Убедитесь, что вы редактируете
системный httpd.conf,а не пользовательский или определенный на сайте
httpd.conf.)

Эти файлы могут различаться в разных дистрибутивах и версиях Apache. Вы
Может также посмотреть http://wiki.apache.org/httpd/DistrosDefaultLayout для
более подробной информации.

#. Убедитесь, что переопределение .htaccess разрешено и, что AllowOverride 
   установлен в значении All для корректного DocumentRoot. Вы должны наблюдать
   нечто похожее на:

   .. code-block:: apacheconf

       # Каждая папка, к которой Apache имеет доступ, может быть настроена
       # в отношении того, какие сервисы и возможности разрешены и/или запрещены в той
       # папке (и ее подпапках).
       #
       # Для начала, мы настроим параметры "по умолчанию" довольно ограниченными
       # возможностями.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Убедитесь, что вы загружаете mod\_rewrite корректно. Вы должны видеть нечто
   подобное:

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Во многих системах эти настройки по умолчанию закомментированы, так что
   вы просто должны их раскомментировать, удалив символы # перед строками.

   После внесения правок перезапустите Apache, чтобы настройки вступили в силу.

   Убедитесь, что ваши файлы .htaccess находятся в правильных папках. Некоторые
   операционные системы скрывают файлы, имена которых начинаются с '.' и
   таким образом не позволяют копировать их.

#. Убедитесь, что ваша копия CakePHP получена из нашего Git-репозитория, и 
   корректно распакована, проврив файлы .htaccess.
   
   Папка app CakePHP (будет скопирована в корневую папку вашего приложения
   консолью bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Папка webroot CakePHP (будет скопирована в корневую папку вашего приложения
   консолью bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Если у вашего сайта CakePHP все еще есть проблемы с mod\_rewrite, попробуйте
   изменить настройки Virtual Hosts. На Ubuntu, отредактируйте файл
   **/etc/apache2/доступные-сайты/default** (расположение зависит от дистрибутива).
   В этом файле убедиесь, что опция ``AllowOverride None`` изменена на
   ``AllowOverride All``:

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

   На macOS, другое решение - это использовать инструмент
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_, чтобы заставить Virtual
   Host ссылаться на вашу папку.

   Для многих хостингов (GoDaddy, 1and1) ваш веб-сервер изначально обслуживается
   из папки пользователя, которая изначально использует mod\_rewrite. Если вы
   устанавливаете CakePHP в папку пользователя
   (http://example.com/~username/cakephp/), или любой другой URL, уже использующий
   mod\_rewrite, вам понадобится добавить блоки RewriteBase в файлы .htaccess,
   используемые CakePHP (.htaccess, webroot/.htaccess).

   Это может быть добавлено в ту же секцию, что и директива RewriteEngine.
   Так, к примеру ваш файл .htaccess папки webroot может выглядеть так:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /путь/к/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Более детальный разбор необходимых изменений будет зависеть от вашей
   конкретной установки, и может потребоваться указание параметров, не связанных
   непосредственно с CakePHP. Для более подробной информации пожалуйста ознакомьтесь
   с онлайн-документацией Apache.

#. (Опционально) Чтобы улучшить настройки продакшена, вы должны предотвращать
   обработку фреймворком CakePHP несуществующих ресурсов. Измените файл
   .htaccess папки webroot например вот так:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /путь/к/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   Данные настройки предотвратят передачу некорректных параметров файлу index.php
   и в случае необходимости вернут 404 ошибку.
   
   В дополнение к этому вы можете создать шаблон страницы для 404 ошибки, или же
   можете использовать встроенный в CakePHP шаблон, добавив директиву
   ``ErrorDocument``:

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found
       
nginx
-----

nginx не использует файлы .htaccess как Apache, так что необходимо создавать
эти переопределенные URL в конфигурации сайта. Обычно все это находится в
``/etc/nginx/доступные-сайты/файл_конфигурации_вашего_виртуального_хоста``.
В зависимости от ваших настроек, вам возможно придется внести некоторые правки
в данные параметры, но как правило небольшие, вам понадобится PHP на FastCGI:

.. code-block:: nginx

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # директива root должна быть глобальной
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
    
На некоторых серверах (таких как Ubuntu 14.04) приведенная выше конфигурация
не будет работать "из коробки", и документация nginx рекомендует иной подход
(http://nginx.org/en/docs/http/converting_rewrite_rules.html). Попробуйте
нижеприведенные настройки (вы можете заметить, что в данном случае
используется всего один блок server {}, а не два, как бы там ни было, если
вы хотите иметь доступ к вашему приложению CakePHP еще и с адреса example.com
помимо www.example.com, ознакомьтесь с документацией по ссылке выше):

.. code-block:: nginx

    server {
        listen   80;
        server_name www.example.com;
        rewrite 301 http://www.example.com$request_uri permanent;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

IIS7 (Windows хостинги)
-----------------------

IIS7 изначально не поддерживает файлы .htaccess. В то время, когда существуют
дополнения, добавляющие эту поддержку, вы можете также импортировать правила
htaccess в IIS для использования встроенных в CakePHP переопределений. Чтобы
сделать это, выполните следующие шаги:

#. Используйте `Microsoft Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_
   для установки URL `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   или скачайте его (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Создайте новый файл  web.config в вашей корневой папке CakePHP.
#. Используя Блокнот или любой XML-safe редактор, скопируйте следующий
   код в ваш новый файл web.config:

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

Как только файл web.config будет создан с корректными правилами переопределения,
все ссылки на CSS-стили, JavaScript и перенаправление маршрутов CakePHP должны
работать корректно.

Я не могу использовать переопределение URL
------------------------------------------

Если вы не хотите или не можете активировать модуль mod\_rewrite (или модуль
совместимый с ним) на вашем сервере, вы можете использовать встроенные
возможности CakePHP. В файле **config/app.php** раскомментируйте строку::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

И удалите эти файлы .htaccess::

    /.htaccess
    webroot/.htaccess
    
Это заставит ваши URL выглядеть как
www.example.com/index.php/controllername/actionname/param вместо
www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=ru: Установка
    :keywords lang=ru: apache mod rewrite,microsoft sql server,tar bz2,папка tmp,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
