Bookmarker Tutorial Part 2
##########################

After finishing :doc:`the first part of this tutorial
</tutorials-and-examples/bookmarks/intro>` you should have a very basic
bookmarking application. In this chapter we'll be adding authentication and
restricting the bookmarks each user can see/modify to only the ones they own.

Adding Login
============

In CakePHP, authentication is handled by :doc:`/controllers/components`.
Components can be thought of as ways to create reusable chunks of controller
code related to a specific feature or concept. Components can also hook into the
controller's event life-cycle and interact with your application that way. To
get started, we'll add the :doc:`AuthComponent
</controllers/components/authentication>` to our application. We'll pretty much
want every method to require authentication, so we'll add AuthComponent in our
AppController::

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
                'unauthorizedRedirect' => $this->referer() // If unauthorized, return them to page they were just on
            ]);

            // Allow the display action so our pages controller
            // continues to work.
            $this->Auth->allow(['display']);
        }
    }

We've just told CakePHP that we want to load the ``Flash`` and ``Auth``
components. In addition, we've customized the configuration of AuthComponent, as
our users table uses ``email`` as the username. Now, if you go to any URL you'll
be kicked to **/users/login**, which will show an error page as we have
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

This code whitelists the ``logout`` action as a public action, and implements
the logout method. Now you can visit ``/users/logout`` to log out. You should
then be sent to the login page.

Enabling Registrations
======================

If you aren't logged in and you try to visit **/users/add** you will be kicked
to the login page. We should fix that as we want to allow people to sign up for
our application. In the ``UsersController`` add the following::

    public function initialize()
    {
        parent::initialize();
        // Add the 'add' action to the allowed actions list.
        $this->Auth->allow(['logout', 'add']);
    }

The above tells ``AuthComponent`` that the ``add()`` action does *not* require
authentication or authorization. You may want to take the time to clean up the
**Users/add.ctp** and remove the misleading links, or continue on to the next
section. We won't be building out user editing, viewing or listing in this
tutorial so they will not work as ``AuthComponent`` will deny you access to those
controller actions.

Restricting Bookmark Access
===========================

Now that users can log in, we'll want to limit the bookmarks they can see to the
ones they made. We'll do this using an 'authorization' adapter. Since our
requirements are pretty simple, we can write some simple code in our
``BookmarksController``. But before we do that, we'll want to tell the
AuthComponent how our application is going to authorize actions. In your
``AppController`` add the following::

    public function isAuthorized($user)
    {
        return false;
    }

Also, add the following to the configuration for ``Auth`` in your
``AppController``::

    'authorize' => 'Controller',

Your ``initialize()`` method should now look like::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',//added this line
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
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Allow the display action so our pages controller
            // continues to work.
            $this->Auth->allow(['display']);
        }

We'll default to denying access, and incrementally grant access where it makes
sense. First, we'll add the authorization logic for bookmarks. In your
``BookmarksController`` add the following::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');

        // The add and index actions are always allowed.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // All other actions require an id.
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // Check that the bookmark belongs to the current user.
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }


Now if you try to view, edit or delete a bookmark that does not belong to you,
you should be redirected back to the page you came from. If no error message is
displayed, add the following to your layout::

    // In src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

You should now see the authorization error messages.

Fixing List view and Forms
==========================

While view and delete are working, edit, add and index have a few problems:

#. When adding a bookmark you can choose the user.
#. When editing a bookmark you can choose the user.
#. The list page shows bookmarks from other users.

Let's tackle the add form first. To begin with remove the ``control('user_id')``
from **src/Template/Bookmarks/add.ctp**. With that removed, we'll also update
the ``add()`` action from **src/Controller/BookmarksController.php** to look
like::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('The bookmark has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The bookmark could not be saved. Please, try again.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

By setting the entity property with the session data, we remove any possibility
of the user modifying which user a bookmark is for. We'll do the same for the
edit form and action. Your ``edit()`` action from
**src/Controller/BookmarksController.php** should look like::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('The bookmark has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The bookmark could not be saved. Please, try again.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

List View
---------

Now, we only need to show bookmarks for the currently logged in user. We can do
that by updating the call to ``paginate()``. Make your ``index()`` action from
**src/Controller/BookmarksController.php** look like::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
        $this->set('_serialize', ['bookmarks']);
    }

We should also update the ``tags()`` action and the related finder method, but
we'll leave that as an exercise you can complete on your own.

Improving the Tagging Experience
================================

Right now, adding new tags is a difficult process, as the ``TagsController``
disallows all access. Instead of allowing access, we can improve the tag
selection UI by using a comma separated text field. This will let us give
a better experience to our users, and use some more great features in the ORM.

Adding a Computed Field
-----------------------

Because we'll want a simple way to access the formatted tags for an entity, we
can add a virtual/computed field to the entity. In
**src/Model/Entity/Bookmark.php** add the following::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

This will let us access the ``$bookmark->tag_string`` computed property. We'll
use this property in controls later on. Remember to add the ``tag_string``
property to the ``_accessible`` list in your entity, as we'll want to 'save' it
later on.

In **src/Model/Entity/Bookmark.php** add the ``tag_string`` to ``$_accessible``
this way::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];


Updating the Views
------------------

With the entity updated we can add a new control for our tags. In
**src/Template/Bookmarks/add.ctp** and **src/Template/Bookmarks/edit.ctp**,
replace the existing ``tags._ids`` control with the following::

    echo $this->Form->control('tag_string', ['type' => 'text']);

Persisting the Tag String
-------------------------

Now that we can view existing tags as a string, we'll want to save that data as
well. Because we marked the ``tag_string`` as accessible, the ORM will copy that
data from the request into our entity. We can use a ``beforeSave()`` hook method
to parse the tag string and find/build the related entities. Add the following
to **src/Model/Table/BookmarksTable.php**::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // Trim tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Remove all empty tags
        $newTags = array_filter($newTags);
        // Reduce duplicated tags
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // Remove existing tags from the list of new tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Add existing tags.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Add new tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

While this code is a bit more complicated than what we've done so far, it helps
to showcase how powerful the ORM in CakePHP is. You can manipulate query
results using the :doc:`/core-libraries/collections` methods, and handle
scenarios where you are creating entities on the fly with ease.

Wrapping Up
===========

We've expanded our bookmarking application to handle authentication and basic
authorization/access control scenarios. We've also added some nice UX
improvements by leveraging the FormHelper and ORM capabilities.

Thanks for taking the time to explore CakePHP. Next, you can complete the
:doc:`/tutorials-and-examples/blog/blog`, learn more about the
:doc:`/orm`, or you can peruse the :doc:`/topics`.
