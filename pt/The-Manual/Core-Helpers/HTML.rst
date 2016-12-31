HTML
####

O papel do HtmlHelper no CakePHP é fazer as ações relacionadas a HTML
mais fáceis, rápidas e mais resistente a mudanças. O uso deste helper
permitirá que suas aplicações sejam mais leves e mais flexíveis.

O objetivo do HtmlHelper foi significativamente modificado desde o
CakePHP 1.1. Seus métodos relacionados a formulários tornaram-se
obsoletos em favor do novo FormHelper. Se você estiver querendo auxílio
para criação de elementos de formulários HTML, você deve conferir o
FormHelper.

Antes de vermos os métodos do HtmlHelper, você precisará conhecer sobre
as poucas configurações e situações que vão lhe ajudar a utilizar melhor
esta classe. Primeiro de tudo, num esforço para acalmar aqueles que não
gostam de tags curtas (<?= ?>) nem de muitas chamadas echo() no código
de suas views, todos os métodos do HtmlHelper são passados para o método
output(). Se você quiser permitir a exibição automática do conteúdo HTML
gerado, você pode simplesmente implementar o método output() em seu
AppHelper.

::

    function output($str) {
        echo $str;
    }

Fazendo isto você pode eliminar a necessidade de adicionar declarações
echo no código de suas views.

Muitos métodos do HtmlHelper também incluem um parâmetro
$htmlAttributes, que permite que você inclua atributos extras em suas
tags. Aqui estão alguns poucos exemplo de como usar o parâmetro
$htmlAttributes:

::

    Atributos desejados: <tag class="someClass" />      
    Array de parâmetros: array('class'=>'someClass')
     
    Atributos desejados: <tag name="foo" value="bar" />  
    Array de parâmetros:  array('name' => 'foo', 'value' => 'bar')

O HtmlHelper está disponível em todas as views por padrão. Se você
estiver recebendo um erro dizendo que ele não pôde ser encontrado, é
provável que ele esteja faltando numa definição manual que você tenha
feito da variável $helpers em um controller.

Inserindo Elementos Bem-Formatados
==================================

A tarefa mais importante que o HtmlHelper realiza é a criação de
marcações bem formadas. Não tenha medo de usá-lo muitas vezes - você
pode armazenar em cache views em CakePHP, a fim de salvar alguns ciclos
do processamento quando as views estão sendo renderizadas e liberadas.
Esta seção irá cobrir alguns dos métodos da HtmlHelper e como usá-los.

charset
-------

``charset(string $charset=null)``

Used to create a meta tag specifying the document's character. Defaults
to UTF-8.

::

     
    <?php echo $this->Html->charset(); ?> 

Will output:

::

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Alternatively,

::

    <?php echo $this->Html->charset('ISO-8859-1'); ?>

Will output:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $options = array())``

Creates a link(s) to a CSS style-sheet. If key 'inline' is set to false
in $options parameter, the link tags are added to the
$scripts\_for\_layout variable which you can print inside the head tag
of the document.

This method of CSS inclusion assumes that the CSS file specified resides
inside the /app/webroot/css directory.

::

    <?php echo $this->Html->css('forms'); ?> 

Will output:

::

    <link rel="stylesheet" type="text/css" href="/pt/css/forms.css" />

The first parameter can be an array to include multiple files.

::

    <?php echo $this->Html->css(array('forms','tables','menu')); ?>

Will output:

::

    <link rel="stylesheet" type="text/css" href="/pt/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/pt/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/pt/css/menu.css" />

This method included the CSS in the header.

::

    <?php    $this->Html->css(array('forms','myplugin/css/forms'),'stylesheet', array('inline' => false ) ); ?> 

Will output in header:

::

    <link rel="stylesheet" type="text/css" href="/pt/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/pt/myplugin/css/forms.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array())``

This method is handy for linking to external resources like RSS/Atom
feeds and favicons. Like css(), you can specify whether or not you'd
like this tag to appear inline or in the head tag by setting the
'inline' key in the $attributes parameter to false, ie -
``array('inline' => false)``.

If you set the "type" attribute using the $attributes parameter, CakePHP
contains a few shortcuts:

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

      <?php echo $this->Html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?> //Output (line breaks added) </p>
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $this->Html->meta(
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

    <?php echo $this->Html->meta(
        'keywords',
        'enter any meta keyword here'
    );?>
    //Output <meta name="keywords" content="enter any meta keyword here"/>
    //

    <?php echo $this->Html->meta(
        'description',
        'enter any meta description here'
       );?> 

    //Output <meta name="description" content="enter any meta description here"/>

If you want to add a custom meta tag then the first parameter should be
set to an array. To output a robots noindex tag use the following code:

::

     echo $this->Html->meta(array('name' => 'robots', 'content' => 'noindex')); 

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

    <?php echo $this->Html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <?php echo $this->Html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $oneline = true)``

