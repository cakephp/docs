Plugin Class
############

.. php:namespace:: Cake\Core

.. php:class:: Plugin

The Plugin class is responsible for resource location and path management of plugins.

Locating Plugins
================

.. php:staticmethod:: path(string $plugin)

Plugins can be located with Plugin. Using ``Plugin::path('DebugKit');``
for example, will give you the full path to the DebugKit plugin::

    $path = Plugin::path('DebugKit');

Check if a Plugin is Loaded
===========================

You can check dynamically inside your code if a specific plugin has been loaded::

    $isLoaded = Plugin::isLoaded('DebugKit');

Use ``Plugin::loaded()`` if you want to get a list of all currently loaded plugins.

Finding Paths to Namespaces
===========================

.. php:staticmethod:: classPath(string $plugin)

Used to get the location of the plugin's class files::

    $path = App::classPath('DebugKit');

Finding Paths to Resources
==========================

.. php:staticmethod:: templatePath(string $plugin)

The method returns the path to the plugins' templates::

    $path = Plugin::templatePath('DebugKit');

The same goes for the config path::

    $path = Plugin::configPath('DebugKit');

.. meta::
    :title lang=en: Plugin Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
