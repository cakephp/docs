コンソールコマンド
##################

.. php:namespace:: Cake\Console
.. php:class:: Command

CakePHP には、開発のスピードアップと日常的なタスクの自動化を目的とした多数の組み込みコマンドが
用意されています。これらの同じライブラリを使用して、アプリケーションとプラグイン用のコマンドを
作成することができます。

コマンドの作成
==============

最初のコマンドを作ってみましょう。この例では、単純な Hello world コマンドを作成します。
アプリケーションの **src/Command** ディレクトリの中で、 **HelloCommand.php** を作成してください。
その中に次のコードを書いてください。 ::

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

Command クラスは、大部分の作業を行う ``execute()`` メソッドを実装する必要があります。
コマンドが呼び出されたときに、このメソッドが呼び出されます。
最初のコマンドアプリケーションディレクトリーを呼び出して、次のコマンドを実行します。

.. code-block:: console

    bin/cake hello

次の出力が表示されます。 ::

    Hello world.

今までの ``execute()`` メソッドはあまり面白くないので、
コマンドラインから何らかの入力を読みましょう。 ::

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


このファイルを保存した後、次のコマンドを実行できるはずです。

.. code-block:: console

    bin/cake hello jillian

    # 出力結果
    Hello jillian

引数やオプションの定義
======================

最後の例で見たように、 ``buildOptionParser()`` フックメソッドを使って引数を定義することができます。
また、オプションも定義できます。 たとえば、 ``HelloCommand`` に ``yell`` オプションを
追加することができます。 ::

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

詳しくは、 :doc:`/console-and-shells/option-parsers` をご覧ください。

出力の作成
==========

コマンドは、実行されると ``ConsoleIo`` インスタンスが提供されます。
このオブジェクトは ``stdout`` 、 ``stderr`` と対話してファイルを作成することを可能にします。
詳しくは、 :doc:`/console-and-shells/input-output` セクションをご覧ください。

コマンド内でのモデルの使用
==========================

しばしば、コンソールコマンドでアプリケーションのビジネスロジックにアクセスする必要があります。
``loadModel()`` を使ってコントローラーと同じように、コマンドでモデルを読み込むことができます。
ロードされたモデルは、コマンドに追加されたプロパティとして設定されます。 ::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->addArgument('name', [
                    'help' => 'What is your name'
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $name = $args->getArgument('name');
            $user = $this->Users->findByUsername($name)->first();

            $io->out(print_r($user, true));
        }
    }

上記のコマンドは、ユーザー名でユーザを取得し、データベースに格納されている情報を表示します。

終了コードと実行停止
=================================

コマンドが回復不能なエラーに遭遇したら、 ``abort()`` メソッドを使って実行を終了することができます。 ::

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

任意の終了コードを ``abort()`` に渡すことができます。

.. tip::

    終了コードの 64 から 78 は避けてください。それらは ``sysexits.h`` で記述された
    特定の意味を持っています。終了コードの 127 以上を避けてください。
    それらは、 SIGKILL や SIGSEGV のようなシグナルによるプロセスの終了を示すために使用されます。

    従来の終了コードの詳細については、ほとんどの Unixシステム の sysexit マニュアルページ
    (``man sysexits``)、または Windows の ``System Error Codes`` ヘルプページを
    参照してください。

.. _console-integration-testing:

コマンドのテスト
================

コンソールアプリケーションをより簡単にテストするため、CakePHP は、
コンソールアプリケーションをテストし、結果に対してアサートするための
``ConsoleIntegrationTestTrait`` トレイトが付属しています。

コンソールアプリケーションのテストを始めるために、 ``Cake\TestSuite\ConsoleIntegrationTestTrait``
を使用したテストケースを作成してください。このトレイトは、あなたのコマンドを実行するために使用する
``exec()`` メソッドを含みます。このメソッドに、CLI で使用するのと同じ文字列を渡すことができます。

**src/Command/UpdateTableCommand.php** に置かれた、とてもシンプルなシェルで始めましょう。 ::

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

