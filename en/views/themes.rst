Themes
######

You can take advantage of themes, making it easy to switch the look and feel of
your page quickly and easily. Themes in CakePHP are simply plugins that focus on
providing view files. In addition to template files, they can also provide
helpers and cells if your theming requires that. When using cells and helpers from your
theme, you will need to continue using the :term:`plugin-syntax`.

To use themes, specify the theme name in your
controller::

    class ExampleController extends AppController {
        public $theme = 'Example';
    }

You can also set or change the theme name within an action or within the
``beforeFilter`` or ``beforeRender`` callback functions::

    $this->theme = 'AnotherExample';

Theme view files need to be within a plugin with the same name. For example,
the above theme would be found in ``/Plugin/AnotherExample/Template``.
Its important to remember that CakePHP expects CamelCase plugin/theme names. Beyond
that, the folder structure within the ``/Plugin/Example/Template`` folder is
exactly the same as ``/App/Template/``.

For example, the view file for an edit action of a Posts controller would reside
at ``/Plugin/Example/Templte/Posts/edit.ctp``. Layout files would reside in
``/Plugin/Example/Template/Layout/``.

If a view file can't be found in the theme, CakePHP will try to locate the view
file in the ``/App/Template/`` folder. This way, you can create master view files
and simply override them on a case-by-case basis within your theme folder.

Theme Assets
============

Because themes are standard CakePHP plugins, they can include any necessary
assets in their webroot directory. This allows for easy packaging and
distribution of themes. Whilst in development, requests for theme assets will be
handled by :php:class:`Cake\\Routing\\Dispatcher`. To improve performance for production
environments, it's recommended that you :ref:`symlink-assets`.

All of CakePHP's built-in helpers are aware of themes and will create the
correct paths automatically. Like view files, if a file isn't in the theme
folder, it will default to the main webroot folder::

    //When in a theme with the name of 'purple_cupcake'
    $this->Html->css('main.css');

    //creates a path like
    /purple_cupcake/css/main.css

    // and links to
    Plugin/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=en: Themes
    :keywords lang=en: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage
