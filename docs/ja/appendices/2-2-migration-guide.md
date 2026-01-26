# 2.2移行ガイド

CakePHP 2.2 は、2.0/2.1 の API の完全上位互換です。 このページでは、2.2 の変更と改善についてのアウトラインを紹介します。

## アップグレードに必要なステップ

CakePHP2.2 にアップグレードする際には、 `app/Config/bootstrap.php` ファイルに新しい設定項目を追加する必要があります。この追加設定は、2.1.xと同じような振舞いをする設定です :

``` php
// アセットプラグイン、キャッシュヘルパープラグインの
// ディスパッチャーフィルターを有効化
Configure::write('Dispatcher.filters', array(
    'AssetDispatcher',
    'CacheDispatcher'
));

// ログ設定の追加
CakeLog::config('debug', array(
    'engine' => 'FileLog',
    'types' => array('notice', 'info', 'debug'),
    'file' => 'debug',
));
CakeLog::config('error', array(
    'engine' => 'FileLog',
    'types' => array('warning', 'error', 'critical', 'alert', 'emergency'),
    'file' => 'error',
));
```

また、 `app/Config/core.php` ファイルも修正が必要です。
定数 `LOG_ERROR` に `LOG_ERR` の値で定義してください。 :

``` text
define('LOG_ERROR', LOG_ERR);
```

`Model::validateAssociated()` もしくは `Model::saveAssociated()` を利用していて、プライマリモデルでバリデーションが失敗した場合、関連モデルのバリデーションエラーもそのまま残ります。
`Model::$validationErrors` プロパティに常に全てのエラー情報が格納されます。2.1のテストケースでこれらを扱っていた場合、この変更を反映する必要があります。

## コンソール

### I18N extract shell

- デフォルトで既存のPOTファイルを上書きするオプションが追加されました:

      ./Console/cake i18n extract --overwrite

## モデル

- `Model::_findCount()` メソッドは、引数に `$state = 'before'` と `$queryData['operation'] = 'count'` を渡すと、内部でカスタム findメソッドを呼び出します。
  多くのケースでは、カスタム findを使ってページネーションのために既に正しいカウント結果を返し、
  `'operation'` キーは他のクエリを生成するためや、JOINの解除など、より柔軟に利用できます。
  今までは、モデルレベルで_findCount()をオーバーライドする回避策がありましたが、2.2ではその必要がなくなったのです。

## データソース

- Dboデータソースは、ネストトランザクションをサポートするようになりました。
  この機能を使う場合は、下記のようにします
  `ConnectionManager::getDataSource('default')->useNestedTransactions = true;`

## テスト

- Webランナはデバッグ出力時にテスト再実行のリンクを含むようになりました
- コントローラのテストケースを自動生成した場合、 `ControllerTestCase` クラスを継承するようになります

## エラーハンドリング

- 例外が繰返し呼び出されたり、エラーページのレンダリング中に例外が発生した場合、 `error` レイアウトが使われます。
  このレイアウトの中では、ヘルパーの利用をお勧めしません。
  これは、 ヘルパー利用によって起こるFatalエラーの問題があった場合に、正しくエラーレイアウトすらレンダリングされないからです。
- `app/View/Layouts/error.ctp` のファイルを自分のappディレクトリにコピーしておくことが重要です。
- アプリケーション固有のコンソールエラーハンドリングを設定できます。
  `Error.consoleHandler` と `Exception.consoleHandler` を設定することで、コンソールにおけるエラー/例外を制御するコールバックを定義できます。
- `Error.handler` と `Error.consoleHandler` のハンドラーは、Fatalエラーコード(例えば `E_ERROR`, `E_PARSE`, `E_USER_ERROR`)を受け取ります。

### 例外

- `NotImplementedException` が追加されました

## コア

### Configure

- `Configure::dump()` が追加されました。 これはファイルなどに設定情報を記録して永続的に利用するのに便利です。
  `PhpReader` と `IniReader` クラスが利用されます。
