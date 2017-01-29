Controllers
###########

Controllers are the 'C' in MVC. After routing has been applied and the correct
controller has been found, your controller's action is called.  Your controller
should handle interpreting the request data, making sure the correct models
are called, and the right response or view is rendered.  Controllers can be
thought of as middle man between the Model and View.  You want to keep your
controllers thin, and your models fat.  This will help you more easily reuse
your code and makes your code easier to test.

Commonly, controllers are used to manage the logic around a single model. For
example, if you were building a site for an on-line bakery, you might have a
RecipesController and an IngredientsController managing your recipes and their
ingredients.  In CakePHP, controllers are named after the primary model they
handle. It's totally possible to have controllers work with more than one model as
well.

Your application's controllers extend ``AppController`` class, which in turn
extends the core :php:class:`Controller` class. The AppController
class can be defined in ``/app/Controller/AppController.php`` and it should
contain methods that are shared between all of your application's controllers.

Controllers provide a number of methods which are called *actions*.  Actions are
methods on a controller that handle requests.  By default all public methods on
a controller are an action, and accessible from a url.  Actions are responsible
for interpreting the request and creating the response.  Usually responses are
in the form of a rendered view, but there are other ways to create responses as
well.


.. _app-controller:

The App Controller
==================

As stated in the introduction, the AppController class is the
parent class to all of your application's controllers.
AppController itself extends the Controller class included in the
CakePHP core library. As such, AppController is defined in
``/app/Controller/AppController.php`` like so::

    <?php
    class AppController extends Controller {
    }
    

