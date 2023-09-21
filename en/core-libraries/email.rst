Mailer
######

.. php:namespace:: Cake\Mailer

.. php:class:: Mailer(string|array|null $profile = null)

``Mailer`` is a convenience class for sending email. With this class you can send
email from any place inside of your application.

Basic Usage
===========

First of all, you should ensure the class is loaded::

    use Cake\Mailer\Mailer;

After you've loaded ``Mailer``, you can send an email with the following::

    $mailer = new Mailer('default');
    $mailer->setFrom(['me@example.com' => 'My Site'])
        ->setTo('you@example.com')
        ->setSubject('About')
        ->deliver('My message');

Since ``Mailer``'s setter methods return the instance of the class, you are able
to set its properties with method chaining.

``Mailer`` has several methods for defining recipients - ``setTo()``, ``setCc()``,
``setBcc()``, ``addTo()``, ``addCc()`` and ``addBcc()``. The main difference being
that the first three will overwrite what was already set and the latter will just
add more recipients to their respective field::

    $mailer = new Mailer();
    $mailer->setTo('to@example.com', 'To Example');
    $mailer->addTo('to2@example.com', 'To2 Example');
    // The email's To recipients are: to@example.com and to2@example.com
    $mailer->setTo('test@example.com', 'ToTest Example');
    // The email's To recipient is: test@example.com

Choosing the Sender
-------------------

When sending email on behalf of other people, it's often a good idea to define the
original sender using the Sender header. You can do so using ``setSender()``::

    $mailer = new Mailer();
    $mailer->setSender('app@example.com', 'MyApp emailer');

.. note::

    It's also a good idea to set the envelope sender when sending mail on another
    person's behalf. This prevents them from getting any messages about
    deliverability.

.. _email-configuration:

Configuration
=============

Mailer profiles and email transport settings are defined in your application's
configuration files. The ``Email`` and ``EmailTransport`` keys define mailer
profiles and email transport configurations respectively. During application
bootstrap configuration settings are passed from ``Configure`` into the
``Mailer`` and ``TransportFactory`` classes using ``setConfig()``. By defining
profiles and transports, you can keep your application code free of
configuration data, and avoid duplication that makes maintenance and deployment
more difficult.

To load a predefined configuration, you can use the ``setProfile()`` method or
pass it to the constructor of ``Mailer``::

    $mailer = new Mailer();
    $mailer->setProfile('default');

    // Or in constructor
    $mailer = new Mailer('default');

Instead of passing a string which matches a preset configuration name, you can
also just load an array of options::

    $mailer = new Mailer();
    $mailer->setProfile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // Or in constructor
    $mailer = new Mailer(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. _email-configurations:

Configuration Profiles
----------------------

Defining delivery profiles allows you to consolidate common email settings into
re-usable profiles. Your application can have as many profiles as necessary. The
following configuration keys are used:

- ``'from'``: Mailer or array of sender. See ``Mailer::setFrom()``.
- ``'sender'``: Mailer or array of real sender. See ``Mailer::setSender()``.
- ``'to'``: Mailer or array of destination. See ``Mailer::setTo()``.
- ``'cc'``: Mailer or array of carbon copy. See ``Mailer::setCc()``.
- ``'bcc'``: Mailer or array of blind carbon copy. See ``Mailer::setBcc()``.
- ``'replyTo'``: Mailer or array to reply the e-mail. See ``Mailer::setReplyTo()``.
- ``'readReceipt'``: Mailer address or an array of addresses to receive the
  receipt of read. See ``Mailer::setReadReceipt()``.
- ``'returnPath'``: Mailer address or an array of addresses to return if have
  some error. See ``Mailer::setReturnPath()``.
- ``'messageId'``: Message ID of e-mail. See ``Mailer::setMessageId()``.
- ``'subject'``: Subject of the message. See ``Mailer::setSubject()``.
- ``'message'``: Content of message. Do not set this field if you are using rendered content.
- ``'priority'``: Priority of the email as numeric value (usually from 1 to 5 with 1 being the highest).
- ``'headers'``: Headers to be included. See ``Mailer::setHeaders()``.
- ``'viewRenderer'``: If you are using rendered content, set the view classname.
  See ``ViewBuilder::setClassName()``.
- ``'template'``: If you are using rendered content, set the template name. See
  ``ViewBuilder::setTemplate()``.
- ``'theme'``: Theme used when rendering template. See ``ViewBuilder::setTheme()``.
- ``'layout'``: If you are using rendered content, set the layout to render. See
  ``ViewBuilder::setTemplate()``.
- ``'autoLayout'``: If you want to render a template without layout, set this field to
  ``false``. See ``ViewBuilder::disableAutoLayout()``.
- ``'viewVars'``: If you are using rendered content, set the array with
  variables to be used in the view. See ``Mailer::setViewVars()``.
- ``'attachments'``: List of files to attach. See ``Mailer::setAttachments()``.
- ``'emailFormat'``: Format of email (html, text or both). See ``Mailer::setEmailFormat()``.
- ``'transport'``: Transport configuration name. See :ref:`email-transport`.
- ``'log'``: Log level to log the email headers and message. ``true`` will use
  LOG_DEBUG. See :ref:`logging-levels`. Note that logs will be emitted under the scope named ``email``.
  See also :ref:`logging-scopes`.
- ``'helpers'``: Array of helpers used in the email template.
  ``ViewBuilder::setHelpers()``/``ViewBuilder::addHelpers()``.

.. note::

    The values of above keys using Mailer or array, like from, to, cc, etc will be passed
    as first parameter of corresponding methods. The equivalent for:
    ``$mailer->setFrom('my@example.com', 'My Site')``
    would be defined as  ``'from' => ['my@example.com' => 'My Site']`` in your config

Setting Headers
===============

In ``Mailer`` you are free to set whatever headers you want. Do not forget to
put the ``X-`` prefix for your custom headers.

See ``Mailer::setHeaders()`` and ``Mailer::addHeaders()``

Sending Templated Emails
==========================

Emails are often much more than just a simple text message. In order
to facilitate that, CakePHP provides a way to send emails using CakePHP's
:doc:`view layer </views>`.

The templates for emails reside in a special folder ``templates/email`` of your
application. Mailer views can also use layouts and elements just like normal views::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('html')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('welcome')
                    ->setLayout('fancy');

    $mailer->deliver();

The above would use **templates/email/html/welcome.php** for the view
and **templates/layout/email/html/fancy.php** for the layout. You can
send multipart templated email messages as well::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('both')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('welcome')
                    ->setLayout('fancy');

    $mailer->deliver();

This would use the following template files:

* **templates/email/text/welcome.php**
* **templates/layout/email/text/fancy.php**
* **templates/email/html/welcome.php**
* **templates/layout/email/html/fancy.php**

When sending templated emails you have the option of sending either
``text``, ``html`` or ``both``.

You can set all view related config using the view builder instance got by
``Mailer::viewBuilder()`` similar to how you do the same in controller.

You can set view variables with ``Mailer::setViewVars()``::

    $mailer = new Mailer('templated');
    $mailer->setViewVars(['value' => 12345]);

Or you can use the view builder methods ``ViewBuilder::setVar()`` and
``ViewBuilder::setVars()``.

In your email templates you can use these with::

    <p>Here is your value: <b><?= $value ?></b></p>

You can use helpers in emails as well, much like you can in normal template files.
By default only the ``HtmlHelper`` is loaded. You can load additional
helpers using the ``ViewBuilder::addHelpers()`` method::

    $mailer->viewBuilder()->addHelpers(['Html', 'Custom', 'Text']);

When adding helpers be sure to include 'Html' or it will be removed from the
helpers loaded in your email template.

.. note::
    In versions prior to 4.3.0, you will need to use ``setHelpers()`` instead.

If you want to send email using templates in a plugin you can use the familiar
:term:`plugin syntax` to do so::

    $mailer = new Mailer();
    $mailer->viewBuilder()->setTemplate('Blog.new_comment');

The above would use template and layout from the Blog plugin as an example.

In some cases, you might need to override the default template provided by plugins.
You can do this using themes::

    $mailer->viewBuilder()
        ->setTemplate('Blog.new_comment')
        ->setLayout('Blog.auto_message')
        ->setTheme('TestTheme');

This allows you to override the ``new_comment`` template in your theme without
modifying the Blog plugin. The template file needs to be created in the
following path:
**templates/plugin/TestTheme/plugin/Blog/email/text/new_comment.php**.

Sending Attachments
===================

.. php:method:: setAttachments($attachments)

You can attach files to email messages as well. There are a few
different formats depending on what kind of files you have, and how
you want the filenames to appear in the recipient's mail client:

1. Array: ``$mailer->setAttachments(['/full/file/path/file.png'])`` will
   attach this file with the name file.png..
2. Array with key:
   ``$mailer->setAttachments(['photo.png' => '/full/some_hash.png'])`` will
   attach some_hash.png with the name photo.png. The recipient will see
   photo.png, not some_hash.png.
3. Nested arrays::

    $mailer->setAttachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

   The above will attach the file with different mimetype and with custom
   Content ID (when set the content ID the attachment is transformed to inline).
   The mimetype and contentId are optional in this form.

   3.1. When you are using the ``contentId``, you can use the file in the HTML
   body like ``<img src="cid:my-content-id">``.

   3.2. You can use the ``contentDisposition`` option to disable the
   ``Content-Disposition`` header for an attachment. This is useful when
   sending ical invites to clients using outlook.

   3.3 Instead of the ``file`` option you can provide the file contents as
   a string using the ``data`` option. This allows you to attach files without
   needing file paths to them.

Relaxing Address Validation Rules
---------------------------------

.. php:method:: setEmailPattern($pattern)

If you are having validation issues when sending to non-compliant addresses, you
can relax the pattern used to validate email addresses. This is sometimes
necessary when dealing with some ISPs::

    $mailer = new Mailer('default');

    // Relax the email pattern, so you can send
    // to non-conformant addresses.
    $mailer->setEmailPattern($newPattern);

Sending Messages Quickly
========================

Sometimes you need a quick way to fire off an email, and you don't necessarily
want to setup a bunch of configuration ahead of time.
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
========================

When sending emails within a CLI script (Shells, Tasks, ...) you should manually
set the domain name for Mailer to use. It will serve as the host name for the
message id (since there is no host name in a CLI environment)::

    $mailer->setDomain('www.example.org');
    // Results in message ids like ``<UUID@www.example.org>`` (valid)
    // Instead of `<UUID@>`` (invalid)

A valid message id can help to prevent emails ending up in spam folders.

Creating Reusable Emails
=========================

Until now we have seen how to directly use the the ``Mailer`` class to create and
send one emails. But main feature of mailer is to allow creating reusable emails
throughout your application. They can also be used to contain multiple email
configurations in one location. This helps keep your code DRYer and keeps email
configuration noise out of other areas in your application.

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
                ->setTo($user->email)
                ->setSubject(sprintf('Welcome %s', $user->name))
                ->viewBuilder()
                    ->setTemplate('welcome_mail'); // By default template with same name as method name is used.
        }

        public function resetPassword($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject('Reset password')
                ->setViewVars(['token' => $user->token]);
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
            $user = $this->Users->newEmptyEntity();
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

    public function onRegistration(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }

You can now register the mailer as an event listener and the
``onRegistration()`` method will be invoked every time the ``Model.afterSave``
event is fired::

    // attach to Users event manager
    $this->Users->getEventManager()->on($this->getMailer('User'));

.. note::

    For information on how to register event listener objects,
    please refer to the :ref:`registering-event-listeners` documentation.

.. _email-transport:

Configuring Transports
======================

Email messages are delivered by transports. Different transports allow you to
send messages via PHP's ``mail()`` function, SMTP servers, or not at all which
is useful for debugging. Configuring transports allows you to keep configuration
data out of your application code and makes deployment simpler as you can simply
change the configuration data. An example transport configuration looks like::

    // In config/app.php
    'EmailTransport' => [
        // Sample Mail configuration
        'default' => [
            'className' => 'Mail',
        ],
        // Sample SMTP configuration
        'gmail' => [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'className' => 'Smtp',
            'tls' => true
        ]
    ],

Transports can also be configured at runtime using
``TransportFactory::setConfig()``::

    use Cake\Mailer\TransportFactory;

    // Define an SMTP transport
    TransportFactory::setConfig('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

You can configure SSL SMTP servers, like Gmail. To do so, put the ``ssl://``
prefix in the host and configure the port value accordingly. You can also
enable TLS SMTP using the ``tls`` option::

    use Cake\Mailer\TransportFactory;

    TransportFactory::setConfig('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

The above configuration would enable TLS communication for email messages.

To configure your mailer to use a specific transport you can use
:php:meth:`Cake\\Mailer\\Mailer::setTransport()` method or have the transport
in your configuration::

    // Use a named transport already configured using TransportFactory::setConfig()
    $mailer->setTransport('gmail');

    // Use a constructed object.
    $mailer->setTransport(new \Cake\Mailer\Transport\DebugTransport());

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

    TransportFactory::setConfig('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:587?tls=true',
    ]);

When using a DSN string you can define any additional parameters/options as
query string arguments.

.. php:staticmethod:: drop($key)

Once configured, transports cannot be modified. In order to modify a transport
you must first drop it and then reconfigure it.

Creating Custom Transports
--------------------------

You are able to create your custom transports for situations such as send email using services
like SendGrid, MailGun or Postmark. To create your transport, first create the file
**src/Mailer/Transport/ExampleTransport.php** (where Example is the name of your
transport). To start, your file should look like::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Message;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Message $message): array
        {
            // Do something.
        }
    }

You must implement the method ``send(Message $message)`` with your custom logic.

Sending emails without using Mailer
===================================

The ``Mailer`` is a higher level abstraction class which acts as a bridge between
the ``Cake\Mailer\Message``, ``Cake\Mailer\Renderer`` and ``Cake\Mailer\AbstractTransport``
classes to configure emails with a fluent interface.

If you want you can use these classes directly with the ``Mailer`` too.

For example::

    $render = new \Cake\Mailer\Renderer();
    $render->viewBuilder()
        ->setTemplate('custom')
        ->setLayout('sparkly');

    $message = new \Cake\Mailer\Message();
    $message
        ->setFrom('admin@cakephp.org')
        ->setTo('user@foo.com')
        ->setBody($render->render());

    $transport = new \Cake\Mailer\Transport\MailTransport();
    $result = $transport->send($message);

You can even skip using the ``Renderer`` and set the message body directly
using ``Message::setBodyText()`` and ``Message::setBodyHtml()`` methods.

.. _email-testing:

Testing Mailers
===============

To test mailers, add ``Cake\TestSuite\EmailTrait`` to your test case.
The ``MailerTrait`` uses PHPUnit hooks to replace your application's email transports
with a proxy that intercepts email messages and allows you to do assertions
on the mail that would be delivered.

