3.14.1 Creating a Plugin
------------------------

As a working example, let's create a new plugin that orders pizza
for you. To start out, we'll need to place our plugin files inside
the /app/plugins folder. The name of the parent folder for all the
plugin files is important, and will be used in many places, so pick
wisely. For this plugin, let's use the name '**pizza**'. This is
how the setup will eventually look:

::

    /app
         /plugins
             /pizza
                 /controllers                <- plugin controllers go    here
                 /models                     <- plugin models go    here
                 /views                      <- plugin views go    here
                 /pizza_app_controller.php   <- plugin's AppController
                 /pizza_app_model.php        <- plugin's AppModel 

If you want to be able to access your plugin with a URL, defining
an AppController and AppModel for a plugin is required. These two
special classes are named after the plugin, and extend the parent
application's AppController and AppModel. Here's what they should
look like for our pizza example:

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>


#. ``// /app/plugins/pizza/pizza_app_controller.php:``
#. ``<?php``
#. ``class PizzaAppController extends AppController {``
#. ``//...``
#. ``}``
#. ``?>``

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>


#. ``// /app/plugins/pizza/pizza_app_model.php:``
#. ``<?php``
#. ``class PizzaAppModel extends AppModel {``
#. ``//...``
#. ``}``
#. ``?>``

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
`dedicated to bake </view/1522/Code-Generation-with-Bake>`_ if you
have any problems with using the command line.

3.14.1 Creating a Plugin
------------------------

As a working example, let's create a new plugin that orders pizza
for you. To start out, we'll need to place our plugin files inside
the /app/plugins folder. The name of the parent folder for all the
plugin files is important, and will be used in many places, so pick
wisely. For this plugin, let's use the name '**pizza**'. This is
how the setup will eventually look:

::

    /app
         /plugins
             /pizza
                 /controllers                <- plugin controllers go    here
                 /models                     <- plugin models go    here
                 /views                      <- plugin views go    here
                 /pizza_app_controller.php   <- plugin's AppController
                 /pizza_app_model.php        <- plugin's AppModel 

If you want to be able to access your plugin with a URL, defining
an AppController and AppModel for a plugin is required. These two
special classes are named after the plugin, and extend the parent
application's AppController and AppModel. Here's what they should
look like for our pizza example:

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>


#. ``// /app/plugins/pizza/pizza_app_controller.php:``
#. ``<?php``
#. ``class PizzaAppController extends AppController {``
#. ``//...``
#. ``}``
#. ``?>``

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>


#. ``// /app/plugins/pizza/pizza_app_model.php:``
#. ``<?php``
#. ``class PizzaAppModel extends AppModel {``
#. ``//...``
#. ``}``
#. ``?>``

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
`dedicated to bake </view/1522/Code-Generation-with-Bake>`_ if you
have any problems with using the command line.
