Controllers
###########

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Controllers are the 'C' in MVC. After routing has been applied and the correct
controller has been found, your controller's action is called. Your controller
should handle interpreting the request data, making sure the correct models
are called, and the right response or view is rendered. Controllers can be
thought of as middle layer between the Model and View. You want to keep your
controllers thin, and your models fat. This will help you reuse
your code and makes your code easier to test.

Commonly, a controller is used to manage the logic around a single model. For
example, if you were building a site for an online bakery, you might have a
RecipesController managing your recipes and an IngredientsController managing your
ingredients. However, it's also possible to have controllers work with more than
one model. In CakePHP, a controller is named after the primary model it
handles.

Your application's controllers extend the ``AppController`` class, which in turn
extends the core :php:class:`Controller` class. The ``AppController``
class can be defined in **src/Controller/AppController.php** and it should
contain methods that are shared between all of your application's controllers.

Controllers provide a number of methods that handle requests. These are called
*actions*. By default, each public method in
a controller is an action, and is accessible from a URL. An action is responsible
for interpreting the request and creating the response. Usually responses are
in the form of a rendered view, but there are other ways to create responses as
well.

.. _app-controller:

The App Controller
==================

As stated in the introduction, the ``AppController`` class is the parent class
to all of your application's controllers.  ``AppController`` itself extends the
:php:class:`Cake\\Controller\\Controller` class included in CakePHP.
``AppController`` is defined in **src/Controller/AppController.php** as
follows::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Controller attributes and methods created in your ``AppController`` will be
available in all controllers that extend it. Components (which you'll
learn about later) are best used for code that is used in many (but not
necessarily all) controllers.

You can use your ``AppController`` to load components that will be used in every
controller in your application. CakePHP provides a ``initialize()`` method that
is invoked at the end of a Controller's constructor for this kind of use::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize(): void
        {
            // Always enable the CSRF component.
            $this->loadComponent('Csrf');
        }
    }

Request Flow
============

When a request is made to a CakePHP application, CakePHP's
:php:class:`Cake\\Routing\\Router` and :php:class:`Cake\\Routing\\Dispatcher`
classes use :ref:`routes-configuration` to find and create the correct
controller instance. The request data is encapsulated in a request object.
CakePHP puts all of the important request information into the ``$this->request``
property. See the section on :ref:`cake-request` for more information on the
CakePHP request object.

Controller Actions
==================

Controller actions are responsible for converting the request parameters into a
response for the browser/user making the request. CakePHP uses conventions to
automate this process and remove some boilerplate code you would otherwise need
to write.

By convention, CakePHP renders a view with an inflected version of the action
name. Returning to our online bakery example, our RecipesController might contain the
``view()``, ``share()``, and ``search()`` actions. The controller would be found
in **src/Controller/RecipesController.php** and contain::

    // src/Controller/RecipesController.php

    class RecipesController extends AppController
    {
        public function view($id)
        {
            // Action logic goes here.
        }

        public function share($customerId, $recipeId)
        {
            // Action logic goes here.
        }

        public function search($query)
        {
            // Action logic goes here.
        }
    }

The template files for these actions would be **templates/Recipes/view.php**,
**templates/Recipes/share.php**, and **templates/Recipes/search.php**. The
conventional view file name is the lowercased and underscored version of the
action name.

Controller actions generally use
``Controller::set()`` to create a context that
``View`` uses to render the view layer. Because of the conventions that
CakePHP uses, you don't need to create and render the view manually. Instead,
once a controller action has completed, CakePHP will handle rendering and
delivering the View.

If for some reason you'd like to skip the default behavior, you can return a
:php:class:`Cake\\Http\\Response` object from the action with the fully
created response.

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

Interacting with Views
======================

Controllers interact with views in a number of ways. First, they
are able to pass data to the views, using ``Controller::set()``. You can also
decide which view class to use, and which view file should be
rendered from the controller.

.. _setting-view_variables:

Setting View Variables
----------------------

.. php:method:: set(string $var, mixed $value)

The ``Controller::set()`` method is the main way to send data from your
controller to your view. Once you've used ``Controller::set()``, the variable
can be accessed in your view::

    // First you pass data from the controller:

    $this->set('color', 'pink');

    // Then, in the view, you can utilize the data:
    ?>

    You have selected <?= h($color) ?> icing for the cake.

