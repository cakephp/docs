2.6 移行ガイド
###############

..
 CakePHP 2.6 is a fully API compatible upgrade from 2.5.  This page outlines
 the changes and improvements made in 2.6.

CakePHP 2.6 は、2.5 の API の完全上位互換です。
このページでは、2.5 の変更と改善についてのアウトラインを紹介します。

Basics.php
==========

..
 - ``stackTrace()`` has been added as a convenience wrapper function for ``Debugger::trace()``.
  It directly echos just as ``debug()`` does. But only if debug level is on.
 - New i18n functions have been added. The new functions allow you to include
  message context which allows you disambiguate possibly confusing message
  strings. For example 'read' can mean multiple things in english depending on
  the context. The new ``__x``, ``__xn``, ``__dx``, ``__dxn``, ``__dxc``,
  ``__dxcn``, and ``__xc`` functions provide access to the new features.

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

.. - The ``RedisEngine`` now has a default prefix of ``Inflector::slug(APP_DIR)``.

- ``RedisEngine`` が ``Inflector::slug(APP_DIR)`` のデフォルトプレフィックスを持ちます。

コンソール
==========

ConsoleOptionParser
-------------------

..
 - ``ConsoleOptionParser::removeSubcommand()`` was added.

- ``ConsoleOptionParser::removeSubcommand()`` が追加されました。

Shell
-----

..
 - ``overwrite()`` has been added to allow generating progress bars or to avoid outputting
  too many lines by replacing text that has been already outputted to the screen.

- ``overwrite()`` は、プログレスバーの生成を可能にし、すでに画面に表示されたテキストを
  置換することでとても長い行の出力を避けるために追加されました。

コントローラ
============

AuthComponent
-------------

..
 - ``AuthComponent`` had the ``userFields`` option added.
 - AuthComponent now triggers an ``Auth.afterIdentify`` event after a user has
  been identified and logged in. The event will contain the logged in user as
  data.

- ``AuthComponent`` に ``userFields`` オプションが追加されました。
- AuchComponent は、ユーザーを認証してログインした時に``Auth.afterIdentity`` イベントが発生します。
  イベントは、データとしてログインユーザを含みます。

ビヘイビア
==========

AclBehavior
-----------

..
 - ``Model::parentNode()`` now gets the type (Aro, Aco) passed as first argument: ``$model->parentNode($type)``.

- ``Model::parentNode()`` は、 ``$model->parentNode($type)`` の最初の引数にタイプ (Aro, Aco) を渡します。

データソース
============

Mysql
-----

..
 - The ``RLIKE`` wildcard operator has been added to allow regular expression pattern lookups this way.
 - Schema migrations with MySQL now support an ``after`` key when adding
  a column. This key allows you to specify which column the new one should be
  added after.

- 正規表現で検索するために ``RLIKE`` ワイルドカード演算子が追加されました。
- Mysql のスキーママイグレーションは、項目追加時に ``after`` キーをサポートします。
  このキーは、どの項目の後に新しい項目を追加するかを決めることができます。


モデル
======

Model
-----

..
 - ``Model::save()`` had the ``atomic`` option back-ported from 3.0.
 - ``Model::afterFind()`` now always uses a consistent format for afterFind().
  When ``$primary`` is false, the results will always be located under
  ``$data[0]['ModelName']``. You can set the ``useConsistentAfterFind`` property
  to false on your models to restore the original behavior.

- ``Model::save()`` に ``atomic`` オプションが 3.0 からバックポートされました。
- ``Model::afterFind()`` は、常に一貫性のある書式を使用します。
  ``$primay`` が false の時、結果は常に ``$data[0]['モデル名']`` 以下に配置されます。
  本来の振る舞いに戻すには、モデルの ``useConsistentAfterFind`` プロパティを false に
  設定します。

ネットワーク
============

CakeRequest
-----------

..
 - ``CakeRequest::param()`` can now read values using :ref:`hash-path-syntax`
  like ``data()``.
 - ``CakeRequest:setInput()`` was added.

- ``CakeRequest::param()`` は ``data()`` 関数のように :ref:`hash-path-syntax` で値を読むことができます。
- ``CakeRequest::setInput()`` が追加されました。

HttpSocket
----------

..
 - ``HttpSocket::head()`` was added.
 - You can now use the ``protocol`` option to override the specific protocol to
  use when making a request.

