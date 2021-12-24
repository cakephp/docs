アプリケーション
################

``Application`` はあなたのアプリケーションの心臓部です。
アプリケーションがどのように構成され、何のプラグイン、ミドルウェア、コンソールコマンド、およびルートが含まれているかを制御します。。

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

In addition to the **config/bootstrap.php** file which should be used to
configure low-level concerns of your application, you can also use the
``Application::bootstrap()`` hook method to load/initialize plugins, and attach
global event listeners::

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

Loading plugins and events in ``Application::bootstrap()`` makes
:ref:`integration-testing` easier as events and routes will be re-processed on
each test method.

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication
