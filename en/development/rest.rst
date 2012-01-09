REST
####

Many newer application programmers are realizing the need to open
their core functionality to a greater audience. Providing easy,
unfettered access to your core API can help get your platform
accepted, and allows for mashups and easy integration with other
systems.

While other solutions exist, REST is a great way to provide easy
access to the logic you've created in your application. It's
simple, usually XML-based (we're talking simple XML, nothing like a
SOAP envelope), and depends on HTTP headers for direction. Exposing
an API via REST in CakePHP is simple.

The Simple Setup
================

The fastest way to get up and running with REST is to add a few
lines to your routes.php file, found in app/Config. The Router
object features a method called ``mapResources()``, that is used to set
up a number of default routes for REST access to your controllers.
Make sure ``mapResources()`` comes before ``require CAKE . 'Config' . DS . 'routes.php';``
and other routes which would override the routes.
If we wanted to allow REST access to a recipe database, we'd do
something like this::

    <?php
    //In app/Config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

The first line sets up a number of default routes for easy REST
access where method specifies the desired result format (e.g. xml,
json, rss). These routes are HTTP Request Method sensitive.

=========== ===================== ==============================
HTTP format URL.format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
=========== ===================== ==============================

CakePHP's Router class uses a number of different indicators to
detect the HTTP method being used. Here they are in order of
preference:


#. The *\_method* POST variable
#. The X\_HTTP\_METHOD\_OVERRIDE
#. The REQUEST\_METHOD header

The *\_method* POST variable is helpful in using a browser as a
REST client (or anything else that can do POST easily). Just set
the value of \_method to the name of the HTTP request method you
wish to emulate.

Once the router has been set up to map REST requests to certain
controller actions, we can move on to creating the logic in our
controller actions. A basic controller might look something like
this::

    <?php
    // Controller/RecipesController.php
    class RecipesController extends AppController {
    
        public $components = array('RequestHandler');
    
        function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(compact('recipes'));
        }
    
        function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(compact('recipe'));
        }
    
        function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    
        function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Since we've added a call to :php:meth:`Router::parseExtensions()`,
the CakePHP router is already primed to serve up different views based on
different kinds of requests. Since we're dealing with REST
requests, the view type is XML. We place the REST views for our
RecipesController inside ``app/View/recipes/xml``. We can also use
:php:class:`Xml` for quick-and-easy XML output in those views. Here's what
our index view might look like::

    // app/View/Recipes/xml/index.ctp
    
    <recipes>
        <?php
        $xml = Xml::build($recipes);
        echo $xml->saveXML();
        ?>
    </recipes>

When serving up a specific content type using parseExtensions(),
CakePHP automatically looks for a view helper that matches the type.
Since we're using XML as the content type, there is no built-in helper,
however if you were to create one it would automatically be loaded
for our use in those views.

The rendered XML will end up looking something like this::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="This is a comment for this post."></comment>
        </post>
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this post."></comment>
        </post>
    </posts>

Creating the logic for the edit action is a bit trickier, but not
by much. Since you're providing an API that outputs XML, it's a
natural choice to receive XML as input. Not to worry, the
:php:class:`RequestHandler` and :php:class:`Router` classes make
things much easier. If a POST or PUT request has an XML content-type,
then the input is run through  Cake's :php:class:`Xml` class, and the
array representation of the data is assigned to `$this->request->data`.
Because of this feature, handling XML and POST data in parallel
is seamless: no changes are required to the controller or model code.
Everything you need should end up in ``$this->request->data``.

Accepting input in other formats
================================

Typically REST applications not only output content in alternate data formats
they also accept data in different formats.  In CakePHP, the
:php:class:`RequestHandlerComponent` helps facilitate this.  By default
it will decode any incoming JSON/XML input data for POST/PUT requests
and supply the array version of that data in `$this->request->data`.
You can also wire in additional deserializers for alternate formats if you
need them, using :php:meth:`RequestHandler::addInputType()`

Modifing the default REST routes
================================

If the default REST routes dont' work for your application, you can modify them
using :php:meth:`Router::resourceMap()`.  This method allows you to set the
default routes that get set with :php:meth:`Router::mapResources()`.  When using
this method you need to set *all* the defaults you want to use::

    <?php
    Router::resourceMap(array(
        array('action' => 'index', 'method' => 'GET', 'id' => false),
        array('action' => 'view', 'method' => 'GET', 'id' => true),
        array('action' => 'add', 'method' => 'POST', 'id' => false),
        array('action' => 'edit', 'method' => 'PUT', 'id' => true),
        array('action' => 'delete', 'method' => 'DELETE', 'id' => true),
        array('action' => 'update', 'method' => 'POST', 'id' => true)
    ));

By overwriting the default resource map, future calls to ``mapResources()`` will
use the new values.


Custom REST Routing
===================

If the default routes created by :php:meth:`Router::mapResources()` don't work
for you, use the :php:meth:`Router::connect()` method to define a custom set of
REST routes. The ``connect()`` method allows you to define a number of different
options for a given URL. The first parameter is the URL itself, and the second
parameter allows you to supply those options. The third parameter allows you to
specify regex patterns to help CakePHP identify certain markers in the specified
URL.

We'll provide a simple example here, and allow you to tailor this
route for your other RESTful purposes. Here's what our edit REST
route would look like, without using :php:meth:`Router::mapResources()`::

    <?php
    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

Advanced routing techniques are covered elsewhere, so we'll focus
on the most important point for our purposes here: the [method] key
of the options array in the second parameter. Once that key has
been set, the specified route works only for that HTTP request
method (which could also be GET, DELETE, etc.)


.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
