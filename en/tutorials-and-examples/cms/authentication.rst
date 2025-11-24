CMS Tutorial - Authentication
#############################

Now that our CMS has users, we can enable them to login using the
`cakephp/authentication <https://book.cakephp.org/authentication/>`__
plugin. We'll start off by ensuring passwords are stored securely in
our database. Then we are going to provide a working login and logout, and
enable new users to register.

Installing Authentication Plugin
================================

Use composer to install the Authentication Plugin:

.. code-block:: console

    composer require "cakephp/authentication:~3.0"


Adding Password Hashing
-----------------------

You need to have created the ``Controller``, ``Table``, ``Entity`` and
templates for the ``users`` table in your database. You can do this manually
like you did before for the ArticlesController, or you can use the bake shell
to generate the classes for you using:

.. code-block:: console

    bin/cake bake all users

If you create or update a user with this setup, you might notice that
the passwords are stored in plain text. This is really bad from a security point
of view, so lets fix that.

This is also a good time to talk about the model layer in CakePHP. In CakePHP,
we use different classes to operate on collections of records and single records.
Methods that operate on the collection of entities are put in the ``Table`` class,
while features belonging to a single record are put on the ``Entity`` class.

For example, password hashing is done on the individual record, so we'll
implement this behavior on the entity object. Because we want to hash the
password each time it is set, we'll use a mutator/setter method. CakePHP will
call a convention based setter method any time a property is set in one of your
entities. Let's add a setter for the password. In **src/Model/Entity/User.php**
add the following::

    <?php
    namespace App\Model\Entity;

    use Authentication\PasswordHasher\DefaultPasswordHasher; // Add this line
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // Code from bake.

        // Add this method
        protected function _setPassword(string $password) : ?string
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher())->hash($password);
            }
            return null;
        }
    }

Now, point your browser to **http://localhost:8765/users** to see a list of users.
Remember you'll need to have your local server running. Start a standalone PHP
server using ``bin/cake server``.

You can edit the default user that was created during
:doc:`Installation <installation>`. If you change that user's password,
you should see a hashed password instead of the original value on the list or
view pages. CakePHP hashes passwords with `bcrypt
<https://codahale.com/how-to-safely-store-a-password/>`_ by default. We recommend
bcrypt for all new applications to keep your security standards high. This
is the `recommended password hash algorithm for PHP <https://www.php.net/manual/en/function.password-hash.php>`_.

.. note::

    Create a hashed password for at least one of the user accounts now!
    It will be needed in the next steps.
    After updating the password, you'll see a long string stored in the password column.
    Note bcrypt will generate a different hash even for the same password saved twice.


Adding Login
============

Now it's time to configure the Authentication Plugin.
The Plugin will handle the authentication process using 3 different classes:

* ``Application`` will use the Authentication Middleware and provide an
  AuthenticationService, holding all the configuration we want to define how are
  we going to check the credentials, and where to find them.
* ``AuthenticationService`` will be a utility class to allow you configure the
  authentication process.
* ``AuthenticationMiddleware`` will be executed as part of the middleware queue,
  this is before your Controllers are processed by the framework, and will pick the
  credentials and process them to check if the user is authenticated.

If you remember, we used `AuthComponent`
before to handle all these steps. Now the logic is divided into specific classes and
the authentication process happens before your controller layer. First it checks if the user
is authenticated (based on the configuration you provided) and injects the user and
the authentication results into the request for further reference.

In **src/Application.php**, add the following imports::

    // In src/Application.php add the following imports
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Cake\Routing\Router;
    use Psr\Http\Message\ServerRequestInterface;

Then implement the authentication interface on your ``Application`` class::

    // in src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

Then add the following::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... other middleware added before
            ->add(new RoutingMiddleware($this))
            ->add(new BodyParserMiddleware())
            // Add the AuthenticationMiddleware. It should be after routing and body parser.
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => Router::url('/users/login'),
            'queryParam' => 'redirect',
        ]);

        // Load the authenticators, you want session first
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configure form data check to pick email and password
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => Router::url('/users/login'),
            'identifier' => [
                'Authentication.Password' => [
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password',
                    ],
                ],
            ],
        ]);

        return $authenticationService;
    }

