# Output Escaping and HTML Sanitization

Cross-site scripting (XSS) happens when data from users ends up in a page as
HTML or JavaScript. CakePHP 2 templates (`.ctp` files) are plain PHP and do not
escape output automatically, so you decide in each template how a value is
output. This page explains the two tools for that:

- **Escaping** turns special characters into HTML entities, so the value is
  shown as text. Use it for almost everything.
- **Sanitizing** (removing the dangerous parts) keeps the HTML but removes
  everything that is not on an allow list, so it can be output as HTML. Use it
  only where users are allowed to submit HTML.

Current guidance, such as the
[OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html),
comes down to four rules (see [References](#references)):

1. **Validate input.** Check every value on the server against what the field
   allows (type, length, format, allowed values, valid UTF-8) and reject the
   request when it doesn't match. See [Validate Input](#validate-input).
2. **Escape at output time, for the context.** Save validated data as it was
   entered, without HTML-escaping it, and escape it when you output it, with
   the encoding for the place where it goes (HTML text, attribute, URL,
   JavaScript). Escaping on input breaks the data and still misses contexts.
3. **Never output untrusted data unescaped,** except HTML that went through an
   HTML sanitizer.
4. **Add a second layer** with a Content Security Policy, so that a mistake
   does not become an exploitable XSS.

Validation and escaping do different jobs: validation keeps invalid data out,
escaping keeps valid data from being run as code. A comment field may
legitimately contain `<script>`, so validation alone never prevents XSS, and
escaping alone does not stop invalid data from being saved. Use both.

## Validate Input {#validate-input}

Validate all data from the request (form data, query strings, cookies, headers
and uploaded files) before you save it or use it:

- Define rules for every field in the model's `$validate`, and save with
  validation enabled (`save()` validates by default; do not pass
  `'validate' => false` for user data). See [Data Validation](/models/data-validation).
- Prefer allow lists: `inList` for fixed choices, `naturalNumber`, `date`,
  `email`, `url`, `maxLength` and `custom` patterns for formats. Limit the
  length of every text field.
- Reject invalid input instead of repairing it. Do not strip or rewrite values
  silently; show the validation errors to the user.
- Check the character encoding. From v2.12.6, the `utf8` rule rejects invalid
  UTF-8 byte sequences (and, by default, characters outside the Basic
  Multilingual Plane for MySQL's 3-byte `utf8`; use `'extended' => true` for
  `utf8mb4`).
- Validate on the server. Checks in the browser (HTML5 attributes,
  JavaScript) are only a convenience for the user.
- Limit which fields can be saved with the `fieldList` option of `save()`, so
  that a request cannot set fields such as `role` or `user_id`.

## Escape by Default {#escape-by-default}

Escape every value that is not meant to be HTML with `h()`:

```php
<h1><?php echo h($post['Post']['title']); ?></h1>
<p><?php echo h($post['Post']['summary']); ?></p>
```

`h()` uses `htmlspecialchars()` with `ENT_QUOTES` and the application
encoding, so it is safe in element content and in quoted attribute values.
See [Global Constants and Functions](/core-libraries/global-constants-and-functions).

The helpers escape for you:

- `HtmlHelper::link()` escapes the link text and the attributes. Pass
  `'escape' => false` only when the text is HTML that you built yourself.
- `FormHelper` escapes the values of the inputs it creates.
- `HtmlHelper::tag()`, `div()` and `para()` escape the attributes; escape the
  content yourself, or pass `'escape' => true`.

Values that end up in other contexts need other encoding:

- **URLs in attributes:** build them with `HtmlHelper::url()` or
  `Router::url()`, and do not output user-supplied URLs without checking the
  scheme (`http`/`https`); `javascript:` URLs are not stopped by `h()`.
- **JavaScript:** do not put values into inline scripts by string
  concatenation. Encode them with `json_encode()` and the `JSON_HEX_*` flags,
  so that `</script>` and quotes cannot end the script:

  ```php
  <script>
  var config = <?php echo json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  </script>
  ```

## Accepting HTML from Users {#accepting-html}

When users may submit HTML, for example in a rich text editor, escaping is not
an option. Pass the HTML through a maintained HTML sanitizer that keeps only
the elements and attributes on its allow list. Do not write your own filter
with regular expressions or `strip_tags()`; they miss many cases.

- [Symfony HtmlSanitizer](https://symfony.com/doc/current/html_sanitizer.html)
  (`symfony/html-sanitizer`) follows the W3C HTML Sanitizer API and is the
  recommended choice. It needs PHP 8.1 or later; Composer installs the version
  that matches your PHP (6.4 LTS for PHP 8.1, newer releases for newer PHP).

  ```php
  use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
  use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

  $sanitizer = new HtmlSanitizer(
      (new HtmlSanitizerConfig())->allowSafeElements(),
  );
  $html = $sanitizer->sanitize($this->request->data['Post']['body']);
  ```

- [HTML Purifier](https://htmlpurifier.org/) (`ezyang/htmlpurifier`) is
  still maintained and supports every PHP version that `pieceofcake2/cakephp`
  runs on, including PHP 8.0. Use it on PHP 8.0, or when you need its detailed
  configuration.

  ```php
  $purifier = new HTMLPurifier(HTMLPurifier_Config::createDefault());
  $html = $purifier->purify($this->request->data['Post']['body']);
  ```

Where to sanitize:

- Sanitize when the HTML is saved (for example in the model's `beforeSave()`
  or in the controller before `save()`), so that every place that outputs it
  gets clean HTML, **or** keep the original and sanitize right before output.
  Do not output unsanitized user HTML anywhere, including in admin screens and
  emails.
- Output sanitized HTML without `h()`, and escape every other field as usual.
- Keep the allow list small. Allow only the elements and attributes the editor
  needs, and only `http`/`https` (and `mailto`) links.

### Markdown {#markdown}

Markdown can contain raw HTML. When you render Markdown from users, for example
with [pieceofcake2/markdown](https://pieceofcake2.github.io/markdown/) (which
returns the HTML as is), sanitize the resulting HTML in the same way.

## The Sanitize Class {#sanitize-class}

The `Sanitize` class of CakePHP 2 is deprecated. Its `html()` method escapes
rather than sanitizes, and `clean()` modifies data in ways that are hard to
reason about. Use `h()` and the libraries above instead; see
[Data Sanitization](/core-utility-libraries/sanitize).

## Defense in Depth {#defense-in-depth}

- Send a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
  header, so that an XSS that slips through cannot run its scripts. The
  recommended form is a strict, nonce-based policy (`script-src 'nonce-...'
  'strict-dynamic'; object-src 'none'; base-uri 'none'`): generate a random
  nonce per request, send it in the header, and add it to every `<script>`
  tag you output. Start with `Content-Security-Policy-Report-Only` to find the
  scripts that still need a nonce.
- Mark cookies `httpOnly` so that scripts cannot read them. See the
  [Hardening Checklist](/security/hardening#cookies-and-sessions).

## References {#references}

- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html):
  output encoding for each context and HTML sanitization
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/):
  verification requirements for encoding, sanitization and security headers
