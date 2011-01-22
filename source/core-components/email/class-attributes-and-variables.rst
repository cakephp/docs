5.4.1 Class Attributes and Variables
------------------------------------

These are the values that you can set before you call
``EmailComponent::send()``

to
Address the message is going to (string). Separate the addresses
with a comma if you want to send the email to more than one
recipient.
cc
array of addresses to cc the message to
bcc
array of addresses to bcc (blind carbon copy) the message to
replyTo
reply to address (string)
return
Return mail address that will be used in case of any errors(string)
(for mail-daemon/errors)
from
from address (string)
subject
subject for the message (string)
template
The email element to use for the message (located in
``app/views/elements/email/html/`` and
``app/views/elements/email/text/``)
layout
The layout used for the email (located in
``app/views/layouts/email/html/`` and
``app/views/layouts/email/text/``)
lineLength
Length at which lines should be wrapped. Defaults to 70. (integer)
sendAs
how do you want message sent string values of ``text``, ``html`` or
``both``
attachments
array of files to send (absolute and relative paths)
delivery
how to send the message (``mail``, ``smtp`` [would require
smtpOptions set below] and ``debug``)
smtpOptions
associative array of options for smtp mailer (``port``, ``host``,
``timeout``, ``username``, ``password``, ``client``)
There are some other things that can be set but you should refer to
the api documentation for more information

Sending Multiple Emails in a loop
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you wish to send multiple emails using a loop, you'll need to
reset the email fields using the reset method of the Email
component. You'll need to reset before setting the email properties
again.

::

    $this->Email->reset()

Debugging Emails
~~~~~~~~~~~~~~~~

If you do **not** want to actually send an email and instead want
to test out the functionality, you can use the following delivery
option:
::

    $this->Email->delivery = 'debug';

In order to view those debugging information you need to create an
extra line in your view or layout file (e.g. underneath your normal
flash message in /layouts/default.ctp):
::

    <?php echo $this->Session->flash(); ?>
    <?php echo $this->Session->flash('email'); ?>
