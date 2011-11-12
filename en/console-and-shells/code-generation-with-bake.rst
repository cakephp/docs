Code Generation with Bake
#########################

You’ve already learned about scaffolding in CakePHP: a simple way
to get up and running with only a database and some bare classes.
CakePHP’s Bake console is another effort to get you up and running
in CakePHP – fast. The Bake console can create any of CakePHP’s
basic ingredients: models, views and controllers. And we aren’t
just talking skeleton classes: Bake can create a fully functional
application in just a few minutes. In fact, Bake is a natural step
to take once an application has been scaffolded.

Those new to Bake (especially Windows users) may find the
`Bake screencast <http://tv.cakephp.org/video/gwoo/2010/12/24/setting_up_the_cakephp_console_on_windows>`_
helpful in setting things up before continuing.

Depending on the configuration of your setup, you may have to set
execute rights on the cake bash script or call it using ./cake
bake. The cake console is run using the PHP CLI (command line
interface). If you have problems running the script, ensure that
you have the PHP CLI installed and that it has the proper modules
enabled (eg: MySQL).

When running Bake for the first time, you'll be prompted to create
a Database Configuration file, if you haven't created one already.

After you've created a Database Configuration file, running Bake
will present you with the following options:

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
    [F]ixture
    [T]est case
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/F/T/Q)
    >  

Alternatively, you can run any of these commands directly from the
command line::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view
    $ cake bake controller
    $ cake bake project
    $ cake bake fixture
    $ cake bake test
    $ cake bake plugin plugin_name
    $ cake bake all


Modify default HTML produced by "baked" templates
=================================================

If you wish to modify the default HTML output produced by the
"bake" command, follow these simple steps:

For baking custom views
------------------------


#. Go into: lib/Cake/Console/Templates/default/views
#. Notice the 4 files there
#. Copy them to your:
   app/Console/Templates/[themename]/views
#. Make changes to the HTML output to control the way "bake" builds
   your views

The ``[themename]`` path segment should be the name of the bake
theme that you are creating. Bake theme names need to be unique, so
don't use 'default'.

For baking custom projects
--------------------------

Go into: lib/Cake/Console/Templates/skel
Notice the base application files there
Copy them to your: app/Console/Templates/skel
Make changes to the HTML output to control the way "bake" builds
your views
Pass the skeleton path parameter to the project task
::

    cake bake project -skel Console/Templates/skel

.. note::

    -  You must run the specific project task ``cake bake project`` so
       that the path parameter can be passed.
    -  The template path is relative to the current path of the Command
       Line Interface.
    -  Since the full path to the skeleton needs to be manually
       entered, you can specify any directory holding your template build
       you want, including using multiple templates. (Unless Cake starts
       supporting overriding the skel folder like it does for views)


Bake improvements in 1.3
========================

For 1.3 bake has had a significant overhaul, and a number of
features and enhancements have been built in.


-  Two new tasks (FixtureTask and TestTask) are accessible from the
   main bake menu
-  A third task (TemplateTask) has been added for use in your
   shells.
-  All the different bake tasks now allow you to use connections
   other than default for baking. Using the ``-connection`` parameter.
-  Plugin support has been greatly improved. You can use either
   ``-plugin PluginName`` or ``Plugin.class``.
-  Questions have been clarified, and made easier to understand.
-  Multiple validations on models has been added.
-  Self Associated models using ``parent_id`` are now detected. For
   example if your model is named Thread, a ParentThread and
   ChildThread association will be created.
-  Fixtures and Tests can be baked separately.
-  Baked Tests include as many fixtures as they know about,
   including plugin detection (plugin detection does not work on
   PHP4).

So with the laundry list of features, we'll take some time to look
at some of the new commands, new parameters and updated features.

**New FixtureTask, TestTask and TemplateTask.**

Fixture and test baking were a bit of a pain in the past. You could
only generate tests when baking the classes, and fixtures could
only be generated when baking models. This made adding tests to
your applications later or even regenerating fixtures with new
schemas a bit painful. For 1.3 we've separated out Fixture and Test
making them separate tasks. This allows you to re-run them and
regenerate tests and fixtures at any point in your development
process.

In addition to being rebuildable at any time, baked tests are now
attempt to find as many fixtures as possible. In the past getting
into testing often involved fighting through numerous 'Missing
Table' errors. With more advanced fixture detection we hope to make
testing easier and more accessible.

Test cases also generate skeleton test methods for every
non-inherited public method in your classes. Saving you one extra
step.

``TemplateTask`` is a behind the scenes task, and it handles file
generation from templates. In previous versions of CakePHP baked
views were template based, but all other code was not. With 1.3
almost all the content in the files generated by bake are
controlled by templates and the ``TemplateTask``.

The ``FixtureTask`` not only generates fixtures with dummy data,
but using the interactive options or the ``-records`` option you
can enable fixture generation using live data.

**New bake command**
New commands have been added to make baking easier and faster.
Controller, Model, View baking all feature an ``all`` subcommand,
that builds everything at once and makes speedy rebuilds easy.

::

    cake bake model all

Would bake all the models for an application in one shot. Similarly
``cake bake controller all`` would bake all controllers and
``cake bake view all`` would generate all view files. Parameters on
the ``ControllerTask`` have changed as well.
``cake bake controller scaffold`` is now
``cake bake controller public``. ``ViewTask`` has had an ``-admin``
flag added, using ``-admin`` will allow you to bake views for
actions that begin with ``Routing.admin``

As mentioned before ``cake bake fixture`` and ``cake bake test``
are new, and have several subcommands each.
``cake bake fixture all`` will regenerate all the basic fixtures
for your application. The ``-count`` parameter allows you to set
the number of fake records that are created. By running fixture
task interactively you can generate fixtures using the data in your
live tables. You can use ``cake bake test <type> <class>`` to
create test cases for already created objects in your app. Type
should be one of the standard CakePHP types ('component',
'controller', 'model', 'helper', 'behavior') but doesn't have to
be. Class should be an existing object of the chosen type.

**Templates Galore**

New in bake for 1.3 is the addition of more templates. In 1.2 baked
views used templates that could be changed to modify the view files
bake generated. In 1.3 templates are used to generate all output
from bake. There are separate templates for controllers, controller
action sets, fixtures, models, test cases, and the view files from
1.2. As well as more templates, you can also have multiple template
sets or, bake themes. Bake themes can be provided in your app, or
as part of plugins. An example plugin path for bake theme would be
``app/Plugin/BakeTheme/Console/Templates/dark_red/``. An
app bake theme called ``blue_bunny`` would be placed in
``app/Console/Templates/blue_bunny``. You can look at
``lib/Cake/Console/Templates/default/`` to see what directories and
files are required of a bake theme. However, like view files, if
your bake theme doesn't implement a template, other installed
themes will be checked until the correct template is found.

**Additional plugin support.**

New in 1.3 are additional ways to specify plugin names when using
bake. In addition to ``cake bake plugin Todo controller Posts``,
there are two new forms. ``cake bake controller Todo.Posts`` and
``cake bake controller Posts -plugin Todo``. The plugin parameter
can be while using interactive bake as well.
``cake bake controller -plugin Todo``, for example will allow you
to use interactive bake to add controllers to your Todo plugin.
Additional / multiple plugin paths are supported as well. In the
past bake required your plugin to be in app/plugins. In 1.3 bake
will find which of the pluginPaths the named plugin is located on,
and add the files there.




.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,atabase,database configuration,bash script,basic ingredients,roject,odel,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql