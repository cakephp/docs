3.8 Behaviors
-------------

Model behaviors are a way to organize some of the functionality
defined in CakePHP models. They allow us to separate logic that may
not be directly related to a model, but needs to be there. By
providing a simple yet powerful way to extend models, behaviors
allow us to attach functionality to models by defining a simple
class variable. That's how behaviors allow models to get rid of all
the extra weight that might not be part of the business contract
they are modeling, or that is also needed in different models and
can then be extrapolated.

As an example, consider a model that gives us access to a database
table which stores structural information about a tree. Removing,
adding, and migrating nodes in the tree is not as simple as
deleting, inserting, and editing rows in the table. Many records
may need to be updated as things move around. Rather than creating
those tree-manipulation methods on a per model basis (for every
model that needs that functionality), we could simply tell our
model to use the TreeBehavior, or in more formal terms, we tell our
model to behave as a Tree. This is known as attaching a behavior to
a model. With just one line of code, our CakePHP model takes on a
whole new set of methods that allow it to interact with the
underlying structure.

CakePHP already includes behaviors for tree structures, translated
content, access control list interaction, not to mention the
community-contributed behaviors already available in the CakePHP
Bakery (`http://bakery.cakephp.org <http://bakery.cakephp.org>`_).
In this section, we'll cover the basic usage pattern for adding
behaviors to models, how to use CakePHP's built-in behaviors, and
how to create our own.

In essence, Behaviors are
`Mixins <http://en.wikipedia.org/wiki/Mixin>`_ with callbacks.
