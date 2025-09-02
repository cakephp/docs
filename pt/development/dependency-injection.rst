Dependency Injection
####################

The CakePHP service container enables you to manage class dependencies for your
application services through dependency injection. Dependency injection
automatically "injects" an object's dependencies via the constructor without
having to manually instantiate them.

You can use the service container to define 'application services'. These
classes can use models and interact with other objects like loggers and mailers
to build re-usable workflows and business logic for your application.

CakePHP will use the :term:`DI container` in the following situations:

* Constructing controllers.
* Calling actions on your controllers.
* Constructing Components.
* Constructing Console Commands.
* Constructing Middleware by classname.

Controller Example
==================

::

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

    // In src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->add(UsersService::class);
    }

In this example, the ``UsersController::ssoCallback()`` action needs to fetch
a user from a Single-Sign-On provider and ensure it exists in the local
database. Because this service is injected into our controller, we can easily
swap the implementation out with a mock object or a dummy sub-class when
testing.

Command Example
===============

::

    // In src/Command/CheckUsersCommand.php
    use Cake\Console\CommandFactoryInterface;

    class CheckUsersCommand extends Command
    {
        public function __construct(protected UsersService $users, ?CommandFactoryInterface $factory = null)
        {
            parent::__construct($factory);
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $valid = $this->users->check('all');
        }

    }

    // In src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container
            ->add(CheckUsersCommand::class)
            ->addArgument(UsersService::class)
            ->addArgument(CommandFactoryInterface::class);
        $container->add(UsersService::class);
    }

The injection process is a bit different here. Instead of adding the
``UsersService`` to the container we first have to add the Command as
a whole to the Container and add the ``UsersService`` as an argument.
With that you can then access that service inside the constructor
of the command.

Component Example
=================

::

    // In src/Controller/Component/SearchComponent.php
    class SearchComponent extends Component
    {
        public function __construct(
            ComponentRegistry $registry,
            private UserService $users,
            array $config = []
        ) {
            parent::__construct($registry, $config);
        }

        public function something()
        {
            $valid = $this->users->check('all');
        }
    }

    // In src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->add(SearchComponent::class)
            ->addArgument(ComponentRegistry::class)
            ->addArgument(UsersService::class);
        $container->add(UsersService::class);
    }

Adding Services
===============

In order to have services created by the container, you need to tell it which
classes it can create and how to build those classes. The
simplest definition is via a class name::

    // Add a class by its name.
    $container->add(BillingService::class);

Your application and plugins define the services they have in the
``services()`` hook method::

    // in src/Application.php
    namespace App;

    use App\Service\BillingService;
    use Cake\Core\ContainerInterface;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function services(ContainerInterface $container): void
        {
            $container->add(BillingService::class);
        }
    }

You can define implementations for interfaces that your application uses::

    use App\Service\AuditLogServiceInterface;
    use App\Service\AuditLogService;

    // in your Application::services() method.

    // Add an implementation for an interface.
    $container->add(AuditLogServiceInterface::class, AuditLogService::class);

The container can leverage factory functions to create objects if necessary::

    $container->add(AuditLogServiceInterface::class, function (...$args) {
        return new AuditLogService(...$args);
    });

Factory functions will receive all of the resolved dependencies for the class
as arguments.

Once you've defined a class, you also need to define the dependencies it
requires. Those dependencies can be either objects or primitive values::

    // Add a primitive value like a string, array or number.
    $container->add('apiKey', 'abc123');

    $container->add(BillingService::class)
        ->addArgument('apiKey');

Your services can depend on ``ServerRequest`` in controller actions as it will
be added automatically.

Adding Shared Services
----------------------

By default services are not shared. Every object (and dependencies) is created
each time it is fetched from the container. If you want to re-use a single
instance, often referred to as a singleton, you can mark a service as 'shared'::

    // in your Application::services() method.

    $container->addShared(BillingService::class);

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

By tagging services you can get all of those services resolved at the same
time. This can be used to build services that combine collections of other
services like in a reporting system::

    $container->add(BillingReport::class)->addTag('reports');
    $container->add(UsageReport::class)->addTag('reports');

    $container->add(ReportAggregate::class, function () use ($container) {
        return new ReportAggregate($container->get('reports'));
    });

Using Configuration Data
------------------------

Often you'll need configuration data in your services. While you could add
all the configuration keys your service needs into the container, that can be
tedious. To make configuration easier to work with CakePHP includes an
injectable configuration reader::

    use Cake\Core\ServiceConfig;

    // Use a shared instance
    $container->addShared(ServiceConfig::class);

The ``ServiceConfig`` class provides a read-only view of all the data available
in ``Configure`` so you don't have to worry about accidentally changing
configuration.

Service Providers
=================

Service providers allow you to group related services together helping you
organize your services. Service providers can help increase your application's
performance as defined services are lazily registered after
their first use.

Creating Service Providers
--------------------------

An example ServiceProvider would look like::

    namespace App\ServiceProvider;

    use Cake\Core\ContainerInterface;
    use Cake\Core\ServiceProvider;
    // Other imports here.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function services(ContainerInterface $container): void
        {
            $container->add(StripeService::class);
            $container->add('configKey', 'some value');
        }
    }

Service providers use their ``services()`` method to define all the services they
will provide. Additionally those services  **must be** defined in the ``$provides``
property. Failing to include a service in the ``$provides`` property will result
in it not be loadable from the container.

Using Service Providers
-----------------------

To load a service provider add it into the container using the
``addServiceProvider()`` method::

    // in your Application::services() method.
    $container->addServiceProvider(new BillingServiceProvider());

Bootable ServiceProviders
-------------------------

If your service provider needs to run logic when it is added to the container,
you can implement the ``bootstrap()`` method. This situation can come up when your
service provider needs to load additional configuration files, load additional
service providers or modify a service defined elsewhere in your application. An
example of a bootable service would be::

    namespace App\ServiceProvider;

    use Cake\Core\ServiceProvider;
    // Other imports here.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function bootstrap($container)
        {
            $container->addServiceProvider(new InvoicingServiceProvider());
        }
    }


.. _mocking-services-in-tests:

Mocking Services in Tests
=========================

In tests that use ``ConsoleIntegrationTestTrait`` or ``IntegrationTestTrait``
you can replace services that are injected via the container with mocks or
stubs::

    // In a test method or setup().
    $this->mockService(StripeService::class, function () {
        return new FakeStripe();
    });

    // If you need to remove a mock
    $this->removeMockService(StripeService::class);

Any defined mocks will be replaced in your application's container during
testing, and automatically injected into your controllers and commands. Mocks
are cleaned up at the end of each test.

Auto Wiring
===============

Auto Wiring is turned off by default. To enable it::

    // In src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->delegate(
            new \League\Container\ReflectionContainer()
        );
    }

While your dependencies will now be resolved automatically, this approach will
not cache resolutions which can be detrimental to performance. To enable
caching::

    $container->delegate(
         // or consider using the value of Configure::read('debug')
        new \League\Container\ReflectionContainer(true)
    );

Read more about auto wiring in the `PHP League Container documentation
<https://container.thephpleague.com/4.x/auto-wiring/>`_.
