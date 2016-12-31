HTML
####

The role of the HtmlHelper in CakePHP is to make HTML-related options
easier, faster, and more resilient to change. Using this helper will
enable your application to be more light on its feet, and more flexible
on where it is placed in relation to the root of a domain.

The HtmlHelper's role has changed significantly since CakePHP 1.1. Form
related methods have been deprecated and moved to the new FormHelper. If
you're looking for help with HTML forms, check out the new FormHelper.

Before we look at HtmlHelper's methods, you'll need to know about a few
configuration and usage situations that will help you use this class.
First in an effort to assuage those who dislike short tags (<?= ?>) or
many echo() calls in their view code all methods of HtmlHelper are
passed to the output() method. If you wish to enable automatic output of
the generated helper HTML you can simply implement output() in your
AppHelper.

::

    function output($str) {
        echo $str;
    }

Doing this will remove the need to add echo statements to your view
code.

Many HtmlHelper methods also include a $htmlAttributes parameter, that
allow you to tack on any extra attributes on your tags. Here are a few
examples of how to use the $htmlAttributes parameter:

::

    Desired attributes: <tag class="someClass" />      
    Array parameter: array('class'=>'someClass')
     
    Desired attributes: <tag name="foo" value="bar" />  
    Array parameter:  array('name' => 'foo', 'value' => 'bar')

The HtmlHelper is available in all views by default. If you're getting
an error informing you that it isn't there, it's usually due to its name
being missing from a manually configured $helpers controller variable.

Inserting Well-Formatted elements
=================================

The most important task the HtmlHelper accomplishes is creating well
formed markup. Don't be afraid to use it often - you can cache views in
CakePHP in order to save some CPU cycles when views are being rendered
and delivered. This section will cover some of the methods of the
HtmlHelper and how to use them.

charset
-------

``charset(string $charset=null)``

Used to create a meta tag specifying the document's character. Defaults
to UTF-8.

::

     
    <?php echo $html->charset(); ?> 

Will output:

::

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Alternatively,

::

    <?php echo $html->charset('ISO-8859-1'); ?>

Will output:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $htmlAttributes = array(), boolean $inline = true)``

Creates a link(s) to a CSS style-sheet. If $inline is set to false, the
link tags are added to the $scripts\_for\_layout variable which you can
print inside the head tag of the document.

This method of CSS inclusion assumes that the CSS file specified resides
inside the /app/webroot/css directory.

::

    <?php echo $html->css('forms'); ?> 

Will output:

::

    <link rel="stylesheet" type="text/css" href="/css/forms.css" />

The first parameter can be an array to include multiple files.

::

    <?php echo $html->css(array('forms','tables','menu')); ?>

Will output:

::

    <link rel="stylesheet" type="text/css" href="/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/css/menu.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

This method is handy for linking to external resources like RSS/Atom
feeds and favicons. Like css(), you can specify whether or not you'd
like this tag to appear inline or in the head tag using the fourth
parameter.

If you set the "type" attribute using the $htmlAttributes parameter,
CakePHP contains a few shortcuts:

+--------+------------------------+
| type   | translated value       |
+========+========================+
| html   | text/html              |
+--------+------------------------+
| rss    | application/rss+xml    |
+--------+------------------------+
| atom   | application/atom+xml   |
+--------+------------------------+
| icon   | image/x-icon           |
+--------+------------------------+

::

      <?php echo $html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?> //Output (line breaks added) </p>
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $html->meta(
        'Comments',
        '/comments/index.rss',
        array('type' => 'rss'));
    ?>
     
    //Output (line breaks added)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

This method can also be used to add the meta keywords and descriptions.
Example:

::

    <?php echo $html->meta(
        'keywords',
        'enter any meta keyword here'
    );?>
    //Output <meta name="keywords" content="enter any meta keyword here"/>
    //

    <?php echo $html->meta(
        'description',
        'enter any meta description here'
       );?> 

    //Output <meta name="description" content="enter any meta description here"/>

If you want to add a custom meta tag then the first parameter should be
set to an array. To output a robots noindex tag use the following code:

::

     echo $html->meta(array('name' => 'robots', 'content' => 'noindex')); 

docType
-------

``docType(string $type = 'xhtml-strict')``

Returns a (X)HTML doctype tag. Supply the doctype according to the
following table:

+----------------+-----------------------+
| type           | translated value      |
+================+=======================+
| html           | text/html             |
+----------------+-----------------------+
| html4-strict   | HTML4 Strict          |
+----------------+-----------------------+
| html4-trans    | HTML4 Transitional    |
+----------------+-----------------------+
| html4-frame    | HTML4 Frameset        |
+----------------+-----------------------+
| xhtml-strict   | XHTML1 Strict         |
+----------------+-----------------------+
| xhtml-trans    | XHTML1 Transitional   |
+----------------+-----------------------+
| xhtml-frame    | XHTML1 Frameset       |
+----------------+-----------------------+
| xhtml11        | XHTML 1.1             |
+----------------+-----------------------+

::

    <?php echo $html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <?php echo $html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $inline = true)``

Builds CSS style definitions based on the keys and values of the array
passed to the method. Especially handy if your CSS file is dynamic.

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Will output:

::

      background:#633;
      border-bottom:1px solid #000;
      padding:10px; 

image
-----

``image(string $path, array $htmlAttributes = array())``

Creates a formatted image tag. The path supplied should be relative to
/app/webroot/img/.

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Will output:

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

To create an image link specify the link destination using the ``url``
option in ``$htmlAttributes``.

::

    <?php echo $html->image("recipes/6.jpg", array(
        "alt" => "Brownies",
        'url' => array('controller' => 'recipes', 'action' => 'view', 6)
    )); ?>

