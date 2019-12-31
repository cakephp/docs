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

View
----

* ``JsonView``の特殊なビュー変数 ``_serialize`` 、 ``_jsonOptions`` および ``_jsonp`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``XmlView`` の特殊なビュー変数 ``_serialize`` 、 ``_rootNode`` および ``_xmlOptions`` は非推奨になりました。
  代わりに、 ``viewBuilder()->setOption($optionName, $optionValue)`` を、それらのオプションを設定するために使用してください。
* ``HtmlHelper::tableHeaders()`` は、ネストされたリストとして定義される属性を持つヘッダーセルを優先するようになりました。
  例: ``['Title', ['class' => 'special']]``

Mailer
-----

* ``Cake\Mailer\Email`` クラスは非推奨になります。代わりに、 ``Cake\Mailer\Mailer`` を使用してください。

App
---

* ``App::path()`` の2番目の引数 ``$plugin`` は非推奨です。プラグインパス用には、代わりに、
  ``\Cake\Core\Plugin::classPath()/templatePath()`` を使用してください。

破壊的変更
==========

非推奨機能の削除に加えて、破壊的変更が行われました。

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` とこのメソッドのすべての実装が削除されました。
  このメソッドは、ほとんどのキャッシュドライバーでノーオペレーションであり、ファイルキャッシュでのみ使用されていました。

Controller
----------

* ``Cake\Controller\Controller::referer()`` は、デフォルトで ``local`` パラメーターを、
  false ではなく true に設定します。
  これにより、デフォルトでアプリケーションのドメインに制限されるため、リファラルヘッダーの使用がより安全になります。
* アクションの呼び出し時のコントローラーメソッド名のマッチングで、大文字と小文字が区別されるようになりました。
  たとえば、コントローラーメソッドが ``forgotPassword()`` の場合、 URL で文字列 ``forgotpassword``
  を使用すると、アクション名としてマッチしません。

Console
-------

* ``ConsoleIo::styles()`` は ``getStyle()`` と ``setStyle()`` に分割されました。これは ``ConsoleOutput`` にも影響します。

Component
---------

* JSON/XML 入力をリクエストデーター配列に解析できる ``RequestHandlerComponent`` の入力データ解析機能は、削除されました。
  入力デー後の解析が必要な場合は、代わりに、アプリケーションで ``Cake\Http\Middleware\BodyParserMiddleware``
  を使用する必要があります。
* ``Cake\Controller\Component\RequestHandlerComponent`` は、リクエストパラメーターではなくリクエスト属性として、
  ``isAjax`` を設定するようになりました。したがって、 ``$request->getParam('isAjax')`` の代わりに
  ``$request->getAttribute('isAjax')`` を使用する必要があります。
* ``RequestHandlerComponent`` の入力データ解析機能は削除され、非推奨の警告を発します。
  代わりに、 :ref:`body-parser-middleware` を使用する必要があります。
* ``Cake\Controller\Component\PagingComponent`` は、リクエストパラメーターではなくリクエスト属性として、
  ページングパラメーター情報を設定するようになりました。したがって、 ``$request->getParam('paging')`` の代わりに、
  ``$request->getAttribute('paging')`` を使用する必要があります。

