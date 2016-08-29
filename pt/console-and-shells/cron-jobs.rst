Executando shells como cronjobs
###############################

Uma coisa comum para se fazer com shells é executá-los como cronjobs, seja para 
limpar a base de dados de vez em quando ou enviar newsletters. Isto é algo
trivial e pode ser feito assim::

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
