5.0 移行ガイド
###################

CakePHP 5.0 には、破壊的な変更が含まれており、4.x リリースとの後方互換性はありません。
5.0 にアップグレードする前に、最初に 4.5 にアップグレードし、すべての非推奨警告を解消してください。

5.0 にアップグレードする方法の段階的な手順については、
:doc:`/appendices/5-0-upgrade-guide` を参照してください。

非推奨機能の削除
===========================

4.5 で非推奨の警告を発していたすべてのメソッド、プロパティと機能が削除されました。


破壊的変更
================

非推奨機能の削除に加えて、破壊的変更が行われました。

全体
------

- 全ての関数について、可能な限り、引数や返り値の型が明示されるようになりました。DockBlockに書かれた注釈(annotation)に合致するように意図しましたが、DockBlock側を修正した箇所もあります。
- クラスのpropertyについても同様に型が可能な限り明示されるようになりました。こちらでも注釈を修正した箇所もあります。
- 次の定数が削除されました : ``SECOND``, ``MINUTE``, ``HOUR``, ``DAY``,  ``WEEK``, ``MONTH``, ``YEAR``
- 全ての ``#[\AllowDynamicProperties]`` 指定が削除されました。これは以下のクラスで使用されていました。
   - ``Command/Command``
   - ``Console/Shell``
   - ``Controller/Component``
   - ``Controller/Controller``
   - ``Mailer/Mailer``
   - ``View/Cell``
   - ``View/Helper``
   - ``View/View``
- サポート対象のデータベースエンジンのバージョンが更新されました。
   - MySQL (5.7 以上)
   - MariaDB (10.1 以上)
   - PostgreSQL (9.6 以上)
   - Microsoft SQL Server (2012 以上)
   - SQLite 3 (3.16 以上)

Auth
----

- `Auth` は削除されました。代わりに `cakephp/authentication <https://book.cakephp.org/authentication/3/ja/index.html>`__ および
    `cakephp/authorization <https://book.cakephp.org/authorization/3/ja/index.html>`__ プラグインを使用してください。

Cache
-----

- ``Wincache`` エンジンは削除されました。wincache拡張は PHP 8 ではサポートされていないため、です。

Collection
----------

- ``combine()`` は、指定した key path や group path が存在しないまたは null 値の場合に、例外を投げるようになりました。
  この挙動は、 ``indexBy()`` や ``groupBy()`` と同じです。

Console
-------

- ``BaseCommand::__construct()`` は削除されました。
- ``ConsoleIntegrationTestTrait::useCommandRunner()`` は、もはや必要無いため削除されました。
- ``Shell`` は削除されました。代わりに `Command <https://book.cakephp.org/5/en/console-commands/commands.html>`__ をお使い下さい。
- ``ConsoleOptionParser::addSubcommand()`` は ``Shell`` の削除とともに削除されました。
    サブコマンドは ``Command`` クラスで置き換えてください。
    必要なコマンド名は ``Command::defaultName()`` を実装することで定義できます。
- ``BaseCommand`` は ``execute()`` メソッドがフレームワークから呼び出される前後に ``Command.beforeExecute`` および
  ``Command.afterExecute`` のイベントを発行するようになりました。

Connection
----------

- ``Connection::prepare()`` は削除されました。これは、SQL文、パラメータ、パラメータ型の情報を渡すことで ``Connection::execute()`` の1回の呼び出しに置き換えることができます。
- ``Connection::enableQueryLogging()`` は削除されました。データベース接続設定においてロギングを有効にしていない場合、 ``$connection->getDriver()->setLogger()`` を呼び出して logger インスタンスを設定することにより、後からロギングを有効にできます。

Controller
----------

- ``Controller::__construct()`` は削除されました。サブクラスでoverrideしていた場合は、コードの調整をお願いします。
- Component は、 Controller の読み込み後に dynamic property として設定されることは無くなりました。代わりに Controller は ``__get()`` を用いて Component へのアクセスを提供します。この変更は、 Component の存在有無を ``property_exists()`` でチェックしているアプリケーションに影響を与えます。
- Component が発行していた ``Controller.shutdown`` イベントは、 ``shutdown`` から ``afterFilter`` に名称変更されました。Controller に合わせるためです。これにより callback はより首尾一貫したものとなります。
- ``PaginatorComponent`` は削除されました。代わりに、 Controller で ``$this->paginate()`` を呼び出すか、直接 ``Cake\Datasource\Paging\NumericPaginator`` を用いて下さい。
- ``RequestHandlerComponent`` は削除されました。アップグレード方法は `4.4 移行ガイド <https://book.cakephp.org/4/ja/appendices/4-4-migration-guide.html#requesthandlercomponent>`__ を参照して下さい。
- ``SecurityComponent`` は削除されました。代わりに ``FormProtectionComponent`` で耐タンパ性を得たり、 ``HttpsEnforcerMiddleware`` を使って HTTPS を強制したりして下さい。
- ``Controller::paginate()`` は、その引数 ``$settings`` において ``contain`` オプション等を受け付けなくなりました。代わりに ``finder`` オプションを使って ``$this->paginate($this->Articles, ['finder' => 'published'])`` などとして下さい。事前にクエリを組み立てておいてそれを ``paginate()`` に渡すこともできます。例えば ``$query = $this->Articles->find()->where(['is_published' => true]); $this->paginate($query);`` となります。

Core
----

- 関数 ``getTypeName()`` は削除されました。代わりに、PHPの ``get_debug_type()`` をお使い下さい。
- 依存ライブラリ ``league/container`` は ``4.x`` に更新されました。これによって ``ServiceProvider`` の実装には追加の型ヒントが必要となります。
- ``deprecationWarning()`` には引数 ``$version`` が追加されました。
- ``App.uploadedFilesAsObjects`` オプションは、PHPそのもののファイルアップロードにおける array 生成に倣い、削除されました。
- ``ClassLoader`` は削除されました。代わりに Composer の autoload の仕組みをお使い下さい。

Database
--------

- ``DateTimeType`` および ``DateType`` は、常に変更不可能(immutable)なオブジェクトを返すようになりました。また、 ``Date`` オブジェクトの interface は ``ChronosDate`` の interface を反映するようになり、CakePHP 4.x で存在した時刻関連のメソッドが無くなりました。
- ``DateType::setLocaleFormat()`` は array を受け付けないようになりました。
- ``Query`` は ``callable`` ではなく ``\Closure`` なパラメータのみを受け付けるようになりました。 callable なオブジェクトは PHP 8.1 で導入された、第一級 callable の記法で書き換え可能です。（訳注 : `PHPのマニュアル 「第一級callableを生成する記法」 <https://www.php.net/manual/ja/functions.first_class_callable_syntax.php>`_ ）
- ``Query::execute()`` は、結果を整形するコールバックを呼ばないようになりました。代わりに ``Query::all()`` をお使い下さい。
- ``TableSchemaAwareInterface`` は削除されました。
- ``Driver::quote()`` は削除されました。代わりに prepared statement をお使い下さい。
- ``Query::orderBy()`` は ``Query::order()`` の代わりに追加されました。
- ``Query::groupBy()`` は ``Query::group()`` の代わりに追加されました。
- ``SqlDialectTrait`` は削除されました。ここで提供されていた全ての機能は ``Driver`` クラスそのものに実装されました。
- ``CaseExpression`` は削除されました。代わりに ``QueryExpression::case()`` または ``CaseStatementExpression`` をお使い下さい。
- ``Connection::connect()`` は削除されました。代わりに ``$connection->getDriver()->connect()`` をお使い下さい。
- ``Connection::disconnect()`` は削除されました。代わりに ``$connection->getDriver()->disconnect()`` をお使い下さい。
- クエリのログの scope として ``queriesLog`` だけではなく ``cake.database.queries`` も使えるようになりました。
- 結果セットのバッファリングを有効化・無効化する機能は削除されました。常にバッファリングされます。

Datasource
----------

- ``getAccessible()`` メソッドが ``EntityInterface`` に追加されました。ORM外でこの interface を実装している場合は、このメソッドも実装する必要があります。
- ``aliasField()`` メソッドが ``RepositoryInterface`` に追加されました。ORM外でこの interface を実装している場合は、このメソッドも実装する必要があります。

Event
-----

- Event に載せるデータ(payload) は、配列である必要があります。配列ではないオブジェクト、例えば ``ArrayAccess`` は array へのキャストで失敗して ``TypeError`` を出すようになります。
- イベントハンドラは void メソッドとして実装し、結果は返り値として返却するのではなく ``$event->setResult()`` に渡す方法が推奨されます。

Error
-----

- ``ErrorHandler`` および ``ConsoleErrorHandler`` は削除されました。対応方法は `4.4 移行ガイド <https://book.cakephp.org/4/ja/appendices/4-4-migration-guide.html#errorhandler-consoleerrorhandler>`__ をご覧下さい。
- ``ExceptionRenderer`` は削除されました。代わりに ``WebExceptionRenderer`` をお使い下さい。
- ``ErrorLoggerInterface::log()`` は削除されました。代わりに ``ErrorLoggerInterface::logException()`` をお使い下さい。
- ``ErrorLoggerInterface::logMessage()`` は削除されました。代わりに ``ErrorLoggerInterface::logError()`` をお使い下さい。

Filesystem
----------

- Filesystem というパッケージは削除されました。 ``Filesystem`` というクラスは Utility のパッケージに移動されました。

Http
----

- ``ServerRequest`` の ``files`` は、 array とは互換性は無くなりました。この挙動は 4.1.0 でデフォルトでは停止されていました。この ``files`` は常に ``UploadedFileInterfaces`` オブジェクトを持つようになります。

I18n
----

- ``FrozenDate`` は `Date` に名称変更され、また ``FrozenTime`` も `DateTime` に名称変更されました。
- ``Time`` は ``Cake\Chronos\ChronosTime`` を継承するようになりました。その結果として変更不可能(immutable)になりました。
- ``Date`` オブジェクトは ``DateTimeInterface`` を継承しなくなりました。そのため、 ``DateTime`` オブジェクトと比較することはできません。
    詳細は `cakephp/chronos のリリースドキュメント <https://github.com/cakephp/chronos/releases/tag/3.0.2>`__ を参照してください。
- ``Date::parseDateTime()`` は削除されました。
- ``Date::parseTime()`` は削除されました。
- ``Date::setToStringFormat()`` および ``Date::setJsonEncodeFormat()`` は、配列を受け付けないようになりました。
- ``Date::i18nFormat()`` および ``Date::nice()`` は、タイムゾーンの引数を受け付けないようになりました。
- ベンダ名が接頭辞に付いたプラグイン（例えば ``FooBar/Awesome``）への翻訳ファイルは、接頭辞を含むファイル名として下さい（例えば ``foo_bar_awesome.po``）。これは、同名の接頭辞無しのプラグイン（例えば ``Awesome``）の翻訳ファイル（この例では ``awesome.po``）との衝突を避けるためのものです。

Log
---

- Logエンジンの設定において、特定のスコープを無効化する際には ``false`` ではなくて ``null`` を用いるようになりました。設定ファイルにおいて ``'scopes' => false`` となっている箇所は ``'scopes' => null`` と書き換えて下さい。

Mailer
------

- ``Email`` は削除されました。代わりに `Mailer <https://book.cakephp.org/5/ja/core-libraries/email.html>`__ をお使い下さい。
- ログのスコープとして ``email`` の代わりに ``cake.mailer`` も指定できるようになりました。

ORM
---

- ``EntityTrait::has()`` は、属性が存在してその値が ``null`` である場合、 ``true`` を返すようになりました。過去のCakePHPのバージョンにおいては ``false`` を返していました。4.x の挙動が必要な場合の対応方法は、4.5.0 のリリースノートを参照して下さい。（訳注 : 4.5のリリースノートは日本語には翻訳されていません。 `英語版の 4.5 の Migration Guide <https://book.cakephp.org/4/en/appendices/4-5-migration-guide.html#orm>`_ の中では ``EntityTrait::hasValue()`` を使うように案内されています。）
- ``EntityTrait::extractOriginal()`` は ``extractOriginalChanged()`` と同様に、存在するフィールドのみを返すようになりました。
- Finder の引数は連想配列である必要があります。過去にはこれは推奨事項という位置付けでした。
- ``TranslateBehavior`` はデフォルトでは ``ShadowTable`` ストラテジを採用するようになりました。もしも ``Eav`` ストラテジを利用中で、その挙動を維持する必要があるのならば、設定を変更する必要があります。
- ``isUnique`` ルールの ``allowMultipleNulls`` オプションは、デフォルトではtrueとなり、本来の 3.x の挙動に合致するようになりました。
- ``Table::query()`` は、後述のクエリタイプごとのメソッドが提供されたことに伴い、削除されました。（訳注 : 5.0.5 時点においては実際には削除されておらず、 ``Table::query()`` は ``Table::selectQuery()`` を呼び出しているようです。）
- ``Table::updateQuery()``, ``Table::selectQuery()``, ``Table::insertQuery()``, ``Table::deleteQuery()`` の4つのメソッドが追加されました。これらは以下に示すクエリタイプごとのオブジェクトを返します。
- ``SelectQuery``, ``InsertQuery``, ``UpdateQuery``, ``DeleteQuery`` の4つの型が追加されました。クエリのタイプが型として指定されることで、クエリタイプが変更されたり、無関係な別のクエリタイプの関数を呼んだりするのを防ぐようになりました。
- ``Table::_initializeSchema()`` は削除されました。代わりに ``initialize()`` の中で ``$this->getSchema()`` を呼んで下さい。
- ``SaveOptionsBuilder`` は削除されました。通常の配列をお使い下さい。

