Autenticação simples e Autorização da Aplicação
###############################################

Seguindo com nosso exemplo do :doc:`/tutorials-and-examples/blog/blog`, imagine que
queremos fornececer acesso seguro às nossas urls, baseada em autenticação de usuário.
Nós também temos outro requisito, permitir que muitos autores possam criar seus próprios
posts, editar e deletar os post deles sem que afete o que os outros autores fizeram em seus posts.

Criando a tabela de usuários
============================

Primeiro, vamos criar uma nova tabela na nossa base de dados do blog para armazenar os dados de usuários::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nós respeitamos as convenções do CakePHP para nomear tabelas, mas também
aproveitamos outra convenção:  usando as colunas username e password em nossa
tabela users, o CakePHP será capaz de auto configurar as coisas quando implementarmos
os mecanismos de login de nossos usuários.

A próxima etapa é criar o nosso model User, responsável pelas pesquisas, gravações e
validações de dados dos usuários::

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

Vamos criar também nosso UsersController, o conteúdo a seguir corresponde à classe UsersController
básica `cozida` usando a ferramenta de geração de códigos presente no CakePHP::

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
            if (!$this->User->exists($id)) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->findById($id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Flash->success(__('The user has been saved'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Flash->error(__('The user could not be saved. Please, try again.'));
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
                    $this->Flash->success(__('The user has been saved'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Flash->error(__('The user could not be saved. Please, try again.'));
                }
            } else {
                $this->request->data = $this->User->findById($id);
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
                $this->Flash->success(__('User deleted'));
                $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('User was not deleted'));
            $this->redirect(array('action' => 'index'));
        }

Da mesma forma criamos as views para nossos posts no blog ou usando a ferramanta
de geração de código, nós implementamos as views. Para o propósito de nosso tutorial, iremos
mostrar somente o add.ctp:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User');?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit'));?>
    </div>

Autorização (login e logout)
============================

Nós agora estamos prontos para adicionar a camada de autorização. No CakePHP isso é feito
pela :php:class:`AuthComponent`, uma classe responsável por solicitar login para certas ações,
manipulando sign-in e sign-out, e também autorizando usuários logados a acessarem actions as quais
possuem permissão.

Para adicionar esse componente em sua aplicação abra seu arquivo ``app/Controller/AppController.php``
e adicione as seguintes linhas::

    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Flash',
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
Nós somente configuramos as urls que serão carregadas após as ações de login e logout,
em nosso caso são ``/posts/`` e ``/`` respectivamente.

O que fizemos na função ``beforeFilter`` foi dizer ao AuthComponent para não
solicitar um login para todas as  actions ``index`` e ``view``, em todos os controller. Nós queremos
que nossos visitantes possam ler qualquer post sem precisar se registrar no site.

