11.1.8 Creating Post Views
--------------------------

Now that we have our data flowing to our model, and our application
logic and flow defined by our controller, let's create a view for
the index action we created above.

Cake views are just presentation-flavored fragments that fit inside
an application's layout. For most applications they're HTML mixed
with PHP, but they may end up as XML, CSV, or even binary data.

Layouts are presentation code that is wrapped around a view, and
can be defined and switched between, but for now, let's just use
the default.

Remember in the last section how we assigned the 'posts' variable
to the view using the ``set()`` method? That would hand down data
to the view that would look something like this:

::

    // print_r($posts) output:
    
    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Cake's view files are stored in ``/app/views`` inside a folder
named after the controller they correspond to (we'll have to create
a folder named 'posts' in this case). To format this post data in a
nice table, our view code might look something like this:

::

    <!-- File: /app/views/posts/index.ctp -->
    
    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>
    
        <!-- Here is where we loop through our $posts array, printing out post info -->
    
        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], 
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
    
    </table>


#. ``<!-- File: /app/views/posts/index.ctp -->``
#. ``<h1>Blog posts</h1>``
#. ``<table>``
#. ``<tr>``
#. ``<th>Id</th>``
#. ``<th>Title</th>``
#. ``<th>Created</th>``
#. ``</tr>``
#. ``<!-- Here is where we loop through our $posts array, printing out post info -->``
#. ``<?php foreach ($posts as $post): ?>``
#. ``<tr>``
#. ``<td><?php echo $post['Post']['id']; ?></td>``
#. ``<td>``
#. ``<?php echo $this->Html->link($post['Post']['title'],``
#. ``array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>``
#. ``</td>``
#. ``<td><?php echo $post['Post']['created']; ?></td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. `` ``
#. ``</table>``

Hopefully this should look somewhat simple.

You might have noticed the use of an object called ``$this->Html``.
This is an instance of the CakePHP ``HtmlHelper`` class. CakePHP
comes with a set of view helpers that make things like linking,
form output, JavaScript and Ajax a snap. You can learn more about
how to use them in `Chapter "Built-in Helpers" </view/1102/>`_, but
what's important to note here is that the ``link()`` method will
generate an HTML link with the given title (the first parameter)
and URL (the second parameter).

When specifying URLs in Cake, it is recommended that you use the
array format. This is explained in more detail in the section on
Routes. Using the array format for URLs allows you to take
advantage of CakePHP's reverse routing capabilities. You can also
specify URLs relative to the base of the application in the form of
/controller/action/param1/param2.

At this point, you should be able to point your browser to
http://www.example.com/posts/index. You should see your view,
correctly formatted with the title and table listing of the posts.

If you happened to have clicked on one of the links we created in
this view (that link a post's title to a URL /posts/view/some\_id),
you were probably informed by CakePHP that the action hasn't yet
been defined. If you were not so informed, either something has
gone wrong, or you actually did define it already, in which case
you are very sneaky. Otherwise, we'll create it in the
PostsController now:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array('Html', 'Form');
        var $name = 'Posts';
    
        function index() {
             $this->set('posts', $this->Post->find('all'));
        }
    
        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array('Html', 'Form');``
#. ``var $name = 'Posts';``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``function view($id = null) {``
#. ``$this->Post->id = $id;``
#. ``$this->set('post', $this->Post->read());``
#. ``}``
#. ``}``
#. ``?>``

The ``set()`` call should look familiar. Notice we're using
``read()`` rather than ``find('all')`` because we only really want
a single post's information.

Notice that our view action takes a parameter: the ID of the post
we'd like to see. This parameter is handed to the action through
the requested URL. If a user requests /posts/view/3, then the value
'3' is passed as ``$id``.

Now let's create the view for our new 'view' action and place it in
/app/views/posts/view.ctp.

::

    <!-- File: /app/views/posts/view.ctp -->
    
    <h1><?php echo $post['Post']['title']?></h1>
    
    <p><small>Created: <?php echo $post['Post']['created']?></small></p>
    
    <p><?php echo $post['Post']['body']?></p>


#. ``<!-- File: /app/views/posts/view.ctp -->``
#. ``<h1><?php echo $post['Post']['title']?></h1>``
#. ``<p><small>Created: <?php echo $post['Post']['created']?></small></p>``
#. ``<p><?php echo $post['Post']['body']?></p>``

Verify that this is working by trying the links at /posts/index or
manually requesting a post by accessing /posts/view/1.

11.1.8 Creating Post Views
--------------------------

Now that we have our data flowing to our model, and our application
logic and flow defined by our controller, let's create a view for
the index action we created above.

Cake views are just presentation-flavored fragments that fit inside
an application's layout. For most applications they're HTML mixed
with PHP, but they may end up as XML, CSV, or even binary data.

Layouts are presentation code that is wrapped around a view, and
can be defined and switched between, but for now, let's just use
the default.

Remember in the last section how we assigned the 'posts' variable
to the view using the ``set()`` method? That would hand down data
to the view that would look something like this:

::

    // print_r($posts) output:
    
    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Cake's view files are stored in ``/app/views`` inside a folder
named after the controller they correspond to (we'll have to create
a folder named 'posts' in this case). To format this post data in a
nice table, our view code might look something like this:

::

    <!-- File: /app/views/posts/index.ctp -->
    
    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>
    
        <!-- Here is where we loop through our $posts array, printing out post info -->
    
        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], 
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
    
    </table>