The ``Controller::set()`` method also takes an
associative array as its first parameter. This can often be a quick way to
assign a set of information to the view::

    $data = [
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95
    ];

    // Make $color, $type, and $base_price
    // available to the view:

    $this->set($data);

Keep in mind that view vars are shared among all parts rendered by your view.
They will be available in all parts of the view: the template, the layout and
all elements inside the former two.

Setting View Options
--------------------

If you want to customize the view class, layout/template paths, helpers or the
theme that will be used when rendering the view, you can use the
``viewBuilder()`` method to get a builder. This builder can be used to define
properties of the view before it is created::

    $this->viewBuilder()
        ->addHelper('MyCustom')
        ->setTheme('Modern')
        ->setClassName('Modern.Admin');

The above shows how you can load custom helpers, set the theme and use a custom
view class.

Rendering a View
----------------

.. php:method:: render(string $view, string $layout)

The ``Controller::render()`` method is automatically called at the end of each requested
controller action. This method performs all the view logic (using the data
you've submitted using the ``Controller::set()`` method), places the view inside its
``View::$layout``, and serves it back to the end user.

The default view file used by render is determined by convention.
If the ``search()`` action of the RecipesController is requested,
the view file in **templates/Recipes/search.php** will be rendered::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Render the view in templates/Recipes/search.php
            return $this->render();
        }
    // ...
    }

Although CakePHP will automatically call it after every action's logic
(unless you've called ``$this->disableAutoRender()``), you can use it to specify
an alternate view file by specifying a view file name as first argument of
``Controller::render()`` method.

If ``$view`` starts with '/', it is assumed to be a view or
element file relative to the **templates** folder. This allows
direct rendering of elements, very useful in AJAX calls::

    // Render the element in templates/element/ajaxreturn.php
    $this->render('/element/ajaxreturn');

The second parameter ``$layout`` of ``Controller::render()`` allows you to specify the layout
with which the view is rendered.

Rendering a Specific Template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller, you may want to render a different view than the
conventional one. You can do this by calling ``Controller::render()`` directly. Once you
have called ``Controller::render()``, CakePHP will not try to re-render the view::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('custom_file');
        }
    }

This would render **templates/Posts/custom_file.php** instead of
**templates/Posts/my_action.php**.

You can also render views inside plugins using the following syntax:
``$this->render('PluginName.PluginController/custom_file')``.
For example::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function myAction()
        {
            $this->render('Users.UserDetails/custom_file');
        }
    }

This would render **plugins/Users/templates/UserDetails/custom_file.php**

.. _controller-viewclasses:

Content Type Negotiation
========================

.. php:method:: viewClasses()

Controllers can define a list of view classes they support. After the
controller's action is complete CakePHP will use the view list to perform
content-type negotiation. This enables your application to re-use the same
controller action to render an HTML view or render a JSON or XML response. To
define the list of supported view classes for a controller is done with the
``viewClasses()`` method::

    namespace App\Controller;

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    class PostsController extends AppController
    {
        public function viewClasses()
        {
            return [JsonView::class, XmlView::class];
        }
    }

The application's ``View`` class is automatically used as a fallback when no
other view can be selected based on the requests' ``Accept`` header or routing
extension. If your application needs to perform different logic for different
response formats you can use ``$this->request->is()`` to build the required
conditional logic.

.. note::
    View classes must implement the static ``contentType()`` hook method to
    participate in content-type negotiation.

<<<<<<< HEAD
=======

>>>>>>> 4.next
Content Type Negotiation Fallbacks
==================================

If no View can be matched with the request's content type preferences, CakePHP
will use the base ``View`` class. If you want to require content-type
negotiation, you can use the ``NegotiationRequiredView`` which sets a 406 status
code::

    public function viewClasses()
    {
        // Require Accept header negotiation or return a 406 response.
        return [JsonView::class, NegotiationRequiredView::class];
    }

You can use the ``TYPE_MATCH_ALL`` content type value to build your own fallback
view logic::

    namespace App\View;

    use Cake\View\View;

    class CustomFallbackView extends View
    {
        public static function contentType(): string
        {
            return static::TYPE_MATCH_ALL;
        }

    }

It is important to remember that match-all views are applied only *after*
content-type negotiation is attempted.


Redirecting to Other Pages
==========================

.. php:method:: redirect(string|array $url, integer $status)

The ``redirect()`` method adds a ``Location`` header and sets the status code of
a response and returns it. You should return the response created by
``redirect()`` to have CakePHP send the redirect instead of completing the
controller action and rendering a view.

