Seguridad
#########

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

El componente de seguridad crea una forma de integrar seguridad de forma más estricta
en tu aplicación. Proporciona métodos para diversas tareas como:

* Restringir qué métodos HTTP acepta tu aplicación.
* Protección contra manipulación de formularios.
* Requerir que se utilice SSL.
* Limitación de la comunicación entre controladores.

Como todos los componentes, se configura a través de varios parámetros configurables.
Todas estas propiedades se pueden establecer directamente o a través de métodos setter
del mismo nombre en ``beforeFilter()`` de tu controlador.

Al usar el componente de seguridad, obtienes automáticamente protección contra la 
manipulación de formularios. Los campos token ocultos se insertarán automáticamente 
en los formularios y serán verificados por el componente de seguridad.

Si estas utilizando las funciones de protección de formularios del componente de 
seguridad y otros componentes que procesan datos de formularios en tus devoluciones
de llamada ``startup()``, asegúrate de colocar el componente de seguridad antes de 
esos componentes en tu método ``initialize()``.

.. note::

    Al usar el componente de seguridad, **debes** usar FormHelper para crear tus
    formularios. Además, **no** debes reescribir ninguno de los "nombres" de los
    campos. El componente de seguridad busca ciertos indicadores que son creados
    y manejados por FormHelper (especialmente esos creados en 
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` y 
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). Es probable que la modificación
    dinámica de los campos que se envían en una solicitud POST, como deshabilitar, 
    borrar o crear nuevos campos a través de JavaScript, haga que la solicitud se 
    envíe a la devolución de llamada de blackhole.

    Siempre debes verificar el método HTTP que se utiliza antes de ejecutarlo para
    evitar efectos secundarios. Debes verificar el método HTTP
    o usar :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` para asegurarte
    de que se utiliza el método HTTP correcto.

Manejo de devoluciones de llamada blackhole
===========================================

.. php:method:: blackHole(Controller $controller, string $error = '', ?SecurityException $exception = null)

Si una acción está restringida por el componente de seguridad, es 'black-holed'
como una solicitud no válida que dará como resultado un error 400 por defecto.
Puedes configurar este comportamiento seteando la opción de configuración
``blackHoleCallback`` para una función de devolución de llamada en el controlador.

Al configurar un método de devolución de llamada, puedes personalizar como el
proceso blackhole funciona::

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->Security->setConfig('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type, SecurityException $exception)
    {
        if ($exception->getMessage() === 'Request is not SSL and the action is required to be secure') {
            // Reformule el mensaje de excepción con un string traducible.
            $exception->setMessage(__('Please access the requested page through HTTPS'));
        }

        // Vuelve a lanzar la excepción reformulada condicionalmente.
        throw $exception;

        // Alternativamente, maneja el error. Por ejemplo, configura un mensaje flash &
        // redirige a la versión HTTPS de la página solicitada.
    }

El parámetro ``$type`` puede tener los siguientes valores:

* 'auth' Indica un error de validación de formulario o un error de discrepancia 
  entre controlador y acción.
* 'secure' Indica un error de restricción del método SSL.

Prevención de manipulación de formularios
=========================================

Por defecto, ``SecurityComponent`` evita que los usuarios alteren los formularios
de formas específicas. El ``SecurityComponent`` evitará las siguientes cosas:

* Los campos desconocidos no podrán ser agregados al formulario.
* Los campos no pueden ser eliminados del formulario.
* Los valores en las entradas ocultas no podrán ser modificadas.

La prevención de este tipo de manipulación se logra trabajando con  ``FormHelper``
y rastreando qué campos hay en un formulario. También se realiza un seguimiento
de los valores de los campos ocultos. Todos estos datos se combinan y se convierten
en un hash. Cuando un formulario es enviado, ``SecurityComponent`` usará los datos
POST para construir la misma estructura y comparar el hash.

.. note::

    SecurityComponent **no** evitará que se agreguen/cambien opciones seleccionadas.
    Tampoco impedirá que se agreguen/cambien opciones de radio.

unlockedFields
    Establecer en una lista de campos de formulario para excluir de la validación
    POST. Los campos se pueden desbloquear en el componente o con :php:meth:`FormHelper::unlockField()`.
    Los campos que han sido desbloqueados no están obligados a ser parte del POST
    y los campos desbloqueados ocultos no tienen su valores verificados.

validatePost
    Establece en ``false`` para omitir por completo la validación de las solicitudes
    POST, esencialmente desactivando las validaciones de los formularios.

Uso
===

La configuración del componente de seguridad generalmente se realiza en las
devoluciones de llamada ``initialize`` o ``beforeFilter()`` del controlador::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->Security->setConfig('validatePost', false);
            }
        }
    }

El ejemplo anterior deshabilitaría la prevención de manipulación de formularios
para rutas con prefijo de administrador.

.. _security-csrf:

Protección CSRF
===============

CSRF o Cross Site Request Forgery es una vulnerabilidad común en las aplicaciones
web. Permite a un atacante capturar y reproducir una solicitud anterior, y a veces,
enviar solicitudes de datos utilizando etiquetas de imagen o recursos en otros
dominios. Para habilitar las funciones de protección CSRF.

Deshabilitar la manipulación de formularios para acciones específicas
=====================================================================

Hay muchos casos en los que querrías deshabilitar la prevención de manipulación
de formularios para una acción (por ejemplo, solicitudes AJAX). Puedes "desbloquear"
estas acciones enumerándolas en ``$this->Security->unlockedActions`` en tu
``beforeFilter()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->Security->setConfig('unlockedActions', ['edit']);
        }
    }

Este ejemplo deshabilitaría todas las comprobaciones de seguridad para las acciones
de edición.

.. meta::
    :title lang=es: Seguridad
    :keywords lang=es: parámetros configurables, componente de seguridad, parámetros de configuración, solicitud no válida, funciones de protección, seguridad más estricta, holing, clase php, meth, error 404, período de inactividad, csrf, array, envío, clase de seguridad, deshabilitar seguridad, desbloquear acciones
