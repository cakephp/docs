スキーマの管理とマイグレーション
################################

スキーマシェルはスキーマオブジェクト、SQLダンプを作成したり、スナップショットを作成、
保存する機能を提供します。

スキーマファイルの作成と使用方法
================================

作成したスキーマファイルを使うと、データベースに依存することなく簡単に別の環境へ移植できます。
また、既存のデータベースを使用してスキーマファイルを生成することもできます。 ::

    $ Console/cake schema generate

上のコマンドで schema.php ファイルが ``app/Config/Schema`` ディレクトリに生成されるはずです。

.. note::

    スキーマシェルはモデルが定義されたテーブルのみを対象として処理します。
    強制的に全てのテーブルを対象にするためには、 ``-f`` オプションを加える必要があります。

前もって作成した schema.php からデータベースを再構築するためには、次のコマンドを実行してください。 ::

    $ Console/cake schema create

schema.php の中身に沿ってテーブルが再構成されるはずです。

スキーマファイルは SQL ダンプファイルの作成に使用することもできます。
``CREATE TABLE`` 文を含む SQL ファイルを生成するには次のコマンドを実行してください。 ::

    $ Console/cake schema dump --write filename.sql

ここで filename.sql には SQL ファイルとして出力したいファイル名を指定します。
filename.sql を省略すると、SQL のダンプはコンソールへ出力されますが、
ファイルへ出力されることはありません。

CakeSchema のコールバック
==========================

スキーマの生成後、アプリケーションを動作させるためテーブルにデータを挿入したいと
考えるかもしれません。データも CakeSchema のコールバックで保存させることができます。
全てのスキーマファイルは ``before($event = array())`` メソッドと
``after($event = array())`` メソッドが生成されます。

``$event`` パラメータは2つのキーを持つ配列です。１つはテーブルを削除するのか
作成するのかを示すパラメータで、もう１つはエラーに関するパラメータです。例を示します。 ::

    array('drop' => 'posts', 'errors' => null)
    array('create' => 'posts', 'errors' => null)

データを posts テーブルへ加える例は以下のようになります。 ::

    App::uses('Post', 'Model');
    public function after($event = array()) {
        if (isset($event['create'])) {
            switch ($event['create']) {
                case 'posts':
                    App::uses('ClassRegistry', 'Utility');
                    $post = ClassRegistry::init('Post');
                    $post->create();
                    $post->save(
                        array('Post' =>
                            array('title' => 'CakePHP Schema Files')
                        )
                    );
                    break;
            }
        }
    }

ここでコールバック ``before()`` および ``after()`` は、
スキーマからテーブルが作成されるか削除されるたびに実行されます。

データを2つ以上のテーブルへ挿入する場合は、各テーブルの作成後、
データベースのキャッシュを実際にデータベースへ反映させる必要があるでしょう。
before アクション内で ``$db->cacheSources = false`` を設定することにより、
キャッシュを無効にできます。 ::

    public $connection = 'default';

    public function before($event = array()) {
        $db = ConnectionManager::getDataSource($this->connection);
        $db->cacheSources = false;
        return true;
    }

コールバック中に正しいデータソースで初期化したモデルを使用したい場合、
デフォルトのデータソースを使わないようにします。 ::

    public function before($event = array()) {
        $articles = ClassRegistry::init('Articles', array(
            'ds' => $this->connection
        ));
        // Do things with articles.
    }

CakePHP スキーマを手書きする
============================

CakeSchema クラスは、全てのデータベーススキーマの基本クラスです。それぞれの
スキーマクラスはテーブルのセットを生成することができます。
``lib/Cake/Console/Command`` ディレクトリの中のスキーマシェルコンソールクラス
``SchemaShell`` は、コマンドラインを解釈し、基本スキーマクラスは、データベースからの
読み込みやデータベーステーブルの生成ができます。

CakeSchema は、プラグインへのスキーマファイルを配置・読み込み・書き込みができます。
SchemaShell もまた、その機能を持っています。

CakeSchema はまた、 ``tableParameters`` をサポートします。
テーブルパラメータは、照合順序、キャラセット、コメント文、エンジンタイプのような、
カラム以外のテーブル情報です。それぞれの Dbo は、サポートする tableParameters を実装します。

例
---

以下は acl クラスの例全部です。 ::

    /**
     * ACO - Access Control Object - Something that is wanted
     */
        public $acos = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'default' => null,
                'length' => 10,
                'key' => 'primary'
            ),
            'parent_id' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'model' => array('type' => 'string', 'null' => true),
            'foreign_key' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'alias' => array('type' => 'string', 'null' => true),
            'lft' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'rght' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
        );


カラム
-------

それぞれのカラムは、キーバリュー連想配列として表現されます。
フィールド名は、フィールドのキーです。値は、いくつかの属性を持つ別の配列です。

カラムの例 ::

    'id' => array(
        'type' => 'integer',
        'null' => false,
        'default' => null,
        'length' => 10,
        'key' => 'primary'
     ),

key
    ``primary`` キーは、主キーインデックスを定義します。

null
    フィールドが null を許可するかどうか。

default
    フィールドのデフォルト値。

limit
    フィールドの型の限界。

length
    フィールドの長さ。

type
    以下の型の一つ

    * integer
    * smallinteger
    * tinyinteger
    * biginteger
    * date
    * time
    * datetime
    * timestamp
    * boolean
    * float
    * string
    * text
    * binary

.. versionchanged:: 2.10.0
    smallinteger と tinyinteger 型は 2.10.0 で追加されました。

テーブルキー `indexes`
======================

キー名 `indexes` は、フィールド名の代わりにテーブル配列の中に置きます。

column
    これは単一のカラム名またはカラムの配列です。

    単一の場合 ::

        'indexes' => array(
            'PRIMARY' => array(
                'column' => 'id',
                'unique' => 1
            )
        )

    複数の場合 ::

        'indexes' => array(
            'AB_KEY' => array(
                'column' => array(
                    'a_id',
                    'b_id'
                ),
                'unique' => 1
            )
        )


unique
    ユニークインデックスなら 1、そうでなければ 0。


テーブルキー `tableParameters`
==============================

tableParameters は、 MySQL のみサポートします。

tableParameters を使って、いろいろな MySQL 特有の設定をセットすることができます。

-  ``engine`` は、テーブルで使用するストレージエンジンを制御します。
-  ``charset`` は、テーブルで使用するキャラクターセットを制御します。
-  ``encoding`` は、テーブルで使用する文字コードを制御します。

MySQL の dbo は、 tableParameters に加えて ``fieldParameters`` を実装します。
``fieldParameters`` は、 MySQL 特有の設定をカラムごとに制御することができます。


-  ``charset`` は、カラムで使用するキャラクターセットを設定します。
-  ``encoding`` は、カラムで使用する文字コードを設定します。

スキーマファイルの中でテーブルやフィールドのパラメータを使用する方法は、
下記の例をご覧ください。

**スキーマファイルの中で tableParameters を使う**

スキーマファイル中の他のキーと同じように ``tableParameters`` が使えます。
例えば ``indexes`` のように ::

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

いくつかのデータベース特有の設定をセットするために ``tableParameters`` を
使用しているテーブルの例です。もしデータベースが実装していないオプションや
機能を含むスキーマファイルを使用した時、オプションは無視されます。

CakePHP のスキーマシェルを使ったマイグレーション
================================================

マイグレーションで、スキーマのバージョン管理ができるようになります。
その結果、新機能を開発したとき、データベースに依存することなく簡単に
変更内容を配布できるようになります。マイグレーションはバージョン管理された
スキーマファイルかスキーマのスナップショットのどちらかの形式で管理されます。
スキーマシェルを使ったスキーマファイルのバージョン管理はとても簡単です。
もし既に作成済みのスキーマファイルがあるのであれば、次のコマンドを実行してください。 ::

    $ Console/cake schema generate

実行すると、次の選択肢が表示されるはずです。 ::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

[s] (snapshot) を選択すると、変更分を反映した schema.php が生成されるでしょう。
もし schema.php があれば、schema\_2.php あるいは同様のファイルが生成されるはずです。
いつでも以下のコマンドでスキーマファイルへの保存ができます。 ::

    $ cake schema update -s 2

ここで 2 は更新元のスナップショット番号を示します。
スキーマシェルは、現状のデータベースと更新元スキーマファイルの差分を表した
``ALTER`` 文を実行してもよいかどうか確認を促してくるでしょう。

``--dry`` コマンドを付けることで、実際にファイルを更新することなく実行結果だけを
確認することもできます（dry-run）。

.. note::

    2.x のスキーマ生成は外部キー制約を処理しないことに注意してください。

ワークフローの例
================

スキーマの生成とコミット
------------------------

バージョン管理を適用しているプロジェクトでは、cake schema を以下のように使うことになるでしょう。

1. データベース内のテーブルを生成あるいは変更
2. cake schema を実行し、データベースの内容を全てエクスポート
3. 生成または更新された schema.php のコミット ::

    $ # 一度データベースを更新した後で
    $ Console/cake schema generate
    $ git commit -a

.. note::

    プロジェクトでバージョン管理システムを使用していない場合は、
    スキーマの管理はスナップショットを使用して行うことになるはずです。
    （スナップショットの作成は前のセクションを参照してください）

最新の変更を取り入れるには
--------------------------

（テーブルが見つからないというエラーメッセージが表示された場合など）
リポジトリの最新の変更を取り入れ、データベース構造の変更点を見つけるには
以下のようにします。

1. cake schema を実行し、データベースを更新してください ::

    $ git pull
    $ Console/cake schema create
    $ Console/cake schema update

いずれの操作でも dry-run が使用できます。

ロールバック
------------

現在のところ、cake schema はデータベースの更新の取り消しや復元が必要な操作をサポートしていません。

より具体的には、一度生成したテーブルを自動的に削除することができないようになっています。

対照的に ``update`` を使用した場合は、スキーマファイルとの差分からフィールドが削除されます。 ::

    $ git revert HEAD
    $ Console/cake schema update

上のコマンドを実行すると、以下の選択肢が表示されるはずです。 ::

    The following statements will run.
    ALTER TABLE `roles`
    DROP `position`;
    Are you sure you want to alter the tables? (y/n)
    [n] >

.. meta::
    :title lang=ja: Schema management and migrations
    :keywords lang=ja: schema files,schema management,schema objects,database schema,table statements,database changes,migrations,versioning,snapshots,sql,snapshot,shell,config,functionality,choices,models,php files,php file,directory,running
