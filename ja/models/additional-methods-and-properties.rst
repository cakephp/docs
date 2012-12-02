..
   Additional Methods and Properties
   #################################

独自のメソッドとプロパティ
##########################

..
   While CakePHP’s model functions should get you where you need to
   go, don’t forget that model classes are just that: classes that
   allow you to write your own methods or define your own properties.

CakePHP のモデルの標準機能があれば、やりたいことはなんでもできると思います。\
しかし、モデルもただのクラスなのだということを忘れないでください。\
クラスなので、好きなメソッドを追加したり、好きなプロパティを定義したりできるのです。

..
   Any operation that handles the saving and fetching of data is best
   housed in your model classes. This concept is often referred to as
   the fat model.

データの保存や取得を扱う操作は、モデルクラスの中に入れてしまうのがいいでしょう。\
こういう考え方は、普通、太ったモデル (*fat model*) といわれます。

::

    class Example extends AppModel {
        public function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

..
   This ``getRecent()`` method can now be used within the controller.

こうしておけば、 ``getRecent()`` メソッドをコントローラ内で使えるようになります。

::

    $recent = $this->Example->getRecent();

:php:meth:`Model::associations()`
=================================

..
   Get associations::

関連を取得します。 ::

    $result = $this->Example->associations();
    // $result は array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany') になります

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

..
   Builds the query array that is used by the data source to generate the query to
   fetch the data.

データソースがデータ取得のクエリを生成するために使用するクエリ配列を作成します。

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

..
   Deconstructs a complex data type (array or object) into a single field value.

複雑なデータ型をひとつのフィールド値に分解します。

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

..
   Escapes the field name and prepends the model name. Escaping is done according
   to the current database driver's rules.

フィールド名をエスケープし、さらにモデル名を付加します。エスケープは現在のデータベースドライバの規則に従って行われます。

:php:meth:`Model::exists($id)`
==============================

..
   Returns true if a record with the particular ID exists.

特定の ID を持つレコードが存在するとき、 true を返します。

..
   If ID is not provided it calls :php:meth:`Model::getID()` to obtain the current record ID to verify, and
   then performs a ``Model::find('count')`` on the currently configured datasource to
   ascertain the existence of the record in persistent storage.

もし ID なしで呼んだ場合は、現在のレコードの ID を確認するために :php:meth:`Model::getID()` が呼ばれます。\
その後、現在設定されているデータソースで ``Model::find('count')`` を実行し、永続ストレージ内にレコードが存在するかを確認します。

.. note ::

    ..
       Parameter $id was added in 2.1. Prior to that it does not take any parameter.

    $id パラメータは 2.1 で追加されました。それ以前のバージョンでは、このメソッドにはパラメータはありません。

::

    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

..
   Returns the number of rows affected by the last query.

直前のクエリによって影響を受けた行数を返します。

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

..
   Gets all the models with which this model is associated.

関連付けられているすべてのモデルを取得します。

:php:meth:`Model::getColumnType(string $column)`
================================================

..
   Returns the column type of a column in the model.

モデルの中のカラムの型を返します。

:php:meth:`Model::getColumnTypes()`
===================================

..
   Returns an associative array of field names and column types.

フィールド名とカラム名の連想配列を返します。

:php:meth:`Model::getID(integer $list = 0)`
===========================================

..
   Returns the current record's ID.

現在のレコードの ID を返します。

:php:meth:`Model::getInsertID()`
================================

..
   Returns the ID of the last record this model inserted.

このモデルが最後にインサートしたレコードの ID を返します。

:php:meth:`Model::getLastInsertID()`
====================================

..
   Alias to ``getInsertID()``.

``getInsertID()`` のエイリアスです。

.. meta::
    :title lang=en: Additional Methods and Properties
    :keywords lang=en: model classes,model functions,model class,interval,array
