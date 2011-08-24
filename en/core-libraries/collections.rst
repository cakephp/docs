Collections
###########

Components, Helpers, Behaviors and Tasks all share a similar structure and set
of behaviors.  For 2.0, they were given a unified API for interacting with
collections of similar objects.  The collection objects in CakePHP, give you 
a uniform way to interact with several diferrent kinds of objects in your
application.

While the examples below, will use Components, the same behavior can be expected
for Helpers, Behaviors, and Tasks in addition to Components.

Loading and unloading objects
=============================

Loading objects on every kind of collection can be done using the ``load()``
method::

    <?php
    $this->Components->load('Prg');
    $this->Prg->process();

When loading a component, if the component is not currently loaded into the
collection, a new instance will be created.  If the component is already loaded,
another instance will not be created.  When loading components, you can also
provide additional configuration for them::

    <?php
    $this->Components->load('Cookie', array('name' => 'sweet'));

Any keys & values provided will be passed to the Component's constructor.  The
one exception to this rule is ``className``.  ClassName is a special key that is
used to alias objects in a collection.  This allows you to have component names
that do not reflect the classnames, which can be helpful when extending core
components::

    <?php
    $this->Components->load('Auth', array('className' => 'MyCustomAuth'));
    $this->Auth->user(); // Actually using MyCustomAuth::user();

The inverse of loading an object, is unloading it.  Unloaded objects are removed
from memory, and will not have additional callbacks triggered on them::

    <?php
    $this->Components->unload('Cookie');
    $this->Cookie->read(); // Fatal error.

Triggering callbacks
====================


Lazy Loading and on-demand loading
==================================


Helper, Behavior, Component and Task refactor
=============================================

Helpers, behaviors, components, and tasks were restructured for 2.0. After examining the various things these objects did, there were some striking similarities.  All the object types except Tasks provided callbacks and custom methods.  However, the loading and usage of callbacks was slightly different in each case.  For 2.0 these different loading/callback triggering API's were simplified and made uniform.  Using `BehaviorCollection` as the base of how things should work.  Each object type now has a Collection object.  This collection object is responsible for loading, unloading and triggering callbacks.  The Collection object API looks like:

* `load()` - Load a new object, and add it to the collection
* `unload()` - Remove an object from the collection
* `trigger()` - Trigger a callback on all objects in the collection.
* `enable()` - Enables a disabled object in the collection
* `disable()` - Disable an object in the collection
* `attached()` - Get the names of the attached objects, or find out if a specific object is attached.
* `enabled()` - Get the names of the enabled objects, or find out if a specific object is enabled.

