.. Events System

イベントシステム
################

.. versionadded:: 2.1

..
  Creating maintainable applications is both a science and an art. It is
  well-known that a key for having good quality code is making your objects
  loosely coupled and strongly cohesive at the same time. Cohesion means that
  all methods and properties for a class are strongly related to the class
  itself and it is not trying to do the job other objects should be doing,
  while loosely coupling is the measure of how little a class is "wired"
  to external objects, and how much that class is depending on them.

メンテナンス性の高いアプリケーションの創造は、科学でもあり芸術でもあります。
良く知られていることですが、高い品質のコードを保持するための鍵は、
オブジェクトが疎結合すると同時に、高い凝集度も合わせ持つということです。
結合が疎であるということが、あるクラスがいかに少ししか外部のオブジェクトに "束縛されて" おらず
どの程度そのクラスがそれらの外部オブジェクトに依存しているかの指標となる一方で、
高い凝集度は、クラスの全てのメソッドおよびプロパティがそのクラス自身と強く関連を持ちつつ
他のオブジェクトがやるべき仕事をしようとはしないということを意味します。


..
  While most of the CakePHP structure and default libraries will help you
  achieve this goal, there are certain cases where you need to cleanly communicate
  with other parts in the system without having to hard code those dependencies,
  thus losing cohesion and increasing class coupling. A very successful design
  pattern in software engineering is the Observer pattern, where objects can
  generate events and notify possibly anonymous listeners about changes in the
  internal state.

CakePHPのストラクチャとデフォルトのライブラリの多くがあなたのこのゴールの達成を
手助けしてくれるとは言え、依存関係をガチガチにコードすることなくシステム内の
別の箇所とクリーンにやりとりすることが必要な場面も確かにあり、やがて凝集度は失われ、
クラスの結合度は増加してしまいます。ソフトウェア工学においてまさに成功したデザインパターンと言えるのが、
オブジェクトがイベントを発生させることができ、無名のリスナーに対して内部状態の変化について通知する
Observerパターンです。

..
  Listeners in the observer pattern can subscribe to such events and choose to act
  upon them, modify the subject state or simply log stuff. If you have used
  javascript in the past, the chances are that you are already familiar with event
  driven programming.

Observerパターンにおけるリスナーは、そのようなイベントを受信することが可能で、
それらに基づいて振る舞いを選択したり、サブジェクトの状態を変更したり、
単に何かを記録したりします。もしあなたがすでにjavascriptを使っていたなら、
すでにイベント駆動プログラミングに親しんでいることでしょう。

..
  CakePHP emulates several aspects of how events are triggered and managed in
  popular javascript frameworks such as jQuery, while remaining loyal to its
  object oriented design. In this implementation, an event object is carried
  across all listeners holding the information and the ability to stop the event
  propagation at any point. Listeners can register themselves or can delegate this
  task to other objects and have the chance to alter the state and the event itself
  for the rest of the callbacks.

そのオブジェクト指向設計に忠実なまま、CakePHPは、jQueryなどの一般的なJavaScriptフレームワーク
においてイベントがトリガーされ管理される方法のいくつかの側面をエミュレートします。
この実装においてイベントオブジェクトは、情報と、任意の時点でのイベント伝播を停止させる能力を保持したまま、
全てのリスナーに行き渡ります。リスナーは自分自身を登録することが可能であるか、
もしくは他のオブジェクトにそのタスクを委任することができ、まだ実行されていないコールバックのために、
状態とイベント自体を変更する機会を持ちます。

.. Interacting with the event managers

イベントマネージャーとの対話
============================

..
  Let's suppose you are building a Cart plugin, but you don't really want to mess with
  shipping logic, emailing the user or decrementing the item from the stock,
  it is your wish to handle those things separately in another plugin or in app code.
  Typically, when not directly using the observer pattern you would do this by attaching
  behaviors on the fly to your models, and perhaps some components to the controllers.

