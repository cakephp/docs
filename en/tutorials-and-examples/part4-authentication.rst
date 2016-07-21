Part 4 - Authentication
#######################

Following our :doc:`/tutorials-and-examples/part3-bake-for-crud-and-tags` part,
imagine we wanted to secure access to certain URLs, based on the logged-in
user. We also have another requirement: to allow our blog to have multiple
authors who can create, edit, and delete their own articles while disallowing
other authors from making changes to articles they do not own.

Creating All User-Related Code
==============================

First, let's create a new table in our blog database to hold our users' data::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

We have adhered to the CakePHP conventions in naming tables, but we're also
taking advantage of another convention: By using the username and password
columns in a users table, CakePHP will be able to auto-configure most things for
us when implementing the user login.

Next step is to create our UsersTable class, responsible for finding, saving and
validating any user data::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

Let's also create our UsersController. The following content corresponds to
parts of a basic baked UsersController class using the code generation utilities
bundled with CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->Auth->allow(['add']);
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->data);
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
tutorial, we will show just the add.ctp:

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
            <?= $this->Form->input('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Authentication (Login and Logout)
=================================

Adding Auth Component
---------------------

In CakePHP, authentication is handled by :doc:`/controllers/components`.
Components can be thought of as ways to create reusable chunks of controller
code related to a specific feature or concept. Components can also hook into the
controller's event life-cycle and interact with your application that way. To
get started, we'll add the :doc:`AuthComponent
</controllers/components/authentication>` to our application. We'll pretty much
want every method to require authentication, so we'll add AuthComponent in our
**src/Controller/AppController.php**::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('RequestHandler');
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'username',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);

            $this->Auth->allow(['index', 'view', 'display']);
        }
    }

There is not much to configure, as we used the conventions for the users table.
We just set up the URLs that will be loaded after the login and logout actions
is performed, in our case to ``/articles/`` and ``/`` respectively.

What we did in the ``beforeFilter()`` function was to tell the AuthComponent to
not require a login for all ``index()`` and ``view()`` actions, in every
controller. We want our visitors to be able to read and list the entries without
registering in the site.

Adding Login
------------

We've just told CakePHP that we want to load the ``Flash`` and ``Auth``
components. In addition, we've customized the configuration of AuthComponent, as
our users table uses ``username`` as the username. Now, if you go to any URL
you'll be kicked to **/users/login**, which will show an error page as we have
not written that code yet. So let's create the login action::

    // In src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Your username or password is incorrect.');
        }
    }

Password hashing is not done yet, we need an Entity class for our User in order
to handle its own specific logic. Create the **src/Model/Entity/User.php**
entity file and add the following::

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
            return (new DefaultPasswordHasher)->hash($password);
        }

        // ...
    }

Now every time the password property is assigned to the user it will be hashed
using the ``DefaultPasswordHasher`` class.  We're just missing a template view
file for the login function. Open up your **src/Template/Users/login.ctp** file
and add the following lines:

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render('auth') ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

You can now register a new user by accessing the ``/users/add`` URL and log in
with the newly created credentials by going to ``/users/login`` URL. Also, try
to access any other URL that was not explicitly allowed such as
``/articles/add``, you will see that the application automatically redirects you
to the login page.

And that's it! It looks too simple to be true. Let's go back a bit to explain
what happened. The ``beforeFilter()`` function is telling the AuthComponent to
not require a login for the ``add()`` action in addition to the ``index()`` and
``view()`` actions that were already allowed in the AppController's
``beforeFilter()`` function.

The ``login()`` action calls the ``$this->Auth->identify()`` function in the
AuthComponent, and it works without any further config because we are following
conventions as mentioned earlier. That is, having a Users table with a username
and a password column, and use a form posted to a controller with the user data.
This function returns whether the login was successful or not, and in the case
it succeeds, then we redirect the user to the configured redirection URL that we
used when adding the AuthComponent to our application.

Now that we have a simple login form, we should be able to log in with one of
the users that has a hashed password.

.. note::

    If none of your users have hashed passwords, comment the
    ``loadComponent('Auth')`` line. Then go and edit the user,
    saving a new password for them.

You should now be able to log in. If not, make sure you are using a user that
has a hashed password.

Adding Logout
=============

Now that people can log in, you'll probably want to provide a way to log out as
well. Again, in the ``UsersController``, add the following code::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout', 'add']);
    }

    public function logout()
    {
        $this->Flash->success('You are now logged out.');
        return $this->redirect($this->Auth->logout());
    }

This code whitelists the ``logout`` action as a public action, and implements
the logout method. Now you can visit ``/users/logout`` to log out. You should
then be sent to the login page.

Please follow this tutorial with the next chapter
:doc:`/tutorials-and-examples/part5-authorization`.

Suggested Follow-up Reading
---------------------------

#. :doc:`/bake/usage` Generating basic CRUD code
#. :doc:`/controllers/components/authentication`: User registration and login

.. meta::
    :title lang=en: Blog Tutorial Part 4 - Authentication
    :keywords lang=en: tuto, blog, authentication, part4
