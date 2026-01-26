# 依存性の注入(DI)

CakePHPのサービスコンテナは依存性の注入(DI)によりアプリケーションのサービスのためのクラス依存性を管理できます。
DIは手動でインスタンス化することなく、自動でコンストラクタを通してオブジェクトの依存性を"注入"します。

サービスコンテナを使うことで‘application services’を定義することができ、
これらのクラスはモデルを使います。また、loggerやmailerなどを使って
再利用可能なワークフローの構築やアプリケーションのビジネスロジックに作用します。

CakePHPはコントローラーでアクションを呼ぶ際サービスコンテナを使い、その後コンソールコマンドを呼び出します。
コントローラーのコンストラクタにもDIを持たせることができます。

簡単な例:

``` php
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
```

この例では、`UsersController::ssoCallback()` アクションは
シングルサインオンプロバイダーからユーザーを取得し、ローカルのデータベースにその値が存在すると保証されている必要があります。
このサービスはコントローラーに注入されているからこそ、テストをする際に簡単に実装をモックオブジェクトや偽のサブクラスと交換できるのです。

コマンド内でサービス注入を行う例:

``` php
// In src/Command/CheckUsersCommand.php
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

// In src/Application.php
public function services( ContainerInterface $container ): void
{
    $container
        ->add(CheckUsersCommand::class)
        ->addArgument(UsersService::class);
    $container->add(UsersService::class);
}
```

ここでは、インジェクションの手順が少し異なります。
`UsersService` をコンテナに追加するのではなく、まずCommand全体をコンテナに追加し、 `UsersService` を引数として追加する必要があります。
これで、コマンドのコンストラクタ内でそのサービスにアクセスできるようになります。

## サービスの追加

コンテナに作成したサービスを持たせるには、
どのクラスが作成でき、どうビルドするかを伝える必要があります。

最もシンプルな方法はクラス名で定義することです:

``` php
// 名前でクラスを追加する
$container->add(BillingService::class);
```

アプリケーションとプラグイン内の `services()` フックメソッドからサービスを定義します。:

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

アプリケーションが使うインターフェースに実装を定義できます:

``` php
use App\Service\AuditLogServiceInterface;
use App\Service\AuditLogService;

// あなたのApplication::services() メソッド内

// 実装をインターフェースに追加
$container->add(AuditLogServiceInterface::class, AuditLogService::class);
```

必要ならオブジェクト生成にコンテナ側でファクトリー関数を活用できます:

``` php
$container->add(AuditLogServiceInterface::class, function (...$args) {
    return new AuditLogService(...$args);
});
```

ファクトリー関数はすべてのクラス解決された依存関係を引数として受け取ります。

一度クラスを定義すると求められる依存性も定義する必要があります。それらの依存性はオブジェクトやプリミティブ値にもなります。:

``` php
// 文字列や配列や数値のプリミティブ値を追加する
$container->add('apiKey', 'abc123');

$container->add(BillingService::class)
    ->addArgument('apiKey');
```

### 共有サービスを追加する

デフォルトではサービスは共有されません。オブジェクトや(依存性)はコンテナから取得される時にそれぞれ生成されます。
もしシングルトン・パターンに基づく単一のインスタンスを再利用したい場合は、サービスに'shared'をつけてください。:

``` php
// あなたのApplication::services()メソッド内で

$container->addShared(BillingService::class);
```

### 定義の拡張

定義の拡張によって、一度サービスが定義されてからも編集や更新が可能です。
これにより、定義されたサービスに引数を追加できます。

コード内どこかで:

``` php
// 部分的に定義されたサービスのどこかで引数の追加
$container->extend(BillingService::class)
    ->addArgument('logLevel');
```

### サービスのタグ化

サービスのタグ化により同時にすべてのタグ化されたサービスを取得できます。
レポートシステムなど他サービスのコレクションと組み合わせるサービスをビルドする際に使えます。:

``` php
$container->add(BillingReport::class)->addTag('reports');
$container->add(UsageReport::class)->addTag('reports');

$container->add(ReportAggregate::class, function () use ($container) {
    return new ReportAggregate($container->get('reports'));
});
```

### 設定データを使用する場合

しばしば、サービスで設定データが必要な時がありますよね。
コンテナに入れる際必要なサービスの設定キーをすべて追加するなんてうんざりします。
サービス設定をより簡単にするために、CakePHPの注入可能な設定読み込み機能を使います。:

``` php
use Cake\Core\ServiceConfig;

// シェアされたインスタンスを使用する
$container->addShared(ServiceConfig::class);
```

`ServiceConfig` クラスは `Configure` で利用可能な全データのread-onlyな一覧を提供します。
なので、誤って設定が変わる心配はありません。

## サービス・プロバイダー

サービス・プロバイダーによって関連したサービスをまとめ上げる補助をし、グループ化することができます。

また、サービス・プロバイダーは定義したサービスが初めて使われる際、遅延登録され
アプリケーションのパフォーマンスを上げることができます。

### サービス・プロバイダーの作成

ServiceProviderの一例:

``` php
namespace App\ServiceProvider;

use Cake\Core\ContainerInterface;
use Cake\Core\ServiceProvider;
// 他はここにインポート

class BillingServiceProvider extends ServiceProvider
{
    protected $provides = [
        StripeService::class,
        'configKey',
    ];

    public function services(ContainerInterface $container): void
    {
        $container->add(StripService::class);
        $container->add('configKey', 'some value');
    }
}
```

サービス・プロバイダーは自身の `services()` メソッドを使って、提供するサービスをすべて定義します。
さらに、それらのサービスは **絶対に** `$provides` に正しく定義する必要があります。
正しく `$provides` に含められなかった場合、コンテナから読み込めなくなります。

### サービス・プロバイダーの使用

サービス・プロバイダーを読み込むには `addServiceProvider()` メソッドを使ってコンテナに追加してください:

``` php
// Application::services()メソッド内で
$container->addServiceProvider(new BillingServiceProvider());
```

### 起動可能なサービス・プロバイダー

もしサービス・プロバイダーがコンテナに追加された時、ロジックを走らせる必要がある場合
`bootstrap()` メソッドを使ってください。
想定される状況として
サービス・プロバイダーが追加の設定ファイルを読み込む必要があったり、
追加のサービス・プロバイダーを読み込んだり、
アプリケーションのどこかで定義されたサービスを変更する場合などが考えられます。

起動可能なサービス・プロバイダーの例:

``` php
namespace App\ServiceProvider;

use Cake\Core\ServiceProvider;
// 他はここにインポート

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

## サービスをモック化してテストする

テスト内で `ConsoleIntegrationTestTrait` や `IntegrationTestTrait` を使うことででコンテナを通して注入されるサービスとスタブやモックを入れ替えることができます。:

``` php
// テストメソッドやsetup()内で
$this->mockService(StripeService::class, function () {
    return new FakeStripe();
});

// モックを削除する場合
$this->removeMockService(StripeService::class);
```

テスト時には定義されたどんなモックもアプリケーションのコンテナ内で交換されます。
そして、自動的にコンテナやコマンドに注入されます。
それぞれのテストの最後でモックは除去されます。