さて、あなたが買い物カートのプラグインをビルドしていて、だけど、出荷の仕組み、メールの送信、
在庫を減らすこととかをごちゃまぜにするなんてことは全く望んでおらず、
他のプラグインやアプリケーションコードで個別にそれらの事を処理することを望んでいるとしましょう。
いつもの、それこそObserverパターンを使用しない場合、不断の努力でビヘイビアをモデルに
（ひょっとしたらいくつかのコンポーネントをコントローラに）取り付けることによって、
この望みをかなえるでしょう。

..
  Doing so represents a challenge most of the time, since you would have to come up
  with the code for externally loading those behaviors or attaching hooks to your
  plugin controllers. Prior to CakePHP 2.1 some developers chose to implement generic
  event systems to solve this problem, and some of those system were offered as plugins.
  Now, you can benefit from a standard general purpose event system that will let you
  cleanly separate the concerns of your plugins and application code with the built in
  events manager.

そうすることは、外部でビヘイビアをロードするかフックをプラグインコントローラに取り付けるかするために
コードを用意しなくてはならないので、ほとんどの場合ひとつの挑戦を意味します。
CakePHP 2.1 以前の何人かの開発者は、この問題を解決するために汎用イベントシステムを実装することにし、
そのうちいくつかのシステムはプラグインとして提供されていました。今あなたは、組み込みの
イベントマネージャーによって、プラグインとアプリケーションコードの関係をきれいに切り離してくれる、
標準的な多目的イベントシステムから恩恵を受けることができます。

.. Dispatching events

イベントのディスパッチ
----------------------

..
  So back to our example, we would have an `Order` model that will manage the buying logic,
  and probably a `place` method to save the order details and do any other logic::

それでは先ほどの例に戻りましょう。私たちは購買ロジックを管理する `Order` モデルと、
恐らく、注文の詳細を保存したりその他もろもろのロジックを行うための `place` メソッドを持つことになるでしょう::

    // Cart/Model/Order.php
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $this->sendNotificationEmail();
                $this->decrementFromStock();
                $this->updateUserStatistics();
                // ...
                return true;
            }
            return false;
        }
    }

..
  Well, that does not look right at all. A plugin should not make any assumption
  about sending emails, and may not even have the inventory data to decrement the
  item from it, and definitely tracking usage statistics is not the best place to
  do it. So we need another solution, let's rewrite that using the event manager::

まあ、全然よく見えないですよね。プラグインは電子メールの送信について何らかの仮定を立てるべきではないし、
さらにそれから商品をデクリメントする目録データを持っていない可能性すらあるし、
そして使用状況に関する統計情報のトラッキングを行うにはどう見ても最適の場所ではありません。
つまり、我々には別の解決策が必要と言うわけなので、さて、イベント·マネージャーを用いて
これを書き直してみましょう::

    // Cart/Model/Order.php
    App::uses('CakeEvent', 'Event');
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $this->getEventManager()->dispatch(new CakeEvent('Model.Order.afterPlace', $this, array(
                    'order' => $order
                )));
                return true;
            }
            return false;
        }
    }

..
  That looks a lot cleaner, at gives us the opportunity to introduce the event
  classes and methods. The first thing you may notice is the call to ``getEventManager()``
  this is a method that is available by default in all Models, Controller and Views.
  This method will not return the same manager instance across models, and it is not
  shared between controllers and models, but they are between controllers and views,
  nevertheless. We will review later how to overcome this implementation detail.

イベントクラスとメソッドを導入することで、ずいぶんすっきりしましたね。最初に気づくことは
``getEventManager()`` の呼び出しではないでしょうか。これはデフォルトの状態ですべてのモデル、コントローラ、
ビューで使用可能なメソッドです。このメソッドは、モデル間で同じマネージャーのインスタンスを返すことはなく、
コントローラとモデルの間でも共有されていないにも関わらず、コントローラとビューの間では共有されています。
この実装の詳細をいかにして攻略するかは、後ほど検討します。

..
  The ``getEventManager`` method returns an instance of :php:class:`CakeEventManager`,
  and to dispatch events you use :php:meth:`CakeEventManager::dispatch()` which
  receives an instance of the :php:class:`CakeEvent` class. Let's dissect now the
  process of dispatching an event::

``getEventManager`` メソッドは :php:class:`CakeEventManager` のインスタンスを返します。
そしてイベントのタスクを処理するために、 :php:class:`CakeEvent` クラスのインスタンスを受け取る
:php:meth:`CakeEventManager::dispatch()` を使用します。それでは、イベントを処理するプロセスを
詳しく見てみましょう::

    new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));

..
  :php:class:`CakeEvent` receives 3 arguments in its constructor. The first one
  is the event name, you should try to keep this name as unique as possible,
  while making it readable. We suggest a convention as follows: `Layer.eventName`
  for general events happening at a layer level (e.g. `Controller.startup`, `View.beforeRender`)
  and `Layer.Class.eventName` for events happening in specific classes on a layer,
  for example `Model.User.afterRegister` or `Controller.Courses.invalidAccess`.

:php:class:`CakeEvent` は、そのコンストラクタに3つの引数を受け取ります。最初のものはイベント名で、
読みやすくすると同時にできるだけ唯一性を維持することを心掛けてください。
我々は次のような規則を提案します： レイヤーレベルで発生する一般的なイベントのためには
`Layer.eventName` と言う記述方法 (例. `Controller.startup`, `View.beforeRender`) を、
そして あるレイヤーの特定のクラスで発生するイベントのためには
`Layer.Class.eventName` 例えば `Model.User.afterRegister` や `Controller.Courses.invalidAccess`
と言う記述方法を。

..
  The second argument is the `subject`, meaning the object associated to the event,
  usually when it is the same class triggering events about itself, using `$this`
  will be the most common case. Although a :php:class:`Component` could trigger
  controller events too. The subject class is important because listeners will get
  immediate access to the object properties and have the chance to inspect or
  change them on the fly.

2つ目の引数は`subject`です。サブジェクトとはイベントに関連付けられているオブジェクトを意味し、
通常それ自身に関するイベントをトリガーしているものと同じクラスであり、
`$this` の使用が一般的なケースとなります。とは言え、:php:class:`Component` が
コントローライベントをトリガしたりもできます。サブジェクトクラスは重要です。
なぜなら、リスナーがオブジェクトのプロパティへの即時アクセスを取得し、
それらをその場で検査したり変更するチャンスを持てるようになるからです。

..
  Finally, the third argument is the event's params. This can be any data you consider
  useful to pass around so listeners can act upon it. While this can be an argument
  of any type, we recommend passing an associative array, to make inspection easier.

最後に、3番目の引数はイベントのパラメータです。これは、リスナーがそれに基づいて
行動できるようにするための任意のデータです。これは、どのような型の引数でも指定できますが、
検査を容易にするために連想配列を渡すことをお勧めします。

..
  :php:meth:`CakeEventManager::dispatch()` method accepts the event object as argument
  and notifies all listener and callbacks passing this object along. So the listeners
  will handle all the extra logic around the `afterPlace` event, you can log the time,
  send emails, update user statistics possibly in separate objects and even delegating
  it to offline tasks if you have the need.

:php:meth:`CakeEventManager::dispatch()` メソッドは、引数としてイベントオブジェクトを受け取り、
すべてのリスナーとコールバックにこのオブジェクトを伝達させながら通知します。このようにして、
リスナーは `afterPlace` イベントにまつわる、その他のすべてのロジックを処理できるようになるので、
あなたは時間をログに取ったり、電子メールを送信したり、ユーザーの統計情報を更新したりを
別々のオブジェクトで行うことができ、必要があればオフラインのタスクにそれを委任することさえできるのです。

.. Registering callbacks

コールバックの登録
------------------

..
  How do we register callbacks or observers to our new `afterPlace` event? This
  is subject to a wide variety of different implementations, but they all have
  to call the :php:meth:`CakeEventManager::attach()` method to register new actors.
  For simplicity's sake, let's imagine we know in the plugin what the callbacks
  are available in the controller, and say this controller is responsible for
  attaching them. The possible code would look like this::

新しいafterPlaceイベントにコールバックやオブザーバを登録するにはどうすればよいのでしょうか？
これは多種多様な異なる実装がなされますが、どのような場合であっても新しいアクターを登録する
:php:meth:`CakeEventManager::attach()` メソッドを呼び出す必要はあります。わかりやすくするために、
このプラグインにおいてコントローラでコールバックを使用可能であることを我々は知っており、
このコントローラは、それらを責任を持って接続するとしましょう。可能なコードは次のようになります::

    // Listeners configured somewhere else, maybe a config file:
    Configure::write('Order.afterPlace', array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
        'logger' => function($event) {
            // Anonymous function are only available in PHP 5.3+
            CakeLog::write('info', 'A new order was placed with id: ' . $event->subject()->id);
        }
    ));

    // Cart/Controller/OrdersController.php
    class OrdersController extends AppController {

        public function finish() {
            foreach (Configure::read('Order.afterPlace') as $l) {
                $this->Order->getEventManager()->attach($l, 'Model.Order.afterPlace');
            }
            if ($this->Order->place($this->Cart->items())) {
                // ...
            }
        }
    }

..
  This may not be the cleanest way to do it, so you can come up with your own ways
  for attaching listeners to an object's event manager. This simple way of defining
  them using the `Configure` class is intended for didactic purposes only. This
  little example allows us to showcase what type of callbacks can be attached to
  the manager. As you may already have figured out, the `attach` method takes any
  valid  PHP `callback` type, this is a string representing a static function call,
  an array having a class instance and a method, an anonymous function if you use
  PHP 5.3, etc. Attached callbacks will all receive the event object as first argument

これはそのための最善な方法ではないかもしれないので、リスナーをオブジェクトのイベントマネージャーに
アタッチするためのあなた自身のやり方を考えてください。 `Configure` クラスを使用してそれらを定義するという
この単純な方法は単に教科書的に書いたにすぎません。この小さな例が私たちに示すことは、
どのようなタイプのコールバックであってもマネージャーにアタッチ可能だということです。
すでにお分かりだと思いますが、この `attach` メソッドはすべての有効なPHPコールバックのタイプ、
つまり文字列で表された static function の呼び出し、クラスインスタンスとメソッドを保持した配列、
もしPHP5.3以上を利用しているなら無名関数、などをうけとります。アタッチされたコールバックは全て、
第1の引数としてイベントオブジェクトを受け取ります。

..
  :php:meth:`CakeEventManager::attach()` Accepts three arguments. The leftmost one is
  the callback itself, anything that PHP can treat as a callable function. The second
  argument is the event name, and the callback will only get fired if the `CakeEvent`
  object dispatched has a matching name. The last argument is an array of options to
  configure the callback priority, and the preference of arguments to be passed.

:php:meth:`CakeEventManager::attach()` は3つの引数を受け取ります。左端の1つはコールバック自身、
PHPが呼び出し可能な関数として扱うことができる何かです。第二引数にはイベント名で、
`CakeEvent` オブジェクトはこれとマッチした名前でディスパッチされたときにのみ動作します。
最後の引数はコールバックのプライオリティ、および渡される引数のプライオリティを設定するためのオプションの配列です。

.. Registering listeners

リスナーの登録
--------------

..
  Listeners are an alternative, and often cleaner way of registering callbacks for
  an event. This is done by implementing the :php:class:`CakeEventListener` interface
  in any class you wish to register some callbacks. Classes implementing it need to
  provide the ``implementedEvents()`` method and return an associative array with all
  event names that the class will handle.

リスナーは、イベントのためにコールバックを登録する選択肢の一つでありとてもクリーンな方法です。
これは、コールバックをいくつか登録したいとあなたが望む任意のクラスに対し
:php:class:`CakeEventListener` インターフェイスを実装することによって実現されます。
このインターフェイスを実装しているクラスは、``implementedEvents()`` メソッドを提供し、
クラスが処理するすべてのイベント名を持つ連想配列を返す必要があります。

..
  To keep up with our previous example, let's imagine we have a UserStatistic class
  responsible for calculating useful information and compiling into the global site
  statistics. It would be natural to pass an instance of this class as a callback,
  instead of implementing a custom static function or converting any other workaround
  to trigger methods in this class. A listener is created as follows::

それでは先ほどの例を追いながら、有意義な情報を計算してグローバル・サイトの統計へと
コンパイルする役割を果たすUserStatisticクラスがあると仮定しましょう。
このクラス内のメソッドをトリガーするためには、手製のstaticな関数の実装や他のいかなる回避策よりも、
このクラスのインスタンスをコールバックとして渡すのが自然でしょう。リスナーは次のように作成します::

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

    // Attach the UserStatistic object to the Order's event manager
    $statistics = new UserStatistic();
    $this->Order->getEventManager()->attach($statistics);

..
  As you can see in the above code, the `attach` function can handle instances of
  the `CakeEventListener` interface. Internally, the event manager will read the
  array returned by `implementedEvents` method and wire the callbacks accordingly.

上記のコードを見るとわかるように、`attach` 関数は `CakeEventListener` インターフェイスの
インスタンスを操ることができます。内部的には、イベント·マネージャーは `implementedEvents`
メソッドが返す配列を読み取り、ただちにコールバックを結びつけます。

.. _event-priorities:

.. Establishing priorities

プライオリティの設置
--------------------

..
  In some cases you'd want to run a callback and make sure it gets executed before,
  or after all the other callbacks have been run. For instance, think again about
  our user statistics example. It would make sense to run this method only
  when we can make sure the event was not cancelled, there were no errors and the
  other callbacks did not change the state of the order itself. For those cases you
  use priorities.

いくつかのケースでは、コールバックを実行させて他の実行済みのコールバックとの前後関係を
明らかにしたいと思うでしょう。例としてユーザーの統計情報の場合についてもう一度考えて見ましょう。
このメソッドを実行させる意義があるのは、イベントはキャンセルされておらず、エラーもなく、
その他のコールバックが注文の状態そのものを変更させていないことが明らかになった時に限られます。
このような場合、プライオリティを用います。

..
  Priorities are handled using a number associated to the callback itself. The higher
  the number, the later the method will be fired. Default priority for all callbacks
  and listener methods are set to `10`. If you need your method to be run before, then
  using any value below this default will help you do it, even setting the priority
  to `1` or a negative value should work. On the other hand if you desire to run the
  callback after the others, using a number above `10` will do.

プライオリティは、コールバック自体に関連付けられている数字を使用して処理されます。
数字が大きいほど、後に実行されるメソッドです。すべてのコールバックとリスナメソッドの
デフォルトの優先度は `10` に設定されています。もしメソッドをもっと早く実行したい場合は、
このデフォルト値よりも小さい任意の値(`1` でもいいし負の値でも動作するでしょう)の使用が
あなたを助けてくれます。逆に、コールバックを他よりもあとに実行させたいなら、
`10` よりも大きい数字を用いてください。

..
  If two callbacks happen to be allocated in the same priority queue, they will be
  executed with a `FIFO` policy, the first listener method to be attached is called
  first and so on. You set priorities using the `attach` method for callbacks, and
  declaring it in the `implementedEvents` function for event listeners::

2つのコールバックが同じプライオリティキューに割り当てられるた場合は、
それらはFIFOポリシーで実行され、最初にアタッチされたリスナーメソッドは最初に、
という具合に実行されます。コールバックのプライオリティを設定するためにはattachメソッドを用い、
リスナーのプライオリティを設定するためには `implementedEvent` 関数内での宣言を行います::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('priority' => 2));

    // Setting priority for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array('callable' => 'updateBuyStatistic', 'priority' => 100),
            );
        }
    }

..
  As you see, the main difference for `CakeEventListener` objects is that you need
  to use an array for specifying the callable method and the priority preference.
  The `callable` key is an special array entry that the manager will read to know
  what function in the class it should be calling.

ご覧のとおり、`CakeEventListener` オブジェクトにおける主な違いは、
コーラブルメソッドとプライオリティを指定するために配列を使用する必要があるということです。
`callable` キーはマネージャーがクラス内のどのような関数が呼ばれるべきかを知るために読み込むであろう、
特別な配列エントリです。

.. Getting event data as function params

イベントを関数のパラメータとして受け取る
----------------------------------------

..
  Some developers might prefer having the event data passed as function parameters
  instead of receiving the event object. While this is an odd preference and using
  the event object is a lot more powerful, this was needed to provide backwards
  compatibility with the previous event system and to offer seasoned developers an
  alternative to what they were used to.

一部の開発者は、イベントオブジェクトを受け取ることよりも関数のパラメータとして渡された
イベントのデータを保持する方を好むかもしれません。これはまあ、ちょっと変わった趣味で、
イベントオブジェクトを用いるほうがずっとパワフルと言えますが、以前のイベントシステムとの後方互換性と、
経験豊かな開発者が慣れ親しんだ環境の代替手段とを提供する必要もあったのです。

..
  In order to toggle this option you have to add the `passParams` option to the
  third argument of the `attach` method, or declare it in the `implementedEvents`
  returned array similar to what you do with priorities::

この方法を選択する場合、プライオリティの設定でやったのと同じように、`attach`メソッドの
3番目の引数に`passParams`オプションを追加するか `implementedEvents` が返す配列に
それを宣言する必要があります::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('passParams' => true));

    // Setting priority for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array('callable' => 'updateBuyStatistic', 'passParams' => true),
            );
        }

        public function updateBuyStatistic($orderData) {
            // ...
        }
    }

..
  In the above code the `doSomething` function and `updateBuyStatistic` method will
  receive `$orderData` instead of the `$event` object. This is so, because in our
  previous example we trigger the `Model.Order.afterPlace` event with some data::

上記のコードでは `doSomething` 関数と `updateBuyStatistic` メソッドは `$event` オブジェクト
の代わりに `$orderData` を受け取ることになります。これは、先ほどの例において、
いくつかのデータを伴って `Model.Order.afterPlace` イベントをトリガするからです::

    $this->getEventManager()->dispatch(new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    )));


..
  .. note::
      The params can only be passed as function arguments if the event data is an array.
      Any other data type cannot be converted to function parameters, thus not using
      this option is often the most adequate choice.

.. note::
  イベントデータが配列の場合にのみ、このパラメータは関数の引数として渡すことができます。
  他のどのようなデータ型も関数のパラメータに変換することはできません。という訳で、
  ほとんどの場合においてこの選択肢を用いないことが最適な選択となります。

.. Stopping events

イベントの停止
--------------

..
  There are circumstances where you will need to stop events so the operation that
  started it is cancelled. You see examples of this in the model callbacks
  (e.g. beforeSave) in which it is possible to stop the saving operation if
  the code detects it cannot proceed any further.

イベントを開始した操作がキャンセルされたために、イベントを停止しなくてはならない状況があります。
それ以上処理を進めることが不可能であることをコードが検出した時に保存操作を停止できる、モデルの
コールバック（例えばbeforeSave）において、そのような例を見いだせます。

..
  In order to stop events you can either return `false` in your callbacks or call
  the `stopPropagation` method on the event object::

