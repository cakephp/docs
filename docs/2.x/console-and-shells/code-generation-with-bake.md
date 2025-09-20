# Code Generation with Bake

CakePHP's Bake console is another effort to get you up and running
in CakePHP – fast. The Bake console can create any of CakePHP's
basic ingredients: models, views and controllers. And we aren't
just talking skeleton classes: Bake can create a fully functional
application in just a few minutes. In fact, Bake is a natural step
to take once an application has been scaffolded.

See [The Cakephp Console](../console-and-shells#the-cakephp-console) section for instructions on how to use
the CakePHP console in general. Depending on the configuration of your
setup, you may have to set execute rights on the cake bash script or
call it using `./Console/cake bake`. The cake console is run using the
PHP CLI (command line interface). If you have problems running the script,
ensure that you have the PHP CLI installed and that it has the proper
modules enabled (eg: MySQL) Users also might have issues if the
database host is 'localhost' and should try '127.0.0.1' instead.
This could cause issues with PHP CLI.

When running Bake for the first time, you'll be prompted to create
a Database Configuration file, if you haven't created one already.

After you've created a Database Configuration file, running Bake
will present you with the following options:

``` text
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
```

Alternatively, you can run any of these commands directly from the
command line:

``` bash
$ cake bake db_config
$ cake bake model
$ cake bake view
$ cake bake controller
$ cake bake project
$ cake bake fixture
$ cake bake test
$ cake bake plugin plugin_name
$ cake bake all
```

::: info Changed in version 2.5
Test files produced by `bake test` include calls to  to draw attention to empty test methods. Before 2.5, empty tests pass silently.
:::

## Modify default HTML produced by "baked" templates

If you wish to modify the default HTML output produced by the
"bake" command, follow these simple steps:

### For baking custom views

1.  Go into: lib/Cake/Console/Templates/default/views
2.  Notice the 4 files there
3.  Copy them to your:
    app/Console/Templates/\[themename\]/views
4.  Make changes to the HTML output to control the way "bake" builds
    your views

The `[themename]` path segment should be the name of the bake
theme that you are creating. Bake theme names need to be unique, so
don't use 'default'.

### For baking custom projects

1.  Go into: lib/Cake/Console/Templates/skel
2.  Notice the base application files there
3.  Copy them to your:
    app/Console/Templates/skel
4.  Make changes to the HTML output to control the way "bake" builds
    your views
5.  Pass the skeleton path parameter to the project task

<!-- -->

    cake bake project --skel Console/Templates/skel

<div class="note">

<div class="title">

Note

</div>

- You must run the specific project task `cake bake project` so
  that the path parameter can be passed.
- The template path is relative to the current path of the Command
  Line Interface.
- Since the full path to the skeleton needs to be manually
  entered, you can specify any directory holding your template build
  you want, including using multiple templates. (Unless CakePHP starts
  supporting overriding the skel folder like it does for views)

</div>
