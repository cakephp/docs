Authentication
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Identifying, authenticating, and authorizing users is a common part of
almost every web application. In CakePHP AuthComponent provides a
pluggable way to do these tasks. AuthComponent allows you to combine
authentication objects and authorization objects to create flexible
ways of identifying and checking user authorization.

.. _authentication-objects:

Suggested Reading Before Continuing
===================================

Configuring authentication requires several steps including defining
a users table, creating a model, controller & views, etc.

This is all covered step by step in the
:doc:`Blog Tutorial </tutorials-and-examples/blog-auth-example/auth>`.


Authentication
==============

Authentication is the process of identifying users by provided
credentials and ensuring that users are who they say they are.
Generally this is done through a username and password, that are checked
against a known list of users. In CakePHP, there are several built-in
ways of authenticating users stored in your application.

* ``FormAuthenticate`` allows you to authenticate users based on form POST
  data. Usually this is a login form that users enter information into.
* ``BasicAuthenticate`` allows you to authenticate users using Basic HTTP
  authentication.
* ``DigestAuthenticate`` allows you to authenticate users using Digest
  HTTP authentication.

By default ``AuthComponent`` uses ``FormAuthenticate``.

Choosing an Authentication Type
-------------------------------

Generally you'll want to offer form based authentication. It is the easiest for
users using a web-browser to use. If you are building an API or webservice, you
may want to consider basic authentication or digest authentication. The key
differences between digest and basic authentication are mostly related to how
passwords are handled. In basic authentication, the username and password are
transmitted as plain-text to the server. This makes basic authentication
un-suitable for applications without SSL, as you would end up exposing sensitive
passwords. Digest authentication uses a digest hash of the username, password,
and a few other details. This makes digest authentication more appropriate for
applications without SSL encryption.

You can also use authentication systems like openid as well; however, openid is
not part of CakePHP core.

Configuring Authentication Handlers
-----------------------------------

You configure authentication handlers using the ``authenticate`` config.
You can configure one or many handlers for authentication. Using
multiple handlers allows you to support different ways of logging users
in. When logging users in, authentication handlers are checked in the
order they are declared. Once one handler is able to identify the user,
no other handlers will be checked. Conversely you can halt all
authentication by throwing an exception. You will need to catch any
thrown exceptions and handle them as needed.

You can configure authentication handlers in your controller's
``beforeFilter()`` or ``initialize()`` methods. You can pass
configuration information into each authentication object using an
array::

    // Simple setup
    $this->Auth->config('authenticate', ['Form']);

    // Pass settings in
    $this->Auth->config('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

In the second example you'll notice that we had to declare the
``userModel`` key twice. To help you keep your code DRY, you can use the
``all`` key. This special key allows you to set settings that are passed
to every attached object. The all key is also exposed as
``AuthComponent::ALL``::

    // Pass settings in using 'all'
    $this->Auth->config('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

In the above example, both ``Form`` and ``Basic`` will get the settings
defined for the 'all' key. Any settings passed to a specific
authentication object will override the matching key in the 'all' key.
The core authentication objects support the following configuration
keys.

- ``fields`` The fields to use to identify a user by. You can use keys
  ``username`` and ``password`` to specify your username and password fields
  respectively.
- ``userModel`` The model name of the users table; defaults to Users.
- ``finder`` The finder method to use to fetch a user record. Defaults to 'all'.
- ``passwordHasher`` Password hasher class; Defaults to ``Default``.
- The ``scope`` and ``contain`` options have been deprecated as of 3.1. Use
  a custom finder instead to modify the query to fetch a user record.
- The ``userFields`` option has been deprecated as of 3.1. Use ``select()`` in 
  your custom finder.

To configure different fields for user in your ``initialize()`` method::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email', 'password' => 'passwd']
                ]
            ]
        ]);
    }

