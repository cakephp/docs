Plugins
########

CakePHP allows you to set up a combination of controllers, models,
and views and release them as a packaged application plugin that
others can use in their CakePHP applications. Have a sweet user
management module, simple blog, or web services module in one of
your applications? Package it as a CakePHP plugin so you can pop it
into other applications.

The main tie between a plugin and the application it has been
installed into, is the application's configuration (database
connection, etc.). Otherwise, it operates in its own little space,
behaving much like it would if it were an application on its own.

Creating a Plugin
------------------

As a working example, let's create a new plugin that orders pizza
for you. To start out, we'll need to place our plugin files inside
the /app/Plugin folder. The name of the parent folder for all the
plugin files is important, and will be used in many places, so pick
wisely. For this plugin, let's use the name '**Pizza**'. This is
how the setup will eventually look:

::

    /app
         /Plugin
             /Pizza
                 /Controller                   <- plugin controllers go    here
                     /PizzaAppController.php   <- plugin's AppController
                 /Model                        <- plugin models go    here
                     /PizzaAppModel.php        <- plugin's AppModel
                 /View                         <- plugin views go    here

.. note::

    If you want to be able to access your plugin with a URL, defining
    an AppController and AppModel for a plugin is required. These two
    special classes are named after the plugin, and extend the parent
    application's AppController and AppModel. Here's what they should
    look like for our pizza example:

::

    // /app/Plugin/Pizza/Controller/PizzaAppController.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/Plugin/Pizza/Model/PizzaAppModel.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

If you forgot to define these special classes, CakePHP will hand
you "Missing Controller" errors until you’ve done so.

Please note that the process of creating plugins can be greatly
simplified by using the Cake shell.

In order to bake a plugin please use the following command:

::

    user@host$ cake bake plugin pizza

Now you can bake using the same conventions which apply to the rest
of your app. For example - baking controllers:

::

    user@host$ cake bake plugin pizza controller ingredients

Please refer to the chapter
:doc:`/console-and-shells/code-generation-with-bake` if you
have any problems with using the command line.


Plugin Controllers
-------------------

Controllers for our pizza plugin will be stored in
/app/Plugin/Pizza/Controller/. Since the main thing we'll be
tracking is pizza orders, we'll need an OrdersController for this
plugin.

Make sure to prepend the name of the plugin
to the classname (PizzaOrdersController, in this case) when 
referencing the class.

So, we place our new PizzaOrdersController in
/app/Plugin/Pizza/Controller and it looks like so:

::

    // /app/Plugin/Pizza/Controller/PizzaOrdersController.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }

.. note::

    This controller extends the plugin's AppController (called
    PizzaAppController) rather than the parent application's
    AppController.

Also note how the name of the model is prefixed with the name of
the plugin. This is required to differentiate between models in 
the plugin and models in the main application

If you want to access what we’ve got going thus far, visit
/pizza/pizza\_orders. You should get a “Missing Model” error
because we don’t have a PizzaOrder model defined yet.

.. _plugin-models:

Plugin Models
----------------

Models for the plugin are stored in /app/Plugin/Pizza/Model.
We've already defined a PizzaOrdersController for this plugin, so
let's create the model for that controller, called PizzaOrder.
PizzaOrder is consistent with our previously defined naming scheme
of pre-pending all of our plugin classes with Pizza.

::

    // /app/Plugin/Pizza/Model/PizzaOrder.php:
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>

Visiting /pizza/pizza_orders now (given you’ve got a table in your
database called ‘pizza\_orders’) should give us a “Missing View”
error. Let’s create that next.

.. note::

    If you need to reference a model within your plugin, you need to
    include the plugin name with the model name, separated with a dot.

For example:

::

    // /app/Plugin/Pizza/Model/ExampleModel.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>

If you would prefer that the array keys for the association not
have the plugin prefix on them, use the alternative syntax:

::

    // /app/Plugin/Pizza/Model/ExampleModel.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array(
                    'PizzaOrder' => array(
                            'className' => 'Pizza.PizzaOrder'
                    )
            );
    }
    ?>

Plugin Views
------------

Views behave exactly as they do in normal applications. Just place
them in the right folder inside of the /app/Plugin/[Plugin]/View/
folder. For our pizza ordering plugin, we'll need a view for our
PizzaOrdersController::index() action, so let's include that as
well:

::

    // /app/Plugin/Pizza/View/PizzaOrders/index.ctp:
    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

.. note::

    For information on how to use elements from a plugin, look up
    :ref:`view-elements`

Overriding plugin views from inside your application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can override any plugin views from inside your app using
special paths. If you have a plugin called 'Pizza' you can override
the view files of the plugin with more application specific view
logic by creating files using the following template
"app/View/Plugin/[Plugin]/[Controller]/[view].ctp". For the pizza
controller you could make the following file:

::

    /app/View/Plugin/Pizza/PizzaOrders/index.ctp

Creating this file, would allow you to override
"/app/Plugin/Pizza/View/Pizza\PizzaOrders/index.ctp".

.. _plugin-assets:

Plugin assets
--------------

Version 1.3 introduced an improved and simplified plugin webroot directory.
In the past plugins could have a vendors directory containing
``img``, ``js``, and ``css``. Each of these directories could only
contain the type of file they shared a name with. Starting with 1.3, both
plugins and themes can have a ``webroot`` directory. This directory
should contain any and all public accessible files for your plugin

::

    app/Plugin/DebugKit/webroot/
                                    css/
                                    js/
                                    img/
                                    flash/
                                    pdf/

And so on. You are no longer restricted to the three directories in
the past, and you may put any type of file in any directory, just
like a regular webroot. The only restriction is that ``MediaView``
needs to know the mime-type of that asset.

Linking to assets in plugins
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The urls to plugin assets remains the same. In the past you used
``/debug_kit/js/my_file.js`` to link to
``app/plugins/debug_kit/vendors/js/my_file.js``. It now links to
``app/Plugin/DebugKit/webroot/js/my_file.js``

.. note::

    It is important to note the **/your\_plugin/** prefix before the
    img, js or css path. That makes the magic happen!


Components, Helpers and Behaviors
----------------------------------

A plugin can have Components, Helpers and Behaviors just like a
regular CakePHP application. You can even create plugins that
consist only of Components, Helpers or Behaviors and can be a great
way to build reusable components that can easily be dropped into
any project.

Building these components is exactly the same as building it within
a regular application, with no special naming convention. Referring
to your components from within the plugin also does not require any
special reference.

::

    // Component
    class ExampleComponent extends Object {
    
    }
    
    // within your Plugin controllers:
    var $components = array('Plugin.Example'); 

Make sure to always prefix the component name with the plugin it
resides in.
::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // references ExampleComponent in Pizza plugin.

The same technique applies to Helpers and Behaviors.


Plugin Tips
------------

So, now that you've built everything, it should be ready to
distribute (though we'd suggest you also distribute a few extras
like a readme or SQL file).

Once a plugin has been installed in /app/Plugin, you can access it
at the URL /pluginname/controllername/action. In our pizza ordering
plugin example, we'd access our PizzaOrdersController at
/pizza/pizza_orders.

Some final tips on working with plugins in your CakePHP
applications:


-  When you don't have a [Plugin]AppController and
   [Plugin]AppModel, you'll get missing Controller errors when trying
   to access a plugin controller.
-  You can have a default controller with the name of your plugin.
   If you do that, you can access its index action via /[plugin].
   Unlike 1.2 only the index action route comes built in. Other
   shortcuts that were accessible in 1.2 will need to have routes made
   for them. This was done to fix a number of workarounds inside
   CakePHP
-  You can define your own layouts for plugins, inside
   app/Plugin/[Plugin]/View/Layouts. Otherwise, plugins will use the
   layouts from the /app/View/Layouts folder by default.
-  You can do inter-plugin communication by using
   $this->requestAction('/plugin/controller/action'); in your
   controllers.
-  If you use requestAction, make sure controller and model names
   are as unique as possible. Otherwise you might get PHP "redefined
   class ..." errors.

.. todo::

	This chapter feels incredibly outdated, and a bit repetitive. The pizza example is silly, we should change it to
	something a lot more useful like messages, forum, or users. The tips section dates from the 1.1 times, is not
	accurate at all.

        This tradition was continued by simply updating the existing page to use CakePHP 2.0 conventions--it still
        needs to be updated to be more relevant to current CakePHP development.
