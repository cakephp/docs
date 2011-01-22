3.5.4 Controller Methods
------------------------

For a complete list of controller methods and their descriptions
visit the CakePHP API. Check out
`http://api13.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_.

Interacting with Views
~~~~~~~~~~~~~~~~~~~~~~

Controllers interact with the view in a number of ways. First they
are able to pass data to the views, using ``set()``. You can also
decide which view class to use, and which view file should be
rendered from the controller.

set
^^^

``set(string $var, mixed $value)``

The ``set()`` method is the main way to send data from your
controller to your view. Once you've used ``set()``, the variable
can be accessed in your view.

::

    <?php
        
    //First you pass data from the controller:
    
    $this->set('color', 'pink');
    
    //Then, in the view, you can utilize the data:
    ?>
    
    You have selected <?php echo $color; ?> icing for the cake.

The ``set()`` method also takes an associative array as its first
parameter. This can often be a quick way to assign a set of
information to the view.

Array keys will be no longer be inflected before they are assigned
to the view ('underscored\_key' does not become 'underscoredKey'
anymore, etc.):

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

The attribute ``$pageTitle`` no longer exists, use ``set()`` to set
the title

::

    <?php
    $this->set('title_for_layout', 'This is the page title');
    ?>

render
^^^^^^

``render(string $action, string $layout, string $file)``

The ``render()`` method is automatically called at the end of each
requested controller action. This method performs all the view
logic (using the data you’ve given in using the ``set()`` method),
places the view inside its layout and serves it back to the end
user.

The default view file used by render is determined by convention.
If the ``search()`` action of the RecipesController is requested,
the view file in /app/views/recipes/search.ctp will be rendered.

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
``$this->autoRender`` to false) after every action’s logic, you can
use it to specify an alternate view file by specifying an action
name in the controller using ``$action``.

If ``$action`` starts with '/' it is assumed to be a view or
element file relative to the ``/app/views`` folder. This allows
direct rendering of elements, very useful in ajax calls.
::

    // Render the element in /views/elements/ajaxreturn.ctp
    $this->render('/elements/ajaxreturn');

You can also specify an alternate view or element file using the
third parameter, ``$file``. When using ``$file``, don't forget to
utilize a few of CakePHP’s global constants (such as ``VIEWS``).

The ``$layout`` parameter allows you to specify the layout the view
is rendered in.

Rendering a specific view
^^^^^^^^^^^^^^^^^^^^^^^^^

In your controller you may want to render a different view than
what would conventionally be done. You can do this by calling
``render()`` directly. Once you have called ``render()`` CakePHP
will not try to re-render the view.

::

    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

This would render ``app/views/posts/custom_file.ctp`` instead of
``app/views/posts/my_action.ctp``

Flow Control
~~~~~~~~~~~~

redirect
^^^^^^^^

``redirect(mixed $url, integer $status, boolean $exit)``

The flow control method you’ll use most often is ``redirect()``.
This method takes its first parameter in the form of a
CakePHP-relative URL. When a user has successfully placed an order,
you might wish to redirect them to a receipt screen.

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

    $this->redirect('/orders/thanks'));
    $this->redirect('http://www.example.com');

You can also pass data to the action:

::

    $this->redirect(array('action' => 'edit', $id));

The second parameter of ``redirect()`` allows you to define an HTTP
status code to accompany the redirect. You may want to use 301
(moved permanently) or 303 (see other), depending on the nature of
the redirect.

The method will issue an ``exit()`` after the redirect unless you
set the third parameter to ``false``.

If you need to redirect to the referer page you can use:
::

    $this->redirect($this->referer());

flash
^^^^^

``flash(string $message, string $url, integer $pause, string $layout)``

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
~~~~~~~~~

CakePHP controllers come fitted with callbacks you can use to
insert logic just before or after controller actions are rendered.

``beforeFilter()``

This function is executed before every action in the controller.
It's a handy place to check for an active session or inspect user
permissions.

``beforeRender()``

Called after controller action logic, but before the view is
rendered. This callback is not used often, but may be needed if you
are calling render() manually before the end of a given action.

``afterFilter()``

Called after every controller action, and after rendering is
complete. This is the last controller method to run.

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
~~~~~~~~~~~~~~~~~~~~

constructClasses
^^^^^^^^^^^^^^^^

This method loads the models required by the controller. This
loading process is done by CakePHP normally, but this method is
handy to have when accessing controllers from a different
perspective. If you need CakePHP in a command-line script or some
other outside use, constructClasses() may come in handy.

referer
^^^^^^^

``string referer(mixed $default = null, boolean $local = false)``

Returns the referring URL for the current request. Parameter
``$default`` can be used to supply a default URL to use if
HTTP\_REFERER cannot be read from headers. So, instead of doing
this:

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

If ``$default`` is not set, the function defaults to the root of
your domain - '/'.

Parameter ``$local`` if set to ``true``, restricts referring URLs
to local server.

disableCache
^^^^^^^^^^^^

Used to tell the user’s **browser** not to cache the results of the
current request. This is different than view caching, covered in a
later chapter.

The headers sent to this effect are:

``Expires: Mon, 26 Jul 1997 05:00:00 GMT``
``Last-Modified: [current datetime] GMT``
``Cache-Control: no-store, no-cache, must-revalidate``
``Cache-Control: post-check=0, pre-check=0``
``Pragma: no-cache``
postConditions
^^^^^^^^^^^^^^

``postConditions(array $data, mixed $op, string $bool, boolean $exclusive)``

Use this method to turn a set of POSTed model data (from
HtmlHelper-compatible inputs) into a set of find conditions for a
model. This function offers a quick shortcut on building search
logic. For example, an administrative user may want to be able to
search orders in order to know which items need to be shipped. You
can use CakePHP’s Form- and HtmlHelpers to create a quick form
based on the Order model. Then a controller action can use the data
posted from that form to craft find conditions:

::

    function index() {
        $conditions = $this->postConditions($this->data);
        $orders = $this->Order->find("all",compact('conditions'));
        $this->set('orders', $orders);
    }

If $this->data[‘Order’][‘destination’] equals “Old Towne Bakery”,
postConditions converts that condition to an array compatible for
use in a Model->find() method. In this case,
array(“Order.destination” => “Old Towne Bakery”).

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
    $condtions=$this->postConditions(
        $this->data,
        array(
            'num_items' => '>=', 
            'referrer' => 'LIKE'
        )
    );
    $orders = $this->Order->find("all",compact('condtions'));

The third parameter allows you to tell CakePHP what SQL boolean
operator to use between the find conditions. String like ‘AND’,
‘OR’ and ‘XOR’ are all valid values.

Finally, if the last parameter is set to true, and the $op
parameter is an array, fields not included in $op will not be
included in the returned conditions.

paginate
^^^^^^^^

This method is used for paginating results fetched by your models.
You can specify page sizes, model find conditions and more. See the
`pagination <http://docs.cakephp.org/view/164/pagination>`_ section for more details on
how to use paginate.

