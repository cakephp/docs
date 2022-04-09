Blog Tutorial - Authentication
##############################

Following our :doc:`/tutorials-and-examples/blog/blog` example, imagine we
wanted to disallow unauthenticated users to create articles.

Creating Users Table and Controller
===================================

First, let's create a new table in our blog database to hold our users' data:

.. code-block:: mysql

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

If you are using PostgreSQL, connect to cake_blog database and execute the following SQL instead:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created TIMESTAMP DEFAULT NULL,
        modified TIMESTAMP DEFAULT NULL
    );

We have adhered to the CakePHP conventions in naming tables, but we're also
taking advantage of another convention: By using the email and password
columns in a users table, CakePHP will be able to auto-configure most things for
us when implementing the user login.

Next step is to create our ``UsersTable`` class, responsible for finding, saving
and validating any user data::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            return $validator
                ->notEmpty('email', 'An email is required')
                ->email('email')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

Let's also create our ``UsersController``. The following content corresponds to
parts of a basic baked ``UsersController`` class using the code generation
utilities bundled with CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class UsersController extends AppController
    {
        public function index()
        {
            $this->set('users', $this->Users->find()->all());
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }
    }

In the same way we created the views for our articles by using the code
generation tool, we can implement the user views. For the purpose of this
tutorial, we will show just the **add.php**:

.. code-block:: php

    <!-- templates/Users/add.php -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('email') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Adding Authentication
=====================

We're now ready to add our authentication layer. In CakePHP this is handled by
the ``authentication`` plugin. Let's start off by installing it. Use composer to
install the Authentication Plugin:

.. code-block:: console

    composer require "cakephp/authentication:^2.0"

Then add the following to your application's ``bootstrap()`` method::

    // in src/Application.php in the bootstrap() method.
    $this->addPlugin('Authentication');

Adding Password Hashing
=======================

Next, we'll create the ``User`` entity and add password hashing.  Create the
**src/Model/Entity/User.php** entity file and add the following::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // Make all fields mass assignable except for primary key field "id".
        protected $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

Now every time the password property is assigned to the user it will be hashed
using the ``DefaultPasswordHasher`` class.

Configuring Authentication
==========================

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

Authentication logic is divided into specific classes and the authentication
process happens before your controller layer. First authentication checks if the
user is authenticated (based in the configuration you provided) and injects the
user and the authentication results into the request for further reference.

In **src/Application.php**, add the following imports::

    // In src/Application.php add the following imports
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Psr\Http\Message\ServerRequestInterface;

Then implement the authentication interface on your application class::

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
            // add Authentication after RoutingMiddleware
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => '/users/login',
            'queryParam' => 'redirect',
        ]);

        // Load identifiers, ensure we check email and password fields
        $authenticationService->loadIdentifier('Authentication.Password', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ]
        ]);

        // Load the authenticators, you want session first
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configure form data check to pick email and password
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => '/users/login',
        ]);

        return $authenticationService;
    }

In you ``AppController`` class add the following code::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');

        // Add this line to check authentication result and lock your site
        $this->loadComponent('Authentication.Authentication');

Now, on every request, the ``AuthenticationMiddleware`` will inspect the request
session to look for an authenticated user. If we are loading the
``/users/login`` page, it'll inspect also the posted form data (if any) to
extract the credentials.  By default the credentials will be extracted from the
``email`` and ``password`` fields in the request data.  The authentication
result will be injected in a request attribute named ``authentication``. You can
inspect the result at any time using
``$this->request->getAttribute('authentication')`` from your controller actions.
All your pages will be restricted as the ``AuthenticationComponent`` is checking
the result on every request. When it fails to find any authenticated user, it'll
redirect the user to the ``/users/login`` page.  Note at this point, the site
won't work as we don't have a login page yet.  If you visit your site, you'll
get an "infinite redirect loop".  So, let's fix that!

In your ``UsersController``, add the following code::

    public function beforeFilter(\Cake\Event\EventInterface $event)
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
        if ($result->isValid()) {
            // redirect to /articles after login success
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // display error if user submitted and authentication failed
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid email or password'));
        }
    }

Add the template logic for your login action::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your email and password') ?></legend>
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

We need to add a couple more details to configure our application.  We want all
``view`` and ``index`` pages accessible without logging in so we'll add this
specific configuration in ``AppController``::

    // in src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // for all controllers in our application, make index and view
        // actions public, skipping the authentication check.
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

Logout
======

Add the logout action to the ``UsersController`` class::

    // in src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // regardless of POST or GET, redirect if user is logged in
        if ($result->isValid()) {
            $this->Authentication->logout();
            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

Now you can visit ``/users/logout`` to log out. You should then be sent to the
login page. If you've made it this far, congratulations, you now have a simple
blog that:

* Allows authenticated users to create and edit articles.
* Allows unauthenticated users to view articles and tags.

Suggested Follow-up Reading
---------------------------

#. :doc:`/bake/usage` Generating basic CRUD code
#. `Authentication Plugin </authentication/>`__ documentation.

.. meta::
    :title lang=en: Simple Authentication Application
    :keywords lang=en: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
