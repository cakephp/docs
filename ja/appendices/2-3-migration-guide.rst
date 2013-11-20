2.3移行ガイド
###################

CakePHP 2.3 は、2.2 の API の完全上位互換です。
このページでは、2.3 の変更と改善についてのアウトラインを紹介します。


定数
=========

アプリケーションで :php:const:`CACHE` と :php:const:`LOGS` の定数を簡単に定義できます。
いまは条件付きで CakePHP により定義されています。

キャッシュ
===========

- FileEngine はデフォルトのキャッシュエンジンです。
  これまで、たくさんの人々が CLI と Web の双方で正しく APC が動作させようと
  セットアップに難儀していました。
  ファイルを利用することにより、新規の開発者のセットアップが容易になります。

- `Configure::write('Cache.viewPrefix', 'YOURPREFIX');` が `core.php` に
  追加されました。これによりセットアップごとに複数のドメインや言語が利用できます。


コンポーネント
===============

AuthComponent
-------------------
- ``AuthComponent::$unauthorizedRedirect`` が新規プロパティとして追加されました。

  - デフォルトは ``true`` です。認証エラーの場合はリファラ URL へリダイレクトされます。
  - 文字列または配列をセットした場合は、その URL へリダイレクトされます。
  - false をセットした場合は、リダイレクトせずに ForbiddenException を投げます。

- 新しい認証アダプタとして blowfish/bcrypt がパスワードハッシュで利用できるようになりました。
  ``$authenticate`` の配列に ``Blowfish`` を追加することで、bcrypt パスワードが利用できます。

- :php:meth:`AuthComponent::redirect()` は非推奨となりました。
  :php:meth:`AuthComponent::redirectUrl()` を代わりに利用して下さい。



PaginatorComponent
------------------

- PaginatorComponent は、 ``findType`` オプションをサポートしました。
  これは、ページネーションで利用したいメソッドを見つけるのに役立ちます。
  0番目のインデックスを管理・設定するよりも少しだけ簡単になっています。

- PaginatorComponent は、範囲外のページにアクセスしようとした場合（例えば、
  リクエストされたページが全ページのカウントよりも大きかった場合など）に
  `NotFoundException` を投げるようになりました。


SecurityComponent
-----------------

- SecurityComponent は、 ``unlockedActions`` オプションをサポートしました。
  これは、このオプションに書かれた全てのアクションで、セキュリティチェックを
  全く行わないようになります。


RequestHandlerComponent
-----------------------

- :php:meth:`RequestHandlerComponent::viewClassMap()` が追加されました。
  これは、ビューのクラス名のマッピングに利用されます。
  拡張子やコンテンツに応じた正しいビュークラスを自動的にセッティングするために
  ``$settings['viewClassMap']`` を使用できます。

CookieComponent
---------------

- :php:meth:`CookieComponent::check()` が追加されました。
  :php:meth:`CakeSession::check()` と同じ動作です。


コンソール
============

- ``server`` シェルが追加されました。
  PHP5.4 の Web サーバ機能を CakePHP アプリケーションで利用することができます。

- 新しいアプリケーションを Bake する場合に、アプリケーション名をキャッシュの
  prefix にセットするようになりました。


I18n
====

L10n
----

- ISO 639-3 で定義されている ``nld`` がオランダ語のデフォルトロケールになり、
  ``dut`` はそのエイリアスとなりました。ロケールのフォルダは、
  `/Locale/dut/` から `/Locale/nld/` へ変更となりました。

- アルバニア語は ``sqi`` 、バスク語は ``eus``, 中国語は ``zho`` 、チベット語は ``bod`` 、
  チェコ語は ``ces`` 、ペルシア語は ``fas`` 、フランス語は ``fra`` 、アイスランド語は ``isl`` 、
  マケドニア語は ``mkd`` 、マレー語は ``msa`` 、ルーマニア語は ``ron`` 、セルビア語は ``srp`` 、
  スロバキア語は ``slk`` にそれぞれなりました。同様にロケールのフォルダも変更になりました。


コア
======

CakePlugin
----------

- :php:meth:`CakePlugin::load()` に ``ignoreMissing`` オプションが新たに加わりました。
  これを true にセットすると、route や bootstrap でロードしようとしたプラグインが
  見つからない場合でもエラーとなるのを防いでくれます。
  つまり、route または bootstrap で見つかる全てのプラグインを読み込むには次のような構文を使います::
  ``CakePlugin::loadAll(array(array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)))``


Configure
---------

- :php:meth:`Configure::check()` が追加されました。
  :php:meth:`CakeSession::check()` と同じ動作です。

- :php:meth:`ConfigReaderInterface::dump()` が追加されました。
  コンフィグを読み込むカスタム実装を作成している場合は、 ``dump()`` メソッドも実装して下さい。

- :php:meth:`IniReader::dump()` の ``$key`` パラメータは、``PhpReader::dump()``
  と同じような `PluginName.keyname` 形式のキーをサポートしました。



エラー
========

Exceptions
----------

- CakeBaseException が追加され、全ての Exception がこれを継承する形になりました。
  ベースとなる Exception クラスは、Exception インスタンスの生成時に、
  HTTP ヘッダやレスポンスを生成する ``responseHeader()`` メソッドを発動します。
  任意のレスポンスインスタンスを Exception として利用しないでください。


モデル
========

- 全てのコアデータソースとフィクスチャで biginteger タイプをサポートしました。
- MySQL ドライバで ``FULLTEXT`` インデックスをサポートしました。


Models
------

- ``Model::find('list')`` は ContainableBehavior で利用する場合、最大包括深度
  もしくは再帰値を元にした ``recursive`` をセットするようになりました。

- ``Model::find('first')`` は、ひとつもレコードが見つからなかった場合に、
  空の配列を返すようになりました。


Validation
----------

- バリデーションメソッドが見つからなかった場合、これまでのように
  development モードだけでなく、 **常に** エラーを吐くようになりました。


ネットワーク
==============

SmtpTransport
-------------

- SMTP コネクションで TLS/SSL がサポートされました。

CakeRequest
-----------

- :php:meth:`CakeRequest::onlyAllow()` が追加されました。
- :php:meth:`CakeRequest::query()` が追加されました。


CakeResponse
------------

- :php:meth:`CakeResponse::file()` が追加されました。
- `application/javascript` と `application/xml` 、 `application/rss+xml` の
  各コンテントタイプで charset も送信するようになりました。


CakeEmail
---------

- :php:meth:`CakeEmail::attachments()` に ``contentDisposition`` オプションが追加されました。
  添付ファイルに Content-Disposition ヘッダの付加を抑制することができます。



HttpSocket
----------

- :php:class:`HttpSocket` はデフォルトで SSL 証明書の検証を行うようになりました。
  もし自己署名の証明書やプロキシを利用した接続が必要な場合、新しいオプションを利用してください。
  詳しくは :ref:`http-socket-ssl-options` を参照して下さい。

- ``HttpResponse`` は ``HttpSocketResponse`` に名称変更となりました。
  PECL の HTTP モジュールとの名前衝突を回避します。
  互換性のために ``HttpResponse`` クラスが提供されています。


ルーティング
==============

Router
------

- :php:meth:`Router::url()` に ``tel:`` と ``sms:`` が追加されました。


ビュー
=========

- MediaView は非推奨となりました。
  代わりに :php:class:`CakeResponse` の新しい機能を使うことで同じ結果を得られます。
- Json と Xml のビューでのシリアライズは ``_serialize()`` へ移動しました。
- beforeRender と afterRender のコールバックは、Json と Xml ビューで
  テンプレートを使った場合にも呼ばれるようになりました。
- :php:meth:`View::fetch()` は引数 ``$default`` を持つようになりました。
  この引数は、ブロックが空であるものに対し、デフォルト値を設定することができます。
- :php:meth:`View::prepend()` は既存のブロックへコンテントを差し込めるように追加されました。
- :php:class:`XmlView` はトップレベルの XML ノードを指定するために
  ``_rootNode`` 変数を使用するようになりました。
- :php:meth:`View::elementExists()` が追加されました。
  エレメントを利用する前に、それが存在するかどうかのチェックに利用できます。
- :php:meth:`View::element()` に ``ignoreMissing`` オプションが追加されました。
  エレメントが見つからなかった場合のエラー発生を抑制することができます。
- :php:meth:`View::startIfEmpty()` が追加されました。


Layout
------

- app フォルダと cake パッケージ内にある bake 用のテンプレートのレイアウトファイルの
  doctype を XHTML から HTML5 へ変更しました。



ヘルパー
==========

- ヘルパーのセッティングに使う ``Helper::$settings`` プロパティが追加されました。
  ``Helper::__construct()`` の ``$settings`` パラメータは ``Helper::$settings``
  とマージされます。


FormHelper
----------

- :php:meth:`FormHelper::select()` は disabled のアトリビュートの値を許可するようになりました。
  ``'multiple' => 'checkbox'`` と組み合わせることで、disabled にしたい値の
  リストを提供できるようになります。
- :php:meth:`FormHelper::postLink()` は ``method`` キーを許可するようになりました。
  これを利用することで、POST 以外の HTTP メソッドを使ってフォームへのリンクを生成できます。
- :php:meth:`FormHelper::input()` を使って入力を作成した場合に、 ``errorMessage``
  オプションを false にすることができるようになりました。
  これはエラーメッセージの表示を抑制しますが、エラーのクラス名はそのまま残します。
- FormHelper は、HTML5 の ``required`` アトリビュートを input エレメントの
  バリデーションとして付与するようになりました。
  もし、フォームに「キャンセル」ボタンがある場合は、 HTML レベルのバリデーションの
  発動を抑制するために ``'formnovalidate' => true`` をキャンセルボタンのオプションへ
  追加してください。
  FormHelper::create() に ``'novalidate' => true`` オプションを追加することで、
  全てのエレメントでのバリデーションを抑制することができます。
- :php:meth:`FormHelper::input()` はフィールド名の名前を元に ``tel`` と
  ``email`` タイプを生成するようになりました。ただし、明示的に ``type``
  オプションが指定されている場合を除きます。



HtmlHelper
----------

- :php:meth:`HtmlHelper::getCrumbList()` は ``separator`` と ``firstClass`` 、
  ``lastClass`` オプションが追加されました。
  メソッドが生成する HTML の細かなコントロールができるようになりました。


TextHelper
----------

- テキストを終端から切り詰める :php:meth:`TextHelper::tail()` が追加されました。
- :php:meth:`TextHelper::truncate()` の `ending` は非推奨となり、代わりに `ellipsis`
  を利用してください。


PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` に ``currentTag`` オプションが追加されました。
- :php:meth:`PaginatorHelper::prev()` と :php:meth:`PaginatorHelper::next()` メソッドで
  ``tag`` オプションにラッパーを抑制する ``false`` がセットできるようになりました。
  これらの2つのメソッドに `disabledTag` オプションも追加されました。



テスト
========

- コアのフィクスチャのデフォルトに ``cake_sessions`` テーブルが追加されました。
  フィクスチャのリストに ``core.cake_sessions`` を追加することで利用できます。
- :php:meth:`CakeTestCase::getMockForModel()` が追加されました。
  モデルオブジェクトのモックを簡単に取得することができます。



ユーティリティ
================

CakeNumber
----------

- :php:meth:`CakeNumber::fromReadableSize()` が追加されました。
- :php:meth:`CakeNumber::formatDelta()` が追加されました。
- :php:meth:`CakeNumber::defaultCurrency()` が追加されました。


Folder
------

- :php:meth:`Folder::copy()` と :php:meth:`Folder::move()` で
  上書きとスキップの機能に加え、ターゲットとソースディレクトリのマージに対応しました。


String
------

- テキストを終端から切り詰める :php:meth:`String::tail()` が追加されました。
- :php:meth:`String::truncate()` の `ending` は非推奨となり、代わりに `ellipsis`
  を利用してください。





Debugger
--------

- :php:meth:`Debugger::exportVar()` は PHP >= 5.3.0 の場合に private および
  protected なプロパティも出力するようになりました。


Security
--------

- `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ のサポートが追加されました。
  bcrypt の使用方法の詳細は :php:class:`Security::hash()` のドキュメントを参照して下さい。


Validation
----------

- :php:meth:`Validation::fileSize()` が追加されました。


ObjectCollection
----------------

- :php:meth:`ObjectCollection::attached()` が非推奨となり、代わりに新しいメソッド
  :php:meth:`ObjectCollection::loaded()` を利用して下さい。
  ObjectCollection へのアクセスは attach()/detach() から変更済みの load()/unload() に統一されました。
