String
######

String
クラスは文字列の作成や操作に便利なメソッドを含み、スタティックにアクセスできます。例:
``String::uuid()``

uuid
====

uuid メソッドは `RFC 4122 <https://www.ietf.org/rfc/rfc4122.txt>`_
にもとづきユニークな識別子を作成するために使用します。 uuid とは
485fc381-e790-47a3-9794-1337c0a8fe68
というフォーマットの128ビットの文字列のことです。

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound
= ')')

文字列を $separator を用いてトークン化します。 ``$leftBound`` と
``$rightBound`` の間にある ``$separator`` のインスタンスは無視されます。

insert
======

string insert ($string, $data, $options = array())

insert
メソッドは、文字列のテンプレートを生成し、キー/値の置換をするために使用されます。

::

    String::insert('My name is :name and I am :age years old.', array('name' => 'Bob', 'age' => '65'));
    // "My name is Bob and I am 65 years old." を生成します。

cleanInsert
===========

string cleanInsert ($string, $options = array())

$options 内の 'clean' キーに従って指定された $options を使用して
Set::insert
でフォーマットした文字列をきれいにします。デフォルトのメソッドは text
ですが、html も有効です。この関数の目的は、Set::insert
で置換されない、すべてのスペース文字やプレースホルダー周辺の不必要なマークアップを置換することです。

以下のオプションをoptions配列で使うことが出来ます。

::

    $options = array(
        'clean' => array(
            'method' => 'text', // or html
        ),

        'before' => '',
        'after' => ''
    );

