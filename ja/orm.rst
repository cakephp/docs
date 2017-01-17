データベースアクセス & ORM
###########################

CakePHP では、2種類の主要なオブジェクトを使ってデータベースのデータを操作します。
1種類目は **リポジトリ** や **テーブルオブジェクト** です。これらのオブジェクトを利用して、
データのコレクションへアクセスします。これらを利用することで、新しいレコードを保存したり、
既存データの編集/削除、リレーションの定義、そして一括処理ができます。
2種類目は **エンティティ** です。エンティティは、個々のレコードを意味し、
行/レコードレベルの振る舞いや機能の定義を可能にします。

これら2つのクラスは、原則、あなたのデータ、正当性、相互作用や展開に関して発生するほぼすべてのことを
管理する役割を担います。

CakePHP の組み込み ORM はリレーショナルデータベースに特化していますが、
別のデータソースを選択するように拡張することも可能です。

CakePHP の ORM はアクティブレコードやデータマッパーパターンのアイデアやコンセプトを拝借しています。
その目的は、早く作成し、シンプルに ORM を利用するという2つの利点を混成させるためです。

ORM の調査を始める前に :ref:`あなたのデータベース接続の設定 <database-configuration>`
をご確認ください。

.. note::

    もし過去のバージョンの CakePHP に慣れ親しんでいる場合は、 :doc:`/appendices/orm-migration`
    に記述されている CakePHP 3.0 と過去のバージョンとの違いを読むべきでしょう。

簡単な例
========

始めるにあたり、何もコードを書く必要はありません。もし、あなたのデータベーステーブルが :ref:`CakePHP
の規約 <model-and-database-conventions>` に準拠している場合、すぐに ORM の利用を開始できます。
例えば ``articles`` からいくつかデータをロードしたい場合、このように記述できます。 ::

    use Cake\ORM\TableRegistry;
    
    $articles = TableRegistry::get('Articles');
    
    $query = $articles->find();
    
    foreach ($query as $row) {
        echo $row->title;
    }

ここで留意すべき点は、何もコードを作ったり設定を書いたりする必要がない点です。
CakePHP の規約により、お決まりのコード記述をスキップし、具象クラスを作っていない状態で
ベースクラスをフレームワークに登録することができます。もし ArticlesTable に幾つかの
アソシエーションを加えたりメソッドを定義したい場合、下記を
**src/Model/Table/ArticlesTable.php** 内、 ``<?php`` の開始タグの後に追加します。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

テーブルクラスは、キャメルケースのテーブル名に接尾語 ``Table`` を加えます。
一度クラスを作成したら、 :php:class:`~Cake\\ORM\\TableRegistry` を利用して参照できます。 ::

    use Cake\ORM\TableRegistry;

    // $articles は、 ArticlesTable クラスのインスタンスです。
    $articles = TableRegistry::get('Articles');

具象テーブルクラスがあると、具象化エンティティクラスが欲しくなります。
エンティティクラスはアクセッサとミューテータメソッドを定義でき、
個別や複数レコードにカスタムロジックを定義できます。
下記を **src/Model/Entity/Article.php** 内、 ``<?php`` の開始タグの後に追加します。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

    }

エンティティはデフォルトで単数形キャメルケースのテーブル名を利用します。
前の手順でエンティティクラスはすでに作ったので、データベースからエンティティをロードした時に、
新しい Article クラスのインスタンスが生成されます。 ::

    use Cake\ORM\TableRegistry;

    // ArticlesTable のインスタンス取得
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
        // 各 row は、 Article クラスのインスタンスです。
        echo $row->title;
    }

CakePHP は命名規則でテーブルクラスとエンティティクラスを関連づけます。
もしテーブルにどのエンティティを利用するかカスタマイズする必要があれば、
``entityClass()`` のメソッドを特定のクラス名にセットします。

:doc:`/orm/table-objects` と :doc:`/orm/entities` の章に、
テーブルオブジェクトとエンティティの使い方が詳しく記述されています。

詳細
====

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
