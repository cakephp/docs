<<<<<<< HEAD
Blog Tutorial - Part 2
######################
=======
Blog Tutorial - Adding a layer
******************************
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Create an Article Model
=======================

Models are the bread and butter of CakePHP applications. By
creating a CakePHP model that will interact with our database,
we'll have the foundation in place needed to do our view, add,
edit, and delete operations later.

CakePHP's model class files are split between ``Table`` and ``Entity`` objects.
``Table`` objects provide access to the collection of entities stored in a
specific table and go in **src/Model/Table**. The file we'll be creating will
be saved to **src/Model/Table/ArticlesTable.php**. The completed file should
look like this::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Naming conventions are very important in CakePHP. By naming our Table object
``ArticlesTable``, CakePHP can automatically infer that this Table object will
be used in the ``ArticlesController``, and will be tied to a database table called
``articles``.

.. note::

    CakePHP will dynamically create a model object for you if it
    cannot find a corresponding file in **src/Model/Table**. This also means
    that if you accidentally name your file wrong (i.e. articlestable.php or
    ArticleTable.php), CakePHP will not recognize any of your settings and will
    use the generated model instead.

For more on models, such as callbacks, and validation, check out the :doc:`/orm`
chapter of the Manual.

.. note::

    If you completed :doc:`Part 1 of the Blog Tutorial
    </tutorials-and-examples/blog/blog>` and created the ``articles`` table in
    our Blog database you can leverage CakePHP's bake console and its code
    generation capabilities to create the ``ArticlesTable`` model::

        bin/cake bake model Articles

For more on bake and its code generation features please visit :doc:`/bake/usage`.

Create the Articles Controller
==============================

Next, we'll create a controller for our articles. The controller is
where all interaction with articles will happen. In a nutshell, it's the place
where you play with the business logic contained in the models and get work
related to articles done. We'll place this new controller in a file called
**ArticlesController.php** inside the **src/Controller** directory. Here's
what the basic controller should look like::

<<<<<<< HEAD
    // src/Controller/ArticlesController.php
=======
Next, we'll create a controller for our posts. The controller is
where all the controlling logic for post interaction will happen. In a
nutshell, it's the place where you play with the models and get
post-related work done. We'll place this new controller in a file
called ``PostsController.php`` inside the ``/app/Controller``
directory. Here's what the basic controller should look like::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Now, let's add an action to our controller. Actions often represent
a single function or interface in an application. For example, when
users request www.example.com/articles/index (which is also the same
as www.example.com/articles/), they might expect to see a listing of
articles. The code for that action would look like this::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

By defining function ``index()`` in our ``ArticlesController``, users can now
access the logic there by requesting www.example.com/articles/index. Similarly,
if we were to define a function called ``foobar()``, users would be able to
access that at www.example.com/articles/foobar.

.. warning::

    You may be tempted to name your controllers and actions a certain
    way to obtain a certain URL. Resist that temptation. Follow
    :doc:`/intro/conventions` (capitalization, plural names, etc.) and create
    readable, understandable action names. You can map URLs to your code using
    :doc:`/development/routing` covered later on.

The single instruction in the action uses ``set()`` to pass data
from the controller to the view (which we'll create next). The line
sets the view variable called 'articles' equal to the return value of
the ``find('all')`` method of the ``ArticlesTable`` object.

.. note::

    If you completed :doc:`Part 1 of the Blog Tutorial
    </tutorials-and-examples/blog/blog>` and created the ``articles`` table in
    your Blog database you can leverage CakePHP's bake console and its code
    generation capabilities to create the ArticlesController class::

        bin/cake bake controller Articles

For more on bake and its code generation features please visit :doc:`/bake/usage`.

To learn more about CakePHP's controllers, check out the
:doc:`/controllers` chapter.

Creating Article Views
======================

Now that we have our data flowing from our model, and our application
logic is defined by our controller, let's create a view for
the index action we created above.

CakePHP views are just presentation-flavored fragments that fit inside
an application's layout. For most applications, they're HTML mixed
with PHP, but they may end up as XML, CSV, or even binary data.

A layout is presentation code that is wrapped around a view.
Multiple layouts can be defined, and you can switch between
them, but for now, let's just use the default.

Remember in the last section how we assigned the 'articles' variable
to the view using the ``set()`` method? That would hand down the query
object collection to the view to be invoked with a ``foreach`` iteration.

CakePHP's template files are stored in **src/Template** inside a folder
named after the controller they correspond to (we'll have to create
a folder named 'Articles' in this case). To format this article data in a
nice table, our view code might look something like this:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

Hopefully this should look somewhat simple.

You might have noticed the use of an object called ``$this->Html``.  This is an
instance of the CakePHP :php:class:`Cake\\View\\Helper\\HtmlHelper` class.
CakePHP comes with a set of view helpers that make things like linking, form
output a snap. You can learn more about how to use them in
:doc:`/views/helpers`, but what's important to note here is that the ``link()``
method will generate an HTML link with the given title (the first parameter) and
URL (the second parameter).

When specifying URLs in CakePHP, it is recommended that you use the
array format. This is explained in more detail in the section on
Routes. Using the array format for URLs allows you to take
advantage of CakePHP's reverse routing capabilities. You can also
specify URLs relative to the base of the application in the form of
``/controller/action/param1/param2`` or use :ref:`named routes <named-routes>`.

At this point, you should be able to point your browser to
http://www.example.com/articles/index. You should see your view,
correctly formatted with the title and table listing of the articles.

If you happened to have clicked on one of the links we created in
this view (that link a article's title to a URL ``/articles/view/some\_id``),
you were probably informed by CakePHP that the action hasn't yet
been defined. If you were not so informed, either something has
gone wrong, or you actually did define it already, in which case
you are very sneaky. Otherwise, we'll create it in the
``ArticlesController`` now::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

The ``set()`` call should look familiar. Notice we're using
``get()`` rather than ``find('all')`` because we only really want
a single article's information.

Notice that our view action takes a parameter: the ID of the article
we'd like to see. This parameter is handed to the action through
the requested URL. If a user requests ``/articles/view/3``, then the value
'3' is passed as ``$id``.

We also do a bit of error checking to ensure a user is actually accessing
a record. By using the ``get()`` function in the Articles table, we make sure
the user has accessed a record that exists. In case the requested article is not
present in the database, or the id is false the ``get()`` function will throw
a ``NotFoundException``.

Now let's create the view for our new 'view' action and place it in
**src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>

Verify that this is working by trying the links at ``/articles/index`` or
manually requesting an article by accessing ``/articles/view/{id}``, replacing
``{id}`` by an article 'id'.

Adding Articles
===============

Reading from the database and showing us the articles is a great
start, but let's allow for the adding of new articles.

First, start by creating an ``add()`` action in the
``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

<<<<<<< HEAD
        public function initialize()
        {
            parent::initialize();
=======
    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Flash');
        public $components = array('Flash');
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

            $this->loadComponent('Flash'); // Include the FlashComponent
        }

        public function index()
        {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
<<<<<<< HEAD
                // Prior to 3.4.0 $this->request->data() was used.
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
=======
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->Flash->success(__('Your post has been saved.'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(__('Unable to add your post.'));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
            }
            $this->set('article', $article);
        }
    }

.. note::

<<<<<<< HEAD
    You need to include the :doc:`/controllers/components/flash` component in any controller
    where you will use it. If necessary, include it in your ``AppController``.
=======
    ``$this->request->is()`` takes a single argument, which can be the
    request METHOD (``get``, ``put``, ``post``, ``delete``) or some request
    identifier (``ajax``). It is **not** a way to check for specific posted
    data. For instance, ``$this->request->is('book')`` will not return true
    if book data was posted.

.. note::

    You need to include the FlashComponent - and FlashHelper - in
    any controller where you will use it. If necessary, include it in
    your AppController.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Here's what the ``add()`` action does: if the HTTP method of the
request was POST, try to save the data using the Articles model. If for some
reason it doesn't save, just render the view. This gives us a
chance to show the user validation errors or other warnings.

Every CakePHP request includes a ``ServerRequest`` object which is accessible using
``$this->request``. The request object contains useful information regarding the
request that was just received, and can be used to control the flow of your
application.  In this case, we use the :php:meth:`Cake\\Http\\ServerRequest::is()`
method to check that the request is a HTTP POST request.

When a user uses a form to POST data to your application, that
<<<<<<< HEAD
information is available in ``$this->request->getData()`` ( Or ``$this->request->data()`` for CakePHP v3.3 and under ). You can use the
:php:func:`pr()` or :php:func:`debug()` functions to print it out if you want to
see what it looks like.

We use FlashComponent's ``success()`` and ``error()`` methods to set a message
to a session variable. These methods are provided using PHP's `magic method
features <http://php.net/manual/en/language.oop5.overloading.php#object.call>`_.
Flash messages will be displayed on the page after redirection. In the layout we
have ``<?= $this->Flash->render() ?>`` which displays the message and clears the
corresponding session variable. The controller's
:php:meth:`Cake\\Controller\\Controller::redirect` function redirects to another
URL. The param ``['action' => 'index']`` translates to URL /articles i.e the
index action of the ``ArticlesController``. You can refer to
:php:func:`Cake\\Routing\\Router::url()` function on the `API
<https://api.cakephp.org>`_ to see the formats in which you can specify a URL for
various CakePHP functions.
=======
information is available in ``$this->request->data``. You can use the
:php:func:`pr()` or :php:func:`debug()` functions to print it out if you want to see
what it looks like.

We use the FlashComponent's :php:meth:`FlashComponent::success()`
method to set a message to a session variable to be displayed on the page after
redirection. In the layout we have
:php:func:`FlashHelper::render()` which displays the
message and clears the corresponding session variable. The
controller's :php:meth:`Controller::redirect` function
redirects to another URL. The param ``array('action' => 'index')``
translates to URL /posts (that is, the index action of the posts controller).
You can refer to :php:func:`Router::url()` function on the
`API <https://api.cakephp.org>`_ to see the formats in which you can specify a
URL for various CakePHP functions.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Calling the ``save()`` method will check for validation errors and
abort the save if any occur. We'll discuss how those errors are
handled in the following sections.

Data Validation
===============

CakePHP goes a long way toward taking the monotony out of form input
validation. Everyone hates coding up endless forms and their
validation routines. CakePHP makes it easier and faster.

To take advantage of the validation features, you'll need to use CakePHP's
:doc:`/views/helpers/form` helper in your views. The
:php:class:`Cake\\View\\Helper\\FormHelper` is available by default to all views
at ``$this->Form``.

Here's our add view:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

We use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that ``$this->Form->create()`` generates:

.. code-block:: html

    <form method="post" action="/articles/add">

If ``create()`` is called with no parameters supplied, it assumes
you are building a form that submits via POST to the current controller's
``add()`` action (or ``edit()`` action when ``id`` is included in
the form data).

The ``$this->Form->control()`` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and automagic here:
``control()`` will output different form elements based on the model
field specified.

The ``$this->Form->end()`` call ends the form. Outputting hidden inputs if
CSRF/Form Tampering prevention is enabled.

Now let's go back and update our **src/Template/Articles/index.ctp**
view to include a new "Add Article" link. Before the ``<table>``, add
the following line::

    <?= $this->Html->link('Add Article', ['action' => 'add']) ?>

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look
<<<<<<< HEAD
back at our Articles model and make a few adjustments::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator)
        {
            $validator
                ->notEmpty('title')
                ->requirePresence('title')
                ->notEmpty('body')
                ->requirePresence('body');

            return $validator;
        }
=======
back at our Post model and make a few adjustments::

    class Post extends AppModel {
        public $validate = array(
            'title' => array(
                'rule' => 'notBlank'
            ),
            'body' => array(
                'rule' => 'notBlank'
            )
        );
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
    }

The ``validationDefault()`` method tells CakePHP how to validate your data when
the ``save()`` method is called. Here, we've specified that both the body and
title fields must not be empty, and are required for both create and update
operations. CakePHP's validation engine is strong, with a number of pre-built
rules (credit card numbers, email addresses, etc.) and flexibility for adding
your own validation rules. For more information on that
setup, check the :doc:`/core-libraries/validation` documentation.

Now that your validation rules are in place, use the app to try to add
an article with an empty title or body to see how it works.  Since we've used the
:php:meth:`Cake\\View\\Helper\\FormHelper::control()` method of the FormHelper to
create our form elements, our validation error messages will be shown
automatically.

Editing Articles
================

Post editing: here we go. You're a CakePHP pro by now, so you
should have picked up a pattern. Make the action, then the view.
Here's what the ``edit()`` action of the ``ArticlesController`` would look
like::

<<<<<<< HEAD
    // src/Controller/ArticlesController.php

    public function edit($id = null)
    {
        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            // Prior to 3.4.0 $this->request->data() was used.
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
=======
    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }

        if ($this->request->is(array('post', 'put'))) {
            $this->Post->id = $id;
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been updated.'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('Unable to update your post.'));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }

        $this->set('article', $article);
    }

This action first ensures that the user has tried to access an existing record.
If they haven't passed in an ``$id`` parameter, or the article does not
exist, we throw a ``NotFoundException`` for the CakePHP ErrorHandler to take
care of.

Next the action checks whether the request is either a POST or a PUT request. If
it is, then we use the POST data to update our article entity by using the
``patchEntity()`` method.  Finally we use the table object to save the entity
back or kick back and show the user validation errors.

The edit view might look something like this:

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

This view outputs the edit form (with the values populated), along
with any necessary validation error messages.

CakePHP will determine whether a ``save()`` generates an insert or an
update statement based on the state of the entity.

You can now update your index view with links to edit specific
articles:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (edit links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- Here's where we iterate through our $articles query object, printing out article info -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Deleting Articles
=================

Next, let's make a way for users to delete articles. Start with a
``delete()`` action in the ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function delete($id)
    {
        $this->request->allowMethod(['post', 'delete']);

<<<<<<< HEAD
        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The article with id: {0} has been deleted.', h($id)));
            return $this->redirect(['action' => 'index']);
=======
        if ($this->Post->delete($id)) {
            $this->Flash->success(
                __('The post with id: %s has been deleted.', h($id))
            );
        } else {
            $this->Flash->error(
                __('The post with id: %s could not be deleted.', h($id))
            );
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }

        return $this->redirect(array('action' => 'index'));
    }

<<<<<<< HEAD
This logic deletes the article specified by ``$id``, and uses
``$this->Flash->success()`` to show the user a confirmation
message after redirecting them on to ``/articles``. If the user attempts to
do a delete using a GET request, the ``allowMethod()`` will throw an Exception.
Uncaught exceptions are captured by CakePHP's exception handler, and a nice
error page is displayed. There are many built-in
:doc:`Exceptions </development/errors>` that can be used to indicate the various
HTTP errors your application might need to generate.
=======
This logic deletes the post specified by $id, and uses
``$this->Flash->success()`` to show the user a confirmation
message after redirecting them on to ``/posts``. If the user attempts to
do a delete using a GET request, we throw an Exception. Uncaught exceptions
are captured by CakePHP's exception handler, and a nice error page is
displayed. There are many built-in :doc:`/development/exceptions` that can
be used to indicate the various HTTP errors your application might need
to generate.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Because we're just executing some logic and redirecting, this
action has no view. You might want to update your index view with
links that allow users to delete articles, however:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp (delete links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link('Add Article', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>

    <!-- Here's where we loop through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Delete',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Are you sure?'])
                ?>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

Using :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` will create a link
that uses JavaScript to do a POST request deleting our article.

.. warning::

    Allowing content to be deleted using GET requests is dangerous, as web
    crawlers could accidentally delete all your content.

.. note::

    This view code also uses the ``FormHelper`` to prompt the user with a
    JavaScript confirmation dialog before they attempt to delete an
    article.

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
(e.g., http://www.example.com) using its ``PagesController``, rendering
a view called "home". Instead, we'll replace this with our
ArticlesController by creating a routing rule.

CakePHP's routing is found in **config/routes.php**. You'll want
to comment out or remove the line that defines the default root
route. It looks like this:

.. code-block:: php

    $routes->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);

This line connects the URL '/' with the default CakePHP home page.
We want it to connect with our own controller, so replace that line
with this one:

.. code-block:: php

    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

This should connect users requesting '/' to the ``index()`` action of
our ``ArticlesController``.

.. note::

    CakePHP also makes use of 'reverse routing'. If, with the above
    route defined, you pass
    ``['controller' => 'Articles', 'action' => 'index']`` to a
    function expecting an array, the resulting URL used will be '/'.
    It's therefore a good idea to always use arrays for URLs as this
    means your routes define where a URL goes, and also ensures that
    links point to the same place.

Conclusion
==========

Creating applications this way will win you peace, honor, love, and
money beyond even your wildest fantasies. Simple, isn't it? Keep in
mind that this tutorial was very basic. CakePHP has *many* more
features to offer, and is flexible in ways we didn't wish to cover
here for simplicity's sake. Use the rest of this manual as a guide
for building more feature-rich applications.

<<<<<<< HEAD
Now that you've created a basic CakePHP application, you can either continue to
:doc:`/tutorials-and-examples/blog/part-three`, or start your own project. You
can also peruse the :doc:`/topics` or `API <https://api.cakephp.org>`_ to
learn more about CakePHP.
=======
Now that you've created a basic CakePHP application, you're ready for
the real thing. Start your own project and read the rest of the
:doc:`Cookbook </index>` and `API <https://api.cakephp.org>`_.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

If you need help, there are many ways to get the help you need - please see the
:doc:`/intro/where-to-get-help` page.  Welcome to CakePHP!

Suggested Follow-up Reading
---------------------------

These are common tasks people learning CakePHP usually want to study next:

1. :ref:`view-layouts`: Customizing your website layout
2. :ref:`view-elements`: Including and reusing view snippets
3. :doc:`/bake/usage`: Generating basic CRUD code
4. :doc:`/tutorials-and-examples/blog-auth-example/auth`: User authentication
   and authorization tutorial

.. meta::
    :title lang=en: Blog Tutorial Adding a Layer
    :keywords lang=en: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
