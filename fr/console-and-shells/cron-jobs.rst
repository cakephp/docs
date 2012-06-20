Lancer des Shells en tant que cronjobs
######################################

Une utlisiation classique du shell consiste à le lance en tant que cronjob
pour nettoyer la base de données une fois de temps en temps ou pour lancer des newsletters.
Cependant, quand vous avez ajouté le chemin de la console à la variable PATH via
``~/.profile``, il rendra cronjob inutilisable.

Le script BASH suivant va appeler votre shell et ajoutera les chemins nécessaires à $PATH.
Copier et sauvegarder ce script dans votre dossier vendors sous le nom 'cakeshell'
et n'oubliez pas de le rendre executable.

(``chmod +x cakeshell``)

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

Vous l'appelez ainsi:::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

Le paramètre ``-cli`` prend le chemin qui pointe vers l'executable cli php et le paramètre
``-console`` prend un chemin qui pointe vers la console de CakePHP.

En écriture cronjob, cela ressemblerait à::

    # m h dom mon dow command
    */5 *   *   *   * /chemin/complet/vers/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/chemin/vers/app

Une astuce simple pour débugger la cronjob est d'envoyer sa sortie dans un fichier de log.
Vous pouvez faire comme cela ::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app >> /path/to/log/file.log


.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: cronjob,bash script,chemin path,crontab,logfile,cakes,shells,dow,shell,cakephp,fi,running