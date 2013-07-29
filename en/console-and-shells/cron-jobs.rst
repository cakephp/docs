Running Shells as cronjobs
##########################

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. This is
trivial to setup, for example::

    # m h dom mon dow command
    */5 *   *   *   * cd /full/path/to/app && Console/cake myshell myparam

.. meta::
    :title lang=en: Running Shells as cronjobs
    :keywords lang=en: cronjob,bash script,crontab
