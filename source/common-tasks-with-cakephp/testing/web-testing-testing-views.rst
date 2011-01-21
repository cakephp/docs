4.7.9 Web testing - Testing views
---------------------------------

Most, if not all, CakePHP projects result in a web application.
While unit tests are an excellent way to test small parts of
functionality, you might also want to test the functionality on a
large scale. The **CakeWebTestCase** class provides a good way of
doing this testing from a user point-of-view.

About CakeWebTestCase
~~~~~~~~~~~~~~~~~~~~~

**CakeWebTestCase** is a direct extension of the SimpleTest
WebTestCase, without any extra functionality. All the functionality
found in the
`SimpleTest documentation for Web testing <http://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
is also available here. This also means that no functionality other
than that of SimpleTest is available. This means that you cannot
use fixtures, and
**all web test cases involving updating/saving to the database will permanently change your database values**.
Test results are often based on what values the database holds, so
making sure the database contains the values you expect is part of
the testing procedure.

Creating a test
~~~~~~~~~~~~~~~

In keeping with the other testing conventions, you should create
your view tests in tests/cases/views. You can, of course, put those
tests anywhere but following the conventions whenever possible is
always a good idea. So let's create the file
tests/cases/views/complete\_web.test.php

First, when you want to write web tests, you must remember to
extend **CakeWebTestCase** instead of CakeTestCase:

::

    class CompleteWebTestCase extends CakeWebTestCase


#. ``class CompleteWebTestCase extends CakeWebTestCase``

If you need to do some preparation before you start the test,
create a constructor:

::

    function CompleteWebTestCase(){
      //Do stuff here
    }


#. ``function CompleteWebTestCase(){``
#. ``//Do stuff here``
#. ``}``

When writing the actual test cases, the first thing you need to do
is get some output to look at. This can be done by doing a **get**
or **post** request, using **get()**or **post()** respectively.
Both these methods take a full url as the first parameter. This can
be dynamically fetched if we assume that the test script is located
under http://your.domain/cake/folder/webroot/test.php by typing:

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));


#. ``$this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));``

You can then do gets and posts using Cake urls, like this:

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);


#. ``$this->get($this->baseurl."/products/index/");``
#. ``$this->post($this->baseurl."/customers/login", $data);``

The second parameter to the post method, **$data**, is an
associative array containing the post data in Cake format:

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");


#. ``$data = array(``
#. ``"data[Customer][mail]" => "user@user.com",``
#. ``"data[Customer][password]" => "userpass");``

When you have requested the page you can do all sorts of asserts on
it, using standard SimpleTest web test methods.

Walking through a page
~~~~~~~~~~~~~~~~~~~~~~

CakeWebTest also gives you an option to navigate through your page
by clicking links or images, filling forms and clicking buttons.
Please refer to the SimpleTest documentation for more information
on that.

4.7.9 Web testing - Testing views
---------------------------------

Most, if not all, CakePHP projects result in a web application.
While unit tests are an excellent way to test small parts of
functionality, you might also want to test the functionality on a
large scale. The **CakeWebTestCase** class provides a good way of
doing this testing from a user point-of-view.

About CakeWebTestCase
~~~~~~~~~~~~~~~~~~~~~

**CakeWebTestCase** is a direct extension of the SimpleTest
WebTestCase, without any extra functionality. All the functionality
found in the
`SimpleTest documentation for Web testing <http://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
is also available here. This also means that no functionality other
than that of SimpleTest is available. This means that you cannot
use fixtures, and
**all web test cases involving updating/saving to the database will permanently change your database values**.
Test results are often based on what values the database holds, so
making sure the database contains the values you expect is part of
the testing procedure.

Creating a test
~~~~~~~~~~~~~~~

In keeping with the other testing conventions, you should create
your view tests in tests/cases/views. You can, of course, put those
tests anywhere but following the conventions whenever possible is
always a good idea. So let's create the file
tests/cases/views/complete\_web.test.php

First, when you want to write web tests, you must remember to
extend **CakeWebTestCase** instead of CakeTestCase:

::

    class CompleteWebTestCase extends CakeWebTestCase


#. ``class CompleteWebTestCase extends CakeWebTestCase``

If you need to do some preparation before you start the test,
create a constructor:

::

    function CompleteWebTestCase(){
      //Do stuff here
    }


#. ``function CompleteWebTestCase(){``
#. ``//Do stuff here``
#. ``}``

When writing the actual test cases, the first thing you need to do
is get some output to look at. This can be done by doing a **get**
or **post** request, using **get()**or **post()** respectively.
Both these methods take a full url as the first parameter. This can
be dynamically fetched if we assume that the test script is located
under http://your.domain/cake/folder/webroot/test.php by typing:

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));


#. ``$this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));``

You can then do gets and posts using Cake urls, like this:

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);


#. ``$this->get($this->baseurl."/products/index/");``
#. ``$this->post($this->baseurl."/customers/login", $data);``

The second parameter to the post method, **$data**, is an
associative array containing the post data in Cake format:

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");


#. ``$data = array(``
#. ``"data[Customer][mail]" => "user@user.com",``
#. ``"data[Customer][password]" => "userpass");``

When you have requested the page you can do all sorts of asserts on
it, using standard SimpleTest web test methods.

Walking through a page
~~~~~~~~~~~~~~~~~~~~~~

CakeWebTest also gives you an option to navigate through your page
by clicking links or images, filling forms and clicking buttons.
Please refer to the SimpleTest documentation for more information
on that.
