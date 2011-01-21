3.14.5 Components, Helpers and Behaviors
----------------------------------------

A plugin can have Components, Helpers and Behaviors just like a
regular CakePHP application. You can even create plugins that
consist only of Components, Helpers or Behaviors and can be a great
way to build reusable components that can easily be dropped into
any project.

Building these components is exactly the same as building it within
a regular application, with no special naming convention. Referring
to your components from within the plugin also does not require any
special reference.

::

    // Component
    class ExampleComponent extends Object {
    
    }
    
    // within your Plugin controllers:
    var $components = array('Example'); 

To reference the Component from outside the plugin requires the
plugin name to be referenced.
::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // references ExampleComponent in Pizza plugin.

The same technique applies to Helpers and Behaviors.

3.14.5 Components, Helpers and Behaviors
----------------------------------------

A plugin can have Components, Helpers and Behaviors just like a
regular CakePHP application. You can even create plugins that
consist only of Components, Helpers or Behaviors and can be a great
way to build reusable components that can easily be dropped into
any project.

Building these components is exactly the same as building it within
a regular application, with no special naming convention. Referring
to your components from within the plugin also does not require any
special reference.

::

    // Component
    class ExampleComponent extends Object {
    
    }
    
    // within your Plugin controllers:
    var $components = array('Example'); 

To reference the Component from outside the plugin requires the
plugin name to be referenced.
::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // references ExampleComponent in Pizza plugin.

The same technique applies to Helpers and Behaviors.
