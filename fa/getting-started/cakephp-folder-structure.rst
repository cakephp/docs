CakePHP Folder Structure
########################

After you've downloaded and extracted CakePHP, these are the files
and folders you should see:

-  app
-  lib
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

You'll notice three main folders:

-  The *app* folder will be where you work your magic: it’s where
   your application’s files will be placed.
-  The *lib* folder is where we’ve worked our magic. Make a
   personal commitment **not** to edit files in this folder. We can’t
   help you if you’ve modified the core.
-  Finally, the *vendors* folder is where you’ll place third-party
   PHP libraries you need to use with your CakePHP applications.

The App Folder
==============

CakePHP’s app folder is where you will do most of your application
development. Let’s look a little closer at the folders inside of
app.

Config
    Holds the (few) configuration files CakePHP uses. Database
    connection details, bootstrapping, core configuration files and
    more should be stored here.
Controller
    Contains your application’s controllers and their components.
Lib
    Contains 1st party libraries that do not come from 3rd parties or
    external vendors. This allows you to separate your organization's
    internal libraries from vendor libraries.
Locale
    Stores string files for internationalization.
Model
    Contains your application’s models, behaviors, and datasources.
Plugin
    Contains plugin packages.
tmp
    This is where CakePHP stores temporary data. The actual data it
    stores depends on how you have CakePHP configured, but this folder
    is usually used to store model descriptions, logs, and sometimes
    session information.

    Make sure that this folder exists and that it is writable,
    otherwise the performance of your application will be severely
    impacted. In debug mode, CakePHP will warn you if it is not the
    case.

Vendor
    Any third-party classes or libraries should be placed here. Doing
    so makes them easy to access using the App::import('vendor',
    'name') function. Keen observers will note that this seems
    redundant, as there is also a vendors folder at the top level of
    our directory structure. We'll get into the differences between the
    two when we discuss managing multiple applications and more complex
    system setups.
View
    Presentational files are placed here: elements, error pages,
    helpers, layouts, and view files.
webroot
    In a production setup, this folder should serve as the document
    root for your application. Folders here also serve as holding
    places for CSS stylesheets, images, and JavaScript files.


.. meta::
    :title lang=en: CakePHP Folder Structure
    :keywords lang=en: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp