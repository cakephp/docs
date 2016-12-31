Blog
####

Welcome to Cake! You're probably checking out this tutorial because you
want to learn more about how Cake works. It's our aim to increase
productivity and make coding more enjoyable: we hope you'll see this as
you dive into the code.

This tutorial will walk you through the creation of a simple blog
application. We'll be getting and installing Cake, creating and
configuring a database, and creating enough application logic to list,
add, edit, and delete blog posts.

Here's what you'll need:

#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get Cake up and running without any
   configuration at all.
#. A database server. We're going to be using mySQL in this tutorial.
   You'll need to know enough about SQL in order to create a database:
   Cake will be taking the reins from there.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.
#. Finally, you'll need a basic knowledge of the MVC programming
   pattern. A quick overview can be found in Chapter "Beginning With
   CakePHP", Section : :doc:`/The-Manual/Beginning-With-CakePHP/Understanding-Model-View-Controller`. Don't worry: its only a half a
   page or so.

Let's get started!

Getting Cake
============

First, let's get a copy of fresh Cake code.

To get a fresh download, visit the CakePHP project on github:
https://github.com/cakephp/cakephp/downloads and download the latest
*1.2.x.x* release.

You can also use git to clone the repository, and checkout the 1.2
branch for the latest development code for this branch.

Regardless of how you downloaded it, place the code inside of your
DocumentRoot. Once finished, your directory setup should look something
like the following:

::

    /path_to_document_root
        /app
        /cake
        /docs
        /vendors
        .htaccess
        index.php

Now might be a good time to learn a bit about how Cake's directory
structure works: check out Chapter "Basic Principles of CakePHP",
Section : :doc:`/The-Manual/Basic-Principles-of-CakePHP/CakePHP-Folder-Structure`.

Creating the Blog Database
==========================

Next, lets set up the underlying database for our blog. if you haven't
already done so, create an empty database for use in this tutorial, with
a name of your choice. Right now, we'll just create a single table to
store our posts. We'll also throw in a few posts right now to use for
testing purposes. Execute the following SQL statements into your
database:

::

    /* First, create our posts table: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Then insert some posts for testing: */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you follow
Cake's database naming conventions, and Cake's class naming conventions
(both outlined in :doc:`/The-Manual/Basic-Principles-of-CakePHP/CakePHP-Conventions`), you'll be able
to take advantage of a lot of free functionality and avoid
configuration. Cake is flexible enough to accomodate even the worst
legacy database schema, but adhering to convention will save you time.

Check out :doc:`/The-Manual/Basic-Principles-of-CakePHP/CakePHP-Conventions` for more information, but
suffice it to say that naming our table 'posts' automatically hooks it
to our Post model, and having fields called 'modified' and 'created'
will be automagically managed by Cake.

Cake Database Configuration
===========================

Onward and upward: let's tell Cake where our database is and how to
connect to it. For many, this is the first and last time you configure
anything.

A copy of CakePHP's database configuration file is found in
``/app/config/database.php.default``. Make a copy of this file in the
same directory, but name it ``database.php``.

The config file should be pretty straightforward: just replace the
values in the ``$default`` array with those that apply to your setup. A
sample completed configuration array might look something like the
following:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Once you've saved your new ``database.php`` file, you should be able to
open your browser and see the Cake welcome page. It should also tell you
that your database connection file was found, and that Cake can
successfully connect to the database.

Optional Configuration
======================

There are two other items that can be configured. Most developers
complete these laundry-list items, but they're not required for this
tutorial. One is defining a custom string (or "salt") for use in
security hashes. The second item is allowing CakePHP write access to its
``tmp`` folder.

The security salt is used for generating hashes. Change the default salt
value by editing ``/app/config/core.php`` line 153. It doesn't much
matter what the new value is, as long as it's not easily guessed.

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

The final task is to make the ``app/tmp`` directory web-writable. The
best way to do this is to find out what user your webserver runs as
(``<?php echo `whoami`; ?>``) and change the ownership of the
``app/tmp`` directory to that user. The final command you run (in \*nix)
might look something like this.

::

    $ chown -R www-data app/tmp

If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.

A Note on mod\_rewrite
======================

Occasionally a new user will run in to mod\_rewrite issues, so I'll
mention them marginally here. If the CakePHP welcome page looks a little
funny (no images or css styles), it probably means mod\_rewrite isn't
functioning on your system. Here are some tips to help get you up and
running:

#. Make sure that an .htaccess override is allowed: in your httpd.conf,
   you should have a section that defines a section for each Directory
   on your server. Make sure the ``AllowOverride`` is set to ``All`` for
   the correct Directory. For security and performance reasons, do *not*
   set ``AllowOverride`` to ``All`` in ``<Directory />``. Instead, look
   for the ``<Directory>`` block that refers to your actual website
   directory.

