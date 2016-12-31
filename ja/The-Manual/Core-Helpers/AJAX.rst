AJAX
####

JavascriptHelper と AjaxHelper は CakePHP 1.3
から非推奨になりました。代わりに JsHelper + HtmlHelper
を使用してください。詳しくは
`1.2から1.3への移行ガイド </ja/view/1561/Migrating-from-CakePHP-1-2-to-1-3#View-and-Helpers-1566>`_\ を参照してください。

Ajax ヘルパーは、Ajax
操作やクライアントサイドのエフェクト（効果）用の人気のある Prototype や
script.aculo.us ライブラリのユーティリティです。Ajax
ヘルパーを使用するには、Javascript ライブラリの最新バージョンを
`www.prototypejs.org <http://www.prototypejs.org>`_ や
`http://script.aculo.us <http://script.aculo.us/>`_
から入手し、/app/webroot/js/ に配置しなければなりません。さらに、Ajax
ヘルパー機能を必要とするレイアウトやビュー内で、 Prototype や
script.aculo.us JavaScript ライブラリを読み込む必要があります。

コントローラ内で Ajax や Javascript ヘルパーを読み込む必要があります:

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

javascript ヘルパーをコントローラ内で読み込むと、Prototype や
Scriptaculous を読み込むために javascript ヘルパーの link()
メソッドを使用できます:

::

    echo $html->script('prototype');
    echo $html->script('scriptaculous'); 

これでビューで Ajax ヘルパーを使用できるようになります:

::

    $ajax->whatever();

`RequestHandler コンポーネント </ja/view/174/request-handling>`_
がコントローラに含まれている場合、CakePHP はアクションが Ajax
を通してリクエストされた際に自動的に Ajax レイアウトを適用します。

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

AjaxHelper のオプション
=======================

AjaxHelper のメソッドのほとんどは、$options
配列で指定できます。この配列を使用して、AjaxHelper
の振る舞いを指定することができます。ヘルパーの特定のメソッドを見る前に、この特別な配列を通して設定可能な異なるオプションを見てみましょう。後に
AjaxHelper のメソッドを使い始めると、この章を参照したくなることでしょう

General Options
---------------

``$option`` のキー

説明

``$options['evalScripts']``

戻り値として得られるコンテンツの中にある script
タグを評価するかどうかを決定します。デフォルトは *true* です。

``$options['frequency']``

インターバルベースのチェックを実行する秒数。

``$options['indicator']``

リクエストがロード中に表示され、完了したら非表示になる要素の DOM ID 。

``$options['position']``

置き換えではなく挿入するために、このオプションを使用します。挿入場所を
*top*, *bottom*, *after*, *before* で指定します。

``$options['update']``

返された内容で更新される DOM 要素の id 。

``$options['url']``

呼び出したい「コントローラ/アクション」形式の URL 。

``$options['type']``

リクエストが 'synchronous'(同期) かあるいは 'asynchronous'(非同期,
デフォルト) かを示します。

``$options['with']``

GET メソッドの URL に追加する、あるいは、その他のメソッドで送信する body
に追加する、 URL エンコードされた文字列。たとえば、 ``x=1&foo=bar&y=2``
というようにします。パラメータは、フォーマットに依存し、\ ``$this->params['form']``
あるいは ``$this->data`` でアクセスできます。詳細は `Prototype の
Serialize <http://www.prototypejs.org/api/form/serialize>`_
メソッドを参照してください。

コールバックオプション
----------------------

コールバックオプションを使用すると、リクエストプロセスの特定のポイントで
Javascript 関数を呼び出すことができます。AjaxHelper
操作の、前・後・実行中にちょっとしたロジックを挿入する方法を探しているなら、このコールバックを使用してください。

$options キー

詳細

$options['condition']

リクエストが初期化される前に *true* をセットする必要がある JavaScript
コードスニペット

$options['before']

拡張した before
リクエストが作成されます。このコールバックの通常の使用方法は、プログレスバーの表示を有効にすることです。

$options['confirm']

実行前に JavaScript の confirm メッセージに表示するテキスト

$options['loading']

データがサーバから取り出されている間、実行されるコールバックコード

$options['after']

リクエストが実行された後すぐに呼び出される
JavaScript。$options['loading']
コールバックが実行される前に呼び出されます。

$options['loaded']

クライアントがリモートドキュメントが受け取った時に実行されるコールバックコード。

$options['interactive']

ユーザが、たとえ読み込みが完了していないときでもリモートドキュメントに作用する場合に呼び出されます。

$options['complete']

XMLHttpRequest が完了した際に実行される Javascript コールバック

メソッド
========

link
----

``link(string $title, string $href, array $options, string $confirm, boolean $escapeTitle)``

``リンクをクリックしたときに、XMLHttpRequest を使用してバックグラウンドで呼び出される $options['url']``
または ``$href``
で定義されたリモートアクションへのリンクを返します。リクエストの結果は
DOM オブジェクトへ挿入され、その id は ``$options['update']``
で指定します。

``$options['url']`` が空白の場合、href が代わりに使用されます。

サンプル:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1 ), 
        array( 'update' => 'post' )
    ); 
    ?>

デフォルトでは、これらのリモートリクエストは、さまざまなコールバックが呼び出される間、非同期で実行されます。

サンプル:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'post', 1 ), 
        array( 'update' => 'post', 'complete' => 'alert( "Hello World" )'  )
    ); 
    ?>

同期実行を使用するには、\ ``$options['type'] = 'synchronous'``
を指定します。

自動的に ajax レイアウトをセットするには、コントローラ内で
*RequestHandler* コンポーネントを読み込みます。

デフォルトでは、対象要素の内容は置換されます。この振る舞いを変更するには、\ ``$options['position']``
を設定します。

サンプル:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1), 
        array( 'update' => 'post', 'position' => 'top'  )
    ); 
    ?>

``$confirm`` はリクエストを実行する前に、Javascript confirm()
メッセージを呼び出します。ユーザは実行を停止できます。

サンプル:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Delete Post', 
        array( 'controller' => 'posts', 'action' => 'delete', 1 ), 
        array( 'update' => 'post' ),
        'Do you want to delete this post?'
    ); 
    ?>

remoteFunction
--------------

``remoteFunction(array $options);``

この関数は JavaScript
を生成しますが、それはリモートコールを作成する必要があります。link()
のヘルパーとして主に使用されます。これは、なんらかの独自スクリプトを生成する必要がない限りあまり使用されません。

この関数の ``$options`` は ``link`` メソッドと同じです

サンプル:

::

    <div id="post">
    </div>
    <script type="text/javascript">
    <?php echo $ajax->remoteFunction( 
        array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ), 
            'update' => 'post' 
        ) 
    ); ?>
    </script>

HTML イベント属性に割り当てることもできます:

::

    <?php 
        $remoteFunction = $ajax->remoteFunction( 
            array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
            'update' => 'post' ) 
        ); 
    ?>
    <div id="post" onmouseover="<?php echo $remoteFunction; ?>" >
    Mouse Over This
    </div>

``$options['update']``
が渡されない場合、ブラウザはサーバのレスポンスを無視するでしょう。

remoteTimer
-----------

``remoteTimer(array $options)``

定期的に ``$options['frequency']`` 秒おきに ``$options['url']``
のアクションを呼び出します。ふつう特定の div（\ ``$options['update']``
で指定されたもの） をリモートコールの結果で更新します。

``remoteTimer`` は特別な ``$options['frequency']`` 以外は
``remoteMethod`` と同じです。

サンプル:

::

    <div id="post">
    </div>
    <?php
    echo $ajax->remoteTimer(
        array(
        'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
        'update' => 'post', 'complete' => 'alert( "request completed" )',
        'position' => 'bottom', 'frequency' => 5
        )
    );
    ?>

デフォルトの ``$options['frequency']`` は 10 秒です。

form
----

``form(string $params, string $type, array $options)``

$type ('post' または 'get') を通した通常の HTTP リクエストの代わりに
XMLHttpRequest を使用してアクションに submit する form
タグを返します。もしそうでない場合は、通常の振る舞いと変わるところはまったくありません。
submit されたデータはコントローラ内の $this->data
で利用できます。$options['update']
が指定された場合、結果ドキュメントで更新されます。コールバックも使用できます。

options
配列はモデル名を含まなければいけません。例えば次のようになります。

::

    $ajax->form('edit','post',array('model'=>'User','update'=>'UserInfoDiv'));

他の方法として、フォームから、異なるコントローラへ同時にデータを post
する場合は、次のようにします。

::

    $ajax->form(array('type' => 'post',
        'options' => array(
            'model'=>'User',
            'update'=>'UserInfoDiv',
            'url' => array(
                'controller' => 'comments',
                'action' => 'edit'
            )
        )
    ));

submit
------

``submit(string $title, array $options)``

submit ボタンを返します。このボタンは XMLHttpRequest を通して
$options['with'] で指定された DOM id をもつフォームを submit します。

observeField
------------

``observeField(string $fieldId, array $options)``

$field\_id で指定された DOM id を持つフィールドを ($options['frequency']
秒おきに) 監視し、その内容が変更されたときに XMLHttpRequest
を作成します。

::

    <?php echo $form->create( 'Post' ); ?>
    <?php $titles = array( 1 => 'Tom', 2 => 'Dick', 3 => 'Harry' ); ?>   
    <?php echo $form->input( 'title', array( 'options' => $titles ) ) ?>
    </form>

    <?php 
    echo $ajax->observeField( 'PostTitle', 
        array(
            'url' => array( 'action' => 'edit' ),
            'frequency' => 0.2,
        ) 
    ); 
    ?>

``observeField`` では ``link`` と同じオプションを使います。

送信するフィールドの指定は、 ``$options['with']``
使用します。\ ``Form.Element.serialize('$fieldId')``
のデフォルト値となります。送信したデータは、コントローラ中の
``$this->data``
で利用可能になります。この関数では、コールバックが利用できます。

フィールドが変更された時に、フォーム全体を送信するには、
``$options['with'] = Form.serialize( $('Form ID') ) を使用してください。``

observeForm
-----------

``observeForm(string $fieldId, array $options)``

observeField() と同様ですが、DOM id の $form\_id
で指定された全フォームに作用します。指定される $options は、
$options['with']
オプションのデフォルト値がフォームのシリアライズされた（リクエストストリング）値を評価することを除いては、
observeField() と同じです。

autoComplete
------------

``autoComplete(string $fieldId, string $url,  array $options)``

オートコンプリートが有効で $fieldId
をもつテキストフィールドを描画します。$url
のリモートアクションは適切なオートコンプリートの用語リストを返すべきです。よく順序づけされていないリストをこのために使用します。まず、コントローラアクションを構築し、ユーザの入力に基づいたリストに必要なデータを取り出し形成します:

::

    function autoComplete() {
        // 部分文字列は $this->data['Post']['subject'] として
        // オートコンプリートフィールドで構成されるでしょう。
        $this->set('posts', $this->Post->find('all', array(
                    'conditions' => array(
                        'Post.subject LIKE' => $this->data['Post']['subject'].'%'
                    ),
                    'fields' => array('subject')
        )));
        $this->layout = 'ajax';
    }

つぎに、\ ``app/views/posts/auto_complete.ctp``
を作成し、そのデータを使用して (X)HTML
に順序づけされないリストを作成します:

::

    <ul>
     <?php foreach($posts as $post): ?>
         <li><?php echo $post['Post']['subject']; ?></li>
     <?php endforeach; ?>
    </ul> 

最後にビューで autoComplete()
を使用し、オートコンプリートが有効なフォームフィールドを作成します:

::

    <?php echo $form->create('User', array('url' => '/users/index')); ?>
        <?php echo $ajax->autoComplete('Post.subject', '/posts/autoComplete')?>
    <?php echo $form->end('View Post')?>

