ツリー
######

データベーステーブルに階層構造のデータを格納したいケースはごく一般的に存在します。例えば数に上限が無いサブカテゴリを持つカテゴリのデータ、複数のレベルを持つメニューシステムのデータ、
ACL
のロジックのアクセスコントロールオブジェクトを保存するために使われる文字通り階層構造のデータなどです。

小さいツリーのデータや、少ない階層の深さを持つデータの場合、 parent\_id
フィールドをデータベーステーブルに追加したり、アイテムの親が何であるかを追跡することは簡単です。しかしながら
CakePHP にバンドルされているビヘイビアの機能は非常にパワフルです。
`MPTT(Modified Preorder Tree Traversal)
ロジック <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_\ を扱うには複雑なテクニックを駆使する必要がありますが、このビヘイビアを使用すると、それにわずらわされることなく
MPTT ロジックの恩恵を受けることができます。

必要なもの
==========

ツリービヘイビアを使用するには、テーブルが次に挙げる3つのフィールドを持っている必要があります。フィールドは全て整数型です。

-  親 - デフォルトのフィールド名は「parent\_id」です。親オブジェクトの
   id を格納するためのものです。
-  左端 -
   デフォルトのフィールド名は「lft」です。現在のオブジェクトの左端の座標を入力します。
-  右端 -
   デフォルトのフィールド名は「rght」です。現在のオブジェクトの右端の座標を入力します。

もし MPTT
ロジックをよく知っているなら、なぜ親フィールドが存在するのか疑問に思うでしょう。これは、親への直接的なリンクがデータベースに存在すると、いくつかのタスクがとても簡単になるためです(例えば、ある要素の直接の子を見つける時など)。

基本的な使い方
==============

ツリービヘイビアで出来ることはたくさんあります。しかし、簡単な例からはじめてみましょう。次のデータベーステーブルを作成し、データを投入してください。

::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'カテゴリ', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, '楽しみ', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'スポーツ', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'サーフィン', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'エクストリーム編み物', 3, 6, 7);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(6, '友達', 2, 9, 14);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(7, 'ジェラルド', 6, 10, 11);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(8, 'グウェンドリン', 6, 12, 13);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(9, '仕事', 1, 16, 29);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(10, '報告', 9, 17, 22);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(11, '通年', 10, 18, 19);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(12, '状態', 10, 20, 21);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(13, '出張', 9, 23, 28);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(14, '国内', 13, 24, 25);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(15, '国外', 13, 26, 27);

正しくセットアップされたかをチェックするには、テスト用のメソッドを作成して、カテゴリツリーのコンテンツの出力がどのようになるかを確認します。簡単なコントローラを使います。

::

    <?php
    class CategoriesController extends AppController {

            var $name = 'Categories';
            
            function index() {
                    $this->data = $this->Category->generatetreelist(null, null, null, '&nbsp;&nbsp;&nbsp;');
                    debug ($this->data); die;       
            }
    }
    ?>

シンプルなモデルの定義例です。

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

これで /categories
にアクセスすると、カテゴリのツリーのデータがどのように見えるかチェックできます。
次のようになるはずです。

-  My カテゴリ

   -  楽しみ

      -  スポーツ

         -  サーフィン
         -  エクストリーム編み物

      -  友人

         -  ジェラルド
         -  グウェンドリン

   -  仕事

      -  報告

         -  年次
         -  状態

      -  出張

         -  国内
         -  国外

データを追加する
----------------

前の章では、既存のデータを用い ``generatetreelist``
メソッドを使うことで階層構造がどのように見えるかを確認しました。しかしながらたとえ階層構造を持ったデータであっても、通常は他のモデルとまったく同じ方法でデータを追加します。例は次の通りです。

::

    // コントローラのコードの一部
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'スケート';
    $this->Category->save($data);

ツリービヘイビアを用いる場合、親 ID (*parent\_id*)
をセットする以外のことは何も行う必要がありません。残りのことはツリービヘイビアが注意深く行ってくれます。もし
parent\_id
をセットしない場合は、ツリービヘイビアはツリーに、新たなトップレベルのエントリーを作成します。

::

    // コントローラのコードの一部
    $data = array();
    $data['Category']['name'] =  '別の人のカテゴリ';
    $this->Category->save($data);

上述した短いコードを実行すると、ツリーは次のように変化します。

-  カテゴリ

   -  楽しみ

      -  スポーツ

         -  サーフィン
         -  エクストリーム編み物
         -  スケート **New**

      -  友人

         -  ジェラルド
         -  グウェンドリン

   -  仕事

      -  報告書

         -  年次
         -  状態

      -  出張

         -  国内
         -  国外

-  別の人のカテゴリ **New**

データを変更する
----------------

データを変更することは、新しいデータを追加することと同じぐらい透過的です。何かデータを変更したいが、
parent\_id
は変更しない場合、階層構造にかかわる箇所は何も変更されません。例は次の通りです。

::

    // コントローラのコードの一部
    $this->Category->id = 5; // 「エクストリーム編み物」の ID
    $this->Category->save(array('name' =>'エクストリームフィッシング'));

上述のコードは parent\_id
フィールドに何も影響をあたえません。もし渡されたデータの中に parent\_id
が入っていても、値に変更がなければ保存されませんし、階層構造も更新されません。この結果、ツリーのデータは次ようになります。

-  カテゴリ

   -  楽しみ

      -  スポーツ

         -  サーフィン
         -  エクストリームフィッシング **Updated**
         -  スケート

      -  友人

         -  ジェラルド
         -  グウェンドリン

   -  仕事

      -  報告書

         -  年次
         -  状態

      -  出張

         -  国内
         -  国外

-  別の人のカテゴリ

ツリーの中でデータを移動することも、簡潔に行えます。エクストリームフィッシングはスポーツではないが、別の人のカテゴリに属するとする場合、次のようにします。

::

    // コントローラのコードの一部
    $this->Category->id = 5; // 「エクストリームフィッシング」の ID
    $newParentId = $this->Category->field('id', array('name' => '別の人のカテゴリ'));
    $this->Category->save(array('parent_id' => $newParentId)); 

次のような構造に変更されることが正しい動作です。

-  カテゴリ

   -  楽しみ

      -  スポーツ

         -  サーフィン
         -  スケート

      -  友人

         -  ジェラルド
         -  グウェンドリン

   -  仕事

      -  報告書

         -  年次
         -  状態

      -  出張

         -  国内
         -  国外

-  別の人のカテゴリ

   -  エクストリームフィッシング **Moved**

データの削除
------------

ツリービヘイビアは、データの削除を管理するいくつかの方法を提供します。もっともシンプルな例からはじめてみましょう。「報告書」カテゴリが不要であるとしましょう。このカテゴリと\ *それの子要素も全て*\ 削除する場合、どのモデルであってもただ
delete() をコールします。例は次の通りです。

::

    // コントローラのコードの一部
    $this->Category->id = 10;
    $this->Category->delete();

カテゴリのツリーは次のように変更されます。

-  カテゴリ

   -  楽しみ

      -  スポーツ

         -  サーフィン
         -  スケート

      -  友人

         -  ジェラルド
         -  グウェンドリン

   -  仕事

      -  出張

         -  国内
         -  国外

-  別の人のカテゴリ

   -  エクストリームフィッシング

データの問合せと利用
--------------------

階層構造になったデータを取り扱い操作するのは、ややこしい作業になりがちです。コアの
find
メソッドに加え、ツリービヘイビアによって自由に使えるツリー構造の順序変更をいくつか行えます。

ツリービヘイビアのメソッドのほとんどは、 ``lft``
に依存してデータを並び替え、それを返します。もし ``find()``
メソッドをコールするときに ``lft``
で並び替えなかったり、ツリービヘイビアのメソッドに並び替えのための値を渡すと、望ましくない結果が返ってくるでしょう。

Children
~~~~~~~~

``children``
メソッドは列の主キー(id)の値を用いて、そのアイテムの子を返します。デフォルトの順番はツリーに出現した順です。第二引数はオプションのパラメータで、直接の子のみを返すか否かを定義します。前の章のデータ使った例を見てみましょう。

::

    $allChildren = $this->Category->children(1); // 11アイテムをフラットな配列で返す
    // -- または --
    $this->Category->id = 1;
    $allChildren = $this->Category->children(); // 11アイテムをフラットな配列で返す

    // 直接の子のみ返す
    $directChildren = $this->Category->children(1, true); // 2アイテムをフラットな配列で返す

再帰的な配列で取得したい場合は、 ``find('threaded')``
というようにしてください。

子の数を数える
~~~~~~~~~~~~~~

``children`` メソッドと同様に、 ``childCount``
には列の主キー(id)の値を渡します。これにより主キーが指定されたノードの子の数が返されます。オプションの第二引数では、直接の子のみの数を返すか否かを定義できます。前の章のデータを使った例を見てみましょう。

::

    $totalChildren = $this->Category->childCount(1); // 11 を出力する
    // -- または --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // 11 を出力する

    // このカテゴリの直接の子のみ数える
    $numChildren = $this->Category->childCount(1, true); // 2 を出力する

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist (&$model, $conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

このメソッドは、プレフィックスでインデントを付け構造が分かるようにした、
find('list')
に似たデータを返します。次のものは、このメソッドが返すべきデータです。その他の
find に似たパラメータについては、 API リファレンスを参照してください。

::

    array(
        [1] =>  "カテゴリ",
        [2] =>  "_楽しみ",
        [3] =>  "__スポーツ",
        [4] =>  "___サーフィン",
        [16] => "___スケート",
        [6] =>  "__友人",
        [7] =>  "___ジェラルド",
        [8] =>  "___グウェンドリン",
        [9] =>  "_仕事",
        [13] => "__出張",
        [14] => "___国内",
        [15] => "___国外",
        [17] => "別の人のカテゴリ",
        [5] =>  "_エクストリームフィッシング"
    )

getparentnode
~~~~~~~~~~~~~

この便利な関数は、その名前が意味する通り、あるノードの親ノードを返します。ただし、指定したノードに親がない(つまり根ノードである)場合は、
*false* を返します。例は次の通りです。

::

    $parent = $this->Category->getparentnode(2); //<- 「楽しみ」の ID
    // $parent にはカテゴリについての情報が入っている

getpath
~~~~~~~

最も上の根ノードから最も下の葉ノードまでのパス(\ *path*)を返します。例においてカテゴリの「国外」までのパスは次のようになります。

-  カテゴリ

   -  ...
   -  仕事

      -  出張

         -  ...
         -  国外

「国外」の ID を使って getpath
を実行すると、最も上(根ノード)からはじめて、各親を順々に返します。

::

    $parents = $this->Category->getpath(15);

::

    // $parents の内容は次の通り
    array(
        [0] =>  array('Category' => array('id' => 1, 'name' => 'カテゴリ', ..)),
        [1] =>  array('Category' => array('id' => 9, 'name' => '仕事', ..)),
        [2] =>  array('Category' => array('id' => 13, 'name' => '出張', ..)),
        [3] =>  array('Category' => array('id' => 15, 'name' => '国外', ..)),
    )

進んだ使い方
============

ツリービヘイビアはバックグラウンドだけで働くわけではありません。ビヘイビアには、階層化されたデータが必要とする処理を全て行い、このプロセス中に望まない動作が発生しないようにするための、特別なメソッドがいくつか定義されています。

moveDown
--------

ツリーの中で一つのノードを位置を下げる(葉ノードに近づける)ために使用します。移動する要素の
ID
と、そのノードを下げる階層の数を正の整数で与えてください。指定したノードの子ノードも、全て移動されます。

次のものは、特定のノードの位置を下げる「Categories」という名のコントローラアクションの例です。

::

    function movedown($name = null, $delta = null) {
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash($name . 'という名のカテゴリが存在しません。');
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('フィールドの位置を下げる数を入力してください。'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        }

例えば「Sport」というカテゴリを一段下げたい場合は、「/categories/movedown/Sport/1」というリクエストを行ってください。

moveUp
------

ツリーの中で一つのノードを位置を上げる(根ノードに近づける)ために使用します。移動する要素の
ID
と、そのノードを上げる階層の数を正の整数で与えてください。全ての子ノードも、全て移動されます。

次のものは、ノードの位置を上げる「Categories」という名のコントローラアクションの例です。

::

    function moveup($name = null, $delta = null){
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash($name . 'という名のカテゴリが存在しません。');
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveup($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('カテゴリの位置を上げる数を入力してください。'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        
        }

例えば「Gwendolyn」というカテゴリを一段上げたい場合は、「/categories/moveup/Gwendolyn/1」というリクエストを行ってください。これで、友人の並び順は
Gwendolyn, Gerald となりました。

removeFromTree
--------------

``removeFromTree($id=null, $delete=false)``

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </ja/view/1316/delete>`_, which for a model
using the tree behavior will remove the specified node and all of its
children.

