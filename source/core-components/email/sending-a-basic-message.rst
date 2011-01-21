5.4.2 Sending a basic message
-----------------------------

To send a message without using a template, simply pass the body of
the message as a string (or an array of lines) to the send()
method. For example:

::

    $this->Email->from    = 'Somebody <somebody@example.com>';
    $this->Email->to      = 'Somebody Else <somebody.else@example.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Hello message body!');


#. ``$this->Email->from    = 'Somebody <somebody@example.com>';``
#. ``$this->Email->to      = 'Somebody Else <somebody.else@example.com>';``
#. ``$this->Email->subject = 'Test';``
#. ``$this->Email->send('Hello message body!');``

Setting up the Layouts
~~~~~~~~~~~~~~~~~~~~~~

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


#. ``email/``
#. ``html/``
#. ``default.ctp``
#. ``text/``
#. ``default.ctp``

These are the files that hold the layout templates for your default
messages. Some example content is below

``email/text/default.ctp``
::

        <?php echo $content_for_layout; ?>


#. ``<?php echo $content_for_layout; ?>``

``email/html/default.ctp``
::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>


#. ``<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">``
#. ``<html>``
#. ``<body>``
#. ``<?php echo $content_for_layout; ?>``
#. ``</body>``
#. ``</html>``

Setup an email element for the message body
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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


#. ``Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,``
#. ``Thank you for your interest.``

``html``
::

     <p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>


#. ``<p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />``
#. ``&nbsp;&nbsp;&nbsp;Thank you for your interest.</p>``

The ``$content`` parameter for the send() method is sent to any
templates as ``$content``.
Controller code for using Email component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller you need to add the component to your
``$components`` array or add a $components array to your controller
like:

::

    <?php
    var $components = array('Email');
    ?>


#. ``<?php``
#. ``var $components = array('Email');``
#. ``?>``

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


#. ``<?php``
#. ``function _sendNewUserMail($id) {``
#. ``$User = $this->User->read(null,$id);``
#. ``$this->Email->to = $User['User']['email'];``
#. ``$this->Email->bcc = array('secret@example.com');``
#. ``$this->Email->subject = 'Welcome to our really cool thing';``
#. ``$this->Email->replyTo = 'support@example.com';``
#. ``$this->Email->from = 'Cool Web App <app@example.com>';``
#. ``$this->Email->template = 'simple_message'; // note no '.ctp'``
#. ``//Send as 'html', 'text' or 'both' (default is 'text')``
#. ``$this->Email->sendAs = 'both'; // because we like to send pretty mail``
#. ``//Set view variables as normal``
#. ``$this->set('User', $User);``
#. ``//Do not pass any args to send()``
#. ``$this->Email->send();``
#. ``}``
#. ``?>``

You have sent a message, you could call this from another method
like
::

     
    $this->_sendNewUserMail( $this->User->id );


#. ````
#. ``$this->_sendNewUserMail( $this->User->id );``

Attachments
~~~~~~~~~~~

Here's how you can send file attachments along with your message.
You set an array containing the paths to the files to attach to the
``attachments`` property of the component.

::

    $this->Email->attachments = array(
        TMP . 'foo.doc',
        'bar.doc' => TMP . 'some-temp-name'
    );


#. ``$this->Email->attachments = array(``
#. ``TMP . 'foo.doc',``
#. ``'bar.doc' => TMP . 'some-temp-name'``
#. ``);``

The first file ``foo.doc`` will be attached with the same filename.
For the second file we specify an alias ``bar.doc`` will be be used
for attaching instead of its actual filename ``some-temp-name``

5.4.2 Sending a basic message
-----------------------------

To send a message without using a template, simply pass the body of
the message as a string (or an array of lines) to the send()
method. For example:

::

    $this->Email->from    = 'Somebody <somebody@example.com>';
    $this->Email->to      = 'Somebody Else <somebody.else@example.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Hello message body!');


#. ``$this->Email->from    = 'Somebody <somebody@example.com>';``
#. ``$this->Email->to      = 'Somebody Else <somebody.else@example.com>';``
#. ``$this->Email->subject = 'Test';``
#. ``$this->Email->send('Hello message body!');``

Setting up the Layouts
~~~~~~~~~~~~~~~~~~~~~~

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


#. ``email/``
#. ``html/``
#. ``default.ctp``
#. ``text/``
#. ``default.ctp``

These are the files that hold the layout templates for your default
messages. Some example content is below

``email/text/default.ctp``
::

        <?php echo $content_for_layout; ?>


#. ``<?php echo $content_for_layout; ?>``

``email/html/default.ctp``
::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>


#. ``<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">``
#. ``<html>``
#. ``<body>``
#. ``<?php echo $content_for_layout; ?>``
#. ``</body>``
#. ``</html>``

Setup an email element for the message body
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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


#. ``Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,``
#. ``Thank you for your interest.``

``html``
::

     <p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>


#. ``<p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />``
#. ``&nbsp;&nbsp;&nbsp;Thank you for your interest.</p>``

The ``$content`` parameter for the send() method is sent to any
templates as ``$content``.
Controller code for using Email component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller you need to add the component to your
``$components`` array or add a $components array to your controller
like:

::

    <?php
    var $components = array('Email');
    ?>


#. ``<?php``
#. ``var $components = array('Email');``
#. ``?>``

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


#. ``<?php``
#. ``function _sendNewUserMail($id) {``
#. ``$User = $this->User->read(null,$id);``
#. ``$this->Email->to = $User['User']['email'];``
#. ``$this->Email->bcc = array('secret@example.com');``
#. ``$this->Email->subject = 'Welcome to our really cool thing';``
#. ``$this->Email->replyTo = 'support@example.com';``
#. ``$this->Email->from = 'Cool Web App <app@example.com>';``
#. ``$this->Email->template = 'simple_message'; // note no '.ctp'``
#. ``//Send as 'html', 'text' or 'both' (default is 'text')``
#. ``$this->Email->sendAs = 'both'; // because we like to send pretty mail``
#. ``//Set view variables as normal``
#. ``$this->set('User', $User);``
#. ``//Do not pass any args to send()``
#. ``$this->Email->send();``
#. ``}``
#. ``?>``

You have sent a message, you could call this from another method
like
::

     
    $this->_sendNewUserMail( $this->User->id );


#. ````
#. ``$this->_sendNewUserMail( $this->User->id );``

Attachments
~~~~~~~~~~~

Here's how you can send file attachments along with your message.
You set an array containing the paths to the files to attach to the
``attachments`` property of the component.

::

    $this->Email->attachments = array(
        TMP . 'foo.doc',
        'bar.doc' => TMP . 'some-temp-name'
    );


#. ``$this->Email->attachments = array(``
#. ``TMP . 'foo.doc',``
#. ``'bar.doc' => TMP . 'some-temp-name'``
#. ``);``

The first file ``foo.doc`` will be attached with the same filename.
For the second file we specify an alias ``bar.doc`` will be be used
for attaching instead of its actual filename ``some-temp-name``
