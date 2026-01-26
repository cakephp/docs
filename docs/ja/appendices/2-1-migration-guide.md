# 2.1 移行ガイド

CakePHP 2.1 は、2.0 の API の完全上位互換です。
このページでは、2.1 の変更と改善についてのアウトラインを紹介します。

## AppController, AppHelper, AppModel および AppShell

これらのクラスは App ディレクトリの一部として必要になりました。CakePHP
のコアからは削除されています。もし、これらのクラスを利用していなかった
場合は、次のような方法でアップグレードすることができます。:

``` php
// app/View/Helper/AppHelper.php
App::uses('Helper', 'View');
class AppHelper extends Helper {
}

// app/Model/AppModel.php
App::uses('Model', 'Model');
class AppModel extends Model {
}

// app/Controller/AppController.php
App::uses('Controller', 'Controller');
class AppController extends Controller {
}

// app/Console/Command/AppShell.php
App::uses('Shell', 'Console');
class AppShell extends Shell {
}
```

もし、あなたのアプリケーションが既にこれらのファイルやクラスを利用して
いた場合には、特に何もする必要はありません。
その他、コアの PagesController を利用していた場合には、このファイルを
app/Controller ディレクトリへコピーする必要があります。

## .htaccess ファイル

デフォルトの `.htaccess` ファイルが変わっていますので、このファイルを
アップデートするか、Web サーバの URL 書き換え機能を `.htaccess` の変
更に合わせてアップデートことを忘れないようにしてください。

## モデル

- `beforeDelete` コールバックは、ビヘイビアの beforeDelete コールバッ
  クより前に実行されます。これはモデルレイヤでの他のイベントとの動きと
  一貫したものになります。
- `Model::find('threaded')` では、 `parent_id` 以外のフィールドを使
  えるように `$options['parent']` が利用可能になりました。もちろん、
  モデルが TreeBehavior をアタッチし、他の親フィールドを利用している場
  合には、threaded 検索はデフォルトでそのフィールドを利用します。
- プリペアード・ステートメントで利用するクエリのパラメータは SQL ダンプ
  の一部となりました。
- バリデーション配列は、フィールドの必要性をより明確に指定できるようになりました。
  `required` キーは `create` と `update` の値を持つことができます。
  これらの値は、作成時と更新時のそれぞれでフィールドの値の必要性を定義できます。
- モデルには `schemaName` プロパティが加わりました。もし、あなたの
  アプリケーションが `Model::$useDbConfig` を修正して、データソース
  を切り替えている場合は、 `schemaName` もあわせて修正するか、これ
  （訳注： `Model::$useDbConfig` の変更）を行う
  `Model::setDataSource()` メソッドを使うようにすべきです。

### CakeSession

::: info Changed in version 2.1.1
CakeSession は P3P ヘッダをセットしなくなりました。このことは、あな たのアプリケーションの動作に変化でる場合があります。
:::

## ビヘイビア

### TranslateBehavior

- `I18nModel` は、複数のファイルに分割されました。

## 例外（Exceptions）

デフォルトの例外（Exception）は、スタック中の全ての関数の引数のダンプと
ファイルの抜粋を含んだスタックトレースを出力するようになりました。

## ユーティリティ

### デバッガ

- `Debugger::getType()` が追加されました。これは変数の型を取得します。
- `Debugger::exportVar()` がより読みやすく使いやすい出力が出来るように修正されました。

### debug()

`debug()` は内部で `Debugger` クラスを利用するようになりました。
これはデバッガとしての辻褄があいますし、よりよいものにするためのアドバンテージをもたらします。

### Set

- `Set::nest()` が追加されました。フラットな配列をネストされた配列として返します。

### File

- `File::info()` がファイルサイズと MIME タイプも返すようになりました。
- `File::mime()` が追加されました。

### Cache

- `CacheEngine` は複数のファイルに分割されました。

### Configure

- `ConfigReaderInterface` は複数のファイルに分割されました。

### App

- `App::build()` は `App::REGISTER` を利用して新しいパッケージを追加することができるようになりました。 より詳しい情報は [App Build Register](../core-utility-libraries/app#app-build-register) を参照してください。
- 設定されたパスの中で見つからないクラスは `APP` を代替パスとして検索します。
  これは `app/Vendor` 内でディレクトリがネストしている場合などにオートロードを簡易にします。

## コンソール

### Test Shell

新しい TestShell が追加されました。ユニットテストを実行するために必要な
タイプ数を軽減したり、ファイルパスベースの UI を提供します。 :

    ./Console/cake test app Model/Post
    ./Console/cake test app Controller/PostsController
    ./Console/cake test Plugin View/Helper/MyHelper

古いテストスイートのシェルとその記法もまだ存在しています。

### General

- 作成されたファイルは、作成された日時のタイムスタンプをもう含んでいません。

## ルーティング

### Router

- Route 機能は特別な `/**` の書き方が利用できるようになりました。全て
  の引数を単一の引数のように扱えます。詳しくは
  [Connecting Routes](../development/routing#connecting-routes) セクションを確認してください。
- `Router::resourceMap()` が追加されました。
- `Router::defaultRouteClass()` が追加されました。このメソッ
  ドは、これより先に接続する全てのデフォルトの route クラスを設定できます。

## ネットワーク

### CakeRequest

- requestAction を判定するための `is('requested')` と `isRequested()` が追加されました。

### CakeResponse

- Cookie をセットするための `CakeResponse::cookie()` が追加されました。
- [Cake Response Caching](../controllers/request-response#cake-response-caching) 用の沢山のメソッドが追加されました。

## コントローラ

### Controller

- `Controller::$uses` はデフォルトが false ではなく `true` に変更となりました。
  その他、この変更については値により少しの違いがありますが、ほとんどの場合はこれまでと同じ動きをします。

  > - `true` を指定した場合、デフォルトのモデルを読み込み、AppController へマージします。
  > - 配列を指定した場合、そこにあるモデルを読み込み、AppController へマージします。
  > - 空の配列を指定した場合、ベースのクラスで宣言されたもの以外のモデルを読み込みません。
  > - `false` を指定した場合、ベースのクラスで宣言されたものを含め、どのモデルも読み込みません。

## コンポーネント

### AuthComponent

- `AuthComponent::allow()` では、全てのアクションを許可する
  `allow('*')` のようなワイルドカードは使わなくなりました。
  代わりに `allow()` を使ってください。
  これは allow() と deny() とで共通した API となります。
- 全ての認証用アダプタに `recursive` オプションが追加されました。セッ
  ションに格納されたアソシエーションをより用意にコントロールすることが
  できるようになりました。

### AclComponent

- `AclComponent` は、 `Acl.classname` で使う場合に小文字お
  よび複数形ではなくなりました。
- Acl バックエンドの実装は `Controller/Component/Acl` へ置かれるよう
  になりました。
- Acl の実装は Component ディレクトリから Component/Acl ディレクトリへ
  移動されました。例えば、
  `Controller/Component/CustomAclComponent.php` に保存していた
  `CustomAclComponent` という名前の独自 Acl クラスを使っていたとしま
  す。これは `Controller/Component/Acl/CustomAcl.php` へ移動します。
  また、名称を `CustomAcl` へ変更します。
- `DbAcl` は、単独のファイルに分割されました。
- `IniAcl` は、単独のファイルに分割されました。
- `AclInterface` は、単独のファイルに分割されました。

## ヘルパー

### TextHelper

- `TextHelper::autoLink()` と
  `TextHelper::autoLinkUrls()` 、
  `TextHelper::autoLinkEmails()` は、デフォルトで HTML のエス
  ケープを行なうようになりました。
  `escape` オプションにより、動作をコントロールできます。

### HtmlHelper

- `HtmlHelper::script()` に `block` が追加されました。
- `HtmlHelper::scriptBlock()` に `block` が追加されました。
- `HtmlHelper::css()` に `block` が追加されました。
- `HtmlHelper::meta()` に `block` が追加されました。
- `HtmlHelper::getCrumbs()` の <span class="title-ref">\$startText</span>\` パラメータに配列が利用できるようになりました。
  これは最初のパンくずリンクにより多くのコントロールと柔軟性を与えます。
- `HtmlHelper::docType()` はデフォルトで　HTML5 となりました。
- `HtmlHelper::image()` に `fullBase` オプションが追加されました。
- `HtmlHelper::media()` が追加されました。
  このメソッドを使って、 HTML5 の audio/video エレメントを作成することができます。
- `HtmlHelper::script()` と `HtmlHelper::css()` 、
  `HtmlHelper::image()` に `プラグイン記法` がサポートされました。
  `Plugin.asset` を利用し、より用意にプラグインへのリンクが作成できます。
- `HtmlHelper::getCrumbList()` に `$startText` が追加されました。

## ビュー

- `View::$output` は推奨されません。

- `$content_for_layout` は推奨されません。
  代わりに `$this->fetch('content');` を利用してください。

- `$scripts_for_layout` は推奨されません。代わりに下記の記述を利用してください。 :

  ``` php
  echo $this->fetch('meta');
  echo $this->fetch('css');
  echo $this->fetch('script');
  ```

  `$scripts_for_layout` は、まだ存在しています。
  しかし、 [view blocks](../views#view-blocks) API 方が拡張性や柔軟性をもたらします。

- `Plugin.view` シンタックスがどこでも使えるようになりました。ビュー
  やレイアウト、エレメントの名前を参照したい際に、どこでもこのシンタッ
  クスを利用できます。

- `~View::element()` の `$options['plugin']` オプションは推奨されません。
  代わりに `Plugin.element_name` を利用してください。

### Content type views

CakePHP に2つのビュークラスが追加されました。新しい
`JsonView` と `XmlView` は、XML と JSON ビューの
作成を用意にしてくれます。これらのクラスについては、
[JSONとXMLビュー](../views/json-and-xml-views) セクションで詳しく学べます。

### Extending views

`View` クラスには、ビューやエレメント、レイアウトを別のファイ
ルでラップしたり拡張したりするための新しいメソッドが加わりました。
この機能の更に詳しい内容は [Extending Views](../views#extending-views) セクションを参照してください。

### Themes

`View` クラスの代わりの `ThemeView` クラスは推奨されません。シンプ
ルに `$this->theme = 'MyTheme'` のようにセットすることで、テーマのサ
ポートができます。また、 `ThemeView` を継承した全てのカスタムビューク
ラスは `View` を継承するようにしてください。

### View blocks

ビューブロックは、ビューのパーツやブロックの作成に柔軟性をもたらします。
ブロックは `$scripts_for_layout` の強力かつ柔軟な代替 API です。
より詳しいことは [View Blocks](../views#view-blocks) を参照してください。

## ヘルパー

### New callbacks

2つの新しいコールバックがヘルパーに追加されました。
新しい `Helper::beforeRenderFile()` と
`Helper::afterRenderFile()` は、エレメントやレイアウト、ビューが
レンダリングされる前と後とに呼ばれます。

### CacheHelper

- エレメントの中に記述された `<!--nocache-->` タグが正しく動作するようになりました。

### FormHelper

- Formヘルパーは、セキュアフィールドハッシュから disabled になっている
  フィールドを除外するようになりました。これにより
  `SecurityComponent` と disabled な input フィールドとの共
  存がしやすくなりました。
- ラジオボタンで `between` オプションを利用していた場合の挙動が変わりました。
  `between` の値は、legend タグと最初の input エレメントの間に表示されます。
- チェックボックスの `hiddenField` オプションは、ちょうど 0 ではなく
  'N' のような特定の値をセットできるようになりました。
- 日付および時間の入力における `for` アトリビュートは、最初に作成された input タグに反映されます。
  これは生成された datetime 項目にで変化が生じるかも知れません。
- `FormHelper::button()` の `type` アトリビュートは削除可能になりました。
  デフォルトは 'submit' になっています。
- `FormHelper::radio()` は全ての option を無効にできるように
  なりました。`$attributes` 配列において、 `'disabled' => true`
  もしくは `'disabled' => 'disabled'` とすることで可能になります。

### PaginatorHelper

- `PaginatorHelper::numbers()` に `currentClass` オプションが追加されました。

## テスト

- Web テストランナーは、PHPUnit のバージョン番号を表示するようになりました。
- Web テストランナーは、app テストをデフォルトで表示するようになりました。
- フィクスチャが \$test ではない別のデータソースに作成することができるようになりました。
- ClassRegistry によって読み込まれたモデルや他のデータソースから読み込
  まれたモデルは、 `test_` の接頭辞が付いたデータソース名を取得します。
  （例えば <span class="title-ref">master</span> というデータソースであれば、テスト内では
  <span class="title-ref">test_master</span> を利用しようとします）
- テストケースは setup メソッドを含んだクラスとして生成されます。

## イベント

- 新しい一般的なイベントシステムが作成され、コールバックによる方法は推奨されなくなりました。
  これはあなたのコードの変更を要求するものではありません。
- あなた自身のイベントをディスパッチすることができ、自由自在にコールバックに付加することができます。
  これによりプラグイン間の通信に有効だったり、クラスの分離を容易にしたりします。
