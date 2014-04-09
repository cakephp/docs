Code Generation with Bake
#########################

CakePHP's bake console is another effort to get you up and running in CakePHP
– fast. The bake console can create any of CakePHP's basic ingredients: models,
behaviors, views, helpers, components, components test cases, fixtures and
plugins. And we aren't just talking skeleton classes: Bake can create a fully
functional application in just a few minutes. In fact, Bake is a natural step to
take once an application has been scaffolded.

Depending on the configuration of your setup, you may have to set
execute rights on the cake bash script or call it using ``./Console/cake
bake``. The cake console is run using the PHP CLI (command line
interface). If you have problems running the script, ensure that
you have the PHP CLI installed and that it has the proper modules
enabled (eg: MySQL) Users also might have issues if the
database host is 'localhost' and should try '127.0.0.1' instead.
This could cause issues with PHP CLI.

Before running bake you should make sure you have at least one database
connection configured. See the section on :ref:`database configuration
<database-configuration>` for more information.

When run with no arguments ``Console/cake bake`` will output a list of available
tasks. You should see something like::

    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/App/
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

    By using Console/cake bake [name] you can invoke a specific bake task.

You can get more information on what each task does, and what options are
availble using the ``--help`` option::

    $ Console/cake bake model --help

Modify Default HTML/Code Produced by bake
=========================================

If you wish to modify the default HTML output produced by the
"bake" command, you can create your own bake 'theme' which allows you to replace
some or all of the templates that bake uses. To create a new bake theme do the
following:

#. Create a new directory in ``App/Console/Templates/[name]``.
#. Copy any templates you want to override from
   ``vendor/cakephp/cakephp/src/Console/Templates/default``.  to matching
   directories in your application/plugin.
#. When running bake use the ``--theme`` option to specify the bake theme you
   want to use.

.. note::

    Bake theme names need to be unique, so don't use 'default'.


.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,atabase,database configuration,bash script,basic ingredients,roject,odel,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
