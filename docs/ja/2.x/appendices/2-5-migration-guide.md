# 2.5 移行ガイド

CakePHP 2.5 は、2.4 の API の完全上位互換です。
このページでは、2.5 の変更と改善についてのアウトラインを紹介します。

## キャッシュ

- `Memcached` アダプターが新しく追加されました。新しいアダプターは、
  ext/memcache の代わりに ext/memcached を使用します。パフォーマンスの向上と
  永続的なコネクションの共有をサポートします。
- `Memcached` アダプターの追加に伴い `Memcache` アダプターは非推奨になりました。
- `Cache::remember()` が追加されました。
- `Cache::config()` は、 `RedisEngine` 使用の際、
  非標準のデータベース番号のために `database` キーを許可するようになりました。

## コンソール

### SchemaShell

- サブコマンド `create` と `update` に `yes` オプションが追加されました。
  `yes` オプションは、対話的な質問をスキップするために強制的に
  yes で返します。

### CompletionShell

- [CompletionShell](../console-and-shells/completion-shell) が追加されました。
  bash や zsh のようなシェル環境上のための自動補完ライブラリ作成を補助することが狙いです。
  CakePHP にはシェルスクリプトは含まれていませんが、基礎となるツールを用意しました。

## コントローラ

### AuthComponent

- `loggedIn()` が非推奨になりました。 3.0 で削除されます。
- `ajaxLogin` を使用していてユーザーが未認証の場合、 AuthComponent は `200` の代わりに `403` ステータスコードを返すようになりました。

### CookieComponent

- `CookieComponent` は `Security` の変更に伴い
  AES-256 暗号を使用できます。 `CookieComponent::type()` に
  'aes' を指定することで有効になります。

### RequestHandlerComponent

- `RequestHandlerComponent::renderAs()` は `Controller::$ext` を
  設定しなくなりました。ビューが非標準の拡張子の場合、問題が発生していました。

### AclComponent

- ACL ノード参照失敗は、直接ログ出力されます。
  `trigger_error()` の呼び出しは削除されました。

### Scaffold

- 動的な Scaffold は非推奨になりました。3.0 で削除されます。

## コア

### App

- `App::pluginPath()` は非推奨になりました。代わりに `CakePlugin::path()` を使用してください。

### CakePlugin

- `CakePlugin::loadAll()` は、直感通りにデフォルト設定とプラグイン固有のオプションをマージします。詳しくは、テストケースを参照してください。

## イベント

### EventManager

グローバルなマネージャに紐づくイベントは、ローカルなマネージャーに紐づくイベントと共に、優先順位に従って実行されます。
今までのリリースでは、異なる順番で実行されていました。
全てのグローバルなリスナーが呼ばれたあとにインスタンスリスナーが実行されていましたが、今後は２つのリスナーの集まりを優先順位に従って１つのリスナーのリストに結合した後、実行します。
優先順位が高いグローバルなリスナーは、インスタンスリスナーの前に実行されます。

## I18n

- `I18n` クラスにいくつかの定数が追加されました。これらの定数は、
  読みやすいようにハードコードされた整数を置き換えるものです。
  例： `I18n::LC_MESSAGES` 。

## モデル

- データソースによって符号なし整数がサポートされました (MySQL)。
  スキーマやフィクスチャのファイル中で `unsigined` オプションを true に
  設定すると、この機能が有効になります。
- クエリ中に含まれる JOIN は、　アソシエーションからの JOIN の **後に** 追加されます。
  これにより、自動生成されたアソシエーションに依存するテーブル結合を容易にします。

## ネットワーク

### CakeEmail

- CakeEmail で扱うメールアドレスは、デフォルトで `filter_var` で検証されます。
  これは、 `root@localhost` のようなメールアドレスを許可するためにメールアドレス規則を緩和します。
- email の設定配列で、 `template` キーを指定していなくても `layout` キーを指定できるようになりました。

### CakeRequest

- `CakeRequest::addDetector()` は、パラメータベースの検出器を作成するときに、有効なオプションの配列を受け入れる `options` をサポートします。
- `CakeRequest::onlyAllow()` が非推奨になりました。 代わりに同等の機能を持つ `CakeRequest::allowMethod()` メソッドが追加されました。

### CakeSession

- セッションが空の場合、セッションは開始されなくなります。
  もしセッションクッキーが見つからない時、書込み操作が完了するまではセッションは開始されません。

## ルーティング

### Router

- `Router::mapResources()` は、`$options` 引数の中で `connectOptions` キーを許可するようになりました。
  詳しくは、[カスタムRESTルーティング](../development/rest#custom-rest-routing) を参照してください。

## ユーティリティ

### Debugger

- `Debugger::dump()` と `Debugger::log()` は、 `$depth` パラメータをサポートします。
  これの新しいパラメータは、より深くネストされたオブジェクト構造を容易に出力できるようになります。

### Hash

- `Hash::insert()` と `Hash::remove()` は、マッチャー表現によるパスの指定をサポートしました。

### File

- `File:replaceText()` が追加されました。このメソッドは、 `str_replace` を使ってファイル中のテキストを簡単に置き換えることが出来ます。

### Folder

- `Folder::addPathElement()` は、 `$element` パラメータを配列として受け取るようになりました。

### Security

- `Security::encrypt()` と `Security::decrypt()` が追加されました。
  これらのメソッドは、AES-256 共通鍵暗号を利用するためのとてもシンプルなAPIです。
  これらは `cipher()` や `rijndael()` メソッドを考慮して使用されるべきです。

### Validation

- `Validation::inList()` と `Validation::multiple()` の
  第三引数は、 <span class="title-ref">\$strict</span> から <span class="title-ref">\$caseInsensitive</span> に修正されました。
  <span class="title-ref">\$strict</span> は、間違った動作をしていて誤解されやすいため、廃止になりました。
  今は、大文字と小文字を区別せずに比較するために、このパラメータに true を設定します。
  デフォルト値は false で、今までのように大文字と小文字を区別して値やリストを比較します。
- `Validation::mimeType()` の `$mimeTypes` パラメータは、正規表現が使用できます。
  また、 `$mimeTypes` が配列の場合、配列の値は小文字になります。

## ロギング

### FileLog

- CakeLog は、自動設定されなくなりました。結果として、出力先が未設定ならログファイルは自動的に作成されなくなりました。
  もし、全てのタイプやレベルのログを出力させたいなら、少なくとも１つのデフォルトエンジンを設定する必要があります。

## エラー

### ExceptionRenderer

ExceptionRenderer は、エラーテンプレートに "code"、"message"、"url" 変数が設定されます。
"name" 変数は非推奨になりましたが、まだ使用可能です。これら変数は、全てのエラーテンプレートにわたって一様に適用されます。

## テスト

- フィクスチャファイルはサブディレクトリに配置できるようになりました。
  `.` の後にディレクトリ名を加えることで、サブディレクトリ内のフィクスチャを利用できます。
  例えば、 <span class="title-ref">app.my_dir/article</span> は `App/Test/Fixture/my_dir/ArticleFixture` を読み込みます。
- フィクスチャは、 `$canUseMemory` に false を設定することで、MySQL の MEMORY ストレージエンジンの使用を無効にすることが出来ます。

## ビュー

### View

- `$title_for_layout` は非推奨になりました。代わりに `$this->fetch('title');` と
  `$this->assign('title', 'あなたのページタイトル');` を使用してください。
- `View::get()` は、第二引数にデフォルト値を指定できるようになりました。

### FormHelper

- FormHelper は、 `binary` フィールドタイプのためのファイル入力フォームを生成します。
- `FormHelper::end()` は、第二引数が追加されました。このパラメータは、
  SecurityComponent と連携してフォームの安全を保つためのフィールドに新たな属性を追加することができます。
- `FormHelper::end()` と `FormHelper::secure()` は、
  生成された hidden input の属性を追加オプションと置き換えることが出来るようになりました。
  これは、 HTML5 の `form` 属性を使用したい時に便利です。
- `FormHelper::postLink()` は、リンクとして返すの代わりに生成された form タグをバッファリングすることが出来るようになりました。これは、折り重なった form タグを避けるのに役立ちます。

### PaginationHelper

- `PaginatorHelper::sort()` は、 デフォルトのソート順のみでページをソートするリンクを生成するために `lock` オプションが追加されました。

### ScaffoldView

- 動的なスキャフォールドは非推奨になりました。 3.0 で削除されます。
