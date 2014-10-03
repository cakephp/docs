Registry objects
################

The registry classes provide a simple way to create and retrieve loaded
instances of a given object type. There are registry classes for Components,
Helpers, Tasks, and Behaviors.

While the examples below, will use Components, the same behavior can be expected
for Helpers, Behaviors, and Tasks in addition to Components.

Loading Objects
===============

Objects can be loaded on-the-fly using add<registry-object>()
Example::

    $this->addComponent('Acl.Acl');
    $this->addHelper('Flash')

Will result in the ``Toolbar`` property and ``Flash`` helper being loaded.
Configuration can also be set on-the-fly. Example::

    $this->loadComponent('Cookie', ['name' => 'sweet']);

Any keys & values provided will be passed to the Component's constructor.  The
one exception to this rule is ``className``.  Classname is a special key that is
used to alias objects in a registry.  This allows you to have component names
that do not reflect the classnames, which can be helpful when extending core
components::

    $this->Auth = $this->addComponent('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // Actually using MyCustomAuth::user();

Triggering Callbacks
====================

Callbacks are not provided by registry objects. You should use the
:doc:`events system </core-libraries/events>` to dispatch any events/callbacks
for your application.

Disabling Callbacks
===================

In previous versions collection objects provided a ``disable`` method to disable
objects from recieving callbacks. To do this now, you should use the features in
the events system. For example you could disable component callbacks in the
following way::

    // Remove Auth from callbacks.
    $this->eventManager()->detach($this->Auth);

    // Re-enable Auth for callbacks.
    $this->eventManager()->attach($this->Auth);


.. meta::
    :title lang=en: Object Registry
    :keywords lang=en: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
