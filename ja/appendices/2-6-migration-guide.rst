2.6 移行ガイド
###############

CakePHP 2.6 は、2.5 の API の完全上位互換です。
このページでは、2.6 の変更と改善についてのアウトラインを紹介します。

Basics.php
==========

- ``stackTrace()`` が ``Debugger::trace()`` の便利なラッパー関数として追加されました。
  その関数は ``debug()`` のように直接表示します。しかし、デバッグレベルが有効時のみです。
- 新しい国際化の関数が追加されました。新しい関数は、紛らわしいメッセージ文字列を
  なるべくわかりやすくしたメッセージ文脈にできます。例えば、 「read』 は英語では、
  文脈によって複数の意味を持ちます。新しい ``__x``, ``__xn``, ``__dx``, ``__dxn``,
  ``__dxc``, ``__dxcn`` そして ``__xc`` 関数は新しい機能へのアクセスを提供します。

キャッシュ
==========

RedisEngine
-----------

- ``RedisEngine`` が ``Inflector::slug(APP_DIR)`` のデフォルトプレフィックスを持ちます。

コンソール
==========

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::removeSubcommand()`` が追加されました。

Shell
-----

- ``overwrite()`` は、プログレスバーの生成を可能にし、すでに画面に表示されたテキストを
  置換することでとても長い行の出力を避けるために追加されました。

コントローラ
============

AuthComponent
-------------

- ``AuthComponent`` に ``userFields`` オプションが追加されました。
- AuchComponent は、ユーザーを認証してログインした時に ``Auth.afterIdentity`` イベントが発生します。
  イベントは、データとしてログインユーザを含みます。

ビヘイビア
==========

AclBehavior
-----------

- ``Model::parentNode()`` は、 ``$model->parentNode($type)`` の最初の引数にタイプ (Aro, Aco) を渡します。

データソース
============

Mysql
-----

- 正規表現で検索するために ``RLIKE`` ワイルドカード演算子が追加されました。
- Mysql のスキーママイグレーションは、項目追加時に ``after`` キーをサポートします。
  このキーは、どの項目の後に新しい項目を追加するかを決めることができます。


モデル
======

Model
-----

- ``Model::save()`` に ``atomic`` オプションが 3.0 からバックポートされました。
- ``Model::afterFind()`` は、常に一貫性のある書式を使用します。
  ``$primay`` が false の時、結果は常に ``$data[0]['モデル名']`` 以下に配置されます。
  本来の振る舞いに戻すには、モデルの ``useConsistentAfterFind`` プロパティを false に
  設定します。

ネットワーク
============

CakeRequest
-----------

- ``CakeRequest::param()`` は ``data()`` 関数のように :ref:`hash-path-syntax` で値を読むことができます。
- ``CakeRequest::setInput()`` が追加されました。

HttpSocket
----------

- ``HttpSocket::head()`` が追加されました。
- リクエスト作成時に使用する特定のプロトコルを上書きするために ``protocol`` オプションを使用します。


I18n
====

- 翻訳の順番を操作するためにConfigure の値 ``I18n.preferApp`` を使用するようになりました。
  true を設定するとプラグインでの翻訳よりもアプリでの翻訳を優先します。

ユーティリティ
==============

CakeTime
--------

- ``CakeTime::timeAgoInWords()`` は ``strftime()`` 互換の絶対日付書式をサポートします。
  これは書式化された時間をローカライズすることが容易になります。

Hash
----

- ``Hash::get()`` は、パス引数が不正な時、例外が発生するようになりました。
- ``Hash::nest()`` は、ネストされた操作の結果、データがない時、例外が発生するようになりました。


Validation
----------

- ``Validation::between`` は非推奨になりました。代わりに :php:meth:`Validation::lengthBetween` を使用してください。
- ``Validation::ssn`` は非推奨になりました。スタンドアロンまたはプラグインでの解決が用意されます。


ビュー
======

JsonView
--------

- ``JsonView`` は ``_jsonOptions`` ビュー変数をサポートします。
  これは、 JSON を生成する際に使用するビットマップオプションの設定が可能です。

XmlView
-------

- ``XmlView`` は ``_xmlOptions`` ビュー変数をサポートします。
  これは、 XML を生成する際に使用するオプションの設定が可能です。

ヘルパー
========

HtmlHelper
----------

- :php:meth:`HtmlHelper::css()` は ``once`` オプションを追加しました。
  これは ``HtmlHelper::script()`` の ``once`` オプションと同じ働きをします。
  後方互換性のため、デフォルト値は ``false`` です。
- :php:meth:`HtmlHelper::link()` の ``$confirmMessage`` 引数は非推奨です。
  メッセージを指定するには、代わりに ``$options`` の ``confirm`` キーを使用してください。

FormHelper
----------

- :php:meth:`FormHelper::postLink()` の ``$confirmMessage`` 引数は非推奨です。
  メッセージを指定するには、代わりに ``$options`` の ``confirm`` キーを使用してください。
- DB フィールドが varchar 型の場合、HTMLの仕様に従ってテキストエリアに ``maxlength`` 属性を指定できます。

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::meta()` はページ切り替えされた結果データのためのメタリンク(prev/next 関連)を出力するために追加されました。
