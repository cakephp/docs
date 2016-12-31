Controllers
###########

 

Introduction
============

A controller is used to manage the logic for a part of your application.
Most commonly, controllers are used to manage the logic for a single
model. For example, if you were building a site for an online bakery,
you might have a RecipesController and a IngredientsController managing
your recipes and their ingredients. In CakePHP, controllers are named
after the model they handle, in plural form.

The Recipe model is handled by the RecipesController, the Product model
is handled by the ProductsController, and so on.

Your application's controllers are classes that extend the CakePHP
AppController class, which in turn extends a core Controller class,
which are part of the CakePHP library. The AppController class can be
defined in /app/app\_controller.php and it should contain methods that
are shared between all of your application’s controllers.

Controllers can include any number of methods which are usually referred
to as *actions*. Actions are controller methods used to display views.
An action is a single method of a controller.

CakePHP’s dispatcher calls actions when an incoming request matches a
URL to a controller’s action (refer to :doc:`/The-Manual/Developing-with-CakePHP/Configuration` for an explanation on
how controller actions and parameters are mapped from the URL).

Returning to our online bakery example, our RecipesController might
contain the ``view()``, ``share()``, and ``search()`` actions. The
controller would be found in /app/controllers/recipes\_controller.php
and contain:

::

        <?php
        
        # /app/controllers/recipes_controller.php

        class RecipesController extends AppController {
            function view($id)     {
                //action logic goes here..
            }

            function share($customer_id, $recipe_id) {
                //action logic goes here..
            }

            function search($query) {
                //action logic goes here..
            }
        }

        ?>

In order for you to use a controller effectively in your own
application, we’ll cover some of the core attributes and methods
provided by CakePHP’s controllers.

The App Controller
==================

As stated in the introduction, the AppController class is the parent
class to all of your application's controllers. AppController itself
extends the Controller class included in the CakePHP core library.

As such, AppController is defined in
/cake/libs/controller/app\_controller.php or /app/app\_controller.php.
If /app/app\_controller.php does not exist then copy from /cake location
before customizing for application.

Do not customize cake frameworks controller:
/cake/libs/controller/app\_controller.php. These changes will be
overwritten during upgrades.

It contains a skeleton definition:

::

    <?php
    class AppController extends Controller {
    }
    ?>

