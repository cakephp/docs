# REST

REST is a foundational concept to the open web. CakePHP provides functionality
to build applications that expose REST APIs with low complexity abstractions and
interfaces.

CakePHP provides methods for exposing your controller actions via HTTP methods,
and serializing view variables based on content-type negotiation. Content-Type
negotiation allows clients of your application to send requests with serialize
data and receive responses with serialized data via the `Accept` and
`Content-Type` headers, or URL extensions.

## Getting Started

To get started with adding a REST API to your application, we'll first need
a controller containing actions that we want to expose as an API. A basic
controller might look something like this:

``` php
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
```

In our `RecipesController`, we have several actions that define the logic
to create, edit, view and delete recipes. In each of our actions we're using
the `serialize` option to tell CakePHP which view variables should be
serialized when making API responses. We'll connect our controller to the
application URLs with [Resource Routes](../development/routing#resource-routes):

``` php
// in config/routes.php
$routes->scope('/', function (RouteBuilder $routes): void {
    $routes->setExtensions(['json']);
    $routes->resources('Recipes');
});
```

These routes will enable URLs like `/recipes.json` to return a JSON encoded
response. Clients could also make a request to `/recipes` with the
`Content-Type: application/json` header as well.

## Encoding Response Data

In the above controller, we're defining a `viewClasses()` method. This method
defines which views your controller has available for content-negotitation.
We're including CakePHP's `JsonView` which enables JSON based responses. To
learn more about it and Xml based views see [JSON and XML views](../views/json-and-xml-views). is
used by CakePHP to select a view class to render a REST response with.

Next, we have several methods that expose basic logic to create, edit, view and
delete recipes. In each of our actions we're using the `serialize` option to
tell CakePHP which view variables should be serialized when making API
responses.

If we wanted to modify the data before it is converted into JSON we should not
define the `serialize` option, and instead use template files. We would place
the REST templates for our RecipesController inside **templates/Recipes/json**.

See the [Controller Viewclasses](../controllers#controller-viewclasses) for more information on how CakePHP's
response negotiation functionality.

## Parsing Request Bodies

Creating the logic for the edit action requires another step. Because our
resources are serialized as JSON it would be ergonomic if our requests also
contained the JSON representation.

In our `Application` class ensure the following is present:

``` php
$middlewareQueue->add(new BodyParserMiddleware());
```

This middleware will use the `content-type` header to detect the format of
request data and parse enabled formats. By default only `JSON` parsing is
enabled by default. You can enable XML support by enabling the `xml`
constructor option. When a request is made with a `Content-Type` of
`application/json`, CakePHP will decode the request data and update the
request so that `$request->getData()` contains the parsed body.

You can also wire in additional deserializers for alternate formats if you
need them, using `BodyParserMiddleware::addParser()`.
