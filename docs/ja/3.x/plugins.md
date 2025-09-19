# プラグイン

CakePHP では、コントローラー・モデル・ビューの組み合わせを設定し、
他の CakePHP アプリケーションで使用できるよう事前にパッケージ化された
アプリケーションプラグインとしてリリースできます。あなたのアプリケーションの１つに、
素敵なユーザー管理モジュールやシンプルなブログやウェブサービスモジュールを作成したら、
CakePHP プラグインとしてパッケージ化してみませんか？そうすれば、他のアプリケーションで
再利用したり、コミュニティーで共有したりすることができます！

CakePHP プラグインは、ホストアプリケーション自身とは基本的に分離されており、
一般的にきちんとパッケージ化され、他のアプリケーションではほとんど手間をかけずに
再利用できる明確な機能を提供します。アプリケーションとプラグインは、それぞれの空間で動作しますが、
アプリケーションの設定によって定義・共有される、アプリケーション固有のプロパティー
（データベース接続パラメーターなど）を共有します。

CakePHP 3.0 では、それぞれのプラグインごとに最上位の名前空間 (例えば `DebugKit` と
いったように) を定義します。規約により、プラグインはそのパッケージ名が名前空間の名前と
なります。
もし別の名前空間名を使いたいなら、プラグインをロードする時に設定することが可能です。

## Composer を使ったプラグインのインストール

[Packagist](https://packagist.org) には多くのプラグインがあり、 `Composer` を
使ってインストールが可能です。DebugKit をインストールには、下記のコマンドを実行します。

``` bash
php composer.phar require cakephp/debug_kit
```

これによって最新の DebugKit をインストールして、あなたの **composer.json**, **composer.lock**
ファイルを更新し、 **vendor/cakephp-plugins.php** とオートローダーも更新します。

## プラグインの手動インストール

もしあなたがインストールしたいプラグインが packagist.org になければ、プラグインのコードを
**plugins** ディレクトリーにコピーすることもできます。
例えば 'ContactManager' という名前のプラグインをインストールするなら、 `plugins` フォルダーの中に
'ContactManager' という名前のフォルダーを作り、この下にプラグインの src, tests といった
フォルダーを作ります。

### プラグインクラスを手動で自動読み込み

`composer` や `bake` を使ってプラグインをインストールするなら、
プラグインのためにクラスの自動読み込みの設定をする必要はありません。

一方、 `MyPlugin` という名前のプラグインを手動でインストールした場合、
アプリケーションの **composer.json** ファイルを次の情報を含むように更新する必要があります。

``` json
{
    "autoload": {
        "psr-4": {
            "MyPlugin\\": "plugins/MyPlugin/src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
        }
    }
}
```

あなたのプラグインがベンダーの名前空間を使うなら、パスマッピングの名前空間は下記のように
なるでしょう。

``` json
{
    "autoload": {
        "psr-4": {
            "AcmeCorp\\Users\\": "plugins/AcmeCorp/Users/src/",
            "AcmeCorp\\Users\\Test\\": "plugins/AcmeCorp/Users/tests/"
        }
    }
}
```

そして、 Composer の自動読み込みキャッシュを初期化する必要があります。

``` bash
php composer.phar dumpautoload
```

もしあなたが何らかの理由で Composer を使う事ができないのなら、 `Plugin` を使って
自動読み込みを行うこともできます。 :

``` css
Plugin::load('ContactManager', ['autoload' => true]);
```

<div class="deprecated">

3.7.0
Plugin::load() と `autoload` オプションは非推奨です。

</div>

> [!NOTE]
> 重要: `autoload` オプションは `addPlugin()` では使用できません。代わりに `composer dumpautoload` を使用してください。

## プラグインの読み込み

もし、プラグインのルート、コンソールコマンド、ミドルウェア、またはイベントリスナーが欲しい場合、
プラグインを読み込む必要があります。プラグインは、アプリケーションの `bootstrap()` 関数の中で
読み込まれます。 :

``` php
// src/Application.php の中。3.6.0 以上が必要。
use Cake\Http\BaseApplication;
use ContactManager\Plugin as ContactManagerPlugin;

class Application extends BaseApplication {
    public function bootstrap()
    {
        parent::bootstrap();
        // クラス名で contact manager プラグインを読み込み
        $this->addPlugin(ContactManagerPlugin::class);

        // '短縮名' でベンダーの名前空間付きプラグインを読み込み
        $this->addPlugin('AcmeCorp/ContactManager');
    }
}
```

単にプラグインのヘルパー、ビヘイビアー、またはコンポーネントが欲しいだけの場合、
プラグインを読み込む必要はありません。

3.6.0 より前の場合、 `Plugin::load()` を使ってください。 :

    // config/bootstrap.php の中で

    // 特定のプラグインを読み込みます。
    Plugin::load('ContactManager');

    // ベンダーの名前空間の特定のプラグインを読み込みます。
    Plugin::load('AcmeCorp/ContactManager');

また、プラグインを有効にする便利なシェルコマンドがあります。次の行を実行してください。

``` bash
bin/cake plugin load ContactManager
```

これは、アプリケーションの bootstrap メソッドを更新、
または `$this->addPlugin('ContactManager');` を bootstrap に書き込みます。

::: info Added in version 3.6.0
`addPlugin()` が追加されました。
:::

## プラグインフックの設定

プラグインは、プラグインがアプリケーションの適切な部分に自分自身を注入できるようにする
いくつかのフックを提供します。

フックは以下の通りです。

- `bootstrap` プラグインのデフォルト設定ファイルの読み込み、
  定数やその他のグローバル関数の定義に使用されます。
- `routes` プラグインのルートをロードするために使用されます。
  アプリケーションのルートがロードされた後に呼ばれます。
- `middleware` プラグインのミドルウェアをアプリケーションの
  ミドルウェアキューに追加するために使用されます。
- `console` アプリケーションのコマンドコレクションにコンソールコマンドを
  追加するために使用されます。

プラグインをロードするとき、有効にするフックを設定できます。
デフォルトでは、 [Plugin Objects](#plugin-objects) のないプラグインはすべてのフックを無効にします。
新しいスタイルのプラグインを使用すると、プラグイン作成者はデフォルトを設定できます。
これを利用者はアプリケーション中で変更可能です。 :

``` php
// Application::bootstrap() の中で
use ContactManager\Plugin as ContactManagerPlugin;

// ContactManager プラグインのルートを無効化
$this->addPlugin(ContactManagerPlugin::class, ['routes' => false]);
```

フックを配列オプションで設定することも、
Plugin クラスで提供されるメソッドで設定することもできます。 :

``` php
// Application::bootstrap() の中で
use ContactManager\Plugin as ContactManagerPlugin;

// フックを設定するために disable/enable を使用
$plugin = new ContactManagerPlugin();

$plugin->disable('bootstrap');
$plugin->enable('routes');
$this->addPlugin($plugin);
```

Plugin オブジェクトは、名前とパス情報も知っています。 :

``` php
$plugin = new ContactManagerPlugin();

// プラグイン名を取得
$name = $plugin->getName();

// プラグインルートへのパスとその他のパス
$path = $plugin->getPath();
$path = $plugin->getConfigPath();
$path = $plugin->getClassPath();
```

### 古いスタイルのプラグイン

3.6.0 より前は、 `bootstrap` と `routs` フックを有効にする必要があります。
古いスタイルのプラグインは、 `middleware` と `console` フックはサポートしません。 :

    // config/bootstrap.php の中、
    // または Application::bootstrap() の中で

    // loadAll() を使用
    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

また、プラグインを個別に読み込むことができます。 :

    // blog を読み込み、routes をインクルード
    Plugin::load('Blog', ['routes' => true]);

    // 設定と初期化を行う bootstrap をインクルード
    Plugin::load('ContactManager', ['bootstrap' => true]);

この設定スタイルは、プラグインの設定やルートを手動で `include()` や
`require()` する必要がなく、自動で正しい時間と正しい場所で読み込まれます。

特定の設定を持たない全てのプラグインを読み込むデフォルトの `loadAll()` を設定できます。

次の例は、全てのプラグインの bootstrap を読み込み、
それに加えて Blog プラグインの routes を読み込みます。 :

``` css
Plugin::loadAll([
    ['bootstrap' => true],
    'Blog' => ['routes' => true]
]);
```

プラグインで指定された全てのファイルが実際に存在しないと、PHP が読み込めないファイルごとに
警告を出します。この潜在的な警告は、 `ignoreMissing` オプションを使用して避けることができます。 :

``` css
Plugin::loadAll([
    ['ignoreMissing' => true, 'bootstrap' => true],
    'Blog' => ['routes' => true]
]);
```

プラグインを読み込むとき、プラグイン名は名前空間名と一致すべきです。
例えば、最上位の名前空間が `Users` のプラグインがあるなら、このように読み込みます。 :

``` css
Plugin::load('User');
```

もしあなたが `AcmeCorp/Users` といったように、ベンダー名を最上位の名前空間名に
したいのなら、このようにプラグインを読み込みます。 :

``` css
Plugin::load('AcmeCorp/Users');
```

クラス名は `プラグイン記法` を使うことで、適切に解決されるでしょう。

ほとんどのプラグインで、設定するための正確な手続きとデータベースのセットアップするための方法が、
ドキュメントに書かれています。他よりセットアップが必要なものもあります。

<div class="deprecated">

3.7.0
Plugin::load() と Plugin::loadAll() は非推奨です。

</div>

## プラグインの利用

クラス名の前にプラグイン名を付けることで、プラグインのコントローラー、
モデル、コンポーネント、ビヘイビアーとヘルパーを参照できます。

例えば、あなたの画面で整形された連絡先情報を表示するために、 ContactManager プラグインの
ContactInfoHelper を使いたいとしましょう。この場合、あなたのコントローラーの
`$helpers` 配列にこのように記述します。 :

``` php
public $helpers = ['ContactManager.ContactInfo'];
```

> [!NOTE]
> このドット区切りのクラス名は、 `プラグイン記法` と呼ばれます。

すると、あなたが作った他のヘルパー同様に、 `ContactInfoHelper` に
アクセスできるようになります。 :

``` php
echo $this->ContactInfo->address($contact);
```

## 独自プラグインの作成

動作サンプルとして、上記を参考に ContactManager を作りましょう。
まず始めに、プラグインの基本ディレクトリー構成を準備します。
それはこのようになります。 :

    /src
    /plugins
        /ContactManager
            /config
            /src
                /Plugin.php
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
                /Template
                    /Layout
            /tests
                /TestCase
                /Fixture
            /webroot

プラグインフォルダーの名前が '\*\*ContactManager\*\*' になっています。このフォルダーが
プラグインと同じ名前になる事が大切です。

プラグインフォルダーの中は CakePHP アプリケーションと同じような構成であることに気づく
思いますが、それが基本的な構成です。使わないフォルダーは作る必要はありません。
コンポーネントとビヘイビアーだけで定義されるプラグインもあれば、 'Template' ディレクトリーが
完全に省略されるプラグインもあります。

プラグインは、アプリケーションが持つ Config, Console, webroot 等といったディレクトリーも
設置できます。

### Bake を使ってプラグインを作成

プラグイン制作の過程は、Bake shell を使えば非常に簡単です。

プラグインを bake するのは以下のコマンドになります。

``` bash
bin/cake bake plugin ContactManager
```

Bake を使用して、プラグインのクラスを作成できます。
例えばプラグインのコントローラーを bake するには

``` bash
bin/cake bake controller --plugin ContactManager Contacts
```

もしコマンドラインで問題があれば、 [Bake でコード生成](bake/usage) の章を参照してください。
また、プラグインを作ったら必ずオートローダーを再作成してください。

``` bash
php composer.phar dumpautoload
```

## Plugin オブジェクト

Plugin オブジェクトを使用すると、プラグイン作成者は設定ロジックを定義し、
デフォルトのフックを定義し、ルート、ミドルウェア、およびコンソールコマンドをロードできます。
Plugin オブジェクトは、 **src/Plugin.php** にあります。
ContactManager プラグイン の場合、 Plugin クラスは、次のようになります。 :

``` php
namespace ContactManager;

use Cake\Core\BasePlugin;
use Cake\Core\PluginApplicationInterface;

class Plugin extends BasePlugin
{
    public function middleware($middleware)
    {
        // ここにミドルウェアを追加。
        return $middleware;
    }

    public function console($commands)
    {
        // ここにコンソールコマンドを追加。
        return $commands;
    }

    public function bootstrap(PluginApplicationInterface $app)
    {
        // 定数を追加。デフォルトの設定をロード。
        // デフォルトでは、プラグインの中の `config/bootstrap.php` をロードします。
        parent::bootstrap($app);
    }

    public function routes($routes)
    {
        // ルートの追加。
        // デフォルトでは、プラグインの中の `config/routes.php` をロードします。
        parent::routes($routes);
    }
}
```

::: info Added in version 3.6.0
Plugin オブジェクトは 3.6.0 で追加されました。
:::

## プラグインのルート

プラグインは、ルートを含むルートファイルを提供できます。各プラグインは、
**config/routes.php** ファイルを含むことができます。このルートファイルは、
プラグインが追加された時、またはアプリケーションのルートファイルの中で
ロードすることができます。ContactManager プラグインのルートを作成するためには、
**plugins/ContactManager/config/routes.php** の中に以下を記述してください。 :

``` php
<?php
use Cake\Routing\Route\DashedRoute;
use Cake\Routing\Router;

Router::plugin(
    'ContactManager',
    ['path' => '/contact-manager'],
    function ($routes) {
        $routes->get('/contacts', ['controller' => 'Contacts']);
        $routes->get('/contacts/:id', ['controller' => 'Contacts', 'action' => 'view']);
        $routes->put('/contacts/:id', ['controller' => 'Contacts', 'action' => 'update']);
    }
);
```

上記のようにすれば、プラグインのデフォルトルートに接続できるでしょう。
このファイルをカスタマイズすることで、後から個別のルートを設定することができます。

コントローラーにアクセスする前に、プラグインがロードされ、ルートがロードされる必要があります。
**src/Application.php** に下記を追加してください。 :

``` php
$this->addPlugin('ContactManager', ['routes' => true]);
```

アプリケーションのルート一覧の中で、プラグインのルートをロードすることもできます。
これにより、プラグインのルートをロードする方法をより詳細に制御し、
追加のスコープやプレフィックスでプラグインのルートをラップすることができます。 :

``` php
Router::scope('/', function ($routes) {
    // 他のルートに接続。
    $routes->scope('/backend', function ($routes) {
        $routes->loadPlugin('ContactManager');
    });
});
```

上記の結果は、 `/backend/contact-manager/contacts` のような URL になります。

::: info Added in version 3.5.0
`RouteBuilder::loadPlugin()` は 3.5.0 で追加されました。
:::

## プラグインのコントローラー

ContactManager プラグインのコントローラーは、
**plugins/ContactManager/src/Controller/** に設置されます。主にやりたい事は
contacts の管理ですので、このプラグインには ContactsController が必要です。

そこで ContactsController を **plugins/ContactManager/src/Controller** に設置し、
このように書きます。 :

``` php
// plugins/ContactManager/src/Controller/ContactsController.php
namespace ContactManager\Controller;

use ContactManager\Controller\AppController;

class ContactsController extends AppController
{
    public function index()
    {
        //...
    }
}
```

まだ作っていないなら、 `AppController` も作りましょう。 :

``` php
// plugins/ContactManager/src/Controller/AppController.php
namespace ContactManager\Controller;

use App\Controller\AppController as BaseController;

class AppController extends BaseController
{
}
```

プラグインの `AppController` は、プラグイン内の全コントローラー共通のロジックを
持ちますが、使わないようでしたら作らなくても構いません。

これまでのところでアクセスするなら、 `/contact-manager/contacts` にアクセスして
みてください。 "Missing Model" エラーが表示されるでしょうが、これはまだ
Contact モデルが定義されていないためです。

もしあなたのアプリケーションが、CakePHP の提供するデフォルトルーティングを含むなら、
あなたのプラグインコントローラーへは下記のような URL でアクセスできます。 :

    // プラグインコントローラーの index にアクセスする
    /contact-manager/contacts

    // プラグインコントローラーのそれぞれのアクションにアクセスする
    /contact-manager/contacts/view/1

もしあなたのアプリケーションでルーティングプレフィックスを定義しているなら、
CakePHP のデフォルトルーティングは下記の書式でルーティングします。 :

    /:prefix/:plugin/:controller
    /:prefix/:plugin/:controller/:action

特定ファイルにルーティングするようなプラグインの読み込み方法については、
[Plugin Configuration](#plugin-configuration) のセクションをご覧ください。

bake で作っていないプラグインなら、クラスを自動的に読み込むために
**composer.json** ファイルを編集して、あなたのプラグインを追加する必要があります。
これは [Autoloading Plugin Classes](#autoloading-plugin-classes) に従って行うことができます。

## プラグインのモデル

プラグインのモデルは **plugins/ContactManager/src/Model** に設置されます。
既にこのプラグインの ContactsController は定義してありますから、このコントローラーの
ためのテーブルとエンティティーを作成しましょう。 :

``` php
// plugins/ContactManager/src/Model/Entity/Contact.php:
namespace ContactManager\Model\Entity;

use Cake\ORM\Entity;

class Contact extends Entity
{
}

// plugins/ContactManager/src/Model/Table/ContactsTable.php:
namespace ContactManager\Model\Table;

use Cake\ORM\Table;

class ContactsTable extends Table
{
}
```

エンティティークラスを作った時や関連付けを行いたい時など、あなたのプラグイン内のモデルを
参照したい場合には、プラグイン名とクラス名をドットで区切る必要があります。例えば:

``` php
// plugins/ContactManager/src/Model/Table/ContactsTable.php:
namespace ContactManager\Model\Table;

use Cake\ORM\Table;

class ContactsTable extends Table
{
    public function initialize(array $config)
    {
        $this->hasMany('ContactManager.AltName');
    }
}
```

もし関連付け配列のキーにプラグインの接頭語をつけたくないのなら、代わりにこのような
構文が使えます。 :

``` php
// plugins/ContactManager/src/Model/Table/ContactsTable.php:
namespace ContactManager\Model\Table;

use Cake\ORM\Table;

class ContactsTable extends Table
{
    public function initialize(array $config)
    {
        $this->hasMany('AltName', [
            'className' => 'ContactManager.AltName',
        ]);
    }
}
```

おなじみの `プラグイン記法` を使う事で、プラグインのテーブルを
読み込むために `TableRegistry` を使用することができます。 :

``` php
use Cake\ORM\TableRegistry;

// Prior to 3.6 use TableRegistry::get('ContactManager.Contacts')
$contacts = TableRegistry::getTableLocator()->get('ContactManager.Contacts');
```

あるいは、コントローラーの処理の中で以下のように使用できます。 :

``` php
$this->loadModel('ContactsMangager.Contacts');
```

## プラグインのビュー

ビューは通常のアプリケーション内と同じように動作します。
`plugins/[PluginName]/src/Template/` フォルダーの中の正しいフォルダー内に配置するだけです。
我々の ContactManager プラグインでは `ContactsController::index()` アクションに
ビューが必要ですから、このような内容になります。 :

    // plugins/ContactManager/src/Template/Contacts/index.ctp:
    <h1>連絡先</h1>
    <p>ソート可能なあなたの連絡先一覧は次のとおりです</p>
    <!-- ソート可能な連絡先一覧はこちら....-->

プラグインは独自のレイアウトを提供することができます。
プラグインレイアウトを追加するためには、テンプレートファイルを
`plugins/[PluginName]/src/Template/Layout` に配置します。
プラグインレイアウトをコントローラーで使用するには、下記のようにします。 :

``` php
public $layout = 'ContactManager.admin';
```

プラグインのプレフィックスを省略した場合は、レイアウトやビューファイルは通常のものを使用します。

> [!NOTE]
> プラグインからのエレメントの使い方については、
> [View Elements](views#view-elements) を参照してください。

### アプリケーション内からプラグインのテンプレートを上書き

プラグインのビューはあるパスを使って上書きできます。
仮にあなたが 'ContactManager' という名前のプラグインを持っているとして、
**src/Template/Plugin/\[Plugin\]/\[Controller\]/\[view\].ctp** というファイルを作って
そこにビューロジックを書いておけば、プラグインのテンプレートファイルを上書きすることができます。
Contacts コントローラーなら、次のようなファイルを作成します。 :

    src/Template/Plugin/ContactManager/Contacts/index.ctp

このファイルを作成すると、 **plugins/ContactManager/src/Template/Contacts/index.ctp**
を上書きします。

もし、あなたのプラグインが composer の依存関係の中にある場合 (例えば 'Company/ContactManager')、
Custom コントローラーの 'index' ビューへのパスは、次の通りです。 :

    src/Template/Plugin/ContactManager/Contacts/index.ctp

このファイルを作成すると、 **vendor/Company/ContactManager/src/Template/Contacts/index.ctp**
を上書きします。

プラグインがルーティングプレフィックスを実装する場合、上書きする
アプリケーションテンプレートのパスにルーティングプレフィックスが含まなければなりません。
例えば、 'ContactManager' プラグインが 'admin' プレフィックスを実装する場合、
上書きするパスは、次の通りです。 :

    src/Template/Plugin/Company/ContactManager/Admin/Contact/index.ctp

## プラグインのアセット

プラグインのウェブアセット (PHP 以外のファイル） は、メインアプリケーションのアセットと
同様にプラグインの `webroot` ディレクトリーを介して配信されます。 :

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

通常の webroot と同じようにどのディレクトリーにどんなファイルでも置くことができます。

> [!WARNING]
> ディスパッチャーを介して静的アセット (画像や JavaScript や CSS ファイル) を取り扱うことは
> 非常に非効率です。
> 詳細は [アプリケーションのパフォーマンスの向上](deployment#symlink-assets) をご覧ください。

### プラグイン内のアセットへのリンク

`Cake\View\Helper\HtmlHelper` の script, image, css メソッドを使って
プラグイン内のアセットへのリンクを作りたい場合、 `プラグイン記法` が使えます。 :

``` php
// /contact_manager/css/styles.css への URL を生成します
echo $this->Html->css('ContactManager.styles');

// /contact_manager/js/widget.js への URL を生成します
echo $this->Html->script('ContactManager.widget');

// /contact_manager/img/logo.jpg への URL を生成します
echo $this->Html->image('ContactManager.logo');
```

プラグインのアセットは、デフォルトで `AssetMiddleware` ミドルウェアを
使用して提供されます。これは開発時のみ使用することが推奨されます。
本番環境ではパフォーマンスを向上させるために、
[プラグインのアセットをシンボリックリンク化](deployment#symlink-assets) すべきです。

もしあなたがヘルパーを使わないなら、プラグインのアセットを提供するためには URL の先頭に
プラグイン名を付加します。 '/contact_manager/js/some_file.js' へのリンクで、
**plugins/ContactManager/webroot/js/some_file.js** というアセットを提供します。

## コンポーネント、ヘルパーとビヘイビアー

プラグインには通常の CakePHP アプリケーションと同じように、コンポーネント、ヘルパー、
ビヘイビアーを持つ事ができます。あなたはコンポーネント、ヘルパー、ビヘイビアーだけからなる
プラグインを作る事もできます。これはコンポーネントを他のプロジェクトに簡単に導入すれば
再利用可能となるような素晴らしい方法です。

このようなコンポーネントを作る事は、実際、通常のアプリケーションとして作る事と同じであり、
特別な命名規則もありません。

プラグインの内部や外部からコンポーネントを参照する方法は、コンポーネント名の前に
プラグイン名を付けるだけです。例えば:

``` php
// 'ContactManager' プラグインのコンポーネントとして定義
namespace ContactManager\Controller\Component;

use Cake\Controller\Component;

class ExampleComponent extends Component
{
}

// コントローラーの中で
public function initialize()
{
    parent::initialize();
    $this->loadComponent('ContactManager.Example');
}
```

同じテクニックはヘルパーとビヘイビアーにも使えます。

## コマンド

プラグインは、 `console()` フックの中で、コマンドを登録することができます。
デフォルトでは、プラグイン内のすべてのシェルとコマンドが自動検出され、
アプリケーションのコマンドリストに追加されます。
プラグインコマンドの先頭にはプラグイン名が付いています。例えば、
`ContactManager` プラグインによって提供される `UserCommand` は、
`contact_manager.user` と `user` の両方として登録されます。プレフィックスのない名前は、
アプリケーションや他のプラグインで使用されていないプラグインでのみ使用されます。

プラグインで各コマンドを定義することによって、コマンド名をカスタマイズすることができます。 :

``` php
public function console($commands)
{
    // ネストされたコマンドを作成
    $commands->add('bake model', ModelCommand::class);
    $commands->add('bake controller', ControllerCommand::class);

    return $commands;
}
```

## プラグインのテスト

コントローラーやURLの生成をテストする場合、プラグインがルート `tests/bootstrap.php` に接続していることを確認してください。

詳細は [testing plugins](development/testing) ページを確認してください。

## プラグインの公開

CakePHP のプラグインは [the packagist](https://packagist.org) に公開しましょう。
こちらでは、他の人々は composer の依存関係として使用することができます。
[awesome-cakephp list](https://github.com/FriendsOfCake/awesome-cakephp)
に申し込みできます。

パッケージ名にセマンティックな意味のある名前を選んでください。これは、理想を言えば、
"cakephp" をフレームワークとして依存関係を設定するべきです。
ベンダー名は、通常あなたの GitHub ユーザー名になります。
CakePHP 名前空間 (cakephp) を **使用しない** でください。
これは、CakePHP 自身のプラグインのために予約されています。
小文字と区切り文字のダッシュを使用することが決まりです。

もし、あなたの GitHub アカウントが "FooBar" で "Logging" プラグインを作成する場合、
<span class="title-ref">foo-bar/cakephp-logging</span> と名付けるといいでしょう。
そして、CakePHP 自身の "Localized" プラグンは、 <span class="title-ref">cakephp/localized</span> で見つけられます。

<div class="index">

vendor/cakephp-plugins.php

</div>

## プラグイン マップ ファイル

Composer 経由でインストールすると、 `vendor/cakephp-plugins.php` というファイルが
作られることに気付くかもしれません。この設定ファイルにはプラグイン名とファイルシステム上の
配置場所の情報が含まれています。これによって、プラグインを通常の検索パスの外の、標準の
vendor ディレクトリーにインストールすることが可能になります。 `Plugin` クラスは
`load()` や `loadAll()` でプラグインをロードする時に、このファイルを使って
場所を特定します。通常あなたはこのファイルを手動で編集する必要はなく、 Composer や
`plugin-installer` パッケージが管理してくれます。

## Mixer を使用したプラグインの管理

CakePHP アプリケーションでプラグインを発見して管理する別の方法は、 [Mixer](https://github.com/CakeDC/mixer) です。これは Packagist からプラグインをインストールするのに
便利な CakePHP のプラグインです。また、既存のプラグインを管理するのにも役立ちます。

> [!NOTE]
> 重要: 本番環境でこれを使用しないでください。
