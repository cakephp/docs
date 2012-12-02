CakePHP 2.0の新機能
###################

モデル
======

モデルの初期化プロセスは軽量化されました。
モデルのアソシエーションは遅延読み込みがされるようになり、多量のモデルやアソシエーションをもつアプリケーションは顕著に起動処理の時間を減少させることでしょう。

モデルは初期化プロセス時にデータベースのコネクションを必要としなくなり、find操作が発生するとき、またはカラムの情報が必要となった時のみ、データベースに初めてアクセスがなされます。

ビュー
======

View::$output
-------------

ビューは常に、 ``$this->output`` を通して最後に描画されたコンテンツ（ビューかレイアウト）を保持するようになりました。
ヘルパーで ``$this->_View->output`` を利用できます。
このプロパティを更新することでビューの描画から出てきたコンテンツを書き換えることができます。

ヘルパー
========

HtmlHelper
----------

* ``getCrumbList()`` は ``<li>`` エレメントでラップされたぱんくずリストのリンクを生成します。
  `#856 <http://cakephp.lighthouseapp.com/projects/42648/tickets/856>`_ を見てください。 
* ``loadConfig()`` は :php:class:`Helper` から :php:class:`HtmlHelper` に移動しました。
   このメソッドは設定ファイルを読み込むのに新しいリーダークラス（2.0 :php:class:`Configure` をみてください）を使うようになりました。
   省略可能ですが、二番目の引数としてパス（デフォルトは ``app/Config`` ）を渡すことができます。
   単純に、設定ファイル（とリーダー）を ``Controller::$helpers`` で設定することで、ヘルパーにコンストラクタで読み込むことができます（以下に例があります）。
   設定ファイルでは、以下のキーを指定できます:

 * ``tags`` キーと値を用いた配列
 * ``minimizedAttributes`` リスト
 * ``docTypes`` キーと値を用いた配列
 * ``attributeFormat`` 文字列
 * ``minimizedAttributeFormat`` 文字列

コントローラで設定ファイルを指定する方法の例::

    public $helpers = array(
        'Html' => array(
            'configFile' => array('config_file', 'php') // 一つ目の方法：ファイル名とリーダー名の配列
            'configFile' => 'config_file' // 二つ目の方法： ファイル名の文字列。PhpReaderが用いられます。
        )
    );

FormHelper
----------

* :php:class:`FormHelper` は全てのHTML5インプット(*input*)の種類と、カスタムインプットをサポートします。
  使用したいインプットをこのヘルパーのメソッドとして呼び出してください。
  一例として、 ``range()`` はtype = rangeとなるインプットを生成するでしょう。
* ``postLink()`` と ``postButton()`` はHTTPのPOSTメソッドを使ってなんらかのページにアクセスするリンク・ボタンを生成します。
  これを用いて、コントローラではGETメソッドを用いたアクション、例えばdeleteのようなアクションを無視することができるようになります。
* multiple = checkboxを用いた ``select()`` は、 ``'id'`` 属性を全ての生成されたオプションの接頭辞として扱うようになりました。

ライブラリ
==========

CakeRequest
-----------

:php:class:`CakeRequest` は2.0で導入された新しいクラスです。
このクラスは、共通に使われるリクエスト内部判定メソッドをカプセル化し、params配列をより有用なオブジェクトに書き換えます。
詳しくは :php:class:`CakeRequest` を読んでください。

CakeResponse
------------

:php:class:`CakeResponse` は2.0で導入された新しいクラスです。
このクラスは、アプリケーションのHTTPレスポンスの生成で共通に使われるメソッドとプロパティとカプセル化したものです。
これはCakePHPのいくつかの機能を統合したものです。
詳しくは :php:class:`CakeResponse` を読んでください。

CakeSession, SessionComponent
-----------------------------

:php:class:`CakeSession` と :php:class:`SessionComponent` は数多くの変更があります。
詳しい情報は、セッションのセクションを見て下さい。

Router
------

フルURLを返せるようになったルート
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ルートオブジェクトはフルURLを返せるようになりました。
また、 :php:class:`Router` はクエリ文字列とフラグメント識別子（訳注：#anchor_nameのこと）を付け加える以上のことはしません。
これは例えば、サブドメインやHTTPS/HTTPのフラグを扱うルートを作成するのに使用することができます。
以下はサブドメインをサポートするルートクラスの一例です::

    class SubdomainRoute extends CakeRoute {
        
        public function match($params) {
            $subdomain = isset($params['subdomain']) ? $params['subdomain'] : null;
            unset($params['subdomain']);
            $path = parent::match($params);
            if ($subdomain) {
                $path = 'http://' . $subdomain . '.localhost' . $path;
            }
            return $path;
        }
    }

リンクを生成するときにサブドメインを指定するには、以下のようにします。

::

    echo $this->Html->link(
        'Other domain',
         array('subdomain' => 'test', 'controller' => 'posts', 'action' => 'add')
    );

上記はリンクを、http://test.localhost/posts/addをURLとして生成することでしょう。

Xml
---

:php:class:`Xml` Xmlは数多くの変更があります。
詳しくは :doc:`/core-utility-libraries/xml` クラスを読んでください。

新しいライブラリの機能
======================

設定リーダー
------------

:php:class:`Configure` は様々なソースやフォーマットから設定ファイルを読み込むことができるように設定可能になりました。
:doc:`/development/configuration` セクションにはConfigureへの変更についてより詳しい情報があります。

引数無しで :php:meth:`Configure::read()` を呼ぶと、デバッグ値の代わりに、設定の全ての値を読み込むことができるようになりました。

エラーと例外のハンドリング
--------------------------

CakePHP 2.0は :doc:`/development/exceptions` と :doc:`/development/errors` のハンドリングを再構築し、より柔軟に、より強い権力を開発者に与えます。

String::wrap()
--------------

テキストの横幅の調整を便利にするものとして、 :php:meth:`String::wrap()` が追加されました。
これはシェルで :php:meth:`Shell::wrapText()` を使う時に必ず使われます。

debug()
-------

:php:func:`debug()` はコンソールでHTMLを吐き出さないようになりました。
代わりに以下のような出力をします::

    ########## DEBUG ##########
    Array
    (
        [0] => test
    )
    ###########################

これはコマンドラインでの ``debug()`` の可読性を向上させるでしょう。

コンポーネント
==============

コンポーネントはヘルパーやビヘイビアと同じような扱いを享受し、 :php:class:`Component` がコンポーネントの基底クラスになりました。
詳しくはコンポーネントの変更を読んでください。

RequestHandler
--------------

:php:class:`RequestHandler` は :php:class:`CakeRequest` の導入によりかなりの修正がありました。
また、この変更はいくつかの新しい機能を導入することも可能にしました。

Acceptヘッダーの自動解析
~~~~~~~~~~~~~~~~~~~~~~~~

もしクライアントが送ったAcceptが単一のMIMEタイプで、それに対応する拡張子が :php:class`Router` で有効となっているものと一致するならば、 :php:class:`RequestHandler` はそれを拡張子と同じものとして扱うでしょう。
これはCakePHPのRESTスタイルのエンドポイントのサポートを拡張します。
この機能を使うには、まず ``app/Config/routes.php`` で拡張子を有効にしてください。

::

    Router::parseExtensions('json', 'xml');

いったん拡張子に対応するビューとレイアウトを作成すれば、posts/view/1のようなURLにAccept: ``application/json`` を含んだヘッダーを送ることで、そのURLのJSONバージョンを受け取ることができるようになるでしょう。

CookieComponent
---------------

:php:class:`CookieComponent` はHTTPのみのクッキー制限をサポートするようになりました。
``$this->Cookie->httpOnly = true;`` を設定することによってそれを有効とすることができます。
HTTPのみのクッキーにすることは、ブラウザーからクッキーにアクセスすることができないようにすることでしょう。(訳注：Javascriptなどから。参考: `setcookie <http://jp.php.net/manual/ja/function.setcookie.php>`_)

SecurityコンポーネントのCSRF分離
--------------------------------

CakePHPは1.2からCSRF対策を持つようになりました。
2.0では既存のCSRFはより猜疑的なモードと、独立した機能を持つようになりました。
以前は、CSRF機能はフォームの改ざん対策とセットでした。
開発者はたびたびvalidatePostを動的なフォームの為に無効にしていましたが、CSRF対策も同時に無効化されていました。
2.0では、CSRFチェックはフォーム改ざん対策と分離され、強くコントロールすることができるようになりました。

詳しい情報は、 :ref:`security-csrf` を見てください。

コントローラー
==============

コントローラはリクエストとレスポンスのオブジェクトを利用できるようになりました。
これらのオブジェクトについては、専用ページで詳しく見ることが出来ます。

コンソール
==========

CakePHP2.0のコンソールはほとんど完全に書き直されました。
いくつかの新機能、また後方非互換な変更が加えられました。
詳しくは、コンソールの変更を見てください。

ページネーション
================

ページネーションはページ付けに対して最大制限件数(*maxLimit*)を規定し、デフォルトは100です。

この制限はコントローラーでpaginate変数を用いて上書き可能です。

::

    $this->paginate = array('maxLimit' => 1000);

このデフォルト値は、ユーザのURL操作で「limit」パラメータをとても大きな数値にしたリクエストのために、過大なデータベースの情報の引き出しを防ぐために提供されます。

エイリアス化
============

あるクラスの代わりに独自のクラスを使うために、ヘルパー、コンポーネント、ビヘイビアは別名（訳注：エイリアス）を使うことができるようになりました。
これは、ビューで全ての ``$this->Html`` のインスタンスを置き換える必要なく ``MyHtml`` ヘルパーを作成することが、非常に簡単にできるようになったということです。
これを為すには、モデルでしていたのと同じように、クラスを用いた「className」キーを渡してください。

::

    public $helpers = array( 
        'Html' => array( 
            'className' => 'MyHtml' 
        )
    );

同様に、コントローラで使うためにコンポーネントを別名として使うことができます。

::

    public $components = array( 
        'Email' => array( 
            'className' => 'QueueEmailer' 
        )
    );

Emailコンポーネントを呼び出すことは、代わりにQueueEmailerを呼び出すことになるでしょう。
最後に、ビヘイビアでも別名呼び出しが可能です。

::

    public $actsAs = array( 
        'Containable' => array( 
            'className' => 'SuperContainable' 
        ) 
    );

2.0がコレクションを利用し、アプリケーションにまたがって共有することから、全てのエイリアス化されたクラスはアプリケーションの至る所で使用されるでしょう。
アプリケーションはいつでもエイリアスにアクセスを試み、それは独自のクラスにアクセスすることになります。
例えば、上記のようにHtmlをエイリアス化したとき、全てのHtmlヘルパーを使うヘルパーやエレメントはHtmlヘルパーを読み込み、MyHtmlを代わりに使うことになるでしょう。

ConnectionManager
=================

新しいメソッド :php:meth:`ConnectionManager::drop()` が追加されました。
これは実行時にコネクションを削除することができます。