Controller attributes and methods created in your AppController
will be available to all of your application's controllers. It is
the ideal place to create code that is common to all of your
controllers. Components (which you'll learn about later) are best
used for code that is used in many (but not necessarily all)
controllers.

While normal object-oriented inheritance rules apply, CakePHP
does a bit of extra work when it comes to special controller
attributes. The list of components and helpers used by a
controller are treated specially. In these cases, AppController
value arrays are merged with child controller class arrays. The values in the
child class will always override those in AppController.

.. note::

    CakePHP merges the following variables from the AppController to
    your application's controllers:

    -  $components
    -  $helpers
    -  $uses

Remember to add the default Html and Form helpers, if you define
var ``$helpers`` in your AppController

Please also remember to call AppController's callbacks within child
controller callbacks for best results::

    <?php
    function beforeFilter() {
        parent::beforeFilter();
    }
 
Request parameters
==================

When a request is made to a CakePHP application,  CakePHP's :php:class:`Router` and
:php:class:`Dispatcher` classes use :ref:`routes-configuration` to find and
create the correct controller. The request data is encapsulated into a request
object. CakePHP puts all of the important request information into the
``$this->request`` property.  See the section on
:ref:`cake-request` for more information on the CakePHP request
object.

Controller actions
==================

Controller actions are responsible for converting the request parameters into a
response for the browser/user making the request.  CakePHP uses conventions to
automate this process and remove some boiler-plate code you would otherwise need
to write.

By convention CakePHP renders a view with an inflected version of the action
name.  Returning to our online bakery example, our RecipesController might contain the
``view()``, ``share()``, and ``search()`` actions. The controller would be found
in ``/app/Controller/RecipesController.php`` and contain::

        <?php
        # /app/Controller/RecipesController.php
        
        class RecipesController extends AppController {
            function view($id) {
                //action logic goes here..
            }
        
            function share($customer_id, $recipe_id) {
                //action logic goes here..
            }
        
            function search($query) {
                //action logic goes here..
            }
        }

The view files for these actions would be ``app/View/Recipes/view.ctp``,
``app/View/Recipes/share.ctp``, and ``app/View/Recipes/share.ctp``.  The
conventional view file name is the lower cased and underscored version of the
action name.

Controller actions generally use :php:meth:`~Controller::set()` to create a
context that :php:class:`View` uses to render the view.  Because of the
conventions that CakePHP uses, you don' need to create and render the view
manually. Instead once a controller action has completed, CakePHP will handle
rendering and delivering the View.

If for some reason you'd like to skip the default behavior.  Both of the
following techniques will by-pass the default view rendering behavior.

* If you return a string, or an object that can be converted to a string from 
  your controller action, it will be used as the response body.
* You can return a :php:class:`CakeResponse` object with the completely created
  response.

When controller methods are used with :php:meth:`~Controller::requestAction()`
you will often want to return data that isn't a string.  If you have controller
methods that are used for normal web requests + requestAction you should check
the request type before returning::

    <?php
    class RecipesController extends AppController {
        function popular() {
            $popular = $this->Recipe->popular();
            if (!empty($this->request->params['requested'])) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

The above controller action is an example of how a method can be used with
``requestAction()`` and normal requests. Returning an array data to a
non-requestAction request will cause errors and should be avoided.  See the
section on :php:meth:`Controller::requestAction()` for more tips on using
``requestAction()``

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

.. _controller-life-cycle:

Request Life-cycle callbacks
============================

.. php:class:: Controller

CakePHP controllers come fitted with callbacks you can use to
insert logic around the request life-cycle:

.. php:method:: beforeFilter()

    This function is executed before every action in the controller.
    It's a handy place to check for an active session or inspect user
    permissions.

    .. note::

        The beforeFilter() method will be called for missing actions,
        and scaffolded actions.

.. php:method:: beforeRender()

    Called after controller action logic, but before the view is
    rendered. This callback is not used often, but may be needed if you
    are calling render() manually before the end of a given action.

.. php:method:: afterFilter()

    Called after every controller action, and after rendering is
    complete. This is the last controller method to run.

In addition to controller life-cycle callbacks, :doc:`/controllers/components`
also provide a similar set of callbacks.

.. _controller-methods:

Controller Methods
==================

For a complete list of controller methods and their descriptions
visit the CakePHP API. Check out
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

Interacting with Views
----------------------

Controllers interact with the view in a number of ways. First they
are able to pass data to the views, using ``set()``. You can also
decide which view class to use, and which view file should be
rendered from the controller.

.. php:method:: set(string $var, mixed $value)

    The ``set()`` method is the main way to send data from your
    controller to your view. Once you've used ``set()``, the variable
    can be accessed in your view::

        <?php
        // First you pass data from the controller:

        $this->set('color', 'pink');

        // Then, in the view, you can utilize the data:
        ?>

        You have selected <?php echo $color; ?> icing for the cake.

    The ``set()`` method also takes an associative array as its first
    parameter. This can often be a quick way to assign a set of
    information to the view.

    .. versionchanged:: 1.3
        Array keys will no longer be inflected before they are assigned
        to the view ('underscored\_key' does not become 'underscoredKey'
        anymore, etc.):

    ::

        <?php
        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );

        // make $color, $type, and $base_price 
        // available to the view:

        $this->set($data);  


    The attribute ``$pageTitle`` no longer exists, use ``set()`` to set
    the title::

        <?php
        $this->set('title_for_layout', 'This is the page title');


.. php:method:: render(string $action, string $layout, string $file)

    The ``render()`` method is automatically called at the end of each
    requested controller action. This method performs all the view
    logic (using the data you’ve given in using the ``set()`` method),
    places the view inside its layout and serves it back to the end
    user.

    The default view file used by render is determined by convention.
    If the ``search()`` action of the RecipesController is requested,
    the view file in /app/View/Recipes/search.ctp will be rendered::

        <?php
        class RecipesController extends AppController {
        // ...
            function search() {
                // Render the view in /View/Recipes/search.ctp
                $this->render();
            }
        // ...
        }

    Although CakePHP will automatically call it (unless you’ve set
    ``$this->autoRender`` to false) after every action’s logic, you can
    use it to specify an alternate view file by specifying an action
    name in the controller using ``$action``.

    If ``$action`` starts with '/' it is assumed to be a view or
    element file relative to the ``/app/View`` folder. This allows
    direct rendering of elements, very useful in ajax calls.
    ::

        <?php
        // Render the element in /View/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

    You can also specify an alternate view or element file using the
    third parameter, ``$file``. The ``$layout`` parameter allows you to specify
    the layout the view is rendered in.

Rendering a specific view
~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller you may want to render a different view than
what would conventionally be done. You can do this by calling
``render()`` directly. Once you have called ``render()`` CakePHP
will not try to re-render the view::

    <?php
    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

This would render ``app/View/Posts/custom_file.ctp`` instead of
``app/View/Posts/my_action.ctp``

Flow Control
------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    The flow control method you’ll use most often is ``redirect()``.
    This method takes its first parameter in the form of a
    CakePHP-relative URL. When a user has successfully placed an order,
    you might wish to redirect them to a receipt screen.::

        <?php
        function placeOrder() {
            // Logic for finalizing order goes here
            if ($success) {
                $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
            } else {
                $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
            }
        }

    You can also use a relative or absolute URL as the $url argument::

        <?php
        $this->redirect('/orders/thanks'));
        $this->redirect('http://www.example.com');

    You can also pass data to the action::

        <?php
        $this->redirect(array('action' => 'edit', $id));

    The second parameter of ``redirect()`` allows you to define an HTTP
    status code to accompany the redirect. You may want to use 301
    (moved permanently) or 303 (see other), depending on the nature of
    the redirect.

    The method will issue an ``exit()`` after the redirect unless you
    set the third parameter to ``false``.

    If you need to redirect to the referer page you can use::

        <?php
        $this->redirect($this->referer());

    The method also supports name based parameters. If you want to redirect
    to a URL like: ``http://www.example.com/orders/confirm/product:pizza/quantity:5``
    you can use::

        <?php
        $this->redirect(array('controller' => 'orders', 'action' => 'confirm', 'product' => 'pizza', 'quantity' => 5));

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    Like ``redirect()``, the ``flash()`` method is used to direct a
    user to a new page after an operation. The ``flash()`` method is
    different in that it shows a message before passing the user on to
    another URL.

    The first parameter should hold the message to be displayed, and
    the second parameter is a CakePHP-relative URL. CakePHP will
    display the ``$message`` for ``$pause`` seconds before forwarding
    the user on.

    If there's a particular template you'd like your flashed message to
    use, you may specify the name of that layout in the ``$layout``
    parameter.

    For in-page flash messages, be sure to check out SessionComponent’s
    setFlash() method.

Callbacks
---------

In addition to the :ref:`controller-life-cycle`.
CakePHP also supports callbacks related to scaffolding.

.. php:method:: beforeScaffold($method)

    $method name of method called example index, edit, etc.

.. php:method:: afterScaffoldSave($method)

    $method name of method called either edit or update.

.. php:method:: afterScaffoldSaveError($method)

    $method name of method called either edit or update.

.. php:method:: scaffoldError($method)

    $method name of method called example index, edit, etc.

Other Useful Methods
--------------------

.. php:method:: constructClasses

    This method loads the models required by the controller. This
    loading process is done by CakePHP normally, but this method is
    handy to have when accessing controllers from a different
    perspective. If you need CakePHP in a command-line script or some
    other outside use, constructClasses() may come in handy.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Returns the referring URL for the current request. Parameter
    ``$default`` can be used to supply a default URL to use if
    HTTP\_REFERER cannot be read from headers. So, instead of doing
    this::

        <?php
        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    $this->redirect($this->referer());
                } else {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }

    you can do this::

        <?php
        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    If ``$default`` is not set, the function defaults to the root of
    your domain - '/'.

    Parameter ``$local`` if set to ``true``, restricts referring URLs
    to local server.

.. php:method:: disableCache

    Used to tell the user’s **browser** not to cache the results of the
    current request. This is different than view caching, covered in a
    later chapter.

    The headers sent to this effect are::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    Use this method to turn a set of POSTed model data (from
    HtmlHelper-compatible inputs) into a set of find conditions for a
    model. This function offers a quick shortcut on building search
    logic. For example, an administrative user may want to be able to
    search orders in order to know which items need to be shipped. You
    can use CakePHP's :php:class:`FormHelper` and :php:class:`HtmlHelper`
    to create a quick form based on the Order model. Then a controller action
    can use the data posted from that form to craft find conditions::

        <?php
        function index() {
            $conditions = $this->postConditions($this->request->data);
            $orders = $this->Order->find('all', compact('conditions'));
            $this->set('orders', $orders);
        }

    If ``$this->request->data['Order']['destination']`` equals "Old Towne Bakery",
    postConditions converts that condition to an array compatible for
    use in a Model->find() method. In this case,
    ``array('Order.destination' => 'Old Towne Bakery')``.

    If you want to use a different SQL operator between terms, supply them
    using the second parameter::

        <?php
        /*
        Contents of $this->request->data
        array(
            'Order' => array(
                'num_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // Let's get orders that have at least 4 items and contain 'Ye Olde'
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=', 
                'referrer' => 'LIKE'
            )
        );
        $orders = $this->Order->find('all', compact('conditions'));

    The third parameter allows you to tell CakePHP what SQL boolean
    operator to use between the find conditions. Strings like ‘AND’,
    ‘OR’ and ‘XOR’ are all valid values.

    Finally, if the last parameter is set to true, and the $op
    parameter is an array, fields not included in $op will not be
    included in the returned conditions.

.. php:method:: paginate()

    This method is used for paginating results fetched by your models.
    You can specify page sizes, model find conditions and more. See the
    :doc:`pagination <core-libraries/components/pagination>` section for more details on
    how to use paginate.

.. php:method:: requestAction(string $url, array $options)

    This function calls a controller's action from any location and
    returns data from the action. The ``$url`` passed is a
    CakePHP-relative URL (/controllername/actionname/params). To pass
    extra data to the receiving controller action add to the $options
    array.

    .. note::

        You can use ``requestAction()`` to retrieve a fully rendered view
        by passing 'return' in the options:
        ``requestAction($url, array('return'));``. It is important to note
        that making a requestAction using 'return' from a controller method
        can cause script and css tags to not work correctly.

    .. warning::

        If used without caching ``requestAction`` can lead to poor
        performance. It is rarely appropriate to use in a controller or
        model.

    ``requestAction`` is best used in conjunction with (cached)
    elements – as a way to fetch data for an element before rendering.
    Let's use the example of putting a "latest comments" element in the
    layout. First we need to create a controller function that will
    return the data::

        <?php
        // Controller/CommentsController.php
        class CommentsController extends AppController {
            function latest() {
                if (empty($this->request->params['requested'])) {
                    throw new ForbiddenException();
                }
                return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            }
        }

    You should always include checks to make sure your requestAction methods are
    actually originating from ``requestAction``.  Failing to do so will allow
    requestAction methods to be directly accessible from a URL, which is
    generally undesirable.

    If we now create a simple element to call that function::

        <?php
        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    We can then place that element anywhere to get the output
    using::

        <?php
        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request
    will be made to the controller to get the data, the data will be
    processed, and returned. However in accordance with the warning
    above it's best to make use of element caching to prevent needless
    processing. By modifying the call to element to look like this::

        <?php
        echo $this->element('latest_comments', array('cache' => '+1 hour'));

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction now takes array based cake style urls::

        <?php
        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    This allows the requestAction call to bypass the usage of
    Router::url which can increase performance. The url based arrays
    are the same as the ones that :php:meth:`HtmlHelper::link()` uses with one
    difference - if you are using named or passed parameters, you must put them
    in a second array and wrap them with the correct key. This is because
    requestAction merges the named args array (requestAction's 2nd parameter)
    with the Controller::params member array and does not explicitly place the
    named args array into the key 'named'; Additional members in the ``$option``
    array will also be made available in the requested action's
    Controller::params array::
        
        <?php
        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        <?php
        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        Unlike other places where array urls are analogous to string urls,
        requestAction treats them differently.

    When using an array url in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, named and pass parameters must be done
    in the second array as seen above.


.. php:method:: loadModel(string $modelClass, mixed $id)

    The ``loadModel`` function comes handy when you need to use a model
    which is not the controller's default model or its associated
    model::
    
        <?php
        $this->loadModel('Article');
        $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

        $this->loadModel('User', 2);
        $user = $this->User->read();


Controller Attributes
=====================

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

.. php:attr:: name

    The ``$name`` attribute should be set to the
    name of the controller. Usually this is just the plural form of the
    primary model the controller uses. This property is not required,
    but saves CakePHP from inflecting it::

        <?php
        // $name controller attribute usage example
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }
        

$components, $helpers and $uses
-------------------------------

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by ``$components`` and ``$uses`` available to the controller
as class variables (``$this->ModelName``, for example) and those
given by ``$helpers`` to the view as an object reference variable
(``$this->{$helpername}``).

.. note::

    Each controller has some of these classes available by default, so
    you may not need to configure your controller at all.

.. php:attr:: uses

    Controllers have access to their primary model available by
    default. Our RecipesController will have the Recipe model class
    available at ``$this->Recipe``, and our ProductsController also
    features the Product model at ``$this->Product``. However, when
    allowing a controller to access additional models through the
    ``$uses`` variable, the name of the current controller's model must
    also be included. This is illustrated in the example below.

    If you do not wish to use a Model in your controller, set
    ``public $uses = array()``. This will allow you to use a controller
    without a need for a corresponding Model file.

.. php:attr:: helpers

    The Html, Form, and Session Helpers are available by
    default, as is the SessionComponent. But if you choose to define
    your own ``$helpers`` array in AppController, make sure to include
    ``Html`` and ``Form`` if you want them still available by default
    in your Controllers. To learn more about these classes, be sure
    to check out their respective sections later in this manual.

    Let’s look at how to tell a CakePHP controller that you plan to use
    additional MVC classes::

        <?php
        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Each of these variables are merged with their inherited values,
    therefore it is not necessary (for example) to redeclare the Form
    helper, or anything that is declared in your App controller.

.. php:attr:: components

    The components array allows you to set which :doc:`/controllers/components`
    a controller will use.  Like ``$helpers`` and ``$uses`` components in your 
    controllers are merged with those in ``AppController``.  As with
    ``$helpers`` you can pass settings into components.  See :ref:`configuring-components`
    for more information.

Other Attributes
----------------

While you can check out the details for all controller attributes
in the API, there are other controller attributes that merit their
own sections in the manual.

.. php:attr: cacheAction

    The cacheAction attribute is used to define the duration and other
    information about full page caching.  You can read more about
    full page caching in the :php:class:`CacheHelper` documentation.

.. php:attr: paginate

    The paginate attribute is a deprecated compatibility property.  Using it
    loads and configures the :php:class:`PaginatorComponent`.  It is recommended
    that you update your code to use normal component settings::

        <?php
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

    This chapter should be less about the controller api and more about
    examples, the controller attributes section is overwhelming and difficult to
    understand at first. The chapter should start with some example controllers
    and what they do.

More on controllers
===================

.. toctree::

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=en: Controllers
    :keywords lang=en: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
