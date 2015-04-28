Views
#####

Las Views (Vistas) son la **V** en MVC. Las vistas son responsables
de generar la salida requerida por la solicitud. Comúnmente es en un
formato de HTML, XML o JSON, pero transmitir archivos o crear archivos
PDF también son responsabilidades de la capa de las vistas.

CakePHP incluye clases de vistas predefinidas para encargarse de los
escenarios más comunes de renderizado:

- Para crear servicios web de XML o JSON, puedes usar las :doc:`views/json-and-xml-views`.
- Para retornar archivos protegidos o generado dinámicamente, puedes usar :ref:`cake-response-file`.
- Para crear vistas con multiples temas, puedes usar :doc:`views/themes`.

Plantillas de vistas
====================

La capa de vistas de CakePHP es cómo le hablas a tus usuarios. La
mayoría del tiempo las vistas mostrarán documentos de (X)HTML a los
exploradores, pero pueda que también tengas que proveerle data un
objeto de Flash, responderle a una aplicación remote a través de SOAP
o desplegar un archivo CSV para un usuario.

Por defecto los archivos de las vistas de CakePHP están escritas en PHP
puro and tienen una extension por defecto .ctp (CakePHP Template).
Estos archivos contienen toda la lógica de la presentación necesaria
para transformar los datos recibidos del controlador a un formato que
esté listo para la audiencia destinada. Si prefieres usar un lenguaje
para hacer plantillas, como Twig o Smarty, una subclase de View creará
un puente entre tu lenguaje y CakePHP.

Un archivo de vista está almacenado en ``/app/View/``, en un subdirectorio
cuyo nombre está basado en el nombre del controlador que use el archivo.
Tiene un nombre que corresponde a su acción. Por ejemplo, la vista para
la acción "view()" del controlador de productos se encontraría normalmente
en ``/app/View/Products/view.ctp``.

La capa de vista en CakePHP puede estar formada de un número de
diferentes partes. Cada parte tiene distintos usos y será explicada
en este capítulo:

- **views**: Las vistas son la parte de la página que es única
  para la acción ejecutándose. Forman la base de la respuesta de la
  aplicación.
- **elements**: piezas más pequeñas y reutilizables de código. Los
  elementos son renderizados típicamente en las vistas.
- **layouts**: archivos de vistas que contienen code de presentación
  que envuelven muchas interfaces de la aplicación. La mayoría de
  vistas son renderizadas dentro de un layout.
- **helpers**: estas clases encapsulan la logica de las vistas que
  es necesaria en muchos lugares de la capa de vistas. Los helpers en
  CakePHP puede ayudar a construir formularios, funcionalidad de AJAX,
  paginar datos de lso modelos, o proveer transmisiones de RSS, entre
  otros.

.. _extending-views:

Extender vistas
---------------

.. versionadded:: 2.1

Extender vistas te permite envolver una vista dentro de otra. Combinando
esto con :ref:`view blocks <view-blocks>` te da una manera poderosa de
mantener tus vistas :term:`DRY`. Por ejemplo, tu aplicación tiene una barra
lateral que necesita cambiar dependiendo de la vista renderizada. Al extender
un archivo de vista común, puedes evitar que se repita el markup común de
la barra lateral y sólo definir las partes que cambien:

.. code-block:: php

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

La vista de arriba puede usarse como una vista padre. Espera que la vista que
la extienda defina los bloques ``sidebar`` y ``title``. El bloque de ``content``
es un bloque especial que CakePHP crea. Esta contiene todo el contenido no
capturado por la vista extendida. Asumiendo que nuestra vista tiene una
variable ``$post`` con datos de nuestra publicación, la vista podría verse así:

.. code-block:: php

    <?php
    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>
    // El resto del contenido estará disponible como el bloque de
    // contenido en la vista padre.
    <?php echo h($post['Post']['body']);

La publicación de arriba muestra como puedes extender una vista e ingresar
datos de bloques. Cualquier contenido que no esté definido en un bloque será
capturado y puesto en el bloque especial llamado ``content``. Cuando una
vista contiene una llamada a ``extend()``, la ejecución continúa hasta el
final del archivo. Una vez terminada la vista extendida será renderizada.
Llamar ``extend()`` más de una vez en una vista se antepondrá a la siguiente
vista padre que será procesada::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

Lo de arriba resultará en ``/Common/index.ctp`` siendo renderizada como la
vista padre de la vista actual.

Puedes anidar vistas extendidas cuantas veces sea necesario. Cada vista puede
extender otra vista si es deseado. Cada vista padre tendrá el contenido de la
vista anterior como el bloque ``content``.

.. note::

    Evita usar ``content`` como un nombre de bloque en tu aplicación.
    CakePHP usa este nombre para el contenido no capturado en vistas extendidas.

.. _view-blocks:

Usar bloques de vistas
======================

.. versionadded:: 2.1

Los bloques de vista reemplazan a ``$scripts_for_layout`` y proveen un API
flexible que permite definir los puestos o bloques en tus vistas/layouts
que serán definidos en otro lugar. Por ejemplo, los bloques son ideals para
implementar cosas como barras laterales o regiones que carguen recursos en
la parte superior o inferior del layout. Los bloques pueden ser definidos de
dos formas: usando captura de bloques o asignación directa. Los métodos
``start()``, ``append()`` and ``end`` permiten trabajar capturando bloques::

    // crear el bloque de la barra lateral
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Adjuntar la barra más tarde
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

También puedes adjuntar un bloque usando ``start()`` multiples veces. ``asign()``
también puede ser usado para quitar un bloque o sobreescribirlo en cualquier
momento::

    // Quita el contenido previo del bloque de la barra lateral.
    $this->assign('sidebar', '');


En la versión 2.3 unos métodos nuevos fueron añadidos para trabajar con
bloques. El método ``prepend()`` fue añadido para anteponerle contenido a un
bloque existente::

    // Anteponer a la barra lateral
    $this->prepend('sidebar', 'this content goes on top of sidebar');

El método ``startIfEmpty()`` puede ser usado para empezar un bloque **sólo**
si este está vacío o no definido. Si el bloque ya existe, el contenido
capturado será descartado. Esto es útil cuando se quiere definir condicionalmente
contenido predeterminado para un bloque si no existe todavía::

.. code-block:: php

    // En un archivo de vista.
    // Crear un bloque navbar
    $this->startIfEmpty('navbar');
    echo $this->element('navbar');
    echo $this->element('notifications');
    $this->end();

.. code-block:: php

    // En una vista/layout padre
    <?php $this->startIfEmpty('navbar'); ?>
    <p>If the block is not defined by now - show this instead</p>
    <?php $this->end(); ?>

    // Después en la vista/layout padre
    echo $this->fetch('navbar');

En el ejemplo de arriba, el bloque ``navbar`` sólo tendrá contenido si
es agregado después de la primera sección. Ya que el bloque está definido
en la vista hija, el contenido predeterminado con ``<p>`` será descartado.

.. versionadded: 2.3
    ``startIfEmpty()`` y ``prepend()`` fueron añandidos en la versión 2.3

.. note::

    Evita usar ``content`` como un nombre de bloque en tu aplicación.
    CakePHP usa este nombre para el contenido no capturado en vistas extendidas.

Desplegar bloques
-----------------

.. versionadded:: 2.1

Los bloques pueden ser desplegados con el método ``fetch()``. ``fetch()``
desplegará de forma segura, retornando '' si el bloque no existe::

    echo $this->fetch('sidebar');

``fetch()`` también puede ser usado para desplegar condicionalmente contenido
que debe envolver un bloque si este existe. Esto es útil en layouts o vistas
extendidas donde quieras mostrar condicionalmente encabezados u otro markup:

.. code-block:: php

    // en app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

A partir de la versión 2.3.0 también se puede proveer un valor predeterminado
para un bloque si este no tiene contenido. Esto permite añadir contenido
predeterminado a ser reemplazado para estados vacíos. Puedes proveer un valor
predeterminado usando el segundo argumento:

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?php echo $this->fetch('cart', 'Your cart is empty'); ?>
    </div>

.. versionchanged:: 2.3
    El argumento ``$default`` fue añadido en al versión 2.3.

Usar bloques para archivos de CSS o scripts
-------------------------------------------

.. versionadded:: 2.1

