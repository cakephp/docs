Aplicación con autenticación y autorizacion
###########################################

Siguiendo con nuestro ejemplo de aplicacion :doc:`/tutorials-and-examples/blog/blog`, 
imaginá que necesitamos proteger ciertas URLs, dependiendo del usuario logeado. También 
tenemos otro requisito, permitir que nuestro blog tenga varios autores, cada uno 
habilitado para crear sus posts, editar y borrarlos a voluntad, evitando que otros 
autores puedan cambiarlos.

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

Siguimos las convenciones de CakePHP para nombrar tablas pero también estamos aprovechando 
otra convencion: al usar los campos username y password en nuestra tabla CakePHP configurará 
automáticamente la mayoria de las cosas al momento de implementar el login.

El siguiente paso es crear el modelo para la tabla User que será responsable de buscar, guardar 
y validar los datos de usuario::

    // app/Model/User.php
    App::uses('AppModel', 'Model');

    class User extends AppModel {
        public $validate = array(
            'username' => array(
                'required' => array(
                    'rule' => 'notBlank',
                    'message' => 'A username is required'
                )
            ),
            'password' => array(
                'required' => array(
                    'rule' => 'notBlank',
                    'message' => 'A password is required'
                )
            ),
            'role' => array(
                'valid' => array(
                    'rule' => array('inList', array('admin', 'author')),
                    'message' => 'Please enter a valid role',
                    'allowEmpty' => false
                )
            )
        );
    }

También vamos a crear UsersController; el siguiente contenido fue generado usando  
`baked` UsersController con el generador de código incluído con CakePHP::

    // app/Controller/UsersController.php
    App::uses('AppController', 'Controller');

    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

        public function index() {
            $this->User->recursive = 0;
            $this->set('users', $this->paginate());
        }

        public function view($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->findById($id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Session->setFlash(
                    __('The user could not be saved. Please, try again.')
                );
            }
        }

        public function edit($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->request->is('post') || $this->request->is('put')) {
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Session->setFlash(
                    __('The user could not be saved. Please, try again.')
                );
            } else {
                $this->request->data = $this->User->findById($id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            // Prior to 2.5 use
            // $this->request->onlyAllow('post');

            $this->request->allowMethod('post');

            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Session->setFlash(__('User deleted'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('User was not deleted'));
            return $this->redirect(array('action' => 'index'));
        }

    }

.. versionchanged:: 2.5

    A partir de la version 2.5, usamos ``CakeRequest::allowMethod()`` en lugar de 
    ``CakeRequest::onlyAllow()`` (deprecated).

De la misma forma que creamos las vistas para los posts del blog o usando la herramienta 
de generación de código, creamos las vistas. Para los objetivos de este tutorial, mostraremos 
solamente add.ctp:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit')); ?>
    </div>

Autenticación (login y logout)
==============================

Ya estamos listos para agregar nuestra autenticación. En CakePHP esto es manejado 
por la clase :php:class:`AuthComponent`, responsable de requerir login para ciertas 
acciones, de manejar el sign-in y el sign-out y también de autorizar usuarios logeados 
a ciertas acciones que estan autorizados a utilizar.

Para agregar este componente a tú aplicación, abrí ``app/Controller/AppController.php``
y agregá las siguientes lineas::

    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Session',
            'Auth' => array(
                'loginRedirect' => array(
                    'controller' => 'posts',
                    'action' => 'index'
                ),
                'logoutRedirect' => array(
                    'controller' => 'pages',
                    'action' => 'display',
                    'home'
                ),
                'authenticate' => array(
                    'Form' => array(
                        'passwordHasher' => 'Blowfish'
                    )
                )
            )
        );

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

No hay mucho que configurar, al haber utilizado convenciones para la tabla de usuarios.
Simplemente asignamos las URLs que serán cargadas despues del login y del logout, en nuestro 
caso ``/posts/`` y ``/`` respectivamente.

Lo que hicimos en ``beforeFilter`` fue decirle al AuthComponent que no requiera login para 
las acciones ``index`` y ``view`` en cada controlador. Queremos que nuestros visitantes puedan 
leer y listar las entradas sin registrarse.

Ahora necesitamos poder registrar nuevos usuarios, guardar el nombre de usuario y contraseña, 
y hashear su contraseña para que no sea guardada como texto plano. Vamos a decirle al AuthComponent 
que deje usuarios sin autenticar acceder a la funcion add del controlador users e implementemos las 
acciones de login y logout::

    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        // Allow users to register and logout.
        $this->Auth->allow('add', 'logout');
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Session->setFlash(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        return $this->redirect($this->Auth->logout());
    }

El hasheo del password aún no esta hecho, abrí ``app/Model/User.php`` y agregá la siguientes lineas::

    // app/Model/User.php

    App::uses('AppModel', 'Model');
    App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

    class User extends AppModel {

    // ...

    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data[$this->alias]['password'] = $passwordHasher->hash(
                $this->data[$this->alias]['password']
            );
        }
        return true;
    }

    // ...

.. note::

    El BlowfishPasswordHasher usa un algoritmo de hasheo mas fuerte (bcrypt) que 
    SimplePasswordHasher (sha1) y provee salts por usuario. SimplePasswordHasher 
    será removido en la version 3.0 de CakePHP

Entonces, cada vez que un usuario sea guardado, el password es hasheado usando la clase
BlowfishPasswordHasher. Solamente nos falta una vista para la función de login. Abrí 
``app/View/Users/login.ctp`` y agregá las siguientes lineas:

.. code-block:: php

    //app/View/Users/login.ctp

    <div class="users form">
    <?php echo $this->Session->flash('auth'); ?>
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend>
                <?php echo __('Please enter your username and password'); ?>
            </legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login')); ?>
    </div>

Ya podés registrar un nuevo usuario accediendo a ``/users/add`` e iniciar sesión con las 
nuevas credenciales ingresando a ``/users/login``. También al intentar acceder a alguna otra 
URL que no fue explicitamente autorizada, por ejemplo ``/posts/add``, la aplicación te 
redireccionará automaticamente al la pagina de login.

Y eso es todo! Se ve demasiado simple para ser verdad. Volvamos un poco para explicar que pasa.
La función ``beforeFilter`` le dice al AuthComponent que no requiera login para  la acción ``add``
asi como para ``index`` y ``view``, autorizadas en el ``beforeFilter`` del AppController.

La función ``login`` llama a ``$this->Auth->login()`` del AuthComponent,
y funciona sin ninguna otra configuración ya que seguimos la convención. 
Es decir, tener un modelo llamado User con los campos username y password, y usar un formulario 
que hace post a un controlador con los datos del usuario. Esta función devuelve si el login 
fue exitoso o no, y en caso de que tenga exito redirige a la URL puesta en AppController, dentro 
de la configuracion del AuthComponent.

El logout funciona simplemente al acceder a ``/users/logout`` y redirecciona al usuario a la URL 
configurada.

Autorización (quién está autorizado a acceder qué)
==================================================

Como mencionamos antes, estamos convirtiendo este blog en una herramienta de autoría multiusuario, 
y para hacer esto necesitamos modificar la tabla de posts para agregar referencia al modelo User::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

También, un pequeño cambio en PostsController es necesario para guardar el usuario logeado como referencia 
en los posts creados::

    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            //Added this line
            $this->request->data['Post']['user_id'] = $this->Auth->user('id');
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash(__('Your post has been saved.'));
                return $this->redirect(array('action' => 'index'));
            }
        }
    }

La función ``user()`` del AuthComponent devuelve datos del usuario actualmente logeado. Usamos este método para 
agregar datos a la información que será guardada.

Vamos a prevenir que autores puedan editar o eliminar los posts de otros autores. La regla básica para nuestra 
aplicación es que los usuarios admin pueden acceder todas las URL, mientras que los usuarios normales (autores) 
solamente pueden acceder las acciones permitidas. 
Abrí nuevamente AppController y agregá las siguientes opciones en la configuración del Auth::

    // app/Controller/AppController.php

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array(
                'controller' => 'pages',
                'action' => 'display',
                'home'
            ),
            'authenticate' => array(
                'Form' => array(
                    'passwordHasher' => 'Blowfish'
                )
            ),
            'authorize' => array('Controller') // Added this line
        )
    );

    public function isAuthorized($user) {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

Creamos un mecanismo de autorización muy simple. En este caso, los usuarios con el rol ``admin`` podrán 
acceder a cualquier URL del sitio cuando esten logeados, pero el resto de los usuarios no podrán hacer más 
que los usuarios no logeados.

Esto no es exactamente lo que queriamos, por lo que tendremos que agregar mas reglas a nuestro método ``isAuthorized()``.
Pero en lugar de hacerlo en AppController, vamos a delegar a cada controlador. Las reglas que vamos a agregar a PostsController 
deberian permitirle a los autores crear posts, pero prevenir que editen posts que no le pertenezcan. Abrí el archivo 
``PostsController.php`` y agregá las siguientes lineas::

    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        // All registered users can add posts
        if ($this->action === 'add') {
            return true;
        }

        // The owner of a post can edit and delete it
        if (in_array($this->action, array('edit', 'delete'))) {
            $postId = (int) $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Estamos sobreescribiendo el método ``isAuthorized()`` de AppController y comprobando si la clase padre autoriza al usuario. 
Si no lo hace entonces solamente autorizarlo a acceder a la acción add y condicionalmente acceder a edit y delete. Una 
última cosa por implementar, decidir si el usuario está autorizador a editar el post o no, estamos llamando la función ``isOwnedBy()``
del modelo Post. Es en general una buena practica mover la mayor parte de la logica posible hacia los modelos::

    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) !== false;
    }


Esto concluye nuestro simple tutorial de autenticación y autorización. Para proteger el UsersController se puee seguir la misma 
técnica utilizada para PostsController. También es posible implementar una solución mas general en AppController, de acuerdo a 
tus reglas.

En caso de necesitar más control, sugerimos leer la guia completa sobre Auth en :doc:`/core-libraries/components/authentication`, 
donde encontrarás mas información para configurar el componente y crear clases de autorizacion a tú medida.

Lectura sugerida
----------------

1. :doc:`/console-and-shells/code-generation-with-bake` Generar código CRUD básico
2. :doc:`/core-libraries/components/authentication`: Registro y login de usuarios


.. meta::
    :title lang=es: Aplicación con autenticación y autorizacion
    :keywords lang=es: auto increment,autorizacion aplicacion,model user,array,convenciones,autenticacion,urls,cakephp,delete,doc,columns
