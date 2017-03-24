Tree
####

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TreeBehavior

データベーステーブル内に階層データを格納することは、かなり一般的です。
そのようなデータの例としては、無制限のサブカテゴリを有するカテゴリ、
マルチレベルメニューシステムに関連するデータ、または企業内の部門などの
階層のリテラル表現があります。

リレーショナル・データベースは、通常、
このタイプのデータを格納および検索するのには適していませんが、
複数レベルの情報を扱うために効果的な方法がいくつかあります。

TreeBehavior は、オーバーヘッドをほとんどかけることなく照会できる階層型のデータ構造を
データベースに保持し、検索や表示の処理のためのツリーデータを再構築するのに役立ちます。

必要条件
========

このビヘイビアは、テーブル内の以下のカラムが必要です。

- ``parent_id`` (null も可能) 親の行の ID を保持するカラム
- ``lft`` (整数、符号付き) ツリー構造を維持するために使用
- ``rght`` (整数、符号付き) ツリー構造を維持するために使用

カスタマイズする必要がある場合は、これらのフィールドの名前を設定できます。
フィールドの意味とその使用方法の詳細については、 `MPTT ロジック
<http://www.sitepoint.com/hierarchical-data-database-2/>`_
に書いてある記事を参照してください。

.. warning::

    TreeBehavior は、現時点では複合主キーをサポートしていません。

クイックツアー
==============

階層データを格納したい Table に Tree ビヘイビアを追加して有効にします。 ::

    class CategoriesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree');
        }
    }

テーブルがすでにいくつかの行を保持している場合、一度追加すると
CakePHP は内部構造を構築することができます。 ::

    $categories = TableRegistry::get('Categories');
    $categories->recover();

テーブルから行を取得し、その行が持つ子孫の数を調べることで動作することを確認できます。 ::

    $node = $categories->get(1);
    echo $categories->childCount($node);

同様に、ノードの子孫のフラットなリストを取得することは簡単です。 ::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

代わりに、各ノードの子が階層内にネストされているスレッドリストが必要な場合は、
'threaded' ファインダを積み重ねられます。 ::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} は、直下の子が " . count($child->children) . " あります。";
    }

スレッド化された結果を取得するには通常、再帰関数が必要ですが、HTML を選択するなど、
リストを表示できるように各レベルの単一のフィールドを含む結果セットのみが必要な場合は、
'treeList' ファインダを使用する方が良いです。 ::

    $list = $categories->find('treeList');

    // CakePHP テンプレートファイルの中で
    echo $this->Form->control('categories', ['options' => $list]);

    // もしくは、CLI スクリプトなどでプレーンテキストで出力できます
    foreach ($list as $categoryName) {
        echo $categoryName . "\n";
    }

出力は次のようになります。 ::

    My Categories
    _Fun
    __Sport
    ___Surfing
    ___Skating
    _Trips
    __National
    __International

``treeList`` ファインダはいくつかのオプションを持ちます。

* ``keyPath``: 配列キーに使用するフィールドを取得するためのドット区切りパス、
  または指定された行からキーを返すためのクロージャ。
* ``valuePath``: 配列値に使用するフィールドを取得するドット区切りパス、
  または指定された行から値を返すクロージャ。
* ``spacer``: 各項目のツリーの深さを表すプレフィックスとして使用される文字列

使用できるすべてのオプションの例です。 ::

    $query = $categories->find('treeList', [
        'keyPath' => 'url',
        'valuePath' => 'id',
        'spacer' => ' '
    ]);

とても一般的な作業の1つは、特定のノードからツリーのルートまでのツリーパスを見つけることです。
例えば、メニュー構造を表すパンくずリストを追加するのに便利です。 ::

    $nodeId = 5;
    $crumbs = $categories->find('path', ['for' => $nodeId]);

    foreach ($crumbs as $crumb) {
        echo $crumb->name . ' > ';
    }

TreeBehavior で構築されたツリーは ``lft`` 以外のカラムでソートすることはできません。
ツリーの内部表現はこのソートに依存するからです。幸いなことに、自分の親を変更することなく、
同じレベルの内部ノードを並べ替えることができます。 ::

    $node = $categories->get(5);

    // 子どもをリストアップするときに1つ上の位置に表示されるようにノードを移動します。
    $categories->moveUp($node);

    // 同じレベルの中でリストの先頭にノードを移動します。
    $categories->moveUp($node, true);

    // 一番下にノードを移動します。
    $categories->moveDown($node, true);

