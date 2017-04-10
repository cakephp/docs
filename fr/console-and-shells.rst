Shells, Tasks & Outils de Console
#################################

CakePHP ne dispose pas seulement d'un framework web mais aussi d'une console
de framework pour la création d'applications. Les applications par la console
sont idéales pour la gestion d'une variété de tâches d'arrière-plan comme la
maintenance et l'achèvement du travail en-dehors du cycle de requête-réponse.
Les applications par la console CakePHP vous permettent de réutiliser les
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
connecté dans l'invite bash et qu'il en est root sur une installation CakePHP.

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
workdir, root, app et core vous permet de voir où la Console fera des
changements. Pour changer le dossier app par celui dans lequel vous souhaitez
travailler, vous pouvez fournir son chemin comme premier argument de la ligne
de commande cake. L'exemple suivant montre comment spécifier un dossier app,
en supposant que vous avez déjà ajouté le dossier de la console à votre
``PATH``::

    $ cake -app /path/to/cakephp/app

Le chemin fourni peut être relatif au répertoire courant ou fourni sous
forme de chemin absolu.

.. _adding-cake-to-your-path:

Ajouter cake à votre système path
---------------------------------

Si vous êtes sur un système \*nix (linux, MacOSX), les étapes suivantes vous
permettront de rendre cake executable dans votre système path.

#. Localisez où se trouve votre installation de CakePHP et le cake exécutable.
   Par exemple ``/Users/mark/cakephp/lib/Cake/Console/cake``
#. Modifiez votre fichier ``.bashrc`` ou ``.bash_profile`` dans votre
   répertoire home, et ajoutez ce qui suit::

    export PATH="$PATH:/Users/mark/cakephp/lib/Cake/Console"

#. Rechargez la configuration bash ou ouvrez un nouveau terminal, et
   ``cake`` devrait fonctionner n'importe où.

Si vous êtes sur Windows Vista ou 7, vous devrez suivre les étapes suivantes.

#. Localisez l'emplacement où se trouvent votre installation CakePHP et
   l'exécutable cake. Par exemple
   ``C:\xampp\htdocs\cakephp\lib\Cake\Console``
#. Ouvrez la fenêtre des propriétés du Système de votre ordinateur. Vous
   essaierez le raccourci clavier Windows Key + Pause ou Windows Key + Break.
   Ou, à partir du Bureau, faîtes un clique droit sur Mon Ordinateur, clickez
   sur Propriétés et cliquez sur le lien Paramètres avancés du système dans la
   colonne de gauche.
#. Allez sous l'onglet Avancé et cliquez sur le bouton des Variables
   d'Environnement.
#. Dans la portion des Variables Sytèmes, cherchez le chemin de la variable
   et double-cliquez dessus pour la modifier.
#. Ajoutez le chemin de l'installation de ``cake`` suivi par un point virgule.
   On pourrait avoir par exemple::

    %SystemRoot%\system32;%SystemRoot%;C:\xampp\htdocs\cakephp\lib\Cake\Console;

#. Cliquez Ok et ``cake`` devrait fonctionner partout.

Créer un Shell
==============

Créons un shell pour l'utilisation dans la Console. Pour cet exemple, nous
créerons un simple shell Hello world. Dans le répertoire ``Console/Command``
de votre application, créez ``HelloShell.php``. Mettez le code suivant
dedans::

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
AppShell en créant ``app/Console/Command/AppShell.php``. Si vous n'en avez pas
un, CakePHP en utilisera une integrée. Comme notre méthode principale n'était
pas très intéressante, ajoutons une autre commande qui fait quelque chose::

    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }

        public function hey_there() {
            $this->out('Hey there ' . $this->args[0]);
        }
    }

Après avois sauvegardé ce fichier, vous devriez être capable de lancer
``Console/cake hello hey_there your-name`` et de voir vos noms affichés.
Toute méthode publique non préfixée par un ``_`` peut être appelée à partir
de ligne de commande. Dans notre méthode ``hey_there``, nous utilisons aussi
``$this->args``, cette propriété contient un tableau de tous les arguments
de position fournis à une commande. Vous pouvez aussi utiliser des switches
ou des options sur les shells des applications, ils sont disponibles dans la
variable ``$this->params`` et avec la méthode ``param()``, mais nous verrons
ça bientôt.

