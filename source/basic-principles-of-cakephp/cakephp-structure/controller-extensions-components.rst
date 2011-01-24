Controller Extensions ("Components")
####################################

A Component is a class that aids in controller logic. If you have
some logic you want to share between controllers (or applications),
a component is usually a good fit. As an example, the core
EmailComponent class makes creating and sending emails a snap.
Rather than writing a controller method in a single controller that
performs this logic, you can package the logic so it can be
shared.

Controllers are also fitted with callbacks. These callbacks are
available for your use, just in case you need to insert some logic
between CakePHP’s core operations. Callbacks available include:


-  ``beforeFilter()``, executed before any controller action logic
-  ``beforeRender()``, executed after controller logic, but before
   the view is rendered
-  ``afterFilter()``, executed after all controller logic,
   including the view render. There may be no difference between
   ``afterRender()`` and ``afterFilter()`` unless you’ve manually made
   a call to ``render()`` in your controller action and have included
   some logic after that call.
