# ビヘイビア

モデルのビヘイビアは、CakePHP のモデルに定義された機能のうちいくつかをまとめるひとつの方法です。
これを利用すると、継承を必要とせずに、典型的な挙動を示すロジックを分割し再利用することができます。
例としてはツリー (*tree*) 構造の生成があります。ビヘイビアはモデルを拡張するシンプルな、
それでいて強力な方法を提供し、単純なクラス変数を定義することで、モデルに機能を追加することができます。
これによりビヘイビアがモデルから(ビヘイビアがモデリングしたり異なるモデル同士が必要とすると推定できる)
あらゆる余分な(要件定義に含まれないかもしれない)重みを取り除くことができます。

例として、ツリーのような構造的情報を保存するデータベーステーブルにアクセスするモデルを考えます。
ツリー内のノードの削除、追加、移動はテーブルの行の削除、挿入、編集と同じように簡単なわけではありません。
多くのレコードは、要素を移動した後に更新する必要があるかもしれません。一連のツリーを扱うメソッドを
(その機能を必要とする全てのモデルの)基本モデルに作成するのではなく、単にモデルに
`TreeBehavior` を使うようにすることができます。より正確な言い方をすれば、ツリーのように
振る舞えとモデルに命じます。これは振る舞い (*behavior*) をモデルに割り当てる (*attach*) こととして
知られています。たった1行のコードだけで、CakePHP のモデルは基本構造と対話 (*interact*) できる
メソッド群を新たに取得するのです。

CakePHP には既に、ツリー構造、コンテンツ翻訳、アクセス制御リスト用のビヘイビアが付属しています。
言うまでもありませんが、コミュニティの貢献によるビヘイビアが最早 CakePHP Bakery
(<https://bakery.cakephp.org>) で入手できます。
このセクションでは、モデルへのビヘイビア、CakePHP の組み込みのビヘイビアの使い方、独自のビヘイビアの
作成方法といった基本的な使用方法のパターンを紹介します。

本質的に、ビヘイビアは [Mixin](https://ja.wikipedia.org/wiki/Mixin) です。

CakePHP に含まれるいくつかのビヘイビアがあります。それぞれのビヘイビアについて詳しくは、
以下の章をご覧ください。

<!--@include: ../core-libraries/toc-behaviors.md-->
<!-- Include options: start-line: 10 -->

## ビヘイビアの使用

ビヘイビアはモデルのクラス変数 `$actsAs` を通してモデルに割り当てられます。 :

``` php
class Category extends AppModel {
    public $actsAs = array('Tree');
}
```

このサンプルは Category モデルが TreeBehavior を用いて、ツリー構造の中でどのように管理されるかを
示します。ビヘイビアが指定されたら、あたかも元のモデルのメソッドの一部として存在しているかのような、
ビヘイビアによって追加されたメソッドを使用してください。 :

``` php
// ID をセット
$this->Category->id = 42;

// ビヘイビアのメソッド、children() を使用する:
$kids = $this->Category->children();
```

ビヘイビアがモデルに割り当てられる場合に、設定を定義することが必要または可能となるビヘイビアも
あるでしょう。ここでは、基底のデータベーステーブルの「左 (*left*)」と「右 (*right*)」の
フィールド名を TreeBehavior に伝えましょう。 :

``` php
class Category extends AppModel {
    public $actsAs = array('Tree' => array(
        'left'  => 'left_node',
        'right' => 'right_node'
    ));
}
```

また、モデルにはいくつものビヘイビアを割り当てることもできます。例えば、Category モデルが
ツリーとしてだけ振る舞うべき理由はなく、国際化のサポートも必要とするかもしれません:

``` php
class Category extends AppModel {
    public $actsAs = array(
        'Tree' => array(
          'left'  => 'left_node',
          'right' => 'right_node'
        ),
        'Translate'
    );
}
```

これまではモデルのクラス変数を利用してモデルにビヘイビアを付与してきました。
これはビヘイビアがモデルの存続期間を通して割り当てられることになるということです。
しかしながら、実行時にモデルからビヘイビアを「はずす」必要があるかもしれません。では、
前の Category モデルを見てみましょう。このモデルは、Tree としても Translate モデルとしても
振舞いますが、何らかの理由で強制的にTranslateモデルとしての振る舞いを止める必要があるとします:

``` php
// モデルからビヘイビアをはずす:
$this->Category->Behaviors->unload('Translate');
```

すると Category モデルは直ちに翻訳モデルとしての振る舞いを停止します。代わりに、通常のモデル操作:
find・save 等の動作時に翻訳ビヘイビアを無効にする必要があるかもしれません。実際、CakePHP の
モデルのコールバックの動作時にビヘイビアを無効にする方法を見てみます。ビヘイビアをはずす代わりに、
翻訳ビヘイビアへのコールバック通知を停止するようにモデルに指示します。 :

``` php
// ビヘイビアにモデルのコールバックを処理させない
$this->Category->Behaviors->disable('Translate');
```

ビヘイビアがモデルのコールバックを処理しているかどうかを確認する必要があるかもしれません。
もし処理していない場合は、再度動作するように元に戻します。:

``` php
// ビヘイビアはモデルのコールバックを処理していない場合
if (!$this->Category->Behaviors->enabled('Translate')) {
    // 処理の開始をビヘイビアに通知
    $this->Category->Behaviors->enable('Translate');
}
```

実行時にモデルからビヘイビアを完全にはずすことができるように、新しいビヘイビアを割り当てることもできます。
これまでみてきた Category モデルは、Christmas モデルとして振る舞う必要がありますが、それはクリスマスの
日だけです。 :

``` php
// 今日が12月25日だったら
if (date('m/d') === '12/25') {
    // モデルは Christmas モデルとして振る舞う必要がある
    $this->Category->Behaviors->load('Christmas');
}
```

load メソッドを使用して、ビヘイビアの設定を上書きできます。 :

``` php
// すでに割り当てられたビヘイビアのある設定を変更
$this->Category->Behaviors->load('Tree', array('left' => 'new_left_node'));
```

そして、エイリアスを使用することで、ロードするビヘイビアの別名をカスタマイズでき、
異なる設定で複数回ロードすることができます。 :

``` php
// Tree ビヘイビアが 'MyTree' として利用可能
$this->Category->Behaviors->load('MyTree', array('className' => 'Tree'));
```

モデルが割り当てているビヘイビアのリストを取得するメソッドもあります。
メソッドにビヘイビア名を渡すと、ビヘイビアがモデルに割り当たっているかどうかを返します。
何も渡さないと、割り当てられているビヘイビアのリストを返します。 :

``` php
// Translate ビヘイビアが割り当てられていない場合
if (!$this->Category->Behaviors->loaded('Translate')) {
    // モデルに割り当てられているすべてのビヘイビアのリストを取得
    $behaviors = $this->Category->Behaviors->loaded();
}
```

## 独自のビヘイビアの作成

モデルに割り当てられたビヘイビアは自動的にコールバックが呼ばれます。
そのコールバックはモデルで見られるものと似ています:
`beforeFind`, `afterFind`, `beforeValidate`, `afterValidate`,
`beforeSave`, `afterSave`, `beforeDelete`, `afterDelete` ,
`onError` - 詳しくは [コールバックメソッド](../models/callback-methods) をご覧ください。

作成したビヘイビアは `app/Model/Behavior` に置く必要があります。
名前はキャメルケース (*CamelCase*) で接尾語として `Behavior` がつきます。
例えば、NameBehavior.php となります。
独自のビヘイビアを作成する時には、コアのビヘイビアをテンプレートとして用いると便利なときがあります。
コアのビヘイビアは `lib/Cake/Model/Behavior/` にあります。

全てのコールバックとビヘイビアのメソッドは、それが呼び出される元のモデルへの参照を第一引数として
受け取ります。

コールバックの実装に加えて、ビヘイビア毎、モデルとビヘイビアの関連、の両方またはどちらか一方に対して、
設定を追加することができます。設定方法についての詳細はコアビヘイビアとその設定についての章で
見ることができます。

以下はモデルからビヘイビアへ設定を渡す方法を示す簡単な例です:

``` php
class Post extends AppModel {
    public $actsAs = array(
        'YourBehavior' => array(
            'option1_key' => 'option1_value'
        )
    );
}
```

ビヘイビアを使うモデルのインスタンス全てにわたってビヘイビアが共有されることから、
ビヘイビアを使っているエイリアス・モデルの名前ごとに設定を保持することは良い習慣となります。
ビヘイビアが生成されたときに、ビヘイビアの `setup()` メソッドが呼ばれます。 :

``` php
public function setup(Model $Model, $settings = array()) {
    if (!isset($this->settings[$Model->alias])) {
        $this->settings[$Model->alias] = array(
            'option1_key' => 'option1_default_value',
            'option2_key' => 'option2_default_value',
            'option3_key' => 'option3_default_value',
        );
    }
    $this->settings[$Model->alias] = array_merge(
        $this->settings[$Model->alias], (array)$settings);
}
```

## ビヘイビアのメソッドの作成

ビヘイビアのメソッドは、そのビヘイビアを振る舞いをする全てのモデルで自動的に利用可能になります。
例として、以下のようにしたとします:

``` php
class Duck extends AppModel {
    public $actsAs = array('Flying');
}
```

Duck モデルにメソッドあるかのように `FlyingBehavior` のメソッドを呼び出すことができます。
ビヘイビアのメソッドを作成するとき、最初の引数として呼び出すモデルの参照が自動的に渡されます。
他の与えられた引数全ては1つずつ右にずれます。
例を上げます:

``` php
$this->Duck->fly('toronto', 'montreal');
```

このメソッドは２つの引数をとりますが、メソッドの定義は次のようになります:

``` php
public function fly(Model $Model, $from, $to) {
    // 飛ぶことをする。
}
```

ビヘイビアのメソッド内で `$this->doIt()` のようにメソッドを呼ぶと、\$model 引数が
自動的に挿入されないということに注意してください。

### メソッドのマッピング

「mixin」であるメソッドの提供に加えて、ビヘイビアはパターンマッチングによるメソッドもまた提供します。
また、ビヘイビアはマッピングするメソッド (*mapped methods*) も定義できます。
メソッドをマッピングするにあたって、メソッドの機能にパターンマッチングが使われます。
これによりビヘイビアに `Model::findAllByXXX` のようなメソッドを作成することができます。
メソッドのマッピングはビヘイビアの `$mapMethods` 配列に定義されます。
マッピングされたメソッドの定義は普通の mixin なビヘイビアのメソッドとはわずかに違います。 :

``` php
class MyBehavior extends ModelBehavior {
    public $mapMethods = array('/do(\w+)/' => 'doSomething');

    public function doSomething(Model $model, $method, $arg1, $arg2) {
        debug(func_get_args());
        //何かする
    }
}
```

上に記したものは、あらゆる `doXXX()` メソッドの呼び出しをビヘイビアにマッピングします。
見ればわかる通り、モデルは第一引数のままですが、第二引数には呼ばれたメソッドの名前が入ります。
これを用いて、 `Model::findAllByXX` と同じように、補足的な情報としてメソッド名の一部を
使うことができます。上記のビヘイビアがモデルに割り当てられると、次のようなことになります:

``` php
$model->doReleaseTheHounds('karl', 'lenny');

// 以下が出力される
'ReleaseTheHounds', 'karl', 'lenny'
```

## ビヘイビアのコールバック

モデルのビヘイビアはモデルのコールバックと同じ名前で、その前後に呼び出されるコールバックを
いくつか定義できます。ビヘイビアのコールバックにより、割り当てられたモデルのイベントを捕捉したり、
パラメーターの拡張または他のビヘイビアで引き継ぎなどができるようになります。

全てのビヘイビアのコールバックは、モデルのコールバックの **前に** 実行されます:

- `beforeFind`
- `afterFind`
- `beforeValidate`
- `afterValidate`
- `beforeSave`
- `afterSave`
- `beforeDelete`
- `afterDelete`

### ビヘイビアのコールバックの作成

`class` **ModelBehavior**

モデルのビヘイビアのコールバックは単純にビヘイビアクラスのメソッドとして定義されます。
標準のビヘイビアのメソッドと同じく、 `$Model` パラメータを第一引数として受け取ります。
この引数はビヘイビアのメソッドが呼び出されたモデルにあたります。

`method` ModelBehavior::**setup**(Model $Model, array $settings = array())

`method` ModelBehavior::**cleanup**(Model $Model)

`method` ModelBehavior::**beforeFind**(Model $Model, array $query)

`method` ModelBehavior::**afterFind**(Model $Model, mixed $results, boolean $primary = false)

`method` ModelBehavior::**beforeValidate**(Model $Model, array $options = array())

`method` ModelBehavior::**afterValidate**(Model $Model)

`method` ModelBehavior::**beforeSave**(Model $Model, array $options = array())

`method` ModelBehavior::**afterSave**(Model $Model, boolean $created, array $options = array())

`method` ModelBehavior::**beforeDelete**(Model $Model, boolean $cascade = true)

`method` ModelBehavior::**afterDelete**(Model $Model)
