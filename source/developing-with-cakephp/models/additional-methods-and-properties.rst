3.7.9 Additional Methods and Properties
---------------------------------------

While CakePHP’s model functions should get you where you need to
go, don’t forget that model classes are just that: classes that
allow you to write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as
the fat model.

::

    class Example extends AppModel {
    
       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
          );
          return $this->find('all', compact('conditions'));
       }
    }

This ``getRecent()`` method can now be used within the controller.

::

    $recent = $this->Example->getRecent();

Using virtualFields
~~~~~~~~~~~~~~~~~~~

Virtual fields are a new feature in the Model for CakePHP 1.3.
Virtual fields allow you to create arbitrary SQL expressions and
assign them as fields in a Model. These fields cannot be saved, but
will be treated like other model fields for read operations. They
will be indexed under the model's key alongside other model
fields.

**How to create virtual fields**
Creating virtual fields is easy. In each model you can define a
$virtualFields property that contains an array of
``field => expressions``. An example of virtual field definitions
would be:

::

    var $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not
advisable to create virtual fields with the same names as columns
on the database, this can cause SQL errors.

**Using virtual fields**
Creating virtual fields is straightforward and easy, interacting
with virtual fields can be done through a few different methods.

**``Model::hasField()``**
``Model::hasField()`` has been updated so that it can will return
true if the model has a ``virtualField`` with the correct name. By
setting the second parameter of ``hasField`` to true,
``virtualFields`` will also be checked when checking if a model has
a field. Using the example field above,
::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

**``Model::isVirtualField()``**
This method can be used to check if a field/column is a virtual
field or a concrete field. Will return true if the column is
virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

**``Model::getVirtualField()``**
This method can be used to access the SQL expression that comprises
a virtual field. If no argument is supplied it will return all
virtual fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

**``Model::find()`` and virtual fields**
As stated earlier ``Model::find()`` will treat virtual fields much
like any other field in a model. The value of a virtual field will
be placed under the model's key in the resultset. Unlike the
behavior of calculated fields in 1.2

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

**Pagination and virtual fields**
Since virtual fields behave much like regular fields when doing
find's, ``Controller::paginate()`` has been updated to allows
sorting by virtual fields.

3.7.9 Additional Methods and Properties
---------------------------------------

While CakePHP’s model functions should get you where you need to
go, don’t forget that model classes are just that: classes that
allow you to write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as
the fat model.

::

    class Example extends AppModel {
    
       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
          );
          return $this->find('all', compact('conditions'));
       }
    }

This ``getRecent()`` method can now be used within the controller.

::

    $recent = $this->Example->getRecent();

Using virtualFields
~~~~~~~~~~~~~~~~~~~

Virtual fields are a new feature in the Model for CakePHP 1.3.
Virtual fields allow you to create arbitrary SQL expressions and
assign them as fields in a Model. These fields cannot be saved, but
will be treated like other model fields for read operations. They
will be indexed under the model's key alongside other model
fields.

**How to create virtual fields**
Creating virtual fields is easy. In each model you can define a
$virtualFields property that contains an array of
``field => expressions``. An example of virtual field definitions
would be:

::

    var $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not
advisable to create virtual fields with the same names as columns
on the database, this can cause SQL errors.

**Using virtual fields**
Creating virtual fields is straightforward and easy, interacting
with virtual fields can be done through a few different methods.

**``Model::hasField()``**
``Model::hasField()`` has been updated so that it can will return
true if the model has a ``virtualField`` with the correct name. By
setting the second parameter of ``hasField`` to true,
``virtualFields`` will also be checked when checking if a model has
a field. Using the example field above,
::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

**``Model::isVirtualField()``**
This method can be used to check if a field/column is a virtual
field or a concrete field. Will return true if the column is
virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

**``Model::getVirtualField()``**
This method can be used to access the SQL expression that comprises
a virtual field. If no argument is supplied it will return all
virtual fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

**``Model::find()`` and virtual fields**
As stated earlier ``Model::find()`` will treat virtual fields much
like any other field in a model. The value of a virtual field will
be placed under the model's key in the resultset. Unlike the
behavior of calculated fields in 1.2

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

**Pagination and virtual fields**
Since virtual fields behave much like regular fields when doing
find's, ``Controller::paginate()`` has been updated to allows
sorting by virtual fields.
