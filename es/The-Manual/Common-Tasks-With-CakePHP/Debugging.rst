Depuración
##########

La depuración es una parte necesaria e inevitable de cualquier ciclo de
desarrollo. Mientras que CakePHP no ofrece ninguna herramienta que se
conecte directamente con ningún editor o IDE, provee de varias
herramientas para ayudar en la depuración y exponer lo que se esta
ejecutando dentro de su aplicación.

Depuración básica
=================

debug($var, $showHTML = false, $showFrom = true)

La función debug() está disponible de forma global, esta trabaja similar
a la función de PHP print\_r(). La función debug() permite mostrar el
contenido de una variable en diferente número de formas. Primero, si
quieres que la data se muestre en formato HTML amigable, establece el
segundo parámetro a true. Por defecto la función muestra la línea y el
archivo donde se origina.

La salida de esta función solo se muestra si la variable debug del core
(app/config/core.php, línea 43) se ha establecido a un valor mayor que
0.

Usando la clase Debugger
========================

Para usar el depurador hay que primero asegurarse que
Configure::read('debug') este seteado a un valor mayor a 0.

dump($var)

Dump muestra el contenido de una variable. Desplegará todas las
propiedades y métodos (si existen) de la variable que se indique.

::

        $foo = array(1,2,3);
        
        Debugger::dump($foo);
        
        //outputs
        array(
            1,
            2,
            3
        )
        
        //objeto simple
        $car = new Car();
        
        Debugger::dump($car);
        
        //despliegue
        Car::
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::acclerate()
        Car::decelerate()
        Car::stop()

log($var, $level = 7)

Crea un log detallado de la traza de ejecución al momento de su
invocación. El método log() genera datos similares a los de
Debugger::dump() pero los envía al archivo debug.log en vez del buffer
de salida. Notar que el directorio app/tmp (y su contenido) debe tener
permisos de escritura para el servidor web para que log() funcione
correctamente.

trace($options)

Retorna la traza de ejecución actual. Cada línea de la traza incluye el
método que fue llamado, incluyendo desde cuál archivo y desde que línea
la llamada se originó.

::

        //En PostsController::index()
        pr( Debugger::trace() );
        
        //despliege
        PostsController::index() - APP/controllers/downloads_controller.php, line 48
        Dispatcher::_invoke() - CORE/cake/dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/cake/dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

Arriba se muestra una traza de ejecución generada llamando a
Debugger::trace() desde una acción de un controlador. Al leer la traza
de ejecución desde abajo hacia arriba se muestra el orden de las
funciones actualmente en ejecución (stack frames). En el ejemplo de
arriba, index.php llamó a Dispatcher::dispatch(), que a su vez llamó a
Dispatcher::\_invoke(). Luego el método \_invoke() llamó a
PostsController::index(). Esta información es útil cuando se trabaja con
operaciones recursivas, ya que se identifican las funciones que estaban
en ejecución al momento de llamar a trace().

excerpt($file, $line, $context)

Toma un extracto desde un archivo en $path (que es una ruta absoluta),
destaca la línea número $line con la cantidad de $context líneas a su
alrededor.

::

        pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );
        
        //se despliegará lo siguiente
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

Aunque este método es usado internamente, te puede ser práctico si estas
creando tus propios mensajes de error o entradas de log en ocasiones
especiales.

exportVar($var, $recursion = 0)

Convierte una variable de cualquier tipo a un string para su uso en el
despliegue del depurador. Este método también es usado mucho por
Debugger para conversiones internas de variables, y puede ser usado
también en tus propios Debuggers.

invoke($debugger)

Reemplazar el Debugger de CakePHP con un nuevo Administrador de Errores.

Clase Debugger
==============

La clase Debugger es nueva en CakePHP 1.2, ofrece muchas opciones para
obtener información de depuración. Tiene muchos métodos que pueden ser
invocados de forma estática, proveyendo volcado, trazabilidad, y
funciones de gestión de errores.

La clase Debugger sobreescribe el manejo de errores por defecto de PHP,
reemplazándolo con información de errores mucho más útil. La depuración
de errores está activa por defecto en CakePHP. Al igual que con todas
las funciones de depuración, se debe establecer Configure::debug a un
valor mayor que 0.

Cuando ocurre un error, el depurador genera dos salidas de información,
una a la página y la otra crea una entrada en el archivo error.log. El
reporte de errores generado contiene tanto la pila de llamadas como un
extracto del código donde ocurrió el error. Haga clic en el enlace
"Error" para ver la pila de llamadas, y el enlace "Code" para ver las
líneas de código causantes del error.
