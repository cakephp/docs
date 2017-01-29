Themes
######

You can take advantage of themes, making it easy to switch the look and feel of
your page quickly and easily.

To use themes, you need to tell your controller to use the ThemeView class
instead of the default View class::

    <?php
    class ExampleController extends AppController {
        public $viewClass = 'Theme';
    }

To declare which theme to use by default, specify the theme name in your
controller::

    <?php
    class ExampleController extends AppController {
        public $viewClass = 'Theme';
        public $theme = 'Example';
    }

You can also set or change the theme name within an action or within the
``beforeFilter`` or ``beforeRender`` callback functions::

    <?php
    $this->theme = 'AnotherExample';

Theme view files need to be within the ``/app/View/Themed/`` folder.  Within the
themed folder, create a folder using the same name as your theme name. Beyond
that, the folder structure within the ``/app/View/Themed/Example/`` folder is
exactly the same as ``/app/View/``.

For example, the view file for an edit action of a Posts controller would reside
at ``/app/View/Themed/Example/Posts/edit.ctp``. Layout files would reside in
``/app/View/Themed/Example/Layouts/``.

If a view file can't be found in the theme, CakePHP will try to locate the view
file in the ``/app/View/`` folder. This way, you can create master view files
and simply override them on a case-by-case basis within your theme folder.

Theme assets
------------

Themes can contain static assets as well as view files.  A theme can include any
necessary assets in its webroot directory. This allows for easy packaging and
distribution of themes.  While in development, requests for theme assets will be
handled by :php:class:`Dispatcher`.  To improve performance for production
environments, it's recommended that you either symlink or copy theme assets into
the application's webroot. See below for more information.

To use the new theme webroot create directories like
``app/View/Themed/<themeName>/webroot<path_to_file>`` in your theme. The
Dispatcher will handle finding the correct theme assets in your view paths.

All of CakePHP's built-in helpers are aware of themes and will create the
correct paths automatically. Like view files, if a file isn't in the theme
folder, it will default to the main webroot folder::

    <?php
    //When in a theme with the name of 'purple_cupcake'
    $this->Html->css('main.css');
     
    //creates a path like
    /theme/purple_cupcake/css/main.css
     
    //and links to
    app/View/Themed/PurpleCupcake/webroot/css/main.css 

Increasing performance of plugin and theme assets
-------------------------------------------------

It's a well known fact that serving assets through PHP is guaranteed to be slower
than serving those assets without invoking PHP. And while the core team has
taken steps to make plugin and theme asset serving as fast as possible, there
may be situations where more performance is required. In these situations it's
recommended that you either symlink or copy out plugin/theme assets to
directories in ``app/webroot`` with paths matching those used by cakephp.


-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` becomes
   ``app/webroot/DebugKit/js/my_file.js``
-  ``app/View/Themed/Navy/webroot/css/navy.css`` becomes
   ``app/webroot/theme/Navy/css/navy.css``


.. meta::
    :title lang=en: Themes
    :keywords lang=en: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage