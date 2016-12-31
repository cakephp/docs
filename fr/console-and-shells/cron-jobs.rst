Éxecuter des Shells en tâche cron (cronjob)
###########################################

Une chose habituelle à faire avec un shell, c'est de l'exécuter par une tâche
cron pour nettoyer la base de données une fois de temps en temps ou pour
envoyer des newsletters::

      */5  *    *    *    *  cd /full/path/to/app && Console/cake myshell myparam
    # *    *    *    *    *  command to execute
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── day of week (0 - 6) (0 à 6 sont Dimanche à Samedi,
    # │    │    │    │           ou utilisez les noms)
    # │    │    │    \────────── month (1 - 12)
    # │    │    \─────────────── day of month (1 - 31)
    # │    \──────────────────── hour (0 - 23)
    # \───────────────────────── min (0 - 59)

Vous pouvez avoir plus d'infos ici: https://en.wikipedia.org/wiki/Cron

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
