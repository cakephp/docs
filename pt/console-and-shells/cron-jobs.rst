Running Shells as cronjobs
##########################

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. This is
trivial to setup, for example::

      */5  *    *    *    *  cd /full/path/to/app && Console/cake myshell myparam
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


.. meta::
    :title lang=en: Running Shells as cronjobs
    :keywords lang=en: cronjob,bash script,crontab
Executando Shells como cronjobs
##########################

Uma coisa comum para se fazer com shells é executá-los como cronjobs, seja para 
limpar a base de dados de vez em quando ou enviar newsletters. Isto é algo trivial 
e pode ser feito assim::


      */5  *    *    *    *  cd /full/path/to/app && Console/cake myshell myparam
    # *    *    *    *    *  comando para executar
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── dia da semana (0 - 6) (0 a 6 - Domingo a Sábado,
    # |    |    |    |           ou utilize nomes (em inglês))
    # │    │    │    \────────── mês (1 - 12)
    # │    │    \─────────────── dia do mês (1 - 31)
    # │    \──────────────────── hora (0 - 23)
    # \───────────────────────── minuto (0 - 59)

Você pode ver mais informações aqui: https://pt.wikipedia.org/wiki/Crontab


.. meta::
    :title lang=pt: Executando shells como cronjobs
    :keywords lang=pt: cronjob,bash script,crontab
