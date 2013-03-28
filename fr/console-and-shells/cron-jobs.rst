Éxecuter des Shells en tâche cron (cronjob)
###########################################

Une chose habituelle à faire avec un shell, c'est de l'exécuter par une tâche 
cron pour nettoyer la base de données une fois de temps en temps ou pour 
envoyer des newsletters. Cependant, même si vous avez ajouté le chemin de la 
console à la variable PATH via ``~/.profile``, elle sera indisponible pour la 
tâche cron.

Le script BASH suivant appellera votre shell et ajoutera les chemins 
nécessaires à $PATH. Copiez et sauvegardez ceci dans votre dossier vendors, 
en le nommant 'cakeshell' et n'oubliez pas de le rendre exécutable. 
(``chmod +x cakeshell``)::

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

Vous l'appelez ainsi::

    $ ./Console/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console

Le paramètre ``-cli`` prend un chemin qui pointe vers l'exécutable cli php 
et le paramètre ``-console`` prend un chemin qui pointe vers la console CakePHP.

Pour une tâche cron, ceci devrait ressembler à ::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console -app /full/path/to/app

A simple trick to debug a crontab is to set it up to dump it's
output to a logfile. You can do this like::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console -app /full/path/to/app >> /path/to/log/file.log 2>&1


.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,bash script,chemin path,crontab,fichiers log,logfile,cakes,shells,dow,shell,cakephp,fi,running
