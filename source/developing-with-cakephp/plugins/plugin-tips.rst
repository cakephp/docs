3.14.7 Plugin Tips
------------------

So, now that you've built everything, it should be ready to
distribute (though we'd suggest you also distribute a few extras
like a readme or SQL file).

Once a plugin has been installed in /app/plugins, you can access it
at the URL /pluginname/controllername/action. In our pizza ordering
plugin example, we'd access our PizzaOrdersController at
/pizza/pizzaOrders.

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
   app/plugins/[plugin]/views/layouts. Otherwise, plugins will use the
   layouts from the /app/views/layouts folder by default.
-  You can do inter-plugin communication by using
   $this->requestAction('/plugin/controller/action'); in your
   controllers.
-  If you use requestAction, make sure controller and model names
   are as unique as possible. Otherwise you might get PHP "redefined
   class ..." errors.

3.14.7 Plugin Tips
------------------

So, now that you've built everything, it should be ready to
distribute (though we'd suggest you also distribute a few extras
like a readme or SQL file).

Once a plugin has been installed in /app/plugins, you can access it
at the URL /pluginname/controllername/action. In our pizza ordering
plugin example, we'd access our PizzaOrdersController at
/pizza/pizzaOrders.

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
   app/plugins/[plugin]/views/layouts. Otherwise, plugins will use the
   layouts from the /app/views/layouts folder by default.
-  You can do inter-plugin communication by using
   $this->requestAction('/plugin/controller/action'); in your
   controllers.
-  If you use requestAction, make sure controller and model names
   are as unique as possible. Otherwise you might get PHP "redefined
   class ..." errors.
