CakePHP 1.3の新機能
-------------------

CakePHP 1.3は数多くの機能を取り入れました。
このガイドはそれらの変更点を要約しようとする試みです。
また、必要ならば、そのために拡張されたドキュメントを指し示します。

Components
~~~~~~~~~~

**SecurityComponent**

種々の ``requireGet`` や ``requirePost`` のようなrequireXXメソッドは、今や名前を指定する際に、引数一つ一つに文字列を渡すだけでなく、第一引数に単純な配列を渡すこともできるようになりました。

::

    $this->Security->requirePost(array('edit', 'update'));

**コンポーネントの設定**

全てのコアコンポーネントに対する設定は、``$components`` 配列から設定できるようになりました。
ビヘイビアのように、コンポーネントを宣言する際、コンポーネントの設定を宣言することができます。

::

    var $components = array(
        'Cookie' => array(
            'name' => 'MyCookie'
        ),
        'Auth' => array(
            'userModel' => 'MyUser',
            'loginAction' => array('controller' => 'users', 'action' => 'login')
        )
    );

はコントローラの ``beforeFilter()`` メソッドの乱雑さを減らすはずです。

**EmailComponent**


-  送信されたメールのメッセージの、レンダリング済みの内容を、 ``$this->Email->htmlMessage`` と ``$this->Email->textMessage`` を読むことによって検索することができるようになりました。
   これらのプロパティは、名前に即したレンダリングがなされたメールの内容に等しくなるでしょう。
-  多くのEmailComponentのprivateメソッドは、拡張しやすいようにprotectedになりました。
-  EmailComponent::$to は今や配列にすることができます。
   容易に複数の受取人を指定することと、他のプロパティとの整合性を取ることが可能になりました。
-  ``EmailComponent::$messageId`` が追加されました。
   これによりメールの「Message-ID」ヘッダを制御することが可能になりました。

ビューとヘルパー
~~~~~~~~~~~~~~~~

ルパーは、今や ``$helper->func()`` に加えて、 ``$this->Helper->func()`` にもマッピングされるようになりました。
これは、ビューの変数とヘルパーの名前との衝突を避けることができます。

**新しい JsHelper と HtmlHelper の新機能**

更なる情報は :doc:`JsHelperドキュメント </core-libraries/helpers/js>` を見てください。

**Pagination Helper**

PaginationヘルパはスタイリングのためにCSSのクラスの追加を提供します。
また、デフォルトのsort()の方向をセットすることができます。
``PaginatorHelper::next()`` と ``PaginatorHelper::prev()`` は、今やdivタグの代わりにspanタグをデフォルトとして生成します。

**Helper**

``Helper::assetTimestamp()`` が追加されました。
これはWWW\_ROOT以下にあるアセットにタイムスタンプを付与します。
従来と同様に、 ``Configure::read('Asset.timestamp');`` を伴って動作しますが、HtmlヘルパーとJavascriptヘルパーで使われていたこの機能は、全てのヘルパーで利用可能になりました。 ``Asset.timestamp == force`` と仮定すると、

::

    $path = 'css/cake.generic.css'
    $stamped = $this->Html->assetTimestamp($path);

    //$stamped は 'css/cake.generic.css?5632934892' （のような）文字列が入る

付加されたタイムスタンプはファイルの最終更新時刻に等しいです。
このメソッドは ``Helper`` で定義されたので、全てのサブクラスで利用可能になりました。

**TextHelper**

highlight() はハイライトするための単語の配列を受け入れるようになりました。

**NumberHelper**

新しいメソッド ``addFormat()`` が追加されました。
このメソッドはcurrencyパラメータの組み合わせを設定することを可能にし、同じものを何度も入力する必要がなくなりました。

::

    $this->Number->addFormat('NOK', array('before' => 'Kr. '));
    $formatted = $this->Number->currency(1000, 'NOK');

**FormHelper**

フォームヘルパーは数多くの改良と、APIの更新があります。
更なる情報は `Formヘルパーの改良点 <http://book.cakephp.org/view/1616/x1-3-improvements>`_
を見てください。

ログ
~~~~

ログとCakeLogは機能と柔軟性において共にかなりの進歩を見せました。
更なる情報は `新しいログの機能 <http://book.cakephp.org/view/1194/Logging>`_ を見てください。

キャッシュ
~~~~~~~~~~
1.3 では、キャッシュエンジンがよりフレキシブルになりました。 ``app/libs`` にカスタム ``Cache`` アダプタを用意することができます。
もちろん  ``$plugin/libs`` にもです。
また、app・plugin のキャッシュエンジンはコアのエンジンを上書きできます。
Cache アダプタは cache ディレクトリに置く必要があります。
``MyCustomCacheEngine`` という名前のキャッシュエンジンがあるなら、 ``app/libs/cache/my_custom_cache.php`` か ``$plugin/libs/cache/my_custom_cache.php`` のどちらかに置くことになります。
プラグインのキャッシュ設定は、ドットを使った文法を使う必要があります。

::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

アプリケーションまたはプラグインのキャッシュエンジンは ``app/bootstrap.php`` で設定する必要があります。
core.phpでこれらを設定しようとすると、正しく動作しないでしょう。

**新しいキャッシュメソッド**

キャッシュは 1.3 で幾つかの新しいメソッドがあり、テストのティアダウン(*teardown*)とイントロスペクション(*introspection*)を容易にします。


-  ``Cache::configured()`` は設定されたキャッシュエンジンのキーの配列を返します。
-  ``Cache::drop($config)`` は設定されたキャッシュエンジンを破棄します。
   一度破棄されたキャッシュエンジンは二度と書き込みや読み込みをすることができません。
-  ``Cache::increment()`` は数字の値に対して基本的なインクリメントを実行します。
   これは FileEngine では実装されていません。
-  ``Cache::decrement()`` は数字の値に対して基本的なデクリメントを実行します。
   これは FileEngine では実装されていません。

モデルとビヘイビアとデータソース
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**App::import()、データソース、プラグインのデータソース**

データソースは ``App::import()`` を用いてインクルードできるようになり、またプラグインからインクルードできるようになりました！
プラグインにデータソースをインクルードするには、 ``my_plugin/models/datasources/your_datasource.php`` に置いてください。
データソースをプラグインからインポートするには、
``App::import('Datasouce', 'MyPlugin.YourDatasource');``
を用いてください。

**database.phpでプラグインのデータソースを使うには**

プラグイン名を用いた「datesource」キーを設定することによって、プラグインのデータソースを使うことが出来ます。
例えば、LastFmデータソースを含むWebservicePackプラグイン(plugin/webservice\_pack/models/datasources/last\_fm.php)があるとすると、このようにできます：

::

    var $lastFm = array(
        'datasource' => 'WebservicePack.LastFm'
        ...

**モデル**


-  バリデーションメソッドが無い場合にエラーを引き起こすようになりました。
   何故バリデーションがうまく働かないかをデバッグするのが容易になりました。
-  モデルは
   `バーチャルフィールド <http://book.cakephp.org/view/1608/Virtual-fields>`_
   をサポートするようになりました。

**ビヘイビア**

存在しないビヘイビアを使おうとすると、missing behaviorsを出力する ``cakeError`` を引き起こすようになりました。
これによりビヘイビアが見つからないことを発見することと、修正することが容易になりました。

**CakeSchema**

CakeSchemaがプラグインに対して、スキーマファイルを設置/読み込み/書き込みできるようになりました。
またSchemaShellはこの機能を公開しています。
SchemaShellへの変更は下記を見てください。
また、CakeSchemaは ``tableParameters`` をサポートします。
テーブルパラメータは非カラムな、テーブルの特定の情報です。
これは照合順序、文字セット、コメント、テーブルエンジン種別のようなものです。
各々のDBOは自身がサポートするテーブルパラメータを実装します。

**MySQLでのテーブルパラメータ**

MySQLは一番多くのテーブルパラメータをサポートしています。
種々のMySQL特有の設定をするのに、テーブルパラメータを使うことが出来ます。


-  ``engine`` テーブルで使われるストレージエンジンをコントロールします。
-  ``charset``  テーブルで使われる文字セットをコントロールします。
-  ``encoding``  テーブルで使われるエンコーディングをコントロールします。

テーブルパラメータに加えて、MySQLのDBOは ``fieldParameters`` を実装しています。
``fieldParameters`` はカラム毎のMySQL特有の設定をコントロール可能にします。


-  ``charset`` カラムで使われる文字セットを指定します。
-  ``encoding`` カラムで使われるエンコーディングを指定します。

下記のテーブルパラメータとフィールドパラメータをスキーマファイルでどのように使うかの例を見てください。

**Postgresでのテーブルパラメータ**

....

**SQLiteでのテーブルパラメータ**

....

**スキーマファイルでテーブルパラメータを使う**

スキーマファイルで他のキーを使うのと同様に、 ``tableParameters`` を使います。
``indexes`` とよく似ています：

::

    var $comments => array(
        'id' => array('type' => 'integer', 'null' => false, 'default' => 0, 'key' => 'primary'),
        'post_id' => array('type' => 'integer', 'null' => false, 'default' => 0),
        'comment' => array('type' => 'text'),
        'indexes' => array(
            'PRIMARY' => array('column' => 'id', 'unique' => true),
            'post_id' => array('column' => 'post_id'),
        ),
        'tableParameters' => array(
            'engine' => 'InnoDB',
            'charset' => 'latin1',
            'collate' => 'latin1_general_ci'
        )
    );

これはいくつかのデータベース特有の設定をするための ``tableParameters`` を使ったテーブルの例となります。
データベースが実装していないオプションや機能が含まれたスキーマファイルを使ったとすると、これらのオプションは無視されるでしょう。
例えば、上記のスキーマをPostgreSQLサーバにインポートしたとすると、全てのテーブルパラメータは、内包するオプションをPostgreSQLがいずれもサポートしていないので無視されるでしょう。

Console
~~~~~~~

**Bake**

Bakeは数多くの重大な変更があります。これらの変更は
`Bakeの変更点セクション </view/1611/Bake-improvements-in-1-3>`_
を見てください。


**サブクラス化**

ShellDispatcherは、シェルとタスクが直近の親に *Shell* クラスをもたなくて良いように修正されました。

**Output**

``Shell::nl()`` が追加されました。
これは単行・複数行の改行文字を返します。
``Shell::out()`` 、 ``err()`` 、 ``hr()`` は、 ``$newlines`` 引数を受け取ることができるようになりました。
これは ``nl()`` に渡され、どれだけの新規行が出力に追加されるかをコントロールすることが可能です。

``Shell::out()`` と ``Shell::err()`` は引数無しで使うことができるように更新されました。
これはもし単行を出力したいときに ``$this->out('')`` などとしていたなら、特に役立ちます。

**Acl Shell**

全てのAclShellコマンドは ``node`` 引数をとるようになりました。
``node`` 引数には、 ``controllers/Posts/view`` のようなエイリアスと、 ``User.1`` のようなModel.foreign\_keyのどちらでも指定することができます。
もはやコマンドのためにaco/aroのidを知る・使う必要はありません。

Aclシェルの ``dataSource`` スイッチが削除されました。
代わりにConfigureで設定をしてください。

**SchemaShell**

SchemaシェルはプラグインのスキーマファイルとSQLダンプを読み書きできるようになりました。
``$plugin/config/schema`` にスキーマファイルがあることを期待し、書き出すのもここになります。

....

RouterとDispatcher
~~~~~~~~~~~~~~~~~~

**Router**

新しいスタイルの prefix を用いたURL生成は、まさしく 1.2 での admin ルーティングと同じく振舞います。
同じ文法を使い、同じ方法で持続的になり、同じ方法で振る舞います。
core.phpに ``Configure::write('Routing.prefixes', array('admin', 'member'));`` となっていると仮定すると、prefix 無しのURLから次のようにすることができます：

::

    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'member' => true));
    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'admin' => true));

同様に、prefix 有りのURLにおいて、prefix 無しのURLに行きたい場合、次のようにします：

::

    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'member' => false));
    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'admin' => false));

