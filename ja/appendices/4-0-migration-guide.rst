4.0 移行ガイド
##############

CakePHP 4.0 には、重大な変更が含まれており、3.x リリースとの後方互換性はありません。
4.0 にアップグレードする前に、最初に 3.8 にアップグレードし、すべての非推奨警告を解消してください。

4.0.x にアップグレードするには、次の composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

非推奨機能の削除
================

3.8 から非推奨の警告を発していたすべてのメソッド、プロパティと機能が削除されました。

認証機能がスタンドアロンのプラグイン `Authentication
<https://github.com/cakephp/authentication>`__ および
`Authorization <https://github.com/cakephp/authorization>`__ に分割されました。
以前の RssHelper は、同様の機能を持つスタンドアロンの `Feed plugin
<https://github.com/dereuromark/cakephp-feed>`__ として見つけることができます。

非推奨
======

以下は、非推奨メソッド、プロパティと動作の一覧です。
これらの機能は、 4.x でも引き続き機能し、 5.0.0 で削除されます。

Component
---------

* ``AuthComponent`` および関連するクラスは廃止され、 5.0.0 で削除されます。代わりに、
  上記の認証および認可ライブラリを使用する必要があります。
* ``SecurityComponent`` は非推奨です。代わりに、フォーム改ざん保護のためには ``FormProtectionComponent`` を使用し、
  ``requireSecure`` 機能のためには :ref:`https-enforcer-middleware` を使用してください。

Filesystem
----------

* このパッケージは非推奨であり、 5.0 で削除されます。多くの設計上の問題があり、この頻繁に使用されないパッケージを修正することは、
  既に多くのパッケージが存在している場合、努力する価値がないと思われます。

ORM
---

* ``Entity::isNew()`` をセッターとして使うことは非推奨です。代わりに ``setNew()`` を使用してください。
* ``Entity::unsetProperty()`` は、他のメソッドに合わせて ``Entity::unset()`` に名前が変更されました。
