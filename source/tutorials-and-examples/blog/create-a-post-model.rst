11.1.6 Create a Post Model
--------------------------

The Model class is the bread and butter of CakePHP applications. By
creating a CakePHP model that will interact with our database,
we'll have the foundation in place needed to do our view, add,
edit, and delete operations later.

CakePHP's model class files go in ``/app/models``, and the file
we'll be creating will be saved to ``/app/models/post.php``. The
completed file should look like this:

::

    <?php
    
    class Post extends AppModel {
        var $name = 'Post';
    }
    
    ?>

Naming convention is very important in CakePHP. By naming our model
Post, CakePHP can automatically infer that this model will be used
in the PostsController, and will be tied to a database table called
``posts``.

CakePHP will dynamically create a model object for you, if it
cannot find a corresponding file in /app/models. This also means,
that if you accidentally name your file wrong (i.e. Post.php or
posts.php) CakePHP will not recognize any of your settings and will
use the defaults instead.

The ``$name`` variable is always a good idea to add, and is used to
overcome some class name oddness in PHP4.

For more on models, such as table prefixes, callbacks, and
validation, check out the `Models </view/1000/>`_ chapter of the
Manual.

11.1.6 Create a Post Model
--------------------------

The Model class is the bread and butter of CakePHP applications. By
creating a CakePHP model that will interact with our database,
we'll have the foundation in place needed to do our view, add,
edit, and delete operations later.

CakePHP's model class files go in ``/app/models``, and the file
we'll be creating will be saved to ``/app/models/post.php``. The
completed file should look like this:

::

    <?php
    
    class Post extends AppModel {
        var $name = 'Post';
    }
    
    ?>

Naming convention is very important in CakePHP. By naming our model
Post, CakePHP can automatically infer that this model will be used
in the PostsController, and will be tied to a database table called
``posts``.

CakePHP will dynamically create a model object for you, if it
cannot find a corresponding file in /app/models. This also means,
that if you accidentally name your file wrong (i.e. Post.php or
posts.php) CakePHP will not recognize any of your settings and will
use the defaults instead.

The ``$name`` variable is always a good idea to add, and is used to
overcome some class name oddness in PHP4.

For more on models, such as table prefixes, callbacks, and
validation, check out the `Models </view/1000/>`_ chapter of the
Manual.
