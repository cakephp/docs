The Manual
##########

Welcome to the CakePHP 1.1 Manual.

View Caching
============

Since 0.10.9.2378\_final, Cake has support for view caching (also called
Full Page Caching ). No, we are not kidding. You can now cache your
layouts and views. You can also mark parts of your views to be ignored
by the caching mechanism. The feature, when used wisely, can increase
the speed of your app by a considerable amount.

When you request a URL, Cake first looks to see if the requested URL
isn't already cached. If it is, Cake bypasses the dispatcher and returns
the already rendered, cached version of the page. If the page isn't in
the cache, Cake behaves normally.

If you've activated Cake's caching features, Cake will store the output
of its normal operation in the cache for future user. The next time the
page is requested, Cake will fetch it from the cache. Neat, eh? Let's
dig in to see how it works.

How Does it Work ?
==================

Activating the cache
--------------------

By default, view caching is disabled. To activate it, you first need to
change the value of **CACHE\_CHECK** in **/app/config/core.php** from
false to true:

/app/config/core.php (partial)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    define ('CACHE_CHECK', true);

This line tells Cake that you want to enable View Caching.

In the controller for the views you want to cache you have to add the
**Cache** helper to the helpers array::

    <?php
    var $helpers = array('Cache');

Next, you'll need to specify what you want to cache.

The $cacheAction Controller Variable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In this section, we will show you how to tell Cake what to cache. This
is done by setting a controller variable called $cacheAction. The
$cacheAction variable should be set to an array that contains the
actions you want to be cached, and the time (in seconds) you want the
cache to keep its data. The time value can also be a strtotime()
friendly string (i.e. '1 day' or '60 seconds').

Let's say we had a ProductsController, with some things that we'd like
to cache. The following examples show how to use $cacheAction to tell
Cake to cache certain parts of the controller's actions.

$cacheAction Examples
~~~~~~~~~~~~~~~~~~~~~

Cache a few of the most oft visited product pages for six hours::

    <?php
    var $cacheAction = array(
        'view/23/'  => 21600,
        'view/48/'  => 21600
    );

Cache an entire action. In this case the recalled product list, for one
day::

    <?php
    var $cacheAction = array('recalled/' => 86400);

If we wanted to, we could cache every action by setting it to a string
that is strtotime() friendly to indicate the caching time::

    <?php
    var $cacheAction = "1 hour";

You can also define caching in the actions using
``$this->cacheAction = array()``

Marking Content in the View
~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are instances where you might not want parts of a view cached. If
you've got some sort of element highlighting new products, or something
similar, you might want to tell Cake to cache the view... except for a
small part.

You can tell Cake not to cache content in your views by wrapping
<cake:nocache> </cake:nocache> tags around content you want the caching
engine to skip.

<cake:nocache> example
~~~~~~~~~~~~~~~~~~~~~~

::

    <h1> New Products! </h1>
    <cake:nocache>
    <ul>
    <?php foreach($newProducts as $product): ?>
    <li>$product['name']</li>
    <?endforeach;?>
    </ul>
    </cake:nocache>

Clearing the cache
~~~~~~~~~~~~~~~~~~

First, you should be aware that Cake will automatically clear the cache
if a database change has been made. For example, if one of your views
uses information from your Post model, and there has been an INSERT,
UPDATE, or DELETE made to a Post, Cake will clear the cache for that
view.

But there may be cases where you'll want to clear specific cache files
yourself. To do that Cake provides the clearCache function, which is
globally available:

clearCache example
~~~~~~~~~~~~~~~~~~

