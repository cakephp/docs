Éxecuter des Shells en tâche cron (cronjob)
###########################################

Une chose habituelle à faire avec un shell, c'est de l'exécuter par une tâche
cron pour nettoyer la base de données une fois de temps en temps ou pour
envoyer des newsletters::

      */5  *    *    *    *  cd /full/path/to/App && Console/cake myshell myparam
    # *    *    *    *    *  command to execute
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── day of week (0 - 6) (0 to 6 are Sunday to Saturday,
      |    |    |    |           or use names)
    # │    │    │    \────────── month (1 - 12)
    # │    │    \─────────────── day of month (1 - 31)
    # │    \──────────────────── hour (0 - 23)
    # \───────────────────────── min (0 - 59)
    
Vous pouvez avoir plus d'infos ici: http://fr.wikipedia.org/wiki/Cron

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
