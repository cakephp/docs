Controllers
###########

Controllers are the 'C' in MVC. After routing has been applied and the correct
controller has been found, your controller's action is called. Your controller
should handle interpreting the request data, making sure the correct models
are called, and the right response or view is rendered. Controllers can be
thought of as middle man between the Model and View. You want to keep your
controllers thin, and your models fat. This will help you more easily reuse
your code and makes your code easier to test.

Commonly, a controller is used to manage the logic around a single model. For
example, if you were building a site for an online bakery, you might have a
RecipesController managing your recipes and an IngredientsController managing your
ingredients. However, it's also possible to have controllers work with more than 
one model. In CakePHP, a controller is named after the primary model it
handles.

Your application's controllers extend the ``AppController`` class, which in turn
extends the core :php:class:`Controller` class. The ``AppController``
class can be defined in ``/App/Controller/AppController.php`` and it should
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

As stated in the introduction, the ``AppController`` class is the
parent class to all of your application's controllers.
``AppController`` itself extends the :php:class:`Controller` class included in the
CakePHP core library. ``AppController`` is defined in
``/App/Controller/AppController.php`` as follows::

    class AppController extends Controller {
    }

Controller attributes and methods created in your ``AppController``
will be available to all of your application's controllers. Components 
(which you'll learn about later) are best
used for code that is used in many (but not necessarily all)
controllers.

While normal object-oriented inheritance rules apply, CakePHP
does a bit of extra work when it comes to special controller
attributes. The components and helpers used by a
controller are treated specially. In these cases, ``AppController``
value arrays are merged with child controller class arrays. The values in the
child class will always override those in ``AppController.``

.. note::

    CakePHP merges the following variables from the ``AppController`` into
    your application's controllers:

    -  :php:attr:`~Controller::$components`
    -  :php:attr:`~Controller::$helpers`
    -  :php:attr:`~Controller::$uses`

Remember to add the default Html and Form helpers if you define
the :php:attr:`~Controller::$helpers` property in your ``AppController``.

Also remember to call ``AppController``'s callbacks within child
controller callbacks for best results::

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);
    }

Request Parameters
==================

When a request is made to a CakePHP application, CakePHP's :php:class:`Router` and
:php:class:`Dispatcher` classes use :ref:`routes-configuration` to find and
create the correct controller. The request data is encapsulated in a request
object. CakePHP puts all of the important request information into the
``$this->request`` property. See the section on
:ref:`cake-request` for more information on the CakePHP request object.

Controller Actions
==================

Controller actions are responsible for converting the request parameters into a
response for the browser/user making the request. CakePHP uses conventions to
automate this process and remove some boilerplate code you would otherwise need
to write.

By convention, CakePHP renders a view with an inflected version of the action
name. Returning to our online bakery example, our RecipesController might contain the
``view()``, ``share()``, and ``search()`` actions. The controller would be found
in ``/App/Controller/RecipesController.php`` and contain::

        # /App/Controller/RecipesController.php

        class RecipesController extends AppController {
            public function view($id) {
                //action logic goes here..
            }

            public function share($customerId, $recipeId) {
                //action logic goes here..
            }

            public function search($query) {
                //action logic goes here..
            }
        }

The view files for these actions would be ``app/Template/Recipes/view.ctp``,
``app/Template/Recipes/share.ctp``, and ``app/Template/Recipes/search.ctp``. The
conventional view file name is the lowercased and underscored version of the
action name.

Controller actions generally use :php:meth:`~Controller::set()` to create a
context that :php:class:`View` uses to render the view. Because of the
conventions that CakePHP uses, you don't need to create and render the view
manually. Instead, once a controller action has completed, CakePHP will handle
rendering and delivering the View.

If for some reason you'd like to skip the default behavior, both of the
following techniques will bypass the default view rendering behavior.

* If you return a string, or an object that can be converted to a string from
  your controller action, it will be used as the response body.
* You can return a :php:class:`CakeResponse` object with the completely created
  response.

When you use controller methods with
:php:meth:`~Cake\\Routing\\RequestActionTrait::requestAction()`
you will often want to return data that isn't a string. If you have controller
methods that are used for normal web requests + requestAction, you should check
the request type before returning::

    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipes->find('popular');
            if (!$this->request->is('requested')) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

The above controller action is an example of how a method can be used with
:php:meth:`~Controller::requestAction()` and normal requests. Returning array data to a
non-requestAction request will cause errors and should be avoided. See the
section on :php:meth:`Cake\\Controller\\Controller::requestAction()` for more tips on using
:php:meth:`~Controller::requestAction()`

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

.. _controller-life-cycle:

Request Life-cycle Callbacks
============================

.. php:class:: Controller

CakePHP controllers come fitted with callbacks you can use to
insert logic around the request life-cycle:

.. php:method:: beforeFilter(Event $event)

    This function is executed before every action in the controller.
    It's a handy place to check for an active session or inspect user
    permissions.

    .. note::

        The beforeFilter() method will be called for missing actions.

.. php:method:: beforeRender(Event $event)

    Called after controller action logic, but before the view is
    rendered. This callback is not used often, but may be needed if you
    are calling :php:meth:`~Controller::render()` manually before the end of a given action.

.. php:method:: afterFilter(Event $event)

    Called after every controller action, and after rendering is
    complete. This is the last controller method to run.

In addition to controller life-cycle callbacks, :doc:`/controllers/components`
also provide a similar set of callbacks.

.. _controller-methods:

Controller Methods
==================

For a complete list of controller methods and their descriptions
visit the `CakePHP API <http://api.cakephp.org/2.4/class-Controller.html>`_.

Interacting with Views
----------------------

Controllers interact with views in a number of ways. First, they
are able to pass data to the views, using :php:meth:`~Controller::set()`. You can also
decide which view class to use, and which view file should be
rendered from the controller.

.. php:method:: set(string $var, mixed $value)

    The :php:meth:`~Controller::set()` method is the main way to send data from your
    controller to your view. Once you've used :php:meth:`~Controller::set()`, the variable
    can be accessed in your view::

        // First you pass data from the controller:

        $this->set('color', 'pink');

        // Then, in the view, you can utilize the data:
        ?>

        You have selected <?= $color ?> icing for the cake.

    The :php:meth:`~Controller::set()` method also takes an associative array as its first
    parameter. This can often be a quick way to assign a set of
    information to the view.

    .. versionchanged:: 1.3
        Array keys will no longer be inflected before they are assigned
        to the view ('underscored\_key' does not become 'underscoredKey'
        anymore, etc.):

    ::

        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );

        // make $color, $type, and $base_price
        // available to the view:

        $this->set($data);


    The attribute ``$pageTitle`` no longer exists. Use :php:meth:`~Controller::set()` to set
    the title::

        $this->set('title_for_layout', 'This is the page title');


.. php:method:: render(string $view, string $layout)

    The :php:meth:`~Controller::render()` method is automatically called at the end of each
    requested controller action. This method performs all the view
    logic (using the data you've submitted using the :php:meth:`~Controller::set()` method),
    places the view inside its :php:attr:`~View::$layout`, and serves it back to the end
    user.

    The default view file used by render is determined by convention.
    If the ``search()`` action of the RecipesController is requested,
    the view file in /App/Template/Recipes/search.ctp will be rendered::

        class RecipesController extends AppController {
        // ...
            public function search() {
                // Render the view in /Template/Recipes/search.ctp
                $this->render();
            }
        // ...
        }

    Although CakePHP will automatically call it after every action's logic 
    (unless you've set ``$this->autoRender`` to false), you can
    use it to specify an alternate view file by specifying an action
    name in the controller using ``$action``.

    If ``$view`` starts with '/', it is assumed to be a view or
    element file relative to the ``/App/Template`` folder. This allows
    direct rendering of elements, very useful in AJAX calls.
    ::

        // Render the element in /Template/Element/ajaxreturn.ctp
        $this->render('/Element/ajaxreturn');

    The :php:attr:`~View::$layout` parameter allows you to specify the layout
    with which the view is rendered.

Rendering a Specific Template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller, you may want to render a different view than
the conventional one. You can do this by calling
:php:meth:`~Controller::render()` directly. Once you have called :php:meth:`~Controller::render()`, CakePHP
will not try to re-render the view::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('custom_file');
        }
    }

