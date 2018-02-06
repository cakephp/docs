Dispatcher Filters
##################

.. deprecated:: 3.3.0
    As of 3.3.0 Dispatcher Filters are deprecated. You should use
    :doc:`/controllers/middleware` instead now.

There are several reasons to want a piece of code to be run before any
controller code is executed or right before the response is sent to the client,
such as response caching, header tuning, special authentication or just to
provide access to a mission-critical API response in lesser time than a complete
request dispatching cycle would take.

CakePHP provides a clean interface for attaching filters to the dispatch
cycle. It is similar to a middleware layer, but re-uses the existing event
subsystem used in other parts of CakePHP. Since they do not work exactly
like traditional middleware, we refer to them as *Dispatcher Filters*.

Built-in Filters
================

CakePHP comes with several dispatcher filters built-in. They handle common
features that all applications are likely to need. The built-in filters are:

* ``AssetFilter`` checks whether the request is referring to a theme
  or plugin asset file, such as a CSS, JavaScript or image file stored in either a
  plugin's webroot folder or the corresponding one for a Theme. It will serve the
  file accordingly if found, stopping the rest of the dispatching cycle::

        // Use options to set cacheTime for your static assets
        // If not set, this defaults to +1 hour
        DispatcherFactory::add('Asset', ['cacheTime' => '+24 hours']);

* ``RoutingFilter`` applies application routing rules to the request URL.
  Populates ``$request->getParam()`` with the results of routing.
* ``ControllerFactory`` uses ``$request->getParam()`` to locate the controller that
  will handle the current request.
* ``LocaleSelector`` enables automatic language switching from the ``Accept-Language``
  header sent by the browser.

Using Filters
=============

Filters are usually enabled in your application's **bootstrap.php** file, but
you could load them any time before the request is dispatched.  Adding
and removing filters is done through :php:class:`Cake\\Routing\\DispatcherFactory`. By
default, the CakePHP application template comes with a couple filter classes
already enabled for all requests; let's take a look at how they are added::

    DispatcherFactory::add('Routing');
    DispatcherFactory::add('ControllerFactory');

    // Plugin syntax is also possible
    DispatcherFactory::add('PluginName.DispatcherName');

    // Use options to set priority
    DispatcherFactory::add('Asset', ['priority' => 1]);

Dispatcher filters with higher ``priority`` (lower numbers) - will be executed
first.  Priority defaults to ``10``.

While using the string name is convenient, you can also pass instances into
``add()``::

    use Cake\Routing\Filter\RoutingFilter;

    DispatcherFactory::add(new RoutingFilter());

Configuring Filter Order
------------------------

When adding filters, you can control the order they are invoked in using
event handler priorities. While filters can define a default priority using the
``$_priority`` property, you can set a specific priority when attaching the
filter::

    DispatcherFactory::add('Asset', ['priority' => 1]);
    DispatcherFactory::add(new AssetFilter(['priority' => 1]));

The higher the priority the later this filter will be invoked.

Conditionally Applying Filters
------------------------------

If you don't want to run a filter on every request, you can use conditions to
only apply it some of the time. You can apply conditions using the ``for`` and
``when`` options. The ``for`` option lets you match on URL substrings, while the
``when`` option allows you to run a callable::

    // Only runs on requests starting with `/blog`
    DispatcherFactory::add('BlogHeader', ['for' => '/blog']);

    // Only run on GET requests.
    DispatcherFactory::add('Cache', [
        'when' => function ($request, $response) {
            return $request->is('get');
        }
    ]);

The callable provided to ``when`` should return ``true`` when the filter should run.
The callable can expect to get the current request and response as arguments.

Building a Filter
=================

To create a filter, define a class in **src/Routing/Filter**. In this example,
we'll be making a filter that adds a tracking cookie for the first landing
page. First, create the file. Its contents should look like::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class TrackingCookieFilter extends DispatcherFilter
    {

        public function beforeDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');
            if (!$request->getCookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
        }
    }

Save this file into **src/Routing/Filter/TrackingCookieFilter.php**. As you can see, like other
classes in CakePHP, dispatcher filters have a few conventions:

* Class names end in ``Filter``.
* Classes are in the ``Routing\Filter`` namespace. For example,
  ``App\Routing\Filter``.
* Generally filters extend ``Cake\Routing\DispatcherFilter``.

``DispatcherFilter`` exposes two methods that can be overridden in subclasses,
they are ``beforeDispatch()`` and ``afterDispatch()``. These methods are
executed before or after any controller is executed respectively. Both methods
receive a :php:class:`Cake\\Event\\Event` object containing the ``ServerRequest`` and
``Response`` objects (:php:class:`Cake\\Http\\ServerRequest` and
:php:class:`Cake\\Http\\Response` instances) inside the ``$data`` property.

While our filter was pretty simple, there are a few other interesting things we
can do in filter methods. By returning an ``Response`` object, you can
short-circuit the dispatch process and prevent the controller from being called.
When returning a response, you should also remember to call
``$event->stopPropagation()`` so other filters are not called.

.. note::

    When a beforeDispatch method returns a response, the controller, and
    afterDispatch event will not be invoked.

Let's now create another filter for altering response headers in any public
page, in our case it would be anything served from the ``PagesController``::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class HttpCacheFilter extends DispatcherFilter
    {

        public function afterDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');

            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

    // In our bootstrap.php
    DispatcherFactory::add('HttpCache', ['for' => '/pages'])

This filter will send a expiration header to 1 day in the future for
all responses produced by the pages controller. You could of course do the same
in the controller, this is just an example of what could be done with filters.
For instance, instead of altering the response, you could cache it using
:php:class:`Cake\\Cache\\Cache` and serve the response from the ``beforeDispatch()``
callback.

While powerful, dispatcher filters have the potential to make your application
more difficult to maintain. Filters are an extremely powerful tool when used
wisely and adding response handlers for each URL in your app is not a good use for
them. Keep in mind that not everything needs to be a filter; `Controllers` and
`Components` are usually a more accurate choice for adding any request handling
code to your app.


.. meta::
    :title lang=en: Dispatcher Filters
    :description lang=en: Dispatcher filters are a middleware layer for CakePHP allowing to alter the request or response before it is sent
    :keywords lang=en: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
