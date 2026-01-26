# Security

`class` **SecurityComponent**(ComponentCollection $collection, array $settings = array())

The Security Component creates an easy way to integrate tighter
security in your application. It provides methods for various tasks like:

- Restricting which HTTP methods your application accepts.
- CSRF protection.
- Form tampering protection
- Requiring that SSL be used.
- Limiting cross controller communication.

Like all components it is configured through several configurable parameters.
All of these properties can be set directly or through setter methods of the
same name in your controller's beforeFilter.

By using the Security Component you automatically get [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) and form tampering
protection. Hidden token fields will automatically be inserted into forms and
checked by the Security component. Among other things, a form submission will
not be accepted after a certain period of inactivity, which is controlled by the
`csrfExpires` time.

If you are using Security component's form protection features and other
components that process form data in their `startup()` callbacks, be sure to
place Security Component before those components in your `$components` array.

> [!NOTE]
> When using the Security Component you **must** use the FormHelper to create
> your forms. In addition, you must **not** override any of the fields' "name"
> attributes. The Security Component looks for certain indicators that are
> created and managed by the FormHelper (especially those created in
> `~FormHelper::create()` and `~FormHelper::end()`).
> Dynamically altering the fields that are submitted in a POST request (e.g.
> disabling, deleting or creating new fields via JavaScript) is likely to
> trigger a black-holing of the request. See the `$validatePost` or
> `$disabledFields` configuration parameters.

## Handling blackhole callbacks

If an action is restricted by the Security Component it is
black-holed as an invalid request which will result in a 400 error
by default. You can configure this behavior by setting the
`$this->Security->blackHoleCallback` property to a callback function
in the controller.

`method` SecurityComponent::**blackHole**(object $controller, string $error)

## Restricting HTTP methods

`method` SecurityComponent::**requirePost**()

`method` SecurityComponent::**requireGet**()

`method` SecurityComponent::**requirePut**()

`method` SecurityComponent::**requireDelete**()

## Restrict actions to SSL

`method` SecurityComponent::**requireSecure**()

`method` SecurityComponent::**requireAuth**()

## Restricting cross controller communication

> A list of controllers which can send requests
> to this controller.
> This can be used to control cross controller requests.
>
> A list of actions which are allowed to send requests
> to this controller's actions.
> This can be used to control cross controller requests.

## Form tampering prevention

By default the `SecurityComponent` prevents users from tampering with forms in
specific ways. The `SecurityComponent` will prevent the following things:

- Unknown fields cannot be added to the form.
- Fields cannot be removed from the form.
- Values in hidden inputs cannot be modified.

Preventing these types of tampering is accomplished by working with the FormHelper
and tracking which fields are in a form. The values for hidden fields are
tracked as well. All of this data is combined and turned into a hash. When
a form is submitted, the `SecurityComponent` will use the POST data to build the same
structure and compare the hash.

> [!NOTE]
> The SecurityComponent will **not** prevent select options from being
> added/changed. Nor will it prevent radio options from being added/changed.
>
> Set to a list of form fields to exclude from POST validation. Fields can be
> unlocked either in the Component, or with
> `FormHelper::unlockField()`. Fields that have been unlocked are
> not required to be part of the POST and hidden unlocked fields do not have
> their values checked.
>
> Set to `false` to completely skip the validation of POST
> requests, essentially turning off form validation.

## CSRF configuration

> Whether to use CSRF protected forms. Set to `false` to disable
> CSRF protection on forms.
>
> The duration from when a CSRF token is created that it will expire on.
> Each form/page request will generate a new token that can only
> be submitted once unless it expires. Can be any value compatible
> with `strtotime()`. The default is +30 minutes.
>
> Controls whether or not CSRF tokens are single use. Set to
> `false` to not generate new tokens on each request. One token
> will be reused until it expires. This reduces the chances of
> users getting invalid requests because of token consumption.
> It has the side effect of making CSRF less secure, as tokens are reusable.

## Usage

