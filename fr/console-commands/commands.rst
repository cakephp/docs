Objets Command
##############

.. php:namespace:: Cake\Console
.. php:class:: Command

CakePHP met à disposition des commandes pour accélerer vos développements et automatiser les
tâches routinières. Vous pouvez utiliser ces mêmes librairies pour créer des commandes pour
votre application et vos plugins.

Créer une Commande
==================

Créons maintenant notre première commande. Pour cet exemple, nous allons créer une commande
Hello world toute simple. Dans le répertoire **src/Command** de votre application, créez
**HelloCommand.php**. Mettez-y le code suivant::

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

Les classes Command doivent avoir une méthode ``execute()`` qui fait la plus grande partie du travail.
Cette méthode est appelée quand une commande est lancée. Appelons la première commande de notre
application, exécutez:

.. code-block:: console

    bin/cake hello

Vous devriez voir la sortie suivante::

    Hello world.

Notre méthode ``execute()`` n'est pas très intéressente, ajoutons des entrées à partir de la ligne de commande::

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
                'help' => 'Quel est votre nom'
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


Après avoir sauvegardé ce fichier, vous devriez pouvoir exécuter la commande suivante:

.. code-block:: console

    bin/cake hello jillian

    # Affiche
    Hello jillian

Changer le Nom Par Défaut de la Commande
========================================

CakePHP va s'appuyer sur des conventions pour générer le nom que vos commandes
utilisent en ligne de commande. Si vous voulez remplacer le nom généré,
implémentez la méthode ``defaultName()`` dans votre commande::

    public static function defaultName(): string
    {
        return 'oh_hi';
    }

Ceci rendrait ``HelloCommand`` accessible par ``cake oh_hi`` au lieu de
``cake hello``.

Définir les Arguments et les Options
====================================

Comme nous avons vu dans le dernier exemple, nous pouvons utiliser la méthode hook ``buildOptionParser()``
pour définir des arguments. Nous pouvons aussi définir des options. Par exemple, nous pouvons ajouter une option
``yell`` à notre ``HelloCommand``::

    // ...
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->addArgument('name', [
                'help' => 'Quel est votre nom'
            ])
            ->addOption('yell', [
                'help' => 'Crier le nom',
                'boolean' => true
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

Consultez la section :doc:`/console-commands/option-parsers` pour plus d'information.

Créer une Sortie
================

Les commands reçoivent une instance ``ConsoleIo`` quand elles sont exécutées.
Cet objet vous permet d'interagir avec ``stdout``, ``stderr`` et de créer des
fichiers. Consultez la section :doc:`/console-commands/input-output` pour plus
d'information.

Utiliser les Models dans les Commands
=====================================

Vous aurez souvent besoin d'accéder à logique métier de votre application depuis
les commandes console. Vous pouvez charger des modèles dans les commandes,
exactement comme vous le feriez dans un controller en utilisant
``$this->fetchTable()``, puisque les commandes utilisent ``LocatorAwareTrait``::

    <?php
    declare(strict types=1);
    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        // Définit la table par défaut. Cela vous permet d'utiliser `fetchTable()` sans argument.
        protected $defaultTable = 'Users';

        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->addArgument('name', [
                    'help' => 'Quel est votre nom'
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

La commande ci-dessus va récupérer un utilisateur par son nom d'utilisateur et afficher les informations stockées dans
la base de données.

Codes de Sortie et Arrêter l'Execution
======================================

Quand vos commandes rencontrent une erreur irrécupérable, vous pouvez utiliser la méthode ``abort()`` pour terminer
l'exécution::

    // ...
    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Halt execution, output to stderr, and set exit code to 1
            $io->error('Name must be at least 4 characters long.');
            $this->abort();
        }

        return static::CODE_SUCCESS;
    }

Vous pouvez aussi utiliser ``abort()`` sur l'objet ``$io`` pour émettre un
message et un code::

    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Arrête l'exécution, affiche vers stderr, et définit le code de sortie à 99
            $io->abort('Le nom doit avoir au moins 4 caractères.', 99);
        }

        return static::CODE_SUCCESS;
    }

Vous pouvez passer n'importe quel code de sortie dans ``abort()``.

.. tip::

    Évitez les codes de sortie 64 - 78, car ils ont une signification
    particulière décrite par ``sysexits.h``. Évitez les codes de sortie
    au-dessus de 127, car ils sont utilisés pour indiquer une sortie de
    processus par signal tel que SIGKILL ou SIGSEGV.

    Vous pouvez en savoir plus à propos des codes de sortie sur la manpage de
    sysexit sur la plupart des systèmes Unix (``man sysexits``), ou la page
    d'aide ``System Error Codes`` sous Windows.

Appeler d'Autres Commandes
==========================

Vous pouvez avoir besoin d'appeler d'autres commandes depuis votre commande.
Pour ce faire, utilisez ``executeCommand``::

    // Vous pouvez passer un tableau d'options CLI et d'arguments.
    $this->executeCommand(OtherCommand::class, ['--verbose', 'deploy']);

    // Possibilité de passer une instance de commande si elle a des arguments de constructeur
    $command = new OtherCommand($otherArgs);
    $this->executeCommand($command, ['--verbose', 'deploy']);

.. note::

    Quand vous appelez ``executeCommand()`` dans une boucle, il est recommandé
    de passer l'instance ``ConsoleIo`` de la commande parente en 3ème argument
    optionnel pour éviter une potentielle limite de fichiers ouverts, ce qui
    pourrait arriver dans certains environnements.

.. _console-command-description:

Définir la Description de la Commande
=====================================

Vous pouvez définir une description de commande via::

    class UserCommand extends Command
    {
        public static function getDescription(): string
        {
            return 'Ma description personnalisée';
        }
    }

