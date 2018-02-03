.. _plugin-shell:

Plugin シェル
#############

Plugin シェルを使用すると、コマンドプロンプトを経由してプラグインをロードおよび
アンロードすることができます。ヘルプを表示するには、以下を実行します。 ::

    bin/cake plugin --help

プラグインのロード
------------------

``Load`` タスクで、あなたの **config/bootstrap.php** の中にプラグインをロード
することができます。以下を実行することによって行います。 ::

    bin/cake plugin load MyPlugin

これはあなたの **config/bootstrap.php** に以下を追加します。 ::

    Plugin::load('MyPlugin');

load タスクに ``-b`` または ``-r`` スイッチを追加すると、プラグインの
``bootstrap`` と ``routes`` 値の読み込みを可能にします。 ::

    bin/cake plugin load -b MyPlugin

    // プラグインの bootstrap.php をロード
    Plugin::load('MyPlugin', ['bootstrap' => true]);

    bin/cake plugin load -r MyPlugin

    // プラグインの routes.php をロード
    Plugin::load('MyPlugin', ['routes' => true]);

bake のような CLI ツールのみ提供するプラグインをロードする場合、以下のように
``bootstrap_cli.php`` を更新することができます。 ::

    bin/cake plugin load --cli MyPlugin
    bin/cake plugin unload --cli MyPlugin

.. versionadded:: 3.4.0
    3.4.0 で ``--cli`` オプションはサポートされます。

プラグインのアンロード
----------------------

プラグインの名前を指定することで、アンロードすることができます。 ::

    bin/cake plugin unload MyPlugin

これは **config/bootstrap.php** から ``Plugin::load('MyPlugin',...)``
の行を削除します。

プラグインのアセット
--------------------

CakePHP は、デフォルトで ``AssetFilter`` ディスパッチャーフィルターを使用して、
プラグインのアセットを提供しています。これはとても便利ですが、
PHP を呼び出すことなく、直接ウェブサーバーがサービスを提供することができるように、
アプリの webroot 下のプラグインのアセットをシンボリックリンク／コピーすることを
お勧めします。以下を実行することによって行います。 ::

    bin/cake plugin assets symlink

上記のコマンドを実行すると、アプリの webroot 下にすべてのプラグインのアセットを
シンボリックリンクします。シンボリックリンクをサポートしていない Windows では、
アセットをシンボリックリンクする代わりにそれぞれのフォルダーにコピーされます。

プラグインの名前を指定することにより、特定のプラグインのアセットを
シンボリックリンクすることができます。 ::

    bin/cake plugin assets symlink MyPlugin

.. meta::
    :title lang=ja: Plugin シェル
    :keywords lang=ja: プラグイン,アセット,シェル,ロード,アンロード
