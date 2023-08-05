Componentes
###########

Los componentes son paquetes de lógica que se comparten entre los controladores.
CakePHP viene un con fantástico conjunto de componentes básicos que puedes usar 
para ayudar en varias tareas comunes. También puedes crear tus propios componentes.
Si te encuentras queriendo copiar y pegar cosas entre componentes, deberías considerar
crear tu propio componente que contenga la funcionalidad. Crear componentes mantiene
el código del controlador limpio y te permite rehusar código entre los diferentes
controladores.

Para más información sobre componentes incluidos en CakePHP, consulte el capítulo 
de cada componente:

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling
    /controllers/components/form-protection
    /controllers/components/check-http-cache

.. _configuring-components:

Configurando componentes
========================

Muchos de los componentes principales requieren configuración. Algunos ejemplos 
de componentes que requieren configuración son :doc:`/controllers/components/security`
y :doc:`/controllers/components/form-protection`. La configuración para estos 
componentes, y para los componentes en general, es usualmente hecho a través ``loadComponent()``
en el método ``initialize()`` del controlador o a través del array ``$components``::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection', [
                'unlockedActions' => ['index'],
            ]);
            $this->loadComponent('Csrf');
        }

    }

También puedes configurar los componentes en tiempo de ejecución usando el método
``setConfig()``. A veces, esto es hecho en el método ``beforeFilter()`` del controlador.
Lo anterior podría ser también expresado como::

    public function beforeFilter(EventInterface $event)
    {
        $this->FormProtection->setConfig('unlockedActions', ['index']);
    }

Al igual que los helpers, componentes implementan los métodos ``getConfig()`` y
``setConfig()`` para leer y escribir los datos de configuración::

    // Lee los datos de configuración.
    $this->FormProtection->getConfig('unlockedActions');

    // Escribe los datos de configuración
    $this->Csrf->setConfig('cookieName', 'token');

Al igual que con los helpers, los componentes fusionarán automáticamente su propiedad ``$_defaultConfig``
con la configuración del controlador para crear la propiedad ``$_config`` que es
accesible con ``getConfig()`` y ``setConfig()``.

Componentes de alias
--------------------

Una configuración común para usar es la opción ``className``, que te permite utilizar
componentes de alias. Esta característica es útil cuando quieres reemplazar ``$this->Auth``
u otra referencia común de componente con una implementación personalizada::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize(): void
        {
            $this->loadComponent('Auth', [
                'className' => 'MyAuth'
            ]);
        }
    }

    // src/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent
    {
        // Agrega tu código para sobreescribir el AuthComponent principal
    }

Lo de arriba haría *alias* ``MyAuthComponent`` a ``$this->Auth`` en tus controladores.

.. note::
    El alias de un componente reemplaza esa instancia en cualquier lugar donde se
    use ese componente, incluso dentro de otros componentes.

Carga de componentes sobre la marcha
------------------------------------

Es posible que no necesites todos tus componentes disponibles en cada acción del
controlador. En situaciones como estas, puedes cargar un componente en tiempo de 
ejecución usando el método ``loadComponent()`` en tu controlador::

    // En una acción del controlador
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    Ten en cuenta que los componentes cargados sobre la marcha no perderán devoluciones
    de llamadas. Si te basas en que las devoluciones de llamada ``beforeFilter`` o 
    ``startup`` serán llamadas, necesitarás llamarlas manualmente dependiendo de
    cuándo cargas tu componente.

Uso de componentes
==================

Una vez que hayas incluido algunos componentes a tu controlador, usarlos es bastante
simple. Cada componente que uses se exponen como una propiedad en tu controlador. 
Si cargaste el :php:class:`Cake\\Controller\\Component\\FlashComponent` en tu controlador,
puedes acceder a él de esta forma::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Post deleted.');
                return $this->redirect(['action' => 'index']);
            }
        }
    }

.. note::

    Dado que tanto los modelos como los componentes se agregan a los controladores
    como propiedades, comparten el mismo 'espacio de nombres'. Asegúrate de no
    dar a un componente y un modelo el mismo nombre.

.. _creating-a-component:

Creando un componente
=====================

Supongamos que nuestra aplicación necesita realizar una operación matemática compleja
en muchas partes diferentes de la aplicación. Podríamos crear un componente para
albergar esta lógica compartida para su uso en muchos controladores diferentes.

El primer paso es crear un nuevo archivo de componente y clase. Crea el archivo en 
**src/Controller/Component/MathComponent.php**. La estructura básica para el componente
debería verse algo como esto::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

    Todos los componentes deben extender de :php:class:`Cake\\Controller\\Component`.
    De lo contrario, se disparará una excepción.

Incluyendo tu componente en tus controladores
---------------------------------------------

Una vez que nuestro componente está terminado, podemos usarlo en los controladores
de la aplicación cargándolo durante el método ``initialize()`` del controlador. 
Una vez cargado, el controlador recibirá un nuevo atributo con el nombre del 
componente, a través del cual podemos acceder a una instancia del mismo::

    // En un controlador
    // Haz que el nuevo componente esté disponible en $this->Math,
    // así como el estándar $this->Csrf
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Csrf');
    }

Al incluir componentes en un controlador, también puedes declarar un conjunto de 
parámetros que se pasarán al constructor del componente. Estos parámetros pueden
ser manejados por el componente::

    // En tu controlador.
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ]);
        $this->loadComponent('Csrf');
    }

Lo anterior pasaría el array que contiene precision y randomGenerator a ``MathComponent::initialize()`` 
en el parámetro ``$config``.

Usando otros componentes en tu componente
-----------------------------------------

A veces, uno de tus componentes necesita usar otro componente. Puedes cargar otros
componentes agregándolos a la propiedad `$components`::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // El otro componente que tu componente usa
        protected $components = ['Existing'];

        // Ejecuta cualquier otra configuración adicional para tu componente.
        public function initialize(array $config): void
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
        }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {
        public function foo()
        {
            // ...
        }
    }

.. note::

    A diferencia de un componente incluido en un controlador, no se activarán 
    devoluciones de llamada en el componente de un componente.

Accediendo al controlador de un componente
------------------------------------------

Desde dentro de un componente, puedes acceder al controlador actual a través del 
registro::

    $controller = $this->getController();

Devoluciones de llamadas de componentes
=======================================

Los componentes también ofrecen algunas devoluciones de llamadas de ciclo de vida
de las solicitudes que les permiten aumentar el ciclo de solicitud.

.. php:method:: beforeFilter(EventInterface $event)

    Es llamado antes que el método beforeFilter del controlador, pero *después*
    del método initialize() del controlador.

.. php:method:: startup(EventInterface $event)

    Es llamado después del método beforeFilter del controlador, pero antes de que
    el controlador ejecute la acción actual del manejador.

.. php:method:: beforeRender(EventInterface $event)

    Es llamado después de que el controlador ejecute la lógica de la acción 
    solicitada, pero antes de que el controlador renderize las vistas y el diseño.

.. php:method:: shutdown(EventInterface $event)

    Es llamado antes de enviar la salida al navegador.

.. php:method:: beforeRedirect(EventInterface $event, $url, Response $response)

    Es llamado cuando el método de redirección del controlador es llamado pero
    antes de cualquier otra acción. Si este método devuelve ``false`` el controlador
    no continuará en redirigir la petición. Los parámetros $url y $response permiten
    modificar e inspeccionar la ubicación o cualquier otro encabezado en la respuesta.

.. _redirect-component-events:

Usando redireccionamiento en eventos de componentes
===================================================

Para redirigir desde dentro de un método de devolución de llamada de un componente,
puedes usar lo siguiente::

    public function beforeFilter(EventInterface $event)
    {
        $event->stopPropagation();
        return $this->getController()->redirect('/');
    }

Al detener el evento, le haces saber a CakePHP que no quieres ninguna otra devolución
de llamada de componente para ejecutar, y que el controlador no debe manejar la acción
más lejos. A partir de 4.1.0 puedes generar una ``RedirectException`` para señalar
una redirección::

    use Cake\Http\Exception\RedirectException;
    use Cake\Routing\Router;

    public function beforeFilter(EventInterface $event)
    {
        throw new RedirectException(Router::url('/'))
    }

Generar una excepción detendrá todos los demás detectores de eventos y creará
una nueva respuesta que no conserva ni hereda ninguno de los encabezados de la respuesta
actual. Al generar una ``RedirectException`` puedes incluir encabezados adicionales::

    throw new RedirectException(Router::url('/'), 302, [
        'Header-Key' => 'value',
    ]);

.. versionadded:: 4.1.0

.. meta::
    :title lang=es: Componentes
    :keywords lang=es: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc

