Tutorial Blog - Autenticación y Autorización
############################################

Siguiendo con nuestro ejemplo de aplicación :doc:`/tutorials-and-examples/blog/blog`, imaginá que
necesitamos no permitir que usuarios no autenticados puedan crear artículos.

Creando la tabla users y el Controlador
=======================================

Primero, vamos a crear una tabla en nuestra base de datos para guardar los datos de usuarios:

.. code-block:: mysql

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Si estás usando PostgreSQL, conecta a la base de datos cake_blog y ejecuta el siguiente SQL en su lugar:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created TIMESTAMP DEFAULT NULL,
        modified TIMESTAMP DEFAULT NULL
    );

Seguimos las convenciones de CakePHP para nombrar tablas, pero también
estamos aprovechando otra convención: al usar los campos email y password
en nuestra tabla users, CakePHP configurará automáticamente la mayoría de las cosas
al momento de implementar el login.

El siguiente paso es crear nuestra clase ``UsersTable``, responsable de buscar, guardar
y validar los datos de usuario::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            return $validator
                ->notEmpty('email', 'An email is required')
                ->email('email')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

También vamos a crear nuestro ``UsersController``. El siguiente contenido se corresponde
con una clase ``UsersController`` básica "baked" usando las utilidades de generación
de código que están incluidas en CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class UsersController extends AppController
    {
        public function index()
        {
            $this->set('users', $this->Users->find()->all());
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEmptyEntity();
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

Creamos las vistas para nuestros artículos de la misma forma que el controlador, usando
las herramientas de generación de código 'bake', lo que nos permite implementar las vistas
de los usuarios. Para el propósito de este tutorial, mostraremos solamente **add.php**:

.. code-block:: php

    <!-- templates/Users/add.php -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('email') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Añadiendo Autenticación
=======================

Ya estamos listos para agregar nuestra autenticación. En CakePHP esto es manejado
por el plugin ``authentication``. Empezaremos instalándolo. Usa composer para
instalar el plugin:

.. code-block:: console

    composer require "cakephp/authentication:^2.0"

Luego añade la siguiente línea en la función ``bootstrap()`` del archivo ``Application.php``::

    // in src/Application.php in the bootstrap() method.
    $this->addPlugin('Authentication');

Añadiendo hashing de contraseña
===============================

Lo siguiente, creamos la entidad ``User`` y añadimos el hashing del password. Crear el
archivo de la entidad **src/Model/Entity/User.php** y añade lo siguiente::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // Make all fields mass assignable except for primary key field "id".
        protected array $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

Ahora, siempre que la propiedad ``password`` es asignada a la entidad User, se
le aplicara el Hash usando la clase ``DefaultPasswordHasher``.

Configurando Autenticación
==========================

Ahora es el momento de configurar el plugin Authentication.
El plugin gestionará el proceso de autenticación usando 3 clases diferentes:

* ``Application`` usara el Authentication Middleware y proporciona un
  AuthenticationService, teniendo todas las configuraciones que queramos para definir
  como se van a comprobar las credenciales y donde encontrarlas.
* ``AuthenticationService`` es una clase de utilidad que te permite configurar el
  proceso de autenticación.
* ``AuthenticationMiddleware`` será ejecutado como parte de la cola de middleware,
  esto será antes de que tu controlador sea procesado por el framework, recogerá
  las credenciales y las procesará para comprobar si el usuario está autenticado.

La lógica de autenticación es dividida en clases específicas y el proceso
se realiza antes de la capa del controlador. Primero, se comprueba si el
usuario está autenticado (basado en la configuración proporcionada) e inyecta
el usuario y el resultado de la autenticación en la petición para futura referencia.

En **src/Application.php**, añade los siguientes imports::

    // In src/Application.php add the following imports
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Psr\Http\Message\ServerRequestInterface;

Luego implementa el interfaz de autenticación en tu clase Application::

    // in src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

Después añade lo siguiente::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... other middleware added before
            ->add(new RoutingMiddleware($this))
            // add Authentication after RoutingMiddleware
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => '/users/login',
            'queryParam' => 'redirect',
        ]);

        // Carga los identificadores, asegurando que se comprueban los campos email y password
        $authenticationService->loadIdentifier('Authentication.Password', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
        ]);

        // Carga los authenticators, quieres que la sesión comprueba primero
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configure form data check to pick email and password
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => '/users/login',
        ]);

        return $authenticationService;
    }

En tu clase ``AppController`` añade el siguiente código::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');

        // Añade ésta línea para comprobar la autenticación y asegurar tu aplicación
        $this->loadComponent('Authentication.Authentication');

Ahora, en cada petición, el ``AuthenticationMiddleware`` inspeccionará la sesión
para comprobar si existe un usuario autenticado. Si estamos cargando la página
``/users/login``, también inspeccionará los datos del formulario enviado en "post"
(si hay alguno) para extraer las credenciales. Por defecto las credenciales se
extraerán de los campos ``email`` y ``password`` de la información del request.
El resultado de la autenticación será inyectado in un atributo de la petición
llamado ``authentication``. Puedes inspeccionar el resultado en cualquier momento
usando ``$this->request->getAttribute('authentication')`` desde la acción de un
controlador.
Todas tus páginas serán restringidas ya que ``AuthenticationComponent`` está
comprobando el resultado en cada petición. Cuando falla al buscar un usuario
autenticado, redirigirá al usuario a la página ``/users/login``.
Te en cuenta que en éste punto del tutorial, la aplicación no funcionará ya que
aún no tenemos la página de login. Si visitas tu aplicación, obtendrás un bucle
infinito de redirección, asi que, vamos a arreglarlo!

En tu ``UsersController``, añade el siguiente código::

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // Configura la acción de login para no requerir autenticación, para
        // prevenir el bucle infinito de redirección
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // sin importar si es POST o GET, redirige si el usuario esta autenticado
        if ($result->isValid()) {
            // redirige a /articles después de iniciar sesión correctamente
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // muestra los errors si el usuario envió el formulario y fallo la autenticación
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid email or password'));
        }
    }

Añade la lógica de la vista para la acción de login::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your email and password') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Add User", ['action' => 'add']) ?>
    </div>

Ahora la página de login nos permitirá iniciar sesión en la aplicación.
Compruébalo haciendo una petición a cualquier página de tu aplicación.
Después de haber sido redirigido a la página ``/users/login``, introduce
el email y password que usaste previamente para crear el usuario.
Deberías ser redirigido correctamente después de iniciar sesión.

Necesitamos añadir un par de detalles más para configurar nuestra aplicación.
Queremos que todas las páginas ``view`` e ``index`` sean accesible sin necesitar
iniciar sesión, así que añadiremos ésta configuración específica en ``AppController``::

    // en src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // para todos los controladores de nuestra aplicación, hacer el index y view
        // acciones públicas, saltándonos la autenticación
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

Terminar sesión
===============

Añade la acción ``logout`` a la clase ``UsersController``::

    // en src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // sin importar si es POST o GET, redirige si el usuario esta autenticado
        if ($result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

Ahora puedes visitar ``/users/logout`` para terminar la sesión. Luego serás
redirigido a la página de login. Si has llegado tan lejos, felicidades, ahora
tienes un blog simple que:

* Permite usuarios autenticados crear y editar artículos.
* Permite usuarios no autenticados ver artículos y etiquetas.

Lectura sugerida
----------------

#. :doc:`/bake/usage` Generar código CRUD básico
#. `Authentication Plugin </authentication/>`__ documentación.

.. meta::
    :title lang=es: Tutorial Blog - Autenticación y Autorización
    :keywords lang=es: auto increment,aplicacion con autorizacion,model user,array,convenciones,autenticacion,urls,cakephp,delete,doc,columns
