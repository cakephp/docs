# プラグインのインストール

CakePHP プラグインは、通常 Composer でインストールします。Composer パッケージとして
公開されていないプラグインは、アプリケーションにコピーするか、Git を使って追加します。

後で、 [プラグインを有効化](#enable-plugins) するのを忘れないでください。

プラグインはプロジェクトルートの `plugins/` ディレクトリにインストールします。
CakePHP は `plugins/` と、アプリケーションの `Plugin/` ディレクトリ (従来の `app/` レイアウトでは
`app/Plugin/`) の両方からプラグインを探すため、 `plugins/` はどちらのレイアウトでも使えます。

## Composer

もし、あなたが Composer という名前の依存関係管理ツールに馴染みがないなら、
[Composer documentation](https://getcomposer.org/doc/00-intro.md)
を読んでおいてください。

プラグインをインストールする前に、 [リポジトリとプラグイン](/ja/plugins/maintained-plugins) で
PHP 8 対応のフォークがあるかどうかを確認してください。たとえば DebugKit プラグインを
インストールするには、次のコマンドを実行します。

``` bash
composer require --dev pieceofcake2/debug_kit
```

または、プロジェクトの `composer.json` に依存関係を追加して `composer update` を実行します。

``` json
{
    "require-dev": {
        "pieceofcake2/debug_kit": "^2.2"
    }
}
```

> [!NOTE]
> この例のように、開発環境のみでプラグインを使う場合は "require-dev" を使ってください。
> 本番環境でも必要なプラグインは "require" に追加します。

CakePHP 2 のプラグインはタイプが `cakephp-plugin` のパッケージとして公開されており、
[composer/installers](https://github.com/composer/installers) によって `vendor/` ではなく
プラグイン用のディレクトリにインストールされます。各プラグインを `plugins/<Name>/` に
インストールするには、 `composer.json` に次の設定が必要です。
[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンには最初から含まれています。

``` json
{
    "config": {
        "allow-plugins": {
            "composer/installers": true
        }
    },
    "extra": {
        "installer-paths": {
            "plugins/{$name}/": ["type:cakephp-plugin"]
        }
    }
}
```

Composer 2.2 以降では、 `config.allow-plugins` に記載した Composer プラグインしか実行されないため、
`composer/installers` をここで許可する必要があります。許可していないとプラグインは `vendor/` に
インストールされます。また、 `installer-paths` を設定しないと、 `composer/installers` は
プロジェクトルートの `Plugin/` ディレクトリにプラグインを置きます。どちらの場合も
`CakePlugin::load()` はプラグインを見つけられません。

従来の `app/` の構成のアプリケーションでは、インストール先を `app/Plugin/` にします。

``` json
"extra": {
    "installer-paths": {
        "app/Plugin/{$name}/": ["type:cakephp-plugin"]
    }
}
```

## マニュアル

Composer で入手できないプラグインをインストールするには、 `plugins/` フォルダの中に
プラグインのフォルダをコピーしてください。もし 'ContactManager' という名前の
プラグインをインストールする場合、 `plugins/` の中に 'ContactManager'
という名前のフォルダを設置し、その下にプラグインの View, Model, Controller,
webroot やその他のディレクトリを設置します。

## Git クローン

もし、インストールしたいプラグインを Git リポジトリで管理されている場合、
クローンすることでインストールできます。仮想のプラグイン 'ContactManager' が
GitHub 上で管理されていると仮定しましょう。 `plugins/` フォルダ内で
以下のコマンドを実行してクローンすることができます。

``` bash
git clone https://github.com/example/contact-manager.git ContactManager
```

## Git サブモジュール

もし、インストールしたいプラグインが Git リポジトリで管理されている場合、
クローンせず、Git サブモジュールとして統合することもできます。
プロジェクトのルートフォルダで以下のコマンドを実行してください。

``` bash
git submodule add https://github.com/example/contact-manager.git plugins/ContactManager
git submodule update --init
```

<a id="enable-plugins"></a>

## プラグインの有効化

プラグインは、 `config/bootstrap.php` (従来の `app/` レイアウトでは `app/Config/bootstrap.php`)
内で、手動でロードする必要があります。

一つずつロードするか、もしくは一度に全てをロードすることができます。

``` php
CakePlugin::loadAll(); // すべてのプラグインを一度にロードする
CakePlugin::load('ContactManager'); // 一つのプラグインをロードする
```

`loadAll()` は、指定したプラグインの設定を許容しつつ、全ての利用可能なプラグインを
ロードします。 `load()` は、似た動作をしますが、明示的に指定したプラグインのみ
ロードします。

Composer でオートロードされるプラグインのクラスは、そのまま使えます。
Composer のオートロードに対応していないプラグインでは、これまでどおり
`App::uses('MyPluginHelper', 'MyPlugin.View/Helper');` のように `App::uses()` で
クラスを読み込みます。どちらに当たるかはプラグインのドキュメントで確認してください。
