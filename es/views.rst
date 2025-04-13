Vistas
######

.. php:namespace:: Cake\View

.. php:class:: View

Las vistas son la **V** en MVC. Son responsables de generar la salida específica requerida para la solicitud. A menudo, esto se hace en forma de HTML, XML o JSON, pero también es responsabilidad de la Capa de Vistas transmitir archivos y crear PDFs que los usuarios puedan descargar.

CakePHP viene con algunas clases de Vista incorporadas para manejar los escenarios de renderizado más comunes:

- Para crear servicios web XML o JSON, puedes usar los :doc:`views/json-and-xml-views`.
- Para servir archivos protegidos o archivos generados dinámicamente, puedes usar :ref:`cake-response-file`.
- Para crear vistas con varios temas, puedes usar :doc:`views/themes`.

.. _app-view:

La Vista de la Aplicación
=========================

``AppView`` es la clase de Vista predeterminada de tu aplicación. ``AppView`` en sí misma extiende la clase ``Cake\View\View`` incluida en CakePHP y está definida en **src/View/AppView.php** de la siguiente manera:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }

Puedes usar tu ``AppView`` para cargar ayudantes que se utilizarán en cada vista renderizada en tu aplicación. CakePHP proporciona un método ``initialize()`` que se invoca al final del constructor de una Vista para este tipo de uso:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
        public function initialize(): void
        {
            // Always enable the MyUtils Helper
            $this->addHelper('MyUtils');
        }
    }

.. _view-templates:

Plantillas de Vista
===================

La capa de vista de CakePHP es la forma en que te comunicas con tus usuarios. La mayor parte del tiempo, tus vistas estarán renderizando documentos HTML/XHTML para los navegadores, pero también podrías necesitar responder a una aplicación remota a través de JSON o generar un archivo CSV para un usuario.

Los archivos de plantilla de CakePHP son archivos PHP regulares y utilizan la `sintaxis PHP alternativa <https://php.net/manual/en/control-structures.alternative-syntax.php>`_ para las estructuras de control y la salida. Estos archivos contienen la lógica necesaria para preparar los datos recibidos del controlador en un formato de presentación que está listo para tu audiencia.

Alternativas de impresion
-------------------------

Puedes imprimir o mostrar una variable en tu plantilla de la siguiente manera::

  <?php echo $variable; ?>

Utilizando soporte para etiquetas cortas::

  <?= $variable ?>

Estructuras de Control Alternativas
-----------------------------------

Las estructuras de control, como ``if``, ``for``, ``foreach``, ``switch`` y ``while``, pueden escribirse en un formato simplificado. Observa que no hay llaves. En su lugar, la llave de cierre para el ``foreach`` se reemplaza con ``endforeach``. Cada una de las estructuras de control mencionadas anteriormente tiene una sintaxis de cierre similar: ``endif``, ``endfor``, ``endforeach`` y ``endwhile``. También observa que en lugar de usar un ``punto y coma`` después de cada estructura (excepto la última), hay dos puntos ``:``.

El siguiente es un ejemplo utilizando ``foreach``:


.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

Otro ejemplo, usando if/elseif/else. Observa los dos puntos:

.. code-block:: php

  <?php if ($username === 'sally'): ?>
     <h3>Hi Sally</h3>
  <?php elseif ($username === 'joe'): ?>
     <h3>Hi Joe</h3>
  <?php else: ?>
     <h3>Hi unknown user</h3>
  <?php endif; ?>

Si prefieres utilizar un lenguaje de plantillas como
`Twig <https://twig.symfony.com>`_, una subclase de View facilitará la conexión
entre tu lenguaje de plantillas y CakePHP.