Los bloques reemplazan la variable desvalorizada ``$scripts_for_layout``.
Es recomendado usar bloques en su lugar. El :php:class:`HtmlHelper` se
enlaza con los bloques de vista y sus métodos :php:meth:`~HtmlHelper::script()`,
:php:meth:`~HtmlHelper::css()` y :php:meth:`~HtmlHelper::meta()` actualizan
a un bloque con el mismo nombre si se usan con la opción ``inline = false``:

.. code-block:: php

    <?php
    // en tu archivo de vista
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', array('inline' => false));
    ?>

    // En tu archivo de layout
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // el resto del layout continúa

:php:meth:`HtmlHelper` también permite controlar a que bloque van los scripts y CSS::

    // en tu vista
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // en tu layout
    echo $this->fetch('scriptBottom');

.. _view-layouts:

Layouts
=======

Un layout contiene el código de presentación que envuelve a la vista.
Todo lo que quieras ver en una vista debe ser puesto en un layout.

El layout predeterminado de CakePHP está localizado en ``/app/View/Layouts/default.ctp``.
Si quieres cambiar el aspecto general de la aplicación, este es el lugar
indicado para comenzar, ya que el código de la vista renderizada por el
controlador está colocado dentro del layout predeterminado cuando la página
es renderizada.

Otros archivos de layout deberán ser puestos en ``app/View/Layouts``.
Cuando creas un layout, necesitas decirle a CakePHP en dónde se deben
desplegar tus vistas. Para hacer esto, asegurate que tu layout incluya
en algún lugar ``$this->fetch('content')``. Un ejemplo de cómo se podría ver
un layout predeterminado:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $this->fetch('title'); ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Include external files and scripts here (See HTML helper for more info.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- Si deseas que menús aparezcan
   en todas las vistas, incluyelos aquí -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Aquí es donde quieres tus vistas desplegadas -->
   <?php echo $this->fetch('content'); ?>

   <!-- Añade un pie de página a todas las páginas -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    Antes de la versión 2.1, el método fetch() no estaba disponible, ``fetch('content')``
    es un reemplazo de ``$content_for_layout`` y las líneas ``fetch('meta')``,
    ``fetch('css')`` y ``fetch('script')`` están contenidas en la
    variable ``$scripts_for_layout`` en la versión 2.0

Los bloques ``script``, ``css`` y ``meta`` contienen todo el contenido definido
en las vistas usando un helper de HTML incluido. Útil para incluir
archivos de JavaScript y CSS de las vistas.

.. note::

    Cuando se usen :php:meth:`HtmlHelper::css()` o :php:meth:`HtmlHelper::script()`
    in archivos de vistas, especifica 'false' en la opción 'inline' para
    colocar la fuente de HTML en un bloque con el mismo nombre. (Ve el API
    para más detalles de uso).

El bloque ``content`` contiene los contenidos de la vista renderizada.

``$title_for_layout`` contiene el título de la página. Esta variable es
generada automaticamente, pero puede ser reasignar como cualquier otra
variable en tu controlador o vista.

.. note::

    La variable ``$title_for_layout`` estará depreciada a partir de
    la versión 2.5, usa ``$this->fetch('title')`` en tu layout y
    ``$this->assign('title', 'page title')`` en su lugar.

Puedes crear cuantos layouts quieras: sólo colócalas en el directorio
``app/View/Layouts`` y alterna entre ellas dentro de tus acciones de
controlador usando :php:attr:`~View::$layout` property::

    // desde un controlador
    public function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // desde un archivo de vista
    $this->layout = 'loggedin';

Por ejemplo, si una sección de un sitio incluye un espacio pequeño
para publicidad, se podría un nuevo layout con el pequeño espacio
publicitario y aplicarlo para todas las acciones del controlador
usando algo como esto::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //despliegue de imagen de usuario
       }
   }

CakePHP tiene dos layouts base (sin contar el layout predeterminado
de CakePHP) que puedes usar en tu propia aplicación: 'ajax' y 'flash'.
El layout Ajax es útil para generar respuestas AJAX, es un layout
vacío. (La mayoría de llamadas AJAX sólo requieren un poco de
markup en su retorno, en lugar de una interfaz completa.) El layout
de flash es usado por mensajes mostrados por el método :php:meth:`Controller::flash()`.

Otros tres layouts existen (xml, js y rss) existen en la base para
una forma rápida y fácil de generar contenido que no es texto o html.


