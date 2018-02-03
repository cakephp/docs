Темы
####

Темы в CakePHP - это просто плагины, предоставляющие файлы шаблонов оформления.
См. раздел :ref:`plugin-create-your-own`. Вы можете исползовать преимущества
тем, делая простой и быстрой смену внешнего вида ваших страниц. В дополнение к
файлам шаблонов, они также могут предоставлять хелперы и ячейки, если они
требуются вашей теме оформления. При использовании ячеек и хелперов из вашей
темы, вам также придется использовать :term:`plugin syntax`.

Чтобы использовать темы, установите название темы в экшене вашего контроллера,
либо в коллбэк-методе ``beforeRender()``::

    class ExamplesController extends AppController
    {
        // Для CakePHP ниже версии 3.1
        public $theme = 'Modern';

        public function beforeRender(\Cake\Event\Event $event)
        {
            $this->viewBuilder()->setTheme('Modern');

            // Для CakePHP ниже версии 3.5
            $this->viewBuilder()->theme('Modern');
        }
    }

Файлы шаблона темы должны находиться в паке плагина с соответствующим названием.
К примеру, использованная выше тема может быть найдена в
**plugins/Modern/src/Template**. Важно помнить, что CakePHP ожидает имена
плагинов/тем в стиле PascalCase. В остальном, структура папки
**plugins/Modern/src/Template** аналогична используемой в **src/Template/**.

Например, файл представления для экшена ``edit`` контроллера ``Posts`` будет
расположен в файле **plugins/Modern/src/Template/Posts/edit.ctp**. Файлы макетов
будут находиться в **plugins/Modern/src/Template/Layout/**.

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

    // creates a path like
    /purple_cupcake/css/main.css

    // and links to
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=ru: Темы
    :keywords lang=ru: production environments,папка тем,файлы макетов,development requests,callback functions,folder structure,представление по умолчанию,dispatcher,symlink,case basis,макеты,assets,cakephp,темы,advantage
