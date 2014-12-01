Dispatcher Filters
##################

.. versionadded:: 2.2

There are several reasons to want a piece of code to be run before any
controller code is executed or right before the response is sent to the client,
such as response caching, header tuning, special authentication or just to
provide access to a mission-critical
API response in lesser time than a complete
request dispatching cycle would take.

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

As shown above, you can pass any valid PHP `callback <http://php.net/callback>`_
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
            }
        }
    }

This class should be saved in a file in ``app/Routing/Filter/HelloWorldFilter.php``
and configured in the bootstrap file according to how it was explained in the
previous section. There is plenty to explain here, let's begin with the
``$priority`` value.

As mentioned before, when using filter classes you can only define the order in
which they are run using the ``$priority`` property in the class, default value is
10 if the property is declared, this means that it will get executed _after_ the
Router class has parsed the request. We do not want this to happen in our
previous example, because most probably you do not have any controller set up
for answering to that URL, hence we chose 9 as our priority.

``DispatcherFilter`` exposes two methods that can be overridden in subclasses,
they are ``beforeDispatch`` and ``afterDispatch``, and are executed before or after
any controller is executed respectively. Both methods receive a  :php:class:`CakeEvent`
object containing the ``request`` and ``response`` objects
(:php:class:`CakeRequest` and :php:class:`CakeResponse` instances) along with an
``additionalParams`` array inside the ``data`` property. The latter contains
information used for internal dispatching when calling ``requestAction``.

In our example we conditionally returned the ``$response`` object as a result,
this will tell the Dispatcher to not instantiate any controller and return such
object as response immediately to the client. We also added
``$event->stopPropagation()`` to prevent other filters from being executed after
this one.

Let's now create another filter for altering response headers in any public
page, in our case it would be anything served from the ``PagesController``::

    App::uses('DispatcherFilter', 'Routing');
    class HttpCacheFilter extends DispatcherFilter {

        public function afterDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->params['controller'] !== 'pages') {
                return;
            }
            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

This filter will send a expiration header to 1 day in the future for
all responses produced by the pages controller. You could of course do the same
in the controller, this is just an example of what could be done with filters.
For instance, instead of altering the response you could cache it using the
:php:class:`Cache` class and serve the response from the ``beforeDispatch``
callback.

Inline Filters
==============

Our last example will use an anonymous function (only available on PHP 5.3+) to
serve a list of posts in JSON format, we encourage you to do so using
controllers and the :php:class:`JsonView` class, but let's imagine you need to save a
few milliseconds for this mission-critical API endpoint::

    $postsList = function($event) {
        if ($event->data['request']->url !== 'posts/recent.json') {
            return;
        }
        App::uses('ClassRegistry', 'Utility');
        $postModel = ClassRegistry::init('Post');
        $event->data['response']->body(json_encode($postModel->find('recent')));
        $event->stopPropagation();
        return $event->data['response'];
    };

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher',
        'recent-posts' => array(
            'callable' => $postsList,
            'priority' => 9,
            'on'=> 'before'
        )
    ));

In previous example we have selected a priority of ``9`` for our filter, so to skip
any other logic either placed in custom or core filters such as CakePHP internal
routing system. Although it is not required, it shows how to make your important
code run first in case you need to trim as much fat as possible from some requests.

For obvious reasons this has the potential of making your app very difficult
to maintain. Filters are an extremely powerful tool when used wisely, adding
response handlers for each URL in your app is not a good use for it. But if you
got a valid reason to do so, then you have a clean solution at hand. Keep in
mind that not everything needs to be a filter, `Controllers` and `Components` are
usually a more accurate choice for adding any request handling code to your app.

.. meta::
    :title lang=en: Dispatcher Filters
    :description lang=en: Dispatcher filters are a middleware layer for CakePHP allowing to alter the request or response before it is sent
    :keywords lang=en: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
