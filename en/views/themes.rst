Themes
======

You can take advantage of themes, making it easy to switch the look
and feel of your page quickly and easily.

To use themes, you need to tell your controller to use the
ThemeView class instead of the default View class::

    <?php
    class ExampleController extends AppController {
        var $view = 'Theme';
    }

To declare which theme to use by default, specify the theme name in
your controller::

    <?php
    class ExampleController extends AppController {
        var $view = 'Theme';
        var $theme = 'example';
    }

You can also set or change the theme name within an action or
within the ``beforeFilter`` or ``beforeRender`` callback
functions.

::

    <?php
    $this->theme = 'another_example';

Theme view files need to be within the /app/views/themed/ folder.
Within the themed folder, create a folder using the same name as
your theme name. Beyond that, the folder structure within the
/app/views/themed/example/ folder is exactly the same as
/app/views/.

For example, the view file for an edit action of a Posts controller
would reside at /app/views/themed/example/posts/edit.ctp. Layout
files would reside in /app/views/themed/example/layouts/.

If a view file can't be found in the theme, CakePHP will try to
locate the view file in the /app/views/ folder. This way, you can
create master view files and simply override them on a case-by-case
basis within your theme folder.

Theme assets
------------

In previous versions themes needed to be split into their view and
asset parts. New for 1.3 is a webroot directory as part of a theme.
This webroot directory can contain any static assets that are
included as part of your theme. Allowing the theme webroot to exist
inside the views directory allows themes to be packaged far easier
than before.

Linking to static assets is slightly different from 1.2. You can
still use the existing ``app/webroot/themed`` and directly link to
those static files. It should be noted that you will need to use
the **full** path to link to assets in ``app/webroot/themed``. If
you want to keep your theme assets inside app/webroot it is
recommended that you rename ``app/webroot/themed`` to
``app/webroot/theme``. This will allow you to leverage the core
helper path finding. As well as keep the performance benefits of
not serving assets through PHP.

To use the new theme webroot create directories like
``theme/<theme_name>/webroot<path_to_file>`` in your theme. The
Dispatcher will handle finding the correct theme assets in your
view paths.

All of CakePHP's built-in helpers are aware of themes and will
create the correct paths automatically. Like view files, if a file
isn't in the theme folder, it'll default to the main webroot
folder.

::

    <?php
    //When in a theme with the name of 'purple_cupcake'
    $this->Html->css('main.css');
     
    //creates a path like
    /theme/purple_cupcake/css/main.css
     
    //and links to
    app/views/themed/purple_cupcake/webroot/css/main.css 

Increasing performance of plugin and theme assets
-------------------------------------------------

Its a well known fact that serving assets through PHP is guaranteed
to be slower than serving those assets without invoking PHP. And
while the core team has taken steps to make plugin and theme asset
serving as fast as possible, there may be situations where more
performance is required. In these situations its recommended that
you either symlink or copy out plugin/theme assets to directories
in ``app/webroot`` with paths matching those used by cakephp.


-  ``app/plugins/debug_kit/webroot/js/my_file.js`` becomes
   ``app/webroot/debug_kit/js/my_file.js``
-  ``app/views/themed/navy/webroot/css/navy.css`` becomes
   ``app/webroot/theme/navy/css/navy.css``