Will output:

::

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

You can also use this alternate method to create an image link, by
assigning the image to a variable (e.g. $image), and passing it to
``$html->link()`` as the first argument:

::

        <?php
        $image = $html->image('recipes/6.jpg', array(
                    'alt' => 'Brownies',
                ));

        //$image is passed as the first argument instead of link text
        echo $html->link($image, array(
                'controller' => 'recipies',
                'action' => 'view',
                6
                ),
                array(
                    'escape' => false //important so htmlHelper doesn't escape you image link
                )
        );
        ?>

This is useful if you want to keep your link and image a bit more
separate, or if you want to sneak some markup into your link. Be sure to
pass ``'escape' => false`` in the options array for
`` $html->link($string, $url, $options)`` to prevent htmlHelper from
escaping the code.

link
----

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

General purpose method for creating HTML links. Use ``$htmlAttributes``
to specify attributes for the element.

::

    <?php echo $html->link('Enter', '/pages/home', array('class'=>'button','target'=>'_blank')); ?>

Will output:

::

      
    <a href="/pages/home" class="button" target="_blank">Enter</a>

Specify ``$confirmMessage`` to display a javascript ``confirm()``
dialog.

::

    <?php echo $html->link(
        'Delete',
        array('controller'=>'recipes', 'action'=>'delete', 6),
        array(),
        "Are you sure you wish to delete this recipe?"
    );?>

Will output:

::

      
    <a href="/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

Query strings can also be created with ``link()``.

::

    <?php echo $html->link('View image', array(
        'controller' => 'images',
        'action' => 'view',
        1,
        '?' => array( 'height' => 400, 'width' => 500))
    );

Will output:

::

      
    <a href="/images/view/1?height=400&width=500">View image</a>

HTML special characters in ``$title`` will be converted to HTML
entities. To disable this conversion, set the escape option to false in
the ``$htmlAttributes``, or set ``$escapeTitle`` to false.

::

    <?php 
    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "recipes/view/6",
        array('escape'=>false)
    );

    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "recipes/view/6",
        null, null, false
    );
    ?>

Both will output:

::

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Also check `HtmlHelper::url <https://book.cakephp.org/view/842/url>`_
method for more examples of different types of urls.

tag
---

``tag(string $tag, string $text, array $htmlAttributes, boolean $escape = false)``

Returns text wrapped in a specified tag. If no text is specified then
only the opening <tag> is returned.

::

    <?php echo $html->tag('span', 'Hello World.', array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">Hello World</span>
     
    //No text specified.
    <?php echo $html->tag('span', null, array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">

div
---

``div(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Used for creating div-wrapped sections of markup. The first parameter
specifies a CSS class, and the second is used to supply the text to be
wrapped by div tags. If the last parameter has been set to true, $text
will be printed HTML-escaped.

If no text is specified, only an opening div tag is returned.

::

     
    <?php echo $html->div('error', 'Please enter your credit card number.');?>

    //Output
    <div class="error">Please enter your credit card number.</div>

para
----

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Returns a text wrapped in a CSS-classed <p> tag. If no text is supplied,
only a starting <p> tag is returned.

::

    <?php echo $html->para(null, 'Hello World.');?>
     
    //Output
    <p>Hello World.</p>

tableHeaders
------------

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

Creates a row of table header cells to be placed inside of <table> tags.

::

    <?php echo $html->tableHeaders(array('Date','Title','Active'));?> //Output 
    <tr><th>Date</th><th>Title</th><th>Active</th></tr>
     
    <?php echo $html->tableHeaders(
        array('Date','Title','Active'),
        array('class' => 'status'),
        array('class' => 'product_table')
    );?>
     
    //Output
    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

tableCells
----------

``tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)``

Creates table cells, in rows, assigning <tr> attributes differently for
odd- and even-numbered rows. Wrap a single table cell within an array()
for specific <td>-attributes.

::

    <?php echo $html->tableCells(array(
        array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
     
    <?php echo $html->tableCells(array(
        array('Jul 7th, 2007', array('Best Brownies', array('class'=>'highlight')) , 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', array('No', array('id'=>'special'))),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td class="highlight">Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td id="special">No</td></tr>
     
    <?php echo $html->tableCells(
        array(
            array('Red', 'Apple'),
            array('Orange', 'Orange'),
            array('Yellow', 'Banana'),
        ),
        array('class' => 'darker')
    );
    ?>
     
    //Output
    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

url
---

``url(mixed $url = NULL, boolean $full = false)``

Returns an URL pointing to a combination of controller and action. If
$url is empty, it returns the REQUEST\_URI, otherwise it generates the
url for the controller and action combo. If full is true, the full base
URL will be prepended to the result.

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "bar"));?>
     
    // Output
    /posts/view/bar

Here are a few more usage examples:

URL with named parameters

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "foo" => "bar"));
    ?>
     
    // Output
    /posts/view/foo:bar

URL with extension

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "list",
        "ext" => "rss"));
    ?>
     
    // Output
    /posts/list.rss

URL (starting with '/') with the full base URL prepended.

::

    <?php echo $html->url('/posts', true); ?>

    //Output
    http://somedomain.com/posts

URL with GET params and named anchor

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "search",
        "?" => array("foo" => "bar"),
        "#" => "first"));
    ?>

    //Output
    /posts/search?foo=bar#first

For further information check
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_ in
the API.

Changing the tags output by HtmlHelper
======================================

The built in tag sets for ``HtmlHelper`` are XHTML compliant, however if
you need to generate HTML for HTML4 you will need to create and load a
new tags config file containing the tags you'd like to use. To change
the tags used create ``app/config/tags.php`` containing:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );

You can then load this tag set by calling ``$html->loadConfig('tags');``
