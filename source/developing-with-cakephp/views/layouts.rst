3.10.2 Layouts
--------------

A layout contains presentation code that wraps around a view.
Anything you want to see in all of your views should be placed in a
layout.

Layout files should be placed in /app/views/layouts. CakePHP's
default layout can be overridden by creating a new default layout
at /app/views/layouts/default.ctp. Once a new default layout has
been created, controller-rendered view code is placed inside of the
default layout when the page is rendered.

When you create a layout, you need to tell CakePHP where to place
the code for your views. To do so, make sure your layout includes a
place for $content\_for\_layout (and optionally,
$title\_for\_layout). Here's an example of what a default layout
might look like:

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title><?php echo $title_for_layout?></title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <!-- Include external files and scripts here (See HTML helper for more info.) -->
    <?php echo $scripts_for_layout ?>
    </head>
    <body>
    
    <!-- If you'd like some sort of menu to 
    show up on all of your views, include it here -->
    <div id="header">
        <div id="menu">...</div>
    </div>
    
    <!-- Here's where I want my views to be displayed -->
    <?php echo $content_for_layout ?>
    
    <!-- Add a footer to each displayed page -->
    <div id="footer">...</div>
    
    </body>
    </html>

``$scripts_for_layout`` contains any external files and scripts
included with the built-in HTML helper. Useful for including
javascript and CSS files from views.

When using ``$html->css()`` or ``$javascript->link()`` in view
files, specify 'false' for the 'in-line' argument to place the html
source in ``$scripts_for_layout``. (See API for more details on
usage).

``$content_for_layout`` contains the view. This is where the view
code will be placed.

``$title_for_layout`` contains the page title.

To set the title for the layout, it's easiest to do so in the
controller, setting the $title\_for\_layout variable.

::

    <?php
    
    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
        }
    }
    ?>

You can create as many layouts as you wish: just place them in the
app/views/layouts directory, and switch between them inside of your
controller actions using the controller's $layout variable, or
setLayout() function.

For example, if a section of my site included a smaller ad banner
space, I might create a new layout with the smaller advertising
space and specify it as the layout for all controller's actions
using something like:

``var $layout = 'default_small_ad';``

::

    <?php
    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
            $this->layout = 'default_small_ad';
        }
    
        function viewImage() {
            $this->layout = 'image';
            //output user image
        }
    }
    ?>

CakePHP features two core layouts (besides CakePHP’s default
layout) you can use in your own application: ‘ajax’ and ‘flash’.
The Ajax layout is handy for crafting Ajax responses - it’s an
empty layout (most ajax calls only require a bit of markup in
return, rather than a fully-rendered interface). The flash layout
is used for messages shown by the controllers flash() method.

Three other layouts xml, js, and rss exist in the core for a quick
and easy way to serve up content that isn’t text/html.

3.10.2 Layouts
--------------

A layout contains presentation code that wraps around a view.
Anything you want to see in all of your views should be placed in a
layout.

Layout files should be placed in /app/views/layouts. CakePHP's
default layout can be overridden by creating a new default layout
at /app/views/layouts/default.ctp. Once a new default layout has
been created, controller-rendered view code is placed inside of the
default layout when the page is rendered.

When you create a layout, you need to tell CakePHP where to place
the code for your views. To do so, make sure your layout includes a
place for $content\_for\_layout (and optionally,
$title\_for\_layout). Here's an example of what a default layout
might look like:

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title><?php echo $title_for_layout?></title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <!-- Include external files and scripts here (See HTML helper for more info.) -->
    <?php echo $scripts_for_layout ?>
    </head>
    <body>
    
    <!-- If you'd like some sort of menu to 
    show up on all of your views, include it here -->
    <div id="header">
        <div id="menu">...</div>
    </div>
    
    <!-- Here's where I want my views to be displayed -->
    <?php echo $content_for_layout ?>
    
    <!-- Add a footer to each displayed page -->
    <div id="footer">...</div>
    
    </body>
    </html>

``$scripts_for_layout`` contains any external files and scripts
included with the built-in HTML helper. Useful for including
javascript and CSS files from views.

When using ``$html->css()`` or ``$javascript->link()`` in view
files, specify 'false' for the 'in-line' argument to place the html
source in ``$scripts_for_layout``. (See API for more details on
usage).

``$content_for_layout`` contains the view. This is where the view
code will be placed.

``$title_for_layout`` contains the page title.

To set the title for the layout, it's easiest to do so in the
controller, setting the $title\_for\_layout variable.

::

    <?php
    
    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
        }
    }
    ?>

You can create as many layouts as you wish: just place them in the
app/views/layouts directory, and switch between them inside of your
controller actions using the controller's $layout variable, or
setLayout() function.

For example, if a section of my site included a smaller ad banner
space, I might create a new layout with the smaller advertising
space and specify it as the layout for all controller's actions
using something like:

``var $layout = 'default_small_ad';``

::

    <?php
    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
            $this->layout = 'default_small_ad';
        }
    
        function viewImage() {
            $this->layout = 'image';
            //output user image
        }
    }
    ?>

CakePHP features two core layouts (besides CakePHP’s default
layout) you can use in your own application: ‘ajax’ and ‘flash’.
The Ajax layout is handy for crafting Ajax responses - it’s an
empty layout (most ajax calls only require a bit of markup in
return, rather than a fully-rendered interface). The flash layout
is used for messages shown by the controllers flash() method.

Three other layouts xml, js, and rss exist in the core for a quick
and easy way to serve up content that isn’t text/html.