Agora, nós precisamos autorizar que novos usuários possam se registrar, salvando o nome de usuário e a senha deles,
e o mais importante encriptar a senha pra que ela não seja armazenada como texto plano em nosso banco de dados.
Vamos dizer ao AuthComponet para permitir que usuários deslogados acessem a função
add e implementar a ação de login e logout::

    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('add'); // Permitindo que os usuários se registrem
    }

    public function login() {
        if ($this->Auth->login()) {
            $this->redirect($this->Auth->redirect());
        } else {
            $this->Flash->error(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

Hash da senha não foi feito ainda, abra o seu arquivo de model ``app/Model/User.php``
e adicione o seguinte::

    // app/Model/User.php
    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {

    // ...

    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $this->data[$this->alias]['password'] = AuthComponent::password($this->data[$this->alias]['password']);
        }
        return true;
    }

    // ...

Então, agora toda vez que um usuário for salvo, a senha será encriptada usando o hashing padrão disponibilizado pela
classe AuthComponent. Está faltando somente um arquivo view para a função de login, Aqui está ele:

.. code-block:: php

    <div class="users form">
    <?php echo $this->Flash->render('auth'); ?>
    <?php echo $this->Form->create('User');?>
        <fieldset>
            <legend><?php echo __('Please enter your username and password'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login'));?>
    </div>

Você pode registrar um novo usuário acessando a url ``/users/add`` e autenticar com
as credenciais do usuário recém criado indo para a url ``/users/login``. Tente também
acessar qualquer outra url sem que a permisão tenha sido explicitada, como em ``/posts/add``,
você verá que a aplicação irá redirecioná-lo automaticamente para a página de login.

E é isso! Parece simples demais para ser verdade. Vamos voltar um pouco para explicar o que
aconteceu. A função ``beforeFilter``  está falando para o AuthComponent não solicitar um
login para a ação ``add`` em adição as ações ``index`` e ``view`` que foram
prontamente autorizadas na função ``beforeFilter`` do AppController.

A ação de ``login`` chama a função ``$this->Auth->login()`` do AuthComponent,
e ele funciona sem qualquer configuração adicional porque seguimos as convenções
mencionadas anteriormente. Isso é, temos um model User com uma coluna username e uma password,
e usamos um form para postar os dados do usuário para o controller. Essa função
retorna se o login foi bem sucedido ou não, e caso ela retorne sucesso, então nós redirecionamos
o usuário para a url que configuramos quando adicionamos o AuthComponent em nossa aplicação.

O logout funciona exatamente quando acessamos a url ``/users/logout`` e irá redirecionar
o usuário para a url configurada em logoutUrl anteriormente descrita. Essa url é acionada quando
a função ``AuthComponent::logout()`` obtém sucesso.

Autorização (quem tem permissão de acessar o que)
=================================================

Como afirmado anteriormente, nós estamos convertendo esse blog em uma ferramenta
multi usuário de autoria, e para fazer isso, nós precisamos modificar um pouco a tabela posts para adicionar
a referência ao model User::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

Também, é necessária uma pequena mudança no PostsController para guardar a referência do usuário logado para o
post criado::

    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            $this->request->data['Post']['user_id'] = $this->Auth->user('id'); // Adicionada essa linha
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success('Your post has been saved.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

A função ``user()`` fornecida pelo component retorna qualquer coluna do usuário logado no
momento. Nós usamos esse metódo para adicionar a informação dentro de request data para que
ela seja salva.

Vamos garantir que nossa app evite que alguns autores editem ou apaguem posts de outros.
Uma regra básica para nossa aplicação é que usuários admin possam acessar qualquer url, enquanto usuários normais
(o papel author) podem somente acessar as actions permitidas.
Abra novamente a classe AppController e adicione um pouco mais de opções para as configurações do Auth::

    // app/Controller/AppController.php

    public $components = array(
        'Flash',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'authorize' => array('Controller') // Adicionamos essa linha
        )
    );

    public function isAuthorized($user) {
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true; // Admin pode acessar todas actions
        }
        return false; // Os outros usuários não podem
    }

Nós acabamos de criar um mecanismo de autorização muito simples. Nesse caso os usuários
com papel ``admin`` poderão acessar qualquer url  no site quando estiverem logados,
mas o restante dos usuários (i.e o papel ``author``) não podem acessar qualquer coisa diferente
dos usuários não logados.

Isso não é exatamente o que nós queremos, por isso precisamos corrigir nosso metódo ``isAuthorized()``
para fornecer mais regras. Mas ao invés de fazer isso no AppController, vamos
delegar a cada controller para suprir essas regras extras. As regras que adicionaremos para o
add de PostsController deve permitir ao autores criarem os posts mas evitar a
edição de posts que não sejam deles. Abra o arquivo ``PostsController.php``
e adicione o seguinte conteúdo::

    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        if (parent::isAuthorized($user)) {
            if ($this->action === 'add') {
                // Todos os usuários registrados podem criar posts
                return true;
            }
            if (in_array($this->action, array('edit', 'delete'))) {
                $postId = (int) $this->request->params['pass'][0];
                return $this->Post->isOwnedBy($postId, $user['id']);
            }
        }
        return false;
    }

Nós estamos sobreescrevendo a chamada do ``isAuthorized()`` do AppController e internamente
verificando na classe pai se o usuário está autorizado. Caso ele não esteja,
permitiremos acesso à ação add, e condicionamente acesso às ações
edit e delete. A última coisa que falta implementar, é dizer se usuário é
autorizado a editar o post ou não, nós estamos chamando a função ``isOwnedBy()``
no model Post. Mover lógica para dentro dos models normalmente é uma boa prática. Vamos
então implementar essa função::

    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) === $post;
    }


Isso conclui então nossa autorização simples e nosso tutorial de autorização. Para garantir
o UsersController você pode seguir as mesmas técnicas que usamos para PostsController,
você também pode ser mais criativo e codificar algumas coisas mais gerais no AppController
para suas próprias regras baseadas em papéis.

Se precisar de mais controle, nós sugerimos que leia o guia completo do Auth
:doc:`/core-libraries/components/authentication` seção onde você encontrará mais
sobre a configuração do componente, criação de classes de Autorização customizadas, e muito mais.

Sugerimos as seguintes leituras
-------------------------------

1. :doc:`/console-shells-and-tasks/code-generation-with-bake` Generating basic CRUD code
2. :doc:`/core-libraries/components/authentication`: User registration and login


.. meta::
    :title lang=pt: Simple Authentication and Authorization Application
    :keywords lang=pt: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
