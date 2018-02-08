
3.1 移行ガイド
##############

CakePHP 3.1 は、3.0 の API の完全上位互換です。
このページでは、3.1 の変更と改善についてのアウトラインを紹介します。

ルーティング
============

- ``cakephp/app`` リポジトリーのデフォルトルートクラスは ``DashedRoute`` に変更されました。
  あなたの現在のコードベースはこの影響を受けませんが、今からこのルートクラスを使用することを
  お勧めします。
- 名前プレフィックスオプションが、様々なルートビルダーメソッドに追加されました。
  詳細は、 :ref:`named-routes` セクションをご覧ください。

コンソール
==========

- ``Shell::dispatchShell()`` はシェルの割り当て時に Welcome メッセージを出力しなくなりました。
- ``breakpoint()`` ヘルパー関数が追加されました。この関数は対話式コンソールで ``eval()`` に
  挿入できるコードスニペットを提供します。テストケースや他の CLI スクリプトをデバッグするときに
  これは非常に便利です。
- ``--verbose`` と ``--quiet`` コンソールオプションは、標準出力/標準エラーのログ出力レベルを
  コントロールします。

Shell ヘルパーの追加
--------------------

- コンソールアプリケーションで出力ロジックの再利用可能な部分をカプセル化するヘルパークラスを
  作成することができます。詳細は、 :doc:`/console-and-shells/helpers` セクションを
  ご覧ください。

RoutesShell
-----------

- RoutesShell が追加され、ルートのテストとデバッグのためのシンプルな CLI インターフェイスを
  提供しています。詳しくは :doc:`/console-and-shells/routes-shell` セクションをご覧ください。

コントローラー
==============

- 以下のコントローラーのプロパティーが非推奨になりました。

  * layout
  * view - ``template`` に置き換え
  * theme
  * autoLayout
  * viewPath - ``templatePath`` に置き換え
  * viewClass - ``className`` に置き換え
  * layoutPath

これらをコントローラーで設定する代わりに、これらと同名のメソッドを使ってビューにセットする必要が
あります。 ::

    // コントローラーないで、以下の代わりに、
    $this->layout = 'advanced';

    // 以下を使用してください。
    $this->viewBuilder()->layout('advanced');

これらのメソッドは、コントローラーやアクションによって使用されるビュークラスを決定した後に
呼び出されるべきです。

AuthComponent
-------------

- 新しい設定オプション ``storage`` が追加されました。 ``AuthComponent`` がユーザーの
  レコードを格納するために使用するストレージ・クラス名が含まれています。
  デフォルトでは ``SessionStorage`` が使用されます。ステートレスオーセンティケーターを
  使用している場合、 ``MemoryStorage`` を代わりに 使用するために ``AuthComponent`` を
  設定する必要があります。
- 新しい設定オプション ``checkAuthIn`` が追加されました。認証チェックが行われるべき対象の
  イベントの名前が含まれています。デフォルトでは ``Controller.startup`` が使用されますが、
  コントローラーの ``beforeFilter()`` メソッドが実行される前に認証をチェックしたい場合は、
  ``Controller.initialize`` に設定することができます。
- 認証クラスのオプション ``scope`` と ``contain`` は非推奨になりました。
  代わりに、カスタム検索メソッドを設定するために新たに ``finder`` オプションを使用し、
  ユーザーを検索するために使用されるクエリーを変更してください。
- ログイン後にリダイレクトする URL を取得するために使用される ``Auth.redirect`` セッション変数を
  設定するロジックは、 変更されています。現在では、認証なしで保護された URL にアクセスしようと
  したときにのみ設定されています。よって、 ``Auth::redirectUrl()`` は、ログイン後に保護された
  URL を返します。通常の状況下では、ユーザーが直接ログインページにアクセスする場合、
  ``Auth::redirectUrl()`` は ``loginRedirect`` に設定された値を返します。

FlashComponent
--------------

- ``FlashComponent`` は、 ``set()`` や ``__call()`` メソッドで設定すると
  フラッシュメッセージをスタックします。これは、保存されているフラッシュ・メッセージの
  セッション内の構造が変更されたことを意味します。

CsrfComponent
-------------

- CSRF クッキーの有効期限は ``strtotime()`` 互換の値として設定することができます。
- 無効な CSRF トークンは ``Cake\Network\Exception\ForbiddenException`` の代わりに
  ``Cake\Network\Exception\InvalidCsrfTokenException`` がスローされます。

RequestHandlerComponent
-----------------------

- ``RequestHandlerComponent`` は、解析された拡張子や ``Accept`` ヘッダーをもとに、
  ``startup()`` コールバックの代わりに ``beforeRender()`` 内でレイアウトやテンプレートを
  切り替えます。
