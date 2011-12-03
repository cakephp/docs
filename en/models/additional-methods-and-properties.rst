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



.. meta::
    :title lang=en: Additional Methods and Properties
    :keywords lang=en: model classes,model functions,model class,interval,array