Routing
-------

- ``Router`` のstaticメソッドの ``connect()``, ``prefix()``, ``scope()``, ``plugin()`` は削除されました。代わりに ``RouteBuilder`` のインスタンスのメソッドをお使い下さい。
- ``RedirectException`` は削除されました。代わりに ``\Cake\Http\Exception\RedirectException`` をお使い下さい。

TestSuite
---------

- ``TestSuite`` は削除されました。単体テストの設定をカスタマイズするには、環境変数を使って下さい。
- ``TestListenerTrait`` は削除されました。PHPUnitがこれらの listener のサポートを打ち切ったためです。詳細は :doc:`/appendices/phpunit10` を参照して下さい。
- ``IntegrationTestTrait::configRequest()`` が複数回呼ばれた際、設定を上書きするのではなく merge するようになりました。

Validation
----------

- ``Validation::isEmpty()`` は、ファイルアップロードの配列には対応しないようになりました。PHPのファイルアップロードの配列への対応は ``ServerRequest`` からも削除されていますので、この問題はテストの外側の問題だとは捉えないようにして下さい。
- 以前は、ほとんどの validation エラーの文言は ``The provided value is invalid`` という単純なものでした。今では例えば ``The provided value must be greater than or equal to \`5\`` のように、もう少し詳細に言及するようになりました。

View
----

- ``ViewBuilder`` のオプションは、本当の意味で連想配列となりました（stringのキーを用います）。
- ``NumberHelper`` および ``TextHelper`` は ``engine`` 設定を受け付けないようになりました。
- ``ViewBuilder::setHelpers()`` のパラメータ ``$merge`` は削除されました。代わりに ``ViewBuilder::addHelpers()`` をお使い下さい。
- ``View::initialize()`` の中では、 ``loadHelper()`` よりも ``addHelper()`` の方が望ましいようになりました。設定されたヘルパーはいずれにせよ後で読み込まれます。
- ``View\Widget\FileWidget`` は、PHPのファイルアップロードの配列とは互換性が無くなりました。この変更は ``ServerRequest`` や ``Validation`` と同じ趣旨のものです。
- ``FormHelper`` は、CSRF対策トークンのフィールドでは ``autocomplete=off`` を設定しないようになりました。これはSafariのバグへの応急措置として設定されましたが、今ではもう関係はありません。

非推奨
============

以下は非推奨となったメソッド、プロパティ、挙動の一覧です。これらの機能は 5.x では動作し続けますが、 6.0 では削除される予定です。

Database
--------

- ``Query::order()`` は非推奨となりました。代わりに ``Query::orderBy()`` をお使い下さい。この変更はSQL文の機能名称に合わせたものになります。
- ``Query::group()`` は非推奨となりました。代わりに ``Query::groupBy()`` をお使い下さい。この変更はSQL文の機能名称に合わせたものになります。

ORM
---

- ``Table::find()`` のオプションを配列で指定することは非推奨となりました。代わりに `名前付き引数 <https://www.php.net/manual/ja/functions.arguments.php#functions.named-arguments>`__ を使用して下さい。例えば ``find('all', ['conditions' => $array])`` の代わりに ``find('all', conditions: $array)`` です。カスタムの finder オプションについても同様に ``find('list', ['valueField' => 'name'])`` の代わりに ``find('list', valueField: 'name')`` を使用して下さい。複数の名前付き引数の場合は例えば ``find(type: 'list', valueField: 'name', conditions: $array)`` となります。

新機能
============

進化した型チェック
-----------------------

CakePHP 5 は、PHP 8.1 以上で有効な型システムを活用します。
CakePHPは ``assert()`` を使うことによっても、詳細なエラーメッセージや、型の安全性を提供します。
本番運用モードにおいては、 ``assert()`` でのコード生成を停止させてパフォーマンスを向上させることができます。
この方法については :ref:`symlink-assets` を参照して下さい。（訳注 : このリンク先は、2024年3月時点ではまだ翻訳されていません。 `英語版 <https://book.cakephp.org/5/en/deployment.html#symlink-assets>`__ で ``zend.assertions`` を設定している箇所を参照して下さい。）

Collection
----------

- コールバック関数を用いて重複した値を除去するメソッド ``unique()`` が追加されました。
- ``reject()`` は、trueっぽい値のみを除外するデフォルトのコールバック関数が利用可能になりました。これは ``filter()`` のデフォルトの挙動の真逆となります。

Core
----

- ``PluginInterface`` には ``services()`` メソッドが追加されました。
- :ref:`プラグインの読み込み <loading-a-plugin>` に ``PluginCollection::addFromConfig()`` が追加されました。

Database
--------

- ``ConnectionManager`` は read / write の接続ロールをサポートしました。データベース接続設定において ``read`` や ``write`` のキーで指定した設定項目によって共通の設定項目を上書きすることで、接続ロールを構成することができます。
- 結果セットを整形するコールバックを実行できるメソッド ``Query::all()`` が追加されました。
- SQLにコメントを追加するメソッド ``Query::comment()`` が追加されました。これによりクエリのデバッグが楽になります。
- PHPの enum と、データベースの string や integer 型との間の橋渡しをする ``EnumType`` が追加されました。
- ``DriverInterface`` に ``getMaxAliasLength()`` と ``getConnectionRetries()`` が追加されました。
- 以前は integer 型の主キー全てに自動的に auto-increment 指定を入れていましたが、 "id" という名前の integer 型の主キーにのみこの動作をするようになりました。 'autoIncrement' を false に設定することで、この挙動を無効にできます。

Http
----

- `PSR-17 <https://www.php-fig.org/psr/psr-17/>`__ factory interface への対応が追加されました。これによって ``cakephp/http`` パッケージは、 php-http のように自動で interface resolution を有効にするライブラリに対してclient実装を提供できるようになりました。
- 例外を発することなく便利に cookie を操作できる方法として ``CookieCollection::__get()`` と ``CookieCollection::__isset()`` が追加されました。

ORM
---

必須フィールド
----------------------

モデルのエンティティには opt-in 方式で利用可能な新しい機能、より厳格なプロパティ操作、が追加されました。
この新しい機能は「必須フィールド」と呼ばれます。
有効化されると、エンティティで定義されていないプロパティにアクセスした場合に例外が発生します。
これは以下のようなコードに影響を与えます::

    $entity->get();
    $entity->has();
    $entity->getOriginal();
    isset($entity->attribute);
    $entity->attribute;

フィールドは ``array_key_exists`` が true を返す場合に「定義されている」と判断されます。
これは null 値も含まれます。
この機能はうんざりするようなものであるかもしれないので、5.0 まで導入が延期されてきました。
将来はこれをデフォルトでオンにしようと検討していますが、フィードバックがあればぜひお知らせ下さい。

型付きFinderパラメータ
-----------------------

テーブルの finder のパラメータは必須のものにすることができるようになりました。
例えばブログ記事の投稿をカテゴリまたはユーザで検索するメソッドは、以前はこのようなコードになりました::

    public function findByCategoryOrUser(SelectQuery $query, array $options)
    {
        if (isset($options['categoryId'])) {
            $query->where(['category_id' => $options['categoryId']]);
        }
        if (isset($options['userId'])) {
            $query->where(['user_id' => $options['userId']]);
        }

        return $query;
    }

これが今では次のように書くことができます::

    public function findByCategoryOrUser(SelectQuery $query, ?int $categoryId = null, ?int $userId = null)
    {
        if ($categoryId) {
            $query->where(['category_id' => $categoryId]);
        }
        if ($userId) {
            $query->where(['user_id' => $userId]);
        }

        return $query;
    }

この finder を呼び出す際は ``find('byCategoryOrUser', userId: $somevar)`` と書くことができます。
さらに、特別な名前付き引数を用いて、条件を追加することもできます。例えば ``find('byCategoryOrUser', userId: $somevar, conditions: ['enabled' => true])`` のようになります。

同様の変更が ``RepositoryInterface::get()`` にも追加されました::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, [
            'contain' => ['Books'],
            'finder' => 'latest',
        ]);
    }

以前は上記のようなコードでしたが、今後は以下のようにも書けます::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, contain: ['Books'], finder: 'latest');
    }

TestSuite
---------

- Integrationテストにおいて、次に発行するリクエストのヘッダに、JSON でやり取りする趣旨のヘッダを付与するメソッド ``IntegrationTestTrait::requestAsJson()`` が追加されました。

Plugin Installer
----------------
- プラグインのインストーラが更新されて、プラグインのクラスの autoload を自動的に制御するようになりました。 ``composer.json`` から、名前空間とパスの対応関係マップを削除して、 ``composer dumpautoload`` を実行することでもプラグインを動作させられます。
