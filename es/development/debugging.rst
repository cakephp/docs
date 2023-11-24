Depuración
##########

La depuración es una parte inevitable y necesaria de cualquier ciclo de desarrollo.
Aunque CakePHP no ofrece ninguna herramienta que se conecte directamente
con algún IDE o editor, CakePHP proporciona varias herramientas para
asistirte en la depuración y exponer lo que se está ejecutando bajo el capó de
tu aplicación.

Depuración Básica
=================

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:

La función ``debug()`` es una función que está disponible globalmente y funciona
de manera similar a la función ``print_r()`` de PHP. La función ``debug()``
te permite mostrar el contenido de una variable de varias maneras.
Primero, si deseas que los datos se muestren de una forma amigable con HTML,
debes establecer el segundo parámetro en ``true``. La función
también imprime la línea y el archivo de origen por defecto.

El resultado de esta función solo se mostrará si la variable ``$debug`` en el archivo core es ``true``.

Ver también ``dd()``, ``pr()`` y ``pj()``.

.. php:function:: stackTrace()

La función ``stackTrace()`` está disponible globalmente, esta permite mostrar
el seguimiento de pila donde sea que se llame.

.. php:function:: breakpoint()

Si tienes `Psysh <https://psysh.org/>` _ instalado, puedes usar esta
función en entornos CLI para abrir una consola interactiva con el
ámbito local actual::

    // Algún código
    eval(breakpoint());

Abrirá una consola interactiva que puede ser usada para revisar variables locales
y ejecutar otro código. Puedes salir del depurador interactivo y reanudar la
ejecución original corriendo ``quit`` o ``q`` en la sesion interactiva.


Usando La Clase Debugger
========================

.. php:namespace:: Cake\Error

.. php:class:: Debugger

Para usar el depurador, primero asegúrate de que ``Configure::read('debug')`` sea ``true``.

Imprimiendo Valores
===================

.. php:staticmethod:: dump($var, $depth = 3)

Dump  imprime el contenido de una variable. Imprimirá todas las
propiedades y métodos (si existen) de la variable que se le pase::

    $foo = [1,2,3];

    Debugger::dump($foo);

    // Salida
    array(
        1,
        2,
        3
    )

    // Objeto simple
    $car = new Car();

    Debugger::dump($car);

    // Salida
    object(Car) {
        color => 'red'
        make => 'Toyota'
        model => 'Camry'
        mileage => (int)15000
    }

Enmascarando Datos
------------------

Al volcar datos con ``Debugger`` o mostrar páginas de error, es posible que desees
ocultar claves sensibles como contraseñas o claves API. En tu ``config/bootstrap.php``
puedes enmascarar claves específicas::

    Debugger::setOutputMask([
        'password' => 'xxxxx',
        'awsKey' => 'yyyyy',
    ]);

Registros Con Trazas De Pila
============================

.. php:staticmethod:: log($var, $level = 7, $depth = 3)

Crea un registro de seguimiento de pila detallado al momento de la invocación. El
método ``log()`` imprime datos similar a como lo hace ``Debugger::dump()``,
pero al debug.log en vez de al buffer de salida. Ten en cuenta que tu directorio
**tmp** (y su contenido) debe ser reescribible por el servidor web para que ``log()``
funcione correctamente.

Generando seguimientos de pila
==============================

.. php:staticmethod:: trace($options)

Devuelve el seguimiento de pila actual. Cada línea de la pila incluye
cuál método llama, incluyendo el archivo y la línea en la que se originó
la llamada::

    // En PostsController::index()
    pr(Debugger::trace());

    // Salida
    PostsController::index() - APP/Controller/DownloadsController.php, line 48
    Dispatcher::_invoke() - CORE/src/Routing/Dispatcher.php, line 265
    Dispatcher::dispatch() - CORE/src/Routing/Dispatcher.php, line 237
    [main] - APP/webroot/index.php, line 84

Arriba está el seguimiento de pila generado al llamar ``Debugger::trace()`` en
una acción de un controlador. Leer el seguimiento de pila desde abajo hacia arriba
muestra el órden de las funciones (cuadros de pila).

Obtener Un Extracto De Un Archivo
=================================

.. php:staticmethod:: excerpt($file, $line, $context)

Saca un extracto de un archivo en $path (el cual es una dirección absoluta),
resalta el número de la línea $line con el número $context de líneas alrededor de este. ::

    pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));

    // Mostrará lo siguiente.
    Array
    (
        [0] => <code><span style="color: #000000"> * @access public</span></code>
        [1] => <code><span style="color: #000000"> */</span></code>
        [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

        [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
        [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
    )

Aunque este método es usado internamente, puede ser útil si estás
creando tus propios mensajes de error o entradas de registros para
situaciones customizadas.

.. php:staticmethod:: Debugger::getType($var)

Consigue el tipo de una variable. Los objetos devolverán el nombre
de su clase.

Usando El Registro Para Depurar
===============================

Registrar mensajes es otra buena manera de depurar aplicaciones, puedes usar
:php:class:`Cake\\Log\\Log` para hacer registros en tu aplicación. Todos los
objetos que usen ``LogTrait`` tienen una instancia del método ``log()`` que
puede ser usado para registrar mensajes::

    $this->log('Llegó aquí', 'debug');

Lo anterior escribiría ``Llegó aquí`` en el registro de depuración. Puedes usar
entradas de registro para ayudar a los métodos de depuración que involucran redireccionamientos
o búcles complejos. También puedes usar :php:meth:`Cake\\Log\\Log::write()` para
escribir mensajes de registro. Este método puede ser llamado estáticamente en
cualquier lugar de tu aplicación que un Log haya sido cargado::

    // En el tope del archivo que quieras hacer registros.
    use Cake\Log\Log;

    // En cualquier parte que Log haya sido importado.
    Log::debug('Llegó aquí');

Kit De Depuración
=================

DebugKit es un complemento que proporciona una serie de buenas herramientas de depuración.
Principalmente, provee una barra de herramientas en el HTML
renderizado, que porporciona una gran cantidad de información sobre tu aplicación
y la solicitud actual. Ver el capítulo :doc:`/debug-kit` para saber cómo instalar
y usar DebugKit.

.. meta::
    :title lang=es: Depuración
    :description lang=es: Depuración CakePHP con la clase Debugger, depurando, depuración básica y usar el plugin DebugKit.
    :keywords lang=es: código extracto,seguimiento de pila,salida por defecto,enlace de error,error por defecto,solicitudes web,reporte de error,depurador,arreglos,maneras diferentes,extraer desde,cakephp,ide,opciones
