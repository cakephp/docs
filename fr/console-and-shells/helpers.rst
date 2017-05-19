Shell Helpers
#############

.. versionadded:: 3.1
    Les Shell Helpers ont été ajoutés dans la version 3.1.0

Les Shell Helpers vous permettent d'empaqueter une logique de sortie complexe
d'une manière réutilisable. Les Shell Helpers sont accessibles et utilisables
depuis n'importe quel shell ou task::

    // Affiche des données sous forme de tableau.
    $this->helper('Table')->output($data);

    // Récupère un helper depuis un plugin.
    $this->helper('Plugin.HelperName')->output($data);

Vous pouvez également récupérer des instances de helpers et appeler n'importe
quelle méthode publique::

    // Récupère et utilise le Progress Helper.
    $progress = $this->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Créer des Helpers
=================

Alors que CakePHP fournit quelques shell helpers, vous pouvez en créer d'autres
dans vos applications ou plugins. Par example, nous allons créer un simple
helper pour générer des en-têtes. Tout d'abord, créez
**src/Shell/Helper/HeadingHelper.php** et mettez-y le contenu suivant::

    <?php
    namespace App\Shell\Helper;

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

Nous pouvons ensuite utiliser ce nouvel helper dans une de nos commandes shell
en l'appelant::

    // Avec ### de chaque côté
    $this->helper('Heading')->output(['It works!']);

    // Avec ~~~~ de chaque côté
    $this->helper('Heading')->output(['It works!', '~', 4]);

Les helpers implémentent généralement la méthode ``output()`` qui prend un
tableau de paramètres. Cependant, comme les helpers de Console sont des classes
vanilla elles peuvent implémenter des méthodes supplémentaires qui prennent
n'importe quelle forme d'argument.

Helpers Fournis
===============

Helper Table
------------

Le TableHelper vous aide à créer des tableaux en art ASCII bien formatés.
L'utiliser est relativement simple::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $this->helper('Table')->output($data);

        // Génère
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Helper Progress
---------------

Le ProgessHelper peut être utilisé de deux manières différentes. Le mode simple
vous permet de fournir une méthode de rappel qui est invoquée jusqu'à ce que
l'avancement soit complété::

    $this->helper('Progress')->output(['callback' => function ($progress) {
        // Fait quelque chose ici.
        $progress->increment(20);
        $progress->draw();
    }]);

Vous pouvez mieux contrôler la barre d'avancement en fournissant des options
supplémentaires:

- ``total`` Le nombre total d'items dans la barre d'avancement. 100 par défaut.
- ``width`` Largeur de la barre d'avancement. 80 par défaut.
- ``callback`` la méthode de rappel qui sera appelée dans une boucle pour faire
  avancer la barre.

Un exemple d'utilisation de toutes les options serait::

    $this->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

Le helper progress peut également être utilisé manuellement pour incrémenter
et re-rendre la barre d'avancement si besoin::

    $progress = $this->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();