Add the trait to your test case to start testing emails, and load routes if your
emails need to generate URLs::

    namespace App\Test\TestCase\Mailer;

    use App\Mailer\WelcomeMailer;
    use App\Model\Entity\User;

    use Cake\TestSuite\EmailTrait;
    use Cake\TestSuite\TestCase;

    class WelcomeMailerTestCase extends TestCase
    {
        use EmailTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->loadRoutes();
        }
    }

Let's assume we have a mailer that delivers welcome emails when a new user
registers. We want to check that the subject and body contain the user's name::

    // in our WelcomeMailerTestCase class.
    public function testName()
    {
        $user = new User([
            'name' => 'Alice Alittea',
            'email' => 'alice@example.org',
        ]);
        $mailer = new WelcomeMailer();
        $mailer->send('welcome', [$user]);

        $this->assertMailSentTo($user->email);
        $this->assertMailContainsText('Hi ' . $user->name);
        $this->assertMailContainsText('Welcome to CakePHP!');
    }

Assertion methods
-----------------

The ``Cake\TestSuite\EmailTrait`` trait provides the following assertions::

    // Asserts an expected number of emails were sent
    $this->assertMailCount($count);

    // Asserts that no emails were sent
    $this->assertNoMailSent();

    // Asserts an email was sent to an address
    $this->assertMailSentTo($address);

    // Asserts an email was sent from an address
    $this->assertMailSentFrom($emailAddress);
    $this->assertMailSentFrom([$emailAddress => $displayName]);

    // Asserts an email contains expected contents
    $this->assertMailContains($contents);

    // Asserts an email contains expected html contents
    $this->assertMailContainsHtml($contents);

    // Asserts an email contains expected text contents
    $this->assertMailContainsText($contents);

    // Asserts an email contains the expected value within an Message getter (for example, "subject")
    $this->assertMailSentWith($expected, $parameter);

    // Asserts an email at a specific index was sent to an address
    $this->assertMailSentToAt($at, $address);

    // Asserts an email at a specific index was sent from an address
    $this->assertMailSentFromAt($at, $address);

    // Asserts an email at a specific index contains expected contents
    $this->assertMailContainsAt($at, $contents);

    // Asserts an email at a specific index contains expected html contents
    $this->assertMailContainsHtmlAt($at, $contents);

    // Asserts an email at a specific index contains expected text contents
    $this->assertMailContainsTextAt($at, $contents);

    // Asserts an email contains an attachment
    $this->assertMailContainsAttachment('test.png');

    // Asserts an email at a specific index contains the expected value within an Message getter (for example, "cc")
    $this->assertMailSentWithAt($at, $expected, $parameter);

    // Asserts an email contains a substring in the subject.
    $this->assertMailSubjectContains('Free Offer');

    // Asserts an email at the specific index contains a substring in the subject.
    $this->assertMailSubjectContainsAt(1, 'Free Offer');

.. meta::
    :title lang=en: Email
    :keywords lang=en: sending mail,email sender,envelope sender,php class,database configuration,sending emails,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
