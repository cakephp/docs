Migrations
##########

マイグレーションは、バージョン管理システムを使用して追跡することができる PHP ファイルを
記述することによって、あなたのデータベースのスキーマ変更を行うための、コアチームによって
サポートされている別のプラグインです。

それはあなたが時間をかけてあなたのデータベーステーブルを進化させることができます。
スキーマ変更の SQL を書く代わりに、このプラグインでは、直観的にデータベースの変更を
実現するための手段を使用することができます。

このプラグインは、データベースマイグレーションライブラリの
`Phinx <https://phinx.org/>`_ のラッパーです。

インストール
=============

初期状態で Migrations は、デフォルトのアプリケーションの雛形と一緒にインストールされます。
もしあなたがそれを削除して再インストールしたい場合は、（composer.json ファイルが
配置されている）アプリケーションルートディレクトリから次のコマンドを実行します。 ::

    $ php composer.phar require cakephp/migrations "@stable"

    // また、composer がグローバルにインストールされていた場合は、

    $ composer require cakephp/migrations "@stable"

このプラグインを使用するためには、あなたは、アプリケーションの **config/bootstrap.php**
ファイルでロードする必要があります。あなたの **config/bootstrap.php** からプラグインを
ロード・アンロードするために :ref:`CakePHP の Plugin シェル <plugin-shell>`
が利用できます。 ::

    $ bin/cake plugin load Migrations

もしくは、あなたの **config/bootstrap.php** ファイルを編集し、次の行を追加することで
ロードすることができます。 ::

    Plugin::load('Migrations');

また、 :ref:`データベース設定 <database-configuration>` の項で説明したように、
あなたの **config/app.php** ファイル内のデフォルトのデータベース構成を設定する必要が
あります。

概要
========

マイグレーションは、基本的にはデータベースの新しいバージョンを１つの PHP ファイルで表します。
マイグレーションファイルはテーブルを作成し、カラムの追加や削除、インデックスの作成や
データの作成さえ可能です。

ここにマイグレーションの例があります。 ::


    <?php
    use Migrations\AbstractMigration;

    class CreateProducts extends AbstractMigration
    {
        /**
         * Change Method.
         *
         * More information on this method is available here:
         * http://docs.phinx.org/en/latest/migrations.html#the-change-method
         * @return void
         */
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('description', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

マイグレーションは、デーテベースに ``products`` という名前のテーブルを追加します。
以下のカラムが定義します。

- ``id`` カラムの型は ``integer``
- ``name`` カラムの型は ``string``
- ``description`` カラムの型は ``text``
- ``created`` カラムの型は ``datetime``

.. tip::

    主キーのカラム名 ``id`` は、 **暗黙のうちに** 追加されます。

.. note::

    このファイルは変更を **適用後** にデータベースがどのようになるかを記述していることに
    注意してください。この時点でデータベースに ``products`` テーブルは存在せず、
    ``products`` テーブルを作って項目を追加することができるのと同様に、マイグレーションを
    ``rollback`` すればテーブルが消えてしまいます。

マイグレーションファイルを **config/Migrations** フォルダに作成したら、下記の
``migrations`` コマンドを実行することでデータベースにテーブルを作成することがでます。 ::

    bin/cake migrations migrate

以下の ``migrations`` コマンドは、 ``rollback`` を実行するとあなたのデータベースから
デーブルが削除します。 ::

    bin/cake migrations rollback

マイグレーションファイルの作成
==============================

マイグレーションファイルは、あなたのアプリケーションの **config/Migration**
ディレクトリに配置します。マイグレーションファイルの名前には、先頭に
**YYYYMMDDHHMMSS_my_new_migration.php** というように作成した日付を付けます。 ::

    -rw-rw-r-- 1 user user  914 Jan 21 10:38 20160121163850_CreateProducts.php

マイグレーションファイルを作成する最も簡単な方法は :doc:`/bake/usage` CLI
コマンドを使用することです。以下の ``Back`` コマンドは、 ``products`` テーブルを追加する
ためのマイグレーションファイルを作成します。 ::

    $ bin/cake bake migration CreateProducts name:string description:text created modified

    Welcome to CakePHP v3.1.7 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/Work/php/cakeblog/src/
    PHP : 5.5.28-1+deb.sury.org~precise+1
    ---------------------------------------------------------------

    Creating file /home/user/Work/php/cakeblog/config/Migrations/20160121163249_CreateProducts.php
    Wrote `/home/user/Work/php/cakeblog/config/Migrations/20160121163249_CreateProducts.php`

マイグレーションの名前に ``アンダースコア_記法`` を使用できます。例: create_products::

    $ bin/cake bake migration create_products name:string description:text created modified

    Welcome to CakePHP v3.1.17 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/Work/php/cakeblog/src/
    ---------------------------------------------------------------

    Creating file /home/user/Work/php/cakeblog/config/Migrations/20160121164955_CreateProducts.php
    Wrote `/home/user/Work/php/cakeblog/config/Migrations/20160121164955_CreateProducts.php`

.. versionadded:: cakephp/migrations 1.5.2

    マイグレーションファイル名のキャメルケースへの変換は `migrations プラグイン
    <https://github.com/cakephp/migrations/>`_ の v1.5.2 に含まれます。
    このプラグインのバージョンは、 CakePHP 3.1 以上のリリースで利用できます。
    このプラグインのバージョン以前では、マイグレーション名はアンダースコア形式です。
    例: 20160121164955_create_products.php

上記のコマンドラインは、よく似たマイグレーションファイルを生成します。 ::

    <?php
    use Migrations\AbstractMigration;

    class CreateProducts extends AbstractMigration
    {
        /**
         * Change Method.
         *
         * More information on this method is available here:
         * http://docs.phinx.org/en/latest/migrations.html#the-change-method
         * @return void
         */
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('description', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

もしコマンドラインのマイグレーション名が "AddXXXToYYY" や "RemoveXXXFromYYY" といった
書式で、その後にカラム名と型が続けば、カラムの追加・削除を行うコードを含んだ
マイグレーションファイルが生成されます。 ::

    bin/cake bake migration AddPriceToProducts price:decimal

コマンドラインを実行すると下記のようなファイルが生成されます。 ::

    <?php

    use Migrations\AbstractMigration;

    class AddPriceToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('price', 'decimal')
                  ->update();
        }
    }

.. versionadded:: cakephp/migrations 1.4

もし、フィールド長を指定する必要がある場合、フィールドタイプにカギ括弧の中で指定できます。例::

    bin/cake bake migration AddFullDescriptionToProducts full_description:string[60]

上記のコマンドラインを実行すると生成されます。 ::

    <?php

    use Migrations\AbstractMigration;

    class AddFullDescriptionToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('full_description', 'string', [
                    'default' => null,
                    'limit' => 60,
                    'null' => false,
                 ])
                  ->update();
        }
    }
        
