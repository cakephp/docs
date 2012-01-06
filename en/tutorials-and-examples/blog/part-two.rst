##############################
Blog Tutorial - Adding a layer
##############################

Create a Post Model
===================

The Model class is the bread and butter of CakePHP applications. By
creating a CakePHP model that will interact with our database,
we'll have the foundation in place needed to do our view, add,
edit, and delete operations later.

CakePHP's model class files go in ``/app/Model``, and the file
we'll be creating will be saved to ``/app/Model/Post.php``. The
completed file should look like this::

    <?php
    class Post extends AppModel {
        public $name = 'Post';
    }

Naming convention is very important in CakePHP. By naming our model
Post, CakePHP can automatically infer that this model will be used
in the PostsController, and will be tied to a database table called
``posts``.

.. note::

    CakePHP will dynamically create a model object for you, if it
    cannot find a corresponding file in /app/Model. This also means,
    that if you accidentally name your file wrong (i.e. post.php or
    posts.php) CakePHP will not recognize any of your settings and will
    use the defaults instead.

For more on models, such as table prefixes, callbacks, and
validation, check out the :doc:`/models` chapter of the
Manual.


Create a Posts Controller
=========================

Next, we'll create a controller for our posts. The controller is
where all the business logic for post interaction will happen. In a
nutshell, it's the place where you play with the models and get
post-related work done. We'll place this new controller in a file
called ``PostsController.php`` inside the ``/app/Controller``
directory. Here's what the basic controller should look like::

    <?php
    class PostsController extends AppController {
        public $name = 'Posts';
        public $helpers = array('Html', 'Form');
    }

Now, lets add an action to our controller. Actions often represent
a single function or interface in an application. For example, when
users request www.example.com/posts/index (which is also the same
as www.example.com/posts/), they might expect to see a listing of
posts. The code for that action would look something like this:

::

    <?php
    class PostsController extends AppController {
        public $name = 'Posts';
        public $helpers = array('Html', 'Form');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

Let me explain the action a bit. By defining function ``index()``
in our PostsController, users can now access the logic there by
requesting www.example.com/posts/index. Similarly, if we were to
define a function called ``foobar()``, users would be able to
access that at www.example.com/posts/foobar.

.. warning::

    You may be tempted to name your controllers and actions a certain
    way to obtain a certain URL. Resist that temptation. Follow CakePHP
    conventions (plural controller names, etc.) and create readable,
    understandable action names. You can map URLs to your code using
    "routes" covered later on.

The single instruction in the action uses ``set()`` to pass data
from the controller to the view (which we'll create next). The line
sets the view variable called 'posts' equal to the return value of
the ``find('all')`` method of the Post model. Our Post model is
automatically available at ``$this->Post`` because we've followed
Cake's naming conventions.

To learn more about Cake's controllers, check out
 :doc:`/controllers` chapter.

Creating Post Views
===================

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

Cake's view files are stored in ``/app/View`` inside a folder
named after the controller they correspond to (we'll have to create
a folder named 'Posts' in this case). To format this post data in a
nice table, our view code might look something like this::

    <!-- File: /app/View/Posts/index.ctp -->
    
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

Hopefully this should look somewhat simple.

You might have noticed the use of an object called ``$this->Html``.
This is an instance of the CakePHP :php:class:`HtmlHelper` class. CakePHP
comes with a set of view helpers that make things like linking,
form output, JavaScript and Ajax a snap. You can learn more about
how to use them in :doc:`/views/helpers`, but
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
PostsController now::

    <?php
    class PostsController extends AppController {
        public $name = 'Posts';
        public $helpers = array('Html', 'Form');

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }

The ``set()`` call should look familiar. Notice we're using
``read()`` rather than ``find('all')`` because we only really want
a single post's information.

Notice that our view action takes a parameter: the ID of the post
we'd like to see. This parameter is handed to the action through
the requested URL. If a user requests /posts/view/3, then the value
'3' is passed as ``$id``.

Now let's create the view for our new 'view' action and place it in
``/app/View/Posts/view.ctp``.

::

    <!-- File: /app/View/Posts/view.ctp -->
    
    <h1><?php echo $post['Post']['title']?></h1>
    
    <p><small>Created: <?php echo $post['Post']['created']?></small></p>
    
    <p><?php echo $post['Post']['body']?></p>

Verify that this is working by trying the links at ``/posts/index`` or
manually requesting a post by accessing ``/posts/view/1``.

Adding Posts
============

Reading from the database and showing us the posts is a great
start, but let's allow for the adding of new posts.

First, start by creating an ``add()`` action in the
PostsController:

::

    <?php
    class PostsController extends AppController {
        public $name = 'Posts';
        public $helpers = array('Html', 'Form');
        public $components = array('Session');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        public function add() {
            if ($this->request->is('post')) {
                if ($this->Post->save($this->request->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash('Unable to add your post.');
                }
            }
        }
    }

.. note::

    You need to include the SessionComponent - and SessionHelper - in
    any controller where you will use it. If necessary, include it in
    your AppController.

Here's what the ``add()`` action does: if HTTP method of the
request was POST, try to save the data using the Post model. If for some
reason it doesn't save, just render the view. This gives us a
chance to show the user validation errors or other warnings.

When a user uses a form to POST data to your application, that
information is available in ``$this->request->data``. You can use the
:php:func:`pr()` or :php:func:`debug()` functions to print it out if you want to see
what it looks like.

We use the SessionComponent's :php:meth:`SessionComponent::setFlash()`
method to set a message to a session variable to be displayed on the page after
redirection. In the layout we have
:php:func:`SessionHelper::flash` which displays the
message and clears the corresponding session variable. The
controller's :php:meth:`Controller::redirect` function
redirects to another URL. The param ``array('action' => 'index')``
translates to URL /posts i.e the index action of posts controller.
You can refer to :php:func:`Router::url()` function on the api to see 
the formats in which you can specify a URL for various cake functions.

Calling the ``save()`` method will check for validation errors and
abort the save if any occur. We'll discuss how those errors are
handled in the following sections.

Data Validation
===============

Cake goes a long way in taking the monotony out of form input
validation. Everyone hates coding up endless forms and their
validation routines. CakePHP makes it easier and faster.

To take advantage of the validation features, you'll need to use
Cake's FormHelper in your views. The :php:class:`FormHelper` is available by
default to all views at ``$this->Form``.

Here's our add view::

    <!-- File: /app/View/Posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>

Here, we use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that ``$this->Form->create()`` generates::

    <form id="PostAddForm" method="post" action="/posts/add">

If ``create()`` is called with no parameters supplied, it assumes
you are building a form that submits to the current controller's
``add()`` action (or ``edit()`` action when ``id`` is included in
the form data), via POST.

The ``$this->Form->input()`` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and automagic here:
``input()`` will output different form elements based on the model
field specified.

The ``$this->Form->end()`` call generates a submit button and ends
the form. If a string is supplied as the first parameter to
``end()``, the FormHelper outputs a submit button named accordingly
along with the closing form tag. Again, refer to
:doc:`/views/helpers` for more on helpers.

Now let's go back and update our ``/app/View/Posts/index.ctp``
view to include a new "Add Post" link. Before the ``<table>``, add
the following line::

    <?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look
back at our Post model and make a few adjustments::

    <?php
    class Post extends AppModel {
        public $name = 'Post';
    
        public $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }

The ``$validate`` array tells CakePHP how to validate your data
when the ``save()`` method is called. Here, I've specified that
both the body and title fields must not be empty. CakePHP's
validation engine is strong, with a number of pre-built rules
(credit card numbers, email addresses, etc.) and flexibility for
adding your own validation rules. For more information on that
setup, check the :doc:`/models/data-validation`.

Now that you have your validation rules in place, use the app to
try to add a post with an empty title or body to see how it works.
Since we've used the :php:meth:`FormHelper::input()` method of the 
FormHelper to create our form elements, our validation error 
messages will be shown automatically.

Editing Posts
=============

Post editing: here we go. You're a CakePHP pro by now, so you
should have picked up a pattern. Make the action, then the view.
Here's what the ``edit()`` action of the PostsController would look
like::

    <?php
    function edit($id = null) {
        $this->Post->id = $id;
        if ($this->request->is('get')) {
            $this->request->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash('Unable to update your post.');
            }
        }
    }

This action first checks that the request is a GET request.  If it is, then
we find the Post and hand it to the view.  If the user request is not a GET, it
probably contains POST data.  We'll use the POST data to update our Post record 
with, or kick back and show the user the validation errors.

The edit view might look something like this::

    <!-- File: /app/View/Posts/edit.ctp -->
        
    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post', array('action' => 'edit'));
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden')); 
        echo $this->Form->end('Save Post');

This view outputs the edit form (with the values populated), along
with any necessary validation error messages.

One thing to note here: CakePHP will assume that you are editing a
model if the 'id' field is present in the data array. If no 'id' is
present (look back at our add view), Cake will assume that you are
inserting a new model when ``save()`` is called.

You can now update your index view with links to edit specific
posts::

    <!-- File: /app/View/Posts/index.ctp  (edit links added) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id']));?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Deleting Posts
==============

Next, let's make a way for users to delete posts. Start with a
``delete()`` action in the PostsController::

    <?php
    function delete($id) {
        if ($this->request->is('get')) {
            throw new MethodNotAllowedException();
        }
        if ($this->Post->delete($id)) {
            $this->Session->setFlash('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

This logic deletes the post specified by $id, and uses
``$this->Session->setFlash()`` to show the user a confirmation
message after redirecting them on to ``/posts``.  If the user attempts to
do a delete using a GET request, we throw an Exception.  Uncaught exceptions
are captured by CakePHP's exception handler, and a nice error page is 
displayed.  There are many built-in :doc:`/development/exceptions` that can
be used to indicate the various HTTP errors your application might need
to generate.

Because we're just executing some logic and redirecting, this
action has no view. You might want to update your index view with
links that allow users to delete posts, however::

    <!-- File: /app/View/Posts/index.ctp -->
    
    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>
    
    <!-- Here's where we loop through our $posts array, printing out post info -->
    
        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
                <?php echo $this->Form->postLink(
                    'Delete', 
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Are you sure?')); 
                ?>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id']));?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
        <?php endforeach; ?>
    
    </table>

Using :php:meth:`~FormHelper::postLink()` will create a link that uses
Javascript to do a POST request deleting our post.  Allowing content to be
deleted using GET requests is dangerous, as web crawlers could accidentally
delete all your content.

.. note::

    This view code also uses the FormHelper to prompt the user with a
    JavaScript confirmation dialog before they attempt to delete a
    post.

Routes
======

For some, CakePHP's default routing works well enough. Developers
who are sensitive to user-friendliness and general search engine
compatibility will appreciate the way that CakePHP's URLs map to
specific actions. So we'll just make a quick change to routes in
this tutorial.

For more information on advanced routing techniques, see
:ref:`routes-configuration`.

By default, CakePHP responds to a request for the root of your site
(i.e. http://www.example.com) using its PagesController, rendering
a view called "home". Instead, we'll replace this with our
PostsController by creating a routing rule.

Cake's routing is found in ``/app/Config/routes.php``. You'll want
to comment out or remove the line that defines the default root
route. It looks like this::

    <?php
    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));

This line connects the URL '/' with the default CakePHP home page.
We want it to connect with our own controller, so replace that line
with this one::

    <?php
    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

This should connect users requesting '/' to the index() action of
our PostsController.

.. note::

    CakePHP also makes use of 'reverse routing' - if with the above
    route defined you pass
    ``array('controller' => 'posts', 'action' => 'index')`` to a
    function expecting an array, the resultant URL used will be '/'.
    It's therefore a good idea to always use arrays for URLs as this
    means your routes define where a URL goes, and also ensures that
    links point to the same place too.

Conclusion
==========

Creating applications this way will win you peace, honor, love, and
money beyond even your wildest fantasies. Simple, isn't it? Keep in
mind that this tutorial was very basic. CakePHP has *many* more
features to offer, and is flexible in ways we didn't wish to cover
here for simplicity's sake. Use the rest of this manual as a guide
for building more feature-rich applications.

Now that you've created a basic Cake application you're ready for
the real thing. Start your own project, read the rest of the
`Manual </>`_ and `API <http://api20.cakephp.org>`_.

If you need help, come see us in #cakephp. Welcome to CakePHP!

Suggested Follow-up Reading
---------------------------

These are common tasks people learning CakePHP usually want to study next:

1. :ref:`view-layouts`: Customizing your website layout
2. :ref:`view-elements` Including and reusing view snippets
3. :doc:`/controllers/scaffolding`: Prototyping before creating code
4. :doc:`/console-and-shells/code-generation-with-bake` Generating basic CRUD code
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`: User authentication and authorization tutorial


.. meta::
    :title lang=en: Blog Tutorial Adding a Layer
    :keywords lang=en: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
