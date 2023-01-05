REST
####

Many newer application programmers are realizing the need to open their core
functionality to a greater audience. Providing unfettered access to your
core API can help get your platform accepted, and allows for mashups and
integration with other systems.

While other solutions exist, REST is a great way to provide access to the
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
    use Cake\View\JsonView;

    class RecipesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all')->all();
            $this->set('recipes', $recipes);
            $this->viewBuilder()->setOption('serialize', ['recipes']);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set('recipe', $recipe);
            $this->viewBuilder()->setOption('serialize', ['recipe']);
        }

        public function add()
        {
            $this->request->allowMethod(['post', 'put']);
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function edit($id)
        {
            $this->request->allowMethod(['patch', 'post', 'put']);
            $recipe = $this->Recipes->get($id);
            $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function delete($id)
        {
            $this->request->allowMethod(['delete']);
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set('message', $message);
            $this->viewBuilder()->setOption('serialize', ['message']);
        }
    }


RESTful controllers often use parsed extensions to serve up different views
based on different kinds of requests. We're defining the content-type based
views we support in this controller. We're including CakePHP's ``JsonView``. To
learn more about it and Xml based views see :doc:`/views/json-and-xml-views`. By
using  :php:class:`JsonView` we can define a ``serialize`` option. This option
is used to define which view variables ``JsonView`` should serialize into JSON.

If we wanted to modify the data before it is converted into JSON we should not
define the ``serialize`` option, and instead use template files. We place
the REST views for our RecipesController inside **templates/Recipes/json**.

Creating the logic for the edit action requires another step. Because our
resources are serialized as JSON it would be ergonomic if our requests also
contained the JSON representation.

In our ``Application`` class ensure the following is present::

    $middlewareQueue->add(new BodyParserMiddleware());

This middleware will use the ``content-type`` header to detect the format of
request data and parse enabled formats. By default only ``JSON`` parsing is
enabled by default. You can enable XML support by enabling the ``xml``
constructor option.

Accepting Input in Other Formats
================================

Typically REST applications not only output content in alternate data formats,
but also accept data in different formats. In CakePHP, the
:php:class:`BodyParserMiddleware` helps facilitate this. By default,
it will decode any incoming JSON/XML input data for POST/PUT requests
and supply the array version of that data in ``$this->request->getData()``.
You can also wire in additional deserializers for alternate formats if you
need them, using :php:meth:`BodyParserMiddleware::addParser()`.

RESTful Routing
===============

CakePHP's Router lets you connect RESTful resource routes with a fluent
interface. See the section on :ref:`resource-routes` for more information.

.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,access,config,soap,recipes,logic,audience,cakephp,running,api
