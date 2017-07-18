CMS Tutorial - Authentication
#############################

Now that our CMS has users, we should enable them to login, and apply some basic
access control to the article creation & editing experiences.

Adding Login
============

In CakePHP, authentication is handled by :doc:`/controllers/components`.
Components can be thought of as ways to create reusable chunks of controller
code related to a specific feature or concept. Components can hook into the
controller's event life-cycle and interact with your application that way. To
get started, we'll add the :doc:`AuthComponent
</controllers/components/authentication>` to our application. We'll want the
create, update and delete methods to require authentication, so we'll add
AuthComponent in our AppController::

    // In src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // If unauthorized, return them to page they were just on
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Allow the display action so our pages controller
            // continues to work. Also enable the read only actions.
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }

We've just told CakePHP that we want to load the ``Flash`` and ``Auth``
components. In addition, we've customized the configuration of AuthComponent, as
our users table uses ``email`` as the username. Now, if you go to any URL you'll
be redirected to **/users/login**, which will show an error page as we have
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

And in **src/Template/Users/login.ctp** add the following::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

.. note::

   The ``control()`` method is available since 3.4. For prior versions you can
   use the ``input()`` method instead.

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
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('You are now logged out.');
        return $this->redirect($this->Auth->logout());
    }

This code adds the ``logout`` action as one that does not require authentication
and implements the logout method. Now you can visit ``/users/logout`` to log
out. You should then be sent to the login page.

Enabling Registrations
======================

If you aren't logged in and you try to visit **/users/add** you will be
redirected to the login page. We should fix that as we want to allow people to
sign up for our application. In the ``UsersController`` add the following::

    public function initialize()
    {
        parent::initialize();
        // Add the 'add' action to the allowed actions list.
        $this->Auth->allow(['logout', 'add']);
    }

The above tells ``AuthComponent`` that the ``add()`` action of the
``UsersController`` does *not* require authentication or authorization. You may
want to take the time to clean up the **Users/add.ctp** and remove the
misleading links, or continue on to the next section. We won't be building out
user editing, viewing or listing in this tutorial, but that is an exercise you
can complete on your own.

* Enabling Access Control
* Updating Creation
* Restricting Editing
