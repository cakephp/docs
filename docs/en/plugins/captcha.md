# Captcha

The [pieceofcake2/captcha](https://github.com/pieceofcake2/captcha) plugin
protects forms from bots with a CAPTCHA. Its `CaptchaHelper` renders the widget
of a CAPTCHA provider in your form, and its `CaptchaComponent` sends the token
that the widget adds to the form to the provider and checks the answer before
your action runs.

The plugin supports these providers:

| Provider | `provider` setting |
| --- | --- |
| [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | `turnstile` (default) |
| [Google reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display) (checkbox) | `recaptcha_v2` |
| [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) (score) | `recaptcha_v3` |
| [hCaptcha](https://docs.hcaptcha.com/) | `hcaptcha` |

You can also add your own provider. This page explains the main use cases; the
[plugin documentation](https://github.com/pieceofcake2/captcha/blob/1.x/docs/README.md)
is the full reference for every option.

![Turnstile widget in a CakePHP 2 form](/captcha-turnstile.png)

## Installation

The plugin requires PHP 8.0 or later and pieceofcake2/cakephp 2.12 or later.
Install it with Composer:

```bash
composer require pieceofcake2/captcha
```

The package has the `cakephp-plugin` type, so `composer/installers` installs it
into your plugins directory. Your application's `composer.json` needs the
matching `installer-paths` setting (see
[Configuring composer.json](/installation#configuring-composer-json)):

| Layout | `installer-paths` |
| --- | --- |
| Modern (`plugins/`) | `"plugins/{$name}/": ["type:cakephp-plugin"]` |
| Legacy (`app/Plugin/`) | `"app/Plugin/{$name}/": ["type:cakephp-plugin"]` |

Then load the plugin in `config/bootstrap.php` (legacy layout:
`app/Config/bootstrap.php`), unless you already use `CakePlugin::loadAll()`:

```php
CakePlugin::load('Captcha');
```

## Configuration

Create a site key and a secret key in the dashboard of your provider, and
configure them with `Configure::write()`, for example in
`config/bootstrap.php`:

```php
Configure::write('Captcha', [
    'provider' => 'turnstile',
    'siteKey' => env('CAPTCHA_SITE_KEY'),
    'secretKey' => env('CAPTCHA_SECRET_KEY'),
]);
```

Do not commit the keys. Set them as environment variables of your server and
read them with `env()`. With the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton, you can also
put them in `config/.env` during development.

The most important settings are:

| Key | Default | Description |
| --- | --- | --- |
| `provider` | `turnstile` | `turnstile`, `recaptcha_v2`, `recaptcha_v3`, `hcaptcha`, or the name of a custom provider class |
| `siteKey` | | The public site key, rendered into the page |
| `secretKey` | | The secret key, sent only to the provider's verify endpoint |
| `action` | | Action name. Rendered into the widget (Turnstile, reCAPTCHA v3) and compared with the action in the verify response |
| `hostname` | | Expected hostname, or a list of hostnames. In the component, `true` uses the host of the current request |
| `scoreThreshold` | `0.5` | reCAPTCHA v3 only: the minimum score |
| `timeout` | `10` | Timeout of the verify request in seconds |
| `language` | | Language of the widget |

Widget options of the provider, such as `theme` and `size`, can be set here
too. The settings of the helper and the component are merged over this
configuration, so a controller can use different settings, or even another
provider.

## Rendering the Widget

Add the helper to your controller (or to `AppController`), and call
`widget()` inside the form:

```php
// src/Controller/ContactsController.php
class ContactsController extends AppController
{
    public $helpers = ['Captcha.Captcha' => ['theme' => 'light']];
}
```

```php
<?php
// templates/Contacts/add.ctp
echo $this->Form->create('Contact');
echo $this->Form->input('name');
echo $this->Form->input('email');
echo $this->Form->input('message');
echo $this->Captcha->widget();
echo $this->Form->end('Send');
```

`widget()` outputs the script of the provider (once per page) and the widget
container. When the user solves the CAPTCHA, the provider's script adds a
hidden field with the token to the form, such as `cf-turnstile-response` for
Turnstile. The options of `widget()` override the configuration, for example
`['theme' => 'dark', 'size' => 'compact']`; other keys become HTML attributes.

The widget unlocks the token fields in `FormHelper`, so forms protected by
`SecurityComponent` are not black-holed. To output the script in the `<head>`
instead, call `$this->Captcha->script(['block' => 'script'])` and pass
`'script' => false` to `widget()`.

## Verifying the Token

### Automatic verification

Add the component to the controller and list the actions to protect:

```php
// src/Controller/ContactsController.php
class ContactsController extends AppController
{
    public $components = [
        'Captcha.Captcha' => [
            'actions' => ['add'],
            'flashOptions' => ['element' => 'error'],
        ],
    ];

    public $helpers = ['Captcha.Captcha'];

    public function add()
    {
        if ($this->request->is('post')) {
            $this->Contact->create();
            if ($this->Contact->save($this->request->data)) {
                return $this->redirect(['action' => 'thanks']);
            }
        }
    }
}
```

For the listed actions (`['*']` for all actions), the component verifies the
token in `startup()`, after `beforeFilter()` and before the action. Only
`POST`, `PUT` and `PATCH` requests are verified (the `methods` setting), so the
action still shows the form on `GET`. When the verification fails, the
`onFailure` setting decides what happens:

| `onFailure` | Behavior |
| --- | --- |
| `redirect` (default) | Sets the `flash` message with `FlashComponent` and redirects to `redirect` (default: the referer) |
| `exception` | Throws the `exception` class (default: `ForbiddenException`) |
| `none` | Only records the result; your action checks it |

Any other setting of the component is provider configuration and overrides
`Configure::read('Captcha')`.

### Redisplaying the form

`redirect` discards the submitted data. To show the form again with what the
user entered, use `'onFailure' => 'none'` and check the result in the action:

```php
public $components = [
    'Captcha.Captcha' => ['actions' => ['add'], 'onFailure' => 'none'],
];

public function add()
{
    if ($this->request->is('post')) {
        $this->Contact->set($this->request->data);
        if (!$this->Captcha->verify()) {
            $this->Contact->invalidate('captcha', __('Please complete the CAPTCHA.'));
        } elseif ($this->Contact->save()) {
            return $this->redirect(['action' => 'thanks']);
        }
    }
}
```

Tokens can be verified only once, but `verify()` reuses the result of the
automatic verification, so the token is not sent to the provider again.

### Manual verification

Without `actions`, the component does nothing automatically, and you call
`verify()` yourself:

```php
if (!$this->Captcha->verify()) {
    $errors = $this->Captcha->getErrors(); // for example ['timeout-or-duplicate']
    $this->Flash->error(__('Please try again.'));

    return $this->redirect(['action' => 'add']);
}
```

`verify(?string $token = null, array $settings = [])` reads the token from the
request data unless you pass one, and `$settings` overrides the configuration
for this call, for example `['action' => 'login']`. `getResult()` returns the
last `CaptchaResult` with `isSuccess()`, `getErrors()`, `getHostname()`,
`getAction()` and `getScore()`.

`getErrors()` returns the error codes of the provider, such as
`invalid-input-response` and `timeout-or-duplicate`, and codes added by the
plugin, such as `missing-input-response` (no token was submitted),
`verification-unavailable` (network error, timeout or an error response),
`hostname-mismatch`, `action-mismatch` and `score-too-low`. Outside a
controller, `CaptchaVerifier` verifies a token in the same way; see the plugin
documentation.

## reCAPTCHA v3

reCAPTCHA v3 shows no challenge. It returns a score between 0.0 (likely a bot)
and 1.0 (likely a human) for each request. With `recaptcha_v3`, `widget()`
renders a hidden input and a small script that fetches a token when the form
is submitted, because tokens expire after two minutes.

Set `provider` to `recaptcha_v3` in the `Captcha` configuration, so that the
helper and the component both use it. Use the same action name in the widget
and in the component, because the action in the verify response must match the
configured action:

```php
// templates/Contacts/add.ctp
echo $this->Captcha->widget(['action' => 'contact']);
```

```php
// src/Controller/ContactsController.php
public $components = [
    'Captcha.Captcha' => [
        'actions' => ['add'],
        'action' => 'contact',
        'scoreThreshold' => 0.7,
    ],
];
```

`action` defaults to `submit`. Requests with a score below `scoreThreshold`
(default `0.5`) fail with `score-too-low`. To decide yourself, for example to
ask for additional verification instead of rejecting the request, set
`scoreThreshold` to `false` and read `$this->Captcha->getResult()->getScore()`.

## Security Notes

- **Always verify on the server.** The widget alone does not protect anything.
  Verify the token with the component before you act on the request.
- **Fail closed.** A missing token or secret key, a network error, a timeout,
  an error response and an invalid response all fail the verification.
- **Hostname and action.** Set `hostname` (or `true` in the component) so that
  tokens solved on another site are rejected, and set `action` to bind a token
  to a form.
- **Client IP behind a proxy.** The component sends the client IP to the
  provider. By default it is `REMOTE_ADDR`, which is the address of the proxy
  behind a reverse proxy or a load balancer. Set `'trustProxy' => true` only
  when the proxy overwrites the `X-Forwarded-For` header (and
  `X-Forwarded-Host` for `'hostname' => true`); otherwise clients can forge
  these headers.
- **Secrets.** The secret key and the tokens are never logged. Failures are
  logged as warnings in the `captcha` scope.
- **Content Security Policy.** If you use a CSP, pass a nonce with the `nonce`
  setting and allow the provider's hosts; the plugin documentation lists them.

## Testing

The providers publish test keys, which you can use in development and in
automated tests, but never in production. For Turnstile, the site key
`1x00000000000000000000AA` with the secret key
`1x0000000000000000000000000000000AA` always passes, and the secret key
`2x0000000000000000000000000000000AA` always fails. The verify response of the
test keys contains the hostname `example.com`, so do not set `hostname` with
them. The plugin documentation lists the test keys of reCAPTCHA v2 and
hCaptcha; reCAPTCHA v3 has none.

In unit and controller tests, give the component a mocked `HttpSocket`, so
that no request leaves the test:

```php
$http = $this->getMockBuilder(HttpSocket::class)->onlyMethods(['post'])->getMock();
$response = new HttpSocketResponse();
$response->code = 200;
$response->body = '{"success":true,"hostname":"example.com"}';
$http->method('post')->willReturn($response);

$this->Controller->Captcha->setHttpSocket($http);
```

The plugin works together with `SecurityComponent`, so a browser test with
[pieceofcake2/e2e-test](/development/e2e-testing) can submit a protected form
with the test keys. E2E tests block external hosts by default; add the
provider's host, such as `challenges.cloudflare.com`, to the
`browser.allowedHosts` option.
