Simple Acl controlled Application
#################################

Bienvenido a CakePHP, si eres nuevo con CakePHP revisa primero el
tutorial del Blog. Si ya lo has visto, y ya leiste acerca del uso de
bake, y estás necesitando configurar un sistema Auth y Acl para el
ingreso y autenticación de tus usuarios, entonces este es el tutorial
para ti.

Como ya mencionamos anteriormente este tutorial asume que ya tienes
experiencia con CakePHP, y que estás familiarizado con todos los
conceptos del MVC que constituyen el núcleo. También te sientes cómodo
con el uso de la consola y el script bake. Si no conoces lo anterior,
primero aprende todas estos elementos y luego vuelve. Este tutorial será
mucho más facil de seguir y tendra más sentido para ti. En este tutorial
usaremos ```AuthComponent`` </es/view/172/Authentication>`_ y
```AclComponent`` </es/view/171/Access-Control-Lists>`_. Si no sabes lo
que son, revisa sus páginas en el manual antes de proceder.

Que necesitas?

#. Un servidor web. Asumiremos que usas Apache, pero las instrucciones
   son similares en caso de otro servidor. Quizas debamos jugar un poco
   con la configuración del servidor, pero muchos consiguen utilizar
   CakePHP sin tener que configurar nada.
#. Un servidor de bases de datos. Usaremos mySQL en este tutorial.
   Necesitarás conocer suficiente SQL para crear la base de datos:
   CakePHP tomará las riendas de aquí en adelante.
#. Conocimiento PHP básico. Mientras mas programación orientada a objeto
   que hayas hecho mejor: pero si eres fanático de la programación
   procedural no tienes nada que temer.

Preparando nuestra aplicación
=============================

Primero, consigamos una copia fresca de CakePHP.

Para descargarla, visita la página de CakePHP en Cakeforge: y descarga la última versión
estable. Para este tutorial necesitaras la version 1.2.x.x

También puedes hacer checkout/export desde el trunk en:
https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/

Una vez que tengas la copia de Cake, configuraremos el archivo
database.php, y cambiemos ademas el valor de Security.salt en el archivo
app/config/core.php. Desde acá construiremos un esquema de base de datos
simple para nuestra aplicación. Ejecuta el siguiente código SQL en tu
base de datos.

::

    CREATE TABLE users (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password CHAR(40) NOT NULL,
        group_id INT(11) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

     
    CREATE TABLE groups (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created DATETIME,
        modified DATETIME
    );


    CREATE TABLE posts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE widgets (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        part_no VARCHAR(12),
        quantity INT(11)
    );

Estas serán las tablas que usaremos para construir el resto de la
aplicación. Una vez que tengamos la estructura en la base de datos ya
podemos comenzar a hornear. Usa `cake
bake </es/view/113/Code-Generation-with-Bake>`_ para crear rapidamente
tus modelos, controladores y vistas.

Evite el uso de Scaffold(andamios) aquí. La generación de la ACOS se
verán seriamente afectados si hornear los controladores con la función
de Scaffold.

Mientras hornees tus modelos Cake automagicamente detectara las
asociaciones entre tus modelos (o relaciones entre las tablas). Dejemos
que Cake entregue las asociaciones hasMany y belongsTo apropiadas. Si te
pregunta por elegir hasOne o hasMany, en general necesitarás una
relación hasMany (solo) para este tutorial.

Dejaremos admin routing fuera por ahora, este tema ya es bastante
complejo sin ellos. Asegurate además de **NO** agregar ninguno de los
dos componentes a ningún controlador mientras estes horneándolo. Haremos
eso tan pronto podamos. Ahora debieras tener modelos, controladores y
vistas para tus tablas users (usuarios), groups (grupos), posts
(artículos) y widgets.

En modo ``actions`` (acciones), esto autenticará nuestros ARO que son
los groups y users, con los objetos ACO - controladores & acciones.

Preparándose para agregar Autentificación (Auth)
================================================

Ahora tenemos un funcionamiento de aplicación CRUD. Bake debe tener
todas las configuraciones de las relaciones que necesitamos, si no es
así debemos añadirlas ahora. Hay algunas otras piezas que añadiremos
antes de que podamos agregar los componentes de autenticación y acl. En
primer lugar añadir las acciones login(inicio sesión) y logout(salir
sesión) en el controlador ``UsersController``.

::

    function login() {
        //Autentificación Magica
    }
     
    function logout() {
        //limpio por ahora.
    }

No es necesario preocuparse por agregar cualquier hash de contraseñas,
debido a que AuthComponent lo hará por nosotros automáticamente al
crear/editar los usuarios, y cuando se inicia sesión, una vez
configurado correctamente. Además, si usted agrega un hash de las
contraseñas manualmente ``AuthComponent`` no podrá iniciar sesión en
absoluto. Pues los hash no coincidiran.

A continuación tenemos que hacer algunas modificaciones a
``AppController``. Si usted no tiene el controlador
``/app/app_controller.php``, créelo. Tenga en cuenta que esto va en
/app/ y no /app/controllers/. Dado que queremos que todo el sitio este
con el control de autentificación y ACL, vamos a ponerlos en
``AppController``.

::

    class AppController extends Controller {
        var $components = array('Acl', 'Auth');

        function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }

Antes de configurar la ACL en todo tendrá que añadir algunos usuarios y
grupos. Con ``AuthComponent`` en uso no podremos acceder a ninguna de
nuestras acciones, ya que no se ha iniciado sesión. Ahora vamos a añadir
algunas excepciones de manera que ``AuthComponent`` nos permitirá crear
algunos grupos y usuarios. **Por lo tanto** en`` GroupsController`` y
``UsersController`` añadiremos lo siguiente.

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('*');
    }

Estas declaraciones son para decirle a AuthComponent que permita el
acceso del público a todas las acciones. Esto es sólo temporal y se
eliminará una vez que tengamos unos usuarios y grupos en nuestra base de
datos. No agregue los usuarios o grupos, no todavía.

Inicializar las tablas Acl en la BD
===================================

Antes de que creemos nuestros users o groups querremos conectarlos con
el Acl. Sin embargo, en este punto aun no tenemos ninguna tabla Acl y si
tratamos de ver cualquier página en este momento, obtendremos un error
de tabla no encontrada. Para eliminar estos errores necesitamos ejecutar
un archivo de esquema. En una consola ejecuta el siguiente codigo:
``cake schema run create DbAcl``. Este esquema te preguntara acerca de
eliminar y crear estas tablas. Acepta la eliminación y creación de éstas
tablas.

Recuerda especificar la ruta de tu directorio app si estás fuera de
ella.

#. En tu directorio de aplicación app:

   ``$ /path/to/cake/console/cake schema run create DbAcl``

#. Fuera de tu directorio de aplicación app:

   ``$ /path/to/cake/console/cake -app /path/to/app/dir schema run create DbAcl``

Con los controladores listos para la entrada de datos y con las tablas
Acl inicializadas estamos listos para empezar cierto?... no del todo,
aún necesitamos un poco de trabajo en los modelos de users y groups.
Llamémoslo, hacerlos automágicamente ligados a Acl.

Act as a Requester (Solicitante)
================================

Para que Auth y Acl funcionen apropiadamente necesitamos asociar a
nuestros modelos users y groups con registros en las tablas Acl. Para
hacer esto usaremos el ``AclBehavior``. El ``AclBehavior`` permite la
conexión automágica entre los modelos y las tablas Acl. Su uso requiere
la implementación de ``parentNode()`` en tu modelo. En nuestro modelo
``User`` agregaremos lo siguiente:

::

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (!$data['User']['group_id']) {
            return null;
        } else {
            return array('Group' => array('id' => $data['User']['group_id']));
        }
    }

Entonces en nuestro modelo ``Group`` agrega lo siguiente:

::

    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        return null;
    }

Lo que hace esto es unir los modelos ``Group`` y ``User`` al Acl, y
decirle a CakePHP que cada vez que crees un User o Group agregues una
entrada en la tabla ``aros``. Esto hace la administración de Acl muy
fácil ya que tus AROs se ligan transparentemente a tus tablas de
``users`` y ``groups``. De esta forma, cada vez que se crea o elimina un
usuario la tabla de Aro se actualiza.

Nuestros controladores y modelos ahora están preparados para agregar
algunos datos iniciales, y nuestros modelos ``Group`` y ``User`` estan
unidos a la tabla Acl. Ahora agregaremos unos groups y users usando los
formularios que creamos con bake. Yo creé en este caso los siguientes
grupos:

-  administrators
-  managers
-  users

Tambien creé un user en cada group de tal forma de tener un user por
cada grupo de acceso diferente para probarlos luego. Escribe todo facil
de recordar, sobre todos los passwords. Si haces un
``SELECT * FROM aros;`` desde la consola de mysql obtendrás algo como:

::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

Esto nos muestra que tenemos tres groups y 3 users. Los users estan
anidados dentro de los grupos., lo que significa que podemos fijar
permisos mediante grupos o por usuarios.

Cuando modificamos un user, debes actualizar manualmente los ARo. Este
codigo debería ser ejecutado cada vez que actualices la información del
usuario:

::

    // Verificar si sus permisos de grupo han cambiado
    $oldgroupid = $this->User->field('group_id');
    if ($oldgroupid !== $this->data['User']['group_id']) {
        $aro =& $this->Acl->Aro;
        $user = $aro->findByForeignKeyAndModel($this->data['User']['id'], 'User');
        $group = $aro->findByForeignKeyAndModel($this->data['User']['group_id'], 'Group');
                    
        // Guardar en la tabla ARO
        $aro->id = $user['Aro']['id'];
        $aro->save(array('parent_id' => $group['Aro']['id']));
    }

Creando ACOs
============

Ahora que ya tenemos nuestros users y groups (aros), podemos empezar a
ingresar nuestros controladores en el Acl y fijar los permisos para cada
grupo de usuarios, además, habilitar el login y logout.

Nuestros AROs son automaticamente creados cuando nuevos usuarios y
grupos son creados. ¿Que hay de autogenerar los ACOs desde nuestros
controladores y sus acciones?. Desafortunadamente no hay una manera
mágica de hacer esto. Las clases del núcleo ofrecen unas pocas formas de
crear AROs manualmente. Se pueden crear ACOs a través de la consola o
usando el ``AclComponent``. Desde la consola esto se ve así:

::

    cake acl create aco root controllers

Mientras que desde el AclComponent se ve asi:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Ambos ejemplos crear nuestra 'raiz' (root) o ACO de nivel superior, el
cual se llama 'controllers'. El propósito de este nodo raiz es hacer
fácil permitir/denegar (allow/deny) acceso en el ámbito global de la
aplicación y permitir el uso del Acl para propósitos no relacionados con
los controladores/acciones tales como verificar permisos de registro del
modelo. Así como usaremos una raíz global para los ACO necesitaremos
hacer una pequeña modificación a la configuración de nuestro
``AuthComponent``. ``AuthComponent`` necesita saber de la existencia de
este nodo raíz, de tal forma que cuando hacemos que ACL lo verifique,
pueda usar la ruta correcta al nodo cuando busque un(a)
controlador/accion. En ``AppController`` agrega el siguiente código a
``beforeFilter``:

::

    $this->Auth->actionPath = 'controllers/';

Una herramienta automática para crear ACOs
==========================================

Tal como se mencionó anteriormente, no hay una forma pre-construida para
insertar y conectar nuestros controladores y sus funciones dentro del
Acl. Sin embargo, todos odiamos hacer tareas repetitivas como tipear lo
que tal vez sean cientos de acciones en una aplicación grande. He
escrito una función automática para construir mi tabla de Aco's. Esta
función mirará en cada controlador de la aplicación. Añadirá cualquier
metodo no privativo, ni propio del ``Controller``. Puedes agregar y
ejecutar esto en tu ``AppController`` o cualquier otro controlador con
ese propósito, solo asegurate de eliminarlo antes de poner la aplicación
en producción.

::

    /**
     * Reconstruye el Acl basado en los controladores actuales de la aplicación.
     *
     * @return void
     */
        function buildAcl() {
            $log = array();
     
            $aco =& $this->Acl->Aco;
            $root = $aco->node('controllers');
            if (!$root) {
                $aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
                $root = $aco->save();
                $root['Aco']['id'] = $aco->id; 
                $log[] = 'Creado el nodo Aco para los controladores';
            } else {
                $root = $root[0];
            }   
     
            App::import('Core', 'File');
            $Controllers = Configure::listObjects('controller');
            $appIndex = array_search('App', $Controllers);
            if ($appIndex !== false ) {
                unset($Controllers[$appIndex]);
            }
            $baseMethods = get_class_methods('Controller');
            $baseMethods[] = 'buildAcl';
     
            // miramos en cada controlador en app/controllers
            foreach ($Controllers as $ctrlName) {
                App::import('Controller', $ctrlName);
                $ctrlclass = $ctrlName . 'Controller';
                $methods = get_class_methods($ctrlclass);
     
                //buscar / crear nodo de controlador
                $controllerNode = $aco->node('controllers/'.$ctrlName);
                if (!$controllerNode) {
                    $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $ctrlName));
                    $controllerNode = $aco->save();
                    $controllerNode['Aco']['id'] = $aco->id;
                    $log[] = 'Creado el nodo Aco del controlador '.$ctrlName;
                } else {
                    $controllerNode = $controllerNode[0];
                }
     
                //Limpieza de los metodos, para eliminar aquellos en el controlador 
                //y en las acciones privadas
                foreach ($methods as $k => $method) {
                    if (strpos($method, '_', 0) === 0) {
                        unset($methods[$k]);
                        continue;
                    }
                    if (in_array($method, $baseMethods)) {
                        unset($methods[$k]);
                        continue;
                    }
                    $methodNode = $aco->node('controllers/'.$ctrlName.'/'.$method);
                    if (!$methodNode) {
                        $aco->create(array('parent_id' => $controllerNode['Aco']['id'], 'model' => null, 'alias' => $method));
                        $methodNode = $aco->save();
                        $log[] = 'Creado el nodo Aco para '. $method;
                    }
                }
            }
            debug($log);
        }

