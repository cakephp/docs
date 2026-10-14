# Security Fixes

The CakePHP team stopped releasing security fixes for CakePHP 2.x when it
reached End of Life in June 2021. The Piece of Cake 2 fork continues to fix
vulnerabilities that affect CakePHP 2.x. This page lists the vulnerabilities
fixed in the fork and other security-related changes, and explains what you
need to do in your application.

To report a vulnerability, see
[Reporting a Vulnerability](/security/reporting). For the status of upstream
CakePHP advisories, see [Upstream Advisories](/security/upstream-advisories).

## Fixed Vulnerabilities

| ID | Summary | Fixed in |
|----|---------|----------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | CSRF protection bypass via the `_method` parameter and custom HTTP methods | 2.11.0 |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF token fixation | 2.11.0 |
| [GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp) | SSRF: `Xml::build()` fetched `https://` URLs even with `'readFile' => false` | 2.12.3 |
| [GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv) | Email header injection in `SmtpTransport` and `MailTransport` (CakePHP 2 equivalent of CVE-2026-77634) | 2.12.5 |
| [GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95) | Path traversal in view, layout and element names (CakePHP 2 equivalent of CVE-2026-48820) | 2.12.5 |
| [GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx) | Open redirect after login via a protocol-relative `Auth.redirect` URL | 2.12.5 |

All of these vulnerabilities are present in the original CakePHP 2.10.24, and
the CakePHP team no longer releases fixes for it. If your application still
uses `cakephp/cakephp`, you can get the fixes by switching to
`pieceofcake2/cakephp`, which declares `replace` for `cakephp/cakephp`. It
requires PHP 8.0 or newer; see
[Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10).

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

### Email header injection in `SmtpTransport` and `MailTransport` {#email-header-injection}

`SmtpTransport` wrote the message headers into the SMTP `DATA` command without
removing line breaks from header values. `MailTransport` removed `\r\n`
sequences from header values, the subject and the recipient, but not a bare
`\r` or `\n`, which many mail servers also treat as a line break. If an
application put user input into an email header, for example a custom header
set with `CakeEmail::setHeaders()` or `addHeaders()`, an attacker could add
headers such as `Bcc:` or start the message body.

This is the CakePHP 2 equivalent of CVE-2026-77634, which was fixed in CakePHP
4.x and 5.x. It was fixed in 2.12.5: `SmtpTransport` removes CR and LF bytes
from header names and values and keeps only folded header lines (a line break
followed by whitespace, as produced by the MIME encoding of long headers), and
`MailTransport` removes bare `\r` and `\n` as well. See the security advisory
[GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv).

**What you need to do:** update to 2.12.5 or later. If your code put raw line
breaks into a header value to add more headers, pass one entry per header to
`CakeEmail::setHeaders()` or `addHeaders()` instead. Until you can update,
remove CR and LF from user input before you use it in header values, the
subject or addresses.

### Path traversal in view, layout and element names {#view-path-traversal}

`View` did not check that the file found for a view, layout or element name
was inside the view paths. When an application built such a name from user
input, for example `$this->element('widgets/' . $type)`, a name containing `..`
could resolve to another file on the server, which was then included and run
as a PHP template.

This is the CakePHP 2 equivalent of CVE-2026-48820, which was fixed in CakePHP
4.x and 5.x. It was fixed in 2.12.5: when a name contains `..`, the real path
of the file must be inside one of the view paths (`App::path('View')` and the
plugin and theme view paths). Files outside them are treated as missing:
`element()` behaves as for a missing element, `elementExists()` returns
`false`, and views and layouts throw `MissingViewException` and
`MissingLayoutException`. Names that stay inside the view paths keep working.
See the security advisory
[GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95).

**What you need to do:** update to 2.12.5 or later. If you render templates
from outside the view paths with names such as `../../other/file`, move those
templates into a view path. Do not build view, layout or element names from
user input, or check the input against an allow list first.

### Open redirect after login in `AuthComponent` {#auth-redirect}

When an unauthenticated user requests a protected action, `AuthComponent`
stores the requested URL in the `Auth.redirect` session key, and
`AuthComponent::redirectUrl()` returns it after a successful login. Browsers
treat a URL that starts with `//`, or with a backslash variant such as `/\` or
`\\`, as a URL on another host. A crafted link whose path started with `//`
could therefore send the user to an attacker's site after logging in (open
redirect).

There is no upstream advisory for CakePHP 2; the issue is similar to
CVE-2026-55590 in the `cakephp/authentication` plugin. It was fixed in 2.12.5:
`redirectUrl()` collapses the leading slashes and backslashes of the stored URL
into a single `/`, so the redirect always stays on the same host. See the
security advisory
[GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx).

**What you need to do:** update to 2.12.5 or later; no code changes are
needed. Until you can update, check the value of `Auth.redirect` before
redirecting, and reject values that start with `//`, `/\`, `\/` or `\\`.

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

Applications created from the [pieceofcake2/app](https://pieceofcake2.github.io/app/)
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
