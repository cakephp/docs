..
    Database Access & ORM

データベースアクセス & ORM
#####################

..
    In CakePHP working with data through the database is done with two primary object
    types. The first are **repositories** or **table objects**. These objects
    provide access to collections of data. They allow you to save new records,
    modify/delete existing ones, define relations, and perform bulk operations. The
    second type of objects are **entities**. Entities represent individual records
    and allow you to define row/record level behavior & functionality.

CakePHPでは、2種類の主要なオブジェクトを使ってデータベースのデータを操作します。
1種類目は **リポジトリ** や **テーブルオブジェクト** です。これらのオブジェクトを利用して、データのコレクションへアクセスします。
これらを利用することで、新しいレコードを保存したり、既存データの編集/削除、リレーションの定義、そして一括処理ができます。
2種類目は **エンティティ** です。エンティティは、個々のレコードを意味し、行/レコードレベルの振る舞いや機能の定義を可能にします。

..
    These two classes are usually responsible for managing almost everything
    that happens regarding your data, its validity, interactions and evolution
    of the information workflow in your domain of work.

これら2つのクラスは、原則、あなたのデータ、正当性、相互作用や展開に関して発生するほぼすべてのことを管理する役割を担います。

..
    CakePHP's built-in ORM specializes in relational databases, but can be extended
    to support alternative datasources.

CakePHPの組み込みORMはリレーショナルデータベースに特化されましたが、
別のデータソースを選択するように拡張することも可能です。

..
    The CakePHP ORM borrows ideas and concepts from both ActiveRecord and Datamapper
    patterns. It aims to create a hybrid implementation that combines aspects of
    both patterns to create a fast, simple to use ORM.

CakePHPのORMはアクティブレコードやデータマッパーパターンのアイデアやコンセプトを拝借しています。
その目的は、早く作成し、シンプルにORMを利用するという2つの利点を混成させるためです。

..
    Before we get started exploring the ORM, make sure you :ref:`configure your
    database connections <database-configuration>`.

ORMの調査を始める前に :ref:`configure your database connections <database-configuration>` をご確認ください。

..
    If you are familiar with previous versions of CakePHP, you should read the
    :doc:`/appendices/orm-migration` for important differences between CakePHP 3.0
    and older versions of CakePHP.

.. note::

    もし過去のバージョンのCakePHPに慣れ親しんでいる場合は、 :doc:`/appendices/orm-migration` に記述されている
    CakePHP 3.0と過去のバージョンとの違いを読むべきでしょう。

..
    Quick Example

クイック例
=============

..
    To get started you don't have to write any code. If you've followed the CakePHP
    conventions for your database tables you can just start using the ORM. For
    example if we wanted to load some data from our ``articles`` table we could do::

始めるにあたり、何もコードを書く必要はありません。
もしデータベースのテーブルがCakePHPの規約に準拠している場合、すぐにORMの利用を開始できます。
例えば ``articles`` からいくつかデータをロードしたい場合、このように記述できます。

::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    foreach ($query as $row) {
        echo $row->title;
    }

..
    Note that we didn't have to create any code or wire any configuration up.
    The conventions in CakePHP allow us to skip some boilerplate code and allow the
    framework to insert base classes when your application has not created
    a concrete class. If we wanted to customize our ArticlesTable class adding some
    associations or defining some additional methods we would add the following to
    **src/Model/Table/ArticlesTable.php** after the ``<?php`` opening tag::

ここで留意すべき点は、何もコードを作ったり設定を書いたりする必要がない点です。
CakePHPの規約により、お決まりのコード記述をスキップし、
具象クラスを作っていない状態でベースクラスをフレームワークに登録することができます。
もし ArticlesTable に幾つかのアソシエーションを加えたりメソッドを定義したい場合、
下記を **src/Model/Table/ArticlesTable.php** 内、 ``<?php`` の開始タグの後に追加します。
::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

..
    Table classes use the CamelCased version of the table name with the ``Table``
    suffix as the class name. Once your class has been created you get a reference
    to it using the :php:class:`~Cake\\ORM\\TableRegistry` as before::

テーブルクラスは、キャメルケースのテーブル名に接尾語 ``Table`` を加えます。
一度クラスを作成したら、 :php:class:`~Cake\\ORM\\TableRegistry` を利用して参照できます。

::

    use Cake\ORM\TableRegistry;
    // Now $articles is an instance of our ArticlesTable class.
    $articles = TableRegistry::get('Articles');

..
    Now that we have a concrete table class, we'll probably want to use a concrete
    entity class. Entity classes let you define accessor and mutator methods, define
    custom logic for individual records and much more. We'll start off by adding the
    following to **src/Model/Entity/Article.php** after the ``<?php`` opening tag::

具象テーブルクラスがあると、具象化エンティティクラスが欲しくなります。
エンティティクラスはアクセサーとミューテーターメソッドを定義でき、
個別や複数レコードにカスタムロジックを定義できます。
下記を **src/Model/Entity/Article.php** 内、 ``<?php`` の開始タグの後に追加します。

::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

    }

..
    Entities use the singular CamelCase version of the table name as their class
    name by default. Now that we have created our entity class, when we
    load entities from the database we'll get instances of our new Article class

エンティティはデフォルトで単数形キャメルケースのテーブル名を利用します。
前の手順でエンティティクラスはすでに作ったので、データベースからエンティティをロードした時に、
新しい Article クラスのインスタンスが生成されます。

::

    use Cake\ORM\TableRegistry;

    // Now an instance of ArticlesTable.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
        // Each row is now an instance of our Article class.
        echo $row->title;
    }

..
    CakePHP uses naming conventions to link the Table and Entity class together. If
    you need to customize which entity a table uses you can use the
    ``entityClass()`` method to set a specific classname.

CakePHP は命名規則でテーブルクラスとエンティティクラスを関連づけます。
もしテーブルにどのエンティティを利用するかカスタマイズする必要があれば、
``entityClass()`` のメソッドを特定のクラス名にセットします。

..
    See the chapters on :doc:`/orm/table-objects` and :doc:`/orm/entities` for more
    information on how to use table objects and entities in your application.

:doc:`/orm/table-objects` と :doc:`/orm/entities` の章に、
テーブルオブジェクトとエンティティの使い方が詳しく記述されています。

..
    More Information

詳細
================

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/associations
    orm/behaviors
    orm/schema-system
    console-and-shells/orm-cache