In your ``AppController`` class add the following code::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');

        // Add this line to check authentication result and lock your site
        $this->loadComponent('Authentication.Authentication');

Now, on every request, the ``AuthenticationMiddleware`` will inspect
the request session to look for an authenticated user. If we are loading the ``/users/login``
page, it will also inspect the posted form data (if any) to extract the credentials.
By default the credentials will be extracted from the ``username`` and ``password``
fields in the request data.
The authentication result will be injected in a request attribute named
``authentication``. You can inspect the result at any time using
``$this->request->getAttribute('authentication')`` from your controller actions.
All your pages will be restricted as the ``AuthenticationComponent`` is checking the
result on every request. When it fails to find any authenticated user, it will redirect the
user to the ``/users/login`` page.
Note at this point, the site won't work as we don't have a login page yet.
If you visit your site, you'll get an "infinite redirect loop" so let's fix that.

.. note::

    If your application serves from both SSL and non-SSL protocols, then you might have problems
    with sessions being lost, in case your application is on non-SSL protocol. You need to enable
    access by setting session.cookie_secure to false in your config config/app.php or config/app_local.php.
    (See :doc:`CakePHP’s defaults on session.cookie_secure </development/sessions>`)

In your ``UsersController``, add the following code::

    public function beforeFilter(\Cake\Event\EventInterface $event): void
    {
        parent::beforeFilter($event);
        // Configure the login action to not require authentication, preventing
        // the infinite redirect loop issue
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // regardless of POST or GET, redirect if user is logged in
        if ($result && $result->isValid()) {
            // redirect to /articles after login success
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // display error if user submitted and authentication failed
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid username or password'));
        }
    }

Add the template logic for your login action::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Add User", ['action' => 'add']) ?>
    </div>

Now login page will allow us to correctly login into the application.
Test it by requesting any page of your site. After being redirected
to the ``/users/login`` page, enter the email and password you
picked previously when creating your user. You should be redirected
successfully after login.

We need to add a couple more details to configure our application.
We want all ``view`` and ``index`` pages accessible without logging in so we'll add this specific
configuration in AppController::

    // in src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event): void
    {
        parent::beforeFilter($event);
        // for all controllers in our application, make index and view
        // actions public, skipping the authentication check
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

.. note::

    If you don't have a user with a hashed password yet, comment the
    ``$this->loadComponent('Authentication.Authentication')`` line in your
    AppController and all other lines where Authentication is used. Then go to
    ``/users/add`` to create a new user picking email and password. Afterward,
    make sure to uncomment the lines we just temporarily commented!

Try it out by visiting ``/articles/add`` before logging in! Since this action is not
allowed, you will be redirected to the login page. After logging in
successfully, CakePHP will automatically redirect you back to ``/articles/add``.

Logout
======

Add the logout action to the ``UsersController`` class::

    // in src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // regardless of POST or GET, redirect if user is logged in
        if ($result && $result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

Now you can visit ``/users/logout`` to log out. You should then be sent to the login
page.

Enabling Registrations
======================

If you try to visit **/users/add** without being logged in, you will be
redirected to the login page. We should fix that as we want to allow people to
sign up for our application. In the ``UsersController`` fix the following line::

    // Add to the beforeFilter method of UsersController
    $this->Authentication->addUnauthenticatedActions(['login', 'add']);

The above tells ``AuthenticationComponent`` that the ``add()`` action of the
``UsersController`` does *not* require authentication or authorization. You may
want to take the time to clean up the **Users/add.php** and remove the
misleading links, or continue on to the next section. We won't be building out
user editing, viewing or listing in this tutorial, but that is an exercise you
can complete on your own.

Now that users can log in, we'll want to limit users to only edit articles that
they created by :doc:`applying authorization policies <./authorization>`.
