Tutorial Blog - Autenticación y Autorización
############################################

Siguiendo con nuestro ejemplo de aplicacion :doc:`/tutorials-and-examples/blog/blog`, imaginá que necesitamos proteger ciertas URLs, dependiendo del usuario logeado. También tenemos otro requisito, permitir que nuestro blog tenga varios autores, cada uno habilitado para crear sus posts, editar y borrarlos a voluntad, evitando que otros autores puedan cambiarlos.

Creando el codigo para usuarios
===============================

Primero, vamos a crear una tabla en nuestra base de datos para guardar los datos de usuarios::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Siguimos las convenciones de CakePHP para nombrar tablas pero también estamos aprovechando otra convencion: al usar los campos username y password en nuestra tabla CakePHP configurará automáticamente la mayoria de las cosas al momento de implementar el login.

El siguiente paso es crear Users table, responsable de buscar, guardar y validar los datos de usuario::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

También vamos a crear UsersController; el siguiente contenido fue generado usando baked UsersController con el generador de código incluído con CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;
    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            if (!$id) {
                throw new NotFoundException(__('Invalid user'));
            }

            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }

    }

De la misma forma que creamos las vistas para los posts del blog o usando la herramienta de generación de código, creamos las vistas. Para los objetivos de este tutorial, mostraremos solamente add.ctp:

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
            <?= $this->Form->input('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Autenticación (login y logout)
==============================

Ya estamos listos para agregar nuestra autenticación. En CakePHP esto es manejado por :php:class:`Cake\\Controller\\Component\\AuthComponent`, responsable de requerir login para ciertas acciones, de manejar el sign-in y el sign-out y también de autorizar usuarios logeados a ciertas acciones que estan autorizados a utilizar.

Para agregar este componente a tú aplicación abre el archivo **src/Controller/AppController.php** y agrega las siguientes lineas::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

No hay mucho que configurar, al haber utilizado convenciones para la tabla de usuarios. Simplemente asignamos las URLs que serán cargadas despues del login y del logout, en nuestro caso ``/articles/`` y ``/`` respectivamente.

Lo que hicimos en ``beforeFilter()`` fue decirle al AuthComponent que no requiera login para las acciones index y view en cada controlador.
Queremos que nuestros visitantes puedan leer y listar las entradas sin registrarse.

Ahora necesitamos poder registrar nuevos usuarios, guardar el nombre de usuario y contraseña, y hashear su contraseña para que no sea guardada como texto plano. Vamos a decirle al AuthComponent que deje usuarios sin autenticar acceder a la funcion add del controlador users e implementemos las acciones de login y logout::

    // src/Controller/UsersController.php

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // Allow users to register and logout.
        // You should not add the "login" action to allow list. Doing so would
        // cause problems with normal functioning of AuthComponent.
        $this->Auth->allow(['add', 'logout']);
    }

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error(__('Invalid username or password, try again'));
        }
    }

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

El hasheo del password aún no está hecho, necesitamos una clase Entity para nuestra clase User para así manejar esta lógica específica.
Crea el archivo **src/Model/Entity/User.php** y agrega las siguientes lineas::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Make all fields mass assignable for now.
        protected $_accessible = ['*' => true];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

Ahora cada vez que la propiedad password sea asignada a un usuario, será hasheada usando la clase ``DefaultPasswordHasher``.  
Solamente nos falta un archivo para la vista de la acción login. Abre tu archivo **src/Template/Users/login.ctp** y agrega las siguientes 
lineas:

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render('auth') ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

Ya podés registrar un nuevo usuario accediendo a ``/users/add`` e iniciar sesión con las nuevas credenciales ingresando a ``/users/login``. También al intentar acceder a alguna otra URL que no fue explicitamente autorizada, por ejemplo ``/articles/add``, la aplicación te redireccionará automaticamente al la pagina de login.

Y eso es todo! Se ve demasiado simple para ser verdad. Volvamos un poco para explicar que pasa. La función ``beforeFilter()`` le dice al AuthComponent que no requiera login para la acción ``add()`` asi como para ``index()`` y ``view()``, autorizadas en el ``beforeFilter()`` del AppController.

La función ``login()`` llama a ``$this->Auth->identify()`` del AuthComponent, y funciona sin ninguna otra configuración ya que seguimos la convención. Es decir, tener un modelo llamado User con los campos username y password, y usar un formulario que hace post a un controlador con los datos del usuario. Esta función devuelve si el login fue exitoso o no, y en caso de que tenga exito redirige a la URL puesta en AppController, dentro de la configuracion del AuthComponent.

El logout funciona simplemente al acceder a ``/users/logout`` y redirecciona al usuario a la URL configurada.


Autorización (quién está autorizado a acceder qué)
==================================================

Como mencionamos antes, estamos convirtiendo este blog en una herramienta de autoría multiusuario, y para hacer esto necesitamos modificar la tabla de posts para agregar referencia al modelo User::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

También, un pequeño cambio en ArticlesController es necesario para guardar el usuario logeado como referencia en los artículos creados::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // Added this line
            $article->user_id = $this->Auth->user('id');
            // You could also do the following
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

La función ``user()`` del AuthComponent devuelve datos del usuario actualmente logeado. Usamos este método para agregar datos a la información que será guardada.

Vamos a prevenir que autores puedan editar o eliminar los artículos de otros autores. La regla básica para nuestra aplicación es que los usuarios admin pueden acceder todas las URL, mientras que los usuarios normales (autores) solamente pueden acceder las acciones permitidas. Abre nuevamente AppController y agregá las siguientes opciones en la configuración del Auth::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // Added this line
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ]
        ]);
    }

    public function isAuthorized($user)
    {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

Hemos creado un mecanismo de autorización muy simple. En este caso, los usuarios con el rol ``admin`` podrán acceder a cualquier URL del sitio cuando esten logeados, pero el resto de los usuarios no podrán hacer más que los usuarios no logeados.

Esto no es exactamente lo que queriamos, por lo que tendremos que agregar mas reglas a nuestro método ``isAuthorized()``. Pero en lugar de hacerlo en AppController, vamos a delegar a cada controlador. Las reglas que vamos a agregar a ArticlesController deberian permitirle a los autores crear artículos, pero prevenir que editen artículos que no le pertenezcan. Abre el archivo ArticlesController.php y agregá las siguientes lineas::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // All registered users can add articles
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // The owner of an article can edit and delete it
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            $articleId = (int)$this->request->getParam('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Estamos sobreescribiendo el método ``isAuthorized()`` de AppController y comprobando si la clase padre autoriza al usuario. Si no lo hace entonces solamente autorizarlo a acceder a la acción add y condicionalmente acceder a edit y delete. Una última cosa por implementar, decidir si el usuario está autorizador a editar el post o no, estamos llamando la función ``isOwnedBy()`` del modelo Articles. Es en general una buena practica mover la mayor parte de la logica posible hacia los modelos::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

Esto concluye nuestro simple tutorial de autenticación y autorización. Para proteger el UsersController se puede seguir la misma técnica utilizada para ArticlesController. También es posible implementar una solución mas general en AppController, de acuerdo a tus reglas.

En caso de necesitar más control, sugerimos leer la guia completa sobre Auth en 
:doc:`/controllers/components/authentication`, donde encontrarás mas información para configurar el componente y crear clases de autorizacion a tú medida.

Lectura sugerida
----------------

#. :doc:`/bake/usage` Generar código CRUD básico
#. :doc:`/controllers/components/authentication`: Registro y login de usuarios

.. meta::
    :title lang=es: Tutorial Blog - Autenticación y Autorización
    :keywords lang=es: auto increment,aplicacion con autorizacion,model user,array,convenciones,autenticacion,urls,cakephp,delete,doc,columns
