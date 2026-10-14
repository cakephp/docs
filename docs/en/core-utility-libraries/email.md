# CakeEmail

`class` **CakeEmail**(mixed $config = null)

`CakeEmail` is the class to send email. With this
class you can send email from any place in your application: controllers,
Shells, Models and so on. You can also create your own transports to send
email instead of using the provided SMTP and Mail transports.

## Basic usage

You configure and send a message by calling methods on a `CakeEmail`
instance. Example:

``` php
$Email = new CakeEmail();
$Email->from(['me@example.com' => 'My Site']);
$Email->to('you@example.com');
$Email->subject('About');
$Email->send('My message');
```

To simplify things, all of the setter methods return the instance of class.
You can re-write the above code as:

``` php
$Email = new CakeEmail();
$Email->from(['me@example.com' => 'My Site'])
    ->to('you@example.com')
    ->subject('About')
    ->send('My message');
```

### Choosing the sender

When sending email on behalf of other people it's often a good idea to define the
original sender using the Sender header. You can do so using `sender()`:

``` php
$Email = new CakeEmail();
$Email->sender('app@example.com', 'MyApp emailer');
```

> [!NOTE]
> It's also a good idea to set the envelope sender when sending mail on another
> person's behalf. This prevents them from getting any messages about
> deliverability.

## Configuration

Similar to database configuration, email configuration can be centralized in a class.

Create the file `config/email.php` (`app/Config/email.php` in the legacy
layout) with the class `EmailConfig`. The `config/email.php.default` file of
the application skeleton has an example of this file.

`CakeEmail` will create an instance of the `EmailConfig` class to access the
config. If you have dynamic data to put in the configs, you can use the
constructor to do that:

``` php
class EmailConfig
{
    public function __construct()
    {
        // Do conditional assignments here.
    }
}
```

It is not required to create `config/email.php`, `CakeEmail` can be used
without it and use respective methods to set all configurations separately or
load an array of configs.

To load a config from `EmailConfig` you can use the `config()` method or pass it
to the constructor of `CakeEmail`:

``` php
$Email = new CakeEmail();
$Email->config('default');

// or in constructor:
$Email = new CakeEmail('default');

// Implicit 'default' config used as of 2.7
$Email = new CakeEmail();
```

Instead of passing a string which matches the configuration name in `EmailConfig`
you can also just load an array of configs:

``` php
$Email = new CakeEmail();
$Email->config(['from' => 'me@example.org', 'transport' => 'MyCustom']);

// or in constructor:
$Email = new CakeEmail(['from' => 'me@example.org', 'transport' => 'MyCustom']);
```

> [!NOTE]
> Use `$Email->config()` or the constructor to set the log level to log email headers and message.
> Using `$Email->config(['log' => true]);` will use LOG_DEBUG. See also `CakeLog::write()`

You can configure SSL SMTP servers. To do so, prefix the host with
`'ssl://'` and configure the port value accordingly. Example:

``` php
class EmailConfig
{
    public $gmail = [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'transport' => 'Smtp',
    ];
}
```

You can also use `tls://` to prefer TLS for connection level encryption.

> [!NOTE]
> Gmail does not accept your regular account password from SMTP clients. Use an
> app password generated in your Google account instead.

> [!NOTE]
> To use either the ssl:// or tls:// feature, you will need the `openssl`
> extension.

You can also enable the STARTTLS SMTP extension using the `tls` option. STARTTLS
is usually offered on port 587:

``` php
class EmailConfig
{
    public $gmail = [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'transport' => 'Smtp',
        'tls' => true,
    ];
}
```

The above configuration would enable STARTTLS communication for email messages.

::: info Added in version 2.3
Support for TLS delivery was added in 2.3
:::

<a id="email-configurations"></a>

### Configurations

The following configuration keys are used:

- `'from'`: Email or array of sender. See `CakeEmail::from()`.
- `'sender'`: Email or array of real sender. See `CakeEmail::sender()`.
- `'to'`: Email or array of destination. See `CakeEmail::to()`.
- `'cc'`: Email or array of carbon copy. See `CakeEmail::cc()`.
- `'bcc'`: Email or array of blind carbon copy. See `CakeEmail::bcc()`.
- `'replyTo'`: Email or array to reply the e-mail. See `CakeEmail::replyTo()`.
- `'readReceipt'`: Email address or an array of addresses to receive the
  receipt of read. See `CakeEmail::readReceipt()`.
- `'returnPath'`: Email address or and array of addresses to return if have
  some error. See `CakeEmail::returnPath()`.
- `'messageId'`: Message ID of e-mail. See `CakeEmail::messageId()`.
- `'subject'`: Subject of the message. See `CakeEmail::subject()`.
- `'message'`: Content of message. Do not set this field if you are using rendered content.
- `'headers'`: Headers to be included. See `CakeEmail::setHeaders()`.
- `'viewRender'`: If you are using rendered content, set the view class name.
  See `CakeEmail::viewRender()`.
- `'template'`: If you are using rendered content, set the template name. See
  `CakeEmail::template()`.
- `'theme'`: Theme used when rendering template. See `CakeEmail::theme()`.
- `'layout'`: If you are using rendered content, set the layout to render. If
  you want to render a template without layout, set this field to null. See
  `CakeEmail::template()`.
- `'viewVars'`: If you are using rendered content, set the array with
  variables to be used in the view. See `CakeEmail::viewVars()`.
- `'attachments'`: List of files to attach. See `CakeEmail::attachments()`.
- `'emailFormat'`: Format of email (html, text or both). See `CakeEmail::emailFormat()`.
- `'transport'`: Transport name. See `CakeEmail::transport()`.
- `'helpers'`: Array of helpers used in the email template.

All of these configurations are optional, except `'from'`. If you put more
configurations in this array, the configurations will be used in the
`CakeEmail::config()` method and passed to the transport class `config()`.
For example, if you are using the SMTP transport, you should pass the host, port and
other configurations.

> [!NOTE]
> The values of above keys using Email or array, like from, to, cc, etc will be passed
> as first parameter of corresponding methods. The equivalent for:
> `CakeEmail::from('my@example.com', 'My Site')`
> would be defined as `'from' => ['my@example.com' => 'My Site']` in your config.

### Setting headers

In `CakeEmail` you are free to set whatever headers you want. `CakeEmail`
does not add an `X-` prefix to custom headers for you, so include it in the
header names yourself where needed.

See `CakeEmail::setHeaders()` and `CakeEmail::addHeaders()`

### Sending templated emails

Emails are often much more than just a simple text message. In order
to facilitate that, CakePHP provides a way to send emails using CakePHP's
[view layer](../views).

The templates for emails reside in a special folder in your application's
`templates` directory called `Emails`. Email views can also use layouts,
and elements just like normal views:

``` php
$Email = new CakeEmail();
$Email->template('welcome', 'fancy')
    ->emailFormat('html')
    ->to('bob@example.com')
    ->from('app@domain.com')
    ->send();
```

The above would use `templates/Emails/html/welcome.ctp` for the view,
and `templates/Layouts/Emails/html/fancy.ctp` for the layout (in the legacy
layout these are under `app/View/` instead of `templates/`). You can
send multipart templated email messages as well:

``` php
$Email = new CakeEmail();
$Email->template('welcome', 'fancy')
    ->emailFormat('both')
    ->to('bob@example.com')
    ->from('app@domain.com')
    ->send();
```

This would use the following view files:

- `templates/Emails/text/welcome.ctp`
- `templates/Layouts/Emails/text/fancy.ctp`
- `templates/Emails/html/welcome.ctp`
- `templates/Layouts/Emails/html/fancy.ctp`

When sending templated emails you have the option of sending either
`text`, `html` or `both`.

You can set view variables with `CakeEmail::viewVars()`:

``` php
$Email = new CakeEmail('templated');
$Email->viewVars(['value' => 12345]);
```

In your email templates you can use these with:

``` html
<p>Here is your value: <b><?php echo $value; ?></b></p>
```

You can use helpers in emails as well, much like you can in normal view files.
By default only the `HtmlHelper` is loaded. You can load additional
helpers using the `helpers()` method:

``` php
$Email->helpers(['Html', 'Custom', 'Text']);
```

When setting helpers be sure to include 'Html' or it will be removed from the
helpers loaded in your email template.

If you want to send email using templates in a plugin you can use the familiar
`plugin syntax` to do so:

``` php
$Email = new CakeEmail();
$Email->template('Blog.new_comment', 'Blog.auto_message');
```

The above would use templates from the Blog plugin as an example.

In some cases, you might need to override the default template provided by plugins.
You can do this using themes by telling CakeEmail to use appropriate theme using
`CakeEmail::theme()` method:

``` php
$Email = new CakeEmail();
$Email->template('Blog.new_comment', 'Blog.auto_message');
$Email->theme('TestTheme');
```

This allows you to override the `new_comment` template in your theme without modifying
the Blog plugin. The template file needs to be created in the following path:
`templates/Themed/TestTheme/Blog/Emails/text/new_comment.ctp`.

### Sending attachments

`method` CakeEmail::**attachments**($attachments = null)

You can attach files to email messages as well. There are a few
different formats depending on what kind of files you have, and how
you want the filenames to appear in the recipient's mail client:

1.  String: `$Email->attachments('/full/file/path/file.png')` will attach this
    file with the name file.png.

2.  Array: `$Email->attachments(['/full/file/path/file.png'])` will have
    the same behavior as using a string.

3.  Array with key:
    `$Email->attachments(['photo.png' => '/full/some_hash.png'])` will
    attach some_hash.png with the name photo.png. The recipient will see
    photo.png, not some_hash.png.

4.  Nested arrays:

    ``` php
    $Email->attachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id',
        ],
    ]);
    ```

    The above will attach the file with different mimetype and with custom
    Content ID (when set the content ID the attachment is transformed to inline).
    The mimetype and contentId are optional in this form.

    4.1. When you are using the `contentId`, you can use the file in the HTML
    body like `<img src="cid:my-content-id">`.

    4.2. You can use the `contentDisposition` option to disable the
    `Content-Disposition` header for an attachment. This is useful when
    sending ical invites to clients using outlook.

    4.3 Instead of the `file` option you can provide the file contents as
    a string using the `data` option. This allows you to attach files without
    needing file paths to them.

::: info Changed in version 2.3
The `contentDisposition` option was added.
:::

::: info Changed in version 2.4
The `data` option was added.
:::

### Using transports

Transports are classes designed to send the e-mail over some protocol or method.
CakePHP supports the Mail (default), Debug and SMTP transports.

To configure your method, you must use the `CakeEmail::transport()`
method or have the transport in your configuration.

::: pieceofcake2
`MailTransport::_mail()` has a typed
signature,
`protected function _mail(string $to, string $subject, string $message, array|string $headers = [], string $params = ''): void`.
Update it if you extend `MailTransport` and override this method.
:::

#### Creating custom Transports

You are able to create your custom transports to integrate with others email
systems or email delivery services. To create your transport, first create the file
`src/Lib/Network/Email/ExampleTransport.php` (where Example is the name of your
transport). To start off your file should look like:

``` php
// src/Lib/Network/Email/ExampleTransport.php
class ExampleTransport extends AbstractTransport
{
    public function send(CakeEmail $Email)
    {
        // magic inside!
    }
}
```

You must implement the method `send(CakeEmail $Email)` with your custom logic.
Optionally, you can implement the `config($config)` method. `config()` is
called before send() and allows you to accept user configurations. By default,
this method puts the configuration in protected attribute `$_config`.

If you need to call additional methods on the transport before send, you can use
`CakeEmail::transportClass()` to get an instance of the transport.
Example:

``` php
$yourInstance = $Email->transport('your')->transportClass();
$yourInstance->myCustomMethod();
$Email->send();
```

### Relaxing address validation rules

`method` CakeEmail::**emailPattern**($pattern = null)

If you are having validation issues when sending to non-compliant addresses, you
can relax the pattern used to validate email addresses. This is sometimes
necessary when dealing with some Japanese ISP's:

``` php
$email = new CakeEmail('default');

// Relax the email pattern, so you can send
// to non-conformant addresses.
$email->emailPattern($newPattern);
```

::: info Added in version 2.4
:::

## Sending messages quickly

Sometimes you need a quick way to fire off an email, and you don't necessarily
want do setup a bunch of configuration ahead of time.
`CakeEmail::deliver()` is intended for that purpose.

You can create your configuration in `EmailConfig`, or use an array with all
options that you need and use the static method `CakeEmail::deliver()`.
Example:

``` php
CakeEmail::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);
```

This method will send an email to <you@example.com>, from <me@example.com> with
subject Subject and content Message.

The return of `deliver()` is a `CakeEmail` instance with all
configurations set. If you do not want to send the email right away, and wish
to configure a few things before sending, you can pass the 5th parameter as
false.

The 3rd parameter is the content of message or an array with variables (when
using rendered content).

The 4th parameter can be an array with the configurations or a string with the
name of configuration in `EmailConfig`.

If you want, you can pass the to, subject and message as null and do all
configurations in the 4th parameter (as array or using `EmailConfig`).
Check the list of [configurations](#email-configurations) to see all accepted configs.

## Sending emails from CLI

::: info Changed in version 2.2
The `domain()` method was added in 2.2
:::

When sending emails within a CLI script (Shells, Tasks, ...) you should manually
set the domain name for CakeEmail to use. The domain name is used as the host
name for the message id (since there is no host name in a CLI environment):

``` php
$Email->domain('www.example.org');
// Results in message ids like `<UUID@www.example.org>` (valid)
// instead of `<UUID@>` (invalid)
```

A valid message id can help to prevent emails ending up in spam folders. If you
are generating links in your email bodies you will also need to set the
`App.fullBaseUrl` configure value.