This would render ``app/Template/Posts/custom_file.ctp`` instead of
``app/Template/Posts/my_action.ctp``


You can also render views inside plugins using the following syntax:
``$this->render('PluginName.PluginController/custom_file')``.
For example::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('Users.UserDetails/custom_file');
        }
    }
    
This would render ``app/Plugin/Users/Template/UserDetails/custom_file.ctp``

Flow Control
------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    The flow control method you'll use most often is :php:meth:`~Controller::redirect()`.
    This method takes its first parameter in the form of a
    CakePHP-relative URL. When a user has successfully placed an order,
    you might wish to redirect them to a receipt screen.::

        public function place_order() {
            // Logic for finalizing order goes here
            if ($success) {
                return $this->redirect(
                    array('controller' => 'orders', 'action' => 'thanks')
                );
            }
            return $this->redirect(
                array('controller' => 'orders', 'action' => 'confirm')
            );
        }

    You can also use a relative or absolute URL as the $url argument::

        $this->redirect('/orders/thanks');
        $this->redirect('http://www.example.com');

    You can also pass data to the action::

        $this->redirect(array('action' => 'edit', $id));

    The second parameter of :php:meth:`~Controller::redirect()` allows you to define an HTTP
    status code to accompany the redirect. You may want to use 301
    (moved permanently) or 303 (see other), depending on the nature of
    the redirect.

    The method will issue an ``exit()`` after the redirect unless you
    set the third parameter to ``false``.

    If you need to redirect to the referer page you can use::

        $this->redirect($this->referer());

    The method also supports name-based parameters. If you want to redirect
    to a URL like: ``http://www.example.com/orders/confirm/product:pizza/quantity:5``
    you can use::

        $this->redirect(array(
            'controller' => 'orders',
            'action' => 'confirm',
            'product' => 'pizza',
            'quantity' => 5)
        );

    An example using query strings and hash would look like::

        $this->redirect(array(
            'controller' => 'orders',
            'action' => 'confirm',
            '?' => array(
                'product' => 'pizza',
                'quantity' => 5
            ),
            '#' => 'top')
        );

    The generated URL would be::

        http://www.example.com/orders/confirm?product=pizza&quantity=5#top

Other Useful Methods
--------------------

.. php:method:: constructClasses

    This method loads the models required by the controller. This
    loading process is done by CakePHP normally, but this method is
    handy to have when accessing controllers from a different
    perspective. If you need CakePHP in a command-line script or some
    other outside use, :php:meth:`~Controller::constructClasses()` may come in handy.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Returns the referring URL for the current request. Parameter
    ``$default`` can be used to supply a default URL to use if
    HTTP\_REFERER cannot be read from headers. So, instead of doing
    this::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    return $this->redirect($this->referer());
                }
                return $this->redirect(array('action' => 'index'));
            }
        }

    you can do this::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                return $this->redirect(
                    $this->referer(array('action' => 'index'))
                );
            }
        }

    If ``$default`` is not set, the function defaults to the root of
    your domain - '/'.

    Parameter ``$local`` if set to ``true``, restricts referring URLs
    to local server.

.. php:method:: disableCache

    Used to tell the user's **browser** not to cache the results of the
    current request. This is different than view caching, covered in a
    later chapter.

    The headers sent to this effect are::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: paginate()

    This method is used for paginating results fetched by your models.
    You can specify page sizes, model find conditions and more. See the
    :doc:`pagination <core-libraries/components/pagination>` section for more details on
    how to use paginate.

