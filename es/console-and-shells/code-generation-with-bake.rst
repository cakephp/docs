Code Generation with Bake
#########################

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

CakePHP's bake console is another effort to get you up and running in CakePHP
– fast. The bake console can create any of CakePHP's basic ingredients: models,
behaviors, views, helpers, components, components test cases, fixtures and
plugins. And we aren't just talking skeleton classes: Bake can create a fully
functional application in just a few minutes. In fact, Bake is a natural step to
take once an application has been scaffolded.

Depending on how your computer is configured, you may have to set
execute rights on the cake bash script to call it using ``bin/cake
bake``. The cake console is run using the PHP CLI (command line
interface). If you have problems running the script, ensure that
you have the PHP CLI installed and that it has the proper modules
enabled (eg: MySQL) Users also might have issues if the
database host is 'localhost' and should try '127.0.0.1' instead.
This could cause issues with PHP CLI.

Before running bake you should make sure you have at least one database
connection configured. See the section on :ref:`database configuration
<database-configuration>` for more information.

When run with no arguments ``bin/cake bake`` will output a list of available
tasks. You should see something like::

    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    The following commands you can generate skeleton code your your application.

    Available bake commands:

    behavior
    component
    controller
    fixture
    helper
    model
    plugin
    project
    test
    view

    By using bin/cake bake [name] you can invoke a specific bake task.

You can get more information on what each task does, and what options are
availble using the ``--help`` option::

    $ bin/cake bake model --help

Create New Tasks for Bake
=========================

Bake features an extensible architecture that allows your application or plugins
to provide new tasks, or replace tasks provided by CakePHP. By extending
``Cake\Console\Command\Task\BakeTask``, bake will find your new task and include
it as part of bake.

As an example, we'll make a task that creates shell classes. First, create
the task file ``src/Console/Command/Task/ShellTask.php``. We'll extend the
``SimpleBakeTask`` for now as our shell task will be simple. ``SimpleBakeTask``
is abstract and requires us to define 4 methods that tell bake what the task is
called, where the files it generates should go, and what template to use. Our
ShellTask.php file should look like::

    <?php
    namespace App\Console\Command\Task;

    use Cake\Console\Command\Task\SimpleBakeTask;

    class ShellTask extends SimpleBakeTask
    {
        public $pathFragment = 'Console/Command/';

        public function name()
        {
            return 'shell';
        }

        public function fileName($name)
        {
            return $name . 'Shell.php';
        }

        public function template()
        {
            return 'shell';
        }

    }

Once this file has been created, we need to create a template that bake can use
when generating code. Create
``src/Template/Bake/app/classes/shell.ctp``. In this file we'll add
the following content::

    <?php
    echo "<?php\n"; ?>
    namespace <?= $namespace ?>\Console\Command;

    use Cake\Console\Shell;

    /**
     * <?= $name ?> shell
     */
    class <?= $name ?>Shell extends Shell
    {

        public function main()
        {
            // Add code.
        }
    }

You should now see your new task in the output of ``bin/cake bake``. You can
run your new task by running ``bin/cake bake shell Example --template app``.
This will generate a new ``ExampleShell`` class for your application to use.

Modify Default HTML/Code Produced by bake
=========================================

If you wish to modify the default HTML output produced by the
"bake" command, you can create your own bake 'template' which allows you to replace
some or all of the templates that bake uses. To create a new bake template do the
following:

#. Create a new directory in ``src/Template/Bake/[name]``.
#. Copy any templates you want to override from
   ``vendor/cakephp/cakephp/src/Template/Bake/default``.  to matching
   directories in your application/plugin.
#. When running bake use the ``--template`` option to specify the bake template you
   want to use.

.. note::

    Bake template names need to be unique, so don't use 'default'.


.. meta::
    :title lang=es: Code Generation with Bake
    :keywords lang=es: command line interface,functional application,atabase,database configuration,bash script,basic ingredients,roject,odel,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
