3.9 移行ガイド
##############

CakePHP 3.9 は 3.8 の API の完全上位互換です。
このページでは、3.8 の変更と改善についてのアウトラインを紹介します。

3.9.x にアップグレードするには、次の Composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"

非推奨
======

* ``ConsoleIo::info()`` 、 ``success()`` 、 ``warning()`` および ``error()`` は
  4.0 において ``message`` パラメータで ``null`` 値を受け入れるようになりました。
* テストケースで ``$fixtures`` にコンマ区切りの文字列を使用することは非推奨です。
  代わりに、配列を使用するか、新しい ``getFixtures()`` メソッドをテストケースクラスに実装してください。