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
* ``EntityTrait::visibleProperties()`` は、非推奨になります。
  代わりに、 ``getVisible()`` を使用してください。

振る舞いの変更
==============

* ``Cake\ORM\Table::findOrCreate()`` は、検索が失敗し ``$search`` から作成されたエンティティーに
  無効なデータが含まれる場合、 ``PersistenceFailedException`` を投げるようになりました。
  以前は無効なエンティティーが保存されていました。
* ``$modelClass`` プロパティーが設定された ``Command`` クラスは、そのモデルをオートロードします。
  空の引数を指定した手動の ``loadModel()`` の呼び出しはもう必要ありません。これにより、
  シェルクラスの動作と一貫性が保たれます。

新機能
======

Collection
----------

* ``CollectionTrait`` はクローンを作成するのに ``newCollection`` メソッドを使用するようになりました。
  これにより、サブクラスは ``Collection`` を使用する代わりにコレクションメソッドに
  自身のインスタンスを作成されることができます。

Console
-------

* ``Command::executeCommand()`` が追加されました。このメソッドは現在のコマンドから
  別のコマンドを呼び出すのを簡単にします。
