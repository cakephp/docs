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

Tâches Cron sur des serveurs mutualisés
---------------------------------------

Sur certains serveurs mutualisés ``cd /full/path/to/root && bin/cake myshell myparam``
pourrait ne pas fonctionner. Vous pouvez à la place utiliser
``php /full/path/to/root/bin/cake.php myshell myparam``.

.. note::

    register_argc_argv a besoin d'être activé en incluant
    ``register_argc_argv = 1`` dans votre php.ini. Si vous ne pouvez pas
    changer register_argc_argv de manière globale, vous pouvez préciser à la
    tâche cron d'utiliser votre propre configuration en la spécifiant via le
    paramètre ``-d register_argc_argv=1``. Exemple :
    ``php -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell myparam``.

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