Do not put other ``Auth`` configuration keys, such as ``authError``, ``loginAction``, etc.,
within the ``authenticate`` or ``Form`` element. They should be at the same level as
the authenticate key. The setup above with other Auth configuration
should look like::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authError' => 'Did you really think you are allowed to see that?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ],
            'storage' => 'Session'
        ]);
    }

In addition to the common configuration, Basic authentication supports
the following keys:

- ``realm`` The realm being authenticated. Defaults to ``env('SERVER_NAME')``.

In addition to the common configuration Digest authentication supports
the following keys:

- ``realm`` The realm authentication is for. Defaults to the servername.
- ``nonce`` A nonce used for authentication. Defaults to ``uniqid()``.
- ``qop`` Defaults to auth; no other values are supported at this time.
- ``opaque`` A string that must be returned unchanged by clients. Defaults
  to ``md5($config['realm'])``.

Customizing Find Query
----------------------

You can customize the query used to fetch the user record using the ``finder``
option in authenticate class config::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth'
                ]
            ],
        ]);
    }

This will require your ``UsersTable`` to have finder method ``findAuth()``.
In the example shown below the query is modified to fetch only required fields
and add condition. You must ensure that you select the fields you need to 
authenticate a user, such as ``username`` and ``password``::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

.. note::
    ``finder`` option is available since 3.1. Prior to that you can use ``scope``
    and ``contain`` options to modify query.

Identifying Users and Logging Them In
-------------------------------------

.. php:method:: identify()

You need to manually call ``$this->Auth->identify()`` to identify the user using
credentials provided in request. Then use ``$this->Auth->setUser()``
to log the user in, i.e., save user info to session.

When authenticating users, attached authentication objects are checked
in the order they are attached. Once one of the objects can identify
the user, no other objects are checked. A sample login function for
working with a login form could look like::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__('Username or password is incorrect'), [
                    'key' => 'auth'
                ]);
            }
        }
    }

The above code will attempt to first identify a user by using the POST data.
If successful we set the user info to the session so that it persists across requests
and then redirect to either the last page they were visiting or a URL specified in the
``loginRedirect`` config. If the login is unsuccessful, a flash message is set.

.. warning::

    ``$this->Auth->setUser($data)`` will log the user in with whatever data is
    passed to the method. It won't actually check the credentials against an
    authentication class.

Redirecting Users After Login
-----------------------------

.. php:method:: redirectUrl

After logging a user in, you'll generally want to redirect them back to where
they came from. Pass a URL in to set the destination a user should be redirected
to upon logging in.

If no parameter is passed, it gets the authentication redirect URL. The URL
returned is as per following rules:

- Returns the normalized URL from the ``redirect`` query string value if it is
  present and for the same domain the current app is running on. Before 3.4.0,
  the ``Auth.redirect`` session value was used.
- If there is no query string/session value and there is a config
  ``loginRedirect``, the ``loginRedirect`` value is returned.
- If there is no redirect value and no ``loginRedirect``, / is returned.


Creating Stateless Authentication Systems
-----------------------------------------

Basic and digest are stateless authentication schemes and don't require an
initial POST or a form. If using only basic / digest authenticators you don't
require a login action in your controller. Stateless authentication will
re-verify the user's credentials on each request, this creates a small amount of
additional overhead, but allows clients to login without using cookies and
makes AuthComponent more suitable for building APIs.

For stateless authenticators the ``storage`` config should be set to ``Memory``
so that AuthComponent does not use session to store user record. You may also
want to set config ``unauthorizedRedirect`` to ``false`` so that AuthComponent
throws a ``ForbiddenException`` instead of default behavior of redirecting to
referrer.

Authentication objects can implement a ``getUser()`` method that can be used to
support user login systems that don't rely on cookies. A typical getUser method
looks at the request/environment and uses the information there to confirm the
identity of the user. HTTP Basic authentication for example uses
``$_SERVER['PHP_AUTH_USER']`` and ``$_SERVER['PHP_AUTH_PW']`` for the username
and password fields.

.. note::

    In case authentication does not work like expected, check if queries
    are executed at all (see ``BaseAuthenticate::_query($username)``).
    In case no queries are executed check if ``$_SERVER['PHP_AUTH_USER']``
    and ``$_SERVER['PHP_AUTH_PW']`` do get populated by the webserver.
    If you are using Apache with FastCGI-PHP you might need to add this line
    to your **.htaccess** file in webroot::

        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

On each request, these values, ``PHP_AUTH_USER`` and ``PHP_AUTH_PW``, are used to
re-identify the user and ensure they are valid user. As with authentication
object's ``authenticate()`` method, the ``getUser()`` method should return
an array of user information on success or ``false`` on failure. ::

    public function getUser(Request $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

The above is how you could implement getUser method for HTTP basic
authentication. The ``_findUser()`` method is part of ``BaseAuthenticate``
and identifies a user based on a username and password.

.. _basic-authentication:

Using Basic Authentication
--------------------------

Basic authentication allows you to create a stateless authentication that can be
used in intranet applications or for simple API scenarios. Basic authentication
credentials will be rechecked on each request.

.. warning::
    Basic authentication transmits credentials in plain-text. You should use
    HTTPS when using Basic authentication.


To use basic authentication, you'll need to configure AuthComponent::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Basic' => [
                'fields' => ['username' => 'username', 'password' => 'api_key'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Here we're using username + API key as our fields, and use the Users model.

Creating API Keys for Basic Authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because basic HTTP sends credentials in plain-text, it is unwise to have users
send their login password. Instead an opaque API key is generally used. You can
generate these API tokens randomly using libraries from CakePHP::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->data['entity'];

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // Generate an API 'token'
                $entity->api_key_plain = sha1(Text::uuid());

                // Bcrypt the token so BasicAuthenticate can check
                // it during login.
                $entity->api_key = $hasher->hash($entity->api_key_plain);
            }
            return true;
        }
    }

The above generates a random hash for each user as they are saved. The above
code assumes you have two columns ``api_key`` - to store the hashed API key, and
``api_key_plain`` - to the plaintext version of the API key, so we can display
it to the user later on. Using a key instead of a password, means that even over
plain HTTP, your users can use an opaque token instead of their original
password. It is also wise to include logic allowing API keys to be regenerated
at a user's request.

Using Digest Authentication
---------------------------

Digest authentication offers an improved security model over basic
authentication, as the user's credentials are never sent in the request header.
Instead a hash is sent.

To use digest authentication, you'll need to configure AuthComponent::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Digest' => [
                'fields' => ['username' => 'username', 'password' => 'digest_hash'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Here we're using username + digest_hash as our fields, and use the Users model.


Hashing Passwords For Digest Authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because Digest authentication requires a password hashed in the format
defined by the RFC, in order to correctly hash a password for use with
Digest authentication you should use the special password hashing
function on ``DigestAuthenticate``. If you are going to be combining
digest authentication with any other authentication strategies, it's also
recommended that you store the digest password in a separate column,
from the normal password hash::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->data['entity'];

            // Make a password for digest auth.
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

Passwords for digest authentication need a bit more information than
other password hashes, based on the RFC for digest authentication.

.. note::

    The third parameter of DigestAuthenticate::password() must match the
    'realm' config value defined when DigestAuthentication was
    configured in AuthComponent::$authenticate. This defaults to
    ``env('SCRIPT_NAME')``. You may wish to use a static string if you
    want consistent hashes in multiple environments.


Creating Custom Authentication Objects
--------------------------------------

Because authentication objects are pluggable, you can create custom
authentication objects in your application or plugins. If for example
you wanted to create an OpenID authentication object. In
**src/Auth/OpenidAuthenticate.php** you could put the following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Network\Request;
    use Cake\Network\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(Request $request, Response $response)
        {
            // Do things for OpenID here.
            // Return an array of user if they could authenticate the user,
            // return false if not.
        }
    }

Authentication objects should return ``false`` if they cannot identify the
user and an array of user information if they can. It's not required
that you extend ``BaseAuthenticate``, only that your authentication object
implements ``Cake\Event\EventListenerInterface``. The ``BaseAuthenticate`` class
provides a number of helpful methods that are commonly used. You can
also implement a ``getUser()`` method if your authentication object needs
to support stateless or cookie-less authentication. See the sections on
basic and digest authentication below for more information.

``AuthComponent`` triggers two events, ``Auth.afterIdentify`` and ``Auth.logout``,
after a user has been identified and before a user is logged out respectively.
You can set callback functions for these events by returning a mapping array
from ``implementedEvents()`` method of your authenticate class::

    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterIdentify',
            'Auth.logout' => 'logout'
        ];
    }