このシェルの統合テストを書くために、 **tests/TestCase/Command/UpdateTableCommandTest.php**
に ``Cake\TestSuite\ConsoleIntegrationTestTrait`` を使用したテストケースを作成します。
このシェルは現時点ですることはあまりありませんが、シェルの説明が ``stdout``
に表示されていることをテストしましょう。 ::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->useCommandRunner();
        }

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }
    }

テストが合格します！これは非常に簡単な例ですが、コンソールアプリケーションの
統合テストケースを作成することは非常に簡単です。このシェルにいくつかの
コマンドにもっと多くのロジックを追加してみましょう。 ::

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
            $this->loadModel($table);
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

これはオプションと関連するロジックを必要とするより完全なシェルです。
テストケースを次のコードスニペットに変更します。 ::

    namespace Cake\Test\TestCase\Command;

    use Cake\Command\Command;
    use Cake\I18n\FrozenTime;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        public $fixtures = [
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
            $now = new FrozenTime('2017-01-01 00:00:00');
            FrozenTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Command::CODE_SUCCESS);

            // Prior to 3.6 use TableRegistry::get('Users')
            $user = TableRegistry::getTableLocator()->get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            FrozenTime::setTestNow(null);
        }
    }

``testUpdateModified`` メソッドから分かるように、コマンドが
１番目の引数として渡すテーブルを更新することをテストしています。
最初に、コマンドが適切なステータスコード ``0`` で終了したことをアサートします。
次に、私たちのコマンドが動作したことを確認します。つまり、提供したテーブルを更新し、
``modified`` カラムを現在の時刻に設定します。

また、 ``exec()`` はあなたが入力したのと同じ文字列を CLI に取り込むので、
コマンド文字列にオプションと引数を含めることができます。

対話的なシェルのテスト
----------------------

コンソールはしばしば対話的です。 ``Cake\TestSuite\ConsoleIntegrationTestTrait``
トレイトで対話的なシェルをテストするには、期待する入力を ``exec()`` の２番目の
パラメーターとして渡すだけです。それらは、期待どおりの順序で配列として含める必要があります。

引き続きコマンドの例で、対話的な確認を追加しましょう。
コマンドクラスを次のように更新します。 ::

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
            $this->loadModel($table);
            if ($io->ask('Are you sure?', 'n', ['y', 'n']) === 'n') {
                $io->error('You need to be sure.');
                $this->abort();
            }
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

対話的なサブコマンドがあるので、適切な応答を受け取るかどうかをテストするテストケースと、
誤った応答を受け取るかどうかをテストするケースを追加できます。 ``testUpdateModified``
メソッドを削除し、 **tests/TestCase/Command/UpdateTableCommandTest.php**
に以下のメソッドを追加してください。 ::

    public function testUpdateModifiedSure()
    {
        $now = new FrozenTime('2017-01-01 00:00:00');
        FrozenTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['y']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        // Prior to 3.6 use TableRegistry::get('Users')
        $user = TableRegistry::getTableLocator()->get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        FrozenTime::setTestNow(null);
    }

    public function testUpdateModifiedUnsure()
    {
        // Prior to 3.6 use TableRegistry::get('Users')
        $user = TableRegistry::getTableLocator()->get('Users')->get(1);
        $original = $user->modified->timestamp;

        $this->exec('my_console best_framework', ['n']);
        $this->assertExitCode(Command::CODE_ERROR);
        $this->assertErrorContains('You need to be sure.');

        // Prior to 3.6 use TableRegistry::get('Users')
        $user = TableRegistry::getTableLocator()->get('Users')->get(1);
        $this->assertSame($original, $user->timestamp);
    }

最初のテストケースでは、質問を確認し、レコードが更新されます。
2番目のテストでは確認していませんし、レコードが更新されていないので、
エラーメッセージが ``stderr`` に書き込まれていることを確認できます。

CommandRunner のテスト
----------------------

``CommandRunner`` クラスを使ってディスパッチされたシェルをテストするには、
次のメソッドを使ってテストケースでそれを有効にしてください。 ::

    $this->useCommandRunner();


アサーションメソッド
--------------------

``Cake\TestSuite\ConsoleIntegrationTestTrait`` トレイトは、コンソールの出力に対して
容易にアサートできるようにするいくつかのアサーションメソッドを提供します。 ::

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

