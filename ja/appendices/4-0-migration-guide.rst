4.0 移行ガイド
##############

CakePHP 4.0 には、重大な変更が含まれており、3.x リリースとの後方互換性はありません。
4.0 にアップグレードする前に、最初に 3.8 にアップグレードし、すべての非推奨警告を解消してください。

4.0.x にアップグレードするには、次の composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

非推奨機能の削除
================

3.8 から非推奨の警告を発していたすべてのメソッド、プロパティおよび機能が削除されました。

認証機能がスタンドアロンのプラグイン `Authentication
<https://github.com/cakephp/authentication>`__ および
`Authorization <https://github.com/cakephp/authorization>`__ に分割されました。
以前の RssHelper は、同様の機能を持つスタンドアロンの `Feed plugin
<https://github.com/dereuromark/cakephp-feed>`__ として見つけることができます。