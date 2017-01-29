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
functionality. For more information on the helpers included in CakePHP,
check out :ref:`core-helpers`.

.. _configuring-helpers:

Using and Configuring Helpers
=============================

You enable helpers in CakePHP by making a controller aware of them.  Each
controller has a :php:attr:`~Controller::$helpers` property that lists the
helpers to be made available in the view.  To enable a helper in your view, add
the name of the helper to the controller's ``$helpers`` array::

    <?php
    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

Adding helpers from plugins uses the :term:`plugin syntax` used elsewhere in
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
the helper to the ``$helpers`` array in ``/app/Controller/AppController.php`` (or
create if not present). Remember to include the default Html and
Form helpers::

    <?php
    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
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
        public $helpers = array('Awesome' => array('option1' => 'value1'));
    }

One common setting to use is the ``className`` option, which allows you to
create aliased helpers in your views.  This feature is useful when you want to
replace ``$this->Html`` or another common Helper reference with a custom
implementation::

    <?php
    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array(
            'Html' => array(
                'className' => 'MyHtml'
            )
        );
    }

    // app/View/Helper/MyHtmlHelper.php
    App::uses('HtmlHelper', 'View/Helper');
    class MyHtmlHelper extends HtmlHelper {
        // Add your code to override the core HtmlHelper
    }

The above would *alias* ``MyHtmlHelper`` to ``$this->Html`` in your views.

.. note::

    Aliasing a helper replaces that instance anywhere that helper is used,
    including inside other Helpers.

.. tip::

    Aliasing the Html or Session Helper while using the core PagesController 
    will not work. It is better to copy 
    ``lib/Cake/Controller/PagesController.php`` into your ``app/Controller/`` 
    folder.

Using helper settings allows you to declaratively configure your helpers and
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
    App::uses('AppHelper', 'View/Helper');
    
    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // Logic to create specially formatted link goes here...
        }
    }

.. note::

    Helpers must extend either ``AppHelper`` or :php:class:`Helper` or implement all the callbacks
    in the :ref:`helper-api`.

Including other Helpers
-----------------------

You may wish to use some functionality already existing in another
helper. To do so, you can specify helpers you wish to use with a
``$helpers`` array, formatted just as you would in a controller::

    <?php
    /* /app/View/Helper/LinkHelper.php (using other helpers) */
    App::uses('AppHelper', 'View/Helper');
    
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
    App::uses('AppHelper', 'View/Helper');
    
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

    Generates an HTML escaped URL, delegates to :php:meth:`Router::url()`.

.. php:method:: value($options = array(), $field = null, $key = 'value')

    Get the value for a given input name.

.. php:method:: domId($options = null, $id = 'id')

    Generate a CamelCased id value for the currently selected field. 
    Overriding this method in your AppHelper will allow you to change 
    how CakePHP generates ID attributes.

Callbacks
---------

.. php:method:: beforeRenderFile($viewFile)

    Is called before all view files are rendered.  This includes elements,
    views, parent views, and layouts.

.. php:method:: afterRenderFile($viewFile, $content)

    Is called after all view files are rendered.  This includes elements, views,
    parent views, and layouts.  A callback can modify and return ``$content`` to
    change how the rendered content will be displayed in the browser.

.. php:method:: beforeRender($viewFile)

    The beforeRender method is called after the controller's
    beforeRender method but before the controller renders view and
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

Core Helpers
============

:doc:`/core-libraries/helpers/cache`
    Used by the core to cache view content.
:doc:`/core-libraries/helpers/form`
    Creates HTML forms and form elements that self populate and handle
    validation problems.
:doc:`/core-libraries/helpers/html`
    Convenience methods for crafting well-formed markup. Images, links,
    tables, header tags and more.
:doc:`/core-libraries/helpers/js`
    Used to create Javascript compatible with various Javascript
    libraries.
:doc:`/core-libraries/helpers/number`
    Number and currency formatting.
:doc:`/core-libraries/helpers/paginator`
    Model data pagination and sorting.
:doc:`/core-libraries/helpers/rss`
    Convenience methods for outputting RSS feed XML data.
:doc:`/core-libraries/helpers/session`
    Access for reading session values in views.
:doc:`/core-libraries/helpers/text`
    Smart linking, highlighting, word smart truncation.
:doc:`/core-libraries/helpers/time`
    Proximity detection (is this next year?), nice string
    formatting(Today, 10:30 am) and time zone conversion.



.. meta::
    :title lang=en: Helpers
    :keywords lang=en: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
