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
            // Existing code

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

            // Allow the display action so our PagesController
            // continues to work. Also enable the read only actions.
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }

We've just told CakePHP that we want to load the ``Auth``
component. We've customized the configuration of AuthComponent, as
our users table uses ``email`` as the username. Now, if you go any protected
URL, such as ``/articles/add``, you'll be redirected to **/users/login**, which
will show an error page as we have not written that code yet. So let's create
the login action::

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

Now that we have a simple login form, we should be able to log in with one of
the users that has a hashed password.

.. note::

    If none of your users have hashed passwords, comment the
    ``loadComponent('Auth')`` block and ``$this->Auth->allow()`` calls. Then go
    and edit the user, saving a new password for them. After saving a new
    password for the user, make sure to uncomment the lines we just temporarily
    commented!

Try it out! Before logging in, visit ``/articles/add``. Since this action is not
allowed, you will be redirected to the login page. After logging in
successfully, CakePHP will automatically redirect you back to ``/articles/add``.

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

This code adds the ``logout`` action to the list of actions that do not require
authentication and implements the logout method. Now you can visit
``/users/logout`` to log out. You should then be sent to the login page.

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

Restricting Article Access
==========================

Now that users can log in, we'll want to limit users to only edit articles that
they created. We'll do this using an 'authorization' adapter. Since our
requirements are basic, we can use a controller hook method in our
``ArticlesController``. But before we do that, we'll want to tell the
``AuthComponent`` how our application is going to authorize actions. Update your
``AppController`` adding the following::

    public function isAuthorized($user)
    {
        // By default deny access.
        return false;
    }

Next we'll tell ``AuthComponent`` that we want to use controller hook methods
for authorization. Your ``AppController::initialize()`` method should now look
like::

        public function initialize()
        {
            // Existing code

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                // Added this line
                'authorize'=> 'Controller',
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

We'll default to denying access, and incrementally grant access where it makes
sense. First, we'll add the authorization logic for articles. In your
``ArticlesController`` add the following::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // The add and tags actions are always allowed to logged in users.
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // All other actions require a slug.
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // Check that the article belongs to the current user.
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }

Now if you try to edit or delete an article that does not belong to you,
you should be redirected back to the page you came from. If no error message is
displayed, add the following to your layout::

    // In src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

Next you should add the ``tags`` action to the actions allowed for
unauthenticated users, by adding the following to ``initialize()`` in
**src/Controller/ArticlesController.php**::

    $this->Auth->allow(['tags']);

While the above is fairly simplistic it illustrates how you could build more
complex logic that combines the current user and request data to build flexible
authorization logic.

Fixing the Add & Edit Actions
=============================

While we've blocked access to the edit action, we're still open to users
changing the ``user_id`` attribute of articles during edit. We
will solve these problems next. First up is the ``add`` action.

When creating articles, we want to fix the ``user_id`` to be the currently
logged in user. Replace your add action with the following::

    // in src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Changed: Set the user_id from the session.
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

Next we'll update the ``edit`` action. Replace the edit method with the following::

    // in src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Added: Disable modification of user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // Get a list of tags.
        $tags = $this->Articles->Tags->find('list');

        // Set article & tags to the view context
        $this->set('tags', $tags);
        $this->set('article', $article);
    }

Here we're modifying which properties can be mass-assigned, via the options
for ``patchEntity()``. See the :ref:`changing-accessible-fields` section for
more information. Remember to remove the ``user_id`` control from
**src/Template/Articles/edit.ctp** as we no longer need it.

Wrapping Up
===========

We've built a simple CMS application that allows users to login, post articles,
tag them, explore posted articles by tag, and applied basic access control to
articles. We've also added some nice UX improvements by leveraging the
FormHelper and ORM capabilities.

Thank you for taking the time to explore CakePHP. Next, you should learn more about
the :doc:`/orm`, or you peruse the :doc:`/topics`.
