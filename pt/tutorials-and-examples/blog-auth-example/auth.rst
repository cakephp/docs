Simple Authentication and Authorization Application
####################################################

Seguindo com nosso :doc:`/tutorials-and-examples/blog/blog` exemplo, imagine que
queremos fornececer acesso seguro as nossas urls, baseada em autenticação de usuário.
Nós também temos outro requisito, permitir que muitos que muitos autores possam
criar seus próprios posts, editar e deletar os post deles sem que afete o que os outros
autores fizeram em seus posts.

Criando a tabela de usuários
================================

Primeiro, vamos criar uma noava tabela no nosso database blog para armazenar os dados de usuários::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nós temos respeitados as convenções do CakePHP para nomear tabelas, mas nós também
aproveitamos outra convenção:  usando as colunas username e password em nossas
tabela users,o CakePHP será capaz de auto configurar as coisas quanto implementarmos
o mecanismos de login de nossos usuaŕaios.

A próxima etapa é criar o nosso model User, resposável pelas pesquisas, gravações e
e validações e dados dos usuários::

    <?php
    // app/Model/User.php
    class User extends AppModel {
        public $name = 'User';
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

Vamos criar também nosso UsersController, o conteúdo a seguir corresponde a classe UsersController
básica `cozida` usando o ferramana de geração e códigos presente no CakePHP::

    <?php
    // app/Controller/UsersController.php
    class UsersController extends AppController {


        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add', 'logout');
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
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('The user could not be saved. Please, try again.'));
                }
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
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('The user could not be saved. Please, try again.'));
                }
            } else {
                $this->request->data = $this->User->read(null, $id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            if (!$this->request->is('post')) {
                throw new MethodNotAllowedException();
            }
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Session->setFlash(__('User deleted'));
                $this->redirect(array('action'=>'index'));
            }
            $this->Session->setFlash(__('User was not deleted'));
            $this->redirect(array('action' => 'index'));
        }

Da mesma forma criamos as views para nosso posts no blog ou usando a ferramanta
de geração de código, nós implementamos as views. Para o proposito de nosso tutorial, iremos
mostrar somente o add.ctp::

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User');?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
        <?php
            echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit'));?>
    </div>

Autorização (login e logout)
================================

Nós agora estamos prontos para adicionar a camada de autorização. No CakePHP isso é feito
pela :php:class:`AuthComponent`, uma classe responsável por solicitar login para certas ações,
manipulando sign-in e sign-out, e também autorizando usuários logados acessarem actions as quais
possuem permissão.

Para adicionar esse componente em sua aplicação abra seu arquivo ``app/Controller/AppController.php``
e adicione as seguintes linhas::

    <?php
    // app/Controller/AppController.php
    class AppController extends Controller {
        //...
        
        public $components = array(
            'Session',
            'Auth' => array(
                'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
                'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home')
            )
        );

        function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

Aqui não há muito para configurar, como nós usamos convenções na tabela users.
Nós somente configuramos as urls que serão carregadas após as ações de login e logout actions,
em nosso caso são ``/posts/`` e ``/`` respectivamente.

