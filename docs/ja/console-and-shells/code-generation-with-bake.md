# Bakeでコード生成

CakePHP の Bake は、あなたがやることを代わりに CakePHP にまかせることができます。
Bake は CakePHP の基本的な素材(モデル、ビュー、コントローラ)を作れます。
Bake では、簡単にフル機能をそなえたアプリケーションを作ることができますが
そういったスケルトンクラスについてはここでは話しません。
また Scaffold アプリケーションを試してみるのに、bake を使ってみるのもいいでしょう。

## Bake のインストール

Bake は [pieceofcake2/bake](https://github.com/pieceofcake2/bake) プラグインで提供されています。
pieceofcake2/app スケルトンから作成したアプリケーションには、開発用の依存パッケージとして
すでに含まれています。それ以外の場合は Composer でインストールします。

``` bash
composer require --dev pieceofcake2/bake
```

Composer はプラグインを `plugins/Bake/` にインストールします。これには
[Composer でのプラグインのインストール](/ja/plugins/how-to-install-plugins#composer) で説明している
`composer.json` の `allow-plugins` と `installer-paths` の設定が必要です。pieceofcake2/app
スケルトンにはすでに設定されています。プラグインは `config/bootstrap.php` でロードしてください。

``` php
// config/bootstrap.php
CakePlugin::load('Bake');
```

Bake は開発用の依存パッケージなので、 `composer install --no-dev` でデプロイした環境には
インストールされません。インストールされていないプラグインをロードすると
`MissingPluginException` が発生するので、この行はプラグインがインストールされている環境でだけ
実行されるようにしてください。

::: pieceofcake2
Bake はコアに含まれなくなりました。 `bake` コマンドを使うには、
pieceofcake2/bake プラグインをインストールしてロードする必要があります。
:::

## Bake の実行

一般的な CakePHP コンソールの使い方に関する [CakePHP のコンソール](../console-and-shells#the-cakephp-console)
セクションを参照してください。Bake はプロジェクトルートで `bin/cake bake` として実行します。
cake スクリプトは PHP CLI (command line interface) で実行されます。
スクリプト実行に問題があれば、PHP CLI がインストールされていることと、
適切な拡張モジュール (たとえば `pdo_mysql` など) が有効になっていることを確認してください。
また、データベースのホストが 'localhost' でコマンドラインから接続できない場合は、代わりに
'127.0.0.1' を試してみてください。

はじめて Bake を実行する時に、まだデータベースの設定ファイルがなければ、
それを作るように促されます。

データベース設定ファイルを作ったあと、Bake を実行すると次のようなオプションが表示されます。

``` text
---------------------------------------------------------------
App : src
Path: /path-to/project/src/
---------------------------------------------------------------
Interactive Bake Shell
---------------------------------------------------------------
[D]atabase Configuration
[M]odel
[V]iew
[C]ontroller
[P]roject
[F]ixture
[T]est case
[Q]uit
What would you like to Bake? (D/M/V/C/P/F/T/Q)
>
```

代わりに、次のようにコマンドラインから直接これらのコマンドを実行することが出来ます。

``` bash
$ bin/cake bake db_config
$ bin/cake bake model
$ bin/cake bake view
$ bin/cake bake controller
$ bin/cake bake project
$ bin/cake bake fixture
$ bin/cake bake test
$ bin/cake bake plugin plugin_name
$ bin/cake bake all
```

すべてのサブコマンドとオプションは `bin/cake bake --help` で確認できます。たとえば
`--connection` (`-c`) で使用するデータベース接続を、 `--theme` (`-t`) で bake のテーマを指定できます。

::: info Changed in version 2.5
`bake test` で作成されたテストファイルは、空のテストメソッドであることを注意するために PHPUnit の `markTestIncomplete()` の呼び出しを含みます。2.5 より前には、空のテストは暗黙のうちにパスしていました。
:::

### 生成されるファイルの場所

Bake は、生成したファイルをアプリケーションのレイアウトに合わせたディレクトリに書き出します。

| ファイルの種類 | モダンレイアウト | レガシーレイアウト |
|---|---|---|
| モデル | `src/Model/` | `app/Model/` |
| コントローラ | `src/Controller/` | `app/Controller/` |
| ビューテンプレート | `templates/<Controller>/` | `app/View/<Controller>/` |
| テストケース | `tests/TestCase/<Type>/` | `app/Test/Case/<Type>/` |
| フィクスチャ | `tests/Fixture/` | `app/Test/Fixture/` |

プラグインに `tests/` ディレクトリがある場合、テストケースとフィクスチャはプラグインの
`tests/TestCase/` と `tests/Fixture/` に書き出され、無い場合は `Test/Case/` と `Test/Fixture/` に書き出されます。

::: info
これらの場所に書き出すには pieceofcake2/bake 1.0.3 以降が必要です。それより前のバージョンでは、
モダンレイアウトでもビューテンプレートを `src/View/` に、テストケースを `tests/Case/` に、
フィクスチャを `src/Test/Fixture/` に書き出していたため、ファイルを移動する必要がありました。
:::

`bake project` は Bake プラグインに含まれているレガシーな `app/` スケルトンをコピーします。
モダンレイアウトで新しいアプリケーションを始める場合は、代わりに
`composer create-project pieceofcake2/app` を使ってください
([インストール](../installation) を参照)。

## bakeテンプレートから生成されるデフォルトのHTMLを変更する

bake コマンドで生成されるデフォルトの HTML 出力を変更したい場合は、
bake のテーマを作成します。デフォルトのテンプレートは Bake プラグインの
`plugins/Bake/Console/Templates/default/` ディレクトリにあります。

- `actions/` - コントローラのアクション
- `classes/` - コントローラ、モデル、フィクスチャ、テストのクラス
- `views/` - ビューテンプレート (`index.ctp`, `view.ctp`, `form.ctp`)

Bake は、アプリケーションの `src/Console/Templates/` と、ロード済みの各プラグインの
`Console/Templates/` からテーマを探します。

### カスタムビューを作る

1.  `plugins/Bake/Console/Templates/default/views` に移動します。
2.  その中に、3つのファイルがあります。
3.  それらのファイルを `src/Console/Templates/[themename]/views` にコピーします。
4.  ビューを "bake" で構築する方法を制御するために HTML 出力に変更を加えます。

`[themename]` は、自分で自由につけれる bake のテーマ名です。
bake のテーマ名はユニークである必要がありますので、'default' は使わないでください。
複数のテーマがある場合は、Bake がどれを使うか尋ねます。 `--theme` オプションで指定することもできます。

``` bash
bin/cake bake view Posts --theme myTheme
```

レガシーレイアウトでは、テーマは `app/Console/Templates/[themename]/` に置きます。

### カスタムプロジェクトを作る

1.  `plugins/Bake/Console/Templates/skel` に移動します。
2.  その中に、アプリケーションのベースとなるファイルがあります。
3.  それらのファイルを `src/Console/Templates/skel` にコピーします。
4.  ビューを "bake" で構築する方法を制御するために HTML 出力に変更を加えます。
5.  project タスクにスケルトンのパスをパラメータとして渡します。

<!-- -->

    bin/cake bake project --skel src/Console/Templates/skel

> [!NOTE]
> - `bin/cake bake project` は、スケルトンのパスをパラメータで渡して
>   特定の project タスクを実行します。
> - テンプレートのパスはコマンドラインのカレントパスからの相対パスです。
> - スケルトンまでのフルパスを入力すれば、複数のテンプレートを使用することも含み
>   自分が使いたいテンプレートがあるディレクトリを任意に指定できます。
