Константы и Функции
###################

В то время как большая часть вашей повседневной работы в CakePHP будет использовать основные классы и
методы, CakePHP имеет ряд глобальных функций для удобства, которые могут вам пригодиться.
Многие из этих функций предназначены для использования с классами CakePHP (загрузка модели или классы компонентов),
но многие другие работают с массивами или строками немного легче.

Мы также рассмотрим некоторые из констант, доступных в приложениях CakePHP.
С помощью этих констант можно сделать обновления не только более плавными,
но также получить удобные способы указывать определенные файлы или каталоги в приложении CakePHP.

Глобальные функции
==================

Здесь показаны функции CakePHP, которые доступны глобально. Большинство из них просто
удобные обёртки для других функций CakePHP, таких как отладка и перевод контента.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    Эта функция обрабатывает локализацию в приложениях CakePHP.
    ``$string_id`` идентифицирует ID идентификатор перевода.
    Вы можете указать дополнительные аргументы для замены определений в строке::

        __('You have {0} unread messages', $number);

    Вы также можете предоставить список заменяемых имен::

        __('You have {unread} unread messages', ['unread' => $number]);

    .. note::
        Ознакомьтесь с разделом
        :doc:`/core-libraries/internationalization-and-localization` для получения
        дополнительной информации.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Позволяет переопределить текущий домен для поиска одного сообщения.

    Полезно при интернационализации плагина:
    ``echo __d('PluginName', 'This is my plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Позволяет переопределить текущий домен для поиска одного множественного сообщения.
    Возвращает правильную множественную форму сообщения, идентифицированную ``$singular`` и 
    ``$plural`` для подсчёта суммы ``$count`` из домена ``$domain``.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Позволяет переопределить текущий домен для поиска одного сообщения. Он также позволяет 
    указать контекст.

    Контекст - это уникальный идентификатор строки перевода, который делает её уникальной в 
    пределах одного домена.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Позволяет переопределить текущий домен для поиска нескольких множественных сообщений.
    Он также позволяет указать контекст. Возвращает правильную множественную форму сообщения, 
    идентифицированную ``$singular`` и ``$plural`` для подсчёта суммы ``$count`` из домена ``$domain``.

    Контекст - это уникальный идентификатор строки перевода, который делает её уникальной в
    пределах одного домена.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Возвращает правильную множественную форму сообщения, идентифицированную 
    ``$singular`` и ``$plural`` для суммы ``$count``. Некоторые языки имеют 
    более одной формы для множественных сообщений, зависящих от числа.

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    Контекст - это уникальный идентификатор строки перевода, который делает её уникальной в 
    пределах одного домена.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)
    
    Возвращает правильную множественную форму сообщения, идентифицированную 
    ``$singular`` и ``$plural`` для подсчета суммы ``$count`` из домена ``$domain``.
    Он также позволяет указать контекст. Некоторые языки имеют более одной формы для
    множественных сообщений, зависящих от числа.

    Контекст - это уникальный идентификатор строки перевода, который делает её уникальной в 
    пределах одного домена.

.. php:function:: collection(mixed $items)

    Удобная оболочка для создания нового объекта :php:class:`Cake\\Collection\\Collection`, 
    обёртка для переданного аргументв. Параметр ``$items`` принимает либо объект 
    ``Traversable``, либо массив.

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    .. versionchanged:: 3.3.0
        Вызов этого метода вернёт переданный ``$var``, так что вы можете, например, 
        поместить его в оператор return.

    Если основная переменная ``$debug`` является ``true``, ``$var`` будет распечатан.
    Если ``$showHTML`` является ``true`` или оставлено как ``null``, данные будут 
    отображены в браузере. Если ``$showFrom`` не установлен в ``false``, вывод отладки 
    начинается со строки, из которой он был вызван. Также см :doc:`/development/debugging`

.. php:function:: dd(mixed $var, boolean $showHtml = null)

    Он ведёт себя как ``debug()``, но выполнение также останавливается. 
    Если основная переменная ``$debug`` является ``true``, печатается ``$var``. 
    Если ``$showHTML`` является ``true`` или оставлено как ``null``, данные будут 
    отображены в браузере.

.. php:function:: pr(mixed $var)

    .. versionchanged:: 3.3.0
        Вызов этого метода вернет переданный ``$var``, так что вы можете, например, 
        поместить его в оператор return.

    Удобная обёртка для ``print_r()``, с добавлением тегов ``<pre>`` вокруг вывода.

.. php:function:: pj(mixed $var)

    .. versionchanged:: 3.3.0
        Вызов этого метода вернёт переданный ``$var``, так что вы можете, например, 
        поместить его в оператор return.

    Функция удобной печати JSON с добавлением тегов ``<pre>`` вокруг вывода.

    Он предназначен для отладки JSON-представления объектов и массивов.

.. php:function:: env(string $key, string $default = null)

    .. versionchanged:: 3.1.1
        Добавлен параметр ``$default``.

    Получает переменную окружения из доступных источников. Используется в качестве 
    резервной копии, если ``$_SERVER`` или ``$_ENV`` отключены.

	Эта функция также эмулирует ``PHP_SELF`` и ``DOCUMENT_ROOT`` на неподдерживаемых серверах.
    На самом деле, это хорошая идея всегда использовать ``env()`` вместо ``$_SERVER`` или ``getenv()`` 
    (особенно если вы планируете распространять код), так как это полная эмуляция обёртки.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Удобная обёртка для ``htmlspecialchars()``.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Разделяет имя плагина синтаксиса в своём плагине и имени класса. 
    Если ``$name`` не имеет точки, то индекс 0 будет ``null``.

    Обычно используется как ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: namespaceSplit(string $class)

    Разделяет пространство имён от имени класса.

    Обычно используется как  ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``

Основные определения констант
=============================

Большинство из следующих констант относятся к путям в вашем приложении.

.. php:const:: APP

   Абсолютный путь к вашему каталогу приложений, включая конечную косую черту.

.. php:const:: APP_DIR

    Равно ``app`` или имени вашего каталога приложений.

.. php:const:: CACHE

    Путь к каталогу файлов кеша. Он может совместно использоваться 
    хостами в многосерверной настройке.

.. php:const:: CAKE

    Путь к каталогу cake.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Путь к корневому каталогу lib.

.. php:const:: CONFIG

   Путь к каталогу конфигурации.

.. php:const:: CORE_PATH

   Путь к корневому каталогу, заканчивается слешем.

.. php:const:: DS

    Сокращение ``DIRECTORY_SEPARATOR``, являющийся ``/`` для Linux и``\`` 
    для Windows.

.. php:const:: LOGS

    Путь к каталогу журналов(логов).

.. php:const:: ROOT

    Путь к корневому каталогу..

.. php:const:: TESTS

    Путь к каталогу тестов.

.. php:const:: TMP

    Путь к папке временных файлов.

.. php:const:: WWW\_ROOT

    Полный путь к webroot.

Сроки определения времени
=========================

.. php:const:: TIME_START

    Временная метка Unix в микросекундах как плавающее значение с момента запуска приложения.

.. php:const:: SECOND

    Равно 1

.. php:const:: MINUTE

    Равно 60

.. php:const:: HOUR

    Равно 3600

.. php:const:: DAY

    Равно 86400

.. php:const:: WEEK

    Равно 604800

.. php:const:: MONTH

    Равно 2592000

.. php:const:: YEAR

    Равно 31536000

.. meta::
    :title lang=ru: Константы и Функции
    :keywords lang=en: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,arrays,parameters,existence,translations
