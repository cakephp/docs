コレクション
############

コンポーネント、ヘルパー、ビヘイビア、タスクは全て、似たような構造と一連の振る舞いを共有しています。
2.0 では、同種のオブジェクトのコレクションとやり取りできる統一 API がそれらに与えられました。
CakePHP のこのコレクションオブジェクトは、アプリケーション内の様々な異なる種類のオブジェクトとの
やり取りにおいて統一された方法を提供します。

以下の例では、コンポーネントを用いることになりますが、コンポーネントに加えてヘルパー、ビヘイビア、
タスクにも同じ振舞いが期待できます。

オブジェクトのロードとアンロード
================================

すべての種類のコレクションにおいて、オブジェクトのロードは ``load()`` メソッドを使えば可能になります。 ::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

あるコンポーネントをロードする時点で、そのコンポーネントがコレクションにロードされていないなら
新しいインスタンスが生成されます。もし既にそのコンポーネントがロードされているなら、
別のインスタンスは新たに生成されません。ロードする際に、コンポーネントに設定を追加することもできます。 ::

    $this->Cookie = $this->Components->load('Cookie', array('name' => 'sweet'));

与えられたキーと値がコンポーネントのコンストラクタに渡されます。このルールの一つの例外は
``className`` です。 ``className`` は、コレクションにおけるオブジェクトのエイリアスとして
用いられる特別なキーです。これにより、クラス名とは別のコンポーネント名を使えるようになり、
コアのコンポーネントを拡張する際に便利です。 ::

    $this->Auth = $this->Components->load(
        'Auth',
        array('className' => 'MyCustomAuth')
    );
    $this->Auth->user(); // 実際には MyCustomAuth::user() が使用されます

オブジェクトのロードの逆を行うこと、それがアンロードするということです。
アンロードされたオブジェクトはメモリから消去され、それによりトリガーされるコールバックを
追加されることもありません。 ::

    $this->Components->unload('Cookie');
    $this->Cookie->read(); // Fatal error.

コールバックのトリガー
======================

コレクションオブジェクトはコールバックをサポートします。トリガーされたコールバックをコレクションが
持っていると、そのメソッドはコレクション内の実行可能（enabled）なすべてのオブジェクトに対して
コールされます。さらに、パラメータをコールバックのループに渡せます。 ::

    $this->Behaviors->trigger('afterFind', array($this, $results, $primary));

上記の ``$this`` は全てのビヘイビアの afterFind メソッドに第一引数として渡されます。
コールバックの起動の仕方を制御できる様々なオプションがあります:

- ``breakOn`` で、コールバックの伝播を停止させるための値（一つでも複数でも好きなだけ）をセットします。
  停止条件はスカラー値でも配列でも構いません。デフォルトは ``false``

- ``break`` で停止できるかどうかを設定します。トリガーが破棄されたときは最後の戻り値が戻されます。
  ``collectReturn`` と組み合わせて用いられたときは、複数の結果がまとめて返されます。
  デフォルトは ``false``

- ``collectReturn`` 各々のオブジェクトの戻り値を配列に格納するために true をセットします。
  この配列は trigger() メソッドの呼び出しから返されます。デフォルトは ``false``

- ``triggerDisabled`` は、コレクション内の無効化したオブジェクトに対してさえも全てコールバックを
  トリガーします。デフォルトは ``false``

- ``modParams`` は、コールバックに渡された各オブジェクトに、次のオブジェクトへ渡されるパラメータに
  変更を加えることを許可します。modParams を整数値に設定している場合、それをインデックスとした
  パラメータに対する変更を許可します。非 NULL の値なら何であれ、そのインデクスが指し示すパラメータの
  変更を許可します。デフォルトは ``false``

コールバックループのキャンセル
------------------------------

``break`` や ``breakOn`` オプションを用いることで、コールバックループを
JavaScript におけるイベント伝播を停止させるような感じで途中でキャンセルすることができます。 ::

    $this->Behaviors->trigger(
        'beforeFind',
        array($this, $query),
        array('break' => true, 'breakOn' => false)
    );

上の例では、全てのビヘイビアが beforeFind メソッドから ``false`` を返すなら、
それ以上コールバックが呼ばれることはありません。ちなみに、 ``trigger()`` の戻り値は false になるはずです。

オブジェクトの有効化と無効化
============================

一度コレクションにロードしたオブジェクトを無効化したくなることがあるかもしれません。
コレクション内のオブジェクトを無効化することで、それ以降、 ``triggerDisabled``
オプションを用いない場合のコールバックの発火を防ぎます。 ::

    // HtmlHelper を無効化
    $this->Helpers->disable('Html');

    // その後、そのヘルパーを再有効化
    $this->Helpers->enable('Html');


無効化されたオブジェクトはまだそれらの通常のメソッドとプロパティを持っています。
有効状態と無効状態の根本的な違いはコールバックに関してです。 ``enabled()`` メソッドを用いることで、
有効オブジェクトに何があるのかを問い合わせたり、特定のオブジェクトがまだ有効であるのかを
チェックできます。 ::

    // あるヘルパーが有効かどうかをチェックします
    $this->Helpers->enabled('Html');

    // $enabled はこの時点で有効なヘルパーの配列です
    $enabled = $this->Helpers->enabled();

オブジェクトのコールバックのプロパティ
======================================

イベントコールバックに対して行うのと同じように、オブジェクトコールバックをトリガーする順番を指定できます。
プライオリティ値とトリガーの順番との取り扱いは :ref:`ここ <event-priorities>` の説明と同じです。
宣言時にプライオリティを設定できる方法は次に示します。 ::

    class SomeController {
        public $components = array(
            'Foo', //Foo はデフォルトのプライオリティ 10 を持ちます
            // Bar のコールバックは Foo の前にトリガーされます
            'Bar' => array('priority' => 9)
        );

        public $helpers = array(
            // Cache のコールバックは最後にトリガーされます
            'Cache' => array('priority' => 12), 
            'Asset',
            'Utility' //Utility は Asset と同じプライオリティ 10 を持ち、そのコールバックは
                      //Asset のものよりあとにトリガーされます
        );
    }


    class Post {
        public $actsAs = array(
            'DoFirst' => array('priority' => 1),
            'Media'
        );
    }

コレクションへ動的にオブジェクトをロードした場合、こんな感じでプライオリティを指定できます。 ::

    $this->MyComponent = $this->Components->load(
        'MyComponent',
        array('priority' => 9)
    );


``ObjectCollection::setPriority()`` メソッドを用いることで、実行時にプライオリティを変更できます。 ::

    //オブジェクトがひとつの場合
    $this->Components->setPriority('Foo', 2);

    //オブジェクトが複数の場合
    $this->Behaviors->setPriority(array('Object1' => 8, 'Object2' => 9));


.. meta::
    :title lang=ja: コレクション
    :keywords lang=ja: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
