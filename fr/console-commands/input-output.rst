Entrée/Sortie de Commande
=========================

.. php:namespace:: Cake\Console
.. php:class:: ConsoleIo

CakePHP fournit l'objet ``ConsoleIo`` aux commandes afin qu'elles puissent
lire interactivement les informations entrées par l'utilisateur et afficher
d'autres informations en sortie pour l'utilisateur.

.. _command-helpers:

Helpers (Assistants) de commande
================================

Les Helpers (Assistants) de commande sont accessibles et utilisables depuis
n'importe quelle commande, shell ou tâche::

    // Affiche des données en tant que tableau.
    $io->helper('Table')->output($data);

    // Récupère un helper depuis un plugin.
    $io->helper('Plugin.HelperName')->output($data);

Vous pouvez aussi récupérer des instances de Helpers et appeler n'importe
quelle méthode publique dessus::

    // Récupérer et utiliser le helper Progress.
    $progress = $io->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Créer des Helpers (Assistants)
==============================

CakePHP est fourni avec quelques helpers de commande, cependant vous pouvez
en créer d'autres dans votre application ou vos plugins. À titre d'exemple,
nous allons créer un helper simple pour générer des titres élégants.
Créez d'abord le fichier **src/Command/Helper/HeadingHelper.php** et insérez-y
ceci::

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
    $this->helper('Heading')->output(['Ça marche !']);

    // Avec ~~~~ de chaque coté
    $this->helper('Heading')->output(['Ça marche !', '~', 4]);

Les Helpers implémentent généralement la méthode ``output()`` qui prend un
tableau de paramètres. Cependant, comme les Console Helper sont des classes
vanilla, ils implémentent des méthodes suplémentaires qui prennent n'importe
quelle forme d'arguments.

.. note::

    Les Helpers peuvent aussi être placés dans ``src/Shell/Helper`` pour des
    raisons de retro-compatibilité.

Les Helpers inclus
==================

Helper Table
------------

Le TableHelper aide à faire des tableaux ASCII bien formatés. L'utilisation est
assez simple::

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

Vousp ouvez utiliser la balise de formatage ``<text-right>`` dans les tables
pour en aligner son contenu à droite::

        $data = [
            ['Nom 1', 'Prix Total'],
            ['Cake Mix', '<text-right>1.50</text-right>'],
        ];
        $io->helper('Table')->output($data);

        // Outputs
        +----------+------------+
        | Nom 1    | Prix Total |
        +----------+------------+
        | Cake Mix |       1.50 |
        +----------+------------+

.. versionadded:: 4.2.0
    La balise de formatage ``<text-right>`` a été ajoutée dans 4.2.

Helper Progress
---------------

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

Le ProgressHelper peut aussi être utilisé manuellement pour incrémenter et
réafficher la barre de progression selon les besoins::

    $progress = $io->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();


Récupérer l'entrée utilisateur
==============================

.. php:method:: ask($question, $choices = null, $default = null)

Lorsque vous créez des applications de console interactives, vous aurez besoin
de récupérer des entrées de l'utilisateur. CakePHP fournit un moyen de le
faire::

    // Obtenir un texte quelconque de l'utilisateur.
    $color = $io->ask('Quelle couleur aimez-vous ?');

    // Obtenir un choix de l'utilisateur.
    $selection = $io->askChoice('Rouge ou Vert ?', ['R', 'V'], 'R');

La validation de la sélection est insensible à la casse.

Créer des fichiers
==================

.. php:method:: createFile($path, $contents)

Souvent, une partie importante des commandes de console consiste à créer des
fichiers, afin d'aider à automatiser le développement et le déploiement. La
méthode ``createFile()`` donne une interface simple pour créer des fichiers,
avec une confirmation interactive::

    // Créer un fichier demandant de confirmer l'écrasement
    $io->createFile('bower.json', $stuff);

    // Forcer l'écrasement sans demander
    $io->createFile('bower.json', $stuff, true);

Créer une sortie
================

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

Une autre opération courante dans CakePHP consiste à écrire dans ``stdout`` et
``stderr``::

    // Écrire dans stdout
    $io->out('Message normal');

    // Écrire dans stderr
    $io->err('Message d\'erreur');

En plus des méthodes de sortie vanilla, CakePHP fournit des méthodes *wrappers*
qui stylisent la sortie avec les couleurs ANSI appropriées::

    // Texte vert dans stdout
    $io->success('Message de réussite');

    // Texte cyan dans stdout
    $io->info('Texte informatif');

    // Texte bleu dans stdout
    $io->comment('Supplément de contexte');

    // Texte rouge dans stderr
    $io->error('Texte d\'erreur');

    // Texte jaune dans stderr
    $io->warning('Texte d\'avertissement');

Le formatage en couleur sera automatiquement désactivé si  ``posix_isatty`` 
renvoie true, ou si la variable d'environnement ``NO_COLOR`` est définie.
 
``ConsoleIo`` fournit deux méthodes de confort à propos du niveau de sortie::

    // N'apparaît que lorsque la sortie verbose est activée. (-v)
    $io->verbose('Message verbeux');

    // Apparaîtrait à tous les niveaux.
    $io->quiet('Message succinct');

Vous pouvez également créer des lignes vierges ou tracer des lignes de tirets::

    // Affiche 2 ligne vides
    $io->out($this->nl(2));

    // Dessiner une ligne horizontale
    $io->hr();

Pour finir, vous pouvez mettre à jour la ligne de texte actuelle
à l'écran::

    $io->out('Compte à rebours');
    $io->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $io->overwrite($i, 0, 2);
    }

.. note::

    Il est important de se rappeler que vous ne pouvez pas écraser le texte une
    fois qu'un retour à la ligne a été affiché.

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
  marquées en sortie *quiet*.
* ``NORMAL`` -Le niveau par défaut, pour un usage normal.
* ``VERBOSE`` - Marquez ``VERBOSE`` les messages qui peuvent être trop verbeux
  pour un usage régulier, mais utiles pour du débogage .

Vous pouvez marquer la sortie comme ceci::

    // Apparaîtra à tous les niveaux.
    $io->out('Message succinct', 1, ConsoleIo::QUIET);
    $io->quiet('Message succinct');

    // N'apparaît pas lorsque la sortie silencieuse est activée.
    $io->out('message normal', 1, ConsoleIo::NORMAL);
    $io->out('message bavard', 1, ConsoleIo::VERBOSE);
    $io->verbose('Sortie verbeuse');

    // N'apparaît que lorsque la sortie verbose est activée.
    $io->out('message extra', 1, ConsoleIo::VERBOSE);
    $io->verbose('Sortie verbeuse');

Vous pouvez contrôler le niveau de sortie des shells, en utilisant les options
``--quiet`` et ``--verbose``. Ces options sont ajoutées par défaut, et vous
permettent de contrôler les niveaux de sortie à l'intérieur de vos commandes
CakePHP.

Les options ``--quiet`` et ``--verbose`` contrôlent aussi l'affichage des données
de journalisation dans stdout/stderr. Normalement, les messages de journalisation
d'information et supérieurs sont affichés dans stdout/stderr. Avec
``--verbose``, le journal de débogage sera affiché dans stdout. Avec
``--quiet``, seuls les messages d'avertissement et supérieurs seront affichés
dans stderr.

Styliser la sortie
==================

Vous pouvez donner un style à la sortie en incluant des balises dans votre sortie
- comme en HTML. Ces balises seront remplacées par la bonne séquence de code ANSI,
ou supprimées si vous êtes sur une console qui ne supporte pas les codes ANSI.
Il existe plusieurs styles intégrés, et vous pouvez en créer d'autres. Ceux qui
sont intégrés sont:

* ``success`` Messages de succès. Texte vert.
* ``error`` Messages d'erreur. Texte rouge.
* ``warning`` Messages d'avertissement. Texte jaune.
* ``info`` Messages d'information. Texte cyan.
* ``comment`` Texte additionnel. Texte bleu.
* ``question`` Texte qui est une question, ajouté automatiquement par le shell.

Vous pouvez créer des styles supplémentaires en utilisant ``$io->setStyle()``.
Pour déclarer un nouveau style de sortie, vous pouvez faire::

    $io->setStyle('flashy', ['text' => 'magenta', 'blink' => true]);

Cela vous permettrait alors d'utiliser une balise ``<flashy>`` dans votre sortie
shell, et si les couleurs ANSI sont activées, ce texte serait affiché en magenta
clignotant ``$this->out('<flashy>Ouaaaah</flashy> Il y a un problème');``.
En définissant des styles, vous pouvez utiliser les couleurs suivantes pour les
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
booléens. Ils deviennent actifs quand vous leur attribuez une valeur évaluée à
``true``.

* blink
* bold
* reverse
* underline

Une fois ajouté, un style est disponible sur toutes les instances de
ConsoleOutput, de sorte que vous n'avez pas à redéclarer des styles à la fois
pour des objets stdout et stderr.

Désactiver la Couleur
=====================

Bien que la colorisation soit très jolie, il peut arriver que vous souhaitiez la
désactiver, ou la forcer à s'activer::

    $io->outputAs(ConsoleOutput::RAW);

Cette instruction placera l'objet de sortie en mode de sortie brute. En mode de
sortie brute, il n'y a aucun style. Vous pouvez utiliser trois modes.

* ``ConsoleOutput::COLOR`` - Sortie avec les codes d'échappement de couleur en
  place.
* ``ConsoleOutput::PLAIN`` - Sortie en texte simple, les balises de style
  connues seront supprimées de la sortie.
* ``ConsoleOutput::RAW`` - Sortie brute sans style ni formatage. C'est un mode
  approprié si vous générez du XML ou si vous voulez déboguer pour voir pourquoi
  votre style ne fonctionne pas.

Par défaut sur les systèmes \*nix, les objets ConsoleOutput sont en mode sortie
couleur. Sur les systèmes Windows, la sortie est par défaut en texte simple sauf
si la variable d'environment ``ANSICON`` est présente.
