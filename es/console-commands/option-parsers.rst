Opcion de analizadores (Parsers)
#################################

.. php:namespace:: Cake\Console
.. php:class:: ConsoleOptionParser

Las aplicaciones de consola normalmente toman opciones y argumentos como la
forma principal de obtener información del terminal en sus comandos.

Definición de un OptionParser
=============================

Los comandos y shells proporcionan un método de enlace
``buildOptionParser($parser)`` que puede utilizar para definir las opciones y
argumentos de sus comandos::

    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        // Defina sus opciones y argumentos.

        // Devolver el analizador completo
        return $parser;
    }

Las clases Shell usan el método de enlace ``getOptionParser()`` para definir su analizador de opciones::

    public function getOptionParser()
    {
        // Obtenga un analizador vacío del marco.
        $parser = parent::getOptionParser();

        // Defina sus opciones y argumentos.

        // Devolver el analizador completo
        return $parser;
    }


Usando argumentos
=================

.. php:method:: addArgument($name, $params = [])

Los argumentos posicionales se utilizan con frecuencia en herramientas de línea
de comandos, y ``ConsoleOptionParser`` le permite definir argumentos
posicionales así como hacerlos obligatorios. Puede agregar argumentos uno a la
vez con ``$parser->addArgument();`` o varios a la vez con
``$parser->addArguments();``::

    $parser->addArgument('model', ['help' => 'The model to bake']);

Puede utilizar las siguientes opciones al crear un argumento:

* ``help`` El texto de ayuda que se mostrará para este argumento.
* ``required`` Si este parámetro es necesario.
* ``index`` El índice del argumento, si no se define, el argumento se colocará
  al final de los argumentos. Si define el mismo índice dos veces, se
  sobrescribirá la primera opción.
* ``choices`` Una serie de opciones válidas para este argumento. Si se deja
  vacío, todos los valores son válidos. Se generará una excepción cuando parse()
  encuentre un valor no válido.

Los argumentos que se han marcado como obligatorios generarán una excepción al
analizar el comando si se han omitido. Entonces no tienes que manejar eso en tu
shell.

Agregar múltiples argumentos
----------------------------

.. php:method:: addArguments(array $args)

Si tiene una matriz con múltiples argumentos, puede usar
``$parser->addArguments()`` para agregar múltiples argumentos a la vez. ::

    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true],
    ]);

Al igual que con todos los métodos de creación de ConsoleOptionParser,
addArguments se puede utilizar como parte de una cadena de métodos fluida.

Validación de Argumentos
------------------------

Al crear argumentos posicionales, puede utilizar el indicador ``required`` para
indicar que un argumento debe estar presente cuando se llama a un shell. Además,
puedes usar ``choices`` para forzar que un argumento provenga de una lista de
opciones válidas::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco'],
    ]);

Lo anterior creará un argumento que es obligatorio y tiene validación en la
entrada. Si falta el argumento o tiene un valor incorrecto, se generará una
excepción y se detendrá el shell.

Usando opciones
===============

.. php:method:: addOption($name, array $options = [])

Las opciones o indicadores se utilizan en las herramientas de línea de comandos
para proporcionar argumentos clave/valor desordenados para sus comandos. Las
opciones pueden definir alias tanto detallados como cortos. Pueden aceptar un
valor (por ejemplo, ``--connection=default``) o ser opciones booleanas(por
ejemplo, ``--verbose``). Las opciones se definen con el método ``addOption()``::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

Lo anterior le permitiría usar ``cake myshell --connection=other``,
``cake myshell --connection other`` o ``cake myshell -c other``
al invocar el shell.

Los modificadores booleanos no aceptan ni consumen valores, y su presencia
simplemente los habilita en los parámetros analizados::

    $parser->addOption('no-commit', ['boolean' => true]);

Esta opción, cuando se usa como ``cake mycommand --no-commit something``,
tendría un valor de ``true`` y 'something' se trataría como un argumento posicional.

Al crear opciones, puede utilizar las siguientes opciones para definir el
comportamiento de la opción:

* ``short`` - La variante de una sola letra para esta opción, déjela sin definir
  para ninguna.
* ``help`` - Texto de ayuda para esta opción. Se utiliza al generar ayuda para
  la opción.
* ``default`` - El valor predeterminado para esta opción. Si no se define, el
  valor predeterminado será ``true``.
* ``boolean`` - La opción no utiliza ningún valor, es solo un modificador booleano.
   El valor predeterminado es ``false``.
* ``multiple`` - La opción se puede proporcionar varias veces. La opción
  analizada será una matriz de valores cuando esta opción esté habilitada.
* ``choices`` - Una serie de opciones válidas para esta opción. Si se deja
  vacío, todos los valores son válidos. Se generará una excepción cuando parse()
  encuentre un valor no válido.

Agregar múltiples opciones
--------------------------

.. php:method:: addOptions(array $options)

Si tiene una matriz con múltiples opciones, puede usar ``$parser->addOptions()``
para agregar múltiples opciones a la vez. ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node'],
    ]);

Al igual que con todos los métodos de creación de ConsoleOptionParser,
addOptions se puede utilizar como parte de una cadena de métodos fluida.

Validación de Opciones
----------------------

Las opciones pueden contar con un conjunto de opciones de manera muy similar a
como lo pueden ser los argumentos posicionales. Cuando una opción tiene opciones
definidas, esas son las únicas opciones válidas para una opción. Todos los demás
valores generarán una ``InvalidArgumentException``::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine'],
    ]);

Usando opciones booleanas
-------------------------

Las opciones se pueden definir como opciones booleanas, que son útiles cuando
necesitas crear algunas opciones de bandera. Al igual que las opciones con
valores predeterminados, las opciones booleanas siempre se incluyen en los
parámetros analizados. Cuando las banderas están presentes, se establecen
``true``; cuando están ausentes, se establecen en ``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

La siguiente opción siempre tendría un valor en el parámetro analizado. Cuando
no se incluye, su valor predeterminado será ``false`` y, cuando se defina,
será ``true``.

Construyendo una consola OptionParser a partir de una matriz
------------------------------------------------------------

.. php:method:: buildFromArray($spec)

Como se mencionó anteriormente, al crear analizadores de opciones de subcomando,
puede definir la especificación del analizador como una matriz para ese método.
Esto puede ayudar a facilitar la creación de analizadores de subcomandos, ya que
todo es una matriz::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any)."),
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')],
            ],
        ],
    ]);

Dentro de las especificaciones del analizador, puede definir claves para
``arguments``, ``options``, ``description`` y ``epilog``. No se pueden definir
``subcommands`` dentro de un generador de estilos de matriz. Los valores de los
argumentos y las opciones deben seguir el formato :php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` y
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions( )`. También puede
utilizar buildFromArray por sí solo para crear un analizador de opciones::

    public function getOptionParser()
    {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')],
            ],
        ]);
    }

Fusionar analizadores de opciones
---------------------------------

.. php:method:: merge($spec)

Al crear un comando de grupo, es posible que desee combinar varios analizadores
para esto::

    $parser->merge($anotherParser);

Tenga en cuenta que el orden de los argumentos para cada analizador debe ser el
mismo y que las opciones también deben ser compatibles para que funcione. Así
que no utilices claves para cosas diferentes.

Obtener ayuda de comandos
==========================

Al definir sus opciones y argumentos con el analizador de opciones, CakePHP
puede generar automáticamente información de ayuda rudimentaria y agregar
``--help`` y ``-h`` a cada uno de sus comandos. El uso de una de estas opciones
le permitirá ver el contenido de ayuda generado:

.. code-block:: console

    bin/cake bake --help
    bin/cake bake -h

Ambos generarían la ayuda para hornear. También puede obtener ayuda para
comandos anidados:

.. code-block:: console

    bin/cake bake model --help
    bin/cake bake model -h

Lo anterior le brindará ayuda específica para el comando ``bake model``.

Obtener ayuda como XML
----------------------

Al crear herramientas automatizadas o herramientas de desarrollo que necesitan
interactuar con los comandos de CakePHP, es bueno tener ayuda disponible en un
formato que la máquina pueda analizar. Al proporcionar la opción ``xml`` al
solicitar ayuda, puede obtener el contenido de la ayuda como XML:

.. code-block:: console

    cake bake --help xml
    cake bake -h xml

Lo anterior devolvería un documento XML con la ayuda, opciones, argumentos y
subcomandos generados para el shell seleccionado. Un documento XML de muestra
se vería así:

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

Personalización de salida de la ayuda
=====================================

Puede enriquecer aún más el contenido de ayuda generado agregando una
descripción y un epílogo.

Establecer la descripción
-------------------------

.. php:method:: setDescription($text)

La descripción se muestra encima de la información del argumento y la opción.
Al pasar una matriz o una cadena, puede establecer el valor de la descripción::

    // Establecer varias líneas a la vez
    $parser->setDescription(['line one', 'line two']);

    // Leer el valor actual
    $parser->getDescription();

Establecer el epílogo
---------------------

.. php:method:: setEpilog($text)

Obtiene o establece el epílogo del analizador de opciones. El epílogo se muestra
después de la información del argumento y la opción. Al pasar una matriz o una
cadena, puede establecer el valor del epílogo::

    // Establecer varias líneas a la vez
    $parser->setEpilog(['line one', 'line two']);

    // Leer el valor actual
    $parser->getEpilog();
