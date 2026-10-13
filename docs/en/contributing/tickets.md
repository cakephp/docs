# Tickets

Getting feedback and help from the community in the form of tickets is an
extremely important part of the CakePHP development process. All of CakePHP's
tickets are hosted on [GitHub](https://github.com/cakephp/cakephp/issues).

::: pieceofcake2
Issues with the pieceofcake2 fork belong in
[pieceofcake2/cakephp issues](https://github.com/pieceofcake2/cakephp/issues)
(or the issues of the relevant `pieceofcake2/*` plugin repository), not in
cakephp/cakephp. Include your PHP version, your pieceofcake2/cakephp version,
the error message and, if possible, minimal code that reproduces the problem.
:::

## Reporting bugs

Well written bug reports are very helpful. There are a few steps to help create
the best bug report possible:

- **Do** [search](https://github.com/cakephp/cakephp/search?q=it+is+broken&ref=cmdform&type=Issues)
  for a similar existing ticket, and ensure someone hasn't already reported your
  issue, or that it hasn't already been fixed in the repository.
- **Do** include detailed instructions on **how to reproduce the bug**. This
  could be in the form of test cases or a code snippet that demonstrates the
  issue. Not having a way to reproduce an issue, means it's less likely to get
  fixed.
- **Do** give as many details as possible about your environment: (OS, PHP
  version, CakePHP version).
- **Don't** use the ticket system to ask support questions. Use the [Google
  Group](https://groups.google.com/group/cake-php), the \#cakephp IRC channel or
  Stack Overflow \<https://stackoverflow.com/questions/tagged/cakephp\>
  for that.

## Reporting security issues

::: pieceofcake2
CakePHP 2.x is no longer supported by the CakePHP core team, so vulnerabilities
in the pieceofcake2 fork should not be sent to the address below. Report them
privately to the pieceofcake2 maintainers through the
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) repository
instead of opening a public issue. Security issues already fixed in the fork are
listed in [Security](/pieceofcake2/security).
:::

If you've found a security issue in CakePHP, please use the following procedure
instead of the normal bug reporting system. Instead of using the bug tracker,
mailing list or IRC please send an email to **security \[at\] cakephp.org**.
Emails sent to this address go to the CakePHP core team on a private mailing
list.

For each report, we try to first confirm the vulnerability. Once confirmed, the
CakePHP team will take the following actions:

- Acknowledge to the reporter that we've received the issue, and are working on
  a fix. We ask that the reporter keep the issue confidential until we announce
  it.
- Get a fix/patch prepared.
- Prepare a post describing the vulnerability, and the possible exploits.
- Release new versions of all affected versions.
- Prominently feature the problem in the release announcement.
