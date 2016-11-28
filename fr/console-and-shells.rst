Shells, Tasks & Outils de Console
#################################

.. php:namespace:: Cake\Console

CakePHP n'est pas seulement un framework web, c'est aussi une console de
framework pour la création d'applications. Les applications par la console sont
idéales pour la gestion des tâches d'arrière-plan comme la maintenance et
l'achèvement du travail en-dehors du cycle de requête-réponse.
Les applications par la console CakePHP vous permettent de réutiliser les
classes de votre application à partir de lignes de commande.

CakePHP dispose d'un certain nombre d'applications fournies pour la console.
Certaines de ces applications sont utilisées de concert avec les fonctionnalités
de CakePHP (comme i18n), et d'autres sont pour une utilisation générale pour que
votre travail se fasse plus vite.

La console de CakePHP
=====================

Cette section est une introduction sur la ligne de commande dans CakePHP.
Les outils de la Console sont idéals pour l'utilisation de tâches cron, ou pour
les utilitaires basés sur les lignes de commandes qui n'ont pas besoin d'être
accessibles par un navigateur.

PHP fournit un puissant client CLI qui rend l'interfaçage avec votre système de
fichier et vos applications plus facile. La Console CakePHP fournit un framework
de création de scripts shell. La console utilise un ensemble de répartiteur de
types pour charger un shell ou une tâche, et lui passer des paramètres.

.. note::

    Une installation de PHP construite avec la ligne de commande (CLI) doit
    être disponible sur le système si vous prévoyez d'utiliser la Console.

Avant d'entrer dans les spécificités, assurons-nous que vous pouvez exécuter
la console CakePHP. Tout d'abord, vous devrez ouvrir un shell système. Les
exemples présentés dans cette section seront en bash, mais la console
CakePHP est également compatible avec Windows. Exécutons le programme Console
depuis le bash. Cet exemple suppose que l'utilisateur est actuellement
connecté dans l'invité bash et qu'il est en root sur une installation CakePHP.

Une application CakePHP contient les répertoires **src/Shell** et
**src/Shell/Task** qui contiennent tous ses shells et tasks. Il est aussi livré
avec un exécutable dans le répertoire **bin**::

    $ cd /path/to/app
    $ bin/cake

.. note::

    Sur Windows, cette commande doit être ``bin\cake`` (notez l'antislash).

Quand vous lancez la Console sans argument, cela affiche ce message d'aide::

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

     -app: src
     -root: /Users/markstory/Sites/cakephp-app
     -core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Changing Paths:

    Votre working path devrait être le même que celui de votre application. Pour
    changer votre path, utilisez le paramètre '-app'.
    Exemple: -app relative/path/to/myapp ou -app /absolute/path/to/myapp

    Shells disponibles:

    [Bake] bake

    [Migrations] migrations

    [CORE] i18n, orm_cache, plugin, routes, server

    [app] behavior_time, console, orm

    Pour lancer une commande de app ou du cœur, tapez cake shell_name [args]
    Pour lancer une commande d'un plugin, tapez cake Plugin.shell_name [args]
    Pour avoir de l'aide sur une commande spécifique, tapez cake shell_name --help

La première information affichée est en rapport avec les chemins. Ceci est
particulièrement pratique si vous exécutez la Console depuis différents
endroits de votre système de fichier.

Vous pouvez lancer n'importe quel shell listé en utilisant son nom::

    # lance le shell server
    bin/cake server

    # lance le shell migrations
    bin/cake migrations -h

    # lance le shell bake (avec le préfixe plugin)
    bin/cake bake.bake -h

Les shells de plugins peuvent être invoqués sans le préfixe du plugin si le nom
du shell n'entre pas en collision avec un shell de l'application ou du
framework. Dans le cas où deux plugins fournissent un shell du même nom, c'est
le premier chargé qui récupérera l'alias court. Vous pouvez toujours
utiliser le format ``plugin.shell`` pour référencer un shell sans ambiguïté.

.. php:class:: Shell

Créer un Shell
==============

Créons un shell pour l'utilisation dans la Console. Pour cet exemple, nous
créerons un simple shell Hello world. Dans le répertoire **src/Shell**
de votre application, créez **HelloShell.php**. Mettez le code suivant
dedans::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }
    }

Les conventions pour les classes de shell sont que les noms de classe doivent
correspondre au nom du fichier, avec Shell en suffixe. Dans notre shell, nous
avons créé une méthode ``main()``.
Cette méthode est appelée quand un shell est appelé avec aucune commande
supplémentaire. Nous allons ajouter quelques commandes en plus dans un moment,
mais pour l'instant lançons juste notre shell. Depuis le répertoire de votre
application, lancez::

    bin/cake hello

Vous devriez voir la sortie suivante::

    Welcome to CakePHP Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/src/
    ---------------------------------------------------------------
    Hello world.

Comme mentionné précédemment, la méthode ``main()`` dans les shells est une
méthode spéciale appelée tant qu'il n'y a pas d'autres commandes ou arguments
donnés au shell. Comme notre méthode principale n'était pas très intéressante,
ajoutons une autre commande qui fait quelque chose::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }

        public function heyThere($name = 'Anonymous')
        {
            $this->out('Hey there ' . $name);
        }
    }

Après avoir enregistré ce fichier, vous devriez pouvoir lancer la commande
suivante et voir votre nom affiché::

    bin/cake hello hey_there your-name

Toute méthode publique non préfixée par un ``_`` peut être appelée d'une
ligne de commande. Comme vous pouvez le voir, les méthodes appelées avec la
ligne de commande sont transformées d'un argument en underscore du shell en
un bon nom de méthode en camel-case de la classe.

Dans notre méthode ``heyThere()``, nous pouvons voir que les arguments de
position sont envoyés à notre fonction ``heyThere()``. Les arguments de
position sont aussi disponible dans la propriété ``args``.
Vous pouvez accéder switches ou aux options des applications du shell, qui sont
disponibles dans ``$this->params``, mais nous étudierons ce point plus tard.

Lorsque vous utilisez la méthode ``main()``, vous ne pouvez pas utiliser
les arguments de position ou les paramètres. Cela parce que le premier argument
de position ou l'option est interprété en tant que nom de commande. Si vous
voulez utiliser des arguments et des options, vous devriez utiliser un autre
nom de méthode que ``main``.

Utiliser les Models dans vos shells
-----------------------------------

Vous avez souvent besoin d'accéder à la logique métier de votre application
dans les utilitaires de shell. CakePHP rend cela super facile. Vous pouvez
charger les models dans les shells, juste comme vous le feriez dans un
controller en utilisant ``loadModel()``. Les models définis sont chargés en
propriétés attachées à votre shell::

    namespace App\Shell;

    use Cake\Console\Shell;

    class UserShell extends Shell
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function show()
        {
            if (empty($this->args[0])) {
                // Utilisez error() avant CakePHP 3.2
                return $this->abort("Merci de rentrer un nom d'utilisateur.");
            }
            $user = $this->Users->findByUsername($this->args[0])->first();
            $this->out(print_r($user, true));
        }
    }

Le shell ci-dessus récupérera un utilisateur par son username et affichera
l'information stockée dans la base de données.

Les Tâches Shell
================

Il y aura des fois où quand vous construirez des applications plus poussées
via la console, vous voudrez composer des fonctionnalités dans des classes
réutilisables qui peuvent être partagées à travers plusieurs shells. Les
tâches vous permettent d'extraire des commandes dans des classes. Par exemple,
la commande ``bake`` est fait entièrement de tâches. Vous définissez les tâches
d'un shell en utilisant la propriété ``$tasks``::

    class UserShell extends Shell
    {
        public $tasks = ['Template'];
    }

Vous pouvez utiliser les tâches à partir de plugins en utilisant la
:term:`syntaxe de plugin` standard. Les tâches sont stockées dans
**src/Shell/Task/** dans les fichiers nommées d'après leur classe. Ainsi si vous
étiez sur le point de créer une nouvelle tâche 'FileGenerator', vous pourriez
créer **src/Shell/Task/FileGeneratorTask.php**.

Chaque tâche doit au moins intégrer une méthode ``main()``. Le ShellDispatcher
appellera cette méthode quand la tâche est invoquée. Une classe de tâche
ressemble à cela::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class FileGeneratorTask extends Shell
    {
        public function main()
        {

        }
    }

Un shell peut aussi accéder à ses tâches en tant que propriétés, ce qui rend les
tâches meilleures pour la réutilisation de fonctions identiques à
:doc:`/controllers/components`::

    // Dans src/Console/Command/SeaShell.php
    class SeaShell extends Shell
    {
        // Se trouve dans src/Shell/Task/SoundTask.php
        public $tasks = ['Sound'];

        public function main()
        {
            $this->Sound->main();
        }
    }

Vous pouvez aussi accéder aux tâches directement à partir de la ligne de
commande::

    $ cake sea sound

.. note::

    Afin d'accéder aux tâches directement à partir de ligne de commande, la
    tâche **doit** être inclue dans la propriété $tasks de la classe shell.


De plus, le nom de la task doit être ajouté en tout que sous commande dans
l'OptionParser du Shell::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addSubcommand('sound', [
            // Fournit un texte d'aide pour la liste des commandes
            'help' => 'Execute The Sound Task.',
            // Lie les parsers d'option.
            'parser' => $this->Sound->getOptionParser(),
        ]);
        return $parser;
    }

Chargement à la volée des tâches avec TaskCollection
----------------------------------------------------

Vous pouvez charger les tâches à la volée en utilisant l'objet Task Collection.
Vous pouvez charger les tâches qui ne sont pas déclarées dans $tasks de cette
façon::

    $project = $this->Tasks->load('Project');

Chargera et retournera une instance ProjectTask. Vous pouvez charger les tâches
à partir des plugins en utilisant::

    $progressBar = $this->Tasks->load('ProgressBar.ProgressBar');

Shell Helpers
=============

Si vous avez une logique complexe de génération de sortie, vous pouvez utiliser
les :doc:`/console-and-shells/helpers` pour encapsuler cette logique d'une
manière réutilisable.

.. _invoking-other-shells-from-your-shell:

Appeler d'autres Shells à partir de votre Shell
===============================================

Il y a effectivement beaucoup de cas où vous voulez appeler un shell à partir
d'un autre. ``Shell::dispatchShell()`` vous donne la possibilité d'appeler
d'autres shells en fournissant le ``argv`` pour le shell sub. Vous pouvez
fournir des arguments et des options soit en variables args ou en chaînes de
caractères::

    // En chaînes de caractère
    $this->dispatchShell('schema create Blog --plugin Blog');

    // En tableau
    $this->dispatchShell('schema', 'create',  'Blog', '--plugin',  'Blog');

Ce qui est au-dessus montre comment vous pouvez appeler le shell schema pour un
plugin à partir du shell de votre plugin.

Passer des paramètres supplémentaires au Shell appelé
-----------------------------------------------------

.. versionadded:: 3.1

Il peut parfois être utile de passer des paramètres supplémentaires (qui ne
seraient pas des arguments du Shell) aux Shells appelés.
Pour ce faire, vous pouvez maintenant passer un tableau à ``dispatchShell()``.
Le tableau devra avoir une clé ``command`` ainsi qu'une clé ``extra``::

    // En passant la commande via une chaîne
    $this->dispatchShell([
       'command' => 'schema create Blog --plugin Blog'
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

    // En passant la commande via un tableau
    $this->dispatchShell([
       'command' => ['schema', 'create', 'Blog', '--plugin', 'Blog']
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

Les paramètres ajoutés via ``extra`` seront fusionnés dans la propriété
``Shell::$params`` et accessibles via la méthode ``Shell::param()``.
Par défaut, un paramètre supplémentaire ``requested`` est automatiquement
ajouté quand un Shell est appelé via ``dispatchShell()``. Ce paramètre
empêche la console de CakePHP d'afficher le message de bienvenue à chaque
Shell appelé via ``dispatchShell()``.

Récupérer les Entrées de l'Utilisateur
======================================

.. php:method:: in($question, $choices = null, $default = null)

Quand vous construisez des applications pour console, vous avez besoin des
entrées de l'utilisateur. CakePHP a un moyen facile de le faire::

    // Récupère un texte arbitraire de l'utilisateur.
    $color = $this->in('What color do you like?');

    // Récupère un choix de l'utilisateur.
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

La validation de la sélection est sensible à la casse.

Créer des Fichiers
==================

.. php:method:: createFile($path, $contents)

Beaucoup d'applications Shell aident à automatiser les tâches de développement
et de déploiement. Créer des fichiers est souvent important dans ces cas
d'utilisation. CakePHP fournit un moyen facile pour créer un fichier pour un
chemin donné::

    $this->createFile('bower.json', $stuff);

Si le Shell est interactif, un avertissement sera généré, et il sera demandé
à l'utilisateur s'il veut écraser le fichier s'il existe déjà. Si la propriété
interactive du shell est à ``false``, aucune question ne sera posée et le
fichier sera simplement écrasé.

Sortie de la Console
====================

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

La classe ``Shell`` fournit quelques méthodes pour afficher le contenu::

    // Ecrire avec stdout
    $this->out('Message Normal');

    // Ecrire avec stderr
    $this->err('Message d\'erreur');

    // Ecrire avec stderr et lancer une exception
    $this->abort('Fatal error');

    // Avant CakePHP 3.2. Ecrire avec stderr et exit()
    $this->error('Erreur Fatale');

Elle fournit aussi deux méthodes pratiques en ce qui concerne le niveau de
sortie::

    // Apparaîtrait seulement quand la sortie verbeuse est activée (-v)
    $this->verbose('Message verbeux');

    // Apparaîtrait à tous les niveaux.
    $this->quiet('Message silencieux');

Le Shell a aussi quelques méthodes pour nettoyer la sortie, créer des lignes
blanches, ou dessiner une ligne de tirets::

    // Affiche 2 newlines
    $this->out($this->nl(2));

    // Nettoie l'écran de l'utilisateur
    $this->clear();

    // Dessine une ligne horizontale
    $this->hr();

Enfin, vous pouvez mettre à jour la ligne courante du texte sur l'écran en
utilisant ``_io->overwrite()``::

    $this->out('Counting down');
    $this->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $this->_io->overwrite($i, 0, 2);
    }

Il est important de se rappeler que vous ne pouvez pas écraser le texte une fois
qu'une nouvelle ligne a été affichée.

.. _shell-output-level:

Niveaux de sortie de la Console
===============================

Les Shells ont souvent besoin de différents niveaux de verbosité. Quand vous
lancez une tâche cron, la plupart des sorties ne sont pas nécessaires. Et il
y a des fois où vous n'êtes pas intéressés dans tout ce qu'un shell a à dire.
Vous pouvez utiliser des niveaux de sortie pour signaler la sortie de façon
appropriée. L'utilisateur du shell peut ensuite décider pour quel niveau de
détail ils sont intéressés en configurant le bon flag quand on appelle le
shell. :php:meth:`Cake\\Console\\Shell::out()` supporte 3 types de sortie par
défaut.

* ``QUIET`` - Seulement des informations importantes doivent être marquées pour
  une paisible.
* ``NORMAL`` - Le niveau par défaut, et un usage normal.
* ``VERBOSE`` - Les messages marqués qui peuvent être trop ennuyeux pour une
  utilisation quotidienne, mais aide au debugging en ``VERBOSE``.

Vous pouvez marquer la sortie comme suit::

    // apparaitra à tous les niveaux.
    $this->out('Quiet message', 1, Shell::QUIET);
    $this->quiet('Quiet message');

    // n'apparaitra pas quand une sortie quiet est togglé
    $this->out('message normal', 1, Shell::NORMAL);
    $this->out('message loud', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

    // would only appear when verbose output is enabled.
    $this->out('extra message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

Vous pouvez contrôler le niveau de sortie des shells, en utilisant les options
``--quiet`` et ``--verbose``. Ces options sont ajoutées par défaut, et vous
autorise à contrôler la cohérence du niveau de sortie à l'intérieur de vos
shells CakePHP.

Les options de console ``--quiet`` et ``--verbose`` contrôlent également les
données sont loguées sont envoyées à stdout/stderr. Normalement, info et les
message de log de plus haut niveau sont envoyés vers stdout/stderr. Lorsque
``--verbose`` est utilisé, les logs de debug seront envoyés à stdout. Lorsque
``--quiet`` est utilisé, seulement les warning et messages plus haut seront
envoyés à stderr.

Style de sortie
===============

La Style de sortie est fait en incluant les tags - juste comme le HTML - dans
votre sortie.

ConsoleOutput remplacera ces tags avec la bonne séquence de code ansi, ou
supprimera les tags si vous êtes sur une console qui ne supporte pas les
codes ansi. Il y a plusieurs styles intégrés, et vous pouvez en créer plus.
Ceux intégrés sont::

* ``error`` Messages d'Erreur. Texte rouge.
* ``warning`` Messages d'avertissement. Texte jaune.
* ``info`` Messages d'informations. Texte cyan.
* ``comment`` Texte supplémentaire. Texte bleu.
* ``question`` Texte qui est une question, ajouté automatiquement par shell.

Vous pouvez créer des styles supplémentaires en utilisant
``$this->stdout->styles()``. Pour déclarer un nouveau style de sortie,
vous pouvez faire::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

Cela vous permettra d'utiliser un tag ``<flashy>`` dans la sortie de votre
shell, et si les couleurs ansi sont activées, ce qui suit sera rendu en texte
magenta clignotant
``$this->out('<flashy>Whoooa</flashy> Quelque chose a posé problème');``. Quand
vous définissez les styles, vous pouvez utiliser les couleurs suivantes pour
les attributs ``text`` et ``background``:

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

Vous pouvez aussi utiliser les options suivantes en commutateurs booléens, en
les définissant à une valeur ``true`` qui les active.

* blink
* bold
* reverse
* underline

Ajouter un style le rend aussi disponible pour toutes les instances de
ConsoleOutput, donc vous n'avez pas à re-déclarer les styles pour les
deux objets stdout et stderr.

Enlever la coloration
---------------------

Bien que la coloration soit vraiment géniale, il peut y avoir des fois où vous
voulez l'arrêter, ou forcer à l'avoir::

    $this->_io->outputAs(ConsoleOutput::RAW);

Ce qui est au-dessus met la sortie objet dans un mode de sortie en ligne. Dans
le mode de sortie en ligne, il n'y a aucun style du tout. Il y a trois modes
que vous pouvez utiliser:

* ``ConsoleOutput::COLOR`` - La sortie avec couleur enlève les codes en place.
* ``ConsoleOutput::PLAIN`` - Sortie en texte plein, les tags de style connus
  seront enlevés de la sortie.
* ``ConsoleOutput::RAW`` - Sortie en ligne, aucun style ou format ne sera fait
  C'est un bon mode à utiliser si vous sortez du XML ou si voulez débugger
  pourquoi votre style ne marche pas.

Par défaut sur les systèmes \*nix, les objets ConsoleOutput ont par défaut
de la couleur. Sur les systèmes Windows, la sortie simple est mise par défaut
sauf si la variable d'environnement ``ANSICON`` est présente.

Arrêter l'Exécution d'un Shell
==============================

Lorsque vos commandes shell ont atteint une condition où vous souhaitez que
l'exécution s'arrête, vous pouvez utiliser ``abort()`` pour lancer une
``StopException`` qui arrêtera le process::

    $user = $this->Users->get($this->args[0]);
    if (!$user) {
        // Arrête avec un message et un code d'erreur.
        $this->abort('Utilisateur non trouvé, 128);
    }

.. versionadded:: 3.2
    La méthode ``abort()`` a été ajoutée`dans 3.2. Dans les versions
    précédentes, vous pouvez utiliser ``error()`` pour afficher un message et
    arrêter l'exécution.

Méthodes Hook
=============

.. php:method:: initialize()

    Initialize le constructeur du shell pour les sous-classes et permet la
    configuration de tâches avant l'exécution du shell.

.. php:method:: startup()

    Démarre le Shell et affiche le message d'accueil. Permet de vérifier et de
    configurer avant de faire la commande ou l'exécution principale.

.. tip::
    Redéfinit cette méthode si vous voulez retirer l'information de bienvenue,
    ou sinon modifier le pre-command flow.

Configurer les options et générer de l'aide
===========================================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` helps provide a more familiar command line option and
argument parser.

OptionParsers vous permet d'accomplir deux buts en même temps.
Premièrement, il vous permet de définir les options et arguments, séparant
la validation basique des entrées et votre code. Deuxièmement, il vous permet
de fournir de la documentation, qui est utilisée pour bien générer le fichier
d'aide formaté.

La console du framework récupère votre parser d'option du shell en appelant
``$this->getOptionParser()``. Surcharger cette méthode vous permet de
configurer l'OptionParser pour faire correspondre les entrées attendues de
votre shell.
Vous pouvez aussi configurer les parsers d'option des sous-commandes, ce qui
vous permet d'avoir des parsers d'option différents pour les sous-commandes
et les tâches.
ConsoleOptionParser implémente une interface courant et inclut les méthodes
pour configurer les multiple options/arguments en une fois::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        //configure parser
        return $parser;
    }

Configurer un option parser avec l'interface courante
-----------------------------------------------------

Toutes les méthodes utilisées pour configurer le parser peuvent
être chainées, vous permettant de définir l'intégralité des options du
parser en une unique série d'appel de méthodes::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', [
            'help' => 'Either a full path or type of class.'
        ])->addArgument('className', [
            'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
        ])->addOption('method', [
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ])->setDescription(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

Les méthodes autorisant le chainage sont:

- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()
- setCommand()
- setDescription()
- setEpilog()

Définir la description
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: setDescription($text)

La description s'affiche au dessus des arguments et des options. En passant
soit un tableau ou une chaîne de caractère, vous pouvez définir la valeur de
la description::

    // Définit plusieurs lignes en une fois
    $parser->setDescription(['line one', 'line two']);
    // Avant 3.4
    $parser->description(['line one', 'line two']);

    // Lit la valeur actuelle
    $parser->getDescription()

**src/Shell/ConsoleShell.php** est un bon exemple de la méthode
``description()``::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        return $parser;
    }

La sortie ``description`` de la console peut être vue en exécutant la commande
suivante::

    user@ubuntu:~/cakeblog$ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

Définir un "Epilog"
~~~~~~~~~~~~~~~~~~~

.. php:method:: setEpilog($text = null)

Récupère ou définit l'epilog pour le parser d'option. L'epilog
est affichée après l'argument et l'information d'option. En passant un tableau
ou une chaîne, vous pouvez définir la valeur de epilog.
L'appeler avec aucun argument va retourner la valeur actuelle::

    // Définit plusieurs lignes en une fois
    $parser->setEpilog(['line one', 'line two']);
    // Avant 3.4
    $parser->epilog(['line one', 'line two']);

    // Lit la valeur actuelle
    $parser->getEpilog()

Pour illustrer la méthode ``epilog()``, ajoutons un appel à la méthode
``getOptionParser()`` utilisée ci-dessus dans **src/Shell/ConsoleShell.php**::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        $parser->setEpilog('Thank you for baking with CakePHP!');
        return $parser;
    }

Le texte ajouté avec la méthode ``setEpilog()`` peut être vue dans la sortie
avec la commande de console suivante::

    user@ubuntu:~/cakeblog$ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

    Thank you for baking with CakePHP!

Ajouter des Arguments
---------------------

.. php:method:: addArgument($name, $params = [])

Les arguments de position sont fréquemment utilisés dans les outils en ligne
de commande, et ``ConsoleOptionParser`` vous permet de définir les arguments
de position ainsi que de les rendre obligatoires. Vous pouvez ajouter des
arguments un à la fois avec ``$parser->addArgument();`` ou plusieurs à la fois
avec ``$parser->addArguments();``::

    $parser->addArgument('model', ['help' => 'The model to bake']);

Vous pouvez utiliser les options suivantes lors de la création d'un argument:

* ``help`` Le texte d'aide à afficher pour cet argument.
* ``required`` Si le paramètre est obligatoire.
* ``index`` L'index pour l'argument, si non défini à gauche, l'argument sera
  mis à la fin des arguments. Si vous définissez le même index deux fois, la
  première option sera écrasée.
* ``choices`` Un tableau de choix valides pour cet argument. Si vide à gauche,
  toutes les valeurs sont valides. Une exception sera lancée quand parse()
  rencontre une valeur non valide.

Les arguments qui ont été marqués comme nécessaires vont lancer une exception
lors du parsing de la commande s'ils ont été omis. Donc vous n'avez pas à
gérer cela dans votre shell.

.. php:method:: addArguments(array $args)

Si vous avez un tableau avec plusieurs arguments, vous pouvez utiliser
``$parser->addArguments()`` pour ajouter plusieurs arguments en une fois::

    $parser->addArguments([
        'node', ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true]
    ]);

Comme avec toutes les méthodes de construction avec ConsoleOptionParser,
addArguments peuvent être utilisés comme des parties d'une chaîne de méthode
courante.

Validation des Arguments
------------------------

Lors de la création d'arguments de position, vous pouvez utiliser le flag
``required``, pour indiquer qu'un argument doit être présent quand un shell
est appelé. De plus, vous pouvez utiliser ``choices`` pour forcer un argument
pour qu'il soit une liste de choix valides::

    $parser->addArgument('type', [
        'help' => 'Le type de nœud avec lequel interagir.',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

Ce qui est au-dessus va créer un argument qui est nécessaire et a une
validation sur l'entrée. Si l'argument est soit manquant, soit a une valeur
incorrecte, une exception sera levée et le shell sera arrêté.

Ajouter des Options
-------------------

.. php:method:: addOption($name, $options = [])

Les options ou les flags sont aussi fréquemment utilisés avec les outils de
ligne de commande. ``ConsoleOptionParser`` supporte la création d'options avec
les deux verbose et short aliases, fournissant les valeurs par défaut
et créant des switches en booléen. Les options sont créées avec soit
``$parser->addOption()``, soit ``$parser->addOptions()``::

    $parser->addOption('connection', [
        'short' => 'c'
        'help' => 'connection',
        'default' => 'default'
    ]);

Ce qui est au-dessus vous permet l'utilisation soit de
``cake myshell --connection=other``, soit de
``cake myshell --connection other``, ou soit de ``cake myshell -c other`` lors
de l'appel au shell. Vous pouvez aussi créer des switches de booléen, ces
switches ne consomment pas de valeurs, et leur présence les active juste dans
les paramètres parsés::

    $parser->addOption('no-commit', ['boolean' => true]);

Avec cette option, lors de l'appel d'un shell comme
``cake myshell --no-commit something`` le paramètre no-commit aurait une valeur
à true, et 'something' serait traité comme un argument de position.
Les options intégrées ``--help``, ``--verbose``, et ``--quiet`` utilisent cette
fonctionnalité.

Lors de la création d'options, vous pouvez utiliser les options suivantes
pour définir le comportement de l'option:

* ``short`` - La variante de la lettre unique pour cette option, laissez
  à non définie pour n'en avoir aucun.
* ``help`` - Le texte d'aide pour cette option. Utilisé lors de la génération
  d'aide pour l'option.
* ``default`` - La valeur par défaut pour cette option. Si elle n'est pas
  définie, la valeur par défaut sera ``true``.
* ``boolean`` - L'option n'utilise aucune valeur, c'est juste un switch de
  booléen.
  Par défaut à ``false``.
* ``choices`` - Un tableau de choix valides pour cette option. Si elle est vide,
  toutes les valeurs sont valides. Une exception sera lancée lorsque parse()
  rencontre une valeur non valide.

.. php:method:: addOptions(array $options)

Si vous avez un tableau avec plusieurs options, vous pouvez utiliser
``$parser->addOptions()`` pour ajouter plusieurs options en une fois::

    $parser->addOptions([
        'node', ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

Comme avec toutes les méthodes de construction de ConsoleOptionParser,
addOptions peut être utilisée comme une partie de la chaîne de méthode courante.

Les valeurs des options sont stockées dans le tableau ``$this->params``. Vous
pouvez également utiliser la méthode ``$this->param()`` pour éviter les erreurs
lorsque vous essayez d'accéder à une option qui n'est pas présente.

Validation des Options
----------------------

Les options peuvent être fournies avec un ensemble de choix un peu comme les
arguments de position peuvent l'être. Quand une option a défini les choix,
ceux-ci sont les seuls choix valides pour une option. Toutes les autres valeurs
vont lancer une ``InvalidArgumentException``::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine']
    ]);

Utiliser les Options Booléennes
-------------------------------

Les options peuvent être définies en options booléennes, qui sont utiles quand
vous avez besoin de créer des options de flag. Comme les options par défaut,
les options booléennes les incluent toujours dans les paramètres parsés. Quand
les flags sont présents, ils sont définis à ``true``, quand ils sont absents à
``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

L'option suivante fera que ``$this->params['verbose']`` sera toujours
disponible. Cela vous permet d'oublier ``empty()`` ou ``isset()``
pour vérifier les flags de booléens::

    if ($this->params['verbose']) {
        // faire quelque chose
    }

Puisque les options booléennes sont toujours définies à ``true`` ou à
``false``, vous pouvez omettre les méthodes de vérification supplémentaires
lorsque vous utilisez l'accès via le tableau. La méthode ``$this->param()``
rend ces vérifications inutiles dans tous les cas.

Ajouter des sous-commandes
--------------------------

.. php:method:: addSubcommand($name, $options = [])

Les applications de Console sont souvent faites de sous-commandes, et ces
sous-commandes nécessiteront un parsing d'options spéciales et ont leur propre
aide. Un exemple parfait de cela est ``bake``. Bake est fait de plusieurs
tâches séparées qui ont toutes leur propre aide et options.
``ConsoleOptionParser`` vous permet de définir les sous-commandes et
de fournir les parsers d'option spécifiques donc le shell sait comment parser
les commandes pour ses tâches::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

Ce qui est au-dessus est un exemple de la façon dont vous pouvez fournir de
l'aide et un parser d'option spécialisé pour une tâche du shell. En appelant
le ``getOptionParser()`` de la tâche, nous n'avons pas à dupliquer la
génération du parser d'option, ou mixer les tâches concernées dans notre shell.
Ajoutez des sous-commandes de cette façon a deux avantages.
Premièrement, cela laisse votre shell documenter ces sous-commandes dans l'aide
générée, et cela vous permet aussi un accès facile à l'aide de la sous-commande.
Avec la sous-commande créée ci-dessus, vous pouvez appeler ``cake myshell
--help`` et regarder la liste des sous-commandes, et aussi lancer ``cake myshell
model --help`` pour voir l'aide uniquement pour la tâche model.

.. note::

    Une fois que votre Shell définit des sous-commandes, toutes les
    sous-commandes doivent être explicitement définies.

Quand vous définissez une sous-commande, vous pouvez utiliser les options
suivantes:

* ``help`` - Le texte d'aide pour la sous-commande.
* ``parser`` - Un ConsoleOptionParser pour la sous-commande. Cela vous permet
  de créer des méthodes de parsers d'options spécifiques. Quand l'aide est
  générée pour une sous-commande, si un parser est présent, il sera utilisé.
  Vous pouvez aussi fournir le parser en tableau qui est compatible avec
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()`

Ajouter des sous-commandes peut être fait comme une partie de la chaîne de
méthode courante.

Construire un ConsoleOptionParser à partir d'un Tableau
-------------------------------------------------------

.. php:method:: buildFromArray($spec)

Comme mentionné précédemment, lors de la création de parsers d'option de la
sous-commande, vous pouvez définir le parser spec en tableau pour cette
méthode. Ceci peut faciliter la construction de parsers de sous-commande,
puisque tout est un tableau::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]
    ]);

A l'intérieur du parser spec, vous pouvez définir les clés pour `arguments``,
``options``, ``description`` et ``epilog``. Vous ne pouvez pas définir les
``sous-commandes`` dans un constructeur de type tableau. Les valeurs pour les
arguments, et les options, doivent suivre le format que
:php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` et
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` utilisent. Vous
pouvez aussi utiliser buildFromArray lui-même, pour construire un parser
d'option::

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
                'action' => ['help' => __('Action to check')]
            ]
        ]);
    }

Fusionner les ConsoleOptionParsers
----------------------------------

.. php:method:: merge($spec)

Lorsque vous construisez un groupe de commandes, vous voudrez peut-être combiner
plusieurs parsers::

    $parser->merge($anotherParser);

Notez que l'ordre des arguments de chaque parser doit être identique, et que
les options doivent être compatibles pour que cela fonctionne. N'utilisez donc
pas les mêmes clés pour des choses différentes.

Obtenir de l'Aide dans les Shells
---------------------------------

Avec l'ajout de ConsoleOptionParser, récupérer l'aide des shells est faite
d'une façon cohérente et uniforme. En utilisant l'option ``--help`` ou -``h``,
vous pouvez voir l'aide pour tout shell du cœur, et tout shell qui implémente
un ConsoleOptionParser::

    cake bake --help
    cake bake -h

Les deux généreraient l'aide pour bake. Si le shell supporte les sous-commandes,
vous pouvez obtenir de l'aide pour ceux-là d'un façon similaire::

    cake bake model --help
    cake bake model -h

Cela vous ramènera l'aide spécifique pour la tâche model de bake.

Obtenir de l'Aide en XML
------------------------

Lorsque vous réalisez des outils d'automatisation ou de développement qui
ont besoin d'interagir avec les shells de CakePHP, il est appréciable d'obtenir
de l'aide dans un format parsable par une machine. ConsoleOptionParser peut
fournir de l'aide au format XML en définissant un argument supplémentaire::

    cake bake --help xml
    cake bake -h xml

Les commandes ci-dessus vont retourner un document XML contenant de l'aide
à propos des options, arguments et sous-commandes du shell sélectionné. Voici
un exemple de documentation:

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

Routing dans shells / CLI
=========================

Dans l'interface en ligne de commande (CLI), spécialement dans vos shells et
tasks, ``env('HTTP_HOST')`` et les autres variables d'environnement spécifiques
à votre navigateur ne sont pas définies.

Si vous générez des rapports ou envoyez des emails qui utilisent
``Router::url()``, ceux-ci vont contenir l'hôte par défaut
``http://localhost/``  et cela va entrainer des URLs invalides. Dans ce cas,
vous devrez spécifier le domaine manuellement. Vous pouvez faire cela en
utilisant la valeur de Configure ``App.fullBaseURL`` de votre bootstrap ou
config, par exemple.

Pour envoyer des emails, vous devrez fournir à la classe Email l'hôte avec
lequel vous souhaitez envoyer l'email en faisant::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->domain('www.example.org');

Cela suppose que les ID du message généré sont valides et correspondent au
domaine duquel les emails sont envoyés.

Plus de sujets
==============

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/repl
    console-and-shells/cron-jobs
    console-and-shells/i18n-shell
    console-and-shells/completion-shell
    console-and-shells/plugin-shell
    console-and-shells/routes-shell
    console-and-shells/upgrade-shell
    console-and-shells/server-shell
    console-and-shells/cache

.. meta::
    :title lang=fr: Shells, Tasks & Outils de Console
    :keywords lang=fr: scripts de shell,système shell,classes application,tâches de fond,script en ligne,tâche cron,réponse requête request response,système path,acl,nouveaux projets,shells,spécifiques,paramètres,i18n,cakephp,répertoire,maintenance,idéal,applications,mvc
