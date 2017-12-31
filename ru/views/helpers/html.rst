Html
####

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

Роль HtmlHelper в CakePHP заключается в создании простых HTML-связей,
быстрых и более устойчивых к изменениям. При его использовании,
помощник позволит вашему приложению быть более подвижным,
и более гибким, там где он помещен относительно корня домена.

Многие методы HtmlHelper включают параметр ``$attributes``,
который позволяет вам использовать любые дополнительные атрибуты ваших тегов.
Вот несколько примеров использования параметра ``$attributes``:

.. code-block:: html

    Желаемые атрибуты: <tag class="someClass" />
    Массив параметров: ['class' => 'someClass']

    Желаемые атрибуты: <tag name="foo" value="bar" />
    Массив параметров:  ['name' => 'foo', 'value' => 'bar']

Вставка хорошо отформатированных элементов
==========================================

Самая важная задача, которую выполняет HtmlHelper - это создание
хорошо сформированной разметки. В этом разделе будут рассмотрены некоторые из
методов HtmlHelper и способы их использования.

Создание тегов Charset
----------------------

.. php:method:: charset($charset=null)

Используется для создания метатега с указанием кодировки документа. Значением по умолчанию
является кодировка UTF-8. Пример использования::

    echo $this->Html->charset();

Получаем:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Альтернативное использование::

    echo $this->Html->charset('ISO-8859-1');

Получаем:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

Ссылки на CSS файлы
-------------------

.. php:method:: css(mixed $path, array $options = [])

Создаёт ссылку на файл стиля CSS. Если ``блок`` опций содержит значение
``true``, то теги ссылок добавляются в блок ``css``, который вы можете распечатать
внутри тега head документа.

Вы можете использовать ``блок`` опций для управления тем, куда будет добавлен
элемент ссылки. По умолчанию он добавится в блок ``css``.

Если для ключа 'rel' в ``$options`` установлено значение 'import', то таблица стилей будет импортирована.

Этот метод подключения CSS предполагает, что указанный файл CSS
находится внутри каталога **webroot/css**, если путь не начинается с символа '/'. ::

    echo $this->Html->css('forms');

Получаем:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />

Первым параметром может быть массив для подключения нескольких файлов. ::

    echo $this->Html->css(['forms', 'tables', 'menu']);

Получаем:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />
    <link rel="stylesheet" href="/css/tables.css" />
    <link rel="stylesheet" href="/css/menu.css" />

Вы можете включать файлы CSS из любого загруженного плагина, используя синтаксис плагина
:term:`plugin syntax`. Чтобы подключить **plugins/DebugKit/webroot/css/toolbar.css**
вы можете сделать следующее::

    echo $this->Html->css('DebugKit.toolbar.css');

Если вы хотите добавить файл CSS, который имеет такое же имя, как и загруженный
плагин, вы можете сделать следующее. Например, если у вас есть плагин ``Blog``,
и вы хотите также подключить **webroot/css/Blog.common.css**, вы можете сделать следующее::

    echo $this->Html->css('Blog.common.css', ['plugin' => false]);

Программируемое создание CSS
----------------------------

.. php:method:: style(array $data, boolean $oneline = true)

Создает определения стиля CSS на основе ключей и значений
массива, переданного данному методу. Это особенно удобно, если ваш файл CSS
динамичный. ::

    echo $this->Html->style([
        'background' => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    ]);

Получаем::

    background:#633; border-bottom:1px solid #000; padding:10px;


Создание мета-тегов
-------------------

.. php:method:: meta(string|array $type, string $url = null, array $options = [])

Этот метод удобен для связи с внешними ресурсами, такими как RSS/Atom-каналы
и фав-иконки. Как и в методе css(), здесь вы можете указать, хотите ли вы использовать
этот тег в строке или внутри блока ``meta``. Для вставки внутрь блока,
установите параметр $attributes в ``true``, то есть - ``['block' => true]``.

Если вы установите атрибут "type" с помощью параметра $attributes, то
CakePHP создаст несколько ярлыков:

======== ======================
 type     translated value
======== ======================
html     text/html
rss      application/rss+xml
atom     application/atom+xml
icon     image/x-icon
======== ======================

.. code-block:: php

    <?= $this->Html->meta(
        'favicon.ico',
        '/favicon.ico',
        ['type' => 'icon']
    );
    ?>
    // Вывод (с добавленным разрывом строк)
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
    <?= $this->Html->meta(
        'Comments',
        '/comments/index.rss',
        ['type' => 'rss']
    );
    ?>
    // Вывод (с добавленным разрывом строк)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

Этот метод также можно использовать для добавления meta keywords (ключевых слов) и
описания. например::

    <?= $this->Html->meta(
        'keywords',
        'здесь вводим любые ключевые слова'
    );
    ?>
    // Вывод
    <meta name="keywords" content="здесь вводим любые ключевые слова" />

    <?= $this->Html->meta(
        'description',
        'здесь вводим любое мета-описание'
    );
    ?>
    // Вывод
    <meta name="description" content="здесь вводим любое мета-описание" />

Помимо создания предопределенных метатегов, вы можете создавать элементы ссылок::

    <?= $this->Html->meta([
        'link' => 'http://example.com/manifest',
        'rel' => 'manifest'
    ]);
    ?>
    // Вывод
    <link href="http://example.com/manifest" rel="manifest"/>

Любые атрибуты, преданные в метод meta(), будут добавлены в сгенерированный тег.

Создание DOCTYPE
----------------

.. php:method:: docType(string $type = 'html5')

Возвращает (X)HTML DOCTYPE (объявление типа документа). Предоставляются типы документа
в соответствии со следующей таблицей:

+--------------------------+----------------------------------+
| type                     | translated value                 |
+==========================+==================================+
| html4-strict             | HTML 4.01 Strict                 |
+--------------------------+----------------------------------+
| html4-trans              | HTML 4.01 Transitional           |
+--------------------------+----------------------------------+
| html4-frame              | HTML 4.01 Frameset               |
+--------------------------+----------------------------------+
| html5 (default)          | HTML5                            |
+--------------------------+----------------------------------+
| xhtml-strict             | XHTML 1.0 Strict                 |
+--------------------------+----------------------------------+
| xhtml-trans              | XHTML 1.0 Transitional           |
+--------------------------+----------------------------------+
| xhtml-frame              | XHTML 1.0 Frameset               |
+--------------------------+----------------------------------+
| xhtml11                  | XHTML 1.1                        |
+--------------------------+----------------------------------+

::

    echo $this->Html->docType();
    // Вывод: <!DOCTYPE html>

    echo $this->Html->docType('html4-trans');
    // Вывод:
    // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    //    "http://www.w3.org/TR/html4/loose.dtd">

Ссылки на изображения
---------------------

.. php:method:: image(string $path, array $options = [])

Создает отформатированный тег изображения. Указанный путь должен быть относительным
по отношению к **webroot/img/**. ::

    echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

Получаем:

.. code-block:: html

    <img src="/img/cake_logo.png" alt="CakePHP" />

Чтобы создать ссылку на изображение, укажите назначение ссылки, используя
``url`` в ``$attributes``. ::

    echo $this->Html->image("recipes/6.jpg", [
        "alt" => "Brownies",
        'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
    ]);

Получаем:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Если вы создаёте ссылки на изображения для электронных писем или хотите получить абсолютные пути к изображениям, вы
может использовать опцию ``fullBase``::

    echo $this->Html->image("logo.png", ['fullBase' => true]);

Получаем:

.. code-block:: html

    <img src="http://example.com/img/logo.jpg" alt="" />

Вы можете включать файлы изображений из любого загруженного плагина, используя синтаксис плагина
:term:`plugin syntax`. Подключить **plugins/DebugKit/webroot/img/icon.png**
вы можете следующим образом::

    echo $this->Html->image('DebugKit.icon.png');

Если вы хотите включить файл изображения, который имеет одинаковое имя с загруженным
плагином, вы можете сделать следующее. Например, если у вас есть плагин ``Blog``,
и вы хотите подключить **webroot/img/Blog.icon.png**, вы можете сделать так::

    echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

Создание ссылок
---------------

.. php:method:: link(string $title, mixed $url = null, array $options = [])

Метод общего назначения для создания ссылок HTML. Для указания атрибутов
к элементу ``$title``, используйте ``$options`` и не забудьте об экранировании. ::

    echo $this->Html->link(
        'Enter',
        '/pages/home',
        ['class' => 'button', 'target' => '_blank']
    );

Получаем:

.. code-block:: html

    <a href="/pages/home" class="button" target="_blank">Enter</a>

Используйте опцию  ``'_full'=>true`` для абсолютных URL-ов::

    echo $this->Html->link(
        'Панель приборов',
        ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
    );

Получаем:

.. code-block:: html

    <a href="http://www.yourdomain.com/dashboards/index">Панель приборов</a>

Укажите ключ ``confirm`` в параметрах, для отображения ``confirm()``
диалога JavaScript::

    echo $this->Html->link(
        'Удалить',
        ['controller' => 'Recipes', 'action' => 'delete', 6],
        ['confirm' => 'Вы точно уверены, что хотите удалить этот рецепт?']
    );

Получаем:

.. code-block:: html

    <a href="/recipes/delete/6"
        onclick="return confirm(
            'Вы точно уверены, что хотите удалить этот рецепт?'
        );">
        Удалить
    </a>

Строки запроса также могут быть созданы с помощью ``link()``. ::

    echo $this->Html->link('Посмотреть изображение', [
        'controller' => 'Images',
        'action' => 'view',
        1,
        '?' => ['height' => 400, 'width' => 500]
    ]);

Получаем:

.. code-block:: html

    <a href="/images/view/1?height=400&width=500">Посмотреть изображение</a>

Специальные символы HTML в ``$title`` будут преобразованы в HTML
сущности. Чтобы отключить это преобразование, установите опцию escape в
``false`` в массиве ``$options``. ::

    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
        "recipes/view/6",
        ['escape' => false]
    );

Получаем:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Установка ``escape`` в ``false`` также отключит экранирование атрибутов
у ссылки. Вы можете использовать опцию ``escapeTitle``, чтобы отключить
экранирование заголовка, а не атрибутов. ::

    echo $this->Html->link(
        $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
        'recipes/view/6',
        ['escapeTitle' => false, 'title' => 'hi "howdy"']
    );

Получаем:

.. code-block:: html

    <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Также посмотрите метод :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`
для получения дополнительных примеров различных типов URL-адресов.

Ссылки на видео и аудио файлы
-----------------------------

.. php:method:: media(string|array $path, array $options)

Опции:

- ``type`` Тип элемента мультимедиа для генерации, допустимого значения - "audio" или "видео". Если тип не указан, то тип носителя будет установлен на основе mime заголовка файла.
- ``text`` Текст для включения в тег к видео
- ``pathPrefix`` Префикс пути, для использования в относительных URL-адресах, по умолчанию используется 'files/'
- ``fullBase`` Значит, что атрибут src получит полный адрес включая доменное имя

Возвращаем отформатированный audio/video тег:

.. code-block:: php

    <?= $this->Html->media('audio.mp3') ?>

    // Вывод
    <audio src="/files/audio.mp3"></audio>

    <?= $this->Html->media('video.mp4', [
        'fullBase' => true,
        'text' => 'Fallback text'
    ]) ?>

    // Вывод
    <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

   <?= $this->Html->media(
        ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
        ['autoplay']
    ) ?>

    // Вывод
    <video autoplay="autoplay">
        <source src="/files/video.mp4" type="video/mp4"/>
        <source src="/files/video.ogg" type="video/ogg;
            codecs='theora, vorbis'"/>
    </video>

Ссылки на файлы Javascript
--------------------------

.. php:method:: script(mixed $url, mixed $options)

Подключает файл(ы) сценария, содержащий(ие) либо локальный(ые), либо удаленный(ые) URL(-ы).

По умолчанию, теги script будут вставляться в документ как строка. Вы можете переопределить это поведение,
установив ``$options['block']`` в ``true``, тогда вместо тегов script,
будет добавлен блок ``script``, который вы можете распечатать в любом другом месте документа.
Если вы захотите переопределить имя блока, вы можете сделать это, установив это в настройке
``$options['block']``.

``$options['once']`` управляет тем, включать или нет этот сценарий один раз за запрос или больше, чем
один раз. По умолчанию используется значение `` true``.

Вы можете использовать $options для установки дополнительных свойств для
создаваемого тега скрипта. Если используется массив тегов скрипта,
атрибуты будут применены ко всем сгенерированным тэгам скриптов.

Этот метод подключения файла JavaScript предполагает, что
указанный файл JavaScript находится внутри каталога **webroot/js**::

    echo $this->Html->script('scripts');

Получаем:

.. code-block:: html

    <script src="/js/scripts.js"></script>

Вы можете ссылаться на файлы с абсолютными путями, а также на ссылки файлов
которые не входят в **webroot/js**::

    echo $this->Html->script('/otherdir/script_file');

Вы также можете сослаться на удаленный URL-адрес::

    echo $this->Html->script('http://code.jquery.com/jquery.min.js');

Получаем:

.. code-block:: html

    <script src="http://code.jquery.com/jquery.min.js"></script>

Первым параметром может быть массив для включения нескольких файлов. ::

    echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

Получаем:

.. code-block:: html

    <script src="/js/jquery.js"></script>
    <script src="/js/wysiwyg.js"></script>
    <script src="/js/scripts.js"></script>

Вы можете добавить тег скрипта к определенному блоку с помощью опции ``block``::

    echo $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

В вашем макете вы можете вывести все теги скриптов, добавленные в 'scriptBottom'::

    echo $this->fetch('scriptBottom');

Вы можете подключать файлы сценариев из любого загруженного плагина, используя
:term:`plugin syntax`. Чтобы подключить **plugins/DebugKit/webroot/js/toolbar.js**
вы можете сделать так::

    echo $this->Html->script('DebugKit.toolbar.js');

Если вы хотите подключить файл сценария, который имеет одинаковое имя с загруженным
плагином, вы можете сделать следующее. Например, если у вас есть плагин ``Blog``,
и также, вы хотите подключить **webroot/js/Blog.plugins.js**, вы можете сделать так ::

    echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

Создание встроенных блоков Javascript
-------------------------------------

.. php:method:: scriptBlock($code, $options = [])

Чтобы сгенерировать блоки Javascript для кода представления(Вида) PHP, вы можете использовать один из скриптов
блочных методов. Сценарии могут быть выведены на место, или буферизованы в блок::

    // Определите блок сценария сразу, с атрибутом defer.
    $this->Html->scriptBlock('alert("hi")', ['defer' => true]);

    // Буфер-блок сценария, который будет выведен позже.
    $this->Html->scriptBlock('alert("hi")', ['block' => true]);

.. php:method:: scriptStart($options = [])
.. php:method:: scriptEnd()

Вы можете использовать метод ``scriptStart()`` для создания блока захвата, который будет
выводить в тег ``<script>``. Захваченные фрагменты сценария могут выводиться встроенными,
или забуферироваными в блок::

    // Добавление сценария в блок.
    $this->Html->scriptStart(['block' => true]);
    echo "alert('Я нахожусь в JavaScript');";
    $this->Html->scriptEnd();

После того, как вы забуферировали javascript, вы можете вывести его, как и любой другой блок представления
:ref:`View Block <view-blocks>`::

    // В ващем layout-е
    echo $this->fetch('script');

Создание вложенных списков
--------------------------

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

Создадим вложенный список (UL/OL) из ассоциативного массива::

    $list = [
        'Languages' => [
            'English' => [
                'American',
                'Canadian',
                'British',
            ],
            'Spanish',
            'German',
        ]
    ];
    echo $this->Html->nestedList($list);

Вывод:

.. code-block:: html

    // Вывод (минус пробелы)
    <ul>
        <li>Languages
            <ul>
                <li>English
                    <ul>
                        <li>American</li>
                        <li>Canadian</li>
                        <li>British</li>
                    </ul>
                </li>
                <li>Spanish</li>
                <li>German</li>
            </ul>
        </li>
    </ul>

Создание заголовков таблиц
--------------------------

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

Создаёт строку заголовка ячеек таблицы, для размещения внутри тегов <table></table>::

    echo $this->Html->tableHeaders(['Date', 'Title', 'Active']);

Вывод:

.. code-block:: html

    <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Active</th>
    </tr>

::

    echo $this->Html->tableHeaders(
        ['Date', 'Title','Active'],
        ['class' => 'status'],
        ['class' => 'product_table']
    );

Вывод:

.. code-block:: html

    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

Вы можете установить атрибуты для столбцов в ``$thOptions``.
Они будут использованы вместо значений указанных по умолчанию::

    echo $this->Html->tableHeaders([
        'id',
        ['Name' => ['class' => 'highlight']],
        ['Date' => ['class' => 'sortable']]
    ]);

Вывод:

.. code-block:: html

    <tr>
        <th>id</th>
        <th class="highlight">Name</th>
        <th class="sortable">Date</th>
    </tr>

Создание ячеек таблицы
----------------------

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

Создает ячейки таблицы в строках, назначая атрибуты <tr> по-разному
для строк с нечётными и чётными номерами. Обернём каждую ячейку таблицы
массивом, для каждого конкретного <td>-атрибута. ::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', 'Best Brownies', 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', 'No'],
    ]);

Вывод:

.. code-block:: html

    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>

::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', ['Best Brownies', ['class' => 'highlight']] , 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', ['No', ['id' => 'special']]],
    ]);

Вывод:

.. code-block:: html

    <tr>
        <td>
            Jul 7th, 2007
        </td>
        <td class="highlight">
            Best Brownies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Jun 21st, 2007
        </td>
        <td>
            Smart Cookies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Aug 1st, 2006
        </td>
        <td>
            Anti-Java Cake
        </td>
        <td id="special">
            No
        </td>
    </tr>

::

    echo $this->Html->tableCells(
        [
            ['Red', 'Apple'],
            ['Orange', 'Orange'],
            ['Yellow', 'Banana'],
        ],
        ['class' => 'darker']
    );

Вывод:

.. code-block:: html

    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

Изменение вывода тегов в HtmlHelper
===================================

.. php:method:: setTemplates($templates)

Параметр ``$templates`` может быть либо строковым файловым путем для PHP
файла, содержащим теги, которые вы хотите загрузить, или массивом шаблонов для
добавления/замены::

    // Загрузка шаблона config/my_html.php
    $this->Html->setTemplates('my_html');

    // Загрузка определённого шаблона
    $this->Html->setTemplates([
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ]);

При загрузке файлов шаблонов, ваш файл должен выглядеть так::

    <?php
    return [
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ];

.. warning::

    Строки шаблонов, содержащие знак процента (``%``), требуют особого внимания.
    Вы должны приписать этому символу еще один процент, чтобы он выглядел так ``%%``.
    Причина в том, что внутренние шаблоны скомпилированы для использования с методом
    ``sprintf()``. Пример: '<div style = "width: {{size}} %%"> {{content}} </ div>'

Создание дорожки из хлебных крошек с помощью HtmlHelper
=======================================================

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)
.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)
.. php:method:: getCrumbList(array $options = [], $startText = false)

Во многих приложениях есть "хлебные крошки" для облегчения навигации для конечных пользователей.
Вы можете создать "хлебные крошки" в вашем приложении с помощью HtmlHelper. Сделайте
сначала хлебные крошки, в макете вашего шаблона::

    echo $this->Html->getCrumbs(' > ', 'Home');

Параметр ``$startText`` также может принимать массив. Это даёт больший контроль
над генерируемой первой ссылкой::

    echo $this->Html->getCrumbs(' > ', [
        'text' => $this->Html->image('home.png'),
        'url' => ['controller' => 'Pages', 'action' => 'display', 'home'],
        'escape' => false
    ]);

Любые ключи, которые не являются ``text`` или ``url``, будут переданы
:php:meth:`~HtmlHelper::link()` как параметр ``$options``.

Теперь, по вашему желанию, вы можете добавить следующее, чтобы вывести хлебные крошки
на любой из страниц::

    $this->Html->addCrumb('Users', '/users');
    $this->Html->addCrumb('Add User', ['controller' => 'Users', 'action' => 'add']);

Это добавит вывод "**Home > Users > Add User**" в вашем макете, где
добавлен ``getCrumbs``.

Вы также можете получить крошки, отформатированные внутри HTML-списка::

    echo $this->Html->getCrumbList();

В качестве параметров вы можете использовать обычный параметр HTML, который вписывается в ``<ul>``
(Ненумерованный список), например ``class``. Для определенных параметров у вас есть:
``separator`` (будет находиться между элементами ``<li>``, ``firstClass`` и
``lastClass``, например так::

    echo $this->Html->getCrumbList(
        [
            'firstClass' => false,
            'lastClass' => 'active',
            'class' => 'breadcrumb'
        ],
        'Home'
    );

Этот метод использует: :php:meth:`Cake\\View\\Helper\\HtmlHelper::tag()` для генерации
списка и его элементов. Работает аналогично
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`, поэтому он использует параметры
с каждой крошкой. Вы можете использовать параметр ``$startText`` чтобы
предоставить первую хлебную ссылку/текст. Это полезно, когда вы хотите
включить корневую ссылку. Эта опция работает так же, как опция ``$startText`` для
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`.


.. meta::
    :title lang=ru: HtmlHelper
    :description lang=ru: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=en: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs

