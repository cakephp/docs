Установка
############

CakePHP довольно прост и легок в установке. Минимальные требования - веб-сервер и копия CakePHP, это все что Вам нужно! Этот раздел сосредоточен на установке CakePHP на Apache (поскольку он прост в установке и настройке), но CakePHP может также работать и с другими веб-серверами, как Nginx, LightHTTP или Microsoft IIS.

Требования к устаноке
=====================

- HTTP сервер. Например: Apache. Предпочтительно с mod\_rewrite, но необязательно.
- PHP 5.5.9 или выше (включая PHP 7).
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

Прежде чем вы начнете установку убедитесь что у Вас установлена необходимая минимальная версия PHP (5.5.9):

.. code-block:: bash

    php -v

У Вас, по крайней мере, должен быть установлен PHP 5.5.9 (CLI) или выше.
Ваш веб-сервер так же должен иметь версию PHP 5.5.9 или выше, и 
версия интерфейса командной строки PHP (CLI) 5.5.9 или выше.

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

  Для  установки Composer на Windows, вы можете скачать установщик Composer для Windows
  `здесь <https://github.com/composer/windows-setup/releases/>`__.  Более подробные
  инструкции по установке Composer на Windows можно найти в README
  `здесь <https://github.com/composer/windows-setup>`__.

Создание проекта CakePHP
------------------------

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=ru: Установка
    :keywords lang=ru: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
