Tutorial de desarrollo del Blog - Añadiendo una capa
####################################################

Crear un modelo Artículo (``Article``)
======================================

Los modelos son una parte fundamental en CakePHP. Cuando creamos un modelo,
podemos interactuar con la base de datos para crear, editar, ver y borrar con
facilidad cada ítem de ese modelo.

Los modelos están separados entre los objetos ``Tabla`` (``Table``) y ``Entidad``
(``Entity``). Los objetos ``Tabla`` proporcionan acceso a la coleción de
entidades almacenada en una tabla específica y va en ``/src/Model/Table``. El
fichero que crearemos se guardará en ``/src/Model/Table/ArticlesTable.php``. El
fichero completo debería tener este aspecto::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }
    }

Los convenios usados para los nombres son importantes. Llamando a nuestro objeto
Tabla ``ArticlesTable``, CakePHP deducirá automáticamente que esta Tabla será
utilizada en el controlador ArticlesController, y que se vinculará a una tabla
en nuestra base de datos llamada ``articles``.

.. note::

    CakePHP creará dinámicamente un objeto para el modelo si no encuentra el
    fichero correspondiente en /src/Model/Table. Esto significa que si te
    equivocas al nombrar el fichero (por ejemplo lo llamas articlestable.php —en
    minúscula— o ArticleTable.php —en singular) CakePHP no va a reconocer la
    configuración que escribas en ese fichero y utilizará valores por defecto.

Para más información sobre modelos, como callbacks y validaciones echa un vistazo
al capítulo del Manual :doc:`/orm`.


Crear el Controlador de Artículos (``Articles Controller``)
===========================================================

Vamos a crear ahora un controlador para nuestros artículos. En el controlador es
donde escribiremos el código para interactuar con nuestros artículos. Es donde
se utilizan los modelos para llevar a cabo el trabajo que queramos hacer con
nuestros artículos. Vamos a crear un nuevo fichero llamado
``ArticlesController.php`` dentro del directorio ``/src/Controller``. A
continuación puedes ver el aspecto básico que debería tener este controlador::

    namespace App\Controller;

    class ArticlesController extends AppController {
    }

Vamos a añadir una acción a nuestro nuevo controlador. Las acciones representan
una función concreta o interfaz en nuestra aplicación. Por ejemplo,
cuando los usuarios recuperan la url www.example.com/articles/index (que es lo
mismo que www.example.com/articles/) esperan ver un listado de artículos. El
código para tal acción sería este::

    namespace App\Controller;

    class ArticlesController extends AppController {

        public function index() {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }


Por el hecho de haber definido el método ``index()`` en nuestro
ArticlesController, los usuarios ahora pueden acceder a su lógica solicitando
www.example.com/articles/index. Del mismo modo, si definimos un método llamado
``foobar()`` los usuarios tendrán acceso a él desde
www.example.com/articles/foobar.

.. warning::

    Puede que tengas la tentación de llamar tus controladores y acciones de
    cierto modo para obtener una URL en concreto. Resiste la tentación. Sigue
    las convenciones de CakePHP (mayúsculas, nombre en plural, etc.) y crea
    acciones comprensibles, que se dejen leer. Luego podrás asignar URLs a tu
    código utilizando "rutas", que veremos más adelante.

La única instrucción en la acción utiliza ``set()`` para pasar datos desde el
controlador hacia la vista (que crearemos a continuación). La línea en cuestión
asigna una variable en la vista llamada 'articles' igual al valor retornado por
el método ``find('all')`` del objeto de tabla Artículos (``ArticlesTable``).

Para aprender más sobre los controladores, puedes visitar el capítulo
:doc:`/controllers`.

Crear Vistas de Artículos (``Article Views``)
=============================================

Ahora que tenemos nuestros datos fluyendo por el modelo, y que la lógica de
nuestra aplicación está definida en nuestro controlador, vamos a crear una vista
para la acción índex creada en el paso anterior.

Las vistas en CakePHP únicamente son fragmentos de presentación que encajan
dentro de la plantilla (``layout``) de nuestra aplicación. Para la mayoría de
aplicaciones son HTML mezclados con PHP, pero bien podrían acabar siendo XML,
CSV o incluso datos binarios.

Una plantilla es una presentación de código que envuelve una vista. Se
pueden definir múltiples plantillas y puedes cambiar entre ellas pero, por ahora,
utilizaremos la plantilla por defecto (``default``).

¿Recuerdas cómo en la sección anterior hemos asignado la variable 'articles' a
la vista utilizando el método ``set()``? Esto asignaría el objeto de consulta
(``query object``) a la vista para ser invocado por una iteración ``foreach``.

Las vistas en CakePHP se almacenan en la ruta ``/src/Template`` y en un
directorio con el mismo nombre que el controlador al que pertenecen (tendremos
que crear una carpeta llamada 'Articles' en este caso). Para dar formato a los
datos de este artículo en una bonita tabla, el código de nuestra vista debería
ser algo así:

.. code-block:: php

    <!-- File: /src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Aquí es donde iteramos nuestro objeto de consulta $articles, mostrando en pantalla la información del artículo -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->id]) ?>
            </td>
            <td><?= $article->created->format(DATE_RFC850) ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

Esto debería ser sencillo de comprender.

Como habrás notado, hay una llamada a un objeto ``$this->Html``. Este objeto es
una instancia de la clase :php:class:`Cake\\View\\Helper\\HtmlHelper` de CakePHP.
CakePHP proporciona un conjunto de ayudantes de vistas (``helpers``) para ayudarte a
completar acciones habituales, como por ejemplo crear un enlace o un formulario.
Puedes aprender más sobre esto en :doc:`/views/helpers`, pero lo que es
importante destacar aquí es que el método ``link()`` generará un enlace HTML con
el título como primer parámetro y la URL como segundo parámetro.

Cuando crees URLs en CakePHP te recomendamos emplear el formato de array. Se
explica con detenimiento en la sección de Rutas (``Routes``). Si utilizas las rutas
en formato array podrás aprovecharte de las potentes funcionalidades de
generación de rutas inversa de CakePHP en el futuro. Además puedes especificar
rutas relativas a la base de tu aplicación de la forma
``/controlador/accion/param1/param2`` o incluso utilizar :ref:`named-routes`.

Llegados a este punto, deberías ser capaz de acceder con tu navegador a
http://www.example.com/articles/index. Deberías ver tu vista, correctamente
formatada con el título y la tabla listando los artículos.

Si te ha dado por hacer clic en uno de los enlaces que hemos creado en esta
vista (que enlazan el título de un artículo hacia la URL
``/articles/view/un\_id``), seguramente habrás sido informado por CakePHP de que
la acción no ha sido definida todavía. Si no has sido infromado, o bien algo
ha ido mal o bien ya la habías definido, en cuyo caso eres muy astuto. En caso
contrario, la crearemos ahora en nuestro controlador de artículos::

    namespace App\Controller;

    use Cake\Error\NotFoundException;

    class ArticlesController extends AppController {

        public function index() {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null) {
            if (!$id) {
                throw new NotFoundException(__('Invalid article'));
            }
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

Si observas la función view(), ahora el método set() debería serte familiar.
Verás que estamos usando ``get()`` en vez de ``find('all')`` ya que sólo
queremos un artículo concreto.

Verás que nuestra función view toma un parámetro: el ID del artículo que
queremos ver. Este parámetro se gestiona automáticamente al llamar
a la URL ``/articles/view/3``, el valor '3' se pasa a la función view como primer
parámetro ``$id``.

También hacemos un poco de verificación de errores para asegurarnos de que el
usuario realmente accede a dicho registro. Si el usuario solicita
``/articles/view`` lanzaremos una excepción ``NotFoundException`` y dejaremos al
ErrorHandler tomar el control. Utilizando el método ``get()`` en la tabla
Articles también hacemos una verificación similar para asegurarnos de que el
usuario ha accedido a un registro que existe. En caso de que el artículo
solicitado no esté presente en la base de datos, el método ``get()`` lanzará
una excepción ``NotFoundException``.

Ahora vamos a definir la vista para esta nueva función 'view' ubicándola en
``/src/Template/Articles/view.ctp``.

.. code-block:: php

    <!-- File: /src/Template/Articles/view.ctp -->
    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>

Verifica que esto funciona probando los enlaces en ``/articles/index`` o puedes
solicitándolo manualmente accediendo a ``/articles/view/1``.


Añadiendo Artículos
===================

Leer de la base de datos y mostrar nuestros artículos es un gran comienzo, pero
permitamos también añadir nuevos artículos.

Lo primero, añadir una nueva acción ``add()`` en nuestro controlador
ArticlesController::

    namespace App\Controller;

    use Cake\Error\NotFoundException;

    class ArticlesController extends AppController {
        public $components = ['Flash'];

        public function index() {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid article'));
            }

            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add() {
            $article = $this->Articles->newEntity($this->request->data);
            if ($this->request->is('post')) {
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    Necesitas incluir el FlashComponent en cualquier controlador donde vayas a
    usarlo. Si lo ves necesario, inclúyelo en tu AppController.

Lo que la función add() hace es: si el formulario enviado no está vacío, intenta
salvar un nuevo artículo utilizando el modelo Articles. Si no se guarda bien,
muestra la vista correspondiente, así podremos mostrar los errores de validación
u otras alertas.

Cada petición de CakePHP incluye un objeto ``Request`` que es accesible
utilizando ``$this->request``. El objeto de petición contiene información útil
acerca de la petición que se recibe y puede ser utilizado para controlar el flujo
de nuestra aplicación. En este caso, utilizamos el método
:php:meth:`Cake\\Network\\Request::is()` para verificar que la petición es una
petición HTTP POST.

Cuando un usuario utiliza un formulario y efectúa un POST a la aplicación, esta
información está disponible en ``$this->request->data``. Puedes usar la función
:php:func:`pr()` o :php:func:`debug()` para mostrar el contenido de esa variable
y ver la pinta que tiene.

Utilizamos el método mágico ``__call`` del ``FlashComponent`` para guardar un
mensaje en una variable de sesión que será mostrado en la página después de la
redirección. En la plantilla tenemos ``<?= $this->Flash->render() ?>`` que
muestra el mensaje y elimina la correspondiente variable de sesión. El método
:php:meth:`Cake\\Controller\\Controller::redirect` del controlador redirige
hacia otra URL. El parámetro ``['action' => 'index']`` se traduce a la URL
/articles (p.e. la acción index del controlador de artículos). Puedes echar un
ojo al método :php:func:`Cake\\Routing\\Router::url()` en la `API
<http://api.cakephp.org>`_ para ver los formatos en que puedes especificar una
URL para varias funciones de CakePHP.

Al llamar al método ``save()``, comprobará si hay errores de validación primero
y si encuentra alguno, no continuará con el proceso de guardado. Veremos a
continuación cómo trabajar con estos errores de validación.

Validando los Datos
===================

CakePHP te ayuda a evitar la monotonía al construir tus formularios y su
validación. Todos odiamos teclear largos formularios y gastar más tiempo en
reglas de validación de cada campo. CakePHP lo hace más rápido y sencillo.

Para aprovechar estas funciones es conveniente que utilices el FormHelper en tus
vistas. La clase :php:class:`Cake\\View\\Helper\\FormHelper` está disponible en
tus vistas por defecto a través de ``$this->Form``.

He aquí nuestra vista ``add``:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Añadir Artículo</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->input('title');
        echo $this->Form->input('body', ['rows' => '3']);
        echo $this->Form->button(__('Guardar artículo'));
        echo $this->Form->end();
    ?>

Hemos usado FormHelper para generar la etiqueta 'form'. La ejecución de
``$this->Form->create()`` genera el siguiente código:

.. code-block:: html

    <form method="post" action="/articles/add">

Si ``create()`` no tiene parámetros al ser llamado, asume que estás creando un
formulario que envía vía POST a la acción ``add()`` (o ``edit()`` cuando ``id``
es incluido en los datos de formulario) del controlador actual.

El método ``$this->Form->input()`` se utiliza para crear elementos de formulario
del mismo nombre. El primer parámetro le indica a CakePHP a qué campo
corresponde y el segundo parámetro te permite especificar un abanico muy ámplio
de opciones - en este caso, el número de filas del textarea que se generará. Hay
un poco de introspección y "automagia" aquí: ``input()`` generará distintos
elementos de formulario en función del campo del modelo especificado.

La llamada a ``$this->Form->end()`` cierra el formulario. También generará
campos ocultos si la CSRF/prevención de manipulación de formularios ha sido
habilitada.

Volvamos atrás un minuto y actualicemos nuestra vista
``src/Template/Articles/index.ctp`` para añadir un enlace de "Añadir Artículo".
Justo antes del tag <table> añade la siguiente línea::

    <?= $this->Html->link(
        'Añadir artículo',
        ['controller' => 'Articles', 'action' => 'add']
    ) ?>

Te estarás preguntando: ¿Cómo le digo a CakePHP la forma en la que debe validar
estos datos? Muy sencillo, las reglas de validación se escriben en el modelo.
Volvamos al modelo ``Articles`` y hagamos algunos ajustes::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator) {
            $validator
                ->notEmpty('title')
                ->notEmpty('body');

            return $validator;
        }
    }

El método ``validationDefault()`` le dice a CakePHP cómo validar tus datos
cuando se invoca el método ``save()``. Aquí hemos especificado que ambos campos,
el cuerpo y el título, no pueden quedar vacíos. El motor de validaciones de
CakePHP es potente y con numerosas reglas ya predefinidas (tarjetas de crédito,
direcciones de e-mail, etc.) así como flexibilidad para añadir  tus propias
reglas de validación. Para más información en tal configuración, echa un vistazo
a la documentación :doc:`/core-libraries/validation`.

Ahora que ya tienes las reglas de validación definidas, usa tu aplicación para
crear un nuevo artículo con un título vacío y verás cómo funcionan. Como hemos
usado el método :php:meth:`Cake\\View\\Helper\\FormHelper::input()`, los
mensajes de error se construyen automáticamente en la vista sin código adicional.

Editando Artículos
==================

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
	            $this->Session->setFlash(__('Your post has been updated.'));
	            return $this->redirect(array('action' => 'index'));
	        }
	        $this->Session->setFlash(__('Unable to update your post.'));
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
            $this->Session->setFlash('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

Este método borra un artículo cuyo 'id' enviamos como parámetro y usa
``$this->Session->setFlash()`` para mostrar un mensaje si ha sido borrado. Luego
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

Las reglas de enrutamiento están en ``/config/routes.php``. Comentaremos
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
resto del manual y el API `Manual </>`_ `API <http://api20.cakephp.org>`_.

Lectura sugerida para continuar desde aquí
==========================================

1. :ref:`view-layouts`: Personaliza la plantilla *layout* de tu aplicación
2. :ref:`view-elements` Incluír vistas y reutilizar trozos de código
3. :doc:`/controllers/scaffolding`: Prototipos antes de trabajar en el código final
4. :doc:`/console-and-shells/code-generation-with-bake` Generación básica de CRUDs
5. :doc:`/core-libraries/components/authentication`: Gestión de usuarios y permisos
