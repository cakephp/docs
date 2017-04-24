Simple Authentication and Authorization Application
###################################################

Following our :doc:`/tutorials-and-examples/blog/blog` example, imagine we wanted to
secure the access to certain URLs, based on the logged in
user. We also have another requirement, to allow our blog to have multiple authors
so each one of them can create their own posts, edit and delete them at will
disallowing other authors to make any changes on one's posts.

Creating all users' related code
================================

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
taking advantage of another convention: by using the username and password
columns in a users table, CakePHP will be able to auto configure most things for
us when implementing the user login.

Next step is to create our User model, responsible for finding, saving and
validating any user data::

    // app/Model/User.php
    App::uses('AppModel', 'Model');
    
    class User extends AppModel {
        public $validate = array(
            'username' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
                    'message' => 'A username is required'
                )
            ),
            'password' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
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
    }

Let's also create our UsersController, the following contents correspond to a
basic `baked` UsersController class using the code generation utilities bundled
with CakePHP::

    // app/Controller/UsersController.php
    App::uses('AppController', 'Controller');
    
    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

        public function index() {
            $this->User->recursive = 0;
            $this->set('users', $this->paginate());
        }

        public function view($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->read(null, $id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Session->setFlash(
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
                    $this->Session->setFlash(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Session->setFlash(
                    __('The user could not be saved. Please, try again.')
                );
            } else {
                $this->request->data = $this->User->read(null, $id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            $this->request->onlyAllow('post');

            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Session->setFlash(__('User deleted'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('User was not deleted'));
            return $this->redirect(array('action' => 'index'));
        }

    }

In the same way we created the views for our blog posts or by using the code
generation tool, we implement the views. For the purpose of this tutorial, we
will show just the add.ctp:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit')); ?>
    </div>

Authentication (login and logout)
=================================

We're now ready to add our authentication layer. In CakePHP this is handled
by the :php:class:`AuthComponent`, a class responsible for requiring login for certain
actions, handling user sign-in and sign-out, and also authorizing logged in
users to the actions they are allowed to reach.

To add this component to your application open your ``app/Controller/AppController.php``
file and add the following lines::

    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Session',
            'Auth' => array(
                'loginRedirect' => array(
                    'controller' => 'posts', 
                    'action' => 'index'
                ),
                'logoutRedirect' => array(
                    'controller' => 'pages', 
                    'action' => 'display', 
                    'home'
                ),
                'authenticate' => array(
                    'Form' => array(
                        'passwordHasher' => 'Blowfish'
                    )
                )
            )
        );

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

There is not much to configure, as we used the conventions for the users table.
We just set up the URLs that will be loaded after the login and logout actions is
performed, in our case to ``/posts/`` and ``/`` respectively.

What we did in the ``beforeFilter`` function was to tell the AuthComponent to not
require a login for all ``index`` and ``view`` actions, in every controller. We want
our visitors to be able to read and list the entries without registering in the
site.

Now, we need to be able to register new users, save their username and password,
and, more importantly, hash their password so it is not stored as plain text in
our database. Let's tell the AuthComponent to let un-authenticated users access
the users add function and implement the login and logout action::

    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        // Allow users to register and logout.
        $this->Auth->allow('add', 'logout');
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

Password hashing is not done yet, open your ``app/Model/User.php`` model file
and add the following::

    // app/Model/User.php
    
    App::uses('AppModel', 'Model');
    App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

    class User extends AppModel {

    // ...

    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data[$this->alias]['password'] = $passwordHasher->hash(
                $this->data[$this->alias]['password']
            );
        }
        return true;
    }

    // ...

.. note::

    The BlowfishPasswordHasher uses a stronger hashing algorithm (bcrypt) than
    SimplePasswordHasher (sha1) and provides per user salts. The
    SimplePasswordHasher will be removed as of CakePHP version 3.0

So, now every time a user is saved, the password is hashed using the
BlowfishPasswordHasher class.  We're just missing a template view file for the
login function. Open up your ``app/View/Users/login.ctp`` file and add the
following lines:

.. code-block:: php

    //app/View/Users/login.ctp

    <div class="users form">
    <?php echo $this->Session->flash('auth'); ?>
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend>
                <?php echo __('Please enter your username and password'); ?>
            </legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login')); ?>
    </div>

You can now register a new user by accessing the ``/users/add`` URL and log-in with the
newly created credentials by going to ``/users/login`` URL. Also try to access
any other URL that was not explicitly allowed such as ``/posts/add``, you will see
that the application automatically redirects you to the login page.

And that's it! It looks too simple to be truth. Let's go back a bit to explain what
happened. The ``beforeFilter`` function is telling the AuthComponent to not require a
login for the ``add`` action in addition to the ``index`` and ``view`` actions that were
already allowed in the AppController's ``beforeFilter`` function.

The ``login`` action calls the ``$this->Auth->login()`` function in the AuthComponent,
and it works without any further config because we are following conventions as
mentioned earlier. That is, having a User model with a username and a password
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
and in order to do this, we need to modify the posts table a bit to add the
reference to the User model::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

Also, a small change in the PostsController is required to store the currently
logged in user as a reference for the created post::

    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            //Added this line
            $this->request->data['Post']['user_id'] = $this->Auth->user('id'); 
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash(__('Your post has been saved.'));
                return $this->redirect(array('action' => 'index'));
            }
        }
    }

The ``user()`` function provided by the component returns any column from the
currently logged in user. We used this method to add the data into the request
info that is saved.

Let's secure our app to prevent some authors from editing or deleting the
others' posts. Basic rules for our app are that admin users can access every
URL, while normal users (the author role) can only access the permitted actions.
Open again the AppController class and add a few more options to the Auth
config::

    // app/Controller/AppController.php

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array(
                'controller' => 'pages', 
                'action' => 'display', 
                'home'
            ),
            'authorize' => array('Controller') // Added this line
        )
    );

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
add to PostsController should allow authors to create posts but prevent the
edition of posts if the author does not match. Open the file ``PostsController.php``
and add the following content::

    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        // All registered users can add posts
        if ($this->action === 'add') {
            return true;
        }

        // The owner of a post can edit and delete it
        if (in_array($this->action, array('edit', 'delete'))) {
            $postId = (int) $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

We're now overriding the AppController's ``isAuthorized()`` call and internally
checking if the parent class is already authorizing the user. If he isn't,
then just allow him to access the add action, and conditionally access
edit and delete. A final thing is left to be implemented, to tell whether
the user is authorized to edit the post or not, we're calling a ``isOwnedBy()``
function in the Post model. It is in general a good practice to move as much
logic as possible into models. Let's then implement the function::

    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) !== false;
    }


This concludes our simple authentication and authorization tutorial. For securing
the UsersController you can follow the same technique we did for PostsController.
You could also be more creative and code something more general in AppController based
on your own rules.

Should you need more control, we suggest you read the complete Auth guide in the
:doc:`/core-libraries/components/authentication` section where you will find more
about configuring the component, creating custom Authorization classes, and much more.

Suggested Follow-up Reading
---------------------------

1. :doc:`/console-and-shells/code-generation-with-bake` Generating basic CRUD code
2. :doc:`/core-libraries/components/authentication`: User registration and login


.. meta::
    :title lang=en: Simple Authentication and Authorization Application
    :keywords lang=en: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
