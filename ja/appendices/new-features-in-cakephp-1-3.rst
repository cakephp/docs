CakePHP 1.3 の新機能
--------------------

CakePHP 1.3 は数多くの機能を取り入れました。
このガイドはそれらの変更点を要約しようとする試みです。
また、必要ならば、そのために拡張されたドキュメントを指し示します。

Components
~~~~~~~~~~

**SecurityComponent**

種々の ``requireGet`` や ``requirePost`` のような requireXX メソッドは、
今や名前を指定する際に、引数一つ一つに文字列を渡すだけでなく、第一引数に単純な配列を
渡すこともできるようになりました。

::

    $this->Security->requirePost(array('edit', 'update'));

**コンポーネントの設定**

全てのコアコンポーネントに対する設定は、 ``$components`` 配列から設定できるようになりました。
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


-  送信されたメールのメッセージの、レンダリング済みの内容を、 ``$this->Email->htmlMessage`` と
   ``$this->Email->textMessage`` を読むことによって検索することができるようになりました。
   これらのプロパティは、名前に即したレンダリングがなされたメールの内容に等しくなるでしょう。
-  多くの EmailComponent の private メソッドは、拡張しやすいように protected になりました。
-  EmailComponent::$to は今や配列にすることができます。
   容易に複数の受取人を指定することと、他のプロパティとの整合性を取ることが可能になりました。
-  ``EmailComponent::$messageId`` が追加されました。
   これによりメールの「Message-ID」ヘッダを制御することが可能になりました。

ビューとヘルパー
~~~~~~~~~~~~~~~~

ルパーは、今や ``$helper->func()`` に加えて、 ``$this->Helper->func()`` にも
マッピングされるようになりました。これは、ビューの変数とヘルパーの名前との衝突を避けることができます。

**新しい JsHelper と HtmlHelper の新機能**

更なる情報は :doc:`JsHelperドキュメント </core-libraries/helpers/js>` を見てください。

**Pagination Helper**

PaginationヘルパはスタイリングのためにCSSのクラスの追加を提供します。また、デフォルトの
sort() の方向をセットすることができます。 ``PaginatorHelper::next()`` と
``PaginatorHelper::prev()`` は、今や div タグの代わりに span タグをデフォルトとして生成します。

**Helper**

``Helper::assetTimestamp()`` が追加されました。これは WWW\_ROOT 以下にあるアセットに
タイムスタンプを付与します。従来と同様に、 ``Configure::read('Asset.timestamp');`` を
伴って動作しますが、 Html ヘルパーと Javascript ヘルパーで使われていたこの機能は、
全てのヘルパーで利用可能になりました。 ``Asset.timestamp == force`` と仮定すると、

::

    $path = 'css/cake.generic.css'
    $stamped = $this->Html->assetTimestamp($path);

    //$stamped は 'css/cake.generic.css?5632934892' （のような）文字列が入る

付加されたタイムスタンプはファイルの最終更新時刻に等しいです。このメソッドは ``Helper``
で定義されたので、全てのサブクラスで利用可能になりました。

**TextHelper**

highlight() はハイライトするための単語の配列を受け入れるようになりました。

**NumberHelper**

新しいメソッド ``addFormat()`` が追加されました。このメソッドは currency パラメータの
組み合わせを設定することを可能にし、同じものを何度も入力する必要がなくなりました。

::

    $this->Number->addFormat('NOK', array('before' => 'Kr. '));
    $formatted = $this->Number->currency(1000, 'NOK');

**FormHelper**

フォームヘルパーは数多くの改良と、APIの更新があります。更なる情報は
`Form ヘルパーの改良点 <https://book.cakephp.org/1.3/en/The-Manual/Core-Helpers/Form.html#improvements>`_
を見てください。

ログ
~~~~

ログとCakeLogは機能と柔軟性において共にかなりの進歩を見せました。
更なる情報は `新しいログの機能 <https://book.cakephp.org/1.3/en/The-Manual/Common-Tasks-With-CakePHP/Logging.html>`_ を見てください。

