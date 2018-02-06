Email
#####

.. php:namespace:: Cake\Mailer

.. warning::
    Before version 3.1, the ``Email`` and ``Transport`` classes were under
    the ``Cake\Network\Email`` namespace instead of the ``Cake\Mailer``
    namespace.

.. php:class:: Email(mixed $profile = null)

``Email`` is a new class to send email. With this
class you can send email from any place inside of your application.

Basic Usage
===========

First of all, you should ensure the class is loaded::

    use Cake\Mailer\Email;

After you've loaded ``Email``, you can send an email with the following::

    $email = new Email('default');
    $email->from(['me@example.com' => 'My Site'])
        ->to('you@example.com')
        ->subject('About')
        ->send('My message');

Since ``Email``'s setter methods return the instance of the class, you are able to set its properties with method chaining.

``Email`` has several methods for defining recipients - ``to()``, ``cc()``,
``bcc()``, ``addTo()``, ``addCc()`` and ``addBcc()``. The main difference being
that the first three will overwrite what was already set and the latter will just
add more recipients to their respective field::

    $email = new Email();
    $email->to('to@example.com', 'To Example');
    $email->addTo('to2@example.com', 'To2 Example');
    // The email's To recipients are: to@example.com and to2@example.com
    $email->to('test@example.com', 'ToTest Example');
    // The email's To recipient is: test@example.com

.. deprecated:: 3.4.0
    Use ``setFrom()``, ``setTo()``, ``setCc()`` , ``setBcc()``  and ``setSubject()`` instead.

Choosing the Sender
-------------------

When sending email on behalf of other people, it's often a good idea to define the
original sender using the Sender header. You can do so using ``sender()``::

    $email = new Email();
    $email->sender('app@example.com', 'MyApp emailer');

.. note::

    It's also a good idea to set the envelope sender when sending mail on another
    person's behalf. This prevents them from getting any messages about
    deliverability.

.. deprecated:: 3.4.0
    Use ``setSender()`` instead.

.. _email-configuration:

Configuration
=============

Configuration for ``Email`` defaults is created using ``config()`` and
``configTransport()``. You should put your email presets in the
**config/app.php** file.  The **config/app.default.php** file is an
example of this file. It is not required to define email configuration in
**config/app.php**. ``Email`` can be used without it and use the respective
methods to set all configurations separately or load an array of configs.

By defining profiles and transports, you can keep your application code free of
configuration data, and avoid duplication that makes maintenance and deployment
more difficult.

To load a predefined configuration, you can use the ``profile()`` method or pass it
to the constructor of ``Email``::

    $email = new Email();
    $email->profile('default');

    // Or in constructor
    $email = new Email('default');

Instead of passing a string which matches a preset configuration name, you can
also just load an array of options::

    $email = new Email();
    $email->profile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // Or in constructor
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. versionchanged:: 3.1
    The ``default`` email profile is automatically set when an ``Email``
    instance is created.

.. deprecated:: 3.4.0
    Use ``setProfile()`` instead of ``profile()``.

Configuring Transports
----------------------

.. php:staticmethod:: configTransport($key, $config)

