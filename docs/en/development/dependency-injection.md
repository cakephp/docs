# Dependency Injection

The CakePHP service container enables you to manage class dependencies for your
application services through dependency injection. Dependency injection
automatically "injects" an object's dependencies via the constructor without
having to manually instantiate them.

You can use the service container to define 'application services'. These
classes can use models and interact with other objects like loggers and mailers
to build re-usable workflows and business logic for your application.

## Why Use Dependency Injection?

Dependency injection helps you build more maintainable, testable, and flexible applications:

### Testability

::: code-group

```php [❌ Without DI]
// Hard to test - always sends real emails
public function register()
{
    $mailer = new Mailer('default');
    $mailer->setTo($user->email)
        ->setSubject('Welcome!')
        ->send();
}
```

```php [✅ With DI]
// Easy to test - inject a mock email service
public function register(EmailService $emails)
{
    $emails->sendWelcome($user);
}
```

:::

### Flexibility

::: code-group

```php [❌ Without DI]
// Tightly coupled to local storage
public function upload()
{
    $path = WWW_ROOT . 'files/' . $filename;
    move_uploaded_file($tmpFile, $path);
}
```

```php [✅ With DI]
// Works with local, S3, or any storage - just change the service definition
public function upload(StorageService $storage)
{
    $storage->put($filename, $tmpFile);
}
```

:::

### Separation of Concerns

> [!TIP]
> Services help you organize complex business logic outside controllers:
>
> - **Controllers** handle HTTP requests and responses
> - **Services** contain business logic and workflows
> - **Models** manage data access and validation

### When NOT to Use DI

> [!WARNING]
> Dependency injection is powerful but not always necessary:
>
> - **Simple CRUD operations** → Use Table classes directly in controllers
> - **Entity-specific logic** → Use Entity methods
> - **View formatting** → Use View Helpers
> - **Data validation** → Use Table validation rules
> - **Database queries** → Use Table or Query objects

> [!TIP]
> Use services when you have:
>
> - Complex business workflows spanning multiple models
> - External API integrations
> - Logic that needs to be reused across controllers
> - Code that needs extensive unit testing

## Where CakePHP Uses DI

CakePHP will use the `DI container` in the following situations:

- Constructing controllers.
- Calling actions on your controllers.
- Constructing Components.
- Constructing Console Commands.
- Constructing Middleware by classname.

## Real-World Examples

### Email Service Example

Instead of directly using `Mailer` in controllers, create a service to handle all email operations:

::: details Click to see complete EmailService implementation

```php
// In src/Service/EmailService.php
namespace App\Service;

use Cake\Mailer\Mailer;

class EmailService
{
    public function __construct(private Mailer $mailer)
    {
    }

    public function sendWelcome(User $user): void
    {
        $this->mailer
            ->setTo($user->email)
            ->setSubject('Welcome to our platform!')
            ->setViewVars(['name' => $user->name])
            ->viewBuilder()
                ->setTemplate('welcome');

        $this->mailer->deliver();
    }

    public function sendPasswordReset(User $user, string $token): void
    {
        $resetUrl = Router::url(['controller' => 'Users', 'action' => 'reset', $token], true);

        $this->mailer
            ->setTo($user->email)
            ->setSubject('Password Reset Request')
            ->setViewVars(['resetUrl' => $resetUrl, 'name' => $user->name])
            ->viewBuilder()
                ->setTemplate('password_reset');

        $this->mailer->deliver();
    }
}

// In src/Controller/UsersController.php
class UsersController extends AppController
{
    public function register(EmailService $emails)
    {
        $user = $this->Users->newEmptyEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user)) {
                // Service handles all email complexity
                $emails->sendWelcome($user);
                $this->Flash->success('Registration successful!');

                return $this->redirect(['action' => 'login']);
            }
        }
        $this->set(compact('user'));
    }

    public function forgotPassword(EmailService $emails)
    {
        if ($this->request->is('post')) {
            $email = $this->request->getData('email');
            $user = $this->Users->findByEmail($email)->first();

            if ($user) {
                $token = $this->Users->generateResetToken($user);
                $emails->sendPasswordReset($user, $token);
            } else {
                // Generate dummy token to prevent timing attacks
                hash('sha256', $email . Security::randomBytes(32));
            }

            // Always show success to prevent email enumeration
            $this->Flash->success('If that email exists, a reset link has been sent.');
        }
    }
}

// In src/Application.php
public function services(ContainerInterface $container): void
{
    $container->add(EmailService::class)
        ->addArgument(Mailer::class);
}
```

:::

### Payment Processing Service

Encapsulate payment gateway logic for easy testing and swapping:

::: details Click to see complete PaymentService implementation

```php
// In src/Service/PaymentService.php
namespace App\Service;

use Stripe\StripeClient;
use App\Model\Entity\Order;

class PaymentService
{
    public function __construct(
        private StripeClient $stripe,
        private LoggerInterface $logger
    ) {
    }

    public function processOrder(Order $order): array
    {
        try {
            $intent = $this->stripe->paymentIntents->create([
                'amount' => $order->total_cents,
                'currency' => 'usd',
                'metadata' => ['order_id' => $order->id],
            ]);

            $this->logger->info('Payment intent created', [
                'order_id' => $order->id,
                'intent_id' => $intent->id,
            ]);

            return [
                'success' => true,
                'client_secret' => $intent->client_secret,
                'intent_id' => $intent->id,
            ];
        } catch (\Exception $e) {
            $this->logger->error('Payment failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Payment processing failed',
            ];
        }
    }

    public function refund(Order $order): bool
    {
        // Refund logic here
        return true;
    }
}

// In src/Controller/OrdersController.php
class OrdersController extends AppController
{
    public function checkout(PaymentService $payments)
    {
        $order = $this->Orders->get($this->request->getQuery('order_id'));

        $result = $payments->processOrder($order);

        if ($result['success']) {
            $this->set('clientSecret', $result['client_secret']);
        } else {
            $this->Flash->error($result['error']);
        }
    }
}

// In src/Application.php
public function services(ContainerInterface $container): void
{
    $container->add(PaymentService::class)
        ->addArgument(StripeClient::class)
        ->addArgument(LoggerInterface::class);

    // Configure Stripe with API key from config
    $container->add(StripeClient::class, function () {
        return new StripeClient(Configure::readOrFail('Stripe.secretKey'));
    });
}
```

:::

### File Storage Service

Abstract file storage to easily switch between local, S3, or other providers:

::: details Click to see complete StorageService implementation

```php
// In src/Service/StorageService.php
namespace App\Service;

interface StorageServiceInterface
{
    public function put(string $path, $contents): bool;
    public function get(string $path): ?string;
    public function delete(string $path): bool;
    public function url(string $path): string;
}

class LocalStorageService implements StorageServiceInterface
{
    public function __construct(private string $basePath)
    {
    }

    public function put(string $path, $contents): bool
    {
        // Normalize path to prevent directory traversal
        $path = str_replace(['..', '\\'], ['', '/'], $path);
        $fullPath = $this->basePath . DS . $path;
        $dir = dirname($fullPath);

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        return file_put_contents($fullPath, $contents) !== false;
    }

    public function get(string $path): ?string
    {
        $fullPath = $this->basePath . DS . $path;
        return is_file($fullPath) ? file_get_contents($fullPath) : null;
    }

    public function delete(string $path): bool
    {
        $fullPath = $this->basePath . DS . $path;
        return is_file($fullPath) ? unlink($fullPath) : false;
    }

    public function url(string $path): string
    {
        return Router::url('/files/' . $path, true);
    }
}

// In src/Controller/DocumentsController.php
class DocumentsController extends AppController
{
    public function upload(StorageServiceInterface $storage)
    {
        if ($this->request->is('post')) {
            $file = $this->request->getData('document');

            $filename = uniqid() . '_' . $file->getClientFilename();
            $path = 'documents/' . $filename;

            if ($storage->put($path, $file->getStream()->getContents())) {
                $document = $this->Documents->newEntity([
                    'filename' => $filename,
                    'path' => $path,
                    'url' => $storage->url($path),
                ]);

                $this->Documents->saveOrFail($document);
                $this->Flash->success('Document uploaded successfully');
            }
        }
    }
}

// In src/Application.php
public function services(ContainerInterface $container): void
{
    // Use local storage in development
    if (Configure::read('debug')) {
        $container->add(StorageServiceInterface::class, function () {
            return new LocalStorageService(WWW_ROOT . 'files');
        });
    } else {
        // Use S3 in production (S3StorageService not shown)
        $container->add(StorageServiceInterface::class, S3StorageService::class);
    }
}
```

