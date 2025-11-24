Themes
######

Themes in CakePHP are simply plugins that focus on providing template files.
See the section on :ref:`plugin-create-your-own`.
You can take advantage of themes, allowing you to switch the look and feel of
your page quickly. In addition to template files, they can also provide helpers
and cells if your theming requires that. When using cells and helpers from your
theme, you will need to continue using the :term:`plugin syntax`.

First ensure your theme plugin is loaded in your application's ``bootstrap``
method. For example::

    // Load our plugin theme residing in the folder /plugins/Modern
    $this->addPlugin('Modern');

To use themes, set the theme name in your controller's action or
``beforeRender()`` callback::

    class ExamplesController extends AppController
    {
        public function beforeRender(\Cake\Event\EventInterface $event): void
        {
            $this->viewBuilder()->setTheme('Modern');
        }
    }

Theme template files need to be within a plugin with the same name. For example,
the above theme would be found in **plugins/Modern/templates**.
It's important to remember that CakePHP expects PascalCase plugin/theme names. Beyond
that, the folder structure within the **plugins/Modern/templates** folder is
exactly the same as **templates/**.

For example, the view file for an edit action of a Posts controller would reside
at **plugins/Modern/templates/Posts/edit.php**. Layout files would reside in
**plugins/Modern/templates/layout/**. You can provide customized templates
for plugins with a theme as well. If you had a plugin named 'Cms', that
contained a TagsController, the Modern theme could provide
**plugins/Modern/templates/plugin/Cms/Tags/edit.php** to replace the edit
template in the plugin.

If a view file can't be found in the theme, CakePHP will try to locate the view
file in the **templates/** folder. This way, you can create master template files
and simply override them on a case-by-case basis within your theme folder.

Theme Assets
============

Because themes are standard CakePHP plugins, they can include any necessary
assets in their webroot directory. This allows for packaging and
distribution of themes. Whilst in development, requests for theme assets will be
handled by :php:class:`Cake\Routing\Middleware\AssetMiddleware` (which is loaded
by default in cakephp/app ``Application::middleware()``). To improve
performance for production environments, it's recommended that you :ref:`symlink-assets`.

All of CakePHP's built-in helpers are aware of themes and will create the
correct paths automatically. Like template files, if a file isn't in the theme
folder, it will default to the main webroot folder::

    // When in a theme with the name of 'purple_cupcake'
    $this->Html->css('main.css');

    // creates a path like
    /purple_cupcake/css/main.css

    // and links to
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=en: Themes
    :keywords lang=en: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage
