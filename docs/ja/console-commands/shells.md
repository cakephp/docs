# シェル

`class` Cake\\Console\\**Shell**

::: info Deprecated in version 3.6.0
Shell は 3.6.0 で非推奨ですが、 5.x までは削除されません。 代わりに [コマンドオブジェクト](../console-commands/commands) を使用してください。
:::

## シェルの作成

早速コンソールで動くシェルを作ってみましょう。この例ではシンプルな Hello world シェルを作ります。
アプリケーションの **src/Shell** ディレクトリーに **HelloShell.php** を作成してください。
その中に以下のコードを書きます。 :

``` php
namespace App\Shell;

use Cake\Console\Shell;

class HelloShell extends Shell
{
    public function main()
    {
        $this->out('Hello world.');
    }
}
```

シェルクラスの規約として、クラス名は Shell サフィックス（接尾辞）を 付け、
ファイル名と一致する必要があります。上記のシェルでは、 `main()` メソッドを作成しました。
シェルが 追加コマンド（引数）なしで起動された場合、このメソッドが呼ばれます。
この後、 多少コマンドを追加していきますが、現時点では単にシェルを起動してみましょう。
アプリケーションディレクトリーから、以下を実行してください。 :

    bin/cake hello

次の出力が表示されるはずです。 :

    Hello world.

すでに述べたように、シェルで `main()` メソッドは、シェルに与えられた他のコマンドや
引数がない場合、いつでも呼ばれる特殊なメソッドです。main メソッドの使い方がある程度わかったら、
次は以下のように別のコマンドを追加してみましょう。 :

``` php
namespace App\Shell;

use Cake\Console\Shell;

class HelloShell extends Shell
{
    public function main()
    {
        $this->out('Hello world.');
    }

    public function heyThere($name = 'Anonymous')
    {
        $this->out('Hey there ' . $name);
    }
}
```

このファイルを保存した後、次のコマンドを実行すると、あなたの名前が表示されるはずです。 :

    bin/cake hello hey_there your-name

public メソッドのうち頭に \_ が付かないものは、コマンドラインから呼び出せます。
ご覧のように、コマンドラインから呼び出されるメソッドは、アンダースコアー形式のシェル引数から
クラス内の正しいキャメルケース形式のメソッド名に変換されています。

`heyThere()` メソッドでは、位置引数が `heyThere()` 関数に提供されていることがわかります。
位置引数は `args` プロパティーでも利用できます。 `$this->params` で利用できる
シェルアプリケーション上のスイッチやオプションにアクセスできますが、それを少し使いやすくしています。

`main()` メソッドを使用するときは、位置引数を使用することはできません。
最初の位置引数やオプションが、コマンド名として解釈されるためです。
引数を使用したい場合、 `main` 以外のメソッド名を使用する必要があります。

## シェルのタスク

より高度なコンソールアプリケーションを開発する場合には、
多くのシェル間で共有される再利用可能なクラスとして機能を構成したいでしょう。
タスクによりコマンドをクラスに展開できます。例えば `bake` は、そのほとんどがタスクにより
作られています。 `$tasks` プロパティーを使ってシェルのタスクを定義できます。 :

``` php
class UserShell extends Shell
{
    public $tasks = ['Template'];
}
```

プラグインからタスクを使うには、標準の `プラグイン記法` を使用します。
タスクは `Shell/Task/` に、クラスにちなんで名付けられたファイルに格納されます。
たとえば新たに 'FileGenerator' タスクを作成したい場合は、
**src/Shell/Task/FileGeneratorTask.php** を作成することになります。

各タスクは、少なくとも `main()` メソッドを実装する必要があります。
タスクが呼び出されたとき ShellDispatcher は、このメソッドを呼び出します。
タスククラスは次のようになります。 :

``` php
namespace App\Shell\Task;

use Cake\Console\Shell;

class FileGeneratorTask extends Shell
{
    public function main()
    {

    }
}
```

シェルはプロパティーとしてもタスクにアクセスできますので、 [コンポーネント](../controllers/components)
と同様に再利用可能な部品としてタスクを利用できます。 :

``` php
// Found in src/Shell/SeaShell.php
class SeaShell extends Shell
{
    // Found in src/Shell/Task/SoundTask.php
    public $tasks = ['Sound'];

    public function main()
    {
        $this->Sound->main();
    }
}
```

また、コマンドラインからタスクに直接アクセスすることができます。 :

``` bash
$ cake sea sound
```

> [!NOTE]
> コマンドラインからタスクを直接アクセスするには、タスクは **必ず** シェルクラスの
> \$tasks プロパティーに含まれている必要があります。

また、タスク名は、シェルの OptionParser にサブコマンドとして追加する必要があります。 :

``` php
public function getOptionParser()
{
    $parser = parent::getOptionParser();
    $parser->addSubcommand('sound', [
        // コマンド一覧のヘルプテキストを提供
        'help' => 'Execute The Sound Task.',
        // オプションパーサーを互いにリンク
        'parser' => $this->Sound->getOptionParser(),
    ]);

    return $parser;
}
```

### TaskRegistry による動的なタスクのロード

タスクのレジストリーオブジェクトを使用して、その場でタスクをロードすることができます。
以下のようにすると \$tasks で宣言されなかったタスクをロードすることができます。 :

``` php
$project = $this->Tasks->load('Project');
```

ProjectTask インスタンスをロードして返します。
プラグインからタスクをロードすることもできます。 :

``` php
$progressBar = $this->Tasks->load('ProgressBar.ProgressBar');
```

## シェルの中でのモデルの使用

アプリケーションのビジネスロジックに、シェルユーティリティーの中からアクセスする必要があることも
よくあるでしょう。 CakePHP はそれが超簡単にできます。コントローラーの中で `loadModel()` を
使用するのと同じように、シェルの中でモデルを読み込むことができます。
ロードされたモデルは、あなたのシェルに付属するプロパティーとして設定されます。 :

``` php
namespace App\Shell;

use Cake\Console\Shell;

class UserShell extends Shell
{

    public function initialize()
    {
        parent::initialize();
        $this->loadModel('Users');
    }

    public function show()
    {
        if (empty($this->args[0])) {
            // CakePHP 3.2 より前なら error() を利用
            return $this->abort('Please enter a username.');
        }
        $user = $this->Users->findByUsername($this->args[0])->first();
        $this->out(print_r($user, true));
    }
}
```

上記のシェルは、username によってユーザーを取得し、データベースに格納された情報が表示されます。

## シェルヘルパー

複雑な出力生成ロジックの場合、再利用可能な方法で、このロジックをカプセル化するために
[Command Helpers](../console-commands/input-output#command-helpers) を利用することができます。

## シェルから他のシェルの呼び出し

`method` Cake\\Console\\Shell::**dispatchShell**($args)

あるシェルから他のシェルを呼び出したいケースは多々あると思います。
他のシェルを呼び出すには `Shell::dispatchShell()` を使います。
サブシェル側では引数を受け取るための `argv` が使えます。
引数やオプションは可変引数もしくは文字列として指定できます。 :

``` php
// 文字列として
$this->dispatchShell('schema create Blog --plugin Blog');

// 配列として
$this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');
```

上記は、プラグインのシェルの中からプラグイン用のスキーマを作るために schema シェルを呼んでいます。

### ディスパッチされたシェルへのパラメーター追加

ディスパッチされたシェルへの（シェルの引数にない）追加パラメーターを渡すことが有用な時がしばしばあります。
これを行うために、 `dispatchShell()` に配列を渡すことができます。
配列は、 `command` キーと共に `extra` キーを持つことが期待されています。 :

``` php
// コマンド文字列を使用
$this->dispatchShell([
   'command' => 'schema create Blog --plugin Blog',
   'extra' => [
        'foo' => 'bar'
    ]
]);

// コマンド配列を使用
$this->dispatchShell([
   'command' => ['schema', 'create', 'Blog', '--plugin', 'Blog'],
   'extra' => [
        'foo' => 'bar'
    ]
]);
```

`extra` で渡されたパラメーターは、 `Shell::$params` プロパティーにマージされ、
`Shell::param()` メソッドでアクセス可能になります。
シェルで `dispatchShell()` を使用してディスパッチされた時、デフォルトで `requested`
追加パラメーターが自動的に追加されます。この `requested` パラメーターは、
ディスパッチされたシェルに表示されている CakePHP のコンソールウェルカムメッセージを防ぎます。

## CLI オプションのパース

シェルはオプション、引数を定義し、ヘルプの生成を自動化するために
[オプションパーサー](../console-commands/option-parsers) を使います。

## 入出力との対話

シェルでは、 `getIo()` メソッドを使って `ConsoleIo` インスタンスにアクセスすることができます。
詳細は、 [コマンドの入力と出力](../console-commands/input-output) をご覧ください。

`ConsoleIo` オブジェクトに加えて、シェルクラスは一連のショートカットメソッドを提供します。
これらのメソッドは、 `ConsoleIo` にあるメソッドのショートカットやエイリアスです。 :

``` php
// ユーザーから任意のテキストを取得
$color = $this->in('What color do you like?');

// ユーザーの選択を取得
$selection = $this->in('Red or Green?', ['R', 'G'], 'R');

// ファイルの作成
$this->createFile('bower.json', $stuff);

// 標準出力に出力
$this->out('Normal message');

// 標準エラーに出力
$this->err('Error message');

// 標準エラーに出力し、停止例外を発生
$this->abort('Fatal error');

// CakePHP 3.2 より前。標準エラーに出力し exit()
$this->error('Fatal error');
```

また、出力レベルに関する2つの便利なメソッドを提供します。 :

``` php
// 詳細出力が有効の時のみ (-v)
$this->verbose('Verbose message');

// すべてのレベルで表示
$this->quiet('Quiet message');
```

シェルはまた、画面のクリア、空白行の作成、または横棒線を描くためのメソッドを含みます。 :

``` php
// ２行の改行を出力
$this->out($this->nl(2));

// ユーザーの画面をクリア
$this->clear();

// 横棒線を描画
$this->hr();
```

## シェルの実行を停止

あなたのシェルコマンドを停止したい条件に達した時、プロセスを停止するための `StopException`
を発生させるために `abort()` を使用することができます。 :

``` php
$user = $this->Users->get($this->args[0]);
if (!$user) {
    // エラーメッセージとエラーコードとともに停止
    $this->abort('ユーザーが見つかりません', 128);
}
```

## ステータスとエラーコード

コマンドラインツールは、成功を示すために 0 を返し、エラー状態を示すために 0 以外を
返すべきです。 PHP メソッドは、通常 `true` か `false` を返すため、
Cake Shell の `dispatch` 関数は、 `null` と `true` の戻り値を 0 へ、
それ以外の値は 1 へと変換することによって、これらのセマンティクスとの橋渡しに役立ちます。

Cake Shell の `dispatch` 関数は、 `StopException` をキャッチし、
その例外コードの値をシェルの終了コードとして使用します。上記のように、
`abort()` を使ってメッセージを出力して指定したコードで終了したり、
例に示すように、直接 `StopException` を起こすことができます。 :

``` php
namespace App\Shell\Task;

use Cake\Console\Shell;

class ErroneousShell extends Shell
{
    public function main()
    {
        return true;
    }

    public function itFails()
    {
        return false;
    }

    public function itFailsSpecifically()
    {
        throw new StopException("", 2);
    }
}
```

上記の例では、コマンドライン上で実行された際、次の終了コードを返します。 :

``` bash
$ bin/cake erroneousshell ; echo $?
0
$ bin/cake erroneousshell itFails ; echo $?
1
$ bin/cake erroneousshell itFailsSpecifically ; echo $?
2
```

> [!TIP]
> 終了コードの 64 から 78 は避けてください。それらは `sysexits.h` で記述された
> 特定の意味を持っています。
> 終了コードの 127 以上を避けてください。それらは、 SIGKILL や SIGSEGV のような
> シグナルによるプロセスの終了を示すために使用されます。

> [!NOTE]
> 従来の終了コードについての詳細は、ほとんどの Unix システムの sysexit マニュアルページ
> (`man sysexits`) 、または Windows の `System Error Codes` ヘルプページを
> 参照してください。

## フックメソッド

`method` Cake\\Console\\Shell::**initialize**()

`method` Cake\\Console\\Shell::**startup**()

> [!TIP]
> ウェルカム情報を削除する場合やそれまでのコマンドの流れを変更する場合は、
> `startup()` メソッドをオーバーライドします。
>
> 終了コードの 64 から 78 は避けてください。それらは `sysexits.h` で記述された
> 特定の意味を持っています。終了コードの 127 以上を避けてください。
> それらは、 SIGKILL や SIGSEGV のようなシグナルによるプロセスの終了を示すために使用されます。