:::

## Controller Example

``` php
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
```

In this example, the `UsersController::ssoCallback()` action needs to fetch
a user from a Single-Sign-On provider and ensure it exists in the local
database. Because this service is injected into our controller, we can easily
swap the implementation out with a mock object or a dummy sub-class when
testing.

## Command Example

``` php
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
```

The injection process is a bit different here. Instead of adding the
`UsersService` to the container we first have to add the Command as
a whole to the Container and add the `UsersService` as an argument.
With that you can then access that service inside the constructor
of the command.

## Component Example

``` php
// In src/Controller/Component/SearchComponent.php
class SearchComponent extends Component
{
    public function __construct(
        ComponentRegistry $registry,
        private UserService $users,
        array $config = [],
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
```

## Adding Services

> [!NOTE]
> CakePHP's dependency injection container uses [PSR-11](https://www.php-fig.org/psr/psr-11/) for compatibility with other frameworks and libraries.

In order to have services created by the container, you need to tell it which
classes it can create and how to build those classes. The
simplest definition is via a class name:

``` php
// Add a class by its name.
$container->add(BillingService::class);
```

Your application and plugins define the services they have in the
`services()` hook method:

``` php
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
```

You can define implementations for interfaces that your application uses:

``` php
use App\Service\AuditLogServiceInterface;
use App\Service\AuditLogService;

// in your Application::services() method.

// Add an implementation for an interface.
$container->add(AuditLogServiceInterface::class, AuditLogService::class);
```

The container can leverage factory functions to create objects if necessary:

``` php
$container->add(AuditLogServiceInterface::class, function (...$args) {
    return new AuditLogService(...$args);
});
```

Factory functions will receive all the resolved dependencies for the class
as arguments.

Once you've defined a class, you also need to define the dependencies it
requires. Those dependencies can be either objects or primitive values:

``` php
// Add a primitive value like a string, array or number.
$container->add('apiKey', 'abc123');

$container->add(BillingService::class)
    ->addArgument('apiKey');
```

Your services can depend on `ServerRequest` in controller actions as it will
be added automatically.

### Adding Shared Services

> [!IMPORTANT]
> Services are **not shared by default** - each request creates a new instance. Use `addShared()` to create singleton services that persist across requests.

By default, services are not shared. Every object (and dependencies) is created
each time it is fetched from the container. If you want to re-use a single
instance, often referred to as a singleton, you can mark a service as 'shared':

``` php
// in your Application::services() method.

$container->addShared(BillingService::class);
```

### Using ORM Tables as Services

If you want to have ORM Tables injected as a dependency to a service, you can
add `TableContainer` to your application's service container:

``` php
use Cake\ORM\Locator\TableContainer;

// In your Application::services() method.
// Allow your Tables to be dependency injected.
$container->delegate(new TableContainer());
```

::: info Added in version 5.3.0
`TableContainer` was added.
:::

### Extending Definitions

Once a service is defined you can modify or update the service definition by
extending them. This allows you to add additional arguments to services defined
elsewhere:

``` php
// Add an argument to a partially defined service elsewhere.
$container->extend(BillingService::class)
    ->addArgument('logLevel');
```

### Tagging Services

By tagging services you can get all of those services resolved at the same
time. This can be used to build services that combine collections of other
services like in a reporting system:

``` php
$container->add(BillingReport::class)->addTag('reports');
$container->add(UsageReport::class)->addTag('reports');

$container->add(ReportAggregate::class, function () use ($container) {
    return new ReportAggregate($container->get('reports'));
});
```

<a id="configure-dependency-injection"></a>

### Using Configuration Data

Often you'll need configuration data in your services. If you need a specific value,
you can inject it as a constructor argument using the `Cake\Core\Attribute\Configure`
attribute:

``` php
use Cake\Core\Attribute\Configure;

class InjectedService
{
    public function __construct(
        #[Configure('MyService.apiKey')] protected string $apiKey,
    ) { }
}
```

::: info Added in version 5.3.0
:::

If you want to inject a copy of all configuration data, CakePHP includes
an injectable configuration reader:

``` php
use Cake\Core\ServiceConfig;

// Use a shared instance
$container->addShared(ServiceConfig::class);
```

The `ServiceConfig` class provides a read-only view of all the data available
in `Configure` so you don't have to worry about accidentally changing
configuration.

## Service Providers

Service providers allow you to group related services together helping you
organize your services. Service providers can help increase your application's
performance as defined services are lazily registered after
their first use.

### Creating Service Providers

An example ServiceProvider would look like:

``` php
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
```

Service providers use their `services()` method to define all the services they
will provide. Additionally those services **must be** defined in the `$provides`
property. Failing to include a service in the `$provides` property will result
in it not be loadable from the container.

### Using Service Providers

To load a service provider add it into the container using the
`addServiceProvider()` method:

``` php
// in your Application::services() method.
$container->addServiceProvider(new BillingServiceProvider());
```

### Bootable ServiceProviders

If your service provider needs to run logic when it is added to the container,
you can implement the `bootstrap()` method. This situation can come up when your
service provider needs to load additional configuration files, load additional
service providers or modify a service defined elsewhere in your application. An
example of a bootable service would be:

``` php
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
```

## Mocking Services in Tests

In tests that use `ConsoleIntegrationTestTrait` or `IntegrationTestTrait`
you can replace services that are injected via the container with mocks or
stubs:

```php
// In a test method or setup().
$this->mockService(StripeService::class, function () {
    return new FakeStripe();
});

// If you need to remove a mock
$this->removeMockService(StripeService::class);
```

Any defined mocks will be replaced in your application's container during
testing, and automatically injected into your controllers and commands. Mocks
are cleaned up at the end of each test.

### Testing Services with Mocks

Here's how to test the `EmailService` and `PaymentService` examples from earlier:

::: details Click to see complete test examples

```php
// tests/TestCase/Controller/UsersControllerTest.php
namespace App\Test\TestCase\Controller;

use App\Service\EmailService;
use Cake\TestSuite\IntegrationTestTrait;
use Cake\TestSuite\TestCase;

class UsersControllerTest extends TestCase
{
    use IntegrationTestTrait;

    protected array $fixtures = ['app.Users'];

    public function testRegisterSendsWelcomeEmail(): void
    {
        // Create a mock that tracks if sendWelcome was called
        $emailServiceMock = $this->createMock(EmailService::class);
        $emailServiceMock->expects($this->once())
            ->method('sendWelcome')
            ->with($this->callback(function ($user) {
                return $user->email === 'test@example.com';
            }));

        // Replace the real service with our mock
        $this->mockService(EmailService::class, function () use ($emailServiceMock) {
            return $emailServiceMock;
        });

        // Make the request
        $this->post('/users/register', [
            'email' => 'test@example.com',
            'name' => 'Test User',
            'password' => 'secret123',
        ]);

        $this->assertResponseSuccess();
        $this->assertFlashMessage('Registration successful!');
    }
}

// tests/TestCase/Controller/OrdersControllerTest.php
namespace App\Test\TestCase\Controller;

use App\Service\PaymentService;
use Cake\TestSuite\IntegrationTestTrait;
use Cake\TestSuite\TestCase;

class OrdersControllerTest extends TestCase
{
    use IntegrationTestTrait;

    protected array $fixtures = ['app.Orders'];

    public function testCheckoutWithSuccessfulPayment(): void
    {
        // Mock successful payment
        $paymentMock = $this->createMock(PaymentService::class);
        $paymentMock->method('processOrder')
            ->willReturn([
                'success' => true,
                'client_secret' => 'test_secret_123',
            ]);

        $this->mockService(PaymentService::class, function () use ($paymentMock) {
            return $paymentMock;
        });

        $this->get('/orders/checkout?order_id=1');

        $this->assertResponseOk();
        $this->assertEquals('test_secret_123', $this->viewVariable('clientSecret'));
    }

    public function testCheckoutWithFailedPayment(): void
    {
        // Mock failed payment
        $paymentMock = $this->createMock(PaymentService::class);
        $paymentMock->method('processOrder')
            ->willReturn([
                'success' => false,
                'error' => 'Payment processing failed',
            ]);

        $this->mockService(PaymentService::class, function () use ($paymentMock) {
            return $paymentMock;
        });

        $this->get('/orders/checkout?order_id=1');

        $this->assertResponseOk();
        $this->assertFlashMessage('Payment processing failed');
    }
}

// tests/TestCase/Service/PaymentServiceTest.php
namespace App\Test\TestCase\Service;

use App\Service\PaymentService;
use Cake\TestSuite\TestCase;
use Psr\Log\LoggerInterface;
use Stripe\StripeClient;

class PaymentServiceTest extends TestCase
{
    protected array $fixtures = ['app.Orders'];

    public function testProcessOrderSuccess(): void
    {
        // Mock Stripe client
        $stripeMock = $this->createMock(StripeClient::class);
        $stripeMock->paymentIntents = $this->createMock(\Stripe\Service\PaymentIntentService::class);
        $stripeMock->paymentIntents->method('create')
            ->willReturn((object)[
                'id' => 'pi_test123',
                'client_secret' => 'secret_test123',
            ]);

        // Mock logger
        $loggerMock = $this->createMock(LoggerInterface::class);
        $loggerMock->expects($this->once())
            ->method('info')
            ->with('Payment intent created', $this->anything());

        // Create service with mocks
        $service = new PaymentService($stripeMock, $loggerMock);

        $order = $this->Orders->get(1);
        $result = $service->processOrder($order);

        $this->assertTrue($result['success']);
        $this->assertEquals('secret_test123', $result['client_secret']);
    }
}
```

:::

## Common Patterns and Best Practices

### Repository Pattern

Repositories provide a clean abstraction for data access, separating query logic from business logic:

::: details Click to see Repository pattern example

```php
// In src/Repository/UserRepository.php
namespace App\Repository;

use App\Model\Table\UsersTable;
use Cake\ORM\Query\SelectQuery;

class UserRepository
{
    public function __construct(private UsersTable $users)
    {
    }

    public function findActive(): SelectQuery
    {
        return $this->users->find()
            ->where(['active' => true])
            ->order(['created' => 'DESC']);
    }

    public function findByRole(string $role): SelectQuery
    {
        return $this->users->find()
            ->matching('Roles', function ($q) use ($role) {
                return $q->where(['Roles.name' => $role]);
            });
    }

    public function countByStatus(string $status): int
    {
        return $this->users->find()
            ->where(['status' => $status])
            ->count();
    }
}

// In src/Service/UserReportService.php
class UserReportService
{
    public function __construct(private UserRepository $repository)
    {
    }

    public function getActiveUsersReport(): array
    {
        return [
            'active' => $this->repository->countByStatus('active'),
            'pending' => $this->repository->countByStatus('pending'),
            'suspended' => $this->repository->countByStatus('suspended'),
        ];
    }
}

// In src/Application.php
public function services(ContainerInterface $container): void
{
    $container->add(UserRepository::class)
        ->addArgument(UsersTable::class);

    $container->add(UserReportService::class)
        ->addArgument(UserRepository::class);
}
```

:::

### Service Composition

Break complex services into smaller, focused services that work together:

::: details Click to see Service Composition example

```php
// In src/Service/OrderProcessingService.php
namespace App\Service;

class OrderProcessingService
{
    public function __construct(
        private PaymentService $payments,
        private EmailService $emails,
        private InventoryService $inventory,
        private OrdersTable $orders
    ) {
    }

    public function processOrder(Order $order): bool
    {
        // Check inventory
        if (!$this->inventory->checkAvailability($order)) {
            return false;
        }

        // Process payment
        $result = $this->payments->processOrder($order);
        if (!$result['success']) {
            return false;
        }

        // Reserve inventory
        $this->inventory->reserve($order);

        // Update order status
        $order->status = 'paid';
        $order->payment_intent_id = $result['intent_id'];
        $this->orders->save($order);

        // Send confirmation
        $this->emails->sendOrderConfirmation($order);

        return true;
    }
}
```

:::

### Service with Configuration

Inject configuration values using the `Configure` attribute:

```php
namespace App\Service;

use Cake\Core\Attribute\Configure;

class ApiClientService
{
    public function __construct(
        #[Configure('Api.key')] private string $apiKey,
        #[Configure('Api.endpoint')] private string $endpoint,
        private LoggerInterface $logger
    ) {
    }

    public function makeRequest(string $path, array $data = []): array
    {
        $url = $this->endpoint . '/' . $path;

        $response = $this->httpClient->post($url, [
            'headers' => ['Authorization' => 'Bearer ' . $this->apiKey],
            'json' => $data,
        ]);

        $this->logger->debug('API request', ['path' => $path]);

        return json_decode($response->getBody(), true);
    }
}
```

### Factory Pattern

Use factories when object creation is complex or requires conditional logic:

::: details Click to see Factory pattern example

```php
// In src/Factory/NotificationFactory.php
namespace App\Factory;

class NotificationFactory
{
    public function __construct(
        private EmailService $emails,
        private SmsService $sms,
        private PushNotificationService $push
    ) {
    }

    public function create(string $type, User $user, array $data): NotificationInterface
    {
        return match($type) {
            'email' => new EmailNotification($this->emails, $user, $data),
            'sms' => new SmsNotification($this->sms, $user, $data),
            'push' => new PushNotification($this->push, $user, $data),
            default => throw new \InvalidArgumentException("Unknown notification type: {$type}"),
        };
    }
}

// In src/Service/NotificationService.php
class NotificationService
{
    public function __construct(
        private NotificationFactory $factory,
        private UsersTable $users
    ) {
    }

    public function notifyUser(int $userId, string $type, array $data): void
    {
        $user = $this->users->get($userId);
        $notification = $this->factory->create($type, $user, $data);
        $notification->send();
    }
}
```

:::

### Migrating from Traditional Code

Here's how to refactor controller-heavy code to use services:

::: code-group

```php [❌ Before: Heavy Controller]
class ArticlesController extends AppController
{
    public function publish($id)
    {
        $article = $this->Articles->get($id);

        if ($article->status === 'published') {
            $this->Flash->error('Article already published');
            return;
        }

        $article->status = 'published';
        $article->published_at = new FrozenTime();

        if ($this->Articles->save($article)) {
            // Send notifications
            $subscribers = $this->Articles->Authors->Subscribers
                ->find()
                ->where(['author_id' => $article->author_id])
                ->toArray();

            $mailer = new Mailer('default');
            foreach ($subscribers as $subscriber) {
                $mailer->reset()
                    ->setTo($subscriber->email)
                    ->setSubject('New article published')
                    ->deliver();
            }

            // Update search index
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, Configure::read('Search.endpoint'));
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($article));
            curl_exec($curl);

            $this->Flash->success('Article published');
        }
    }
}
```

```php [✅ After: Service + Clean Controller]
// In src/Service/ArticlePublishingService.php
class ArticlePublishingService
{
    public function __construct(
        private ArticlesTable $articles,
        private EmailService $emails,
        private SearchIndexService $search
    ) {
    }

    public function publish(Article $article): bool
    {
        if ($article->status === 'published') {
            return false;
        }

        $article->status = 'published';
        $article->published_at = new FrozenTime();

        if (!$this->articles->save($article)) {
            return false;
        }

        $this->notifySubscribers($article);
        $this->search->index($article);

        return true;
    }

    private function notifySubscribers(Article $article): void
    {
        $subscribers = $this->articles->Authors->Subscribers
            ->find()
            ->where(['author_id' => $article->author_id]);

        foreach ($subscribers as $subscriber) {
            $this->emails->sendNewArticle($subscriber, $article);
        }
    }
}

// In src/Controller/ArticlesController.php
class ArticlesController extends AppController
{
    public function publish(int $id, ArticlePublishingService $publisher)
    {
        $article = $this->Articles->get($id);

        if ($publisher->publish($article)) {
            $this->Flash->success('Article published');
        } else {
            $this->Flash->error('Could not publish article');
        }

        return $this->redirect(['action' => 'view', $id]);
    }
}
```

:::

> [!TIP] Benefits of Service-Based Architecture
>
> - **Testability**: Each service can be tested independently with mocks
> - **Reusability**: Publishing logic can be used from commands, jobs, or other controllers
> - **Clarity**: Controller focuses on HTTP concerns, service handles business logic
> - **Maintainability**: Complex workflows are organized into focused classes

## Auto Wiring

> [!WARNING]
> Auto-wiring is convenient but can impact performance. Enable caching in production environments.

Auto Wiring is turned off by default. To enable it:

``` php
// In src/Application.php
use League\Container\ReflectionContainer;

public function services(ContainerInterface $container): void
{
    $container->delegate(
        new ReflectionContainer(),
    );
}
```

While your dependencies will now be resolved automatically, this approach will
not cache resolutions which can be detrimental to performance. To enable
caching:

``` php
use League\Container\ReflectionContainer;

$container->delegate(
     // or consider using the value of Configure::read('debug')
    new ReflectionContainer(true),
);
```

Read more about auto wiring in the [PHP League Container documentation](https://container.thephpleague.com/4.x/auto-wiring/).