Using the security component is generally done in the controllers
`beforeFilter()`. You would specify the security restrictions you
want and the Security Component will enforce them on its startup:

``` php
class WidgetController extends AppController {

    public $components = array('Security');

    public function beforeFilter() {
        $this->Security->requirePost('delete');
    }
}
```

In this example the delete action can only be successfully
triggered if it receives a POST request:

``` php
class WidgetController extends AppController {

    public $components = array('Security');

    public function beforeFilter() {
        if (isset($this->request->params['admin'])) {
            $this->Security->requireSecure();
        }
    }
}
```

This example would force all actions that had admin routing to
require secure SSL requests:

``` php
class WidgetController extends AppController {

    public $components = array('Security');

    public function beforeFilter() {
        if (isset($this->params['admin'])) {
            $this->Security->blackHoleCallback = 'forceSSL';
            $this->Security->requireSecure();
        }
    }

    public function forceSSL() {
        return $this->redirect('https://' . env('SERVER_NAME') . $this->here);
    }
}
```

This example would force all actions that had admin routing to
require SSL requests. When the request is black holed, it
will call the nominated `forceSSL()` callback which will redirect
non-secure requests to secure requests automatically.

<a id="security-csrf"></a>

## CSRF protection

CSRF or Cross Site Request Forgery is a common vulnerability in web
applications. It allows an attacker to capture and replay a previous request,
and sometimes submit data requests using image tags or resources on other
domains.

Double submission and replay attacks are handled by the `SecurityComponent` CSRF
features. They work by adding a special token to each form request. This token,
once used, cannot be used again. If an attempt is made to re-use an expired
token the request will be blackholed.

### Using CSRF protection

Simply by adding the `SecurityComponent` to your components array,
you can benefit from the CSRF protection it provides. By default CSRF tokens are
valid for 30 minutes and expire on use. You can control how long tokens last by setting
csrfExpires on the component. :

``` php
public $components = array(
    'Security' => array(
        'csrfExpires' => '+1 hour'
    )
);
```

You can also set this property in your controller's `beforeFilter`:

``` php
public function beforeFilter() {
    $this->Security->csrfExpires = '+1 hour';
    // ...
}
```

The csrfExpires property can be any value that is compatible with
[strtotime()](https://www.php.net/manual/en/function.strtotime.php). By default the
`FormHelper` will add a `data[_Token][key]` containing the CSRF
token to every form when the component is enabled.

### Handling missing or expired tokens

Missing or expired tokens are handled similar to other security violations. The
`SecurityComponent` `blackHoleCallback` will be called with a 'csrf' parameter.
This helps you filter out CSRF token failures, from other warnings.

### Using per-session tokens instead of one-time use tokens

By default a new CSRF token is generated for each request, and each token can
only be used once. If a token is used twice, the request will be blackholed. Sometimes,
this behaviour is not desirable, as it can create issues with single page
applications. You can toggle on longer, multi-use tokens by setting
`csrfUseOnce` to `false`. This can be done in the components array, or in
the `beforeFilter` of your controller:

``` php
public $components = array(
    'Security' => array(
        'csrfUseOnce' => false
    )
);
```

This will tell the component that you want to re-use a CSRF token until it
expires - which is controlled by the `csrfExpires` value. If you are having
issues with expired tokens, this is a good balance between security and ease of
use.

### Disabling the CSRF protection

There may be cases where you want to disable CSRF protection on your forms for
some reason. If you do want to disable this feature, you can set
`$this->Security->csrfCheck = false;` in your `beforeFilter` or use the
components array. By default CSRF protection is enabled, and configured to use
one-use tokens.

## Disabling CSRF and Post Data Validation For Specific Actions

There may be cases where you want to disable all security checks for an action (ex. AJAX requests).
You may "unlock" these actions by listing them in `$this->Security->unlockedActions` in your
`beforeFilter`. The `unlockedActions` property will **not** effect other
features of `SecurityComponent`.

::: info Added in version 2.3
:::
