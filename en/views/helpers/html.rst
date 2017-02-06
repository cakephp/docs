Html
####

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Many HtmlHelper methods include a ``$attributes`` parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the ``$attributes`` parameter:

.. code-block:: html

    Desired attributes: <tag class="someClass" />
    Array parameter: ['class' => 'someClass']

    Desired attributes: <tag name="foo" value="bar" />
    Array parameter:  ['name' => 'foo', 'value' => 'bar']

Inserting Well-Formatted Elements
=================================

The most important task the HtmlHelper accomplishes is creating
well formed markup. This section will cover some of the
methods of the HtmlHelper and how to use them.

Creating Charset Tags
---------------------

.. php:method:: charset($charset=null)

Used to create a meta tag specifying the document's character. The default value
is UTF-8. An example use::

    echo $this->Html->charset();

Will output:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Alternatively, ::

    echo $this->Html->charset('ISO-8859-1');

Will output:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

Linking to CSS Files
--------------------

.. php:method:: css(mixed $path, array $options = [])

Creates a link(s) to a CSS style-sheet. If the ``block`` option is set to
``true``, the link tags are added to the ``css`` block which you can print
inside the head tag of the document.

You can use the ``block`` option to control which block the link element
will be appended to. By default it will append to the ``css`` block.

If key 'rel' in ``$options`` array is set to 'import' the stylesheet will be imported.

This method of CSS inclusion assumes that the CSS file specified
resides inside the **webroot/css** directory if path doesn't start with a '/'. ::

    echo $this->Html->css('forms');

Will output:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />

The first parameter can be an array to include multiple files. ::

    echo $this->Html->css(['forms', 'tables', 'menu']);

Will output:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />
    <link rel="stylesheet" href="/css/tables.css" />
    <link rel="stylesheet" href="/css/menu.css" />

You can include CSS files from any loaded plugin using
:term:`plugin syntax`. To include **plugins/DebugKit/webroot/css/toolbar.css**
you could use the following::

    echo $this->Html->css('DebugKit.toolbar.css');

If you want to include a CSS file which shares a name with a loaded
plugin you can do the following. For example if you had a ``Blog`` plugin,
and also wanted to include **webroot/css/Blog.common.css**, you would::

    echo $this->Html->css('Blog.common.css', ['plugin' => false]);

Creating CSS Programatically
----------------------------

.. php:method:: style(array $data, boolean $oneline = true)

Builds CSS style definitions based on the keys and values of the
array passed to the method. Especially handy if your CSS file is
dynamic. ::

    echo $this->Html->style([
        'background' => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    ]);

Will output::

    background:#633; border-bottom:1px solid #000; padding:10px;


Creating meta Tags
------------------

.. php:method:: meta(string|array $type, string $url = null, array $options = [])

This method is handy for linking to external resources like RSS/Atom feeds
and favicons. Like css(), you can specify whether or not you'd like this tag
to appear inline or appended to the ``meta`` block by setting the 'block'
key in the $attributes parameter to ``true``, ie - ``['block' => true]``.

If you set the "type" attribute using the $attributes parameter,
CakePHP contains a few shortcuts:

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
    // Output (line breaks added)
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
    // Output (line breaks added)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

This method can also be used to add the meta keywords and
descriptions. Example::

    <?= $this->Html->meta(
        'keywords',
        'enter any meta keyword here'
    );
    ?>
    // Output
    <meta name="keywords" content="enter any meta keyword here" />

    <?= $this->Html->meta(
        'description',
        'enter any meta description here'
    );
    ?>
    // Output
    <meta name="description" content="enter any meta description here" />

In addition to making predefined meta tags, you can create link elements::

    <?= $this->Html->meta([
        'link' => 'http://example.com/manifest',
        'rel' => 'manifest'
    ]);
    ?>
    // Output
    <link href="http://example.com/manifest" rel="manifest"/>

Any attributes provided to meta() when called this way will be added to the
generated link tag.

Creating DOCTYPE
----------------

