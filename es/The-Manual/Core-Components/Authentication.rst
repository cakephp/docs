Autenticación
#############

Un sistema de autenticación de usuarios es una parte común de muchas
aplicaciones web. En CakePHP hay muchas formas para autenticar usuarios,
cada una de estas provee diferentes opciones. La esencia de componente
de autenticación es comprobar si el usuario tiene una cuenta con el
sitio. De ser así, el componente da al usuario acceso completo a sitio.

Este componente se puede combinar con el componente ACL (access control
lists) para crear niveles más complejos de acceso al sitio. El
componente ACL, por ejemplo, podría permitir acceso a un usuario a áreas
publicas del sitio, mientras que concede a otro usuario acceso a
porciones administrativas protegidas del sitio.

El AuthComponent de CakePHP se puede usar para crear un sistema fácil y
rápidamente. Veamos como construir un sistema de autenticación simple.

Al igual que todos los componentes, se utiliza mediante la incorporación
de 'Auth' a la lista de componentes en el controlador:

::

    class FooController extends AppController {
        var $components = array('Auth');

O añadelo al AppController si todos tus controladores lo van a usar:

::

    class AppController extends Controller {
        var $components = array('Auth');

Ahora, hay unas pocas convenciones en las que pensar cuando se usa el
AuthComponent. Por defecto, el AuthComponent espera que se tenga una
tabla llamada 'users' con campos llamados 'username' y 'password'. *En
algunos casos, las bases de datos no permiten usar 'password' como
nombre de columna, mas tarde, veremos como cambiar el nombre por defecto
de los campos para trabajar con nuestro propio entorno.*

Vamos a crear nuestra tabla 'users' usando el siguiente SQL:

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(50),
        PRIMARY KEY (id)
    );

Algo a tener en cuenta a la hora de crear una tabla para almacenar todos
los datos de autenticación del usuario es que el AuthComponent espera
que el valor del password almacenado esté encriptado en vez de estar
almacenado en texto plano. Asegúrese de que el campo que utilizará para
almacenar la contraseña sea suficientemente largo para almacenar el hash
(40 caracteres para SHA1, por ejemplo).

Para la configuración más básica usted solo tiene que crear dos acciones
en el controlador:

::

    class UsersController extends AppController {

        var $name = 'Users';
        var $components = array('Auth'); //No es necesario si se declaro en el app controller

        /**
         *  El AuthComponent proporciona la funcionalidad necesaria
         *  para el acceso (login), por lo que se puede dejar esta función en blanco.
         */
        function login() {
        }

        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }

Si bien usted puede dejar la función login() en blanco, necesitara crear
la vista para la acción login (guardela en app/views/users/login.ctp).
Esta es la única vista del UsersController que es necesario crear, sin
embargo. El siguiente ejemplo asume que ya está familiarizado con el uso
del Form helper:

::

       <?php
        $session->flash('auth');
        echo $form->create('User', array('action' => 'login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>

Esta vista crea un simple formulario de login en el cual introducir el
nombre de usuario y la clave. Una vez enviado este formulario, el
AuthComponent se encargará del resto por usted. El session flash message
mostrara cualquier información generada por el AuthComponent.

Lo creas o no, ya está! Esta es la manera de implementar una
increiblemente simple, base de datos de autenticación usando el
componente Auth. Sin embargo, hay mucho más que podemos hacer. Echemos
un vistazo a algunos usos más avanzados del componente.

Configurando las variables del componente Auth
==============================================

Para cambiar las opciones predeterminadas de AuthComponent tienes que
crear el método beforeFilter() en el controlador, llamar a varios
métodos predefinidos, y configurar algunas variables del componente.

Para cambiar el nombre del campo que se utiliza para guardar las
contraseñas, 'password', a 'secretword', por ejemplo, haríamos lo
siguiente:

::

    class UsersController extends AppController {
        var $components = array('Auth');

        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

En este caso, ¡no olvidemos que también hay que cambiar en la vista el
nombre del campo!

Las variables del componente Auth también se utilizan para que los
usuarios que no han entrado en el sistema puedan acceder a determinados
métodos.

Por ejemplo, si queremos que todos los usuarios puedan acceder solamente
a los métodos index y view, hacemos lo siguiente:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }

Mostrando Mensajes de Error en la Autentificación
=================================================

Con el objetivo de desplegar los mensajes de error que la
Autentificacion muestra, necesitas añadir el siguiente codigo en tu
vista. En este caso, el mensaje aparecerá debajo de los mensajes flash
regulares:

::

    <?php
        if ($session->check('Message.flash')) {
            $session->flash();
        }
        if ($session->check('Message.auth')) {
            $session->flash('auth');
        }
    ?>

Problemas comunes con Auth
==========================

A veces puede ser difícil diagnosticar problemas cuando encuentras
comportamientos inesperados. Recordar estos puntos te puede ayudar.

*Password hashing*

Al enviar información a través de un formulario, el componente Auth
encripta automáticamente el contenido del campo contraseña, si también
hay datos en el campo nombre de usuario. Así que si estás intentando
crear algún tipo de página de registro de nuevo usuario, asegúrate de
que el usuario rellene un campo "confirmar contraseña" que puedas
comparar. Aquí va un código de ejemplo:

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Cambiar la Función Hash
=======================

AuthComponent usa la clase Security para encriptar una contraseña. La
clase Security usa el esquema SHA1 por defecto. Para cambiar a otra
función hash usada por el componente Auth, usa el método ``setHash``
pasándole ``md5``, ``sha1`` o ``sha256`` como primer y único parámetro.

::

    Security::setHash('md5'); // o sha1 o sha256. 

La clase Security usa el valor de inicialización (*salt value*, que se
encuentras en /app/config/core.php) para el hashing de la contraseña.

Si quieres usar una lógica diferente para el hashing de la contraseña
más allá de md5/sha1 con el valor *salt* de la aplicacion, necesitará
reescribir el mecanismo estandar hashPassword - podrías necesitar hacer
esto si, por ejemplo, tuvieses una base de datos existente que
anteriormente usaba un esquema de *hashing* sin un valor de *salt*. Para
hacer esto, crea el metodo ``hashPasswords`` en la clase que quieras que
se haga a cargo del hashing de las contraseñas (normalmente el modelo
User ) y establece el atributo ``authenticate`` de Auth al objeto contra
el que se está autenticando (normalmente es User) de este modo:

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

Con el código anterior, el método ``hashPasswords()`` del modelo User
será llamado cada vez que Cake llame a
``AuthComponent::hashPasswords()``. Aquí está un ejemplo del método
``hashPasswords``, apropiado si ya tienes una tabla de usuarios repleta
de contraseñas de *hash* 'plain md5':

::

    class User extends AppModel {
        function hasPasswords($data) {
            if (isset($data['User']['password'])) {
                $data['User']['password'] = md5($data['User']['password']);
                return $data;
            }
            return $data;
        }
    }

Métodos de AuthComponent
========================

action
------

``action (string $action = ':controller/:action')``

Si estas usando
`ACOs <https://book.cakephp.org/es/view/465/Understanding-How-ACL-Works>`_
como parte de tu estructura
`ACL <https://book.cakephp.org/es/view/465/Understanding-How-ACL-Works>`_,
puedes obtener la ruta al nodo del
`ACO <https://book.cakephp.org/es/view/465/Understanding-How-ACL-Works>`_
que está enlazado a un par controlador/acción particular.

::

        $acoNode = $this->Auth->action('users/delete');

Si no le pasas valores, utilizará el par controlador/acción actual (el
que se está ejecutando).

allow
-----

Si tienes acciones en tu controlador que no necesitas que se autentiquen
contra ellas (como una acción de registro de usuarios), puedes agregar
métodos que debe ignorar AuthComponent. El siguiente ejemplo muestra
como permitir una acción llamada 'register'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('register');
        }

Si deseas permitir que múltiples acciones no usen autenticación, las
pasas como parámetros al método allow():

::

        function beforeFilter() {
            ...
            $this->Auth->allow('foo', 'bar', 'baz');
        }

Atajo: también puedes permitir todas las acciones en un controlador
usando '\*'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('*');
        }

Si estás usando requestAction en tu layout o en tus elementos, deberías
permitir esas acciones para poder abrir la página de login
correctamente.

El componente auth supone que tus nombres de acciones `siguen las
convenciones </es/view/559/URL-Considerations-for-Controller-Names>`_ y
usan guiones bajos.

deny
----

Habrá algunas veces que quieras eliminar acciones de la lista de
acciones permitidas (añadidas usando $this->Auth->allow()). He aquí un
ejemplo:

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }

        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }

            ...
        }

hashPasswords
-------------

``hashPasswords ($data)``

Este método verifica si ``$data`` contiene los campos nombre de
usuario(\ *username*) y contraseña(\ *password*), tal y como está
especificado en la variable ``$fields`` indexados por el nombre del
modelo especificado en ``$userModel``. Si el *array* ``$data`` contiene
el nombre de usuario y la contraseña, realiza el *hash* del campo
contraseña en el *array* y devuelve el *array* ``$data`` con el mismo
formato. Esta función debe ser usada antes de realizar llamadas de
inserción o actualización de los datos del usuario cuando afecta al
campo contraseña.

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        pr($hashedPasswords);
        /* devuelve:
        Array
        (
            [User] => Array
            (
                [username] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )

        */

En el campo *$hashedPasswords['User']['password']* ahora debería ser
realizado el *'hash'* usando el método ``password`` del componente.

Si tu controlador usa el compoente Auth y los datos recibidos por POST
contienen los campos explicados arriba, automáticamente realizará el
*hash* al campo contraseña usando esta función.

mapActions
----------

Si estás utilizando Acl en modo CRUD, tal vez desees asignar ciertas
acciones no predeterminadas a cada parte de CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('ciertaAccion'),
            'read' => array('ciertaAccion', 'ciertaAccion2'),
            'update' => array('ciertaAccion'),
            'delete' => array('ciertaAccion')
        )
    );

login
-----

``login($data = null)``

Si estás haciendo algún tipo de *login* basada en Ajax, puedes usar este
método para identificar manualmente a alguien en el sistema. Si no pasas
ningún valor para ``$data``, automáticamente usará los datos enviados
mediante POST al controlador.

Por ejemplo, en una aplicación tal vez desees asignar a un usuario una
contraseña y autoidentificarlo en el sistema tras el registro. En un
ejemplo muy simplificado:

Vista:

::

    echo $form->create('User',array('action'=>'registrar'));
    echo $form->input('username');
    echo $form->end('Regístrame');

Controlador:

::

    function registrar() {
        if(!empty($this->data)) {
            $this->User->create();
            $contrasena_asignada = "ConTr4senna";
            $this->data['User']['password'] = $contrasena_asignada;
            if($this->User->save($this->data)) {
                // enviar el email de registro conteniendo la contraseña al nuevo usuario
                $this->Auth->login($this->data);
                $this->redirect("inicio");
        }
    }

Una cosa a remarcar es que has de redirigir manualmente al usuario tras
el *login* ya que no se invoca ``loginRedirect()``.

``$this->Auth->login($data)`` devuelve 1 tras un *login* exitoso, 0 en
caso de fallo.

logout
------

Provee de una manera rápida de 'deautenticar' a alguien y redirigirlo a
donde necesite ir. Este método también es útil si deseas proporcionar un
enlace 'Cerrar sesión' dentro de una sección para usuarios registrados
de tu aplicación.

Ejemplo:

::

    $this->redirect($this->Auth->logout());

password
--------

``password (string $password)``

Pásale una cadena de texto, y obtendrás la contraseña *'hasheada'*. Esta
es una funcionalidad esencial si estás creando una pantala de registro
de usuario donde los usuarios han de insertar sus contraseñas una
segunda vez para confirmarlas. if ($this->data['User']['password'] ==
$this->Auth->password($this->data['User']['password2'])) { // Las
contraseñas concuerdan, continuar procesando ... } else {
$this->flash('Las contraseñas introducidas no concuerdan',
'users/registrar'); }

El componente Auth automáticamente aplicará el *hash* al campo
contraseña (*password*) si también está presente el campo nombre de
usuario (*username*) en los datos recibidos en la petición.

Cake añade tu cadena contraseña a un valor *salt* y después realiza el
*hash*. La función de *hash* utilizada depende de la seleccionada por la
clase utilidad del núcleo ``Security`` (sha1 por defecto). Puedes
utilizar la función ``Security::setHash`` para cambiar el método para
calcular el *hash*. El valor *salt* es el indicado en la configuración
de tu aplicación definido en tu ``core.php``.

user
----

``user(string $key = null)``

Este método proporciona información sobre el usuario actualmente
identificado. La información es tomada de la sesión. Por ejemplo:

::

    if ($this->Auth->user('rol') == 'admin') {
        $this->flash('Tienes acceso de administrador');
    }

También puede ser usado para obtener todos los datos de sesión del
usuario así:

::

    $data['User'] = $this->Auth->user();

Si este método devuelve ``null`` es que el usuario no se ha identificado
(*logged in*).

En la vista puedes utilizar el *helper* ``Session`` para obtener la
información del usuario actualmente autenticado:

::

    $session->read('Auth.User'); // devuelve el registro completo del usuario
    $session->read('Auth.User.nombre') //devuelve el valor particular de un campo

La clave de la sesión puede ser diferente dependiendo de qué modelo se
ha configurado para ser utilizado por Auth. P.e., si usas el modelo
``Cuenta`` en vez de ``User``, entonces la clave de sesión sería
``Auth.Cuenta``.

Atributos de AuthComponent
==========================

Ahora hay varias variables relacionadas con Auth que también puedes
utilizar. Normalmente añades esta configuración en el método
``beforeFilter() de tu controlador. Si necesitas aplicar dicha configuración a todo el sitio, deberías añadirla a beforeFilter()``
de ``AppController``.

userModel
---------

¿No deseas utilizar un modelo *User* contra el que autenticar? No hay
problema. Simplemente cámbialo configurando este valor con el nombre del
modelo que deseas usar.

::

    <?php
        $this->Auth->userModel = 'Miembro';
    ?>

fields
------

Sobreescribe los campos de usuario y contraseña por defecto usados para
la autenticación.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>

userScope
---------

Utiliza esto para añadir requisitos adicionales para que la
autenticación sea exitosa.

::

    <?php
        $this->Auth->userScope = array('User.activo' => true);
    ?>

loginAction
-----------

Puedes cambiar el *login* por defecto de */users/login* para que sea
cualquier acción a tu elección.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'miembros', 'action' => 'inicio_sesion');
    ?>

loginRedirect
-------------

El componente AuthComponent recuerda qué par controlador/acción estabas
tratando de ejecutar antes de que pedirte que te autenticaras,
almacenando el valor en Session bajo la clave ``Auth.redirect``. Sin
embargo, si este valor de la sesión no está definido (si vienes de la
página de login de un enlace externo, por ejemplo), entonces el usuario
será redirigido a la URL indicada en loginRedirect.

Ejemplo:

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'miembros', 'action' => 'inicio');
    ?>

logoutRedirect
--------------

Puedes especificar a donde ira el usuario luego de 'deautenticarse', el
inicio por defecto es la accion login

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>

loginError
----------

Cambia el mensaje de error por defecto que se mostrará, cuando el login
no sea exitoso.

::

    <?php
        $this->Auth->loginError = "No, you fool!  That's not the right password!";
    ?>

authError
---------

Cambia el mensaje de error por defecto que será mostrado, cuando
intenten acceder a un objeto o a una acción a la que no autorizada.

::

    <?php
        $this->Auth->authError = "Sorry, you are lacking access.";
    ?>

autoRedirect
------------

Normally, the AuthComponent will automatically redirect you as soon as
it authenticates. Sometimes you want to do some more checking before you
redirect users:

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }

        ...

        function login() {
        //-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).
            if ($this->Auth->user()) {
                if (!empty($this->data['User']['remember_me'])) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Clear auth message, just in case we use it.
                        $this->Session->del('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>

The code in the login function will not execute *unless* you set
$autoRedirect to false in a beforeFilter. The code present in the login
function will only execute *after* authentication was attempted. This is
the best place to determine whether or not a successful login occurred
by the AuthComponent (should you desire to log the last successful login
timestamp, etc.).

With autoRedirect set to false, you can also inject additional code such
as keeping track of the last successful login timestamp

::

    <?php
        function login() { 
            if( !(empty($this->data)) && $this->Auth->user() ){
                $this->User->id = $this->Auth->user('id');
                $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                $this->redirect($this->Auth->redirect());
            }
        }
    ?>

authorize
---------

Normally, the AuthComponent will attempt to verify that the login
credentials you've entered are accurate by comparing them to what's been
stored in your user model. However, there are times where you might want
to do some additional work in determining proper credentials. By setting
this variable to one of several different values, you can do different
things. Here are some of the more common ones you might want to use.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>

When authorize is set to 'controller', you'll need to add a method
called isAuthorized() to your controller. This method allows you to do
some more authentication checks and then return either true or false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } 
            }
        if ($this->action == 'view') {           
                    return true;         
            }
        ...
            return false;
        }
    ?>

Remember that this method will be checked after you have already passed
the basic authentication check against the user model.

::

    <?php
        $this->Auth->authorize = 'model';
    ?>

Don't want to add anything to your controller and might be using ACO's?
You can get the AuthComponent to call a method in your user model called
isAuthorized() to do the same sort of thing:

::

    <?php
        class User extends AppModel {
            ...

            function isAuthorized($user, $controller, $action) {

                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>

Lastly, you can use authorize with actions such as below

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>

By using actions, Auth will make use of ACL and check with
AclComponent::check(). An isAuthorized function is not needed.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>

By using crud, Auth will make use of ACL and check with
AclComponent::check(). Actions should be mapped to CRUD (see
`mapActions <https://book.cakephp.org/view/813/mapActions>`_).

sessionKey
----------

Name of the session array key where the record of the current authed
user is stored.

Defaults to "Auth", so if unspecified, the record is stored in
"Auth.{$userModel name}".

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>

ajaxLogin
---------

If you are doing Ajax or Javascript based requests that require
authenticated sessions, set this variable to the name of a view element
you would like to be rendered and returned when you have an invalid or
expired session.

As with any part of CakePHP, be sure to take a look at `AuthComponent
class <https://api.cakephp.org/class/auth-component>`_ for a more
in-depth look at the AuthComponent.

authenticate
------------

This variable holds a reference to the object responsible for hashing
passwords if it is necessary to change/override the default password
hashing mechanism. See `Changing the Encryption
Type </es/view/566/Changing-Encryption-Type>`_ for more info.

actionPath
----------

If using action-based access control, this defines how the paths to
action ACO nodes is computed. If, for example, all controller nodes are
nested under an ACO node named 'Controllers', $actionPath should be set
to 'Controllers/'.