Using Custom Authentication Objects
-----------------------------------

Once you've created your custom authentication object, you can use them
by including them in AuthComponents authenticate array::

    $this->Auth->config('authenticate', [
        'Openid', // app authentication object.
        'AuthBag.Openid', // plugin authentication object.
    ]);

.. note::
    Note that when using simple notation there's no 'Authenticate' word when
    initiating the authentication object. Instead, if using namespaces, you'll need
    to set the full namespace of the class, including the 'Authenticate' word.

Handling Unauthenticated Requests
---------------------------------

When an unauthenticated user tries to access a protected page first the
``unauthenticated()`` method of the last authenticator in the chain is called.
The authenticate object can handle sending response or redirection by returning
a response object to indicate no further action is necessary. Due to this, the
order in which you specify the authentication provider in ``authenticate``
config matters.

If authenticator returns null, AuthComponent redirects user to login action.
If it's an AJAX request and config ``ajaxLogin`` is specified that element
is rendered else a 403 HTTP status code is returned.

Displaying Auth Related Flash Messages
--------------------------------------

In order to display the session error messages that Auth generates, you
need to add the following code to your layout. Add the following two
lines to the **src/Template/Layout/default.ctp** file in the body section::

    echo $this->Flash->render();
    echo $this->Flash->render('auth');

You can customize the error messages and flash settings AuthComponent
uses. Using ``flash`` config you can configure the parameters
AuthComponent uses for setting flash messages. The available keys are

- ``key`` - The key to use, defaults to 'auth'.
- ``params`` - The array of additional params to use, defaults to [].

In addition to the flash message settings you can customize other error
messages AuthComponent uses. In your controller's beforeFilter, or
component settings you can use ``authError`` to customize the error used
for when authorization fails::

    $this->Auth->config('authError', "Woopsie, you are not authorized to access this area.");

Sometimes, you want to display the authorization error only after
the user has already logged-in. You can suppress this message by setting
its value to boolean ``false``.

In your controller's beforeFilter() or component settings::

    if (!$this->Auth->user()) {
        $this->Auth->config('authError', false);
    }

.. _hashing-passwords:

Hashing Passwords
-----------------

You are responsible for hashing the passwords before they are persisted to the
database, the easiest way is to use a setter function in your User entity::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
              return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

AuthComponent is configured by default to use the ``DefaultPasswordHasher``
when validating user credentials so no additional configuration is required in
order to authenticate users.

``DefaultPasswordHasher`` uses the bcrypt hashing algorithm internally, which
is one of the stronger password hashing solutions used in the industry. While it
is recommended that you use this password hasher class, the case may be that you
are managing a database of users whose password was hashed differently.

Creating Custom Password Hasher Classes
---------------------------------------

In order to use a different password hasher, you need to create the class in
**src/Auth/LegacyPasswordHasher.php** and implement the
``hash()`` and ``check()`` methods. This class needs to extend the
``AbstractPasswordHasher`` class::

    namespace App\Auth;

    use Cake\Auth\AbstractPasswordHasher;

    class LegacyPasswordHasher extends AbstractPasswordHasher
    {

        public function hash($password)
        {
            return sha1($password);
        }

        public function check($password, $hashedPassword)
        {
            return sha1($password) === $hashedPassword;
        }
    }

Then you are required to configure the AuthComponent to use your own password
hasher::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Legacy',
                    ]
                ]
            ]
        ]);
    }

Supporting legacy systems is a good idea, but it is even better to keep your
database with the latest security advancements. The following section will
explain how to migrate from one hashing algorithm to CakePHP's default.

Changing Hashing Algorithms
---------------------------

CakePHP provides a clean way to migrate your users' passwords from one algorithm
to another, this is achieved through the ``FallbackPasswordHasher`` class.
Assuming you are migrating your app from CakePHP 2.x which uses ``sha1`` password hashes, you
can configure the AuthComponent as follows::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    }

The first name appearing in the ``hashers`` key indicates which of the classes
is the preferred one, but it will fallback to the others in the list if the
check was unsuccessful.

When using the ``WeakPasswordHasher`` you will need to
set the ``Security.salt`` configure value to ensure passwords are salted.

In order to update old users' passwords on the fly, you can change the login
function accordingly::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                if ($this->Auth->authenticationProvider()->needsPasswordRehash()) {
                    $user = $this->Users->get($this->Auth->user('id'));
                    $user->password = $this->request->data('password');
                    $this->Users->save($user);
                }
                return $this->redirect($this->Auth->redirectUrl());
            }
            ...
        }
    }

As you can see we are just setting the plain password again so the setter
function in the entity will hash the password as shown in the previous example and
then save the entity.

Manually Logging Users In
-------------------------

.. php:method:: setUser(array $user)

Sometimes the need arises where you need to manually log a user in, such
as just after they registered for your application. You can do this by
calling ``$this->Auth->setUser()`` with the user data you want to 'login'::

    public function register()
    {
        $user = $this->Users->newEntity($this->request->data);
        if ($this->Users->save($user)) {
            $this->Auth->setUser($user->toArray());
            return $this->redirect([
                'controller' => 'Users',
                'action' => 'home'
            ]);
        }
    }

.. warning::

    Be sure to manually add the new User id to the array passed to the ``setUser()``
    method. Otherwise you won't have the user id available.

Accessing the Logged In User
----------------------------

.. php:method:: user($key = null)

Once a user is logged in, you will often need some particular
information about the current user. You can access the currently logged
in user using ``AuthComponent::user()``::

    // From inside a controller or other component.
    $this->Auth->user('id');

If the current user is not logged in or the key doesn't exist, null will
be returned.


Logging Users Out
-----------------

.. php:method:: logout()

Eventually you'll want a quick way to de-authenticate someone and
redirect them to where they need to go. This method is also useful if
you want to provide a 'Log me out' link inside a members' area of your
application::

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

Logging out users that logged in with Digest or Basic auth is difficult
to accomplish for all clients. Most browsers will retain credentials
for the duration they are still open. Some clients can be forced to
logout by sending a 401 status code. Changing the authentication realm
is another solution that works for some clients.

Deciding When to run Authentication
-----------------------------------

In some cases you may want to use ``$this->Auth->user()`` in the
``beforeFilter(Event $event)`` method. This is achievable by using the
``checkAuthIn`` config key. The following changes which event for which initial
authentication checks should be done::

    //Set up AuthComponent to authenticate in initialize()
    $this->Auth->config('checkAuthIn', 'Controller.initialize');

Default value for ``checkAuthIn`` is ``'Controller.startup'`` - but by using
``'Controller.initialize'`` initial authentication is done before ``beforeFilter()``
method.

.. _authorization-objects:

Authorization
=============

Authorization is the process of ensuring that an
identified/authenticated user is allowed to access the resources they
are requesting. If enabled ``AuthComponent`` can automatically check
authorization handlers and ensure that logged in users are allowed to
access the resources they are requesting. There are several built-in
authorization handlers and you can create custom ones for your
application or as part of a plugin.

- ``ControllerAuthorize`` Calls ``isAuthorized()`` on the active controller,
  and uses the return of that to authorize a user. This is often the
  most simple way to authorize users.

