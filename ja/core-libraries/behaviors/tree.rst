Tree
####

.. php:class:: TreeBehavior()

データベーステーブルに階層構造のデータを格納したいケースはごく一般的に存在します。
例えば数に上限が無いサブカテゴリを持つカテゴリのデータ、複数のレベルを持つ
メニューシステムのデータ、ACL のロジックのアクセスコントロールオブジェクトを
保存するために使われる文字通り階層構造のデータなどです。

小さいツリーのデータや、少ない階層の深さを持つデータの場合、 parent\_id
フィールドをデータベーステーブルに追加したり、アイテムの親が何であるかを
追跡することは簡単です。しかしながら CakePHP にバンドルされている
ビヘイビアの機能は非常にパワフルです。
`MPTT ロジック <http://www.sitepoint.com/hierarchical-data-database-2/>`_
を扱うには複雑なテクニックを駆使する必要がありますが、このビヘイビアを使用すると、
それにわずらわされることなく MPTT ロジックの恩恵を受けることができます。

必要なもの
==========

Tree ビヘイビアを使用するには、テーブルが次に挙げる3つのフィールドを持っている
必要があります (フィールドは全て整数型です)。

-  親 - デフォルトのフィールド名は「parent\_id」です。親オブジェクトの
   id を格納するためのものです。
-  左端 - デフォルトのフィールド名は「lft」です。現在のオブジェクトの
   左端の座標を入力します。
-  右端 - デフォルトのフィールド名は「rght」です。現在のオブジェクトの
   右端の座標を入力します。

もし MPTT ロジックをよく知っているなら、なぜ親フィールドが存在するのか疑問に
思うでしょう。これは、親への直接的なリンクがデータベースに存在すると、いくつかの
タスクがとても簡単になるためです(例えば、ある要素の直接の子を見つける時など)。

.. note::

    ``親`` フィールドは、NULL 値が使えなければなりません。最上位の要素の親の値に
    ゼロを設定すれば動作するように思えるかもしれませんが、ツリーの並び替えや
    その他の操作が失敗してしまいます。

基本的な使い方
==============

Tree ビヘイビアで出来ることはたくさんあります。しかし、簡単な例からはじめてみましょう。
次のデータベーステーブルを作成し、データを投入してください。 ::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (1, '私のカテゴリ', NULL, 1, 30);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (2, '楽しみ', 1, 2, 15);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (3, 'スポーツ', 2, 3, 8);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (4, 'サーフィン', 3, 4, 5);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (5, 'エクストリーム編み物', 3, 6, 7);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (6, '友達', 2, 9, 14);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (7, 'ジェラルド', 6, 10, 11);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (8, 'グウェンドリン', 6, 12, 13);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (9, '仕事', 1, 16, 29);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (10, '報告書', 9, 17, 22);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (11, '年報', 10, 18, 19);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (12, '状況', 10, 20, 21);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (13, '出張', 9, 23, 28);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (14, '国内', 13, 24, 25);
    INSERT INTO
      `categories` (`id`, `name`, `parent_id`, `lft`, `rght`)
    VALUES
      (15, '海外', 13, 26, 27);

正しくセットアップされたかをチェックするには、テスト用のメソッドを作成して、
カテゴリツリーのコンテンツの出力がどのようになるかを確認します。
簡単なコントローラを使います。 ::

    class CategoriesController extends AppController {

        public function index() {
            $data = $this->Category->generateTreeList(
              null,
              null,
              null,
              '&nbsp;&nbsp;&nbsp;'
            );
            debug($data); die;
        }
    }

シンプルなモデルの定義例です。 ::

    // app/Model/Category.php
    class Category extends AppModel {
        public $actsAs = array('Tree');
    }

これで /categories にアクセスすると、カテゴリのツリーのデータがどのように
見えるかチェックできます。次のようになるはずです。

-  私のカテゴリ

    -  楽しみ

        -  スポーツ

            -  サーフィン
            -  エクストリーム編み物

        -  友達

            -  ジェラルド
            -  エクストリーム編み物

    -  仕事

        -  報告書

            -  年報
            -  状況

        -  出張

            -  国内
            -  海外

データを追加する
----------------

前のセクションでは、既存のデータを用い ``generatetreelist`` メソッドを使うことで
階層構造がどのように見えるかを確認しました。しかしながら、たとえ階層構造を持った
データであっても、通常は他のモデルとまったく同じ方法でデータを追加します。
例は次の通りです。 ::

    // pseudo controller code
    $data['Category']['parent_id'] = 3;
    $data['Category']['name'] = 'スケート';
    $this->Category->save($data);