イベントを停止するためには、コールバックで `false` を返すか、またはイベントオブジェクトで
`stopPropagation` メソッドを呼び出すかのいずれかを行うことができます::

    public function doSomething($event) {
        // ...
        return false; // stops the event
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

..
  Stopping an event can have two different effects. The first one can always be
  expected: any callback after the event was stopped will not be called. The second
  consequence is optional and it depends on the code triggering the event, for
  instance, in our `afterPlace` example it would not make any sense to cancel the
  operation since the data was already saved and the cart emptied. Nevertheless, if
  we had a `beforePlace` stopping the event would have a valid meaning.

イベントの停止は2つの異なる効果をもたらせます。最初のものは常に期待することができます:
いかなるのコールバックも停止されて呼び出されることはありません。2番目の結果はオプションで、
イベントをトリガするコードに依存します。例えば `afterPlace` の例では、
すでにデータが保存されカートが空になった後なので、操作をキャンセルするすることには
何の意味もありません。しかしながら、もし `beforePlace` を停止させていたら、イベントは意味を持ちます。

.. To check if an event was stopped, you call the `isStopped()` method in the event object::

イベントが中止されたかどうかを確認するには、イベント·オブジェクト内で `isStopped()` メソッドを呼び出します::

    public function place($order) {
        $event = new CakeEvent('Model.Order.beforePlace', $this, array('order' => $order));
        $this->getEventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

..
  In the previous example the order would not get saved if the event is stopped
  during the `beforePlace` process.

先の例において、イベントがbeforePlaceの処理の間に停止した場合は、注文内容は保存されません。

.. Getting event results

結果の取得
----------

..
  Every time a callback returns a value, it gets stored in the `$result` property
  of the event object. This is useful in some cases where letting callbacks modify
  the main process params enhances the ability of altering the execution aspect of
  any process. Let's take again our `beforePlace` example and let callbacks modify
  the $order data.

コールバックが値を返すたびに、それはイベントオブジェクトの `$result` プロパティに格納されます。
これは、コールバックがメインプロセスのパラメータを更新しようとすることで、
処理の局面を変更する能力を高める幾つかの場面で有用です。再び `beforePlace` を例にとり、
コールバックが $order データを変更することを許可してみましょう。

..
  Event results can be altered either using the event object result property
  directly or returning the value in the callback itself::

イベントの結果は、イベントオブジェクトのresultプロパティを直接用いるか、
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
        $event = new CakeEvent('Model.Order.beforePlace', $this, array('order' => $order));
        $this->getEventManager()->dispatch($event);
        if (!empty($event->result['order'])) {
            $order = $event->result['order'];
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

..
  As you also may have noticed it is possible to alter any event object property
  and be sure that this new data will get passed to the next callback. In most of
  the cases, providing objects as event data or result and directly altering the
  object is the best solution as the reference is kept the same and modifications
  are shared across all callback calls.

あなたもお気づきかも知れませんが、いかなるイベントのオブジェクトであっても変更可能であり、
この新しいデータが次のコールバックに渡されることは明らかです。 ほとんどの場合、
オブジェクトをイベント·データまたは結果として提供し、そのオブジェクトを直接変更することは、
参照が同一に保たれていて変更がすべてのコールバックの呼び出しを超えて共有できるので、
最適なソリューションです。

.. Removing callbacks and listeners

コールバック及びリスナーの削除
------------------------------

..
  If for any reason you want to remove any callback from the event manager just call
  the :php:meth:`CakeEventManager::detach()` method using as arguments the first two
  params you used for attaching it::

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
    $listener = new MyCakeEventLister();
    $this->getEventManager()->attach($listener);

    // Detaching a single event key from a listener
    $this->getEventManager()->detach($listener, 'My.event');

    // Detaching all callbacks implemented by a listener
    $this->getEventManager()->detach($listener);

.. The global event manager

グローバルイベントマネージャー
==============================

..
  As previously noted, it might get hard to attach observers to a particular
  event manager in an object. There are certain cases where having the ability
  to attach callbacks for an event is needed without having access to the object
  instance that will trigger it. Also, to prevent people from implementing each
  of them a different mechanism for loading callbacks into managers based on
  configuration, CakePHP provides the concept of the global event manager.

前述したように、あるオブジェクト内の任意のイベント·マネージャーにObserverを
アタッチするのが難しいことがあるかも知れません。あるイベントに対して、
それをトリガーするオブジェクトのインスタンスにアクセスすること無しに、
コールバックをアタッチできなくてはならない一定のケースがあります。また、
設定に基づいて、コールバックのマネージャーへのローディングを、
各々異なるメカニズムに実装してしまわないように、CakePHPは
グローバルイベントマネージャーの概念を提供します。

..
  The global manager is a singleton instance of a ``CakeEventManager`` class that
  receives every event that any event manager in the app dispatches. This is both
  powerful and flexible, but if you use it you need to take more precautions when
  dealing with events.

グローバルマネージャーは、app dispatches においてすべてのイベントを受け取る
``CakeEventManager`` クラスのシングルトンインスタンスです。これは強力かつ柔軟ですが、
もし使用するなら、より一層イベントを処理するときに注意を払う必要があります。

..
  To set the concept right once again, and using our `beforePlace` example let's
  recall that we were using the local event manager that is returned by the `getEventManager`
  function. Internally this local event manager dispatches the event into the global
  one before it triggers the internal attached callbacks. The priority for each manager is
  independent, the global callbacks will fire in their own priority queue and then
  the local callbacks will get called in the respective priority order.

もう一度コンセプトを正しく設定するために、`beforePlace` の例を用いながら、
`getEventManager` 関数で返されたローカルのイベントマネージャーを用いていたころの
私達を再び思い出しましょう。内部的には、このローカルイベントマネージャーは、
アタッチされたコールバックをトリガーする前に、イベントをグローバルのイベントマネージャーに
ディスパッチしています。各マネージャーの優先度は独立しており、グローバルなコールバックは
独自のプライオリティキューで発生し、ローカルのコールバックは
それぞれのプライオリティの順序で呼び出されます。

..
  Accessing the global event manager is as easy as calling a static function,
  the following example will attach a global event to the `beforePlace` event::

グローバルイベントマネージャーにアクセスするには static 関数を呼び出すように簡単で、
次の例では、`beforePlace` イベントにグローバルイベントをアタッチしています::

    // In any configuration file or piece of code that executes before the event
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach($aCallback, 'Model.Order.beforePlace');

..
  As you can see, we just change how we get access to an event manager instance,
  and we can apply the same concepts we learned before about triggering, attaching,
  detaching, stopping events, etc.

ご覧のとおり、イベントマネージャーインスタンスへのアクセスの取得方法を単に変更するだけで、
イベントのトリガー、アタッチ、デタッチ、ストップなど既に学習したのと同じ概念を適用することができます。

..
  One important thing you should consider is that there are events that will be
  triggered having the same name but different subjects, so checking it in the event
  object is usually required in any function that gets attached globally in order
  to prevent some bugs. Remember that extreme flexibility implies extreme complexity.

あなたが考慮すべき重要な点は、同名でありながら異なるサブジェクトを伴ってトリガーされる
イベントが存在することがあるので、グローバルマネージャーでアタッチされたコールバックでは
通常、バグを防ぐためにイベントオブジェクト内でそれをチェックすることが求められているということです。
極度な柔軟性は、同時に極度な複雑性をも意味することを覚えておいてください。

..
  Consider this callback that wants to listen for all Model beforeFinds but in
  reality, it cannot do its logic if the model is the Cart::

すべてのモデルのbeforeFindsを補足したい一方で、もし Cart モデルの場合ならロジックは実行不可という、
こんなコールバックを考えてみてください::

    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach('myCallback', 'Model.beforeFind');

    public function myCallback($event) {
        if ($event->subject() instanceof Cart) {
            return;
        }
        return array('conditions' => ...);
    }

.. Conclusion

最後に
======

..
  Events are a great way of separating concerns in your application and make
  classes both cohesive and decoupled from each other, nevertheless using events
  is not the solution to all problems. Most applications actually won't need this
  feature at all, we recommend looking into other options when it comes to
  implementing callbacks such as using behaviors, components or helpers.

イベントシステムはあなたのアプリケーション内の複雑な関係を分離させる偉大な方法であり、
クラスに凝集と疎結合の両者をもたらしますが、それにもかかわらず、
これはすべての問題の解決策というわけではありません。実のところ、
ほとんどのアプリケーションは全くこの機能を必要とせず、ビヘイビアやコンポーネント、
ヘルパーを用いる様な感じでコールバックを実装するすようになってきたときは、
他の選択肢から検討することをおすすめします。

..
  Keep in mind that with great power comes great responsibility, decoupling your
  classes this way also means that you need to perform more and better integration
  testing on your code. Abusing this tool won't make your apps have a better architecture,
  quite the opposite, it will make the code harder to read. Whereas in contrast, if you
  use it wisely, only for the stuff your really need, it will make you code easier
  to work with, test and integrate.

偉大な力には偉大な責任が伴うことを心に留めておいてください。
この方法でクラスを疎結合させるということは、コード上でより多くの
そしてより良い結合テストの実行が要求されるということです。
このツールの乱用はあなたのアプリケーションによりよいアーキテクチャをもたらすなんてことはなく、
全くその逆に、コードの可読性を著しく下げるでしょう。一方それとは対照的に、
本当に必要なものに限って賢くそれを使用するのならば、コードの取り扱い、テスト、
そして統合させることを容易にしてくれることでしょう。

.. Additional Reading

その他の資料
============

.. toctree::
    :maxdepth: 1

    /core-libraries/collections
    /models/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=en: Events system
    :keywords lang=en: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