::

    <?php
    //Remove all cached pages that have the controller name.
    clearCache('controller');

    //Remove all cached pages that have the controller_action name.
    clearCache('controller_action/');

    //Remove all cached pages that have the controller_action_params name. 
    //Note: you can have multiple params
    clearCache('controller_action_params'); 

    //You can also use an array to clear muliple caches at once.
    clearCache(array('controller_action_params','controller2_action_params)); 

Things To Remember
------------------

Below are a few things to remember about View Caching:

#. To enable cache you set **CACHE\_CHECK** to true
   in\ **/app/config/core.php** .

#. In the controller for the views you want to cache you have to add the
   **Cache** helper to the helpers array.

#. To cache certain URLs, use **$cacheAction** in the controller.

#. To stop certain parts of a view from being cached, wrap them with
   **<cake:nocache> </cake:nocache>**

#. Cake automatically clears specific cache copies when changes are made
   to the database

#. To manually clear parts of the cache, use **clearCache()**.

The Cake Blog Tutorial
======================

Welcome to Cake! You're probably checking out this tutorial because you
want to learn more about how Cake works. Its our aim to increase
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
   Cake will be taking the reigns from there.

#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.

#. Finally, you'll need a basic knowledge of the MVC programming
   pattern. A quick overview can be found in :doc:`basic-concepts`,
   Section 2: The MVC Pattern. Don't worry: its only a half a page or
   so.

Let's get started!

Getting Cake
------------

First, let's get a copy of fresh Cake code.

To get a fresh download, visit the CakePHP project at Cakeforge:
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_
and download the stable release.

You can also checkout/export a fresh copy of our trunk code at:
`https://svn.cakephp.org/repo/trunk/cake/1.x.x.x/ <https://svn.cakephp.org/repo/trunk/cake/1.x.x.x/>`_

Regardless of how you downloaded it, place the code inside of your
DocumentRoot. Once finished, your directory setup should look something
like the following::

    /path_to_document_root
        /app
        /cake
        /vendors
        .htaccess
        index.php
        VERSION.txt

Now might be a good time to learn a bit about how Cake's directory
structure works: check out :doc:`basic-concepts`, Section

Overview of the Cake File Layout.
=================================


Creating the Blog Database
--------------------------

Next, lets set up the underlying database for our blog. Right now, we'll
just create a single table to store our posts. We'll also throw in a few
posts right now to use for testing purposes. Execute the following SQL
statements into your database::

    /* First, create our posts table: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NOT NULL,
        modified DATETIME DEFAULT NOT NULL
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
(both outlined in `Appendix "Cake
Conventions" <https://book.cakephp.org/appendix/conventions>`_), you'll
be able to take advantage of a lot of free functionality and avoid
configuration. Cake is flexible enough to accomodate even the worst
legacy database schema, but adhering to convention will save you time.

Check out `Appendix "Cake
Conventions" <https://book.cakephp.org/appendix/conventions>`_ for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by Cake.

Cake Database Configuration
---------------------------

Onward and upward: let's tell Cake where our database is and how to
connect to it. This will be the first and last time you configure
anything.

A copy of Cake's database configuration file is found in
**/app/config/database.php.default**. Make a copy of this file in the
same directory, but name it **database.php**.

The config file should be pretty straightforward: just replace the
values in the $default array with those that apply to your setup. A
sample completed configuration array might look something like the
following::

    <?php
    var $default = array('driver'   => 'mysql',
                         'connect'  => 'mysql_pconnect',
                         'host'     => 'localhost',
                         'login'    => 'cakeBlog',
                         'password' => 'c4k3-rUl3Z',
                         'database' => 'cake_blog_tutorial' );

Once you've saved your new database.php file, you should be able to open
your browser and see the Cake welcome page. It should also tell you that
your database connection file was found, and that Cake can successfully
connect to the database.

A Note On mod\_rewrite
----------------------

Occasionally a new user will run in to mod\_rewrite issues, so I'll
mention them marginally here. If the Cake welcome page looks a little
funny (no images or css styles), it probably means mod\_rewrite isn't
functioning on your system. Here are some tips to help get you up and
running:

#. Make sure that an .htaccess override is allowed: in your httpd.conf,
   you should have a section that defines a section for each Directory
   on your server. Make sure the **AllowOverride** is set to **All** for
   the correct Directory.

#. Make sure you are editing the system httpd.conf rather than a user-
   or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of CakePHP
   without the needed .htaccess files. This sometimes happens because
   some operating systems treat files that start with '.' as hidden, and
   don't copy them. Make sure your copy of CakePHP is from the downloads
   section of the site or our SVN repository.

#. Make sure you are loading up mod\_rewrite correctly! You should see
   something like **LoadModule rewrite\_module
   libexec/httpd/mod\_rewrite.so** and **AddModule mod\_rewrite.c** in
   your httpd.conf.

If you don't want or can't get mod\_rewrite (or some other compatible
module) up and running on your server, you'll need to use Cake's built
in pretty URLs. In **/app/config/core.php**, uncomment the line that
looks like::

    <?php
    define ('BASE_URL', env('SCRIPT_NAME'));

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather than
www.example.com/controllername/actionname/param.

Create a Post Model
-------------------

The model class is the bread and butter of CakePHP applications. By
creating a Cake model that will interact with our database, we'll have
the foundation in place needed to do our view, add, edit, and delete
operations later.

Cake's model class files go in **/app/models**, and the file we will be
creating will be saved to **/app/models/post.php**. The completed file
should look like this:

/app/models/post.php
~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class Post extends AppModel
    {
        var $name = 'Post';
    }

    ?>

Because of the way the class and file are named, this tells Cake that
you want a Post model available in your PostsController that is tied to
a table in your default database called 'posts'.

The $name variable is always a good idea to add, and is used to overcome
some class name oddness in PHP4.

For more on models, such as table prefixes, callbacks, and validation,
check out :doc:`models`.

Create a Posts Controller
-------------------------

Next we'll create a controller for our posts. The controller is where
all the logic for post interaction will happen, and its also where all
the actions for this model will be found. You should place this new
controller in a file called **posts\_controller.php** inside your
**/app/controllers** directory. Here's what the basic controller should
look like:

/app/controllers/posts\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PostsController extends AppController
    {
        var $name = 'Posts';
    }

    ?>

Now, lets add an action to our controller. When users request
www.example.com/posts, this is the same as requesting
www.example.com/posts/index. Since we want our readers to view a list of
posts when they access that URL, the index action would look something
like this:

/app/controllers/posts\_controller.php (index action added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PostsController extends AppController
    {
        var $name = 'Posts';

        function index()
        {
            $this->set('posts', $this->Post->findAll());
        }
    }

    ?>

Let me explain the action a bit. By defining function index() in our
PostsController, users can now access the logic there by requesting
www.example.com/posts/index. Similarly, if we were to define a function
called foobar(), users would be able to access that at
www.example.com/posts/foobar.

The single instruction in the action uses set() to pass data to the view
(which we'll create next). The line sets the view variable called
'posts' equal to the return value of the findAll() method of the Post
model. Our Post model is automatically available at $this->Post because
we've followed Cake's naming conventions.

To learn more about Cake's controllers, check out :doc:`controllers`.

Creating Post Views
-------------------

Now that we have our database connected using our model, and our
application logic and flow defined by our controller, let's create a
view for the index action we defined above.

Cake views are just HTML and PHP flavored fragments that fit inside an
application's layout. Layouts can be defined and switched between, but
for now, let's just use the default.

Remember in the last section how we assigned the 'posts' variable to the
view using the set() method? That would hand down data to the view that
would look something like this::

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
                        [created] => 2006-03-08 14:42:22
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
                        [created] => 2006-03-08 14:42:23
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
                        [created] => 2006-03-08 14:42:24
                        [modified] =>
                    )
             )
    )

Cake's view files are stored in **/app/views** inside a folder named
after the controller they correspond to (we'll have to create a folder
named 'posts' in this case). To format this post data in a nice table,
our view code might look something like this:

/app/views/posts/index.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

       <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Hopefully this should look somewhat simple.

You might have noticed the use of an object called **$html**. This is an
instance of the **HtmlHelper** class. Cake comes with a set of view 'helpers'
that make things like linking, form output, JavaScript and Ajax a snap. You can
learn more about how to use them in :doc:`helpers`, but what's important to note
here is that the **link()** method will generate an HTML link with the given
title (the first parameter) and URL (the second parameter).

When specifying URL's in Cake, you simply give a path relative to the
base of the application, and Cake fills in the rest. As such, your URL's
will typically take the form of **/controller/action/id**.

Now you should be able to point your browser to
http://www.example.com/posts/index. You should see your view, correctly
formatted with the title and table listing of the posts.

If you happened to have clicked on one of the links we created in this
view (that link a post's title to a URL **/posts/view/some\_id**), you
were probably informed by Cake that the action hasn't yet been defined.
If you were not so informed, either something has gone wrong, or you
actually did define it already, in which case you are very sneaky.
Otherwise, we'll create it now:

/app/controllers/posts\_controller.php (view action added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PostsController extends AppController
    {

        var $name = 'Posts';

        function index()
        {
              $this->set('posts', $this->Post->findAll());
        }

        function view($id = null)
        {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }

    ?>

The set() call should look familiar. Notice we're using read() rather
than findAll() because we only really want a single post's information.

Notice that our view action takes a parameter. This parameter is handed
to the action by the URL called. If a user requests /posts/view/3, then
the value '3' is passed as $id.

Now let's create the view for our new 'view' action and place it in
/app/views/posts/view.thtml.

/app/views/posts/view.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Verify that this is working by trying the links at /posts/index or
manually requesting a post by accessing /posts/view/1.

Adding Posts
------------

reading from the database and showing us the posts is fine and dandy,
but let's allow for the adding of new posts.

First, start with the add() action in the PostsController:

/app/controllers/posts\_controller.php (add action added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class PostsController extends AppController
    {
        var $name = 'Posts';

        function index()
        {
             $this->set('posts', $this->Post->findAll());
        }

        function view($id)
        {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add()
        {
            if (!empty($this->data))
            {
                if ($this->Post->save($this->data))
                {
                    $this->flash('Your post has been saved.','/posts');
                }
            }
        }
    }

    ?>

Let me read the add() action for you in plain English: if the form data
isn't empty, try to save the post model using that data. If for some
reason it doesn't save, give me the data validation errors and render
the view showing those errors.

When a user uses a form to POST data to your application, that
information is available in $this->params. You can pr() that out if you
want to see what it looks like. $this->data is an alias for
$this->params['data'].

The $this->flash() function called is a controller function that flashes
a message to the user for a second (using the flash layout) then
forwards the user on to another URL (/posts, in this case). If DEBUG is
set to 0 $this->flash() will redirect automatically, however, if DEBUG >
0 then you will be able to see the flash layout and click on the message
to handle the redirect.

Calling the save() method will check for validation errors and will not
save if any occur. There are several methods available so you can check
for validation errors, but we talk about the validateErrors() call in a
bit, so keep that on the back burner for a moment while I show you what
the view looks like when we move on to the section about data
validation.

Data Validation
---------------

Cake goes a long way in taking the monotony out of form input
validation. Everyone hates coding up endless forms and their validation
routines, and Cake makes it easier and faster.

To take advantage of the validation features, you'll need to use Cake's
HtmlHelper in your views. The HtmlHelper is available by default to all
views at $html.

Here's our add view:

/app/views/posts/add.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Add Post</h1>
    <form method="post" action="<?php echo $html->url('/posts/add')?>">
        <p>
            Title:
            <?php echo $html->input('Post/title', array('size' => '40'))?>
            <?php echo $html->tagErrorMsg('Post/title', 'Title is required.') ?>
        </p>
        <p>
            Body:
            <?php echo $html->textarea('Post/body', array('rows'=>'10')) ?>
            <?php echo $html->tagErrorMsg('Post/body', 'Body is required.') ?>
        </p>
        <p>
            <?php echo $html->submit('Save') ?>
        </p>
    </form>

As with **$html->link()**, **$html->url()** will generate a proper URL
from the controller and action we have given it. By default, it prints
out a POST form tag, but this can be modified by the second parameter.
The **$html->input()** and **$html->textarea()** functions spit out form
elements of the same name. The first parameter tells Cake which
model/field they correspond to, and the second param is for extra HTML
attributes (like the size of the input field). Again, refer to :doc:`helpers`
for more on helpers.

The **tagErrorMsg()** function calls will output the error messages in
case there is a validation problem.

If you'd like, you can update your **/app/views/posts/index.thtml** view
to include a new "Add Post" link that points to
`www.example.com/posts/add <http://www.example.com/posts/add>`_.

That seems cool enough, but how do I tell Cake about my validation
requirements? This is where we come back to the model.

/app/models/post.php (validation array added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php

    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(

            'title'  => VALID_NOT_EMPTY,
            'body'   => VALID_NOT_EMPTY

        );
    }

    ?>

The **$validate** array tells Cake how to validate your data when the
**save()** method is called. The values for those keys are just
constants set by Cake that translate to regex matches (see
**/cake/libs/validators.php**). Right now Cake's validation is regex
based, but you can also use Model::invalidate() to set your own
validation dynamically.

Now that you have your validation in place, use the app to try to add a
post without a title or body to see how it works.

Deleting Posts
--------------

Next, let's make a way for users to delete posts. Start with a delete()
action in the PostsController:

/app/controllers/posts\_controller.php (delete action only)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    function delete($id)
    {
        $this->Post->del($id);
        $this->flash('The post with id: '.$id.' has been deleted.', '/posts');
    }

This logic deletes the post specified by $id, and uses flash() to show
the user a confirmation message before redirecting them on to /posts.

Because we're just executing some logic and redirecting, this action has
no view. You might want to update your index view to allow users to
delete posts, however.

/app/views/posts/index.thtml (add and delete links added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Add Post', '/posts/add'); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

       <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], '/posts/view/'.$post['Post']['id']);?>
                <?php echo $html->link(
                    'Delete',
                    "/posts/delete/{$post['Post']['id']}",
                    null,
                    'Are you sure?'
                )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

This view code also uses the HtmlHelper to prompt the user with a
JavaScript confirmation dialog before they attempt to delete a post.

Editing Posts
-------------

So... post editing: here we go. You're a Cake pro by now, so you should
have picked up a pattern. Make the action, then the view. Here's what
the edit action of the Posts Controller would look like:

/app/controllers/posts\_controller.php (edit action only)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    function edit($id = null)
    {
        if (empty($this->data))
        {
            $this->Post->id = $id;
            $this->data = $this->Post->read();
        }
        else
        {
            if ($this->Post->save($this->data['Post']))
            {
                $this->flash('Your post has been updated.','/posts');
            }
        }
    }

This checks for submitted form data. If nothing was submitted, go find
the Post and hand it to the view. If some data has been submitted, try
to save the Post model (or kick back and show the user the validation
errors).

The edit view might look something like this:

/app/views/posts/edit.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Edit Post</h1>
    <form method="post" action="<?php echo $html->url('/posts/edit')?>">
        <?php echo $html->hidden('Post/id'); ?>
        <p>
            Title:
            <?php echo $html->input('Post/title', array('size' => '40'))?>
            <?php echo $html->tagErrorMsg('Post/title', 'Title is required.') ?>
        </p>
        <p>
            Body:
            <?php echo $html->textarea('Post/body', array('rows'=>'10')) ?>
            <?php echo $html->tagErrorMsg('Post/body', 'Body is required.') ?>
        </p>
        <p>
            <?php echo $html->submit('Save') ?>
        </p>
    </form>

This view ouputs the edit form (with the values populated), and the
necessary error messages (if present). One thing to note here: Cake will
assume that you are edititing a model if the 'id' field is present and
exists in a currently stored model. If no 'id' is present (look back at
our add view), Cake will assume that you are inserting a new model when
save() is called.

You can now update your index view with links to edit specific posts:

/app/views/posts/index.thtml (edit links added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h1>Blog posts</h1>
    <p><?php echo $html->link("Add Post", "/posts/add"); ?>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

       <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], '/posts/view/'.$post['Post']['id']);?>
                <?php echo $html->link(
                    'Delete',
                    "/posts/delete/{$post['Post']['id']}",
                    null,
                    'Are you sure?'
                )?>
                <?php echo $html->link('Edit', '/posts/edit/'.$post['Post']['id']);?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Routes
======

This part is optional, but helpful in understanding how URLs map to
specific function calls in Cake. We're only going to make a quick change
to routes in this tutorial. For more information, see :doc:`configuration`, 

Routes Configuration
--------------------

Cake's default route will take a person visiting the root of your site
(i.e. http://www.example.com) to the PagesController, and render a view
called home. Rather than do that, we'll want users of our blog
application to go to our soon-to-be-created PostsController.

Cake's routing is found in **/app/config/routes.php**. You'll want to
comment out or remove the line that looks like this:

::

    <?php
    $Route->connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

This line connects the URL / with the default Cake home page. We want it
to connect with our own controller, so add a line that looks like this:

::

    <?php
    $Route->connect ('/', array('controller'=>'posts', 'action'=>'index'));

This should connect users requesting '/' to the index() action of our
soon-to-be-created PostsController.

Conclusion
----------

Creating applications this way will win you peace, honor, women, and
money beyond even your wildest fantasies. Simple, isn't it? Keep in mind
that this tutorial was very basic. Cake has many more features to offer,
and is flexible in ways we didn't wish to cover here. Use the rest of
this manual as a guide for building more feature-rich applications.

Now that you've created a basic Cake application you're ready for the
real thing. Start your own project, read the rest of the Manual and API.

If you need help, come see us in #cakephp. Welcome to Cake!

Simple User Authentication
==========================

The Big Picture
---------------

If you're new to CakePHP, you'll be strongly tempted to copy and paste
this code for use in your mission critical, sensitive-data-handling
production application. Resist ye: this chapter is a discussion on Cake
internals, not application security. While I doubt we'll provide for any
extremely obvious security pitfalls, **the point of this example is to
show you how Cake's internals work**, and allow you to create a
bulletproof brute of an application on your own.

Cake has access control via its built-in ACL engine, but what about user
authentication and persistence? What about that?

Well, for now, we've found that user authentication systems vary from
application to application. Some like hashed passwords, others, LDAP
authentication - and almost every app will have User models that are
slightly different. For now, we're leaving it up to you. Will this
change? We're not sure yet. For now, we think that the extra overhead of
building this into the framework isn't worth it, because creating your
own user authentication setup is easy with Cake.

You need just three things:

-  A way to authenticate users (usually done by verifying a user's
   identity with a username/password combination)
-  A way to persistently track that user as they navigate your
   application (usually done with sessions)
-  A way to check if a user has been authenticated (also often done by
   interacting with sessions)

In this example, we'll create a simple user authentication system for a
client management system. This fictional application would probably be
used by an office to track contact information and related notes about
clients. All of the system functionality will be placed behind our user
authentication system except for few bare-bones, public-safe views that
shows only the names and titles of clients stored in the system.

We'll start out by showing you how to verify users that try to access
the system. Authenticated user info will be stored in a PHP session
using Cake's Session Component. Once we've got user info in the session,
we'll place checks in the application to make sure application users
aren't entering places they shouldn't be.

One thing to note - authentication is not the same as access control.
All we're after in this example is how to see if people are who they say
they are, and allow them basic access to parts of the application. If
you want to fine tune this access, check out the chapter on Cake's
Access Control Lists. We'll make notes as to where ACLs might fit in,
but for now, let's focus on simple user authentication.

I should also say that this isn't meant to serve as some sort of primer
in application security. We just want to give you enough to work with so
you can build bulletproof apps of your own.

Authentication and Persistence
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First, we need a way to store information about users trying to access
our client management system. The client management system we're using
stores user information in a database table that was created using the
following SQL:

Table 'users', Fictional Client Management System Database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    CREATE TABLE `users` (
      `id` int(11) NOT NULL auto_increment,
      `username` varchar(255) NOT NULL,
      `password` varchar(32) NOT NULL,
      `first_name` varchar(255) NOT NULL,
      `last_name` varchar(255) NOT NULL,
      PRIMARY KEY  (`id`)
    )

Pretty simple, right? The Cake Model for this table can be pretty bare:

::

    <?php
    class User extends AppModel
    {
        var $name = 'User';
    }
    ?>

First thing we'll need is a login view and action. This will provide a
way for application users to attempt logins and a way for the system to
process that information to see if they should be allowed to access the
system or not. The view is just a HTML form, created with the help of
Cake's Html Helper:

/app/views/users/login.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php if ($error): ?>
    <p>The login credentials you supplied could not be recognized. Please try again.</p>
    <?php endif; ?>

    <form action="<?php echo $html->url('/users/login'); ?>" method="post">
    <div>
        <label for="username">Username:</label>
        <?php echo $html->input('User/username', array('size' => 20)); ?>
    </div>
    <div>
        <label for="password">Password:</label>
        <?php echo $html->password('User/password', array('size' => 20)); ?>
    </div>
    <div>
        <?php echo $html->submit('Login'); ?>
    </div>
    </form>

This view presents a simple login form for users trying to access the
system. The action for the form is **/users/login**, which is in the
UsersController and looks like this:

/app/controllers/users\_controller.php (partial)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class UsersController extends AppController
    {
        function login()
        {
            //Don't show the error message if no data has been submitted.
            $this->set('error', false);

            // If a user has submitted form data:
            if (!empty($this->data))
            {
                // First, let's see if there are any users in the database
                // with the username supplied by the user using the form:

                $someone = $this->User->findByUsername($this->data['User']['username']);

                // At this point, $someone is full of user data, or its empty.
                // Let's compare the form-submitted password with the one in
                // the database.

                if(!empty($someone['User']['password']) && $someone['User']['password'] == $this->data['User']['password'])
                {
                    // Note: hopefully your password in the DB is hashed,
                    // so your comparison might look more like:
                    // md5($this->data['User']['password']) == ...

                    // This means they were the same. We can now build some basic
                    // session information to remember this user as 'logged-in'.

                    $this->Session->write('User', $someone['User']);

                    // Now that we have them stored in a session, forward them on
                    // to a landing page for the application.

                    $this->redirect('/clients');
                }
                // Else, they supplied incorrect data:
                else
                {
                    // Remember the $error var in the view? Let's set that to true:
                    $this->set('error', true);
                }
            }
        }

        function logout()
        {
            // Redirect users to this action if they click on a Logout button.
            // All we need to do here is trash the session information:

            $this->Session->delete('User');

            // And we should probably forward them somewhere, too...
         
            $this->redirect('/');
        }
    }
    ?>

Not too bad: the contents of the login() action could be less than 20
lines if you were concise. The result of this action is either 1: the
user information is entered into the session and forwarded to the
landing page of the app, or 2: kicked back to the login screen and
presented the login form (with an additional error message).

Access Checking in your Application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now that we can authenticate users, let's make it so the application
will kick out users who try to enter the system from points other than
the login screen and the "basic" client directory we detailed earlier.

One way to do this is to create a function in the AppController that
will do the session checking and kicking for you.

/app/app\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class AppController extends Controller
    {
        function checkSession()
        {
            // If the session info hasn't been set...
            if (!$this->Session->check('User'))
            {
                // Force the user to login
                $this->redirect('/users/login');
                exit();
            }
        }
    }
    ?>

Now you have a function you can use in any controller to make sure users
aren't trying to access controller actions without logging in first.
Once this is in place you can check access at any level - here are some
examples:

Forcing authentication before all actions in a controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class NotesController extends AppController
    {
        // Don't want non-authenticated users looking at any of the actions
        // in this controller? Use a beforeFilter to have Cake run checkSession
        // before any action logic.

        function beforeFilter()
        {
            $this->checkSession();
        }
    }
    ?>

Forcing authentication before a single controller action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class NotesController extends AppController
    {
        function publicNotes($clientID)
        {
            // Public access to this action is okay...
        }

        function edit($noteId)
        {
            // But you only want authenticated users to access this action.
            $this->checkSession();
        }
    }
    ?>

Now that you have the basics down, you might want to venture out on your
own and implement some advanced or customized features past what has
been outlined here. Integration with Cake's ACL component might be a
good first step.

Cake Conventions
================

Conventions, eh ?
-----------------

Yes, conventions. According to thefreedictionary:

-  General agreement on or acceptance of certain practices or attitudes:
   By convention, north is at the top of most maps.
-  A practice or procedure widely observed in a group, especially to
   facilitate social interaction; a custom: the convention of shaking
   hands.
-  A widely used and accepted device or technique, as in drama,
   literature, or painting: the theatrical convention of the aside.

Conventions in cake are what make the magic happen, read it
**automagic**. Needless to say by favorizing convention over
configuration, Cake makes your productivity increase to a scary level
without any loss to flexibility. Conventions in cake are really simple
and intuitive. They were extracted from the best practices good web
developers have used throughout the years in the field of web
developement.

Filenames
---------

Filenames are **underscore**. As a general rule, if you have a class
**MyNiftyClass**, then in Cake, its file should be named
my\_nifty\_class.php.

So if you find a snippet you automatically know that:

-  If it's a Controller named **KissesAndHugsController**, then its
   filename must be **kisses\_and\_hugs\_controller.php** (notice
   \_controller in the filename)
-  If it's a Model named **OptionValue**, then its filename must be
   **option\_value.php**
-  If it's a Component named **MyHandyComponent**, then its filename
   must be **my\_handy.php**\ (no need for \_component in the filename)
-  If it's a Helper named **BestHelperEver**, then its filename must be
   **best\_helper\_ever.php**

Models
------

-  Model class names are **singular**.
-  Model class names are Capitalized for single-word models, and
   UpperCamelCased for multi-word models.

   -  Examples: Person, Monkey, GlassDoor, LineItem, ReallyNiftyThing

-  many-to-many join tables should be named:
   alphabetically\_first\_table\_plural\_alphabetically\_second\_table\_plural
   ie: tags\_users
-  Model filenames use a lower-case underscored syntax.

   -  Examples: person.php, monkey.php, glass\_door.php, line\_item.php,
      really\_nifty\_thing.php

-  Database tables related to models also use a lower-case underscored
   syntax - but they are **plural**.

   -  Examples: people, monkeys, glass\_doors, line\_items,
      really\_nifty\_things

CakePHP naming conventions are meant to streamline code creation and
make code more readable. If you find it getting in your way, you can
override it.

-  Model name: Set var $name in your model definition.
-  Model-related database tables: Set var $useTable in your model
   definition.

Controllers
-----------

-  Controller class names are **plural**.
-  Controller class names are Capitalized for single-word controllers,
   and UpperCamelCased for multi-word controllers. Controller class
   names also end with 'Controller'.

   -  Examples: PeopleController, MonkeysController,
      GlassDoorsController, LineItemsController,
      ReallyNiftyThingsController

-  Controller file names use a lower-case underscored syntax. Controller
   file names also end with '\_controller'. So if you have a controller
   class called PostsController, the controller file name should be
   posts\_controller.php

   -  Examples: people\_controller.php, monkeys\_controller.php,
      glass\_doors\_controller.php, line\_items\_controller.php,
      really\_nifty\_things\_controller.php

-  For protected member visibility, controller action names should be
   prepended with '-'.
-  For private member visibility, controller action names should be
   prepended with '\_\_'.

Views
-----

-  Views are named after actions they display.
-  Name the view file after action name, in lowercase.

   -  Examples: PeopleController::worldPeace() expects a view in
      **/app/views/people/world\_peace.thtml**;
      MonkeysController::banana() expects a view in
      **/app/views/monkeys/banana.thtml**.

You can force an action to render a specific view by calling
$this->render('name\_of\_view\_file\_without\_dot\_thtml'); at the end
of your action.

Helpers
-------

-  Helper classname is CamelCased and ends in "Helper", the filename is
   underscored.

   -  Example: class MyHelperHelper extends Helper is in
      **/app/views/helpers/my\_helper.php**.

Include in the controller with var $helpers = array('Html','MyHelper');
in the view you can access with $myHelper->method().

Components
----------

-  Component classname is CamelCased and ends in "Component", the
   filename is underscored.

   -  Example: class MyComponentComponent extends Object is in
      **/app/controllers/components/my\_component.php**.

Include in the controller with var $components = array('MyComponent');
in the controller you can access with $this->MyComponent->method().

Vendors
-------

Vendors don't follow any convention for obvious reasons: they are
third-party pieces of code, Cake has no control over them.
