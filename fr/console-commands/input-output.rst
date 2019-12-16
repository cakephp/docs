Entrée/sortie de commande
=========================

.. php:namespace:: Cake\Console
.. php:class:: ConsoleIo

CakePHP fournit l'objet ``ConsoleIo`` aux commandes afin qu'elles puissent
lire interactivement les informations d'entrée et de sortie de l'utilisateur.

Helpers (Assistants) de commande
================================

Les Helpers (Assistants) de commande sont accessibles et utilisables depuis
n'importe quelle commande, shell ou tâche::

    // Affiche des données en tant que tableau.
    $io->helper('Table')->output($data);

    // Récupère un helper depuis un plugin.
    $io->helper('Plugin.HelperName')->output($data);

Vous pouvez aussi récupérer les instances des Helpers et appeler n'importe
quelle méthode publique dessus::

    // Récupérer et utiliser le ProgressHelper.
    $progress = $io->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Créer des Helpers (Assistants)
==============================

Alors que CakePHP est fourni avec quelques helpers de commande, vous pouvez
en créer d'autres dans votre application ou vos plugins. À titre d'exemple,
nous allons créer un helper simple pour générer des titres élégants.
Créez d'abord le fichier **src/Command/Helper/HeadingHelper.php** et mettez
ce qui suit dedans::

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

Nous pouvons alors utiliser ce nouvel Helper dans l'une de nos commandes
shell en l'appelant::

    // Avec ### de chaque coté
    $this->helper('Heading')->output(['It works!']);

    // Avec ~~~~ de chaque coté
    $this->helper('Heading')->output(['It works!', '~', 4]);

Les Helpers implémentent généralement la méthode ``output()`` qui prend un
tableau de paramètres. Cependant, comme les Console Helper sont des classes
vanilla, ils implémentent des méthodes suplémentaires qui prennent n'importe
quelle forme d'arguments.

.. note::

    Les Helpers peuvent aussi être placés dans ``src/Shell/Helper`` pour des
    raisons de retro-compatibilité.

Les Helpers inclus
==================

L'Helper Table
--------------

Le TableHelper aide à faire des tableaux d'art ASCII bien formatés.
L'utiliser est assez simple::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $io->helper('Table')->output($data);

        // Affiche
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

L'Helper Progress
-----------------

Le ProgressHelper peut être utilisé de deux façons. Le mode simple vous permet
de fournir un callback qui est appelé jusqu'à ce que l'avancement soit complet::

    $io->helper('Progress')->output(['callback' => function ($progress) {
        // Faire des choses ici.
        $progress->increment(20);
        $progress->draw();
    }]);

Vous pouvez contrôler davantage la barre de progression en fournissant
des options supplémentaires:

- ``total`` Le nombre total d'éléments dans la barre de progression. La valeur
  par défaut est 100.
- ``width`` La largeur de la barre de progression. La valeur par défaut est 80.
- ``callback`` Le callback qui sera appelé dans une boucle pour faire avancer la
  barre de progression.

Voici un exemple de toutes les options utilisées::

    $io->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

Le ProgressHelper peut aussi être utilisé manuellement pour incrementer et
réafficher la barre de progression quand nécessaire::

    $progress = $io->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();


Récuperer l'entrée utilisateur
==============================

.. php:method:: ask($question, $choices = null, $default = null)

Lorsque vous créez des applications de console interactive, vous devez obtenir
les entrées de l'utilisateur. CakePHP fournit un moyen facile de le faire::

    // Get arbitrary text from the user.
    $color = $io->ask('What color do you like?');

    // Get a choice from the user.
    $selection = $io->askChoice('Red or Green?', ['R', 'G'], 'R');

Selection validation is case-insensitive.

Créer des fichiers
==================

.. php:method:: createFile($path, $contents)

Créer des fichiers est souvent une part importante de beaucoup de commandes
console qui permettent d'automatiser le développement et le déploiement.
la méthode ``createFile()`` donne une interface simple pour créer des fichiers,
avec une confirmation interactive::

    // Create a file with confirmation on overwrite
    $io->createFile('bower.json', $stuff);

    // Force overwriting without asking
    $io->createFile('bower.json', $stuff, true);

Créer une sortie
================

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

Écrire dans ``stdout`` et ``stderr`` est une autre opération de routine
facilitée par CakePHP::

    // Écrire dans stdout
    $io->out('Normal message');

    // Écrire dans stderr
    $io->err('Error message');

En plus des méthodes de sortie vanilla, CakePHP fournit des méthodes
qui stylisent la sortie avec les couleurs ANSI appropriées::

    // Texte vert dans stdout
    $io->success('Success message');

    // Texte cyan dans stdout
    $io->info('Informational text');

    // Texte bleu dans stdout
    $io->comment('Additional context');

    // Texte rouge dans stderr
    $io->error('Error text');

    // Texte jaune dans stderr
    $io->warning('Warning text');

It also provides two convenience methods regarding the output level::

    // N'apparaît que lorsque la sortie verbose est activée. (-v)
    $io->verbose('Verbose message');

    // Apparaîtrait à tous les niveaux.
    $io->quiet('Quiet message');

