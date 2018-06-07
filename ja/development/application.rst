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
* ``console`` アプリケーションに :doc:`コンソールコマンド </console-and-shells>`
  を追加するために使用されます。
  デフォルトでは、アプリケーションとすべてのプラグインのシェルとコマンドが自動的に検出されます。
* ``events`` アプリケーションのイベントマネージャーに
  :doc:`イベントリスナー </core-libraries/events>` を追加するために使用されます。

.. _adding-http-stack:

既存アプリケーションへの新しい HTTP スタック追加
================================================

既存のアプリケーションで HTTP ミドルウェアを使うには、アプリケーションにいくつかの
変更を行わなければなりません。

#. まず **webroot/index.php** を更新します。 `app スケルトン
   <https://github.com/cakephp/app/tree/master/webroot/index.php>`__ から
   ファイルの内容をコピーしてください。
#. ``Application`` クラスを作成します。どのようにするかについては上の :ref:`using-middleware`
   セクションを参照してください。もしくは `app スケルトン
   <https://github.com/cakephp/app/tree/master/src/Application.php>`__
   の中の例をコピーしてください。
#. **config/requirements.php** を作成します。もし存在しない場合、 `app スケルトン
   <https://github.com/cakephp/app/blob/master/config/requirements.php>`__ から
   内容を追加してください。

これら三つの手順が完了すると、アプリケーション／プラグインのディスパッチフィルターを
HTTP ミドルウェアとして再実装を始める準備が整います。

もし、テストを実行する場合は、 `app スケルトン
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_ から、
ファイルの内容をコピーして **tests/bootstrap.php** を更新することも必要になります。

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication
