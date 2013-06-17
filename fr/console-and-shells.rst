Console et Shells
#################

CakePHP ne dispose pas seulement d'un framework web mais aussi d'une console 
de framework pour la création d'applications. Les applications par console 
sont idéales pour la gestion d'une variété de tâches d'arrière-plan comme la 
maintenance et l'achèvement du travail en-dehors du cycle de requête-réponse. 
Les applications par la console CakePHP vous permettent de réutilise les 
classes de votre application à partir de lignes de commande.

CakePHP dispose d'un certain nombre d'applications fournies pour la console.
Certaines de ces applications sont utilisées de concert avec les 
fonctionnalités de CakePHP (comme ACL ou i18n), et d'autres sont pour 
une utilisation générale pour que votre travail se fasse plus vite.

La console de CakePHP
=====================

Cette section fournit une introduction sur la ligne de commande dans CakePHP.
Si vous avez besoin d'accéder à vos classes MVC de CakePHP dans une tâche cron 
ou tout autre script de ligne de commande, cette section est pour vous.

PHP fournit un puissant client CLI qui rend l'interfaçage avec votre système 
de fichier et vos applications plus facile. La console CakePHP fournit un 
framework de création de scripts shell. La console utilise un ensemble de 
répartiteur de types pour charger un shell ou une tâche, et lui passer des 
paramètres.

.. note::

    Une installation de PHP contruite avec la ligne de commande (CLI) doit 
    être disponible sur le système où vous prévoyez d'utiliser la console.

Avant d'entrer dans les spécificités, assurons-nous que vous pouvez exécuter 
la console CakePHP. Tout d'abord, vous devrez ouvrir un shell système. Les 
exemples présentés dans cette section sont issus du bash, mais la console 
CakePHP est également compatible Windows. Exécutons le programme Console 
depuis le bash. Cet exemple suppose que l'utilisateur est actuellement 
connecté dans l'invite bash et qu'il est root sur une installation CakePHP.

Les applications CakePHP contiennent un répertoire ``Console`` qui contient 
tous les shells et les tâches pour une application. Il est aussi livré avec 
un exécutable::

    $ cd /path/to/cakephp/app
    $ Console/cake

Mais il est préférable d'ajouter l'exécutable du coeur de cake dans votre 
système de path afin que vous puissiez utiliser la commande cake de partout.
C'est plus pratique quand vous créez de nouveaux projets. Regardez 
:ref:`adding-cake-to-your-path` pour voir la façon de rendre ``cake`` 
disponible dans tout le système.

Lancez la Console avec aucun argument entraîne ce message d'aide::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /path/to/cakephp/app/
    ---------------------------------------------------------------
    Current Paths:

     -app: app
     -working: /path/to/cakephp/app
     -root: /path/to/cakephp/
     -core: /path/to/cakephp/core

    Changing Paths:

    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/cakephp/app or -app /absolute/path/to/cakephp/app

    Available Shells:

     acl [CORE]                              i18n [CORE]
     api [CORE]                              import [app]
     bake [CORE]                             schema [CORE]
     command_list [CORE]                     testsuite [CORE]
     console [CORE]                          upgrade [CORE]

    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

La première information affichée est en rapport avec les chemins. Ceci est 
particulièrement pratique si vous exécutez la Console depuis différents 
endroits de votre système de fichier.

Beaucoup d'utilisateurs ajoutent la console CakePHP à leur path système 
afin qu'elle puisse être facilement accessible. L'affichage des chemins de 
workdir, root, app et corevous permet de voir où la Console fera des 
changements. Pour changer le dossier app par celui dans lequel vous souhaitez 
travailler, vous pouvez fournir son chemin comme premier argument de la ligne 
de commande cake. L'exemple suivant montre comment spécifier un dossier app, 
en supposant que vous avez déjà ajouté le dossier de la console à votre 
``PATH`` ::

    $ cake -app /path/to/cakephp/app

Le chemin fourni peut être relatif au répertoire courant ou fourni sous 
forme de chemin absolu.

.. _adding-cake-to-your-path:

Ajouter cake à votre système path
---------------------------------

Si vous êtes sur un système \*nix (linux, MacOSX), les étapes suivantes vous
permettront de rendre cake executable dans votre système path.