Builds CSS style definitions based on the keys and values of the array
passed to the method. Especially handy if your CSS file is dynamic.

::

    <?php echo $this->Html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Will output:

::

      background:#633; border-bottom:1px solid #000; padding:10px;

image
-----

``image(string $path, array $htmlAttributes = array())``

Cria uma tag formatada de imagem. O caminho fornecido deve ser relativo
a /app/webroot/img/ .

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Saída será:

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

Para criar um link de imagem especificando o link de destino usando a
opção de ``url`` em ``$htmlAttributes.``

::

    <?php echo $html->image("recipes/6.jpg", array(
        "alt" => "Brownies",
        'url' => array('controller' => 'recipes', 'action' => 'view', 6)
    )); ?>

Saída será:

::

    <a href="/pt/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

link
----

``link(string $title, mixed $url = null, array $options = array(), string $confirmMessage = false)``

General purpose method for creating HTML links. Use ``$options`` to
specify attributes for the element and whether or not the ``$title``
should be escaped.

::

    <?php echo $this->Html->link('Enter', '/pages/home', array('class' => 'button', 'target' => '_blank')); ?>

Will output:

::

      
    <a href="/pt/pages/home" class="button" target="_blank">Enter</a>

Specify ``$confirmMessage`` to display a javascript ``confirm()``
dialog.

::

    <?php echo $this->Html->link(
        'Delete',
        array('controller' => 'recipes', 'action' => 'delete', 6),
        array(),
        "Are you sure you wish to delete this recipe?"
    );?>

Will output:

::

      
    <a href="/pt/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

Query strings can also be created with ``link()``.

::

    <?php echo $this->Html->link('View image', array(
        'controller' => 'images',
        'action' => 'view',
        1,
        '?' => array('height' => 400, 'width' => 500))
    );

Will output:

::

      
    <a href="/pt/images/view/1?height=400&width=500">View image</a>

HTML special characters in ``$title`` will be converted to HTML
entities. To disable this conversion, set the escape option to false in
the ``$options`` array.

::

    <?php 
    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "recipes/view/6",
        array('escape' => false)
    );

    ?>

Will output:

::

    <a href="/pt/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Also check `HtmlHelper::url <https://book.cakephp.org/view/1448/url>`_
method for more examples of different types of urls.

tag
---

``tag(string $tag, string $text, array $htmlAttributes)``

Returns text wrapped in a specified tag. If no text is specified then
only the opening <tag> is returned.

::

    <?php echo $this->Html->tag('span', 'Hello World.', array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">Hello World</span>
     
    //No text specified.
    <?php echo $this->Html->tag('span', null, array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">

Text is not escaped by default but you may use
``$htmlOptions['escape'] = true`` to escape your text. This replaces a
fourth parameter ``boolean $escape = false`` that was available in
previous versions.

div
---

``div(string $class, string $text, array $options)``

Used for creating div-wrapped sections of markup. The first parameter
specifies a CSS class, and the second is used to supply the text to be
wrapped by div tags. If the last parameter has been set to true, $text
will be printed HTML-escaped.

::

     
    <?php echo $this->Html->div('error', 'Please enter your credit card number.');?>

    //Output
    <div class="error">Please enter your credit card number.</div>

If $text is set to null, only an opening div tag is returned.

::

    <?php echo $this->Html->div('', null, array('id' => 'register'));?>

    //Output
    <div id="register" class="register">

para
----

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Returns a text wrapped in a CSS-classed <p> tag. If no text is supplied,
only a starting <p> tag is returned.

::

    <?php echo $this->Html->para(null, 'Hello World.');?>
     
    //Output
    <p>Hello World.</p>

script
------

script(mixed $url, mixed $options)

Creates link(s) to a javascript file. If key ``inline`` is set to false
in $options, the link tags are added to the $scripts\_for\_layout
variable which you can print inside the head tag of the document.

Include a script file into the page. ``$options['inline']`` controls
whether or not a script should be returned inline or added to
$scripts\_for\_layout. ``$options['once']`` controls, whether or not you
want to include this script once per request or more than once.

You can also use $options to set additional properties to the generated
script tag. If an array of script tags is used, the attributes will be
applied to all of the generated script tags.

This method of javascript file inclusion assumes that the javascript
file specified resides inside the /app/webroot/js directory.

::

    <?php echo $this->Html->script('scripts'); ?> 

Will output:

::

    <script type="text/javascript" href="/pt/js/scripts.js"></script>

You can link to files with absolute paths as well to link files that are
not in ``app/webroot/js``

::

    <?php echo $this->Html->script('/otherdir/script_file'); ?> 

The first parameter can be an array to include multiple files.

::

    <?php echo $this->Html->script(array('jquery','wysiwyg','scripts')); ?>

Will output:

::

    <script type="text/javascript" href="/pt/js/jquery.js"></script>
    <script type="text/javascript" href="/pt/js/wysiwyg.js"></script>
    <script type="text/javascript" href="/pt/js/scripts.js"></script>

scriptBlock
-----------

scriptBlock($code, $options = array())

Generate a code block containing ``$code`` set ``$options['inline']`` to
false to have the script block appear in ``$scripts_for_layout``. Also
new is the ability to add attributes to script tags.
``$this->Html->scriptBlock('stuff', array('defer' => true));`` will
create a script tag with ``defer="defer"`` attribute.

scriptStart
-----------

scriptStart($options = array())

Begin a buffering code block. This code block will capture all output
between ``scriptStart()`` and ``scriptEnd()`` and create an script tag.
Options are the same as ``scriptBlock()``

scriptEnd
---------

scriptEnd()

End a buffering script block, returns the generated script element or
null if the script block was opened with inline = false.

An example of using ``scriptStart()`` and ``scriptEnd()`` would be:

::

    $this->Html->scriptStart(array('inline' => false));

    echo $this->Js->alert('I am in the javascript');

    $this->Html->scriptEnd();

tableHeaders
------------

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

Creates a row of table header cells to be placed inside of <table> tags.

::

    <?php echo $this->Html->tableHeaders(array('Date','Title','Active'));?>

    //Output 
    <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Active</th>
    </tr>
     
    <?php echo $this->Html->tableHeaders(
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

    <?php echo $this->Html->tableCells(array(
        array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
     
    <?php echo $this->Html->tableCells(array(
        array('Jul 7th, 2007', array('Best Brownies', array('class'=>'highlight')) , 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', array('No', array('id'=>'special'))),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td class="highlight">Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td id="special">No</td></tr>
     
    <?php echo $this->Html->tableCells(
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

`View more details about the tableCells function in the
API <https://api.cakephp.org/class/html-helper#method-HtmlHelpertableCells>`_

url
---

``url(mixed $url = NULL, boolean $full = false)``

Returns an URL pointing to a combination of controller and action. If
$url is empty, it returns the REQUEST\_URI, otherwise it generates the
url for the controller and action combo. If full is true, the full base
URL will be prepended to the result.

::

    <?php echo $this->Html->url(array(
        "controller" => "posts",
        "action" => "view",
        "bar"));?>
     
    // Output
    /posts/view/bar

Here are a few more usage examples:

URL with named parameters

::

    <?php echo $this->Html->url(array(
        "controller" => "posts",
        "action" => "view",
        "foo" => "bar"));
    ?>
     
    // Output
    /posts/view/foo:bar

URL with extension

::

    <?php echo $this->Html->url(array(
        "controller" => "posts",
        "action" => "list",
        "ext" => "rss"));
    ?>
     
    // Output
    /posts/list.rss

URL (starting with '/') with the full base URL prepended.

::

    <?php echo $this->Html->url('/posts', true); ?>

    //Output
    http://somedomain.com/posts

URL with GET params and named anchor

::

    <?php echo $this->Html->url(array(
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

Alterando a saída de tags pelo HtmlHelper
=========================================

A definição de tags para o ``HtmlHelper`` segue o modelo XHTML. No
entanto, se você precisa gerar HTML para HTML4 você vai precisar criar e
carregar um arquivo de configuração contendo as tags que você gostaria
de usar. Para mudar as tags utilizadas crie o arquivo
``app/config/tags.php`` com o conteúdo:

::

    $tags = array(
        'metalink' => '<link href="%s" %s >',
        'input' => '<input name="%s" %s >',
        //...
    );

Assim, você pode carregar a tag definida chamando
``$html->loadConfig('tags');``

Creating breadcrumb trails with HtmlHelper
==========================================

CakePHP has the built in ability to automatically create a breadcrumb
trail in your app. To set this up, first add something similar to the
following in your layout template.

::

         echo $this->Html->getCrumbs(' > ','Home');

Now, in your view you'll want to add the following to start the
breadcrumb trails on each of the pages.

::

         $this->Html->addCrumb('Users', '/users');
         $this->Html->addCrumb('Add User', '/users/add');

This will add the output of "**Home > Users > Add User**\ " in your
layout where getCrumbs was added.
