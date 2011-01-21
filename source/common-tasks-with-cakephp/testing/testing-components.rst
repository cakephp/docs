4.7.8 Testing components
------------------------

Lets assume that we want to test a component called
TransporterComponent, which uses a model called Transporter to
provide functionality for other controllers. We will use four
files:


-  A component called Transporters found in
   **app/controllers/components/transporter.php**
-  A model called Transporter found in
   **app/models/transporter.php**
-  A fixture called TransporterTestFixture found in
   **app/tests/fixtures/transporter\_fixture.php**
-  The testing code found in
   **app/tests/cases/transporter.test.php**

Initializing the component
~~~~~~~~~~~~~~~~~~~~~~~~~~

Since
`CakePHP discourages from importing models directly into components </view/993/Components>`_
we need a controller to access the data in the model.

If the startup() function of the component looks like this:

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }


#. ``public function startup(&$controller){``
#. ``$this->Transporter = $controller->Transporter;``
#. ``}``

then we can just design a really simple fake class:

::

    class FakeTransporterController {} 


#. ``class FakeTransporterController {}``

and assign values into it like this:

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 


#. ``$this->TransporterComponentTest = new TransporterComponent();``
#. ``$controller = new FakeTransporterController();``
#. ``$controller->Transporter = new TransporterTest();``
#. ``$this->TransporterComponentTest->startup(&$controller);``

Creating a test method
~~~~~~~~~~~~~~~~~~~~~~

Just create a class that extends CakeTestCase and start writing
tests!

::

    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');  
        function testGetTransporter() { 
              $this->TransporterComponentTest = new TransporterComponent(); 
              $controller = new FakeTransporterController(); 
              $controller->Transporter = new TransporterTest(); 
              $this->TransporterComponentTest->startup(&$controller); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden"); 
              $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx"); 
               
              $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden"); 
              $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden"); 
              $this->assertEqual($result, 3, "GL is best for 410xx-419xx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway"); 
              $this->assertEqual($result, 0, "Noone can service Norway");         
       }
    }
     


#. ``class TransporterTestCase extends CakeTestCase {``
#. ``var $fixtures = array('transporter');``
#. ``function testGetTransporter() {``
#. ``$this->TransporterComponentTest = new TransporterComponent();``
#. ``$controller = new FakeTransporterController();``
#. ``$controller->Transporter = new TransporterTest();``
#. ``$this->TransporterComponentTest->startup(&$controller);``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden");``
#. ``$this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden");``
#. ``$this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden");``
#. ``$this->assertEqual($result, 3, "GL is best for 410xx-419xx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway");``
#. ``$this->assertEqual($result, 0, "Noone can service Norway");``
#. ``}``
#. ``}``
#. ````

4.7.8 Testing components
------------------------

Lets assume that we want to test a component called
TransporterComponent, which uses a model called Transporter to
provide functionality for other controllers. We will use four
files:


-  A component called Transporters found in
   **app/controllers/components/transporter.php**
-  A model called Transporter found in
   **app/models/transporter.php**
-  A fixture called TransporterTestFixture found in
   **app/tests/fixtures/transporter\_fixture.php**
-  The testing code found in
   **app/tests/cases/transporter.test.php**

Initializing the component
~~~~~~~~~~~~~~~~~~~~~~~~~~

Since
`CakePHP discourages from importing models directly into components </view/993/Components>`_
we need a controller to access the data in the model.

If the startup() function of the component looks like this:

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }


#. ``public function startup(&$controller){``
#. ``$this->Transporter = $controller->Transporter;``
#. ``}``

then we can just design a really simple fake class:

::

    class FakeTransporterController {} 


#. ``class FakeTransporterController {}``

and assign values into it like this:

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 


#. ``$this->TransporterComponentTest = new TransporterComponent();``
#. ``$controller = new FakeTransporterController();``
#. ``$controller->Transporter = new TransporterTest();``
#. ``$this->TransporterComponentTest->startup(&$controller);``

Creating a test method
~~~~~~~~~~~~~~~~~~~~~~

Just create a class that extends CakeTestCase and start writing
tests!

::

    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');  
        function testGetTransporter() { 
              $this->TransporterComponentTest = new TransporterComponent(); 
              $controller = new FakeTransporterController(); 
              $controller->Transporter = new TransporterTest(); 
              $this->TransporterComponentTest->startup(&$controller); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden"); 
              $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx"); 
               
              $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden"); 
              $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden"); 
              $this->assertEqual($result, 3, "GL is best for 410xx-419xx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway"); 
              $this->assertEqual($result, 0, "Noone can service Norway");         
       }
    }
     


#. ``class TransporterTestCase extends CakeTestCase {``
#. ``var $fixtures = array('transporter');``
#. ``function testGetTransporter() {``
#. ``$this->TransporterComponentTest = new TransporterComponent();``
#. ``$controller = new FakeTransporterController();``
#. ``$controller->Transporter = new TransporterTest();``
#. ``$this->TransporterComponentTest->startup(&$controller);``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden");``
#. ``$this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden");``
#. ``$this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden");``
#. ``$this->assertEqual($result, 3, "GL is best for 410xx-419xx");``
#. ````
#. ``$result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway");``
#. ``$this->assertEqual($result, 0, "Noone can service Norway");``
#. ``}``
#. ``}``
#. ````
