Exécuter des Shells en Tâches Cron (Cron Jobs)
##############################################

Une action habituelle à faire avec un shell est de l'exécuter par une tâche
cron pour nettoyer la base de données de temps en temps ou pour envoyer des
newsletters. La configuration est un jeu d'enfant, par exemple::

      */5  *    *    *    *  cd /chemin/complet/vers/la/racine && bin/cake monshell monparam
    # *    *    *    *    *  commande à exécuter
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── jour de la semaine (0 - 6) (0 à 6 vont de dimanche à samedi),
    # |    |    |    |           ou utilisez des noms)
    # │    │    │    \────────── mois (1 - 12)
    # │    │    \─────────────── jour du mois (1 - 31)
    # │    \──────────────────── heures (0 - 23)
    # \───────────────────────── minutes (0 - 59)

Vous pouvez avoir plus d'infos ici: https://fr.wikipedia.org/wiki/Cron

.. tip::

    Utilisez ``-q`` (or `--quiet`) pour ne pas afficher de sortie pour les
    cronjobs.

Tâches Cron sur des Serveurs Mutualisés
---------------------------------------

Sur certains serveurs mutualisés
``cd /chemin/complet/vers/la/racine && bin/cake macommande monparam``
pourrait ne pas fonctionner. Vous pouvez à la place utiliser
``php /chemin/complet/vers/la/racine/bin/cake.php macommande monparam``.

.. note::

    register_argc_argv a besoin d'être activé en incluant
    ``register_argc_argv = 1`` dans votre php.ini. Si vous ne pouvez pas
    changer register_argc_argv de manière globale, vous pouvez préciser à la
    tâche cron d'utiliser votre propre configuration en la spécifiant via le
    paramètre ``-d register_argc_argv=1``. Exemple:
    ``php -d register_argc_argv=1 /chemin/complet/vers/la/racine/bin/cake.php macommande monparam``.

.. meta::
    :title lang=fr: Lancer des Shells en tant que cronjobs
    :keywords lang=fr: tâche cron,cronjob,crontab