autoComplete() 呼び出しが正常に動作すると、CSS
を使用してオートコンプリートが有効な選択ボックスをデザインします。結局次のようになります:

::

    div.auto_complete    {
         position         :absolute;
         width            :250px;
         background-color :white;
         border           :1px solid #888;
         margin           :0px;
         padding          :0px;
    } 
    li.selected    { background-color: #ffb; }

isAjax
------

``isAjax()``

現在のリクエストがビュー内でPrototype Ajax
リクエストかどうかをチェックします。ブール値を返します。コンテンツブロックを表示したり隠したりするプレゼンテーションロジックで使用できます。

drag & drop
-----------

``drag(string $id, array $options)``

$id で指定された DOM 要素からドラッグ可能な要素を作成します。$options
で指定できるパラメータの詳細は
`https://github.com/madrobby/scriptaculous/wikis/draggable <https://github.com/madrobby/scriptaculous/wikis/draggable>`_
を見てください。

一般的なオプションは次です:

+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options キー            | 内容                                                                                                                                                                                                                                                                             |
+==========================+==================================================================================================================================================================================================================================================================================+
| $options['handle']       | 要素が埋め込まれたハンドルによってのみドラッグ可能にするかどうかを指定します。値は、要素のリファレンス、あるいは要素の id 、あるいは CSS クラス値を参照する文字列でなければなりません。この CSS クラス値をもつ要素内にある最初の子または孫要素は、ハンドルとして使用されます。   |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['revert']       | true を指定すると、要素はドラッグが終了したときに自身の元の位置を返します。revert はドラッグ終了時に呼び出される任意の関数の参照にすることもできます。                                                                                                                           |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['constraint']   | 強制的に '水平（horizontal）' または '垂直（vertical）' にドラッグさせます。空白の場合は強制されません。                                                                                                                                                                         |
+--------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``drop(string $id, array $options)``

$id で指定された DOM 要素を作成し、ドロップ可能な要素にします。$options
でパラメータを指定できます。詳細は
`https://github.com/madrobby/scriptaculous/wikis/droppables <https://github.com/madrobby/scriptaculous/wikis/droppables>`_
を見てください。

一般的なオプションは次です:

+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options キー             | 内容                                                                                                                                                                   |
+===========================+========================================================================================================================================================================+
| $options['accept']        | ドロップ可能にする要素の CSS クラスを記述する文字列、あるいは javascript の文字列配列を指定します。ドロップ要素は指定された CSS クラスの要素のみ操作を受け入れます。   |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['containment']   | 与えられた要素（要素の id）に含まれる場合、ドロップ可能要素はドラッグされた要素のみを受け入れます。文字列、あるいは id 参照の javascript 配列で指定できます。          |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['overlap']       | 'horizontal' あるいは 'vertical' を設定すると、指定された軸の 50% 以上ドロップ場所に重なっている場合に、ドロップ可能要素はドラッグ可能要素にのみ反応します。           |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['onDrop']        | ドラッグされた要素がドロップ可能な要素にドロップされたときに、呼び出される javascript のコールバック。                                                                 |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``dropRemote(string $id, array $options)``

ドロップ対象を作成します。ドラッグ可能な要素がそこにドロップされたときに、XMLHttpRequest
を生成します。この関数の $options 配列は drop() や link()
で指定されるものと同じです。

slider
------

``slider(string $id, string $track_id, array  $options)``

方向スライダーコントロールを作成します。詳細は、
`http://wiki.script.aculo.us/scriptaculous/show/Slider <http://wiki.script.aculo.us/scriptaculous/show/Slider>`_
をみてください。

一般的なオプションは次です:

$options キー

内容

$options['axis']

方向スライダーの方向（'horizontal' または
'vertical'）を指定します。デフォルトは horizontal です。

$options['handleImage']

ハンドルを表すイメージの
id。これはスライダーが有効な場合、無効なイメージでイメージをスワップアウトするために使用されます。handleDisabled
と合わせて使用します。

$options['increment']

ピクセルの関係を値に設定します。1 を指定すると、ピクセルごとに 1
ずつスライダーの値を調整します。

$options['handleDisabled']

無効なハンドルを表すイメージの
id。これはスライダーが無効な場合、イメージを変更するために使用されます。handleImage
と合わせて使用します。

$options['change']
 $options['onChange']

スライダーの動作終了時、またはその値が変わったときに呼び出される
javascript
のコールバック。コールバック関数はパラメータとしてスライダーの現在の値を受け取ります。

$options['slide']
 $options['onSlide']

スライダーがドラッグによって動くときに常に呼び出される javascript
のコールバック。パラメータとしてスライダー現在の値を受け取ります。

editor
------

``editor(string $id, string $url, array $options)``

指定した DOM ID に in-place(その場で編集する) エディタを作成します。
``$url``
には要素のデータを保存する役目を担うアクションを指定します。詳細とデモは、
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor>`_
を参照してください。

一般的なオプションは次の通りです:

$options keys

説明

``$options['collection']``

in-place エディタの 'collection'
モードを起動します。$options['collection'] は select
のオプションに変換する配列を受け取ります。collection についての詳細は、
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor>`_
を参照してください。

``$options['callback']``

リクエストがサーバに送信される前に実行する関数を指定します。これは、サーバに送信するデータをフォーマットするために使用できます。
``function(form, value)`` というように特徴的な書き方をします。

``$options['okText']``

編集モードの submit ボタンに表示するテキスト。

``$options['cancelText']``

編集をキャンセルするリンクに表示するテキスト。

``$options['savingText']``

テキストがサーバに送信された時に表示されるテキスト。

``$options['formId']``

``$options['externalControl']``

``$options['rows']``

入力フィールドの行方向の高さ。

``$options['cols']``

テキストエリアがかかる列の数。

``$options['size']``

単一の行を使用する場合における、「cols」と同じ意味のもの。

``$options['highlightcolor']``

ハイライトの色。

``$options['highlightendcolor']``

ハイライトが消えていく部分の色。

``$options['savingClassName']``

``$options['formClassName']``

``$options['loadingText']``

``$options['loadTextURL']``

例

::

    <div id="in_place_editor_id">テキストの編集</div>
    <?php
    echo $ajax->editor( 
        "in_place_editor_id", 
        array( 
            'controller' => 'Posts', 
            'action' => 'update_title',
            $id
        ), 
        array()
    );
    ?>

sortable
--------

``sortable(string $id, array $options)``

$id
に含まれるリスト、あるいはフロートオブジェクトのグループをソート可能にします。オプション配列はいくつかのパラメータをサポートしています。sortable
についての詳細は、
`http://wiki.github.com/madrobby/scriptaculous/sortable <http://wiki.github.com/madrobby/scriptaculous/sortable>`_
を参照してください。

一般的なオプションは次の通りです:

$options keys

説明

$options['tag']

コンテナのどの子要素をソート可能にするかを示します。デフォルトは 'li'
です。

$options['only']

子要素のフィルタリングをします。CSS クラスが指定可能です。

$options['overlap']

'vertical'(垂直方向) あるいは 'horizontal'(水平方向)
のいずれかを指定します。デフォルトは vertical です。

$options['constraint']

ドラッグ可能要素の動作を制限します。'horizontal'(水平方向) あるいは
'vertical'(垂直方向) が指定可能です。デフォルトは vertical です。

$options['handle']

作成した Draggables にハンドルを使用します。Draggables
のハンドルオプションを参照してください。

$options['onUpdate']

ドラッグが終了し、Sortable の順序が変わったときに呼び出されます。ある
Sortable から別のものへドラッグした場合、それぞれの Sortable
で一度コールバックが呼び出されます。

$options['hoverclass']

作成した droppable に hoverclass を付与します。

$option['ghosting']

true にすると、sortable
のドラッグした要素は複製され、元の要素を直接操作する代わりにゴーストとして出現します。
