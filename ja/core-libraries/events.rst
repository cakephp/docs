イベントシステム
################

.. versionadded:: 2.1

メンテナンス性の高いアプリケーションの創造は、科学でもあり芸術でもあります。
良く知られていることですが、高い品質のコードを保持するための鍵は、
オブジェクトが疎結合すると同時に、高い凝集度も合わせ持つということです。
結合が疎であるということが、あるクラスがいかに少ししか外部のオブジェクトに "束縛されて" おらず
どの程度そのクラスがそれらの外部オブジェクトに依存しているかの指標となる一方で、
高い凝集度は、クラスの全てのメソッドおよびプロパティがそのクラス自身と強く関連を持ちつつ
他のオブジェクトがやるべき仕事をしようとはしないということを意味します。

凝集度が失われ、クラスの結合度が増加してしまわないように、依存関係をガチガチにコードすることなく
システム内の別の箇所とクリーンにやりとりすることが必要な場面も確かにあります。
Observer パターンを使用すると、オブジェクトがイベントを発生させることができ、
無名のリスナーに対して内部状態の変化について通知することができるので、
この目的を達成するのに便利なパターンです。

Observer パターンにおけるリスナーは、そのようなイベントを受信することが可能で、
それらに基づいて振る舞いを選択したり、サブジェクトの状態を変更したり、
単に何かを記録したりします。もしあなたがすでに JavaScript を使っていたなら、
すでにイベント駆動プログラミングに親しんでいることでしょう。

CakePHP は、jQuery などの一般的な JavaScript フレームワークにおいてイベントがトリガーされ
管理される方法のいくつかの側面をエミュレートします。CakePHP の実装においてイベントオブジェクトは、
全てのリスナーに行き渡ります。イベントオブジェクトは、イベントに関する情報を持ち、任意のポイントで
イベントの伝播を止めることができます。リスナーは自分自身を登録することが可能であるか、もしくは
他のオブジェクトにそのタスクを委任することができ、まだ実行されていないコールバックのために、
状態とイベント自体を変更する機会を持ちます。

イベントシステムは、モデル・ビヘイビア・コントローラ・ビュー・ヘルパーのコールバックの心臓部に
あたります。もし、あなたがこれらをいつも使用しているなら、すでにある程度、CakePHP のイベントに
親しんでいることになります。

イベントの使用例
=================

ショッピングカートプラグインを構築していて、注文ロジックの操作を行いたい場合を考えてみましょう。
ユーザーへのメール送信や在庫から商品を減らすことをショッピングのロジックに含めたくはありません。
しかし、これらはプラグインを使用する人にとって重要なタスクです。もし、イベントを使用しないなら、
これをモデルにビヘイビアを適用したり、コントローラにコンポーネントを追加することで実装しようと
するかもしれません。そうすることは、外部でビヘイビアをロードしたりプラグインコントローラに
フックを取り付けるためにコードを用意しなくてはならないので、多くの時間を費やすことを意味します。

一方、コードの関心事を明確に分離するためにイベントを使用することができます。そして、
イベントを使用しているプラグインにフックする関心事を追加することができます。
例えば、カートプラグイン中に、注文の作成を処理する Order モデルがあるとします。
このアプリケーションで注文が作成される合間に通知したい。そんな時、 Order モデルを
綺麗に保つためにイベントを使用できます。 ::

    // Cart/Model/Order.php
    App::uses('CakeEvent', 'Event');
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $event = new CakeEvent('Model.Order.afterPlace', $this, array(
                    'order' => $order
                ));
                $this->getEventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

上記のコードは、注文が作成されていることをアプリケーションの別のパーツに通知することを簡単にできます。
例えば、メール通知の送信、在庫の更新、ログに関する分析、その他のタスクのような関心ごとに注目した
独立したオブジェクトの中で実行することができます。

イベントマネージャーへのアクセス
================================

CakePHP の中でイベントはイベントマネージャに対して動作します。イベントマネージャーは、
全てのモデル、ビュー、コントローラの中で ``getEventManager()`` を使用して取得されます。 ::

    $events = $this->getEventManager();

ビューやコントローラで共有している各モデルは独立したイベントマネージャを持ちます。
これは、モデルイベントを自分自身に含むことができ、もし必要であれば、
ビューで作成されたイベントをコンポーネントやコントローラに対して作用させることができます。


グローバルイベントマネージャー
------------------------------

インスタンスレベルのイベントマネージャーに加えて、 CakePHP はアプリケーション内で起こる
任意のイベントを受け取ることができるグローバルイベントマネージャを提供します。
これは、面倒で難しい具体的なインスタンスに対してリスナーをアタッチする時に便利です。
グローバルマネージャーは、 :php:class:`CakeEventManager` のシングルトンインスタンスです。
イベントがディスパッチされた時、優先順位に従ってグローバルとインスタンスの両方のレベルのリスナーに
ディスパッチされます。あなたは、スタティックメソッドを使用してグローバルマネージャーにアクセスできます。 ::

    // In any configuration file or piece of code that executes before the event
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach(
        $aCallback,
        'Model.Order.afterPlace'
    );

重要なことは、同じ名前で異なる内容を持っているイベントがあることを考慮すべきということです。
そして、グローバルに割り当てられた任意の機能の中のバグを防ぐためにイベントオブジェクトを
チェックすることがいつも必要です。グローバルマネージャーを使用することで柔軟になることで、
複雑さが増すことに注意してください。

.. versionchanged:: 2.5

    2.5 より前は、グローバルマネージャーのリスナーは、分割されたリストに保持され、
    インスタンスリスナーより **前に** 実行されていました。 2.5 以降は、グローバルインスタンスも
    インスタンスリスナーも優先順位に従って実行されます。

イベントのディスパッチ
----------------------

一度、イベントマネージャのインスタンスを取得すると、 :php:meth:`~CakeEventManager::dispatch()`
メソッドを使ってイベントをディスパッチできます。このメソッドは :php:class`CakeEvent` クラスの
インスタンスを受け取ります。さぁ、イベントをディスパッチしてみましょう。 ::

    // Create a new event and dispatch it.
    $event = new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->getEventManager()->dispatch($event);

:php:class:`CakeEvent` は、そのコンストラクタに3つの引数を受け取ります。最初のものはイベント名で、
読みやすくすると同時にできるだけ唯一性を維持することを心掛けてください。
我々は次のような規則を提案します： レイヤーレベルで発生する一般的なイベントのためには
``Layer.eventName`` と言う記述方法 (例. ``Controller.startup``, ``View.beforeRender``) を、
そして あるレイヤーの特定のクラスで発生するイベントのためには
``Layer.Class.eventName`` 例えば ``Model.User.afterRegister`` や
``Controller.Courses.invalidAccess`` と言う記述方法を。

2つ目の引数は ``subject`` です。サブジェクトとはイベントに関連付けられているオブジェクトを意味し、
通常それ自身に関するイベントをトリガーしているものと同じクラスであり、
``$this`` の使用が一般的なケースとなります。とは言え、:php:class:`Component` が
コントローライベントをトリガしたりもできます。サブジェクトクラスは重要です。
なぜなら、リスナーがオブジェクトのプロパティへの即時アクセスを取得し、
それらをその場で検査したり変更するチャンスを持てるようになるからです。

最後に、3番目の引数はイベントのパラメータです。これは、リスナーがそれに基づいて
行動できるようにするための任意のデータです。これは、どのような型の引数でも指定できますが、
検査を容易にするために連想配列を渡すことをお勧めします。

:php:meth:`CakeEventManager::dispatch()` メソッドは、引数としてイベントオブジェクトを受け取り、
すべてのリスナーとコールバックにこのオブジェクトを伝達させながら通知します。

リスナーの登録
--------------

リスナーは、イベントのためにコールバックを登録する選択肢の一つでありとてもクリーンな方法です。
これは、コールバックをいくつか登録したいとあなたが望む任意のクラスに対し
:php:class:`CakeEventListener` インターフェイスを実装することによって実現されます。
このインターフェイスを実装しているクラスは、 ``implementedEvents()`` メソッドを提供し、
クラスが処理するすべてのイベント名を持つ連想配列を返す必要があります。

それでは先ほどの例につづき、ユーザーの購入履歴を計算しグローバルサイトの統計をまとめる役割を果たす
UserStatistic クラスがあると仮定しましょう。これは、リスナークラスを使うとても良い機会です。
一ヶ所に統計ロジックを集中することでき、イベントに対して必要な反応ができます。
``UserStatistics`` リスナーは以下のように開始します。 ::

    // In app/Lib/Event/UserStatistic.php
    App::uses('CakeEventListener', 'Event');

    class UserStatistic implements CakeEventListener {

        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            );
        }

        public function updateBuyStatistic($event) {
            // Code to update statistics
        }
    }

    // In a controller or somewhere else where $this->Order is accessible
    // Attach the UserStatistic object to the Order's event manager
    $statistics = new UserStatistic();
    $this->Order->getEventManager()->attach($statistics);

上記のコードを見るとわかるように、 ``attach`` 関数は ``CakeEventListener`` インターフェイスの
インスタンスを操ることができます。内部的には、イベント·マネージャーは ``implementedEvents``
メソッドが返す配列を読み取り、ただちにコールバックを結びつけます。

グローバルリスナーの登録
-------------------------

