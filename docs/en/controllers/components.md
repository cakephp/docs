# Components

Components are packages of logic that are shared between controllers.
CakePHP comes with a fantastic set of core components you can use to aid in
various common tasks. You can also create your own components. If you find
yourself wanting to copy and paste things between controllers, you should
consider creating your own component to contain the functionality. Creating
components keeps controller code clean and allows you to reuse code between
different controllers.

For more information on the components included in CakePHP, check out the
chapter for each component:

- [AuthComponent](../controllers/components/authentication)
- [Cookie](../controllers/components/cookie)
- [Cross Site Request Forgery](../controllers/components/csrf)
- [Flash](../controllers/components/flash)
- [Security](../controllers/components/security)
- [Pagination](../controllers/components/pagination)
- [Request Handling](../controllers/components/request-handling)

<a id="configuring-components"></a>

## Configuring Components

Many of the core components require configuration. Some examples of components
requiring configuration are [AuthComponent](../controllers/components/authentication) and
[Cookie](../controllers/components/cookie). Configuration for these components,
and for components in general, is usually done via `loadComponent()` in your
Controller's `initialize()` method or via the `$components` array:

``` php
class PostsController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authorize' => 'Controller',
            'loginAction' => ['controller' => 'Users', 'action' => 'login']
        ]);
        $this->loadComponent('Cookie', ['expires' => '1 day']);
    }

}
```

You can configure components at runtime using the `config()` method. Often,
this is done in your controller's `beforeFilter()` method. The above could
also be expressed as:

``` php
public function beforeFilter(Event $event)
{
    $this->Auth->config('authorize', ['controller']);
    $this->Auth->config('loginAction', ['controller' => 'Users', 'action' => 'login']);

    $this->Cookie->config('name', 'CookieMonster');
}
```

Like helpers, components implement a `config()` method that is used to get and
set any configuration data for a component:

``` php
// Read config data.
$this->Auth->config('loginAction');

// Set config
$this->Csrf->config('cookieName', 'token');
```

As with helpers, components will automatically merge their `$_defaultConfig`
property with constructor configuration to create the `$_config` property
which is accessible with `config()`.

### Aliasing Components

One common setting to use is the `className` option, which allows you to
alias components. This feature is useful when you want to
replace `$this->Auth` or another common Component reference with a custom
implementation:

``` php
// src/Controller/PostsController.php
class PostsController extends AppController
{
    public function initialize()
    {
        $this->loadComponent('Auth', [
            'className' => 'MyAuth'
        ]);
    }
}

// src/Controller/Component/MyAuthComponent.php
use Cake\Controller\Component\AuthComponent;

class MyAuthComponent extends AuthComponent
{
    // Add your code to override the core AuthComponent
}
```

The above would *alias* `MyAuthComponent` to `$this->Auth` in your
controllers.

> [!NOTE]
> Aliasing a component replaces that instance anywhere that component is used,
> including inside other Components.

### Loading Components on the Fly

You might not need all of your components available on every controller
action. In situations like this you can load a component at runtime using the
`loadComponent()` method in your controller:

``` php
// In a controller action
$this->loadComponent('OneTimer');
$time = $this->OneTimer->getTime();
```

> [!NOTE]
> Keep in mind that components loaded on the fly will not have missed
> callbacks called. If you rely on the `beforeFilter` or `startup`
> callbacks being called, you may need to call them manually depending on when
> you load your component.

## Using Components

Once you've included some components in your controller, using them is pretty
simple. Each component you use is exposed as a property on your controller. If
you had loaded up the `Cake\Controller\Component\FlashComponent`
in your controller, you could access it like so:

``` php
class PostsController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Flash');
    }

    public function delete()
    {
        if ($this->Post->delete($this->request->getData('Post.id')) {
            $this->Flash->success('Post deleted.');
            return $this->redirect(['action' => 'index']);
        }
    }
```

> [!NOTE]
> Since both Models and Components are added to Controllers as
> properties they share the same 'namespace'. Be sure to not give a
> component and a model the same name.

<a id="creating-a-component"></a>

## Creating a Component

Suppose our application needs to perform a complex mathematical operation in
many different parts of the application. We could create a component to house
this shared logic for use in many different controllers.

The first step is to create a new component file and class. Create the file in
**src/Controller/Component/MathComponent.php**. The basic structure for the
component would look something like this:

``` php
namespace App\Controller\Component;

use Cake\Controller\Component;

class MathComponent extends Component
{
    public function doComplexOperation($amount1, $amount2)
    {
        return $amount1 + $amount2;
    }
}
```

> [!NOTE]
> All components must extend `Cake\Controller\Component`. Failing
> to do this will trigger an exception.

### Including your Component in your Controllers

Once our component is finished, we can use it in the application's
controllers by loading it during the controller's `initialize()` method.
Once loaded, the controller will be given a new attribute named after the
component, through which we can access an instance of it:

``` php
// In a controller
// Make the new component available at $this->Math,
// as well as the standard $this->Csrf
public function initialize()
{
    parent::initialize();
    $this->loadComponent('Math');
    $this->loadComponent('Csrf');
}
```

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
constructor. These parameters can then be handled by
the Component:

``` php
// In your controller.
public function initialize()
{
    parent::initialize();
    $this->loadComponent('Math', [
        'precision' => 2,
        'randomGenerator' => 'srand'
    ]);
    $this->loadComponent('Csrf');
}
```

The above would pass the array containing precision and randomGenerator to
`MathComponent::initialize()` in the `$config` parameter.

### Using Other Components in your Component

Sometimes one of your components may need to use another component.
In this case you can include other components in your component the exact same
way you include them in controllers - using the `$components` var:

``` php
// src/Controller/Component/CustomComponent.php
namespace App\Controller\Component;

use Cake\Controller\Component;

class CustomComponent extends Component
{
    // The other component your component uses
    public $components = ['Existing'];

    // Execute any other additional setup for your component.
    public function initialize(array $config)
    {
        $this->Existing->foo();
    }

    public function bar()
    {
        // ...
    }
}

// src/Controller/Component/ExistingComponent.php
namespace App\Controller\Component;

use Cake\Controller\Component;

class ExistingComponent extends Component
{
    public function foo()
    {
        // ...
    }
}
```

> [!NOTE]
> In contrast to a component included in a controller
> no callbacks will be triggered on a component's component.

### Accessing a Component's Controller

From within a Component you can access the current controller through the
registry:

``` php
$controller = $this->_registry->getController();
```

You can access the controller in any callback method from the event
object:

``` php
$controller = $event->getSubject();
```

## Component Callbacks

Components also offer a few request life-cycle callbacks that allow them to
augment the request cycle.

`method` Class::**beforeFilter**(Event $event)

`method` Class::**startup**(Event $event)

`method` Class::**beforeRender**(Event $event)

`method` Class::**shutdown**(Event $event)

`method` Class::**beforeRedirect**(Event $event, $url, Response $response)
