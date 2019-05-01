3.8 移行ガイド
##############

CakePHP 3.8 は 3.7 の API の完全上位互換です。
このページでは、3.8 の変更と改善についてのアウトラインを紹介します。

3.8.x にアップグレードするには、次の Composer コマンドを実行してください。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.8.*"

非推奨
======

* ``Validator::allowEmptyString()`` 、 ``allowEmptyArray()`` 、
  ``allowEmptyFile()`` 、 ``allowEmptyDate()`` 、 ``allowEmptyTime()`` 、および
  ``allowEmptyDateTime()`` は、 ``$field, $when, $message`` シグネチャ使用時に
  非推奨警告を発するようになりました。代わりに ``$field, $message, $when`` を
  使用するべきです。
