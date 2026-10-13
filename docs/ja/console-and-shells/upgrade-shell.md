<a id="upgrade-shell"></a>

# アップグレードシェル

アップグレードシェルは、CakePHP 1.3 から 2.0 へのアプリケーションのアップグレードで必要な
機械的な作業のほとんどを行います。ファイルを 2.0 の配置に移動し、削除された API、
ヘルパーの呼び出し、定数などを書き換えます。このシェルは
[pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade) プラグインで提供されています。

::: pieceofcake2
`UpgradeShell` はコアから削除され、pieceofcake2/upgrade
プラグインに移動しました。ほとんどのアプリケーションでは必要ありません。
:::

このシェルはレガシーな `app/` レイアウトのアプリケーションを対象とするので、以下の例では
`vendor/bin/cake` から実行しています。プラグインを開発用の依存パッケージとしてインストールし、
`app/Config/bootstrap.php` でロードします。 :

``` bash
composer require --dev pieceofcake2/upgrade
```

`composer.json` に [Composer でのプラグインのインストール](/ja/plugins/how-to-install-plugins#composer)
で説明している `installer-paths` の設定があれば、プラグインは `plugins/Upgrade/` にインストールされます。

``` php
// app/Config/bootstrap.php
CakePlugin::load('Upgrade');
```

始める前に、アプリケーションのバックアップを取るか、バージョン管理システムにコミットしておいてください。
すべてのアップグレード手順を実行するには、次のようにします。 :

    vendor/bin/cake upgrade all

ファイルを変更せずにシェルが何をするのか確認したい場合は、まず `--dry-run` を付けて実行してください。 :

    vendor/bin/cake upgrade all --dry-run

プラグインをアップグレードするには、次のコマンドを実行します。 :

    vendor/bin/cake upgrade all --plugin YourPluginName

各アップグレード手順 (`tests`, `locations`, `i18n`, `helpers`, `basics`, `request`,
`configure`, `constants`, `controller_redirects`, `components`, `exceptions`) は
個別に実行することもできます。利用できる手順とオプションの一覧は、次のコマンドで確認できます。 :

    vendor/bin/cake upgrade --help

アップグレードシェルが扱うのは 1.3 から 2.0 への変更だけです。こうして変換したアプリケーションを
Piece of Cake 2 フォークで動かすには、さらに CakePHP 2.10.24 まで更新する必要があります。
[CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) と付録の移行ガイドを参照してください。
