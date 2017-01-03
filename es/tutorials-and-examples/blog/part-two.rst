Parte 2: Tutorial para desarrollar el Blog
##########################################

Creando un modelo para los artículos (*Post Model*)
===================================================

Los modelos son una parte fundamental en CakePHP. Cuando creamos un modelo,
podemos interactuar con la base de datos para crear, editar, ver y borrar con
facilidad cada ítem de ese modelo.

Los ficheros en los que se definen los modelos se ubican en la carpeta
``/app/Model``, y el fichero que vamos a crear debe guardarse en la ruta
``/app/Model/Post.php``. El contenido de este ficheró será::

    class Post extends AppModel {
            public $name = 'Post';
    }

Los convenios usados para los nombres son importantes. Cuando llamamos a nuestro
modelo *Post*, CakePHP deducirá automáticamente que este modelo se utilizará en
el controlador PostsController, y que se vinculará a una tabla en nuestra base de
datos llamada ``posts``.

.. note::

    CakePHP creará dinámicamente un objeto para el modelo si no encuentra el
    fichero correspondiente en /app/Model. Esto significa que si te equivocas al
    nombrar el fichero (por ejemplo lo llamas post.php con la primera p
    minúscula o posts.php en plural) CakePHP no va a reconocer la configuración
    que escribas en ese fichero y utilizará valores por defecto.

Para más información sobre modelos, como prefijos para las tablas, validación,
etc. puedes visitar :doc:`/models` en el Manual.


Crear un Controlador para nuestros Artículos (*Posts*)
======================================================

Vamos a crear ahora un controlador para nuestros artículos. En el controlador es
donde escribiremos el código para interactuar con nuestros artículos. Es donde
se utilizan los modelos para llevar a cabo el trabajo que queramos hacer con
nuestros artículos. Vamos a crear un nuevo fichero llamado
``PostsController.php`` dentro de la ruta ``/app/Controller``. El contenido de
este fichero será::

    class PostsController extends AppController {
        public $helpers = array('Html','Form');
    }

Y vamos a añadir una acción a nuestro nuevo controlador. Las acciones
representan una función concreta o interfaz en nuestra aplicación. Por ejemplo,
cuando los usuarios recuperan la url www.example.com/posts/index (que CakePHP
también asigna por defecto a la ruta www.example.com/posts/ ya que la acción por
defecto de cada controlador es index por convención) esperan ver un listado de
*posts*. El código para tal acción sería este:

::

    class PostsController extends AppController {
        public $helpers = array ('Html','Form');

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

Si examinamos el contenido de la función index() en detalle, podemos ver que
ahora los usuarios podrán acceder a la ruta www.example.com/posts/index. Además
si creáramos otra función llamada ``foobar()``, los usuarios podrían acceder a
ella en la url www.example.com/posts/foobar.

.. warning::

    Puede que tengas la tentación de llamar tus controladores y acciones de
    forma determinada para que esto afecte a la ruta final, y así puedas
    predeterminar estas rutas. No te preocupes por esto ya que CakePHP
    incorpora un potente sistema de configuración de rutas. Al escribir los
    ficheros, te recomendamos seguir las convenciones de nombres y ser
    claro. Luego podrás generar las rutas que te convengan utilizando el
    componente de rutas (*Route*).

La función index tiene sólo una instrucción ``set()`` que sirve para pasar
información desde el controlador a la vista (*view*) asociada. Luego crearemos
esta vista. Esta función set() asigna una nueva variab le 'posts' igual al valor
retornado por la función ``find('all')`` del modelo ``Post``. Nuestro modelo
Post está disponible automáticamente en el controlador y no hay que importarlo
ya que hemos usado las convenciones de nombres de CakePHP.

Para aprender más sobre los controladores, puedes visitar el capítulo
:doc:`/controllers`

Creando una vista para los artículos (*View*)
=============================================

Ya tenemos un modelo que define nuestros artículos y un controlador que ejecuta
alguna lógica sobre ese modelo y envía los datos recuperados a la vista. Ahora
vamos a crear una vista para la acción index().

Las vistas en CakePHP están orientadas a cómo se van a presentar los datos. Las
vistas encajan dentro de *layouts* o plantillas. Normalmente las vistas son una
mezcla de HTML y PHP, aunque pueden ser también XML, CSV o incluso datos
binarios.

Las plantillas (*layouts*) sirven para recubrir las vistas y reutilizar código.
Además pueden crearse tantos layouts como se deseen y se puede elegir cuál
utilizar en cada momento. Por el momento vamos a usar el la plantilla por
defecto ``default``.

¿ Recuerdas que el controlador envió a la vista una variable ``posts`` que
contiene todos los posts mediante el método set() ? Esto nos generará una
variable en la vista con esta pinta:

::

    // print_r($posts) output:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Las vistas en CakePHP se almacenan en la ruta ``/app/View`` y en un directorio
con el mismo nombre que el controlador al que pertenecen, en nuestro caso
*Posts*, así que para mostrar estos elementos formateados mediante una tabla
tendremos algo como esto:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'],
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Esto debería ser sencillo de comprender.

Como habrás notado, hay una llamada a un objeto ``$this->Html``. Este objeto es
una instancia de una clase *Helper* :php:class:`HtmlHelper`. CakePHP proporciona
un conjunto de *Helpers* para ayudarte a completar acciones habituales, como por
ejemplo realizar un link, crear un formulario, utilizar Javascript y Ajax de
forma sencilla, etc. Puedes aprender más sobre esto en :doc:`/views/helpers` en
otro momento. Basta con saber que la función ``link()`` generará un link HTML
con el título como primer parámetro y la URL como segundo parámetro.

Cuando crees URLs en CakePHP te recomendamos emplear el formato de array. Se
explica con detenimiento en la sección de *Routes*. Si utilizas estas rutas,
podrás aprovecharte de las potentes funcionalidades de generación inversa de
rutas de CakePHP en el futuro. Además puedes especificar rutas relativas a la
base de tu aplicación de la forma '/controlador/accion/param1/param2'.

Llegados a este punto, deberías poder ver esta página si escribes la ruta a tu
aplicación en el navegador, normalmente será algo asi
http://localhost/blog/posts/index. Deberías ver los posts correctamente
formateados en una tabla.

Verás que si pinchas sobre alguno de los enlaces que aparecen en esta página
(que van a una URL '/posts/view/some\_id', verás una página de error que te
indica que la acción ``view()`` no ha sido definida todavía, y que debes
definirla en el fichero PostsController. Si no ves ese error, algo ha ido mal,
ya que esa acción no está definida y debería mostrar la página de error
correspondiente. Cosa muy rara.
Creemos esta acción para evitar el error::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
        public $name = 'Posts';

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            $this->set('post', $this->Post->findById($id));
        }
    }

Si observas la función view(), ahora el método set() debería serte familiar.
Verás que estamos usando ``read()`` en vez de ``find('all')`` ya que sólo
queremos un post concreto.

Verás que nuestra función view toma un parámetro ($id), que es el ID del
artículo que queremos ver. Este parámetro se gestiona automáticamente al llamar
a la URL /posts/view/3, el valor '3' se pasa a la función view como primer
parámetro $id.

Vamos a definir la vista para esta nueva función, como hicimos antes para
index() salvo que el nombre ahora será ``/app/View/Posts/view.ctp``.

.. code-block:: php

    <!-- File: /app/View/Posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Verifica que ahora funciona el enlace que antes daba un error desde
``/posts/index`` o puedes ir manualmente si escribes ``/posts/view/1``.


Añadiendo artículos (*posts*)
=============================

Ya podemos leer de la base de datos nuestros artículos y mostrarlos en pantalla,
ahora vamos a ser capaces de crear nuevos artículos y guardarlos.

Lo primero, añadir una nueva acción ``add()`` en nuestro controlador PostsController:

::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Flash');
        public $components = array('Flash');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            $this->set('post', $this->Post->findById($id));
        }

        public function add() {
            if ($this->request->is('post')) {
                if ($this->Post->save($this->request->data)) {
                    $this->Flash->success('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }

.. note::

    Necesitas incluír el FlashComponent y FlashHelper en el controlador
    para poder utilizarlo. Si lo prefieres, puedes añadirlo en AppController
    y será compartido para todos los controladores que hereden de él.

Lo que la función add() hace es: si el formulario enviado no está vacío, intenta
guardar un nuevo artículo utilizando el modelo *Post*. Si no se guarda bien,
muestra la vista correspondiente, así podremos mostrar los errores de validación
si el artículo no se ha guardado correctamente.

Cuando un usuario utiliza un formulario y efectúa un POST a la aplicación, esta
información puedes accederla en ``$this->request->data``. Puedes usar la función
:php:func:`pr()` o :php:func:`debug()` para mostrar el contenido de esa variable
y ver la pinta que tiene.

Utilizamos el FlashComponent, concretamente el método
:php:meth:`FlashComponent::success()` para guardar el mensaje en la sesión y
poder recuperarlo posteriormente en la vista y mostrarlo al usuario, incluso
después de haber redirigido a otra página mediante el método redirect(). Esto se
realiza a través de la función :php:func:`FlashHelper::render()` que está en el
layout, que muestra el mensaje y lo borra de la sesión para que sólo se vea una
vez. El método :php:meth:`Controller::redirect <redirect>` del controlador nos
permite redirigir a otra página de nuestra aplicación, traduciendo el parámetro
``array('action' => 'index)`` a la URL /posts, y la acción index. Puedes consultar
la documentación de este método aquí :php:func:`Router::url()`. Verás los
diferentes modos de indicar la ruta que quieres construir.

Al llamar al método ``save()``, comprobará si hay errores de validación primero
y si encuentra alguno, no continuará con el proceso de guardado. Veremos a
continuación cómo trabajar con estos errores de validación.

Validando los datos
===================

CakePHP te ayuda a evitar la monotonía al construir tus formularios y su
validación. Todos odiamos teclear largos formularios y gastar más tiempo en
reglas de validación de cada campo. CakePHP está aquí para echarnos una mano.

Para aprovechar estas funciones es conveniente que utilices el FormHelper en tus
vistas. La clase :php:class:`FormHelper` está disponible en tus vistas por
defecto mediante llamadas del estilo ``$this->Form``.

Nuestra vista sería así

.. code-block:: php

    <!-- File: /app/View/Posts/add.ctp -->

    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>

Hemos usado FormHelper para generar la etiqueta 'form'. Esta llamada al
FormHelper :  ``$this->Form->create()`` generaría el siguiente código


.. code-block:: html

    <form id="PostAddForm" method="post" action="/posts/add">

Si ``create()`` no tiene parámetros al ser llamado, asume que estás creando un
formulario que realiza el *submit* al método del controlador ``add()`` o al
método ``edit()`` si hay un ``id`` en los datos del formulario. Por defecto el
formulario se enviará por POST.

Las llamadas ``$this->Form->input()`` se usan para crear los elementos del
formulario con el nombre que se pasa por parámetro. El primer parámetro indica
precisamente el nombre del campo del modelo para el que se quiere crear el
elemento de entrada. El segundo parámetro te permite definir muchas otras
variables sobre la forma en la que se generará este *input field*. Por ejemplo,
al enviar ``array('rows' => '3')`` estamos indicando el número de filas para el
campo textarea que vamos a generar. El método input() está dotado de
introspección y un poco de magia, ya que tiene en cuenta el tipo de datos del
modelo al generar cada campo.

Una vez creados los campos de entrada para nuestro modelo, la llamada
``$this->Form->end()`` genera un botón de *submit* en el formulario y cierra el
tag <form>. Puedes ver todos los detalles aquí :doc:`/views/helpers`.

Volvamos atrás un minuto para añadir un enlace en ``/app/View/Post/index.ctp``
que nos permita agregar nuevos artículos. Justo antes del tag <table> añade la
siguiente línea::

    echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add'));

Te estarás preguntando: ¿ Cómo le digo a CakePHP la forma en la que debe validar
estos datos ? Muy sencillo, las reglas de validación se escriben en el modelo.
Abre el modelo Post y vamos a escribir allí algunas reglas sencillas ::

    class Post extends AppModel {
        public $name = 'Post';

        public $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }

El array ``$validate`` contiene las reglas definidas para validar cada campo,
cada vez que se llama al método save(). En este caso vemos que la regla para
ambos campos es que no pueden ser vacíos ``notEmpty``. El conjunto de reglas de
validación de CakePHP es muy potente y variado. Podrás validar direcciones de
email, codificación de tarjetas de crédito, incluso añadir tus propias reglas de
validación personalizadas. Para más información sobre esto
:doc:`/models/data-validation`.

Ahora que ya tienes las reglas de validación definidas, usa tu aplicación para
crear un nuevo artículo con un título vacío y verás cómo funcionan. Como hemos
usado el método :php:meth:`FormHelper::input()`, los mensajes de error se
construyen automáticamente en la vista sin código adicional.

Editando Posts
==============

Seguro que ya le vas cogiendo el truco a esto. El método es siempre el mismo:
primero la acción en el controlador, luego la vista.
Aquí está el método edit():

::

	public function edit($id = null) {
	    if (!$id) {
	        throw new NotFoundException(__('Invalid post'));
	    }

	    $post = $this->Post->findById($id);
	    if (!$post) {
	        throw new NotFoundException(__('Invalid post'));
	    }

	    if ($this->request->is(array('post', 'put'))) {
	        $this->Post->id = $id;
	        if ($this->Post->save($this->request->data)) {
	            $this->Flash->success(__('Your post has been updated.'));
	            return $this->redirect(array('action' => 'index'));
	        }
	        $this->Flash->error(__('Unable to update your post.'));
	    }

	    if (!$this->request->data) {
	        $this->request->data = $post;
	    }
	}

Esta acción primero comprueba que se trata de un GET request. Si lo es, buscamos
un *Post* con el id proporcionado como parámetro y lo ponemos a disposición para
usarlo en la vista. Si la llamada no es GET, usaremos los datos que se envíen
por POST para intentar actualizar nuestro artículo. Si encontramos algún error
en estos datos, lo enviaremos a la vista sin guardar nada para que el usuario
pueda corregirlos.

La vista quedará así:

.. code-block:: php

    <!-- File: /app/View/Posts/edit.ctp -->

    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post', array('action' => 'edit'));
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden'));
        echo $this->Form->end('Save Post');

Mostramos el formulario de edición (con los valores actuales de ese artículo),
junto a los errores de validación que hubiese.

Una cosa importante, CakePHP asume que estás editando un modelo si su ``id``
está presente en su array de datos. Si no hay un 'id' presente, CakePHP asumirá
que es un nuevo elemento al llamar a la función ``save()``. Puedes actualizar un
poco tu vista 'index' para añadir los enlaces de edición de un artículo
específico:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp  (edit links added) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $this->Form->postLink(
                    'Delete',
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Are you sure?')
                )?>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Borrando Artículos
==================

Vamos a permitir a los usuarios que borren artículos. Primero, el método en
nuestro controlador:

::

    function delete($id) {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        if ($this->Post->delete($id)) {
            $this->Flash->success('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

Este método borra un artículo cuyo 'id' enviamos como parámetro y usa
``$this->Flash->success()`` para mostrar un mensaje si ha sido borrado. Luego
redirige a '/posts/index'. Si el usuario intenta borrar un artículo mediante una
llamada GET, generaremos una excepción. Las excepciónes que no se traten, serán
procesadas por CakePHP de forma genérica, mostrando una bonita página de error.
Hay muchas excepciones a tu disposición  :doc:`/development/exceptions` que
puedes usar para informar de diversos problemas típicos.

Como estamos ejecutando algunos métodos y luego redirigiendo a otra acción de
nuestro controlador, no es necesaria ninguna vista (nunca se usa). Lo que si
querrás es actualizar la vista index.ctp para incluír el ya habitual enlace:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
            <?php echo $this->Form->postLink(
                'Delete',
                array('action' => 'delete', $post['Post']['id']),
                array('confirm' => 'Are you sure?'));
            ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

.. note::

    Esta vista utiliza el FormHelper para pedir confirmación al usuario
    antes de borrar un artículo. Además el enlace para borrar el artículo se
    construye con Javascript para que se realice una llamada POST.

Rutas (*Routes*)
================

En muchas ocasiones, las rutas por defecto de CakePHP funcionan bien tal y como
están. Los desarroladores que quieren rutas diferentes para mejorar la
usabilidad apreciarán la forma en la que CakePHP relaciona las URLs con las
acciones de los controladores. Vamos a hacer cambios ligeros para este tutorial.

Para más información sobre las rutas, visita esta referencia
:ref:`routes-configuration`.

Por defecto CakePHP responde a las llamadas a la raíz de tu sitio (por ejemplo
www.example.com/) usando el controlador PagesController, y la acción
'display'/'home'. Esto muestra la página de bienvenida con información de
CakePHP que ya has visto. Vamos a cambiar esto mediante una nueva regla.

Las reglas de enrutamiento están en ``/app/Config/routes.php``. Comentaremos
primero la regla de la que hemos hablado:

::

    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));

Como habíamos dicho, esta regla conecta la URL '/' con el controlador 'pages' la
acción 'display' y le pasa como parámetro 'home', así que reemplazaremos esta
regla por esta otra:

::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

Ahora la URL '/' nos llevará al controlador 'posts' y la acción 'index'.

.. note::

    CakePHP también calcula las rutas a la inversa. Si en tu código pasas el
    array ``array('controller' => 'posts', 'action' => 'index')`` a una
    función que espera una url, el resultado será '/'. Es buena idea usar
    siempre arrays para configurar las URL, lo que asegura que los links
    irán siempre al mismo lugar.

Conclusión
==========

Creando aplicaciones de este modo te traerá paz, amor, dinero a carretas e
incluso te conseguirá lo demás que puedas querer. Así de simple.

Ten en cuenta que este tutorial es muy básico, CakePHP tiene *muchas* otras
cosas que harán tu vida más fácil, y es flexible aunque no hemos cubierto aquí
estos puntos para que te sea más simple al principio. Usa el resto de este
manual como una guía para construir mejores aplicaciones (recuerda todo los los
beneficios que hemos mencionado un poco más arriba)


Ahora ya estás preparado para la acción. Empieza tu propio proyecto, lee el
resto del manual y el API `Manual </>`_ `API <http://api.cakephp.org/2.8/>`_.

Lectura sugerida para continuar desde aquí
==========================================

1. :ref:`view-layouts`: Personaliza la plantilla *layout* de tu aplicación
2. :ref:`view-elements` Incluír vistas y reutilizar trozos de código
3. :doc:`/controllers/scaffolding`: Prototipos antes de trabajar en el código final
4. :doc:`/console-and-shells/code-generation-with-bake` Generación básica de CRUDs
5. :doc:`/core-libraries/components/authentication`: Gestión de usuarios y permisos
