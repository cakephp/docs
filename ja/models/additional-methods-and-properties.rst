独自のメソッドとプロパティ
##########################

CakePHP のモデルの標準機能があれば、やりたいことはなんでもできると思います。
しかし、モデルもただのクラスなのだということを忘れないでください。
クラスなので、好きなメソッドを追加したり、好きなプロパティを定義したりできるのです。

データの保存や取得を扱う操作は、モデルクラスの中に入れてしまうのがいいでしょう。
こういう考え方は、ファットモデル (*fat model*) といわれます。

::

    class Example extends AppModel {
        public function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day)' .
                ' and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

こうしておけば、 ``getRecent()`` メソッドをコントローラ内で使えるようになります。

::

    $recent = $this->Example->getRecent();

:php:meth:`Model::associations()`
=================================

アソシエーションを取得します。 ::

    $result = $this->Example->associations();
    // $result の値は array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

データソースがデータ取得のクエリを生成するために使用するクエリ配列を作成します。

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

複雑なデータ型をひとつのフィールド値に分解します。

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

フィールド名をエスケープし、さらにモデル名を付加します。エスケープは現在のデータベースドライバの
規則に従って行われます。

:php:meth:`Model::exists($id)`
==============================

特定の ID を持つレコードが存在するとき、 true を返します。

もし ID なしで呼んだ場合は、現在のレコードの ID を確認するために :php:meth:`Model::getID()` が
呼ばれます。その後、現在設定されているデータソースで ``Model::find('count')`` を実行し、
永続ストレージ内にレコードが存在するかを確認します。

.. note ::

    $id パラメータは 2.1 で追加されました。それ以前のバージョンでは、このメソッドには
    パラメータはありません。

::

    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

直前のクエリによって影響を受けた行数を返します。

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

関連付けられているすべてのモデルを取得します。

:php:meth:`Model::getColumnType(string $column)`
================================================

モデルの中のカラムの型を返します。

:php:meth:`Model::getColumnTypes()`
===================================

フィールド名とカラム名の連想配列を返します。

:php:meth:`Model::getID(integer $list = 0)`
===========================================

現在のレコードの ID を返します。

:php:meth:`Model::getInsertID()`
================================

このモデルが最後にインサートしたレコードの ID を返します。

:php:meth:`Model::getLastInsertID()`
====================================

``getInsertID()`` のエイリアスです。

.. meta::
    :title lang=ja: Additional Methods and Properties
    :keywords lang=ja: model classes,model functions,model class,interval,array
