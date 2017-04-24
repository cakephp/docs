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

    // Controller/RecipesController.php
    class RecipesController extends AppController {

        public $components = array('RequestHandler');

        public function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(array(
                'recipes' => $recipes,
                '_serialize' => array('recipes')
            ));
        }

        public function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(array(
                'recipe' => $recipe,
                '_serialize' => array('recipe')
            ));
        }
        
        public function add() {
            $this->Recipe->create();
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }
    }

Since we've added a call to :php:meth:`Router::parseExtensions()`,
the CakePHP router is already primed to serve up different views based on
different kinds of requests. Since we're dealing with REST
requests, we'll be making XML views. You can also easily make JSON views using
CakePHP's built-in :doc:`/views/json-and-xml-views`. By using the built in
:php:class:`XmlView` we can define a ``_serialize`` view variable. This special
view variable is used to define which view variables ``XmlView`` should
serialize into XML.

If we wanted to modify the data before it is converted into XML we should not
define the ``_serialize`` view variable, and instead use view files. We place
the REST views for our RecipesController inside ``app/View/recipes/xml``. We can also use
the :php:class:`Xml` for quick-and-easy XML output in those views. Here's what
our index view might look like::

    // app/View/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(array('response' => $recipes));
    echo $xml->asXML();

When serving up a specific content type using parseExtensions(),
CakePHP automatically looks for a view helper that matches the type.
Since we're using XML as the content type, there is no built-in helper,
however if you were to create one it would automatically be loaded
for our use in those views.

The rendered XML will end up looking something like this::

    <recipes>
        <recipe id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="Yummy yummmy"></comment>
        </recipe>
        <recipe id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this tasty dish."></comment>
        </recipe>
    </recipes>

Creating the logic for the edit action is a bit trickier, but not
by much. Since you're providing an API that outputs XML, it's a
natural choice to receive XML as input. Not to worry, the
:php:class:`RequestHandler` and :php:class:`Router` classes make
things much easier. If a POST or PUT request has an XML content-type,
then the input is run through  CakePHP's :php:class:`Xml` class, and the
array representation of the data is assigned to `$this->request->data`.
Because of this feature, handling XML and POST data in parallel
is seamless: no changes are required to the controller or model code.
Everything you need should end up in ``$this->request->data``.

Accepting Input in Other Formats
================================

Typically REST applications not only output content in alternate data formats,
but also accept data in different formats. In CakePHP, the
:php:class:`RequestHandlerComponent` helps facilitate this. By default,
it will decode any incoming JSON/XML input data for POST/PUT requests
and supply the array version of that data in `$this->request->data`.
You can also wire in additional deserializers for alternate formats if you
need them, using :php:meth:`RequestHandler::addInputType()`.

Modifying the default REST routes
=================================

.. versionadded:: 2.1

If the default REST routes don't work for your application, you can modify them
using :php:meth:`Router::resourceMap()`. This method allows you to set the
default routes that get set with :php:meth:`Router::mapResources()`. When using
this method you need to set *all* the defaults you want to use::

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

.. _custom-rest-routing:

Custom REST Routing
===================

If the default routes created by :php:meth:`Router::mapResources()` don't work
for you, use the :php:meth:`Router::connect()` method to define a custom set of
REST routes. The ``connect()`` method allows you to define a number of different
options for a given URL. See the section on :ref:`route-conditions` for more information.

.. versionadded:: 2.5

You can provide ``connectOptions`` key in the ``$options`` array for
:php:meth:`Router::mapResources()` to provide custom setting used by
:php:meth:`Router::connect()`::

    Router::mapResources('books', array(
        'connectOptions' => array(
            'routeClass' => 'ApiRoute',
        )
    ));

.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
