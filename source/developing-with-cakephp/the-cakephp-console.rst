3.13 The CakePHP Console
------------------------

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
