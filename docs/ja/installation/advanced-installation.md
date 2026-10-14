# 応用インストール

このページでは、Composer の設定の詳細と、アプリケーションのディレクトリを別の場所に配置する方法を説明します。
通常のインストールについては [インストール](../installation) を参照してください。

## Composer の設定

CakePHP とプラグインは Composer でインストールします。ディスパッチャファイル
(`webroot/index.php`、`webroot/test.php`、`bin/cake`) は、CakePHP 本体より先に Composer のオートローダーを読み込みます。
CakePHP アプリケーションの `composer.json` は、[pieceofcake2/app](https://pieceofcake2.github.io/app/)
スケルトンと同じように次のようになります。

```json
{
    "name": "example/my-app",
    "type": "project",
    "require": {
        "php": ">=8.0",
        "pieceofcake2/cakephp": "^2.12"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.6",
        "pieceofcake2/bake": "^1.0",
        "pieceofcake2/debug_kit": "^2.2"
    },
    "autoload": {
        "classmap": ["src/"]
    },
    "config": {
        "sort-packages": true,
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

`composer.json` と `composer.lock` は、ソースコードの残りの部分と一緒に保存しておいてください。

### `replace` の仕組み

`pieceofcake2/cakephp` には `"replace": {"cakephp/cakephp": "^2.0"}` が宣言されています。
そのため Composer はこのパッケージを `cakephp/cakephp` として扱い、`cakephp/cakephp` 2.x に依存する
プラグインも変更なしでインストールでき、動作します。両方のパッケージを同時に require しないでください。

### プラグインの配置場所

`cakephp-plugin` タイプのパッケージは `composer/installers` によってインストールされます。
上記の `installer-paths` の設定により、プラグインはプロジェクトルートの `plugins/` にインストールされます。
CakePHP はどちらの構成でもこのディレクトリからプラグインを探します (従来の `app/Plugin/` も探します)。
プラグインは `config/bootstrap.php` で `CakePlugin::load()` を使って読み込む必要があります。
[プラグインのインストール方法](../plugins/how-to-install-plugins) を参照してください。

### クラスのオートロード

CakePHP 自身のクラスは Composer の classmap でオートロードされるので、`App::uses()` は不要です。
アプリケーションのクラスは引き続き `App::uses()` で読み込めますが、上記の `classmap` の設定を加えれば
Composer に読み込ませることもできます。classmap を設定すると、コントローラ、モデル、ヘルパー、シェルから
`App::uses()` を取り除けます。

Composer の classmap は固定のファイル一覧なので、新しいクラスファイルを追加するたびに次のコマンドを実行してください。

```bash
composer dump-autoload
```

Composer のオートロードに対応していないプラグインでは、引き続き `App::uses()` が必要です。
たとえば `App::uses('MyPluginHelper', 'MyPlugin.View/Helper');` のように書きます。

`AppController` のように同じ名前のクラスがアプリケーションとパッケージの両方にあると、
Composer がクラスの解決があいまいだという警告を出します。その場合は `composer.json` で
パッケージ側のファイルを除外してください。

```json
{
    "autoload": {
        "classmap": ["src/"],
        "exclude-from-classmap": [
            "vendor/pieceofcake2/app/src/Controller/AppController.php",
            "vendor/pieceofcake2/app/src/Model/AppModel.php"
        ]
    }
}
```

::: pieceofcake2
CakePHP は Composer のオートローダーからのみ読み込まれます。
`CAKE_CORE_INCLUDE_PATH` や `include_path` による設定、複数のアプリケーションで 1 つの CakePHP コアを共有する方法は
サポートされなくなりました。CakePHP はアプリケーションごとに、それぞれの `vendor/` ディレクトリにインストールします。
:::

## ディレクトリを別の場所に配置する

共有ホストの制限などにより、アプリケーションのディレクトリをファイルシステムの別の場所に配置したい場合があるかもしれません。
CakePHP アプリケーションには三つの主要な部分があります。

1. CakePHP 本体とその他の Composer パッケージ。`vendor/` の中にあります。
2. アプリケーションのコードと設定。プロジェクトルート (`ROOT`) の `src/`、`config/`、`templates/` などにあります。
3. アプリケーションのウェブルート。通常は `webroot/` です。

ウェブサーバからアクセスできる必要があるのはウェブルートだけです。
CakePHP に場所を知らせれば、ウェブルートをプロジェクトのディレクトリの外に移すことができます。

パスは `config/define.php` の定数で定義されます。このファイルは `webroot/index.php`、
`webroot/test.php`、`bin/cake` が最初に読み込みます。

- `ROOT` はプロジェクトのディレクトリです。デフォルトでは `config/` の一つ上のディレクトリです。
- `APP_DIR` は PHP のコードが入っているディレクトリの名前 (`src`) です。
- `WEBROOT_DIR` はウェブルートのディレクトリの名前 (`webroot`) です。
- `WWW_ROOT` はウェブルートのディレクトリのフルパスです。
- `VENDORS` は Composer の vendor ディレクトリのフルパスです。

ここで定義しなかった定数は、CakePHP がディレクトリ構成を判別して設定します。
`CONFIG` (`ROOT/config/`)、`TMP` (`ROOT/tmp/`)、`LOGS` (`ROOT/logs/`)、`TESTS` (`ROOT/tests/`) です。
別の場所を使いたい場合は、これらも `config/define.php` で定義できます。

例を挙げて見てみましょう。CakePHP を次のような条件で動作させたいとします。

- `config/`、`src/`、`vendor/` を含むプロジェクトのディレクトリは `/home/me/myapp` にする。
- ウェブルートのディレクトリは `/var/www/mysite/` にする。

まず `webroot/` の中身を `/var/www/mysite/` にコピーし、`config/define.php` でウェブルートの定数を設定します。

```php
// /home/me/myapp/config/define.php (一部分)

if (!defined('WEBROOT_DIR')) {
    define('WEBROOT_DIR', 'mysite');
}

if (!defined('WWW_ROOT')) {
    define('WWW_ROOT', DS . 'var' . DS . 'www' . DS . 'mysite' . DS);
}
```

次に `/var/www/mysite/index.php` (および [テスト](../development/testing) 機能を使う場合は `test.php`) を編集し、
プロジェクトのディレクトリにあるこのファイルを読み込むようにします。
`dirname(__DIR__) . DS . 'config' . DS . 'define.php'` が出てくる 2 か所を置き換えてください。

```php
// /var/www/mysite/index.php (一部分)

$defineFile = DS . 'home' . DS . 'me' . DS . 'myapp' . DS . 'config' . DS . 'define.php';

if (!is_file($defineFile)) {
    trigger_error(
        'Configuration file "config' . DS . 'define.php" could not be loaded. ' .
        'Please ensure this file exists and is readable.',
        E_USER_ERROR,
    );
}
require_once $defineFile;
```

`ROOT` は `config/define.php` の場所から決まるので `/home/me/myapp` のままです。
`bin/cake` も同じ設定を使います。

従来の `app/` 構成では、同じ定数 (`ROOT`、`APP_DIR`、`WEBROOT_DIR`、`WWW_ROOT`) を
`app/webroot/index.php` と `app/webroot/test.php` の先頭で定義します。

ファイルパスの区切り文字には、スラッシュではなく `DS` 定数を使うのがオススメです。
こうしておくと、間違った区切り文字による、ファイルが無いというエラーを防ぐことができ、コードをさまざまなプラットフォームで動くようにすることができます。

## Apache と mod_rewrite (と .htaccess)

この章は [URLリライティング](../installation/url-rewriting) に移動しました。
