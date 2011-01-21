4.7.4 Creating tests
--------------------

First, lets go through a number of rules, or guidelines, concerning
tests:


#. PHP files containing tests should be in your
   **app/tests/cases/[some\_folder]**.
#. The filenames of these files should end in **.test.php** instead
   of just .php.
#. The classes containing tests should extend **CakeTestCase** or
   **CakeWebTestCase**.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with **test**, as in **testPublished()**.

When you have created a test case, you can execute it by browsing
to **http://your.cake.domain/cake\_folder/test.php** (depending on
how your specific setup looks) and clicking App test cases, and
then click the link to your specific file.

CakeTestCase Callback Methods
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to sneak in some logic just before or after an
individual CakeTestCase method, and/or before or after your entire
CakeTestCase, the following callbacks are available:

**start()**
First method called in a *test case*.

**end()**
Last method called in a *test case*.

**startCase()**
called before a *test case* is started.

**endCase()**
called after a *test case* has run.

**before($method)**
Announces the start of a *test method*.

**after($method)**
Announces the end of a *test method*.

**startTest($method)**
Called just before a *test method* is executed.

**endTest($method)**
Called just after a *test method* has completed.

4.7.4 Creating tests
--------------------

First, lets go through a number of rules, or guidelines, concerning
tests:


#. PHP files containing tests should be in your
   **app/tests/cases/[some\_folder]**.
#. The filenames of these files should end in **.test.php** instead
   of just .php.
#. The classes containing tests should extend **CakeTestCase** or
   **CakeWebTestCase**.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with **test**, as in **testPublished()**.

When you have created a test case, you can execute it by browsing
to **http://your.cake.domain/cake\_folder/test.php** (depending on
how your specific setup looks) and clicking App test cases, and
then click the link to your specific file.

CakeTestCase Callback Methods
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to sneak in some logic just before or after an
individual CakeTestCase method, and/or before or after your entire
CakeTestCase, the following callbacks are available:

**start()**
First method called in a *test case*.

**end()**
Last method called in a *test case*.

**startCase()**
called before a *test case* is started.

**endCase()**
called after a *test case* has run.

**before($method)**
Announces the start of a *test method*.

**after($method)**
Announces the end of a *test method*.

**startTest($method)**
Called just before a *test method* is executed.

**endTest($method)**
Called just after a *test method* has completed.