Cela affichera votre description dans la CLI de Cake:

.. code-block:: console

    bin/cake

    App:
      - user
      └─── Ma description personnalisée

Ainsi que dans la section *help* de votre commande:

.. code-block:: console

    cake user --help
    Ma description personnalisée

    Usage:
    cake user [-h] [-q] [-v]

.. _console-integration-testing:

Tester les Commandes
====================

Pour faciliter les tests des applications de console, CakePHP fournit le trait
``ConsoleIntegrationTestTrait`` que vous pouvez utiliser pour tester les
applications console et faire des assertions sur leurs résultats.

Pour commencer à tester votre application de console, créez un cas de test qui
utilise le trait ``Cake\TestSuite\ConsoleIntegrationTestTrait``. Ce trait
contient une méthode ``exec()`` qui est utilisée pour exécuter votre commande.
Vous pouvez y passer la même chaîne que celle que vous passeriez en ligne de
commande.

.. note::

    Pour CakePHP 4.4 et au-delà, il faut utiliser le namespace de
    ``Cake\Console\TestSuite\ConsoleIntegrationTestTrait``

Commençons avec une commande très simple qui se trouve dans
**src/Command/UpdateTableCommand.php**::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser->setDescription('Mon application de console super cool');

            return $parser;
        }
    }

Pour écrire un test d'intégration pour ce shell, nous créons un cas de test dans
**tests/TestCase/Command/UpdateTableTest.php** qui utilise le trait
``Cake\TestSuite\ConsoleIntegrationTestTrait``. Ce shell ne fait pas grand chose pour le
moment, mais testons simplement si la description de notre shell description s'affiche dans ``stdout``::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        user ConsoleIntegrationTestTrait;

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('Mon application de console super cool');
        }
    }

Notre test passe! Bien que ce soit un exemple très facile, cela montre que créer
un cas de test d'intégration pour nos applications de console peut suivre les
conventions de la ligne de commande. Continuons en ajoutant plus de logique à
notre commande::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('Mon application de console super cool')
                ->addArgument('table', [
                    'help' => 'Table à mettre à jour',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            $this->fetchTable($table)->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

C'est un shell plus complet qui a des options obligatoires et une logique
associée. Modifions notre cas de test en y intégrant le code suivant::

    namespace Cake\Test\TestCase\Command;

    use Cake\Command\Command;
    use Cake\I18n\FrozenTime;
    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        protected $fixtures = [
            // assume que vous avez une UsersFixture
            'app.Users'
        ];

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('Mon application de console super cool');
        }

        public function testUpdateModified()
        {
            $now = new FrozenTime('2017-01-01 00:00:00');
            FrozenTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Command::CODE_SUCCESS);

            $user = $this->getTableLocator()->get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            FrozenTime::setTestNow(null);
        }
    }

Comme vous pouvez le voir dans la méthode ``testUpdateModified``, nous testons
que notre commande met à jour la table que nous passons en premier argument.
Premièrement, nous faisons l'assertion que la commande se termine avec le bon
code de sortie ``0``. Ensuite nous vérifions que notre commande a fait le
travail, qui est de mettre à jour la table que nous avons fournie et d'insérer
la date et l'heure actuelle dans la colonne ``modified``.

Souvenez-vous que ``exec()`` va prendre la même chaîne que si vous tapiez dans le CLI, donc vous pouvez inclure des options
et des arguments dans la chaîne de votre commande.

Tester les Shells Interactifs
-----------------------------

Les consoles sont souvent interactives. Pour tester les shells interactifs avec
le trait ``Cake\TestSuite\ConsoleIntegrationTestTrait``, vous devez seulement
passer les entrées attendues en deuxième paramètre de ``exec()``. Ils doivent
être présentés dans un tableau dans l'ordre dans lequel vous voulez les passer.

Continuons notre exemple de commande, et ajoutons une confirmation interactive.
Mettez à jour la classe de commande de la façon suivante::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('Mon application de console super cool')
                ->addArgument('table', [
                    'help' => 'Table à mettre à jour',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            $this->loadModel($table);
            if ($io->ask('Êtes-vous sûr ?', 'n', ['o', 'n']) === 'n') {
                $io->error('Vous devez être sûr.');
                $this->abort();
            }
            $this->fetchTable($table)->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

Maintenant que nous avons une sous-commande interactive, nous pouvons ajouter un
cas de test qui vérifie que nous recevons une réponse positive et un qui vérifie
que nous recevons une réponse négative. Retirez la méthode
``testUpdateModified`` et ajoutez les méthodes qui suivent dans
**tests/TestCase/Command/UpdateTableCommandTest.php**::


    public function testUpdateModifiedSure()
    {
        $now = new FrozenTime('2017-01-01 00:00:00');
        FrozenTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['o']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        FrozenTime::setTestNow(null);
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

Dans le premier cas de test, nous confirmons la question, et les enregistrements sont mis à jour. Dans le deuxième test, nous
ne confirmons pas et les enregistrements ne sont pas mis à jour, et nous pouvons vérifier que le message d'erreur a été écrit
dans ``stderr``.

Méthodes d'Assertion
--------------------

Le trait ``Cake\TestSuite\ConsoleIntegrationTestTrait`` fournit de nombreuses
méthodes d'assertion qui aident à vérifier la sortie de la console::

    // vérifie que le shell s'est terminé avec le code attendu
    $this->assertExitCode($expected);

    // vérifie que stdout contient une chaîne de caractères
    $this->assertOutputContains($expected);

    // vérifie que stderr contient une chaîne de caractères
    $this->assertErrorContains($expected);

    // vérifie que stdout répond à une expression régulière
    $this->assertOutputRegExp($expected);

    // vérifie que stderr répond à une expression régulière
    $this->assertErrorRegExp($expected);
