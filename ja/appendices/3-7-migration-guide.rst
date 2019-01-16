3.7 移行ガイド
##############

CakePHP 3.7 は 3.6 の API の完全上位互換です。
このページでは、3.7 の変更と改善についてのアウトラインを紹介します。

3.7.x にアップグレードするには、次の Composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.7.*"

非推奨
======

以下は、非推奨のメソッド、プロパティと動作の一覧です。
これらの機能は、4.0.0以後に削除されるまで機能し続けます。

* ``Cake\Form\Form::errors()`` は非推奨です。代わりに ``getErrors()`` を使用してください。
* ``Cake\Http\Client\Response::$headers`` は非推奨です。代わりに ``getHeaders()`` または
  ``getHeaderLine()`` を使用してください。
* ``Cake\Http\Client\Response::$body`` は非推奨です。代わりに ``getStringBody()``
  を使用してください。
* ``Cake\Http\Client\Response::$json`` は非推奨です。代わりに ``getJson()`` を使用してください。
* ``Cake\Http\Client\Response::$xml`` は非推奨です。代わりに ``getXml()`` を使用してください。
* ``Cake\Http\Client\Response::$cookies`` は非推奨です。代わりに ``getCookies()``
  を使用してください。
* ``Cake\Http\Client\Response::$code`` は非推奨です。代わりに ``getStatusCode()``
  を使用してください。
* ``Cake\Http\Client\Response::body()`` は非推奨です。代わりに ``getStringBody()``
  を使用してください。
* ``Cake\ORM\Association::className()`` は非推奨になります。代わりに ``getClassName()``
  と ``setClassName()`` を使用してください。
* 情報を読むために ``Cake\Database\Query::join()`` を使用することは非推奨です。
  代わりに ``Query::clause('join')`` を使用してください。
* 情報を読むために ``Cake\Database\Query::from()`` を使用することは非推奨です。
  代わりに ``Query::clause('from')`` を使用してください。
* ``Cake\Database\Connection::logQueries()`` は非推奨です。代わりに ``enableQueryLogging()``
  と ``isQueryLoggingEnabled()`` を使用してください。
* ``Cake\Http\Response::withCookie()`` に文字列/配列パラメータを設定することは非推奨です。
  代わりに ``Cake\Http\Cookie\Cookie`` インスタンスをわたす必要があります。
* ``Cake\Validation\Validation::cc()`` は ``creditCard()`` に名前が変更されました。
* ``Cake\View\ViewVarsTrait::viewOptions()`` は非推奨です。代わりに ``viewBuilder()->setOptions()``
  を使用してください。
* ``Cake\View\View::$request`` は protected になります。他のコンテキストから
  Viewのリクエストインスタンスにアクセスするためには ``View::getRequest()/setRequest()``
  を使用してください。
* ``Cake\View\View::$response`` は protected になります。他のコンテキストから
  Viewのリクエストインスタンスにアクセスするためには ``View::getResponse()/setResponse()``
  を使用してください。
* ``Cake\View\View::$templatePath`` は protected になります。代わりに
  ``getTemplatePath()/setTemplatePath()`` を使用してください。
* ``Cake\View\View::$template`` は protected になります。代わりに
  ``getTemplate()/setTemplate()`` を使用してください。
* ``Cake\View\View::$layout`` は protected になります。代わりに
  ``getLayout()/setLayout()`` を使用してください。
* ``Cake\View\View::$layoutPath`` は protected になります。代わりに
  ``getLayoutPath()/setLayoutPath()`` を使用してください。
* ``Cake\View\View::$autoLayout`` は protected になります。代わりに
  ``enableAutoLayout()/isAutoLayoutEnabled()`` を使用してください。
* ``Cake\View\View::$theme`` は protected になります。代わりに
  ``getTheme()/setTheme()`` を使用してください。
* ``Cake\View\View::$subDir`` は protected になります。代わりに
  ``getSubDir()/setSubDir()`` を使用してください。
* ``Cake\View\View::$plugin`` は protected になります。代わりに
  ``getPlugin()/setPlugin()`` を使用してください。
* ``Cake\View\View::$name`` は protected になります。代わりに
  ``getName()/setName()`` を使用してください。
* ``Cake\View\View::$elementCache`` は protected になります。代わりに
  ``getElementCache()/setElementCache()`` を使用してください。
* ``Cake\View\View::$Blocks`` は protected になります。ブロックと対話するためには
  Viewのパブリックメソッドを使用してください。
* ``Cake\View\View:$helpers`` は protected になります。代わりに
  HelperRegistry と対話するためには ``helpers()`` を使用してください。
* ``Cake\View\View::$uuids`` は非推奨であり、4.0で削除されます。
* ``Cake\View\View::uuid()`` は非推奨であり、4.0で削除されます。
* ``Cake\View\Cell::$template`` は protected になります。代わりに
  ``viewBuilder()->getTemplate()/setTemplate()`` を使用してください。
* ``Cake\View\Cell::$plugin`` は protected になります。代わりに
  ``viewBuilder()->getPlugin()/setPlugin()`` を使用してください。
* ``Cake\View\Cell::$helpers`` は protected になります。代わりに
  ``viewBuilder()->getHelpers()/setHelpers()`` を使用してください。
* ``Cake\View\Cell::$action`` は protected になります。
* ``Cake\View\Cell::$args`` は protected になります。
* ``Cake\View\Cell::$View`` は protected になります。
* ``Cake\View\Cell::$request`` は protected になります。
* ``Cake\View\Cell::$response`` は protected になります。
* ``Cake\View\ViewVarsTrait::$viewVars`` は非推奨です。このパブリックプロパティは、
  4.0.0 で削除されます。代わりに ``set()`` を使用してください。
* ``Cake\Filesystem\Folder::normalizePath()`` は非推奨です。代わりに
  ``correctSlashFor()`` を使用するべきです。
* ``Cake\Mailer\Email::setConfigTransport()`` は非推奨です。代わりに
  ``Cake\Mailer\TransportFactory::setConfig()`` を使用してください。
* ``Cake\Mailer\Email::getConfigTransport()`` は非推奨です。代わりに
  ``Cake\Mailer\TransportFactory::getConfig()`` を使用してください。
* ``Cake\Mailer\Email::configTransport()`` は非推奨です。代わりに
  ``Cake\Mailer\TransportFactory::getConfig()/setConfig()`` を使用してください。
* ``Cake\Mailer\Email::configuredTransport()`` は非推奨です。代わりに
  ``Cake\Mailer\TransportFactory::configured()`` を使用してください。
* ``Cake\Mailer\Email::dropTransport()`` は非推奨です。代わりに
  ``Cake\Mailer\TransportFactory::drop()`` を使用してください。
* 以下のビュー関連の ``Cake\Mailer\Email`` のメソッドは非推奨になりました。:
  ``setTemplate()`` ・ ``getTemplate()`` ・ ``setLayout()`` ・ ``getLayout()``
  ``setTheme()`` ・ ``getTheme()`` ・ ``setHelpers()`` ・ ``getHelpers()``
  代わりにメールのビュービルダーを通して同じメソッドを使用してください。例えば、
  ``$email->viewBuilder()->getTemplate()``。
* ``Cake\Mailer\Mailer::layout()`` は非推奨です。
  代わりに ``$mailer->viewBuilder()->setLayout()`` を使用してください。
* ``Helper::$theme`` は削除されました。代わりに ``View::getTheme()`` を使用してください。
* ``Helper::$plugin`` は削除されました。代わりに ``View::getPlugin()`` を使用してください。
* ``Helper::$fieldset`` と ``Helper::$tags`` は使われていないので非推奨です。
* ``Helper::$helpers`` は protected になったため、ヘルパークラスの外からアクセスするべきではありません。
* ``Helper::$request`` は削除されました。
  代わりに ``View::getRequest()``、``View::setRequest()`` を使用してください。
* ``Cake\Core\Plugin::load()`` と ``loadAll()`` は非推奨です。代わりに
  ``Application::addPlugin()`` を使用するべきです。
* ``Cake\Core\Plugin::unload()`` は非推奨です。代わりに
  ``Plugin::getCollection()->remove()`` か ``clear()`` を使用してください。
* 以下の ``Cake\Error\ExceptionRender`` のプロパティは protected になりました。:
  ``$error`` ・ ``$controller`` ・ ``$template`` ・ ``$method``
* ``TestCase::$fixtures`` にてアンダースコアー形式のフィクスチャ名を使用することは非推奨です。
  代わりにキャメルケース形式の名前を使用してください。例えば、 ``app.FooBar`` や ``plugin.MyPlugin.FooBar`` です。

緩やかな非推奨
==============

以下のメソッド、プロパティ、機能は非推奨になりますが、5.0.0まで削除されません。

* ``Cake\TestSuite\ConsoleIntegrationTestCase`` は非推奨です。代わりに
  ``Cake\TestSuite\ConsoleIntegrationTestTrait`` をテストケースに含めるべきです。
