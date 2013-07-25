Registry objects
################

The registry classes provide a simple way to create and retrieve loaded
instances of a given object type. There are registry classes for Components,
Helpers, Tasks, and Behaviors.

While the examples below, will use Components, the same behavior can be expected
for Helpers, Behaviors, and Tasks in addition to Components.

Loading objects
===============

Loading objects on every kind of registry can be done using the ``load()``
method::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

When loading a component, if the component is not currently loaded into the
registry, a new instance will be created.  If the component is already loaded,
another instance will not be created.  When loading components, you can also
provide additional configuration for them::

    $this->Cookie = $this->Components->load('Cookie', array('name' => 'sweet'));

Any keys & values provided will be passed to the Component's constructor.  The
one exception to this rule is ``className``.  Classname is a special key that is
used to alias objects in a registry.  This allows you to have component names
that do not reflect the classnames, which can be helpful when extending core
components::

    $this->Auth = $this->Components->load('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // Actually using MyCustomAuth::user();

Triggering callbacks
====================

Callbacks are not provided by registry objects. You should use the
:doc:`events system </core-libraries/events>` to dispatch any events/callbacks
for your application.


.. meta::
    :title lang=en: Object Registry
    :keywords lang=en: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
