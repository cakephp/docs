Error Handling
##############

In the event of an unrecoverable error in your application, it is
common to stop processing and show an error page to the user. To
save you from having to code error handling for this in each of
your controllers and components, you can use the provided method:

``$this->cakeError(string $errorType [, array $parameters]);``

Calling this method will show an error page to the user and halt
any further processing in your application.

``parameters`` must be an array of strings. If the array contains
objects (including Exception objects), they will be cast into
strings.

CakePHP pre-defines a set of error-types, but at the time of
writing, most are only really useful by the framework itself. One
that is more useful to the application developer is the good old
404 error. This can be called with no parameters as follows:

::

    $this->cakeError('error404');

Or alternatively, you can cause the page to report the error was at
a specific URL by passing the ``url`` parameter:

::

    $this->cakeError('error404', array('url' => 'some/other.url'));

This all starts being a lot more useful by extending the error
handler to use your own error-types. Application error handlers are
largely like controller actions; You typically will set() any
passed parameters to be available to the view and then render a
view file from your ``app/views/errors`` directory.

Create a file ``app/app_error.php`` with the following definition.
::

    <?php
    class AppError extends ErrorHandler {
    }   
    ?>

Handlers for new error-types can be implemented by adding methods
to this class. Simply create a new method with the name you want to
use as your error-type.

Let's say we have an application that writes a number of files to
disk and that it is appropriate to report write errors to the user.
We don't want to add code for this all over the different parts of
our application, so this is a great case for using a new error
type.

Add a new method to your ``AppError`` class. We'll take one
parameter called ``file`` that will be the path to the file we
failed to write.

::

    function cannotWriteFile($params) {
      $this->controller->set('file', $params['file']);
      $this->_outputMessage('cannot_write_file');
    }

Create the view in ``app/views/errors/cannot_write_file.ctp``

::

    <h2>Unable to write file</h2>
    <p>Could not write file <?php echo $file ?> to the disk.</p>

and throw the error in your controller/component

::

    $this->cakeError('cannotWriteFile', array('file'=>'somefilename')); 

The default implementation of
``$this->_outputMessage(<view-filename>)`` will just display the
view in ``views/errors/<view-filename>.ctp``. If you wish to
override this behaviour, you can redefine
``_outputMessage($template)`` in your AppError class.
