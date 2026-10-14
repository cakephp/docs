# Security

The CakePHP team stopped releasing security fixes for CakePHP 2.x when it
reached End of Life in June 2021. The pieceofcake2 fork continues to fix
vulnerabilities that affect CakePHP 2.x. This section describes which versions
receive security fixes, how to report a vulnerability, which vulnerabilities
have been fixed, and how to run a CakePHP 2 application safely.

- [Reporting a Vulnerability](/security/reporting): how to report a
  security issue privately and what happens after you report it.
- [Security Fixes](/security/fixes): the vulnerabilities fixed in the fork
  and what you need to do in your application.
- [Upstream Advisories](/security/upstream-advisories): the status of the
  CakePHP advisories that concern CakePHP 2.x.
- [Hardening Checklist](/security/hardening): settings to check before you
  run an application in production.

## Supported Versions {#supported-versions}

The [security policy](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
of the pieceofcake2 organization applies to all its repositories,
including [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) and
the plugin forks, unless a repository has its own `SECURITY.md`. It states:

- Security fixes are released for the latest release of each package. For
  `pieceofcake2/cakephp`, this is the latest `2.x` release.
- Vulnerabilities found in the original CakePHP 2.x that also affect the fork
  are in scope.

So far, security fixes have been released as patch releases of the current
minor version, for example 2.12.3 and 2.12.5. To receive fixes, keep your
application on the latest release:

```bash
composer update pieceofcake2/cakephp
```

Applications that still use the original `cakephp/cakephp` 2.10.24 do not
receive any fixes. See
[Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10) to
switch to `pieceofcake2/cakephp`.

## How Fixes Are Announced {#announcements}

When a vulnerability is fixed, it is announced in these places:

- **GitHub Security Advisories.** An advisory is published on the affected
  repository, for example on the
  [Security Advisories](https://github.com/pieceofcake2/cakephp/security/advisories)
  page of pieceofcake2/cakephp. It names the affected and patched versions.
  A CVE is requested when appropriate.
- **CHANGELOG.** The release notes in
  [CHANGELOG.md](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
  have a "Security Fixes" section and link to the advisories.
  [UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
  describes any changes you need to make.
- **This book.** [Security Fixes](/security/fixes) lists every fixed
  vulnerability with a description and the steps to take in your
  application, and [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10)
  describes the changes of each release.

To be notified of new releases, watch the
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) repository on
GitHub (**Watch** > **Custom** > **Releases**).
