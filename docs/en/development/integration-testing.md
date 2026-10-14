# Integration Testing

Integration tests send a request to your application and check the response.
`IntegrationTestTrait` builds a request from a URL and some data, dispatches it
through the real `Dispatcher` (dispatcher filters, routes, components, the
controller, the view and the layout, with nothing mocked) and captures the
`CakeResponse` instead of sending it to a browser. The `assert*()` methods then
check the status code, the redirect, the headers, the body, the rendered
template and layout, the session, flash messages and cookies. `EmailTrait`
captures the emails sent during the request, so that you can check them too.

Everything runs in the PHPUnit process: there is no web server and no browser,
so a request takes milliseconds.

::: pieceofcake2
`IntegrationTestTrait` and `EmailTrait` were added in v2.12.4 as backports
from CakePHP 4.x/5.x. The method names and their behavior follow CakePHP 5, so
these tests need few changes when the application moves to CakePHP 5.
:::

## When to Use Integration Tests

CakePHP applications are usually tested on several levels (see
[Types of Tests](/development/testing#types-of-tests)). Integration tests take
the place of controller tests written with
[`ControllerTestCase::testAction()`](/development/testing#testing-controllers):

| | `ControllerTestCase::testAction()` | `IntegrationTestTrait` |
| --- | --- | --- |
| Base class | `ControllerTestCase` | Any test case, usually `CakeTestCase` |
| Controller | Mocked with `generate()` (`_stop()` and components can be mocked) | Real controller, built by the `Dispatcher` |
| Request | `testAction($url, ['method' => ..., 'data' => ...])` | `get()`, `post()`, `put()`, `patch()`, `delete()`, `head()`, `options()` |
| Dispatcher filters | Not run | Run (`Dispatcher.filters`) |
| `SecurityComponent` | Mock `_validatePost()` or disable it | `enableSecurityToken()` and `enableCsrfToken()` add valid tokens |
| Redirects | `exit` avoided by mocking `_stop()`; read `$this->headers['Location']` | `exit` is replaced automatically; `assertRedirect()` |
| Results | `$this->vars`, `$this->view`, `$this->contents`, `$this->headers`, `$this->result` | `viewVariable()`, `$this->_response`, `$this->_controller`, assertions |
| Exceptions | Thrown to the test | Rendered as the error page (like in production), or thrown with `disableErrorHandlerMiddleware()` |
| Session, cookies | Set `$_SESSION` and `$_COOKIE` yourself | `session()`, `cookie()`, `cookieEncrypted()`, `assertSession()`, `assertCookie()` |

`ControllerTestCase` and `testAction()` are still supported, and both kinds of
tests can be used in the same test suite. You can move the tests one by one, or
write only the new tests with `IntegrationTestTrait`.

Integration tests do not run JavaScript and do not render anything in a
browser. To test a user flow across several pages in a real browser, use
[E2E tests](/development/e2e-testing). Test the logic of models, behaviors and
libraries with unit tests.

### Migrating from testAction()

The same test written with `ControllerTestCase` and with
`IntegrationTestTrait`:

```php
// Before: ControllerTestCase
class ArticlesControllerTest extends ControllerTestCase
{
    public function testAdd(): void
    {
        $Articles = $this->generate('Articles', [
            'components' => ['Security' => ['_validatePost']],
        ]);
        $Articles->Security->expects($this->any())
            ->method('_validatePost')
            ->will($this->returnValue(true));

        $this->testAction('/articles/add', [
            'method' => 'post',
            'data' => ['Article' => ['title' => 'New article']],
        ]);

        $this->assertStringContainsString('/articles/view/', $this->headers['Location']);
    }
}
```

```php
// After: IntegrationTestTrait
class ArticlesControllerTest extends CakeTestCase
{
    use IntegrationTestTrait;

    public function testAdd(): void
    {
        $this->enableSecurityToken();

        $this->post('/articles/add', [
            'Article' => ['title' => 'New article'],
        ]);

        $this->assertRedirectContains('/articles/view/');
    }
}
```

The new test does not mock `SecurityComponent`: `enableSecurityToken()` adds
the tokens that a form built with `FormHelper` would post, so the token
validation of the application is tested as well.

## Setting Up

Use the trait in a test case. `CakeTestCase` is the usual base class, because
it loads the `$fixtures` and restores `Configure` after each test:

```php
// tests/TestCase/Controller/ArticlesControllerTest.php
class ArticlesControllerTest extends CakeTestCase
{
    use IntegrationTestTrait;

    /**
     * @var array<string>
     */
    public $fixtures = ['app.article', 'app.user'];

    public function testIndex(): void
    {
        $this->get('/articles');

        $this->assertResponseOk();
        $this->assertResponseContains('<h1>Articles</h1>');
    }
}
```

The classes are autoloaded with the Composer classmap of the framework, so
`App::uses('IntegrationTestTrait', 'TestSuite')` and
`App::uses('EmailTrait', 'TestSuite')` are optional.

Both application layouts work the same way; only the location of the tests
differs:

- **Modern layout** (`pieceofcake2/app`): put the tests in
  `tests/TestCase/Controller/` and the fixtures in `tests/Fixture/`, and run
  `vendor/bin/phpunit` or `bin/cake test app Controller/ArticlesController`.
- **Legacy layout** (`app/` directory): put the tests in
  `app/Test/Case/Controller/` and the fixtures in `app/Test/Fixture/`, and run
  `app/Console/cake test app Controller/ArticlesController`.

In both layouts the fixture `app.article` is the class `ArticleFixture`. See
[Test Case Conventions](/development/testing#test-case-conventions) and
[Running Tests](/development/testing#running-tests).

Requests use the routes of the application (`config/routes.php`, or
`app/Config/routes.php` in the legacy layout) and the settings of its
`core.php` (`Security.salt`, `Session`, `Exception.renderer`). URLs are
dispatched as if the application were installed at the document root:
`App.base` is empty unless you configure it.

The state of the trait (request settings, session data, the response) is
cleared after each test with an `@after` method, so you do not need to call
anything in `tearDown()`.

## Making Requests

Each request method dispatches one request and stores the response for the
assertions:

| Method | Description |
| --- | --- |
| `get($url)`, `delete($url)`, `head($url)`, `options($url)` | Dispatch a request without body data. |
| `post($url, $data = [])`, `put($url, $data = [])`, `patch($url, $data = [])` | Dispatch a request with data. An array becomes the request data (`$this->request->data`), a string the raw body (`$this->request->input()`). |
| `resolveUrl($url)` | Returns the string URL that is requested (`Router::url()` for a routing array). |

`$url` can be:

- a path with an optional query string, such as `/articles/view/1?page=2`;
- a full URL such as `https://example.com/articles`, which also sets the host
  and HTTPS;
- a routing array such as `['controller' => 'articles', 'action' => 'view', 1]`.

When the data is an array, scalar values are cast to strings, as in real form
data. Arrays that look like uploaded files (`name`, `type`, `tmp_name`,
`error`, `size`) are kept as they are.

```php
public function testEdit(): void
{
    $this->enableSecurityToken();

    $this->put(['controller' => 'articles', 'action' => 'edit', 1], [
        'Article' => ['id' => 1, 'title' => 'Changed'],
    ]);

    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);
}
```

## Setting Up the Request

Call these methods before the request. Everything they set is cleared after
each test.

| Method | Description |
| --- | --- |
| `configRequest(array $data)` | Merges request settings: `headers` (used for the next request only), `environment` (`$_SERVER` values such as `HTTP_REFERER` or `REMOTE_ADDR`), `cookies`, `files` (a `$_FILES` array) and `input` (the raw body). |
| `replaceRequest(array $data)` | Replaces the request settings. |
| `requestAsJson()` | Sets the `Accept` and `Content-Type` headers to `application/json`. |
| `session(array $data)` | Session data written before each following request. |
| `cookie(string $name, string $value)` | Adds a request cookie. `Name[key]` becomes `$_COOKIE['Name']['key']`. |
| `cookieEncrypted(string $name, array\|string $value, string\|false $encrypt = 'cipher', ?string $key = null)` | Adds a cookie encrypted like `CookieComponent` does. |
| `enableSecurityToken()` | Adds the `_Token` fields that `SecurityComponent` validates, and its CSRF token. |
| `setUnlockedFields(array $unlockedFields = [])` | Fields excluded from the `SecurityComponent` hash. |
| `enableCsrfToken()` | Adds only the CSRF token. |
| `enableRetainFlashMessages()` | Keeps the flash messages in the session after the view rendered them. |
| `disableErrorHandlerMiddleware()` | Throws exceptions to the test instead of rendering the error page. |

### Headers and the Environment

```php
public function testApiView(): void
{
    $this->configRequest([
        'headers' => ['Authorization' => 'Bearer secret-token'],
        'environment' => ['REMOTE_ADDR' => '192.0.2.1'],
    ]);
    $this->requestAsJson();

    $this->get('/api/articles/1.json');

    $this->assertResponseOk();
    $this->assertContentType('application/json');
}

public function testApiAdd(): void
{
    $this->requestAsJson();

    $this->post('/api/articles.json', json_encode(['title' => 'From the API']));

    $this->assertResponseCode(201);
    $this->assertHeaderContains('Location', '/api/articles/');
}
```

The `headers` setting applies to the next request only. The other settings
apply to every following request of the test.

### Session and Cookies

`session()` writes data to the session before each following request, for
example to log in a user:

```php
public function testAddRequiresAdmin(): void
{
    $this->session(['Auth' => ['User' => ['id' => 2, 'role' => 'author']]]);

    $this->get('/admin/articles/add');

    $this->assertResponseCode(403);
}
```

`$_SESSION` is kept between the requests of a test, so a test can log in with
one request and use the session in the next. It is cleared after each test.

`cookie()` adds a plain cookie. `cookieEncrypted()` adds a cookie in the format
of `CookieComponent`: the name is `CakeCookie[key]`, arrays are JSON encoded,
and the value is encrypted with the mode given in `$encrypt` (`'cipher'`,
`'aes'` or `'rijndael'`, or `false` for no encryption). The key defaults to
`Security.salt`. Pass the `type` you configured for `CookieComponent`:

```php
public function testRememberMeCookie(): void
{
    $this->cookieEncrypted('CakeCookie[remember]', ['id' => 1], 'aes');

    $this->get('/users/dashboard');

    $this->assertResponseOk();
}
```

### SecurityComponent and CSRF Tokens

`enableSecurityToken()` adds the `_Token` fields that `SecurityComponent`
validates (`fields`, `unlocked`, and `debug` in debug mode) and its CSRF token.
The fields are computed from the posted data, as `FormHelper::secure()` would
compute them for a form with exactly these fields. The tokens are added to
requests with data or with a method other than GET, HEAD and OPTIONS, unless
the data is a string.

Fields that the application unlocks, with `SecurityComponent::$unlockedFields`
or `FormHelper::unlockField()`, are not part of the hash. Pass the same fields
to `setUnlockedFields()`:

```php
public function testAddWithPreview(): void
{
    $this->session(['Auth' => ['User' => ['id' => 1, 'role' => 'admin']]]);
    $this->enableSecurityToken();
    // The controller sets $this->Security->unlockedFields = ['Article.preview'];
    $this->setUnlockedFields(['Article.preview']);

    $this->post('/articles/add', [
        'Article' => ['title' => 'Draft', 'preview' => '1'],
    ]);

    $this->assertResponseOk();
    $this->assertResponseContains('Preview: Draft');
}
```

`enableCsrfToken()` adds only the CSRF token (`_Token.key` in the data and in
the session). Use it for actions where `SecurityComponent::$validatePost` is
disabled but `csrfCheck` is enabled. `enableSecurityToken()` already includes
the CSRF token, so you do not need both.

### Flash Messages

A flash message is removed from the session when the view renders it. Call
`enableRetainFlashMessages()` before the request to keep the messages for
`assertFlashMessage()` and the other flash assertions:

```php
public function testAdd(): void
{
    $this->session(['Auth' => ['User' => ['id' => 1, 'role' => 'admin']]]);
    $this->enableSecurityToken();
    $this->enableRetainFlashMessages();

    $this->post('/articles/add', [
        'Article' => ['title' => 'New article', 'body' => 'Body'],
    ]);

    $this->assertRedirectContains('/articles/view/');
    $this->assertFlashMessage('The article has been saved.');
    $this->assertFlashElement('Flash/success');
}
```

### Exceptions

An exception thrown while the request is dispatched is rendered with the
configured `Exception.renderer` (`ExceptionRenderer` by default), as in
production, and the error page becomes the response:

```php
public function testViewMissing(): void
{
    $this->get('/articles/view/999');

    $this->assertResponseError();
    $this->assertResponseCode(404);
    $this->assertResponseContains('Article not found');
}
```

To get the exception in the test instead, call
`disableErrorHandlerMiddleware()`. The method keeps its CakePHP 5 name,
although CakePHP 2 has no middleware:

```php
public function testViewMissingThrows(): void
{
    $this->disableErrorHandlerMiddleware();
    $this->expectException(NotFoundException::class);

    $this->get('/articles/view/999');
}
```

Failed PHPUnit assertions inside the application, for example in a mock, are
always thrown to the test.

## Inspecting the Response

Besides the assertions, these give access to the result of the last request:

- `viewVariable(string $name)` returns a view variable, or `null` if it was not
  set.
- `$this->_response` is the `CakeResponse`.
- `$this->_controller` is the dispatched controller, or `null` if no controller
  was created (for example for an asset or a redirect route).
- `$this->_exception` is the exception thrown while dispatching, also when it
  was rendered as the error page.
- `$this->_viewName` and `$this->_layoutName` are the rendered view and layout
  files.

```php
public function testIndex(): void
{
    $this->get('/articles?page=2');

    $this->assertResponseOk();
    $this->assertCount(10, $this->viewVariable('articles'));
    $this->assertSame('Articles', $this->_controller->name);
}

public function testApiJson(): void
{
    $this->get('/api/articles/1.json');

    $data = json_decode((string)$this->_response->body(), true);
    $this->assertSame('First article', $data['article']['title']);
}
```

## Assertions

All assertions take a custom failure message as their last argument. When an
exception was rendered as the error page, its message and stack trace are
appended to the failure message.

| Area | Assertions |
| --- | --- |
| Status | `assertResponseOk()` (200-204), `assertResponseSuccess()` (200-308), `assertResponseError()` (400-429), `assertResponseFailure()` (500-505), `assertResponseCode(int $code)` |
| Redirect | `assertRedirect($url = null)`, `assertRedirectEquals($url = null)`, `assertRedirectContains(string $url)`, `assertRedirectNotContains(string $url)`, `assertRedirectBackToReferer(?int $code = null)`, `assertNoRedirect()` |
| Headers | `assertHeader(string $header, string $content)`, `assertHeaderContains(string $header, string $content)`, `assertHeaderNotContains(string $header, string $content)`, `assertContentType(string $type)` |
| Body | `assertResponseContains(string $content, string $message = '', bool $ignoreCase = false)`, `assertResponseNotContains(...)`, `assertResponseEquals($content)`, `assertResponseNotEquals($content)`, `assertResponseRegExp(string $pattern)`, `assertResponseNotRegExp(string $pattern)`, `assertResponseEmpty()`, `assertResponseNotEmpty()` |
| View | `assertTemplate(string $content)`, `assertLayout(string $content)` |
| Session | `assertSession($expected, string $path)`, `assertSessionHasKey(string $path)`, `assertSessionNotHasKey(string $path)` |
| Flash | `assertFlashMessage(string $expected, string $key = 'flash')`, `assertFlashMessageAt(int $at, ...)`, `assertFlashMessageContains(string $expected, string $key = 'flash', string $message = '', bool $ignoreCase = false)`, `assertFlashMessageContainsAt(int $at, ...)`, `assertFlashElement(string $expected, string $key = 'flash')`, `assertFlashElementAt(int $at, ...)` |
| Cookies | `assertCookie($expected, string $name)`, `assertCookieIsSet(string $name)`, `assertCookieNotSet(string $cookie)`, `assertCookieEncrypted($expected, string $name, string $encrypt = 'cipher', ?string $key = null)` |
| Files | `assertFileResponse(string $expected)` |

Notes on the arguments:

- Redirect URLs are compared as absolute URLs, and routing arrays are
  accepted. `assertRedirect()` without a URL only checks that there is a
  `Location` header.
- `assertContentType()` accepts a type alias such as `json` or a MIME type
  such as `application/json`.
- `assertTemplate()` and `assertLayout()` check a part of the path of the
  rendered file, for example `assertTemplate('Articles' . DS . 'index')`.
- Session paths are `Hash` paths, such as `Auth.User.id`.
- `assertFileResponse()` checks the file sent with `CakeResponse::file()`.

```php
public function testLogin(): void
{
    $this->enableSecurityToken();

    $this->post('/users/login', [
        'User' => ['username' => 'mark', 'password' => 'secret', 'remember' => '1'],
    ]);

    $this->assertRedirect('/');
    $this->assertSessionHasKey('Auth.User.id');
    $this->assertCookieEncrypted(['id' => 1], 'CakeCookie[remember]');
}

public function testDownload(): void
{
    $this->get('/articles/download/1');

    $this->assertFileResponse(WWW_ROOT . 'files' . DS . 'article-1.pdf');
    $this->assertHeaderContains('Content-Disposition', 'article-1.pdf');
}
```

## Testing Emails

`EmailTrait` makes every `CakeEmail` use `TestEmailTransport` during the test.
The transport sends nothing and records each email, and the `assertMail*()`
methods check the recorded emails. It works in integration tests and in any
other test case:

```php
class UsersControllerTest extends CakeTestCase
{
    use EmailTrait;
    use IntegrationTestTrait;

    /**
     * @var array<string>
     */
    public $fixtures = ['app.user'];

    public function testRegisterSendsWelcomeEmail(): void
    {
        $this->enableSecurityToken();

        $this->post('/users/register', [
            'User' => ['email' => 'alice@example.com', 'username' => 'alice'],
        ]);

        $this->assertRedirect(['controller' => 'users', 'action' => 'thanks']);
        $this->assertMailCount(1);
        $this->assertMailSentTo('alice@example.com');
        $this->assertMailSentFrom('noreply@example.com');
        $this->assertMailSubjectContains('Welcome');
        $this->assertMailContainsText('Hello alice');
        $this->assertMailContainsHtml('<strong>alice</strong>');
        $this->assertMailSentWith('both', 'emailFormat');
        $this->assertMailContainsAttachment('terms.pdf', ['mimetype' => 'application/pdf']);
    }
}
```

| Assertion | Description |
| --- | --- |
| `assertMailCount(int $count)`, `assertNoMailSent()` | The number of emails sent. |
| `assertMailSentTo(string $address)`, `assertMailSentFrom(array\|string $address)` | An email was sent to or from the address. |
| `assertMailContains(string $contents)`, `assertMailContainsText(string $expected)`, `assertMailContainsHtml(string $contents)` | The body, the text part or the HTML part contains the string. |
| `assertMailSubjectContains(string $contents)` | The subject (MIME-decoded) contains the string. |
| `assertMailSentWith(string $expected, string $parameter)` | A `CakeEmail` getter returns the value, for example `assertMailSentWith('both', 'emailFormat')`. |
| `assertMailContainsAttachment(string $filename, array $file = [])` | An attachment with this file name (and these settings) was sent. |
| `assertMailSentToAt()`, `assertMailSentFromAt()`, `assertMailSentWithAt()`, `assertMailContainsAt()`, `assertMailContainsTextAt()`, `assertMailContainsHtmlAt()`, `assertMailSubjectContainsAt()` | The same checks for one email; the first argument is the 0-based index `int $at`. |

All of them take a custom failure message as their last argument.

### TestEmailTransport and overrideTransport()

`TestEmailTransport` can also be used without `EmailTrait`:

- `TestEmailTransport::replaceAllTransports()` makes every `CakeEmail` use the
  test transport, and `TestEmailTransport::restoreTransports()` restores the
  configured transports.
- `TestEmailTransport::getMessages()` returns the sent `CakeEmail` objects, and
  `TestEmailTransport::clearMessages()` forgets them.
- `'transport' => 'TestEmail'` in an email configuration uses the transport
  for that configuration only.

`EmailTrait` calls `replaceAllTransports()` before each test and
`clearMessages()` and `restoreTransports()` after it.

`static` CakeEmail::**overrideTransport**($name)

Makes every `CakeEmail` instance, also the instances created earlier, use the
transport `$name` (for example `'TestEmail'` or `'Debug'`), regardless of its
own `transport` setting. Call it with `null` to go back to the configured
transports. `TestEmailTransport::replaceAllTransports()` and
`restoreTransports()` use this method.

## Mocking

Nothing is mocked by default, but you can still mock where it is needed, for
example a model method that calls an external service.
`getMockForModel()` registers the mock in `ClassRegistry`, and the dispatched
controller uses it:

```php
public function testPublishCallsApi(): void
{
    $Article = $this->getMockForModel('Article', ['callApi']);
    $Article->expects($this->once())
        ->method('callApi')
        ->willReturn(true);
    $this->enableSecurityToken();

    $this->post('/articles/publish/1');

    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);
}
```

## Differences from CakePHP 5

- **No middleware and no `Application` class.** Requests go through the
  `Dispatcher` (as `IntegrationTestDispatcher`), so dispatcher filters run.
  `useHttpServer()`, `ContainerStubTrait` and `TestSession` are not available.
- **`exit` is replaced.** CakePHP 2 sends the response and calls `exit` in
  `Controller::redirect()`, `AuthComponent`, `RequestHandlerComponent` (Ajax
  redirects), `AssetDispatcher` and redirect routes (`Router::redirect()`). In
  a test the response (`IntegrationTestResponse`) throws `IntegrationTestStop`
  instead of sending. This ends the request at the same point, and the response
  is captured.
- **Superglobals.** `CakeRequest`, `CookieComponent` and other classes read
  `$_GET`, `$_POST`, `$_FILES`, `$_COOKIE` and `$_SERVER`, so these are set
  while a request is dispatched and restored afterwards.
- **`SecurityComponent` instead of the FormProtection and CSRF middleware.**
  `enableSecurityToken()` also adds the CSRF token, because
  `SecurityComponent::$csrfCheck` is enabled by default. `enableCsrfToken()`
  has no `$cookieName` argument, because CakePHP 2 has no cookie-based CSRF
  tokens. Fields unlocked in the controller must also be passed to
  `setUnlockedFields()`.
- **Errors** are rendered with `Exception.renderer`.
  `disableErrorHandlerMiddleware()` keeps its CakePHP 5 name.
- **Flash messages** are read from the `Message` session key (CakePHP 5:
  `Flash`). The element names are those stored by CakePHP 2: `Flash/success`
  for `$this->Flash->success()`, and `default` for
  `SessionComponent::setFlash()`. An `$at` of `0` checks the first message
  (CakePHP 5 checks all of them).
- **Cookies** use the `CookieComponent` format: values are in
  `CakeCookie[...]` cookies, arrays are JSON encoded, and `cookieEncrypted()`
  and `assertCookieEncrypted()` default to the `cipher` mode of
  `CookieComponent` (CakePHP 5: `aes`).
- **Headers** are matched case-insensitively, and multiple values are joined
  with `, `. `Content-Type` is always available, with the charset that
  `CakeResponse::send()` would add.
- **Emails** are `CakeEmail` objects, read with the `CakeEmail` getters.
  Subjects are MIME-decoded before `assertMailSubjectContains()`.
  `assertMailContainsAttachment()` always requires the file name to match.
- **Not backported:** `assertRedirectBack()` (CakePHP 2 has no `url` request
  setting), flash assertions for a `Flash` session key, the `$cookieName`
  argument of `enableCsrfToken()` and `MiddlewareDispatcher`.
- **Class names.** CakePHP 2 has no namespaces, so the constraint classes have
  a `Constraint` suffix, such as `StatusOkConstraint` and
  `MailCountConstraint`.
- **Uploaded files** passed in the data or with
  `configRequest(['files' => ...])` are not real uploads:
  `is_uploaded_file()` and `move_uploaded_file()` return `false` for them.

## Tips and Troubleshooting

- **Code after `redirect()` does not run.** `IntegrationTestStop` ends the
  request where `exit` would end it in production, so the code after the
  `redirect()` call and `afterFilter()` do not run, in the test as in
  production. Use `assertRedirect()` to check the redirect.
- **The flash assertions fail although the message is shown.** The view
  removed the message from the session when it rendered it. Call
  `enableRetainFlashMessages()` before the request.
- **`assertFlashMessage()` does not find a message.** The flash messages are
  stored under the `Message` session key, and the default `$key` is `flash`.
  Pass the key that the controller used, for example `'auth'` for
  `AuthComponent` messages.
- **A POST request is blackholed (400).** The action is protected by
  `SecurityComponent`. Call `enableSecurityToken()`, and pass the fields that
  the controller unlocks to `setUnlockedFields()`. Post exactly the fields the
  form would post.
- **A test passes alone but fails in the suite.** The superglobals are
  restored after each request and `$_SESSION` is cleared after each test, but
  `Configure` is restored only by `CakeTestCase`. Use `CakeTestCase` as the
  base class, and do not change other static state in a test without
  restoring it.
- **An exception is hidden behind a 500 page.** The failure message of the
  assertions includes the message and the stack trace of the rendered
  exception. To get the exception itself, call
  `disableErrorHandlerMiddleware()`.
- **A URL is not found.** Requests are dispatched as if the application were at
  the document root, with the routes of the application. Check the URL with
  `resolveUrl()`, and use routing arrays to follow route changes.