Taking the following tree as a starting point:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme knitting
         -  Skating

Running the following code with the id for 'Sport'

::

    $this->Node->removeFromTree($id); 

The Sport node will be become a top level node:

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

-  Sport **Moved**

This demonstrates the default behavior of ``removeFromTree`` of moving
the node to have no parent, and re-parenting all children.

If however the following code snippet was used with the id for 'Sport'

::

    $this->Node->removeFromTree($id,true); 

The tree would become

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

This demonstrates the alternate use for ``removeFromTree``, the children
have been reparented and 'Sport' has been deleted.

reorder
-------

このメソッドは階層化されたデータを並び替えるために使用します。

データの整合性をとる
====================

木構造やリンクされたリストのように、自分自身を参照する複雑なデータ構造は、その性質上、まれに不用意なコールによって壊れてしまいます。気落ちしないでください。全てが失われたわけではありません！これまでの文書中には登場していませんが、Tree
Behavior はこういった状況に対処するための関数をいくつか持っています。

データの整合性を復旧できる可能性がある関数は、次のものになります。:

recover(&$model, $mode = 'parent', $missingParentAction = null)

mode
パラメータは、有効な、あるいは正しい元情報のソースを定義するために使用します。逆側のデータソースは、先に定義した情報のソースに基づいて投入されます。例えば、$mode
が 'parent' である MPTT
のフィールドが衝突している、あるいは空である場合、 parent\_id
フィールドの値が左座標と右座標を投入するために使用されます。missingParentAction
パラメータは、"parent" モードの時にのみ使用し、parent
フィールドに有効でない ID が含まれる場合に何をすべきかを決定します。

