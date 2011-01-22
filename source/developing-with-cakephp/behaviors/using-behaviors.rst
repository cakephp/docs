3.8.1 Using Behaviors
---------------------

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
structure using the TreeBehavior. Once a behavior has been
specified, use the methods added by the behavior as if they always
existed as part of the original model:

::

    // Set ID
    $this->Category->id = 42;
    
    // Use behavior method, children():
    $kids = $this->Category->children();

Some behaviors may require or allow settings to be defined when the
behavior is attached to the model. Here, we tell our TreeBehavior
the names of the "left" and "right" fields in the underlying
database table:

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

We can also attach several behaviors to a model. There's no reason
why, for example, our Category model should only behave as a tree,
it may also need internationalization support:

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
variable. That means that our behaviors will be attached to our
models throughout the model's lifetime. However, we may need to
"detach" behaviors from our models at runtime. Let's say that on
our previous Category model, which is acting as a Tree and a
Translate model, we need for some reason to force it to stop acting
as a Translate model:
::

    // Detach a behavior from our model:
    $this->Category->Behaviors->detach('Translate');

That will make our Category model stop behaving as a Translate
model from thereon. We may need, instead, to just disable the
Translate behavior from acting upon our normal model operations:
our finds, our saves, etc. In fact, we are looking to disable the
behavior from acting upon our CakePHP model callbacks. Instead of
detaching the behavior, we then tell our model to stop informing of
these callbacks to the Translate behavior:

::

    // Stop letting the behavior handle our model callbacks
    $this->Category->Behaviors->disable('Translate');

We may also need to find out if our behavior is handling those
model callbacks, and if not we then restore its ability to react to
them:

::

    // If our behavior is not handling model callbacks
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Tell it to start doing so
        $this->Category->Behaviors->enable('Translate');
    }

Just as we could completely detach a behavior from a model at
runtime, we can also attach new behaviors. Say that our familiar
Category model needs to start behaving as a Christmas model, but
only on Christmas day:

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
attached. If we pass the name of a behavior to the method, it will
tell us if that behavior is attached to the model, otherwise it
will give us the list of attached behaviors:

::

    // If the Translate behavior is not attached
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Get the list of all behaviors the model has attached
        $behaviors = $this->Category->Behaviors->attached();
    }
