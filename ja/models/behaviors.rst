ビヘイビア
##########

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
:php:class:`TreeBehavior` を使うようにすることができます。より正確な言い方をすれば、ツリーのように
振る舞えとモデルに命じます。これは振る舞い (*behavior*) をモデルに割り当てる (*attach*) こととして
知られています。たった1行のコードだけで、CakePHP のモデルは基本構造と対話 (*interact*) できる
メソッド群を新たに取得するのです。

CakePHP には既に、ツリー構造、コンテンツ翻訳、アクセス制御リスト用のビヘイビアが付属しています。
言うまでもありませんが、コミュニティの貢献によるビヘイビアが最早 CakePHP Bakery
(`https://bakery.cakephp.org <https://bakery.cakephp.org>`_) で入手できます。
このセクションでは、モデルへのビヘイビア、CakePHP の組み込みのビヘイビアの使い方、独自のビヘイビアの
作成方法といった基本的な使用方法のパターンを紹介します。

本質的に、ビヘイビアは `Mixin <http://ja.wikipedia.org/wiki/Mixin>`_ です。

CakePHP に含まれるいくつかのビヘイビアがあります。それぞれのビヘイビアについて詳しくは、
以下の章をご覧ください。

.. include:: /core-libraries/toc-behaviors.rst
    :start-line: 10

ビヘイビアの使用
================

ビヘイビアはモデルのクラス変数 ``$actsAs`` を通してモデルに割り当てられます。 ::

    class Category extends AppModel {
        public $actsAs = array('Tree');
    }

このサンプルは Category モデルが TreeBehavior を用いて、ツリー構造の中でどのように管理されるかを
示します。ビヘイビアが指定されたら、あたかも元のモデルのメソッドの一部として存在しているかのような、
ビヘイビアによって追加されたメソッドを使用してください。 ::

    // ID をセット
    $this->Category->id = 42;

    // ビヘイビアのメソッド、children() を使用する:
    $kids = $this->Category->children();

ビヘイビアがモデルに割り当てられる場合に、設定を定義することが必要または可能となるビヘイビアも
あるでしょう。ここでは、基底のデータベーステーブルの「左 (*left*)」と「右 (*right*)」の
フィールド名を TreeBehavior に伝えましょう。 ::

    class Category extends AppModel {
        public $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

また、モデルにはいくつものビヘイビアを割り当てることもできます。例えば、Category モデルが
ツリーとしてだけ振る舞うべき理由はなく、国際化のサポートも必要とするかもしれません::

    class Category extends AppModel {
        public $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

これまではモデルのクラス変数を利用してモデルにビヘイビアを付与してきました。
これはビヘイビアがモデルの存続期間を通して割り当てられることになるということです。
しかしながら、実行時にモデルからビヘイビアを「はずす」必要があるかもしれません。では、
前の Category モデルを見てみましょう。このモデルは、Tree としても Translate モデルとしても
振舞いますが、何らかの理由で強制的にTranslateモデルとしての振る舞いを止める必要があるとします::

    // モデルからビヘイビアをはずす:
    $this->Category->Behaviors->unload('Translate');

すると Category モデルは直ちに翻訳モデルとしての振る舞いを停止します。代わりに、通常のモデル操作:
find・save 等の動作時に翻訳ビヘイビアを無効にする必要があるかもしれません。実際、CakePHP の
モデルのコールバックの動作時にビヘイビアを無効にする方法を見てみます。ビヘイビアをはずす代わりに、
翻訳ビヘイビアへのコールバック通知を停止するようにモデルに指示します。 ::

    // ビヘイビアにモデルのコールバックを処理させない
    $this->Category->Behaviors->disable('Translate');

ビヘイビアがモデルのコールバックを処理しているかどうかを確認する必要があるかもしれません。
もし処理していない場合は、再度動作するように元に戻します。::

    // ビヘイビアはモデルのコールバックを処理していない場合
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // 処理の開始をビヘイビアに通知
        $this->Category->Behaviors->enable('Translate');
    }

実行時にモデルからビヘイビアを完全にはずすことができるように、新しいビヘイビアを割り当てることもできます。
これまでみてきた Category モデルは、Christmas モデルとして振る舞う必要がありますが、それはクリスマスの
日だけです。 ::

    // 今日が12月25日だったら
    if (date('m/d') === '12/25') {
        // モデルは Christmas モデルとして振る舞う必要がある
        $this->Category->Behaviors->load('Christmas');
    }

load メソッドを使用して、ビヘイビアの設定を上書きできます。 ::

    // すでに割り当てられたビヘイビアのある設定を変更
    $this->Category->Behaviors->load('Tree', array('left' => 'new_left_node'));

そして、エイリアスを使用することで、ロードするビヘイビアの別名をカスタマイズでき、
異なる設定で複数回ロードすることができます。 ::

    // Tree ビヘイビアが 'MyTree' として利用可能
    $this->Category->Behaviors->load('MyTree', array('className' => 'Tree'));

モデルが割り当てているビヘイビアのリストを取得するメソッドもあります。
メソッドにビヘイビア名を渡すと、ビヘイビアがモデルに割り当たっているかどうかを返します。
何も渡さないと、割り当てられているビヘイビアのリストを返します。 ::

    // Translate ビヘイビアが割り当てられていない場合
    if (!$this->Category->Behaviors->loaded('Translate')) {
        // モデルに割り当てられているすべてのビヘイビアのリストを取得
        $behaviors = $this->Category->Behaviors->loaded();
    }

独自のビヘイビアの作成
======================

モデルに割り当てられたビヘイビアは自動的にコールバックが呼ばれます。
そのコールバックはモデルで見られるものと似ています:
``beforeFind``, ``afterFind``, ``beforeValidate``, ``afterValidate``,
``beforeSave``, ``afterSave``, ``beforeDelete``, ``afterDelete`` ,
``onError`` - 詳しくは :doc:`/models/callback-methods` をご覧ください。

作成したビヘイビアは  ``app/Model/Behavior`` に置く必要があります。
名前はキャメルケース (*CamelCase*) で接尾語として ``Behavior`` がつきます。
例えば、NameBehavior.php となります。
独自のビヘイビアを作成する時には、コアのビヘイビアをテンプレートとして用いると便利なときがあります。
コアのビヘイビアは ``lib/Cake/Model/Behavior/`` にあります。

全てのコールバックとビヘイビアのメソッドは、それが呼び出される元のモデルへの参照を第一引数として
受け取ります。

コールバックの実装に加えて、ビヘイビア毎、モデルとビヘイビアの関連、の両方またはどちらか一方に対して、
設定を追加することができます。設定方法についての詳細はコアビヘイビアとその設定についての章で
見ることができます。

以下はモデルからビヘイビアへ設定を渡す方法を示す簡単な例です::

    class Post extends AppModel {
        public $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'
            )
        );
    }

ビヘイビアを使うモデルのインスタンス全てにわたってビヘイビアが共有されることから、
ビヘイビアを使っているエイリアス・モデルの名前ごとに設定を保持することは良い習慣となります。
ビヘイビアが生成されたときに、ビヘイビアの ``setup()`` メソッドが呼ばれます。 ::

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

ビヘイビアのメソッドの作成
==========================

ビヘイビアのメソッドは、そのビヘイビアを振る舞いをする全てのモデルで自動的に利用可能になります。
例として、以下のようにしたとします::

    class Duck extends AppModel {
        public $actsAs = array('Flying');
    }

Duck モデルにメソッドあるかのように ``FlyingBehavior`` のメソッドを呼び出すことができます。
ビヘイビアのメソッドを作成するとき、最初の引数として呼び出すモデルの参照が自動的に渡されます。
他の与えられた引数全ては1つずつ右にずれます。
例を上げます::

    $this->Duck->fly('toronto', 'montreal');

このメソッドは２つの引数をとりますが、メソッドの定義は次のようになります::

    public function fly(Model $Model, $from, $to) {
        // 飛ぶことをする。
    }

ビヘイビアのメソッド内で ``$this->doIt()`` のようにメソッドを呼ぶと、$model 引数が
自動的に挿入されないということに注意してください。

メソッドのマッピング
--------------------

「mixin」であるメソッドの提供に加えて、ビヘイビアはパターンマッチングによるメソッドもまた提供します。
また、ビヘイビアはマッピングするメソッド (*mapped methods*) も定義できます。
メソッドをマッピングするにあたって、メソッドの機能にパターンマッチングが使われます。
これによりビヘイビアに ``Model::findAllByXXX`` のようなメソッドを作成することができます。
メソッドのマッピングはビヘイビアの ``$mapMethods`` 配列に定義されます。
マッピングされたメソッドの定義は普通の mixin なビヘイビアのメソッドとはわずかに違います。 ::

    class MyBehavior extends ModelBehavior {
        public $mapMethods = array('/do(\w+)/' => 'doSomething');

        public function doSomething(Model $model, $method, $arg1, $arg2) {
            debug(func_get_args());
            //何かする
        }
    }

