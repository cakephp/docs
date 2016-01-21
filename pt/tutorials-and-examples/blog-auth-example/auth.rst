Tutorial - Criando um Blog - Autenticação e Autorização
#######################################################

Continuando com o exemplo de :doc:`/tutorials-and-examples/blog/blog` , imagine que
queríamos garantir o acesso a certas URLs, com base no usuário logado. Temos também 
uma outra exigência: permitir que o nosso blog para tenha vários autores que podem 
criar, editar e excluir seus próprios artigos, e bloquear para que outros autores não
façam alterações nos artigos que não lhes pertencem.

Criando todo o código relacionado ao Usuário
============================================

Primeiro, vamos criar uma nova tabela no banco de dados do blog para armazenar dados de nossos usuários::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Respeitado as convenções do CakePHP para nomear tabelas, mas também aproveitando de
outras convenção: Usando as colunas ``username`` e ``password`` da tabela de usuários, 
CakePHP será capaz de configurar automaticamente a maioria das coisas para nós, na 
implementação do login do usuário.

O próximo passo é criar a nossa classe UsersTable, responsável por encontrar, salvar 
e validar os dados do usuário::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'Usuário é necessário')
                ->notEmpty('password', 'Senha é necessária')
                ->notEmpty('role', 'Função é necessária')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Por favor informe uma função válida'
                ]);
        }

    }

Vamos também criar o nosso UsersController. O conteúdo a seguir corresponde a
partes de uma classe UsersController básica gerado atráves do utilitário de
geração de código ``bake`` fornecido com CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

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
                    $this->Flash->success(__('O usuário foi salvo.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Não é possível adicionar o usuário.'));
            }
            $this->set('user', $user);
        }

    }

Da mesma maneira que criamos as ``views`` para os nossos artigos usando
a ferramenta de geração de código, podemos implementar as ``views`` do
usuário. Para o propósito deste tutorial, vamos mostrar apenas o add.ctp::

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

Autenticação (Login e Logout)
=============================

Agora estamos prontos para adicionar a nossa camada de autenticação. Em CakePHP
isso é tratado pelo :php:class:`Cake\\Controller\\Component\\AuthComponent`, uma
classe responsável por exigir o ``login`` para determinadas ações, a manipulação de
``login`` e ``logout`` de usuário, e também permite as ações para que estão autorizados.

Para adicionar este componente em sua aplicação abra o arquivos **src/Controller/AppController.php**
e adicione as seguintes linha::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

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

Não há muito para ser configurado, como usamos as convenções para a tabela
de usuários. Nós apenas configuramos as URLs que serão carregados após o
``login`` e ``logout``, estás ações são realizadas no nosso caso para os
``/articles/`` e ``/`` respectivamente.

O que fizemos na função ``beforeFilter()`` foi dizer ao ``AuthComponent`` para
não exigir ``login`` em todos ``index()`` e ``view()``, em cada controlador.
Queremos que os nossos visitantes sejam capaz de ler e listar as entradas sem
registrar-se no site.

Agora, precisamos ser capaz de registrar novos usuários, salvar seu ``username``
e ``password``, e mais importante, o hash da senha para que ele não seja armazenado
como texto simples no nosso banco de dados. Vamos dizer ao ``AuthComponet`` para
permitir que usuários deslogados acessem a função add e execute as ações de ``login`` e ``logout``::

    // src/Controller/UsersController.php

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
    }

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

Password hashing is not done yet, we need an Entity class for our User in order
to handle its own specific logic. Create the **src/Model/Entity/User.php** entity file
and add the following::

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

You can now register a new user by accessing the ``/users/add`` URL and log in with the
newly created credentials by going to ``/users/login`` URL. Also, try to access
any other URL that was not explicitly allowed such as ``/articles/add``, you will see
that the application automatically redirects you to the login page.

And that's it! It looks too simple to be true. Let's go back a bit to explain what
happened. The ``beforeFilter()`` function is telling the AuthComponent to not require a
login for the ``add()`` action in addition to the ``index()`` and ``view()`` actions
that were already allowed in the AppController's ``beforeFilter()`` function.

The ``login()`` action calls the ``$this->Auth->identify()`` function in the AuthComponent,
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

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->data);
            // Added this line
            $article->user_id = $this->Auth->user('id');
            // You could also do the following
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
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
        if ($this->request->action === 'add') {
            return true;
        }

        // The owner of an article can edit and delete it
        if (in_array($this->request->action, ['edit', 'delete'])) {
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
