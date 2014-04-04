HtmlHelper
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Many HtmlHelper methods include a ``$htmlAttributes`` parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the $htmlAttributes parameter:

.. code-block:: html

    Desired attributes: <tag class="someClass" />
    Array parameter: array('class' => 'someClass')

    Desired attributes: <tag name="foo" value="bar" />
    Array parameter:  array('name' => 'foo', 'value' => 'bar')


.. note::

    The HtmlHelper is available in all views by default. If you're
    getting an error informing you that it isn't there, it's usually
    due to its name being missing from a manually configured $helpers
    controller variable.

Inserting Well-Formatted Elements
=================================

The most important task the HtmlHelper accomplishes is creating
well formed markup. Don't be afraid to use it often - you can cache
views in CakePHP in order to save some CPU cycles when views are
being rendered and delivered. This section will cover some of the
methods of the HtmlHelper and how to use them.

.. php:method:: charset($charset=null)

    :param string $charset: Desired character set. If null, the value of
        ``App.encoding`` will be used.

    Used to create a meta tag specifying the document's character.
    Defaults to UTF-8

    Example use::

        echo $this->Html->charset();

    Will output:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    Alternatively, ::

        echo $this->Html->charset('ISO-8859-1');

    Will output:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

.. php:method:: css(mixed $path, array $options = array())

    :param mixed $path: Either a string of the CSS file to link, or an array with multiple files
    :param array $options: An array of options or :term:`html attributes`.

    Creates a link(s) to a CSS style-sheet. If the ``block`` option is set to
    true, the link tags are added to the ``css`` block which you can print
    inside the head tag of the document.

    You can use the ``block`` option to control which block the link element
    will be appended to. By default it will append to the ``css`` block.

    If key 'rel' in ``$options`` array is set to 'import' the stylesheet will be imported.

    This method of CSS inclusion assumes that the CSS file specified
    resides inside the /App/webroot/css directory if path doesn't start with a '/'.::

        echo $this->Html->css('forms');

    Will output:

    .. code-block:: html

        <link rel="stylesheet" href="/css/forms.css" />

    The first parameter can be an array to include multiple files.::

        echo $this->Html->css(['forms', 'tables', 'menu']);

    Will output:

    .. code-block:: html

        <link rel="stylesheet" href="/css/forms.css" />
        <link rel="stylesheet" href="/css/tables.css" />
        <link rel="stylesheet" href="/css/menu.css" />

    You can include CSS files from any loaded plugin using
    :term:`plugin syntax`. To include ``app/Plugin/DebugKit/webroot/css/toolbar.css``
    You could use the following::

        echo $this->Html->css('DebugKit.toolbar.css');

    If you want to include a CSS file which shares a name with a loaded
    plugin you can do the following. For example if you had a ``Blog`` plugin,
    and also wanted to include ``app/webroot/css/Blog.common.css``, you would::

        echo $this->Html->css('Blog.common.css', ['plugin' => false]);

.. php:method:: meta(string $type, string $url = null, array $options = array())

    :param string $type: The type meta tag you want.
    :param mixed $url: The URL for the meta tag, either a string or a :term:`routing array`.
    :param array $options: An array of :term:`html attributes`.

    This method is handy for linking to external resources like RSS/Atom feeds
    and favicons. Like css(), you can specify whether or not you'd like this tag
    to appear inline or appended to the ``meta`` block by setting the 'block'
    key in the $attributes parameter to true, ie - ``array('block' => true)``.

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

    If you want to add a custom meta tag then the first parameter
    should be set to an array. To output a robots noindex tag use the
    following code::

        echo $this->Html->meta(['name' => 'robots', 'content' => 'noindex']);

