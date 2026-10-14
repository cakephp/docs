# Plugins

CakePHP allows you to set up a combination of controllers, models,
and views and release them as a packaged application plugin that
others can use in their CakePHP applications. Have a sweet user
management module, simple blog, or web services module in one of
your applications? Package it as a CakePHP plugin so you can pop it
into other applications.

The main tie between a plugin and the application it has been
installed into, is the application's configuration (database
connection, etc.). Otherwise, it operates in its own little space,
behaving much like it would if it were an application on its own.

Many plugins written for CakePHP 2 were never updated for PHP 8. The
[Piece of Cake 2](https://github.com/pieceofcake2) project maintains PHP 8
compatible forks of popular plugins such as DebugKit, Bake, Upload and
TwigView; see [Repositories and Plugins](/plugins/maintained-plugins) for the full
list. Other plugins that require `cakephp/cakephp` 2.x can still be installed,
because `pieceofcake2/cakephp` replaces that package in Composer, but you need
to check yourself whether they work on PHP 8.

- [How To Install Plugins](plugins/how-to-install-plugins)
- [How To Use Plugins](plugins/how-to-use-plugins)
- [How To Create Plugins](plugins/how-to-create-plugins)