#. Localisez où se trouve votre installation de cakephp et le cake executable. 
   Par exemple ``/Users/mark/cakephp/lib/Cake/Console/cake``
#. Modifiez votre fichier ``.bashrc`` ou ``.bash_profile`` dans votre 
   répertoire home, et ajoutez ce qui suit::

    export PATH="$PATH:/Users/mark/cakephp/lib/Cake/Console"

#. Rechargez la configuration bash ou ouvrez un nouveau terminal, et 
   ``cake`` devrait fonctionner n'importe où.

Si vous êtes sur Windows Vista ou 7, vous devrez suivre les étapes suivantes.

#. Localisez l'emplacement où se trouvent votre installation CakePHP et
   l'executable cake. Par exemple
   ``C:\xampp\htdocs\cakephp\lib\Cake\Console``
#. Ouvrez la fenêtre des propriétés du Système de votre ordinateur. Vous
   essaierez le raccourci clavier Windows Key + Pause ou Windows Key + Break.
   Ou, à partir du Bureau, faîtes un click droit sur Mon Ordinateur, clickez
   sur Propriétés et clickez sur le lien Paramètres avancés du système dans la
   colonne de gauche.
#. Allez sous l'onglet Avancé et clickez sur le bouton des Variables
   d'Environnement.
#. Dans la portion des Variables Sytèmes, cherchez le chemin de la variable
   et double-clickez dessus pour la modifier.
#. Ajoutez le chemin de l'installation de ``cake`` suivi par un point virgule.
   On pourrait avoir par exemple::

    %SystemRoot%\system32;%SystemRoot%;C:\xampp\htdocs\cakephp\lib\Cake\Console;

#. Clickez Ok et ``cake`` devrait fonctionner partout.

Créer un shell
==============

Créons un shell pour l'utilisation dans la Console. Pour cet exemple, nous
créerons un simple shell Hello world. Dans le répertoire ``Console/Command``
de votre application, créez ``HelloShell.php``. Mettez le code suivant
dedans::

    <?php 
    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }
    }

Les conventions pour les classes de shell sont que les noms de classe doivent 
correspondre au nom du fichier, avec Shell en suffixe. Dans notre shell, nous 
avons crée une méthode ``main()``.
Cette méthode est appelée quand un shell est appelé avec aucune commande
supplémentaire. Nous allons ajouter quelques commandes en plus dans un moment,
mais pour l'instant lançons juste notre shell. Depuis le répertoire de votre
application, lancez::

    Console/cake hello

Vous devriez voir la sortie suivante::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/app/
    ---------------------------------------------------------------
    Hello world.

Comme mentionné avant, la méthode ``main()`` dans les shells est une méthode
spéciale appelée tant qu'il n'y a pas d'autres commandes ou arguments donnés au
shell. Vous pouvez aussi remarquer que HelloShell étend ``AppShell``. Un peu
comme :ref:`app-controller`, AppShell vous donne une classe de base pour
contenir toutes les fonctions ordinaires ou logiques. Vous pouvez définir un
AppShell en créant ``app/Console/Command/AppShell.php``.  Si vous n'en avez pas
un, CakePHP en utilisera une integrée. Comme notre méthode principale n'était
pas très intéressente, ajoutons une autre commande qui fait quelque chose::

    <?php 
    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }

        public function hey_there() {
            $this->out('Hey there ' . $this->args[0]);
        }
    }

Après avois sauvegardé ce fichier, vous devriez être capable de lancer 
``Console/cake hello hey_there your-name``  et de voir vos noms affichés.
Toute méthode publique non préfixée par un ``_`` peut être appelée à partir 
de ligne de commande. Dans notre méthode ``hey_there``, nous utilisons aussi 
``$this->args``, cette propriété contient un tableau de tous les arguments 
de position fournis à une commande. Vous pouvez aussi utiliser des switches 
ou des options sur les shells des applications, ils sont disponibles dans la 
variable ``$this->params``, mais nous verrons ça bientôt.

Lorsque vous utilisez la méthode ``main()``, vous n'êtes pas capable d'utiliser 
les arguments de position ou les paramètres. Cela parce que le premier argument 
de position ou l'option est interprétée en tant que nom de commande. Si vous 
voulez utiliser des arguments et des options, vous devriez utiliser un autre 
nom de méthode que ``main``.

Utiliser les Models dans vos shells
-----------------------------------

Vous avez souvent besoin d'accéder à la logique métier de votre application 
dans les utilitaires de shell. CakePHP rend cela super facile. En configurant 
une propriété ``$uses``, vous pouvez définir un tableau de models auxquels 
vous voulez accéder dans votre shell. Les models définis sont chargés en 
propriétés attachées à votre shell, juste comme un controller obtient les 
models qui lui sont attachés::

    class UserShell extends AppShell {
        public $uses = array('User');

        public function show() {
            $user = $this->User->findByUsername($this->args[0]);
            $this->out(print_r($user, true));
        }
    }

Le shell ci-dessus récupérera un utilisateur par son username et affichera 
l'information stockée dans la base de données.

Les tâches Shell
================

Il y aura des fois où quand vous construirez des applications plus poussées 
via la console, vous voudrez composer des fonctionnalités dans des classes 
réutilisables qui peuvent être partagées à travers plusieurs shells. Les 
tâches vous permettent d'extraire des commandes dans des classes. Par exemple, 
``bake`` est fait entièrement de tâches. Vous définissez les tâches d'un 
shell en utilisant la propriété ``$tasks``::

    <?php 
    class UserShell extends AppShell {
        public $tasks = array('Template');
    }

Vous pouvez utiliser les tâches à partir de plugins en utilisant la 
:term:`plugin syntax` standard. Les tâches sont stockées dans 
``Console/Command/Task/`` dans les fichiers nommées d'après leur 
classe. Ainsi si vous étiez sur le point de créer une nouvelle 
tâche 'FileGenerator', vous pourriez créer 
``Console/Command/Task/FileGeneratorTask.php``.

Chaque tâche doit au moins intégrer une méthode ``execute()``. Le 
ShellDispatcher appelera cette méthode quand la tâche est invoquée. 
une classe de tâche ressemble à cela::

    class FileGeneratorTask extends Shell {
        public $uses = array('User');
        public function execute() {

        }
    }

Un shell peut aussi accéder à ses tâches en tant que propriétés, ce qui 
rend les tâches meilleures pour la réutilisation de focntions identiques à 
:doc:`/controllers/components`::

    <?php 
    // trouvé dans Console/Command/SeaShell.php
    class SeaShell extends AppShell {
        public $tasks = array('Sound'); // trouvé dans Console/Command/Task/SoundTask.php
        public function main() {
            $this->Sound->execute();
        }
    }

Vous pouvez aussi accéder aux tâches directement à partir de la ligne de 
commande::

    $ cake sea sound

.. note::

    Afin d'accéder aux tâches directement à partir de ligne de commande, la 
    tâche **doit** être inclue dans la propriété $tasks de la classe shell. 
    Pour ce faire, soyez averti qu'une méthode appelée “sound” dans la classe 
    SeaShell redéfinira la capacité d'accès à la fonctionnalité dans la 
    tâche Sound spécifiée dans le tableau $tasks.

Chargement à la volée des tâches avec TaskCollection
----------------------------------------------------

Vous pouvez charger les tâches à la volée en utilisant l'objet Task Collection. 
Vous pouvez charger les tâches qui ne sont pas déclarées dans $tasks de cette 
façon::

    $Project = $this->Tasks->load('Project');

Chargera et retournera une instance ProjectTask. Vous pouvez charger les tâches 
à partir des plugins en utilisant::

    $ProgressBar = $this->Tasks->load('ProgressBar.ProgressBar');

.. _invoking-other-shells-from-your-shell:

Invoquer d'autres shells à partir de votre shell
================================================

Les Shells n'ont plus directement accès à ShellDispatcher, à travers `$this->Dispatch`. 
Il y a cependant beaucoup de cas où vous voulez invoquer un shell à partir d'un autre.
`Shell::dispatchShell()` vous donne la possibilité d'appeler d'autres shells en 
fournissant le `argv` pour le shell sub. Vous pouvez fournir des arguments et des 
options soit en variables args ou en chaînes de caractères::

    // En chaînes de caractère
    $this->dispatchShell('schema create Blog --plugin Blog');

    // En tableau
    $this->dispatchShell('schema', 'create',  'Blog', '--plugin',  'Blog');

Ce qui est au-dessus montre comment vous pouvez appeler le shell schema pour un 
plugin à partir du shell de votre plugin.

.. _shell-output-level:

Niveaux de sortie de la Console
===============================

Les Shells ont souvent besoin de différents niveaux de verbosité. Quand vous 
lancez une tâche cron, la plupart des sorties ne sont pas nécessaires. Et il 
y a des fois où vous n'êtes pas interessés dans tout ce qu'un shell a à dire.
Vous pouvez utiliser des niveaux de sortie pour signaler la sortie de façon 
appropriée. L'utilisateur du shell peut ensuite décider pour quel niveau de 
détail ils sont interessés en configurant le bon flag quand on appelle le 
shell. :php:meth:`Shell::out()` supporte 3 types de sortie par défaut.

* QUIET - Seulement des informations importantes doivent être marquées pour 
  une paisible.
* NORMAL - Le niveau par défaut, et un usage normal
* VERBOSE - Les messages marqués qui peuvent être trop ennuyeux pour une 
  utilisation quotidienne, mais aide au debugging en VERBOSE

Vous pouvez marquer la sortie comme suit::

    // apparaitra à tous les niveaux.
    $this->out('Quiet message', 1, Shell::QUIET);

    // n'apparaitra pas quand une sortie quiet est togglé
    $this->out('message normal', 1, Shell::NORMAL);
    $this->out('message loud', 1, Shell::VERBOSE);

    // would only appear when verbose output is enabled.
    $this->out('extra message', 1, Shell::VERBOSE);

Vous pouvez contrôler le niveau de sortie des shells, en utilisant les 
options ``--quiet`` et ``--verbose``. Ces options sont ajoutées par défaut, 
et vous autorise à contrôler la cohérence du niveau de sortie à l'intérieur 
de vos shells CakePHP.

Style de sortie
===============

La Style de sortie est fait en incluant les tags - juste comme le html - dans 
votre sortie.

ConsoleOutput remplacera ces tags avec la bonne séquence de code ansi, ou 
supprimera les tags si vous êtes sur une console qui ne supporte pas les 
codes ansi. Il y a plusieurs styles intégrés, et vous pouvez en créer plus. 
Ceux intégrés sont 

* ``error`` Messages d'Erreur. Texte rouge souligné.
* ``warning`` Warning messages. Texte jaune.
* ``info`` Messages d'informations. Texte cyan.
* ``comment`` Texte supplémentaire. Texte bleu.
* ``question`` Texte qui est une question, ajouté automatiquement par shell.

Vous pouvez créer des styles supplémentaires en utilisant 
`$this->stdout->styles()`. Pour déclarer un nouveau style de sortie, 
vous pouvez faire::

    $this->stdout->styles('flashy', array('text' => 'magenta', 'blink' => true));

Cela vous permettra d'utiliser un tag ``<flashy>`` dans la sortie de votre 
shell, et si les couleurs ansi sont activées, ce qui suit sera rendu en texte 
magenta clignotant 
``$this->out('<flashy>Whoooa</flashy> Quelque chose a posé problème');``. Quand 
vous définissez les styles, vous pouvez utiliser les couleurs suivantes pour 
les attributs `text` et `background`:

* black
* red
* green
* yellow
* blue
* magenta
* cyan
* white

Vous pouvez aussi utiliser les options suivantes en commutateurs boléens, 
en les définissant à une valeur true qui les activent.

* bold
* underline
* blink
* reverse

Ajouter un style le rend aussi disponible pour toutes les instances de 
ConsoleOutput, donc vous n'avez pas à redeclarer les styles pour les 
deux objets stdout et stderr.

Enlever la coloration
---------------------

Bien que la coloration soit vraiment géniale, il peut y avoir des fois où vous 
voulez l'arrêter, ou forcer à l'avoir::

    $this->output->outputAs(ConsoleOutput::RAW);

Ce qui est au-dessus met la sortie objet dans un mode de sortie en ligne. Dans 
le mode de sortie en ligne, il n'y a aucun style du tout. Il y a trois modes que 
vous pouvez utiliser.

* ``ConsoleOutput::RAW`` - Sortie en ligne, aucun style ou format ne sera fait 
  C'est un bon mode à utiliser si vous sortez du XML ou si voulez débugger 
  pourquoi votre style ne marche pas.
* ``ConsoleOutput::PLAIN`` - Sortie en texte plein, les tags de style connus 
  seront enlevés de la sortie.
* ``ConsoleOutput::COLOR`` - La sortie avec couleur enlève les codes en place.

Par défaut sur les systèmes \*nix, les objets ConsoleOutput ont par défaut 
de la couleur. Sur les systèmes windows, la sortie simple est mise par défaut 
sauf si la variable d'environnement ``ANSICON`` est présente. 

Configurer les options et générer de l'aide
===========================================

.. php:class:: ConsoleOptionParser

Console option parsing in CakePHP has always been a little bit different 
from everything else on the command line.  In 2.0 ``ConsoleOptionParser`` 
helps provide a more familiar command line option and argument parser.

OptionParsers allow you to accomplish two goals at the same time.
First they allow you to define the options and arguments, separating
basic input validation and your code.  Secondly, it allows you to provide
documentation, that is used to generate well formatted help file.

The console framework gets your shell's option parser by calling 
``$this->getOptionParser()``.  Overriding this method allows you to 
configure the OptionParser to match the expected inputs of your shell.  
You can also configure subcommand option parsers, which allow you to 
have different option parsers for subcommands and tasks.  
The ConsoleOptionParser implements a fluent interface and includes 
methods for easily setting multiple options/arguments at once.::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        //configure parser
        return $parser;
    }

Configurer un option parser avec l'interface courante
-----------------------------------------------------

Toutes les méthodes utilisées pour configurer le parser peuvent
être chainées, vous permettant de définir l'intégralité des options du
parser en une unique série d'appel de méthodes::

    $parser->addArgument('type', array(
        'help' => 'Either a full path or type of class.'
    ))->addArgument('className', array(
        'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
    ))->addOption('method', array(
        'short' => 'm',
        'help' => __('The specific method you want help on.')
    ))->description(__('Lookup doc block comments for classes in CakePHP.'));

Les méthodes autorisant le chaining sont:

- description()
- epilog()
- command()
- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()

.. php:method:: description($text = null)

Gets or sets the description for the option parser.  The description
displays above the argument and option information. By passing in
either an array or a string, you can set the value of the description.
Calling with no arguments will return the current value::

    // Set multiple lines at once
    $parser->description(array('line one', 'line two'));

    // read the current value
    $parser->description()

.. php:method:: epilog($text = null)

Gets or sets the epilog for the option parser.  The epilog
is displayed after the argument and option information. By passing in
either an array or a string, you can set the value of the epilog.
Calling with no arguments will return the current value::

    // Set multiple lines at once
    $parser->epilog(array('line one', 'line two'));

    // read the current value
    $parser->epilog()

Ajouter des arguments
---------------------

.. php:method:: addArgument($name, $params = array())

Positional arguments are frequently used in command line tools, 
and ``ConsoleOptionParser`` allows you to define positional 
arguments as well as make them required.  You can add arguments 
one at a time with ``$parser->addArgument();`` or multiple at once 
with ``$parser->addArguments();``::

    $parser->addArgument('model', array('help' => 'The model to bake'));

You can use the following options when creating an argument:

* ``help`` The help text to display for this argument.
* ``required`` Whether this parameter is required.
* ``index`` The index for the arg, if left undefined the argument will be put
   onto the end of the arguments. If you define the same index twice the 
   first option will be overwritten.
* ``choices`` An array of valid choices for this argument.  If left empty all
   values are valid. An exception will be raised when parse() encounters an
   invalid value.

Arguments that have been marked as required will throw an exception when 
parsing the command if they have been omitted. So you don't have to 
handle that in your shell.

.. php:method:: addArguments(array $args)

If you have an array with multiple arguments you can use ``$parser->addArguments()`` 
to add multiple arguments at once.::

    $parser->addArguments(array(
        'node', array('help' => 'The node to create', 'required' => true),
        'parent' => array('help' => 'The parent node', 'required' => true)
    ));

As with all the builder methods on ConsoleOptionParser, addArguments
can be used as part of a fluent method chain.

Validation des arguments
------------------------

When creating positional arguments, you can use the ``required`` flag, to
indicate that an argument must be present when a shell is called. 
Additionally you can use ``choices`` to force an argument to 
be from a list of valid choices::

    $parser->addArgument('type', array(
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => array('aro', 'aco')
    ));

The above will create an argument that is required and has validation 
on the input.  If the argument is either missing, or has an incorrect 
value an exception will be raised and the shell will be stopped.

Ajouter des Options
-------------------

.. php:method:: addOption($name, $options = array())

Options or flags are also frequently used in command line tools.  
``ConsoleOptionParser`` supports creating options 
with both verbose and short aliases, supplying defaults 
and creating boolean switches. Options are created with either 
``$parser->addOption()`` or ``$parser->addOptions()``.::

    $parser->addOption('connection', array(
        'short' => 'c'
        'help' => 'connection',
        'default' => 'default'
    ));

The above would allow you to use either ``cake myshell --connection=other``, 
``cake myshell --connection other``, or ``cake myshell -c other`` 
when invoking the shell. You can also create boolean switches, these switches do not 
consume values, and their presence just enables them in the 
parsed parameters.::

    $parser->addOption('no-commit', array('boolean' => true));

With this option, when calling a shell like ``cake myshell --no-commit something`` 
the no-commit param would have a value of true, and 'something' 
would be a treated as a positional argument.  
The built-in ``--help``, ``--verbose``, and ``--quiet`` options 
use this feature.

When creating options you can use the following options to 
define the behavior of the option:

* ``short`` - The single letter variant for this option, leave undefined for none.
* ``help`` - Help text for this option.  Used when generating help for the option.
* ``default`` - The default value for this option.  If not defined the default will be true.
* ``boolean`` - The option uses no value, it's just a boolean switch. 
  Defaults to false.
* ``choices`` An array of valid choices for this option.  If left empty all
  values are valid. An exception will be raised when parse() encounters an invalid value.

.. php:method:: addOptions(array $options)

If you have an array with multiple options you can use ``$parser->addOptions()`` 
to add multiple options at once.::

    $parser->addOptions(array(
        'node', array('short' => 'n', 'help' => 'The node to create'),
        'parent' => array('short' => 'p', 'help' => 'The parent node')
    ));

As with all the builder methods on ConsoleOptionParser, addOptions is can be used 
as part of a fluent method chain.

Validation des options
----------------------

Options can be provided with a set of choices much like positional arguments
can be.  When an option has defined choices, those are the only valid choices
for an option.  All other values will raise an ``InvalidArgumentException``::

    $parser->addOption('accept', array(
        'help' => 'What version to accept.',
        'choices' => array('working', 'theirs', 'mine')
    ));

Utiliser les options boléennes
------------------------------

Options can be defined as boolean options, which are useful when you need to create 
some flag options.  Like options with defaults, boolean options always include 
themselves into the parsed parameters.  When the flags are present they are set 
to true, when they are absent false::

    $parser->addOption('verbose', array(
        'help' => 'Enable verbose output.',
        'boolean' => true
    ));

The following option would result in ``$this->params['verbose']`` always 
being available.  This lets you omit ``empty()`` or ``isset()`` 
checks for boolean flags::

    if ($this->params['verbose']) {
        // do something
    }

Since the boolean options are always defined as ``true`` or 
``false`` you can omit additional check methods.

Ajouter des sous-commandes
--------------------------

.. php:method:: addSubcommand($name, $options = array())

Console applications are often made of subcommands, and these subcommands 
may require special option parsing and have their own help.  A perfect 
example of this is ``bake``.  Bake is made of many separate tasks that all 
have their own help and options. ``ConsoleOptionParser`` allows you to 
define subcommands and provide command specific option parsers so the 
shell knows how to parse commands for its tasks::

    $parser->addSubcommand('model', array(
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ));

The above is an example of how you could provide help and a specialized 
option parser for a shell's task. By calling the Task's ``getOptionParser()`` 
we don't have to duplicate the option parser generation, or mix concerns 
in our shell.  Adding subcommands in this way has two advantages.  
First it lets your shell easily document its subcommands in the 
generated help, and it also allows easy access to the subcommand 
help.  With the above subcommand created you could call 
``cake myshell --help`` and see the list of subcommands, and 
also run ``cake myshell model --help`` to view the help for 
just the model task.

When defining a subcommand you can use the following options:

* ``help`` - Help text for the subcommand.
* ``parser`` - A ConsoleOptionParser for the subcommand.  This allows you 
  to create method specific option parsers.  When help is generated for a 
  subcommand, if a parser is present it will be used. You can also 
  supply the parser as an array that is compatible with 
  :php:meth:`ConsoleOptionParser::buildFromArray()`

Adding subcommands can be done as part of a fluent method chain.

Construire un ConsoleOptionParser à partir d'un tableau
-------------------------------------------------------

.. php:method:: buildFromArray($spec)

As previously mentioned, when creating subcommand option parsers,
you can define the parser spec as an array for that method. This can help 
make building subcommand parsers easier, as everything is an array::

    $parser->addSubcommand('check', array(
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the ARO "),
                __("specified (and its children, if any) will have ALLOW access to the"),
                __("specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        )
    ));

Inside the parser spec, you can define keys for ``definition``, 
``arguments``, ``options``, and ``epilog``.  You cannot define 
subcommands inside an array style builder.  The values for 
arguments, and options, should follow the format that 
:php:func:`ConsoleOptionParser::addArguments()` and :php:func:`ConsoleOptionParser::addOptions()`
use.  You can also use buildFromArray on its own, to build an option parser::

    public function getOptionParser() {
        return ConsoleOptionParser::buildFromArray(array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the ARO "),
                __("specified (and its children, if any) will have ALLOW access to the"),
                __("specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        ));
    }

Obtenir de l'aide dans les shells
---------------------------------

With the addition of ConsoleOptionParser getting help from shells is done 
in a consistent and uniform way. By using the ``--help`` or -``h`` option you 
can view the help for any core shell, and any shell that implements a ConsoleOptionParser::

    cake bake --help
    cake bake -h

Would both generate the help for bake.  If the shell supports subcommands
you can get help for those in a similar fashion::

    cake bake model --help
    cake bake model -h

This would get you the help specific to bake's model task.

Obtenir de l'aide en XML
------------------------

Lorsque vous réalisez des outils d'automatisation ou de développement qui
ont besoin d'interagir avec les shells de CakePHP, il est appréciable d'obtenir
de l'aide dans un format parsable par une machine. ConsoleOptionParser peut
fournir de l'aide au format XML en définissant un argument supplémentaire::

    cake bake --help xml
    cake bake -h xml

Les commandes ci-dessus vont retourner un document XML contenant de l'aide
à propos des options, arguments et sous-commandes du shell selectionné. Voici 
un exemple de documentation:

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>Omitting all arguments and options will enter into an interactive mode.</epilog>
        <subcommands/>
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


API de Shell
============

.. php:class:: AppShell

    AppShell can be used as a base class for all your shells. It should extend
    :php:class:`Shell`, and be located in ``Console/Command/AppShell.php``

.. php:class:: Shell($stdout = null, $stderr = null, $stdin = null)

    Shell is the base class for all shells, and provides a number of functions for 
    interacting with user input, outputting text a generating errors.

.. php:attr:: tasks

    An array of tasks you want loaded for this shell/task.

.. php:attr:: uses

    An array of models that should be loaded for this shell/task.

.. php:method:: clear()

    Clears the current output being displayed.

.. php:method:: createFile($path, $contents)

    :param string $path: Absolute path to the file you want to create.
    :param string $contents: Contents to put in the file.

    Creates a file at a given path.  If the Shell is interactive, a warning will be
    generated, and the user asked if they want to overwrite the file if it already exists.
    If the shell's interactive property is false, no question will be asked and the file 
    will simply be overwritten.

.. php:method:: dispatchShell()

    Dispatch a command to another Shell. Similar to 
    :php:meth:`Controller::requestAction()` but intended for running shells 
    from other shells.

    See :ref:`invoking-other-shells-from-your-shell`.

.. php:method:: err($message = null, $newlines = 1)

    :param string $method: The message to print.
    :param integer $newlines: The number of newlines to follow the message.

    Outputs a method to ``stderr``, works similar to :php:meth:`Shell::out()`

.. php:method:: error($title, $message = null)

    :param string $title: Title of the error
    :param string $message: An optional error message

    Displays a formatted error message and exits the application with status 
    code 1

.. php:method:: getOptionParser()

    Should return a :php:class:`ConsoleOptionParser` object, with any 
    sub-parsers for the shell.

.. php:method:: hasMethod($name)

    Check to see if this shell has a callable method by the given name.

.. php:method:: hasTask($task)

    Check to see if this shell has a task with the provided name.

.. php:method:: hr($newlines = 0, $width = 63)

    :param int $newlines: The number of newlines to precede and follow the line.
    :param int $width: The width of the line to draw. 

    Create a horizontal line preceded and followed by a number of newlines.

.. php:method:: in($prompt, $options = null, $default = null)

    :param string $prompt: The prompt to display to the user.
    :param array $options: An array of valid choices the user can pick from.
       Picking an invalid option will force the user to choose again.
    :param string $default: The default option if there is one.

    This method helps you interact with the user, and create interactive shells.
    It will return the users answer to the prompt, and allows you to provide a 
    list of valid options the user can choose from::

        $selection = $this->in('Red or Green?', array('R', 'G'), 'R');

    The selection validation is case-insensitive.

.. php:method:: initialize()

    Initializes the Shell acts as constructor for subclasses allows 
    configuration of tasks prior to shell execution.

.. php:method:: loadTasks()

    Loads tasks defined in public :php:attr:`Shell::$tasks`

.. php:method:: nl($multiplier = 1)

    Outputs a number of newlines.

.. php:method:: out($message = null, $newlines = 1, $level = Shell::NORMAL)

    :param string $method: The message to print.
    :param integer $newlines: The number of newlines to follow the message.
    :param integer $level: The highest :ref:`shell-output-level` this message 
        should display at.

    The primary method for generating output to the user. By using levels, you
    can limit how verbose a shell is.  out() also allows you to use colour formatting
    tags, which will enable coloured output on systems that support it.  There are 
    several built in styles for colouring text, and you can define your own.

    * ``error`` Error messages.
    * ``warning`` Warning messages.
    * ``info`` Informational messages.
    * ``comment`` Additional text.
    * ``question`` Magenta text used for user prompts

    By formatting messages with style tags you can display styled output::

        $this->out('<warning>This will remove data from the filesystems.</warning>');

    By default on \*nix systems ConsoleOutput objects default to colour output. 
    On windows systems, plain output is the default unless the ``ANSICON`` environment 
    variable is present.

.. php:method:: runCommand($command, $argv)

    Lance le Shell avec argv fourni.

    Délégue les appels aux tâches et résoud les méthodes dans la classe. Les 
    commandes sont regardées avec l'ordre suivant:

    - Méthode sur le shell.
    - Correspondance du nom de la tâche.
    - méthode main().

    Si un shell intégre une méthode main(), toute appel de méthode perdu 
    sera envoyyé à main() avec le nom de méthode original dans argv.

.. php:method:: shortPath($file)

    Makes absolute file path easier to read.

.. php:method:: startup()

    Démarre le Shell et affiche le message d'accueil. Permet de vérifier et 
    configurer avant de faire la commande ou l'exécution principale.

    Redéfinit cette méthode si vous voulez retirer l'information de bienvenue, 
    ou sinon modifier le pre-command flow.

.. php:method:: wrapText($text, $options = array())

    Entoure un block de texte. Vous permet de configurer la largeur, et 
    d'indenter un block de texte.

    :param string $text: The text to format
    :param array $options:

        * ``width`` La largeur à entourer. Par défaut à 72
        * ``wordWrap`` Entoure seulement les espaces de mots. Par défaut à true.
        * ``indent`` Indente le texte avec la chaîne de caractère fournie. Par 
          défaut à null.

Plus de sujets
==============

.. toctree::
    :maxdepth: 1

    console-and-shells/cron-jobs
    console-and-shells/code-generation-with-bake
    console-and-shells/schema-management-and-migrations
    console-and-shells/i18n-shell
    console-and-shells/acl-shell
    console-and-shells/testsuite-shell
    console-and-shells/upgrade-shell


.. meta::
    :title lang=fr: Console et Shells
    :keywords lang=fr: scripts de shell,système shell,classes application,tâches de fond,script en ligne,tâche cron,réponse requête request response,système path,acl,nouveaux projets,shells,spécifiques,paramètres,i18n,cakephp,répertoire,maintenance,idéal,applications,mvc
