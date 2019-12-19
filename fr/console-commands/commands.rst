Commandes de la Console
#######################

.. php:namespace:: Cake\Console
.. php:class:: Command

CakePHP met à disposition des commandes pour accélerer vos développements et automatiser les
tâches routinières. Vous pouvez utiliser ces mêmes librairies pour créer des commandes pour
votre application et vos plugins.

Créer une Commande
==================

Créons maintenant notre première commande. Pour cet exemple, nous allons créer une commande
Hello world toute simple. Dans le répertoire **src/Command** de votre application, créez
**HelloCommand.php**. Mettez dedans le code qui suit::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;

    class HelloCommand extends Command
    {
        public function execute(Arguments $args, ConsoleIo $io)
        {
            $io->out('Hello world.');
        }
    }

Les classes Command doivent avoir une méthode ``execute()`` qui fait la plus grande partie du travail.
Cette méthode est appelée quand une commande est appelée. Appelons la première commande de notre
application, exécutez:

.. code-block:: bash

    bin/cake hello

Vous devriez voir la sortie suivante::

    Hello world.

Notre méthode ``execute()`` n'est pas très intéressente, ajoutons des entrées à partir de la ligne de commande::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class HelloCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser->addArgument('name', [
                'help' => 'What is your name'
            ]);
            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $name = $args->getArgument('name');
            $io->out("Hello {$name}.");
        }
    }


Après avoir sauvegardé ce fichier, vous devriez pouvoir exécuter la commande suivante:

.. code-block:: bash

    bin/cake hello jillian

    # Affiche
    Hello jillian

Définir les Arguments et les Options
====================================

Comme nous avons vu dans le dernier exemple, nous pouvons utiliser la méthode hook ``buildOptionParser()``
pour définir des arguments. Nous pouvons aussi définir des options. Par exemple, nous pouvons ajouter une option
``yell`` à notre ``HelloCommand``::

    // ...
    public function buildOptionParser(ConsoleOptionParser $parser)
    {
        $parser
            ->addArgument('name', [
                'help' => 'What is your name'
            ])
            ->addOption('yell', [
                'help' => 'Shout the name',
                'boolean' => true
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $name = $args->getArgument('name');
        if ($args->getOption('yell')) {
            $name = mb_strtoupper($name);
        }
        $io->out("Hello {$name}.");
    }

Consultez la section :doc:`/console-commands/option-parsers` pour plus d'information.

Créer une Sortie
================

Les commands fournissent une instance ``ConsoleIo`` quand elles sont exécutées. Cet objet vous permet
d'intéragir avec ``stdout``, ``stderr`` et de créer des fichiers. Consultez la section
:doc:`/console-commands/input-output` pour plus d'information.

Utiliser les Models dans les Commands
=====================================

Vous aurez souvent besoin d'accéder à logique applicative dans les commandes console. Vous pouvez charger les models
dans les commandes, comme vous le feriez dans un controller en utilisant ``loadModel()``. Les models chargés sont définis en
propriétés attachés à vos commandes::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->addArgument('name', [
                    'help' => 'What is your name'
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $name = $args->getArgument('name');
            $user = $this->Users->findByUsername($name)->first();

            $io->out(print_r($user, true));
        }
    }

La commande ci-dessus va récupérer un utilisateur par son nom d'utilisateur et afficher les informations stockées dans
la base de données.

Sortir du Code et Arrêter l'Execution
=====================================

Quand vos commandes rencontrent une erreur irrécupérable, vous pouvez utiliser la méthode ``abort()`` pour terminer
l'exécution::

    // ...
    public function execute(Arguments $args, ConsoleIo $io)
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Halt execution, output to stderr, and set exit code to 1
            $io->error('Name must be at least 4 characters long.');
            $this->abort();
        }
    }

Vous pouvez passer tout code de sortie souhaité dans ``abort()``.

.. tip::

    Evitez les codes de sortie 64 - 78, car ils ont une signification particulière décrite par
    ``sysexits.h``. Evitez les codes de sortie au-dessus de 127, car ils sont utilisés pour indiquer une
    de processus par signal tel que SIGKILL ou SIGSEGV.

    Vous pouvez en apprendre plus sur les codes de sortie dans la page sysexit du manuel de la plupart des systèmes
    Unix (``man sysexits``), ou la page d'aide sur les ``Codes de Sortie Système`` dans Windows.

.. _console-integration-testing:

Tester les Commandes
====================

Pour faciliter les tests des applications de console, CakePHP fournit une classe
``ConsoleIntegrationTestCase`` qui peut être utilisée pour tester les applications console
et faire des assertions de résultats.

.. versionadded:: 3.5.0

    ``ConsoleIntegrationTestCase`` a été ajoutée.

Pour commencer à tester votre application console, créez un cas de test qui étend
``Cake\TestSuite\ConsoleIntegrationTestCase``. cette classe contient une méthode
``exec()`` qui est utilisée pour exécuter votre commande. Vous pouvez passer la même chaîne à cette méthode
que ce que vous passeriez dans le CLI.

Commençons avec une commande très simple qui se trouve dans
**src/Command/UpdateTableCommand.php**::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UpdateTableCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser->setDescription('My cool console app');

            return $parser;
        }
    }

