コーディング規約
#################

CakePHP の開発者は以下のコーディング規約を使います。

その他の CakePHP プラグイン等 (訳注:原文 *CakeIngredients* 、ケーキの材料のこと)
の開発でも同じ規約に従うことが推奨されます。

`CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ を使って、
コードが規約に沿っているかどうかをチェックすることができます。

言語
=====

全てのコードやコメントは、英語で書かなければなりません。

新しい機能の追加
=================

新しい機能は、そのテストが無い限り、追加してはいけません。
このテストはレポジトリにコミットされる前にパスする必要があります。

インデント
===========

インデントには単一のタブが用いられます。

従って、インデントはこのようになります。 ::

    // 基本レベル
        // レベル1
            // レベル2
        // レベル1
    // 基本レベル

または、 ::

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
=========

コードを読みやすくするために、だいたい 100 文字程度の長さで改行することを推奨します。
行を 120 文字より長くしてはいけません。

要約すると:

* 100 文字がソフトな制限
* 120 文字がハードな制限

制御構造
=========

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
-----------

三項演算子は、三項演算子全体が1行に収まる場合に許容されます。
長い三項演算子は ``if else`` ステートメントに分割するべきです。
どのような場合でも、三項演算子はネストしてはいけません。
見やすさのために、丸括弧を三項の条件チェックの周りに使ってもかまいません。 ::

    //良い。シンプルで読みやすい
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //ネストされた三項はダメ
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


ビューファイル
---------------

ビューファイル (拡張子が .ctp のファイル) 内では、開発者は、キーワードの制御構造を使用する
必要があります。キーワードの制御構造を使うと、複雑なビューファイルが読みやすくなります。
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

.ctp ファイルの末尾に PHP の終了タグ (``?>``) を使用できます。

比較
=====

値の比較は、常に可能な限り厳密に行うようにしてください。もし厳格でないテストが意図的なものであれば、
混乱を避けるためにコメントを残しておいたほうがいいかもしれません。

変数が null かどうかのテストの場合は、厳密なチェックを使用することを推奨します。 ::

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
===============

関数は、関数の名前と開き括弧の間に空白を入れて呼び出してはいけません。
関数呼び出しの引数各々に対して単一の空白がある必要があります。 ::

    $var = foo($bar, $bar2, $bar3);

上記をご覧の通り、イコール記号 (=) の両サイドには単一の空白がある必要があります。

メソッドの定義
===============

メソッドの定義の例::

    public function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }

デフォルトを用いた引数は、関数の定義の最後に置く必要があります。
関数は何かを、少なくとも ``true`` か ``false`` を、
関数呼び出しが成功したかどうかを判定できるように、返すように作ってみてください。 ::

    public function connection($dns, $persistent = false) {
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
     * @param Model $Model 使用するモデル。
     * @param array $array 配列。
     * @param boolean $boolean 真偽値。
     */
    public function foo(Model $Model, array $array, $boolean) {
    }

ここで ``$Model`` は ``Model`` のインスタンスで、また ``$array`` は ``array`` でなければなりません。

ちなみに、もし ``$array`` が ``ArrayObject`` のインスタンスでも受け付けるようにしたい場合は、
``array`` のタイプヒントを指定してプリミティブ型だけを受け入れるようにするべきではありません。::

    /**
     * メソッドの説明。
     *
     * @param array|ArrayObject $array 配列。
     */
    public function foo($array) {
    }

メソッドチェーン
================

メソッドチェーンは複数の行にまたがる複数のメソッドとなり、
単一のタブでインデントする必要があります。 ::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

ドキュメントブロック
====================

全てのコメントは英語で書かれ、コードのコメントブロックを明確な方法で記述する必要があります。

ファイルヘッダのドキュメントブロック
------------------------------------

全ての PHP ファイルは、以下のようにファイルヘッダのドキュメントブロックが
含まれていなければなりません。 ::

    <?php
    /**
    * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
    * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
    *
    * Licensed under The MIT License
    * For full copyright and license information, please see the LICENSE.txt
    * Redistributions of files must retain the above copyright notice.
    *
    * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
    * @link          https://cakephp.org CakePHP(tm) Project
    * @since         X.Y.Z
    * @license       http://www.opensource.org/licenses/mit-license.php MIT License
    */

コメントは以下の `phpDocumentor <https://phpdoc.org>`_ タグを含めることができます。

*  `@copyright <https://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@license <https://phpdoc.org/docs/latest/references/phpdoc/tags/license.html>`_

クラスのドキュメントブロック
----------------------------

クラスのドキュメントブロックは以下の通り::

    /**
     * Short description of the class.
     *
     * Long description of class.
     * Can use multiple lines.
     *
     * @deprecated 3.0.0 Deprecated in 2.6.0. Will be removed in 3.0.0. Use Bar instead.
     * @see Bar
     * @link https://book.cakephp.org/2.0/en/foo.html
     */
    class Foo {

    }

クラスのドキュメントブロックは、以下の `phpDocumentor <https://phpdoc.org>`_ タグを
含めることができます。

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   ``@version <vector> <description>`` 形式を使用して、 ``version`` と ``description`` は必須です。
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@property <https://phpdoc.org/docs/latest/references/phpdoc/tags/property.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@uses <https://phpdoc.org/docs/latest/references/phpdoc/tags/uses.html>`_

プロパティのドキュメントブロック
--------------------------------

プロパティのドキュメントブロックは以下の通り。 ::

    /**
     * @var string|null Description of property.
     *
     * @deprecated 3.0.0 Deprecated as of 2.5.0. Will be removed in 3.0.0. Use $_bla instead.
     * @see Bar::$_bla
     * @link https://book.cakephp.org/2.0/en/foo.html#properties
     */
    protected $_bar = null;

プロパティのドキュメントブロックは、以下の `phpDocumentor <https://phpdoc.org>`_ タグを
含めることができます。

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   ``@version <vector> <description>`` を使用して、 ``version`` と ``description`` は必須です。
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@var <https://phpdoc.org/docs/latest/references/phpdoc/tags/var.html>`_

メソッド/関数のドキュメントブロック
-----------------------------------

メソッドと関数のドキュメントブロックは以下の通り::


    /**
     * Short description of the method.
     *
     * Long description of method.
     * Can use multiple lines.
     *
     * @param string $param2 first parameter.
     * @param array|null $param2 Second parameter.
     * @return array An array of cakes.
     * @throws Exception If something goes wrong.
     *
     * @link https://book.cakephp.org/2.0/en/foo.html#bar
     * @deprecated 3.0.0 Deprecated as of 2.5.0. Will be removed in 3.0.0. Use Bar::baz instead.
     * @see Bar::baz
     */
     public function bar($param1, $param2 = null) {
     }

メソッドと関数のドキュメントブロックは、以下の `phpDocumentor <https://phpdoc.org>`_ タグを
含めることができます。

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   ``@version <vector> <description>`` 形式を使用して、 ``version`` と ``description`` は必須です。
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@param <https://phpdoc.org/docs/latest/references/phpdoc/tags/param.html>`_
*  `@return <https://phpdoc.org/docs/latest/references/phpdoc/tags/return.html>`_
*  `@throws <https://phpdoc.org/docs/latest/references/phpdoc/tags/throws.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@uses <https://phpdoc.org/docs/latest/references/phpdoc/tags/uses.html>`_

変数の型
---------

ドキュメントブロック中で使用する変数の型は:

型
    説明
mixed
    未定義 (もしくは複数) の型の変数。
int
    integer 型の変数 (整数)。
float
    float 型 (浮動小数点数)。
bool
    論理型 (true か false)。
string
    文字列型。(" " や ' ' で囲まれた値)
null
    ヌル型。通常、他の型と併用します。
array
    配列型。
object
    オブジェクト型。可能であれば定義されたクラス名が使用されるべきです。
resource
    リソース型 (例えば mysql\_connect() の戻り値)。型を mixied に指定する場合、
    不明 (*unknown*) なのか取りうる型なのかを示すべきであることを覚えておいてください。
callable
    呼び出し可能な関数。

パイプ文字列を使って型を組合わせます。 ::

    int|bool

3つ以上の型の場合は、 ``mixed`` を使うほうが最良です。

チェーンのように自分自身のオブジェクトを返すような場合は代わりに ``$this`` を使ってください。 ::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo() {
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
`require\_once <https://secure.php.net/require_once>`_
関数のみを常に使用してください。

PHP タグ
========

常にショートタグ (``<? ?>``) の代わりに、ロングタグ (``<?php ?>``) を使ってください。

命名規約
========

関数
----

全ての関数はキャメルバックで書いてください。 ::

    function longFunctionName() {
    }

クラス
------

クラス名はキャメルケースで書かれる必要があります。例::

    class ExampleClass {
    }

変数
----

変数名はできる限り説明的に、しかしできる限り短くもしてください。すべての変数は小文字で始まり、
複数の単語の場合はキャメルバックで書く必要があります。オブジェクトを参照する変数は、
何らかの方法で変数がオブジェクトとなっているクラスに関連したものになるべきです。例::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $dispatcher = new Dispatcher();

メンバのアクセス権(*visibility*)
--------------------------------

メソッドと変数の為の、PHP5 の private と protected キーワードを使用してください。
加えて、protected なメソッドまたは変数の名前は単一のアンダースコア (``_``) から始まります。
例::

    class A {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod() {
           /*...*/
        }
    }

private なメソッドまたは変数の名前は二つののアンダースコア (``__``) から始まります。
例::

    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /*...*/
        }
    }

private なメソッドまたは変数を回避し、protected なそれらを用いることを試してみて下さい。
後者はサブクラスからアクセスや修正が可能です。一方で、private では拡張や再利用ができません。
private は、テストの実施もより難しくなります。

アドレスの例示
--------------

全ての URL とメールアドレスの例には、"example.com"、"example.org"、
"example.net" を使用してください。例:

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

できれば、 ``intval($var)`` の代わりに ``(int)$var`` 、
``floatval($var)`` の代わりに ``(float)$var`` を使用してください。

定数
----

定数は大文字で定義する必要があります。 ::

    define('CONSTANT', 1);

もし定数の名前が複数の単語でできている場合は、アンダースコア文字によって分割する必要があります。
例::

    define('LONG_NAMED_CONSTANT', 2);


.. meta::
    :title lang=ja: コーディング規約
    :keywords lang=ja: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers
