Debug Kit
#########

DebugKit は、CakePHP アプリケーション用のデバッグツールバーと拡張デバッグツールを提供します。
アプリケーションの設定データ、ログメッセージ、SQL クエリー、およびタイミングデータをすばやく
確認できます。

.. warning::

    DebugKit は、シングルユーザーのローカル開発環境での使用を目的としています。
    共有開発環境、ステージング環境、または設定データと環境変数を隠しておく必要がある環境では、
    DebugKit を使用しないでください。

インストール
============

デフォルトで、DebugKit はデフォルトのアプリケーションスケルトンにインストールされています。
もし削除してしまって再インストールしたい場合は、以下のコマンドをアプリケーションの
ルートディレクトリー (composer.json ファイルのある場所) で実行してください。 ::

    php composer.phar require --dev cakephp/debug_kit "~3.0"

そして以下のコマンドでプラグインを有効化する必要があります。 ::

    bin/cake plugin load DebugKit

DebugKit ストレージ
===================

デフォルトでは、DebugKit はアプリケーションの ``/tmp`` 内の小さな SQLite データベースに
パネルデータを保持します。もし DebugKit がデータを他の場所に保持するようにしたい場合は、
``debug_kit`` コネクションを定義します。

データベース設定
----------------

デフォルトでは DebugKit はアプリケーションの ``/tmp`` 内の SQLite データベースに
パネルデータを保持します。もし pdo_sqlite をインストールできない場合は、
**config/app.php** ファイル に ``debug_kit`` コネクションを定義すると
DebugKit が異なるデータベースを使用するように設定できます。例::

        /**
         * The debug_kit connection stores DebugKit meta-data.
         */
        'debug_kit' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            //'port' => 'nonstandard_port_number',
            'username' => 'dbusername',    // Your DB username here
            'password' => 'dbpassword',    // Your DB password here
            'database' => 'debug_kit',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
            'quoteIdentifiers' => false,
            //'init' => ['SET GLOBAL innodb_stats_on_metadata = 0'],
        ],

ツールバーの使い方
==================

DebugKit ツールバーはいくつかのパネルが含まれており、ブラウザーウィンドウの右下の
CakePHP アイコンをクリックすると表示されます。一度ツールバーが開くと一連のボタンが
見えるでしょう。これらのボタンの各々は関連情報のパネルを展開します。

各パネルはアプリケーションの様々な側面を見せてくれます。

* **Cache** リクエスト中のキャッシュの使用状況の確認とキャッシュのクリアー。
* **Environment** PHP 及び CakePHP に関連する環境変数の表示。
* **History** 以前のリクエストの一覧の表示と、以前のリクエストのツールバーデータの読み込みと表示。
* **Include** タイプごとにグループ化されたインクルードファイルを表示。
* **Log** このリクエスト中にログファイルに加えられたすべてのエントリーを表示。
* **Packages** 現在のバージョンのパッケージの依存関係の一覧を表示し、
  古いパッケージをチェックすることができます。
* **Mail** このリクエスト中の全てのメール送信を表示し、
  送信せずに開発中のメールのプレビューができます。
* **Request** 現在のリクエスト、GET、POST、Cake パラメーター、現在のルート情報、クッキー情報の表示。
* **Session** 現在のセッション情報の表示。
* **Sql Logs** 各データベースコネクションの SQL ログの表示。
* **Timer** リクエスト中に ``DebugKit\DebugTimer`` で設定されたすべてのタイマーと、
  ``DebugKit\DebugMemory`` で収集されたメモリー使用状況の表示。
* **Variables** コントローラーでセットされたビュー変数の表示。

一般的に、パネルは単一の種類の情報のコレクションの処理やログやリクエスト情報の表示を行います。
ツールバーからのパネルを表示したり、独自のカスタムパネルを追加することを選択できます。

履歴パネルを使用する
====================

履歴パネルは DebugKit で最も勘違いされやすい機能の一つです。
エラーやリダイレクトを含む以前のリクエストのツールバーのデータを表示することができます。

.. figure:: /_static/img/debug-kit/history-panel.png
    :alt: Screenshot of the history panel in debug kit.

ご覧のようにパネルにはリクエストの一覧が含まれます。左側にドットがついているのがアクティブな
リクエストです。どれかのリクエストをクリックするとそのリクエストのデータが読み込まれます。
履歴データがロードされると代替のデータが読み込まれたことを示すようにパネルのタイトルが遷移します。

.. only:: html or epub

  .. figure:: /_static/img/debug-kit/history-panel-use.gif
      :alt: Video of history panel in action.

メールパネルを使用
==================

メールパネルは、リクエストの間に送信された全てのメールを追跡することができます。

.. only:: html or epub

  .. figure:: /_static/img/debug-kit/mail-panel.gif
    :alt: 実際のメールパネルの映像

メーラープレビューは、開発中のメールを簡単にプレビューすることができます。

.. only:: html or epub

  .. figure:: /_static/img/debug-kit/mail-previewer.gif
    :alt: 実際のメールパネルの映像

独自のパネルを開発する
======================

アプリケーションのデバッグを補助するための DebugKit の独自のカスタムパネルを
作成することができます。

パネルクラスを作成する
----------------------

パネルクラスは単に **src/Panel** ディレクトリーに設置してください。ファイル名はクラス名と
一致する必要があります。 つまり ``MyCustomPanel`` クラスは
**src/Panel/MyCustomPanel.php** というファイル名であることを想定しています。 ::

    namespace App\Panel;

    use DebugKit\DebugPanel;

    /**
     * My Custom Panel
     */
    class MyCustomPanel extends DebugPanel
    {
        ...
    }

カスタムパネルは ``DebugPanel`` クラスを拡張する必要があることに注意してください。

コールバック
------------

デフォルトではパネルオブジェクトには、現在のリクエストをフックすることができる
2つのコールバックがあります。パネルは ``Controller.initialize`` と
``Controller.shutdown`` のイベントを取得します。もしパネルが追加のイベントを
取得したい場合は、 ``implementedEvents()`` メソッドを使用し、
パネルが必要とするすべてのイベントを定義できます。

どのようにパネルを構築するかについてのいくつかの例として、ビルトインのパネルを参照してください。

パネルの構成要素
----------------

各パネルはパネルのコンテンツを描画するためのビューエレメントがあることを想定しています。
エレメント名はアンダースコアー区切りのクラス名である必要があります。
たとえば、 ``SessionPanel`` は **session_panel.ctp** という名前のエレメントを持ちます。
また、SqllogPanelは **sqllog_panel.ctp** という名前のエレメントを持ちます。
これらのエレメントは **src/Template/Element** ディレクトリーのルートに設置する必要があります。

カスタムのタイトルとエレメント
------------------------------

パネルは慣例を元にそのタイトルとエレメント名を補足します。もしカスタムのタイトルやエレメント名を
付けたい場合は、パネルの振る舞いをカスタムするメソッドを定義することができます。

- ``title()`` - ツールバー上に表示されるタイトルを設定します
- ``elementName()`` - 与えられたパネルがどのエレメントを使用するかを設定します

パネルフックメソッド
--------------------

また、パネルの動作や表示方法をカスタムするために以下のフックメソッドを実装することができます。

* ``shutdown(Event $event)`` このメソッドは通常はパネルのデータの収集と準備を行います。
* ``summary()`` パネルが折りたたまれている時に表示されるサマリーデータの文字列を
  返すことができます。多くの場合、これは件数や短いサマリー情報です。
* ``data()`` エレメントのコンテキストで使用されるパネルのデータを返します。
  このフックメソッドは ``shutdown()`` で収集されるデータを更に操作することができます。
  このメソッドはシリアライズ化可能なデータを **必ず** 返す必要があります。

他のプラグインのパネル
----------------------

パネルはひとつの小さな違いを除き、 :doc:`/plugins` とほぼ同じ動作を提供します。
レンダリング時にパネルのエレメントを配置できるように、 ``public $plugin``
にプラグインディレクトリーの名前を必ずセットする必要があります。 ::

    namespace MyPlugin\Panel;

    use DebugKit\DebugPanel;

    class MyCustomPanel extends DebugPanel
    {
        public $plugin = 'MyPlugin';
            ...
    }

プラグインやアプリケーションパネルを使用するには、アプリケーションの DebugKit の設定を
更新します。 ::

    // in config/bootstrap.php
    Configure::write('DebugKit.panels', ['App', 'MyPlugin.MyCustom']);
    Plugin::load('DebugKit', ['bootstrap' => true]);

上記は、すべてのデフォルトのパネルと同じように ``AppPanel`` と ``MyPlugin`` の
``MyCustomPanel`` パネルを読みこみます。