**ルートクラス**

1.3 では、ルートが内部で再構築され、新しく ``CakeRoute`` クラスが作られました。
このクラスは、このクラス独自のルートをパース・リバースマッチングすることを扱います。
また、1.3 では独自のルートクラスを作成・使用することができるようになりました。
アプリケーションのルートクラスで必要とされる特殊なルーティング機能を実装することができます。
開発者のルートクラスは ``CakeRoute`` を継承しなければなりません。
もしこれを継承しなければ、エラーが引き起こされます。
一般的に、カスタムルートクラスがカスタマイズされた処理を提供するには、 ``CakeRoute`` で見つけられる ``parse()`` メソッドと ``match()`` メソッドのどちらか（または両方共）をオーバーライドします。

**Dispatcher**


-  フィルタされるアセットのパスに、アセットフィルタを定義しない状態でアクセスすると、404ステータスのレスポンスが吐き出されます。

ライブラリクラス
~~~~~~~~~~~~~~~~

**Inflector**

Inflector::rulesを使い、Inflector::slugで使われる音訳マップのデフォルトをグローバルにカスタマイズすることができるようになりました。
例： ``Inflector::rules('transliteration', array('/å/' => 'aa', '/ø/' => 'oe'))``

また、Inflectorは今やinflectionのために渡された全てのデータを内部でキャッシュします。（slugメソッド以外）。

**Set**

Setには新しく ``Set::apply()`` メソッドがあります。
これは ``Set::extract`` の結果に `コールバック <http://ca2.php.net/callback>`_ を適用することができ、mapやreduceとして振舞うこともできます。

::

    Set::apply('/Movie/rating', $data, 'array_sum');

これは ``$data`` 内の映画の評価合計を返します。

**L10N**

カタログの全ての言語はdirectionキーを持つようになりました。
これは使われているロケールの文字の流れる方向を決定・定義するのに使用することができます。

**File**


-  Fileにcopy()メソッドが追加されました。
   これはファイルのインスタンスで表現されたファイルを新しい場所にコピーします。

**Configure**


-  ``Configure::load()`` はプラグインからも設定ファイルを読み込めるようになりました。
   ``Configure::load('plugin.file');`` としてプラグインから設定ファイルを読み込んでください。
   アプリケーションで ``.`` をファイル名にもつ設定ファイルがあったら、その名前は ``_`` を使うように修正すべきです。

**App/libs**

``app/vendors`` に加えて、新しく ``app/libs`` ディレクトリが追加されました。
またこのディレクトリはプラグインの一部として、 ``$plugin/libs`` に置くこともできます。
Libsディレクトリは、サードパーティ、外部ベンダからのライブラリではなく、ファーストパーティのライブラリを含有するものとして意図されています。
これはベンダライブラリと内部ライブラリの構成を分割することを可能にします。
また、 ``App::import()`` はlibsディレクトリからもインポートできるように更新されました。

::

    App::import('Lib', 'ImageManipulation'); // app/libs/image_manipulation.php をインポートする

プラグインからもlibsのファイルをインポートできます

::

    App::import('Lib', 'Geocoding.Geocode'); // app/plugins/geocoding/libs/geocode.php をインポートする

その他のlibをインポートする文法は、ベンダーファイルと同様です。
あなたがもしどうやってベンダファイルを独自の名前でインポートするかを知っていれば、あなたはどうやってlibsのファイルを独自の名前でインポートするかを知っていることになります。

**設定**


-  ``Security.level`` のデフォルトは1.3では **high** の代わりに **medium** になりました。
-  新しい設定値Security.cipherSeedがあります。
   この値はクッキーをよりセキュアに符号化するのを確実にするために独自のものに変更するべきでしょう。
   開発モードでは、この値がデフォルト値から変更されていない場合に警告が生成されます。

**i18n**

特定の言語の日時設定を検索するために、LC\_TIMEカテゴリのロケール定義ファイルを使うことができるようになりました。
POSIXに従ったロケール定義ファイルを使い、app/locale/*language*/ に保存してください（LC\_TIMEカテゴリのフォルダを作るのではなく、ファイルを作成してください）。

例えば、debianかubuntuが走ってるマシーンにアクセスすることができるなら、フランスのロケールファイルを/usr/share/i18n/locales/fr\_FRに見つけることができます。
LC\_TIMEに該当する部分をapp/locale/fr\_fr/LC\_TIME（ファイル）にコピーしてください。
そうすると、このようにフランス語の時間設定にアクセスすることがきでます：

::

    Configure::write('Config.language','fr-fr'); // 現在の言語をセットする
    $monthNames = __c('mon',LC_TIME,true); // フランス語の月の名前の配列を返す
    $dateFormat = __c('d_fmt',LC_TIME,true); // フランスで好まれる日にちのフォーマットを返す

LC\_TIME定義ファイルで使うことの出来る値の完全なガイドを
`このページ（英語） <http://sunsson.iptime.org/susv3/basedefs/xbd_chap07.html>`_
で読むことが出来ます。


その他
~~~~~~

**エラーハンドリング**

ErrorHandlerのサブクラスは、追加のエラーメソッドを実装することが更に簡単になりました。
以前は、debug = 0のとき全てのエラーメソッドを ``error404`` に変換するというErrorHandlerの要求を、 ``__construct()`` をオーバーライドすることによって回避する必要があったかもしれません。
1.3では、サブクラスで定義されたエラーメソッドは ``error404`` に変換されることはありません。
error404に独自のエラーメソッドを変換したいなら、手動でする必要があります。

**スキャフォールディング**

``Routing.prefixes`` が追加されたことに伴い、スキャフォールディングはprefixのいずれかの中でのスキャフォールディングが可能になるように書き直されました。

::

    <?php
    Configure::write('Routing.prefixes', array('admin', 'member'));

    class PostsController extends AppController {
        var $scaffold = 'member';
    }

これは「member」prefixがなされたURLでのスキャフォールディングを使うことになります。

**バリデーション**

1.2がリリースされた後、 ``phone()`` と ``postal()`` メソッドに補足的なローカライゼーションを追加して欲しいというリクエストが莫大に寄せられました。
全てのロケールをバリデーションしようとすると、メソッドが醜く膨れ上がる上に、あらゆるケースで必要とされる柔軟性を満たせないので、代わりの方法が採用されました。
1.3では、 ``phone()`` および ``postal()`` は、バリデーションが扱えない国識別子(*country prefix*)を、適切な名称を持つ別のクラスに受け流して処理させます。
例として、あなたがオランダに住んでいたとすると、以下のようなクラスを作ることになります。

::

    class NlValidation {
        public function phone($check) {
            ...
        }
        public function postal($check) {
            ...
        }
    }

このファイルはアプリケーションのどこにでも配置することができますが、使ってみようとする前にインポートされなければなりません。
モデルのバリデーションにおいて、以下のようにしてNlValidationクラスを使用します。

::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl'))
    );

デルのデータがバリデートされる際、バリデーションは「nl」ロケールを扱えないことを確認し、 ``NlValidation::postal()`` に委譲しようと試みます。
そしてこのメソッドの返り値がバリデーションの成功・失敗として扱われます。
このアプローチは、長大なswitch文が許容できないロケールのサブセットもしくはグループを扱うクラスを作成可能にします。
個別のバリデーションメソッドの使用方法は変更されず、別のバリデーターに受け渡す能力が追加されました。

**IPアドレスのバリデーション**

IPアドレスのバリデーションは特定のIPバージョンの厳格なバリデーションができるように拡張されました。
またこれは、もし利用可能なら、PHPネイティブのバリデーション機構を利用します。

::

    Validation::ip($someAddress);         // IPv4 と IPv6 両方を検証
    Validation::ip($someAddress, 'IPv4'); // IPv4 だけを検証
    Validation::ip($someAddress, 'IPv6'); // IPv6 だけを検証

**Validation::uuid()**

uuid()パターンのバリデーションが ``Validation`` クラスに追加されました。
これは与えられた文字列をパターンによってuuidに適合するかのチェックだけをします。
与えられたuuidの唯一性を保障するわけではありません。
