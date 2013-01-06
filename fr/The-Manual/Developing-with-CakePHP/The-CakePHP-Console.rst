La console CakePHP
##################

Cette section est une introduction dans CakePHP depuis la ligne de
commande. Si vous avez déjà eu besoin d'accéder à vos classes MVC
CakePHP depuis une tâche cron ou tout autre script en ligne de commande,
cette section est pour vous.

PHP fournit un puissant client CLI qui rend l'interfaçage avec votre
système de fichier et vos applications plus facile. La console CakePHP
fournit un framework de création de scripts shell. La console utilise un
ensemble de répartiteur de types pour charger un shell ou une tâche, et
lui passer des paramètres.

Une installation de PHP contruite avec la ligne de commande (CLI) doit
être disponible sur le système où vous prévoyez d'utiliser la console.

Avant d'entrer dans des spécificités, soyons sûrs que vous pouvez
exécuter la console CakePHP. Tout d'abord, vous devrez ouvrir un shell
système. Les exemples présentés dans cette section sont issus du bash,
mais la console CakePHP est également compatible Windows. Exécutons le
programme Console depuis le bash. Cet exemple suppose que l'utilisateur
est actuellement connecté dans l'invite bash et qu'il est root sur une
installation CakePHP.

Vous pouvez techniquement lancer la console en utilisant quelquechose
comme :

::

    $ cd /my/cake/app_folder
    $ ../cake/console/cake

Mais il est préférable d'ajouter le dossier de la console à votre path
afin que vous puissiez utiliser la commande cake de partout :

::

    $ cake

Exécuter la Console sans arguments produit ce message d'aide (en anglais
à l'heure actuelle) :

::

    Hello user,
     
    Welcome to CakePHP v1.2 Console
    ---------------------------------------------------------------
    Current Paths:
     -working: /path/to/cake/
     -root: /path/to/cake/
     -app: /path/to/cake/app/
     -core: /path/to/cake/
     
    Changing Paths:
    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp
     
    Available Shells:
     
     app/vendors/shells/:
             - none
     
     vendors/shells/:
             - none
     
     cake/console/libs/:
             acl
             api
             bake
             console
             extract
     
    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

La première information affichée est en rapport avec les chemins. Ceci
est particulièrement pratique si vous exécutez la Console depuis
différents endroits de votre système de fichier.

Beaucoup d'utilisateurs ajoutent la console CakePHP à leur path système
afin qu'elle puisse être facilement accessible. L'affichage des chemins
de workdir, root, app et corevous permet de voir où la Console fera des
changements. Pour changer le dossier app par celui dans lequel vous
souhaitez travailler, vous pouvez fournir son chemin comme premier
argument de la ligne de commande cake. L'exemple suivant montre comment
spécifier un dossier app, en supposant que vous avez déjà ajouté le
dossier de la console à votre PATH :

::

    $ cake -app /chemin/vers/app

Le chemin fourni peut être relatif au répertoire courant ou fourni sous
forme de chemin absolu.

Créer des Shells & des Tâches
=============================

Créer ses propres Shells
------------------------

Créons un shell qui sera utilisé dans la Console. Dans cet exemple, nous
allons créer un shell de "rapport" qui affiche quelques données du
modèle. D'abord, créons rapport.php dans /vendors/shells/.

::

    <?php 
    class RapportShell extends Shell {
        function main() {}
    }
    ?>

Dès à présent, nous pouvons lancer le shell, mais cela ne fera pas grand
chose. Ajoutons quelques modèles au shell afin de pouvoir créer un
rapport sur quelque chose. Ceci se fait de la même manière que dans le
contrôleur : en ajoutant le nom des modèles à utiliser à la variable
$uses.

::

    <?php
    class RapportShell extends Shell {
        var $uses = array('Commande');

        function main() {
        }
    }
    ?>

Une fois que nous avons ajouté notre modèle au tableau $uses, nous
pouvons l'utiliser dans la méthode main(). Dans cet exemple, notre
modèle Commande devrait désormais être accessible par $this->Commande
dans la méthode main() de notre nouveau shell.

Voici un exemple simple de la logique que nous pourrions utiliser dans
ce shell :

::

    class RapportShell extends Shell {
        var $uses = array('Commande');
        function main() {
            // Récupérer les commandes livrées le mois dernier
            $mois_dernier = date('Y-m-d H:i:s', strtotime('-1 month'));
            $achats = $this->Commande->find("all",array('conditions'=>"Commande.expedition >= '$mois_dernier'"));

            // Affiche les informations de chaque commande
            foreach($achats as $achat) {
                $this->out('Date de la commande : '.$achat['Commande']['created']."\n");
                $this->out('Montant : $'.number_format($achat['Commande']['montant'], 2)."\n");
                $this->out('----------------------------------------'."\n");
         
                $total += $achat['Commande']['montant'];
            }

            // Affiche le total des commandes sélectionnées
            $this->out("Total : $".number_format($total, 2)."\n"); 
        }
    }

Vous devriez pouvoir lancer ce rapport en exécutant cette commande (si
la commande cake est dans votre PATH) :

::

    $ cake rapport 

où rapport est le nom de fichier du shell dans /vendor/shells/ sans
l'extension .php. Cela devrait produire quelque chose comme :

::

    Hello user,
       Welcome to    CakePHP v1.2 Console
       ---------------------------------------------------------------
       App : app
       Path:    /path/to/cake/app
       ---------------------------------------------------------------
       Date de la commande :    2007-07-30 10:31:12
       Montant :    $42.78
       ----------------------------------------
       Date de la commande :     2007-07-30 21:16:03
       Montant :    $83.63
       ----------------------------------------
       Date de la commandet :    2007-07-29 15:52:42
       Montant :    $423.26
       ----------------------------------------
       Date de la commande :    2007-07-29 01:42:22
       Montant :    $134.52
       ----------------------------------------
       Date de la commande :    2007-07-29 01:40:52
       Montant :    $183.56
       ----------------------------------------
       Total:    $867.75

Tâches
------

Les Tâches sont des petites extensions des shells. Elles permettent de
partager de la logique entre des shells et sont ajoutées aux shells en
utilisant la variable de classe spéciale $tasks. Par exemple dans le
shell du cœur (*bake*), il y a un certain nombre de tâches définies :

::

    <?php 
    class BakeShell extends Shell {
       var $tasks = array('Project', 'DbConfig', 'Model', 'View', 'Controller');
    }
    ?>

Les tâches sont stockées dans /vendors/shells/tasks/ dans des fichiers
aux noms de leurs classes. Donc, si nous créions une nouvelle tâche
"cool", la classe CoolTask (qui étend Shell) serait placée dans
/vendors/shells/tasks/cool.php. La classe VraimentCoolTask serait placée
dans /vendors/shells/tasks/vraiment\_cool.php

Chaque tâche doit au moins implémenter la méthode execute() - les shells
appelleront cette méthode pour démarrer la logique de la tâche.

::

    <?php
    class SonTask extends Shell {
       var $uses = array('Model'); // identique à la variable de contrôleur $uses
       function execute() {}
    }
    ?>

Vous pouvez accéder aux tâches à l'intérieur vos classes de shell et les
exécuter :

::

    <?php 
    class MerShell extends Shell // dans /vendors/shells/mer.php {
       var $tasks = array('Son'); // dans /vendors/shells/tasks/son.php
       function main() {
           $this->Son->execute();
       }
    }
    ?>

Vous pouvez aussi accéder aux tâches directement depuis la ligne de
commande :

::

    $ cake mer son

Pour accéder aux tâches directement depuis la ligne de commande, la
tâche **doit** être incluse dans la variable de classe $tasks. Donc,
prenez garde qu'une méthode appelée "son" dans la classe MerShell
surchargerait la possibilité d'accéder à la fonctionnalité de la tâche
Son spécifiée dans le tableau $tasks.

Exécuter des Shells en tâches cron
==================================

Une chose habituelle à faire avec un shell, c'est de l'exécuter par une
tâche cron pour nettoyer la base de données une fois de temps en temps
ou pour envoyer des newsletters. Cependant, même si vous avez ajouté le
chemin de la console à la variable PATH via ``~/.profile``, elle sera
indisponible pour la tâche cron.

Le script BASH suivant appellera votre shell et ajoutera les chemins
nécessaires à $PATH. Copiez et sauvegardez ceci dans votre dossier
vendors, en le nommant 'cakeshell' et n'oubliez pas de le rendre
exécutable. (``chmod +x cakeshell``)

::

    #!/bin/bash
    TERM=dumb
    export TERM
    cmd="cake"
    while [ $# -ne 0 ]; do
        if [ "$1" = "-cli" ] || [ "$1" = "-console" ]; then 
            PATH=$PATH:$2
            shift
        else
            cmd="${cmd} $1"
        fi
        shift
    done
    $cmd

Vous pouvez l'appeler comme suit :

::

    $ ./vendors/cakeshell monshell monparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

Le paramètre ``-cli`` prend un chemin qui pointe vers l'exécutable cli
php et le paramètre ``-console`` prend un chemin qui pointe vers la
console CakePHP.

Pour une tâche cron, ceci devrait ressembler à :

::

    # m h  dom mon dow   command
    */5 * * * * /chemin/complet/vers/cakeshell monshell monparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /chemin/complet/vers/app

Un truc simple pour débugger une *crontab*, c'est de la paramétrer pour
qu'elle vide sa sortie dans un fichier de log. Vous pouvez faire ceci
comme çà :

::

    # m h  dom mon dow   command
    */5 * * * * /chemin/complet/vers/cakeshell monshell monparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /chemin/complet/vers/app >> /chemin/vers/log/file.log

