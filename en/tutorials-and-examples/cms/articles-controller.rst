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
a response (via the View and Template). The code for that action would look like
this::

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
access the logic there by requesting **www.example.com/articles/index**. Similarly,
if we were to define a function called ``foobar()``, users would be able to
access that at **www.example.com/articles/foobar**.

.. warning::

    You may be tempted to name your controllers and actions in a way that allows
    you to obtain specific URLs. Resist that temptation. Instead, follow the
    :doc:`/intro/conventions` creating readable, meaningful action names. You
    can then use doc:`/development/routing` to connect the URLs you want to the
    actions you've created.

Our controller action is very simple. It fetches all the articles from the
database, using the model that is automatically loaded via naming conventions.
It then uses ``set()`` to pass the articles into the view (which we'll create
soon). CakePHP will automatically render the view after our controller action
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
:ref:`named routes <named-routes>`. Using these forms for URLs allows you to
leverage the reverse routing features CakePHP offers.

At this point, you should be able to point your browser to
**http://localhost:8765/articles/index**. You should see your list view,
correctly formatted with the title and table listing of the articles.

Create the View Action
======================

Create the View Template
========================

* Add add action
* Add validation
* Create add templates.
* Add edit action.
* Add edit view.
* Add delete action.

Next we'll be creating :doc:`basic actions for our Tags and Users tables
<tags-and-users>`.
