Email
#####

.. php:namespace:: Cake\Network\Email

.. php:class:: Email(mixed $profile = null)

``Email`` is a new class to send email. With this
class you can send email from any place of your application. In addition to
using the EmailComponent from your controller, you can also send mail from
Shells and Models.

This class replaces the :php:class:`EmailComponent` and gives more flexibility
in sending emails. For example, you can create your own transports to send
email instead of using the provided SMTP and Mail transports.

Basic Usage
===========

First of all, you should ensure the class is loaded::

    use Cake\Network\Email\Email;

Using Email is similar to using :php:class:`EmailComponent`. But instead of
using attributes you must use methods. Example::

    $email = new Email();
    $email->from(array('me@example.com' => 'My Site'));
    $email->to('you@example.com');
    $email->subject('About');
    $email->send('My message');

To simplify things, all of the setter methods return the instance of class.
You can re-write the above code as::

    $email = new Email();
    $email->from(array('me@example.com' => 'My Site'))
        ->to('you@example.com')
        ->subject('About')
        ->send('My message');

Choosing the Sender
-------------------

When sending email on behalf of other people it's often a good idea to define the
original sender using the Sender header. You can do so using ``sender()``::

    $email = new Email();
    $email->sender('app@example.com', 'MyApp emailer');

.. note::

    It's also a good idea to set the envelope sender when sending mail on another
    person's behalf. This prevents them from getting any messages about
    deliverability.

.. _email-configuration:

Configuration
=============

Configuration for Email defaults is created using ``config()`` and
``configTransport()``. You should put your email presets in the file
``App/Config/app.php``.  The ``App/Config/app.php.default`` has an example of
this file. It is not required to define email configuratin in
``App/Config/app.php``. ``Email`` can be used without it and use respective
methods to set all configurations separately or load an array of configs.

By defining profiles and transports you can keep your application code free of
configuration data, and avoid duplication that makes maintenance and deployment
less difficult.

To load a predefined configuration you can use the ``profile()`` method or pass it
to the constructor of ``Email``::

    $email = new Email();
    $email->profile('default');

    //or in constructor::
    $email = new Email('default');

Instead of passing a string which matches a preset configuration name you can
also just load an array of options::

    $email = new Email();
    $email->profile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    //or in constructor::
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

Configuring Transports
----------------------

.. php:staticmethod:: configTransport($key, $config = null)

Email messages are deliverd by transports. Different transports allow you to
send messages via PHP's ``mail()`` function, SMTP servers, or not at all which
is useful for debugging. Configuring transports allows you to keep configuration
data out of your application code and makes deployment simpler as you can simply
change the configuration data. An example transport configuration looks like::

    use Cake\Network\Email\Email;

    // Sample Mail configuration
    Email::configTransport('default', [
        'className' => 'Mail'
    ]);

    // Sample smtp configuration.
    Email::configTransport('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

You can configure SSL SMTP servers, like Gmail. To do so, put the ``'ssl://'``
at prefix in the host and configure the port value accordingly. You can also
enable TLS SMTP using the ``tls`` option::

    use Cake\Network\Email\Email;

    Email::configTransport('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

The above configuration would enable TLS communication for email messages.

.. note::

    To use SSL + SMTP, you will need to have the SSL configured in your PHP
    install.


.. php:staticmethod:: dropTransport($key)

Once configured, transports cannot be modified. In order to modify a transport
you must first drop it and then reconfigure it.

.. _email-configurations:

Configuration Profiles
----------------------

Defining delivery profiles allows you to consolidate common email settings into
re-usable profiles. Your application can have as many profiles as necessary. The
following configuration keys are used:

- ``'from'``: Email or array of sender. See ``Email::from()``.
- ``'sender'``: Email or array of real sender. See ``Email::sender()``.
- ``'to'``: Email or array of destination. See ``Email::to()``.
- ``'cc'``: Email or array of carbon copy. See ``Email::cc()``.
- ``'bcc'``: Email or array of blind carbon copy. See ``Email::bcc()``.
- ``'replyTo'``: Email or array to reply the e-mail. See ``Email::replyTo()``.
- ``'readReceipt'``: Email address or an array of addresses to receive the
  receipt of read. See ``Email::readReceipt()``.
- ``'returnPath'``: Email address or and array of addresses to return if have
  some error. See ``Email::returnPath()``.
- ``'messageId'``: Message ID of e-mail. See ``Email::messageId()``.
- ``'subject'``: Subject of the message. See ``Email::subject()``.
- ``'message'``: Content of message. Do not set this field if you are using rendered content.
- ``'headers'``: Headers to be included. See ``Email::setHeaders()``.
- ``'viewRender'``: If you are using rendered content, set the view classname.
  See ``Email::viewRender()``.
- ``'template'``: If you are using rendered content, set the template name. See
  ``Email::template()``.
- ``'theme'``: Theme used when rendering template. See ``Email::theme()``.
- ``'layout'``: If you are using rendered content, set the layout to render. If
  you want to render a template without layout, set this field to null. See
  ``Email::template()``.
- ``'viewVars'``: If you are using rendered content, set the array with
  variables to be used in the view. See ``Email::viewVars()``.
- ``'attachments'``: List of files to attach. See ``Email::attachments()``.
- ``'emailFormat'``: Format of email (html, text or both). See ``Email::emailFormat()``.
- ``'transport'``: Transport configuration name. See
  :php:meth:`~Cake\\Network\\Email\\Email::configTransport()`.
- ``'log'``: Log level to log the email headers and message. ``true`` will use
  LOG_DEBUG. See also ``CakeLog::write()``

All these configurations are optional, except ``'from'``.

.. note::

    The values of above keys using Email or array, like from, to, cc, etc will be passed
    as first parameter of corresponding methods. The equivalent for:
    ``Email::from('my@example.com', 'My Site')``
    would be defined as  ``'from' => array('my@example.com' => 'My Site')`` in your config

Setting Headers
===============

In ``Email`` you are free to set whatever headers you want. When migrating
to use Email, do not forget to put the ``X-`` prefix in your headers.

See ``Email::setHeaders()`` and ``Email::addHeaders()``

Sending Templated Emails
========================

Emails are often much more than just a simple text message. In order
to facilitate that, CakePHP provides a way to send emails using CakePHP's
:doc:`view layer </views>`.

The templates for emails reside in a special folder in your applications
``View`` directory called ``Emails``. Email views can also use layouts,
and elements just like normal views::

    $email = new Email();
    $email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

The above would use ``App/View/Email/html/welcome.ctp`` for the view,
and ``App/View/Layout/Email/html/fancy.ctp`` for the layout. You can
send multipart templated email messages as well::

    $email = new Email();
    $email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

This would use the following view files:

* ``App/View/Email/text/welcome.ctp``
* ``App/View/Layout/Email/text/fancy.ctp``
* ``App/View/Email/html/welcome.ctp``
* ``App/View/Layout/Email/html/fancy.ctp``

When sending templated emails you have the option of sending either
``text``, ``html`` or ``both``.

You can set view variables with ``Email::viewVars()``::

    $email = new Email('templated');
    $email->viewVars(array('value' => 12345));

In your email templates you can use these with::

    <p>Here is your value: <b><?= $value ?></b></p>

You can use helpers in emails as well, much like you can in normal view files.
By default only the :php:class:`HtmlHelper` is loaded. You can load additional
helpers using the ``helpers()`` method::

    $Email->helpers(array('Html', 'Custom', 'Text'));

When setting helpers be sure to include 'Html' or it will be removed from the
helpers loaded in your email template.

If you want to send email using templates in a plugin you can use the familiar
:term:`plugin syntax` to do so::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');

The above would use templates from the Blog plugin as an example.

In some cases, you might need to override the default template provided by plugins.
You can do this using themes by telling Email to use appropriate theme using
``Email::theme()`` method::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');
    $email->theme('TestTheme');

This allows you to override the `new_comment` template in your theme without modifying
the Blog plugin. The template file needs to be created in the following path:
``App/View/Themed/TestTheme/Blog/Email/text/new_comment.ctp``.

Sending Attachments
===================

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

Using Transports
================

Transports are classes designed to send the e-mail over some protocol or method.
CakePHP supports the Mail (default), Debug and SMTP transports.

To configure your method, you must use the :php:meth:`Cake\\Network\Email\\Email::transport()`
method or have the transport in your configuration::

    $email = new Email();

    // Use a named transport already configured using Email::configTransport()
    $email->transport('gmail');

    // Use a constructed object.
    $transport = new DebugTransport();
    $email->transport($transport);

Creating Custom Transports
--------------------------

You are able to create your custom transports to integrate with others email
systems (like SwiftMailer). To create your transport, first create the file
``App/Lib/Network/Email/ExampleTransport.php`` (where Example is the name of your
transport). To start off your file should look like::

    use Cake\Network\Email\AbstractTransport;

    class ExampleTransport extends AbstractTransport {

        public function send(Email $email) {
            // magic inside!
        }

    }

You must implement the method ``send(Email $email)`` with your custom logic.
Optionally, you can implement the ``config($config)`` method. ``config()`` is
called before send() and allows you to accept user configurations. By default,
this method puts the configuration in protected attribute ``$_config``.

If you need to call additional methods on the transport before send, you can use
:php:meth:`Cake\\Network\\Email\\Email::transportClass()` to get an instance of the transport.
Example::

    $yourInstance = $Email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $Email->send();

Relaxing Address Validation Rules
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


Sending Messages Quickly
========================

Sometimes you need a quick way to fire off an email, and you don't necessarily
want do setup a bunch of configuration ahead of time.
:php:meth:`Cake\\Network\Email\\Email::deliver()` is intended for that purpose.

You can create your configuration using
:php:meth:`Cake\\Network\\Email\\Email::config()`, or use an array with all
options that you need and use the static method ``Email::deliver()``.
Example::

    Email::deliver('you@example.com', 'Subject', 'Message', array('from' => 'me@example.com'));

This method will send an email to you@example.com, from me@example.com with
subject Subject and content Message.

The return of ``deliver()`` is a :php:class:`Cake\\Email\\Email` instance with all
configurations set. If you do not want to send the email right away, and wish
to configure a few things before sending, you can pass the 5th parameter as
false.

The 3rd parameter is the content of message or an array with variables (when
using rendered content).

The 4th parameter can be an array with the configurations or a string with the
name of configuration in ``Configure``.

If you want, you can pass the to, subject and message as null and do all
configurations in the 4th parameter (as array or using ``Configure``).
Check the list of :ref:`configurations <email-configurations>` to see all accepted configs.


Sending Emails from CLI
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
    :title lang=en: Email
    :keywords lang=en: sending mail,email sender,envelope sender,php class,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