Tree ビヘイビアを用いる場合、親 ID (*parent\_id*) をセットする以外のことは
何も行う必要がありません。残りのことは Tree ビヘイビアが注意深く行ってくれます。
もし parent\_id をセットしない場合は、Tree ビヘイビアはツリーに、
新たなトップレベルのエントリーを作成します。 ::

    // pseudo controller code
    $data = array();
    $data['Category']['name'] = '別の人たちのカテゴリ';
    $this->Category->save($data);

上記の２つの短いコードを実行すると、ツリーは次のように変化します。

- 私のカテゴリ

    - 楽しみ

        - スポーツ

            - サーフィン
            - エクストリーム編み物
            - スケート **New**

        - 友達

            - ジェラルド
            - グウェンドリン

    - 仕事

        - 報告書

            - 年報
            - 状況

        - 出張

            - 国内
            - 海外

- 別の人たちのカテゴリ **New**

データを変更する
----------------

データを変更することは、新しいデータを追加することと同じぐらい透過的です。
何かデータを変更したいが、 parent\_id は変更しない場合、階層構造にかかわる箇所は
何も変更されません。例は次の通りです。 ::

    // コントローラのコードの一部
    $this->Category->id = 5; // 「エクストリーム編み物」の ID
    $this->Category->save(array('name' => 'Extreme fishing'));

上記のコードは parent\_id フィールドに何も影響をあたえません。
もし渡されたデータの中に parent\_id が入っていても、
値に変更がなければ保存されませんし、階層構造も更新されません。
この結果、ツリーのデータは次ようになります。

- 私のカテゴリ

    - 楽しみ

        - スポーツ

            - サーフィン
            - エクストリームフィッシング **Updated**
            - スケート

        - 友達

            - ジェラルド
            - グウェンドリン

    - 仕事

        - 報告書

            - 年報
            - 状況

        - 出張

            - 国内
            - 海外

- 別の人たちのカテゴリ

ツリーの中でデータを移動することも簡潔に行えます。エクストリームフィッシングは
スポーツではないが、別の人たちのカテゴリに属するとする場合、次のようにします。 ::

    // コントローラのコードの一部
    $this->Category->id = 5; // 「エクストリームフィッシング」の ID
    $newParentId = $this->Category->field(
      'id',
      array('name' => '別の人たちのカテゴリ')
    );
    $this->Category->save(array('parent_id' => $newParentId));

次のような構造に変更されることが正しい動作です。

- 私のカテゴリ

    - 楽しみ

        - スポーツ

            - サーフィン
            - スケート

        - 友達

            - ジェラルド
            - グウェンドリン

    - 仕事

        - 報告書

            - 年報
            - 状況

        - 出張

            - 国内
            - 海外

- 別の人たちのカテゴリ

    -  エクストリームフィッシング **Moved**

データの削除
------------

Tree ビヘイビアは、データの削除を管理するいくつかの方法を提供します。
もっともシンプルな例からはじめてみましょう。「報告書」カテゴリが不要であるとしましょう。
このカテゴリと *それの子要素も全て* 削除する場合、どのモデルであってもただ
delete() をコールします。例は次の通りです。
::

    // コントローラのコードの一部
    $this->Category->id = 10;
    $this->Category->delete();

カテゴリのツリーは次のように変更されます。

- 私のカテゴリ

    - 楽しみ

        - スポーツ

            - サーフィン
            - スケート

        - 友達

            - ジェラルド
            - グウェンドリン

    - 仕事

        - 出張

            - 国内
            - 海外

- 別の人たちのカテゴリ

    - エクストリームフィッシング

データの問合せと利用
--------------------

階層構造になったデータを取り扱い操作するのは、ややこしい作業になりがちです。
コアの find メソッドに加え、ツリービヘイビアによって自由に使えるツリー構造の
順序変更をいくつか行えます。

.. note::

    Tree ビヘイビアのメソッドのほとんどは、 ``lft`` に依存してデータを並び替え、
    それを返します。もし ``find()`` メソッドをコールするときに ``lft`` で
    並び替えなかったり、ツリービヘイビアのメソッドに並び替えのための値を渡すと、
    望ましくない結果が返ってくるでしょう。