O que fizemos na função ``beforeFilter`` foi dizer ao AuthComponent para não
solicitar um login para todas as  actions ``index`` e ``view`, em todos os controller. Nós queremos
querems que nossos visitantes possam ler qualquer post sem precisar se registrar no site.

Agora, nos precisamos autorizar que novos usuários possam se registrar, salvando username e password deles,
and more importantly hash their password so it is not stored as plain text in
our database. Let's tell the AuthComponent to let un-authenticated users to access
the users add function and the implement the login and logout action::

    <?php
    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('add'); // Letting users register themselves
    }

    public function login() {
        if ($this->Auth->login()) {
            $this->redirect($this->Auth->redirect());
        } else {
            $this->Session->setFlash(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

Password hashing is not done yet, open your ``app/Model/User.php`` model file
and add the following::

    <?php
    // app/Model/User.php
    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        
    // ...
    
    public function beforeSave() {
        if (isset($this->data[$this->alias]['password'])) {
            $this->data[$this->alias]['password'] = AuthComponent::password($this->data[$this->alias]['password']);
        }
        return true;
    }

    // ...

So, now every time a user is saved, the password is hashed using the default hashing
provided by the AuthComponent class. We're just missing a template view file for
the login function, here it is::

    <div class="users form">
    <?php echo $this->Session->flash('auth'); ?>
    <?php echo $this->Form->create('User');?>
        <fieldset>
            <legend><?php echo __('Please enter your username and password'); ?></legend>
        <?php
            echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login'));?>
    </div>

You can now register a new user by accessing the ``/users/add`` url and log-in with the
newly created credentials by going to ``/users/login`` url. Also try to access
any other url that was not explicitly allowed such as ``/posts/add``, you will see
that the application automatically redirects you to the login page.

And that's it! It looks too simple to be truth. Let's go back a bit to explain what
happened. The ``beforeFilter`` function is telling the AuthComponent to not require a
login for the ``add`` action in addition to the ``index`` and ``view`` actions that were
already allowed int the AppController's ``beforeFilter`` function.

The ``login`` action calls the ``$this->Auth->login()`` function in the AuthComponent,
and it works without any further config because we are following conventions as
mentioned earlier. That is, having a User model with a username and a password
column, and use a form posted to a controller with the user data. This function
returns whether the login was successful or not, and in the case it succeeds,
then we redirect the user to the configured redirection url that we used when
adding the AuthComponent to our application.

The logout works by just accessing the ``/users/logout`` url and will redirect
the user to the configured logoutUrl formerly described. This url is the result
of the ``AuthComponent::logout()`` function on success

Authorization (who's allowed to access what)
============================================

As stated before, we are converting this blog in a multi user authoring tool,
and in order to do this, we need to modify the posts table a bit to add the
reference to the User model::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

Also, a small change in the PostsController is required to store the currently
logged in user as a reference for the created post::

    <?php
    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            $this->request->data['Post']['user_id'] = $this->Auth->user('id'); //Added this line
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Your post has been saved.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

The ``user()`` function provided by the component returns any column from the
currently logged in user. We used this method to add the data into the request
info that is saved.

Let's secure our app to prevent some authors to edit or delete the others' posts.
Basic rules for our app are that admin users can access every url, while normal
users (the author role) can only access the permitted actions.
Open again the AppController class and add a few more options to the Auth config::

    <?php
    // app/Controller/AppController.php

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'authorize' => array('Controller') // Added this line
        )
    );

    public function isAuthorized($user) {
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true; //Admin can access every action
        }
        return false; // The rest don't
    }

We just created a very simple authorization mechanism. In this case the users
with role ``admin`` will be able to access any url in the site when logged in,
but the rest of them (i.e the role ``author``) can't do anything different from
not logged in users.

This is not exactly what we wanted, so we need to fix to supply more rules to
our ``isAuthorized()`` method. But instead of doing it in AppController, let's
delegate each controller to supply those extra rules. The rules we're going to
add to PostsController should allow authors to create posts but prevent the
edition of posts if the author does not match. Open the file ``PostsController.php``
and add the following content::

    <?php
    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        if (!parent::isAuthorized($user)) {
            if ($this->action === 'add') {
                // All registered users can add posts
                return true;
            }
            if (in_array($this->action, array('edit', 'delete'))) {
                $postId = $this->request->params['pass'][0];
                return $this->Post->isOwnedBy($postId, $user['id']);
            }
        }
        return false;
    }

We're now overriding the AppController's ``isAuthorized()`` call and internally
checking if the parent class is already authorizing the user. If he isn't,
then just allow him to access the add action, and conditionally access
edit and delete. A final thing is left to be implemented, to tell whether
the user is authorized to edit the post or not, we're calling a ``isOwnedBy()``
function in the Post model. It is in general a good practice to move as much
logic as possible into models. Let's then implement the function::

    <?php
    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) === $post;
    }


This concludes our simple authentication and authorization tutorial. For securing
the UsersController you can follow the same technique we did for PostsController,
you could also be more creative and code something more general in AppController based
on your own rules.

Should you need more control, we suggest you reading the complete Auth guide in the
:doc:`/core-libraries/components/authentication` section where you will find more
about configuring the component, creating custom Authorization classes, and much more.

Suggested Follow-up Reading
---------------------------

1. :doc:`/console-and-shells/code-generation-with-bake` Generating basic CRUD code
2. :doc:`/core-libraries/components/authentication`: User registration and login


.. meta::
    :title lang=en: Simple Authentication and Authorization Application
    :keywords lang=en: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