上に記したものは、あらゆる ``doXXX()`` メソッドの呼び出しをビヘイビアにマッピングします。
見ればわかる通り、モデルは第一引数のままですが、第二引数には呼ばれたメソッドの名前が入ります。
これを用いて、 ``Model::findAllByXX`` と同じように、補足的な情報としてメソッド名の一部を
使うことができます。上記のビヘイビアがモデルに割り当てられると、次のようなことになります::

    $model->doReleaseTheHounds('karl', 'lenny');

    // 以下が出力される
    'ReleaseTheHounds', 'karl', 'lenny'

ビヘイビアのコールバック
========================

モデルのビヘイビアはモデルのコールバックと同じ名前で、その前後に呼び出されるコールバックを
いくつか定義できます。ビヘイビアのコールバックにより、割り当てられたモデルのイベントを捕捉したり、
パラメーターの拡張または他のビヘイビアで引き継ぎなどができるようになります。

全てのビヘイビアのコールバックは、モデルのコールバックの **前に** 実行されます:

-  ``beforeFind``
-  ``afterFind``
-  ``beforeValidate``
-  ``afterValidate``
-  ``beforeSave``
-  ``afterSave``
-  ``beforeDelete``
-  ``afterDelete``


ビヘイビアのコールバックの作成
------------------------------

.. php:class:: ModelBehavior

モデルのビヘイビアのコールバックは単純にビヘイビアクラスのメソッドとして定義されます。
標準のビヘイビアのメソッドと同じく、 ``$Model`` パラメータを第一引数として受け取ります。
この引数はビヘイビアのメソッドが呼び出されたモデルにあたります。

.. php:method:: setup(Model $Model, array $settings = array())

    モデルにビヘイビアが割り当てられたときに呼ばれます。
    settings は割り当てられるモデルの ``$actsAs`` プロパティからもたらされます。

.. php:method:: cleanup(Model $Model)

    ビヘイビアがモデルからはずされた時に呼ばれます。
    親のメソッドは ``$model->alias`` に基いてモデルの設定を削除します。
    このメソッドをオーバーライドして独自のクリーンアップ機能を与えることができます。

.. php:method:: beforeFind(Model $Model, array $query)

    ビヘイビアの beforeFind が false をかえすと、find() を中止します。
    配列を返すと、find 操作に使われるクエリ (*query*) 引数を拡張します。

.. php:method:: afterFind(Model $Model, mixed $results, boolean $primary = false)

    afterFind を使って find の結果 (*results*) を拡張することができます。
    返り値はチェイン内の次となるビヘイビアかモデルの afterFind のどちらかに、
    結果として渡されます。

.. php:method:: beforeValidate(Model $Model, array $options = array())

    beforeValidate を使ってモデルの validate 配列を変更したり、その他のバリデーションの前処理の
    ロジックを処理することができます。beforeValidate コールバックから false を返すと、
    バリデーションを中止し、失敗にさせることができます。

.. php:method:: afterValidate(Model $Model)

    もし必要であれば、afterValidate でデータのクリーンアップや準備を実行できます。

.. php:method:: beforeSave(Model $Model, array $options = array())

    ビヘイビアの beforeSave から false を返すことで、save を中止することができます。
    true を返すことで続行を許可します。

.. php:method:: afterSave(Model $Model, boolean $created, array $options = array())

    afterSave を使うことで、ビヘイビアに関するクリーンアップ操作を実行することができます。
    $created はレコードが作成された時に true に、レコードが更新された時に false になります。

.. php:method:: beforeDelete(Model $Model, boolean $cascade = true)

    ビヘイビアの beforeDelete から false を返すことで、削除を中止することができます。
    trueを返すことで続行を許可します。

.. php:method:: afterDelete(Model $Model)

    afterDelete を使うことで、ビヘイビアに関するクリーンアップ操作を実行することができます。


.. meta::
    :title lang=ja: ビヘイビア
    :keywords lang=ja: ツリー操作,操作メソッド,モデルビヘイビア,アクセスコントロールリスト,モデルクラス,ツリー構造,php クラス,ビジネスコンタクト,クラスカテゴリ,データベーステーブル,ベーカリー,継承,機能性,相互作用,ロジック,cakephp,モデル,本質
