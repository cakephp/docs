アプリケーション
################

``Application`` はあなたのアプリケーションの心臓部です。
アプリケーションがどのように構成され、何のプラグイン、ミドルウェア、コンソールコマンド、およびルートが含まれているかを制御します。

``Application`` クラスは **src/Application.php** にあります。
デフォルトでは非常にスリムで、いくつかのデフォルトの :doc:`/controllers/middleware`
を定義しているだけです。 Application は、次のフックメソッドを定義できます。

* ``bootstrap`` :doc:`設定ファイル </development/configuration>` を読み込み、
  定数やグローバル関数を定義するために使用されます。デフォルトでは、 **config/bootstrap.php** を
  含みます。これは、あなたのアプリケーションが使用する :doc:`/plugins` を読み込むのに理想的な場所です。
* ``routes`` :doc:`ルート </development/routing>` を読み込むために使用されます。
  デフォルトでは、 **config/routes.php** を含みます。
* ``middleware`` アプリケーションに :doc:`ミドルウェア </controllers/middleware>`
  を追加するために使用されます。
* ``console`` アプリケーションに :doc:`コンソールコマンド </console-commands>`
  を追加するために使用されます。
  デフォルトでは、アプリケーションとすべてのプラグインのシェルとコマンドが自動的に検出されます。
* ``events`` アプリケーションのイベントマネージャーに
  :doc:`イベントリスナー </core-libraries/events>` を追加するために使用されます。


.. _application-bootstrap:

Application::bootstrap()
------------------------

アプリケーションの低レベルな関心事を設定するために使用する **config/bootstrap.php** ファイルに加えて、
プラグインのロードや初期化、グローバルイベントリスナーの追加のために ``Application::bootstrap()`` フックメソッドが利用できます::

    // in src/Application.php
    namespace App;

    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // Call the parent to `require_once` config/bootstrap.php
            parent::bootstrap();

            // Load MyPlugin
            $this->addPlugin('MyPlugin');
        }
    }

``Application::bootstrap()`` でプラグインとイベントをロードすると、イベントとルートが各テストメソッドで再処理されるので、
:ref:`integration-testing` が簡単になります。

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication
