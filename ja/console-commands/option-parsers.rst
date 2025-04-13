オプションパーサー
##################

.. php:namespace:: Cake\Console
.. php:class:: ConsoleOptionParser

コンソールアプリケーションは通常、端末からコマンドに情報を得るための主要な手段として
オプションと引数を受け取ります。

OptionParser の定義
===================

コマンドとシェルは ``buildOptionParser($parser)`` フックメソッドを提供します。
このメソッドを使用して、コマンドのオプションと引数を定義できます。 ::

    protected function buildOptionParser($parser)
    {
        // オプションと引数を定義

        // 完成したパーサーを返します
        return $parser;
    }

シェルクラスは ``getOptionParser()`` フックメソッドを使ってオプションパーサーを定義します。 ::

    public function getOptionParser()
    {
        // フレームワークから空のパーサーを取得
        $parser = parent::getOptionParser();

        // オプションと引数を定義

        // 完成したパーサーを返します
        return $parser;
    }

引数の使用
==========

.. php:method:: addArgument($name, $params = [])

コマンドラインツールにおいて、位置引数 (指定順序が意味を持つ引数) はよく使われます。
``ConsoleOptionParser`` では位置引数を要求するだけでなく定義することもできます。
指定する際は ``$parser->addArgument();`` で一度にひとつずつ設定するか、
``$parser->addArguments();`` で複数個を同時に指定するかを選べます。 ::

    $parser->addArgument('model', ['help' => 'bake するモデル']);

引数を作成する際は、以下のオプションが指定できます。

* ``help`` この引数に対して表示するヘルプ。
* ``required`` この引数が必須かどうか。
* ``index`` 引数のインデックス。設定されない場合は引数リストの末尾に位置づけられます。
  同じインデックスを２回指定すると、最初に指定したオプションは上書きされます。
* ``choices`` この引数について有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

必須であると指定された引数が省略された場合、コマンドのパースにおいて例外が発生します。
これにより、引数のチェックをシェルの中で行う必要がなくなります。

複数の引数の追加
----------------

.. php:method:: addArguments(array $args)

複数の引数を１個の配列で持つ場合、 ``$parser->addArguments()`` により
一度に複数の引数を追加できます。 ::


    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true]
    ]);

ConsoleOptionParser 上のすべてのビルダーメソッドと同様に、
addArguments も強力なメソッドチェーンの一部として使えます。

引数の検証
----------

位置引数を作成する場合、 ``required`` フラグを使用して、シェルが呼び出されたときに
引数が存在しなければならないことを示すことができます。さらに ``choices`` を使うことで、
その引数が取りうる有効な値の選択肢を制限できます。 ::

    $parser->addArgument('type', [
        'help' => 'これとやり取りするノードの型。',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

この例では、必須でかつ入力時に値の正当性チェックが行われるような引数を作成します。
引数が指定されないか、または無効な値が指定された場合は例外が発生してシェルが停止します。

オプションの利用
================

.. php:method:: addOption($name, $options = [])

オプションまたはフラグは、コマンドラインツールで使用され、コマンドの順序付けられていない
キーと値の引数を提供します。オプションは、長い名前と短い別名の両方を定義できます。
値を受け取ったり (例えば ``--connection=default``)、
ブール値のオプション (``-verbose`` など) を使うことができます。
オプションは、 ``addOption()`` メソッドで定義されます。 ::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

この例の場合、シェルを起動する際に ``cake myshell --connection=other``,
``cake myshell --connection other``, ``cake myshell -c other``
のいずれかで引数を指定できます。

またブール型のスイッチも作れますが、これらのスイッチは値を消費せず、
またその存在はパースされた引数の中だけとなります。 ::

    $parser->addOption('no-commit', ['boolean' => true]);

このオプション指定の場合、 ``cake myshell --no-commit something`` のようにコールされると
no-commit 引数が ``true`` になり、'something' は位置引数と見なされます。

オプションを作成する場合、オプションの振る舞いを定義するのに以下が指定できます。

* ``short`` - このオプションを表す１文字の別名。未定義の場合はなしになります。
* ``help`` - このオプションのヘルプ文字列。オプションのヘルプを生成する際に参照されます。
* ``default`` - このオプションのデフォルト値。未定義の場合、デフォルト値は ``true`` となります。
* ``boolean`` - 値を持たない単なるブール型のスイッチ。デフォルト値は ``false`` です。
* ``choices`` - このオプションで取りうる有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

複数オプションの追加
--------------------

.. php:method:: addOptions(array $options)

複数の引数を１個の配列で持つ場合、 ``$parser->addOptions()`` により
一度に複数のオプションを追加できます。 ::


    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

ConsoleOptionParser 上のビルダーメソッドと同様に、addOptions も強力なメソッドチェーンの
一部として使えます。

オプション値は、 ``$this->params`` 配列に格納されます。また、存在しないオプションにアクセスした時の
エラーを回避するために便利なメソッド ``$this->param()`` を使用することができます。

オプションの検証
----------------

オプションでは位置引数と同様に、値の選択肢を指定できます。
オプションに choices が指定されている場合、それらがそのオプションで取りうる有効な値です。
これ以外の値が指定されると ``InvalidArgumentException`` が発生します。 ::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine']
    ]);

ブール型オプションの使用
------------------------

フラグのオプションを作りたい場合、オプションをブール型として指定できます。
デフォルト値を持つオプションのように、ブール型のオプションもパース済み引数の中に常に
自分自身を含んでいます。フラグが存在する場合それらは ``true`` にセットされ、
存在しない場合は ``false`` になります。 ::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

次のオプションは、解析されたパラメータに常に値を持ちます。
その値が含まれていない場合、デフォルト値は ``false`` になり、定義されていれば ``true`` になります。

配列から ConsoleOptionParser の構築
-----------------------------------

.. php:method:: buildFromArray($spec)

前述のように、サブコマンドのオプションパーサーを作成する際は、そのメソッドに対する
パーサーの仕様を配列として定義できます。
これによりすべてが配列として扱えるので、サブコマンドパーサーの構築が容易になります。 ::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]
    ]);

パーサーの仕様の中では ``arguments``, ``options``, ``description`` そして ``epilog`` のための
キーを定義できます。配列形式ビルダーの内部には ``subcommands`` は定義できません。
引数とオプションの値は、 :php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` や
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` が利用する書式に従ってください。
buildFromArray を単独で使ってオプションパーサーを構築することも可能です。 ::

    public function getOptionParser()
    {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]);
    }

オプションパーサーのマージ
--------------------------

.. php:method:: merge($spec)

group コマンドを構築する場合、おそらく、いくつかのパーサーを組み合わせたいでしょう。 ::


    $parser->merge($anotherParser);

各パーサーの引数の順序が同じでなければならないこと、およびオプションは、動作するために互換性が
なければならないことに注意してください。ですので、別のキーを使用しないでください。

シェルからヘルプを取得
======================

オプションパーサーでオプションと引数を定義することで、CakePHP は基本的なヘルプ情報を自動的に生成し、
それぞれのコマンドに ``--help`` と ``-h`` を追加することができます。
これらのオプションのいずれかを使用すると、生成されたヘルプの内容を見ることができます。

.. code-block:: console

    bin/cake bake --help
    bin/cake bake -h

このいずれでも bake のヘルプを生成します。ネストされたコマンドのヘルプを表示することもできます。

.. code-block:: console

    bin/cake bake model --help
    bin/cake bake model -h

これは bake の model コマンドに関するヘルプを表示します。

ヘルプを XML で取得
-------------------

自動ツールや開発ツールをビルドするのに CakePHP のシェルとの対話処理を必要とする場合、
ヘルプを機械がパースできる形式で取得できると便利です。
ConsoleOptionParser に以下の引数を追加することで、ヘルプを xml で出力できます。

.. code-block:: console

    cake bake --help xml
    cake bake -h xml

この例は生成されたヘルプ、オプション、引数そして選択されたシェルのサブコマンドに関するドキュメントを
XML で返します。XML ドキュメントの例としては以下のようになります。

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

ヘルプの出力をカスタマイズ
==========================

説明文とエピローグを追加することで、生成されたヘルプの内容をさらに充実させることができます。

説明文の設定
------------

.. php:method:: setDescription($text)

オプションパーサーの説明文を取得または設定します。説明文は引数やオプションの上に表示されます。
配列または文字列を渡すことで説明文の値を設定できます。引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->setDescription(['１行目', '２行目']);
    // 3.4 より前
    $parser->description(['１行目', '２行目']);

    // 現在の値を取得する
    $parser->getDescription();

エピローグの設定
----------------

.. php:method:: setEpilog($text)

オプションパーサーのエピローグを取得または設定します。
エピローグは、引数とオプションの情報の後に表示されます。
配列または文字列を渡すことで、エピローグの値を設定することができます。
引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->setEpilog(['１行目', '２行目']);
    // 3.4 より前
    $parser->epilog(['１行目', '２行目']);

    // 現在の値を取得する
    $parser->getEpilog();

サブコマンドの追加
------------------

.. php:method:: addSubcommand($name, $options = [])

コンソールアプリケーションはサブコマンドから構成されることも多いのですが、サブコマンド側で
特別なオプション解析や独自ヘルプを持ちたいこともあります。この完全な例が ``bake`` です。
Bake は多くの別々のタスクから構成されますが、各タスクはそれぞれ独自のヘルプとオプションを持っています。
``ConsoleOptionParser`` を使ってサブコマンドを定義し、それらに固有のオプションパーサーを提供できるので、
シェルはそれぞれのタスクについてコマンドをどう解析すればよいのかを知ることができます。 ::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

上の例では、シェルのタスクに対してヘルプやそれに特化したオプションパーサーの提供方法を示しています。
タスクの ``getOptionParser()`` を呼ぶことで、オプションパーサーの複製をしたり、シェル内の関係を
調整する必要がなくなります。この方法でサブコマンドを追加することには２つの利点があります。
まず生成されたヘルプの中で簡単にサブコマンドを文書化できること、そしてサブコマンドのヘルプに簡単に
アクセスできることです。前述のやり方で生成したサブコマンドを使って ``cake myshell --help`` とやると、
サブコマンドの一覧が出ます。また ``cake myshell model --help`` とやると、model タスクだけの
ヘルプが表示されます。

.. note::

    シェルはサブコマンドを定義すると、すべてのサブコマンドは、明示的に定義する必要があります。

サブコマンドを定義する際は、以下のオプションが使えます。

* ``help`` - サブコマンドのヘルプテキスト。
* ``parser`` - サブコマンドの ConsoleOptionParser。
  これによりメソッド固有のオプションパーサーを生成します。
  サブコマンドに関するヘルプが生成される際、もしパーサーが存在すればそれが使われます。
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()` と
  互換性のある配列としてパーサーを指定することができます。

サブコマンドの追加は、強力なメソッドチェーンの一部として使えます。