reorder(&$model, $options = array())

木構造のデータ中のノード(と子ノード)を、パラメータで定義されたフィールドと指示によって、もう一度並び替えます。
このメソッドは、全てのノードの親を変更しません。

この options 配列は、デフォルトで 'id' => null 、 'field' =>
$model->displayField 、 'order' => 'ASC' 、そして 'verify' => true
という値を含みます。

verify(&$model)

木構造の整合性がとれたら true を返し、そうでない場合は (type, incorrect
left/right index, message) という形式の配列を返します。

Recover
-------

``recover(&$model, $mode = 'parent', $missingParentAction = null)``

The ``mode`` parameter is used to specify the source of info that is
valid/correct. The opposite source of data will be populated based upon
that source of info. E.g. if the MPTT fields are corrupt or empty, with
the ``$mode 'parent'`` the values of the ``parent_id`` field will be
used to populate the left and right fields. The ``missingParentAction``
parameter only applies to "parent" mode and determines what to do if the
parent field contains an id that is not present.

Available ``$mode`` options:

-  ``'parent'`` - use the existing ``parent_id``'s to update the ``lft``
   and ``rght`` fields
-  ``'tree'`` - use the existing ``lft`` and ``rght`` fields to update
   ``parent_id``

Available ``missingParentActions`` options when using ``mode='parent'``:

