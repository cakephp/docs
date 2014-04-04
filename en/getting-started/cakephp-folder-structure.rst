CakePHP Folder Structure
########################

After you've downloaded and extracted the CakePHP application, these are the files
and folders you should see:

- App
- Plugin
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

You'll notice a few top level folders:

- The *App* folder will be where you work your magic: it’s where
  your application’s files will be placed.
- The *Plugin* folder is where the :doc:`/plugins` your application uses are stored.
- The *vendor* folder is where CakePHP and other application dependencies will
  be installed. Make a personal commitment **not** to edit files in this folder.
  We can’t help you if you’ve modified the core.
- The *webroot* directory is public document root of your application. It
  contains all the files you want to be publically reachable.
- The *tmp* folder is where CakePHP stores temporary data. The actual data it
  stores depends on how you have CakePHP configured, but this folder
  is usually used to store model descriptions, logs, and sometimes
  session information.

  Make sure that this folder exists and that it is writable,
  otherwise the performance of your application will be severely
  impacted. In debug mode, CakePHP will warn you if it is not the
  case.

The App Folder
==============

CakePHP's *app* folder is where you will do most of your application
development. Let's look a little closer at the folders inside
*app*.

Config
    Holds the (few) configuration files CakePHP uses. Database
    connection details, bootstrapping, core configuration files and
    more should be stored here.
Console
    Contains the console commands and console tasks for your application.
    This directory can also contain a ``Templates`` directory to customize the
    output of bake. For more information see :doc:`/console-and-shells`.
Controller
    Contains your application's controllers and their components.
Lib
    Contains libraries that do not come from 3rd parties or
    external vendors. This allows you to separate your organization's
    internal libraries from vendor libraries.
Locale
    Stores string files for internationalization.
Model
    Contains your application's models, behaviors, and datasources.
Test
    This directory contains all the test cases and test fixtures for your
    application. The ``Test/Case`` directory should mirror your application and
    contain one or more test cases per class in your application. For more
    information on test cases and test fixtures, refer to the :doc:`/development/testing`
    documentation.
View
    Presentational files are placed here: elements, error pages,
    helpers, layouts, and view files.


.. meta::
    :title lang=en: CakePHP Folder Structure
    :keywords lang=en: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
