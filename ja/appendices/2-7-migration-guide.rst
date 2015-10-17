2.7 移行ガイド
###############

CakePHP 2.7 は、2.6 の API の完全上位互換です。
このページでは、2.7 の変更と改善についてのアウトラインを紹介します。

システム要件
============
CakePHP 2.7 で必要な PHP バージョンは、 PHP 5.3.0 に引き上げられました。

コンソール
==========

- プラグインの名前と共有するプラグインシェルは、プラグインのプレフィックスなしで
  呼ぶことができます。例えば、 ``Console/cake MyPlugin.my_plugin`` は、
  ``Console/cake my_plugin`` で呼ぶことができます。
- ``Shell::param()`` が 3.0 から 2.7 にバックポートされました。このメソッドは、
  notice エラーの心配なしに CLI オプションを呼ぶことができます。

コア
====

Configure
---------

- １ステップで Configure から読み込みと削除をするための
  :php:meth:`Configure::consume()` が追加されました。

データソース
============

- null が使えないカラムで、行が新規作成もしくは更新される時、
  SQL データソースは、 ``''`` と ``null`` を ``''`` にキャストします。

CakeSession
-----------

- １ステップでセッションから読み込みと削除をするための
  :php:meth:`CakeSession::consume()` が追加されました。
- :php:meth:`CakeSession::clear()` に引数 `$renew` が追加されました。
  新しい id を強制せずにセッションを空し、セッションを更新します。
  デフォルトは　``true`` です。

モデル
======

TreeBehavior
------------

- 新しい `レベル` 設定が利用可能になりました。ツリーノードの深さが保存されている
  フィールド名を指定できるようになりました。
- ノードの深さを取得する新しいメソッド ``TreeBehavior::getLevel()`` が追加されました。
- ``TreeBehavior::generateTreeList()`` のフォーマット処理は、
  ``TreeBehavior::formatTreeList()`` メソッドに抽出されました。

ネットワーク
============

CakeEmail
---------

- CakeEmail は、 インスタンス生成時に使用する設定を明示していなかった時、
  'default' 設定を使用するようになりました。例えば、 ``$email = new CakeEmail();``
  は、 'default' 設定を使用します。

ユーティリティ
==============

CakeText
--------

``String`` クラスは、 ``CakeText`` に名前を変更しました。これは、
PHP7 以上や HHVM に関連するいくつかの互換性の衝突を解決します。
``String`` クラスもまた、互換性のために残されました。

Validation
----------

- ``Validation::notEmpty()`` は、 ``Validation::notBlank()`` に名前を変更しました。
  PHP の `notEmpty()` 関数との混乱を避けることが狙いです。このバリデーション規則は、
  ``0`` も正しい入力として受け入れます。

コントローラ
============

SessionComponent
----------------

- １ステップでセッションから読み込みと削除をするために
  :php:meth:`SessionComponent::consume()` が追加されました。
- :php:meth:`SessionComponent::setFlash()` は非推奨です。代わりに
  :php:class:`FlashComponent` を使用してください。

RequestHandlerComponent
-----------------------

- Accept ヘッダー ``text/plain`` は、自動的に ``csv`` レスポンスタイプへのマップを
  やめました。これは、3.0 からのバックポートです。

ビュー
======

SessionHelper
-------------

- １ステップでセッションから読み込みと削除をするために
  :php:meth:`SessionHelper::consume()` が追加されました。
- :php:meth:`SessionHelper::flash()` は非推奨です。代わりに
  :php:class:`FlashHelper` を使用してください。

テスト
======

ControllerTestCase
------------------

- :php:meth:`ControllerTestCase::testAction()` は URL として配列をサポートします。
