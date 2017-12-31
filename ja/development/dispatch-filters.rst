ディスパッチャーフォルター
##########################

.. deprecated:: 3.3.0
    3.3.0 でディスパッチャーフォルターは非推奨になりました。代わりに
    :doc:`/controllers/middleware` を使用してください。

コントローラーのコードが実行される前やクライアントからレスポンスを受けたり、ヘッダーをチューニングしたり、
完全なリクエストが送られるより短い時間で特別な必要最低限なAPIにアクセスする権限を設定したりするために、
レスポンスが返る直前にちょっとしたコードを実行する必要がある場合があります。

CakePHP はきれいなディスパッチサイクルに使う強固なフィルターためのインターフェイスを提供します。
ミドルレイヤーに似ていますが、Cakeの他の場所で使ったコードを再利用できます。したがって、
普通のミドルレイヤーそのものみたいに動きませんが、 *Dispatcher Filters* とみなせます。

既定のフィルター
================

いくつかの既定のフィルターがあります。それらは一般的なアプリがおおよそ必要とされる機能を操作できます。
その機能は以下です:

* ``AssetFilter`` テーマやプラグイン内 webroot フォルダーやテーマに関係している CSS や
  JavaScript や画像ファイルを参照しているかどうかチェックします。これは、ファイルが
  見つかったら、残りのディスパッチサイクルを止めて、それに応じてファイルを提供します。 ::

        // 静的アセットのためのキャッシュタイムの設定のためにオプションを使います。
        // 設定されていない場合デフォルトは1時間です。
        DispatcherFactory::add('Asset', ['cacheTime' => '+24 hours']);

* ``RoutingFilter`` はリクエストされたURLに対してルーティング規則適用します。
  ``$request->getParam()`` でルーティングの結果が読めます。
* ``ControllerFactory`` は ``$request->getParam()`` を現在のリクエストを扱うための
  コントローラーを設置するために使います。
* ``LocaleSelector`` はブラウザーによって送られる ``Accept-Language`` ヘッダーによって
  自動的に言語を切り替えます。

フィルターの使用
================

フィルターは **bootstrap.php** で有効にされます。しかし、リクエストが送信される前に
いつでも簡単に読み込めます。 :php:class:`Cake\\Routing\\DispatcherFactory` を使って、
フィルターをつけたり外したり出来ます。
デフォルトでは、 CakePHP のテンプレートは既定で全てのリクエストに対して有効な
2つのフィルタークラスによってされます。それが、どのように追加されるか見てみましょう。 ::

    DispatcherFactory::add('Routing');
    DispatcherFactory::add('ControllerFactory');

    // プラグインの文法がここでも使えます。
    DispatcherFactory::add('PluginName.DispatcherName');

    // オプションで優先度を設定
    DispatcherFactory::add('Asset', ['priority' => 1]);

高い優先度 (数値が小さい方) のディスパッチャーフィルターが先に実行されます。
優先度のデフォルトは ``10`` です。

また、 ``add()`` で文字列を使ってフィルターを指定してインスタンスを渡せます。 ::

    use Cake\Routing\Filter\RoutingFilter;

    DispatcherFactory::add(new RoutingFilter());

フィルターの順番の設定
------------------------

フィルターを追加する時に、使用中のイベントハンドラに従って、順番を制御できます。
``$_priority`` プロパティーを使ってフィルターがデフォルトの優先度を定義できる時に、
特定のフィルターの優先度を加えて設定できます。 ::

    DispatcherFactory::add('Asset', ['priority' => 1]);
    DispatcherFactory::add(new AssetFilter(['priority' => 1]));

より高優先度のこれより後にあるフィルターも呼ばれます。

条件にしたがって適用されるフィルター
-------------------------------------

全部のリクエストでフィルターしたくない場合、条件を使えます。 一部の場合にのみ適用したい場合、
それは ``for`` と ``when`` オプションを使って設定できます。 ``for`` オプションは、URL
との一致を制御し、 ``when`` オプションはフィルターが呼び出し可能な場合に実行を許可します。 ::

    // `/blog` で始まるリクエストの場合だけ実行
    DispatcherFactory::add('BlogHeader', ['for' => '/blog']);

    // GET の場合だけ
    DispatcherFactory::add('Cache', [
        'when' => function ($request, $response) {
            return $request->is('get');
        }
    ]);

``when`` で呼び出し可能なフィルターが実行される時に ``true`` を返します。
呼び出し可能なフィルターは現在のリクエストとレスポンスを引数として取得します。

フィルターの作成
=================

フィルターを作成するために **src/Routing/Filter** でクラスを定義します。この例では、
ファーストランディングページの為のトラッキング用クッキー追加フィルターを作ります。
最初に、以下のファイルを作ります。 ::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class TrackingCookieFilter extends DispatcherFilter
    {

        public function beforeDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');
            if (!$request->getCookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
        }
    }

**src/Routing/Filter/TrackingCookieFilter.php** に保存します。他の CakePHP
のクラスで見られるように、ディスパッチャーフィルターにはいくつかの規約があります。

* クラス名は ``Filter`` で終わる。.
* ``Routing\Filter`` 名前空間内にクラスを作る。例えば、 ``App\Routing\Filter``
* 一般的に、 ``Cake\Routing\DispatcherFilter`` を拡張してクラスを作る。

``DispatcherFilter`` サブクラスでオーバーライド可能な ``beforeDispatch()`` と
``afterDispatch()`` メソッドを提供します。それらのメソッドはそれぞれ個別に、
コントローラーが実行された時にその前か後に実行されます。両方のメソッドは、
``$data`` プロパティー内で ``ServerRequest`` と ``Response`` (
:php:class:`Cake\\Http\\ServerRequest` と :php:class:`Cake\\Http\\Response`
インスタンス) オブジェクトを含む :php:class:`Cake\\Event\\Event` オブジェクトを
受け取ります。

フィルターがとてもシンプルであるにも関わらず、いくつかの興味深いことがフィルターメソッドで出来ます。
``Response`` オブジェクトを返すことで、ディスパッチプロセスをスキップし、呼ばれているフィルターと
コントローラーの干渉を防ぐことが出来ます。レスポンスを返す時に、 ``$event->stopPropagation()``
を他のフィルターを呼ばないために呼ぶことを覚えておいて下さい。

.. note::

    beforeDispatch メソッドがレスポンスを返した時に、コントローラーと afterDispatch
    イベントは呼ばれません。

次は、何らかの公開ページにおいて代替のレスポンスヘッダーを返すための
新たなフィルターを作ってみましょう。このケースでは、 ``PagesController``
から提供されるものであれば何でも構いません。 ::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class HttpCacheFilter extends DispatcherFilter
    {

        public function afterDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');

            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

    // bootstrap.php　にて
    DispatcherFactory::add('HttpCache', ['for' => '/pages'])

このフィルターは１日後に期限が切れるヘッダーをページコントローラーで送るレスポンスに付けて送ります。
もちろんコントローラーでも同じことが出来ます。 これはただのフィルターができることの例一部です。
実際は、レスポンスを操作する代わりに、 :php:class:`Cake\\Cache\\Cache` でキャッシュして、
``beforeDispatch()`` をコールバックしてレスポンスを制御できます。

強力なディスパッチャーフィルターはアプリを維持するのを難しくする可能性を持っていますが。
賢く使えばとても強力ですが、それぞれのURLのためにいちいちレスポンスハンドラーを加えるのは
よくありません。全てにフィルターが必要でないことを心に留めておいて下さい。 `Controllers` と
`Components` は普通、全てのリクエスト要求コードを正確に生成します。

.. meta::
    :title lang=ja: ディスパッチャーフィルター
    :description lang=ja: ディスパッチャーフィルターはCakePHPがリクエストやレスポンスが送られる前にそれを編集するための ミドルレイヤー
    :keywords lang=ja: middleware, ミドルウェア,filter, フィルター, ディスパッチャー, request, リクエスト, response, レスポンス, rack, application stack, events, beforeDispatch, afterDispatch, router, ルーター, ルーティング
