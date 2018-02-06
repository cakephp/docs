Themes
######

Themes in CakePHP are simply plugins that focus on providing template files.
See the section on :ref:`plugin-create-your-own`.
You can take advantage of themes, making it easy to switch the look and feel of
your page quickly. In addition to template files, they can also provide helpers
and cells if your theming requires that. When using cells and helpers from your
theme, you will need to continue using the :term:`plugin syntax`.

To use themes, set the theme name in your controller's action or
``beforeRender()`` callback::

    class ExamplesController extends AppController
    {
        // For CakePHP before 3.1
        public $theme = 'Modern';

        public function beforeRender(\Cake\Event\Event $event)
        {
            $this->viewBuilder()->setTheme('Modern');

            // For CakePHP before 3.5
            $this->viewBuilder()->theme('Modern');
        }
    }

Theme template files need to be within a plugin with the same name. For example,
the above theme would be found in **plugins/Modern/src/Template**.
It's important to remember that CakePHP expects PascalCase plugin/theme names. Beyond
that, the folder structure within the **plugins/Modern/src/Template** folder is
exactly the same as **src/Template/**.

For example, the view file for an edit action of a Posts controller would reside
at **plugins/Modern/src/Template/Posts/edit.ctp**. Layout files would reside in
**plugins/Modern/src/Template/Layout/**. You can provide customized templates
for plugins with a theme as well. If you had a plugin named 'Cms', that
contained a TagsController, the Modern theme could provide
**plugins/Modern/src/Template/Plugin/Cms/Tags/edit.ctp** to replace the edit
template in the plugin.

If a view file can't be found in the theme, CakePHP will try to locate the view
file in the **src/Template/** folder. This way, you can create master template files
and simply override them on a case-by-case basis within your theme folder.

If your theme also acts as a plugin, don't forget to ensure it is loaded in
**config/bootstrap.php**. For example::

    /**
     * Load our plugin theme residing in the folder /plugins/Modern
     */
    Plugin::load('Modern');

Theme Assets
============

Because themes are standard CakePHP plugins, they can include any necessary
assets in their webroot directory. This allows for easy packaging and
distribution of themes. Whilst in development, requests for theme assets will be
handled by :php:class:`Cake\\Routing\\Dispatcher`. To improve performance for production
environments, it's recommended that you :ref:`symlink-assets`.

All of CakePHP's built-in helpers are aware of themes and will create the
correct paths automatically. Like template files, if a file isn't in the theme
folder, it will default to the main webroot folder::

    // When in a theme with the name of 'purple_cupcake'
    $this->Html->css('main.css');

<<<<<<< HEAD
    // creates a path like
    /purple_cupcake/css/main.css
=======
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
directories in ``app/webroot`` with paths matching those used by CakePHP.


-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` becomes
   ``app/webroot/debug_kit/js/my_file.js``
-  ``app/View/Themed/Navy/webroot/css/navy.css`` becomes
   ``app/webroot/theme/Navy/css/navy.css``
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // and links to
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=en: Themes
    :keywords lang=en: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage
