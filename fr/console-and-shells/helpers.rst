Shell Helpers
#############

.. versionadded:: 2.8
    Les Shell Helpers ont été ajoutés dans la version 2.8.0

Les Shell Helpers vous permettent de packager du code complexe pour
générer un affichage. Les Shell Helpers sont accessibles et utilisables
à partir d'un shell ou d'une task::

    // Affiche les données $data sous forme de tableau.
    $this->helper('table')->output($data);

    // Récupère le helper d'un plugin.
    $this->helper('Plugin.HelperName')->output($data);

Vous pouvez aussi récupérer les instances des helpers et appeler toute méthode
publique qu'ils contiennent::

    // Récupère et utilise le helper Progress.
    $progress = $this->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Créer des Helpers
=================

Bien que CakePHP contienne quelques shell helpers, vous pouvez en créer plus
dans votre application ou vos plugins. Par exemple nous allons créer un helper
simple pour générer des en-têtes sympas. Tout d'abord créez le fichier
**app/Console/Helper/HeadingHelper.php** et mettez ce qui suit dedans::

    <?php
    App::uses("BaseShellHelper", "Console/Helper");

    class HeadingHelper extends BaseShellHelper
    {
        public function output($args)
        {
            $args += array('', '#', 3);
            $marker = str_repeat($args[1], $args[2]);
            $this->_consoleOutput->out($marker . ' ' . $args[0] . ' ' . $marker);
        }
    }

Nous pouvons ensuite utiliser ce nouvel helper dans une de nos commandes shell
en l'appelant::

    // Avec ### de cahque côté
    $this->helper('heading')->output('Ça marche!');

    // Avec ~~~~ de chaque côté
    $this->helper('heading')->output('Ça marche!', '~', 4);

Helpers Intégrés
================

Helper Table
------------

TableHelper aide à faire des tables ASCII artistiques bien formatées. Son
utilisation est très simple::

        $data = array(
            array('Header 1', 'Header', 'Long Header'),
            array('short', 'Longish thing', 'short'),
            array('Longer thing', 'short', 'Longest Value'),
        );
        $this->helper('table')->output($data);

        // Affiche
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Helper Progress
---------------

ProgressHelper peut être utilisé de deux manières. Le mode le plus simple vous
permet de fournir un callback qui est invoqué jusqu'à ce que la progression
soit finie::

    $this->helper('progress')->output(function ($progress) {
        // Faire le travail ici.
        $progress->increment(20);
    });

Vous pouvez contrôler encore plus la barre de progression en fournissant
les options supplémentaires:

- ``total`` Le nombre total  de choses dans la barre de progression. Par défaut
  à 100.
- ``width`` La largeur de la barre de progression. Defaults to 80.
- ``callback`` Le callback qui va être appelé dans une boucle pour faire avancer
  la barre de progression.

Un exemple de toutes les options utilisables serait::

    $this->helper('progress')->output(array(
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
        }
    ));

Le helper progress peut aussi être utilisé manuellement pour incrémenter
et re-rendre la barre de progression selon les besoins::

    $progress = $this->helper('Progress');
    $progress->init(array(
        'total' => 10,
        'width' => 20,
    ));

    $progress->increment(4);
    $progress->helper->draw();
