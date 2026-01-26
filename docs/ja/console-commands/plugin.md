# Plugin シェル

Plugin シェルを使用すると、コマンドプロンプトを経由してプラグインをロードおよび
アンロードすることができます。ヘルプを表示するには、以下を実行します。 :

    bin/cake plugin --help

## プラグインのロード

`Load` タスクで、あなたの **config/bootstrap.php** の中にプラグインをロード
することができます。以下を実行することによって行います。 :

    bin/cake plugin load MyPlugin

これはあなたの **src/Application.php** に以下を追加します。 :

``` php
// bootstrap メソッドの中に追加
$this->addPlugin('MyPlugin');

// 3.6 より前は、config/bootstrap.php に以下を追加
Plugin::load('MyPlugin');
```

bake のような CLI ツールのみ提供するプラグインをロードする場合、以下のように
`bootstrap_cli.php` を更新することができます。 :

    bin/cake plugin load --cli MyPlugin
    bin/cake plugin unload --cli MyPlugin

## プラグインのアンロード

プラグインの名前を指定することで、アンロードすることができます。 :

    bin/cake plugin unload MyPlugin

これは **src/Application.php** から `$this->addPlugin('MyPlugin',...)`
の行を削除します。

## プラグインのアセット

CakePHP は、デフォルトで `AssetMiddleware` ミドルウェアを使用して、
プラグインのアセットを提供しています。これはとても便利ですが、
PHP を呼び出すことなく、直接ウェブサーバーがサービスを提供することができるように、
アプリの webroot 下のプラグインのアセットをシンボリックリンク／コピーすることを
お勧めします。以下を実行することによって行います。 :

    bin/cake plugin assets symlink

上記のコマンドを実行すると、アプリの webroot 下にすべてのプラグインのアセットを
シンボリックリンクします。シンボリックリンクをサポートしていない Windows では、
アセットをシンボリックリンクする代わりにそれぞれのフォルダーにコピーされます。

プラグインの名前を指定することにより、特定のプラグインのアセットを
シンボリックリンクすることができます。 :

    bin/cake plugin assets symlink MyPlugin
