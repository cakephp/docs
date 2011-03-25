Exceptions
##########

Exception configuration
=======================

There are a few keys available for configuring exceptions::

	Configure::write('Exception', array(
		'handler' => 'ErrorHandler::handleException',
		'renderer' => 'ExceptionRenderer',
		'log' => true
	));

* ``handler`` - callback - The callback to handle exceptions. You can set this to any callback type, including anonymous functions.
* ``renderer`` - string - The class responsible for rendering uncaught exceptions.  If you choose a custom class you should place the file for that class in app/libs. This class needs to implement a render method.
* ``log`` - boolean - When true, exceptions + their stack traces will be logged to CakeLog.

Exception rendering by default displays an HTML page, you can customize either the handler or the renderer by changing the settings.  Changing the handler, allows you to take full control over the exception handling process, while changing the renderer allows you to easily change the output type/contents, as well as add in application specific exception handling.


Exception classes
=================

There are a number of new exception classes in CakePHP 2.0.  Each exception replaces a ``cakeError()`` error messages from the past.  Exceptions offer additional flexibility in that they can be extended and contain some logic.  The built in exception handling will capture any uncaught exceptions and render a useful page.  As before any uncaught exceptions in production settings will be treated as an Internal Server Error.


Creating your own application exceptions
========================================

You can create your own application exceptions using any of the built in [SPL exceptions](http://php.net/manual/en/spl.exceptions.php), ``Exception`` itself, or :php:exc:`CakeException`.  :php:exc:`CakeException` is special in that all :php:exc:`CakeException` objects are coerced into into either 500 or 404 errors depending on the code they are used.  When in development mode :php:exc:`CakeException` objects simply need a new template that matches the class name in order to provide useful information::

    class MissingWidgetException extends CakeException {};


The above class could provide nice development errors, by creating ``app/views/errors/missing_widget.ctp``.  When in production mode, the above error would be treated as a 500 error.  When subclassing :php:exc:`CakeException` the constructor has been extended, allowing you to pass in hashes of data.  These hashes are passed into the template that is used to represent the error in development mode,  allowing you to create data rich exceptions.  You can also provide a message template which allows the native ``__toString()`` methods to work as normal::


    class MissingWidgetException extends CakeException {
    	protected $_messageTemplate = 'Seems that %s is missing.';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));


When caught by the built in exception handler, you would get a `$widget` variable in your view template. In addition if you cast the exception as a string or use its ``getMessage()`` method you will get ``Seems that Pointy is missing.``. This allows you easily and quickly create your own rich development errors, just like CakePHP uses internally.


Creating custom status codes
----------------------------

You can create custom HTTP status codes by changing the code used when creating an Exception::

    throw new MissingWidgetHelperException('Its not here', 501);

Will create a 501 response code, you can use any HTTP status code you want. If you have a code equal to or greater than 500 you will see the error500 template.  For any other error code you'll get the error400 template.


Extending and implementing your own Exception handlers
======================================================

You can implement application specific exception handling in one of a few ways.  Each approach gives you different amounts of control over the exception handling process.

- Set ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
- Create ``AppController::appError();``
- Set ``Configure::write('Exception.renderer', 'YourClass');``


Create your own Exception handler with `Exception.handler`
==========================================================

This gives you full control over the exception handling process.  The class you choose should be loaded in your app/config/bootstrap.php, so its available to handle any exceptions.  You can define the handler as any callback type. You can't combine this with other Exception settings::

    <?php
    // in app/config/core.php
    Configure::write('Exception.handler', 'AppException::handleException');

    // in app/config/bootstrap.php
    App::import('Lib', 'AppException');

    // in app/libs/app_exception.php
    class AppException {
        public static function handleException($error) {
            echo 'Oh noes! ' . $error->getMessage();
        }
    }

You can run any code you wish inside handleException.  The code above would simple print 'Oh noes! ' plus the exception message.  You can define exception handlers as any type of callback, even an anonymous function if you are using PHP 5.3::

    <?php
    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });


Using AppController::appError();
================================

This controller method is called instead of the default exception rendering.  It receives the thrown exception as its only argument.  You should implement your error handling in that method.


Using a custom renderer with Exception.renderer to handle application exceptions
==================================================================================

