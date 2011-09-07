Helpers
#######

Helpers are the component-like classes for the presentation layer
of your application. They contain presentational logic that is
shared between many views, elements, or layouts. This chapter will
show you how to create your own helpers, and outline the basic
tasks CakePHP’s core helpers can help you accomplish.

CakePHP features a number of helpers that aid in view creation.
They assist in creating well-formed markup (including forms), aid
in formatting text, times and numbers, and can even speed up Ajax
functionality. Here is a summary of the built-in helpers. For more
information, check out :doc:`/core-libraries/helpers`.

.. _configuring-helpers:

Using and Configuring Helpers
=============================

You configure helpers in CakePHP by making a controller aware of them.  Each
controller has a :php:attr:`~Controller::$helpers` property that lists the
helpers to be made available in the view.  To enable a helper in your view, add
the name of the helper to the controller's ``$helpers`` array::

    <?php
    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }

Adding helpers from plugins, uses the :term:`plugin syntax` used elsewhere in
CakePHP::

    <?php
    class BakeriesController extends AppController {
        public $helpers = array('Blog.Comment');
    }

You can also add helpers from within an action, so they will only
be available to that action and not the other actions in the
controller. This saves processing power for the other actions that
do not use the helper as well as help keep the controller better
organized::

    <?php
    class BakeriesController extends AppController {
        function bake {
            $this->helpers[] = 'Time';
        }
        function mix {
            // The Time helper is not loaded here and thus not available
        }
    }

If you need to enable a helper for all controllers add the name of
the helper to the ``$helpers`` array in */app/Controller/AppController.php* (or
create if not present). Remember to include the default Html and
Form helpers::

    <?php
    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }

You can pass options to helpers. These options can be used to set
attribute values or modify behavior of a helper::

    <?php
    class AwesomeHelper extends AppHelper {
        function __construct(View $view, $settings = array()) {
            parent::__construct($view, $settings);
            debug($options);
        }
    }

    class AwesomeController extends AppController {
        var $helpers = array('Awesome' => array('option1' => 'value1'));
    }

One common setting to use is the ``className`` option, which allows you to
create aliased helpers in your views.  This feature is useful when you want to
replace ``$this->Html`` or another common Helper reference with a custom
implmentation::

    <?php
    class PostsController extends AppController {
        public $helpers = array(
            'Html' => array(
                'className' => 'MyHtml'
            )
        );
    }

The above would _alias_ ``MyHtmlHelper`` to ``$this->Html`` in your views.

.. note::

    Aliasing a helper replaces that instance anywhere that helper is used,
    including inside other Helpers.

Using helper settings allows you to declaritively configure your helpers.  And
keep configuration logic out of your controller actions.  If you have
configuration options that cannot be included as part of a class declaration,
you can set those in your controller's beforeRender callback::

    <?php
    class PostsController extends AppController {
        function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
        }
    }

Using Helpers
=============

Once you've configured which helpers you want to use in your controller, 
each helper is exposed as a public property in the view.  For example, if you
were using the :php:class:`HtmlHelper` you would be able to access it by 
doing the following::

    <?php
    echo $this->Html->css('styles');

The above would call the ``css`` method on the HtmlHelper.  You can
access any loaded helper using ``$this->{$helperName}``.  There may
come a time where you need to dynamically load a helper from inside
a view.  You can use the view's :php:class:`HelperCollection` to 
do this::

    <?php
    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

The HelperCollection is a :doc:`collection </core-libraries/collections>` and 
supports the collection API used elsewhere in CakePHP.

Callback methods
================

Helpers feature several callbacks that allow you to augment the 
view rendering process.  See the :ref:`helper-api` and the
:doc:`/core-libraries/collections` documentation for more information.

Creating Helpers
================

If a core helper (or one showcased on github or the Bakery)
doesn’t fit your needs, helpers are easy to create.

Let's say we wanted to create a helper that could be used to output
a specifically crafted CSS-styled link you needed many different
places in your application. In order to fit your logic in to
CakePHP's existing helper structure, you'll need to create a new
class in ``/app/View/Helper``. Let's call our helper LinkHelper. The
actual PHP class file would look something like this::

    <?php
    /* /app/View/Helper/LinkHelper.php */
    
    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // Logic to create specially formatted link goes here...
        }
    }

.. note::

    Helpers must extend :php:class:`Helper` or implement all the callbacks
    in the :ref:`helper-api`.

Including other Helpers
-----------------------

You may wish to use some functionality already existing in another
helper. To do so, you can specify helpers you wish to use with a
``$helpers`` array, formatted just as you would in a controller::

    <?php
    /* /app/View/Helper/LinkHelper.php (using other helpers) */
    class LinkHelper extends AppHelper {
        public $helpers = array('Html');
    
        function makeEdit($title, $url) {
            // Use the HTML helper to output
            // formatted data:
    
            $link = $this->Html->link($title, $url, array('class' => 'edit'));
    
            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Using your Helper
-----------------

Once you've created your helper and placed it in
``/app/View/Helper/``, you'll be able to include it in your
controllers using the special variable :php:attr:`~Controller::$helpers`::

    <?php
    class PostsController extends AppController {
        public $helpers = array('Link');
    }

Once your controller has been made aware of this new class, you can
use it in your views by accessing an object named after the
helper::

    <!-- make a link using the new helper -->
    <?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>


Creating Functionality for All Helpers
======================================

All helpers extend a special class, AppHelper (just like models
extend AppModel and controllers extend AppController). To create
functionality that would be available to all helpers, create
``/app/View/Helper/AppHelper.php``::

    <?php
    class AppHelper extends Helper {
        function customMethod () {
        }
    }


.. _helper-api:

Helper API
==========

.. php:class:: Helper

    The base class for Helpers. It provides a number of utility methods and 
    features for loading other helpers.

.. php:method:: webroot($file)

    Resolve a file name to the webroot of the application. If a theme is active
    and the file exists in the current theme's webroot, the path to the themed
    file will be returned.

.. php:method:: url($url, $full = false)

    Generates an HTML escaped URL, delgates to :php:meth:`Router::url()`.

.. php:method:: value($options = array(), $field = null, $key = 'value')

    Get the value for a given input name.

.. php:method:: domId($options = null, $id = 'id')

    Generate a CamelCased id value for the currently selected field. 
    Overriding this method in your AppHelper will allow you to change 
    how CakePHP generates ID attributes.

Callbacks
---------

.. php:method:: beforeRender($viewFile)

    The beforeRender method is called after the controller's
    beforeRender method but before the controller's renders views and
    layout. Receives the file being rendered as an argument.

.. php:method:: afterRender($viewFile)

    Is called after the view has been rendered but before layout rendering has
    started.

.. php:method:: beforeLayout($layoutFile)

    Is called before layout rendering starts. Receives the layout filename as an
    argument.

.. php:method:: afterLayout($layoutFile)

    Is called after layout rendering is complete. Receives the layout filename as an
    argument.

Helpers are the component-like classes for the presentation layer
of your application. They contain presentational logic that is
shared between many views, elements, or layouts.

This section describes each of the helpers that come with CakePHP
such as Form, Html, JavaScript and RSS.

Read :ref:`using-helpers` to learn more about
helpers and how you can build your own helpers.

Core Helpers
============

CakePHP comes with a number of Helpers built-in.  You can find out more about
each one below.

.. toctree::
    :maxdepth: 2

    helpers/cache
    helpers/form
    helpers/html
    helpers/js
    helpers/number
    helpers/paginator
    helpers/rss
    helpers/session
    helpers/text
    helpers/time
