3.8.2 Creating Behaviors
------------------------

Behaviors that are attached to Models get their callbacks called
automatically. The callbacks are similar to those found in Models:
beforeFind, afterFind, beforeSave, afterSave, beforeDelete,
afterDelete and onError - see
`Callback Methods </view/1048/Callback-Methods>`_.

Your behaviors should be placed in ``app/models/behaviors``. It's
often helpful to use a core behavior as a template when creating
your own. Find them in ``cake/libs/model/behaviors/``.

Every callback takes a reference to the model it is being called
from as the first parameter.

Besides implementing the callbacks, you can add settings per
behavior and/or model behavior attachment. Information about
specifying settings can be found in the chapters about core
behaviors and their configuration.

A quick example that illustrates how behavior settings can be
passed from the model to the behavior:

::

    class Post extends AppModel {
        var $name = 'Post'
        var $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'));
    }

As of 1.2.8004, CakePHP adds those settings once per model/alias
only. To keep your behavior upgradable you should respect aliases
(or models).

An upgrade-friendly function setup would look something like this:

::

    function setup(&$Model, $settings) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }

3.8.2 Creating Behaviors
------------------------

Behaviors that are attached to Models get their callbacks called
automatically. The callbacks are similar to those found in Models:
beforeFind, afterFind, beforeSave, afterSave, beforeDelete,
afterDelete and onError - see
`Callback Methods </view/1048/Callback-Methods>`_.

Your behaviors should be placed in ``app/models/behaviors``. It's
often helpful to use a core behavior as a template when creating
your own. Find them in ``cake/libs/model/behaviors/``.

Every callback takes a reference to the model it is being called
from as the first parameter.

Besides implementing the callbacks, you can add settings per
behavior and/or model behavior attachment. Information about
specifying settings can be found in the chapters about core
behaviors and their configuration.

A quick example that illustrates how behavior settings can be
passed from the model to the behavior:

::

    class Post extends AppModel {
        var $name = 'Post'
        var $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'));
    }

As of 1.2.8004, CakePHP adds those settings once per model/alias
only. To keep your behavior upgradable you should respect aliases
(or models).

An upgrade-friendly function setup would look something like this:

::

    function setup(&$Model, $settings) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }
