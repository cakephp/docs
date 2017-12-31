Tutorial - Criando um Bookmarker - Parte 2
##########################################

Depois de terminar a :doc:`primeira parte deste tutorial
</tutorials-and-examples/bookmarks/intro>`, você deve ter uma
aplicação muito básica. Neste capítulo iremos adicionar autenticação e
restringir as bookmarks para que cada usuário possa ver/modificar somente
aquelas que possuam.

Adicionando login
=================

No CakePHP, a autenticação é feita por :doc:`/controllers/components`. Os
Components podem ser considerados como formas de criar pedaços reutilizáveis
de código relacionado a controllers com uma característica específica ou
conceito. Os components também podem ligar-se ao evento do ciclo de vida do
controller e interagir com a sua aplicação. Para começar, vamos
adicionar o AuthComponent a nossa aplicação. Nós vamos querer muito que
cada método exija autenticação, por isso vamos acrescentar o
:doc:`AuthComponent</controllers/components/authentication>` em nosso
AppController::

    // Em src/Controller/AppController.php
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
                ]
            ]);

            // Permite a ação display, assim nosso pages controller
            // continua a funcionar.
            $this->Auth->allow(['display']);
        }
    }

Acabamos de dizer ao CakePHP que queremos carregar os components ``Flash`` e
``Auth``. Além disso, temos a configuração personalizada do AuthComponent,
assim a nossa tabela users pode usar ``email`` como username. Agora, se você for
a qualquer URL, você vai ser chutado para ``/users/login``, que irá
mostrar uma página de erro já que não escrevemos o código ainda.
Então, vamos criar a ação de login::

    // Em src/Controller/UsersController.php

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

E em **src/Template/Users/login.ctp** adicione o seguinte::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->input('email') ?>
    <?= $this->Form->input('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

Agora que temos um simples formulário de login, devemos ser capazes de efetuar
login com um dos users que tenham senha criptografada.

.. note::

    Se nenhum de seus users tem senha criptografada, comente a linha
    ``loadComponent('Auth')``. Então vá e edite o user, salvando uma nova
    senha para ele.

Agora você deve ser capaz de entrar. Se não, certifique-se que você está
usando um user que tenha senha criptografada.

Adicionando logout
==================

Agora que as pessoas podem efetuar o login, você provavelmente vai querer
fornecer uma maneira de encerrar a sessão também. Mais uma vez, no
``UsersController``, adicione o seguinte código::

    public function logout()
    {
        $this->Flash->success('You are now logged out.');
        return $this->redirect($this->Auth->logout());
    }

Agora você pode visitar ``/users/logout`` para sair e ser enviado à
página de login.

Ativando inscrições
===================

Se você não estiver logado e tentar visitar / usuários / adicionar você vai
ser expulso para a página de login. Devemos corrigir isso se
quisermos que as pessoas se inscrevam em nossa aplicação. No
UsersController adicione o seguinte::

    public function beforeFilter(\Cake\Event\Event $event)
    {
        $this->Auth->allow(['add']);
    }

O texto acima diz ao ``AuthComponent`` que a ação ``add`` não requer
autenticação ou autorização. Você pode querer dedicar algum tempo para limpar a
``/users/add`` e  remover os links enganosos, ou continuar para a próxima
seção. Nós não estaremos construindo a edição do usuário, visualização ou
listagem neste tutorial, então eles não vão funcionar, já que o
``AuthComponent`` vai negar-lhe acesso a essas ações do controller.

Restringindo acesso
===================

Agora que os usuários podem conectar-se, nós vamos querer limitar os
bookmarks que podem ver para aqueles que fizeram. Nós vamos fazer isso
usando um adaptador de 'autorização'. Sendo os nossos requisitos
bastante simples, podemos escrever um código em nossa
``BookmarksController``. Mas antes de fazer isso, vamos querer dizer ao
AuthComponent como nossa aplicação vai autorizar ações. Em seu ``AppController``
adicione o seguinte::

    public function isAuthorized($user)
    {
        return false;
    }

Além disso, adicione o seguinte à configuração para ``Auth`` em seu
``AppController``::

    'authorize' => 'Controller',

Seu método ``initialize`` agora deve parecer com::

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

            // Permite a ação display, assim nosso pages controller
            // continua a funcionar.
            $this->Auth->allow(['display']);
        }

Vamos usar como padrão, negação do acesso, e de forma incremental conceder
acesso onde faça sentido. Primeiro, vamos adicionar a lógica de autorização
para os bookmarks. Em seu ``BookmarksController`` adicione o seguinte::

    public function isAuthorized($user)
    {
        $action = $this->request->params['action'];

        // As ações add e index são permitidas sempre.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // Todas as outras ações requerem um id.
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // Checa se o bookmark pertence ao user atual.
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }

Agora, se você tentar visualizar, editar ou excluir um bookmark que não
pertença a você, você deve ser redirecionado para a página de onde veio. No
entanto, não há nenhuma mensagem de erro sendo exibida, então vamos
corrigir isso a seguir::

    // In src/Template/Layout/default.ctp
    // Under the existing flash message.
    <?= $this->Flash->render('auth') ?>

Agora você deve ver as mensagens de erro de autorização.

Corrigindo a view de listagem e formulários
===========================================

Enquanto view e delete estão trabalhando, edit, add e index tem
alguns problemas:

#. Ao adicionar um bookmark, você pode escolher o user.
#. Ao editar um bookmark, você pode escolher o user.
#. A página de listagem mostra os bookmarks de outros users.

Vamos enfrentar o formulário de adição em primeiro lugar. Para começar
remova o ``input('user_id')`` a partir de **src/Template/Bookmarks/add.ctp**.
Com isso removido, nós também vamos atualizar o método add::

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
    }

Ao definir a propriedade da entidade com os dados da sessão, nós removemos
qualquer possibilidade do user modificar de que outro user um bookmark
seja. Nós vamos fazer o mesmo para o formulário edit e action edit. Sua
ação edit deve ficar assim::

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
    }

View de listagem
----------------

Agora, nós precisamos apenas exibir bookmarks para o user logado.
Nós podemos fazer isso ao atualizar a chamada para ``paginate()``. Altere sua
ação index::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
    }

Nós também devemos atualizar a action ``tags()`` e o método localizador relacionado,
mas vamos deixar isso como um exercício para que você conclua por sí.

Melhorando a experiência com as tags
====================================

Agora, adicionar novas tags é um processo difícil, pois o ``TagsController``
proíbe todos os acessos. Em vez de permitir o acesso, podemos melhorar a
interface do usuário para selecionar tags usando um campo de texto separado por
vírgulas. Isso permitirá dar uma melhor experiência para os nossos
usuários, e usar mais alguns grandes recursos no ORM.

Adicionando um campo computado
------------------------------

Porque nós queremos uma maneira simples de acessar as tags formatados
para uma entidade, podemos adicionar um campo virtual/computado para a
entidade. Em **src/Model/Entity/Bookmark.php** adicione o seguinte::

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

Isso vai nos deixar acessar a propriedade computada ``$bookmark->tag_string``.
Vamos usar essa propriedade em inputs mais tarde. Lembre-se de adicionar a
propriedade ``tag_string`` a lista ``_accessible`` em sua entidade.

Em **src/Model/Entity/Bookmark.php** adicione o ``tag_string`` ao
``_accessible`` desta forma::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];

Atualizando as views
--------------------

Com a entidade atualizado, podemos adicionar uma nova entrada para as nossas
tags. Nas views add e edit, substitua ``tags._ids`` pelo seguinte::

    <?= $this->Form->input('tag_string', ['type' => 'text']) ?>

Persistindo a string tag
------------------------

Agora que podemos ver as tags como uma string existente, vamos querer salvar
os dados também. Por marcar o ``tag_string`` como acessível, o ORM irá
copiar os dados do pedido em nossa entidade. Podemos usar um método
``beforeSave`` para analisar a cadeia tag e encontrar/construir as
entidades relacionadas. Adicione o seguinte em
**src/Model/Table/BookmarksTable.php**::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        $new = array_unique(array_map('trim', explode(',', $tagString)));
        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $new]);

        // Remove tags existentes da lista de novas tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $new);
            if ($index !== false) {
                unset($new[$index]);
            }
        }
        // Adiciona tags existentes.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Adiciona novas tags.
        foreach ($new as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

Embora esse código seja um pouco mais complicado do que o que temos feito até
agora, ele ajuda a mostrar o quão poderosa a ORM do CakePHP é. Você pode
facilmente manipular resultados da consulta usando os métodos de
:doc:`/core-libraries/collections`, e lidar com situações em que você está
criando entidades sob demanda com facilidade.

Terminando
==========

Nós expandimos nossa aplicação bookmarker para lidar com situações de
autenticação e controle de autorização/acesso básico. Nós também adicionamos
algumas melhorias agradáveis à UX, aproveitando os recursos FormHelper e ORM.

Obrigado por dispor do seu tempo para explorar o CakePHP. Em seguida, você pode
saber mais sobre o :doc:`/orm`, ou você pode ler os :doc:`/topics`.
