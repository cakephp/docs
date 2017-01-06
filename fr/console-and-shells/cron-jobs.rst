Exécuter des Shells en Tâches Cron (Cron Jobs)
##############################################

Une action habituelle à faire avec un shell est de l'exécuter par une tâche
cron pour nettoyer la base de données une fois de temps en temps ou pour
envoyer des newsletters::

      */5  *    *    *    *  cd /full/path/to/root && bin/cake myshell myparam
    # *    *    *    *    *  command to execute
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── day of week (0 - 6) (0 to 6 are Sunday to Saturday,
    # |    |    |    |           or use names)
    # │    │    │    \────────── month (1 - 12)
    # │    │    \─────────────── day of month (1 - 31)
    # │    \──────────────────── hour (0 - 23)
    # \───────────────────────── min (0 - 59)

Vous pouvez avoir plus d'infos ici: http://fr.wikipedia.org/wiki/Cron

.. tip::

    Utilisez ``-q`` (or `--quiet`) pour ne pas afficher de sortie pour les
    cronjobs.

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
