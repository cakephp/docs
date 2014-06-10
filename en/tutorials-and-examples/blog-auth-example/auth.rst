Simple Authentication and Authorization Application
###################################################

Following our :doc:`/tutorials-and-examples/blog/blog` example, imagine we wanted to
secure access to certain URLs, based on the logged-in
user. We also have another requirement: to allow our blog to have multiple authors
who can create, edit, and delete their own articles while
disallowing other authors to make any changes to articles they do not own.

Creating All User-Related Code
==============================

First, let's create a new table in our blog database to hold our users' data::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

We have adhered to the CakePHP conventions in naming tables, but we're also
taking advantage of another convention: By using the username and password
columns in a users table, CakePHP will be able to auto-configure most things for
us when implementing the user login.

Next step is to create our Users table, responsible for finding, saving and
validating any user data::

    // App/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class UsersTable extends Table {

        public function validationDefault(Validator $validator) {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A password is required')
                ->add('role', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

Let's also create our UsersController. The following content corresponds to
parts of a basic baked UsersController class using the code generation utilities bundled
with CakePHP::

    // App/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Error\NotFoundException;

    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

         public function index() {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid user'));
            }

            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add() {
            $user = $this->Users->newEntity($this->request->data);
            if ($this->request->is('post')) {
                if ($this->Users->save($user)) {
                    $this->Session->setFlash(__('The user has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Session->setFlash(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }

    }

In the same way we created the views for our articles or by using the code
generation tool, we can implement the user views. For the purpose of this
tutorial, we will show just the add.ctp:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
            <?= $this->Form->input('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
        ?>
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

To add this component to your application open your ``App/Controller/AppController.php``
file and add the following lines::

    // App/Controller/AppController.php

    namespace App\Controller;

    class AppController extends Controller {
        //...

        public $components = [
            'Session',
            'Auth' => [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]
        ];

        public function beforeFilter() {
            $this->Auth->allow(['index', 'view']);
        }
        //...
    }

There is not much to configure, as we used the conventions for the users table.
We just set up the URLs that will be loaded after the login and logout actions is
performed, in our case to ``/articles/`` and ``/`` respectively.

What we did in the ``beforeFilter`` function was to tell the AuthComponent to not
require a login for all ``index`` and ``view`` actions, in every controller. We want
our visitors to be able to read and list the entries without registering in the
site.

Now, we need to be able to register new users, save their username and password,
and more importantly, hash their password so it is not stored as plain text in
our database. Let's tell the AuthComponent to let un-authenticated users access
the users add function and implement the login and logout action::

    // App/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        // Allow users to register and logout.
        $this->Auth->allow(['add', 'logout']);
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            }
            $this->Session->setFlash(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        return $this->redirect($this->Auth->logout());
    }

Password hashing is not done yet, we need an Entity class for our User in order
to handle its own specific logic. Create the ``App/Model/Entity/User.php`` entity file
and add the following::

    // App/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Auth\SimplePasswordHasher;

    class User extends Entity {

        // ...

        public function setPassword($password) {
            return (new SimplePasswordHasher)->hash($password);
        }

        // ...
    }

Now every time the password property is assigned to the user it will be hashed
using the ``SimplePasswordHasher`` class.  We're just missing a template view
file for the login function. Open up your ``App/Template/Users/login.ctp`` file
and add the following lines:

.. code-block:: php

    //app/View/Users/login.ctp

    <div class="users form">
    <?= $this->Session->flash('auth') ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

You can now register a new user by accessing the ``/users/add`` URL and log in with the
newly created credentials by going to ``/users/login`` URL. Also, try to access
any other URL that was not explicitly allowed such as ``/articles/add``, you will see
that the application automatically redirects you to the login page.

And that's it! It looks too simple to be true. Let's go back a bit to explain what
happened. The ``beforeFilter`` function is telling the AuthComponent to not require a
login for the ``add`` action in addition to the ``index`` and ``view`` actions that were
already allowed in the AppController's ``beforeFilter`` function.

The ``login`` action calls the ``$this->Auth->login()`` function in the AuthComponent,
and it works without any further config because we are following conventions as
mentioned earlier. That is, having a Users table with a username and a password
column, and use a form posted to a controller with the user data. This function
returns whether the login was successful or not, and in the case it succeeds,
then we redirect the user to the configured redirection URL that we used when
adding the AuthComponent to our application.

The logout works by just accessing the ``/users/logout`` URL and will redirect
the user to the configured logoutUrl formerly described. This URL is the result
of the ``AuthComponent::logout()`` function on success.

Authorization (who's allowed to access what)
============================================

As stated before, we are converting this blog into a multi-user authoring tool,
and in order to do this, we need to modify the articles table a bit to add the
reference to the Users table::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Also, a small change in the ArticlesController is required to store the currently
logged in user as a reference for the created article::

    // App/Controller/ArticlesController.php
    public function add() {
        $article = $this->Articles->newEntity($this->request->data);
        if ($this->request->is('post')) {
            // Added this line
            $article->user_id = $this->Auth->user('id');
            if ($this->Articles->save($article)) {
                $this->Session->setFlash(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Session->setFlash(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

The ``user()`` function provided by the component returns any column from the
currently logged in user. We used this method to add the data into the request
info that is saved.

Let's secure our app to prevent some authors from editing or deleting the
others' articles. Basic rules for our app are that admin users can access every
URL, while normal users (the author role) can only access the permitted actions.
Again, open the AppController class and add a few more options to the Auth
config::

    // App/Controller/AppController.php

    public $components = [
        'Session',
        'Auth' => [
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ],
            'authorize' => ['Controller'] // Added this line
        ]
    ];

    public function isAuthorized($user) {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

We just created a very simple authorization mechanism. In this case the users
with role ``admin`` will be able to access any URL in the site when logged in,
but the rest of them (i.e the role ``author``) can't do anything different from
not logged in users.

This is not exactly what we wanted, so we need to supply more rules to
our ``isAuthorized()`` method. But instead of doing it in AppController, let's
delegate each controller to supply those extra rules. The rules we're going to
add to ArticlesController should allow authors to create articles but prevent the
edition of articles if the author does not match. Open the file ``ArticlesController.php``
and add the following content::

    // App/Controller/ArticlesController.php

    public function isAuthorized($user) {
        // All registered users can add articles
        if ($this->action === 'add') {
            return true;
        }

        // The owner of an article can edit and delete it
        if (in_array($this->action, ['edit', 'delete'])) {
            $articleId = (int)$this->request->params['pass'][0];
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

    // App/Model/Repository/ArticlesTable.php

    public function isOwnedBy($articleId, $userId) {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

This concludes our simple authentication and authorization tutorial. For securing
the UsersController you can follow the same technique we did for ArticlesController.
You could also be more creative and code something more general in AppController based
on your own rules.

Should you need more control, we suggest you read the complete Auth guide in the
:doc:`/core-libraries/components/authentication` section where you will find more
about configuring the component, creating custom Authorization classes, and much more.

Suggested Follow-up Reading
---------------------------

#. :doc:`/console-and-shells/code-generation-with-bake` Generating basic CRUD code
#. :doc:`/core-libraries/components/authentication`: User registration and login

.. meta::
    :title lang=en: Simple Authentication and Authorization Application
    :keywords lang=en: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
