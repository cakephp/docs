Componentes
###########

Los componentes son paquetes de logica que es compartida entre controladores.
CakePHP incluye un fantastico set de componentes que puedes usar para ayudarte
en tareas comunes. También puedes crear tus propios componentes. Si te encontrás
queriendo copiar y pegar cosas entre de un controlador a otro, deberias considerar
crear tu propio componente para obtener esa funcionalidad. Crear componentes ayuda a
mantener el codigo de tus controladores limpio y facilita la reutilización de código
entre proyectos.

Cada uno de los componentes principales esta detallado en su propio capítulo.
Ver :doc:`/core-libraries/toc-components`.
Esta sección describe como configurar y usar los componentes y como crear tus propios
componentes.

.. _configuring-components:

Configurando componentes
========================

Mucho de los componentes principales requieren configuración. Algunos ejemplos de
componentes que requieren configuración son
:doc:`/core-libraries/components/authentication` y :doc:`/core-libraries/components/cookie`.
La configuración para estos componentes, y para los componentes en general, es realizada
usualmente en el array ``$components`` o en el método ``beforeFilter()`` de tú
controlador::

    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login'
                )
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

El fragmento de código anterior sería un ejemplo de configuración de un componente
con el array ``$components``.
Todos los componentes principales permiten que su configuración sea
seteada de ésta forma. A su vez, es posible configurar el componente
a través del método ``beforeFilter()`` de tú controlador.
Esto es útil cuando necesitas asignar los resultados de una función a la propiedad de
un componente. El código anterior también podría ser expresado como::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array(
            'controller' => 'users',
            'action' => 'login'
        );

        $this->Cookie->name = 'CookieMonster';
    }

Sin embargo, es posible que un componente requiera que cierta configuración
antes que el método ``beforeFilter()`` del controlador sea ejecutado.
Con éste fin, algunos componentes permiten que las opciones de configuración
sean seteadas en el array ``$components``::

    public $components = array(
        'DebugKit.Toolbar' => array('panels' => array('history', 'session'))
    );

Consulte la documentación relevante para determinar que opción de configuración provee
cada componente.

Una opcion común es el uso de ``className``, la cual le permite ponerle un alias a un
componente. Esta caracteristica es útil cuando se quiere reemplazar ``$this->Auth``
o la referencia de otro componente común con una implementación propia::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'className' => 'MyAuth'
            )
        );
    }

    // app/Controller/Component/MyAuthComponent.php
    App::uses('AuthComponent', 'Controller/Component');
    class MyAuthComponent extends AuthComponent {
        // Add your code to override the core AuthComponent
    }

El código anterior aplicaría un *alias* ``MyAuthComponent`` a ``$this->Auth`` en tús
controladores.

.. note::

    Usar un alias en un componente reemplaza esa instancia en cualquier lugar que ese componente sea
    usado, incluyendo dentro de otros componentes.

Usando Componentes
==================

Una vez que has incluido algunos componentes en tús controladores, usarlos
es bastante sensillo. Cada componente que use es expuesto como una propiedad
en tú controlador. Si ha cargado :php:class:`SessionComponent` y
:php:class:`CookieComponent` en su controlador, accederia a ellos de esta forma::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id'))) {
                $this->Session->setFlash('Post deleted.');
                return $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    Ya que tanto modelos como componentes son agregados a los controladores
    como propiedades, comparten el mismo 'namespace'. Asegurese de no darles
    el mismo nombre a un modelo y componente.

Cargar modelos en el acto
-------------------------

Tal vez no necesite todos los componentes disponibles en cada acción de su
controlador. En situaciones como esta puede cargar un componente en tiempo de
ejecucion usando :doc:`Component Collection </core-libraries/collections>`.
Desde dentro de un método de un controlador se puede::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();

.. note::

    Tenga en cuenta que cargar un componente en tiempo de ejecución no
    llamara el método initialize de el componente.


Callbacks de componentes
========================

Los componentes también ofrecen varios callbacks que permiten aumentar
el ciclo del request. Vea :ref:`component-api` para más información
sobre los callbacks que ofrecen los componentes.

.. _creating-a-component:

Creando componentes
===================

Suponga que nuestra aplicación online necesita llevar a cabo una
operación matemática compleja en diferentes partes de la aplicación.
En este caso, crearíamos un componente que albergue esta lógica
compartida para usar en diferentes controladores.

El primer paso es crear un nuevo archivo y clase de componente.
Cree el archivo en ``app/Controller/Component/MathComponent.php``. La estructura
básica para un componente es::

    App::uses('Component', 'Controller');
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    Todos los componentes deben extender :php:class:`Component`. Si no lo hacen
    se disparará una excepción.

Incluyendo tús componentes en un controlador
--------------------------------------------

Una vez que nuestro componente está terminado, podemos usarlo en un
controlador agregando el nombre del componente (sin la parte de "Component") en
el array ``$components``. El controlador recibirá automáticamente un nuevo
atributo llamado como este componente a través del cual podemos acceder a una
instancia del componente::

    /* Hacer disponible el nuevo componente $this->Math,
    y el standard $this->Session */
    public $components = array('Math', 'Session');

Los componentes declarados en ``AppController`` serám combinados con aquellos
en otros controladores. Por lo que no hay necesidad de re-declarar un componente
mas de una vez.

Al incluír componentes en un controlador también podemos declarar un grupo de
parametros que serán pasados al constructor del componente.
Estos parametros pueden ser manejados por el componente::

    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

El código anterior pasará un array que contiene precision y randomGenerator a
``MathComponent::__construct()`` como el segundo parámetro. Por convención
si los keys de un array son iguales a las propiedades públicas de un componente,
las propiedades seran actualizadas con los valores de esas keys.


Usando otros componentes en tús componentes
-------------------------------------------

A veces, algunos de tus componentes pueden necesitar usar otros componentes.
En estos casos se puede incluir otros componentes en tús componentes de la
misma forma que se incluyen en un controlador::

    // app/Controller/Component/CustomComponent.php
    App::uses('Component', 'Controller');
    class CustomComponent extends Component {
        // los otros componentes que tu componente usa
        public $components = array('Existing');

        public function initialize(Controller $controller) {
            $this->Existing->foo();
        }

        public function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    App::uses('Component', 'Controller');
    class ExistingComponent extends Component {

        public function foo() {
            // ...
        }
    }

.. note::
    En contraste con los componentes incluidos en un controlador
    ningún callback va a ser disparado en el componente de un componente.

.. _component-api:

API Componentes
===============

.. php:class:: Component

    La clase base Component ofrece varios métodos para cargar otros componentes
    a través de :php:class:`ComponentCollection` así como para tratar con
    configuraciones comunes. También provee prototipos para todos los callbacks de los
    componentes.

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    Constructor para la clase base component. Todos los ``$settings`` que
    también tengan propiedades públicas serán actualizados para coincidir con
    ``$settings``.

Callbacks
---------

.. php:method:: initialize(Controller $controller)

    Es llamado antes que el método beforeFilter de un controlador.

.. php:method:: startup(Controller $controller)

    Es llamado despues de el método beforeFilter pero antes que el
    controlador ejecute la actual acción.

.. php:method:: beforeRender(Controller $controller)

    Es llamada luego que el controlador ejecute la acción de la vista
    solicitada, pero antes que el controlador renderice la vista.

.. php:method:: shutdown(Controller $controller)

    Es llamado antes de que el output sea enviado al navegador.

.. php:method:: beforeRedirect(Controller $controller, $url, $status=null, $exit=true)

    Es llamado cuando el método de redireccion del controlador es llamado,
    pero antes de acción alguna. Si este método devuelve false el controlador
    no continuará hacia el redireccionamiento.

.. meta::
    :title lang=es: Components
    :keywords lang=es: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
