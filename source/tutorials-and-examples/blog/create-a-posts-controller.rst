11.1.7 Create a Posts Controller
--------------------------------

Next, we'll create a controller for our posts. The controller is
where all the business logic for post interaction will happen. In a
nutshell, it's the place where you play with the models and get
post-related work done. We'll place this new controller in a file
called ``posts_controller.php`` inside the ``/app/controllers``
directory. Here's what the basic controller should look like:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array ('Html','Form');
        var $name = 'Posts';
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array ('Html','Form');``
#. ``var $name = 'Posts';``
#. ``}``
#. ``?>``

Now, lets add an action to our controller. Actions often represent
a single function or interface in an application. For example, when
users request www.example.com/posts/index (which is also the same
as www.example.com/posts/), they might expect to see a listing of
posts. The code for that action would look something like this:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array ('Html','Form');
        var $name = 'Posts';
    
        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array ('Html','Form');``
#. ``var $name = 'Posts';``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``}``
#. ``?>``

Let me explain the action a bit. By defining function ``index()``
in our PostsController, users can now access the logic there by
requesting www.example.com/posts/index. Similarly, if we were to
define a function called ``foobar()``, users would be able to
access that at www.example.com/posts/foobar.

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

To learn more about Cake's controllers, check out Chapter
"Developing with CakePHP" section: `"Controllers" </view/955/>`_.

11.1.7 Create a Posts Controller
--------------------------------

Next, we'll create a controller for our posts. The controller is
where all the business logic for post interaction will happen. In a
nutshell, it's the place where you play with the models and get
post-related work done. We'll place this new controller in a file
called ``posts_controller.php`` inside the ``/app/controllers``
directory. Here's what the basic controller should look like:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array ('Html','Form');
        var $name = 'Posts';
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array ('Html','Form');``
#. ``var $name = 'Posts';``
#. ``}``
#. ``?>``

Now, lets add an action to our controller. Actions often represent
a single function or interface in an application. For example, when
users request www.example.com/posts/index (which is also the same
as www.example.com/posts/), they might expect to see a listing of
posts. The code for that action would look something like this:

::

    <?php
    class PostsController extends AppController {
        var $helpers = array ('Html','Form');
        var $name = 'Posts';
    
        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $helpers = array ('Html','Form');``
#. ``var $name = 'Posts';``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``}``
#. ``?>``

Let me explain the action a bit. By defining function ``index()``
in our PostsController, users can now access the logic there by
requesting www.example.com/posts/index. Similarly, if we were to
define a function called ``foobar()``, users would be able to
access that at www.example.com/posts/foobar.

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

To learn more about Cake's controllers, check out Chapter
"Developing with CakePHP" section: `"Controllers" </view/955/>`_.
