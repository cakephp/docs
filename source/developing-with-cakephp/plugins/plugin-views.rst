3.14.4 Plugin Views
-------------------

Views behave exactly as they do in normal applications. Just place
them in the right folder inside of the /app/plugins/[plugin]/views/
folder. For our pizza ordering plugin, we'll need a view for our
PizzaOrdersController::index() action, so let's include that as
well:

::

    // /app/plugins/pizza/views/pizza_orders/index.ctp:
    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

For information on how to use elements from a plugin, look up
:doc:`/developing-with-cakephp/views/elements`

Overriding plugin views from inside your application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can override any plugin views from inside your app using
special paths. If you have a plugin called 'Pizza' you can override
the view files of the plugin with more application specific view
logic by creating files using the following template
"app/views/plugins/$plugin/$controller/$view.ctp". For the pizza
controller you could make the following file:

::

    /app/views/plugins/pizza/pizza_orders/index.ctp

Creating this file, would allow you to override
"/app/plugins/pizza/views/pizza\_orders/index.ctp".
