CMS Tutorial - Creating the Articles Controller
###############################################

With our model created, we need a controller for our articles. Controllers in
CakePHP handle HTTP requests and execute business logic contained in model
methods, to prepare the response. We'll place this new controller in a file
called **ArticlesController.php** inside the **src/Controller** directory.
Here's what the basic controller should look like::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Now, let's add an action to our controller. Actions are controller methods that
have routes connected to them. For example, when a user requests
**www.example.com/articles/index** (which is also the same as
**www.example.com/articles**), CakePHP will call the ``index`` method of your
``ArticlesController``. This method should query the model layer, and prepare
a response by rendering a Template in the View. The code for that action would
look like this::

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
access the logic there by requesting **www.example.com/articles/index**.
Similarly, if we were to define a function called ``foobar()``, users would be
able to access that at **www.example.com/articles/foobar**. You may be tempted
to name your controllers and actions in a way that allows you to obtain specific
URLs. Resist that temptation. Instead, follow the :doc:`/intro/conventions`
creating readable, meaningful action names. You can then use
doc:`/development/routing` to connect the URLs you want to the actions you've
created.

Our controller action is very simple. It fetches all the articles from the
database, using the Model that is automatically loaded via naming conventions.
It then uses ``set()`` to pass the articles into the View (which we'll create
soon). CakePHP will automatically render the View after our controller action
completes.

Adding the Article List View Template
=====================================

Now that we have our controller pulling data from the model, and preparing our
view context, let's create a view template for our index action.

CakePHP view templates are presentation-flavored PHP code that is inserted inside
the application's layout. While we'll be creating HTML here, Views can also
generate JSON, CSV or even binary files like PDFs.

A layout is presentation code that is wrapped around a view. Layout files
contain common site elements like headers, footers and navigation elements. Your
application can have multiple layouts, and you can switch between them, but for
now, let's just use the default layout.

CakePHP's template files are stored in **src/Template** inside a folder
named after the controller they correspond to. So we'll have to create
a folder named 'Articles' in this case. Add the following code to your
application:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Articles</h1>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

In the last section we assigned the 'articles' variable to the view using
``set()``. Variables passed into the view are available in the view templates as
local variables which we used in the above code.

You might have noticed the use of an object called ``$this->Html``.  This is an
instance of the CakePHP :doc:`HtmlHelper </views/helpers/html>`.  CakePHP comes
with a set of view helpers that make tasks like creating links, forms, and
pagination buttons easy. You can learn more about :doc:`/views/helpers` in their
chapter, but what's important to note here is that the ``link()`` method will
generate an HTML link with the given link text (the first parameter) and URL
(the second parameter).

When specifying URLs in CakePHP, it is recommended that you use arrays or
:ref:`named routes <named-routes>`. These syntaxes allow you to
leverage the reverse routing features CakePHP offers.

At this point, you should be able to point your browser to
**http://localhost:8765/articles/index**. You should see your list view,
correctly formatted with the title and table listing of the articles.

Create the View Action
======================

If you were to click one of the 'view' links in our Articles list page, you'd
see an error page saying that action hasn't been implemented. Lets fix that now::

    // Add to existing src/Controller/ArticlesController.php file

    public function view($id = null)
    {
        $article = $this->Articles->get($id);
        $this->set(compact('article'));
    }

This is another very simple action, notice that our view action takes
a parameter: the ID of the article we'd like to see. This parameter is handed to
the action through the requested URL. If a user requests ``/articles/view/3``,
then the value '3' is passed as ``$id``. We're using the
``$this->Articles->get()`` method which will generate a ``404`` page if the
article isn't found. This saves you having to do checking for missing records in
your controller action, keeping your code simple and easy to read. If we were to
reload our browser with our new action saved, we'd see another CakePHP error
page telling use we're missing a view template; lets fix that.

Create the View Template
========================

Let's create the view for our new 'view' action and place it in
**src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>


You can verify that this is working by trying the links at ``/articles/index`` or
manually requesting an article by accessing URLs like ``/articles/view/1``.

Adding Articles
===============

With the basic read views created, we need to make it possible for new articles
to be created. Start by creating an ``add()`` action in the
``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

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
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    You need to include the :doc:`/controllers/components/flash` component in
    any controller where you will use it. Often it makes sense to include it in
    your ``AppController``.

Here's what the ``add()`` action does:

* If the HTTP method of the request was POST, try to save the data using the Articles model.
* If for some reason it doesn't save, just render the view. This gives us a
  chance to show the user validation errors or other warnings.

Every CakePHP request includes a request object which is accessible using
``$this->request``. The request object contains information regarding the
request that was just received. We use the
:php:meth:`Cake\\Network\\ServerRequest::is()` method to check that the request
is a HTTP POST request.

Our POST data is available in ``$this->request->getData()``. You can use the
:php:func:`pr()` or :php:func:`debug()` functions to print it out if you want to
see what it looks like. To save our data, we first 'marshal' the POST data into
an Article Entity. The Entity is then persisted using the ArticlesTable we
created earlier.

After saving our new article we use FlashComponent's ``success()`` method to set
a message into the session. The ``success`` method is provided using PHP's
`magic method features
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_.  Flash
messages will be displayed on the page after redirection. In our layout we have
``<?= $this->Flash->render() ?>`` which displays the message and clears the
corresponding session variable. Finally, after saving is complete, we use
:php:meth:`Cake\\Controller\\Controller::redirect` to send the user back to the
articles list. The param ``['action' => 'index']`` translates to URL
``/articles`` i.e the index action of the ``ArticlesController``. You can refer
to :php:func:`Cake\\Routing\\Router::url()` function on the `API
<https://api.cakephp.org>`_ to see the formats in which you can specify a URL
for various CakePHP functions.

* Add validation
* Create add templates
* Add edit action
* Add edit view
* Add delete action

Next we'll be creating :doc:`basic actions for our Tags and Users tables
<tags-and-users>`.
