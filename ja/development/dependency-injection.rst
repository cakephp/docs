依存性の注入(DI)
####################

.. warning::
    DIコンテナはAPIがまだ安定していない実験的な特徴になります。

CakePHPのサービスコンテナは依存性の注入(DI)によりアプリのサービスのためのクラス依存性を管理できます。
DIは手動でインスタンス化することなく、自動でコンストラクタを通してオブジェクトの依存性を"注入"します。

サービスコンテナを使うことで‘application services’を定義することができ、
これらのクラスはモデルを使います。また、loggerやmailerなどを使って
再利用可能なワークフローの構築やアプリのビジネスロジックに作用します。

CakePHPはコントローラーでアクションを呼ぶ際サービスコンテナを使い、その後コンソールコマンドを呼び出します。
コントローラーのコンストラクタにもDIを持たせることができます。

簡単な例::

    // src/Controller/UsersController.php
    class UsersController extends AppController
    {
        // サービスコンテナを通して$usersサービスが作られる
        public function ssoCallback(UsersService $users)
        {
            if ($this->request->is('post')) {
                // シングルサインオンのプロバイダーからUsersServiceのcreateやgetを使う
                $user = $users->ensureExists($this->request->getData());
            }
        }
    }

この例では、``UsersController::ssoCallback()`` アクションは
シングルサインオンプロバイダーからユーザーを取得し、ローカルのデータベースにその値が存在すると保証されている必要があります。
このサービスはコントローラーに注入されているからこそ、テストをする際に簡単に実装をモックオブジェクトや偽のサブクラスと交換できるのです。

コマンド内でサービス注入を行う例::

    // src/Command/CheckUsersCommand.php
    class CheckUsersCommand extends Command
    {
        /** @var UsersService */
        public $users;

        public function __construct(UsersService $users)
        {
            parent::__construct();
            $this->users = $users;
        }

        public function execute( Arguments $args, ConsoleIo $io )
        {
            $valid = $this->users->check('all');
        }

    }

    // src/Application.php
    public function services( ContainerInterface $container ): void
    {
        $container
            ->add(CheckUsersCommand::class)
            ->addArgument(UsersService::class);
    }

注入過程は少し異なります。
``UsersService`` の代わりにコマンドを始めに追加する必要があります。
全体としてコマンドにコンテナと ``UsersService`` を引数として与えます。
そうすることでコマンド内コンストラクタのサービスにアクセスすることができるのです。

サービスの追加
===============
コンテナに作成したサービスを持たせるには、
どのクラスが作成でき、どうビルドするかを伝える必要があります。

最もシンプルな方法はクラス名で定義することです::

    // 名前でクラスを追加する
    $container->add(BillingService::class);

アプリとプラグイン内の ``services()`` フックメソッドからサービスを定義します。::

    // src/Application.php
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

アプリケーションが使うインターフェースに実装を定義できます::

    use App\Service\AuditLogServiceInterface;
    use App\Service\AuditLogService;

    // あなたのApplication::services() メソッド内

    // 実装をインターフェースに追加
    $container->add(AuditLogServiceInterface::class, AuditLogService::class);

必要ならオブジェクト生成にコンテナ側でファクトリー関数を活用できます::

    $container->add(AuditLogServiceInterface::class, function (...$args) {
        return new AuditLogService(...$args);
    });

ファクトリー関数はすべてのクラス解決された依存関係を引数として受け取ります。

一度クラスを定義すると求められる依存性も定義する必要があります。それらの依存性はオブジェクトやプリミティブ値にもなります。::

    // 文字列や配列や数値のプリミティブ値を追加する
    $container->add('apiKey', 'abc123');

    $container->add(BillingService::class)
        ->addArgument('apiKey');

共有サービスを追加する
----------------------

デフォルトではサービスは共有されません。オブジェクトや(依存性)はコンテナから取得される時にそれぞれ生成されます。
もしシングルトン・パターンに基づく単一のインスタンスを再利用したい場合は、サービスに'shared'をつけてください。::

    // あなたのApplication::services()メソッド内で

    $container->share(BillingService::class);

定義の拡張
---------------------

定義の拡張によって、一度サービスが定義されてからも編集や更新が可能です。
これにより、定義されたサービスに引数の追加ができます。

どこかコード内で::

    // 部分的に定義されたサービスのどこかで引数の追加
    $container->extend(BillingService::class)
        ->addArgument('logLevel');

サービスのタグ化
----------------

サービスのタグ化により同時にすべてのタグ化されたサービスを取得できます。
レポートシステムなど他サービスのコレクションと組み合わせるサービスをビルドする際に使えます。::

    $container->add(BillingReport::class)->addTag('reports');
    $container->add(UsageReport::class)->addTag('reports');

    $container->add(ReportAggregate::class, function () use ($container) {
        return new ReportAggregate($container->get('reports'));
    });

設定データを使用する場合
------------------------

しばしば、サービスで設定データが必要な時がありますよね。
コンテナに入れる際必要なサービスの設定キーをすべて追加するなんてうんざりします。
サービス設定をより簡単にするために、CakePHPの注入可能な設定読み込み機能を使います。::


    use Cake\Core\ServiceConfig;

    // シェアされたインスタンスを使用する
    $container->share(ServiceConfig::class);

``ServiceConfig`` クラスは ``Configure`` で利用可能な全データのread-onlyな一覧を提供します。
なので、誤って設定が変わる心配はありません。

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

    use Cake\Core\ServiceProvider;
    // Other imports here.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function services($container)
        {
            $container->add(StripService::class);
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