You can redirect using :term:`routing array` values::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        $order->id,
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

Or using a relative or absolute URL::

    return $this->redirect('/orders/confirm');
    return $this->redirect('http://www.example.com');

Or to the referer page::

    return $this->redirect($this->referer());

By using the second parameter you can define a status code for your redirect::

    // Do a 301 (moved permanently)
    return $this->redirect('/order/confirm', 301);

    // Do a 303 (see other)
    return $this->redirect('/order/confirm', 303);

See the :ref:`redirect-component-events` section for how to redirect out of
a life-cycle handler.

Forwarding to an Action on the Same Controller
----------------------------------------------

.. php:method:: setAction($action, $args...)

If you need to forward the current action to a different action on the *same*
controller, you can use ``Controller::setAction()`` to update the request
object, modify the view template that will be rendered and forward execution to
the named action::

    // From a delete action, you can render the updated
    // list page.
    $this->setAction('index');

Loading Additional Models
=========================

.. php:method:: fetchTable(string $alias, array $config = [])

The ``fetchTable()`` function comes handy when you need to use a table that is not
the controller's default one::

    // In a controller method.
    $recentArticles = $this->fetchTable('Articles')->find('all', [
            'limit' => 5,
            'order' => 'Articles.created DESC'
        ])
        ->all();

.. versionadded:: 4.3.0
    ``Controller::fetchTable()`` was added. Prior to 4.3 you need to use ``Controller::loadModel()``.

Paginating a Model
==================

.. php:method:: paginate()

This method is used for paginating results fetched by your models.
You can specify page sizes, model find conditions and more. See the
:doc:`pagination <controllers/components/pagination>` section for more details on
how to use ``paginate()``.

The ``$paginate`` attribute gives you a way to customize how ``paginate()``
behaves::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [
                'conditions' => ['published' => 1]
            ]
        ];
    }

Configuring Components to Load
==============================

.. php:method:: loadComponent($name, $config = [])

In your Controller's ``initialize()`` method you can define any components you
want loaded, and any configuration data for them::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Csrf');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. _controller-life-cycle:

Request Life-cycle Callbacks
============================

CakePHP controllers trigger several events/callbacks that you can use to insert
logic around the request life-cycle:

Event List
----------

* ``Controller.initialize``
* ``Controller.startup``
* ``Controller.beforeRedirect``
* ``Controller.beforeRender``
* ``Controller.shutdown``

Controller Callback Methods
---------------------------

By default the following callback methods are connected to related events if the
methods are implemented by your controllers

.. php:method:: beforeFilter(EventInterface $event)

    Called during the ``Controller.initialize`` event which occurs before every
    action in the controller.  It's a handy place to check for an active session
    or inspect user permissions.

    .. note::

        The beforeFilter() method will be called for missing actions.

    Returning a response from a ``beforeFilter`` method will not prevent other
    listeners of the same event from being called. You must explicitly
    :ref:`stop the event <stopping-events>`.

.. php:method:: beforeRender(EventInterface $event)

    Called during the ``Controller.beforeRender`` event which occurs after
    controller action logic, but before the view is rendered. This callback is
    not used often, but may be needed if you are calling
    :php:meth:`~Cake\\Controller\\Controller::render()` manually before the end
    of a given action.

.. php:method:: afterFilter(EventInterface $event)

    Called during the ``Controller.shutdown`` event which is triggered after
    every controller action, and after rendering is complete. This is the last
    controller method to run.

In addition to controller life-cycle callbacks, :doc:`/controllers/components`
also provide a similar set of callbacks.

Remember to call ``AppController``'s callbacks within child controller callbacks
for best results::

    //use Cake\Event\EventInterface;
    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
    }

.. _controller-middleware:

Controller Middleware
=====================

.. php:method:: middleware($middleware, array $options = [])

:doc:`Middleware </controllers/middleware>` can be defined globally, in
a routing scope or within a controller. To define middleware for a specific
controller use the ``middleware()`` method from your controller's
``initialize()`` method::

    public function initialize(): void
    {
        parent::initialize();

        $this->middleware(function ($request, $handler) {
            // Do middleware logic.

            // Make sure you return a response or call handle()
            return $handler->handle($request);
        });
    }

Middleware defined by a controller will be called **before** ``beforeFilter()`` and action methods are called.

.. versionadded:: 4.3.0
    ``Controller::middleware()`` was added.

More on Controllers
===================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=en: Controllers
    :keywords lang=en: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
