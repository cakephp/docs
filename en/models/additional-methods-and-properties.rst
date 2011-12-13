Additional Methods and Properties
#################################

While CakePHP’s model functions should get you where you need to
go, don’t forget that model classes are just that: classes that
allow you to write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as
the fat model.

::

    <?php
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

    <?php
    $recent = $this->Example->getRecent();

:php:meth:`Model::exists()`
===========================

Returns true if a record with the currently set ID exists.

Internally calls :php:meth:`Model::getID()` to obtain the current record ID to verify, and 
then performs a ``Model::find('count')`` on the currently configured datasource to 
ascertain the existence of the record in persistent storage.

::

    <?php
    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }


.. meta::
    :title lang=en: Additional Methods and Properties
    :keywords lang=en: model classes,model functions,model class,interval,array