- 'Config.timezone' という新しいパラメータは、ユーザのタイムゾーンを定義するものです。
  例えば、 `Configure::write('Config.timezone', 'Europe/Paris')` のようにできます。
  もし `CakeTime` クラスのメソッドの引数 `$timezone` にNullを渡した場合、 'Config.timezone' が定義されていれば利用されます。
  この機能によって、メソッド呼び出し毎にタイムゾーンを渡す必要がなくなります。

## コントローラ

### Authコンポーネント

- `AuthComponent::$authenticate` プロパティで定義しているアダプター設定で、 `contain` オプションが追加されました。
  認証時にユーザレコードを検索する際に、containableのオプションとして利用されます。

### Cookieコンポーネント

- Rijndael暗号を使ってクッキーの暗号化が可能になりました。
  この機能は、 [mcrypt](https://www.php.net/mcrypt) のエクステンションが必要です。
  以前は XOR暗号が使われていましたが、Rijndael暗号を推奨します。
  互換性維持のために、デフォルトではXOR暗号を利用するようになっています。
  詳細は、 `Security::rijndael()` ドキュメントを参照ください

## ページネーション

- ページング処理にカスタムfindを利用している場合、正確なカウントを返すようになりました。
  詳細はモデルの変更の箇所を参照ください

## ネットワーク

### CakeEmail

- `CakeEmail::charset()` と `CakeEmail::headerCharset()` が追加されました
- 日本語エンコーディングが正しく処理されるようになりました。
  本文に `ISO-2202-JP-MS` エンコードが利用される場合、メールヘッダには `ISO-2202-JP` がセットされるようになりました。
  これは、ヘッダに `ISO-2202-JP-MS` がセットされていると正しく動かないメールクライアントへの対応です
- `CakeEmail::theme()` が追加されました
- `CakeEmail::domain()` が追加されました。
  コンソールスクリプトからのメール送信や、メール送信時にホスト名を制御したい場合などに、
  ドメイン名をセットするこのメソッドが使えます
- `theme` と `helpers` がEmailConfigクラスで定義できるようになりました

### CakeRequest

- CakeRequestは、 `PUT`, `DELETE` リクエスト時に、 `application/x-www-form-urlencoded` リクエストボディを自動的にデコードするようになりました。
  このデータは、POSTデータと同じように `$this->data` に格納されます

## ユーティリティ

### Set

- `Set` クラスは廃止予定になりました。代わりに `Hash` クラスを利用ください。
  SetクラスはCakePHP3.0までは削除されずに残ります。
- `Set::expand()` が追加されました( `Hash::expand()` クラスも同様に追加されています )

### Hash

`Hash` クラスが2.2から追加されました。これはSetクラスの置換えで、
より一貫性、信頼性があり、Setクラスと同じAPIで同じような処理を行います。
詳細は、 [Hash](../core-utility-libraries/hash) を参照ください

### CakeTime

- `$userOffset` パラメータは、 `$timezone` パラメータに置き換わりました。
  数値のオフセットの変わりに、タイムゾーンの文字列や、 DateTimeZoneオブジェクトを渡すことができます。
  `$timezone` に数値のオフセットを渡すことも、下位互換のために可能にしています。
- `CakeTime::timeAgoInWords()` メソッドに、 `accuracy` オプションが追加されました。
  このオプションは、時間のフォーマットをより詳細に表現したい場合に利用します。
- 新しく追加されたメソッド
  - `CakeTime::toServer()`
  - `CakeTime::timezone()`
  - `CakeTime::listTimezones()`
- CakeTimeのメソッドで利用する `$dateString` パラメータには、DateTimeオブジェクトが渡せるようになりました

## ヘルパー

### FormHelper

- Formヘルパーは、inputに必要なクラスの追加を、よりうまく扱うようになりました。
  これは `on` キーを受け取ります
- `FormHelper::radio()` メソッドは、 `empty` をサポートします。
  これは、 `select()` のemptyオプションに似たものです
- `FormHelper::inputDefaults()` メソッドを追加しました。
  これにより、ヘルパーで生成するinputタグに共通のプロパティを定義できるようになりました

### TimeHelper

- CakePHP2.1から、TimeHelperのいくつかのメソッドはCakeTimeクラスを利用します。
  `$userOffset` パラメータは、 `$timezone` パラメータに置換えられます。
- `TimeHelper::timeAgoInWords()` メソッドに `element` オプションが追加されました
  これは整形した時間表示に、HTMLエレメントをかぶせることができます。

### HtmlHelper

- `HtmlHelper::tableHeaders()` メソッドは、テーブルセル単位に属性がセットできるようになりました

## ルーティング

### Dispatcher

- ディスパッチャーコールに、独自のイベントリスナーを追加することができるようになりました。
  これにより、クライアントからのリクエストの変更や、クライアントに返すレスポンス情報の変更が容易になります。
  詳細は、 [ディスパッチャー・フィルター](../development/dispatch-filters) ドキュメントを参照ください
- この機能を利用するために、 `app/Config/bootstrap.php` ファイルをアップデートする必要があります。
  詳細は、 [Required Steps To Upgrade 2 2](#required-steps-to-upgrade-2-2) を参照ください

### Router

- `Router::setExtensions()` メソッドが追加されました。
  パースすべき拡張子が追加できるようになりました。

## キャッシュ

### Redis エンジン

新しいキャッシュエンジン [phpredis extension](https://github.com/phpredis/phpredis) が追加されました。
設定は Memcacheエンジンに似ています。

### キャッシュグループ

キャッシュキーにラベルやタグによるグルーピングが可能になりました。
これにより、グループ単位で一度に同一ラベルのキャッシュを消すなどの処理が簡単になります。
グループはキャッシュエンジン生成時の設定のものが定義されます :

``` php
Cache::config(array(
    'engine' => 'Redis',
    ...
    'groups' => array('post', 'comment', 'user')
));
```

グループはいくつでも持てますが、注意して頂きたいのが、グループは動的に変更できないことです。

`Cache::clearGroup()` クラスメソッドが追加されました。
これはグループ名を元に、同じ文字列のラベルのキャッシュを消すメソッドです

## ログ

`CakeLog` の変更によって、いくつかの設定を `app/Config/bootstrap.php` ファイルに追加する必要があります。
詳細は、 [ロギング](../core-libraries/logging) を参照ください。

- `CakeLog` クラスは [RFC 5424](https://tools.ietf.org/html/rfc5424) の定義と同じレベルでログを出力します。
  いくつかの便利なメソッドが追加されました。
  - `CakeLog::emergency($message, $scope = array())`
  - `CakeLog::alert($message, $scope = array())`
  - `CakeLog::critical($message, $scope = array())`
  - `CakeLog::error($message, $scope = array())`
  - `CakeLog::warning($message, $scope = array())`
  - `CakeLog::notice($message, $scope = array())`
  - `CakeLog::info($message, $scope = array())`
  - `CakeLog::debug($message, $scope = array())`
- `CakeLog::write` メソッドに第3引数 `$scope` が追加されました。
  [Logging Scopes](../core-libraries/logging#logging-scopes) を参照ください
- 新しいログエンジン `ConsoleLog` が追加されました。

## モデルバリデーション

- `ModelValidator` オブジェクトが追加されました。これはモデルのバリデーションのデリゲートとして機能します。
  バリデーションは後方互換が保たれます。バリデーションルールを、追加、変更、削除できるリッチなAPIを提供します。
  詳細は、 [データバリデーション](../models/data-validation) ドキュメントを参照ください。
- モデルのカスタムバリデーション関数は、 `ModelValidator` がアクセス可能なように "public" にしておく必要があります。
- 追加された新しいバリデーションルール :
  - `Validation::naturalNumber()`
  - `Validation::mimeType()`
  - `Validation::uploadError()`
