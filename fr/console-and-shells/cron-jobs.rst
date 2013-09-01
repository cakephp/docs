Éxecuter des Shells en tâche cron (cronjob)
###########################################

Une chose habituelle à faire avec un shell, c'est de l'exécuter par une tâche
cron pour nettoyer la base de données une fois de temps en temps ou pour
envoyer des newsletters::

    # m h dom mon dow command
    */5 *   *   *   * cd /full/path/to/app && Console/cake myshell myparam

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
