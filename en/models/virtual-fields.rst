Virtual fields
##############

Virtual fields allow you to create arbitrary SQL expressions and
assign them as fields in a Model. These fields cannot be saved, but
will be treated like other model fields for read operations. They
will be indexed under the model's key alongside other model
fields.

Creating virtual fields
=======================

Creating virtual fields is easy. In each model you can define a
``$virtualFields`` property that contains an array of field =>
expressions. An example of a virtual field definition using MySQL
would be:

::

    public $virtualFields = array(
        'full_name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

And with PostgreSQL:
::

    public $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not
advisable to create virtual fields with the same names as columns
on the database, this can cause SQL errors.

It is not always useful to have **User.first\_name** fully
qualified. If you do not follow the convention (i.e. you have
multiple relations to other tables) this would result in an error.
In this case it may be better to just use
**first\_name \|\| \\'\\' \|\| last\_name** without the Model
Name.

Using virtual fields
====================

Creating virtual fields is straightforward and easy, interacting
with virtual fields can be done through a few different methods.

Model::hasField()
-----------------

Model::hasField() will return true if
the model has a virtualField with the correct name. By setting the
second parameter of `hasField()` to true, virtualFields will also be
checked when checking if a model has a field. Using the example
field above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

Model::isVirtualField()
-----------------------

This method can be used to check if a field/column is a virtual
field or a concrete field. Will return true if the column is
virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()
------------------------

This method can be used to access the SQL expression that comprises
a virtual field. If no argument is supplied it will return all
virtual fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

Model::find() and virtual fields
--------------------------------

As stated earlier ``Model::find()`` will treat virtual fields much
like any other field in a model. The value of a virtual field will
be placed under the model's key in the resultset.

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

Pagination and virtual fields
-----------------------------

Since virtual fields behave much like regular fields when doing
find's, ``Controller::paginate()`` will be able to sort by virtual fields too.

Virtual fields and model aliases
================================

When you are using virtualFields and models with aliases that are
not the same as their name, you can run into problems as
virtualFields do not update to reflect the bound alias. If you are
using virtualFields in models that have more than one alias it is
best to define the virtualFields in your model's constructor

::

    function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['name'] = sprintf('CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias);
    }

This will allow your virtualFields to work for any alias you give a
model.

Limitations of virtualFields
============================

The implementation of ``virtualFields`` has a few
limitations. First you cannot use ``virtualFields`` on associated
models for conditions, order, or fields arrays. Doing so will
generally result in an SQL error as the fields are not replaced by
the ORM. This is because it difficult to estimate the depth at
which an associated model might be found.

A common workaround for this implementation issue is to copy
``virtualFields`` from one model to another at runtime when you
need to access them.

::

    $this->virtualFields['full_name'] = $this->Author->virtualFields['full_name'];

or

::
    $this->virtualFields += $this->Author->virtualFields;