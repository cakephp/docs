Blog Tutorial - Authentication and Authorization
################################################

Following our :doc:`/tutorials-and-examples/blog/blog` example, imagine we
wanted to secure access to certain URLs, based on the logged-in
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

<<<<<<< HEAD
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

=======
    // app/Model/User.php
    App::uses('AppModel', 'Model');

    class User extends AppModel {
        public $validate = array(
            'username' => array(
                'required' => array(
                    'rule' => 'notBlank',
                    'message' => 'A username is required'
                )
            ),
            'password' => array(
                'required' => array(
                    'rule' => 'notBlank',
                    'message' => 'A password is required'
                )
            ),
            'role' => array(
                'valid' => array(
                    'rule' => array('inList', array('admin', 'author')),
                    'message' => 'Please enter a valid role',
                    'allowEmpty' => false
                )
            )
        );
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
    }

Let's also create our UsersController. The following content corresponds to
parts of a basic baked UsersController class using the code generation utilities bundled
with CakePHP::

<<<<<<< HEAD
    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;
=======
    // app/Controller/UsersController.php
    App::uses('AppController', 'Controller');

    class UsersController extends AppController {
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

<<<<<<< HEAD
        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
=======
        public function view($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->findById($id));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
<<<<<<< HEAD
                // Prior to 3.4.0 $this->request->data() was used.
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
=======
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Flash->success(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(
                    __('The user could not be saved. Please, try again.')
                );
            }
        }

        public function edit($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->request->is('post') || $this->request->is('put')) {
                if ($this->User->save($this->request->data)) {
                    $this->Flash->success(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(
                    __('The user could not be saved. Please, try again.')
                );
            } else {
                $this->request->data = $this->User->findById($id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            // Prior to 2.5 use
            // $this->request->onlyAllow('post');

            $this->request->allowMethod('post');

            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Flash->success(__('User deleted'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('User was not deleted'));
            return $this->redirect(array('action' => 'index'));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }

    }

<<<<<<< HEAD
In the same way we created the views for our articles by using the code
generation tool, we can implement the user views. For the purpose of this
tutorial, we will show just the add.ctp:
=======
.. versionchanged:: 2.5

    Since 2.5, use ``CakeRequest::allowMethod()`` instead of
    ``CakeRequest::onlyAllow()`` (deprecated).

In the same way we created the views for our blog posts or by using the code
generation tool, we implement the views. For the purpose of this tutorial, we
will show just the add.ctp:
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Authentication (Login and Logout)
=================================

We're now ready to add our authentication layer. In CakePHP this is handled by
the :php:class:`Cake\\Controller\\Component\\AuthComponent`, a class responsible
for requiring login for certain actions, handling user login and logout, and
also authorizing logged-in users to the actions they are allowed to reach.

To add this component to your application open your
**src/Controller/AppController.php** file and add the following lines::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

<<<<<<< HEAD
        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
=======
        public $components = array(
            'Flash',
            'Auth' => array(
                'loginRedirect' => array(
                    'controller' => 'posts',
                    'action' => 'index'
                ),
                'logoutRedirect' => array(
                    'controller' => 'pages',
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

There is not much to configure, as we used the conventions for the users table.
We just set up the URLs that will be loaded after the login and logout actions
is performed, in our case to ``/articles/`` and ``/`` respectively.

What we did in the ``beforeFilter()`` function was to tell the AuthComponent to
not require a login for all ``index()`` and ``view()`` actions, in every
controller. We want our visitors to be able to read and list the entries without
registering in the site.

Now, we need to be able to register new users, save their username and password,
and more importantly, hash their password so it is not stored as plain text in
our database. Let's tell the AuthComponent to let un-authenticated users access
the users add function and implement the login and logout action::

    // src/Controller/UsersController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

<<<<<<< HEAD
    class UsersController extends AppController
    {
        // Other methods..

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            // Allow users to register and logout.
            // You should not add the "login" action to allow list. Doing so would
            // cause problems with normal functioning of AuthComponent.
            $this->Auth->allow(['add', 'logout']);
        }

        public function login()
        {
            if ($this->request->is('post')) {
                $user = $this->Auth->identify();
                if ($user) {
                    $this->Auth->setUser($user);
                    return $this->redirect($this->Auth->redirectUrl());
                }
                $this->Flash->error(__('Invalid username or password, try again'));
            }
=======
    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error(__('Invalid username or password, try again'));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }

        public function logout()
        {
            return $this->redirect($this->Auth->logout());
        }
    }

Password hashing is not done yet, we need an Entity class for our User in order
to handle its own specific logic. Create the **src/Model/Entity/User.php**
entity file and add the following::

<<<<<<< HEAD
    // src/Model/Entity/User.php
    namespace App\Model\Entity;
=======
    // app/Model/User.php

    App::uses('AppModel', 'Model');
    App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

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
using the ``DefaultPasswordHasher`` class.  We're just missing a template view
file for the login function. Open up your **src/Template/Users/login.ctp** file
and add the following lines:

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
<<<<<<< HEAD
    <?= $this->Flash->render() ?>
    <?= $this->Form->create() ?>
=======
    <?php echo $this->Flash->render('auth'); ?>
    <?php echo $this->Form->create('User'); ?>
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
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

The logout works by just accessing the ``/users/logout`` URL and will redirect
the user to the configured logoutUrl formerly described. This URL is the result
of the ``AuthComponent::logout()`` function on success.

Authorization (who's allowed to access what)
============================================

As stated before, we are converting this blog into a multi-user authoring tool,
and in order to do this, we need to modify the articles table a bit to add the
reference to the Users table::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Also, a small change in the ArticlesController is required to store the
currently logged in user as a reference for the created article::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
<<<<<<< HEAD
            // Prior to 3.4.0 $this->request->data() was used.
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // Added this line
            $article->user_id = $this->Auth->user('id');
            // You could also do the following
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
=======
            //Added this line
            $this->request->data['Post']['user_id'] = $this->Auth->user('id');
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been saved.'));
                return $this->redirect(array('action' => 'index'));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);

        // Just added the categories list to be able to choose
        // one category for an article
        $categories = $this->Articles->Categories->find('treeList');
        $this->set(compact('categories'));
    }

The ``user()`` function provided by the component returns any column from the
currently logged in user. We used this method to add the data into the request
info that is saved.

Let's secure our app to prevent some authors from editing or deleting the
others' articles. Basic rules for our app are that admin users can access every
URL, while normal users (the author role) can only access the permitted actions.
Again, open the AppController class and add a few more options to the Auth
config::

<<<<<<< HEAD
    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // Added this line
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
    }
=======
    // app/Controller/AppController.php

    public $components = array(
        'Flash',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array(
                'controller' => 'pages',
                'action' => 'display',
                'home'
            ),
            'authenticate' => array(
                'Form' => array(
                    'passwordHasher' => 'Blowfish'
                )
            ),
            'authorize' => array('Controller') // Added this line
        )
    );
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    public function isAuthorized($user)
    {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

We just created a simple authorization mechanism. Users with the ``admin``
role will be able to access any URL in the site when logged-in. All other
users -- those with the ``author`` role -- will have the same access as
users who aren't logged-in.

This is not exactly what we want. We need to supply more rules to our
``isAuthorized()`` method. However instead of doing it in AppController,
we'll delegate supplying those extra rules to each individual controller.
The rules we're going to add to ArticlesController should permit authors
to create articles but prevent authors from editing articles they do not
own.  Add the following content to your **ArticlesController.php**::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // All registered users can add articles
        // Prior to 3.4.0 $this->request->param('action') was used.
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // The owner of an article can edit and delete it
        // Prior to 3.4.0 $this->request->param('action') was used.
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            // Prior to 3.4.0 $this->request->params('pass.0')
            $articleId = (int)$this->request->getParam('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

We're now overriding the AppController's ``isAuthorized()`` call and internally
checking if the parent class is already authorizing the user. If he isn't,
then just allow him to access the add action, and conditionally access
edit and delete. One final thing has not been implemented. To tell whether
or not the user is authorized to edit the article, we're calling a ``isOwnedBy()``
function in the Articles table. Let's then implement that function::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

This concludes our simple authentication and authorization tutorial. For securing
the UsersController you can follow the same technique we did for ArticlesController.
You could also be more creative and code something more general in AppController based
on your own rules.

Should you need more control, we suggest you read the complete Auth guide in the
:doc:`/controllers/components/authentication` section where you will find more
about configuring the component, creating custom Authorization classes, and much more.

Suggested Follow-up Reading
---------------------------

#. :doc:`/bake/usage` Generating basic CRUD code
#. :doc:`/controllers/components/authentication`: User registration and login

.. meta::
    :title lang=en: Simple Authentication and Authorization Application
    :keywords lang=en: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
