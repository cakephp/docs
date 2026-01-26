# CakePHP Folder Structure

After you've downloaded the CakePHP application skeleton, there are a few top
level folders you should see:

- The *bin* folder holds the Cake console executables.

- The *config* folder holds the [Configuration](../development/configuration) files
  CakePHP uses. Database connection details, bootstrapping, core configuration files
  and more should be stored here.

- The *plugins* folder is where the [Plugins](../plugins) your application uses are stored.

- The *logs* folder normally contains your log files, depending on your log
  configuration.

- The *src* folder will be where your application’s source files will be placed.

- The *templates* folder has presentational files placed here:
  elements, error pages, layouts, and view template files.

- The *resources* folder has sub folder for various types of resource files.
  The *locales* sub folder stores language files for internationalization.

- The *tests* folder will be where you put the test cases for your application.

- The *tmp* folder is where CakePHP stores temporary data. The actual data it
  stores depends on how you have CakePHP configured, but this folder
  is usually used to store translation messages, model descriptions and sometimes
  session information.

- The *vendor* folder is where CakePHP and other application dependencies will
  be installed by [Composer](https://getcomposer.org). Editing these files is not
  advised, as Composer will overwrite your changes next time you update.

- The *webroot* directory is the public document root of your application. It
  contains all the files you want to be publicly reachable.

  Make sure that the *tmp* and *logs* folders exist and are writable,
  otherwise the performance of your application will be severely
  impacted. In debug mode, CakePHP will warn you, if these directories are not
  writable.

## The src Folder

CakePHP's *src* folder is where you will do most of your application
development. Let's look a little closer at the folders inside
*src*.

Command  
Contains your application's console commands. See
[Command Objects](../console-commands/commands) to learn more.

Console  
Contains the installation script executed by Composer.

Controller  
Contains your application's [Controllers](../controllers) and their components.

Middleware  
Stores any [Middleware](../controllers/middleware) for your application.

Model  
Contains your application's tables, entities and behaviors.

View  
Presentational classes are placed here: views, cells, helpers.

> [!NOTE]
> The folder `Command` is not present by default.
> You can add it when you need it.
