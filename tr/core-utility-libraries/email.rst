CakeEmail
#########

.. php:class:: CakeEmail(mixed $config = null)

``CakeEmail`` is a new class to send email. With this
class you can send email from any place in your application. In addition to
using the EmailComponent from your controller, you can also send mail from
Shells and Models.

This class replaces the :php:class:`EmailComponent` and gives more flexibility
in sending emails. For example, you can create your own transports to send
email instead of using the provided SMTP and Mail transports.

Basic usage
===========

First of all, you should ensure the class is loaded using :php:meth:`App::uses()`::

    App::uses('CakeEmail', 'Network/Email');

Using CakeEmail is similar to using :php:class:`EmailComponent`. But instead of
using attributes you use methods. Example::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'));
    $Email->to('you@example.com');
    $Email->subject('About');
    $Email->send('My message');

To simplify things, all of the setter methods return the instance of class.
You can re-write the above code as::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'))
        ->to('you@example.com')
        ->subject('About')
        ->send('My message');

Choosing the sender
-------------------

When sending email on behalf of other people it's often a good idea to define the
original sender using the Sender header. You can do so using ``sender()``::

    $Email = new CakeEmail();
    $Email->sender('app@example.com', 'MyApp emailer');

.. note::

    It's also a good idea to set the envelope sender when sending mail on another
    person's behalf. This prevents them from getting any messages about
    deliverability.

Configuration
=============

Similar to database configuration, email configuration can be centralized in a class.

Create the file ``app/Config/email.php`` with the class ``EmailConfig``.
The ``app/Config/email.php.default`` has an example of this file.

``CakeEmail`` will create an instance of the ``EmailConfig`` class to access the
config. If you have dynamic data to put in the configs, you can use the
constructor to do that::

    class EmailConfig {
        public function __construct() {
            // Do conditional assignments here.
        }
    }

It is not required to create ``app/Config/email.php``, ``CakeEmail`` can be used
without it and use respective methods to set all configurations separately or
load an array of configs.

To load a config from ``EmailConfig`` you can use the ``config()`` method or pass it
to the constructor of ``CakeEmail``::

    $Email = new CakeEmail();
    $Email->config('default');

    //or in constructor::
    $Email = new CakeEmail('default');

Instead of passing a string which matches the configuration name in ``EmailConfig``
you can also just load an array of configs::

    $Email = new CakeEmail();
    $Email->config(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

    //or in constructor::
    $Email = new CakeEmail(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

You can configure SSL SMTP servers such as Gmail. To do so, prefix the host with
``'ssl://'`` and configure the port value accordingly. Example::

    class EmailConfig {
        public $gmail = array(
            'host' => 'ssl://smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp'
        );
    }

.. note::

    To use this feature, you will need to have the SSL configured in your PHP
    install.

As of 2.3.0 you can also enable TLS SMTP using the ``tls`` option::

    class EmailConfig {
        public $gmail = array(
            'host' => 'smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp',
            'tls' => true
        );
    }

The above configuration would enable TLS communication for email messages.

.. versionadded: 2.3
    Support for TLS delivery was added in 2.3


.. _email-configurations:

Configurations
--------------

The following configuration keys are used:

- ``'from'``: Email or array of sender. See ``CakeEmail::from()``.
- ``'sender'``: Email or array of real sender. See ``CakeEmail::sender()``.
- ``'to'``: Email or array of destination. See ``CakeEmail::to()``.
- ``'cc'``: Email or array of carbon copy. See ``CakeEmail::cc()``.
- ``'bcc'``: Email or array of blind carbon copy. See ``CakeEmail::bcc()``.
- ``'replyTo'``: Email or array to reply the e-mail. See ``CakeEmail::replyTo()``.
- ``'readReceipt'``: Email address or an array of addresses to receive the
  receipt of read. See ``CakeEmail::readReceipt()``.
- ``'returnPath'``: Email address or and array of addresses to return if have
  some error. See ``CakeEmail::returnPath()``.
- ``'messageId'``: Message ID of e-mail. See ``CakeEmail::messageId()``.
- ``'subject'``: Subject of the message. See ``CakeEmail::subject()``.
- ``'message'``: Content of message. Do not set this field if you are using rendered content.
- ``'headers'``: Headers to be included. See ``CakeEmail::setHeaders()``.
- ``'viewRender'``: If you are using rendered content, set the view class name.
  See ``CakeEmail::viewRender()``.
- ``'template'``: If you are using rendered content, set the template name. See
  ``CakeEmail::template()``.
- ``'theme'``: Theme used when rendering template. See ``CakeEmail::theme()``.
- ``'layout'``: If you are using rendered content, set the layout to render. If
  you want to render a template without layout, set this field to null. See
  ``CakeEmail::template()``.
- ``'viewVars'``: If you are using rendered content, set the array with
  variables to be used in the view. See ``CakeEmail::viewVars()``.
- ``'attachments'``: List of files to attach. See ``CakeEmail::attachments()``.
- ``'emailFormat'``: Format of email (html, text or both). See ``CakeEmail::emailFormat()``.
- ``'transport'``: Transport name. See ``CakeEmail::transport()``.
- ``'log'``: Log level to log the email headers and message. ``true`` will use
  LOG_DEBUG. See also ``CakeLog::write()``
- ``'helpers'``: Array of helpers used in the email template.

All of these configurations are optional, except ``'from'``. If you put more
configurations in this array, the configurations will be used in the
:php:meth:`CakeEmail::config()` method and passed to the transport class ``config()``.
For example, if you are using the SMTP transport, you should pass the host, port and
other configurations.

.. note::

    The values of above keys using Email or array, like from, to, cc, etc will be passed
    as first parameter of corresponding methods. The equivalent for:
    ``CakeEmail::from('my@example.com', 'My Site')``
    would be defined as  ``'from' => array('my@example.com' => 'My Site')`` in your config.

Setting headers
---------------

In ``CakeEmail`` you are free to set whatever headers you want. When migrating
to use CakeEmail, do not forget to put the ``X-`` prefix in your headers.

See ``CakeEmail::setHeaders()`` and ``CakeEmail::addHeaders()``

Sending templated emails
------------------------

Emails are often much more than just a simple text message. In order
to facilitate that, CakePHP provides a way to send emails using CakePHP's
:doc:`view layer </views>`.

The templates for emails reside in a special folder in your applications
``View`` directory called ``Emails``. Email views can also use layouts,
and elements just like normal views::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

The above would use ``app/View/Emails/html/welcome.ctp`` for the view,
and ``app/View/Layouts/Emails/html/fancy.ctp`` for the layout. You can
send multipart templated email messages as well::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

This would use the following view files:

* ``app/View/Emails/text/welcome.ctp``
* ``app/View/Layouts/Emails/text/fancy.ctp``
* ``app/View/Emails/html/welcome.ctp``
* ``app/View/Layouts/Emails/html/fancy.ctp``

When sending templated emails you have the option of sending either
``text``, ``html`` or ``both``.

You can set view variables with ``CakeEmail::viewVars()``::

    $Email = new CakeEmail('templated');
    $Email->viewVars(array('value' => 12345));

In your email templates you can use these with::

    <p>Here is your value: <b><?php echo $value; ?></b></p>

You can use helpers in emails as well, much like you can in normal view files.
By default only the :php:class:`HtmlHelper` is loaded. You can load additional
helpers using the ``helpers()`` method::

    $Email->helpers(array('Html', 'Custom', 'Text'));

When setting helpers be sure to include 'Html' or it will be removed from the
helpers loaded in your email template.

If you want to send email using templates in a plugin you can use the familiar
:term:`plugin syntax` to do so::

    $Email = new CakeEmail();
    $Email->template('Blog.new_comment', 'Blog.auto_message');

The above would use templates from the Blog plugin as an example.

In some cases, you might need to override the default template provided by plugins.
You can do this using themes by telling CakeEmail to use appropriate theme using
``CakeEmail::theme()`` method::

    $Email = new CakeEmail();
    $Email->template('Blog.new_comment', 'Blog.auto_message');
    $Email->theme('TestTheme');

This allows you to override the `new_comment` template in your theme without modifying
the Blog plugin. The template file needs to be created in the following path:
``APP/View/Themed/TestTheme/Blog/Emails/text/new_comment.ctp``.

Sending attachments
-------------------

.. php:method:: attachments($attachments = null)

You can attach files to email messages as well. There are a few
different formats depending on what kind of files you have, and how
you want the filenames to appear in the recipient's mail client:

1. String: ``$Email->attachments('/full/file/path/file.png')`` will attach this
   file with the name file.png.
2. Array: ``$Email->attachments(array('/full/file/path/file.png')`` will have
   the same behavior as using a string.
3. Array with key:
   ``$Email->attachments(array('photo.png' => '/full/some_hash.png'))`` will
   attach some_hash.png with the name photo.png. The recipient will see
   photo.png, not some_hash.png.
4. Nested arrays::

    $Email->attachments(array(
        'photo.png' => array(
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        )
    ));

   The above will attach the file with different mimetype and with custom
   Content ID (when set the content ID the attachment is transformed to inline).
   The mimetype and contentId are optional in this form.

   4.1. When you are using the ``contentId``, you can use the file in the HTML
   body like ``<img src="cid:my-content-id">``.

   4.2. You can use the ``contentDisposition`` option to disable the
   ``Content-Disposition`` header for an attachment. This is useful when
   sending ical invites to clients using outlook.

   4.3 Instead of the ``file`` option you can provide the file contents as
   a string using the ``data`` option. This allows you to attach files without
   needing file paths to them.

.. versionchanged:: 2.3
    The ``contentDisposition`` option was added.

.. versionchanged:: 2.4
    The ``data`` option was added.

Using transports
----------------

Transports are classes designed to send the e-mail over some protocol or method.
CakePHP supports the Mail (default), Debug and SMTP transports.

To configure your method, you must use the :php:meth:`CakeEmail::transport()`
method or have the transport in your configuration.

Creating custom Transports
~~~~~~~~~~~~~~~~~~~~~~~~~~

You are able to create your custom transports to integrate with others email
systems (like SwiftMailer). To create your transport, first create the file
``app/Lib/Network/Email/ExampleTransport.php`` (where Example is the name of your
transport). To start off your file should look like::

    App::uses('AbstractTransport', 'Network/Email');

    class ExampleTransport extends AbstractTransport {

        public function send(CakeEmail $Email) {
            // magic inside!
        }

    }

You must implement the method ``send(CakeEmail $Email)`` with your custom logic.
Optionally, you can implement the ``config($config)`` method. ``config()`` is
called before send() and allows you to accept user configurations. By default,
this method puts the configuration in protected attribute ``$_config``.

If you need to call additional methods on the transport before send, you can use
:php:meth:`CakeEmail::transportClass()` to get an instance of the transport.
Example::

    $yourInstance = $Email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $Email->send();

Relaxing address validation rules
---------------------------------

.. php:method:: emailPattern($pattern = null)

If you are having validation issues when sending to non-compliant addresses, you
can relax the pattern used to validate email addresses. This is sometimes
necessary when dealing with some Japanese ISP's::

    $email = new CakeEmail('default');

    // Relax the email pattern, so you can send
    // to non-conformant addresses.
    $email->emailPattern($newPattern);

.. versionadded:: 2.4


Sending messages quickly
========================

Sometimes you need a quick way to fire off an email, and you don't necessarily
want do setup a bunch of configuration ahead of time.
:php:meth:`CakeEmail::deliver()` is intended for that purpose.

You can create your configuration in ``EmailConfig``, or use an array with all
options that you need and use the static method ``CakeEmail::deliver()``.
Example::

    CakeEmail::deliver('you@example.com', 'Subject', 'Message', array('from' => 'me@example.com'));

This method will send an email to you@example.com, from me@example.com with
subject Subject and content Message.

The return of ``deliver()`` is a :php:class:`CakeEmail` instance with all
configurations set. If you do not want to send the email right away, and wish
to configure a few things before sending, you can pass the 5th parameter as
false.

The 3rd parameter is the content of message or an array with variables (when
using rendered content).

The 4th parameter can be an array with the configurations or a string with the
name of configuration in ``EmailConfig``.

If you want, you can pass the to, subject and message as null and do all
configurations in the 4th parameter (as array or using ``EmailConfig``).
Check the list of :ref:`configurations <email-configurations>` to see all accepted configs.


Sending emails from CLI
========================

.. versionchanged:: 2.2
    The ``domain()`` method was added in 2.2

When sending emails within a CLI script (Shells, Tasks, ...) you should manually
set the domain name for CakeEmail to use. It will serve as the host name for the
message id (since there is no host name in a CLI environment)::

    $Email->domain('www.example.org');
    // Results in message ids like ``<UUID@www.example.org>`` (valid)
    // instead of `<UUID@>`` (invalid)

A valid message id can help to prevent emails ending up in spam folders.

.. meta::
    :title lang=en: CakeEmail
    :keywords lang=en: sending mail,email sender,envelope sender,php class,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
