Collections
###########

Components, Helpers, Behaviors and Tasks all share a similar structure and set
of behaviors. For 2.0, they were given a unified API for interacting with
collections of similar objects. The collection objects in CakePHP, give you
a uniform way to interact with several different kinds of objects in your
application.

While the examples below, will use Components, the same behavior can be expected
for Helpers, Behaviors, and Tasks in addition to Components.

Loading and unloading objects
=============================

Loading objects on every kind of collection can be done using the ``load()``
method::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

When loading a component, if the component is not currently loaded into the
collection, a new instance will be created. If the component is already loaded,
another instance will not be created. When loading components, you can also
provide additional configuration for them::

    $this->Cookie = $this->Components->load('Cookie', array('name' => 'sweet'));

Any keys & values provided will be passed to the Component's constructor. The
one exception to this rule is ``className``. ClassName is a special key that is
used to alias objects in a collection. This allows you to have component names
that do not reflect the classnames, which can be helpful when extending core
components::

    $this->Auth = $this->Components->load(
        'Auth',
        array('className' => 'MyCustomAuth')
    );
    $this->Auth->user(); // Actually using MyCustomAuth::user();

The inverse of loading an object, is unloading it. Unloaded objects are removed
from memory, and will not have additional callbacks triggered on them::

    $this->Components->unload('Cookie');
    $this->Cookie->read(); // Fatal error.

Triggering callbacks
====================

Callbacks are supported by collection objects. When a collection has a callback
triggered, that method will be called on all enabled objects in the collection.
You can pass parameters to the callback loop as well::

    $this->Behaviors->trigger('afterFind', array($this, $results, $primary));

In the above ``$this`` would be passed as the first argument to every
behavior's afterFind method. There are several options that can be used to
control how callbacks are fired:

- ``breakOn`` Set to the value or values you want the callback propagation to stop on.
  Can either be a scalar value, or an array of values to break on. Defaults to ``false``.

- ``break`` Set to true to enabled breaking. When a trigger is broken, the last returned value
  will be returned. If used in combination with ``collectReturn`` the collected results will be returned.
  Defaults to ``false``.

- ``collectReturn`` Set to true to collect the return of each object into an array.
  This array of return values will be returned from the trigger() call. Defaults to ``false``.

- ``triggerDisabled`` Will trigger the callback on all objects in the collection even the non-enabled
  objects. Defaults to false.

- ``modParams`` Allows each object the callback gets called on to modify the parameters to the next object.
  Setting modParams to an integer value will allow you to modify the parameter with that index.
  Any non-null value will modify the parameter index indicated.
  Defaults to false.

Canceling a callback loop
-------------------------

Using the ``break`` and ``breakOn`` options you can cancel a callback loop
midway similar to stopping event propagation in JavaScript::

    $this->Behaviors->trigger(
        'beforeFind',
        array($this, $query),
        array('break' => true, 'breakOn' => false)
    );

In the above example, if any behavior returns ``false`` from its beforeFind
method, no further callbacks will be called. In addition, the return of
``trigger()`` will be false.

Enabling and disabling objects
==============================

Once an object is loaded into a collection you may need to disable it.
Disabling an object in a collection prevents future callbacks from being fired
on that object unless the ``triggerDisabled`` option is used::

    // Disable the HtmlHelper
    $this->Helpers->disable('Html');

    // Re-enable the helper later on
    $this->Helpers->enable('Html');


Disabled objects can still have their normal methods and properties used. The
primary difference between an enabled and disabled object is with regards to
callbacks. You can interrogate a collection about the enabled objects, or check
if a specific object is still enabled using ``enabled()``::

    // Check whether or not a specific helper is enabled.
    $this->Helpers->enabled('Html');

    // $enabled will contain an array of helper currently enabled.
    $enabled = $this->Helpers->enabled();

Object callback priorities
==============================

You can prioritize the triggering object callbacks similar to event callbacks.
The handling of priority values and order of triggering is the same as
explained :ref:`here <event-priorities>`.
Here's how you can specify priority at declaration time::

    class SomeController {
        public $components = array(
            'Foo', //Foo gets default priority 10
            // Bar's callbacks are triggered before Foo's
            'Bar' => array('priority' => 9)
        );

        public $helpers = array(
            // Cache's callbacks will be triggered last
            'Cache' => array('priority' => 12),
            'Asset',
            'Utility' //Utility has priority 10 same as Asset and its callbacks
                      //are triggered after Asset's
        );
    }


    class Post {
        public $actsAs = array(
            'DoFirst' => array('priority' => 1),
            'Media'
        );
    }

When dynamically loading objects to a collection you can specify the priority like this::

    $this->MyComponent = $this->Components->load(
        'MyComponent',
        array('priority' => 9)
    );


You can also change priorities at run time using the ``ObjectCollection::setPriority()`` function::

    //For a single object
    $this->Components->setPriority('Foo', 2);

    //For multiple objects
    $this->Behaviors->setPriority(array('Object1' => 8, 'Object2' => 9));


.. meta::
    :title lang=en: Collections
    :keywords lang=en: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