If you don't want to take control of the exception handling, but want to change how exceptions are rendered you can use ``Configure::write('Exception.renderer', 'AppExceptionRenderer');`` to choose a class to render exception pages.  By default :php:class`ExceptionRenderer` is used.  Your custom exception renderer class should be placed in ``app/libs``.  In a custom exception rendering class you can provide specialized handling for application specific errors::


	// in app/libs/app_exception_renderer.php
	<?php
	App::import('Core', 'ExceptionRenderer');
	
	class AppExceptionRenderer extends ExceptionRenderer {
		public function missingWidget($error) {
			echo 'Oops that widget is missing!';
		}
	}
	?>


The above would handle any exceptions of the type ``MissingWidgetException``, and allow you to provide custom display/handling logic for those application exceptions.  Exception handling methods get the exception being handled as their argument.

Your custom renderer should expect an exception in its constructor, and implement a render method. Failing to do so will cause additional errors.


Creating a custom controller to handle exceptions
-------------------------------------------------

In your ExceptionRenderer sub-class, you can use the ``_getController`` method to allow you to return a custom controller to handle your errors.  By default CakePHP uses `CakeErrorController` which omits a few of the normal callbacks to help ensure errors always display.  However, you may need a more custom error handling controller in your application.  By implementing ``_getController`` in your ``AppError`` class, you can use any controller you want::

    <?php
	class AppExceptionRenderer extends ExceptionRenderer {
		protected function _getController($exception) {
			App::import('Controller', 'SuperCustomError');
			return new SuperCustomErrorController();
		}
	}

Alternatively, you could just override the core CakeErrorController, by including one in ``app/controllers``.  If you are using a custom controller for error handling, make sure you do all the setup you need in your constructor, or the render method.  As those are the only methods that the built-in ``ErrorHandler`` class directly call.


Logging exceptions
------------------

Using the built-in exception handling, you can log all the exceptions that are dealt with by ErrorHandler by setting ``Exception.log`` to true in your core.php. Enabling this will log every exception to :php:class:`CakeLog` and the configured loggers.


Built in Exceptions for CakePHP
===============================

There are several built-in exceptions inside CakePHP, outside of the internal framework exceptions, there are several exceptions for HTTP methods

.. php:exception:: BadRequestException

    Used for doing 400 Bad Request error.
.. php:exception::UnauthorizedException

    Used for doing a 401 Not found error.
    
.. php:exception:: ForbiddenException
    
    Used for doing a 403 Forbidden error.
    
.. php:exception:: NotFoundException

    Used for doing a 404 Not found error.
    
.. php:exception:: MethodNotAllowedException

    Used for doing a 405 Method Not Allowed error.

.. php:exception:: InternalErrorException

    Used for doing a 500 Internal Server Error.

You can throw these exceptions from you controllers to indicate failure states.  In addition, the following framework layer exceptions are available, and will be thrown from a number of CakePHP core components:

.. php:exception:: MissingViewException

.. php:exception:: MissingLayoutException

.. php:exception:: MissingHelperClassException

.. php:exception:: MissingHelperFileException

.. php:exception:: MissingBehaviorClassException

.. php:exception:: MissingBehaviorFileException

.. php:exception:: MissingComponentClassException

.. php:exception:: MissingComponentFileException

.. php:exception:: MissingTaskClassException

.. php:exception:: MissingTaskFileException

.. php:exception:: MissingShellClassException

.. php:exception:: MissingShellFileException

.. php:exception:: MissingShellMethodException

.. php:exception:: MissingDatabaseException

.. php:exception:: MissingConnectionException

.. php:exception:: MissingTableException

.. php:exception:: MissingActionException

.. php:exception:: MissingControllerException

.. php:exception:: PrivateActionException

.. php:exception:: CakeException

These exception classes all extend :php:exc:`CakeException`.  By extending CakeException, you can create your own 'framework' errors.  All of the standard Exceptions that CakePHP will throw also extend CakeException.


Using HTTP exceptions in your controllers
=========================================

You can throw any of the HTTP related exceptions from your controller actions to indicate failure states.  For example::

    <?php
	function view($id) {
		$post = $this->Post->read(null, $id);
		if (!$post) {
			throw new NotFoundException();
		}
		$this->set(compact('post'));
	}

The above would cause the configured ``Exception.handler`` to catch and process the :php:exc`NotFoundException`.  By default this will create an error page, and log the exception.
