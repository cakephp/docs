HTML
####

.. php:class:: HtmlHelper(View $view, array $settings = array())

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Many HtmlHelper methods include a ``$htmlAttributes`` parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the $htmlAttributes parameter::

    Desired attributes: <tag class="someClass" />      
    Array parameter: array('class' => 'someClass')
     
    Desired attributes: <tag name="foo" value="bar" />  
    Array parameter:  array('name' => 'foo', 'value' => 'bar')


.. note::

    The HtmlHelper is available in all views by default. If you're
    getting an error informing you that it isn't there, it's usually
    due to its name being missing from a manually configured $helpers
    controller variable.

Inserting Well-Formatted elements
=================================

The most important task the HtmlHelper accomplishes is creating
well formed markup. Don't be afraid to use it often - you can cache
views in CakePHP in order to save some CPU cycles when views are
being rendered and delivered. This section will cover some of the
methods of the HtmlHelper and how to use them.

.. php:method:: charset($charset=null)

    :param string $charset: Desired character set.  If null, the value of 
       ``App.encoding`` will be used.

    Used to create a meta tag specifying the document's character.
    Defaults to UTF-8

    Example use::
 
        <?php echo $this->Html->charset(); ?> 

    Will output::

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    Alternatively, ::

        <?php echo $this->Html->charset('ISO-8859-1'); ?>

    Will output::

        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

.. php:method:: css(mixed $path, string $rel = null, array $options = array())

    :param mixed $path: Either a string of the css file to link, or an array with multiple files
    :param string $rel: The value of the generated tag's rel attribute.  If null, 'stylesheet'
       will be used.
    :param array $options: An array of :term:`html attributes`.

    Creates a link(s) to a CSS style-sheet. If key 'inline' is set to
    false in ``$options`` parameter, the link tags are added to the
    ``css`` block which you can print inside the head
    tag of the document.

    You can use the ``block`` option to control which block the link element
    will be appended to.  By default it will append to the ``css`` block.

    This method of CSS inclusion assumes that the CSS file specified
    resides inside the /app/webroot/css directory.::

        <?php echo $this->Html->css('forms'); ?> 

    Will output::

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />

    The first parameter can be an array to include multiple files.::

        <?php echo $this->Html->css(array('forms', 'tables', 'menu')); ?>

    Will output::

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />
        <link rel="stylesheet" type="text/css" href="/css/tables.css" />
        <link rel="stylesheet" type="text/css" href="/css/menu.css" />

    .. versionchanged:: 2.1
        The ``block`` option was added.

.. php:method:: meta(string $type, string $url = null, array $options = array())

    :param string $type: The type meta tag you want.
    :param mixed $url: The url for the meta tag, either a string or a :term:`routing array`.
    :param array $options: An array of :term:`html attributes`.

    This method is handy for linking to external resources like RSS/Atom feeds
    and favicons. Like css(), you can specify whether or not you'd like this tag
    to appear inline or appended to the ``meta`` block by setting the 'inline'
    key in the $attributes parameter to false, ie - ``array('inline' => false)``.

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

    ::

        <?php
        echo $this->Html->meta(
            'favicon.ico',
            '/favicon.ico',
            array('type' => 'icon')
        );
        // Output (line breaks added)
        <link
            href="http://example.com/favicon.ico"
            title="favicon.ico" type="image/x-icon"
            rel="alternate"
        />
         
        echo $this->Html->meta(
            'Comments',
            '/comments/index.rss',
            array('type' => 'rss')
        );
        // Output (line breaks added)
        <link
            href="http://example.com/comments/index.rss"
            title="Comments"
            type="application/rss+xml"
            rel="alternate"
        />

    This method can also be used to add the meta keywords and
    descriptions. Example::

        <?php
        echo $this->Html->meta(
            'keywords',
            'enter any meta keyword here'
        );
        // Output
        <meta name="keywords" content="enter any meta keyword here" />

        echo $this->Html->meta(
            'description',
            'enter any meta description here'
        );
        // Output
        <meta name="description" content="enter any meta description here" />

    If you want to add a custom meta tag then the first parameter
    should be set to an array. To output a robots noindex tag use the
    following code::

        <?php
        echo $this->Html->meta(array('name' => 'robots', 'content' => 'noindex')); 

    .. versionchanged:: 2.1
        The ``block`` option was added.

.. php:method:: docType(string $type = 'html5')

    :param string $type: The type of doctype being made.

    Returns a (X)HTML doctype tag. Supply the doctype according to the
    following table:

    type
        translated value
    html
        text/html
    html4-strict
        HTML4 Strict
    html4-trans
        HTML4 Transitional
    html4-frame
        HTML4 Frameset
    html5
        HTML5
    xhtml-strict
        XHTML1 Strict
    xhtml-trans
        XHTML1 Transitional
    xhtml-frame
        XHTML1 Frameset
    xhtml11
        XHTML 1.1

    ::

        <?php echo $this->Html->docType(); ?> 
        <!DOCTYPE html>

        <?php echo $this->Html->docType('html4-trans'); ?> 
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">


.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: A set of key => values with CSS properties.
    :param boolean $oneline: Should the contents be on one line.

    Builds CSS style definitions based on the keys and values of the
    array passed to the method. Especially handy if your CSS file is
    dynamic.::

        <?php
        echo $this->Html->style(array(
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        )); 

    Will output::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = array())

    :param string $path: Path to the image.
    :param array $options: An array of :term:`html attributes`.

    Creates a formatted image tag. The path supplied should be relative
    to /app/webroot/img/.::

        <?php
        echo $this->Html->image('cake_logo.png', array('alt' => 'CakePHP'));

    Will output::

        <img src="/img/cake_logo.png" alt="CakePHP" /> 

    To create an image link specify the link destination using the
    ``url`` option in ``$htmlAttributes``.::

        <?php
        echo $this->Html->image("recipes/6.jpg", array(
            "alt" => "Brownies",
            'url' => array('controller' => 'recipes', 'action' => 'view', 6)
        ));

    Will output::

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

.. php:method:: link(string $title, mixed $url = null, array $options = array(), string $confirmMessage = false)

    :param string $title: The text to display as the body of the link.
    :param mixed $url: Either the string location, or a :term:`routing array`.
    :param array $options: An array of :term:`html attributes`.

    General purpose method for creating HTML links. Use ``$options`` to
    specify attributes for the element and whether or not the
    ``$title`` should be escaped.::

        <?php
        echo $this->Html->link('Enter', '/pages/home', array('class' => 'button', 'target' => '_blank'));

    Will output::

        <a href="/pages/home" class="button" target="_blank">Enter</a>

    Specify ``$confirmMessage`` to display a javascript ``confirm()``
    dialog::

        <?php
        echo $this->Html->link(
            'Delete',
            array('controller' => 'recipes', 'action' => 'delete', 6),
            array(),
            "Are you sure you wish to delete this recipe?"
        );

    Will output::

        <a href="/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

    Query strings can also be created with ``link()``.::

        <?php
        echo $this->Html->link('View image', array(
            'controller' => 'images',
            'action' => 'view',
            1,
            '?' => array('height' => 400, 'width' => 500))
        );

    Will output::
  
        <a href="/images/view/1?height=400&width=500">View image</a>

    HTML special characters in ``$title`` will be converted to HTML
    entities. To disable this conversion, set the escape option to
    false in the ``$options`` array.::

        <?php 
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
            "recipes/view/6",
            array('escape' => false)
        );

    Will output::

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    Also check :php:meth:`HtmlHelper::url` method
    for more examples of different types of urls.

.. php:method:: tag(string $tag, string $text, array $htmlAttributes)

    :param string $tag: The tag name being generated.
    :param string $text: The contents for the tag.
    :param array $options: An array of :term:`html attributes`.

    Returns text wrapped in a specified tag. If no text is specified
    then only the opening <tag> is returned.::

        <?php
        echo $this->Html->tag('span', 'Hello World.', array('class' => 'welcome'));
         
        // Output
        <span class="welcome">Hello World</span>
         
        // No text specified.
        <?php 
        echo $this->Html->tag('span', null, array('class' => 'welcome'));
         
        // Output
        <span class="welcome">

    .. note::

        Text is not escaped by default but you may use
        ``$htmlOptions['escape'] = true`` to escape your text. This
        replaces a fourth parameter ``boolean $escape = false`` that was
        available in previous versions.

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: The classname for the div.
    :param string $text: The content inside the div.
    :param array $options: An array of :term:`html attributes`.

    Used for creating div-wrapped sections of markup. The first
    parameter specifies a CSS class, and the second is used to supply
    the text to be wrapped by div tags. If the last parameter has been
    set to true, $text will be printed HTML-escaped.

    If no text is specified, only an opening div tag is returned.::
 
        <?php
        echo $this->Html->div('error', 'Please enter your credit card number.');
        
        // Output
        <div class="error">Please enter your credit card number.</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: The classname for the paragraph.
    :param string $text: The content inside the paragraph.
    :param array $options: An array of :term:`html attributes`.

    Returns a text wrapped in a CSS-classed <p> tag. If no text is
    supplied, only a starting <p> tag is returned.::

        <?php
        echo $this->Html->para(null, 'Hello World.');
        
        // Output
        <p>Hello World.</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: Either a string to a single Javascript file, or an
       array of strings for multiple files.
    :param array $options: An array of :term:`html attributes`.

    Include a script file(s). If key ``inline`` is set to false in $options, the
    script tags are added to the ``script`` block which you can print inside the
    head tag of the document. ``$options['once']`` controls, whether or
    not you want to include this script once per request or more than
    once. ``$options['block']`` allows you to control which block the script tag
    is appended to.  This is useful when you want to place some scripts at the
    bottom of the layout.

    You can use $options to set additional properties to the
    generated script tag. If an array of script tags is used, the
    attributes will be applied to all of the generated script tags.

    This method of javascript file inclusion assumes that the
    javascript file specified resides inside the ``/app/webroot/js``
    directory.::

        <?php
        echo $this->Html->script('scripts');

    Will output::

        <script type="text/javascript" href="/js/scripts.js"></script>

    You can link to files with absolute paths as well to link files
    that are not in ``app/webroot/js``::

        <?php
        echo $this->Html->script('/otherdir/script_file');

    The first parameter can be an array to include multiple files.::

        <?php
        echo $this->Html->script(array('jquery', 'wysiwyg', 'scripts'));

    Will output::

        <script type="text/javascript" href="/js/jquery.js"></script>
        <script type="text/javascript" href="/js/wysiwyg.js"></script>
        <script type="text/javascript" href="/js/scripts.js"></script>

    You can append the script tag to a specific block using the ``block``
    option::

        <?php
        echo $this->Html->script('wysiwyg', array('block' => 'scriptBottom'));
        
    In your layout you can output all the script tags added to 'scriptBottom'::

        <?php
        echo $this->fetch('scriptBottom');

    .. versionchanged:: 2.1
        The ``block`` option was added.

.. php:method::  scriptBlock($code, $options = array())

    :param string $code: The code to go in the script tag.
    :param array $options: An array of :term:`html attributes`.

    Generate a code block containing ``$code`` set
    ``$options['inline']`` to false to have the script block appear in
    the ``script`` view block. Other options defined will be added as attributes
    to script tags.
    ``$this->html->scriptBlock('stuff', array('defer' => true));`` will
    create a script tag with ``defer="defer"`` attribute.

.. php:method:: scriptStart($options = array())

    :param array $options: An array of :term:`html attributes` to be used when 
        scriptEnd is called.

    Begin a buffering code block. This code block will capture all
    output between ``scriptStart()`` and ``scriptEnd()`` and create an
    script tag. Options are the same as ``scriptBlock()``

.. php:method:: scriptEnd()

    End a buffering script block, returns the generated script element
    or null if the script block was opened with inline = false.

    An example of using ``scriptStart()`` and ``scriptEnd()`` would
    be::

        <?php
        $this->Html->scriptStart(array('inline' => false));

        echo $this->Js->alert('I am in the javascript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

    :param array $list: Set of elements to list.
    :param array $options: Additional HTML attributes of the list (ol/ul) tag 
        or if ul/ol use that as tag.
    :param array $itemOptions: Additional HTML attributes of the list item (LI) 
        tag.
    :param string $tag: Type of list tag to use (ol/ul).

    Build a nested list (UL/OL) out of an associative array::

        <?php
        $list = array(
            'Languages' => array(
                'English' => array(
                    'American',
                    'Canadian',
                    'British',
                ),
                'Spanish',
                'German',
            )
        );
        echo $this->Html->nestedList($list);

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

        <?php
        echo $this->Html->tableHeaders(array('Date', 'Title', 'Active'));

        // Output 
        <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Active</th>
        </tr>
        
        echo $this->Html->tableHeaders(
            array('Date','Title','Active'),
            array('class' => 'status'),
            array('class' => 'product_table')
        );
         
        // Output
        <tr class="status">
             <th class="product_table">Date</th>
             <th class="product_table">Title</th>
             <th class="product_table">Active</th>
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

        <?php
        echo $this->Html->tableCells(array(
            array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
        ));
         
        // Output
        <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
        <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
        <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
        
        echo $this->Html->tableCells(array(
            array('Jul 7th, 2007', array('Best Brownies', array('class' => 'highlight')) , 'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array('Aug 1st, 2006', 'Anti-Java Cake', array('No', array('id' => 'special'))),
        ));
         
        // Output
        <tr><td>Jul 7th, 2007</td><td class="highlight">Best Brownies</td><td>Yes</td></tr>
        <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
        <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td id="special">No</td></tr>
        
        echo $this->Html->tableCells(
            array(
                array('Red', 'Apple'),
                array('Orange', 'Orange'),
                array('Yellow', 'Banana'),
            ),
            array('class' => 'darker')
        );
        
        // Output
        <tr class="darker"><td>Red</td><td>Apple</td></tr>
        <tr><td>Orange</td><td>Orange</td></tr>
        <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: A :term:`routing array`.
    :param mixed $full: Either a boolean to indicate whether or not the base path should 
        be included on an array of options for :php:meth:`Router::url()`

    Returns an URL pointing to a combination of controller and action.
    If $url is empty, it returns the REQUEST\_URI, otherwise it
    generates the url for the controller and action combo. If full is
    true, the full base URL will be prepended to the result::

        <?php
        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "bar"
        ));
         
        // Output
        /posts/view/bar

    Here are a few more usage examples:

    URL with named parameters::

        <?php
        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ));
         
        // Output
        /posts/view/foo:bar

    URL with extension::

        <?php
        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ));
         
        // Output
        /posts/list.rss

    URL (starting with '/') with the full base URL prepended::

        <?php
        echo $this->Html->url('/posts', true);

        // Output
        http://somedomain.com/posts

    URL with GET params and named anchor::

        <?php echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "search",
            "?" => array("foo" => "bar"),
            "#" => "first"));
        
        // Output
        /posts/search?foo=bar#first

    For further information check
    `Router::url <http://api20.cakephp.org/class/router#method-Routerurl>`_
    in the API.

.. php:method:: useTag(string $tag)

    Returns a formatted existent block of ``$tag``::

        <?php
        $this->Html->useTag(
            'form',
            'http://example.com',
            array('method' => 'post', 'class' => 'myform')
        );

        // Output
        <form action="http://example.com" method="post" class="myform">

Changing the tags output by HtmlHelper
======================================

.. php:method:: loadConfig(mixed $configFile, string $path = null)

    The built in tag sets for :php:class:`HtmlHelper` are XHTML compliant,
    however if you need to generate HTML for HTML4 you will need to
    create and load a new tags config file containing the tags you'd
    like to use. To change the tags used create ``app/Config/tags.php``
    containing::

        <?php
        $tags = array(
            'metalink' => '<link href="%s"%s >',
            'input' => '<input name="%s" %s >',
            // ...
        );

    You can then load this tag set by calling
    ``$html->loadConfig('tags');``

Creating breadcrumb trails with HtmlHelper
==========================================

.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)

    CakePHP has the built in ability to automatically create a
    breadcrumb trail in your app. To set this up, first add something
    similar to the following in your layout template::

        <?php
        echo $this->Html->getCrumbs(' > ', 'Home');

    The ``$startText`` option can also accept an array.  This gives more control
    over the generated first link::

        <?php
        echo $this->Html->getCrumbs(' > ', array(
            'text' => $this->Html->image('home.png'),
            'url' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'escape' => false
        ));

    Any keys that are not ``text`` or ``url`` will be passed to
    :php:meth:`~HtmlHelper::link()` as the ``$options`` parameter.

    .. versionchanged:: 2.1
        The ``$startText`` parameter now accepts an array.

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    Now, in your view you'll want to add the following to start the
    breadcrumb trails on each of the pages::

        <?php
        $this->Html->addCrumb('Users', '/users');
        $this->Html->addCrumb('Add User', '/users/add');

    This will add the output of "**Home > Users > Add User**" in your
    layout where getCrumbs was added.

.. php:method:: getCrumbList(array $options = array())

    Returns breadcrumbs as a (x)html list.

    This method uses :php:meth:`HtmlHelper::tag()` to generate list and its 
    elements. Works similar to :php:meth:`HtmlHelper::getCrumbs()`, so it uses 
    options which every crumb was added with.


.. meta::
    :title lang=en: HtmlHelper
    :description lang=en: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=en: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
