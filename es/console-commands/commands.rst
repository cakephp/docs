Objetos de comando
##################

.. php:namespace:: Cake\Console
.. php:class:: Command

CakePHP viene con una serie de comandos integrados para acelerar tu desarrollo y automatización de tareas rutinarias.
Puede utilizar estas mismas bibliotecas para crear comandos para su aplicación y complementos.

Creando un comando
==================

Creemos nuestro primer comando. Para este ejemplo, crearemos un comando simple Hola mundo. En el directorio
**src/Command** de su aplicación, cree **HelloCommand.php**. Coloca el siguiente código dentro::

    <?php
    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;

    class HelloCommand extends Command
    {
        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $io->out('Hello world.');

            return static::CODE_SUCCESS;
        }
    }

Las clases de comando deben implementar un método ``execute()`` que haga la mayor parte del trabajo. Este método se
llama cuando se invoca un comando. Llamemos a nuestro primer comando de aplicación, ejecute::

.. code-block:: console

    bin/cake hello

Debería ver el siguiente resultado::

    Hello world.

Nuestro método ``execute()`` no es muy interesante, leamos algunas entradas desde la línea de comando::

    <?php
    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class HelloCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser->addArgument('name', [
                'help' => 'What is your name',
            ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $name = $args->getArgument('name');
            $io->out("Hello {$name}.");

            return static::CODE_SUCCESS;
        }
    }


Después de guardar este archivo, debería poder ejecutar el siguiente comando::

.. code-block:: console

    bin/cake hello jillian

    # Outputs
    Hello jillian

Cambiar el nombre del comando predeterminado
============================================

CakePHP usará convenciones para generar el nombre que usan sus comandos en la línea de comando. Si desea sobrescribir
el nombre generado, implemente el método ``defaultName()`` en tu comando::

    public static function defaultName(): string
    {
        return 'oh_hi';
    }

Lo anterior haría que nuestro ``HelloCommand`` fuera accesible mediante ``cake oh_hi`` en lugar de ``cake hello``.

Definición de argumentos y opciones
===================================

Como vimos en el último ejemplo, podemos usar el método ``buildOptionParser()`` para definir argumentos. También
podemos definir opciones. Por ejemplo, podríamos agregar una opción ``yell`` a nuestro ``HelloCommand``::

    // ...
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->addArgument('name', [
                'help' => 'What is your name',
            ])
            ->addOption('yell', [
                'help' => 'Shout the name',
                'boolean' => true,
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if ($args->getOption('yell')) {
            $name = mb_strtoupper($name);
        }
        $io->out("Hello {$name}.");

        return static::CODE_SUCCESS;
    }

Consulte la sección :doc:`/console-commands/option-parsers` para obtener más información.

Creando la salida
=================

Los comandos proporcionan la instancia ``ConsoleIo`` cuando se ejecutan. Este objeto le permite interactuar con
``stdout``, ``stderr`` y crear archivos. Consulte la sección :doc:`/console-commands/input-output` para obtener
más información.

Usar modelos en comandos
========================

Utilice modelos en comandos. A menudo necesitará acceso a la lógica de negocio de su aplicación en los comandos
de la consola. Puede cargar modelos en comandos, tal como lo haría en un controlador usando ``$this->fetchTable()``
ya que el comando usa ``LocatorAwareTrait``::

    <?php
    declare(strict_types=1);

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        // Defina la tabla predeterminada. Esto le permite usar `fetchTable()` sin ningún argumento..
        protected $defaultTable = 'Users';

        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->addArgument('name', [
                    'help' => 'What is your name'
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $name = $args->getArgument('name');
            $user = $this->fetchTable()->findByUsername($name)->first();

            $io->out(print_r($user, true));

            return static::CODE_SUCCESS;
        }
    }

El comando anterior buscará un usuario por nombre de usuario y mostrará la información almacenada en la base de datos.

Códigos de salida y detención de la ejecución
=============================================

Cuando sus comandos alcanzan un error irrecuperable, puede utilizar el método ``abort()`` para finalizar la ejecución::

    // ...
    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Detener la ejecución, enviar a stderr y establecer el código de salida en 1
            $io->error('Name must be at least 4 characters long.');
            $this->abort();
        }

        return static::CODE_SUCCESS;
    }

