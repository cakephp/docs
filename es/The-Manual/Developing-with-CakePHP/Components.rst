Componentes
###########

 

Introducción
============

Los componentes son paquetes de lógica que son compartidos entre los
controladores. Si tiene ganas de copiar y pegar código de un controlador
a otro, debería antes considerar agrupar algunas funcionalidades en un
componente.

CakePHP incluye un conjunto fantástico de componentes listos para usar
para conseguir ayuda con:

-  Seguridad
-  Sesiones
-  Lista de control de acceso (ACL)
-  Emails
-  Cookies
-  Autenticación
-  Manejo de pedidos (Requests)

Cada uno de estos componentes del núcleo (Core) son detallados en su
propio capitulo. Por el momento, veremos como crear sus propios
componentes. Con esto ayudará a mantener el código de los controladores
limpio y le será mas sencillo reusar código entre proyectos.

Configuración de componentes.
=============================

Muchos de los componentes básicos requieren ser configurados. Algunos
ejemplos de componentes que requieren ser configurados son:
`Auth <https://book.cakephp.org/view/172/Authentication>`_,
`Cookie <https://book.cakephp.org/view/177/Cookies>`_ e
`Email <https://book.cakephp.org/view/176/Email>`_. Toda la configuración
de estos componentes y los componentes en general se hacen en el método
del controlador ``beforeFilter()``.

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }

El código anterior sería un ejemplo de configuración de las variables de
componente del controlador ``beforeFilter()``

Creando Componentes a medida
============================

Supongamos que nuestra aplicación online necesita efectuar una compleja
operación matemática en muchas partes de la aplicación. Creariamos un
componente que albergara esa lógica compartida para poder ser usada en
diferentes controladores

El primer paso es crear una nueva clase y fichero de componente. Crea el
fichero en /app/controllers/components/math.php. La estructura básica
para el componente quedaría así.

::

    <?php

    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

    ?>

Añadiendo Componentes a tus Controladores
-----------------------------------------

Una vez finalizado nuestro componente, podemos usarlo en los
controladores de la aplicación añadiendo su nombre (excepto la parte
"*Component*\ " al array *$components* del controlador. Automáticamente,
el controlador recibirá un nuevo atributo con un nombre a partir del
nombre del componente, a través del cual podremos acceder a una
instancia del mismo:

::

    /* Hace el nuevo componente accesible en $this->Math,
    al igual que el standard $this->Session */
    var $components = array('Math', 'Session');

Los componentes declarados en *AppController* serán combinados con los
de tus otros controladores, así que no hay necesidad de redeclarar el
mismo componente dos veces.

Cuando se incluyen Componentes a un Controlador tambien puedes declarar
un conjunto de parámetros que serán pasados al método *intialize()* de
los Componentes. Estos parámetros pueden ser manejados por el
Componente.

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

Este código pasaría el array conteniendo *precision* y *randomGenerator*
al método *intialize()* de MathComponent como segundo parámetro.

Por ahora, esta sintaxis no está implementada por ninguno de los
Componentes Core

Acceso a clases MVC dentro de componentes
-----------------------------------------

Para acceder a la instancia del controlador desde tu recien creado
componente, necesitarás implementar el método *initialize()* o el
*startup()*. Estos métodos especiales llevan una referencia al
controlador como primer parámetro y son llamados automáticamente. El
método *initialize()* es llamado antes del método *beforeFilter()*, y el
método *startup()* después del método *beforeFilter*. Si por algún
motivo no deseas que el método *startup()* sea llamado cuando el
controlador está inicializando cosas, dale el valor *true* a la variable
*$disableStartup*.

Si deseas insertar algún código de lógica antes de que el controlador
*beforeFilter()* sea llamado, necesitarás usar el método *initialize()*
del componente.

::

    <?php
    class CheckComponent extends Object {
        //llamado antse de  Controller::beforeFilter()
        function initialize(&$controller) {
            // salvando la referencia al controlador para uso posterior
            $this->controller =& $controller;
        }

        //llamado tras Controller::beforeFilter()
        function startup(&$controller) {
        }

        function redirectSomewhere($value) {
            // ulizando un método de controlador
            $this->controller->redirect($value);
        }
    }
    ?>

También podrias querer utilizar otros componentes dentro del componente
a medida. Para ello, simplemente crea una variable de clase
*$components* (tal como lo harías en un controlador ) como un array que
contenga los nombres de los componentes que quieres utilizar.

::

    <?php
    class MyComponent extends Object {

        // Este componente usa otros componentes
        var $components = array('Session', 'Math');

        function doStuff() {
            $result = $this->Math->doComplexOperation(1, 2);
            $this->Session->write('stuff', $result);
        }

    }
    ?>

No es muy recomendable acceder o usar un modelo en un componente, pero
si tras sopesar las posibilidades eso es lo que quieres hacer, tendrás
que instanciar tu clase modelo y usarla manualmente. Aquí tienes un
ejemplo:

::

    <?php
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }

        function doUberComplexOperation ($amount1, $amount2) {
            $userInstance = ClassRegistry::init('User');
            $totalUsers = $userInstance->find('count');
            return ($amount1 + $amount2) / $totalUsers;
        }
    }
    ?>

Usando Componentes en tu Componente
-----------------------------------

A veces uno de tus componentes puede depender de otro. Si las
funcionalidades que estos componentes proveen no están relacionados,
excepto por su dependencia el uno del otro, entonces no querrás ponerlos
dentro de un solo componente.

En cambio puedes hacer que tu componente sea un "Padre" e indicarle con
el array ``$components`` la lista de sus "Hijos". Los componentes padres
se cargan antes que sus componentes hijos, y cada componente hijo tiene
acceso a su padre.

Declaración del padre:

::

    <?php
    class PadreComponent extends Object {
        var $name = "Padre";
        var $components = array( "Hijo" );

        function initialize(&$controller) {
            $this->Hijo->foo();
        }

        function bar() {
            // ...
        }
    }

Declaración del hijo:

::

    <?php
    class HijoComponent extends Object {
        var $name = "Hijo";

        function initialize(&$controller) {
            $this->Padre->bar();
        }

        function foo() {
            // ...
        }
    }

