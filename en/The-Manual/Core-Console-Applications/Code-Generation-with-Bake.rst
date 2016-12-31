Code Generation with Bake
#########################

You’ve already learned about scaffolding in CakePHP: a simple way to get
up and running with only a database and some bare classes. CakePHP’s
Bake console is another effort to get you up and running in CakePHP –
fast. The Bake console can create any of CakePHP’s basic ingredients:
models, views and controllers. And we aren’t just talking skeleton
classes: Bake can create a fully functional application in just a few
minutes. In fact, Bake is a natural step to take once an application has
been scaffolded.

Those new to Bake (especially Windows users) may find the `Bake
screencast <https://cakephp.org/screencasts/view/6>`_ helpful in setting
things up before continuing.

Depending on the configuration of your setup, you may have to set
execute rights on the cake bash script or call it using ./cake bake. The
cake console is run using the PHP CLI (command line interface). If you
have problems running the script, ensure that you have the PHP CLI
installed and that it has the proper modules enabled (eg: MySQL).

When running Bake for the first time, you'll be prompted to create a
Database Configuration file, if you haven't created one already.

After you've created a Database Configuration file, running Bake will
present you with the following options:

::

    ---------------------------------------------------------------
    App : app
    Path: /path-to/project/app
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/Q) 
    >  

Alternatively, you can run any of these commands directly from the
command line:

::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view 
    $ cake bake controller
    $ cake bake all
    $ cake bake project
    $ cake bake test

