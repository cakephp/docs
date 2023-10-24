Comandos Entrada/Salida (Input/Output)
######################################

.. php:namespace:: Cake\Console
.. php:class:: ConsoleIo

CakePHP proporciona el objeto ``ConsoleIo`` a los comandos para que puedan
leer interactivamente la información de entrada y salida del usuario.

.. _command-helpers:

Ayudantes de comando (Helpers)
==============================

Se puede acceder y utilizar los ayudantes (helpers) de comandos desde cualquier comando::

    // Generar algunos datos como una tabla..
    $io->helper('Table')->output($data);

    // Obtenga una ayuda de un complemento.
    $io->helper('Plugin.HelperName')->output($data);

También puede obtener instancias de ayudantes y llamar a cualquier método público sobre ellos::

    // Obtenga y utilice Progress Helper.
    $progress = $io->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Creando ayudantes
=================

Si bien CakePHP viene con algunos comandos auxiliares, puedes crear más en tu
aplicación o complementos. Como ejemplo, crearemos un asistente simple para
generar encabezados sofisticados. Primero cree
**src/Command/Helper/HeadingHelper.php** y coloque lo siguiente en él::

    <?php
    namespace App\Command\Helper;

    use Cake\Console\Helper;

    class HeadingHelper extends Helper
    {
        public function output($args)
        {
            $args += ['', '#', 3];
            $marker = str_repeat($args[1], $args[2]);
            $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
        }
    }

Luego podemos usar este nuevo asistente en uno de nuestros comandos de
shell llamándolo::

    // Con ### a cada lado
    $this->helper('Heading')->output(['It works!']);

    // Con ~~~~ a cada lado
    $this->helper('Heading')->output(['It works!', '~', 4]);

Los ayudantes generalmente implementan el método ``output()`` que toma una serie
de parámetros. Sin embargo, debido a que los Console Helpers son clases básicas,
pueden implementar métodos adicionales que toman cualquier forma de argumentos.

.. note::
    Los ayudantes también pueden vivir en ``src/Shell/Helper`` para
    compatibilidad con versiones anteriores.

Ayudantes incorporados
======================

Table Helper
------------

TableHelper ayuda a crear tablas artísticas ASCII bien formateadas.
Usarlo es bastante simple::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $io->helper('Table')->output($data);

        // Outputs
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Puede utilizar la etiqueta de formato ``<text-right>`` en las tablas para
alinear el contenido a la derecha::

        $data = [
            ['Name', 'Total Price'],
            ['Cake Mix', '<text-right>1.50</text-right>'],
        ];
        $io->helper('Table')->output($data);

        // Outputs
        +----------+-------------+
        | Name 1   | Total Price |
        +----------+-------------+
        | Cake Mix |        1.50 |
        +----------+-------------+

Progress Helper
---------------

ProgressHelper se puede utilizar de dos maneras diferentes. El modo simple
le permite proporcionar una devolución de llamada que se invoca hasta que
se completa el progreso::

    $io->helper('Progress')->output(['callback' => function ($progress) {
        // Funciona aqui
        $progress->increment(20);
        $progress->draw();
    }]);

Puede controlar más la barra de progreso proporcionando opciones adicionales:

- ``total`` El número total de elementos en la barra de progreso.
  El valor predeterminado es 100.
- ``width`` El ancho de la barra de progreso. El valor predeterminado es 80.
- ``callback`` La devolución de llamada que se llamará en un bucle para avanzar
  en la barra de progreso.

Un ejemplo de todas las opciones en uso sería::

    $io->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

El asistente de progreso también se puede utilizar manualmente para incrementar
y volver a representar la barra de progreso según sea necesario::

    $progress = $io->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();


Obtener información del usuario
===============================

.. php:method:: ask($question, $choices = null, $default = null)

Al crear aplicaciones de consola interactivas, necesitará obtener información
del usuario. CakePHP proporciona una manera de hacer esto::

    // Obtenga texto arbitrario del usuario.
    $color = $io->ask('What color do you like?');

    // Obtenga una opción del usuario.
    $selection = $io->askChoice('Red or Green?', ['R', 'G'], 'R');

La validación de la selección no distingue entre mayúsculas y minúsculas.

Creando archivos
================

.. php:method:: createFile($path, $contents)

La creación de archivos suele ser una parte importante de muchos comandos de
consola que ayudan a automatizar el desarrollo y la implementación.
El método ``createFile()`` le brinda una interfaz simple para crear archivos
con confirmación interactiva::

    // Crear un archivo con confirmación de sobrescritura
    $io->createFile('bower.json', $stuff);

    // Forzar sobrescritura sin preguntar
    $io->createFile('bower.json', $stuff, true);

Creando salidas (Output)
========================

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

Escribir en ``stdout`` y ``stderr`` es otra operación común en CakePHP::

    // Escribir a stdout
    $io->out('Normal message');

    // Escribir a stderr
    $io->err('Error message');

Además de los métodos de salida básicos, CakePHP proporciona métodos envolventes
que diseñan la salida con colores ANSI apropiados:

    // Texto verde en stdout
    $io->success('Success message');

    // Texto cian en stdout
    $io->info('Informational text');

    // Texto azul en stdout
    $io->comment('Additional context');

    // Texto rojo en stderr
    $io->error('Error text');

    // Texto amarillo en stderr
    $io->warning('Warning text');

El formato de color se desactivará automáticamente si ``posix_isatty`` devuelve
verdadero o si se establece la variable de entorno ``NO_COLOR``.

