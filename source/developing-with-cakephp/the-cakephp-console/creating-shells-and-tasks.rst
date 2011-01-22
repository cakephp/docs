3.13.1 Creating Shells & Tasks
------------------------------

Creating Your Own Shells
~~~~~~~~~~~~~~~~~~~~~~~~

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
