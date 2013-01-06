Logging
#######

While CakePHP core Configure Class settings can really help you see
what's happening under the hood, there are certain times that you'll
need to log data to the disk in order to find out what's going on. In a
world that is becoming more dependent on technologies like SOAP and
AJAX, debugging can be rather difficult.

Logging can also be a way to find out what's been going on in your
application over time. What search terms are being used? What sorts of
errors are my users being shown? How often is a particular query being
executed?

Logging data in CakePHP is easy - the log() function is a part of the
Object class, which is the common ancestor for almost all CakePHP
classes. If the context is a CakePHP class (Model, Controller,
Component... almost anything), you can log your data.

Using the log function
======================

The log() function takes two parameters. The first is the message you'd
like written to the log file. By default, this error message is written
to the error log found in app/tmp/logs/error.log.

::

    //Executing this inside a CakePHP class:
     
    $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
     
    2007-11-02 10:22:02 Error: Something didn't work!

The second parameter is used to define the log type you wish to write
the message to. If not supplied, it defaults to LOG\_ERROR, which writes
to the error log previously mentioned. You can set this second parameter
to LOG\_DEBUG to write your messages to an alternate debug log found at
app/tmp/logs/debug.log:

::

    //Executing this inside a CakePHP class:
     
    $this->log('A debugging message.', LOG_DEBUG);
     
    //Results in this being appended to app/tmp/logs/debug.log (rather than error.log)
     
    2007-11-02 10:22:02 Error: A debugging message.

You can also specify a different name for the log file, by setting the
second parameter to the name of the file.

::

    //Executing this inside a CakePHP class:
     
    $this->log('A special message for activity logging', 'activity');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
     
    2007-11-02 10:22:02 Activity: A special message for activity logging

Your app/tmp directory must be writable by the web server user in order
for logging to work correctly.
