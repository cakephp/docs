Executando Shells como Cronjobs
###############################

Uma coisa comum a se fazer com um shell é executá-lo como um cronjob para
limpar o banco de dados de vez em quando ou enviar newsletters. Isso é
trivial de configurar, por exemplo::

      */5  *    *    *    *  cd /full/path/to/root && bin/cake myshell myparam
    # *    *    *    *    *  comando para executar
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── dia da semana (0 - 6) (0 a 6 são de domingo a sábado,
    # |    |    |    |           ou usar nomes)
    # │    │    │    \────────── mês (1 - 12)
    # │    │    \─────────────── dia do mês (1 - 31)
    # │    \──────────────────── hora (0 - 23)
    # \───────────────────────── minuto (0 - 59)

Você pode ver mais informações aqui: https://en.wikipedia.org/wiki/Cron

.. tip::

    Use ``-q`` (ou `--quiet`) para silenciar qualquer saída de cronjobs.

Tarefas Cron em Hospedagem Compartilhada
----------------------------------------

Em algumas hospedagens compartilhadas, ``cd /full/path/to/root && bin/cake mycommand myparam``
pode não funcionar. Em vez disso, você pode usar
``php /full/path/to/root/bin/cake.php mycommand myparam``.

.. note::

    register_argc_argv precisa ser ativado incluindo ``register_argc_argv
    = 1`` no seu php.ini. Se você não puder alterar register_argc_argv globalmente,
    você pode instruir o cron job a usar sua própria configuração
    especificando-a com o parâmetro ``-d register_argc_argv=1``. Exemplo: ``php
    -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell
    myparam``

.. meta::
    :title lang=pt: Executando Shells como cronjobs
    :keywords lang=pt: cronjob,bash script,crontab