-  ``null`` - do nothing and carry on
-  ``'return'`` - do nothing and return
-  ``'delete'`` - delete the node
-  ``int`` - set the parent\_id to this id

::

    // Rebuild all the left and right fields based on the parent_id
    $this->Category->recover();
    // or
    $this->Category->recover('parent');
     
    // Rebuild all the parent_id's based on the lft and rght fields
    $this->Category->recover('tree');

Reorder
-------

``reorder(&$model, $options = array())``

Reorders the nodes (and child nodes) of the tree according to the field
and direction specified in the parameters. This method does not change
the parent of any node.

Reordering affects all nodes in the tree by default, however the
following options can affect the process:

-  ``'id'`` - only reorder nodes below this node.
-  ``'field``' - field to use for sorting, default is the
   ``displayField`` for the model.
-  ``'order'`` - ``'ASC'`` for ascending, ``'DESC'`` for descending
   sort.
-  ``'verify'`` - whether or not to verify the tree prior to resorting.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

::

    array(
        'id' => null,
        'field' => $model->displayField,
        'order' => 'ASC',
        'verify' => true
    )

Verify
------

``verify(&$model)``

Returns ``true`` if the tree is valid otherwise an array of errors, with
fields for type, incorrect index and message.

Each record in the output array is an array of the form (type, id,
message)

-  ``type`` is either ``'index'`` or ``'node'``
-  ``'id'`` is the id of the erroneous node.
-  ``'message'`` depends on the error

::

        $this->Categories->verify();

Example output:

::

    Array
    (
        [0] => Array
            (
                [0] => node
                [1] => 3
                [2] => left and right values identical
            )
        [1] => Array
            (
                [0] => node
                [1] => 2
                [2] => The parent node 999 doesn't exist
            )
        [10] => Array
            (
                [0] => index
                [1] => 123
                [2] => missing
            )
        [99] => Array
            (
                [0] => node
                [1] => 163
                [2] => left greater than right
            )

    )