- ``addInputType()`` と ``viewClassMap()`` は非推奨です。実行時にこの設定データを
  変更するためには、 ``config()`` を使用してください。
- ``inputTypeMap`` や ``viewClassMap`` がコンポーネント設定で定義されている場合、
  デフォルト値を *上書き* します。この変更は、デフォルトの設定を削除することが可能となります。

ネットワーク
============

Http\Client
-----------

- リクエストを送信する際に使用されるデフォルトの MIME タイプが変更されました。
  以前は ``multipart/form-data`` が常に使用されていました。
  3.1 では、ファイルのアップロードを行う場合のみ ``multipart/form-data`` が使用されます。
  アップロードするファイルがない場合、 ``application/x-www-form-urlencoded`` が使用されます。

ORM
===

:ref:`遅延イーガーロードアソシエーション <loading-additional-associations>` が
できるようになりました。この機能は、結果セットやエンティティーまたはエンティティーのコレクションの中で
追加のアソシエーションを条件付きで読み込むことができます。

``patchEntity()`` と ``newEntity()`` メソッドは ``onlyIds`` オプションをサポートしています。
このオプションは、``_ids`` リストを使用するためだけにマーシャリングする hasMany や belongsToMany
の関連付けを制限することができます。このオプションのデフォルトは ``false`` です。

Query
-----

- ``Query::notMatching()`` が追加されました。
- ``Query::leftJoinWith()`` が追加されました。
- ``Query::innerJoinWith()`` が追加されました。
- ``Query::select()`` は、パラメーターとして ``Table`` と ``Association`` オブジェクトを
  サポートします。これらのパラメーターの型は、提供されたテーブルまたは関連インスタンスの
  ターゲットテーブルのすべてのカラムを選択します。
- ``Query::distinct()`` は、単一のカラムを DISTINCT するための文字列も受け付けます。
- ``Table::loadInto()`` が追加されました。
- ``EXTRACT``, ``DATE_ADD`` そして ``DAYOFWEEK`` など素の SQL関数は、 ``extract()``,
  ``dateAdd()`` そして ``dayOfWeek()`` に抽象化されています。

ビュー
======

- ``JsonView`` と ``XmlView`` で、 ``_serialized`` を ``true`` に設定することで、明示的に
  シリアライズする変数を指定するのではなく、すべてのビュー変数をシリアライズするよう設定できます。
- ``View::$viewPath`` は非推奨になりました。代わりに ``View::templatePath()`` を使用してください。
- ``View::$view`` は非推奨になりました。代わりに ``View::template()`` を使用してください。
- ``View::TYPE_VIEW`` は非推奨になりました。代わりに ``View::TYPE_TEMPLATE`` を使用してください。

ヘルパー
========

SessionHelper
-------------

- ``SessionHelper`` は非推奨になりました。 ``$this->request->session()`` を直接使用してください。

FlashHelper
-----------

- ``FlashComponent`` で複数のメッセージが設定された場合、 ``FlashHelper`` は複数のメッセージを
  レンダリングすることができます 。各メッセージは、独自の要素にレンダリングされます。
  メッセージは、それらが設定された順序でレンダリングされます。

FormHelper
----------

- 新しいオプション ``templateVars`` が追加されました。 ``templateVars`` は、
  カスタムフォームコントロールテンプレートに追加で変数を渡すことができます。

Email
=====

- ``Email`` と ``Transport`` クラスは ``Cake\Mailer`` 名前空間の下に移動されました。
  クラスのエイリアスが設定されているので、元の名前空間もまだ使用可能です。
- ``Email`` インスタンスが作成されたときに ``default`` のEメールプロファイルが自動的に
  設定されています。この動作は、2.x の動作に似ています。

Mailer
------

- ``Mailer`` クラスが追加されました。
  このクラスは、アプリケーション内で再利用可能なEメールを作成するのに便利です。

I18n
====

Time
----

- ``Time::fromNow()`` が追加されました。
  このメソッドは、「現在」からの差分を簡単に算出することができます。
- ``Time::i18nFormat()`` は、日付書式に非グレゴリオ暦をサポートしています。

Validation
==========

- ``Validation::geoCoordinate()`` が追加されました。
- ``Validation::latitude()`` が追加されました。
- ``Validation::longitude()`` が追加されました。
- ``Validation::isInteger()`` が追加されました。
- ``Validation::ascii()`` が追加されました。
- ``Validation::utf8()`` が追加されました。

テスト
=======

TestFixture
-----------

インポートするテーブル名を取得するために ``model`` キーがサポートされています。