Helpers, behaviors and components can also be aliased. You can read more about aliasing under "Aliasing" on the [2.0 New Features](http://cakephp.lighthouseapp.com/projects/42648/20-new-features) page.

### HelperCollection

After examining the responsibilities of each class involved in the View layer, it became clear that View was handling much more than a single task. The responsibility of creating helpers, is not central to what View does, and was moved into HelperCollection. HelperCollection is responsible for loading and constructing helpers, as well as triggering callbacks on helpers.  By default View creates a HelperCollection in its constructor, and uses it for subsequent operations.  The HelperCollection for a view can be found at `$this->Helpers`

The motivations for refactoring this functionality came from a few issues.

* View being registered in ClassRegistry could cause registry poisoning issues when requestAction or the EmailComponent were used.
* View being accessible as a global symbol invited abuse.
* Helpers were not self contained.  After constructing a helper, you had to manually construct several other objects in order to get a functioning object.

The refactoring to HelperCollection solved all of the above issues as well as provided additional new features, such as lazy loading.

### Using HelperCollection

HelperCollection provides an API similar to `BehaviorCollection`, but for managing helpers.

* `load($name, $settings = array())`  Load is used to load individual helpers, and provide them with settings.
* `unload($name)` Remove a helper from the collection.
* `attached()` Get a list of attached helpers.
* `enabled($name)` Get a list of enabled helpers.  Helpers that are not enabled will not have callbacks fired on them. If a name is passed in a boolean will be returned indicating whether or not the helper is enabled.
* `enable($name)` Re-enables a helper.  Enabled helpers have callbacks fired on them.
* `disable($name)` Disables a helper.  Disabled helpers do not have callbacks fired on them.
* `trigger($callback, $params)` Trigger a callback on all the enabled helpers.

All of the following are run from inside a view/element/layout.

#### Loading helpers on demand in the View

You can now load individual Helpers on-demand using `View::loadHelper()`.  This method attaches the Helper to the HelperCollection and returns the helper as well.

<pre>
$Media = $this->loadHelper('Media.Media');
// or
$Media = $this->Helpers->load('Media');
</pre>

The Media helper will now be inside `$Media` and available as `$this->Media`.  View::loadHelper() is provided as a wrapper method to be used by helpers to load additional helpers.  Both load methods also takes an array of settings as the second parameter for helpers that need configuration arrays.

#### Disabling callbacks on a helper

<pre>
$this->Helpers->disable('Html');
</pre>

The HtmlHelper will no longer have view callbacks triggered on it.  You will however be able to use its methods normally.

### Helpers attributes format is more flexible

The Helper class have more 3 protected attributes:

* `Helper::_minimizedAttributes`: array with minimized attributes (ie: `array('checked', 'selected', ...)`);
* `Helper::_attributeFormat`: how attributes will be generated (ie: `%s="%s"`);
* `Helper::_minimizedAttributeFormat`: how minimized attributes will be generated: (ie `%s="%s")

By default the values used in CakePHP 1.3 do not was changed. But now you can use boolean attributes from HTML, like `<input type="checkbox" checked />`. To this, just change `$_minimizedAttributeFormat` in your AppHelper to `%s`.

To use with Html/Form helpers and others, you can write:
@@@
$this->Form->checkbox('field', array('checked' => true, 'value' => 'some_value'));
@@@

Other facility is that minimized attributes can be passed as item and not as key. For example:
@@@
$this->Form->checkbox('field', array('checked', 'value' => 'some_value'));
@@@
Note that `checked` have a numeric key.

### Helper of helpers load lazily

A benefit from using HelperCollection to manage Helpers, is that Helpers inside helpers now load lazily.  This should help create faster running scripts when all the inner helpers are not accessed.  The first time a helper's helper is accessed it will be created/loaded from the View's HelperCollection.  These changes do not affect that only one of each helper is loaded per HelperCollection.  As in previous versions of CakePHP, all helpers of the same name are references to one another.



## Component Refactor

Components were refactored in 2.0 to solve a number of inconsistencies and provide a more uniform API.  In the past `Component` was the loader and manager of Components for a Controller.  In 2.0 `ComponentCollection` takes over that responsibility and `Component` is now a base class for components.  This unifies the API between Helpers and Components as a collection.

### $this->Component --> $this->Components

Inside a controller `$this->Component` has been renamed to `$this->Components` this makes it more uniform with Behaviors and Helpers.  `$this->Components` is a ComponentCollection instance.  ComponentCollection provides the following methods.

* `load($name, $settings = array())`  Load is used to load individual components, and provide them with settings.
* `unload($name)` Remove a component from the collection.
* `attached()` Get a list of attached components.
* `enabled($name)` Get a list of enabled components.  Components that are not enabled will not have callbacks fired on them. If a name is passed in a boolean will be returned indicating whether or not the component is enabled.
* `enable($name)` Re-enables a component.  Enabled components have callbacks fired on them.
* `disable($name)` Disables a component.  Disabled components do not have callbacks fired on them.
* `trigger($callback, $params)` Trigger a callback on all the enabled components.

#### Disabling callbacks on a component

<pre>
$this->Components->disable('Cookie');
</pre>

The CookieComponent will no longer have view callbacks triggered on it.  You will however be able to use its methods normally.


### Component components are now loaded lazily

Components used by a Component are now lazy loaded through `__get()`.  All components of the same name are still references of each other, and each component will only be constructed once per request.

### Loading Components on demand

Much like helpers you can now create Components on demand easily by using the load method of the ComponentCollection.

<pre>
$Prg = $this->Components->load('Prg');
</pre>

By default, all runtime loaded components will have all future callbacks triggered on them.  You can exclude components from callbacks by either using `$this->Components->disable('Prg');` or by including the `enabled = false` key in your settings.

<pre>
$Prg = $this->Components->load('Prg', array('enabled' => false));
</pre>


#### Changes in disabling components

In the past you were able to disable components via `$this->Auth->enabled = false;` for example. In CakePHP 2.0 you should use the ComponentCollection's disable method, `$this->Components->disable('Auth');`.  Using the enabled property will not work properly.

### Task Refactor

Tasks have also been removed from the ClassRegistry.  Instead Tasks are put into a `TaskCollection` object attached to the Shell for a given command.  The TaskCollection for a command is used to load and construct tasks.  In addition you can use it to load tasks at runtime. If you need to access the TaskCollection inside a shell,  use `$this->Tasks->method()`.

#### Using plugin tasks

With TaskCollection, using plugin tasks is quite simple.  You just declare them in the $tasks array like any other Task.  The TaskCollection, will find and construct the desired task.  You should always use the plugin dot syntax to indicate plugin tasks.

<pre>
public $tasks = array('ProgressBar.Updater');
</pre>