.. php:class:: TreeBehavior

    .. php:method:: children($id = null, $direct = false, $fields = null, $order = null, $limit = null, $page = 1, $recursive = null)

    :param $id: 検索するためのレコードのID
    :param $direct: 直下のノードのみを返すために true を設定します
    :param $fields: 戻り値に含まれるフィールド名の文字列またはフィールドの配列
    :param $order: ORDER BY の SQL 文字列
    :param $limit: SQL の LIMIT 構文
    :param $page: ページつけられた結果にアクセスするための引数
    :param $recursive: 再帰的に関連付けられたモデルの深さのレベル数

    ``children`` メソッドは列の主キー(id)の値を用いて、そのアイテムの子を返します。
    デフォルトの順番はツリーに出現した順です。第二引数はオプションのパラメータで、
    直下の子ノードのみを返すか否かを定義します。前のセクションのデータ使った例を
    見てみましょう。 ::

        $allChildren = $this->Category->children(1); // 11個のフラットな配列
        // -- または --
        $this->Category->id = 1;
        $allChildren = $this->Category->children(); // 11 個のフラットな配列

        // 直下の子ノードのみを返す
        $directChildren = $this->Category->children(1, true); // 2 個のフラットな
                                                              // 配列

    .. note::

        再帰的な配列で取得したい場合は、 ``find('threaded')``
        というようにしてください。

    .. php:method:: childCount($id = null, $direct = false)

    ``children`` メソッドと同様に、 ``childCount`` には列の主キー (id) の値を
    渡します。これにより主キーが指定されたノードの子の数が返されます。オプションの
    第二引数では、直下の子ノードのみの数を返すか否かを定義できます。前の章のデータを
    使った例を見てみましょう。 ::

        $totalChildren = $this->Category->childCount(1); // 11 を出力
        // -- または --
        $this->Category->id = 1;
        $directChildren = $this->Category->childCount(); // 11 を出力

        // このカテゴリの直下の子ノードだけの数
        $numChildren = $this->Category->childCount(1, true); // 2 を出力

    .. php:method:: generateTreeList ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)

    :param $conditions: find() と同様の検索条件オプションに使用
    :param $keyPath: キーとして使用するフィールドのパス。例: "{n}.Post.id"
    :param $valuePath: ラベルに使用するフィールドのパス。例: "{n}.Post.title"
    :param $spacer: 各々の値の前に付ける深さを示すための文字列
    :param $recursive: 関連付けられたレコードを取得する際の深さのレベル数

    このメソッドは、 ``spacer`` オプションで指定したプレフィックスでインデントを
    付け構造が分かるようにした :ref:`model-find-list` に似たデータを返します。
    以下は、このメソッドがどのような値を返すかの例です。 ::

      $treelist = $this->Category->generateTreeList();

    出力結果::

      array(
          [1] =>  "私のカテゴリ",
          [2] =>  "_楽しみ",
          [3] =>  "__スポーツ",
          [4] =>  "___サーフィン",
          [16] => "___スケート",
          [6] =>  "__友達",
          [7] =>  "___ジェラルド",
          [8] =>  "___グウェンドリン",
          [9] =>  "_仕事",
          [13] => "__出張",
          [14] => "___国内",
          [15] => "___海外",
          [17] => "別の人たちのカテゴリ",
          [5] =>  "_エクストリームフィッシング"
      )

    .. php:method:: formatTreeList($results, $options=array())

    .. versionadded:: 2.7

    :param $results: find('all') の実行結果
    :param $options: 設定するオプション配列

    このメソッドは、あなたのデータ構造を示す ``spacer`` オプションで指定された
    ネストしたプレフィックスをつけて :ref:`model-find-list` と似たデータを返します。

    サポートされるオプション:

    * ``keyPath``: キーの文字列パス。例： "{n}.Post.id"
    * ``valuePath``: 値の文字列パス。例： "{n}.Post.title"
    * ``spacer``: 繰り返しの文字または文字列

    例::

        $results = $this->Category->find('all');
        $results = $this->Category->formatTreeList($results, array(
            'spacer' => '--'
        ));

    .. php:method:: getParentNode()

    この便利な関数は、その名前が意味する通り、あるノードの親ノードを返します。
    ただし、指定したノードに親がない(つまりルートノードである)場合は、 *false*
    を返します。例は次の通りです。 ::

        $parent = $this->Category->getParentNode(2); //<- "楽しみ" の ID
        // $parent は全てのカテゴリを含みます

    .. php:method:: getPath( $id = null, $fields = null, $recursive = null )

    トップのノードからたどって階層化されたデータのパス (*path*) を返します。
    例においてカテゴリの「海外」までのパスは次のようになります。

    -  私のカテゴリ

        - ...
        - 仕事
        - 出張

            - ...
            - 海外

    「海外」の ID を使って getPath を実行すると、頂上からはじめて、
    各親を順々に返します。 ::

        $parents = $this->Category->getPath(15);

    ::

      // contents of $parents
      array(
          [0] =>  array(
            'Category' => array('id' => 1, 'name' => '私のカテゴリ', ..)
          ),
          [1] =>  array(
            'Category' => array('id' => 9, 'name' => '仕事', ..)
          ),
          [2] =>  array(
            'Category' => array('id' => 13, 'name' => '出張', ..)
          ),
          [3] =>  array(
            'Category' => array('id' => 15, 'name' => '海外', ..)
          ),
      )

進んだ使い方
============

Tree ビヘイビアはバックグラウンドだけで働くわけではありません。ビヘイビアには、
階層化されたデータが必要とする処理を全て行い、このプロセス中に望まない動作が
発生しないようにするための、特別なメソッドがいくつか定義されています。

.. php:method:: moveDown()

ツリーの中で一つのノードを位置を下げるために使用します。移動する要素の ID と、
そのノードを下げる階層の数を正の整数で与えてください。
指定したノードの子ノードも、全て移動されます。

次のものは、特定のノードの位置を下げる「Categories」という名の
コントローラアクションの例です。 ::

    public function movedown($id = null, $delta = null) {
        $this->Category->id = $id;
        if (!$this->Category->exists()) {
           throw new NotFoundException(__('Invalid category'));
        }

        if ($delta > 0) {
            $this->Category->moveDown($this->Category->id, abs($delta));
        } else {
            $this->Session->setFlash(
              'フィールドの位置を下げる数を入力してください。'
            );
        }

        return $this->redirect(array('action' => 'index'));
    }

例えば「スポーツ」(id は 3) というカテゴリを一段下げたい場合は、
「/categories/movedown/3/1」というリクエストを行ってください。

.. php:method:: moveUp()

ツリーの中で一つのノードを位置を上げるために使用します。
移動する要素の ID と、そのノードを上げる階層の数を正の整数で与えてください。
全ての子ノードも、全て移動されます。

以下は、ノードの位置を上げる「Categories」という名のコントローラアクションの
例です。 ::

    public function moveup($id = null, $delta = null) {
        $this->Category->id = $id;
        if (!$this->Category->exists()) {
           throw new NotFoundException(__('Invalid category'));
        }

        if ($delta > 0) {
            $this->Category->moveUp($this->Category->id, abs($delta));
        } else {
            $this->Session->setFlash(
              'カテゴリの位置を上げる数を入力してください。'
            );
        }

        return $this->redirect(array('action' => 'index'));
    }

例えば「グウェンドリン」(id は 8) というカテゴリを一段上げたい場合は、
「/categories/moveup/8/1」というリクエストを行ってください。
これで、友達の並び順は グウェンドリン, ジェラルド となりました。

.. php:method:: removeFromTree($id = null, $delete = false)

このメソッドを使うと、ノードを削除または移動できます。しかし、そのノードの
サブツリーは、親ノードの直下に位置付けられます。それは、 :ref:`model-delete`
よりもより多くの制御を提供します。Tree ビヘイビアを使用しているモデルから指定した
ノードと全ての子ノードを削除できます。

開始時点では、以下のツリーだとすると:

-  私のカテゴリ

    -  楽しみ

        -  スポーツ

            -  サーフィン
            -  エクストリーム編み物
            -  スケート

「スポーツ」の ID を指定して以下のコードを実行::

    $this->Node->removeFromTree($id);

スポーツのノードは、最上位のノードになります:

-  私のカテゴリ

    -  楽しみ

        -  サーフィン
        -  エクストリーム編み物
        -  スケート

-  スポーツ **Moved**

これは、親を持たないノードに移動し、全ての子ノードの紐付けを変更する
``removeFromTree`` のデフォルトの振る舞いを実演しています。

一方、「スポーツ」の ID を指定して、以下のコードスニペットを使用した場合、 ::

    $this->Node->removeFromTree($id, true);

ツリーは以下のようになります。

-  私のカテゴリ

    -  楽しみ

        -  サーフィン
        -  エクストリーム編み物
        -  スケート

これは、子ノードが親ノードに紐づけられ、スポーツが削除されるという
``removeFromTree`` の別の使い方を実演しています。

.. php:method:: reorder(array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true))

ツリー構造のデータ中のノード (と子ノード) を、パラメータで定義されたフィールドと
指示によって、もう一度並び替えます。このメソッドは、全てのノードの親を変更しません。 ::

    $model->reorder(array(
        // 並び替え時に頂点として使用するレコードの ID。デフォルト: $Model->id
        'id' => ,
        // 並び替えで使用するフィールド。デフォルト: $Model->displayFirld
        'field' => ,
        // 並び替えの方向。デフォルト: 'ASC'
        'order' => ,
        // 並び替えの前にツリーの検証を行うかどうか。デフォルト: true
        'verify' =>
    ));

