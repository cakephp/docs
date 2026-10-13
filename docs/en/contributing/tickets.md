# Tickets

Getting feedback and help from the community in the form of tickets is an
extremely important part of maintaining the fork. Tickets are GitHub issues:
report problems with the framework in the
[pieceofcake2/cakephp issues](https://github.com/pieceofcake2/cakephp/issues),
and problems with the application skeleton, Bake or a plugin in the issues of
the corresponding `pieceofcake2/*` repository (see
[Maintained Plugins](/plugins/maintained-plugins)). Problems with this book go to
[pieceofcake2/docs](https://github.com/pieceofcake2/docs/issues).

Do not report problems with the fork to cakephp/cakephp. CakePHP 2.x is no
longer maintained there.

## Reporting Bugs

Well written bug reports are very helpful. There are a few steps to help create
the best bug report possible:

- **Do** [search](https://github.com/pieceofcake2/cakephp/issues?q=is%3Aissue)
  for a similar existing ticket, and ensure someone hasn't already reported your
  issue, or that it hasn't already been fixed in the repository. Also check the
  [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
  and the [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10): the behavior you see may be an
  intended change of the fork.
- **Do** include detailed instructions on **how to reproduce the bug**. This
  could be in the form of test cases or a code snippet that demonstrates the
  issue. Not having a way to reproduce an issue, means it's less likely to get
  fixed.
- **Do** give as many details as possible about your environment: OS, PHP
  version, the version of pieceofcake2/cakephp (and of any plugin involved),
  the database, and the full error message.
- **Don't** use the ticket system to ask general support questions. Use
  [Stack Overflow](https://stackoverflow.com/questions/tagged/cakephp) for
  those.

## Reporting Security Issues

If you've found a security issue in the fork, do not report it in a public
issue, pull request or discussion. Report it privately with GitHub's private
vulnerability reporting instead:

1. Open the affected repository, for example
   [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp).
2. Go to the **Security** tab and click **Report a vulnerability**.

Include as much of the following as you can: the affected package and version,
the type of issue (for example XSS, CSRF or SQL injection), the affected files,
steps to reproduce or a proof of concept, and the impact. The full policy is
in the
[security policy](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
of the organization, which applies to all `pieceofcake2/*` repositories unless a
repository has its own `SECURITY.md`.

Vulnerabilities in the original CakePHP 2.x that also affect the fork are in
scope, since the CakePHP team no longer fixes them.

For each report, the maintainers will:

- Confirm the report and determine the affected versions.
- Prepare a fix and release it.
- Publish a GitHub security advisory, and request a CVE when appropriate.

Please keep the details private until a fix has been released. Fixed
vulnerabilities are listed in [Security Fixes](/appendices/security-fixes).