#. Make sure you are editing the correct httpd.conf rather than a user-
   or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of CakePHP
   without the needed .htaccess files. This sometimes happens because
   some operating systems treat files that start with '.' as hidden, and
   don't copy them. Make sure your copy of CakePHP is from the downloads
   section of the site or our SVN repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You should see
   something like
   ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``
   or (for Apache 1.3) ``AddModule             mod_rewrite.c`` in your
   httpd.conf.

If you don't want or can't get mod\_rewrite (or some other compatible
module) up and running on your server, you'll need to use Cake's built
in pretty URLs. In ``/app/config/core.php``, uncomment the line that
looks like:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Also remove these .htaccess files:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather than
www.example.com/controllername/actionname/param.

Create a Post Model
===================

The Model class is the bread and butter of CakePHP applications. By
creating a CakePHP model that will interact with our database, we'll
have the foundation in place needed to do our view, add, edit, and
delete operations later.

CakePHP's model class files go in ``/app/models``, and the file we'll be
creating will be saved to ``/app/models/post.php``. The completed file
should look like this:

::

    <?php

    class Post extends AppModel {
        var $name = 'Post';
    }

    ?>

Naming convention is very important in CakePHP. By naming our model
Post, CakePHP can automatically infer that this model will be used in
the PostsController, and will be tied to a database table called
``posts``.

CakePHP will dynamically create a model object for you, if it cannot
find a corresponding file in /app/models. This also means, that if you
accidentally name your file wrong (i.e. Post.php or posts.php) CakePHP
will not recognize any of your settings and will use the defaults
instead.

The ``$name`` variable is always a good idea to add, and is used to
overcome some class name oddness in PHP4.

For more on models, such as table prefixes, callbacks, and validation,
check out the :doc:`/The-Manual/Developing-with-CakePHP/Models` chapter of the Manual.

Create a Posts Controller
=========================

Next, we'll create a controller for our posts. The controller is where
all the business logic for post interaction will happen. In a nutshell,
it's the place where you play with the models and get post-related work
done. We'll place this new controller in a file called
``posts_controller.php`` inside the ``/app/controllers`` directory.
Here's what the basic controller should look like:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';
    }
    ?>

Now, lets add an action to our controller. Actions often represent a
single function or interface in an application. For example, when users
request www.example.com/posts/index (which is also the same as
www.example.com/posts/), they might expect to see a listing of posts.
The code for that action would look something like this:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

Let me explain the action a bit. By defining function ``index()`` in our
PostsController, users can now access the logic there by requesting
www.example.com/posts/index. Similarly, if we were to define a function
called ``foobar()``, users would be able to access that at
www.example.com/posts/foobar. Remember if you are set up with `pretty
URLs <https://book.cakephp.org/view/333/A-Note-on-mod_rewrite>`_, you'll
need to request www.example.com/index.php/posts/index instead.

You may be tempted to name your controllers and actions a certain way to
obtain a certain URL. Resist that temptation. Follow CakePHP conventions
(plural controller names, etc.) and create readable, understandable
action names. You can map URLs to your code using "routes" covered later
on.

The single instruction in the action uses ``set()`` to pass data from
the controller to the view (which we'll create next). The line sets the
view variable called 'posts' equal to the return value of the
``find('all')`` method of the Post model. Our Post model is
automatically available at ``$this->Post`` because we've followed Cake's
naming conventions.

To learn more about Cake's controllers, check out Chapter "Developing
with CakePHP" section: :doc:`/The-Manual/Developing-with-CakePHP/Controllers`.

Creating Post Views
===================

Now that we have our data flowing to our model, and our application
logic and flow defined by our controller, let's create a view for the
index action we created above.

Cake views are just presentation-flavored fragments that fit inside an
application's layout. For most applications they're HTML mixed with PHP,
but they may end up as XML, CSV, or even binary data.

Layouts are presentation code that is wrapped around a view, and can be
defined and switched between, but for now, let's just use the default.

Remember in the last section how we assigned the 'posts' variable to the
view using the ``set()`` method? That would hand down data to the view
that would look something like this:

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

Cake's view files are stored in ``/app/views`` inside a folder named
after the controller they correspond to (we'll have to create a folder
named 'posts' in this case). To format this post data in a nice table,
our view code might look something like this:

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
                <?php echo $html->link($post['Post']['title'], 
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Hopefully this should look somewhat simple.

You might have noticed the use of an object called ``$html``. This is an
instance of the CakePHP ``HtmlHelper`` class. CakePHP comes with a set
of view helpers that make things like linking, form output, JavaScript
and Ajax a snap. You can learn more about how to use them in :doc:`/The-Manual/Core-Helpers`, but what's important to note here is
that the ``link()`` method will generate an HTML link with the given
title (the first parameter) and URL (the second parameter).

When specifying URLs in Cake, you simply give a path relative to the
base of the application, and Cake fills in the rest. As such, your URLs
will typically take the form of /controller/action/param1/param2.

At this point, you should be able to point your browser to
http://www.example.com/posts/index. You should see your view, correctly
formatted with the title and table listing of the posts.

If you happened to have clicked on one of the links we created in this
view (that link a post's title to a URL /posts/view/some\_id), you were
probably informed by CakePHP that the action hasn't yet been defined. If
you were not so informed, either something has gone wrong, or you
actually did define it already, in which case you are very sneaky.
Otherwise, we'll create it in the PostsController now:

::

    <?php
    class PostsController extends AppController {

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

The ``set()`` call should look familiar. Notice we're using ``read()``
rather than ``find('all')`` because we only really want a single post's
information.

Notice that our view action takes a parameter: the ID of the post we'd
like to see. This parameter is handed to the action through the
requested URL. If a user requests /posts/view/3, then the value '3' is
passed as ``$id``.

Now let's create the view for our new 'view' action and place it in
/app/views/posts/view.ctp.

::

    <!-- File: /app/views/posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Verify that this is working by trying the links at /posts/index or
manually requesting a post by accessing /posts/view/1.

Adding Posts
============

Reading from the database and showing us the posts is a great start, but
let's allow for the adding of new posts.

First, start by creating an ``add()`` action in the PostsController:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

Here's what the ``add()`` action does: if the submitted form data isn't
empty, try to save the data using the Post model. If for some reason it
doesn't save, just render the view. This gives us a chance to show the
user validation errors or other warnings.

When a user uses a form to POST data to your application, that
information is available in ``$this->data``. You can use the ``pr()`` or
``debug`` functions to print it out if you want to see what it looks
like.

We use the ``Session`` component's
```setFlash()`:doc:`/The-Manual/Core-Components/Sessions` function to set a message to a
session variable to be displayed on the page after redirection. In the
layout we have ```$session->flash()`:doc:`/The-Manual/Core-Helpers/Session` which displays
the message and clears the corresponding session variable. The
controller's ```redirect`:doc:`/The-Manual/Developing-with-CakePHP/Controllers` function redirects to
another URL. The param ``array('action'=>'index)`` translates to URL
/posts i.e the index action of posts controller. You can refer to
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_
function on the api to see the formats in which you can specify a URL
for various cake functions.

Calling the ``save()`` method will check for validation errors and abort
the save if any occur. We'll discuss how those errors are handled in the
following sections.

Data Validation
===============

Cake goes a long way in taking the monotony out of form input
validation. Everyone hates coding up endless forms and their validation
routines. CakePHP makes it easier and faster.

To take advantage of the validation features, you'll need to use Cake's
FormHelper in your views. The FormHelper is available by default to all
views at ``$form``.

Here's our add view:

::

    <!-- File: /app/views/posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Save Post');
    ?>

Here, we use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that ``$form->create()`` generates:

::

    <form id="PostAddForm" method="post" action="/posts/add">

If ``create()`` is called with no parameters supplied, it assumes you
are building a form that submits to the current controller's ``add()``
action (or ``edit()`` action when ``id`` is included in the form data),
via POST.

The ``$form->input()`` method is used to create form elements of the
same name. The first parameter tells CakePHP which field they correspond
to, and the second parameter allows you to specify a wide array of
options - in this case, the number of rows for the textarea. There's a
bit of introspection and automagic here: ``input()`` will output
different form elements based on the model field specified.

The ``$form->end()`` call generates a submit button and ends the form.
If a string is supplied as the first parameter to ``end()``, the
FormHelper outputs a submit button named accordingly along with the
closing form tag. Again, refer to :doc:`/The-Manual/Core-Helpers` for more on helpers.

Now let's go back and update our ``/app/views/posts/index.ctp`` view to
include a new "Add Post" link. Before the ``<table>``, add the following
line:

::

    <?php echo $html->link('Add Post',array('controller' => 'posts', 'action' => 'add'))?>

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look back
at our Post model and make a few adjustments:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>

The ``$validate`` array tells CakePHP how to validate your data when the
``save()`` method is called. Here, I've specified that both the body and
title fields must not be empty. CakePHP's validation engine is strong,
with a number of pre-built rules (credit card numbers, email addresses,
etc.) and flexibility for adding your own validation rules. For more
information on that setup, check the :doc:`/The-Manual/Common-Tasks-With-CakePHP/Data-Validation`.

Now that you have your validation rules in place, use the app to try to
add a post with an empty title or body to see how it works. Since we've
used the ``input()`` method of the FormHelper to create our form
elements, our validation error messages will be shown automatically.

Deleting Posts
==============

Next, let's make a way for users to delete posts. Start with a
``delete()`` action in the PostsController:

::

    function delete($id) {
        $this->Post->delete($id);
        $this->Session->setFlash('The post with id: '.$id.' has been deleted.');
        $this->redirect(array('action'=>'index'));
    }

This logic deletes the post specified by $id, and uses
``$this->Session->setFlash()`` to show the user a confirmation message
after redirecting them on to /posts.

Because we're just executing some logic and redirecting, this action has
no view. You might want to update your index view with links that allow
users to delete posts, however:

::

    <!-- File: /app/views/posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Add Post', array('action' => 'add')); ?></p>
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
            <?php echo $html->link($post['Post']['title'], array('action' => 'view',$post['Post']['id']));?>
            </td>
            <td>
            <?php echo $html->link('Delete', array('action' => 'delete', $post['Post']['id']), null, 'Are you sure?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

This view code also uses the HtmlHelper to prompt the user with a
JavaScript confirmation dialog before they attempt to delete a post.

Editing Posts
=============

Post editing: here we go. You're a CakePHP pro by now, so you should
have picked up a pattern. Make the action, then the view. Here's what
the ``edit()`` action of the PostsController would look like:

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

This action first checks for submitted form data. If nothing was
submitted, it finds the Post and hands it to the view. If some data
*has* been submitted, try to save the data using Post model (or kick
back and show the user the validation errors).

The edit view might look something like this:

::

    <!-- File: /app/views/posts/edit.ctp -->
        
    <h1>Edit Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
        echo $form->input('id', array('type'=>'hidden')); 
        echo $form->end('Save Post');
    ?>

This view outputs the edit form (with the values populated), along with
any necessary validation error messages.

One thing to note here: CakePHP will assume that you are editing a model
if the 'id' field is present in the data array. If no 'id' is present
(look back at our add view), Cake will assume that you are inserting a
new model when ``save()`` is called.

You can now update your index view with links to edit specific posts:

::

    <!-- File: /app/views/posts/index.ctp  (edit links added) -->
        
    <h1>Blog posts</h1>
    <p><?php echo $html->link("Add Post", array('action'=>'add')); ?>
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
                <?php echo $html->link($post['Post']['title'],array('action'=>'view', 'id'=>$post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $html->link(
                    'Delete', 
                    array('action'=>'delete', 'id'=>$post['Post']['id']), 
                    null, 
                    'Are you sure?'
                )?>
                <?php echo $html->link('Edit', array('action'=>'edit', 'id'=>$post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Routes
======

For some, CakePHP's default routing works well enough. Developers who
are sensitive to user-friendliness and general search engine
compatibility will appreciate the way that CakePHP's URLs map to
specific actions. So we'll just make a quick change to routes in this
tutorial.

For more information on advanced routing techniques, see :doc:`/The-Manual/Developing-with-CakePHP/Configuration`.

By default, CakePHP responds to a request for the root of your site
(i.e. http://www.example.com) using its PagesController, rendering a
view called "home". Instead, we'll replace this with our PostsController
by creating a routing rule.

Cake's routing is found in ``/app/config/routes.php``. You'll want to
comment out or remove the line that defines the default root route. It
looks like this:

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

This line connects the URL '/' with the default CakePHP home page. We
want it to connect with our own controller, so add a line that looks
like this:

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

This should connect users requesting '/' to the index() action of our
soon-to-be-created PostsController.

CakePHP also makes use of 'reverse routing' - if with the above route
defined you pass ``array('controller'=>'posts', 'action'=>'index')`` to
a function expecting an array, the resultant url used will be '/'. It's
therefore a good idea to always use arrays for urls as this means your
routes define where a url goes, and also ensures that links point to the
same place too.

Conclusion
==========

Creating applications this way will win you peace, honor, love, and
money beyond even your wildest fantasies. Simple, isn't it? Keep in mind
that this tutorial was very basic. CakePHP has *many* more features to
offer, and is flexible in ways we didn't wish to cover here for
simplicity's sake. Use the rest of this manual as a guide for building
more feature-rich applications.

Now that you've created a basic Cake application you're ready for the
real thing. Start your own project, read the rest of the `Manual </>`_
and `API <https://api.cakephp.org>`_.

If you need help, come see us in #cakephp. Welcome to CakePHP!
