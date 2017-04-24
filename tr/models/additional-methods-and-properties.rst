Additional Methods and Properties
#################################

While CakePHP's model functions should get you where you need to
go, don't forget that model classes are just that: classes that
allow you to write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as
the fat model.

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

This ``getRecent()`` method can now be used within the controller.

::

    $recent = $this->Example->getRecent();

:php:meth:`Model::associations()`
=================================

Get associations::

    $result = $this->Example->associations();
    // $result equals array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

Builds the query array that is used by the data source to generate the query to
fetch the data.

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

Deconstructs a complex data type (array or object) into a single field value.

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

Escapes the field name and prepends the model name. Escaping is done according
to the current database driver's rules.

:php:meth:`Model::exists($id)`
==============================

Returns true if a record with the particular ID exists.

If ID is not provided it calls :php:meth:`Model::getID()` to obtain the current record ID to verify, and
then performs a ``Model::find('count')`` on the currently configured datasource to
ascertain the existence of the record in persistent storage.

.. note ::

    Parameter $id was added in 2.1. Prior to that it does not take any parameter.

::

    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

Returns the number of rows affected by the last query.

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

Gets all the models with which this model is associated.

:php:meth:`Model::getColumnType(string $column)`
================================================

Returns the column type of a column in the model.

:php:meth:`Model::getColumnTypes()`
===================================

Returns an associative array of field names and column types.

:php:meth:`Model::getID(integer $list = 0)`
===========================================

Returns the current record's ID.

:php:meth:`Model::getInsertID()`
================================

Returns the ID of the last record this model inserted.

:php:meth:`Model::getLastInsertID()`
====================================

Alias to ``getInsertID()``.

.. meta::
    :title lang=en: Additional Methods and Properties
    :keywords lang=en: model classes,model functions,model class,interval,array
