Pagpapatakbo ng mga Shell bilang mga Cron Job
###########################

Isang karaniwang bagay na gagawin sa isang shell ay ginagawa itong tumatakbo bilang isang cronjob para  
linisin ang database minsan o magpadala ng mga newsletter. Ito ay 
trivial sa pagsetup, halimbawa::

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

Makakakita ka ng higit pang impormasyon dito: http://en.wikipedia.org/wiki/Cron

.. tip::

    Gumamit ng ``-q`` (o `--quiet`) upang patahimikin ang anumang output para sa cronjobs.

Mga Cron Job sa Shared na Hosting
---------------------------

Sa ilang mga shared na hosting ``cd /full/path/to/root && bin/cake myshell myparam``
ay maaaring hindi gumana. Sa halip maaari mong gamitin ang 
``php /full/path/to/root/bin/cake.php myshell myparam``.

.. tandaan::

    Ang register_argc_argv ay dapat na naka-on sa pamamagitan ng pagsama ng ``register_argc_argv
    = 1`` sa iyong php.ini. Kung hindi mo mapapalitan ang register_argc_argv globally,
    maaari mong sabihin sa cron job na gamitin ang iyong sariling kompigurasyon sa pamamagitan ng 
    pagtukoy nito sa ``-d register_argc_argv=1`` na parameter. Halimbawa: ``php
    -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell
    myparam``

.. meta::
    :title lang=en: Running Shells as cronjobs
    :keywords lang=en: cronjob,bash script,crontab
