3.4 移行ガイド
##############

CakePHP 3.4 は、3.3 の API の完全上位互換です。
このページでは、3.4 の変更と改善についてのアウトラインを紹介します。

PHP 5.6 以上が必要
==================

PHP 5.5 はもはやサポートされておらず、これ以上のセキュリティ修正はありませんので、
CakePHP 3.4 には少なくとも PHP 5.6.0 が必要です。

非推奨
======

以下は、非推奨のメソッド、プロパティと動作の一覧です。
これらの機能は、4.0.0 以後に削除されるまで機能し続けます。

Request と Response の非推奨
----------------------------

3.4 で非推奨になった大部分は ``Request`` と ``Response`` オブジェクトにあります。
オブジェクトをその場で更新する既存のメソッドは非推奨になり、
PSR-7 規格にある不変オブジェクトパターンに従ったメソッドに取って代わられています。

``Cake\Network\Request`` のいくつかのプロパティが非推奨になりました。

* ``Request::$params`` は非推奨です。代わりに ``Request::getAttribute('params')`` を使用してください。
* ``Request::$data`` は非推奨です。代わりに ``Request::getData()`` を使用してください。
* ``Request::$query`` は非推奨です。代わりに ``Request::getQueryParams()`` を使用してください。
* ``Request::$cookies`` は非推奨です。代わりに ``Request::getCookie()`` を使用してください。
* ``Request::$base`` は非推奨です。代わりに ``Request::getAttribute('base')`` を使用してください。
* ``Request::$webroot`` は非推奨です。代わりに ``Request::getAttribute('webroot')`` を使用してください。
* ``Request::$here`` は非推奨です。代わりに ``Request::getRequestTarget()()`` を使用してください。
* ``Request::$_session`` が ``Request::$session`` に名前が変更されました。

``Cake\Network\Request`` の多くのメソッドが は非推奨になりました。

* ``__get()`` と ``__isset()`` メソッドは非推奨です。代わりに ``getParam()`` を使用してください。
* ``method()`` は非推奨です。代わりに ``getMethod()`` を使用してください。
* ``setInput()`` は非推奨です。代わりに ``withBody()`` を使用してください。
* ``ArrayAccess`` のメソッドはすべて非推奨です。
* ``Request::param()`` は非推奨です。代わりに ``Request::getParam()`` を使用してください。
* ``Request::data()`` は非推奨です。代わりに ``Request::getData()`` を使用してください。
* ``Request::query()`` は非推奨です。代わりに ``Request::getQuery()`` を使用してください。
* ``Request::cookie()`` は非推奨です。代わりに ``Request::getCookie()`` を使用してください。

``Cake\Network\Response`` のいくつかのメソッドは、 PSR-7 のメソッドと重複していたり、
PSR-7 スタックによって廃止されているため、 非推奨になりました。

* ``Response::header()`` は非推奨です。代わりに ``getHeaderLine()``, ``hasHeader()`` や
  ``Response::getHeader()`` を使用してください。
* ``Response::body()`` は非推奨です。代わりに ``Response::withBody()`` を使用してください。
* ``Response::statusCode()`` は非推奨です。
  代わりに ``Response::getStatusCode()`` を使用してください。
* ``Response::httpCodes()`` このメソッドは使われなくなりました。
  CakePHP はすべての現在推奨されるステータスコードの規格をサポートしています。
* ``Response::protocol()`` は非推奨です。
  代わりに ``Response::getProtocolVersion()`` を使用してください。
* ``send()``, ``sendHeaders()``, ``_sendHeader()``, ``_sendContent()``,
  ``_setCookies()``, ``_setContentType()``, そして ``stop()`` は非推奨になり、
  PSR-7 HTTP スタックで廃止されました。

レスポンスが PSR-7 標準で推奨されているような不変オブジェクトパターンに従うことに伴い、
``Response`` のいくつかの 'ヘルパー' メソッドは非推奨になり、不変バリアントが推奨されます。

* ``Response::location()`` は ``Response::withLocation()`` となります。
* ``Response::disableCache()`` は ``Response::withDisabledCache()`` となります。
* ``Response::type()`` は ``Response::withType()`` となります。
* ``Response::charset()`` は ``Response::withCharset()`` となります。
* ``Response::cache()`` は ``Response::withCache()`` となります。
* ``Response::modified()`` は ``Response::withModified()`` となります。
* ``Response::expires()`` は ``Response::withExpires()`` となります。
* ``Response::sharable()`` は ``Response::withSharable()`` となります。
* ``Response::maxAge()`` は ``Response::withMaxAge()`` となります。
* ``Response::vary()`` は ``Response::withVary()`` となります。
* ``Response::etag()`` は ``Response::withEtag()`` となります。
* ``Response::compress()`` は ``Response::withCompression()`` となります。
* ``Response::length()`` は ``Response::withLength()`` となります。
* ``Response::mustRevalidate()`` は ``Response::withMustRevalidate()`` となります。
* ``Response::notModified()`` は ``Response::withNotModified()`` となります。
* ``Response::cookie()`` は ``Response::withCookie()`` となります。
* ``Response::file()`` は ``Response::withFile()`` となります。
* ``Response::download()`` は ``Response::withDownload()`` となります。

追加の変更が必要な不変メソッドを介してレスポンスを使用するためにコードを更新する前に、
:ref:`adopting-immutable-responses` セクションの詳細をご確認ください。

その他の非推奨
--------------

* ``Cake\Event\Event`` の public プロパティは非推奨となり、
  関連するプロパティを読み取り/書き込みするために新しいメソッが追加されました。
* ``Event::name()`` は非推奨です。代わりに ``Event::getName()`` を使用してください。
* ``Event::subject()`` は非推奨です。代わりに ``Event::getSubject()`` を使用してください。
* ``Event::result()`` は非推奨です。代わりに ``Event::getResult()`` を使用してください。
* ``Event::data()`` は非推奨です。代わりに ``Event::getData()`` を使用してください。
* ``Auth.redirect`` セッション変数は使用されなくなりました。
  代わりに、リダイレクト URL を格納するためにクエリ文字列パラメーターが使用されます。
  これには、ログインシナリオ外のセッションにリダイレクト URL を格納する機能を削除するという
  追加の効果があります。
* ``AuthComponent`` は、許可されていないURLが ``GET`` アクション以外の場合、
  リダイレクト URL を保存しません。
* ``AuthComponent`` の ``ajaxLogin`` オプションは非推奨です。
  クライアント側のコードで正しい動作を引き起こすには、 ``403`` ステータスコードを使用するべきです。
* ``RequestHandlerComponent`` の ``beforeRedirect`` メソッドは非推奨です。
* ``Cake\Network\Response`` の ``306`` ステータスコードは非推奨になりました。
  このステータスコードは非標準であるため、ステータスフレーズは "Unused" に変更されています。
* ``Cake\Database\Schema\Table`` は ``Cake\Database\Schema\TableSchema`` に名前が変更されました。
  以前の名前は多くのユーザーを混乱させました。
* ``Cake\ORM\Table::newEntity()`` と ``patchEntity()`` の ``fieldList`` オプションは、
  ORM の他の部分とそろえるため ``fields`` に名前が変更されました。
* ``Router::parse()`` は非推奨です。代わりに、リクエストを受け入れリクエストが届いた際の処理で
  より多くの制御や柔軟性を与えるために ``Router::parseRequest()`` を使用してください。
* ``Route::parse()`` は非推奨です。代わりに、リクエストを受け入れリクエストが届いた際の処理で
  より多くの制御や柔軟性を与えるために ``Route::parseRequest()`` を使用してください。
* ``FormHelper::input()`` は非推奨です。代わりに ``FormHelper::control()`` を使用してください。
* ``FormHelper::inputs()`` は非推奨です。代わりに ``FormHelper::controls()`` を使用してください。
* ``FormHelper::allInputs()`` は非推奨です。代わりに ``FormHelper::allControls()`` を使用してください。
* ``Mailer::layout()`` は非推奨です。
  代わりに ``Mailer::__call()`` が提供する ``Mailer::setLayout()`` を使用してください。

非推奨の複合 get / set メソッド
-------------------------------

過去には、CakePHP は get / set モードの両方を提供するように動作する 'モーダル' メソッドを
利用していました。これらのメソッドにより、IDE の自動補完や、将来的に厳格な戻り値の型を追加する機能が
複雑になります。これらの理由から、複合 get / set メソッドは、
個別の get および set メソッドに分割されています。

推奨されなくなり、 ``getX()`` と ``setX()`` メソッドに置き換えられたメソッドのリストを次に示します。

``Cake\Core\InstanceConfigTrait``
    * ``config()``
``Cake\Core\StaticConfigTrait``
    * ``config()``
    * ``dsnClassMap()``
``Cake\Console\ConsoleOptionParser``
    * ``command()``
    * ``description()``
    * ``epilog()``
``Cake\Database\Connection``
    * ``driver()``
    * ``schemaCollection()``
    * ``useSavePoints()`` (今は ``enableSavePoints()``/``isSavePointsEnabled()``)
``Cake\Database\Driver``
    * ``autoQuoting`` (今は ``enableAutoQuoting()``/``isAutoQuotingEnabled()``)
``Cake\Database\Expression\FunctionExpression``
    * ``name()``
``Cake\Database\Expression\QueryExpression``
    * ``tieWith()`` (今は ``setConjunction()``/``getConjunction()``)
``Cake\Database\Expression\ValuesExpression``
    * ``columns()``
    * ``values()``
    * ``query()``
``Cake\Database\Query``
    * ``connection()``
    * ``selectTypeMap()``
    * ``bufferResults()`` (今は ``enableBufferedResults()``/``isBufferedResultsEnabled()``)
``Cake\Database\Schema\CachedCollection``
    * ``cacheMetadata()``
``Cake\Database\Schema\TableSchema``
    * ``options()``
    * ``temporary()`` (今は ``setTemporary()``/``isTemporary()``)
``Cake\Database\TypeMap``
    * ``defaults()``
    * ``types()``
``Cake\Database\TypeMapTrait``
    * ``typeMap()``
    * ``defaultTypes()``
``Cake\ORM\Association``
    * ``name()``
    * ``cascadeCallbacks()``
    * ``source()``
    * ``target()``
    * ``conditions()``
    * ``bindingKey()``
    * ``foreignKey()``
    * ``dependent()``
    * ``joinType()``
    * ``property()``
    * ``strategy()``
    * ``finder()``
``Cake\ORM\Association\BelongsToMany``
    * ``targetForeignKey()``
    * ``saveStrategy()``
    * ``conditions()``
``Cake\ORM\Association\HasMany``
    * ``saveStrategy()``
    * ``foreignKey()``
    * ``sort()``
``Cake\ORM\Association\HasOne``
    * ``foreignKey()``
``Cake\ORM\EagerLoadable``
    * ``config()``
    * ``canBeJoined()`` のセッター部分 (今は ``setCanBeJoined()``)
``Cake\ORM\EagerLoader``
    * ``matching()`` (以前の動作を維持するために ``getMatching()`` は ``setMatching()`` の後に呼び出される必要があります)
    * ``autoFields()`` (今は ``enableAutoFields()``/``isAutoFieldsEnabled()``)
``Cake\ORM\Locator\TableLocator``
    * ``config()``
``Cake\ORM\Query``
    * ``eagerLoader()``
    * ``hydrate()`` (今は ``enableHydration()``/``isHydrationEnabled()``)
    * ``autoFields()`` (今は ``enableAutoFields()``/``isAutoFieldsEnabled()``)
``Cake\ORM\Table``
    * ``table()``
    * ``alias()``
    * ``registryAlias()``
    * ``connection()``
    * ``schema()``
    * ``primaryKey()``
    * ``displayField()``
    * ``entityClass()``
``Cake\Mailer\Email``
    * ``from()``
    * ``sender()``
    * ``replyTo()``
    * ``readReceipt()``
    * ``returnPath()``
    * ``to()``
    * ``cc()``
    * ``bcc()``
    * ``charset()``
    * ``headerCharset()``
    * ``emailPattern()``
    * ``subject()``
    * ``template()`` (今は ``setTemplate()``/``getTemplate()`` そして ``setLayout()``/``getLayout()``)
    * ``viewRender()`` (今は ``setViewRenderer()``/``getViewRenderer()``)
    * ``viewVars()``
    * ``theme()``
    * ``helpers()``
    * ``emailFormat()``
    * ``transport()``
    * ``messageId()``
    * ``domain()``
    * ``attachments()``
    * ``configTransport()``
    * ``profile()``
``Cake\Validation\Validator``
    * ``provider()``
``Cake\View\StringTemplateTrait``
    * ``templates()``
``Cake\View\ViewBuilder``
    * ``templatePath()``
    * ``layoutPath()``
    * ``plugin()``
    * ``helpers()``
    * ``theme()``
    * ``template()``
    * ``layout()``
    * ``options()``
    * ``name()``
    * ``className()``
    * ``autoLayout()`` (今は ``enableAutoLayout()``/``isAutoLayoutEnabled()``)

.. _adopting-immutable-responses:

不変レスポンスを採用
====================

新しいレスポンスメソッドを使用するようにコードを移行する前に、
新しいメソッドが持つ概念上の相違点に注意する必要があります。
不変メソッドは、一般に ``with`` 接頭辞を使って明示されています。例えば、 ``withLocation()`` です。
これらのメソッドは不変なコンテキストで動作するため、変数やプロパティに割り当てる必要がある
*新しい* インスタンスを返します。次のようなコントローラコードがある場合::

    $response = $this->response;
    $response->location('/login')
    $response->header('X-something', 'a value');

単にメソッド名を検索＆置き換えした場合、あなたのコードは壊れてしまいます。
代わりに、次ようなコードを使用する必要があります。 ::

    $this->response = $this->response
        ->withLocation('/login')
        ->withHeader('X-something', 'a value');

いくつかの重要な違いがあります。

#. 変更の結果は ``$this->response`` に再代入されます。
   これは、上記のコードの意図を維持するために重要です。
#. セッターメソッドはすべて連鎖することができます。
   これにより、すべての中間オブジェクトの格納をスキップできます。

コンポーネント移行のヒント
--------------------------

CakePHP の以前のバージョンでは、コンポーネントは後で変更を加えるために、
リクエストとレスポンスの両方の参照を保持することがよくありました。不変メソッドを採用する前に、
コントローラに添付されているレスポンスを使用する必要があります。 ::

    // コンポーネントのメソッド (コールバックを除く) の中で
    $this->response->header('X-Rate-Limit', $this->remaining);

    // 以下のようにするべきです
    $controller = $this->getController();
    $controller->response = $controller->response->withHeader('X-Rate-Limit', $this->remaining);

コンポーネントのコールバックでは、イベントオブジェクトを使用して
レスポンス/コントローラにアクセスできます。 ::

    public function beforeRender($event)
    {
        $controller = $event->getSubject();
        $controller->response = $controller->response->withHeader('X-Teapot', 1);
    }

.. tip::
    レスポンスの参照を保持する代わりに、コントローラから現在のレスポンスを取得し、
    完了したらレスポンスプロパティを再代入します。

振る舞いの変更
==============

以下の変更は、API 互換性はありますが、あなたのアプリケーションに影響を及ぼし得る
振る舞いのわずかな差異があります。

* ``ORM\Query`` の結果は元のカラムの型に基づいてエイリアス化されたカラムを型キャストしません。
  たとえば、 ``created`` を ``created_time`` にエイリアスすると、文字列ではなく
  ``Time`` オブジェクトが返されます。
* 関連クラスを構築するために使用される内部 ORM トレイトは削除され、新しい内部 API に置き換えられました。
  アプリケーションに影響を与えるべきではありませんが、カスタムアソシエーションタイプを
  作成している場合は影響を受けるでしょう。
* ``AuthComponent`` は認証されていないユーザがログインページにリダイレクトされたときに
  リダイレクト URL を格納するためにクエリ文字列を使います。以前は、このリダイレクトは
  セッションに格納されていました。クエリ文字列を使用すると、マルチブラウザの操作性が向上します。
* データベーススキーマのリフレクションは未知のカラムタイプを ``text`` ではなく ``string``
  として扱います。目に見える影響は、 ``FormHelper`` は未知のカラム型の textarea 要素の代わりに
  text 入力を生成するということです。
* ``AuthComponent`` は、作成したフラッシュメッセージを 'auth' キーに保存しません。それらは
  'default' フラッシュメッセージキーに 'error' テンプレートで描画されるようになりました。
  これは、 ``AuthComponent`` の使用を簡略化します。
* ``Mailer\Email`` は、コンテンツタイプが提供されていない場合、 ``mime_content_type`` を使って
  添付ファイルタイプを自動検出します。これまでの添付ファイルはデフォルトで
  'application/octet-stream' になっていました。
* CakePHP は、現在、 ``call_user_func_array()`` の代わりに ``...`` 演算子を使用します。
  連想配列を渡す場合は、次のメソッドには ``array_values()`` を使って数値添字配列を渡すように
  コードを更新する必要があります。

    * ``Cake\Mailer\Mailer::send()``
    * ``Cake\Controller\Controller::setAction()``
    * ``Cake\Http\ServerRequest::is()``

アクセス権の変更
================

* ``MailerAwareTrait::getMailer()`` は protected になります。
* ``CellTrait::cell()`` は protected になります。

上記のトレイトがコントローラで使用されている場合、その public メソッドには、
デフォルトでアクションとしてルーティングすることでアクセスできます。これらの変更は、
コントローラの保護に役立ちます。メソッドを公開する必要がある場合は、
``use`` ステートメントを次のように更新する必要があります。 ::

    use CellTrait {
        cell as public;
    }
    use MailerAwareTrait {
        getMailer as public;
    }


Collection
==========

* ``CollectionInterface::chunkWithKeys()`` が追加されました。
  ``CollectionInterface`` のユーザーランド実装は、現在このメソッドを実装する必要があります。
* ``Collection::chunkWithKeys()`` が追加されました。

エラー
======

* ``Debugger::setOutputMask()`` と ``Debugger::outputMask()`` が追加されました。
  これらのメソッドを使用すると、Debugger によって生成された出力からマスクする
  プロパティ/配列キーを設定することができます (たとえば ``debug()`` を呼び出すとき) 。

Event
=====

* ``Event::getName()`` が追加されました。
* ``Event::getSubject()`` が追加されました。
* ``Event::getData()`` が追加されました。
* ``Event::setData()`` が追加されました。
* ``Event::getResult()`` が追加されました。
* ``Event::setResult()`` が追加されました。

I18n
====

* フォールバックメッセージローダーの動作をカスタマイズできるようになりました。
  詳しくは、 :ref:`creating-generic-translators` をご覧ください。

ルーティング
============

* ``RouteBuilder::prefix()`` は、接続された各ルートに追加するデフォルトの配列を
  受け入れるようになりました。
* ルートは、 ``_host`` オプションを使用して特定のホストだけを一致させることができます。

Email
=====

* ``Email::setPriority()``/``Email::getPriority()`` が追加されました。

HtmlHelper
==========

* ``HtmlHelper::scriptBlock()`` は、デフォルトで ``<![CDATA[]]`` タグに JavaScript コードを
  ラップすることはありません。この動作を制御する ``safe`` オプションは、デフォルトで ``false`` に
  なりました。 ``<![CDATA []]`` タグを使うことは、もはや HTML ページで使われている主要な
  doctype ではない XHTML にのみ必要でした。

BreadcrumbsHelper
=================

* ``BreadcrumbsHelper::reset()`` が追加されました。
  このメソッドでは、既存のパンくずをクリアすることができます。

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` はデフォルトのテンプレートで '...' の代わりに
  HTML 省略記号を使用するようになりました。
* ``PaginatorHelper::total()`` が追加され、現在ページングされている結果の総ページ数が
  読み取れるようになりました。
* ``PaginatorHelper::generateUrlParams()`` が下位レベルの URL 構築メソッドとして追加されました。
* ``PaginatorHelper::meta()`` は 'first'、 'last' のリンクを作成できるようになりました。

FormHelper
==========

* FormHelper が読み込むソースを設定できるようになりました。これは、単純な GET のフォームを
  作成することができます。詳しくは、 :ref:`form-values-from-query-string` をご覧ください。
* ``FormHelper::control()`` が追加されました。
* ``FormHelper::controls()`` が追加されました。
* ``FormHelper::allControls()`` が追加されました。

Validation
==========

* ``Validation::falsey()`` と ``Validation::truthy()`` が追加されました。

TranslateBehavior
=================

* ``TranslateBehavior::translationField()`` が追加されました。

PluginShell
===========

* ``cake plugin load`` と ``cake plugin unload`` は ``--cli`` をサポートします。
  これは、代わりに ``bootstrap_cli.php`` を更新します。

TestSuite
=========

* ``PHPUnit 6`` のサポートが追加されました。PHP 5.6.0 を最低限必要とする
  このフレームワークバージョンでは、PHPUnit のサポートされているバージョンは、
  現在 ``^5.7|^6.0`` です。
