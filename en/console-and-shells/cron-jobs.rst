Running Shells as Cron Jobs
###########################

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. This is
trivial to setup, for example::

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

You can see more info here: http://en.wikipedia.org/wiki/Cron

.. tip::

    Use ``-q`` (or `--quiet`) to silence any output for cronjobs.

Cron Jobs on Shared Hosting
---------------------------

On some shared hostings ``cd /full/path/to/root && bin/cake myshell myparam``
might not work. Instead you can use
``php /full/path/to/root/bin/cake.php myshell myparam``.

.. note::

    register_argc_argv has to be turned on by including ``register_argc_argv
    = 1`` in your php.ini.  If you cannot change register_argc_argv globally,
    you can tell the cron job to use your own configuration file (php.ini) by
    specifying it with ``-c /full/path/to/root/php.ini``. Example: ``php -c
    /full/path/to/root/php.ini /full/path/to/root/bin/cake.php myshell
    myparam``

.. meta::
    :title lang=en: Running Shells as cronjobs
    :keywords lang=en: cronjob,bash script,crontab
