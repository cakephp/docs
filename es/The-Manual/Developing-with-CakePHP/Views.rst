Vistas
######

 

Plantillas de la Vista
======================

La capa vista de CakePHP es cómo hablas a tus usuarios. La mayor parte
del tiempo tu vista estará mostrando documentos (X)HTML a los
navegadores, pero tal vez necesites server datos AMF a un objeto Flash,
responder a una aplicación remota mediante SOAP o producir un fichero
CSV para un usuario.

Los ficheros de vista de CakePHP están escritos en PHP plano y tienen la
extensión .ctp (*CakePHP Template*) por defecto . Estos ficheros
contienen toda la lógica de representación necesaria para obtener los
datos recibidos del controlador en un formato que está preparado para la
audiencia a la que estás atendiendo.

Los ficheros de vista se almacenan en /app/views/, en una carpeta
nombrada tras el controlador que usa los ficheros, y nombrada tras la
acción a la que corresponde. Por ejemplo, el fichero de vista para el la
acción ``view()`` del controlador Productos, normalmente, se encontraría
en /app/views/productos/view.ctp.

La capa vista en CakePHP puede estar formada por un número diferentes de
partes. Cada parte tiene usos diferentes, y será tratado en este
capítulo:

-  ***layouts*** (diseños): ficheros de vista que contienen el código de
   presentación que se encuentra envolviendo muchas interfaces en tu
   aplicación. La mayoría de vistas son 'renderizadas' (presentadas)
   dentro de un *layout* (diseño).
-  ***elements*** (elementos): trozo de código de vista más pequeño y
   reutilizable. Los elementos generalmente son renderizados dentro de
   vistas.
-  ***helpers*** (ayudantes): estas clases encapsulan lógica de vista
   que es necesaria en muchas partes en la capa vista. Además de otras
   cosas, los ayudantes en CakePHP pueden ayudarte a construir
   formularios, construir funcionalidad AJAX, paginar los datos del
   modelo o servir *feeds* RSS.

Layouts
=======

Un diseño contiene el código de presentación que envuelve una vista.
Cualquier cosa que quieras ver en todas tus vistas debería estar situada
en un *layout*.

Los ficheros de diseño deberían situarse en /app/views/layouts. El
diseño por defecto de CakePHP puede ser sustituido creando un nuevo
diseño por defecto en /app/views/layouts/default.ctp. Una vez que ha
sido creado un nuevo diseño, el código de la vista renderizado por el
controlador se coloca dentro del diseño por defecto cuando la página es
renderizada.

Cuando creas un diseño, necesitas decirle a CakePHP dónde colocar el
código para tus vistas. Para hacer eso, estate seguro que tu diseño
incluye un lugar para ``$content_for_layout`` (y opcionalmente,
``$title_for_layout``). Aquí está un ejemplo de a lo que debería
parecerse un diseño por defecto:

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title><?php echo $title_for_layout?></title>
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
      <!-- Incluir ficheros y scripts externos aquí (Mirar el ayudante HTML para más información -->
      <?php echo $scripts_for_layout ?>
    </head>
    <body>

      <!-- Si quieres algún tipo de menú que mostrar en todas tus vistas, incluyelo aquí -->
      <div id="cabecera">
          <div id="menu">...</div>
      </div>

      <!-- Aquí es donde quiero que se vean mis vistas -->
      <?php echo $content_for_layout ?>

      <!-- Añadir un pie de página a cada página mostrada -->
      <div id="pie">...</div>

    </body>
    </html>

``$scripts_for_layout`` contiene cualquier fichero externo y scripts
incluidos con el ayudante HTML incrustado. Es últil para incluir
ficheros javascript y CSS de las vistas.

Cuando uses ``$html->css()`` o ``$javascript->link()`` en los ficheros
de vista, especifica ``false`` en el argumento 'in-line' para colocar el
fuente html en ``$scripts_for_layout``. (Mirar API para más detalles de
uso).

``$content_for_layout`` contiene la vista. Aquí es donde será colocado
el código de la vista.

``$title_for_layout`` contiene el título de la página.

Para establecer el título para el diseño, es fácil hacerlo en el
controlador, usando la variable del controlador ``$pageTitle``.

::

    <?php
    class UsuariosController extends AppController {
        function verActivos() {
            $this->pageTitle = 'Ver Usuarios Activos';
        }
    }
    ?>

Puedes crear tantos diseños como desees: simplemente colócalos en el
directorio app/views/layouts e intercambialos dentro de tus acciones del
controlador usando la variable ``$layout`` del cotrolador, o la función
``setLayout()``.

Por ejemplo, si una sección de mi *site* incluye un espacio menor con
banner de publicidad, debería crear un nuevo diseño (*layout*) con el
espacio publicitario menor, especificándolo como el diseño para todas
las acciones del controlador haciendo algo como:

var $layout = 'publicidad\_pequena\_pordefecto';

::

    <?php
    class UsuariosController extends AppController {
        function verActivos() {
            $this->pageTitle = 'Ver Usuarios Activos';
            $this->layout = 'publicidad_pequena_pordefecto';
        }

        function verImagen() {
            $this->layout = 'imagen';
            //mostrar la imagen del usuario
        }
    }
    ?>

CakePHP ofrece dos diseños comunes (además del diseño por defecto de
CakePHP) que puedes usar en tus propias aplicaciones: 'ajax' y 'flash'.
El diseño Ajax es útil para contruir las respuestas Ajax; es un diseño
vacío (la mayoría de las llamadas ajax sólo requiren una pocas etiquetas
como respuesta, más que una interfaz completa). El diseño flash es usado
por mensajes mostrados por el método ``flash()`` del controlador.

Existen otros tres diseños: xml, js y rss en el núcleo como una manera
rápida y fácil de servir contenido que no sea text/html.

Elementos
=========

Muchas aplicaciones tienen pequeños bloques de código de presentación
que necesita ser repetido de página en página, algunas veces en
diferentes lugares del diseño. CakePHP puede ayudarte a repetir partes
de tu *website* que necesitan ser reutilizadas. Estar partes
reutilizadas son llamadas Elementos. Anuncios, cajas de ayuda, controles
de navegación, menús extras, formularios de login y llamadas están a
menudo implementadas en CakePHP en forma de elementos. Un elemento es
básicamente una minivista que puede ser incluido en otras vistas, en
diseños, e incluso dentro de otros elementos. Los elementos pueden ser
usados para hacer una vista más legible, situando el renderizado de
elementos que se repiten en sus propios ficheros. Pueden también
ayudarte a reutilizar fragmentos de contenido en tus aplicaciones.

Los elementos están en la carpeta /app/views/elements/ y tienen la
extensión de archivo .ctp. Son mostrados usando el método ``element()``
de la vista.

::

    <?php echo $this->element('cajaayuda'); ?>

Passing Variables into an Element
---------------------------------

Puedes pasarle datos a un elemento usando el segundo argumento de
``element()``:

::

    <?php echo
    $this->element('helpbox', 
        array("helptext" => "Oh, this text is very helpful."));
    ?>

Dentro del archivo del elemento, todas las variables pasadas estan
disponibles como miembros del array de parámetros (de la misma manera
que ``set()`` en el controlador funciona con los archivos de las
vistas). En el ejemplo siguiente, el archivo
/app/views/elements/helpbox.ctp puede usar la variable ``$helptext``.

::

    <?php
    echo $helptext; //outputs "Oh, this text is very helpful."
    ?>

La función ``element()`` combina opciones para el elemento con los datos
a pasar en element. Las dos opciones son 'cache' y 'plugin'. Un ejemplo:

::

    <?php echo
    $this->element('helpbox', 
        array(
            "helptext" => "Esto es pasado al elemento como $helptext"
            "foobar" => "Esto es pasado al elemento como $foobar"
            "cache" => "+2 days" //setea el 'cacheo' a +2 días.
            "plugin" => "" //para renderizar un elemento desde un plugin
        )
    );
    ?>

Para tener en cache distintas versiones del mismo elemento en una
aplicación, provee una clave única de cache usando el siguiente formato:

::

    <?php
    $this->element('helpbox',
        array(
            "cache" => array('time'=> "+7 days",'key'=>'unique value')
        )
    );
    ?>

Puedes aprovechar bien los elementos usando ``requestAction()``. La
función ``requestAction()`` trae las variables desde una acción de
controlador y las retorna como un array. Esto permite que tus elementos
cumplan con el diseño MVC. Crea una acción de controlador que prepare
las variables de la vista para tus elementos, luego haz la llamada
``requestAction()`` dentro del segundo parámetro de ``element()`` para
proveerle al elemento las variables de vista desde tu controlador.

Para hacer esto, en tu controlador añade algo como lo siguiente, para el
ejemplo de Post.

::

    <?php
    class PostsController extends AppController {
        ...
        function index() {
            $posts = $this->paginate();
            if (isset($this->params['requested'])) {
                return $posts;
            } else {
                $this->set(compact('posts'));
            }
        }
    }
    ?>

Ahora en el elemento podemos acceder el modelo de posts paginados. Para
tener los últimos cinco posts en una lista ordenada deberíamos hacer lo
siguiente:

::

    <h2>Latest Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/order:asc/limit:5'); ?>
    <?php foreach($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Cache de Elements
-----------------

Puedes aprovechar el cache de vistas de CakePHP si aportas un parámetro
'cache'. Si lo ajustas a true, mantendrá en cache durante un día. De
otro modo, puedes ajustar tiempos de caducidad alternativos. Lee
`Cache </es/view/156/caching>`_ para más información sobre cómo fijar la
caducidad.

::

    <?php echo $this->element('helpbox', array('cache' => true)); ?>

Si dibujas el mismo elemento más de una vez en una vista y tienes el
cache activado, asegúrate de ajustar el parámetro 'key' con un nombre
diferente cada vez. Esto evitará que cada sucesiva llamada sobreescriba
el resultado almacenado en cache de la anterior llamada element(). Por
ejemplo:

::

    <?php
    echo $this->element('helpbox', array('cache' => array('key' => 'first_use', 'time' => '+1 day'), 'var' => $var));

    echo $this->element('helpbox', array('cache' => array('key' => 'second_use', 'time' => '+1 day'), 'var' => $differentVar));
    ?>

Lo anterior asegura que ambos elementos son almacenados en cache de
forma separada.

Utilizar Elements de un Plugin
------------------------------

Si estás usando un plugin y deseas usar elements dentro de ese plugin,
simplemente especifica el parámetro plugin. Si la vista está siendo
dibujada para un controlador/acción de un plugin, se usará el elemento
del plugin. Si el elemento no existe en el plugin, se buscará en la
carpeta APP principal.

::

    <?php echo $this->element('helpbox', array('plugin' => 'pluginname')); ?>

Métodos de la vista
===================

Los métodos de la Vista están disponibles para todos los archivos de
vistas, elementos y plantillas. Para llamar a cualquier método de la
vista utilice: ``$this->method()``

set()
-----

``set(string $var, mixed $value)``

Las Vistas tienen un metodo ``set()`` que es análogo al ``set()``
encontrado en los objetos *Controller*. Te permite agregar variables al
`viewVars <#>`_. Usando set() desde tu archivo de vista, agregará las
variables a la capa (*layout*) y elementos (*elements*) que luego serán
renderizados. Ver
`Controller::set() </es/view/57/Controller-Methods#set-427>`_ para mas
información en el uso de set().

En tu archivo vista puedes hacer

::

        $this->set('activeMenuButton', 'posts');

Luego en tu capa (*layout*) la variable ``$activeMenuButton`` estará
disponible y contendrá el valor: 'posts'.

getVar()
--------

``getVar(string $var)``

Obtiene el valor de la viewVar con el nombre $var

getVars()
---------

``getVars()``

Devuelve una lista de todas las variables de vistas disponibles en la
renderización actual. Devuelve una matriz con los nombres de las
variables.

error()
-------

``error(int $code, string $name, string $message)``

Displays an error page to the user. Uses layouts/error.ctp to render the
page.

::

        $this->error(404, 'Not found', 'This page was not found, sorry');

This will render an error page with the title and messages specified.
Its important to note that script execution is not stopped by
``View::error()`` So you will have to stop code execution yourself if
you want to halt the script.

element()
---------

``element(string $elementPath, array $data, bool $loadHelpers)``

Renders an element or view partial. See the section on `View
Elements </es/view/97/Elements>`_ for more information and examples.

uuid()
------

``uuid(string $object, mixed $url)``

Generates a unique non-random DOM ID for an object, based on the object
type and url. This method is often used by helpers that need to generate
unique DOM ID's for elements such as the AjaxHelper.

::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

addScript()
-----------

``addScript(string $name, string $content)``

Adds content to the internal scripts buffer. This buffer is made
available in the layout as ``$scripts_for_layout``. This method is
helpful when creating helpers that need to add javascript or css
directly to the layout. Keep in mind that scripts added from the layout,
or elements in the layout will not be added to ``$scripts_for_layout``.
This method is most often used from inside helpers, like the
`Javascript </es/view/207/Javascript>`_ and `Html </es/view/205/HTML>`_
Helpers.

Temas
=====

Puedes aprovechar los temas (themes), haciendo sencillo el cambio de la
apariencia de tu página de una forma rápida y fácil.

Para usar los temas, necesitas decirle a tu controlador que use la clase
``ThemeView`` en lugar de la clase por defecto ``View``.

::

    class ExampleController extends AppController {
        var $view = 'Theme';
    }

Para declarar qué tema usar por defecto, especifica el nombre del tema
en tu controlador.

::

    class ExampleController extends AppController {
        var $view = 'Theme';
        var $theme = 'ejemplo';
    }

También puedes setear o cambiar el nombre del tema dentro de una acción
o en las funciones de *callback* ``beforeFilter()`` o
``beforeRender()``.

::

    $this->theme = 'otro_ejemplo';

Los archivos de vista de los temas deben estar dentro de la carpeta
*/app/views/themed/* . Dentro de la carpeta *themed*, crea una carpeta
usando el nombre de tu tema. Después de eso, la estructura de carpetas
dentro de /app[STRIKEOUT:]/views/themed/example/ es exactamente igual a
/app/views/.

Por ejemplo, el archivo de vista de una acción de edición de un
controlador de Posts estaría ubicado en
/app/views/themed/example/posts/edit.ctp. Los archivos de Layout
estarían en /app/views/themed/example/layouts/.

Si un archivo de vista no puede ser encontrado en el tema, CakePHP
tratará de localizarlo en la carpeta /app/views/. De esta forma, puedes
crear archivos de vista maestros y simplemente sobreescribirlos según
cada caso dentro de la carpeta de tu tema.

Si tienes archivos CSS o JavaScript que son específicos para tu tema,
puedes almacenarlos en una carpeta de tema dentro de la
carpeta\ *webroot/*. Por ejemplo, tus hojas de estilo serían almacenadas
en /app/webroot/themed/example/css/ y tus archivos JavaScript estarían
en /app/webroot/themed/example/js/.

Todos los helpers de CakePHP son concientes de los temas y crearán las
rutas correctas automáticamente. Como con los archivos de vistas, si un
archivo no está en la carpeta del tema, se ubicará por defecto en la
carpeta *webroot* principal.

Vistas de Medios
================

Las vistas de medios te permiten enviar archivos binarios al usuario.
Por ejemplo, quizá deseas tener un directorio de archivos fuera de la
carpeta /webroot para prevenir que los usuarios tengan acceso directo a
ellos. Puedes usar vistas Media para traer el archivo desde una carpeta
especial dentro de /app/, pudiendo hacer autenticación antes de entregar
el archivo al usuario.

Para usar vistas Media, necesitas decirle a tu controlador que use la
clase ``MediaView`` en vez de la clase por defecto ``View``. Después de
esto, sólo pasa los parámetros adicionales para especificar dónde está
ubicado tu archivo.

::

    class EjemploController extends AppController {
        function download () {
            $this->view = 'Media';
            $params = array(
                  'id' => 'ejemplo.zip',
                  'name' => 'ejemplo',
                  'download' => true,
                  'extension' => 'zip',
                  'path' => 'files' . DS
           );
           $this->set($params);
        }
    }

Aquí tenemos un ejemplo de una descarga de un archivo cuyo tipo MIME no
está incluido en el array $mimeType de la clase MediaView.

::

    function download () {
        $this->view = 'Media';
        $params = array(
              'id' => 'example.docx',
              'name' => 'example',
              'extension' => 'docx',
              'mimeType' => array('docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
              'path' => APP . 'files' . DS
       );
       $this->set($params);
    }

+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Parámetros   | Descripción                                                                                                                                                                 |
+==============+=============================================================================================================================================================================+
| id           | El *ID* es el nombre del archivo tal como está en el servidor, incluyendo su extensión.                                                                                     |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| name         | El nombre (*name*) te permite especificar un nombre de archivo alternativo para ser enviado al usuario. Especifica el nombre sin la extensión del archivo.                  |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| download     | Un valor booleano que indica si los encabezados deben forzar la descarga.                                                                                                   |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| extension    | La extensión del archivo. Esto se compara con una lista interna de tipos MIME aceptados. Si el tipo MIME especificado no está en la lista, el archivo no será descargado.   |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| path         | El nombre del archivo, incluyendo el separador del directorio final. La ruta (*path* es relativa a la carpeta app/.                                                         |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| mimeType     | Un arreglo con tipos MIME adicionales que serán mezclados con la lista interna de tipos MIME aceptados.                                                                     |
+--------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

