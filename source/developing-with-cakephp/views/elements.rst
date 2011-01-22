3.10.3 Elements
---------------

Many applications have small blocks of presentation code that need
to be repeated from page to page, sometimes in different places in
the layout. CakePHP can help you repeat parts of your website that
need to be reused. These reusable parts are called Elements. Ads,
help boxes, navigational controls, extra menus, login forms, and
callouts are often implemented in CakePHP as elements. An element
is basically a mini-view that can be included in other views, in
layouts, and even within other elements. Elements can be used to
make a view more readable, placing the rendering of repeating
elements in its own file. They can also help you re-use content
fragments in your application.

Elements live in the /app/views/elements/ folder, and have the .ctp
filename extension. They are output using the element method of the
view.

::

    <?php echo $this->element('helpbox'); ?>

Passing Variables into an Element
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can pass data to an element through the element's second
argument:

::

    <?php echo
    $this->element('helpbox', 
        array("helptext" => "Oh, this text is very helpful."));
    ?>

Inside the element file, all the passed variables are available as
members of the parameter array (in the same way that ``set()`` in
the controller works with view files). In the above example, the
/app/views/elements/helpbox.ctp file can use the ``$helptext``
variable.

::

    <?php
    echo $helptext; //outputs "Oh, this text is very helpful."
    ?>

The ``element()`` function combines options for the element with
the data for the element to pass. The two options are 'cache' and
'plugin'. An example:

::

    <?php echo
    $this->element('helpbox', 
        array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
            "cache" => "+2 days", //sets the caching to +2 days.
            "plugin" => "" //to render an element from a plugin
        )
    );
    ?>

To cache different versions of the same element in an application,
provide a unique cache key value using the following format:

::

    <?php
    $this->element('helpbox',
        array(
            "cache" => array('time'=> "+7 days",'key'=>'unique value')
        )
    );
    ?>

You can take full advantage of elements by using
``requestAction()``. The ``requestAction()`` function fetches view
variables from a controller action and returns them as an array.
This enables your elements to perform in true MVC style. Create a
controller action that prepares the view variables for your
elements, then call ``requestAction()`` inside the second parameter
of ``element()`` to feed the element the view variables from your
controller.

To do this, in your controller add something like the following for
the Post example.

::

    <?php
    class PostsController extends AppController {
        ...
        function index() {
            $posts = $this->paginate();
            if (isset($this->params['requested'])) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }
    ?>

And then in the element we can access the paginated posts model. To
get the latest five posts in an ordered list we would do something
like the following:

::

    <h2>Latest Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Caching Elements
~~~~~~~~~~~~~~~~

You can take advantage of CakePHP view caching if you supply a
cache parameter. If set to true, it will cache for 1 day.
Otherwise, you can set alternative expiration times. See
:doc:`/common-tasks-with-cakephp/caching` for more information on setting
expiration.

::

    <?php echo $this->element('helpbox', array('cache' => true)); ?>

If you render the same element more than once in a view and have
caching enabled be sure to set the 'key' parameter to a different
name each time. This will prevent each succesive call from
overwriting the previous element() call's cached result. E.g.

::

    <?php
    echo $this->element('helpbox', array('cache' => array('key' => 'first_use', 'time' => '+1 day'), 'var' => $var));
    
    echo $this->element('helpbox', array('cache' => array('key' => 'second_use', 'time' => '+1 day'), 'var' => $differentVar));
    ?>

The above will ensure that both element results are cached
separately.

Requesting Elements from a Plugin
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you are using a plugin and wish to use elements from within the
plugin, just specify the plugin parameter. If the view is being
rendered for a plugin controller/action, it will automatically
point to the element for the plugin. If the element doesn't exist
in the plugin, it will look in the main APP folder.

::

    <?php echo $this->element('helpbox', array('plugin' => 'pluginname')); ?>
