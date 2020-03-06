AuthComponent
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Identificar, autenticar e autorizar usuários é uma parte comum de 
quase todos os aplicativos da web. No CakePHP, o AuthComponent fornece 
uma maneira conectável de executar essas tarefas. AuthComponent permite 
combinar objetos de autenticação e objetos de autorização para criar maneiras 
flexíveis de identificar e verificar a autorização do usuário.

.. deprecated:: 4.0.0
    O AuthComponent está obsoleto a partir da versão 4.0.0 e será 
    substituído pelos plugins `authorization <https://book.cakephp.org/authorization/>`__ e `authentication <https://book.cakephp.org/authentication/>`__ .

.. _authentication-objects:

Sugestão de Leitura Antes de Continuar
======================================

A configuração da autenticação requer várias etapas, incluindo a definição de uma 
tabela de usuários, a criação de um modelo, controlador e visualizações, etc.

Tudo isso é abordado passo a passo em :doc:`CMS Tutorial </tutorials-and-examples/cms/authentication>`.

Se você está procurando soluções de autenticação e/ou autorização existentes para o CakePHP, 
consulte a seção `Authentication and Authorization <https://github.com/FriendsOfCake/awesome-cakephp/blob/master/README.md#authentication-and-authorization>`_ da lista Awesome CakePHP.

Autenticação
============

Autenticação é o processo de identificar usuários pelas credenciais fornecidas 
e garantir que os usuários sejam quem eles dizem que são. Geralmente, isso é 
feito através de um nome de usuário e senha, que são verificados em uma lista 
conhecida de usuários. No CakePHP, existem várias maneiras internas de autenticar 
usuários armazenados no seu aplicativo.

* ``FormAuthenticate`` permite autenticar usuários com base nos dados do formulário POST. 
  Geralmente, este é um formulário de login no qual os usuários inserem informações.
* ``BasicAuthenticate`` permite autenticar usuários usando a autenticação HTTP básica.
* ``DigestAuthenticate`` permite autenticar usuários usando o Digest
   Autenticação HTTP.

Por padrão, ``AuthComponent`` usa ``FormAuthenticate``.

Escolhendo um Tipo de Autenticação
----------------------------------

Geralmente, você deseja oferecer autenticação baseada em formulário. É o mais fácil para os 
usuários que usam um navegador da web. Se você estiver criando uma API ou serviço da web, 
convém considerar a autenticação básica ou digerir a autenticação. As principais diferenças 
entre Digest e autenticação básica estão relacionadas principalmente à maneira como as senhas 
são tratadas. Na autenticação básica, o nome de usuário e a senha são transmitidos como texto 
sem formatação para o servidor. Isso torna a autenticação básica inadequada para aplicativos 
sem SSL, pois você acabaria expondo senhas confidenciais. A autenticação Digest usa um hash de 
resumo do nome de usuário, senha e alguns outros detalhes. Isso torna a autenticação Digest mais 
apropriada para aplicativos sem criptografia SSL.

Você também pode usar sistemas de autenticação como o OpenID também; no entanto, o OpenID 
não faz parte do núcleo do CakePHP.

Configurando Manipuladores de Autenticação
------------------------------------------

Você configura manipuladores de autenticação usando a configuração ``authenticate``. 
Você pode configurar um ou muitos manipuladores para autenticação. O uso de vários manipuladores 
permite oferecer suporte a diferentes maneiras de efetuar logon nos usuários. Ao efetuar logon 
nos usuários, os manipuladores de autenticação são verificados na ordem em que são declarados. 
Quando um manipulador conseguir identificar o usuário, nenhum outro manipulador será verificado. 
Por outro lado, você pode interromper toda a autenticação lançando uma exceção. Você precisará 
capturar todas as exceções lançadas e manipulá-las conforme necessário.

Você pode configurar manipuladores de autenticação nos métodos ``beforeFilter()`` ou 
``initialize()`` do seu controlador. Você pode passar informações de configuração para 
cada objeto de autenticação usando uma matriz::

    // Configuração simples
    $this->Auth->setConfig('authenticate', ['Form']);

    // Passando as configurações
    $this->Auth->setConfig('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

No segundo exemplo, você notará que tivemos que declarar a chave 
``userModel`` duas vezes. Para ajudá-lo a manter seu código DRY, você pode usar a 
chave ``all``. Essa chave especial permite definir configurações que são passadas 
para todos os objetos anexados. A chave ``all`` também é exposta como ``AuthComponent::ALL``::

    // Passando configurações usando 'all'
    $this->Auth->setConfig('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

No exemplo acima, ``Form`` e ``Basic`` obterão as configurações
definido para a chave 'all'. Quaisquer configurações passadas para 
um objeto de autenticação específico substituirão a chave correspondente 
na chave 'all'. Os objetos de autenticação principal suportam as seguintes 
chaves de configuração.

- ``fields`` Os campos a serem usados para identificar um usuário. Você pode usar as chaves 
  ``username`` e ``password`` para especificar seus campos de nome de usuário e senha, respectivamente.
- ``userModel`` O nome do modelo da tabela users; o padrão é Users.
- ``finder``O método finder a ser usado para buscar um registro do usuário. O padrão é 'all'.
- ``passwordHasher`` Classe de hasher de senha; O padrão é ``Default``.

Para configurar campos diferentes para o usuário no seu método ``initialize()``::

    public function initialize(): void
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

Não coloque outras chaves de configuração ``Auth``, como ``authError``, ``loginAction``, etc., 
dentro do elemento ``authenticate`` ou ``Form``. Eles devem estar no mesmo nível da chave de 
autenticação. A configuração acima com outro exemplo de configuração para autenticação deve 
se parecer com::

    public function initialize(): void
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

Além da configuração comum, a autenticação básica suporta as seguintes chaves:

- ``realm`` O domínio a ser autenticado. O padrão é ``env('SERVER_NAME')``.

Além da configuração comum, a autenticação Digest suporta as seguintes 
chaves:

- ``realm`` Para autenticação de domínio. O padrão é o nome do servidor.
- ``nonce`` Um nonce usado para autenticação. O padrão é ``uniqid()``.
- ``qop`` O padrão é auth; nenhum outro valor é suportado no momento.
- ``opaque`` Uma sequência que deve ser retornada inalterada pelos clientes. O padrão é ``md5($config['realm']))``.

.. note::
    Para encontrar o registro do usuário, o banco de dados é consultado apenas 
    usando o nome de usuário. A verificação da senha é feita em PHP. Isso é necessário 
    porque algoritmos de hash como bcrypt (que é usado por padrão) geram um novo hash a 
    cada vez, mesmo para a mesma string e você não pode simplesmente fazer uma comparação 
    simples de strings no SQL para verificar se a senha corresponde.

Personalizando a Consulta de Localização
----------------------------------------

Você pode personalizar a consulta usada para buscar o registro do usuário usando a opção 
``finder`` na opção de autenticação da classe::

    public function initialize(): void
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

Isso exigirá que seu ``UsersTable`` tenha o método localizador ``findAuth()``. 
No exemplo mostrado abaixo, a consulta é modificada para buscar apenas os campos 
obrigatórios e adicionar uma condição. Você deve garantir que você selecione os 
campos necessários para autenticar um usuário, como ``username`` e ``password``::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

Identificando Usuários e Efetuando Login
----------------------------------------

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
                $this->Flash->error(__('Username or password is incorrect'));
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
to after logging in.

If no parameter is passed, the returned URL will use the following rules:

- Returns the normalized URL from the ``redirect`` query string value if it is
  present and for the same domain the current app is running on.
- If there is no query string/session value and there is a config with
  ``loginRedirect``, the ``loginRedirect`` value is returned.
- If there is no redirect value and no ``loginRedirect``, ``/`` is returned.

Creating Stateless Authentication Systems
-----------------------------------------

Basic and digest are stateless authentication schemes and don't require an
initial POST or a form. If using only basic/digest authenticators you don't
require a login action in your controller. Stateless authentication will
re-verify the user's credentials on each request, this creates a small amount of
additional overhead, but allows clients to login without using cookies and
makes AuthComponent more suitable for building APIs.

For stateless authenticators, the ``storage`` config should be set to ``Memory``
so that AuthComponent does not use a session to store user record. You may also
want to set config ``unauthorizedRedirect`` to ``false`` so that AuthComponent
throws a ``ForbiddenException`` instead of the default behavior of redirecting to
referrer.

The ``unauthorizedRedirect`` option only applies to authenticated users. When
a user is not yet authenticated and you do not want the user to be redirected,
you will need to load one or more stateless authenticators, like ``Basic`` or
``Digest``.

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
re-identify the user and ensure they are the valid user. As with authentication
object's ``authenticate()`` method, the ``getUser()`` method should return
an array of user information on the success or ``false`` on failure. ::

    public function getUser(ServerRequest $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

The above is how you could implement the getUser method for HTTP basic
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

Here we're using username + API key as our fields and use the Users model.

Creating API Keys for Basic Authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because basic HTTP sends credentials in plain-text, it is unwise to have users
send their login password. Instead, an opaque API key is generally used. You can
generate these API tokens randomly using libraries from CakePHP::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\EventInterface;
    use Cake\ORM\Table;
    use Cake\Utility\Security;

    class UsersTable extends Table
    {
        public function beforeSave(EventInterface $event)
        {
            $entity = $event->getData('entity');

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // Generate an API 'token'
                $entity->api_key_plain = Security::hash(Security::randomBytes(32), 'sha256', false);

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
it to the user later on. Using a key instead of a password means that even over
plain HTTP, your users can use an opaque token instead of their original
password. It is also wise to include logic allowing API keys to be regenerated
at a user's request.

Using Digest Authentication
---------------------------

Digest authentication offers an improved security model over basic
authentication, as the user's credentials are never sent in the request header.
Instead, a hash is sent.

To use digest authentication, you'll need to configure ``AuthComponent``::

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

Here we're using username + digest_hash as our fields and use the Users model.

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
    use Cake\Event\EventInterface;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(EventInterface $event)
        {
            $entity = $event->getData('entity');

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

    The third parameter of ``DigestAuthenticate::password()`` must match the
    'realm' config value defined when DigestAuthentication was configured
    in ``AuthComponent::$authenticate``. This defaults to ``env('SCRIPT_NAME')``.
    You may wish to use a static string if you want consistent hashes in multiple environments.

Creating Custom Authentication Objects
--------------------------------------

Because authentication objects are pluggable, you can create custom
authentication objects in your application or plugins. If for example,
you wanted to create an OpenID authentication object. In
**src/Auth/OpenidAuthenticate.php** you could put the following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(ServerRequest $request, Response $response)
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

Once you've created your custom authentication objects, you can use them
by including them in ``AuthComponent``'s authenticate array::

    $this->Auth->setConfig('authenticate', [
        'Openid', // app authentication object.
        'AuthBag.Openid', // plugin authentication object.
    ]);

.. note::
    Note that when using simple notation there's no 'Authenticate' word when
    initiating the authentication object. Instead, if using namespaces, you'll
    need to set the full namespace of the class, including the 'Authenticate' word.

Handling Unauthenticated Requests
---------------------------------

When an unauthenticated user tries to access a protected page first the
``unauthenticated()`` method of the last authenticator in the chain is called.
The authenticate object can handle sending response or redirection by returning
a response object to indicate no further action is necessary. Due to this, the
order in which you specify the authentication provider in ``authenticate``
config matters.

If authenticator returns null, ``AuthComponent`` redirects user to the login action.
If it's an AJAX request and config ``ajaxLogin`` is specified that element
is rendered else a 403 HTTP status code is returned.

Displaying Auth Related Flash Messages
--------------------------------------

In order to display the session error messages that Auth generates, you
need to add the following code to your layout. Add the following two
lines to the **templates/Layout/default.php** file in the body section::

    echo $this->Flash->render();

You can customize the error messages and flash settings ``AuthComponent``
uses. Using ``flash`` config you can configure the parameters
``AuthComponent`` uses for setting flash messages. The available keys are

- ``key`` - The key to use, defaults to 'default'.
- ``element`` - The element name to use for rendering, defaults to null.
- ``params`` - The array of additional parameters to use, defaults to ``[]``.

In addition to the flash message settings you can customize other error
messages ``AuthComponent`` uses. In your controller's ``beforeFilter()``, or
component settings you can use ``authError`` to customize the error used
for when authorization fails::

    $this->Auth->setConfig('authError', "Woopsie, you are not authorized to access this area.");

Sometimes, you want to display the authorization error only after
the user has already logged-in. You can suppress this message by setting
its value to boolean ``false``.

In your controller's ``beforeFilter()`` or component settings::

    if (!$this->Auth->user()) {
        $this->Auth->setConfig('authError', false);
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

``AuthComponent`` is configured by default to use the ``DefaultPasswordHasher``
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

Then you are required to configure the ``AuthComponent`` to use your own password
hasher::

    public function initialize(): void
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
can configure the ``AuthComponent`` as follows::

    public function initialize(): void
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
set the ``Security.salt`` configure the value to ensure passwords are salted.

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
                    $user->password = $this->request->getData('password');
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
        $user = $this->Users->newEntity($this->request->getData());
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
    method. Otherwise, you won't have the user id available.

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

Eventually, you'll want a quick way to de-authenticate someone and
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
``beforeFilter()`` method. This is achievable by using the
``checkAuthIn`` config key. The following changes which event for which initial
authentication checks should be done::

    //Set up AuthComponent to authenticate in initialize()
    $this->Auth->setConfig('checkAuthIn', 'Controller.initialize');

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
  and uses the return of that to authorize a user. This is often the most
  simple way to authorize users.

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
Additionally, you can halt all authorization by throwing an exception.
You will need to catch any thrown exceptions and handle them.

You can configure authorization handlers in your controller's
``beforeFilter()`` or ``initialize()`` methods. You can pass
configuration information into each authorization object, using an
array::

    // Basic setup
    $this->Auth->setConfig('authorize', ['Controller']);

    // Pass settings in
    $this->Auth->setConfig('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Much like ``authenticate``, ``authorize``, helps you
keep your code DRY, by using the ``all`` key. This special key allows you
to set settings that are passed to every attached object. The ``all`` key
is also exposed as ``AuthComponent::ALL``::

    // Pass settings in using 'all'
    $this->Auth->setConfig('authorize', [
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
option ``unauthorizedRedirect`` to ``false``. This causes ``AuthComponent``
to throw a ``ForbiddenException`` instead of redirecting.

Creating Custom Authorize Objects
---------------------------------

Because authorize objects are pluggable, you can create custom authorize
objects in your application or plugins. If for example, you wanted to
create an LDAP authorize object. In
**src/Auth/LdapAuthorize.php** you could put the
following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Http\ServerRequest;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, ServerRequest $request)
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
including them in your ``AuthComponent``'s authorize array::

    $this->Auth->setConfig('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Using No Authorization
----------------------

If you'd like to not use any of the built-in authorization objects and
want to handle things entirely outside of ``AuthComponent``, you can set
``$this->Auth->setConfig('authorize', false);``. By default ``AuthComponent``
starts off with ``authorize`` set to ``false``. If you don't use an
authorization scheme, make sure to check authorization yourself in your
controller's ``beforeFilter()`` or with another component.

Making Actions Public
---------------------

.. php:method:: allow($actions = null)

There are often times controller actions that you wish to remain
entirely public or that don't require users to be logged in.
``AuthComponent`` is pessimistic and defaults to denying access. You can
mark actions as public actions by using ``AuthComponent::allow()``. By
marking actions as public, ``AuthComponent`` will not check for a logged in
user nor will authorize objects to be checked::

    // Allow all actions
    $this->Auth->allow();

    // Allow only the index action.
    $this->Auth->allow('index');

    // Allow only the view and index actions.
    $this->Auth->allow(['view', 'index']);

By calling it empty you allow all actions to be public.
For a single action, you can provide the action name as a string. Otherwise, use an array.

.. note::

    You should not add the "login" action of your ``UsersController`` to allow list.
    Doing so would cause problems with the normal functioning of ``AuthComponent``.

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
For a single action, you can provide the action name as a string. Otherwise, use an array.

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
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // Any registered user can access public functions
            if (!$this->request->getParam('prefix')) {
                return true;
            }

            // Only admins can access admin functions
            if ($this->request->getParam('prefix') === 'admin') {
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
``initialize()`` method or using ``$this->Auth->setConfig()`` in your ``beforeFilter()``:

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
    - ``params`` - The array of additional parameters to use; defaults to '[]'.

loginAction
    A URL (defined as a string or array) to the controller action that handles
    logins. Defaults to ``/users/login``.
loginRedirect
    The URL (defined as a string or array) to the controller action users
    should be redirected to after logging in. This value will be ignored if the
    user has an ``Auth.redirect`` value in their session.
logoutRedirect
    The default action to redirect to after the user is logged out. While
    ``AuthComponent`` does not handle post-logout redirection, a redirect URL will
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

You can get current configuration values by calling ``$this->Auth->getConfig()``::
only the configuration option::

    $this->Auth->getConfig('loginAction');

    $this->redirect($this->Auth->getConfig('loginAction'));

This is useful if you want to redirect a user to the ``login`` route for example.
Without a parameter, the full configuration will be returned.

Testing Actions Protected By AuthComponent
==========================================

See the :ref:`testing-authentication` section for tips on how to test controller
actions that are protected by ``AuthComponent``.

.. meta::
    :title lang=en: Authentication
    :keywords lang=en: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
