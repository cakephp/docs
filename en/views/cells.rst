View Cells
##########

View cells are small mini-controllers that can invoke view logic and render out
templates. The provide a light-weight modular replacement to
``requestAction()``. The idea of cells is borrowed from `cells in ruby
<http://cells.rubyforge.org/>`_, where they fulfill a similar role and purpose.

When to use Cells
=================

Cells are ideal for building reusable page components that require interaction
with models,  view logic, and rendering logic. A simple example would be the
cart in an online store, or a data-driven navigation menu in a CMS.

Cells also provide a lightweight replacement for ``requestAction()``. Because
cells do not dispatch sub-requests they sidestep all of the overhead associated
with ``requestAction()``.

Creating a Cell
===============

To create a cell, you define a class in ``App/View/Cell``, and a template in
``App/Template/Cell/``. In this example, we'll be making a cell to display the
number of messages in a user's notification inbox. First create the class file.
Its contents should look like::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell {

        public function display() {
        }

    }

Save this file into ``App/View/Cell/InboxCell.php``. As you can see like other
classes in CakePHP Cells have a few conventions:

* Cells live in the ``App\View\Cell`` namespace. If you are making a cell in
  a plugin, the namespace would be ``PluginName\View\Cell``.
* Class names should end in Cell.
* Classes should inherit from ``Cake\View\Cell``.

We added an empty ``display()`` method to our cell, this is the conventional
default method when rendering a cell. We'll cover how to use other methods later
in the docs. Now create the file ``App/Template/Cell/Inbox/display.ctp``. This
will be our template for our new cell.

You can generate this stub code quickly using ``bake``::

    Console/cake bake cell Inbox

Would generate the code we typed out.

Implementing the Cell
=====================

Assume that we are working on an application that allows users to send messages
to each other. We have a ``Messages`` model, and we want to show the count of
unread messages without having to pollute AppController. This is a perfect use
case for a cell. In the class we just made add the following::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell {

        public function display() {
            $this->loadModel('Messages');
            $unread = $this->Messages->find('unread');
            $this->set('unread_count', $unread->count());
        }

    }

Because Cells use the ``ModelAwareTrait`` and ``ViewVarsTrait``, they behave
very much like a controller would.  We can use the ``loadModel()`` and ``set()``
methods just like we would in a controller. In our template file add the
following::

    <div class="notification-icon">
        You have <?= $unread_count ?> unread messages.
    </div>

Loading Cells
=============

Cells can be loaded from controllers or views using the ``cell()`` method. The
``cell()`` method works the same in both contexts. The ``cell()`` method is
available in both contexts because you may need to use controller logic to
choose which cells to construct. To load a cell use the ``cell()`` method::

    // Load an application cell
    $cell = $this->cell('Inbox');

    // Load a plugin cell
    $cell = $this->cell('Messaging.Inbox');

The above will load the named cell class and execute the ``display()`` method.
You can execute other methods using the following::

    // Run the expanded() method on the Inbox cell
    $cell = $this->cell('Inbox::expanded');

Rendering a Cell
================

Once a cell has been loaded and executed you'll probably want to render it. The
easiest way to render a cell is to echo it::

    <?= $cell ?>

This will render the template matching the lowercased and underscored version of
our action name, e.g. ``display.ctp``.

Because cells use ``View`` to render templates, you can load additional cells
within a cell templates if required.

Passing Arguments to a Cell
---------------------------

You will often want to parameterize cell methods to make cells more flexible.
By using the second and third arguments of ``cell()`` you can pass action
parameters, and additional options to your cell classes::

    <?= $this->cell('Inbox::recent', ['since' => '-3 days']); ?>

The above would match the following function signature::

    public function recent($since) {
    }

Rendering Alternate Templates
=============================

By convention cells render templates that match the action they are executing.
If you need to render a different view template you can specify the template
to use when rendering the cell::

    // Calling render() explicitly
    echo $this->cell('Inbox::recent', ['since' => '-3 days'])->render('messages');

    // Set action before echoing the cell.
    $cell = $this->cell('Inbox'); ?>
    $cell->action = 'messages';
    echo $cell;

