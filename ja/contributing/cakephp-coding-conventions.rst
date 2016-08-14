コーディング規約
################

CakePHP の開発者はコーディング規約として下記のルールに加え、 `PSR-2 coding style guide
<http://www.php-fig.org/psr/psr-2/>`_ にも従って頂くことになります。

その他の CakePHP プラグイン等 (訳注:原文 *CakeIngredients* 、ケーキの材料のこと)
の開発でも同じ規約に従うことが推奨されます。

`CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ を使って、
コードが規約に沿っているかどうかをチェックすることができます。

新しい機能の追加
================

新しい機能は、そのテストが無い限り、追加してはいけません。
このテストはレポジトリにコミットされる前にパスする必要があります。

インデント
==========

インデントには４つの空白を用います。

従って、インデントはこのようになります。 ::

    // 基本レベル
        // レベル1
            // レベル2
        // レベル1
    // 基本レベル

または::

    $booleanVariable = true;
    $stringVariable = '大鹿';
    if ($booleanVariable) {
        echo '真偽値は true です';
        if ($stringVariable === '大鹿') {
            echo '大鹿に遭遇しました';
        }
    }

あなたが、複数行にわたる関数呼び出しを使用している場合、以下のガイドラインに従ってください。

*  複数行にわたる関数呼び出しのカッコを開く時には、行末になければなりません。
*  複数行にわたる関数呼び出しの中の１行ごとに１引数のみ許可します。
*  複数行にわたる関数呼び出しの閉じカッコは、１行にしなければなりません。

例として、以下の形式が使用されていた場合、 ::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

代わりに以下を使用してください。 ::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

行の長さ
===========

コードを読みやすくするために、だいたい 100 文字程度の長さで改行することを推奨します。
行を 120 文字より長くしてはいけません。

要約すると:

* 100 文字がソフトな制限
* 120 文字がハードな制限

制御構造
========

制御構造は例えば "``if``"、"``for``"、"``foreach``"、"``while``"、"``switch``"などです。
下記に、 "``if``" の例を示します。 ::

    if ((expr_1) || (expr_2)) {
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2;
    } else {
        // default_action;
    }

*  制御構造では1個の空白が最初の丸括弧の前に、1個の空白が最後の丸括弧と開き中括弧の間にある必要があります。
*  制御構造では、必要でなくとも常に中括弧を使います。
   これはコードの可読性を高め、論理エラーが発生しにくくなります。
*  開き中括弧は制御構造と同じ行に置かれる必要があります。閉じ中括弧は新しい行に置かれ、
   制御構造と同じレベルのインデントがされている必要があります。中括弧内に含まれているステートメントは
   新しい行で始まり、その中に含まれるコードは、新しいレベルのインデントが付けられる必要があります。
* インラインの代入は、制御構造の中で使用するべきではありません。

::

    // 間違い＝中括弧が無い、ステートメントの場所が悪い
    if (expr) statement;

    // 間違い＝中括弧が無い
    if (expr)
        statement;

    // よろしい
    if (expr) {
        statement;
    }

    // 間違い＝インラインの代入
    if ($variable = Class::function()) {
        statement;
    }

    // よろしい
    $variable = Class::function();
    if ($variable) {
        statement;
    }


三項演算子
----------

三項演算子は、三項演算子全体が1行に収まる場合に許容されます。
長い三項演算子は ``if else`` ステートメントに分割するべきです。
どのような場合でも、三項演算子はネストしてはいけません。
見やすさのために、丸括弧を三項の条件チェックの周りに使ってもかまいません。 ::

    //良い。シンプルで読みやすい
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //ネストされた三項はダメ
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


テンプレートファイル
------------------------

テンプレートファイル (拡張子が .ctp のファイル) 内では、開発者は、キーワードの制御構造を使用する
必要があります。キーワードの制御構造を使うと、複雑なテンプレートファイルが読みやすくなります。
制御構造は、大きい PHP ブロック内、または別々の PHP タグに含めることができます。 ::

    <?php
    if ($isAdmin):
        echo '<p>You are the admin user.</p>';
    endif;
    ?>
    <p>The following is also acceptable:</p>
    <?php if ($isAdmin): ?>
        <p>You are the admin user.</p>
    <?php endif; ?>


比較
====

値の比較は、常に可能な限り厳密に行うようにしてください。もし厳格でないテストが意図的なものであれば、
混乱を避けるためにコメントを残しておいたほうがいいかもしれません。

変数がnullかどうかのテストの場合は、厳密なチェックを使用することを推奨します。 ::

    if ($value === null) {
    	  // ...
    }

チェック対象の値は右側に配置してください。 ::

    // 非推奨
    if (null === $this->foo()) {
        // ...
    }

    // 推奨
    if ($this->foo() === null) {
        // ...
    }

関数の呼び出し
==============

関数は、関数の名前と開き括弧の間に空白を入れて呼び出してはいけません。
関数呼び出しの引数各々に対して単一の空白がある必要があります。 ::

    $var = foo($bar, $bar2, $bar3);

上記をご覧の通り、イコール記号 (=) の両サイドには単一の空白がある必要があります。

メソッドの定義
==============

メソッドの定義の例::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }
        return $var;
    }

デフォルトを用いた引数は、関数の定義の最後に置く必要があります。関数は何かを、少なくとも true か
false を、関数呼び出しが成功したかどうかを判定できるように、返すように作ってみてください。 ::

    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this->addError();
        }
        return true;
    }

イコール記号の両サイドには空白を置きます。

タイプヒンティング
------------------

オブジェクトや配列を期待する引数はタイプヒンティングを指定することができます。
しかしながらタイプヒンティングはコストフリーではないので、public メソッドにだけ指定します。 ::

    /**
     * メソッドの説明。
     *
     * @param \Cake\ORM\Table $table 使用するテーブルクラス
     * @param array $array 配列。
     * @param callable $callback コールバック。
     * @param boolean $boolean 真偽値。
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

ここで ``$table`` は ``\Cake\ORM\Table`` のインスタンスで、また ``$array`` は ``array``
でなければならず、 ``$callback`` は ``callback`` (有効なコールバック) 型でなければなりません。

ちなみに、もし ``$array`` が ``\ArrayObject`` のインスタンスでも受け付けるようにしたい場合は、
``array`` のタイプヒントを指定してプリミティブ型だけを受け入れるようにするべきではありません。 ::

    /**
     * メソッドの説明。
     *
     * @param array|\ArrayObject $array 配列。
     */
    public function foo($array)
    {
    }

無名関数 (クロージャ)
------------------------------

無名関数の定義は `PSR-2
<http://www.php-fig.org/psr/psr-2/>`_ コーディングスタイルガイドに従ってください。
そこでは `function` キーワードの後ろに空白１つ、 `use` キーワードの前後に空白１つずつが
必要であると宣言されています。 ::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // code
    };

メソッドチェーン
================

メソッドチェーンは複数の行にまたがる複数のメソッドとなり、空白４つでインデントする必要があります。 ::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

コードのコメント
================

全てのコメントは英語で書かれ、コードのコメントブロックを明確な方法で記述する必要があります。

コメントは以下の `phpDocumentor <http://phpdoc.org>`_ タグを含めることができます。

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   ``@version <vector> <description>`` 形式を使用して、 ``version`` と ``description`` は必須です。
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

PhpDoc タグは Java の JavaDoc タグによく似ています。
タグはドキュメントブロックの行の最初のもののみ処理されます。
例::

    /**
     * タグの例。
     *
     * @author このタグは解析されますが、この @version は無視されます
     * @version 1.0 このタグも解析されます
     */

::

    /**
     * インライン phpDoc タグの例。
     *
     * この関数は世界征服のために foo() を使って身を粉にして働きます。
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Foo function.
     *
     * @return void
     */
    function foo()
    {
    }

ファイルの最初のブロック以外のコメントブロックは、常に新しい行を先に置く必要があります。

変数の型
--------------

ドキュメントブロックで使う変数の型:

型名
    説明
mixed
    型が定義されていない(もしくは複数定義されている)変数。
int
    Integer 型の変数 (整数)。
float
    Float 型 (小数点のある数値)。
bool
    論理型 (true または false)。
string
    String 型 (" " や ' ' で囲まれるすべての値)。
null
    Null 型。通常は他の型と一緒に使われる。
array
    配列型。
object
    オブジェクト型。可能なら特定のクラス名を指定するべきです。
resource
    リソース型 (例えば mysql\_connect() の戻り値)。型を mixed に指定する場合、
    不明 (*unknown*) なのか、取りうる型が何なのかを指し示すべきということを覚えていてください。
callable
    呼び出し可能な関数。

パイプ文字を使って型を組合せます。 ::

    int|bool

３つ以上の型の場合は ``mixed`` を使うほうが最良です。

チェーンのように自分自身のオブジェクトを返すような場合は代わりに ``$this`` を使ってください。 ::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

ファイルの読み込み
==================

``include`` 、 ``require`` 、 ``include_once`` そして ``require_once`` は括弧を付けません。 ::

    // 間違い = 括弧あり
    require_once('ClassFileName.php');
    require_once ($class);

    // よろしい = 括弧なし
    require_once 'ClassFileName.php';
    require_once $class;

クラスまたはライブラリを伴うファイルを読み込む場合、
`require\_once <http://php.net/require_once>`_
関数のみを常に使用してください。

PHP タグ
========

常にショートタグ (``<? ?>``) の代わりに、ロングタグ (``<?php ?>``) を使ってください。
テンプレートファイル (**.ctp**) の中では適宜、ショート Echo を使ってください。

ショート Echo
------------------

ショート Echo はテンプレートファイルの中で ``<?php echo`` の代わりに使ってください。開きタグ、
空白１つ、 変数もしくは ``echo`` とその引数、半角１つ、閉じタグのように記述してください。 ::

    // ダメ = セミコロンがあり、空白もない
    <td><?=$name;?></td>

    // OK = 空白があり、セミコロンもない
    <td><?= $name ?></td>

PHP 5.4 以降、ショート Echo タグ (``<?=``) はもはや 'ショートタグ' とは見なされず、
ini ディレクティブの ``short_open_tag`` にかかわらず有効となります。


命名規約
========

関数
----

全ての関数はキャメルバックで書いてください::

    function longFunctionName()
    {
    }

クラス
------

クラス名はキャメルケースで書かれる必要があります。例::

    class ExampleClass
    {
    }

変数
----

変数名はできる限り説明的に、しかしできる限り短くもしてください。すべての変数は小文字で始まり、
複数の単語の場合はキャメルバックで書く必要があります。オブジェクトを参照する変数は、
何らかの方法で変数がオブジェクトとなっているクラスに関連したものになるべきです。例::

    $user = 'John';
    $users = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

メンバのアクセス権(*visibility*)
--------------------------------

メソッドと変数には、PHP5 の private と protected キーワードを指定してください。
加えて、非 public なメソッドまたは変数の名前は単一のアンダースコア (``_``) から始めます。
例::

    class A
    {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod()
        {
           /* ... */
        }

        private $_iAmAPrivateVariable;

        private function _iAmAPrivateMethod()
        {
            /* ... */
        }
    }

アドレスの例示
--------------

全ての URL とメールアドレスの例には、「example.com」、「example.org」、
「example.net」を使用してください。例を挙げます:

*  Eメール: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

"example.com" ドメインはこの (:rfc:`2606` を見てください) 為に予約されており、
ドキュメント内の説明や例として使うことが推奨されています。

ファイル
--------

クラスを含まないファイルの名前は、小文字でアンダースコア化される必要があります。例::

    long_file_name.php


キャスト
--------

次のキャストを使用します:

型
    説明
(bool)
    boolean にキャスト。
(int)
    integer にキャスト。
(float)
    float にキャスト。
(string)
    string にキャスト。
(array)
    array にキャスト。
(object)
    object にキャスト。

できるなら ``intval($var)`` よりも ``(int)$var`` を、
``floatval($var)`` よりも ``(float)$var`` を使ってください。

定数
----

定数は大文字で定義する必要があります。 ::

    define('CONSTANT', 1);

もし定数の名前が複数の単語でできている場合は、アンダースコア文字によって分割する必要があります。
例::

    define('LONG_NAMED_CONSTANT', 2);

empty()/isset() の使用に注意
============================

``empty()`` は、使いやすい関数ですが、エラーの隠蔽と ``'0'`` や ``0`` が与えられた際に
意図しない効果を引き起こします。変数やプロパティがすでに定義されていた場合、 ``empty()``
の利用は推奨されません。変数を操作する際、``empty()`` の代わりに boolean 型への
強制変換に頼る方が良いです。 ::

    function manipulate($var)
    {
	// 推奨しません。 $var はすでにスコープ内で定義されています。
        if (empty($var)) {
            // ...
        }

        // boolean 型への強制変換を使用。
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

定義されたプロパティを扱っている際、 ``empty()``/``isset()`` チェックよりも
``null`` チェックを優先してください。 ::

    class Thing
    {
        private $property; // 定義済み

        public function readProperty()
        {
	    // プロパティは、クラスで定義されているので、推奨しません。
            if (!isset($this->property)) {
                // ...
            }
            // 推奨します。
            if ($this->property === null) {

            }
        }
    }

配列を操作する際、 ``empty`` チェックを使うよりも、デフォルト値をマージする方が良いです。
デフォルト値をマージすることによって、必要なキーが定義されることを保証できます。 ::

    function doWork(array $array)
    {
	// empty チェックを避けるためにデフォルト値をマージ
        $array += [
            'key' => null,
        ];

	// 推奨しません。キーはすでにセットされています。
        if (isset($array['key'])) {
            // ...
        }

        // 推奨します。
        if ($array['key'] !== null) {
            // ...
        }
    }

.. meta::
    :title lang=ja: コーディング規約
    :keywords lang=ja: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers
