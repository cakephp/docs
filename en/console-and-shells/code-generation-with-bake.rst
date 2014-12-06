Code Generation with Bake
#########################

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

Changing bake's output
======================

One you are familiar with using bake, you may wish to taylor the output to
your specific needs, or add a new option/class to the bake cli. For details
on how to achieve this see :doc:`/development/extending-bake.rst`.

.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,atabase,database configuration,bash script,basic ingredients,roject,odel,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
