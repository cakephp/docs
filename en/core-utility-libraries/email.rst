CakeEmail
#########

.. php:class:: CakeEmail

``CakeEmail`` is a new class from the cake library to send emails. With this
class you can send email from any place of your application, ie. Controllers,
Models, Console.

This class replace the ``EmailComponent`` and give more flexibility to you send
your emails. For example, you can create your custom methods to send email
instead use the hard-coded smtp and mail.

Basic usage
===========

First of all, you should call the ``App::uses()`` to import the class:
``App::uses('CakeEmail', 'Network/Email');``.

The use of the class is similar of ``EmailComponent``, but instead use
attributes you must use methods. Example:
::

    $email = new CakeEmail();
    $email->from('me@example.com');
    $email->to('you@example.com');
    $email->subject('About');
    $email->send('My message');

To simplify, all set methods return the instance of class. You can re-write the
same code as:

::

    $email = new CakeEmail();
    $email->from('me@example.com')->to('you@example.com')->subject('About')->send('My message');

New Features
============

**Paths**

The paths are changed from elements path to views path directly. So, the email
templates are now located in ``app/View/Emails/html/template.ctp`` and
``app/View/Emails/text/template.ctp``. The layouts are changed to
``app/View/Layout/Emails``.

**Headers**

In ``EmailComponent`` you only can set the ``X-*`` headers. In ``CakeEmail`` you
are free to set what you want. So, if you are migrating to the new class, do not
forget to put the ``X-`` prefix in your headers.

**Sender configuration**

Now you can configure the sender header easily using the ``sender()`` method.

**Attachments**

The attachment format has changed. Below the new forms:

1. String: ``$email->attachments('/full/file/path/file.png')`` will attach this
   file with the name file.png.
2. Array: ``$email->attachments(array('/full/file/path/file.png')`` will have
   the same behavior of string.
3. Array with key:
   ``$email->attachments(array('photo.png' => '/full/some_hash.png'))`` will
   attach some_hash.png with the name photo.png.
4. Array with arrays:
   ``$email->attachments(array('photo.png' => array('file' =>'/full/some_hash.png', 'mimetype' => 'image/png', 'contentId' => 'my-unique-id')))``
   will attach the file with different mimetype and with custom Content ID
   (when set the content ID the attachment is transformed to inline). The
   mimetype and contentId are optional in this form.

  4.1. When you are using the ``contentId``, you can use the file in the html
  body like ``<img src="cid:my-content-id">``.

**Transports**

Transports are classes designed to send the e-mail over some protocol or method.
CakePHP support the Mail (default) and Smtp transports.

To configure your method, you must use the ``CakeEmail::transport()`` method.

**Creating custom Transports**

You are able to create your custom transports to integrate with others emails
systems (like SwiftMailer). To it, you must to create the file
``app/Network/Email/YourTransport.php`` (where Your is the name of your
transport).

This file must contain the class ``YourTransport`` extending
``AbstractTransport`` (do not forget to use
``App::uses('AbstractTransport', 'Network/Email');`` before).

You must implement the method ``send(CakeEmail $email)`` with your custom logic.
Optionally, you can implement the method ``config($config)`` that is called
before the send to pass the user configurations. By default, this method put the
configuration in protected attribute ``$_config``.

If you need to call some method from this transport before send, you can call
the method ``transportClass()`` from ``CakeEmail`` to get an instance of
transport. Example:

::

    $yourInstance = $email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $email->send();

**Configuration**

Similar of database configuration, email also have a class to put the
configurations!

You should create the file ``app/Config/email.php`` with the class
``EmailConfig``. The ``app/Config/email.php.default`` have an example of this
file.

The ``CakeEmail`` create an instance of this file before use the config. If you
have a variable data to put in the configs, you can use the constructor to do
that.

You also can configure SMTP servers with SSL connection, like GMail. To it, put
``'ssl://'`` at prefix in the host and configure properly the port value.
Example:

::

    public $gmail = array(
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret'
    );

.. note::

    To have this feature you need to have the SSL configured in your PHP
    install.

**Deliver**

Are you bored with too many configurations to do every time? You send every time
the same email? Ok, now it is more easy...

You can create a configuration in ``EmailConfig`` or an array with all options
that you need and use the static method ``CakeEmail::deliver()``. Example:

::

    CakeEmail::deliver('you@example.com', 'Subject', 'Message', array('from' => 'me@example.com'));

This method will send an email to you@example.com, from me@example.com with
subject Subject and content Message.

The return is a ``CakeEmail`` instance with all configurations setted. If you do
not want send the email and configure something more before send, you can pass
the 5th parameter as false.

The 3rd parameter is the content of message or an array with variables (when
using rendered content).

The 4th parameter can be an array with the configurations or a string with the
name of configuration in ``EmailConfig``.

If you want, you can pass the to, subject and message as null and do all
configurations in the 4th parameter (as array or using ``EmailConfig``). The
follow configurations are used:

-  ``'from'``: Email or array of sender. See ``CakeEmail::from()``.
-  ``'sender'``: Email or array of real sender. See ``CakeEmail::sender()``.
-  ``'to'``: Email or array of destination. See ``CakeEmail::to()``.
-  ``'cc'``: Email or array of carbon copy. See ``CakeEmail::cc()``.
-  ``'bcc'``: Email or array of blind carbon copy. See ``CakeEmail::bcc()``.
-  ``'replyTo'``: Email or array to reply the e-mail. See ``CakeEmail::replyTo()``.
-  ``'readReceipt'``: Email or array to receive the receipt of read. See ``CakeEmail::readReceipt()``.
-  ``'returnPath'``: Email or array to return if have some error. See ``CakeEmail::returnPath()``.
-  ``'messageId'``: Message ID of e-mail. See ``CakeEmail::messageId()``.
-  ``'subject'``: Subject of the message. See ``CakeEmail::subject()``.
-  ``'message'``: Content of message. Do not set this field if you are using rendered content.
-  ``'headers'``: Headers to be included. See ``CakeEmail::setHeaders()``.
-  ``'viewRender'``: If you are using rendered content, set the view classname. See ``CakeEmail::viewRender()``.
-  ``'template'``: If you are using rendered content, set the template name. See ``CakeEmail::template()``.
-  ``'layout'``: If you are using rendered content, set the layout to render. If you want to render a template without layout, set this field to null. See ``CakeEmail::template()``.
-  ``'viewVars'``: If you are using rendered content, set the array with variables to be used in the view. See ``CakeEmail::viewVars()``.
-  ``'attachments'``: List of files to attach. See ``CakeEmail::attachments()``.
-  ``'emailFormat'``: Format of email (html, text or both). See ``CakeEmail::emailFormat()``.
-  ``'transport'``: Transport name. See ``CakeEmail::transport()``.

All these configurations are optional, except ``'from'``. If you put more
configurations in this array, these configurations will be used in the
``CakeEmail::config()`` method. For example, if you are using smtp transport,
you should pass the host, port and others configurations.
