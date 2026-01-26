# コンソールツール、シェルとタスク

CakePHP はウェブフレームワークとしてだけではなく、コンソールアプリケーションを開発するための
コンソールフレームワークとしての機能を合わせ持っています。コンソールアプリケーションは
メンテナンスといった様々なバックグラウンド タスクを行ったり、リクエスト－レスポンスのサイクルの
外側で何かを実行するための仕組みです。CakePHP のコンソールアプリケーションでは、コマンドライン
からあなたが作成したアプリケーションクラスを再利用できます。

CakePHP には元々たくさんのコンソールアプリケーションが備わっています。
これらの中には（i18n のように）他の CakePHP の機能と組合せて使うものもあれば、
仕事をより早く片付けるための、より一般的なものもあります。

## CakePHP のコンソール

このセクションでは、コマンドラインにおける CakePHP をご紹介します。コンソールツールは、
cron ジョブ、またはウェブブラウザーからアクセス可能である必要のないコマンドラインベースの
ユーティリティーでの使用に最適です。

PHP ではファイルシステムやアプリケーションをより柔軟に使えるように、
これらへのインターフェイスを備えた CLI クライアント機能を提供しています。
CakePHP コンソールでは、シェルスクリプト作成のためのフレームワークを提供しています。
コンソールではディスパッチタイプのセットアップを使って シェルやタスクをロードし、
それらへパラメーターを渡します。

> [!NOTE]
> コンソール機能を使う場合は、コマンドライン版 (CLI) としてビルドされた
> PHP がインストールされている必要があります。

詳細に入る前に、CakePHP コンソールがちゃんと動くことを確認しておきましょう。
まずはシステムのシェルを起動する必要があります。このセクションで示している例は
bash のものですが、CakePHP コンソールは Windows 互換でもあります。
この例では、ユーザーが現在 bash プロンプトにログインし、CakePHP アプリケーションの
ルートにいることを仮定しています。

CakePHP のアプリケーションは、シェルとタスクのすべてが含まれている **src/Command** 、
**src/Shell** そして **src/Shell/Task** ディレクトリーが含まれています。
また、\*\*bin\*\* ディレクトリー内に実行可能なコマンドが付属しています。

``` bash
$ cd /path/to/app
$ bin/cake
```

> [!NOTE]
> Windows の場合、コマンドは `bin\cake` （バックスラッシュに注意）にする必要があります。

::: info Deprecated in version 3.6.0
シェルは 3.6.0 では非推奨ですが、 5.x までは削除されません。 代わりに [コンソールコマンド](console-and-shells/commands) を使用してください。
:::

引数なしでコンソールを実行すると、以下のヘルプメッセージを生成します。 :

    Welcome to CakePHP v3.6.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

    * app: src
    * root: /Users/markstory/Sites/cakephp-app
    * core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Available Commands:

    - version
    - help
    - cache
    - completion
    - i18n
    - schema_cache
    - plugin
    - routes
    - server
    - bug
    - console
    - event
    - orm
    - bake
    - bake.bake
    - migrations
    - migrations.migrations

    To run a command, type `cake shell_name [args|options]` To get help on a specific command, type `cake shell_name --help`

先頭部分にはパスに関連する情報が表示されます。
これはファイルシステム上の異なる場所からコンソールを動かしている場合に便利です。

あなたは、その名前を使用して記載されているシェルのいずれかを実行できます。

``` bash
# server シェルの実行
bin/cake server

# migrations シェルの実行
bin/cake migrations -h

# bake の実行 (プラグインのプレフィックス付き)
bin/cake bake.bake -h
```

シェルの名前が、アプリケーションやフレームワークのシェルと重複していない場合、
プラグインのシェルは、プラグインのプレフィックスなしで呼び出すことができます。
2つのプラグインが同じ名前のシェルを提供する場合には、最初にロードされたプラグインが、
短いエイリアスを取得します。
常に明確にシェルを参照するために `plugin.command` 形式を使用することができます。

## コンソールアプリケーション

デフォルトで、 CakePHP は、アプリケーションやプラグインの中の全てのコマンドを
自動的に検出します。独立したコンソールアプリケーションを構築する際、
公開されるコマンドの数を減らすことができます。 `Application` の `console()` フックを使って、
公開されるコマンドを制限し、公開されるコマンドの名前を変更することができます。 :

``` php
// src/Application.php の中で
namespace App;

use App\Shell\UserShell;
use App\Shell\VersionShell;
use Cake\Http\BaseApplication;

class Application extends BaseApplication
{
    public function console($commands)
    {
        // クラス名で追加
        $commands->add('user', UserShell::class);

        // インスタンスを追加
        $commands->add('version', new VersionShell());

        return $commands;
    }
}
```

上記の例で、利用できるコマンドは、 `help` 、 `version` 、そして `user` です。
プラグインにコマンドを追加する方法については、 [Plugin Commands](plugins#plugin-commands) セクションをご覧ください。

> [!NOTE]
> 同じ Command クラスを使用する複数のコマンドを追加する場合、 `help` コマンドは、
> 最短のオプションを表示します。

::: info Added in version 3.5.0
`console` フックが追加されました。
:::

## コマンドの名前変更

コマンドの名前を変更したり、ネストされたコマンドやサブコマンドを作成する場合があります。
コマンドのデフォルトの自動検出ではこれが行われませんが、
コマンドを登録して好きな名前を付けることができます。

プラグインの中で各コマンドを定義することで、コマンド名をカスタマイズすることができます。 :

``` php
public function console($commands)
{
    // ネストされた名前のコマンドを追加
    $commands->add('user dump', UserDumpCommand::class)
    $commands->add('user:show', UserShowCommand::class)

    // コマンドの名前を完全に変更
    $commands->add('lazer', UserDeleteCommand::class)

    return $commands;
}
```

アプリケーションの `console()` フックを上書きする場合、
CakePHP からコマンドを追加するために `$commands->autoDiscover()` を呼ぶことを忘れないでください。

追加されたコマンドの名前変更や削除が必要な場合、使用可能なコマンドを変更するために
アプリケーションのイベントマネージャーで `Console.buildCommands` イベントを使用することができます。

## コマンド

初めてコマンドを作成する場合、作成方法は [コンソールコマンド](console-and-shells/commands) をご覧ください。
次に、コマンドの詳細はこちら:

- [コンソールコマンド](console-and-shells/commands)
- [コマンドの入力と出力](console-and-shells/input-output)
- [オプションパーサー](console-and-shells/option-parsers)
- [Shell ヘルパー](console-and-shells/helpers)
- [cron ジョブに登録してシェルを実行する](console-and-shells/cron-jobs)

## CakePHP が提供するコマンド

- [Cache シェル](console-and-shells/cache)
- [I18N シェル](console-and-shells/i18n-shell)
- [Completion シェル](console-and-shells/completion-shell)
- [Plugin シェル](console-and-shells/plugin-shell)
- [Routes Shell](console-and-shells/routes-shell)
- [スキーマキャッシュシェル](console-and-shells/schema-cache)
- [Server Shell](console-and-shells/server-shell)
- [Upgrade Shell](console-and-shells/upgrade-shell)
- [シェル](console-and-shells/shells)
- [インタラクティブ・コンソール (REPL)](console-and-shells/repl)

## コンソール環境におけるルーティング

コマンドライン・インターフェイス (CLI)、特にあなたのシェルやタスクでは、 `env('HTTP_HOST')`
やその他のウェブブラウザー固有の変数がセットされていません。

`Router::url()` を使ってレポートを作成したり電子メールを送ったりする場合、
それらにはデフォルトホスト `http://localhost/` が構成に含まれており、 そのため結果として無効な
URL となってしまいます。こういったケースでは、ドメインを手作業で設定する必要があります。
これを、たとえばブートストラップまたは config で、コンフィグ値 `App.fullBaseUrl` を使って
設定できます。

電子メールを送る場合は、Email クラスでメールを送る際のホストを指定する必要があります。 :

``` php
use Cake\Mailer\Email;

$email = new Email();
// 3.4 より前は domain() を使用
$email->setDomain('www.example.org');
```

これにより生成されるメッセージ ID は有効で、また送信元ドメイン名にも合致したものになります。
