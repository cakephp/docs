CakePHP Folder Structure
########################

After you've downloaded and extracted the CakePHP application, these are the files
and folders you should see:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

You'll notice a few top level folders:

- The *bin* folder holds the Cake console executables.
- The *config* folder holds the (few) :doc:`/development/configuration` files
  CakePHP uses. Database connection details, bootstrapping, core configuration files
  and more should be stored here.
- The *plugins* folder is where the :doc:`/plugins` your application uses are stored.
- The *logs* folder normally contains your log files, depending on your log
  configuration.
- The *src* folder will be where you work your magic: it’s where
  your application’s files will be placed.
- The *tests* folder will be where you put the test cases for your application.
- The *tmp* folder is where CakePHP stores temporary data. The actual data it
  stores depends on how you have CakePHP configured, but this folder
  is usually used to store model descriptions and sometimes
  session information.
- The *vendor* folder is where CakePHP and other application dependencies will
  be installed. Make a personal commitment **not** to edit files in this folder.
  We can’t help you if you’ve modified the core.
- The *webroot* directory is the public document root of your application. It
  contains all the files you want to be publically reachable.

  Make sure that the *tmp* and *logs* folders exist and are writable,
  otherwise the performance of your application will be severely
  impacted. In debug mode, CakePHP will warn you, if it is not the
  case.

The src Folder
==============

CakePHP's *src* folder is where you will do most of your application
development. Let's look a little closer at the folders inside
*src*.

Console
    Contains the console commands and console tasks for your application.
    For more information see :doc:`/console-and-shells`.
Controller
    Contains your application's controllers and their components.
Locale
    Stores string files for internationalization.
Model
    Contains your application's tables, entities and behaviors.
View
    Presentational classes are placed here: cells, helpers, and template files.
Template
    Presentational files are placed here: elements, error pages,
    layouts, and view template files.


.. meta::
    :title lang=es: CakePHP Folder Structure
    :keywords lang=es: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
