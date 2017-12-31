スキーマシステム
################

.. php:namespace:: Cake\Database\Schema

CakePHP は、SQL データストア内のテーブルのスキーマ情報を反映し、
生成することができるスキーマシステムを備えています。
スキーマシステムは、CakePHP がサポートする全ての
SQL プラットフォーム用のスキーマを生成・反映することができます。

スキーマシステムの主要部分は ``Cake\Database\Schema\Collection`` と
``Cake\Database\Schema\TableSchema`` です。これらのクラスを使用すると、
それぞれデータベース全体と個々の Table オブジェクトの機能にアクセスできます。

スキーマシステムの主な用途は、:ref:`test-fixtures` のためのものです。
しかしながら、必要な場合は、アプリケーションでそれを使用することができます。

Schema\\TableSchema オブジェクト
================================

.. php:class:: TableSchema

スキーマ・サブシステムは、データベース内のテーブルに関するデータを保持するための簡単な
Table オブジェクトを提供します。このオブジェクトは、スキーマのリフレクション機能によって返されます。 ::

    use Cake\Database\Schema\TableSchema;

    // 一度にテーブルの１カラムを作成
    $schema = new TableSchema('posts');
    $schema->addColumn('id', [
      'type' => 'integer',
      'length' => 11,
      'null' => false,
      'default' => null,
    ])->addColumn('title', [
      'type' => 'string',
      'length' => 255,
      // 固定長 (char フィールド) の作成
      'fixed' => true
    ])->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);

    // Schema\TableSchema は、配列データを使用して作成できます
    $schema = new TableSchema('posts', $columns);

``Schema\TableSchema`` オブジェクトを使用すると、テーブルのスキーマに関する情報を構築することを可能にします。
それは、テーブルを記述するために使用されるデータを正規化し、検証するのに役立ちます。
たとえば、次の2つの形式は等価です。 ::

    $schema->addColumn('title', 'string');
    // そして
    $schema->addColumn('title', [
      'type' => 'string'
    ]);

等価ではありますが、２番目の形式は、より詳細かつ制御することができます。
これは、2.x の Schema ファイルとフィクスチャースキーマで使用可能な既存の機能をエミュレートします。

カラムデータへのアクセス
------------------------

カラムは、コンストラクターの引数として、または `addColumn()` を経由して追加されます。
情報が追加された一つのフィールドは、 `column()` または `columns()` を使用して取得できます。 ::

    // カラムに関するデータの配列を取得
    $c = $schema->column('title');

    // 全てのカラムの一覧を取得
    $cols = $schema->columns();

インデックスと制約
------------------

インデックスは ``addIndex()`` メソッドを使用して追加されます。
制約は ``addConstraint()`` を使用して追加されます。
無効な状態になるため、存在しない列に対してはインデックスや制約を追加できません。
インデックスは制約とは異なり、メソッド間で型を混合しようとすると例外が発生します。
両方のメソッドの例です。 ::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
      ->addColumn('author_id', 'integer')
      ->addColumn('title', 'string')
      ->addColumn('slug', 'string');

    // 主キーの追加
    $schema->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);
    // ユニークキーの追加
    $schema->addConstraint('slug_idx', [
      'columns' => ['slug'],
      'type' => 'unique',
    ]);
    // インデックスの追加
    $schema->addIndex('slug_title', [
      'columns' => ['slug', 'title'],
      'type' => 'index'
    ]);
    // 外部キーの追加
    $schema->addConstraint('author_id_idx', [
      'columns' => ['author_id'],
      'type' => 'foreign',
      'references' => ['authors', 'id'],
      'update' => 'cascade',
      'delete' => 'cascade'
    ]);

単一の整数カラムに主キー制約を追加する場合、自動的にデータベースのプラットフォームに応じて
auto-increment/serial カラムに変換されます。 ::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id']
    ]);

上記の例では、 ``id`` カラムは、MySQL の次のような SQL を生成します。 ::

    CREATE TABLE `posts` (
        `id` INTEGER AUTO_INCREMENT,
        PRIMARY KEY (`id`)
    )

主キーに複数のカラムが含まれている場合、どのカラムも自動的には自動インクリメント値に変換されません。
代わりに、複合キーのどのカラムを自動インクリメントしたいのかをテーブルオブジェクトに伝える必要があります。 ::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', [
        'type' => 'integer',
        'autoIncrement' => true,
    ])
    ->addColumn('account_id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id', 'account_id']
    ]);

``autoIncrement`` オプションは、 ``integer`` と ``biginteger`` カラムで動作します。

インデックスと制約の読み込み
----------------------------

インデックスと制約は、アクセサーメソッドを使用して、テーブルオブジェクトから読み取ることができます。
``$schema`` が作成された TableSchema インスタンスであると仮定すると、以下を行うことができます。 ::

    // 制約の取得
    // 全ての制約の名前を返します。
    $constraints = $schema->constraints()

    // 単一の制約に関するデータを取得
    $constraint = $schema->constraint('author_id_idx')

    // インデックスの取得
    // 全てのインデックス名を返します。
    $indexes = $schema->indexes()

    // 単一のインデックスに関するデータを取得
    $index = $schema->index('author_id_idx')

テーブルオプションの追加
------------------------

一部のドライバー（主に MySQL）は、追加のテーブルのメタデータをサポートし、必要とします。
MySQL の場合には ``CHARSET``、 ``COLLATE`` と ``ENGINE`` プロパティーは、
MySQL でテーブルの構造を維持するために必要とされます。
テーブルオプションを追加するために、以下を使用することができます。 ::

    $schema->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

プラットフォームの方言は、関係するキーだけを処理し、残りは無視します。
すべてのオプションは、すべてのプラットフォームでサポートされるわけではありません。

Table を SQL に変換
-------------------

``createSql()`` や ``dropSql()`` を使用すると、
特定のテーブルを作成または削除するためのプラットフォーム固有の SQL を取得することができます。 ::

    $db = ConnectionManager::get('default');
    $schema = new TableSchema('posts', $fields, $indexes);

    // テーブルの作成
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // テーブルの削除
    $sql = $schema->dropSql($db);
    $db->execute($sql);

接続のドライバーを使用することにより、スキーマデータをプラットフォーム固有の SQL に変換することができます。
``createSql`` と ``dropSql`` の戻り値は、テーブルと必要なインデックスを作成するために必要な
SQL クエリーのリストです。いくつかのプラットフォームでは、コメントやインデックスのあるテーブルを
作成するために複数のステートメントが必要な場合があります。クエリーの配列は常に返されます。

スキーマコレクション
====================

.. php:class:: Collection

``Collection`` は、接続中に利用可能なさまざまなテーブルへのアクセスを提供します。
これを使用すると、テーブルのリストを取得したり、テーブルを :php:class:`TableSchema`
オブジェクトに反映させることができます。クラスの基本的な使い方は次のようになります。 ::

    $db = ConnectionManager::get('default');

    // スキーマコレクションの作成
    $collection = $db->schemaCollection();

    // テーブル名の取得
    $tables = $collection->listTables();

    // 単一テーブル (Schema\TableSchema インスタンス) の取得
    $tableSchema = $collection->describe('posts');