上記の例に見られるように、イベントリスナーは慣例的に ``app/Lib/Event`` に配置されます。
この規約に従うことで、リスナークラスの設置が容易になります。また、アプリケーションの
ブートストラッププロセスの間にグローバルリスナーのアタッチを推奨します。 ::

    // In app/Config/bootstrap.php

    // Load the global event listeners.
    require_once APP . 'Config' . DS . 'events.php'

カートアプリのイベントのブートストラップファイルの例は以下の通りです。 ::

    // In app/Config/events.php

    // Load event listeners
    App::uses('UserStatistic', 'Lib/Event');
    App::uses('ProductStatistic', 'Lib/Event');
    App::uses('CakeEventManager', 'Event');

    // Attach listeners.
    CakeEventManager::instance()->attach(new UserStatistic());
    CakeEventManager::instance()->attach(new ProductStatistic());

無名リスナーの登録
-------------------

イベントリスナーオブジェクトがリスナーを実装するために一般的に良いやり方ですが、
イベントリスナーとして任意の ``callable`` をバインドすることもできます。例えば、
ログファイルに注文を書き込みたかったとすると、そのためには無名関数が使えました。 ::

    // Anonymous functions require PHP 5.3+
    $this->Order->getEventManager()->attach(function($event) {
        CakeLog::write(
            'info',
            'A new order was placed with id: ' . $event->subject()->id
        );
    }, 'Model.Order.afterPlace');

無名関数に加えてその他の PHP がサポートする呼び出し可能な形式を使用することもできます。 ::

    $events = array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
    );
    foreach ($events as $callable) {
        $eventManager->attach($callable, 'Model.Order.afterPlace');
    }

.. _event-priorities:

プライオリティの設置
--------------------

いくつかのケースでは、コールバックを実行させて他の実行済みのコールバックとの前後関係を
明らかにしたいと思うでしょう。例としてユーザーの統計情報の場合についてもう一度考えて見ましょう。
このメソッドを実行させる意義があるのは、イベントはキャンセルされておらず、エラーもなく、
その他のコールバックが注文の状態そのものを変更させていないことが明らかになった時に限られます。
このような場合、プライオリティを用います。

プライオリティは、リスナーに追加する際に整数値として定義されます。数字が大きいほど、
後に実行されるメソッドです。すべてのコールバックとリスナメソッドのデフォルトの優先度は
``10`` に設定されています。もしメソッドをもっと早く実行したい場合は、このデフォルト値よりも
小さい任意の値を使用することで動作します。逆に、コールバックを他よりもあとに実行させたいなら、
``10`` よりも大きい数字を使用してください。

2つのコールバックが同じプライオリティキューに割り当てられるた場合は、アタッチされた順番に
実行されます。コールバックのプライオリティを設定するためには ``attach`` メソッドを用い、
リスナーのプライオリティを設定するためには ``implementedEvent`` 関数内での宣言を行います::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach(
        $callback,
        'Model.Order.afterPlace',
        array('priority' => 2)
    );

    // Setting priority for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array(
                    'callable' => 'updateBuyStatistic',
                    'priority' => 100
                ),
            );
        }
    }

ご覧のとおり、 ``CakeEventListener`` オブジェクトにおける主な違いは、
呼び出し可能なメソッドとプライオリティを指定するために配列を使用する必要があるということです。
``callable`` キーはマネージャーがクラス内のどのような関数が呼ばれるべきかを知るために読み込むであろう、
特別な配列エントリです。

イベントを関数のパラメータとして受け取る
----------------------------------------

デフォルトでリスナーがそれらの唯一のパラメータとしてイベントオブジェクトを受け取ります。
もし、イベントオブジェクトへのアクセスが必要ないイベントを作成していて、
イベントデータを関数のパラメータとして渡したくなるかもしれません。この機能は、
後方互換性を保つために CakePHP が実行するコールバックによって使用されます。

この機能を有効にしたい場合、プライオリティの設定でやったのと同じように、 ``attach`` メソッドの
3番目の引数に ``passParams`` オプションを追加するか ``implementedEvents`` が返す配列に
それを宣言する必要があります::

    // Enabling passed parameters mode for an anonymous listener
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach(
        $callback,
        'Model.Order.afterPlace',
        array('passParams' => true)
    );

    // Enabling passed parameters mode for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array(
                    'callable' => 'updateBuyStatistic',
                    'passParams' => true
                ),
            );
        }

        public function updateBuyStatistic($orderData) {
            // ...
        }
    }

上記のコードでは ``doSomething`` 関数と ``updateBuyStatistic`` メソッドは ``$event`` オブジェクト
の代わりに ``$orderData`` を受け取ることになります。これは、先ほどの例において、
いくつかのデータを伴って ``Model.Order.afterPlace`` イベントをトリガするからです::

    $event = new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->getEventManager()->dispatch($event);

.. note::
  イベントデータが配列の場合にのみ、このパラメータは関数の引数として渡すことができます。
  他のどのようなデータ型も関数のパラメータに変換することはできません。という訳で、
  ほとんどの場合においてこの選択肢を用いないことが最適な選択となります。

イベントの中止
--------------

DOM イベントのように、追加のリスナーへ通知されることを防ぐためにイベントを中止したいときが
あるかもしれません。それ以上処理を進めることができないことをコードが検出した時に保存操作を
中止できるモデルのコールバック (例えば beforeSave) の動作から分かります。

イベントを中止するためには、コールバックで ``false`` を返すか、またはイベントオブジェクトで
``stopPropagation`` メソッドを呼び出すかのいずれかを行うことができます::

    public function doSomething($event) {
        // ...
        return false; // stops the event
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

イベントの中止は追加のコールバックが呼び出される事を妨げます。それに加え、イベントを発生させるコードは、
イベントが中止させられるかそうでないかを元に振る舞いを変えることができます。一般的に、イベントの
'後 (*after*)' に中止することに意味はありませんが、 イベントの '前 (*before*)' に中止する事は、
全ての操作が起こる事を防止するためにしばしば使用されます。

イベントが中止されたかどうかを確認するには、イベントオブジェクトの ``isStopped()``
メソッドを呼び出します::

    public function place($order) {
        $event = new CakeEvent(
            'Model.Order.beforePlace',
            $this, array('order' => $order)
        );
        $this->getEventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

上記の例では、イベントが ``beforePlace`` の処理の間に中止した場合は、注文内容は保存されません。

イベントの結果の取得
--------------------

コールバックが値を返すたびに、それはイベントオブジェクトの ``$result`` プロパティに格納されます。
これは、コールバックでイベントの実行を変更したい時に便利です。
再び ``beforePlace`` を例にとり、コールバックが $order データを変更してみましょう。

イベントの結果は、イベントオブジェクトの result プロパティを直接用いるか、
またはコールバック自体の値を返すことで変更できます::

    // A listener callback
    public function doSomething($event) {
        // ...
        $alteredData = $event->data['order'] + $moreData;
        return $alteredData;
    }

    // Another listener callback
    public function doSomethingElse($event) {
        // ...
        $event->result['order'] = $alteredData;
    }

    // Using the event result
    public function place($order) {
        $event = new CakeEvent(
            'Model.Order.beforePlace',
            $this, array('order' => $order)
        );
        $this->getEventManager()->dispatch($event);
        if (!empty($event->result['order'])) {
            $order = $event->result['order'];
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

あなたもお気づきかも知れませんが、いかなるイベントのオブジェクトであっても変更可能であり、
この新しいデータが次のコールバックに渡されることは明らかです。 ほとんどの場合、
オブジェクトをイベント·データまたは結果として提供し、そのオブジェクトを直接変更することは、
参照が同一に保たれていて変更がすべてのコールバックの呼び出しを超えて共有できるので、
最適なソリューションです。

コールバック及びリスナーの削除
------------------------------

何らかの理由でイベントマネージャーから任意のコールバックを削除したい場合は、
:php:meth:`CakeEventManager::detach()` を引数の最初の2つの変数を attach のときと
同様の用い方で呼び出すだけで良いです::

    // Attaching a function
    $this->getEventManager()->attach(array($this, 'doSomething'), 'My.event');

    // Detaching the function
    $this->getEventManager()->detach(array($this, 'doSomething'), 'My.event');

    // Attaching an anonymous function (PHP 5.3+ only);
    $myFunction = function($event) { ... };
    $this->getEventManager()->attach($myFunction, 'My.event');

    // Detaching the anonymous function
    $this->getEventManager()->detach($myFunction, 'My.event');

    // Attaching a CakeEventListener
    $listener = new MyEventListener();
    $this->getEventManager()->attach($listener);

    // Detaching a single event key from a listener
    $this->getEventManager()->detach($listener, 'My.event');

    // Detaching all callbacks implemented by a listener
    $this->getEventManager()->detach($listener);

最後に
======

イベントはあなたのアプリケーション内の関心事を分離させる偉大な方法であり、
クラスに凝集と疎結合の両方をもたらします。イベントは、アプリケーションコードの疎結合や
拡張可能なプラグインの作成に利用できます。

偉大な力には偉大な責任が伴うことを心に留めておいてください。イベントを利用すればするほど、
デバッグが難しくなり、追加の結合テストが必要になります。

その他の資料
============

.. toctree::
    :maxdepth: 1

    /core-libraries/collections
    /models/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=ja: Events system
    :keywords lang=ja: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
