データソース
############

データソースはモデルとモデルが表現するデータの元（ソース）とを
仲立ちするものです。多くの場合、データは MySQL, PostgreSQL, Microsoft SQL Server
といったリレーショナルデータベースから取り出されます。
CakePHP は、以下の一覧にあるようないくつかのデータベース固有の
データソース（ ``lib/Cake/Model/Datasource/Database`` を参照）
とともに配布されています。:

- Mysql
- Postgres
- Sqlite
- Sqlserver

.. note::

    上記以外にも、
    `CakePHP DataSources repository on GitHub <https://github.com/cakephp/datasources/tree/2.0>`
    にコミュニティが開発しているデータソースがあります。

``app/Config/database.php`` でデータベースの接続設定を行うと、
モデルの操作全般において CakePHP は透過的に対応するデータソースを
使用します。このため、それらのデータソースに関する知識がなくても
利用できるようになっています。

前述のソースはどれも ``DboSource`` から派生したもので、これにより
ほとんどのリレーショナルデータベースで共通な、いくつかのロジックを
集約しています。新しく RDBMS のデータソースを書いてみようという向きには、
まずこれらのどれかを手本にするとよいでしょう
（MySQL または SQLite が最もオススメです）。

ただし、多くの人はリモート REST API さらには LDAP サーバといった、
外部ソースに関するデータソースを書くことに興味を持っています。
なので、我々も現在これらに目を向けつつあるところです。

データソースのための基本的な API
================================

データソースには少なくとも ``create``, ``read``, ``update``
および／または ``delete`` メソッドを実装することができ、また
『実装するべき』です。（現時点では、実際の各メソッドの特徴的な性質や
実装の詳細は重要ではありません。これらについては後述しています。）。
これらのメソッド以外については、特に必要でなければ実装する必要はありません。
さらに、もしリードオンリーのデータソースが必要なら、
``create``, ``update``, ``delete`` これら３つの存在意義はありません。

すべてのCRUD(CREATE/READ/UPDATE/DELETE)メソッドのために
実装しなければならないメソッド:

-  ``describe($model)``
-  ``listSources($data = null)``
-  ``calculate($model, $func, $params)``
-  少なくとも以下のうちのひとつ:

   -  ``create(Model $model, $fields = null, $values = null)``
   -  ``read(Model $model, $queryData = array(), $recursive = null)``
   -  ``update(Model $model, $fields = null, $values = null, $conditions = null)``
   -  ``delete(Model $model, $id = null)``

モデルではなくデータソース自身の中で ``$_schema`` クラス属性を
定義することも可能です（これは非常に有用な場合もあります）。

これはそれほど特殊なケースではありません。
データソースをモデルに結合させてもなお、 
``Model::find()/save()/delete()`` はいつも通りに使えます。
また、これらのメソッドを呼ぶときに使われる妥当なデータ
および／またはパラメータも、データソース自身に渡されます。
このため、（たとえば  Model::find へのオプションであれば
``'conditions'`` のパースや ``'limit'`` さらにはデータソース
自身が使うカスタムパラメータといった）必要と思われるどんな
機能でも実装することができます。

実装例
======

自らデータソースを書き起こしたいと思う理由でよくあるのは、
いつもの ``Model::find()/save()/delete()`` メソッドを使って
サードパーティの API にアクセスしたいという場合です。
ここでは架空のリモート JSON ベースの API にアクセスする
データソースを書いてみましょう。``FarAwaySource`` という名前で
``app/Model/Datasource/FarAwaySource.php`` に置くことにします::

    App::uses('HttpSocket', 'Network/Http');

    class FarAwaySource extends DataSource {

    /**
     * データソースの説明（オプション）
     */
        public $description = 'A far away datasource';

    /**
     * デフォルトの設定オプション。これらは ``app/Config/database.php`` 
     * でカスタマイズされ、 ``__construct()`` の中でマージされます。
     */
        public $config = array(
            'apiKey' => '',
        );

    /**
     * create() や update() を行いたい（実装したい）場合、利用できる
     * 項目を指定する必要があります。たとえば固定情報やスキーマの
     * 移行など、CakeSchema でやる場合と同じ配列キーを使います。
     */
        protected $_schema = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'key' => 'primary',
                'length' => 11,
            ),
            'name' => array(
                'type' => 'string',
                'null' => true,
                'length' => 255,
            ),
            'message' => array(
                'type' => 'text',
                'null' => true,
            ),
        );

    /**
     * HttpSocket を生成し、設定の調整を行う。
     */
        public function __construct($config) {
            parent::__construct($config);
            $this->Http = new HttpSocket();
        }

    /**
     * データソースは通常データベースに接続するので、データベース
     * なしでも動くようにいくらか調整する必要があります。
     */

    /**
     * listSources() はキャッシュ操作を行います。あなたはカスタム
     * データソースでも独自のやり方でキャッシュ機構を実装したいと思う
     * かもしれません。とりあえず、単に ``return null`` してください。
     */
        public function listSources($data = null) {
            return null;
        }

    /**
     * describe() はモデルに対して ``Model::save()`` のための
     * スキーマを伝えます。
     *
     * モデルごとに異なったスキーマを使いたい場合もあるかもしれませんが、
     * それでも単一のデータソースを使ってください。その場合、モデルに
     * 対して ``schema`` プロパティをセットし、ここでは単に 
     * ``$model->schema`` を返すようにします。
     */
        public function describe($model) {
            return $this->_schema;
        }

    /**
     * calculate() はレコード数のカウント方法を決定します。これは
     * ``update()`` と ``delete()`` の動作を決めるのに必要です。
     *
     * ここでは実際にはレコードのカウントはせず、``read()`` に渡されるべき
     * 文字列を返します。これが実際のカウント処理を行います。
     * 最も簡単なのは、ここでは単に 'COUNT' という文字列を返しておき、
     * ``read()`` の中で ``$data['fields'] === 'COUNT'`` かどうかを
     * 聞くようにすることです。
     */
        public function calculate(Model $model, $func, $params = array()) {
            return 'COUNT';
        }

    /**
     * CRUD のうちの R を実装します。 ``Model::find()`` への呼び出しは
     * ここに来ます。
     */
        public function read(Model $model, $queryData = array(),
            $recursive = null) {
            /**
             * ここでは、前述の calculate() メソッドで返されるカウントの
             * 実際の処理を行います。リモートソースのチェックをするか、
             * またはそれ以外の方法でレコードカウントを取得します。
             * ここでは単に 1 を返しているので、 ``update()`` や
             * ``delete()`` ではレコードが存在するものとみなされます。
             */
            if ($queryData['fields'] === 'COUNT') {
                return array(array(array('count' => 1)));
            }
            /**
             * ここではリモートデータを取得およびデコードして返します。
             */
            $queryData['conditions']['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->get(
                'http://example.com/api/list.json',
                $queryData['conditions']
            );
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return array($model->alias => $res);
        }

    /**
     * CRUD のうちの C を実装します。 ``Model::save()`` への呼び出しのうち
     *  $model->id がセットされないケースがここに来ます。
     */
        public function create(Model $model, $fields = null, $values = null) {
            $data = array_combine($fields, $values);
            $data['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->post('http://example.com/api/set.json', $data);
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    /**
     * CRUD のうちの U を実装します。 ``Model::save()`` への呼び出しのうち
     *  $model->id がセットされているケースがここに来ます。リモートソース
     *  に依存するためここでは単に ``$this->create()`` をコールできます。
     */
        public function update(Model $model, $fields = null, $values = null,
            $conditions = null) {
            return $this->create($model, $fields, $values);
        }

    /**
     * CRUD のうちの D を実装します。 
     * ``Model::delete()`` への呼び出しがここに来ます。
     */
        public function delete(Model $model, $id = null) {
            $json = $this->Http->get('http://example.com/api/remove.json', array(
                'id' => $id[$model->alias . '.id'],
                'apiKey' => $this->config['apiKey'],
            ));
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    }

データソースを構成するには ``app/Config/database.php`` 
ファイルの中で以下のように追加します::

    public $faraway = array(
        'datasource' => 'FarAwaySource',
        'apiKey'     => '1234abcd',
    );

そしてモデルの中でデータベースを以下のように使います::

    class MyModel extends AppModel {
        public $useDbConfig = 'faraway';
    }

これで、使い慣れたモデルのメソッドを使ってリモートソースから
データを取り出せるようになります::

    // Get all messages from 'Some Person'
    $messages = $this->MyModel->find('all', array(
        'conditions' => array('name' => 'Some Person'),
    ));

.. tip::

    あなたの ``read`` メソッドで返される配列のインデックスが数値以外の場合、
    find のタイプで ``'all'`` 以外を使うと予期しない結果が返る場合があります。 

同様に、新しいメッセージを保存できます::

    $this->MyModel->save(array(
        'name' => 'Some Person',
        'message' => 'New Message',
    ));

以前のメッセージを更新します::

    $this->MyModel->id = 42;
    $this->MyModel->save(array(
        'message' => 'Updated message',
    ));

そしてそのメッセージを削除します::

    $this->MyModel->delete(42);

データソースのプラグイン化
==========================

データソースをパッケージにしてプラグインにすることもできます。

単にあなたのデータソースファイルを
``Plugin/[YourPlugin]/Model/Datasource/[YourSource].php``
に置いて、それをプラグイン記法で参照するだけです::

    public $faraway = array(
        'datasource' => 'MyPlugin.FarAwaySource',
        'apiKey'     => 'abcd1234',
    );

SQL Serverに接続する
====================

SQL Server のデータソースは、pdo_sqlsrv と呼ばれるマイクロソフトの
PHP エクステンションに依存しています。この PHP エクステンションは
PHP の基本構成には含まれておらず、別途インストールする必要があります。

また、そのエクステンションが動作するためには SQL Server の
ネイティブクライアントがインストールされている必要があります。
そのネイティブクライアントは Windows 用しかないので、
これを Linux, Mac OS, FreeBSD 上で動かすことはできません。

このため、SQL Server が以下のようなエラー::

    Error: Database connection "Sqlserver" is missing, or could not be created.

を出す場合は、まず SQL Server の PHP エクステンション pdo_sqlsrv 
と SQL Server のネイティブクライアントが正しくインストール
されているかどうかを確認して下さい。

.. meta::
    :title lang=ja: DataSources
    :keywords lang=ja: array values,model fields,connection configuration,implementation details,relational databases,best bet,mysql postgresql,sqlite,external sources,ldap server,database connection,rdbms,sqlserver,postgres,relational database,microsoft sql server,aggregates,apis,repository,signatures

