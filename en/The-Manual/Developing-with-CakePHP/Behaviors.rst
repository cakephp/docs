Behaviors
#########

Model behaviors are a way to organize some of the functionality defined
in CakePHP models. They allow us to separate logic that may not be
directly related to a model, but needs to be there. By providing a
simple yet powerful way to extend models, behaviors allow us to attach
functionality to models by defining a simple class variable. That's how
behaviors allow models to get rid of all the extra weight that might not
be part of the business contract they are modeling, or that is also
needed in different models and can then be extrapolated.

As an example, consider a model that gives us access to a database table
which stores structural information about a tree. Removing, adding, and
migrating nodes in the tree is not as simple as deleting, inserting, and
editing rows in the table. Many records may need to be updated as things
move around. Rather than creating those tree-manipulation methods on a
per model basis (for every model that needs that functionality), we
could simply tell our model to use the TreeBehavior, or in more formal
terms, we tell our model to behave as a Tree. This is known as attaching
a behavior to a model. With just one line of code, our CakePHP model
takes on a whole new set of methods that allow it to interact with the
underlying structure.

CakePHP already includes behaviors for tree structures, translated
content, access control list interaction, not to mention the
community-contributed behaviors already available in the CakePHP Bakery
(`https://bakery.cakephp.org <https://bakery.cakephp.org>`_). In this
section, we'll cover the basic usage pattern for adding behaviors to
models, how to use CakePHP's built-in behaviors, and how to create our
own.

In essence, Behaviors are `Mixins <https://en.wikipedia.org/wiki/Mixin>`_
with callbacks.

Using Behaviors
===============

Behaviors are attached to models through the $actsAs model class
variable:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree');
    }

    ?>

This example shows how a Category model could be managed in a tree
structure using the TreeBehavior. Once a behavior has been specified,
use the methods added by the behavior as if they always existed as part
of the original model:

::

    // Set ID
    $this->Category->id = 42;

    // Use behavior method, children():
    $kids = $this->Category->children();

Some behaviors may require or allow settings to be defined when the
behavior is attached to the model. Here, we tell our TreeBehavior the
names of the "left" and "right" fields in the underlying database table:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

    ?>

We can also attach several behaviors to a model. There's no reason why,
for example, our Category model should only behave as a tree, it may
also need internationalization support:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

    ?>

So far we have been adding behaviors to models using a model class
variable. That means that our behaviors will be attached to our models
throughout the model's lifetime. However, we may need to "detach"
behaviors from our models at runtime. Let's say that on our previous
Category model, which is acting as a Tree and a Translate model, we need
for some reason to force it to stop acting as a Translate model:

::

    // Detach a behavior from our model:
    $this->Category->Behaviors->detach('Translate');

That will make our Category model stop behaving as a Translate model
from thereon. We may need, instead, to just disable the Translate
behavior from acting upon our normal model operations: our finds, our
saves, etc. In fact, we are looking to disable the behavior from acting
upon our CakePHP model callbacks. Instead of detaching the behavior, we
then tell our model to stop informing of these callbacks to the
Translate behavior:

::

    // Stop letting the behavior handle our model callbacks
    $this->Category->Behaviors->disable('Translate');

We may also need to find out if our behavior is handling those model
callbacks, and if not we then restore its ability to react to them:

::

    // If our behavior is not handling model callbacks
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Tell it to start doing so
        $this->Category->Behaviors->enable('Translate');
    }

Just as we could completely detach a behavior from a model at runtime,
we can also attach new behaviors. Say that our familiar Category model
needs to start behaving as a Christmas model, but only on Christmas day:

::

    // If today is Dec 25
    if (date('m/d') == '12/25') {
        // Our model needs to behave as a Christmas model
        $this->Category->Behaviors->attach('Christmas');
    }

We can also use the attach method to override behavior settings:

::

    // We will change one setting from our already attached behavior
    $this->Category->Behaviors->attach('Tree', array('left' => 'new_left_node'));

There's also a method to obtain the list of behaviors a model has
attached. If we pass the name of a behavior to the method, it will tell
us if that behavior is attached to the model, otherwise it will give us
the list of attached behaviors:

::

    // If the Translate behavior is not attached
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Get the list of all behaviors the model has attached
        $behaviors = $this->Category->Behaviors->attached();
    }

Creating Behaviors
==================

Behaviors that are attached to Models get their callbacks called
automatically. The callbacks are similar to those found in Models:
beforeFind, afterFind, beforeSave, afterSave, beforeDelete, afterDelete
and onError - see :doc:`/The-Manual/Developing-with-CakePHP/Models`.

Your behaviors should be placed in ``app/models/behaviors``. It's often
helpful to use a core behavior as a template when creating your own.
Find them in ``cake/libs/model/behaviors/``.

Every callback takes a reference to the model it is being called from as
the first parameter.

Besides implementing the callbacks, you can add settings per behavior
and/or model behavior attachment. Information about specifying settings
can be found in the chapters about core behaviors and their
configuration.

A quick example that illustrates how behavior settings can be passed
from the model to the behavior:

::

    class Post extends AppModel {
        var $name = 'Post'
        var $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'));
    }

As of 1.2.8004, CakePHP adds those settings once per model/alias only.
To keep your behavior upgradable you should respect aliases (or models).

An upgrade-friendly function setup would look something like this:

::

    function setup(&$Model, $settings) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }

Creating behavior methods
=========================

Behavior methods are automatically available on any model acting as the
behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }

You would be able to call FlyingBehavior methods as if they were methods
on your Duck model. When creating behavior methods you automatically get
passed a reference of the calling model as the first parameter. All
other supplied parameters are shifted one place to the right. For
example

::

    $this->Duck->fly('toronto', 'montreal');

Although this method takes two parameters, the method signature should
look like:

::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }

Keep in mind that methods called in a ``$this->doIt()`` fashion from
inside a behavior method will not get the $model parameter automatically
appended.

Behavior callbacks
==================

Model Behaviors can define a number of callbacks that are triggered
before/after the model callbacks of the same name. Behavior callbacks
allow your behaviors to capture events in attached models and augment
the parameters or splice in additional behavior.

The available callbacks are:

-  ``beforeValidate`` is fired before a model's beforeValidate
-  ``beforeFind`` is fired before a model's beforeFind
-  ``afterFind`` is fired before a model's afterFind
-  ``beforeSave`` is fired before a model's beforeSave
-  ``afterSave`` is fired before a model's afterSave
-  ``beforeDelete`` is fired after a model's beforeDelete
-  ``afterDelete`` is fired before a model's afterDelete

Creating a behavior callback
============================

Model behavior callbacks are defined as simple methods in your behavior
class. Much like regular behavior methods, they receive a ``$Model``
parameter as the first argument. This parameter is the model that the
behavior method was invoked on.

function beforeFind(&$model, $query)

If a behavior's beforeFind returns false it will abort the find().
Returning an array will augment the query parameters used for the find
operation.

afterFind(&$model, $results, $primary)

You can use the afterFind to augment the results of a find. The return
value will be passed on as the results to either the next behavior in
the chain or the model's afterFind.

beforeDelete(&$model, $cascade = true)

You can return false from a behavior's beforeDelete to abort the delete.
Return true to allow it continue.

afterDelete(&$model)

You can use afterDelete to perform clean up operations related to your
behavior.

beforeSave(&$model)

You can return false from a behavior's beforeSave to abort the save.
Return true to allow it continue.

afterSave(&$model, $created)

You can use afterSave to perform clean up operations related to your
behavior. $created will be true when a record is created, and false when
a record is updated.

beforeValidate(&$model)

You can use beforeValidate to modify a model's validate array or handle
any other pre-validation logic. Returning false from a beforeValidate
callback will abort the validation and cause it to fail.