キャッシュ
~~~~~~~~~~
1.3 では、キャッシュエンジンがよりフレキシブルになりました。 ``app/libs`` にカスタム
``Cache`` アダプタを用意することができます。もちろん  ``$plugin/libs`` にもです。
また、app・plugin のキャッシュエンジンはコアのエンジンを上書きできます。
Cache アダプタは cache ディレクトリに置く必要があります。 ``MyCustomCacheEngine``
という名前のキャッシュエンジンがあるなら、 ``app/libs/cache/my_custom_cache.php`` か
``$plugin/libs/cache/my_custom_cache.php`` のどちらかに置くことになります。
プラグインのキャッシュ設定は、ドットを使った文法を使う必要があります。

::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

アプリケーションまたはプラグインのキャッシュエンジンは ``app/bootstrap.php`` で設定する
必要があります。 core.php でこれらを設定しようとすると、正しく動作しないでしょう。

**新しいキャッシュメソッド**

キャッシュは 1.3 で幾つかの新しいメソッドがあり、テストのティアダウ ン(*teardown*) と
イントロスペクション (*introspection*) を容易にします。


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

データソースは ``App::import()`` を用いてインクルードできるようになり、またプラグインから
インクルードできるようになりました！プラグインにデータソースをインクルードするには、
``my_plugin/models/datasources/your_datasource.php`` に置いてください。
データソースをプラグインからインポートするには、
``App::import('Datasouce', 'MyPlugin.YourDatasource');``
を用いてください。

**database.php でプラグインのデータソースを使うには**

プラグイン名を用いた「datesource」キーを設定することによって、プラグインのデータソースを使うことが
出来ます。例えば、LastFm データソースを含む WebservicePack プラグイン
(plugin/webservice\_pack/models/datasources/last\_fm.php) があるとすると、
このようにできます。 ::

    var $lastFm = array(
        'datasource' => 'WebservicePack.LastFm'
        ...

**モデル**


-  バリデーションメソッドが無い場合にエラーを引き起こすようになりました。
   何故バリデーションがうまく働かないかをデバッグするのが容易になりました。
-  モデルはバーチャルフィールドをサポートするようになりました。

**ビヘイビア**

存在しないビヘイビアを使おうとすると、missing behaviors を出力する ``cakeError`` を
引き起こすようになりました。
これによりビヘイビアが見つからないことを発見することと、修正することが容易になりました。

**CakeSchema**

CakeSchema がプラグインに対して、スキーマファイルを設置/読み込み/書き込みできるようになりました。
また SchemaShell はこの機能を公開しています。SchemaShell への変更は下記を見てください。
また、CakeSchema は ``tableParameters`` をサポートします。テーブルパラメータは非カラムな、
テーブルの特定の情報です。これは照合順序、文字セット、コメント、テーブルエンジン種別のようなものです。
各々の DBO は自身がサポートするテーブルパラメータを実装します。

**MySQL でのテーブルパラメータ**

MySQL は一番多くのテーブルパラメータをサポートしています。
種々の MySQL 特有の設定をするのに、テーブルパラメータを使うことが出来ます。


-  ``engine`` テーブルで使われるストレージエンジンをコントロールします。
-  ``charset``  テーブルで使われる文字セットをコントロールします。
-  ``encoding``  テーブルで使われるエンコーディングをコントロールします。

テーブルパラメータに加えて、MySQL の DBO は ``fieldParameters`` を実装しています。
``fieldParameters`` はカラム毎の MySQL 特有の設定をコントロール可能にします。


-  ``charset`` カラムで使われる文字セットを指定します。
-  ``encoding`` カラムで使われるエンコーディングを指定します。

下記のテーブルパラメータとフィールドパラメータをスキーマファイルでどのように使うかの例を見てください。

**Postgresでのテーブルパラメータ**

....

**SQLiteでのテーブルパラメータ**

....

**スキーマファイルでテーブルパラメータを使う**

スキーマファイルで他のキーを使うのと同様に、 ``tableParameters`` を使います。
``indexes`` とよく似ています::

    var $comments => array(
        'id' => array(
          'type' => 'integer',
          'null' => false,
          'default' => 0,
          'key' => 'primary'
        ),
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

これはいくつかのデータベース特有の設定をするための ``tableParameters`` を使ったテーブルの
例となります。データベースが実装していないオプションや機能が含まれたスキーマファイルを使ったとすると、
これらのオプションは無視されるでしょう。例えば、上記のスキーマを PostgreSQL サーバに
インポートしたとすると、全てのテーブルパラメータは、内包するオプションを PostgreSQL がいずれも
サポートしていないので無視されるでしょう。

Console
~~~~~~~

**Bake**

Bake は数多くの重大な変更があります。これらの変更は
`Bake の変更点セクション <https://book.cakephp.org/1.3/en/The-Manual/Core-Console-Applications/Code-Generation-with-Bake.html#bake-improvements-in-1-3>`_
を見てください。

**サブクラス化**

ShellDispatcher は、シェルとタスクが直近の親に *Shell* クラスをもたなくて良いように修正されました。

**Output**

``Shell::nl()`` が追加されました。これは単行・複数行の改行文字を返します。 ``Shell::out()`` 、
``err()`` 、 ``hr()`` は、 ``$newlines`` 引数を受け取ることができるようになりました。
これは ``nl()`` に渡され、どれだけの新規行が出力に追加されるかをコントロールすることが可能です。

``Shell::out()`` と ``Shell::err()`` は引数無しで使うことができるように更新されました。
これはもし単行を出力したいときに ``$this->out('')`` などとしていたなら、特に役立ちます。

**Acl Shell**

全ての AclShell コマンドは ``node`` 引数をとるようになりました。 ``node`` 引数には、
``controllers/Posts/view`` のようなエイリアスと、 ``User.1`` のような
Model.foreign\_key のどちらでも指定することができます。もはやコマンドのために
aco/aro の id を知る・使う必要はありません。

Acl シェルの ``dataSource`` スイッチが削除されました。代わりに Configure で設定をしてください。

**SchemaShell**

Schema シェルはプラグインのスキーマファイルと SQL ダンプを読み書きできるようになりました。
``$plugin/config/schema`` にスキーマファイルがあることを期待し、書き出すのもここになります。

....

Router と Dispatcher
~~~~~~~~~~~~~~~~~~~~

**Router**

新しいスタイルの prefix を用いたURL生成は、まさしく 1.2 での admin ルーティングと同じく振舞います。
同じ文法を使い、同じ方法で持続的になり、同じ方法で振る舞います。core.php に
``Configure::write('Routing.prefixes', array('admin', 'member'));`` となっていると
仮定すると、prefix 無しの URL から次のようにすることができます::

    $this->Html->link(
      'Go',
      array('controller' => 'posts', 'action' => 'index', 'member' => true)
    );
    $this->Html->link(
      'Go',
      array('controller' => 'posts', 'action' => 'index', 'admin' => true)
    );

同様に、prefix 有りの URL において、prefix 無しの URL に行きたい場合、次のようにします::

    $this->Html->link(
      'Go',
      array(
        'controller' => 'posts',
        'action' => 'index',
        'member' => false
      )
    );
    $this->Html->link(
      'Go',
      array(
        'controller' => 'posts',
        'action' => 'index',
        'admin' => false
      )
    );

**ルートクラス**

1.3 では、ルートが内部で再構築され、新しく ``CakeRoute`` クラスが作られました。
このクラスは、このクラス独自のルートをパース・リバースマッチングすることを扱います。
また、1.3 では独自のルートクラスを作成・使用することができるようになりました。
アプリケーションのルートクラスで必要とされる特殊なルーティング機能を実装することができます。
開発者のルートクラスは ``CakeRoute`` を継承しなければなりません。もしこれを継承しなければ、
エラーが引き起こされます。一般的に、カスタムルートクラスがカスタマイズされた処理を提供するには、
``CakeRoute`` で見つけられる ``parse()`` メソッドと ``match()`` メソッドのどちらか
（または両方共）をオーバーライドします。

**Dispatcher**


-  フィルタされるアセットのパスに、アセットフィルタを定義しない状態でアクセスすると、
   404 ステータスのレスポンスが吐き出されます。

ライブラリクラス
~~~~~~~~~~~~~~~~

**Inflector**

Inflector::rules を使い、Inflector::slug で使われる音訳マップのデフォルトをグローバルに
カスタマイズすることができるようになりました。
例： ``Inflector::rules('transliteration', array('/å/' => 'aa', '/ø/' => 'oe'))``

また、Inflector は今や inflection のために渡された全てのデータを内部でキャッシュします。
（slugメソッド以外）。

**Set**

Set には新しく ``Set::apply()`` メソッドがあります。これは ``Set::extract`` の結果に
`コールバック <http://ca2.php.net/callback>`_ を適用することができ、map や reduce
として振舞うこともできます。 ::

    Set::apply('/Movie/rating', $data, 'array_sum');

これは ``$data`` 内の映画の評価合計を返します。

**L10N**

カタログの全ての言語は direction キーを持つようになりました。
これは使われているロケールの文字の流れる方向を決定・定義するのに使用することができます。

**File**


-  File に copy() メソッドが追加されました。
   これはファイルのインスタンスで表現されたファイルを新しい場所にコピーします。

**Configure**


-  ``Configure::load()`` はプラグインからも設定ファイルを読み込めるようになりました。
   ``Configure::load('plugin.file');`` としてプラグインから設定ファイルを読み込んでください。
   アプリケーションで ``.`` をファイル名にもつ設定ファイルがあったら、その名前は ``_`` を使うように
   修正すべきです。

**App/libs**

``app/vendors`` に加えて、新しく ``app/libs`` ディレクトリが追加されました。
またこのディレクトリはプラグインの一部として、 ``$plugin/libs`` に置くこともできます。
Libs ディレクトリは、サードパーティ、外部ベンダからのライブラリではなく、ファーストパーティの
ライブラリを含有するものとして意図されています。これはベンダライブラリと内部ライブラリの構成を
分割することを可能にします。また、 ``App::import()`` は libs ディレクトリからもインポート
できるように更新されました。

::

    App::import('Lib', 'ImageManipulation'); // app/libs/image_manipulation.php をインポートする

プラグインからも libs のファイルをインポートできます

::

    App::import('Lib', 'Geocoding.Geocode'); // app/plugins/geocoding/libs/geocode.php をインポートする

その他の libを インポートする文法は、ベンダーファイルと同様です。あなたがもしどうやって
ベンダファイルを独自の名前でインポートするかを知っていれば、あなたはどうやって libs のファイルを
独自の名前でインポートするかを知っていることになります。

**設定**


-  ``Security.level`` のデフォルトは 1.3 では **high** の代わりに **medium** になりました。
-  新しい設定値 Security.cipherSeed があります。
   この値はクッキーをよりセキュアに符号化するのを確実にするために独自のものに変更するべきでしょう。
   開発モードでは、この値がデフォルト値から変更されていない場合に警告が生成されます。

**i18n**

特定の言語の日時設定を検索するために、LC\_TIME カテゴリのロケール定義ファイルを使うことが
できるようになりました。POSIX に従ったロケール定義ファイルを使い、app/locale/*language*/
に保存してください（LC\_TIME カテゴリのフォルダを作るのではなく、ファイルを作成してください）。

例えば、debian か ubuntu が走ってるマシーンにアクセスすることができるなら、フランスの
ロケールファイルを /usr/share/i18n/locales/fr\_FR に見つけることができます。
LC\_TIME に該当する部分を app/locale/fr\_fr/LC\_TIME（ファイル）にコピーしてください。
そうすると、このようにフランス語の時間設定にアクセスすることがきでます：

::

    Configure::write('Config.language','fr-fr'); // 現在の言語をセットする
    $monthNames = __c('mon',LC_TIME,true); // フランス語の月の名前の配列を返す
    $dateFormat = __c('d_fmt',LC_TIME,true); // フランスで好まれる日にちのフォーマットを返す

LC\_TIME 定義ファイルで使うことの出来る値の完全なガイドを
`このページ（英語） <http://sunsson.iptime.org/susv3/basedefs/xbd_chap07.html>`_
で読むことが出来ます。


その他
~~~~~~

**エラーハンドリング**

ErrorHandler のサブクラスは、追加のエラーメソッドを実装することが更に簡単になりました。
以前は、debug = 0 のとき全てのエラーメソッドを ``error404`` に変換するという ErrorHandler
の要求を、 ``__construct()`` をオーバーライドすることによって回避する必要があったかもしれません。
1.3 では、サブクラスで定義されたエラーメソッドは ``error404`` に変換されることはありません。
error404 に独自のエラーメソッドを変換したいなら、手動でする必要があります。

**スキャフォールディング**

``Routing.prefixes`` が追加されたことに伴い、スキャフォールディングは prefix のいずれかの中での
スキャフォールディングが可能になるように書き直されました。

::

    <?php
    Configure::write('Routing.prefixes', array('admin', 'member'));

    class PostsController extends AppController {
        var $scaffold = 'member';
    }

これは「member」prefix がなされた URL でのスキャフォールディングを使うことになります。

**バリデーション**

1.2 がリリースされた後、 ``phone()`` と ``postal()`` メソッドに補足的なローカライゼーションを
追加して欲しいというリクエストが莫大に寄せられました。全てのロケールをバリデーションしようとすると、
メソッドが醜く膨れ上がる上に、あらゆるケースで必要とされる柔軟性を満たせないので、代わりの方法が
採用されました。1.3 では、 ``phone()`` および ``postal()`` は、バリデーションが扱えない
国識別子 (*country prefix*) を、適切な名称を持つ別のクラスに受け流して処理させます。
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

このファイルはアプリケーションのどこにでも配置することができますが、使ってみようとする前に
インポートされなければなりません。モデルのバリデーションにおいて、以下のようにして
NlValidation クラスを使用します。

::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl'))
    );

デルのデータがバリデートされる際、バリデーションは「nl」ロケールを扱えないことを確認し、
``NlValidation::postal()`` に委譲しようと試みます。そしてこのメソッドの返り値が
バリデーションの成功・失敗として扱われます。このアプローチは、長大な switch 文が
許容できないロケールのサブセットもしくはグループを扱うクラスを作成可能にします。
個別のバリデーションメソッドの使用方法は変更されず、別のバリデーターに受け渡す能力が追加されました。

**IP アドレスのバリデーション**

IP アドレスのバリデーションは特定の IP バージョンの厳格なバリデーションができるように拡張されました。
またこれは、もし利用可能なら、PHP ネイティブのバリデーション機構を利用します。

::

    Validation::ip($someAddress);         // IPv4 と IPv6 両方を検証
    Validation::ip($someAddress, 'IPv4'); // IPv4 だけを検証
    Validation::ip($someAddress, 'IPv6'); // IPv6 だけを検証

**Validation::uuid()**

uuid() パターンのバリデーションが ``Validation`` クラスに追加されました。
これは与えられた文字列をパターンによって UUID に適合するかのチェックだけをします。
与えられた UUID の唯一性を保障するわけではありません。


.. meta::
    :title lang=ja: New features in CakePHP 1.3
    :keywords lang=ja: component settings,array name,array controller,private methods,necessary components,core components,share names,collisions,func,message id,new features,clutter,consistency,messageid,email,htmlmessage,variables,doc
