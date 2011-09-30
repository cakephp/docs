Views
#####

Views are the **V** in MVC. Views are responsible for generating
the specific output required for the request. Often this is in the
form of HTML, XML, or JSON, but streaming files and creating PDF's
that users can download are also responsibilities of the View
Layer.

View Templates
==============

The view layer of CakePHP is how you speak to your users. Most of
the time your views will be showing (X)HTML documents to browsers,
but you might also need to serve AMF data to a Flash object, reply
to a remote application via SOAP, or output a CSV file for a user.

By default CakePHP view files are written in plain PHP and have a default
extension of .ctp (CakePHP Template). These files contain all the
presentational logic needed to get the data it received from the
controller in a format that is ready for the audience you’re
serving to. If you'd prefer using a templating language like 
Twig, or Smarty, a subclass of View will bridge your templating
language and CakePHP

View files are stored in ``/app/View/``, in a folder named after the
controller that uses the files, and named after the action it
corresponds to. For example, the view file for the Products
controller's "view()" action, would normally be found in
``/app/View/Products/view.ctp``.

The view layer in CakePHP can be made up of a number of different
parts. Each part has different uses, and will be covered in this
chapter:

- **views**: Views are the part of the page that is unique to the
  action being run. They form the meat of your application's response.
- **elements**: smaller, reusable bits of view code. Elements are
  usually rendered inside of views.
- **layouts**: view files that contain presentational code that is
  found wrapping many interfaces in your application. Most views are
  rendered inside of a layout.
- **helpers**: these classes encapsulate view logic that is needed
  in many places in the view layer. Among other things, helpers in
  CakePHP can help you build forms, build AJAX functionality,
  paginate model data, or serve RSS feeds.

.. _view-layouts:

Layouts
=======

A layout contains presentation code that wraps around a view.
Anything you want to see in all of your views should be placed in a
layout.

Layout files should be placed in ``/app/View/Layouts``. CakePHP's
default layout can be overridden by creating a new default layout
at ``/app/View/Layouts/default.ctp``. Once a new default layout has
been created, controller-rendered view code is placed inside of the
default layout when the page is rendered.

When you create a layout, you need to tell CakePHP where to place
the code for your views. To do so, make sure your layout includes a
place for ``$content_for_layout`` Here's an example of what a default layout
might look like::

   <!DOCTYPE html>
   <html lang="en">
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

.. note::

    When using :php:meth:`HtmlHelper::css()` or :php:meth:`HtmlHelper::script()` 
    in view files, specify 'false' for the 'inline' option to place the html 
    source in ``$scripts_for_layout``. (See API for more details on usage).

``$content_for_layout`` contains the view. This is where the view
code will be placed.

``$title_for_layout`` contains the page title.  This variable is generated automatically,
but you can override it by setting it in your controller/view.

To set the title for the layout, it's easiest to do so in the
controller, setting the ``$title_for_layout`` variable::

   <?php

   class UsersController extends AppController {
       function viewActive() {
           $this->set('title_for_layout', 'View Active Users');
       }
   }
   

You can also set the title_for_layout variable from inside the view file::

    <?php

    $this->set('title_for_layout', $titleContent);

You can create as many layouts as you wish: just place them in the
``app/View/Layouts`` directory, and switch between them inside of your
controller actions using the controller or view's 
:php:attr:`~View::$layout` property::

    <?php
    // from a controller
    function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // from a view file
    $this->layout = 'loggedin';

For example, if a section of my site included a smaller ad banner
space, I might create a new layout with the smaller advertising
space and specify it as the layout for all controllers' actions
using something like::

   <?php
   class UsersController extends AppController {
       public function viewActive() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function viewImage() {
           $this->layout = 'image';
           //output user image
       }
   }

CakePHP features two core layouts (besides CakePHP's default
layout) you can use in your own application: 'ajax' and 'flash'.
The Ajax layout is handy for crafting Ajax responses - it's an
empty layout (most ajax calls only require a bit of markup in
return, rather than a fully-rendered interface). The flash layout
is used for messages shown by :php:meth:`Controller::flash()` method.

Three other layouts, xml, js, and rss, exist in the core for a quick
and easy way to serve up content that isn’t text/html.

.. _view-elements:

Elements
========

Many applications have small blocks of presentation code that need
to be repeated from page to page, sometimes in different places in
the layout. CakePHP can help you repeat parts of your website that
need to be reused. These reusable parts are called Elements. Ads,
help boxes, navigational controls, extra menus, login forms, and
callouts are often implemented in CakePHP as elements. An element
is basically a mini-view that can be included in other views, in
layouts, and even within other elements. Elements can be used to
make a view more readable, placing the rendering of repeating
elements in its own file. They can also help you re-use content
fragments in your application.

Elements live in the ``/app/Views/Elements/`` folder, and have the .ctp
filename extension. They are output using the element method of the
view::

    <?php echo $this->element('helpbox'); ?>

Passing Variables into an Element
---------------------------------

You can pass data to an element through the element's second
argument::

    <?php echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

Inside the element file, all the passed variables are available as
members of the parameter array (in the same way that :php:meth:`Controller::set()` in
the controller works with view files). In the above example, the
``/app/View/Elements/helpbox.ctp`` file can use the ``$helptext``
variable::

    <?php
    // inside app/View/Elements/helpbox.ctp
    echo $helptext; //outputs "Oh, this text is very helpful."

The :php:meth:`View::element()` method also supports options for the element.
The options supported are 'cache', 'callbacks' and 'plugin'. An example::

    <?php echo $this->element('helpbox', array(
                "helptext" => "This is passed to the element as $helptext",
                "foobar" => "This is passed to the element as $foobar",
            ),
            array(
                "cache" => "long_view", // uses the "long_view" cache configuration
                "plugin" => "",  //to render an element from a plugin
                "callbacks" => true // set to true to have before/afterRender called for the element
            )
        );

Element caching is facilitated through the :php:class:`Cache` class.  You can
configure elements to be stored in any Cache configuration you've setup.  This
gives you a great amount of flexibilty to decide where and for how long elements
are stored.  To cache different versions of the same element in an application, 
provide a unique cache key value using the following format::

    <?php
    $this->element('helpbox', array(), array(
            "cache" => array('config'=> 'short', 'key'=>'unique value')
        )
    );

You can take full advantage of elements by using
``requestAction()``. The ``requestAction()`` function fetches view
variables from a controller action and returns them as an array.
This enables your elements to perform in true MVC style. Create a
controller action that prepares the view variables for your
elements, then call ``requestAction()`` inside the second parameter
of ``element()`` to feed the element the view variables from your
controller.

To do this, in your controller add something like the following for
the Post example::

    <?php
    class PostsController extends AppController {
        ...
        function index() {
            $posts = $this->paginate();
            if (isset($this->params['requested'])) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }

And then in the element we can access the paginated posts model. To
get the latest five posts in an ordered list we would do something
like the following::

    <h2>Latest Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Caching Elements
----------------

You can take advantage of CakePHP view caching if you supply a
cache parameter. If set to true, it will cache the element in the 
'default' Cache configuration. Otherwise, you can set which cache configuration 
should be used. See :doc:`/core-libraries/caching` for more information on
configuring :php:class:`Cache`. A simple example of caching an element would be::

    <?php echo $this->element('helpbox', array(), array('cache' => true)); ?>

If you render the same element more than once in a view and have
caching enabled be sure to set the 'key' parameter to a different
name each time. This will prevent each succesive call from
overwriting the previous element() call's cached result. E.g.::

    <?php
    echo $this->element(
        'helpbox', 
        array('var' => $var),
        array('cache' => array('key' => 'first_use', 'config' => 'view_long')
    );
    
    echo $this->element(
        'helpbox', 
        array('var' => $differenVar),
        array('cache' => array('key' => 'second_use', 'config' => 'view_long')
    );

The above will ensure that both element results are cached separately.  If
you want all element caching to use the same cache configuration, you can save
some repetition, by setting :php:attr:`View::$elementCache` to the cache
configuration you want to use.  CakePHP will use this configuration, when none
is given.

Requesting Elements from a Plugin
---------------------------------

If you are using a plugin and wish to use elements from within the
plugin, just specify the plugin parameter. If the view is being
rendered for a plugin controller/action, it will automatically
point to the element for the plugin. If the element doesn't exist
in the plugin, it will look in the main APP folder.::

    <?php echo $this->element('helpbox', array(), array('plugin' => 'pluginname')); ?>

View API
========

.. php:class:: View

View methods are accessible in all view, element and layout files.
To call any view method use ``$this->method()``

.. php:method:: set(string $var, mixed $value)

    Views have a ``set()`` method that is analogous to the ``set()``
    found in Controller objects. Using set() from your view file will
    add the variables to the layout and elements that will be rendered
    later. See :ref:`controller-methods` for more information on using
    set().

    In your view file you can do::

        <?php
        $this->set('activeMenuButton', 'posts');

    Then in your layout the ``$activeMenuButton`` variable will be
    available and contain the value 'posts'.

.. php:method:: getVar(string $var)

    Gets the value of the viewVar with the name $var

.. php:method:: getVars()

    Gets a list of all the available view variables in the current
    rendering scope. Returns an array of variable names.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Renders an element or view partial. See the section on
    :ref:`view-elements` for more information and
    examples.

.. php:method:: uuid(string $object, mixed $url)

    Generates a unique non-random DOM ID for an object, based on the
    object type and url. This method is often used by helpers that need
    to generate unique DOM ID's for elements such as the :php:class:`JsHelper`::

        <?php
        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Adds content to the internal scripts buffer. This buffer is made
    available in the layout as ``$scripts_for_layout``. This method is
    helpful when creating helpers that need to add javascript or css
    directly to the layout. Keep in mind that scripts added from the
    layout, or elements in the layout will not be added to
    ``$scripts_for_layout``. This method is most often used from inside
    helpers, like the :doc:`/core-libraries/helpers/js` and
    :doc:`/core-libraries/helpers/html` Helpers.

.. php:attr:: layout

    Set the layout the current view will be wrapped in.

.. php:attr:: elementCache

    The cache configuration used to cache elements. Setting this
    property will change the default configuration used to cache elements.
    This default can be overridden using the 'cache' option in the element
    method.

.. php:attr:: request

    An instance of :php:class:`CakeRequest`.  Use this instance to access
    information about the current request.

.. php:attr:: output

    Contains the last rendered content from a view, either the view file, or the
    layout content.

More about Views
================

.. toctree::

    views/themes
    views/media-view
    views/helpers
