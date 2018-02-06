Callback Methods
################

If you want to sneak in some logic just before or after a CakePHP
model operation, use model callbacks. These functions can be
defined in model classes (including your AppModel) class. Be sure
to note the expected return values for each of these special
functions.

When using callback methods you should remember that behavior callbacks are
fired **before** model callbacks are.

beforeFind
==========

``beforeFind(array $query)``

Called before any find-related operation. The ``$query`` passed
to this callback contains information about the current query:
conditions, fields, etc.

If you do not wish the find operation to begin (possibly based on a
decision relating to the ``$query`` options), return *false*.
Otherwise, return the possibly modified ``$query``, or anything
you want to get passed to find and its counterparts.

You might use this callback to restrict find operations based on a
user's role, or make caching decisions based on the current load.

afterFind
=========

``afterFind(array $results, boolean $primary = false)``

Use this callback to modify results that have been returned from a
find operation, or to perform any other post-find logic. The
$results parameter passed to this callback contains the returned
results from the model's find operation, i.e. something like::

    $results = array(
        0 => array(
            'ModelName' => array(
                'field1' => 'value1',
                'field2' => 'value2',
            ),
        ),
    );

The return value for this callback should be the (possibly
modified) results for the find operation that triggered this
callback.

The ``$primary`` parameter indicates whether or not the current
model was the model that the query originated on or whether or not
this model was queried as an association. If a model is queried as
an association the format of ``$results`` can differ; instead of the
result you would normally get from a find operation, you may get
this::

    $results = array(
        'field_1' => 'value1',
        'field_2' => 'value2'
    );

.. warning::

    Code expecting ``$primary`` to be true will probably get a "Cannot
    use string offset as an array" fatal error from PHP if a recursive
    find is used.

Below is an example of how afterfind can be used for date
formatting::

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind(
                    $val['Event']['begindate']
                );
            }
        }
        return $results;
    }

    public function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
==============

``beforeValidate(array $options = array())``

Use this callback to modify model data before it is validated, or
to modify validation rules if required. This function must also
return *true*, otherwise the current save() execution will abort.

afterValidate
=============

``afterValidate()``

Called after data has been checked for errors. Use this callback to perform
any data cleanup or preparation if needed.

beforeSave
==========

``beforeSave(array $options = array())``

Place any pre-save logic in this function. This function executes
immediately after model data has been successfully validated, but
just before the data is saved. This function should also return
true if you want the save operation to continue.

This callback is especially handy for any data-massaging logic that
needs to happen before your data is stored. If your storage engine
needs dates in a specific format, access it at $this->data and
modify it.

Below is an example of how beforeSave can be used for date
conversion. The code in the example is used for an application with
a begindate formatted like YYYY-MM-DD in the database and is
displayed like DD-MM-YYYY in the application. Of course this can be
changed very easily. Use the code below in the appropriate model.

::

    public function beforeSave($options = array()) {
        if (!empty($this->data['Event']['begindate']) &&
            !empty($this->data['Event']['enddate'])
        ) {

            $this->data['Event']['begindate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['begindate']
            );
            $this->data['Event']['enddate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['enddate']
            );
        }
        return true;
    }

    public function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString));
    }

.. tip::

    Make sure that beforeSave() returns true, or your save is going to
    fail.

afterSave
=========

``afterSave(boolean $created, array $options = array())``

If you have logic you need to be executed just after every save
operation, place it in this callback method. The saved data will
be available in ``$this->data``.

The value of ``$created`` will be true if a new record was created
(rather than an update).

The ``$options`` array is the same one passed to ``Model::save()``.

beforeDelete
============

``beforeDelete(boolean $cascade = true)``

Place any pre-deletion logic in this function. This function should
return true if you want the deletion to continue, and false if you
want to abort.

The value of ``$cascade`` will be ``true`` if records that depend
on this record will also be deleted.

.. tip::

    Make sure that beforeDelete() returns true, or your delete is going
    to fail.

::

    // using app/Model/ProductCategory.php
    // In the following example, do not let a product category be deleted if it
    // still contains products.
    // A call of $this->Product->delete($id) from ProductsController.php has set
    // $this->id .
    // Assuming 'ProductCategory hasMany Product', we can access $this->Product
    // in the model.
    public function beforeDelete($cascade = true) {
        $count = $this->Product->find("count", array(
            "conditions" => array("product_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        }
        return false;
    }

afterDelete
===========

``afterDelete()``

Place any logic that you want to be executed after every deletion
in this callback method.

::

    // perhaps after deleting a record from the database, you also want to delete
    // an associated file
    public function afterDelete() {
        $file = new File($this->data['SomeModel']['file_path']);
        $file->delete();
    }

onError
=======

``onError()``

Called if any problems occur.


.. meta::
    :title lang=en: Callback Methods
    :keywords lang=en: querydata,query conditions,model classes,callback methods,special functions,return values,counterparts,array,logic,decisions
