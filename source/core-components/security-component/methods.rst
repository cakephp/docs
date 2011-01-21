5.6.2 Methods
-------------

requirePost()
~~~~~~~~~~~~~

Sets the actions that require a POST request. Takes any number of
arguments. Can be called with no arguments to force all actions to
require a POST.

requireSecure()
~~~~~~~~~~~~~~~

Sets the actions that require a SSL-secured request. Takes any
number of arguments. Can be called with no arguments to force all
actions to require a SSL-secured.

requireAuth()
~~~~~~~~~~~~~

Sets the actions that require a valid Security Component generated
token. Takes any number of arguments. Can be called with no
arguments to force all actions to require a valid authentication.

requireLogin()
~~~~~~~~~~~~~~

Sets the actions that require a valid HTTP-Authenticated request.
Takes any number of arguments. Can be called with no arguments to
force all actions to require valid HTTP-authentication.

loginCredentials(string $type)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Attempt to validate login credentials for a HTTP-authenticated
request. $type is the type of HTTP-Authentication you want to
check. Either 'basic', or 'digest'. If left null/empty both will be
tried. Returns an array with login name and password if
successful.

loginRequest(array $options)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Generates the text for an HTTP-Authenticate request header from an
array of $options.

$options generally contains a 'type', 'realm' . Type indicate which
HTTP-Authenticate method to use. Realm defaults to the current HTTP
server environment.

parseDigestAuthData(string $digest)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Parse an HTTP digest authentication request. Returns and array of
digest data as an associative array if succesful, and null on
failure.

generateDigestResponseHash(array $data)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a hash that to be compared with an HTTP
digest-authenticated response. $data should be an array created by
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Black-hole an invalid request with a 404 error or a custom
callback. With no callback, the request will be exited. If a
controller callback is set to SecurityComponent::blackHoleCallback,
it will be called and passed any error information.

5.6.2 Methods
-------------

requirePost()
~~~~~~~~~~~~~

Sets the actions that require a POST request. Takes any number of
arguments. Can be called with no arguments to force all actions to
require a POST.

requireSecure()
~~~~~~~~~~~~~~~

Sets the actions that require a SSL-secured request. Takes any
number of arguments. Can be called with no arguments to force all
actions to require a SSL-secured.

requireAuth()
~~~~~~~~~~~~~

Sets the actions that require a valid Security Component generated
token. Takes any number of arguments. Can be called with no
arguments to force all actions to require a valid authentication.

requireLogin()
~~~~~~~~~~~~~~

Sets the actions that require a valid HTTP-Authenticated request.
Takes any number of arguments. Can be called with no arguments to
force all actions to require valid HTTP-authentication.

loginCredentials(string $type)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Attempt to validate login credentials for a HTTP-authenticated
request. $type is the type of HTTP-Authentication you want to
check. Either 'basic', or 'digest'. If left null/empty both will be
tried. Returns an array with login name and password if
successful.

loginRequest(array $options)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Generates the text for an HTTP-Authenticate request header from an
array of $options.

$options generally contains a 'type', 'realm' . Type indicate which
HTTP-Authenticate method to use. Realm defaults to the current HTTP
server environment.

parseDigestAuthData(string $digest)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Parse an HTTP digest authentication request. Returns and array of
digest data as an associative array if succesful, and null on
failure.

generateDigestResponseHash(array $data)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a hash that to be compared with an HTTP
digest-authenticated response. $data should be an array created by
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Black-hole an invalid request with a 404 error or a custom
callback. With no callback, the request will be exited. If a
controller callback is set to SecurityComponent::blackHoleCallback,
it will be called and passed any error information.
