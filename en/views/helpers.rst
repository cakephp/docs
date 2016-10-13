Helpers
#######

Helpers are the component-like classes for the presentation layer of your
application. They contain presentational logic that is shared between many
views, elements, or layouts. This chapter will show you how to configure
helpers. How to load helpers and use those helpers, and outline the simple steps
for creating your own custom helpers.

CakePHP includes a number of helpers that aid in view creation. They assist in
creating well-formed markup (including forms), aid in formatting text, times and
numbers, and can even speed up AJAX functionality. For more information on the
helpers included in CakePHP, check out the chapter for each helper:

.. toctree::
    :maxdepth: 1

    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/rss
    /views/helpers/session
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

Configuring Helpers
===================

You load helpers in CakePHP by declaring them in a view class. An ``AppView``
class comes with every CakePHP application and is the ideal place to load
helpers::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Html');
            $this->loadHelper('Form');
            $this->loadHelper('Flash');
        }
    }

To load helpers from plugins use the :term:`plugin syntax` used elsewhere in
CakePHP::

    $this->loadHelper('Blog.Comment');

You don't have to explicitly load Helpers that come from CakePHP or your
application. These helpers can be lazily loaded upon first use. For example::

    // Loads the FormHelper if it has not already been loaded.
    $this->Form->create($article);

From within a plugin's views, plugin helpers can also be lazily loaded. For
example, view templates in the 'Blog' plugin, can lazily load helpers from the
same plugin.

Conditionally Loading Helpers
-----------------------------

You can use the current action name to conditionally load helpers::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            if ($this->request->param('action') === 'index') {
                $this->loadHelper('ListPage');
            }
        }
    }

You can also use your controller's ``beforeRender`` method to load helpers::

    class ArticlesController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $this->viewBuilder()->helpers(['MyHelper']);
        }
    }

Configuration options
---------------------

You can pass configuration options to helpers. These options can be used to set
attribute values or modify the behavior of a helper::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {

        // initialize() hook is available since 3.2. For prior versions you can
        // override the constructor if required.
        public function initialize(array $config)
        {
            debug($config);
        }
    }

Options can be specified when declaring helpers in controller as shown::

    namespace App\Controller;

    use App\Controller\AppController;

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

By default all configuration options will be merged with the ``$_defaultConfig``
property. This property should define the default values of any configuration
your helper requires. For example::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
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

    class PostsController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig(),
            ]);
        }
    }

.. _aliasing-helpers:

Aliasing Helpers
----------------

One common setting to use is the ``className`` option, which allows you to
create aliased helpers in your views. This feature is useful when you want to
replace ``$this->Html`` or another common Helper reference with a custom
implementation::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize()
        {
            $this->loadHelper('Html', [
                'className' => 'MyHtml'
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
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

The above would call the ``css()`` method on the HtmlHelper. You can
access any loaded helper using ``$this->{$helperName}``.

Loading Helpers On The Fly
--------------------------

There may be situations where you need to dynamically load a helper from inside
a view.  You can use the view's :php:class:`Cake\\View\\HelperRegistry` to
do this::

    // Either one works.
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

The HelperRegistry is a :doc:`registry </core-libraries/registry-objects>` and
supports the registry API used elsewhere in CakePHP.


Callback Methods
================

Helpers feature several callbacks that allow you to augment the view rendering
process. See the :ref:`helper-api` and the
:doc:`/core-libraries/events` documentation for more information.

Creating Helpers
================

You can create custom helper classes for use in your application or plugins.
Like most components of CakePHP, helper classes have a few conventions:

* Helper class files should be put in **src/View/Helper**. For example:
  **src/View/Helper/LinkHelper.php**
* Helper classes should be suffixed with ``Helper``. For example: ``LinkHelper``.
* When referencing helper class names you should omit the ``Helper`` suffix. For
  example: ``$this->loadHelper('Link');``.

You'll also want to extend ``Helper`` to ensure things work correctly::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // Logic to create specially formatted link goes here...
        }
    }

Including Other Helpers
-----------------------

You may wish to use some functionality already existing in another helper. To do
so, you can specify helpers you wish to use with a ``$helpers`` array, formatted
just as you would in a controller::

    /* src/View/Helper/LinkHelper.php (using other helpers) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // Use the HTML helper to output
            // Formatted data:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }

.. _using-helpers:

Using Your Helper
-----------------

Once you've created your helper and placed it in **src/View/Helper/**, you can
load it in your views::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Link');
        }
    }

Once your helper has been loaded, you can use it in your views by accessing the
matching view property::

    <!-- make a link using the new helper -->
    <?= $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>

.. note::

    The ``HelperRegistry`` will attempt to lazy load any helpers not
    specifically identified in your ``Controller``.

Accessing View Variables Inside Your Helper
--------------------------------------------

If you would like to access a View variable inside a helper, you can use
``$this->_View->get()`` like::

    class AwesomeHelper extends Helper
    {

        public $helpers = ['Html'];

        public someMethod()
        {
            // set meta description
            echo $this->Html->meta(
                'description', $this->_View->get('metaDescription'), ['block' =>'meta']
            );
        }
    }

Rendering A View Element Inside Your Helper
-------------------------------------------

If you would like to render an Element inside your Helper you can use
``$this->_View->element()`` like::

    class AwesomeHelper extends Helper
    {
        public someFunction()
        {
            // output directly in your helper
            echo $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );

            // or return it to your view
            return $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );
        }
    }

.. _helper-api:

Helper Class
============

.. php:class:: Helper

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

    The beforeRender method is called after the controller's beforeRender method
    but before the controller renders view and layout. Receives the file being
    rendered as an argument.

.. php:method:: afterRender(Event $event, $viewFile)

    Is called after the view has been rendered but before layout rendering has
    started.

.. php:method:: beforeLayout(Event $event, $layoutFile)

    Is called before layout rendering starts. Receives the layout filename as an
    argument.

.. php:method:: afterLayout(Event $event, $layoutFile)

    Is called after layout rendering is complete. Receives the layout filename
    as an argument.

.. meta::
    :title lang=en: Helpers
    :keywords lang=en: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