.. note::

    The ``ActionsAuthorize`` & ``CrudAuthorize`` adapter available in CakePHP
    2.x have now been moved to a separate plugin `cakephp/acl <https://github.com/cakephp/acl>`_.


Configuring Authorization Handlers
----------------------------------

You configure authorization handlers using the ``authorize`` config key.
You can configure one or many handlers for authorization. Using
multiple handlers allows you to support different ways of checking
authorization. When authorization handlers are checked, they will be
called in the order they are declared. Handlers should return ``false``, if
they are unable to check authorization, or the check has failed.
Handlers should return ``true`` if they were able to check authorization
successfully. Handlers will be called in sequence until one passes. If
all checks fail, the user will be redirected to the page they came from.
Additionally you can halt all authorization by throwing an exception.
You will need to catch any thrown exceptions and handle them.

You can configure authorization handlers in your controller's
``beforeFilter()`` or ``initialize()`` methods. You can pass
configuration information into each authorization object, using an
array::

    // Basic setup
    $this->Auth->config('authorize', ['Controller']);

    // Pass settings in
    $this->Auth->config('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Much like ``authenticate``, ``authorize``, helps you
keep your code DRY, by using the ``all`` key. This special key allows you
to set settings that are passed to every attached object. The ``all`` key
is also exposed as ``AuthComponent::ALL``::

    // Pass settings in using 'all'
    $this->Auth->config('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

In the above example, both the ``Actions`` and ``Controller`` will get the
settings defined for the 'all' key. Any settings passed to a specific
authorization object will override the matching key in the 'all' key.

If an authenticated user tries to go to a URL he's not authorized to access,
he's redirected back to the referrer. If you do not want such redirection
(mostly needed when using stateless authentication adapter) you can set config
option ``unauthorizedRedirect`` to ``false``. This causes AuthComponent
to throw a ``ForbiddenException`` instead of redirecting.

Creating Custom Authorize Objects
---------------------------------

Because authorize objects are pluggable, you can create custom authorize
objects in your application or plugins. If for example you wanted to
create an LDAP authorize object. In
**src/Auth/LdapAuthorize.php** you could put the
following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Network\Request;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, Request $request)
        {
            // Do things for ldap here.
        }
    }

Authorize objects should return ``false`` if the user is denied access, or
if the object is unable to perform a check. If the object is able to
verify the user's access, ``true`` should be returned. It's not required
that you extend ``BaseAuthorize``, only that your authorize object
implements an ``authorize()`` method. The ``BaseAuthorize`` class provides
a number of helpful methods that are commonly used.

Using Custom Authorize Objects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once you've created your custom authorize object, you can use them by
including them in your AuthComponent's authorize array::

    $this->Auth->config('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Using No Authorization
----------------------

If you'd like to not use any of the built-in authorization objects and
want to handle things entirely outside of AuthComponent, you can set
``$this->Auth->config('authorize', false);``. By default AuthComponent starts off
with ``authorize`` set to ``false``. If you don't use an authorization scheme,
make sure to check authorization yourself in your controller's
beforeFilter or with another component.


Making Actions Public
---------------------

.. php:method:: allow($actions = null)

There are often times controller actions that you wish to remain
entirely public or that don't require users to be logged in.
AuthComponent is pessimistic and defaults to denying access. You can
mark actions as public actions by using ``AuthComponent::allow()``. By
marking actions as public, AuthComponent will not check for a logged in
user nor will authorize objects be checked::

    // Allow all actions
    $this->Auth->allow();

    // Allow only the index action.
    $this->Auth->allow('index');

    // Allow only the view and index actions.
    $this->Auth->allow(['view', 'index']);

By calling it empty you allow all actions to be public.
For a single action you can provide the action name as string. Otherwise use an array.

.. note::

    You should not add the "login" action of your ``UsersController`` to allow list.
    Doing so would cause problems with normal functioning of ``AuthComponent``.


Making Actions Require Authorization
------------------------------------

.. php:method:: deny($actions = null)

By default all actions require authorization. However, after making actions
public you want to revoke the public access. You can do so using
``AuthComponent::deny()``::

    // Deny all actions.
    $this->Auth->deny();

    // Deny one action
    $this->Auth->deny('add');

    // Deny a group of actions.
    $this->Auth->deny(['add', 'edit']);

By calling it empty you deny all actions.
For a single action you can provide the action name as string. Otherwise use an array.


Using ControllerAuthorize
-------------------------

ControllerAuthorize allows you to handle authorization checks in a
controller callback. This is ideal when you have very simple
authorization or you need to use a combination of models and components
to do your authorization and don't want to create a custom authorize
object.

The callback is always called ``isAuthorized()`` and it should return a
boolean as to whether or not the user is allowed to access resources in
the request. The callback is passed the active user so it can be
checked::

    class AppController extends Controller
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // Any registered user can access public functions
            if (empty($this->request->params['prefix'])) {
                return true;
            }

            // Only admins can access admin functions
            if ($this->request->params['prefix'] === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // Default deny
            return false;
        }
    }