.. php:method:: docType(string $type = 'html5')

    :param string $type: The type of doctype being made.

    Returns a (X)HTML doctype tag. Supply the doctype according to the
    following table:

    +--------------------------+----------------------------------+
    | type                     | translated value                 |
    +==========================+==================================+
    | html4-strict             | HTML4 Strict                     |
    +--------------------------+----------------------------------+
    | html4-trans              | HTML4 Transitional               |
    +--------------------------+----------------------------------+
    | html4-frame              | HTML4 Frameset                   |
    +--------------------------+----------------------------------+
    | html5                    | HTML5                            |
    +--------------------------+----------------------------------+
    | xhtml-strict             | XHTML1 Strict                    |
    +--------------------------+----------------------------------+
    | xhtml-trans              | XHTML1 Transitional              |
    +--------------------------+----------------------------------+
    | xhtml-frame              | XHTML1 Frameset                  |
    +--------------------------+----------------------------------+
    | xhtml11                  | XHTML1.1                         |
    +--------------------------+----------------------------------+

    ::

        echo $this->Html->docType();
        // Outputs: <!DOCTYPE html>

        echo $this->Html->docType('html4-trans');
        // Outputs:
        // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        //    "http://www.w3.org/TR/html4/loose.dtd">

.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: A set of key => values with CSS properties.
    :param boolean $oneline: Should the contents be on one line.

    Builds CSS style definitions based on the keys and values of the
    array passed to the method. Especially handy if your CSS file is
    dynamic.::

        echo $this->Html->style([
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        ]);

    Will output::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = array())

    :param string $path: Path to the image.
    :param array $options: An array of :term:`html attributes`.

    Creates a formatted image tag. The path supplied should be relative
    to /App/webroot/img/.::

        echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

    Will output:

    .. code-block:: html

        <img src="/img/cake_logo.png" alt="CakePHP" />

    To create an image link specify the link destination using the
    ``url`` option in ``$htmlAttributes``.::

        echo $this->Html->image("recipes/6.jpg", [
            "alt" => "Brownies",
            'url' => ['controller' => 'recipes', 'action' => 'view', 6]
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
    :term:`plugin syntax`. To include ``app/Plugin/DebugKit/webroot/img/icon.png``
    You could use the following::

        echo $this->Html->image('DebugKit.icon.png');

    If you want to include a image file which shares a name with a loaded
    plugin you can do the following. For example if you had a ``Blog`` plugin,
    and also wanted to include ``app/webroot/js/Blog.icon.png``, you would::

        echo $this->Html->image('Blog.icon.png', array('plugin' => false));

.. php:method:: link(string $title, mixed $url = null, array $options = array(), string $confirmMessage = false)

    :param string $title: The text to display as the body of the link.
    :param mixed $url: Either the string location, or a :term:`routing array`.
    :param array $options: An array of :term:`html attributes`.

    General purpose method for creating HTML links. Use ``$options`` to
    specify attributes for the element and whether or not the
    ``$title`` should be escaped.::

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
            ['controller' => 'dashboards', 'action' => 'index', '_full' => true]
        );

    Will output:

    .. code-block:: html

        <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


    Specify ``$confirmMessage`` to display a JavaScript ``confirm()``
    dialog::

        echo $this->Html->link(
            'Delete',
            ['controller' => 'recipes', 'action' => 'delete', 6],
            [],
            "Are you sure you wish to delete this recipe?"
        );

    Will output:

    .. code-block:: html

        <a href="/recipes/delete/6"
            onclick="return confirm(
                'Are you sure you wish to delete this recipe?'
            );">
            Delete
        </a>

    Query strings can also be created with ``link()``.::

        echo $this->Html->link('View image', [
            'controller' => 'images',
            'action' => 'view',
            1,
            '?' => ['height' => 400, 'width' => 500]
        ]);

    Will output:

    .. code-block:: html

        <a href="/images/view/1?height=400&width=500">View image</a>

    When using named parameters, use the array syntax and include
    names for ALL parameters in the URL. Using the string syntax for
    paramters (i.e. "recipes/view/6/comments:false" will result in
    the colon characters being HTML escaped and the link will not work
    as desired.::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
            ['controller' => 'recipes', 'action' => 'view', 'id' => 6, 'comments' => false]
        );

    Will output:

    .. code-block:: html

        <a href="/recipes/view/id:6/comments:false">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    HTML special characters in ``$title`` will be converted to HTML
    entities. To disable this conversion, set the escape option to
    false in the ``$options`` array.::

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

    Setting ``escape`` to false will also disable escaping of attributes of the
    link. You can use the option ``escapeTitle`` to disable just
    escaping of title and not the attributes.::

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

    Also check :php:meth:`HtmlHelper::url` method
    for more examples of different types of URLs.

.. php:method:: media(string|array $path, array $options)

    :param string|array $path: Path to the video file, relative to the
        `webroot/{$options['pathPrefix']}` directory. Or an array where each
        item itself can be a path string or an associate array containing keys
        `src` and `type`.
    :param array $options: Array of HTML attributes, and special options.

    Options:

    - `type` Type of media element to generate, valid values are "audio"
      or "video". If type is not provided media type is guessed based on
      file's mime type.
    - `text` Text to include inside the video tag
    - `pathPrefix` Path prefix to use for relative URLs, defaults to
      'files/'
    - `fullBase` If provided the src attribute will get a full address
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

.. php:method:: tag(string $tag, string $text, array $htmlAttributes)

    :param string $tag: The tag name being generated.
    :param string $text: The contents for the tag.
    :param array $options: An array of :term:`html attributes`.

    Returns text wrapped in a specified tag. If no text is specified
    then only the opening <tag> is returned.:

    .. code-block:: php

        <?= $this->Html->tag('span', 'Hello World.', ['class' => 'welcome']) ?>

        // Output
        <span class="welcome">Hello World</span>

        // No text specified.
        <?= $this->Html->tag('span', null, ['class' => 'welcome']) ?>

        // Output
        <span class="welcome">

    .. note::

        Text is not escaped by default but you may use
        ``$htmlOptions['escape'] = true`` to escape your text. This
        replaces a fourth parameter ``boolean $escape = false`` that was
        available in previous versions.

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: The class name for the div.
    :param string $text: The content inside the div.
    :param array $options: An array of :term:`html attributes`.

    Used for creating div-wrapped sections of markup. The first
    parameter specifies a CSS class, and the second is used to supply
    the text to be wrapped by div tags. If the last parameter has been
    set to true, $text will be printed HTML-escaped.

    If no text is specified, only an opening div tag is returned.:

    .. code-block:: php

        <?= $this->Html->div('error', 'Please enter your credit card number.') ?>

        // Output
        <div class="error">Please enter your credit card number.</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: The class name for the paragraph.
    :param string $text: The content inside the paragraph.
    :param array $options: An array of :term:`html attributes`.

    Returns a text wrapped in a CSS-classed <p> tag. If no text is
    supplied, only a starting <p> tag is returned.:

    .. code-block:: php

        <?= $this->Html->para(null, 'Hello World.') ?>

        // Output
        <p>Hello World.</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: Either a string to a single JavaScript file, or an
       array of strings for multiple files.
    :param array $options: An array of :term:`html attributes`.

    Include a script file(s), contained either locally or as a remote URL.

    By default, script tags are added to the document inline. If you override
    this by setting ``$options['block']`` to true, the script tags will instead
    be added to the ``script`` block which you can print elsewhere in the document.
    If you wish to override which block name is used, you can do so by setting
    ``$options['block']``.

    ``$options['once']`` controls whether or
    not you want to include this script once per request or more than
    once. This defaults to true.

    You can use $options to set additional properties to the
    generated script tag. If an array of script tags is used, the
    attributes will be applied to all of the generated script tags.

    This method of JavaScript file inclusion assumes that the
    JavaScript file specified resides inside the ``/App/webroot/js``
    directory::

        echo $this->Html->script('scripts');

    Will output:

    .. code-block:: html

        <script src="/js/scripts.js"></script>

    You can link to files with absolute paths as well to link files
    that are not in ``app/webroot/js``::

        echo $this->Html->script('/otherdir/script_file');

    You can also link to a remote URL::

        echo $this->Html->script('http://code.jquery.com/jquery.min.js');

    Will output:

    .. code-block:: html

        <script src="http://code.jquery.com/jquery.min.js"></script>

    The first parameter can be an array to include multiple files.::

        echo $this->Html->script(array('jquery', 'wysiwyg', 'scripts'));

    Will output:

    .. code-block:: html

        <script src="/js/jquery.js"></script>
        <script src="/js/wysiwyg.js"></script>
        <script src="/js/scripts.js"></script>

    You can append the script tag to a specific block using the ``block``
    option::

        echo $this->Html->script('wysiwyg', array('block' => 'scriptBottom'));

    In your layout you can output all the script tags added to 'scriptBottom'::

        echo $this->fetch('scriptBottom');

    You can include script files from any loaded plugin using
    :term:`plugin syntax`. To include ``app/Plugin/DebugKit/webroot/js/toolbar.js``
    You could use the following::

        echo $this->Html->script('DebugKit.toolbar.js');

    If you want to include a script file which shares a name with a loaded
    plugin you can do the following. For example if you had a ``Blog`` plugin,
    and also wanted to include ``app/webroot/js/Blog.plugins.js``, you would::

        echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

.. php:method::  scriptBlock($code, $options = array())

    :param string $code: The code to go in the script tag.
    :param array $options: An array of :term:`html attributes`.

    Generate a code block containing ``$code`` set ``$options['block']`` to true
    to have the script block appear in the ``script`` view block. Other options
    defined will be added as attributes to script tags.
    ``$this->Html->scriptBlock('stuff', ['defer' => true]);`` will create
    a script tag with ``defer="defer"`` attribute.

.. php:method:: scriptStart($options = array())

    :param array $options: An array of :term:`html attributes` to be used when
        scriptEnd is called.

    Begin a buffering code block. This code block will capture all
    output between ``scriptStart()`` and ``scriptEnd()`` and create an
    script tag. Options are the same as ``scriptBlock()``

.. php:method:: scriptEnd()

    End a buffering script block, returns the generated script element
    or null if the script block was opened with block = true.

    An example of using ``scriptStart()`` and ``scriptEnd()`` would
    be::

        $this->Html->scriptStart(['block' => true]);

        echo $this->Js->alert('I am in the JavaScript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

    :param array $list: Set of elements to list.
    :param array $options: Additional HTML attributes of the list (ol/ul) tag
        or if ul/ol use that as tag.
    :param array $itemOptions: Additional HTML attributes of the list item (LI)
        tag.
    :param string $tag: Type of list tag to use (ol/ul).

    Build a nested list (UL/OL) out of an associative array::

        $list = [
            'Languages' => [
                'English' => [
                    'American',
                    'Canadian',
                    'British',
                [,
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

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

    :param array $names: An array of strings to create table headings.
    :param array $trOptions: An array of :term:`html attributes` for the <tr>
    :param array $thOptions: An array of :term:`html attributes` for the <th> elements

    Creates a row of table header cells to be placed inside of <table>
    tags.::

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

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

    :param array $data: A two dimensional array with data for the rows.
    :param array $oddTrOptions: An array of :term:`html attributes` for the odd <tr>'s.
    :param array $evenTrOptions: An array of :term:`html attributes` for the even <tr>'s.
    :param boolean $useCount: Adds class "column-$i".
    :param boolean $continueOddEven: If false, will use a non-static $count variable,
        so that the odd/even count is reset to zero just for that call.

    Creates table cells, in rows, assigning <tr> attributes differently
    for odd- and even-numbered rows. Wrap a single table cell within an
    array() for specific <td>-attributes. ::

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

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: A :term:`routing array`.
    :param mixed $full: Either a boolean to indicate whether or not the base path should
        be included on an array of options for :php:meth:`Router::url()`

    Returns a URL pointing to a combination of controller and action.
    If $url is empty, it returns the REQUEST\_URI, otherwise it
    generates the URL for the controller and action combo. If full is
    true, the full base URL will be prepended to the result::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "view",
            "bar"
        ]);

        // Output
        /posts/view/bar

    Here are a few more usage examples:

    URL with named parameters::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ]);

        // Output
        /posts/view/foo:bar

    URL with extension::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ]);

        // Output
        /posts/list.rss

    URL (starting with '/') with the full base URL prepended::

        echo $this->Html->url('/posts', true);

        // Output
        http://somedomain.com/posts

    URL with GET params and named anchor::

        echo $this->Html->url([
            "controller" => "posts",
            "action" => "search",
            "?" => ["foo" => "bar"],
            "#" => "first"
        ]);

        // Output
        /posts/search?foo=bar#first

    For further information check
    `Router::url <http://api.cakephp.org/2.4/class-Router.html#_url>`_
    in the API.

.. php:method:: useTag(string $tag)

    Returns a formatted existent block of ``$tag``::

        $this->Html->useTag(
            'form',
            'http://example.com',
            ['method' => 'post', 'class' => 'myform']
        );

    Output:

    .. code-block:: html

        <form action="http://example.com" method="post" class="myform">

Changing the Tags Output by HtmlHelper
======================================

.. php:method:: templates($templates)

    The ``$templates`` parameter can be either a string file path to the PHP
    file containing the tags you want to load, or an array of templates to
    add/replace::

        // Load templates from App/Config/my_html.php
        $this->Html->templates('my_html.php');

        // Load specific templates.
        $this->Html->templates([
            'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
        ]);

    When loading files of templates, your file should look like::

        <?php
        $config = [
            'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
        ];

Creating Breadcrumb Trails with HtmlHelper
==========================================

.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)

    CakePHP has the built-in ability to automatically create a
    breadcrumb trail in your app. To set this up, first add something
    similar to the following in your layout template::

        echo $this->Html->getCrumbs(' > ', 'Home');

    The ``$startText`` option can also accept an array. This gives more control
    over the generated first link::

        echo $this->Html->getCrumbs(' > ', [
            'text' => $this->Html->image('home.png'),
            'url' => ['controller' => 'pages', 'action' => 'display', 'home'],
            'escape' => false
        ]);

    Any keys that are not ``text`` or ``url`` will be passed to
    :php:meth:`~HtmlHelper::link()` as the ``$options`` parameter.

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    Now, in your view you'll want to add the following to start the
    breadcrumb trails on each of the pages::

        $this->Html->addCrumb('Users', '/users');
        $this->Html->addCrumb('Add User', '/users/add');

    This will add the output of "**Home > Users > Add User**" in your
    layout where getCrumbs was added.

.. php:method:: getCrumbList(array $options = array(), mixed $startText)

    :param array $options: An array of :term:`html attributes` for the
        containing ``<ul>`` element. Can also contain the 'separator',
        'firstClass', 'lastClass' and 'escape' options.
    :param string|array $startText: The text or element that precedes the ul.

    Returns breadcrumbs as a (x)html list.

    This method uses :php:meth:`HtmlHelper::tag()` to generate list and its
    elements. Works similar to :php:meth:`~HtmlHelper::getCrumbs()`, so it uses
    options which every crumb was added with. You can use the ``$startText``
    parameter to provide the first breadcrumb link/text. This is useful when
    you always want to include a root link. This option works the same as the
    ``$startText`` option for :php:meth:`~HtmlHelper::getCrumbs()`.


.. meta::
    :title lang=en: HtmlHelper
    :description lang=en: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=en: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
