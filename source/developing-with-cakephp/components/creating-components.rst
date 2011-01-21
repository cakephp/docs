3.6.3 Creating Components
-------------------------

Suppose our online application needs to perform a complex
mathematical operation in many different parts of the application.
We could create a component to house this shared logic for use in
many different controllers.

The first step is to create a new component file and class. Create
the file in /app/controllers/components/math.php. The basic
structure for the component would look something like this:

::

    <?php
    
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }
    
    ?>

Take notice that our MathComponent extends Object and not
Component. Extending Component can create infinite redirect issues,
when combined with other Components.

Including Components in your Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once our component is finished, we can use it in the application's
controllers by placing the component's name (minus the "Component"
part) in the controller's $components array. The controller will
automatically be given a new attribute named after the component,
through which we can access an instance of it:

::

    /* Make the new component available at $this->Math,
    as well as the standard $this->Session */
    var $components = array('Math', 'Session');

Components declared in ``AppController`` will be merged with those
in your other controllers. So there is no need to re-declare the
same component twice.

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
``initialize()`` method. These parameters can then be handled by
the Component.

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

The above would pass the array containing precision and
randomGenerator to MathComponent's initialize() method as the
second parameter.

This syntax is not implemented by any of the Core Components at
this time

MVC Class Access Within Components
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Components feature a number of callbacks used by the parent
controller class. Judicious use of these callbacks can make
creating and using components much easier..

``initialize(&$controller, $settings=array())``

The initialize method is called before the controller's
beforeFilter method.

``startup(&$controller)``

The startup method is called after the controller's beforeFilter
method but before the controller executes the current action
handler.

``beforeRender(&$controller)``

The beforeRender method is called after the controller executes the
requested action's logic but before the controller's renders views
and layout.

``shutdown(&$controller)``

The shutdown method is called before output is sent to browser.

``beforeRedirect(&$controller, $url, $status=null, $exit=true)``

The beforeRedirect method is invoked when the controller's redirect
method is called but before any further action. If this method
returns false the controller will not continue on to redirect the
request. The $url, $status and $exit variables have same meaning as
for the controller's method. You can also return a string which
will be interpreted as the url to redirect to or return associative
array with key 'url' and optionally 'status' and 'exit'.

Here is a skeleton component you can use as a template for your own
custom components.

::

    <?php
    class SkeletonComponent extends Object {
        //called before Controller::beforeFilter()
        function initialize(&$controller, $settings = array()) {
            // saving the controller reference for later use
            $this->controller =& $controller;
        }
    
        //called after Controller::beforeFilter()
        function startup(&$controller) {
        }
    
        //called after Controller::beforeRender()
        function beforeRender(&$controller) {
        }
    
        //called after Controller::render()
        function shutdown(&$controller) {
        }
    
        //called before Controller::redirect()
        function beforeRedirect(&$controller, $url, $status=null, $exit=true) {
        }
    
        function redirectSomewhere($value) {
            // utilizing a controller method
            $this->controller->redirect($value);
        }
    }
    ?>

You might also want to utilize other components inside a custom
component. To do so, just create a $components class variable (just
like you would in a controller) as an array that holds the names of
components you wish to utilize.

::

    <?php
    class MyComponent extends Object {
    
        // This component uses other components
        var $components = array('Session', 'Math');
    
        function doStuff() {
            $result = $this->Math->doComplexOperation(1, 2);
            $this->Session->write('stuff', $result);
        }
    
    }
    ?>

To access/use a model in a component is not generally recommended;
If you end up needing one, you'll need to instantiate your model
class and use it manually. Here's an example:

::

    <?php
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    
        function doReallyComplexOperation ($amount1, $amount2) {
            $userInstance = ClassRegistry::init('User');
            $totalUsers = $userInstance->find('count');
            return ($amount1 + $amount2) / $totalUsers;
        }
    }
    ?>

Using other Components in your Component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sometimes one of your components may need to use another.

You can include other components in your component the exact same
way you include them in controllers: Use the ``$components`` var.

::

    <?php
    class CustomComponent extends Object {
        var $name = 'Custom'; // the name of your component
        var $components = array('Existing'); // the other component your component uses
    
        function initialize(&$controller) {
            $this->Existing->foo();
        }
    
        function bar() {
            // ...
       }
    }
    ?>

::

    <?php
    class ExistingComponent extends Object {
        var $name = 'Existing';
    
        function initialize(&$controller) {
            $this->Parent->bar();
        }
     
        function foo() {
            // ...
       }
    }
    ?>

