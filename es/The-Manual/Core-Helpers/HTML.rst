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

The most important task the HtmlHelper accomplishes is creating well
formed markup. Don't be afraid to use it often - you can cache views in
CakePHP in order to save some CPU cycles when views are being rendered
and delivered. This section will cover some of the methods of the
HtmlHelper and how to use them.

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

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

Método de propósito general para crear enlaces HTML. Use
``$htmlAttributes`` para especificar los atributos del elemento.

::

    <?php echo $html->link('Enter', '/pages/home', array('class'=>'button','target'=>'_blank')); ?>

Arrojará como resultado:

::

      
    <a href="/es/pages/home" class="button" target="_blank">Enter</a>

Especifique ``$confirmMessage`` para desplegar un dialogo javascript
``confirm()``.

::

    <?php echo $html->link(
        'Delete',
        array('controller'=>'recipes', 'action'=>'delete', 6),
        array(),
        "¿Está seguro que desea eliminar esta receta?"
    );?>

Arrojará como resultado:

::

      
    <a href="/es/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

Query strings también pueden ser creados con ``link()``.

::

    <?php echo $html->link('View image', array(
        'controller' => 'images',
        'action' => 'view',
        1,
        '?' => array( 'height' => 400, 'width' => 500))
    );

Arrojará como resultado:

::

      
    <a href="/es/images/view/1?height=400&width=500">View image</a>

Los caracteres especiales HTML en ``$title`` serán convertidos a
entidades HTML. Para deshabilitar esta conversión, establezca la opción
escape a false (falso) en ``$htmlAttributes``, o establezca
``$escapeTitle`` a false (falso).

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

Ambos arrojarán como resulado lo siguiente:

::

    <a href="/es/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Consulte también la documentación del método
`HtmlHelper::url <https://book.cakephp.org/view/842/url>`_ para más
ejemplos de diferentes tipos de urls.

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

Usado para crear contenedores de código HTML tipo div. El primer
parámetro especifica una clase CSS, el segundo es usado para
proporcionar el texto que estará envuelto por las etiquetas div. Si el
último parámetro fue establecido como true, el valor de el parámetro
$text, será impreso escapando el código HTML.

Si no se especifica un texto por medio del parámetro $text , sólo una
etiqueta div de apertura es regresada.

::

     
    <?php echo $html->div('error', 'Por favor, escriba su nombre de usuario.');?>

    // La instrucción anterior imprimiría esta cadena:
    <div class="error">Por favor, escriba su nombre de usuario.</div>

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

You can then load this tag set by calling ``$html->loadConfig('tags');``
