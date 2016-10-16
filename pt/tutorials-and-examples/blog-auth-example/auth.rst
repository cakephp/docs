Tutorial - Criando um Blog - Autenticação e Autorização
#######################################################

Continuando com o exemplo de :doc:`/tutorials-and-examples/blog/blog`, imagine
que queríamos garantir o acesso a certas URLs, com base no usuário logado. Temos
também uma outra exigência: permitir que o nosso blog para tenha vários autores
que podem criar, editar e excluir seus próprios artigos, e bloquear para que
outros autores não façam alterações nos artigos que não lhes pertencem.

Criando todo o código relacionado ao Usuário
============================================

Primeiro, vamos criar uma nova tabela no banco de dados do blog para armazenar
dados de nossos usuários::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Respeitado as convenções do CakePHP para nomear tabelas, mas também aproveitando
de outras convenção: Usando as colunas ``username`` e ``password`` da tabela de
usuários, CakePHP será capaz de configurar automaticamente a maioria das coisas
para nós, na implementação do login do usuário.

O próximo passo é criar a nossa classe UsersTable, responsável por encontrar,
salvar e validar os dados do usuário::

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
                $user = $this->Users->patchEntity($user, $this->request->data());
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
usuário. Para o propósito deste tutorial, vamos mostrar apenas o add.ctp:

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
classe responsável por exigir o ``login`` para determinadas ações, a manipulação
de ``login`` e ``logout`` de usuário, e também permite as ações para que estão
autorizados.

Para adicionar este componente em sua aplicação abra o arquivos
**src/Controller/AppController.php** e adicione as seguintes linha::

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
e ``password``, e mais importante, o hash da senha para que ele não seja
armazenado como texto simples no nosso banco de dados. Vamos dizer ao
``AuthComponet`` para permitir que usuários deslogados acessem a função add e
execute as ações de ``login`` e ``logout``::

    // src/Controller/UsersController.php

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // Permitir aos usuários se registrarem e efetuar logout.
        // Você não deve adicionar a ação de "login" a lista de permissões.
        // Isto pode causar problemas com o funcionamento normal do AuthComponent.
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
            $this->Flash->error(__('Usuário ou senha ínvalido, tente novamente'));
        }
    }

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

O hashing da senha ainda não está feito, precisamos de uma classe a fim de
manipular sua geração. Crie o arquivo **src/Model/Entity/User.php**
e adicione a seguinte trecho::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Gera conjunto de todos os campos exceto o com a chave primária.
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

Agora, a senha criptografada usando a classe ``DefaultPasswordHasher``.
Está faltando apenas o arquivo para exibição da tela de login.
Abra o arquivo **src/Template/Users/login.ctp** e adicione as seguintes linhas:

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render('auth') ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Por favor informe seu usuário e senha') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

Agora você pode registrar um novo usuário, acessando a URL ``/users/add``
e faça login com o usuário recém-criado, indo para a URL ``/users/login``.
Além disso, tente acessar qualquer outro URL que não tenha sido explicitamente
permitido, como ``/articles/add``, você vai ver que o aplicativo redireciona
automaticamente para a página de login.

E é isso! Parece simples demais para ser verdade. Vamos voltar um pouco para
explicar o que aconteceu. A função ``beforeFilter()`` está falando para o
AuthComponent não solicitar um login para a ação ``add()`` em adição as ações
``index()`` e ``view()`` que foram prontamente autorizadas na função
``beforeFilter()`` do AppController.

A ação ``login()`` chama a função ``$this->Auth->identify()`` da AuthComponent,
que funciona sem qualquer outra configuração porque estamos seguindo convenções,
como mencionado anteriormente. Ou seja, ter uma tabela de usuários com um
``username`` e uma coluna de ``password``, e usamos um form para postar os dados
do usuário para o controller. Esta função retorna se o login foi bem sucedido ou
não, e caso ela retorne sucesso, então nós redirecionamos o usuário para a URL
que configuramos quando adicionamos o AuthComponent em nossa aplicação.

