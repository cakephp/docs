View Cells
##########

View cells are small mini-controllers that can invoke view logic and render out
templates. The idea of cells is borrowed from `cells in Ruby
<https://github.com/trailblazer/cells>`_, where they fulfill a similar role and
purpose.

When to use Cells
=================

Cells are ideal for building reusable page components that require interaction
with models, view logic, and rendering logic. A simple example would be the
cart in an online store, or a data-driven navigation menu in a CMS.

Creating a Cell
===============

To create a cell, define a class in **src/View/Cell** and a template in
**templates/cell/**. In this example, we'll be making a cell to display the
number of messages in a user's notification inbox. First, create the class file.
Its contents should look like::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {
        public function display()
        {
        }
    }

Save this file into **src/View/Cell/InboxCell.php**. As you can see, like other
classes in CakePHP, Cells have a few conventions:

* Cells live in the ``App\View\Cell`` namespace. If you are making a cell in
  a plugin, the namespace would be ``PluginName\View\Cell``.
* Class names should end in Cell.
* Classes should inherit from ``Cake\View\Cell``.

We added an empty ``display()`` method to our cell; this is the conventional
default method when rendering a cell. We'll cover how to use other methods later
in the docs. Now, create the file **templates/cell/Inbox/display.php**. This
will be our template for our new cell.

You can generate this stub code quickly using ``bake``::

    bin/cake bake cell Inbox

Would generate the code we created above.

Implementing the Cell
=====================

Assume that we are working on an application that allows users to send messages
to each other. We have a ``Messages`` model, and we want to show the count of
unread messages without having to pollute AppController. This is a perfect use
case for a cell. In the class we just made, add the following::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {
        public function display()
        {
            $unread = $this->fetchTable('Messages')->find('unread');
            $this->set('unread_count', $unread->count());
        }
    }

Because Cells use the ``LocatorAwareTrait`` and ``ViewVarsTrait``, they behave
very much like a controller would.  We can use the ``fetchTable()`` and ``set()``
methods just like we would in a controller. In our template file, add the
following::

    <!-- templates/cell/Inbox/display.php -->
    <div class="notification-icon">
        You have <?= $unread_count ?> unread messages.
    </div>

.. note::

    Cell templates have an isolated scope that does not share the same View
    instance as the one used to render template and layout for the current
    controller action or other cells. Hence they are unaware of any helper calls
    made or blocks set in the action's template / layout and vice versa.

Loading Cells
=============

Cells can be loaded from views using the ``cell()`` method and works the same in
both contexts::

    // Load an application cell
    $cell = $this->cell('Inbox');

    // Load a plugin cell
    $cell = $this->cell('Messaging.Inbox');

The above will load the named cell class and execute the ``display()`` method.
You can execute other methods using the following::

    // Run the expanded() method on the Inbox cell
    $cell = $this->cell('Inbox::expanded');

If you need controller logic to decide which cells to load in a request, you can
use the ``CellTrait`` in your controller to enable the ``cell()`` method there::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\View\CellTrait;

    class DashboardsController extends AppController
    {
        use CellTrait;

        // More code.
    }

Passing Arguments to a Cell
===========================

You will often want to parameterize cell methods to make cells more flexible.
By using the second and third arguments of ``cell()``, you can pass action
parameters and additional options to your cell classes, as an indexed array::

    $cell = $this->cell('Inbox::recent', ['-3 days']);

The above would match the following function signature::

    public function recent($since)
    {
    }

Rendering a Cell
================

Once a cell has been loaded and executed, you'll probably want to render it. The
easiest way to render a cell is to echo it::

    <?= $cell ?>

This will render the template matching the lowercased and underscored version of
our action name like **display.php**.

Because cells use ``View`` to render templates, you can load additional cells
within a cell template if required.

.. note::

    Echoing a cell uses the PHP ``__toString()`` magic method which prevents PHP
    from showing the filename and line number for any fatal errors raised. To
    obtain a meaningful error message, it is recommended to use the
    ``Cell::render()`` method, for example ``<?= $cell->render() ?>``.

Rendering Alternate Templates
-----------------------------

By convention cells render templates that match the action they are executing.
If you need to render a different view template, you can specify the template
to use when rendering the cell::

    // Calling render() explicitly
    echo $this->cell('Inbox::recent', ['-3 days'])->render('messages');

    // Set template before echoing the cell.
    $cell = $this->cell('Inbox');
    $cell->viewBuilder()->setTemplate('messages');

    echo $cell;

Caching Cell Output
-------------------

When rendering a cell you may want to cache the rendered output if the contents
don't change often or to help improve performance of your application. You can
define the ``cache`` option when creating a cell to enable & configure caching::

    // Cache using the default config and a generated key
    $cell = $this->cell('Inbox', [], ['cache' => true]);

    // Cache to a specific cache config and a generated key
    $cell = $this->cell('Inbox', [], ['cache' => ['config' => 'cell_cache']]);

    // Specify the key and config to use.
    $cell = $this->cell('Inbox', [], [
        'cache' => ['config' => 'cell_cache', 'key' => 'inbox_' . $user->id]
    ]);

If a key is generated the underscored version of the cell class and template
name will be used.

.. note::

    A new ``View`` instance is used to render each cell and these new objects
    do not share context with the main template / layout. Each cell is
    self-contained and only has access to variables passed as arguments to the
    ``View::cell()`` call.

Paginating Data inside a Cell
=============================

Creating a cell that renders a paginated result set can be done by leveraging
a paginator class of the ORM. An example of paginating a user's favorite
messages could look like::

    namespace App\View\Cell;

    use Cake\View\Cell;
    use Cake\Datasource\Paging\NumericPaginator;

    class FavoritesCell extends Cell
    {
        public function display($user)
        {
            // Create a paginator
            $paginator = new NumericPaginator();

            // Paginate the model
            $results = $paginator->paginate(
                $this->fetchTable('Messages'),
                $this->request->getQueryParams(),
                [
                    // Use a parameterized custom finder.
                    'finder' => ['favorites' => [$user]],

                    // Use scoped query string parameters.
                    'scope' => 'favorites',
                ]
            );

            $this->set('favorites', $results);
        }
    }

The above cell would paginate the ``Messages`` model using :ref:`scoped
pagination parameters <paginating-multiple-queries>`.

Cell Options
============

Cells can declare constructor options that are converted into properties when
creating a cell object::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class FavoritesCell extends Cell
    {
        protected $_validCellOptions = ['limit'];

        protected $limit = 3;

        public function display($userId)
        {
            $result = $this->fetchTable('Users')->find('friends', ['for' => $userId])
                ->limit($this->limit)
                ->all();
            $this->set('favorites', $result);
        }
    }

Here we have defined a ``$limit`` property and add ``limit`` as a cell option.
This will allow us to define the option when creating the cell::

    $cell = $this->cell('Favorites', [$user->id], ['limit' => 10])

Cell options are handy when you want data available as properties allowing you
to override default values.

Using Helpers inside a Cell
===========================

Cells have their own context and their own View instance but Helpers loaded inside your
``AppView::initialize()`` function are still loaded as usual.

Loading a specific Helper just for a specific cell can be done via the following example::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class FavoritesCell extends Cell
    {
        public function initialize(): void
        {
            $this->viewBuilder()->addHelper('MyCustomHelper');
        }
    }


Cell Events
===========

Cells trigger the following events around the cell action:

* ``Cell.beforeAction``
* ``Cell.afterAction``

.. versionadded:: 5.1.0
