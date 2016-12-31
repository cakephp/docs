Components
##########

Components are used to aid controllers in specific situations. Rather
than extend Cake's core libraries, special functionality can be made
into components.

A guy named olle on the IRC channel once said: A component is a sharable
little "controllerette". We find that this is a good definition. The
main goal in fact is: reusability. Components are to controllers what
helpers are to views. The main difference is that components encapsulate
**business logic** whereas helpers encapsulate presentation logic. This
point actually is very important, a common source of confusion for new
Bakers when trying to achieve reusability: I'm trying to do X, should
this be a component or a helper?! Well, the answer is really simple,
what does X do? Does it do business logic or presentation logic, perhaps
both? If it's business logic then it's a component. If it's presentation
logic then it's a helper. If it's both, then..well it's both a component
and a helper. An example of the later case would be an authentication
system. You would want to login, logout, restrict access, and test
permissions of a user to a resource (an action: add, edit, delete, or a
url), this is business logic, so this authentication system should be a
component. But you also want to add some entries to the main menu when
the user is logged in, and this is presentation logic.

Creating your own
=================

To create a component, add a file in **app/controllers/components/**
directory.

Let us assume you created **foo.php**. Inside of the file you need to
define a class that corresponds to the file name (appending the word
'Component' to the file name). So in our case you would create the
following contents:

A simple component
==================

::

    <?php
    class FooComponent extends Object
    {
        var $someVar = null;
        var $controller = true;
     
        function startup(&$controller)
        {
            // This method takes a reference to the controller which is loading it.
            // Perform controller initialization here.
        }
     
        function doFoo()
        {
            $this->someVar = 'foo';
        }
    }

The startup() function is used by the Dispatcher during the CakePHP
bootstrap process. Its a constructor-like function that allows a
component access to its controller. If you do not want this function to
be used or called, set the class variable $disableStartup to true.

Now, to use your component, you need to add the following code in your
controller's definition::

    <?php
    var $components = array('Foo');

Inside of that controller you could now use::

    <?php
    $this->Foo->doFoo();

A component gets access to the controller that loaded it through the
startup() method shown above. This method is called immediately after
Controller::beforeFilter(). This allows you to set component properties
in the beforeFilter method, which the component can act on in it’s
startup() method.

Because CakePHP loads models in a lazy fashion, it's usually not a good
idea to create model instances in components. If you need model data in
a component, it's best to pass that data in through one of the
component's methods::

    <?php

    class UsersController extends AppController
    {
        var $uses = array('Apple');
        var $components = array('Foo');

        function index()
        {
            $data = $this->Foo->doFoo($this->Apple->findAll());
        }
    }

You can also use other components inside your component. You simply have
to declare in your component which components you want to use. In the
example below it is the session component::

    <?php
    var $components = array('Session');

Making your components public
-----------------------------

If you think your component can be helpful to others, add it to `the
Bakery <https://bakery.cakephp.org/>`_. A component that becomes
increasingly useful for the community may some day be included in the
core distribution.

Also check the `snippet archive <http://cakeforge.org/snippet/>`_ for
user committed components.
