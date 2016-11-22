REST
####

Many newer application programmers are realizing the need to open their core
functionality to a greater audience. Providing easy, unfettered access to your
core API can help get your platform accepted, and allows for mashups and easy
integration with other systems.

While other solutions exist, REST is a great way to provide easy access to the
logic you've created in your application. It's simple, usually XML-based (we're
talking simple XML, nothing like a SOAP envelope), and depends on HTTP headers
for direction. Exposing an API via REST in CakePHP is simple.

The Simple Setup
================

The fastest way to get up and running with REST is to add a few lines to setup
:ref:`resource routes <resource-routes>` in your config/routes.php file.

Once the router has been set up to map REST requests to certain controller
actions, we can move on to creating the logic in our controller actions. A basic
controller might look something like this::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set([
                'recipes' => $recipes,
                '_serialize' => ['recipes']
            ]);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set([
                'recipe' => $recipe,
                '_serialize' => ['recipe']
            ]);
        }

        public function add()
        {
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
                '_serialize' => ['message', 'recipe']
            ]);
        }

        public function edit($id)
        {
            $recipe = $this->Recipes->get($id);
            if ($this->request->is(['post', 'put'])) {
                $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
                if ($this->Recipes->save($recipe)) {
                    $message = 'Saved';
                } else {
                    $message = 'Error';
                }
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }

        public function delete($id)
        {
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

RESTful controllers often use parsed extensions to serve up different views
based on different kinds of requests. Since we're dealing with REST requests,
we'll be making XML views. You can make JSON views using CakePHP's
built-in :doc:`/views/json-and-xml-views`. By using the built in
:php:class:`XmlView` we can define a ``_serialize`` view variable. This special
view variable is used to define which view variables ``XmlView`` should
serialize into XML.

If we wanted to modify the data before it is converted into XML we should not
define the ``_serialize`` view variable, and instead use template files. We place
the REST views for our RecipesController inside **src/Template/Recipes/xml**. We can also use
the :php:class:`Xml` for quick-and-easy XML output in those views. Here's what
our index view might look like::

    // src/Template/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();

When serving up a specific content type using :php:meth:`Cake\\Routing\\Router::extensions()`,
CakePHP automatically looks for a view helper that matches the type.
Since we're using XML as the content type, there is no built-in helper,
however if you were to create one it would automatically be loaded
for our use in those views.

The rendered XML will end up looking something like this::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

Creating the logic for the edit action is a bit trickier, but not by much. Since
you're providing an API that outputs XML, it's a natural choice to receive XML
as input. Not to worry, the
:php:class:`Cake\\Controller\\Component\\RequestHandler` and
:php:class:`Cake\\Routing\\Router` classes make things much easier. If a POST or
PUT request has an XML content-type, then the input is run through  CakePHP's
:php:class:`Xml` class, and the array representation of the data is assigned to
``$this->request->getData()``.  Because of this feature, handling XML and POST data in
parallel is seamless: no changes are required to the controller or model code.
Everything you need should end up in ``$this->request->getData()``.

Accepting Input in Other Formats
================================

Typically REST applications not only output content in alternate data formats,
but also accept data in different formats. In CakePHP, the
:php:class:`RequestHandlerComponent` helps facilitate this. By default,
it will decode any incoming JSON/XML input data for POST/PUT requests
and supply the array version of that data in ``$this->request->getData()``.
You can also wire in additional deserializers for alternate formats if you
need them, using :php:meth:`RequestHandler::addInputType()`.

RESTful Routing
===============

CakePHP's Router makes connecting RESTful resource routes easy. See the section
on :ref:`resource-routes` for more information.

.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