También puedes usar ``abort()`` en el objeto ``$io`` para emitir un mensaje y código::

    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Detener la ejecución, enviar a stderr y establecer el código de salida en 99
            $io->abort('Name must be at least 4 characters long.', 99);
        }

        return static::CODE_SUCCESS;
    }

Puede pasar cualquier código de salida que desee a ``abort()``.

.. tip::

    Evite los códigos de salida 64 - 78, ya que tienen significados específicos descritos por ``sysexits.h``.
    Evite los códigos de salida superiores a 127, ya que se utilizan para indicar la salida del proceso mediante
    una señal, como SIGKILL o SIGSEGV.

    Puede leer más sobre los códigos de salida convencionales en la página del manual de sysexit en la mayoría de
    los sistemas Unix (``man sysexits``), o en la página de ayuda ``Códigos de error del sistema`` en Windows.

Llamar a otros comandos
========================

Es posible que necesite llamar a otros comandos desde tu comando. Puedes usar ``executeCommand`` para hacer eso::

    // Puede pasar una variedad de opciones y argumentos de CLI.
    $this->executeCommand(OtherCommand::class, ['--verbose', 'deploy']);

    // Puede pasar una instancia del comando si tiene argumentos de constructor
    $command = new OtherCommand($otherArgs);
    $this->executeCommand($command, ['--verbose', 'deploy']);

.. note::

    Al llamar a ``executeCommand()`` en un bucle, se recomienda pasar la instancia ``ConsoleIo`` del comando principal
    como tercer argumento opcional para evitar un posible límite de "archivos abiertos" que podría ocurrir en algunos
    entornos.

Configurando descripción del comando
====================================

Es posible que desee establecer una descripción de comando a través de::

    class UserCommand extends Command
    {
        public static function getDescription(): string
        {
            return 'My custom description';
        }
    }

Esto mostrará la descripción en Cake CLI:

.. code-block:: console

    bin/cake

    App:
      - user
      └─── My custom description

Así como en la sección de ayuda de tu comando:

.. code-block:: console

    cake user --help
    My custom description

    Usage:
    cake user [-h] [-q] [-v]

.. _console-integration-testing:

Pruebas de comandos
===================

Para facilitar las pruebas de aplicaciones de consola, CakePHP viene con un rasgo (trait)
``ConsoleIntegrationTestTrait`` que puede usarse para probar aplicaciones de consola y comparar sus resultados.

Para comenzar a probar su aplicación de consola, cree un caso de prueba que utilice el rasgo
``Cake\TestSuite\ConsoleIntegrationTestTrait``. Este rasgo contiene un método ``exec()`` que se utiliza
para ejecutar su comando. Puede pasar la misma cadena que usaría en la CLI a este método.

.. note::

    Para CakePHP 4.4 en adelante, se debe utilizar el espacio de nombres
    ``Cake\Console\TestSuite\ConsoleIntegrationTestTrait``.

Comencemos con un comando muy simple, ubicado en **src/Command/UpdateTableCommand.php**::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser->setDescription('My cool console app');

            return $parser;
        }
    }

Para escribir una prueba de integración para este comando, crearíamos un caso de prueba en
**tests/TestCase/Command/UpdateTableTest.php** que use el rasgo ``Cake\TestSuite\ConsoleIntegrationTestTrait``.
Este comando no hace mucho por el momento, pero probemos que la descripción de nuestro comando
se muestre en ``stdout``::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }
    }

¡Nuestra prueba pasa! Si bien este es un ejemplo muy trivial, muestra que la creación de un caso de
prueba de integración para aplicaciones de consola puede seguir las convenciones de la línea de comandos.
Sigamos agregando más lógica a nuestro comando::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\DateTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            $this->fetchTable($table)->updateQuery()
                ->set([
                    'modified' => new DateTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

Este es un comando más completo que tiene opciones requeridas y lógica relevante.
Modifique su caso de prueba al siguiente fragmento de código::

    namespace Cake\Test\TestCase\Command;

    use Cake\Command\Command;
    use Cake\I18n\DateTime;
    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        protected $fixtures = [
            // Se supone que tienes un UsersFixture
            'app.Users',
        ];

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }

        public function testUpdateModified()
        {
            $now = new DateTime('2017-01-01 00:00:00');
            DateTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Command::CODE_SUCCESS);

            $user = $this->getTableLocator()->get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            DateTime::setTestNow(null);
        }
    }

Como puede ver en el método ``testUpdateModified``, estamos probando que nuestro comando actualice
la tabla que pasamos como primer argumento. Primero, afirmamos que el comando salió con el código
de estado adecuado, ``0``. Luego verificamos que nuestro comando hizo su trabajo, es decir, actualizamos
la tabla que proporcionamos y configuramos la columna ``modificada`` a la hora actual.

Recuerde, ``exec()`` tomará la misma cadena que escriba en su CLI, por lo que puede incluir
opciones y argumentos en su cadena de comando.

Prueba de shells interactivos
-----------------------------

Las consolas suelen ser interactivas. Probar comandos interactivos con el rasgo
``Cake\TestSuite\ConsoleIntegrationTestTrait`` solo requiere pasar las entradas que espera como segundo
parámetro de ``exec()``. Deben incluirse como una matriz en el orden esperado.

Continuando con nuestro comando de ejemplo, agreguemos una confirmación interactiva.
Actualice la clase de comando a lo siguiente::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\DateTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            if ($io->ask('Are you sure?', 'n', ['y', 'n']) !== 'y') {
                $io->error('You need to be sure.');
                $this->abort();
            }
            $this->fetchTable($table)->updateQuery()
                ->set([
                    'modified' => new DateTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

Ahora que tenemos un subcomando interactivo, podemos agregar un caso de prueba que pruebe que recibimos
la respuesta adecuada y otro que pruebe que recibimos una respuesta incorrecta.
Elimine el método ``testUpdateModified`` y agregue los siguientes métodos a
**tests/TestCase/Command/UpdateTableCommandTest.php**::


    public function testUpdateModifiedSure()
    {
        $now = new DateTime('2017-01-01 00:00:00');
        DateTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['y']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        DateTime::setTestNow(null);
    }

    public function testUpdateModifiedUnsure()
    {
        $user = $this->getTableLocator()->get('Users')->get(1);
        $original = $user->modified->timestamp;

        $this->exec('my_console best_framework', ['n']);
        $this->assertExitCode(Command::CODE_ERROR);
        $this->assertErrorContains('You need to be sure.');

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($original, $user->timestamp);
    }

En el primer caso de prueba, confirmamos la pregunta y se actualizan los registros. En la segunda prueba
no confirmamos y los registros no se actualizan, y podemos verificar que nuestro mensaje de error
fue escrito en ``stderr``.

Metodos de aserción
-------------------

El rasgo ``Cake\TestSuite\ConsoleIntegrationTestTrait`` proporciona una serie de métodos de aserción
que ayudan a afirmar contra la salida de la consola::

    // afirmar que el comando salió con éxito
    $this->assertExitSuccess();

    // afirmar que el comando salió como un error
    $this->assertExitError();

    // afirmar que el comando salió con el código esperado
    $this->assertExitCode($expected);

    // afirmar que la salida estándar contiene un texto
    $this->assertOutputContains($expected);

    // afirmar que stderr contiene una texto
    $this->assertErrorContains($expected);

    // afirmar que la salida estándar coincide con una expresión regular
    $this->assertOutputRegExp($expected);

    // afirmar que stderr coincide con una expresión regular
    $this->assertErrorRegExp($expected);

Ciclo de vida de las devoluciones de llamada
=============================================

Al igual que los controladores, los comandos ofrecen eventos de ciclo de vida que le permiten observar
el marco que llama al código de su aplicación. Los comandos tienen:

- ``Command.beforeExecute`` Se llama antes que el método ``execute()`` de un comando.
  Al evento se le pasa el parámetro ``ConsoleArguments`` como ``args``.
  Este evento no se puede detener ni reemplazar su resultado.
- ``Command.afterExecute`` Se llama después de que se completa el método ``execute()``
  de un comando. El evento contiene ``ConsoleArguments`` como ``args`` y el resultado
  del comando como ``result``. Este evento no se puede detener ni reemplazar su resultado.
