# Reporting a Vulnerability

**Do not report security vulnerabilities in public GitHub issues, pull
requests or discussions.** Report them privately, as described in the
[security policy](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
of the pieceofcake2 organization.

## How to Report {#how-to-report}

The repositories of the organization accept reports through GitHub's private
vulnerability reporting:

1. Open the repository that is affected, for example
   [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) for the
   framework or [pieceofcake2/app](https://github.com/pieceofcake2/app) for the
   application skeleton.
2. Go to the **Security** tab and click **Report a vulnerability**.
3. Fill in the form and submit it. Only you and the maintainers of the
   repository can see the report.

You need a GitHub account to report. See
[Privately reporting a security vulnerability](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
in the GitHub documentation for details.

Report vulnerabilities in the original CakePHP 2.x the same way when they
also affect `pieceofcake2/cakephp`; they are in scope of the policy. The
CakePHP team no longer fixes CakePHP 2.x.

## What to Include {#what-to-include}

Please include as much of the following as you can:

- The affected package and version
- The type of issue (for example XSS, CSRF or SQL injection)
- The affected files and code location
- Steps to reproduce, or a proof of concept
- The impact, including how an attacker could exploit the issue

## What Happens Next {#what-happens-next}

The security policy describes the disclosure process:

1. The maintainers confirm the report and determine the affected versions.
2. They prepare a fix and release it.
3. They publish a GitHub security advisory, and request a CVE when
   appropriate.

Please keep the details private until a fix has been released. The fix is
then announced as described in
[How Fixes Are Announced](/security/#announcements) and listed in
[Security Fixes](/security/fixes).