.. php:method:: requestAction(string $url, array $options)

    See the documentation for
    :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` for more
    information on this method.

.. php:method:: loadModel(string $modelClass, string $type)

    The ``loadModel`` function comes handy when you need to use a model
    table/collection that is not the controller's default one::

        $this->loadModel('Articles');
        $recentArticles = $this->Articles->find('all', [
            'limit' => 5,
            'order' => 'Articles.created DESC'
        ]);

    If you are using a table provider other than the built-in ORM you can
    link that table system into CakePHP's controllers by connecting its
    factory method::

        $this->modelFactory(
            'ElasticIndex',
            ['ElasticIndexes', 'factory']
        );

    After registering a table factory, you can use ``loadModel`` to load
    instances::

        $this->loadModel('Locations', 'ElasticIndex');

    .. note::

        The built-in ORM's TableRegistry is connected by default as the 'Table'
        provider.

Controller Attributes
=====================

For a complete list of controller attributes and their descriptions
visit the `CakePHP API <http://api.cakephp.org/2.4/class-Controller.html>`_.

.. php:attr:: name

    The :php:attr:`~Controller::$name` attribute should be set to the
    name of the controller. Usually this is just the plural form of the
    primary model the controller uses. This property can be omitted,
    but saves CakePHP from inflecting it::

        // $name controller attribute usage example
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }


$components, $helpers
---------------------

The next most often used controller attributes tell CakePHP what helpers,
components, and models you'll be using in conjunction with the current
controller. Using these attributes make MVC classes given by ``$components``
available and ``$uses`` available to the controller as class variables (``$this->ComponentName``, for
example) and those given by ``$helpers`` to the view as an object reference
variable (``$this->{$helpername}``).

.. note::

    Each controller has some of these classes available by default, so
    you may not need to configure your controller at all.

.. php:attr:: helpers

    The :php:class:`HtmlHelper`, :php:class:`FormHelper`, and :php:class:`SessionHelper` are available by
    default, as is the :php:class:`SessionComponent`. But if you choose to define
    your own :php:attr:`~Controller::$helpers` array in ``AppController``, make sure to include
    :php:class:`HtmlHelper` and :php:class:`FormHelper` if you want them still available by default
    in your Controllers. To learn more about these classes, be sure
    to check out their respective sections later in this manual.

    Let's look at how to tell a CakePHP :php:class:`Controller` that you plan to use
    additional MVC classes::

        class RecipesController extends AppController {
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Each of these variables are merged with their inherited values,
    therefore it is not necessary (for example) to redeclare the
    :php:class:`FormHelper`, or anything that is declared in your ``AppController``.

.. php:attr:: components

    The components array allows you to set which :doc:`/controllers/components`
    a controller will use. Like :php:attr:`~Controller::$helpers` and 
    :php:attr:`~Controller::$uses` components in your controllers are 
    merged with those in ``AppController``. As with
    :php:attr:`~Controller::$helpers` you can pass settings 
    into :php:attr:`~Controller::$components`. See :ref:`configuring-components` for more information.

Other Attributes
----------------

While you can check out the details for all controller attributes
in the `API <http://api.cakephp.org>`_, there are other controller attributes that merit their
own sections in the manual.

.. php:attr:: cacheAction

    The cacheAction attribute is used to define the duration and other
    information about full page caching. You can read more about
    full page caching in the :php:class:`CacheHelper` documentation.

.. php:attr:: paginate

    The paginate attribute is a deprecated compatibility property. Using it
    loads and configures the :php:class:`PaginatorComponent`. It is recommended
    that you update your code to use normal component settings::

        class ArticlesController extends AppController {
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
        }

.. todo::

    This chapter should be less about the controller API and more about
    examples, the controller attributes section is overwhelming and difficult to
    understand at first. The chapter should start with some example controllers
    and what they do.

More on Controllers
===================

.. toctree::
    :maxdepth: 1

    controllers/request-response
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=en: Controllers
    :keywords lang=en: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
