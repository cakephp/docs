4.7.7 Testing Helpers
---------------------

Since a decent amount of logic resides in Helper classes, it's
important to make sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for
Components. Suppose we have a helper called CurrencyRendererHelper
located in ``app/views/helpers/currency_renderer.php`` with its
accompanying test case file located in
``app/tests/cases/helpers/currency_renderer.test.php``

Creating Helper test, part I
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First of all we will define the responsibilities of our
CurrencyRendererHelper. Basically, it will have two methods just
for demonstration purpose:

function usd($amount)
This function will receive the amount to render. It will take 2
decimal digits filling empty space with zeros and prefix 'USD'.

function euro($amount)
This function will do the same as usd() but prefix the output with
'EUR'. Just to make it a bit more complex, we will also wrap the
result in span tags:

::

    <span class="euro"></span> 

Let's create the tests first:

::

    <?php
    
    //Import the helper to be tested.
    //If the tested helper were using some other helper, like Html, 
    //it should be impoorted in this line, and instantialized in startTest().
    App::import('Helper', 'CurrencyRenderer');
    
    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;
    
        //Here we instantiate our helper, and all other helpers we need.
        public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }
    
        //testing usd() function.
        public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            //We should always have 2 decimal digits.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            //Testing the thousands separator
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }
    }

Here, we call ``usd()`` with different parameters and tell the test
suite to check if the returned values are equal to what is
expected.

Executing the test now will result in errors (because
currencyRendererHelper doesn't even exist yet) showing that we have
3 fails.

Once we know what our method should do, we can write the method
itself:

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot,
thousands separator to comma, and prefix the formatted number with
'USD' string.

Save this in app/views/helpers/currency\_renderer.php and execute
the test. You should see a green bar and messaging indicating 4
passes.

4.7.7 Testing Helpers
---------------------

Since a decent amount of logic resides in Helper classes, it's
important to make sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for
Components. Suppose we have a helper called CurrencyRendererHelper
located in ``app/views/helpers/currency_renderer.php`` with its
accompanying test case file located in
``app/tests/cases/helpers/currency_renderer.test.php``

Creating Helper test, part I
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First of all we will define the responsibilities of our
CurrencyRendererHelper. Basically, it will have two methods just
for demonstration purpose:

function usd($amount)
This function will receive the amount to render. It will take 2
decimal digits filling empty space with zeros and prefix 'USD'.

function euro($amount)
This function will do the same as usd() but prefix the output with
'EUR'. Just to make it a bit more complex, we will also wrap the
result in span tags:

::

    <span class="euro"></span> 

Let's create the tests first:

::

    <?php
    
    //Import the helper to be tested.
    //If the tested helper were using some other helper, like Html, 
    //it should be impoorted in this line, and instantialized in startTest().
    App::import('Helper', 'CurrencyRenderer');
    
    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;
    
        //Here we instantiate our helper, and all other helpers we need.
        public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }
    
        //testing usd() function.
        public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            //We should always have 2 decimal digits.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            //Testing the thousands separator
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }
    }

Here, we call ``usd()`` with different parameters and tell the test
suite to check if the returned values are equal to what is
expected.

Executing the test now will result in errors (because
currencyRendererHelper doesn't even exist yet) showing that we have
3 fails.

Once we know what our method should do, we can write the method
itself:

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot,
thousands separator to comma, and prefix the formatted number with
'USD' string.

Save this in app/views/helpers/currency\_renderer.php and execute
the test. You should see a green bar and messaging indicating 4
passes.
