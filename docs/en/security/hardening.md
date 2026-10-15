# Hardening Checklist

Check these points before you run a CakePHP 2 application in production. Each
item links to the page of this book that describes the setting.

## Disable Debug Mode {#debug}

Set `debug` to `0` in production. With a higher debug level, error messages,
stack traces and SQL queries are shown to visitors. Applications created from
the `pieceofcake2/app` skeleton read the level from the `DEBUG` environment
variable and use level 2 when it is not set, so set `DEBUG=0` on the
production server. See [Update core.php](/deployment#update-core-php).

## Use Your Own Salt and Cipher Seed {#salt}

Set `Security.salt` and `Security.cipherSeed` to secret values that are unique
to your application, not the values shipped with the skeleton. The salt is
used to sign CSRF tokens and form tampering tokens and is the default key of
`CookieComponent`; CakePHP shows a notice while the skeleton's default salt is
in use. The skeleton reads the values from the `SECURITY_SALT` and
`SECURITY_CIPHER_SEED` environment variables. See `Security.salt` and
`Security.cipherSeed` in [Core Configuration](/development/configuration#cakephp-core-configuration)
and [Environment Variables](/development/configuration#environment-variables).

Changing the salt invalidates outstanding CSRF tokens and cookies encrypted
with the default key.

## Keep Dependencies Up to Date {#dependencies}

Security fixes are released only for the latest release (see
[Supported Versions](/security/#supported-versions)). Update
`pieceofcake2/cakephp`, the plugins and the other packages regularly with
Composer, and install them without development dependencies in production:

```bash
composer update
composer install --no-dev --optimize-autoloader
```

Keep `composer/ca-bundle` up to date as well; it provides the CA certificates
for HTTPS connections made by `HttpSocket`. See
[Security Fixes](/security/fixes) and
[Install dependencies for production](/deployment#install-dependencies-for-production).

## Use SecurityComponent for Forms and CSRF {#security-component}

Load [SecurityComponent](/core-libraries/components/security-component) in
controllers that handle forms. It checks forms for tampering, and its CSRF
protection (`$csrfCheck`, enabled by default) validates a token on every
request except GET, HEAD and OPTIONS. Do not disable the checks for whole
controllers; unlock only the actions or fields that need it.

Do not build view, layout or element names or `Xml::build()` input from user
input without checking it (see [Security Fixes](/security/fixes)).

## Validate Input {#validate-input}

Validate every field from the request on the server with model validation
rules, and save user data with validation enabled. Use allow lists and length
limits, limit the saved fields with `fieldList`, and from v2.12.6 reject
invalid UTF-8 with the `utf8` rule. See
[Validate Input](/security/escaping-and-sanitizing-html#validate-input) and
[Data Validation](/models/data-validation).

## Escape Output and Sanitize HTML {#escape-output}

Escape every value you output with `h()` (templates do not escape
automatically), encode values for URLs and JavaScript, and pass HTML from users
through a maintained sanitizer such as Symfony HtmlSanitizer or HTML Purifier.
Add a Content Security Policy as a second layer. See
[Output Escaping and HTML Sanitization](/security/escaping-and-sanitizing-html).

## Secure Cookies and Sessions {#cookies-and-sessions}

- CakePHP sets `session.cookie_httponly` for the session cookie, and sets
  `session.cookie_secure` when the request is made over HTTPS, unless you set
  these ini values yourself. Other session ini settings, such as
  `session.cookie_samesite`, can be set in `Session.ini`. See
  [Sessions](/development/sessions).
- `CookieComponent` does not set the `secure` and `httpOnly` flags by
  default. Set `$this->Cookie->secure = true;` so that cookies are sent only
  over HTTPS, and `$this->Cookie->httpOnly = true;` for cookies that
  JavaScript does not need to read. See [Cookie](/core-libraries/components/cookie).
- Use the `'aes'` cookie encryption type instead of the default `'cipher'`, and
  enable `Security.useOpenSsl`. See
  [CookieComponent cipher type](/security/fixes#cookiecomponent-cipher-type).

## Restrict File Permissions {#file-permissions}

Set the document root to the `webroot/` directory, so that the application
code, the configuration and `vendor/` cannot be accessed through a URL. The
web server needs write access only to `tmp/` and `logs/`. See
[Set document root](/deployment#set-document-root),
[Permissions](/installation#permissions) and
[URL Rewriting](/installation/url-rewriting).

## Use HTTPS {#https}

Serve the application over HTTPS only. The session cookie is marked secure
when CakePHP detects HTTPS (the `HTTPS` server variable). Actions can require
HTTPS with `SecurityComponent::requireSecure()`; see
[Restrict actions to SSL](/core-libraries/components/security-component#restrict-actions-to-ssl).
Configure TLS and redirects in the web server; see
[URL Rewriting](/installation/url-rewriting) and [Deployment](/deployment).

## Use a Supported PHP Version {#php-version}

`pieceofcake2/cakephp` runs on PHP 8.0 to 8.5 (see
[Requirements](/installation#requirements)). Use a PHP version that still
receives security fixes from the PHP project; see
[Supported Versions](https://www.php.net/supported-versions.php) on php.net.