Email messages are delivered by transports. Different transports allow you to
send messages via PHP's ``mail()`` function, SMTP servers, or not at all which
is useful for debugging. Configuring transports allows you to keep configuration
data out of your application code and makes deployment simpler as you can simply
change the configuration data. An example transport configuration looks like::

    use Cake\Mailer\Email;

    // Sample Mail configuration
    Email::configTransport('default', [
        'className' => 'Mail'
    ]);

    // Sample SMTP configuration.
    Email::configTransport('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

You can configure SSL SMTP servers, like Gmail. To do so, put the ``ssl://``
prefix in the host and configure the port value accordingly. You can also
enable TLS SMTP using the ``tls`` option::

    use Cake\Mailer\Email;

    Email::configTransport('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

The above configuration would enable TLS communication for email messages.

.. warning::
    You will need to have access for less secure apps enabled in your Google
    account for this to work:
    `Allowing less secure apps to access your
    account <https://support.google.com/accounts/answer/6010255>`__.

.. note::
    `Gmail SMTP settings <https://support.google.com/a/answer/176600?hl=en>`__.

.. note::
    To use SSL + SMTP, you will need to have the SSL configured in your PHP
    install.

Configuration options can also be provided as a :term:`DSN` string. This is
useful when working with environment variables or :term:`PaaS` providers::

    Email::configTransport('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:587?tls=true',
    ]);

When using a DSN string you can define any additional parameters/options as
query string arguments.

.. deprecated:: 3.4.0
    Use ``setConfigTransport()`` instead of ``configTransport()``.

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
- ``'returnPath'``: Email address or an array of addresses to return if have
  some error. See ``Email::returnPath()``.
- ``'messageId'``: Message ID of e-mail. See ``Email::messageId()``.
- ``'subject'``: Subject of the message. See ``Email::subject()``.
- ``'message'``: Content of message. Do not set this field if you are using rendered content.
- ``'priority'``: Priority of the email as numeric value (usually from 1 to 5 with 1 being the highest).
- ``'headers'``: Headers to be included. See ``Email::headers()``.
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
  :php:meth:`~Cake\\Mailer\\Email::configTransport()`.
- ``'log'``: Log level to log the email headers and message. ``true`` will use
  LOG_DEBUG. See also :ref:`logging-levels`.
- ``'helpers'``: Array of helpers used in the email template. ``Email::helpers()``.

All these configurations are optional, except ``'from'``.

.. note::

    The values of above keys using Email or array, like from, to, cc, etc will be passed
    as first parameter of corresponding methods. The equivalent for:
    ``Email::from('my@example.com', 'My Site')``
    would be defined as  ``'from' => ['my@example.com' => 'My Site']`` in your config

Setting Headers
===============

In ``Email`` you are free to set whatever headers you want. When migrating
to use Email, do not forget to put the ``X-`` prefix in your headers.

See ``Email::headers()`` and ``Email::addHeaders()``

.. deprecated:: 3.4.0
    Use ``setHeaders()`` instead of ``headers()``.

Sending Templated Emails
========================

Emails are often much more than just a simple text message. In order
to facilitate that, CakePHP provides a way to send emails using CakePHP's
:doc:`view layer </views>`.

The templates for emails reside in a special folder in your application's
``Template`` directory called ``Email``. Email views can also use layouts
and elements just like normal views::

    $email = new Email();
    $email
        ->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

The above would use **src/Template/Email/html/welcome.ctp** for the view
and **src/Template/Layout/Email/html/fancy.ctp** for the layout. You can
send multipart templated email messages as well::

    $email = new Email();
    $email
        ->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

This would use the following template files:

* **src/Template/Email/text/welcome.ctp**
* **src/Template/Layout/Email/text/fancy.ctp**
* **src/Template/Email/html/welcome.ctp**
* **src/Template/Layout/Email/html/fancy.ctp**

When sending templated emails you have the option of sending either
``text``, ``html`` or ``both``.

You can set view variables with ``Email::viewVars()``::

    $email = new Email('templated');
    $email->viewVars(['value' => 12345]);

In your email templates you can use these with::

    <p>Here is your value: <b><?= $value ?></b></p>

You can use helpers in emails as well, much like you can in normal template files.
By default only the ``HtmlHelper`` is loaded. You can load additional
helpers using the ``helpers()`` method::

    $email->helpers(['Html', 'Custom', 'Text']);

When setting helpers be sure to include 'Html' or it will be removed from the
helpers loaded in your email template.

If you want to send email using templates in a plugin you can use the familiar
:term:`plugin syntax` to do so::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');

The above would use template and layout from the Blog plugin as an example.

In some cases, you might need to override the default template provided by plugins.
You can do this using themes by telling Email to use appropriate theme using
``Email::theme()`` method::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');
    $email->theme('TestTheme');

This allows you to override the ``new_comment`` template in your theme without
modifying the Blog plugin. The template file needs to be created in the
following path:
**src/Template/Plugin/TestTheme/Plugin/Blog/Email/text/new_comment.ctp**.

.. deprecated:: 3.4.0
    Use ``setTemplate()`` instead of ``template()``. Use ``setLayout()`` instead
    of the layout argument of ``template()``. Use ``setTheme()`` instead of
    ``theme()``.

Sending Attachments
===================

.. php:method:: attachments($attachments)

You can attach files to email messages as well. There are a few
different formats depending on what kind of files you have, and how
you want the filenames to appear in the recipient's mail client:

1. String: ``$email->attachments('/full/file/path/file.png')`` will attach this
   file with the name file.png.
2. Array: ``$email->attachments(['/full/file/path/file.png'])`` will have
   the same behavior as using a string.
3. Array with key:
   ``$email->attachments(['photo.png' => '/full/some_hash.png'])`` will
   attach some_hash.png with the name photo.png. The recipient will see
   photo.png, not some_hash.png.
4. Nested arrays::

    $email->attachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

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

.. deprecated:: 3.4.0
    Use ``setAttachments()`` instead of ``attachments()``.

Using Transports
================

Transports are classes designed to send the e-mail over some protocol or method.
CakePHP supports the Mail (default), Debug and SMTP transports.

To configure your method, you must use the :php:meth:`Cake\\Mailer\\Email::transport()`
method or have the transport in your configuration::

    $email = new Email();

    // Use a named transport already configured using Email::configTransport()
    $email->transport('gmail');

    // Use a constructed object.
    $transport = new DebugTransport();
    $email->transport($transport);

.. deprecated:: 3.4.0
    Use ``setTransport()`` instead of ``transport()``.

Creating Custom Transports
--------------------------

You are able to create your custom transports to integrate with others email
systems (like SwiftMailer). To create your transport, first create the file
**src/Mailer/Transport/ExampleTransport.php** (where Example is the name of your
transport). To start off your file should look like::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Email;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Email $email)
        {
            // Do something.
        }
    }

