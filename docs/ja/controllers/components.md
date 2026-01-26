# コンポーネント

コンポーネントはコントローラー間で共有されるロジックのパッケージです。
CakePHP には、様々な共通のタスクを支援するための素晴らしいコアコンポーネントが
用意されています。あなた独自のコンポーネントも作成できます。 もしコントローラー間で
コピー＆ペーストしたい箇所があった場合、その機能を含むコンポーネントの作成を
検討しましょう。コンポーネントを作成することで、コントローラーのコードを綺麗に保ち、
プロジェクト間のコードの再利用につながります。

CakePHP の中に含まれるコンポーネントの詳細については、各コンポーネントの章を
チェックしてください。

- [フラッシュ](../controllers/components/flash)
- [リクエストハンドリング](../controllers/components/request-handling)
- [フォームの保護](../controllers/components/form-protection)
- [HTTPキャッシュの確認](../controllers/components/check-http-cache)

## コンポーネントの設定

コアコンポーネントの多くは設定を必要としています。コンポーネントが設定を
必要としている例は、 [フォームの保護](../controllers/components/form-protection) や
などにあります。これらのコンポーネントや
一般的なコンポーネントの設定は、通常、お使いのコントローラーの `initialize()`
メソッド内で `loadComponent()` を使用するか、 `$components` 配列を介して行われます。 :

``` php
class PostsController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => ['json' => 'AppJsonView'],
        ]);
        $this->loadComponent('Security', ['blackholeCallback' => 'blackhole']);
    }

}
```

`config()` メソッドを使用して、実行時にコンポーネントを設定することができます。
しばしば、コントローラーの `beforeFilter()` メソッドで行われます。
上記は、次のように表現することもできます。 :

``` php
public function beforeFilter(EventInterface $event)
{
    $this->RequestHandler->setConfig('viewClassMap', ['rss' => 'MyRssView']);
}
```

コンポーネントは、ヘルパーと同じように、設定データを取得および設定するために使用されている
`getConfig()` と `setConfig()` メソッドを実装しています。 :

``` php
// 設定データの読み込み
$this->RequestHandler->getConfig('viewClassMap');

// 設定をセット
$this->Csrf->setConfig('cookieName', 'token');
```

コンポーネントは、ヘルパーと同じように、`config()` でアクセス可能な
`$_config` プロパティーを作成するためにコンストラクターの設定で自分の
`$_defaultConfig` プロパティーを自動的にマージします。

### コンポーネントの別名

共通設定の一つに `className` オプションがあります。このオプションを使うと
コンポーネントに別名をつけられます。この機能は `$this->Auth` や
他のコンポーネントの参照を独自実装に置き換えたい時に便利です。 :

``` php
// src/Controller/PostsController.php
class PostsController extends AppController
{
    public function initialize(): void
    {
        $this->loadComponent('Auth', [
            'className' => 'MyAuth'
        ]);
    }
}

// src/Controller/Component/MyFlashComponent.php
use Cake\Controller\Component\FlashComponent;

class MyFlashComponent extends FlashComponent
{
    // Add your code to override the core FlashComponent
}
```

上記の例ではコントローラーにて `MyFlushComponent` に `$this->Flash` という
*別名* をつけています。

> [!NOTE]
> 別名を付けられたコンポーネントはコンポーネントが使われるあらゆる場所の
> インスタンスを置き換えます。これは、他のコンポーネントの内部を含みます。

### コンポーネントの動的ロード

すべてのコントローラーアクションで全コンポーネントを使えるようにする必要は
ないかもしれません。このような状況では、お使いのコントローラーで
`loadComponent()` メソッドを使用して、実行時にコンポーネントを
ロードすることができます。 :

``` php
// コントローラーのアクションの中で
$this->loadComponent('OneTimer');
$time = $this->OneTimer->getTime();
```

> [!NOTE]
> 動的にロードされたコンポーネントはコールバックされないことに注意してください。
> もし、 `beforeFilter` または `startup` コールバックに依存している場合、
> あなたのコンポーネントをロードするときに手動でそれらを呼び出す必要があります。

## コンポーネントの使用

一旦、コンポーネントをコントローラーに読込んでしまえば、使うのは非常に簡単です。
使用中の各コンポーネントはコントローラーのプロパティーのように見えます。
もし、 `Cake\Controller\Component\FlashComponent` を
コントローラーに読込んだ場合、以下のようにアクセスすることができます。 :

``` php
class PostsController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');
    }

    public function delete()
    {
        if ($this->Post->delete($this->request->getData('Post.id')) {
            $this->Flash->success('Post deleted.');

            return $this->redirect(['action' => 'index']);
        }
    }
```

> [!NOTE]
> モデルとコンポーネントの両方がプロパティーとしてコントローラーに追加されているので、
> それらは同じ「名前空間」を共有しています。
> コンポーネントとモデルに同じ名前を付けないように注意してください。

## コンポーネントの作成

アプリケーションの様々な箇所で複雑な数学的処理を必要としている
オンラインアプリケーションを仮定して下さい。
これから、コントローラーの様々な箇所で使うための共有ロジックを集約するための
コンポーネントを作成します。

はじめに、新しいコンポーネントファイルとクラスを作成します。
**src/Controller/Component/MathComponent.php** にファイルを作成します 。
コンポーネントのための基本的な構造は次のようになります。 :

``` php
namespace App\Controller\Component;

use Cake\Controller\Component;

class MathComponent extends Component
{
    public function doComplexOperation($amount1, $amount2)
    {
        return $amount1 + $amount2;
    }
}
```

> [!NOTE]
> すべてのコンポーネントは `Cake\Controller\Component` を
> 継承しなければなりません。継承されていない場合、例外が発生します。

### コントローラーの中にコンポーネントを読み込む

一旦コンポーネントが完成してしまえば、コントローラーの `initialize()` メソッド中で
それをロードすることによって、アプリケーションのコントローラーで使用することができます。
ロードされた後、コントローラーはそのコンポーネントに由来する名前の新しいプロパティーを与えられ、
そのプロパティーを通してコンポーネントのインスタンスにアクセスできます。 :

``` php
// コントローラーの中で
// 標準の $this->Csrf と同様に
// 新しいコンポーネントを $this->Math として利用可能にします。
public function initialize(): void
{
    parent::initialize();
    $this->loadComponent('Math');
    $this->loadComponent('Csrf');
}
```

コントローラーの中でコンポーネントを読み込む時、コンポーネントのコンストラクターに渡す
バラメータを宣言することもできます。
このパラメーターはコンポーネントによって処理することができます。 :

``` php
// コントローラーの中で
public function initialize(): void
{
    parent::initialize();
    $this->loadComponent('Math', [
        'precision' => 2,
        'randomGenerator' => 'srand'
    ]);
    $this->loadComponent('Csrf');
}
```

上記の例では precision と randomGenerator を含む配列が
`MathComponent::initialize()` の `$config` パラメーターに渡されます。

### コンポーネントの中で他のコンポーネントを使用する

作成しているコンポーネントから他のコンポーネントを使いたい時がたまにあります。
その場合、作成中のコンポーネントから他のコンポーネントを読み込むことができ、
その方法はコントローラーから `$components` 変数を使って読み込む場合と同じです。 :

``` php
// src/Controller/Component/CustomComponent.php
namespace App\Controller\Component;

use Cake\Controller\Component;

class CustomComponent extends Component
{
    // あなたのコンポーネントが使っている他のコンポーネント
    public $components = ['Existing'];

    // あなたのコンポーネントに必要な、その他の追加のセットアップを実行
    public function initialize(array $config): void
    {
        $this->Existing->foo();
    }

    public function bar()
    {
        // ...
    }
}

// src/Controller/Component/ExistingComponent.php
namespace App\Controller\Component;

use Cake\Controller\Component;

class ExistingComponent extends Component
{
    public function foo()
    {
        // ...
    }
}
```

> [!NOTE]
> コントローラーから読み込んだコンポーネントと違い、コンポーネントから
> コンポーネントを読み込んだ場合は、コールバックが呼ばれないことに注意して下さい。

### コンポーネントのコントローラーへのアクセス

コンポーネント内から、\_registry を介して現在のコントローラーに
アクセスすることができます。 :

``` php
$controller = $this->getController();
```

## コンポーネントのコールバック

また、コンポーネントは、リクエストサイクルを増強することができる、
いくつかのリクエストライフサイクルコールバックを提供しています。

`method` Class::**beforeFilter**(EventInterface $event)

`method` Class::**startup**(EventInterface $event)

`method` Class::**beforeRender**(EventInterface $event)

`method` Class::**shutdown**(EventInterface $event)

`method` Class::**beforeRedirect**(EventInterface $event, $url, Response $response)

## コンポーネントイベントでのリダイレクトの使用

コンポーネントのコールバックメソッド内からリダイレクトするには、次のようにします。 :

``` php
public function beforeFilter(EventInterface $event)
{
    $event->stopPropagation();

    return $this->getController()->redirect('/');
}
```

イベントを停止することで、CakePHPに他のコンポーネントのコールバックを実行させたくないこと、
そしてコントローラがこれ以上アクションを処理してはいけないことを知らせます。
As of 4.1.0 you can raise a `RedirectException` to signal
a redirect:

``` php
use Cake\Http\Exception\RedirectException;
use Cake\Routing\Router;

public function beforeFilter(EventInterface $event)
{
    throw new RedirectException(Router::url('/'))
}
```

Raising an exception will halt all other event listeners and create a new
response that doesn't retain or inherit any of the current response's headers.
When raising a `RedirectException` you can include additional headers:

``` php
throw new RedirectException(Router::url('/'), 302, [
    'Header-Key' => 'value',
]);
```
