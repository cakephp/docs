# コマンドオブジェクト

`class` Cake\\Console\\**Command**

CakePHP には、開発のスピードアップと日常的なタスクの自動化を目的とした多数の組み込みコマンドが
用意されています。これらの同じライブラリを使用して、アプリケーションとプラグイン用のコマンドを
作成することができます。

## コマンドの作成

最初のコマンドを作ってみましょう。この例では、単純な Hello world コマンドを作成します。
アプリケーションの **src/Command** ディレクトリの中で、 **HelloCommand.php** を作成してください。
その中に次のコードを書いてください。 :

``` php
<?php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;

class HelloCommand extends Command
{
    public function execute(Arguments $args, ConsoleIo $io)
    {
        $io->out('Hello world.');
    }
}
```

上記のように、Command クラスでは、さまざまな処理まとめて
行うための `execute()` メソッドを実装する必要があります。
コマンドが呼び出されたときに、このメソッドが呼び出されます。
それでは、このコマンド実行してみましょう。

``` bash
bin/cake hello
```

次の出力が表示されます。 :

    Hello world.

無事に表示されましたか？
次に、パラメータを与えられるようにしてみます。
`buildOptionParser()` を使用します。 :

``` php
<?php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;

class HelloCommand extends Command
{
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser->addArgument('name', [
            'help' => 'What is your name'
        ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $name = $args->getArgument('name');
        $io->out("Hello {$name}.");
    }
}
```

このファイルを保存した後、次のようにコマンドを実行できます。

``` bash
bin/cake hello jillian

# 出力結果
Hello jillian
```

## デフォルトのコマンド名の変更

コマンド名は原則的にCakePHPの規約に則ったものになります。
このコマンド名を上書きする場合は、
コマンドの `defaultName()` メソッドを用います。:

``` text
public static function defaultName(): string
{
    return 'oh_hi';
}
```

上記のように書くことで、 `HelloCommand` コマンドは
`cake hello` ではなく `cake oh_hi` として
実行できるようになります。

## 引数やオプションの定義

すでに說明したように、 `buildOptionParser()` フックメソッドを使って引数を定義することができます。
また、オプションも定義できます。 たとえば、 `HelloCommand` に `yell` オプションを
追加することができます。 :

``` php
// ...
protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
{
    $parser
        ->addArgument('name', [
            'help' => 'What is your name'
        ])
        ->addOption('yell', [
            'help' => 'Shout the name',
            'boolean' => true
        ]);

    return $parser;
}

public function execute(Arguments $args, ConsoleIo $io)
{
    $name = $args->getArgument('name');
    if ($args->getOption('yell')) {
        $name = mb_strtoupper($name);
    }
    $io->out("Hello {$name}.");
}
```

詳しくは、 [オプションパーサー](../console-commands/option-parsers) をご覧ください。

## ファイルに出力

コマンドは、実行されると `ConsoleIo` インスタンスが提供されます。
このオブジェクトは `stdout` 、 `stderr` とのハンドシェイクによりファイルを生成することができます。
詳しくは、 [コマンドの入力と出力](../console-commands/input-output) セクションをご覧ください。

## コマンド内でのモデルの使用

コンソールコマンドでアプリケーションのビジネスロジックにアクセスしたいケースが、しばしばあると思います。
コントローラと同じように、コマンドでは `LocatorAwareTrait` を
通じてモデルをロードできます。
そのために、 `$this->fetchTable()` を使用します。:

``` php
<?php
declare(strict_types=1);

namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;

class UserCommand extends Command
{
    // デフォルトのテーブルを定義します。これにより、引数なしで  `fetchTable()` を使用できます。
    protected $defaultTable = 'Users';

    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->addArgument('name', [
                'help' => 'What is your name'
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io): ?int
    {
        $name = $args->getArgument('name');
        $user = $this->fetchTable()->findByUsername($name)->first();

        $io->out(print_r($user, true));

        return null;
    }
}
```

上記のコマンドは、ユーザー名でユーザを取得し、データベースに格納されている情報を表示します。

## 終了コードと実行停止

コマンドが回復不能なエラーに遭遇したら、 `abort()` メソッドを使って実行を終了することができます。 :

``` php
// ...
public function execute(Arguments $args, ConsoleIo $io)
{
    $name = $args->getArgument('name');
    if (strlen($name) < 5) {
        // 実行を停止し、標準エラーに出力し、終了コードを 1 に設定
        $io->error('Name must be at least 4 characters long.');
        $this->abort();
    }
}
```

`$io->abort()` の引数を使用して、任意のメッセージと終了コードを渡すこともできます:

``` php
public function execute(Arguments $args, ConsoleIo $io)
{
    $name = $args->getArgument('name');
    if (strlen($name) < 5) {
        // 実行を停止しstderrに出力し、終了コードを99に設定します
        $io->abort('名前は4文字以上にする必要があります。', 99);
    }
}
```

> [!TIP]
> 終了コードの 64 から 78 は避けてください。それらは `sysexits.h` で記述された
> 特定の意味を持っています。また、127 以上も避けてください。
> それらは、 SIGKILL や SIGSEGV のようなシグナルによるプロセスの終了を示すために使用されるからです。
>
> OS既存の終了コードの詳細については、Unixシステム の sysexit マニュアルページ
> (`man sysexits`)、または Windows の `System Error Codes` ヘルプページを
> 参照してください。

## 他のコマンドの呼び出し

コマンド内から他のコマンドを呼び出す必要がある場合があります。
そのために `executeCommand()` を用いることができます。:

``` php
// コマンドのオプションと引数は配列で渡します。
$this->executeCommand(OtherCommand::class, ['--verbose', 'deploy']);

// コンストラクターに引数がある場合はインスタンスを生成して渡します。
$command = new OtherCommand($otherArgs);
$this->executeCommand($command, ['--verbose', 'deploy']);
```

## コマンド説明文の設定

以下のようにコマンドの説明文を設定することができます。:

``` php
class UserCommand extends Command
{
    public static function getDescription(): string
    {
        return 'カスタムの説明文';
    }
}
```

これにより、Cake CLIに説明文が表示されます。:

``` bash
bin/cake

App:
  - user
  └─── カスタムの説明文
```

コマンドのヘルプセクションと同様です。:

``` bash
cake user --help
カスタムの説明文

Usage:
cake user [-h] [-q] [-v]
```

## コマンドのテスト

コンソールアプリケーションをより簡単にテストするため、CakePHP には、
コンソールアプリケーションをテストし、結果をアサートするための
`ConsoleIntegrationTestTrait` トレイトが備わっています。
このトレイトは、コマンドを実行するために使用する
`exec()` メソッドが定義されており、このメソッドに、
CLI で使用するのと同じ文字列を渡すことができます。

**src/Command/UpdateTableCommand.php** に置かれた、とてもシンプルなシェルで始めましょう。 :

``` php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;

class UpdateTableCommand extends Command
{
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser->setDescription('My cool console app');

        return $parser;
    }
}
```

このシェルの統合テストを書くために、 **tests/TestCase/Command/UpdateTableTest.php**
に `Cake\TestSuite\ConsoleIntegrationTestTrait` を使用したテストケースを作成します。
このシェルの説明が `stdout` に出力されることをテストしましょう。 :

``` php
namespace App\Test\TestCase\Command;

use Cake\TestSuite\ConsoleIntegrationTestTrait;
use Cake\TestSuite\TestCase;

class UpdateTableCommandTest extends TestCase
{
    use ConsoleIntegrationTestTrait;

    public function testDescriptionOutput()
    {
        $this->exec('update_table --help');
        $this->assertOutputContains('My cool console app');
    }
}
```

テストが成立しました。これは簡単な例ですが、コンソールアプリケーションの
統合テストケースを作成することは基本的に簡単です。
このコマンドにさらに多くのロジックを追加してみましょう。 :

``` php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;
use Cake\I18n\FrozenTime;

class UpdateTableCommand extends Command
{
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->setDescription('My cool console app')
            ->addArgument('table', [
                'help' => 'Table to update',
                'required' => true
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $table = $args->getArgument('table');
        $this->fetchTable($table)->query()
            ->update()
            ->set([
                'modified' => new FrozenTime()
            ])
            ->execute();
    }
}
```

これはオプションと関連するロジックを必要とする、
より完成度が高いシェルです。
テストケースを次のコードスニペットに変更してみましょう。 :

``` php
namespace Cake\Test\TestCase\Command;

use Cake\Command\Command;
use Cake\I18n\FrozenTime;
use Cake\TestSuite\ConsoleIntegrationTestTrait;
use Cake\TestSuite\TestCase;

class UpdateTableCommandTest extends TestCase
{
    use ConsoleIntegrationTestTrait;

    protected $fixtures = [
        // assumes you have a UsersFixture
        'app.Users'
    ];

    public function testDescriptionOutput()
    {
        $this->exec('update_table --help');
        $this->assertOutputContains('My cool console app');
    }

    public function testUpdateModified()
    {
        $now = new FrozenTime('2021-12-12 00:00:00');
        FrozenTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users');
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        FrozenTime::setTestNow(null);
    }
}
```

`testUpdateModified()` メソッドを見ると分かると思いますが、
コマンドが最初の引数として渡すテーブルを更新することをテストします。
まず最初に、コマンドが適切なステータスコード `0` で終了したことを
`assertExitCode()` によってアサートします。

次に、このコマンドが意図どおりに動作したことを確認します。
つまり、 `modified` カラムが現在の時刻に更新されたことを
`assertSame()` で確認します。

ちなみに、 `exec()` はCLIに入力したのと同じ文字列を
使用するため、コマンド文字列としてオプションと引数を含める
ことができます。

### 対話的なシェルのテスト

コンソールは対話的に用いることも多いインターフェイスです。
`Cake\TestSuite\ConsoleIntegrationTestTrait` トレイトで
対話的なシェルをテストするには、期待する入力を `exec()` の２番目の
パラメーターとして渡すだけです。それらは、期待どおりの順序で配列として含める必要があります。

引き続き、対話的な確認フローを追加してみましょう。
テスト元のコマンドクラスを次のように更新します。 :

``` php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;
use Cake\I18n\FrozenTime;

class UpdateTableCommand extends Command
{
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->setDescription('My cool console app')
            ->addArgument('table', [
                'help' => 'Table to update',
                'required' => true
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $table = $args->getArgument('table');
        if ($io->ask('Are you sure?', 'n', ['y', 'n']) === 'n') {
            $io->error('You need to be sure.');
            $this->abort();
        }
        $this->fetchTable($table)->query()
            ->update()
            ->set([
                'modified' => new FrozenTime()
            ])
            ->execute();
    }
}
```

対話的なサブコマンドができました。次に、適切な応答を受け取るか
どうかをテストするテストケースと、誤った応答を受け取るかどうかを
テストするケースを追加しましょう。 `testUpdateModified`
メソッドを削除し、 **tests/TestCase/Command/UpdateTableCommandTest.php**
に以下のメソッドを追加してください。 :

``` php
public function testUpdateModifiedSure()
{
    $now = new FrozenTime('2017-01-01 00:00:00');
    FrozenTime::setTestNow($now);

    $this->loadFixtures('Users');

    $this->exec('update_table Users', ['y']);
    $this->assertExitCode(Command::CODE_SUCCESS);

    $user = $this->getTableLocator()->get('Users')->get(1);
    $this->assertSame($user->modified->timestamp, $now->timestamp);

    FrozenTime::setTestNow(null);
}

public function testUpdateModifiedUnsure()
{
    $user = $this->getTableLocator()->get('Users')->get(1);
    $original = $user->modified->timestamp;

    $this->exec('my_console best_framework', ['n']);
    $this->assertExitCode(Command::CODE_ERROR);
    $this->assertErrorContains('You need to be sure.');

    $user = $this->getTableLocator()->get('Users')->get(1);
    $this->assertSame($original, $user->timestamp);
}
```

最初のテストケースでは、質問を確認し、レコードが更新されます。
2番目のテストでは確認していませんし、レコードが更新されていないので、
エラーメッセージが `stderr` に書き込まれていることを確認できます。

### アサーションメソッド

`Cake\TestSuite\ConsoleIntegrationTestTrait` トレイトは、コンソールの出力に対して
容易にアサートできるようにするいくつかのアサーションメソッドを提供します。 :

``` php
// シェルがsuccessステータスで終了したことをアサート
$this->assertExitSuccess();

// シェルがerrorステータスで終了したことをアサート
$this->assertExitError();

// シェルが期待したコードで終了したことをアサート
$this->assertExitCode($expected);

// 標準出力が文字列を含むことをアサート
$this->assertOutputContains($expected);

// 標準エラーが文字列を含むことをアサート
$this->assertErrorContains($expected);

// 標準出力を正規表現にマッチするかをアサート
$this->assertOutputRegExp($expected);

// 標準エラーが正規表現にマッチするかをアサート
$this->assertErrorRegExp($expected);
```
