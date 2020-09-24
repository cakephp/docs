Dependency Injection
####################

.. warning::
    The Dependency Injection container is an experimental feature that is not
    API stable yet.

The CakePHP service container enables you to manage class dependencies for your
application services through dependency injection. Dependency injection
automatically "injects" an object's dependencies via the constructor without
having to manually instantiate them.

You can use the service container to define 'application services'. These
classes can use models and interact with other objects like loggers and mailers
to build re-usable workflows and business logic for your application.

CakePHP will use the service container when calling actions on your controllers
and invoking console commands. You can also have dependencies injected into
controller constructors.

A short example would be::

    // In src/Controller/UsersController.php
    class UsersController extends AppController
    {
        // The $users service will be created via the service container.
        public function ssoCallback(UsersService $users)
        {
            if ($this->request->is('post')) {
                // Use the UsersService to create/get the user from a
                // Single Signon Provider.
                $user = $users->ensureExists($this->request->getData());
            }
        }
    }

In this example, the ``UsersController::ssoCallback()`` action needs to fetch
a user from a Single-Sign-On provider and ensure it exists in the local
database. Because this service is injected into our controller, we can easily
swap the implementation out with a mock object or a dummy sub-class when
testing.

Adding Services
===============

In order to have services created by the container, you need to tell it
which classes it can create and how to build those classes. The simplest
definition is via a class name::

    use App\Service\BillingService;

    // in your application's register() method.

    // Add a class by its name.
    $container->add(BillingService::class);

You can also define implementations for interfaces that your application uses::

    use App\Service\AuditLogServiceInterface;
    use App\Service\AuditLogService;

    // in your application's register() method.

    // Add an implementation for an interface.
    $container->add(AuditLogServiceInterface::class, AuditLogService::class);

The container can leverage factory functions to create objects if necessary::

    $container->add(AuditLogServiceInterface::class, function (...$args) {
        return new AuditLogService(...$args);
    });

Factory functions will receive all of the class' resolved dependencies as
arguments.

Once you've defined a class, you also need to define the dependencies it
requires. Those dependencies can be either objects or primitive values::

    // Add a primitive value like a string, array or number.
    $container->add('apiKey', 'abc123');

    $container->add(BillingService::class)
        ->addArgument('apiKey');

Adding Shared Services
----------------------

By default services are not shared. Every object (and dependencies) is created
each time it is fetched from the container. If you want to re-use a single
instance, often referred to as a singleton, you can mark a service as 'shared'::

    $container->share(BillingService::class);

Extending Definitions
---------------------

Once a service is defined you can modify or update the service definition by
extending them. This allows you to add additional arguments to services defined
elsewhere::

    // Add an argument to a partially defined service elsewhere.
    $container->extend(BillingService::class)
        ->addArgument('logLevel');

Tagging Services
----------------

By tagging services you can get have all of those services resolved at the same
time. This can be used to build services that combine collections of other
services like in a reporting system::

    $container->add(BillingReport::class)->addTag('reports');
    $container->add(UsageReport::class)->addTag('reports');

    $container->add(ReportAggregate::class, function () use ($container) {
        return new ReportAggregate($container->get('reports'));
    });

Using Configuration Data
------------------------

Often you'll need configuration data in your services. While you could register
all the configuration keys your service needs into the container, that can be
tedious. To make configuration easier to work with CakePHP includes an
injectable configuration reader::

    use Cake\Core\ServiceConfig;

    // Use a shared instance 
    $container->share(ServiceConfig::class);

The ``ServiceConfig`` class provides a read-only view of all the data available
in ``Configure`` so you don't have to worry about accidentally changing
configuration.

Service Providers
=================

* What is a service provider.
* Why use service providers

Creating Service Providers
--------------------------

* Example of service provider.
