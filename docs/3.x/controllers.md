# Controllers

`class` Cake\\Controller\\**Controller**

Controllers are the 'C' in MVC. After routing has been applied and the correct
controller has been found, your controller's action is called. Your controller
should handle interpreting the request data, making sure the correct models
are called, and the right response or view is rendered. Controllers can be
thought of as middle layer between the Model and View. You want to keep your
controllers thin, and your models fat. This will help you reuse
your code and makes your code easier to test.

Commonly, a controller is used to manage the logic around a single model. For
example, if you were building a site for an online bakery, you might have a
RecipesController managing your recipes and an IngredientsController managing your
ingredients. However, it's also possible to have controllers work with more than
one model. In CakePHP, a controller is named after the primary model it
handles.

Your application's controllers extend the `AppController` class, which in turn
extends the core `Controller` class. The `AppController`
class can be defined in **src/Controller/AppController.php** and it should
contain methods that are shared between all of your application's controllers.

Controllers provide a number of methods that handle requests. These are called
*actions*. By default, each public method in
a controller is an action, and is accessible from a URL. An action is responsible
for interpreting the request and creating the response. Usually responses are
in the form of a rendered view, but there are other ways to create responses as
well.

<a id="app-controller"></a>

## The App Controller

As stated in the introduction, the `AppController` class is the parent class
to all of your application's controllers. `AppController` itself extends the
`Cake\Controller\Controller` class included in CakePHP.
`AppController` is defined in **src/Controller/AppController.php** as
follows:

``` php
namespace App\Controller;

use Cake\Controller\Controller;

class AppController extends Controller
{
}
```

Controller attributes and methods created in your `AppController` will be
available in all controllers that extend it. Components (which you'll
learn about later) are best used for code that is used in many (but not
necessarily all) controllers.

You can use your `AppController` to load components that will be used in every
controller in your application. CakePHP provides a `initialize()` method that
is invoked at the end of a Controller's constructor for this kind of use:

``` php
namespace App\Controller;

use Cake\Controller\Controller;

class AppController extends Controller
{
    public function initialize()
    {
        // Always enable the CSRF component.
        $this->loadComponent('Csrf');
    }
}
```

In addition to the `initialize()` method, the older `$components` property
will also allow you to declare which components should be loaded. While normal
object-oriented inheritance rules apply, the components and helpers used by
a controller are treated specially. In these cases, `AppController` property
values are merged with child controller class arrays. The values in the child
class will always override those in `AppController`.

## Request Flow

When a request is made to a CakePHP application, CakePHP's
`Cake\Routing\Router` and `Cake\Routing\Dispatcher`
classes use [Routes Configuration](development/routing#routes-configuration) to find and create the correct
controller instance. The request data is encapsulated in a request object.
CakePHP puts all of the important request information into the `$this->request`
property. See the section on [Cake Request](controllers/request-response#cake-request) for more information on the
CakePHP request object.

## Controller Actions

Controller actions are responsible for converting the request parameters into a
response for the browser/user making the request. CakePHP uses conventions to
automate this process and remove some boilerplate code you would otherwise need
to write.

By convention, CakePHP renders a view with an inflected version of the action
name. Returning to our online bakery example, our RecipesController might contain the
`view()`, `share()`, and `search()` actions. The controller would be found
in **src/Controller/RecipesController.php** and contain:

``` php
// src/Controller/RecipesController.php

class RecipesController extends AppController
{
    public function view($id)
    {
        // Action logic goes here.
    }

    public function share($customerId, $recipeId)
    {
        // Action logic goes here.
    }

    public function search($query)
    {
        // Action logic goes here.
    }
}
```

The template files for these actions would be **src/Template/Recipes/view.ctp**,
**src/Template/Recipes/share.ctp**, and **src/Template/Recipes/search.ctp**. The
conventional view file name is the lowercased and underscored version of the
action name.

Controller actions generally use
`Controller::set()` to create a context that
`View` uses to render the view layer. Because of the conventions that
CakePHP uses, you don't need to create and render the view manually. Instead,
once a controller action has completed, CakePHP will handle rendering and
delivering the View.

If for some reason you'd like to skip the default behavior, you can return a
`Cake\Http\Response` object from the action with the fully
created response.

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

## Interacting with Views

Controllers interact with views in a number of ways. First, they
are able to pass data to the views, using `Controller::set()`. You can also
decide which view class to use, and which view file should be
rendered from the controller.

<a id="setting-view_variables"></a>

### Setting View Variables

`method` Cake\\Controller\\Controller::**set**(string $var, mixed $value)

The `Controller::set()` method is the main way to send data from your
controller to your view. Once you've used `Controller::set()`, the variable
can be accessed in your view:

``` php
// First you pass data from the controller:

$this->set('color', 'pink');

// Then, in the view, you can utilize the data:
?>

You have selected <?= h($color) ?> icing for the cake.
```

The `Controller::set()` method also takes an
associative array as its first parameter. This can often be a quick way to
assign a set of information to the view:

``` php
$data = [
    'color' => 'pink',
    'type' => 'sugar',
    'base_price' => 23.95
];

// Make $color, $type, and $base_price
// available to the view:

$this->set($data);
```

Keep in mind that view vars are shared among all parts rendered by your view.
They will be available in all parts of the view: the template, the layout and
all elements inside the former two.

### Setting View Options

If you want to customize the view class, layout/template paths, helpers or the
theme that will be used when rendering the view, you can use the
`viewBuilder()` method to get a builder. This builder can be used to define
properties of the view before it is created:

``` php
$this->viewBuilder()
    ->helpers(['MyCustom'])
    ->theme('Modern')
    ->className('Modern.Admin');
```

The above shows how you can load custom helpers, set the theme and use a custom
view class.

::: info Added in version 3.1
ViewBuilder was added in 3.1
:::

### Rendering a View

`method` Cake\\Controller\\Controller::**render**(string $view, string $layout)

The `Controller::render()` method is automatically called at the end of each requested
controller action. This method performs all the view logic (using the data
you've submitted using the `Controller::set()` method), places the view inside its
`View::$layout`, and serves it back to the end user.

The default view file used by render is determined by convention.
If the `search()` action of the RecipesController is requested,
the view file in **src/Template/Recipes/search.ctp** will be rendered:

``` php
namespace App\Controller;

class RecipesController extends AppController
{
// ...
    public function search()
    {
        // Render the view in src/Template/Recipes/search.ctp
        $this->render();
    }
// ...
}
```

Although CakePHP will automatically call it after every action's logic
(unless you've called `$this->disableAutoRender()`), you can use it to specify
an alternate view file by specifying a view file name as first argument of
`Controller::render()` method.

If `$view` starts with '/', it is assumed to be a view or
element file relative to the **src/Template** folder. This allows
direct rendering of elements, very useful in AJAX calls:

``` php
// Render the element in src/Template/Element/ajaxreturn.ctp
$this->render('/Element/ajaxreturn');
```

The second parameter `$layout` of `Controller::render()` allows you to specify the layout
with which the view is rendered.

#### Rendering a Specific Template

In your controller, you may want to render a different view than the
conventional one. You can do this by calling `Controller::render()` directly. Once you
have called `Controller::render()`, CakePHP will not try to re-render the view:

``` php
namespace App\Controller;

class PostsController extends AppController
{
    public function my_action()
    {
        $this->render('custom_file');
    }
}
```

This would render **src/Template/Posts/custom_file.ctp** instead of
**src/Template/Posts/my_action.ctp**.

You can also render views inside plugins using the following syntax:
`$this->render('PluginName.PluginController/custom_file')`.
For example:

``` php
namespace App\Controller;

class PostsController extends AppController
{
    public function my_action()
    {
        $this->render('Users.UserDetails/custom_file');
    }
}
```

This would render **plugins/Users/src/Template/UserDetails/custom_file.ctp**

## Redirecting to Other Pages

`method` Cake\\Controller\\Controller::**redirect**(string|array $url, integer $status)

The flow control method you'll use most often is `Controller::redirect()`.
This method takes its first parameter in the form of a
CakePHP-relative URL. When a user has successfully placed an order,
you might wish to redirect him to a receipt screen. :

``` php
public function place_order()
{
    // Logic for finalizing order goes here
    if ($success) {
        return $this->redirect(
            ['controller' => 'Orders', 'action' => 'thanks']
        );
    }
    return $this->redirect(
        ['controller' => 'Orders', 'action' => 'confirm']
    );
}
```

The method will return the response instance with appropriate headers set.
You should return the response instance from your action to prevent
view rendering and let the dispatcher handle actual redirection.

You can also use a relative or absolute URL as the \$url argument:

``` php
return $this->redirect('/orders/thanks');
return $this->redirect('http://www.example.com');
```

You can also pass data to the action:

``` php
return $this->redirect(['action' => 'edit', $id]);
```

The second parameter of `Controller::redirect()` allows you to define an HTTP
status code to accompany the redirect. You may want to use 301
(moved permanently) or 303 (see other), depending on the nature of
the redirect.

If you need to redirect to the referer page you can use:

``` php
return $this->redirect($this->referer());
```

An example using query strings and hash would look like:

``` php
return $this->redirect([
    'controller' => 'Orders',
    'action' => 'confirm',
    '?' => [
        'product' => 'pizza',
        'quantity' => 5
    ],
    '#' => 'top'
]);
```

The generated URL would be:

    http://www.example.com/orders/confirm?product=pizza&quantity=5#top

### Redirecting to Another Action on the Same Controller

`method` Cake\\Controller\\Controller::**setAction**($action, $args...)

If you need to forward the current action to a different action on the *same*
controller, you can use `Controller::setAction()` to update the request object, modify the
view template that will be rendered and forward execution to the named action:

``` php
// From a delete action, you can render the updated
// list page.
$this->setAction('index');
```

## Loading Additional Models

`method` Cake\\Controller\\Controller::**loadModel**(string $modelClass, string $type)

The `loadModel()` function comes handy when you need to use a model
table/collection that is not the controller's default one:

``` php
// In a controller method.
$this->loadModel('Articles');
$recentArticles = $this->Articles->find('all', [
    'limit' => 5,
    'order' => 'Articles.created DESC'
]);
```

If you are using a table provider other than the built-in ORM you can
link that table system into CakePHP's controllers by connecting its
factory method:

``` php
// In a controller method.
$this->modelFactory(
    'ElasticIndex',
    ['ElasticIndexes', 'factory']
);
```

After registering a table factory, you can use `loadModel` to load
instances:

``` php
// In a controller method.
$this->loadModel('Locations', 'ElasticIndex');
```

> [!NOTE]
> The built-in ORM's TableRegistry is connected by default as the 'Table'
> provider.

## Paginating a Model

`method` Cake\\Controller\\Controller::**paginate**()

This method is used for paginating results fetched by your models.
You can specify page sizes, model find conditions and more. See the
[pagination](controllers/components/pagination) section for more details on
how to use `paginate()`.

The `$paginate` attribute gives you an easy way to customize how `paginate()`
behaves:

``` php
class ArticlesController extends AppController
{
    public $paginate = [
        'Articles' => [
            'conditions' => ['published' => 1]
        ]
    ];
}
```

## Configuring Components to Load

`method` Cake\\Controller\\Controller::**loadComponent**($name, $config = [])

In your Controller's `initialize()` method you can define any components you
want loaded, and any configuration data for them:

``` php
public function initialize()
{
    parent::initialize();
    $this->loadComponent('Csrf');
    $this->loadComponent('Comments', Configure::read('Comments'));
}
```

The `$components` property on your controllers allows you to configure
components. Configured components and their dependencies will be created by
CakePHP for you. Read the [Configuring Components](controllers/components#configuring-components) section for more
information. As mentioned earlier the `$components` property will be merged
with the property defined in each of your controller's parent classes.

## Configuring Helpers to Load

Let's look at how to tell a CakePHP Controller that you plan to use
additional MVC classes:

``` php
class RecipesController extends AppController
{
    public $helpers = ['Form'];
}
```

Each of these variables are merged with their inherited values,
therefore it is not necessary (for example) to redeclare the
`FormHelper`, or anything that is declared in your `AppController`.

::: info Deprecated in version 3.0
Loading Helpers from the controller is provided for backwards compatibility reasons. You should see [Configuring Helpers](views/helpers#configuring-helpers) for how to load helpers.
:::

<a id="controller-life-cycle"></a>

## Request Life-cycle Callbacks

CakePHP controllers trigger several events/callbacks that you can use to insert
logic around the request life-cycle:

### Event List

- `Controller.initialize`
- `Controller.startup`
- `Controller.beforeRedirect`
- `Controller.beforeRender`
- `Controller.shutdown`

### Controller Callback Methods

By default the following callback methods are connected to related events if the
methods are implemented by your controllers

`method` Cake\\Controller\\Controller::**beforeFilter**(Event $event)

`method` Cake\\Controller\\Controller::**beforeRender**(Event $event)

`method` Cake\\Controller\\Controller::**afterFilter**(Event $event)

In addition to controller life-cycle callbacks, [Components](controllers/components)
also provide a similar set of callbacks.

Remember to call `AppController`'s callbacks within child controller callbacks
for best results:

``` php
//use Cake\Event\Event;
public function beforeFilter(Event $event)
{
    parent::beforeFilter($event);
}
```

## More on Controllers

- [The Pages Controller](controllers/pages-controller)
- [Components](controllers/components)
