The CakePHP Console
###################

This section provides an introduction into CakePHP at the
command-line. If you’ve ever needed access to your CakePHP MVC
classes in a cron job or other command-line script, this section is
for you.

PHP provides a powerful CLI client that makes interfacing with your
file system and applications much smoother. The CakePHP console
provides a framework for creating shell scripts. The Console uses a
dispatcher-type setup to load a shell or task, and hand it its
parameters.

A command-line (CLI) build of PHP must be available on the system
if you plan to use the Console.

Before we get into specifics, let’s make sure we can run the
CakePHP Console. First, you’ll need to bring up a system shell. The
examples shown in this section will be in bash, but the CakePHP
Console is Windows-compatible as well. Let’s execute the Console
program from bash. This example assumes that the user is currently
logged into a bash prompt and is currently at the root of a CakePHP
installation.

You can technically run the console using something like this:

::

    $ cd /my/cake/app_folder
    $ ../cake/console/cake

But the preferred usage is adding the console directory to your
path so you can use the cake command anywhere:

::

    $ cake

Running the Console with no arguments produces this help message:

::

    Hello user,
     
    Welcome to CakePHP v1.2 Console
    ---------------------------------------------------------------
    Current Paths:
     -working: /path/to/cake/
     -root: /path/to/cake/
     -app: /path/to/cake/app/
     -core: /path/to/cake/
     
    Changing Paths:
    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp
     
    Available Shells:
     
     app/vendors/shells/:
             - none
     
     vendors/shells/:
             - none
     
     cake/console/libs/:
             acl
             api
             bake
             console
             extract
     
    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

The first information printed relates to paths. This is especially
helpful if you’re running the Console from different parts of the
filesystem.

Many users add the CakePHP Console to their system’s path so it can
be accessed easily. Printing out the working, root, app, and core
paths allows you to see where the Console will be making changes.
To change the app folder you wish to work with, you can supply its
path as the first argument to the cake command. This next example
shows how to specify an app folder, assuming you’ve already added
the console folder to your PATH:

::

    $ cake -app /path/to/app

The path supplied can be relative to the current working directory
or supplied as an absolute path.


Creating Your Own Shells
========================

Let's create a shell for use in the Console. For this example,
we'll create a ‘report' shell that prints out some model data.
First, create report.php in /vendors/shells/.

::

    <?php 
    class ReportShell extends Shell {
        function main() {}
    }
    ?>

From this point, we can run the shell, but it won't do much. Let's
add some models to the shell so that we can create a report of some
sort. This is done just as it is in the controller: by adding the
names of models to the $uses variable.

::

    <?php
    class ReportShell extends Shell {
        var $uses = array('Order');
    
        function main() {
        }
    }
    ?>

Once we've added our model to the $uses array, we can use it in the
main() method. In this example, our Order model should now be
accessible as $this->Order in the main() method of our new shell.

Here's a simple example of the logic we might use in this shell:

::

    class ReportShell extends Shell {
        var $uses = array('Order');
        function main() {
            //Get orders shipped in the last    month
            $month_ago = date('Y-m-d H:i:s',    strtotime('-1 month'));
            $orders =    $this->Order->find("all",array('conditions'=>"Order.shipped >= '$month_ago'"));
    
            //Print out each order's information
            foreach($orders as $order) {
                $this->out('Order date:  ' .    $order['Order']['created'] . "\n");
                $this->out('Amount: $' .    number_format($order['Order']['amount'], 2) . "\n");
                $this->out('----------------------------------------' .    "\n");
         
                $total += $order['Order']['amount'];
            }
    
            //Print out total for the selected orders
            $this->out("Total: $" .    number_format($total, 2) . "\n"); 
        }
    }

You would be able to run this report by executing this command (if
the cake command is in your PATH):

::

    $ cake report 

where report is the name of the shell file in /vendor/shells/
without the .php extension. This should yield something like:

::

    Hello user,
       Welcome to    CakePHP v1.2 Console
       ---------------------------------------------------------------
       App : app
       Path:    /path/to/cake/app
       ---------------------------------------------------------------
       Order date:    2007-07-30 10:31:12
       Amount:    $42.78
       ----------------------------------------
       Order date:    2007-07-30 21:16:03
       Amount:    $83.63
       ----------------------------------------
       Order date:    2007-07-29 15:52:42
       Amount:    $423.26
       ----------------------------------------
       Order date:    2007-07-29 01:42:22
       Amount:    $134.52
       ----------------------------------------
       Order date:    2007-07-29 01:40:52
       Amount:    $183.56
       ----------------------------------------
       Total:    $867.75

Tasks
~~~~~

Tasks are small extensions to shells. They allow logic to be shared
between shells, and are added to shells by using the special $tasks
class variable. For example in the core bake shell, there are a
number of tasks defined:

::

    <?php 
    class BakeShell extends Shell {
       var $tasks = array('Project', 'DbConfig', 'Model', 'View', 'Controller');
    }
    ?>

Tasks are stored in /vendors/shells/tasks/ in files named after
their classes. So if we were to create a new ‘cool’ task. Class
CoolTask (which extends Shell) would be placed in
/vendors/shells/tasks/cool.php. Class VeryCoolTask (which extends
Shell) would be placed in /vendors/shells/tasks/very\_cool.php.

Each task must at least implement an execute() method - shells will
call this method to start the task logic.

::

    <?php
    class SoundTask extends Shell {
       var $uses = array('Model'); // same as controller var $uses
       function execute() {}
    }
    ?>

You can access tasks inside your shell classes and execute them
there:

::

    <?php 
    class SeaShell extends Shell { // found in /vendors/shells/sea.php
       var $tasks = array('Sound'); //found in /vendors/shells/tasks/sound.php
       function main() {
           $this->Sound->execute();
       }
    }
    ?>

You can also access tasks directly from the command line:

::

    $ cake sea sound

In order to access tasks directly from the command line, the task
**must** be included in the shell class' $tasks property.
Therefore, be warned that a method called “sound” in the SeaShell
class would override the ability to access the functionality in the
Sound task specified in the $tasks array.


Running Shells as cronjobs
==========================

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

You can call it like:

::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

The ``-cli`` parameter takes a path which points to the php cli
executable and the ``-console`` parameter takes a path which points
to the CakePHP console.

As a cronjob this would look like:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app

A simple trick to debug a crontab is to set it up to dump it's
output to a logfile. You can do this like:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app >> /path/to/log/file.log
