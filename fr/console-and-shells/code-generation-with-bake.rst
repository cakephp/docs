Génération de code avec Bake
############################

La console Bake de CakePHP est un autre outil permettant de réaliser son
application rapidement. La console Bake peut créer chacun des ingrédients
basiques de CakePHP : models, behaviors, views, helpers, components, cas de
tests des components, fixtures et plugins. Et nous ne parlons pas
seulement des squelettes de classes : Bake peut créer une application
fonctionnelle complète en seulement quelques minutes. En réalité, Bake est
une étape naturelle à suivre une fois qu'une application a été prototypée.

Suivant la configuration de votre installation, vous devrez peut être donner
les droits d'exécution au script bash cake ou l'appeler avec la commande
``./bin/cake bake``.
La console cake est exécutée en utilisant le CLI PHP
(Interface de Ligne de Commande). Si vous avez des problèmes en exécutant ce
script, vérifiez que le CLI PHP est installé et qu'il a les bons modules
activés (ex: MySQL). Certains utilisateurs peuvent aussi rencontrer des
problèmes si la base de données host est 'localhost' et devront essayer
'127.0.0.1' à la place. Cela peut causer des soucis avec le CLI PHP.

Avant de lancer bake, vous devrez vous assurer qu'au moins une connection à une
base de données est configurée. Regardez la section dans
:ref:`database configuration <database-configuration>` pour plus d'informations.
configuration de la base de données, si vous n'en avez pas créé un auparavant.

Quand vous lancer sans arguments ``bin/cake bake``, cela va afficher une
liste des tâches disponibles. Vous devriez voir quelque chose comme::

    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Les commandes suivantes avec lesquelles vous pouvez générer un squelette de
    code pour votre application.

    Les commandes disponibles de bake:

    behavior
    component
    controller
    fixture
    helper
    model
    plugin
    project
    test
    view

    En utilisant bin/cake bake [name] vous pouvez faire appel à une tâche
    spécifique de bake.

Vous pouvez obtenir plus d'informations sur ce que chaque tâche fait et quelles
options sont disponibles en utilisant l'option ``--help``::

    $ bin/cake bake model --help


Créer des nouvelles Tâches pour Bake
====================================

Bake fonctionne sur une architecture extensible qui permet à votre application
ou vos plugins de fournir de nouvelles tâches, ou de remplacer les tâches
fournies par CakePHP. En étendant ``Cake\Console\Command\Task\BakeTask``, bake
va trouver votre nouvelle tâche et l'inclure comme une partie de bake.

Comme exemple, nous allons faire une tâche qui créé des classes shell. D'abord
créez le fichier de tâche ``src/Console/Command/Task/ShellTask.php``. Nous
étendrons le ``SimpleBakeTask`` pour l'instant puisque notre tâche shell sera
simple. ``SimpleBakeTask`` est abstract et nous impose de définir 4 méthodes
qui disent à bake la tâche appelée, où devront se trouver les fichiers qu'il
va générer, et le template à utiliser. Notre fichier ShellTask.php devra
ressembler à ceci::

    <?php
    namespace App\Console\Command\Task;

    use Cake\Console\Command\Task\SimpleBakeTask;

    class ShellTask extends SimpleBakeTask {
        public $pathFragment = 'Console/Command/';

        public function name() {
            return 'shell';
        }

        public function fileName($name) {
            return $name . 'Shell.php';
        }

        public function template() {
            return 'shell';
        }

    }

Une fois que le fichier a été créé, nous devons créer un template que bake peut
utiliser pour la génération de code. Créez
``src/Console/Command/Template/app/classes/shell.ctp``. Dans ce fichier, nous
ajouterons le contenu suivant::

    <?php
    echo "<?php\n"; ?>
    namespace <?= $namespace ?>\Console\Command;

    use Cake\Console\Shell;

    /**
     * <?= $name ?> shell
     */
    class <?= $name ?>Shell extends Shell {

        public function main() {
            // Ajoutez du code.
        }
    }

Vous devriez maintenant voir votre nouvelle tâche dans l'affichage de
``bin/cake bake``. Vous pouvez lancer votre nouvelle tâche en executant
``bin/cake bake shell Example --theme app``.
Cela va générer une nouvelle classe ``ExampleShell`` que votre application va
utiliser.

Modifier le HTML/Code produit par défaut par bake
=================================================

Si vous souhaitez modifier la sortie par défaut du HTML produit par la commande
"bake", vous pouvez créer votre propre 'theme' de bake qui vous permet de
remplacer certaine ou toute partie des templates que bake utilise. Pour créer
un nouveau theme de bake, faîtes ce qui suit:

#. Créez un nouveau répertoire dans ``src/Console/Templates/[name]``.
#. Copiez tout template que vous souhaitez changer à partir de
   ``vendor/cakephp/cakephp/src/Console/Templates/default``.  vers les
   répertoires correspondants dans votre application/plugin.
#. Quand vous lancez bake, utilisez l'option ``--theme`` pour spécifier le
   theme que vous souhaitez utiliser.

.. note::

    Les noms de theme de bake doivent être unique, donc n'utilisez pas 'default'.


.. meta::
    :title lang=fr: Génération de code avec Bake
    :keywords lang=fr: interface de commande en ligne,application fonctionnel,base de données,configuration de la base de données,script bash,ingrédients basiques,projet,model,chemin,génération de code,scaffolding,utilisateurs windows,configuration du fichier,quelques minutes,config,vue,shell,models,execution,mysql
