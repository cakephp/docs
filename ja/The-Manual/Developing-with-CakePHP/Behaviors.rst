ビヘイビア
##########

モデルのビヘイビアは、CakePHP
のモデル内に定義されたいくつかの機能をまとめる方法です。これを使用すると直接的にはモデルに関係しないかもしれないがそこにおいておく必要があるロジックを分けておくことができます。モデルを拡張するためのシンプルだが強力な方法を提供することで、ビヘイビアを使用すると単純なクラス変数を定義することでモデルに機能を追加できます。たとえば、ビヘイビアを使用してモデルからあらゆる特別な重み（それはモデリングしているビジネス契約の一部ではないかもしれません）を取り除くことができます。あるいは、それは異なる別のモデルで必要とされている、またはそう推定されるかもしれません。

サンプルとしてモデルを考えます。このモデルを使用すると、データベースのテーブルにアクセスし、ツリーのような構造として情報を保存します。ツリー内のノードの削除、追加、変更はテーブルの行の削除、挿入、編集と同じように簡単なわけではありません。モノが移動すると多くのレコードを更新する必要があります。基本となるモデル毎に（その機能を必要とするすべてのモデルに対して）ツリー操作メソッドを作成するのではなく、単に
TreeBehavior
を使用することをモデルに伝えるだけ、あるいはより形式的な用語を使用して、モデルを
Tree
として振舞わせます。これはモデルへの振る舞いの割り当てとして知られています。たった１行のコードだけで、CakePHP
のモデルは一連の新しいメソッドを使用でき、既存の構造と相互に作用します。

CakePHP
は既にツリー構造、内容翻訳、アクセス制御リスト用のビヘイビアが付属しています。いうまでもありませんが、コミュニティの貢献であるビヘイビアがすでに
CakePHP Bakery (https://bakery.cakephp.org)
で入手できます。この章では、基本的な使用方法のパターンを紹介します。モデルへのビヘイビアの追加、CakePHP
の組み込みビヘイビアの使用法、独自ビヘイビアの作り方です。

ビヘイビアを使用する
====================

ビヘイビアは、モデルクラス変数 $actsAs
をとおしてモデルに割り当てられます:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree');
    }

    ?>

この例は、Category モデルが TreeBehavior
を使用してどのようにツリー構造を扱うことができるかを説明しています。ビヘイビアが指定されるたら、あたかも元のモデルの一部として常に存在するかのように、ビヘイビアによって追加されたメソッドを使用します。:

::

    // ID をセットします
    $this->Category->id = 42;

    // ビヘイビアメソッドの children() を使用:
    $kids = $this->Category->children();

ビヘイビアがモデルに割り当てられるる場合に、なんらかのビヘイビアが必要になったり、あるいは設定を定義する必要があるかもしれません。ここでは、"left"
と "right" という名前で TreeBehavior
に基底のデータベーステーブル内のフィールドを指定しています。

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

    ?>

いくつかのビヘイビアをモデルに割り当てることもできます。たとえば、Category
モデルはツリーとしてだけ振る舞うわけではなく、国際化サポートも必要かもしれません。:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

    ?>

これまではモデルクラスの変数を使用してモデルにビヘイビアを追加してきました。
つまり、ビヘイビアはモデルの生成期間中ずっとモデルに割り当てられます。しかし、実行時にモデルからビヘイビアを
"はずす" 必要があるかもしれません。では、前の Category
モデルを見てみましょう。このモデルは、ツリーとしてまた翻訳モデルとしても振る舞います。何らかの理由で翻訳モデルとしてのビヘイビアを停止させる必要があります。:

::

    // モデルからビヘイビアをはずす:
    $this->Category->Behaviors->detach('Translate');

そうすると Category
モデルは直ちに翻訳モデルとしての振る舞いを停止します。
代わりに、通常のモデル操作: find・save
等の動作時に翻訳ビヘイビアを無効にする必要があるかもしれません。実際、CakePHP
のモデルのコールバックの動作時にビヘイビアを無効にする方法を見てみます。ビヘイビアをはずす代わりに、翻訳ビヘイビアへのコールバック通知を停止するようにモデルに指示します:

::

    // ビヘイビアにモデルのコールバックを処理させないようにする
    $this->Category->Behaviors->disable('Translate');

ビヘイビアがモデルのコールバックを処理しているかどうかを確認する必要があるかもしれません。もし処理していない場合は、再度動作するように元に戻します:

::

    // ビヘイビアはモデルのコールバックを処理していない場合
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // 処理するようにする
        $this->Category->Behaviors->enable('Translate');
    }

実行時にモデルからビヘイビアを完全にはずすことができるように、新しいビヘイビアを割り当てることもできます。これまでみてきた
Category モデルは、Christmas
モデルとして振る舞う必要がありますが、それはクリスマスの日だけです:

::

    // 今日が12月25日だったら
    if (date('m/d') == '12/25') {
        // モデルは Christmas モデルとして振る舞う必要がある
        $this->Category->Behaviors->attach('Christmas');
    }

attach メソッドを使用して、ビヘイビアの設定を上書きできます:

::

    // すでに割り当てられたビヘイビアのある設定を変更します
    $this->Category->Behaviors->attach('Tree', array('left' => 'new_left_node'));

モデルが割り当てているビヘイビアのリストを取得するメソッドもあります。メソッドにビヘイビア名を渡すと、ビヘイビアがモデルに割り当たっているかどうかを返します。何も渡さないと、割り当てられているビヘイビアのリストを返します:

::

    // 翻訳ビヘイビアが割り当てられていない場合
    if (!$this->Category->Behaviors->attached('Translate')) {
        // モデルに割あたっているすべてのビヘイビアのリストを取得する
        $behaviors = $this->Category->Behaviors->attached();
    }

独自のビヘイビアを作成する
==========================

This is placeholder content.

Creating behavior methods
=========================

Behavior methods are automatically available on any model acting as the
behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }

You would be able to call FlyingBehavior methods as if they were methods
on your Duck model. When creating behavior methods you automatically get
passed a reference of the calling model as the first parameter. All
other supplied parameters are shifted one place to the right. For
example

::

    $this->Category->fly('toronto', 'montreal');

Although this method takes two parameters, the method signature should
look like:

::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }

Keep in mind that methods called in a ``$this->doIt()`` fashion from
inside a behavior method will not get the $model parameter automatically
appended.