.. note::

    データを保存したり、モデルに別の操作をさせた場合、 ``reorder`` を呼ぶ前に
    ``$model->id = null`` を設定したいかもしれません。
    さもないと、現在のノードとその子ノードのみが並び替えられます。

データの整合性をとる
====================

ツリー構造やリンクされたリストのように、自分自身を参照する複雑なデータ構造は、
その性質上、まれに不用意なコールによって壊れてしまいます。気落ちしないでください。
全てが失われたわけではありません！これまでの文書中には登場していませんが、Tree
ビヘイビアはこういった状況に対処するための関数をいくつか持っています。

.. php:method:: recover($mode = 'parent', $missingParentAction = null)

``mode`` パラメータは、有効な、あるいは正しい元情報のソースを定義するために
使用します。逆側のデータソースは、先に定義した情報のソースに基づいて投入されます。
例えば、 ``$mode が 'parent'`` で、MPTT のフィールドが衝突している、
あるいは空である場合、 ``parent_id`` フィールドの値が左座標と右座標を
投入するために使用されます。 ``missingParentAction`` パラメータは、
"parent" モードの時にのみ使用し、親フィールドに存在しない ID が
含まれる場合に何をすべきかを決定します。

利用可能な ``$mode`` オプション:

-  ``'parent'`` - ``lft`` フィールドと ``rght`` フィールドを更新するために、
   既存の ``parent_id`` を使用
-  ``'tree'`` - ``parent_id`` を更新するために、既存の ``lft`` フィールドと
   ``rght`` フィールドを使用

``mode='parent'`` の時に利用可能な ``missingParentActions`` オプション:

-  ``null`` - 何もしないで継続する
-  ``'return'`` - 何もしないで返す
-  ``'delete'`` - ノードを削除
-  ``int`` - parent\_id に、この ID を設定

例::

    // parent_id を元に全ての左右のフィールドを再構築します
    $this->Category->recover();
    // または
    $this->Category->recover('parent');

    // 左右のフィールドを元に全ての parent_id を再構築します
    $this->Category->recover('tree');


.. php:method:: reorder($options = array())

ツリー構造のデータ中のノード (と子ノード) を、パラメータで定義されたフィールドと
指示によって、もう一度並び替えます。このメソッドは、全てのノードの親を変更しません。

デフォルトでは、並び替えは、ツリーの全てのノードに影響しますが、
以下のオプションが処理に影響します。

-  ``'id'`` - このノード以下を並び替えます
-  ``'field``' - 並び替えに使用するフィールド。モデルの ``displayField``
   がデフォルトです。
-  ``'order'`` - 昇順なら ``'ASC'`` で、降順なら ``'DESC'``
-  ``'verify'`` - 並び替えの前にツリーを検証するかどうか

``$options`` は、全ての追加パラメータの設定に使用され、デフォルトでは
以下の利用可能なキーを持ち、それらは全てオプションです。 ::

    array(
        'id' => null,
        'field' => $model->displayField,
        'order' => 'ASC',
        'verify' => true
    )

.. php:method:: verify()

ツリー構造の整合性がとれたら ``true`` を返し、そうでない場合は 、フィールドの
タイプ, 不正なインデックス, エラーメッセージを含む配列です。

出力された配列の各レコードは、(type, id, message) という形式の配列です。

-  ``type`` は ``'index'`` か ``'node'`` のどちらか
-  ``'id'`` は間違ったノードの ID
-  ``'message'`` はエラーに依存します

使用例::

    $this->Category->verify();

出力結果::

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

ノードレベル (深さ)
=====================

.. versionadded:: 2.7

ツリーノードの深さを知ることは、例えばメニューを生成するときなど、一定のレベルまで
ノードを検索したい時に役に立ちます。 ``level`` オプションを使うことで、各ノードの
レベルを保存するフィールドを指定することができます。 ::

    public $actAs = array('Tree' => array(
        'level' => 'level', // デフォルトは null で、レベルは保存しません
    ));

.. php:method:: getLevel($id)

.. versionadded:: 2.7

``level`` オプションを設定してノードのレベルをキャッシュしていなかったとしても、
このメソッドで特定のノードのレベルを取得することができます。

.. meta::
    :title lang=ja: ツリー
    :keywords lang=ja: オートインクリメント,リテラル表現,親 ID,テーブル カテゴリ,データベーステーブル,階層化データ,ヌル値,メニューシステム,入り組んだ,アクセス制御,階層構造,ロジック,要素,ツリー