The above callback would provide a very simple authorization system
where only users with role = admin could access actions that were in
the admin prefix.

Configuration options
=====================

The following settings can all be defined either in your controller's
``initialize()`` method or using ``$this->Auth->config()`` in your ``beforeFilter()``:

ajaxLogin
    The name of an optional view element to render when an AJAX request is made
    with an invalid or expired session.
allowedActions
    Controller actions for which user validation is not required.
authenticate
    Set to an array of Authentication objects you want to use when
    logging users in. There are several core authentication objects;
    see the section on :ref:`authentication-objects`.
authError
    Error to display when user attempts to access an object or action to which
    they do not have access.

    You can suppress authError message from being displayed by setting this
    value to boolean ``false``.
authorize
    Set to an array of Authorization objects you want to use when
    authorizing users on each request; see the section on
    :ref:`authorization-objects`.
flash
    Settings to use when Auth needs to do a flash message with
    ``FlashComponent::set()``.
    Available keys are:

    - ``element`` - The element to use; defaults to 'default'.
    - ``key`` - The key to use; defaults to 'auth'.
    - ``params`` - The array of additional params to use; defaults to [].

loginAction
    A URL (defined as a string or array) to the controller action that handles
    logins. Defaults to ``/users/login``.
loginRedirect
    The URL (defined as a string or array) to the controller action users
    should be redirected to after logging in. This value will be ignored if the
    user has an ``Auth.redirect`` value in their session.
logoutRedirect
    The default action to redirect to after the user is logged out. While
    AuthComponent does not handle post-logout redirection, a redirect URL will
    be returned from :php:meth:`AuthComponent::logout()`. Defaults to
    ``loginAction``.
unauthorizedRedirect
    Controls handling of unauthorized access. By default unauthorized user is
    redirected to the referrer URL or ``loginAction`` or '/'.
    If set to ``false``, a ForbiddenException exception is thrown instead of
    redirecting.
storage
    Storage class to use for persisting user record. When using stateless
    authenticator you should set this to ``Memory``. Defaults to ``Session``.
    You can pass config options to storage class using array format. For e.g. to
    use a custom session key you can set ``storage`` to ``['className' => 'Session', 'key' => 'Auth.Admin']``.
checkAuthIn
    Name of the event in which initial auth checks should be done. Defaults
    to ``Controller.startup``. You can set it to ``Controller.initialize``
    if you want the check to be done before controller's ``beforeFilter()``
    method is run.

You can get current configuration values by calling ``$this->Auth->config()``::
only the configuration option::

    $this->Auth->config('loginAction');

    $this->redirect($this->Auth->config('loginAction'));

This is useful if you want to redirect an user to the ``login`` route for example. 
Without a parameter, the full configuration will be returned.

Testing Actions Protected By AuthComponent
==========================================

See the :ref:`testing-authentication` section for tips on how to test controller
actions that are protected by ``AuthComponent``.

.. meta::
    :title lang=en: Authentication
    :keywords lang=en: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
