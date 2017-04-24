Views
#####

Views are the **V** in MVC. Views are responsible for generating
the specific output required for the request. Often this is in the
form of HTML, XML, or JSON, but streaming files and creating PDF's
that users can download are also responsibilities of the View
Layer.

CakePHP comes with a few built-in View classes for handling the most
common rendering scenarios:

- To create XML or JSON webservices you can use the :doc:`views/json-and-xml-views`.
- To serve protected files, or dynamically generated files, you can use
  :ref:`cake-response-file`.
- To create multiple themed views, you can use :doc:`views/themes`.

View Templates
==============

The view layer of CakePHP is how you speak to your users. Most of
the time your views will be showing (X)HTML documents to browsers,
but you might also need to serve AMF data to a Flash object, reply
to a remote application via SOAP, or output a CSV file for a user.

By default CakePHP view files are written in plain PHP and have a default
extension of .ctp (CakePHP Template). These files contain all the
presentational logic needed to get the data it received from the
controller in a format that is ready for the audience you're
serving to. If you'd prefer using a templating language like
Twig, or Smarty, a subclass of View will bridge your templating
language and CakePHP.

A view file is stored in ``/app/View/``, in a subfolder named after the
controller that uses the file. It has a filename corresponding to its action.
For example, the view file for the Products
controller's "view()" action would normally be found in
``/app/View/Products/view.ctp``.

The view layer in CakePHP can be made up of a number of different
parts. Each part has different uses, and will be covered in this
chapter:

- **views**: Views are the part of the page that is unique to the
  action being run. They form the meat of your application's response.
- **elements**: smaller, reusable bits of view code. Elements are
  usually rendered inside views.
- **layouts**: view files that contain presentational code that
  wraps many interfaces in your application. Most views are
  rendered inside a layout.
- **helpers**: these classes encapsulate view logic that is needed
  in many places in the view layer. Among other things, helpers in
  CakePHP can help you build forms, build AJAX functionality,
  paginate model data, or serve RSS feeds.


.. _extending-views:

Extending Views
---------------

.. versionadded:: 2.1

View extending allows you to wrap one view in another. Combining this with
:ref:`view blocks <view-blocks>` gives you a powerful way to keep your views
:term:`DRY`. For example, your application has a sidebar that needs to change depending
on the specific view being rendered. By extending a common view file, you can
avoid repeating the common markup for your sidebar, and only define the parts
that change:

.. code-block:: php

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

The above view file could be used as a parent view. It expects that the view
extending it will define the ``sidebar`` and ``title`` blocks. The ``content``
block is a special block that CakePHP creates. It will contain all the
uncaptured content from the extending view. Assuming our view file has a
``$post`` variable with the data about our post, the view could look like:

.. code-block:: php

    <?php
    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    // The remaining content will be available as the 'content' block
    // in the parent view.
    <?php echo h($post['Post']['body']);

The post view above shows how you can extend a view, and populate a set of
blocks. Any content not already in a defined block will be captured and put
into a special block named ``content``. When a view contains a call to
``extend()``, execution continues to the bottom of the current view file.
Once it is complete, the extended view will be rendered. Calling ``extend()``
more than once in a view file will override the parent view that will be
processed next::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

The above will result in ``/Common/index.ctp`` being rendered as the parent view
to the current view.

You can nest extended views as many times as necessary. Each view can extend
another view if desired. Each parent view will get the previous view's content
as the ``content`` block.

.. note::

    You should avoid using ``content`` as a block name in your application.
    CakePHP uses this for uncaptured content in extended views.


.. _view-blocks:

Using view blocks
=================

.. versionadded:: 2.1

View blocks replace ``$scripts_for_layout`` and provide a flexible API that
allows you to define slots or blocks in your views/layouts that will be defined
elsewhere. For example, blocks are ideal for implementing things such as
sidebars, or regions to load assets at the bottom/top of the layout.
Blocks can be defined in two ways: either as a capturing block, or by direct
assignment. The ``start()``, ``append()`` and ``end()`` methods allow you to
work with capturing blocks::

    // create the sidebar block.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Append into the sidebar later on.
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

You can also append into a block using ``start()`` multiple times. ``assign()``
can be used to clear or overwrite a block at any time::

    // Clear the previous content from the sidebar block.
    $this->assign('sidebar', '');


In 2.3, a few new methods were added for working with blocks. The ``prepend()``
method was added to prepend content to an existing block::

    // Prepend to sidebar
    $this->prepend('sidebar', 'this content goes on top of sidebar');

The method ``startIfEmpty()`` can be used to start a block **only** if it is empty
or undefined. If the block already exists, the captured content will be
discarded. This is useful when you want to conditionally define default content for
a block if it does not already exist:

.. code-block:: php

    // In a view file.
    // Create a navbar block
    $this->startIfEmpty('navbar');
    echo $this->element('navbar');
    echo $this->element('notifications');
    $this->end();

.. code-block:: php

    // In a parent view/layout
    <?php $this->startIfEmpty('navbar'); ?>
    <p>If the block is not defined by now - show this instead</p>
    <?php $this->end(); ?>

    // Somewhere later in the parent view/layout
    echo $this->fetch('navbar');

In the above example, the ``navbar`` block will only contain the content added
in the first section. Since the block was defined in the child view, the
default content with the ``<p>`` tag will be discarded.

.. versionadded: 2.3
    ``startIfEmpty()`` and ``prepend()`` were added in 2.3

.. note::

    You should avoid using ``content`` as a block name. This is used by CakePHP
    internally for extended views, and view content in the layout.


Displaying blocks
-----------------

.. versionadded:: 2.1

You can display blocks using the ``fetch()`` method. ``fetch()`` will safely
output a block, returning '' if a block does not exist::

    echo $this->fetch('sidebar');

You can also use fetch to conditionally show content that should surround a
block should it exist. This is helpful in layouts, or extended views where you
want to conditionally show headings or other markup:

.. code-block:: php

    // in app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

As of 2.3.0, you can also provide a default value for a block should it not have
any content. This allows you to easily add placeholder content for empty
states. You can provide a default value using the second argument:

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?php echo $this->fetch('cart', 'Your cart is empty'); ?>
    </div>

.. versionchanged:: 2.3
    The ``$default`` argument was added in 2.3.

Using blocks for script and CSS files
-------------------------------------

.. versionadded:: 2.1

Blocks replace the deprecated ``$scripts_for_layout`` layout variable. Instead
you should use blocks. The :php:class:`HtmlHelper` ties into view blocks, and its
:php:meth:`~HtmlHelper::script()`, :php:meth:`~HtmlHelper::css()`, and
:php:meth:`~HtmlHelper::meta()` methods each update a block with the same name
when used with the ``inline = false`` option:

.. code-block:: php

    <?php
    // in your view file
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', array('inline' => false));
    ?>

    // In your layout file.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // rest of the layout follows

The :php:meth:`HtmlHelper` also allows you to control which block the scripts
and CSS go to::

    // in your view
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // in your layout
    echo $this->fetch('scriptBottom');

.. _view-layouts:

Layouts
=======

A layout contains presentation code that wraps around a view.
Anything you want to see in all of your views should be placed in a
layout.

CakePHP's default layout is located at ``/app/View/Layouts/default.ctp``.
If you want to change the overall look of your application, then this is
the right place to start, because controller-rendered view code is placed
inside of the default layout when the page is rendered.

Other layout files should be placed in ``/app/View/Layouts``.
When you create a layout, you need to tell CakePHP where to place
the output of your views. To do so, make sure your layout includes a
place for ``$this->fetch('content')`` Here's an example of what a default layout
might look like:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $this->fetch('title'); ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Include external files and scripts here (See HTML helper for more info.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- If you'd like some sort of menu to
   show up on all of your views, include it here -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Here's where I want my views to be displayed -->
   <?php echo $this->fetch('content'); ?>

   <!-- Add a footer to each displayed page -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    Prior to version 2.1, method fetch() was not available, ``fetch('content')``
    is a replacement for ``$content_for_layout`` and lines ``fetch('meta')``,
    ``fetch('css')`` and ``fetch('script')`` are contained in the ``$scripts_for_layout``
    variable in version 2.0

The ``script``, ``css`` and ``meta`` blocks contain any content defined
in the views using the built-in HTML helper. Useful for including
JavaScript and CSS files from views.

.. note::

    When using :php:meth:`HtmlHelper::css()` or :php:meth:`HtmlHelper::script()`
    in view files, specify 'false' for the 'inline' option to place the HTML
    source in a block with the same name. (See API for more details on usage).

The ``content`` block contains the contents of the rendered view.

``$title_for_layout`` contains the page title. This variable is generated automatically,
but you can override it by setting it in your controller/view.

.. note::

    The ``$title_for_layout`` is deprecated as of 2.5, use ``$this->fetch('title')``
    in your layout and ``$this->assign('title', 'page title')`` instead.

Setting the title for the layout is easiest to do in the
controller, setting the ``$title_for_layout`` variable::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
       }
   }