Quizás quieras mantener esta función cerca cuando añadas nuevos ACO's
para todos los controladores & acciones que tiene tu aplicación cada vez
que la ejecutes. Sin embargo, no remueve los nodos de las acciones que
ya no existen, esto implica tener que limpiar a mano la tabla ACO. Ahora
que todo lo más complejo está hecho, necesitamos ahora configurar los
permisos, y eliminar el código que deshabilitó el ``AuthComponent``
anteriormente.

Ahora, que ya está funcionando, quizás notes que tienes problemas
accesando cualquier plugin que quizás estabas ocupando. El truco para
automatizar el controlador de ACO's para los plugins, es que necesita un
App::import que siga la convencion de nombre de plugins, que es
PluginNombre.PluginControllerNombre.

Entonces lo que necesitamos es una función que nos entregará una lista
de los nombres de los controladores de los plugins, y que los importe en
la misma forma que lo hicimos arriba para los controladores normales. La
función de abajo hará exactamente eso:

::


        /**
         * Obtener los nombres de los controladores de plugins
         * 
         * Esta funcion entrega un arreglo con los nombres de los controladores 
         * de los plugins y además se asegura que los controladores están disponibles
         * para nosotros, de modo de obtener los nombres de los metodos al hacer un 
         * App:import para cada uno de los plugins.

         *
         * @return arreglo con los nombres de los plugins.
         *
         */
        function _get_plugin_controller_names(){
            App::import('Core', 'File', 'Folder');
            $paths = Configure::getInstance();
            $folder =& new Folder();
            // Cambiamos al directorio de plugins
            $folder->cd(APP.'plugins');
            // Obtener la lista de los archivos que terminan con
            // controller.php
            $files = $folder->findRecursive('.*_controller\.php');
            // Obtener la lista de plugins
            $Plugins = Configure::listObjects('plugin');

            // Ciclo a través de los controladores que encontramos en el
            // directorio de plugins
            foreach($files as $f => $fileName)
            {
                // Obtener el nombre de archivo base
                $file = basename($fileName);

                // Obtener el nombre del controlador
                $file = Inflector::camelize(substr($file, 0, strlen($file)-strlen('_controller.php')));

                // Ciclo a través de los plugins
                foreach($Plugins as $pluginName){
                    if (preg_match('/^'.$pluginName.'/', $file)){
                        // Primero nos deshacemos del AppController del plugin
                        // Hacemos esto porque nunca lo llamamos directamente
                        if (preg_match('/^'.$pluginName.'App/', $file)){
                            unset($files[$f]);
                        } else {
                                        if (!App::import('Controller', $pluginName.'.'.$file))
                                        {
                                            debug('Error importando el archivo '.$file.' para el plugin '.$pluginName);
                                        }

                            // Ahora le agregamos el nombre del plugin al inicio
                            // Esto lo necesitamos para poder obtener los nombres
                            // de los métodos
                            $files[$f] = $file;
                        }
                        break;
                    }
                }
            }

            return $files;
        }

Tu puedes modificar el código original para incluir los controladores de
plugins al mezclarlos con la lista que obtuviste (ubicarlo antes del
ciclo foreach):

::

            $Plugins = $this->_get_plugin_controller_names();

            $Controllers = array_merge($Controllers, $Plugins);

Configurando los permisos
=========================

Crear los permisos al igual que crear los ACO's no tiene una solucion
mágica, en este caso no proveeremos una forma automática. Para permitir
a los ARO's acceder a los ACO's desde la consola, usamos:

::

    cake acl grant $aroAlias $acoAlias [create|read|update|delete|'*']

\* Necesita estar entre comillas simples ('\*')

Para permitir acceso a través del ``AclComponent`` haz lo siguiente:

::

    $this->Acl->allow($aroAlias, $acoAlias);