Pour écrire un test d'intégration pour ce shell, nous créons un cas de test dans
**tests/TestCase/Command/UpdateTableCommandTest.php** qui étend
``Cake\TestSuite\ConsoleIntegrationTestCase``. Ce shell ne fait pas grand chose pour le
moment, mais testons simplement si la description de notre shell description s'affiche dans ``stdout``::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestCase;

    class UpdateTableCommandTest extends ConsoleIntegrationTestCase
    {
        public function setUp()
        {
            parent::setUp();
            $this->useCommandRunner();
        }

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }
    }

Notre test passe! Bien que ce soit un exemple très facile, cela montre que créer un cas de test d'intégration pour
nos applications de console est assez facile. Continuons par ajouter plus de logique à notre commande::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $table = $args->getArgument('table');
            $this->loadModel($table);
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

C'est un shell plus complet qui a des options obligatoires et de logique associée.
Modifions notre cas de test pour avoir le bout de code suivant::

    namespace Cake\Test\TestCase\Command;

    use Cake\Console\Command;
    use Cake\I18n\FrozenTime;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\ConsoleIntegrationTestCase;

    class UpdateTableCommandTest extends ConsoleIntegrationTestCase
    {
        public $fixtures = [
            // assumes you have a UsersFixture
            'app.users'
        ];

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }

        public function testUpdateModified()
        {
            $now = new FrozenTime('2017-01-01 00:00:00');
            FrozenTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Command::CODE_SUCCESS);

            $user = TableRegistry::get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            FrozenTime::setTestNow(null);
        }
    }

Comme vous pouvez le voir dans la méthode ``testUpdateModified``, nous testons que notre commande
met à jour la table que nous passons en premier argument. Premièrement, nous faisons l'assertion que la commande
sort avec le bon code de sortie ``0``. Ensuite nous vérifions que notre commande a fait le travail, qui est de mettre
à jour la table que nous avons fourni et définit la colonne ``modified`` à la date actuelle.

Souvenez-vous que ``exec()`` va prendre la même chaîne que si vous tapiez dans le CLI, donc vous pouvez inclure des options
et des arguments dans la chaîne de votre commande.

Tester les Shells Interactifs
-----------------------------

Les consoles sont souvent interactives. Tester les shells intéractifs avec la classe
``Cake\TestSuite\ConsoleIntegrationTestCase`` nécessite seulement de passer les entrées en deuxième paramètre
de ``exec()``. Ils doivent être inclus en tableau dans l'ordre dans lequel vous les souhaitez.

Continuons notre exemple de commande, et ajoutons une confirmation intéractive.
Mettez à jour la classe command avec ce qui suit::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $table = $args->getArgument('table');
            $this->loadModel($table);
            if ($io->ask('Are you sure?', 'n', ['y', 'n']) === 'n') {
                $io->error('You need to be sure.');
                $this->abort();
            }
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

Maintenant que nous avons une sous-commande intéractive, nous pouvons ajouter un cas de test qui vérifie
que nous recevons les bonnes réponses et un qui vérifie que nous recevons une réponse incorrecte. Retirez la
méthode ``testUpdateModified`` et ajoutez les méthodes qui suivent dans
**tests/TestCase/Command/UpdateTableCommandTest.php**::


    public function testUpdateModifiedSure()
    {
        $now = new FrozenTime('2017-01-01 00:00:00');
        FrozenTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['y']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = TableRegistry::get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        FrozenTime::setTestNow(null);
    }

    public function testUpdateModifiedUnsure()
    {
        $user = TableRegistry::get('Users')->get(1);
        $original = $user->modified->timestamp;

        $this->exec('my_console best_framework', ['n']);
        $this->assertExitCode(Command::CODE_ERROR);
        $this->assertErrorContains('You need to be sure.');

        $user = TableRegistry::get('Users')->get(1);
        $this->assertSame($original, $user->timestamp);
    }

Dans les premiers cas de test, nous confirmons la question, et les enregistrements sont mis à jour. Dans le deuxième test, nous
ne confirmons pas et les enregistrements ne sont pas mis à jour, et nous pouvons vérifier que le message d'erreur a été écrit
dans ``stderr``.


Tester CommandRunner
--------------------

Pour tester les shells qui sont dispatchés en utilisant la classe ``CommandRunner``, activez la dans vos cas de test
avec la méthode suivante::

    $this->useCommandRunner();

.. versionadded:: 3.5.0

    La classe ``CommandRunner`` a été ajoutée.

Méthodes d'Assertion
--------------------

La classe ``Cake\TestSuite\ConsoleIntegrationTestCase`` fournit un certain nombre de méthodes d'assertion qui
facilitent l'assertion de sorties de consoles::

    // assert that the shell exited with the expected code
    $this->assertExitCode($expected);

    // assert that stdout contains a string
    $this->assertOutputContains($expected);

    // assert that stderr contains a string
    $this->assertErrorContains($expected);

    // assert that stdout matches a regular expression
    $this->assertOutputRegExp($expected);

    // assert that stderr matches a regular expression
    $this->assertErrorRegExp($expected);