You can also set the title_for_layout variable from inside the view file::

    $this->set('title_for_layout', $titleContent);

You can create as many layouts as you wish: just place them in the
``app/View/Layouts`` directory, and switch between them inside of your
controller actions using the controller or view's
:php:attr:`~View::$layout` property::

    // from a controller
    public function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // from a view file
    $this->layout = 'loggedin';

For example, if a section of my site included a smaller ad banner
space, I might create a new layout with the smaller advertising
space and specify it as the layout for all controllers' actions
using something like::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //output user image
       }
   }

CakePHP features two core layouts (besides CakePHP's default
layout) you can use in your own application: 'ajax' and 'flash'.
The Ajax layout is handy for crafting AJAX responses - it's an
empty layout. (Most AJAX calls only require a bit of markup in
return, rather than a fully-rendered interface.) The flash layout
is used for messages shown by :php:meth:`Controller::flash()` method.

Three other layouts, xml, js, and rss, exist in the core for a quick
and easy way to serve up content that isn't text/html.

Using layouts from plugins
--------------------------

.. versionadded:: 2.1

If you want to use a layout that exists in a plugin, you can use
:term:`plugin syntax`. For example, to use the contact layout from the
Contacts plugin::

    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }


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

Elements live in the ``/app/View/Elements/`` folder, and have the .ctp
filename extension. They are output using the element method of the
view::

    echo $this->element('helpbox');

Passing Variables into an Element
---------------------------------

You can pass data to an element through the element's second
argument::

    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

Inside the element file, all the passed variables are available as
members of the parameter array (in the same way that :php:meth:`Controller::set()` in
the controller works with view files). In the above example, the
``/app/View/Elements/helpbox.ctp`` file can use the ``$helptext``
variable::

    // inside app/View/Elements/helpbox.ctp
    echo $helptext; //outputs "Oh, this text is very helpful."

The :php:meth:`View::element()` method also supports options for the element.
The options supported are 'cache' and 'callbacks'. An example::

    echo $this->element('helpbox', array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ),
        array(
            // uses the "long_view" cache configuration
            "cache" => "long_view",
            // set to true to have before/afterRender called for the element
            "callbacks" => true
        )
    );

Element caching is facilitated through the :php:class:`Cache` class. You can
configure elements to be stored in any Cache configuration you've set up. This
gives you a great amount of flexibility to decide where and for how long elements
are stored. To cache different versions of the same element in an application,
provide a unique cache key value using the following format::

    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

You can take full advantage of elements by using
``requestAction()``, which fetches view
variables from a controller action and returns them as an array.
This enables your elements to perform in true MVC style. Create a
controller action that prepares the view variables for your
elements, then call ``requestAction()`` inside the second parameter
of ``element()`` to feed the element the view variables from your
controller.

To do this, in your controller add something like the following for
the Post example::

    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }

And then in the element we can access the paginated posts model. To
get the latest five posts in an ordered list, we would do something
like the following:

.. code-block:: php

    <h2>Latest Posts</h2>
    <?php
      $posts = $this->requestAction(
        'posts/index/sort:created/direction:asc/limit:5'
      );
    ?>
    <ol>
    <?php foreach ($posts as $post): ?>
          <li><?php echo $post['Post']['title']; ?></li>
    <?php endforeach; ?>
    </ol>

Caching Elements
----------------

You can take advantage of CakePHP view caching if you supply a
cache parameter. If set to true, it will cache the element in the
'default' Cache configuration. Otherwise, you can set which cache configuration
should be used. See :doc:`/core-libraries/caching` for more information on
configuring :php:class:`Cache`. A simple example of caching an element would be::

    echo $this->element('helpbox', array(), array('cache' => true));

If you render the same element more than once in a view and have
caching enabled, be sure to set the 'key' parameter to a different
name each time. This will prevent each successive call from
overwriting the previous element() call's cached result. For example::

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

The above will ensure that both element results are cached separately. If
you want all element caching to use the same cache configuration, you can avoid
some repetition by setting :php:attr:`View::$elementCache` to the cache
configuration you want to use. CakePHP will use this configuration when none
is given.

Requesting Elements from a Plugin
---------------------------------

2.0
---

To load an element from a plugin, use the `plugin` option (moved out of the `data` option in 1.x)::

    echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

If you are using a plugin and wish to use elements from within the
plugin, just use the familiar :term:`plugin syntax`. If the view is being
rendered for a plugin controller/action, the plugin name will automatically
be prefixed onto all elements used, unless another plugin name is present.
If the element doesn't exist in the plugin, it will look in the main APP folder.::

    echo $this->element('Contacts.helpbox');

If your view is a part of a plugin, you can omit the plugin name. For example,
if you are in the ``ContactsController`` of the Contacts plugin, the following::

    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

are equivalent and will result in the same element being rendered.

.. versionchanged:: 2.1
    The ``$options[plugin]`` option was deprecated and support for
    ``Plugin.element`` was added.


Creating your own view classes
==============================

You may need to create custom view classes to enable new types of data views, or
add additional custom view-rendering logic to your application. Like most
components of CakePHP, view classes have a few conventions:

* View class files should be put in ``App/View``. For example:
  ``App/View/PdfView.php``
* View classes should be suffixed with ``View``. For example: ``PdfView``.
* When referencing view class names you should omit the ``View`` suffix. For
  example: ``$this->viewClass = 'Pdf';``.

You'll also want to extend ``View`` to ensure things work correctly::

    // in App/View/PdfView.php

    App::uses('View', 'View');
    class PdfView extends View {
        public function render($view = null, $layout = null) {
            // custom logic here.
        }
    }

Replacing the render method lets you take full control over how your content is
rendered.

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

        $this->set('activeMenuButton', 'posts');

    Then, in your layout, the ``$activeMenuButton`` variable will be
    available and contain the value 'posts'.

.. php:method:: get(string $var, $default = null)

    Get the value of a viewVar with the name ``$var``.

    As of 2.5, you can provide a default value in case the variable is not
    already set.

    .. versionchanged:: 2.5
        The ``$default`` argument was added in 2.5.

.. php:method:: getVar(string $var)

    Gets the value of the viewVar with the name ``$var``.

    .. deprecated:: 2.3
        Use :php:meth:`View::get()` instead.

.. php:method:: getVars()

    Gets a list of all the available view variables in the current
    rendering scope. Returns an array of variable names.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Renders an element or view partial. See the section on
    :ref:`view-elements` for more information and
    examples.

.. php:method:: uuid(string $object, mixed $url)

    Generates a unique non-random DOM ID for an object, based on the
    object type and URL. This method is often used by helpers that need
    to generate unique DOM ID's for elements such as the :php:class:`JsHelper`::

        $uuid = $this->uuid(
          'form',
          array('controller' => 'posts', 'action' => 'index')
        );
        //$uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Adds content to the internal scripts buffer. This buffer is made
    available in the layout as ``$scripts_for_layout``. This method is
    helpful when creating helpers that need to add javascript or css
    directly to the layout. Keep in mind that scripts added from the
    layout and elements in the layout will not be added to
    ``$scripts_for_layout``. This method is most often used from inside
    helpers, such as the :doc:`/core-libraries/helpers/js` and
    :doc:`/core-libraries/helpers/html` Helpers.

    .. deprecated:: 2.1
        Use the :ref:`view-blocks` features instead.

.. php:method:: blocks

    Get the names of all defined blocks as an array.

.. php:method:: start($name)

    Start a capturing block for a view block. See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: end

    End the top most open capturing block. See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Append into the block with ``$name``. See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: prepend($name, $content)

    Prepend to the block with ``$name``. See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.3

.. php:method:: startIfEmpty($name)

    Start a block if it is empty. All content in the block
    will be captured and discarded if the block is already defined.

    .. versionadded:: 2.3

.. php:method:: assign($name, $content)

    Assign the value of a block. This will overwrite any existing content. See
    the section on :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: fetch($name, $default = '')

    Fetch the value of a block. If a block is empty or undefined, '' will be returned.
    See the section on :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Extend the current view/element/layout with the named one. See the section
    on :ref:`extending-views` for examples.

    .. versionadded:: 2.1

.. php:attr:: layout

    Set the layout the current view will be wrapped in.

.. php:attr:: elementCache

    The cache configuration used to cache elements. Setting this
    property will change the default configuration used to cache elements.
    This default can be overridden using the 'cache' option in the element
    method.

.. php:attr:: request

    An instance of :php:class:`CakeRequest`. Use this instance to access
    information about the current request.

.. php:attr:: output

    Contains the last rendered content from a view, either the view file, or the
    layout content.

    .. deprecated:: 2.1
        Use ``$view->Blocks->get('content');`` instead.

.. php:attr:: Blocks

    An instance of :php:class:`ViewBlock`. Used to provide view block
    functionality in view rendering.

    .. versionadded:: 2.1

More about Views
================

.. toctree::
    :maxdepth: 1

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=en: Views
    :keywords lang=en: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
