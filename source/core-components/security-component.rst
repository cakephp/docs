5.6 Security Component
----------------------

The Security Component creates an easy way to integrate tighter
security in your application. An interface for managing
HTTP-authenticated requests can be created with Security Component.
It is configured in the beforeFilter() of your controllers. It has
several configurable parameters. All of these properties can be set
directly or through setter methods of the same name.

If an action is restricted using the Security Component it is
black-holed as an invalid request which will result in a 404 error
by default. You can configure this behavior by setting the
$this->Security->blackHoleCallback property to a callback function
in the controller. Keep in mind that black holes from all of the
Security Component's methods will be run through this callback
method.

By using the Security Component you automatically get
`CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
and form tampering protection. Hidden token fields will
automatically be inserted into forms and checked by the Security
component. Among other things, a form submission will not be
accepted after a certain period of inactivity, which depends on the
setting of ``Security.level``. On 'high', this timeout is as short
as 10 minutes. Other token fields include a randomly generated
nonce (one-time id) and a hash of fields which (and only which)
must be present in the submitted POST data.

If you are using Security component's form protection features and
other components that process form data in their ``startup()``
callbacks, be sure to place Security Component before those
components in your ``$components`` array.

When using the Security Component you **must** use the FormHelper
to create your forms. The Security Component looks for certain
indicators that are created and managed by the FormHelper
(especially those created in create() and end()). Dynamically
altering the fields that are submitted in a POST request (e.g.
disabling, deleting or creating new fields via JavaScript) is
likely to trigger a black-holing of the request. See the
``$validatePost`` or ``$disabledFields`` configuration parameters.

5.6 Security Component
----------------------

The Security Component creates an easy way to integrate tighter
security in your application. An interface for managing
HTTP-authenticated requests can be created with Security Component.
It is configured in the beforeFilter() of your controllers. It has
several configurable parameters. All of these properties can be set
directly or through setter methods of the same name.

If an action is restricted using the Security Component it is
black-holed as an invalid request which will result in a 404 error
by default. You can configure this behavior by setting the
$this->Security->blackHoleCallback property to a callback function
in the controller. Keep in mind that black holes from all of the
Security Component's methods will be run through this callback
method.

By using the Security Component you automatically get
`CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
and form tampering protection. Hidden token fields will
automatically be inserted into forms and checked by the Security
component. Among other things, a form submission will not be
accepted after a certain period of inactivity, which depends on the
setting of ``Security.level``. On 'high', this timeout is as short
as 10 minutes. Other token fields include a randomly generated
nonce (one-time id) and a hash of fields which (and only which)
must be present in the submitted POST data.

If you are using Security component's form protection features and
other components that process form data in their ``startup()``
callbacks, be sure to place Security Component before those
components in your ``$components`` array.

When using the Security Component you **must** use the FormHelper
to create your forms. The Security Component looks for certain
indicators that are created and managed by the FormHelper
(especially those created in create() and end()). Dynamically
altering the fields that are submitted in a POST request (e.g.
disabling, deleting or creating new fields via JavaScript) is
likely to trigger a black-holing of the request. See the
``$validatePost`` or ``$disabledFields`` configuration parameters.
