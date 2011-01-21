4.10.1 The Simple Setup
-----------------------

The fastest way to get up and running with REST is to add a few
lines to your routes.php file, found in app/config. The Router
object features a method called mapResources(), that is used to set
up a number of default routes for REST access to your controllers.
If we wanted to allow REST access to a recipe database, we'd do
something like this:

::

    //In app/config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

The first line sets up a number of default routes for easy REST
access where method specifies the desired result format (e.g. xml,
json, rss). These routes are HTTP Request Method sensitive.

HTTP Method
URL*.method*
Controller action invoked
GET
/recipes*.method*
RecipesController::index()
GET
/recipes/*123.method*
RecipesController::view(123)
POST
/recipes*.method*
RecipesController::add()
PUT
/recipes/123*.method*
RecipesController::edit(123)
DELETE
/recipes/*123.method*
RecipesController::delete(123)
POST
/recipes/123*.method*
RecipesController::edit(123)
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
this:

::

    // controllers/recipes_controller.php
    
    class RecipesController extends AppController {
    
        var $components = array('RequestHandler');
    
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
            if ($this->Recipe->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    
        function delete($id) {
            if($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Since we've added a call to Router::parseExtensions(), the CakePHP
router is already primed to serve up different views based on
different kinds of requests. Since we're dealing with REST
requests, the view type is XML. We place the REST views for our
RecipesController inside app/views/recipes/xml. We can also use the
XmlHelper for quick-and-easy XML output in those views. Here's what
our index view might look like:

::

    // app/views/recipes/xml/index.ctp
    
    <recipes>
        <?php echo $xml->serialize($recipes); ?>
    </recipes>

Experienced CakePHP users might notice that we haven't included the
XmlHelper in our RecipesController $helpers array. This is on
purpose - when serving up a specific content type using
parseExtensions(), CakePHP automatically looks for a view helper
that matches the type. Since we're using XML as the content type,
the XmlHelper is automatically loaded up for our use in those
views.

The rendered XML will end up looking something like this:

::

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
natural choice to receive XML as input. Not to worry, however: the
RequestHandler and Router classes make things much easier. If a
POST or PUT request has an XML content-type, then the input is
taken and passed to an instance of Cake's Xml object, which is
assigned to the $data property of the controller. Because of this
feature, handling XML and POST data in parallel is seamless: no
changes are required to the controller or model code. Everything
you need should end up in $this->data.

A commonly-required serialization format is JSON, which would be
requested by using the ".json" extension in paths. Cake will
automatically attempt to find /views/layouts/json/default.ctp and
/views/[object]/json/[action].ctp which are not provided by
default. You will need to create these to accomodate your API's
specific needs. Additionally, you will need to parse any JSON sent
to the controller into the $this->data property. While this is not
built in to Cake, the Cake developer community has quite a bit of
sample code out there that should get you started.

4.10.1 The Simple Setup
-----------------------

The fastest way to get up and running with REST is to add a few
lines to your routes.php file, found in app/config. The Router
object features a method called mapResources(), that is used to set
up a number of default routes for REST access to your controllers.
If we wanted to allow REST access to a recipe database, we'd do
something like this:

::

    //In app/config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

The first line sets up a number of default routes for easy REST
access where method specifies the desired result format (e.g. xml,
json, rss). These routes are HTTP Request Method sensitive.

HTTP Method
URL*.method*
Controller action invoked
GET
/recipes*.method*
RecipesController::index()
GET
/recipes/*123.method*
RecipesController::view(123)
POST
/recipes*.method*
RecipesController::add()
PUT
/recipes/123*.method*
RecipesController::edit(123)
DELETE
/recipes/*123.method*
RecipesController::delete(123)
POST
/recipes/123*.method*
RecipesController::edit(123)
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
this:

::

    // controllers/recipes_controller.php
    
    class RecipesController extends AppController {
    
        var $components = array('RequestHandler');
    
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
            if ($this->Recipe->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    
        function delete($id) {
            if($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Since we've added a call to Router::parseExtensions(), the CakePHP
router is already primed to serve up different views based on
different kinds of requests. Since we're dealing with REST
requests, the view type is XML. We place the REST views for our
RecipesController inside app/views/recipes/xml. We can also use the
XmlHelper for quick-and-easy XML output in those views. Here's what
our index view might look like:

::

    // app/views/recipes/xml/index.ctp
    
    <recipes>
        <?php echo $xml->serialize($recipes); ?>
    </recipes>

Experienced CakePHP users might notice that we haven't included the
XmlHelper in our RecipesController $helpers array. This is on
purpose - when serving up a specific content type using
parseExtensions(), CakePHP automatically looks for a view helper
that matches the type. Since we're using XML as the content type,
the XmlHelper is automatically loaded up for our use in those
views.

The rendered XML will end up looking something like this:

::

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
natural choice to receive XML as input. Not to worry, however: the
RequestHandler and Router classes make things much easier. If a
POST or PUT request has an XML content-type, then the input is
taken and passed to an instance of Cake's Xml object, which is
assigned to the $data property of the controller. Because of this
feature, handling XML and POST data in parallel is seamless: no
changes are required to the controller or model code. Everything
you need should end up in $this->data.

A commonly-required serialization format is JSON, which would be
requested by using the ".json" extension in paths. Cake will
automatically attempt to find /views/layouts/json/default.ctp and
/views/[object]/json/[action].ctp which are not provided by
default. You will need to create these to accomodate your API's
specific needs. Additionally, you will need to parse any JSON sent
to the controller into the $this->data property. While this is not
built in to Cake, the Cake developer community has quite a bit of
sample code out there that should get you started.
