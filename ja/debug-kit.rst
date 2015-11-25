Debug Kit
#########

.. DebugKit is a plugin supported by the core team that provides a toolbar to help
.. make debugging CakePHP applications easier.

DebugKitは、CakePHPアプリケーションを簡単にデバッグするためのツールバーを提供するコアチームがサポートしているプラグインです。

.. Installation
.. ============

インストール
============

.. By default DebugKit is installed with the default application skeleton. If
.. you've removed it and want to re-install it, you can do so by running the
.. following from your application's ROOT directory (where composer.json file is
.. located)::

デフォルトで、DebugKitはデフォルトのアプリケーションスケルトンにインストールされています。
もし削除してしまって再インストールしたい場合は、以下のコマンドをアプリケーションのルートディレクトリ(composer.jsonファイルのある場所)で実行してください::

    php composer.phar require --dev cakephp/debug_kit "~3.0"
    
.. Then, you need to enable the plugin by executing the following line::

そして以下のコマンドでプラグインを有効化する必要があります::

    bin/cake plugin load DebugKit

.. DebugKit Storage
.. ================

DebugKit ストレージ
===================

.. By default, DebugKit uses a small SQLite database in your application's ``/tmp``
.. directory to store the panel data. If you'd like DebugKit to store its data
.. elsewhere, you should define a ``debug_kit`` connection.

デフォルトでは、DebugKitはアプリケーションの ``/tmp`` 内の小さなSQLiteデータベースにパネルデータを保持します。
もしDebugKitがデータを他の場所に保持するようにしたい場合は、 ``debug_kit`` コネクションを定義します。

.. Database Configuration
.. ----------------------

データベース設定
----------------

.. By default DebugKit will store panel data into a SQLite database in your
.. application's ``tmp`` directory. If you cannot install pdo_sqlite, you can
.. configure DebugKit to use a different database by defining a ``debug_kit``
.. connection in your **config/app.php** file.

デフォルトではDebugKitはアプリケーションの ``/tmp`` 内のSQLiteデータベースにパネルデータを保持します。
もしpdo_sqliteをインストールできない場合は、 **config/app.php** ファイル に ``debug_kit`` コネクションを定義するとDebugKitが異なるデータベースを使用するように設定できます。

.. Toolbar Usage
.. =============

ツールバーの使い方
==================

.. The DebugKit Toolbar is comprised of several panels, which are shown by clicking
.. the CakePHP icon in the bottom right-hand corner of your browser window. Once
.. the toolbar is open, you should see a series of buttons. Each of these buttons
.. expands into a panel of related information.

DebugKitツールバーはいくつかのパネルが含まれており、ブラウザウィンドウの右下のCakePHPアイコンをクリックすると表示されます。一度ツールバーが開くと一連のボタンが見えるでしょう。これらのボタンの各々は関連情報のパネルを展開します。

.. Each panel lets you look at a different aspect of your application:

各パネルはアプリケーションの様々な側面を見せてくれます:

.. * **Cache** See cache usage during a request and clear caches.
.. * **Environment** Display environment variables related to PHP + CakePHP.
.. * **History** Displays a list of previous requests, and allows you to load
..   and view toolbar data from previous requests.
.. * **Include** View the included files grouped by type.
.. * **Log** Display any entries made to the log files this request.
.. * **Request** Displays information about the current request, GET, POST, Cake
..   Parameters, Current Route information and Cookies.
.. * **Session** Display the information currently in the Session.
.. * **Sql Logs** Displays SQL logs for each database connection.
.. * **Timer** Display any timers that were set during the request with
..   ``DebugKit\DebugTimer``, and memory usage collected with
..   ``DebugKit\DebugMemory``.
.. * **Variables** Display View variables set in controller.

* **Cache** リクエスト中のキャッシュの使用状況の確認とキャッシュのクリア
* **Environment** PHP及びCakePHPに関連する環境変数の表示
* **History** 以前のリクエストの一覧の表示と、以前のリクエストのツールバーデータの読み込みと表示
* **Include** タイプごとにグループ化されたインクルードファイルを表示
* **Log** このリクエスト中にログファイルに加えられたすべてのエントリを表示
* **Request** 現在のリクエスト、GET、POST、Cakeパラメータ、現在のルート情報、クッキー情報の表示
* **Session** 現在のセッション情報の表示
* **Sql Logs** 各データベースコネクションのSQLログの表示
* **Timer** リクエスト中に ``DebugKit\DebugTimer`` で設定されたすべてのタイマーと、 ``DebugKit\DebugMemory`` で収集されたメモリ使用状況の表示
* **Variables** コントローラでセットされたビュー変数の表示

.. Typically, a panel handles the collection and display of a single type
.. of information such as Logs or Request information. You can choose to view
.. panels from the toolbar or add your own custom panels.

一般的に、パネルは単一の種類の情報のコレクションの処理やログやリクエスト情報の表示を行います。ツールバーからのパネルを表示したり、独自のカスタムパネルを追加することを選択できます。

.. Using the History Panel
.. =======================

履歴パネルを使用する
====================

.. The history panel is one of the most frequently misunderstood features of
.. DebugKit. It provides a way to view toolbar data from previous requests,
.. including errors and redirects.

履歴パネルはDebugKitで最も勘違いされやすい機能の一つです。
エラーやリダイレクトを含む以前のリクエストのツールバーのデータを表示することができます。

.. figure:: /_static/img/debug-kit/history-panel.png
    :alt: Screenshot of the history panel in debug kit.

.. As you can see, the panel contains a list of requests. On the left you can see
.. a dot marking the active request. Clicking any request data will load the panel
.. data for that request. When historical data is loaded the panel titles will
.. transition to indicate that alternative data has been loaded.

ご覧のようにパネルにはリクエストの一覧が含まれます。
左側にドットがついているのがアクティブなリクエストです。
どれかのリクエストをクリックするとそのリクエストのデータが読み込まれます。
履歴データがロードされると代替のデータが読み込まれたことを示すようにパネルのタイトルが遷移します。

.. only:: html or epub

  .. figure:: /_static/img/debug-kit/history-panel-use.gif
      :alt: Video of history panel in action.

.. Developing Your Own Panels
.. ==========================

独自のパネルを開発する
======================

.. You can create your own custom panels for DebugKit to help in debugging your
.. applications.

アプリケーションのデバッグを補助するためのDebugKitの独自のカスタムパネルを作成することができます。

.. Creating a Panel Class
.. ----------------------

パネルクラスを作成する
----------------------

.. Panel Classes simply need to be placed in the **src/Panel** directory. The
.. filename should match the classname, so the class ``MyCustomPanel`` would be
.. expected to have a filename of **src/Panel/MyCustomPanel.php**::

パネルクラスは単に **src/Panel** ディレクトリに設置してください。
ファイル名はクラス名と一致する必要があります。 つまり ``MyCustomPanel`` クラスは **src/Panel/MyCustomPanel.php** というファイル名であることを想定しています::

    namespace App\Panel;

    use DebugKit\DebugPanel;

    /**
     * My Custom Panel
     */
    class MyCustomPanel extends DebugPanel
    {
        ...
    }

.. Notice that custom panels are required to extend the ``DebugPanel`` class.

カスタムパネルは ``DebugPanel`` クラスを拡張する必要があることに注意してください。

.. Callbacks
.. ---------

コールバック
------------

.. By default Panel objects have two callbacks, allowing them to hook into the
.. current request. Panels subscribe to the ``Controller.initialize`` and
.. ``Controller.shutdown`` events. If your panel needs to subscribe to additional
.. events, you can use the ``implementedEvents()`` method to define all of the events
.. your panel is interested in.

デフォルトではパネルオブジェクトには、現在のリクエストをフックすることができる2つのコールバックがあります。
パネルは ``Controller.initialize`` と ``Controller.shutdown`` のイベントを取得します。
もしパネルが追加のイベントを取得したい場合は、 ``implementedEvents()`` メソッドを使用し、パネルが必要とするすべてのイベントを定義できます。

.. You should refer to the built-in panels for some examples on how you can build
.. panels.

どのようにパネルを構築するかについてのいくつかの例として、ビルトインのパネルを参照してください。

パネルの構成要素
----------------

.. Each Panel is expected to have a view element that renders the content from the
.. panel. The element name must be the underscored inflection of the class name.
.. For example ``SessionPanel`` has an element named **session_panel.ctp**, and
.. SqllogPanel has an element named **sqllog_panel.ctp**. These elements should be
.. located in the root of your **src/Template/Element** directory.

各パネルはパネルのコンテンツを描画するためのビューエレメントがあることを想定しています。
エレメント名はアンダースコア区切りのクラス名である必要があります。
たとえば、 ``SessionPanel`` は **session_panel.ctp** という名前のエレメントを持ちます。
また、SqllogPanelは **sqllog_panel.ctp** という名前のエレメントを持ちます。
これらのエレメントは **src/Template/Element** ディレクトリのルートに設置する必要があります。

.. Custom Titles and Elements
.. --------------------------

カスタムのタイトルとエレメント
------------------------------

.. Panels should pick up their title and element name by convention. However, if
.. you need to choose a custom element name or title, you can define methods to
.. customize your panel's behavior:

.. - ``title()`` - Configure the title that is displayed in the toolbar.
.. - ``elementName()`` - Configure which element should be used for a given panel.

パネルは慣例を元にそのタイトルとエレメント名を補足します。
もしカスタムのタイトルやエレメント名を付けたい場合は、パネルの振る舞いをカスタムするメソッドを定義することができます:

- ``title()`` - ツールバー上に表示されるタイトルを設定します
- ``elementName()`` - 与えられたパネルがどのエレメントを使用するかを設定します

.. Panel Hook Methods
.. ------------------

パネルフックメソッド
--------------------

.. You can also implement the following hook methods to customize how your panel
.. behaves and appears:

.. * ``shutdown(Event $event)`` This method typically collects and prepares the
..   data for the panel. Data is generally stored in ``$this->_data``.
.. * ``summary()`` Can return a string of summary data to be displayed in the
..   toolbar even when a panel is collapsed. Often this is a counter, or short
..   summary information.
.. * ``data()`` Returns the panel's data to be used as element context. This hook
..   method lets you further manipulate the data collected in the ``shutdown()``
..   method. This method **must** return data that can be serialized.

また、パネルの動作や表示方法をカスタムするために以下のフックメソッドを実装することができます。

* ``shutdown(Event $event)`` このメソッドは通常はパネルのデータの収集と準備を行います。
* ``summary()`` パネルが折りたたまれている時に表示されるサマリーデータの文字列を返すことができます。多くの場合、これは件数や短いサマリー情報です。
* ``data()`` エレメントのコンテキストで使用されるパネルのデータを返します。このフックメソッドは ``shutdown()`` で収集されるデータを更に操作することができます。このメソッドは シリアライズ化可能なデータを **必ず** 返す必要があります。

.. Panels in Other Plugins
.. -----------------------

他のプラグインのパネル
----------------------

.. Panels provided by :doc:`/plugins` work almost entirely the same as other
.. plugins, with one minor difference:  You must set ``public $plugin`` to be the
.. name of the plugin directory, so that the panel's Elements can be located at
.. render time::

パネルはひとつの小さな違いを除き、 :doc:`/plugins` とほぼ同じ動作を提供します。
レンダリング時にパネルのエレメントを配置できるように、 ``public $plugin`` にプラグインディレクトリの名前を必ずセットする必要があります::

    namespace MyPlugin\Panel;

    use DebugKit\DebugPanel;

    class MyCustomPanel extends DebugPanel
    {
        public $plugin = 'MyPlugin';
            ...
    }

.. To use a plugin or app panel, update your application's DebugKit configuration
.. to include the panel::

プラグインやアプリケーションパネルを使用するには、アプリケーションのDebugKitの設定を更新します::

    // in config/bootstrap.php
    Configure::write('DebugKit.panels', ['App', 'MyPlugin.MyCustom']);
    Plugin::load('DebugKit', ['bootstrap' => true]);

.. The above would load all the default panels as well as the ``AppPanel``, and
.. ``MyCustomPanel`` panel from ``MyPlugin``.

上記は、すべてのデフォルトのパネルと同じようにAppPanelとMyPluginのMyCustomPanelパネルを読みこみます。