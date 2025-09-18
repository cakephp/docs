# Controllers

Controllers are the 'C' in MVC. After routing has been applied and the correct
controller has been found, your controller's action is called. Your controller
should handle interpreting the request data, making sure the correct models
are called, and the right response or view is rendered. Controllers can be
thought of as middle man between the Model and View. You want to keep your
controllers thin, and your models fat. This will help you more easily reuse
your code and makes your code easier to test.

Commonly, a controller is used to manage the logic around a single model. For
example, if you were building a site for an online bakery, you might have a
RecipesController managing your recipes and an IngredientsController managing your
ingredients. However, it's also possible to have controllers work with more than
one model. In CakePHP, a controller is named after the primary model it
handles.

Your application's controllers extend the `AppController` class, which in turn
extends the core `Controller` class. The `AppController`
class can be defined in `/app/Controller/AppController.php` and it should
contain methods that are shared between all of your application's controllers.

Controllers provide a number of methods that handle requests. These are called
*actions*. By default, each public method in
a controller is an action, and is accessible from a URL. An action is responsible
for interpreting the request and creating the response. Usually responses are
in the form of a rendered view, but there are other ways to create responses as
well.

<a id="app-controller"></a>

## The App Controller

As stated in the introduction, the `AppController` class is the
parent class to all of your application's controllers.
`AppController` itself extends the `Controller` class included in the
CakePHP core library. `AppController` is defined in
`/app/Controller/AppController.php` as follows:

``` php
class AppController extends Controller {
}
```

Controller attributes and methods created in your `AppController`
will be available to all of your application's controllers. Components
(which you'll learn about later) are best
used for code that is used in many (but not necessarily all)
controllers.

While normal object-oriented inheritance rules apply, CakePHP
does a bit of extra work when it comes to special controller
attributes. The components and helpers used by a
controller are treated specially. In these cases, `AppController`
value arrays are merged with child controller class arrays. The values in the
child class will always override those in `AppController.`

> [!NOTE]
> CakePHP merges the following variables from the `AppController` into
> your application's controllers:
>
> - `~Controller::$components`
> - `~Controller::$helpers`
> - `~Controller::$uses`

Remember to add the default Html and Form helpers if you define
the `~Controller::$helpers` property in your `AppController`.

Also remember to call `AppController`'s callbacks within child
controller callbacks for best results:

``` php
public function beforeFilter() {
    parent::beforeFilter();
}
```

## Request parameters

When a request is made to a CakePHP application, CakePHP's `Router` and
`Dispatcher` classes use [Routes Configuration](development/routing#routes-configuration) to find and
create the correct controller. The request data is encapsulated in a request
object. CakePHP puts all of the important request information into the
`$this->request` property. See the section on
[Cake Request](controllers/request-response#cake-request) for more information on the CakePHP request object.

## Controller actions

Controller actions are responsible for converting the request parameters into a
response for the browser/user making the request. CakePHP uses conventions to
automate this process and remove some boilerplate code you would otherwise need
to write.

By convention, CakePHP renders a view with an inflected version of the action
name. Returning to our online bakery example, our RecipesController might contain the
`view()`, `share()`, and `search()` actions. The controller would be found
in `/app/Controller/RecipesController.php` and contain:

    # /app/Controller/RecipesController.php

    class RecipesController extends AppController {
        public function view($id) {
            //action logic goes here..
        }

        public function share($customerId, $recipeId) {
            //action logic goes here..
        }

        public function search($query) {
            //action logic goes here..
        }
    }

The view files for these actions would be `app/View/Recipes/view.ctp`,
`app/View/Recipes/share.ctp`, and `app/View/Recipes/search.ctp`. The
conventional view file name is the lowercased and underscored version of the
action name.

Controller actions generally use `~Controller::set()` to create a
context that `View` uses to render the view. Because of the
conventions that CakePHP uses, you don't need to create and render the view
manually. Instead, once a controller action has completed, CakePHP will handle
rendering and delivering the View.

If for some reason you'd like to skip the default behavior, both of the
following techniques will bypass the default view rendering behavior.

- If you return a string, or an object that can be converted to a string from
  your controller action, it will be used as the response body.
- You can return a `CakeResponse` object with the completely created
  response.

When you use controller methods with `~Controller::requestAction()`,
you will often want to return data that isn't a string. If you have controller
methods that are used for normal web requests + requestAction, you should check
the request type before returning:

``` php
class RecipesController extends AppController {
    public function popular() {
        $popular = $this->Recipe->popular();
        if (!empty($this->request->params['requested'])) {
            return $popular;
        }
        $this->set('popular', $popular);
    }
}
```

The above controller action is an example of how a method can be used with
`~Controller::requestAction()` and normal requests. Returning array data to a
non-requestAction request will cause errors and should be avoided. See the
section on `~Controller::requestAction()` for more tips on using
`~Controller::requestAction()`

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

<a id="controller-life-cycle"></a>

## Request Life-cycle callbacks

`class` **Controller**

CakePHP controllers come fitted with callbacks you can use to
insert logic around the request life-cycle:

`method` Controller::**beforeFilter**()

`method` Controller::**beforeRender**()

`method` Controller::**afterFilter**()

In addition to controller life-cycle callbacks, [Components](controllers/components)
also provide a similar set of callbacks.

<a id="controller-methods"></a>

## Controller Methods

For a complete list of controller methods and their descriptions
visit the [CakePHP API](https://api.cakephp.org/2.x/class-Controller.html).

### Interacting with Views

Controllers interact with views in a number of ways. First, they
are able to pass data to the views, using `~Controller::set()`. You can also
decide which view class to use, and which view file should be
rendered from the controller.

`method` Controller::**set**(string $var, mixed $value)

`method` Controller::**render**(string $view, string $layout)

#### Rendering a specific view

In your controller, you may want to render a different view than
the conventional one. You can do this by calling
`~Controller::render()` directly. Once you have called `~Controller::render()`, CakePHP
will not try to re-render the view:

``` php
class PostsController extends AppController {
    public function my_action() {
        $this->render('custom_file');
    }
}
```

This would render `app/View/Posts/custom_file.ctp` instead of
`app/View/Posts/my_action.ctp`

You can also render views inside plugins using the following syntax:
`$this->render('PluginName.PluginController/custom_file')`.
For example:

``` php
class PostsController extends AppController {
    public function my_action() {
        $this->render('Users.UserDetails/custom_file');
    }
}
```

    
This would render `app/Plugin/Users/View/UserDetails/custom_file.ctp`

### Flow Control

`method` Controller::**redirect**(mixed $url, integer $status, boolean $exit)

`method` Controller::**flash**(string $message, string|array $url, integer $pause, string $layout)

### Callbacks

In addition to the [Controller Life Cycle](#controller-life-cycle),
CakePHP also supports callbacks related to scaffolding.

`method` Controller::**beforeScaffold**($method)

`method` Controller::**afterScaffoldSave**($method)

`method` Controller::**afterScaffoldSaveError**($method)

`method` Controller::**scaffoldError**($method)

### Other Useful Methods

`method` Controller::**constructClasses**()

`method` Controller::**referer**(mixed $default = null, boolean $local = false)

`method` Controller::**disableCache**()

`method` Controller::**postConditions**(array $data, mixed $op, string $bool, boolean $exclusive)

`method` Controller::**paginate**()

`method` Controller::**requestAction**(string $url, array $options)

`method` Controller::**loadModel**(string $modelClass, mixed $id)

## Controller Attributes

For a complete list of controller attributes and their descriptions
visit the [CakePHP API](https://api.cakephp.org/2.x/class-Controller.html).

> The `~Controller::$name` attribute should be set to the
> name of the controller. Usually this is just the plural form of the
> primary model the controller uses. This property can be omitted,
> but saves CakePHP from inflecting it:
>
> ``` php
> // $name controller attribute usage example
> class RecipesController extends AppController {
>    public $name = 'Recipes';
> }
> ```

### \$components, \$helpers and \$uses

The next most often used controller attributes tell CakePHP what
`~Controller::$helpers`, `~Controller::$components`,
and `models` you'll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by `~Controller::$components` and `~Controller::$uses` available to the controller
as class variables (`$this->ModelName`, for example) and those
given by `~Controller::$helpers` to the view as an object reference variable
(`$this->{$helpername}`).

> [!NOTE]
> Each controller has some of these classes available by default, so
> you may not need to configure your controller at all.
>
> Controllers have access to their primary model available by
> default. Our RecipesController will have the Recipe model class
> available at `$this->Recipe`, and our ProductsController also
> features the Product model at `$this->Product`. However, when
> allowing a controller to access additional models through the
> `~Controller::$uses` variable, the name of the current controller's model must
> also be included. This is illustrated in the example below.
>
> If you do not wish to use a Model in your controller, set
> `public $uses = array()`. This will allow you to use a controller
> without a need for a corresponding Model file. However, the models
> defined in the `AppController` will still be loaded. You can also use
> `false` to not load any models at all. Even those defined in the
> `AppController`.
>
> ::: info Changed in version 2.1
> `~Controller::$uses` now has a new default value, it also handles `false` differently.
> :::
>
> The `HtmlHelper`, `FormHelper`, and `SessionHelper` are available by
> default, as is the `SessionComponent`. But if you choose to define
> your own `~Controller::$helpers` array in `AppController`, make sure to include
> `HtmlHelper` and `FormHelper` if you want them still available by default
> in your Controllers. To learn more about these classes, be sure
> to check out their respective sections later in this manual.
>
> Let's look at how to tell a CakePHP `Controller` that you plan to use
> additional MVC classes:
>
> ``` php
> class RecipesController extends AppController {
>     public $uses = array('Recipe', 'User');
>     public $helpers = array('Js');
>     public $components = array('RequestHandler');
> }
> ```
>
> Each of these variables are merged with their inherited values,
> therefore it is not necessary (for example) to redeclare the
> `FormHelper`, or anything that is declared in your `AppController`.
>
> The components array allows you to set which [Components](controllers/components)
> a controller will use. Like `~Controller::$helpers` and
> `~Controller::$uses` components in your controllers are
> merged with those in `AppController`. As with
> `~Controller::$helpers` you can pass settings
> into `~Controller::$components`. See [Configuring Components](controllers/components#configuring-components) for more information.

### Other Attributes

While you can check out the details for all controller attributes
in the [API](https://api.cakephp.org), there are other controller attributes that merit their
own sections in the manual.

> The cacheAction attribute is used to define the duration and other
> information about full page caching. You can read more about
> full page caching in the `CacheHelper` documentation.
>
> The paginate attribute is a deprecated compatibility property. Using it
> loads and configures the `PaginatorComponent`. It is recommended
> that you update your code to use normal component settings:
>
> ``` php
> class ArticlesController extends AppController {
>     public $components = array(
>         'Paginator' => array(
>             'Article' => array(
>                 'conditions' => array('published' => 1)
>             )
>         )
>     );
> }
> ```

<div class="todo">

This chapter should be less about the controller API and more about
examples, the controller attributes section is overwhelming and difficult to
understand at first. The chapter should start with some example controllers
and what they do.

</div>

## More on controllers

- [Request and Response objects](controllers/request-response)
- [Scaffolding](controllers/scaffolding)
- [The Pages Controller](controllers/pages-controller)
- [Components](controllers/components)
