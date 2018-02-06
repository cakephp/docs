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

<<<<<<< HEAD
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
=======
CakePHP provides for such cases a clean and extensible interface for attaching
filters to this dispatching cycle, similar to a middleware layer thought to
provide stackable services or routines for every request. We call them
`Dispatcher Filters`

Configuring Filters
===================

Filters are usually configured in the ``bootstrap.php`` file, but you could easily
load them from any other configuration file before the request is dispatched.
Adding and removing filters is done through the `Configure` class, using the
special key ``Dispatcher.filters``. By default CakePHP comes with a couple filter
classes already enabled for all requests, let's take a look at how they are
added::

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

Each of those array values are class names that will be instantiated and added
as listeners for the events generated at dispatcher level. The first one,
``AssetDispatcher`` is meant to check whether the request is referring to a theme
or plugin asset file, such as a CSS, JavaScript or image stored on either a
plugin's webroot folder or the corresponding one for a Theme. It will serve the
file accordingly if found, stopping the rest of the dispatching cycle. The ``CacheDispatcher``
filter, when ``Cache.check`` config variable is enabled, will check if the
response was already cached in the file system for a similar request and serve
the cached code immediately.

As you can see, both provided filters have the responsibility of stopping any
further code and send the response right away to the client. But filters are not
limited to this role, as we will show shortly in this section.

You can add your own class names to the list of filters, and they will get
executed in the order they were defined. There is also an alternative way for
attaching filters that do not involve the special ``DispatcherFilter`` classes::

    Configure::write('Dispatcher.filters', array(
        'my-filter' => array(
            'callable' => array($classInstance, 'methodName'),
            'on' => 'after'
        )
    ));

As shown above, you can pass any valid PHP `callback <https://secure.php.net/callback>`_
type, as you may remember, a `callback` is anything that PHP can execute with
``call_user_func``. We do make a little exception, if a string is provided it will
be treated as a class name, not as a possible function name. This of course
gives the ability to PHP 5.3 users to attach anonymous functions as filters::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array('callable' => function($event) {...}, 'on' => 'before'),
       //more filters here
    ));


The ``on`` key only takes ``before`` and ``after`` as valid values, and evidently
means whether the filter should run before or after any controller code is
executed. Additionally to defining filters with the ``callable`` key, you also
get the chance to define a priority for your filters, if none is specified then
a default of ``10`` is selected for you

As all filters will have default priority ``10``, should you want to run a filter before
any other in the list, select lower priority numbers as needed::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array(
            'callable' => function($event) {...},
            'on' => 'before',
            'priority' => 5
        ),
        'other-filter' => array(
            'callable' => array($class, 'method'),
            'on' => 'after',
            'priority' => 1
        ),
       //more filters here
    ));

Obviously, when defining priorities the order in which filters are declared does
not matter but for those having the same. When defining filters as class names
there is no option to define priority in-line, we will get into that soon.
Finally, CakePHP's plugin notation can be used to define filters located in
plugins::

    Configure::write('Dispatcher.filters', array(
        'MyPlugin.MyFilter',
    ));

Feel free to remove the default attached filters if you choose to use a more
advanced/faster way of serving theme and plugin assets or if you do not wish to
use built-in full page caching, or just implement your own.

If you need to pass constructor parameters or settings to you dispatch filter
classes you can do that by providing an array of settings::

    Configure::write('Dispatcher.filters', array(
        'MyAssetFilter' => array('service' => 'google.com')
    ));

When the filter key is a valid classname, the value can be an array of
parameters that are passed to the dispatch filter. By default the base class
will assign these settings to the ``$settings`` property after merging them with
the defaults in the class.

.. versionchanged:: 2.5
    You can now provide constructor settings to dispatch filters in 2.5.

Filter Classes
==============

Dispatcher filters, when defined as class names in configuration, should extend
the class ``DispatcherFilter`` provided in the `Routing` CakePHP's directory.
Let's create a simple filter to respond to a specific URL with a 'Hello World'
text::

    App::uses('DispatcherFilter', 'Routing');
    class HelloWorldFilter extends DispatcherFilter {

        public $priority = 9;

        public function beforeDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->url === 'hello-world') {
                $response->body('Hello World');
                $event->stopPropagation();
                return $response;
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
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
