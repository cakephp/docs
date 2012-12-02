コーディング規約
################

Cakeの開発者は以下のコーディング規約を使います。

その他のCakeのコンポーネント(訳注:原文 *CakeIngredients* 、ケーキの材料のこと)の開発でも同じ規約に従うことが推奨されます。

`CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ を使って、\
コードが規約に沿っているかどうかをチェックすることができます。

新しい機能の追加
================

新しい機能は、そのテストが無い限り、追加してはなりません。
このテストはレポジトリにコミットされる前に合格する必要があります。

インデント
==========

インデントには単一のタブが用いられます。

従って、インデントはこのようになります::

    // 基本レベル
        // レベル1
            // レベル2
        // レベル1
    // 基本レベル

または::

    $booleanVariable = true;
    $stringVariable = "大鹿";
    if ($booleanVariable) {
        echo "真偽値はtrueです";
        if ($stringVariable == "大鹿") {
            echo "大鹿に遭遇しました";
        }
    }

制御構造
========

制御構造は例えば "``if``"、"``for``"、"``foreach``"、"``while``"、"``switch``"などです。
下記に、 "``if``" の例を示します::

    if ((expr_1) || (expr_2)) { 
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2; 
    } else {
        // default_action; 
    } 

*  制御構造では1個の空白が最初の丸括弧の前に、1個の空白が最後の丸括弧と開き中括弧の間にある必要があります。
*  制御構造では、必要でなくとも常に中括弧を使います。
   これはコードの可読性を高め、論理エラーが稀になります。
*  開き中括弧は制御構造と同じ行に置かれる必要があります。
   閉じ中括弧は新しい行に置かれ、制御構造と同じレベルのインデントがされている必要があります。
   中括弧内に含まれているステートメントは新しい行で始まり、その中に含まれるコードは、新しいレベルのインデントが付けられる必要があります。

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

三項演算子
----------

三項演算子は、三項演算子全体が1行に収まる場合に許容されます。
長い三項演算子は ``if else`` ステートメントに分割するべきです。
どのような場合でも、三項演算子はネストしてはいけません。
見やすさのために、丸括弧を三項の条件チェックの周りに使うことができます（任意）::

    //良い。シンプルで読みやすい
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //ネストされた三項はダメ
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

関数の呼び出し
==============

関数は、関数の名前と開き括弧の間に空白を入れて呼び出してはいけません。
関数呼び出しの引数各々に対して単一の空白がある必要があります::

    $var = foo($bar, $bar2, $bar3); 

上記をご覧の通り、イコール記号(=)の両サイドには単一の空白がある必要があります。

メソッドの定義
==============

関数の定義の例::

    function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }

デフォルトを用いた引数は、関数の定義の最後に置く必要があります。
関数は何かを、少なくともtrueかfalseを、関数呼び出しが成功したかどうかを判定できるように、返すように作ってみてください::

    function connection($dns, $persistent = false) {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this=>addError();
        }
        return true;
    }

イコール記号の両サイドには空白を置きます。

コードのコメント
================

全てのコメントは英語で書かれ、コードのコメントブロックを明確な方法で記述する必要があります。

コメントは以下の `phpDocumentor <http://phpdoc.org>`_ タグを含めることができます:

*  `@access <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.access.pkg.html>`_
*  `@author <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.author.pkg.html>`_
*  `@copyright <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.copyright.pkg.html>`_
*  `@deprecated <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.deprecated.pkg.html>`_
*  `@example <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.example.pkg.html>`_
*  `@ignore <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.ignore.pkg.html>`_
*  `@internal <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.internal.pkg.html>`_
*  `@link <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.link.pkg.html>`_
*  `@see <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.see.pkg.html>`_
*  `@since <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.since.pkg.html>`_
*  `@tutorial <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.tutorial.pkg.html>`_
*  `@version <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.version.pkg.html>`_

PhpDocタグはJavaのJavaDocタグによく似ています。
タグはドキュメントブロックの行の最初のもののみ処理されます。
例を挙げます::

    /**
     * タグの例。
     * @author このタグは解析されますが、この@versionは無視されます
     * @version 1.0 このタグも解析されます
     */

::

    /**
     * インラインphpDocタグの例。
     *
     * この関数は世界征服のためにfoo()を使って身を粉にして働きます。
     */
    function bar() {
    }
     
    /**
     * Foo function
     */
    function foo() {
    }

ファイルの最初のブロック以外のコメントブロックは、常に新しい行を先に置く必要があります。

ファイルの読み込み
==================

クラスまたはライブラリを伴うファイルを読み込む場合、
`require\_once <http://php.net/require_once>`_
関数のみを常に使用してください。

PHPタグ
=======

常にショートタグ(<? ?>)の代わりに、ロングタグ(``<?php ?>``)を使ってください。

命名規約
========

関数
----

全ての関数はキャメルバックで書いてください::

    function longFunctionName() {
    }

クラス
------

クラス名はキャメルケースで書かれる必要があります。例::

    class ExampleClass {
    }

変数
----

変数名はできる限り説明的に、しかしできる限り短くもしてください。
通常の変数は小文字で始まり、複数の単語の場合はキャメルバックで書く必要があります。
オブジェクトを含む変数は大文字で始まり、何らかの方法で変数がオブジェクトとなっているクラスに関連したものになるべきです。
例::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $Dispatcher = new Dispatcher();

メンバのアクセス権(*visibility*)
--------------------------------

メソッドと変数の為の、PHP5のprivateとprotectedキーワードを使用してください。
加えて、protectedなメソッドまたは変数の名前は単一のアンダースコア("\_")から始まります。
例::

    class A {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod() {
           /*...*/
        }
    }

privateなメソッドまたは変数の名前は二つののアンダースコア("\_\_")から始まります。
例::

    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /*...*/
        }
    }

メソッドチェーン
----------------

メソッドチェーンは複数の行にまたがる複数のメソッドとなり、単一のタブでインデントする必要があります::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

アドレスの例示
--------------

全てのURLとメールアドレスの例には、「example.com」、「example.org」、「example.net」を使用してください。
例を挙げます:

*  Eメール: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

``example.com`` ドメインはこの(:rfc:`2606` をみてください)為に予約されており、ドキュメント中か例として使うことが推奨されています。

ファイル
--------

クラスを含まないファイルの名前は、小文字でアンダースコア化される必要があります。例:

::

    long_file_name.php

変数の型
--------

ドキュメントブロックの中で使う変数の型:

型
    説明
mixed
    未定義(または複数)の型の変数。
integer
    Integer型の変数(整数)。
float
    Float型(小数点数)。
boolean
    論理型(trueまたはfalse)。
string
    文字列型(""か' 'に入る値)。
array
    配列型。
object
    オブジェクト型。
resource
    リソース型(例えばmysql\_connect()による返り値)。
    型をmixedに指定する場合、不明(*unknown*)なのか、取りうる型が何なのかを指し示すべきということを覚えていてください。

定数
----

定数は大文字で定義する必要があります。

::

    define('CONSTANT', 1);

もし定数の名前が複数の単語でできている場合は、アンダースコア文字によって分割する必要があります。
例:

::

    define('LONG_NAMED_CONSTANT', 2);
