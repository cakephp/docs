# コンソールコマンド

CakePHP はウェブフレームワークとしてだけではなく、コンソールアプリケーションを開発するための
コンソールフレームワークとしての機能を合わせ持っています。コンソールアプリケーションは
メンテナンスといった様々なバックグラウンド タスクを行ったり、リクエスト－レスポンスのサイクルの
外側で何かを実行するための仕組みです。CakePHP のコンソールアプリケーションでは、コマンドライン
からあなたが作成したアプリケーションクラスを再利用できます。

CakePHP には元々たくさんのコンソールアプリケーションが備わっています。
これらの中には（i18n のように）他の CakePHP の機能と組合せて使うものもあれば、
仕事をより早く片付けるための、より一般的なものもあります。

## CakePHP のコンソール

このセクションでは、コマンドラインにおける CakePHP をご紹介します。
CakePHPのコンソールツールは、ディスパッチタイプのセットアップを使って シェルやタスクをロードし、
それらへパラメーターを渡します。以下の例ではbashを使用していますが、
CakePHPコンソールは多くの \*nix シェルおよびウィンドウと互換性があります。

CakePHPアプリケーションには、シェルとタスクを含む **src/Command** 、
**src/Shell** 、および **src/Shell/Task** ディレクトリが含まれています。
また、binディレクトリには実行ファイルが付属しています。

``` bash
$ cd /path/to/app
$ bin/cake
```

> [!NOTE]
> Windowsのコマンドプロンプト(cmd.exe)の場合、 `bin\cake` としないと動作しません（スラッシュではなくバックスラッシュ）。

引数なしでコンソールを実行すると、使用可能なコマンドが一覧表示されます。
そのコマンド名を使用してコマンドを実行できます。

``` bash
# server シェルを実行
bin/cake server

# マイグレーションシェルを実行
bin/cake migrations -h

# bake コマンドを実行 (プラグインプレフィックスを先頭に付ける例)
bin/cake bake.bake -h
```

コマンドの名前がアプリケーションやフレームワークのコマンドと重複しない場合、
プラグインのコマンドはプラグインプレフィックスなしで呼び出すことができます。
2つのプラグインが同じ名前のコマンドを提供する場合、最初にロードされた
プラグインが短いエイリアス名を取得します。
この `plugin.command` 形式を使用して、コマンドを呼び分けることができます。

## コンソールアプリケーション

デフォルトでは、CakePHP はアプリケーションやプラグインの全てのコマンドを
自動的に検出します。独立したコンソールアプリケーションを構築する場合は、
公開されるコマンドの数を減らすことをお勧めします。
`Application` の `console()` フックを使って、公開されるコマンドの制限やコマンド名の整理が可能です。:

``` php
// src/Application.php
namespace App;

use App\Command\UserCommand;
use App\Command\VersionCommand;
use Cake\Console\CommandCollection;
use Cake\Http\BaseApplication;

class Application extends BaseApplication
{
    public function console(CommandCollection $commands): CommandCollection
    {
        // Add by classname
        $commands->add('user', UserCommand::class);

        // Add instance
        $commands->add('version', new VersionCommand());

        return $commands;
    }
}
```

上記の例では、利用できるコマンドは `help` ・ `version` ・ `user` のみです。
プラグインにコマンドを追加する方法については、 [Plugin Commands](plugins#plugin-commands) セクションを
ご覧ください。

> [!NOTE]
> 同じ Command クラスを使用する複数のコマンドを追加する場合、 `help` コマンドは
> 最短のオプションを表示します。

## コマンド名を変更

コマンドの名前を変更したり、ネストされたコマンドやサブコマンドを作成する場合があります。
コマンドのデフォルトの自動検出ではこれは行われませんが、コマンドを登録して任意の名前をつけることができます。

プラグインの中で各コマンドを定義することにより、コマンド名をカスタマイズできます。:

``` php
public function console(CommandCollection $commands): CommandCollection
{
    // ネストされた名前のコマンドを追加
    $commands->add('user dump', UserDumpCommand::class)
    $commands->add('user:show', UserShowCommand::class)

    // コマンドの名前を全体的に変更
    $commands->add('lazer', UserDeleteCommand::class)

    return $commands;
}
```

アプリケーションの `console()` フックを上書きする場合、
`$commands->autoDiscover()` を呼び出して、CakePHP、アプリケーション、
およびプラグインからコマンドを追加することを忘れないでください。

添付されているコマンドの名前を変更したい・削除する必要がある場合は、
アプリケーションイベントマネージャーで `Console.buildCommands` イベントを
使用して、使用可能なコマンドを変更できます。

## コマンド

最初のコマンドを作成する方法については、 [コマンドオブジェクト](console-commands/commands) の章を
参照してください。次に、コマンドについて詳しく説明します。

- [コマンドオブジェクト](console-commands/commands)
- [コマンドの入力と出力](console-commands/input-output)
- [オプションパーサー](console-commands/option-parsers)
- [cron ジョブに登録してシェルを実行する](console-commands/cron-jobs)

## CakePHPが提供するコマンド

- [キャッシュツール](console-commands/cache)
- [Completion ツール](console-commands/completion)
- [I18N ツール](console-commands/i18n)
- [Plugin シェル](console-commands/plugin)
- [スキーマキャッシュツール](console-commands/schema-cache)
- [Routes ツール](console-commands/routes)
- [Server ツール](console-commands/server)
- [インタラクティブ・コンソール (REPL)](console-commands/repl)
- [シェル](console-commands/shells)

## コンソール環境におけるルーティング

コマンドラインインターフェイス(CLI)、特にシェルとタスクでは、
`env('HTTP_HOST')` およびその他のWebブラウザー固有の
環境変数が設定されていません。

`Router::url()` を使ってレポートを生成したり、メールを送信したりする場合、
デフォルトホスト `http://localhost/` が含まれるため、結果として無効なURLになってしまいます。
こういったケースでは、ドメインを手動で設定する必要があります。たとえば、ブートストラップ
または Config の `App.fullBaseUrl` を使って設定できます。

メールを送信する場合は、メールを送信する際のホストを Email クラスで指定する必要があります:

``` php
use Cake\Mailer\Email;

$email = new Email();
$email->setDomain('www.example.org');
```

これにより生成されたメッセージIDはは有効で、メール送信元のドメインに適合していることが保証されます。
