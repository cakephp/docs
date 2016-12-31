HTML
####

El rol del HtmlHelper de CakePHP es hacer los tags referentes a HTML y
sus opciones simples, rápidas, y más resistentes al cambio. Usando este
ayudante pondremos más luz sobre tu aplicación, y más flexibilidad en
cuanto a donde se encuentre en relación al dominio principal.

El rol del HtmlHelper ha cambiado significativamente desde CakePHP 1.1.
Los metodos relacionados a Form ya no se usan y han sido movidos al
nuevo FormHelper. Si tu estas buscando ayuda para los formularios HTML,
Revisa lo nuevo de FormHelper.

Antes de dar un vistaso a los metodos de HtmlHelper, vas a necesitar
conocimientos sobre configuración y usos en las situaciones que te puede
ayudar esta clase. En primer lugar, en un esfuerzo para aliviar a
aquellos que gustan de usar las etiquetas cortas (<?= ?>) o muchas
llamadas a echo() en el codigo de sus vistas todos los metodos del
HtmlHelper son pasados por el metodo output(). Si tu deseas activar
automáticamente la salida para generar HTML con el ayudante simplemente
implementa output() en tu AppHelper.

::

    function output($cadena) {
        echo $cadena;
    }

Haciendo esto no necesitarás agregar llamadas a echo en el codigo de tus
vistas.

Muchos metodos HtmlHelper incluyen parametros $htmlAttributes, esto te
permite hilvanar cualquier atributo extra en tus tags. Aquí hay algunos
ejemplos de como se usan los parámetros $htmlAttributes

::

    Atributos Deseados: <tag class="algunaClase" />      
    Arreglo de Parametros: array('class'=>'algunaClase')
     
    Atributos Deseados: <tag name="foo" value="bar" />  
    Arreglo de Parametros:  array('name' => 'foo', 'value' => 'bar')

El HtmlHelper está disponible en todas las vistas de forma
predeterminada. Si usted está recibiendo un error que le informa que no
está ahí, es por lo general debido a su nombre que esta faltando y puede
configurarlo manualmente en la variable $helpers del controlador.

Inserting Well-Formatted elements
=================================

La tarea más importante que realiza el HtmlHelper (Ayudante Html) es la
creación de etiquetas html bien formadas. No tengas miedo de usarlo a
menudo - puedes almacenar en caché las vistas en CakePHP con el fin de
ahorrar unos pocos de ciclos de CPU cuando las vistas están siendo
renderizadas y entregadas. Esta sección cubrirá algunos de los métodos
del HtmlHelper y cómo usarlos.

charset
-------

``charset(string $charset=null)``

Usada para crear metadatos que especificarán la codificación de los
caracteres del documento. El valor por defecto es UTF-8.

::

     
    <?php echo $html->charset(); ?> 

Generará como salida:

::

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

O sino tambien:

::

    <?php echo $html->charset('ISO-8859-1'); ?>

Generará como salida:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $htmlAttributes = array(), boolean $inline = true)``

Crea un enlace a una o más hojas de estilos CSS. Si $inline está en
*false*, los tags de enlace son agregados en la variable
$scripts\_for\_layout, la cual puedes imprimir dentro del tag *head* del
documento.

Este método de inclusión de CSS asume que el archivo CSS especificado
esté en el directorio **/app/webroot/css**.

::

    <?php echo $html->css('forms'); ?> 

Hará la salida:

::

    <link rel="stylesheet" type="text/css" href="/es/css/forms.css" />

El primer parámetro puede ser un arreglo para incluir varios archivos.

::

    <?php echo $html->css(array('forms','tables','menu')); ?>

Hará la salida:

::

    <link rel="stylesheet" type="text/css" href="/es/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/es/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/es/css/menu.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

Este método es útil para vincular a los recursos externos como los feeds
RSS / Atom y favicons. Como CSS (), puede especificar si desea o no que
esta etiqueta a aparezca en la línea o en la etiqueta de la cabecera con
el cuarto parámetro.

Si establece el atributo "type" usando el parámetro $htmlAttributes,
CakePHP contiene algunos atajos:

+--------+------------------------+
| type   | valor traducido        |
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
    );?> //Salida (saltos de linea añadidos) </p>
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
     
    //Salida (saltos de linea añadidos)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

Este método también puede utilizarse para agregar las etiquetas "meta"
para las palabras claves y las descripciones. Ejemplo:

::

    <?php echo $html->meta(
        'keywords',
        'ingrese las palabas claves aquí'
    );?>
    //Salida <meta name="keywords" content="ingrese las palabas claves aquí"/>
    //

    <?php echo $html->meta(
        'description',
        'ingrese alguna descripcion meta aquí'
       );?> 

    //Salida <meta name="description" content="ingrese alguna descripcion meta aquí"/>

Si deseas añadir una etiqueta meta personalizada en el primer parámetro
se debe establecer una matriz. Para una salida de la etiqueta "robots
noindex" debe utilizar el siguiente código:

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

    <?php echo $this->Html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <?php echo $this->Html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $oneline = true)``

Construye una definición de estilo CSS basada en las claves y valores
del vector pasado al metodo. Especialmente util si tu archivo CSS es
dinamico.

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Mostrara:

::

      background:#633; border-bottom:1px solid #000; padding:10px;

image
-----

``image(string $path, array $htmlAttributes = array())``

Crea una etiqueta de imagen, la ruta especificada será relativa a
/app/webroot/img/.

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Mostrará:

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

Si desea crear un link asociado a la imagen especifique el link de
destino usando la opción ``url option en $htmlAttributes.``

::

    <?php echo $html->image("recipes/6.jpg", array(
        "alt" => "Bizcochos",
        'url' => array('controller' => 'recipes', 'action' => 'view', 6)
    )); ?>

Mostrará:

::

    <a href="/es/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Bizcochos" />
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

      
    <a href="/es/pages/home" class="button" target="_blank">Enter</a>

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

      
    <a href="/es/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

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

      
    <a href="/es/images/view/1?height=400&width=500">View image</a>

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

    <a href="/es/recipes/view/6">
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

    <script type="text/javascript" href="/es/js/scripts.js"></script>

You can link to files with absolute paths as well to link files that are
not in ``app/webroot/js``

::

    <?php echo $this->Html->script('/otherdir/script_file'); ?> 

The first parameter can be an array to include multiple files.

::

    <?php echo $this->Html->script(array('jquery','wysiwyg','scripts')); ?>

Will output:

::

    <script type="text/javascript" href="/es/js/jquery.js"></script>
    <script type="text/javascript" href="/es/js/wysiwyg.js"></script>
    <script type="text/javascript" href="/es/js/scripts.js"></script>

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

Crea una fila de encabezados de tabla para ser usados dentro de la
etiqueta <table>.

::

    <?php echo $html->tableHeaders(array('Fecha','Nombre','Activo'));?>

    //Salida 
    <tr>
        <th>Fecha</th>
        <th>Nombre</th>
        <th>Activo</th>
    </tr>
     
    <?php echo $html->tableHeaders(
        array('Fecha','Nombre','Activo'),
        array('class' => 'estado'),
        array('class' => 'tabla_productos')
    );?>
     
    //Salida
    <tr class="estado">
         <th class="tabla_productos">Fecha</th>
         <th class="tabla_productos">Nombre</th>
         <th class="tabla_productos">Activo</th>
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

Devuelve un URL que apunta a alguna combinación de controlador y acción.
Si $url está vacío devuelve el valor de REQUEST\_URI, en caso contrario
genera el URL para la combinación de controlador y acción. Si $full es
true, se antepondrá el URL base del sitio al resultado.

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "bar"));?>
     
    // Salida
    /posts/view/bar

Enseguida más ejemplos de uso:

URL con parámetros nombrados (named parameters)

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "foo" => "bar"));
    ?>
     
    // Salida
    /posts/view/foo:bar

URL con extensión

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "list",
        "ext" => "rss"));
    ?>
     
    // Salida
    /posts/list.rss

URL (empezando con '/') con el URL completo del sitio agregado al
inicio.

::

    <?php echo $html->url('/posts', true); ?>

    //Salida
    http://www.example.com/posts

URL con parámetros GET y ancla nombrada (named anchor)

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "buscar",
        "?" => array("foo" => "bar"),
        "#" => "primero"));
    ?>

    //Salida
    /posts/buscar?foo=bar#primero

Por mas info ver `el
Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_ en
el API.

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

You can then load this tag set by calling
``$this->Html->loadConfig('tags');``

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
