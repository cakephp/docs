14 Plugins
----------

CakePHP allows you to set up a combination of controllers, models, and
views and release them as a packaged application plugin that others can
use in their CakePHP applications. Have a sweet user management module,
simple blog, or web services module in one of your applications? Package
it as a CakePHP plugin so you can pop it into other applications.

The main tie between a plugin and the application it has been installed
into is the application's configuration (database connection, etc.).
Otherwise, it operates in its own little space, behaving much like it
would if it were an application on it's own.

Creating a Plugin
-----------------

As a working example, let's create a new plugin that orders pizza for
you. What could be more useful in any CakePHP application? To start out,
we'll need to place our plugin files inside the **/app/plugins** folder.
The name of the parent folder for all the plugin files is important, and
will be used in many places, so pick wisely. For this plugin, let's use
the name 'pizza'. This is how the setup will eventually look:

Pizza Ordering Filesystem Layout
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    /app
        /plugins
            /pizza
                /controllers                <- plugin controllers go here
                /models                     <- plugin models go here
                /views                      <- plugin views go here
                /pizza_app_controller.php   <- plugin's AppController, named after the plugin
                /pizza_app_model.php        <- plugin's AppModel, named after the plugin

While defining an AppController and AppModel for any normal application
is not required, **defining them for plugins is**. You'll need to create
them before your plugin works. These two special classes are named after
the plugin, and extend the parent application's AppController and
AppModel. Here's what they should look like:

Pizza Plugin AppController: /app/plugins/pizza/pizza\_app\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PizzaAppController extends AppController
    {
        //...
    }

    ?>

Pizza Plugin AppModel: /app/plugins/pizza/pizza\_app\_model.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PizzaAppModel extends AppModel
    {
        //...
    }

    ?>

If you forget to define these special classes, CakePHP will hand you
"Missing Controller" errors until the problem is rectified.

Plugin Controllers
------------------

Controllers for our pizza plugin will be stored in
**/app/plugins/pizza/controllers**. Since the main thing we'll be
tracking is pizza orders, we'll need an OrdersController for this
plugin.

While it isn't required, it is recommended that you name your plugin
controllers something relatively unique in order to avoid namespace
conflicts with parent applications. Its not a stretch to think that a
parent application might have a UsersController, OrdersController, or
ProductsController: so you might want to be creative with controller
names, or prepend the name of the plugin to the classname
(PizzaOrdersController, in this case).

So, we place our new PizzaOrdersController in
**/app/plugins/pizza/controllers** and it looks like so:

/app/plugins/pizza/controllers/pizza\_orders\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PizzaOrdersController extends PizzaAppController
    {
        var $name = 'PizzaOrders';

        function index()
        {
            //...
        }

        function placeOrder()
        {
            //...
        }
    }

    ?>

Note how this controller extends the plugin's AppController (called
PizzaAppController) rather than just the parent application's
AppController.

Plugin Models
-------------

Models for the plugin are stored in **/app/plugins/pizza/models**. We've
already defined a PizzaOrdersController for this plugin, so let's create
the model for that controller, called PizzaOrders (the classname
PizzaOrders is consistent with our naming scheme, and is unique enough,
so we'll leave it as is).

/app/plugins/pizza/models/pizza\_order.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PizzaOrder extends PizzaAppModel
    {
        var $name = 'PizzaOrder';
    }

    ?>

Again, note that this class extends PizzaAppModel rather than AppModel.

Plugin Views
------------

Views behave exactly as they do in normal applications. Just place them
in the right folder inside of the /app/plugins/[plugin]/views folder.
For our pizza ordering plugin, we'll need at least one view for our
PizzaOrdersController::index() action, so let's include that as well:

/app/plugins/pizza/views/pizza\_orders/index.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

Working With Plugins
--------------------

So, now that you've built evertything, it should be ready to distribute
(though we'd suggest you also distribute a few extras like a readme, sql
file, etc.).

Once a plugin as been installed in /app/plugins, you can access it at
the URL /pluginname/controllername/action. In our pizza ordering plugin
example, we'd access our PizzaOrdersController at /pizza/pizzaOrders.

Some final tips on working with plugins in your CakePHP applications:

#. When you don't have a [Plugin]AppController and [Plugin]AppModel,
   you'll get missing Controller errors when trying to access a plugin
   controller.

#. You can have a default controller with the name of your plugin. If
   you do that, you can access it via /[plugin]/action. For example, a
   plugin named 'users' with a controller named UsersController can be
   accessed at /users/add if there is no plugin called AddController in
   your [plugin]/controllers folder.

#. Plugins will use the layouts from the **/app/views/layouts** folder
   by default.

#. You can do inter-plugin communication by using requestAction in your
   controllers.
    `` $this->requestAction('/plugin/controller/action'); ``

#. If you use requestAction, make sure controller and model names are as
   unique as possible. Otherwise you might get PHP "redefined class ..."
   errors.

Many thanks to Felix Geisendorfer (the\_undefined) for the initial
material for this chapter.
