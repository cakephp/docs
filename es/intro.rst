CakePHP de un vistazo
#####################

CakePHP está diseñado para hacer tareas habituales de desarrollo web simples y
fáciles. Para proporcionar una caja de herramientas todo-en-uno para que puedas
empezar, las diferentes partes de CakePHP trabajan correctamente de manera conjunta
o separada.

El objetivo de esta reseña es la de introducir los conceptos generales de CakePHP
y darte un rápido vistazo sobre como esos conceptos están implementados en CakePHP.
Si estás deseando comenzar un proyecto, puedes :doc:`empezar con el tutorial 
</tutorials-and-examples/bookmarks/intro>`, o :doc:`profundizar en la documentación
</topics>`.

Convenciones sobre configuración
================================

CakePHP proporciona una estructura organizativa básica que cubre los nombres de 
las clases, archivos, tablas de base de datos y otras convenciones más. Aunque
lleva algo de tiempo aprender las convenciones, siguiéndolas CakePHP evitará
que tengas que hacer configuraciones innecesarias y hará que la estructura de la
aplicación sea uniforme yq ue el trabajo con varios proyectos sea sencillo. El
capítulo de :doc:`convenciones </intro/conventions>` muestra las que utiliza 
CakePHP.

La capa modelo
==============

La capa modelo representa la parte de tu aplicación que implementa la lógica de
negocio. Es la responsable de obtener datos y convertirlos en los conceptos que
utiliza tu aplicación. Esto incluye procesar, validar, asociar u otras tareas
relacionadas con el manejo de datos.

En el caso de una red social la capa modelo se encargaría de tareas como guardar
los datos del usuario, las asociaciones de amigos, almacenar y obtener fotos,
buscar sugerencias de amistad, etc. Los objetos modelo serían "Amigo", 
"Usuario", "Comentario" o "Foto". Si quisieramos obtener más datos de nuestra
tabla ``usuarios`` podríamos hacer lo siguiente::

    use Cake\ORM\TableRegistry;

    $usuarios = TableRegistry::get('Usuarios');
    $query = $usuarios->find();
    foreach ($query as $row) {
        echo $row->nombreusuario;
    }

Como te habrás dado cuenta no hemos necesitado escribir ningún código previo 
para empezar a trabajar con nuestros datos. Al utilizar las convenciones CakePHP
usará clases estándar para tablas y clases de entidad que no hayan sido definidas.

Si queremos crear un nuevo usuario y guardarlo (con validaciones) podríamos hacer
algo como::

    use Cake\ORM\TableRegistry;

    $usuarios = TableRegistry::get('Usuarios');
    $usuario = $usuarios->newEntity(['email' => 'mark@example.com']);
    $usuarios->save($usuario);

The View Layer
==============

The View layer renders a presentation of modeled data. Being separate from the
Model objects, it is responsible for using the information it has available
to produce any presentational interface your application might need.

For example, the view could use model data to render an HTML view template containing it,
or a XML formatted result for others to consume::

    // In a view template file, we'll render an 'element' for each user.
    <?php foreach ($users as $user): ?>
        <li class="user">
            <?= $this->element('user', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

The View layer provides a number of extension points like :ref:`view-templates`, :ref:`view-elements`
and :doc:`/views/cells` to let you re-use your presentation logic.

The View layer is not only limited to HTML or text representation of the data.
It can be used to deliver common data formats like JSON, XML, and through
a pluggable architecture any other format you may need, such as CSV.

The Controller Layer
====================

The Controller layer handles requests from users. It is responsible for
rendering a response with the aid of both the Model and the View layers.

A controller can be seen as a manager that ensures that all resources needed for
completing a task are delegated to the correct workers. It waits for petitions
from clients, checks their validity according to authentication or authorization
rules, delegates data fetching or processing to the model, selects the type of
presentational data that the clients are accepting, and finally delegates the
rendering process to the View layer. An example of a user registration
controller would be::

    public function add()
    {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('You are now registered.'));
            } else {
                $this->Flash->error(__('There were some problems.'));
            }
        }
        $this->set('user', $user);
    }

You may notice that we never explicitly rendered a view. CakePHP's conventions
will take care of selecting the right view and rendering it with the view data
we prepared with ``set()``.

.. _request-cycle:

CakePHP Request Cycle
=====================

Now that you are familiar with the different layers in CakePHP, lets review how
a request cycle works in CakePHP:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request

The typical CakePHP request cycle starts with a user requesting a page or
resource in your application. At a high level each request goes through the
following steps:

#. The webserver rewrite rules direct the request to **webroot/index.php**.
#. Your Application is loaded and bound to an ``HttpServer``.
#. Your application's middleware is initialized.
#. A request and response is dispatched through the PSR-7 Middleware that your
   application uses. Typically this includes error trapping and routing.
#. If no response is returned from the middleware and the request contains
   routing information, a controller & action are selected.
#. The controller's action is called and the controller interacts with the
   required Models and Components.
#. The controller delegates response creation to the View to generate the output
   resulting from the model data.
#. The view uses Helpers and Cells to generate the response body and headers.
#. The response is sent back out through the :doc:`/controllers/middleware`.
#. The ``HttpServer`` emits the response to the webserver.

Just the Start
==============

Hopefully this quick overview has piqued your interest. Some other great
features in CakePHP are:

* A :doc:`caching </core-libraries/caching>` framework that integrates with
  Memcached, Redis and other backends.
* Powerful :doc:`code generation tools
  </bake/usage>` so you can start immediately.
* :doc:`Integrated testing framework </development/testing>` so you can ensure
  your code works perfectly.

The next obvious steps are to :doc:`download CakePHP </installation>`, read the
:doc:`tutorial and build something awesome
</tutorials-and-examples/bookmarks/intro>`.

Additional Reading
==================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=es: Empezando
    :keywords lang=es: estructura de carpetas,nombres de tablas,petición inicial,tabla de base de datos,estructura orgaizativa,rst,nombres de archivo,convenciones,mvc,web página,sit