- ``HttpSocket::head()`` が追加されました。
- リクエスト作成時に使用する特定のプロトコルを上書きするために ``protocol`` オプションを使用します。


I18n
====

..
 - Configure value ``I18n.preferApp`` can now be used to control the order of translations.
  If set to true it will prefer the app translations over any plugins' ones.

- 翻訳の順番を操作するためにConfigure の値 ``I18n.preferApp`` を使用するようになりました。
  true を設定するとプラグインでの翻訳よりもアプリでの翻訳を優先します。

ユーティリティ
==============

CakeTime
--------

..
 - ``CakeTime::timeAgoInWords()`` now supports ``strftime()`` compatible absolute
  date formats. This helps make localizing formatted times easier.

- ``CakeTime::timeAgoInWords()`` は ``strftime()`` 互換の絶対日付書式をサポートします。
  これは書式化された時間をローカライズすることが容易になります。

Hash
----

..
 - ``Hash::get()`` now raises an exception when the path argument is invalid.
 - ``Hash::nest()`` now raises an exception when the nesting operation results in
  no data.

- ``Hash::get()`` は、パス引数が不正な時、例外が発生するようになりました。
- ``Hash::nest()`` は、ネストされた操作の結果、データがない時、例外が発生するようになりました。


Validation
----------

..
 - ``Validation::between`` has been deprecated, you should use
  :php:meth:`Validation::lengthBetween` instead.
 - ``Validation::ssn`` has been deprecated and can be provided as standalone/plugin solution.

- ``Validation::between`` は非推奨になりました。代わりに :php:meth:`Validation::lengthBetween` を使用してください。
- ``Validation::ssn`` は非推奨になりました。スタンドアロンまたはプラグインでの解決が用意されます。


ビュー
======

JsonView
--------

..
 - ``JsonView`` now supports the ``_jsonOptions`` view variable.
  This allows you to configure the bit-mask options used when generating JSON.

- ``JsonView`` は ``_jsonOptions`` ビュー変数をサポートします。
  これは、 JSON を生成する際に使用するビットマップオプションの設定が可能です。

XmlView
-------

..
 - ``XmlView`` now supports the ``_xmlOptions`` view variable.
  This allows you to configure the options used when generating XML.

- ``XmlView`` は ``_xmlOptions`` ビュー変数をサポートします。
  これは、 XML を生成する際に使用するオプションの設定が可能です。

ヘルパー
========

HtmlHelper
----------

..
 - :php:meth:`HtmlHelper::css()` had the ``once`` option added. It works the same
  as the ``once`` option for ``HtmlHelper::script()``. The default value is
  ``false`` to maintain backwards compatibility.
 - The ``$confirmMessage`` argument of :php:meth:`HtmlHelper::link()` has been
  deprecated. You should instead use key ``confirm`` in ``$options`` to specify
  the message.

- :php:meth:`HtmlHelper::css()` は ``once`` オプションを追加しました。
  これは ``HtmlHelper::script()`` の ``once`` オプションと同じ働きをします。
  後方互換性のため、デフォルト値は ``false`` です。
- :php:meth:`HtmlHelper::link()` の ``$confirmMessage`` 引数は非推奨です。
  メッセージを指定するには、代わりに ``$options`` の ``confirm`` キーを使用してください。

FormHelper
----------

..
 - The ``$confirmMessage`` argument of :php:meth:`FormHelper::postLink()` has been
  deprecated. You should instead use key ``confirm`` in ``$options`` to specify
  the message.
 - The ``maxlength`` attribute will now also be applied to textareas, when the corresponding
  DB field is of type varchar, as per HTML specs.

- :php:meth:`FormHelper::postLink()` の ``$confirmMessage`` 引数は非推奨です。
  メッセージを指定するには、代わりに ``$options`` の ``confirm`` キーを使用してください。
- DB フィールドが varchar 型の場合、HTMLの仕様に従ってテキストエリアに ``maxlength`` 属性を指定できます。

PaginatorHelper
---------------

..
 - :php:meth:`PaginatorHelper::meta()` has been added to output the meta-links (rel prev/next) for a paginated result set.

- :php:meth:`PaginatorHelper::meta()` はページ切り替えされた結果データのためのメタリンク(prev/next関連)を出力するために追加されました。

