Génération de code avec Bake
############################

Vous avez déjà découvert le prototypage *(scaffolding)* avec CakePHP :
une façon simple de visualiser l'application finale avec seulement une
base de données et quelques classes minimales. La console *Bake* de
CakePHP est un autre outil permettant de réaliser son application
rapidement. La console *Bake* peut créer chacun des ingrédients basiques
de CakePHP : modèles, vues et controlleurs. Et nous ne parlons pas
seulement des squelettes de classes : *Bake* peut créer une application
complète fonctionnelle en seulement quelques minutes. En réalité, *Bake*
est l'étape naturelle faisant suite au prototypage d'une application.

Pour utiliser *Bake*, vous devrez exécuter le script *cake* situé dans
le dossier /cake/console/.

::

    $ cd ./cake/console/
    $ cake bake

Suivant la configuration de votre installation, vous devrez peut être
donner les droits d'éxécution au script bash *cake* ou l'appeler avec la
commande ./cake bake. La console *cake* est exécutée en utilisant le CLI
PHP (Interface de Ligne de Commande). Si vous avez des problèmes en
exécutant ce script, vérifiez que le CLI PHP est installé et qu'il a les
modules adéquats autorisés (ex: MySQL).

En exécutant *Bake* la première fois, vous serez invité à créer un
fichier de configuration de la base de données, si vous n'en avez pas
créé auparavant.

Une fois la configuration à la base de donnée réalisée, exécuter *Bake*
vous présentera les options suivantes :

::

    ---------------------------------------------------------------
    App : app
    Path: /path-to/project/app
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/Q) 
    >  

De façon alternative, vous pouvez exécuter chacune de ces commandes
directement depuis la ligne de commande :

::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view 
    $ cake bake controller
    $ cake bake project
    $ cake bake test