.. php:method:: docType(string $type = 'html5')

Returns a (X)HTML DOCTYPE (document type declaration). Supply the document
type according to the following table:

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
    // Outputs: <!DOCTYPE html>

    echo $this->Html->docType('html4-trans');
    // Outputs:
    // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    //    "http://www.w3.org/TR/html4/loose.dtd">

Linking to Images
-----------------

.. php:method:: image(string $path, array $options = [])


Creates a formatted image tag. The path supplied should be relative
to **webroot/img/**. ::

    echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

Will output:

.. code-block:: html

    <img src="/img/cake_logo.png" alt="CakePHP" />

To create an image link specify the link destination using the
``url`` option in ``$attributes``. ::

    echo $this->Html->image("recipes/6.jpg", [
        "alt" => "Brownies",
        'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
    ]);

Will output:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

If you are creating images in emails, or want absolute paths to images you
can use the ``fullBase`` option::

    echo $this->Html->image("logo.png", ['fullBase' => true]);

Will output:

.. code-block:: html

    <img src="http://example.com/img/logo.jpg" alt="" />

You can include image files from any loaded plugin using
:term:`plugin syntax`. To include **plugins/DebugKit/webroot/img/icon.png**
You could use the following::

    echo $this->Html->image('DebugKit.icon.png');

If you want to include an image file which shares a name with a loaded
plugin you can do the following. For example if you had a ``Blog`` plugin,
and also wanted to include **webroot/img/Blog.icon.png**, you would::

    echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

Creating Links
--------------

.. php:method:: link(string $title, mixed $url = null, array $options = [])

General purpose method for creating HTML links. Use ``$options`` to
specify attributes for the element and whether or not the
``$title`` should be escaped. ::

    echo $this->Html->link(
        'Enter',
        '/pages/home',
        ['class' => 'button', 'target' => '_blank']
    );

Will output:

.. code-block:: html

    <a href="/pages/home" class="button" target="_blank">Enter</a>

Use ``'_full'=>true`` option for absolute URLs::

    echo $this->Html->link(
        'Dashboard',
        ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
    );

Will output:

.. code-block:: html

    <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


Specify ``confirm`` key in options to display a JavaScript ``confirm()``
dialog::

    echo $this->Html->link(
        'Delete',
        ['controller' => 'Recipes', 'action' => 'delete', 6],
        ['confirm' => 'Are you sure you wish to delete this recipe?']
    );

Will output:

.. code-block:: html

    <a href="/recipes/delete/6"
        onclick="return confirm(
            'Are you sure you wish to delete this recipe?'
        );">
        Delete
    </a>

Query strings can also be created with ``link()``. ::

    echo $this->Html->link('View image', [
        'controller' => 'Images',
        'action' => 'view',
        1,
        '?' => ['height' => 400, 'width' => 500]
    ]);

Will output:

.. code-block:: html

    <a href="/images/view/1?height=400&width=500">View image</a>

HTML special characters in ``$title`` will be converted to HTML
entities. To disable this conversion, set the escape option to
``false`` in the ``$options`` array. ::

    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
        "recipes/view/6",
        ['escape' => false]
    );

Will output:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Setting ``escape`` to ``false`` will also disable escaping of attributes of the
link. You can use the option ``escapeTitle`` to disable just
escaping of title and not the attributes. ::

    echo $this->Html->link(
        $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
        'recipes/view/6',
        ['escapeTitle' => false, 'title' => 'hi "howdy"']
    );

Will output:

.. code-block:: html

    <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Also check :php:meth:`Cake\\View\\Helper\\UrlHelper::build()` method
for more examples of different types of URLs.

Linking to Videos and Audio Files
---------------------------------

.. php:method:: media(string|array $path, array $options)


Options:

- ``type`` Type of media element to generate, valid values are "audio"
  or "video". If type is not provided media type is guessed based on
  file's mime type.
- ``text`` Text to include inside the video tag
- ``pathPrefix`` Path prefix to use for relative URLs, defaults to
  'files/'
- ``fullBase`` If provided the src attribute will get a full address
  including domain name

Returns a formatted audio/video tag:

.. code-block:: php

    <?= $this->Html->media('audio.mp3') ?>

    // Output
    <audio src="/files/audio.mp3"></audio>

    <?= $this->Html->media('video.mp4', [
        'fullBase' => true,
        'text' => 'Fallback text'
    ]) ?>

    // Output
    <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

   <?= $this->Html->media(
        ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
        ['autoplay']
    ) ?>

    // Output
    <video autoplay="autoplay">
        <source src="/files/video.mp4" type="video/mp4"/>
        <source src="/files/video.ogg" type="video/ogg;
            codecs='theora, vorbis'"/>
    </video>

Linking to Javascript Files
---------------------------

.. php:method:: script(mixed $url, mixed $options)

Include a script file(s), contained either locally or as a remote URL.

By default, script tags are added to the document inline. If you override
this by setting ``$options['block']`` to ``true``, the script tags will instead
be added to the ``script`` block which you can print elsewhere in the document.
If you wish to override which block name is used, you can do so by setting
``$options['block']``.

``$options['once']`` controls whether or
not you want to include this script once per request or more than
once. This defaults to ``true``.

You can use $options to set additional properties to the
generated script tag. If an array of script tags is used, the
attributes will be applied to all of the generated script tags.

This method of JavaScript file inclusion assumes that the
JavaScript file specified resides inside the **webroot/js**
directory::

    echo $this->Html->script('scripts');

Will output:

.. code-block:: html

    <script src="/js/scripts.js"></script>

You can link to files with absolute paths as well to link files
that are not in **webroot/js**::

    echo $this->Html->script('/otherdir/script_file');

You can also link to a remote URL::

    echo $this->Html->script('http://code.jquery.com/jquery.min.js');

Will output:

.. code-block:: html

    <script src="http://code.jquery.com/jquery.min.js"></script>

The first parameter can be an array to include multiple files. ::

    echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

Will output:

.. code-block:: html

    <script src="/js/jquery.js"></script>
    <script src="/js/wysiwyg.js"></script>
    <script src="/js/scripts.js"></script>

You can append the script tag to a specific block using the ``block``
option::

    echo $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

In your layout you can output all the script tags added to 'scriptBottom'::

    echo $this->fetch('scriptBottom');

You can include script files from any loaded plugin using
:term:`plugin syntax`. To include **plugins/DebugKit/webroot/js/toolbar.js**
You could use the following::

    echo $this->Html->script('DebugKit.toolbar.js');

If you want to include a script file which shares a name with a loaded
plugin you can do the following. For example if you had a ``Blog`` plugin,
and also wanted to include **webroot/js/Blog.plugins.js**, you would::

    echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

Creating Inline Javascript Blocks
---------------------------------

.. php:method:: scriptBlock($code, $options = [])

To generate Javascript blocks from PHP view code, you can use one of the script
block methods. Scripts can either be output in place, or buffered into a block::

    // Define a script block all at once, with the defer attribute.
    $this->Html->scriptBlock('alert("hi")', ['defer' => true]);

    // Buffer a script block to be output later.
    $this->Html->scriptBlock('alert("hi")', ['block' => true]);

.. php:method:: scriptStart($options = [])
.. php:method:: scriptEnd()

You can use the ``scriptStart()`` method to create a capturing block that will
output into a ``<script>`` tag. Captured script snippets can be output inline,
or buffered into a block::

    // Append into the 'script' block.
    $this->Html->scriptStart(['block' => true]);
    echo "alert('I am in the JavaScript');";
    $this->Html->scriptEnd();

Once you have buffered javascript, you can output it as you would any other
:ref:`View Block <view-blocks>`::

    // In your layout
    echo $this->fetch('script');

Creating Nested Lists
---------------------

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

Build a nested list (UL/OL) out of an associative array::

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

Output:

.. code-block:: html

    // Output (minus the whitespace)
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

Creating Table Headings
-----------------------

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

Creates a row of table header cells to be placed inside of <table>
tags. ::

    echo $this->Html->tableHeaders(['Date', 'Title', 'Active']);

Output:

.. code-block:: html

    <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Active</th>
    </tr>

::

    echo $this->Html->tableHeaders(
        ['Date','Title','Active'],
        ['class' => 'status'],
        ['class' => 'product_table']
    );

Output:

.. code-block:: html

    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

You can set attributes per column, these are used instead of the
defaults provided in the ``$thOptions``::

    echo $this->Html->tableHeaders([
        'id',
        ['Name' => ['class' => 'highlight']],
        ['Date' => ['class' => 'sortable']]
    ]);

Output:

.. code-block:: html

    <tr>
        <th>id</th>
        <th class="highlight">Name</th>
        <th class="sortable">Date</th>
    </tr>

Creating Table Cells
--------------------

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

Creates table cells, in rows, assigning <tr> attributes differently
for odd- and even-numbered rows. Wrap a single table cell within an
[] for specific <td>-attributes. ::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', 'Best Brownies', 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', 'No'],
    ]);

Output:

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

Output:

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

Output:

.. code-block:: html

    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

Changing the Tags Output by HtmlHelper
======================================

.. php:method:: templates($templates)

The ``$templates`` parameter can be either a string file path to the PHP
file containing the tags you want to load, or an array of templates to
add/replace::

    // Load templates from config/my_html.php
    $this->Html->templates('my_html.php');

    // Load specific templates.
    $this->Html->templates([
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ]);

When loading files of templates, your file should look like::

    <?php
    return [
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ];

.. warning::

    Template strings containing a percentage sign (``%``) need special attention,
    you should prefix this character with another percentage so it looks like
    ``%%``. The reason is that internally templates are compiled to be used with
    ``sprintf()``. Example: '<div style="width:{{size}}%%">{{content}}</div>'

Creating Breadcrumb Trails with HtmlHelper
==========================================

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)
.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)
.. php:method:: getCrumbList(array $options = [], $startText = false)

Many applications have breadcrumb trails to ease end user navigations. You can
create a breadcrumb trail in your app with some help from HtmlHelper. To make
bread crumbs, first the following in your layout
template::

    echo $this->Html->getCrumbs(' > ', 'Home');

The ``$startText`` option can also accept an array. This gives more control
over the generated first link::

    echo $this->Html->getCrumbs(' > ', [
        'text' => $this->Html->image('home.png'),
        'url' => ['controller' => 'Pages', 'action' => 'display', 'home'],
        'escape' => false
    ]);

Any keys that are not ``text`` or ``url`` will be passed to
:php:meth:`~HtmlHelper::link()` as the ``$options`` parameter.

Now, in your view you'll want to add the following to start the
breadcrumb trails on each of the pages::

    $this->Html->addCrumb('Users', '/users');
    $this->Html->addCrumb('Add User', ['controller' => 'Users', 'action' => 'add']);

This will add the output of "**Home > Users > Add User**" in your layout where
``getCrumbs`` was added.

You can also fetch the crumbs formatted inside an HTML list::

    echo $this->Html->getCrumbList();

As options you can use regular HTML parameter that fits in the ``<ul>``
(Unordered List) such as ``class`` and for the specific options, you have:
``separator`` (will be between the ``<li>`` elements), ``firstClass`` and
``lastClass`` like::

    echo $this->Html->getCrumbList(
        [
            'firstClass' => false,
            'lastClass' => 'active',
            'class' => 'breadcrumb'
        ],
        'Home'
    );

This method uses :php:meth:`Cake\\View\\Helper\\HtmlHelper::tag()` to generate
list and its elements. Works similar to
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`, so it uses options
which every crumb was added with. You can use the ``$startText`` parameter to
provide the first breadcrumb link/text. This is useful when you always want to
include a root link. This option works the same as the ``$startText`` option for
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()`.


.. meta::
    :title lang=en: HtmlHelper
    :description lang=en: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=en: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
