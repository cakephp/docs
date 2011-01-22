6.3.3 Defining the Fields
-------------------------

You can set the fields by simply extending the ``'Translate'``
value with another array, like so:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }
    ?>

After you have done that (for example putting "name" as one of the
fields) you already finished the basic setup. Great! According to
our current example the model should now look something like this:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
    }
    ?>

When defining fields for TranslateBehavior to translate, be sure to
omit those fields from the translated model's schema. If you leave
the fields in, there can be issues when retrieving data with
fallback locales.
