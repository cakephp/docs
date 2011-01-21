4.7.10 Testing plugins
----------------------

Tests for plugins are created in their own directory inside the
plugins folder.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

They work just like normal tests but you have to remember to use
the naming conventions for plugins when importing classes. This is
an example of a testcase for the PizzaOrder model from the plugins
chapter of this manual. A difference from other tests is in the
first line where 'Pizza.PizzaOrder' is imported. You also need to
prefix your plugin fixtures with '``plugin.plugin_name.``'.

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');
    
    class PizzaOrderCase extends CakeTestCase {
    
        // Plugin fixtures located in /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;
        
        function testSomething() {
            // ClassRegistry makes the model use the test database connection
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');
    
            // do some useful test here
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>


#. ``<?php``
#. ``App::import('Model', 'Pizza.PizzaOrder');``
#. ``class PizzaOrderCase extends CakeTestCase {``
#. ``// Plugin fixtures located in /app/plugins/pizza/tests/fixtures/``
#. ``var $fixtures = array('plugin.pizza.pizza_order');``
#. ``var $PizzaOrderTest;``
#. ````
#. ``function testSomething() {``
#. ``// ClassRegistry makes the model use the test database connection``
#. ``$this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');``
#. ``// do some useful test here``
#. ``$this->assertTrue(is_object($this->PizzaOrderTest));``
#. ``}``
#. ``}``
#. ``?>``

If you want to use plugin fixtures in the app tests you can
reference them using 'plugin.pluginName.fixtureName' syntax in the
$fixtures array.

That is all there is to it.

4.7.10 Testing plugins
----------------------

Tests for plugins are created in their own directory inside the
plugins folder.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

They work just like normal tests but you have to remember to use
the naming conventions for plugins when importing classes. This is
an example of a testcase for the PizzaOrder model from the plugins
chapter of this manual. A difference from other tests is in the
first line where 'Pizza.PizzaOrder' is imported. You also need to
prefix your plugin fixtures with '``plugin.plugin_name.``'.

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');
    
    class PizzaOrderCase extends CakeTestCase {
    
        // Plugin fixtures located in /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;
        
        function testSomething() {
            // ClassRegistry makes the model use the test database connection
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');
    
            // do some useful test here
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>


#. ``<?php``
#. ``App::import('Model', 'Pizza.PizzaOrder');``
#. ``class PizzaOrderCase extends CakeTestCase {``
#. ``// Plugin fixtures located in /app/plugins/pizza/tests/fixtures/``
#. ``var $fixtures = array('plugin.pizza.pizza_order');``
#. ``var $PizzaOrderTest;``
#. ````
#. ``function testSomething() {``
#. ``// ClassRegistry makes the model use the test database connection``
#. ``$this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');``
#. ``// do some useful test here``
#. ``$this->assertTrue(is_object($this->PizzaOrderTest));``
#. ``}``
#. ``}``
#. ``?>``

If you want to use plugin fixtures in the app tests you can
reference them using 'plugin.pluginName.fixtureName' syntax in the
$fixtures array.

That is all there is to it.
