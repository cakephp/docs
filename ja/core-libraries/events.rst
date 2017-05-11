イベントシステム
################

メンテナンス性の高いアプリケーションの創造は、科学でもあり芸術でもあります。
良く知られていることですが、高い品質のコードを保持するための鍵は、
オブジェクトが疎結合すると同時に、高い凝集度も合わせ持つということです。
結合が疎であるということが、あるクラスがいかに少ししか外部のオブジェクトに "束縛されて" おらず、
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
================

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

    // Cart/Model/Table/OrdersTable.php
    namespace Cart\Model\Table;

    use Cake\Event\Event;
    use Cake\ORM\Table;

    class OrdersTable extends Table
    {

        public function place($order)
        {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);
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

CakePHP の中でイベントはイベントマネージャーに対して動作します。イベントマネージャーは、
全てのモデル、ビュー、コントローラの中で ``getEventManager()`` を使用して取得されます。 ::

    $events = $this->eventManager();

ビューやコントローラで共有している各モデルは独立したイベントマネージャーを持ちます。
これは、モデルイベントを自分自身に含むことができ、もし必要であれば、
ビューで作成されたイベントをコンポーネントやコントローラに対して作用させることができます。

グローバルイベントマネージャー
------------------------------

インスタンスレベルのイベントマネージャーに加えて、 CakePHP はアプリケーション内で起こる
任意のイベントを受け取ることができるグローバルイベントマネージャーを提供します。
これは、面倒で難しい具体的なインスタンスに対してリスナーをアタッチする時に便利です。
グローバルマネージャーは :php:class:`Cake\\Event\\EventManager` のシングルトンインスタンスです。
グローバルディスパッチャに登録されたリスナーは、同じ優先度でインスタンスのリスナーよりも前に実行されます。
静的メソッドを使用してグローバルマネージャーにアクセスすることができます。 ::

    // イベントの前に実行される任意の設定ファイルやコードの一部の中で
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Model.Order.afterPlace',
        $aCallback
    );

重要なことは、同じ名前で異なる内容を持っているイベントがあることを考慮すべきということです。
そして、グローバルに割り当てられた任意の機能の中のバグを防ぐためにイベントオブジェクトを
チェックすることがいつも必要です。グローバルマネージャーを使用する柔軟性により、
複雑さが増すことに注意してください。

:php:meth:`Cake\\Event\\EventManager::dispatch()` メソッドは、引数として
イベントオブジェクトを受け取り、すべてのリスナーとコールバックにこのオブジェクトを
伝達させながら通知します。リスナーは、 ``afterPlace`` イベントの余分なロジックをすべて処理し、
時間を記録したり、メールを送信したり、別のオブジェクトにユーザー統計を更新したり、必要に応じて
オフラインタスクに委任することもできます。

.. _tracking-events:

イベントの追跡
--------------

特定の ``EventManager`` から実行されるイベントのリストを維持するために、
イベントの追跡を有効にすることができます。これを行うには、マネージャーに
:php:class:`Cake\\Event\\EventList` を登録してください。 ::

    EventManager::instance()->setEventList(new EventList());

マネージャーでイベントを実行した後は、イベントリストからそれを取得することができます。 ::

    $eventsFired = EventManager::instance()->getEventList();
    $firstEvent = $eventsFired[0];

追跡は、イベントリストを削除したり、 :php:meth:`Cake\\Event\\EventList::trackEvents(false)`
を呼ぶことで無効にできます。

.. versionadded:: 3.2.11
    イベント追跡と :php:class:`Cake\\Event\\EventList` が追加されました。

コアイベント
============

アプリケーションが受け取れるフレームワーク内のコアイベントが沢山あります。
CakePHP の各レイヤーで、アプリケーションで使用できるイベントを発行します。

* :ref:`ORM/Model イベント <table-callbacks>`
* :ref:`コントローライベント <controller-life-cycle>`
* :ref:`ビューイベント <view-events>`

.. _registering-event-listeners:

リスナーの登録
==============

リスナーは、イベントのためにコールバックを登録するための好ましい方法です。
これは、コールバックをいくつか登録したいとあなたが望む任意のクラスに対し
:php:class:`Cake\\Event\\EventListenerInterface` インターフェイスを
実装することによって実現されます。
このインターフェイスを実装しているクラスは、 ``implementedEvents()`` メソッドを提供し、
クラスが処理するすべてのイベント名を持つ連想配列を返す必要があります。

それでは先ほどの例につづき、ユーザーの購入履歴を計算しグローバルサイトの統計をまとめる役割を果たす
UserStatistic クラスがあると仮定しましょう。これは、リスナークラスを使うとても良い機会です。
一ヶ所に統計ロジックを集中することでき、イベントに対して必要な反応ができます。
``UserStatistics`` リスナーは以下のように開始します。 ::

    use Cake\Event\EventListenerInterface;

    class UserStatistic implements EventListenerInterface
    {

        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            ];
        }

        public function updateBuyStatistic($event, $order)
        {
            // 統計値を更新するコード
        }
    }

    // UserStatistic オブジェクトを Order のイベントマネージャーに追加
    $statistics = new UserStatistic();
    $this->Orders->eventManager()->on($statistics);

上記のコードを見るとわかるように、 ``on()`` 関数は ``EventListener`` インターフェイスの
インスタンスを受け取ります。内部的には、イベント·マネージャーは ``implementedEvents()``
メソッドを使用して、正しいコールバックを追加します。

無名リスナーの登録
------------------

イベントリスナーオブジェクトがリスナーを実装するために一般的に良いやり方ですが、
イベントリスナーとして任意の ``callable`` をバインドすることもできます。例えば、
ログファイルに注文を書き込みたい場合、そのためには無名関数が使えます。 ::

    use Cake\Log\Log;

    $this->Orders->eventManager()->on('Model.Order.afterPlace', function ($event) {
        Log::write(
            'info',
            'A new order was placed with id: ' . $event->getSubject()->id
        );
    });

無名関数に加えてその他の PHP がサポートする呼び出し可能な形式を使用することもできます。 ::

    $events = [
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => [$this->InventoryManager, 'decrement'],
    ];
    foreach ($events as $callable) {
        $eventManager->on('Model.Order.afterPlace', $callable);
    }

特定のイベントをトリガーしないプラグインを操作するときは、
デフォルトのイベントにイベントリスナーを活用することができます。
ユーザーからのお問い合わせフォームを扱う「UserFeedback」プラグインを例にあげましょう。
アプリケーションからは、フィードバックレコードが保存されたことを検知し、最終的には、
それに基づいて行動したいと思います。グローバルな ``Model.afterSave`` イベントを
受け取ることができことができます。ただし、より直接的なアプローチを取ることができ、
本当に必要とするイベントのみ受け取ることができます。 ::

    // 保存操作の前に、以下を作成することが
    // できます。 config/bootstrap.php で、
    use Cake\ORM\TableRegistry;
    // メールを送信する場合
    use Cake\Mailer\Email;

    TableRegistry::get('ThirdPartyPlugin.Feedbacks')
        ->eventManager()
        ->on('Model.afterSave', function($event, $entity)
        {
            // 例えば、管理者のメールを送信することができます。
            $email = new Email('default');
            $email->from('info@yoursite.com' => 'Your Site')
                ->setTo('admin@yoursite.com')
                ->setSubject('New Feedback - Your Site')
                ->send('Body of message');
        });

リスナーオブジェクトをバインドするために、これと同じアプローチを使用することができます。

既存のリスナーとの対話
----------------------

いくつかのイベントリスナーが登録されていると仮定すると、特定のイベントパターンの有無を、
ある動作の基礎として使用できます。 ::

    // EventManager にリスナーを追加
    $this->eventManager()->on('User.Registration', [$this, 'userRegistration']);
    $this->eventManager()->on('User.Verification', [$this, 'userVerification']);
    $this->eventManager()->on('User.Authorization', [$this, 'userAuthorization']);

    // アプリケーションのどこか別の場所で
    $events = $this->eventManager()->matchingListeners('Verification');
    if (!empty($events)) {
        // 'Verification' イベントリスナーが存在する場合のロジックを実行。
        // 例えば、存在するリスナーを削除。
        $this->eventManager()->off('User.Verification');
    } else {
        // 'Verification' イベントリスナーが存在しない場合のロジックを実行。
    }

.. note::

    ``matchingListeners`` メソッドに渡されたパターンは、大文字と小文字が区別されます。

.. versionadded:: 3.2.3

    ``matchingListeners`` メソッドは、検索パターンに一致するイベントの配列を返します。

.. _event-priorities:

優先順位の設定
--------------

いくつかのケースでは、リスナーを実行する順番を制御したいこともあるでしょう。
例としてユーザーの統計情報の場合についてもう一度考えて見ましょう。このリスナーが
スタックの最後に呼び出されることが理想的です。リスナースタックの最後にそれを呼び出すことによって、
イベントがキャンセルされなかったことや、他のリスナーが例外を発生させていないことを確認できます。
他のリスナーがサブジェクトやイベントオブジェクトを変更した場合、
オブジェクトの最終状態を得ることができます。

優先順位は、リスナーに追加する際に整数値として定義されます。数字が大きいほど、
後に実行されるメソッドです。すべてのリスナーのデフォルトの優先度は
``10`` に設定されています。もしメソッドをもっと早く実行したい場合は、このデフォルト値よりも
小さい任意の値を使用することで動作します。逆に、コールバックを他よりもあとに実行させたいなら、
``10`` よりも大きい数字を使用してください。

2つのコールバックが同じ優先順位キューに割り当てられるた場合は、追加された順番に実行されます。
コールバックの優先順位を設定するためには ``on()`` メソッドを用い、 リスナーの優先順位を
設定するためには ``implementedEvent()`` 関数内での宣言を行います。 ::

    // コールバックの優先順位を設定
    $callback = [$this, 'doSomething'];
    $this->eventManager()->on(
        'Model.Order.afterPlace',
        ['priority' => 2],
        $callback
    );

    // リスナーの優先順位を設定
    class UserStatistic implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => [
                    'callable' => 'updateBuyStatistic',
                    'priority' => 100
                ],
            ];
        }
    }

ご覧のとおり、 ``EventListener`` オブジェクトにおける主な違いは、
呼び出し可能なメソッドと優先順位を指定するために配列を使用する必要があるということです。
``callable`` キーはマネージャーがクラス内のどのような関数が呼ばれるべきかを知るために
読み込むであろう、特別な配列エントリです。

イベントデータを関数のパラメータとして取得
------------------------------------------

イベントがそのコンストラクタに渡されたデータを持っている場合、渡されたデータは、
リスナーの引数に変換されます。ビュー層の afterRender のコールバックの例です。 ::

    $this->eventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

``View.afterRender`` コールバックのリスナーは、次のシグネチャを持つ必要があります。 ::

    function (Event $event, $viewFileName)

イベントコンストラクタに渡される各値は、データ配列に表示されている順序で関数のパラメータに変換されます。
連想配列を使用する場合は、 ``array_values`` の結果が、関数の引数の順序を決定します。

.. note::

    2.x とは異なり、リスナーの引数にイベントデータを変換することは、デフォルトの振る舞いで、
    無効にすることはできません。

イベントのディスパッチ
======================

一度、イベントマネージャーのインスタンスを取得すると、
:php:meth:`~Cake\\Event\\EventManager::dispatch()` メソッドを使って
イベントをディスパッチできます。このメソッドは :php:class:`Cake\\Event\\Event`
クラスのインスタンスを受け取ります。さぁ、イベントをディスパッチしてみましょう。 ::

    // イベントをディスパッチする前に、イベントリスナーをインスタンス化する必要があります。
    // 新しいイベントの作成とディスパッチ。
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->eventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` は、コンストラクタに3つの引数を受け取ります。
最初のものはイベント名で、読みやすくすると同時にできるだけ唯一性を維持することを心掛けてください。
次のような規則をお勧めします: レイヤーレベルで発生する一般的なイベントのための
``Layer.eventName`` (例えば ``Controller.startup``, ``View.beforeRender``) 、そして、
あるレイヤーの特定のクラスで発生するイベントのための ``Layer.Class.eventName`` 、
例えば ``Model.User.afterRegister`` や ``Controller.Courses.invalidAccess`` です。


2番目の引数は ``subject`` です。サブジェクトとはイベントに関連付けられているオブジェクトを意味し、
通常それ自身に関するイベントをトリガーしているものと同じクラスであり、
``$this`` の使用が一般的なケースとなります。とは言え、コンポーネントが
コントローライベントをトリガーしたりもできます。サブジェクトクラスは重要です。
なぜなら、リスナーがオブジェクトのプロパティへの即時アクセスを取得し、
それらを動的に検査したり変更するチャンスを持てるようになるからです。

最後に、3番目の引数はイベントのパラメータです。これは、リスナーがそれに基づいて
行動できるようにするための任意のデータです。これは、どのような型の引数でも指定できますが、
検査を容易にするために連想配列を渡すことをお勧めします。

:php:meth:`~Cake\\Event\\EventManager::dispatch()` メソッドは、引数として
イベントオブジェクトを受け取り、すべてのリスナーとコールバックにこのオブジェクトを
伝達させながら通知します。

.. _stopping-events:

イベントの中止
--------------

DOM イベントのように、追加のリスナーへ通知されることを防ぐためにイベントを中止したいときが
あるかもしれません。それ以上処理を進めることができないことをコードが検出した時に保存操作を
中止できるモデルのコールバック (例えば beforeSave) の動作から分かります。

イベントを中止するためには、コールバックで ``false`` を返すか、またはイベントオブジェクトで
``stopPropagation()`` メソッドを呼び出すかのいずれかを行うことができます。 ::

    public function doSomething($event)
    {
        // ...
        return false; // イベントを中止
    }

    public function updateBuyStatistic($event)
    {
        // ...
        $event->stopPropagation();
    }

イベントの中止は追加のコールバックが呼び出される事を妨げます。それに加え、イベントを発生させるコードは、
イベントが中止させられるかそうでないかを元に振る舞いを変えることができます。一般的に、イベントの
'後 (*after*)' に中止することに意味はありませんが、 イベントの '前 (*before*)' に中止する事は、
全ての操作が起こる事を防止するためにしばしば使用されます。

イベントが中止されたかどうかを確認するには、イベントオブジェクトの ``isStopped()``
メソッドを呼び出します。 ::

    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->eventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

上記の例では、イベントが ``beforePlace`` の処理の間に中止した場合は、注文内容は保存されません。

イベントの結果の取得
--------------------

コールバックが null や false 以外の値を返すたびに、それはイベントオブジェクトの
``$result`` プロパティに格納されます。これは、コールバックでイベントの実行を変更したい時に便利です。
再び ``beforePlace`` を例にとり、コールバックが ``$order`` データを変更してみましょう。

イベントの結果は、イベントオブジェクトの result プロパティを直接用いるか、
またはコールバック自体の値を返すことで変更できます。 ::

    // リスナーコールバック
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;
        return $alteredData;
    }

    // 別のリスナーコールバック
    public function doSomethingElse($event)
    {
        // ...
        $event->setResult(['order' => $alteredData] + $this->result());
    }

    // イベントの結果を使用
    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->eventManager()->dispatch($event);
        if (!empty($event->getResult()['order'])) {
            $order = $event->getResult()['order'];
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

任意のイベントオブジェクトのプロパティを変更し、次のコールバックに渡された
新たなデータを有することが可能です。ほとんどの場合、オブジェクトが
イベントデータまたは結果として提供され、オブジェクトを直接変更することは、
参照が同じに保たれ、すべてのコールバック呼び出しで変更が共有されるため、
最適なソリューションです。

コールバック及びリスナーの削除
------------------------------

何らかの理由でイベントマネージャーから任意のコールバックを削除したい場合は、
:php:meth:`Cake\\Event\\EventManager::off()` を引数の最初の2つのパラメータを
追加のときと同様の用い方で呼び出すだけで良いです。 ::

    // 関数の追加
    $this->eventManager()->on('My.event', [$this, 'doSomething']);

    // 関数の削除
    $this->eventManager()->off('My.event', [$this, 'doSomething']);

    // 無名関数の追加
    $myFunction = function ($event) { ... };
    $this->eventManager()->on('My.event', $myFunction);

    // 無名関数の削除
    $this->eventManager()->off('My.event', $myFunction);

    // EventListener の追加
    $listener = new MyEventLister();
    $this->eventManager()->on($listener);

    // リスナーから単一のイベントキーを削除
    $this->eventManager()->off('My.event', $listener);

    // リスナーで実装された全てのコールバックを削除
    $this->eventManager()->off($listener);

イベントはあなたのアプリケーション内の関心事を分離させる偉大な方法であり、
クラスに凝集と疎結合の両方をもたらします。イベントは、アプリケーションコードの疎結合や
拡張可能なプラグインの作成に利用できます。

偉大な力には偉大な責任が伴うことを心に留めておいてください。イベントを利用すればするほど、
デバッグが難しくなり、追加の結合テストが必要になります。

その他の情報
============

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`


.. meta::
    :title lang=ja: イベントシステム
    :keywords lang=ja: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
