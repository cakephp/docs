4.2 Data Sanitization
---------------------

The CakePHP Sanitize class can be used to rid user-submitted data
of malicious data and other unwanted information. Sanitize is a
core library, so it can be used anywhere inside of your code, but
is probably best used in controllers or models.

CakePHP already protects you against SQL Injection **if** you use
CakePHP's ORM methods (such as find() and save()) and proper array
notation (ie. array('field' => $value)) instead of raw SQL. For
sanitization against XSS its generally better to save raw HTML in
database without modification and sanitize at the time of
output/display.

All you need to do is include the Sanitize core library (e.g.
before the controller class definition):

::

    App::import('Sanitize');
    
    class MyController extends AppController {
        ...
        ...
    }


#. ``App::import('Sanitize');``
#. ``class MyController extends AppController {``
#. ``...``
#. ``...``
#. ``}``

Once you've done that, you can make calls to Sanitize statically.

4.2 Data Sanitization
---------------------

The CakePHP Sanitize class can be used to rid user-submitted data
of malicious data and other unwanted information. Sanitize is a
core library, so it can be used anywhere inside of your code, but
is probably best used in controllers or models.

CakePHP already protects you against SQL Injection **if** you use
CakePHP's ORM methods (such as find() and save()) and proper array
notation (ie. array('field' => $value)) instead of raw SQL. For
sanitization against XSS its generally better to save raw HTML in
database without modification and sanitize at the time of
output/display.

All you need to do is include the Sanitize core library (e.g.
before the controller class definition):

::

    App::import('Sanitize');
    
    class MyController extends AppController {
        ...
        ...
    }


#. ``App::import('Sanitize');``
#. ``class MyController extends AppController {``
#. ``...``
#. ``...``
#. ``}``

Once you've done that, you can make calls to Sanitize statically.
