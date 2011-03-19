Email
#####

The emailComponent is a way for you to add simple email sending
functionality to your CakePHP application. Using the same concepts
of layouts and view ctp files to send formated messages as text,
html or both. It supports sending via the built in mail functions
of PHP, via smtp server or a debug mode where it writes the message
out to a session flash message. It supports file attachments and
does some basic header injection checking/ filtering for you. There
is a lot that it doesn't do for you but it will get you started.


Class Attributes and Variables
==============================

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
---------------------------------

If you wish to send multiple emails using a loop, you'll need to
reset the email fields using the reset method of the Email
component. You'll need to reset before setting the email properties
again.

::

    $this->Email->reset()

Debugging Emails
----------------

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


Sending a basic message
=======================

To send a message without using a template, simply pass the body of
the message as a string (or an array of lines) to the send()
method. For example:

::

    $this->Email->from    = 'Somebody <somebody@example.com>';
    $this->Email->to      = 'Somebody Else <somebody.else@example.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Hello message body!');

Setting up the Layouts
----------------------

To use both text and html mailing message you need to create layout
files for them, just like in setting up your default layouts for
the display of your views in a browser, you need to set up default
layouts for your email messages. In the ``app/views/layouts/``
directory you need to set up (at a minimum) the following
structure

::

        email/
            html/
                default.ctp
            text/
                default.ctp

These are the files that hold the layout templates for your default
messages. Some example content is below

``email/text/default.ctp``
::

        <?php echo $content_for_layout; ?>

``email/html/default.ctp``
::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>

Setup an email element for the message body
-------------------------------------------

In the ``app/views/elements/email/`` directory you need to set up
folders for ``text`` and ``html`` unless you plan to just send one
or the other. In each of these folders you need to create templates
for both types of messages referring to the content that you send
to the view either by using $this->set() or using the $contents
parameter of the send() method. Some simple examples are shown
below. For this example we will call the templates
simple\_message.ctp

``text``
::

     Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,
       Thank you for your interest.

``html``
::

     <p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>

The ``$content`` parameter for the send() method is sent to any
templates as ``$content``.
Controller code for using Email component
-----------------------------------------

In your controller you need to add the component to your
``$components`` array or add a $components array to your controller
like:

::

    <?php
    var $components = array('Email');
    ?>

In this example we will set up a private method to handle sending
the email messages to a user identified by an $id. In our
controller (let's use the User controller in this example)

::

     
    <?php
    function _sendNewUserMail($id) {
        $User = $this->User->read(null,$id);
        $this->Email->to = $User['User']['email'];
        $this->Email->bcc = array('secret@example.com');  
        $this->Email->subject = 'Welcome to our really cool thing';
        $this->Email->replyTo = 'support@example.com';
        $this->Email->from = 'Cool Web App <app@example.com>';
        $this->Email->template = 'simple_message'; // note no '.ctp'
        //Send as 'html', 'text' or 'both' (default is 'text')
        $this->Email->sendAs = 'both'; // because we like to send pretty mail
        //Set view variables as normal
        $this->set('User', $User);
        //Do not pass any args to send()
        $this->Email->send();
     }
    ?>

You have sent a message, you could call this from another method
like
::

     
    $this->_sendNewUserMail( $this->User->id );

Attachments
-----------

Here's how you can send file attachments along with your message.
You set an array containing the paths to the files to attach to the
``attachments`` property of the component.

::

    $this->Email->attachments = array(
        TMP . 'foo.doc',
        'bar.doc' => TMP . 'some-temp-name'
    );

The first file ``foo.doc`` will be attached with the same filename.
For the second file we specify an alias ``bar.doc`` will be be used
for attaching instead of its actual filename ``some-temp-name``

Sending A Message Using SMTP
============================

To send an email using an SMTP server, the steps are similar to
sending a basic message. Set the delivery method to ``smtp`` and
assign any options to the Email object's ``smtpOptions`` property.
You may also retrieve SMTP errors generated during the session by
reading the ``smtpError`` property of the component.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'your.smtp.server',
            'username'=>'your_smtp_username',
            'password'=>'your_smtp_password',
            'client' => 'smtp_helo_hostname'
       );
    
        /* Set delivery method */
        $this->Email->delivery = 'smtp';
    
        /* Do not pass any args to send() */
        $this->Email->send();
    
        /* Check for SMTP errors. */
        $this->set('smtp_errors', $this->Email->smtpError);

If your SMTP server requires authentication, be sure to specify the
username and password parameters for ``smtpOptions`` as shown in
the example.

If you don't know what an SMTP HELO is, then you most likely will
not need to set the ``client`` parameter for the ``smtpOptions``.
This is only needed for compatibility with SMTP servers which do
not fully respect :rfc:`821` (SMTP HELO).

Here are example options for using Gmail's SMTP server.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'465', 
            'timeout'=>'30',
            'host' => 'ssl://smtp.gmail.com',
            'username'=>'your_username@gmail.com',
            'password'=>'your_gmail_password',
       );