インデックスにカラムを追加することも可能です。 ::

    bin/cake bake migration AddNameIndexToProducts name:string:index

このようなファイルが生成されます。 ::

    <?php

    use Migrations\AbstractMigration;

    class AddNameIndexToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string')
                  ->addIndex(['name'])
                  ->update();
        }
    }

コマンドラインのフィールドを使用する場合には、下記のようなパターンに従っている事を
覚えておくと便利かもしれません。 ::

    field:fieldType:indexType:indexName

例えば、下記はメールアドレスのカラムを指定する方法です。

* ``email:string:unique``
* ``email:string:unique:EMAIL_INDEX``

フィールド名が ``created`` と ``modified`` なら、自動的に ``datetime`` 型が
設定されます。

同様にコマンドラインを使用して、カラム削除のマイグレーションファイルを生成することが
できます。 ::

     bin/cake bake migration RemovePriceFromProducts price

このようなファイルが生成されます。 ::

    <?php

    use Migrations\AbstractMigration;

    class RemovePriceFromProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->removeColumn('price');
        }
    }

マイグレーション名は下記のパターンに従うことができます。

* テーブル作成: (``/^(Create)(.*)/``) 指定したテーブルを作成します。
* テーブル削除: (``/^(Drop)(.*)/``) 指定したテーブルを削除します。フィールドの指定は無視されます。
* カラム追加: (``/^(Add).*(?:To)(.*)/``) 指定したテーブルにカラム追加します。
* カラム削除: (``/^(Remove).*(?:From)(.*)/``) 指定のテーブルのカラムを削除します。
* テーブル変更:  (``/^(Alter)(.*)/``) 指定したテーブルを変更します。 CreateTable と AddField の別名。

``Phinx`` で一般的に利用可能なフィールドの型は下記の通り:

* string
* text
* integer
* biginteger
* float
* decimal
* datetime
* timestamp
* time
* date
* binary
* boolean
* uuid

さらに、実行内容を完全に制御したいのであれば、空のマイグレーションファイルを
作る事ができます。 ::

    bin/cake migrations create MyCustomMigration

マイグレーションファイルに記述可能なメソッドの一覧については、オフィシャルの
`Phinx ドキュメント <http://docs.phinx.org/en/latest/migrations.html>`_
をご覧ください。

既存のデータベースからマイグレーションファイルを作成する
--------------------------------------------------------

もしあなたが既存のデータベースで、マイグレーションの使用を始めたい場合や、
あなたのアプリケーションのデータベースで初期状態のスキーマのバージョン管理を
行いたい場合、 ``migration_snapshot`` コマンドを実行します。 ::

    bin/cake bake migration_snapshot Initial

これはデータベース内のすべてのテーブルの create 文を含んだ **Initial** と呼ばれる
マイグレーションファイルを生成します。

主キーをカスタマイズする
--------------------------------

あなたがデータベースに新しいテーブルを作成する時、 ``id`` を主キーとして
自動生成したくない場合、 ``table()`` メソッドの第２引数を使うことができます。 ::

    <?php

    use Migrations\AbstractMigration;

    class CreateProductsTable extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products', ['id' => false, 'primary_key' => ['id']]);
            $table
                  ->addColumn('id', 'uuid')
                  ->addColumn('name', 'string')
                  ->addColumn('description', 'text')
                  ->create();
        }
    }

上記の例では、 ``CHAR(36)`` の ``id`` というカラムを主キーとして作成します。

.. note::

    独自の主キーをコマンドラインで指定した時、id フィールドの中の主キーとして注意してください。
    そうしなければ、id フィールドが重複してエラーになります。例::

        bin/cake bake migration CreateProducts id:uuid:primary name:string description:text created modified


さらに、Migrations 1.3 以降では 主キーに対処するための新しい方法が導入されました。
これを行うには、あなたのマイグレーションクラスは新しい ``Migrations\AbstractMigration``
クラスを継承する必要があります。
あなたは Migration クラスの ``autoId`` プロパティに ``false`` を設定することで、
自動的な ``id`` カラムの生成をオフにすることができます。
あなたは手動で主キーカラムを作成し、テーブル宣言に追加する必要があります。 ::

    <?php

    use Migrations\AbstractMigration;

    class CreateProductsTable extends AbstractMigration
    {

        public $autoId = false;

        public function up()
        {
            $table = $this->table('products');
            $table
                ->addColumn('id', 'integer', [
                    'autoIncrement' => true,
                    'limit' => 11
                ])
                ->addPrimaryKey('id')
                ->addColumn('name', 'string')
                ->addColumn('description', 'text')
                ->create();
        }
    }

主キーを扱うこれまでの方法と比較すると、この方法は、unsigned や not や limit や comment など
さらに多くの主キーの定義を操作することができるようになっています。

Bake で生成されたマイグレーションファイルとスナップショットは、この新しい方法を
必要に応じて使用します。

.. warning::

    主キーの操作ができるのは、テーブル作成時のみです。これはプラグインがサポートしている
    いくつかのデータベースサーバの制限によるものです。

照合順序
----------

もしデータベースのデフォルトとは別の照合順序を持つテーブルを作成する必要がある場合は、
``table()`` メソッドのオプションとして定義することができます。::

    <?php

    use Migrations\AbstractMigration;

    class CreateCategoriesTable extends AbstractMigration
    {
        public function change()
        {
            $table = $this
                ->table('categories', [
                    'collation' => 'latin1_german1_ci'
                ])
                ->addColumn('title', 'string', [
                    'default' => null,
                    'limit' => 255,
                    'null' => false,
                ])
                ->create();
        }
    }

ですが、これはテーブル作成時にしかできず、既存のテーブルに対してカラムを追加する時に
テーブルやデータベースと異なる照合順序を指定する方法がないことに注意してください。
ただ ``MySQL`` と ``SqlServer`` だけはこの設定キーをサポートしています。

マイグレーションを適用する
==========================

マイグレーションファイルを生成したり記述したら、下記のコマンドを実行して
変更をデータベースに適用しましょう。 ::

    bin/cake migrations migrate

特定のバージョンに移行するためには、 --target パラメータ（省略形は -t ）を使用します。 ::

    bin/cake migrations migrate -t 20150103081132

これはマイグレーションファイル名の前に付加されるタイムスタンプに対応しています。

逆マイグレーション
====================

ロールバックコマンドは、このプラグインを実行する前の状態に戻すために使われます。
これは ``migrate`` コマンドの逆向きの動作をします。

あなたは ``rollback`` コマンドを使って以前のマイグレーション状態に戻すことができます。 ::

    bin/cake migrations rollback

また、特定のバージョンに戻すために、マイグレーションバージョン番号を引き渡すこともできます。 ::

    bin/cake migrations rollback -t 20150103081132

マイグレーション ステータス
============================

Status コマンドは、現在の状況とすべてのマイグレーションのリストを出力します。
あなたはマイグレーションが実行されたかを判断するために、このコマンドを使用することができます。 ::

    bin/cake migrations status

マイグレーション済みとしてマーキングする
=========================================

.. versionadded:: cakephp/migrations 1.4.0

時には、実際にはマイグレーションを実行せずにマーキングだけすることが便利な事もあります。
これを実行するためには、 ``mark_migrated`` コマンドを使用します。
コマンドは、他のコマンドとしてシームレスに動作します。

このコマンドを使用して、すべてのマイグレーションをマイグレーション済みとして
マークすることができます。 ::

    bin/cake migrations mark_migrated

また、 ``--target`` オプションを使用して、指定したバージョンに対して、
すべてマイグレーション済みとしてマークすることができます。 ::

    bin/cake migrations mark_migrated --target=20151016204000

もし、指定したマイグレーションを処理中にマーク済みにしたくない場合、
``--exclude`` フラグをつけて使用することができます。 ::

    bin/cake migrations mark_migrated --target=20151016204000 --exclude

最後に、指定したマイグレーションだけをマイグレーション済みとしてマークしたい場合、
``--only`` フラグを使用できます。 ::

    bin/cake migrations mark_migrated --target=20151016204000 --only

.. note::

    あなたが ``cake bake migration_snapshot`` コマンドでスナップショットを作成したとき、
    自動的にマイグレーション済みとしてマーキングされてマイグレーションが作成されることに
    注意してください。

.. deprecated:: 1.4.0

    以下のコマンドの使用方法は非推奨になりました。もし、あなたが 1.4.0 より前のバージョンの
    プラグインの場合のみに使用してください。

このコマンドは、引数としてマイグレーションバージョン番号を想定しています。 ::

    bin/cake migrations mark_migrated 20150420082532

もし、すべてのマイグレーションをマイグレーション済みとしてマークしたい場合、
特別な値 ``all`` を使用できます。もし使用した場合、すべての見つかったマイグレーションを
マイグレーション済みとしてマークします。 ::

    bin/cake migrations mark_migrated all

プラグイン内のマイグレーションファイルを使う
=============================================

プラグインはマイグレーションファイルも提供することができます。
これはプラグインの移植性とインストールの容易さを高め、配布しやすくなるように意図されています。
Migrations プラグインの全てのコマンドは、プラグイン関連のマイグレーションを行うための
``--plugin`` か ``-p`` オプションをサポートしています。 ::

    bin/cake migrations status -p PluginName

    bin/cake migrations migrate -p PluginName


非シェルの環境でマイグレーションを実行する
=============================================

.. versionadded:: cakephp/migrations 1.2.0

migrations プラグインのバージョン 1.2 から、非シェル環境でも app から直接
``Migrations`` クラスを使ってマイグレーションを実行できるようになりました。
これは CMS のプラグインインストーラを作る時などに便利です。
``Migrations`` クラスを使用すると、マイグレーションシェルから下記のコマンドを
実行することができます。:

* migrate
* rollback
* markMigrated
* status

それぞれのコマンドは ``Migrations`` クラスのメソッドとして実装されています。

使い方は下記の通りです。 ::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // 全てのマイグレーションバージョンとそのステータスの配列を戻します。
    $status = $migrations->status();

    // マイグレーションに成功したら true を返し、エラーが発生したら exception を throw します。
    $migrate = $migrations->migrate();

    // ロールバックに成功したら true を返し、エラーが発生したら exception を throw します。
    $rollback = $migrations->rollback();

    // マーキングに成功したら true を返し、エラーが発生したら exception を throw します。
    $markMigrated = $migrations->markMigrated(20150804222900);

メソッドはコマンドラインのオプションと同じパラメータ配列を受け取ります。 ::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // 全てのマイグレーションバージョンとそのステータスの配列を返す
    $status = $migrations->status(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

あなたはシェルコマンドのように任意のオプションを引き渡すことができます。
唯一の例外は ``markMigrated`` コマンドで、第１引数にはマイグレーション済みとして
マーキングしたいマイグレーションバージョン番号を渡し、第２引数にパラメータの配列を
渡します。

必要に応じて、クラスのコンストラクタでこれらのパラメータを引き渡すことができます。
それはデフォルトとして使用され、それぞれのメソッド呼び出しの時に引き渡されることを
防止します。 ::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // 以下のすべての呼び出しは、マイグレーションクラスのコンストラクタに渡されたパラメータを使用して行われます
    $status = $migrations->status();
    $migrate = $migrations->migrate();

個別の呼び出しでデフォルトのパラメータを上書きしたい場合は、メソッド呼び出し時に引き渡します。 ::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // この呼び出しでは "custom" コネクションを使用します。
    $status = $migrations->status();
    // こちらでは "default" コネクションを使用します。
    $migrate = $migrations->migrate(['connection' => 'default']);
