Views
#####

.. php:namespace:: Cake\View

.. php:class:: View

Views are the **V** in MVC. Views are responsible for generating the specific
output required for the request. Often this is in the form of HTML, XML, or
JSON, but streaming files and creating PDF's that users can download are also
responsibilities of the View Layer.

CakePHP comes with a few built-in View classes for handling the most common
rendering scenarios:

- To create XML or JSON webservices you can use the :doc:`views/json-and-xml-views`.
- To serve protected files, or dynamically generated files, you can use
  :ref:`cake-response-file`.
- To create multiple themed views, you can use :doc:`views/themes`.

.. _app-view:

The App View
============

``AppView`` is your application’s default View class. ``AppView`` itself extends
the ``Cake\View\View`` class included in CakePHP and is defined in
**src/View/AppView.php** as follows:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }

You can use your ``AppView`` to load helpers that will be used for every view
rendered in your application. CakePHP provides an ``initialize()`` method that
is invoked at the end of a View’s constructor for this kind of use:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {

        public function initialize()
        {
            // Always enable the MyUtils Helper
            $this->loadHelper('MyUtils');
        }

    }

.. _view-templates:

View Templates
==============

The view layer of CakePHP is how you speak to your users. Most of the time your
views will be rendering HTML/XHTML documents to browsers, but you might also
need to reply to a remote application via JSON, or output a CSV file for a user.

CakePHP template files have a default extension of **.ctp** (CakePHP Template)
and utilize the `alternative PHP syntax
<http://php.net/manual/en/control-structures.alternative-syntax.php>`_
for control structures and output. These files contain the logic necessary to
prepare the data received from the controller into a presentation format that is
ready for your audience.

Alternative Echos
-----------------

Echo, or print a variable in your template::

  <?php echo $variable; ?>

Using Short Tag support::

  <?= $variable ?>

Alternative Control Structures
------------------------------

Control structures, like ``if``, ``for``, ``foreach``, ``switch``, and ``while``
can be written in a simplified format. Notice that there are no braces. Instead,
the end brace for the ``foreach`` is replaced with ``endforeach``. Each of the
control structures listed below has a similar closing syntax: ``endif``,
``endfor``, ``endforeach``, and ``endwhile``. Also notice that instead of using
a ``semicolon`` after each structure (except the last one), there is a
``colon``.

The following is an example using ``foreach``:

.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

Another example, using if/elseif/else. Notice the colons:

.. code-block:: php

  <?php if ($username === 'sally'): ?>
     <h3>Hi Sally</h3>
  <?php elseif ($username === 'joe'): ?>
     <h3>Hi Joe</h3>
  <?php else: ?>
     <h3>Hi unknown user</h3>
  <?php endif; ?>

If you'd prefer using a templating language like
`Twig <http://twig.sensiolabs.org>`_, a subclass of View will bridge your
templating language and CakePHP.

Template files are stored in **src/Template/**, in a folder named after the
controller that uses the files, and named after the action it corresponds to.
For example, the view file for the Products controller's "view()" action, would
normally be found in **src/Template/Products/view.ctp**.

The view layer in CakePHP can be made up of a number of different parts. Each
part has different uses, and will be covered in this chapter:

- **views**: Templates are the part of the page that is unique to the action
  being run. They form the meat of your application's response.
- **elements**: small, reusable bits of view code. Elements are usually rendered
  inside views.
- **layouts**: template files that contain presentational code that wraps many
  interfaces in your application. Most views are rendered inside a layout.
- **helpers**: these classes encapsulate view logic that is needed in many
  places in the view layer. Among other things, helpers in CakePHP can help you
  build forms, build AJAX functionality, paginate model data, or serve RSS
  feeds.
- **cells**: these classes provide miniature controller-like features for
  creating self contained UI components. See the :doc:`/views/cells`
  documentation for more information.

View Variables
--------------

Any variables you set in your controller with ``set()`` will be available in
both the view and the layout your action renders. In addition, any set variables
will also be available in any element. If you need to pass additional variables
from the view to the layout you can either call ``set()`` in the view template,
or use a :ref:`view-blocks`.

You should remember to **always** escape any user data before outputting it as
CakePHP does not automatically escape output. You can escape user content with
the ``h()`` function::

    <?= h($user->bio); ?>

Setting View Variables
----------------------

.. php:method:: set(string $var, mixed $value)

Views have a ``set()`` method that is analogous to the ``set()`` found in
Controller objects. Using set() from your view file will add the variables to
the layout and elements that will be rendered later. See
:ref:`setting-view_variables` for more information on using ``set()``.

In your view file you can do::

    $this->set('activeMenuButton', 'posts');

Then, in your layout, the ``$activeMenuButton`` variable will be available and
contain the value 'posts'.

.. _extending-views:

Extending Views
---------------

View extending allows you to wrap one view in another. Combining this with
:ref:`view blocks <view-blocks>` gives you a powerful way to keep your views
:term:`DRY`. For example, your application has a sidebar that needs to change
depending on the specific view being rendered. By extending a common view file,
you can avoid repeating the common markup for your sidebar, and only define the
parts that change:

.. code-block:: php

    <!-- src/Template/Common/view.ctp -->
    <h1><?= $this->fetch('title') ?></h1>
    <?= $this->fetch('content') ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?= $this->fetch('sidebar') ?>
        </ul>
    </div>

The above view file could be used as a parent view. It expects that the view
extending it will define the ``sidebar`` and ``title`` blocks. The ``content``
block is a special block that CakePHP creates. It will contain all the
uncaptured content from the extending view. Assuming our view file has a
``$post`` variable with the data about our post, the view could look like:

.. code-block:: php

    <!-- src/Template/Posts/view.ctp -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', [
        'action' => 'edit',
        $post->id
    ]); 
    ?>
    </li>
    <?php $this->end(); ?>

    // The remaining content will be available as the 'content' block
    // In the parent view.
    <?= h($post->body) ?>

The post view above shows how you can extend a view, and populate a set of
blocks. Any content not already in a defined block will be captured and put into
a special block named ``content``. When a view contains a call to ``extend()``,
execution continues to the bottom of the current view file. Once it is complete,
the extended view will be rendered. Calling ``extend()`` more than once in a
view file will override the parent view that will be processed next::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

The above will result in **/Common/index.ctp** being rendered as the parent view
to the current view.

You can nest extended views as many times as necessary. Each view can extend
another view if desired. Each parent view will get the previous view's content
as the ``content`` block.

.. note::

    You should avoid using ``content`` as a block name in your application.
    CakePHP uses this for uncaptured content in extended views.


You can get the list of all populated blocks using the ``blocks()`` method::

    $list = $this->blocks();

.. _view-blocks:

Using View Blocks
=================

View blocks provide a flexible API that allows you to define slots or blocks in
your views/layouts that will be defined elsewhere. For example, blocks are ideal
for implementing things such as sidebars, or regions to load assets at the
bottom/top of the layout. Blocks can be defined in two ways: either as a
capturing block, or by direct assignment. The ``start()``, ``append()``,
``prepend()``, ``assign()``, ``fetch()``, and ``end()`` methods allow you to
work with capturing blocks::

    // Create the sidebar block.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();

    // Append into the sidebar later on.
    $this->start('sidebar');
    echo $this->fetch('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

You can also append into a block using ``append()``::

    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

    // The same as the above.
    $this->append('sidebar', $this->element('sidebar/popular_topics'));

If you need to clear or overwrite a block there are a couple of alternatives.
The ``reset()`` method will clear or overwrite a block at any time. The
``assign()`` method with an empty content string can also be used to clear the
specified block.::

    // Clear the previous content from the sidebar block.
    $this->reset('sidebar');

    // Assigning an empty string will also clear the sidebar block.
    $this->assign('sidebar', '');

.. versionadded:: 3.2
    View::reset() was added in 3.2

Assigning a block's content is often useful when you want to convert a view
variable into a block. For example, you may want to use a block for the page
title, and sometimes assign the title as a view variable in the controller::

    // In view file or layout above $this->fetch('title')
    $this->assign('title', $title);

The ``prepend()`` method allows you to prepend content to an existing block::

    // Prepend to sidebar
    $this->prepend('sidebar', 'this content goes on top of sidebar');


Displaying Blocks
-----------------

You can display blocks using the ``fetch()`` method. ``fetch()`` will output a
block, returning '' if a block does not exist::

    <?= $this->fetch('sidebar') ?>

You can also use fetch to conditionally show content that should surround a
block should it exist. This is helpful in layouts, or extended views where you
want to conditionally show headings or other markup:

.. code-block:: php

    // In src/Template/Layout/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?= $this->fetch('menu') ?>
    </div>
    <?php endif; ?>

You can also provide a default value for a block if it does not exist.
This allows you to add placeholder content when a block does not exist.
You can provide a default value using the second argument:

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?= $this->fetch('cart', 'Your cart is empty') ?>
    </div>


Using Blocks for Script and CSS Files
-------------------------------------

The ``HtmlHelper`` ties into view blocks, and its ``script()``, ``css()``, and
``meta()`` methods each update a block with the same name when used with the
``block = true`` option:

.. code-block:: php

    <?php
    // In your view file
    $this->Html->script('carousel', ['block' => true]);
    $this->Html->css('carousel', ['block' => true]);
    ?>

    // In your layout file.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?= $this->fetch('title') ?></title>
        <?= $this->fetch('script') ?>
        <?= $this->fetch('css') ?>
        </head>
        // Rest of the layout follows

The :php:meth:`Cake\\View\\Helper\\HtmlHelper` also allows you to control which
block the scripts and CSS go to::

    // In your view
    $this->Html->script('carousel', ['block' => 'scriptBottom']);

    // In your layout
    <?= $this->fetch('scriptBottom') ?>

.. _view-layouts:

Layouts
=======

A layout contains presentation code that wraps around a view. Anything you want
to see in all of your views should be placed in a layout.

CakePHP's default layout is located at **src/Template/Layout/default.ctp**.
If you want to change the overall look of your application, then this is the
right place to start, because controller-rendered view code is placed inside of
the default layout when the page is rendered.

Other layout files should be placed in **src/Template/Layout**. When you create
a layout, you need to tell CakePHP where to place the output of your views. To
do so, make sure your layout includes a place for ``$this->fetch('content')``
Here's an example of what a default layout might look like:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?= h($this->fetch('title')) ?></title>
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
   <?= $this->fetch('content') ?>

   <!-- Add a footer to each displayed page -->
   <div id="footer">...</div>

   </body>
   </html>

The ``script``, ``css`` and ``meta`` blocks contain any content defined in the
views using the built-in HTML helper. Useful for including JavaScript and CSS
files from views.

.. note::

    When using ``HtmlHelper::css()`` or ``HtmlHelper::script()`` in template
    files, specify ``'block' => true`` to place the HTML source in a block with
    the same name. (See API for more details on usage).

The ``content`` block contains the contents of the rendered view.

You can set the ``title`` block content from inside your view file::

    $this->assign('title', 'View Active Users');

You can create as many layouts as you wish: just place them in the
**src/Template/Layout** directory, and switch between them inside of your
controller actions using the controller or view's ``$layout`` property::

    // From a controller
    public function view()
    {
        // Set the layout.
        $this->viewBuilder()->setLayout('admin');

        // Before 3.4
        $this->viewBuilder()->layout('admin');

        // Before 3.1
        $this->layout = 'admin';
    }

    // From a view file
    $this->layout = 'loggedin';

For example, if a section of my site included a smaller ad banner space, I might
create a new layout with the smaller advertising space and specify it as the
layout for all controllers' actions using something like::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function viewActive()
        {
            $this->set('title', 'View Active Users');
            $this->viewBuilder()->setLayout('default_small_ad');

            // or the following before 3.4
            $this->viewBuilder()->layout('default_small_ad');

            // or the following before 3.1
            $this->layout = 'default_small_ad';
        }

        public function viewImage()
        {
            $this->viewBuilder()->setLayout('image');

            // Output user image
        }
    }

Besides a default layout CakePHP's official skeleton app also has an 'ajax'
layout. The Ajax layout is handy for crafting AJAX responses - it's an empty
layout. (Most AJAX calls only require a bit of markup in return, rather than a
fully-rendered interface.)

The skeleton app also has a default layout to help generate RSS.

Using Layouts from Plugins
--------------------------

If you want to use a layout that exists in a plugin, you can use :term:`plugin
syntax`. For example, to use the contact layout from the Contacts plugin::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function view_active()
        {
            $this->viewBuilder()->layout('Contacts.contact');
            // or the following before 3.1
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

Elements
========

.. php:method:: element(string $elementPath, array $data, array $options = [])

Many applications have small blocks of presentation code that need to be
repeated from page to page, sometimes in different places in the layout. CakePHP
can help you repeat parts of your website that need to be reused. These reusable
parts are called Elements. Ads, help boxes, navigational controls, extra menus,
login forms, and callouts are often implemented in CakePHP as elements. An
element is basically a mini-view that can be included in other views, in
layouts, and even within other elements. Elements can be used to make a view
more readable, placing the rendering of repeating elements in its own file. They
can also help you re-use content fragments in your application.

Elements live in the **src/Template/Element/** folder, and have the .ctp
filename extension. They are output using the element method of the view::

    echo $this->element('helpbox');

Passing Variables into an Element
---------------------------------

You can pass data to an element through the element's second argument::

    echo $this->element('helpbox', [
        "helptext" => "Oh, this text is very helpful."
    ]);

Inside the element file, all the passed variables are available as members of
the parameter array (in the same way that ``Controller::set()`` in the
controller works with template files). In the above example, the
**src/Template/Element/helpbox.ctp** file can use the ``$helptext`` variable::

    // Inside src/Template/Element/helpbox.ctp
    echo $helptext; // Outputs "Oh, this text is very helpful."

The ``View::element()`` method also supports options for the element.
The options supported are 'cache' and 'callbacks'. An example::

    echo $this->element('helpbox', [
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ],
        [
            // uses the "long_view" cache configuration
            "cache" => "long_view",
            // set to true to have before/afterRender called for the element
            "callbacks" => true
        ]
    );

Element caching is facilitated through the ``Cache`` class. You can configure
elements to be stored in any Cache configuration you've set up. This gives you a
great amount of flexibility to decide where and for how long elements are
stored. To cache different versions of the same element in an application,
provide a unique cache key value using the following format::

    $this->element('helpbox', [], [
            "cache" => ['config' => 'short', 'key' => 'unique value']
        ]
    );

If you need more logic in your element, such as dynamic data from a datasource,
consider using a View Cell instead of an element. Find out more :doc:`about View
Cells </views/cells>`.

Caching Elements
----------------

You can take advantage of CakePHP view caching if you supply a cache parameter.
If set to ``true``, it will cache the element in the 'default' Cache
configuration. Otherwise, you can set which cache configuration should be used.
See :doc:`/core-libraries/caching` for more information on configuring
``Cache``. A simple example of caching an element would be::

    echo $this->element('helpbox', [], ['cache' => true]);

If you render the same element more than once in a view and have caching
enabled, be sure to set the 'key' parameter to a different name each time. This
will prevent each successive call from overwriting the previous element() call's
cached result. For example::

    echo $this->element(
        'helpbox',
        ['var' => $var],
        ['cache' => ['key' => 'first_use', 'config' => 'view_long']]
    );

    echo $this->element(
        'helpbox',
        ['var' => $differenVar],
        ['cache' => ['key' => 'second_use', 'config' => 'view_long']]
    );

The above will ensure that both element results are cached separately. If you
want all element caching to use the same cache configuration, you can avoid some
repetition by setting ``View::$elementCache`` to the cache configuration you
want to use. CakePHP will use this configuration when none is given.

Requesting Elements from a Plugin
---------------------------------

If you are using a plugin and wish to use elements from within the plugin, just
use the familiar :term:`plugin syntax`. If the view is being rendered for a
plugin controller/action, the plugin name will automatically be prefixed onto
all elements used, unless another plugin name is present.
If the element doesn't exist in the plugin, it will look in the main APP
folder::

    echo $this->element('Contacts.helpbox');

If your view is a part of a plugin, you can omit the plugin name. For example,
if you are in the ``ContactsController`` of the Contacts plugin, the following::

    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

are equivalent and will result in the same element being rendered.

For elements inside subfolder of a plugin
(e.g., **plugins/Contacts/Template/Element/sidebar/helpbox.ctp**), use the
following::

    echo $this->element('Contacts.sidebar/helpbox');


Requesting Elements from the App
--------------------------------

If you are within a plugin's template file and want to render
an element residing in your main application rather than this
or another plugin, use the following::

  echo $this->element('some_global_element', [], ['plugin' => false]);
  // or...
  echo $this->element('some_global_element', ['localVar' => $someData], ['plugin' => false]);


Routing prefix and Elements
---------------------------

.. versionadded:: 3.0.1

If you have a Routing prefix configured, the Element path resolution can switch
to a prefix location, as Layouts and action View do.
Assuming you have a prefix "Admin" configured and you call::

    echo $this->element('my_element');

The element first be looked for in **src/Template/Admin/Element/**. If such a
file does not exist, it will be looked for in the default location.

Caching Sections of Your View
-----------------------------

.. php:method:: cache(callable $block, array $options = [])

Sometimes generating a section of your view output can be expensive because of
rendered :doc:`/views/cells` or expensive helper operations. To help make your
application run faster CakePHP provides a way to cache view sections::

    // Assuming some local variables
    echo $this->cache(function () use ($user, $article) {
        echo $this->cell('UserProfile', [$user]);
        echo $this->cell('ArticleFull', [$article]);
    }, ['key' => 'my_view_key']);

By default cached view content will go into the ``View::$elementCache`` cache
config, but you can use the ``config`` option to change this.

.. _view-events:

View Events
===========

Like Controller, view trigger several events/callbacks that you can use to
insert logic around the rendering life-cycle:

Event List
----------

* ``View.beforeRender``
* ``View.beforeRenderFile``
* ``View.afterRenderFile``
* ``View.afterRender``
* ``View.beforeLayout``
* ``View.afterLayout``

You can attach application :doc:`event listeners </core-libraries/events>` to
these events or use :ref:`Helper Callbacks <helper-api>`.

Creating Your Own View Classes
==============================

You may need to create custom view classes to enable new types of data views, or
add additional custom view-rendering logic to your application. Like most
components of CakePHP, view classes have a few conventions:

* View class files should be put in **src/View**. For example:
  **src/View/PdfView.php**
* View classes should be suffixed with ``View``. For example: ``PdfView``.
* When referencing view class names you should omit the ``View`` suffix. For
  example: ``$this->viewBuilder()->className('Pdf');``.

You'll also want to extend ``View`` to ensure things work correctly::

    // In src/View/PdfView.php
    namespace App\View;

    use Cake\View\View;

    class PdfView extends View
    {
        public function render($view = null, $layout = null)
        {
            // Custom logic here.
        }
    }

Replacing the render method lets you take full control over how your content is
rendered.

More About Views
================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=en: Views
    :keywords lang=en: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
