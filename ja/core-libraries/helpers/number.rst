NumberHelper
############

.. php:class:: NumberHelper(View $view, array $settings = array())

NumberHelper は、ビューの中で一般的な書式で数値を表示するための
便利なメソッドを持っています。これらのメソッドは、通貨、パーセンテージ、データサイズ、
指定した精度に整えられた数値へのフォーマットや、他にもより柔軟に数値のフォーマットを行います。

.. versionchanged:: 2.1
   ``NumberHelper`` は、 ``View`` レイヤーの外でも簡単に使えるように :php:class:`CakeNumber`
   クラスにリファクタリングされました。ビューの中で、これらのメソッドは ``NumberHelper`` クラスを経由して
   アクセス可能です。通常のヘルパーメソッドを呼ぶように呼び出せます:
   ``$this->Number->method($args);`` 。

.. include:: ../../core-utility-libraries/number.rst
    :start-after: start-cakenumber
    :end-before: end-cakenumber

.. warning::

    2.4 から、シンボルは UTF-8 になりました。もし、非 UTF-8 アプリを実行する場合、
    詳しくは移行ガイドをご覧ください。

.. meta::
    :title lang=ja: NumberHelper
    :description lang=ja: The Number Helper contains convenience methods that enable display numbers in common formats in your views.
    :keywords lang=ja: number helper,currency,number format,number precision,format file size,format numbers