設定
====

このビヘイビアによって使用されるデフォルトのカラム名が、スキーマと一致しない場合、
それらの別名を提供することができます。 ::

    public function initialize(array $config)
    {
        $this->addBehavior('Tree', [
            'parent' => 'ancestor_id', // parent_id の代わりに使用
            'left' => 'tree_left', // lft の代わりに使用
            'right' => 'tree_right' // rght の代わりに使用
        ]);
    }

ノードレベル (深さ)
===================

ツリーノードの深さを知ることは、例えばメニューを生成するときなど、
一定のレベルまでノードを検索したい時に役に立ちます。 ``level`` オプションを使うことで、
各ノードのレベルを保存するフィールドを指定することができます。 ::

    $this->addBehavior('Tree', [
        'level' => 'level', // デフォルトは null で、レベルは保存しません
    ]);

db フィールドを使用してレベルをキャッシュしたくない場合、ノードのレベルを取得するために
``TreeBehavior::getLevel()`` メソッドが使用できます。

スコープとマルチツリー
======================

時には、同じテーブルの中に複数のツリー構造を保持したい場合は、 'scope' 設定を使用して達成できます。
たとえば、locations テーブルでは、国ごとに1つのツリーを作成することができます。 ::

    class LocationsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Tree', [
                'scope' => ['country_name' => 'Brazil']
            ]);
        }

    }

前の例では、すべてのツリーの操作は、 ``country_name`` カラムに
'Brazil' がセットされている行のみに限定されます。
'config' 関数を使って、その場でスコープを変更することができます。 ::

    $this->behaviors()->Tree->config('scope', ['country_name' => 'France']);

必要に応じて、スコープとしてクロージャを渡すことで、スコープのより細かい制御ができます。 ::

    $this->behaviors()->Tree->config('scope', function ($query) {
        $country = $this->getConfigureContry(); // 作成した関数
        return $query->where(['country_name' => $country]);
    });

独自のソートフィールドでのリカバリ
==================================

.. versionadded:: 3.0.14

デフォルトでは、recover() は、主キーを使用して項目を並べ替えます。
これは数字の（自動インクリメント）カラムであればうまくいきますが、
UUID を使用すると奇妙な結果につながる可能性があります。

リカバリのための独自のソートが必要な場合は、設定で独自の order 句を設定できます。 ::

        $this->addBehavior('Tree', [
            'recoverOrder' => ['country_name' => 'DESC'],
        ]);

階層データの保存
================

Tree ビヘイビアを使用しているときは、通常、階層構造の内部表現を心配する必要はありません。
ツリーに配置されているノードの位置は、各エンティティの 'parent_id' カラムから推定されます。 ::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = 5;
    $categoriesTable->save($aCategory);

ツリー内にループ（そのノード自身を子ノードにする）を作成または保存しようとする場合、
存在しない親 ID を提供すると例外がスローされます。

'parent_id' カラムを null に設定すると、ツリー内のノードをルートにすることができます。 ::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = null;
    $categoriesTable->save($aCategory);

新しいルートノードの子供は保存されます。

ノードの削除
============

ノードとそのすべてのサブツリー（ツリーの任意の深さにある子孫）を削除することは簡単です。 ::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->delete($aCategory);

TreeBehavior は、内部のすべての削除操作を処理します。
また、1つのノードを削除し、ツリー内のすぐ上位の親ノードにすべての子を再割り当てすることもできます。 ::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->removeFromTree($aCategory);
    $categoriesTable->delete($aCategory);

すべての子ノードが保持され、新しい親が割り当てられます。

ノードの削除は、エンティティの lft と rght の値に基づいて行われます。
これは条件付き削除のためにノードのさまざまな子をループするときに注意することは重要です。 ::

    $descendants = $teams->find('children', ['for' => 1]);
    
    foreach ($descendants as $descendant) {
        $team = $teams->get($descendant->id); // 最新のエンティティオブジェクトを検索
        if ($team->expired) {
            $teams->delete($team); // 削除して、データベースに登録された lft と rght を並び替えます
        }
    }
    
TreeBehavior は、ノードが削除されたときに、テーブル内のレコードの lft と rght の値を並べ替えます。
したがって、(削除操作の前に保存された) ``$descendants`` 内のエンティティの lft と rght の値は
不正確になります。テーブルの不一致を防ぐために、エンティティは、
その場で読み込みおよび変更する必要があります。