Controller attributes and methods created in your AppController will be
available to all of your application's controllers. It is the ideal
place to create code that is common to all of your controllers.
Components (which you'll learn about later) are best used for code that
is used in many (but not necessarily all) controllers.

While normal object-oriented inheritance rules apply, CakePHP also does
a bit of extra work when it comes to special controller attributes, like
the list of components or helpers used by a controller. In these cases,
AppController value arrays are merged with child controller class
arrays.

CakePHP merges the following variables from the AppController to your
application's controllers:

-  $components
-  $helpers
-  $uses

Remember to add the default Html and Form helpers, if you define var
$helpers in your AppController

Please also remember to call AppController's callbacks within child
controller callbacks for best results:

::

    function beforeFilter(){
        parent::beforeFilter();
    }

The Pages Controller
====================

CakePHP core ships with a default controller called the Pages Controller
(cake/libs/controller/pages\_controller.php). The home page you see
after installation is generated using this controller. It is generally
used to serve static pages. Eg. If you make a view file
app/views/pages/about\_us.ctp you can access it using url
http://example.com/pages/about\_us

When you "bake" an app using CakePHP's console utility the pages
controller is copied to your app/controllers/ folder and you can modify
it to your needs if required. Or you could just copy the
pages\_controller.php from core to your app.

Do not directly modify ANY file under the ``cake`` folder to avoid
issues when updating the core in future

Controller Attributes
=====================

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`https://api.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_.

$name
-----

PHP4 users should start out their controller definitions using the
``$name`` attribute. The ``$name`` attribute should be set to the name
of the controller. Usually this is just the plural form of the primary
model the controller uses. This takes care of some PHP4 classname
oddities and helps CakePHP resolve naming.

::

    <?php

    #   $name controller attribute usage example

    class RecipesController extends AppController {
       var $name = 'Recipes';
    }

    ?>   

$components, $helpers and $uses
-------------------------------

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with the
current controller. Using these attributes make MVC classes given by
``$components`` and ``$uses`` available to the controller as class
variables (``$this->ModelName``, for example) and those given by
``$helpers`` to the view as an object reference variable
(``$helpername``).

Each controller has some of these classes available by default, so you
may not need to configure your controller at all.

Controllers have access to their primary model available by default. Our
RecipesController will have the Recipe model class available at
``$this->Recipe``, and our ProductsController also features the Product
model at ``$this->Product``. However, when allowing a controller to
access additional models through the ``$uses`` variable, the name of the
current controller's model must also be included. This is illustrated in
the example below.

The ``Html`` and ``Form`` Helpers are always available by default. But
if you choose to define your own $helpers array in AppController, make
sure to include ``Html`` and ``Form`` if you want them still available
by default in your own Controllers. The Session Helper and Component may
be useful to manage sessions and state in your application. To learn
more about these classes, be sure to check out their respective sections
later in this manual.

Let’s look at how to tell a CakePHP controller that you plan to use
additional MVC classes.

::

    <?php
    class RecipesController extends AppController {
        var $name = 'Recipes';

        var $uses = array('Recipe', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>   

Each of these variables are merged with their inherited values,
therefore it is not necessary (for example) to redeclare the Form
helper, or anything that is declared in your App controller.

If you do not wish to use a Model in your controller, set
``var $uses = array()``. This will allow you to use a controller without
a need for a corresponding Model file.

It's bad practice to just add all the models your controller uses to the
``$uses`` array. Check
:doc:`/The-Manual/Developing-with-CakePHP/Models` to see how to
properly access associated and unassociated models respectively.

Page-related Attribute: $layout
-------------------------------

A few attributes exist in CakePHP controllers that give you control over
how your view is set inside of a layout.

The ``$layout`` attribute can be set to the name of a layout saved in
/app/views/layouts. You specify a layout by setting ``$layout`` equal to
the name of the layout file minus the .ctp extension. If this attribute
has not been defined, CakePHP renders the default layout, default.ctp.
If you haven’t defined one at /app/views/layouts/default.ctp, CakePHP’s
core default layout will be rendered.

::

    <?php

    //   Using $layout to define an alternate layout

    class RecipesController extends AppController {
        function quickSave() {
            $this->layout = 'ajax';
        }
    }

    ?>

The Parameters Attribute ($params)
----------------------------------

Controller parameters are available at ``$this->params`` in your CakePHP
controller. This variable is used to provide access to information about
the current request. The most common usage of ``$this->params`` is to
get access to information that has been handed to the controller via
POST or GET operations.

form
~~~~

``$this->params['form']``

Any POST data from any form is stored here, including information also
found in ``$_FILES``.

admin
~~~~~

``$this->params['admin']``

Is set to 1 if the current action was invoked via admin routing.

bare
~~~~

``$this->params['bare']``

Stores 1 if the current layout is empty, 0 if not.

isAjax
~~~~~~

``$this->params['isAjax']``

Stores 1 if the current request is an ajax call, 0 if not. This variable
is only set if the RequestHandler Component is being used in the
controller.

controller
~~~~~~~~~~

``$this->params['controller']``

Stores the name of the current controller handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['controller']`` would equal "posts".

action
~~~~~~

``$this->params['action']``

Stores the name of the current action handling the request. For example,
if the URL /posts/view/1 was requested, ``$this->params['action']``
would equal "view".

pass
~~~~

``$this->params['pass']``

Returns an array (numerically indexed) of URL parameters after the
Action.

::

    // URL: /posts/view/12/print/narrow

    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
~~~

``$this->params['url']``

Stores the current URL requested, along with key-value pairs of get
variables. For example, if the URL /posts/view/?var1=3&var2=4 was
called, ``$this->params['url']`` would contain:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

Used to handle POST data sent from the FormHelper forms to the
controller.

::

    // The FormHelper is used to create a form element:
    echo $this->Form->text('User.first_name');

Which when rendered, looks something like:

::

     
    <input name="data[User][first_name]" value="" type="text" />

When the form is submitted to the controller via POST, the data shows up
in ``this->data``

::

     
    //The submitted first name can be found here:
    $this->data['User']['first_name'];

prefix
~~~~~~

``$this->params['prefix']``

Set to the routing prefix. For example, this attribute would contain the
string "admin" during a request to /admin/posts/someaction.

named
~~~~~

``$this->params['named']``

Stores any named parameters in the url query string in the form
/key:value/. For example, if the URL /posts/view/var1:3/var2:4 was
requested, ``$this->params['named']`` would be an array containing:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Other Attributes
----------------

While you can check out the details for all controller attributes in the
API, there are other controller attributes that merit their own sections
in the manual.

The $cacheAction attribute aids in caching views, and the $paginate
attribute is used to set pagination defaults for the controller. For
more information on how to use these attributes, check out their
respective sections later on in this manual.

persistModel
------------

Stub. Update Me!

Used to create cached instances of models a controller uses. When set to
true, all models related to the controller will be cached. This can
increase performance in many cases.

Controller Methods
==================

For a complete list of controller methods and their descriptions visit
the CakePHP API. Check out
`http://api13.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_.

Interacting with Views
----------------------

Controllers interact with the view in a number of ways. First they are
able to pass data to the views, using ``set()``. You can also decide
which view class to use, and which view file should be rendered from the
controller.

set
~~~

``set(string $var, mixed $value)``

The ``set()`` method is the main way to send data from your controller
to your view. Once you've used ``set()``, the variable can be accessed
in your view.

::

    <?php
        
    //First you pass data from the controller:

    $this->set('color', 'pink');

    //Then, in the view, you can utilize the data:
    ?>

    You have selected <?php echo $color; ?> icing for the cake.

The ``set()`` method also takes an associative array as its first
parameter. This can often be a quick way to assign a set of information
to the view.

Array keys will no longer be inflected before they are assigned to the
view ('underscored\_key' does not become 'underscoredKey' anymore,
etc.):

::

    <?php
        
    $data = array(
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95
    );

    //make $color, $type, and $base_price 
    //available to the view:

    $this->set($data);  

    ?>

The attribute ``$pageTitle`` no longer exists, use ``set()`` to set the
title

::

    <?php
    $this->set('title_for_layout', 'This is the page title');
    ?>

render
~~~~~~

``render(string $action, string $layout, string $file)``

The ``render()`` method is automatically called at the end of each
requested controller action. This method performs all the view logic
(using the data you’ve given in using the ``set()`` method), places the
view inside its layout and serves it back to the end user.

The default view file used by render is determined by convention. If the
``search()`` action of the RecipesController is requested, the view file
in /app/views/recipes/search.ctp will be rendered.

::

    class RecipesController extends AppController {
    ...
        function search() {
            // Render the view in /views/recipes/search.ctp
            $this->render();
        }
    ...
    }

Although CakePHP will automatically call it (unless you’ve set
``$this->autoRender`` to false) after every action’s logic, you can use
it to specify an alternate view file by specifying an action name in the
controller using ``$action``.

If ``$action`` starts with '/' it is assumed to be a view or element
file relative to the ``/app/views`` folder. This allows direct rendering
of elements, very useful in ajax calls.

::

    // Render the element in /views/elements/ajaxreturn.ctp
    $this->render('/elements/ajaxreturn');

You can also specify an alternate view or element file using the third
parameter, ``$file``. When using ``$file``, don't forget to utilize a
few of CakePHP’s global constants (such as ``VIEWS``).

The ``$layout`` parameter allows you to specify the layout the view is
rendered in.

Rendering a specific view
~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller you may want to render a different view than what
would conventionally be done. You can do this by calling ``render()``
directly. Once you have called ``render()`` CakePHP will not try to
re-render the view.

::

    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

This would render ``app/views/posts/custom_file.ctp`` instead of
``app/views/posts/my_action.ctp``

Flow Control
------------

redirect
~~~~~~~~

``redirect(mixed $url, integer $status, boolean $exit)``

The flow control method you’ll use most often is ``redirect()``. This
method takes its first parameter in the form of a CakePHP-relative URL.
When a user has successfully placed an order, you might wish to redirect
them to a receipt screen.

::

    function placeOrder() {

        //Logic for finalizing order goes here

        if($success) {
            $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
        } else {
            $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
        }
    }

You can also use a relative or absolute URL as the $url argument:

::

    $this->redirect('/orders/thanks');
    $this->redirect('http://www.example.com');

You can also pass data to the action:

::

    $this->redirect(array('action' => 'edit', $id));

The second parameter of ``redirect()`` allows you to define an HTTP
status code to accompany the redirect. You may want to use 301 (moved
permanently) or 303 (see other), depending on the nature of the
redirect.

The method will issue an ``exit()`` after the redirect unless you set
the third parameter to ``false``.

If you need to redirect to the referer page you can use:

::

    $this->redirect($this->referer());

flash
~~~~~

``flash(string $message, string $url, integer $pause, string $layout)``

Like ``redirect()``, the ``flash()`` method is used to direct a user to
a new page after an operation. The ``flash()`` method is different in
that it shows a message before passing the user on to another URL.

The first parameter should hold the message to be displayed, and the
second parameter is a CakePHP-relative URL. CakePHP will display the
``$message`` for ``$pause`` seconds before forwarding the user on.

If there's a particular template you'd like your flashed message to use,
you may specify the name of that layout in the ``$layout`` parameter.

For in-page flash messages, be sure to check out SessionComponent’s
setFlash() method.

Callbacks
---------

CakePHP controllers come fitted with callbacks you can use to insert
logic just before or after controller actions are rendered.

``beforeFilter()``

This function is executed before every action in the controller. It's a
handy place to check for an active session or inspect user permissions.

``beforeRender()``

Called after controller action logic, but before the view is rendered.
This callback is not used often, but may be needed if you are calling
render() manually before the end of a given action.

``afterFilter()``

Called after every controller action, and after rendering is complete.
This is the last controller method to run.

CakePHP also supports callbacks related to scaffolding.

``_beforeScaffold($method)``

$method name of method called example index, edit, etc.

``_afterScaffoldSave($method)``

$method name of method called either edit or update.

``_afterScaffoldSaveError($method)``

$method name of method called either edit or update.

``_scaffoldError($method)``

$method name of method called example index, edit, etc.

Other Useful Methods
--------------------

constructClasses
~~~~~~~~~~~~~~~~

This method loads the models required by the controller. This loading
process is done by CakePHP normally, but this method is handy to have
when accessing controllers from a different perspective. If you need
CakePHP in a command-line script or some other outside use,
constructClasses() may come in handy.

referer
~~~~~~~

``string referer(mixed $default = null, boolean $local = false)``

Returns the referring URL for the current request. Parameter
``$default`` can be used to supply a default URL to use if HTTP\_REFERER
cannot be read from headers. So, instead of doing this:

::

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
    ?>

you can do this:

::

    <?php
    class UserController extends AppController {
        function delete($id) {
            // delete code goes here, and then...
            $this->redirect($this->referer(array('action' => 'index')));
        }
    }
    ?>

If ``$default`` is not set, the function defaults to the root of your
domain - '/'.

Parameter ``$local`` if set to ``true``, restricts referring URLs to
local server.

disableCache
~~~~~~~~~~~~

Used to tell the user’s **browser** not to cache the results of the
current request. This is different than view caching, covered in a later
chapter.

The headers sent to this effect are:

``Expires: Mon, 26 Jul 1997 05:00:00 GMT``

``Last-Modified: [current datetime] GMT``

``Cache-Control: no-store, no-cache, must-revalidate``

``Cache-Control: post-check=0, pre-check=0``

``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $data, mixed $op, string $bool, boolean $exclusive)``

Use this method to turn a set of POSTed model data (from
HtmlHelper-compatible inputs) into a set of find conditions for a model.
This function offers a quick shortcut on building search logic. For
example, an administrative user may want to be able to search orders in
order to know which items need to be shipped. You can use CakePHP’s
Form- and HtmlHelpers to create a quick form based on the Order model.
Then a controller action can use the data posted from that form to craft
find conditions:

::

    function index() {
        $conditions = $this->postConditions($this->data);
        $orders = $this->Order->find("all",compact('conditions'));
        $this->set('orders', $orders);
    }

If $this->data[‘Order’][‘destination’] equals “Old Towne Bakery”,
postConditions converts that condition to an array compatible for use in
a Model->find() method. In this case, array(“Order.destination” => “Old
Towne Bakery”).

If you want use a different SQL operator between terms, supply them
using the second parameter.

::

    /*
    Contents of $this->data
    array(
        'Order' => array(
            'num_items' => '4',
            'referrer' => 'Ye Olde'
        )
    )
    */

    //Let’s get orders that have at least 4 items and contain ‘Ye Olde’
    $conditions=$this->postConditions(
        $this->data,
        array(
            'num_items' => '>=', 
            'referrer' => 'LIKE'
        )
    );
    $orders = $this->Order->find("all",compact('conditions'));

The third parameter allows you to tell CakePHP what SQL boolean operator
to use between the find conditions. String like ‘AND’, ‘OR’ and ‘XOR’
are all valid values.

Finally, if the last parameter is set to true, and the $op parameter is
an array, fields not included in $op will not be included in the
returned conditions.

paginate
~~~~~~~~

This method is used for paginating results fetched by your models. You
can specify page sizes, model find conditions and more. See the
`pagination </view/164/pagination>`_ section for more details on how to
use paginate.

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $options)``

This function calls a controller's action from any location and returns
data from the action. The ``$url`` passed is a CakePHP-relative URL
(/controllername/actionname/params). To pass extra data to the receiving
controller action add to the $options array.

You can use ``requestAction()`` to retrieve a fully rendered view by
passing 'return' in the options:
``requestAction($url, array('return'));``. It is important to note that
making a requestAction using 'return' from a controller method can cause
script and css tags to not work correctly.

If used without caching ``requestAction`` can lead to poor performance.
It is rarely appropriate to use in a controller or model.

``requestAction`` is best used in conjunction with (cached) elements –
as a way to fetch data for an element before rendering. Let's use the
example of putting a "latest comments" element in the layout. First we
need to create a controller function that will return the data.

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            $comments = $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            if (!empty($this->params['requested'])) {
                return $comments;
            } else {
                $this->set(compact('comments'));
            }
        }
    }