requestAction
^^^^^^^^^^^^^

``requestAction(string $url, array $options)``

This function calls a controller's action from any location and
returns data from the action. The ``$url`` passed is a
CakePHP-relative URL (/controllername/actionname/params). To pass
extra data to the receiving controller action add to the $options
array.

You can use ``requestAction()`` to retrieve a fully rendered view
by passing 'return' in the options:
``requestAction($url, array('return'));``. It is important to note
that making a requestAction using 'return' from a controller method
can cause script and css tags to not work correctly.

If used without caching ``requestAction`` can lead to poor
performance. It is rarely appropriate to use in a controller or
model.

``requestAction`` is best used in conjunction with (cached)
elements – as a way to fetch data for an element before rendering.
Let's use the example of putting a "latest comments" element in the
layout. First we need to create a controller function that will
return the data.

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
        }
    }

If we now create a simple element to call that function:

::

    // views/elements/latest_comments.ctp
    
    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

We can then place that element anywhere at all to get the output
using:

::

    echo $this->element('latest_comments');

Written in this way, whenever the element is rendered, a request
will be made to the controller to get the data, the data will be
processed, and returned. However in accordance with the warning
above it's best to make use of element caching to prevent needless
processing. By modifying the call to element to look like this:

::

    echo $this->element('latest_comments', array('cache' => '+1 hour'));

The ``requestAction`` call will not be made while the cached
element view file exists and is valid.

In addition, requestAction now takes array based cake style urls:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('return'));

This allows the requestAction call to bypass the usage of
Router::url which can increase performance. The url based arrays
are the same as the ones that HtmlHelper::link uses with one
difference - if you are using named or passed parameters, you must
put them in a second array and wrap them with the correct key. This
is because requestAction merges the named args array
(requestAction's 2nd parameter) with the Controller::params member
array and does not explicitly place the named args array into the
key 'named'; Additional members in the $option array will also be
made available in the requested action's Controller::params array.

::

    echo $this->requestAction('/articles/featured/limit:3');
    echo $this->requestAction('/articles/view/5');

As an array in the requestAction would then be:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('named' => array('limit' => 3)));
    
    echo $this->requestAction(array('controller' => 'articles', 'action' => 'view'), array('pass' => array(5)));

Unlike other places where array urls are analogous to string urls,
requestAction treats them differently.

When using an array url in conjunction with requestAction() you
must specify **all** parameters that you will need in the requested
action. This includes parameters like ``$this->data`` and
``$this->params['form']``. In addition to passing all required
parameters, named and pass parameters must be done in the second
array as seen above.

loadModel
^^^^^^^^^

``loadModel(string $modelClass, mixed $id)``

The ``loadModel`` function comes handy when you need to use a model
which is not the controller's default model or its associated
model.

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();
