6.3.2 Attaching the Translate Behavior to your Models
-----------------------------------------------------

Add it to your model by using the ``$actsAs`` property like in the
following example.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel {``
#. ``var $name = 'Post';``
#. ``var $actsAs = array(``
#. ``'Translate'``
#. ``);``
#. ``}``
#. ``?>``

This will do nothing yet, because it expects a couple of options
before it begins to work. You need to define which fields of the
current model should be tracked in the translation table we've
created in the first step.

6.3.2 Attaching the Translate Behavior to your Models
-----------------------------------------------------

Add it to your model by using the ``$actsAs`` property like in the
following example.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel {``
#. ``var $name = 'Post';``
#. ``var $actsAs = array(``
#. ``'Translate'``
#. ``);``
#. ``}``
#. ``?>``

This will do nothing yet, because it expects a couple of options
before it begins to work. You need to define which fields of the
current model should be tracked in the translation table we've
created in the first step.
