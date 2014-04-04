Helpers
#######


Helpers are the component-like classes for the presentation layer
of your application. They contain presentational logic that is
shared between many views, elements, or layouts. This chapter will
show you how to create your own helpers, and outline the basic
tasks CakePHP's core helpers can help you accomplish.

CakePHP features a number of helpers that aid in view creation.
They assist in creating well-formed markup (including forms), aid
in formatting text, times and numbers, and can even speed up AJAX
functionality. For more information on the helpers included in CakePHP,
check out the chapter for each helper:

.. include:: /core-libraries/toc-helpers.rst
    :start-line: 11

.. _configuring-helpers:

Configuring Helpers
===================

You enable helpers in CakePHP by making a controller aware of them. Each
controller has a :php:attr:`~Cake\\Controller\\Controller::$helpers` property
that lists the helpers to be made available in the view. To enable a helper in
your view, add the name of the helper to the controller's ``$helpers`` array::

    class BakeriesController extends AppController {
        public $helpers = ['Form', 'Html', 'Js', 'Time'];
    }

Adding helpers from plugins uses the :term:`plugin syntax` used elsewhere in
CakePHP::

    class BakeriesController extends AppController {
        public $helpers = ['Blog.Comment'];
    }

You can also add helpers from within an action, so they will only
be available to that action and not the other actions in the
controller. This saves processing power for the other actions that
do not use the helper as well as help keep the controller better
organized::

    class BakeriesController extends AppController {
        public function bake() {
            $this->helpers[] = 'Time';
        }
        public function mix() {
            // The Time helper is not loaded here and thus not available
        }
    }

If you need to enable a helper for all controllers add the name of
the helper to the ``$helpers`` array in ``/App/Controller/AppController.php`` (or
create if not present). Remember to include the default Html and
Form helpers::

    class AppController extends Controller {
        public $helpers = ['Form', 'Html', 'Js', 'Time'];
    }

Configuration options
---------------------

You can pass configuration options to helpers. These options can be used to set
attribute values or modify behavior of a helper::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $config = []) {
            parent::__construct($view, $config);
            debug($config);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

By default all configuration options will be merged with the ``$_defaultConfig``
property. This property should define the default values of any configuration
your helper requires. For example::

    namespace App\View\Helper;

    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends AppHelper {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];

        public function __construct(View $view, $config = []) {
            parent::__construct($view, $config);
            $this->initStringTemplates();
        }
    }

Any configuration provided to your helper's constructor will be merged with the
default values during construction and the merged data will be set to
``_config``. You can use the ``config()`` method to read runtime configuration::

    // Read the errorClass config option.
    $class = $this->Awesome->config('errorClass');

Using helper configuration allows you to declaratively configure your helpers and
keep configuration logic out of your controller actions. If you have
configuration options that cannot be included as part of a class declaration,
you can set those in your controller's beforeRender callback::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffConfig();
        }
    }


Aliasing Helpers
----------------

One common setting to use is the ``className`` option, which allows you to
create aliased helpers in your views. This feature is useful when you want to
replace ``$this->Html`` or another common Helper reference with a custom
implementation::

    // App/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = [
            'Html' => [
                'className' => 'MyHtml'
            ]
        ];
    }

    // App/View/Helper/MyHtmlHelper.php
    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper {
        // Add your code to override the core HtmlHelper
    }

The above would *alias* ``MyHtmlHelper`` to ``$this->Html`` in your views.

.. note::

    Aliasing a helper replaces that instance anywhere that helper is used,
    including inside other Helpers.

Using Helpers
=============

Once you've configured which helpers you want to use in your controller,
each helper is exposed as a public property in the view. For example, if you
were using the :php:class:`HtmlHelper` you would be able to access it by
doing the following::

    echo $this->Html->css('styles');

The above would call the ``css`` method on the HtmlHelper. You can
access any loaded helper using ``$this->{$helperName}``.

Loading Helpers On The Fly
--------------------------

There may be situations where you need to dynamically load a helper from inside
a view.  You can use the view's :php:class:`Cake\\View\\HelperRegistry` to
do this::

    $mediaHelper = $this->Helpers->load('Media', $mediaConfig);

The HelperRegistry is a :doc:`registry </core-libraries/registry-objects>` and
supports the registry API used elsewhere in CakePHP.


Callback Methods
================

Helpers feature several callbacks that allow you to augment the
view rendering process. See the :ref:`helper-api` and the
:doc:`/core-libraries/events` documentation for more information.

Creating Helpers
================

If a core helper (or one showcased on GitHub or the Bakery)
doesn't fit your needs, helpers are easy to create.

Let's say we wanted to create a helper that could be used to output
a specifically crafted CSS-styled link you needed many different
places in your application. In order to fit your logic in to
CakePHP's existing helper structure, you'll need to create a new
class in ``/App/View/Helper``. Let's call our helper LinkHelper. The
actual PHP class file would look something like this::

    /* /App/View/Helper/LinkHelper.php */
    use Cake\View\Helper;

    class LinkHelper extends AppHelper {
        public function makeEdit($title, $url) {
            // Logic to create specially formatted link goes here...
        }
    }

.. note::

    Helpers should extend either ``AppHelper`` or :php:class:`Helper`

Including Other Helpers
-----------------------

You may wish to use some functionality already existing in another
helper. To do so, you can specify helpers you wish to use with a
``$helpers`` array, formatted just as you would in a controller::

    /* /App/View/Helper/LinkHelper.php (using other helpers) */
    use App\View\Helper\AppHelper;

    class LinkHelper extends AppHelper {
        public $helpers = ['Html'];

        public function makeEdit($title, $url) {
            // Use the HTML helper to output
            // formatted data:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Using Your Helper
-----------------

Once you've created your helper and placed it in
``/App/View/Helper/``, you'll be able to include it in your
controllers using the special variable :php:attr:`~Controller::$helpers`::

    class PostsController extends AppController {
        public $helpers = ['Link'];
    }

Once your controller has been made aware of this new class, you can
use it in your views by accessing an object named after the
helper::

    <!-- make a link using the new helper -->
    <?= $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>


Creating Functionality for All Helpers
======================================

All helpers extend a special class, AppHelper (just like models
extend AppModel and controllers extend AppController). To create
functionality that would be available to all helpers, create
``/App/View/Helper/AppHelper.php``::

    use App\View\Helper\AppHelper;

    class AppHelper extends Helper {
        public function customMethod() {
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

    Generates an HTML escaped URL, delegates to :php:meth:`Cake\\Routing\\Router::url()`.

Callbacks
---------

By implementing a callback method in a helper, CakePHP will automatically
subscribe your helper to the relevant event. Unlike previous versions of CakePHP
you should *not* call ``parent`` in your callbacks, as the base Helper class
does not implement any of the callback methods.

.. php:method:: beforeRenderFile(Event $event, $viewFile)

    Is called before each view file is rendered. This includes elements,
    views, parent views and layouts.

.. php:method:: afterRenderFile(Event $event, $viewFile, $content)

    Is called after each view file is rendered. This includes elements, views,
    parent views and layouts. A callback can modify and return ``$content`` to
    change how the rendered content will be displayed in the browser.

.. php:method:: beforeRender(Event $event, $viewFile)

    The beforeRender method is called after the controller's
    beforeRender method but before the controller renders view and
    layout. Receives the file being rendered as an argument.

.. php:method:: afterRender(Event $event, $viewFile)

    Is called after the view has been rendered but before layout rendering has
    started.

.. php:method:: beforeLayout(Event $event, $layoutFile)

    Is called before layout rendering starts. Receives the layout filename as an
    argument.

.. php:method:: afterLayout(Event $event, $layoutFile)

    Is called after layout rendering is complete. Receives the layout filename as an
    argument.

.. meta::
    :title lang=en: Helpers
    :keywords lang=en: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
