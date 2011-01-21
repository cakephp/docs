3.14.3 Plugin Models
--------------------

Models for the plugin are stored in /app/plugins/pizza/models.
We've already defined a PizzaOrdersController for this plugin, so
let's create the model for that controller, called PizzaOrder.
PizzaOrder is consistent with our previously defined naming scheme
of pre-pending all of our plugin classes with Pizza.

::

    // /app/plugins/pizza/models/pizza_order.php:
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>


#. ``// /app/plugins/pizza/models/pizza_order.php:``
#. ``class PizzaOrder extends PizzaAppModel {``
#. ``var $name = 'PizzaOrder';``
#. ``}``
#. ``?>``

Visiting /pizza/pizzaOrders now (given you’ve got a table in your
database called ‘pizza\_orders’) should give us a “Missing View”
error. Let’s create that next.

If you need to reference a model within your plugin, you need to
include the plugin name with the model name, separated with a dot.

For example:

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>


#. ``// /app/plugins/pizza/models/example_model.php:``
#. ``class ExampleModel extends PizzaAppModel {``
#. ``var $name = 'ExampleModel';``
#. ``var $hasMany = array('Pizza.PizzaOrder');``
#. ``}``
#. ``?>``

If you would prefer that the array keys for the association not
have the plugin prefix on them, use the alternative syntax:

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array(
                    'PizzaOrder' => array(
                            'className' => 'Pizza.PizzaOrder'
                    )
            );
    }
    ?>


#. ``// /app/plugins/pizza/models/example_model.php:``
#. ``class ExampleModel extends PizzaAppModel {``
#. ``var $name = 'ExampleModel';``
#. ``var $hasMany = array(``
#. ``'PizzaOrder' => array(``
#. ``'className' => 'Pizza.PizzaOrder'``
#. ``)``
#. ``);``
#. ``}``
#. ``?>``

3.14.3 Plugin Models
--------------------

Models for the plugin are stored in /app/plugins/pizza/models.
We've already defined a PizzaOrdersController for this plugin, so
let's create the model for that controller, called PizzaOrder.
PizzaOrder is consistent with our previously defined naming scheme
of pre-pending all of our plugin classes with Pizza.

::

    // /app/plugins/pizza/models/pizza_order.php:
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>


#. ``// /app/plugins/pizza/models/pizza_order.php:``
#. ``class PizzaOrder extends PizzaAppModel {``
#. ``var $name = 'PizzaOrder';``
#. ``}``
#. ``?>``

Visiting /pizza/pizzaOrders now (given you’ve got a table in your
database called ‘pizza\_orders’) should give us a “Missing View”
error. Let’s create that next.

If you need to reference a model within your plugin, you need to
include the plugin name with the model name, separated with a dot.

For example:

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>


#. ``// /app/plugins/pizza/models/example_model.php:``
#. ``class ExampleModel extends PizzaAppModel {``
#. ``var $name = 'ExampleModel';``
#. ``var $hasMany = array('Pizza.PizzaOrder');``
#. ``}``
#. ``?>``

If you would prefer that the array keys for the association not
have the plugin prefix on them, use the alternative syntax:

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array(
                    'PizzaOrder' => array(
                            'className' => 'Pizza.PizzaOrder'
                    )
            );
    }
    ?>


#. ``// /app/plugins/pizza/models/example_model.php:``
#. ``class ExampleModel extends PizzaAppModel {``
#. ``var $name = 'ExampleModel';``
#. ``var $hasMany = array(``
#. ``'PizzaOrder' => array(``
#. ``'className' => 'Pizza.PizzaOrder'``
#. ``)``
#. ``);``
#. ``}``
#. ``?>``