Ahora añadiremos algunas sentencias para permitir y denegar el acceso.
Agrega lo siguiente a tu función temporal en tu ``UsersController`` e
ingresa a la dirección adecuada en tu navegador para ejecutarla. Si
haces un ``SELECT * FROM aros_acos`` deberías ver toda un montón de unos
y ceros. Una vez que hayas confirmado los permisos, elimina la función.

::

    function initDB() {
        $group =& $this->User->Group;
        //Permite a los administradores hacer todo
        $group->id = 1;     
        $this->Acl->allow($group, 'controllers');

        //permite a los editores postear y accesar los widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');
     
        //permite a los usuarios añadir y editar posts y widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');        
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');        
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
    }

Ahora hemos seteado algunas reglas básicas de acceso. Hemos permitido a
los administradores accesar a todas las funciones. Los editores pueden
accesar a todas las funcionalidades de los posts y los widgets. En
cambio los usuarios solo pueden accesar aquellas funciones que permiten
agregar y editar posts y widgets.

Debemos obtener una referencia del modelo ``Group`` y modificar su id
para poder especificar el ARO que queremos, esto es debido a la forma en
que trabaja el ``AclBehavior``. El ``AclBehavior`` no configura el campo
alias en la tabla ``aros``, por lo que debemos usar una referencia a un
objeto ARO que necesitemos.

Quizás hayas notado que deliberadamente deje fuera index y view fuera de
mis permisos ACL. Haremos que los metodos index y view sean de acceso
público en el controlador ``PostsController`` y en el
``WidgetsController``. Esto permite a los usuarios no autorizados para
ver estas paginas, haciendolas públicas. Sin embargo, en cualquier
momento puedes eliminar estas acciones desde
``AuthComponent::allowedActions`` y los permisos de estas dos funciones
volverán a su configuración original del Acl.

Ahora queremos eliminar las referencias al ``Auth->allowedActions`` en
los controladores de users y groups. Entonces agregamos el siguiente
código en los controladores de posts y widgets:

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('index', 'view');
    }

Esto elimina el "interruptor de apagado" que colocamos anteriormente el
los controladores de groups y users, y otorga acceso público a las
acciones index y view en aquellos controladores. En
``AppController::beforeFilter()`` agrega lo siguiente:

::

     $this->Auth->allowedActions = array('display');

Esto hace que la acción 'display' sea pública. Esto mantendrá publica
nuestra acción PagesController::display(). Esto es importante pues a
menudo ésta es la accion accesada por defecto del routing de la
aplicación.

Logueo de Usuarios
==================

Nuestra aplicación ya esta bajo control de acceso, y cualquier intento
de ver alguna página sin acceso público será redirigida a la página de
login. Sin embargo, necesitamos crear una vista de login antes de que
alguien pueda loguerase. Agrega el siguiente código a
``app/views/users/login.ctp`` si es que aún no lo has hecho.

::

    <h2>Login</h2>
    <?php
    echo $form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $form->input('User.username');
    echo $form->input('User.password');
    echo $form->end('Login');
    ?>

Tal vez quieras agregar un flash() para los mensajes del componente Auth
en tu layout. Copia el layout por defecto que se encuentra en
``cake/libs/views/layouts/default.ctp`` - a la carpeta de layouts de tu
aplicación si es que aún no lo has hecho. En
``app/views/layouts/default.ctp`` agrega:

::

    $session->flash('auth');

Ahora deberias poder loguerte y todo deberá funcionar automágicamente.
Cuando el acceso sea denegado el mensaje apropiado del Auth será
desplegado si es que has agragado ``$session->flash('auth')``

Logout (deslogueo)
==================

Ahora al logout. Hace un momento dejamos esta función en blanco, ahora
es el momento de llenarla. En ``UsersController::logout()`` añade lo
siguiente:

::

    $this->Session->setFlash('Adios y nos vemos.');
    $this->redirect($this->Auth->logout());

Esto establece el mensaje flash y saca al usuario de la aplicación
usando el método logout del componente Auth. Este método basicamente
elimina la llave de la sesión del usuario y devuelve la url que puede
ser usada en el redireccionamiento. Si es que hay otros datos en la
sesión que necesiten ser eliminados se debe agregar ese código acá.

Todo hecho
==========

En este momento ya deberías tener una aplicación controlada por los
componentes Auth y Acl. Los permisos de usuarios se hicieron al nivel de
grupo, pero pueden ser configurados a nivel de usuarios en cualquier
momento. También puedes configurar los permisos a nivel global y también
por controladores y acciones. Además, tienes a tu disposición un código
reusable para facilmente expandir tu tabla de ACO a medida que tu
aplicación crece.
