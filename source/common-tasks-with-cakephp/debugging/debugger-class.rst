4.4.3 Debugger Class
--------------------

The debugger class was introduced with CakePHP 1.2 and offers even
more options for obtaining debugging information. It has several
functions which are invoked statically, and provide dumping,
logging, and error handling functions.

The Debugger Class overrides PHP's default error handling,
replacing it with far more useful error reports. The Debugger's
error handling is used by default in CakePHP. As with all debugging
functions, Configure::debug must be set to a value higher than 0.

When an error is raised, Debugger both outputs information to the
page and makes an entry in the error.log file. The error report
that is generated has both a stack trace and a code excerpt from
where the error was raised. Click on the "Error" link type to
reveal the stack trace, and on the "Code" link to reveal the
error-causing lines.

4.4.3 Debugger Class
--------------------

The debugger class was introduced with CakePHP 1.2 and offers even
more options for obtaining debugging information. It has several
functions which are invoked statically, and provide dumping,
logging, and error handling functions.

The Debugger Class overrides PHP's default error handling,
replacing it with far more useful error reports. The Debugger's
error handling is used by default in CakePHP. As with all debugging
functions, Configure::debug must be set to a value higher than 0.

When an error is raised, Debugger both outputs information to the
page and makes an entry in the error.log file. The error report
that is generated has both a stack trace and a code excerpt from
where the error was raised. Click on the "Error" link type to
reveal the stack trace, and on the "Code" link to reveal the
error-causing lines.
