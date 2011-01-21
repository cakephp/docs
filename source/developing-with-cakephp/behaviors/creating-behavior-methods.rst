3.8.3 Creating behavior methods
-------------------------------

Behavior methods are automatically available on any model acting as
the behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }


#. ``class Duck extends AppModel {``
#. ``var $name = 'Duck';``
#. ``var $actsAs = array('Flying');``
#. ``}``

You would be able to call FlyingBehavior methods as if they were
methods on your Duck model. When creating behavior methods you
automatically get passed a reference of the calling model as the
first parameter. All other supplied parameters are shifted one
place to the right. For example

::

    $this->Duck->fly('toronto', 'montreal');


#. ``$this->Duck->fly('toronto', 'montreal');``

Although this method takes two parameters, the method signature
should look like:
::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }


#. ``function fly(&$Model, $from, $to) {``
#. ``// Do some flying.``
#. ``}``

Keep in mind that methods called in a ``$this->doIt()`` fashion
from inside a behavior method will not get the $model parameter
automatically appended.
3.8.3 Creating behavior methods
-------------------------------

Behavior methods are automatically available on any model acting as
the behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }


#. ``class Duck extends AppModel {``
#. ``var $name = 'Duck';``
#. ``var $actsAs = array('Flying');``
#. ``}``

You would be able to call FlyingBehavior methods as if they were
methods on your Duck model. When creating behavior methods you
automatically get passed a reference of the calling model as the
first parameter. All other supplied parameters are shifted one
place to the right. For example

::

    $this->Duck->fly('toronto', 'montreal');


#. ``$this->Duck->fly('toronto', 'montreal');``

Although this method takes two parameters, the method signature
should look like:
::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }


#. ``function fly(&$Model, $from, $to) {``
#. ``// Do some flying.``
#. ``}``

Keep in mind that methods called in a ``$this->doIt()`` fashion
from inside a behavior method will not get the $model parameter
automatically appended.
