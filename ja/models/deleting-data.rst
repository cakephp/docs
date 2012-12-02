データを削除する
################

CakePHP の Model クラスではデータベースからレコードを削除するいくつかの方法が提供されています。

.. _model-delete:

delete
======

``delete(int $id = null, boolean $cascade = true);``

$id で特定されるレコードを削除します。
デフォルトでは、削除される該当レコードに依存しているレコードも削除されます。

例えば複数の Recipe レコードとひも付いた User レコード (User 'hasMany'
または 'hasAndBelongsToMany' Recipes) を削除する場合
 
-  $cascade が true の場合、モデルの dependent の値が
   true になっていれば関連する Recipe レコードも削除されます。
-  $cascade が false の場合、User が削除されても
   Recipe レコードは残ります。

データベースが外部キーとカスケードデリートをサポートしているなら、\
多くの場合は CakePHP のカスケーディングよりその機能を利用した方が効率的です。\
``Model::delete()`` のカスケード機能を使うメリットのひとつは、\
ビヘイビアやモデルのコールバックを利用できることです。\ ::

    $this->Comment->delete($this->request->data('Comment.id'));

モデルとビヘイビアが持つ ``beforeDelete`` と ``afterDelete``
コールバックを利用して、削除のプロセスに独自のロジックをフックすることができます。
詳しくは :doc:`/models/callback-methods` を参照してください。

.. _model-deleteall:

deleteAll
=========

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

``deleteAll()`` は ``delete()`` と似ていますが、
異なる点は ``deleteAll()`` が与えられた条件にマッチするレコードを全て削除する
``$conditions`` 配列は SQL の断片または配列で与えます。

* **conditions** マッチさせる条件
* **cascade** 真偽値、true に設定するとそのレコードに依存するレコードも削除する
* **callbacks** 真偽値、コールバックを走らせる

戻り値は真偽値で、成功したら true を、失敗したら false を返します。

例::

    // find() と同様に、配列で与えられた条件で削除する
    $this->Comment->deleteAll(array('Comment.spam' => true), false);

コールバックまたはカスケード、あるいはその両方で削除を行った場合、\
対象となる行が検索されてから削除が行われます。\
この場合はより多くのクエリが発行されることになります。

.. note::

    deleteAll() は削除されるレコードがなかった場合 true を返します。\
    削除対象の条件は正しく、また対象のレコードは残っていないからです。

.. meta::
    :title lang=en: Deleting Data
    :keywords lang=en: doc models,custom logic,callback methods,model class,database model,callbacks,information model,request data,deleteall,fragment,leverage,array,cakephp,failure,recipes,benefit,delete,data model
