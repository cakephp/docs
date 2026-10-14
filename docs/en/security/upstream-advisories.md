# Upstream Advisories

This page lists the security advisories of the CakePHP project that concern
CakePHP 2.x, and their status in `pieceofcake2/cakephp`. The status comes from
the fork's [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md),
[UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md) and
[security advisories](https://github.com/pieceofcake2/cakephp/security/advisories).
For the details of each fix and what to change in your application, see
[Security Fixes](/security/fixes).

## Status {#status}

| Upstream advisory | Summary | Status in the fork |
|-------------------|---------|--------------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | CSRF protection bypass via the `_method` parameter | Fixed in 2.11.0 (backport of the upstream patch) |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF token fixation | Fixed in 2.11.0 (HMAC-signed tokens, as in CakePHP 3.x and 4.x) |
| CVE-2026-77634 | Email header injection, fixed upstream in CakePHP 4.x and 5.x | The CakePHP 2 equivalent is fixed in 2.12.5 ([GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv)) |
| CVE-2026-48820 | Path traversal in template names, fixed upstream in CakePHP 4.x and 5.x | The CakePHP 2 equivalent is fixed in 2.12.5 ([GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95)) |
| CVE-2026-55590 | Login redirect issue in the `cakephp/authentication` plugin | Not applicable: the plugin is not part of CakePHP 2. A similar issue in `AuthComponent` is fixed in 2.12.5 ([GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx)) |

The SSRF in `Xml::build()` with `'readFile' => false`
([GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp),
fixed in 2.12.3) was found in the fork and has no upstream advisory.

## Advisories Not Listed Here {#not-listed}

The fork has not published an assessment of other upstream advisories, so
this page does not list any advisory as "not affected". If you think that an
upstream CakePHP advisory also affects `pieceofcake2/cakephp`, report it
privately as described in [Reporting a Vulnerability](/security/reporting).
