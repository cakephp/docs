Пример Менеджер Закладок
########################

Это руководство проведет вас через создание простого приложения для создания
закладок (Менеджер Закладок). Для начала мы установим CakePHP, создадим нашу
базу данных, и используем инструменты CakePHP для быстрой развертки нашего
приложения.

Вот что вам понадобится:

#. Сервер БД. Мы собираемся использовать в этом руководстве сервер MySQL.
   Вы должны знать достаточно об SQL, чтобы суметь создать базу данных:
   в остальном можно положиться на CakePHP.
   Поскольку мы используем MySQL, убедитесь также, что  у Вас включено
   расширение ``pdo_mysql`` в PHP.
#. Базовые знания PHP.

Перед началом вы должны убедиться, что у вас установлена актуальная версия PHP:

.. code-block:: bash

    php -v

Убедитесь, что Вы используете версию PHP не ниже 5.5.9 (CLI). Версия PHP
вашего веб-сервера также должна быть не ниже 5.5.9 и лучше всего должна
совпадать с версией CLI. Если вы хотите увидеть полностью рабочее приложение,
проверьте `cakephp/bookmarker <https://github.com/cakephp/bookmarker-tutorial>`__.
Давайте приступим!

Получение CakePHP
=================

Простейший путь установить CakePHP - это использование Composer. С помощью
Composer Вы с легкостью установите фреймворк через командную строку или
терминал. Сначала скачайте и установите Composer если у Вас его еще нет.
Если у Вас установлен cURL, можете использовать следующую команду::

    curl -s https://getcomposer.org/installer | php
    
Или Вы можете скачать ``composer.phar`` с
`веб-сайта Composer <https://getcomposer.org/download/>`_.

После этого просто наберите следующую строку в вашем терминале из вашей
установочной папки, чтобы развернуть базовую структуру приложения CakePHP
в папку **bookmarker**::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker
    
Преимущество при использовании Composer заключается в том, что он
автоматически произведет все необходимые настройки по правам доступа и создаст
файл конфигурации приложения config/app.php для Вас.

Также существуют и другие способы установки, если Вас не устраивает Composer.
Проверьте раздел документации :doc:`/installation`, чтобы узнать больше.

Независимо от того, каким способом установки Вы решите воспользоваться,
по окончании процесса установки, структура папки Вашего приложения будет
выглядеть следующим образом::

    /cake_install
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Теперь настало самое подходящее время для ознакомления с файловой структурой
приложения: проверьте раздел документации
:doc:`/intro/cakephp-folder-structure`.



.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.