3.6.3 Creating Components
-------------------------

Suppose our online application needs to perform a complex
mathematical operation in many different parts of the application.
We could create a component to house this shared logic for use in
many different controllers.

The first step is to create a new component file and class. Create
the file in /app/controllers/components/math.php. The basic
structure for the component would look something like this:

::

    <?php
    
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }
    
    ?>

Take notice that our MathComponent extends Object and not
Component. Extending Component can create infinite redirect issues,
when combined with other Components.

Including Components in your Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once our component is finished, we can use it in the application's
controllers by placing the component's name (minus the "Component"
part) in the controller's $components array. The controller will
automatically be given a new attribute named after the component,
through which we can access an instance of it:

::

    /* Make the new component available at $this->Math,
    as well as the standard $this->Session */
    var $components = array('Math', 'Session');

Components declared in ``AppController`` will be merged with those
in your other controllers. So there is no need to re-declare the
same component twice.

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
``initialize()`` method. These parameters can then be handled by
the Component.

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

The above would pass the array containing precision and
randomGenerator to MathComponent's initialize() method as the
second parameter.

This syntax is not implemented by any of the Core Components at
this time

MVC Class Access Within Components
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Components feature a number of callbacks used by the parent
controller class. Judicious use of these callbacks can make
creating and using components much easier..

``initialize(&$controller, $settings=array())``

The initialize method is called before the controller's
beforeFilter method.

``startup(&$controller)``

The startup method is called after the controller's beforeFilter
method but before the controller executes the current action
handler.

``beforeRender(&$controller)``

The beforeRender method is called after the controller executes the
requested action's logic but before the controller's renders views
and layout.

``shutdown(&$controller)``

The shutdown method is called before output is sent to browser.

``beforeRedirect(&$controller, $url, $status=null, $exit=true)``

The beforeRedirect method is invoked when the controller's redirect
method is called but before any further action. If this method
returns false the controller will not continue on to redirect the
request. The $url, $status and $exit variables have same meaning as
for the controller's method. You can also return a string which
will be interpreted as the url to redirect to or return associative
array with key 'url' and optionally 'status' and 'exit'.

Here is a skeleton component you can use as a template for your own
custom components.

::

    <?php
    class SkeletonComponent extends Object {
        //called before Controller::beforeFilter()
        function initialize(&$controller, $settings = array()) {
            // saving the controller reference for later use
            $this->controller =& $controller;
        }
    
        //called after Controller::beforeFilter()
        function startup(&$controller) {
        }
    
        //called after Controller::beforeRender()
        function beforeRender(&$controller) {
        }
    
        //called after Controller::render()
        function shutdown(&$controller) {
        }
    
        //called before Controller::redirect()
        function beforeRedirect(&$controller, $url, $status=null, $exit=true) {
        }
    
        function redirectSomewhere($value) {
            // utilizing a controller method
            $this->controller->redirect($value);
        }
    }
    ?>

You might also want to utilize other components inside a custom
component. To do so, just create a $components class variable (just
like you would in a controller) as an array that holds the names of
components you wish to utilize.

::

    <?php
    class MyComponent extends Object {
    
        // This component uses other components
        var $components = array('Session', 'Math');
    
        function doStuff() {
            $result = $this->Math->doComplexOperation(1, 2);
            $this->Session->write('stuff', $result);
        }
    
    }
    ?>

To access/use a model in a component is not generally recommended;
If you end up needing one, you'll need to instantiate your model
class and use it manually. Here's an example:

::

    <?php
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    
        function doReallyComplexOperation ($amount1, $amount2) {
            $userInstance = ClassRegistry::init('User');
            $totalUsers = $userInstance->find('count');
            return ($amount1 + $amount2) / $totalUsers;
        }
    }
    ?>

Using other Components in your Component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sometimes one of your components may need to use another.

You can include other components in your component the exact same
way you include them in controllers: Use the ``$components`` var.

::

    <?php
    class CustomComponent extends Object {
        var $name = 'Custom'; // the name of your component
        var $components = array('Existing'); // the other component your component uses
    
        function initialize(&$controller) {
            $this->Existing->foo();
        }
    
        function bar() {
            // ...
       }
    }
    ?>

::

    <?php
    class ExistingComponent extends Object {
        var $name = 'Existing';
    
        function initialize(&$controller) {
            $this->Parent->bar();
        }
     
        function foo() {
            // ...
       }
    }
    ?>
