Cross Site Request Forgery
##########################

By enabling the CSRF Component you get protection against attacks. `CSRF
<http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ or Cross Site
Request Forgery is a common vulnerability in web applications. It allows an
attacker to capture and replay a previous request, and sometimes submit data
requests using image tags or resources on other domains.

The CsrfComponent works by setting a cookie to the user's browser. When forms
are created with the :php:class:`Cake\\View\\Helper\\FormHelper`, a hidden field
is added containing the CSRF token. During the ``Controller.startup`` event, if
the request is a POST, PUT, DELETE, PATCH request the component will compare the
request data & cookie value. If either is missing or the two values mismatch the
component will throw a
:php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException`.

.. note::
    You should always verify the HTTP method being used before executing
    side-effects. You should :ref:`check the HTTP method <check-the-request>` or
    use :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` to ensure the correct
    HTTP method is used.

.. versionadded:: 3.1

    The exception type changed from
    :php:class:`Cake\\Network\\Exception\\ForbiddenException` to
    :php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException`.

Using the CsrfComponent
=======================

Simply by adding the ``CsrfComponent`` to your components array,
you can benefit from the CSRF protection it provides::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
    }

Settings can be passed into the component through your component's settings.
The available configuration options are:

- ``cookieName`` The name of the cookie to send. Defaults to ``csrfToken``.
- ``expiry`` How long the CSRF token should last. Defaults to browser session.
  Accepts ``strtotime`` values as of 3.1
- ``secure`` Whether or not the cookie will be set with the Secure flag. That is,
  the cookie will only be set on a HTTPS connection and any attempt over normal HTTP
  will fail. Defaults to ``false``.
- ``field`` The form field to check. Defaults to ``_csrfToken``. Changing this
  will also require configuring FormHelper.

When enabled, you can access the current CSRF token on the request object::

    $token = $this->request->getParam('_csrfToken');

Integration with FormHelper
===========================

The CsrfComponent integrates seamlessly with ``FormHelper``. Each time you
create a form with FormHelper, it will insert a hidden field containing the CSRF
token.

.. note::

    When using the CsrfComponent you should always start your forms with the
    FormHelper. If you do not, you will need to manually create hidden inputs in
    each of your forms.

CSRF Protection and AJAX Requests
=================================

In addition to request data parameters, CSRF tokens can be submitted through
a special ``X-CSRF-Token`` header. Using a header often makes it easier to
integrate a CSRF token with JavaScript heavy applications, or XML/JSON based API
endpoints.

Disabling the CSRF Component for Specific Actions
=================================================

While not recommended, you may want to disable the CsrfComponent on certain
requests. You can do this using the controller's event dispatcher, during the
``beforeFilter()`` method::

    public function beforeFilter(Event $event)
    {
        $this->eventManager()->off($this->Csrf);
    }

.. meta::
    :title lang=en: Csrf
    :keywords lang=en: configurable parameters,security component,configuration parameters,invalid request,csrf,submission
