Executando Shells como Cron Jobs
################################

Uma coisa comum a fazer com um shell é torná-lo executado como um cronjob para limpar o banco de dados de vez em quando ou
enviar newsletters. Isso é trivial para configurar, por exemplo::

      */5  *    *    *    *  cd /full/path/to/root && bin/cake myshell myparam
    # *    *    *    *    *  comando para executar
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── day of week (0 - 6) (0 a 6 são de domingo a sábado, ou use os nomes)
    # │    │    │    \────────── mês (1 - 12)
    # │    │    \─────────────── dia do mês (1 - 31)
    # │    \──────────────────── hora (0 - 23)
    # \───────────────────────── minuto (0 - 59)
    
Você pode ver mais informações aqui: https://pt.wikipedia.org/wiki/Crontab

.. tip::

    Use ``-q`` (ou `--quiet`) para silenciar qualquer saída para cronjobs.
    
.. meta::
 
    :Title lang=pt: Executando Shells como cronjobs
    :keywords lang=pt: crontab, script bash, crontab