O logout funciona quando acessamos a URL ``/users/logout`` que irá redirecionar
o usuário para a url configurada em logoutUrl. Essa url é acionada quando a
função ``AuthComponent::logout()``.

Autorização (quem tem permissão para acessar o que)
===================================================

Como afirmado anteriormente, nós estamos convertendo esse blog em uma ferramenta
multi usuário de autoria, e para fazer isso, precisamos modificar a tabela de
artigos um pouco para adicionar a referência à tabela de Usuários::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Além disso, uma pequena mudança no ArticlesController é necessário para
armazenar o usuário conectado no momento como uma referência para o artigo
criado::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->data());
            // Adicione esta linha
            $article->user_id = $this->Auth->user('id');
            // Você também pode fazer o seguinte
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi salvo.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Não foi possível adicionar seu artigo.'));
        }
        $this->set('article', $article);
    }

A função ``user()`` fornecida pelo componente retorna qualquer coluna do usuário
logado no momento. Nós usamos esse metódo para adicionar a informação dentro de
request data para que ela seja salva.

Vamos garantir que nossa app evite que alguns autores editem ou apaguem posts de
outros. Uma regra básica para nossa aplicação é que usuários admin possam
acessar qualquer url, enquanto usuários normais (o papel author) podem somente
acessar as actions permitidas. Abra novamente a classe AppController e adicione
um pouco mais de opções para as configurações do Auth::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // Adicione está linha
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
        // Admin pode acessar todas as actions
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Bloqueia acesso por padrão
        return false;
    }

Acabamos de criar um mecanismo de autorização muito simples. Nesse caso os
usuários com papel ``admin`` poderão acessar qualquer url no site quando
estiverem logados, mas o restante dos usuários (author) não podem acessar
qualquer coisa diferente dos usuários não logados.

Isso não é exatamente o que nós queremos, por isso precisamos corrigir nosso
metódo ``isAuthorized()`` para fornecer mais regras. Mas ao invés de fazer
isso no AppController, vamos delegar a cada controller para suprir essas
regras extras. As regras que adicionaremos para o ``add`` de ArticlesController
deve permitir ao autores criarem os posts mas evitar a edição de posts que não
sejam deles. Abra o arquivo **src/Controller/ArticlesController.php** e adicione
o seguinte conteúdo::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // Todos os usuários registrados podem adicionar artigos
        if ($this->request->param('action') === 'add') {
            return true;
        }

        // Apenas o proprietário do artigo pode editar e excluí
        if (in_array($this->request->param('action'), ['edit', 'delete'])) {
            $articleId = (int)$this->request->param('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Estamos sobrescrevendo a chamada ``isAuthorized()``do AppController e
internamente verificando na classe pai se o usuário está autorizado. Caso não
esteja, então apenas permitem acessar a action ``add``, e condicionalmente
action ``edit`` e ``delete``. Uma última coisa não foi implementada. Para dizer
ou não se o usuário está autorizado a editar o artigo, nós estamos chamando uma
função ``isOwnedBy()`` na tabela artigos. Vamos, então, implementar essa
função::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

Isso conclui então nossa autorização simples e nosso tutorial de autorização.
Para garantir o UsersController você pode seguir as mesmas técnicas que usamos
para ArticlesController, você também pode ser mais criativo e codificar algumas
coisas mais gerais no AppController para suas próprias regras baseadas em
papéis.

Se precisar de mais controle, nós sugerimos que leia o guia completo do Auth
:doc:`/controllers/components/authentication` seção onde você encontrará mais
sobre a configuração do componente, criação de classes de Autorização
customizadas, e muito mais.

Sugerimos as seguintes leituras
-------------------------------

1. :doc:`/bake/usage` Generating basic CRUD code
2. :doc:`/controllers/components/authentication`: User registration and login


.. meta::
    :title lang=pt: Simple Authentication and Authorization Application
    :keywords lang=pt: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
