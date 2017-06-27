Shell ヘルパー
##############

.. versionadded:: 3.1
    Shell ヘルパーは、3.1.0で追加されました

Shell ヘルパーは、複雑な出力生成コードをまとめられます。
Shell ヘルパーは、任意のシェルやタスクからアクセスや使用ができます。 ::

    // 表としてデータを出力
    $this->helper('Table')->output($data);

    // プラグインからヘルパーを取得
    $this->helper('Plugin.HelperName')->output($data);

また、ヘルパーのインスタンス取得や、そのインスタンスのパブリックメソッドの呼び出しができます。 :: 

    // Progress ヘルパーの取得と使用
    $progress = $this->helper('Progress');
    $progress->increment(10);
    $progress->draw();

ヘルパーの作成
==============

CakePHP は、いくつかの Shell ヘルパーを用意していますが、あなたのアプリケーションや
プラグインの中で、新たに作成することができます。
例として、装飾的なヘッダーを生成するための単純なヘルパーを作成してみましょう。
最初に **src/Shell/Helper/HeadingHelper.php** を作成し、以下のように記述します。 ::

    <?php
    namespace App\Shell\Helper;

    use Cake\Console\Helper;

    class HeadingHelper extends Helper
    {
        public function output($args)
        {
            $args += ['', '#', 3];
            $marker = str_repeat($args[1], $args[2]);
            $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
        }
    }

以下のように、あるシェルコマンドの中でこの新しいヘルパーを使用することができます。 ::

    // 両側に ### を追加
    $this->helper('Heading')->output(['It works!']);

    // 両側に ~~~~ を追加
    $this->helper('Heading')->output(['It works!', '~', 4]);


ヘルパーは、一般的に、配列のパラメーターを受け取る ``output()`` メソッドを実装します。
しかし、コンソールヘルパーは、任意の引数を持つ追加のメソッドを実装することができる普通のクラスです。

組み込みヘルパー
================

Table ヘルパー
--------------

TableHelper は、アスキーアートの表の作成を支援します。
使い方は、とてもシンプルです。 ::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $this->helper('Table')->output($data);

        // 出力結果
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Progress ヘルパー
-----------------

ProgressHelper は２つの異なる方法で利用されます。
シンプルなモードは、処理が完了するまでに呼び出されるコールバックを渡すことができます。 ::

    $this->helper('Progress')->output(['callback' => function ($progress) {
        // ここで作業します
        $progress->increment(20);
        $progress->draw();
    }]);

追加のオプションを渡すことで、プログレスバーの制御ができます。

- ``total`` プログレスバーの全アイテム数。デフォルトは 100 です。
- ``width`` プログレスバーの幅。デフォルトは 80 です。
- ``callback`` プログレスバーを更新するループ中で呼ばれるコールバック。

全てのオプションを使用した例です。 ::

    $this->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

Progress ヘルパーは、必要であればプログレスバーの増加や再描画を手動で行うことができます。 :: 

    $progress = $this->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();