Vous pouvez également créer des lignes vierges ou tracer
des lignes de tirets::

    // Affiche 2 ligne vides
    $io->out($this->nl(2));

    // Dessiner une ligne horizontale
    $io->hr();

Finalement, vous pouvez mettre à jour la ligne de texte actuelle
à l'écran::

    $io->out('Counting down');
    $io->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $io->overwrite($i, 0, 2);
    }

.. note::

    Il est important de se rappeler que vous ne pouvez pas ecraser le texte une
    fois qu'une nouvelle ligne a été affichée.

.. _shell-output-level:

Output Levels
=============

Les applications de console ont souvent besoin de différents niveaux de verbosité.
Par exemple, lors de l'exécution d'une tâche cron, la plupart des sorties ne sont
pas nécessaires. Vous pouvez utiliser les niveaux de sortie pour baliser
l'affichage de manière appropriée. L'utilisateur de l'interpréteur de commandes
peut alors décider du niveau de détail qui l'intéresse en sélectionnant le bon
indicateur lors de l'appel de la commande. Il y a 3 niveaux:

* ``QUIET`` - Seulement les informations absolument importantes devraient être
  marquées en sortie silencieuse.
* ``NORMAL`` -Le niveau par défaut, et  l'utilisation normale.
* ``VERBOSE`` - Notez ainsi les messages qui peuvent être trop verbeux pour un
  usage régulier, mais utile pour du débogage en ``VERBOSE``.

Vous pouvez marquer la sortie comme ceci::

    // Apparaitra à tous les niveaux.
    $io->out('Quiet message', 1, ConsoleIo::QUIET);
    $io->quiet('Quiet message');

    // N'apparaît pas lorsque la sortie silencieuse est activée.
    $io->out('normal message', 1, ConsoleIo::NORMAL);
    $io->out('loud message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

    // N'apparaît que lorsque la sortie verbose est activée.
    $io->out('extra message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

Vous pouvez contrôler le niveau de sortie des shells, en utilisant les options
``--quiet`` et ``--verbose``. Ces options sont ajoutées par défaut, et vous
permettent de contrôler les niveaux de sortie à l'intérieur de vos commandes
CakePHP.

Les options ``--quiet`` et ``--verbose`` contrôlent aussi l'affichage des données
de journalisation dans stdout/stderr. Normalement, les messages de journalisation
d'information et supérieurs sont affichés dans stdout/stderr. Quand ``--verbose``
est utilisé, le journal de debogage sera affiché dans stdout. Quand ``--quiet``
est utilisé, seulement les messages d'avertissement et supérieurs seront affichés
dans stderr.

Styliser la sortie
==================

Le style de sortie se fait en incluant des balises; tout comme le HTML, dans
votre sortie. Ces balises seront remplacées par la bonne séquence de code ANSI,
ou supprimées si vous êtes sur une console qui ne supporte pas les codes ANSI.
Il existe plusieurs styles intégrés, et vous pouvez en créer d'autres. Ceux qui
sont intégrés sont:

* ``success`` Messages de succès. Texte vert.
* ``error`` Messages d'erreur. Texte rouge.
* ``warning`` Messages d'avertissement. Texte jaune.
* ``info`` Messages d'information. Texte cyan.
* ``comment`` Texte additionnel. Texte bleu.
* ``question`` Texte qui est une question, ajouté automatiquement par le shell.

Vous pouvez créer des styles supplémentaires en utilisant ``$io->styles()``. Pour
déclarer un nouveau style de sortie, vous pouvez faire::

    $io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

Cela vous permettrait alors d'utiliser une balise ``<flashy>`` dans votre sortie
shell, et si les couleurs ANSI sont activées, ce qui suit serait affiché comme
texte magenta clignotant
``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. Lors de la
définition des styles, vous pouvez utiliser les couleurs suivantes pour les
attributs ``text`` et ``background``:

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

Vous pouvez également utiliser les options suivantes en tant que commutateurs
booléens, leur attribuer une valeur considérée comme vraie les active.

* blink
* bold
* reverse
* underline

L'ajout d'un style le rend également disponible sur toutes les instances de
ConsoleOutput, de sorte que vous n'avez pas à redéclarer les styles pour les
objets stdout et stdout.

Désactiver la colorisation
==========================

Bien que la colorisation soit très jolie, il peut arriver que vous souhaitiez la
désactiver, ou la forcer à s'activer::

    $io->outputAs(ConsoleOutput::RAW);

Ce qui précède placera l'objet de sortie en mode de sortie brute. En mode de
sortie brute, aucun style n'est effectué. Il y a trois modes que vous pouvez
utiliser.

* ``ConsoleOutput::COLOR`` - Sortie avec les codes d'échappement de couleur en
  place.
* ``ConsoleOutput::PLAIN`` - Sortie en texte simple, les balises de style
  connues seront supprimées de la sortie.
* ``ConsoleOutput::RAW`` - La sortie brute, aucun style ou formatage ne sera fait.
  C'est un bon mode à utiliser si vous affichez du XML ou si vous voulez déboguer
  pourquoi votre style ne fonctionne pas.

Par defaut sur les systèmes \*nix les objets ConsoleOutput sont initialisés en
mode sortie couleur. Sur les systèmes Windows, la sortie en texte simple est la
valeur par défaut à moins que la variable d'environment ``ANSICON`` est présente.