Los archivos de plantilla se almacenan en **templates/**, en una carpeta nombrada según el
controlador que utiliza los archivos y el nombre de la acción a la que corresponde.
Por ejemplo, el archivo de vista para la acción ``view()`` del controlador ``Products``, normalmente se encontraría en **templates/Products/view.php**.

La capa de vista en CakePHP puede estar compuesta por varias partes diferentes. Cada
parte tiene usos distintos y se cubrirán en este capítulo:

- **templates**: Las plantillas son la parte de la página que es única para la acción
  que se está ejecutando. Constituyen el contenido principal de la respuesta de tu aplicación.
- **elements**: pequeños fragmentos de código de vista reutilizables. Por lo general, los elementos se renderizan
  dentro de las vistas.
- **layouts**: archivos de plantilla que contienen código de presentación que envuelve muchas
  interfaces en tu aplicación. La mayoría de las vistas se renderizan dentro de un diseño.
- **helpers**: estas clases encapsulan la lógica de la vista que se necesita en muchos
  lugares en la capa de vista. Entre otras cosas, los helpers en CakePHP pueden ayudarte a
  construir formularios, funcionalidades AJAX, paginar datos de modelos o servir feeds RSS.
- **cells**: estas clases proporcionan características similares a un controlador para
  crear componentes de interfaz de usuario autosuficientes. Consulta la :doc:`/views/cells`
  documentación para obtener más información.

Variables de Vista
------------------

Cualquier variable que establezcas en tu controlador con ``set()`` estará disponible tanto en la vista como en el diseño que tu acción renderiza. Además, cualquier variable establecida también estará disponible en cualquier elemento. Si necesitas pasar variables adicionales desde la vista al diseño, puedes llamar a ``set()`` en la plantilla de vista o utilizar :ref:`Bloques de Vista <view-blocks>`.

Debes recordar **siempre** escapar cualquier dato del usuario antes de mostrarlo, ya que CakePHP no escapa automáticamente la salida. Puedes escapar el contenido del usuario con la función ``h()``::"

    <?= h($user->bio); ?>

Estableciendo Variables de Vista
--------------------------------

.. php:method:: set(string $var, mixed $value)

Las vistas tienen un método ``set()`` que es análogo al ``set()`` que se encuentra en
los objetos del Controlador. Utilizar ``set()`` desde tu archivo de vista agregará las variables al
diseño y a los elementos que se renderizarán más adelante. Consulta
:ref:`setting-view_variables` para obtener más información sobre el uso de ``set()``.

En tu archivo de vista puedes hacer::

    $this->set('activeMenuButton', 'posts');

Entonces, en tu diseño, la variable ``$activeMenuButton`` estará disponible y
contendrá el valor 'posts'."

.. _extendiendo-vistas:

Extendiendo Vistas
------------------

La extensión de vistas te permite envolver una vista dentro de otra. Combinar esto con los
:ref:`bloques de vista <view-blocks>` te brinda una forma poderosa de mantener tus vistas
:term:`DRY` (Don't Repeat Yourself o No te repitas). Por ejemplo, tu aplicación tiene una barra lateral que necesita cambiar
según la vista específica que se está renderizando. Al extender un archivo de vista común,
puedes evitar repetir el marcado común para tu barra lateral y solo definir las partes que cambian:

.. code-block:: php

    <!-- templates/Common/view.php -->
    <h1><?= h($this->fetch('title')) ?></h1>
    <?= $this->fetch('content') ?>

    <div class="actions">
        <h3>Acciones relacionadas</h3>
        <ul>
        <?= $this->fetch('sidebar') ?>
        </ul>
    </div>

El archivo de vista anterior podría ser utilizado como una vista principal. Espera que la vista
que lo extiende definirá los bloques ``sidebar`` y ``title``. El bloque ``content``
es un bloque especial que CakePHP crea. Contendrá todo el contenido no capturado de la vista que lo extiende. Suponiendo que nuestro archivo de vista tiene una variable ``$post`` con los datos de nuestra publicación, la vista podría verse así:

.. code-block:: php

    <!-- templates/Posts/view.php -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post->title);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', [
        'action' => 'edit',
        $post->id,
    ]);
    ?>
    </li>
    <?php $this->end(); ?>

    // The remaining content will be available as the 'content' block
    // In the parent view.
    <?= h($post->body) ?>

La vista de la publicación anterior muestra cómo puedes extender una vista y llenar un conjunto de bloques. Cualquier contenido que no esté ya definido en un bloque será capturado y colocado en un bloque especial llamado ``content``. Cuando una vista contiene una llamada a ``extend()``, la ejecución continúa hasta el final del archivo de vista actual. Una vez que se completa, se renderizará la vista extendida. Llamar a ``extend()`` más de una vez en un archivo de vista anulará la vista principal que se procesará a continuación::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

Lo anterior hará que **/Common/index.php** se renderice como la vista principal para la vista actual.

Puedes anidar vistas extendidas tantas veces como sea necesario. Cada vista puede extender otra vista si así lo deseas. Cada vista principal obtendrá el contenido de la vista anterior como el bloque ``content``.

.. nota::

    Debes evitar usar ``content`` como nombre de bloque en tu aplicación.
    CakePHP lo utiliza para el contenido no capturado en vistas extendidas.

Extendiendo Layouts
===================

Al igual que las vistas, los layouts también pueden ser extendidos. Al igual que con las vistas, se utiliza ``extend()``
para extender los layouts. Las extensiones de layouts pueden actualizar o reemplazar bloques y actualizar o
reemplazar el contenido renderizado por el layout secundario. Por ejemplo, si quisiéramos
envolver un bloque con un marcado adicional, podríamos hacer lo siguiente::

    // Nuestro layout extiende el layout de la aplicación.
    $this->extend('application');
    $this->prepend('content', '<main class="nosidebar">');
    $this->append('content', '</main>');

    // Generar más marcado.

    // Recuerda imprimir el contenido del layout anterior.
    echo $this->fetch('content');

.. _view-blocks:

Uso de Bloques de Vista
=======================

Los bloques de vista proporcionan una API flexible que te permite definir ranuras o bloques en
tus vistas/diseños que se definirán en otro lugar. Por ejemplo, los bloques son ideales
para implementar cosas como barras laterales o regiones para cargar activos en la parte inferior o superior del diseño. Los bloques se pueden definir de dos maneras: como un
bloque capturador o mediante asignación directa. Los métodos ``start()``, ``append()``,
``prepend()``, ``assign()``, ``fetch()``, y ``end()`` te permiten
trabajar con bloques capturadores::

    // Crear el bloque de la barra lateral.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();

    // Anexar contenido al bloque de la barra lateral más adelante.
    $this->start('sidebar');
    echo $this->fetch('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

También puedes añadir contenido a un bloque usando ``append()``::

    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

    // Lo mismo que el ejemplo anterior.
    $this->append('sidebar', $this->element('sidebar/popular_topics'));

Si necesitas borrar u sobrescribir un bloque, hay un par de alternativas.
El método ``reset()`` eliminará o sobrescribirá un bloque en cualquier momento. El
método ``assign()`` con una cadena de contenido vacía también se puede utilizar para borrar el
bloque especificado.::

    // Limpiar el contenido anterior del bloque de la barra lateral.
    $this->reset('sidebar');

    // Asignar una cadena vacía también borrará el bloque de la barra lateral.
    $this->assign('sidebar', '');

Asignar el contenido de un bloque a menudo es útil cuando deseas convertir una variable de vista
en un bloque. Por ejemplo, es posible que desees usar un bloque para el título de la página y, a veces, asignar el título como una variable de vista en el controlador::

    // En el archivo de vista o diseño, arriba de $this->fetch('title')
    $this->assign('title', $title);

El método ``prepend()`` te permite agregar contenido al principio de un bloque existente::

    // Agregar al principio de la barra lateral
    $this->prepend('sidebar', 'este contenido va en la parte superior de la barra lateral');

Mostrar Bloques
---------------

Puedes mostrar bloques usando el método ``fetch()``. ``fetch()`` mostrará un
bloque, devolviendo '' si un bloque no existe::

    <?= $this->fetch('sidebar') ?>

También puedes usar ``fetch()`` para mostrar condicionalmente contenido que debería rodear a un
bloque si existe. Esto es útil en diseños o vistas extendidas donde
quieres mostrar condicionalmente encabezados u otro marcado:

.. code-block:: php

    // En templates/layout/default.php
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Opciones de Menú</h3>
        <?= $this->fetch('menu') ?>
    </div>
    <?php endif; ?>

También puedes proporcionar un valor predeterminado para un bloque si no existe.
Esto te permite agregar contenido de marcador de posición cuando un bloque no existe.
Puedes proporcionar un valor predeterminado usando el segundo argumento:

.. code-block:: php

    <div class="carrito-de-compras">
        <h3>Tu Carrito</h3>
        <?= $this->fetch('carrito', 'Tu carrito está vacío') ?>
    </div>

Usando Bloques para Archivos de Scripts y CSS
---------------------------------------------

El `HtmlHelper` se integra con bloques de vista, y sus métodos `script()`, `css()`, y `meta()` actualizan un bloque con el mismo nombre cuando se usan con la opción `block = true`:

.. code-block:: php

    <?php
    // En tu archivo de vista
    $this->Html->script('carousel', ['block' => true]);
    $this->Html->css('carousel', ['block' => true]);
    ?>

    // En tu archivo de diseño.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?= h($this->fetch('title')) ?></title>
        <?= $this->fetch('script') ?>
        <?= $this->fetch('css') ?>
        </head>
        // El resto del diseño sigue

El :php:class:`~Cake\\View\\Helper\\HtmlHelper` también te permite controlar a qué bloque van los scripts y el CSS::

    // En tu vista
    $this->Html->script('carousel', ['block' => 'scriptBottom']);

    // En tu diseño
    <?= $this->fetch('scriptBottom') ?>

.. _view-layouts:

Layouts
=======

Un layout contiene código de presentación que envuelve una vista. Todo lo que desees
ver en todas tus vistas debe colocarse en un layout.

El layout predeterminado de CakePHP se encuentra en **templates/layout/default.php**.
Si deseas cambiar el aspecto general de tu aplicación, este es el
lugar correcto para comenzar, porque el código de vista renderizado por el controlador se coloca dentro del layout predeterminado cuando se renderiza la página.

Otros archivos de layout deben colocarse en **templates/layout**. Cuando creas
un layout, necesitas decirle a CakePHP dónde colocar la salida de tus vistas. Para
hacerlo, asegúrate de que tu layout incluye un lugar para ``$this->fetch('content')``.
Aquí tienes un ejemplo de cómo podría verse un layout predeterminado:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="es">
   <head>
   <title><?= h($this->fetch('title')) ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Incluye archivos externos y scripts aquí (Consulta el ayudante HTML para obtener más información.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- Si deseas que aparezca algún tipo de menú en
   todas tus vistas, inclúyelo aquí -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Aquí es donde quiero que se muestren mis vistas -->
   <?= $this->fetch('content') ?>

   <!-- Agrega un pie de página a cada página mostrada -->
   <div id="footer">...</div>

   </body>
   </html>

Los bloques ``script``, ``css`` y ``meta`` contienen cualquier contenido definido en las
vistas usando el ayudante HTML incorporado. Útil para incluir archivos JavaScript y CSS
desde vistas.

.. nota::

    Al usar ``HtmlHelper::css()`` o ``HtmlHelper::script()`` en archivos de plantilla,
    especifica ``'block' => true`` para colocar la fuente HTML en un bloque con
    el mismo nombre. (Consulta la API para obtener más detalles sobre el uso).

El bloque ``content`` contiene el contenido de la vista renderizada.

Puedes establecer el contenido del bloque ``title`` desde dentro de tu archivo de vista::

    $this->assign('title', 'Ver Usuarios Activos');

Los valores vacíos para el bloque ``title`` se reemplazarán automáticamente con
una representación de la ruta de la plantilla actual, como ``'Admin/Artículos'``.

Puedes crear tantos layouts como desees: solo colócalos en el directorio
**templates/layout**, y alterna entre ellos dentro de tus
acciones del controlador usando la propiedad ``$layout`` del controlador o la vista::

    // Desde un controlador
    public function vista()
    {
        // Establecer el diseño.
        $this->viewBuilder()->setLayout('admin');
    }

    // Desde un archivo de vista
    $this->layout = 'registrado';

Por ejemplo, si una sección de mi sitio incluyera un espacio para un banner publicitario más pequeño, podría
crear un nuevo layout con el espacio publicitario más pequeño y especificarlo como el
layout para todas las acciones de los controladores usando algo como::

    namespace App\Controller;

    class UsuariosController extends AppController
    {
        public function verActivos()
        {
            $this->set('title', 'Ver Usuarios Activos');
            $this->viewBuilder()->setLayout('default_small_ad');
        }

        public function verImagen()
        {
            $this->viewBuilder()->setLayout('imagen');

            // Mostrar imagen del usuario
        }
    }

Además de un layout predeterminado, la aplicación de esqueleto oficial de CakePHP también tiene un layout 'ajax'.
El layout Ajax es útil para crear respuestas AJAX; es un diseño vacío.
(La mayoría de las llamadas AJAX solo requieren un poco de marcado como respuesta, en lugar de una
interfaz completamente renderizada).

La aplicación de esqueleto también tiene un diseño predeterminado para ayudar a generar RSS.

Usando Layouts desde Plugins
----------------------------

Si deseas usar un layout que existe en un plugin, puedes utilizar la :term:`sintaxis de plugin`. Por ejemplo, para usar el diseño de contacto del plugin Contacts::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function verActivos()
        {
            $this->viewBuilder()->setLayout('Contacts.contact');
        }
    }

.. _view-elements:

Elementos
=========

.. php:method:: element(string $elementPath, array $data, array $options = [])

Muchas aplicaciones tienen pequeños bloques de código de presentación que deben
repetirse de una página a otra, a veces en diferentes lugares en el diseño. CakePHP
puede ayudarte a repetir partes de tu sitio web que necesitan ser reutilizadas. Estas partes reutilizables
se llaman Elementos. Los anuncios, los cuadros de ayuda, los controles de navegación, los menús adicionales,
los formularios de inicio de sesión y las llamadas a la acción a menudo se implementan en CakePHP como elementos. Un
elemento es básicamente una mini-vista que se puede incluir en otras vistas, en
diseños e incluso dentro de otros elementos. Los elementos se pueden usar para hacer que una vista
sea más legible, colocando la representación de elementos repetidos en su propio archivo. También
te pueden ayudar a reutilizar fragmentos de contenido en tu aplicación.

Los elementos se encuentran en la carpeta **templates/element/** y tienen la extensión de archivo .php.
Se generan utilizando el método element de la vista::

    echo $this->element('helpbox');

Pasar Variables a un Elemento
-----------------------------

Puedes pasar datos a un elemento a través del segundo argumento del elemento::

    echo $this->element('helpbox', [
        'helptext' => 'Oh, este texto es muy útil.',
    ]);

Dentro del archivo del elemento, todas las variables pasadas están disponibles como miembros del
array de parámetros (de la misma manera que ``Controller::set()`` en el
controlador funciona con los archivos de plantilla). En el ejemplo anterior, el
archivo **templates/element/helpbox.php** puede usar la variable ``$helptext``::

    // Dentro de templates/element/helpbox.php
    echo $helptext; // Muestra `Oh, este texto es muy útil.`

Ten en cuenta que en esas variables de vista se fusionan con las variables de vista desde la vista
en sí misma. Entonces, todas las variables de vista establecidas usando ``Controller::set()`` en el controlador y
``View::set()`` en la vista en sí también están disponibles dentro del elemento.

El método ``View::element()`` también admite opciones para el elemento.
Las opciones admitidas son 'cache' y 'callbacks'. Un ejemplo::

    echo $this->element('helpbox', [
            'helptext' => "Esto se pasa al elemento como $helptext",
            'foobar' => "Esto se pasa al elemento como $foobar",
        ],
        [
            // utiliza la configuración de caché `long_view`
            'cache' => 'long_view',
            // establece en true para que se llame a before/afterRender para el elemento
            'callbacks' => true,
        ]
    );

El almacenamiento en caché del elemento se facilita a través de la clase ``Cache``. Puedes configurar
elementos para que se almacenen en cualquier configuración de caché que hayas establecido. Esto te brinda
una gran cantidad de flexibilidad para decidir dónde y por cuánto tiempo se almacenan los elementos.
Para almacenar en caché diferentes versiones del mismo elemento en una aplicación,
proporciona un valor de clave de caché único usando el siguiente formato::

    $this->element('helpbox', [], [
            'cache' => ['config' => 'short', 'key' => 'valor único'],
        ]
    );

Si necesitas más lógica en tu elemento, como datos dinámicos de una fuente de datos,
considera usar un View Cell en lugar de un elemento. Descubre más :doc:`sobre View
Cells </views/cells>`.

Almacenamiento en Caché de Elementos
------------------------------------

Puedes aprovechar el almacenamiento en caché de CakePHP si proporcionas un parámetro de caché.
Si se establece en ``true``, almacenará en caché el elemento en la configuración de Caché 'default'.
De lo contrario, puedes establecer qué configuración de caché se debe utilizar.
Consulta :doc:`/core-libraries/caching` para obtener más información sobre cómo configurar
``Cache``. Un ejemplo simple de cómo almacenar en caché un elemento sería::

    echo $this->element('helpbox', [], ['cache' => true]);

Si renderizas el mismo elemento más de una vez en una vista y tienes el almacenamiento en caché
habilitado, asegúrate de establecer el parámetro 'key' con un nombre diferente cada vez. Esto
evitará que cada llamada sucesiva sobrescriba el resultado en caché de la llamada anterior a ``element()``.
Por ejemplo::

    echo $this->element(
        'helpbox',
        ['var' => $var],
        ['cache' => ['key' => 'primer_uso', 'config' => 'view_long']]
    );

    echo $this->element(
        'helpbox',
        ['var' => $otraVar],
        ['cache' => ['key' => 'segundo_uso', 'config' => 'view_long']]
    );

Lo anterior asegurará que ambos resultados del elemento se almacenen en caché por separado. Si deseas que todos los elementos en caché utilicen la misma configuración de caché, puedes evitar algo de repetición configurando ``View::$elementCache`` con la configuración de caché que deseas utilizar. CakePHP utilizará esta configuración cuando no se proporcione ninguna.

Solicitando Elementos desde un Plugin
-------------------------------------

Si estás usando un plugin y deseas utilizar elementos desde dentro del plugin, simplemente
usa la conocida :term:`sintaxis de plugin`. Si la vista se está renderizando para un
controlador/acción del plugin, el nombre del plugin se agregará automáticamente
a todos los elementos utilizados, a menos que haya otro nombre de plugin presente.
Si el elemento no existe en el plugin, buscará en la carpeta principal de la APLICACIÓN
(APP)::

    echo $this->element('Contacts.helpbox');

Si tu vista es parte de un plugin, puedes omitir el nombre del plugin. Por ejemplo,
si estás en el ``ContactsController`` del plugin Contacts, lo siguiente::

    echo $this->element('helpbox');
    // y
    echo $this->element('Contacts.helpbox');

son equivalentes y darán como resultado que se renderice el mismo elemento.

Para elementos dentro de una subcarpeta de un plugin
(por ejemplo, **plugins/Contacts/Template/element/sidebar/helpbox.php**), usa el
siguiente formato::

    echo $this->element('Contacts.sidebar/helpbox');

Prefijo de Enrutamiento y Elementos
-----------------------------------

Si tienes un prefijo de enrutamiento configurado, la resolución de la ruta del Elemento puede cambiar
a una ubicación con prefijo, como sucede con los Diseños (Layouts) y la Vista de acción.
Supongamos que tienes configurado un prefijo "Admin" y llamas a::

    echo $this->element('mi_elemento');

El elemento se buscará primero en **templates/Admin/element/**. Si dicho archivo no existe,
se buscará en la ubicación predeterminada.

Almacenamiento en Caché de Secciones de tu Vista
------------------------------------------------

.. php:method:: cache(callable $block, array $options = [])

A veces, generar una sección de la salida de tu vista puede ser costoso debido a
:doc:`/views/cells` renderizados u operaciones de ayuda costosas. Para ayudar a que tu
aplicación se ejecute más rápido, CakePHP proporciona una forma de almacenar en caché secciones de vista::

    // Suponiendo algunas variables locales
    echo $this->cache(function () use ($usuario, $articulo) {
        echo $this->cell('PerfilUsuario', [$usuario]);
        echo $this->cell('ArticuloCompleto', [$articulo]);
    }, ['key' => 'mi_clave_de_vista']);

Por defecto, el contenido de la vista almacenado en caché se guardará en la configuración de caché ``View::$elementCache``,
pero puedes usar la opción ``config`` para cambiar esto.

Eventos de Vista
================

Al igual que los Controladores, la vista activa varios eventos o llamadas de retorno (callbacks) que puedes utilizar para
insertar lógica alrededor del ciclo de vida de renderización:

Lista de Eventos
----------------

* ``View.beforeRender``
* ``View.beforeRenderFile``
* ``View.afterRenderFile``
* ``View.afterRender``
* ``View.beforeLayout``
* ``View.afterLayout``

Puedes adjuntar :doc:`escuchadores de eventos de la aplicación </core-libraries/events>` a
estos eventos o utilizar :ref:`Llamadas de Retorno de Ayudantes (Helper Callbacks) <helper-api>`.

Creando tus Propias Clases de Vista
===================================

Puede que necesites crear clases de vista personalizadas para habilitar nuevos tipos de vistas de datos o
agregar lógica de renderización de vista personalizada adicional a tu aplicación. Como la mayoría de
componentes de CakePHP, las clases de vista tienen algunas convenciones:

* Los archivos de clases de vista deben colocarse en **src/View**. Por ejemplo:
  **src/View/PdfView.php**
* Las clases de vista deben tener el sufijo ``View``. Por ejemplo: ``PdfView``.
* Al referenciar nombres de clases de vista, deberías omitir el sufijo ``View``. Por ejemplo: ``$this->viewBuilder()->setClassName('Pdf');``.

También querrás extender ``View`` para asegurar que las cosas funcionen correctamente::

    // En src/View/PdfView.php
    namespace App\View;

    use Cake\View\View;

    class PdfView extends View
    {
        public function render($view = null, $layout = null)
        {
            // Lógica personalizada aquí.
        }
    }

Reemplazar el método render te permite tener control total sobre cómo se renderiza tu contenido.

Más acerca de Vistas
====================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers

.. meta::
    :title lang=es: Views
    :keywords lang=es: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
