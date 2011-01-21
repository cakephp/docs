3.14.2 Plugin Controllers
-------------------------

Controllers for our pizza plugin will be stored in
/app/plugins/pizza/controllers/. Since the main thing we'll be
tracking is pizza orders, we'll need an OrdersController for this
plugin.

While it isn't required, it is recommended that you name your
plugin controllers something relatively unique in order to avoid
namespace conflicts with parent applications. Its not a stretch to
think that a parent application might have a UsersController,
OrdersController, or ProductsController: so you might want to be
creative with controller names, or prepend the name of the plugin
to the classname (PizzaOrdersController, in this case).

So, we place our new PizzaOrdersController in
/app/plugins/pizza/controllers and it looks like so:

::

    // /app/plugins/pizza/controllers/pizza_orders_controller.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }


#. ``// /app/plugins/pizza/controllers/pizza_orders_controller.php``
#. ``class PizzaOrdersController extends PizzaAppController {``
#. ``var $name = 'PizzaOrders';``
#. ``var $uses = array('Pizza.PizzaOrder');``
#. ``function index() {``
#. ``//...``
#. ``}``
#. ``}``

This controller extends the plugin's AppController (called
PizzaAppController) rather than the parent application's
AppController.

Also note how the name of the model is prefixed with the name of
the plugin. This line of code is added for clarity but is not
necessary for this example.

If you want to access what we’ve got going thus far, visit
/pizza/pizza\_orders. You should get a “Missing Model” error
because we don’t have a PizzaOrder model defined yet.

3.14.2 Plugin Controllers
-------------------------

Controllers for our pizza plugin will be stored in
/app/plugins/pizza/controllers/. Since the main thing we'll be
tracking is pizza orders, we'll need an OrdersController for this
plugin.

While it isn't required, it is recommended that you name your
plugin controllers something relatively unique in order to avoid
namespace conflicts with parent applications. Its not a stretch to
think that a parent application might have a UsersController,
OrdersController, or ProductsController: so you might want to be
creative with controller names, or prepend the name of the plugin
to the classname (PizzaOrdersController, in this case).

So, we place our new PizzaOrdersController in
/app/plugins/pizza/controllers and it looks like so:

::

    // /app/plugins/pizza/controllers/pizza_orders_controller.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }


#. ``// /app/plugins/pizza/controllers/pizza_orders_controller.php``
#. ``class PizzaOrdersController extends PizzaAppController {``
#. ``var $name = 'PizzaOrders';``
#. ``var $uses = array('Pizza.PizzaOrder');``
#. ``function index() {``
#. ``//...``
#. ``}``
#. ``}``

This controller extends the plugin's AppController (called
PizzaAppController) rather than the parent application's
AppController.

Also note how the name of the model is prefixed with the name of
the plugin. This line of code is added for clarity but is not
necessary for this example.

If you want to access what we’ve got going thus far, visit
/pizza/pizza\_orders. You should get a “Missing Model” error
because we don’t have a PizzaOrder model defined yet.
