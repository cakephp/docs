# Tree

`class` **TreeBehavior**

データベーステーブルに階層構造のデータを格納したいケースはごく一般的に存在します。
例えば数に上限が無いサブカテゴリを持つカテゴリのデータ、複数のレベルを持つ
メニューシステムのデータ、ACL のロジックのアクセスコントロールオブジェクトを
保存するために使われる文字通り階層構造のデータなどです。

小さいツリーのデータや、少ない階層の深さを持つデータの場合、 parent_id
フィールドをデータベーステーブルに追加したり、アイテムの親が何であるかを
追跡することは簡単です。しかしながら CakePHP にバンドルされている
ビヘイビアの機能は非常にパワフルです。
[MPTT ロジック](https://www.sitepoint.com/hierarchical-data-database-2/)
を扱うには複雑なテクニックを駆使する必要がありますが、このビヘイビアを使用すると、
それにわずらわされることなく MPTT ロジックの恩恵を受けることができます。

## 必要なもの

Tree ビヘイビアを使用するには、テーブルが次に挙げる3つのフィールドを持っている
必要があります (フィールドは全て整数型です)。

- 親 - デフォルトのフィールド名は「parent_id」です。親オブジェクトの
  id を格納するためのものです。
- 左端 - デフォルトのフィールド名は「lft」です。現在のオブジェクトの
  左端の座標を入力します。
- 右端 - デフォルトのフィールド名は「rght」です。現在のオブジェクトの
  右端の座標を入力します。

もし MPTT ロジックをよく知っているなら、なぜ親フィールドが存在するのか疑問に
思うでしょう。これは、親への直接的なリンクがデータベースに存在すると、いくつかの
タスクがとても簡単になるためです(例えば、ある要素の直接の子を見つける時など)。

> [!NOTE]
> `親` フィールドは、NULL 値が使えなければなりません。最上位の要素の親の値に
> ゼロを設定すれば動作するように思えるかもしれませんが、ツリーの並び替えや
> その他の操作が失敗してしまいます。

## 基本的な使い方

Tree ビヘイビアで出来ることはたくさんあります。しかし、簡単な例からはじめてみましょう。
次のデータベーステーブルを作成し、データを投入してください。 :

``` sql
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
```

正しくセットアップされたかをチェックするには、テスト用のメソッドを作成して、
カテゴリツリーのコンテンツの出力がどのようになるかを確認します。
簡単なコントローラを使います。 :

``` php
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
```

シンプルなモデルの定義例です。 :

``` php
// app/Model/Category.php
class Category extends AppModel {
    public $actsAs = array('Tree');
}
```

これで /categories にアクセスすると、カテゴリのツリーのデータがどのように
見えるかチェックできます。次のようになるはずです。

- 私のカテゴリ
  - 楽しみ
    - スポーツ
      - サーフィン
      - エクストリーム編み物
    - 友達
      - ジェラルド
      - エクストリーム編み物
  - 仕事
    - 報告書
      - 年報
      - 状況
    - 出張
      - 国内
      - 海外

### データを追加する

前のセクションでは、既存のデータを用い `generatetreelist` メソッドを使うことで
階層構造がどのように見えるかを確認しました。しかしながら、たとえ階層構造を持った
データであっても、通常は他のモデルとまったく同じ方法でデータを追加します。
例は次の通りです。 :

``` php
// pseudo controller code
$data['Category']['parent_id'] = 3;
$data['Category']['name'] = 'スケート';
$this->Category->save($data);
```

Tree ビヘイビアを用いる場合、親 ID (*parent_id*) をセットする以外のことは
何も行う必要がありません。残りのことは Tree ビヘイビアが注意深く行ってくれます。
もし parent_id をセットしない場合は、Tree ビヘイビアはツリーに、
新たなトップレベルのエントリーを作成します。 :

``` php
// pseudo controller code
$data = array();
$data['Category']['name'] = '別の人たちのカテゴリ';
$this->Category->save($data);
```

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

### データを変更する

データを変更することは、新しいデータを追加することと同じぐらい透過的です。
何かデータを変更したいが、 parent_id は変更しない場合、階層構造にかかわる箇所は
何も変更されません。例は次の通りです。 :

``` php
// コントローラのコードの一部
$this->Category->id = 5; // 「エクストリーム編み物」の ID
$this->Category->save(array('name' => 'Extreme fishing'));
```

上記のコードは parent_id フィールドに何も影響をあたえません。
もし渡されたデータの中に parent_id が入っていても、
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
スポーツではないが、別の人たちのカテゴリに属するとする場合、次のようにします。 :

``` php
// コントローラのコードの一部
$this->Category->id = 5; // 「エクストリームフィッシング」の ID
$newParentId = $this->Category->field(
  'id',
  array('name' => '別の人たちのカテゴリ')
);
$this->Category->save(array('parent_id' => $newParentId));
```

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
  - エクストリームフィッシング **Moved**

### データの削除

Tree ビヘイビアは、データの削除を管理するいくつかの方法を提供します。
もっともシンプルな例からはじめてみましょう。「報告書」カテゴリが不要であるとしましょう。
このカテゴリと *それの子要素も全て* 削除する場合、どのモデルであってもただ
delete() をコールします。例は次の通りです。
:

``` php
// コントローラのコードの一部
$this->Category->id = 10;
$this->Category->delete();
```

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

### データの問合せと利用

階層構造になったデータを取り扱い操作するのは、ややこしい作業になりがちです。
コアの find メソッドに加え、ツリービヘイビアによって自由に使えるツリー構造の
順序変更をいくつか行えます。

> [!NOTE]
> Tree ビヘイビアのメソッドのほとんどは、 `lft` に依存してデータを並び替え、
> それを返します。もし `find()` メソッドをコールするときに `lft` で
> 並び替えなかったり、ツリービヘイビアのメソッドに並び替えのための値を渡すと、
> 望ましくない結果が返ってくるでしょう。

`class` **TreeBehavior**

## 進んだ使い方

Tree ビヘイビアはバックグラウンドだけで働くわけではありません。ビヘイビアには、
階層化されたデータが必要とする処理を全て行い、このプロセス中に望まない動作が
発生しないようにするための、特別なメソッドがいくつか定義されています。

`method` TreeBehavior::**moveDown**()

ツリーの中で一つのノードを位置を下げるために使用します。移動する要素の ID と、
そのノードを下げる階層の数を正の整数で与えてください。
指定したノードの子ノードも、全て移動されます。

次のものは、特定のノードの位置を下げる「Categories」という名の
コントローラアクションの例です。 :

``` php
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
```

例えば「スポーツ」(id は 3) というカテゴリを一段下げたい場合は、
「/categories/movedown/3/1」というリクエストを行ってください。

`method` TreeBehavior::**moveUp**()

ツリーの中で一つのノードを位置を上げるために使用します。
移動する要素の ID と、そのノードを上げる階層の数を正の整数で与えてください。
全ての子ノードも、全て移動されます。

以下は、ノードの位置を上げる「Categories」という名のコントローラアクションの
例です。 :

``` php
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
```

例えば「グウェンドリン」(id は 8) というカテゴリを一段上げたい場合は、
「/categories/moveup/8/1」というリクエストを行ってください。
これで、友達の並び順は グウェンドリン, ジェラルド となりました。

`method` TreeBehavior::**removeFromTree**($id = null, $delete = false)

このメソッドを使うと、ノードを削除または移動できます。しかし、そのノードの
サブツリーは、親ノードの直下に位置付けられます。それは、 [Model Delete](../../models/deleting-data#model-delete)
よりもより多くの制御を提供します。Tree ビヘイビアを使用しているモデルから指定した
ノードと全ての子ノードを削除できます。

開始時点では、以下のツリーだとすると:

- 私のカテゴリ
  - 楽しみ
    - スポーツ
      - サーフィン
      - エクストリーム編み物
      - スケート

「スポーツ」の ID を指定して以下のコードを実行:

``` php
$this->Node->removeFromTree($id);
```

スポーツのノードは、最上位のノードになります:

- 私のカテゴリ
  - 楽しみ
    - サーフィン
    - エクストリーム編み物
    - スケート
- スポーツ **Moved**

これは、親を持たないノードに移動し、全ての子ノードの紐付けを変更する
`removeFromTree` のデフォルトの振る舞いを実演しています。

一方、「スポーツ」の ID を指定して、以下のコードスニペットを使用した場合、 :

``` php
$this->Node->removeFromTree($id, true);
```

ツリーは以下のようになります。

- 私のカテゴリ
  - 楽しみ
    - サーフィン
    - エクストリーム編み物
    - スケート

これは、子ノードが親ノードに紐づけられ、スポーツが削除されるという
`removeFromTree` の別の使い方を実演しています。

`method` TreeBehavior::**reorder**(array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true))

ツリー構造のデータ中のノード (と子ノード) を、パラメータで定義されたフィールドと
指示によって、もう一度並び替えます。このメソッドは、全てのノードの親を変更しません。 :

``` php
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
```

> [!NOTE]
> データを保存したり、モデルに別の操作をさせた場合、 `reorder` を呼ぶ前に
> `$model->id = null` を設定したいかもしれません。
> さもないと、現在のノードとその子ノードのみが並び替えられます。

## データの整合性をとる

ツリー構造やリンクされたリストのように、自分自身を参照する複雑なデータ構造は、
その性質上、まれに不用意なコールによって壊れてしまいます。気落ちしないでください。
全てが失われたわけではありません！これまでの文書中には登場していませんが、Tree
ビヘイビアはこういった状況に対処するための関数をいくつか持っています。

`method` TreeBehavior::**recover**($mode = 'parent', $missingParentAction = null)

`mode` パラメータは、有効な、あるいは正しい元情報のソースを定義するために
使用します。逆側のデータソースは、先に定義した情報のソースに基づいて投入されます。
例えば、 `$mode が 'parent'` で、MPTT のフィールドが衝突している、
あるいは空である場合、 `parent_id` フィールドの値が左座標と右座標を
投入するために使用されます。 `missingParentAction` パラメータは、
"parent" モードの時にのみ使用し、親フィールドに存在しない ID が
含まれる場合に何をすべきかを決定します。

利用可能な `$mode` オプション:

- `'parent'` - `lft` フィールドと `rght` フィールドを更新するために、
  既存の `parent_id` を使用
- `'tree'` - `parent_id` を更新するために、既存の `lft` フィールドと
  `rght` フィールドを使用

`mode='parent'` の時に利用可能な `missingParentActions` オプション:

- `null` - 何もしないで継続する
- `'return'` - 何もしないで返す
- `'delete'` - ノードを削除
- `int` - parent_id に、この ID を設定

例:

``` php
// parent_id を元に全ての左右のフィールドを再構築します
$this->Category->recover();
// または
$this->Category->recover('parent');

// 左右のフィールドを元に全ての parent_id を再構築します
$this->Category->recover('tree');
```

`method` TreeBehavior::**reorder**($options = array())

ツリー構造のデータ中のノード (と子ノード) を、パラメータで定義されたフィールドと
指示によって、もう一度並び替えます。このメソッドは、全てのノードの親を変更しません。

デフォルトでは、並び替えは、ツリーの全てのノードに影響しますが、
以下のオプションが処理に影響します。

- `'id'` - このノード以下を並び替えます
- `'field`' - 並び替えに使用するフィールド。モデルの `displayField`
  がデフォルトです。
- `'order'` - 昇順なら `'ASC'` で、降順なら `'DESC'`
- `'verify'` - 並び替えの前にツリーを検証するかどうか

`$options` は、全ての追加パラメータの設定に使用され、デフォルトでは
以下の利用可能なキーを持ち、それらは全てオプションです。 :

    array(
        'id' => null,
        'field' => $model->displayField,
        'order' => 'ASC',
        'verify' => true
    )

`method` TreeBehavior::**verify**()

ツリー構造の整合性がとれたら `true` を返し、そうでない場合は 、フィールドの
タイプ, 不正なインデックス, エラーメッセージを含む配列です。

出力された配列の各レコードは、(type, id, message) という形式の配列です。

- `type` は `'index'` か `'node'` のどちらか
- `'id'` は間違ったノードの ID
- `'message'` はエラーに依存します

使用例:

``` php
$this->Category->verify();
```

出力結果:

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

## ノードレベル (深さ)

::: info Added in version 2.7
:::

ツリーノードの深さを知ることは、例えばメニューを生成するときなど、一定のレベルまで
ノードを検索したい時に役に立ちます。 `level` オプションを使うことで、各ノードの
レベルを保存するフィールドを指定することができます。 :

``` php
public $actsAs = array('Tree' => array(
    'level' => 'level', // デフォルトは null で、レベルは保存しません
));
```

`method` TreeBehavior::**getLevel**($id)

::: info Added in version 2.7
:::

`level` オプションを設定してノードのレベルをキャッシュしていなかったとしても、
このメソッドで特定のノードのレベルを取得することができます。