When an action is called through requestAction
``$this->params['requested']`` is set to 1 as an indicator. So checking
that you can either return the required data else set it a view variable
like you normally would. This helps keep things DRY.

If we now create a simple element to call that function:

::

    // views/elements/latest_comments.ctp

    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

We can then place that element anywhere at all to get the output using:

::

    echo $this->element('latest_comments');

Written in this way, whenever the element is rendered, a request will be
made to the controller to get the data, the data will be processed, and
returned. However in accordance with the warning above it's best to make
use of element caching to prevent needless processing. By modifying the
call to element to look like this:

::

    echo $this->element('latest_comments', array('cache' => '+1 hour'));

The ``requestAction`` call will not be made while the cached element
view file exists and is valid.

In addition, requestAction now takes array based cake style urls:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('return'));

This allows the requestAction call to bypass the usage of Router::url
which can increase performance. The url based arrays are the same as the
ones that HtmlHelper::link uses with one difference - if you are using
named or passed parameters, you must put them in a second array and wrap
them with the correct key. This is because requestAction merges the
named args array (requestAction's 2nd parameter) with the
Controller::params member array and does not explicitly place the named
args array into the key 'named'; Additional members in the $option array
will also be made available in the requested action's Controller::params
array.

::

    echo $this->requestAction('/articles/featured/limit:3');
    echo $this->requestAction('/articles/view/5');

As an array in the requestAction would then be:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('named' => array('limit' => 3)));

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'view'), array('pass' => array(5)));

Unlike other places where array urls are analogous to string urls,
requestAction treats them differently.

When using an array url in conjunction with requestAction() you must
specify **all** parameters that you will need in the requested action.
This includes parameters like ``$this->data`` and
``$this->params['form']``. In addition to passing all required
parameters, named and pass parameters must be done in the second array
as seen above.

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

The ``loadModel`` function comes handy when you need to use a model
which is not the controller's default model or its associated model.

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();

