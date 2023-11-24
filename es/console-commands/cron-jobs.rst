Ejecutar shells como trabajos cron
##################################

Una cosa común que se puede hacer con un shell es ejecutarlo como un cronjob para limpiar la base de datos
de vez en cuando o enviar boletines. Esto es trivial de configurar, por ejemplo::

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

Puedes ver más información aquí: https://es.wikipedia.org/wiki/Cron_(Unix)

.. tip::

    Utilice ``-q`` (o `--quiet`) para silenciar cualquier salida de cronjobs.

Trabajos cron en hosting compartido
-----------------------------------

En algunos servidores compartidos ``cd /full/path/to/root && bin/cake mycommand myparam``
Puede que no funcione. En su lugar puedes usar
``php /full/path/to/root/bin/cake.php mycomando myparam``.

.. note::

    register_argc_argv has to be turned on by including ``register_argc_argv
    = 1`` in your php.ini.  If you cannot change register_argc_argv globally,
    you can tell the cron job to use your own configuration by
    specifying it with ``-d register_argc_argv=1`` parameter. Example: ``php
    -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell
    myparam``

    register_argc_argv debe activarse incluyendo ``register_argc_argv = 1``
    en su php.ini. Si no puede cambiar register_argc_argv globalmente, puede
    indicarle al trabajo cron que use su propia configuración especificándola
    con el parámetro ``-d register_argc_argv=1``.
    Ejemplo: ``php -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell
    myparam``

.. meta::
    :title lang=es: Ejecutar shells como trabajos cron
    :keywords lang=es: cronjob,bash script,crontab
