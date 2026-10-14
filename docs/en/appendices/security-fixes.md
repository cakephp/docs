# Security Fixes

The CakePHP team stopped releasing security fixes for CakePHP 2.x when it
reached End of Life in June 2021. The Piece of Cake 2 fork continues to fix
vulnerabilities that affect CakePHP 2.x. This page lists the vulnerabilities
fixed in the fork and other security-related changes, and explains what you
need to do in your application.

## Reporting a Vulnerability

Please do not report security issues in public issues or pull requests.
Use GitHub's private vulnerability reporting instead: open the affected
repository (for example [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)),
go to the **Security** tab and click **Report a vulnerability**.
See the [security policy](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
for details.

## Fixed Vulnerabilities

| CVE | Summary | Fixed in |
|-----|---------|----------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | CSRF protection bypass via the `_method` parameter and custom HTTP methods | 2.11.0 |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF token fixation | 2.11.0 |
| [GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp) | SSRF: `Xml::build()` fetched `https://` URLs even with `'readFile' => false` | 2.12.3 |

All of these vulnerabilities are present in the original CakePHP 2.10.24.

### CVE-2015-8379: CSRF bypass with the `_method` parameter

`SecurityComponent` only validated the CSRF token for POST, PUT, DELETE and
PATCH requests. A request that used another HTTP method, either directly or
by overriding the method with the `_method` parameter, skipped CSRF
validation.

The fork now validates the CSRF token for every request except GET, HEAD and
OPTIONS. The fix is a backport of an upstream CakePHP patch
([c0fb45e](https://github.com/pieceofcake2/cakephp/commit/c0fb45e79)), and tests
were added in [PR #6](https://github.com/pieceofcake2/cakephp/pull/6).

**What you need to do:** nothing, unless your application relies on custom
HTTP methods being exempt from CSRF validation. Such requests now need a valid
CSRF token, or the action must be listed in `SecurityComponent::$unlockedActions`.

### CVE-2020-15400: CSRF token fixation

CSRF tokens were random values stored in the session. An attacker who could
write to the session, for example through an XSS vulnerability, could fixate
a token and use it for CSRF attacks.

The fork generates HMAC-signed tokens, as CakePHP 3.x and 4.x do
([PR #5](https://github.com/pieceofcake2/cakephp/pull/5)). A token consists of
16 random bytes followed by an HMAC-SHA1 signature of those bytes computed with
`Security.salt`, encoded with base64. A token that was not signed with your
application's salt is rejected, and signatures are compared in constant time.

**What you need to do:** nothing in your code. Tokens issued before the
upgrade are still accepted until they expire. Make sure that each application
uses its own secret `Security.salt` in `config/core.php`, and not the value
shipped with the skeleton, because the signature depends on it.

### SSRF in `Xml::build()` with `'readFile' => false` {#xml-build-ssrf}

`Xml::build()` reads a local file or fetches a URL when its input is a file
path or a URL. The `'readFile' => false` option disables this so that user
input can be passed safely. Because of a missing pair of parentheses in the
condition, however, `https://` URLs were still fetched with
`'readFile' => false`. An attacker who controls the input could make the
server send requests to any `https://` URL (server-side request forgery).
`http://` URLs and local files were not affected.

The bug was introduced in CakePHP 2.6.6 together with the `readFile` option
([995d8d2](https://github.com/cakephp/cakephp/commit/995d8d22c6)) and is
present in every later 2.x release. It was fixed in 2.12.3
([PR #33](https://github.com/pieceofcake2/cakephp/pull/33)). With
`'readFile' => false`, neither `http://` nor `https://` URLs are fetched, and
an `XmlException` is thrown instead. See the security advisory [GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp).

**What you need to do:** update to 2.12.3 or later. Pass `'readFile' => false`
whenever the input may come from users. If your code relied on fetching an
`https://` URL with `'readFile' => false`, remove the option (it defaults to
`true`) or fetch the document yourself, for example with `HttpSocket`, and
pass the XML string.

## Other Security Changes

### SSL/TLS certificate validation

The original CakePHP 2.x validated HTTPS certificates with a bundled
`lib/Cake/Config/cacert.pem` that was last updated in 2016. The fork removed
that file and uses [composer/ca-bundle](https://github.com/composer/ca-bundle)
([PR #15](https://github.com/pieceofcake2/cakephp/pull/15), fixed in 2.11.0):

- The system CA bundle is used when OpenSSL provides one (`openssl.cafile` or
  `openssl.capath`).
- Otherwise, the Mozilla CA bundle shipped with composer/ca-bundle is used. It
  is updated through Composer.

This applies to `CakeSocket` and `HttpSocket`. If you set
`context.ssl.cafile` or `context.ssl.capath` yourself, your setting is used.

**What you need to do:** update code that refers to the removed `cacert.pem`
file, and keep `composer/ca-bundle` up to date.

### Encryption on PHP 8

The mcrypt extension is not bundled with PHP 7.2 and later; it is only
available from [PECL](https://pecl.php.net/package/mcrypt). Without it, `Security::encrypt()`,
`Security::decrypt()` and the `'aes'` type of `CookieComponent` only work when
OpenSSL is enabled:

```php
// config/core.php
Configure::write('Security.useOpenSsl', true);
```

Applications created from the [pieceofcake2/app](https://github.com/pieceofcake2/app)
skeleton (v2.3.1 and later) already have this line. Add it to existing
applications.

`Security::rijndael()` and the `'rijndael'` cookie type always require mcrypt.
See the [Upgrade Guide](/appendices/migrating-from-cakephp-2-10#enable-openssl).

### CookieComponent `cipher` type

The default encryption type of `CookieComponent` is `'cipher'`, which uses the
XOR-based `Security::cipher()`. It is not secure, and its seed
(`Security.cipherSeed`) depends on undefined float-to-int conversion. Use
`'aes'` instead, set with the `'type'` setting in `$components`:

```php
public $components = [
    'Cookie' => ['type' => 'aes'],
];
```

You can also call `$this->Cookie->type('aes');` in `beforeFilter()`.

::: pieceofcake2
The `'type'` setting in `$components` is honored since v2.12.3. In v2.12.2 and
earlier it was ignored and cookies were encrypted with `'cipher'`.
:::

::: warning
Changing the encryption type makes existing cookies unreadable. Plan the
migration, for example by accepting both types during a transition period.
:::

### XML external entities

`Xml::build()` does not load `<!ENTITY` definitions unless you pass
`'loadEntities' => true`. Keep the default when you parse untrusted XML.

`Xml::build()` also reads a local file or fetches a URL when the input is a
path or URL. When you pass user input, set `'readFile' => false`
(see [above](#xml-build-ssrf)) or check that it is an XML string, for example
that it starts with `<`.
