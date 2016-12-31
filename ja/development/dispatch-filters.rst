ディスパッチャー・フィルター
############################

.. versionadded:: 2.2

コントローラーのコードが実行される前、もしくはクライアントにレスポンスを
送ろうとする直前に、なにがしかのコードを動かしたいというケースがあります。
たとえば、レスポンスのキャッシングやヘッダーのチューニング、特殊な認証、
もしくは単に、リクエストを処理するサイクルに要する時間より短時間のうちに
ミッションクリティカルな API レスポンスにアクセスさせたい、といった
ケースが挙げられます。

CakePHP では、このようなケースについて、実行サイクルに対してフィルター
を適用するための、クリーンで拡張可能なインターフェースを備えています。
ちょうど、リクエスト毎のスタッカブルなサービスやルーチンを提供する、
ミドルウェアのレイヤーのようなものです。私たちはこれを
`Dispatcher Filters` と呼んでいます。

フィルターを設定する
====================

フィルターは通常 ``bootstrap.php`` ファイルの中で設定されますが、
リクエストがディスパッチされる（制御が移る）前であれば、どの設定ファイル
からでも気軽にロードして構いません。フィルターの追加や削除は、 `Configure`
クラスの中で特別な ``Dispatcher.filters`` キーを使って行われます。
CakePHP にはデフォルトで２つのフィルタークラスが備わっており、すべての
リクエストですでに有効になっています。ここでは、それらがどのように追加
されているのかを見てみましょう。::

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

これらの配列の値は、それぞれディスパッチャーのレベルで生成されたイベント
のためのリスナーとしてインスタンス化および追加されたクラスの名前です。
ひとつ目の ``AssetDispatcher`` は、プラグインの webroot フォルダーや、
テーマに対応するフォルダーに格納されている CSS、JavaScript、画像といった
テーマやプラグインの静的(asset)ファイルを参照しているリクエストなのか
どうかをチェックするためのものです。これは、その実行結果として、それらの
ファイルがあればそれらを提供し、それ以上のディスパッチサイクルを中止
します。 ``CacheDispatcher`` フィルターは、 ``Cache.check`` 設定変数が
有効の場合、レスポンスがすでにファイルシステムの中で似たようなリクエスト
のためにキャッシュされているかどうかをチェックし、もしあればその
キャッシュコードを即座に提供します。

これでわかるように、いずれの提供されたフィルターも、後続のコードの実行を
打ち切ってクライアントに即座にレスポンスを返す責任を負っています。しかし
後述のように、フィルターの役割はこれだけではありません。

フィルターのリストにあなた自身のクラス名を追加すると、それらは定義された
順番に実行されます。さらに、特殊な ``DispatcherFilter`` クラスとは関係ない
フィルターを接続するための別の方法もあります。::

    Configure::write('Dispatcher.filters', array(
        'my-filter' => array(
            'callable' => array($classInstance, 'methodName'),
            'on' => 'after'
        )
    ));

これに示されるように、PHP で有効な `callback <https://secure.php.net/callback>`_
であれば、何でも渡すことができます。覚えていると思いますが、 `callback`
は PHP が ``call_user_func`` で実行することのできるものすべでです。
ただ小さな例外があります。もし文字列が渡されると、それは関数名としては
見てもらえず、クラス名として扱われます。ただし PHP 5.3 以降を使っている
場合は、無名関数であればもちろんフィルターとして指定可能です。::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array('callable' => function($event) {...}, 'on' => 'before'),
       // さらにフィルターを記載可能
    ));

``on`` キーに有効な値は ``before`` と ``after`` のみです。これは文字通り、
コントローラーのコードが実行される前にそのフィルターを実行するのか
それとも後なのかを指定します。フィルターには ``callable`` キーを指定
できますが、さらにあなたのフィルターの優先度を指定することも可能です。
もし何も指定されなければ、デフォルトの ``10`` が選ばれます。

すべてのフィルターはデフォルトで ``10`` の優先度を持っているため、他の
すべてのフィルータの実行より前に実行させたければ、必要に応じてより小さな
数値を指定してください。::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array(
            'callable' => function($event) {...},
            'on' => 'before',
            'priority' => 5
        ),
        'other-filter' => array(
            'callable' => array($class, 'method'),
            'on' => 'after',
            'priority' => 1
        ),
       // さらなるフィルター定義
    ));

宣言するフィルターの優先順位を定義する場合、同一の優先度を持つものの
扱いが問題となります。フィルターをクラス名として定義する場合、インライン
で優先度を定義するオプションは現時点では存在しませんが、これは近日中に
実装される予定です。またついに、CakePHP のプラグイン機能を使ってプラグイン
の中にあるフィルターの定義ができるようになりました。::

    Configure::write('Dispatcher.filters', array(
        'MyPlugin.MyFilter',
    ));

テーマやプラグインの静的ファイルを提供するための、より先進的で速い
手段を選ぶためとか、ビルトインの完全なページキャッシング機能を
使いたくないとか、あるいは自分で実装したいなどの理由があれば、
デフォルトで接続されたフィルターを外しても特に問題ありません。

あなたが作成したディスパッチフィルタークラスのコンストラクターに
パラメーターや設定を渡す必要がある場合、設定を配列として渡します。::

    Configure::write('Dispatcher.filters', array(
        'MyAssetFilter' => array('service' => 'google.com')
    ));

フィルターのキーが有効なクラス名の場合、その値としてディスパッチフィルター
に渡すパラメーターの配列を指定することも可能です。デフォルトでは、ベース
クラスの中でこれらの設定がデフォルト値とマージされ、その後それらの値が
``$settings`` プロパティにセットされます。

.. versionchanged:: 2.5
    2.5 から、コンストラクタの設定をディスパッチフィルターに渡すことが
    できるようになりました。

フィルタークラス
================

ディスパッチフィルターが設定の中でクラス名として定義されている場合、
それは CakePHP ディレクトリの `Routing` の中で ``DispatcherFilter`` 
を継承している必要があります。ここで特定の URL に対して 'Hello World'
を返すようなシンプルなフィルターを作ってみましょう。::

    App::uses('DispatcherFilter', 'Routing');
    class HelloWorldFilter extends DispatcherFilter {

        public $priority = 9;

        public function beforeDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->url === 'hello-world') {
                $response->body('Hello World');
                $event->stopPropagation();
                return $response;
            }
        }
    }

このクラスを ``app/Routing/Filter/HelloWorldFilter.php`` ファイルとして保存し、
前節で説明したような要領で  bootstrap ファイルの中で設定する必要があります。
ここで説明すべきことはたくさんあるのですが、まずは ``$priority`` 値から
見てみましょう。

前述のように、フィルタークラスを使う場合は、そのクラスの中で ``$priority``
プロパティを使って実行順序を定義することしかできません。このプロパティが
宣言されている場合、そのデフォルト値は 10 なので、Router クラスがリクエスト
をパースした _後に_ 実行されるということになります。直前の例では、これは
望ましくない動作です。なぜなら、この URL に答えるようなコントローラーを
用意していることは、まずありえないからです。そのため、私たちは優先度として
9 を選ぶことになります。

``DispatcherFilter`` には、サブクラスでオーバーライドするべき２つのメソッド
``beforeDispatch`` と ``afterDispatch`` があります。これらは順に、
コントローラーが実行される『前』と『後』に実行されます。いずれのメソッドも
:php:class:`CakeEvent` イベントを受け取りますが、この中には ``request``
と ``response`` オブジェクト（:php:class:`CakeRequest` と 
:php:class:`CakeResponse` インスタンス）が含まれており、さらに ``data`` 
プロパティの中に ``additionalParams`` 配列が入っています。後者には
``requestAction`` をコールする際の内部ディスパッチングで使われる情報も
入っています。

私たちの例では、結果として条件付きで ``$response`` オブジェクトを返します。
これは、ディスパッチャーに対して、コントローラーのインスタンスは作らずに、
即座にクライアントにそのようなオブジェクトをレスポンスとして返すよう指示
します。さらに、私たちは ``$event->stopPropagation()`` を追加することで、
この後に別のフィルターが起動されることを防ぎます。

次は、何らかの公開ページにおいて代替のレスポンスヘッダーを返すための
新たなフィルターを作ってみましょう。このケースでは、 ``PagesController``
から提供されるものであれば何でも構いません。::

    App::uses('DispatcherFilter', 'Routing');
    class HttpCacheFilter extends DispatcherFilter {

        public function afterDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->params['controller'] !== 'pages') {
                return;
            }
            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }


このフィルターは、ページコントローラーによって生成されるすべてのレスポンス
について、１日後に期限切れとなるヘッダーを送信します。もちろん、これと
同様の処理をコントローラーの中で行っても構いませんが、これは単にフィルター
を使って何ができるのかの例に過ぎません。たとえば、代替のヘッダーを返す
代わりに、:php:class:`Cache` クラスを使ってそれをキャッシュすることもできますし、
``beforeDispatch`` コールバックからレスポンスを返すことも可能です。

インラインフィルター
====================

最後にお見せする例では、無名関数（PHP 5.3+ のみで利用可能）を使って JSON
フォーマットでポストされたデータの一覧を返します。これは本来コントローラーと
:php:class:`JsonView` クラスを使って行なうべきですが、たとえばミッション
クリティカルな API のエンドポイントで、なんとか数 ms でも節約しなければ
ならないようなケースを想像してみてください。::

    $postsList = function($event) {
        if ($event->data['request']->url !== 'posts/recent.json') {
            return;
        }
        App::uses('ClassRegistry', 'Utility');
        $postModel = ClassRegistry::init('Post');
        $event->data['response']->body(json_encode($postModel->find('recent')));
        $event->stopPropagation();
        return $event->data['response'];
    };

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher',
        'recent-posts' => array(
            'callable' => $postsList,
            'priority' => 9,
            'on'=> 'before'
        )
    ));

直前の例では、私たちは自身のフィルターについて ``9`` の優先度を選びました。
そのため、カスタムで用意したその他のロジックや、CakePHP の内部ルーティング
システムなどのコアフィルターをスキップすることができました。しかしながら、
それは本来必要なことではなく、単にある種のリクエストに対する肥大化した処理を
削減する必要がある場合に、あなたの重要なコードを最初に実行させる方法を
示すためのものです。

これを実装すると、あなたのアプリケーションの保守性が著しく低下することは
自明です。フィルターは上手に使うと非常にパワフルなツールですが、あなたの
アプリケーションでそれぞれの URL のレスポンスハンドラーを追加することは、
決して好ましいことではありません。しかしながら、本当にそれが必要な状況であれば、
身近にあるクリーンな解決策です。すべてのケースをフィルターにする必要が
ないことだけは覚えておいてください。あなたのアプリケーションにリクエスト
ハンドラーを追加する場合、通常は `Controllers` と `Components` が正しい
選択であるはずです。

.. meta::
    :title lang=ja: Dispatcher Filters
    :description lang=ja: Dispatcher filters are a middleware layer for CakePHP allowing to alter the request or response before it is sent
    :keywords lang=ja: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router

