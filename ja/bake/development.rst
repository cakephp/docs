Bake の拡張
###########

Bake は、アプリケーションやプラグインが基本機能に対して変更または追加を可能にする
拡張可能なアーキテクチャを備えています。
Bake は、標準の PHP 構文を使用していない専用のビュークラスを利用します。

Bake イベント
=============

``BakeView`` は、ビュークラスとして、他のビュークラスと同様のイベントに加え、
1つの特別な初期化 (initialize) イベントを発します。しかし、一方で標準ビュークラスは、
イベントのプレフィックス "View." を使用しますが、 ``BakeView`` は、
イベントのプレフィックス "Bake." を使用しています。

初期化イベントは、すべての bake の出力に対して変更を加えるために使用できます。
例えば、bake ビュークラスに他のヘルパーを追加するためにこのイベントは使用されます。 ::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.initialize', function (Event $event) {
        $view = $event->subject;

        // bake テンプレートの中で MySpecial ヘルパーの使用を可能にします
        $view->loadHelper('MySpecial', ['some' => 'config']);

        // そして、$author 変数を利用可能にするために追加
        $view->set('author', 'Andy');

    });

別のプラグインの中から bake を変更したい場合は、プラグインの ``config/bootstrap.php``
ファイルでプラグインの Bake イベントを置くことは良いアイデアです。

Bake イベントは、既存のテンプレートに小さな変更を行うための便利なことができます。
例えば、コントローラやテンプレートファイルを bake する際に使用される変数名を
変更するために、bake テンプレートで使用される変数を変更するために
``Bake.beforeRender`` で呼び出される関数を使用することができます。 ::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.beforeRender', function (Event $event) {
        $view = $event->subject;

        // indexes の中のメインデータ変数に $rows を使用
        if ($view->get('pluralName')) {
            $view->set('pluralName', 'rows');
        }
        if ($view->get('pluralVar')) {
            $view->set('pluralVar', 'rows');
        }

        // view と edit の中のメインデータ変数に $theOne を使用
        if ($view->get('singularName')) {
            $view->set('singularName', 'theOne');
        }
        if ($view->get('singularVar')) {
            $view->set('singularVar', 'theOne');
        }

    });

特定の生成されたファイルへの ``Bake.beforeRender`` と ``Bake.afterRender``
イベントを指定することもあるでしょう。例えば、
**Controller/controller.ctp** ファイルから生成する際、 UsersController
に特定のアクションを追加したい場合、以下のイベントを使用することができます。 ::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;
    use Cake\Utility\Hash;

    EventManager::instance()->on(
        'Bake.beforeRender.Controller.controller',
        function (Event $event) {
            $view = $event->subject();
            if ($view->viewVars['name'] == 'Users') {
                // Users コントローラに login と logout を追加
                $view->viewVars['actions'] = [
                    'login',
                    'logout',
                    'index',
                    'view',
                    'add',
                    'edit',
                    'delete'
                ];
            }
        }
    );

特定の bake テンプレートのためのイベントリスナーを指定することによって、
bake 関連のイベント・ロジックを簡素化し、テストするのが容易であるコールバックを
提供することができます。

Bake テンプレート構文
=====================

Bake テンプレートファイルは、テンプレートのロジックを提供し、PHP タグを含む
他のすべてをプレーンテキストとして扱うために、erb スタイル (``<% %>``) タグを
使用します。

.. note::

  Bake テンプレートファイルでは、 ``asp_tags`` PHP の ini 設定は使用も反応もしません。

``BakeView`` は、次のタグを実装します。

* ``<%`` Bake テンプレートの PHP 開始タグ
* ``%>`` Bake テンプレートの PHP 終了タグ
* ``<%=`` Bake テンプレートの PHP ショートエコータグ
* ``<%-`` Bake テンプレートの PHP 開始タグ、タグの前に、先頭の空白を除去
* ``-%>`` Bake テンプレートの PHP 終了タグ、タグの後に末尾の空白を除去

bake テンプレートがどのように動作するかを確認/理解する一つの方法は、
bake テンプレートファイルを変更しようとする場合は特に、クラスを bake して、
アプリケーションの **tmp/bake** フォルダ内に残っている前処理されたテンプレートファイルを
使ったテンプレートと比較することです。

だから、例えば、以下のようにシェルを bake した場合:

.. code-block:: bash

    bin/cake bake shell Foo

(**vendor/cakephp/bake/src/Template/Bake/Shell/shell.ctp**) を使用した
テンプレートは、以下のようになります。 ::

    <?php
    namespace <%= $namespace %>\Shell;

    use Cake\Console\Shell;

    /**
     * <%= $name %> shell command.
     */
    class <%= $name %>Shell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

前処理されたテンプレートファイル (**tmp/bake/Bake-Shell-shell-ctp.php**) は、
実際にレンダリングされて、このようになります。 ::

    <CakePHPBakeOpenTagphp
    namespace <?= $namespace ?>\Shell;

    use Cake\Console\Shell;

    /**
     * <?= $name ?> shell command.
     */
    class <?= $name ?>Shell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

そして、 bake で得られたクラス (**src/Shell/FooShell.php**) は、
このようになります。 ::

    <?php
    namespace App\Shell;

    use Cake\Console\Shell;

    /**
     * Foo shell command.
     */
    class FooShell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

.. _creating-a-bake-theme:

Bake テーマの作成
=================

"bake" コマンドによって生成された出力を変更したい場合、bake が使用するテンプレートの
一部または全部を置き換えることができる、独自の bake の「テーマ」を作成することができます。
これを行うための最善の方法は、次のとおりです。

#. 新しいプラグインを bake します。プラグインの名前は bake の「テーマ」名になります。
#. 新しいディレクトリ **plugins/[name]/src/Template/Bake/Template/** を作成します。
#. **vendor/cakephp/bake/src/Template/Bake/Template** から上書きしたい
   テンプレートをあなたのプラグインの中の適切なファイルにコピーしてください。
#. bake を実行するときに、必要であれば、 bake のテーマを指定するための
   ``--theme`` オプションを使用してください。

Bake テンプレートのカスタマイズ
===============================

"bake" コマンドによって生成されるデフォルトの出力を変更したい場合、アプリケーションで独自の
bake テンプレートを作成することができます。この方法では、bake する際、コマンドラインで
``--theme`` オプションを使用していません。これを行うための最善の方法は、次のとおりです。

#. 新しいディレクトリ **/src/Template/Bake/** を作成します。
#. **vendor/cakephp/bake/src/Template/Bake/** から上書きしたいテンプレートを
   あなたのアプリケーションの中の適切なファイルにコピーします。


Bake コマンドオプションの新規作成
=================================

あなたのアプリケーションやプラグインでタスクを作成することによって、新しい bake コマンドの
オプションを追加したり、CakePHP が提供するオプションを上書きすることが可能です。
``Bake\Shell\Task\BakeTask`` を継承することで、bake は、あなたの新しいタスクを見つけて
bake の一部としてそれを含めます。

例として、任意の foo クラスを作成するタスクを作ります。
まず、 **src/Shell/Task/FooTask.php** タスクファイルを作成します。
私たちのシェルタスクが単純になるように、 ``SimpleBakeTask`` を継承します。
``SimpleBakeTask`` は抽象クラスで、どのタスクが呼ばれるか、どこにファイルを生成するか、
どのテンプレートを使用するかを bake に伝える４つのメソッドを定義することが必要です。
FooTask.php ファイルは次のようになります。 ::

    <?php
    namespace App\Shell\Task;

    use Bake\Shell\Task\SimpleBakeTask;

    class FooTask extends SimpleBakeTask
    {
        public $pathFragment = 'Foo/';

        public function name()
        {
            return 'foo';
        }

        public function fileName($name)
        {
            return $name . 'Foo.php';
        }

        public function template()
        {
            return 'foo';
        }

    }

このファイルが作成されたら、コードを生成する際に bake 使用することができるテンプレートを
作成する必要があります。 **src/Template/Bake/foo.ctp** を作成してください。
このファイルに、以下の内容を追加します。 ::

    <?php
    namespace <%= $namespace %>\Foo;

    /**
     * <%= $name %> foo
     */
    class <%= $name %>Foo
    {
        // コードを追加。
    }

これで、``bin/cake bake`` の出力に新しいタスクが表示されるはずです。
``bin/cake bake foo Example`` を実行して、新しいタスクを実行することができます。
これは、使用するアプリケーションの **src/Foo/ExampleFoo.php** で
新しい ``ExampleFoo`` クラスを生成します。

また、 ``ExampleFoo`` クラスのテストファイルを作成するために ``bake`` を呼びたい場合は、
カスタムコマンド名のクラスサフィックスと名前空間を登録するために ``FooTask`` クラスの
``bakeTest()`` メソッドをオーバーライドする必要があります。 ::

    public function bakeTest($className)
    {
        if (!isset($this->Test->classSuffixes[$this->name()])) {
          $this->Test->classSuffixes[$this->name()] = 'Foo';
        }

        $name = ucfirst($this->name());
        if (!isset($this->Test->classTypes[$name])) {
          $this->Test->classTypes[$name] = 'Foo';
        }

        return parent::bakeTest($className);
    }

* **class suffix** は ``bake`` 呼び出しで与えられた名前に追加します。前の例では、
  ``ExampleFooTest.php`` ファイルを作成します。
* **class type** は、（あなたが bake するアプリやプラグインに関連する）
  あなたのファイルを導くために使用されるサブ名前空間です。
  前の例では、名前空間 ``App\Test\TestCase\Foo`` でテストを作成します。

.. meta::
    :title lang=ja: Bake の拡張
    :keywords lang=ja: コマンドラインインターフェース,開発,bake view, bake template 構文,erb タグ,asp タグ,パーセントタグ