Lorsque vous utilisez la méthode ``main()``, vous n'êtes pas capable d'utiliser
les arguments de position ou les paramètres. Cela parce que le premier argument
de position ou l'option est interprété en tant que nom de commande. Si vous
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

    class UserShell extends AppShell {
        public $tasks = array('Template');
    }

Vous pouvez utiliser les tâches à partir de plugins en utilisant la
:term:`syntaxe de plugin` standard. Les tâches sont stockées dans
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
rend les tâches meilleures pour la réutilisation de fonctions identiques à
:doc:`/controllers/components`::

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
    Pour ce faire, soyez averti qu'une méthode appelée "sound" dans la classe
    SeaShell redéfinira la capacité d'accès à la fonctionnalité de la
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

Les Shells n'ont plus directement accès à ShellDispatcher, à travers
`$this->Dispatch`. Il y a cependant beaucoup de cas où vous voulez invoquer un
shell à partir d'un autre. `Shell::dispatchShell()` vous donne la possibilité
d'appeler d'autres shells en fournissant le `argv` pour le shell sub. Vous
pouvez fournir des arguments et des options soit en variables args ou en
chaînes de caractères::

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

La Style de sortie est fait en incluant les tags - juste comme le HTML - dans
votre sortie.

ConsoleOutput remplacera ces tags avec la bonne séquence de code ansi, ou
supprimera les tags si vous êtes sur une console qui ne supporte pas les
codes ansi. Il y a plusieurs styles intégrés, et vous pouvez en créer plus.
Ceux intégrés sont::

* ``error`` Messages d'Erreur. Texte rouge souligné.
* ``warning`` Messages d'avertissement. Texte jaune.
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
en les définissant à une valeur true qui les active.

* bold
* underline
* blink
* reverse

Ajouter un style le rend aussi disponible pour toutes les instances de
ConsoleOutput, donc vous n'avez pas à re-déclarer les styles pour les
deux objets stdout et stderr.

Enlever la coloration
---------------------

Bien que la coloration soit vraiment géniale, il peut y avoir des fois où vous
voulez l'arrêter, ou forcer à l'avoir::

    $this->stdout->outputAs(ConsoleOutput::RAW);

Ce qui est au-dessus met la sortie objet dans un mode de sortie en ligne. Dans
le mode de sortie en ligne, il n'y a aucun style du tout. Il y a trois modes
que vous pouvez utiliser:

* ``ConsoleOutput::RAW`` - Sortie en ligne, aucun style ou format ne sera fait
  C'est un bon mode à utiliser si vous sortez du XML ou si voulez débugger
  pourquoi votre style ne marche pas.
* ``ConsoleOutput::PLAIN`` - Sortie en texte plein, les tags de style connus
  seront enlevés de la sortie.
* ``ConsoleOutput::COLOR`` - La sortie avec couleur enlève les codes en place.

Par défaut sur les systèmes \*nix, les objets ConsoleOutput ont par défaut
de la couleur. Sur les systèmes Windows, la sortie simple est mise par défaut
sauf si la variable d'environnement ``ANSICON`` est présente.

Configurer les options et générer de l'aide
===========================================

.. php:class:: ConsoleOptionParser

Le parsing d'option de la Console dans CakePHP a toujours été un peu différent
par rapport aux autres consoles en ligne de commande. Dans 2.0,
``ConsoleOptionParser`` aide à fournir un parser d'option et d'argument
plus familier en ligne de commande.

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
pour configurer facilement les multiple options/arguments en une fois. ::

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

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', array(
            'help' => 'Either a full path or type of class.'
        ))->addArgument('className', array(
            'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
        ))->addOption('method', array(
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ))->description(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

Les méthodes autorisant le chainage sont:

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

Récupère ou définit la description pour le parser d'option. La description
affiche en haut l'argument et l'information d'option. En passant soit un
tableau, soit une chaîne, vous pouvez définir la valeur de la description.
Appeler sans arguments va retourner la valeur actuelle::

    // Définit plusieurs lignes en une fois
    $parser->description(array('line one', 'line two'));

    // Lit la valeur actuelle
    $parser->description()

.. php:method:: epilog($text = null)

Récupère ou définit l'epilog pour le parser d'option. L'epilog
est affichée après l'argument et l'information d'option. En passant un tableau
ou une chaîne, vous pouvez définir la valeur de epilog.
L'appeler avec aucun argument va retourner la valeur actuelle::

    // Définit plusieurs lignes en une fois
    $parser->epilog(array('line one', 'line two'));

    // Lit la valeur actuelle
    $parser->epilog()

Ajouter des arguments
---------------------

.. php:method:: addArgument($name, $params = array())

Les arguments de position sont fréquemment utilisés dans les outils en ligne
de commande, et ``ConsoleOptionParser`` vous permet de définir les arguments
de position ainsi que de les rendre obligatoires. Vous pouvez ajouter des
arguments un à la fois avec ``$parser->addArgument();`` ou plusieurs à la fois
avec ``$parser->addArguments();``::

    $parser->addArgument('model', array('help' => 'The model to bake'));

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
lors du parsing de la commande si ils ont été omis. Donc vous n'avez pas à
gérer cela dans votre shell.

.. php:method:: addArguments(array $args)

Si vous avez un tableau avec plusieurs arguments, vous pouvez utiliser
``$parser->addArguments()`` pour ajouter plusieurs arguments en une fois. ::

    $parser->addArguments(array(
        'node', array('help' => 'The node to create', 'required' => true),
        'parent' => array('help' => 'The parent node', 'required' => true)
    ));

Comme avec toutes les méthodes de construction avec ConsoleOptionParser,
addArguments peuvent être utilisés comme des parties d'une chaîne de méthode
courante.

Validation des arguments
------------------------

Lors de la création d'arguments de position, vous pouvez utiliser le flag
``required``, pour indiquer qu'un argument doit être présent quand un shell
est appelé. De plus, vous pouvez utiliser ``choices`` pour forcer un argument
pour qu'il soit une liste de choix valides::

    $parser->addArgument('type', array(
        'help' => 'Le type de noeud avec lequel intéragir.',
        'required' => true,
        'choices' => array('aro', 'aco')
    ));

Ce qui est au-dessus va créer un argument qui est nécessaire et a une
validation sur l'entrée. Si l'argument est soit manquant, soit a une valeur
incorrecte, une exception sera levée et le shell sera arreté.

Ajouter des Options
-------------------

.. php:method:: addOption($name, $options = array())

Les options ou les flags sont aussi fréquemment utilisés avec les outils de
ligne de commande. ``ConsoleOptionParser`` supporte la création d'options avec
les deux verbose et short aliases, fournissant les valeurs par défaut
et créant des switches en boléen. Les options sont créées avec soit
``$parser->addOption()``, soit ``$parser->addOptions()``. ::

    $parser->addOption('connection', array(
        'short' => 'c'
        'help' => 'connection',
        'default' => 'default'
    ));

Ce qui est au-dessus vous permet l'utilisation soit de
``cake myshell --connection=other``, soit de
``cake myshell --connection other``, ou soit de ``cake myshell -c other`` lors
de l'appel au shell. Vous pouvez aussi créer des switches de boléen, ces
switches ne consomment pas de valeurs, et leur présence les active juste dans
les paramètres parsés. ::

    $parser->addOption('no-commit', array('boolean' => true));

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
  définie, la valeur par défaut sera true.
* ``boolean`` - L'option n'utilise aucune valeur, c'est juste un switch de
  boléen.
  Par défaut à false.
* ``choices`` Un tableau de choix valides pour cette option. Si elle est vide,
  toutes les valeurs sont valides. Une exception sera lancée lorsque parse()
  rencontre une valeur non valide.

.. php:method:: addOptions(array $options)

Si vous avez un tableau avec plusieurs options, vous pouvez utiliser
``$parser->addOptions()`` pour ajouter plusieurs options en une fois. ::

    $parser->addOptions(array(
        'node', array('short' => 'n', 'help' => 'The node to create'),
        'parent' => array('short' => 'p', 'help' => 'The parent node')
    ));

Comme avec toutes les méthodes de construcion de ConsoleOptionParser,
addOptions peut être utilisée comme une partie de la chaîne de méthode courante.

Validation des options
----------------------

Les options peuvent être fournies avec un ensemble de choix un peu comme les
arguments de position peuvent l'être. Quand une option a défini les choix,
ceux-ci sont les seuls choix valides pour une option. Toutes les autres valeurs
vont lancer une ``InvalidArgumentException``::

    $parser->addOption('accept', array(
        'help' => 'What version to accept.',
        'choices' => array('working', 'theirs', 'mine')
    ));

Utiliser les options boléennes
------------------------------

Les options peuvent être définies en options boléennes, qui sont utiles quand
vous avez besoin de créer des options de flag. Comme les options par défaut,
les options boléennes les incluent toujours dans les paramètres parsés. Quand
les flags sont présents, ils sont définis à true, quand ils sont absents à
false::

    $parser->addOption('verbose', array(
        'help' => 'Enable verbose output.',
        'boolean' => true
    ));

L'option suivante fera que ``$this->params['verbose']`` sera toujours
disponible. Cela vous permet d'oublier ``empty()`` ou ``isset()``
pour vérifier les flags de boléens::

    if ($this->params['verbose']) {
        // faire quelque chose
    }

    // Depuis 2.7
    if ($this->param('verbose')) {
        // faire quelque chose
    }

Puisque les options boléennes sont toujours définies à ``true`` ou à
``false``, vous pouvez omettre les méthodes de vérification supplémentaires.

Ajouter des sous-commandes
--------------------------

.. php:method:: addSubcommand($name, $options = array())

Les applications de Console sont souvent faites de sous-commandes, et ces
sous-commandes nécessiteront un parsing d'options spéciales et ont leur propre
aide. Un exemple parfait de cela est ``bake``. Bake est fait de plusieurs
tâches séparées qui ont toutes leur propre aide et options.
``ConsoleOptionParser`` vous permet de définir les sous-commandes et
de fournir les parsers d'option spécifiques donc le shell sait comment parser
les commandes pour ses tâches::

    $parser->addSubcommand('model', array(
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ));

Ce qui est au-dessus est un exemple de la façon dont vous pouvez fournir de
l'aide et un parser d'option spécialisé pour une tâche du shell. En appelant
le ``getOptionParser()`` de la tâche, nous n'avons pas à dupliquer la
génération du parser d'option, ou mixer les tâches concernés dans notre shell.
Ajoutez des sous-commandes de cette façon a deux avantages.
Premièrement, cela laisse votre shell documenter facilement ces sous-commandes
dans l'aide générée, et cela vous permet aussi un accès facile à l'aide de
la sous-commande. Avec la sous-commande créée ci-dessus, vous pouvez appeler
``cake myshell --help`` et regarder la liste des sous-commandes, et
aussi lancer ``cake myshell model --help`` pour voir l'aide uniquement pour
la tâche model.

Quand vous définissez une sous-commande, vous pouvez utiliser les options
suivantes:

* ``help`` - Le texte d'aide pour la sous-commande.
* ``parser`` - Un ConsoleOptionParser pour la sous-commande. Cela vous permet
  de créer des méthodes de parsers d'options spécifiques. Quand l'aide est
  générée pour une sous-commande, si un parser est présent, il sera utilisé.
  Vous pouvez aussi fournir le parser en tableau qui est compatible avec
  :php:meth:`ConsoleOptionParser::buildFromArray()`

Ajouter des sous-commandes peut être fait comme une partie de la chaîne de
méthode courante.

Construire un ConsoleOptionParser à partir d'un tableau
-------------------------------------------------------

.. php:method:: buildFromArray($spec)

Comme mentionné précédemment, lors de la création de parsers d'option de la
sous-commande, vous pouvez définir le parser spec en tableau pour cette
méthode. Ceci peut faciliter la construction de parsers de sous-commande,
puisque tout est un tableau::

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

A l'intérieur du parser spec, vous pouvez définir les clés pour `arguments``,
``options``, ``description`` et ``epilog``. Vous ne pouvez pas définir les
``sous-commandes`` dans un constructeur de type tableau. Les valeurs pour les
arguments, et les options, doivent suivre le format que
:php:func:`ConsoleOptionParser::addArguments()` et
:php:func:`ConsoleOptionParser::addOptions()` utilisent. Vous pouvez aussi
utiliser buildFromArray lui-même, pour construire un parser d'option::

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

Avec l'ajout de ConsoleOptionParser, récupérer l'aide des shells est faite
d'une façon cohérente et uniforme. En utilisant l'option ``--help`` ou -``h``,
vous pouvez voir l'aide pour tout shell du coeur, et tout shell qui implémente
un ConsoleOptionParser::

    cake bake --help
    cake bake -h

Les deux généreraient l'aide pour bake. Si le shell supporte les sous-commandes,
vous pouvez obtenir de l'aide pour ceux-là d'un façon similaire::

    cake bake model --help
    cake bake model -h

Cela vous ramènera l'aide spécifique pour la tâche model de bake.

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

Routing dans shells / CLI
=========================

Dans l'interface en ligne de commande (CLI), spécialement dans vos shells et
tasks, ``env('HTTP_HOST')`` et les autres variables d'environnement spécifique
à votre navigateur ne sont pas définis.

Si vous générez des rapports ou envoyez des emails qui utilisent
``Router::url()``, ceux-ci vont contenir l'hôte par défaut
``http://localhost/``  et cela va entrainer des URLs invalides. Dans ce cas,
vous devrez spécifier le domaine manuellement. Vous pouvez faire cela en
utilisant la valeur de Configure ``App.fullBaseUrl`` de votre bootstrap ou
config, par exemple.

Pour envoyer des emails, vous devrez fournir à la classe CakeEmail l'hôte avec
lequel vous souhaitez envoyer l'email en faisant::

    $Email = new CakeEmail();
    $Email->domain('www.example.org');

Cela suppose que les ID du message généré sont valides et correspondent au
domaine duquel les emails sont envoyés.

API de Shell
============

.. php:class:: AppShell

    AppShell peut être utilisée comme une classe de base pour tous vos shells.
    Elle devrait étendre :php:class:`Shell`, et être localisée dans
    ``Console/Command/AppShell.php``.

.. php:class:: Shell($stdout = null, $stderr = null, $stdin = null)

    Shell est une classe de base pour tous les shells, et fournit un certain
    nombre de fonctions pour l'interaction avec l'entrée de l'utilisateur,
    sortant un texte d'erreurs générées.

.. php:attr:: tasks

    Un tableau de tâches que vous voulez charger pour ce shell/task.

.. php:attr:: uses

    Un tableau de models qui devrait être chargé pour ce shell/task.

.. php:method:: clear()

    Efface la sortie courante étant affichée.

.. php:method:: param($name)

    Récupère la valeur d'une option/paramètre. Va retourner null si le
    paramètre n'existe pas.

    .. versionadded:: 2.7

.. php:method:: createFile($path, $contents)

    :param string $path: Le chemin absolu du fichier que vous voulez créer.
    :param string $contents: Contenus à mettre dans le fichier.

    Crée un fichier dans un chemin donné. Si le Shell est interactif, un
    avertissement sera généré, et il sera demandé à l'utilisateur si ils
    veulent écraser le fichier si il existe déjà. Si la propriété interactive
    du shell est à false, aucune question ne sera demandée et le fichier sera
    simplement écrasé.

.. php:method:: dispatchShell()

    Dispatche une commande vers un autre Shell. Similaire à
    :php:meth:`Controller::requestAction()` mais pour lancer les shells
    à partir d'autres shells.

    Regardez :ref:`invoking-other-shells-from-your-shell`.

.. php:method:: err($message = null, $newlines = 1)

    :param string $method: Le message à afficher.
    :param integer $newlines: Le nombre de nouvelles lignes qui suivent le
       message.

    Sort une méthode vers ``stderr``, fonctionne de la même manière que
    :php:meth:`Shell::out()`

.. php:method:: error($title, $message = null)

    :param string $title: Titre d'une erreur.
    :param string $message: Un message d'erreur en option.

    Affiche un message d'erreurs formaté et sort de l'application avec le code
    de statut à 1.

.. php:method:: getOptionParser()

    Devrait retourner un objet :php:class:`ConsoleOptionParser`, avec tout
    sous-parsers pour le shell.

.. php:method:: hasMethod($name)

    Vérifie si ce shell a une méthode appelable par le nom donné.

.. php:method:: hasTask($task)

    Vérifie si le shell a une tâche avec le nom fourni.

.. php:method:: hr($newlines = 0, $width = 63)

    :param int $newlines: Le nombre de nouvelles lignes à mettre avant
       et à la suite de la ligne.
    :param int $width: La largeur de la ligne à dessiner.

    Crée une ligne horizontale précédée et suivie par un nombre de nouvelles
    lignes.

.. php:method:: in($prompt, $options = null, $default = null)

    :param string $prompt: Le prompt à afficher à l'utilisateur.
    :param array $options: Un tableau de choix valides que l'utilisateur peut
       choisir.
       Choisir une option non valide va forcer l'utilisateur à re-choisir.
    :param string $default: L'option par défaut si il y en a une.

    Cette méthode vous aide à interagir avec l'utilisateur, et crée des
    shells interactifs. Elle va retourner la réponse des utilisateurs au
    prompt, et vous permet de fournir une liste d'options valides dans laquelle
    l'utilisateur peut choisir::

        $selection = $this->in('Red or Green?', array('R', 'G'), 'R');

    La validation de la sélection est sensible à la casse.

.. php:method:: initialize()

    Initialize le constructeur du shell pour les sous-classes, permet la
    configuration de tâches avant l'execution du shell.

.. php:method:: loadTasks()

    Charge les tâches défines dans public :php:attr:`Shell::$tasks`.

.. php:method:: nl($multiplier = 1)

    :param int $multiplier: Nombre de fois que la séquence de ligne doit être
        répétée.

    Sort un certain nombre de séquences de nouvelles lignes.

.. php:method:: out($message = null, $newlines = 1, $level = Shell::NORMAL)

    :param string $message: Le message à afficher.
    :param integer $newlines: Le nombre de nouvelles lignes qui suivent le
        message.
    :param integer $level: Le :ref:`shell-output-level` le plus haut que ce
        message doit afficher.

    La méthode primaire pour la génération de la sortie de l'utilisateur. En
    utilisant les niveaux, vous pouvez utiliser la façon dont un shell est
    verbose. out() vous permet aussi d'utiliser les tags de formatage de
    couleur, ce qui permettra la sortie colorée sur les systèmes qui le
    supportent. Il y a plusieurs styles intégrées pour la coloration de texte,
    et vous pouvez définir les vôtres.

    * ``error`` Messages d'Erreur.
    * ``warning`` Messages d'avertissement.
    * ``info`` Messages d'information.
    * ``comment`` Texte supplémentaire.
    * ``question`` Texte Magenta utilisé pour les prompts de l'utilisateur.

    En formattant les messages avec des balises de style, vous pouvez afficher
    une sortie stylisée::

        $this->out('<warning>This will remove data from the filesystems.</warning>');

    Par défaut sur les systèmes \*nix, les objets ConsoleOutput ont par défaut
    une sortie colorée.
    Sur les systèmes Windows, la sortie brute est la sortie par défaut sauf si
    la variable d'environnement ``ANSICON`` est présente.

.. php:method:: overwrite($message = null, $newlines = 1, $size = null)

    :param string $message: Le message à afficher.
    :param integer $newlines: Le nombre de nouvelle ligne à la suite du message.
    :param integer $size: Le nombre d'octets à surcharger

    C'est une méthode utile pour générer des progess bars ou pour éviter de
    générer trop de lignes.

    Attention: Vous ne pouvez pas surcharger du texte qui contient des retours
    à la ligne.

    .. versionadded:: 2.6

.. php:method:: runCommand($command, $argv)

    Lance le Shell avec argv fourni.

    Délègue les appels aux tâches et résoud les méthodes dans la classe. Les
    commandes sont regardées avec l'ordre suivant:

    - Méthode sur le shell.
    - Correspondance du nom de la tâche.
    - méthode main().

    Si un shell intègre une méthode main(), toute appel de méthode perdu
    sera envoyé à main() avec le nom de la méthode originale dans argv.

.. php:method:: shortPath($file)

    Rend les chemins de fichier absolus plus faciles à lire.

.. php:method:: startup()

    Démarre le Shell et affiche le message d'accueil. Permet de vérifier et de
    configurer avant de faire la commande ou l'exécution principale.

    Redéfinit cette méthode si vous voulez retirer l'information de bienvenue,
    ou sinon modifier le pre-command flow.

.. php:method:: wrapText($text, $options = array())

    Entoure un block de texte. Vous permet de configurer la largeur, et
    d'indenter un block de texte.

    :param string $text: Le text à formatter.
    :param array $options:

        * ``width`` La largeur à entourer. Par défaut à 72.
        * ``wordWrap`` Entoure seulement les espaces de mots. Par défaut à
          true.
        * ``indent`` Indente le texte avec la chaîne de caractère fournie. Par
          défaut à null.

Plus de sujets
==============

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/cron-jobs
    console-and-shells/completion-shell
    console-and-shells/code-generation-with-bake
    console-and-shells/schema-management-and-migrations
    console-and-shells/i18n-shell
    console-and-shells/acl-shell
    console-and-shells/testsuite-shell
    console-and-shells/upgrade-shell


.. meta::
    :title lang=fr: Shells, Tasks & Outils de Console
    :keywords lang=fr: scripts de shell,système shell,classes application,tâches de fond,script en ligne,tâche cron,réponse requête request response,système path,acl,nouveaux projets,shells,spécifiques,paramètres,i18n,cakephp,répertoire,maintenance,idéal,applications,mvc