You must implement the method ``send(Email $email)`` with your custom logic.
Optionally, you can implement the ``config($config)`` method. ``config()`` is
called before send() and allows you to accept user configurations. By default,
this method puts the configuration in protected attribute ``$_config``.

If you need to call additional methods on the transport before send, you can use
:php:meth:`Cake\\Mailer\\Email::getTransport()` to get an instance of the transport object.
Example::

    $yourInstance = $email->getTransport()->transportClass();
    $yourInstance->myCustomMethod();
    $email->send();

Relaxing Address Validation Rules
---------------------------------

.. php:method:: emailPattern($pattern)

If you are having validation issues when sending to non-compliant addresses, you
can relax the pattern used to validate email addresses. This is sometimes
necessary when dealing with some Japanese ISP's::

    $email = new Email('default');

    // Relax the email pattern, so you can send
    // to non-conformant addresses.
    $email->emailPattern($newPattern);

.. deprecated:: 3.4.0
    Use ``setEmailPattern()`` instead of ``emailPattern()``.

Sending Messages Quickly
========================

Sometimes you need a quick way to fire off an email, and you don't necessarily
want do setup a bunch of configuration ahead of time.
:php:meth:`Cake\\Mailer\\Email::deliver()` is intended for that purpose.

You can create your configuration using
:php:meth:`Cake\\Mailer\\Email::config()`, or use an array with all
options that you need and use the static method ``Email::deliver()``.
Example::

    Email::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);

This method will send an email to "you@example.com", from "me@example.com" with
subject "Subject" and content "Message".

The return of ``deliver()`` is a :php:class:`Cake\\Mailer\\Email` instance with all
configurations set. If you do not want to send the email right away, and wish
to configure a few things before sending, you can pass the 5th parameter as
``false``.

The 3rd parameter is the content of message or an array with variables (when
using rendered content).

The 4th parameter can be an array with the configurations or a string with the
name of configuration in ``Configure``.

If you want, you can pass the to, subject and message as null and do all
configurations in the 4th parameter (as array or using ``Configure``).
Check the list of :ref:`configurations <email-configurations>` to see all accepted configs.

Sending Emails from CLI
=======================

When sending emails within a CLI script (Shells, Tasks, ...) you should manually
set the domain name for Email to use. It will serve as the host name for the
message id (since there is no host name in a CLI environment)::

    $email->domain('www.example.org');
    // Results in message ids like ``<UUID@www.example.org>`` (valid)
    // Instead of `<UUID@>`` (invalid)

A valid message id can help to prevent emails ending up in spam folders.

.. deprecated:: 3.4.0
    Use ``setDomain()`` instead of ``domain()``.

Creating Reusable Emails
========================

.. versionadded:: 3.1.0

Mailers allow you to create reusable emails throughout your application. They
can also be used to contain multiple email configurations in one location. This
helps keep your code DRYer and keeps email configuration noise out of other
areas in your application.

In this example we will be creating a ``Mailer`` that contains user-related
emails. To create our ``UserMailer``, create the file
**src/Mailer/UserMailer.php**. The contents of the file should look like the
following::

    namespace App\Mailer;

    use Cake\Mailer\Mailer;

    class UserMailer extends Mailer
    {
        public function welcome($user)
        {
            $this
                ->to($user->email)
                ->subject(sprintf('Welcome %s', $user->name))
                ->template('welcome_mail', 'custom'); // By default template with same name as method name is used.
        }

        public function resetPassword($user)
        {
            $this
                ->to($user->email)
                ->subject('Reset password')
                ->set(['token' => $user->token]);
        }
    }

In our example we have created two methods, one for sending a welcome email, and
another for sending a password reset email. Each of these methods expect a user
``Entity`` and utilizes its properties for configuring each email.

We are now able to use our ``UserMailer`` to send out our user-related emails
from anywhere in our application. For example, if we wanted to send our welcome
email we could do the following::

    namespace App\Controller;

    use Cake\Mailer\MailerAwareTrait;

    class UsersController extends AppController
    {
        use MailerAwareTrait;

        public function register()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData())
                if ($this->Users->save($user)) {
                    $this->getMailer('User')->send('welcome', [$user]);
                }
            }
            $this->set('user', $user);
        }
    }

If we wanted to completely separate sending a user their welcome email from our
application's code, we can have our ``UserMailer`` subscribe to the
``Model.afterSave`` event. By subscribing to an event, we can keep our
application's user-related classes completely free of email-related logic and
instructions. For example, we could add the following to our ``UserMailer``::

    public function implementedEvents()
    {
        return [
            'Model.afterSave' => 'onRegistration'
        ];
    }

    public function onRegistration(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }

The mailer object could now be registered as an event listener, and the
``onRegistration()`` method would be invoked every time the ``Model.afterSave``
event would be fired. For information on how to register event listener objects,
please refer to the :ref:`registering-event-listeners` documentation.

.. meta::
    :title lang=en: Email
    :keywords lang=en: sending mail,email sender,envelope sender,php class,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