#. ``<!-- File: /app/views/posts/index.ctp -->``
#. ``<h1>Blog posts</h1>``
#. ``<table>``
#. ``<tr>``
#. ``<th>Id</th>``
#. ``<th>Title</th>``
#. ``<th>Created</th>``
#. ``</tr>``
#. ``<!-- Here is where we loop through our $posts array, printing out post info -->``
#. ``<?php foreach ($posts as $post): ?>``
#. ``<tr>``
#. ``<td><?php echo $post['Post']['id']; ?></td>``
#. ``<td>``
#. ``<?php echo $this->Html->link($post['Post']['title'],``
#. ``array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>``
#. ``</td>``
#. ``<td><?php echo $post['Post']['created']; ?></td>``
#. ``</tr>``
#. ``<?php endforeach; ?>``
#. `` ``
#. ``</table>``

Hopefully this should look somewhat simple.

You might have noticed the use of an object called ``$this->Html``.
This is an instance of the CakePHP ``HtmlHelper`` class. CakePHP
comes with a set of view helpers that make things like linking,
form output, JavaScript and Ajax a snap. You can learn more about
how to use them in `Chapter "Built-in Helpers" </view/1102/>`_, but
what's important to note here is that the ``link()`` method will
generate an HTML link with the given title (the first parameter)
and URL (the second parameter).

When specifying URLs in Cake, it is recommended that you use the
array format. This is explained in more detail in the section on
Routes. Using the array format for URLs allows you to take
advantage of CakePHP's reverse routing capabilities. You can also
specify URLs relative to the base of the application in the form of
/controller/action/param1/param2.

At this point, you should be able to point your browser to
http://www.example.com/posts/index. You should see your view,
correctly formatted with the title and table listing of the posts.

If you happened to have clicked on one of the links we created in
this view (that link a post's title to a URL /posts/view/some\_id),
you were probably informed by CakePHP that the action hasn't yet
been defined. If you were not so informed, either something has
gone wrong, or you actually did define it already, in which case
you are very sneaky. Otherwise, we'll create it in the
PostsController now:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array('Html', 'Form');
        var $name = 'Posts';
    
        function index() {
             $this->set('posts', $this->Post->find('all'));
        }
    
        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array('Html', 'Form');``
#. ``var $name = 'Posts';``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``function view($id = null) {``
#. ``$this->Post->id = $id;``
#. ``$this->set('post', $this->Post->read());``
#. ``}``
#. ``}``
#. ``?>``

The ``set()`` call should look familiar. Notice we're using
``read()`` rather than ``find('all')`` because we only really want
a single post's information.

Notice that our view action takes a parameter: the ID of the post
we'd like to see. This parameter is handed to the action through
the requested URL. If a user requests /posts/view/3, then the value
'3' is passed as ``$id``.

Now let's create the view for our new 'view' action and place it in
/app/views/posts/view.ctp.

::

    <!-- File: /app/views/posts/view.ctp -->
    
    <h1><?php echo $post['Post']['title']?></h1>
    
    <p><small>Created: <?php echo $post['Post']['created']?></small></p>
    
    <p><?php echo $post['Post']['body']?></p>


#. ``<!-- File: /app/views/posts/view.ctp -->``
#. ``<h1><?php echo $post['Post']['title']?></h1>``
#. ``<p><small>Created: <?php echo $post['Post']['created']?></small></p>``
#. ``<p><?php echo $post['Post']['body']?></p>``

Verify that this is working by trying the links at /posts/index or
manually requesting a post by accessing /posts/view/1.