Usar layouts desde los plugins
------------------------------

.. versionadded:: 2.1

Si quieres usar un layout que existe en un plugin, puedes usar
:term:`plugin syntax`. Por ejemplo, para usar el layout de contacto
desde el plugin Contacts::

    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }

.. _view-elements:

Elementos
=========

Muchas aplicaciones tienen pequeños bloques de código de presentación
que necesitan repetirse en varias páginas, a veces en distintos
lugares en el layout. CakePHP puede ayudarte a repetir las partes
de tu sitio web que necesitan reutilizarse. Estas partes reutilizables
son llamadas Elementos (Elements). Espacios publicitarios, de ayuda,
controles de navegación, menus adicionales, formularios de inicio
de sesión son generalmente implementados como elementos en CakePHP.
Un elemento es una vista miniatura que puede ser incluída en otras
vistas, en layouts o incluso otros elementos. Los elementos pueden
ser usados para hacer una vista más legible, colocando la renderización
de los elementos que se repiten en su propio archivo. También pueden
ayudarte a reutilizar fragmentos de contenido en tu aplicación.

Los elementos viven en el directorio ``/app/View/Elements``, y tienen
la extension .ctp. Son desplegados utilizando el método de elementos
de la vista::

    echo $this->element('helpbox');

Pasar variables a un elemento
---------------------------------

Puedes pasar datos a un elemento a través del segundo argumento
del elemento::

    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

Dentro del archivo del elemento estarán todas variables pasadas como
miembros del arreglo de parametros (de la misma forma que
:php:meth`Controller::set()` funciona en el controlador con los archivos
de vistas). En el ejemplo anterior el archivo ``/app/View/Elements/helpbox.ctp``
puede usar la variable ``$helptext`` variable::

    // dentro de app/View/Elements/helpbox.ctp
    echo $helptext; //despliega "Oh, this text is very helpful."

El método :php:meth:`View:element()` también soporta opciones para el elemento.
Las opciones suportadas son 'cache' y 'callbacks'. Un ejemplo::

    echo $this->element('helpbox', array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ),
        array(
            // usa la configuración de cache "long_view"
            "cache" => "long_view",
            // puesto en true para hacer llamadas a before/afterRender del elemento
            "callbacks" => true
        )
    );

El almacenamiento de los elementos es facilitado por la clase
:php:class:`Cache`. Se puede configurar que los elementos se almacenen
en cualquier Cache que se haya configurado. Esto te da una gran
flexibilidad para decidir dónde y por cuánto tiempo se almacenan los
elementos. Para almacenar distintas versiones del mismo elemento en
una aplicación debes proveer una llave única de cache usando el siguiente
formato::

    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'valor único')
        )
    );

Puedes tomar completa ventaja de los elementos al usar
``requestAction()``, el cual obtiene las variables de la
vista desde una acción de controlador y las retorna como
un arreglo. Esto le permite a tus elementos operar en la
forma pura del estilo MVC. Crea una acción de controlador
que prepare las variables de vista para tus elementos, luego
llama ``requestAction()`` dentro del segundo parametro de
``element()`` para alimentar al elemento las variables de
vista desde tu controlador.

Para hacer esto, en tu controlador, agrega algo similar a
lo siguiente para el ejemplo de Post::

    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            }
            $this->set('posts', $posts);
        }
    }

Y después en el elemento podemos acceder al modelo de publicaciones
paginado. Para obtener las últimas 5 publicaciones en una lista
ordenada tendríamos que hacer algo similar a lo siguiente:

.. code-block:: php

    <h2>Latest Posts</h2>
    <?php
      $posts = $this->requestAction(
        'posts/index/sort:created/direction:asc/limit:5'
      );
    ?>
    <ol>
    <?php foreach ($posts as $post): ?>
          <li><?php echo $post['Post']['title']; ?></li>
    <?php endforeach; ?>
    </ol>

Almacenar elementos
-------------------

Puedes tomar ventaja de el almacenamiento del almacenamiento de
vistas de CakePHP si provees un parametro de cache. Si se le
asigna true almacenará el elemento en el cache 'default'
(predeterminado) de la configuración. De lo contrario puedes
configurar cuál cache deberá usarse en la configuración. Ver
:doc:`/core-libraries/caching` para más información de cómo
configurar la clase :php:class:`Cache`. Un ejemplo simple de
almacenamiento un elemento sería así::

    echo $this->element('helpbox', array(), array('cache' => true));

