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

Vous l'appelez ainsi:::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

Le paramètre ``-cli`` prend un chemin qui pointe vers l'exécutable cli php 
et le paramètre ``-console`` prend un chemin qui pointe vers la console CakePHP.

Pour une tâche cron, ceci devrait ressembler à ::

    # m h dom mon dow command
    */5 *   *   *   * /chemin/complet/vers/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /chemin/complet/vers/app

Une astuce simple pour débugger la tâche cron est d'envoyer sa sortie dans 
un fichier de log. Vous pouvez faire comme cela ::

    # m h dom mon dow command
    */5 *   *   *   * /chemin/complet/vers/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /chemin/complet/vers/app >> /chemin/vers/fichier/log.log


.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,bash script,chemin path,crontab,fichiers log,logfile,cakes,shells,dow,shell,cakephp,fi,running