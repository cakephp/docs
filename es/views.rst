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

``fetch()`` también puede ser usado para desplegar condicionalmente ontenido que debe envolver un bloque si este existe. Esto es útil en layouts o vistas
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

    La variable ``$title_for_layout`` estará deperciada a partir de
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

.. note::
    La documentación no es compatible actualmente con el idioma español en esta página.

    Por favor, siéntase libre de enviarnos un pull request en
    `Github <https://github.com/cakephp/docs>`_ o utilizar el botón **Improve this Doc** para proponer directamente los cambios.

    Usted puede hacer referencia a la versión en Inglés en el menú de selección superior
    para obtener información sobre el tema de esta página.

.. toctree::
    :maxdepth: 1

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers

.. meta::
    :title lang=es: Views
    :keywords lang=es: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
