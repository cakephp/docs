スキーマの管理と移植
################################

スキーマシェルはスキーマオブジェクト、SQLダンプを作成したり、スナップショットを作成、保存する機能を提供します。

スキーマファイルの作成と使用方法
=================================

作成したスキーマファイルを使うと、データベースに依存することなく単に別の環境へ移植できます。また、既存のデータベースを使用してスキーマファイルを生成することもできます。 ::

    $ Console/cake schema generate

上のコマンドで schema.php ファイルが ``app/Config/Schema`` ディレクトリに生成されるはずです。

.. note::

    スキーマシェルはモデルが定義されたテーブルのみを対象として処理します。
    強制的に全てのテーブルを対象にするためには、 ``-f`` オプションを加える必要があります。

前もって作成した schema.php からデータベースを再構築するためには、次のコマンドを実行してください。 ::

    $ Console/cake schema create

schema.php の中身に沿ってテーブルが再構成されるはずです。

スキーマファイルはSQLダンプファイルの作成に使用することもできます。 ``CREATE TABLE`` 文を含むSQLファイルを生成するには次のコマンドを実行してください。 ::

    $ Console/cake schema dump --write filename.sql

ここで filename.sql にはSQLファイルとして出力したいファイル名を指定します。filename.sql を省略すると、SQLのダンプはコンソールへ出力されますが、ファイルへ出力されることはありません。

Cakeスキーマのコールバック
============================

スキーマの生成後、アプリケーションを動作させるためテーブルにデータを挿入したいと考えるかもしれません。データもCakeスキーマで保存させることができます。
それぞれのスキーマファイルは ``before($event = array())`` メソッドおよび ``after($event = array())`` メソッドから生成されます。

``$event`` パラメータは2つのキーを持つArrayです。１つはテーブルを削除するのか生成するのかを示すパラメータで、もう１つはエラーに関するパラメータです。例を示します。 ::

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

ここでコールバック関数  ``before()`` および ``after()`` は、スキーマからテーブルが生成されるか削除されるたびに実行されます。

データを2つ以上のテーブルへ挿入する場合は、各テーブルの生成後、データベースのキャッシュを実際にデータベースへ反映させる必要があるでしょう。
beforeアクション内で ``$db->cacheSources = false`` を設定することにより、キャッシュを無効にできます。 ::

    public $connection = 'default';

    public function before($event = array()) {
        $db = ConnectionManager::getDataSource($this->connection);
        $db->cacheSources = false;
        return true;
    }

CakePHPのスキーマシェルを使った移植
====================================

データベースを移植すると、スキーマのバージョン管理ができるようになります。
その結果、新機能を開発したとき、データベースに依存することなく簡単に変更内容を配布できるようになります。
変更箇所はバージョン管理されたスキーマファイルかスキーマのスナップショットのどちらかの形式で管理されます。スキーマシェルを使ったスキーマファイルのバージョン管理はとても簡単です。
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
スキーマシェルは、現状のデータベースと更新元スキーマファイルの差分を表した ``ALTER`` 文を実行してもよいかどうか確認を促してくるでしょう。

``--dry`` コマンドを付けることで、実際にファイルを更新することなく実行結果だけを確認することもできます（dry-run）。

ワークフローの例
=================

スキーマの生成とコミット
------------------------

バージョン管理を適用しているプロジェクトでは、Cakeスキーマを以下のように使うことになるでしょう。

1. データベース内のテーブルを生成あるいは変更
2. Cakeスキーマを実行し、データベースの内容を全てエクスポート
3. 生成または更新された schema.php のコミット ::

    $ # 一度データベースを更新した後で
    $ Console/cake schema generate
    $ git commit -a

.. note::

    プロジェクトでバージョン管理システムを使用していない場合は、スキーマの管理はスナップショットを使用して行うことになるはずです。
    （スナップショットの作成は前のセクションを参照してください）

最新の変更を取り入れるには
--------------------------

（テーブルが見つからないというエラーメッセージが表示された場合など）リポジトリの最新の変更を取り入れ、データベース構造の変更点を見つけるには以下のようにします。

1. Cakeスキーマを実行し、データベースを更新してください ::

    $ git pull
    $ Console/cake schema create
    $ Console/cake schema update

いずれの操作でも dry-run が使用できます。

ロールバック
------------

現在のところ、Cakeスキーマはデータベースの更新の取り消しや復元が必要な操作をサポートしていません。

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
    :title lang=en: Schema management and migrations