``ConsoleIo`` proporciona dos métodos convenientes con respecto al nivel
de salida::

    // Solo aparecerá cuando la salida detallada esté habilitada (-v)
    $io->verbose('Verbose message');

    // Aparecería en todos los niveles.
    $io->quiet('Quiet message');

También puedes crear líneas en blanco o dibujar líneas de guiones::

    // Salida 2 nuevas líneas
    $io->out($io->nl(2));

    // Dibuja una línea horizontal
    $io->hr();

Por último, puede actualizar la línea de texto actual en la pantalla::

    $io->out('Counting down');
    $io->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $io->overwrite($i, 0, 2);
    }

.. note::
    Es importante recordar que no puede sobrescribir texto una vez
    que se ha generado una nueva línea.

.. _shell-output-level:

Niveles de salida
=================

Las aplicaciones de consola a menudo necesitan diferentes niveles de detalle.
Por ejemplo, cuando se ejecuta como una tarea cron, la mayor parte del resultado
es innecesario. Puede utilizar niveles de salida para marcar la salida de forma
adecuada. El usuario del shell puede entonces decidir qué nivel de detalle le
interesa configurando el indicador correcto al llamar al comando. Hay 3 niveles:

* ``QUIET`` - Sólo la información absolutamente importante debe marcarse para
  una salida silenciosa.
* ``NORMAL`` - El nivel predeterminado y el uso normal.
* ``VERBOSE`` - Marque los mensajes que pueden ser demasiado ruidosos para el
  uso diario, pero útiles para la depuración como ``VERBOSE``.

Puede marcar la salida de la siguiente manera::

    // Aparecería en todos los niveles.
    $io->out('Quiet message', 1, ConsoleIo::QUIET);
    $io->quiet('Quiet message');

    // No aparecería cuando se alterna la salida silenciosa.
    $io->out('normal message', 1, ConsoleIo::NORMAL);
    $io->out('loud message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

    // Solo aparecería cuando la salida detallada esté habilitada.
    $io->out('extra message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

Puede controlar el nivel de salida de los comandos utilizando las opciones
``--quiet`` y ``--verbose``. Estas opciones se agregan de forma predeterminada
y le permiten controlar consistentemente los niveles de salida dentro de sus
comandos de CakePHP.

Las opciones ``--quiet`` y ``--verbose`` también controlan cómo se envían los
datos de registro a stdout/stderr. Normalmente, la información y los mensajes de
registro superiores se envían a stdout/stderr. Cuando se utiliza ``--verbose``,
los registros de depuración se enviarán a la salida estándar. Cuando se usa
``--quiet``, solo se enviarán a stderr mensajes de advertencia y de registro
superiores.

Estilos en salidas
==================

El estilo de la salida se logra incluyendo etiquetas, al igual que HTML, en la
salida. Estas etiquetas se reemplazarán con la secuencia de códigos ansi
correcta o se eliminarán si estás en una consola que no admite códigos ansi.
Hay varios estilos integrados y puedes crear más. Los incorporados son

* ``success`` Mensajes de éxito. Texto verde.
* ``error`` Mensajes de error. Texto rojo.
* ``warning`` Mensajes de advertencia. Texto amarillo.
* ``info`` Mensajes informativos. Texto cian.
* ``comment`` Texto adicional. Texto azul.
* ``question`` Texto que es una pregunta, agregado automáticamente por shell.

Puede crear estilos adicionales usando ``$io->setStyle()``. Para declarar un
nuevo estilo de salida que podrías hacer::

    $io->setStyle('flashy', ['text' => 'magenta', 'blink' => true]);

This would then allow you to use a ``<flashy>`` tag in your shell output, and if
ansi colours are enabled, the following would be rendered as blinking magenta
text ``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. When
defining styles you can use the following colours for the ``text`` and
``background`` attributes:

Esto le permitiría usar una etiqueta ``<flashy>`` en la salida de su shell, y si
los colores ansi están habilitados, lo siguiente se representaría como texto
magenta parpadeante ``$this->out('<flashy>Whoooa</flashy> Algo salió mal');``.
Al definir estilos, puede utilizar los siguientes colores para los atributos
``text`` y ``background``:

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

También puede utilizar las siguientes opciones como modificadores booleanos,
configurarlas en un valor verdadero las habilita.

* blink
* bold
* reverse
* underline

Agregar un estilo también lo hace disponible en todas las instancias de
ConsoleOutput, por lo que no es necesario volver a declarar estilos para los
objetos stdout y stderr.

Desactivar la coloración
=========================

Aunque el color es bonito, puede haber ocasiones en las que desees apagarlo o forzarlo:

    $io->outputAs(ConsoleOutput::RAW);

Lo anterior pondrá el objeto de salida en modo de salida sin formato. En el modo
de salida sin formato, no se aplica ningún estilo. Hay tres modos que puedes
usar.

* ``ConsoleOutput::COLOR`` - Salida con códigos de escape de color implementados.
* ``ConsoleOutput::PLAIN`` - Salida de texto sin formato, las etiquetas de
  estilo conocidas se eliminarán de la salida.
* ``ConsoleOutput::RAW`` - Salida sin formato, no se realizará ningún estilo ni
  formato. Este es un buen modo para usar si está generando XML o desea depurar
  por qué su estilo no funciona.

De forma predeterminada, en los sistemas \*nix, los objetos ConsoleOutput tienen
una salida de color predeterminada. En los sistemas Windows, la salida simple es
la predeterminada a menos que la variable de entorno ``ANSICON`` esté presente.
