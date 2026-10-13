# Security

::: pieceofcake2
This page is specific to the **pieceofcake2 fork** and is not part of the
original CakePHP 2.x documentation. It lists security-related changes in
pieceofcake2/cakephp and settings you should review in your application.
:::

## Known vulnerabilities in the original CakePHP 2.10.24

The following vulnerabilities have been reported against the original CakePHP
2.10.24:

| CVE | Description | Status in the fork |
|-----|-------------|--------------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | CSRF protection bypass via `_method` parameter | Fixed in [c0fb45e](https://github.com/pieceofcake2/cakephp/commit/c0fb45e79), tests in [PR #6](https://github.com/pieceofcake2/cakephp/pull/6) |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF token fixation (exploitable with XSS) | Fixed in [PR #5](https://github.com/pieceofcake2/cakephp/pull/5) |

- **CVE-2015-8379**: the fix is fully applied, with test coverage for `_method`
  parameter handling and custom HTTP methods. Safe methods (GET, HEAD, OPTIONS)
  are exempt; all other methods require a CSRF token.
- **CVE-2020-15400**: fixed by HMAC-signed CSRF tokens, see below.

## CSRF tokens

`SecurityComponent` CSRF tokens are now signed
([PR #5](https://github.com/pieceofcake2/cakephp/pull/5)):

- New tokens use an HMAC-SHA1 signature computed with the application's
  `Security.salt`, so a token cannot be fixated by an attacker through XSS or
  physical access.
- The token format is base64-encoded: a 16-byte random value followed by a
  20-byte HMAC.
- Existing (legacy) tokens continue to work, so no action is required.

::: tip
Since tokens are bound to `Security.salt`, make sure each application uses its
own, secret salt value in `core.php`, and not the default one.
:::

## SSL/TLS certificate validation

The fork uses [`composer/ca-bundle`](https://github.com/composer/ca-bundle) for
certificate validation ([PR #15](https://github.com/pieceofcake2/cakephp/pull/15)):

- **System CA certificates**: OpenSSL's default certificate bundle is used when
  available (`openssl.cafile` or `openssl.capath`).
- **Fallback bundle**: otherwise Mozilla's CA bundle maintained by
  composer/ca-bundle is used.
- **Automatic updates**: certificates are updated through Composer.
- The outdated static `lib/Cake/Config/cacert.pem` (last updated in 2016) has
  been removed.

HTTPS connections made by `CakeSocket` and `HttpSocket` (for example, external
API calls) therefore validate certificates against current root certificates.
If you set `context.ssl.cafile` or `context.ssl.capath` yourself in the socket
configuration, your setting is used instead. Code that referenced the removed
`cacert.pem` file must be updated.

## XML parsing (XXE)

`Xml::build()` does not load `<!ENTITY` definitions unless you pass
`'loadEntities' => true`, which protects against XML external entity (XXE)
attacks. Keep the default when parsing untrusted XML.

`Xml::build()` also reads local files and remote URLs when the input is a path
or URL (`'readFile' => true` is the default for backward compatibility). When
passing user data to `Xml::build()`, disable it:

```php
$xml = Xml::build($userInput, ['readFile' => false]);
```

## CookieComponent `cipher` type

The default encryption type of `CookieComponent`, `'cipher'`, is insecure:

- it uses `Security::cipher()`, an XOR-based cipher that is cryptographically
  weak;
- its seed, `mt_srand((int)(float)Configure::read('Security.cipherSeed'))`,
  depends on undefined float-to-int casting behavior and has no guaranteed
  consistency.

::: warning
The CakePHP source itself says: "Cipher is horribly insecure and only the
default because of backwards compatibility. In new applications you should
always change this to 'aes' or 'rijndael'."
:::

Switch to `'aes'` (or `'rijndael'`):

```php
public $components = [
    'Cookie' => [
        'type' => 'aes',
    ],
];

// or in a controller action
$this->Cookie->type('aes');
```

::: danger
Changing the encryption type invalidates existing cookies. Plan the migration,
for example by supporting both types during a transition period.
:::

On PHP 8, where mcrypt is usually not available, `'aes'` works only with
OpenSSL enabled in `core.php`; `'rijndael'` always requires mcrypt:

```php
Configure::write('Security.useOpenSsl', true);
```

See the [Upgrade Guide](/pieceofcake2/upgrade#enable-openssl).

## Reporting vulnerabilities

The CakePHP core team no longer maintains 2.x. Report security issues found in
the fork to the [Piece of Cake 2](https://github.com/pieceofcake2) project via
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp).