Si renderizas un mismo elemento más de una vez en una vista y tienes
activado el almacenamiento, asegurate de asignarle a 'key' un valor
diferente cada vez. Esto prevendrá que cada llamada sobreescriba
el resultado anterior de las llamadas anteriores de element(). Por
ejemplo::

    echo $this->element(
        'helpbox',
        array('var' => $var),
        array('cache' => array('key' => 'primer_uso', 'config' => 'view_long')
    );

    echo $this->element(
        'helpbox',
        array('var' => $varDiferente),
        array('cache' => array('key' => 'segundo_uso', 'config' => 'view_long')
    );

Lo de arriba asegurará que los elementos se almacenen por separado. Si
quieres que todo almacenamiento use la misma configuración, puedes evitar
un poco de repetición usando :php:attr:`View::$elementCache` a la
configuración de cache que quieres usar. CakePHP usará esta configuración
cuando no se provea una.

Solicitar elementos de un plugin
--------------------------------

2.0
---

Para cargar un elemento de un plugin, usa la opción de `plugin` (movida fuera
la opción de `data` en la versión 1.x)::

    echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

Si estás usando algún plugin y deseas usar elementos dentro del plugin
simplemente utiliza :term:`plugin syntax`. Si la vista está siendo
renderizada por un controlador o acción de plugin, el nombre del plugin
será antepuesto automáticamente a todos los elementos usados, a menos que
otro nombre de un plugin esté presente. Si el elemento no existe en el
plugin, buscará en el directorio principal APP::

    echo $this->element('Contacts.helpbox');

Si tu vista es parte de un plugin, puedes omitir el nombre del plugin.
Por ejemplo, si estás en ``ContactsController`` del plugin de Contacts::

    echo $this->element('helpbox');
    // y
    echo $this->element('Contacts.helpbox');

son equivalentes y resultarán en que el mismo elemento cargue.

.. versionchanged:: 2.1
    La opción ``$options[plugin]`` fue depreciada y soporte para
    ``Plugin.element`` fue añadida.


Crear tus propias clases de vistas
==================================

Puede que necesites crear clases personalizadas para activar nuevos
tipos de datos o agregar lógica de renderización adicional a tu
aplicación. Como la mayoría de componentes de CakePHP, las clases
de vista tienen un par de estándares:

* Archivos de clases de vistas deben estar en ``App/View``. Por ejemplo:
  ``App/View/PdfView.php``
* Las clases deben tener el sufijo ``View``. Por ejemplo: ``PdfView``.
* Al hacer referencia a una vista, se debe omitir el sufijo ``View```. Por
  ejemplo: ``$this->viewClass = 'Pdf';``.

También deberás extender ``View`` para asegurar que las cosas funcionen bien::

    // en App/View/PdfView.php

    App::uses('View', 'View');
    class PdfView extends View {
        public function render($view = null, $layout = null) {
            // lógica personalizada aquí.
        }
    }

Reemplazar el método de renderizado te deja control total sobre cómo se
renderiza el contenido.

API de Vistas
=============

.. php:class:: View

Los métodos de vistas son accesibles en todos los archivos de vistas,
elementos y layouts. Para llamar a cualquier método usa ``$this->method()``

.. php:method:: set(string $var, mixed $value)

    Las vistas tienen un método ``set()`` que es análogo al ``set()``
    de los objetos "Controller". Usar set() desde el archivo de vista
    agregará variables al layout y elementos que serán renderizados
    después. Ver :ref:`controller-methods` para más información de
    cómo usar set().

    En tu archivo de vista puedes hacer::

        $this->set('activeMenuButton', 'posts');

    Luego, en tu layout, la variable ``$activeMenuButton`` estará
    disponible y contendrá el valor 'posts'.

.. php:method:: get(string $var, $default = null)

    Obtiene el valor de la viewVar con el nombre ``$var``.

    A partir de la versión 2.5 se puede proveer un valor predetermiando
    en caso de que la variable no tenga un valor asignado.

    .. versionchanged:: 2.5
        El argumento ``$default`` fue agregado en la versión 2.5.

.. php:method:: getVar(string $var)

    Obtiene el valor de la viewVar con el nombre ``$var``.

    .. deprecated:: 2.3
        Usa :php:meth:`View::get()` en su lugar.

.. php:method:: getVars()

    Obtiene una lista de todas las variables de vista en el alcance
    actual de renderizado. Retorna un arreglo de nombres de variables.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Renderiza un elemento o vista parcial. Ver la sección de
    :ref:`view-elements` para más información y ejemplos.

.. php:method:: uuid(string $object, mixed $url)

    Genera un ID de DOM no aleatorio para un objeto basándose en el
    tipo de objeto y URL. Este método es regularmente usado por helpers
    que necesitan generar IDs de DOM para elementos como la clase
    :php:class`JsHelper`::

        $uuid = $this->uuid(
          'form',
          array('controller' => 'posts', 'action' => 'index')
        );
        //$uuid contiene 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Agrega contenido al búfer interno de scripts. Este búfer está
    disponible en el layout como ``$scripts_for_layout``. Este método
    es útil cuando se crean helpers que necesiten agregarle javascript
    or CSS directamente al layout. No olvides que los scripts agregados
    desde el layout y elementos en el layout no serán añadidos a
    ``$scripts_for_layout``. Este método es usado generalmente desde
    helpers, como :doc:`/core-libraries/helpers/js` y
    :doc:`/core-libraries/helpers/html`.

    .. deprecated:: 2.1
        Usar :ref:`view-blocks` en su lugar.

.. php:method:: blocks

    Coloca los nombres de todos los bloques definidos en un arreglo.

.. php:method:: start($name)

    Empezar la captura de un bloque para un bloque de vista. Ver la
    sección de :ref:`view-blocks` para más detalles y ejemplos.

    .. versionadded:: 2.1

.. php:method:: end

    Terminar el bloque más recientemente abierto. Ver la sección
    de :ref:`view-blocks` para más detalles y ejemplos.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Añadir al final de bloques con ``$name``. Ver la sección de
    :ref:`view-blocks` para más detalles y ejemplos.

    .. versionadded:: 2.1

.. php:method:: prepend($name, $content)

    Anteponer a bloques con ``$name``. Ver la sección de
    :ref:`view-blocks` para más detalles y ejemplos.

    .. versionadded:: 2.3

.. php:method:: startIfEmpty($name)

    Empezar un bloque si está vacío. Todo el contenido del
    bloque será capturado y descartado si el bloque ya estaba
    definido.

    .. versionadded:: 2.3

.. php:method:: assign($name, $content)

    Asignar el valor a un bloque. Esto sobreescribirá cualquier contenido
    existente. Ver la sección de :ref:`view-blocks` para más detalles
    y ejemplos.

    .. versionadded:: 2.1

.. php:method:: fetch($name, $default = '')

    Obtener el valor de un bloque. Si un bloque está vacío o no definido,
    se retornará ''. Ver la sección de :ref:`view-blocks` para más detalles
    y ejemplos.

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Extender la vista, elemento o layout actual con la vista con este nombre.
    Ver la sección de :ref:`extending-views` para más detalles y ejemplos.

    .. versionadded:: 2.1

.. php:attr:: layout

    Asignar el layout que envolverá a la vista actual.

.. php:attr:: elementCache

    La configuración que se usa para almacenar elementos. Darle
    valor a esta propiedad cambiará el comportamiento predeterminado
    usado para almacenar elementos. Lo predeterminado puede ser
    modificado usando la opción 'cache' en el método del elemento.

.. php:attr:: request

    Una instancia de :php:class:`CakeRequest`. Usa esta instancia para
    acceder información acerca de la solicitud (request) actual.

.. php:attr:: output

    Contiene el último contenido renderizado de una vista, ya sea el
    archivo de vista o el contenido del layout.

    .. deprecated:: 2.1
        Usa ``$view->Blocks->get('content');`` en su lugar.

.. php:attr:: Blocks

    Una instancia de :php:class:`ViewBlock`. Usado para proporcionar la
    funcionalidad de bloque de vista en el renderizado de vista.

    .. versionadded:: 2.1

Más acerca de vistas
====================

.. toctree::
    :maxdepth: 1

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=es: Views
    :keywords lang=es: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
