JsHelper
########

.. php:class:: JsHelper(View $view, array $settings = array())

.. warning::

    現在、JsHelper は非推奨です。 3.x で完全に削除されます。
    可能なら、通常の JavaScript の使用と、JavaScript ライブラリとの直接的な
    やりとりをお勧めします。

プロジェクト開始当初より、 CakePHP の JavaScript に関するサポートは、
Prototype/Scriptaculous によるものでした。 我々は未だこれらの JavaScript
ライブラリが素晴らしいものであると考えてはいますが、コミュニティからは他の
ライブラリのサポートを要望されてきました。Prototype を捨てて他の JavaScript
ライブラリに取り換えるという方法ではなく、アダプタベースのヘルパーを新たに作り、
そして最もリクエストの多い３種類のライブラリを採用しました。
Prototype/Scriptaculous、 Mootools/Mootools-more、そして jQuery/jQuery
UI です。 これらの API は以前の AjaxHelper ほどには多機能ではありませんが、
このアダプタベースのソリューションのほうが開発者に必要なパワーと柔軟性を与え、
各アプリケーションごとのニーズに適応した実装が可能になると感じています。

JavaScript エンジンは、新しい JsHelper のバックボーンです。
各 JavaScript エンジンは、抽象化 JavaScript 要素を、使用されている
JavaScript ライブラリの種類に応じて、実際の JavaScript に変換します。
加えて、他から利用可能な機能拡張システムを形成します。

指定した JavaScript エンジンの利用
==================================

はじめに、あなたが使用する JavaScript ライブラリを全てダウンロードして、
``app/webroot/js`` 以下に置いてください。

その時、あなたのページにそのライブラリが含まれていなければなりません。
それを全てのページに含めるためには、 ``app/View/Layouts/default.ctp``
の <head> セクションに以下の行を追加してください。 ::

    echo $this->Html->script('jquery'); // Include jQuery library

``jquery`` を、あなたのライブラリファイルの名前で置き換えてください。
(.js が名前に追加されます。)

デフォルトでは、スクリプトはキャッシュされ、あなたは、明示的にキャッシュを
出力しなければなりません。各ページの最後でこれを行うためには、 ``</body>``
タグで閉じる直前に以下の行を含めて下さい。 ::

    echo $this->Js->writeBuffer(); // Write cached scripts

.. warning::

    あなたのページにライブラリを含めなければなりません。そして、ヘルパーを機能させる
    ためにキャッシュを出力しなければなりません。

JavaScript エンジンの選択は、あなたのコントローラのヘルパーを含める際に宣言します。 ::

    public $helpers = array('Js' => array('Jquery'));

上記は、あなたのビューの中の JsHelper のインスタンスで Jquery エンジンを使います。
もし、エンジンを指定しなかった場合、デフォルトで jQuery エンジンが使用されます。
上で述べているように、コアで３つのエンジンが実装されています。しかし、
ライブラリ互換性を拡張することをコミュニティに推奨しています。

他のライブラリと jQuery の利用
------------------------------

jQuery ライブラリ、そして事実上、それらのプラグインの全ては、
jQuery 名前空間に束縛されます。一般規則として、 "グローバル" オブジェクトは、
jQuery 名前空間の中に上手に格納されます。あなたは、jQuery と他のライブラリ
(Prototype, MooTools, YUI など) との間で衝突してはなりません。

それには、一つの注意点があります。
**デフォルトで、jQuery は "$" を "jQuery" のショートカットとして利用する事** です。

"$" ショートカットを上書きするために、 jQueryObject 変数を使用します。 ::

    $this->Js->JqueryEngine->jQueryObject = '$j';
    echo $this->Html->scriptBlock(
        'var $j = jQuery.noConflict();',
        array('inline' => false)
    );
    // noconflict モードで実行する事を jQuery に伝えます。

独自ヘルパーの中で JsHelper の利用
----------------------------------

あなたの独自ヘルパーの中の ``$helpers`` 配列の中で
JsHelper を宣言してください。 ::

    public $helpers = array('Js');

.. note::

    独自ヘルパーの中で JavaScript エンジンの宣言はできません。
    それをしても反映されません。

もし、他の JavaScript エンジンを使いたい場合、以下のように
コントローラの中でヘルパーを設定してください。 ::

    public $helpers = array(
        'Js' => array('Prototype'),
        'CustomHelper'
    );


.. warning::

    あなたのコントローラの中の ``$helpers`` 配列の **先頭** に JsHelper と
    そのエンジンを宣言する事に注意してください。

選ばれた JavaScript エンジンがもし見つからない場合、あなたのヘルパーの中で
JsHelper オブジェクトから消えてしまう (デフォルトに置き換えられる）かもしれません。
そして、あなたの JavaScript ライブラリとは合わないコードを取得してしまいます。

JavaScript エンジンの作成
=========================

JavaScript エンジンヘルパーは、いくつかの制約はありますが普通のヘルパーの習慣に
従います。 それらは ``Engine`` サフィックスが必要です。
``DojoHelper`` は好ましくなく、 正しくは ``DojoEngineHelper`` です。
さらに、新しい API の多くに影響を与えるため ``JsBaseEngneHelper``
を継承すべきです。

JavaScript エンジンの使い方
===========================

``JsHelper`` は、いくつかのメソッドを用意し、エンジンヘルパーの表の面で
動作します。ごく稀な場合を除いて、エンジンヘルパーに直接アクセスすべきでは
ありません。 ``JsHelper`` の表の機能は、バッファリングやメソッドチェーン
を便利にします。 (メソッドチェーンは PHP5 上でのみ動作します。)

``JsHelper`` は、デフォルトでは、生成されたすべてのスクリプトコードは、
バッファに蓄積し、ビュー・エレメント・レイアウトを通してスクリプトを収集し、
一か所に出力します。バッファに蓄積したスクリプトの出力は、
``$this->Js->writeBuffer();`` によって行われます。これは、スクリプトタグ内の
バッファの内容を返します。 ``$bufferScripts`` プロパティもしくは、
メソッド内の ``$options`` 引数に ``buffer => false`` を設定することで、
大規模に無効化することができます。

JavaScript 内の多くのメソッドが DOM のエレメントのセレクタで始める時、
``$this->Js->get()`` は $this を返し、セレクタを使用するために
メソッドチェーンが利用できます。メソッドチェーンは、短く記述でき、
コードの表現力が上がります。 ::

    $this->Js->get('#foo')->event('click', $eventCode);

上記がメソッドチェーンの例です。メソッドチェーンは、 PHP4 では不可能なので、
下記のサンプルのように記述します。 ::

    $this->Js->get('#foo');
    $this->Js->event('click', $eventCode);

共通のオプション
----------------

JavaScript ライブラリが変更可能な開発を簡素化する試みにおいて、 ``JsHelper``
は共通のオプションに対応します。これらの共通オプションは、内部的には
ライブラリが用意したオプションに対応します。JavaScript を切り替える予定がない場合、
これらのライブラリは、すべてのネイティブなコールバックやオプションに対応します。

コールバックのラッッピング
--------------------------

デフォルトで、すべてのコールバックオプションは、正しい引数を持つ無名関数に
ラップされます。オプション配列に ``wrapCallbacks = false`` を指定することで、
この振る舞いを無効化できます。

バッファ化スクリプトの動作
--------------------------

'Ajax' タイプの機能の前の実装の一つの欠点は、ドキュメントの中で
スクリプトタグが分散することでした。そして、レイアウト中でエレメントを
追加するスクリプトのバッファに無力でした。新しい JsHelper を使用した場合、
両方の課題を回避することができます。 ``$this->Js->writeBuffer()`` を
レイアウトファイルの ``</body>`` タグの直前におくことをお勧めします。
これは、レイアウト要素の中で生成されたすべてのスクリプトを
一か所に出力することになります。バッファに蓄積されたスクリプトは、
インクルードされたスクリプトファイルから独立して処理されることに
注意してください。

.. php:method:: writeBuffer($options = array())

コードブロックにそれまで生成されたすべての JavaScript を出力します。
もしくは、ファイルにキャッシュし、スクリプトのリンクを返します。

**オプション**

-  ``inline`` - true にセットすると、スクリクトブロックのインラインとして
   出力されます。もし ``cache`` も true の場合、スクリプトリンクタグが
   生成されます。 (デフォルトは true)
-  ``cache`` - true にセットすると、スクリプトはファイルにキャッシュされ、
   リンクされます。 (デフォルトは false)
-  ``clear`` - false にセットすると、スクリプトのキャッシュが
   クリアされることを防ぎます。 (デフォルトは true)
-  ``onDomReady`` - domready イベント内にキャッシュされたスクリプトを
   ラップします。 (デフォルトは true)
-  ``safe`` - インラインブロックが生成された場合、 <![CDATA[ ... ]]>
   でラップしなければなりません。 (デフォルトは true)

``writeBuffer()`` でキャッシュファイルを作成するためには、
``webroot/js`` が書き込み可能で、ブラウザーがどのページで生成された
スクリプトリソースもキャッシュできることが必要です。

.. php:method:: buffer($content)

``$content`` を内部のスクリプトバッファに追加します。

.. php:method:: getBuffer($clear = true)

現在のバッファの内容を取得します。同時にバッファをクリアしないために false
を渡してください。

**通常はバッファしないバッファリングメソッド**

ヘルパーのいくつかのメソッドは、デフォルトでバッファします。エンジンは、
デフォルトで以下のメソッドがバッファリます。

-  event
-  sortable
-  drag
-  drop
-  slider

追加で、 JsHelper の他のメソッドでバッファリングの利用を強制できます。
最後の引数にブーリアン型を追加することによって、他のメソッドでバッファ内に
蓄積することを強制できます。例えば、 ``each()`` メソッドは、通常では
バッファしません。 ::

    $this->Js->each('alert("whoa!");', true);

上記は、 ``each()`` メソッドにバッファを使用することを強制します。
逆に、バッファするメソッドでバッファしたくない場合、最後の引数に ``false``
を渡すことでできます。 ::

    $this->Js->event('click', 'alert("whoa!");', false);

これは、通常はバッファする event 関数に結果を返すことを強制します。

他のメソッド
============

コア JavaScript エンジンは、すべてのライブラリにわたって同じ機能を提供します。
ライブラリ固有のオプションに変換される共通のオプションのサブセットがあります。
これは、開発者に API の統合を可能にします。以下のメソッドのリストは、
CakePHP コアに含まれるすべてのエンジンに対応します。　あなたには、
``オプション`` と ``イベントオプション`` は別のリストに見えるかもしれませんが、
両方のパラメータは、メソッドの ``$options`` 配列で指定します。

.. php:method:: object($data, $options = array())

    ``$data`` を JSON にシリアライズします。このメソッドは、 ``json_encode()``
    のプロクシです。 ``$options`` パラメータを通して追加されたいくつかの追加機能もあります。

    **オプション:**

    -  ``prefix`` - 文字列を戻り値の先頭に追加します
    -  ``postfix`` - 文字列を戻り値の後ろに追加します。

    **使用例**::

        $json = $this->Js->object($data);

.. php:method:: sortable($options = array())

    ドラッグアンドドロップでソートする要素のリストを作成するための JavaScript
    スニペットを生成します。

    **オプション**

    -  ``containment`` - 移動アクションのためのコンテナ
    -  ``handle`` - エレメントを指定するセレクタ。このエレメントは、
       ソートアクションのみを開始します。
    -  ``revert`` - 最終的なポジションにソート可能に移動するために
       エフェクトを使用するかどうか。
    -  ``opacity`` - プレースホルダーの不透明度
    -  ``distance`` - ソート可能な距離は、ソートを始める前に
       ドラッグされなければなりません。

    **イベントオプション**

    -  ``start`` - ソートが開始時にイベントが発生します
    -  ``sort`` - ソート中にイベントが発生します
    -  ``complete`` - ソートが完了時にイベントが発生します

    その他のオプションは、各 JavaScript ライブラリによって対応され、
    それらオプションやパラメータに関するより詳しい情報は、あなたの JavaScript
    ライブラリのドキュメントをチェックしてください。

    **使用例**::

        $this->Js->get('#my-list');
        $this->Js->sortable(array(
            'distance' => 5,
            'containment' => 'parent',
            'start' => 'onStart',
            'complete' => 'onStop',
            'sort' => 'onSort',
            'wrapCallbacks' => false
        ));

    あなたが jQuery エンジンを使用していると仮定すると、生成された
    JavaScript ブロック内の以下のコードが取得できます。

    .. code-block:: javascript

        $("#myList").sortable({
            containment:"parent",
            distance:5,
            sort:onSort,
            start:onStart,
            stop:onStop
        });

.. php:method:: request($url, $options = array())

    ``XmlHttpRequest`` や 'AJAX' リクエストを作成するための JavaScript
    スニペットを生成します。

    **イベントオプション**

    -  ``complete`` - 完了時のコールバック
    -  ``success`` - 成功時のコールバック
    -  ``before`` - リクエスト初期化時のコールバック
    -  ``error`` - 失敗時のコールバック

    **オプション**

    -  ``method`` - より多くのライブラリで、デフォルトで GET リクエストを
       作成するメソッド
    -  ``async`` - 非同期のリクエストをしたいかどうか
    -  ``data`` - 追加で送信するデータ
    -  ``update`` - レスポンスの内容を更新するための DOM ID
    -  ``type`` - レスポンスのデータタイプ。 'json' と 'html' に対応。
       多くのライブラリでは、デフォルトは html です。
    -  ``evalScripts`` - <script> タグを eval するかどうか
    -  ``dataExpression`` - ``data`` キーがコールバックとして扱います。
       別の JavaScript 表現として ``$options['data']`` を提供するのに
       便利です。

    **使用例**::

        $this->Js->event(
            'click',
            $this->Js->request(
                array('action' => 'foo', 'param1'),
                array('async' => true, 'update' => '#element')
            )
        );

.. php:method:: get($selector)

    CSS セレクタで内部 '選択' をセットします。有効な選択は、新しい選択がなされるまで
    後の操作で使用します。 ::

        $this->Js->get('#element');

    ``JsHelper`` は、``#element`` の選択上でメソッドをもとに他のすべての要素を参照します。
    有効な選択を変更するために、新しい要素で ``get()`` を再度実行します。

.. php:method:: set(mixed $one, mixed $two = null)

    JavaScript の中の変数を渡します。 :php:meth:`JsHelper::getBuffer()`` や
    :php:meth:`JsHelper::writeBuffer()` でバッファが取得された時、
    出力される変数をセットできます。 出力するために使用される JavaScript の変数は、
    :php:attr:`JsHelper::$setVariable` で制御できます。

.. php:method:: drag($options = array())

    ドラッグ可能な要素の作成。

    **オプション**

    -  ``handle`` - 要素を処理するセレクタ
    -  ``snapGrid`` - 素早く動かすピクセルグリッド、 array(x, y) 
    -  ``container`` - ドラッグ可能な要素ための境界の範囲として動作する要素

    **イベントオプション**

    -  ``start`` - ドラッグ開始時のイベント
    -  ``drag`` - ドラッグのすべてのステップで発生するイベント
    -  ``stop`` - ドラッグ停止時 (マウスを離した時) のイベント

    **使用例**::

        $this->Js->get('#element');
        $this->Js->drag(array(
            'container' => '#content',
            'start' => 'onStart',
            'drag' => 'onDrag',
            'stop' => 'onStop',
            'snapGrid' => array(10, 10),
            'wrapCallbacks' => false
        ));

    もしあなたが jQuery エンジンを使用していた場合、以下のコードがバッファに
    追加されます。

    .. code-block:: javascript

        $("#element").draggable({
            containment:"#content",
            drag:onDrag,
            grid:[10,10],
            start:onStart,
            stop:onStop
        });

.. php:method:: drop($options = array())

    ドラッグ可能な要素を受け入れる要素を作成します。ドラッグされた要素のための
    ドロップする範囲として動作します。

    **オプション**

    -  ``accept`` - このドロップ可能な要素のセレクタは、受け入れます。
    -  ``hoverclass`` - ドロップが重なった時、ドロップ可能な要素に追加するクラス。

    **イベントオプション**

    -  ``drop`` - ドロップ範囲内に要素がドロップされた時のイベント
    -  ``hover`` - ドロップ範囲内にドラッグが入ってきた時のイベント
    -  ``leave`` - ドラッグがドロップ範囲からドロップされずにドラッグが
       削除された時のイベント

    **使用例**::

        $this->Js->get('#element');
        $this->Js->drop(array(
            'accept' => '.items',
            'hover' => 'onHover',
            'leave' => 'onExit',
            'drop' => 'onDrop',
            'wrapCallbacks' => false
        ));

    もしあなたが jQuery エンジンを使用していた場合、以下のコードがバッファに
    追加されます。

    .. code-block:: javascript

        $("#element").droppable({
            accept:".items",
            drop:onDrop,
            out:onExit,
            over:onHover
        });

    .. note::

        Mootools のドロップは、他のライブラリと違った機能を果たします。
        ドロップは、Drag の拡張として実装されます。 加えて、ドラッグ可能な要素を
        get() で選択します。ドロップ可能な要素のセレクタルールを指定する必要があります。
        さらに、Mootools のドロップは、Drag からすべてのオプションを継承します。

.. php:method:: slider($options = array())

    スライダー UI ウィジェット内の要素を変換する JavaScript のスニペットを作成します。
    追加の使い方や機能は、あなたのライブラリ実装をご覧ください。

    **オプション**

    -  ``handle`` - スライドで使用する要素の id
    -  ``direction`` - スライダーの方向。 'vertical' もしくは 'horizontal'
    -  ``min`` - スライダーの最小値
    -  ``max`` - スライダーの最大値
    -  ``step`` - スライダーが持っているステップや目盛りの数
    -  ``value`` - スライダーの初期オフセット

    **イベント**

    -  ``change`` - スライダーの値が更新された時には発生
    -  ``complete`` - ユーザーがスライドを止めた時に発生

    **使用例**::

        $this->Js->get('#element');
        $this->Js->slider(array(
            'complete' => 'onComplete',
            'change' => 'onChange',
            'min' => 0,
            'max' => 10,
            'value' => 2,
            'direction' => 'vertical',
            'wrapCallbacks' => false
        ));

    もしあなたが jQuery エンジンを使用していた場合、以下のコードがバッファに
    追加されます。

    .. code-block:: javascript

        $("#element").slider({
            change:onChange,
            max:10,
            min:0,
            orientation:"vertical",
            stop:onComplete,
            value:2
        });

.. php:method:: effect($name, $options = array())

    基本的なエフェクトを作成します。デフォルトで、このメソッドは、バッファせず、
    その結果を返します。

    **対応するエフェクト名**

    以下のエフェクトは、すべての JsEngine が対応しています。

    -  ``show`` - 要素の表示
    -  ``hide`` - 要素を隠す
    -  ``fadeIn`` - 要素のフェードイン
    -  ``fadeOut`` - 要素のフェードアウト
    -  ``slideIn`` - 要素の中にスライド
    -  ``slideOut`` - 要素の外にスライド

    **オプション**

    -  ``speed`` - アニメーションが起こる速度。受け付けられる値は 'slow' と 'fast'
       です。

    **使用例**

    jQuery エンジンを使用していた場合::

        $this->Js->get('#element');
        $result = $this->Js->effect('fadeIn');

        // $result は $("#foo").fadeIn(); を含みます。

.. php:method:: event($type, $content, $options = array())

    現在のセレクタとイベントをひも付けます。　 ``$type`` は、任意の通常の DOM イベントや
    あなたのライブラリがサポートする独自のイベントタイプです。 ``$content`` は、
    コールバックする関数本体を含みます。コールバックは、 ``$options`` で無効にしない限り
    ``function (event) { ... }`` でラップされます。

    **オプション**

    -  ``wrap`` - コールバックを無名関数でラップしたいかどうか (デフォルトは true)
    -  ``stop`` - イベントを停止したいかどうか (デフォルトは true)

    **使用例**::

        $this->Js->get('#some-link');
        $this->Js->event('click', $this->Js->alert('hey you!'));

    もしあなたが jQuery ライブラリを使用していた場合、以下の JavaScript コードを
    取得します。

    .. code-block:: javascript

        $('#some-link').bind('click', function (event) {
            alert('hey you!');
            return false;
        });

    ``stop`` オプションに false をセットすることで、 ``return false;`` を
    削除できます。 ::

        $this->Js->get('#some-link');
        $this->Js->event(
            'click',
            $this->Js->alert('hey you!'),
            array('stop' => false)
        );

    もしあなたが jQuery ライブラリを使用していた場合、以下の JavaScript コードが
    バッファに追加されます。デフォルトのブラウザイベントはキャンセルされないことに
    注意してください。

    .. code-block:: javascript

        $('#some-link').bind('click', function (event) {
            alert('hey you!');
        });

.. php:method:: domReady($callback)

    特別な 'DOM ready' イベントを作成します。 :php:func:`JsHelper::writeBuffer()`
    は、domReady メソッド中のバッファされたスクリプトを自動的にラップします。

.. php:method:: each($callback)

    現在選択中の要素に繰り返しスニペットを作成し、 ``$callback`` を挿入します。

    **使用例**::

        $this->Js->get('div.message');
        $this->Js->each('$(this).css({color: "red"});');

    jQuery エンジンを使用していると、以下の JavaScript が作成されます。

    .. code-block:: javascript

        $('div.message').each(function () { $(this).css({color: "red"}); });

.. php:method:: alert($message)

    ``alert()`` スニペットを含む JavaScript スニペットを作成します。デフォルトで、
    ``alert`` はバッファせずスクリプトのスニペットを返します。 ::

        $alert = $this->Js->alert('Hey there');

.. php:method:: confirm($message)

    ``confirm()`` スニペットを含む JavaScript スニペットを作成します。
    デフォルトで、 ``confirm`` はバッファせずスクリプトのスニペットを返します。 ::

        $alert = $this->Js->confirm('Are you sure?');

.. php:method:: prompt($message, $default)

    ``prompt()`` スニペットを含む JavaScript スニペットを作成します。
    デフォルトで、 ``prompt`` は、バッファせずスクリプトのスニペットを返します。 ::

        $prompt = $this->Js->prompt('What is your favorite color?', 'blue');

.. php:method:: submit($caption = null, $options = array())

    ``XmlHttpRequest`` でフォームをサブミットすることを有効にするサブミットボタンを
    作成します。 :php:func:`FormHelper::submit()` と JsBaseEngine::request() と
    JsBaseEngine::event() のオプションを含みます。

    このメソッドでフォームをサブミットすると、ファイルは送信できません。
    ファイルは、 ``XmlHttpRequest`` で転送せず、 iframe やこのヘルパーの
    範囲を超えるような特別な設定を要求します。

    **オプション**

    -  ``url`` - サブミットするための XHR リクエストを送る URL
    -  ``confirm`` - リクエストを送る前に表示する確認メッセージ
       confirm を使うことで、生成された XmlHttpRequest のコールバックメソッド
       置き換えません。
    -  ``buffer`` - バッファを無効にし、リンクをするためにスクリプトタグを返します。
    -  ``wrapCallbacks`` - 自動的にコールバックをラップするのを無効化するために
       false にセットします。

    **使用例**::

        echo $this->Js->submit('Save', array('update' => '#content'));

    上記は onclick イベントを追加したサブミットボタンを作成します。click イベントは、
    デフォルトでバッファされます。 ::

        echo $this->Js->submit('Save', array(
            'update' => '#content',
            'div' => false,
            'type' => 'json',
            'async' => false
        ));

    サブミットを使用時の :php:func:`FormHelper::submit()` と :php:func:`JsHelper::request()`
    の両方のオプションをどのように組み込めるかどうかを示しています。

.. php:method:: link($title, $url = null, $options = array())

    クリックイベントを起こす HTML アンカー要素を作成します。
    :php:func:`HtmlHelper::link()` 、 :php:func:`JsHelper::request()` 、
    :php:func:`JsHelper::event()` と同様のオプションが含まれます。
    ``$options`` は、生成するアンカー要素に追加される :term:`HTML属性` 配列または
    :php:func:`JsHelper::request()` にオプションとして渡す ``$htmlAttributes``
    です。もし指定がなければ、ランダムに生成されたものが、リンク生成ごとに作成されます。

    **オプション**

    -  ``confirm`` - イベントを送信する前に confirm() ダイアログを生成します。
    -  ``id`` - 独自 id を使用します。
    -  ``htmlAttributes`` - 追加の非標準 html 属性。標準の属性は、 class、
       id、 title、 escape、 onblur、 onfocus。
    -  ``buffer`` - バッファを無効にし、リンクするためのスクリプトタグを返します。

    **使用例**::

        echo $this->Js->link(
            'Page 2',
            array('page' => 2),
            array('update' => '#content')
        );

    ``/page:2`` を指し、レスポンスで #content を更新するリンクを作成します。

    追加の独自の属性を追加するために ``htmlAttributes`` オプションを使用します。 ::

        echo $this->Js->link('Page 2', array('page' => 2), array(
            'update' => '#content',
            'htmlAttributes' => array('other' => 'value')
        ));

    以下の HTML を出力します:

    .. code-block:: html

        <a href="/posts/index/page:2" other="value">Page 2</a>

.. php:method:: serializeForm($options = array())

    $selector に付属していたフォームをシリアライズします。もし、現在の選択が
    form 要素の場合、 $isForm に ``true`` を渡してください。
    現在の選択に付属していた form または form 要素を、XHR 操作で使用するために
    string/json オブジェクト（ライブラリ実装に依存する）に変換します。

    **オプション**

    -  ``isForm`` - 現在の選択が form もしくは input かどうか
       (デフォルトは false)
    -  ``inline`` - 関連する構文が他の JS 構文の中で使用されているかどうか
       (デフォルトは false)

    inline に false をセットすることで、後ろにつく ``;`` を削除することができます。
    これは、form 要素を他の JavaScript 操作の一部としてシリアライズしたり、
    オブジェクトのリテラル中の serialize メソッドを使用する必要があるとき便利です。

.. php:method:: redirect($url)

    ``window.location`` を使って ``$url`` にページをリダイレクトします。

.. php:method:: value($value)

    配列型の PHP の変数を JSON 相当の表現に変換します。JSON 互換文字列中の
    文字列をエスケープします。UTF-8 文字はエスケープされます。

.. _ajax-pagination:

AJAX ページ制御
================

1.2 の AJAX ページ制御のように、AJAX ページ制御のリンクの作成をプレーンな
HTML リンクの代わりに制御するために JsHelper が利用できます。

AJAX リンクの作成
------------------

AJAX リンクを作成する前に、 ``JsHelper`` で使用しているアダプタにマッチする
JavaScript ライブラリを含める必要があります。デフォルトで ``JsHelper`` は、
jQuery を使用します。あなたのレイアウト内に jQuery
(またはあなたが使用しているライブラリ) を含めて下さい。また、
``RequestHandlerComponent`` をあなたのコンポーネントに含めて下さい。
あなたのコントローラに以下を追加してください。 ::

    public $components = array('RequestHandler');
    public $helpers = array('Js');

以下は、あなたが使用したい JavaScript ライブラリ内にリンクします。
この例では、 jQuery を使用しています。 ::

    echo $this->Html->script('jquery');

1.2 と同様に、 プレーンな HTML のリンクの代わりに Javascript のリンク
したいことを ``PaginatorHelper`` に伝える必要があります。
そうするには、あなたのビューの先頭で ``options()`` を呼びます。 ::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true
    ));

これで :php:class:`PaginatorHelper` は、 JavaScript でリンクを
拡張することができ、 これらのリンクは ``#content`` 要素を更新します。
もちろん、この要素が存在しなければなりません。 しばしば、
``update`` オプションで指定した id にマッチする div で
``$content_for_layout`` をラップしたいことがあります。もし、
Mootools や Prototype アダプターを使用しているなら ``evalScripts`` を
true にセットすべきです。 ``evalScripts`` なしだと、これらのライブラリは
リクエスト同士をつなげることはできません。 ``indicator`` オプションは、
``JsHelper`` では対応せず、無視されます。

この時、ページ制御機能に必要な全てのリンクを作成します。
``JsHelper`` が自動的に全ての生成されたスクリプトの内容を、ソースコード中の
``<script>`` タグの数を減らすためにバッファする時、バッファを
書き出さなければなりません。ビューファイルの底に、以下を記述してください。 ::

    echo $this->Js->writeBuffer();

もし、これを除外した場合、AJAX ページ制御リンクの連携はできません。
バッファを書き出した時、それらはクリアされ、同じ JavaScript が２重に
出力される心配はありません。

エフェクトと遷移の追加
----------------------

``indicator`` をもはや対応していないとき、indicator エフェクトを
あなた自身が追加しなければなりません。

.. code-block:: php

    <!DOCTYPE html>
    <html>
        <head>
            <?php echo $this->Html->script('jquery'); ?>
            //more stuff here.
        </head>
        <body>
        <div id="content">
            <?php echo $this->fetch('content'); ?>
        </div>
        <?php
            echo $this->Html->image(
                'indicator.gif',
                array('id' => 'busy-indicator')
            );
        ?>
        </body>
    </html>

indicator.gif ファイルを app/webroot/img フォルダ内におくことを忘れないでください。
indicator.gif がページロード中に直ちに表示される場面が考えられます。
メインの CSS ファイル内に ``#busy-indicator { display:none; }``
を設定しておく必要があります。

上記のレイアウトで、indicator ビジーを示すアニメーションを表示する indicator
画像ファイルが含まれています。それは、 ``JsHelper`` で表示、非表示します。
そうするためには ``options()`` 関数を更新する必要があります。 ::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true,
        'before' => $this->Js->get('#busy-indicator')->effect(
            'fadeIn',
            array('buffer' => false)
        ),
        'complete' => $this->Js->get('#busy-indicator')->effect(
            'fadeOut',
            array('buffer' => false)
        ),
    ));

これは、 ``#content`` の div が更新される前後に busy-indicator
要素を表示・非表示します。 ``indicator`` も削除され、 ``JsHelper`` によって
提供される新しい機能は、作成するためのより制御し複雑なエフェクトが可能です。


.. meta::
    :title lang=ja: JsHelper
    :description lang=ja: The Js Helper supports the JavaScript libraries Prototype, jQuery and Mootools and provides methods for manipulating javascript.
    :keywords lang=ja: js helper,javascript,cakephp jquery,cakephp mootools,cakephp prototype,cakephp jquery ui,cakephp scriptaculous,cakephp javascript,javascript engine
