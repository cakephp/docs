Running Shells as cronjobs
##########################

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. However,
when you have added the console path to the PATH variable via
``~/.profile``, it will be unavailable to the cronjob.

The following BASH script will call your shell and append the
needed paths to $PATH. Copy and save this to your vendors folder as
'cakeshell' and don't forget to make it executable.
(``chmod +x cakeshell``)

::

    #!/bin/bash
    TERM=dumb
    export TERM
    cmd="cake"
    while [ $# -ne 0 ]; do
        if [ "$1" = "-cli" ] || [ "$1" = "-console" ]; then 
            PATH=$PATH:$2
            shift
        else
            cmd="${cmd} $1"
        fi
        shift
    done
    $cmd

You can call it like:::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

The ``-cli`` parameter takes a path which points to the php cli
executable and the ``-console`` parameter takes a path which points
to the CakePHP console.

As a cronjob this would look like::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app

A simple trick to debug a crontab is to set it up to dump it's
output to a logfile. You can do this like::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app >> /path/to/log/file.log


.. meta::
    :title lang=en: Running Shells as cronjobs
    :keywords lang=en: cronjob,bash script,path path,crontab,logfile,cakes,shells,dow,shell,cakephp,fi,running